# Reading Notes — Lecture 17: Guest Lecture, Anthony Corso (Terra AI)

## Speaker Background
- PhD at Stanford under Michael Kochenderfer (SISL lab)
- Post-doc + Executive Director, Stanford Center for AI Safety (3 years)
- Co-built vision-based aircraft collision avoidance system (Edinburgh exchange)
- Worked on formal methods for ML verification, and failure discovery
- Spring 2024: Founded **Terra AI** — applied AI for subsurface earth-resource problems

---

## Part 1 — Pre-Guest Content (Sydney's Recap)

### RL for Falsification
- Adversary framework: adversary applies disturbances → system takes step → reward ← closer to failure
- Exactly maps to RL setup: adversary = agent, disturbances = actions
- Benefit: plug in off-the-shelf RL algorithms; sample efficiency from decades of RL research
- Key advantage over tree-search: RL can **generalize across initial states**
- Demo: continuum world, training shows progressive improvement in causing failures from diverse start states

### Adaptive Stress Testing (AST) Definition
- coined by Richie Lee (SISL)
- Using MCTS or deep RL to find the **most likely failure** (vs. any failure)
- Reward includes likelihood of the failure (penalise low-probability disturbances)

### Simulator Requirements / Choosing a Falsification Method
| Simulator type | Compatible methods |
|---|---|
| Black-box (full trajectory) | Direct sampling, fuzzing, population methods, direct (zero-order) methods |
| Step-by-step accessible | + RL-based, tree-search-based |
| Differentiable | + First/second-order (gradient) methods |

- Failure rarity matters: rare → prefer sample-efficient methods (MCTS, RL)
- Domain-specificity: no single best algorithm; try empirically

---

## Part 2 — Anthony Corso Guest Lecture

### Motivation
- Aviation: 10^-9 failure probability requirement per 150 s; ACASX needed ~100 billion simulations on a supercomputer
- Driving: 94% of accidents due to human error; autonomous vehicles could save >1M lives/year
- Historical cases: Uber ATG 2018 pedestrian fatality (misclassification + poor prediction), Tesla autopilot crashes
- Challenge: ML systems are brittle in unexpected edge cases (e.g., truck carrying traffic lights)

### Three Challenges for Real-World AST

#### 1. Specifying the Objective
- Naive reward for pedestrian scenario: penalise non-failure + closeness heuristic + penalise rare actions
- Problem found: adversary caused pedestrian to run headlong into a stopped vehicle → not the AV's fault
- Solution: **Responsibility-Sensitive Safety (RSS)** — codifies rules of the road mathematically
  - RSS evaluates *who is at fault* in a collision
  - Modified objective: search for failures **where the AV is to blame**
  - Result: finds diagonal-walking pedestrian + biased sensor noise → AV mislocates pedestrian → collision
- Key insight: specification must encode **fault / responsibility**, not just contact

#### 2. Modelling the Environment
- Human driving behaviour is as hard to model as building a self-driving car
- Sensors (LiDAR, camera) are high-dimensional; noise is hard to characterise vs. GPS
- Approach: learn models **from data** (drone-recorded highway datasets, fixed cameras, intersection data)
- **Generative Adversarial Networks (GANs)** used to model:
  - Sequential behaviour of multiple highway agents (SISL work — realistic lane-change/braking)
  - Sensor dynamics (image appearance; GAN for runway imagery used in TaxiNet)
- This environment modelling effort often dominates total validation effort

#### 3. Optimisation / Finding Failures Efficiently

##### TaxiNet Case Study
- Task: autonomous aircraft taxi using wing camera → downsampled grayscale image → small NN → rudder control
- Small NN enables use of formal (neural) verification tools
- Naïve Monte Carlo: looks fine across weather conditions
- Approach: for each step, find pixel noise maximising steering error (left or right)
  - Uses neural verification tools (exact solver)
- Worst-case same-direction disturbance at every step → aircraft stays safe (NN is robust)
- **MCTS-based sequential disturbance search** at 3% perturbation:
  - Discovers: bias left → then switch to right → aircraft crosses runway → out-of-distribution → goes off runway
  - Sequence of events matters; failures emerge from complex interactions
- At 2%: no failures found (but cannot prove absence)

##### DIFFS (Diffusion-based Failure Sampling) — Harrison's work
- Problem: high-dimensional systems (F-16, inverted pendulum) → hard for traditional optimisers
- Insight: treat failure discovery as a **conditional generative modelling** task
- Algorithm (iterative):
  1. Sample disturbances from prior (Gaussian), compute risk metric R (miss distance)
  2. Train diffusion model conditioned on (disturbance, R)
  3. Sample new disturbances at higher R threshold; re-evaluate; add to dataset
  4. Iterate until risk threshold reaches failure zone
- Toy example: 2D Gaussian disturbance, failure boxes top-left/top-right
- Results: matches ground-truth failure distribution obtained by massive MC
- Scales to F-16 (high DoF) — finds realistic high-likelihood failures

### Safety is Holistic
- AST = one tool in a larger cycle: requirements → design → test → deploy
- Transfer learning for AST: reuse failure cases from old system version to warm-start validation of updated system → dramatic reduction in search time

---

## Part 3 — Terra AI / Earth Resource Problems

### Climate Context
- Current policies → ~2.7 degrees C heating; pathways to 1.5–2 degrees C exist but require action
- Need: more energy + less CO2 + critical minerals (copper, nickel, lithium) for electrification
- New mineral discoveries declining despite increased exploration investment → need to look deeper

### Subsurface as Key Resource
- Raw materials, geothermal energy, hydrogen storage, carbon sequestration
- Common challenge: **high uncertainty in subsurface geology**, complex decisions, limited observations
- Formulated as **POMDP**: partial observability (unknown geology) + sequential actions + objectives/constraints

### Carbon Storage (CCS) Problem
- Inject CO2 into deep saline aquifers capped by impermeable rock
- Uncertainty: don't know subsurface structure; observations: seismic surveys, borehole sensors, exploration drills
- Key questions: where to inject? how much capacity? which measurements to collect first?
- Physics simulator: 10–12 hours per simulation → need surrogate model
  - Surrogate: supervised NN trained on physics-sim outputs → thousands x faster
  - POMDP solver outperforms human reservoir engineers (16% → ~0% CO2 leakage)

### Safety Risks (Safety-Critical Dimension)
1. **Induced seismicity** — high-pressure injection can reactivate faults → earthquakes (South Korea geothermal case)
2. **CO2 leakage** — natural CO2 outgassing example: Lake Nyos 1986, suffocated village and livestock
3. Offshore preferred; onshore projects under discussion

### Future Directions
- Apply AST-style failure discovery to subsurface decision-making agents
- Search for adverse geological configurations that lead to worst outcomes
- Simplified CO2 injection POMDP available as NeurIPS workshop benchmark

---

## Key Quotations
- "Any old failure … you can make really extreme disturbances. You want the most likely failure." — Corso on AST objective
- "Failures can emerge from really complex interactions." — on TaxiNet MCTS result
- "Safety is really holistic… from how you think about requirements to design to test to deployment." — closing

## Cross-References
- Lecture 9: Falsification via planning (MCTS, RRT)
- Lecture 10: RL-based falsification
- Richie Lee — original AST paper (ACASX)
- Robert's work — broader multi-scenario AST framework
- Harrison — DIFFS diffusion-based failure sampling
- Neural verification tools (upcoming lectures)
- POMDP / decision under uncertainty (Michael Kochenderfer's courses)
