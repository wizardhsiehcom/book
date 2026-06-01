# 工具對照：從 2006 到 AI 時代

Binary Hacks 的工具名單屬於它的年代，但背後的工作方式並沒有過時。下面這張表的目的，不是把舊工具淘汰，而是讓你知道今天在 AI 工程裡各自對應到哪一類能力。

| 原書脈絡中的工具 | 今天常見的對應 | 在 AI 工程中的用途 |
| --- | --- | --- |
| `file`, `od`, `hexdump` | `xxd`, ImHex, 010 Editor | 看模型檔與二進位格式 |
| `readelf`, `objdump`, `nm` | LLVM 對應工具、`cuobjdump` | 分析 `.so`、symbol、CUDA binary |
| `ldd` | loader debug、容器內依賴檢查 | 查插件與共享函式庫依賴 |
| `gprof`, `oprofile` | `perf`, `py-spy`, 火焰圖 | CPU profiling 與熱點定位 |
| Valgrind / Helgrind | ASan, UBSan, TSan, Compute Sanitizer | 記憶體與競態錯誤檢查 |
| `strace`, `ltrace` | `perf trace`, `bpftrace` | 看啟動、I/O、函式庫行為 |
| GNU lightning 類 JIT 思維 | LLVM ORC JIT、XLA、Triton、Inductor | 執行期特化與 codegen |
| PCL coroutine | `asyncio`, `uvloop`, Tokio | 非同步服務與高併發控制平面 |

## 不要只記工具名，要記能力面向

更好的記法是把工具分成四類：

1. **看格式**：檔案與二進位結構。
2. **看載入**：依賴、符號與 runtime 行為。
3. **看錯誤**：記憶體、競態、未定義行為。
4. **看瓶頸**：時間線、計數器、熱點與微基準。

只要這四類能力還在，你就不會被工具版本變化綁死。

> 本附錄用來建立「能力對照」，不是要列出完整工具教學。
