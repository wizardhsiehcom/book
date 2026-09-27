# Python 遷移：帶走契約，不照搬語法

之後做 ML 流程，多半會用 Python。C++ 學到的資料與失敗邊界仍然有用，但變數與複製語意不能逐字翻譯。

## 重新確認擁有與共用

Python 的 `b = a` 讓兩個名稱參照同一物件。若 a 是 list，b.append 也能從 a 看到；C++ `std::vector b = a` 則產生另一份 vector 值。Python `list(a)` 只複製外層容器，裡面可變物件仍可能共享。

```python
a = [{"id": 1, "judge": -1}]
b = list(a)
b[0]["judge"] = 2
# a[0]["judge"] 也變成 2。
```

型別註記是工具可使用的資訊，不會自動驗證外部文字。API 收到 `"1oops"` 時，仍需明確解析與範圍檢查。不同語言的 int 可表示範圍也不同；跨入資料庫或 C++ 邊界時，再次核對領域範圍。

## 資源與錯誤仍需要契約

用 `with open(...) as stream` 清楚限定檔案範圍，不依賴某個 interpreter 何時回收物件。例外可以一路交給入口轉成錯誤報告；不要 catch Exception 後回空清單，重演 C++ 那個「失敗偽裝成空批」的問題。

執行子程序時使用參數列表，核對 returncode 或啟用 check。若 child 的 1 代表已找到資料問題，就依既定契約解釋，不一概當 crash。C00 建置工具不透過 shell 拼接參數，路徑有空白時也能保持參數邊界。

本書附 `python_bridge.py`，用可執行反例核對 list 外層複製與內層共享；不依賴 assert，`python -O` 也會真的檢查。

**Q14：** 將每筆 Row 改成 Python dict，複製外層 list 後再批量修改 judge，為什麼可能改到原資料？你應該先決定哪個修改契約？

來源：[Python 資料結構](https://docs.python.org/3/tutorial/datastructures.html)、[subprocess](https://docs.python.org/3/library/subprocess.html)。


[返回地圖](00-map.md) · [實驗入口](labs.md) · [題目解答](answers.md)
