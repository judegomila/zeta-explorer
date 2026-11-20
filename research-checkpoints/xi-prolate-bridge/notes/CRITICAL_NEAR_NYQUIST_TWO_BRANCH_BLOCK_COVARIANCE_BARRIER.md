# Critical near-Nyquist two-branch block covariance barrier

## 0. Exact outcome and claim boundary

Put

\[
 h={2\pi\over L},\qquad Q=e^L=\lambda^2,
 \qquad N=D\lambda^2L+O(1),                         \tag{0.1}
\]

where `D` ranges in one fixed compact set

\[
 \mathcal D\Subset\left({1\over2\pi},{1\over2}\right).
                                                               \tag{0.2}
\]

Then the first omitted carrier has height

\[
 T={2\pi(N+1)\over L}=2\pi DQ+O(h),               \tag{0.3}
\]

Write `m=N+1`, so that `T=mh` is the first omitted carrier.

The lowest Riemann--Siegel frequencies are only `O(1/L)` below
the alternating Nyquist point.  This note gives the exact local symbol
calculus at that boundary and identifies where it stops.

For a frozen complex AFE mode, write

\[
 \beta_n={1\over2}\log D-\log n,
 \qquad z_n={\pi\over4}-i\beta_n,
 \qquad q_n=e^{-z_nh}.                              \tag{0.4}
\]

For a row at distance `Delta=xh`, `x>0`, the endpoint and Stieltjes
symbols are

\[
 m_E(q)={1\over1-q},\qquad
 m_x(q)={1\over h}\Phi(q,1,x),\qquad
 r_x(q)={m_x(q)\over m_E(q)}
 ={1-q\over h}\Phi(q,1,x).                         \tag{0.5}
\]

Uniformly for `x` and `z` in fixed compact subsets of `(0,infinity)` and
the open right half-plane, respectively,

\[
 \boxed{
 r_x(e^{-zh})
 =z\log {1\over h}
 -z\{\log z+\gamma_0+\psi(x)\}+O(h\log(1/h)).}     \tag{0.6}
\]

Thus one complex branch has the scalar gain

\[
 r_x(e^{-zh})=z\log L+O(1).                         \tag{0.7}
\]

The two conjugate Hardy branches do not inherit a pointwise or short-block
lower bound from (0.7).  After the carrier sign is removed, let

\[
 V_R(\delta)_{j,\bullet}
 =\bigl(\cos(j\delta),-\sin(j\delta)\bigr),
 \qquad 0\leq j<R.                                  \tag{0.8}
\]

For one conjugate pair the endpoint and row blocks have the exact frozen
form

\[
 E_R=2V_R(\delta)b,
 \qquad C_R=2V_R(\delta)M(r)b,
 \qquad
 M(u+iv)=\begin{pmatrix}u&-v\\v&u\end{pmatrix}.   \tag{0.9}
\]

Here `b` is the two-real-dimensional complex amplitude,
`delta=beta_n h`, and `r=r_x(q_n)`.  For two cutoffs the generalized
smallest gain is

\[
 \boxed{
 g_2\sim {|z_n|^2\over2}h\log L
 =\pi|z_n|^2{\log L\over L}.}                      \tag{0.10}
\]

For every `2<=R=o(L)`, uniformly on (0.2) for a fixed low mode and fixed
off-carrier `x`,

\[
 \boxed{g_R=\Theta_{\mathcal D,x}(Rh\log L)
       =\Theta_{\mathcal D,x}\left({R\log L\over L}\right).}
                                                               \tag{0.11}
\]

Consequently no `o(L)` block preserves a fixed multiple of the scalar
`log L` gain.  An isolated conjugate pair with a freshly recentered row at
every cutoff becomes coercive on a synthetic `R=Theta(L)` block.  This is
the exact analytic boundary, not a theorem for actual zero rows.

Two independent obstructions remain beyond that boundary.

1. A single fixed zero has offset `x+j` at the `j`th cutoff.  On an
   `R=Theta(L)` block its root-mean-square scalar gain is only `O(1)`;
   the logarithmic singularity occupies an integrably small end of the
   block.
2. For every finite `R`, the frozen multi-frequency AFE coefficient space
   contains an exact Hardy-type two-branch vector with all `R` row samples
   zero and a nonzero endpoint block.  This is a coefficient-space
   obstruction only.  It does not assert that the actual Riemann--Siegel
   coefficient vector is such a vector.

Using a fresh actual zero row near every cutoff would require a weighted
two-dimensional covariance gap.  The exact Gram eigenvalues reduce that
gap to

\[
 W=\sum_jw_j^2,\qquad
 A=\sum_jw_j^2e^{2ij\delta},\qquad
 \lambda_\pm={W\pm|A|\over2}.                      \tag{0.12}
\]

Neither zero counting nor the scalar Lerch calculation bounds `|A|/W`.
The fixed-grid phase makes the reason arithmetic: on every exact carrier

\[
 e^{\mathord\pm iLt_j}=1.                           \tag{0.13}
\]

Therefore no finite cutoff filter separates the continuous Poisson mode
from `k=+1,-1`.  The frozen explicit formula still produces its
prime-power first sideband, and the two AFE branches still produce all
four resonance variables

\[
 {qm\over Qn},\qquad {qn\over Qm},\qquad
 {qmn\over Q},\qquad {q\over Qmn}.                 \tag{0.14}
\]

At (0.3), even the same-branch diagonal has physical prime width

\[
 {Q\over T}={1\over2\pi D}+o(1).                   \tag{0.15}
\]

Thus a theorem for the actual coefficient vector and actual zero rows
requires a new fixed-grid zero-energy covariance or the equivalent
prime-power/divisor shifted-convolution estimate.  This note proves the
analytic local model, the finite-section obstructions, and the exact alias
reduction only.  It proves no failure for the actual Hardy source, no
actual endpoint/Cauchy inequality, no finite strict gate, no decay of an
eta quotient, no new zero theorem, no RH implication or converse, and no
de Bruijn--Newman bound.  This is an unbound post-checkpoint-1.51 pair;
the formal state remains `P0_INVALIDATED`.

## 1. Frozen inputs

Exactly the following three frozen pairs are imported.

| Dependency | SHA-256 |
|---|---|
| `notes/ADJACENT_CUTOFF_PHASE_ALIAS_AGGREGATE_REDUCTION_BARRIER.md` | `2afaba5a1fca497a6aa28ba1ab41b66736002b1eaece49035059f5c96e0a2a87` |
| `tests/test_adjacent_cutoff_phase_alias_aggregate_reduction_barrier.py` | `d4ea9d9fd2ae5e6ff841f8963932bce56f37a9569ba4a3d918be5879f0757b97` |
| `notes/ADAPTIVE_GONEK_ENDPOINT_FILTER_SELECTION_THEOREM.md` | `7354d464d4a3d53cb32c83b941a24aac60c5cbbf9b87c5bf56a907193459bd46` |
| `tests/test_adaptive_gonek_endpoint_filter_selection_theorem.py` | `e8e96cab5e5bd817650c0f323f248d00772802e439474b1f9d890083f8ca6396` |
| `notes/FIXED_GRID_PHASE_ALIAS_PRIME_DIVISOR_SHIFTED_CONVOLUTION_BARRIER.md` | `226a3fcc9e6703d42ae7fed78b2e0d9a368f42313653cb1d175b28a1db3a8b20` |
| `tests/test_fixed_grid_phase_alias_prime_divisor_shifted_convolution_barrier.py` | `3fb091af871010e07e77c4f89a77615f4f1bae899b3bfb65dc9e474003d8f416` |

The first pair supplies the exact adjacent endpoint/Cauchy recurrences,
the phase-weighted aggregate target, and the critical schedule.  The
second supplies the positive Hardy--Xi envelope and a symmetric smoothed
two-branch AFE with differentiated control.  The third supplies the exact
Poisson signs, the admissible first sideband, and the four AFE channels.

No standard-eight file, zero table, external theorem, source lock, or
serialized numerical artifact is imported or changed.

## 2. Critical Hardy symbol

The exact positive envelope in the frozen adaptive theorem satisfies

\[
 {d\over dt}\log c(t)=-{\pi\over4}+O(t^{-1}),
 \qquad
 \vartheta'(t)={1\over2}\log {t\over2\pi}+O(t^{-2}).
                                                               \tag{2.1}
\]

At (0.3), for every fixed Dirichlet mode `n`,

\[
 \vartheta'(T)-\log n
 ={L\over2}+\beta_n+o(1),
 \qquad
 \beta_n={1\over2}\log D-\log n.                 \tag{2.2}
\]

The alternating future tail of the positive AFE branch therefore has
frozen ratio

\[
 \begin{aligned}
 q_n
 &=-\exp\left\{-{\pi h\over4}
       +ih(\vartheta'(T)-\log n)\right\}\\
 &=\exp\{-h(\pi/4-i\beta_n)\}
 =e^{-z_nh}.
 \end{aligned}                                     \tag{2.3}
\]

The negative branch has ratio `conj(q_n)`.  Since `D<1/2` and `n>=1`,

\[
 \beta_n<0,
 \qquad
 -\beta_1=-{1\over2}\log D
 \geq b_0:=\min_{D\in\mathcal D}
          \left(-{1\over2}\log D\right)>0.        \tag{2.4}
\]

The `O(t^(-1))` envelope correction, the AFE weight variation, and the
phase curvature on a fixed physical future interval are `O(T^(-1))`.
They justify (2.3) as the frozen leading symbol.  They do not turn a
finite-symbol statement into a theorem about the complete actual AFE
sum; that distinction is retained below.

Let a row lie at

\[
 \gamma=T-xh,\qquad x>0.                            \tag{2.5}
\]

For the geometric component, the endpoint and Stieltjes tails are

\[
 E(q)=\sum_{k\geq0}q^k={1\over1-q},
 \qquad
 S_x(q)={1\over h}\sum_{k\geq0}{q^k\over k+x}
 ={1\over h}\Phi(q,1,x).                           \tag{2.6}
\]

The exact Cauchy kernel factorization is elementary:

\[
 {\gamma^2\over\gamma^2-(T+kh)^2}
 =-{T\over2(\Delta+kh)}\{1+O((\Delta+kh)/T)\},
 \qquad \Delta=xh,                                 \tag{2.7}
\]

on the effective exponentially damped tail.  Hence the phase-normalized
row symbol is

\[
 {\sin(\gamma L/2)\over\gamma}{C_\gamma\over E}
 =-{(-1)^{m+1}\sin(\pi x)\over2}\,r_x(q)+o(1)
                                                               \tag{2.8}
\]

for an off-carrier fixed `x`; the harmless real factor in (2.8) does not
change any two-branch angle or singular-value conclusion.  It does show
why `x` must stay away from integers for a uniform logarithmic row gain.

## 3. Lerch asymptotic with its constant

Let `K_x` be a compact subset of `(0,infinity)` and let `K_z` be a compact
subset of `Re(z)>0`.  The integral identity

\[
 \Phi(q,1,x)=\int_0^1{t^{x-1}\over1-qt}\,dt,
 \qquad |q|<1,                                     \tag{3.1}
\]

first proves holomorphy and uniformity on these compact sets.  To obtain
the singular term, subtract the case `x=1`:

\[
 \begin{aligned}
 \Phi(q,1,x)-\Phi(q,1,1)
 &=\int_0^1{t^{x-1}-1\over1-qt}\,dt,\\
 \Phi(q,1,1)&=-{\log(1-q)\over q}.
 \end{aligned}                                     \tag{3.2}
\]

The numerator in the first integral cancels at `t=1`, so dominated
convergence and one elementary endpoint split give

\[
 \Phi(q,1,x)
 =-\log(1-q)-\gamma_0-\psi(x)
 +O\bigl((1-q)\log(1/|1-q|)\bigr),                \tag{3.3}
\]

uniformly as `q` approaches one inside any fixed right-half-plane
Stolz region.  The constant follows from

\[
 \int_0^1{t^{x-1}-1\over1-t}\,dt
 =-\gamma_0-\psi(x).                               \tag{3.4}
\]

For `q=e^{-zh}` on `K_z`,

\[
 1-q=zh+O(h^2),
 \qquad
 \log(1-q)=\log h+\log z+O(h).                    \tag{3.5}
\]

Multiplying (3.3) by `(1-q)/h` proves (0.6).  In the useful special case
`x=1/2`,

\[
 \gamma_0+\psi(1/2)=-2\log2,                       \tag{3.6}
\]

so

\[
 r_{1/2}(e^{-zh})
 =z\{\log(1/h)-\log z+2\log2\}
 +O(h\log(1/h)).                                   \tag{3.7}
\]

This is a scalar complex-branch theorem.  Taking a real part before
forming a quotient is not legitimate, because multiplication by the
nonreal number `z` rotates the two Hardy quadratures.

## 4. Exact two-branch block matrices

Strip the common carrier sign `(-1)^j`.  For one positive AFE amplitude
`a`, put

\[
 b=a\,m_E(q),\qquad
 \delta=\arg q=\beta h,
 \qquad b=b_1+ib_2.                                 \tag{4.1}
\]

Adding the conjugate AFE branch gives the real samples

\[
 E_j=2\operatorname {Re}(be^{ij\delta}),
 \qquad
 C_j=2\operatorname {Re}(rbe^{ij\delta}).          \tag{4.2}
\]

Equations (0.8)--(0.9) follow.  Put

\[
 U_R(\delta)=\sum_{j=0}^{R-1}e^{2ij\delta}
 =e^{i(R-1)\delta}{\sin(R\delta)\over\sin\delta}.
                                                               \tag{4.3}
\]

Direct summation gives

\[
 V_R(\delta)^TV_R(\delta)
 ={1\over2}
 \begin{pmatrix}
 R+\operatorname {Re}U_R&-\operatorname {Im}U_R\\
 -\operatorname {Im}U_R&R-\operatorname {Re}U_R
 \end{pmatrix}.                                    \tag{4.4}
\]

Therefore

\[
 \boxed{
 \sigma_\pm(V_R)^2
 ={1\over2}\left\{R\pm
 \left|{\sin(R\delta)\over\sin\delta}\right|\right\}.}
                                                               \tag{4.5}
\]

Define the generalized gain

\[
 g_R(r,\delta)=
 \inf_{b\ne0}{\|V_R(\delta)M(r)b\|_2
                    \over\|V_R(\delta)b\|_2},      \tag{4.6}
\]

whenever the denominator Gram is positive definite.  Since `M(r)` is
`|r|` times a rotation, (4.5) gives the general lower bound

\[
 g_R(r,\delta)\geq
 |r|\left({R-|U_R|\over R+|U_R|}\right)^{1/2}.     \tag{4.7}
\]

For `R=1`, the real observation has rank one.  If `Im(r)` is nonzero,
one can make the row zero while leaving the endpoint nonzero.  The first
nontrivial finite section is therefore `R=2`.

## 5. Exact two-cutoff collapse

For `R=2`,

\[
 V_2(\delta)=
 \begin{pmatrix}1&0\\\cos\delta&-\sin\delta\end{pmatrix}.
                                                               \tag{5.1}
\]

Write `r=u+iv`.  When `sin(delta)` is nonzero, the exact endpoint-to-row
matrix is

\[
 \boxed{
 A_2=V_2M(r)V_2^{-1}
 =\begin{pmatrix}
 u-v\cot\delta&v\csc\delta\\
 -v\csc\delta&u+v\cot\delta
 \end{pmatrix}.}                                   \tag{5.2}
\]

Its determinant and squared Frobenius norm are

\[
 \det A_2=|r|^2,
 \qquad
 \tau:=\|A_2\|_F^2
 =2|r|^2+4v^2\cot^2\delta.                         \tag{5.3}
\]

Thus its two singular values are exactly

\[
 \boxed{
 s_\pm^2={\tau\pm\sqrt{\tau^2-4|r|^4}\over2}.}   \tag{5.4}
\]

For the critical low mode, (0.6) and (0.4) give

\[
 \begin{aligned}
 r&=z\log L+O(1),\\
 v&=-\beta\log L+O(1),\\
 \delta&=\beta h+o(h).
 \end{aligned}                                     \tag{5.5}
\]

Since `beta` stays bounded away from zero on (0.2), (5.3)--(5.5) imply

\[
 s_+\sim {2|v|\over|\delta|},
 \qquad
 \boxed{s_-\sim {|r|^2|\delta|\over2|v|}
       \sim {|z|^2\over2}h\log L.}                \tag{5.6}
\]

This proves (0.10).  An explicit cancelling amplitude makes the mechanism
transparent:

\[
 b={i\over r}.                                      \tag{5.7}
\]

For every cutoff in the frozen block,

\[
 C_j=-2\sin(j\delta),
 \qquad
 E_j={2\over|r|^2}
 \{v\cos(j\delta)-u\sin(j\delta)\}.              \tag{5.8}
\]

At `j=0` the row vanishes exactly while the endpoint is nonzero.  The
second cutoff sees only the `O(h)` phase opening.  This is a
two-quadrature symbol cancellation, not an actual Hardy coefficient
counterexample.

## 6. Longer finite blocks and the isolated-pair boundary

If `R|delta|` tends to zero, expansion of (4.3) gives

\[
 |U_R|
 =R\left\{1-{(R^2-1)\delta^2\over6}
 +O(R^4\delta^4)\right\}.                          \tag{6.1}
\]

Equations (4.5) and (4.7) yield

\[
 g_R(r,\delta)\geq
 {|r||\delta|\sqrt{R^2-1}\over\sqrt{12}}
 \{1+o(1)\}.                                       \tag{6.2}
\]

The amplitude (5.7) gives the matching order.  Indeed,

\[
 \|C_R\|_2^2=4\sum_{j<R}\sin^2(j\delta),           \tag{6.3}
\]

whereas (5.8), compactness of (0.2), and `R|delta|=o(1)` give

\[
 \|E_R\|_2^2\asymp_{\mathcal D}
 {R\over\log^2L}.                                  \tag{6.4}
\]

Since

\[
 \sum_{j<R}j^2={R(R-1)(2R-1)\over6},              \tag{6.5}
\]

(6.3)--(6.5) prove the upper half of (0.11).  Hence (0.11) is sharp for
the isolated conjugate pair.

There is also a positive synthetic boundary.  Let `beta=beta_1` and use

\[
 R_L=\left\lceil{L\over2b_0}\right\rceil.          \tag{6.6}
\]

Then, uniformly for `D` in (0.2),

\[
 R_L|\sin\delta|\geq2                              \tag{6.7}
\]

for all sufficiently large `L`.  Since `|U_R|<=1/|sin(delta)|`,

\[
 {|U_{R_L}|\over R_L}\leq{1\over2}.               \tag{6.8}
\]

Equations (4.7), (0.6), and (6.8) prove

\[
 \boxed{
 g_{R_L}(r,\delta)\geq {|r|\over\sqrt3}
 \geq c_{\mathcal D,x}\log L.}                   \tag{6.9}
\]

This statement assumes the same local symbol `r_x` is observed at every
cutoff.  In the zero problem that means a freshly recentered row at every
cutoff.  It is not supplied by one fixed zero.

## 7. Moving-offset loss for one fixed zero

Fix one ordinate

\[
 \gamma=T_0-xh.                                    \tag{7.1}
\]

At cutoff `T_j=T_0+jh`, its offset is `(x+j)h` and its scalar transfer is

\[
 r_{x+j}(h,z)={1-e^{-zh}\over h}
               \Phi(e^{-zh},1,x+j).                \tag{7.2}
\]

Let `jh` tend to `y>0`.  Rewrite the Lerch series as a Riemann sum:

\[
 \Phi(e^{-zh},1,x+j)
 =\sum_{k\geq0}h\,{e^{-zhk}\over hk+h(x+j)}.     \tag{7.3}
\]

Uniform exponential domination gives

\[
 \boxed{
 r_{x+j}(h,z)\longrightarrow
 zJ_z(y),\qquad
 J_z(y)=\int_0^\infty{e^{-zu}\over u+y}\,du.}     \tag{7.4}
\]

As `y` decreases to zero,

\[
 J_z(y)=-\log y+O_{K_z}(1).                         \tag{7.5}
\]

The logarithmic square is integrable.  Therefore, if `R/L` tends to a
fixed `c>0`, Riemann summation gives

\[
 \boxed{
 {1\over R}\sum_{j=0}^{R-1}|r_{x+j}(h,z)|^2
 \longrightarrow
 {1\over2\pi c}\int_0^{2\pi c}|zJ_z(y)|^2\,dy
 <\infty.}                                         \tag{7.6}
\]

An `R=Theta(L)` block therefore resolves the two Hardy quadratures only by
moving almost all samples away from the microscopic row.  For one fixed
zero, its aggregate scalar gain is `O(1)`, not `Theta(log L)`.

The only way to combine (6.9) with microscopic rows is to use new
ordinates `gamma_j=T_j-x_jh` along the block.  Zero counting on a fixed
physical interval does not put one suitably phased ordinate in every
carrier cell.

## 8. Exact finite-mode nullspace

The failure of a coefficient-uniform finite-section theorem is stronger.
Fix any finite `R` and choose `R+1` distinct frozen AFE phase nodes

\[
 \zeta_0,\ldots,\zeta_R,
 \qquad \zeta_\nu=e^{i\delta_\nu}.                 \tag{8.1}
\]

Let the endpoint and row symbols at node `nu` be `e_nu` and `s_nu`, with
`s_nu` nonzero, and put `r_nu=s_nu/e_nu`.  Define the barycentric weights

\[
 c_\nu={1\over\displaystyle
        \prod_{\mu\ne\nu}(\zeta_\nu-\zeta_\mu)}. \tag{8.2}
\]

The partial-fraction expansion of
`1/prod_nu(z-zeta_nu)` at infinity gives the exact identities

\[
 \sum_{\nu=0}^Rc_\nu\zeta_\nu^j=0
 \quad(0\leq j<R),
 \qquad
 \sum_{\nu=0}^Rc_\nu\zeta_\nu^R=1.              \tag{8.3}
\]

Choose complex branch coefficients

\[
 a_\nu={c_\nu\over s_\nu}.                        \tag{8.4}
\]

Then all row samples vanish:

\[
 C_j=\sum_{\nu=0}^Ra_\nu s_\nu\zeta_\nu^j=0,
 \qquad 0\leq j<R.                                 \tag{8.5}
\]

The endpoint samples are

\[
 E_j=\sum_{\nu=0}^R{c_\nu\over r_\nu}\zeta_\nu^j.
                                                               \tag{8.6}
\]

If all values in (8.6) vanished, the one-dimensional nullspace of the
`R` by `R+1` Vandermonde matrix would force

\[
 {c_\nu\over r_\nu}=\kappa c_\nu
 \quad\hbox{for every }\nu,                        \tag{8.7}
\]

so every `r_nu` would be equal.  Choosing nodes with nonconstant Lerch
ratio makes the endpoint block nonzero.  Add the conjugate modes and
choose one common phase so that the real part of the nonzero endpoint
vector is nonzero.  The result is an exact real two-branch Hardy-type
finite-mode vector with

\[
 C_R=0,
 \qquad E_R\ne0.                                   \tag{8.8}
\]

Actual Riemann--Siegel weights are not free coefficients.  Equation
(8.8) therefore proves only that multiplier bounds and branch symmetry
cannot establish the desired actual-vector inequality.  Proving that the
one actual coefficient vector avoids these finite-section null directions
is a covariance theorem, not a consequence of scalar ellipticity.

## 9. Zero-sampled covariance criterion

Return to one low conjugate pair, but now suppose a microscopic row has
been supplied near each cutoff.  Absorb its real phase/profile factor into
`w_j`.  The leading logarithmic row Gram is

\[
 G_w(\delta)=
 \sum_{j=0}^{R-1}w_j^2
 \begin{pmatrix}\cos(j\delta)\\-\sin(j\delta)\end{pmatrix}
 \begin{pmatrix}\cos(j\delta)&-\sin(j\delta)\end{pmatrix}.
                                                               \tag{9.1}
\]

Put

\[
 W=\sum_{j=0}^{R-1}w_j^2,
 \qquad
 A=\sum_{j=0}^{R-1}w_j^2e^{2ij\delta}.             \tag{9.2}
\]

The same two-by-two calculation as in (4.4) proves

\[
 \boxed{\lambda_\pm(G_w)={W\pm|A|\over2}.}         \tag{9.3}
\]

Hence the explicit sufficient conditions

\[
 W\geq\kappa R,
 \qquad
 |A|\leq(1-\eta)W,
 \qquad \kappa,\eta>0,                             \tag{9.4}
\]

give

\[
 \|\operatorname {diag}(w)V_RM(z)b\|_2
 \geq |z|\sqrt{\kappa\eta\over2}\,
       \|V_Rb\|_2.                                 \tag{9.5}
\]

After multiplication by `log L`, (9.5) recovers a logarithmic leading
gain for this one mode.  Conversely, `|A|=W` makes `G_w` rank one and
`W=0` annihilates it.  Carrier-aligned rows have precisely `w_j=0` when
the phase factor is `sin(gamma L/2)`.

For actual local zero rows a typical weight has the form

\[
 w_j^2=\sum_\gamma m_\gamma u_{j,\gamma}
        \sin^2\left({\gamma L\over2}\right)
        \mathfrak a_{j,\gamma},
 \qquad \mathfrak a_{j,\gamma}\geq0,              \tag{9.6}
\]

where `mathfrak a` contains the nonnegative local profile and bounded
row factors.  Neither the Riemann--von Mangoldt count nor an HSW local
count proves (9.4).  The full Hardy source is harder: its endpoint energy
and cross-frequency terms also enter the covariance.  Equation (9.3) is
the earliest exact zero-sampled nonconcentration gate.

## 10. Exact survival of the first Poisson aliases

Let

\[
 \psi(y)=v(y)\sin^2(\pi y),                         \tag{10.1}
\]

with the admissible Fourier-compact profile of the frozen fixed-grid
reduction.  With the convention used there,

\[
 \widehat\psi(\xi)
 ={1\over2}\widehat v(\xi)
 -{1\over4}\widehat v(\xi-1)
 -{1\over4}\widehat v(\xi+1).                    \tag{10.2}
\]

For a suitable Hardy weight `F`, Poisson summation gives

\[
 h\sum_jF(t_j)\sum_\gamma
 \psi\left({t_j-\gamma\over h}\right)
 =\sum_{k\in\mathbb Z}\mathcal C_k,
 \qquad
 \mathcal C_k=\int_{\mathbb R}G(t)e^{-ikLt}\,dt. \tag{10.3}
\]

At every exact carrier `t_j=jh`,

\[
 e^{-ikLt_j}=e^{-2\pi ikj}=1.                      \tag{10.4}
\]

Thus for arbitrary finite cutoff weights `a_j`,

\[
 \sum_ja_je^{-i(kL+\omega)t_j}
 =\sum_ja_je^{-i\omega t_j}                        \tag{10.5}
\]

for every integer `k`.  A two-cutoff filter, an `o(L)` filter, and an
`R=Theta(L)` filter all respond identically to `k=0,+1,-1`.  A filter with
zero total response kills all three together; it cannot select the
continuous mode.

The exact first-sideband term from the frozen explicit formula remains

\[
 \boxed{
 \mathcal R_1={h\over4\pi}\operatorname {Re}
 \sum_{q=p^r}{\Lambda(q)\over\sqrt q}\,
 \widehat v\left({\log q-L\over L}\right)
 I_T(\log q-L),}                                   \tag{10.6}
\]

where

\[
 I_T(\omega)=\int_{\mathbb R}F_T(t)e^{-i\omega t}\,dt. \tag{10.7}
\]

Expanding the two-branch smoothed AFE in (10.7) leaves the four exact
resonance variables

\[
 \boxed{
 {qm\over Qn},\qquad {qn\over Qm},\qquad
 {qmn\over Q},\qquad {q\over Qmn}.}                \tag{10.8}
\]

The first two are the same-branch terms and the last two are the AFE
cross terms.  A real two-branch matrix formulation does not remove the
cross terms; it is another representation of them.

On the same-branch diagonal `m=n`, a dyadic time transform localizes

\[
 |\log(q/Q)|\ll {1\over T},
 \qquad
 |q-Q|\ll {Q\over T}
 ={1\over2\pi D}+o(1).                             \tag{10.9}
\]

The RH prime number theorem has error of square-root size times powers of
`log Q`; it does not give von Mangoldt mass in every bounded interval near
`Q`.  Off-diagonal and cross-channel cancellation might improve the whole
sum, but proving that improvement is exactly the missing shifted
convolution theorem.  The alias calculation is unconditional; the needed
lower bound is not supplied here, under RH or otherwise.

## 11. Earliest rigorous boundary

The following statements are closed in this pair.

1. The critical one-branch endpoint/row ratio is (0.6), with the complete
   constant term and uniform compact-set error.
2. The two conjugate branches have the exact block matrix (0.9), Gram
   spectrum (4.5), two-cutoff matrix (5.2), and collapse (5.6).
3. The `R=o(L)` law (0.11), the isolated-pair synthetic recovery (6.9),
   and the fixed-zero moving-offset loss (7.6) are analytic consequences.
4. Every finite frozen multi-frequency section has the exact coefficient
   nullspace (8.8), unless one imposes information about the chosen
   coefficient vector.
5. Fresh zero rows require the covariance gap (9.4), while exact-grid
   cutoff filters leave the aliases (10.4)--(10.8) unchanged.

The first unclosed statement is that the actual Riemann--Siegel
coefficient vector, sampled on the exact grid and against the actual zero
rows, satisfies a positive version of (9.4) after all same-branch,
cross-branch, archimedean, remainder, and higher-alias contributions are
included.  The frozen explicit formula identifies this as a fixed-grid
zero-energy covariance or a prime-power/divisor shifted-convolution
theorem.  Scalar near-Nyquist ellipticity alone does not prove it.

Nothing here claims an actual coefficient failure.  Nothing here changes
the checkpoint-1.51 seal, the standard eight, or any finite gate.  The
pair is theorem/barrier documentation for the next arithmetic input, and
the project remains fail-closed.
