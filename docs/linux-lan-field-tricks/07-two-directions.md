# 07｜先不搬檔案：上傳、下載分開測

**現有功能可直接操作｜Linux／Windows：兩端使用同一 iperf2 版本的各平台 build｜測試埠與二進位檔尚未在本機驗證。** 本章的命令是待重現的診斷實驗；沒有預設吞吐量，也沒有把任何數字當成這五台機器的成果。

## 現場症狀

Windows 把檔案送到 Linux 很慢，從 Linux 取回卻沒有同樣感覺。現場最容易先重啟 Samba、換檔案、改 buffer，最後仍不知道慢的是哪個方向。檔案傳輸同時包含磁碟、協定、認證、應用程式與網路；一次複製的結果把它們全部混在一起。

小招是先不搬檔案，讓一個只產生 TCP 流量的工具走同一條線。先以一台 client 做正向與反向的重複測量，再把同一個小實驗擴到五台，分開看方向與競爭；iperf 不代表正式服務。

## 小招式

兩端都必須先確認是 **iperf2**，而且是同一版本的各平台 build，分別保存完整版本字串。Linux 端預計使用 `iperf`，Windows 端使用 `iperf.exe`；若版本輸出顯示 `iperf3`，先停下來，不能拿另一端的 iperf2 硬接。安裝的 Windows 二進位檔、版本與 `--reverse` 支援目前都尚未驗證。

Linux server：

```bash
iperf --version
iperf --help
iperf -s -p 5001
```

Windows C1 先核對版本與選項，再分別執行兩個方向：

```powershell
.\iperf.exe --version
.\iperf.exe --help
.\iperf.exe -c 192.168.50.10 -p 5001 -t 10
.\iperf.exe -c 192.168.50.10 -p 5001 -t 10 --reverse
```

把最後兩行各執行三次；`--reverse` 才是本章的反向選項。Windows 的短旗標 `-R` 在 iperf2 語境另有移除服務的意義，不能改用它。若 `--help` 沒列出 `--reverse`，不要猜旗標，換成已確認的同版本的各平台二進位檔或把本次實驗標成未完成。

## 必要原理

沒有 `--reverse` 時，client 送資料給 server；加入它後，仍由同一個 client 建立測試連線，但資料方向改成 server 送回 client。這個對照保留了目的地、測試埠、傳輸協定與測試時間，先拿掉檔案系統和正式應用這幾個變因。

方向不同仍可能使用不同的網卡收發佇列、驅動路徑、硬體卸載與作業系統處理量。F06 的 issue 提供的是特定 Windows、Linux ixgbe 與硬體組合的現場線索，不是「某個 `rx-usecs` 值適合所有機器」的答案。iperf2 和 iperf3 的協定與選項也不能混接；ESnet 對 Windows 的 iperf3 支援另有明確限制，所以本章固定採 iperf2。

工具測得好，代表這段受控的 TCP 流量在該次條件下沒有顯示同樣問題；它沒有測到 SMB 語意、檔案權限、磁碟延遲、TLS、應用重試或資料正確性。代價是測試會吃掉頻寬與 CPU，五台同時跑更可能影響現場其他流量。

## 親手實驗

先記錄兩端 `--version` 輸出、Linux 介面、Windows C1 使用的線與交換器孔位，以及測試埠是否已有精確放行規則。若 5001 被占用，查明占用者後改一個明確的測試埠；不要直接停止不明程序。

1. 只讓 C1 連線。正向命令和 `--reverse` 命令各跑三次，每次完成後才做下一次；保存 client 與 server 顯示的 sender／receiver 行、方向、時間、CPU 使用量與 link speed。這些欄位留給實驗結果，不先填入預期數字。
2. 以同一組命令分別讓 C2、C3、C4、C5 單台執行，各方向各三次，先逐台完成，再進入多人測試；只測 C1 時要明寫「單台」，不能叫作五台基線。
3. 五台同時測試時，先讓五台一起做正向，再另開一輪一起做反向；不要把正反向同時混跑。每台保存自己的輸出檔或終端紀錄，並標記開始時間與 client 名稱。
4. 測完用原本的檔案操作再測一次，僅作方向線索的對照。不要因為 iperf 成功就跳過原服務的日誌、檔案內容與權限檢查。

## 結果解讀

若 C1 的正向和反向差異明顯，這只把調查縮到「方向相關的路徑、NIC、驅動、佇列或接收處理」；它沒有直接指出哪一個設定是根因。若五台單獨都接近各自的單台紀錄，只有同時跑才改變，應檢查共享鏈路、交換器、server CPU 或測試造成的競爭。

若只有一台 client 在單台測試中不同，先沿著那台的線、孔、NIC、driver 與實際路由比對，不要立刻改 server。兩方向都正常而檔案仍慢，下一步查應用、儲存與協定，不能直接宣稱磁碟或 Samba 有問題。若連最小 TCP 測試都失敗，回到 [02｜ping 通卻進不去](02-port-and-bind.md) 檢查監聽與 TCP 埠。

## 失效反例

兩端版本不同、把 iperf2 和 iperf3 混用、或在 Windows 把 `-R` 當成反向測試，輸出的可比性就已經破壞。只抄 client 畫面而不保存 receiver 端，也可能把單邊統計誤當成線路結果。`-t 10` 是實驗時間，不是服務的 SLA；五台同時跑出的下降也不等於正式流量一定會同樣下降。

iperf 只產生受控 TCP 流量。它不能裁決 UDP、SMB、TLS 或應用層重試，更不能排除大檔案的儲存瓶頸。F06 的改善描述沒有在本環境重現；本章不抄它的硬體參數，也不把方向差異寫成普遍規律。正式 LAN 請在隔離網段或約定時段測，這招本身會佔用頻寬。

## 收尾與撤回

在 Linux server 終端按 Ctrl-C，確認測試程序已退出；Windows 關閉 client 終端，移除本次新增的精確測試埠規則。不要為了讓測試通過而永久調整 NIC、driver 或 buffer。保留版本與輸出紀錄到約定期限，刪掉含有位址或環境資訊的臨時檔。

只有當同一方向差異能在相同 build、相同線路與多次測量中重現，才值得把命令和紀錄格式做成小腳本或驗收基線。下一步可看 [08｜小的通，大的卡](08-size-threshold.md)；若原問題是一次輸入才會失敗，先回到 [06｜不再重點十次：保存那一次輸入](06-replay-input.md)。

來源對應：F06（特定 ixgbe 現場 issue：[intel/ethernet-linux-ixgbe issue #30](https://github.com/intel/ethernet-linux-ixgbe/issues/30)）；O05（iperf3 方向選項與 Windows 支援邊界：[ESnet Invoking iperf3](https://software.es.net/iperf/invoking.html)、[ESnet FAQ](https://software.es.net/iperf/faq.html)）；P09（iperf2 `--reverse` 與 Windows `-R` 語意：[iperf2 原始手冊](https://iperf2.sourceforge.io/iperf-manpage.html)）。以上是來源作者觀察或文件機制；本章實驗尚未親自重現。
