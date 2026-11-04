# Actual-theta monic bounds and a subexponential reference comparison

2026-11-04. This package provides explicit monic competitors and noncircular all-degree bounds for the exact theta source norm. It does not establish selected derivative coherence or RH.

## Proved results

Write T p=F p'+2F'p, X[p]=||Tp||², and let A_n be the actual monic X-selected minimum in the complete parity prefix.

1. For W_4(t)=|Gamma(4+it/2)|² and every polynomial of degree at most n,

       exp[-C log²(n+2)] ||p||²_(W_4)
           <= X[p] <= C(n+1)||p||²_(W_4).

   This is a genuine actual-theta form comparison, not a replacement by averaged scalar moments. Its proof uses a minimum-modulus argument outside tiny zero neighborhoods, the exact source primitive, and a finite-degree Markov estimate.

2. The explicit monic Pollaczek family M_n=n!P_n^(4)(t/2;pi/2) gives

       A_n <= C n!Gamma(n+8),
       log A_n=2n log n-2n+O(log²(n+2)).

   The family is near-extremal at exponential scale:

       1<=X[M_n]/A_n<=exp[C log²(n+2)].

   Neither bounded relative norm nor convergence of that ratio to one is asserted.

3. In the reference-orthonormal Pollaczek basis the actual X Gram has condition number at most exp[C log²(n+2)]. The same holds after individual X normalization, with a changed constant. Selected quadratic coefficient norms are controlled on the same subexponential scale; no absolute selected synthesis sum is used.

4. The existing monomial-carrier mesoscopic packets consequently have the stronger uniform leverage bound

       log theta_n <= -2n log(4/pi)+O(log n).

   The achieved exponential rate is 2log(4/pi)=0.4831289505..., improving the earlier Chebyshev comparison. This remains an obstruction for that specific packet family, not selected coherence.

5. The natural gamma-matched parameter lambda=9/4 has

       a(t)²/|Gamma(9/4+it/2)|²
           =16(t²+1/4)/(t²+25/4),

   up to fixed theta normalization. The same lower comparison holds for this reference, with a polynomial upper bound C(n+1)^3. Its explicit monic family has subexponential relative norm and conditioning bounds as well. The separate natural-family package strengthens its actual derivative/source and source-scale estimates.

## Final publication files

- POLLACZEK_MONIC_COMPARISON.md: exact signed derivative expansion, the original explicit monic upper bound, and the improved mesoscopic obstruction.
- ACTUAL_THETA_SUBEXPONENTIAL_REFERENCE_COMPARISON.md: full two-sided all-polynomial comparison and selected-norm/Gram consequences.
- NATURAL_GAMMA_REFERENCE.md: the exact gamma-matched reference, recurrence estimates, and extension of the quadratic comparison.
- AUDIT.md: independent checks of the Pollaczek formulas and actual-theta majorant.
- TWO_SIDED_COMPARISON_AUDIT.md: independent check of the minimum-modulus and all-degree form comparison.
- SHA256SUMS: final payload hashes.

The natural-reference recurrence and rational-factor extension are also checked in the companion natural-family audit. There are no draft or conditional working snapshots in this publication allowlist.

## Companion favorable natural family

The separate /workspace/shared/theta_pollaczek_natural_20261104 package proves for lambda=9/4 that H[M_n]/X[M_n]=O(1/log n), as well as c b_nlog²n<=X[M_n]<=C b_nlog³n, with b_n its exact reference monic norm. Its proof and independent audits are separate deliverables.

## Remaining selected problem

Subexponential near-extremality is still much weaker than relative near-optimality. These bounds do not show that the favorable natural-family derivative ratio survives the actual full-prefix selected residual. They prove neither Delta_n>0 nor U_n=o(Delta_n). A new cancellation-sensitive selected estimate or sufficiently sharp relative monic comparison is still required.

This is AI-assisted analytical research with independent AI-assisted audits, not external peer review or machine formalization. The cited classical identities and the frozen theta inputs are explicit dependencies. No literature-novelty claim is made. No prior frozen package, live 4CT script, repository, or external service was modified.
