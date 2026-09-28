# CoWoS 結構來源核對

查核日期：2026-09-28。由 Luna 子代理瀏覽第一手資料並回報，主代理彙整；用於 `resources/package-path/` 的結構示意。

## 來源與採用主張

1. [TSMC CoWoS 官方技術頁](https://3dfabric.tsmc.com/english/dedicatedFoundry/technology/cowos.htm)
   - S 使用 silicon interposer。
   - R 使用聚合物與銅構成的 RDL interposer；官方明列 RDL 可連 SoC 與 HBM。因此不能把一般封裝基板的線寬限制直接套用到 RDL 中介層。
   - L 是 RDL 中介層與嵌入式 LSI 的整合；LSI 提供局部高密度晶片間互連，包含 SoC–HBM。較大範圍的 RDL 負責其餘訊號與電源連接。
   - 官方家族說明沒有把「LSI 必須含 TSV」列為 L 的定義；故事省略 L 的詳細垂直通道，不把局部橫向互連畫成整片矽的下行 TSV。
2. [SK hynix：Semiconductor Back-End Process, Packages Part 2](https://news.skhynix.com/en/semiconductor-back-end-process-episode-4-packages-part-2/)
   - HBM 以 DRAM 垂直堆疊、TSV 互連並接到底部 die；HBM 可與 GPU 並排整合於 interposer。
   - 採用「堆疊內部的垂直方向」與「封裝內並排整合」的區別，不引用產品規格。
3. [Micron HBM2E 技術 brief](https://assets.micron.com/adobe/assets/urn%3Aaaid%3Aaem%3A275edf31-79e3-4b6c-8bbd-a233babe9281/renditions/original/as/micron-hbm2e-memory-wp.pdf)
   - 子代理另核對 HBM 的堆疊結構；故事不取用其中世代特定數字。

## 圖解決策

- GPU–HBM 橫向路徑以 S 為例：晶片接點、細間距接合、中介板布線、另一端晶片。
- S 的中介板 TSV、C4、封裝基板與 BGA／板端另頁呈現，不讓讀者以為 HBM 讀寫都繞經主機板。
- HBM 堆疊內的 TSV 放大另畫，避免與中介板 TSV 混為一談。
- S／R／L 固定上下元件，只換中介層；RDL 中介層與封裝基板保持分開。
- 示意不按比例。晶片數、DRAM 層數、凸塊數、LSI 數量皆不代表產品。無外部圖片、無下載素材或授權衍生問題。

## 原章需要避免沿用的說法

- 「只有矽中介板才能接 HBM」「HBM 非 CoWoS 不可」過度絕對，不放入故事。
- 原 06 比較表把 L 的矽橋一律視為含 TSV，已改為依實作並限定該列是中介層 TSV；HBM 內部 TSV 不在該列範圍。
- 原章良率、成本排名、reticle 上限、產品對應、HBM 速率及量產時程沒有在本次全面查核，也沒有放入故事。
- 材料配置不能單獨證明成本更低或良率更高，不能由示意面積推論真實產品上限。
