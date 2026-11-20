# Growing-transition absolute-sampling forced-cancellation barrier

## 0. Result and scope

Use the locked schedule

\[
 \lambda={p\over2},\qquad c=2\pi\lambda^2,\qquad
 L=2\log\lambda,\qquad h={\pi\over4}.                 \tag{0.1}
\]

Let a fixed `q`-column plus-phase synthesis have range in the admitted
zero-integral source hyperplane, and let `D` be its exact full exterior
Gram.  On the quotient by `ker D`, let `Q_X` be the complete unprojected
central form.  The frozen complete-central identity and absolute outer
sampling theorem imply

\[
 \boxed{-B_{{\rm out},q}D\preceq Q_X
              \preceq B_{{\rm out},q}D,\qquad
 B_{{\rm out},q}=O(q\lambda\operatorname {polylog}\lambda).}
                                                               \tag{0.2}
\]

This estimate uses the positive paired two-evaluation sampling norm, not
positivity of the Weil form and not RH.

Now split the exact Hermitian form as

\[
 Q_X=Q_{\rm loc}+R_{\rm comp}.                         \tag{0.3}
\]

If a subspace `E` in exact `D`-white coordinates satisfies

\[
 P_EQ_{\rm loc}P_E\preceq-\tau P_E,                  \tag{0.4}
\]

then the omitted complete assembly is forced to obey

\[
 \boxed{P_ER_{\rm comp}P_E
 \succeq(\tau-B_{{\rm out},q})P_E.}                  \tag{0.5}
\]

In particular, if `q,m` are fixed and a proposed local packet has

\[
 \tau_L={c^{hC+o(1)}\over L^{2m}},                    \tag{0.6}
\]

then for `hC>1/2`,

\[
 {B_{{\rm out},q}\over\tau_L}\longrightarrow0,
 \qquad
 \|R_{\rm comp}\|\geq(1-o(1))\tau_L.                \tag{0.7}
\]

Thus no proof can simultaneously promote such a local block to the actual
source and bound every omitted sampler/profile/equality sector by
`o(tau_L)`.  At least one omitted sector cancels the local exponential at
the same leading scale.  This is a mathematical obstruction to the
all-remainders-negligible strategy, not merely a missing estimate.

The continuous `m=l=1` theorem supplies the raw local negative matrix but
does not itself supply actual modal placement or a leakage lower bound.
Accordingly, (0.6) is a conditional specialization: it applies only after
an independent theorem has produced actual admitted rows, the exact
source congruence, and the stated `D`-white local scale.  This note does not
identify which omitted sector provides the cancellation, prove a complete
central sign, equation (5.2), a determinant limit, or RH.  For `hC<=1/2`,
(0.2) alone does not force cancellation of the local scale.  The project
state remains `P0_INVALIDATED`.

## 1. Frozen inputs

| Dependency | SHA-256 |
|---|---|
| `notes/GROWING_TRANSITION_SAMPLING_THEOREM.md` | `551e58d07510d531c8ee5cfe4c81a33ac3443f62760627196599e2bfac231e72` |
| `notes/GROWING_TRANSITION_COMPLETE_CENTRAL_FORM_REDUCTION.md` | `6c853ad2ab666bc79b33fafc498f25c6c0059812ed829fbf8ce42486983b1de9` |
| `tests/test_growing_transition_complete_central_form_reduction.py` | `a842fdd24e095cde5af373060f9017e03bb13df1db5ecf6f6374c4fbcf6743de` |
| `notes/HYBRID_OUTER_SAMPLING_ODD_SHIFT_THEOREM.md` | `113be74d52f48d66903c1babf1525ec6d130243321acfa31562abd8640868a3a` |
| `tests/test_hybrid_outer_sampling_odd_shift.py` | `9ecd210103e73853f242ef5301ee676e8cd89198a6e5554f89773b2c90dcba0d` |
| `notes/COMMON_RADICAL_LEAKAGE_GRAM_ORIENTATION_OBSTRUCTION.md` | `e589c3bce1174a94666364dea523f23e0828a2906338f36e81f05c8d25378816` |
| `tests/test_common_radical_leakage_gram_orientation.py` | `d897e662d05665930d3b651d0460dd14f84f8e143ed010c9e248c948a5ace417` |
| `notes/GROWING_TRANSITION_CONTINUOUS_M11_TWO_CLUSTER_UNCONDITIONAL_NARROW_SCHEDULE_THEOREM.md` | `6e0678b8d0d762b79402ad0f6947ddcfa8b830c251b333f58c9fe5ea7ebe7a5c` |
| `tests/test_growing_transition_continuous_m11_unconditional_narrow_schedule.py` | `626dc9f12cf7a4b58246e12f1b008d72bf9bb0e60713a0a10f6b5dda2e66eb34` |

The common-radical note realizes `mathcal W_Z` as
`<Zf,Sigma Zg>_R`, where `Sigma` is a self-adjoint involution.  The hybrid
sampling note records the resulting unconditional inequality
`|mathcal W_Z(v,v)|<=||Zv||_mathfrak Z^2`.  The unscaled full
two-evaluation sum is twice the real Gram used in the first realization,
so the displayed constant one is safe (and deliberately not sharpened).
No zero list or assertion that the zeros lie on the critical line is used.

## 2. Complete central form versus positive sampling

For a coefficient vector `x`, write `f_x` for the corresponding corrected
source and `O_x` for its complete physical outer state.  The exact
complete-central identity is

\[
 x^*Q_Xx=\mathcal W_Z(O_x,O_x).                       \tag{2.1}
\]

The paired two-evaluation seminorm satisfies

\[
 |\mathcal W_Z(O_x,O_x)|
 \leq\|ZO_x\|^2_{\mathfrak Z}.                       \tag{2.2}
\]

The growing-transition sampling theorem retains every modal and correction
cross term and gives

\[
 \|ZO_x\|^2_{\mathfrak Z}
 \leq B_{{\rm out},q}\,x^*Dx.                       \tag{2.3}
\]

Combining (2.1)--(2.3) for every `x` proves the two Loewner inequalities
in (0.2).  This argument does not use a block-diagonal approximation to
`D`.  If `D` is singular, it applies on the exact quotient by `ker D`;
equivalently, one may use the Moore--Penrose white coordinate on
`overline{ran D}`.

Since `c=2 pi lambda^2`, fixed `q` gives

\[
 B_{{\rm out},q}=c^{1/2+o(1)}.                       \tag{2.4}
\]

## 3. Forced cancellation on a local negative subspace

Work in the exact `D`-white quotient and let `x` be a unit vector in `E`.
Equations (0.2)--(0.4) give

\[
 \begin{aligned}
 x^*R_{\rm comp}x
 &=x^*Q_Xx-x^*Q_{\rm loc}x\\
 &\geq-B_{{\rm out},q}+\tau.
 \end{aligned}                                      \tag{3.1}
\]

This is (0.5).  It also proves

\[
 \|R_{\rm comp}\|\geq
 \|P_ER_{\rm comp}P_E\|
 \geq(\tau-B_{{\rm out},q})_+.                      \tag{3.2}
\]

For (0.6),

\[
 {B_{{\rm out},q}\over\tau_L}
 =c^{1/2-hC+o(1)}L^{2m}.                             \tag{3.3}
\]

It tends to zero exactly in the asserted strict region `hC>1/2`, proving
(0.7).

If `r` exact source or endpoint rows are imposed after the local negative
space is found, put

\[
 E_0=E\cap\bigcap_{j=1}^r\ker\ell_j.                 \tag{3.4}
\]

Then `dim E_0>=dim E-r`, and (0.5) holds unchanged on `E_0`.  Finite-row
nulling therefore reduces multiplicity but cannot evade the forced
cancellation whenever `E_0` is nonzero.

## 4. Consequence for the current transition decomposition

The exact remainder `R_comp` in (0.3) includes, without double counting,

- the continuous mixed and full-profile sampler axes;
- the non-equality prime fixed-product channels and their cutoff-matched
  Plemelj/midpoint rows;
- the higher-sampler regular and hard pieces;
- the sampler-equality conductor block; and
- every retained endpoint/source row not killed on `E`.

Equation (0.5) does not determine which item supplies the positive
compression.  It proves that, above the threshold `hC=1/2`, their complete
sum cannot be a lower-order error.  Any viable continuation must therefore
analyze their coherent signed assembly rather than bounding them all
absolutely or one channel at a time.
