# Docker 現場招式：卡住時，先動這一小處

有時候，你不需要再學一百個 Docker 參數。你需要知道：明明 COPY 了卻找不到檔案，老手會先拿掉哪個掛載；容器一啟動就死，怎樣留下足夠時間看一眼；服務偶爾連不上，為什麼故意讓它更慢反而比較容易查。

這本書給會基本 build、run、logs、exec，卻還缺少現場經驗的工程師。每章只追一個問題：做一個改動小、回饋快、能撤回的動作，看到足以決定下一步的差異。你可以按症狀跳讀，不必先修完一門容器課。

> **第一版：13 章核心實驗已在 Docker Desktop Linux／arm64 重現。** 本版以 2026-09-22 的固定映像與工具版本執行，各章分列預期判準及實測結果。原生 Linux、WSL 2 與其他架構未做交叉驗證；第 11 章效能只代表這台機器的有限樣本。[驗證環境與邊界](appendix-d-evidence.md)

## 先拿到一個小成果

| 你現在卡住的地方 | 先試哪一章 |
|---|---|
| build 成功，執行時卻缺檔 | [01 拿掉掛載](01-remove-mount.md) |
| 改了 .env，restart 仍讀舊值 | [02 印出實際配置](02-effective-config.md) |
| 容器退出，exec 進不去 | [03 停止後取檔](03-copy-after-exit.md) |
| 還沒看清楚就退出 | [04 暫換入口](04-bypass-entrypoint.md) |
| 極簡映像沒工具可測網路 | [05 借網路工具](05-borrow-network-tools.md) |
| 程式活著，logs 沒字 | [06 先查輸出緩衝](06-unbuffer-logs.md) |
| 每次都要重點介面才能重現 | [07 固定輸入重播](07-replay-stdin.md) |
| Dockerfile 搬家後 COPY 壞了 | [08 改建置 context](08-build-context.md) |
| 前面建得出來，最後映像卻沒檔案 | [09 停在中間 stage](09-stop-at-stage.md) |
| 改輸入，build 卻一直用舊結果 | [10 只讓一段重跑](10-invalidate-one-stage.md) |
| Desktop 掃小檔特別慢 | [11 暫換存放位置](11-move-small-files.md) |
| 第一次啟動失敗，第二次就好 | [12 故意延後 ready](12-delay-readiness.md) |
| 每次 stop 都等滿 | [13 查訊號交給誰](13-forward-stop-signal.md) |

第一次閱讀，建議從 01、03、06 開始。這三章不要求複雜背景，卻能建立很有用的習慣：分清映像與執行期、停止與刪除、程式輸出與日誌收集。接著讀 02、04、07 控制入口，再進入建置與時序。

## 每一招都欠哪一筆帳

暫時拿掉掛載，會失去即時同步；繞過入口，要自己補回初始化；保存固定輸入，可能漏掉真實併發；借別的容器測網路，它的憑證與環境又不一定一樣。

這些代價不表示招式不能用，而是決定結果該怎麼讀。每章都用同一節奏：現場症狀、小動作、必要原理、親手實驗、結果解讀、失效反例、收尾。你會看到硬編碼、假輸入與暫時等待，但每次都要問「這次只證明什麼」。

書中的少量 Python、shell 和探針是教學程式，並非 Docker 內建功能。例子刻意不用通用實驗框架，讓讀者能看清楚每個動作。命令成功也不自動代表原問題解決；真正的成果可能只是排除一個候選原因。

## 動手前的共同約定

主線使用 **Linux containers、Bash 及本機 daemon**。macOS 可用 Desktop；Windows 的 shell 命令請在 WSL 執行，不直接貼進 PowerShell。原生 Windows containers、Swarm、Kubernetes 與 GPU 不在這版範圍。跨平台路徑、共享後端及程序行為仍需在你的環境核對。

第 06、11 章另需主機 Python 3。含 `set -euo pipefail` 的完整區塊請存成獨立 Bash 腳本或在新 shell 操作，避免改動正在使用的工作階段。

每章建立新的暫存工作目錄，使用 `field01` 到 `field13` 的專用名稱，不依賴前章檔案。請按區塊順序執行，確認前一步成功再往下；如果已經有相同名稱，先辨認是不是自己的上一輪練習。不要拿正式服務、正式密鑰或真正的資料卷代替教學資料。

幾個詞在全書保持同一意思：

| 詞 | 這本書的用法 |
|---|---|
| 映像 image | 用來建立容器的檔案與設定基礎；以 ID/digest 固定比較對象 |
| 容器 container | 一次建立出的執行環境；停止不等於刪除 |
| 重建映像 build | 重新執行建置流程；與重新建立 container 不同 |
| 重建容器 recreate | 用配置建立新容器；原容器可寫層不會自動搬過去 |
| fixture | 為對照保留的小份固定輸入、檔案或測試程式 |
| 預期 | 操作前依機制寫下的判準；實際結果另外記錄，兩者不能混寫 |

先收集版本；`docker version` 必須同時能取得 Server，才表示可以開始容器實驗：

```bash
docker version
docker compose version
docker buildx version
docker context show
docker info --format '{{.LoggingDriver}}'
```

本書使用的 `alpine:3.21`、`python:3.13-alpine` 是可讀的下載起點，tag 可以移動，不是最新版本推薦；本次實測的確切 digest 另列於證據附錄。各章 pull 後會記錄 image ID 或 repository digest：同機 `run` 可固定 ID；建置 FROM 固定可解析的 repository digest。A／B 中途不再 pull，避免把映像更新混成操作效果。不同 CPU 架構還要另記 platform，不能只對 tag 名稱。

需要 `docker logs` 的章節假設測試容器使用可讀取的日誌設定；若 daemon 預設 driver 不提供本機讀取，先按第 06 章核對輸出去向，不能把 logs 錯誤當成程式沒有輸出。

容器內測試程式有些故意失敗。請看失敗訊息是否符合本輪假設，不只看「非零就算成功」。如果前面的 build 失敗，後面卻拿舊同名 tag 跑出漂亮結果，那是很常見的假對照。

## 如何留下下次能用的經驗

把本輪固定條件、唯一改動、原始輸出與撤回記入[實驗紀錄卡](appendix-b-record.md)。先回答「這個差異夠不夠指引下一步」，再考慮是否值得收進正式流程。反覆有用的招式可以變成一條檢查；只用一次的 workaround 就讓它隨案例結束。

[症狀索引](appendix-a-symptoms.md)幫你找到下一站，[收尾表](appendix-c-rollback.md)列出各章留下的資源，[證據附錄](appendix-d-evidence.md)則保留案例的日期與適用邊界。全書不引用廠商效能百分比作承諾，也不靠付費工具或產品推薦完成實驗。
