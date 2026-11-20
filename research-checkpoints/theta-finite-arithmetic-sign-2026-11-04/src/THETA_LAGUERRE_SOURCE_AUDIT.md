# Actual-theta sign mechanisms: source and quantifier audit

2026-11-04. This is an audit of theorem scope and the exact connection to the specified quadratic form, not an independent validation of every computer certificate in the recent preprints. No selected coherence or RH conclusion is obtained.

## Finding

None of the inspected results supplies the requested selected estimate H[P_n]/A_n → 0, or an all-degree sign theorem for the full mixed-term form Q=X−H. There is a precise reason the latter would be substantial: positivity of Q on **all** polynomials is equivalent to the global first Laguerre inequality for Xi. A vanishing, degree-uniform all-vector negative-error bound for the arithmetic approximation would already imply that global inequality. A selected-column estimate is a different and potentially weaker route.

## 1. Exact bridge to the full signed form

Use exactly the supplied normalization F=Xi, X[p]=∫|Fp′+2F′p|², and H[p]=∫|Fp′|² over the real line. Put

    L(t)=F′(t)²−F(t)F″(t).

For every complex polynomial p, expansion and integration by parts give

    Q[p]=X[p]−H[p]
        =4∫F′²|p|² + 2∫FF′(|p|²)′
        =2∫L(t)|p(t)|² dt.                                      (1)

The boundary term vanishes because F and its fixed derivatives have exponential decay times polynomial factors. Equation (1) retains every polynomial coefficient cross term and every arithmetic theta cross term; it is not diagonal dominance or termwise positivity.

Consequently, for the monic X-minimizer P_n with A_n=X[P_n],

    H[P_n]/A_n = 1 − 2∫L|P_n|²/A_n.                             (2)

Even hypothetical global L≥0 would only give H[P_n]/A_n≤1. The desired limit requires the normalized integral in (2) to approach 1/2, not merely to be nonnegative.

### Universal polynomial positivity is exactly global L≥0

The implication L≥0 ⇒ Q[p]≥0 is immediate. For the converse, let dν=|L(t)|dt. Stirling estimates in a fixed vertical strip, together with polynomial bounds for zeta and its fixed derivatives, show that ν has an exponential moment: ∫exp(a|t|)dν<∞ for every a<π/2. Polynomials are therefore dense in L²(ν).

For completeness, if g∈L²(ν) is orthogonal to every polynomial, the finite measure gν has an exponential moment with a smaller exponent by Cauchy–Schwarz. Its bilateral Laplace transform is analytic near the imaginary axis and has every derivative zero at zero. Analytic continuation and uniqueness of the Fourier transform imply gν=0. This proves density. Approximate the indicator of any negative-L set by polynomials in L²(ν); their squared absolute values converge in L¹(ν). Thus positivity of (1) for all polynomials excludes any negative-L set. Continuity then gives L≥0 everywhere.

This argument concerns the union of **all** polynomial spaces, not the single selected polynomial P_n at each degree. Since L is even, the full conclusion also follows from simultaneous positivity on the even and odd blocks.

## 2. What the inspected sources actually provide

### A. Sra, 2 November 2026

[On some positivity properties of the Riemann Xi function, arXiv:2611.02944v1](https://arxiv.org/html/2611.02944v1), Theorems 1.2–1.3 and Lemma 4.2:

- Theorem 1.2 concerns the reciprocal-transform densities Θ and Λ, not the theta source ψ. It states PF positivity only through the fixed order 1,810,540,931,075, using finite verified-zero input.
- Theorem 1.3 covers **every** Laguerre order, but only |t|≤T−1/2 when all zeta zeros through height T are on the line. The paper uses T=3·10¹².
- The proof groups canonical-product factors. A nonreal pair a±ib contributes, with u=t−a and Y=y²,

      (u²+b²)² + 2(u²−b²)Y + Y².

  Its coefficients are nonnegative when |u|≥|b|. Critical-strip width and finite zero verification supply precisely this exclusion region. The elementary factor step and its quantifiers check out; this does not audit the separate 53-page PF argument.
- The introduction explicitly leaves global first-Laguerre positivity open. The large PF bound is finite; the all-Laguerre-order result is finite-height. Neither controls the selected ratio.

### B. Planat–Solé, 19 August 2026

[Second-Level Concavity of the Riemann Xi Kernel, arXiv:2608.19160v1](https://arxiv.org/html/2608.19160v1), Theorem 1.1 and Sections 7–8:

The stated result is (log f)″<0 on t>0, with s(t)=Φ(√t) and f=s′²−ss″. The source normalization here satisfies ψ(u)=2Φ(u/2). Their f is therefore neither F nor L(t) in (1). The paper gives two continuations from a common local interval certificate: a first-theta-term/tail argument and a differential-equation argument. Its stated consequence is the double Turán inequality for normalized Taylor coefficients. This is a fixed second level of the coefficient hierarchy, although it applies at every coefficient index.

The theorem does not assert positive definiteness of the associated K₁ kernel, global L₁[Xi]≥0, or positivity of the arbitrary polynomial quadratic form (1). The certificate source and outputs are supplied, but were not executed in this audit. Even accepting the theorem exactly as stated supplies no missing implication to selected coherence.

### C. Csordas, revised 21 February 2014

[Fourier transforms of positive definite kernels and the Riemann ξ-function, arXiv:1309.0055v2](https://arxiv.org/html/1309.0055v2), Theorems 3.5, 3.7, 4.5–4.6 and Open Problems 3.9, 4.7, 4.14:

For the full Fourier convention, the canonical kernels are

    K_j(v)=∫ψ(s+v)ψ(s−v)s^(2j) ds.

Log-concavity gives admissibility of these kernels, not their positive definiteness. The Fourier relation at j=1 is

    L₁[F](t)=4∫K₁(v)cos(2tv) dv.

Thus K₁ positive definite is precisely the spectral sign needed in (1). Positive definiteness of every K_j characterizes the entire generalized-Laguerre hierarchy; for Xi that hierarchy is equivalent to RH. The source explicitly separates K₀, whose positivity is automatic, from the harder K₁ question. Merely knowing that K₁(v)>0 or decreases does not make its cosine transform nonnegative. The second-level concavity question later addressed by Planat–Solé is a separate Open Problem 4.14, not the K₁ problem.

### D. Additional recent all-order claim does not change the target

[Liu–Mao, Infinite log-concavity of the Taylor coefficients of the Riemann xi-function, arXiv:2610.04972v1](https://arxiv.org/html/2610.04972v1), Theorem 1.1, states strict positivity of every iterate of the discrete operation a_n↦a_n²−a_(n−1)a_(n+1), for the Taylor coefficients λ_n of ξ(1/2+√x). It is genuinely all coefficient indices and all iteration orders, so it should not be described as merely finite-order. Nevertheless those iterated nonlinear coefficient inequalities are not arbitrary mixed polynomial Q positivity, nor selected derivative decay. This audit checked the statement and definitions, not its 60-page computer-assisted proof.

## 3. Why finite-height positivity does not close the selected problem

Fix R=T−1/2 in the verified region. Define L_−=max(−L,0). For any p,

    Q[p] ≥ 2∫_(|t|≤R)L|p|² − 2∫_(|t|>R)L_−|p|².             (3)

The first integral has a valid sign. The second is still needed, with the selected normalization A_n, on the unbounded-degree sequence. A fixed enormous R cannot be silently replaced by R_n→∞, and fixed-degree tail smallness is not degree-uniform selected tail smallness. Even eliminating the negative tail would provide a sign, not the asymptotic value in (2).

## 4. Growing arithmetic truncations: a useful obstruction theorem

Use the corrected construction and relative errors from

    ../theta_finite_arithmetic_reduction_20261104/UNIFORM_FINITE_ARITHMETIC_AUDIT.md.

Suppose M=M(n), δ_n→0, and for every deg p≤n,

    |X_M[p]−X[p]|≤δ_n X[p],
    |H_M[p]−H[p]|≤δ_n X[p].

If one additionally proves the all-vector estimate

    Q_M[p]≥−ε_n X_M[p],       ε_n≥0, ε_n→0,                    (4)

then

    Q[p]≥−[2δ_n+ε_n(1+δ_n)]X[p]       (deg p≤n).               (5)

Fix any polynomial p and let n→∞. Equation (5) yields Q[p]≥0. Section 1 then gives global L₁[Xi]≥0. Therefore even an asymptotically vanishing universal negative-defect allowance in the normalized arithmetic matrices imports the global first-Laguerre problem. Exact PSD is not needed for this implication.

There is no analogous fixed-p limiting argument when (4) is known only on the reselected column P_n^M: those vectors vary with n. That is why a genuinely selected sign/cancellation estimate is not interchangeable with an all-vector positivity claim.

## Conclusion and remaining input

The actual-theta mechanism identified in the literature is the positive-definiteness question for K₁, or equivalently the full real-line first-Laguerre sign. It remains an additional theorem, not a consequence of theta positivity, second-level concavity, reciprocal-law finite PF, or fixed-height all-order Laguerre positivity. For the requested selected decay, the missing input is stronger in a different direction: a normalized selected estimate forcing the integral in (2) to 1/2, or an equivalent direct selected H bound. No inspected source supplies it.
