# 10｜localhost 才能看？先拉一條隧道

**現有功能可直接操作｜Linux：Python 3.7+、OpenSSH server；Windows PowerShell：OpenSSH client、curl.exe｜需允許 SSH forwarding。** 本章命令與結果尚未由本書作者在 Windows–Linux 實機重現。

## 現場症狀

Linux 管理頁只聽 `127.0.0.1:8080`，Windows 維護人員看不到，於是想改成 `0.0.0.0`、開防火牆，甚至關掉驗證。若問題只是「人要看一次頁面」，先保留 loopback，讓 SSH 暫時把入口帶到 Windows 本機；成本是多一個受控 session，以及應用看到的來源路徑改變。

左側 `127.0.0.1:18080` 是 Windows loopback；右側 `127.0.0.1:8080` 是 Linux loopback。兩端都寫出來，才不會把目標誤當 Windows 自己。

## 小招式

Linux shell 建立本章自己的 fixture：

```bash
probe_dir=$(mktemp -d)
printf 'tunnel-probe-v1\n' > "$probe_dir/probe.txt"
python3 -m http.server 8080 --bind 127.0.0.1 --directory "$probe_dir"
```

Windows PowerShell：`user` 和 IP 換成現場值。

```powershell
ssh -o ExitOnForwardFailure=yes -N -L 127.0.0.1:18080:127.0.0.1:8080 user@192.168.50.10
```

第一次見到主機金鑰指紋，要用已知管道核對；不要加 `StrictHostKeyChecking=no`。保持 SSH 視窗，再開另一個 PowerShell：

```powershell
curl.exe --noproxy "*" --connect-timeout 3 --max-time 5 --fail --show-error http://127.0.0.1:18080/probe.txt
```

## 必要原理

`-L` 在 client 本機聽埠，由 SSH server 連到指定目標；`-N` 只做轉送、不開遠端 shell。[P02：OpenSSH ssh(1)](https://man.openbsd.org/ssh) 因此路徑是 Windows loopback → SSH → Linux loopback。HTTP 程序看到的來源是 Linux 本機，不是 Windows LAN 位址；原本依 client IP 做的白名單可能因此不再相同。

`AllowTcpForwarding`、`PermitOpen` 或帳號政策可能拒絕轉送。若真實頁面是 HTTPS，仍保留 SSH 主機金鑰與 TLS 憑證驗證；不要用 `curl -k` 或關瀏覽器驗證消除錯誤。

## 親手實驗

1. 先從 Windows 直接取 `http://192.168.50.10:8080/probe.txt`；因 Linux 只綁 loopback，預期 LAN 直連失敗。這是預期，不是本書實測。
2. 執行 SSH 命令；若立即退出，查帳號、指紋、TCP 22 和 forwarding policy。
3. 另一個 PowerShell 取 `127.0.0.1:18080`，預期得到 `tunnel-probe-v1`。Linux 可用 `ss -lntp 'sport = :8080'` 確認服務仍只聽 loopback；若想保存證據，同時記下 SSH 視窗的錯誤訊息（若有）與 Python 收到的請求時間。
4. 在 SSH 視窗按 Ctrl-C，再重跑本機 curl，預期 18080 失敗；最後停 Linux Python。這是「直連失敗／隧道成功／撤回後失敗」三態。

## 結果解讀

| 觀察 | 可說明 | 仍要查 |
|---|---|---|
| 直連失敗、隧道成功 | 替代路徑能到 Linux loopback | 權限、TLS、redirect、callback |
| SSH 建立、curl 失敗 | 本地 listener、遠端 8080 或 HTTP 仍有差異 | 兩端日誌與 proxy |
| SSH 被拒絕 | 目前政策不允許 forwarding | 不要為一次維護全域開放 |
| Ctrl-C 後 18080 仍通 | 可能還有其他程序 | `Get-NetTCPConnection -State Listen -LocalPort 18080` |

隧道成功不是正式服務已修好；應用若按來源 IP 放行、產生 callback、要求固定 host，或把本機 port 寫入 redirect，轉送後仍可能失敗。它只回答「這個維護入口能否沿 SSH 到達 loopback 服務」。

還要分清兩種身份：SSH 主機金鑰確認的是你連到哪台 Linux；HTTPS 憑證確認的是管理頁宣稱的名稱。隧道只搬運位元組，既不替你核對主機，也不替你修正名稱。若這兩種檢查有錯，應保存錯誤並處理名稱或信任鏈，不把成功取到一個 HTTP fixture 當成安全性證據。

這也是為什麼本章命令不加任何跳過驗證的旗標：短路徑應該減少網路變因，不能順手刪掉身份判斷。

## 失效反例

SSH 若只能從管理網段進入，隧道不會繞過它。右側 loopback 也必須和服務在同一個 Linux network namespace；容器內的 `127.0.0.1` 可能不是 host 的 loopback。本機 18080 被占用時，換未占用高埠但保持左右對應。若 SSH 連得上但遠端埠拒絕，先核對服務是否仍在前景及它的實際 namespace。

不要用 `-L 0.0.0.0:18080:...` 擴大 Windows 的接受範圍，也不要關主機金鑰或 HTTPS 憑證驗證。要測 LAN bind，回到 [02：敲埠，再看它聽哪裡](02-port-and-bind.md)；要測假回應，回到 [04：小檔案服務](04-tiny-server.md)。

## 收尾與撤回

Windows 按 Ctrl-C，確認 18080 消失：

```powershell
Get-NetTCPConnection -State Listen -LocalPort 18080 -ErrorAction SilentlyContinue
```

若仍有輸出，只結束本章啟動的 SSH，不停止不明程序。Linux 按 Ctrl-C 後清理自己的檔案：

```bash
rm -- "$probe_dir/probe.txt"
rmdir -- "$probe_dir"
```

不改 server bind、不留防火牆例外。反覆需要時才把主機、埠和核對流程寫進受控 SSH 設定，不要為一次維護部署永久公開服務。

來源對應：P02、P01、O02、O04；本章只提出替代入口實驗，不宣稱修復原應用。前一個入口檢查：[02｜ping 通卻進不去](02-port-and-bind.md)。
