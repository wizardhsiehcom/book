#pragma once
#include <optional>
#include <stdexcept>
#include <string>

// 全書共用的那一筆工作，以及它的計算結果。
// field_lab 與 sql_lab 最後都呼叫同一個 process_job，
// 這樣換入口時，比的仍是同一個公式，而不是各寫一套。
struct JobRow {
    int job_id;                              // 這筆工作的編號，必須是正數
    int input_value;                         // 要拿去計算的輸入，必須落在 0..1000
    std::optional<std::string> note;        // 沒有備註時就是空的，不是空字串
};
struct Result {
    int job_id;
    int score;                               // input_value * 2
    bool accepted;                           // input_value >= 10 才是 true
};

// 公式只有一行。門檻不過就丟例外，不偷偷改成 0。
inline Result process_job(const JobRow& row) {
    if (row.job_id <= 0 || row.input_value < 0 || row.input_value > 1000)
        throw std::runtime_error("job_id must be positive; input_value must be 0..1000");
    return {row.job_id, row.input_value * 2, row.input_value >= 10};
}
