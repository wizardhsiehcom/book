# Lecture 03: Property Specification 1 - Reading Notes

## 1. System Modeling Recap
*   **Bayesian Parameter Learning**: Maintains a distribution over possible parameters instead of picking one (unlike Maximum Likelihood Estimation).
    *   Uses Bayes' rule: $P(\theta|D) \propto P(D|\theta)P(\theta)$.
    *   **Probabilistic Programming**: When analytic computation is hard, we can draw samples from the posterior distribution (e.g., using Turing.jl in Julia with MCMC samplers like NUTS).
    *   **Conjugate Priors**: If the posterior distribution is in the same probability distribution family as the prior probability distribution, the prior and posterior are then called conjugate distributions. Example: Beta distribution is a conjugate prior for the Binomial likelihood.
*   **Generalization & Overfitting**: Use validation sets or k-fold cross-validation to prevent models from memorizing the data.
*   **Model Validation**: Check if the model matches the data.
    *   **Visual Diagnostics**: Compare PDFs, CDFs, QQ (Quantile-Quantile) plots, Calibration plots.
    *   **Summary Metrics**: KL Divergence (for PDF), KS Statistic (for CDF), Maximum Calibration Error, Expected Calibration Error.
    *   **Multiple Features**: Considering interaction between features is crucial, as marginals might match perfectly while the joint distribution is off. Can use multi-dimensional KL divergence.
    *   **Turing Test style validation**: Showing experts rollouts from the real data vs model and seeing if they can distinguish them.

## 2. Property Specification
*   **Metrics vs. Specifications**:
    *   **Metric**: Maps system behavior to a real number (e.g., miss distance).
    *   **Specification**: Maps behavior to a Boolean value (true/false) (e.g., miss distance > 50m).
    *   They can be derived from each other.
*   **Risk Metrics**:
    *   Often, we want metrics where higher values mean worse outcomes (e.g., loss of separation).
    *   **Value at Risk (VaR)** with parameter $\alpha$: The $\alpha$-quantile of the risk metric. The risk is guaranteed not to exceed this value with probability $\alpha$.
    *   **Conditional Value at Risk (CVaR)** with parameter $\alpha$: The expected value of the risk metric given that it exceeds the VaR (the mean of the worst-case outcomes).
*   **Composite Metrics**:
    *   Handling trade-offs (e.g., low alert rate vs. low collision rate).
    *   **Pareto Optimality**: A design is Pareto optimal if no metric can be improved without degrading another. The set of such designs is the Pareto Frontier.
    *   **Weighted Sum**: Assign weights to different metrics and sum them up.
    *   **Goal Distance Metric**: Define a "Utopia point" (ideal but unachievable) and pick the design on the Pareto frontier with the minimum distance to this point.
    *   **Weighted Exponential Sum**: A combination of the above.

## 3. Julia Notebook Insights (`property_specification.jl`)
*   Uses `Distributions.jl` and `LazySets.jl`.
*   Interactive visualization of Truncated distributions to demonstrate the area under the curve for CVaR calculation above the VaR threshold.
*   Preference elicitation using half-spaces to visually narrow down the feasible weight regions.
