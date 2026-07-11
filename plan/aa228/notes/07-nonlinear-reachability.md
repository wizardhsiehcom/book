# Lecture 07: Reachability for Nonlinear Systems

## Linear Reachability Recap
- **Over-approximation**: Used to bound the exponentially growing number of vertices in polytope propagation. LazySets.jl provides functions for this. Trade-off between accuracy and computational cost.
- **Support Vectors**: A function that takes a direction and returns the vector that maximizes the dot product in that direction, effectively pushing a half-space until it touches the boundary of the set. Combining multiple support vectors creates a bounding polytope.
- **Optimization formulation**: LP (Linear Programming) can directly compute support vectors without iterative set propagation.

## Reachability for Nonlinear Systems
- Non-linear operators transform polytopes into non-polytopes and often non-convex sets, which are computationally difficult to represent and propagate.
- **Solution**: Bound/over-approximate these non-linear sets with simple polytopes (specifically, hyperrectangles) using Interval Arithmetic.

## Interval Arithmetic
- Variables are represented as intervals: $X = [\underline{x}, \overline{x}]$.
- **Interval Box (Hyperrectangle)**: Cartesian product of multiple 1D intervals.
- **Interval Counterparts**:
  - Addition: Sum of lower bounds and sum of upper bounds.
  - Subtraction, Multiplication, Division.
  - Elementary functions (e.g., $e^x$, $\sin(x)$, $x^2$): the interval counterpart gives the tightest interval containing all outputs for the input interval.
  - Handled cleanly in Julia via `IntervalArithmetic.jl`.

## Inclusion Functions
- For complex nonlinear dynamics (e.g., inverted pendulum with $\sin(\theta)$ and multiplication), exact interval counterparts are hard to compute. We use Inclusion Functions that are guaranteed to over-approximate the interval counterpart.
- **Natural Inclusion Function**:
  - Replace every elementary operation in the function with its interval counterpart.
  - **Dependency Effect**: Causes massive over-approximation (e.g., $x - \sin(x)$ treats the two $x$ intervals independently, losing their relationship).
- **Mean Value Inclusion Function**:
  - Based on the Mean Value Theorem.
  - Evaluates the function at the interval's center point, and bounds the deviation using the interval counterpart of the function's gradient.
  - Equivalent to a 1st-order Taylor approximation; significantly tightens the bounds by mitigating the dependency effect.
- **Taylor Inclusion Function**:
  - Generalizes the mean value approach to higher orders (2nd, 3rd, etc.) for tighter bounds on highly non-linear intervals.
- **Limitations of Interval Methods**:
  - Always yield axis-aligned hyperrectangles, introducing over-approximation error.
  - Errors compound rapidly over multiple time steps as non-linearities stack.
- Next topic: Taylor Models (to overcome hyperrectangle limitations).
