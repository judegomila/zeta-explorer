# Explicit prolate envelope for the far-prime tail

## 1. Scope and claim boundary

This note proves an explicit bound for the quantity singled out in
`notes/CHEBYSHEV_ERROR_REWRITE.md`, equation (6.5):

\[
 B_f(\lambda)=\sup_{\xi\geq\lambda}
       \xi\left|\widehat{f/x}(\xi)\right|.
\]

Here `f` is the source-normalized labels `0,4` prolate combination with the
fixed state-invisible codimension-two bump.  The additive Fourier convention
is

\[
 \widehat g(\xi)=\int_{\mathbb R}g(x)e^{+2\pi i x\xi}\,dx.       \tag{1.1}
\]

The theorem is uniform for `lambda>=2` and uses the pinned
Karnik--Romberg--Davenport leading-eigenvalue bound.  It controls the
far-prime passage for every polynomial Fourier schedule.  It does **not**
control the near signed Chebyshev-error integral, compare the signed Weil
form with a positive Gram, prove physical-map conditioning, prove a shifted
sector gap, establish equation (5.2) of `DIRECT_RH_ATTACK.md`, or prove RH.

## 2. Exact principal-value tail identity

Let `h_(n,lambda)` be a real even, unit-Lebesgue-norm prolate mode on
`[-lambda,lambda]`, zero-extended outside that interval, with `n=0` or `4`.
Put

\[
 H_n(\xi)=\widehat h_{n,\lambda}(\xi),\qquad
 v_n=h_{n,\lambda}(0),\qquad
 d_n=1-\chi_n^2.                                  \tag{2.1}
\]

The locked finite-Fourier convention is

\[
 1_{[-\lambda,\lambda]}H_n
   =(-1)^{n/2}\chi_n h_{n,\lambda},
 \qquad
 \int h_{n,\lambda}=(-1)^{n/2}\chi_n v_n.        \tag{2.2}
\]

Define

\[
 G_n(\xi)=\operatorname {PV}
    \int_{\mathbb R}\frac{h_{n,\lambda}(x)}x
                    e^{2\pi ix\xi}\,dx,
 \qquad
 R_n(\xi)=G_n(\xi)-i\pi v_n.                     \tag{2.3}
\]

Differentiation in the distributional sense and the positive sign in (1.1)
give

\[
 G_n'(\xi)=2\pi iH_n(\xi),\qquad
 G_n(+\infty)=i\pi v_n.                          \tag{2.4}
\]

Consequently the improper integral below exists and

\[
 R_n(\xi)=-2\pi i\int_\xi^\infty H_n(t)\,dt.     \tag{2.5}
\]

At the time-band edge, Fourier inversion and (2.2) give

\[
 \int_{-\lambda}^{\lambda}H_n(t)\,dt=\chi_n^2v_n,
 \qquad
 \boxed{R_n(\lambda)=-i\pi d_nv_n}.              \tag{2.6}
\]

The square on `chi_n` and the minus sign in (2.6) are mandatory.

## 3. Exterior prolate primitive lemma

The scaled prolate differential operator has parameter

\[
 c=2\pi\lambda^2,
\]

and eigenvalue `mu_n`.  Fourier transformation of its Sturm--Liouville
equation produces no endpoint term because the leading coefficient
`lambda^2-x^2` vanishes at both endpoints.  On `xi>lambda`,

\[
 \left((\xi^2-\lambda^2)H_n'(\xi)\right)'
 +\left((2\pi\lambda)^2\xi^2-\mu_n\right)H_n(\xi)=0.  \tag{3.1}
\]

We use the following elementary consequence of (3.1).

**Lemma 3.1 (radial primitive bound).**  Let `lambda>=1`, put
`k=2*pi*lambda`, and let a real nonzero solution `y` of

\[
 ((t^2-\lambda^2)y')'+(k^2t^2-\mu)y=0
\]

belong to `L2([lambda,infinity))`.  If `0<=mu<k^2 lambda^2` and

\[
 D=\int_\lambda^\infty y(t)^2\,dt,
\]

then

\[
 \boxed{
 \sup_{t\geq\lambda}t\left|\int_t^\infty y(s)\,ds\right|
 \leq 11\lambda^{3/2}\sqrt D.}                  \tag{3.2}
\]

**Proof.**  Set

\[
 p=t^2-\lambda^2,\qquad w=\sqrt p\,y,
\]

and `a=k^2 lambda^2-mu>0`.  Direct differentiation gives

\[
 w''+\Omega^2w=0,
 \qquad
 \Omega^2=k^2+\frac a p+\frac{\lambda^2}{p^2}.   \tag{3.3}
\]

Thus `Omega` decreases to `k`.  Introduce Prüfer variables

\[
 w=r\sin\theta,\qquad w'=r\Omega\cos\theta.
\]

They satisfy

\[
 \frac{r'}r=-\frac{\Omega'}\Omega\cos^2\theta,
 \qquad
 \theta'=\Omega+\frac{\Omega'}\Omega
                    \sin\theta\cos\theta.        \tag{3.4}
\]

In particular `r` is increasing.  Since

\[
 0\leq\frac{r'}r\leq-\frac{\Omega'}\Omega
\]

and `Omega` has the positive limit `k`, `r` has a finite limit `A`, and

\[
 r(t)\geq A\frac{k}{\Omega(t)}.                   \tag{3.5}
\]

For `2lambda<=t<=3lambda`, one has `Omega<=3k/2` and
`k/2<=theta'<=2k`.  If `T` is the phase increase across that interval, then
`T>=k lambda/2`.  Changing variables from `t` to `theta`, with the endpoint
error retained, gives

\[
\begin{aligned}
 \int_{2\lambda}^{3\lambda}\sin^2\theta(t)\,dt
 &\geq\frac1{2k}\left(\frac T2-\frac12\right)\\
 &\geq\frac\lambda8-\frac1{4k}
 \geq\frac{\lambda}{16}.                         \tag{3.6}
\end{aligned}
\]

Using the weaker consequence `r>=A/2` and `p<=8lambda^2` on this interval,

\[
 D\geq\frac{A^2}{512\lambda}.                    \tag{3.7}
\]

For `t>=2lambda`, put

\[
 C(t)=\frac1{\Omega(t)^2\sqrt{p(t)}}.
\]

The reciprocal derivative has the sign of

\[
 k^2-\frac a p-\frac{3\lambda^2}{p^2},
\]

which is positive when `p>=3lambda^2`; hence `C` is decreasing on the
range where it is used.  Since `y=-Cw''`, one integration by parts gives

\[
 \int_t^\infty y(s)\,ds
 =C(t)w'(t)+\int_t^\infty C'(s)w'(s)\,ds.         \tag{3.8}
\]

Here `C(T)w'(T)->0`, and the second term is absolutely convergent because
`|w'|<=A Omega` and `-C'` is integrable.  Therefore

\[
 \left|\int_t^\infty y(s)\,ds\right|
 \leq\frac{2A}{k\sqrt{t^2-\lambda^2}},
 \qquad t\geq2\lambda.                           \tag{3.9}
\]

For `lambda<=t<=2lambda`, split the primitive at `2lambda`, apply
Cauchy--Schwarz to the finite part, and use (3.7)--(3.9) on the remaining
tail.  The resulting constant is at most

\[
 2+\frac{32\sqrt2}{\pi\sqrt3}<11.
\]

The same bound covers `t>=2lambda`, proving (3.2).  \(\square\)

For a prolate mode, Plancherel and (2.2) give the one-sided leakage identity

\[
 \int_\lambda^\infty H_n(t)^2\,dt=\frac{d_n}{2}. \tag{3.10}
\]

Thus, whenever `mu_n<c^2`, (2.5), (3.2), and (3.10) imply

\[
\boxed{
 \sup_{\xi\geq\lambda}\xi|R_n(\xi)|
 \leq16\pi\lambda^{3/2}\sqrt{d_n}.}             \tag{3.11}
\]

The same argument also controls the hard endpoint that creates the Fourier
projection jumps.  One integration by parts in the defining Fourier
integral, followed by the Riemann--Lebesgue lemma, gives

\[
 H_n(\xi)=\frac{h_{n,\lambda}(\lambda)}{\pi\xi}
               \sin(2\pi\lambda\xi)+o(\xi^{-1}),
\]

\[
 H_n'(\xi)=\frac{2\lambda h_{n,\lambda}(\lambda)}{\xi}
               \cos(2\pi\lambda\xi)+o(\xi^{-1}).               \tag{3.12}
\]

Thus the Prüfer amplitude limit in the proof is exactly
`A=|h_(n,lambda)(lambda)|/pi`.  Combining this with (3.7) and (3.10) yields

\[
 \boxed{|h_{n,\lambda}(\lambda)|
        \leq16\pi\sqrt{\lambda d_n}.}            \tag{3.13}
\]

This endpoint estimate is an upper bound only; it supplies no lower defect
scale.

## 4. Verifying the oscillatory hypothesis for labels 0 and 4

On the normalized even Legendre span with labels `0,2,4`, the compression of
multiplication by `z^2` is tridiagonal.  Its diagonal entries are

\[
 \frac13,\qquad\frac{11}{21},\qquad\frac{39}{77},
\]

and its two squared off-diagonal entries are

\[
 \frac4{45},\qquad\frac{16}{245}.
\]

The leading principal minors of `(7/8)I-M` are exactly

\[
 \frac{13}{24},\qquad\frac{227}{2240},\qquad
 \frac{233}{118272}.                             \tag{4.1}
\]

Sylvester's criterion gives `M<(7/8)I`.  The differential part has largest
Rayleigh quotient `20` on this span, so min--max gives

\[
 \mu_4\leq\frac78c^2+20<c^2
\]

whenever `c^2>160`.  Since `c=2*pi*lambda^2`, this holds for every
`lambda>=2`; also `0<=mu_0<=mu_4`.  Hence (3.11) applies to both source modes
throughout the claimed range.

## 5. The invisible bump with an explicit constant

Keep the source scalar

\[
 a_4=\frac{\sqrt3}{2^{11/4}},\qquad
 a_{0,\lambda}=a_4\frac{\int h_{4,\lambda}}
                              {\int h_{0,\lambda}},
 \qquad
 h_\lambda=a_4h_{4,\lambda}-a_{0,\lambda}h_{0,\lambda}. \tag{5.1}
\]

Let `phi`, `psi`, and the scale `a=1/(2lambda)` be exactly those fixed in
`notes/EXACT_RADICAL_LEAKAGE_IDENTITY.md`:

\[
 \phi(x)=e^{1-1/(1-x^2)}1_{|x|<1},\qquad
 \psi(x)=2\phi(2x)-\phi(x),
\]

and put

\[
 A_\lambda=h_\lambda(0),\qquad
 f(x)=h_\lambda(x)-A_\lambda\psi(x/a).           \tag{5.2}
\]

If `R_psi` is defined as in (2.3), the principal-value constants cancel
exactly:

\[
 \boxed{
 \widehat{f/x}(\xi)
 =a_4R_4(\xi)-a_{0,\lambda}R_0(\xi)
              -A_\lambda R_\psi(a\xi).}          \tag{5.3}
\]

Two integrations by parts give

\[
 \sup_{\eta\geq1/2}\eta|R_\psi(\eta)|
 \leq\frac{\|\psi''\|_1}{2\pi}.                \tag{5.4}
\]

No unspecified constant is needed.  Indeed

\[
 \phi''(x)=\frac{2(3x^4-1)}{(1-x^2)^4}\phi(x)
\]

inside the support.  The only sign change on `(0,1)` is at
`x=3^(-1/4)`.  Total variation of `phi'`, followed by the triangle inequality
under the dilation in `psi`, gives

\[
 \|\psi''\|_1\leq C_\psi,
\]

\[
 \boxed{
 C_\psi=
 \frac{40\,3^{-1/4}e^{-(1+\sqrt3)/2}}
      {(1-1/\sqrt3)^2}
 <43.408.}                                       \tag{5.5}
\]

The ground prolate mode is positive and decreasing on `[0,lambda]`: its
Sturm--Liouville equation has one turning point, and the endpoint regularity
condition forces the weighted derivative to return to zero from below.
Unit normalization therefore gives

\[
 v_0\geq\frac1{\sqrt{2\lambda}}.                 \tag{5.6}
\]

If `d_4<=1/2`, then `chi_0,chi_4>=1/sqrt2`.  Cauchy--Schwarz, (2.2), and
the ordering `chi_0>=chi_4` yield

\[
 \left|\frac{a_{0,\lambda}}{a_4}\right|
 \leq2\sqrt2\lambda,\qquad
 |v_4|\leq2\sqrt\lambda,
\]

\[
 |A_\lambda|
 =\left|a_4v_4\frac{\chi_0-\chi_4}{\chi_0}\right|
 \leq2\sqrt2\,a_4\sqrt\lambda\,d_4.           \tag{5.7}
\]

## 6. Pinned KRD insertion and final envelope

Set

\[
 \beta_\lambda=\frac2{\pi^2}\log(200\lambda^2+25),
\]

\[
 \boxed{
 D_\lambda=10\exp\left(
   -\frac{\lfloor4\lambda^2\rfloor-11}{\beta_\lambda}
                         \right).}               \tag{6.1}
\]

Karnik--Romberg--Davenport, Corollary 3, applied at label `4` with
`c=2*pi*lambda^2`, gives `d_4<=D_lambda`; eigenvalue ordering separately
gives `d_0<=d_4`.  Also `D_lambda<=1/2` for every `lambda>=2`.  To see the
latter without a numerical assumption, write `m=floor(4lambda^2)>=16` and
bound `beta_lambda` on the floor interval by

\[
 \frac2{\pi^2}\log(50m+75).
\]

At `m=16`, the desired inequality follows already from
`pi^2>9`, `log(20)<3`, and `log(875)<7`; the difference between the linear
left side `m-11` and the logarithmic right side is increasing for `m>=16`.

Combining (3.11), (5.3)--(5.7), and (6.1) proves the main result.

**Theorem 6.1 (explicit corrected-state tail envelope).**  For every
`lambda>=2`,

\[
\boxed{
\begin{aligned}
 B_f(\lambda)
 &\leq16\pi a_4(1+2\sqrt2\lambda)
              \lambda^{3/2}\sqrt{D_\lambda}\\
 &\quad+\frac{2\sqrt2a_4}{\pi}C_\psi
              \lambda^{3/2}D_\lambda.
\end{aligned}}                                   \tag{6.2}
\]

In particular,

\[
 B_f(\lambda)=O\left(
 \lambda^{5/2}
 \exp\left[-\frac{\lfloor4\lambda^2\rfloor-11}
                  {2\beta_\lambda}\right]\right),              \tag{6.3}
\]

which is smaller than every negative power of `lambda`.  Formula (6.2), not
the asymptotic notation in (6.3), is the finite bound used by the producer.

The invisible bump is supported strictly inside the interval, so it does not
change the endpoint.  Equations (3.13), (5.7), and `d_0<=d_4<=D_lambda` also
give the explicit companion bound

\[
 \boxed{
 |f(\lambda)|
 \leq16\pi a_4(1+2\sqrt2\lambda)
          \sqrt{\lambda D_\lambda}.}             \tag{6.4}
\]

This will be relevant to a source-relative Fourier jump estimate, which is
not proved in this note.

## 7. Consequence for the far-prime pairing

For a unit vector `v` in the locked Fourier space `E_N`, put
`L=2log(lambda)`.  Direct Cauchy--Schwarz in the Fourier coefficients gives

\[
 M_0=\sqrt{\frac{2N+1}{L}},\qquad
 M_1=\frac{2\pi}{L^{3/2}}
       \sqrt{\frac{N(N+1)(2N+1)}3},               \tag{7.1}
\]

and the constant in `notes/CHEBYSHEV_ERROR_REWRITE.md`, equation (6.2), is
bounded uniformly in `v` by

\[
\begin{aligned}
 C_{\lambda,N}
 &=M_0(\lambda^{3/2}+\lambda^{-3/2})\\
 &\quad+\frac23(\lambda^{3/2}-\lambda^{-3/2})
                 (M_1+M_0/2).                    \tag{7.2}
\end{aligned}
\]

Repeating that note's integration by parts with
`|widehat(f/x)(xi)|<=B_f(lambda)/xi` gives the explicit far-prime bound

\[
 \boxed{
 \frac{\pi B_f(\lambda)C_{\lambda,N}}{12}
 \frac{\log M+1}{M},\qquad M=\lfloor\lambda^2\rfloor.}          \tag{7.3}
\]

For every polynomial schedule `N(lambda)`, (7.1)--(7.3) are
super-polynomially small.  This closes the far-prime component of the
leakage correlation, before normalization by the nonzero source-state norm.
It leaves the finite/near signed integral and every sector-floor comparison
untouched; those remain the central proof obligations.
