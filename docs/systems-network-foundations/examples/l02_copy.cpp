// L02 的 C++17 局部實驗：值複製會做出另一份資料；const 參考借用同一份。
// 計時只描述這次程序、這個最佳化等級與這段迴圈，不是機器的普遍效能。

#include <chrono>
#include <cstdint>
#include <iostream>
#include <vector>

namespace {

std::uint64_t sum_bytes(const std::vector<std::uint8_t>& bytes) {
    std::uint64_t total = 0;
    for (std::uint8_t byte : bytes) {
        total += byte;
    }
    return total;
}

std::uint64_t sum_by_copy(std::vector<std::uint8_t> bytes) {
    return sum_bytes(bytes);
}

std::uint64_t sum_by_borrow(const std::vector<std::uint8_t>& bytes) {
    return sum_bytes(bytes);
}

template <typename Fn>
std::int64_t microseconds(Fn&& fn) {
    const auto started = std::chrono::steady_clock::now();
    fn();
    const auto elapsed = std::chrono::steady_clock::now() - started;
    return std::chrono::duration_cast<std::chrono::microseconds>(elapsed).count();
}

}  // namespace

int main() {
    constexpr std::size_t kBytes = 2'000'000;
    std::vector<std::uint8_t> original(kBytes, 3);
    std::uint64_t copied = 0;
    std::uint64_t borrowed = 0;
    const auto copy_us = microseconds([&] { copied = sum_by_copy(original); });
    const auto borrow_us = microseconds([&] { borrowed = sum_by_borrow(original); });
    if (original.size() != kBytes || original.front() != 3) {
        return 1;
    }
    if (copied != borrowed || copied != static_cast<std::uint64_t>(kBytes) * 3) {
        return 2;
    }
    std::cout << "bytes " << kBytes
              << " copy_us " << copy_us
              << " borrow_us " << borrow_us
              << " checksum " << copied << "\n";
    return 0;
}
