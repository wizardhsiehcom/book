# Reading Notes: Lecture 9 - Context-based AC & LLM Compression

## Source Material
- Transcript: `Stanford EE274： Data Compression I 2023 I Lecture 9 - Context-based AC & LLM Compression.txt`
- Course Notes: `lossless_iid_context_based_coding.txt`

## Key Concepts

1.  **Achieving Entropy Rate for Markov Sources**:
    -   Instead of block coding (which increases complexity), we use incremental coding via conditional probabilities.
    -   Context-based Arithmetic Coding splits the interval at each step based on $P(U_i | \text{past})$.
    -   Expected bits per symbol approaches the conditional entropy $H(U_i | U_{i-1})$.

2.  **Model Building (Two-pass vs. Adaptive)**:
    -   **Two-pass**: Scan data to build model, compress using model. Needs to store model, not for streaming.
    -   **Adaptive**: Build and update model on the fly. Encoder and decoder must stay perfectly synchronized. Update model *after* encoding/decoding a symbol. Avoid zero probabilities.

3.  **Prediction Implies Compression**:
    -   The cross-entropy loss in machine learning is exactly the number of bits used in arithmetic coding ($\log_2 \frac{1}{P}$).
    -   Good predictor = Good compressor.
    -   Also, every compressor induces a predictor ($P = 2^{-L}$).

4.  **Prediction Models**:
    -   **k-th order Adaptive Arithmetic Coding (AAC)**: Updates frequency counts of length $k+1$. Suffers from sparse count problem as $k$ increases (memory grows exponentially, counts become too sparse for accurate prediction).
    -   **Minimum Description Length (MDL)**: Tradeoff between model complexity and compressed data size.
    -   **Advanced Models**: PPM, CTW, NNCP (neural net based), CMIX (ensemble of multiple contexts).

5.  **LLM-based Compression**:
    -   Disregards model size constraints assuming sender and receiver both possess the huge model.
    -   LLMs (e.g., LLaMA, rwkv) use long contexts to achieve state-of-the-art compression (e.g., beating Shannon bound, CMIX).
    -   **Pitfalls**: 
        -   Model-data mismatch (e.g., Pali text compresses poorly with LLM compared to bzip2).
        -   Overfitting (e.g., Sherlock Holmes novel compresses to 0.2 bits/byte because it's in the training data). Interestingly, in compression, overfitting is beneficial if the model is shared.
    -   Reference: DeepMind's "Language Modeling Is Compression".
