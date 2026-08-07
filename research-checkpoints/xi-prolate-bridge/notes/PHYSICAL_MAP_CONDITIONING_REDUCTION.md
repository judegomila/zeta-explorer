# Physical arithmetic/parity map: injectivity and the quantitative Gram target

## 1. Claim boundary

This note proves qualitative injectivity of the continuous arithmetic/parity
map on the locked half-integer schedule for finite-dimensional analytic
source spaces.  It also gives an exact Möbius lower bound before parity and
reduces uniform physical conditioning to one normalized Gram determinant or
row-minor inequality.

The result removes a possible exact-rank obstruction.  It is deliberately
non-effective in `lambda`: no prescribed Fourier bandwidth, uniform smallest
singular value, signed Weil comparison, shifted-sector floor, or resolvent
rate follows.  The repository state remains `P0_INVALIDATED`.

The later `notes/QUOTIENT_EXTERIOR_PRECONDITIONER.md` shows that a lower
physical singular value is not intrinsic to the positive zero-sampling
action.  Minimum-source-energy descent works directly on the physical range
and needs only a largest singular-value bound.  The determinant/minor target
below remains relevant to proof routes and implementations that explicitly
orthonormalize the physical source columns; it is no longer a mandatory
input to every residual-action route.

## 2. Arithmetic map and exact Möbius inversion

For a source function supported in `[-lambda,lambda]`, write on

\[
 I_\lambda=[\lambda^{-1},\lambda]
\]

\[
 (A_\lambda f)(u)
 =\sqrt u\sum_{m\le\lambda/u}f(mu).                         \tag{2.1}
\]

Put `G(u)=A_lambda f(u)/sqrt(u)`.  Finite Möbius inversion gives, for
`x in I_lambda`,

\[
\boxed{
 f(x)=\sum_{n\le\lambda/x}\mu(n)
       \frac{A_\lambda f(nx)}{\sqrt{nx}}.}                  \tag{2.2}
\]

Indeed, substituting (2.1) into the right side makes the coefficient of
`f(kx)` equal to `sum_(n|k) mu(n)`, which is one for `k=1` and zero
otherwise.

Minkowski's inequality and the change of variables `u=nx` give

\[
 \left\|\frac{A_\lambda f(n\,\cdot)}{\sqrt{n\,\cdot}}
 \right\|_{L^2(1/\lambda,\lambda/n;dx)}
 =\frac1{\sqrt n}\|A_\lambda f\|_{L^2(n/\lambda,\lambda;du/u)}.
\]

Consequently

\[
\boxed{
 \|f\|_{L^2(1/\lambda,\lambda;dx)}
 \le S_\lambda
       \|A_\lambda f\|_{L^2(I_\lambda,du/u)},
 \quad
 S_\lambda=\sum_{n\le\lfloor\lambda^2\rfloor}
             \frac{|\mu(n)|}{\sqrt n}
 \le2\lambda.}                                               \tag{2.3}
\]

The last inequality follows from
`sum_(n<=M)n^(-1/2)<=2sqrt(M)`.  Equation (2.3) controls the
unevenized map on the part of the positive source interval visible inside
`I_lambda`.  It does not control mass in the central hole or prevent
cancellation after inversion parity is imposed.

The state-invisible bump in
`notes/EXACT_RADICAL_LEAKAGE_IDENTITY.md` is an exact nonzero kernel vector
for `A_lambda` on `I_lambda`.  Thus no injectivity or conditioning theorem
can be based only on compact support and the zero-integral condition.
Analytic/prolate structure is essential.

## 3. An unmatched-breakpoint injectivity theorem

Let

\[
 (Jg)(u)=g(u^{-1}),\qquad S_s=\frac{I+sJ}{2},qquad s\in\{+1,-1\}.
\]

Consider a finite-dimensional space `F_lambda` whose members are restrictions
of analytic functions to `[-lambda,lambda]`, followed by zero extension.
Finite spans of the raw prolate modes and of their zero-integral source
combinations have this property.

**Theorem 1 (qualitative parity injectivity).**  Let

\[
 \lambda=j+\frac12,qquad j\in\mathbb Z,qquad\lambda>1.
\]

For either sign `s`, the map

\[
 S_sA_\lambda:\mathcal F_\lambda
 \longrightarrow L^2(I_\lambda,du/u)                       \tag{3.1}
\]

is injective.

**Proof.**  Put `g=A_lambda f` and suppose `S_sg=0`.  Then

\[
 g(u)=-s g(u^{-1})                                             \tag{3.2}
\]

almost everywhere.  Both sides are analytic on every open interval avoiding
their finite arithmetic breakpoints, so (3.2) holds identically on each such
interval.

Examine

\[
 u_0=\frac\lambda2.
\]

The two analytic branches of `g(u)` across `u_0` differ exactly by the term

\[
 \sqrt u\,f(2u).                                              \tag{3.3}
\]

The reflected function `g(u^(-1))` has a breakpoint there only if

\[
 \frac2\lambda=\frac\lambda m
 \quad\hbox{for some integer }m,
 \quad\hbox{equivalently}\quad m=\frac{\lambda^2}{2}.
\]

For a half-integer `lambda=(2j+1)/2`,

\[
 \frac{\lambda^2}{2}=\frac{(2j+1)^2}{8}\notin\mathbb Z,     \tag{3.4}
\]

because every odd square is one modulo eight.  Thus the right side of (3.2)
has one analytic continuation across `u_0`, while the two left branches
differ by (3.3).  Subtracting their analytic continuations forces
`f(2u)=0` on a one-sided neighborhood of `u_0`.  Hence `f` vanishes on an
open interval adjacent to `lambda`, and analyticity gives `f=0` identically.
This proves injectivity.  \(\square\)

The proof uses no Weil matrix and applies to both inversion parities.  It is
qualitative: an analytic function can have an arbitrarily small unmatched
endpoint jet without vanishing.

## 4. Eventual Fourier injectivity at fixed `lambda`

Let `P_N` be the locked orthogonal log-Fourier projection.  On the
finite-dimensional image

\[
 Y_s=S_sA_\lambda\mathcal F_\lambda,
\]

strong convergence `P_N->I` is uniform on the unit sphere.  Theorem 1 and
compactness of that sphere give a positive smallest singular value for the
continuous map at each fixed `lambda`.  Therefore there is an index
`N_0(lambda,F_lambda,s)` such that

\[
 P_NS_sA_\lambda|_{\mathcal F_\lambda}
\]

is injective for every `N>=N_0`.

This statement does not show that `N=3 ceil(lambda^2)`, or the separately
locked exponential diagonal, exceeds `N_0` uniformly.  It supplies no
effective lower scale.

## 5. Coordinate-invariant determinant/minor certificate

Choose a source basis with positive source `L2` Gram `B`, let `W` be the
matrix of its physical parity Fourier columns, and put

\[
 R=W^*W,\qquad \widehat R=B^{-1/2}RB^{-1/2}.                 \tag{5.1}
\]

Let the source dimension be `r`.  If explicit values `U` and `gamma` satisfy

\[
 U\ge\|\widehat R\|,
 \qquad
 \det\widehat R\ge\gamma U^{r-1},                           \tag{5.2}
\]

then every eigenvalue of `widehat R` is at most `U`, so its smallest
eigenvalue is at least its determinant divided by `U^(r-1)`.  Hence

\[
\boxed{
 \gamma B\preceq R\preceq U B.}                             \tag{5.3}
\]

By Cauchy--Binet, it is enough to exhibit one `r by r` row minor `I` with

\[
\boxed{
 |\det(WB^{-1/2})_I|^2\ge\gamma U^{r-1}.}                   \tag{5.4}
\]

For the plus family, apply (5.2) or (5.4) first to the augmented family that
contains the label-4 anchor.  If `F` is the actual anchor-deflation map, then

\[
 R_{\rm def}=F^*RF,\qquad B_{\rm def}=F^*BF,
\]

so the same comparison (5.3) survives deflation by congruence.  If the
certificate is proved using the first `M` Fourier modes, it also holds for
every `N>=M`, because adding rows adds a positive semidefinite Gram.

A bare assertion `det R>0` proves rank at one finite point but gives no
usable scale.  Equations (5.2)--(5.4) are the exact quantitative physical-map
obligation.

## 6. Endpoint Wronskian and why fixed jets are insufficient

For a raw normalized prolate mode `y`, the endpoint form of

\[
 (1-z^2)y''-2zy'+(\mu-c^2z^2)y=0                         \tag{6.1}
\]

recursively gives

\[
 y^{(k)}(1)=P_k(\mu)y(1),                                   \tag{6.2}
\]

where `P_k` has degree `k` and leading coefficient

\[
 \frac1{2^k k!}.
\]

The endpoint value is nonzero: otherwise (6.1) recursively kills every
derivative and analyticity kills the eigenfunction.  For `r` distinct modes,
polynomial alternation therefore gives, up to the Vandermonde sign,

\[
\boxed{
 \det[y_j^{(k)}(1)]_{0\le k\le r-1,\,1\le j\le r}
 =\left(\prod_jy_j(1)\right)
  \left(\prod_{k=0}^{r-1}\frac1{2^k k!}\right)
  \prod_{i<j}(\mu_j-\mu_i).}                               \tag{6.3}
\]

Thus the unmatched-breakpoint proof is constructive in principle.  It is
not uniform as written.  An `r`-dimensional family can cancel any fixed
`r-1` endpoint jets, and the present source locks give no growing-index lower
bound for the endpoint product or the eigenvalue Vandermonde in (6.3).
The normalized Gram/minor estimate (5.2) or (5.4), not a fixed-order jump
bound, remains the smallest quantitative target.
