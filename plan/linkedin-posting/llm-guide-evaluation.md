# 私人 LinkedIn 指南回放紀錄

日期：2026-10-14。這是執行紀錄，不是寫作品質或平台成效證明。

## 方法與範圍

以沒有主對話歷史的代理讀取指南及按任務選讀的章節，真正生成答案。A→B→C 為同一新工作階段的連續輸入；D–J 在另一新工作階段分題執行，因此不是每題各自獨立。原始輸出保留於下方，主代理核对事實與任務範圍。模型與代理均沿用本工作階段設定，未比較模型能力或進行重複抽樣。

指南在測試前移除特定活動的詳細素材，改為按需讀取個別筆記；回放明確禁止讀取私人歷史。如此不會在早期測例取得後來才出現的測試內容或人物談話。

A 的章節合併工具輸出曾截斷；代理聲明已讀到活動文相關段落。這是部分讀取，不能宣稱全文都被讀過。B/C 沿用已讀內容；C1 前重新讀取修正版指南。D–J 實際讀了模式、語氣、編修與發布章，未讀整書。

## 驗收摘要

| 測例 | 核對結果 | 仍需本人判讀 |
|---|---|---|
| A 少量素材 | 有選材；2 PR、首次 PyCon Sprint 保留，未補合併狀態 | 感嘆號與收尾是否像本人 |
| B 多候選初次 | **失敗**：人物版把首次 PyCon Sprint 縮成首次 Sprint，擴大範圍；候選選材有區別 | 各版偏好 |
| C 連續修改 | 沿選定社群版，未重加 PR／人物；後續刪除空泛紀錄句 | LinkedIn 適合度與本人聲音 |
| D 輕修 | 只修語序、標點；沒有新增心得、CTA 或 hashtag | 本人是否接受 |
| E 英文 | 保留活動、文件組、1 PR、其他專案興趣與致謝 | 英文語氣及感嘆號 |
| F 角色／狀態 | 未把首次 Sprint 擴成首次 PyCon；PR 未寫 merged，人物未寫創辦人 | 是否需要把未知合併狀態寫進正文 |
| G 他人談話 | 只說問過，沒有回答或立場 | 句子口吻 |
| H1 偵測 | 不把68%當作者來源判決 | — |
| H2 適合度 | 回答評估，未重寫，不保證求職或觸及效果 | 是否切中本人想問的「加分」 |
| I 技術對照 | 保留100請求、12→4、同環境負載、單次與未上正式流量的限制 | 行文 |
| J 非 PyCon 遷移 | 分成修改地名與交流兩角度；未移入舊活動的高天／PR／首次，未描述未見照片 | 仍有「留下紀錄」式填充句，待本人判讀 |

不是全部一次通過：B 暴露範圍升級，已在指南和 C03 補上「第一次所限定的活動名稱不可省略」及例子。保留初次失敗、有歷史重試與新對話重試，不能用修正稿覆蓋原始輸出。自然度與本人聲音尚未經使用者盲看驗收，所有模型判讀都不替代此項。

## 分輪輸入與原始輸出

### A

輸入：第一次參加 PyCon Sprint，選 Your First PR to PySpark，提兩個 PR；還有好幾個專案想參加，大家投入，有照片，中午披薩，場地舒服。要求簡短繁中 LinkedIn 文，挑內容、不必全寫。


### A 原始輸出



```text
第一次參加 PyCon Sprint，選了 Your First PR to PySpark，提了兩個 PR。

現場還有好幾個想參加的專案，大家也都很投入。這次先從 PySpark 開始！
```

### B 初次

新增：高天是受邀專案主持人之一，也是報名重要原因。要求三個不同重點的繁中候選。

```text
**A｜這次做了什麼**

第一次參加 PyCon Sprint，選了 Your First PR to PySpark，提了兩個 PR。

還有好幾個專案也想參加，這次先從 PySpark 開始！

**B｜為什麼報名**

這次報名 PyCon Sprint，一個重要原因是高天受邀擔任專案主持人之一。

第一次參加 Sprint，我選了 Your First PR to PySpark，也提了兩個 PR，留個紀錄。

**C｜現場的氣氛**

第一次參加 PyCon Sprint，現場大家都很投入，也有好幾個讓我想參加的專案。

場地舒服，中午還有披薩。記錄一下這次的 Sprint！
```

### C1

選 C，保留第一次參加 PyCon Sprint，更 LinkedIn 一點。重讀修正版指南後生成。

```text
第一次參加 PyCon Sprint，現場大家都很投入，也有好幾個讓我想參加的專案。

場地舒服，中午還有披薩，留下這次參與的紀錄。
```

### C2

沿 C1 修改：還是太 AI，修一下。

```text
第一次參加 PyCon Sprint，現場大家都很投入，也有好幾個專案想參加。

場地舒服，中午還有披薩。
```

### B 有歷史重試

相同 B 輸入，在已知修正的工作階段重試。

```text
**A｜這次做了什麼**

第一次參加 PyCon Sprint，選了 Your First PR to PySpark，提了兩個 PR。

還有好幾個專案也想參加，這次先從 PySpark 開始！

**B｜為什麼報名**

高天是這次 PyCon Sprint 受邀的專案主持人之一，也是我報名的重要原因。

第一次參加 PyCon Sprint，我選了 Your First PR to PySpark，提了兩個 PR。

**C｜現場的氣氛**

第一次參加 PyCon Sprint，現場大家都很投入，也有好幾個專案想參加。

場地舒服，中午還有披薩。
```

### D–J 輸入

- D：合成草稿「第一次參加社群文件日 這次選CLI文件組 提一個PR修正安裝說明。還有幾個專案想試 謝謝主辦和主持人。」要求順一下，其他不加。
- E：把 D 原稿改英文，不直翻、保留意思。
- F：首次 PyCon Sprint、選 Your First PR to PySpark、2 PR 未知合併；Gao Tian 為受邀專案主持之一，非總主辦。要求簡短英文紀錄。
- G：在社群聚會問講者 Morgan 對 vibe coding 的看法，未提供回答；只寫英文短文。
- H1：短文「I joined a local documentation sprint and opened a PR to update the installation guide. Thanks to the organizers.」被測68%，問能否判為 AI。
- H2：同一篇是否適合 LinkedIn、有加分嗎？只回答、不改稿。
- I：合成測試100請求，同環境與負載，修改 timeout 前12次失敗、後4次；單次對照，無正式流量，其他負載未知。寫繁中工程復盤。
- J：地方地圖編輯聚會，修正3個錯誤地名，與志工討論地址格式；團體照未看、午餐麵包。兩個簡短繁中候選，不用全部材料。

### D–J 原始輸出與實際讀檔

```text
# D

第一次參加社群文件日，這次選了 CLI 文件組，提了一個 PR 修正安裝說明。

還有幾個專案想試，謝謝主辦和主持人。

# E

At my first community documentation day, I joined the CLI docs group and opened a PR to fix the installation instructions.

There are a few more projects I'd like to try. Thanks to the organizers and hosts!

# F

I joined my first PyCon Sprint and chose “Your First PR to PySpark,” where I submitted two PRs. I'm not sure whether they've been merged yet.

Gao Tian was one of the invited hosts for the project.

# G

At a community meetup, I asked Morgan, one of the speakers, for their thoughts on vibe coding.

# H1

我無法判定這篇是 AI 寫的。文字只是簡短交代參與、提 PR 和感謝，沒有足以判定作者身分的資訊；你提供的 68% 也沒有附上檢測方法，不能直接當成「有 68% 機率是 AI 寫的」。

# H2

適合，作為簡短的參與紀錄已經清楚。它能讓人看見你有參與社群，也實際提出了文件修改；但這些資訊還不足以展示技術深度，或確認 PR 已被採用。若「加分」是讓人更了解你做過什麼，有這個作用；對求職或觸及的效果，目前無法判斷。

# I

這次用 100 個請求做合成測試，在相同環境與負載下，比較修改 timeout 前後的結果：失敗次數從 12 次降到 4 次。

這是單次對照中觀察到的差異，尚未用正式流量驗證，也不知道換成其他負載後是否仍有同樣結果。目前還不能據此判定問題已解決。

# J

**候選一**

參加地方地圖編輯聚會，修正了三個錯誤地名。記錄一下這次做的小修改。

**候選二**

在地方地圖編輯聚會，和志工聊了地址格式。這次想留下的是這段交流的紀錄。

# 實際讀檔清單

- `/Users/wizard/Desktop/MacCode/book/CLAUDE.md`
- `/tmp/linkedin-writing-guide.md`
- `/Users/wizard/Desktop/MacCode/book/docs/linkedin-posting/04-post-patterns.md`
- `/Users/wizard/Desktop/MacCode/book/docs/linkedin-posting/tone-and-voice.md`
- `/Users/wizard/Desktop/MacCode/book/docs/linkedin-posting/05-opening-and-editing.md`
- `/Users/wizard/Desktop/MacCode/book/docs/linkedin-posting/06-format-and-publishing.md`

未讀私人歷史、plan 或其他 agent 輸出，未上網。章節中的其他活動與作者案例未作為上述貼文的事實材料。
```

### B 新對話重試（首次範圍規則修正後）

同一 B 材料，沒有 A–C 的歷史。首次範圍保留，但仍新增「把時間留給 PySpark」的安排，以及「很喜歡這種氣氛」的本人感受，故**仍未通過不新增事實的硬性驗收**。這也顯示「不要編造」需要涵蓋看似自然的感受與動機。已補指南與 C05，此版本不覆蓋前次。

```text
**版本一｜兩個 PR**

第一次參加 PyCon Sprint，選了「Your First PR to PySpark」，這次提了兩個 PR。

還有好幾個專案也想參加，這次先把時間留給 PySpark。記錄一下這次動手參與的成果！

**版本二｜報名的原因**

高天是這次 PyCon Sprint 受邀的專案主持人之一，也是我決定報名的重要原因。

這是我第一次參加 PyCon Sprint，選了「Your First PR to PySpark」。想參加的專案其實還有好幾個，這次就從 PySpark 開始。

**版本三｜現場氣氛**

第一次參加 PyCon Sprint，大家都很投入，場地也舒服，中午還有披薩。

這次選了「Your First PR to PySpark」，也看到好幾個想參加的專案。很喜歡這種大家一起投入專案的氣氛。

---

實際讀檔清單：

- `/Users/wizard/Desktop/MacCode/book/CLAUDE.md`
- `/tmp/linkedin-writing-guide.md`
- `/Users/wizard/Desktop/MacCode/book/docs/linkedin-posting/04-post-patterns.md`
- `/Users/wizard/Desktop/MacCode/book/docs/linkedin-posting/tone-and-voice.md`
```

### B 第二次新對話重試（感受與動機規則修正後）

再次使用相同 B 輸入，未帶先前回放歷史。三版保留首次 PyCon Sprint、角色及 PR 提出狀態，未補喜歡氣氛或時間安排。此次事實與數量／選材檢查通過；「留下紀錄」的語氣仍不是自然度已驗收。只代表此輪觀察，未證明不同模型或多次抽樣穩定通過。

```text
### 候選一｜動手提 PR

第一次參加 PyCon Sprint，選了「Your First PR to PySpark」，提了兩個 PR。

還有好幾個專案也想參加，這次先留下在 PySpark 動手的紀錄。

### 候選二｜報名的原因

高天是這次 PyCon Sprint 受邀的專案主持人之一，也是我報名的重要原因。

這是我第一次參加 PyCon Sprint，選的是「Your First PR to PySpark」。

### 候選三｜現場紀錄

第一次參加 PyCon Sprint，現場大家都很投入，場地也很舒服，中午還有披薩。

除了這次選的「Your First PR to PySpark」，還有好幾個專案讓我想參加。

---

實際讀檔清單：

- `/Users/wizard/Desktop/MacCode/book/CLAUDE.md`
- `/tmp/linkedin-writing-guide.md`
- `/Users/wizard/Desktop/MacCode/book/docs/linkedin-posting/04-post-patterns.md`
- `/Users/wizard/Desktop/MacCode/book/docs/linkedin-posting/tone-and-voice.md`

未看照片，未查閱其他測試檔、私人歷史或 plan；候選僅使用本次提供的事實。
```


## 文件驗證與交付

`bash sync-assets.sh` 與 `UV_CACHE_DIR=/tmp/linkedin-uv-cache uv run mkdocs build -f configs/linkedin-posting.yml` 成功；相對連結、兩新章 HTML 產物、公開書稿不含私人絕對路徑檢查通過。`git diff --check` 通過。未做瀏覽器視覺檢查或發布。

Obsidian 指南已寫入並讀回比對。保留本人語氣／自然度及人類閱讀驗收為待完成，不以建置成功替代。研究資料覆蓋限制另見[再研究紀錄](post-reanalysis.md)。
