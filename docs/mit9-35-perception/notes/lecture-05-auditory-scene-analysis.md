# 閱讀筆記：Lecture 05 Auditory Scene Analysis

## 基本資料
- Lecture number: 05
- Title: Auditory Scene Analysis
- Transcript path: `/Users/wizard/Desktop/MacCode/book/data/mit9.35/transcripts/5： Auditory Scene Analysis [_Pdlr0jOhbQ].txt`
- Reading date: 2026-07-06
- Reader: AI Agent
- Status: Completed

## 逐字稿完整閱讀紀錄
- Start: 0 bytes
- End: 73,649 bytes
- Complete reading confirmed: Yes
- Skipped sections: None

## 本講主問題
本講探討聽覺系統如何解決「聽覺場景分析」（Auditory Scene Analysis, ASA）的挑戰，特別是經典的「雞尾酒會問題」。由於抵達耳朵的聲波是多個環境聲源的線性疊加，這在數學上是一個病態問題（ill-posed problem）。大腦必須依賴在演化和發展過程中內化的真實世界聲音統計規律（先驗知識/priors），利用一系列的分群線索（grouping cues），將混雜的聲音能量正確歸屬到不同的聲源，甚至在聲音被遮蔽時進行連續性推論（填補）。

## 核心概念
| 概念 | 解釋 | 在章節中的處理方式 |
|---|---|---|
| 等響度曲線 (Equal Loudness Contours) | 不同頻率聽起來一樣大聲所需的物理強度。低音量時中頻突出，高音量時各頻率趨於平坦。 | 放在導讀或機制前段，作為前一章的補充說明。 |
| 共同起始與舊加新捷思 (Common Onset & Old-plus-new heuristic) | 突發的能量改變會被視為新聲源；逐漸改變則視為單一聲源的強度變化。 | 作為第一個分群線索。 |
| 共同調變遮蔽解除 (Co-modulation Masking Release, CMR) | 跨頻帶的噪音若具有相同的包絡線（共同調變），有助於區分噪音與目標音，使偵測閾值下降。 | 結合遮蔽效應，用來解釋包絡線的群組化作用。 |
| 諧波性與失調 (Harmonicity & Mistuning) | 頻率成整數倍的聲音會被視為同一聲源。將其中一個諧波失調（mistuning）約2%，該諧波就會獨立出來成為另一聲音。 | 解釋音高計算如何依賴於先完成的分群。 |
| 重複性 (Repetition) | 重複出現的聲音結構有助於在複雜背景中將其分離出來，常見於動物叫聲。 | 作為時間維度的分群線索。 |
| 雙耳遮蔽音量差 (Binaural Masking Level Difference, BMLD) | 當目標音與遮蔽音在空間上（或相位上）分離時，偵測閾值可大幅改善（達20dB）。 | 作為空間線索幫助場景分析的證據。 |
| 優先效應 (Precedence Effect) | 在有殘響的環境中，大腦會抑制延遲到達的反射音，將聲音定位在最先抵達的聲音方向。 | 結合類神經網路模型，證明這是對殘響環境的演化適應。 |
| 音流分離 (Stream Segregation) | 交替的高低音，若頻率差太大或速度太快，會分裂為兩個獨立的音流，且難以判斷跨音流的時間關係。 | 探討較長時間尺度的場景分析。 |
| 連續性效應與語音修復 (Continuity Effect & Phonemic Restoration) | 當聲音被噪音遮蔽時，大腦會推論聲音在背景中持續存在，甚至主觀上「聽見」被遮蔽的語音。 | 放於章末，展示大腦的主動推論與填補機制。 |

## 重要細節
- **等響度曲線的實務意義**：音樂混音在低音量與高音量播放時聽感不同，低音量時需要大幅增強低頻與高頻。
- **Old-plus-new 實驗**：交替播放寬頻噪音與低通噪音，大腦會將寬頻噪音拆解為「持續的低通噪音」加上「間歇的高頻脈衝」。
- **CMR 數據**：增加共同調變的噪音頻帶，反而讓閾值降低約10 dB（違反傳統的臨界頻帶越寬閾值越高的直覺）。
- **諧波失調對音高的影響**：微小的失調（<2%）會稍微改變複合音的音高；但一旦失調太大，該諧波獨立出來，反而不再影響原複合音的音高。
- **Reynolds-McAdams Oboe**：將偶數諧波加上頻率調變（FM），偶數諧波會分離出來，剩下的奇數諧波聽起來像雙簧管。
- **優先效應的建立（Buildup）**：一開始可能聽見兩個聲音，但重複播放後，延遲音的知覺會逐漸被抑制。
- **音流分離的客觀後果**：主觀上聽成兩個音流後，客觀上無法準確分辨低音是否「恰好位在兩個高音的正中間」。
- **聲音紋理（Textures）的連續性**：如掌聲、雨聲等「穩態（stationary）」聲音，即使被遮蔽長達 2 秒，大腦仍能填補；但語音或音樂等非穩態聲音只能填補很短的時間（如 200 毫秒）。

## 現象與機制
1. **等響度曲線 (Fletcher-Munson Curves)**：大腦對各頻率的響度感知非線性。
2. **Old-plus-new Heuristic**：大腦預設持續存在的頻率屬於舊聲源，新加入的頻率屬於新聲源。
3. **Co-modulation Masking Release (CMR)**：利用背景噪音在跨頻帶上的振幅一致性來分離目標。
4. **Precedence Effect**：聽覺系統對抗殘響（Reverberation）的機制，抑制數毫秒內的反射音（Discrimination suppression）。
5. **Streaming**：頻率與時間的鄰近性決定音流的分散與聚合。
6. **Continuity Effect**：貝氏推論的體現，若中斷處有足夠強的遮蔽音，大腦會推論信號持續存在。

## 與前後章的連結
- **前章連結**：
  - 第四章：遮蔽效應（Masking）、臨界頻帶（Critical Bands）—— CMR 是其延伸與反直覺現象。
  - 第四章：聲音定位（Sound Localization）、ITD/ILD —— BMLD 與優先效應直接相關。
  - 第三章：音高知覺（Pitch Perception）—— 諧波的解析度（Resolved harmonics）與音高計算建立在分群結果之上。
- **後章連結**：將與高階語言或語音知覺（Speech Perception）相關（Phonemic restoration）。

## 相關材料
- 待補：投影片中的各項展示圖表（如 CMR 的頻譜圖、Precedence effect 的模型實驗圖）。
- 待補：各項錯覺展示的音檔對應連結。

## 外部補充
- 留白
