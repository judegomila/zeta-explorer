# Turan profile and the directional paid-Schur border

## Scope

This note connects the positive theta conditional-variance profile in
`THETA_TURAN_NEXT.md` to the exact paid-twin border in
`PAID_SCHUR_NEXT.md`.  The connection is an exact finite directional
identity.  It does not make the conditional-variance profile a covariance
kernel, prove the next border, establish the endpoint sign, or imply RH.

Use the Fourier convention

\[
 \widehat R(\nu)=\int_{\mathbb R}R(u)e^{-i\nu u}\,du
 =f(\nu),
 \qquad
 f=\Xi'^2-\Xi\Xi'',                                \tag{1}
\]

where

\[
 R(u)=\frac12(\psi*\psi)(u)
 \operatorname{Var}(\mathsf X\mid\mathsf X+\mathsf Y=u)>0              \tag{2}
\]

for independent random variables with density proportional to the positive
complete-theta profile `psi`.  The target form is

\[
 \mathfrak q(p)=\frac1\pi\int_{\mathbb R}
 f(\nu)|p(i\nu)|^2\,d\nu.                           \tag{3}
\]

All Fourier and differential interchanges below are absolute because `R` is
even and Schwartz with faster-than-Gaussian decay.

## Exact jet identity

Fourier inversion gives, for every real polynomial `p`,

\[
 \boxed{
 \mathfrak q(p)
 =2\,[p(D)p(-D)R](0).}                              \tag{4}
\]

Indeed, expanding the two polynomials reduces (4) to

\[
 R^{(m)}(0)=\frac1{2\pi}\int_{\mathbb R}
 (i\nu)^m f(\nu)\,d\nu.
\]

If `p` has parity `n mod 2`, then `p(-D)=(-1)^n p(D)`, so

\[
 \mathfrak q(p)=2(-1)^n[p(D)^2R](0).                \tag{5}
\]

Substituting (2) yields the completely real theta formula

\[
 \boxed{
 \mathfrak q(p)
 =[p(D)p(-D){(\psi*\psi)V\}](0),
 \quad
 V(u)=\operatorname{Var}(\mathsf X\mid
                         \mathsf X+\mathsf Y=u).}   \tag{6}
\]

Equation (6) differentiates the product of the convolution density and its
conditional variance.  Positivity of `V(u)` does not give the sign of these
alternating derivatives.

## The paid border is one confluent Turan minor

Let `P` be an old same-parity polynomial space on which `q` is positive
definite, let `p` be the new monic representative, and let `pi=p-q_Q`, where
`q_Q in P` is the old-target regression:

\[
 \mathfrak q(q,\pi)=0\qquad(q\in P).                 \tag{7}
\]

The Schur complement of the old target block is

\[
 S(p)=\mathfrak q(\pi).                              \tag{8}
\]

Combining (4), (8), and the two-regression identity
`2S=A_X-B_Y-C_XY` gives

\[
 \boxed{
 A_X-B_Y-C_{XY}
 =4\,[\pi(D)\pi(-D)R](0)}                           \tag{9}
\]

and, using (2),

\[
 \boxed{
 A_X-B_Y-C_{XY}
 =2\,[\pi(D)\pi(-D){(\psi*\psi)V\}](0).}         \tag{10}
\]

Thus the paid-Schur border is exactly one confluent positive-definiteness
minor of the Turan interaction profile.  It is not an ordinary pointwise
conditional variance.

More explicitly, for real basis polynomials `p_j` in the old space and the
new representative, put

\[
 K_{jk}=[p_j(D)p_k(-D)R](0).                         \tag{11}
\]

The target Gram is `2K`.  For monomials this reads

\[
 K_{jk}=(-1)^kR^{(j+k)}(0).                          \tag{12}
\]

When the old block is nonsingular, (9) is equivalently

\[
 A_X-B_Y-C_{XY}
 =4\,\frac{\det K_{\rm new}}{\det K_{\rm old}},    \tag{13}
\]

after using a monic triangular basis so that the determinant ratio is the
new scalar Schur complement.  Equation (13) is a finite confluent minor, not
a claim that all translation Grams of `R` are positive.

## How the mismatch enters the Turan residual

In the coefficient notation of `PAID_SCHUR_NEXT.md`, let

\[
 \alpha_X=G_X^{-1}b_X,
 \qquad Q=G_X-G_Y,
 \qquad r=b_Y-G_Y\alpha_X.                          \tag{14}
\]

The old-target regression coefficients solve

\[
 Q\alpha_Q=b_X-b_Y.
\]

Since `G_X=Q+G_Y`, equation (14) gives the exact relation

\[
 \boxed{\alpha_Q=\alpha_X-Q^{-1}r.}                 \tag{15}
\]

Consequently

\[
 \pi=p-q_X+q_{Q^{-1}r}.                             \tag{16}
\]

Here `q_(Q^-1 r)` denotes the old polynomial with coefficient vector
`Q^-1 r` in the chosen basis.

The Turan weight in (9) therefore already contains the signed mismatch
correction.  Replacing `pi` by the positive `X`-regression residual
`p-q_X` drops `Q^{-1}r` and is not an upper or lower bound without an
additional theta-specific estimate.  On the `Y` side,
`G_Y(\alpha_Y-\alpha_X)=r`; the other part of

\[
 C_{XY}=r^*(G_Y^\dagger+Q^{-1})r                    \tag{17}
\]

measures the same regression displacement in the `Y` quotient.  Equations
(15)--(17) show that the conditional-variance jet and the paid mismatch are
the same directional correction in different coordinates.

## Exact primitive-curvature version

Let

\[
 M_1(a)=\int_0^\infty h^2\psi(h-a)\psi(h+a)\,dh,
\]

so that `f(t)=2 M1hat(2t)`.  With the notation of
`ONE_NEGATIVE_DIRECTION_NEXT.md`,

\[
 \widehat M_1(\kappa)
 =\frac1{256}
 \left.\partial_a^2
 \{P_a(\kappa)\mathcal F_a(\kappa)\}\right|_{a=0}. \tag{18}
\]

Changing variables `kappa=2t` in (3) and using (18) gives the directional
formula

\[
 \boxed{
 A_X-B_Y-C_{XY}
 =\frac1{128\pi}\int_{\mathbb R}
 \left|\pi\!\left(\frac{i\kappa}{2}\right)\right|^2
 \left.\partial_a^2
 \{P_a(\kappa)\mathcal F_a(\kappa)\}\right|_{a=0}
 \,d\kappa.}                                       \tag{19}
\]

No division by `mathcal F_0`, `Xi`, or the endpoint density occurs in (19),
so zeros cause no domain problem.  For one rung it is enough to prove the
weighted integral (19) nonnegative; pointwise transverse curvature is
stronger.  Requiring (19) for every compatible rung, however, recovers the
same endpoint closure.

## Where the covariance interpretation becomes circular

If `R` were already known positive definite, there would be a stationary
second-order process `Z(u)` with covariance `R(u-v)`.  Then

\[
 K_{jk}
 =\operatorname{Cov}
 \bigl(p_j(D)Z(0),p_k(D)Z(0)\bigr),                 \tag{20}
\]

and `S/2` would be the conditional variance of the new derivative jet after
linear regression on the old jets.  This is a valid interpretation only
after the missing sign is supplied:

- `R` is positive definite if and only if `f=Rhat>=0`, the endpoint sign;
- for a single finite extension, the joint derivative covariance matrix is
  positive semidefinite if and only if its Schur complement `S` is
  nonnegative;
- the positive random-variable identity (2) is pointwise in `u` and does not
  couple different values of `u` into a stationary covariance process;
- an `L2` autocorrelation factor for `R`, a positive de Branges kernel, or the
  pointwise primitive-curvature inequality would insert the same missing
  sign.

Therefore neither (2) nor covariance language proves (9).  The noncircular
remaining target is the directional, zero-safe integral (19), or equivalently
the exact regression-mismatch inequality

\[
 r^*(G_Y^\dagger+Q^{-1})r\leq A_X-B_Y.              \tag{21}
\]

## Nonclaims

- This note does not prove (19) or (21) at any new rung or uniformly.
- It does not make `R` positive definite from its pointwise positivity.
- It does not replace the old signed inverse `Q^{-1}` by a positive-parent
  inverse.
- It does not establish the endpoint density sign, an all-degree bridge, or
  RH.
