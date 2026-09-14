"""Finite-horizon wafer-reuse teaching model.

This module is deliberately a small, auditable model for chapter 04 of the
PSI book plan.  Its prices, yields, and thickness numbers are teaching
assumptions; they are not PSI disclosures.

The model makes one accounting choice explicit: a new wafer is paid for and
is guaranteed one qualified use.  Round ``i`` is reached only when rounds
1..i-1 returned a qualified wafer.  Once a round is reached, processing,
transport, and inspection fees are paid even when that round fails.  A failed
round produces no additional qualified use and ends the path.
"""

from __future__ import annotations

from dataclasses import dataclass
from math import floor, isclose
from typing import Any


def _require_probability(value: float, name: str) -> None:
    if not 0.0 <= value <= 1.0:
        raise ValueError(f"{name} must be between 0 and 1, got {value!r}")


def _require_nonnegative(value: float, name: str) -> None:
    if value < 0.0:
        raise ValueError(f"{name} must be non-negative, got {value!r}")


def _require_rounds(rounds: int) -> None:
    if isinstance(rounds, bool) or not isinstance(rounds, int) or rounds < 0:
        raise ValueError(f"rounds must be a non-negative integer, got {rounds!r}")


@dataclass(frozen=True)
class Scenario:
    """Inputs for one finite reuse scenario.

    ``planned_max_rounds`` is a process or qualification horizon.  The actual
    number of possible rounds is the smaller of that horizon and the number
    allowed by the thickness budget.  Other causes of early retirement are
    represented by choosing a smaller planned horizon; thickness is never
    treated as a guarantee of successful reuse.
    """

    name: str
    new_piece_cost: float
    processing_fee: float
    transport_fee: float
    inspection_fee: float
    q: float
    thickness_budget_um: float
    removal_per_round_um: float
    planned_max_rounds: int

    def __post_init__(self) -> None:
        for name in (
            "new_piece_cost",
            "processing_fee",
            "transport_fee",
            "inspection_fee",
            "thickness_budget_um",
        ):
            _require_nonnegative(getattr(self, name), name)
        if self.removal_per_round_um <= 0.0:
            raise ValueError("removal_per_round_um must be positive")
        _require_probability(self.q, "q")
        _require_rounds(self.planned_max_rounds)

    @property
    def round_fee(self) -> float:
        """Fee paid for an attempted round, including a failed attempt."""

        return self.processing_fee + self.transport_fee + self.inspection_fee

    @property
    def thickness_round_limit(self) -> int:
        # The tiny tolerance avoids 100.0 / 25.0 becoming 3 due to a binary
        # floating point representation just below four.
        return max(0, floor(self.thickness_budget_um / self.removal_per_round_um + 1e-12))

    @property
    def rounds(self) -> int:
        return min(self.planned_max_rounds, self.thickness_round_limit)


@dataclass(frozen=True)
class EventPath:
    """One terminal path in the stopped event tree.

    ``P`` means that the attempted round returned qualified; ``F`` means the
    attempted round failed.  A path stops at its first ``F`` or at the finite
    round horizon.
    """

    outcomes: str
    probability: float
    attempted_rounds: int
    qualified_uses: int
    total_cost: float


def geometric_sum(q: float, rounds: int) -> float:
    """Return ``sum(q**i for i in range(rounds))`` without a q=1 problem."""

    _require_probability(q, "q")
    _require_rounds(rounds)
    if rounds == 0:
        return 0.0
    if q == 1.0:
        return float(rounds)
    return (1.0 - q**rounds) / (1.0 - q)


def analytic_result(
    *,
    new_piece_cost: float,
    round_fee: float,
    q: float,
    rounds: int,
) -> dict[str, float | int]:
    """Calculate expected cost and qualified uses by reach probabilities.

    Round ``i`` is reached with probability ``q**(i-1)`` and succeeds with
    probability ``q**i``.  A failed reached round still contributes its fee to
    expected cost, while it contributes no qualified use.
    """

    _require_nonnegative(new_piece_cost, "new_piece_cost")
    _require_nonnegative(round_fee, "round_fee")
    _require_probability(q, "q")
    _require_rounds(rounds)

    expected_attempted_rounds = geometric_sum(q, rounds)
    expected_additional_uses = q * expected_attempted_rounds
    expected_cost = new_piece_cost + round_fee * expected_attempted_rounds
    expected_qualified_uses = 1.0 + expected_additional_uses
    cost_per_qualified_use = expected_cost / expected_qualified_uses
    return {
        "rounds": rounds,
        "q": q,
        "expected_attempted_rounds": expected_attempted_rounds,
        "expected_additional_uses": expected_additional_uses,
        "expected_cost": expected_cost,
        "expected_qualified_uses": expected_qualified_uses,
        "cost_per_qualified_use": cost_per_qualified_use,
        "probability_all_rounds_pass": q**rounds,
        "probability_of_early_failure": 1.0 - q**rounds,
    }


def enumerate_event_tree(
    *,
    new_piece_cost: float,
    round_fee: float,
    q: float,
    rounds: int,
) -> list[EventPath]:
    """Enumerate every terminal path of the stopped pass/fail tree.

    The recursion is intentionally independent of :func:`analytic_result`.
    It charges a fee when a node is entered, then creates a failure leaf and
    a pass child.  Zero-probability branches are retained so q=0 and q=1
    still expose the full finite tree shape.
    """

    _require_nonnegative(new_piece_cost, "new_piece_cost")
    _require_nonnegative(round_fee, "round_fee")
    _require_probability(q, "q")
    _require_rounds(rounds)

    paths: list[EventPath] = []

    def visit(
        round_index: int,
        probability: float,
        outcomes: str,
        attempted_rounds: int,
        passes: int,
    ) -> None:
        if round_index == rounds:
            paths.append(
                EventPath(
                    outcomes=outcomes or "∅",
                    probability=probability,
                    attempted_rounds=attempted_rounds,
                    qualified_uses=1 + passes,
                    total_cost=new_piece_cost + round_fee * attempted_rounds,
                )
            )
            return

        next_attempted_rounds = attempted_rounds + 1
        # Failure is terminal.  Its attempted fee is still paid.
        paths.append(
            EventPath(
                outcomes=outcomes + "F",
                probability=probability * (1.0 - q),
                attempted_rounds=next_attempted_rounds,
                qualified_uses=1 + passes,
                total_cost=new_piece_cost + round_fee * next_attempted_rounds,
            )
        )
        # A pass buys one further qualified use and permits the next round.
        visit(
            round_index + 1,
            probability * q,
            outcomes + "P",
            next_attempted_rounds,
            passes + 1,
        )

    visit(0, 1.0, "", 0, 0)
    return paths


def tree_result(
    *,
    new_piece_cost: float,
    round_fee: float,
    q: float,
    rounds: int,
) -> dict[str, float | int | list[EventPath]]:
    """Sum the event-tree leaves using their path probabilities."""

    paths = enumerate_event_tree(
        new_piece_cost=new_piece_cost,
        round_fee=round_fee,
        q=q,
        rounds=rounds,
    )
    return {
        "paths": paths,
        "probability_sum": sum(path.probability for path in paths),
        "expected_cost": sum(path.probability * path.total_cost for path in paths),
        "expected_qualified_uses": sum(
            path.probability * path.qualified_uses for path in paths
        ),
    }


def scenario_result(scenario: Scenario) -> dict[str, Any]:
    """Return the scenario inputs plus analytic and tree checks."""

    analytic = analytic_result(
        new_piece_cost=scenario.new_piece_cost,
        round_fee=scenario.round_fee,
        q=scenario.q,
        rounds=scenario.rounds,
    )
    tree = tree_result(
        new_piece_cost=scenario.new_piece_cost,
        round_fee=scenario.round_fee,
        q=scenario.q,
        rounds=scenario.rounds,
    )
    if not isclose(analytic["expected_cost"], tree["expected_cost"], rel_tol=1e-12):
        raise AssertionError(f"cost mismatch for {scenario.name}")
    if not isclose(
        analytic["expected_qualified_uses"],
        tree["expected_qualified_uses"],
        rel_tol=1e-12,
    ):
        raise AssertionError(f"use-count mismatch for {scenario.name}")
    if not isclose(tree["probability_sum"], 1.0, rel_tol=1e-12):
        raise AssertionError(f"tree probabilities do not sum to one for {scenario.name}")
    return {
        "scenario": scenario,
        "analytic": analytic,
        "tree": tree,
        "tree_cost_per_qualified_use": tree["expected_cost"]
        / tree["expected_qualified_uses"],
    }


def capacity_result(
    *,
    nominal_per_month: float,
    available_fraction: float,
    certified_fraction: float,
    return_rate: float,
) -> dict[str, float]:
    """Apply a staged capacity model with explicit conditional fractions.

    The fractions are stage ratios, not independent random events:

    ``qualified returns = nominal × (available / nominal)
    × (certified eligible / available) × (qualified returns / certified
    eligible attempts)``.

    Keeping these denominators explicit prevents mixing a nominal-hour ratio
    with a good-wafer ratio.  The result is a qualified returned service
    count per month, not revenue and not a claim about a real company.
    """

    _require_nonnegative(nominal_per_month, "nominal_per_month")
    for name, value in (
        ("available_fraction", available_fraction),
        ("certified_fraction", certified_fraction),
        ("return_rate", return_rate),
    ):
        _require_probability(value, name)
    available_capacity = nominal_per_month * available_fraction
    certified_attempts = available_capacity * certified_fraction
    qualified_returns = certified_attempts * return_rate
    return {
        "nominal_per_month": nominal_per_month,
        "available_fraction": available_fraction,
        "certified_fraction": certified_fraction,
        "return_rate": return_rate,
        "available_capacity": available_capacity,
        "certified_attempts": certified_attempts,
        "qualified_returns": qualified_returns,
    }


COMMON = {
    "new_piece_cost": 1000.0,
    "thickness_budget_um": 100.0,
    "removal_per_round_um": 24.0,
    # The thickness budget is the binding finite horizon: floor(100 / 24)=4.
    # A separate planned horizon leaves room to model other early-retirement
    # causes without treating thickness as a guarantee.
    "planned_max_rounds": 8,
}

LOW_COST_LOW_YIELD = Scenario(
    name="A：較便宜、低回貨良率",
    processing_fee=55.0,
    transport_fee=25.0,
    inspection_fee=15.0,
    q=0.72,
    **COMMON,
)

HIGH_COST_HIGH_YIELD = Scenario(
    name="B：較昂貴、高回貨良率",
    processing_fee=95.0,
    transport_fee=40.0,
    inspection_fee=40.0,
    q=0.92,
    **COMMON,
)


def self_test() -> None:
    """Run boundary checks and the independent tree cross-check."""

    # Baseline scenarios: formula and exhaustive tree must agree.
    for scenario in (LOW_COST_LOW_YIELD, HIGH_COST_HIGH_YIELD):
        result = scenario_result(scenario)
        assert result["scenario"].rounds == 4

    # q=0: the first attempted round fails, so its fee is paid but no reuse is
    # earned.  The zero-probability all-pass leaf remains in the tree.
    q0 = analytic_result(new_piece_cost=1000.0, round_fee=90.0, q=0.0, rounds=4)
    assert isclose(q0["expected_cost"], 1090.0)
    assert isclose(q0["expected_qualified_uses"], 1.0)
    q0_tree = tree_result(new_piece_cost=1000.0, round_fee=90.0, q=0.0, rounds=4)
    assert isclose(q0_tree["probability_sum"], 1.0)
    assert isclose(q0_tree["expected_cost"], q0["expected_cost"])
    assert isclose(q0_tree["expected_qualified_uses"], q0["expected_qualified_uses"])

    # q=1: all finite rounds pass, so every round fee is paid and every round
    # adds one qualified use.
    q1 = analytic_result(new_piece_cost=1000.0, round_fee=90.0, q=1.0, rounds=4)
    assert isclose(q1["expected_cost"], 1360.0)
    assert isclose(q1["expected_qualified_uses"], 5.0)
    q1_tree = tree_result(new_piece_cost=1000.0, round_fee=90.0, q=1.0, rounds=4)
    assert isclose(q1_tree["expected_cost"], q1["expected_cost"])
    assert isclose(q1_tree["expected_qualified_uses"], q1["expected_qualified_uses"])

    # Zero reprocessable rounds: q is irrelevant; only the guaranteed initial
    # qualified use and new-piece cost remain.
    r0 = analytic_result(new_piece_cost=1000.0, round_fee=90.0, q=0.37, rounds=0)
    assert isclose(r0["expected_cost"], 1000.0)
    assert isclose(r0["expected_qualified_uses"], 1.0)
    r0_tree = tree_result(new_piece_cost=1000.0, round_fee=90.0, q=0.37, rounds=0)
    assert len(r0_tree["paths"]) == 1
    assert isclose(r0_tree["expected_cost"], r0["expected_cost"])

    # Thickness is an upper bound, not a promise of successful rounds.
    assert Scenario(
        name="thickness", **COMMON, processing_fee=1.0, transport_fee=0.0,
        inspection_fee=0.0, q=1.0
    ).rounds == 4
    assert Scenario(
        name="zero thickness", new_piece_cost=1.0, processing_fee=1.0,
        transport_fee=0.0, inspection_fee=0.0, q=1.0,
        thickness_budget_um=23.0, removal_per_round_um=24.0,
        planned_max_rounds=8,
    ).rounds == 0

    capacity = capacity_result(
        nominal_per_month=12000.0,
        available_fraction=0.80,
        certified_fraction=0.60,
        return_rate=0.85,
    )
    assert isclose(capacity["qualified_returns"], 4896.0)


def _money(value: float) -> str:
    return f"{value:,.2f}"


def print_report() -> None:
    """Print compact values useful while drafting the book chapter."""

    print("self_test: PASS")
    for scenario in (LOW_COST_LOW_YIELD, HIGH_COST_HIGH_YIELD):
        result = scenario_result(scenario)
        analytic = result["analytic"]
        print(f"{scenario.name}")
        print(f"  rounds={scenario.rounds}, q={scenario.q:.2f}, round_fee={_money(scenario.round_fee)}")
        print(f"  expected_cost={_money(analytic['expected_cost'])}")
        print(f"  expected_qualified_uses={analytic['expected_qualified_uses']:.8f}")
        print(f"  cost_per_qualified_use={_money(analytic['cost_per_qualified_use'])}")
        print(f"  early_failure={analytic['probability_of_early_failure']:.8f}")
        print("  event_tree:")
        for path in result["tree"]["paths"]:
            print(
                f"    {path.outcomes:>4} p={path.probability:.8f}"
                f" cost={_money(path.total_cost)} uses={path.qualified_uses}"
            )

    print("sensitivity: scheme B total round fee")
    baseline_a = scenario_result(LOW_COST_LOW_YIELD)["analytic"]
    for b_total in (175.0, 230.0, 240.0, 250.0):
        b = analytic_result(
            new_piece_cost=HIGH_COST_HIGH_YIELD.new_piece_cost,
            round_fee=b_total,
            q=HIGH_COST_HIGH_YIELD.q,
            rounds=HIGH_COST_HIGH_YIELD.rounds,
        )
        print(
            f"  B_fee={b_total:>6.2f} A={baseline_a['cost_per_qualified_use']:.8f}"
            f" B={b['cost_per_qualified_use']:.8f}"
        )

    capacity = capacity_result(
        nominal_per_month=12000.0,
        available_fraction=0.80,
        certified_fraction=0.60,
        return_rate=0.85,
    )
    print(f"capacity qualified_returns={capacity['qualified_returns']:.2f}/month")


if __name__ == "__main__":
    self_test()
    print_report()
