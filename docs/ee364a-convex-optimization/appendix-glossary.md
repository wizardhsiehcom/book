# 術語表

隨章節進度補充。翻譯以逐字稿為準，同一術語全書維持一致。

| 英文 | 中文 | 說明 | 首次出現 |
|---|---|---|---|
| convex optimization | 凸優化 | 目標與不等式約束皆為凸函數的優化問題 | L1 |
| convex function | 凸函數 | 滿足 $f(\alpha x+\beta y)\le\alpha f(x)+\beta f(y)$（非負曲率）的函數 | L1 |
| optimization variable | 優化變數 | 要選擇的量；管理科學稱決策變數（decision variable） | L1 |
| objective function | 目標函數 | best-effort 的量，越小越好 | L1 |
| constraint | 約束 | 硬述詞（predicate），違反即不可接受 | L1 |
| feasible / optimal point | 可行點 / 最優點 | 滿足約束者為可行；目標最小者記為 $x^\star$ | L1 |
| least squares | 最小平方 | $\min\|Ax-b\|_2^2$，有解析解 | L1 |
| linear programming (LP) | 線性規劃 | 最小化線性目標受線性不等式約束，解在多面體頂點 | L1 |
| local optimization | 局部優化 | 找可行且較優的點，不保證全域最優 | L1 |
| regularization | 正則化 | 目標中促進 robustness、抑制過擬合的附加項 | L1 |
| prescriptive / descriptive | 指示性 / 描述性 | 變數會被執行 vs 僅為參數 | L1 |
