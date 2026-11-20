# The all-degree assembled scalar: reverse anchoring and exact covariance

## Scope and outcome

This note generalizes the exact H5 scalarization in
`H5_SIGNED_C5_PAYMENT_NEXT.md` to either parity ladder and every extension
degree.  The calculation is deliberately singular-safe and keeps the newest
local defect, its covariance repair, and the old-prefix coupling in one
object.

There are four conclusions.

1. Eliminating the last old monomial first gives an exact reverse-anchor
   block.  Its lower-right entry is the determinant of the newest integrated
   two-by-two moment block divided by the anchor, while its border is one
   explicit residual against the rest of the old prefix.
2. If the anchoring Bell coefficient is pointwise positive, the whole block
   is exactly

   \[
   \text{mean local Schur defect}
   +\text{covariance of one combined feature vector}.
   \]

   This is a matrix identity, not a separate Cauchy estimate.
3. The H5 formula is the case `(r,n)=(1,2)`.  Its bottom-Turan integral,
   ratio variance, and old-prefix cost are precisely the three pieces of the
   general identity.
4. The resulting contraction is **exactly** the next Hankel pivot.  It is not
   a weaker recursive lemma with a hidden reserve.  With all earlier moments
   fixed, the newest moment moves this scalar with coefficient one.  A proof
   must therefore use a complete-theta identity involving the newest Bell
   coefficient or an equivalent signed regional compensation.

No all-degree sign, new Xi--Laguerre inequality, or RH result is claimed.

## 1. Hankel extension and the reverse anchor

Use the complete-theta Bell coefficients and the integrated normalization

\[
 m_j=2\int_0^\infty h^2c_j(h)\,dh.                 \tag{1}
\]

For `r in {0,1}` and `n>=2`, let

\[
 \mathcal H_{n,r}=(m_{r+i+j})_{i,j=0}^{n}.         \tag{2}
\]

The old prefix is `mathcal H_(n-1,r)`.  Put

\[
 k=r+2n-2                                                   \tag{3}
\]

and split the monomial basis into degrees `0,...,n-2`, degree `n-1`, and
degree `n`.  Then

\[
 \mathcal H_{n,r}=
 \begin{pmatrix}
 C&u&v\\
 u^*&m&z\\
 v^*&\overline z&d
 \end{pmatrix},                                      \tag{4}
\]

where

\[
 \begin{aligned}
 C_{ij}&=m_{r+i+j}, &&0\leq i,j\leq n-2,\\
 u_i&=m_{r+n-1+i},&
 v_i&=m_{r+n+i},\\
 m&=m_k,&z&=m_{k+1},&d&=m_{k+2}.
 \end{aligned}                                      \tag{5}
\]

All data are real for the present theta profile; stars are retained only as
standard symmetric/Hermitian block notation.

Assume first that `m>0` and define

\[
 P=C-{uu^*\over m},\qquad
 \eta=v-{uz\over m},\qquad
 B=md-|z|^2.                                       \tag{6}
\]

Subtracting the degree-`n-1` projection from every other basis vector gives
the exact congruence

\[
 \boxed{
 \mathcal H_{n,r}\ \cong\
 [m]\ \oplus\
 \begin{pmatrix}
 P&\eta\\
 \eta^*&B/m
 \end{pmatrix}.}                                  \tag{7}
\]

The corresponding old prefix satisfies

\[
 \mathcal H_{n-1,r}\cong[m]\oplus P.             \tag{8}
\]

Consequently an old positive-semidefinite prefix gives `P>=0`.  The range
condition for a finite next Schur pivot is exactly

\[
 \eta\in\operatorname{Ran}P.                     \tag{9}
\]

When (9) holds, the singular-safe next pivot is

\[
 \boxed{
 \mathcal S_{n,r}
 ={B\over m}-\eta^*P^\dagger\eta.}                \tag{10}
\]

For a nonsingular old prefix this is also

\[
 \mathcal S_{n,r}
 ={\det\mathcal H_{n,r}\over\det\mathcal H_{n-1,r}}
 =2{D_n^{(r)}\over D_{n-1}^{(r)}}.
\]

If (9) fails, a vector in `ker P` with nonzero pairing against `eta` makes
the last block in (7) indefinite for every value of `d`; no choice of newest
diagonal can give a positive extension.  If the old prefix is positive
definite, then `P>0`, (9) is automatic, and the dagger in (10) is an ordinary
inverse.

The zero-anchor branch is also explicit.  If `m=0` and the old prefix is
positive semidefinite, then `u=0`.  A positive-semidefinite extension requires
`z=0`; the zero coordinate then decouples, and the remaining condition is

\[
 v\in\operatorname{Ran}C,\qquad
 d-v^*C^\dagger v\geq0.                            \tag{11}
\]

Thus no division by a vanishing pivot is hidden in the statement.

For a nonsingular old prefix, (7)--(8) also give

\[
 \det\mathcal H_{n,r}=m^{n+1}\det\mathcal C_{n,r},
 \qquad
 \det\mathcal H_{n-1,r}=m^n\det G_{n,r},          \tag{12}
\]

where the normalized matrices `mathcal C_(n,r)` and `G_(n,r)` are defined
below.  Hence (10) is the same determinant ratio as the ordinary forward
Schur pivot; only the elimination order has changed.

## 2. A denominator-free correlated bottom margin

Put

\[
 \rho_j(h)=2h^2c_j(h),\qquad m_j=\int_0^\infty\rho_j(h)\,dh. \tag{13}
\]

The complete-theta decay makes all the following integrals absolutely
convergent.  The scalar `B` in (6) has the denominator-free representation

\[
 \boxed{
 \begin{aligned}
 B={1\over2}\iint_{(0,\infty)^2}
 \{&\rho_k(h)\rho_{k+2}(s)
   +\rho_{k+2}(h)\rho_k(s)\\
   &-2\rho_{k+1}(h)\rho_{k+1}(s)\}\,dh\,ds.
 \end{aligned}}                                    \tag{14}
\]

No sign of `c_k`, no pointwise quotient, and no spectral Xi sign is used in
(14).  It is simply the exact integrated determinant

\[
 B=m_km_{k+2}-m_{k+1}^2.                           \tag{15}
\]

Combining (10) and (15), the next extension is nonnegative exactly when

\[
 \boxed{
 B\geq m\,\eta^*P^\dagger\eta,
 \qquad \eta\in\operatorname{Ran}P.}              \tag{16}
\]

Equation (16) is already an assembled inequality: the two signed diagonal
terms and the cross term in (14) have not been bounded separately.  It is,
however, equivalent to the desired next pivot, not an auxiliary theorem
weaker than that pivot.

## 3. The complete local-defect plus covariance identity

There is a sharper source-specific form when the reverse anchor is positive
pointwise.  Assume for this section that

\[
 c_k(h)>0\quad\text{for almost every }h>0           \tag{17}
\]

and that the displayed quotient integrals converge.  Define the probability
measure

\[
 d\nu(h)={\rho_k(h)\over m}\,dh.                   \tag{18}
\]

For `0<=i,j<=n-2`, introduce the actual complete-theta ratios

\[
 \begin{aligned}
 q_i(h)&={c_{r+n-1+i}(h)\over c_k(h)},&
 t_i(h)&={c_{r+n+i}(h)\over c_k(h)},\\
 K_{ij}(h)&={c_{r+i+j}(h)\over c_k(h)},&
 R(h)&={c_{k+1}(h)\over c_k(h)},\\
 \mathcal P(h)&={c_{k+2}(h)\over c_k(h)}-R(h)^2.
 \end{aligned}                                     \tag{19}
\]

Write `q,t` as column vectors and set

\[
 \mathcal L(h)=
 \begin{pmatrix}
 K(h)-q(h)q(h)^*&t(h)-q(h)R(h)\\
 (t(h)-q(h)R(h))^*&\mathcal P(h)
 \end{pmatrix}.                                    \tag{20}
\]

This is the local Hankel Schur defect after the same degree-`n-1` anchor has
been removed.  It can have either sign.

Let `E` and `Cov` denote expectation and covariance under `nu`, and define

\[
 \begin{aligned}
 G&={P\over m}=E[K]-(E[q])(E[q])^*,\\
 \xi&={\eta\over m}=E[t]-(E[q])E[R],\\
 \beta&={B\over m^2}=E\!\left[{c_{k+2}\over c_k}\right]-(E[R])^2.
 \end{aligned}                                     \tag{21}
\]

If `Y(h)=(q(h),R(h))^T`, direct expansion gives the all-degree identity

\[
 \boxed{
 \mathcal C_{n,r}:=
 \begin{pmatrix}G&\xi\\\xi^*&\beta\end{pmatrix}
 =E[\mathcal L(h)]+\operatorname{Cov}(Y).}         \tag{22}
\]

Every entry in (22) is an equality.  In particular,

\[
 \begin{aligned}
 G&=E[K-qq^*]+\operatorname{Cov}(q),\\
 \xi&=E[t-qR]+\operatorname{Cov}(q,R),\\
 \beta&=E[\mathcal P]+\operatorname{Var}(R).
 \end{aligned}                                     \tag{23}
\]

The last line is the all-degree version of the bottom-Turan integral plus
ratio variance in H5.  The first two lines show why the old-prefix cost must
be formed in the same metric rather than estimated by a separate Cauchy
bound.

Equations (7) and (21) show that the nontrivial block in the reverse-anchor
congruence is exactly `m mathcal C_(n,r)`.  Hence, under the old-prefix
hypothesis,

\[
 \boxed{
 \mathcal S_{n,r}
 =m\{\beta-\xi^*G^\dagger\xi\},
 \qquad \xi\in\operatorname{Ran}G.}               \tag{24}
\]

This is singular-safe because `P=mG` and the range conditions in (9) and
(24) are identical.

There is also a minimal directional form.  Put

\[
 w=\binom{-G^\dagger\xi}{1}.                       \tag{25}
\]

Then

\[
 \boxed{
 {\mathcal S_{n,r}\over m}
 =E[w^*\mathcal L(h)w]
  +\operatorname{Var}_\nu(w^*Y(h)).}              \tag{26}
\]

The variance in (26) is positive, but the local-defect average is signed.
They are the two correlated parts of one identity; replacing the first by an
absolute lower bound and the second by an unrelated variance estimate loses
the source-specific compensation.

## 4. Recovery of the exact H5 scalarization

For odd H5, `(r,n)=(1,2)` and `k=3`.  The vectors in (19) are scalar and

\[
 q={c_2\over c_3},\qquad t=1,\qquad
 K={c_1\over c_3},\qquad R={c_4\over c_3},\qquad
 \mathcal P={c_5\over c_3}-\left({c_4\over c_3}\right)^2. \tag{27}
\]

The pointwise theorem `c_3>0` makes (18) legitimate.  With the notation of
`H5_SIGNED_C5_PAYMENT_NEXT.md`,

\[
 m=M_3,\qquad
 G={M_1-M_2^2/M_3\over M_3}={P_0\over M_3},        \tag{28}
\]

\[
 \xi=1-{M_2M_4\over M_3^2},\qquad
 \beta=\int\mathcal P\,d\nu
       +\operatorname{Var}_\nu(R).                \tag{29}
\]

Therefore

\[
 m\,\xi^2/G
 ={(M_3-M_2M_4/M_3)^2\over M_1-M_2^2/M_3}=E_5,   \tag{30}
\]

and (24) is exactly that note's equation (19).  Thus the H5 decomposition is
not an isolated low-degree coincidence; it is reverse Gram--Schmidt on the
full Hankel ladder.

The rational two-region model in the H5 note also checks the constants.  Its
integrated moments are

\[
 (M_1,M_2,M_3,M_4,M_5)
 =\left({1\over4},{3\over8},1,{3\over2},{5\over2}\right). \tag{31}
\]

They give

\[
 G={7\over64},\qquad \xi={7\over16},\qquad
 \beta={1\over4},                                  \tag{32}
\]

and hence

\[
 \mathcal S_5
 =1\left({1\over4}-{(7/16)^2\over7/64}\right)
 =-{3\over2}.                                      \tag{33}
\]

In particular, even the positive integrated bottom determinant
`M_3M_5-M_4^2=1/4` does not pay the old-prefix coupling.  The model is not a
theta profile and is not an H5 or RH counterexample; it is an exact check that
the combined metric in (24) is indispensable.

## 5. Exact saturation and the missing arithmetic input

The reverse-anchor identity does not create a weaker induction theorem.
Indeed, fix all moments through `m_(k+1)` while keeping the old prefix and
range condition fixed.  Then `P`, `eta`, `m`, and `z` are fixed, whereas

\[
 \mathcal S_{n,r}
 =m_{k+2}-{m_{k+1}^2\over m_k}
  -\eta^*P^\dagger\eta                           \tag{34}
\]

depends affinely on the free newest moment `m_(k+2)` with coefficient one.
It can therefore have either sign without changing any old-prefix or border
quantity.  Equivalently, `beta` is the only entry of `mathcal C_(n,r)` that
contains the newest moment.

This proves the following route classification.

* Old-block positivity, range control, and any estimate involving moments
  only through `m_(k+1)` cannot sign the next pivot.
* The covariance matrix in (22) is positive semidefinite, but the local
  defect `E[mathcal L]` is signed.  Declaring their sum positive is exactly
  the target, not a generic law of total variance.
* Pointwise positivity of `mathcal L` would close the step, but it is a local
  Schur-positivity route.  The certified actual-theta odd-H5 fiber is already
  indefinite near the center, so this cannot be the all-degree mechanism.
* The positive-anchor assumption (17) is itself unproved at general degree.
  Without it, the denominator-free identity (14)--(16) remains valid, but the
  language of probability and positive variance is unavailable.

The minimal theorem-shaped continuation, conditional only on an already
positive old prefix and a valid anchor, is the actual-direction inequality

\[
 \boxed{
 E[w^*\mathcal L(h)w]
 +\operatorname{Var}_\nu(w^*Y(h))\geq0,}          \tag{35}
\]

where `w` is the globally determined vector (25).  This is noncircular as a
*target* because every term is explicit complete-theta arithmetic and no
next-pivot sign is inserted.  Algebraically, however, (35) is equal to the
next pivot divided by `m`; proving it requires a genuinely new theta/Jacobi,
modular, or signed-regional comparison.  Separate componentwise Cauchy
estimates do not supply that comparison.

## Nonclaims

- Equations (10), (22), (24), and (26) are exact reductions, not positivity
  proofs.
- Pointwise positivity of the anchoring coefficient `c_k` is used only in
  the probability formulation (18)--(26); it is not asserted at all degrees.
- The free-last-moment argument is an algebraic no-go for old-data-only
  recursions.  It does not say that the complete-theta newest moment is free.
- The H5 rational model is not generated by the theta profile.
- No finite check is extrapolated to the endpoint sign, the full ladder, or
  RH.
