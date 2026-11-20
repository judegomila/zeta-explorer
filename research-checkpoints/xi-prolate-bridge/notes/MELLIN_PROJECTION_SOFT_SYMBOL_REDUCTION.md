# Mellin projection, soft-symbol exterior, and weighted graph-spill reduction

## 0. Status and claim boundary

Claim class: `MELLIN_PROJECTION_SOFT_SYMBOL_REDUCTION`.

This note proves three reductions for the direct Xi--prolate--Weil bridge.

1. For the distinguished, source-normalized `0/4` state, it replaces the
   generic periodic `H^1` projection estimate by a Mellin estimate using the
   full transform `Xi(t)/4`.  An explicit schedule with
   `N=O((log lambda)^2)` then makes the weighted projection term vanish for
   every fixed exponent below `1/2`.
2. It gives component-free finite-`X` identities for the complete exterior
   soft symbol, a one-projector effective-tail theorem, and a bounded-
   variation estimate for the average of its hard layers.
3. It reduces the covariance-weighted central capture to an exact low-mode
   graph equation plus one explicitly weighted high-mode spill.

The finite projection formula retains the exact source comparison
`delta_lambda` and the exact omitted Gaussian tail `R_h(lambda)`.  No
unspecified constant is inserted into a finite formula.  The qualitative
conclusion uses the already pinned fixed-index source statement that
`lambda^2 delta_lambda` is eventually bounded.

These results do not prove the actual arithmetic--prolate central or
exterior alignment, an odd directional reserve, either signed sector floor,
equation (5.2) of `DIRECT_RH_ATTACK.md`, locally uniform determinant
convergence, or the Riemann hypothesis.  The repository state remains
`P0_INVALIDATED`.

## 1. Locked conventions and the distinguished state

Let

\[
 \ell=\log\lambda,\qquad L=2\ell,\qquad
 I_\lambda=[-L/2,L/2],\qquad \lambda>1.                \tag{1.1}
\]

Lebesgue measure is used on `I_lambda`; all physical functions are extended
by zero.  The Fourier convention and Plancherel measure are

\[
 \widehat f(t)=\int_{\mathbb R}f(s)e^{-its}\,ds,
 \qquad d\nu(t)={dt\over2\pi}.                         \tag{1.2}
\]

On `I_lambda`, put

\[
 \phi_n(s)=(-1)^nL^{-1/2}e^{i\omega_ns},qquad
 \omega_n={2\pi n\over L},\qquad
 X_N=\operatorname {span}\{\phi_n:|n|\leq N\},        \tag{1.3}
\]

and let `P_N` be the orthogonal projection onto `X_N`.  The harmless phase
`(-1)^n` does not change any coefficient modulus, but fixes the same
centered basis as the rest of the project.

The locked limiting source and arithmetic transform are

\[
 h(x)={\pi\over2}x^2(2\pi x^2-3)e^{-\pi x^2},
 \qquad
 E(f)(u)=u^{1/2}\sum_{m\geq1}f(mu),
 \qquad
 K(s)=E(h)(e^s).                                      \tag{1.4}
\]

The source-normalized finite state `h_lambda` is supported on
`[-lambda,lambda]`, has zero Lebesgue integral, and is not renormalized to
unit norm.  Write

\[
 k_\lambda=E(h_\lambda),\qquad
 k_\lambda^+={k_\lambda+Jk_\lambda\over2},qquad
 (Jf)(u)=f(u^{-1}),                                    \tag{1.5}
\]

and, in logarithmic coordinates,

\[
 f_\lambda(s)=k_\lambda^+(e^s),\qquad s\in I_\lambda.
                                                                  \tag{1.6}
\]

Retain the exact comparison input

\[
 \delta_\lambda=max_{|x|\leq\lambda}
                 |h_\lambda(x)-h(x)|.                 \tag{1.7}
\]

For later use define

\[
\begin{aligned}
 A_\lambda^h
   &={\pi\over2}\lambda^2(2\pi\lambda^2-3)
                         e^{-\pi\lambda^2},\\
 I_\lambda^h
   &={\pi\over2}\lambda^3e^{-\pi\lambda^2},\\
 R_h(\lambda)^2
   &=(\lambda-\lambda^{-1})
        \bigl((A_\lambda^h)^2+(I_\lambda^h)^2\bigr)
     +4A_\lambda^hI_\lambda^h\log\lambda.
\end{aligned}                                         \tag{1.8}
\]

The already proved source comparison, including both zero-extension tails,
is

\[
 \boxed{
 \|f_\lambda-K\|_{L^2(I_\lambda)}
 \leq\delta_\lambda\sqrt{\lambda^3-\lambda}
       +R_h(\lambda).}                                 \tag{1.9}
\]

Poisson summation gives `K(-s)=K(s)`.  Thus its endpoint values agree on
`I_lambda`, and its full Fourier transform is the relevant object for the
periodic projection.

## 2. The full Mellin transform and an explicit Xi envelope

Write

\[
 \xi(s)={1\over2}s(s-1)\pi^{-s/2}\Gamma(s/2)\zeta(s),
 \qquad
 \Xi(t)=\xi(1/2+it).                                   \tag{2.1}
\]

### Lemma 2.1 (the exact factor `1/4`)

For every real `t`,

\[
 \boxed{
 \widehat K(t)=\int_{\mathbb R}K(s)e^{-its}\,ds
 ={\Xi(t)\over4}.}                                    \tag{2.2}
\]

**Proof.**  For `Re(z)>1/2`, Mellin summation and `x=mu` give

\[
 \int_0^\infty E(h)(u)u^z{du\over u}
 =\zeta(z+1/2)\int_0^\infty h(x)x^{z+1/2}{dx\over x}.
                                                                  \tag{2.3}
\]

Put `s=z+1/2`.  Direct Gaussian integration gives

\[
 \int_0^\infty h(x)x^{s-1}\,dx
 ={s(s-1)\over8}\pi^{-s/2}\Gamma(s/2).               \tag{2.4}
\]

Both sides continue to the imaginary `z`-axis: the conditions `h(0)=0` and
`integral_R h=0`, together with the Gaussian decay, are precisely the two
endpoint cancellations in the Poisson representation of `E(h)`.  At
`z=-it`, equations (2.3)--(2.4) equal

\[
 {1\over4}\xi(1/2-it)={1\over4}\Xi(-t)
 ={1\over4}\Xi(t),                                    \tag{2.5}
\]

because `Xi` is even.  This proves (2.2).  `square`

The factor `1/4` in (2.2) is source-normalized.  Replacing it by `1`, or
unit-normalizing `h_lambda`, changes the limiting scalar and is rejected.

### Lemma 2.2 (an eta-series bound on the critical line)

For every real `t`,

\[
 \boxed{
 |\zeta(1/2+it)|
 \leq {2|1/2+it|\over\sqrt2-1}.}                      \tag{2.6}
\]

**Proof.**  For `Re(s)>0`, group the Dirichlet eta series in adjacent pairs:

\[
 \eta(s)=\sum_{m\geq1}\bigl((2m-1)^{-s}-(2m)^{-s}\bigr).
                                                                  \tag{2.7}
\]

When `Re(s)=1/2`, the fundamental theorem of calculus gives

\[
\begin{aligned}
 |\eta(s)|
 &\leq |s|\sum_{m\geq1}
        \int_{2m-1}^{2m}x^{-3/2}\,dx\\
 &\leq |s|\int_1^\infty x^{-3/2}\,dx=2|s|.           \tag{2.8}
\end{aligned}
\]

Also

\[
 |1-2^{1-s}|\geq\bigl||2^{1-s}|-1\bigr|=\sqrt2-1.    \tag{2.9}
\]

Since `eta(s)=(1-2^(1-s))zeta(s)`, (2.6) follows.  `square`

### Lemma 2.3 (an explicit gamma-product bound)

For every real `t`,

\[
 \boxed{
 |\Gamma(1/4+it/2)|
 \leq\Gamma(1/4)e^{1/4}(1+4t^2)^{1/8}
                         e^{-\pi|t|/4}.}              \tag{2.10}
\]

**Proof.**  Set `y=|t|/2`.  The Weierstrass product, divided by its value at
`y=0`, gives the exact identity

\[
 { |\Gamma(1/4+iy)|^2\over\Gamma(1/4)^2}
 =\prod_{n=0}^\infty
   \left(1+{y^2\over(n+1/4)^2}\right)^{-1}.           \tag{2.11}
\]

The function `x -> log(1+y^2/x^2)` is positive and decreasing.  Therefore

\[
\begin{aligned}
 \sum_{n=0}^\infty\log\left(1+{y^2\over(n+1/4)^2}\right)
 &\geq\int_{1/4}^\infty\log(1+y^2/x^2)\,dx\\
 &=\pi y-{1\over4}\log(1+16y^2)
       -2y\arctan {1\over4y}\\
 &\geq\pi y-{1\over4}\log(1+16y^2)-{1\over2}.       \tag{2.12}
\end{aligned}
\]

The last step uses `arctan(v)<=v`; `y=0` follows by continuity.  Taking one
half of the logarithm in (2.11), and then exponentiating (2.12), proves
(2.10).  `square`

### Theorem 2.4 (explicit Xi envelope)

Define

\[
 C_\Xi={2^{1/4}\pi^{-1/4}\Gamma(1/4)e^{1/4}
              \over\sqrt2-1}.                         \tag{2.13}
\]

Then, for every real `t`,

\[
 \boxed{
 |\Xi(t)|\leq
 C_\Xi(t^2+1/4)^{13/8}e^{-\pi|t|/4}.}                \tag{2.14}
\]

**Proof.**  At `s=1/2+it`, one has
`|s|=|s-1|=(t^2+1/4)^(1/2)` and
`1+4t^2=4(t^2+1/4)`.  Substitute (2.6) and (2.10) into
(2.1).  The factor `1/2` in `xi` cancels the factor `2` in (2.6), and the
total algebraic exponent is `1+1/2+1/8=13/8`.  This is exactly (2.14).
`square`

No zero table and no form of Weil positivity enters this envelope.

## 3. Two integrations by parts on the omitted logarithmic tails

The following constants will be used without decimal rounding:

\[
\begin{aligned}
 C_{\rm sum}
   &={e^2\over1-e^{-3(4\pi-2)}},\\
 B_1&=2\pi^3+{15\over2}\pi^2+{15\over4}\pi,\\
 B_2&=4\pi^4+28\pi^3+{165\over4}\pi^2+{75\over8}\pi.
\end{aligned}                                         \tag{3.1}
\]

Let `D_x=x(d/dx)`.  Direct differentiation of (1.4) gives

\[
\begin{aligned}
 (1/2+D_x)h(x)
 &=e^{-\pi x^2}
   \left(-2\pi^3x^6+{15\over2}\pi^2x^4
                         -{15\over4}\pi x^2\right),\\
 (1/2+D_x)^2h(x)
 &=e^{-\pi x^2}
   \left(4\pi^4x^8-28\pi^3x^6
       +{165\over4}\pi^2x^4-{75\over8}\pi x^2\right).
\end{aligned}                                         \tag{3.2}
\]

For integer `m>=2`, `m^8<=exp(2(m^2-1))`; this follows by checking `m=2`
and differentiating `x^2-1-4 log x` on `[2,infinity)`.  Hence, for
`u>=1` and `j=6,8`,

\[
 \sum_{m\geq1}m^j e^{-\pi m^2u^2}
 \leq C_{\rm sum}e^{-\pi u^2}.                        \tag{3.3}
\]

For completeness, after factoring out `e^(-pi u^2)`, the left side is at
most

\[
 1+\sum_{m\geq2}e^{-(\pi-2)(m^2-1)}
 \leq1+\sum_{j\geq1}e^{-3j}
 <e^2<C_{\rm sum},                                    \tag{3.4}
\]

so (3.3) contains no numerical assumption.

Taking `u=e^s>=1` in (3.2)--(3.3) yields

\[
\boxed{
\begin{aligned}
 |K'(s)|&\leq C_{\rm sum}B_1u^{13/2}e^{-\pi u^2},\\
 |K''(s)|&\leq C_{\rm sum}B_2u^{17/2}e^{-\pi u^2}.
\end{aligned}}                                        \tag{3.5}
\]

Consequently, with `a=L/2=log lambda`,

\[
 \int_a^\infty|K''(s)|\,ds
 \leq {C_{\rm sum}B_2\over2\pi^{17/4}}
       \Gamma(17/4,\pi\lambda^2).                    \tag{3.6}
\]

Define the fully explicit two-sided tail constant

\[
 \boxed{
 B_\lambda=2C_{\rm sum}\left[
 B_1\lambda^{13/2}e^{-\pi\lambda^2}
 +{B_2\Gamma(17/4,\pi\lambda^2)\over2\pi^{17/4}}
 \right].}                                            \tag{3.7}
\]

For nonzero integer `n`, evenness gives

\[
 T_n:=\int_{|s|>a}K(s)e^{-i\omega_ns}\,ds
 =2\int_a^\infty K(s)\cos(\omega_ns)\,ds.            \tag{3.8}
\]

Because `omega_n a=pi n`, the first boundary term vanishes.  Integrating
twice gives

\[
 T_n=-{2\over\omega_n^2}\left[
 K'(a)(-1)^n+\int_a^\infty K''(s)\cos(\omega_ns)\,ds
 \right],                                             \tag{3.9}
\]

and therefore

\[
 \boxed{|T_n|\leq {B_\lambda\over\omega_n^2}.}       \tag{3.10}
\]

The combined tail `T_n` is kept before absolute values in (3.9).  Bound
(3.10) is used only after the cancellation at `sin(omega_n a)=0` has been
extracted.

## 4. An explicit `O((log lambda)^2)` projection schedule

Put

\[
 E_{K,N}=\|(I-P_N)K\|_{L^2(I_\lambda)}.               \tag{4.1}
\]

For `n!=0`, Lemma 2.1 and (3.8) give the exact periodic coefficient

\[
 \langle\phi_n,K\rangle
 ={(-1)^n\over\sqrt L}
 \left({\Xi(\omega_n)\over4}-T_n\right).             \tag{4.2}
\]

### Theorem 4.1 (explicit Mellin projection tail)

Assume `N>=1` and

\[
 N+1\geq {13L\over\pi^2}.                             \tag{4.3}
\]

Then

\[
 \boxed{
 E_{K,N}^2\leq \mathfrak X_{L,N}
 +{B_\lambda^2L^3\over12\pi^4N^3},}                 \tag{4.4}
\]

where, writing `omega_(N+1)=2pi(N+1)/L`,

\[
 \boxed{
 \mathfrak X_{L,N}={C_\Xi^2\over4L}
 { (\omega_{N+1}^2+1/4)^{13/4}
       e^{-\pi^2(N+1)/L}
  \over1-e^{-\pi^2/(2L)}}.}                           \tag{4.5}
\]

**Proof.**  From (4.2), (3.10), and `(x+y)^2<=2x^2+2y^2`, Parseval gives

\[
 E_{K,N}^2
 \leq {1\over4L}\sum_{n>N}|\Xi(\omega_n)|^2
 +{B_\lambda^2L^3\over4\pi^4}
       \sum_{n>N}{1\over n^4}.                        \tag{4.6}
\]

Both signs of `n` and the source factor `1/4` have already been included in
the first coefficient of (4.6).  Since
`sum_(n>N)n^(-4)<=1/(3N^3)`, the second term is the second term of (4.4).

For the first term set

\[
 a_n=(\omega_n^2+1/4)^{13/4}e^{-\pi^2n/L}.            \tag{4.7}
\]

For `n>=N+1`,

\[
 {a_{n+1}\over a_n}
 \leq\left(1+{1\over n}\right)^{13/2}e^{-\pi^2/L}
 \leq e^{13/(2n)-\pi^2/L}
 \leq e^{-\pi^2/(2L)},                                \tag{4.8}
\]

where (4.3) is used in the last step.  Sum the resulting geometric series
and apply (2.14).  This proves (4.4)--(4.5).  `square`

Combining (1.9) with orthogonal contractivity gives the finite, normalization-
sensitive inequality

\[
\boxed{
 \|(I-P_N)f_\lambda\|_2
 \leq\delta_\lambda\sqrt{\lambda^3-\lambda}
      +R_h(\lambda)
      +\left(\mathfrak X_{L,N}
       +{B_\lambda^2L^3\over12\pi^4N^3}\right)^{1/2}.}
                                                                  \tag{4.9}
\]

Every term in (4.9) is exact or explicitly defined.  In particular, no
finite value of `delta_lambda` is inferred from a decimal diagnostic.

### Corollary 4.2 (the quadratic-logarithmic schedule)

Let

\[
 \boxed{
 N_\star(\lambda)=
 \left\lceil {L^2+26L\over2\pi^2}\right\rceil,
 \qquad L=2\log\lambda.}                              \tag{4.10}
\]

Then (4.3) holds.  For `L>=1`, put `n_0=N_star+1`.  The elementary bounds

\[
\begin{aligned}
 e^{-\pi^2n_0/L}&\leq e^{-13}\lambda^{-1},\\
 \omega_{n_0}&\leq {L+26\over\pi}+{4\pi\over L},\\
 {1\over1-e^{-\pi^2/(2L)}}&\leq1+{2L\over\pi^2}
\end{aligned}                                         \tag{4.11}
\]

give the completely explicit schedule estimate

\[
 \boxed{
 \mathfrak X_{L,N_\star}
 \leq {C_\Xi^2e^{-13}\over4L\lambda}
 \left[\left({L+26\over\pi}+{4\pi\over L}\right)^2
          +{1\over4}\right]^{13/4}
 \left(1+{2L\over\pi^2}\right).}                    \tag{4.12}
\]

The incomplete gamma term in (3.7) is also explicitly Gaussian.  Indeed,
for `x>13/4`,

\[
 \Gamma(17/4,x)
 \leq {x^{13/4}e^{-x}\over1-13/(4x)},                 \tag{4.13}
\]

obtained by writing the defining integral as `x+v` and using
`(1+v/x)^(13/4)<=e^(13v/(4x))`.  Thus, for `lambda>=2`,

\[
 \boxed{
 B_\lambda\leq
 2C_{\rm sum}\lambda^{13/2}e^{-\pi\lambda^2}
 \left[B_1+{B_2\over
  2\pi(1-13/(4\pi\lambda^2))}\right].}                 \tag{4.14}
\]

The pinned fixed-index source theorem says precisely that
`lambda^2 delta_lambda` is bounded for all sufficiently large `lambda` in
the locked fixed-`a4` normalization.  Equations (1.8), (4.9), and
(4.12)--(4.14) therefore imply, for every fixed `eta<1/2`,

\[
 \boxed{
 \sqrt{\log\lambda}\,\lambda^\eta
 \|(I-P_{N_\star(\lambda)})f_\lambda\|_2
 \longrightarrow0.}                                  \tag{4.15}
\]

For clarity, the slowest explicit Mellin term after taking the square root
is bounded by a fixed displayed expression times
`lambda^(-1/2)L^(13/4)`; after the weight in (4.15) it is at most a displayed
polylogarithmic factor times `lambda^(eta-1/2)`.  The source-comparison term
has the same power `lambda^(eta-1/2)` because `lambda^2 delta_lambda` is
eventually bounded.  Every remaining term contains `e^(-pi lambda^2)`.

This proves only the projection part of the target.  The schedule (4.10)
does not inherit any signed floor, residual estimate, or sampling theorem
proved on a different schedule.

## 5. Component-free identities for the exterior soft symbol

Let `X` be a finite-dimensional physical subspace of `L^2(I_lambda)`, and
let `P_X` be its orthogonal projector.  If `{varphi_j}` is any orthonormal
basis of `X`, define the frequency reproducing kernel

\[
 R_X(t,u)=\sum_j\widehat\varphi_j(t)
                    \overline{\widehat\varphi_j(u)}.  \tag{5.1}
\]

The definition is basis independent and satisfies

\[
 \int_{\mathbb R}|R_X(t,u)|^2\,d\nu(u)=R_X(t,t).       \tag{5.2}
\]

Let `d=d_ext` be the complete nonnegative combined exterior defect and
suppose

\[
 0\leq d(t)\leq A,\qquad A>0,qquad a(t)={d(t)\over A}.\tag{5.3}
\]

No pole, archimedean, or prime block is separated when forming `d`.  In
particular, the source minus sign on the prime block and every prime power
through the inclusive endpoint `n<=lambda^2` remain inside the combined
symbol.

Let `T_a=F^(-1)M_aF` and define

\[
 C_X=P_XT_aP_X|_X,qquad
 D_{\rm ext}=P_XT_dP_X|_X=A C_X,                      \tag{5.4}
\]

\[
 p_X=\operatorname {tr}C_X,qquad
 \chi_X=\operatorname {tr}(C_X-C_X^2).                \tag{5.5}
\]

### Theorem 5.1 (exact soft-symbol transition identity)

One has

\[
\boxed{
\begin{aligned}
 \chi_X
 &=\int_{\mathbb R}a(t)(1-a(t))R_X(t,t)\,d\nu(t)\\
 &\quad+{1\over2}\iint_{\mathbb R^2}
 |a(t)-a(u)|^2|R_X(t,u)|^2\,d\nu(t)d\nu(u).
\end{aligned}}                                        \tag{5.6}
\]

Equivalently,

\[
\boxed{
\begin{aligned}
 A\chi_X
 &=\int d(t)\left(1-{d(t)\over A}\right)
                  R_X(t,t)\,d\nu(t)\\
 &\quad+{1\over2A}\iint
 (d(t)-d(u))^2|R_X(t,u)|^2\,d\nu(t)d\nu(u).
\end{aligned}}                                        \tag{5.7}
\]

**Proof.**  Kernel calculus gives

\[
 \operatorname {tr}C_X=\int a(t)R_X(t,t)\,d\nu(t),
 \qquad
 \operatorname {tr}C_X^2
 =\iint a(t)a(u)|R_X(t,u)|^2\,d\nu(t)d\nu(u).         \tag{5.8}
\]

Expand the squared difference in (5.6) and use (5.2) in both variables.
The diagonal `a^2` terms cancel the same terms in the first integral, leaving
exactly (5.8).  Multiplication by `A` gives (5.7).  `square`

For `0<s<A`, set

\[
 \Omega_s=\{t:d(t)>s\},\qquad
 C_{X,s}=P_XT_{1_{\Omega_s}}P_X|_X.                   \tag{5.9}
\]

### Theorem 5.2 (exact layer-average identity)

\[
 \boxed{
 \int_0^A\operatorname {tr}(C_{X,s}-C_{X,s}^2)\,ds
 ={1\over2}\iint |d(t)-d(u)|\,|R_X(t,u)|^2
                  \,d\nu(t)d\nu(u).}                \tag{5.10}
\]

**Proof.**  Apply (5.6) to the indicator `1_(Omega_s)`; its gray diagonal
term vanishes.  For two numbers in `[0,A]`,

\[
 \int_0^A
 |1_{\{d(t)>s\}}-1_{\{d(u)>s\}}|^2\,ds
 =|d(t)-d(u)|.                                        \tag{5.11}
\]

Tonelli's theorem proves (5.10).  `square`

Equation (5.7) contains a mandatory **gray-mass term**.  A broad region on
which `0<a<1` can make
`integral a(1-a)R_X(t,t)dnu(t)` large even when the variation inside that
region is zero.  Thus neither the difference term in (5.7) nor the layer
average (5.10) may be substituted for `chi_X` without separately accounting
for gray mass.

## 6. One-projector effective tails and a BV layer majorant

Let the eigenvalues of `C_X` be

\[
 1\geq\gamma_1\geq\cdots\geq\gamma_d\geq0,
 \qquad d=\dim X.                                     \tag{6.1}
\]

Fix `0<sigma<1` and define

\[
 r_\sigma=\#\{j:\gamma_j>\sigma\},\qquad
 k=\min\left\{d,
 \left\lfloor p_X+{\chi_X\over\sigma}\right\rfloor
 \right\}.                                           \tag{6.2}
\]

Let `E_k` be a top-`k` spectral projector, with `E_0=0`.  Let
\(K\subset X\) be the actual captured physical range, put
\(H=X\ominus K\), and assume
`dim(K)>=k`.  Put

\[
 \alpha=\|P_HE_k\|,\qquad
 \mathfrak a=\|P_HE_k\|_{\rm HS}.                     \tag{6.3}
\]

### Theorem 6.1 (component-free one-projector theorem)

The open-threshold count and tail obey

\[
 \boxed{
 r_\sigma\leq p_X+{\chi_X\over\sigma},\qquad
 \sum_{\gamma_j\leq\sigma}\gamma_j
 \leq{\chi_X\over1-\sigma}.}                        \tag{6.4}
\]

Consequently `k>=r_sigma`, `gamma_(k+1)<=sigma` when `k<d`, and

\[
 \boxed{
 \|P_HD_{\rm ext}P_H\|
 \leq A\{\sigma+(1-\sigma)\alpha^2\},}               \tag{6.5}
\]

\[
 \boxed{
 \operatorname {tr}(P_HD_{\rm ext}P_H)
 \leq A\left{{\chi_X\over1-\sigma}+\mathfrak a^2
        \right\}.}                                    \tag{6.6}
\]

In particular, a sufficient operator budget `B`, with `0<B<A`, is

\[
 \boxed{
 \sigma<{B\over A},\qquad
 \alpha^2<{B/A-\sigma\over1-\sigma}.}                \tag{6.7}
\]

**Proof.**  Splitting `p_X=sum gamma_j` at the open threshold gives

\[
 r_\sigma-p_X
 =\sum_{\gamma_j>\sigma}(1-\gamma_j)
   -\sum_{\gamma_j\leq\sigma}\gamma_j
 \leq{\chi_X\over\sigma}.                           \tag{6.8}
\]

On the low part,
`gamma_j<=gamma_j(1-gamma_j)/(1-sigma)`, proving (6.4).  Since `r_sigma`
is an integer, the floor in (6.2) is valid even when its argument is an
integer.

Spectral calculus gives

\[
 C_X\preceq\gamma_{k+1}I+(1-\gamma_{k+1})E_k          \tag{6.9}
\]

and hence (6.5).  Expanding the trace in an eigenbasis gives

\[
 \operatorname {tr}(P_HC_XP_H)
 \leq\sum_{j>k}\gamma_j+\|P_HE_k\|_{\rm HS}^2,        \tag{6.10}
\]

which, together with (6.4), proves (6.6).  Rearranging (6.5) proves (6.7).
The endpoint `k=d` is trivial because `dim(K)>=d` forces `H=0`.  `square`

This theorem uses one top spectral projector for the complete soft symbol;
it does not require a connected-component count for every hard level.
It still requires the actual angle `alpha` or `mathfrak a`.

### Theorem 6.2 (component-free BV majorant for the layer average)

Let `I` be any interval of length `L`, and use its full concentration kernel

\[
 R_I(t,u)=\widehat{1_I}(t-u),\qquad
 |R_I(t,u)|\leq\min\{L,2/|t-u|\}.                     \tag{6.11}
\]

Assume `d>=0`, `d in L^1(R) cap BV(R)`, and set

\[
 M=\|d\|_{L^1(dt)},\qquad V=\operatorname {TV}(d),
 \qquad z={LM\over V}.                                \tag{6.12}
\]

If `V=0`, integrability forces `d=0` and the conclusion is zero.  If `V>0`,
then the full-interval layer average

\[
 \mathcal J=\int_0^A
 \operatorname {tr}(C_{I,s}-C_{I,s}^2)\,ds            \tag{6.13}
\]

is well-defined.  Indeed, for every `s>0`, Chebyshev's inequality gives
`|Omega_s|<=M/s`, so the full-interval concentration operator
`P_I F^(-1)M_(1_(Omega_s))F P_I` is positive trace class.  Its trace and
Hilbert--Schmidt-square trace follow directly from the kernel
`widehat(1_I)(t-u)`; equivalently, they follow by monotone finite-rank
compression.  Thus the kernel identity (5.10) extends to this setting and
Tonelli applies.  It satisfies

\[
 \boxed{
 \mathcal J\leq{V\over\pi^2}
 \begin{cases}
  2z-z^2/2,&0\leq z\leq1,\\[2mm]
  3/2+\log z,&z\geq1.
 \end{cases}}                                         \tag{6.14}
\]

**Proof.**  The `L^1` translation modulus of a nonnegative BV function
obeys

\[
 \int_{\mathbb R}|d(t+v)-d(t)|\,dt
 \leq\min\{2M,V|v|\}.                                 \tag{6.15}
\]

Use (5.10), change variables to `v=t-u`, and remember that
`dnu(t)dnu(u)=dt du/(2pi)^2`.  Equations (6.11) and (6.15) give

\[
 \mathcal J\leq{1\over4\pi^2}\int_0^\infty
 \min\{L^2,4/v^2\}\min\{2M,Vv\}\,dv.                \tag{6.16}
\]

The two breakpoints are `2/L` and `2M/V`.  If `z>=1`, splitting in that
order evaluates the last integral as `V(6+4 log z)`.  If `z<=1`, splitting
in the reverse order gives `V(8z-2z^2)`.  Division by `4pi^2` proves
(6.14).  `square`

The bound (6.14) controls an **average** of hard-layer transition traces.  It
does not give a uniform bound for each layer, and, because of the first term
in (5.7), it does not by itself bound the transition trace of the soft
symbol.

### 6.1 Translation preserves spectrum but destroys fixed alignment

The remaining angle in Theorem 6.1 is not determined by component lengths,
`M`, `V`, or the concentration spectrum.  Indeed, for
`a_T(t)=a(t-T)`, modulation

\[
 (\mathcal M_Tf)(x)=e^{iTx}f(x)                       \tag{6.17}
\]

preserves `L^2(I)` and gives

\[
 T_{a_T}=\mathcal M_TT_a\mathcal M_T^*.               \tag{6.18}
\]

Thus frequency translation preserves interval lengths, `L^1` mass, total
variation, and every full-interval concentration eigenvalue, while it
modulates every eigenfunction.  If `K` is any fixed finite-dimensional
captured space and `u` is a nonzero top eigenfunction, then

\[
 \|P_K\mathcal M_Tu\|\longrightarrow0,
 \qquad
 \|P_{K^\perp}\mathcal M_Tu\|\longrightarrow1        \tag{6.19}
\]

as `|T|->infinity`, by the Riemann--Lebesgue lemma on each vector in `K`.
Therefore geometry-only exterior bounds cannot prove the physical alignment
required in (6.5)--(6.7).

## 7. Covariance-weighted central graph spill

Fix `0<delta<pi/2` and put

\[
 B_\delta=[-\delta/L,\delta/L],\qquad
 T_B=\int_{B_\delta}|P_{X_N}e_t\rangle
             \langle P_{X_N}e_t|\,{dt\over2\pi},
 \qquad e_t(s)=e^{its}.                               \tag{7.1}
\]

Then `0<=T_B<=I` and `tr(T_B)<=delta/pi`.  Let

\[
 q_j(s)=\sqrt{{2j+1\over L}}P_j(2s/L),qquad
 Qe_j=q_j,qquad 0\leq j<r,                            \tag{7.2}
\]

so `Q` is an isometry onto the first `r` Legendre functions.  For integers
`j>=1`, define the explicit projection-conditioning bound

\[
 B_{r,j}={2r^2\over\pi^2j}
          \exp\left({r(r-1)\over\pi j}\right).        \tag{7.3}
\]

Take the matched parameters

\[
 N=3\lceil\lambda^2\rceil,qquad
 r=\left\lceil{cL\over\log L}\right\rceil,
 \quad c>{1\over4},qquad
 M=\left\lfloor{\lceil\lambda^2\rceil-1\over2}
                                      \right\rfloor,  \tag{7.4}
\]

with `L>1`, and suppose `B_(r,N)<1`.  Define

\[
 U=P_NQ,qquad
 G=U^*U,qquad
 C=U^*T_BU,qquad
 D=G^{-1}CG^{-1}.                                     \tag{7.5}
\]

Let `W=P_N tilde W` synthesize the actual captured arithmetic--prolate range
`K=ran(W)` and let `P_H=I-P_K`.  Suppose there is a coefficient matrix `Y`
solving the exact low-mode graph equation

\[
 \boxed{P_MWY=P_MU.}                                  \tag{7.6}
\]

Define the covariance-weighted graph spill

\[
 \boxed{
 \Gamma=\|(P_N-P_M)WYD^{1/2}\|_{\rm HS}.}            \tag{7.7}
\]

### Theorem 7.1 (central graph-spill criterion)

The exact weighted central loss

\[
 \rho_B=\operatorname {tr}(D U^*P_HU)                 \tag{7.8}
\]

satisfies

\[
 \boxed{
 \sqrt{\rho_B}
 \leq {\sqrt{B_{r,M}}\sqrt{\delta/\pi}
                 \over1-B_{r,N}}+\Gamma.}             \tag{7.9}
\]

With

\[
 \tau_r={\delta\over\pi}
 { (\delta/2)^{2r}\over(2r+1)^2(r!)^2},               \tag{7.10}
\]

the full central complementary trace obeys

\[
 \boxed{
 \sqrt{\operatorname {tr}(P_HT_BP_H)}
 \leq {\sqrt{B_{r,M}}\sqrt{\delta/\pi}
                 \over1-B_{r,N}}
       +\Gamma+\sqrt{\tau_r}.}                        \tag{7.11}
\]

**Proof.**  The conditioning theorem for the projected Legendre system gives

\[
 G\succeq(1-B_{r,N})I,qquad
 \|(I-P_M)Q\|^2\leq B_{r,M}.                         \tag{7.12}
\]

Also `UU^*<=I`, and hence

\[
 \operatorname {tr}C
 =\operatorname {tr}(T_BUU^*)\leq\operatorname {tr}T_B
 \leq{\delta\over\pi}.                              \tag{7.13}
\]

It follows that

\[
 \operatorname {tr}D
 \leq{\delta/\pi\over(1-B_{r,N})^2}.                  \tag{7.14}
\]

Since `WY` lies in `K`, equation (7.6) gives

\[
 P_HU=P_H(U-WY)
 =P_H(P_N-P_M)(U-WY).                                 \tag{7.15}
\]

Therefore

\[
\begin{aligned}
 \sqrt{\rho_B}
 &=\|P_HUD^{1/2}\|_{\rm HS}\\
 &\leq\|(P_N-P_M)UD^{1/2}\|_{\rm HS}+\Gamma\\
 &\leq\sqrt{B_{r,M}}\sqrt{\operatorname {tr}D}
       +\Gamma,
\end{aligned}                                         \tag{7.16}
\]

which proves (7.9).  The exact covariance-tail inequality

\[
 \sqrt{\operatorname {tr}(P_HT_BP_H)}
 \leq\sqrt{\rho_B}+\sqrt{\tau_r}                     \tag{7.17}
\]

then proves (7.11).  `square`

For `lambda>=3`, the definition of `M` gives `M>=lambda^2/3`; hence

\[
 \boxed{
 B_{r,M}\leq{6r^2\over\pi^2\lambda^2}
 \exp\left({3r(r-1)\over\pi\lambda^2}\right).}      \tag{7.18}
\]

With (7.4), the first term in (7.11), multiplied by `sqrt(lambda)`, tends to
zero.  The explicit factorial bound in (7.10) gives
`tau_r=lambda^(-4c+o(1))`, so its square root is also
`o(lambda^(-1/2))` when `c>1/4`.  Thus the single remaining graph target is

\[
 \boxed{\Gamma=o(\lambda^{-1/2}).}                    \tag{7.19}
\]

### Theorem 7.2 (a sufficient BV spill condition)

For each column

\[
 g_a=\widetilde W YD^{1/2}e_a,\qquad 1\leq a\leq r,   \tag{7.20}
\]

let `TV_per(g_a)` denote its total variation on the circle obtained by
identifying the endpoints of `I_lambda`; the endpoint jump is included.
Then

\[
 \boxed{
 \Gamma^2\leq{L\over2\pi^2M}
       \sum_{a=1}^r\operatorname {TV}_{\rm per}(g_a)^2.}
                                                                  \tag{7.21}
\]

Consequently the explicit asymptotic condition

\[
 \boxed{
 \sum_{a=1}^r\operatorname {TV}_{\rm per}(g_a)^2
 =o\left({M\over\lambda L}\right)}                  \tag{7.22}
\]

is sufficient for (7.19).

**Proof.**  If `g` is periodic BV, Stieltjes integration by parts gives, for
`n!=0`,

\[
 |\langle\phi_n,g\rangle|
 \leq{\operatorname {TV}_{\rm per}(g)
             \over\sqrt L\,|\omega_n|}.              \tag{7.23}
\]

Therefore

\[
 \|(I-P_M)g\|_2^2
 \leq{L\operatorname {TV}_{\rm per}(g)^2
               \over2\pi^2M}.                        \tag{7.24}
\]

Since `W=P_N tilde W`, the shell in (7.7) is bounded by this full tail.
Sum (7.24) over the Hilbert--Schmidt columns (7.20) to obtain (7.21).
Substitution of (7.22) makes its right side `o(lambda^(-1))`, proving
(7.19).  `square`

The graph equation (7.6) and the variation estimate (7.22) are not proved
for the actual source family here.  In particular, solving (7.6) with an
ill-conditioned `Y` can make the spill arbitrarily large.

## 8. Why the distinguished comparison anchor is not central capture

Let

\[
 q_0=L^{-1/2}1_{I_\lambda},\qquad
 \kappa_\lambda={P_Nf_\lambda\over\|P_Nf_\lambda\|_2},
 \qquad
 a_\infty=\|K\|_{L^2(\mathbb R)}>0.                  \tag{8.1}
\]

In this section `N=N(lambda)` is any schedule for which

\[
 \|(I-P_{N(\lambda)})f_\lambda\|_2\longrightarrow0,  \tag{8.1a}
\]

for example the schedule (4.10) or the inherited matched schedule
`N=3ceil(lambda^2)`.  The denominator in (8.1) is therefore nonzero for all
sufficiently large `lambda`.

The phase of `kappa_lambda` is immaterial.  Its exact overlap with the
constant Legendre direction is

\[
 \boxed{
 \langle q_0,\kappa_\lambda\rangle
 ={\widehat f_\lambda(0)
   \over\sqrt L\,\|P_Nf_\lambda\|_2},}               \tag{8.2}
\]

where `widehat f_lambda(0)=integral_(I_lambda) f_lambda(s)ds`; no full-line
transform is substituted at finite `lambda`.  The locked source and norm
limits give

\[
 \boxed{
 \sqrt L\,\langle q_0,\kappa_\lambda\rangle
 \longrightarrow{\Xi(0)\over4a_\infty}.}             \tag{8.3}
\]

Thus

\[
 L|\langle q_0,\kappa_\lambda\rangle|^2
 \longrightarrow {\Xi(0)^2\over16a_\infty^2},        \tag{8.4}
\]

which is an exact normalization-sensitive statement of the
`L^(-1/2)` overlap scale.

On the other hand, the constant direction has fixed central energy

\[
 \boxed{
 \beta_\delta:=\langle q_0,T_Bq_0\rangle
 ={1\over\pi}\int_{-\delta/2}^{\delta/2}
       \left({\sin s\over s}\right)^2ds
 \geq{\delta\over\pi}\cos^2(\delta/2)>0.}            \tag{8.5}
\]

The equality follows by inserting the Fourier transform of `q_0`; the
inequality uses `sin(s)/s>=cos(delta/2)` on this interval.  If the captured
space consisted only of `span{kappa_lambda}`, and `H_kappa` denoted its
orthogonal complement, then, with
`b_lambda=|<q_0,kappa_lambda>|`,

\[
 \left|
 \langle P_{H_\kappa}q_0,T_BP_{H_\kappa}q_0\rangle
 -\beta_\delta\right|
 \leq2b_\lambda+b_\lambda^2\longrightarrow0.         \tag{8.6}
\]

Since `P_(H_kappa) T_B P_(H_kappa)` is positive and `q_0` is a unit vector,

\[
 \liminf_{\lambda\to\infty}
 \operatorname {tr}(P_{H_\kappa}T_BP_{H_\kappa})
 \geq\beta_\delta>0.                                  \tag{8.7}
\]

Hence one distinguished comparison anchor cannot capture the constant
central energy in (8.5).  Additional actual source directions, controlled
through (7.6)--(7.22) or another genuine alignment theorem, are necessary.

## 9. Remaining theorem targets

The reductions above leave the following tasks on one unbounded schedule.

1. Prove the graph equation (7.6) with the actual source columns and prove
   the weighted spill target (7.19), for example through (7.22).
2. Bound the complete exterior soft transition `chi_X` including the gray
   term in (5.7), and prove the physical top-projector angle required by
   (6.5) or (6.6).  The BV layer average and component geometry alone do not
   supply that angle.
3. Prove an odd directional reserve and both signed sector floors without
   moving a negative pole into an unanalysed block.
4. Combine those signed estimates with the residual and the projection
   limit (4.15) to establish the full target in equation (5.2), and only
   then address locally uniform determinant convergence.

None of these four items is established in this note.  The current terminal
state is `P0_INVALIDATED`.
