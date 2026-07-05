# Lecture 4: Huffman Codes

## Overview
This lecture introduces Huffman codes, an optimal prefix-free coding scheme that achieves the shortest possible expected code length for a given probability distribution. It covers the necessary conditions for optimal prefix codes, the greedy construction algorithm by David Huffman, and practical considerations for efficient decoding.

## Key Concepts

### 1. Motivation: Beyond Shannon Codes
- Shannon codes (assigning length $\lceil \log(1/p) \rceil$) are not always optimal.
- Example: Bernoulli(0.001) distribution (P(0)=0.999, P(1)=0.001) yields Shannon code lengths 1 and 10, resulting in an expected length of ~1.009 bits/symbol. However, the entropy is ~0.011 bits. This shows significant overhead.
- Block coding can help approach entropy, but it becomes computationally unwieldy for large block sizes. We need an optimal code for single symbols (or blocks).

### 2. Necessary Conditions for Optimal Prefix Codes
Any optimal prefix-free code for a distribution $P = \{p_1, p_2, \dots, p_k\}$ must satisfy:
1. **Inverse Probability-Length Ordering:** $p_i > p_j \implies l_i \le l_j$. Symbols with higher probabilities must not have longer code words.
2. **Sibling Property:** The two longest codewords must have the exact same length. If not, the longest could be shortened without violating the prefix-free property.

### 3. Huffman Code Construction (Greedy Algorithm)
Invented by David Huffman as a term paper project for Robert Fano's class (who didn't reveal it was an open problem).
1. Create singleton nodes for each symbol with its probability.
2. While more than 1 node remains:
   - Pick the two nodes with the smallest probabilities.
   - Merge them into a new node, with probability equal to the sum of the two children.
   - Add the new node back to the list.
3. The final remaining node is the root of the Huffman tree.
- **Tie-breaking:** Ties can be broken arbitrarily. Therefore, multiple optimal Huffman trees can exist for the same distribution, all yielding the same expected code length.

### 4. Practical Implementations and Fast Decoding
- **Construction Optimization:** The process of repeatedly finding the two minimum probabilities is best implemented using a Priority Queue (Heap).
- **Tree-based Decoding Issues:** Traversing a tree bit-by-bit (if 0 go left, if 1 go right) creates many branching instructions. In modern pipelined CPU architectures, branches are slow due to branch misprediction penalties.
- **Table-based (Fast) Decoding:**
  - Instead of a tree, use a Look-Up Table (LUT).
  - Read a chunk of bits equal to the maximum codeword length (e.g., maximum depth of the tree).
  - Use these bits as an index into a state table to decode the symbol instantly.
  - Look up the actual bit-length of the decoded symbol to advance the bit pointer.
  - **Trade-off:** The table size grows exponentially with the maximum tree depth ($2^{\text{max\_depth}}$).
- **Length-Constrained Huffman Codes:** To keep decoding tables small enough to fit in CPU caches, practical algorithms (like in DEFLATE/GZIP) restrict the maximum depth of the Huffman tree (e.g., 16 or 24 bits).

### 5. Fun Fact: Compression vs. Encryption
- If you apply Huffman coding to encrypted data, the resulting tree has uniform depth for all leaves.
- Encryption algorithms (like AES) output data that closely resembles a uniform random distribution (IID).
- **Takeaway:** You cannot compress encrypted data. Always compress *before* you encrypt.
