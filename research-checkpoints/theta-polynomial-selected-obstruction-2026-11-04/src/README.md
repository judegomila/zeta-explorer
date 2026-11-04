# Applying polynomial conditioning to the selected problem

2026-11-04. This package applies the newly audited actual-theta polynomial comparison. It proves a stronger degree-uniform tail, a sharper actual-selected localization obstruction, and precise error-transfer requirements. It does not prove selected coherence or RH. No new numerical scan, prior frozen payload edit, or live 4CT edit was made.

## 1. Actual source and both excess signs have an exponential tail beyond a linear range

For every real polynomial p of degree at most n, n≥1, with

    Tp=Fp'+2F'p, X[p]=∫|Tp|², V=2(F'²−FF''),

and every fixed 0<η<4−2log6,

    ∫_(|t|≥(12/π)n)
       [ |Tp|²+F²|p'|²+|V||p|²+F²|p|² ]
        ≤ C_η e^(−ηn) X[p].                           (1)

The explicit pre-exponential version is C(n+2)^11 log(n+2)^(3/4)exp[−(4−2log6)n]. The range coefficient is approximately 3.81972; the rate endpoint is approximately 0.416481.

This bounds both selected positive and negative signed-excess tails outside that range. It applies to whole cells lying entirely outside the range and clipped exterior portions of crossing cells. It does not bound the interior portions of crossing cells, all cells escaping inside the linear range, or full cell capacity operators on arbitrary sources.

The result sharpens the previously recorded n log n range. Its proof uses the new polynomial comparison for an explicit prefactor; the preliminary subexponential comparison would also suffice for a qualitative exponential linear-range conclusion, since exp[O(log²n)] is subexponential.

## 2. Actual selected multiplication rows cannot have fast polynomial tails

Let q_n=P_n/sqrt(A_n) be the complete actual X-orthonormal sequence. Fix a nonzero real polynomial q and a nonconstant real polynomial h. Then the row

    a_n=X(hq_n,q)

cannot satisfy |a_n|≤C(n+2)^(-s) eventually, for ANY s>5/4. With even h and definite-parity q, the same assertion holds in the matching parity.

This excludes uniform tail upper bounds; it is not a lower bound at every index. The endpoint s=5/4 is not decided.

The proof combines the new general-reference polynomial comparison with an angular Cauchy estimate for Pollaczek polynomials. Fast row decay would produce an analytic representative on a positive-width strip. Exact source orthogonality and Fourier uniqueness then force the same local equation whose simple-real-zero resonance is impossible. The already-supplied infinitely-many-simple-real-zeros input is explicit.

Thus improved conditioning does not authorize rapidly localized selected multiplication or inverse-column arguments. Any conversion from an inverse-column assumption to a forbidden row rate still needs its own matrix proof.

## 3. Polynomial losses now give concrete, but unmet, transfer thresholds

In the natural W_(9/4)-orthonormal coordinates, an exact selected X-normalized column c obeys

    ||c||²≤C N L^(3/4),  N=n+2, L=log(n+2).

Therefore a Hermitian target-form error E, evaluated on that SAME selected column, satisfies

    |c*E c|≤C N L^(3/4)||E||₂.

A sufficient o(1) threshold is ||E||₂=o(N^(-1)L^(-3/4)). Uniform entrywise errors incur another dimension factor, giving the sufficient threshold o(N^(-2)L^(-3/4)). These are basis-specific sufficient estimates, not claims that a known theta approximation achieves them.

Relative o(Δ_n) accuracy also requires the unknown factor Δ_n/A_n and a separately established positive Δ_n. Polynomial conditioning does not supply either.

If the source matrix is perturbed and the polynomial is reselected, additional control is needed. The note gives precise Schur-value, selected-vector, and derivative-form estimates. For instance, relative source error η<1 gives

    X[P_tilde−P]/A ≤ η²/(1−η²).

Transferring an already-proved small derivative value is weaker than requiring a uniform small quadratic error; both cases are distinguished explicitly.

The favorable natural trial bounds and new source floor give only

    H[M_n*]/A_n ≤ C N L^(7/4).

This is a growing upper estimate for the trial under selected normalization, not an upper bound on H[P_n]/A_n. It does not transfer the favorable trial ratio to the selected polynomial.

## Remaining precise obstruction

Only the far exterior is removed by (1). The actual selected source and signed contributions inside |t|≤(12/π)n remain uncontrolled. No actual operator approximation satisfying the new transfer thresholds, no selected-only signed cancellation bound, and no lower bound at the relative Schur-excess scale are established. The target H[P_n]/A_n→0, relative U_n/Δ_n limit, defect positivity, and RH remain open.

## Files

- `LINEAR_DEGREE_RANGE_TAIL.md`: independently audited full all-degree tail proof and exact cell limitation.
- `ALGEBRAIC_SELECTED_ROW_OBSTRUCTION_AUDIT.md`: independently audited proof, including the general-reference improvement from s>3/2 to s>5/4.
- `SELECTED_FORM_ERROR_TRANSFER_THRESHOLDS.md`: full finite-dimensional transfer and reselection lemmas, with coordinate and arithmetic dependencies.
- `AUDIT.md`: parent cross-checks and preservation boundary.
- `SHA256SUMS`: hashes of the five deliverable payloads.

These are AI-assisted analytic results with independent AI-assisted audits, not external peer review or machine formalization. No literature-novelty claim is made.
