// 每段賦值都在 mutex 裡，仍可能遺失更新：兩個執行緒讀到同一個舊值。
// 這是邏輯競爭，不是未同步的 data race。不要拿未定義行為的輸出當標準答案。

#include <condition_variable>
#include <iostream>
#include <mutex>
#include <thread>

namespace {

class Gate {
public:
    explicit Gate(int parties) : left_(parties) {}

    void arrive() {
        std::unique_lock<std::mutex> lock(mutex_);
        left_ -= 1;
        if (left_ == 0) {
            ready_.notify_all();
            return;
        }
        ready_.wait(lock, [&] { return left_ == 0; });
    }

private:
    int left_;
    std::mutex mutex_;
    std::condition_variable ready_;
};

int race_split() {
    int value = 0;
    std::mutex mutex;
    Gate gate(2);
    auto worker = [&] {
        int snapshot = 0;
        {
            std::lock_guard<std::mutex> guard(mutex);
            snapshot = value;
        }
        gate.arrive();
        std::lock_guard<std::mutex> guard(mutex);
        value = snapshot + 1;
    };
    std::thread first(worker);
    std::thread second(worker);
    first.join();
    second.join();
    return value;
}

int race_whole() {
    int value = 0;
    std::mutex mutex;
    Gate gate(2);
    auto worker = [&] {
        gate.arrive();
        std::lock_guard<std::mutex> guard(mutex);
        value = value + 1;
    };
    std::thread first(worker);
    std::thread second(worker);
    first.join();
    second.join();
    return value;
}

}  // namespace

int main() {
    const int split = race_split();
    const int whole = race_whole();
    std::cout << "split " << split << " whole " << whole << "\n";
    if (split != 1 || whole != 2) {
        return 1;
    }
    return 0;
}
