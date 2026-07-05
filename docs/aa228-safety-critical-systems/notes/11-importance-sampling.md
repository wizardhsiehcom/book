# Lecture 11: Importance Sampling

## Key Concepts

### Part 0 — Recap: Smoothing for MCMC (end of Lecture 10)

1. **Failure Distribution Recap**:
   - We want samples from the *failure distribution* = nominal trajectory distribution conditioned on failure.
   - The normalizing constant of the failure distribution = **probability of failure**.

2. **Smoothing**:
   - Define distance-to-failure: `δ(τ) = max(ρ(τ), 0)` (0 if failure, positive otherwise).
   - Replace the indicator `𝟙[τ ∈ failure]` with a smooth Gaussian approximation centered at 0 with small variance ε.
   - Small ε → almost no smoothing; ε → ∞ → approaches nominal distribution.
   - After MCMC sampling from the smoothed density, **reject non-failure samples** (equivalent to rejection sampling with the smooth distribution as proposal).

3. **Scaling MCMC**:
   - Gradient-based kernels (HMC, NUTS) improve mixing efficiency.
   - Probabilistic programming (Turing.jl in Julia; Pyro, Stan in Python) can automate MCMC inference over rollout models.

---

### Part 1 — Probability of Failure

4. **Mathematical Definition**:
   $$p_{\text{fail}} = \mathbb{E}_{p(\tau)}[\mathbf{1}[\tau \in \text{failure}]] = \int p(\tau)\,\mathbf{1}[\tau \in \text{failure}]\,d\tau$$
   - This integral is the **normalizing constant** of the failure distribution — generally intractable.

5. **Estimator Properties**:
   - **Unbiased**: E[p̂_fail] = p_fail
   - **Consistent**: p̂_fail → p_fail as m → ∞
   - **Variance**: measures spread of estimates across repeated trials

---

### Part 2 — Direct Estimation (Monte Carlo)

6. **Algorithm**:
   - Draw m samples from nominal distribution p(τ).
   - Count failures; p̂_fail = n_fail / m.

7. **MLE for Bernoulli**:
   - Each rollout is a Bernoulli trial with parameter p_fail.
   - MLE: p̂_fail = n_fail / m — unbiased and consistent.
   - Variance = p_fail(1-p_fail) / m — grows as p_fail → 0.

8. **Bayesian Estimation**:
   - Prior: Beta(α, β); Posterior: Beta(α + n_fail, β + m - n_fail).
   - Advantage: yields a *distribution* over p_fail, enabling statements like:
     - "Probability that p_fail < 0.01" → CDF of posterior.
     - "95% confidence upper bound" → 95th percentile of posterior.
   - MLE gives p̂_fail = 0 when no failures observed — dangerous for safety.

9. **Limitation**:
   - For rare-event systems (p_fail ~ 10^-9), may need billions of simulations to see one failure.

---

### Part 3 — Importance Sampling (IS)

10. **Core Idea** — Multiply-by-one trick:
    p_fail = ∫ p(τ) 𝟙[τ∈F] dτ = ∫ q(τ) [p(τ)/q(τ)] 𝟙[τ∈F] dτ = E_{q(τ)}[ (p(τ)/q(τ)) 𝟙[τ∈F] ]

11. **IS Estimator**:
    p̂_fail = (1/m) Σ w_i · 𝟙[τ^(i) ∈ F],   w_i = p(τ^(i)) / q(τ^(i))
    - Samples drawn from proposal q, reweighted by importance weights w_i.
    - **Unbiased and consistent**, even though samples come from q ≠ p.
    - Requires: (a) ability to draw from q; (b) ability to compute *normalized* density of q.

12. **Importance Weights Intuition**:
    - w_i is high when the sample is more likely under nominal p than under q.
    - Trajectories unlikely under q but likely under p get upweighted.

13. **Effective Sample Size (ESS)**:
    ESS = 1 / Σ (w̃_i)^2,   w̃_i = w_i / Σ w_j
    - ESS ≤ actual failure count; low when weights are uneven.

14. **Optimal Proposal Distribution**:
    - The variance-minimizing proposal is the failure distribution itself:
      q*(τ) = p(τ) 𝟙[τ∈F] / p_fail
    - But this requires knowing p_fail — the quantity we're estimating!
    - **Practical goal**: choose q as close as possible to the failure distribution.

15. **Fitting a Proposal**:
    - Step 1: Draw failure samples via MCMC from previous lecture.
    - Step 2: Fit a tractable distribution (e.g., Gaussian) to those samples.
    - Step 3: Use the fitted distribution as proposal q for IS.
    - Key constraint: proposal's **support must overlap** with the nominal distribution's support.

---

### Part 4 — Comparison Table

| Property           | Direct Estimation             | Importance Sampling                   |
|--------------------|-------------------------------|---------------------------------------|
| Sample source      | Nominal distribution p        | Proposal distribution q               |
| Estimator formula  | (1/m) Σ 𝟙[τ∈F]               | (1/m) Σ w_i 𝟙[τ∈F]                  |
| Unbiased?          | Yes                           | Yes                                   |
| Consistent?        | Yes                           | Yes                                   |
| Rare-event eff.    | Poor                          | Good (if q chosen well)               |
| Key knob           | Number of samples m           | Choice of q + number of samples m     |

---

### Julia Code Reference (failure_prob.jl)

```julia
struct ImportanceSamplingEstimation
    p  # nominal trajectory distribution
    q  # proposal distribution
    m  # number of samples
end

function estimate_hist(alg::ImportanceSamplingEstimation, sys, γ)
    p, q, m = alg.p, alg.q, alg.m
    samples = [rollout(sys, q) for i in 1:m]
    ps = [pdf(p, τ) for τ in samples]
    qs = [pdf(q, τ) for τ in samples]
    ws = ps ./ qs                              # importance weights
    return samples, ws .* [τ[1].s < γ for τ in samples], ws
end

# Fit proposal from MCMC failure samples
τs_mcmc = sample_failures(MCMCSampling(...), sys, ψ)
𝐬 = [τ[1].s for τ in τs_mcmc]
dist_fit = fit(Normal, 𝐬)                     # e.g., fit a Gaussian
fit_proposal = SimpleGaussianTrajectoryDistribution(dist_fit.μ, dist_fit.σ)
```
