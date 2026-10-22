# 外部聲音

從有影響力的業內人士提取立場與尖銳說法。每則記原話、出處、利害關係，以及本書怎麼用。原話寫進正文要標明是誰說的；他的框架拿來當詮釋時，在詮釋框裡點名。

| 人 | 原話 | 出處 | 利害關係 | 提取的立場 |
|---|---|---|---|---|
| Jim Keller（Tenstorrent 執行長） | "Cuda's a swamp, not a moat. x86 was a swamp too"（X，2024-02-17） | [Wccftech](https://wccftech.com/jim-keller-calls-nvidia-cuda-a-swamp-says-x86-was-a-swamp-too/amp/) | 賣 NVIDIA 的替代品 | 鎖定不是防禦工事，是積出來的泥；沼澤不會被另一片沼澤取代，只會被從上面跨過 |
| George Hotz（tiny corp 創辦人） | "If we even have a 3% chance of dethroning NVIDIA and eating in to their 80% margins, we will be very very rich"（2023-05） | [Import AI 331](https://importai.substack.com/p/import-ai-331-16x-smaller-language) | 做讓 AMD GPU 可用的軟體 | 毛利率是懸賞金額 |
| 黃仁勳 | "you want an architecture that's generally programmable"；"Anthropic is a unique instance, not a trend."（Dwarkesh Patel 訪談，逐字稿 2026-04-15 刊出） | [The Transcript Desk](https://thetranscriptdesk.substack.com/p/jensen-huang-will-nvidias-moat-persist) | NVIDIA 執行長 | 新演算法需要通用可程式的架構，所以每一次演算法變動都在替 CUDA 補水 |
| Chris Lattner（Modular 共同創辦人，LLVM、Swift 作者） | "it is common to lose 20% on NVIDIA's H100"；"Moving to AMD GPUs is even worse."；"Triton has not united the ecosystem or challenged CUDA's dominance."；"Triton is open source, but OpenAI owns its roadmap."（2025-03-26） | [Modular, Democratizing AI Compute Part 7](https://www.modular.com/blog/democratizing-ai-compute-part-7-what-about-triton-and-python-edsls) | 賣另一套跨硬體軟體堆疊（Mojo、MAX） | 公共的橋走不過沼澤 |
| SemiAnalysis（Dylan Patel 等） | "The CUDA moat has yet to be crossed by AMD"；NVIDIA 工程師加班以新功能、函式庫與效能更新加深護城河（2024-12-22） | [SemiAnalysis](https://newsletter.semianalysis.com/p/mi300x-vs-h100-vs-h200-benchmark-part-1-training) | 產業研究與顧問 | 鎖定是被持續挖深的，不只是被動積泥 |

選用：以 Keller 的「沼澤」為全書立場，以黃仁勳的回答為它最強的反方，以 Hotz 的「懸賞」解釋大戶為什麼先架橋。2026-10-23 專找可能推翻立場的聲音：Lattner 與 SemiAnalysis 推翻了「Triton 就是那座橋」，沒有推翻「沼澤」，立場修正見 `stance.md`。
