# Lecture 16: Course Review and Value Alignment

## 1. Quiz Review & Theoretical Concepts
- **Proximal Policy Optimization (PPO)**: The first step is on-policy, while subsequent steps are off-policy. PPO doesn't directly handle state distribution mismatches; rather, it constrains the new policy to be close to the old one.
- **Value Alignment**: 
  - Often, alignment isn't just about an individual's preference (utility) but broader societal implications (moral theories).
  - **Autonomy**: Providing AI users with the freedom to make suboptimal choices. Designing agents that override user decisions in their "best interest" introduces paternalism, which undermines autonomy.
- **Monte Carlo Tree Search (MCTS)**: 
  - MCTS samples from the dynamics model instead of enumerating all possible states.
  - It does not strictly require a Markov system; it can utilize historical states if the simulator supports it.
  - Used in AlphaZero alongside policy/value networks and upper confidence bounds.
- **PAC RL**: Probably Approximately Correct guarantees an $\epsilon$-optimal policy with a finite (polynomially bounded) number of mistakes.
- **Offline RL**: Highly beneficial in high-stakes settings (like healthcare or robotics) where online exploration is risky.

## 2. Key RL Application Domains
- **Alpha Tensor**: 
  - **Goal**: Finding efficient matrix multiplication algorithms.
  - **Approach**: Multi-step RL utilizing MCTS with policy and value networks. 
  - **Reward**: Minimizing the length of correct operations (computation steps). 
  - **Advantage**: It searches strictly within the space of correct algorithms, completely sidestepping deployment distribution shifts.
- **Plasma Control (Fusion Science)**:
  - **Approach**: Offline-to-online RL via a simulator using Actor-Critic.
  - **Architecture**: A computationally heavy, highly parameterized critic combined with a very simple actor. The simple actor is required to execute fast, real-time control at deployment.
  - **Safety constraint**: Implemented pessimistic penalties in the reward function to steer the policy away from uncertain or unsafe states in the simulator.
- **COVID-19 Border Testing**:
  - **Problem**: Efficient testing under severe test constraints with delayed test outcomes.
  - **Approach**: Modeled as a batch bandit with delayed outcomes.

## 3. Core Characteristics & Challenges of RL
- **Distribution Shift**: The actions a policy takes fundamentally alter the data distribution of states and rewards. Extrapolation from offline data becomes risky.
- **Handling Shift**:
  - **PPO**: Gradient step clipping.
  - **DAgger**: Querying experts for active labels.
  - **CQL / MOPO**: Pessimism (penalizing uncertain state-action pairs).
- **Abstractions**: 
  - **Models**: Easier for representing uncertainty as prediction tasks.
  - **Values**: Summarize long-term performance.
  - **Policies**: Direct decision-making.

## 4. Open Problems in RL
- **Hyperparameter Tuning & Model Selection**: Very difficult to perform efficiently in offline settings or with single trajectories.
- **Alternatives to MDP**: Markov Decision Processes might not be the most efficient framework for all data-driven tasks.
- **Cross-Task Generalization**: Transitioning from learning single tasks "from scratch" to foundational RL agents that transfer knowledge across tasks.
- **Richer Feedback**: Moving beyond scalar rewards towards language-based feedback, preferences, and multi-agent systems.
