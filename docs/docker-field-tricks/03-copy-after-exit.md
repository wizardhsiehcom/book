# 03｜容器死了，先把檔案拿出來

**現有取檔功能；新增故意失敗程式。** 已完成本版 Desktop Linux／arm64 核心實驗；適用環境與未驗邊界見[證據附錄](appendix-d-evidence.md)。

## 現場症狀：退出不等於現場消失

容器一跑就退出，接著用 docker exec 當然進不去。直覺做法是再 run 一次，卻可能覆寫失敗產物、再次送出昂貴工作，或讓第二次的狀態把第一次的線索蓋掉。先看 docker ps -a：只要容器還在，停止狀態仍然是可以讀取的現場。

本章只回答一個窄問題：**停止後的可寫層裡，指定的結果檔還能不能取出來？** 先用 docker diff 找到可能的路徑，再用 docker cp 拿檔案。這兩個命令是 Docker 本身的觀察與複製功能，不需要容器還活著。[docker cp 原始文件](https://docs.docker.com/reference/cli/docker/container/cp/)、[docker diff 原始文件](https://docs.docker.com/reference/cli/docker/container/diff/)

## 小招式：保留一次失敗，再取一個已知檔案

若原容器沒有用 --rm 刪掉，先記下它的名稱或 ID：

```bash
docker ps -a --no-trunc
docker diff CONTAINER_NAME
docker cp CONTAINER_NAME:/path/to/result ./case-result
```

cp 的來源是容器檔案系統，目的地父目錄要先存在；取檔時指定最小路徑，避免把秘密、暫存檔或數 GB 的整棵目錄搬回主機。diff 只能告訴你檔案或目錄自容器建立後出現 A（新增）、C（變更）或 D（刪除），不能告訴你是哪個程序在何時寫入，也不是逐行 diff。

取檔前先記三項不會改變現場的資料：容器 ID、image ID、以及 Mounts。這讓你之後能分辨「檔案在可寫層」和「檔案其實在外部資料源」。例如停止容器仍可 inspect：

```bash
docker inspect --format '{{.Id}} {{.Image}} {{.State.Status}} {{.State.ExitCode}}' CONTAINER_NAME
docker inspect --format '{{json .Mounts}}' CONTAINER_NAME
docker diff CONTAINER_NAME
```

若結果很大，先用 diff 找單一路徑，再取一個 checksum 或短文字 marker；不要把「整個容器 cp 出來」當成預設。複製到主機後，檔案擁有者可能按呼叫 cp 的本機使用者呈現，故障排查要同時保存權限與路徑資訊，避免取檔動作本身製造新的誤判。

如果原命令已用了 --rm，退出後同一個容器就沒有可供 cp 的對象。本章的對照會故意保留一組，另一組使用 --rm，讓這個差異變成可檢查的條件，而不是事後猜測。

## 必要原理：可寫層、掛載與記憶體不是同一個現場

容器停止只表示主程序結束；容器物件與其可寫層仍可能保留。docker cp 可以從執行中或停止中的容器複製檔案與目錄，但 /proc、/sys、/dev、tmpfs 及使用者建立的部分掛載有特殊限制，不能把它當成記憶體取證工具。[Docker 的 corner cases](https://docs.docker.com/reference/cli/docker/container/cp/#corner-cases)

掛載資料也要分開思考。本章主線把結果檔寫在 /tmp，讓它落在容器可寫層；若結果其實在 bind mount 或 volume，cp 看到的是掛載內容，撤回與保存方式就不同。docker export 只適合做一個小反例：它匯出容器檔案系統的 tar，**不包含 volume 內容**；它不是完整備份，也不會保存程序狀態。[docker export 原始文件](https://docs.docker.com/reference/cli/docker/container/export/)

## 親手實驗：cp 對照 --rm

在 Bash 或 WSL 的新工作階段貼上整段。每輪使用獨立的 mktemp 目錄；容器、volume 都帶 field03 與本輪 PID，避免碰到既有名稱。tag 只負責下載，下載後立刻擷取本機 image ID；命令後面一律使用 ID，不虛構 registry digest。

```bash
set -Eeuo pipefail

field03_dir="$(mktemp -d -t field03.XXXXXX)"
field03_keep="field03-keep-$$"
field03_rm="field03-rm-$$"
field03_volume="field03-volume-$$"
field03_volume_ctr="field03-volume-ctr-$$"

field03_cleanup() {
  docker rm -f "$field03_keep" "$field03_rm" "$field03_volume_ctr" >/dev/null 2>&1 || true
  docker volume rm "$field03_volume" >/dev/null 2>&1 || true
}
field03_show_cleanup() {
  printf '若中途停止，請執行：\n'
  printf 'docker rm -f %s %s %s 2>/dev/null || true\n' \
    "$field03_keep" "$field03_rm" "$field03_volume_ctr"
  printf 'docker volume rm %s 2>/dev/null || true\n' "$field03_volume"
  printf '暫存證據仍在：%s\n' "$field03_dir"
}
field03_show_cleanup

docker pull python:3.13-alpine
docker pull alpine:3.21
FIELD03_PY_IMAGE_ID="$(docker image inspect --format '{{.Id}}' python:3.13-alpine)"
FIELD03_ALPINE_IMAGE_ID="$(docker image inspect --format '{{.Id}}' alpine:3.21)"
case "$FIELD03_PY_IMAGE_ID" in sha256:*) ;; *) echo 'python image ID 格式異常' >&2; exit 1 ;; esac
case "$FIELD03_ALPINE_IMAGE_ID" in sha256:*) ;; *) echo 'alpine image ID 格式異常' >&2; exit 1 ;; esac
printf 'python image ID: %s\nalpine image ID: %s\n' \
  "$FIELD03_PY_IMAGE_ID" "$FIELD03_ALPINE_IMAGE_ID" | tee "$field03_dir/image-ids.txt"

if docker run --name "$field03_keep" -i \
    -e FIELD03_RUN_ID=kept \
    "$FIELD03_PY_IMAGE_ID" python - >"$field03_dir/keep-run.log" 2>&1 <<'PY'
from pathlib import Path
import os
import sys

run_id = os.environ["FIELD03_RUN_ID"]
result = Path("/tmp/field03-result.txt")
text = f"run_id={run_id}\n"
result.write_text(text, encoding="utf-8")
assert result.read_text(encoding="utf-8") == text
print(f"wrote {result}", flush=True)
sys.exit(1)
PY
then
  echo '保留組非預期以 exit 0 結束' >&2
  exit 1
fi

test "$(docker inspect --format '{{.State.Status}} {{.State.ExitCode}}' "$field03_keep")" = 'exited 1'
docker diff "$field03_keep" > "$field03_dir/keep.diff"
grep -Fxq 'A /tmp/field03-result.txt' "$field03_dir/keep.diff"
docker cp "$field03_keep:/tmp/field03-result.txt" "$field03_dir/result.keep.txt"
grep -Fxq 'run_id=kept' "$field03_dir/result.keep.txt"

if docker run --rm --name "$field03_rm" -i \
    -e FIELD03_RUN_ID=removed \
    "$FIELD03_PY_IMAGE_ID" python - >"$field03_dir/rm-run.log" 2>&1 <<'PY'
from pathlib import Path
import os
import sys

run_id = os.environ["FIELD03_RUN_ID"]
result = Path("/tmp/field03-result.txt")
text = f"run_id={run_id}\n"
result.write_text(text, encoding="utf-8")
assert result.read_text(encoding="utf-8") == text
print(f"wrote {result}", flush=True)
sys.exit(1)
PY
then
  echo '--rm 組非預期以 exit 0 結束' >&2
  exit 1
fi

if docker inspect "$field03_rm" >/dev/null 2>&1; then
  echo '--rm 組仍存在，請檢查 Docker run 行為' >&2
  exit 1
fi
if docker cp "$field03_rm:/tmp/field03-result.txt" "$field03_dir/result.rm.txt" \
    2>"$field03_dir/rm-cp.err"; then
  echo '--rm 組竟然可以 cp，請檢查名稱或清理時序' >&2
  exit 1
fi
grep -Eiq 'no such container|not found' "$field03_dir/rm-cp.err"

printf '%s\n' '保留組產物：'
cat "$field03_dir/result.keep.txt"
printf '%s\n' '保留組 diff：'
cat "$field03_dir/keep.diff"
printf '%s\n' '--rm 組 cp 錯誤（預期非空）：'
cat "$field03_dir/rm-cp.err"
```

預期觀察是：保留組的狀態為 exited 1，diff 出現 /tmp/field03-result.txt，cp 能拿到 run_id=kept；--rm 組同樣以 1 結束，但在命令返回前被移除，後續 inspect 與 cp 都失敗。本版已核對這組結果；其他環境仍應逐項檢查。

## 本版實測記錄

保留組以 1 退出，`diff` 列出結果檔，`cp` 取到 `run_id=kept`；`--rm` 組退出後 cp 回報 No such container。export 反例留下可寫層標記，沒有 volume 的 marker。專用容器與 volume 已清理。

## 結果解讀：拿到檔案，證明的是「它還在」

保留組取到正確 run ID，表示該檔案在停止容器可讀的檔案範圍內；它支持「不必重啟即可取出這個產物」。它不證明工作已完成、檔案內容已經交易一致，也不表示程序的記憶體、socket 或最後一個尚未 flush 的寫入仍然存在。

若 diff 沒有該路徑但 cp 成功，可能是儲存後端或檔案原本已在映像層，先比較檔案內容與建立時機；不要把沒有 A 硬解讀成「沒有寫」。若 cp 失敗，先核對容器名稱、路徑、掛載與清理時序。只有容器真的保留，才有資格沿這條路追查。

退出碼也只是一個分流線索。正常的應用錯誤、收到 SIGTERM、被 SIGKILL 或被資源限制終止，都可能讓工作沒有完整結果；不能看到非零就斷言是哪一種原因。若產物含交易中的半成品，取出來應標記為 failure artifact，供定位而不是直接送回下游。這個標記能避免「成功取到檔案」被誤讀成「工作成功」。

## 失效反例：export 看得到下層檔案，不代表 volume 被備份

這個短反例只驗證 volume 排除規則，不把它擴成第二套取證流程。容器可寫層根目錄放 layer-A，volume 的 /data 放 volume-B；先用另一個短命 Alpine 容器確認 volume 真的有 B，再匯出停止容器。Docker 文件明說 export 不會匯出 volume，tar 只反映未被 volume 提供的容器檔案系統部分。

```bash
docker volume create "$field03_volume" >/dev/null
docker run --name "$field03_volume_ctr" \
  --mount "type=volume,src=$field03_volume,dst=/data" \
  "$FIELD03_ALPINE_IMAGE_ID" sh -c \
  'printf "volume-B\n" >/data/marker; printf "layer-A\n" >/image-marker'

docker run --rm --mount "type=volume,src=$field03_volume,dst=/data" \
  "$FIELD03_ALPINE_IMAGE_ID" sh -c 'test "$(cat /data/marker)" = volume-B'
docker export --output "$field03_dir/field03-export.tar" "$field03_volume_ctr"
tar -tf "$field03_dir/field03-export.tar" > "$field03_dir/export.list"
grep -Eq '(^|/)image-marker$' "$field03_dir/export.list"
if grep -Eq '(^|/)data/marker$' "$field03_dir/export.list"; then
  echo '非預期：export 包含 volume marker' >&2
  exit 1
fi
```

這個結果只能支持「export 不含該 volume 檔案」。它不是資料備份、不是一致性快照，也不能替代 volume 專用的備份方法。不要因為 tar 裡有 /data 目錄，就說 B 已經被保存。

## 收尾與撤回

正常結束時，明確移除本輪的 field03-* 容器與專用 volume；暫存目錄故意保留，供核對 image ID、diff、cp 產物與 export 清單。確認 result.keep.txt 後，如果要人工保留證據，請先把它複製到明確位置；正式環境只收指定失敗產物，避免把秘密整批帶走。

```bash
field03_cleanup
printf '容器與 volume 已清理；證據目錄保留：%s\n' "$field03_dir"
```

若要撤回實際故障排查，恢復原本是否使用 --rm 的選擇，不要為了方便永遠保留退出容器。反覆需要同一類產物時，才把結果檔與退出碼納入正式的失敗產物收集；清理規則仍應以容器名稱、工作 ID 或標籤精準指定。

把原始輸出複製到[實驗紀錄卡模板](appendix-b-record.md)後，再手動刪除這個明確目錄；本章只保留「停止後取檔」這一個主動作。
