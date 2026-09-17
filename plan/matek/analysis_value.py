"""第 10 章教學模型：再做一次分析，值不值得？

全部數字都是本書自訂的教學假設，不是閎康報價、客戶成本或任何公司的實績。
模型回答一個問題：目前對某個根因假設的相信程度 p，要多高才可以直接改版投片，
而不必再付一次分析的錢與等待時間。

情境設定
--------
工程樣品已經定位到一個候選根因 H（例如某條連線接錯）。團隊有兩個選項：

A. 直接改版投片：付 respin 成本與週期。若 H 其實是錯的，這一版不會好，
   必須重新分析並再改一次版（模型只算再多一輪，不做無窮遞迴）。
B. 先追加分析（含必要的樣品製備、定位或 FIB 編修驗證）：付分析成本與週期，
   拿到一個「支持」或「不支持」的結果，再決定要不要改版。

分析不是完美的：若 H 為真，有 se 的機率會得到支持（真陽性）；
若 H 為假，有 sp 的機率會正確排除（真陰性）。

執行：python analysis_value.py
"""

from dataclasses import dataclass


@dataclass(frozen=True)
class Scenario:
    """一組教學假設。成本單位：萬元；時間單位：週。"""

    p: float           # 目前相信 H 是真根因的機率
    c_respin: float    # 一次改版投片的成本（光罩、晶圓、組裝、驗證）
    t_respin: float    # 一次改版投片到拿到新樣品的週期
    c_fa: float        # 追加一輪分析的成本
    t_fa: float        # 追加一輪分析的週期
    se: float          # H 為真時，分析給出「支持」的機率
    sp: float          # H 為假時，分析正確排除的機率

    def __post_init__(self) -> None:
        for name in ("p", "se", "sp"):
            v = getattr(self, name)
            if not 0.0 <= v <= 1.0:
                raise ValueError(f"{name} 必須落在 0 與 1 之間，收到 {v}")
        for name in ("c_respin", "t_respin", "c_fa", "t_fa"):
            if getattr(self, name) < 0:
                raise ValueError(f"{name} 不能為負")


def cost_direct_respin(s: Scenario) -> tuple[float, float]:
    """選項 A：直接改版。回傳（期望成本, 期望週期）。

    H 為真（機率 p）：一輪解決。
    H 為假（機率 1-p）：這一輪白做，再付一次分析與一次改版。
    """
    good = s.c_respin
    bad = s.c_respin + s.c_fa + s.c_respin
    cost = s.p * good + (1 - s.p) * bad

    t_good = s.t_respin
    t_bad = s.t_respin + s.t_fa + s.t_respin
    time = s.p * t_good + (1 - s.p) * t_bad
    return cost, time


def cost_analyze_first(s: Scenario) -> tuple[float, float]:
    """選項 B：先分析再決定。回傳（期望成本, 期望週期）。

    分析「支持」才改版；「不支持」就先換假設，付一次分析成本後再改版。
    ponytail: 只展開一層後續，不做無窮遞迴——夠回答「現在該不該再分析」，
    要看多輪收斂就改成遞迴或模擬。
    """
    # 分析結果為「支持」的機率，以及在支持條件下 H 為真的機率
    p_support = s.p * s.se + (1 - s.p) * (1 - s.sp)
    p_reject = 1 - p_support

    cost = s.c_fa
    time = s.t_fa

    if p_support > 0:
        # 支持 → 改版。條件機率 P(H 真 | 支持)
        p_h_given_support = (s.p * s.se) / p_support
        after_support_cost = s.c_respin + (1 - p_h_given_support) * (s.c_fa + s.c_respin)
        after_support_time = s.t_respin + (1 - p_h_given_support) * (s.t_fa + s.t_respin)
        cost += p_support * after_support_cost
        time += p_support * after_support_time

    if p_reject > 0:
        # 不支持 → 不照原假設改版，換一個假設再走一輪分析與改版
        cost += p_reject * (s.c_fa + s.c_respin)
        time += p_reject * (s.t_fa + s.t_respin)

    return cost, time


def threshold_p(s: Scenario, tol: float = 1e-9) -> float | None:
    """找出讓兩個選項期望成本相等的 p（二分搜尋）。

    若在 [0, 1] 內兩者差值不變號，回傳 None，表示在這組假設下
    其中一個選項在整個區間都比較便宜。
    """

    def diff(p: float) -> float:
        t = Scenario(p, s.c_respin, s.t_respin, s.c_fa, s.t_fa, s.se, s.sp)
        return cost_direct_respin(t)[0] - cost_analyze_first(t)[0]

    lo, hi = 0.0, 1.0
    d_lo, d_hi = diff(lo), diff(hi)
    if d_lo == 0.0:
        return 0.0
    if d_hi == 0.0:
        return 1.0
    if (d_lo > 0) == (d_hi > 0):
        return None

    while hi - lo > tol:
        mid = (lo + hi) / 2
        if (diff(mid) > 0) == (d_lo > 0):
            lo = mid
        else:
            hi = mid
    return (lo + hi) / 2


BASE = Scenario(p=0.6, c_respin=300.0, t_respin=12.0, c_fa=40.0, t_fa=3.0, se=0.9, sp=0.8)


def _report(title: str, s: Scenario) -> None:
    ca, ta = cost_direct_respin(s)
    cb, tb = cost_analyze_first(s)
    thr = threshold_p(s)
    print(f"\n{title}")
    print(f"  p={s.p:.2f} c_respin={s.c_respin:.0f} c_fa={s.c_fa:.0f} se={s.se:.2f} sp={s.sp:.2f}")
    print(f"  A 直接改版　期望成本 {ca:7.1f} 萬元　期望週期 {ta:5.1f} 週")
    print(f"  B 先做分析　期望成本 {cb:7.1f} 萬元　期望週期 {tb:5.1f} 週")
    print(f"  較便宜：{'B 先做分析' if cb < ca else 'A 直接改版'}")
    print(f"  成本相等的 p 門檻：{'不存在（單邊佔優）' if thr is None else f'{thr:.3f}'}")


def demo() -> None:
    _report("基準情境", BASE)
    _report("很有把握（p=0.95）", Scenario(0.95, 300.0, 12.0, 40.0, 3.0, 0.9, 0.8))
    _report("分析很貴（c_fa=200）", Scenario(0.6, 300.0, 12.0, 200.0, 3.0, 0.9, 0.8))
    _report("分析幾乎無鑑別力（se=0.55, sp=0.5）", Scenario(0.6, 300.0, 12.0, 40.0, 3.0, 0.55, 0.5))

    # --- 自我檢查：邏輯壞掉時這裡會先炸 ---
    # 1. 完全確定 H 為真時，直接改版就是一輪 respin，不應該再付分析錢
    sure = Scenario(1.0, 300.0, 12.0, 40.0, 3.0, 0.9, 0.8)
    assert abs(cost_direct_respin(sure)[0] - 300.0) < 1e-9
    assert cost_analyze_first(sure)[0] > cost_direct_respin(sure)[0]

    # 2. 完全確定 H 為假時，直接改版一定浪費一輪
    hopeless = Scenario(0.0, 300.0, 12.0, 40.0, 3.0, 0.9, 0.8)
    assert abs(cost_direct_respin(hopeless)[0] - (300.0 + 40.0 + 300.0)) < 1e-9

    # 3. 分析免費且完美時，先分析不可能比較貴
    free_perfect = Scenario(0.6, 300.0, 12.0, 0.0, 0.0, 1.0, 1.0)
    assert cost_analyze_first(free_perfect)[0] <= cost_direct_respin(free_perfect)[0] + 1e-9

    # 4. 沒有鑑別力的分析（se + sp = 1）不會改變信念，只是多付一次分析錢
    useless = Scenario(0.6, 300.0, 12.0, 40.0, 3.0, 0.7, 0.3)
    assert cost_analyze_first(useless)[0] > cost_direct_respin(useless)[0]

    # 5. 期望成本對 p 單調遞減（越確定，直接改版越便宜）
    prev = float("inf")
    for i in range(11):
        c = cost_direct_respin(Scenario(i / 10, 300.0, 12.0, 40.0, 3.0, 0.9, 0.8))[0]
        assert c < prev
        prev = c

    # 6. 門檻存在時，門檻兩側的偏好必須真的相反
    thr = threshold_p(BASE)
    assert thr is not None
    lo = Scenario(thr - 0.05, 300.0, 12.0, 40.0, 3.0, 0.9, 0.8)
    hi = Scenario(thr + 0.05, 300.0, 12.0, 40.0, 3.0, 0.9, 0.8)
    assert cost_analyze_first(lo)[0] < cost_direct_respin(lo)[0]
    assert cost_direct_respin(hi)[0] < cost_analyze_first(hi)[0]

    print("\n自我檢查全部通過。")
    print("提醒：模型只比較期望成本與期望週期，不能取代品質放行資格與可靠度判定。")


if __name__ == "__main__":
    demo()
