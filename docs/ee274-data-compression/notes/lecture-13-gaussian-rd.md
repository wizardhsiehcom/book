# Lecture 13: Gaussian RD, Water-Filling Intuition; Transform Coding

## 1. Rate-Distortion Theory Recap
- **Mutual Information**: $R(D) = \min_{E[d(X,\hat{X})] \le D} I(X; \hat{X})$
- **Gaussian Source (MSE)**: For $X \sim \mathcal{N}(0, \sigma^2)$, the rate-distortion function under squared error is:
  - $R(D) = \frac{1}{2}\log_2(\frac{\sigma^2}{D})$ if $D < \sigma^2$
  - $R(D) = 0$ if $D \ge \sigma^2$
- More bits are allocated to components with higher variance. If allowed distortion $D$ is larger than variance $\sigma^2$, we can just transmit 0 bits (e.g., predict the mean).

## 2. Beyond Memoryless Sources
- For a sequence $X^n$: $R(X^n, D) = \min_{E[d(X^n,\hat{X}^n)] \le D} \frac{1}{n} I(X^n; \hat{X}^n)$
- For stationary stochastic processes: $R(X, D) = \lim_{n \to \infty} R(X^n, D)$

## 3. Water-Filling Intuition for Independent Gaussians
- For independent $X_1 \sim \mathcal{N}(0, \sigma_1^2)$ and $X_2 \sim \mathcal{N}(0, \sigma_2^2)$.
- Rate distortion function: $R(D) = \min_{\frac{1}{2}(D_1+D_2) \le D} \frac{1}{2} [ R_G(\sigma_1^2, D_1) + R_G(\sigma_2^2, D_2) ]$
- **Reverse Water-filling**:
  - $D_i = \min(\theta, \sigma_i^2)$
  - Average distortion $D = \frac{1}{2}(D_1 + D_2)$.
  - If a component's variance is less than $\theta$, its rate is 0. 
  - Intuitively, we allocate more bits to higher variance components because they are harder to predict.

## 4. Transform Coding
- Real-world data is correlated and non-Gaussian.
- **Pipeline**: $X \xrightarrow{T} Y \xrightarrow{\text{Encode/Decode}} \hat{Y} \xrightarrow{T^{-1}} \hat{X}$
- **Why Transform?** 
  - Decorrelation: easier to quantize independently.
  - Energy compaction: concentrates variance in fewer components, allowing smart bit allocation (using water-filling intuition).
- **Orthonormal Transforms**:
  - If $T=U$ (where $U^T U = I$), then energy is preserved: $\|Y\|^2 = \|X\|^2$.
  - Preserves Euclidean distance: $\|Y_1 - Y_2\|^2 = \|X_1 - X_2\|^2$, meaning MSE in transform domain equals MSE in original domain.
- **Karhunen-Loève Transform (KLT)**:
  - Based on Eigenvalue Decomposition of the covariance matrix $\Sigma_X = U \Lambda U^T$.
  - Transform $Y = U^T X$.
  - $Y$ components are perfectly uncorrelated, variances are the eigenvalues $\lambda_i$.
  - **Issues in Practice**: Data-dependent (need to recompute for every block) and computationally expensive.
