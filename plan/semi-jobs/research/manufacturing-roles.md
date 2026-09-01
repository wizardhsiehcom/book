# 半導體製造職務研究：製程、設備、廠務、良率、製造、封裝與測試

> 研究範圍：`docs/semi-jobs/06-process-overview.md` 至 `18-ie.md`，以及 `21-cowos-collaboration.md`。
> 研究原則：採用 2025–2026 年第一手官方資料；新聞與論壇只做交叉驗證，不作為書稿事實依據。
> 查證日：2026-08-31。本文只提供改稿依據，不直接修改書稿。

## 結論摘要

目前書稿最大的問題不是少幾個技術名詞，而是職務地圖有結構性缺口：沒有獨立介紹良率、智慧製造／製造管理、產品工程、CIM／AMHS／自動化，卻把 Product Engineer 併入 Test Engineer；同時把多個職務一概寫成 12 小時輪班、博士主流或固定薪資區間。台積電 2025–2026 官方職缺已明確分列 PIE、PE、EQ、IMC/MFG、FAC、Yield、Product、AMHS 等角色，應以真實組織邊界重畫章節，而不是繼續在現有章節補段落。[^tsmc-role-map][^tsmc-ime][^tsmc-amhs][^tsmc-yield][^tsmc-product]

技術內容也停在「單顆邏輯晶片＋傳統 2.5D 封裝」視角。2025–2026 的工作重心已包括 N2 奈米片、A16 背面供電、High-NA、AI 輔助設備維護、先進製程控制、CoWoS-L、SoIC／混合鍵合、HBM4、CPO、封裝協同設計與高功率／高平行度測試。這些變化會直接新增或重塑製程整合、鍵合、薄化、量測、良率、熱／電源完整性、測試與自動化職務。[^tsmc-ar][^asml-ar][^amat-logic][^amat-bond][^kla-ar][^tsmc-symposium][^teradyne-hbm]

## 逐章查核與改稿方向

### 06 製程工程師總覽

- **流程圖錯把製程畫成一次性直線。** 實際晶圓製造會反覆經過薄膜、微影、蝕刻、清洗、量測與熱處理；建議改成「模組反覆迭代＋inline metrology/inspection＋WAT/E-test」的循環，不要用 `Photo → Etch → Implant → Dep → Anneal → CMP → Metal` 表示真實順序。KLA 2025 年報把 wafer/reticle inspection 與 metrology 列為先進邏輯、HBM 與先進封裝的核心 process control，足以證明量測不是流程尾端的附屬工作。[^kla-ar]
- **專長分類嚴重不全。** 至少補 wet clean、diffusion/thermal、ion implant、epitaxy、metrology/inspection、defect/yield、WAT，以及先進封裝的 bonding、thinning、electroplating；TEL 2025 官方合作內容同時列 patterning、etch、wet processing、deposition 與 3D integration，Applied 2026 新設備也顯示 GAA 需要材料改質、angstrom-level etch/ALD 與新接觸金屬。[^tel-imec][^amat-logic]
- **「12 小時輪班是 PE 標準配置」不可一概而論。** 官方職缺顯示工時依廠區、職務與 assignment 而異；JASM MFG 明載 normal 與 4/2 shift 兩種，UMC PIE 則同時標示日班與需輪班。應改成「量產／值班職缺可能輪班或 on-call，以職缺與部門為準」。[^jasm-ime][^umc-pie]
- **職務能力須加入先進節點新斷點。** N2 已於 2025 Q4 量產，A16 將奈米片與背面供電結合並排定 2026 下半年生產；製程章應說明 GAA nanosheet、背面接點／供電、材料與整合複雜度，而非只把 3nm/2nm 寫成更小 CD。[^tsmc-ar]

### 07 微影工程師

- **「EUV 用於 7nm 以下、DUV 用於 28nm 以上」是錯誤二分法。** 先進節點只有部分 critical layers 使用 EUV，其餘層仍使用 DUV；ASML 2025 年報亦把 0.33 NA EUV、0.55 NA High-NA EUV、DUV、metrology/inspection 和 computational lithography 視為整體解決方案。表格應改成「依 layer、解析度與成本選擇，EUV 並未取代 DUV」。[^asml-ar]
- **High-NA 售價、台灣誰能買、薪資最高等敘述沒有可重現的第一手證據。** 移除「超過 4 億美元」「全台灣只有台積電能買」「ASML AE 薪資頂端」等絕對句；若保留價格與薪酬，必須另建年度化方法與來源，不可混入技術章。
- **工作內容漏掉 resist/underlayer、mask、pellicle、stochastic defect、overlay/metrology、computational lithography 與 scanner-track co-optimization 的界面。** TEL 與 imec 2025 合作明確把 High-NA patterning、材料系統、defectivity control 和 EUV resist coating track 串在一起。[^tel-imec]
- **設備商角色稱謂要拆開。** 客戶支援現場常同時存在 field service/customer support、applications/process support；不可把所有原廠人員統稱 FAE 或 AE。ASML 2025 年報描述的工作已包含預測維護、reactive diagnostics、知識檢索與 root-cause AI agent，但複雜 EUV 仍須工程師用物理規則驗證。[^asml-ar]

### 08 蝕刻／薄膜／CMP

- **3nm/2nm 挑戰過度簡化成 HAR 與 ALE。** 應加 GAA nanosheet release/shape control、選擇性沉積／蝕刻、新接觸金屬與背面供電；Applied 2026 已把 atomic-level nanosheet smoothing、angstrom-level conductor etch、ALD molybdenum contact 列為 2nm 以下量產設備。[^amat-logic]
- **薄膜分類不能只列 CVD/ALD/PVD。** 實務還涉及 epitaxy、electrochemical deposition、surface treatment／clean、材料選擇與整合；先進封裝的 hybrid bonding 更把 CMP 平坦度、表面活化、清洗、overlay 與 queue-time 控制綁成同一條製造問題。[^amat-bond][^tel-3di]
- **職務頁應增加量測與良率接口。** 先進 3D 結構的缺陷定位、深層成像、inline metrology 與 drift detection 已是設備／製程共同工作；不能只把 SPC 寫成看膜厚或均勻性。[^amat-bond][^kla-ar]

### 09 製程整合工程師

- **「通常不是起點、博士是實際主流、PE 3–6 年後轉 PIE」不成立。** 台積電 2025 校園招募直接招 Process Integration Engineer；聯電 2026 PIE 接受應屆碩士且工作包含 flow 建立、WAT、良率、客戶需求與 NPI。應改成「可由校園招募直接進入，也可由 module/device/yield 轉入；學歷與年資依研發或量產職缺而異」。[^tsmc-campus][^umc-pie]
- **PIE 的範圍需從元件參數擴充到 product/ramp/customer。** UMC 官方職缺把製程 flow、產品良率、WAT SPC、新製程、品質 issue 與 NPI 放在同一角色；現稿只強調 Vt/DIBL/TCAD，會把量產 PIE 誤寫成純 device R&D。[^umc-pie]
- **先進封裝也有 system/pathfinding integration。** 台積電校園頁分列 Integrated Interconnect & Packaging Engineer、Pathfinding for System Integration Engineer 與 Advanced Packaging Technology and Service Engineer；應避免把「Integration」限定為 CMOS 前段整合。[^tsmc-campus]

### 10 設備工程師

- **設備工程不再只是 PM、維修與零件庫存。** 應增加 condition monitoring、predictive maintenance、fault detection/classification、遠端診斷、軟體升級、資料品質與 vendor escalation；ASML 與 SEMI 2025 官方資料都把 AI 診斷與 PM automation 視為 autonomous fab 的基礎。[^asml-ar][^semi-smart]
- **設備專長缺少 clean/thermal/implant/bonding/thinning/metrology/inspection/AMHS。** 2025–2026 的 hybrid bonding 已要求 die tracing、潔淨環境、overlay/drift detection；AMHS/robotics 也由台積電獨立招募，不能全塞進一般設備工程師。[^amat-bond][^tsmc-amhs]
- **「TSMC EE 執行 EUV 特定光學元件更換」不可無來源斷言。** 應寫成 ownership/RACI 依工具、合約、認證與廠區而定；原廠 field service 與 fab EE 的邊界不能靠想像固定。

### 11 廠務工程師

- **系統分類太粗。** 台積電／JASM 官方將 FAC 分成 public utility、mechanical、electrical、water treatment、gas/chemical、projects、equipment hook-up，並負責 design、implementation、operation、maintenance、repair、improvement；書稿應按這些專業線說明，而非只有「水電氣空調」。[^tsmc-fac]
- **日常工作漏掉 commissioning/start-up、walkdown、供應品質、SPC、風險分析、節能與跨廠協作。** 官方 Water Engineer 職缺逐項列出 alarm/SPC、preventive maintenance、supply quality、RCA 與 energy efficiency。[^tsmc-fac]
- **安全描述需精確。** HF 多見於化學品／濕製程供應，不能在未限定型態下與 Cl₂ 一起概稱「特殊氣體」；應依 bulk/specialty gas、pure/slurry chemical、chemical waste 分系統，並另外說明 EHS、消防與 process safety 的專責角色。TSMC 2026 招募已明確分列 Facilities Gas & Chemical、Water、Electrical、Construction。[^tsmc-fac-us]
- **加入永續與資源循環。** 廠務職責現在同時受能源、用水、廢水、化學品回收與減碳目標驅動；TSMC 2025 年報把 fab operations 高階主管領導的節能減碳機制與水永續列為營運治理。[^tsmc-sustainability]

### 12 品質工程師

- **「AEC-Q100 認證」用詞錯誤。** AEC-Q100 是 failure-mechanism-based stress-test qualification 要求，不是 AEC 對個別晶片發證的認證制度；應寫「依 AEC-Q100 qualification」，並區分 Q100（IC）、Q101（discrete）及各附錄測試。[^aec]
- **「比消費電子嚴格 10–100 倍」沒有可驗證定義。** 刪除倍數，用溫度 grade、樣本／零失效準則、qualification matrix、change control、traceability 與客戶特定要求具體說明。
- **IATF 內容需標示版本動態。** 截至 2026-08-31，IATF 16949:2016 仍有效但第 2 版修訂中；2025 已發布 Rules 6th Edition 與多項 sanctioned interpretations/FAQ。QA 不是「維護一張證書」，還要管理 customer-specific requirements、audit、supplier quality、PPAP/APQP、FMEA/control plan 與 change notification。[^iatf-pubs][^iatf-update][^iatf-csr]
- **AQL 不宜寫成所有半導體 QA 的核心日常。** 高可靠度與車用品質更多依 qualification、SPC、control plan、traceability、零缺陷目標與客訴閉環；是否做 acceptance sampling 應依產品與客戶規範。

### 13 可靠度工程師

- **「10 年後仍有 99.9% 機率正常」是無來源的保證式說法。** 改成「用任務剖面、加速模型與統計信賴區間評估使用條件下的失效風險」，並明示不同產品的壽命、溫度與失效率目標不同。
- **不要把 Weibull 寫成所有壽命外推的單一方法。** 應依 failure mechanism 使用 Arrhenius、Eyring、Black、Coffin–Manson 等物理／統計模型，並區分 technology reliability、product reliability、package reliability、board/system reliability。
- **可靠度範圍應納入 2.5D/3D/HBM 的熱－機－電耦合。** imec 2025 對 3D HBM-on-GPU 的官方研究顯示，熱瓶頸必須做 system-technology co-optimization；這代表熱模型、功耗 map、冷卻、頻率策略、材料／結構與 workload 會跨越封裝、可靠度與系統團隊。[^imec-thermal]
- **車用章節應引用當期 AEC/IATF，而非只列 JESD22 名稱。** AEC 官方目前基準為 Q100 Rev. J，並有 ELFR、ESD、latch-up 等附屬文件；IATF 規則與客戶特定要求也持續更新。[^aec][^iatf-update]

### 14 失效分析工程師

- **流程不應固定成 `Electrical → Decap → EMMI → FIB`。** 正確教學應先強調症狀重現、chain of custody、非破壞分析與 evidence preservation，再依 package/die/electrical/physical hypothesis 選擇 X-ray、SAM、thermal/laser localization、deprocessing、FIB/SEM/TEM；不同失效不一定 decap。
- **工具價格、人才供不應求、訓練 1–2 年、直接支援特定客戶等句子皆缺第一手證據。** 建議刪除，改成可驗證的技能：electrical characterization、localization、sample prep、materials analysis、root-cause/corrective-action 閉環與報告品質。
- **FA 必須和良率及 process control 串起來。** SEMI 2026 ASMC 主題已把 reliability fail、defect-to-yield correlation、spatial/slot signature、volume diagnostics 與 ML/AI yield analysis 放在同一 yield-enhancement 方法群；書稿應畫出 FA → defect mechanism → module/PIE/equipment corrective action 的回饋路徑。[^semi-asmc]

### 15 封裝工程師

- **「2024–2025 最熱門」「需求爆增」「薪資高 OSAT 2–3 倍」都是無方法的市場判斷。** 技術頁應刪除；若要談市場，另用職缺數、資本支出、招募量與薪資樣本建立時間序列。
- **產品舉例未經第一方逐項證實。** 不要斷言特定 NVIDIA/Apple SKU 採用哪一個封裝變體；改用 TSMC/ASE 公布的平台能力與量產節點。
- **技術樹需更新。** TSMC 2025 年報顯示 CoWoS-S（Si interposer）、CoWoS-R（RDL interposer）、CoWoS-L（RDL interposer＋LSI/eDTC）、SoIC、COUPE/CPO 都已形成不同開發／量產路線；CoWoS-L 3.5-reticle 已量產，5.5-reticle 於 2026 qualification，9.5-reticle 開發中。[^tsmc-ar][^tsmc-symposium]
- **職能應由「封裝選型＋ANSYS」擴成 chip-package-system co-design。** ASE 2025 IDE 2.0 已把機械、電氣、熱、CPI、製造資料與 AI 風險預測放在同一協同設計 loop；另有 FOCoS/bridge、embedded passives、power delivery、thermal、CPO、panel-level 等路徑。[^ase-ide][^ase-focos][^ase-panel]
- **新增製造專長：** wafer/die thinning、temporary bond/debond、microbump/TCB、hybrid bonding、molding/underfill、RDL plating/lithography、substrate/assembly、warpage、inline metrology/inspection、yield/rework、thermal interface/cooling；TEL 與 Applied 2025–2026 官方設備已證實前段 clean/CMP/plasma/overlay 能力正移入 3D integration。[^tel-3di][^amat-bond]

### 16 測試工程師

- **Test Engineer 與 Product Engineer 不應合併。** 台積電 Product Engineer 官方工作是產品導入、yield/WAT、design rule、CP knowledge、跨 fab/customer 協作；Test Engineer 則偏 test methodology/program/interface/cost/coverage。建議拆成獨立頁，再另外說清 DFT、silicon validation、product engineering、wafer sort、final test、SLT 的交界。[^tsmc-product]
- **「V93000 IJTG」疑為錯字與概念混淆。** 應為 IJTAG（IEEE 1687），且 V93000 的現行 SmarTEST 8 官方介面為 Java-based；不能概括成「C/C++/Python 或 IJTG」。[^advantest-v93000]
- **「V93000 台灣最普及」無可核驗依據。** 改成平台能力比較，不做市場排名；同時補 memory tester、handler/prober、probe card、socket/load board、thermal control 與 interface engineering。
- **HBM 不能只寫 KGD。** 2025 Teradyne Magnum 7H 的官方 coverage 已包含 base-die wafer test、memory-core test、burn-in、pre-singulated KGSD/Chip-on-Wafer 與 post-singulated HBM，且要同時測 logic base die 與 DRAM dies；這應成為 HBM 測試流程主骨架。[^teradyne-hbm]
- **加入 high-power/high-pin-count/high-parallelism 與 SLT。** ASE 2026 新廠把 AI 封裝測試需求明列為高頻、高功率、高平行度及 system validation；V93000 亦把 extreme power、scan volume、fast yield learning 和 multisite 列為 HPC/AI 挑戰。[^ase-test][^advantest-v93000]

### 17 FAE／設備商 AE

- **兩類角色分法仍太粗。** 建議至少拆為 semiconductor product FAE、equipment application/process engineer、field service/customer support engineer、installation/upgrade engineer；其 ownership、輪班、潔淨室比例與升級路徑不同。
- **薪資與「最高類型」主張沒有官方比較基礎。** 移出職務內容；技術章只保留可驗證的 customer qualification、process/application optimization、tool install/upgrade、diagnostics、training 與 escalation。
- **角色已受 AI 工具改變但未被取代。** ASML 2025 官方說明 AI 用於 predictive maintenance、reactive diagnostics、knowledge search 與 RCA agent，而 EUV 複雜系統仍依賴人類工程師驗證；這比「原廠培訓認可」更能描述 2026 實際工作。[^asml-ar]

### 18 工業工程師

- **本章其實混合 IE、MFG、production control 與 CIM。** 台積電官方 IME/MFG 工作同時包含 theory of constraints、capacity/flow、scheduling/dispatch、MES/MCS、工具資料、direct-labor leadership 和跨 PE/PIE/EE 協作；應分成「工廠規劃 IE」「fab operations/MFG」「CIM/MES/data」「AMHS/robotics」四條路徑。[^tsmc-ime][^jasm-ime][^tsmc-amhs]
- **「不碰製程配方」可以保留為主要邊界，但要說明會影響 lot priority、dispatch、hold/release、qualification queue 與 productivity。** 這些決策會改變 cycle time、WIP、交期與風險，並非單純辦公室模擬。
- **工具清單過時且太具名。** 與其固定寫 Arena/FactoryWorks，不如教 optimization、simulation、SQL/Python、data pipeline、MES/MCS/APC/FDC/dispatch、digital twin 與 KPI；SEMI 2025–2026 已把 AI-driven autonomous factory、PM automation、digital twin、data integrity 與 factory-level optimization 定為智慧製造主軸。[^semi-smart]
- **學歷門檻與「好入門」是缺證據的價值判斷。** 官方 IME 職缺接受工工、製造、管理、資工、自動化、數學／統計等多背景，但仍要求 optimization/IE/IT 與現場領導能力；應改成條件地圖。[^tsmc-ime]

### 21 CoWoS 跨職務合作

- **章名可以保留，但案例不應再固定為 H100。** 應以「AI accelerator＋多顆 HBM＋2.5D/3D integration」作匿名 reference design，避免 SKU、die size、良率與封裝變體快速過時。
- **CoWoS-S Gen 5、約 2500 mm²、RDL 0.4–2 µm、拼接 overlay <10 nm、RDL 需 ArF immersion/EUV 等數字缺乏第一手依據，且混淆 silicon interposer BEOL 與 package RDL。** 全部改成「依世代／平台 PDK」並引用官方 roadmap；TSMC 2025 公布的是 9.5-reticle CoWoS 將於 2027 量產、可整合 12 顆以上 HBM，不能自行反推線寬與 overlay。[^tsmc-symposium]
- **「CoWoS 微影核心合作方是 ASML EUV AE」沒有官方證據。** 刪除整節或改為中立的 lithography/tool-vendor interface，並納入 coat/develop、inspection/metrology、plating、bonding、CMP、thinning 等設備商，不應讓 EUV 成為先進封裝萬用解釋。Applied 2025 公開的 packaging roadmap甚至另列 sub-2µm maskless digital lithography，顯示封裝圖案化工具路徑不只 scanner。[^amat-packaging]
- **TSV 流程不應斷言一律 via-last，也不應把所有 liner 寫成 SiO₂ ALD、所有 seed 寫成 PVD。** 改成「示意流程，實際 via scheme／liner-barrier-seed-fill 依 interposer/HBM/platform 而異」，讓製程整合章負責比較。
- **KGD 段落須升級為 KGD/KGSD 與多階段測試。** HBM4 已包含 logic base die 與 DRAM stack；2025 的量產測試平台涵蓋 base-die wafer、pre-singulated stack/CoW、post-singulated stack、burn-in，不能只畫 GPU wafer sort → package FT。[^teradyne-hbm]
- **合作圖漏掉以下核心角色：** package/system architect、3DIC/PDK/EDA methodology、HBM base-die/DRAM design and test、substrate/OSAT assembly、bonding/thinning、thermal/mechanical、signal/power integrity、metrology/inspection、yield/data、supply/capacity、quality/change-control、SLT/system validation。TSMC 已把 N12/N3 logic base die、IVR、CPO、9.5-reticle/12+ HBM 與 3DFabric ecosystem 放在同一路線；ASE 也把 HBM、bridge/TSV、power delivery、thermal 與 co-design 視為共同問題。[^tsmc-symposium][^ase-focos][^ase-ide]
- **可靠度段落的固定 `-55°C↔125°C ×1000` 與 drop test 不應套用所有 CoWoS。** qualification plan 必須依 package、use condition、customer/spec 與 failure mechanism 制定；熱管理還需 workload-aware system-level co-optimization。[^imec-thermal][^aec]

## 必須補上的職務頁

優先新增以下四頁，因為它們已有明確官方職缺邊界，且無法靠現有章節的一小段補完：

1. **良率／缺陷工程師（Yield Enhancement / Defect / Inspection）**：defect roadmap、brightfield/darkfield/e-beam inspection、SPC excursion、spatial/volume diagnostics、module/PIE/FA 閉環。[^tsmc-yield][^semi-asmc]
2. **產品工程師（Product Engineer）**：NPI/ramp、產品 yield/WAT/CP、process window、device/circuit/layout correlation、客戶與 fab 協作；與 test engineer 分頁。[^tsmc-product]
3. **智慧製造／製造工程師（IME/MFG）**：daily fab operation、capacity/flow、smart scheduling/precise dispatch、DL leadership、productivity/quality defense。[^tsmc-ime]
4. **CIM／MES／AMHS／機器人自動化工程師**：MES/MCS、equipment integration、data/status collection、dispatch engine、AMHS install/sustain、robotic workstation 與系統可靠度。[^jasm-ime][^tsmc-amhs]

第二優先可在既有頁中加專節，資料量再大時才獨立成頁：metrology/inspection engineer、wet clean/diffusion/implant/epi PE、advanced packaging bonding/thinning engineer、package SI/PI/thermal engineer、substrate engineer、SLT/system validation engineer、supplier quality/change-control engineer、EHS/process-safety engineer。

## 建議重寫順序

1. 先重畫職務地圖並新增 Yield、Product、IME/MFG、CIM/AMHS 四頁。
2. 再修正 06、09、16、18 的角色邊界，避免同一工作在多頁互相矛盾。
3. 更新 15、21 的 CoWoS/HBM 技術與協作流程，移除未證實的 SKU、尺寸、overlay、薪酬與市場排名。
4. 最後才逐章更新工具、技能、學歷、輪班與職涯；薪資另做有方法的年度附錄。

## 第一手來源

[^tsmc-role-map]: TSMC，「Together We Grow」招募頁，發布：2025（頁面未標示確切日）；查證：2026-08-31。https://careers.tsmc.com/zh_TW/careers/JobDetail/Together-We-Grow/5445
[^tsmc-campus]: TSMC, “2025 Campus Recruitment,” 發布：2025；查證：2026-08-31。https://www.tsmc.com/static/english/careers/campus_recruitment_2025/index.html
[^tsmc-ime]: TSMC, “2025 TSMC Southeast Asia & India — Intelligent Manufacturing Engineer,” 發布：2025-09-12；查證：2026-08-31。https://careers.tsmc.com/en_US/careers/JobDetail?jobId=17663&source=External+Career+Site
[^tsmc-amhs]: TSMC, “Fall 2026 TSMC Arizona Engineering Full-Time Opportunities,” 發布：2026-08（頁面職缺）；查證：2026-08-31。https://ro.careers.tsmc.com/job/Phoenix-Fall-2026-TSMC-Arizona-Engineering-Full-Time-Opportunities-%28Phoenix%2C-AZ%29-AZ-85001/1366233566/
[^jasm-ime]: TSMC/JASM, “MFG Intelligent Manufacturing Engineer,” 發布：2026-07-18；查證：2026-08-31。https://ro.careers.tsmc.com/job/Kumamoto-JASM-MFG-Intelligent-manufacturing-engineer-%283783%29-43/780587910/
[^tsmc-yield]: TSMC Arizona, “Yield Excellence Engineer,” 發布：2026-08-30；查證：2026-08-31。https://ro.careers.tsmc.com/job/Phoenix-Yield-Excellence-Engineer-AZ-85001/1063086966/
[^tsmc-product]: TSMC, “2025 Campus Recruitment — Product Engineer,” 發布：2025-02-10；查證：2026-08-31。https://careers.tsmc.com/de_DE/careers/JobDetail/2025-Campus-Recruitment-Product-Engineer-PE/15386
[^umc-pie]: UMC，「製程整合工程師_竹科」，更新：2026-07-23；查證：2026-08-31。https://careers.umc.com/jobin.php?mid=67
[^tsmc-fac]: TSMC/JASM, “Facility Water Engineer,” 發布：2026（頁面未標示確切日）；查證：2026-08-31。https://ro.careers.tsmc.com/job/kumamoto-jasm-facility-facility-water-engineer-%286147%29-43/1057244766/
[^tsmc-fac-us]: TSMC, “Fall 2025/Spring 2026 Engineering Career Opportunities,” 發布：2026（頁面未標示確切日）；查證：2026-08-31。https://ro.careers.tsmc.com/job/Phoenix-Fall-2025-TSMC-Career-Opportunities-%28Arizona-California-Texas-Washington-Canada%29-AZ-85001/1213554866/
[^tsmc-ar]: TSMC, *2025 Annual Report*, 發布：2026；查證：2026-08-31。https://investor.tsmc.com/static/annualReports/2025/english/index.html
[^tsmc-sustainability]: TSMC, *2025 Annual Report — Greenhouse Gas Emission Reduction and Energy Management*, 發布：2026；查證：2026-08-31。https://investor.tsmc.com/sites/ir/annual-report/2025/2025%20Annual%20Report_E.pdf
[^tsmc-symposium]: TSMC, “2025 North America Technology Symposium,” 發布：2025-04-23；查證：2026-08-31。https://pr.tsmc.com/chinese/news/3228
[^asml-ar]: ASML, *2025 Annual Report — Strategy & Stories*, 發布：2026；查證：2026-08-31。https://www.asml.com/en/investors/annual-report/2025/strategy-and-stories
[^tel-imec]: Tokyo Electron, “Tokyo Electron and imec extend partnership to accelerate the development of beyond-2nm nodes,” 發布：2025-06-16；查證：2026-08-31。https://www.tel.com/news/topics/2025/20250616_001.html
[^tel-3di]: Tokyo Electron, “TEL’s R&D at the Forefront of the Advanced Packaging Era,” 發布：2025-09-30；查證：2026-08-31。https://www.tel.com/blog/all/20250930_001.html
[^amat-logic]: Applied Materials, “Transistor and Wiring Innovations for Faster AI Chips,” 發布：2026-02-10；查證：2026-08-31。https://ir.appliedmaterials.com/news-releases/news-release-details/applied-materials-unveils-transistor-and-wiring-innovations
[^amat-bond]: Applied Materials, “Next-Gen Chipmaking Products to Supercharge AI Performance,” 發布：2025-10-07；查證：2026-08-31。https://ir.appliedmaterials.com/news-releases/news-release-details/applied-materials-unveils-next-gen-chipmaking-products/
[^amat-packaging]: Applied Materials, *SEMICON West 2025 Technology Breakfast*, 發布：2025-10-07；查證：2026-08-31。https://ir.appliedmaterials.com/static-files/1648a1dc-8b01-43c0-b666-49d06ca6c5f9
[^kla-ar]: KLA, *2025 Annual Report / Letter to Stockholders*, 發布：2025；查證：2026-08-31。https://ir.kla.com/sec-filings/all-sec-filings/content/0001193125-25-213412/0001193125-25-213412.pdf
[^semi-smart]: SEMI, “Smart Manufacturing,” 內容含 2025 industry survey；頁面日期未標示；查證：2026-08-31。https://www.semi.org/cn/industry-groups/smart-manufacturing
[^semi-asmc]: SEMI, *ASMC 2026 Call for Abstracts Topics*, 發布：2025-08；查證：2026-08-31。https://www.semi.org/sites/semi.org/files/2025-08/ASMC26_CFA_Topics.pdf
[^aec]: Automotive Electronics Council, “AEC Documents — AEC-Q100 Rev. J and supplements,” 頁面日期未標示；查證：2026-08-31。https://www.aecouncil.com/AECDocuments.html
[^iatf-pubs]: IATF, “IATF Publications,” 更新含 2025-01 Rules 6th Edition / Auditor Guide；查證：2026-08-31。https://www.iatfglobaloversight.org/iatf-publications/
[^iatf-update]: IATF, “IATF 16949 2nd Edition Update Information,” 發布：2026-07-30；查證：2026-08-31。https://www.iatfglobaloversight.org/news/30-july-2026-iatf-stakeholder-communique-iatf-16949-2nd-edition-update-information/
[^iatf-csr]: IATF, “Customer Specific Requirements,” 更新至 2026；查證：2026-08-31。https://www.iatfglobaloversight.org/oem-requirements/customer-specific-requirements/
[^imec-thermal]: imec, “Imec mitigates thermal bottleneck in 3D HBM-on-GPU architectures,” 發布：2025-12-08；查證：2026-08-31。https://www.imec-int.com/en/press/imec-mitigates-thermal-bottleneck-3d-hbm-gpu-architectures-using-system-technology-co
[^ase-ide]: ASE, “ASE Unveils IDE 2.0,” 發布：2025-11-04；查證：2026-08-31。https://ase.aseglobal.com/press-room/ide2/
[^ase-focos]: ASE, “FOCoS-Bridge with TSV,” 發布：2025-05-28；查證：2026-08-31。https://ase.aseglobal.com/press-room/ase-announces-focos-bridge-with-tsv/
[^ase-panel]: ASE, “Automated 310mm Panel-Level Packaging,” 發布：2026-05-26；查證：2026-08-31。https://ase.aseglobal.com/press-room/310x310/
[^ase-test]: ASE, “New High-Tech Facility in Kaohsiung,” 發布：2026-03-11；查證：2026-08-31。https://ase.aseglobal.com/press-room/ase-breaks-ground-on-new-high-tech-facility-in-kaohsiung/
[^teradyne-hbm]: Teradyne, “Magnum 7H — Next-Generation Memory Tester for HBM,” 發布：2025-08-04；查證：2026-08-31。https://investors.teradyne.com/news-events/press-releases/detail/419/teradyne-unveils-magnum-7h---the-next-generation-memory-tester-for-high-bandwidth-memory-devices
[^advantest-v93000]: Advantest, “V93000 EXA Scale,” 現行產品頁（頁面未標示發布日）；查證：2026-08-31。https://www.advantest.com/en/products/semiconductor-test-system/soc/v93000/
