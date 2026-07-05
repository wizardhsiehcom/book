# Lecture 17 - Humans and Compression
## Overview
- This lecture covers the human angle in lossy compression, focusing primarily on human visual perception.
- Traditional metrics like Mean Squared Error (MSE) are insufficient because media is ultimately consumed by humans; compressors should exploit how our senses work.

## Teasers
- **Audio Example**: MP3 files use 2 channels (we have 2 ears) and 44.1 kHz sampling rate (humans hear up to ~20 kHz, Nyquist rate gives 40 kHz, plus buffer and factorability for easy downsampling).
- **Image Example**: Images with the same MSE can have drastically different visual quality (e.g., blurred vs. noisy vs. sharp).

## Human Vision Basics
- **Optics**: The eye's optics act as a low-pass filter, spreading light before it even hits the retina.
- **Retina & Sensors**: Light is converted to electrical signals (transduction).
- **Rods**: 
  - Encode light intensity (grayscale).
  - Huge dynamic range (10^9), adapt to extreme changes (Weber's Law: relative changes matter more than absolute).
  - Distributed across the retina (except the blind spot).
- **Cones**:
  - Encode color and details.
  - Concentrated in a tiny central region called the **fovea**.
- **Saccades**: Our eyes are never perfectly still; they make rapid micro-movements (saccades) to scan the scene, letting the brain construct a high-res image from the tiny foveal region.
  - **Foveated Rendering**: Exploit this in VR to assign high bitrate only where the user is looking.

## Color Theory & Compression
- **Tri-chromatic Theory**: 3 types of cones (Long, Medium, Short wavelengths) roughly correspond to Red, Green, Blue (RGB).
- **Opponent Process Theory**: Colors are perceived as antagonistic pairs (White/Black, Blue/Yellow, Red/Green).
  - Explains optical illusions like afterimages.
  - This is the neuro-biological basis for **YUV / YCbCr** color spaces.
- **Contrast Sensitivity Function (CSF)**:
  - We can't distinguish high spatial frequencies well.
  - Crucially, contrast sensitivity drops off *much faster* for color (chroma) than for intensity (luma).
- **Chroma Subsampling (e.g., 4:2:0)**: 
  - Because humans are less sensitive to high-frequency color details, we can downsample the chroma channels (Cb, Cr) by averaging them (e.g., 4:2:0 throws away 3/4 of color info).
  - Yields immediate size reduction and improves spatial correlation for JPEG.
  - Can cause color artifacts on sharp edges (e.g., colored text).

## Advanced Distortion Metrics
- MSE is a poor perceptual metric. Three modern approaches:
  1. **Low-level Human Vision Modeling**: **SSIM** (Structural Similarity Index) and MS-SSIM. SSIM combines Luminance (mean), Contrast (variance), and Structure (covariance).
  2. **Deep Learning Models**: **LPIPS** uses deep neural network embeddings as a feature space to define a perceptual distance metric.
  3. **Hybrid**: **VMAF** (used by Netflix) extracts hand-crafted features and combines them using an ML model trained on human subjective data.

## Rate-Distortion-Perception (RDP) Tradeoff
- A modern framework that adds a perception term (often measuring distribution divergence) to the standard R-D tradeoff.
- **Generative Compression**: E.g., for grass texture, a generated image that statistically looks like grass is preferred over a blurred version, even if the generated one has worse MSE.
- Loss functions in modern learned compression often combine a distortion metric (like MAE) with a perceptual metric (like LPIPS or a GAN discriminator).
