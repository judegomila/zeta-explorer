# Uniform finite-arithmetic reduction of the actual signed forms

2026-11-04. This package supplies a noncircular, all-degree approximation theorem for the exact theta source and derivative forms. It retains all arithmetic cross terms and meets the previously identified operator-error thresholds. It does not prove the remaining signed cancellation or RH.

## Theorem

Let

    Tp=Fp'+2F'p, X[p]=∫|Tp|², H[p]=∫|Fp'|²,
    N=n+2.

For every fixed A>0, there is a fixed K_A such that a theta cutoff

    M_n=ceil(K_A sqrt(N log N))

produces explicit finite positive-semidefinite forms X_M,H_M with

    |X_M[p]−X[p]| ≤ exp(−A N log N) X[p],
    |H_M[p]−H[p]| ≤ exp(−A N log N) X[p]

simultaneously for every polynomial of degree at most n. Equivalently these are operator errors measured relative to the actual source Gram, not uncorrelated scalar-moment error bars. For a sufficiently small advertised error, X_M is positive definite.

The constants are independent of n and p, but this package does not provide a numerical value of K_A. A fixed cutoff M independent of n is not asserted to work for all degrees.

## Construction and domain

On u≥0, use the exact theta series ψ(u)=Σ_m φ_m(u). For each derivative order separately, keep m≤M and reflect with the true derivative parity:

    D_k^M(u)=sgn(u)^k Σ_(m≤M) φ_m^(k)(|u|), u≠0.

For p(t)=Σ b_k t^k form

    f_M=Σ b_k(−i)^k D_k^M,
    h_M=Σ_(k≥1) k b_k(−i)^(k−1)D_(k−1)^M,
    g_M=−2iu f_M−h_M,
    X_M=2π||g_M||², H_M=2π||h_M||².

The coefficient k in h_M is essential.

These D_k^M are piecewise approximations to the actual derivatives, not weak derivatives of a single reflected truncated kernel. This distinction avoids artificial delta terms at u=0. In particular X_M is not asserted to be the source form of the Fourier transform of D_0^M. The finite forms must be used as defined.

## Exact arithmetic and mixed terms

Every matrix entry is a finite sum over ALL pairs 1≤m,ℓ≤M. After x=e^(2u), the integrals are

    ∫_1^∞ x^α(log x)^r exp[−π(m²+ℓ²)x]dx, r=0,1,2,

which equal parameter derivatives of an upper incomplete-gamma expression. No m≠ℓ term, source mixed term, parity factor, or Plancherel constant is discarded.

Fixed-strip Cauchy estimates give a remainder uniform in derivative order k and cutoff M. Polynomial coefficient control relative to X then turns the finite-series remainder into a uniform operator estimate. The argument does not infer matrix accuracy merely from scalar asymptotics.

## Fully selected consequence

Let P_n and P_n^M minimize X and X_M in the same monic affine space, with minima A_n,A_n^M. Then

    A_n^M/A_n = 1 + O(exp(−c N log N)),
    H_M[P_n^M]/A_n^M − H[P_n]/A_n
         = O(exp(−c N log N)),

after choosing the cutoff constant for the desired rate. Thus the actual selected derivative/source decay is equivalent to decay for this explicitly growing finite arithmetic model. This equivalence includes reselection; it does not freeze the actual column while changing its matrix.

The difficult sign or cancellation of X_M−H_M remains unproved. A finite special-function formula is not a numerical sign certificate or an all-degree sign proof. The sharper relative Schur-defect task also requires control of the second minimum and a positive lower defect scale; neither is supplied by absolute source-relative accuracy.

## Files and scope

- `UNIFORM_FINITE_ARITHMETIC_AUDIT.md`: full independent proof, derivative recurrence, finite matrix formulas, operator estimates, and reselection argument.
- `AUDIT.md`: cross-checks and precise preservation boundary.
- `SHA256SUMS`: hashes of the three deliverable payloads.

No numerical scan was run, no exact theta function was replaced in the proof, and no prior frozen file or live 4CT file was edited. These are AI-assisted analytic results with independent AI-assisted checks, not external peer review or machine formalization. No literature-novelty claim is made.
