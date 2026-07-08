# 第 3 章：Epsilon Photography 與單張多域相機

對應講次：Lecture 3
影片主題：
- Epsilon Photography: Improving Film-like Photography
- Single-shot Multi-domain Camera
對應講義：MITMAS_531F09_lec03.pdf、MITMAS_531F09_lec03_2.pdf

## 導讀

傳統攝影在按下快門的瞬間，受限於感測器的動態範圍、鏡頭光圈與對焦平面，往往只能妥協於某一種拍攝設定。本章節探討 Epsilon Photography（微差攝影），這是一種藉由在時間、感測器或像素層面引入微小變數，多次擷取場景資訊並以計算機視覺技術疊加融合的方法，旨在突破單一曝光的物理限制。

## Epsilon Photography 的三個維度

Epsilon Photography 的核心概念在於擷取大量具有微小變異的資料並結合，主要可分為三個維度：

1. **Epsilon in Time（時間維度）**
   - 在不同時間點連續拍攝多張參數不同的照片（Bracketing）。
   - **高動態範圍（HDR）合成**：拍攝多張不同曝光時間的照片，將亮部與暗部的細節結合。
   - **焦點堆疊（Focal Stacks）**：對焦於場景中的不同深度連續拍攝，再利用梯度域（Gradient domain）融合技術，產生全景深（All-in-focus）的清晰影像。

2. **Epsilon in Sensors（感測器維度）**
   - 利用多個共焦的感測器或相機陣列，在同一時間獲取多維度資訊，解決了時間維度無法拍攝動態場景的缺點。
   - **3CCD 系統**：透過分色稜鏡（Dichroic prism）將光線無損分離至三個感測器。
   - **相機陣列（Camera Arrays）**：例如 Mitsubishi 開發的 8 相機共焦系統，或是 Stanford 開發的大型相機陣列，能同時擷取不同焦距、不同曝光或不同視角的影像。

3. **Epsilon in Pixels（像素維度）**
   - 在單一感測器上，讓相鄰的像素負責擷取不同的資訊，這是一種空間多工技術。
   - **Bayer Filter**：最常見的像素級濾波，相鄰像素分別擷取紅、綠、藍光。
   - **Assorted Pixels**：在像素陣列上附加不同透光率的中性密度濾鏡，讓單次曝光就能兼顧極亮與極暗的細節。

## 合成孔徑與景深控制

### Synthetic Aperture Photography
透過相機陣列擷取多個微小視角差異（Epsilon in position）的影像，利用「平移與相加」（Shift and Add）的演算法，可以計算並模擬出具備大光圈鏡頭的極淺景深效果。這種技術也使得「數位重對焦」（事後決定對焦平面）成為可能，甚至能穿透前景的障礙物（如樹叢）看見後方。

### Image Destabilization
有別於軟體計算，有研究提出在曝光期間同步且精準地移動相機感測器與鏡頭，改變光路與對焦平面的比例，從而以純光學的方式，利用便宜的小光圈鏡頭模擬出昂貴大光圈鏡頭的淺景深效果。

## 常見誤解

- **將影像後製的模糊與光學淺景深混為一談**：單純從單張 2D 影像進行模糊處理，無法正確反映場景中物體的真實 3D 深度關係，邊緣也常出現不自然的光暈（Halo）。Epsilon Photography 則是透過多張影像提供的真實深度線索來重建模糊。

## 小結

Epsilon Photography 為運算攝影奠定了重要的基礎思想：我們不再苛求一次完美的曝光。相反地，透過擷取大量具有微小變異的冗餘數據，再交由計算機進行智慧地縫合與還原，就能產生超越物理硬體極限的完美影像。

---
*(註：本章後半部 Single-shot Multi-domain Camera 的內容將於後續處理補充。)*
