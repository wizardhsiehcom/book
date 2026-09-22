# 04｜把整個服務換成一個小檔案

**現有功能可直接操作｜Linux：Python 3.7+；Windows：curl.exe｜不需管理員權限啟動高埠服務。** 本章是依文件設計的實驗，尚未完成 Windows–Linux 實機重現。

## 現場症狀

Windows 上的機台軟體一直顯示「連線失敗」。Linux 上還有資料庫、設備介面與背景工作，任何一個沒起來都可能得到同樣畫面。與其等整套系統準備好，先讓同一台 Linux 回傳一行你認得的字。

這個小成果很有限，卻有用：它把「完全無法經過這條路徑拿到資料」和「原應用仍有問題」分開。

## 小招式

在 Linux shell 開一個全新的暫存目錄，只放假資料。以下 IP 必須換成 Linux **已經擁有的 LAN 位址**；不是執行命令就會替網卡配址。8080 必須未被占用。

```bash
probe_dir=$(mktemp -d)
printf 'field-probe-v1\n' > "$probe_dir/probe.txt"
python3 -m http.server 8080 --bind 192.168.50.10 --directory "$probe_dir"
```

保持這個終端開著。在 Windows PowerShell 執行：

```powershell
curl.exe --noproxy "*" --connect-timeout 3 --max-time 5 --fail --show-error http://192.168.50.10:8080/probe.txt
```

預期內容是 `field-probe-v1`，這是**預期示意，不是本書實測輸出**。若卡住，命令會在時間上限內退出。先記下完整錯誤，接著看 [02：埠與監聽](02-port-and-bind.md)，不要立刻重裝服務。

## 必要原理

`--directory` 限定要提供的資料目錄，`--bind` 選擇監聽位址。Python 的這個模式提供檔案，沒有替正式應用補上登入、資料庫或設備通訊，也不是 POST 接收器。目錄應只含本章產生的測試檔；不要改指向家目錄或帶有 symlink 的工作目錄。[Python 文件](https://docs.python.org/3/library/http.server.html)

Windows 明寫 `curl.exe`，避免把 PowerShell 的同名別名當成 curl。`--noproxy "*"` 讓這次要求直連，省掉代理伺服器這個變因；因此成功也沒有驗證原應用使用的 proxy 路徑。[curl 手冊](https://curl.se/docs/manpage.html)

## 親手實驗

1. 保持正式服務原狀，從 Windows 取一次固定檔。記時間、目的 IP、8080、HTTP 錯誤或內容。
2. 在 Linux 終端按 Ctrl-C，只停本章程序；Windows 重跑相同命令。這次應失敗。若仍成功，先查是否有別的程序接手，或你測的不是這台。
3. 在同一 Linux shell 重新執行 Python 那一行，保留原 `probe_dir`；Windows 再取一次。比較成功／失敗／成功三態。
4. 另用原機台軟體測原服務，記它真正使用的 IP 與埠，別把 8080 的結果填到正式服務欄。

若 Linux 顯示 `Cannot assign requested address`，查 `ip -br address`：你綁的 IP 並不在目前環境。若是 `Address already in use`，查監聽，不要殺掉不明程序。若 server 已監聽而 client 不通，可能還有路由或防火牆條件；本章不需要關掉整台防火牆。

## 結果解讀

| 看見的差異 | 接下來值得查 | 還不能下的結論 |
|---|---|---|
| 8080 可取檔，正式服務失敗 | 原埠、原協定、服務日誌與依賴 | 「網路全部正常」 |
| 本機可取檔，Windows 不行 | bind、實際出口、規則、封包 | 「一定是 Windows 壞了」 |
| Python 終端有 GET，但 client 報錯 | 回應內容、狀態碼、傳回路徑 | 「有請求就表示已成功」 |
| 停程序後仍取得到 | 目的地、代理路徑、是否另有服務 | 「Ctrl-C 沒用」 |

最值得保存的是兩個測試的不同：相同 server、不同埠／服務，有哪一個成功。這會告訴你下一刀該切在哪裡，而不是直接提供根因。

## 失效反例

正式服務使用 TLS、用戶端憑證或 SMB 時，純 HTTP 小檔案不會走過那些機制。小檔成功也看不到大流量、長連線和五台競爭。要追吞吐，移到 [07：分開測兩個方向](07-two-directions.md)；不要把本章變成效能驗收。

代價從「等待整套系統」轉成「人工維持一個替身」。替身越久不撤，越容易被誤認成真正的健康檢查。

## 收尾與撤回

在 Linux 按 Ctrl-C，確認 Windows 重新要求已失敗。在建立目錄的同一 shell 中只刪本章檔案：

```bash
rm -- "$probe_dir/probe.txt"
rmdir -- "$probe_dir"
```

若曾依現場規則加入精確測試放行，按原紀錄移除那條規則。最後回到原應用再測一次。只有這種替身反覆被需要時，才考慮把固定測試內容與操作紀錄正式保存。

來源對應：P01、O02；證據分級見 [來源索引](appendix-sources.md)。下一步：[02｜ping 通卻進不去](02-port-and-bind.md)。
