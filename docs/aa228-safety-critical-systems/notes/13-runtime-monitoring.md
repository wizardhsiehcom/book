# Lecture 13: Runtime Monitoring — Reading Notes

## Motivation

- All prior chapters cover **offline validation** (before deployment).
- Real-world edge cases (fountain in road, traffic lights on truck) can never be fully captured in a model.
- Runtime monitoring = the "ultimate answer" to catching what offline validation misses.
- Goal: **flag hazardous situations at runtime** → trigger fallback (safe mode, human takeover).

---

## Part 1: Operational Design Domain (ODD) Monitoring

### Concept
- **ODD**: the set of conditions the system was designed (validated) to operate safely in.
- Outside ODD → offline validation guarantees no longer hold.
- Similar to **out-of-distribution (OOD) detection**, but framed around validation coverage.

### Two Ways to Define ODD

| Approach | Description | Pros | Cons |
|---|---|---|---|
| Hand-designed features | Enumerate conditions (e.g., daytime, no rain) | Interpretable, domain-driven | Requires expertise; hard to be exhaustive |
| Data-driven | Use all states/images seen during offline validation | Automatic | Needs careful design of representation |

Lecture focuses on **data-driven** approaches.

### Method 1: Nearest Neighbors
- A point is in ODD if its nearest neighbor in the dataset is within threshold distance δ.
- Tunable: smaller δ → more conservative; larger δ → larger ODD.
- Can require k nearest neighbors within δ to remove outliers.
- **Drawback**: must store entire dataset in memory at runtime (KD-tree helps with lookup but not storage).
- **Improvement**: cluster data (k-means), use cluster centers instead.

### Method 2: Polytope (Convex Hull)
- Convex hull of data = compact polytope representation.
- Problem: real ODD may be **non-convex**.
- Solution: cluster data first, then take **union of convex hulls** of each cluster.
- "Whole Monitor" — the book's hull-monitor pun.

### Method 3: Super-Level Set of a Distribution
- Fit a distribution to data (e.g., multivariate Gaussian or Gaussian Mixture Model).
- ODD = super-level set: all points where density >= threshold τ.
- GMM fits complex, non-convex data better than single Gaussian.
- Can also train a **classifier** (in-ODD vs. out-of-ODD) and threshold probability.
  - Drawback: requires out-of-ODD data, which is usually unavailable.

### High-Dimensional ODD (Images)
- Curse of dimensionality: 4096-dim image space is enormous.
- Two problems: (1) need massive data to cover the space; (2) Euclidean distance loses semantic meaning.
- **Solutions**:
  - Better models that scale (normalizing flows — but known issues).
  - **Dimensionality reduction** (e.g., autoencoder) → define ODD in latent (lower-dimensional) space.
- **Feature Collapse**: distinct out-of-ODD images can map to same region as in-ODD images in latent space. Hard to detect. Be careful.

---

## Part 2: Uncertainty Quantification

### Two Types of Uncertainty

| Type | Also called | Cause | Example |
|---|---|---|---|
| Output uncertainty | Aleatoric / irreducible | Inherent randomness in world (sensor noise, other agents) | Blurry photo of two similar faces |
| Model uncertainty | Epistemic / reducible | Lack of data / knowledge | Ranch dressing testifying in court |

### Output Uncertainty (Aleatoric)
- **Regression**: allow model to output both mean μ(x) and variance σ²(x) (heteroscedastic).
  - Loss: includes MSE term and log-variance penalty → pushes variance up where prediction error is high.
  - Result: calibrated uncertainty where data is sparse/noisy.
- **Classification**: softmax already outputs a distribution → use entropy or spread as uncertainty.
  - Problem: modern NNs are **overconfident** (poor calibration).
  - Solution: **Temperature Scaling** — divide logits by λ before softmax.
    - λ = 1: original softmax; λ → 0: uniform (max uncertainty); λ → ∞: one-hot (max confidence).
    - Pick λ by minimizing NLL on a calibration set.
- **Prediction Sets**: instead of a distribution, output a set with guaranteed coverage (e.g., 95%).
  - Larger set → higher uncertainty.
  - Requires calibrated distribution; if not calibrated, use **Conformal Prediction**.
  - Conformal prediction: generates valid prediction sets even without calibration — hence its popularity.

### Model Uncertainty (Epistemic)
- Cannot quantify with output uncertainty methods (no data in region → no calibration possible).
- **Bayesian approach**: maintain a distribution P(θ | D) over all possible model parameters.
  - Prediction: P(y | x, D) = ∫ P(y | x, θ) P(θ | D) dθ — called **Bayesian Model Averaging**.
  - Intractable in general (integral over all possible NNs).
- **MCMC** sampling of θ is possible but expensive.
- **Practical solution: Deep Ensembles**.
  - Train multiple models with different random initializations → different local minima.
  - Approximate integral by averaging over ensemble.
  - Region with consistent ensemble predictions → low model uncertainty; divergent → high.
  - Pitfall: ensemble models can all collapse to the same local minimum → all confidently wrong.
  - Need to ensure **sufficient diversity** (different architectures, randomized prior functions, etc.).
- Gaussian Processes naturally encode both types of uncertainty but don't scale to high dimensions.

---

## Part 3: Failure Monitoring

- Assumes we're inside ODD but may enter known dangerous regions found during offline validation.
- Options:
  1. **Run offline algorithms online**: reachability from current state; rollouts to estimate P(failure).
  2. **Precompute risk map offline**: store probability of failure per state; monitor at runtime.
- Related practice in CV: **Test-Time Augmentation (TTA)** — run model on augmented inputs, use output variance as uncertainty.

---

## Course Wrap-Up

- Swiss cheese model: no single method is a silver bullet. Layer methods so holes don't align.
- Open research problems exist in all areas discussed.

---

## Key Terms

| Term | Meaning |
|---|---|
| ODD | Operational Design Domain |
| Feature Collapse | Distinct OOD inputs map to same latent region as in-ODD inputs |
| Aleatoric Uncertainty | Irreducible, from world randomness |
| Epistemic Uncertainty | Reducible, from model limitations / lack of data |
| Temperature Scaling | Post-hoc calibration via softmax temperature λ |
| Conformal Prediction | Coverage-guaranteed prediction sets without calibration |
| Bayesian Model Averaging | Average predictions across distribution of models |
| Deep Ensembles | Practical approximation of Bayesian model averaging |
| TTA | Test-Time Augmentation |
