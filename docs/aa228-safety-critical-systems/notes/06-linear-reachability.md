# Lecture 06: Reachability for Linear Systems

## Core Concepts
- Shift from failure analysis (falsification, failure distribution, probability estimation) to **formal methods** (proving the absence of failure).
- Under a set of assumptions, prove a system will never fail.
- This is achieved via **reachability analysis**: compute the full set of states the system could reach over time.

## Running Example
- Mass-spring-damper system: simple 1D linear system. Agent applies force, sensor has noise.
- Goal: verify it does not exceed a position bound (avoid set / failure set).
- Assumptions:
  - Initial states come from a bounded set (e.g. position $\in [-0.2, 0.2]$, velocity = 0).
  - Disturbances (like observation noise) come from a bounded set (e.g. noise $\in [-1, 1]$).
- Converting probability distributions to bounded sets: use the support of the distribution, or cut it off at a few standard deviations if infinite.

## Reachable Sets
- **Depth $d$ ($R_d$)**: Set of all states reachable exactly at time step $d$.
- **Horizon $1 \dots h$ ($R_{1:h}$)**: Union of $R_d$ from $d=1$ to $h$.
- Safety condition: $R_{1:h} \cap \text{Avoid Set} = \emptyset$.
- Infinite-time guarantee: If $R_d \subseteq R_{d-1}$ (or a previous union), $R_d$ is an invariant set, and the system stays there indefinitely.

## Set Operations for Linear Systems
- Next state calculation requires matrix multiplications and additions.
- For sets, these correspond to:
  - **Linear Transformation**: $A\mathcal{P} = \{ Ap \mid p \in \mathcal{P} \}$.
  - **Minkowski Sum**: $\mathcal{P} \oplus \mathcal{Q} = \{ p + q \mid p \in \mathcal{P}, q \in \mathcal{Q} \}$.
- The next reachable set is recursively defined using these operations on the previous reachable set and disturbance sets.
- Code uses `LazySets.jl` in Julia, which provides `⊕` for Minkowski sum.

## Set Representations
- Desired properties: Finite representation, efficient operations, closed under set operations.
- **Convex Sets**: The line between any two points in the set is inside the set.
- **Polytopes**:
  - *H-polytope*: Intersection of half-spaces (linear inequalities $Ax \le b$).
  - *V-polytope*: Convex hull of a set of vertices.
- **Problem with Polytopes**: Minkowski sum of two V-polytopes multiplies the number of candidate vertices. Over many timesteps, the number of vertices grows *exponentially*.

## Solutions to Exponential Growth
1. **Zonotopes**: A special class of polytopes formed by the Minkowski sum of a center point and a set of line segments (generators).
   - Under Minkowski sum, we just add the generators together. The number of generators grows *linearly* instead of exponentially.
   - A hyper-rectangle is a zonotope whose generators are aligned with the axes.
2. **Over-approximation**: $\mathcal{P} \subseteq \overline{\mathcal{P}}$.
   - Periodically approximate a complex set with a simpler set (e.g., fewer vertices).
   - If $\overline{\mathcal{P}} \cap \text{Avoid Set} = \emptyset$, the system is safe.
   - If they intersect, it is inconclusive (cannot prove safety or failure).
