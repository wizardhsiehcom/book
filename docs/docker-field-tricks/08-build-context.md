# 08｜找不到檔案，先換 build 的那個點

**現有 build 功能；需重新建置。** 已完成本版 Desktop Linux／arm64 核心實驗；適用環境與未驗邊界見[證據附錄](appendix-d-evidence.md)。

## 現場症狀

你把 Dockerfile 放進 `docker/`，從那裡執行 build，`COPY marker.txt /marker.txt` 卻說檔案不存在。直覺通常是把 `../marker.txt` 填進 Dockerfile，或把所有檔案搬到 Dockerfile 旁邊。先停一下：命令最後那個位置參數是 build context；`-f` 或 `--file` 才是 Dockerfile 的位置。兩者可以是不同目錄。

這個差異很小，卻會把錯誤分成兩類。context 根本沒有檔案時，builder 沒有權限讀它，改 `COPY` 路徑也救不了；檔案在 context 內但被 `.dockerignore` 排除時，結果同樣是缺檔。只有在兩者都正確後，才值得查大小寫、工作目錄或檔案本身。

## 小招式：先固定 context，再看檔案集合

把最小專案分成根目錄的 marker 與子目錄的 Dockerfile。A 組故意把 `docker/` 當 context，讓錯誤清楚出現；B 組仍用同一份 Dockerfile 和同一個 base digest，只把 context 改為專案根目錄。成功後，再加一條錯誤的 `.dockerignore`，確認「context 有檔案」和「檔案未被排除」是兩個判斷。

不要用 `-v`、`../` 或把整個工作區複製來猜。命令中的 `-f "$ROOT/project/docker/Dockerfile" "$ROOT/project"` 已經把兩個輸入明確寫出來。實際專案要放大 context 時，再用 ignore 排除依賴快取、版本控制資料與測試產物；先證明必要檔案仍在集合內。

## 必要原理

Docker build 的 context 是 builder 可以存取的檔案集合。對本地目錄而言，指定的目錄及其子目錄才是可用範圍；`COPY` 和 `ADD` 不能越過這個邊界。Dockerfile 不必位在 context 根目錄，`-f` 只是告訴 CLI 從哪裡讀建置指令。這就是「Dockerfile 位置」與「建置輸入」可以分離的原因。

`.dockerignore` 會在 context 送給 builder 前依規則移除檔案。檔案即使真的存在主機上，只要被 ignore，對這次 build 就像不存在。例外規則 `!` 的最後匹配者優先；一條寬的 `*.txt` 後面沒有把 marker 加回來，仍會讓 `COPY marker.txt` 失敗。若 Dockerfile 在子目錄，也可以有同名 Dockerfile 專用 ignore 檔；本章先只用根目錄 `.dockerignore`，避免把兩層規則混在一起。

BuildKit 可能按需要載入 context 中的檔案，plain log 看到的傳輸大小不應被解讀成「所有檔案都已完整打包」。本章要驗證的是檔案是否在可用集合內，不拿傳輸數字當效能結論。若 builder 是遠端 daemon，context 由執行 build 的 client 送出，路徑與權限也要按那個邊界判斷。

### 先把命令拆成三個問題

看到失敗命令時，先在同一個 shell 記下目前目錄、`-f` 的值和最後一個位置參數。`pwd` 只回答 client 從哪裡發命令；它不會改變 context。`-f` 只回答 Dockerfile 從哪裡讀；它不會把上層目錄加入輸入。最後的位置參數才是要交給 builder 的檔案集合。三者混在一起時，搬檔案看似有效，實際上只是偶然換了 context。

再把 `COPY` 左邊的路徑改寫成「相對於 context 根的路徑」來讀。`COPY docker/marker.txt` 會找 context 根下的 `docker/marker.txt`；它不是從 Dockerfile 所在目錄開始找。若這個相對路徑在本機存在，仍要再問它是否被根目錄 `.dockerignore` 或 Dockerfile 專用 ignore 排除。只有這三個答案都對，才進入檔案名稱、權限與內容的排錯。

這種拆法也能避免把 context 放大當成萬用修法。放大後的成功只證明檔案被納入輸入，未說明它應該被納入正式 image。先用一個 marker 做 A/B，再逐項加回真正需要的 lockfile、source 或設定模板，能把輸入範圍維持在可審查的大小。

## 完整可照做實驗：A/B 只換 context

這個 fixture 不碰現有專案。它會先以 `alpine:3.21` 作為下載起點，取出 RepoDigest 作固定 `FROM`；不要把本機 image `.Id` 填入 `FROM`，因為 BuildKit driver 不一定把裸 ID 當成可解析的 image reference。

```bash
set -Eeuo pipefail
ROOT="$(mktemp -d "${TMPDIR:-/tmp}/field08.XXXXXX")"
printf 'fixture=%s\n' "$ROOT"

docker --version
docker buildx version
docker compose version
if ! docker info >/dev/null 2>&1; then
  printf '%s\n' 'Docker daemon 不可用；本章操作稿到此為止，未宣稱實驗成功。' >&2
  exit 2
fi

mkdir -p "$ROOT/project/docker"
docker pull alpine:3.21
BASE_REF="$(docker image inspect alpine:3.21 --format '{{index .RepoDigests 0}}')"
BASE_ID="$(docker image inspect alpine:3.21 --format '{{.Id}}')"
test -n "$BASE_REF"
printf 'base_ref=%s\nbase_id=%s\n' "$BASE_REF" "$BASE_ID" \
  | tee "$ROOT/base-record.txt"

cat > "$ROOT/project/marker.txt" <<'EOF'
field08-context-A
EOF

cat > "$ROOT/project/docker/Dockerfile" <<EOF
FROM $BASE_REF
COPY marker.txt /marker.txt
CMD ["cat", "/marker.txt"]
EOF

set +e
docker buildx build --load --progress=plain \
  -f "$ROOT/project/docker/Dockerfile" \
  -t field08:context-missing "$ROOT/project/docker" \
  2>&1 | tee "$ROOT/build-context-missing.log"
BAD_CONTEXT_STATUS=$?
set -e
test "$BAD_CONTEXT_STATUS" -ne 0
printf 'A（子目錄 context）預期失敗，status=%s\n' "$BAD_CONTEXT_STATUS"

docker buildx build --load --progress=plain \
  -f "$ROOT/project/docker/Dockerfile" \
  -t field08:context-root "$ROOT/project" \
  2>&1 | tee "$ROOT/build-context-root.log"
docker image inspect field08:context-root \
  --format 'B image={{.Id}} repo={{json .RepoDigests}}'
test "$(docker run --rm field08:context-root)" = 'field08-context-A'

cat > "$ROOT/project/.dockerignore" <<'EOF'
marker.txt
EOF
set +e
docker buildx build --load --progress=plain \
  -f "$ROOT/project/docker/Dockerfile" \
  -t field08:ignored "$ROOT/project" \
  2>&1 | tee "$ROOT/build-ignored.log"
BAD_IGNORE_STATUS=$?
set -e
test "$BAD_IGNORE_STATUS" -ne 0
printf 'A/B 之外的 ignore 反例預期失敗，status=%s\n' "$BAD_IGNORE_STATUS"

rm "$ROOT/project/.dockerignore"
docker buildx build --load --progress=plain \
  -f "$ROOT/project/docker/Dockerfile" \
  -t field08:context-restored "$ROOT/project" \
  2>&1 | tee "$ROOT/build-context-restored.log"
test "$(docker run --rm field08:context-restored)" = 'field08-context-A'
docker image inspect field08:context-restored --format 'restored={{.Id}}'
```

兩個預期失敗都包在 `set +e` 區段，並以非零 status 作 assertion；非零只是第一關，還需閱讀 log 確認是 COPY 找不到 marker；其他失敗不能算命中，後面的 B 組也需自行通過。請把此區塊存成獨立 Bash 腳本後執行，或在新 shell 逐段執行；`ROOT` 和四份 plain log 會刻意保留，方便把原始證據自存。若 daemon 不可用，腳本以 status 2 結束，不能讓自動化把「沒有測到」當成通過。`field08:context-root` 和 `field08:context-restored` 才是成功後可以 inspect 或 run 的 tag。

## 本版實測記錄

子目錄 context 在 COPY 邊界失敗，根 context 成功讀出 `field08-context-A`；加入 ignore 後失敗，移除 ignore 後恢復。四份 plain log 已保存，成功建立的兩個 tag 已清理。

## 結果解讀

若 A 組在 `COPY` 階段找不到 `marker.txt`，B 組印出 `field08-context-A`，最小結論是 context 邊界造成差異。若 B 組也失敗，先查看 `-f` 指向、檔名大小寫與 `.dockerignore`，不要把整個 repo 的其他問題一起歸因。ignore 反例恢復後成功，則再縮小到規則；這不代表原專案的 ignore 已經安全。

記錄兩次成功 build 的 image ID、`BASE_REF`、plain log 與 `docker run` 輸出。A/B 的固定條件是同一 base digest、同一 marker、同一 Dockerfile；變動只有 context 或 ignore。若換成遠端 builder，還要記錄實際 builder 名稱與平台，因為主機上「存在」的檔案不等於 builder 可讀。

可以把判讀濃縮成四格：子目錄 context 失敗、根 context 成功，指向 context 邊界；根 context 仍失敗而 ignore 反例也失敗，先看 Dockerfile 或檔名；根 context 成功、加 ignore 後失敗，指向排除規則；所有 build 都在 daemon 連線前失敗，則尚未測到 context。這四格只描述本 fixture 的差異，不能直接替原專案判定套件、工作目錄或 runtime 掛載。

若成功 image 的 tag 已被同名舊 image 佔用，先看 `docker image inspect` 的 ID，再以本次 build 的 plain log 對照；不要只看 tag 名稱就說 B 組是新結果。對固定 digest 的 fixture，重新建置時 base 不應因 tag 漂移而改變；若 `BASE_REF` 變了，應把它記成新的 A/B 批次，不要把兩批輸出放在同一張表。

實際 repo 常同時有 `Dockerfile.dev`、`Dockerfile.test` 等檔案。先確認命令是用 `-f` 指定哪一份，再確認它所對應的 ignore 規則；不要從檔名推測 CLI 會自動選對。診斷成功後，才把最短的命令寫回專案文件，並保留一個能在無 daemon 時辨認「尚未測試」的前置檢查。

## 失效反例

若把 context 放在 repo 根目錄，可能不必要地送入大型 `node_modules`、測試輸出或機密設定；這會放大傳輸、掃描與誤帶檔案的成本。此時 `.dockerignore` 是縮小輸入的工具，不是用來掩蓋缺檔的修補。規則寫得太寬，會讓必要的 lockfile 或 marker 消失；規則寫得太窄，則把不該進 build 的資料交給 builder。

另一個常見誤判是把 Dockerfile 裡的相對路徑當成主機 shell 的相對路徑。`COPY marker.txt` 是相對於 context 根，不是相對於 Dockerfile 所在的 `docker/`。若需求是同時使用多個來源，後續可查 named context；本章不把它混進第一個診斷動作。

## 收尾與撤回

確認已把 `base-record.txt`、四份 plain log、image ID 和輸出自存後，只移除本章成功建立的 image tag：

```bash
docker image rm field08:context-root field08:context-restored
```

預期失敗的 tag 可能在執行前就被別的 image 佔用，本章不碰它們；若成功 tag 碰到既有同名 image，先用 `docker image inspect` 核對 ID，再決定是否移除。獨立 fixture 目錄與 log 不要由腳本自動刪除，待 [實驗紀錄卡](appendix-b-record.md) 所需紀錄已保存後，再以明確的絕對路徑手動清理。若是在共用 builder 上操作，不要用全域 prune 代替撤回。把原專案的 `-f` 與 context 命令恢復，保留合理的 `.dockerignore`；只有反覆遇到同一類問題，才把這個檢查收進既有 build 腳本。下一章可用相同的 digest 固定方式，繼續查產物在哪個 stage 消失：[09-stop-at-stage.md](09-stop-at-stage.md)。

## 來源

- Docker Docs，[Build context](https://docs.docker.com/build/concepts/context/)
- Docker Docs，[docker buildx build](https://docs.docker.com/reference/cli/docker/buildx/build/)
- 本章來源與適用範圍：[證據附錄](appendix-d-evidence.md)
