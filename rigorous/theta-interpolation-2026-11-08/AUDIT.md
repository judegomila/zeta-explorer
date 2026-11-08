# Audit and scope

Date: 8 November 2026.

## Established in the notes

- The actual theta covariance identity and strict real-axis inequalities
  prove every two-node positive-real Pick matrix is positive definite.
- The inverse Schur map preserves positive-realness by an exact algebraic
  identity and has a nonzero denominator throughout the right half-plane.
- If positive interpolants exist for every nested node set, anchoring and
  Cayley compactness give a global exact xi realization. This implication
  is conditional on the unproved all-stage hypothesis.
- The explicit arithmetic screw function has the published exact xi
  transform. The double Laplace calculation and finite residual expansion
  fix its relation to the Pick matrices without assuming positivity.
- The exact gamma response is passive, but its arithmetic correction
  cancels the full boundary dissipation. Strict relative margins and a
  bounded multiplicative correction fail unconditionally.
- Single-prime updates are indefinite. Their integrated and differentiated
  operator norms have different behavior at the support threshold.

## What is not established

No third or later actual-xi pivot theorem, all-orders Schur-complement
bound, full positive canonical realization, global theta energy estimate,
or RH proof is obtained. The two-point result cannot be promoted to all
orders using scalar concavity alone: the supplied auxiliary certificate
shows a failure at four nodes in a kernel having that concavity.

The finite interpolation matrices are not claimed congruent to finite
blocks of the earlier theta derivative energy. The latest Suzuki spectral
convergence result is RH-conditional; it is not used to infer unconditional
convergence here. Known zero locations are not inputs to the interpolants.

## Independent mathematical checks

The covariance normalization, monotone covariance sign, and determinant
factorization were checked independently. The root review checked the
inverse-map real-part identity, interpolation preservation, dense-node
normal-family argument, and signed transformed kernels.

The arithmetic-to-Pick integral was independently checked by splitting the
integration quadrant. It is stated as an absolutely convergent feature
integral; no bounded global L2 operator is assumed. The residual formula
uses real interpolation nodes and includes the singular-matrix range
condition where an ordinary inverse is unavailable.

The prime-arrival proof distinguishes point-kernel positivity from
integral-operator positivity and includes smooth test functions. The
boundary-strip scaling, missing factor-of-two risk, and exact norm of the
compressed delay were checked. Prime-free support is not treated as an
automatic full positivity interval.

Staging clarifications record extremal termination in Schur reduction,
avoid asserting positivity of the entire prime-free archimedean block,
and cite the directly checked McCarthy paper.

## Executed checks

Runtime: Python 3.12.14, SymPy 1.14.0, mpmath 1.3.0.

```bash
python theta_interpolation_checks_20261108.py
```

The script checks determinant, oscillator, double-transform, shifted
kernel, and passive-map identities symbolically. Its auxiliary four-node
certificate uses exact rational interval arithmetic throughout; Decimal
directed rounding affects only the printed endpoints.

For that certificate, exp(1/4) is enclosed by the degree-24 Taylor sum
plus a geometric bound for its positive tail. The first three interval
LDL pivots are positive and the fourth negative. The exponential bound,
rational response formula, interval operations, and Schur updates received
an independent audit. This certificate concerns the auxiliary kernel
only, not an off-line xi zero or a negative actual-theta direction.

The ten mpmath checks separately audit normalization against completed xi
and the canceled s=1 limit. They are high-precision diagnostics, not
interval certificates. The captured JSON replay records their errors and
the auxiliary oscillator parameters without treating them as xi zeros.

## Publication scope

Base main commit: `942ba1760c4ef54a519750ab91c37a661c31e0ce`.
Base tree: `d94ea0ebf222f4af4c2599d5f094288fe5c49094`.

Only `rigorous/theta-interpolation-2026-11-08/` and
`thinking/decisions/2026-11-08-theta-interpolation.md` are added. No active
application code, existing experiments, or prior research branches are
modified. MANIFEST.json hashes every checkpoint file except itself.
Uploaded contents are checked before the branch is published. Repository
CI is reported in the PR separately from mathematical verification.
