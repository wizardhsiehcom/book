# TCP 視覺故事：第一手來源核對

查詢日期：2026-09-28（Asia/Taipei）。查閱 RFC 9293 與 Python 3.14.7 官方文件；以下以 TCP `SOCK_STREAM` 為範圍；EOF 判讀假設 `recv` 的接收上限為正數，不含 `recv(0)`。本次現行文件不改變原書 Python 3.13 的實驗基線。

| 主張 | 第一手來源（節／精確 URL） | 教學限制 |
|---|---|---|
| `send()` 可只送出部分位元組；`sendall()` 成功時會繼續到所有輸入資料都送出，錯誤時則無法得知已送出多少。這表示本端 socket/TCP 呼叫處理完資料，不表示對端應用已讀取或處理。 | [Python `socket.send()`](https://docs.python.org/3/library/socket.html#socket.socket.send)、[Python `socket.sendall()`](https://docs.python.org/3/library/socket.html#socket.socket.sendall)、[Socket HOWTO：Using a Socket](https://docs.python.org/3/howto/sockets.html#using-a-socket)；[RFC 9293 §3.9.1.2 Send](https://www.rfc-editor.org/rfc/rfc9293.html#section-3.9.1.2) | RFC 說 TCP 可排隊處理 SEND，且本端可能先回覆本地成功、遠端 TCP 尚未 ACK。把「成功」講成本端交付／排隊結果；不可當作遠端應用或業務回條。`sendall()` 遇錯也可能已有部分資料送出。 |
| TCP 提供可靠、有序的 byte stream；TCP segment、一次 `send`／write 與一次 `recv`／read 的邊界不必一致。Python `recv(bufsize)` 每次最多回傳指定上限，程式須累積資料。 | [RFC 9293 §2.2 Key TCP Concepts](https://www.rfc-editor.org/rfc/rfc9293.html#section-2.2)、[§3.7 Segmentation](https://www.rfc-editor.org/rfc/rfc9293.html#section-3.7)；[Python `socket.recv()`](https://docs.python.org/3/library/socket.html#socket.socket.recv)、[Socket HOWTO：Using a Socket](https://docs.python.org/3/howto/sockets.html#using-a-socket) | 切段模型只是可能的教學輸入；不要暗示真實 socket 會固定按動畫指定的大小回傳。只知道送 40 bytes、首次收到 11 bytes，不能據此判定訊息已收齊或其餘資料的去向。 |
| TCP 不提供訊息結束標記；PSH 也不是記錄／訊息分隔符。應用協定需自行約定固定長度、分隔符、長度前綴或以關閉連線結束；一次讀取還可能帶到下一筆訊息開頭。 | [RFC 9293 §3.7 Segmentation](https://www.rfc-editor.org/rfc/rfc9293.html#section-3.7)、[§3.9.1.2 Send](https://www.rfc-editor.org/rfc/rfc9293.html#section-3.9.1.2)；[Socket HOWTO：Using a Socket](https://docs.python.org/3/howto/sockets.html#using-a-socket) | HELLO/WORLD 的換行是故事中明訂的應用層約定，不是 TCP 自帶的邊界。讀到 delimiter 後若還有尾端 bytes，解析器須保留給下一筆。 |
| TCP stream 的 `recv()` 回傳 `b''` 表示對端在此接收方向已不會再送資料；它不代表雙向都關閉。TCP 關閉可先結束單一傳送方向，另一端仍可繼續接收。 | [Python `socket.recv()`](https://docs.python.org/3/library/socket.html#socket.socket.recv)、[Socket HOWTO：Using a Socket](https://docs.python.org/3/howto/sockets.html#using-a-socket)、[Socket HOWTO：Disconnecting](https://docs.python.org/3/howto/sockets.html#disconnecting)；[RFC 9293 §3.6 Closing a Connection](https://www.rfc-editor.org/rfc/rfc9293.html#section-3.6)、[§4 Glossary（FIN）](https://www.rfc-editor.org/rfc/rfc9293.html#section-4) | `b''` 是接收方向 EOF；對端可能已 `shutdown(SHUT_WR)`，但仍能收本端回覆。EOF 本身不證明本例訊息完整；要依 framing 契約判斷是否截斷。 |
| TCP ACK 的確認範圍是序號空間：ACK 指向下一個預期序號，並確認此前序號；TCP 接收端接手資料後可確認收到。 | [RFC 9293 §3.10.7.4 Other States](https://www.rfc-editor.org/rfc/rfc9293.html#section-3.10.7.4)、[§4 Glossary（ACK）](https://www.rfc-editor.org/rfc/rfc9293.html#section-4) | 「ACK 不等於業務完成」是層次界線的推論：ACK 不證明遠端應用已讀取、驗證、持久化或完成操作。需要業務結果時，應由應用協定回覆結果。 |

## 數字界線

故事開場的「送 40 bytes、首次收到 11 bytes」是教學情境，不是實測、benchmark 或 RFC/Python 文件提供的經驗數據。它只示範切段邊界可不同；後續 12-byte `HELLO\nWORLD\n` 是另一組明示的教學串流，兩組數字不可混用。
