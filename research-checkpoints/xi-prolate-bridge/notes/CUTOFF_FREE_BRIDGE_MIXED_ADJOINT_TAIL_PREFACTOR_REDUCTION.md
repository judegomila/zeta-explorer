# Cutoff-free bridge mixed-adjoint-tail prefactor reduction

## 0. Exact outcome and fail-closed boundary

Use the pinned real prolate convention and the inner product linear in its
first argument.  Let `E_+` and `E_-` be the two finite raw additive-prolate
phase prefixes containing `h_0` and `h_2`, respectively.  Put

\[
 E=E_+\mathbin\oplus E_-,\qquad
 F_\sigma=E_\sigma\cap1^\perp,\qquad
 F=F_+\mathbin\oplus F_-,\qquad
 M=E\cap1^\perp.                                      \tag{0.1}
\]

For the actual omitted bridge

\[
 b=h_2-{I_2\over I_0}h_0,\qquad I_n=\langle1,h_n\rangle, \tag{0.2}
\]

one has `M=F direct-sum span{b}` algebraically.  This note computes the
orthogonal innovation of that bridge in the ordinary source `L^2` metric,
then compares it with the already-frozen exterior-defect innovation.

Write

\[
 q_\sigma=P_{E_\sigma}1,\qquad
 s_\sigma=\|q_\sigma\|^2,qquad s=s_++s_-.            \tag{0.3}
\]

The exact ordinary-source innovation and its norm are

\[
 \boxed{
 b_\perp:=(I-P_F)b
 =I_2\left({q_-\over s_-}-{q_+\over s_+}\right),
 \qquad
 \varrho_b:=\|b_\perp\|^2
 =I_2^2\left({1\over s_-}+{1\over s_+}\right).}       \tag{0.4}
\]

The defect-orthogonal representative of the same quotient has a separate,
uniformly bounded ordinary norm.  If `D_sigma` is the diagonal prolate
defect on `E_sigma`, put

\[
 H_\sigma=\sum_{n\in\mathcal I_\sigma}{|I_n|^2\over d_n},
 \qquad
 K_\sigma=\sum_{n\in\mathcal I_\sigma}{|I_n|^2\over d_n^2}.
                                                               \tag{0.5}
\]

Then

\[
 \boxed{
 b_{\rm in}=I_2\left({D_-^{-1}q_-\over H_-}
                    -{D_+^{-1}q_+\over H_+}\right),
 \qquad \|b_{\rm in}\|^2
 =I_2^2\left({K_-\over H_-^2}+{K_+\over H_+^2}\right)
 \leq1+\left|{I_2\over I_0}\right|^2.}               \tag{0.6}
\]

Let `e_0` be a unit codimension-one missed bottom vector,

\[
 T_F^*e_0=0,
 \qquad z_0=A_{\lambda,0}^*e_0,
 \qquad \tau_0=\|z_0\|^2.                             \tag{0.7}
\]

If `s_b` is the exterior-defect Schur scalar of the frozen bridge reduction,
then its normalized orientation coefficient satisfies the exact identity

\[
 \boxed{
 a_b^2={\varrho_b\over s_b}\|P_Mz_0\|^2.}             \tag{0.8}
\]

Thus the source-metric mismatch is not an uncontrolled constant.  On the
locked growing-prefix schedule it is strongly favorable:

\[
 \boxed{
 {\varrho_b\over s_b}\geq{c\over\lambda d_2},
 \qquad {1\over\lambda d_2}
 \asymp {e^{4\pi\lambda^2}\over\lambda^6}.}           \tag{0.9}
\]

for one fixed `c>0` and all sufficiently large locked `lambda`.

There is a one-vector combined-phase adjoint-tail gate.  Define

\[
 \Theta_{\rm mix}(e_0)
 ={2\lambda\over s}
 {\|(I-P_E)z_0\|^2\over\tau_0}.                       \tag{0.10}
\]

Its exact raw-prefix threshold is especially transparent.  Set

\[
 \delta_E=1-{s\over2\lambda}
 ={\|(I-P_E)1\|^2\over2\lambda},
 \qquad
 \mathfrak q_E(e_0)={\|P_Ez_0\|^2\over\tau_0}.        \tag{0.11}
\]

Then

\[
 \boxed{
 \Theta_{\rm mix}(e_0)<1
 \quad\Longleftrightarrow\quad
 \mathfrak q_E(e_0)>\delta_E.}                        \tag{0.12}
\]

If, for some `0<eta<=1`,

\[
 \Theta_{\rm mix}(e_0)\leq1-\eta,                    \tag{0.13}
\]

then the full-source row floor proves

\[
 \boxed{
 a_b^2\geq{\varrho_b\over s_b}\eta\tau_0
 \geq {c\eta\over\lambda^5d_2}
 \gtrsim {\eta e^{4\pi\lambda^2}\over\lambda^{10}}.} \tag{0.14}
\]

More is true for the relative bridge orientation.  With

\[
 \omega_b={a_b^2\over\|v_b\|^2}
 ={|\langle e_0,w_b\rangle|^2\over\|w_b\|^2},          \tag{0.15}
\]

equation (0.6), the full-source norm, and the same reserve give

\[
 \boxed{
 \omega_b\geq
 {\eta I_2^2\over2(1+|I_2/I_0|^2)\lambda^7}
 ={1+o(1)\over3\sqrt2}\,{\eta\over\lambda^7}.}       \tag{0.16}
\]

Consequently a codimension-one phase-bulk gap `alpha` yields the sharpened
floor

\[
 \boxed{
 S_M\succeq{1\over2}
 \min\{a_b^2,\alpha\omega_b\}\,I_X.}                  \tag{0.17}
\]

In particular, if `alpha>=lambda^(-A)` and `eta>=lambda^(-E)` for fixed
`A,E`, then (0.14)--(0.17) give a floor
`S_M succeq c lambda^(-A-E-7) I_X` eventually.  Thus, conditional on a
polynomial phase-bulk gap, the sole remaining quantitative input on the
codimension-one branch is a polynomial strict reserve in the actual
mixed-adjoint tail.

This is materially narrower than the previously frozen soft-tail criterion.
That criterion takes an operator norm over an entire bottom block and treats
each additive phase separately.  Equation (0.10) tests only the unique missed
line after a codimension-one phase-bulk theorem and allows the two additive
phases to repair one another through `b`.

No frozen input proves (0.13), or even proves that the exact scalar in (0.8)
is nonzero on the actual missed line.  The explicit adjoint has arithmetic
breakpoints and only `L^2` regularity at the presently admitted ground-domain
level; the prolate ODE therefore supplies no coefficient unique continuation.
The positive coherent-beta self is a Weil-form diagonal, not the projection
in (0.8).  The ground equation is an upper residual identity.  Source-Cauchy
high-mode coercivity acts in logarithmic Fourier coordinates and does not
localize `A_(lambda,0)^*e_0` in the additive-prolate prefix.

Indeed, at an allowed prefix `R=S-O((log lambda)^2)`, the constant-function
tail obeys `delta_E>=1/(16 pi^2 lambda^2)`, while the frozen literal-adjoint
diagonal-well countermodel has `mathfrak q_E<delta_E` eventually and hence
`Theta_mix>1` strictly.  This remains a synthetic cutoff-free operator, not
the actual Weil operator and not a counterexample to actual nonvanishing.

On a genuinely singular codimension-one branch, `theta_b=0` and
`kappa_b>=1`; the sufficient condition `kappa_b<1` belongs only to the
alternative branch where the phase bulk was already onto.  No actual bridge
nonvanishing, bottom-projector floor, cutoff-free determinant theorem, zero
statement, converse, or Riemann hypothesis follows.  The standard eight are
untouched and the formal state remains `P0_INVALIDATED`.

## 1. Frozen dependencies and distinction from the soft criterion

No new external source is used.  The exact local inputs are:

| Frozen path | SHA-256 |
|---|---|
| `notes/CUTOFF_FREE_BRIDGE_LEVERAGE_RANK_ONE_INNOVATION_REDUCTION.md` | `808c314d6b0cf1926ddf8b0a5b83c324ccbbc252d18efea283781fefd1751097` |
| `tests/test_cutoff_free_bridge_leverage_rank_one_innovation_reduction.py` | `2c79244dd68e9fd56ddb67f7278f4572cb72bae9803b82047ccf9ad58196faba` |
| `notes/CUTOFF_FREE_FULL_SOURCE_ADJOINT_PROLATE_CAPTURE_BARRIER.md` | `157bffc55aeec592c263d5973effe1b9506e02dd97311652ecb2fdee0c3ff0e9` |
| `tests/test_cutoff_free_full_source_adjoint_prolate_capture_barrier.py` | `d7f70dffbd10021ce7d6e8887d10589a482b2dc64c9ebbe8c48cc35568c233ae` |
| `notes/SOFT_DEFECT_PROLATE_ANGLE_REDUCTION.md` | `3bcccfda9d606c21fc61efb9c2fbc3dd95926a82586e3c156fc965c32748777b` |
| `tests/test_soft_defect_prolate_angle.py` | `f440a59456cc4cc604afc419bc1aebc9589a0a6010b179a4784c7f5c62ca2088` |
| `notes/GROWING_MIXED_BRIDGE_GAUGE_POLE_DOMAIN_BARRIER.md` | `335e8973a51fdc998398620c6d30ba51eaa2ee45fb3444e838aa1e34ef33c1cb` |
| `tests/test_growing_mixed_bridge_gauge_pole_domain_barrier.py` | `0ef8d77b05498533c8c58428a99beb9c1a13cc9699b2b5abb9c05b63de9f80bc` |
| `notes/EFFECTIVE_MIXED_SIGNED_QUOTIENT_ATTACK.md` | `e2e9485d8ee03717af790cb7740fbb2228cc96f04009698cdc51a7fd943634ea` |
| `tests/test_effective_mixed_signed_quotient.py` | `6c84905b66e7a16b7443560fe512d4e3d864293f368efa649aa61a2425c884e1` |
| `notes/FULL_SOURCE_COFRAME_RANK_THEOREM.md` | `3f8b381d9e51e0fa0cf89928851e89dd163ec9982249af8050a90520c0389f81` |
| `tests/test_full_source_coframe_rank.py` | `dc322485178710618f9ace19cd2019200bf0dafeabcbe17cce4e47d41377d66a` |
| `notes/GROWING_WINDOW_THEOREM.md` | `dad6b0a878b7eba21cbc7aa8049cf3bf89a38df766cc157a87c416e79a721ac7` |
| `P2_SOURCE_LOCK.json` | `8b731d499903041ef68e7722ebd085d22673c022655431dcca27c9cac6f4730a` |
| `notes/PROLATE_DEFECT_SOURCE_AUDIT.md` | `b8256ce059d2632d55cb1b0477b5af7f5ebb09d0fc81a7d8b8e696885b49772d` |
| `PROLATE_DEFECT_SOURCE_LOCK.json` | `0844df654ee968b1c371ec96618d10d219da9fde702d62faa4f0c6be139b036d` |
| `tests/test_prolate_defect_source_lock.py` | `7caa8d088522d68dc4dedfad8d00d8e5c7e15070065c743d9e2a41f9e7faa519` |

The bridge pair supplies `s_b`, `a_b`, the missed-line identity
`T_F^*e_0=0`, and the rank-one innovation algebra.  The adjoint pair supplies
the exact `r_g` formula and the full-source row floor.  The soft pair supplies
the separate-phase operator-tail criterion against which (0.10) is compared.
The gauge pair supplies the fixed-label integral and defect asymptotics.
The effective quotient pair freezes global ordering of the concentration
defects.  The full-source pair supplies `||A_lambda||^2<=lambda^2/2`.
The growing-window note and its KRD lock supply exact exterior
orthogonality and the leading-side transition estimate.  The defect audit,
source lock, and lock verifier pin the convention
`d_n=1-Lambda_n(2 pi lambda^2)` used in those comparisons.

The old criterion is

\[
 \Theta_\sigma={2\lambda\over s_\sigma}
 \left\|(I-P_{E_\sigma})Z_\sigma^*\right\|^2<1.       \tag{1.1}
\]

It is uniform over the complete normalized bottom block.  If it holds in a
phase, that phase source already has a quantitative row floor.  By contrast,
(0.10) is a scalar combined-prefix condition invoked only after a separate
argument has left exactly one missed line.  It neither proves that
codimension-one premise nor replaces the operator theorem (1.1).

## 2. Exact ordinary-source bridge innovation

All `I_n` are real in the pinned convention.  Orthogonality of the prolate
modes gives

\[
 q_+=\sum_{n\in\mathcal I_+}I_nh_n,
 \qquad
 q_-=\sum_{n\in\mathcal I_-}I_nh_n,
 \qquad q_+\perp q_-.                                  \tag{2.1}
\]

Inside `E_sigma`, the orthogonal complement of `F_sigma` is exactly
`span{q_sigma}`.  Since

\[
 \langle b,q_+\rangle=-I_2,
 \qquad \langle b,q_-\rangle=I_2,                     \tag{2.2}
\]

orthogonal projection proves (0.4).  In particular `b_perp` is nonzero
whenever `I_2` is nonzero.  It is also zero-integral because

\[
 \left\langle1,{q_-\over s_-}-{q_+\over s_+}\right\rangle
 =1-1=0.                                               \tag{2.3}
\]

Hence

\[
 M=F\mathbin\oplus^\perp\operatorname {span}\{b_\perp\}. \tag{2.4}
\]

Every endpoint shear `b^#=b-f` with `f in F` has the same `b_perp` and
`varrho_b`.  This is the ordinary-source counterpart of the frozen
defect-metric shear invariance.

Now (0.7) and the exact full-source adjoint give

\[
 \langle z_0,f\rangle=\langle e_0,T_Ff\rangle=0
 \qquad(f\in F).                                      \tag{2.5}
\]

Therefore `P_Mz_0` lies on the `b_perp` line, and

\[
 \|P_Mz_0\|^2
 ={|\langle z_0,b_\perp\rangle|^2\over\varrho_b}
 ={|\langle z_0,b\rangle|^2\over\varrho_b}.           \tag{2.6}
\]

The defect innovation satisfies

\[
 \langle e_0,w_b\rangle=\langle z_0,b\rangle
 =\beta_2(e_0)-{I_2\over I_0}\beta_0(e_0).            \tag{2.7}
\]

Combining (2.6)--(2.7) with
`a_b=|<e_0,w_b>|/sqrt(s_b)` proves (0.8), including every normalization
factor.

There is also an exact defect-orthogonal formula.  On `E_sigma`, let

\[
 D_\sigma h_n=d_nh_n,
 \qquad
 H_\sigma=\langle D_\sigma^{-1}q_\sigma,q_\sigma\rangle,
 \qquad
 K_\sigma=\|D_\sigma^{-1}q_\sigma\|^2.              \tag{2.8}
\]

These are precisely the sums in (0.5).  In the convention linear in the
first argument, every `f in F_sigma` satisfies

\[
 \langle D_\sigma^{-1}q_\sigma,D_\sigma f\rangle
 =\langle q_\sigma,f\rangle
 =\langle1,f\rangle=0.                                \tag{2.9}
\]

Moreover, `D_sigma^(-1)q_sigma/H_sigma` has integral one.  The plus and
minus components of `b` have integrals `-I_2` and `I_2`, respectively.
Uniqueness of defect-orthogonal projection therefore proves

\[
 b-C_F\Delta_F^{-1}c
 =I_2\left({D_-^{-1}q_-\over H_-}
           -{D_+^{-1}q_+\over H_+}\right)=b_{\rm in}. \tag{2.10}
\]

This is the raw representative; the frozen triangular endpoint shear
changes its coordinates but leaves `s_b` and `w_b` invariant.  The ordered
prolate convention gives

\[
 d_n\geq d_0\quad(n\in\mathcal I_+),
 \qquad
 d_n\geq d_2\quad(n\in\mathcal I_-).                 \tag{2.11}
\]

Thus, with anchor `a_+=0` and `a_-=2`,

\[
 K_\sigma\leq {H_\sigma\over d_{a_\sigma}},
 \qquad
 H_\sigma\geq {|I_{a_\sigma}|^2\over d_{a_\sigma}},
 \qquad
 {K_\sigma\over H_\sigma^2}
 \leq{1\over|I_{a_\sigma}|^2}.                       \tag{2.12}
\]

This proves the `O(1)` bound (0.6), without a prefix-dimension loss.  If
`T` denotes compact arithmetic synthesis followed by parity and bottom
projection, then `w_b=Tb_(in)` and the frozen full-source norm gives

\[
 \boxed{
 \|w_b\|^2\leq{\lambda^2\over2}\|b_{\rm in}\|^2
 \leq{\lambda^2\over2}(1+|I_2/I_0|^2).}              \tag{2.13}
\]

Under (0.13), equations (2.6), (3.4), (4.2), and (4.8) below give

\[
 |\langle e_0,w_b\rangle|^2
 =\varrho_b\|P_Mz_0\|^2
 \geq\varrho_b\eta\tau_0
 \geq{\eta I_2^2\over4\lambda^5}.                   \tag{2.14}
\]

Dividing (2.14) by (2.13) proves (0.16).  In the locked Hermite convention,

\[
 h_0^{\rm Herm}(0)=2^{1/4},
 \qquad h_2^{\rm Herm}(0)=2^{-1/4},
 \qquad I_2^2\longrightarrow2^{-1/2},
 \qquad |I_2/I_0|^2\longrightarrow{1\over2},         \tag{2.15}
\]

which gives the displayed constant `1/(3 sqrt(2))`.

Finally put `V=||v_b||^2` and use `a_b^2=omega_b V`.  The elementary
two-case bound

\[
 {\alpha a_b^2\over\alpha+V}
 ={\alpha\omega_bV\over\alpha+V}
 \geq{1\over2}\min\{a_b^2,\alpha\omega_b\}          \tag{2.16}
\]

upgrades the frozen codimension-one estimate to (0.17).  This relative
orientation estimate is the feature not present in the earlier soft
adjoint-tail criterion.

## 3. Exact combined-prefix tail identity

Put

\[
 q=P_E1=q_++q_-,\qquad t=(I-P_E)1,
 \qquad \|q\|^2=s,qquad \|t\|^2=2\lambda-s.          \tag{3.1}
\]

For every `z in 1^perp`, projection inside `E` removes the one direction
`q/sqrt(s)`.  Since `<z,q>=-<z,t>`, orthogonal decomposition gives

\[
 \boxed{
 \|(I-P_M)z\|^2
 =\|(I-P_E)z\|^2
 +{|\langle(I-P_E)z,t\rangle|^2\over s}.}             \tag{3.2}
\]

Cauchy--Schwarz and (3.1) imply

\[
 \|(I-P_M)z\|^2
 \leq {2\lambda\over s}\|(I-P_E)z\|^2.              \tag{3.3}
\]

For `z=z_0`, divide by `tau_0` and use (0.10):

\[
 {\|P_Mz_0\|^2\over\tau_0}
 \geq1-\Theta_{\rm mix}(e_0).                         \tag{3.4}
\]

Since `||P_Ez_0||^2+||(I-P_E)z_0||^2=tau_0`, the definitions
in (0.10)--(0.11) give the exact scalar identity

\[
 \boxed{
 \Theta_{\rm mix}(e_0)
 ={1-\mathfrak q_E(e_0)\over1-\delta_E}.}             \tag{3.5}
\]

Thus (0.12) is an equivalence, and the quantitative reserve is exactly

\[
 \boxed{
 \Theta_{\rm mix}(e_0)\leq1-\eta
 \quad\Longleftrightarrow\quad
 \mathfrak q_E(e_0)
 \geq\delta_E+\eta(1-\delta_E).}                     \tag{3.6}
\]

Equations (0.8), (0.13), and (3.4) give the first inequality in (0.14).
The exact weakest scalar is

\[
 \Gamma_{\rm mix}(e_0)
 :={\|P_Mz_0\|^2\over\tau_0}
 ={s_ba_b^2\over\varrho_b\tau_0}.                    \tag{3.7}
\]

Thus `a_b>0` is equivalent to `Gamma_mix(e_0)>0`.  The tail reserve (0.13)
is a convenient sufficient condition, not a necessary reformulation.

There is also a sharp deterministic scale for `delta_E` at an allowed
near-Shannon prefix.  On the locked halfgrid put

\[
 S=4\lambda^2=p^2,qquad
 \beta_\lambda={2\over\pi^2}\log(200\lambda^2+25),
 \qquad
 B_\lambda=\left\lceil
 \beta_\lambda\log(160\pi^2\lambda^2)\right\rceil,   \tag{3.8}
\]

and let `R` be the largest nonnegative even integer such that

\[
 R\leq S-7-B_\lambda.                                 \tag{3.9}
\]

For all sufficiently large locked `lambda`, this defines a raw prefix

\[
 E_R=\operatorname {span}\{h_n:0\leq n\leq R,
                                      \ n\ \mathrm{even}\},
 \qquad S-R=O((\log\lambda)^2).                       \tag{3.10}
\]

The pinned leading-side KRD estimate and the floor/ceiling choice give

\[
 d_R\leq10\exp\left\{-{S-R-7\over\beta_\lambda}\right\}
 \leq{1\over16\pi^2\lambda^2}.                       \tag{3.11}
\]

The constant source has an exact exterior-leakage expansion.  Exterior
orthogonality of the prolate Fourier tails gives

\[
 D_1:=\sum_{n\ \mathrm{even}}d_n|I_n|^2
 =\int_{|\xi|>\lambda}
 \left|{\sin(2\pi\lambda\xi)\over\pi\xi}\right|^2d\xi.
                                                               \tag{3.12}
\]

Because `lambda=p/2`, both endpoints are integral multiples of the sine
period and

\[
 \int_\lambda^{2\lambda}\sin^2(2\pi\lambda\xi)\,d\xi
 ={\lambda\over2}.                                    \tag{3.13}
\]

Using both exterior intervals `[lambda,2lambda]` and
`[-2lambda,-lambda]` in (3.12) yields

\[
 D_1\geq{1\over4\pi^2\lambda}.                       \tag{3.14}
\]

Defect monotonicity and `0<d_n<1` imply

\[
 D_1\leq d_R\sum_{n\leq R}|I_n|^2
             +\sum_{n>R}|I_n|^2
 \leq2\lambda(d_R+\delta_{E_R}).                     \tag{3.15}
\]

Combining (3.11), (3.14), and (3.15) proves

\[
 \boxed{
 \delta_{E_R}\geq{D_1\over2\lambda}-d_R
 \geq{1\over16\pi^2\lambda^2}.}                    \tag{3.16}
\]

Thus the mixed-tail gate at this allowed prefix is exactly the demand that
the actual normalized adjoint place more than a fixed polynomial amount in
`E_R`; the constant-function tail does not make the demand vacuous.

The literal-adjoint diagonal-well construction in the frozen adjoint pair
is strict at this same scale.  Apply its Bessel selection to `F=E_R`.  Since
`dim(E_R)<=2lambda^2`, its definite-parity simple ground satisfies

\[
 \mathfrak q_{E_R}
 \leq16\lambda^8e^{-C_a(\lambda)/8}
 \leq16\lambda^{9-\lambda}
 <{1\over16\pi^2\lambda^2}\leq\delta_{E_R}           \tag{3.17}
\]

eventually.  Equations (0.12) and (3.17) give
`Theta_mix>1` strictly.  The constructed diagonal well is not the actual
von-Mangoldt Weil operator, and the argument does not impose the separate
codimension-one premise (0.7).  It proves that the frozen row floor,
spectral coercivity envelopes, parity, and prefix geometry alone cannot
force the actual gate.

## 4. The bridge prefactor is favorable

The fixed-label limit in the frozen gauge pair gives

\[
 I_2=-\chi_2h_2(0)\longrightarrow-h_2^{\rm Herm}(0)\ne0. \tag{4.1}
\]

Also `s=||P_E1||^2<=||1||^2=2lambda`.  The harmonic-mean inequality gives

\[
 {1\over s_-}+{1\over s_+}
 \geq{4\over s}\geq{2\over\lambda}.                  \tag{4.2}
\]

Consequently there is a fixed `c_I>0` such that

\[
 \varrho_b\geq{2c_I^2\over\lambda}                    \tag{4.3}
\]

eventually.  In the frozen raw exterior metric,

\[
 s_b={d_0\beta^2\over1+d_0U}
       +{d_2\over1+d_2A},
 \qquad U,A\geq0,qquad \beta={I_2\over I_0}.         \tag{4.4}
\]

The fixed-label laws `beta=O(1)` and

\[
 {d_0\over d_2}\sim{1\over128\pi^2}\lambda^{-4}     \tag{4.5}
\]

therefore give

\[
 0<s_b\leq d_0\beta^2+d_2\leq2d_2                   \tag{4.6}
\]

for all sufficiently large locked `lambda`.  Equations (4.3) and (4.6)
prove the first inequality in (0.9).  Finally,

\[
 d_2\sim C_2\lambda^5e^{-4\pi\lambda^2},
 \qquad C_2=128\sqrt\pi(2\pi)^{5/2}>0,                \tag{4.7}
\]

which proves the comparison scale on the right of (0.9).  No matching upper
bound for `varrho_b/s_b` is asserted: the nonnegative sums `U,A` may make
`s_b` smaller than the `d_2` scale and the ratio correspondingly larger.

For a unit target vector the full-source theorem gives

\[
 \tau_0=\|A_{\lambda,0}^*e_0\|^2\geq{1\over8\lambda^4}. \tag{4.8}
\]

Substituting (4.3), (4.6), and (4.8) into the first inequality of (0.14)
proves its second inequality and displayed one-sided scale.  Thus neither the
ordinary-source quotient norm nor the exterior-defect normalization is the
remaining obstruction.

## 5. Why the actual equations stop before the tail gate

The exact adjoint is

\[
 z_0(x)={1\over2}{\bf1}_{\{|x|\geq\lambda^{-1}\}}
 |x|^{-1/2}\sum_{n\leq\lambda|x|}n^{-1/2}e_0(|x|/n)-c_{e_0}. \tag{5.1}
\]

This formula is explicit, but it is not an additive-band limitation.  The
integer cutoff creates arithmetic cells and possible breakpoint jumps.  The
admitted cutoff-free ground domain controls logarithmic Fourier coefficients
with a logarithmic weight; it supplies no positive additive Sobolev order,
point trace, bounded variation, or analytic continuation for (5.1).

Accordingly the prolate Sturm--Liouville recurrence controls the basis
functions `h_n`, not the coefficient sequence `<z_0,h_n>` of this general
`L^2` vector.  Vanishing on the finite phase bulk cannot be continued to the
bridge coefficient by the prolate ODE.

The other frozen inputs stop for distinct reasons.

1. The phase-separated low-prefix and coherent-beta theorems are lower
   bounds for physical Weil forms on source vectors.  They do not identify a
   positive form diagonal with `||P_lambda x_b||^2` or (3.7).
2. The ground equation gives
   `mu_lambda<z_0,b_in>=<e_0,Q_lambda K(b_in)>`; residual control bounds this
   coefficient from above and is void as a lower bound when `mu_lambda=0`.
3. Source-Cauchy coercivity confines logarithmic Fourier mass only outside a
   very large retained window.  The dilation sum in (5.1) does not map that
   window into `E` with a proved lower singular value.
4. Centered phase-volume or PNT-remainder estimates concern a separate
   Mellin-frequency statistic and do not estimate the additive-prolate tail
   in (0.10).

At the explicit allowed prefix (3.9), the literal-adjoint Bessel countermodel
does more than make a capture small: (3.17) forces `Theta_mix>1` strictly.
Thus the present row coercivity and high-mode envelopes cannot establish the
tail gate.  The model still does not realize the exact codimension-one
condition (0.7), and the exponentially favorable one-sided prefactor (0.9)
means that a small raw capture alone is not a counterexample to a weaker
defect-normalized bound for `a_b`.  No counterexample to the actual Weil
operator or to actual bridge nonvanishing is claimed.

## 6. The two alternative branches and the precise missing statistic

The frozen determinant identity is

\[
 \theta_b={\det S_F\over\det S_M},
 \qquad r_b(w_b)=1-\theta_b,
 \qquad \kappa_b=\|w_b\|\,\|r_b\|.                    \tag{6.1}
\]

If `ker S_F=span{e_0}` and `a_b>0`, then `S_M>0` but `det S_F=0`.
Therefore

\[
 \boxed{\theta_b=0,\qquad r_b(w_b)=1,
        \qquad\kappa_b\geq1.}                         \tag{6.2}
\]

Thus `kappa_b<1` cannot be used on the codimension-one repair branch.
It is a sufficient certificate on the separate branch `S_F>0`, where
`theta_b>0` and the bridge was not needed for rank.

On the missed-line branch the exact weakest new arithmetic statistic is
either the phase contrast

\[
 \left|\beta_2(e_0)-{I_2\over I_0}\beta_0(e_0)\right|, \tag{6.3}
\]

or equivalently `Gamma_mix(e_0)` in (3.7).  For the positive tail route, the
sole remaining sufficient input is the actual arithmetic excess

\[
 \mathfrak q_{E_R}(e_0)-\delta_{E_R}
 \geq\eta(1-\delta_{E_R})                             \tag{6.4}
\]

with a polynomial `eta`; (3.16) shows that the threshold has a polynomial
lower floor.  Establishing (6.4) requires an actual retained-window
orientation or additive-tail theorem for the ground.  It is not supplied by
form positivity, parity, analytic genericity, or source-Cauchy structure
alone.

## 7. Reproduction and claim discipline

Run the exact regression with bytecode disabled:

```bash
PYTHONPATH=src PYTHONDONTWRITEBYTECODE=1 python3 -B -m unittest -v \
  tests.test_cutoff_free_bridge_mixed_adjoint_tail_prefactor_reduction
```

The verifier checks both bridge representatives, the `O(1)` representative
norm, relative orientation and codimension-one floor, the exact mixed-tail
threshold, the half-grid constant-tail lower bound, the strict Bessel
countermodel, the one-sided defect prefactor, frozen hashes, displayed TeX,
ASCII/static hygiene, and absence of binary floating-point fixtures.  It
reads no zero table, numerical ground, cached prolate artifact, or network
resource.
