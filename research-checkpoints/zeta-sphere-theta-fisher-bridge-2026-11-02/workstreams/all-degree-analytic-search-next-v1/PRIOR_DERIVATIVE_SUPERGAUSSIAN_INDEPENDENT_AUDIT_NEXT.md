# Independent audit of the supergaussian prior-derivative barrier

## Verdict and scope

The source-free countermodel in
`PRIOR_DERIVATIVE_SUPERGAUSSIAN_BARRIER_NEXT.md` passes an independent
algebraic and numerical audit.

For

\[
 W(t)=e^{-t^4},
\]

the true target density is nonnegative at every degree, but the
prior-derivative auxiliary is strictly negative at the actual Galerkin
residual degrees seven and eight.  This proves a route obstruction for
generic positive log-concave sources.  The profile is not the complete
Jacobi theta source, so the result neither refutes the thirteen finite theta
certificates nor determines the open all-degree theta inequality.  It proves
nothing about RH.

## 1. Target density and moments

Direct differentiation gives

\[
 W'=-4t^3W,
 \qquad
 W''=(-12t^2+16t^6)W,
\]

and therefore

\[
 W'^2-WW''=12t^2e^{-2t^4}\ge0.                 \tag{1}
\]

The standard gamma substitution independently gives

\[
 \int_{\mathbb R}t^{2k}e^{-2t^4}dt
 ={1\over2}2^{-(2k+1)/4}
   \Gamma\!\left({2k+1\over4}\right).          \tag{2}
\]

Thus the verifier's positive moments `J_k` and target moments
`M_k=12J_(k+1)` have the correct normalization.  Since (1) is positive away
from one point, every finite target Hankel matrix is in fact positive
definite.

## 2. Independent residual and score reconstruction

I independently rebuilt the two residuals in each parity from (2), using a
separate standard-library Ruby implementation of Gaussian elimination and
`Math.gamma`.  This implementation did not import or call the primary
verifier.  It then differentiated the reconstructed polynomials, assembled
all polynomial inner products directly from the `J_k`, solved the
three-feature Gram system, and evaluated the current target norm.

The independent values were

\[
\begin{array}{c|c|c|c}
 \kappa&\mathcal H_{\rm prior}&
 \mathcal H_{\rm prior}/A&\int q_\kappa^2\Lambda\\ \hline
 7&-0.0017001720616524468&-0.008793248582899524
   &0.015465806500587098\\
 8&-0.0007401743213531209&-0.00410920678675385
   &0.007939506475405339.
\end{array}                                               \tag{3}
\]

These agree with the outward Arb receipt to about fourteen decimal places,
with discrepancies `1.04e-14` and `3.20e-14` in the two auxiliary values.
The strict negative margins are many orders of magnitude larger than those
floating discrepancies.

The residual indexing is also correct.  For parity `epsilon`, the Galerkin
matrix entry is `M_(i+r+epsilon)`, because

\[
 t^{2i+\epsilon}t^{2r+\epsilon}
 =t^{2(i+r+\epsilon)}.
\]

Consequently the degree-`kappa` residual uses target moments only through
`M_(kappa-1)`.  The new `M_kappa` enters (3) only in the independent target
norm check, not in the auxiliary construction.

## 3. Inverse-free algebra

With the primary notation

\[
 K_3=\begin{pmatrix}A&E&F\\E&D&G\\F&G&T\end{pmatrix},
 \qquad y=(B,C+E,R)^T,
\]

the displayed formulas

\[
\begin{aligned}
 \Delta_2&=AD-E^2,\\
 S_{\rm num}&=T\Delta_2-(DF^2-2EFG+AG^2),\\
 D_{\rm num}&=R\Delta_2-(DF-EG)B-(AG-EF)(C+E),\\
 N_3&=D_{\rm num}^2+H_{\rm num}S_{\rm num}
\end{aligned}
\]

are the standard one-feature Schur expansion.  Direct block elimination
confirms

\[
 \mathcal H_{\rm prior}
 ={N_3\over4\Delta_2S_{\rm num}},
 \qquad
 \det\begin{pmatrix}K_3&y\\y^T&A\end{pmatrix}
 =-{N_3\over\Delta_2}.                                  \tag{4}
\]

The receipt certifies positive `Delta2` and `Snum=det(K3)` and negative
`N3` at both rungs.  Thus the positive bordered determinant and negative
auxiliary in (4) have the correct opposite signs.

## 4. Gaussian comparison

The exact Gaussian formula was checked separately with rational arithmetic.
For `W=e^(-t^2)`, let `q_k` be the monic Hermite family for `W^2dt` and
`h_k=||q_kW||^2`.  Its recurrence coefficient is `a_k=k/4`.  In the ordered
pair `(q_k',tq_k)`, orthogonality gives

\[
 A=4kh_k,
 \quad E=kh_k,
 \quad D={2k+1\over4}h_k,
 \quad y=(0,(k+1)h_k)^T.
\]

Hence

\[
 y^TK^{-1}y-A=4h_k,
 \qquad
 {\mathcal H_{\rm prior}\over A}={1\over4k}.             \tag{5}
\]

The predecessor derivative is an orthogonal Hermite mode and adds zero
gain.  Exact `Fraction` calculations verified (5) for `k=3,...,12`, and the
displayed derivation proves it for every `k>=3`.

## 5. Orbit-translation identity

For the complete-theta positive orbits,

\[
 \phi_n(h)=4z_n(2z_n-3)e^{h/2-z_n},
 \qquad z_n=\pi n^2e^{2h},
\]

one has `z_1(h+log n)=z_n(h)` and
`exp((h+log n)/2)=sqrt(n)exp(h/2)`.  Therefore

\[
 \phi_n^{(j)}(h)=n^{-1/2}\phi_1^{(j)}(h+\log n).           \tag{6}
\]

After the change of variable `u=h+log n`, Tonelli's theorem applies to the
nonnegative diagonal terms and yields

\[
\begin{aligned}
 \sum_{n\ge1}\int_0^\infty|\phi_n^{(j)}(h)|^2dh
 &=\sum_{n\ge1}{1\over n}
   \int_{\log n}^\infty|\phi_1^{(j)}(u)|^2du\\
 &=\int_0^\infty|\phi_1^{(j)}(u)|^2
   H_{\lfloor e^u\rfloor}du.                             \tag{7}
\end{aligned}
\]

Equation (7) concerns only the diagonal orbit sum; the complete squared norm
also has every cross-orbit term.  The primary note states this limitation
correctly and does not use (7) as a sign certificate.

## Reproducibility and hashes

The frozen primary hashes were independently checked:

```text
verifier source
  aa7c35bb5f2a32087c98a9421d8493b0cef2d8f6efd80e5654dfb3fefa6d2f39
384-bit receipt
  b6465f43eb03fc3abfde15ebb680ffdc6837ed2f5fe12dc0ea40ae49adcbabfa
```

The receipt's embedded source hash matches the verifier.  Its strict checks
record `Delta2>0`, `det(K3)>0`, `N3<0`, `H_prior<0`, and a positive true
target at both rungs.  No network, theta-orbit truncation, or heavy degree
sweep is involved.
