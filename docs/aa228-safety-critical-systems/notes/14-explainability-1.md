# Lecture 14: Explainability 1 — Reading Notes

## Overview
This lecture shifts focus from "does it work?" to "**why** does it work?" Explainability gives engineers more confidence that a system is working for the right reasons and helps identify potential failure modes. The instructor covers five main topics:
1. Policy Visualization
2. Feature Importance (Sensitivity Analysis + Shapley Values)
3. Surrogate Models
4. Counterfactuals (brief mention)
5. Failure Mode Characterization (Clustering)

---

## Key Concepts

### 1. Policy Visualization
- **Rollout visualization**: Simplest method — just roll out the agent and observe its behavior (e.g., CAS climbs above or below an intruder; inverted pendulum stays upright or falls).
- **Policy plotting (2-D states)**: Plot the action over a 2-D state space grid (e.g., inverted pendulum with θ and ω axes). Good sanity check.
- **Policy slicing (high-dimensional states)**: For 4-D+ states (e.g., ACAS Xu), fix some dimensions and plot slices. Reveals interesting features like "notch" regions where no advisory is given because climb vs. descend is ambiguous.
- **State-space partitioning**: Partition the state space into regions, run many rollouts, record the most-frequently taken action per region. Works for non-Markovian (history-dependent) systems because rollout history is tracked.

---

### 2. Feature Importance

#### 2a. Sensitivity Analysis
- **Goal**: Understand how an output changes when a single feature is varied.
- **Method (sampling)**: For each feature i (e.g., each disturbance timestep), keep all other features fixed, resample feature i repeatedly, measure the spread (e.g., variance) of the resulting outputs/robustness values.
- **Key insight**: Disturbances applied **earlier** in a trajectory tend to have higher sensitivity than later ones.
- **For images (pixel sensitivity)**: Resample each pixel individually, measure steering angle spread. Computationally expensive O(# pixels) rollouts.

#### 2b. Saliency Maps (Gradient-based)
- **Idea**: Use the gradient of the output w.r.t. each input feature. High-gradient features are more sensitive.
- **Vanilla saliency map**: Plot |∇_x f(x)| at the current input point.
- **Limitation**: Misses **saturated features** — if the function is flat at the current point, the gradient is near zero even if the feature genuinely matters globally.
- **Integrated Gradients**: Start from a baseline input (e.g., all-black image), gradually interpolate to the actual input, average gradients along the path. Captures global sensitivity even for saturated features.
- **SmoothGrad**: Average gradients over noisy versions of the input.

#### 2c. Caution: Sanity Checks for Saliency Maps
- Paper: *Sanity Checks for Saliency Maps* (Adebayo et al.)
- Finding: Some saliency methods are **independent of the model and the data-generating process**. Replacing the model with random weights, or shuffling labels, produces nearly identical saliency maps.
- Takeaway: Saliency maps can look plausible yet be completely unfaithful — always apply skepticism.

---

#### 2d. Shapley Values
- **Motivation**: Sensitivity analysis only varies one feature at a time, missing **feature interactions**. Example: in a wildfire grid, two burning cells each have no individual sensitivity on the corner cell, but removing both reveals the combined effect.
- **Key idea**: Consider the effect of including vs. excluding a feature **across all possible subsets** of other features.
- **Algorithm**:
  1. Randomly sample a subset S of other features and fix them to their original values.
  2. Resample the remaining features from the nominal distribution.
  3. Compute output with feature i **included** in S vs. **excluded**.
  4. Take the difference; repeat many times; average across subsets.
- **Computational challenge**: With n features, there are 2^n subsets (e.g., 25 cells → 16 million subsets). In practice, randomly sample a manageable number of subsets.
- **Application**: For the inverted pendulum, Shapley values are highest for disturbances that make the pendulum think it is more upright than it is. Zeroing out the top-4 Shapley-valued disturbances converts a failure trajectory into a non-failure.

---

### 3. Surrogate Models
- **Purpose**: Approximate a complex policy (e.g., neural network) with a simpler, interpretable model.
- **Tradeoff**: High fidelity ↔ high interpretability (not both at once).

#### Linear Surrogate Models
- Fit a linear model to a local region of the policy.
- Weights indicate relative feature importance in that region.
- Works best **locally** (LIME paper builds on this idea).
- Adding polynomial/interaction features improves fit but reduces interpretability.

#### Decision Tree Surrogate Models
- Train a decision tree (e.g., `DecisionTree.jl` in Julia) to approximate the policy.
- Very interpretable: the tree shows which features are queried and in what order.
- Example on ACAS: tree first splits on relative altitude, then on whether it exceeds ±98 ft to decide climb/descend/clear.
- Larger trees with more branches → better fidelity, worse interpretability.

---

### 4. Counterfactuals (Brief)
- A **counterfactual** asks: "What would have happened if input x had been x' instead?"
- Useful for explaining individual decisions.
- Not covered in detail in this lecture; see **Section 11.5** of the textbook.

---

### 5. Failure Mode Characterization (Clustering)
- **Goal**: After collecting many failure trajectories, cluster them to identify distinct failure modes.
- **Algorithm**: K-means (or other clustering algorithms).
- **Feature choices** for clustering:
  - Handpicked statistics: average θ, average ω → two clean clusters (falls left, falls right).
  - Full state trajectory vectors → same result for the pendulum.
  - Action trajectory vectors → also interpretable.
  - Disturbance trajectory vectors → less interpretable for the pendulum.
  - **PSTL (Parametric Signal Temporal Logic)**: Cluster in parameter space → clusters correspond to interpretable temporal properties (e.g., "fell over before time t" vs. "after time t").
- **Dependency**: Results heavily depend on the feature choice; domain knowledge required.

---

## Motivating Context
- Lecture opens with a real example: the ACAS X system uses importance sampling to estimate the probability of near-mid-air collisions more efficiently than naive Monte Carlo.
- Explainability is presented as complementary to falsification and probability estimation.
- Regulatory and stakeholder requirements sometimes mandate explainability.

## Relevant Notebooks
- No dedicated explainability notebook found in `lectures_material/notebooks/`; closest is `failure_analysis.jl` and `failure_dist.jl` for clustering failure modes.

## Key References Mentioned
- *Sanity Checks for Saliency Maps* (Adebayo et al.)
- LIME paper (local interpretable model-agnostic explanations)
- Mechanistic interpretability as an emerging research direction
- PSTL / parametric signal temporal logic for failure clustering
