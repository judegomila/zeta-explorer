# Actual selected inverse-Gram columns cannot be uniformly stretched-exponentially localized

2026-11-04. Deterministic all-degree obstruction for the actual theta source. This concerns the selected polynomials themselves, not arbitrary favorable trial combinations. It neither proves nor disproves selected derivative coherence or RH.

## 1. Definitions and exact statement

Let F be the fixed real even theta transform in the preceding packages and define

\[
 Tp=Fp'+2F'p,\qquad X(p,q)=\int_{\mathbb R}(Tp)(Tq)\,dt,
 \qquad H[p]=\int_{\mathbb R}F^2(p')^2\,dt.
\]

The form X is positive definite on polynomials, independently of any sign claim for X−H. Let P_d be the monic X-orthogonal polynomial of degree d and A_d=X[P_d]. Fix either parity ε∈{0,1}, put d_j=ε+2j, and set

\[
 q_j=P_{d_j}/\sqrt{A_{d_j}}.
\]

The natural Pollaczek family and its source normalization are

\[
 Q_d(t)=P_d^{(9/4)}(t/2;\pi/2),\qquad
 x_d=X[Q_d],\qquad e_j=Q_{d_j}/\sqrt{x_{d_j}}.
\]

Both q_j and e_j have positive leading coefficients. For each prefix n define the actual source Gram matrix

\[
 (G_n)_{ij}=X(e_i,e_j),\qquad 0\le i,j\le n.
\]

Its diagonal is exactly one. The selected polynomial has the exact synthesis formula

\[
 q_n=\sum_{j=0}^n c_{j,n}e_j,\qquad
 c_{j,n}=\frac{(G_n^{-1})_{j,n}}{\sqrt{(G_n^{-1})_{n,n}}}.
 \tag{1}
\]

**Theorem.** In either fixed parity there are no constants K,γ,α>0 for which

\[
 |c_{j,n}|\le K\exp[-\gamma(n-j)^\alpha]
 \quad\text{for every }0\le j\le n.
 \tag{2}
\]

Equivalently, for every K,γ,α>0 some actual normalized selected inverse-Gram column violates (2). Violations occur at arbitrarily large column indices if K is allowed to cover any initially prescribed finite set. This is an exclusion of a uniform upper bound, not a lower bound for every entry or every degree. The diagonal j=n is included in (2).

## 2. Inputs, none requiring RH

The accompanying proofs use the following previously established actual-source estimates.

1. For all polynomials p of degree at most d,

   \[
   \|p\|_{W_4}^2\le \exp[C\log^2(d+2)]X[p],
   \qquad W_4(t)=|\Gamma(4+it/2)|^2.
   \tag{3}
   \]

   See `../theta_pollaczek_trial_20261104/ACTUAL_THETA_SUBEXPONENTIAL_REFERENCE_COMPARISON.md`.

2. If \(h_d=\|Q_d\|_{W_{9/4}}^2\), then

   \[
   c h_d\log^2(d+2)\le x_d\le C h_d\log^3(d+2).
   \tag{4}
   \]

   The large-degree bounds are established in `../theta_pollaczek_natural_20261104/NATURAL_FAMILY_RATIO.md` and `ARITHMETIC_SCALE_COROLLARY.md`; positive definiteness absorbs the finitely many small degrees.

3. The natural reference-orthonormal polynomials obey the exact recurrence

   \[
   t\psi_d=\sqrt{(d+1)(d+9/2)}\,\psi_{d+1}
           +\sqrt{d(d+7/2)}\,\psi_{d-1}.
   \tag{5}
   \]

4. The real entire function F and its fixed derivatives decay exponentially times polynomial factors on the real axis. F has infinitely many simple real zeros, unconditionally. The latter follows from the theta–Xi identity and the positive proportion of simple critical-line zeros in [Bui–Conrey–Young, Theorem 1.1](https://arxiv.org/pdf/1002.4127).

No location assumption on the other zeros is made. In particular, (3) is a proved polynomial-space comparison, not an assumed selected inverse gap or desired coherence estimate.

## 3. The matrix conversion retains all cross terms

Write \((q_0,\ldots,q_N)=(e_0,\ldots,e_N)C_N\). These upper-triangular synthesis matrices are nested and satisfy

\[
 C_N^TG_NC_N=I.
\]

Their columns are exactly (1) for their respective prefixes. If (2) held, the finite-dimensional lemma in `MATRIX_LOCALITY_LEMMA.md` would apply. Its conclusions are uniform in N:

- Both G_N and G_N inverse would have bounded condition numbers and bounded operator norms.
- For any \(0<\beta<\min(\alpha,1)\), C_N inverse would have stretched-exponentially decaying entries of exponent β.
- Conjugating a banded matrix with polynomially growing coefficients by C_N would give stretched-exponentially decaying fixed rows.

The first conclusion is derived, not assumed. The key is that H_N=G_N inverse=C_N C_N transpose has uniformly summable second off-diagonal moments. Together with diag(G_N)=1, a localized quadratic-form argument forces a uniform spectral lower bound for H_N. The proof then uses weighted conjugation to invert C_N. No diagonal surrogate replaces G_N and no sign is imposed on its off-diagonal entries.

Let B_N be the ordinary coefficient truncation of multiplication by t² in the e basis. Formula (5) gives bandwidth one in parity indices. Formula (4) changes adjacent normalization ratios by at most O(sqrt(log(d+2))), so

\[
 |(B_N)_{ij}|\le C(1+i+j)^3\,\mathbf 1_{|i-j|\le1}.
\]

For a fixed column n choose N≥n+1. Since t² raises polynomial degree by two, t²q_n belongs to this prefix. Thus its selected coefficient vector is exactly the nth column of

\[
 C_N^{-1}B_NC_N.
\]

There is no boundary error. B_N is an ordinary coefficient truncation, not an X-orthogonal compression. Its ith transformed entry is precisely \(X(t^2q_n,q_i)\). Consequently (2) would force, for every fixed i,

\[
 |X(t^2q_n,q_i)|\le D_i\exp[-\eta|n-i|^\beta].
 \tag{6}
\]

## 4. A simple real zero excludes the resulting selected row

The full proof is in `NO_FAST_SELECTED_MULTIPLICATION_TAIL.md`. Its decisive calculation is short. Put

\[
 w=F^2,\quad V=2(F'^2-FF''),\quad
 LR=-(wR')'+VR.
\]

For any fixed nonzero polynomial q and polynomial h,

\[
 X(hp,q)-X(p,hq)=\int p f,\qquad
 f=(wh')'q+2wh'q'.
 \tag{7}
\]

The comparison (3), plus elementary Pollaczek generating-function bounds, gives on every compact complex set

\[
 |q_n^{(r)}|\le C_{K,r}\exp[C_0\log^2(n+2)](n+2)^{D_{K,r}}.
\]

A stretched-exponential bound for \(X(hq_n,q)\) would therefore produce an entire function \(R=\sum b_nq_n\), where \(b_n=\int q_nf\), with TR in L² and LR=f. Exponential integrability of FTR and F′TR justifies this identity by Fourier uniqueness; no global growth assumption on R is needed.

Choose a simple real zero r of F with \(h'(r)q(r)\ne0\), possible whenever h is nonconstant. At r,

\[
 w=w'=0,\qquad w''=V=2F'(r)^2.
\]

The equation LR=f first gives R(r)=0 and then gives \((LR)'(r)=0\). But (7) gives

\[
 f'(r)=2F'(r)^2h'(r)q(r)\ne0.
\]

This is a contradiction. Applying it to h=t² and q=q_i excludes (6) in either parity and proves the theorem.

## 5. What this changes, and what it leaves open

The original favorable packets suffered exponentially small selected leverage. Moving to the natural Pollaczek hierarchy repaired that exponential-scale mismatch and supplied favorable full-degree trial polynomials. It does not, however, make the actual selected inverse-Gram columns uniformly stretched-exponentially local. The obstruction above applies directly to those columns and preserves the full source cross terms.

This excludes one strong, natural proposed transfer mechanism. It does not exclude algebraic tails, column-dependent localization scales, large diagonal entries combined with localized relative profiles, or a signed cancellation estimate tailored to the selected columns. It also does not prove that the natural family fails relative near-optimality: bounded or asymptotically unit trial/selected source ratios alone do not assert (2).

No conclusion about H[P_d]/A_d, Δ_d, U_d/Δ_d, all-degree bridge positivity, or RH is obtained. Those remain open in this analysis.
