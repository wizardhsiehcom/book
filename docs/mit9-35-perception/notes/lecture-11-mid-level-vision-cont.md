# Lecture 11: Mid-Level Vision (cont'd) 閱讀筆記

## 基本資料
- Lecture number: 11
- Title: Mid-Level Vision (cont'd)
- Transcript path: /Users/wizard/Desktop/MacCode/book/data/mit9.35/transcripts/11： Mid-Level Vision (cont'd) [4FXDthnSA5c].txt
- Reading date: 2026-07-06
- Reader: Agent
- Status: Complete

## 逐字稿完整閱讀紀錄
- Start: 0
- End: 69055 bytes
- Complete reading confirmed: Yes
- Skipped sections: None

## 本講主問題
本講接續上一講探討中階視覺（Mid-level vision）的現象，並進一步探討這些現象背後的運算層次解釋（如自然場景的統計規律）與神經機制（如 V2 區的邊界擁有權與錯覺輪廓神經元）。最後引入了下一個大主題：明度知覺（Lightness perception），解釋視覺系統如何從接收到的光亮度（Luminance）中，拆解出物體的反射率（Reflectance）與光源照明（Illumination），從而達成明度恆常性（Lightness constancy）。

## 核心概念 table
| 核心概念 | 解釋 | 在章節中的處理方式 |
| :--- | :--- | :--- |
| 中階視覺的機率推論 | 知覺分組、圖地反轉等現象可視為大腦對真實世界物體屬性（機率分佈）的內化。 | 作為中階視覺現象的理論框架，以計算層次（Computational level）來解釋現象。 |
| 錯覺輪廓與補全 (Illusory contours & Completion) | 在缺乏局部影像證據的情況下感知到邊緣。分為模態補全（Modal completion，看見輪廓）與非模態補全（Amodal completion，感覺邊緣被遮蔽）。 | 透過經典錯覺圖形與相對應的 V2 神經元實驗來解釋現象與神經機制。 |
| 圖與地 (Figure and Ground) | 視覺系統將影像劃分為圖（物體）與地（背景），邊緣屬於「圖」（Border ownership）。 | 引用 Berkeley 的自然場景統計研究，證明大小、凸性等圖地線索是基於真實世界的統計規律。 |
| V2 區的神經關聯 (Neural correlates in V2) | V2 區的神經元能對錯覺輪廓產生反應，並能編碼邊界擁有權（Border ownership）。 | 作為實作層次（Implementation level）的證據，說明中階視覺特徵在 V2 區已有表徵。 |
| 明度知覺與反射率 (Lightness perception & Reflectance) | 視覺系統需估計物體表面的色素分佈。我們感知的明度（Lightness）是對物體反射率（Reflectance）的估計。 | 定義明度與反射率，作為明度恆常性問題的基礎。 |
| 朗伯表面與材質 (Lambertian surface & Material) | 朗伯表面向各個方向均勻散射光線。真實世界還有高光反射（Specular reflection）與半透明（Translucency）。 | 簡單介紹光學特性，並聚焦於假設物體為朗伯表面的簡化模型。 |
| 明度恆常性 (Lightness constancy) | 在不同光照環境下，我們對物體明度的感知能保持穩定。這是一個反求乘積的不適定問題（Ill-posed problem）。 | 說明問題的本質：Luminance = Reflectance × Illumination，為下一講的錯覺現象鋪陳。 |

## 重要細節
- **Definitions**:
  - **Relatability**: 決定非模態補全是否發生的條件，被遮蔽的輪廓是否能平滑連接。
  - **Border ownership**: 輪廓歸屬於圖的一方。
  - **Lightness**: 對表面反射率的主觀知覺關聯。
  - **Lambertian reflectance**: 光線均勻向各方向散射的表面。
  - **Luminance**: 眼睛實際接收到的光照強度（Illumination 與 Reflectance 的乘積）。
- **Mechanisms**:
  - V2 區神經元對錯覺輪廓的反應（Rüdiger von der Heydt 的實驗）。
  - V2 區神經元對邊界擁有權（Border ownership）的方向性選擇反應。
- **Experiments/Illusions/Demos**:
  - **Snake/Contour detection amid Gabors**: 證實輪廓的平滑性與統計規律會影響知覺分組。
  - **Kanizsa triangle (Modal completion)**: 看見不存在的白色三角形輪廓。
  - **Occluded rectangles (Amodal completion)**: 感覺長方形延伸到遮蔽物後方。
  - **Rubin vase**: 經典的圖地反轉（Bistable）現象。
  - **Berkeley ground truth dataset**: 從人類標註的自然場景影像中，證實較小面積、較凸的區域通常是「圖」。
  - **Shadow to Paint demo**: 用黑筆把影子的邊緣描黑，會讓大腦將其從「照明改變」重新詮釋為「反射率改變（塗料）」。
  - **Simultaneous contrast**: 相同亮度的灰色方塊，在黑背景下看起來較白，在白背景下看起來較黑。
- **Psychophysical data**: 
  - Gabor 輪廓偵測任務的正確率隨相鄰 Gabor 角度變化而下降。
  - 基於三種線索（Size, Convexity 等）的圖地預測分類器，正確率可達約 75%。
- **Lecturer examples**: 
  - 長滿手的手指、極長的牛（非模態補全在真實世界造成的錯覺）。
  - 皮膚上的防曬乳反光被誤認為腿本身發亮（材質知覺）。
  - 黑板擦與白紙在室內外不同光照下的亮度變化（明度恆常性例子）。
- **Q&A highlights**: 學生問到圖地預測分類器為何只有 75% 正確率，教授回應可能缺乏全域脈絡（Global context）、知識先驗，或有其他未測量的線索。

## 現象與機制
- **知覺分組（機率推論模型）**
  - **Name**: Perceptual Grouping as Probabilistic Inference
  - **Basis**: 真實世界邊緣的統計規律（平滑、連續）。
  - **Evidence**: 在自然場景中統計水平邊緣附近的邊緣分佈，並用 Gabor 陣列實驗證實人類對符合自然統計規律的輪廓偵測率較高。
- **錯覺輪廓與補全**
  - **Name**: Illusory Contours & Completion
  - **Basis**: 處理遮擋（Occlusion）的工程解決方案。
  - **Evidence**: Rüdiger von der Heydt 發現 V2 神經元對錯覺輪廓有反應。
- **圖與地**
  - **Name**: Figure and Ground Assignment
  - **Basis**: 判定邊緣屬於哪一個物體（Border ownership）。
  - **Evidence**: Berkeley 的統計研究證實心理學的觀察（凸面、小面積為圖）；V2 神經元表現出對邊界擁有權的選擇性。
- **明度恆常性**
  - **Name**: Lightness Constancy
  - **Basis**: 視覺系統將進入眼睛的亮度（Luminance）拆解為光照（Illumination）與反射率（Reflectance）。

## 與前後章的連結
- **Prior chapter**: 延續上一章對於中階視覺與早期視覺特徵的討論。
- **Next chapter**: 開啟了明度知覺與恆常性的討論，後續會介紹同時對比（Simultaneous contrast）與各種明度錯覺。
- **Terminology to unify**:
  - Mid-level vision: 中階視覺
  - Perceptual grouping: 知覺分組
  - Figure and ground: 圖與地
  - Illusory contour: 錯覺輪廓
  - Modal/Amodal completion: 模態/非模態補全
  - Border ownership: 邊界擁有權
  - Lightness constancy: 明度恆常性
  - Reflectance: 反射率
  - Illumination: 照明
  - Luminance: 亮度/光亮度
  - Lambertian surface: 朗伯表面/漫反射表面

## 相關材料
- 待補：Rüdiger von der Heydt 的 V2 神經元實驗圖表
- 待補：Berkeley 圖地統計資料庫圖表
- 待補：Shadow to Paint 演示影片或圖片

## 外部補充
