# R3 專項查核：630nm 紅光雷射入水「變 420nm」是否正確？

**查核 agent**：R3
**日期**：2026-07-12
**對象檔案**：
- `docs/mas531-computational-photography/08-wavelengths-color-hyperspectral.md`（第 12 行導讀）
- `plan/mas531-computational-photography/research/notes/lecture-08a-notes.md`（第 49、56、99 行）

## 一、結論（先講重點）

**書稿並非抄錯，而是忠實轉述了講者 Ramesh Raskar 的原話。** Raskar 在課堂上確實說：630nm 紅光雷射射入水中，波長縮短到 **420nm**，且「In water, 420 is red」。

**但 Raskar 本人在課堂上算錯了（或做了不當簡化）**：他用「三分之二 (factor of two-thirds)」當作縮短係數，這對應折射率 **n≈1.5（玻璃）**，而非水。他口述時甚至把「玻璃」和「水」混為一談（原話：「a piece of water, a piece of glass or a kind of water」）。

- 水的可見光折射率 **n≈1.33**，正確值為 630 / 1.33 ≈ **473nm**。
- 420nm 對應的是 n≈1.5（玻璃/塑膠），非水。

因此這是「**講者原話就是 420**」的情形，處置採對應方案（見第四節）。

## 二、逐字稿查證（一手來源）

### 官方文字資料狀況
- OCW 課程頁：MAS.531 Computational Camera and Photography, Fall 2009。
  <https://ocw.mit.edu/courses/mas-531-computational-camera-and-photography-fall-2009/>（查閱 2026-07-12）
- Lecture 8「Wavelengths and Colors」的**官方講義只有投影片 PDF**（客座講者 Ankit Mohan，73 頁），**無官方逐字稿、無字幕**。
  資源頁：<https://ocw.mit.edu/courses/mas-531-computational-camera-and-photography-fall-2009/resources/mitmas_531f09_lec08_2/>（查閱 2026-07-12）
  PDF：`MITMAS_531F09_lec08_2.pdf`（2.5MB）。**全 73 頁投影片中完全沒有「紅光雷射入水」這個例子**，也沒有出現 630/420/473 等數字；投影片只在第 7 頁標示「Visible Light ~400–700nm」。→ 此例子只存在於課堂口述，不在投影片上。
- 音訊：archive.org item `MITMAS_531F09`，Lecture 8 分三段 MP3（lec08_1/2/3），**無 SRT/VTT/字幕檔**。
  <https://archive.org/details/MITMAS_531F09>（查閱 2026-07-12）

### 本次自行轉錄查證
由於無官方逐字稿，R3 下載 lec08 三段音訊並以 Whisper (tiny.en) 轉錄比對。此例出現在 **lec08_2**（主講段，約 85 分鐘）約 55–58 分處。以下為 Whisper 原始輸出（含辨識雜訊，數字段落清楚可辨）：

> "If you take a red laser pointer … don't think of color, think of the wavelength. So let's see it has a certain wavelength. I don't know, 680 nanometers, something like that. **6, 6, 30, 30, OK.**"
> …「shine it in **a piece of water, a piece of glass or a kind of water**, OK? … The speed is actually decreasing. So C in air versus C in water is altered by a factor … the refractive index … **this is actually reduced by a factor of two-thirds.**」
> …「the frequency is fixed. So the wavelength has changed. So that is from … **6.30**. We have gone down to two-thirds of that. So that would be what? **420, right? So now this red laser actually has a wavelength of 420 nanometers.** … But when it's inside, it's 420. … In air, 630 is red. **In water, 420 is red.**」

**重點：**
1. 起始波長：Raskar 先說 680nm，隨即改口確定為 **630nm**（轉錄辨識為「6,6,30,30」「6.30」）。
2. 他明確使用縮短係數「**two-thirds（2/3）**」→ 630 × 2/3 = 420nm。
3. 2/3 係數 ⇒ n = 1/(2/3) = **1.5**，這是玻璃的折射率，不是水（n≈1.33）。
4. 他口頭把介質講成「water / glass / kind of water」混用，是誤差來源。

（轉錄檔留存於本次工作目錄；如需複核可重轉 lec08_2 該時段。）

## 三、物理核算

光從空氣進入介質，**頻率 f 不變**（由光源決定），速度 v 與波長 λ 同步下降：
$$ \lambda_{medium} = \frac{\lambda_{air}}{n} $$

- **水**：可見光折射率 n(630nm) ≈ **1.331–1.333**（近 1.33）。
  λ_water = 630 / 1.331 ≈ **473nm**。
  來源：Chegg/Homework.Study 同類題與水折射率標準值 1.33。
  <https://homework.study.com/explanation/a-laser-sends-red-light-of-wavelength-650-nm-from-air-into-water-in-a-swimming-pool-the-index-of-refraction-of-the-water-is-1-33-a-what-wavelength-will-the-light-have-in-the-water-b-what-color.html>（查閱 2026-07-12）
- **玻璃**（Raskar 實際用的係數）：n ≈ 1.5，630 / 1.5 = **420nm**。這正好解釋 420 這個數字的由來 = 誤用玻璃折射率。

**顏色不變的論述正確**：頻率/光子能量不變，故若人眼在該介質中觀看仍感知為紅色。此部分書稿無誤。

| 介質 | 折射率 n | 630nm 入射後波長 | 備註 |
|------|---------|-----------------|------|
| 空氣 | ~1.00 | 630nm | 原始 |
| **水** | **1.33** | **≈473nm** | 正確物理值 |
| 玻璃 | 1.50 | 420nm | Raskar 課堂用的係數（2/3） |

## 四、處置建議

屬「講者原話就是 420」情形，但因 420 是講者誤用玻璃折射率所致、且知識書應傳達正確物理，建議採**更正為水的正確值並加註來源說明**（優於原封不動保留 420）。二選一：

### 建議做法（推薦）：改用正確值 473nm，並加註
把導讀與筆記中的「420 奈米」改為「約 473 奈米」，並加一句註記：

> 「630nm 紅光入水，因水折射率 n≈1.33，波長縮短為約 473nm（λ_water = λ_air / n），但頻率與能量不變，人眼在水中看仍是紅色。」
> 註：Raskar 課堂原講以「三分之二」係數推得 420nm，該係數對應折射率 n≈1.5（玻璃）而非水（n≈1.33）；此處採水的正確物理值。

### 次佳做法：保留 420 但明確標註為原講 + 玻璃係數
若要嚴格忠於課堂原話，可保留 420nm，但務必加註：

> 「（原講如此。Raskar 以 2/3 係數推得 420nm，對應玻璃 n≈1.5；若為水 n≈1.33，正確值約 473nm。）」

**不建議**維持現狀（把 420nm 當作「水中」的物理事實而不加任何說明），因為那會把講者的口誤當成正確物理傳給讀者。

### 具體待改位置
- `08-wavelengths-color-hyperspectral.md` 第 12 行：「波長會縮短為 420 奈米」。
- `lecture-08a-notes.md` 第 49 行（隱含）、第 56 行「630nm…縮短至 420nm」、第 76 行、第 99 行。

（第 99 行「雷射光進入水中波長確實變短、頻率未變、顏色不變」的論述本身正確，只需修正數字/加註。）
