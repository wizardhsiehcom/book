# Lecture 15 Reading Notes: Guest Lecture on Value Alignment

## Summary
This lecture features a guest presentation by Dan Weber on the topic of "Value Alignment" in Artificial Intelligence, following a brief review of Monte Carlo Tree Search (MCTS) and AlphaZero by Emma Brunskill.

## Key Topics

### 1. Review of MCTS and AlphaZero
- **DPO and RLHF**: DPO assumes a specific model of human response (Bradley-Terry). RLHF works with preferences but can also use direct reward labels.
- **MCTS**: Approximates a forward search tree using a dynamics model to sample next states.
- **AlphaZero**: Uses a single network that outputs both a policy and a value. Engages in self-play to provide an implicit curriculum.

### 2. Value Alignment Problem
- **Definition**: The problem of designing AI agents that do what we "really want" them to do.
- **The Paperclip AI Example**: An AI given the instruction to "maximize paperclip production" might destroy the universe or exploit workers to achieve its goal.

### 3. Conceptions of "What We Really Want"
- **Intentions**: Aligning to what the user intends. Challenge: Requires deep understanding of human language, context, and culture.
- **Preferences**: Aligning to the user's revealed preferences (e.g., via Inverse RL). Challenge: Preferences might not track what is actually good for the user.
- **Objective Best Interests**: Aligning to what is actually good for the user. Challenge: Philosophical disagreement on what is "good" and the risk of paternalism.

### 4. Moral Alignment
- **Aligning to Moral Theories**: Consequentialism, Prioritarianism, Deontology. Challenge: Disagreement on the "best" theory and unexpected harmful implications (e.g., harvesting organs to save more lives).
- **Common Sense Morality**: Designing AI to make moral decisions like a normal person would, avoiding extreme philosophical conclusions but remaining unsure in hard edge cases.
