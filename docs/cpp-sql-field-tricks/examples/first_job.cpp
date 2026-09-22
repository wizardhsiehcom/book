#include <iostream>
#include <stdexcept>
#include "job_core.h"

// A deliberately small starting point for chapters 02 and 03.
// There is no database or notification implementation in this executable.
int main() {
    try {
        JobRow row{1, 0, std::nullopt};

        // Input: replace only this block during the chapter 02 experiment.
        std::cout << "input_value? ";
        if (!(std::cin >> row.input_value))
            throw std::runtime_error("expected an integer");

        // Calculation: keep this same call for every input experiment.
        const Result result = process_job(row);

        // Observation only: these lines do not write to a database.
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
