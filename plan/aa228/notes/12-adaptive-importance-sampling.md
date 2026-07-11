# Lecture 12: Adaptive Importance Sampling — Reading Notes

## Overview

This lecture is **Part 2 of Failure Probability Estimation**. It builds on the importance sampling (IS) recap from Lecture 11, then introduces a family of **adaptive** techniques for selecting better proposal distributions.

## Core Recap: Why Importance Sampling?

- **Direct estimation** samples from the nominal trajectory distribution $p(\tau)$; fails for rare events (all weights → 0, estimator variance explodes).
- **IS fix**: sample from a proposal $q(\tau)$ that produces more failures, then re-weight each sample:
  $$w_i = \frac{p(\tau_i)}{q(\tau_i)}$$
- **Optimal proposal** = the failure distribution itself (gives zero-variance estimator), but we cannot compute its normalizing constant $p_{\text{fail}}$ (that's exactly what we want to estimate).
- **Goal**: find a proposal we _can_ evaluate, as close to the failure distribution as possible.
- **Coverage constraint**: $q(\tau) > 0$ everywhere the failure distribution is non-zero; otherwise IS estimate is biased.

## Topic 1: Cross-Entropy Method (CEM)

**Key idea**: fit a proposal by minimizing cross-entropy to the failure distribution, using easy-to-draw samples.

### Basic CEM (single-shot)

1. Sample $m$ trajectories from an initial proposal $q$ (e.g., nominal distribution).
2. Compute importance weights (zero for non-failures, $p/q$ for failures).
3. Fit new proposal parameters via **weighted maximum likelihood** (= cross-entropy minimization).
   - For Gaussians: weighted mean and weighted std of the failure samples.
4. Use the fitted distribution as the IS proposal.

**Problem**: If failures are extremely rare, all weights may be zero → cannot fit anything.

### Adaptive CEM (iterative)

Solves the zero-weight problem by iterating with a relaxed failure threshold $\gamma$:

1. **Initialization**: pick initial proposal $q_0$ (e.g., nominal distribution); define closeness-to-failure $f(\tau) \le 0$ iff failure.
2. **Repeat** for $k = 1, 2, \dots$:
   a. Draw $m$ samples from current $q_{k-1}$.
   b. Compute $f(\tau_i)$ for each sample.
   c. Pick **elite samples**: top $m_{\text{elite}}$ by $f$ value.
   d. Set threshold $\gamma_k = \max(f(\text{elite samples}))$; cap at $\gamma_k \le 0$ (never go below failure boundary).
   e. Fit new $q_k$ by weighted MLE to samples satisfying $f(\tau_i) \le \gamma_k$.
3. Stop when $\gamma_k \le 0$ (reached actual failure region) or after $K$ iterations.
4. Use final $q_K$ as IS proposal for probability estimation.

**Key notes**:
- $m_{\text{elite}}$ is a hyper-parameter (e.g., top 50 samples).
- Works for multi-modal failures if using a mixture model as the fitted distribution.
- Typically uses robustness from STL as $f(\tau)$.

## Topic 2: Multiple Importance Sampling (MIS)

**Key idea**: instead of picking _one_ proposal, use _several_ simultaneously.

### Standard MIS (SMIS)

- Draw samples from each proposal $q_1, q_2, \dots, q_K$.
- For sample $\tau_i$ drawn from $q_i$: weight $w_i = p(\tau_i) / q_i(\tau_i)$.

### Deterministic Mixture MIS (DM-MIS)

- Assume all samples are drawn from a mixture $q_{\text{mix}} = \frac{1}{K}\sum_j q_j$.
- Weight: $w_i = p(\tau_i) / q_{\text{mix}}(\tau_i) = p(\tau_i) / \left(\frac{1}{K}\sum_j q_j(\tau_i)\right)$.
- Shown to have **lower variance** than SMIS in general.
- Both estimates are valid; DM-MIS often better in practice.

## Topic 3: Population Monte Carlo (PMC)

**Key idea**: adapt a _population_ of proposals simultaneously (MIS + adaptation).

### Algorithm Steps

1. Initialize a population of proposals $\{q_i^{(0)}\}_{i=1}^N$ spread over trajectory space.
2. **Repeat**:
   a. Draw one sample from each proposal: $\tau_i \sim q_i$.
   b. Compute importance weight $w_i = p(\tau_i) \cdot \mathbf{1}[\tau_i \text{ fails}] / q_i(\tau_i)$.
   c. **Resample** $N$ samples from $\{\tau_i\}$ weighted by $\{w_i\}$.
   d. Place a new proposal centered at each resampled point (e.g., Gaussian with fixed variance).
3. After convergence, use the final proposals for IS estimation.

**Notes**:
- The variance of new Gaussians is a hyper-parameter (exploration vs. exploitation trade-off).
- Critical: initial population must cover the full trajectory space (otherwise zero-weight problem).

## Topic 4: Sequential Monte Carlo (SMC)

**Key idea**: move samples from the nominal distribution to the failure distribution through a series of **intermediate distributions**, without ever committing to a parametric form.

### Intermediate Distributions via Smoothing

Define a family of distributions $G_1, G_2, \dots, G_N$ where:
- $G_1 = p(\tau)$ (nominal distribution)
- $G_N \propto p(\tau) \cdot \mathbf{1}[f(\tau) \le 0]$ (failure distribution, unnormalized)
- Intermediate distributions use **smoothing**: replace the hard indicator with a soft Gaussian kernel parameterized by $\epsilon$:
  $$G_\epsilon(\tau) \propto p(\tau) \cdot \mathcal{N}(f(\tau); 0, \epsilon)$$
  As $\epsilon \to 0$, $G_\epsilon \to G_N$; as $\epsilon \to \infty$, $G_\epsilon \to G_1$.

Alternative: use a decreasing threshold $\gamma$ (like CEM) instead of smoothing.

### Moving Samples (MCMC Transitions)

1. Start with $M$ samples from $G_1$ (nominal distribution — easy to sample directly).
2. For each transition from $G_{k-1}$ to $G_k$:
   a. For each sample, run an MCMC chain targeting $G_k$ (initialized from current sample position).
   b. After enough MCMC steps, samples approximately come from $G_k$.
   c. (Optional) **Resample** based on weights before MCMC to improve efficiency.
3. After reaching $G_N$, samples approximate the failure distribution.

### Weight Tracking & Probability Estimation

- Initialize weights $w_i = 1$ for all samples.
- At each transition $k$: $w_i \leftarrow w_i \cdot \frac{G_k(\tau_i)}{G_{k-1}(\tau_i)}$
- **Failure probability estimate**:
  $$\hat{p}_{\text{fail}} = \frac{1}{M} \sum_i w_i^{(N)}$$
- Non-parametric: no explicit distribution family required — works for complex, high-dimensional, multi-modal failure distributions.

## Topic 5 (Advanced): Ratio of Normalizing Constants

- IS is a special case of the general problem: estimating the ratio of normalizing constants between two distributions.
- $p_{\text{fail}}$ is the normalizing constant of the failure distribution.
- From this general perspective, additional estimators are derivable:
  - **Self-Normalized IS (SNIS)**
  - **Bridge Sampling**
  - **Umbrella Sampling**
- Not on quizzes; see book chapter 7 for derivations.

## Relevant Notebooks

| Notebook | Content |
|----------|---------|
| `failure_prob.jl` | Direct estimation, IS fitting via MCMC samples, adaptive IS section |
| `failure_dist.jl` | Rejection sampling, MCMC, smoothing for failure distribution |
| `smc.jl` | Intermediate distributions (1D & 2D), MCMC transitions, SMC visualization |

## Key Formulas Summary

| Concept | Formula |
|---------|---------|
| IS weight | $w_i = p(\tau_i) / q(\tau_i)$ |
| IS estimator | $\hat{p}_{\text{fail}} = \frac{1}{m}\sum_i w_i \cdot \mathbf{1}[\tau_i \text{ fails}]$ |
| CEM objective | $\min_\theta H(p_{\text{fail}}, q_\theta) \Leftrightarrow$ weighted MLE |
| DM-MIS weight | $w_i = p(\tau_i) / \left(\frac{1}{K}\sum_j q_j(\tau_i)\right)$ |
| SMC weight update | $w_i^{(k)} = w_i^{(k-1)} \cdot G_k(\tau_i) / G_{k-1}(\tau_i)$ |
| SMC estimate | $\hat{p}_{\text{fail}} = \frac{1}{M}\sum_i w_i^{(N)}$ |

## Mermaid Guidelines for Draft

- All Chinese node/subgraph labels must be quoted: `A["中文標籤"]`, `subgraph "中文群組"`
- Use `<br/>` for line breaks inside labels, never `\n`.
- Special characters (parentheses, colons, `+`, `×`) inside brackets need double quotes.
