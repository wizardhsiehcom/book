# B03｜程式如何在機器與網路上運作：書籍建置計畫

- 日期：2026-09-27。
- 狀態：正文與實驗已依本計畫製作；出版建置結果見書籍的 `verification.md`。
- slug：`systems-network-foundations`；本輪檢查未見同名書籍設定或正文。
- 上位依據：`/Users/wizard/Documents/gpm/temp/缺口書籍與課程建置計畫.md` 的 B03、C03、W3 與書課分工。
- 本輪交付：本計畫、既有內容覆蓋盤點、章節與實驗驗收設計。後續按本計畫製作整本書。
- 盤點基準：book commit `4a6c6c3487c6f49e14180c2c9af6fd9390a4c712`。上位計畫的 B02／C02 狀態已落後於實際檔案；本書引用現有正文，不沿用「尚未建立」的舊描述。

## 1. 讀者、用途與終點

讀者有 AI／機械背景，能追蹤單程序中的函式、輸入與輸出，尚未修過 OS 或網路。B01 的值、生命週期、契約與測試是先備；不要求先會 socket、執行緒或 Docker。

貫穿問題是：「一批合成 AOI 圖片從來源交到接收端，為什麼程式還活著卻沒進度？為什麼傳送成功仍不能說交付完成？」這是上位計畫指定的教學情境，並有既有 Linux／Docker 教材中的連線、延遲及停止案例可沿用；尚未核實公司的實際影像交付需求。

本書交付能獨立閱讀的原理頁與局部實驗。第一個有用產出是程序辨識紀錄：找到自己啟動的 worker、追蹤其狀態、取得退出結果並確認清理。後續產出資料流圖、通訊契約、工作帳與故障判讀報告。完整影像交付／補傳工具由 C03 承接。

讀完應能：

1. 畫出程序、執行緒、記憶體、檔案與 socket 的歸屬，解釋誰在等誰。
2. 沿資料路徑區分緩衝、寫入、可見、持久化與業務確認。
3. 分開定位名稱解析、連線、協定解析與應用處理的失敗。
4. 用時間線解釋競爭、排隊、逾時、取消及停止，指出仍未知的結果。
5. 根據可重查的證據選擇下一個實驗，不靠單次 log 排列或「沒有 crash」判定正確。

不納入核心開發、完整 TCP stack、lock-free 演算法、分散式共識、Kubernetes、正式檔案服務或監控平台部署。TLS／授權保留必要的保證邊界；不把區網連得上解釋成安全可用。

## 2. 已有資產與原理主責

以下是本輪實際讀取範圍；未列出的正文沒有宣稱完成全面審核。舊書的實測紀錄僅代表其原環境，不能直接登記為 B03 通過。

| 已讀內容 | 可沿用 | B03 要補的缺口 |
|---|---|---|
| [B01 計畫](../software-engineering-foundations/plan.md)、[生命週期](../../docs/software-engineering-foundations/03-lifetime.md) | 借用、歸屬、RAII 與強制終止的界線 | 程序與 OS 資源、虛擬位址、跨程序資料移交 |
| [B02 計畫](../database-correctness/plan.md)、[結果未知](../../docs/database-correctness/16-unknown-outcome.md) | 客戶端知識狀態、權威證據、操作身分的入口 | socket 成功到業務完成的不同承諾；不重寫 SQL 去重實作 |
| [Binary Hacks 導讀](../../docs/hack100/README.md)、[記憶體](../../docs/hack100/05-memory-safety-debugging.md) | 安全問題分類、工具選擇 | 從入門可理解的位址空間、stack／heap、搬移成本開始 |
| [Binary Hacks 效能](../../docs/hack100/06-profiling-performance.md)、[並行](../../docs/hack100/07-concurrency-memory-model.md) | 進階 profiling、記憶體排序與協程的延伸入口 | 排程、等待、共享狀態與有界 queue 的小型因果實驗 |
| [Linux 綁定位址](../../docs/linux-lan-field-tricks/02-port-and-bind.md)（全頁） | loopback／LAN 對照、TCP 與 HTTP 探測分層 | 名稱、位址、port、連線與 HTTP 的連續解釋 |
| [Linux 延遲注入](../../docs/linux-lan-field-tricks/09-make-it-slow.md)（前 90 行） | 隔離介面、延遲模型與撤回方法的候選入口 | 不需管理權限的應用等待實驗；不可把它當真網路故障實測 |
| [Docker readiness](../../docs/docker-field-tricks/12-delay-readiness.md)、[停止訊號](../../docs/docker-field-tricks/13-forward-stop-signal.md)（全頁） | 啟動不等於就緒、PID 1／wrapper／cleanup 對照 | 先建立服務生命週期與工作收尾契約，再連回容器操作 |

分工原則：B01 主責語言層生命週期；B02 主責資料庫交易、操作去重與 outbox；B03 主責執行、通訊及資源模型。Linux／Docker 保留症狀排查用途；Binary Hacks 作深入選讀。每個概念指定一個 B03 主頁，其他頁簡述並連回。

## 3. 環境與教材形式

### 預定基線

- 主線採 Linux 使用者空間、CPython 3.13 的一般建置、標準庫；以真實子程序與 loopback TCP 做小實驗。選這個版本是為了與既有 Docker 教材銜接，不宣稱它是最新版本。
- Linux 可由獨立主機、VM 或 Docker 提供。前段只教啟動既定實驗環境的必要命令；容器內部原理留到最後，避免先備循環。
- C++17 局部實驗承接 B01 的物件、`std::thread` 與 RAII。Python 語法銜接引用 B01 附錄，首次使用的程序、bytes、socket API 在實例中解釋。
- 首次製作時固定 OS／kernel、CPU 架構、Python 完整版本與建置模式、編譯器、Docker Engine／Compose 及映像 digest；目前全部待實測，不填造假的版本紀錄。
- macOS 原生結果、Linux 容器結果、原生 Linux 與真跨機結果分欄記錄。Docker Desktop 的 Linux 結果不得標成 macOS 核心語意。
- Windows 作差異閱讀，不承諾 signal、`/proc` 或 POSIX 檔案操作原樣可用。實作時若增加 Windows 路徑，另留證據。

### 範例規則

每組實驗獨立可跑，使用自建暫存目錄、合成資料與自己啟動的程序。預設僅 loopback，不要求管理權限；netem 與真跨機是明確標示的延伸實驗。失敗與中斷後也要能清理並重跑。

網路、子程序等待與測試都有總時限；同步使用事件、barrier 或明確握手。sleep 可以表達注入的慢工作，不能充當「另一端已到達某行」的證據。錯誤示範與正確版分開，錯誤版被預期檢查抓到才算實驗有效。

原碼註解以繁體中文為主，採遞增式保姆級說明：第一次詳細解釋語法、輸入輸出、資源歸屬與失敗路徑；後續只解釋新增機制，連回首次教學位置。保留可獨立執行的完整程式；正文集中解釋因果，不再逐行抄註解。

## 4. 預定目錄與章節驗收

11 組原理拆成 19 篇核心頁，避免把數個新模型塞在同一頁。以下均為待建檔名，不能當已發布連結。

| 頁面 | 核心問題與內容 | 學習驗收 |
|---|---|---|
| `01-process.md` | 同一程式啟動兩次，誰是誰？PID、父子程序、退出與回收 | 找到自己啟動的 child，取得退出狀態，指出資源由誰清理 |
| `02-thread-scheduling.md` | 程式活著為何沒有進度？thread、可執行／等待、排程、並行與平行 | 畫兩個 worker 的允許時間線；解釋等待不等於 CPU 忙碌 |
| `03-address-space.md` | 位址相同是否就是同一份資料？虛擬位址、stack／heap、歸屬 | 區分程序隔離、執行緒共享與物件壽命；不以位址數字推論實體位置 |
| `04-data-movement.md` | 一張圖讀進來後在哪幾份 buffer？複製、借用、序列化 | 標出資料路徑與所有權；依測量解釋複製成本，指出 zero-copy 的前提 |
| `05-files-io.md` | 檔名存在為何還讀到半檔？檔案 handle、buffer、read／write | 區分 EOF、錯誤、尚未發布的輸入；在受控交接點辨認不完整資料 |
| `06-completion-durability.md` | 寫入完成是哪一層完成？flush、同步、發布與崩潰 | 畫出可見／持久化／確認時間線，區分程序終止測試和斷電保證 |
| `07-address-port-dns.md` | 名稱正確為何連不上？DNS、IP、路由、port、bind | 根據解析結果、listener 與 client 目的地提出分層檢查 |
| `08-tcp-stream.md` | 一次 send 能否對應一次 recv？串流、部分傳輸、EOF | 處理任意切段與提早 EOF，不依賴封包排列或固定 recv 次數 |
| `09-message-contract.md` | 接收端怎麼知道一筆資料完整？framing、bytes、版本、大小限制 | 拒絕截斷、超限、非法 UTF-8／欄位；比較宣告大小與實際內容 |
| `10-http.md` | TCP 通了，HTTP 就成功嗎？方法、狀態、header、body 與 TLS 邊界 | 分開連線錯誤、HTTP 錯誤及業務回覆；用標準庫，不自行做通用 HTTP parser |
| `11-sync-async.md` | 非同步到底讓誰不用等？blocking、event loop、工作完成通知 | 比較相同工作負載的等待與 CPU 工作；解釋 async 不自動提供平行計算 |
| `12-shared-state.md` | 每步都安全，組合起來為何錯？不變條件、鎖與競爭 | 用同步點重現讀改寫衝突，再驗證整個操作邊界；辨認 deadlock 風險 |
| `13-queue-backpressure.md` | 來源比接收端快怎麼辦？容量、流入／完成率與背壓 | 明訂滿載時阻塞或拒絕的政策；核對工作數量，不能只量 queue 長度 |
| `14-timeout-deadline.md` | 每一步都沒逾時，整體為何太久？等待上限與總預算 | 用單調時鐘傳遞剩餘預算；測試多階段等待不會各拿一份完整預算 |
| `15-cancellation-unknown.md` | 我不等了，對方是否也停了？合作取消、晚到結果與未知 | 畫客戶端與 worker 的各自狀態；根據獨立收件證據分類結果 |
| `16-readiness.md` | 程序開始、能連線、能接工作相同嗎？健康與就緒 | 分開 startup／liveness／readiness；以假健康探針作反例 |
| `17-shutdown.md` | 停止時已接受的工作去哪了？停止接收、drain、取消、強制退出 | 每筆工作有完成或明確未完成狀態；驗證 child／socket／暫存檔收尾 |
| `18-observability.md` | 慢在計算、磁碟、queue 還是對端？log、metrics、trace | 關聯同一工作各階段，呈現量測分布及樣本量；不把跨機時鐘當精確因果 |
| `19-containers.md` | 容器裡的 localhost、檔案與 PID 指誰？隔離與限制 | 畫 host／容器邊界，解釋 mount、網路與停止責任；連回 Docker 實驗 |

支援頁：`README.md`、`00-map.md`、`labs.md`、`glossary.md`、`exercises.md`、`hints.md`、`answers.md`、`sources.md`、`verification.md`。概念頁只連到分開的提示與答案。

## 5. 局部實驗與證據矩陣

每項記錄命令、環境、預測、實際輸出、判準、清理結果與未驗範圍。錯誤版不得依靠未定義行為產生固定答案。

| ID／章節 | 最小實驗與反例 | 通過證據與界線 |
|---|---|---|
| L01／01–02 | parent 啟動 child、握手、正常退出；child 提早失敗與等待超時 | PID 與退出碼對應正確；無遺留程序；不要求 log 固定排序 |
| L02／03–04 | 獨立程序各自改值、顯式傳回；C++ 比較值複製與借用 | 手算值與歸屬一致；成本記錄資料大小和計時範圍；不靠 ASLR 結果作答案 |
| L03／05–06 | writer 在指定點停住；比較直接暴露半檔與完成後發布 | reader 不接受未完成品；程序重啟後查檔；檔案系統／rename／同步語意另查證，未測斷電不得宣稱驗過 |
| L04／07、10 | loopback 的兩個真程序，分別測名稱解析、TCP 連線、HTTP 狀態與內容 | 正常內容及錯誤層次可辨認；DNS 結果不寫死 IP；測試不依賴外網可用 |
| L05／08–09 | length-prefix＋UTF-8 JSON 小訊息；parser 測每個切點、多訊息、截斷與超限 | deterministic bytes 測試涵蓋所有切點；另跑真 TCP。傳送多次不代表接收必定按同樣切段 |
| L06／11–12 | 阻塞／非同步等待對照；兩 worker 在讀後同步，再更新共享值 | 受控邏輯競爭可重現；修正後不變條件成立。C++ data race 另作 sanitizer 選讀，不能要求 UB 固定結果 |
| L07／13 | 固定數量來源＋慢 consumer＋有界 queue，採明確滿載政策 | `提交數 = 接受數 + 拒絕數`；`接受數 = 完成數 + 取消數 + 未完成數`，定義為互斥狀態；記錄在途工作與容量 |
| L08／14–15 | 多階段等待、取消到達前／後完成、完成後丟棄應用回覆 | 總預算有界，記錄計時誤差容忍值；client unknown 與 worker 完成可同時存在；丟回覆不等於網路斷線 |
| L09／16–17 | 啟動 gate、假健康、正常 drain、處理超時後強制退出 | 停止後拒收；已接受工作逐筆對帳；被強制終止時不能靠 cleanup marker 宣稱成功 |
| L10／18 | 分別注入可控 CPU 工作、I/O 等待、排隊與鎖等待 | 先預測再辨認瓶頸；保留原始樣本、樣本量及分位數計法；不能以人造負載推論產線效能 |
| L11／19 | 容器中的 listener、mount、PID／停止，配對既有 Docker 操作卡 | 記錄 host／guest／容器版本與狀態；不複用舊書 PASS 作新證據 |

L03 的程序中止、L05 的真跨程序、L08 的回覆遺失各自只支持指定故障模型。斷電、真跨機掉線、設備故障及部署安全均另列未驗。Python 的並行敘述需標示 runtime 建置；不把 GIL 當作組合操作的正確性保證，也不拿 Python 實驗證明 C++ 記憶體模型。

### 第一個完整交付單元：01-process

- 問題：啟動兩個同名 worker 後，無法判斷誰失敗，也不知道停止後是否還留著背景程序。
- 先備：B01 的函式、例外與資源歸屬；本節首次說明 `subprocess`、PID、stdin／stdout、退出碼與等待。
- 輸入：合成工作 ID 與正常／提早失敗模式；不讀私人目錄。
- 程式：parent 以握手確認 child 已啟動，收集工作 ID、PID、結果與退出狀態。錯誤版刻意忽略退出狀態，正確版核對結果及回收。
- 預測題：child 印出 started 後退出非零，parent 的 started 訊息能證明工作完成嗎？
- 修改題：新增未認得的模式，要求拒絕且保留診斷；提示只指出輸入邊界。
- 判準：正常、非法輸入、提早失敗、child 卡住四種路徑都有有界結束與正確結果；parent 失敗時仍回收自己建立的 child。
- 交付：正文、完整程式、題目／提示／解答、來源與實測紀錄同批完成。
- 下一問題：知道程序活著仍不知道它在算還是在等，接 02-thread-scheduling。

## 6. 學習設計與終點遷移

每頁依「具體症狀 → 先預測 → 資料流／時間線 → 原理 → 反例與替代方案 → 動手觀察 → 無提示題」組織。圖解清楚標示模型與實測的差別。

- 01–06：給完整操作及預測表，要求先說出資料和資源歸屬。
- 07–12：提供輸入與工具，讓讀者自行判讀錯誤層次及同步邊界。
- 13–19：只給需求、可觀察狀態與判準；不直接指出故障行。
- 延後回測：離開該章後換一組 log／訊息切段／工作順序，再做同概念題。

終點題換成「設備量測檔案接收站」：兩個來源、慢接收端、一個不完整檔案、一次回覆遺失，以及停止期間仍有在途工作。提供合成資料、有限程式骨架及可選故障開關，不要求讀者重建完整 C03。

讀者交付：資料與資源圖、訊息契約、容量／deadline／停止政策、逐筆工作帳，以及依證據分類故障的報告。至少修改一項契約並提出會擊穿錯誤實作的測試。判準是能解釋並驗證界線，單純執行 PASS 不算學會。

## 7. C03 配對與依賴

C03 預定位置：`/Users/wizard/Desktop/MacCode/courses/service-systems-course/`。本輪檢查尚無此目錄；下表引用上位 brief 的階段意圖，正式課程 plan 建立後再核對編號。不建空下載包或假發布 URL。

| C03 階段 | B03 原理頁 |
|---|---|
| G00 環境、程序與停止 | 01–02、17；19 作容器補讀 |
| G01 本地交付、manifest 與基線 | 03–06、18 |
| G02 真跨程序交接 | 07–09；10 作 HTTP 比較 |
| G03 傳檔、完整性與發布 | 05–06、08–09 |
| G04 斷線、timeout、交付 ID 與補傳 | 14–15；操作去重原理另連 B02 |
| G05 多來源、容量與背壓 | 11、13、18 |
| G06 共享資源衝突 | 02、12 |
| G07 取消與停止 | 15–17 |
| G08 瓶頸定位 | 04、13、18；Binary Hacks 作延伸 |
| G09 故障／負載遷移 | exercises 與驗收判準 |

B03 的原理實驗不依賴 C03 完成。C03 的 G00 可以先講最低必要的停止方法，再於後段回查完整生命週期；不強迫讀者先讀完整本書才做第一個實驗。

## 8. 來源查證與備料

本輪查閱日期：2026-09-27。下列官方來源已開啟並用於確認規劃方向，未宣稱逐字審核完整規範。正文製作時要記錄實際使用章節、版本與支持的主張。

| 來源 | 本輪採用範圍 | 寫作限制 |
|---|---|---|
| [Python 3.13 Socket HOWTO](https://docs.python.org/3.13/howto/sockets.html) | Using a Socket 的部分傳輸與訊息定界，供 08–09 規劃 | 範例不能直接充當正式協定；HTTP 敘述須另核對 HTTP 規範 |
| [Python 3.13 queue](https://docs.python.org/3.13/library/queue.html) | 容量、put／get 及工作追蹤的 API 入口，供 13 規劃 | 實際採用的 shutdown／task tracking API 要固定版本並測試 |
| [RFC 9293](https://www.rfc-editor.org/rfc/rfc9293.html) | TCP 主規範與服務模型入口，供 08 查證 | 不用 TCP 的傳輸保證代替應用完成契約 |
| [Docker run 文件](https://docs.docker.com/engine/containers/run/) | 程序、filesystem、network 與執行設定入口，供 19 規劃 | 需與實際 Engine 及 host 平台核對 |

待正文逐項查證：Linux／POSIX 的 process、signal、read／write、fsync／rename 語意；C++ 的 thread、mutex 與 data race；CPython 建置與 async 取消行為；DNS、HTTP 及 TLS 的規範；monotonic clock、量測分位數與排隊模型的假設。這些項目尚未完成來源審核，不以既有教材的簡述代替第一手資料。

備料預定放 `data/systems-network-foundations/`：`README.md` 記來源 ID、原路徑／URL、日期、commit／版本、已讀範圍與未知項；`notes/` 記查證結果，`sources/` 只放可保存的必要摘錄。此目錄受 repo `.gitignore` 排除，重要決策與可公開來源必須同步保留在本計畫及未來的 `sources.md`。本輪沒有複製私人資料或下載完整外部教材。

## 9. 製作批次、落點與完成門檻

| 批次 | 交付 | 完成門檻 |
|---|---|---|
| P0 定版環境 | 版本紀錄、來源 tracker、合成輸入與 L01 最小程式 | 指定 Linux 環境可跑，正常及失敗路徑可清理；待驗平台明列 |
| P1 執行與資料 | 01–06、L01–L03、題目／提示／答案 | 資料流與完成層次清楚；首章完整單元先核對，再展開其餘頁 |
| P2 通訊 | 07–10、L04–L05 | 真跨程序成功；所有切段與非法輸入測試有效 |
| P3 併發與容量 | 11–13、L06–L07 | 受控競爭可重現，工作帳與容量政策一致 |
| P4 故障與生命週期 | 14–17、L08–L09 | 預算、未知結果與停止各有反例及獨立證據 |
| P5 觀察與整合閱讀 | 18–19、L10–L11、終點題與延後回測 | 能區分瓶頸及容器邊界；每個狀態可回到工作證據 |
| P6 出版驗收 | 導讀／概念圖／術語表／來源／驗證、MkDocs 設定與書庫卡片 | 全書連結、命令、程式、Mermaid、桌面與窄視窗檢查通過 |

正式落點：

```text
plan/systems-network-foundations/plan.md      # 本計畫與進度
data/systems-network-foundations/             # 作者備料，不作讀者依賴
docs/systems-network-foundations/             # 正文與支援頁
  examples/                                  # 獨立可跑的小實驗
  fixtures/                                  # 合成讀者輸入
  verification/                              # 可公開的驗證證據
configs/systems-network-foundations.yml       # 製作時新增
js/books-data.js                             # 可讀內容完成後登記卡片
book/systems-network-foundations/html/        # 生成產物，不存原始教材
```

出版時沿用現有資產與 MkDocs，不建立新平台。執行 `./sync-assets.sh` 後，以 `uv run mkdocs build --strict -f configs/systems-network-foundations.yml` 檢查；另驗相對連結、附件、程式命令、Mermaid 和桌面／窄視窗實際閱讀。跨書來源位置與發布 URL 分開核對。

每章交付欄分開記：來源已查證、正文完成、範例完成、題目就緒、工程驗證通過、讀者驗收。只有有證據的欄位才能勾選；本輪全部章節仍待製作。

## 10. 本輪結果與下一個可執行工作

- 已完成：B03 範圍、19 篇核心頁、11 組局部實驗、第一單元交付卡、既有內容盤點、C03 配對與出版判準。
- 2026-09-27 續作：P0–P6 的正文、`examples/` 與兩欄驗證已寫入 `docs/systems-network-foundations/`。未測項仍以該書 `verification.md` 為準，不把容器結果升級成斷電、真跨機或原生 Linux。
- 2026-09-27 審查修正：TCP 提早關閉有界失敗、容器失敗會回收、就緒檔晚於初始化、drain 只採期限內的完成訊號、訊息契約檢查欄位與版本、終點題有骨架與合成檔、L03 由新 reader 程序重讀、L10 留下同一工作的 log／metric／trace 與原始樣本。未測項仍以書籍 `verification.md` 為準。
- 下一步：若要改契約或補 Windows／free-threaded 欄，先加實驗再改對應頁。

## 11. 章節進度（2026-09-27）

| 章節 | 架構 | 正文 | 圖片 | 備註 |
|---|---|---|---|---|
| 01–19 與支援頁 | 沿用本計畫 | 已寫入 docs | 用頁內 Mermaid，無另外點陣圖 | 實驗證據見 verification |
| L01–L10 | 已跑 | macOS 3.13.12 與 linuxkit 容器 3.13.15 皆通過 | — | |
| L11 | 已跑 | 只在 Docker Desktop 欄通過 | — | 容器內再跑時 SKIP |
| C++ L02、L06 | 已跑 | 只在 macOS clang++ | — | 容器 SKIP |
