# 實驗入口

每組實驗都在 `examples/`，只使用 Python 標準庫，以及兩支 C++17 檔。請在該目錄執行，讓 `labutil.py` 可以被找到。工作目錄、合成編號與程序都由程式自己建立，結束時會回收。

```bash
cd docs/systems-network-foundations/examples
python3 l01_process.py
python3 run_all.py
```

`run_all.py` 會把這次程序的摘要寫到上一層 `verification/`。有 `clang++` 才編譯 C++。有 Docker 才跑 L11。缺工具時該項記 SKIP，不把別的環境的 PASS 抄過來。

| ID | 程式 | 通過時在查什麼 |
|---|---|---|
| L01 | `l01_process.py` | 握手、退出碼、未知模式、逾時回收；錯誤版把 STARTED 當成功時要被測試抓到 |
| L02 | `l02_address.py`、`l02_copy.cpp` | 兩個程序的值各自保留；複製與借用的加總相同，計時只描述這次 |
| L03 | `l03_publish.py` | 半檔被拒絕；發布後才接受；另起的 reader 程序重讀，不測斷電 |
| L04 | `l04_layers.py` | 名稱失敗、連線被拒、非 HTTP、200 與 404 分得開 |
| L05 | `l05_framing.py` | 每個切點、超限、壞 UTF-8、壞 JSON、欄位與版本；回覆提早關閉要在期限內失敗 |
| L06 | `l06_sync.py`、`l06_logic_race.cpp` | 等待時 CPU 時間很低；讀改寫組合在鎖外仍會失去更新 |
| L07 | `l07_queue.py` | 滿了就拒絕；提交數與接受數對得起來 |
| L08 | `l08_deadline.py` | 總預算有界；丟掉回覆時客戶端是未知 |
| L09 | `l09_lifecycle.py` | 假健康；drain 只採期限內的完成訊號；SIGKILL 後沒有 cleanup 檔 |
| L10 | `l10_observe.py` | 四類分得開；同一工作有 log、metric、trace；原始樣本可重算分位數 |
| L11 | `l11_host.py` | 就緒檔晚於初始化；失敗也會刪掉這次的容器；PID、掛載、SIGTERM |

睡眠只用來注入一段已知的慢，或讓對方堵住。某一行已經執行的證據是協定裡的握手、位元組或帳目，不是睡了多久。

[返回地圖](00-map.md)
