# 11｜只有一台開不了共享：先比帳號與版本

**現有功能可直接操作｜特定 Windows build／政策與 Samba 環境｜需已有具名測試共享。** 本章未建立 Samba 系統；Windows–Linux 認證與共享實驗尚未重現。

## 現場症狀

C1 可以開共享，C2 一直說拒絕存取。把 Linux 目錄改成人人可寫，錯誤還在；這時你只是多改了一件事。檔案系統權限之外，還有目的地、SMB 協商、帳號、登入狀態與 client 政策。

先借一台正常 client 當對照，讓兩台連到**同一個名稱、同一個共享、同一個具名測試帳號**。五台規模最省工的做法，往往是一張差異表。

## 小招式

以下假設已有 `\\linux-box\fieldtest` 測試共享，放著只供讀取的 `probe.txt`，帳號也已由管理者配置。`linux-box`、`fieldtest`、`LABSERVER\fieldreader` 都是占位，必須換成既有環境的真實值。沒有這個前提時，先完成設定快照，檔案讀取實驗留待共享建立後。

在 C1 與 C2 的 Windows PowerShell，先執行唯讀查詢。SMB 查詢若需要提升權限，使用各自的管理員 PowerShell，並記下與原應用不同的登入身分。

```powershell
$server = 'linux-box'
$share = 'fieldtest'
$unc = "\\$server\$share"
Test-NetConnection $server -Port 445
Get-SmbClientConfiguration | Select-Object RequireSecuritySignature
Get-SmbConnection | Where-Object { $_.ServerName -eq $server -and $_.ShareName -eq $share } | Format-List *
net use
```

另外在兩台按 Win+R 執行 `winver`，記 edition、版本與 OS build。空白連線結果只表示本次篩選沒有列出連線；先核對 server 實際名稱，不要當成密碼錯誤。

## 必要原理

445 可建立 TCP，只到 SMB 的門口。SMB2/3 下不要用舊式 `EnableSecuritySignature` 欄位判斷實際簽章；這裡只以 `RequireSecuritySignature` 作政策快照。`Get-SmbClientConfiguration` 是這台主機的設定，`Get-SmbConnection` 是已建立連線的觀察；兩張表不能互相代替。[Microsoft 設定命令](https://learn.microsoft.com/en-us/powershell/module/smbshare/get-smbclientconfiguration?view=windowsserver2025-ps)、[連線命令](https://learn.microsoft.com/en-us/powershell/module/smbshare/get-smbconnection?view=windowsserver2025-ps)

Microsoft 的 signing 文件區分 Windows 11 24H2 Pro／Enterprise／Education 與 Home 等版本的預設。現場還可能有群組原則覆寫，所以不能只聽「都是 Windows 11」就當成條件相同。本章查實際值，沒有預設關閉 signing 的步驟。[SMB signing 文件](https://learn.microsoft.com/en-us/windows-server/storage/file-server/smb-signing)

## 親手實驗

先確認兩台都沒有正在使用此測試共享的工作，且既有同 server 的其他連線不會造成憑證衝突。若有正式工作正在使用，保留快照，不清除它們來湊實驗。

在一般使用者 PowerShell、也就是要做檔案操作的身分下，連接測試共享。星號會互動要求密碼，不把密碼寫入命令歷史：

```powershell
net use $unc /user:LABSERVER\fieldreader * /persistent:no
Get-Content "$unc\probe.txt"
```

C1、C2 使用相同的真實測試身份；domain／server 前綴依現場帳號來源決定。若出現相同 server 已有其他憑證的衝突，停止該台登入實驗，先列出現有連線並記錄；在能隔離測試登入前，不改 server 拼法繞過比較條件，也不繼續把讀檔結果當成指定測試帳號的成果。接著重新查看 SMB connection 的 UserName、Dialect、Encrypted 與版本實際提供的欄位。

Linux shell 查現有設定，不重啟服務：

```bash
testparm -s /etc/samba/smb.conf
```

設定路徑若不同，換成服務真正讀取的檔案。只有現場 `testparm --help` 支援時，才以 `--section-name=fieldtest` 縮小輸出。testparm 成功只代表工具對設定的檢查通過，不代表密碼、檔案 ACL 或檔案讀取通過。[Samba testparm 文件](https://www.samba.org/samba/docs/4.17/man-html/testparm.1.html)

把結果填成三列：TCP 445、具名登入、讀到固定內容。這樣「拒絕存取」才被拆成可比較的階段。

## 結果解讀

| C1／C2 差異 | 下一個小動作 | 暫時不能說 |
|---|---|---|
| 445 就不同 | 回 01／02 對照路徑與規則 | Linux 目錄權限錯 |
| 445 都通，登入不同 | 比帳號來源、政策、server 認證日誌 | 一定要開 guest |
| 都有 SMB 連線，讀檔不同 | 比身份、路徑、檔案 ACL 與分享權限 | 連線存在代表已授權 |
| 清掉測試 mapping 後不同 | 查舊憑證與連線狀態 | 正式根因已修好 |

記錄目前值，比猜某個版本的預設更直接。省下的是重裝與全開權限，代價是管理一組測試帳號、維持一份小型差異表。

## 失效反例

把 `\\名稱\共享` 改成 `\\IP\共享`，可能連驗證方式都改了；不能當作只有 DNS 改變。Samba 的 `map to guest = Bad User` 是針對不存在的使用者，不是所有錯密碼都降成 guest；把登入錯誤掩蓋掉，會讓身份對照更難讀。[Samba map to guest](https://www.samba.org/samba/docs/current/man-html/smb.conf.5.html#MAPTOGUEST)

此章不提供通用 `chmod 777`、關 signing、開 guest 的處方。它們既沒有隔離問題，也不能用一台暫時成功證明適合所有五台。

## 收尾與撤回

關閉用到測試共享的檔案與視窗，離開該共享目錄。從 `net use` 確認是哪個 mapping；若本章建立的是無磁碟代號的連線，先用目標 build 的 `net use /?` 核對 UNC 刪除形式，再嘗試只刪這個 UNC：

```powershell
net use $unc /delete
```

刪除後重查 `net use` 與 `Get-SmbConnection`，確認測試 mapping 的實際狀態；若未清掉，保留未撤回紀錄，不改用全清。若實際有磁碟代號，僅在確認該代號就是本章測試 mapping 時刪它。不要使用 `net use * /delete` 全清；同 server 尚有其他共享時，刪一個 mapping 也不代表整個 session 已消失。[Microsoft net use 文件（舊版語法，現場需核對）](https://learn.microsoft.com/en-gb/previous-versions/windows/it-pro/windows-server-2012-r2-and-2012/gg651155%28v%3Dws.11%29)

本章借用既有共享，不刪 server 帳號或共享。若管理者另外為實驗新增資源，再按原建置紀錄撤回。最後回原 client、原名稱、原工作流程確認；有可重現差異後才修改那個真正不相容的條件。

來源：P04、P05、O02、O03、W02。保留結果到 [五台對照表](appendix-records.md)，下一次遇到同樣症狀就有基線可比。
