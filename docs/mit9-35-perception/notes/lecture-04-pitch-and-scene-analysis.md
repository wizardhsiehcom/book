# MIT 9.35 閱讀筆記：Lecture 04 Pitch Perception and Scene Analysis

## 基本資料
- **Lecture Number**: 04
- **Lecture Title**: Pitch Perception and Scene Analysis
- **Transcript Path**: /Users/wizard/Desktop/MacCode/book/data/mit9.35/transcripts/4： Pitch Perception and Scene Analysis [aCZi_b68GLw].txt
- **Reading Date**: 2026-07-06
- **Reader**: AI Assistant
- **Status**: Completed

## 逐字稿完整閱讀紀錄
- **Start**: 0 bytes
- **End**: 73,920 bytes
- **Complete reading confirmed**: Yes
- **Skipped sections**: None

## 本講主問題
本講義主要探討人類聽覺系統如何處理並感知聲音的音高（Pitch）、音色（Timbre）與響度（Loudness），以及當多個聲音同時存在時，大腦如何將單一的混合聲波拆解並推論出世界中獨立的聲音來源（即聽覺場景分析，Auditory Scene Analysis）。重點解釋了耳蝸過濾器如何限制音高的資訊解析，並引入貝氏推論（Bayesian Inference）與 Marr 的分析層次來理解聽覺感知的計算問題。

## 核心概念

| 概念 | 解釋 | 如何在章節中處理 |
| --- | --- | --- |
| 基頻（Fundamental Frequency, F0）與諧波（Harmonics） | 自然聲音通常包含基頻及其整數倍的諧波。基頻決定了聲音的週期與音高感知，甚至在基頻物理上缺失時（缺失基頻現象），我們仍能感知到該音高。 | 在「核心概念」段落解釋自然聲音的結構，並以圖表或文字輔助說明頻譜與週期的關係。 |
| 已解析（Resolved）與未解析（Unresolved）諧波 | 耳蝸低頻過濾器較窄，能分辨個別低次諧波（產生明顯頻譜峰值）；高頻過濾器較寬，多個高次諧波進入同一過濾器產生拍頻（Beating）及時間線索，但無法在頻譜上分辨。 | 在「機制與現象」段落詳細說明耳蝸過濾器特性如何影響神經激發模式（Excitation pattern），並影響音高辨識能力。 |
| 機器學習與聽覺飲食（Auditory Diet） | 模擬音高感知的機器學習模型顯示，訓練於自然聲音（低通特性）的模型表現出類似人類依賴低次諧波的特徵；訓練於高通聲音則策略改變。 | 在「心理物理與證據」介紹此實驗，作為理解人類聽覺為何如此演化的證據。 |
| 音色（Timbre） | 除音高與響度外區分聲音的特徵。主要取決於諧波的相對振幅（頻譜包絡）以及聲音的時間包絡（振幅隨時間的變化，如起音和衰減）。 | 獨立段落探討音色，並以樂器和倒放實驗（Backward playing）為例。 |
| 響度的冪法則與動態範圍問題 | 響度隨物理強度呈 0.3 次方增長（10 dB 增加 = 響度翻倍）。人類可辨識巨大動態範圍的音量，但單一聽覺神經纖維動態範圍很窄（25-30 dB），產生「動態範圍問題」。 | 在「心理物理與證據」列出數據，並討論大腦可能的解決方案（如偏頻聆聽、低自發率神經元）。 |
| 聽覺場景分析（Auditory Scene Analysis） | 從單一混合聲波中拆解出多個獨立音源的不適定問題（Ill-posed problem），類似解方程式 x + y = 混合聲波。 | 作為下半部核心，帶入貝氏推論模型與 Marr 的分析層次。 |
| 貝氏推論與分組線索（Grouping Cues） | 聽覺場景分析依賴於對自然聲音的先驗機率（Prior）。規律性特徵（如同發聲/同結束、諧波性）成為分組線索。 | 在「機制與現象」說明貝氏推論如何幫助大腦解決不適定問題。 |

## 重要細節
- **Definitions**:
  - **Pitch（音高）**: 基頻的感知對應物。
  - **Prosody（韻律）**: 音高隨時間變化的模式，常用於傳遞情緒與語氣。
  - **Timbre（音色）**: 常被定義為音高和響度之外，所有導致聲音聽起來不同的屬性。
  - **Loudness（響度）**: 聲音強度的感知對應物，遵循 Stevens 的冪法則。
  - **Ill-posed problem（不適定問題）**: 有無限多組解的問題，例如單一波形拆解成多個聲源。
- **Mechanisms**:
  - **Tonotopy（音調拓撲）**: 聽覺皮層中存在對頻率的空間映射（低-高-低），且對音頻敏感的特定區域與低頻區重疊，並延伸至其外。此區域對低次諧波有最強的神經反應。
  - **Marr's Levels of Analysis**: 計算層次（問題與目標）、演算法層次（解決步驟與表徵）、實作層次（神經硬體）。
- **Experiments / Demos**:
  - **名人聲音音高偏移**：改變 Obama 聲音的音高，辨識率大幅下降（3半音即顯著下降），證明音高對語音辨識至關重要。
  - **音高辨識心理物理實驗**：包含低次諧波（如第3諧波起）時，人類辨識音高差異（閾值）較好；僅含高次未解析諧波（如第10、15起）時辨識變差。fMRI 顯示大腦對應區域活躍度也有相同趨勢。
  - **樂器轉調實驗（Bassoon demo）**：將單一音符的頻譜整體平移來改變音高，會喪失原本樂器的音色。因為真實樂器有固定的共鳴腔（Filter），不同音高的相對頻譜形狀其實不同。
  - **倒放實驗（Bach backwards）**：鋼琴倒放聽起來不像鋼琴，證明時間包絡（Envelope）對音色感知非常重要。
  - **隨機聲音對比自然聲音**：隨機生成的聲音幾乎不可能聽起來像自然聲音，證明自然聲音只佔所有可能聲波的極小部分，這正是聽覺場景分析可行的基礎。
- **Lecturer Examples**: Kool & the Gang 的 "Summer Madness"（八度音跳躍展示諧波間距翻倍）。
- **Q&A Highlights**:
  - 聾人大腦的聽覺皮層可能被視覺或其他感覺重新利用（Repurposed）。
  - 響度感知除了強度外，其實也受頻寬影響（作業內容）。
  - 描述音色的科學詞彙很少（如 brightness, sharpness, roughness），因為它很難用語言精確捕捉。

## 現象與機制
1. **缺失基頻現象（Missing Fundamental）**
   - **Basis**: 聲音僅包含高次諧波，物理上不存在基頻能量。
   - **Evidence**: 聲音的整體週期仍對應基頻的倒數，人類感知的音高不變。
2. **諧波解析與未解析（Resolved vs. Unresolved Harmonics）**
   - **Basis**: 耳蝸基底膜過濾器的頻寬隨中心頻率增加。
   - **Evidence**: 低次諧波進入不同過濾器，產生明顯的空間頻譜峰值；高次諧波擠在同一個過濾器，頻譜峰值模糊，但會產生基頻頻率的振幅調變（拍頻 Beating）。
3. **音色感知雙重性**
   - **Basis**: 音色由頻譜包絡與時間包絡共同決定。
   - **Evidence**: 建立部分音（Partials）的實驗顯示頻譜形狀重要；聲音倒放實驗顯示時間包絡（特別是 Attack/Decay）極度重要。
4. **聽覺感知的貝氏推論**
   - **Basis**: $P(Hypothesis | Observation) \propto P(Observation | Hypothesis) \times P(Hypothesis)$
   - **Evidence**: 大腦利用對自然聲音特性的先驗機率（Priors，如同起/同滅、諧波規律），在無限可能的來源組合中選出最合理的解（Maximum A Posteriori）。

## 與前後章的連結
- **Prior chapter**: 前幾章應介紹了聲音的物理性質、耳蝸的頻率分析（Filters）以及聽覺神經的神經元反應（Phase locking, Spontaneous rates）。
- **Next chapter**: 將深入探討各種聽覺錯覺（Auditory Illusions）與特定的聽覺場景分析機制（如 Streaming）。
- **Terminology**: Tonotopy, Beating, Bayesian Inference, Marr's Levels of Analysis。

## 相關材料
- [待補：Lecture slides and figures for cochlear filters, excitation patterns, fMRI tonotopic maps]
- [待補：Problem set regarding loudness and bandwidth]

## 外部補充
- （留白）
