# Lecture 6 - Arithmetic Coding

## Motivation
- **Symbol Codes limitation**: Huffman coding (and other symbol codes) assigns an integer number of bits per symbol, resulting in up to 1 bit of overhead per symbol compared to the optimal entropy $H(X)$. This is bad when $H(X)$ is small.
- **Block Coding limitation**: By encoding blocks of size $B$, the overhead decreases to $1/B$ per symbol. However, the codebook size grows exponentially ($|X|^B$), leading to huge memory requirements and latency.

## Arithmetic Coding
Arithmetic coding is a practical algorithm (from the 1970s) that achieves the entropy limit without storing a massive codebook.

### Key Properties
- **Entire data as a single block**: Encodes the entire sequence $x_1^n$ at once ($B=n$).
- **On-the-fly computation**: Codewords are computed on the fly; no exponentially large codebook is needed.
- **Compression efficiency**: The overhead for the *entire* sequence is just ~2 bits. 
  $$ H(X) \le \frac{1}{n} E[l(X_1^n)] \le H(X) + \frac{2}{n} $$

### Intuition
1. **Shorter intervals take more bits to describe**: A tiny sub-interval requires a lot of precision (long binary representation) to specify a point inside it.
2. **Probability $\propto$ Interval Length**: More probable sequences map to bigger intervals.
3. **Conclusion**: More probable sequences map to bigger intervals, which can be described with fewer bits.

### The Algorithm
**Step 1: Map sequence to a range $[L, H)$**
- Start with $[L, H) = [0, 1)$.
- For each symbol in the sequence, the current interval is recursively subdivided according to the cumulative probabilities of the symbols.
- At any step, the length of the new interval $(H - L)$ is exactly the product of the probabilities of all symbols seen so far: $H - L = p(x_1^n)$.

**Step 2: Communicate the range**
- Find a point within the final range $[L, H)$. Usually, the midpoint $Z = \frac{L+H}{2}$ is chosen.
- Truncate the binary representation of $Z$ to $k$ bits to get $\hat{Z}$, such that any extension of $\hat{Z}$ still falls within $[L, H)$.
- Number of bits needed: $k \le \lceil \log_2 \frac{1}{H-L} \rceil + 1 \le \log_2 \frac{1}{p(x_1^n)} + 2$.

**Decoding**
- The decoder receives $Z$ (or its binary stream) and knows the probability distribution.
- It recreates the bins for the first symbol and checks which bin $Z$ falls into.
- After decoding a symbol, it further subdivides that bin and repeats the process.
- **Stopping criterion**: Requires knowing the total length $n$ in advance or having a special `EOF` token, because the trailing zeroes could theoretically decode to an infinite sequence.

### Practical Issues
1. **Finite Precision**: As the sequence grows, the interval $[L, H)$ shrinks exponentially fast and will underflow standard floating-point registers (e.g., 64-bit float) very quickly.
2. **Rescaling / Renormalization**: To prevent underflow, whenever $L$ and $H$ share the same leading bits (e.g., both start with `011`), those bits are immediately flushed to the output, and the interval is rescaled (e.g., multiplied by 2). This turns Arithmetic Coding into a streaming algorithm.
3. **Mid-range rescaling**: Sometimes $L=0.499...$ and $H=0.501...$, so they don't share leading bits but are very close. This requires special mid-range expansion to avoid underflow.
4. **Computational Speed**: Because of the required multiplications and divisions, arithmetic coding is slower than Huffman coding. "Range coding" works with bytes instead of bits to trade off a tiny amount of compression performance for a massive speed boost.
5. **Separation of Model and Entropy Coder**: Arithmetic coding is essentially optimal for any given distribution. This allows us to cleanly separate data modeling (assigning probabilities, which can even change dynamically per symbol) from the actual entropy coding.

### Conclusion
Arithmetic Coding provides near-optimal compression without exponential memory overhead, but is bottlenecked by computational speed. Next-generation compressors (like ANS) will aim to bridge this speed gap.
