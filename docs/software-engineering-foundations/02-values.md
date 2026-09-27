# 值與參照：修改究竟落到誰身上

報告需要讀每一筆 Row，但不應修改判定。寫 `for (auto row : rows)` 與 `for (auto& row : rows)` 都能編譯，代價與效果卻不同。

## 三種讀法

```cpp
Row original{1, -1};
Row copy = original;
Row& alias = original;
copy.judge = 2;       // 改副本
alias.judge = 3;      // 改 original
```

值語意讓副本有自己的內容。參照是既有物件的別名；不是再造一個 Row，也不是自動移交擁有權。`const Row&` 允許讀取，禁止透過這個參照修改 Row，但不代表其他地方一定不能改原物件。

| 參數／變數 | 本課語意 | 適用問題 |
|---|---|---|
| Row row | 擁有一份值 | 想修改局部副本，或型別很小 |
| Row& row | 可修改呼叫者的物件 | 修改是明確契約的一部分 |
| const Row& row | 借用，只讀 | 報告掃描與不需複製的輸入 |

不要把「const& 永遠最快」當規則。小整數傳值清楚；大容器避免無意複製通常有用。性能要看實際情境，但修改權限應在介面上先說清楚。

## 參照不能替你保住生命

若函式回傳區域 Row 的參照，離開函式後原物件已結束生命週期，使用它不是「可能讀到舊值而已」，而是不受保證的行為。此時回傳 Row 值才讓呼叫者取得有用資料；編譯器還可能省略不必要的複製。

C00 `load` 回傳 vector 值，main 擁有結果；`report` 借用 const vector&。這正好分開了「產生資料」與「閱讀資料」。

執行書附 `concepts.cpp` 的值／參照案例，再自己預測加一個 const reference 後哪些賦值不能編譯。不要為了試懸空參照直接執行未定義行為；先畫出作用域即可指出問題。

**Q02：** `for (auto row : rows) row.judge = 0;` 為什麼不改原清單？若改成 `auto&`，還需要核對哪些需求？

來源：[C++ Core Guidelines，參數與介面](https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines#f16-for-in-parameters-pass-cheaply-copied-types-by-value-and-others-by-reference-to-const)。


[返回地圖](00-map.md) · [實驗入口](labs.md) · [題目解答](answers.md)
