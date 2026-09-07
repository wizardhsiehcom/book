"""Offline teaching fixture: no API calls, credentials, or external side effects."""

import json
from copy import deepcopy


TICKETS = {
    "T-041": {"owner_id": "U-63", "change_allowed": True},
    "T-042": {"owner_id": "U-63", "change_allowed": False},
}


def execute(call):
    """Explicit allowlist; errors are distinguishable from empty query results."""
    if call["name"] != "lookup_ticket_by_id":
        payload = {"errorCategory": "validation", "isRetryable": False,
                   "message": "unknown_tool"}
        failed = True
    elif not isinstance(call.get("input", {}).get("ticket_id"), str):
        payload = {"errorCategory": "validation", "isRetryable": False,
                   "message": "ticket_id must be a string"}
        failed = True
    else:
        ticket_id = call["input"]["ticket_id"]
        ticket = TICKETS.get(ticket_id)
        payload = {"found": ticket is not None, "ticket_id": ticket_id,
                   "ticket": ticket}
        failed = False
    return {"type": "tool_result", "tool_use_id": call["id"],
            "content": json.dumps(payload), "is_error": failed}


def run_loop(model, max_rounds=4):
    """A deliberately small client-tool loop, not an Anthropic SDK wrapper."""
    history = [{"role": "user", "content": "Check my two tickets."}]
    for _ in range(max_rounds):
        response = model(deepcopy(history))
        content = response["content"]
        history.append({"role": "assistant", "content": deepcopy(content)})
        reason = response["stop_reason"]
        if reason == "end_turn":
            return {"status": "turn_ended", "history": history}
        if reason != "tool_use":
            return {"status": "incomplete", "reason": reason, "history": history}
        calls = [b for b in content if b.get("type") == "tool_use"]
        if not calls:
            return {"status": "incomplete", "reason": "missing_tool_blocks",
                    "history": history}
        history.append({"role": "user", "content": [execute(c) for c in calls]})
    return {"status": "incomplete", "reason": "budget_exhausted", "history": history}


def authorize_change(verified_user_id, ticket_id):
    ticket = TICKETS.get(ticket_id)
    return bool(verified_user_id and ticket
                and ticket["owner_id"] == verified_user_id
                and ticket["change_allowed"])


def validate_quote(quote):
    """Semantic validation preserves, rather than silently repairs, source values."""
    calculated = sum(quote["items"])
    errors = []
    if quote["stated_total"] is not None and calculated != quote["stated_total"]:
        errors.append("total_mismatch")
    return {"calculated_total": calculated, "errors": errors}


def tool_turn():
    return {"stop_reason": "tool_use", "content": [
        {"type": "text", "text": "Checking both tickets."},
        {"type": "tool_use", "id": "c1", "name": "lookup_ticket_by_id",
         "input": {"ticket_id": "T-041"}},
        {"type": "tool_use", "id": "c2", "name": "lookup_ticket_by_id",
         "input": {"ticket_id": "T-042"}},
    ]}


def main():
    observed = []

    def model(history):
        observed.append(history)
        if len(observed) == 1:
            return tool_turn()
        results = history[-1]["content"]
        assert [r["tool_use_id"] for r in results] == ["c1", "c2"]
        assert json.loads(results[0]["content"])["ticket"]["change_allowed"] is True
        assert json.loads(results[1]["content"])["ticket"]["change_allowed"] is False
        assert history[-2]["content"] == tool_turn()["content"]
        return {"stop_reason": "end_turn", "content": [
            {"type": "text", "text": "T-041 permits a change; no change executed."}]}

    result = run_loop(model)
    assert result["status"] == "turn_ended" and len(observed) == 2
    unknown = execute({"id": "x", "name": "arbitrary_command", "input": {}})
    assert unknown["is_error"] and not json.loads(unknown["content"])["isRetryable"]
    assert not authorize_change(None, "T-041")
    assert not authorize_change("someone_else", "T-041")
    assert authorize_change("U-63", "T-041")
    exhausted = run_loop(lambda _: tool_turn(), max_rounds=2)
    assert exhausted["status"] == "incomplete" and exhausted["reason"] == "budget_exhausted"
    truncated = run_loop(lambda _: {"stop_reason": "max_tokens", "content": []})
    assert truncated["status"] == "incomplete"
    quote = {"items": [120, 80], "stated_total": 250, "tax_id": None}
    validated = validate_quote(quote)
    assert validated["errors"] == ["total_mismatch"] and quote["stated_total"] == 250
    assert validate_quote({"items": [120, 80], "stated_total": None,
                           "tax_id": None})["errors"] == []
    print("PASS: 7 offline checks")


if __name__ == "__main__":
    main()
