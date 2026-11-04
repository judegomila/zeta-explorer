# Exact boundary obstruction in the finite-theta signed form

2026-11-04. Independent analytic audit of the piecewise-derivative model in `../theta_finite_arithmetic_reduction_20261104/UNIFORM_FINITE_ARITHMETIC_AUDIT.md`. This note retains every arithmetic cross term. It does not replace the fully selected polynomial by a trial polynomial, and it proves no selected sign or decay statement.

## Result

For every finite cutoff M, the prescribed form Q_M = X_M − H_M is **not** an ordinary Hankel moment form. In particular, there is no scalar measure or distribution V_M for which Q_M(p,q) = <V_M,pq> for all polynomials. The first explicit obstruction is

    Q_M(t^4,1) − Q_M(t^3,t) = 8π r_M(0) r_M′(0) > 0.       (1)

Here r_M(u)=Σ_(m≤M) φ_m(u) on u≥0. The positivity in (1) is proved below, not inferred numerically. Thus applying the exact theta potential identity to the Fourier transform of the reflected finite sum discards a genuine boundary correction already at degree four.

The source Gram also fails its exact third displacement identity. An explicit boundary formula is derived below; for example,

    G^M_(4,0) − 4G^M_(3,1) + 3G^M_(2,2)
       = −16π r_M(0)r_M′(0) < 0.                         (2)

These defects are small when M grows at the audited cutoff scale, but their smallness supplies neither the sign of Q_M nor the selected derivative/source ratio. The exact full-theta structural identities already have no known mechanism yielding that ratio.

## 1. Half-line matrices with all cross terms

Write r=r_M and r_j=r^(j). Use real-polynomial polarization, with its Hermitian extension if required. For j+k even, put c_jk=(-i)^j i^k, which is real, and

    A_j(u)=2u r_j(u)+j r_(j−1)(u).

The second term is zero when j=0. Directly from the finite model,

    G^M_jk = 4π c_jk ∫_0^∞ A_j A_k du,
    J^M_jk = 4π c_jk jk ∫_0^∞ r_(j−1)r_(k−1) du,
    W^M_jk = 4π c_jk ∫_0^∞ r_jr_k du.                  (3)

W_M is the finite value form 2π||f_M||², not a Fourier weight asserted independently of the boundary correction. Entries with j+k odd vanish. Every product in (3) contains the complete double sum over m,l≤M, including m≠l.

Subtracting J gives

    Q^M_jk/(4π c_jk)
      = ∫_0^∞ [4u²r_jr_k
                 +2u(kr_jr_(k−1)+jr_(j−1)r_k)]du.      (4)

Integration by parts is legitimate on the half-line: r and all its derivatives decay faster than every exponential as u→∞. It does not assert that the piecewise functions D_j^M are global weak derivatives.

## 2. First Hankel defect and its strict sign

Equation (4) gives

    Q^M_(4,0)/(4π) = −4∫u²r_3r_1,
    Q^M_(3,1)/(4π) = −4∫u²r_3r_1 − 2r(0)r_1(0).

For the second identity use

    ∫u r_2r_1 = −(1/2)∫r_1²,
    ∫r_2r = −r(0)r_1(0) − ∫r_1²,
    ∫u r_3r = r(0)r_1(0) + (3/2)∫r_1².

This proves (1). With λ=πm², direct differentiation yields

    φ_m(0)=2λ(2λ−3)e^(−λ)>0,
    φ_m′(0)=λe^(−λ)(−8λ²+30λ−15).

For m≥2, λ≥4π>(15+sqrt(105))/8, so φ_m′(0)<0. The complete theta kernel is even and smooth, hence Σ_(m≥1)φ_m′(0)=0. Therefore, for every M≥1,

    r_M′(0)=−Σ_(m>M)φ_m′(0)>0,
    r_M(0)>0.

This establishes the strict sign without evaluating a special function or deleting cross terms. Since t^4·1=t^3·t, (1) excludes any representation Q_M(p,q)=<V_M,pq> valid for all polynomial pairs, even with signed V_M.

For comparison, the full even theta kernel has r′(0)=0, and its ordinary potential identity Q(p,q)=∫2(F′²−FF″)pq is compatible with the calculation. The finite model is not that Fourier-transform model.

## 3. Exact second and third displacement corrections

For an infinite array K define

    (ΔK)_jk=K_(j+1,k)−K_(j,k+1).

All formulas below are stated on the parity for which the entries involved can be nonzero. The remaining parity is identically zero. Let a_j=r_j(0).

The derivative identity

    A_j′=A_(j+1)+r_j

implies, by the binomial theorem,

    Σ_(s=0)^m binom(m,s) A_(j+s)A_(k+m−s)
      = D^m(A_jA_k)
        −m D^(m−1)(r_jA_k+A_jr_k)
        +m(m−1)D^(m−2)(r_jr_k).                       (5)

For m=1 omit the last term. After integration over u>0, (5) gives

    (Δ²G_M)_jk = −2W^M_jk
       +4π c_jk jk[a_j a_(k−1)+a_(j−1)a_k],           (6)

when j+k is even. A zero prefactor j or k removes any negative-index term.

For j+k odd it gives

    (Δ³G_M)_jk = −4π i c_jk B_jk,                     (7)

where

    B_jk = k(j+1)a_(j+1)a_(k−1)
           +(2jk+j+k+2)a_ja_k
           +j(k+1)a_(j−1)a_(k+1).                    (8)

Here i c_jk is real. The third displacement is skew-symmetric, as it must be. Setting j=1,k=0 yields (2).

For the complete theta source every product in the corrections (6) and (8) contains an odd jet, so it vanishes. The familiar identities Δ²G=−2W and Δ³G=0 are recovered exactly. For finite M those odd jets are small, not zero.

The matrix B before parity masking lies in the span of four outer-product vectors: a_j, ja_j, (j+1)a_(j+1), and ja_(j−1). Thus the boundary correction has bounded rank after splitting parity (at most eight), but bounded rank does not make it positive or harmless on a selected inverse column.

## 4. The Fourier-side correction is a polynomial, not optional

Let R_M(u)=r_M(|u|), and let F_M be its ordinary Fourier transform. Distributional differentiation gives

    D^k R_M = D_k^M
       +2 Σ_(odd j<k) a_j δ^(k−1−j).

Consequently

    Fourier[(-i)^k D_k^M](t)
       =t^k F_M(t)
          −2Σ_(odd j<k)(−1)^((j+1)/2)a_j t^(k−1−j).    (9)

Define the polynomial-valued linear map C_M by the sum subtracted on the right, extended linearly from t^k. Then, for an arbitrary polynomial p,

    Fourier(f_M)=F_Mp−C_Mp,
    Fourier(h_M)=F_Mp′−C_M(p′),
    Fourier(g_M)=F_Mp′+2F_M′p
                   −2(C_Mp)′+C_M(p′).                (10)

The cancellation in these expressions is necessary. Since a_1>0, repeated half-line integration by parts gives

    F_M(t)=−2a_1/t²+O_M(t^(−4))

on the real axis. Thus F_M times a high-degree polynomial is generally not square-integrable, even though each Fourier transform in (10) is. Expanding squared norms and integrating the pieces separately can introduce divergent terms. It is invalid to identify X_M with ||F_Mp′+2F_M′p||² or H_M with ||F_Mp′||² for general degree.

A further elementary warning is that the genuine potential associated with F_M has negative tails:

    2(F_M′²−F_MF_M″)=−16a_1²/t^6+O_M(t^(−8)).          (11)

This is not a negative direction theorem for Q_M: Q_M includes the corrections in (10), and the separate naive potential moments need not exist. It specifically rules out trying to prove positivity by treating the reflected finite Fourier transform as a Laguerre-positive surrogate.

## 5. Growing-cutoff scale and the remaining gap

The audited Cauchy remainder estimate implies for every odd j

    |a_j|≤C j! ρ^(−j)e^(−cM²),

whereas for every j the full even-kernel bound and that remainder imply

    |a_j|≤C j! ρ^(−j)

for a fixed ρ>0. Each boundary product above contains at least one odd jet on the relevant parity. Hence entries through degree n of (6) and (7) are bounded by

    exp(C(n+2)log(n+2)−cM²).

Combining the source-relative coefficient bound from the audit with the corresponding bilinear coefficient sum gives the same exponential form, with a larger C, as a bound on these boundary corrections relative to sqrt(X[p]X[q]). Choosing M=ceil(K sqrt((n+2)log(n+2))) with sufficiently large fixed K makes this exponentially small at any prescribed exp(−A(n+2)log(n+2)) rate.

This is a correction estimate, not a sign theorem. In particular:

- Exact finite-model Hankel or third-displacement identities are false.
- Their approximate recovery at the growing-cutoff scale is valid.
- Neither a small boundary operator nor restored exact structural identities yields H_M[P_n^M]/A_n^M=o(1).
- To conclude positivity from a perturbation one still needs a previously proved positive defect scale for the exact form, or a new direct signed estimate on the actual full selected vector.

No statement here substitutes a restricted minimizer, drops arithmetic cross terms, assumes the first Xi Laguerre inequality, or uses numerical positivity as proof.
