# 06｜logs 沒字，先讓程式把字吐出來

**Python 現有開關；新增輸出 fixture；主機需 Python 3。** 已完成本版 Desktop Linux／arm64 核心實驗；適用環境與未驗邊界見[證據附錄](appendix-d-evidence.md)。

## 現場症狀：程式活著，logs 卻像空的

容器仍在跑，docker logs 沒有新行，等到程序結束才一次出現。最容易浪費的下一步是立刻懷疑 logging driver、網路或 Docker daemon，然後重建整個映像。Python 的 stdout 在非互動管線可能先留在應用程式的緩衝區；這時先做一個局部對照：同一個程式、同一個 image，一組普通啟動，一組加 -u。

這個問題有兩個邊界。第一，docker logs 主要讀容器 endpoint command 的 STDOUT 與 STDERR；程式若只寫檔案，logs 本來就不會替你讀檔。第二，應用已經把字交給 Docker 後，driver 或遠端收集端仍可能造成另一段延遲。Python issue #604 提供了「先懷疑 driver、後定位 Python 緩衝」的原始案例，但那不是本章實測結果。[原始 issue](https://github.com/docker-library/python/issues/604)

## 小招式：先只改 Python 的一個開關

把 -u 放在同一個 Python 命令上，不改程式內容，不加 TTY。Python 官方說明 -u 會讓 stdout 和 stderr 不經緩衝，對 stdin 沒有效果；非空的 PYTHONUNBUFFERED 環境變數等價於 -u。[Python -u 原始文件](https://docs.python.org/3/using/cmdline.html#cmdoption-u)

為了隔離這一輪的問題，fixture 明確指定 json-file driver，並記錄實際 driver。這不是宣稱所有 daemon 都用同一 driver；若正式容器使用遠端 driver，必須另外核對它是否支援讀取或是否啟用 dual logging。[Docker view container logs](https://docs.docker.com/engine/logging/)、[Docker logging drivers](https://docs.docker.com/engine/logging/configure/)、[Docker dual logging](https://docs.docker.com/engine/logging/dual-logging/)

## 必要原理：輸出緩衝、輸出去向、driver 是三個階段

程式先把資料寫入自己的 stdout/stderr 物件；Python 是否立即 flush 是第一個問題。Docker 再從容器的輸出端點收集資料；應用把字寫到 /tmp/app.log，就不會自動出現在 docker logs。最後，Docker logging driver 將資料保存或送走，遠端 driver 是否可讀、cache 是否啟用又是另一個問題。

所以「logs 沒字」至少有三條分支：Python 還沒 flush、程式根本不寫 stdout/stderr、或 driver／收集端沒有把資料呈現在 docker logs。-u 只直接處理第一條，不能修正檔案輸出、遠端網路或 logging handler。

## 親手實驗：普通啟動、-u、檔案輸出

在 Bash 或 WSL 的新工作階段貼上。程式不開 TTY；兩個 stream 容器都明確使用同一個 log driver。主機需有 Python 3。poll 函式最多查 80 次，每次間隔 0.1 秒，並用主機 Python 的 monotonic clock 計算「開始輪詢到看見首行」的實際 elapsed；每次 docker logs 的 CLI 開銷也包含在內，不能把 80 次直接當成精準八秒。

```bash
set -Eeuo pipefail
command -v python3 >/dev/null

field06_dir="$(mktemp -d -t field06.XXXXXX)"
field06_normal="field06-normal-$$"
field06_unbuffered="field06-unbuffered-$$"
field06_file="field06-file-$$"

field06_cleanup() {
  docker rm -f "$field06_normal" "$field06_unbuffered" "$field06_file" \
    >/dev/null 2>&1 || true
}
field06_show_cleanup() {
  printf '若中途停止，請執行：\n'
  printf 'docker rm -f %s %s %s 2>/dev/null || true\n' \
    "$field06_normal" "$field06_unbuffered" "$field06_file"
  printf '暫存證據仍在：%s\n' "$field06_dir"
}
field06_show_cleanup

docker pull python:3.13-alpine
FIELD06_PY_IMAGE_ID="$(docker image inspect --format '{{.Id}}' python:3.13-alpine)"
case "$FIELD06_PY_IMAGE_ID" in sha256:*) ;; *) echo 'python image ID 格式異常' >&2; exit 1 ;; esac
printf 'python image ID: %s\n' "$FIELD06_PY_IMAGE_ID" > "$field06_dir/image-ids.txt"

cat > "$field06_dir/stream.py" <<'PY'
import time

for index in range(4):
    print(f"field06-line={index} at={time.time_ns()}")
    time.sleep(1)
PY

cat > "$field06_dir/file.py" <<'PY'
from pathlib import Path

output = Path("/tmp/field06-file.log")
output.write_text("field06-file\n", encoding="utf-8")
assert output.read_text(encoding="utf-8") == "field06-file\n"
PY

field06_wait_first() {
  python3 - "$1" "$2" <<'PY'
from pathlib import Path
import subprocess
import sys
import time

name, record = sys.argv[1:]
started = time.monotonic_ns()
for attempt in range(1, 81):
    result = subprocess.run(['docker', 'logs', name], text=True,
                            capture_output=True, timeout=2)
    if result.returncode:
        raise SystemExit(result.stderr)
    if 'field06-line=0' in result.stdout:
        elapsed_ms = (time.monotonic_ns() - started) // 1_000_000
        assert elapsed_ms >= 0
        Path(record).write_text(
            f'first_visible_elapsed_ms={elapsed_ms}\npoll_count={attempt}\n')
        break
    time.sleep(0.1)
else:
    raise SystemExit('首筆 log 超過 80 次輪詢仍不可見')
PY
}

docker run -d --log-driver=json-file --name "$field06_normal" \
  --mount "type=bind,src=$field06_dir/stream.py,dst=/opt/stream.py,readonly" \
  "$FIELD06_PY_IMAGE_ID" python /opt/stream.py > "$field06_dir/normal.id"
test "$(docker inspect --format '{{.Config.Tty}}' "$field06_normal")" = false
docker inspect --format '{{.HostConfig.LogConfig.Type}}' "$field06_normal" \
  > "$field06_dir/normal.driver"
field06_wait_first "$field06_normal" "$field06_dir/normal-first.txt"
test "$(docker wait "$field06_normal")" = 0

docker run -d --log-driver=json-file --name "$field06_unbuffered" \
  --mount "type=bind,src=$field06_dir/stream.py,dst=/opt/stream.py,readonly" \
  "$FIELD06_PY_IMAGE_ID" python -u /opt/stream.py > "$field06_dir/unbuffered.id"
test "$(docker inspect --format '{{.Config.Tty}}' "$field06_unbuffered")" = false
docker inspect --format '{{.HostConfig.LogConfig.Type}}' "$field06_unbuffered" \
  > "$field06_dir/unbuffered.driver"
field06_wait_first "$field06_unbuffered" "$field06_dir/unbuffered-first.txt"
test "$(docker wait "$field06_unbuffered")" = 0

field06_normal_ms="$(sed -n 's/^first_visible_elapsed_ms=//p' \
  "$field06_dir/normal-first.txt")"
field06_unbuffered_ms="$(sed -n 's/^first_visible_elapsed_ms=//p' \
  "$field06_dir/unbuffered-first.txt")"
test -n "$field06_normal_ms"
test -n "$field06_unbuffered_ms"
test "$field06_unbuffered_ms" -lt "$field06_normal_ms"

docker logs "$field06_normal" > "$field06_dir/normal.logs"
docker logs "$field06_unbuffered" > "$field06_dir/unbuffered.logs"
test "$(grep -cF 'field06-line=' "$field06_dir/normal.logs")" -eq 4
test "$(grep -cF 'field06-line=' "$field06_dir/unbuffered.logs")" -eq 4

docker run --name "$field06_file" --log-driver=json-file \
  --mount "type=bind,src=$field06_dir/file.py,dst=/opt/file.py,readonly" \
  "$FIELD06_PY_IMAGE_ID" python /opt/file.py > "$field06_dir/file-run.log" 2>&1
test "$(docker inspect --format '{{.Config.Tty}}' "$field06_file")" = false
test -z "$(docker logs "$field06_file")"
docker cp "$field06_file:/tmp/field06-file.log" "$field06_dir/file-copy.log"
grep -Fxq 'field06-file' "$field06_dir/file-copy.log"

printf '普通組首筆觀察：\n'
cat "$field06_dir/normal-first.txt"
printf '%s\n' '普通組 driver：'
cat "$field06_dir/normal.driver"
printf '%s\n' '-u 組首筆觀察：'
cat "$field06_dir/unbuffered-first.txt"
printf '%s\n' '普通組完整 logs：'
cat "$field06_dir/normal.logs"
printf '%s\n' '-u 組完整 logs：'
cat "$field06_dir/unbuffered.logs"
printf '%s\n' '檔案輸出 cp 結果：'
cat "$field06_dir/file-copy.log"

field06_cleanup
printf '容器已清理；證據目錄保留：%s\n' "$field06_dir"
```

普通組若直到程序結束才看到第一行，normal-first.txt 的觀察窗口應大於 unbuffered-first.txt；-u 組的首行應在程序仍活著時較早出現。程式本身四行都會結束，兩組最後應各有四行，這避免把「延遲」誤寫成「遺失」。比較失敗時保留目錄，先看 driver、TTY 欄位和完整 logs；不要只用一個失敗的時間數字替機制下結論。

檔案組故意不寫 stdout/stderr。預期 docker logs 為空，但停止後仍可用 cp 取到 /tmp/field06-file.log；這只證明輸出去了檔案，不證明檔案有 rotation、同步或 crash consistency。

計時的起點與終點由同一個主機 Python 程序的 monotonic clock 取得；不將分別啟動的兩個程序之時間值相減。每次 Docker 查詢設兩秒上限，80 次輪詢還包含 CLI 開銷，不能說它恰好八秒。

## 本版實測記錄

從**開始輪詢**到第一次看見 log，普通組為 **3,968 ms／30 次查詢**，`-u` 組為 **16 ms／1 次查詢**；這不含 run 與前置 inspect，也不是微秒級效能比較。兩組最後各有四行，檔案組 logs 空白但 cp 取得 `field06-file`。三個容器已清理。

## 結果解讀：-u 只縮小一個原因

若普通組的首行延後、-u 組提早，而兩組最終行數相同，差異支持 Python stdout/stderr 緩衝是這次延遲的原因。這不代表所有 logging handler 都遵守同一條路徑；handler 可能自己批次化，也不代表遠端 driver 已經把資料送到收集端。

若兩組首行都很早，可能是 Python 或 driver 的現行行為與假設不同，或輪詢時機太晚；記錄完整條件後再判斷。若兩組都沒有可讀 logs，先確認容器是否真的寫 stdout/stderr、driver 是否支援 docker logs，必要時查 dual logging。若只有檔案組空白，這正是預期，不要把它當 daemon 故障。

取消緩衝可能增加輸出操作與 driver 壓力；高頻 debug 不應無限加大。正式修正可選命令列 -u 或 PYTHONUNBUFFERED=1，但要在應用的啟動設定裡留下意圖，並另量 log 量與丟失風險。

## 失效反例：TTY 會改變你正在觀察的條件

本章明確不加 -t。若改成互動 TTY，Python 的 stdout buffering 條件可能改變，A/B 差異就不再只剩 -u；若用遠端 driver，docker logs 也可能受 driver 讀取能力與本機 cache 影響。這些都是另一次對照，不要在本輪中途混入。

同樣地，docker logs 看到最後四行，不表示中途每行都即時可見；只能搭配首筆 polling 記錄判斷延遲。dual logging 是 Docker 為部分遠端 driver 提供的讀取 cache，官方也列出 cache 關閉或寫入失敗時的限制，不能把它寫成可靠離線備援。

## 收尾與撤回

正常結束時，程式已明確移除三個 field06 容器，並保留 field06_dir 供核對首筆記錄、driver、logs 與 cp 產物。確認原始輸出已複製到[實驗紀錄卡模板](appendix-b-record.md)後，再手動刪除這個明確目錄；不要用全域 prune，也不要刪除本輪以外的 image。

若中途停止，使用程式印出的精準 docker rm 命令清掉容器，先讀暫存檔再決定是否刪目錄。撤回正式變更只需拿掉 -u 或 PYTHONUNBUFFERED 設定，並恢復原本的輸出路由；若真正問題在 driver 或檔案 log，就沿對應分支處理，不把 -u 當萬用修復。
