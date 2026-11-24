# Book 首頁素材交接

首頁的 `#imgSvg` 直接顯示[新版 Scarlet 蓄勢 v5](book-keyframe-ready-v5.png)，點書後短停 90 毫秒再切換出刀 v13。最初的[Scarlet 原畫](../archive/scarlet-original/archivist-scarlet.png)保留作為臉部畫風基準。下文的 localhost 試播需另行啟動 Mesh Avatar Studio。

# Scarlet 斬擊轉場試作紀錄

目標是在 Book 書庫點書時，讓 Scarlet 的出刀瞬間有張力。以《邊獄巴士》斬擊給人的短促、銳利感為節奏參考。試作以兩張關鍵圖呈現角色的蓄勢與出刀。

**點書 → 握柄畫面短停 → 出刀定格與刀光同拍 → 切入書頁**

## 現有基礎

- book 已有點擊蓄勢、目標書卡的切線和跨頁 View Transition，並保留原生導覽與減少動態效果設定。來源為 `D:/book/README.md` 的「預覽書庫與拔刀轉場」。
- Scarlet 的左右衣襬已分層並驗收小幅擺動。刀鞘和垂下的手指已有透明素材，播放版將兩者合在身體前景。出刀定格需要畫出握刀手、袖口和出鞘刀身的關係。[本機動態預覽](http://127.0.0.1:5173/stream.html?project=archivist-scarlet-layered&bg=c6c6cb)
- 早期站姿試作採用[校直刀鞘的側身圖](../archive/scarlet-original/standing-v3.png)。[刀鞘](scabbard.png)和[前景手指](foreground-hand.png)可用來對齊遮擋。

## 已確認的臉部基準

- 臉部以最早的[原始側身插畫近景](scarlet-original-face-crop.png)為準。使用者已確認[三視圖臉部 v5](scarlet-turnaround-original-face-v5.png)及本輪的表情與畫風調整。[原圖與修訂比對](scarlet-chin-volume-comparison.png)
- 保留原圖偏瘦、帶骨相的臉。下唇到下巴的距離收短，顴骨、鼻側和下顎以柔和的明暗轉折呈現體積，保留乾筆質感。眉眼和嘴角自然放鬆。眼影用低彩度灰棕集中在上眼皮和外眼角，下眼周只留淡影。
- 骨相靠臉部輪廓與明暗塑造。眉眼的銳利程度要以原圖的淡然神情核對。

## 本機試播

[播放蓄勢與出刀](http://127.0.0.1:5173/projects/archivist-scarlet-layered/slash-blocking-preview.html?art=pose-match)。斬擊光預設關閉，可以先核對角色動作。

| 階段 | 本輪素材與效果 |
| --- | --- |
| 蓄勢 | [蓄勢 v5](book-keyframe-ready-v5.png)，點書後停留 90 毫秒。 |
| 出刀 | [出刀 v13](book-keyframe-strike-v13.png)，定格停留 260 毫秒。角色左手持刀，空鞘在右腰。護手到刀尖的畫面長度約 518 px。 |
| 切頁 | 本機試播切入模擬書頁。Book 的跨頁轉場留待整合時驗證。 |

目前已驗證桌面、手機及減少動態效果下的本機試播。待確認項目是出刀格的空鞘比例，以及刀光沿刀身方向掠過時與書卡的位置。現版刀光會從書卡下方掠過。

## 研究依據

- **短動作的節奏。** Shawn Kelly 示範從影片挑出重心轉移的瞬間，畫成小草圖，再用 3D 排姿勢。《Skullgirls》主動畫師 Mariel Cartwright 則用少幀數的攻擊說明，預備動作、清楚的關鍵姿勢與停留時間可以撐起力道。Scarlet 採兩張關鍵圖，再於試播中調整切換時機。[Animation Mentor](https://www.animationmentor.com/blog/5-key-steps-for-effective-blocking/) · [GDC 演講](https://gdcvault.com/play/1020575/Animation-Bootcamp-Fluid-and-Powerful)
- **3D 的用途。** 《Dead Cells》用 3D 製作 2D 精靈圖，主要收益是反覆改姿勢、改時間和重用素材。本案採用現成骨架檢查全身重心，再把左前臂、手和刀對到同一套鏡位。Clip Studio 兩套作者示範提供了可比較的手背、掌側、護手與握柄遮擋。[Motion Twin 製作紀錄](https://www.gamedeveloper.com/production/art-design-deep-dive-using-a-3d-pipeline-for-2d-animation-in-i-dead-cells-i-) · [片手劍 A](https://assets.clip-studio.com/en-us/detail?id=2166189) · [線畫屋 3D 手模](https://assets.clip-studio.com/en-us/detail?id=2181964)
- **刀身與刀鞘比例。** 東京國立博物館一件藏品的刃長為 65 cm、鞘長為 70.2 cm。大都會博物館另一件的切刃長為 70.1 cm。這些個別藏品用來交叉檢查畫面比例。Scarlet 的刀身仍以自己的三視圖和空鞘量測為主要依據。[東京國立博物館藏品](https://jpsearch.go.jp/item/cobas-158937) · [大都會博物館藏品](https://www.metmuseum.org/art/collection/search/23375)

## 試錯與判斷

| 遇到的問題 | 怎麼查出來、怎麼修 |
| --- | --- |
| 早期預覽只看得到刀光和圖像位移，角色沒有明顯出刀動作。 | 用同一骨架、同一鏡位先排蓄勢與出刀，再關掉刀光試播。兩格有可見的重心下沉、肩膀轉動與伸臂。切換仍有跳切感，留待正式轉場驗收。[灰模姿勢對照](scarlet-pose-pair.png) |
| 全身灰模能看出刀尖，手模能看出指節，但分開給圖時，生圖反覆畫錯手背、掌側和握柄方向。曾為了對上書卡把刀改成右上，偏離參考姿勢。 | 從 Blender 第 17 格核對肩、肘、腕和刀軸。接著把前臂、左手與刀放入同一場景，鎖住握點，只換相機檢查。成圖鏡位定為拇指靠護手、四指從握柄下緣包上來。v4 的方向獲得確認，刀尖的彎曲仍會讓護手到刀尖的直線稍平。[手腕與刀軸標記](scarlet-left-wrist-pose-guide.png) · [三角度手部對照](scarlet-grip-shape-review.png) · [v4 放大比對](scarlet-grip-v4-comparison.png) |
| v5 在全身圖上微修手指，造型改善有限。挖空後重畫的 v6 指節較清楚，但膚色偏暖、筆觸偏寫實，指尖有暗邊。 | 用局部生圖重建手部，再以臉和另一隻手為膚色與筆觸依據。以袖口、柄尾、護手和刀身定位後，只合成需要修補的區域，並逐像素核對區域以外。[v5 到 v6](scarlet-grip-v6-comparison.png) · [v6 到 v7](scarlet-grip-v7-comparison.png) |
| v8 加寬畫布後，仍覺得出鞘刀太短。 | 量得 v8 的刀身約 340 px、同格空鞘約 455 px。灰模鏡位保留約 98% 的刀軸長度，透視縮短幅度很小。以三視圖推估後把 v9 試排到約 518 px，保持角色尺寸與握點。刀鞘在出刀格的投影比例仍待確認。[量測圖](scarlet-blade-length-audit.png) · [同尺寸長度試排](scarlet-blade-v9-comparison.png) |
| 臉部最初只改了眉眼，後來拉強骨相和乾筆，仍出現下巴過長、臉部偏扁和眼影不一致。 | 回到第一張角色原圖，同時校對輪廓、明暗、眼影和淡然表情。最後一輪收短下巴，補回顴骨與鼻側的體積，將灰棕眼影收在上眼皮和外眼角。使用者已確認此版。[骨相與筆觸試稿](scarlet-bone-planes-comparison.png) · [已確認的臉部比對](scarlet-chin-volume-comparison.png) |

歷版的輸入參考、生成提示與輸出檔名見[關鍵圖生成紀錄](book-keyframe-prompts.md)。

## 驗收條件

- 在書庫的實際角色大小與正常播放速度下，一次點書能讀出短停後的出刀瞬間，刀光只出現一次。
- 出刀那格的握刀手、刀柄和刀身對得上，刀光與角色動作同步，切線穿過被點選的書卡。
- 點書仍可立即導覽，動畫遵循 book 的減少動態效果與角色顯示設定。

