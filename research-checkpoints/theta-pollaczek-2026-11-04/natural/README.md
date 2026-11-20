# A favorable full-degree oscillatory theta family

2026-11-04. The natural gamma-matched Meixner–Pollaczek family provides a new all-degree actual-theta estimate, without absolute selected coefficient sums or an inverse-Gram assumption.

## Main theorem

Let

    M_n(t)=n! P_n^(9/4)(t/2;pi/2),
    b_n=(4pi/2^(9/2))n!Gamma(n+9/2).

These are explicit monic polynomials of degree n and parity n. For the exact theta transform and source T p=F p'+2F'p, all sufficiently large n satisfy

    integral F² M_n² + H[M_n] <= C b_n log n,
    c b_n log² n <= X[M_n] <= C b_n log³ n,
    H[M_n]/X[M_n] <= C/log n -> 0.

The optional source upper bound additionally uses the previously verified cumulative Z'² moment theorem; it also gives B_n<=C b_n log n and A_n<=C b_n log³ n. No selected Delta sign follows.

All real Xi zeros are included. No RH, enlarged Q positivity, old inverse gap, or scalar-moment Gram replacement is used.

The companion two-sided source/reference comparison also gives

    X[M_n]/A_n <= exp[C log²(n+2)],
    theta_n(M_n)=A_n/X[M_n] >= exp[-C log²(n+2)],

and subexponential actual Gram conditioning for the corresponding reference-orthonormal hierarchy. Thus this family avoids the exp(-c n) selected-overlap obstruction of the earlier monomial-carrier mesoscopic packets. These are upper/lower bounds, not a claim that either rate is exact.

## Why the proof differs from the previous packet route

The exact Pollaczek Fourier transform permits a contour-shift proof of global polynomial envelopes, including the origin, the turning point near 2n, and the exterior tail. The envelope is applied to the actual Hardy-Z moments rather than replacing a growing theta Gram by independent scalar asymptotics.

The upper bound uses a nonoscillatory majorant and ordinary Z² mean-square estimates. The lower bound uses the existing actual-Hardy-Z fixed-band top-mode theorem on a uniform family of local bulk cosine profiles, then integrates over their centers. The local error is controlled absolutely against Z', with no differentiation of a Riemann–Siegel remainder.

## Files in the final result

- NATURAL_FAMILY_RATIO.md: actual-theta all-degree theorem and full global-envelope and transfer proof.
- UNIFORM_INNER_ENVELOPE.md: exact Fourier normalization and the uniform inner/differentiated envelope.
- NATURAL_FAMILY_RATIO_AUDIT.md and INNER_ENVELOPE_AUDIT.md: independent checks.
- ARITHMETIC_SCALE_COROLLARY.md: a further source upper bound and ordinary derivative-minimum bound using the already verified derivative Hardy moment input.
- SHA256SUMS: final payload hashes.

The initial DRAFT and conditional WKB-route files are working snapshots, not final deliverables.

## Companion actual norm comparison

The preceding independently audited package is /workspace/shared/theta_pollaczek_trial_20261104. In particular:

- ACTUAL_THETA_SUBEXPONENTIAL_REFERENCE_COMPARISON.md proves the all-polynomial comparison via a local minimum-modulus argument, the exact source primitive, and Markov's inequality.
- NATURAL_GAMMA_REFERENCE.md extends it to the exact gamma-matched parameter 9/4.
- TWO_SIDED_COMPARISON_AUDIT.md records the independent norm-comparison audit.

## Exact remaining gap

The explicit M_n are not the fully X-selected P_n. The proved error exp[C log² n] is subexponential but still far larger than relative near-optimality 1+o(1). It does not control the large signed derivative cancellations in the selected residual. Therefore favorable trial H/X does not yet prove selected H[P_n]/A_n decay, Delta_n>0, or U_n=o(Delta_n).

The new result supplies a concrete oscillatory family with actual derivative/source decay and independently bounded actual Gram geometry. It does not close the selected-polynomial problem or yield an RH conclusion.

This is AI-assisted analytical research with an independent AI-assisted audit, not a machine-formalized proof or external peer review. The classical Fourier identities and the supplied Hardy moment/top-mode inputs are explicit dependencies. No literature-novelty claim is made. No prior frozen package, live 4CT script, repository, or external service was modified.
