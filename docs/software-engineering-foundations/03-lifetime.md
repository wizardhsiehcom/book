# 生命週期與 RAII：誰把檔案關掉

程式在第十筆格式錯誤時丟例外。前面開啟的檔案還在嗎？如果每個錯誤分支都要手動 close，很容易漏一條。

## 用物件管理資源

在 main 建立 `std::ifstream input(path)`，物件開啟並管理檔案。解析器 `load(input)` 借用串流，讀取會改變它的位置。正常返回或例外離開作用域時，已建構的區域物件會依序解構，檔案資源跟著釋放。

RAII 的重點是讓資源釋放和擁有者的生命週期綁定，不是「只要用 class 就自動安全」。誰擁有、誰借用、誰能存留參照，仍需決定。

```cpp
std::vector<Row> rows;
{
    std::ifstream in(path);
    if (!in) throw std::runtime_error("cannot open");
    rows = load(in);
} // in 結束，rows 仍擁有自己的資料。
```

上段是結構示意；完整的 load 在 C00。讀入 Row 是值，不存指向串流緩衝區的指標，因此 rows 能在檔案關閉後使用。

## RAII 保證不到的地方

強制殺死程序、斷電，不保證走過一般 C++ 解構流程。更重要的是，關檔不等於交易回滾，也不保證你的資料早已安全落到持久媒體。若將來改成寫報告檔，還要檢查 flush／close 的錯誤與發布時機；不要拿資源回收替代資料一致性設計。

同樣地，mutex 的 guard 會解鎖，不代表臨界區內的業務結果一定完整。這些差別會在資料庫與系統課接著出現。

## 畫出時間線

在本書 `concepts.cpp`，一個本地 Guard 在例外展開時增加計數。測試證明該例外路徑執行了解構；不是證明斷電時會解構。練習列出 main 的 input、load 的 line、rows 每個物件何時生、何時滅。

**Q03：** `load` 把每次讀到的 line 的地址放到容器，下次 getline 之後會有什麼問題？為什麼目前存 Row 值沒有同樣問題？

來源：[C++ 物件生命週期](https://eel.is/c++draft/basic.life)、[資源管理原則](https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines#r1-manage-resources-automatically-using-resource-handles-and-raii)。


[返回地圖](00-map.md) · [實驗入口](labs.md) · [題目解答](answers.md)
