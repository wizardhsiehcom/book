# 設計、驗證、DFT、EDA／PDK、韌體與 AI 職務研究

查證日：**2026-08-31**
研究範圍：`01-ic-design.md`、`02-layout.md`、`03-verification.md`、`04-dft.md`、`05-eda-cad.md`、`19-ai-software.md`，並參照 `00-map.md` 與 `appendix-trends.md`。
證據原則：職務邊界以 2025–2026 公司官方職缺為主；工具、模型與介面以供應商及標準組織資料為主；年報用於產業方向；論壇只記錄求職者如何理解職稱，不拿來證明技術或薪資事實。

---

## 一、編修摘要：最該先改的十件事

1. **不要再用「IC 設計工程師」涵蓋整條數位流程。** 至少拆成架構／微架構、RTL 前端、SoC/IP 整合、功能驗證、形式驗證、模擬加速／FPGA 原型、DFT、合成／STA、physical design、signoff、post-silicon validation。聯發科與 NVIDIA 的現行職缺已直接按這些交付物區分。[S1][S2][S3][S4][S5]
2. **`Frontend / Backend` 不是跨公司一致的職稱。** 聯發科把 physical-aware synthesis、STA、netlist QC、DFT insertion 稱為 BE；NVIDIA 的 physical-design 職缺則把 synthesis、STA、floorplan、P&R 到 GDSII 納入同一範圍。正文應先講交付物，再附公司常見別名，避免用 FE/BE 猜工作內容。[S1][S4]
3. **類比 layout 與數位 physical design 必須分頁或至少分成兩條完整職涯。** 前者是 schematic-to-layout 的 custom implementation；後者是 RTL/netlist-to-GDS 的自動化實作與 signoff。現在的頁名與開場把兩者當成同一件事，會誤導求職者。[S4][S6]
4. **DV、formal、emulation、AMS verification、post-silicon validation 不應混成一職。** UVM 是重要方法但不是所有驗證職的共同必備；formal、connectivity、低功耗、效能、混合訊號、矽後驗證的工具與交付物不同。[S2][S3][S7][S8]
5. **DFT 頁工具與工作流程過時。** `DFT Compiler / TetraMAX / Mentor Tessent / FastScan` 應更新成現行產品線 `Synopsys TestMAX`、`Siemens Tessent`，並加入 hierarchical DFT、compression、test power、diagnosis、repair、IJTAG、IEEE 1838 與 chiplet DFx。[S9][S10][S11][S12]
6. **PDK 頁有明確技術錯誤。** `BSIM-IMG` 是 independent multi-gate／FD-SOI 類模型；一般共同閘 multi-gate／FinFET／GAA 應看 `BSIM-CMG`。不能寫成「N3/N2 的 BSIM-IMG」。[S13][S14]
7. **PDK 不是單一工程師同時做模型、PCell、DRC/LVS 與 display。** 應拆成 compact-model/device modeling、physical-verification rule deck、PCell/techfile、digital collateral、QA/release、foundry enablement/customer support 等工作包。[S15][S16][S17]
8. **AI 晶片職務目前混了四種人。** 應拆成 AI 演算法／模型、NPU 架構與 RTL、compiler/runtime/kernel、模型部署與效能工程。現行 NPU compiler 職缺要求 LLVM/MLIR；這不是「把 TensorFlow/PyTorch 模型移植」一句可涵蓋的工作。[S18][S19]
9. **韌體不等於寫 MCU + 幾個 bus driver。** 現行職缺涵蓋 boot、secure update、telemetry、BIOS/UEFI、BMC/OpenBMC、RTOS、Linux kernel、board/chip bring-up、量產與客戶 debug；應按執行環境與產品生命週期拆開。[S20][S21][S22][S23]
10. **所有薪資表先撤下「職務精準區間」的權威語氣。** 目前沒有來源、樣本、地區、職級定義、年份或現金／股票口徑。證交所公司級非主管全職薪資可以當公司基準，但不能反推某一角色或新鮮人薪資。[S24][S25]

---

## 二、建議採用的設計職務地圖

### 2.1 數位晶片從規格到量產

| 階段 | 建議職稱 | 核心交付物 | 不要混淆 |
|---|---|---|---|
| 產品與架構 | System/SoC Architect、Performance Architect | workload、系統規格、效能／功耗模型、介面與 partition | 不等同 RTL coding |
| IP 前端 | Microarchitecture / RTL Design Engineer | microarchitecture spec、RTL、lint/CDC/RDC 基本品質、block constraints | 設計者會做 unit check，但不等同獨立 DV signoff |
| 整合 | SoC/IP Integration Engineer | IP 接合、clock/reset/power/IOMUX、top-level RTL、constraints、整合 QC | 「整合」不是只把檔案接起來；涉及介面、test mode、低功耗與 package/pad ring |
| 功能驗證 | IP/Subsystem/SoC DV Engineer | verification plan、TB/BFM/checker、assertion、coverage、regression、bug closure | 與 post-silicon validation 分開 |
| 形式與靜態驗證 | Formal / Static Verification Engineer | properties、proof、equivalence、CDC/RDC、low-power/connectivity signoff | 不一定以 UVM 為主 |
| 硬體輔助驗證 | Emulation / FPGA Prototyping Engineer | emulator model、mapping、transactor、早期軟體平台、效能 debug | 不是單純「把 RTL 移植到 Palladium/Veloce」 |
| 可測試設計 | DFT Engineer | test architecture、scan/compression、ATPG、MBIST/BISR、IJTAG、coverage與tester-ready patterns | 與量產 Test Engineer 的 ATE program、limits、correlation 分開 |
| 前實作 | Synthesis / STA / Design Implementation Engineer | synthesis、SDC、MMMC STA、netlist QC、LEC、early PPA | 在台灣部分公司稱 BE，但也可能併入 PD |
| 實體實作 | Physical Design / P&R Engineer | partition/floorplan、power/clock、place-route、timing closure、ECO | 不等同 analog layout |
| Signoff | Timing / SI / PI / Physical Verification Engineer | STA、crosstalk、IR drop、EM、DRC/LVS/ERC、signoff closure | 有些公司由 PD owner，有些另有專職 |
| 矽後 | Silicon Validation / Productization Engineer | bring-up、lab validation、pre/post-silicon correlation、errata、量產弱點分析 | 不應全部塞進 pre-silicon DV |

**證據。** 聯發科 2026 的 SoC BE 職缺列出 physical-aware synthesis、DFT insertion、STA、netlist QC 與 PPA；整合職缺列出 package、floorplan、IOMUX、clock/reset、DFT architecture、SDC 與多種 static checks。NVIDIA 2026 的 physical-design 職缺明列 RTL-to-GDSII、floorplan、P&R、STA、IR/EM 與 physical verification；padring verification 職缺則另列 connectivity、assertion、coverage、DFT test access 與 chip assembly。[S1][S4][S5]

### 2.2 「前端／後端」應怎麼寫才不誤導

可採以下措辭：

> 業界常用 frontend/backend，但邊界依公司與團隊而異。求職時不要只看職稱，要看交付物：是否寫 RTL、做 SoC integration、負責 synthesis/STA、操作 P&R，或做 signoff。部分台灣公司把 synthesis、STA、netlist QC、DFT insertion 稱為「數位後端」；另一些公司則用 backend 專指 physical design。

論壇可作為「職稱確實造成困惑」的旁證：2025–2026 的台灣求職討論經常把 DV、DFT、APR、CAD 並列，也有人把「數位前端（後端）」職缺實際工作描述為 DFT。這只證明求職者需要交付物導向的解釋，不證明某家公司固定怎麼命名。[C1][C2]

---

## 三、逐頁問題與可直接採用的修訂論點

## `01-ic-design.md`

### A. 過度簡化或不準確

- 「三大分支」只分數位／類比／RF，遺漏 mixed-signal、memory、standard-cell/library、I/O/SerDes、silicon photonics 等職域，也把數位設計內部極不同的角色壓成一欄。
- 數位段把 RTL、synthesis、STA、CDC、UPF、floorplan 對齊都寫成同一位 IC designer 的日常。小團隊可能如此，大型 SoC 團隊通常有 design、integration、DV、DFT、PD/CAD 等 owner；正文應解釋公司規模造成的範圍差異。[S1][S2][S4][S5]
- 「CPU / GPU / AI 加速器微架構（2024–2025 加分項）」已不應稱單純加分。對特定 team 它就是主要 domain；其他產品線（connectivity、display、PMIC）則未必相關。[S19][S26]
- 「類比設計師手動畫關鍵 layout」不宜寫成普遍日常。現行 RFIC 職缺用的是 **design, supervise layout, characterize**，顯示 designer 常與專職 layout 合作；是否親畫取決於公司、IP 與 seniority。[S27]
- 學歷段「博士可直接進資深職級，升遷較快」沒有可靠依據，應刪除。現行職缺可看到聯發科多要求碩士，但 NVIDIA 的 PD/DV 有 BS/MS 或 equivalent experience；應寫成「依公司與職缺」，不要絕對化。[S2][S4][S26]
- 「MediaTek、Novatek 幾乎只招碩士以上」目前只查到聯發科多個職缺支持，未查到聯詠官方完整樣本，不能一起下結論。

### B. 建議補寫

- 新增「數位設計內部分工」表：architecture、RTL、integration、design implementation、PD/signoff，以及它們和 DV/DFT 的介面。
- 類比新增：spec → topology → transistor sizing → PVT/Monte Carlo → post-layout PEX → EM/IR/reliability → lab characterization；說明 analog designer 與 analog layout 的來回迭代。
- RF 新增：transceiver/PLL/SerDes architecture、passive/EM、package/board/antenna co-design、calibration、characterization。聯發科現行職缺明列 layout supervision、量測 characterization、scaled-CMOS effect 與 EM 工具。[S27]
- 新增 mixed-signal boundary：real-number/behavior model、analog/digital interface、power-aware/timing model。聯發科的官方職類材料把這些列為獨立 verification/modeling 工作。[S7]
- 把 employer 表改成「產品公司／ASIC design service／IP／foundry design enablement」，不要把 eMemory 寫成一般 design service，也不要把 TSMC 簡化成只有 IP/standard cell。

## `02-layout.md`

### A. 標題與定位要重做

- 「Layout / 實體設計」不是同義詞。建議標題改為「Analog Layout 與 Digital Physical Design」，若篇幅允許則拆頁。
- 開場「把電路圖翻譯成幾何圖形」「最後一道設計關卡」只適合極簡 analog-layout 說法，也忽略 signoff、mask data prep、tapeout checks，以及 PD 從 netlist/constraints 出發而非 schematic 手工翻譯。

### B. Digital PD 遺漏

- 應補 MMMC、congestion、hierarchical partition、ECO、SI/crosstalk、IR drop、electromigration、ERC、power integrity、physical-aware synthesis、formal equivalence、flow automation。NVIDIA 現行 PD 職缺逐項列出這些責任。[S4][S6]
- `Calibre` 不是唯一 physical verification 選項；官方職缺也列 Synopsys ICV，正文應用「例如」而非暗示單一標準。[S4][S16]
- 先進節點不要只列 fin spacing/via direction；應說明職涯真正新增的是更強的 design-technology co-optimization、power delivery、multi-patterning/pattern restrictions、可靠度與 signoff 複雜度。若沒有 foundry 可公開規則，不應編造 N2 細節。
- 加入 package/3DIC 介面：die boundary、bump、RDL、thermal/power integrity、die-to-die links。TSMC 2025 年報已把 3DFabric 的 EDA/IP/DCA/VCA/test/memory/substrate/OSAT 協作列為系統級 design enablement。[S17]

### C. Analog Layout 遺漏

- 除 common-centroid/interdigitation 外，補 matching hierarchy、dummy、guard ring、latch-up/ESD、substrate noise、current density/EM、IR、density/fill、PEX 後迭代、版圖相依效應與 signoff deck。
- 說明「rule deck management」通常屬 PDK/PV/CAD owner，不是每位 analog layout engineer 的共同工作。

## `03-verification.md`

### A. 60–70% 句子需要精確化

- 可保留產業重要性，但不能把不同口徑拼成精確事實。Cadence 官方頁稱 verification phase 平均超過 SoC development cycle 的 70%；2024 Siemens/Wilson 調查則是 597 份有效樣本、討論 first-silicon success、語言／方法／技術採用等。建議寫成：「供應商資料常估 verification 佔複雜 SoC 開發的大半；例如 Cadence 稱平均超過 70%。不同調查對 project time、engineering effort、verification-only time 的分母不同，數字不可直接互換。」[S28][S29]
- 若引用 2024 調查，可用有明確母體的結果：597 eligible participants；受訪 IC/ASIC 專案 first-silicon success 為 14%。但須標示這是 survey result，不應外推所有產業。[S29]

### B. 角色邊界與漏項

- UVM 不應寫「必備」給所有驗證職。對 simulation DV 常見；formal、static/CDC、AMS model、post-silicon、performance verification 可能不是核心。[S2][S3][S7][S8]
- 將工作拆成：verification planning、simulation DV、assertion/formal、coverage closure、low-power verification、emulation/prototyping、mixed-signal verification、performance verification、silicon validation。
- `Palladium / Veloce` 應說是硬體輔助驗證平台，工作包含 compilation/mapping、transactor、debug、早期 firmware/software bring-up，不只是「把 RTL 移植」。
- `Silicon Bring-up` 建議移到「相鄰角色」：有些 DV 會參與，但通常由 silicon validation/system/firmware/product teams 共同 owner。聯發科另開 post-silicon 職缺，明列 CP/FT、DVT、HQA、pre/post-silicon correlation 與 DPPM reduction。[S8]
- 加入 verification scope：IP、cluster/subsystem、SoC/full-chip，以及 spec-to-plan-to-coverage traceability。NVIDIA/聯發科現行職缺都明列這些層次。[S2][S3]
- 協定不能只列 AXI/PCIe/USB/DDR/Ethernet；2025–2026 HPC/AI 角色應加入 CXL、CHI、UCIe，並強調「只學自己領域的協定」。[S26][S30]

## `04-dft.md`

### A. 明確錯誤與過時

- DFT 不是「晶片出廠後」才讓它可測；test architecture、scan/MBIST/IJTAG 必須在設計階段規劃、插入、驗證、signoff，patterns 才在 wafer sort/final test 使用。
- `Synopsys DFT Compiler / TetraMAX` 是舊產品線描述。現行官方產品是 TestMAX DFT / ATPG；TestMAX DFT 支援 scan、core wrapping、test point、compression、IEEE 1500/1687、tester-ready STIL/SVF/WGL 與 diagnosis。[S9]
- `Mentor Tessent` 品牌應改為 `Siemens Tessent`。`FastScan` 不宜當現行總稱。[S10]
- 「故障覆蓋率 ≥98%」不能當通用目標。coverage 取決於 fault model、產品品質／安全目標、不可測邏輯、pattern count、test time/power 與成本；應改成「依產品 target 管理 stuck-at、transition、cell-aware 等 coverage 與逃逸風險」。
- 「與測試廠協作將向量轉 ATE 格式」太窄。主要介面常是 Product/Test Engineering、DFT verification、foundry/OSAT 與 ATE team；DFT 工程師的交付物是 tester-ready patterns、protocol/constraints、coverage、diagnosis collateral，不必本人寫量產 test program。

### B. 2025–2026 必補

- hierarchical DFT、EDT/test compression、test-point insertion、physically aware scan、test timing/power、X handling、diagnosis/yield learning、memory repair/BISR、analog/mixed-signal test access、in-system/in-field test。
- 標準地圖：IEEE 1149.1 boundary scan、IEEE 1500 embedded-core test、IEEE 1687 IJTAG（ICL/PDL）、IEEE 1838 3D stack test access。[S9][S11][S12]
- chiplet/3DIC：pre-bond、mid/post-stack、inter-die connection、die wrapper/test access。IEEE 1838 是 die-centric standard；Siemens 2026 multi-die 資料明列 IEEE 1838 hardware、package BSDL、inter-die patterns 與多標準支援。[S11][S12]
- UCIe 2.0 已加入 SiP manageability、test/debug/telemetry 的 UDA；UCIe 3.0（2025-08-05）再加入 48/64 GT/s、早期 firmware download、sideband/event 與 manageability。DFT、firmware、package validation 的協作會更緊密。[S30][S31]

## `05-eda-cad.md`

### A. 三角色其實至少是八類

建議改成下表，否則讀者會以為「會 Tcl/Python、管 license、寫 DRC」就是同一條職涯。

| 大類 | 常見子角色 | 主要工作 |
|---|---|---|
| Design-company CAD / methodology | frontend CAD、DV CAD、DFT CAD、PD/signoff CAD、custom/analog CAD | flow、tool qualification、methodology、regression、support、compute/license |
| Foundry design enablement | PDK integration/release、reference flow、EDA certification、customer enablement | 交付與驗證設計 collateral、版本／節點 release、partner certification |
| Device modeling | compact-model/model-card engineer | characterization、parameter extraction、model QA、PVT/statistical/reliability models |
| PCell / techfile | custom PDK developer | layers、connectivity、PCell、symbols、techfile、layout environment |
| Physical verification | DRC/LVS/ERC/DFM rule-deck engineer | foundry rule translation、deck development、validation、debug |
| Digital enablement | standard-cell/memory/IP collateral engineer | Liberty、LEF/tech LEF、RC tech、power intent、validation |
| EDA vendor R&D | algorithms、compiler、distributed systems、UI/database、AI/ML | 開發產品本身；語言不只 C++，依 team 而異 |
| EDA application/product/QA | AE/CAE/FAE、product engineer、QA | customer adoption、reproduction/debug、benchmark、requirements feedback、release quality |

### B. PDK 技術修正

- PDK 是 versioned design enablement package，不只是「製程說明書」。至少涵蓋 model、rule deck、tech/layer/connectivity、PCell、extraction、文件與 QA；digital flow 還需要 LEF/Liberty/RC tech、reference flows、IP/library collateral，實際 packaging 依 foundry/product 而異。[S15][S17]
- 現稿「N3/N2 的 BSIM-IMG」應刪。Berkeley BSIM 官方定義：BSIM-CMG 是 common multi-gate（含 FinFET；FAQ 亦涵蓋 all-around gate），BSIM-IMG 是 independent multi-gate，並被選為 FD-SOI standard model。[S13][S14]
- 不要寫成單一 PDK 工程師「萃取 SPICE 模型、寫 Calibre rules、建 PCell、設 Display」。官方職缺顯示 runset development 本身就是深專業職：DRC/LVS/fill、先進節點、CMOS layout、ASIC flow、ICV/Calibre/Pegasus 與 scripting。[S16]
- 補 release engineering：version compatibility、golden tests、regression、change control、customer bug reproduction、tool-vendor certification。TSMC OIP 將 EDA certification、design enablement、advanced process/package ecosystem 明列為核心。[S15]

### C. EDA AI 更新

- 不要再只寫 DSO.ai/Cerebrus 是「GNN 用於繞線」。2025 Cadence Cerebrus AI Studio 已主打 agentic multi-block/multi-user SoC closure；2025 Synopsys.ai Copilot 已擴到 RTL generation、formal assertion generation 與跨 EDA stack assistant。[S32][S33]
- 2026 聯發科已招募「數位設計 AI 開發工程師」，工作是 LLM/agentic workflow 用於 RTL optimization、simulation/formal TB generation，且要求 RTL/SV/EDA 與 RAG/AI API/fine-tuning 的交集。[S19]
- 2026 Synopsys 台灣職缺包含 Verdi Assistant（LLM/MCP/Agent）與 C/C++ R&D，顯示 EDA 軟體職涯已同時需要 domain + software + AI，但不能把所有 CAD engineer 都改名 AI engineer。[S34]

## `19-ai-software.md`

### A. AI 晶片端應拆四層

1. **AI algorithm/model engineer**：模型架構、訓練、quantization-aware training、pruning/distillation、accuracy evaluation。
2. **NPU/accelerator architect & RTL designer**：dataflow、memory hierarchy、NoC、numeric format、PPA、RTL/verification。
3. **AI compiler/runtime/kernel engineer**：graph lowering、operator fusion、scheduling、codegen、kernel optimization、runtime、LLVM/MLIR/TVM。聯發科現行 NPU compiler 職缺把 LLVM/MLIR 列為必要。[S18]
4. **deployment/performance engineer**：model conversion、operator support、profiling、accuracy/performance correlation、SDK/customer enablement。

現稿把「設計 neural network」、「與 NPU 架構 co-design」、「把 PyTorch 模型移植到 inference engine」放在同一職稱，應改成團隊協作圖。

### B. 指標要按 workload

- `Tokens/sec` 只適合部分生成式模型；影像、語音、通訊或推薦系統可能看 fps、latency、throughput、accuracy/quality、memory footprint、bandwidth、energy/inference、TOPS/W。不要用單一指標代表 AI 推論。
- `TOPS` 也不是跨模型、跨精度的實際效能等價物；正文應提醒讀者看 end-to-end workload 與精度條件。

### C. AI for Semiconductor 要補職務邊界

- 分成 defect/metrology CV、process/yield analytics、equipment predictive maintenance、EDA optimization、data platform/MLOps。不同角色需要不同 domain owner；AI engineer 不應自行決定製程或 signoff 結論。
- 增加 data engineering、label quality、data drift、explainability、production monitoring、IP/security。這些是讓模型從 notebook 進 fab/flow 的實際工作。
- 2025–2026 的 EDA AI 已從單點 RL/ML optimization 往 GenAI/agentic workflow 走，但官方公布的 5–10x、20%、50x 等數字屬 vendor/customer claims，正文若引用必須保留「官方宣稱」與適用案例，不可當普遍生產率。[S32][S33][S35]

### D. 韌體／driver／system software 要拆開

| 類別 | 典型內容 | 代表技能 |
|---|---|---|
| On-chip firmware | MCU/RISC-V firmware、boot、power/security/controller | C、assembly、RTOS、register/protocol、JTAG/debugger |
| Platform firmware | UEFI/BIOS、BMC/OpenBMC、secure update、telemetry/manageability | C/C++、Linux、MCTP/PLDM/SMBus、security/root of trust |
| Kernel/driver | Linux/Windows kernel、device tree、DMA/interrupt/IOMMU | C、kernel internals、PCIe/I2C/SPI、concurrency |
| BSP/bring-up | bootloader、board/chip bring-up、HW/SW integration | schematic、lab tools、U-Boot/Linux/RTOS、system debug |
| Protocol/system software | 4G/5G/Wi-Fi stack、multimedia、storage/network | C/C++、real-time/performance、domain specification |
| Customer/factory firmware | production validation、compatibility、field debug、release | automation、system triage、cross-company communication |

聯發科 2025–2026 職缺包含 bootloader/driver/chip bring-up、AUTOSAR/FreeRTOS/OSEK、RISC-V、Linux kernel 與 4G/5G integration；NVIDIA 台灣職缺包含 secure update、telemetry、BMC/BIOS/OpenBMC、MCTP/PLDM 與量產/customer debug。[S20][S21][S22][S23]

---

## 四、工具、標準與名詞更新表

| 現稿 | 建議更新 | 理由／證據 |
|---|---|---|
| Mentor Calibre / Mentor Tessent | Siemens EDA Calibre / Siemens Tessent | Mentor Graphics 已是 Siemens EDA 品牌；現行資料使用 Siemens Tessent。[S10][S12] |
| Synopsys DFT Compiler、TetraMAX | Synopsys TestMAX DFT / ATPG（可在歷史註記舊名） | 現行官方產品線。[S9] |
| BSIM-IMG 用於 N3/N2 | 依元件架構選模型；common multi-gate/FinFET/GAA 看 BSIM-CMG，independent gate/FD-SOI 才看 BSIM-IMG | Berkeley BSIM 官方分類。[S13][S14] |
| UVM 必備 | simulation DV 常見；其他 verification specialty 依職務 | IEEE 1800.2 定義 UVM 的 interoperability/reuse 目的，但不能推導所有驗證職都必備。[S36] |
| Chiplet DFT 只寫 die-to-die infrastructure | 加 IEEE 1838、IEEE 1687、UCIe UDA、pre/post-stack 與 interconnect test | 2025–2026 官方標準／產品已具體化。[S11][S12][S30][S31] |
| AI EDA = GNN routing/timing prediction | 加 RL/optimization、GenAI assistant、RTL/assertion generation、agentic multi-block closure | 2025–2026 Cadence、Synopsys、聯發科官方資料。[S19][S32][S33][S35] |
| Physical Design = Layout | 分開 digital PD 與 analog/custom layout | 官方職缺的 inputs、tasks、signoff 完全不同。[S4][S6][S27] |

---

## 五、薪資與學歷：哪些能寫、哪些不能寫

### 可採用

- 聯發科 2024 年報顯示截至 2025-02-28，全球員工教育結構約 74.38% 為碩士、4.88% 為博士；這能支持「研發人才以研究所為主」，不能支持「某職缺只收某學位」或「博士直接資深」。發布：2025；查證：2026-08-31。[S37]
- 聯發科現行多個 chip-design 職缺明列碩士；NVIDIA PD/DV/firmware 職缺則有 BS/MS 或 equivalent experience。學歷應按公司與角色陳述，不應寫成全產業絕對門檻。[S2][S4][S20][S26]
- TWSE 的「非主管全時員工薪資」是公司級、跨職務統計；可當公司報酬背景。2025 年資料顯示聯發科非主管全時員工平均 446.5 萬元、中位數 355.2 萬元，但不可當 IC designer、fresh graduate 或台灣全員工的角色薪資。[S24][S25]

### 不應沿用

- 「博士直接進資深、升遷較快」。沒有一手證據且職級取決於 relevant experience、scope、interview level。
- 「MediaTek 好年 6–12 個月獎金」及所有 role/seniority 精準區間。沒有口徑與雙來源交叉。
- 「NVIDIA/Qualcomm TW 新鮮人 180–250 萬」等表格。未說明 base/bonus/RSU、vesting、匯率、樣本與時間。
- 「DFT 極度稀缺、2024–2025 薪資明顯上漲」「Analog Layout 缺人、頂尖達 4M」等敘述。官方職缺可證明有需求，不能證明缺口與薪資漲幅。

### 建議呈現方式

- 公司級官方薪資基準與角色級市場樣本分開。
- 角色區間至少寫：資料年、地點、經驗、base/total compensation、樣本數與兩來源。
- 若無可靠樣本，寫「查無可驗證的角色級公開資料」，不要為表格完整硬填。

---

## 六、新聞與論壇只可補的實務觀察

- 台灣求職者確實會把 DV、DFT、APR、CAD 當成四條不同職涯比較，也常因 frontend/backend 命名不一致而困惑。[C1][C2]
- 2025 的 firmware 討論顯示同名職務可能是產品研發、design-house system application、customer/factory support，轉職可攜性取決於實際交付物，而非「firmware」標籤。[C3]
- 這些材料適合放在「看 JD 的方法」或「面試要問什麼」，不宜用來推導全產業工時、薪資、升遷或供需。

建議面試反問：

1. 這個職位 owner 的 signoff／deliverable 是什麼？
2. Scope 是 IP、subsystem、full chip，還是 customer/factory support？
3. FE/BE 在這個 team 的 boundary 到哪裡？
4. 寫方法與 flow 的比重，和直接 project execution 的比重？
5. Tapeout 後是否負責 bring-up、量產、客訴或 on-call？
6. 工具是操作既有 recipe，還是要開發／維護 methodology？

---

## 七、第一手來源索引

以下每筆均於 **2026-08-31** 查證。未標發布日期者，是官方 careers/product 頁未公開絕對日期；職缺是否仍開放會變動，引用時應再查。

### 公司官方職缺

- **[S1] MediaTek，〈數位 IC 設計工程師（SOC BE w/ AI）〉**：https://careers.mediatek.com/zh-tw/jobs/MTK120260529003 。發布日期：頁面未載（job id 含 2026；查證時在職缺站可見）。支持 physical-aware synthesis、DFT insertion、STA、netlist QC、PPA 與公司內 BE 用語。
- **[S2] MediaTek，〈IC Design Verification Engineer〉**：https://careers.mediatek.com/zh-tw/jobs/MTK120260223002 。發布日期：頁面未載（2026 職缺）。支持 IP/system DV、UVM/formal 為選配組合，以及與 algorithm、digital/analog、firmware、AI tool 團隊協作。
- **[S3] NVIDIA，〈Padring Verification Engineer〉**：https://nvidia.wd5.myworkdayjobs.com/en-US/NVIDIAExternalCareerSite/job/Padring-Verification-Engineer_JR2022688-1 。發布日期：頁面僅顯示相對日期（查證時 Posted 10 Days Ago）。支持 padring/connectivity/full-chip integration verification 與 RTL、DFT、PD、CAD、package、software 協作。
- **[S4] NVIDIA，〈ASIC Physical Design Engineer〉**：https://nvidia.wd5.myworkdayjobs.com/en-US/NVIDIAExternalCareerSite/job/ASIC-Physical-Design-Engineer_JR2022692 。發布日期：頁面僅顯示相對日期（查證時 Posted 22 Days Ago）。支持 RTL-to-GDSII、synthesis、formal、STA、floorplan、timing closure 與 methodology。
- **[S5] MediaTek，〈數位 IC 設計工程師（SoC integration）〉**：https://careers.mediatek.com/zh-tw/jobs/MTK120220412006 。發布日期：頁面未載；查證時仍可見。支持 package/floorplan/IOMUX/test mode、clock/reset/DFT architecture、SDC 與 static checks 的整合範圍。
- **[S6] NVIDIA，〈Senior Physical Design Engineer〉**：https://nvidia.wd5.myworkdayjobs.com/en-US/NVIDIAExternalCareerSite/job/Senior-Physical-Design-Engineer_JR2017771 。發布日期：頁面僅顯示 Posted 30+ Days Ago。支持 MMMC、RC/crosstalk、IR/EM、ERC/DRC/LVS 與 P&R signoff。
- **[S7] MediaTek，〈職類介紹：數位 IC 設計／Design Verification〉**：https://careers.mediatek.com/eREC/Content/PDF/ChipDesign.pdf 。發布：約 2025-09（搜尋索引顯示 11 個月前）。支持 SoC/IP/low-power DV 與 analog/RF behavior/timing/power-aware modeling。
- **[S8] MediaTek，〈IC 驗證工程師（post-silicon）〉**：https://careers.mediatek.com/zh-tw/jobs/MTK120260610001 。發布日期：頁面未載（2026 職缺）。支持 CP/FT、DVT/HQA、pre/post-silicon correlation、DPPM 與量產 bring-up 是另一種驗證職。
- **[S16] Synopsys，〈Application Engineering, Staff Engineer – Physical Verification (Runset Development)〉**：https://careers.synopsys.com/job/hyderabad/application-engineering-staff-engineer-physical-verification-runset-development/44408/92446615856 。發布：2026-03-04。支持 DRC/LVS/fill runset 是專門職域，需 foundry/process、layout、PV tools 與 scripting。
- **[S18] MediaTek，〈NPU 編譯器工程師〉**：https://careers.mediatek.com/zh-tw/jobs/MTK120250324001 。發布日期：頁面未載；查證時可見。支持 LLVM/MLIR 為 NPU compiler 核心，TVM/RISC-V/Halide/TFLite 為加分。
- **[S19] MediaTek，〈數位設計 AI 開發工程師〉**：https://careers.mediatek.com/zh-tw/jobs/MTK120260414004 。發布日期：頁面未載（2026 職缺）。支持 LLM/agentic AI 用於 RTL、simulation/formal TB、RAG 與 EDA workflow。
- **[S20] NVIDIA，〈Senior Firmware Engineer – GPU〉**：https://nvidia.wd5.myworkdayjobs.com/nvidiaexternalcareersite/job/Senior-Firmware-Engineer---GPU_JR2019828 。發布日期：頁面僅顯示 Posted 30+ Days Ago。支持 secure update、telemetry、GPU controller、RISC-V、SPI/I2C/I3C/PCIe/SMBus/MCTP/PLDM。
- **[S21] NVIDIA，〈Senior Factory Support Firmware Engineer〉**：https://nvidia.wd5.myworkdayjobs.com/en-US/NVIDIAExternalCareerSite/job/Taiwan-Taipei/Senior-Factory-Support-Firmware-Engineer_JR2013228 。發布日期：頁面僅顯示相對日期。支持 BIOS/BMC、OpenBMC/UEFI、factory triage、thermal/power/security 與 server bring-up。
- **[S22] MediaTek，〈MCU/MPU 嵌入式軟韌體工程師〉**：https://careers.mediatek.com/zh-tw/jobs/MTK120250529008 。發布日期：頁面未載；查證時可見。支持 startup、drivers、peripheral library、RTOS/AUTOSAR/OSEK、ARM/RISC-V 與 HW/SW integration。
- **[S23] MediaTek，〈嵌入式 Linux 軟韌體工程師〉**：https://careers.mediatek.com/zh-tw/jobs/MTK120250103001 。發布日期：頁面未載；查證時可見。支持 bootloader、driver、IC validation environment、chip bring-up 與 system integration。
- **[S26] MediaTek，〈資深 D2D 高速介面設計工程師〉**：https://careers.mediatek.com/zh-tw/jobs/MTK120251210001 。發布日期：頁面未載（2025 職缺）。支持 UCIe D2D IP、PHY/controller integration、timing/DFT、verification plan、AMBA AXI/CHI 與 firmware 協作。
- **[S27] MediaTek，〈射頻 IC 設計工程師〉**：https://careers.mediatek.com/zh-tw/jobs/MTK120250224001 。發布日期：頁面未載（2025 職缺）。支持 design、supervise layout、characterize、scaled CMOS effect 與 EM knowledge/tool。
- **[S34] Synopsys，〈Taiwan Jobs〉**：https://careers.synopsys.com/jobs-in-taiwan 。持續更新；2026-08-31 查證時列出 R&D Engineer (C/C++)、Verdi Assistant (LLM/MCP/Agent)、PD/DV/AE 等職缺。
- **[S37] MediaTek，2024 Annual Report**：https://www.mediatek.com/hubfs/728015/MediaTek%20Assets/Pdfs/Annual%20Reports/2024-English-Annual-Report.pdf 。發布：2025。支持員工教育結構與 R&D 人數，不能作角色薪資或職級依據。

### 官方工具、標準與技術資料

- **[S9] Synopsys，TestMAX DFT**：https://www.synopsys.com/implementation-and-signoff/test-automation/testmax-dft.html 。產品頁持續更新；查證 2026-08-31。支持 scan/core wrapping/compression、IEEE 1500/1687、tester-ready patterns 與 diagnosis。
- **[S10] Siemens，Tessent multi-die eBook**：https://static.sw.cdn.siemens.com/siemens-disw-assets/public/lsDXzopZZ6P3da7eAz9FM/en-US/Tessent%20Multi_Die_Ebook_Finalized_v3.pdf 。發布：約 2026-02。支持 Siemens Tessent 品牌、IEEE 1838、多 die BSDL/pattern 與多標準整合。
- **[S11] IEEE，IEEE 1838-2019**：https://standards.ieee.org/ieee/1838/5073/ 。發布：2020-03-13；2026 仍為 active standard。支持 die-centric 3D stacked-IC pre/post-stacking test access。
- **[S12] IEEE，IEEE 1687-2014**：https://standards.ieee.org/ieee/1687/3931/ 。發布：2014-12-05；2025-03-27 轉 Inactive-Reserved，頁面並列進行中的 P1687。支持 IJTAG access architecture、ICL/PDL 概念，也提醒正文需查最新版本狀態。
- **[S13] UC Berkeley BSIM Group，Models**：https://www.bsim.berkeley.edu/models/ 。頁面持續更新；查證 2026-08-31。明定 BSIM-CMG 為 common multi-gate/FinFET、BSIM-IMG 為 independent multi-gate。
- **[S14] UC Berkeley BSIM Group，BSIM-MG FAQ**：https://bsim.berkeley.edu/bsim-mg-faq/ 。頁面未載發布日；查證 2026-08-31。支持 CMG/IMG 閘極偏壓差異、FinFET與 all-around 適用說明；另見 BSIM-IMG FD-SOI：https://bsim.berkeley.edu/bsim-img-as-fdsoi-model/ （發布 2015-02-12）。
- **[S15] TSMC，Open Innovation Platform**：https://www.tsmc.com/english/dedicatedFoundry/oip 。持續更新；查證 2026-08-31。支持 design technology infrastructure、EDA certification、design enablement 與 ecosystem partnership。
- **[S17] TSMC，2025 Annual Report, Chapter 5**：https://investor.tsmc.com/static/annualReports/2025/english/pdf/2025_tsmc_ar_e_ch5.pdf 。發布：2026。支持 2025 PDK release、analog migration/automation、AI design productivity 與 3DFabric alliance 的 EDA/IP/DCA/VCA/test/memory/substrate/OSAT 分工。
- **[S28] Cadence，SoC Verification**：https://www.cadence.com/en_US/home/explore/soc-verification.html 。頁面持續更新；查證 2026-08-31。官方稱 verification phase 平均超過 SoC development cycle 70%；引用時必須標示為供應商說法。
- **[S29] Siemens EDA / Wilson Research Group，2024 IC/ASIC Functional Verification Trend Report**：https://verificationacademy.com/topics/planning-measurement-and-analysis/wrg-industry-data-and-trends/2024-siemens-eda-and-wilson-research-group-ic-asic-functional-verification-trend-report/ 。發布：2025-02-17。支持樣本方法、597 有效受訪者、14% first-silicon success 與方法採用趨勢。
- **[S30] UCIe Consortium，Specifications**：https://www.uciexpress.org/specifications 。持續更新；查證 2026-08-31。支持 UCIe 2.0 UDA/3D package、UCIe 3.0 的 48/64 GT/s、early firmware download、sideband與 manageability。
- **[S31] UCIe Consortium，Press Releases**：https://www.uciexpress.org/press-releases 。UCIe 3.0 發布：2025-08-05；UCIe 2.0 發布：2024-08-06。
- **[S32] Cadence，Cerebrus AI Studio**：https://www.cadence.com/en_US/home/tools/digital-design-and-signoff/soc-implementation-and-floorplanning/cadence-cerebrus-ai-studio.html 。2025 推出；查證 2026-08-31。支持 agentic multi-block/multi-user hierarchical SoC implementation；5–10x/20% 等為官方宣稱。
- **[S33] Synopsys，〈Expanding AI Capabilities for EDA Solutions〉**：https://news.synopsys.com/2025-09-03-Synopsys-Announces-Expanding-AI-Capabilities-for-its-Leading-EDA-Solutions 。發布：2025-09-03。支持 Copilot、RTL generation、formal assertion generation；效能數字為官方宣稱。
- **[S35] Synopsys，〈Autonomous Engineering Workflows from Silicon to Systems〉**：https://news.synopsys.com/2026-07-26-Synopsys-Showcases-Comprehensive-Autonomous-Engineering-Workflows-from-Silicon-to-Systems%2C-Developed-with-NVIDIA-Technology 。發布：2026-07-26。支持 autonomous DV workflow 趨勢；50x/20% 是官方 demo claim，不可泛化。
- **[S36] IEEE，IEEE 1800.2-2020 UVM**：https://standards.ieee.org/ieee/62530-2/11429/1800.2/7567/ 。發布：2020-09-14，頁面另列 IEEE/IEC 62530-2-2023。支持 UVM 的標準化、interoperability 與 verification component reuse。

### 公司級薪資資料

- **[S24] Taiwan Stock Exchange，非主管全時員工薪資揭露路徑說明**：https://www.twse.com.tw/staticFiles/news/event/8a8216d69a3d6cf9019b2ef00391051c.pdf 。發布：2025。說明 MOPS/TWSE 公司級平均與中位數揭露口徑。
- **[S25] 中央社轉載，〈聯發科去年非主管平均年薪連 5 年奪冠〉**：https://money.udn.com/money/amp/story/11162/9597114 。發布：2026-06-30；內容引用 TWSE 2025 年統計。這是二手媒體，僅在官方查詢頁不易建立固定連結時作導航；正文最好直接指向 MOPS/TWSE 查詢結果。

---

## 八、社群／論壇補充來源（不可單獨作事實依據）

- **[C1] Dcard，〈有關數位 IC design 職缺的未來發展性〉**：https://www.dcard.tw/f/tech_job/p/256170464 。發布日期：頁面搜尋結果未顯示；查證 2026-08-31。顯示求職者常將 DV/DFT/APR/CAD 分開比較。
- **[C2] Dcard，〈2025 面試心得分享〉**：https://www.dcard.tw/f/job/p/260949730 。內容描述職稱「數位設計前端（後端）」實際為 DFT，證明命名需回到 deliverables；不可外推公司普遍分工。
- **[C3] PTT Tech_Job，〈工作請益〉**：https://www.ptt.cc/bbs/Tech_Job/M.1746275569.A.98D.html 。發布：2025-05-03。個人 MCU/SoC firmware 經驗，僅適合呈現同名 firmware 職務的產品與責任差異。

---

## 九、交給寫作 agent 的最小執行順序

1. 先重畫 `01` 的 role map，確立角色詞彙；其他頁共用，不在各頁重複造定義。
2. 將 `02` 拆成 analog layout 與 digital PD 兩條；篇幅不足就分新頁。
3. `03` 按 pre-silicon specialty 重寫，post-silicon 只留協作與連結。
4. `04` 更新工具／標準，再補 chiplet/3DIC；移除通用 `≥98%`。
5. `05` 按 CAD、foundry PDK、EDA vendor 三大組與八個子角色重寫；修 BSIM 錯誤。
6. `19` 拆 AI 四層與 firmware 六類；把現有「三大方向」改為協作地圖。
7. 最後才重做薪資；資料不足就標待查，不讓薪資表反向扭曲職務定義。
