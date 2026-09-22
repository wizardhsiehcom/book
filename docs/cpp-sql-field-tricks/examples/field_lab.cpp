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

// Change this value, rebuild, then inspect the actual executable's banner.
constexpr bool test_mode = true;
constexpr const char* build_id = "field-lab-v1";

int parse_int(const std::string& value) {
    std::size_t used = 0;
    const int number = std::stoi(value, &used);
    if (used != value.size()) throw std::runtime_error("integer contains trailing characters");
    return number;
}

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

void write_text(const std::filesystem::path& path, const std::string& content) {
    std::ofstream out(path, std::ios::binary);
    out << content;
    out.close();
    if (!out) throw std::runtime_error("output write failed");
}

int main(int argc, char** argv) {
    try {
        // Only preview is implemented. This program has no database or network adapter.
        std::map<std::string, std::string> args;
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
        if (args.at("--effect") != "preview")
            throw std::runtime_error("only preview is implemented; no SQL writes are available");
        JobRow row{1, 10, std::nullopt};
        if (input == "fixed") {
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

        const auto result = process_job(row); // All three entries meet HERE.
        const std::filesystem::path output(args.at("--out"));
        // Refuse reuse: a failed or previous run is evidence, not something to overwrite.
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
        write_text(output / "snapshot.job", "schema=1\nrule=double-v1\njob_id=" +
            std::to_string(row.job_id) + "\ninput_value=" + std::to_string(row.input_value) +
            "\nnote=" + (row.note ? "text:" + *row.note : "null") + "\n");
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
