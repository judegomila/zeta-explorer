# The exact `N=2` modular payment and why the cubic floor cannot pay it by itself

## Outcome and scope

Let

\[
 b_1={s_1\over s_0},\qquad b_2={s_2\over s_1}
\]

on the already positive prefix through degree two.  The unique negative
direction left by the modular commutator at `N=2` has the exact coefficient

\[
 \boxed{
 \kappa _2(a)=a\left\{
 8+{36a^2\over b_2}
 +{(4a^2-2b_1+b_2)^2\over b_1b_2}
 \right\}.}                                                   \tag{1}
\]

If `v=-psi'/psi`, its physical negative-half-line mass is

\[
 \boxed{
 Q_2^-(a)=\int_0^\infty h e^{-2ah}\psi(h)^2
 \bigl((a+v(h))^2-v'(h)+b_1\bigr)^2\,dh.}                    \tag{2}
\]

Consequently the strong next-rung payment of that one negative square is

\[
 \boxed{s_3(a)\geq \kappa _2(a)Q_2^-(a).}                    \tag{3}
\]

Every quantity on the right of (3) is determined by the current positive
prefix.  No next-pivot sign is used.

The new cubic transport floor

\[
 s_3(a)>{4913\over4}s_0(a)                                  \tag{4}
\]

does **not** pay (3) by itself.  In fact the guaranteed amount in (4) is
strictly smaller than the modular cost for all sufficiently small positive
`a`.  This is an analytic endpoint obstruction to that proof route, not a
failure of the actual payment: the true `s_3` contains positive excess that
(4) discards.

No finite-degree sweep, all-degree theorem, or RH conclusion is claimed.

## 1. Exact reflection algebra

The real physical recurrence is

\[
 T_{j+1}(x)=xT_j(x)+b_jT_{j-1}(x).
\]

Thus

\[
 T_0=1,\quad T_1=x,\quad T_2=x^2+b_1,\quad
 T_3=x^3+(b_1+b_2)x.                                      \tag{5}
\]

Reflection about `a` gives

\[
\begin{aligned}
 T_1(2a-x)&=-T_1+2aT_0,\\
 T_2(2a-x)&= T_2-4aT_1+4a^2T_0,\\
 T_3(2a-x)&=-T_3+6aT_2-12a^2T_1
       +2a(4a^2-2b_1+b_2)T_0.                            \tag{6}
\end{aligned}
\]

In the current pivot-normalized prefix basis the reflection matrix and the
next boundary vector are therefore

\[
 R=\begin{pmatrix}
 1&0&0\\
 {2a\over\sqrt{b_1}}&-1&0\\
 {4a^2\over\sqrt{b_1b_2}}&-{4a\over\sqrt{b_2}}&1
 \end{pmatrix},                                           \tag{7}
\]

\[
 r_2=6a,\qquad
 r_1=-{12a^2\over\sqrt{b_2}},\qquad
 r_0={2a(4a^2-2b_1+b_2)\over\sqrt{b_1b_2}}.              \tag{8}
\]

Direct multiplication retains the cross terms and gives `R^T r=r`, as
required for even `N`.  After congruence by `R`, the modular commutator is

\[
 4aI-e_2r^T-re_2^T
 =\begin{pmatrix}4aI_2&-r_\perp\\-r_\perp^T&-8a\end{pmatrix}. \tag{9}
\]

Its exact completion is

\[
 4a\left\|z_\perp-{z_2r_\perp\over4a}\right\|^2
 -\left(8a+{\|r_\perp\|^2\over4a}\right)z_2^2.           \tag{10}
\]

Substitution of (8) into (10) proves (1).  In particular, the centered
square in (1) contains the full expansion

\[
 (4a^2-2b_1+b_2)^2
 =16a^4+4b_1^2+b_2^2-16a^2b_1+8a^2b_2-4b_1b_2.           \tag{11}
\]

None of the mixed terms in (11) may be dropped.

## 2. The physical half-line cost

Put `g_a(u)=e^{au}psi(u)` and `F_2=T_2(D)g_a`.  Evenness of `psi` and oddness
of `v` give, for `h>0`,

\[
 F_2(-h)=e^{-ah}\psi(h)
 \bigl((a+v(h))^2-v'(h)+b_1\bigr).                        \tag{12}
\]

Hence (2) is exactly

\[
 Q_2^-=\int_0^\infty hF_2(-h)^2\,dh,
 \qquad \mu_2^-={Q_2^-\over s_2}.                         \tag{13}
\]

The reflected normalized coordinate satisfies
`z_2(h)=e^{2ah}Y_2(-h)`.  Against the commutator weight
`h e^{-4ah}dh`, the negative term in (10) therefore integrates with no
remaining exponential:

\[
 \kappa _2\int_0^\infty h e^{-4ah}z_2^2dh
 =\kappa _2\mu_2^-.                                      \tag{14}
\]

The strong normalized payment
`s_3/s_2 >= kappa_2 mu_2^-` is exactly (3).  It pays the explicit negative
square.  It is not an equivalence to positivity of the complete integrated
conservation law, whose signed weight derivative and next-feature cross
term remain.

## 3. What the cubic floor would have to prove

Combining (1)--(4) would require the current-prefix inequality

\[
 \boxed{
 \left\{8+{36a^2\over b_2}
 +{(4a^2-2b_1+b_2)^2\over b_1b_2}\right\}Q_2^-(a)
 \leq {4913\over4}{s_0(a)\over a}.}                       \tag{15}
\]

Equivalently,

\[
 \kappa _2\mu_2^-\leq {4913\over4b_1b_2}.                \tag{16}
\]

Equations (15)--(16) are noncircular: they use only the prefix through
degree two.  The existing lower estimates

\[
 b_1>{17\over2},\qquad b_1b_2>{627\over4}                 \tag{17}
\]

cannot prove them.  With `b_1` fixed and `b_2` tending to infinity, the
centered term in braces in (15) grows like `b_2/b_1`; (17) supplies neither
the missing upper control nor a correlated decay estimate for `Q_2^-`.

There is a stronger obstruction: (15) is false near the normalized
endpoint.

## 4. Analytic endpoint comparison

Write

\[
 N_0=\int_0^\infty\psi^2dh,\quad
 B_k=\int_0^\infty h^k\psi^2dh,\quad
 C_2=\int_0^\infty h^2(\psi')^2dh.                        \tag{18}
\]

Let `sigma_j=lim_(a->0+)s_j(a)/a` and put
`bar b_j=lim_(a->0+)b_j(a)`.  Direct differentiation at zero gives

\[
 \sigma _0=4B_2,qquad
 \bar b_1={\sigma _1\over\sigma _0}
 ={2C_2-N_0\over2B_2}.                                   \tag{19}
\]

The endpoint feature is

\[
 F_{2,0}=\psi''+\bar b_1\psi,qquad
 Q_{2,0}^-=\int_0^\infty hF_{2,0}^2dh.                   \tag{20}
\]

Two integrations by parts, with all endpoint terms killed by theta decay,
retain the stationarity normalization:

\[
\begin{aligned}
 \int_0^\infty h^2\psi F_{2,0}dh
 &=N_0-C_2+\bar b_1B_2\\
 &={N_0\over2}.                                          \tag{21}
\end{aligned}
\]

Cauchy--Schwarz applied to
`(sqrt(h) F_(2,0), h^(3/2) psi)` gives

\[
 Q_{2,0}^-\,B_3\geq {N_0^2\over4}.                       \tag{22}
\]

The audited complete-theta curvature bound is

\[
 v'(h)>17.                                                 \tag{23}
\]

Since `v(0)=0`, equation (23) gives `v(h)>17h` for `h>0`.
Thus

\[
 {d\over dh}\log\left(\psi(h)^2e^{17h^2}\right)
 =-2v(h)+34h<0.                                           \tag{24}
\]

Relative to the half-Gaussian density proportional to `e^(-17h^2)`, the
likelihood ratio in (24) is decreasing.  The elementary opposite-monotonicity
covariance inequality therefore gives, for every increasing `f`,

\[
 {\int_0^\infty f(h)\psi(h)^2dh\over N_0}
 \leq
 {\int_0^\infty f(h)e^{-17h^2}dh
  \over\int_0^\infty e^{-17h^2}dh}.                       \tag{25}
\]

For `f(h)=h^2,h^3`, the exact Gaussian moments give

\[
 {B_2\over N_0}\leq{1\over34},\qquad
 {B_3\over N_0}\leq{1\over\sqrt\pi\,17^{3/2}}.          \tag{26}
\]

Combining (19), (22), and (26),

\[
 {Q_{2,0}^-\over\sigma _0}
 \geq {\sqrt\pi\,17^{5/2}\over8}.                       \tag{27}
\]

The exact endpoint reflection coefficient is

\[
 \kappa _0:=\lim_{a\to0+}{\kappa _2(a)\over a}
 =8+{(\bar b_2-2\bar b_1)^2\over\bar b_1\bar b_2}
 \geq8.                                                   \tag{28}
\]

Therefore

\[
 \boxed{
 {\kappa _0Q_{2,0}^-\over\sigma _0}
 \geq\sqrt\pi\,17^{5/2}
 >{17^3\over4}={4913\over4}.}                            \tag{29}
\]

The last strict comparison is equivalent after squaring to `16 pi>17`.

The normalized pivots, `bar b_1,bar b_2`, and the integral (20) have the
analytic/dominated endpoint extensions already used in the general cubic
transport.  Hence

\[
 {\kappa _2(a)Q_2^-(a)\over s_0(a)}
 \longrightarrow {\kappa _0Q_{2,0}^-\over\sigma _0}.     \tag{30}
\]

Equations (29)--(30) prove that, for some `epsilon>0`,

\[
 \kappa _2(a)Q_2^-(a)>{4913\over4}s_0(a)
 \qquad(0<a<\epsilon).                                   \tag{31}
\]

Thus the floor (4) cannot certify (3) uniformly on `0<a<=1/4`.  Equation
(31) does **not** reverse the actual payment: from
`s_3>(4913/4)s_0` and `kappa_2Q_2^->(4913/4)s_0` no ordering between `s_3`
and `kappa_2Q_2^-` follows.

## 5. The precise next analytic target

Define the positive cubic excess discarded by (4),

\[
 \mathcal E_3(a)=s_3(a)-{4913\over4}s_0(a).                \tag{32}
\]

The exact payment (3) is equivalent to the correlated inequality

\[
 \boxed{
 \mathcal E_3(a)\geq
 \kappa _2(a)Q_2^-(a)-{4913\over4}s_0(a),
 \qquad0<a\leq{1\over4}.}                                \tag{33}
\]

This is theorem-shaped and noncircular when the left side is evaluated by
the coefficient-free transport law:

\[
 \mathcal E_3(a)=\int_0^a\left{
 {h_{g_t}[p_3(\,\cdot\,;t)]\over2\pi}-{4913\over4}s_0'(t)
 \right\}dt,                                             \tag{34}
\]

where `p_3(xi;t)=xi^3-(b_1(t)+b_2(t))xi` is fixed by the current prefix.  The
right side of (33) is strictly positive near zero by (31).  The next proof
must therefore retain the completed-square and curvature excess discarded
by the coarse `X>17`, `P>8X^4` floor and compare it directly with the
correlated half-line cost.  Separate lower pivot estimates cannot do this.

## Provenance and reproduction

The companion standard-library verifier checks the polynomial reflection
identities, every mixed term in (11), the endpoint stationarity
normalization, the exact constant comparison in (29), and frozen hashes of
the archived reflection, half-line, curvature-audit, and cubic-transport
sources:

```text
python3 workstreams/all-degree-analytic-search-next-v1/src/verify_modular_n2_cubic_reserve_payment_map_20261103.py \
  --root . \
  --output workstreams/all-degree-analytic-search-next-v1/results/modular_n2_cubic_reserve_payment_map_20261103.json
```

This verifier checks exact algebra and source binding.  It is not a formal
proof-assistant development and performs no finite-degree sweep.

Two separate read-only audits were used before freeze.  One independently
rederived (5)--(16), including `R^T r=r`, the Schur coefficient, the physical
half-line normalization, and the endpoint limit.  A second independently
checked (18)--(31), including the likelihood-ratio covariance argument and
the exact Gaussian constants, and replayed the companion verifier.  Both
reported `PASS` with no mathematical correction; neither touched a live
workload or any file.
