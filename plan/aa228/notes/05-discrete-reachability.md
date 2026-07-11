# Lecture 05: Discrete Reachability
## 1. Nonlinear Reachability (Continued)
- **Taylor Models**: Overcomes the limitation of interval inclusion functions which only output hyper-rectangles. A Taylor model evaluates a Taylor polynomial (for an approximation) up to degree $n-1$, and adds an interval remainder to bound the approximation error. This lets us use more expressive sets like polytopes instead of hyper-rectangles.
- **Conservative Linearization**: Essentially a second-order Taylor model. The function is evaluated as a center point plus a Jacobian (first-order Taylor polynomial) multiplied by the deviation, along with an interval remainder. This allows using linear reachability operations (like Minkowski sums) to propagate polytopes.
- **Concrete Reachability vs. Symbolic Reachability**:
  - *Symbolic*: Evaluates the full T-step rollout function. Suffers from compounding nonlinearities but avoids the wrapping effect. Can be computationally expensive.
  - *Concrete*: Computes the exact reachable set step-by-step. Minimizes compounding nonlinearities, but over-approximating the reachable set at each individual step leads to accumulating error over time (the "wrapping effect").
- **Partitioning**: Partitioning the initial state set into smaller subsets. Running reachability on smaller subsets yields less over-approximation error because local linearizations are more accurate. Taking the union of the resulting sets can represent non-convex shapes.

## 2. Discrete Systems as Graphs
- Discrete state systems can be easily represented using **directed graphs**.
- **Nodes**: Represent the discrete states (e.g., squares in a grid world).
- **Edges**: Represent valid transitions.
- **Weights**: Represent transition probabilities.
- Built-in functions in Julia (like `successors`) can be used to construct the graph by determining the next states and transition probabilities.

## 3. Discrete Reachable Sets
- **Forward Reachability**: Similar to breadth-first search. Starting from an initial set, step forward along edges to find all states that can be reached in $T$ steps.
- **Backward Reachability**: Start from a target/avoid set and step backward along the edges.
- **Invariant Sets**: A set is invariant if the reachable set from it is a subset of itself. In discrete spaces, this simply requires checking if one set of nodes is a subset of another.
- **Satisfiability**: We can determine if a system is safe by checking if the forward reachable set intersects an avoid set, or if the backward reachable set intersects the initial state. Since computing the full reachable set can be overkill for just checking intersection, techniques like heuristic search or boolean satisfiability (SAT/SMT) can be used.

## 4. Probabilistic Reachability
Allows calculating the likelihood of reaching particular states instead of just binary "reachable vs. unreachable."
- **Probability of Occupancy**: Computes the distribution of states at time $t$. Done recursively: the probability of being in state $s$ at time $t+1$ is the sum over all states $s'$ of (Probability of being in $s'$ at $t$ $\times$ Transition probability from $s'$ to $s$). These probabilities sum to 1 across all states at a given time step.
- **Probability of Reaching a Set**: Computes the probability that a system reaches a target set within $T$ steps starting from state $s$. Recursively built backwards or forwards. The probabilities across different states do not sum to 1.

## 5. Discrete State Abstraction
- Connects continuous systems to discrete reachability methods.
- **Process**:
  1. Partition the continuous state space into grid cells (each cell becomes a discrete node).
  2. Perform continuous reachability (e.g., using conservative linearization) from a given cell to find its forward reachable set.
  3. Over-approximate the transition by drawing edges to any new cell that intersects the computed reachable set.
- **Advantage**: It allows taking continuous systems and leveraging discrete graph algorithms for reachability analysis. Taking the union of the abstracted cells often yields much tighter and more expressive, non-convex bounds.
