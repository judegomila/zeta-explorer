# Transition-prolate endpoint and complete outer-mode theorem

Status: source-locked analytic component theorem.  This note extends the
defect-relative endpoint, complete sampled-tail, weighted-norm, and weighted
translation estimates from the leading prolate range to every genuinely low
mode in the pinned KRD transition buffer.

The extension does **not** reuse the monotone exterior energy at the hard
endpoint.  That energy requires `mu<c^2` and can fail in the transition
buffer.  The replacement is a Liouville--Pruefer estimate beginning at
`2*lambda` together with the exact leakage norm near the singular endpoint.

This is a modewise positive sampling theorem.  The corrected growing source
columns, their compact projection remainders, quotient action, signed Weil
floors, equation (5.2), and determinant convergence remain separate.  The
project state remains `P0_INVALIDATED`; no RH conclusion is made.

## 1. Source lock and transition reduction

Use the additive Fourier convention

\[
 H_n(t)=\int_{\mathbb R}h_{n,\lambda}(x)e^{2\pi ixt}\,dx,
 \qquad k=2\pi\lambda,\qquad c=k\lambda=2\pi\lambda^2.       \tag{1.1}
\]

The prolate modes have unit Lebesgue norm on `[-lambda,lambda]`, are zero
extended, and satisfy

\[
 d_n=1-\chi_n^2,
 \qquad \int_\lambda^\infty H_n(t)^2\,dt={d_n\over2}.       \tag{1.2}
\]

Work on the locked schedule `lambda=p/2`, with odd integer `p>=5`.  Thus

\[
 S={2c\over\pi}=4\lambda^2=p^2.                             \tag{1.3}
\]

Put

\[
 \beta_\lambda={2\over\pi^2}\log(200\lambda^2+25),
 \quad b_\lambda=6+\left\lceil\beta_\lambda\log20\right\rceil,
 \quad n_*=S+b_\lambda.                                    \tag{1.4}
\]

Karnik--Romberg--Davenport Corollary 3 gives

\[
 n\ge n_*\Longrightarrow\chi_n^2\le {1\over2}.
\]

Therefore the exact contrapositive is

\[
 \boxed{d_n<{1\over2}\Longrightarrow n<n_*.}              \tag{1.5}
\]

There is no extra `+1`, and equality `d_n=1/2` is not promoted into the low
family.

For completeness, (1.5) supplies its own differential bound.  On
`span{P_0,...,P_n}`, the Legendre form and `x^2<=1` give

\[
 \mu_n(c)\le c^2+n(n+1).                                   \tag{1.6}
\]

The elementary estimates recorded in the exact replay give

\[
 n<n_*\Longrightarrow n\le6\lambda^2,
 \qquad n(n+1)<2c^2                                        \tag{1.7}
\]

for every locked `p>=5`.  Hence

\[
 \boxed{n<n_*\Longrightarrow 0\le\mu_n(c)<3c^2.}          \tag{1.8}
\]

Together with (1.5), this covers both the entire deterministic buffered
window and, a fortiori, every mode with `d_n<1/2`.  The converse of (1.5) is
neither needed nor asserted.

No numerical prolate eigenvalue or median theorem is used.

## 2. Uniform hard-endpoint estimate

On `t>lambda`, the exterior equation is

\[
 ((t^2-\lambda^2)H_n')'+(k^2t^2-\mu_n)H_n=0.               \tag{2.1}
\]

Set

\[
 p(t)=t^2-\lambda^2,
 \qquad w(t)=\sqrt{p(t)}H_n(t),
\]

\[
 w''+\Omega^2w=0,
 \qquad
 \Omega^2=k^2+{c^2-\mu_n\over p}+{\lambda^2\over p^2}.    \tag{2.2}
\]

When `t>=2lambda`, (1.8) and `p>=3lambda^2` imply

\[
 {k^2\over3}<\Omega^2<{3k^2\over2}.                        \tag{2.3}
\]

As a function of `p`, the derivative of `Omega^2` has the sign of
`-((c^2-mu_n)p+2lambda^2)`.  It therefore changes sign at most once.  Since
`Omega` tends to `k`, (2.3) gives the explicit total logarithmic variation

\[
 \operatorname {Var}_{[2\lambda,\infty)}\log\Omega
 \le\log\!\left(3\sqrt{3/2}\right)<\log(9/2).              \tag{2.4}
\]

With Pruefer variables

\[
 w=r\sin\theta,\qquad w'=r\Omega\cos\theta,
\]

one has

\[
 {r'\over r}=-{\Omega'\over\Omega}\cos^2\theta,
 \qquad
 \theta'=\Omega+{\Omega'\over\Omega}\sin\theta\cos\theta.
                                                                    \tag{2.5}
\]

The hard-endpoint integration-by-parts asymptotic fixes

\[
 \lim_{t\to\infty}r(t)=A_n,
 \qquad A_n={|h_{n,\lambda}(\lambda)|\over\pi}.             \tag{2.6}
\]

Equations (2.4)--(2.6) imply

\[
 {2A_n\over9}\le r(t)\le{9A_n\over2}.                     \tag{2.7}
\]

Direct differentiation of (2.2) also gives, on this range,

\[
 \left|{\Omega'\over\Omega}\right|<{8\over3\lambda}<{k\over2}.
                                                                    \tag{2.8}
\]

Consequently `k/4<theta'<3k/2`.  Across `[2lambda,3lambda]`, changing
variables to `theta`, retaining the endpoint error in the antiderivative of
`sin^2`, and using `k*lambda>8` gives

\[
 \int_{2\lambda}^{3\lambda}\sin^2\theta(t)\,dt
 \ge {\lambda\over24}.                                    \tag{2.9}
\]

Retain here the unrounded consequence of (2.4)--(2.6),

\[
 r(t)\ge {A_n\over3\sqrt{3/2}},
 \qquad r(t)^2\ge {2A_n^2\over27},                         \tag{2.9a}
\]

rather than the rounded lower bound in (2.7).  Since `p<=8lambda^2` on the
interval, (2.9a), (2.9), and (1.2) yield the stronger intermediate inequality

\[
 {d_n\over2}\ge {A_n^2\over2592\lambda}.                  \tag{2.10}
\]

The finite theorem deliberately retains a factor-two reserve:

\[
 \boxed{|h_{n,\lambda}(\lambda)|^2
       \le2592\pi^2\lambda d_n.}                           \tag{2.11}
\]

## 3. Far Volterra remainder and complete sampled series

For an even label, the boundary phase is sine.  Put

\[
 R_n(t)=H_n(t)-{h_{n,\lambda}(\lambda)\over\pi t}\sin(kt),
 \qquad K=k\lambda^2.                                      \tag{3.1}
\]

Variation of constants in (2.2), using (2.7),
`|c^2-mu_n|<=2c^2`, and

\[
 \int_t^\infty{ds\over s^2-\lambda^2}\le{4\over3t},
 \qquad
 \int_t^\infty{ds\over(s^2-\lambda^2)^2}\le{16\over27t^3},
                                                                    \tag{3.2}
\]

gives, with displayed slack,

\[
 \boxed{|R_n(t)|\le{18A_nK\over t^2},\qquad
 |R_n'(t)|\le{24A_nkK\over t^2},\quad t\ge2\lambda.}     \tag{3.3}
\]

In particular `|H_n(t)|<=6A_n/t` on the same range.  For `u>=lambda`,
split the samples at

\[
 M(u)=\max\{2,\lceil K/u\rceil\}.                           \tag{3.4}
\]

The low samples use `|H_n(mu)|<=6A_n/(mu)`.  Above `M`, the leading sine
tail satisfies

\[
 \left|\sum_{m>M}{\sin(m\vartheta)\over m}\right|\le4,     \tag{3.5}
\]

the denominator correction is absolutely summable, and (3.3) costs an
`m^(-2)` tail.  Thus the **complete** series obeys

\[
 \boxed{
 \left|\sum_{m\ge2}H_n(mu)\right|
 \le {28A_n\over u}
       \left(1+\log\left(2+{K\over u}\right)\right).}      \tag{3.6}
\]

The even-label restriction is essential here.  Replacing the sine boundary
phase by an odd-label cosine phase can create a resonant harmonic sum.

## 4. Weighted norm and translation modulus

Let `O_n` be the complete sampled exterior profile with both inversion-
reflected logarithmic tails retained.  For real `|y|<1/2`, put

\[
 \epsilon={1\over2}-|y|,
 \qquad L_\lambda=1+\log(2+2\pi\lambda^2).                  \tag{4.1}
\]

The `m=1` sample is estimated by exact leakage on `[lambda,2lambda]` and
by `|H_n|<=6A_n/t` afterward.  Per tail it costs at most

\[
 11665\,\lambda\epsilon^{-1}d_n.                            \tag{4.2}
\]

Equation (3.6) gives at most

\[
 254016\,\lambda L_\lambda^2\epsilon^{-1}d_n               \tag{4.3}
\]

for the complete `m>=2` series.  Applying `|x+z|^2<=2|x|^2+2|z|^2`
and then adding the two reflected tails proves

\[
 \boxed{
 \|e^{y\,\cdot}O_n\|_2^2
 \le1062724\,\lambda L_\lambda^2\epsilon^{-1}d_n.}        \tag{4.4}
\]

The translation estimate needs special care near `t=lambda`.  Integrating
(2.1) from the regular endpoint and using (1.2), for
`lambda<=u<=v<=2lambda`, gives

\[
 \boxed{
 |H_n(v)-H_n(u)|
 \le {4c^2\over\lambda}\sqrt{d_n/2}\sqrt{v-u}.}           \tag{4.5}
\]

This is the step that replaces the invalid transition-range monotone-energy
argument.  Apply (4.5) to the zero-extended near `m=1` remainder in log
coordinates, including both boundary strips.  Straight expansion gives

\[
 C_{\rm near}(\lambda)
 =1119744\pi^2\lambda^5+290304\pi^2\lambda^3+320c^4\lambda,
                                                                    \tag{4.6}
\]

\[
 \|\Delta_hB_{n,{\rm near}}^{(y)}\|_2^2
 \le C_{\rm near}(\lambda)d_nh^\epsilon.                   \tag{4.7}
\]

For the far series, (3.3), the split

\[
 \sum_{m\ge1}{1\over m^2}\min\{1,hkum\},                 \tag{4.8}
\]

and `Phi(z)^2<=4z^epsilon` give the deliberately rounded bound

\[
 \|\Delta_hB_{n,{\rm far}}^{(y)}\|_2^2
 \le10^9{K^2\over\lambda}d_nh^\epsilon                    \tag{4.9}
\]

per tail, including the true window boundary and the artificial near/far
join.  The exact sawtooth lemma and (2.11) give

\[
 \|\Delta_hB_{n,{\rm lead}}^{(y)}\|_2^2
 \le82944\pi^2\lambda\epsilon^{-1}d_nh^\epsilon.          \tag{4.10}
\]

Finally define

\[
 \boxed{
 D_{\rm tr}(\lambda)=6\left(
 82944\pi^2\lambda+C_{\rm near}(\lambda)
       +10^9{K^2\over\lambda}\right).}                    \tag{4.11}
\]

The factor six retains all three scalar pieces and both reflected tails.
For every `0<h<=1/2`,

\[
 \boxed{
 \|\tau_h(e^{y\,\cdot}O_n)-e^{y\,\cdot}O_n\|_2^2
 \le D_{\rm tr}(\lambda)\epsilon^{-1}h^\epsilon d_n.}     \tag{4.12}
\]

Since `c=2*pi*lambda^2` and `K=2*pi*lambda^3`, the displayed finite
constant has degree nine:

\[
 D_{\rm tr}(\lambda)=O(\lambda^9).                         \tag{4.13}
\]

Only the finite formula (4.11), never an unspecified `O(1)`, is used by the
producer.

## 5. Exact claim boundary

Equations (1.5), (1.8), (2.11), (3.3), (3.6), (4.4), and (4.12) close the
modewise transition-buffer obstruction.  The old `mu<c^2` monotonicity is
not assumed in the transition band, no zeta-zero list is read, and no Weil
positivity is used.

The next obligation is a source-coordinate Loewner lift of these estimates:
zero-integral combinations, the invisible origin correction, anchor
deflation, the growing compact projection remainder, and every sampling
cross term must all remain inside one inequality.  Until that successor is
proved, no blockwise quotient estimate follows.  Even after it is proved,
the signed sector comparison, equation (5.2), and locally uniform
determinant convergence remain open.
