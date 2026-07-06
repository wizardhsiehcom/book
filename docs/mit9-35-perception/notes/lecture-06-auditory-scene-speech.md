# 閱讀筆記：Lecture 06: Auditory Scene Analysis (cont'd) and Speech Perception

## 基本資料
- **Lecture:** 06
- **Title:** Auditory Scene Analysis (cont'd) and Speech Perception
- **Transcript Path:** `/Users/wizard/Desktop/MacCode/book/data/mit9.35/transcripts/6： Auditory Scene Analysis (cont'd) and Speech Perception [A9j5TFfysoU].txt`
- **Reading Date:** 2026-07-06
- **Reader:** AI Assistant
- **Status:** Complete

## 逐字稿完整閱讀紀錄
- **Start:** 0 bytes
- **End:** 74,476 bytes
- **Complete reading confirmed:** Yes
- **Skipped sections:** None

## 本講主問題
本講接續探討聽覺場景分析，解釋大腦如何運用貝氏推論解決多聲源的推論問題，並探討大腦皮層如何在「雞尾酒會問題」中表徵被注意的特定語音。接著，課程轉入語音知覺，介紹語音產生的「聲源-濾波器」模型，以及母音和子音的聲學特徵。最後，探討語音知覺面臨的「協同發音」帶來的恆常性挑戰，並介紹「類別知覺」如何幫助我們在連續變化的聲學特徵中提取離散的語音單位（音素）。

## 核心概念

| Concept | Explanation | How to handle in chapter |
|---|---|---|
| 貝氏推論與聽覺場景分析 (Bayesian Inference in ASA) | 聽覺場景分析可以視為一種感知推論，大腦試圖找出在給定觀察（聲音）下後驗機率最高的假說（聲源狀態）。錯覺揭示了大腦對世界（如諧波、共發作）的先驗假設。 | 放在第一節，強調這是一個高維度的搜尋問題。 |
| 頻譜時間感受野 (STRF) | 神經元對特定頻率與時間調變模式的偏好。聽覺神經處理音頻 (Audio Frequency)，但中腦和皮層處理的是調變頻率 (Modulation Frequency)。 | 解釋濾波器的串聯結構。 |
| 雞尾酒會的神經表徵 | 透過癲癇患者的皮層內記錄 (ECoG)，發現在上顳回 (STG)，大腦對混合語音的表徵會強烈偏向受試者主動注意的那個語音。 | 用於連結聽覺場景分析與注意力的實際神經證據。 |
| 聲源-濾波器模型 (Source-Filter Model) | 語音由聲源（喉部的聲帶振動產生諧波）與濾波器（聲道、口腔、鼻腔改變共振頻率）共同產生。 | 作為理解語音聲學特徵的基礎理論。 |
| 母音與子音的聲學特徵 | 母音由共振峰 (Formants, F1, F2) 決定；子音由發音部位、發音方法與發聲起始時間 (VOT) 等特徵決定。 | 介紹如何看語音的頻譜圖，解釋寬頻帶分析 (小時間窗口) 凸顯共振峰的原因。 |
| 協同發音 (Co-articulation) | 音素的聲學特徵會因為前後相鄰的音素而改變，導致語音知覺必須解決「恆常性」問題。 | 說明語音知覺為何困難。 |
| 類別知覺 (Categorical Perception) | 人類對連續變化的聲學特徵（如 VOT 連續變化的 ca 到 ga），會產生非線性的分類：在邊界處區辨力最強，而在同一類別內難以區辨。 | 作為解決語音變異性的一種心理物理機制。 |

## 重要細節
- **Definitions:**
    - **Audio Frequency vs. Modulation Frequency:** 音頻是聲音波形本身的頻率（傅立葉轉換）；調變頻率是聲音包絡（Envelope）隨時間變化的低頻。
    - **Spike-triggered average (STA):** 觸發神經元發射動作電位的平均刺激前導訊號，用於估算神經元的 STRF。
    - **Phonemes (音素):** 能改變語意的最小語音單位。
    - **Formants (共振峰):** 聲道濾波器的共振頻率峰值（F1, F2, F3）。
    - **Voice Onset Time (VOT):** 子音釋放氣流到聲帶開始振動之間的時間差。
- **Mechanisms:**
    - 母音的發音：F1 對應舌頭高低，F2 對應舌頭前後。
    - 子音的分類：發音部位 (Place: labial, dental, velar)、發音方法 (Manner: stop, fricative, nasal)、發聲 (Voicing: voiced vs. unvoiced)。
- **Experiments / Illusions / Demos:**
    - **Yanny vs. Laurel:** 語音模糊性的例子，展示高低通濾波的影響及知覺遲滯現象 (Hysteresis)。
    - **Categorical Perception Demo:** 播放 VOT 漸變的 ga-ca 序列，聽者會突然在某一點切換知覺，而非漸進改變。
- **Lecturer Examples:**
    - 發音練習：bet vs. but, boot vs. beat，體會舌頭位置的改變。
    - BP vs DT vs GC，感受不同發音部位與有無發聲 (Voicing) 的差異。
    - 悄悄話 (Whispering)：聲帶不振動，但濾波器（聲道）仍對氣流噪音進行塑形，因此仍可辨識語意。

## 現象與機制
- **機制：語音的類別知覺 (Categorical Perception)**
    - **基礎：** 聲學特徵 (如 VOT) 是連續的，但知覺是離散的音素類別。
    - **證據：** 陡峭的分類函數 (Steep categorization function)；類別邊界處的區辨力最高，類別內區辨力低。
- **現象：協同發音 (Co-articulation)**
    - **基礎：** 發聲器官的物理與機械限制（需要從一個狀態平滑過渡到下一個狀態）。
    - **證據：** 相同的子音（例如 /d/），接在不同母音前，其起始頻譜特徵完全不同，但聽起來卻是同一個音。

## 與前後章的連結
- **Prior chapter:** 延續前一章 (05) 的聽覺場景分析 (ASA)，本章將 ASA 放在貝氏推論的框架下，並帶入神經層面的探討。
- **Next chapter:** 本章是聽覺部份的最後一講，之後可能進入視覺。
- **Terminology:** ASA, Bayesian Inference, Co-articulation. 需要統一「共振峰」(Formants)、「頻譜時間感受野」(STRF) 的譯名。

## 相關材料
- `待補` (Cocktail party EEG/ECoG study by Mesgarani & Chang, 2012)
- `待補` (STA / STRF 實驗圖表)
- `待補` (Yanny / Laurel 頻譜圖)
- `待補` (Categorical Perception 曲線圖)

## 外部補充
(留白)
