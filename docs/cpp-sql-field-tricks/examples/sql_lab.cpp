#define NOMINMAX
#include <windows.h>
#include <sql.h>
#include <sqlext.h>
#include <chrono>
#include <cstdlib>
#include <fstream>
#include <iostream>
#include <stdexcept>
#include <string>
#include <thread>
#include <vector>
#include "job_core.h"

// Synchronous ODBC only. Fixed localhost endpoint, fixed synthetic DB, no arbitrary SQL input.
std::string utf8(const wchar_t* value) {
    const int size = WideCharToMultiByte(CP_UTF8, WC_ERR_INVALID_CHARS, value, -1, nullptr, 0, nullptr, nullptr);
    if (size <= 0) return "<invalid Unicode diagnostic>";
    std::string result(static_cast<std::size_t>(size), '\0');
    WideCharToMultiByte(CP_UTF8, WC_ERR_INVALID_CHARS, value, -1, result.data(), size, nullptr, nullptr);
    result.pop_back(); return result;
}
void diagnostics(SQLSMALLINT type, SQLHANDLE handle) {
    for (SQLSMALLINT index = 1; index < 32767; ++index) {
        SQLWCHAR state[6]{};
        SQLINTEGER native = 0;
        SQLSMALLINT length = 0;
        std::vector<SQLWCHAR> message(1024);
        SQLRETURN rc = SQLGetDiagRecW(type, handle, index, state, &native,
            message.data(), static_cast<SQLSMALLINT>(message.size()), &length);
        if (rc == SQL_NO_DATA) break;
        if (!SQL_SUCCEEDED(rc)) { std::cout << "diagnostic-read-failed=" << rc << '\n'; break; }
        if (rc == SQL_SUCCESS_WITH_INFO && length >= static_cast<SQLSMALLINT>(message.size()) && length < 32766) {
            message.resize(static_cast<std::size_t>(length) + 1);
            rc = SQLGetDiagRecW(type, handle, index, state, &native,
                message.data(), static_cast<SQLSMALLINT>(message.size()), &length);
        }
        std::cout << "diag=" << index << " state=" << utf8(state) << " native=" << native
                  << " text=" << utf8(message.data()) << " diag_rc=" << rc << '\n';
    }
}
void check(SQLRETURN rc, SQLSMALLINT type, SQLHANDLE handle, const char* stage) {
    if (rc == SQL_SUCCESS_WITH_INFO || !SQL_SUCCEEDED(rc)) {
        std::cout << "stage=" << stage << " rc=" << rc << '\n';
        diagnostics(type, handle);
    }
    if (!SQL_SUCCEEDED(rc)) throw std::runtime_error(stage);
}
void expect(bool condition, const char* explanation) {
    if (!condition) throw std::runtime_error(explanation);
}

struct Connection {
    SQLHENV env = SQL_NULL_HENV;
    SQLHDBC dbc = SQL_NULL_HDBC;
    bool connected = false;
    bool manual = false;
    Connection() {
        try {
            check(SQLAllocHandle(SQL_HANDLE_ENV, SQL_NULL_HANDLE, &env), SQL_HANDLE_ENV, env, "alloc-env");
            check(SQLSetEnvAttr(env, SQL_ATTR_ODBC_VERSION, reinterpret_cast<SQLPOINTER>(SQL_OV_ODBC3), 0), SQL_HANDLE_ENV, env, "odbc-version");
            check(SQLAllocHandle(SQL_HANDLE_DBC, env, &dbc), SQL_HANDLE_ENV, env, "alloc-dbc");
            check(SQLSetConnectAttr(dbc, SQL_LOGIN_TIMEOUT, reinterpret_cast<SQLPOINTER>(5), 0), SQL_HANDLE_DBC, dbc, "login-timeout");
            char* password = nullptr;
            std::size_t length = 0;
            if (_dupenv_s(&password, &length, "BOOK_SQL_PASSWORD") || !password)
                throw std::runtime_error("BOOK_SQL_PASSWORD is required (do not put it in argv)");
            const std::string secret(password);
            free(password);
            if (secret.find_first_of(";{}") != std::string::npos) throw std::runtime_error("lab password contains unsupported characters");
            std::string cs = "DRIVER={ODBC Driver 17 for SQL Server};SERVER=127.0.0.1,15439;DATABASE=FieldTricksLab;UID=book_lab;PWD=" + secret + ";Encrypt=yes;TrustServerCertificate=yes;APP=CppSqlFieldLab;";
            check(SQLDriverConnectA(dbc, nullptr, reinterpret_cast<SQLCHAR*>(cs.data()), SQL_NTS,
                nullptr, 0, nullptr, SQL_DRIVER_NOPROMPT), SQL_HANDLE_DBC, dbc, "connect");
            connected = true;
        } catch (...) { cleanup(); throw; }
    }
    Connection(const Connection&) = delete;
    Connection& operator=(const Connection&) = delete;
    void transaction() {
        check(SQLSetConnectAttr(dbc, SQL_ATTR_AUTOCOMMIT, reinterpret_cast<SQLPOINTER>(SQL_AUTOCOMMIT_OFF), 0), SQL_HANDLE_DBC, dbc, "autocommit-off");
        manual = true;
    }
    void end(SQLSMALLINT action) {
        check(SQLEndTran(SQL_HANDLE_DBC, dbc, action), SQL_HANDLE_DBC, dbc, action == SQL_COMMIT ? "commit" : "rollback");
    }
    void cleanup() noexcept {
        if (connected) {
            if (manual) {
                const auto rc = SQLEndTran(SQL_HANDLE_DBC, dbc, SQL_ROLLBACK);
                if (!SQL_SUCCEEDED(rc)) std::cerr << "cleanup rollback failed; do not assume recovery\n";
            }
            if (!SQL_SUCCEEDED(SQLDisconnect(dbc))) std::cerr << "cleanup disconnect failed\n";
        }
        if (dbc) SQLFreeHandle(SQL_HANDLE_DBC, dbc);
        if (env) SQLFreeHandle(SQL_HANDLE_ENV, env);
        dbc = SQL_NULL_HDBC; env = SQL_NULL_HENV; connected = false;
    }
    ~Connection() { cleanup(); }
};
struct Statement {
    SQLHSTMT h = SQL_NULL_HSTMT;
    explicit Statement(Connection& c) {
        check(SQLAllocHandle(SQL_HANDLE_STMT, c.dbc, &h), SQL_HANDLE_DBC, c.dbc, "alloc-stmt");
        const auto rc = SQLSetStmtAttr(h, SQL_ATTR_QUERY_TIMEOUT, reinterpret_cast<SQLPOINTER>(5), 0);
        if (!SQL_SUCCEEDED(rc)) { SQLFreeHandle(SQL_HANDLE_STMT, h); h = SQL_NULL_HSTMT; throw std::runtime_error("query-timeout"); }
    }
    Statement(const Statement&) = delete;
    Statement& operator=(const Statement&) = delete;
    ~Statement() { if (h) SQLFreeHandle(SQL_HANDLE_STMT, h); }
    SQLRETURN exec_raw(const char* text) { return SQLExecDirectA(h, reinterpret_cast<SQLCHAR*>(const_cast<char*>(text)), SQL_NTS); }
    void exec(const char* text) {
        const auto rc = exec_raw(text);
        // ODBC 3: searched UPDATE/DELETE with no matching rows may return SQL_NO_DATA.
        // This belongs to execute's contract, NOT the generic success checker or fetch.
        if (rc == SQL_NO_DATA) { std::cout << "execute=SQL_NO_DATA (inspect row count)\n"; return; }
        check(rc, SQL_HANDLE_STMT, h, "execute");
    }
    int integer(SQLUSMALLINT column) {
        SQLINTEGER value = 0; SQLLEN indicator = 0;
        check(SQLGetData(h, column, SQL_C_SLONG, &value, sizeof(value), &indicator), SQL_HANDLE_STMT, h, "get-int");
        if (indicator == SQL_NULL_DATA) throw std::runtime_error("unexpected NULL integer");
        return value;
    }
    void fetch() { check(SQLFetch(h), SQL_HANDLE_STMT, h, "fetch"); }
};
int scalar(Connection& c, const char* sql) { Statement s(c); s.exec(sql); s.fetch(); return s.integer(1); }
void execute(Connection& c, const char* sql) { Statement s(c); s.exec(sql); }

void mapping(Connection& c) {
    Statement s(c);
    s.exec("SELECT job_id,input_value,note FROM dbo.Jobs WHERE job_id=1"); s.fetch();
    JobRow row{s.integer(1), s.integer(2), std::nullopt};
    SQLWCHAR note[201]{}; SQLLEN ind = 0;
    const auto rc = SQLGetData(s.h, 3, SQL_C_WCHAR, note, sizeof(note), &ind);
    check(rc, SQL_HANDLE_STMT, s.h, "get-note");
    expect(ind == SQL_NULL_DATA, "this synthetic baseline expects NULL note");
    const auto result = process_job(row);
    expect(result.score == 20 && result.accepted, "DB and fixture core mismatch");
    std::cout << "db-core job_id=" << result.job_id << " score=" << result.score << " accepted=true note=NULL\n";
}
void bad_data(Connection& c) {
    Statement s(c);
    s.exec("SELECT CAST(NULL AS varchar(8)),CAST('' AS varchar(8)),CAST('abcdefghij' AS varchar(10)),CAST(2147483648 AS bigint),NCHAR(20013)"); s.fetch();
    for (SQLUSMALLINT col = 1; col <= 3; ++col) {
        char value[5]{}; SQLLEN ind = 0;
        const auto rc = SQLGetData(s.h, col, SQL_C_CHAR, value, sizeof(value), &ind);
        check(rc, SQL_HANDLE_STMT, s.h, "get-text");
        std::cout << "column=" << col << " indicator=" << ind << " rc=" << rc << " chunk=" << value << '\n';
        if (col == 1) expect(ind == SQL_NULL_DATA, "NULL indicator");
        if (col == 2) expect(ind == 0, "empty indicator");
        if (col == 3) expect(rc == SQL_SUCCESS_WITH_INFO, "expected truncation");
    }
    SQLBIGINT big = 0; SQLLEN ind = 0;
    check(SQLGetData(s.h, 4, SQL_C_SBIGINT, &big, sizeof(big), &ind), SQL_HANDLE_STMT, s.h, "bigint");
    SQLWCHAR wide[4]{};
    check(SQLGetData(s.h, 5, SQL_C_WCHAR, wide, sizeof(wide), &ind), SQL_HANDLE_STMT, s.h, "unicode");
    expect(big == 2147483648LL && wide[0] == 20013, "wide data mismatch");
    std::cout << "bigint=" << big << " unicode-code-unit=" << wide[0] << '\n';
    // Truncated column deliberately not admitted into JobRow. This is NOT a generic string reader.
}
void batch(Connection& c) {
    Statement s(c);
    s.exec("SET NOCOUNT OFF; CREATE TABLE #batch(v int); INSERT #batch VALUES(7); SELECT v FROM #batch;");
    int total = 0;
    for (int index = 0;; ++index) {
        SQLSMALLINT cols = 0; SQLLEN rows = -1;
        check(SQLNumResultCols(s.h, &cols), SQL_HANDLE_STMT, s.h, "num-cols");
        check(SQLRowCount(s.h, &rows), SQL_HANDLE_STMT, s.h, "row-count");
        std::cout << "result=" << index << " columns=" << cols << " row_count=" << rows << '\n';
        if (cols > 0) {
            for (;;) { const auto rc = SQLFetch(s.h); if (rc == SQL_NO_DATA) break;
                check(rc, SQL_HANDLE_STMT, s.h, "batch-fetch");
                std::cout << "value=" << s.integer(1) << '\n'; ++total; }
        }
        const auto rc = SQLMoreResults(s.h); if (rc == SQL_NO_DATA) break;
        check(rc, SQL_HANDLE_STMT, s.h, "more-results");
    }
    expect(total == 1, "batch must return one data row");
}
void bind_value(Connection& c) {
    Statement s(c); SQLINTEGER value = 10; SQLLEN indicator = 0;
    const char* query = "SELECT CAST(? AS int)";
    check(SQLPrepareA(s.h, reinterpret_cast<SQLCHAR*>(const_cast<char*>(query)), SQL_NTS), SQL_HANDLE_STMT, s.h, "prepare");
    check(SQLBindParameter(s.h, 1, SQL_PARAM_INPUT, SQL_C_SLONG, SQL_INTEGER, 0, 0, &value, 0, &indicator), SQL_HANDLE_STMT, s.h, "bind");
    value = 20; // Still alive. No dangling pointer or undefined behavior.
    check(SQLExecute(s.h), SQL_HANDLE_STMT, s.h, "execute-bound"); s.fetch();
    const int read = s.integer(1); expect(read == 20, "deferred value");
    std::cout << "bind-time=10 execute-time=20 received=" << read << '\n';
}
void rows(Connection& c) {
    const int before = scalar(c, "SELECT COALESCE(score,-1) FROM dbo.Jobs WHERE job_id=1");
    c.transaction();
    int index = 0;
    const SQLLEN expected[] = {1, 0, 1}; // Verified target driver, not a cross-driver rule.
    for (const auto query : {"UPDATE dbo.Jobs SET score=20 WHERE job_id=1", "UPDATE dbo.Jobs SET score=20 WHERE job_id=999", "UPDATE dbo.Jobs SET score=20 WHERE job_id=1"}) {
        Statement s(c); s.exec(query); SQLLEN count = -1;
        check(SQLRowCount(s.h, &count), SQL_HANDLE_STMT, s.h, "row-count");
        std::cout << "affected=" << count << '\n';
        expect(count == expected[index++], "row-count differs from this lab's pinned driver baseline");
    }
    expect(scalar(c, "SELECT score FROM dbo.Jobs WHERE job_id=1") == 20, "postcondition");
    c.end(SQL_ROLLBACK);
    Connection verifier;
    expect(scalar(verifier, "SELECT COALESCE(score,-1) FROM dbo.Jobs WHERE job_id=1") == before,
           "rows rollback did not restore baseline");
    std::cout << "independent rollback verification=matched baseline\n";
}
void rollback(Connection& c) {
    execute(c, "UPDATE dbo.Jobs SET score=5 WHERE job_id=1");
    c.end(SQL_ROLLBACK); // autocommit: cannot undo the earlier statement.
    expect(scalar(c, "SELECT score FROM dbo.Jobs WHERE job_id=1") == 5, "autocommit baseline");
    std::cout << "autocommit after-rollback=5\n";
    c.transaction(); execute(c, "UPDATE dbo.Jobs SET score=6 WHERE job_id=1");
    expect(scalar(c, "SELECT score FROM dbo.Jobs WHERE job_id=1") == 6, "own-write");
    c.end(SQL_ROLLBACK);
    Connection verifier;
    const int final = scalar(verifier, "SELECT score FROM dbo.Jobs WHERE job_id=1");
    expect(final == 5, "manual rollback");
    execute(verifier, "UPDATE dbo.Jobs SET score=NULL WHERE job_id=1");
    std::cout << "manual before-rollback=6 after-rollback=" << final << " restored=NULL\n";
}
void lock_wait(Connection& a) {
    Connection b;
    execute(b, "SET LOCK_TIMEOUT 1000");
    a.transaction(); execute(a, "UPDATE dbo.Jobs SET score=77 WHERE job_id=1");
    // A's successful UPDATE is the barrier: it holds the write lock before B starts.
    Statement blocked(b);
    const auto start = std::chrono::steady_clock::now();
    const auto rc = blocked.exec_raw("UPDATE dbo.Jobs SET score=88 WHERE job_id=1");
    const auto elapsed = std::chrono::duration_cast<std::chrono::milliseconds>(std::chrono::steady_clock::now() - start).count();
    diagnostics(SQL_HANDLE_STMT, blocked.h);
    expect(rc == SQL_ERROR, "B should hit bounded lock wait");
    SQLWCHAR state[6]{}; SQLINTEGER native = 0; SQLSMALLINT length = 0; SQLWCHAR message[512]{};
    check(SQLGetDiagRecW(SQL_HANDLE_STMT, blocked.h, 1, state, &native, message, 512, &length),
          SQL_HANDLE_STMT, blocked.h, "lock-diagnostic");
    expect(native == 1222 && elapsed >= 800 && elapsed < 6000, "not the expected bounded lock timeout");
    a.end(SQL_ROLLBACK);
    execute(b, "UPDATE dbo.Jobs SET score=88 WHERE job_id=1");
    expect(scalar(b, "SELECT score FROM dbo.Jobs WHERE job_id=1") == 88, "B after release");
    execute(b, "UPDATE dbo.Jobs SET score=NULL WHERE job_id=1");
    std::cout << "B-wait-ms=" << elapsed << " after-A-release=success restored=NULL\n";
}
void retry(Connection& c) {
    const int previous = scalar(c, "SELECT COUNT(*) FROM dbo.Operations WHERE operation_id='chapter-15'");
    if (previous) {
        expect(scalar(c, "SELECT COUNT(*) FROM dbo.Operations WHERE operation_id='chapter-15' AND job_id=15 AND score=20") == 1,
               "operation ID reused for different intent");
        expect(scalar(c, "SELECT score FROM dbo.Jobs WHERE job_id=15") == 20,
               "operation recorded but result drifted; inspect, do not blindly retry");
        std::cout << "operation already recorded; skip DB write; notification remains a separate question\n"; return;
    }
    c.transaction();
    execute(c, "INSERT dbo.Operations(operation_id,job_id,score) VALUES('chapter-15',15,20)");
    execute(c, "UPDATE dbo.Jobs SET score=20 WHERE job_id=15"); c.end(SQL_COMMIT);
    // The upper layer pretends to lose the success result. No driver fault is claimed.
    std::cout << "fault-model=discard-application-ack (NOT network failure)\n";
    Connection verifier;
    expect(scalar(verifier, "SELECT COUNT(*) FROM dbo.Operations WHERE operation_id='chapter-15'") == 1, "operation evidence");
    expect(scalar(verifier, "SELECT score FROM dbo.Jobs WHERE job_id=15") == 20, "persisted result");
    std::cout << "confirmed operation+score in new connection; do not blindly resend\n";
}
void timing(Connection& c, bool delay) {
    Statement s(c);
    const auto t0 = std::chrono::steady_clock::now(); s.exec("SELECT job_id,input_value FROM dbo.Jobs WHERE job_id=1");
    const auto t1 = std::chrono::steady_clock::now(); s.fetch(); JobRow row{s.integer(1),s.integer(2),std::nullopt};
    const auto t2 = std::chrono::steady_clock::now();
    if (delay) std::this_thread::sleep_for(std::chrono::milliseconds(120));
    const auto r = process_job(row);
    const auto t3 = std::chrono::steady_clock::now();
    const auto ms = [](auto x, auto y) { return std::chrono::duration_cast<std::chrono::microseconds>(y-x).count()/1000.0; };
    std::cout << "execute_ms=" << ms(t0,t1) << " fetch_map_ms=" << ms(t1,t2) << " core_ms=" << ms(t2,t3) << " injected_delay=" << delay << " score=" << r.score << '\n';
}
int main(int argc, char** argv) {
    try {
        if (argc != 2) throw std::runtime_error("choose: mapping diag data batch bind rows rollback lock timing timing-base retry");
        const std::string mode(argv[1]);
        Connection c;
        std::cout << "target=localhost:15439/FieldTricksLab user=book_lab case=" << mode << '\n';
        if (mode == "mapping") mapping(c);
        else if (mode == "diag") { Statement s(c); const auto rc=s.exec_raw("SELECT no_such_column FROM dbo.Jobs"); diagnostics(SQL_HANDLE_STMT,s.h); expect(rc==SQL_ERROR,"expected missing-column failure"); }
        else if (mode == "data") bad_data(c);
        else if (mode == "batch") batch(c);
        else if (mode == "bind") bind_value(c);
        else if (mode == "rows") rows(c);
        else if (mode == "rollback") rollback(c);
        else if (mode == "lock") lock_wait(c);
        else if (mode == "timing" || mode == "timing-base") timing(c, mode == "timing");
        else if (mode == "retry") retry(c);
        else throw std::runtime_error("unknown case");
        std::cout << "PASS\n"; return 0;
    } catch (const std::exception& error) { std::cerr << "FAIL stage=" << error.what() << '\n'; return 2; }
}
