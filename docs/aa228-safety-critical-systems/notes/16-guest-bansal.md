# Lecture 16: Guest Lecture – Somil Bansal (Safe & Intelligent Autonomy Lab)

## Speaker Background
- Professor at Stanford AA department; leads the **Safe and Intelligent Autonomy (SAIL) Lab**.
- Former: assistant professor at USC ECE, research scientist at Waymo.
- Focus: robotics & autonomy with guaranteed safety and performance in new/uncertain environments.
- Application domains: autonomous drones, cars, aircraft, space robotics.

---

## Core Theme: Safety as a Continuous Process

Three-stage framework:
1. **Training-time safety**: programmatically incorporate safety requirements so the policy is safety-aware.
2. **Deployment-time adaptation**: detect when operating out-of-distribution (OOD) and adapt safety correspondingly.
3. **Stress testing & lifecycle improvement**: mine safety-critical failures and use them to improve the system.

Today's focus: **stage 3 – stress testing vision-based controllers**.

---

## Key Concepts

### 1. Problem Formulation – Mining Failures in Vision-Based Controllers
- **System**: robot with dynamics (state x, control u), visual sensor → RGB images → vision-based controller → control.
- Simulator available for stress testing.
- **Goal**: find visual inputs I that lead to system safety violations.
- Approach: cast failure discovery as a **reachability problem**.
  - Concatenate observation function + vision controller → equivalent state-based policy.
  - Compute **Backward Reachable Tube (BRT)** of the simplified closed-loop system.

### 2. Hamilton-Jacobi (HJ) Reachability – 5-minute Primer
- **Backward Reachable Tube (BRT)**: set of all initial states from which the system will eventually enter the failure set despite best control effort.
- **Safe Set** (complement of BRT): control-invariant set; there exists a policy to keep the system inside forever.
- **Implicit representation of failure set** via function L(x):
  - L(x) < 0 inside failure set; L(x) > 0 outside.
  - Popular choice: signed distance function to failure region.
- **Cumulative safety reward** = min over trajectory of L(x(t)):
  - Negative = trajectory entered failure set; positive = trajectory is safe.
- **Game**: disturbance minimizes cumulative reward; control maximizes it.
- **Value function V(x)**: represents closest the system will get to the failure set.
  - V(x) < 0 = unsafe state; V(x) > 0 = safe state.
  - BRT = {x : V(x) < 0}.
- **PDE for V**: continuous-time Bellman equation (Hamilton-Jacobi-Isaacs PDE).
- **Safety controller**: gradient ascent in V pushes system toward higher (safer) values.
- Gravity example: asymmetric BRT for quadrotor because gravity biases toward floor.

### 3. Stress Testing Vision-Based Controllers via BRT
Steps:
1. Combine vision observation + controller -> state-based policy g(x).
2. Solve simplified PDE (no optimization over control, plug in g(x)).
3. Identify BRT (failure region in state space).
4. Collect images seen along failure-state trajectories -> failure images.

### 4. Case Study 1 – Autonomous Aircraft Taxiing
- Controller: CNN using right-wing camera -> keep aircraft on runway.
- Failure set: veering off runway.
- BRT computed -> red region (fail) / blue region (safe).
- Key finding: runway markings confused the CNN with center line -> semantic failure.
- Important distinction:
  - States with high vision prediction error != states that cause system failure.
  - Some low-error states still trigger system failure; some high-error states are benign.
  - BRT targets system-level failures, not just component-level errors.

### 5. Environment Variations (Latent Variables)
- BRT can be computed for different environment latents (time of day, cloud cover).
- BRT grows from day to night (lower visibility).
- Runway-marking failure disappears at night (markings not visible, CNN not confused).
- Enables building a catalog of failures across diverse conditions.

### 6. Case Study 2 – Indoor Navigation (ResNet-based)
- Architecture: RGB image -> ResNet -> waypoint -> low-level MPC controller.
- Trained in sim (Stanford buildings) -> good sim-to-real transfer.
- Stress test finding: CNN learned spurious correlation between light-colored surfaces and traversability.
  - Training data: light floors + dark walls.
  - Failure: light walls + dark floors -> robot tries to go through wall.

### 7. Using Failure Data to Improve the System

#### A. Runtime Anomaly Detection
- Train a binary classifier on failure images (from BRT) vs. safe images.
- At runtime: if input classified as failure -> trigger fallback controller.
- Demo: anomaly detector flags runway-marking image -> fallback slows aircraft -> resumes after.
- Limitation: only works in-distribution of stress-tested environments.

#### B. Targeted Incremental Retraining
- Retrain vision controller on failure images + labels.
- BRT shrinks in some slices after retraining.
- Challenge: no guarantee of monotonic improvement in neural networks.
  - Adding data D2 superset D1 does not guarantee better performance.
  - Retraining can introduce new failures while fixing old ones.

---

## Open Challenges

| Challenge | Description |
|-----------|-------------|
| Generalization | Stress testing limited to tested environments; OOD environments untreated. Potential solutions: digital twins, NeRF/Gaussian splatting. |
| Monotonic improvement | Neural networks have no guarantee of improving uniformly when trained on more data. |
| Interpretability / blame assignment | BRT identifies failure images but not which visual feature caused the failure. Manual analysis required. |
| OOD detection | Anomaly detector is in-distribution only; full OOD detection is a separate hard problem. |
| Black-box vs. modular testing | E2E BRT = simple spec but poor interpretability; modular testing = better blame but hard specs + hard uncertainty propagation. |

---

## SPARK: System-Level Safety under Perception Uncertainty

Context: modular autonomous driving pipeline (Perception -> Prediction -> Planning).

### Key Insight
- Not all perception errors affect safety equally.
  - Missing a far-away, irrelevant car -> plan unchanged.
  - Missing a close, on-path car -> unsafe plan.

### SPARK Framework
- Input: perception monitor output (probability distribution of missed agent positions) + ego plan + scene context.
- Output: safety assessment (safe / risky / critical) + repair (alternative safe plan).
- Training: supervised learning on offline-simulated perception uncertainty scenarios.
- Runtime: 42 Hz on standard GPU (vs. 10 Hz exhaustive planning-based evaluation).
- Perception monitor: sensor fusion (camera + LiDAR + radar) to identify misdetections via agreement check.

---

## System-Level vs. Component-Level Testing

| Dimension | End-to-End (System-Level) | Modular (Component-Level) |
|-----------|--------------------------|--------------------------|
| Spec | Easy to write (e.g., collision) | Hard to write per component |
| Interpretability | Low – can't trace blame | Higher – blame per module |
| Failure region | Tighter (captures compensated errors) | Conservative (superset due to propagation difficulty) |
| Improvement | Hard to target specific module | Easier to target a component |

---

## Summary of Key Takeaways

1. Safety of learning-based systems should be treated as a continuous process (train -> deploy -> improve).
2. HJ reachability provides a principled, mathematically grounded tool for stress testing.
3. System-level stress testing is qualitatively different from and complementary to component-level testing.
4. Mined failures can be used both offline (retraining) and online (anomaly detection).
5. Open problems: generalization, monotonic improvement, interpretability, uncertainty propagation.
