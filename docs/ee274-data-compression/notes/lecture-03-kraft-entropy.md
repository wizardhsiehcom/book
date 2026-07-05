# Lecture 3 Reading Notes: Kraft Inequality, Entropy, Introduction to SCL

## Topics Covered
1. **Stanford Compression Library (SCL)**: Introduced as a tool for students to easily implement and experiment with compression algorithms in Python. Features include bit array utilities and basic prefix-free decoders.
2. **Kraft Inequality**: 
   - Defines a fundamental condition for prefix-free codes: $\sum_{i=1}^k 2^{-l_i} \leq 1$.
   - **Forward**: Any prefix code satisfies this inequality. Proof uses the maximum depth $l_{max}$ of the binary tree and counts the max possible leaves.
   - **Converse**: If a set of lengths satisfies this inequality, a prefix code with these lengths exists.
3. **Entropy ($H(X)$)**: 
   - Defined as $H(X) = \sum p_i \log_2(1/p_i)$.
   - Measure of uncertainty/information.
   - Properties: Non-negative, max is $\log_2(k)$ (uniform distribution), joint entropy for independent variables is the sum of individual entropies.
4. **KL-Divergence**: 
   - A distance measure between two distributions $p$ and $q$: $D_{KL}(p||q) \geq 0$, equality iff $p=q$.
5. **Main Result of Lossless Compression**:
   - **Lower Bound**: Expected length of any uniquely decodable code is $\geq H(X)$.
   - **Thumb Rule**: Optimal lengths $l_i \approx \log_2(1/p_i)$ derived by treating $2^{-l_i}$ as a probability distribution $q_i$ and using KL-divergence to show $\sum p_i l_i \geq H(X)$.
   - **Achievability**: Shannon code achieves within 1 bit of entropy. By block coding (size $n$), we can achieve within $1/n$ bit, thus arbitrarily close to entropy.

## Key Mathematical Takeaways
- The optimization problem: minimize $\sum p_i l_i$ subject to $\sum 2^{-l_i} \leq 1$.
- Mismatched coding penalty is exactly the KL-divergence $D_{KL}(P||Q)$.
