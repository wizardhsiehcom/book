# 來源

查核日期：2026-09-27。這裡只列正文用到的入口與支持範圍。工作筆記在倉庫的 `data/systems-network-foundations/notes/`，該目錄被 git 忽略，所以可公開的限度寫在本頁。沒有複製整份 RFC，也沒有放入私人產線資料。

| 來源 | 用在 | 支持到哪裡 |
|---|---|---|
| [Python 3.13 subprocess](https://docs.python.org/3.13/library/subprocess.html) | 程序 | stdout 與 returncode 分開；`None` 表示上次觀察時還沒看到終止；`communicate` 逾時不殺子程序，`run` 逾時會殺並等待 |
| [POSIX _Exit](https://pubs.opengroup.org/onlinepubs/9699919799/functions/_Exit.html) | 程序 | 未被取走狀態的子程序可成為 zombie；父程序結束不自動殺掉子程序 |
| [POSIX wait](https://pubs.opengroup.org/onlinepubs/9699919799/functions/wait.html) | 程序 | 父程序用 wait 取得狀態 |
| [Linux signal(7)](https://man7.org/linux/man-pages/man7/signal.7.html) | 停止 | SIGKILL 不能被抓住、阻擋或忽略 |
| [Python id](https://docs.python.org/3.13/library/functions.html#id) | 位址 | 壽命內的身分；CPython 才把實作細節說成位址 |
| [Linux 記憶體概念](https://www.kernel.org/doc/html/latest/admin-guide/mm/concepts.html) | 位址、搬移 | 虛擬位址經 MMU 翻譯；寫入通常先進入頁快取 |
| [Linux process address space](https://www.kernel.org/doc/html/latest/mm/process_addrs.html) | 位址 | 共享該位址空間的 tasks 參考同一份 |
| [C++ intro.races](https://eel.is/c++draft/intro.races) | 共享狀態 | data race 的行為未定義。頁面讀的是草案 |
| [POSIX read](https://pubs.opengroup.org/onlinepubs/9699919799/functions/read.html) / [write](https://pubs.opengroup.org/onlinepubs/9699919799/functions/write.html) | 檔案、串流 | 短讀、短寫與 EOF 的回傳值 |
| [Python io](https://docs.python.org/3.13/library/io.html) / [os.fsync](https://docs.python.org/3.13/library/os.html#os.fsync) | 完成層次 | flush 交給底層；fsync 前要先 flush |
| [POSIX fsync](https://pubs.opengroup.org/onlinepubs/9699919799/functions/fsync.html) | 完成層次 | 送到關聯儲存裝置；性質實作定義 |
| [Linux fsync(2)](https://man7.org/linux/man-pages/man2/fsync.2.html) | 完成層次 | 與 POSIX 分開記。目錄項要另外 fsync。本次沒有斷電 |
| [POSIX rename](https://pubs.opengroup.org/onlinepubs/9699919799/functions/rename.html) | 發布 | 替換期間名稱仍指向舊檔或新檔之一 |
| [Python socket](https://docs.python.org/3.13/library/socket.html) / [HOWTO](https://docs.python.org/3.13/howto/sockets.html) | 名稱、串流 | getaddrinfo、部分 send/recv、沒有 EOT。HOWTO 範例不是正式協定 |
| [POSIX getaddrinfo](https://pubs.opengroup.org/onlinepubs/9699919799/functions/getaddrinfo.html) | 名稱 | 把服務名稱翻譯成一組 socket 位址 |
| [RFC 1035 §2.1](https://www.rfc-editor.org/rfc/rfc1035.html) | 名稱 | 名稱指向資源紀錄，不是連線 |
| [RFC 9293](https://www.rfc-editor.org/rfc/rfc9293.html) §2.2、§3.7 | 串流 | 可靠依序位元組流；segment 邊界不對應一次 write |
| [RFC 9110](https://www.rfc-editor.org/rfc/rfc9110.html) / [RFC 9112](https://www.rfc-editor.org/rfc/rfc9112.html) | HTTP | 狀態碼是回應語意；框架與連線關閉不能混成完整回應 |
| [RFC 8446 §1](https://www.rfc-editor.org/rfc/rfc8446.html) | HTTP 邊界 | TLS 要求下層已是可靠依序位元組流 |
| [Python http.client](https://docs.python.org/3.13/library/http.client.html) | HTTP | `status` 來自伺服器回應列 |
| [Python threading](https://docs.python.org/3.13/library/threading.html) / [What's New 3.13](https://docs.python.org/3.13/whatsnew/3.13.html) | 並行 | 預設建置有 GIL；free-threaded 不是預設 |
| [Python asyncio tasks](https://docs.python.org/3.13/library/asyncio-task.html) | 非同步、取消 | 一次一個 Task；取消是協作的 |
| [Python queue](https://docs.python.org/3.13/library/queue.html) | 容量 | maxsize、Full、3.13 的 shutdown |
| [Python time](https://docs.python.org/3.13/library/time.html) | 預算、觀察 | monotonic、perf_counter、process_time 的差值 |
| [Docker run](https://docs.docker.com/engine/containers/run/) / [stop](https://docs.docker.com/reference/cli/docker/container/stop/) | 容器 | 隔離的檔案系統、網路與程序樹；先 SIGTERM 再 SIGKILL |

未支持、因此正文不把它寫成已證：斷電後資料仍在、真跨機掉線、netem、TLS 交握成功、應用授權、產線吞吐、Kubernetes。

[返回地圖](00-map.md)
