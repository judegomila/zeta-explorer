# Independent audit

Date: 2026-11-04. Verdict: PASS for the stated estimates and obstructions.
This is an independent AI-assisted mathematical audit, not machine
formalization or external peer review.

## Uniform logarithmic-range bound

The reviewer checked the actual-theta exponential envelope, zero-free
normalization interval, evaluation identity, Chebyshev extrapolation,
Markov n^4 factor, incomplete-gamma tail bound, and leading exponent.
The threshold A>4/π and strict slack η<πA/2−2 correctly absorb the
2n log log(n+2) term. The auxiliary interval now explicitly has r≤1,
resolving the minor small-degree wording issue. No lower bound at real
zeros, Q positivity, or inverse-gap assumption enters the proof.

The result is relative to X[p]. The note correctly does not infer an
o(Δ_n) bound without an additional lower comparison for Δ_n/X[P_n].

## Hardy escaping-family construction

The reviewer checked:

- The exact logarithmic-coordinate H, X, Q, and averaged-mass identities.
- The endpoint ratio ((2m−1)/(2m+1))², giving 1/9 at simple zeros.
- The high-log-frequency construction with H/X→1 and both absolute
  potential and averaged gamma-potential mass divided by X tending to zero.
- Parity reflection and smooth support away from the puncture before
  approximation; no division through a real zero is used.
- Augmented polynomial graph density with all extra weights retained.
- Exact projection onto each prescribed finite X-prefix, including the
  finite norm-comparison constant and support-dependent Gram trace.
  These constants are fixed before approximation tolerances and supports
  are chosen, and are not asserted uniformly bounded.
- Compatibility with the separate n log n tail theorem at the constructed
  polynomial's own degree.

The lack of degree control relative to zero height, and the uncontrolled
number of coefficients above the prescribed prefix, are essential. The
note correctly does not identify its polynomials with the selected
one-dimensional endpoint or infer failure of selected coherence.

For source durability, the final note uses the previously directly verified
Bui–Conrey–Young primary PDF, https://arxiv.org/pdf/1002.4127, Theorem 1.1,
with Riemann–von Mangoldt. Only unbounded simple real Xi zeros are needed.

## Actual-theta conditioning and perturbations

The reviewer independently checked:

- The exact weighted maximum for (t²−s²)^m, the derivative supremum
  constant, and both parity X-norm upper bounds.
- The actual monomial asymptotic's Stirling prefactor and its use in the
  finite condition-number inequality.
- The Lambert-W optimizer, rate η*=0.228769704…, and the order of limits:
  each β<π/2 is fixed before taking the degree liminf, then β increases.
- The exact positive lower bound η*>1/5, and the fixed β=.999π/2 rate
  greater than 19/100, without reliance on displayed decimals.
- The alternating derivative-moment perturbation 4δSDS, its consistency
  on a fixed parity Hankel block, and positivity of the perturbed X block.
- The exponential lower bound for its relative form error. This is an
  admissible error pattern, not a statement about the actual correlated
  arithmetic remainder or a realizable second theta transform.
- The explicit caveat that positivity is fixed-parity, not a simultaneous
  two-parity positive-measure model.
- The Laguerre connection formula, exact finite R_m sum, asymptotic
  3^(α+1)9^m/(2sqrt(2πm)), and normalized condition-number comparison.

## Escaping actual-w conditioning extension

The final incremental audit checked the new Section 7 separately:

- The denominator loss O(m²/n) and gamma-moment ratio, with
  m=floor(n^(1/3)).
- The outer-tail phase's exact maximum at x=9/2 and negative value
  6log2−9/2, yielding exponentially small tail despite polynomial factors.
- Actual compact w-mass escape after normalization.
- The positive binomial term j=3n/2 for even n, the gamma expansions with
  k=O(n^(1/3)), and their o(n) corrections.
- The exponent γ=7log2−(3/2)log3−3 and its strictly positive rational-bound
  proof, rather than an inference from decimal evaluation.
- The fixed-parity scalar-error interpretation.

This extension concerns escaping actual-w test polynomials. It does not
establish X-selected localization or coherence.

## Final boundary

No substantive mathematical error was found. The actual-selected
o(Δ_n) excess estimate, selected derivative coherence, and the stronger
rate involving sqrt(ρ_n) remain unproved. No selected counterexample was
constructed. The package records a genuine tail estimate and precisely
scoped failures of incomplete transfer mechanisms, not an all-degree
signed-pivot or RH proof.
