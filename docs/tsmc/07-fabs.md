# 廠區分布

台積電擁有遍布全球的晶圓廠與先進封裝廠，主力仍在台灣，同時積極於美國、日本、德國、新加坡、中國布局。

---

## 全球廠區一覽圖

```mermaid
graph TD
    subgraph "台灣（核心）"
        TW_HC["新竹<br/>Fab 2 / 3 / 5 / 8<br/>Fab 12 / 20<br/>AP1"]
        TW_TN["台南<br/>Fab 6 / 14 / 18<br/>AP2 / AP8"]
        TW_TC["台中<br/>Fab 15 / AP5"]
        TW_KH["高雄<br/>Fab 22"]
        TW_TY["桃園龍潭<br/>AP3"]
        TW_ML["苗栗竹南<br/>AP6"]
        TW_CY["嘉義<br/>AP7"]
    end
    subgraph "海外"
        US["美國 鳳凰城<br/>Fab 21（量產 N4；規劃 3nm、2nm）"]
        JP["日本 熊本<br/>JASM Fab 23（量產 28nm）"]
        DE["德國 德勒斯登<br/>ESMC（28/22、16/12nm）興建中"]
        SG["新加坡<br/>SSMC（200mm）合資"]
        CN_SH["中國 上海<br/>Fab 10（200mm）"]
        CN_NJ["中國 南京<br/>Fab 16（300mm/16nm）"]
        US_WA["美國 華盛頓州<br/>Fab 11 / WaferTech（200mm）"]
    end
```

---

## 台灣廠區詳表

### 前段晶圓廠（Wafer Fab）

| 廠號 | 位置 | 晶圓尺寸 | 量產最先進製程（2025 年底，20-F）/ 備註 |
|------|------|---------|----------------|
| **Fab 2** | 新竹科學園區 | 150 mm | 450 nm；早期設施 |
| **Fab 3** | 新竹科學園區 | 200 mm | 150 nm |
| **Fab 5** | 新竹科學園區 | 200 mm | 150 nm |
| **Fab 6** | 南部科學園區 | 200 mm | 110 nm |
| **Fab 8** | 新竹科學園區 | 200 mm | 110 nm |
| **Fab 12** | 新竹科學園區 | 300 mm | 40 nm；總部與研發所在地 |
| **Fab 14** | 南部科學園區 | 300 mm | 16 nm |
| **Fab 15** | 中部科學園區 | 300 mm | 7 nm |
| **Fab 18** | 南部科學園區 | 300 mm | 3 nm |
| **Fab 20** | 新竹科學園區（寶山） | 300 mm | 2 nm；2025 年開始量產 |
| **Fab 22** | 高雄楠梓 | 300 mm | 2 nm；2025 年開始量產 |

### 後段先進封裝廠（Advanced Backend Fab，AP）

台積電自建封裝廠，承接 CoWoS、InFO、SoIC 等先進封裝。依 20-F，截至 2026 年初營運中的先進封裝廠共七座，但年報沒有逐座列名。下表的位置來自 20-F 的土地租約與官方新聞稿；各廠用途多來自產業報導，可能隨擴產計畫調整。

| 廠號 | 位置 | 用途（報導） | 備註 |
|------|------|-------------|------|
| **AP1** | 新竹科學園區 | 測試與後段封裝 | 有報導稱將轉為研發用途 |
| **AP2** | 南部科學園區（台南） | 微凸塊與少量 CoWoS | |
| **AP3** | 桃園龍潭 | 以 InFO 為主 | |
| **AP5** | 中部科學園區（台中） | CoWoS | |
| **AP6** | 苗栗竹南 | CoWoS、SoIC、InFO | 2023 年 6 月啟用，官方稱為當時最大的先進封裝廠 |
| **AP7** | 嘉義科學園區 | 原規劃 SoIC、WMCM，報導稱部分改為 CoWoS | 報導稱第一期 2026 年量產 |
| **AP8** | 南部科學園區（台南） | CoWoS | 向群創購入的既有廠房改建；2025 年 12 月起租約生效 |

------|------|------|------|
| **ABF 1** | 新竹科學園區 | 運作中 | CoWoS 先進封裝 |
| **ABF 2** | 台南善化 | AP2B & AP2C 運作中 | CoWoS 先進封裝 |
| **ABF 3** | 桃園龍潭 | 運作中 | 先進封裝 |
| **ABF 5** | 台中科學園區 | 運作中 | 先進封裝 |
| **ABF 6** | 苗栗竹南 | AP6A 運作中；Phase B & C 興建中 | 大幅擴充 CoWoS 產能 |
| **ABF 7** | 嘉義太保 | 規劃 2 期 | 新建封裝廠，擴充南部產能 |

---

## 海外廠區詳情

### 🇺🇸 美國 — Fab 21（鳳凰城，亞利桑那州）

| 項目 | 說明 |
|------|------|
| 位置 | 鳳凰城（Phoenix），亞利桑那州 |
| 晶圓尺寸 | 300 mm |
| 第一座廠 | N4，2024 年第四季量產 |
| 第二座廠 | 3 奈米，報導預定 2027 年下半年量產 |
| 第三座廠 | 報導規劃 2 奈米與 A16 |
| 投資與補助 | 見[地緣政治與全球化](11-geopolitics.md)〈海外布局〉 |
| 成本 | 張忠謀 2022 年表示，台積電奧勒岡廠生產同樣產品的成本比台灣高約 50% |

---

### 🇯🇵 日本 — JASM / Fab 23（熊本菊陽町）

| 項目 | 說明 |
|------|------|
| 正式名稱 | Japan Advanced Semiconductor Manufacturing（JASM） |
| 股權結構 | 台積電約 86.5%、Sony Semiconductor Solutions 6.0%、Denso 5.5%、Toyota 2.0%（2024 年 2 月第二座廠宣布後） |
| Phase 1 | 2024 年 12 月開始量產；規劃 12/16 與 22/28 nm，2025 年底量產最先進為 28 nm（20-F） |
| Phase 2 | 2024 年宣布時規劃 6/7 nm，預定 2027 年底前營運；之後有時程變動的報導 |
| 總投資 | 兩座廠合計超過 200 億美元 |
| 預計就業 | 兩座廠合計直接創造超過 3,400 個工作機會 |
| 戰略意義 | 供應 Sony 影像感測器、Denso 汽車晶片及其他日本電子廠商 |

---

### 🇩🇪 德國 — ESMC（德勒斯登，薩克森邦）

| 項目 | 說明 |
|------|------|
| 正式名稱 | European Semiconductor Manufacturing Company（ESMC） |
| 股權結構 | 台積電 70%、Bosch 10%、Infineon 10%、NXP 10% |
| 製程 | 28/22 nm、16/12 nm FinFET（汽車、工業應用） |
| 總投資 | 超過 100 億歐元（台積電出資 35 億歐元） |
| 政府補貼 | 德國政府補貼 50 億歐元 |
| 目標產能 | 每月 40,000 片 12 吋晶圓 |
| 時程 | 2024 年 8 月動工；2026 年 9 月上樑；首批製程設備預定 2027 年下半年進機。量產時間未公布（台積電官網早先的目標是 2027 年底） |

---

### 🇸🇬 新加坡 — SSMC

| 項目 | 說明 |
|------|------|
| 正式名稱 | Systems on Silicon Manufacturing Cooperation（SSMC） |
| 股權結構 | 台積電 38.8%、NXP Semiconductors 61.2% |
| 晶圓尺寸 | 200 mm |
| 製程 | 成熟製程（類比、混合訊號、電源管理） |
| 成立時間 | 1998 年，原為台積電、飛利浦、EDB 三方合資 |

---

### 🇨🇳 中國 — Fab 10 & Fab 16

| 廠號 | 位置 | 晶圓尺寸 | 製程 | 備註 |
|------|------|---------|------|------|
| **Fab 10** | 上海松江 | 200 mm | 成熟製程 | TSMC China Company Limited |
| **Fab 16** | 南京（江蘇） | 300 mm | 16 nm | TSMC Nanjing Company Limited；美方 VEU 授權 2025 年 12 月到期，改以年度出口許可維持設備供應（20-F） |

---

### 🇺🇸 美國華盛頓州 — Fab 11（WaferTech）

| 項目 | 說明 |
|------|------|
| 位置 | Camas，華盛頓州 |
| 晶圓尺寸 | 200 mm |
| 製程 | 成熟製程 |
| 歷史 | 原名 WaferTech，現更名為 TSMC Washington |

---

## 為何海外建廠如此挑戰？

```mermaid
flowchart TD
    WHY["為何海外建廠？"]
    WHY --> GEO["地緣政治：美國晶片法案補貼<br/>歐日政府積極爭取"]
    WHY --> CUST["客戶要求在地化供應"]
    WHY --> RISK["分散台灣地緣風險"]

    COST["成本挑戰"]
    COST --> C1["生產成本較高<br/>張忠謀：奧勒岡約高 50%"]
    COST --> C2["工程師薪資與生活成本高"]
    COST --> C3["供應鏈生態系尚未建立"]
```

台積電在 2026 年 1 月法說會預期，海外廠量產初期會稀釋毛利率約 2–3 個百分點（見[財務表現](10-financials.md)）。

---

→ 延伸閱讀：[地緣政治](11-geopolitics.md)、[上下游供應鏈](09-supply-chain.md)

## 資料來源

- 各廠量產最先進製程、Fab 16 出口許可：[TSMC 2025 Form 20-F](https://www.sec.gov/Archives/edgar/data/1046179/000162828026025362/tsm-20251231.htm)
- JASM 股權、投資與就業：[TSMC 新聞稿（2024-02）](https://pr.tsmc.com/japanese/news/3105)
- Arizona 第二座廠時程：[TrendForce 轉述 Nikkei（2025-12）](https://www.trendforce.com/news/2025/12/18/news-tsmc-reportedly-accelerates-arizona-2nd-fab-eyes-3q26-tool-install-2027-3nm-production/)
- 先進封裝廠數量與租約：[TSMC 2025 Form 20-F](https://www.sec.gov/Archives/edgar/data/1046179/000162828026025362/tsm-20251231.htm)
- AP6 啟用：[TSMC 新聞稿（2023-06）](https://pr.tsmc.com/english/news/3033)
- 各廠用途：[Nomad Semi](https://www.nomadsemi.com/p/tsmcs-cowos-capacity)、[DigiTimes（2026-01）](https://www.digitimes.com/news/a20260129PD220/tsmc-packaging-fab-cowos-genai.html)、[TrendForce（2025-12）](https://www.trendforce.com/news/2025/12/04/news-tsmc-speeds-advanced-packaging-ap7-targets-2026-output-arizona-p6-eyed-for-u-s-packaging-hub/)
- 張忠謀談美國成本：[Taipei Times（2022-04）](https://www.taipeitimes.com/News/biz/archives/2022/04/22/2003776996)
