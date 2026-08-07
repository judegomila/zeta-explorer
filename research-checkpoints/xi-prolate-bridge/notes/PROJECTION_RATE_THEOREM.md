# Fourier projection rate for the evenized prolate state

## 1. Scope

This note proves the projection-error part of equation (5.2) in
`DIRECT_RH_ATTACK.md`, conditional only on the pinned prolate approximation
estimate in CCM-ZST-v1 Lemma 7.2.  It does not prove a shifted Weil-sector
bound, a resolvent estimate, determinant convergence, or the Riemann
hypothesis.

The proof also repairs a harmless omission in the displayed estimate used in
the source proof of Lemma 7.3: because `h_lambda` is zero-extended while the
Hermite limit `h` is not compactly supported, comparison of `E(h_lambda)`
with `E(h)` has a Gaussian lattice tail beyond `lambda`.  That tail is kept
below and is exponentially small.

## 2. Locked notation

Let

\[
 h(x)=\frac{\pi}{2}x^2(2\pi x^2-3)e^{-\pi x^2},\qquad
 k=E(h),\qquad E(f)(u)=u^{1/2}\sum_{m\geq1}f(mu).
\]

The finite source-normalized combination `h_lambda` is zero outside
`[-lambda,lambda]`, and

\[
 k_\lambda=E(h_\lambda),\qquad
 k_\lambda^+=\frac{k_\lambda+Jk_\lambda}{2},\qquad
 (Jf)(u)=f(u^{-1}).
\]

Put

\[
 a=\log\lambda,\quad L=2a,\quad
 f_\lambda(t)=k_\lambda^+(e^{t-a}),\quad 0\leq t\leq L,
\]

and let `P_N` be the orthogonal projection onto the locked modes
`L^(-1/2) exp(2 pi i n t/L)`, `|n|<=N`.  Define

\[
 e_{\lambda,N}=\|(I-P_N)f_\lambda\|_{L^2(0,L)}
\]

and the exact finite comparison error

\[
 \delta_\lambda=
 \max_{|x|\leq\lambda}|h_\lambda(x)-h(x)|.       \tag{2.1}
\]

No numerical value or unspecified constant is inserted into the finite bound
below: `delta_lambda` is the exact supremum that a future interval prolate
solver would have to enclose.

## 3. Exact omitted-tail bound

For `lambda>=1`, `h` is positive and decreasing on `[lambda,infinity)`.
Indeed, with `y=x^2`, the sign of its derivative there is the sign of

\[
 -2\pi^2y^2+7\pi y-3,
\]

whose roots are `1/(2 pi)` and `3/pi`, both below `1`.  Set

\[
 A_\lambda=h(\lambda)
 =\frac{\pi}{2}\lambda^2(2\pi\lambda^2-3)e^{-\pi\lambda^2},
 \qquad
 I_\lambda=\int_\lambda^\infty h(x)\,dx
 =\frac{\pi}{2}\lambda^3e^{-\pi\lambda^2}.       \tag{3.1}
\]

The second identity follows from

\[
 h(x)=-\frac{\pi}{2}\frac{d}{dx}
       \left(x^3e^{-\pi x^2}\right).
\]

For `u in [lambda^(-1),lambda]`, zero extension gives the exact split

\[
\begin{aligned}
 E(h_\lambda)(u)-E(h)(u)
 &=u^{1/2}\sum_{m\leq\lambda/u}
       \bigl(h_\lambda(mu)-h(mu)\bigr)\\
 &\quad-u^{1/2}\sum_{m>\lambda/u}h(mu).
                                                        \tag{3.2}
\end{aligned}
\]

The first term is bounded by
`lambda delta_lambda u^(-1/2)`.  Monotonicity and the integral test give

\[
 u^{1/2}\sum_{m>\lambda/u}h(mu)
 \leq A_\lambda u^{1/2}+I_\lambda u^{-1/2}.       \tag{3.3}
\]

Consequently, in multiplicative measure,

\[
 \|E(h_\lambda)-E(h)\|_{L^2([\lambda^{-1},\lambda],du/u)}
 \leq \delta_\lambda\sqrt{\lambda^3-\lambda}+R_h(\lambda),
                                                        \tag{3.4}
\]

where the fully explicit Gaussian-tail term is

\[
 R_h(\lambda)=
 \left((\lambda-\lambda^{-1})(A_\lambda^2+I_\lambda^2)
       +4A_\lambda I_\lambda\log\lambda\right)^{1/2}. \tag{3.5}
\]

This is exponentially small.  Formula (3.2), unlike the abbreviated source
display, retains every term with `m>lambda/u`.

## 4. Inversion and the limiting periodic comparison

The Hermite combination `h` is Fourier invariant and satisfies both
`h(0)=0` and `integral_R h=0`.  Poisson summation therefore has no endpoint
correction and gives

\[
 E(h)(u)=E(h)(u^{-1}).                              \tag{4.1}
\]

Thus logarithmic

\[
 K(s)=E(h)(e^s)
\]

is even.  The averaging operator `(I+J)/2` is an orthogonal contraction, so
evenization cannot enlarge the right side of (3.4).  This proves the same
bound for `f_lambda(t)-K(t-a)` and automatically retains both breakpoint
families `L-log(m)` and `log(m)`.

The function `K` lies in `H^1(R)`.  This follows either from its rapidly
decaying Mellin transform `Xi/4` or directly from the estimate below.  Since
`K` is even,

\[
 K(-a)=K(a),
\]

so `t -> K(t-a)` belongs to periodic `H^1(0,L)`.  Periodic Parseval then
gives

\[
 \|(I-P_N)K(\,\cdot-a)\|_2
 \leq \frac{L}{2\pi(N+1)}\|K'\|_{L^2(-a,a)}
 \leq \frac{\log\lambda}{\pi(N+1)}C_K,             \tag{4.2}
\]

where `C_K=||K'||_(L2(R))`.

### An explicit bound for `C_K`

Differentiating the absolutely convergent arithmetic sum for `u>=1` gives

\[
 K'(\log u)=u^{1/2}\sum_{m\geq1}d(mu),\qquad
 d(x)=\left(\frac12+x\frac{d}{dx}\right)h(x),
\]

and direct differentiation gives

\[
 d(x)=e^{-\pi x^2}
 \left(-2\pi^3x^6+\frac{15}{2}\pi^2x^4
                    -\frac{15}{4}\pi x^2\right).  \tag{4.3}
\]

For `x>=1`, put

\[
 B=2\pi^3+\frac{15}{2}\pi^2+\frac{15}{4}\pi,
\]

so `|d(x)|<=B x^6 exp(-pi x^2)`.  Since
`x^6 exp(-pi x^2)` decreases for `x>=1`, the integral test yields, for
`u>=1`,

\[
 \sum_{m\geq1}m^6e^{-\pi m^2u^2}
 \leq S e^{-\pi u^2},                              \tag{4.4}
\]

with the explicit constant

\[
 S=1+\frac{e^\pi\,\Gamma(7/2,\pi)}{2\pi^{7/2}}.
\]

Hence

\[
 |K'(\log u)|\leq BS u^{13/2}e^{-\pi u^2}.
\]

Evenness of `K` and `ds=du/u` now give

\[
 C_K\leq
 BS\left(\frac{\Gamma(13/2,2\pi)}{(2\pi)^{13/2}}\right)^{1/2}
 <6.006.                                               \tag{4.5}
\]

This constant uses neither zeta zeros nor Weil positivity.
The independent Arb replay in
`artifacts/projection_rate/C_K_256bits.txt` encloses the exact expression at
256 bits and proves the rational comparison `C_K<6006/1000`.  The finite
evaluator uses `6006/1000`, not a rounded point value, as its safe default.

## 5. Projection theorem

Combining (3.4) and (4.2) proves, for every `lambda>1` and `N>=0`,

\[
\boxed{
 e_{\lambda,N}\leq
 \delta_\lambda\sqrt{\lambda^3-\lambda}
 +R_h(\lambda)
 +\frac{\log\lambda}{\pi(N+1)}C_K .}
                                                        \tag{5.1}
\]

Every quantity in (5.1) is exact or explicitly defined.  The only
finite-`lambda` prolate input is the supremum `delta_lambda` itself.

CCM-ZST-v1 Lemma 7.2, equations (7.7)--(7.12), states in the locked
normalization that

\[
 \delta_\lambda=O(\lambda^{-2}).                    \tag{5.2}
\]

Here is a finite normalization check for the project's fixed coefficient.
Let `f_n=h_(n,lambda)` be zero-extended and unit normalized for `n=0,4`, let
`epsilon_n=max|f_n-h_n|` on `[-lambda,lambda]`, and put
`beta_n=1-chi_n`.  On the even subspace the locked Fourier operator `F` is a
self-adjoint involution, `P_lambda F P_lambda f_n=chi_n f_n`, and
`F h_n=h_n`.  Therefore, with `P_-=(I-F)/2`,

\[
 \beta_n=2\|P_-f_n\|_2^2
 \leq4\lambda\epsilon_n^2
       +2\int_{|x|>\lambda}|h_n(x)|^2\,dx.          \tag{5.3}
\]

This derives the needed concentration estimate from the same uniform
fixed-index approximation; no separate Fuchs-type asymptotic is imported.

Set

\[
 v_0=h_0(0)=2^{1/4},\qquad
 v_4=h_4(0)=\frac{\sqrt3}{2^{5/4}},\qquad
 r=\frac{v_4}{v_0}=\frac{\sqrt3}{2^{3/2}}.
\]

The exact compression identity gives
`I_n=integral(f_n)=chi_n f_n(0)`.  If `epsilon_0<v_0`, then

\[
 \left|\frac{I_4}{I_0}-r\right|\leq R_\lambda,
\quad
 R_\lambda=
 \frac{\epsilon_4+\beta_4v_4
       +r(\epsilon_0+\beta_0v_0)}
      {\chi_0(v_0-\epsilon_0)}.                    \tag{5.4}
\]

For the project convention
`h_lambda=a4 f_4-a4(I_4/I_0)f_0`, this yields the explicit finite transfer

\[
 \delta_\lambda\leq a_4
 \left(\epsilon_4+(r+R_\lambda)\epsilon_0
                   +R_\lambda v_0\right).          \tag{5.5}
\]

Locked Lemma 7.2(i) gives `epsilon_n=O(lambda^(-2))`; (5.3)--(5.5) then give
`delta_lambda=O(lambda^(-2))` in exactly the unit-norm, positive-at-zero,
fixed-`a4` convention used by the producer.

Therefore, for any fixed `c>0` and any integer-valued schedule satisfying

\[
 N(\lambda)\geq c\lambda^2,
\]

(5.1) gives

\[
 e_{\lambda,N(\lambda)}=O(\lambda^{-1/2})
       +O\!\left(\frac{\log\lambda}{\lambda^2}\right). \tag{5.6}
\]

In particular, for every fixed `eta<1/2`,

\[
 \sqrt{\log\lambda}\,\lambda^\eta
 e_{\lambda,N(\lambda)}\longrightarrow0.           \tag{5.7}
\]

Thus `N(lambda)=3*ceil(lambda^2)`, the current diagnostic schedule, works for
the projection term; indeed any fixed positive quadratic multiplier does.
Moreover the projected state norms are
bounded, because (3.4) also gives

\[
 \|P_Nk_\lambda^+\|_2
 \leq \|K\|_2+O(\lambda^{-1/2}).                    \tag{5.8}
\]

The remaining part of equation (5.2) is consequently the weighted ground-
state term involving `D(T_lambda)`.  Nothing in this note proves a bound on
`T_lambda` or the shifted Weil sectors.

## 6. Effectivity boundary

Equation (5.1) is a finite exact inequality.  The asymptotic conclusion
(5.6) uses the existence statement in the pinned Lemma 7.2, whose proof cites
Meixner--Schaefke Satz 9 and does not print a numerical constant or threshold.
Accordingly:

- the qualitative projection rate needed for the limiting argument is
  proved from the locked theorem;
- a numerical interval certificate for (5.1) still requires an effective
  enclosure `delta_lambda<=A lambda^(-2)` with explicit `A` and threshold in
  the exact unit-norm convention;
- this effectivity issue does not restore or conceal the missing signed
  prolate--Weil comparison.

The project terminal state remains `P0_INVALIDATED` because of the separate
locked-source errata already recorded in `P0_SOURCE_ERRATA.md`.
