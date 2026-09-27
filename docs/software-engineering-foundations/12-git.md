# Git：讓一次修改可以被理解與撤回

你改了門檻、順手格式化又改報告名稱。現在結果壞了，很難知道哪個是原因。版本控制的價值是保存可理解的差異，而不只是備份檔案。

## 工作區、暫存區與提交

工作區是正在改的檔案；暫存區是這次準備提交的內容；commit 是可指認的快照。`git diff` 看尚未暫存的變動，`git diff --cached` 看準備提交的變動。已追蹤與未追蹤也不同：新檔不會因為執行 git diff 就自動出現在補丁裡。

```sh
git status --short
git diff
git diff --cached
```

本次建立的新 C00 repo 保留完整教材檔案；若尚未有第一筆 commit，先閱讀狀態，確認要納入哪些來源，再建立自己的基線。不要為了跟命令而把 build 產物與私人 data 一起加入。

## 只撤回自己確定要丟的內容

當你確認某個已追蹤檔案的未暫存練習改動不需要，可用 `git restore -- path` 從暫存區恢復它。先看 diff、需要時另存；此操作會丟棄那部分未提交內容。`git restore --staged` 則是調整暫存，不是相同動作。

多件事分開提交：先做行為不變的拆分，再做規則變更。reviewer 才能先核對搬移，再判斷新需求。好的提交說明解釋問題與結果，例如「拒絕重複 id，避免同一張圖被當成兩份工作」，比「update code」更能協助未來排錯。

## 保存學習證據

每次變式練習保留輸入、預測、diff 與測試結果；即使不提交，也能用 diff 看自己是否改動了預期之外的地方。`git diff --no-index` 可比較兩份獨立快照，有差異回 1 不代表命令失敗。

**Q12：** 你只想把檔案移出暫存，應不應直接用 restore 丟掉工作區變動？先解釋三個位置再選命令。

來源：[Git 的變更紀錄](https://git-scm.com/book/en/v2/Git-Basics-Recording-Changes-to-the-Repository)、[git restore](https://git-scm.com/docs/git-restore)。


[返回地圖](00-map.md) · [實驗入口](labs.md) · [題目解答](answers.md)
