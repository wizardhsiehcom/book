# 名詞解釋速查表

本書涉及的專業術語一覽。遇到不熟悉的詞，可回到這裡查詢。

---

## 製程與設備

| 名詞 | 英文全名 | 說明 |
|------|---------|------|
| **回流焊** | Reflow Soldering | 以加熱使錫膏重新熔融的焊接方式 |
| **溫度曲線** | Thermal Profile | 回流爐各段溫度對時間的設定曲線 |
| **熱風刀** | Air Knife | 回流爐中的噴嘴，強制熱氣均勻吹拂 PCB |
| **熱壓接合** | Hot Bar / Thermode Bonding | 以熱刀頭接觸並施壓的接合方式 |
| **刀頭** | Thermode | 熱壓機的金屬加熱頭，直接接觸工件 |
| **脈衝加熱** | Pulse Heating | 以短暫高電流脈衝精確控制升溫速率 |
| **鋼板印刷** | Stencil Printing | 以金屬鋼板漏印錫膏到焊墊上 |
| **貼片機** | Pick & Place Machine | 自動將元件吸取並貼到 PCB 指定位置的設備 |

---

## 材料

| 名詞 | 英文全名 | 說明 |
|------|---------|------|
| **錫膏** | Solder Paste | 錫粉 + 助焊劑的混合物，用於回流焊接 |
| **助焊劑** | Flux | 去除氧化層、降低表面張力，幫助錫潤濕 |
| **SAC305** | Sn96.5/Ag3/Cu0.5 | 最常用的無鉛焊錫合金，熔點 217°C |
| **Sn63Pb37** | Tin-Lead Eutectic | 傳統有鉛焊錫，熔點 183°C（共晶點） |
| **ACF** | Anisotropic Conductive Film | 異向性導電膜：Z 向導電、X-Y 絕緣 |
| **導電粒子** | Conductive Particle | ACF 內的金鍍層微球，受壓後建立導通 |
| **介金屬層** | IMC（Intermetallic Compound） | 焊錫與銅墊反應生成的 Cu₆Sn₅ 等化合物 |
| **PI 薄膜** | Polyimide Film（Kapton） | FPC 基材，耐高溫、可撓曲 |

---

## 元件封裝

| 縮寫 | 全名 | 特徵 |
|------|------|------|
| **BGA** | Ball Grid Array | 底部球陣列，如處理器、記憶體 |
| **CSP** | Chip Scale Package | 尺寸接近裸晶粒的小型封裝 |
| **QFN** | Quad Flat No-lead | 四側無外露引腳，底部焊墊 |
| **QFP** | Quad Flat Package | 四側翼型引腳 |
| **SOP** | Small Outline Package | 兩側翼型引腳，小外形 |
| **COB** | Chip on Board | 裸晶粒直接打線接合到 PCB |

---

## 顯示器模組接合

| 縮寫 | 全名 | 說明 |
|------|------|------|
| **FOG** | Film on Glass | FPC 以 ACF 接合至玻璃端子 |
| **COG** | Chip on Glass | 裸 IC 直接以 ACF 壓著於玻璃 |
| **COF** | Chip on Film | IC 封裝於 PI 薄膜，折至玻璃背面接合 |
| **LCD** | Liquid Crystal Display | 液晶顯示器 |
| **OLED** | Organic Light-Emitting Diode | 有機發光顯示器 |
| **TFT** | Thin-Film Transistor | 薄膜電晶體，驅動每個像素 |
| **Bump** | — | IC 或基板上的凸點電極（錫球或金凸點） |

---

## 品質與缺陷

| 名詞 | 英文 | 說明 |
|------|------|------|
| **AOI** | Automated Optical Inspection | 以機器視覺掃描外觀缺陷 |
| **SPI** | Solder Paste Inspection | 貼片前量測錫膏體積與位置 |
| **X-Ray** | — | 透視內部焊點，主要用於 BGA |
| **截面分析** | Cross-Section Analysis | 研磨焊點至截面，觀察微結構 |
| **冷焊** | Cold Joint | 錫未充分熔融，焊點灰暗粗糙、強度差 |
| **錫珠** | Solder Ball / Bead | 焊墊旁的多餘小錫球 |
| **墓碑效應** | Tombstone / Manhattan Effect | 小元件一端翹起 |
| **橋接** | Bridging | 相鄰焊點被錫連通，導致短路 |
| **空洞** | Void | 焊球或焊點內部的氣泡孔洞 |
| **剝離** | Delamination | 接合層分離 |
| **開路** | Open | 焊點未導通 |

---

## 標準與規範

| 標準 | 主題 |
|------|------|
| **IPC-A-610** | 電子組件驗收條件（最常引用） |
| **J-STD-001** | 焊接製程要求 |
| **IPC-7711/7721** | 修復與返工程序 |
| **J-STD-004** | 助焊劑分類 |
| **RoHS** | 限用有害物質指令（禁用鉛等） |

---

## 單位與物理量

| 符號 | 說明 |
|------|------|
| **°C/s** | 升降溫速率（度 / 秒） |
| **MPa** | 百萬帕斯卡，壓力單位 |
| **μm** | 微米（10⁻⁶ 公尺），間距單位 |
| **Ω** | 歐姆，電阻單位 |
| **gf/cm** | 克力 / 公分，剝離強度單位 |
| **Pa·s** | 帕斯卡秒，錫膏黏度單位 |

---

回到 → [PCB 與 SMT 基礎](00-pcb-basics.md) | [導讀](README.md)
