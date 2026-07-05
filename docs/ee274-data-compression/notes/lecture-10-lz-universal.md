# Lecture 10: LZ and Universal Compression (Reading Notes)

## Universal Compression
- **Definition**: A universal compressor works on arbitrary length inputs and achieves the entropy rate $H(\mathcal{X})$ for any stationary ergodic source asymptotically, without prior knowledge of the source distribution.
- $ \lim_{n \to \infty} \frac{1}{n} E[l(X^n)] = H(\mathcal{X}) $
- This implies a universal compressor acts as a universal predictor.

## LZ77 Algorithm
- **Idea**: "History repeats itself". Replace repeated segments with pointers (match offset) and lengths (match length).
- **Parsing**: Data is separated into three streams: unmatched literals, match length, match offset. Overlapping matches are allowed (where match length > match offset), which helps compress highly repetitive sequences.
- **Unparsing (Decoding)**: Very fast. Just copy literals and past sequences. For overlapping matches, copy character by character.
- **Match Finding**: Decoupled from unparsing. Allows various strategies:
  - Hash-based match finder: uses seeds (e.g., length 4) to find candidates in a sliding window.
  - Greedy strategy: picks the first/longest match found at the current position.
  - Lazy strategy: looks ahead to see if skipping the current position yields a longer match. Generally outperforms greedy.
- **Sliding Window**: Restricts memory usage by only looking at the past $W$ bytes (e.g., tens of KBs in gzip, MBs in zstd). Larger windows improve compression at the cost of higher memory usage.

## Entropy Coding
- After parsing, the streams (literal counts, literals, match lengths, match offsets) are entropy coded.
- Integers (lengths/offsets) are usually bin-encoded (e.g., logarithmic bins) because offsets can be very large. The bin index is entropy coded, and the offset within the bin is stored with a fixed-length code.
- Different implementations use different entropy coders:
  - gzip: Huffman coding
  - zstd: Huffman for literals, tANS for lengths and offsets
  - LZMA: Context-based arithmetic coding
  - LZ4/Snappy: No entropy coding (fixed length) for speed.

## Universality Proof Sketch
- **Kac's Lemma**: For a stationary ergodic process, the expected recurrence time $E[R_n(x_0^{n-1})] = \frac{1}{p(x_0^{n-1})}$.
- Thus, the match offset is roughly $\frac{1}{p(x_0^{n-1})}$.
- Encoding this offset requires about $\log_2(1/p(x_0^{n-1}))$ bits. By the neg-log likelihood thumb rule, the expected length is $H(X^n)$, which approaches the entropy rate.

## Practical Tips on Lossless Compression
- **Ask first**: Is compression really needed? Can data be deleted or aggregated?
- **Understand the application**: Homogeneous vs heterogeneous data? Speed vs ratio? Deployment environment?
- **General Rules of Thumb**:
  - `zstd`: Fast decompression, many levels. Default choice. Avoid `gzip` unless for legacy reasons.
  - `lz4`: Extremely fast for both compression and decompression.
  - `lzma`/`xz`/`7-zip`: Slower but better compression (archival).
- **Domain Specific Compressors**: Consider when there's a big gap between general compressors and the estimated entropy, and the data is highly homogeneous and voluminous.
