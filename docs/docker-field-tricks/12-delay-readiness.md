# 12｜偶爾才壞，故意讓依賴慢一點

**現有 Compose 條件；自訂 delay 與探針。** 已完成本版 Desktop Linux／arm64 核心實驗；適用環境與未驗邊界見[證據附錄](appendix-d-evidence.md)。

## 現場症狀：第二次成功，把第一次的線索蓋掉了

第一次 `up`，client 說連線失敗；再執行一次就好了。你在啟動腳本加 `sleep 5`，本機似乎再也沒出事。到了 CI，磁碟較忙，五秒又不夠。

這種問題難在時間窗口短，而且重試會改變條件：映像已下載、快取已暖、資料庫可能已完成初始化。第二次成功不能指出第一輪失敗原因。與其反覆碰運氣，可以故意把「程序已啟動，但還沒準備好」拉長，讓它穩定留在畫面上。

本章是依官方機制設計的故障注入練習，沒有冒用某個團隊的事故經驗。延遲變數 `FIELD_DELAY` 是我們新增的程式功能，Docker 沒有替所有應用提供同名的就緒開關。

## 小招式：讓錯誤有足夠時間被看見

先保留只請求一次的 client，讓依賴程式先接收 HTTP，過一段時間才回覆 ready。比較兩種入口條件：`service_started` 與 `service_healthy`。前者只要求容器啟動；後者等待你定義的 healthcheck 通過。[Compose 啟動順序](https://docs.docker.com/compose/how-tos/startup-order/)

這裡刻意不用自動重試，因為重試會讓「第一次請求發生在哪個時點」更難判讀。等定位完啟動關係，再回到正式應用設計重連和重試。

## 必要原理：三個時點不能混成一個

| 時點 | 觀察方式 | 仍不能推論的事 |
|---|---|---|
| 程序開始執行 | 啟動紀錄、PID | 尚不能知道 port 是否已 listen |
| HTTP 可以回應 | 收到狀態碼 | 503 也算收到回應，但不能做業務工作 |
| readiness 條件成立 | `/ready` 回 200 | 下一秒仍可能故障 |

如果探針只是檢查 PID 存在，即使 healthy 顯示綠色，也可能只測了表格第一列。探針要貼近 client 真正需要的前提，卻又不能昂貴到自己變成負載來源。本練習只測一個人造 ready 條件，沒有假裝代表資料庫交易與遷移全部完成。

## 親手實驗：同一個服務，兩種啟動門檻

在 Bash 的新終端建立目錄。映像 tag 只用於首次拉取，Compose 之後固定 repository digest。需要同一個可用的 Linux daemon；不對主機發布 port，不連真實資料庫。

```bash
field_dir=$(mktemp -d "${TMPDIR:-/tmp}/field12.XXXXXX")
cd "$field_dir"
docker pull python:3.13-alpine
export FIELD_PYTHON=$(docker image inspect python:3.13-alpine \
  --format '{{index .RepoDigests 0}}')
cat > server.py <<'PY'
import os
import signal
import sys
import time
from http.server import BaseHTTPRequestHandler, HTTPServer


def ready_status(elapsed, delay):
    return 200 if elapsed >= delay else 503


class Handler(BaseHTTPRequestHandler):
    def do_GET(self):
        elapsed = time.monotonic() - self.server.started
        status = ready_status(elapsed, self.server.delay)
        self.send_response(status)
        self.end_headers()
        self.wfile.write(f"status={status} elapsed={elapsed:.3f}\n".encode())


if __name__ == '__main__':
    signal.signal(signal.SIGTERM, lambda *_: sys.exit(0))
    assert ready_status(0, 5) == 503
    assert ready_status(5, 5) == 200
    server = HTTPServer(('0.0.0.0', 8000), Handler)
    server.delay = float(os.environ.get('FIELD_DELAY', '5'))
    assert 0 <= server.delay <= 30
    server.started = time.monotonic()
    print(f"listening delay={server.delay}", flush=True)
    server.serve_forever()
PY
cat > client.py <<'PY'
import time
import urllib.request

print(f"request-at={time.time():.3f}", flush=True)
with urllib.request.urlopen('http://dep:8000/ready', timeout=2) as response:
    body = response.read().decode()
    assert response.status == 200
    print(body, end='')
PY
cat > compose.yaml <<'YAML'
services:
  dep:
    image: ${FIELD_PYTHON:?set FIELD_PYTHON}
    command: [python, -u, /lab/server.py]
    volumes: [".:/lab:ro"]
    environment:
      FIELD_DELAY: ${FIELD_DELAY:-5}
    healthcheck:
      test: [CMD, python, -c, "import urllib.request; urllib.request.urlopen('http://127.0.0.1:8000/ready', timeout=1).read()"]
      interval: 1s
      timeout: 2s
      retries: 20
  client:
    image: ${FIELD_PYTHON:?set FIELD_PYTHON}
    command: [python, -u, /lab/client.py]
    volumes: [".:/lab:ro"]
    depends_on:
      dep:
        condition: ${FIELD_CONDITION:-service_started}
networks:
  default:
    internal: true
YAML
```

先看一次配置渲染：

```bash
FIELD_DELAY=5 FIELD_CONDITION=service_started \
  docker compose -p field12 config
```

接著把同一段操作各做三輪，依序設 `FIELD_DELAY=0`、`5`、`10`，每個延遲再比較兩種條件。下列先展示一輪；每輪都 `down`，才不會偷偷沿用已 ready 的依賴。

```bash
export FIELD_DELAY=5
export FIELD_CONDITION=service_started
if docker compose -p field12 up -d; then
  field_client=$(docker compose -p field12 ps -a -q client)
  docker wait "$field_client"
  docker compose -p field12 logs --timestamps --no-color
  docker inspect "$field_client" --format '{{json .State}}'
else
  docker compose -p field12 logs --timestamps --no-color
fi
docker compose -p field12 down
```

`docker wait` 印出容器退出碼，應記錄那個值，不能把 CLI 本身成功送出等待命令視為 client 成功。這個 client 只有一次兩秒上限的請求，故不會無限等待網路。健康門檻失敗也有 retries 上限；若服務根本沒跑起來，先閱讀 log，不要不斷加長重試時間。

再改成 `export FIELD_CONDITION=service_healthy`，重跑同一區塊。所有狀態碼、時間與退出碼請填進[紀錄卡](appendix-b-record.md)；本版取得的結果另外列在下方，不填入你的空白紀錄卡。

## 本版實測記錄

每個延遲與條件組合各跑三次；每輪都移除 project 重新建立：

| 注入延遲 | started 成功次數 | healthy 成功次數 |
|---|---:|---:|
| 0 秒 | 3/3 | 3/3 |
| 5 秒 | 0/3 | 3/3 |
| 10 秒 | 0/3 | 3/3 |

延遲 10 秒時，另將探針改成只執行 `pass`；client 再次失敗，退出碼為 1。這 19 次觀察支持本 fixture 的啟動門檻假設，不提供統計上的事故率估計。已還原正確探針並清理 project。

## 結果解讀：延遲越大越容易失敗，仍只是線索

本章對照的假設是：started 組可能在依賴 listen 前得到拒絕連線，或在 listen 後、ready 前得到 503；healthy 組應在探針成功後才發出 client 請求，取得 200。零延遲不保證 started 永遠成功，因為「開始程序」到「綁定 socket」仍有時間差。

若兩組都失敗，要先分清 DNS、port、映像啟動和探針語法；不能把所有錯誤都歸為 readiness。若 started 組也都成功，檢查 client 啟動是否比預想晚。環境太慢可能反而蓋住競態，因此保留實際請求時間及 server 的 elapsed，比只抄成功率有用。

這個對照能支持啟動門檻改變了首次請求時機，不能證明正式服務全年可用，也不能算正式延遲的 benchmark。你故意加入的等待就是實驗控制量，不是效能退化的證據。

## 失效反例：假的健康，仍是假的

保留 `FIELD_DELAY=10`，只把測試配置的 healthcheck 暫改為 `test: [CMD, python, -c, "pass"]`。這個探針幾乎立即成功，卻完全不看 `/ready`。若 client 又得到 503，反例表明 `service_healthy` 的價值取決於探針內容，而不只是 YAML 裡寫了這個字。

這份錯誤探針只能留在練習副本，完成後還原原來那一行。另一個邊界是運行中故障：即使啟動時等到 healthy，依賴之後也可能重啟或斷線。單次啟動 gate 不會替應用提供永久連線保證。

代價也很具體：啟動等候增加，探針有負載和維護成本，錯誤探針可能讓部署卡住。值得正式化的是有意義且有上限的條件，不能只把固定 sleep 改名叫健康檢查。

## 收尾與撤回

```bash
docker compose -p field12 down
unset FIELD_DELAY FIELD_CONDITION FIELD_PYTHON
printf '測試程式保留於 %s\n' "$field_dir"
```

這裡沒有資料 volume，無需 `down -v`。回到正式專案時先移除人造 delay，再決定 readiness 條件；如果問題發生在運行中，下一個工作是應用重連策略。本章刻意把那部分留下，讓這次的小實驗只回答啟動時序。
