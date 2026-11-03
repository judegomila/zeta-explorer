# The newest Bell coefficient: local freedom and the exact Jacobi-score gate

## Scope and outcome

This note attacks the newest coefficient in the reverse-anchor identity of
`ALL_DEGREE_ASSEMBLED_SCALAR_NEXT.md`.  It keeps the complete-theta Bell
normalization and the old-prefix/range domains exact.  Four conclusions
result.

1. The Fréchet derivatives of the integrated Bell moments at the actual
   complete-theta profile are linearly independent at every finite order.
   The proof uses the first theta orbit at spatial infinity, not a generic
   moment model.
2. Consequently, within positive even real-analytic Schwartz profiles with
   the same functional-equation symmetry and the same differentiated
   first-orbit tail through its `e^(-3z)` gap scale, one may preserve every
   moment through `m_(k+1)` **exactly** while moving
   `m_(k+2)` through a two-sided interval.  The reverse-anchor pivot then
   moves by the same amount while its old block, border, anchor, and range
   condition remain fixed.
3. This does not deform the actual theta function inside the Jacobi family.
   It proves a precise route limitation: positivity, evenness, analyticity,
   complete-theta tail asymptotics, and all old integrated Bell data do not
   contain the missing newest-coefficient relation.  A proof must use
   additional source-specific structure absent from the perturbation, such
   as the exact Jacobi orbit arithmetic.
4. The Jacobi arithmetic has an exact half-line score recursion.  It isolates the
   newest `c_(k+2)` term as one high covariant orbit-score average plus a
   polynomial in lower score averages.  Substitution gives a concrete joint
   orbit-score payment inequality.  It is the next source-specific lemma,
   but it remains unproved and is algebraically equal to the desired pivot.

No finite computation, new Xi--Laguerre sign, all-degree positivity theorem,
or RH conclusion is asserted.

## 1. Bell moments and their exact first variation

For an even real Schwartz profile `varphi`, define

\[
 c_j[\varphi](h)={(-1)^j\over4^j}
 \left.\partial_a^{2j}
 \{\varphi(h-a)\varphi(h+a)\}\right|_{a=0},
 \qquad
 m_j[\varphi]=\int_{\mathbb R}h^2c_j[\varphi](h)\,dh .       \tag{1}
\]

For the campaign profile `varphi=psi`, this equals
`2 integral_0^infinity h^2 c_j(h)dh`.  For `j>=1`, the audited Bell--Sobolev
identity is

\[
 \boxed{
 m_j[\varphi]
 =\int h^2(\varphi^{(j)})^2dh
  -{j\over2}\int(\varphi^{(j-1)})^2dh,}                    \tag{2}
\]

while `m_0[varphi]=integral h^2varphi^2`.  Thus, for an even Schwartz
perturbation `chi`, differentiation at `varphi` gives

\[
 Dm_j[\varphi](\chi)=\int_{\mathbb R}\Lambda_j[\varphi](h)
 \chi(h)\,dh,                                               \tag{3}
\]

where

\[
 \boxed{
 \begin{aligned}
 \Lambda_0[\varphi]&=2h^2\varphi,\\
 \Lambda_j[\varphi]
 &=(-1)^j\{2(h^2\varphi^{(j)})^{(j)}
             +j\varphi^{(2j-2)}\},\qquad j\ge1.
 \end{aligned}}                                             \tag{4}
\]

All boundary terms vanish.  Formula (4) is an equality of functions, not an
estimate and not an invocation of a Bell-fiber sign.

## 2. First-orbit arithmetic makes the moment differentials independent

On the positive half-line put `z=pi e^(2h)`.  The positive-orbit formula and
its differentiated Gaussian tail give, for each fixed derivative order,

\[
 \psi(h)=4z(2z-3)e^{h/2-z}
 \{1+O(e^{-3z}\operatorname{poly}(z))\},                    \tag{5}
\]

\[
 \psi^{(s)}(h)=(-2z)^s\psi(h)\{1+O_s(z^{-1})\}
 \qquad(h\longrightarrow+\infty).                           \tag{6}
\]

The `n=2` orbit begins at `4z`, so the exponent gap in (5) is exactly the
source of `e^(-3z)`; all fixed differentiations merely add polynomial
factors.  Substitution into (4) gives

\[
 \boxed{
 \Lambda_j[\psi](h)
 =2(-1)^j h^2(2z)^{2j}\psi(h)\{1+o_j(1)\}}
 \qquad(j\ge0).                                             \tag{7}
\]

Consequently the even functions

\[
 \Gamma_j(h):=\Lambda_j[\psi](h)\psi(h),
 \qquad 0\le j\le J,                                      \tag{8}
\]

are linearly independent for every finite `J`.  Indeed, in a nontrivial
linear relation choose the largest index `j_*`.  Divide by
`h^2 psi(h)^2 z^(2j_*)` and let `h` tend to infinity.  Equation (7) leaves
the nonzero constant `2(-1)^(j_*)4^(j_*)` times the top coefficient, a
contradiction.

This is the point at which the actual theta arithmetic enters the
perturbation argument.  Mere abstract smoothness would not supply the
triangular powers `z^(2j)`.

## 3. Exact preservation of all old moments while the newest moment moves

Linear independence in (8) implies that there are positive points
`a_0,...,a_J` for which the evaluation matrix
`(Gamma_i(a_l))_(0<=i,l<=J)` is nonsingular.  For `lambda>0`, set

\[
 q_{\ell,\lambda}(h)
 =e^{-\lambda\{\cosh(2(h-a_\ell))-1\}}
  +e^{-\lambda\{\cosh(2(h+a_\ell))-1\}}.                   \tag{9}
\]

These functions are even, positive, bounded, real analytic, and Schwartz.
The approximate-identity limit gives

\[
 \sqrt{2\lambda\over\pi}
 Dm_i[\psi](\psi q_{\ell,\lambda})
 =\sqrt{2\lambda\over\pi}\int\Gamma_iq_{\ell,\lambda}
 \longrightarrow2\Gamma_i(a_\ell).                         \tag{10}
\]

Hence the Jacobian in (10) is nonsingular for all sufficiently large fixed
`lambda`.  Increase `lambda` further, if necessary, so that
`lambda e^(-2a_l)/2>3pi` for every `l`.  Then each packet and every fixed
derivative is `O(e^{-(3+delta)z}poly(z))` at the relevant spatial end for
some `delta>0`, hence smaller than the first omitted theta orbit.  Fix such
a `lambda`, abbreviate the packets by `q_l`, and define

\[
 \psi_x(h)=\psi(h)\left(1+\sum_{\ell=0}^Jx_\ell q_\ell(h)\right),
 \qquad x\in\mathbb R^{J+1}.                               \tag{11}
\]

For small `x`, this profile is strictly positive, even, real analytic on the
real line, and Schwartz.  Moreover the relative perturbation and all its
fixed real derivatives lie below the `e^(-3z)` orbit-gap scale at both
spatial ends, so the differentiated first-orbit hierarchy (5)--(6) is
unchanged with the same type of remainder.

The map

\[
 x\longmapsto(m_0[\psi_x],\ldots,m_J[\psi_x])                \tag{12}
\]

is real analytic (in fact quadratic) and has nonsingular derivative at
zero.  The finite-dimensional inverse-function theorem therefore proves:

\[
 \boxed{
 \begin{gathered}
 \text{for every sufficiently small real }\tau\text{ there is }x(\tau)
 \text{ such that}\\
 m_j[\psi_{x(\tau)}]=m_j[\psi]\quad(0\le j<J),\\
 m_J[\psi_{x(\tau)}]=m_J[\psi]+\tau .
 \end{gathered}}                                             \tag{13}
\]

Now take an actual reverse-anchor extension with

\[
 r\in\{0,1\},\qquad n\ge2,\qquad
 k=r+2n-2,\qquad J=k+2.                                    \tag{14}
\]

Assume the old integrated prefix is positive semidefinite, `m_k>0`, and
`eta in Ran(P)`, exactly as in the singular-safe reverse-anchor theorem.
Since (13) fixes every moment through `m_(k+1)`, it fixes `P`, `eta`, the
anchor, the old prefix, and the range condition.  The next pivot obeys

\[
 \boxed{
 \mathcal S_{n,r}[\psi_{x(\tau)}]
 =\mathcal S_{n,r}[\psi]+\tau.}                              \tag{15}
\]

Equation (15) is stronger than the formal free-last-moment observation: it
realizes the freedom by positive, even, real-analytic Schwartz sources with
the differentiated first-orbit tail preserved through the actual orbit-gap
scale.  It does **not** say that a small perturbation flips the sign of the
actual pivot, and it does not remain inside the discrete Jacobi theta orbit
family.

The covariance form has additional hypotheses: `c_k>0` almost everywhere
and convergence of the displayed quotient integrals.  The construction
above is a denominator-free obstruction and does not assert that these
pointwise hypotheses survive at an arbitrary rung.  When a particular
anchor has a quantitative strict pointwise margin, their stability under a
sufficiently small perturbation is an ordinary compact-plus-tail argument;
no such all-degree margin is assumed here.

## 4. The exact Jacobi orbit-score recursion

The perturbation theorem shows that old moments and tail structure alone are
insufficient.  One concrete additional structure is the exact positive-orbit
law.  For `h>=0`, set

\[
 z_n=\pi n^2e^{2h},\qquad
 \phi_n(h)=4z_n(2z_n-3)e^{h/2-z_n},\qquad
 \psi(h)=\sum_{n\ge1}\phi_n(h).                              \tag{16}
\]

Every `phi_n` is positive because `z_n>=pi>3/2`.  Define the orbit
probability and its exact score

\[
 p_n(h)={\phi_n(h)\over\psi(h)},\qquad
 \sigma_n(h)=\partial_h\log\phi_n(h)
 ={5\over2}+{4z_n\over2z_n-3}-2z_n.                         \tag{17}
\]

Write `E_h` for expectation under `p_n(h)` and
`bar(sigma)=E_h[sigma]`.  For any differentiable orbit observable `A_n(h)`,

\[
 \boxed{
 {d\over dh}E_h[A]
 =E_h[A']+\operatorname{Cov}_h(A,\sigma).}                  \tag{18}
\]

Equivalently introduce the centered covariant derivative

\[
 (\mathscr T_hA)_n
 =A_n'+(\sigma_n-\bar\sigma)A_n,
 \qquad {d\over dh}E_h[A]=E_h[\mathscr T_hA].               \tag{19}
\]

For `ell=log psi`, iteration is exact even though `mathscr T_h` depends on
`h`:

\[
 \boxed{
 \ell^{(s)}(h)=E_h[\mathscr T_h^{\,s-1}\sigma]
 \qquad(s\ge1).}                                             \tag{20}
\]

Here powers of `mathscr T_h` mean differential-operator composition: every
successive application differentiates all `h`-dependent coefficients,
including `bar(sigma)(h)`.

Let `B_j` be the complete exponential Bell polynomial.  Since

\[
 \log{\psi(h-a)\psi(h+a)\over\psi(h)^2}
 =2\sum_{s\ge1}{\ell^{(2s)}(h)\over(2s)!}a^{2s},             \tag{21}
\]

the normalized Bell coefficient has the exact arithmetic expression

\[
 \boxed{
 {c_j(h)\over\psi(h)^2}
 ={(-1)^j\over4^j}
 B_{2j}\!\left(0,2E_h[\mathscr T\sigma],0,
 2E_h[\mathscr T^3\sigma],\ldots,
 2E_h[\mathscr T^{2j-1}\sigma]\right).}                    \tag{22}
\]

The final argument of a complete Bell polynomial enters with coefficient
one.  Thus, for a polynomial `mathcal P_j` in only the lower displayed orbit
averages,

\[
 \boxed{
 {c_j\over\psi^2}
 ={(-1)^j\over4^j}
 \left\{2E_h[\mathscr T^{2j-1}\sigma]+\mathcal P_j(h)\right\}.} \tag{23}
\]

Equations (18)--(23) retain the positive orbit weights, the explicit score,
and every covariance created by differentiating those weights.  Replacing
`E_h[mathscr T^(2j-1)sigma]` by an absolute derivative envelope would discard
the very arithmetic correlation sought here.

## 5. The next joint arithmetic lemma

Put `j=k+2` in (23).  The newest integrated moment is

\[
 m_{k+2}
 ={2(-1)^{k+2}\over4^{k+2}}
 \int_0^\infty h^2\psi(h)^2
 \left\{2E_h[\mathscr T^{2k+3}\sigma]+\mathcal P_{k+2}(h)\right\}dh. \tag{24}
\]

Under the old-prefix/range hypotheses in (14), the exact noncircular
source-specific obligation is the **joint orbit-score payment**

\[
 \boxed{
 {2(-1)^{k+2}\over4^{k+2}}
 \int_0^\infty h^2\psi^2
 \{2E_h[\mathscr T^{2k+3}\sigma]+\mathcal P_{k+2}\}\,dh
 \ \ge\ {m_{k+1}^2\over m_k}+\eta^*P^\dagger\eta .}       \tag{25}
\]

All quantities in (25) are fixed complete-theta arithmetic; no next-pivot
sign is inserted as a premise.  Algebraically, however,

\[
 \text{left side of (25)}-\text{right side of (25)}
 =\mathcal S_{n,r}.                                           \tag{26}
\]

Thus (25) is a sharp target, not yet a weaker theorem.  A successful proof
must derive from the special weights `p_n`, score (17), and their modular
center coupling a positive representation or a monotone comparison for the
**whole** difference in (26).  Separate bounds on the high score, the lower
Bell polynomial, and the old regression cost repeat the discarded Cauchy
loss.

If additionally `c_k>0` almost everywhere and the quotient integrals
converge, (25) is exactly the directional covariance statement

\[
 E_\nu[w^*\mathcal L(h)w]
 +\operatorname{Var}_\nu(w^*Y(h))\ge0,
 \quad w=(-G^\dagger\xi,1),                               \tag{27}
\]

with `dnu=2h^2c_k(h)dh/m_k` and `xi in Ran(G)`.  The score form (25) says
precisely which additional Jacobi datum must sign (27): the top covariant
orbit-score average in (23), assembled before the old-prefix payment.

## Failure modes and nonclaims

- The perturbations (11) preserve evenness, positivity, real analyticity,
  Schwartz decay, and the differentiated first-orbit tail through the
  complete-theta orbit-gap scale.  They do not
  preserve the Jacobi heat equation or the exact arithmetic orbit
  coefficients, so they are not alternate Riemann theta functions.
- Equation (15) provides local two-sided freedom.  It does not assert that
  the actual pivot can be driven through zero while positivity is retained.
- The denominator-free reverse-anchor statement uses `r in {0,1}`, `n>=2`,
  `m_k>0`, old-prefix positivity, and `eta in Ran(P)`.  The probability form
  (27) additionally uses `c_k>0` almost everywhere and quotient-integral
  convergence.
- The orbit-score recursion is an identity.  Positivity of the orbit weights
  alone supplies no sign to high covariant score averages.
- No finite-degree computation or finite orbit packet is used as evidence
  for an all-degree sign, and no RH conclusion follows.

## Self-audit

The normalization in (1)--(4) was checked against the independent
Bell--Sobolev derivation in `H5_ASSEMBLED_SCHUR_NEXT.md`.  The leading term in
(7) follows both by differentiating the first orbit and by retaining the
highest derivative in (4).  The Jacobian in (10) is the same Fréchet matrix
as (3), and the inverse-function step changes no old moment in (13).  Finally,
(24)--(26) were checked directly against
`S_(n,r)=m_(k+2)-m_(k+1)^2/m_k-eta^*P^dagger eta`.  These checks establish
the identities and route limitation only; they do not verify (25).

As an independent normalization replay, a 50-digit direct orbit sum at
`h=0.7` matched `ell'=E[sigma]`,
`ell''=E[sigma']+Var(sigma)`, and the direct `c1,c2` derivatives from (22),
with maximum discrepancy below `6e-48`.  Separately, Gaussian test functions
verified (3)--(4) for `j=0,...,4` by direct quadrature, with discrepancy below
`4e-40`.  These floating checks only guard signs and factors; no claim uses
them as a certificate.
