#include <iostream>
#include <stdexcept>
#include "job_core.h"

// 第 02、03 章用的最小起點。整支程式沒有資料庫，也沒有真的送出通知。
// 由上到下只有四段：準備一筆資料、取得輸入、呼叫同一個計算、把結果印出來。
int main() {
    try {
        // 先放一筆合法的空白資料。真正要改的是下一格的 input_value。
        JobRow row{1, 0, std::nullopt};

        // 取得輸入。第 02 章只替換下面這三行，不要動後面的 process_job。
        std::cout << "input_value? ";
        if (!(std::cin >> row.input_value))
            throw std::runtime_error("expected an integer");

        // 計算。鍵盤輸入和寫死的數字，都必須經過這同一個函式。
        const Result result = process_job(row);

        // 觀察。這兩行只印在畫面上，沒有寫入資料庫。
        // NOT EXECUTED 的意思是：若真要寫回，內容會是這樣，但這支程式沒有做。
        std::cout << "job_id=" << result.job_id
                  << " score=" << result.score
                  << " accepted=" << (result.accepted ? "true" : "false") << '\n';
        std::cout << "would update job_id=" << result.job_id
                  << " score=" << result.score << " (NOT EXECUTED)\n";
        return 0;
    } catch (const std::exception& error) {
        std::cerr << "error: " << error.what() << '\n';
        return 2;
    }
}
