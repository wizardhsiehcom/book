# 02｜批次名稱改一次，為什麼可能要改很多列？

## 問題

想像把批次標籤、缺陷與每次判定全塞進同一張寬表。批次 A 的標籤會隨每個缺陷、每次判定重複出現。標籤從 A 改成「A-返工」時，如果只改了一列，同一批資料便同時有兩種名稱。問題不在 UPDATE 寫得不夠仔細，而是同一個事實被存了多份。

## 先預測

缺陷 1 有兩次判定，缺陷 2 尚未判定；若平面表每列都必須有判定 ID，能不能記錄「批次 A 已建立但尚無缺陷」？刪除一批次最後一筆判定會不會連帶失去批次標籤？標籤要改名時，最少要檢查幾列？

## 讓每個事實有自己的位置

把批次標籤放在 Batches，把缺陷身份放在 Defects，把每次分數、模型版本、操作者和時間放在 Judgments。這不是為了把表拆得越多越好，而是讓每個欄位回答它所屬實體的問題。batch_id 決定該批次的 label；defect_id 決定該缺陷的 batch_id 與 defect_no；judgment_id 決定一次判定的分數與來源。一次判定的 model_version 是該事件的事實，所以同一缺陷重判後可以不同，不該搬成缺陷的固定欄位。

正規化可用三個檢查問題理解：

1. **第一正規化的直覺：** 一個格子存一個值，而不是把多個判定編成「101:80, 102:90」的字串。否則篩選、更新、參照其中一筆都得重新解析文字。
2. **第二正規化的直覺：** 若候選鍵由多欄組成，描述欄位要依賴整個鍵。批次標籤只取決於 batch_id，不取決於缺陷號；把它放在以 (batch_id, defect_no) 識別的缺陷清單會重複。
3. **第三正規化的直覺：** 描述某個實體的事實，應依賴該實體的鍵，而非繞一個其他非鍵欄位間接依賴。比如把 batch_label 和 operator_name 放在判定列：前者依批次，後者才依判定事件，兩者更新頻率與所有者不同。

若把資料塞回一張表，可能出現三種異常：**更新異常**是多列要同步修改；**新增異常**是還沒有缺陷或判定就無法記錄批次；**刪除異常**是刪掉最後一筆事件時順便抹掉了唯一保存的批次資訊。拆回三個實體後，批次可以先存在，缺陷可以尚未判定，歷史也能自然地有多列。

用 seed 看結果時，批次 A 的標籤只保存在一列：

~~~sql
SELECT b.batch_id, b.label, COUNT(d.defect_id) AS defect_count
FROM dbo.Batches AS b
LEFT JOIN dbo.Defects AS d ON d.batch_id = b.batch_id
GROUP BY b.batch_id, b.label;
~~~

這個查詢用 JOIN 取回需要一起閱讀的資訊；正規化沒有消除關聯，而是把重複資料移到明確的連接邊界。之後新增 Defect 時無須再複製 label，批次更名也只需更新 Batches 那一列。

## 反正規化要有代價帳

把 label 複製進 Defects 可能讓某張報表少一次 JOIN，卻必須回答同步失敗怎麼辦、舊列如何回填、哪份值才可信。類似地，在 Defects 放一個目前判定指標會讓讀取簡單，卻需要確保指標和判定事件指向同一缺陷。這是刻意的重複資訊；只有在明確規則和量測收益後才值得保留，不能把它當作歷史本身。

本例也不必把 model_version 拆成另一張模型目錄表：判定事件只記版本代碼，已足以說明每次事件用哪版模型；若要保存模型廠商、部署設定等穩定描述，才有理由另建模型實體。這個選擇來自需要，而非「三張表還不夠正規」。

## 無提示題

寫出批次標籤、缺陷編號、判定分數分別依賴哪個鍵。接著挑一種更新、新增或刪除異常，說明目前三表如何避免它；最後列出反正規化後至少一項同步成本。

> 本章的資料依賴與 SQL 由共同 seed 推演，尚未作引擎驗證。

答案：[answers.md｜02 正規化](answers.md#02-normalization)。

來源：[Microsoft Learn：Database normalization description（入門正規化概念，例子使用 Access）](https://learn.microsoft.com/en-us/previous-versions/troubleshoot/microsoft-365/microsoft-365-apps/access/database-normalization-description)、[Microsoft Learn：Primary and foreign key constraints](https://learn.microsoft.com/en-us/sql/relational-databases/tables/primary-and-foreign-key-constraints?view=sql-server-ver16)
