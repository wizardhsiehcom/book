# Lecture 18: Video Compression

## Guest Speaker
Kadar (Apple, formerly WaveOne and Stanford)

## Overview
This lecture explores the transition from image compression to video compression, addressing the massive data footprint of uncompressed video and the techniques used to reduce it.

## Key Concepts
- **Video Basics**: A video is a sequence of images (frames). Key properties include Resolution (e.g., 720p, 1080p, 4K), Frames Per Second (FPS, e.g., 30, 60), and Color Scheme (like YUV 4:2:0).
- **Raw Data Rate**: Uncompressed video requires enormous bitrates (e.g., 332 Mbps for a 720p 30fps video), making compression absolutely necessary for streaming and storage.
- **Common Codecs**: H.264 (AVC), H.265 (HEVC), VP9, AV1, and the upcoming H.266. Many modern chips (like Apple's M-series) include dedicated hardware media engines for real-time encoding and decoding.

## Frame Types in Video Compression
1. **I-frames (Intra-frames)**: 
   - Compressed independently, similar to standard image compression (e.g., JPEG).
   - High quality but low compression ratio.
   - Crucial for random access (seeking in a video) and video editing software (where purely I-frame formats like ProRes are used).
2. **P-frames (Predictive frames)**:
   - Uses the previous frame(s) to predict the current frame (extrapolation).
   - **Motion Compensation**: Divides the frame into blocks and searches for matching blocks in the reference frame to compute **Motion Vectors**.
   - **Residual Encoding**: Only the difference (residual) between the predicted frame and the actual frame is encoded. Since the residual is usually sparse (mostly zeros), it compresses very efficiently.
3. **B-frames (Bi-directional predictive frames)**:
   - Uses both past and future frames to predict the current frame via interpolation.
   - Interpolation generally yields better predictions than extrapolation, resulting in even smaller residuals and better compression.
   - **Trade-off**: Requires decoding future frames first, which introduces latency.

## Application Trade-offs
- **Low Latency (Video Conferencing)**: Platforms like Zoom or FaceTime cannot afford the delay of B-frames, so they predominantly use I and P-frames.
- **High Compression (Video on Demand)**: Services like YouTube and Netflix encode entire videos ahead of time, heavily utilizing B-frames for maximum compression efficiency.

## Machine Learning in Video Compression
- Traditional block-matching algorithms can lead to "blocky artifacts" at low bitrates.
- ML-based codecs can learn smoother, non-block-aligned motion representations and reduce visual artifacts.
- ML codecs can directly optimize for complex perceptual metrics (like MS-SSIM) rather than simple mathematical metrics (like PSNR or MSE).
- Current challenge: Ensuring real-time performance on edge devices.

## Course Wrap-up (Sham)
- **Lossless Compression**: Entropy, prefix codes (Huffman), LZ77/LZ78, Arithmetic coding (CABAC). Models + compressors.
- **Lossy Compression**: Quantization, Transforms (DCT, Eigen-decomposition), JPEG.
- **Future/Advanced Topics**: Distributed compression, Succinct Data Structures (random access on compressed data), compression of/by Neural Networks (quantization/sparsification of weights), AR/VR compression, and Genomics.
