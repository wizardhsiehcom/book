# 01｜五台先留一台：把線、孔、位址釘住

**現有功能可直接操作｜Windows PowerShell、Linux shell 加上實體換線／換機｜不改 IP。** 本章命令與結果是待做實驗，尚未由本書作者在 Windows–Linux 實機重現。

## 現場症狀

五台 client 都說「連不上」，現場卻同時重開機、換線、改位址。下一次若恢復，沒有人知道是哪一刀有效；若故障只發生在一台，五台一起動還會把差異洗掉。先留 C1，把 Linux server、測試目的地與埠固定，只讓一個條件改變，換回一張能解釋「問題跟著什麼走」的表。

## 小招式

先記現況，**不執行任何改 IP 命令**。示例位址要換成現場已存在的值。

Linux shell：

```bash
ip -br addr
ip -br link
ip route get 192.168.50.21
```

Windows PowerShell：

```powershell
Get-NetIPConfiguration
Get-NetAdapter | Format-Table Name,Status,LinkSpeed,MacAddress
Test-NetConnection 192.168.50.10 -Port 8080 -InformationLevel Detailed
```

記下 `client、IP/prefix、MAC、線標、交換器埠、link speed、時間`，並註明測試端點是 server 的哪個 IP／埠。A 是 C1＋線 A＋埠 1；換機時只把 C1 換成 C2，線和埠不動，C2 使用自己的既有 IP。換回 C1，形成 A/B/A。要查線材，就恢復 C1＋埠 1，只換線 A→B。拔插前先確認 client 不在執行會寫入資料的工作。

## 必要原理

`ip route get` 只顯示 Linux 對目的地會選的路由，不會送封包；[O08：ip-route 手冊](https://man7.org/linux/man-pages/man8/ip-route.8.html) 因此只能當路徑線索。`Test-NetConnection -Port` 只測 TCP 建立，不是 ping，也不驗證 HTTP、登入或長連線；見 [O02：Microsoft 文件](https://learn.microsoft.com/en-us/powershell/module/nettcpip/test-netconnection?view=windowsserver2025-ps)。

共同觀察要保持不變：每輪都對同一個測試端點做相同請求。若需要先做已知回應，使用 [04：小檔案服務](04-tiny-server.md)；若連埠都不確定，接著看 [02：埠與監聽](02-port-and-bind.md)。

## 親手實驗

1. C1 連續測三次，保存 Windows 輸出、Linux 路由與 link speed。
2. 線 A、埠 1 不動，換成 C2；用 C2 原有配址測三次。
3. 換回 C1，重測一次。若 C1 好、C2 壞，故障候選跟著 client 走。
4. 需要時只替換線或只換交換器埠，各做一次 A/B/A。每次先記下埠可能有 VLAN、速率或 MAC policy；不要一次換掉 client、線、埠、IP 和服務。若現場不准拔線，至少先做唯讀路由、網卡與服務測試，把實體變因留到維護窗口。

若 link 沒起來，保存介面燈號與 Windows `Status`，不要因失敗就停用網卡或重設位址。

## 結果解讀

| 觀察 | 先查 | 不能直接判定 |
|---|---|---|
| 失敗跟著 C2 走 | C2 的 NIC、驅動、規則、應用與原配址 | 網卡已壞 |
| C1 只在換線後失敗 | 線材、接頭、重新協商 | 一定是線本體 |
| 只在埠 2 失敗 | VLAN、速率、port security、埠狀態 | 交換器硬體故障 |
| 五台都失敗 | server、共同線路、路由、規則、服務 | Linux 一定是根因 |

C2 與 C1 的 IP 若本來不同，結果只表示「各自原身份」是否可通，不能拿來冒充純硬體對照。若應用會把 client IP 寫入白名單或資料庫，還要把這個業務條件記在結果旁；通不通可能是授權差異，而不是線路差異。這份紀錄的目的，是決定下一個便宜的觀察點，不是立刻宣布哪個零件壞了。

## 失效反例

C1、C2 都能取 8080，只證明共同測試路徑可用，正式協定、代理、認證與應用仍未驗證。交換器的 MAC 綁定也可能讓換機必然失敗；這時「跟著 C2 走」仍只代表政策跟著 C2 的 MAC 走。逐台測試刻意拿掉五台同時流量；「單台成功」不能寫成整個現場已健康。

## 收尾與撤回

把 C1、C2、線 A、埠 1 放回原位置；核對 IP、prefix、路由和網卡狀態都沒有被改動。刪除含 MAC 或位址的暫存表，或依規則封存。只有同一組機台反覆需要這個判斷，才把 client／線／埠／配址表正式維護。

來源對應：O08、O02、F06；採用 F06 的單變因診斷設計，不採用其特定 NIC 參數值。下一步：[02｜ping 通卻進不去](02-port-and-bind.md)。
