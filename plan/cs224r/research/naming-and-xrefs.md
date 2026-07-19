# R1 Research — Naming & Cross-References (CS224R Deep RL)

Research agent: **R1**
Verification date: **2026-07-19**
Scope: naming fix (MEDAL vs "Metal"), chapter-number audit, linkification inventory.

---

## 1. MEDAL vs "Metal" naming

### Verdict

"**Metal**" (used 4× in `16-rl-for-robots.md`) is a **phonetic mis-transcription of "MEDAL"**. In English "MEDAL" is pronounced /ˈmɛdəl/, homophone-ish with "metal" /ˈmɛtəl/, so an audio transcriber heard "Metal". The transcript reading-note (`transcripts/lecture-16-rl-for-robots.md`) also records it as "Metal 算法", confirming the error originated at the audio-transcription stage, not in the book edit. The algorithm described in the chapter — a **backward policy trained with a discriminator to match the demonstration (expert) state distribution**, reward $R_B(s) = -\log(1 - D(s))$ — is *exactly* MEDAL. So the concept is right; only the spelled name is wrong.

### Authoritative paper

| Field | Value |
|-------|-------|
| Acronym | **MEDAL** = **M**atching **E**xpert **D**istributions for **A**utonomous **L**earning |
| Title | *A State-Distribution Matching Approach to Non-Episodic Reinforcement Learning* |
| Authors | Archit Sharma, Rehaan Ahmad, Chelsea Finn |
| Year / Venue | 2022, arXiv (cs.LG); the work is associated with ICML 2022 |
| arXiv ID | **2205.05212** |
| URL | https://arxiv.org/abs/2205.05212 |

Verbatim from the paper (Section 4.3, verified via ar5iv HTML): *"we now summarize our proposed algorithm, **Matching Expert Distributions for Autonomous Learning** (MEDAL)."* The backward-policy reward is confirmed as $r(s,a) = -\log(1 - C(s))$ where $C$ is the discriminator (Section 4.2; Appendix A notes both $\log C(s)$ and $-\log(1-C(s))$ preserve the saddle point, and the latter was chosen for stability).

- Source (official/primary): https://arxiv.org/abs/2205.05212 — published 2022-05-11; verified 2026-07-19.
- Source (acronym + reward text): https://ar5iv.labs.arxiv.org/abs/2205.05212 — verified 2026-07-19.

### SECONDARY BUG in `references.md` (important — flag for writer agents)

`references.md:132` not only carries the wrong "Metal" label but **cites the wrong paper** for MEDAL:

> `| MEDAL | Sharma et al., 2021. *Autonomous Reinforcement Learning via Subgoal Curriculum*. arXiv. | Metal 算法，回到示範狀態分佈 | 第十六章 |`

"*Autonomous Reinforcement Learning via Subgoal Curricula*" (Sharma, Gupta, Levine, Hausman, Finn, **NeurIPS 2021**, arXiv:2107.12931) is a **different** paper — it introduces **VaPRL** (Value-accelerated Persistent RL), not MEDAL. MEDAL is the 2022 paper above.

**Correct reference entry should read:**

> `| MEDAL | Sharma, Ahmad & Finn, 2022. *A State-Distribution Matching Approach to Non-Episodic Reinforcement Learning*. arXiv:2205.05212. | 後向策略用判別器匹配示範（專家）狀態分佈 | 第十六章 |`

- VaPRL paper (for disambiguation): https://arxiv.org/abs/2107.12931 — NeurIPS 2021; verified 2026-07-19.

### Fixes required

| File | Line | Current | Fix |
|------|------|---------|-----|
| `16-rl-for-robots.md` | 68 | `## 16.5 Metal 算法：重置到專家狀態分佈` | `Metal` → `MEDAL` |
| `16-rl-for-robots.md` | 70 | `**Metal** 算法改進了後向策略的目標…` | `Metal` → `MEDAL` |
| `16-rl-for-robots.md` | 90 | table cell `Metal` | `Metal` → `MEDAL` |
| `16-rl-for-robots.md` | 153 | table cell `Metal 算法` | `Metal` → `MEDAL` |
| `references.md` | 132 | wrong title/year (VaPRL paper) + `Metal` | replace with corrected entry above |

(The transcript files are source material and are left untouched per task rules; noting only that `transcripts/lecture-16-rl-for-robots.md:23,44` also say "Metal", explaining the origin.)

---

## 2. Cross-chapter reference chapter-number audit

Nav → filename map used as ground truth:

| # | Topic | File |
|---|-------|------|
| 1 | Class Intro | `01-class-intro.md` |
| 2 | Imitation Learning | `02-imitation-learning.md` |
| 3 | Policy Gradients | `03-policy-gradients.md` |
| 4 | Actor-Critic | `04-actor-critic.md` |
| 5 | Off-Policy Actor-Critic | `05-off-policy-actor-critic.md` |
| 6 | Q-Learning | `06-q-learning.md` |
| 7 | Offline RL | `07-offline-rl.md` |
| 8 | Reward Learning | `08-reward-learning.md` |
| 9 | RL for LLMs | `09-rl-for-llms.md` |
| 10 | RL for LLM Reasoning | `10-rl-llm-reasoning.md` |
| 11 | Model-Based RL | `11-model-based-rl.md` |
| 12 | Multi-Task RL | `12-multi-task-rl.md` |
| 13 | Meta RL | `13-meta-rl.md` |
| 14 | Exploration | `14-exploration.md` |
| 15 | Hierarchical RL and IL | `15-hierarchical-rl-il.md` |
| 16 | RL for Robots | `16-rl-for-robots.md` |
| 17 | Advancing Robot Intelligence | `17-advancing-robot-intelligence.md` |
| 18 | Frontiers | `18-frontiers.md` |
| — | Tutorial (Q-Learning Review) | `tutorial-q-learning-review.md` |

### Errors found (numbers that do NOT match the named topic / nav)

| file:line | current text | correct chapter # | note |
|-----------|--------------|-------------------|------|
| `01-class-intro.md:121` | 「…是第三章（Actor-Critic）、第五章（Q-Learning）以後的核心主題。」 | **第四章**（Actor-Critic）、**第六章**（Q-Learning） | Actor-Critic is ch4 (not 3); Q-Learning is ch6 (not 5). Both numbers off; the parenthetical names are correct. Known suspect — confirmed. |
| `03-policy-gradients.md:136` | 「**下一章的 PPO** 正是在此基礎上，加入 clipping 限制更新幅度。」 | **第五章**（Off-Policy Actor-Critic） | "下一章" from ch3 = ch4 (Actor-Critic), but PPO's full treatment (definition, clip objective, algorithm — 11 mentions) is in **ch5**. ch4 has no PPO content beyond one forward-pointer. Fix "下一章的 PPO" → "第五章的 PPO". Confirmed by grep. |

### Verified CORRECT (no change) — full sweep

| file:line | reference | status |
|-----------|-----------|--------|
| `01-class-intro.md:63` | 第八章「Reward Learning」 | ✓ ch8 = Reward Learning |
| `04-actor-critic.md:181` | 「PPO 在下一章展開」 (ch4→ch5) | ✓ PPO is in ch5 |
| `12-multi-task-rl.md:7` | 延續第十一章 (Model-Based RL) | ✓ ch11 = Model-Based RL |
| `13-meta-rl.md:130` | DREAM 見第十四章詳述 | ✓ ch14 = Exploration covers DREAM |
| `14-exploration.md:105` | （接第十三章） | ✓ ch13 = Meta RL |
| `16-rl-for-robots.md:144` | 見第八章 (獎勵學習) | ✓ ch8 = Reward Learning |
| `16-rl-for-robots.md:161` | 第十五章（層級 RL）、第八章（獎勵學習） | ✓ |
| `17-advancing-robot-intelligence.md:225` | 第十一章（Model-Based RL）、第十六章（自主學習） | ✓ ch11, ch16 |
| `18-frontiers.md:68` | 見第十五章圖像子目標 | ✓ ch15 covers image subgoals (SuSIE) |
| all `*下一章：<topic>*` footer lines | ch2→3, 3→4, 4→5, 5→6, 6→7, 7→8, 8→9, 9→10, 10→11, 11→12, 12→13, 13→14, 14→15, 15→16 | ✓ all sequential & topic-correct |
| `01-class-intro.md:174` / `02-imitation-learning.md:154` | 下一章：模仿學習 / 策略梯度 | ✓ |

Excluded per instructions: `tutorial-q-learning-review.md:294` "Sutton & Barto 第六章…第九章" (textbook, not book chapters) and the `references.md:10-20` "Sutton & Barto 對應" table left column (textbook chapters).

---

## 3. Linkification inventory

Chapter-number → target filename (for mechanical `第X章` → `[第X章](file.md)` conversion):

| 中文章號 | file | 中文章號 | file |
|----------|------|----------|------|
| 第一章 | `01-class-intro.md` | 第十章 | `10-rl-llm-reasoning.md` |
| 第二章 | `02-imitation-learning.md` | 第十一章 | `11-model-based-rl.md` |
| 第三章 | `03-policy-gradients.md` | 第十二章 | `12-multi-task-rl.md` |
| 第四章 | `04-actor-critic.md` | 第十三章 | `13-meta-rl.md` |
| 第五章 | `05-off-policy-actor-critic.md` | 第十四章 | `14-exploration.md` |
| 第六章 | `06-q-learning.md` | 第十五章 | `15-hierarchical-rl-il.md` |
| 第七章 | `07-offline-rl.md` | 第十六章 | `16-rl-for-robots.md` |
| 第八章 | `08-reward-learning.md` | 第十七章 | `17-advancing-robot-intelligence.md` |
| 第九章 | `09-rl-for-llms.md` | 第十八章 | `18-frontiers.md` |
| Tutorial | `tutorial-q-learning-review.md` | | |

### A. Numbered in-text references to linkify (grouped by file)

**IMPORTANT:** where a number is wrong (Section 2), correct the number FIRST, then link to the corrected target. Those rows are marked ⚠.

**`01-class-intro.md`**
- L63: `第八章` → `[第八章](08-reward-learning.md)`
- ⚠ L121: `第三章（Actor-Critic）` → after fixing to 第四章: `[第四章](04-actor-critic.md)（Actor-Critic）`
- ⚠ L121: `第五章（Q-Learning）` → after fixing to 第六章: `[第六章](06-q-learning.md)（Q-Learning）`

**`03-policy-gradients.md`**
- ⚠ L136: `下一章的 PPO` → after fixing to 第五章: `[第五章](05-off-policy-actor-critic.md)的 PPO`

**`12-multi-task-rl.md`**
- L7: `第十一章` → `[第十一章](11-model-based-rl.md)`

**`13-meta-rl.md`**
- L130: `第十四章` → `[第十四章](14-exploration.md)`

**`14-exploration.md`**
- L105: `第十三章` → `[第十三章](13-meta-rl.md)`

**`16-rl-for-robots.md`**
- L144: `第八章` → `[第八章](08-reward-learning.md)`
- L161: `第十五章` → `[第十五章](15-hierarchical-rl-il.md)`；`第八章` → `[第八章](08-reward-learning.md)`

**`17-advancing-robot-intelligence.md`**
- L225: `第十一章` → `[第十一章](11-model-based-rl.md)`；`第十六章` → `[第十六章](16-rl-for-robots.md)`

**`18-frontiers.md`**
- L68: `第十五章` → `[第十五章](15-hierarchical-rl-il.md)`

**`tutorial-q-learning-review.md`**
- L255: `第七章` → `[第七章](07-offline-rl.md)` (「離線 RL 中的集成（見第七章）」)
- L294: `Sutton & Barto 第六章…第九章` → **DO NOT LINK** (textbook chapters, not book chapters).

### B. Footer navigation lines (optional linkification — topic-named, no chapter number)

Every chapter ends with `*下一章：<topic> —— …*`. These have no `第X章` number but point to the next file. Writer agents may optionally wrap the topic in a link to the next chapter file (`02→03…15→16`, plus `01→02`). Listed as optional because current style is a plain italic teaser, not a link. Also `04-actor-critic.md:181` "PPO 在下一章展開" and `04:185`/`03:162` footers fall in this category.

### C. `references.md` mapping-table entries (optional, separate style)

`references.md` uses a 「章節對應」 column full of `第X章` tokens (e.g. L10-20 right column, L31-133). These are inside dense table cells; linkifying is optional and lower priority than body prose. Left as writer-agent discretion.

---

## 待查 / open items

1. **MEDAL venue precision:** confirmed as arXiv:2205.05212 (2022). It is commonly listed as an ICML 2022 paper but the arXiv abstract page does not print the venue string; the reference entry safely uses "2022, arXiv:2205.05212". If a stricter venue is wanted, verify against Chelsea Finn's publication list — marked 待查 (low priority; arXiv cite is authoritative and sufficient).
2. **`references.md:40` PPO → 第三章 mapping:** PPO's substantive coverage is in **ch5**, not ch3 (ch3 only forward-points to it). The 章節對應 column says 第三章. Not strictly an in-text cross-ref error, but a mapping inconsistency worth a writer's attention — consider changing to 第五章 (or 第三章、第五章). Flagged, outside core Task-2 scope.
