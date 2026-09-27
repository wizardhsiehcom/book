# 除錯：把猜測變成可以推翻的假設

報告說 id=3 missing。你猜路徑拼錯，但也可能是清單根本不該選到這列，或工作目錄不是你以為的位置。先把可能性分成可以觀察的幾層。

## 一條資料流，幾個觀察點

依序問：load 讀到哪個 id／judge？report 是否應選取？生成哪個 path？inspect 得到哪個檔案狀態？輸出時是否用了正確計數？每層都能先設預測，再取證據。

使用 Debug 建置，在 G01 的判斷與 available 入口下 breakpoint。macOS 可用 LLDB：

```sh
lldb build/g01
```

接著在 LLDB 輸入：

```text
breakpoint set --name available
run fixtures/images
frame variable
next
continue
quit
```

從 C00 根目錄執行。此操作路徑供學習；若系統不允許 debugger 啟動，改以本地 IDE 執行並記錄限制，別把沒有成功 attach 寫成已驗證。Windows 可使用 Visual Studio 對相同函式下中斷點。

## log 是問題導向的紀錄

要查身分就印 id，要查選取就印 judge，要查路徑就印組好的 path。不要一次傾倒所有資料，讓關鍵差異埋在大量輸出。若是客戶資料，也要避免把敏感內容帶到公開紀錄。

找到一個反例後先固定：保留輸入、命令、產物版本、預期與實際。修正前該例應失敗，修正後應通過；這樣下次回歸才有線索。不要一口氣改三個假設，否則成功也不知道是哪個改動有效。

**Q10：** 同一份清單在兩台機器一邊缺圖、一邊正常，你會先固定哪三個條件？什麼觀察足以排除 parser？


[返回地圖](00-map.md) · [實驗入口](labs.md) · [題目解答](answers.md)
