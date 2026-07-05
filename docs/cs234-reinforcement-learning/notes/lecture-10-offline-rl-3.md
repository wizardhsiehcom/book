# Lecture 10: Offline RL 3

## Overview
This lecture covers offline (batch) reinforcement learning, discussing why it is harder than online RL or imitation learning, and introducing policy evaluation and optimization techniques for offline data.

## Key Concepts

### Beyond Imitation Learning
- Offline RL aims to find decision policies that perform better than the behavior policy used to collect the data.
- Applications: Healthcare (e.g., hypotension treatment), Education (e.g., adapting learning paths to increase student persistence).

### Challenges in Offline RL
- **Counterfactual estimation**: Evaluating what would have happened if a different action was taken.
- **Data censoring and distribution shift**: The deadly triad (off-policy learning, bootstrapping, function approximation) can cause divergence in standard methods like Q-learning.

### Batch Policy Evaluation
1. **Model-Based Evaluation**:
   - Learn a dynamics and reward model (simulator) from data, then evaluate or extract a policy.
   - **Issue**: Model misspecification. A better-fitting model might still lead to a worse extracted policy because the evaluation is biased under the misspecified model. You can re-weight data to match the target policy distribution to mitigate this.
2. **Model-Free Evaluation (Fitted Q Evaluation)**:
   - Similar to DQN but without the max operator; fits a Q-function for a fixed policy $\pi$.
   - Assumes realizability and the Markov property. Error depends on the concentrability coefficient (state-action distribution overlap).
3. **Importance Sampling (IS)**:
   - Provides an unbiased estimator without needing a correct model or Markov assumption.
   - Re-weights samples from the behavior policy by the likelihood ratio under the target policy vs. behavior policy. In MDPs, the unknown transition dynamics cancel out!
   - **Requirements**:
     - *Coverage/Support*: The behavior policy must have non-zero probability for any action the target policy takes.
     - *No hidden confounding*: All variables affecting the action choice must be observed.
   - **Extensions**: Per-decision importance sampling and doubly robust estimators help reduce the high variance of IS.

### Offline Policy Optimization
- **Pessimism under Uncertainty**: In real-world datasets, complete coverage of all possible policies is rare. To avoid overestimating the value of unseen state-action pairs, offline RL algorithms apply pessimism.
- **Methods**:
   - Limit the learned policy to stay close to the behavior policy (e.g., BCQ).
   - Penalize Q-values or rewards for out-of-distribution actions (e.g., CQL, MOPO).
   - *Example (MBSPO)*: A filtration function that zeroes out the value of transitions with insufficient data density, creating a lower bound on the true value and preventing the policy from taking actions that lead to unknown states.
