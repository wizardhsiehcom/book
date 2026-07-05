# Lecture 10 Reading Notes — Failure Distribution

**Source**: Stanford AA228V lecture video "Failure Distribution" [7bZcHXJIaUo]  
**Notebooks**: `failure_dist.jl`, `smc.jl` (partial reference to `failure_prob.jl`)  
**Date processed**: 2026-07-04

---

## 1. Big Picture

- Previous lectures: **falsification** — find *one* (most likely) failure.
- This lecture: sample from the **full failure distribution** — know *what kinds* of failures exist and how likely each is.
- Sampling from the failure distribution gives a richer picture than a single failure trajectory.

---

## 2. Failure Distribution — Math

### Trajectory distribution
$p(\tau)$ = nominal distribution over trajectories.

### Failure distribution (conditional)
$$
p(\tau \mid \tau \notin \psi) = \frac{\mathbf{1}[\tau \notin \psi]\, p(\tau)}{\int \mathbf{1}[\tau \notin \psi]\, p(\tau)\, d\tau}
$$

- **Numerator**: gives the *shape* of the distribution — zero for non-failures, $p(\tau)$ for failures.
- **Denominator**: normalizing constant = area under numerator = probability of failure $p_{\text{fail}}$.
- **Problem**: the denominator is typically intractable (computing it ≡ estimating failure probability, covered in the next lecture).

### Unnormalized failure density
$$
\bar{p}(\tau) = \mathbf{1}[\tau \notin \psi]\, p(\tau)
$$
We can *evaluate* this for any $\tau$ (just check failure + evaluate nominal likelihood).  
We **cannot** easily normalize it. But unnormalized densities are enough to sample from!

---

## 3. Rejection Sampling

### Dartboard analogy
1. Draw target density shape on a dartboard.
2. Throw darts uniformly (sample $\tau \sim q(\tau)$, sample height $h = r \cdot c \cdot q(\tau)$, $r \sim U[0,1]$).
3. Reject darts that land *above* the target density.
4. Remaining darts are distributed according to the target density.

### Algorithm
```
for i = 1..N:
    τ  ~ q(τ)           # proposal distribution
    r  ~ U[0, 1]
    if r < p̄(τ) / (c·q(τ)):
        accept τ         # add to samples
    else:
        reject
```

**Requirement**: $c \cdot q(\tau) \geq \bar{p}(\tau)$ for all $\tau$ (dartboard must be tall enough).

### Applying to failure distribution
- Target: $\bar{p}(\tau) = \mathbf{1}[\tau \notin \psi]\, p(\tau)$
- Simplest proposal: $q(\tau) = p(\tau)$ (nominal), $c = 1$
- Acceptance condition simplifies to: accept iff $\tau$ is a failure.
- **Insight**: this is just "sample from nominal, keep failures" — a direct Monte Carlo baseline.
- **Problem**: rare failures ⟹ most samples rejected ⟹ very inefficient.

### Improvement: hand-designed proposal
- Move proposal mean toward failure region.
- Reduce $c$ as much as possible (without violating the coverage requirement).
- **Challenge**: hard to design in high dimensions; may need a very large $c$ (see pendulum example §6.1 in textbook).

### Drawbacks of rejection sampling
1. Selecting an appropriate $q(\tau)$ is not easy.
2. Selecting an appropriate $c$ is not easy.
3. Can be extremely wasteful when failures are rare.

---

## 4. Markov Chain Monte Carlo (MCMC)

### Core idea
Instead of independent samples, maintain a **Markov chain** $\tau_1, \tau_2, \ldots$ where each sample depends on the previous one.  
In the limit of infinite samples, the chain's empirical distribution converges to the target.

### Metropolis-Hastings Algorithm
```
τ  ← τ_init
for k = 1..k_max:
    τ′ ~ g(· | τ)           # propose from kernel (e.g., Gaussian centered at τ)
    α  = min(1, p̄(τ′)·g(τ|τ′) / (p̄(τ)·g(τ′|τ)))
    if rand() < α:
        τ ← τ′              # accept
    # else: τ stays
    record τ
```

### Symmetric kernel simplification
If $g(\tau \mid \tau') = g(\tau' \mid \tau)$ (e.g., Gaussian kernel), the acceptance probability simplifies:
$$
\alpha = \min\!\left(1,\; \frac{\bar{p}(\tau')}{\bar{p}(\tau)}\right)
$$

### Intuition for acceptance rule
- If $\bar{p}(\tau') > \bar{p}(\tau)$: new sample is *more likely* → always accept.
- If $\bar{p}(\tau') < \bar{p}(\tau)$: new sample is *less likely* → accept with probability $\bar{p}(\tau')/\bar{p}(\tau)$.

### Practical tricks
| Trick | Purpose |
|-------|---------|
| **Burn-in** | Discard first $m_{\text{burnin}}$ samples (chain may start in a bad region) |
| **Thinning** | Keep every $k$-th sample to reduce autocorrelation |
| **Smoothing** | Handle multiple failure modes (see below) |

### Julia implementation (from `failure_dist.jl`)
```julia
struct MCMCSampling
    p̄        # target (unnormalized) density
    g        # kernel: τ′ = rollout(sys, g(τ))
    τ        # initial trajectory
    k_max    # max iterations
    m_burnin # burn-in samples to discard
    m_skip   # thinning interval
end

function sample_failures(alg::MCMCSampling, sys, ψ)
    p̄, g, τ = alg.p̄, alg.g, alg.τ
    τs = [τ]
    for k in 1:alg.k_max
        τ′ = rollout(sys, g(τ))
        if rand() < (p̄(τ′) * pdf(g(τ′), τ)) / (p̄(τ) * pdf(g(τ), τ′))
            τ = τ′
        end
        push!(τs, τ)
    end
    return τs[alg.m_burnin:alg.m_skip:end]
end
```

---

## 5. Multiple Failure Modes Problem

When failure regions are **disconnected** (e.g., too high OR too low), a local Gaussian kernel cannot easily jump between modes.  
In the limit of infinite samples it would eventually, but practically it gets stuck.

---

## 6. Smoothing

### Motivation
Replace the hard indicator $\mathbf{1}[\tau \notin \psi]$ with a **smooth surrogate** so that near-failure trajectories also get non-zero density. This guides the Markov chain toward failure regions and allows it to traverse the non-failure space between multiple failure modes.

### Distance function
$$
\Delta(\tau) = \max(\rho(\tau),\, 0)
$$
where $\rho(\tau)$ is the robustness value.  
- $\Delta = 0$ if $\tau$ is a failure; $\Delta > 0$ otherwise.

### Smooth unnormalized density
$$
\bar{p}_\epsilon(\tau) = \mathcal{N}(\Delta(\tau);\, 0,\, \epsilon^2)\cdot p(\tau)
$$

**Interpretation of $\epsilon$**:
- $\epsilon \to 0$: recovers the original hard-cut indicator function.
- $\epsilon \to \infty$: approaches $p(\tau)$ (nominal trajectory distribution — no bias toward failures).
- Intermediate $\epsilon$: smoothly bridges multiple failure modes.

### Two-step process
1. Run MCMC with $\bar{p}_\epsilon$ (smooth density).
2. Reject non-failure samples from the chain → remaining samples are from the true failure distribution.

### Julia snippet
```julia
p̄s = τ -> pdf(Normal(0, ϵ), max(robustness([step.s for step in τ], ψ.formula), 0)) * pdf(p, τ)
```

---

## 7. Scaling to High Dimensions (Pendulum)

- 1D Gaussian is illustrative; methods scale to 50–100+ dimensional systems like the pendulum.
- The same algorithms apply, but proposal design and $\epsilon$ tuning become more critical.
- Textbook §6.1 shows where rejection sampling breaks down for the pendulum.

---

## 8. Key Takeaways

| Method | Proposal | Acceptance | Notes |
|--------|----------|-----------|-------|
| Rejection Sampling (nominal) | $q = p$ | iff failure | Simple; very wasteful for rare failures |
| Rejection Sampling (hand-designed) | $q$ near failure | probabilistic | Better efficiency; hard to design |
| MCMC (Metropolis-Hastings) | Markov kernel $g$ | MH ratio | Converges to target; needs burn-in/thinning |
| MCMC + Smoothing | Smooth $\bar{p}_\epsilon$ + rejection | MH ratio | Handles multiple failure modes |

---

## 9. References

- Textbook §5 (Failure Distribution), §6.1 (Rejection Sampling for Pendulum)
- Notebooks: `failure_dist.jl`, `smc.jl`
- Classic reference for MCMC: Metropolis et al. (1953), Hastings (1970)
