# Full arithmetic selection: new bounds and precise obstructions

2026-11-04. This continuation retains the complete arithmetic cross terms and distinguishes actual theta results from a solved GCD comparison model. It does not prove the actual fully selected upper bound h_n=H[P_n]/X[P_n] -> 0 or a_n(s_n)=1+o(s_n).

## Main findings

1. **Even full arithmetic bounded-bandwidth differentiation has a growing cost.** On integer labels N<=a<=exp(B)N, the exact GCD kernel K(a,b)=gcd(a,b)/sqrt(ab) and centered frequency multiplier Lambda obey

       c_B log N <= ||Lambda||_K^2 <= C_B log^2 N.

   The lower bound follows from a precise divisor-sum cancellation destroyed by differentiation, and admits real-even witnesses. The upper bound follows from the exact divisor-coordinate matrix and a weighted Schur test. No scan or discarded arithmetic term is used. The gap is unresolved, and the upper bound is borderline for a log-squared source/value gain at polynomial arithmetic size.

2. **Scalar arithmetic coercivity fails even in arbitrarily narrow fixed frequency bands.** A filtered prime-pair tensor gives arbitrarily small GCD-kernel eigenvalues with fixed bandwidth. Its actual-theta consequence is bulk-concentrated real polynomials with Q[p]/Qbar[p] arbitrarily small, in either parity, with each arithmetic block fixed before degree tends to infinity. This is a signed upper bound, not an absolute-smallness or negative-sign theorem. The same prime-pair family still has a bounded restricted K-metric derivative operator; the two obstructions are logically distinct.

3. **Complete selection can provide a genuine arithmetic cancellation in a solved comparison model.** On all labels 1,...,N, the fully K-selected endpoint has Mobius coefficients and exact derivative response

       sum_(p divides N) (log p)^2/(p-1) <= C[loglog(N+3)]^2.

   Thus the explicitly defined leading GCD model has selected decay at polynomial label growth, also after complete reselection for the positive sum alpha K+beta Lambda K Lambda. Its integer-label selector is not the actual theta polynomial selector, and the growing twisted moments contain additional arithmetic-log terms. No transfer to P_n is asserted.

4. **The actual theta full Gram has many large generalized directions.** For every gamma<2/pi^2, some epsilon>0 gives

       #{lambda(K_n)>=1-C(log n)^(-epsilon)}
                           >= gamma log n loglog n

   eventually, with half the leading count in each parity. Consequently, for fixed s>0,

       liminf log det(I+sK_n)/(log n loglog n)
                                      >= (2/pi^2)log(1+s).

   Here K_n is the exact source-relative derivative Gram, not the GCD kernel. The proof uses a quantitative period choice, the already audited local zeta minimum-modulus lemma, and exponentially accurate genuine polynomial approximations. It transfers to the growing finite-theta model. It excludes polynomial full-volume bounds and rank-o(log n loglog n) approximations with uniformly subunit error, but does not contradict endpoint or density-one decay.

## What remains unproved

A successful actual-theta selected proof still needs a mechanism that uses complete polynomial-degree selection, controls growing arithmetic corrections relative to their small positive directions, and yields a vanishing upper response. Fixed-block asymptotics, the solved integer-label model, and lower spectral counting do not supply that mechanism. All previous lower bounds remain consistent with these results.

## Frozen allowlist

- README.md
- ARITHMETIC_FREQUENCY_SEPARATION.md
- FIXED_BAND_ARITHMETIC_INDEPENDENT_AUDIT.md
- EXACT_GCD_ENDPOINT_SELECTION.md
- EXACT_GCD_ENDPOINT_SELECTION_AUDIT.md
- FULL_GRAM_DETERMINANT_INVESTIGATION.md
- QUANTITATIVE_PERIOD_SPECTRAL_COUNT.md
- AUDIT.md
- SHA256SUMS

These nine files are the exact source backup allowlist. SHA256SUMS covers the eight payload files; working/ is excluded. Mathematical arguments received independent AI-assisted checks, not external peer review or machine formalization. No RH, selected sign, or coherence result is claimed. Earlier frozen artifacts and all 4CT work are unchanged.
