# AP 量的是排序，不是你要上線的那個點

Average Precision（AP）沿著 **分數排序** 把 Precision–Recall 曲線下的面積算出來。它問的是：把所有候選從高分排到低分，這份名單整條好不好。它 **不問** 你最終把 cutoff 釘在 0.4 還是 0.7。因此 AP 很高、現場作業點卻很差，可以同時成立：名單排序對，但你選的那一刀切在成本最差的位置。選 cutoff 見 [confidence-cutoff.md](confidence-cutoff.md)；切分規則見 [validation-test.md](validation-test.md)。

## COCO 評估協定

2026-09-08 對 `https://github.com/cocodataset/cocoapi/blob/master/PythonAPI/pycocotools/cocoeval.py`：bbox 預設 IoU 為 `.50:.05:.95`（十個門檻再平均，此即常見的 AP50:95）；recall 軸以 **101 個點** 插值；`maxDets` 評估 1 / 10 / 100。ignore、crowd、area 協定會改變計數。**不能**說「凡落在 ignore 區域的偵測都必然排除」——協定比這句口語細。

[threshold_demo.py](examples/threshold_demo.py) 只做單類、非 crowd、貪婪一對一，**不是完整 COCO**，亦未在真實 COCO 上執行。

## 同一個合成例子，兩種量法

5 個真框，8 個候選，分數 0.95、0.80、0.70、0.55、0.40、0.30、0.20、0.10。若凍結 cutoff=0.50：假設前四個依序是 TP、FP、TP、TP，則 TP=3、FP=1、FN=2，P=0.75、R=0.60。這是 **固定作業點**，對應現場會不會出框，也對應 [confidence-cutoff.md](confidence-cutoff.md) 要掃的成本。

AP 則不凍結 cutoff。COCO 風格在 recall = 0.00, 0.01, …, 1.00 共 101 點，取「達到該 recall 之後、precision 的最大值」，再平均。條件是：你真的在用這張 101 點網格，以及「向右看最大 precision」的插值，而不是自己用兩個 TP 點連線、或只報一個 F1。AP50 只在 IoU=0.50 做一次；AP50:95 把十個 IoU 的 AP 再平均。框很鬆地蓋住物體時，AP50 可以看起來像 0.72、AP50:95 只剩 0.41——排序仍對，定位卻差。這兩個數都 **不能** 代替用成本掃出來的作業點。

maxDets=100 表示每張圖最多納入 100 個偵測；密集場景第 101 個真框進不了這次計數。area 分桶會把小／中／大物體拆開平均；crowd 與 ignore 則改寫哪些配對算數。缺任何一條，你算出來的就不是 COCO AP，只是另一個排序分數。

## 失敗模式與驗收

失敗：用 AP50:95 當上線依據，實際卻在 0.25 出框；把 YOLO 摘要 P/R（max-F1）和 COCO AP 都叫「準確率」；忽略 maxDets；對 crowd／ignore 使用「看見就排除」的口語規則。

驗收：報告同時給排序 AP（註明 IoU 集合與是否 101 點）以及選定 cutoff 的 P/R/成本；寫明單類貪婪匹配 ≠ COCO；比較模型時 AP 與作業點分開排行，避免「AP 冠軍、現場誤報最多」。

回 [index.md](index.md)。
