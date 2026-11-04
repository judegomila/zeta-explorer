# Uniform finite-arithmetic reduction for the actual theta source

2026-11-04. Independent analytic audit. The reduction is valid with the derivative coefficient specified explicitly below. This is a source-relative approximation theorem, not a defect-sign theorem. No existing frozen file is changed.

## 1. Normalization and the necessary correction

Use F(t)=∫ψ(u)e^(−itu)du, T p=Fp′+2F′p, X[p]=∫|Tp|² and H[p]=∫|Fp′|². On u≥0 the exact even theta kernel has the supplied series ψ(u)=Σ_{m≥1}φ_m(u), where

    φ_m(u)=2[2π²m⁴e^(9u/2)−3πm²e^(5u/2)] exp(−πm²e^(2u)).

For u≠0 and k≥0 put D_k^M(u)=sgn(u)^k Σ_{m=1}^M φ_m^(k)(|u|). Values at the single point zero are immaterial. For p(t)=Σ_{k=0}^n b_k t^k define

    f_M = Σ_{k=0}^n b_k (−i)^k D_k^M,
    h_M = Σ_{k=1}^n k b_k (−i)^(k−1) D_{k−1}^M,
    g_M = −2iu f_M − h_M.

**The factor k in h_M is necessary.** An abbreviated summation notation in the initial handoff was ambiguous about this coefficient. If it were omitted, p=t² would already give a nonvanishing error as M→∞, since the approximate h would converge to only half the correct h. All claims below use the explicit formula displayed above.

The exact counterparts are f=p(−iD)ψ, h=p′(−iD)ψ and g=−2iu f−h. Their Fourier transforms are Fp, Fp′ and Tp respectively. In particular X=2π||g||₂² and H=2π||h||₂². The minus sign in the source follows from the commutator: Fourier(−2iu f)=2(Fp)′, so subtraction of Fp′ leaves Tp.

The D_k^M are independent piecewise functions approximating the true derivatives. They are NOT asserted to be weak derivatives of D_0^M. A reflected finite sum usually has derivative jumps at zero; distributional differentiation would introduce boundary distributions and invalidate the construction. The present L² definition neither uses nor needs such an identity. Consequently X_M below need not equal a source form constructed by differentiating the Fourier transform of D_0^M.

## 2. Uniform derivative remainder

Fix 0<r<π/4, and write R_M(z)=Σ_{m>M}φ_m(z), using the positive-half-line analytic expression. For real u≥0 and |z−u|≤r,

    Re(e^(2z)) ≥ e^(2u−2r) cos(2r).

Put x=e^(2u)≥1. The two absolute prefactors are bounded, up to constants depending only on r, by (m²x)^(9/4) and (m²x)^(5/4). Indeed the residual factor is m^(−1/2)≤1. Absorbing these powers into a smaller exponential gives

    |φ_m(z)| ≤ C exp(−a m²x)

for fixed C,a>0. Uniform convergence on the disks follows. Splitting the exponent and using x≥1 gives, for every integer M≥1,

    Σ_{m>M} exp(−a m²x) ≤ C exp(−d M²x).

Cauchy's formula therefore proves, simultaneously for every k≥0,

    |R_M^(k)(u)| ≤ C k! r^(−k) exp(−d M²e^(2u)).                 (1)

The disk is permitted to extend to Re z<0 when u is near zero: the same elementary positive-series bound still holds there. No analytic continuation of a reflected finite sum is used. Evenness of the exact kernel yields, almost everywhere on the full real axis,

    |ψ^(k)(u)−D_k^M(u)| ≤ C k! r^(−k) exp(−d M²e^(2|u|)).       (2)

These constants are independent of k,M,u and the polynomial degree.

## 3. Source-relative polynomial coefficient control

Set N=n+2 and L=log N. The audited natural-reference comparison supplies

    ||p||_(W*)² ≤ C N L^(3/4) X[p],
    W*(t)=|Γ(9/4+it/2)|².

This extends to complex polynomials by splitting real and imaginary parts, since F and F′ are real on the real axis. The weight W* has a fixed positive minimum on [−1,1]. Expansion in the orthonormal Legendre polynomials on that interval gives

    Σ_{k=0}^n |b_k| ≤ C exp(Cn)||p||_(W*).

For completeness, the Legendre coefficients have Euclidean norm ||p||_{L²[−1,1]}; each degree-j normalized Legendre polynomial has monomial coefficient sum at most C√(j+1)C₀^j, directly from its explicit coefficient formula. Cauchy–Schwarz in j proves the stated exponential bound. Thus

    Σ |b_k| ≤ C exp(Cn) N^(1/2)L^(3/8) sqrt(X[p]).               (3)

Combining (2), (3), k!≤n!, and the additional factor k in h_M gives

    |f−f_M|+|h−h_M|
      ≤ exp(C N log N) exp(−d M²e^(2|u|)) sqrt(X[p]).

Multiplication by 1+|u| is absorbed by reducing d, uniformly for M≥1. Integration then yields

    ||g−g_M||₂+||h−h_M||₂
      ≤ exp(C₁ N log N−c₁M²) sqrt(X[p]).                        (4)

For example, ∫₀∞exp(−aM²e^(2u))du≤C exp(−aM²/2), sufficient for (4). All constants are independent of n,M,p. No claim that polynomial coefficient norms are uniformly well conditioned in raw monomial coordinates is needed.

## 4. Quadratic forms and relative operators

Define positive-semidefinite forms

    X_M[p]=2π||g_M||₂²,       H_M[p]=2π||h_M||₂².

The existing audited derivative bound is H[p]≤κ_n X[p], with κ_n≤C N²L^(7/4). This sharper polynomial bound imports the favorable-family derivative diagonal estimate. The cruder elementary bound κ_n≤C N⁴L^(3/4) also suffices for every conclusion below, so no derivative-moment theorem is essential to the reduction itself. Neither bound is selected derivative decay. Let ε=exp(C₂N log N−c₂M²), enlarging constants to absorb 2π in (4). The reverse triangle inequality gives

    |X_M[p]−X[p]| ≤ (2ε+ε²)X[p],
    |H_M[p]−H[p]| ≤ (2√κ_n ε+ε²)X[p].                          (5)

Hence for every desired fixed A>0 there is a fixed K_A such that choosing

    M=ceil(K_A sqrt(N log N))

makes both right-hand-side multipliers at most exp(−A N log N), simultaneously for every polynomial of degree at most n. Fixed constants can cover all n≥0. A generic unspecified K does not establish a desired rate; K must dominate the constants in (4). This is superexponential in n, in the precise sense exp(−A N log N).

In any common coordinate basis let G,J,G_M,J_M represent X,H,X_M,H_M. Since X is positive definite, (5) is equivalent to

    ||G^(−1/2)(G_M−G)G^(−1/2)||₂ ≤ δ_n,
    ||G^(−1/2)(J_M−J)G^(−1/2)||₂ ≤ δ_n,

with δ_n=exp(−A N log N) after choosing K_A. This is source-relative operator accuracy; it is not relative accuracy with respect to the possibly singular derivative form J. In particular H and H_M both have the constant-polynomial nullspace. Once δ_n<1, G_M is positive definite.

## 5. Finite incomplete-gamma representation, retaining all cross terms

On u>0 put x=e^(2u), λ_m=πm² and a∈{9/4,5/4}. Define polynomials R_{0,a}(y)=1 and

    R_{k+1,a}(y)=2(a−y)R_{k,a}(y)+2y R′_{k,a}(y).

Direct differentiation gives

    φ_m^(k)(u)=2e^(−λ_m x)
      [2λ_m²x^(9/4)R_{k,9/4}(λ_m x)
       −3λ_m x^(5/4)R_{k,5/4}(λ_m x)].

The R polynomials have degree k and rational coefficients. Every entry of G_M and J_M is therefore a finite sum over ALL ordered pairs 1≤m,l≤M of integrals

    I_(α,r)(β)=∫₁∞x^α(log x)^r e^(−βx)dx,
    β=π(m²+l²),       r=0,1,2.

Here α comes from the two powers, integer polynomial powers and the Jacobian du=dx/(2x); u=(log x)/2 accounts for r. In particular α≥3/2, so no integrability issue occurs. The exact evaluation is

    I_(α,r)(β)=∂_α^r[β^(−α−1)Γ(α+1,β)],

where Γ(s,β) is the upper incomplete gamma function and β>0. Rational factors, powers of π,m,l, phase factors and the factors 2π from Plancherel must be retained. Negative u is included using the prescribed derivative parity. Matrix entries connecting opposite polynomial parities vanish; this can simplify the sum but does not justify removing arithmetic m≠l cross terms.

“Finite arithmetic reduction” here means finitely many explicit special-function values and derivatives, followed by finite-dimensional linear algebra. It does not mean the entries are rational/algebraic numbers, nor does it by itself provide a certified floating-point implementation, bit-complexity estimate or sign certificate. Exact special-function formulas can suffer cancellation under numerical evaluation. Certified numerical signs would require controlled evaluation and error propagation in suitable normalized coordinates.

## 6. Reselected minima and limits of the result

Let P_n and P_n^M be the monic minimizers for X and X_M in the same full or parity-restricted affine space, with minima A_n,A_n^M. Relative source control immediately gives

    |A_n^M/A_n−1|≤δ_n.

The quantitative reselection lemma in the supplied transfer note gives source-norm displacement at most δ_n/sqrt(1−δ_n²), after division by sqrt(A_n). Applying its target-form estimate with κ_n≤C N²L^(7/4), and adding the relative target error in (5), proves

    |H_M[P_n^M]/A_n^M − H[P_n]/A_n|
      ≤ C(1+κ_n)δ_n

when δ_n≤1/2. Increasing K or decreasing the advertised exponent absorbs this polynomial factor, so the reselected derivative/source ratios have exp(−c N log N) absolute error. This does not imply either ratio tends to zero. The same principle applies to any target with independently bounded source-relative operator norm; no unsupported target norm is assumed.

No sign or coherence statement follows for Q_M=X_M−H_M. One gets |(X_M−H_M)−(X−H)|≤2δ_n X, not accuracy relative to a potentially much smaller defect. A Schur defect Δ=A−B requires separately appropriate control of B, including its quotient/domain if a derivative nullspace is present, and a positive lower scale for Δ to obtain relative error. Neither Δ>0 nor such a scale is provided here.

## Inputs and audit verdict

The source comparison and complex extension used above are from ../theta_polynomial_comparison_20261104/GENERAL_REFERENCE_AND_NATURAL_COROLLARIES.md. The polynomial H/X bound and reselection lemma are from ../theta_polynomial_selected_obstruction_20261104/SELECTED_FORM_ERROR_TRANSFER_THRESHOLDS.md, especially Sections 1 and 5. The theta series and Fourier convention agree with the cited source package's prior theta input.

**Verdict:** The corrected piecewise-derivative construction gives the claimed uniform finite-arithmetic source-relative reduction, with all arithmetic cross terms retained and M=O(sqrt(N log N)). The explicit factor k in h_M is essential; the proof must not use a formula without it. The result supplies no selected cancellation, defect sign, relative-defect accuracy, 4CT conclusion or RH conclusion.
