# Lecture 12 Notes: Mutual Information and Rate-Distortion

## Overview
This lecture bridges the concepts of lossless compression (using Entropy) to lossy compression (using Rate-Distortion theory), introducing Mutual Information as the foundational quantity for limits on lossy compression.

## Key Concepts
1. **Entropy & Conditional Entropy Recap**
   - Entropy: $H(X) = \sum p_i \log_2(1/p_i)$
   - Joint Entropy: $H(X,Y)$
   - Conditional Entropy: $H(X|Y) = \sum_{y} P(y) H(X|Y=y)$. Conditioning reduces entropy: $H(X|Y) \leq H(X)$.

2. **Mutual Information $I(X;Y)$**
   - Defined as: $I(X;Y) = H(X) + H(Y) - H(X,Y)$
   - Measures the information common between $X$ and $Y$.
   - **Properties**:
     - Symmetric: $I(X;Y) = I(Y;X)$
     - $I(X;Y) = H(X) - H(X|Y)$
     - KL Divergence relation: $I(X;Y) = D_{KL}(p(x,y) || p(x)p(y))$
     - Non-negative: $I(X;Y) \geq 0$
   - Extends naturally to continuous random variables.

3. **Lossy Compression Setup**
   - Source variables $X_1, X_2, \ldots, X_k$.
   - Encoded to $n = \log_2(N)$ bits (Rate $R = n/k$ bits/symbol).
   - Decoded to reconstruction $Y_1, Y_2, \ldots, Y_k$.
   - **Distortion $D$**: Per-symbol expected distortion $E[d(X,Y)]$.
     - Hamming distortion (discrete): $d(x,y) = \mathbf{1}(x \neq y)$
     - Mean squared error (MSE) (continuous): $d(x,y) = (x-y)^2$

4. **Rate-Distortion Theory**
   - **Rate-Distortion Function $R(D)$**: The minimum rate required to achieve an average distortion at most $D$.
   - **Shannon's Theorem**: For i.i.d source $X$, $R(D) = \min_{q(y|x): E[d(X,Y)] \leq D} I(X;Y)$.
   - $R(D)$ is convex and monotonically non-increasing.

5. **Examples**
   - **Bernoulli Source** ($X \sim \text{Bern}(p)$ where $p \leq 0.5$) with Hamming distortion:
     - $R(D) = h(p) - h(D)$ for $0 \leq D \leq p$, and $0$ for $D > p$.
   - **Gaussian Source** ($X \sim \mathcal{N}(0,1)$) with MSE distortion:
     - $R(D) = \frac{1}{2}\log_2(1/D)$ for $0 \leq D \leq 1$, and $0$ for $D > 1$.
     - *Proof intuition*: Typical sequences fall in a $k$-dimensional sphere of radius $\sqrt{k}$. We cover this with smaller reconstruction spheres of radius $\sqrt{kD}$. Volume ratio is $\approx (1/D)^{k/2}$. Number of spheres $N \approx (1/D)^{k/2}$, so $R = \log_2(N)/k \approx \frac{1}{2}\log_2(1/D)$.
