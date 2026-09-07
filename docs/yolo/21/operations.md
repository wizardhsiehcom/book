# 多鏡頭公平排程、健康訊號與故障手冊

多路影像不是「再開幾個執行緒」。Ultralytics [Track 模式](https://docs.ultralytics.com/modes/track/) 的追蹤狀態綁在**單一路徑的連續幀**上；跨鏡頭共用同一顆 YOLO 實例，會把 tracker 與緩衝交纏。簡單、可核對的作法是：**每個 worker 各自持有 YOLO**。進階選項才是**序列化共用推論**，鏡頭只保留自己的 tracker 狀態——這不是全域禁令「禁止共用」，而是把共享面縮到推論鎖，並用測試證明慢路不會拖死全場。跨鏡頭 batch 可以做，但必須有 **max-wait 截止**：等到齊或逾時就送，空槽不佔位。

健康指標**每路獨立、單調**：`last_captured`、`last_processed`、drop、reconnect、model errors、queue age。外部 `capture_timestamp` 只有在鏡頭與主機時鐘對齊時才可當延遲依據；否則只用本機單調時鐘。

## 排程契約（無執行緒、無硬體宣稱）

下列示範只證明**公平與跳過空槽**，不宣稱即時取像。每路只留**最新一格**（deque `maxlen=1`），round-robin 掃一圈：有幀就服務並清空，空路跳過。慢路沒資料時不得阻塞其他鏡頭。

```python
from collections import deque

def round_robin_latest(slots: dict[str, deque], order: list[str]) -> list[str]:
    served = []
    for cam in order:
        q = slots[cam]
        if not q:
            continue
        q.popleft()  # 只處理最新；舊幀已被 maxlen=1 擠掉
        served.append(cam)
    return served

def demo() -> None:
    slots = {
        "cam_a": deque([b"a1"], maxlen=1),
        "cam_b": deque(maxlen=1),           # 慢／空
        "cam_c": deque([b"c9"], maxlen=1),
    }
    order = ["cam_a", "cam_b", "cam_c"]
    served = round_robin_latest(slots, order)
    ready = [c for c in order if True]  # 契約：就緒者必被服務
    assert served == ["cam_a", "cam_c"]
    assert "cam_b" not in served
    assert all(len(slots[c]) == 0 for c in served)
    print("served", served)

if __name__ == "__main__":
    demo()
```

讀者在 Linux／macOS 上執行：`python3 rr_latest.py`，應印出 `served ['cam_a', 'cam_c']`。這只驗證排程；真實取像另見 [stream-ingestion.md](stream-ingestion.md)、背壓見 [backpressure.md](backpressure.md)、總覽 [../22/index.md](../22/index.md)。

## Worker 生命週期

- **Capture 擁有者**負責 `release()`；推論執行緒不得關鏡頭。
- Thread 設為 **non-daemon**，停止時 `join(timeout)`；逾時仍 `is_alive()` 則標 **failure**，不得假裝已清乾淨。
- 後端讀取加 **read timeout**；若函式庫可能永久阻塞，用**行程隔離**，不要在主程序空等。
- **重連**：丟棄 pending 舊幀、重置該路 tracker、換新 **session UUID**。Backoff 只在**持續健康**後歸零，不是「socket 一開就 reset」。
- 記錄錯誤時**不得把含憑證的 URL 與 raw exception 一併寫進 log**；遮罩 userinfo，只留 host／錯誤碼。

## 故障注入（安全步驟，不灌滿系統碟）

| 故障 | 安全作法 | 可接受結果 | 回滾擁有者 |
|------|----------|------------|------------|
| disconnect | 對**複本**檔或本機 loop 停寫，勿打生產 URL | drop↑、reconnect↑、session UUID 變、舊幀不進模型 | 測試行程停寫；worker `release` |
| slow producer | 複本輸入降 fps，或 mock 讀取 sleep | 該路 queue age↑；其他路 round-robin 仍被服務 | 測畢恢復原檔速率 |
| model error | mock predict 拋受控例外（無真實權重損毀） | model errors↑；該路標 unhealthy，不拖死 sibling | 測畢換回正常 mock |
| disk quota | **mocked writer** 回 ENOSPC；禁止真把系統碟寫滿 | 寫入失敗計數↑；不保證「已刪暫存」 | mock 卸載；人工確認未留下大檔 |

**沒有 false-cleanup 保證**：`join` 逾時、行程殘留、鏡頭 fd 未關，一律當 failure 給值班，而不是日誌寫「已釋放」。Linux 可用 `lsof`／`ps` 核對殘留；macOS 同樣用 `ps` 與 Activity Monitor 對 thread／行程，不把示範排程誤當成硬體吞吐數字。
