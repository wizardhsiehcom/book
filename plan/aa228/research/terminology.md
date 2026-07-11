# AA228V 全書譯名標準表（R3 術語覆核）

> 覆核範圍：`docs/aa228-safety-critical-systems/` 全部 17 章。
> 原則：優先採台灣學術慣例（國家教育研究院樂詞網 terms.naer.edu.tw、台灣控制／統計學界教科書慣用），其次求全書一致、避免歧義。
> 驗證日期：2026-07-10。

## 一、譯名標準表

| 英文 | 建議統一譯名 | 備選 | 理由／出處 |
|------|-------------|------|-----------|
| falsification | **否證**（首次出現標註英文：否證 (Falsification)） | 證偽（中國大陸與部分工程文獻）；「反例搜尋」可作解釋性補語 | 國教院樂詞網收錄 falsification = 否證（[terms.naer.edu.tw/detail/1305489/](https://terms.naer.edu.tw/detail/1305489/)），Popper 的 falsifiability 台灣慣譯「可否證性」。書中現況嚴重漂移：ch8「偽證」（中文本義為 perjury，屬錯譯）、ch9「錯誤尋找」、README/ch15/ch17「偽造」（本義 forgery，亦不妥）。統一為「否證」，語意即「主動尋找違反規範的反例（失效）」，首次出現可加註「即在模擬中搜尋系統違反安全屬性的反例」 |
| falsification through optimization | 基於最佳化的否證 | 最佳化否證法 | 對應教科書 ch4 章名；與 ch9 章名格式（基於規劃的～）對齊 |
| falsification through planning | **基於規劃的否證** | 規劃式否證 | 同上；ch9 現行章名「基於規劃的錯誤尋找」應改 |
| Pareto optimal | **帕雷托最佳** | 柏瑞圖最適、巴瑞圖最適（國教院經濟學舊譯） | 樂詞網經濟／行政領域有「柏雷多最適狀態」「巴瑞圖最適性」等多種舊譯（[terms.naer.edu.tw/detail/1307531/](https://terms.naer.edu.tw/detail/1307531/)）；現代台灣經濟學教科書與課程講義以「帕雷托」為主流。**避免「柏拉圖」**：雖然品管領域的 Pareto chart 樂詞網作「柏拉圖」，但與哲學家 Plato 完全撞名，在本書（有貝氏、邏輯等哲學相關語境）易生誤解。書中 ch3 用「柏拉圖最佳」、ch4 用「帕雷托最優」，統一為「帕雷托最佳」（台灣慣用「最佳」，「最優」為大陸慣用） |
| Pareto frontier | **帕雷托前緣** | 帕雷托邊界 | ch3「柏拉圖前緣」→「帕雷托前緣」；「前緣」已是書中用法且台灣多目標最佳化文獻常見 |
| robustness（STL 語境） | **強健性**（數值可稱「強健性值」） | 強健度（若欲區分「性質」與「數值」可保留，但須全書一致） | 台灣控制學界慣例：robust control = 強健控制、樂詞網 noise robustness = 雜訊強健性（[terms.naer.edu.tw/detail/12715399/](https://terms.naer.edu.tw/detail/12715399/)）。「穩健性」為統計學慣譯（robust statistics），「魯棒性」為中國大陸譯法，皆不用於本書 STL 語境。書中現況：ch4/ch8 強健性、ch9 強健度、ch15 穩健性、ch17 魯棒性 → 統一「強健性」；smooth robustness = 平滑強健性（維持現譯） |
| Swiss cheese model | **瑞士乳酪模型** | 瑞士起司模型 | 中文維基 zh-tw 詞形為「瑞士乳酪理論」（[zh.wikipedia.org/zh-tw/瑞士乳酪理論](https://zh.wikipedia.org/zh-tw/%E7%91%9E%E5%A3%AB%E5%A5%B6%E9%85%AA%E7%90%86%E8%AB%96)），台灣飛安／工安文獻兩者皆見、以「乳酪」略多。書中 README 用「起司」、ch13 用「乳酪」，取 ch13 用法統一為「瑞士乳酪模型」 |
| Bayesian | **貝氏** | ——（「貝葉斯」為大陸譯法，不採） | 台灣統計學界標準譯名（貝氏定理、貝氏網路、貝氏估計）。書中僅 ch13 兩處「貝葉斯模型平均」漂移，改「貝氏模型平均」 |
| polytope | **多胞形** | 凸多胞形（強調凸性時） | 樂詞網數學名詞：polytope = 多胞形（[terms.naer.edu.tw/detail/2122026/](https://terms.naer.edu.tw/detail/2122026/)）、regular polytope = 正則多胞形。書中 ch6 正確用「多胞形」，但 ch5/ch13 誤作「多面體」（polyhedron，僅限三維）、**ch7 錯譯為「多邊形」（polygon，僅限二維，屬明確錯誤）**，全數統一為「多胞形」 |
| zonotope | **Zonotope（環帶多胞形）** | 區帶多胞形 | 無公定譯名；建議保留英文為主、括號附中文。書中 ch6「環帶多面體」改「環帶多胞形」以與 polytope 譯法一致 |
| reachability analysis | **可達性分析** | —— | 書中已一致，台灣形式化方法文獻慣用，維持 |
| invariant set | **不變集合** | 不變集 | ch6 現譯「不變集合 (Invariant Set)」，台灣控制文獻常見，維持 |
| over-approximation | **過度近似** | 過近似、上近似 | 書中 ch5–ch7 已一致使用「過度近似」，語意清楚，維持（若日後引入 under-approximation，譯「不足近似」對稱） |
| importance sampling | **重要性採樣** | 重要性抽樣（統計學界慣用「抽樣」） | 書中 21 處已一致使用「重要性採樣」，維持現譯以免大改；首次出現附英文 |
| cross-entropy method | **交叉熵方法（CEM）** | 交叉熵法 | 書中已一致，台灣機器學習慣譯，維持 |
| sequential Monte Carlo | **循序蒙地卡羅（SMC）** | 序列蒙地卡羅、逐次蒙地卡羅 | 「序貫」為中國大陸譯法（序貫分析／序貫檢定），台灣統計慣用「逐次」（sequential analysis = 逐次分析）、資訊領域慣用「循序」（sequential access = 循序存取）。書中 ch12「序貫蒙地卡羅」建議改「循序蒙地卡羅」；「蒙地卡羅」為台灣慣譯（大陸作「蒙特卡洛」），書中已正確 |
| runtime monitoring | **執行時期監控** | 執行期監控 | runtime 台灣資訊慣譯「執行時期」（微軟正體中文詞彙）。書中 ch13/README 用「執行時期監控」、ch16 漂移為「執行期／運行時」（「運行時」為大陸譯法），統一「執行時期」 |
| conformal prediction | **保形預測 (Conformal Prediction)** | 共形預測 | 樂詞網 conformal（數學）= 保角／共形；此詞在台灣 ML 社群尚無公定譯名，常直接用英文。書中 ch13 已一致使用「保形預測」且附英文，維持 |
| saliency map | **顯著圖 (Saliency Map)** | 顯著性圖 | 書中 ch14/ch15 已一致，台灣電腦視覺文獻常用，維持；gradient saliency map = 梯度顯著圖 |
| surrogate model | **代理模型 (Surrogate Model)** | 替代模型 | 書中 ch14/ch16 已一致，維持 |
| counterfactual | **反事實** | —— | 書中已一致（反事實分析），因果推論標準譯名，維持 |
| Metropolis-Hastings | Metropolis-Hastings（不譯） | —— | 人名演算法保留英文，書中已如此 |
| inverted pendulum | **倒立擺 (Inverted Pendulum)** | 倒單擺（力學名詞） | 書中主體用「倒立擺」且與教科書一致，維持；見下方辨析 |
| cart pole | **車桿系統 (Cart-Pole)**／滑車倒立擺 | 台車倒立擺 | 僅在需要與倒立擺對比時使用；**本書課程範例不是 cart pole**，見下方辨析 |

### inverted pendulum vs. cart pole 辨析（含 AA228V 採用何者）

兩者是不同的經典控制系統：

| | Inverted Pendulum（倒立擺） | Cart-Pole（車桿／滑車倒立擺） |
|---|---|---|
| 結構 | 擺桿直接鉸接於固定基座，**無滑車** | 擺桿鉸接於可在軌道上滑動的**小車**上 |
| 狀態 | 角度 θ、角速度 ω（2 維） | 車位置 x、車速 ẋ、角度 θ、角速度 θ̇（4 維） |
| 控制輸入 | 施加於**樞軸的力矩 (torque)** | 施加於**小車的水平推力** |
| 對應 Gym 環境 | Pendulum | CartPole |

**AA228V 使用的是前者（無滑車的倒立擺）**。教科書《Algorithms for Validation》附錄 A.5「Inverted Pendulum System」明載：狀態為 (θ, ω)、動作為施加於基座的力矩（ω′ = ω + (3g/2ℓ·sinθ + 3a/mℓ²)Δt）、觀測為含雜訊的狀態量測（[val.pdf](https://algorithmsbook.com/validation/files/val.pdf) p. 361，2026-07-10 驗證）。全書無 cart-pole 系統。因此 **ch15「以倒立擺（Cart Pole）為例」的括號註記是錯的**，應改為「倒立擺（Inverted Pendulum）」；ch15 文中「擺錘傾倒後」等敘述亦應避免暗示有滑車。

## 二、全書取代對照（舊詞 → 新詞，供寫作 Agent 機械式套用）

> 套用時逐條確認語境；標 ⚠ 者不可全域無腦取代。

| 舊詞 | 新詞 | 出現章節（已知） | 備註 |
|------|------|------------------|------|
| 偽證 | 否證 | ch8（章名、內文多處） | 全部為 falsification 語意，可直接取代（偽證法→否證法、直接偽證法→直接否證法） |
| 偽造測試 | 否證測試 | ch15 | |
| 偽造 ⚠ | 否證 | README、ch15、ch17 | 僅限對應英文 falsification 處；ch17「RL 偽造」→「RL 否證」、「偽造演算法」→「否證演算法」、「偽造工具」→「否證工具」、「偽造方法」→「否證方法」 |
| 錯誤尋找 | 否證 | ch9（章名、內文） | 章名「基於規劃的錯誤尋找」→「基於規劃的否證」；「尋找系統錯誤 (Falsification)」→「否證 (Falsification)」 |
| 柏拉圖最佳 | 帕雷托最佳 | ch3 | 含「柏拉圖最佳解集」→「帕雷托最佳解集」 |
| 柏拉圖前緣 | 帕雷托前緣 | ch3 | |
| 帕雷托最優 | 帕雷托最佳 | ch4 | |
| 強健度 | 強健性 | ch9 | |
| 穩健性 ⚠ | 強健性 | ch15（robustness 指標語境） | 僅 STL robustness 語意處（如 ch15「性能（如穩健性指標）」）；若他處為統計穩健性則保留 |
| 魯棒性 | 強健性 | ch17 | 「神經網路具備魯棒性」→「具備強健性」 |
| 瑞士起司模型／瑞士起司 | 瑞士乳酪模型／瑞士乳酪 | README | ch13 已用乳酪，README 對齊 |
| 貝葉斯 | 貝氏 | ch13 | 「貝葉斯模型平均」→「貝氏模型平均」（兩處） |
| 多邊形 ⚠ | 多胞形 | ch7（3 處，均標註 Polytopes） | 僅取代指 polytope 之處（ch7 全部皆是） |
| 多面體 (Polytopes/Polytope) ⚠ | 多胞形 | ch5、ch13 | 僅限英文標註為 polytope 之處；「凸多面體」（ch13 凸包語境）→「凸多胞形」；「邊界多面體 (Bounding Polytope)」（ch7）→「邊界多胞形」 |
| 環帶多面體 | 環帶多胞形 | ch6 | Zonotope 譯註 |
| 序貫蒙地卡羅 | 循序蒙地卡羅 | ch12（2 處） | |
| 運行時 | 執行時期 | ch16 mermaid 節點等 | |
| 執行期 | 執行時期 | ch16（3 處） | 「執行期異常偵測」→「執行時期異常偵測」 |
| 倒立擺（Cart Pole） | 倒立擺（Inverted Pendulum） | ch15 | 括號英文錯置，見上方辨析 |
| 証明 | 證明 | ch13（總結表） | 異體字順手修正 |

### 已一致、無需變動（供寫作 Agent 白名單）

可達性分析、過度近似、不變集合、重要性採樣、交叉熵方法、蒙地卡羅、保形預測、顯著圖、代理模型、反事實、執行時期監控（ch13/README 既有用法）、平滑強健性、訊號時序邏輯 (STL)、倒立擺（主體用法）。
