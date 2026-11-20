# Selected escape: a tail estimate and two failed transfer routes

Date: 2026-11-04. The requested actual-selected estimate
E_n(δ)=Δ_n+o(Δ_n) remains open. This package supplies one independent
actual-theta tail bound and explicit obstructions to plausible incomplete
bridges. It does not infer selected asymptotics from the monomial saddle.

## Useful conclusions

1. **Uniform actual-theta tails.** For A>4/π and
   0<η<πA/2−2, every polynomial of degree at most n has total source,
   derivative, absolute-potential, and w energy beyond A n log(n+2)
   bounded by C exp[−η n log(n+2)]X[p]. This includes the actual selected
   family. It is an o(X) estimate, not automatically o(Δ).

2. **Escape plus partial orthogonality is insufficient.** Actual-theta
   finite polynomials can escape toward high real Xi zeros, be exactly
   X-orthogonal to any prescribed growing finite prefixes, and satisfy
   H/X→1 while their averaged gamma-potential mass divided by X tends to
   zero. Another family has the simple-zero Hardy ratio H/X→1/9.
   These families contain uncontrolled numbers of coefficients above their
   prescribed prefixes and have no degree-versus-zero-height bound. They
   are not the one-dimensional selected endpoint. This is a precise
   counterexample to a bulk-uniform bridge, not to selected coherence.

3. **Scalar moment error bars cannot certify the missing transfer.** In
   either fixed parity, the Gram matrix of individually X-normalized
   monomials through degree 2m+ε has
   liminf log κ₂/m≥η*=0.228769704…>1/5.
   An explicit consistent fixed-parity Hankel perturbation realizes the
   same exponential amplification of scalar derivative-moment errors and
   still preserves positivity of that X block. The perturbation is an
   admissible error model, not a claim about actual arithmetic remainders.
   Exact Laguerre-reference amplification is also computed.

4. **The conditioning problem persists for escaping tests.** An explicit
   same-parity actual-w polynomial family has escaping w-mass and
   absolute-coefficient cancellation amplification at least
   exp[(γ−o(1))m], where γ=7log2−(3/2)log3−3>0.
   Its escape scale is much smaller than its degree, and it is not
   X-selected. Thus this strengthens the transfer obstruction without
   answering the degree-linked endpoint question.

## Files

- `UNIFORM_LOGARITHMIC_RANGE_BOUND.md`: full degree-uniform tail proof.
- `HARDY_ZERO_ESCAPE_AND_AVERAGE_BRIDGE_OBSTRUCTION.md`: exact real-zero
  coordinate formulas, polynomial graph approximation, parity, and finite
  prefix correction with explicit norm-comparison constants.
- `ACTUAL_THETA_PARITY_CONDITIONING_AND_LAGUERRE_ERROR_AMPLIFICATION.md`:
  finite actual-theta condition-number bounds, analytic rates, PSD scalar
  error construction, exact reference calculation, and escaping extension.
- `AUDIT.md`: independent mathematical and scope audit.
- `SHA256SUMS`: hashes of the five payload files after final audit.

## Assumptions and conditioning

No new result assumes RH, pointwise V≥0, positive old or enlarged Q,
or a uniform inverse generalized gap. Actual monomial asymptotics are used
only where their previously verified arithmetic dependencies suffice.
Unbounded simple real zeros are supplied by the previously verified
Bui–Conrey–Young theorem and Riemann–von Mangoldt, not RH.

The finite-prefix projection in the escaping construction uses its actual
positive G_X inverse. Its constants may be arbitrarily large. Supports,
frequencies, and approximation tolerances are chosen after these constants
are fixed. This is existence, not a degree-effective construction.

The conditioning proof uses a finite exponential-moment constant K_β for
each β<π/2. The limit β↑π/2 is taken only after the degree liminf. No
uniform K_β bound at that endpoint is assumed. Perturbation positivity is
fixed-parity, not a simultaneous two-parity positive-measure assertion.

The prior excess-Schur identities retain their original finite old-prefix
positivity and resolvent conditions. This package does not establish
Δ_n>0 or a lower bound on Δ_n/X[P_n]. Those cannot be silently supplied
when converting the new tail estimate into an o(Δ_n) statement.

## Remaining task

A successful proof must use complete X-endpoint selection together with
degree-sensitive localization, or control the actual correlated arithmetic
remainder on that selected family. Compact escape, an n log n tail bound,
incomplete prefix orthogonality, scalar moment asymptotics, approximate
matrix positivity, and a change to a gamma-reference basis do not suffice.

These are AI-assisted research results with an independent AI-assisted
audit, not machine-formalized or externally peer-reviewed proofs. No
literature-novelty claim is made. No prior frozen package, live 4CT script,
repository, or external service was modified by this investigation.
