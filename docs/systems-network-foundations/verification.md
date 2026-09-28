# 驗證紀錄

日期：2026-09-27。數字來自分開的兩次 `python3 run_all.py`。原始摘要在同目錄的 `verification/macos-native.json` 與 `verification/linux-container.json`。再跑一次，PID 與計時會變；不變的是各腳本的通過條件。

## 環境

| 欄 | macOS 原生 | Linux 容器 |
|---|---|---|
| 機器 | Apple M3，arm64，macOS 27.0（build 26A428），Darwin kernel 27.0.0 | Docker Desktop Engine 29.2.0，linux/arm64，kernel 6.12.67-linuxkit。這不是 macOS 核心，也不是獨立的實體 Linux 主機 |
| Python | CPython 3.13.12，Clang 21.1.4，`sys._is_gil_enabled()` 為 True | 映像 `python:3.13-alpine`，本機 image id `sha256:1a63a53928ce53d2b0baf08092a703f4840ac5dfbd61fd48802dbf48e08c801e`（映像建立時間 2026-09-17）。容器內 CPython 3.13.15，GCC 15.2.0，GIL 同樣開著。沒有登錄檔 digest |
| C++ | Apple clang 21.0.0，`-std=c++17 -O2` | 容器裡沒有 clang++，兩支 C++ 記 SKIP |
| 怎麼跑 | `docs/systems-network-foundations/examples` 裡的 `run_all.py` | 同一目錄掛進容器的 `/book/examples`。容器內沒有 Docker，所以 L11 在這一欄是 SKIP |

## 這次通過的檢查

兩邊的 Python 腳本 L01–L10 結束碼都是 0。

- L01：正常、退出碼 2、未知模式、逾時回收都有有界結束。錯誤版會把 STARTED 當成成功，測試確認它和退出碼不一致。
- L02：兩個子程序的值分別是 10 與 20。macOS 上 2,000,000 bytes 的複製加總比借用久（這次 `copy_us 502`、`borrow_us 344`）。先前還有 722 對 638、356 對 168、347 對 155。差距會變。
- L03：半檔被拒絕，發布後才接受。未發布與發布後各由一個新的 reader 程序印出 `REJECT` 與 `ACCEPT`。兩邊的目錄 `fsync` 都印出 `dir_fsync=ok`，只表示這次呼叫沒有丟例外。沒有斷電。
- L04：localhost 得到 `127.0.0.1` 與 `::1`。`.invalid` 解析失敗。關閉的 port 被拒。`/ok` 為 200，`/missing` 為 404。
- L05：切點、超限、壞 UTF-8、壞 JSON、缺欄位、錯誤型別、非物件與未支援版本都拒絕。回覆標頭或正文未到齊時對端關閉，在 1 秒內以截斷失敗。逐 byte 的正常 TCP 仍組出 `v` 為 1 的那一筆。
- L06：等待約 0.21 秒時，這段 `process_time` 接近 0。macOS 上 `to_thread` 牆鐘 0.085 秒，序列加總 0.056 秒。容器上是 0.106 對 0.079。C++ 邏輯競爭在 macOS 印出 `split 1`、`whole 2`。
- L07：提交 5、接受 2、拒絕 3、完成 2。
- L08：共用預算的牆鐘，macOS 0.207 秒、容器 0.201 秒，容忍 0.12 秒。各自睡滿的版本是 0.464 與 0.454 秒。
- L09：假健康與就緒分開。drain 只把期限內有完成訊號的工作標成 completed；超過期限的 slow 維持 incomplete，停止後的新工作被拒。SIGKILL 後沒有 cleanup 檔。
- L10：四類都被分類器分開。工作 `AOI-SYN-OBS` 的四段都有 log、metric、trace。CPU 的 7 個原始樣本寫在 `verification/l10-cpu-samples-macos.json` 與 `l10-cpu-samples-linux.json`，nearest-rank 的 0.5 分位由這份清單重算，約 0.0500 秒。這是人造負載。
- L11：只在 macOS 的 Docker 欄。就緒檔在初始化完成後才發布；報告失敗與檢查失敗都會 `docker rm -f` 這次的容器。正式那次訪客 PID 1，hostname 與主機不同，掛載檔看得到，`docker stop` 寫下 `sigterm`，退出碼 0。新容器讀不到前一個容器的 `/tmp`。
- 終點題起點 `station_skeleton.py`：半檔被拒、回覆遺失時客戶端是 unknown、停止時 M-5 為 incomplete、M-6 被拒。

## 還沒有做

- 原生 Linux 主機、第二台實體機器、Windows。
- 斷電、拔除儲存、netem、管理者權限的網路故障。
- TLS 交握、憑證與應用授權。
- free-threaded CPython（`python3.13t`）。上面兩次都是預設、GIL 開著的建置。
- C++ data race 的 sanitizer。L06 的 C++ 是有 mutex 的邏輯競爭，沒有把未定義行為的輸出當答案。
- 用這批人造負載估計產線速度。

2026-09-27 先執行 `bash ./sync-assets.sh`，再執行 `uv run mkdocs build --strict -f configs/systems-network-foundations.yml`，建置通過。產出在 `book/systems-network-foundations/html/`。抽查生成頁時，每個 HTML 都有一個「回到書庫」，連結是 `../../../index.html`。這次沒有開瀏覽器看桌面與窄視窗的排版，Mermaid 只確認生成成 `div.mermaid`。

[返回地圖](00-map.md)
