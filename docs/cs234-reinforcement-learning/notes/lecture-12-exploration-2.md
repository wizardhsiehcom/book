# Lecture 12: Exploration 2

## Core Concepts

### 1. PAC (Probably Approximately Correct) Algorithms
- **Definition**: A PAC algorithm chooses an action whose value is $\epsilon$-optimal on all but a polynomial number of time steps with high probability ($1-\delta$).
- **Difference from Regret**: Regret penalizes all suboptimal actions. PAC only counts actions that are worse than optimal by more than $\epsilon$ as "mistakes," and aims to bound the total number of these mistakes.

### 2. Bayesian Bandits
- **Prior Knowledge**: Unlike frequentist methods that make minimal assumptions (e.g., bounded rewards), Bayesian bandits leverage prior knowledge (statistical models) about reward distributions.
- **Bayes' Rule**: Updates the prior distribution over unknown parameters to a posterior distribution after observing rewards.
- **Conjugate Priors**: If the prior and likelihood function are conjugate (e.g., Beta prior for Bernoulli likelihood), the posterior stays in the same distribution family, allowing analytical updates. For a Bernoulli reward, the Beta($\alpha, \beta$) distribution simply increments $\alpha$ on success and $\beta$ on failure.

### 3. Thompson Sampling (Probability Matching)
- **Algorithm**:
  1. Sample reward parameters from the posterior distribution for each arm.
  2. Choose the arm that maximizes the expected reward given the sampled parameters.
  3. Observe the actual reward.
  4. Update the posterior distribution.
- **Advantages**:
  - Handles delayed or batched feedback naturally. Since it samples from a distribution, it explores even without immediate posterior updates.
  - Can be computationally elegant.
- **Drawbacks**:
  - A highly misleading prior can cause poor performance initially.
  - Regret bounds might not always match the optimal frequentist UCB bounds.

### 4. Index Policies & Gittins Index
- An index policy computes a real-valued index for each arm using only statistics from that arm, and plays the arm with the highest index.
- **Gittins Index**: An optimal policy exists for maximizing expected discounted reward in a Bayesian multi-armed bandit, relying only on separate arm statistics.

### 5. Real-World Applications
- **EVA (Greece Covid-19 Testing)**: Modeled as a non-stationary contextual batch bandit with delayed feedback and constraints. Showcases the complexity of deploying bandit algorithms in real-world resource-constrained settings.
