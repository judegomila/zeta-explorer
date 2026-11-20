# Exact X=33/2: one bounded all-separated-phase attempt

30 October 2026. This is a local producer method, not independent acceptance of a support endpoint. The accepted endpoint on entry is sqrt(161/10). No publication, odd-sector, cofinal-support or RH claim is made.

## Fresh support and whole-tail comparison

All actual entries are recomputed at exact X=33/2, W=log(X), with N=2048, J=16384, L=36 and 1000-bit Arb. The unchanged generic actual-entry formulas include precisely prime powers 2,3,4,5,7,8,9,11,13,16; 17 is excluded. The 150-term exponential remainder and all actual near rows are recomputed, never transferred from another support.

The exact eighth-power positive-kernel weighted-Schur enumeration has 2,630,076 states at depth eight and 19,196 support breakpoints. Its outward operator-norm upper bound is below 3.820103192196. The fixed rational envelope is P=477513/125000=3.820104. Selfadjointness justifies taking the eighth root even without positivity of the prime operator itself.

The audited analytic gamma/pole/tail comparison, with W recomputed, gives

    d_j=Re psi(5/4+i pi j/W)-log(pi)-Gamma(W)-P-H_K(W)/N,
    D_actual >= diag(d_j),  j>N.

The freshly computed uniform tail floor is greater than 0.7061304911532. Digamma monotonicity supplies positivity for the whole infinite tail; a sampled minimum is not used as a substitute. The entire near inverse uses its own new d_j. No old far matrix, old inverse profile or old moment cache is imported.

Fresh bounds give Cformula=1.29085923568244...<Cbeta=13/10, and beta_abs+Cformula/2=2.53318847474807...<B=3 for j>=2; b1 is separately checked. Thus the old numerical values are not assumed to transfer.

## Exact phase grouping and all-separated global Abel charge

Write beta_j=sum_r c_r exp(2 pi i j log(r)/W). There are 21 exact rational raw ratios and 193 exact rational ratios in beta_j^2. Every ratio is reduced exactly modulo multiplication by integer powers of X, using its unique representative in [1,X). For integer j these phases are identical, so coefficient accumulation inside each exact class is algebraically exact. This produces 169 squared phase classes and 21 raw classes.

Only original ratio 1 belongs to the identity class in both expansions. Hence the exact identity contributions remain q_1 M_s(1) and M_s(1)/4; there is no missing mean or approximate alias deletion. All other classes are charged by the global Abel bound. The smallest nonzero phase chord is 0.0689550003662270..., at the former ratio16 channel and its reciprocal. Being nonzero is not alone a feasibility claim: its complete charge is retained below.

The grouped constants are

    C_AA=sum_(rbar != 1) 2|sum_(r~rbar)q_r|/|1-exp(2 pi i log(rbar)/W)|
        =6.775375545470234...,
    C_AC=4.343106934921033....

Every denominator is certified finite and positive. The ungrouped preflight had C_AA=7.386152337966654..., and is preserved separately; exact grouping is a justified improvement, not a dropped channel or a precision/support sweep.

The 49 fresh inverse endpoints define 48 finite bands through64J plus the infinite plateau. On each band omega_j=1/d_(a_i+1), and after64J the last positive weight persists forever. Thus omega_j>=1/d_j and is nonincreasing. The weighted identity moments are freshly assembled from Hurwitz-zeta differences, including the final infinite term. No support-dependent oscillatory moment is needed, and no serialized oscillatory cache is read at all.

Global Abel is charged once across all bands because omega_j/j^s is globally nonincreasing. With the existing feature normalization,

    delta_A=L C_AA omega_first/(J+1)^2=3.262084399145527...e-7,
    delta_X=L C_AC omega_first/(J+1)^2=2.091040014113841...e-7.

For eps=epsb=1/10 and sigma=1/8, the actual coefficient-H diagonal allowances are

    AA: 2(1+eps)(1+epsb)(delta_A+sigma delta_X)
        =8.526783850201612...e-7,
    CC: 2(1+eps)(1+epsb)delta_X/sigma
        =4.048253467324395...e-6.

Signed identity mixed moments, the full Cbeta error, and the B3 geometric remainder remain in H/rem. There is no second division by a far tail floor, and no moment reuse across supports.

## Full-gate implication and boundary

The shared structured helpers are unchanged. The historical constant-coordinate lift is removed exactly, and the inverse energy anchor is zero. The complete gate must certify all 2049 actual core pivots, all72 coefficient-H pivots and all72 whitened-Schur pivots. Their minima are inertia diagnostics, never eigenvalue floors.

Only a complete producer PASS plus independent analytic/source review and full isolated replay could accept the new finite reflection-even endpoint. A failed lower surrogate does not prove negative actual Weil energy. The 33-mode direct-dense/generator gate and coefficient-H gate support implementation feasibility but cannot certify the worst full-head direction. Exactly one full producer run is allowed in this bounded attempt.

## Preserved diagnostic history

`ungrouped_preflight/` preserves the first valid ungrouped small gate and its sources. `grouped_identity_assertion_failure/` preserves a preflight source/log failure caused by inappropriate inexact acb equality (`a==a` can be false for an interval). The repair uses exact rational singleton identity preimages for algebraic equality and interval overlap only as a numerical enclosure sanity check. No precision escalation or mathematical certificate failure is hidden. The old ungrouped JSON found during that failed startup is explicitly marked stale and is not a grouped result.
