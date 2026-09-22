#pragma once
#include <optional>
#include <stdexcept>
#include <string>
struct JobRow {
    int job_id;
    int input_value;
    std::optional<std::string> note;
};
struct Result { int job_id; int score; bool accepted; };
inline Result process_job(const JobRow& row) {
    if (row.job_id <= 0 || row.input_value < 0 || row.input_value > 1000)
        throw std::runtime_error("job_id must be positive; input_value must be 0..1000");
    return {row.job_id, row.input_value * 2, row.input_value >= 10};
}
