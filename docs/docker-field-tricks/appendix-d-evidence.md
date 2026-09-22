# D｜證據、版本與延伸閱讀

本書將三種內容分開：**來源作者的第一手案例、官方文件支持的機制、本書設計的實驗及實際觀察**。案例不因寫得生動就成為普遍規律；文件能說明工具契約，不能替我們量出某台主機的效能。

研究在 2026-09-21 整理，成書於 2026-09-22 再核對相關機制。Docker 與 Python 文件多未顯示逐頁發布日期，以下以機構作者署名、日期未知處理，不把查核日當發布日。各章已就地連到對應原始來源；這裡補作者、歷史版本與採用邊界。

## 第一手案例

| 來源 | 作者／日期 | 閱讀範圍與本書用途 |
|---|---|---|
| [Bind mount 覆蓋 WORKDIR](https://shiun.me/blog/docker-overwriting-workdir-contents-with-bind-mounts-at-run-time/) | Shiun，2024-01-28 | 正文與程式碼；第 01 章線索。未獨立重現原專案，沒有把遮蔽寫成刪除 |
| [多個 Dockerfile 與 build context](https://shiun.me/blog/a-project-with-multiple-dockerfiles-an-introduction-to-build-context/) | Shiun，2024-01-20 | 正文與程式碼；第 08 章。原例另有路徑問題，改 -f 不代表全解 |
| [Override the entrypoint](https://blog.karmacomputing.co.uk/override-the-entrypoint-of-docker-containers-any-container/) | Christopher Simpson，2021-05-17 | 短篇全文；第 04 章。標題 any container 不採用，映像必須有替代執行檔 |
| [File Sharing with Docker Desktop](https://www.docker.com/blog/file-sharing-with-docker-desktop/) | Stephen Turner，2022-01-24 | 技術正文，未觀看演講；第 11 章。只取 I/O 邊界假設，不取推廣倍率 |
| [docker-library/python #604](https://github.com/docker-library/python/issues/604) | tmoschou，2021-04-17 | 問題主文與最小程式；第 06 章。原案例浮動 image，未提供 digest |
| [ArchiveBox #1093](https://github.com/ArchiveBox/ArchiveBox/discussions/1093) | diego898、pirate，2023-02-06 至 07 | 問題、回覆與 tags 後續；第 07 章。ArchiveBox 0.6.2，Compose 版本未明 |
| [docker/compose #7776](https://github.com/docker/compose/issues/7776) | skrech，2020-09-18 | 主文、重現碼與版本；第 07 章延伸。Compose 1.26.2／Engine 19.03.10 的 stdin 案例，不假設今日相同 |
| [docker/compose #9160](https://github.com/docker/compose/issues/9160) | zapoig，2022-02-10 | 主文、重現條件；第 02 章邊界。Compose 2.2.3 與 1.27.4 差異，不宣稱現版仍有該 bug |

Shiun 兩篇文章來自同一作者與專案脈絡，不算兩個獨立團隊的證據。ArchiveBox 案例在 -T 後成功輸入，但仍有欄位語意問題；因此本書核對輸出內容，沒有把 exit 0 寫成端到端正確。

## 技術機制對照

| 章節 | 第一方來源 | 核對的範圍 |
|---|---|---|
| 01 | [Bind mounts](https://docs.docker.com/engine/storage/bind-mounts/) | 遮蔽、daemon 路徑、readonly、來源不存在時的預設行為 |
| 02 | [config](https://docs.docker.com/reference/cli/docker/compose/config/)、[插值](https://docs.docker.com/compose/how-tos/environment-variables/variable-interpolation/)、[restart](https://docs.docker.com/reference/cli/docker/compose/restart/)、[up](https://docs.docker.com/reference/cli/docker/compose/up/) | 配置渲染、來源優先序、重新建立容器 |
| 03 | [cp](https://docs.docker.com/reference/cli/docker/container/cp/)、[diff](https://docs.docker.com/reference/cli/docker/container/diff/)、[export](https://docs.docker.com/reference/cli/docker/container/export/) | 停止後取檔、特殊檔案邊界、volume 不屬 export |
| 04、13 | [Dockerfile](https://docs.docker.com/reference/dockerfile/)、[run](https://docs.docker.com/reference/cli/docker/container/run/)、[stop](https://docs.docker.com/reference/cli/docker/container/stop/) | ENTRYPOINT、PID、停止訊號與寬限時間；非整份 Dockerfile 規格審計 |
| 05 | [Networking](https://docs.docker.com/engine/network/)、[netshoot](https://github.com/nicolaka/netshoot) | container networking、loopback 與工具容器用法；本章用 Python 標準函式庫縮小下載集合 |
| 06 | [Python -u](https://docs.python.org/3/using/cmdline.html#cmdoption-u)、[日誌](https://docs.docker.com/engine/logging/)、[driver](https://docs.docker.com/engine/logging/configure/)、[dual logging](https://docs.docker.com/engine/logging/dual-logging/) | stdout/stderr 緩衝、目的地、driver 與 cache 失效條件 |
| 07 | [compose run](https://docs.docker.com/reference/cli/docker/compose/run/) | 新容器、-T、stdin、ports 與 --no-deps 邊界 |
| 08 | [Build context](https://docs.docker.com/build/concepts/context/) | 本機 context、Dockerfile 路徑、ignore |
| 09 | [Multi-stage](https://docs.docker.com/build/building/multi-stage/)、[buildx build](https://docs.docker.com/reference/cli/docker/buildx/build/) | target、依賴階段、load 輸出 |
| 10 | [Cache invalidation](https://docs.docker.com/build/cache/invalidation/)、[Cache optimize](https://docs.docker.com/build/cache/optimize/)、[buildx build](https://docs.docker.com/reference/cli/docker/buildx/build/) | secret 不進 key、局部 no-cache、cache mount 不同層 |
| 11 | [Desktop settings](https://docs.docker.com/desktop/settings-and-maintenance/settings/)、[Volumes](https://docs.docker.com/engine/storage/volumes/) | VMM／共享後端、daemon 管理的儲存；沒有採用宣傳數據 |
| 12 | [Startup order](https://docs.docker.com/compose/how-tos/startup-order/) | service_started／service_healthy 與探針 |
| 13 | [Tini README](https://github.com/krallin/tini) | 直接 child、群組訊號、回收程序；未審計整個原始碼庫 |

Docker 文件的作者記為 Docker；Python 文件記為 Python Software Foundation 與貢獻者。netshoot、Tini 是原始專案 README，作者分別為 nicolaka、krallin 與貢獻者；本版讀取浮動分支，未釘 commit，不把它們當已重現的事故。

## 哪些說法被淘汰

- **「有工具容器就能證明原應用連線正常」**：工具的 CA、proxy、認證及程式庫不同；第 05 章只縮小網路邊界。
- **「export 是完整備份」**：掛載 volume 不在匯出內容裡，還涉及一致性；第 03 章只做觀察取檔。
- **「no-cache 會更新所有東西」**：base image、外部服務、套件 cache 各有狀態；第 10 章分開對照。
- **「健康就永遠不會斷線」**：啟動 gate 不是運行中重連策略；第 12 章用假探針作反例。
- **「137 就是 OOM」「--init 修好所有停止問題」**：訊號路徑與應用行為有多種原因；第 13 章要求標記與程序證據。
- **「Desktop 搬進 volume 一定快某個倍率」**：平台、共享後端與工作負載不同；第 11 章沒有任何預填效能結論。

研究也讀了 [NCSE 的 Compose 生產建議](https://blog.ncse.tw/docker-compose-production-best-practices/)（NCSE Network 技術團隊，2026-04-20）。因範例網路配置與連通性敘述不一致，且含主機服務推廣，沒有作為主線實證；一般 readiness 建議另以官方來源核對。搜尋摘要可幫忙發現候選，但無法打開的文章沒有列作已讀證據，翻譯與轉載也沒有增加獨立案例數。

## 本版實測環境與映像

2026-09-22 已完成 13 章核心 fixture 的 Docker 對照，含主要反例與專用資源清理。這是本書自己的小型重現，沒有重跑 Shiun、ArchiveBox 等來源作者的完整專案。

| 項目 | 實測值 |
|---|---|
| 主機 | macOS 27.0，arm64 |
| Desktop | 4.60.1（218372） |
| Client／Server | 29.2.0／29.2.0，API 1.53 |
| Engine 平台 | Linux／arm64；kernel 6.12.67-linuxkit |
| Compose | v5.0.2 |
| Buildx／BuildKit | v0.31.1-desktop.1／v0.27.0 |
| builder | desktop-linux，docker driver |
| daemon 可用資源 | 8 CPU，記憶體 8,217,600,000 bytes |
| logging driver | json-file；第 06 章也明確指定 |
| VMM／共享後端 | 未確認有效設定；不猜測預設值 |

本次 repository digest（多架構索引；實際執行 arm64）為：

```text
alpine@sha256:ce64758a109eb420d874a118f87920e625e12d3634e03b4a5573fd9f6e5d3507
python@sha256:1a63a53928ce53d2b0baf08092a703f4840ac5dfbd61fd48802dbf48e08c801e
```

第 10 章 Dockerfile frontend 在本次 build log 解析為 `docker/dockerfile:1@sha256:ecfaec9ed6d810b56388c508f4121597bfbba70d41a6dfeee4d8cad5f295fc32`；其他版本仍需記錄自己的解析值。

各章的「本版實測記錄」列出可觀察結果；日誌首筆計時從輪詢開始計算，I/O 秒數排除容器啟動，停止耗時則包含 CLI 開銷，三者不能混用。時序章做了 18 次矩陣對照與 1 次假探針反例；多數其他章是功能性重現，沒有宣稱統計穩定性或生產可用性。

## 尚未驗證的邊界

原生 Linux、Windows WSL 2、amd64、遠端 daemon、其他 builder driver 與真實部署均未交叉驗證。第 11 章只有一種 Desktop 的四輪交錯樣本，沒有嚴格冷快取、完整專案或跨平台效能結論；共享後端仍缺有效設定紀錄。scratch／distroless、遠端 logging、TLS、真實資料備份與多子程序管理的延伸條件也未逐一實測。

本版的目標是讓一個具體症狀變成可重跑對照。擴大適用範圍時，保留新的版本、平台、輸入與原始輸出；結果不符就修正假設，不只改到「看起來符合書」。
