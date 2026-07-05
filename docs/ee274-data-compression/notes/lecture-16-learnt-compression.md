# Lecture 16: Learnt Image Compression

## Motivation
- **Limits of Traditional Codecs (JPEG, BPG, VVC):**
  - Rely on linear transforms (e.g., DCT, DWT) which may not optimally decorrelate natural signals compared to non-linear transforms.
  - Depend heavily on hand-tuned parameters and heuristics (e.g., specific quantization matrices, fixed block sizes).
- **ML-based compression advantages:**
  - Employs non-linear transforms using deep neural networks.
  - End-to-end learning to optimize rate and distortion jointly without manual tuning.
  - Can drastically outperform traditional codecs (like JPEG and BPG) in both MS-SSIM and PSNR at low bit rates.

## ML Pipeline & Autoencoders
- **Core Components of ML:** Data, non-linear parametric model ($f(x; \theta)$), and a loss function to minimize.
- **Optimization:** Training happens via gradient descent by taking the derivative of the loss function with respect to the model parameters ($\theta$).
- **Autoencoder Architecture:**
  - **Encoder (Analysis Transform):** Maps high-dimensional input $X$ (image) to a lower-dimensional bottleneck / latent variable $Z$.
  - **Decoder (Synthesis Transform):** Maps the latent variable $Z$ back to a reconstructed image $\hat{X}$.

## Learnt Image Compression Architecture
- **Pipeline:** $X \rightarrow \text{Encoder} \rightarrow Z \rightarrow \text{Quantizer} \rightarrow \hat{Z} \rightarrow \text{Entropy Coder} \rightarrow \text{Bitstream} \rightarrow \text{Entropy Decoder} \rightarrow \hat{Z} \rightarrow \text{Decoder} \rightarrow \hat{X}$
- **Loss Function:** 
  - Rate-Distortion optimization: $L = R + \lambda \cdot D$
  - Distortion ($D$): Can be any differentiable metric (L1, L2/MSE, MS-SSIM, etc.).
  - Rate ($R$): Approximated by the expected bit length of the compressed stream, $\approx \log(1 / P(\hat{Z}))$.

## Dealing with Non-Differentiability
To enable backpropagation and end-to-end training, the pipeline must be fully differentiable. However, quantization and discrete probability models pose issues.
- **Workaround 1: Quantization**
  - **Issue:** Rounding to nearest integer is discrete and its derivative is zero almost everywhere.
  - **Solution:** 
    - Forward pass (during training): Add uniform noise $\mathcal{U}(-0.5, 0.5)$ instead of rounding.
    - Backward pass (Straight-through estimator): Treat the quantization layer as an identity function.
- **Workaround 2: Discrete Probability Model for Rate**
  - **Issue:** Estimating gradient of a discrete probability table $P(\hat{Z})$ is impossible.
  - **Solution:** Parameterize the model using a continuous density function (e.g., standard normal $\mathcal{N}(0, 1)$). Approximate the discrete probability mass as the difference of the Cumulative Distribution Function (CDF): 
    $P(\hat{Z}) \approx \text{CDF}(\hat{Z} + 0.5) - \text{CDF}(\hat{Z} - 0.5)$
  - This makes the probability estimate differentiable (derivative is the PDF).
  - The network then automatically learns to produce latent variables $\hat{Z}$ that roughly match this assumed prior distribution.

## Rate-Distortion Trade-off
- The hyperparameter $\lambda$ dictates the trade-off.
- **High $\lambda$:** Puts more weight on minimizing distortion. Less lossy, but higher bit-rate.
- **Low $\lambda$:** Puts more weight on minimizing rate. More lossy (higher distortion), but lower bit-rate.
- Networks are typically trained for a specific $\lambda$. Changing the rate-distortion trade-off requires a different $\lambda$ and re-training (or specific architectural modifications).

## Advantages and Challenges
- **Advantages:**
  - **Domain Adaptability:** Can be trained on specific domains (e.g., cartoons, games, medical images) to achieve custom, highly optimized codecs.
  - **Flexible Distortion Metric:** Not restricted to MSE. Can directly optimize for perceptual metrics like MS-SSIM.
  - **Performance:** State-of-the-art results, often beating advanced codecs like VVC in perceptual quality.
- **Challenges:**
  - **Speed / Computational Complexity:** Neural networks require vastly more compute for encoding and decoding compared to traditional methods. (Although AI hardware accelerators are helping mitigate this).
  - **Determinism / Reproducibility:** Floating-point operations can differ slightly across different GPUs/CPUs, which can cause catastrophic failures in entropy decoding if probabilities mismatch even slightly.
