# Lecture 8 Reading Notes: Beyond IID Distributions: Conditional Entropy

## Overview
- Recap of Huffman, Arithmetic Coding, ANS.
- Compressing real data (Sherlock Holmes novel) shows that gzip and bzip2 perform better than the empirical entropy limit of IID data.
- Real-world data (text, images, videos) is highly correlated and non-IID.

## Stochastic and Stationary Processes
- **Stochastic Process**: A sequence of random variables with arbitrary dependence.
- **Stationary Process**: Time-invariant distribution. Statistical properties (mean, variance, entropy) do not change with time shifts.
- **$k$-th order Markov source**: A stationary source where the next symbol only depends on the previous $k$ symbols.

## Conditional Entropy
- Defined as $H(U|V) = \mathbb{E}[\log \frac{1}{P(U|V)}]$.
- **Properties**:
  - Conditioning reduces entropy on average: $H(U|V) \le H(U)$.
  - Chain rule: $H(U,V) = H(U) + H(V|U) = H(V) + H(U|V)$.

## Entropy Rate
- Measures the fundamental limit of compression for stationary processes.
- Two equivalent definitions for stationary sources:
  1. $H(\mathcal{U}) = \lim_{n \to \infty} H(U_{n+1} | U_1, \dots, U_n)$
  2. $H(\mathcal{U}) = \lim_{n \to \infty} \frac{1}{n} H(U_1, \dots, U_n)$
- **Shannon-McMillan-Breiman Theorem (AEP)**: $-\frac{1}{n} \log_2 P(U_1, \dots, U_n) \to H(\mathcal{U})$.
- **English Text Entropy Rate**: Explored through historical experiments (Shannon's human prediction) showing entropy rate decreases as more context is used.

## Achieving Entropy Rate
- Arithmetic coding can be adapted to achieve the entropy rate for Markov sources by splitting intervals according to conditional probabilities $P(U_i | U_{i-1})$ instead of marginal probabilities $P(U_i)$.
