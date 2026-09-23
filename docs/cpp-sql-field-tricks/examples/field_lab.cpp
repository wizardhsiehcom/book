#define NOMINMAX
#include <windows.h>
#include <filesystem>
#include <fstream>
#include <iostream>
#include <map>
#include <optional>
#include <stdexcept>
#include <string>
#include "job_core.h"

// 這兩個值在 build 時寫進 exe，程式啟動後不會再去讀這份 cpp。
// 改了字若沒有重新 build，正在跑的那份 exe 仍是舊值。
// test_mode：true 才允許 --input fixed。改成 false 只關掉這一條，cli 和 fixture 還在。
// build_id：啟動時印出來的標記。第 01 章靠它分辨舊 exe 和新 exe。
constexpr bool test_mode = true;
constexpr const char* build_id = "field-lab-v1";

// 把 fixture 裡的數字文字轉成 int。後面多了別的字就失敗，不悄悄吃掉。
int parse_int(const std::string& value) {
    std::size_t used = 0;
    const int number = std::stoi(value, &used);
    if (used != value.size()) throw std::runtime_error("integer contains trailing characters");
    return number;
}

// 讀一筆固定格式的 .job 檔，做成 JobRow。這是執行時讀檔，和上面的 constexpr 無關。
// 檔案必須剛好 5 個欄位，而且 schema、rule 要對得上這本書的 double-v1。
JobRow load_fixture(const std::filesystem::path& path) {
    std::ifstream in(path);
    if (!in) throw std::runtime_error("cannot open fixture");
    std::map<std::string, std::string> values;
    std::string line;
    while (std::getline(in, line)) {
        if (!line.empty() && line.back() == '\r') line.pop_back();
        const auto at = line.find('=');
        if (at == std::string::npos || !values.emplace(line.substr(0, at), line.substr(at + 1)).second)
            throw std::runtime_error("invalid or duplicate fixture field");
    }
    if (in.bad()) throw std::runtime_error("fixture read failed");
    if (values.size() != 5 || values.at("schema") != "1" || values.at("rule") != "double-v1")
        throw std::runtime_error("unsupported fixture schema or rule");
    const auto& note = values.at("note");
    if (note != "null" && note.rfind("text:", 0) != 0)
        throw std::runtime_error("note must be null or text:<value>");
    return {parse_int(values.at("job_id")), parse_int(values.at("input_value")),
            note == "null" ? std::nullopt : std::optional<std::string>(note.substr(5))};
}

// 問 Windows：現在這個程序是從哪一個 exe 檔啟動的。
// 緩衝區不夠就加大再問，避免路徑被截斷後還當成完整答案。
std::wstring executable_path() {
    std::wstring path(512, L'\0');
    for (;;) {
        const DWORD used = GetModuleFileNameW(nullptr, path.data(), static_cast<DWORD>(path.size()));
        if (!used) throw std::runtime_error("GetModuleFileNameW failed");
        if (used < path.size()) { path.resize(used); return path; }
        if (path.size() >= 32768) throw std::runtime_error("executable path too long");
        path.resize(path.size() * 2);
    }
}

// 把一段文字寫成新檔。寫完還要確認流沒有失敗，不能只看函式有沒有返回。
void write_text(const std::filesystem::path& path, const std::string& content) {
    std::ofstream out(path, std::ios::binary);
    out << content;
    out.close();
    if (!out) throw std::runtime_error("output write failed");
}

int main(int argc, char** argv) {
    try {
        // 這支程式只做 preview：把結果和「假如要寫回會送什麼」存到本機目錄。
        // 沒有資料庫，也沒有網路。
        std::map<std::string, std::string> args;
        // 命令列必須是一對一對的 --名字 值，而且同一個名字不能出現兩次。
        for (int i = 1; i < argc; i += 2) {
            if (i + 1 >= argc || !args.emplace(argv[i], argv[i + 1]).second)
                throw std::runtime_error("arguments must be unique --name value pairs");
        }
        for (const auto& [name, value] : args) {
            (void)value;
            if (name != "--input" && name != "--fixture" && name != "--job-id" &&
                name != "--value" && name != "--out" && name != "--effect")
                throw std::runtime_error("unknown option: " + name);
        }
        const std::string input = args.at("--input");
        // effect 目前只接受 preview。其他字代表這支程式沒有那條路，不是默默改去寫 SQL。
        if (args.at("--effect") != "preview")
            throw std::runtime_error("only preview is implemented; no SQL writes are available");
        JobRow row{1, 10, std::nullopt};
        // 三條入口只決定 row 從哪來。算式都在下面那一次 process_job。
        if (input == "fixed") {
            // fixed 使用上面那個寫死的 row。test_mode 為 false 時，這條路直接拒絕。
            if (!test_mode) throw std::runtime_error("fixed input disabled by compiled test_mode");
            if (args.count("--fixture") || args.count("--job-id") || args.count("--value"))
                throw std::runtime_error("fixed input cannot accept overridden values");
        } else if (input == "cli") {
            if (args.count("--fixture")) throw std::runtime_error("cli cannot accept --fixture");
            row = {parse_int(args.at("--job-id")), parse_int(args.at("--value")), std::nullopt};
        } else if (input == "fixture") {
            if (args.count("--job-id") || args.count("--value"))
                throw std::runtime_error("fixture cannot accept overridden values");
            row = load_fixture(args.at("--fixture"));
        } else throw std::runtime_error("input must be fixed, cli or fixture");

        const auto result = process_job(row); // 三條入口在這裡會合。前面換來源，這裡仍是同一個計算。
        const std::filesystem::path output(args.at("--out"));
        // 目錄已存在就拒絕。上一次的輸出是證據，不蓋掉。
        if (!std::filesystem::create_directory(output))
            throw std::runtime_error("output directory already exists; choose a new run name");
        const auto exe = executable_path();
        std::wcout << L"exe=" << exe << L'\n';
        std::cout << "build=" << build_id << " test_mode=" << (test_mode ? "on" : "off")
                  << " input=" << input << " effect=preview\n";
        const std::string json = "{\"schema\":1,\"rule\":\"double-v1\",\"job_id\":" +
            std::to_string(result.job_id) + ",\"score\":" + std::to_string(result.score) +
            ",\"accepted\":" + (result.accepted ? "true" : "false") + "}\n";
        write_text(output / "result.jsonl", json);
        // snapshot 存的是送進計算前的那一筆輸入，方便之後重播同一筆。
        write_text(output / "snapshot.job", "schema=1\nrule=double-v1\njob_id=" +
            std::to_string(row.job_id) + "\ninput_value=" + std::to_string(row.input_value) +
            "\nnote=" + (row.note ? "text:" + *row.note : "null") + "\n");
        // intent 只寫「假如要更新、假如要通知，會送這些」。NOT EXECUTED 表示沒有真的做。
        write_text(output / "intent.txt", "would update job_id=" + std::to_string(row.job_id) +
            " score=" + std::to_string(result.score) + "\nwould notify job_id=" +
            std::to_string(row.job_id) + "\nNOT EXECUTED: no DB/network adapter in this target\n");
        write_text(output / "run.txt", "build=" + std::string(build_id) +
            "\ntest_mode=" + (test_mode ? "on" : "off") + "\ninput=" + input +
            "\neffect=preview\nrule=double-v1\n");
        std::cout << "job_id=" << result.job_id << " score=" << result.score
                  << " accepted=" << (result.accepted ? "true" : "false") << '\n';
        return 0;
    } catch (const std::exception& error) {
        std::cerr << "error: " << error.what() << '\n';
        return 2;
    }
}
