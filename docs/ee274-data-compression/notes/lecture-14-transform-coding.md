# Lecture 14 Notes: Transform Coding in real-life (image, audio, etc.)

## Topics Covered
1. **Recap: Water-filling & KLT**
   - Allocating more bits to components with higher variance.
   - KLT provides decorrelation and energy compaction.

2. **Gauss-Markov Source Example**
   - First-order AR process: $x_n = \rho x_{n-1} + \sqrt{1-\rho^2} w_n$.
   - Covariance matrix elements: diagonals are $\sigma^2$, off-diagonals are $\rho \sigma^2$.
   - KLT applied on 2x2 blocks yields decorrelated components (sum and difference).
   - Transformed variances: $(1+\rho)\sigma^2$ and $(1-\rho)\sigma^2$. Spreads out the energy.
   - Demonstrates how Transform Coding + VQ beats direct VQ when correlation ($\rho$) is high.

3. **Transform Coding Pipeline**
   - **Transform step**: Deciding the block size and transforming the signal.
   - **Independent Quantization**: Treating each transform component as an independent stream.
   - **Design Knobs**:
     - Bit rate split (how many bits allocated to each component/stream).
     - Choice of quantization (Scalar vs. Vector, and the codebook size).

4. **Discrete Cosine Transform (DCT)**
   - **Limitations of KLT**: Data-dependent (needs covariance matrix estimation), computationally intensive.
   - **DCT**: A fixed, data-independent matrix. Efficient to compute. Good approximation to KLT for highly correlated Markov sources.
   - **Properties**: Real-valued, orthogonal, lossless. Acts as a frequency analysis tool.
   - **Perceptual basis**: Natural signals typically have low energy in high frequencies. Human perception is also insensitive to high frequencies (both audio and visual).
   - High-frequency components can be thresholded or heavily quantized with minimal perceptual distortion.

5. **Audio Compressor Example**
   - Pipeline: Transform (DCT) -> Quantize (Scalar) -> (Entropy Coding in theory).
   - Knobs tuned:
     - Frequency cutoff (zeroing out higher frequencies).
     - Number of quantization levels.
   - Trade-offs: Low frequency cutoff sounds "dull" or muffled. Low quantization levels introduce static/quantization noise.
   - Rate-Distortion (RD) Pareto frontier is found by sweeping both parameters.
