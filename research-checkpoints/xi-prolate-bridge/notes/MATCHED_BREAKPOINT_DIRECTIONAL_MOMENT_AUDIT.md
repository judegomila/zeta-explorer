# Matched breakpoint and directional-moment audit

## 0. Status and claim boundary

This note audits the high-space moment alternative on the matched schedule

\[
 \lambda={p_0\over2},\qquad p_0\geq5\text{ odd},\qquad
 N=\lceil\lambda^2\rceil={p_0^2+3\over4}.                 \tag{0.1}
\]

It proves only finite-dimensional conversion theorems and exact obstruction
models.  In particular, it proves:

1. the sharp moment order needed to convert a one-sided source-moment bound
   into a strict high-space floor;
2. the linear-order conversion obstruction when a chosen certified scalar
   width has scale `lambda` and the high dimension has scale `lambda^2`;
3. an exact positive-pole model on which centered moments fail at every
   order and one-sided moments require linear order;
4. the exact matched Fourier projection of the positive pole representer;
   and
5. an odd-sector rank-one resolvent criterion with an explicit
   `O(log(lambda))` directional Neumann-moment reduction, conditional on a
   logarithmic two-sided multiplier bound;
6. the exact centered log-Fourier rows of the arithmetic map and every
   derivative jump of their adjoint kernels; and
7. an exact parity-preserving function-level countermodel showing that full
   breakpoint-jet rank does not imply any rank after the declared finite
   Fourier projection.

This note does **not** prove the physical source-moment estimates to which
the conversion theorems would apply.  It proves no matched coframe, no
positive signed sector, no residual--gap limit, no locally uniform
determinant convergence, and no Riemann-hypothesis conclusion.  The formal
repository state remains `P0_INVALIDATED`.

## 1. Locked conventions and the physical high operator

Put

\[
 \ell=\log\lambda,\qquad L=2\ell,\qquad
 I_\lambda=[-\ell,\ell].                                  \tag{1.1}
\]

Lebesgue measure is used on `I_lambda`, followed by zero extension.  The
Fourier convention and Plancherel measure are

\[
 \widehat f(t)=\int_{I_\lambda}f(x)e^{-itx}\,dx,
 \qquad d\nu(t)={dt\over2\pi}.                            \tag{1.2}
\]

Inversion is reflection, `Jf(x)=f(-x)`.  The complete real-axis multiplier
is

\[
 \boxed{
 m_\lambda(t)=2\theta'(t)-2S_\lambda(t),\qquad
 S_\lambda(t)=
 \sum_{1<n\leq\lambda^2}{\Lambda(n)\over\sqrt n}
                         \cos(t\log n).}                  \tag{1.3}
\]

Every prime power at the inclusive endpoint `n<=lambda^2` is retained.  The
minus sign in (1.3) is the source sign and is never changed below.  For a
source-reconstructed real shift `U`, put

\[
 w(t)=m_\lambda(t)-U.                                     \tag{1.4}
\]

Let `H` be the actual physical high complement in one inversion sector and
let `d=dim H`.  With

\[
 M_H=P_HT_wP_H,\qquad p_{\epsilon,H}=P_Hp_\epsilon,
 \qquad
 p_+(x)=\cosh(x/2),\quad p_-(x)=\sinh(x/2),              \tag{1.5}
\]

the complete signed high operator is

\[
 \boxed{
 A_{\epsilon,H}=M_H+2\epsilon
 |p_{\epsilon,H}\rangle\langle p_{\epsilon,H}|.}       \tag{1.6}
\]

Thus the even pole is positive and the odd pole is negative.  A Fourier
residue class is not substituted for inversion parity.  Every prolate
source retains its source zero-Lebesgue-integral normalization.

If `d=0`, the high obligation is vacuous.  If `d=1`, its sign is the single
source-reconstructed Rayleigh quotient.  The dimension-dependent estimates
below are relevant for `d>=2`.

## 2. Sharp one-sided moment-width conversion

### Theorem 2.1 (strict target-floor conversion)

Let `A=A*` act on a `d`-dimensional Hilbert space, let `L>0`, and fix
constants

\[
 0\leq\mu<\nu,\qquad M>\nu L.                              \tag{2.1}
\]

Suppose, for an integer `r>=1`, that

\[
 A\preceq MI,
 \qquad
 \operatorname{tr}(MI-A)^r\leq d(M-\nu L)^r.              \tag{2.2}
\]

Then

\[
 \boxed{
 \lambda_{\min}(A)
 \geq M-d^{1/r}(M-\nu L).}                               \tag{2.3}
\]

Consequently the non-strict estimate (2.2) certifies the strict floor

\[
 \lambda_{\min}(A)>\mu L                                  \tag{2.4}
\]

whenever

\[
 \boxed{
 r>r_*:={\log d\over
 \log\{(M-\mu L)/(M-\nu L)\}}.}                          \tag{2.5}
\]

The least integer order guaranteed by (2.5) is

\[
 r_{\min}=\lfloor r_*\rfloor+1.                           \tag{2.6}
\]

**Proof.**  The operator `B=MI-A` is positive semidefinite.  Therefore

\[
 M-\lambda_{\min}(A)=\lambda_{\max}(B)
 \leq\{\operatorname{tr}B^r\}^{1/r}
 \leq d^{1/r}(M-\nu L),                                  \tag{2.7}
\]

which proves (2.3).  The right side of (2.3) is strictly larger than
`mu*L` precisely when

\[
 d^{1/r}<{M-\mu L\over M-\nu L}.                         \tag{2.8}
\]

Taking logarithms proves (2.5)--(2.6).  `square`

The strictness is mandatory.  If `r=r_*` and (2.2) is only non-strict,
(2.3) gives at most `lambda_min(A)>=mu*L`; equality is not a positive
reserve and is rejected.  A separately proved strict improvement in the
trace bound could improve this boundary, but it is not part of (2.2).

For the physical operator (1.6), the exact one-sided trace is

\[
 \mathcal T_{\epsilon,r}(M)
 =\operatorname{tr}(MI-A_{\epsilon,H})^r
 =\sum_{j=0}^r(-1)^j{r\choose j}M^{r-j}
                  \operatorname{tr}A_{\epsilon,H}^j.     \tag{2.9}
\]

Each raw trace in (2.9) is reconstructed by the cyclic source formulas in
`notes/MATCHED_HIGH_MOMENT_COFRAME_REDUCTION.md`.  In particular, every
factor of the multiplier is the complete signed factor (1.3), every mixed
archimedean--prime term is retained, all prime powers at the endpoint are
present, and every pole word carries `(2*epsilon)` to its exact number of
occurrences.  Equation (2.9) is a reconstruction identity, not an estimate
of the size required in (2.2).

## 3. Sharpness and the matched linear-order obstruction

The threshold (2.5) cannot be improved from the data in (2.2).  If
`r=r_*`, take

\[
 A_{\rm bd}=\operatorname{diag}(\mu L,M,\ldots,M).          \tag{3.1}
\]

Then

\[
 \operatorname{tr}(MI-A_{\rm bd})^r=(M-\mu L)^r
 =d(M-\nu L)^r,                                           \tag{3.2}
\]

while `lambda_min(A_bd)=mu*L`, exactly the rejected boundary.  If `r<r_*`,
the inequality in (3.2) is strict before the last equality, so the first
entry can be moved to `mu*L-epsilon` for a sufficiently small
`epsilon>0`.  Thus for every `r<r_*`, the hypotheses permit a matrix whose
minimum is strictly below the target.  This is a logical sharpness theorem
for the conversion, not a model of the physical Weil matrix.

The width scale now matters quantitatively.  Since

\[
 \log(1+x)\leq x\qquad(x\geq0),                            \tag{3.3}
\]

equation (2.5) gives

\[
 \boxed{
 r_*\geq{(M-\nu L)\log d\over(\nu-\mu)L}.}                \tag{3.4}
\]

Suppose along a schedule that

\[
 d\geq c_d\lambda^2,qquad M\geq c_M\lambda             \tag{3.5}
\]

for fixed positive `c_d,c_M`.  For all sufficiently large `lambda`,

\[
 M-\nu L\geq{c_M\lambda\over2},
 \qquad \log d\geq{L\over2}.                              \tag{3.6}
\]

Hence

\[
 \boxed{
 r_*\geq{c_M\over4(\nu-\mu)}\lambda.}                    \tag{3.7}
\]

For the exact matched dimension `d=N=lambda^2+3/4`, one has
`log(d)/L -> 1`; if `M>=c_M*lambda`, (3.4) sharpens asymptotically to

\[
 r_*\geq\left({c_M\over\nu-\mu}+o(1)\right)\lambda.       \tag{3.8}
\]

Therefore a one-sided conversion at order `O(log(lambda))` requires a new
logarithmic-width majorant `M=O(L)`, a source-proved deflation of wider
outliers, or a separately proved much smaller value of `d`.  Applying
(3.7) to a chosen `lambda`-scale majorant does **not** prove that the actual
physical spectral width has that scale.  Conversely, Theorem 2.1 does not
provide the hypothetical physical trace estimate (2.2).  These two
conditional statements must not be conflated.

There is a second source-level limitation.  Expanding (2.9) to order
`r=O(log(lambda))` produces high-degree signed prime products.  The pinned
PNT envelope, fixed-order absolute moments, and the fixed-lambda Haar law do
not estimate the actual cyclic high-space kernel at that order.  Replacing
the cyclic kernel by absolute prime moments discards the minus sign in
(1.3) and is inadmissible.

## 4. Exact positive-pole obstruction for generic moments

Let `d>=2`, let `u` be a unit vector, and consider the positive matrix

\[
 A_+=\alpha L I+P|u\rangle\langle u|,
 \qquad \alpha>0,\quad P>0.                               \tag{4.1}
\]

Its true minimum is `alpha*L`.  Its mean and centered moments are

\[
 \bar a=\alpha L+{P\over d},                               \tag{4.2}
\]

\[
 C_{2k}=P^{2k}\left\{
       \left(1-{1\over d}\right)^{2k}
       +(d-1)d^{-2k}\right\}.                             \tag{4.3}
\]

Substitution into the sharp centered-moment theorem gives, for every
`k>=1`,

\[
 \boxed{
 \bar a-
 \left\{{C_{2k}\over1+(d-1)^{1-2k}}\right\}^{1/(2k)}
 =\alpha L-P{d-2\over d}.}                                \tag{4.4}
\]

Indeed, division by the denominator inside (4.4) leaves
`P^(2k)(d-1)^(2k)/d^(2k)`.  Thus the centered bound can be negative at
**every** order even though (4.1) is positive.  For `d=2`, (4.4) happens to
recover the exact minimum; for `d>=3`, a sufficiently large harmless
positive outlier destroys the bound.  This is the source-relevant
orientation ambiguity of even centered moments.

The one-sided theorem is also expensive on this model.  With the exact
upper endpoint

\[
 M_+=\alpha L+P,                                         \tag{4.5}
\]

one has

\[
 \operatorname{tr}(M_+I-A_+)^r=(d-1)P^r,                \tag{4.6}
\]

and the corresponding lower bound is

\[
 \alpha L+P-P(d-1)^{1/r}.                                \tag{4.7}
\]

For a strict target `mu*L`, where `0<=mu<alpha`, (4.7) is strictly larger
than the target only if

\[
 \boxed{
 r>{\log(d-1)\over
 \log\{1+(\alpha-\mu)L/P\}}.}                            \tag{4.8}
\]

If `d` has matched scale and `P` has scale `lambda`, (4.8) is
`Omega(lambda)`.  Thus a generic complete-moment estimate should not carry
the positive even pole as a harmless but spectrally wide outlier.  It may be
dropped in Loewner order before proving a sufficient multiplier floor:

\[
 A_{+,H}=M_H+2|p_{+,H}\rangle\langle p_{+,H}|
 \succeq M_H.                                             \tag{4.9}
\]

Equation (4.9) is sufficient but not necessary; the positive pole could
rescue a multiplier direction.  No such physical rescue theorem is claimed
here.

## 5. Exact matched projection of the positive pole

Use the centered physical Fourier modes

\[
 \phi_n(x)=(-1)^nL^{-1/2}e^{i\omega_nx},
 \qquad \omega_n={2\pi n\over L}.                         \tag{5.1}
\]

### Theorem 5.1 (positive-pole Fourier coefficients)

For every integer `n`,

\[
 \boxed{
 \langle\phi_n,p_+\rangle
 ={\sinh(\ell/2)\over
   \sqrt L\,(\omega_n^2+1/4)}.}                          \tag{5.2}
\]

Consequently, if `P_N` projects onto the modes `-N<=n<=N`,

\[
 \boxed{
 \|P_Np_+\|^2
 ={\sinh^2(\ell/2)\over L}
 \left\{16+2\sum_{n=1}^N
 {1\over(\omega_n^2+1/4)^2}\right\}.}                  \tag{5.3}
\]

Moreover,

\[
 \boxed{
 \|P_Np_+\|^2\geq
 \sinh\ell+\ell-
 {L^3\sinh^2(\ell/2)\over24\pi^4N^3}.}                 \tag{5.4}
\]

On the matched schedule,

\[
 {\|P_Np_+\|^2\over\lambda/2}\longrightarrow1.          \tag{5.5}
\]

**Proof.**  Evenness and elementary integration give

\[
 \int_{-\ell}^{\ell}\cosh(x/2)e^{-i\omega_nx}\,dx
 ={(-1)^n\sinh(\ell/2)\over\omega_n^2+1/4}.              \tag{5.6}
\]

The conjugate phase in (5.1) cancels `(-1)^n`, proving (5.2).  Summing the
equal `n` and `-n` contributions, including the `n=0` value, proves (5.3).
Parseval and direct integration give

\[
 \|p_+\|^2=\sinh\ell+\ell.                               \tag{5.7}
\]

For the omitted tail,

\[
 \begin{aligned}
 \|(I-P_N)p_+\|^2
 &\leq {2\sinh^2(\ell/2)\over L}
       \sum_{n>N}{1\over\omega_n^4}\\
 &\leq {L^3\sinh^2(\ell/2)\over24\pi^4N^3},
 \end{aligned}                                           \tag{5.8}
\]

using `sum_(n>N)n^(-4)<=1/(3N^3)`.  This proves (5.4).
Finally `N>=lambda^2`, `sinh(ell)=(lambda-lambda^(-1))/2`, and the tail in
(5.8) is `o(lambda)`, proving (5.5).  `square`

This ambient projection is not a physical high-angle theorem.  In the
actual even comparison space `X_(N,+)=E_N^+ intersect kappa^perp`,

\[
 \|P_{X_{N,+}}p_+\|^2
 =\|P_Np_+\|^2-|\langle\kappa,p_+\rangle|^2,              \tag{5.9}
\]

and the subsequent physical low projection can remove more.  No current
estimate bounds either loss uniformly.

## 6. Odd rank-one criterion and directional Neumann moments

Write the odd high operator as

\[
 A_-=M-2|p\rangle\langle p|,
 \qquad M=P_HT_wP_H,\quad p=P_Hp_-.                       \tag{6.1}
\]

### Theorem 6.1 (exact odd rank-one sign)

If `M` is positive definite, then

\[
 \boxed{
 A_-\succ0
 \quad\Longleftrightarrow\quad
 2\langle p,M^{-1}p\rangle<1.}                           \tag{6.2}
\]

More quantitatively, if

\[
 2\langle p,M^{-1}p\rangle\leq1-\delta,
 \qquad0<\delta<1,                                      \tag{6.3}
\]

then

\[
 \boxed{A_-\succeq\delta M.}                            \tag{6.4}
\]

**Proof.**  Put `q=M^(-1/2)p`.  Congruence gives

\[
 A_-=M^{1/2}(I-2|q\rangle\langle q|)M^{1/2}.             \tag{6.5}
\]

The middle factor has eigenvalue `1-2*||q||^2` on `span(q)` and eigenvalue
one on its orthogonal complement.  This proves (6.2); (6.3) makes the middle
factor at least `delta*I`, proving (6.4).  `square`

The equality `2<p,M^(-1)p>=1` produces a zero direction and is rejected.
If `A_->0`, then `M=A_-+2|p><p|` is automatically positive, so requiring
`M>0` in (6.2) loses no successful odd case.

### Theorem 6.2 (directional Neumann-moment reduction)

Assume that fixed constants `0<a<c` satisfy the two-sided logarithmic-width
bound

\[
 aLI\preceq M\preceq cLI.                                \tag{6.6}
\]

Put

\[
 R=I-{M\over cL},\qquad \rho=1-{a\over c}.                \tag{6.7}
\]

Then `0<=R<=rho*I`, and for every integer `s>=1`,

\[
 \boxed{
 2\langle p,M^{-1}p\rangle
 \leq {2\over cL}\sum_{j=0}^{s-1}\langle p,R^jp\rangle
       +{2\|p\|^2\over aL}\rho^s.}                     \tag{6.8}
\]

In particular, if the right side of (6.8) is at most `1-delta`, then

\[
 \boxed{A_-\succeq\delta aL I.}                          \tag{6.9}
\]

**Proof.**  Since `R` is a polynomial in `M`, the two commute, and the exact
finite geometric identity is

\[
 M^{-1}={1\over cL}\sum_{j=0}^{s-1}R^j+R^sM^{-1}.         \tag{6.10}
\]

Spectral calculus and (6.6)--(6.7) give

\[
 0\preceq R^sM^{-1}\preceq{\rho^s\over aL}I.             \tag{6.11}
\]

Taking the quadratic form on `p` proves (6.8).  Equations (6.3)--(6.4) and
the lower bound in (6.6) prove (6.9).  `square`

The terms in (6.8) require only directional moments.  Explicitly,

\[
 \langle p,R^jp\rangle
 =\sum_{k=0}^j(-1)^k{j\choose k}(cL)^{-k}
                  \langle p,M^kp\rangle.                  \tag{6.12}
\]

Every factor of `M` in (6.12) is reconstructed from the complete multiplier
(1.3).  Thus its prime block retains the minus sign, the endpoint is
inclusive, and all archimedean--prime covariances remain combined.  The odd
pole is not omitted: it is the exact vector `p` on both sides of the
directional moments and enters the rank-one criterion (6.2).

The truncation order is logarithmic.  Since

\[
 \|p\|^2\leq\|p_-\|^2=\sinh\ell-\ell<\lambda/2,           \tag{6.13}
\]

the remainder in (6.8) is at most `delta` whenever

\[
 \boxed{
 s\geq
 \max\left\{1,
 \left\lceil{
  \log_+\{\lambda/(aL\delta)\}
  \over-\log(1-a/c)}\right\rceil\right\},}              \tag{6.14}
\]

where `log_+(x)=max(0,log x)`.  For fixed `a,c,delta`, the right side is
`O(log(lambda))`.  For example, it is sufficient to prove that the
truncated directional sum in (6.8) is at most `1-2*delta` and choose (6.14),
so the remainder is at most `delta`.  Equality at the final value one is
not a pass.

Theorem 6.2 isolates two distinct missing source estimates: the physical
two-sided multiplier bound (6.6), and the strict directional reserve for
the finite sum in (6.8).  Neither is proved by the present source locks.

There is also an exact angle consequence when (6.6) is used.  Let

\[
 p_{-,N}=P_Np_-,\qquad
 \eta_-={\|P_Hp_{-,N}\|^2\over\|p_{-,N}\|^2}.             \tag{6.15}
\]

The already proved matched lower bound is

\[
 \|p_{-,N}\|^2\geq B_{\lambda,N},
 \qquad B_{\lambda,N}\sim\lambda/2.                      \tag{6.16}
\]

If `A_->0` and `M<=cL*I`, testing (6.1) on `p` gives, for `p!=0`,

\[
 2\|p\|^2<{
 \langle p,Mp\rangle\over\|p\|^2}\leq cL.               \tag{6.17}
\]

Consequently

\[
 \boxed{
 \eta_-<{cL\over2\|p_{-,N}\|^2}
 \leq{cL\over2B_{\lambda,N}}
 =O\!\left({\log\lambda\over\lambda}\right).}          \tag{6.18}
\]

Thus a logarithmic-width multiplier proof forces strong odd-pole capture.
A complete signed argument could instead prove a larger multiplier action
aligned with `p` and cancel the negative rank-one term; (6.18) is not an
impossibility theorem for that alternative.

## 7. Exact arithmetic Fourier rows and confluent breakpoint rank

The arithmetic map itself is

\[
 (A_\lambda f)(u)=\sqrt u
       \sum_{a\leq\lambda/u}f(au),
 \qquad \lambda^{-1}\leq u\leq\lambda.                 \tag{7.1}
\]

The letter `a` in (7.1) is only an integer summation index; it is unrelated
to the lower multiplier constant in (6.6).  With the centered modes (5.1),
write

\[
 \langle\phi_n,A_\lambda f\rangle
 =\int_{\lambda^{-1}}^\lambda K_n(y)f(y)\,dy.           \tag{7.2}
\]

### Theorem 7.1 (exact adjoint Fourier row)

For every integer `n`, direct substitution and the change of variable
`y=au` give

\[
 \boxed{
 K_n(y)={(-1)^n\over\sqrt L}\,
 y^{-1/2-i\omega_n}
 \sum_{a\leq\lambda y}a^{-1/2+i\omega_n}.}             \tag{7.3}
\]

At every interior arithmetic breakpoint

 \[
 y_m={m\over\lambda},\qquad
 2\leq m<\lambda^2,                                     \tag{7.4}
 \]

the right-minus-left jump of the `r`th derivative is

\[
 \boxed{
 [K_n^{(r)}]_{y_m}
 =\sqrt{\lambda\over L}\,{(-\lambda)^r\over m^{r+1}}
       \left({1\over2}+i\omega_n\right)_r,}            \tag{7.5}
\]

where `(z)_r=z(z+1)...(z+r-1)` and `(z)_0=1`.  In
particular, the value jump

\[
 [K_n]_{y_m}=\sqrt{\lambda/L}\,m^{-1}                  \tag{7.6}
\]

is independent of `n`; value jumps alone have rank one.

**Proof.**  Expanding (7.2), putting `y=au`, and interchanging a finite sum
and integral gives

\[
 \begin{aligned}
 \langle\phi_n,A_\lambda f\rangle
 &={(-1)^n\over\sqrt L}
 \sum_{a\leq\lambda^2}a^{-1/2+i\omega_n}
 \int_{a/\lambda}^{\lambda}
 f(y)y^{-1/2-i\omega_n}\,dy,
 \end{aligned}                                          \tag{7.7}
\]

which is (7.3).  Crossing `y_m` adds exactly the summand with `a=m`.
Differentiating that summand `r` times gives

\[
 {(-1)^n\over\sqrt L}m^{-1/2+i\omega_n}
 (-1)^r\left({1\over2}+i\omega_n\right)_r
 y_m^{-1/2-i\omega_n-r}.                                \tag{7.8}
\]

Since `lambda^(i*omega_n)=exp(i*pi*n)=(-1)^n`, the two centered phases
cancel.  Substituting `y_m=m/lambda` in (7.8) proves (7.5).  `square`

Theorem 7.1 uses no Weil multiplier, so no prime term occurs in it.  It does
not alter the inclusive prime-power endpoint or the minus sign in (1.3).
On the matched schedule,

\[
 \lfloor\lambda^2\rfloor=N-1,                           \tag{7.9}
\]

so (7.3) contains exactly the arithmetic indices `1<=a<=N-1`; this fact
must not be confused with the distinct prime cutoff `n<=lambda^2` in
(1.3).

For `n>=1`, take the normalized real even and odd combinations of
`phi_n,phi_(-n)`, retaining `phi_0` only in the even sector.  Up to the
harmless global sign fixed by the chosen real odd basis, their jumps are

\[
 [K_{n,+}^{(r)}]_{y_m}
 =\sqrt{2\lambda\over L}{(-\lambda)^r\over m^{r+1}}
 \operatorname {Re}\left({1\over2}+i\omega_n\right)_r, \tag{7.10}
\]

\[
 [K_{n,-}^{(r)}]_{y_m}
 =\pm\sqrt{2\lambda\over L}{(-\lambda)^r\over m^{r+1}}
 \operatorname {Im}\left({1\over2}+i\omega_n\right)_r.\tag{7.11}
\]

The `n=0` even row in (7.10) has the additional factor `2^(-1/2)`.

### Corollary 7.2 (full confluent parity-jet rank)

At any one breakpoint (7.4), the even rows `n=0,...,N` and derivative
orders `r=0,2,...,2N` have determinant

\[
 \boxed{
 2^{-1/2}\prod_{k=0}^{N}
 \left(\sqrt{2\lambda\over L}{\lambda^{2k}\over m^{2k+1}}\right)
 (-1)^{N(N+1)/2}
 \prod_{0\leq i<j\leq N}(\omega_j^2-\omega_i^2),}      \tag{7.12}
\]

which is nonzero.  The odd rows `n=1,...,N` and derivative orders
`r=1,3,...,2N-1` have determinant, up to the fixed global odd-basis sign,

\[
 \boxed{
 \prod_{k=0}^{N-1}
 \left(\sqrt{2\lambda\over L}{(-\lambda)^{2k+1}
                                      \over m^{2k+2}}\right)
 (-1)^{N(N-1)/2}
 \left(\prod_{n=1}^{N}\omega_n\right)
 \prod_{1\leq i<j\leq N}(\omega_j^2-\omega_i^2),}     \tag{7.13}
\]

and is also nonzero.

**Proof.**  The real part of `(1/2+i*omega)_(2k)` is a polynomial in
`omega^2` of degree `k` with leading coefficient `(-1)^k`.  The imaginary
part of `(1/2+i*omega)_(2k+1)` is `omega` times a polynomial in `omega^2`
of degree `k`, again with leading coefficient `(-1)^k`.  Factoring the
positive row-independent constants from (7.10)--(7.11) leaves the two
displayed Vandermonde determinants.  Distinct nonnegative frequencies make
every factor in (7.12)--(7.13) nonzero.  `square`

This is exact continuous breakpoint data.  It is not the determinant of
the first matched Fourier moments of the prescribed prolate columns.

## 8. Full jump jets do not imply finite Fourier rank

The failure of that implication is already visible at the function level.
Fix `0<tau<ell`, a parity `s in {+1,-1}`, and a finite parity Fourier
projection `P_(N,s)`.  For distinct nonnegative integers `r_j` of the
correct parity, put

\[
 q_j(x)={(x-\tau)_+^{r_j}\over r_j!}
       +s{(-x-\tau)_+^{r_j}\over r_j!},                 \tag{8.1}
\]

where `r_j=2j` in the even sector and `r_j=2j+1` in the odd sector.  Each
`q_j` has parity `s`.  At the positive breakpoint,

\[
 [q_j^{(r_k)}]_{\tau}=\delta_{jk}.                       \tag{8.2}
\]

Now define

\[
 h_j=(I-P_{N,s})q_j.                                     \tag{8.3}
\]

### Theorem 8.1 (parity projection countermodel)

The functions `h_j` have parity `s`, are linearly independent, retain the
identity jump-jet matrix

\[
 [h_j^{(r_k)}]_{\tau}=\delta_{jk},                       \tag{8.4}
\]

and nevertheless obey

\[
 \boxed{P_{N,s}h_j=0\quad\hbox{for every }j.}            \tag{8.5}
\]

**Proof.**  A finite trigonometric polynomial is smooth across `tau`, so
subtracting `P_(N,s)q_j` changes none of the jumps in (8.2).  Hence (8.4)
holds and makes the `h_j` linearly independent.  Orthogonal projection is
idempotent, which gives
`P_(N,s)(I-P_(N,s))=0` and proves (8.5).  `square`

After returning to multiplicative coordinates, put
`g_j(u)=h_j(log u)`.  The full-source right inverse in
`notes/FULL_SOURCE_COFRAME_RANK_THEOREM.md` can realize each `g_j` as
`S_s A_lambda f_j` for an even, zero-Lebesgue-integral `L2` source `f_j`.
Their actual positive source Gram must be retained, but it cannot change
the zero projected images in (8.5).  Those right-inverse sources are not
the prescribed analytic prolate sources.  Therefore Theorem 8.1 does not
disprove the matched prolate coframe; it proves that breakpoint jets,
full-source surjectivity, and continuous injectivity cannot establish that
coframe without an additional matched projection/transversality estimate.

For exact square rank targets, let `psi_n^+` (`0<=n<=N`) and `psi_n^-`
(`1<=n<=N`) denote the normalized real centered Fourier rows.  Let
`c_(4j)` and `c_(4j+2)^-` be the source-normalized zero-integral prolate
columns pinned in `notes/GROWING_WINDOW_THEOREM.md`.  Natural augmented
determinants are

\[
 D_+(p_0)=\det\left[
 \langle\psi_n^+,A_\lambda c_{4j}\rangle
 \right]_{0\leq n\leq N,\ 1\leq j\leq N+1},            \tag{8.6}
\]

\[
 D_-(p_0)=\det\left[
 \langle\psi_n^-,A_\lambda c_{4j+2}^-\rangle
 \right]_{1\leq n\leq N,\ 1\leq j\leq N}.            \tag{8.7}
\]

The displayed labels run respectively through `4,8,...,4N+4` and
`6,10,...,4N+2`; all are strictly below the pinned buffered cutoff.
Nonvanishing of (8.6) is equivalent to a nonzero anchor followed by span of
its exact deflated even complement.  Nonvanishing of (8.7) gives odd span.
For a quantitative theorem, a square raw determinant `D` and its exact
source Gram `B` first give the source-whitened squared volume
`|D|^2/det(B)`.  A fully target-relative volume additionally divides by
`det(R)`, where `R=TT^*` is the full-source target frame.  Equivalently, one
may use the fully source- and target-whitened volume in Theorem 3.1 of
`notes/MATCHED_HIGH_MOMENT_COFRAME_REDUCTION.md`.

No pinned estimate currently proves that either (8.6) or (8.7) is nonzero
for every locked odd `p_0`, much less supplies a uniform normalized lower
scale.  That matched moment determinant/transversality estimate is the
smallest missing coframe lemma.  The separately locked exponential
projection theorem cannot be substituted for it.

## 9. Exact next theorem and explicit non-claims

If the project continues through moments, the smallest cancellation-
preserving high-space target isolated here is one of the following.

1. **Direct one-sided route.**  Prove, on the actual `H` and in both
   parities, a scalar upper bound and a cyclic source estimate of the form
   (2.2), with `M=O(L)`, constants `nu>mu>0`, and one common order
   `r=O(log(lambda))`.  In the even sector, first removing the positive pole
   by (4.9) avoids the exact obstruction in Section 4.
2. **Directional odd route.**  Prove (6.6) for the actual odd multiplier and
   prove the strict directional finite-sum reserve in (6.8) at the explicit
   order (6.14).  This yields (6.9) without estimating a full trace.
3. **Complete aligned compensation.**  Prove directly, from the combined
   signed source kernel, that the multiplier action aligned with the odd
   pole compensates its negative rank-one form.  Such a theorem must retain
   all mixed terms and cannot be replaced by an absolute pole surcharge.

None of these source estimates is established in this note.  In
particular, the following remain unproved:

- an `O(L)` physical spectral-width bound for either matched high
  multiplier;
- the source trace inequality (2.2) at any logarithmically growing order;
- the directional reserve in (6.8);
- the odd-pole angle in (6.18) for the physical prolate range;
- any bound on the physical even-pole projection after anchor and source
  projection;
- a nonzero value or uniform lower scale for either actual determinant
  (8.6)--(8.7);
- a nonzero normalized physical minor or a matched coframe floor;
- a positive complete signed floor in either inversion sector;
- equation (5.2) of `DIRECT_RH_ATTACK.md`;
- locally uniform determinant convergence; and
- the Riemann hypothesis.

The moment conversions above are exact conditional theorems.  They must not
be promoted to physical source estimates, numerical extrapolations, or an
asymptotic proof.
