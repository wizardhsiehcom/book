# 偵測錯誤分析：把假象拆開再下刀

錯誤分析不是把 [評估](../06/index.md) 分數再講一遍，而是問：這筆誤差從哪裡來、哪裡不該被當模型罪。公開定義以 COCO 評估器與常見驗證流程為準：類別感知匹配、未匹配預測計為 FP、未匹配標註計為 FN（[pycocotools/cocoeval.py](https://github.com/cocodataset/cocoapi/blob/master/PythonAPI/pycocotools/cocoeval.py)；[Ultralytics val](https://docs.ultralytics.com/modes/val/)，查閱 2026-09-08）。切分與因果桶是工程分析，不是官方強制。

## 標註缺口會改寫帳

缺 GT 可把正確預測變成「看起來的 FP」：預測對了，評估器找不到可匹配框，就記 FP。未標的漏檢對一般 FN 帳是隱形的：FN 只計「有標註、卻沒有匹配預測」的 GT。錯類在類別感知評估裡，通常同時是預測類的 FP 與真實類的 FN。因果分類可以另開互斥桶（漏標、錯類、定位、閾值），不要重定義官方 TP/FP/FN。

接近閾值的偵測不證明校準失敗；只證明該框落在截止附近。重疊與 NMS 是假設，不是遮擋的證明：要對照 [推論](../11/index.md) 前後候選，才能分開抑制與真遮擋。全域截止是合法基線；[切片評估](../19/index.md) 不必每片另設截止。分組只在資料、成本或可辨識情境（日／夜、鏡頭）成立時才做。

## 合成日夜召回：完整算一次

玩具 GT：白天 7、夜晚 3，合計 10。匹配後 TP：白天 7、夜晚 1。召回 \(R = TP / \#GT\)。

- 總召回：\(7+1=8\) 個 TP，\(8/10=0.8\)。
- 夜召回：\(1/3\)。
- 白天召回：\(7/7=1\)。

數字對，但 \(n\) 小，沒有統計保證。聚合 0.8 會蓋住夜段。這與 [資料](../04/index.md)、[標註](../05/index.md) 是否按情境覆蓋有關，不是單看總分。

```python
import unittest

class TestRecall(unittest.TestCase):
    def test_day_night(self):
        gt_day, gt_night = 7, 3
        tp_day, tp_night = 7, 1
        self.assertEqual(tp_day + tp_night, 8)
        self.assertAlmostEqual((tp_day + tp_night) / (gt_day + gt_night), 0.8)
        self.assertAlmostEqual(tp_night / gt_night, 1 / 3)
        self.assertEqual(tp_day / gt_day, 1)

if __name__ == "__main__":
    unittest.main()
```

斷言只鎖定合成計數與定義，不是實測成績。

## 營運抽樣：看圖，不改評估器

抽 FP 圖查缺標：框合理但 GT 空，優先修標而非加懲罰。抽 FN 圖看低置信與定位：框在、分數低是閾值問題；框偏是定位；完全沒候選才像漏檢。比對後處理前候選與 NMS 後輸出，避免把抑制當成沒偵測到。評估器凍結：同一 IoU、同一類別規則、同一全域截止，才比較 [基線](../07/index.md) 與後續 [改進](../14/index.md)。錯誤清單對齊 [錯誤](../13/index.md) 頁的可重現欄位。

接受條件：能指出至少一筆「缺標造成的假 FP」與一筆「有 GT 無匹配的真 FN」；日夜分母與 TP 可複算；錯類用 FP+FN 雙記而不改公式；未把閾值附近或 NMS 當校準／遮擋鐵證；切分未另設截止除非成本或情境要求。分析結束後分數應能對回同一套公開匹配定義。
