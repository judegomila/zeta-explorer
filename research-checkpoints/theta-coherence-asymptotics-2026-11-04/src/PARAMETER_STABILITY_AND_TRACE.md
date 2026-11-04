# Actual-theta parameter stability and a trace-to-diagonal criterion

Date: 2026-11-04. Status: independent algebra/domain audit PASS (AI-assisted, not peer review); proved finite-dimensional identities and conditional asymptotic criteria; the actual-theta asymptotic hypotheses below remain unproved. No actual-selected counterexample is claimed.

## 1. Domain and finite old-prefix hypothesis

Keep the exact real entire theta transform F, w=F², V=2(F′²−FF″), H[p]=∫w p′², and X[p]=H[p]+∫V p². All integrals are over the whole real line, including every real Xi zero. Polynomial moments exist by the exponential decay established in the prior reduction. No division by F, w, or V occurs anywhere below.

Fix parity and degree n. Let E be the full lower same-parity polynomial prefix. Assume only Q=X−H is positive definite on E. X is positive definite on every finite polynomial space independently of this assumption. Let P_n be the monic X-orthogonal representative, A_n=X[P_n]>0, and q_n=P_n/√A_n.

For 0≤λ≤1 define

m_n(λ)=min_{p monic, deg p=n, chosen parity} {Q[p]+λH[p]}.

The minimizer exists uniquely: the quadratic part on E is Q+λH>0. This remains true even when m_n(λ) is negative. In particular, m_n(0) is the signed new Q pivot; its definition must NOT be described as a positive squared norm. At λ=1, m_n(1)=A_n.

## 2. Exact backward-perturbation identity

Choose an X-orthonormal basis of E and append q_n. In that basis let the positive semidefinite H matrix be

[ K  b ]
[ bᵀ h ],

where h=H[P_n]/A_n. The finite old-prefix assumption says 0≤K<I. For 0<δ<1, completing the square in the old coordinates gives exactly

m_n(1−δ)/A_n = 1−δh−δ² bᵀ(I−δK)⁻¹b.                     (1)

This is valid without assuming positivity on the enlarged block or on its new perturbed pivot. Cauchy–Schwarz for H gives |bᵀu|²≤h uᵀKu. Thus ||b||²≤h and, more precisely, b belongs to the range of K and bᵀK†b≤h. Consequently

δh ≤ 1−m_n(1−δ)/A_n ≤ δh/(1−δ).                           (2)

Therefore, under the stated finite old condition, relative stability at a fixed δ is EQUIVALENT to diagonal derivative-energy decay. It is a useful alternate analytic target, but is not evidence for that decay by itself.

The endpoint δ=1 is deliberately excluded: although I−K is invertible at each fixed degree, its inverse can grow without bound as the old generalized gap shrinks.

## 3. Quantitative conditional coherence theorem

Suppose, at degrees under consideration, an independently proved estimate gives

m_n(1−δ) ≥ (1−ε_n)A_n,  0≤ε_n<δ.

Then (2) yields h≤ε_n/δ<1. With B_n=n²||π_(n−1)||²_w for n≥1 and B_0=0, the derivative projection identity gives 0≤B_n≤H[P_n] and U_n=H[P_n]−B_n. Therefore

Δ_n=A_n−B_n≥A_n−H[P_n]>0,
U_n/Δ_n=(h−β)/(1−β)≤h≤ε_n/δ,  where β=B_n/A_n∈[0,h].      (3)

In particular ε_n→0 proves U_n/Δ_n→0. The positivity of Δ is a CONCLUSION here, not a premise. The new Q value Q[P_n]=A_n−H[P_n]>0 is likewise a conclusion of the extra quantitative hypothesis.

This still does not establish the amplitude constant involving √ρ_n. For that one needs a rate, for example ε_n/δ≤(11/20)√ρ_n.

## 4. Explicit actual-theta determinant target

Let μ_k=∫t^k F² and d_k=∫t^k F′². Integration by parts yields

∫t^k V=4d_k−k(k−1)μ_(k−2).

For same-parity monomial indices i,j the exact Gram matrix of Q+λH is

G_λ(i,j)=4d_(i+j)−[(i+j)(i+j−1)−λij]μ_(i+j−2),             (4)

where a zero coefficient removes any negative-index moment. This avoids singular zero-dependent weights.

Let D_N(λ) be the determinant on the first N parity monomials, with D_0(λ)=1. For new degree n=ε+2(N−1), the old prefix has dimension N−1. Schur complementation gives

m_n(λ)=D_N(λ)/D_(N−1)(λ).

The old determinant D_(N−1)(λ) is strictly positive for λ∈[0,1]; D_N(λ) may be negative or zero. Thus the concrete missing theorem is the strong adjacent-determinant comparison

D_N(1−δ)D_(N−1)(1) / [D_(N−1)(1−δ)D_N(1)] = 1+o(1),       (5)

with a quantitative one-sided error if the amplitude rate is sought. Formula (5) requires neither RH nor a sign assumption on V as an input.

A valid strong leading-coefficient theorem, where the perturbed form is positive, would be equivalent: if c_n(λ)=m_n(λ)^(−1/2), one needs c_n(1−δ)/c_n(1)→1. An n-th-root theorem is insufficient: multiplying a positive monic norm by any fixed c≠1 changes its n-th root by c^(1/n)→1, while its relative change remains nonzero. Likewise, o(n) errors in log monic norms and o(N²) errors in log determinants do not control (5).

Entrywise moment asymptotics in (4) alone do not justify (5). The determinants involve cancellation and growing dimension; a relative matrix error or an adequately precise determinant expansion is needed.

## 5. A distinct trace-plus-regularity sufficient hypothesis

There is a potentially weaker analytic program than proving every adjacent ratio (5) directly. Index the X-orthonormal polynomials in one parity by j=0,1,... and put h_j=H[q_j]≥0. Define the full-prefix Gram determinants using any fixed monomial basis.

For s>0 the form X+sH is globally positive, irrespective of the sign of Q. If K_N is the H matrix on the first N X-orthonormal polynomials, then

log(D_N(X+sH)/D_N(X))=log det(I+sK_N),
Tr K_N=Σ_(j<N) h_j.

To turn determinant growth into trace control one additionally needs a spectral upper bound. Under Q>0 on that full prefix, 0≤K_N<I and hence

log(1+s) Σ_(j<N)h_j ≤ log det(I+sK_N) ≤ s Σ_(j<N)h_j.       (6)

Thus the actual-theta hypothesis log det(I+sK_N)=o(N), together with positivity of the applicable prefix, gives Cesàro decay N^(−1)Σh_j→0. This implies density-one diagonal decay, NOT decay at every degree.

An explicit additional regularity hypothesis that upgrades it is:

For some C and all sufficiently large j, h_(j+1)≥(1−C/j)h_j. (7)

If h_j=0 the inequality is harmless. For n large and n≤j≤2n, iteration gives h_j≥c_C h_n with a fixed c_C>0. Therefore n c_C h_n≤Σ_(j=n)^(2n)h_j=o(n), giving h_n→0. Equation (3) then gives coherence.

Conditions (6)'s sublinear determinant response and (7) are both explicit UNPROVED actual-selected hypotheses. No compactness of the derivative map or uniform polynomial estimate is asserted. Nor is an infinite run of old-prefix positivity silently supplied: the trace argument must only be used where the necessary entire prefix is known positive. Applying this program to an infinite sequence needs those positivity assumptions or a separate spectral bound, and cannot be claimed from a single finite old prefix.

## 6. Source check and present boundary

The existing positive exponential-weight Sobolev theorem does not provide (5) for the signed theta pair, as detailed in the prior literature-transfer audit. A separate search found results on weak zero distributions and logarithmic norm asymptotics, but not the required actual-theta strong adjacent-determinant estimate:

- Geronimo–Lubinsky–Marcellán, primary author PDF: https://lubinsky.math.gatech.edu/Research%20papers/GeronLubMarcJune04.pdf
- Zeros and logarithmic asymptotics of Sobolev orthogonal polynomials for exponential weights, author repository: https://e-archivo.uc3m.es/bitstreams/dede5e85-5a3d-4fae-99b8-a2f59bb6ec3f/download
- Romik, orthogonal expansions of Xi in classical bases (not polynomials orthogonal for Xi² or this Sobolev form): https://arxiv.org/abs/1902.06330

The exact new result is (1)–(2), including the equivalence and signed-pivot domain, plus the separate conditional trace-to-diagonal theorem. None supplies the missing actual-theta asymptotic estimate. A proof of (5), or the determinant response plus selected-polynomial regularity above, would suffice for coherence; these are stronger sufficient routes, not necessary conditions.

## 7. Sharper direct criterion: stability of the excess over the Y minimum

This refinement targets derivative coherence itself, rather than the stronger sufficient condition H[P_n]/A_n→0.

Retain the normalized X basis and H block matrix of Section 2. The derivative image of the old prefix is exactly the lower same-parity polynomial space below degree n−1. Orthogonal projection in L²(w) therefore gives

u:=bᵀK†b=U_n/A_n,   h−u=B_n/A_n.                          (8)

Here K† is the finite-dimensional Moore–Penrose inverse. The positive semidefiniteness of the full H block implies b∈Ran K. The constant kernel in the even prefix is thus harmless. Equation (8) is just the finite projection formula and does not divide by F or w. For example, minimizing H[q_n−Σc_jq_j] over c gives h−bᵀK†b=B_n/A_n; the complementary projection norm is u.

Define the parameterized excess

E_n(δ):=m_n(1−δ)−(1−δ)B_n,   E_n(0)=Δ_n.

Subtracting the exact Schur identity (1) and using (8) gives

Δ_n−E_n(δ)=δU_n+δ²A_n bᵀ(I−δK)⁻¹b.                     (9)

Put κ_n=λ_max(K)<1 (take κ_n=0 for an empty old prefix). Diagonalizing K on its range yields

bᵀ(I−δK)⁻¹b ≤ [κ_n/(1−δκ_n)] bᵀK†b.

Consequently, for every fixed 0<δ<1,

δU_n ≤ Δ_n−E_n(δ) ≤ δU_n/(1−δκ_n) ≤ δU_n/(1−δ).         (10)

For a nonempty old prefix, if the original gap is normalized as ρ_n=min_E Q[p]/X[p], then κ_n=1−ρ_n, and the middle denominator is 1−δ(1−ρ_n). If a different generalized-gap normalization is used, (10) with κ_n is the invariant statement; no normalization conversion should be silently assumed.

When Δ_n>0, dividing (10) gives the equivalence

E_n(δ)/Δ_n→1  if and only if  U_n/Δ_n→0.                  (11)

More quantitatively, if E_n(δ)≥(1−η_n)Δ_n, then U_n/Δ_n≤η_n/δ. Conversely U_n/Δ_n≤r_n implies 0≤1−E_n(δ)/Δ_n≤δr_n/(1−δκ_n). The resolvent norms ||(I−δK)⁻¹|| are bounded by 1/(1−δ), independently of the shrinking old gap. No positivity of the new perturbed pivot m_n(1−δ), E_n(δ), or the enlarged Q form is assumed for (8)–(10). The condition Δ_n>0 is needed only for the ratio statement (11), and is not itself proved by (9).

This criterion handles exact derivative coherence U_n=0: then b=0 and E_n(δ)=Δ_n identically, even when h_n does not tend to zero. Thus it avoids the unnecessary stronger requirement of Section 3.

The outstanding actual-theta asymptotic target is now precisely

D_N(1−δ)/D_(N−1)(1−δ) − (1−δ)B_n = Δ_n[1+o(1)].         (12)

Its error must be o(Δ_n), not merely o(A_n), and not merely an n-th-root error. Formula (12) is an exact-domain, zero-division-free reformulation, not an independent asymptotic theorem or new evidence that coherence holds. A proof of (12), with the required Δ positivity and eventually a rate tied to √ρ_n, is still missing.

These identities use standard finite-dimensional Schur algebra applied to the actual theta forms. No literature-novelty claim is made.
