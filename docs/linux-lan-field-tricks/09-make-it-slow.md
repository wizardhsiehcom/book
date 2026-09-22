# 09｜故意慢半秒：讓 timeout 跳出來

**現有功能可直接操作｜Linux tc/netem＋sudo｜僅限獨立實驗介面。** 本章 netem 與 Windows client 對照尚未實機重現。

## 現場症狀

機台偶爾跳出逾時，重按又好了。快的時候測一百次，只能證明那一百次夠快。老手有時會反過來做：把路徑故意拖慢，讓程式等待、取消或重試的行為露出來。

這一招需要可控制的實驗介面。只有一張網卡、而 SSH 管理也走它時，先不要照抄：保留本章作為隔離測試的操作卡，不拿唯一管理線冒充實驗線。

## 小招式

先用 [04 的固定檔案](04-tiny-server.md)確認基線成功。在 Linux **本機 console** 或另一條管理路徑操作。`LAB_IF` 只是 shell 變數，其值要替換成已查清楚、專供本次測試的介面名。

```bash
ip -br address
ip route get 192.168.50.21
LAB_IF=enp2s0
tc qdisc show dev "$LAB_IF"
```

保存原輸出。主線需要已準備好、允許新增 root netem 的獨立介面。實體 NIC 即使你沒手動設定，也可能已有 `mq` 或 `fq_codel`；「沒改過」不等於 root 是空的。只有確認可以新增、原始狀態有紀錄，且沒有人同時管理這張介面時，才執行：

```bash
sudo tc qdisc add dev "$LAB_IF" root netem delay 100ms
tc qdisc show dev "$LAB_IF"
```

若 `add` 回報已存在，停下查設定；不要換成 `replace` 強行蓋掉。已成功新增時，撤回命令就是：

```bash
sudo tc qdisc del dev "$LAB_IF" root
```

刪除前先再跑 `tc qdisc show dev "$LAB_IF"`，核對仍是自己新增、延遲值一致的 root netem；若被別人或管理工具換過，停下處理交接，不執行刪除。刪除只適用於確認是自己剛加的 netem。這不是備份並恢復任意既有 qdisc 的萬用方法。

## 必要原理

netem 在此處延遲 Linux 介面的送出流量。設定 `500ms` 不是「兩端各慢半秒」，也不保證整個 HTTP 要求恰好多半秒；TCP 握手與資料交換可能多次經過被延遲的方向。實際行為還受佇列、核心計時與 TCP 影響。[iproute2 netem 手冊](https://man7.org/linux/man-pages/man8/tc-netem.8.html)

本章控制的是路徑時序，不是讓磁碟變慢，也不是模擬所有壞線。你省下等待偶發的時間，代價是人工製造一個不等同真實事故的條件。

## 親手實驗

### 沒有合適網卡時，先在 Linux 裡練習

可另做一個**只在 Linux、並非 Windows–Linux 端到端**的練習。需要 `ip netns`、netem 與 sudo；`fielddelay` 必須是未存在的 namespace 名稱。下列每一步成功才做下一步；若名稱已存在，不能接著使用或刪除它。

Linux 終端 A：

```bash
sudo ip netns add fielddelay
sudo ip -n fielddelay link set lo up
probe_dir=$(mktemp -d)
printf 'delay-probe-v1\n' > "$probe_dir/probe.txt"
sudo ip netns exec fielddelay python3 -m http.server 8080 --bind 127.0.0.1 --directory "$probe_dir"
```

另開 Linux 終端 B，先跑基線，再新增延遲，再跑同一條 curl：

```bash
sudo ip netns exec fielddelay curl --noproxy '*' --max-time 0.3 http://127.0.0.1:8080/probe.txt
sudo ip netns exec fielddelay tc qdisc add dev lo root netem delay 500ms
sudo ip netns exec fielddelay curl --noproxy '*' --max-time 0.3 http://127.0.0.1:8080/probe.txt
sudo ip netns exec fielddelay tc qdisc show dev lo
```

此時要求與回應都經這個隔離 loopback，和主線「只加 server 實體介面送出方向」不同，不能拿兩組時間直接相比。確認還是自己的 netem 後撤回，再跑原 curl 比較基線：

```bash
sudo ip netns exec fielddelay tc qdisc del dev lo root
sudo ip netns exec fielddelay curl --noproxy '*' --max-time 0.3 http://127.0.0.1:8080/probe.txt
```

在終端 A 按 Ctrl-C 停 server，才刪除本章新增的 namespace；同一終端清檔：

```bash
sudo ip netns del fielddelay
rm -- "$probe_dir/probe.txt"
rmdir -- "$probe_dir"
```

這組隔離命令同樣尚未在 Linux 實測。namespace 的建立與執行語意見 [iproute2 ip-netns 手冊](https://man7.org/linux/man-pages/man8/ip-netns.8.html)；它只提供一個不用改正式介面的練習入口。

### 回到具備獨立介面的 Windows–Linux 實驗


Windows PowerShell 用相同小檔，分別在無 netem、100ms、500ms、撤回後各跑一次：

```powershell
curl.exe --noproxy "*" --connect-timeout 2 --max-time 3 --silent --show-error --output NUL --write-out "code=%{http_code} total=%{time_total}\n" http://192.168.50.10:8080/probe.txt
$LASTEXITCODE
```

Linux 從已新增的 100ms 切換成 500ms：

```bash
sudo tc qdisc change dev "$LAB_IF" root netem delay 500ms
```

若三秒仍成功，保留結果；不必硬把它寫成 timeout。想示範較短等待，可另做一組固定 `--max-time 0.3` 的完整 A/B/A，**不要只在慢組改 timeout**。這時應比對的是同一 timeout 下，正常、延遲、撤回的差異。curl 的時間限制是工具既有選項。[curl 手冊](https://curl.se/docs/manpage.html#--max-time)

下一步才換成原 client 的**無副作用讀取**，記錄 UI 錯誤時間、server 的 GET 次數與間隔。本章 curl 命令沒有設定自動重試，不能期待它展示原 client 的重試策略。需要對應請求時使用 [05 的擷取](05-save-the-scene.md)；要固定 POST 內容則先看 [06](06-replay-input.md)。

## 結果解讀

| 觀察 | 可以說 | 不能說 |
|---|---|---|
| 只有慢組 timeout | 此等待上限在本次條件不足 | 真實事故一定是網路延遲 |
| UI 報一次錯，server 有多次要求 | 值得查重試與呼叫層 | 所有要求都已產生業務效果 |
| 撤回後仍慢 | 實驗狀態未回基線，需查其他條件 | netem 已刪所以一定是 server 壞了 |

即使 client 已取消，server 也可能已經收到要求。因此不能把 timeout 解讀成「什麼都沒做」。這是為什麼本章只使用固定檔，不對正式機台送控制命令。

## 失效反例

你加的是 server 送出方向，但真正問題可能是 client 端排隊；單方向延遲未觸發不代表程式健全。大流量時，佇列與吞吐也可能被改變，不能拿這個小檔實驗當精確 WAN 效能模型。

若沒有合適的隔離介面，本章的前提不成立。硬把參數降到很小不會讓共享管理介面變成獨立介面。

## 收尾與撤回

刪除本章新增的 netem，重新讀 `tc qdisc show`，再用同一個 client 命令確認基線回來。停 probe 服務、清測試檔，記錄撤回前後輸出。若常需要測這種故障，才將它整理成有操作者、介面與撤回紀錄的版本驗收步驟。

來源：P03、P08。網路大小線索見 [08](08-size-threshold.md)；實驗紀錄見 [附錄](appendix-records.md)。
