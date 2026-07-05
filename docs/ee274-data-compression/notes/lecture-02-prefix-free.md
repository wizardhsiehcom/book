# Reading Notes: EE274 Lecture 2 - Prefix Free Codes

## 1. Introduction and Recap
- Discussed fixed-length codes and how encoding in blocks (e.g., pairs of symbols) improves the compression ratio.
- Fixed code length for alphabet of size 9 is 4 bits. If taking blocks of 2 (size 81), the length is 7 bits per block, which is 3.5 bits per symbol. Larger blocks get closer to log2(9).

## 2. Uniquely Decodable Codes
- A code is uniquely decodable if no two input sequences are encoded to the same output bitstream.
- Morse code is not uniquely decodable without explicit spaces.

## 3. Prefix-Free Codes
- Definition: No codeword is a prefix of another codeword.
- Also known as prefix codes or instantaneous codes.
- They are uniquely decodable and can be decoded instantaneously as bits arrive without looking ahead.
- Prefix-Free Tree: A binary tree representation where codewords are mapped to the leaves. Any node being a prefix of another means it's an ancestor in the tree. Thus, in a prefix-free code, all codewords are leaves.

## 4. Good Prefix-Free Codes
- Shorter codewords for symbols with higher probabilities: $p(s_1) \geq p(s_2) \Rightarrow l(s_1) \leq l(s_2)$.
- Thumb rule for optimal code lengths: $l(s) \approx \log_2(1 / p(s))$.
  - Uniform distribution: probability $1/k \Rightarrow$ length $\log_2 k$.
  - Dyadic distribution: probabilities are negative powers of 2 ($2^{-l_i}$), optimal lengths are exactly $l_i$.

## 5. Shannon Code Construction
- Goal: Create a prefix-free code where $l(s) = \lceil \log_2(1 / p(s)) \rceil$.
- Steps:
  1. Compute lengths $l(s) = \lceil \log_2(1 / p(s)) \rceil$.
  2. Sort symbols by increasing length.
  3. Greedily assign each symbol to an available leaf at depth $l(s)$ in the binary tree.
- Proof of Construction Correctness:
  - Uses the fact that $\sum 2^{-l_i} \leq 1$.
  - When extending nodes to a depth, the number of nodes eliminated by the prefix condition does not exceed the total available nodes at that depth, guaranteeing at least one leaf is always available.
