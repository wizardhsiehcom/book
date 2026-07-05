# Lecture 04: Property Specification 2

## 1. Review of Composite Metrics
- Trade-off between competing metrics (e.g., alert rate vs collision rate).
- **Pareto Optimality**: A design where you cannot improve one metric without worsening another.
- Composite metric methods: Weighted sum, goal distance (utopia point), weighted exponential sum.
- **Weight Elicitation**: Instead of asking experts for weights directly, ask pairwise questions (e.g., prefer candy bag A or B).
- Pairwise queries constrain the possible weights using **half-spaces**.
- **Inconsistent preferences**: If half-spaces contradict, relax perfect rationality assumption and model human choice probabilistically (Bayesian estimation), which is the basis for RLHF.

## 2. Logical Specifications
- A formal definition of an operating requirement that evaluates to true or false.
- **Propositional Logic**:
  - Built from atomic propositions (cannot be broken down further).
  - Operators: NOT ($\neg$), AND ($\land$), OR ($\lor$), Implies ($\implies$), Bi-conditional ($\iff$).
- **First Order Logic**:
  - Adds variables (objects in a domain, e.g., state $x$) and predicates (functions evaluating variables to true/false, e.g., $P(x)$).
  - Quantifiers: Universal ($\forall$ "for all") and Existential ($\exists$ "there exists").

## 3. Temporal Logic
- Extends first order logic to sequences/time.
- **Linear Temporal Logic (LTL)**:
  - Properties over linear sequences of states.
  - Operators:
    - **Always ($\square$)**: Must be true at all future time steps.
    - **Eventually ($\lozenge$)**: Must be true at some future time step.
    - **Until ($U$)**: $P \ U \ Q$ means $Q$ must be true eventually, and $P$ must be true at least until $Q$ becomes true.

## 4. Signal Temporal Logic (STL)
- Extends LTL to real-valued signals.
- Introduces specifications over specific time intervals (e.g., between time $a$ and $b$).
- Maps real-values to truth values via predicates $\mu_c(s_t) \equiv s_t > c$.

### Robustness in STL
- Gives a continuous value to how well a specification is satisfied (or failed).
- Values $>0$ indicate success, values $<0$ indicate failure. Magnitude indicates "how much" margin there is.
- Calculation rules:
  - Predicate $s_t > c$: $s_t - c$
  - NOT $P$: $- \text{robustness}(P)$
  - $P \land Q$: $\min(P, Q)$
  - $P \lor Q$: $\max(P, Q)$
  - Always ($\square$): minimum over time sequence
  - Eventually ($\lozenge$): maximum over time sequence

### Smooth Robustness
- For optimization, gradients of robustness with respect to states are needed.
- `max` and `min` operators have 0 gradient almost everywhere, which is unhelpful.
- Solution: Replace with `soft-max` and `soft-min` to smooth out the gradient.
- Controlled by parameter $w$ (as demonstrated in Julia notebooks like `property_specification.jl`).
- Allows gradient-based optimization to find failure modes (minimizing robustness).

## 5. Reachability (Advanced Topic)
- Skipped in lecture due to time, but mentioned as an advanced topic in the book converting non-reachability properties into reachability via automatons.
