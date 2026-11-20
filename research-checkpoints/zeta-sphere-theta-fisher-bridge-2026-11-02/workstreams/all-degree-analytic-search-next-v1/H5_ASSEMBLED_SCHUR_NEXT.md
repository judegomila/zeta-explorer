# The assembled H5 Schur payment in Sobolev and Riccati coordinates

## Scope and outcome

This note keeps the three terms in equation (19) of
`H5_SIGNED_C5_PAYMENT_NEXT.md` assembled.  It does not bound the signed
bottom-Turan integral, the ratio variance, and the old-prefix cost
separately.  Three exact results follow.

1. For every `k>=1`, the integrated Bell moment has a two-term Sobolev form:

   \[
    M_k=\int_{\mathbb R}h^2(\psi^{(k)}(h))^2\,dh
       -{k\over2}\int_{\mathbb R}(\psi^{(k-1)}(h))^2\,dh.
   \]

2. The full H5 Schur pivot is one undivided Fourier-side expression.  For
   its monic residual polynomial `P`, and for any auxiliary polynomial `g`,
   its exact normalization `2pi S_5` is a positive square plus one scalar
   integral against the positive measure `W(t)^2dt`, where `W=2Xi`.
   Positivity of that one integral is a noncircular sufficient condition for
   the exact assembled H5 payment.

3. No choice of polynomial `g` can make the remaining density pointwise
   nonnegative.  The best possible leading square misses the required H5
   coefficient by exactly `9/4`.  Thus the new coordinate system exposes a
   sharp theta-specific integrated target; it does not turn H5 into a
   source-free Hardy inequality.

A noncertifying diagnostic says that the degree-three auxiliary space is
already large enough to make the scalar remainder integral positive for the
actual H5 residual.  This suggests a short alternative fixed-H5 certificate,
but no interval proof is supplied here and no all-degree or RH conclusion is
made.

## 1. Domain and Bell normalization

Use the audited complete-theta profile and Fourier convention

\[
 W(t)=\widehat\psi(t)=\int_{\mathbb R}\psi(h)e^{-ith}\,dh=2\Xi(t).
 \tag{1}
\]

The profile and all its derivatives are Schwartz.  Hence every integration
by parts and every Fourier differentiation below has zero boundary term.
There is no division by `W`, so real zeros of `Xi` cause no domain issue.

Recall

\[
 c_k(h)={(-1)^k\over4^k}
 \left.\partial_a^{2k}
 \{\psi(h-a)\psi(h+a)\}\right|_{a=0},             \tag{2}
\]

and, because `c_k` is even,

\[
 M_k=2\int_0^\infty h^2c_k(h)\,dh
    =\int_{\mathbb R}h^2c_k(h)\,dh.              \tag{3}
\]

These are the `M_k` used by `H5_SIGNED_C5_PAYMENT_NEXT.md`.

## 2. Exact weighted Sobolev identity

Expanding (2) gives

\[
 c_k={(-1)^k\over4^k}
 \sum_{r=0}^{2k}(-1)^r{2k\choose r}
 \psi^{(r)}\psi^{(2k-r)}.                        \tag{4}
\]

Put

\[
 H_k=\int_{\mathbb R}h^2(\psi^{(k)})^2\,dh,
 \qquad
 A_{k-1}=\int_{\mathbb R}(\psi^{(k-1)})^2\,dh.
\]

Plancherel, followed by one integration by parts in frequency, gives the
polarized identity

\[
 \int_{\mathbb R}h^2\psi^{(r)}\psi^{(2k-r)}\,dh
 =(-1)^{k-r}
 \{H_k+[r(2k-r)-k^2]A_{k-1}\}.                  \tag{5}
\]

All signs in (4)--(5) cancel.  Under the binomial weights in (4),

\[
 {1\over4^k}\sum_{r=0}^{2k}{2k\choose r}r(2k-r)
 =k^2-{k\over2}.                                 \tag{6}
\]

Consequently

\[
 \boxed{
 M_k=H_k-{k\over2}A_{k-1}
 =\int h^2(\psi^{(k)})^2\,dh
  -{k\over2}\int(\psi^{(k-1)})^2\,dh.}          \tag{7}
\]

This identity is valid for every `k>=1`; it assumes no Bell-fiber sign and no
Xi--Laguerre sign.

For later use, (7) has the equivalent undivided frequency form

\[
 \boxed{
 M_k={1\over2\pi}\int_{\mathbb R}
 \left\{t^{2k}W'(t)^2
 -{k(2k-1)\over2}t^{2k-2}W(t)^2\right\}dt.}       \tag{8}
\]

Indeed,

\[
 \int h^2(\psi^{(k)})^2dh
 ={1\over2\pi}\int
 \{t^{2k}W'^2+k(1-k)t^{2k-2}W^2\}\,dt.
\]

Equation (8) also follows from the audited spectral identity
`M_k=pi^(-1) integral t^(2k)(Xi'^2-Xi Xi'')dt`.

## 3. The complete H5 residual as one scalar integral

Let

\[
 A=\begin{pmatrix}M_1&M_2\\M_2&M_3\end{pmatrix},
 \qquad b=\binom{M_3}{M_4},
\]

and define the monic quadratic

\[
 P(z)=z^2+uz+v,
 \qquad
 \binom vu=-A^{-1}b.                              \tag{9}
\]

Thus

\[
 vM_1+uM_2+M_3=0,
 \qquad
 vM_2+uM_3+M_4=0.                                \tag{10}
\]

The H5 Schur pivot is exactly

\[
 \begin{aligned}
 \mathcal S_5
 &=M_5+2uM_4+(u^2+2v)M_3+2uvM_2+v^2M_1\\
 &=M_5-b^*A^{-1}b.
 \end{aligned}                                    \tag{11}
\]

Set

\[
 w(t)=t^2P(t^2)^2.                                \tag{12}
\]

Summing (8), or integrating the `Xi` expression once without separating any
regional term, gives

\[
 \boxed{
 \mathcal S_5={1\over2\pi}\int_{\mathbb R}
 \left\{w(t)W'(t)^2-{w''(t)\over4}W(t)^2\right\}dt.} \tag{13}
\]

Writing `z=t^2`, put

\[
 B_P(z)={1\over4}
 \left.{d^2\over dt^2}\{t^2P(t^2)^2\}\right|_{t^2=z}.
\]

For (9), this polynomial is

\[
 \boxed{
 B_P(z)={45\over2}z^4+28uz^3
 +\left({15\over2}u^2+15v\right)z^2
 +6uvz+{v^2\over2}.}                             \tag{14}
\]

Equations (13)--(14) are precisely the assembled quantity

\[
 \int_0^\infty2h^2c_3\mathcal P_5\,dh
 +M_3\operatorname{Var}_\nu(c_4/c_3)-E_5
\]

from the preceding note.  No one of those three terms is estimated alone.

## 4. A correlated auxiliary-square hierarchy

Let `g` be any real polynomial in `z`.  The cross term in the square

\[
 \{tP(t^2)W'(t)+g(t^2)W(t)\}^2
\]

can be integrated exactly.  Define

\[
 \boxed{
 \mathcal R_{P,g}(z)
 =P(z)g(z)+2z(Pg)'(z)-g(z)^2-B_P(z).}             \tag{15}
\]

Then

\[
 \boxed{
 2\pi\mathcal S_5
 =\int_{\mathbb R}\{tP(t^2)W'+g(t^2)W\}^2dt
 +\int_{\mathbb R}\mathcal R_{P,g}(t^2)W^2dt.}  \tag{16}
\]

This is an exact identity, not a Cauchy estimate.  In particular,

\[
 \boxed{
 \int_{\mathbb R}\mathcal R_{P,g}(t^2)W(t)^2dt\geq0
 \quad\Longrightarrow\quad \mathcal S_5\geq0.}  \tag{17}
\]

Condition (17) is source-specific through both the actual residual `P` and
the complete Xi weight `W^2`.  It is also noncircular: all quantities can be
formed without assuming the sign of `mathcal S_5`.

There is a sharp finite-dimensional version.  Put

\[
 J_m=\int_{\mathbb R}t^{2m}W(t)^2dt,
 \qquad G_d=(J_{i+j})_{i,j=0}^d,                  \tag{18}
\]

and write `P(z)=sum_(r=0)^2 p_r z^r`, with
`(p_0,p_1,p_2)=(v,u,1)`.  If

\[
 \lambda_j=\sum_{r=0}^2[1+2(r+j)]p_rJ_{r+j}
 \quad(0\leq j\leq d),                           \tag{19}
\]

and

\[
 \beta_P=\int_{\mathbb R}B_P(t^2)W(t)^2dt,
\]

then maximizing the second integral in (16) over `deg(g)<=d` gives

\[
 \boxed{
 \mathcal C_d={1\over4}\lambda^*G_d^{-1}\lambda-\beta_P.} \tag{20}
\]

The moment Gram `G_d` is positive definite.  Therefore `C_d>=0` is one
explicit scalar sufficient inequality for the full H5 payment.  It uses the
combined vector before taking any absolute-value bound.

Moreover,

\[
 \mathcal C_d=2\pi\mathcal S_5
 -\inf_{\deg g\leq d}
 \int\{tP(t^2)W'+g(t^2)W\}^2dt,                  \tag{21}
\]

so `C_d` is increasing in `d` and never exceeds `2pi S_5`.  The exponential
decay of `W^2` makes its Hamburger moment problem determinate and ordinary
polynomials dense in `L2(W^2dt)`.  By symmetry, polynomials in `z=t^2` are
dense in the even subspace.  The even function represented almost everywhere
by `-tP W'/W` belongs to that weighted space because `tP W'` is square
integrable; its apparent poles at the discrete zeros of `W` are harmless in
the weighted norm.  Hence (21) also gives

\[
 \mathcal C_d\uparrow2\pi\mathcal S_5.           \tag{22}
\]

Thus the infinite hierarchy is a coordinate form of the target, not an
independent positivity theorem.  A fixed low-degree inequality such as
`C_3>0`, however, would be a genuine finite auxiliary-square certificate.

## 5. The sharp `9/4` pointwise obstruction

It is tempting to prove (17) by making `R_(P,g)(z)` nonnegative for every
`z>=0`.  This is impossible for every polynomial `g`.

First take

\[
 g(z)=az^2+bz+c.
\]

The coefficient of `z^4` in (15) is

\[
 -a^2+9a-{45\over2}
 =-\left(a-{9\over2}\right)^2-{9\over4}<0.       \tag{23}
\]

The number `9/4` is exact.  The leading H5 term asks for the weighted Hardy
constant `45/2`, while the best square supplies only
`81/4`; their difference is `9/4`.  At the other endpoint, the constant term
is

\[
 -c^2+cv-{v^2\over2}
 =-\left(c-{v\over2}\right)^2-{v^2\over4}.       \tag{24}
\]

If `deg(g)>=3`, the leading term of `-g^2` has strictly higher degree than
the derivative term `P g+2z(Pg)'`, and the tail is again negative.  Equations
(23)--(24) prove

\[
 \boxed{
 \text{no polynomial }g\text{ makes }
 \mathcal R_{P,g}(z)\geq0\text{ on }[0,\infty).} \tag{25}
\]

This does not refute the integrated condition (17).  It shows exactly where
complete-theta mass placement, rather than a source-free pointwise Hardy
factorization, must enter.

## 6. A bounded diagnostic and the next exact target

The noncertifying H5 values already recorded in
`H5_SIGNED_C5_PAYMENT_NEXT.md` give

\[
 u\simeq-115.1343406,
 \qquad v\simeq2007.265487.                       \tag{26}
\]

A separate 40-decimal quadrature of the standard `Xi` formula gives, for
`F=Xi=W/2`,

\[
 \begin{array}{c|rrrrrrr}
 m&0&1&2&3&4&5&6\\ \hline
 \int t^{2m}F^2dt
 &2.00906&20.5076&602.046&28190.3
 &1.77023\,10^6&1.37988\,10^8&1.29836\,10^{10}.
 \end{array}                                      \tag{27}
\]

Solving (20) in the cubic auxiliary space gives

\[
 g(z)\simeq
 46.27648+83.20852z-5.235379z^2+0.04726218z^3,
\]

and, in the `F^2` normalization,

\[
 \mathcal C_0\simeq-2.54390\,10^6,
 \quad
 \mathcal C_1\simeq-2.13504\,10^6,
 \quad
 \mathcal C_2\simeq-1.79780\,10^6,
 \quad
 \boxed{\mathcal C_3\simeq2.16431\,10^5>0.}      \tag{28}
\]

Replacing `F` by `W=2F` multiplies every `C_d` by four and does not change
its sign or the optimizing `g`.  The inputs in (26) are rounded diagnostics,
and (27)--(28) are not interval enclosures.  They are route-selection data,
not proof evidence.

The next theorem-shaped H5 target is therefore the single inequality

\[
 \boxed{\mathcal C_3>0}                            \tag{29}
\]

with `P` defined by the exact complete-theta moments (9) and the `J_m`
defined by (18).  It can be attacked directly through complete-theta
arithmetic or a Jacobi phase-space identity.  A proof of (29) would certify
the exact scalarization in equation (19) of the preceding note without
separating its signed components.  It would still be only an H5 theorem; an
all-degree argument would need a uniform analogue whose auxiliary complexity
and margin remain controlled as the residual degree grows.

## Nonclaims

- Equations (7), (13), and (16) are exact identities, not positivity proofs.
- The polynomial pointwise no-go (25) does not rule out the integrated
  complete-theta condition (17).
- The decimals in (26)--(28) are nonrigorous diagnostics and do not replace
  the existing audited H5 certificate.
- The hierarchy (20)--(22) becomes equivalent to the target in the limit; it
  is not an all-degree shortcut.
- No first Xi--Laguerre sign, higher-rung sign, or RH conclusion is made.
