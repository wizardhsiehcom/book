# Lecture 09: Falsification through Planning

## Key Concepts

1. **Finding Likely Failures using Optimization**:
   - Purely minimizing robustness might find highly unlikely failure modes.
   - Solution: Incorporate likelihood into the objective function.
   - Likelihood of a trajectory is the product of the probability of the initial state and the probabilities of all disturbances. Often use log-likelihood for numerical stability.
   - Objective function usually trades off between robustness and log-likelihood (e.g., using a weighting parameter $\lambda$).

2. **Optimization Algorithms**:
   - **Local Descent Methods**: Rely on gradients (First-order: Gradient Descent; Second-order: Adam, L-BFGS). Vulnerable to local minima.
   - **Zero-order/Direct Methods**: Do not require gradients, good for black-box systems (e.g., Hooke-Jeeves, Nelder-Mead).
   - **Population Methods**: Maintain a population of samples instead of a single trajectory to cover more space and find multiple failure modes.

3. **Falsification through Planning**:
   - Motivation: Saving work periodically is better than doing it all at once. Trajectory optimization explores a very high-dimensional space. Tree search iteratively builds up the trajectory.
   - Unified Framework:
     - **Select Step**: Select a node in the current tree to extend.
     - **Extend Step**: Sample a disturbance, take a step, and add the result to the tree.

4. **Heuristic Search (e.g., Rapidly Exploring Random Trees - RRT)**:
   - Vanilla RRT: Sample random goal state -> find closest node in tree -> sample random disturbance -> add node.
   - Improvements: Sample goal strictly from the failure region; sample multiple disturbances and pick the one that gets closest to the goal.
   - Cost functions to find specific types of failures (Current Cost + Cost-to-Go heuristic):
     - Shortest path: Cost = distance, Heuristic = distance to goal.
     - Most likely failure: Cost = negative log-likelihood, Heuristic = proxy like distance to goal.
   - **A* Search**: If state and disturbance spaces are discrete and heuristic is admissible (never overestimates), we are guaranteed the optimal path.

5. **Monte Carlo Tree Search (MCTS)**:
   - Balances exploration and exploitation explicitly.
   - Maintains a value estimate $Q$ (lower is closer to failure) and visit count $N$.
   - **Progressive Widening** (for continuous spaces): If children $\le k N^\alpha$, we extend the node. Otherwise, we traverse down using Lower Confidence Bound (LCB).
   - **LCB**: $Q_{child} + c \sqrt{\ln N / N_{child}}$. Balances low $Q$ (exploitation) and low $N_{child}$ (exploration).
   - **Extend & Propagate**: When a node is added, estimate $Q$ (e.g., via rollouts), and propagate this new info up the tree by updating $N$ and $Q$ moving averages.
