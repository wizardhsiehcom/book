# A｜症狀到下一個小動作

這張表的用途是選下一步，不是直接判定根因。先保留能保留的現場，再改一項條件；遇到分支時，不要同時做兩邊。

| 症狀 | 第一個小動作 | 有差異能支持什麼 | 沒差異下一站 |
|---|---|---|---|
| 執行期找不到建好的檔案 | [01 比較同映像有／無掛載](01-remove-mount.md) | 掛載遮蔽此路徑 | [08 context](08-build-context.md)、[09 stage](09-stop-at-stage.md) |
| restart 後配置仍舊 | [02 渲染配置並看容器值](02-effective-config.md) | 配置來源或套用邊界有問題 | 應用讀配置的時機、別的配置檔 |
| exec 因容器停止失敗 | [03 cp 指定產物](03-copy-after-exit.md) | 該檔案仍保留 | 確認已刪除、掛載位置或寫入未完成 |
| 啟動太快失敗 | [04 有限時間替代入口](04-bypass-entrypoint.md) | 可手動重現的設定／檔案問題 | 比較初始化、user、cwd，而非認定 Docker 隨機壞 |
| 映像沒 curl | [05 借同網路 namespace](05-borrow-network-tools.md) | loopback／listen 邊界值得追 | 比較原應用 TLS、proxy、DNS 與認證 |
| logs 退出才出現 | [06 Python -u 對照](06-unbuffer-logs.md) | 應用緩衝影響可見時間 | 輸出到檔案、driver 與遠端收集 |
| 重點介面成本高 | [07 固定 stdin fixture](07-replay-stdin.md) | 可重播這份輸入 | 入口不支援、資料格式或時序未保留 |
| COPY 找不到檔案 | [08 明確指定 -f 與 context](08-build-context.md) | builder 的輸入集合有差異 | ignore、大小寫與 RUN 工作目錄 |
| final 缺少產物 | [09 建到前段檢查](09-stop-at-stage.md) | COPY 交付邊界有遺漏 | 前段產生流程 |
| build 一直是舊結果 | [10 局部重跑 stage](10-invalidate-one-stage.md) | cache key 之外的輸入值得追 | 外部服務、package cache、base 版本 |
| 大量小檔讀得慢 | [11 bind／volume 同工作對照](11-move-small-files.md) | 該環境的共享 I/O 邊界 | CPU、網路、異架構執行與量測誤差 |
| 首次 up 偶發失敗 | [12 刻意延後 ready](12-delay-readiness.md) | 啟動時序可能是條件 | DNS、探針本身、運行中重連 |
| stop 等到強殺 | [13 PID 鏈＋cleanup 標記](13-forward-stop-signal.md) | 訊號交付或應用清理有問題 | 未退出 thread、子程序或阻塞清理 |

不確定時，先寫一句可以被證偽的猜測。例如「如果是掛載遮住檔案，同一映像在無掛載副本應該看得到它」。這比「Docker 怪怪的」更容易選出便宜的對照。

這份索引刻意沒有「全部 prune 重來」分支。那會同時改掉映像、快取與資料狀態；即使症狀消失，也很難知道下次要怎麼做。若重建是必要恢復手段，先把能取得的版本、設定和產物記下來，之後仍可另做診斷。
