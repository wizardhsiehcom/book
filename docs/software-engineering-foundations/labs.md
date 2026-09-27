# 實驗入口與完整程式

## 不依賴課程的原理小實驗

下載 [concepts.cpp](examples/concepts.cpp) 與 [python_bridge.py](examples/python_bridge.py)，放在自己的練習資料夾。C++ 檢查值／參照、例外解構、容器、比較次數與數字解析；Python 檢查外層複製仍可能共用內層物件。

macOS／Linux（本版只實測 macOS）：

```sh
c++ -std=c++17 -O0 -g concepts.cpp -o concepts
./concepts
python3 python_bridge.py
```

C++ 最後應是 PASS；先逐項預測數字，再執行。Release 對照：

```sh
c++ -std=c++17 -O2 -DNDEBUG concepts.cpp -o concepts-release
./concepts-release
python3 -O python_bridge.py
```

兩者都不因省略 assert 而取消檢查。Windows 用 VS Native Tools 終端：`cl /nologo /std:c++17 /EHsc /utf-8 concepts.cpp /Fe:concepts.exe`，再跑 `concepts.exe`；Python 命令改成 `py`。Windows 本版未實測。

## C00 完整漸進課程

本地入口：`/Users/wizard/Desktop/MacCode/courses/aoi-preflight-course/README.md`。

也可下載本版的 [C00 來源快照](downloads/aoi-preflight-course.zip)。壓縮檔包含正文、各階程式、合成輸入、解答與建置工具，不含 Git 紀錄、編譯產物或私有來源。解壓後先讀 README，從 G00 開始。這是本版發行快照；之後課程更新需重新封裝，不將它當成另一份編輯來源。

| 欲練習的判斷 | 課程位置 |
|---|---|
| 不重建為何沒有改變 | G01 |
| 值、作用域與清單解析 | G01–G02 |
| 查重與成本 | G03 |
| 錯誤與檔案政策 | G04 |
| 邊界與規則 | G05 |
| 模組與遷移 | G06、capstone |

## 書末任務

從 C00 G06 出發，先寫契約，再完成「所有列都檢查＋支援 JPG」需求。正常、缺圖、壞參數與門檻邊界都要驗。不得藉修改 judge 把已判列假裝成待判；保持輸入資料不變。

成功證據是你能指出修改位置、解釋原因、展示反例與結果。書附 PASS 和課程測試 PASS 是教材證據，不代表你已完成遷移。
