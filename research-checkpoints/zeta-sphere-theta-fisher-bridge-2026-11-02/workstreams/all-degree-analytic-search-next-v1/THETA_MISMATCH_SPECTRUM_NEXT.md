# The theta mismatch vector in the negative-sampling defect metric

## Scope and outcome

`ACTUAL_RESIDUAL_ALIGNMENT_NEXT.md` writes the next signed Galerkin pivot as

\[
 \mathfrak q[\pi_N]
 =\mathcal A[\phi_N]-\mathcal N[\phi_N]
  -s^*\mathfrak q_V^{-1}s,                       \tag{1}
\]

where `mathcal A` is the complete positive parent, `mathcal N` is the exact
sum of the local negative pieces of hypothetical off-line quartets, and
`phi_N` is the `mathcal A`-orthogonal monic residual.  The unresolved term is
usually displayed in an old-space eigenbasis as

\[
 s^*\mathfrak q_V^{-1}s
 =\sum_j {|h_j|^2\over1-\lambda_j}.              \tag{2}
\]

This note keeps the direct negative term and the feedback in one metric.  It
has four conclusions.

1. The complete negative-quartet form has a canonical sampling factor `B`.
   If `C` is its old-prefix restriction and `z=B phi_N` is its actual new
   column, then

   \[
    T=C^*C,\qquad h=C^*z.                         \tag{3}
   \]

   Thus the mismatch and sampling spectrum are correlated before any
   estimate is made.
2. The direct penalty and inverse feedback combine exactly:

   \[
    \boxed{
    \mathcal N[\phi_N]+s^*\mathfrak q_V^{-1}s
    =\langle z,(I-CC^*)^{-1}z\rangle.}            \tag{4}
   \]

   This is the negative-sampling analogue of an assembled trace identity.
3. The required sign is equivalently one directional defect inequality on
   the sampling space, or contractivity of the one-column extension
   `[C,z/sqrt(alpha)]`, where `alpha=mathcal A[phi_N]`.  Old positivity makes
   the defect metric positive but supplies no reserve for the new column.
4. An exact real-even entire model with one functional-equation-symmetric
   quartet, its coupled inside--outside contribution, a positive entire
   background, and a positive old prefix has a negative next actual pivot.
   It proves that these structural facts alone do not imply (4)'s required
   upper bound.  The model is not Xi and does not retain complete-theta
   modular arithmetic.

No off-line Xi zero, negative Xi pivot, all-degree sign, or RH conclusion is
asserted.  The finite rational calculation below certifies an analytic
countermodel; it is not evidence for or against RH.

## 1. Canonical negative sampling as one operator

Fix one parity and a finite polynomial extension

\[
 V=\mathcal P_{N-2}^{\epsilon},\qquad
 W=V\oplus\operatorname {span}\{p_N\}.           \tag{5}
\]

Use the canonically grouped zero formula for `F=2Xi`.  After every
functional-equation quartet has been folded, its local negative piece is,
up to the fixed normalization and multiplicity,

\[
 \int_{|x-a_j|<b_j}
 \widetilde p(x)\widetilde q(x)|H_j(x)|^2
 \{b_j^2-(x-a_j)^2\}\,dx,                        \tag{6}
\]

where

\[
 H_j(z)={F(z)\over(z-a_j)^2+b_j^2}               \tag{7}
\]

is an exact entire quotient with removable values at the two divided-out
zeros.  Real zeros and every exterior positive piece remain in `mathcal A`.
The canonical local-normal convergence makes

\[
 \mathfrak q=\mathcal A-\mathcal N               \tag{8}
\]

an exact polarized form identity on `W`.

For a finite symmetric zero truncation, take the Hilbert direct sum of the
weighted `L2` spaces in (6), including multiplicity, and let `Bp` be the
vector of all folded polynomial samples.  Then

\[
 \mathcal N(p,q)=\langle Bp,Bq\rangle_{\mathcal K}. \tag{9}
\]

On the fixed finite-dimensional space `W`, the canonical limit of these
positive Gram forms is finite.  Therefore (9) persists in the completion of
the sampling images.  Equivalently, one may take the minimal Gram
factorization of `mathcal N|_W`; none of the identities below depends on a
particular realization of `mathcal K`.

Assume throughout the rest of Sections 1--3 that

- `mathcal A` is positive definite on `W`; and
- the old signed block `mathfrak q_V=mathcal A_V-mathcal N_V` is positive
  definite.

Let `e_1,...,e_d` be an `mathcal A`-orthonormal basis of `V`, and let
`phi_N` be the monic `mathcal A`-orthogonal residual.  Put

\[
 \alpha=\mathcal A[\phi_N]>0,\qquad
 Cc=B\!\left(\sum_{i=1}^dc_ie_i\right),\qquad
 z=B\phi_N.                                      \tag{10}
\]

Thus `C:C^d -> mathcal K` is the complete old negative-sampling map.  Its
Gram and the cross vector are

\[
 T=C^*C,\qquad
 h_i=\mathcal N(e_i,\phi_N)=(C^*z)_i.            \tag{11}
\]

Old positivity is exactly

\[
 I-T=I-C^*C>0,                                   \tag{12}
\]

so `norm(C)<1`.  In particular both `I-C^*C` and `I-CC^*` are boundedly
invertible on their relevant spaces.  Equation (11) is the correlation that
is lost if `h` and the spectral gap are bounded separately.

## 2. The combined sampling-space resolvent

In the coordinates (10), the old signed inverse payment is

\[
 s^*\mathfrak q_V^{-1}s
 =h^*(I-C^*C)^{-1}h.                              \tag{13}
\]

The push-through identity

\[
 I+C(I-C^*C)^{-1}C^*=(I-CC^*)^{-1}              \tag{14}
\]

and `h=C^*z` give

\[
\begin{aligned}
 \mathcal N[\phi_N]+s^*\mathfrak q_V^{-1}s
 &=\|z\|^2+
   \langle C^*z,(I-C^*C)^{-1}C^*z\rangle\\
 &=\boxed{\langle z,(I-CC^*)^{-1}z\rangle}.
                                                               \tag{15}
\end{aligned}
\]

Substitution in (1) yields the single-metric formula

\[
 \boxed{
 \mathfrak q[\pi_N]
 =\alpha-\langle z,(I-CC^*)^{-1}z\rangle.}       \tag{16}
\]

This is not obtained by discarding the positive exterior parent.  The parent
determines the orthogonal residual `phi_N`, the old orthonormal coordinates,
and `alpha`; the entire negative-quartet sum determines `C` and `z`.

There is also an exact spectral form.  Let

\[
 C e_j=\sqrt{\lambda_j}f_j,\qquad 0<\lambda_j<1, \tag{17}
\]

be the nonzero singular directions, write
`z_j=<f_j,z>`, and let `z_0` be the component of `z` orthogonal to
`Ran(C)`.  Then

\[
 h_j=\sqrt{\lambda_j}z_j                         \tag{18}
\]

and

\[
\begin{aligned}
 \mathcal N[\phi_N]
   &=\|z_0\|^2+\sum_j|z_j|^2,\\
 \sum_j{|h_j|^2\over1-\lambda_j}
   &=\sum_j{\lambda_j|z_j|^2\over1-\lambda_j},\\
 \langle z,(I-CC^*)^{-1}z\rangle
   &=\|z_0\|^2+\sum_j{|z_j|^2\over1-\lambda_j}.
                                                               \tag{19}
\end{aligned}
\]

Thus the desired inequality from (1)--(2) is exactly

\[
 \boxed{
 \|z_0\|^2+\sum_j{|z_j|^2\over1-\lambda_j}
 \leq\alpha.}                                     \tag{20}
\]

The relation (18) is genuine information, but it does not suppress a
near-unit mode: its combined coefficient in (20) is still
`(1-lambda_j)^(-1)`.

## 3. Equivalent directional and extension criteria

Put

\[
 D=I-CC^*>0.                                      \tag{21}
\]

The inverse quadratic form has the Rayleigh representation

\[
 \langle z,D^{-1}z\rangle
 =\sup_{0\ne g\in\mathcal K}
 { |\langle z,g\rangle|^2\over\langle g,Dg\rangle}. \tag{22}
\]

Consequently the missing source-specific theorem can be stated without an
inverse:

\[
 \boxed{
 |\langle B\phi_N,g\rangle|^2
 \leq\mathcal A[\phi_N]
 \{\|g\|^2-\|C^*g\|^2\}
 \quad(g\in\mathcal K).}                          \tag{23}
\]

All quartet indices and all points inside their negative intervals remain
correlated in `g`; (23) is not a sum of separate Cauchy estimates.  The
extremizing direction is proportional to `D^(-1)z`.

There is an equivalent column-extension form.  Define

\[
 \widehat C=[\,C,\ z/\sqrt\alpha\,].             \tag{24}
\]

Then

\[
 I-\widehat C\widehat C^*
 =D-{zz^*\over\alpha}.                            \tag{25}
\]

The rank-one Schur criterion gives

\[
 \boxed{
 \mathfrak q[\pi_N]\geq0
 \quad\Longleftrightarrow\quad
 D-{zz^*\over\alpha}\succeq0
 \quad\Longleftrightarrow\quad
 \|\widehat C\|\leq1.}                         \tag{26}
\]

This explains both the value and the limit of the new coordinate.  It keeps
the actual mismatch column and the old spectrum assembled, but contractivity
of the augmented column is precisely the new signed extension.  It is not a
consequence of the old contraction `norm(C)<1`.

Equations (15), (23), and (26) are basis-independent.  They are also stable
when `mathcal N|_W` is represented by its minimal finite Gram factor rather
than the explicit infinite direct sum.

## 4. A coupled entire-quartet countermodel

The canonical product rule, functional-equation symmetry, positive
background, exact inside--outside pairing, and old positivity still do not
imply (23).  The following model retains all of those properties in closed
form.

Let

\[
\begin{aligned}
 P(x)&=((x-1)^2+1/8)((x+1)^2+1/8)\\
     &=x^4-{7\over4}x^2+{81\over64},\\
 G(x)&=e^{-2x^2},\qquad F_*(x)=P(x)G(x).          \tag{27}
\end{aligned}
\]

Then `F_*` is real, even, entire, and rapidly decreasing on the real axis.
Its only zeros are the functional-equation-symmetric quartet

\[
 \pm1\pm{i\over\sqrt8},                           \tag{28}
\]

whose transverse displacement is strictly below `1/2`.  The quotient by the
quartet polynomial is the same entire function `G` in every inside and
outside term.  The exact product identity

\[
 \mathcal L[UV]=V^2\mathcal L[U]+U^2\mathcal L[V]
                                                               \tag{29}
\]

and `mathcal L[G]=4G^2` give

\[
 \mathcal L[F_*](x)=e^{-4x^2}R(x),                \tag{30}
\]

where

\[
 R(x)=4x^8-10x^6+{151\over8}x^4
      -{857\over32}x^2+{11097\over1024}.          \tag{31}
\]

Split `G^2 mathcal L[P]` at the two exact negative intervals of the quartet,
retaining its positive exterior pieces, and put the everywhere nonnegative
background `4P^2G^2` into `mathcal A`.  This is exactly the same
positive-parent/negative-sampling construction as (8).  Moreover
`4P^2G^2>0` on the real axis, so `mathcal A` is positive definite on every
finite polynomial space.

Consider the even polynomial ladder and normalize the moments by

\[
 \mu_j={2\over\sqrt\pi}
 \int_{\mathbb R}x^{2j}\mathcal L[F_*](x)\,dx.    \tag{32}
\]

The Gaussian recurrence

\[
 {2\over\sqrt\pi}\int_{\mathbb R}x^{2k}e^{-4x^2}dx
 ={(2k-1)!!\over8^k}                              \tag{33}
\]

and (31) give, by exact rational arithmetic,

\[
\begin{array}{c|rrrrrrr}
 j&0&1&2&3&4&5&6\\ \hline
 \mu_j&
 {2095\over256}&{1047\over2048}&{1269\over16384}&
 {4785\over131072}&{97335\over1048576}&
 {2395575\over8388608}&{57453165\over67108864}.
\end{array}                                       \tag{34}
\]

Let `Delta_n=det(mu_(i+j))_(i,j=0)^n`.  Direct fraction-free elimination
gives

\[
\begin{aligned}
 \Delta_0&={2095\over256}>0,\\
 \Delta_1&={781173\over2097152}>0,\\
 \Delta_2&={7173432621\over274877906944}>0,\\
 \Delta_3&=-{875385943630785\over1152921504606846976}<0.
                                                               \tag{35}
\end{aligned}
\]

Hence the old signed block on

\[
 V=\operatorname {span}\{1,x^2,x^4\}             \tag{36}
\]

is positive definite, while adjoining the monic degree-six direction gives
the exact negative Schur pivot

\[
 {\Delta_3\over\Delta_2}
 =-{97265104847865\over3343061903998976}<0.       \tag{37}
\]

The unnormalized integral has the same sign; its pivot is (37) multiplied by
`sqrt(pi)/2`.  By (16), this model satisfies

\[
 \langle z,(I-CC^*)^{-1}z\rangle>\alpha,          \tag{38}
\]

despite the exact coupled quartet geometry and a strictly positive old
block.

This countermodel is stronger than an arbitrary point sample: its negative
intervals, positive exterior pieces, removable entire quotient, mirror
quartet, and positive background all come from one product `F_*=PG`.
It is nevertheless not the complete theta profile.  In particular the
Gaussian contributes a quadratic exponential factor, the model has no zeta
Euler/modular arithmetic or Xi zero distribution, and it does not satisfy
the order-one canonical-series hypotheses used to eliminate such a factor
for Xi.  Therefore (37) retires only a source-free product-geometry proof of
(23); it is not a Xi counterexample.

## 5. What a complete-theta proof must add

The new exact target is (23), equivalently (26), with `B` built from the
actual entire quotients `H_j` of `F=2Xi` and `phi_N` formed in the complete
positive parent.  The identities above rule out three shortcuts.

1. Old positivity only proves `D>0`; it does not control the leverage
   `z^*D^(-1)z` of the next actual sampling column.
2. The automatic correlation `h=C^*z` changes the feedback coefficient from
   `lambda/(1-lambda)` to the assembled `1/(1-lambda)` in (19).  It does not
   create a small factor near `lambda=1`.
3. Exact quartet factorization, reflection symmetry, positive background,
   and coupled exterior reserve are not sufficient without additional
   complete-theta arithmetic, as (27)--(38) show.

A noncircular continuation must therefore establish a property absent from
the countermodel, for example a modular/orbit identity that proves the
directional defect estimate (23) for the actual column, or a direct
complete-theta comparison of the augmented negative sampling map with its
positive parent.  Such an argument must retain the all-quartet vector and
cannot replace `D` by its smallest eigenvalue or estimate the entries of `z`
separately.

The mismatch covector `r` in the positive `X/Y` theta-channel decomposition
is another exact coordinate for the signed old inverse, but its positive
parent is not the zero-split parent `mathcal A`.  No unitary identification
between those two positive parents has been proved.  Equating their sampling
eigenvectors without an explicit isometry would therefore introduce a new
gap rather than prove (23).

## Reproducibility and nonclaims

- Equations (9)--(26) are finite-dimensional Hilbert-space identities.  The
  canonical zero sum is used only to identify the exact sampling factor; the
  algebra may be replayed from the polarized Gram matrices.
- Equations (34)--(37) use only (31), the Gaussian recurrence (33), and exact
  rational determinant elimination.  No floating sign decision is involved.
- The countermodel fixes one degree-six extension.  Its role is to falsify a
  proposed source-free implication, not to certify or refute any Xi degree.
- No hypothetical off-line Xi quartet is asserted to exist.
- The sampling-space defect criterion (23) is exactly equivalent to the next
  pivot.  It is a sharpened coordinate for source-specific work, not a proof
  of its sign.
- Nothing in this note proves the first Xi Laguerre inequality, the full
  all-degree ladder, or RH.
