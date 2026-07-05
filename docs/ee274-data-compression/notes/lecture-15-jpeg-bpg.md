# EE274 Lecture 15 Reading Notes: Image Compression (JPEG, BPG)

## Overview
This lecture transitions from basic concepts to practical lossy image compressors, primarily focusing on JPEG and introducing BPG. It highlights the discrepancy between Mean Square Error (MSE) and human perception, and explains the complete JPEG pipeline.

## Motivation & Basics
- **Uncompressed Images:** 764x512 RGB takes ~1.1MB. JPEG can compress it 40x (~27KB) with barely noticeable differences.
- **Extreme Compression:** High compression in JPEG leads to blocky artifacts. Modern compressors (BPG, ML-based) perform significantly better at high compression rates.
- **MSE vs. Human Perception:** MSE is a flawed metric for images because humans perceive structural and color distortions differently. Modern compression integrates heuristics tuned to human vision.

## Basic Compression Ideas
1. **Downsampling:** Reduce height/width (e.g., 4x compression). Decoder upsamples (interpolation).
2. **Color Quantization:** Reduce color palette (e.g., 24-bit to 256 colors).
3. **Exploiting Spatial Correlation:**
   - E.g., Color Cell Compression (1984): 4x4 block represented by 2 colors. Uses 2 bits/pixel.
   - Neighboring pixels are highly correlated; natural images change smoothly.

## 2D DCT (Discrete Cosine Transform)
- Generalizes 1D DCT for 2D image blocks.
- **Separable Property:** 2D DCT can be computed by applying 1D DCT on rows, then 1D DCT on columns. Reduces complexity from $N^2 \times N^2$ to $2 \times N^2$.
- **Basis Vectors:**
  - Top-Left: DC component (average block value).
  - Rightward: Increasing horizontal frequency.
  - Downward: Increasing vertical frequency.
- DCT produces a highly sparse representation for natural images.

## JPEG Compression Pipeline
1. **Color Transform & Chroma Subsampling:**
   - Convert RGB to YCbCr (Luma Y, Chroma Cb/Cr).
   - Human vision is less sensitive to color than luminance.
   - Downsample Chroma channels (e.g., 4:2:0) to save bits and improve correlation.
2. **Block Splitting & Centering:**
   - Divide image into 8x8 blocks.
   - Subtract 128 (for 8-bit pixels) to zero-center the values.
3. **2D DCT:**
   - Apply on each 8x8 block.
4. **Quantization:**
   - Divide DCT coefficients by a quantization table and take integers.
   - High frequencies are divided by larger numbers (strongly quantized/zeroed).
   - Serves as the rate controller.
5. **Lossless Encoding:**
   - **Zigzag Scan:** Read 2D block into 1D array to group zeros together.
   - **Run-Length Encoding (RLE):** Group continuous zeros.
   - **Modified Huffman:** Encodes a tuple (run of zeros, bit length, actual value).
   - DC coefficients are encoded predictively across blocks; AC coefficients are independent.

## BPG Improvements
- **Variable Block Sizes:** Allows blocks larger than 8x8. Uses large blocks for smooth areas and small blocks for details.
- **Predictive Coding:** Blocks are not independent; uses neighboring blocks to predict current block values.
