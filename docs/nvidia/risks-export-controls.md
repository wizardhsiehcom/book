# 風險與出口管制

談 NVIDIA 的出口管制，常見的問題是：美國會不會再收緊？

這個問題只看了管制的一端。2025 年，美國放行 H20 的同時，北京卻開始勸阻本國企業採購。**到了這個階段，決定 NVIDIA 能在中國賣多少的，已經不只是華府。**

---

## 時間軸

| 時間 | 事件 |
|------|------|
| 2022 年 8 月 | 美國限制 A100、H100 出口中國 |
| 2022 年底 | NVIDIA 推出降規版 A800、H800 |
| 2023 年 8 月 | 據 FT 報導，百度、字節跳動、騰訊、阿里巴巴訂購約 10 億美元、約 10 萬顆 A800（2023 年交貨），另有約 40 億美元於 2024 年交貨；報導將搶購歸因於擔心管制再收緊 |
| 2023 年 10 月 | A800、H800 也被納入管制；NVIDIA 隨後推出 H20 等進一步降規的產品 |
| 2025 年 4 月 | H20 出口須取得許可；NVIDIA 因 H20 需求下滑認列 45 億美元的存貨與採購承諾費用 |
| 2025 年 7 月 | 中國網信辦約談 NVIDIA，要求說明 H20 是否有後門風險 |
| 2025 年 8 月 | 美國核發部分 H20 許可（報導附帶 15% 營收分成）；據 Bloomberg 報導，中國官方通知企業勿用 H20，尤其是政府與安全相關項目，FT 報導部分大買家因此減單；同期華為昇騰 910C 開始送樣給大型科技公司 |
| 2025 年 9 月 | 中國市場監管總局初步認定 NVIDIA 收購 Mellanox 違反反壟斷法 |
| 2026 年 1–2 月 | 美國附條件放行 H200：對中銷量上限為對美銷量的 50%；2 月核發少量許可。美國政府的分成比例，報導有 25% 與 15% 兩種說法 |
| 2026 年 7 月 | 美國商務部官員向國會表示 H200 出口已開始，但數量「極少」 |

---

## 財務上的結果

依 NVIDIA 2026 財年 10-K，以直接客戶總部所在地認列的營收：

| 財年 | 中國（含香港） | 占總營收 |
|------|---------------|---------|
| FY2024 | 123.3 億美元 | 約 20.2% |
| FY2025 | 250.5 億美元 | 約 19.2% |
| FY2026 | 196.8 億美元 | 約 9.1% |

10-K 也寫明：2025 年 8 月取得的 H20 許可只帶來約 6,000 萬美元營收；截至 2026 財年年底，H200 許可尚未產生營收；NVIDIA「實質上被排除在中國資料中心運算市場之外」。

讀這張表要注意口徑：NVIDIA 在 2026 財年第三季改為以客戶總部所在地認列，前期已重編。最終客戶與出貨地可能不在中國，所以這不是「中國最終使用量」。

---

## 2023 年搶著買，2025 年被勸阻

同樣是降規版晶片，2023 年中國四大網路公司搶購 A800，當時未見官方勸阻；2025 年美國放行 H20，北京卻開始勸阻。

<!-- mech: irreplaceability_dual, test: china_buys_vs_refuses -->
!!! note "詮釋"
    管制是兩個國家在搶收稅權。2023 年中國沒有替代品，四大網路公司寧可搶購 A800 也要繳這筆稅；2025 年昇騰 910C 開始送樣，北京就從納稅的一方變成想自己收稅的一方。勸阻採購是在保護自己的稅基：買 NVIDIA 從必需品，變成了依賴的證據。

<!-- mech: irreplaceability_dual (challenge) -->
!!! note "詮釋"
    管制把中國逼成了最會省稅的納稅人。DeepSeek 只能用 H800，就在工程上找回算力差距。諷刺的是，它往下寫的 PTX 仍是 NVIDIA 專屬：被卡住的人沒有逃出稅法，而是更深地鑽進了稅法。

---

## 其他風險

| 風險 | 事實 | 要觀察的訊號 |
|------|------|-------------|
| 出口管制與中國反制 | FY2026 中國營收占比降到約 9%；10-K 自述實質被排除在中國資料中心市場之外 | 中國本土 AI 晶片的出貨與良率；H200 許可下的實際出貨量 |
| 大型買方導入第二供應商 | 2026 財年兩家直接客戶分別占營收 22% 與 14% | 大買方與 AMD、Google、自研晶片的合約規模（見[市場競爭與護城河](competitive-moat.md)） |
| 製造集中在台灣 | 先進 GPU 幾乎都由台積電生產 | 台積電海外廠的先進製程產能；地緣分析見台積電一書〈地緣政治與全球化〉 |
| AI 投資放緩 | 估值反映很高的成長預期 | 大型雲端業者的資本支出指引 |

---

## 資料來源

- 中國營收、H20 費用與許可、H200 許可、客戶集中度：[NVIDIA FY2026 Form 10-K](https://www.sec.gov/Archives/edgar/data/1045810/000104581026000021/nvda-20260125.htm)
- A800 訂單：[TechNode 轉述 FT](https://technode.com/2023/08/10/chinese-tech-giants-place-5-billion-orders-with-nvidia-for-generative-ai-chips/)
- 網信辦約談、反壟斷初步認定：[The Register](https://www.theregister.com/2025/09/15/china_nvidia_antitrust/)、[JURIST](https://www.jurist.org/news/2025/09/china-finds-nvidia-violated-antimonopoly-law-in-preliminary-probe/)
- 中國勸阻 H20：[The Week 轉述 Bloomberg、FT](https://www.theweek.in/news/biz-tech/2025/08/12/dont-want-leftover-chips-china-says-no-to-nvidia-less-advanced-h20-semiconductor.amp.html)
- H200 放行：[NBC News](https://www.nbcnews.com/world/asia/us-approves-nvidia-h200-chip-exports-china-conditions-rcna253948)
- DeepSeek：[Tom's Hardware](https://tomshardware.com/tech-industry/artificial-intelligence/deepseeks-ai-breakthrough-bypasses-industry-standard-cuda-uses-assembly-like-ptx-programming-instead)

本章的案例與機制底稿見 `plan/nvidia/cases.yml` 與 `plan/nvidia/mechanisms.yml`。
