# 錯誤傳遞：不是所有非零都代表同一件事

清單格式錯誤和某張圖片缺失，是不同的使用者處理方式。如果都只回 false，呼叫者無法知道要修清單、補圖片，還是找 IT 查權限。

## 區分工作完成與結果良好

C00 的 0 表示檢查完成且符合本階規則；1 表示檢查完成但找到圖片問題；2 表示根本無法完成可信檢查。返回 1 的工具可能運作完全正確，因為它的工作正是找問題。

對單一圖片，`inspect` 回傳狀態供報告列出；對無法繼續的清單錯誤，`load` 拋例外，main 將它轉成 stderr 與 exit 2。這樣核心不必在每層決定終端機怎麼呈現，最外層也不需要推測 empty vector 到底代表空批還是失敗。

## 丟例外與錯誤碼都可以

選擇依呼叫方式與恢復需求。filesystem 提供接收 error_code 的形式，讓工具區分多種檔案狀態；程式若傳了 ec 卻不檢查，並沒有變安全。C00 在使用 file_size 前查 error，避免把失敗值當作真正大小。

如果 API 用例外，別在深層 catch 所有錯誤後回一個假的正常值。你移除了上層作判斷所需的訊號。反過來，也不必對每張缺圖都終止整批，因為缺圖是此工具要收集的結果。

## 用反例定義邊界

比較 missing、too-small、not-regular、io-error。後者不能靠本機管理者權限下「看起來讀得到」就宣稱權限案例已驗；實際驗證要記環境。要改成略過 symlink，可以是政策選擇，但需更新測試與文件。

**Q07：** 把所有 exception catch 後回空 vector，再讓 report 印 total=0，有什麼語意損失？

來源：[檔案類型查詢](https://eel.is/c++draft/fs.op.is.regular.file)、[C++ 錯誤處理指引](https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines#e-error-handling)。


[返回地圖](00-map.md) · [實驗入口](labs.md) · [題目解答](answers.md)
