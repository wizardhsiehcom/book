# 來源、用途與版本邊界

本書於 2026-09-26 依 C++17 子集撰寫。引用持續更新的標準草案時，僅使用本書涉及的既有語意，不把草案新增內容當 C++17 功能。正文中的情境、程式、問題與圖是本教材新作。

| 來源 | 已讀範圍／用途 |
|---|---|
| [C++ Core Guidelines](https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines) | 介面、參數、資源、錯誤處理相關節；非全本精讀 |
| [basic.life](https://eel.is/c++draft/basic.life) | 物件與參照的生命週期相關段落 |
| [vector.capacity](https://eel.is/c++draft/vector.capacity) | reserve、容量與失效規則 |
| [unord.req](https://eel.is/c++draft/unord.req) | 無序容器身分與複雜度相關節 |
| [from_chars](https://eel.is/c++draft/charconv.from.chars) | 轉換結果、未消耗字尾與錯誤 |
| [檔案類型](https://eel.is/c++draft/fs.op.is.regular.file) | regular file 與 error_code |
| [Clang manual](https://clang.llvm.org/docs/UsersManual.html) | 建置、最佳化與除錯選項相關節 |
| [MSVC 命令列](https://learn.microsoft.com/en-us/cpp/build/walkthrough-compiling-a-native-cpp-program-on-the-command-line?view=msvc-170) | 工具安裝與 Native Tools 入口；未實機驗證 |
| [LLDB tutorial](https://lldb.llvm.org/use/tutorial.html) | breakpoint、run、frame、stepping 相關節 |
| [Git Book](https://git-scm.com/book/en/v2/Git-Basics-Recording-Changes-to-the-Repository)、[restore](https://git-scm.com/docs/git-restore) | 工作區、暫存與恢復 |
| [Python data structures](https://docs.python.org/3/tutorial/datastructures.html)、[subprocess](https://docs.python.org/3/library/subprocess.html) | 容器與子程序相關節 |
| [GitHub Actions](https://docs.github.com/en/actions/get-started/quickstart) | 最小 workflow 結構，遠端尚未執行 |

本地備料存 book repo 的 `data/software-engineering-foundations/`，目前依此 repo 規則被 git 忽略；可公開的來源索引因此也保留在本頁。C00 的用途與來源在其 data/ 中。沒有複製私人姓名、客戶資料或原機台程式。
