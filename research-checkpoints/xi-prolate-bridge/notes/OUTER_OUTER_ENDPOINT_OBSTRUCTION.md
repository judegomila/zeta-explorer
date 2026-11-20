# Two physical outer tails: endpoint audit and remaining obstruction

## 1. Claim boundary

This note audits the proposed estimate for the combined explicit Weil
distribution evaluated on two physical outer prolate remainders.  It proves
three ingredients:

1. a monotone exterior energy for each oscillatory prolate Fourier tail;
2. an explicit defect-relative `L2` bound for the sampled physical tail of
   every fixed corrected combination of such modes; and
3. the exact same-side/cross-tail correlation formula on the whole positive
   logarithmic half-line.

It does **not** prove the desired outer--outer Weil bound.  The unresolved
term is the combined distribution applied to the multiplicative
hard-endpoint autocorrelation in Sections 6--7 below.  In particular, this
note does not prove a signed prolate--Weil comparison, a sector floor,
equation (5.2) of `DIRECT_RH_ATTACK.md`, or RH.

The later theorem `notes/OUTER_PROJECTION_RADICAL_REDUCTION.md` closes the
two mixed projection orientations for the actual corrected combined `0/4`
source state.  That result uses radical cancellation and does not alter the
two-outer obstruction audited here.

The distinction matters because the zero extension of a prolate mode has a
nonzero endpoint.  Its physical tail contains a centered Bernoulli sawtooth
whose logarithmic derivative has neither finite `L2` norm nor finite total
variation.  An `H1` estimate for that tail is false.

## 2. Exterior energy which does not lose the defect

Use the Fourier convention

\[
 \widehat h(\xi)=\int_{\mathbb R}h(x)e^{2\pi i x\xi}\,dx.
\]

For a real even unit prolate mode, put

\[
 H(\xi)=\widehat h(\xi),\qquad
 d=1-\chi^2,
\]

and suppose its differential eigenvalue satisfies `mu<c^2`, where

\[
 k=2\pi\lambda,\qquad c=k\lambda=2\pi\lambda^2.
\]

On `t>lambda`, set

\[
 p(t)=t^2-\lambda^2,qquad q(t)=k^2t^2-\mu.
\]

The exterior equation is

\[
 (pH')'+qH=0.                                      \tag{2.1}
\]

The following elementary energy is more useful near the singular endpoint
than the pointwise consequence of the Liouville transform:

\[
 \mathcal A(t)=H(t)^2+\frac{p(t)}{q(t)}H'(t)^2.    \tag{2.2}
\]

Direct differentiation using (2.1) gives the exact identity

\[
 \boxed{
 \mathcal A'(t)
 =-\frac{p'(t)q(t)+p(t)q'(t)}{q(t)^2}H'(t)^2\leq0.} \tag{2.3}
\]

Since `p(lambda)=0`,

\[
 \boxed{|H(t)|\leq |H(\lambda)|
        =\chi|h(\lambda)|\leq |h(\lambda)|,
        \qquad t\geq\lambda.}                    \tag{2.4}
\]

This is defect-relative after the endpoint estimate in
`PROLATE_TAIL_ENVELOPE.md`:

\[
 |h(\lambda)|\leq16\pi\sqrt{\lambda d}.          \tag{2.5}
\]

It also repairs a tempting but invalid use of
`|H(t)|<=A/sqrt(t^2-lambda^2)` directly at the endpoint.

## 3. Explicit sampled-tail `L2` conditioning

Let

\[
 w(t)=\sqrt{t^2-\lambda^2}\,H(t),\qquad
 A=\frac{|h(\lambda)|}{\pi}.
\]

The Prüfer proof in `PROLATE_TAIL_ENVELOPE.md` gives `|w|<=A` and fixes the
asymptotic phase.  Variation of constants therefore gives, for `t>=2lambda`,

\[
 w(t)=\frac{h(\lambda)}\pi\sin(kt)+e(t),          \tag{3.1}
\]

\[
 |e(t)|\leq \frac Ak\left(
 (k^2\lambda^2-\mu)\int_t^\infty
       \frac{ds}{s^2-\lambda^2}
 +\lambda^2\int_t^\infty
       \frac{ds}{(s^2-\lambda^2)^2}\right).      \tag{3.2}
\]

For `t>=2lambda`,

\[
 \int_t^\infty\frac{ds}{s^2-\lambda^2}\leq\frac4{3t},
 \qquad
 \int_t^\infty\frac{ds}{(s^2-\lambda^2)^2}
       \leq\frac{16}{27t^3}.                     \tag{3.3}
\]

Put `K=k*lambda^2`.  For `u>=lambda`, split the sampled series at

\[
 M(u)=\max\{2,\lceil K/u\rceil\}.
\]

For `2<=m<=M`, the Prüfer amplitude gives

\[
 |H(mu)|\leq\frac{2A}{\sqrt3\,mu}.               \tag{3.4}
\]

For `m>M`, insert (3.1)--(3.3).  The leading series is controlled by the
uniformly bounded harmonic sine tail; replacing
`sqrt((mu)^2-lambda^2)` by `mu` costs an absolutely summable `m^(-3)`
series; and the error in (3.2) costs an `m^(-2)` tail.  These three estimates,
with deliberately rounded constants, are as follows.  For every real
`theta` and integer `M>=2`, the elementary Dirichlet split at the distance
of `theta` from `2*pi*Z` gives

\[
 \left|\sum_{m>M}\frac{\sin(m\theta)}m\right|\leq4. \tag{3.5a}
\]

Indeed, if `phi` is the distance of `theta` from `2*pi*Z` and
`phi<=1/M`, the first `M` terms have modulus at most `M*phi<=1`, while
the full sawtooth series has modulus at most `pi/2`.  If `phi>1/M`,
Dirichlet summation bounds the displayed tail by
`1/(M*sin(phi/2))<=pi` after reflecting to `0<phi<=pi`.  The rounded
constant four covers both cases and the endpoints.

Also, for `t>=2lambda`,

\[
 0\leq\frac1{\sqrt{t^2-\lambda^2}}-\frac1t
 \leq\frac{\lambda^2}{t^3}.                     \tag{3.5b}
\]

Thus the high leading term, including the denominator correction, is at
most `5*A/u`.  From (3.2)--(3.3),

\[
 \frac{|e(mu)|}{\sqrt{(mu)^2-\lambda^2}}
 \leq\frac{8AK}{3\sqrt3\,m^2u^2}
 +\frac{32A\lambda^2}{27\sqrt3\,k m^4u^4}.       \tag{3.5c}
\]

Since

\[
 \sum_{m>M}m^{-2}\leq M^{-1},\qquad
 \sum_{m>M}m^{-4}\leq(3M^3)^{-1},\qquad
 M\geq K/u,
\]

the high Volterra error is at most `3*A/u`.  Finally, (3.4) gives

\[
 \sum_{m=2}^{M}|H(mu)|
 \leq\frac{2A}{\sqrt3\,u}\log M
 \leq\frac{2A}{u}\log\left(2+\frac Ku\right).   \tag{3.5d}
\]

Adding `5+3+2*log(2+K/u)` is bounded by the following deliberately loose
constant:

\[
 \boxed{
 \left|\sum_{m\geq2}H(mu)\right|
 \leq \frac{12A}{u}
   \left(1+\log\left(2+\frac K u\right)\right).} \tag{3.5}
\]

No absolute harmonic-series estimate is used in (3.5).

Define the sampled exterior profile

\[
 \mathcal B_h(t)=\frac12\sqrt u
       \sum_{m\geq1}H(mu),
 \qquad u=\lambda e^t,\quad t\geq0.             \tag{3.6}
\]

The `m=1` term is handled by the exact one-sided leakage identity

\[
 \int_\lambda^\infty H(u)^2\,du=d/2,             \tag{3.7}
\]

not by a pointwise endpoint bound.  Equations (2.5), (3.5), and (3.7)
then imply

\[
 \boxed{
 \|\mathcal B_h\|_{L^2(0,\infty)}
 \leq C_{\rm samp}(\lambda)\sqrt d,\qquad
 C_{\rm samp}(\lambda)
 =1+96\left(1+\log(2+2\pi\lambda^2)\right).}     \tag{3.8}
\]

The constant is intentionally loose but completely specified.  Formula
(3.8) is a conditioning bound for the sampled *exterior Fourier series*.
An individual prolate mode does not satisfy the two codimension conditions,
so (3.6) by itself must not be called its global radical state.

For a corrected finite combination

\[
 f=\sum_j a_jh_j-A_0\psi(x/a),qquad
 a=(2\lambda)^{-1},                              \tag{3.9}
\]

with `f(0)=integral(f)=0` and every `mu_j<c^2`, Poisson summation identifies
the right physical outer profile with the corresponding linear combination
of (3.6).  The fixed bump has the explicit bound

\[
 \|\mathcal B_{\psi(\cdot/a)}\|_2
 \leq\frac{C_\psi}{24\sqrt{3\lambda}},           \tag{3.10}
\]

because

\[
 |\widehat\psi(\xi)|\leq
 \frac{\|\psi''\|_1}{(2\pi|\xi|)^2},qquad
 \|\psi''\|_1\leq C_\psi,
\]

and `sum_(m>=1)m^(-2)=pi^2/6`.  Hence

\[
 \boxed{
 \|B_f\|_2\leq
 C_{\rm samp}(\lambda)\sum_j|a_j|\sqrt{d_j}
 +\frac{|A_0|C_\psi}{24\sqrt{3\lambda}}.}        \tag{3.11}
\]

For the locked corrected source state specifically, equation (5.7) of
`PROLATE_TAIL_ENVELOPE.md` gives

\[
 |A_0|=|h_\lambda(0)|
 \leq2\sqrt2\,a_4\sqrt\lambda\,d_4.             \tag{3.12}
\]

Consequently its bump contribution in (3.11) is not an unspecified
constant and is defect-relative:

\[
 \frac{|A_0|C_\psi}{24\sqrt{3\lambda}}
 \leq\frac{a_4C_\psi}{12}\sqrt{\frac23}\,d_4.  \tag{3.13}
\]

Together with `d_0<=d_4` and
`|a_(0,lambda)|<=2*sqrt(2)*a_4*lambda`, also from the locked tail audit,
the complete corrected source profile therefore satisfies

\[
 \boxed{
 \|B_{\widetilde h_\lambda}\|_2
 \leq a_4C_{\rm samp}(\lambda)(1+2\sqrt2\lambda)\sqrt{d_4}
 +\frac{a_4C_\psi}{12}\sqrt{\frac23}\,d_4.}      \tag{3.14}
\]

This is the promised defect-relative physical-tail `L2` estimate for a
fixed corrected combination.  It does not give an `H1` estimate.

## 4. Exact all-range outer correlation

Let `ell=log(lambda)` and let a real outer state of parity `epsilon_j` be

\[
 O_j(t)=
 \begin{cases}
 B_j(t-\ell),&t>\ell,\\
 \epsilon_jB_j(-t-\ell),&t<-\ell,\\
 0,&|t|\leq\ell.
 \end{cases}                                      \tag{4.1}
\]

Opposite parities cancel in the source correlation.  For equal parity
`epsilon`, direct splitting of both integrals gives, for every `x>=0`,

\[
\boxed{
\begin{aligned}
 \mathfrak q(O_n,O_m;x)
 &=2\int_0^\infty\bigl(
 B_n(t)B_m(t+x)+B_n(t+x)B_m(t)\bigr)\,dt\\
 &\quad+2\epsilon\,\mathbf1_{x\geq L}
       (B_n*B_m)(x-L),\qquad L=2\log\lambda.
\end{aligned}}                                    \tag{4.2}
\]

Thus (6.3) of `NEAR_SIGNED_HANKEL_REDUCTION.md` is exactly the `x<L`
part of (4.2); it cannot be used after `L`.  If

\[
 b_j(t)=e^{t/2}B_j(t),
\]

the normalized cross-tail term is

\[
 \boxed{
 e^{x/2}\mathfrak q_{\rm cross}(x)
 =2\epsilon\lambda\,(b_n*b_m)(x-L),\qquad x\geq L.} \tag{4.3}
\]

The factor `lambda` and the reflection-created convolution are mandatory.

On the near range, (3.11) at least gives the explicit amplitude estimate

\[
 \sup_{0\leq x\leq L}
 \left|e^{x/2}\mathfrak q(O_n,O_m;x)\right|
 \leq4\lambda\|B_n\|_2\|B_m\|_2.                \tag{4.4}
\]

## 5. Variation of the already-combined kernel

Put

\[
 \delta_*(x)=1-p(x)+a(x),
\]

\[
 p(x)=e^{-x}\psi_C(e^x),qquad
 a(x)=-\frac12e^{-x}\log(1-e^{-2x}).             \tag{5.1}
\]

The function `a` is positive and decreasing.  Between prime-power jumps,
`p'=-p`, while the jump at `log n` is `Lambda(n)/n`.  Therefore, for
`0<epsilon<log 2<L`,

\[
 \boxed{
 \operatorname {Var}_{[\epsilon,L]}(\delta_*)
 \leq a(\epsilon)+p(L)+2\int_{\log2}^{L}p(x)\,dx.} \tag{5.2}
\]

This estimate is taken only after the pole, archimedean, and prime terms
have formed the single kernel `delta_*`.

The pinned PNT constants `A_P=9.22022` and `alpha=0.8476836` make (5.2)
fully explicit:

\[
\begin{aligned}
 \operatorname {Var}_{[\epsilon,L]}(\delta_*)
 &\leq a(\epsilon)+1+A_PL^{3/2}e^{-\alpha\sqrt L}
      +2(L-\log2)\\
 &\quad+\frac{4A_P}{\alpha^5}
       \Gamma(5,\alpha\sqrt{\log2}).             \tag{5.3}
\end{aligned}
\]

Thus the cost of Stieltjes integration by parts on a finite near range is
only logarithmic in `1/epsilon` and linear in `L`, not exponential in the
number of prime powers.

## 6. The hard endpoint is not in `H1`

The leading exterior asymptotic and the harmonic sine series show that the
sampled tail contains

\[
 B_{0,h}(t)=\frac{h(\lambda)}{2\sqrt{\lambda e^t}}
       P(\lambda^2e^t),                           \tag{6.1}
\]

where

\[
 P(y)=\sum_{m\geq1}\frac{\sin(2\pi my)}{\pi m}
 =\frac12-\{y\}
\]

away from integers, with midpoint value zero at integers.  Its jumps occur
at `t=log(m/lambda^2)` and have amplitudes comparable to `m^(-1/2)`.
Their absolute sum diverges, and the square integral of the ordinary slope
also diverges.  Hence

\[
 B_{0,h}\notin H^1(0,\infty),qquad
 \operatorname {Var}(B_{0,h})=\infty.            \tag{6.2}
\]

This invalidates a direct derivative--Toeplitz estimate.

There is nevertheless a quantitative translation modulus.  An elementary
unit-interval split gives, for `eta=e^x-1<=1/2`,

\[
 \int_{\lambda^2}^\infty
 \left|e^{-x/2}P(e^xs)-P(s)\right|^2\frac{ds}{s^2}
 \leq32\eta\left(1+\log\frac1\eta\right).        \tag{6.3}
\]

For clarity, on `[r,r+1)` with `eta*(r+1)<1`, the set on which the two
sawteeth lie on opposite sides of a jump has length at most
`eta*(r+1)`; off that set their difference has modulus at most the same
quantity.  The squared integral on that unit interval is therefore at most
`2*eta*(r+1)`.  If `eta*(r+1)>=1`, use the bound one.  Multiplication by
`s^(-2)` and summation below and above `r=1/eta` gives (6.3); the harmless
factor `e^(-x/2)` costs less than the slack in 32.  This proof uses no
differentiability of `P`.

Consequently

\[
 \|B_{0,h}(\cdot+x)-B_{0,h}\|_2^2
 \leq8|h(\lambda)|^2\lambda\,
       \eta\left(1+\log\frac1\eta\right).       \tag{6.4}
\]

The exponent is sufficient for the logarithmic singularity of `delta_*` at
zero.  What has not yet been completed is a comparably explicit modulus for
the **complete** Volterra remainder after (6.1), uniform in the corrected
source family.  Such a proof must subtract at least the next endpoint term;
otherwise differentiating the `t^(-2)` oscillatory remainder recreates a
harmonic series.

## 7. The all-range obstruction

Even after the near-zero modulus is finished, (4.3) remains.  For the
endpoint pieces (6.1), it contains the exact integral

\[
 \int_0^y
 P(\lambda^2e^t)P(\lambda^2e^{y-t})\,dt
 =\int_{\lambda^2}^{\lambda^2e^y}
 P(s)P(\lambda^4e^y/s)\,\frac{ds}{s}.            \tag{7.1}
\]

This is a multiplicative Bernoulli/Vasyunin-type correlation.  Its value is
bounded trivially by `y/4`, but the combined Weil functional uses its
distributional derivative.  Neither (3.11), (6.3), nor the existing
far-frequency primitive bound controls that derivative on `y>=0`.
Integrating it by parts against `delta_*` is not a substitute: the total
variation of the normalized continuous main term plus the prime jumps is
infinite on `[L,infinity)`, even though `delta_*(x)` itself tends to zero by
the PNT.

The far-prime theorem in `PROLATE_TAIL_ENVELOPE.md` has one finite-window
test vector and one global corrected state.  It does not estimate the
reflection-created two-outer convolution (7.1), so citing it here would drop
a cross-tail term.

The remaining theorem is therefore precise:

1. finish a defect-relative translation modulus for the complete sampled
   Volterra remainder, so that (5.2)--(5.3) legitimately control `0<x<L`;
2. bound the combined explicit distribution on (7.1), together with the
   next endpoint and Volterra-remainder cross terms, without replacing it by
   separate infinite-variation prime and continuous pieces.

The projection-containing part of the earlier program is now discharged for
the actual corrected combined state: the compact P--P theorem and
`notes/OUTER_PROJECTION_RADICAL_REDUCTION.md` control all three such terms.
This does not supply a generic modewise radical or multiplier statement and
does not estimate (7.1).

Until item 2 is proved, no bound of the form

\[
 Cc^\theta\sqrt{d_nd_m}
\]

has been established for the complete outer--outer pairing, for any claimed
value of `theta`.

## 8. Sharpened route audit

`notes/OUTER_OUTER_SPECTRAL_SAMPLING_REDUCTION.md` derives the exact
almost-everywhere formula identifying the derivative in (7.1) with a
truncated Dirichlet-divisor sum--integral discrepancy.  It proves that the
pinned PNT envelope and any separate positive-power divisor-error envelope
cannot close the tail after absolute values.

That note also records a distinct conditional route: an unconditional
zero-free region and local zero count convert a defect-relative weighted
fractional-Sobolev estimate for the complete outer profile into an
absolutely convergent spectral-pairing bound.  The leading sawtooth has the
required fractional regularity.  The complete Volterra remainder estimate,
the hard-endpoint domain passage, and the new source lock are not yet proved,
so this route does not change the claim boundary above.
