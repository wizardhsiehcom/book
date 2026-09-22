# 02｜ping 通卻進不去：敲埠，再看它聽哪裡

**現有功能可直接操作｜Linux：Python 3.7+、iproute2；Windows：PowerShell、curl.exe｜需獨立測試目錄。** 以下是 loopback→LAN→loopback 的 A/B/A 設計；命令與結果尚未由本書作者在 Windows–Linux 實機重現。

## 現場症狀

Linux 本機瀏覽器能開，Windows 卻逾時；或有人以為「ping 通」就等於應用健康。ICMP 可能被規則擋掉，TCP 也可能只在 loopback 接收，兩者都不能替應用作結論。先不碰正式服務，用一個高埠小檔案回答更小的問題：程序到底在哪個位址聽 TCP？

## 小招式

本章建立自己的 `probe_dir`，不使用 04 章的 shell 變數。`192.168.50.10` 必須是 Linux 已擁有的 LAN 位址，8080 必須未占用。

```bash
probe_dir=$(mktemp -d)
printf 'bind-probe-v1\n' > "$probe_dir/probe.txt"
python3 -m http.server 8080 --bind 127.0.0.1 --directory "$probe_dir"
```

另開 Linux shell：

```bash
ss -lntp 'sport = :8080'
curl --noproxy "*" --connect-timeout 3 --max-time 5 http://127.0.0.1:8080/probe.txt
```

Windows PowerShell：

```powershell
Test-NetConnection 192.168.50.10 -Port 8080 -InformationLevel Detailed
curl.exe --noproxy "*" --connect-timeout 3 --max-time 5 --fail --show-error http://192.168.50.10:8080/probe.txt
```

## 必要原理

`127.0.0.1` 只接受 Linux 本機；`--bind 192.168.50.10` 才讓該 LAN 位址接客。`ss -lntp` 直接看 listening socket，查看別人程序的名稱可能需要 `sudo`。[O04：ss 手冊](https://raw.githubusercontent.com/iproute2/iproute2/main/man/man8/ss.8)

`Test-NetConnection -Port` 是 TCP 探測，不是 ICMP ping，也不驗證 HTTP 內容。[O02：Microsoft 文件](https://learn.microsoft.com/en-us/powershell/module/nettcpip/test-netconnection?view=windowsserver2025-ps) Python `http.server` 的 `--bind`、`--directory` 只適合短時間固定檔案，不含正式服務的 TLS、登入或資料庫。[P01：Python 文件](https://docs.python.org/3/library/http.server.html) 因此 A/B/A 的價值在於只改監聽位址；它把「根本沒接到 TCP」和「已接到但回應不對」分成兩個追查入口。

## 親手實驗

1. 保持 A。Linux 本機預期取到 `bind-probe-v1`，`ss` 預期顯示 `127.0.0.1:8080`；Windows TCP 與 curl 預期失敗。保存實際結果，不把預期當實測。
2. 按 Ctrl-C 停 A，確認 socket 消失，再在同一 Linux shell 啟動 B：

   ```bash
   python3 -m http.server 8080 --bind 192.168.50.10 --directory "$probe_dir"
   ```

3. Linux 本機改用 LAN 位址、Windows 重跑兩個命令。若防火牆允許，兩端預期取到檔案；若 `ss` 有 LAN listener 但 Windows 不通，保留差異，往規則、路由或介面查。若 Windows 顯示 TCP 成功卻 curl 報 HTTP 錯，保存狀態碼與 server 終端輸出，別回頭改 bind。
4. 再按 Ctrl-C，啟動 A，重做 Windows 測試。A/B/A 中只有 bind 位址刻意改變。

## 結果解讀

| 結果 | 先說什麼 | 不能說什麼 |
|---|---|---|
| A 本機通、B 兩端通、A 再現 | 監聽範圍是線索 | 防火牆與路由已正常 |
| B 有 LAN listener 但 TCP 失敗 | 查共同路徑與規則 | 一定是 Windows 防火牆 |
| TCP 通、curl 內容錯 | 已越過 TCP 建立 | 正式應用健康 |

`0.0.0.0:8080` 是所有本機 IPv4，不是只給五台。真正服務若有 bind 設定，應記原值後再做對照，不要永久暴露所有介面；若要只允許五台，應另外用精確規則限制來源，不能把 bind 位址當成存取控制。

看到 `127.0.0.1:8080` 時，下一刀是服務設定或啟動參數；看到 `192.168.50.10:8080` 而 TCP 仍失敗，下一刀是 server 規則、路由、VLAN 或 Windows 出口。看到兩個位址同時存在，則要確認是不是不同程序、IPv4／IPv6 或容器 namespace，不能只看埠號就說它們是同一個服務。

記錄 `ss` 的實際位址比記錄「服務已啟動」更有用，因為前者可以直接和 Windows 的目的地對照。

## 失效反例

小服務成功只證明這個 IP、TCP 埠和簡單 HTTP 路徑當下可走；HTTPS、SMB、UDP、用戶端憑證與正式埠仍未測。若 8080 已有人使用，換一個固定高埠，不能殺掉不明程序。若 IP 不在 Linux 上，先查 `ip -br addr`，不要在本章偷偷配址。若正式服務由容器或不同 namespace 執行，host 上看到的 listener 也未必是 client 要找的那個。若本機成功、LAN 失敗，即使 ping 同樣失敗，也不要把兩個結果合併成一句「網路壞了」。

## 收尾與撤回

按 Ctrl-C 停掉最後一個 server，確認沒有本章 socket；回建立目錄的 Linux shell 清理：

```bash
rm -- "$probe_dir/probe.txt"
rmdir -- "$probe_dir"
```

撤回任何本章新增的精確放行規則，再回正式服務測一次。這個檢查若反覆有用，才加入維運腳本；不要把暫時 Python server 正式化。

來源對應：O02、O04、P01。下一步：[04｜把整個服務換成一個小檔案](04-tiny-server.md)；若服務必須留在 localhost，看 [10｜先拉一條隧道](10-local-tunnel.md)。
