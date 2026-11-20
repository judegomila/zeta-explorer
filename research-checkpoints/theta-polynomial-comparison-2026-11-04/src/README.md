# Polynomial all-degree comparison for the actual theta source

2026-11-04. New actual-theta estimate, with independent analytic audits. No RH, sign of the target form, zero-spacing assumption, selected localization, or numerical scan is used. No frozen proof or live 4CT file is edited.

## Main result

For the actual theta transform F, let

    Tp=Fp'+2F'p, X[p]=∫_R |Tp|²,
    W_*(t)=|Gamma(9/4+it/2)|²,
    N=n+2, L=log(n+2).

Every real polynomial p of degree at most n satisfies

    ||p||_(W_*)² ≤ C N L^(3/4) X[p].                  (1)

This improves the previously established exp[C log²n] comparison loss to a polynomial loss. The result is degree-uniform and applies before selection. Complex polynomials also satisfy it by applying the real inequality separately to their real and imaginary parts.

More generally, for W_lambda(t)=|Gamma(lambda+it/2)|², any fixed a>1/2 with a+7/2<2lambda gives

    ||p||_(W_lambda)²
         ≤ C_(lambda,a) N^(2lambda−7/2) L^a X[p].     (2)

The constants need not remain bounded at the parameter endpoints. For lambda=4,a=3/2 this gives the independently checked bound C N^(9/2)L^(3/2), and hence the simpler C N^6 bound.

## Actual-theta mechanism

The proof uses stronger exact-theta information than a real-axis envelope or zero count:

1. The preliminary subexponential comparison controls polynomial coefficients in terms of X.
2. The exact Fourier theta kernel is analytic in a fixed strip and decays double-exponentially. Cauchy estimates control all derivative orders simultaneously, giving a degree-uniform Fourier tail for the source Tp.
3. For every fixed a≥0, the source therefore has the polynomial-cost analytic continuation bound

       ||Tp(.-ia)||² ≤ C_a (N log N)^a X[p].           (3)

   Its Fourier mass outside |u|=(1/2)log(N log N)+K_a is exponentially small in N log N, including any fixed exponential weight. This is an upper localization statement in the Fourier variable u, not escape in the real variable t.
4. For a>1/2, the shifted line corresponds to Re s=1/2+a>1. The Euler product bounds zeta both above and away from zero there. The exact primitive (F²p)'=F Tp then controls a weighted supremum of p on that line.
5. A degree-independent strip maximum argument brings that supremum back to the real axis. A direct weighted integral estimate proves (2).

The preliminary comparison is an independently established input, not the improved bound being proved, so this is a bootstrap without circularity.

## Consequences

Using only the previously proved elementary natural-reference upper bound X[p]≤C N³||p||_(W_*)², the actual source Gram in W_*-orthonormal coordinates has

    κ₂(G_n) ≤ C N⁴ L^(3/4).

With the additionally established arithmetic trial upper bound

    X[M_j*] ≤ C b_j* log³(j+2),
    M_j*(t)=j!P_j^(9/4)(t/2;π/2),
    b_j*=||M_j*||_(W_*)²,

the trace bound improves this to

    κ₂(G_n) ≤ C N² L^(15/4).

The same bound holds after individually X-normalizing the natural reference polynomials. This sharper condition-number consequence uses the audited Hardy-Z derivative-moment input behind the trial upper bound; (1) itself does not need that input.

For the actual monic selected minimum A_n, ordinary reference orthogonality gives

    A_n ≥ c b_n*/[N L^(3/4)].

Together with the arithmetic trial upper bound, the selected overlap is

    theta_n(M_n*)=A_n/X[M_n*] ≥ c/[N L^(15/4)].

This improves the previous exp[−C log²n] overlap guarantee, but it does not approach one.

## Remaining blocker

The new bounds do not establish decay of escaping zero-cell capacities, selected source escape, negative-excess cancellation, H[P_n]/X[P_n]→0, the relative Schur-excess estimate, positivity of a new signed rung, or RH. Polynomial conditioning does not automatically validate scalar moment errors: a transfer still needs a correctly measured operator error on the growing space, at a rate that beats the actual inverse bound and the relevant relative scale.

## Files

- `GENERAL_REFERENCE_AND_NATURAL_COROLLARIES.md`: full general-reference proof and explicitly source-separated natural consequences.
- `WEIGHTED_SHIFT_REFINEMENT_AUDIT.md`: independent full audit from uniform theta derivatives through shifted primitives, including the original exponent-11 proof and its weighted improvement.
- `REAL_POLYNOMIAL_WEIGHTED_SHIFT_DOMINANCE.md`: a separate independent check of the degree-free strip argument.
- `AUDIT.md`: cross-checks, exact dependencies, and scope.
- `SHA256SUMS`: hashes of the five deliverable payloads.

The working initial audit is retained under `working/` for provenance but is not part of this frozen deliverable allowlist.

These are AI-assisted analytic results with independent AI-assisted audits, not external peer review or machine formalization. No literature-novelty claim is made.
