// Independent C++17 micro-experiments. No disabled-in-Release assert checks.
#include <charconv>
#include <iostream>
#include <stdexcept>
#include <string>
#include <unordered_set>
#include <vector>
void check(bool value, const char* reason) {
    if (!value) throw std::runtime_error(reason);
}
struct Row { int id; int judge; };
struct Guard {
    int& closed;
    ~Guard() { ++closed; }
};
int integer(const std::string& text) {
    int value = 0;
    const auto parsed = std::from_chars(text.data(), text.data()+text.size(), value);
    if (parsed.ec != std::errc{} || parsed.ptr != text.data()+text.size())
        throw std::runtime_error("invalid integer");
    return value;
}
int comparisons(int n) {
    int count = 0;
    for (int i=0; i<n; ++i) for (int j=0; j<i; ++j) ++count;
    return count;
}
int main() {
    try {
        Row original{1,-1};
        Row copy = original;
        Row& alias = original;
        copy.judge = 2; alias.judge = 3;
        check(original.judge == 3 && copy.judge == 2, "copy vs alias");
        std::cout << "values: original=3 copy=2\n";
        int closed = 0;
        try { Guard guard{closed}; throw std::runtime_error("expected"); }
        catch (const std::runtime_error&) {}
        check(closed == 1, "unwind cleanup");
        std::cout << "lifetime: destructed=1\n";
        std::vector<Row> rows{{1,-1}};
        const Row saved = rows.front();
        rows.reserve(rows.capacity()+10);
        check(saved.id == 1, "saved value survives vector growth");
        std::unordered_set<int> seen;
        check(seen.insert(1).second && !seen.insert(1).second, "duplicate id");
        check(comparisons(4) == 6 && comparisons(8) == 28, "comparison count");
        std::cout << "containers: duplicate rejected; comparisons=6,28\n";
        check(integer("-1") == -1, "integer");
        for (const std::string bad : {"", "1oops", "99999999999999999999999"}) {
            bool rejected = false;
            try { (void)integer(bad); } catch (const std::runtime_error&) { rejected = true; }
            check(rejected, "bad integer accepted");
        }
        bool caught = false;
        try { check(false, "deliberate failure"); } catch (const std::runtime_error&) { caught = true; }
        check(caught, "check inactive");
        std::cout << "contracts: bad integers rejected; checks active\nPASS\n";
    } catch (const std::exception& error) {
        std::cerr << error.what() << '\n'; return 2;
    }
}
