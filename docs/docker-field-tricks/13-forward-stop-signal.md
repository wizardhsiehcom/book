# 13｜stop 總等滿？看誰擋在 PID 1

**修改 wrapper；測試用唯讀掛載，正式映像通常需重建。** 已完成本版 Desktop Linux／arm64 核心實驗；適用環境與未驗邊界見[證據附錄](appendix-d-evidence.md)。

## 現場症狀：縮短 timeout，只是提早強殺

每次停止服務都等到寬限時間用完，部署因此慢了一截。你把 timeout 改短，畫面很快回到提示符號，卻發現最後一筆工作沒有寫完。這個改善可能只代表強殺提早發生。

先不要問「怎樣讓 stop 更快」，改問「停止訊號到誰手裡，清理流程跑完沒有」。容器的主程序可能是一層 shell，真正的程式是它的 child。外面看到一個容器，裡面仍有程序關係。

## 小招式：讓 wrapper 的最後一步成為 exec

如果 wrapper 做完初始化後只需要啟動一個主程式，可以把最後的啟動改成 `exec "$@"`。exec 取代目前的 shell 程序，應用接手原位置。Dockerfile 的 shell form、exec form 及 wrapper 是否轉送訊號，會影響應用能否收到停止訊號。[Dockerfile ENTRYPOINT 文件](https://docs.docker.com/reference/dockerfile/#entrypoint)

這不是把每個 `sh` 刪掉。初始化、權限準備仍可能需要 shell；要檢查的是最後交棒。先在副本看 PID 鏈，再觀察 cleanup 標記，才知道改動有沒有解決原問題。

## 必要原理：訊號到達與清理完成是兩件事

停止容器通常先向主程序送出 SIGTERM，超過寬限時間再用 SIGKILL；映像或建立容器的設定可以覆寫停止訊號與時間。下文明確使用 SIGTERM 和三秒，不依賴平台預設。[docker stop](https://docs.docker.com/reference/cli/docker/container/stop/)

本章要比較的程序關係如下：

```text
A：PID 1 shell（忽略 TERM） → Python child（有 cleanup）
B：PID 1 Python（有 cleanup，shell 已被 exec 取代）
C：PID 1 Python（故意忽略 TERM，作反例）
```

A 的 child 雖然知道怎麼清理，卻可能沒收到訊號；C 直接收到訊號，卻故意不處理。兩種問題需要不同修法。`--init` 能幫忙處理程序回收與訊號轉送，但不能替錯誤的應用補上清理邏輯，也不能保證穿透每一層忽略訊號的 wrapper。[Docker run](https://docs.docker.com/reference/cli/docker/container/run/)、[Tini 原始專案](https://github.com/krallin/tini)

## 親手實驗：不要只量時間，留下完成標記

在 Bash 新終端建立獨立工作目錄。這個程式只寫自己的 `/tmp` 標記，不接真實佇列或檔案服務。

```bash
field_dir=$(mktemp -d "${TMPDIR:-/tmp}/field13.XXXXXX")
cd "$field_dir"
docker pull python:3.13-alpine
field_image=$(docker image inspect python:3.13-alpine --format '{{.Id}}')
cat > app.py <<'PY'
import os
from pathlib import Path
import signal
import time


def finish(signum, frame):
    Path('/tmp/cleanup-done').write_text('cleanup-done\n')
    print('cleanup-done', flush=True)
    raise SystemExit(0)


if __name__ == '__main__':
    signal.signal(signal.SIGTERM,
                  signal.SIG_IGN if os.environ.get('IGNORE_TERM') == '1'
                  else finish)
    print(f'pid={os.getpid()} ppid={os.getppid()}', flush=True)
    Path('/tmp/ready').write_text('ready\n')
    while True:
        time.sleep(0.1)
PY
cat > blocked.sh <<'SH'
#!/bin/sh
trap '' TERM
"$@" &
wait
SH
cat > direct.sh <<'SH'
#!/bin/sh
exec "$@"
SH

docker run -d --name field13-a --stop-signal SIGTERM \
  --mount "type=bind,src=$field_dir,dst=/lab,readonly" \
  "$field_image" sh /lab/blocked.sh python -u /lab/app.py
docker run -d --name field13-b --stop-signal SIGTERM \
  --mount "type=bind,src=$field_dir,dst=/lab,readonly" \
  "$field_image" sh /lab/direct.sh python -u /lab/app.py
docker run -d --name field13-c --stop-signal SIGTERM -e IGNORE_TERM=1 \
  --mount "type=bind,src=$field_dir,dst=/lab,readonly" \
  "$field_image" sh /lab/direct.sh python -u /lab/app.py
```

A 的 shell 故意忽略 TERM，避免某些 shell 對最後命令的最佳化把測試變成另一種情境。child 的 Python 會明確安裝自己的 handler，所以不是靠繼承的忽略狀態碰運氣。

在停止前，確定三個程式都已安裝 handler。這段最多檢查十次，沒有 ready 就停止實驗查 logs，不可把提早 stop 造成的結果混進來：

```bash
field_ready=yes
for field_name in field13-a field13-b field13-c; do
  field_seen=no
  for field_try in 1 2 3 4 5 6 7 8 9 10; do
    if docker exec "$field_name" test -f /tmp/ready; then
      field_seen=yes
      break
    fi
    sleep 1
  done
  test "$field_seen" = yes || field_ready=no
  docker exec "$field_name" ps -o pid,ppid,args
  docker logs "$field_name"
done
printf '全部 ready：%s\n' "$field_ready"
if [ "$field_ready" != yes ]; then
  echo '停止這一輪：尚未全部 ready，先查 logs' >&2
  exit 1
fi
```

只有最後顯示 yes 才繼續。`ps` 觀察的是容器內 PID，與主機 `docker top` 的數字不要直接混比。接著每個容器停止一次：

```bash
for field_name in field13-a field13-b field13-c; do
  time docker stop --timeout 3 "$field_name"
  docker logs "$field_name"
  docker inspect "$field_name" --format '{{json .State}}'
  if docker cp "$field_name:/tmp/cleanup-done" "./$field_name.txt"; then
    cat "./$field_name.txt"
  else
    echo "${field_name}：沒有取到 cleanup 標記，請閱讀 cp 錯誤"
  fi
done
test "$(cat field13-b.txt)" = cleanup-done
test ! -e field13-a.txt
test ! -e field13-c.txt
```

失敗的 cp 預期出現在沒有標記的組別，但仍要排除權限、連線或路徑輸入錯誤。`time` 包含 CLI 通訊成本，不能把毫秒差異都歸到應用 shutdown。這裡只需分辨接近寬限時間的等待與成功清理後退出。

## 本版實測記錄

固定三秒停止寬限，本輪結果為：

| 組別 | CLI stop 耗時 | 退出碼 | cleanup 標記 |
|---|---:|---:|---|
| A：shell 不轉送 | 3.126 秒 | 137 | 無 |
| B：exec＋應用 handler | 0.136 秒 | 0 | 有 |
| C：應用忽略 TERM | 3.137 秒 | 137 | 無 |

A/C 的 `OOMKilled` 都為 false；PID 鏈、State 與標記已一起核對。這是單輪功能性對照，非一般 shutdown 效能排名；三個測試容器已移除。

## 結果解讀：快了，而且真的做完了嗎？

預期 B 有 cleanup 標記並較快退出；A 和 C 可能等到強殺且沒有標記。這些判準用來解讀下一次重跑，本版實際結果見本章紀錄。至少一起保留 PID 鏈、停止耗時、State 與標記，別挑其中最好看的那一項。

如果 B 很快退出卻沒有標記，檢查是否在 handler 安裝前停止，或程式自己先因例外退出。若有標記但仍拖很久，可能另外有非 daemon thread、子程序或清理後未退出的路徑。把「收到訊號」「清理完成」「程序結束」分開，才不會用一個退出碼概括所有事情。

退出碼 137 也不足以斷言 OOM。強殺同樣可能得到這種結果，要配合 `OOMKilled`、停止時機與其他證據。本練習沒有施加記憶體壓力，不能拿它寫成 OOM 診斷案例。

## 失效反例與代價：exec 之後，shell 不再替你收尾

C 就是本章的反例：訊號交到應用，應用仍可忽略它。還有更隱蔽的轉移成本：若舊 wrapper 原本在主程式結束後執行清理，改成 exec 後，那些後續行永遠不會執行。把它們留在檔案裡，看起來程式都還在，實際流程卻已經不同。

多子程序時也不能直接套單程序解法。你可能需要轉送到程序群組、等待子程序退出及處理孤兒程序；Tini 預設轉送給直接 child，`-g` 是額外的群組模式，不能假設 Docker 的 `--init` 自動包含你的所有需求。值得把這些需求留到真的有多程序時再設計。

這次改法省掉等滿 timeout 的時間，成本轉移到應用必須正確處理自己的生命週期。成功標記只是教學替身；真實服務要查工作是否重送、資料是否落盤及最後回應是否完成。

## 收尾與撤回

```bash
docker rm field13-a field13-b field13-c
printf '保留 wrapper 與紀錄於 %s\n' "$field_dir"
```

若前面尚未完成 stop，先對本輪名稱停止，再移除。正式採用時保留可回復的舊映像及 wrapper，將「收到 TERM 後完成最小清理」納入一次可重跑的檢查。不要只把本書的文字標記搬進生產程式就宣告驗收；標記必須放在實際重要工作完成之後。

遇到需要先保留故障產物的情境，可回看[停止後取檔](03-copy-after-exit.md)；整理整次判斷時使用[實驗紀錄卡](appendix-b-record.md)。
