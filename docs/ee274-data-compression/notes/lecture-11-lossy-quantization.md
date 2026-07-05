# Reading Notes: Lecture 11 - Lossy Compression Basics; Quantization

## Core Concepts
- **Shift to Lossy**: Previous lectures focused on lossless compression bounded by entropy for discrete sources. Real-world continuous sources (images, audio, temperature) contain infinite information and cannot be losslessly represented digitally. We must approximate them via **quantization**, which introduces **distortion**.
- **Rate-Distortion Tradeoff**: 
  - **Distortion (D)**: The loss of information. Common metrics: Mean Squared Error (MSE, $D=E[(X-\hat{X})^2]$), Mean Absolute Error (MAE). Choosing the right metric depends heavily on human perception/application.
  - **Rate (R)**: Bits per sample used. Higher rate = lower distortion. Lower rate = higher compression but more distortion. We aim for Pareto optimality (min rate for given distortion, or min distortion for given rate).

## Quantization Basics
- **Definition**: Mapping a continuous source to a discrete set of values.
- **Terminology**: The quantized values are **symbols** or **codewords**. The set of available values is the **codebook** or **dictionary**. For codebook size $N$, the rate is $R = \log_2(N)$ bits/symbol.
- **Example (Temperature)**: Rounding floats to ints introduces loss but reduces bit requirements. The precision needed depends on the application.

## Scalar Quantization (SQ)
- Quantizes each symbol independently.
- Defined by **decision thresholds/regions** (which inputs map to which bin) and **quantized values** (the representative value of that bin).
- **Gaussian MMSE Example**: For $X \sim \mathcal{N}(0,1)$ at 1 bit/symbol (codebook size 2), the optimal boundaries for MSE are $X>0$ and $X<0$. The optimal reconstructed value for the positive region is the conditional expectation $E[X | X > 0] = \sqrt{2/\pi}$.

## Vector Quantization (VQ)
- Groups symbols into blocks (vectors) of size $k$ and quantizes them jointly. Rate is $R = \log_2(N) / k$.
- **Advantages over SQ**:
  - Explores dependence/correlation between vector components.
  - Allows more general decision regions. Even for a simple uniform IID 2D source, a hexagonal lattice (Voronoi region) yields ~3.8% lower MSE compared to the square grids of independent SQ.
- Ziv's theoretical paper showed SQ doesn't perform more than ~0.754 bits/sample worse than VQ, but VQ is still generally superior.

## Vector Quantization Algorithm
- Computing optimal regions analytically is hard. We use iterative approaches.
- **K-Means / Lloyd-Max / Generalized Lloyd Algorithm**: 
  1. Fix codebook centroids, assign data points to nearest centroid (Partitioning).
  2. Fix partitions, recompute optimal centroids (e.g. mean for MSE) (Codebook update).
  3. Iterate until convergence.
- This creates empirical rate-distortion curves that asymptotically approach the theoretical bounds (e.g. $D(R) = 2^{-2R}$ for Gaussian) which will be discussed in future lectures.
