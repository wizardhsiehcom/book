# 08｜小的通，大的卡：找出尺寸門檻（進階選讀）

**進階選讀｜現有功能可直接操作｜Windows IPv4 ping、Linux iputils ping｜不改 MTU、不需要 router；命令與現場版本尚未在本機驗證。** 本章只做少量 ICMP 大小探測，先找值得追的線索，不把 ping 的結果當成 TCP 證明。

## 現場症狀

小請求可以得到回應，大一點的檔案或長連線卻停住。有人會直接把所有介面的 MTU 改小，短期似乎安靜，卻多了一個很難追蹤的永久狀態。也有人只執行沒有大小參數的 `ping`，看到四個回覆就宣布「封包沒有問題」。

小招是固定目的地和介面，讓 IPv4 的 Don't Fragment 與 payload 大小成為唯一改動。從較小的值開始逐步增加；這不需要先造一個 PMTU black hole，也不需要在主線網路放一台 router。得到的是「這條路徑值得查 MTU／分片／ICMP 回報」的線索，還不是根因。

## 小招式

先確認兩端都用 IPv4 位址，並且允許少量 ICMP。Windows 的 `/f` 設定 IPv4 不分片，`/l` 是資料區長度；Linux 的 `-M do` 要求核心做 PMTU 檢查，`-s` 是 ICMP payload 長度。兩個系統的旗標不能照字面互換；Linux 的 `-f` 是 flood，不能拿來表示 Windows 的 `/f`。

Windows 端（例如 C1 指向 Linux server）：

```powershell
ping /n 4 /f /l 1200 192.168.50.10
ping /n 4 /f /l 1400 192.168.50.10
ping /n 4 /f /l 1472 192.168.50.10
```

Linux 端（指向 Windows C1）：

```bash
ping -4 -c 4 -M do -s 1200 192.168.50.21
ping -4 -c 4 -M do -s 1400 192.168.50.21
ping -4 -c 4 -M do -s 1472 192.168.50.21
```

1200、1400、1472 是待比較的探測值，不是預期成功或失敗的答案。IPv4 沒有額外 options 時，payload 加上 IP 與 ICMP 標頭才接近線上的封包大小；不要把 `/l 1472` 說成「送出 1472 bytes 的完整 IP 封包」。

## 必要原理

DF 使中間設備不能替你分片；當封包大於某段路徑能承受的大小，理想狀況是來源收到明確的需要分片／PMTU 回報。若回報被過濾、設備限速或路徑不一致，就可能只看見 timeout。Cloudflare 的 F05 案例是 ECMP 與隧道的事故經驗，說明「縮小封包」可以暫時繞過某些問題，也可能把真正的回報故障藏起來；它不是五台交換器 LAN 的發生率證據。

在同一個沒有 router 的交換器 LAN 上，若雙方前綴、路由與 link MTU 一致，通常不會因為沒有 default gateway 就產生這種跨路由器 PMTU 情境；仍可能有 NIC、VLAN、錯誤遮罩或主機規則。ICMP 回應走得通也不能裁決 TCP：TCP 有自己的分段、offload、重傳與應用讀取行為。反過來，ICMP 被擋也不能單獨證明 TCP 壞掉。

## 親手實驗

1. 先抄下 Windows 和 Linux 的位址、介面、prefix、link speed；記錄 VPN 是否存在，確認探測實際走哪張介面，先保持 VPN 狀態不變。不要先改 MTU，也不要把 default gateway 刪掉。
2. 固定一個方向，例如只由 C1 對 `192.168.50.10` 探測。依序跑 1200、1400、1472，每個值只送少量封包；再從 Linux 對 C1 做相同大小的反向探測。保存完整輸出和時間，不把單次 timeout 補成「大概成功」。
3. 若某個較大的值改變結果，才在兩個相鄰值之間選一、兩個中間值縮小範圍。每次只改 payload，記錄是本機拒絕送出、收到明確的 MTU 回報，還是等待逾時；三種現象的責任位置不同。
4. 把有差異的大小帶回實際 TCP 對照：可用 [07｜先不搬檔案：上傳、下載分開測](07-two-directions.md) 的單台方向測試，或用一個沒有副作用的測試檔案。若 ICMP 與 TCP 結果不一致，保留這個不一致，接著抓封包與看重傳，不要替它們硬找同一個答案。

## 結果解讀

若三個大小都回覆，能說的是「這幾個 ICMP 探測在當時得到回覆」；不能說所有 TCP 大小、所有五台 client 或所有時段都正常。若大值失敗、小值成功，先標記為尺寸相關線索，再查中間是否有不同 VLAN、VPN、隧道、ICMP 過濾或裝置限速。若只有 Windows→Linux 失敗，反向成功，還要對照方向、NIC 與路徑，不能只改 server MTU。

若 ping 的門檻很清楚，但長 TCP 仍無法重現，ICMP 可能走了不同處理路徑；若 ping 全部失敗，也可能只是防火牆不回 ICMP。只有把實際 TCP 流量、重傳、端點介面與設備紀錄放在一起，才有資格把 MTU 列為較強的假設。這章不產生「最大安全值」，也不把某次門檻當成正式網路規格。

## 失效反例

ICMP 被限速、被過濾、或目的端不回 echo 時，timeout 沒有 MTU 的專屬意義。Windows `/f` 與 Linux `-M do` 只涵蓋 IPv4 的這種探測；IPv6 的處理與旗標另查，不能把命令原樣套上去。若中間真的有 router、隧道或負載平衡，這個無 router 的簡化實驗也不能代表完整路徑。

最危險的誤用是看到大值失敗就永久把五台機器 MTU 改小。那可能降低效率、增加封包數，還把 ICMP 回報或路由錯誤繼續藏著。就算大 ping 成功，也不能推論 SMB、TLS 或應用層大訊息一定能完成；必要時回到 [05｜現場先錄下來，回辦公室才慢慢看](05-save-the-scene.md) 保存實際流量。

## 收尾與撤回

本章基本實驗只讀取狀態，不修改介面 MTU、路由或防火牆；完成後關閉終端即可撤回。刪掉含有現場位址的臨時輸出，保留經同意的摘要：方向、payload、回應型態、時間和測試介面。若後續為了隔離問題真的改了 MTU，先抄原值，改完重建連線並重跑兩個方向，最後按原值還原。

只有當大 TCP 流量、重傳或設備回報與尺寸探測相互支持，且上游修復暫時不可得，才可提出有期限的較小 MTU workaround。正式修復仍應回到錯誤路由、隧道或 ICMP 回報的擁有者；不要把診斷用的數值變成永久標準。若要驗證時序，再看 [09｜故意慢半秒](09-make-it-slow.md)。

來源對應：F05（Cloudflare 的 ECMP／隧道 PMTU 事故：[Path MTU discovery in practice](https://blog.cloudflare.com/path-mtu-discovery-in-practice/)）；O08（`ip route` 與直連路由：[ip-route(8)](https://man7.org/linux/man-pages/man8/ip-route.8.html)）；P10（兩端 ping 旗標：[Microsoft Windows ping](https://learn.microsoft.com/en-us/windows-server/administration/windows-commands/ping)、[iputils ping 手冊](https://man7.org/linux/man-pages/man8/ping.8.html)）。來源支持的是案例或命令機制；本章所有端到端探測尚未親自重現。
