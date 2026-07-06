# Lecture 02 閱讀筆記：Frequency Selectivity and Nonlinearity in Hearing

## 基本資料
- **Lecture Number:** 02
- **Title:** Frequency Selectivity and Nonlinearity in Hearing
- **Transcript Path:** `/Users/wizard/Desktop/MacCode/book/data/mit9.35/transcripts/2： Frequency Selectivity and Nonlinearity in Hearing [qzNJi4AO_Aw].txt`
- **Reading Date:** 2026-07-06
- **Reader:** Claude
- **Status:** Done

## 逐字稿完整閱讀紀錄
- **Start:** 0
- **End:** 74044
- **Complete reading confirmed:** Yes. Read in two chunks, reached the end of the file.
- **Skipped sections:** None.

## 本講主問題
本講義主要探討聽覺系統中最關鍵的兩大特性：頻率選擇性（Frequency Selectivity）與非線性（Nonlinearity）。大腦如何從複雜的環境聲中提取不同頻率？為何我們對微弱聲音極度敏感，對大音量聲音又能忍受？講者透過遮蔽效應（Masking）、非線性放大機制，以及畸變產物（Distortion Products）的現象，解釋耳蝸作為帶通濾波器組的運作原理，並在最後探討了聽力損失（特別是感音神經性聽損）的機制與環境噪音的影響。

## 核心概念

| 概念 | 解釋 | 寫作處理方式 |
|------|------|-------------|
| 頻率選擇性 (Frequency Selectivity) | 耳蝸可視為一組帶通濾波器，不同部位對特定頻率（特徵頻率）最敏感。 | 從神經調諧曲線切入，解釋其物理基礎與對聽覺感知的限制（如拍音的感知條件）。 |
| 遮蔽效應 (Masking) 與 臨界頻帶 (Critical Band) | 一個聲音提高另一個聲音聽覺閾值的現象。臨界頻帶是指當遮蔽噪音頻寬增加到一定程度後，再增加頻寬不會進一步影響信號檢測閾值。 | 詳細描述 Fletcher 的頻寬擴展實驗與現代的凹口噪音法（Notch Noise Method）。 |
| 非線性與強度相依放大 (Level-Dependent Amplification) | 聽覺系統對小聲音提供極大且高頻率專一的放大，對大聲音則放大較少（壓縮響應），導致小聲時頻寬窄，大聲時頻寬寬。此機制由外毛細胞負責。 | 比較基底膜與鐙骨的響應曲線，解釋「壓縮性響應」的意義與外毛細胞的貢獻。 |
| 畸變產物 (Distortion Products) | 因為耳蝸的非線性放大，當輸入兩個純音（$f_1$, $f_2$）時，耳蝸會自行產生輸入中沒有的頻率（例如三次畸變產物 $2f_1 - f_2$）。 | 透過課堂中的拍音展示（加拍音探針音）與頻率掃描展示，說明非線性系統的特性。 |
| 老年性聽損 (Presbycusis) 與噪音暴露 | 隨著年齡增長，尤其是高頻聽力會顯著下降（毛細胞損失）。比較現代工業社會與非工業化社會（如非洲 Mabaan、復活節島），以及獵人的左右耳差異，證明環境噪音是重要成因。 | 作為應用與生活連結的結尾，強調聽力保護的重要性，並為下一章的「隱性聽損」鋪陳。 |

## 重要細節
- **生理數據對比**：人耳約有 3,500 個內毛細胞、12,000 個外毛細胞。聽神經纖維約 30,000 條。相比視覺（受器多，視神經少），聽覺是受器少，聽神經多（頻寬擴展）。
- **拍音 (Beating) 與粗糙感 (Roughness)**：兩個頻率相近的純音疊加產生振幅調變（聲學現象）。但只有當這兩個頻率進入同一隻耳朵且落在同一個聽覺濾波器頻寬內時，我們才會聽出「粗糙感」。
- **機器學習的比對**：Google 的語音辨識系統優化出的前端濾波器組，其頻寬隨頻率變化的趨勢，與人類耳蝸的生物學測量結果（高頻濾波器較寬）驚人地相似。
- **聽損分類**：傳導性聽損（外耳/中耳，如耳硬化症 autosclerosis） vs. 感音神經性聽損（內耳/神經，如毛細胞死亡）。
- **遺體解剖 (Otopathology)**：底部的內外毛細胞（負責高頻）隨年齡流失最為嚴重。

## 現象與機制
- **機制：外毛細胞的主動放大機制 (Cochlear Amplifier)**
  - **基礎**：外毛細胞根據電壓改變形狀。
  - **證據**：基底膜的位移在小音量時遠大於鐙骨（高度非線性與壓縮性）；若使用高音量，響應變得線性且調諧變寬。
  - **連結**：這是產生畸變產物與強度相依的頻率選擇性的根本原因。

## 與前後章的連結
- **前一章 (Lecture 01)**：延續了中耳/內耳結構、內外毛細胞分工，以及特徵頻率（Characteristic Frequency）的概念。
- **後一章 (Lecture 03)**：本講最後提到的「暫時性閾值偏移 (Temporary Threshold Shift, TTS)」與聽力保護，將直接引出下一講的「隱藏性聽力損失 (Hidden Hearing Loss)」與聽神經突觸損傷。

## 相關材料
- `待補`：Fletcher 的頻寬擴展實驗圖表、凹口噪音法（Notch Noise）示意圖。
- `待補`：基底膜壓縮響應曲線圖。
- `待補`：Mabaan 人與復活節島居民的聽力測量對比圖。
- `待補`：獵人左右耳不對稱聽力損失圖表。

## 外部補充
（留白）
