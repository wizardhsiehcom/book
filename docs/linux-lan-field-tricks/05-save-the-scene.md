# 05｜現場先錄下來，回辦公室才慢慢看

**現有功能可直接操作｜Linux tcpdump＋GNU timeout，擷取需 sudo｜Windows 可用 Wireshark 離線閱讀。** 本章擷取與跨端對時尚未實機重現。

## 現場症狀

你走到機台旁邊，它剛好又正常了。現場說「大概半分鐘前」，server 日誌卻只留下另一個錯誤。重試一百次之前，先準備一個小袋子，把下一次出錯的流量與操作時間裝起來。

Julia Evans 描述過先留下 pcap、再挑一條連線分析的工作方式。這是作者的實務經驗；本章把它縮成只抓一台 client、一個測試埠、最多一分鐘的練習。[F04 原文](https://jvns.ca/blog/2018/06/19/what-i-use-wireshark-for/)

## 小招式

先啟動 [04 的測試服務](04-tiny-server.md)。Linux 另開終端，從 `ip route get` 的 `dev` 確認通往 C1 的介面，把下列 `enp2s0` 換成實際值：

```bash
ip route get 192.168.50.21
case_dir=$(mktemp -d)
LAB_IF=enp2s0
date -Is > "$case_dir/time.txt"
sudo timeout --signal=INT --kill-after=2s 60s tcpdump -i "$LAB_IF" -nn -s 0 -c 200 -w - 'host 192.168.50.21 and tcp port 8080' > "$case_dir/trace.pcap"
```

`-w -` 將 pcap 送到標準輸出，由目前 shell 寫入你自己的目錄；終端上的統計走標準錯誤，不會被混進檔案。擷取期間到 Windows 取一次固定檔，再記操作時間：

```powershell
Get-Date -Format o
curl.exe --noproxy "*" --max-time 5 http://192.168.50.10:8080/probe.txt
Get-Date -Format o
```

最多 200 個符合條件的封包或約 60 秒先到就停止，另有兩秒強制收尾寬限。時間到時 `timeout` 常回 124，不能把它當成「沒有擷取」；回讀檔案與終端 captured/dropped 統計才知道保存了什麼。GNU timeout 與 tcpdump 是兩個工具。[W01：timeout](https://www.gnu.org/software/coreutils/manual/html_node/timeout-invocation.html)、[tcpdump 手冊](https://raw.githubusercontent.com/the-tcpdump-group/tcpdump/master/tcpdump.1.in)

## 必要原理

介面是觀察位置，filter 是留下的範圍。`-i` 選介面，不是只看進來的方向；`-c` 限封包數，不是秒數。`-s 0` 使用工具的預設 snapshot length；本次查閱手冊為 262144 bytes，仍不是任意長封包的完整性保證，所以只拿假資料練習。原始封包可能包含應用內容，少抓比事後猜哪些敏感更省事。

離線閱讀不會重送封包：

```bash
tcpdump -nn -r "$case_dir/trace.pcap"
```

要在 Wireshark 閱讀，可把這個測試檔複製到 Windows；從一個封包選擇 Follow TCP Stream，或用 `tcp.stream eq N` 選該次連線的編號。這裡的 N 必須取自實際檔案，不預設一定是 0。

## 親手實驗

先看一次完整的取檔：發起端、目的埠、回應與結束順序。接著另開新的擷取檔做第二次；可在 [09 的隔離延遲條件](09-make-it-slow.md)下觀察取消，沒有延遲時小檔太快，按 Ctrl-C 不一定趕得上。未成功取消就記「未觸發」，不要把正常結束重新命名成取消。

把三份線索放在同一張 [實驗表](appendix-records.md)：Windows 操作時間、Linux HTTP 終端的要求紀錄、pcap。兩台時鐘未對齊時，用方向、連線四元組（來源 IP/port、目的 IP/port）、TCP 序號與操作次序對應，不能只按毫秒時間判先後。

F01 的 DHCP／socket 案例提示我們跨日誌找相同事件，但原文的部分機制解釋沒有在本書獨立證實。本章採用的是「保存多個觀測位置」的做法，不採用「看到某個表不同就已找出核心 bug」的結論。[F01 原文](https://evan361425.github.io/essay/architecture/tcp-socket-loss-after-dhcp/)

## 結果解讀

| 保存的現象 | 能縮小的方向 | 還可能是什麼 |
|---|---|---|
| 只見 SYN 沒回應 | 觀察點之後的回程、規則或服務 | filter／擷取點不完整 |
| TCP 完成，HTTP 有錯誤碼 | 協定或應用回應 | 仍需看錯誤內容與 server 日誌 |
| client 先送 FIN/RST | client 端發起結束 | 可能只是回應等待、上層取消的結果 |
| 檔案沒有那次要求 | 此擷取沒記到 | 不是證明要求從未發生 |

發送端顯示 bad checksum 時，先想到觀察點可能早於網卡 offload 完成。可以在另一端擷取核對；`tcpdump -K -r 檔案` 只是略過驗證，不會修復線上封包。[核心 checksum offload 文件](https://www.kernel.org/doc/html/latest/networking/checksum-offloads.html)

## 失效反例

TLS 內容加密時，pcap 常能看連線與時序，卻看不到明文 body。擷取到一半達到 200 個封包上限，也可能把結束事件切掉。若 Wireshark 顯示 captured length 小於 frame length，該筆資料已被截斷；不要把截斷內容當成應用沒有送完。看到空白行不要說整份 HTTP 訊息結束：HTTP/1.1 header 後還可能有 body。[RFC 9112](https://www.rfc-editor.org/rfc/rfc9112.html#section-2.1)

省下的是讓別人不停重演，轉移的成本是檔案保存、時間對應與解讀。不要為了「以後也許有用」直接全網無限擷取。

## 收尾與撤回

確認 timeout/tcpdump 已結束，保存終端 dropped 統計。停止測試 HTTP。分析完成後，在建立 `case_dir` 的原 shell 中刪除自己產生的兩個檔，再刪目錄：

```bash
rm -- "$case_dir/trace.pcap" "$case_dir/time.txt"
rmdir -- "$case_dir"
```

若拷貝過 pcap，也一併按約定期限處理副本。只有偶發事故反覆無法抓到，才另設有限容量的輪替擷取；本章不把一次測試升級成常駐監聽。

來源：F01、F02、F04、O06、O07、P06、W01。要把應用輸入再送一次，見 [06](06-replay-input.md)，那是另一種操作。
