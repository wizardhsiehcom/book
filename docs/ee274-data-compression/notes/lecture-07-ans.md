# Lecture 7: Asymmetric Numeral Systems (ANS) - Reading Notes

## Overview
- This lecture introduces Asymmetric Numeral Systems (ANS), discovered by Jarek Duda around 2014.
- ANS provides a class of compressors that achieve compression performance similar to arithmetic coding but with much faster decompression speeds (close to Huffman coding).
- Two main variants are discussed: rANS (range ANS) and tANS (table ANS).

## Key Concepts
1. **Symmetric Numeral System (SNS)**:
   - Example using digits 0-9. State `x` is maintained.
   - `encode_step(x, s) = x * 10 + s`
   - `decode_step(x)`: symbol is `x % 10`, previous state is `x // 10`.
   - Streaming decoder operates in reverse order.
   - Optimal for uniform distribution. Uses about $\log_2(10)$ bits per symbol.

2. **Theoretical rANS**:
   - For non-uniform distributions, state should increase by a factor of $1/p(s)$.
   - Frequencies $f_s$, total frequency $M$, cumulative frequencies $C_s$.
   - `rans_base_encode_step(x, s) = (x // f_s) * M + C_s + (x % f_s)`
   - State grows exponentially.

3. **Streaming rANS**:
   - To prevent state overflow, keep the state $x$ within an interval $[L, H]$.
   - Before base encoding, call `shrink_state` which outputs lower bits of $x$ until `rans_base_encode_step` will fall within $[L, H]$.
   - During decoding, after base decoding, call `expand_state` which reads bits from the bitstream to expand the state back to $[L, H]$.
   - L and H are chosen as $L = M \cdot t$ and $H = 2Mt - 1$ to ensure uniqueness.

4. **Table ANS (tANS)**:
   - Speeds up rANS by caching the base encode/decode steps and expand/shrink step parameters into lookup tables.
   - Assumes $M$ is a power of 2 ($M = 2^r$).
   - Replaces divisions and binary searches with table lookups.
   - Tables are kept small to fit in CPU cache.

## Practical Considerations
- M is usually chosen as a power of 2 ($2^{16}$ or more).
- `shrink_state` and `expand_state` can operate on bytes (8 bits), 16 bits, or 32 bits at a time instead of single bits to improve performance.
- ANS decoding produces symbols in reverse order.
