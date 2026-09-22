# 03｜名字先別修：只改這一次的目的地

**現有功能可直接操作｜Windows PowerShell＋curl.exe｜不需管理員。** 以下是未在 Windows–Linux 實機執行的教學對照。

## 現場症狀

IP 可以用，名稱卻不行。有人提議改 hosts，有人叫你清快取，也有人想重開交換器。三件一起做之後網站好了，下一次壞掉還是不知道先做哪一件。

先別改全機設定。讓「這一次要求」使用指定 IP，其他要求繼續走原來的設定。這次試完，拿掉參數就撤回。

## 小招式

先啟動 [04 的固定檔案服務](04-tiny-server.md)。下列 `machine.example` 是保留的教學名稱，不是現場已有的 DNS 記錄。它很適合練習覆寫解析；若要診斷真實事故，則須換成原本出錯的名稱、埠、路徑。

在 Windows PowerShell 依序執行，三次分開記錄輸出與退出碼：

```powershell
curl.exe --connect-timeout 3 --max-time 5 --verbose http://machine.example:8080/probe.txt
$LASTEXITCODE
curl.exe --noproxy "*" --connect-timeout 3 --max-time 5 --verbose http://machine.example:8080/probe.txt
$LASTEXITCODE
curl.exe --noproxy "*" --resolve machine.example:8080:192.168.50.10 --connect-timeout 3 --max-time 5 --verbose http://machine.example:8080/probe.txt
$LASTEXITCODE
```

最後一條預期連到指定 server，取回 `field-probe-v1`。前兩條可能因為名稱不存在而失敗；這個人工失敗只示範覆寫功能，**不是證明現場 DNS 壞掉**。

## 必要原理

`--resolve` 替這次 curl 提供「名稱＋埠→位址」對照，URL 的名稱仍然存在。`--noproxy "*"` 則讓這次要求不經代理。兩者控制不同段落，所以必須分兩次加入。[curl 官方手冊](https://curl.se/docs/manpage.html#--resolve)

| 對照 | 唯一預定改動 | 值得追查的入口 |
|---|---|---|
| A → B | 停用本次 proxy | curl 的代理路徑或代理設定 |
| B → C | 固定本次解析 | 解析結果、實際目的 IP |
| C → B | 取消解析覆寫 | 故障是否隨覆寫撤回而重現 |

Julia Evans 的 DNS 排錯文章強調查清楚實際查詢與回應；重啟後變好，並不能單獨證明 DNS 根因已被修好。這是來源作者的診斷經驗，不是本書做過的事故重現。[原文](https://jvns.ca/blog/2021/11/04/how-do-you-tell-if-a-problem-is-caused-by-dns/)

## 親手實驗

先用教學名稱跑完 A/B/C，再回到真實名稱重做。每次固定 URL、資料和 client，從 verbose 訊息記下實際連線位址。不要把包含 token、Cookie 的完整真實輸出貼到公開紀錄；本章 probe 不需要那些資料。

如果真實服務是 HTTPS，保留它已配置且憑證可信的名稱，例如下式的名稱只是占位，需整組替換：

```powershell
curl.exe --noproxy "*" --resolve actual-name.example:443:192.168.50.10 --connect-timeout 3 --max-time 5 https://actual-name.example/
```

沒有相符且可信的憑證就先完成 HTTP 練習；不要加 `-k` 讓另一個問題消失。HTTPS 直接改 URL 成 IP，可能同時改掉 SNI、Host 與憑證名稱條件，失去本章要做的單變因對照。

## 結果解讀

B 失敗而 C 成功，支持「固定這個位址後可用」，值得比對原解析是否指錯、是否有多個位址。它仍不能區分所有 DNS 快取、分流與後端差異。若 C 回了另一個站的內容，TCP 到達也沒有證明名稱對應正確。

若 A/B 沒有差別，可能 curl 本來就沒走 proxy；這不是無效測試，而是少了一條假設。若 curl 全通、原 GUI 仍壞，查 GUI 的代理、DNS、憑證庫與登入流程，不要強迫它們共用同一套結論。

## 失效反例

公司服務只允許經代理連入時，直連失敗是預期結果；不要把 B 當成必須成功的「修復」。同名多 IP 的服務，固定一台可能恰好繞過壞掉的後端，也可能掩蓋負載平衡問題。

省下的是修改整台 client 的成本，轉移的代價是這次要求不再涵蓋真實入口。越是方便的覆寫，越不能長期藏在腳本裡而沒有註記。

## 收尾與撤回

拿掉 `--resolve` 和 `--noproxy`，用原 client 回原路徑複測；本章沒有改 hosts，也不需要清全機快取。確定是哪個正式設定有問題後再修它。停止 04 的測試服務並刪除假檔。

來源：F03、O01。延伸：[05 保存現場](05-save-the-scene.md)；替代管理入口見 [10 SSH 隧道](10-local-tunnel.md)。
