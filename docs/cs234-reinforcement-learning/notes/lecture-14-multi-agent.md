# Lecture 14: Multi-Agent Game Playing & AlphaGo

## 1. Simulation-Based Search & Monte Carlo Tree Search (MCTS)
- **Problem**: In games like Go, the state and action spaces are enormous. Computing the optimal policy for the entire state space is intractable.
- **Solution**: Focus computation on the current state. Use forward search or simulation to decide the next move.
- **MCTS**: Instead of enumerating all possible next states (like ExpectiMax), MCTS samples transitions and actions to approximate expected values. It breaks the curse of dimensionality over states.

## 2. Upper Confidence bounds applied to Trees (UCT)
- **Challenge**: MCTS approximates state transitions but still struggles with large action spaces.
- **UCT Idea**: Treat each state node in the search tree as a Multi-Armed Bandit problem.
- **Mechanism**: Use Upper Confidence Bounds (UCB) to select actions during tree search. This prioritizes promising actions (exploitation) while ensuring less-visited actions are still explored (exploration). 
- Actions with higher upper bounds are selected to selectively expand the unbalanced search tree.

## 3. AlphaGo and AlphaZero
DeepMind's breakthrough algorithms combined Reinforcement Learning, MCTS, and Deep Neural Networks to master Go.

### 3.1 Self-Play
- The agent plays games against itself.
- **Benefit**: Matches the opponent's skill level exactly, providing a ~50% win rate. This yields a dense reward signal (compared to playing a Grandmaster and always losing) and acts as an automatic curriculum learning mechanism.

### 3.2 Deep Neural Networks
- **AlphaZero Architecture**: Uses a single deep ResNet that takes the board state (and history) and outputs:
  - **Policy Head ($p$)**: A probability distribution over possible next actions.
  - **Value Head ($v$)**: An estimate of the probability of winning from this state.

### 3.3 Integrating MCTS with Neural Networks
1. **Selection & Expansion**: Traverse the tree using a modified UCB formula that incorporates the prior probability from the Policy network. Actions with high neural network prior and high empirical value are explored more.
2. **Evaluation**: When a leaf node is reached, instead of rolling out randomly to the end of the game, the Value network immediately evaluates the state.
3. **Backup**: The value $v$ is propagated back up the tree to update the Q-values of the actions taken.
4. **Play**: After many MCTS iterations, the real action is chosen by sampling from a distribution proportional to the visit counts of the root's children.

### 3.4 Neural Network Training
- The network is continuously trained on the self-play data.
- **Loss**: Trained to minimize the error between the predicted value $v$ and the actual game outcome $Z$, and to align the policy output $p$ with the MCTS visit probabilities $\pi$.

## 4. Key Takeaways
- **Architecture Matters**: ResNets significantly outperformed standard CNNs, and combined dual-head networks outperformed separate policy/value networks.
- **MCTS is Crucial**: Even a fully trained, massive neural network performs poorly without the local computation provided by MCTS during gameplay.
- **Beyond Human Knowledge**: AlphaZero learned entirely from self-play without human data, yet discovered novel strategies that surpass human grandmasters.
