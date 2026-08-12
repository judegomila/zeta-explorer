# Cutoff-free actual-dangerous adjoint regularity barrier

## 0. Exact outcome and fail-closed boundary

Keep the literal cutoff-free arithmetic adjoint, the actual complete
von-Mangoldt multiplier, and the additive prolate prefix of checkpoints
1.67--1.68.  Put

\[
 I_L=[-L/2,L/2],\qquad L=2\log\lambda,                 \tag{0.1}
\]

and, in logarithmic physical coordinates, let

\[
 T_v=C_L^*\mathcal F^*M_v\mathcal F C_L,
 \qquad
 v(t)=[g+U-m_\lambda(t)]_+.                            \tag{0.2}
\]

This note proves an actual-projector regularity theorem.  Define

\[
 \mathcal A_\lambda
 =g+U+2\Sigma_\lambda-\psi(1/4)+\log\pi,
 \qquad
 \Sigma_\lambda=\sum_{1<n\leq\lambda^2}
              {\Lambda(n)\over\sqrt n}.              \tag{0.3}
\]

If `mathcal A_lambda>0`, put

\[
 T_\lambda={1\over2}\sqrt{e^{2\mathcal A_\lambda}-1}.
                                                               \tag{0.4}
\]

The exact pointwise multiplier bound is

\[
 \boxed{
 0\leq v(t)\leq
 \left[\mathcal A_\lambda
       -{1\over2}\log(1+4t^2)\right]_+,\qquad
 \operatorname {supp}v\subset[-T_\lambda,T_\lambda].}
                                                               \tag{0.5}
\]

For every `vartheta>0`, let

\[
 \Pi_\vartheta={\bf1}_{[\vartheta,\infty)}(T_v),
 \qquad W_\vartheta=\operatorname {Ran}\Pi_\vartheta.
                                                               \tag{0.6}
\]

Every `y in W_vartheta` has an entire extension `widetilde y` of
exponential type at most `T_lambda`, and for every integer `k>=0`,

\[
 \boxed{
 \|\widetilde y^{(k)}\|_{L^2(\mathbb R)}
 \leq{\mathcal A_\lambda T_\lambda^k\over\vartheta}
       \|y\|_{L^2(I_L)}.}                             \tag{0.7}
\]

This is genuine actual-symbol information.  It is not enough for the
near-Shannon bridge gate.  The currently certified radius (0.4) is only
`exp(O(lambda))` on the frozen absolute-amplitude schedule.  More
importantly, the literal arithmetic adjoint destroys additive smoothness.
If

\[
 z=A_{\lambda,0}^*y
\]

and `a_n=n/lambda` is an interior arithmetic breakpoint, then

\[
 \boxed{
 z(a_n+)-z(a_n-)
 ={\sqrt\lambda\over2n}\,y(-L/2).}                   \tag{0.8}
\]

If the endpoint jet vanishes through order `r-1`, then instead

\[
 \boxed{
 z^{(r)}(a_n+)-z^{(r)}(a_n-)
 ={\lambda^{r+1/2}\over2n^{r+1}}\,y^{(r)}(-L/2).}    \tag{0.9}
\]

Thus a nonzero endpoint value gives `z notin H^(1/2)(R)`.  Finite endpoint
vanishing merely moves the first jump to a higher derivative.  Since a
nonzero entire function has finite vanishing order at one point, physical
analyticity does not make its arithmetic adjoint additively analytic.

An explicit bounded-variation estimate is proved below.  Combined with the
full-source floor and the prolate leakage identity it gives a finite
sufficient condition for prefix capture.  The condition is rigorous but
vacuous at the available constants, even before paying the exponential
radius in (0.4).  It therefore identifies a barrier, not a negative theorem
about the actual capture.

For an actual bottom vector, only `Pi_vartheta y` has (0.7).  The safe piece
can cancel it after `A^*`; the exact prefix energy retains the signed cross
term.  A buffered commutator estimate controls separated dangerous and safe
spectra with the sharp factor `1/(2h)`, but a hard threshold has no gap, the
gray band must be retained, and a dangerous diagonal capture floor is still
missing.

No actual near-Shannon cross-angle, bridge gate, bottom-space dimension
bound, phase-bulk premise, determinant convergence, zero theorem,
Riemann-hypothesis conclusion, converse, or de Bruijn--Newman bound is
proved.  The standard eight are untouched and the formal state remains
`P0_INVALIDATED`.

## 1. Frozen dependencies

No new external source, numerical ground, or cached prolate artifact is
used.  The exact local inputs are:

| Frozen path | SHA-256 |
|---|---|
| `notes/CUTOFF_FREE_MULTIPLIER_DANGEROUS_PROLATE_CROSS_ANGLE_BARRIER.md` | `bfabbf6b7c4879d027e4ea1be8e1103b22468519b2bd68aa0d121642000120ed` |
| `tests/test_cutoff_free_multiplier_dangerous_prolate_cross_angle_barrier.py` | `dd91d397332f3096f531e0c8742e1752891d53c1c257a9a78d82dcef67dc002a` |
| `notes/CUTOFF_FREE_FULL_SOURCE_ADJOINT_PROLATE_CAPTURE_BARRIER.md` | `157bffc55aeec592c263d5973effe1b9506e02dd97311652ecb2fdee0c3ff0e9` |
| `tests/test_cutoff_free_full_source_adjoint_prolate_capture_barrier.py` | `d7f70dffbd10021ce7d6e8887d10589a482b2dc64c9ebbe8c48cc35568c233ae` |
| `notes/PARITY_MULTIPLIER_SCHUR_REDUCTION.md` | `c6e4a757604bfc9c1299a272054f1174970781e6cd0a92ed0dfb196f9804fa81` |
| `tests/test_parity_multiplier_schur.py` | `94ee818e2747e703d521cfa2a980765569cccfdf442b700b1a6b33ac4ceababb` |
| `notes/CUTOFF_FREE_BRIDGE_MIXED_ADJOINT_TAIL_PREFACTOR_REDUCTION.md` | `53dd9fefd8cc05a29cd3e0a043e6f86f8bbdc7545d2c203d29bc59cbbe1a04f8` |
| `tests/test_cutoff_free_bridge_mixed_adjoint_tail_prefactor_reduction.py` | `e532a958742feda3efe00adc37e1ea2879a3676f23b63a47c238e348aaf5b17c` |

The first pair fixes the actual dangerous projector, normalized capture
Gram, multiplicity obstruction, physical-angle theorem, and exact cross
term.  The second fixes the literal adjoint and full-source constants.  The
third fixes the complete multiplier and its pointwise support envelope.  The
last fixes the near-Shannon prefix and the exact bridge threshold.

## 2. Actual dangerous-projector Paley--Wiener theorem

The complete multiplier obeys the already proved pointwise lower bound

\[
 m_\lambda(t)\geq
 \psi(1/4)-\log\pi+{1\over2}\log(1+4t^2)
 -2\Sigma_\lambda.                                  \tag{2.1}
\]

Subtracting (2.1) from `g+U` proves (0.5).  If
`mathcal A_lambda<=0`, then `v=0`, and `W_vartheta={0}` for every positive
threshold.  Assume henceforth that `mathcal A_lambda>0`.

The operator `T_v` is positive trace class.  On `W_vartheta` it is
invertible and

\[
 \left\|\left(T_v|_{W_\vartheta}\right)^{-1}\right\|
 \leq{1\over\vartheta}.                              \tag{2.2}
\]

For `y in W_vartheta`, put

\[
 x=\left(T_v|_{W_\vartheta}\right)^{-1}y.            \tag{2.3}
\]

With zero extension denoted by `C_L`, define on the whole complex plane

\[
 \widetilde y(s)
 ={1\over2\pi}\int_{-T_\lambda}^{T_\lambda}
 v(t)\widehat {C_Lx}(t)e^{its}\,dt.                 \tag{2.4}
\]

The integral is entire, has exponential type at most `T_lambda`, and its
restriction to `I_L` is `T_vx=y`.  Plancherel and (2.2) give

\[
\begin{aligned}
 \|\widetilde y^{(k)}\|_2
 &=\|t^kv(t)\widehat {C_Lx}(t)\|_{L^2(dt/(2\pi))}\\
 &\leq\|\,|t|^kv(t)\|_\infty\|x\|_2\\
 &\leq{\mathcal A_\lambda T_\lambda^k\over\vartheta}
       \|y\|_2,
\end{aligned}                                       \tag{2.5}
\]

which proves (0.7).  Point evaluation on the real axis is also explicit:

\[
 \boxed{
 |\widetilde y^{(k)}(s)|
 \leq{\mathcal A_\lambda\over\vartheta}
 \left({T_\lambda^{2k+1}\over\pi(2k+1)}\right)^{1/2}
 \|y\|_2,\qquad s\in\mathbb R.}                    \tag{2.6}
\]

This follows from Cauchy--Schwarz in (2.4).  For complex `s` the right side
would require the additional factor `exp(T_lambda |Im s|)`; no complex-axis
bound is used below.  Equation (2.6) is not a lower bound on any endpoint
jet.

The theorem is an actual-versus-synthetic distinction.  The synthetic
critical-edge positive part is periodic rather than integrable and its
compression is scalar; its dangerous range can be the whole ambient space.
It therefore has no counterpart of the trace-class smoothing in (2.4).
That edge model remains only a structural nonimplication result.  Conversely,
the actual smoothing theorem (2.5) says nothing yet about additive-prolate
orientation.

## 3. The literal adjoint creates arithmetic jumps

Write a physical function as `y(s)` with `s=log u`.  On the positive source
half-interval, the exact adjoint is

\[
 z(x)={1\over2}{\bf1}_{\{x\geq\lambda^{-1}\}}
 x^{-1/2}\sum_{n\leq\lambda x}n^{-1/2}
 y(\log(x/n))-c_y,                                   \tag{3.1}
\]

followed by even reflection.  The scalar `c_y` makes the source integral
zero and has no jump at an interior arithmetic breakpoint.

Let

\[
 N_\lambda=\#\{n\in\mathbb N:n<\lambda^2\}
 =\lceil\lambda^2\rceil-1,
 \qquad a_n={n\over\lambda}.                         \tag{3.2}
\]

For `1<=n<=N_lambda`, only the new `n`-th summand changes across `a_n`.
Its right limit minus its left limit is

\[
 {1\over2}n^{-1/2}a_n^{-1/2}y(-L/2)
 ={\sqrt\lambda\over2n}y(-L/2),                     \tag{3.3}
\]

which proves (0.8).  Suppose now that

\[
 y^{(j)}(-L/2)=0\quad(0\leq j<r).                    \tag{3.4}
\]

In the `r`-th derivative of the new summand, every term except the one in
which all `r` logarithmic derivatives hit `y` contains a lower endpoint
jet and vanishes.  The surviving term is

\[
 {1\over2}n^{-1/2}a_n^{-1/2-r}y^{(r)}(-L/2)
 ={\lambda^{r+1/2}\over2n^{r+1}}y^{(r)}(-L/2),       \tag{3.5}
\]

proving (0.9).

A compactly supported piecewise smooth function with a nonzero jump in its
`r`-th derivative is not in `H^(r+1/2)(R)`.  In particular, (0.8) excludes
`H^(1/2)` whenever `y(-L/2)` is nonzero.  If `y` is a nonzero member of
`W_vartheta`, its entire extension cannot have every endpoint derivative
zero.  It has some finite vanishing order, so (3.5) eventually applies.
There is no uniform useful order or endpoint-jet lower bound in the frozen
inputs.

This obstruction is specific to the literal dilation sum.  It is missed by
an argument that transfers the analytic kernel of `T_v` directly into the
additive source variable.

## 4. Explicit BV-to-prolate sufficient condition

The regularity theorem does give a completely explicit, but too costly,
certificate.  Put

\[
 H_N=\sum_{n=1}^{N_\lambda}{1\over n},
 \qquad
 D_{\lambda,\vartheta}
 ={\mathcal A_\lambda T_\lambda\over\vartheta}.      \tag{4.1}
\]

For `y in W_vartheta`, equation (0.7) gives

\[
 \|y'\|_{L^2(I_L)}
 \leq D_{\lambda,\vartheta}\|y\|_2.                \tag{4.2}
\]

The elementary endpoint trace identity gives

\[
 |y(-L/2)|
 \leq L^{-1/2}\|y\|_2+\sqrt{L/3}\,\|y'\|_2.       \tag{4.3}
\]

Define

\[
\begin{aligned}
 \mathcal V_{\lambda,\vartheta}:={}&
 2H_N\left[
 \sqrt{\lambda-\lambda^{-1}}
       \left(D_{\lambda,\vartheta}+{1\over2}\right)
 +\sqrt\lambda\left(L^{-1/2}
       +\sqrt{L/3}\,D_{\lambda,\vartheta}\right)
 \right]\\
 &+{\sqrt{(\lambda-\lambda^{-1})H_NN_\lambda}\over\lambda}.
\end{aligned}                                       \tag{4.4}
\]

Then the zero extension of the literal adjoint satisfies

\[
 \boxed{
 \operatorname {Var}(A_{\lambda,0}^*y)
 \leq\mathcal V_{\lambda,\vartheta}\|y\|_2.}      \tag{4.5}
\]

To prove this, first omit the factor `1/2` and the constant correction in
(3.1), and call the resulting positive-half function `q`.  On every open
arithmetic cell,

\[
 q'(x)=\sum_{n\leq\lambda x}n^{-1/2}x^{-3/2}
 \left[y'(\log(x/n))-{1\over2}y(\log(x/n))\right].   \tag{4.6}
\]

Changing variables `x=nu`, summing `1/n`, and using Cauchy--Schwarz gives

\[
 \int_{1/\lambda}^{\lambda}|q'(x)|\,dx
 \leq H_N\sqrt{\lambda-\lambda^{-1}}
       \left(\|y'\|_2+{1\over2}\|y\|_2\right).     \tag{4.7}
\]

The sum of the absolute jumps is

\[
 \sqrt\lambda H_N|y(-L/2)|.                         \tag{4.8}
\]

The final zero-extension jump is at most the preceding variation, so the
variation of `q` on the positive line is at most twice the sum of (4.7) and
(4.8).  Also

\[
 \|q\|_2^2\leq H_NN_\lambda\|y\|_2^2,              \tag{4.9}
\]

by pointwise Cauchy--Schwarz and the same change of variables.  Hence

\[
 2|c_y|
 \leq{\sqrt{\lambda-\lambda^{-1}}\over\lambda}\|q\|_2.
                                                               \tag{4.10}
\]

Even reflection and the factor `1/2` exactly cancel the factor two from the
two half-intervals.  Equations (4.2)--(4.10) prove (4.5).

Let `M_mu(lambda)` be the exact full-source constant.  On the finite actual
dangerous range, the full-source row theorem gives

\[
 \|A_{\lambda,0}^*y\|
 \geq{1\over\sqrt2\lambda M_\mu(\lambda)}\|y\|.     \tag{4.11}
\]

Put

\[
 \mathcal W_{\lambda,\vartheta}
 =\sqrt2\lambda M_\mu(\lambda)
       \mathcal V_{\lambda,\vartheta}.              \tag{4.12}
\]

With the additive Fourier convention
`widehat z(xi)=int z(x)e^(-2 pi i x xi)dx`, integration by parts for BV
functions yields

\[
 |\widehat z(\xi)|
 \leq{\operatorname {Var}(z)\over2\pi|\xi|}.
                                                               \tag{4.13}
\]

Therefore

\[
 \boxed{
 {\displaystyle\int_{|\xi|>\lambda}|\widehat z(\xi)|^2d\xi
  \over\|z\|^2}
 \leq{\mathcal W_{\lambda,\vartheta}^2
             \over2\pi^2\lambda}.}                 \tag{4.14}
\]

Let `R` be a nonnegative even integer, put
`E_R=span{h_n:0<=n<=R, n even}`, and let `d_n=1-Lambda_n` be the ordered
prolate defects.  For an even `z`, the first omitted even mode is `R+2`, so
the exact leakage identity and defect monotonicity give

\[
 d_{R+2}\|(I-P_{E_R})z\|^2
 \leq\int_{|\xi|>\lambda}|\widehat z(\xi)|^2d\xi.   \tag{4.15}
\]

Combining (4.14)--(4.15) proves the positive finite theorem

\[
 \boxed{
 {\|P_{E_R}A_{\lambda,0}^*y\|^2
       \over\|A_{\lambda,0}^*y\|^2}
 \geq
 \max\left\{0,
 1-{\mathcal W_{\lambda,\vartheta}^2
       \over2\pi^2\lambda d_{R+2}}\right\}.}        \tag{4.16}
\]

In particular, (4.16) would imply the checkpoint-1.67 scalar bridge gate if

\[
 \boxed{
 \mathcal W_{\lambda,\vartheta}^2
 <2\pi^2\lambda d_{R+2}(1-\delta_{E_R}).}            \tag{4.17}
\]

The available constants do not certify (4.17).  The radius in (0.4) enters
`D_(lambda,vartheta)` exponentially.  Even if that derivative term is
formally deleted, the remaining BV estimate combined with the coarse
full-source floor makes the error term in (4.16) grow rather than vanish.
This says only that the displayed regularity route is quantitatively
vacuous.  It does not prove that the true variation, capture, or actual
bridge scalar has an adverse size.

## 5. Safe-piece cancellation and the exact remaining statistic

Let `Y` be an actual bottom space and retain the checkpoint-1.68
normalization

\[
 R_Y=P_YAA^*P_Y|_Y,
 \qquad J_Y=A^*P_YR_Y^{-1/2}.                        \tag{5.1}
\]

The physical-angle theorem does not put `Y` inside `W_vartheta`.  It only
gives a lower norm for `Pi_vartheta y`.  Set

\[
\begin{aligned}
 D_E&=P_EA^*\Pi_\vartheta P_YR_Y^{-1/2},\\
 S_E&=P_EA^*(I-\Pi_\vartheta)P_YR_Y^{-1/2}.
\end{aligned}                                       \tag{5.2}
\]

The exact capture Gram is

\[
 \boxed{
 \mathfrak G_E
 =(D_E+S_E)^*(D_E+S_E).}                             \tag{5.3}
\]

In particular it contains

\[
 D_E^*S_E+S_E^*D_E.                                  \tag{5.4}
\]

At every finite smooth compression, the breakpoint formula makes the same
issue visible at the endpoint:

\[
 \Delta z(a_n)={\sqrt\lambda\over2n}
 \left\{(\Pi_\vartheta y)(-L/2)
       +((I-\Pi_\vartheta)y)(-L/2)\right\}.          \tag{5.5}
\]

The two traces may cancel.  At the cutoff-free form level the safe piece is
not known to have a point trace at all, so (5.5) is an illustration rather
than an additional premise.  The always-valid coefficient identity is

\[
 \beta_j(y)=\beta_j(\Pi_\vartheta y)
             +\beta_j((I-\Pi_\vartheta)y),           \tag{5.6}
\]

and its squared sum retains the signed cross.  Thus regularity of the first
term alone gives no lower bound for (5.3).

Put

\[
 C=AA^*,\qquad C_E=AP_EA^*.                          \tag{5.7}
\]

The narrow dangerous-only correlation missing from regularity is the
metric inequality

\[
 \boxed{
 \Pi_\vartheta C_E\Pi_\vartheta
 \succeq\gamma_{E,\vartheta}
       \Pi_\vartheta C\Pi_\vartheta,
 \qquad\gamma_{E,\vartheta}>0,}                     \tag{5.8}
\]

on the relevant actual dangerous range, with a quantitative scale.  Even
(5.8) must be paired with control of (5.4), or replaced by the direct
bottom-space inequality

\[
 \boxed{
 P_YC_EP_Y\succeq\gamma_E P_YCP_Y.}                 \tag{5.9}
\]

For a missed line, the exact bridge condition is `gamma_E>delta_E`.
Equation (5.9), rather than separate regularity of dangerous and safe
pieces, is the minimal cancellation-preserving correlation.

There is a precise limited role for a commutator.  For `h>0`, define

\[
 \Pi_+={\bf1}_{[t+h,\infty)}(T_v),\qquad
 \Pi_-={\bf1}_{(-\infty,t-h]}(T_v).                  \tag{5.10}
\]

The two restricted spectra are separated by `2h`.  The Sylvester equation
for `X=Pi_+C_EPi_-` gives

\[
 \boxed{
 \|\Pi_+C_E\Pi_-\|
 \leq{1\over2h}
 \|\Pi_+[T_v,C_E]\Pi_-\|
 \leq{\|[T_v,C_E]\|\over2h}.}                     \tag{5.11}
\]

The constant is sharp for two scalar spectral points at `t+h` and `t-h`.
The gray projector

\[
 \Pi_0={\bf1}_{(t-h,t+h)}(T_v)                       \tag{5.12}
\]

is not controlled by (5.11) and must be retained in the dangerous space.
At a hard threshold there is no positive `h`.  Moreover (5.11) controls
only an off-diagonal; it does not prove the diagonal floor (5.8).  Thus a
commutator estimate, even if obtained from the analytic kernel, cannot by
itself close the cross-angle.

## 6. Qualitative capture and exact stopping line

There is one harmless qualitative consequence.  For fixed `lambda` and
positive `vartheta`, the trace-class projector `W_vartheta` is finite
dimensional.  The full-source floor makes `A^*` injective there.  Since the
complete even prolate basis is complete, strong convergence of its prefixes
is uniform on the unit sphere of the finite-dimensional normalized image.
Consequently, for every `0<epsilon<1`, there exists a finite, generally
non-effective prefix `R(lambda,vartheta,epsilon)` such that

\[
 \inf_{0\ne y\in W_\vartheta}
 {\|P_{E_R}A^*y\|^2\over\|A^*y\|^2}
 \geq1-\epsilon.                                     \tag{6.1}
\]

Nothing in this compactness argument places `R` at
`4lambda^2-O((log lambda)^2)`, preserves the small prolate defect needed by
the bridge, or controls the actual bottom-space safe cancellation.

The exact next theorem must therefore supply one of the following actual
correlations:

1. the direct bottom Gram (5.9) with `gamma_E>delta_E` on the missed line;
2. the dangerous diagonal floor (5.8), a gray-band rank bound, and a signed
   safe-cross reserve strong enough for (5.3);
3. an additive graph estimate strong enough to satisfy the explicit
   defect-relative inequality (4.17).

Physical Paley--Wiener regularity, finite endpoint vanishing, a hard
projector commutator without a spectral gap, and dimension alone prove none
of these statements.

## 7. Reproduction and claim discipline

Run

    python3 -B -m unittest \
      tests.test_cutoff_free_actual_dangerous_adjoint_regularity_barrier -v

The regression checks every frozen hash, the exact actual support envelope,
dangerous spectral inverse, derivative constants, breakpoint and endpoint
jet formulas, BV bookkeeping, defect-relative prolate reduction, signed
safe cancellation, sharp buffered commutator factor, qualitative finite
capture, displayed TeX, and static hygiene.  It reads no zero table, cached
ground, prolate artifact, network resource, API key, or environment secret.
