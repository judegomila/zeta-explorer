# Actual mixed-bridge odd energy capture and circularity barrier

## 0. Outcome and exact claim boundary

There are two distinct eigenvalue roles in this note.  The **sectoral**
quantity `mu_-` is the simple pole-created bottom of the odd block.  It is
the eigenvalue for which the transverse floor and odd gap are defined.  The
**global** quantity `mu_full` is the bottom of the complete cutoff-free
operator.  It is the quantity to which the pinned CCM implication applies.
The same nested domains reduce inversion and give monotonicity for both
bottoms.  The two bottoms may be identified only under an explicit
parity-order hypothesis.

Let `g` be the normalized simple odd ground, let `gamma` be the loaded odd
gap, and retain the transverse floor `kappa>0` from the pole-created Schur
factor.  For the actual raw odd bridge put

\[
 n_\lambda=\|w_\lambda\|^2,
 \qquad
 E_\lambda
 =\langle w_\lambda,(Q_--\mu_-)w_\lambda\rangle,
 \qquad
 x_\lambda={\langle p_\lambda,w_\lambda\rangle
                    \over\|p_\lambda\|}.             \tag{0.1}
\]

This note proves the exact two-source overlap floor

\[
 \boxed{
 |\langle g,w_\lambda\rangle|^2
 \geq
 \max\left\{
 \left[n_\lambda-{E_\lambda\over\kappa}\right]_+,
 \left[x_\lambda-{1\over2}
       \sqrt{{E_\lambda\over\kappa}}\right]_+^2
 \right\}.}                                         \tag{0.2}
\]

The first term is the ordinary loaded-gap inequality together with
`kappa<=gamma`; the second is the frozen pole-row Schur inequality.  The
first term does not use the pole coordinate.

There is a legal weighted-capture splice.  Let `b` be the same raw bridge
coordinate in a positive source-defect metric `Delta_M`, let
`K_M b=w_lambda`, and put

\[
 d_b=\langle b,\Delta_Mb\rangle,
 \qquad
 {\cal C}_M=\|Q{\cal K}_M\Delta_M^{-1/2}\|.          \tag{0.3}
\]

If the odd ground belongs to the complete bottom eigenspace, so that
`mu_-=mu_full`, then with `P_full` the complete bottom projector,

\[
 \boxed{
 \Lambda_M^{\max}
 =\|P_{\rm full}{\cal K}_M\Delta_M^{-1/2}\|^2
 \geq{|\langle g,w_\lambda\rangle|^2\over d_b}.}    \tag{0.4}
\]

Writing the maximum on the right of (0.2) as `R_lambda`, one obtains, when
`R_lambda>0`,

\[
 \boxed{
 |\mu_{\rm full}|
 \leq {\cal C}_M\sqrt{{d_b\over R_\lambda}}.}        \tag{0.5}
\]

For a defect-orthogonalized bridge the legal pair is instead the innovation
`w_b` and its Schur defect `s_b`.  A raw overlap may not be divided by
`s_b`, and an innovation overlap may not be divided by the raw diagonal
`d_b`.

Since `n_lambda` tends to a positive limit, `E_lambda=o(kappa)` forces
near-total **odd-ground capture**.  On the actual nested family it is
stronger still.  A fixed two-dimensional odd common core gives the
common-core ceiling `kappa<=C_V-mu_-`; together with `q_lambda->0`, this makes
`E_lambda=o(kappa)` force `mu_-(lambda)->0`, `E_lambda->0`, and RH.  The parity
identification and the independent residual gate

\[
 {\cal C}_M^2d_b\longrightarrow0                    \tag{0.6}
\]

are still required for the weighted full-bottom route as an algebraic
statement, but that route is redundant for an RH conclusion under the
actual energy-ratio premise.  An exact rational three-dimensional
pole-created family below has `E=o(kappa)` and `mu_-=-1` identically only
because it violates the actual common-core ceiling.

Checkpoint 1.77 also makes several prospective intermediate estimates
target-strength.  On the complete real parameter family, either one-sided
physical estimate

\[
 q^{\rm phys}_{\lambda,-}\leq {C\over\lambda}
 \quad\hbox{or}\quad
 q^{\rm phys}_{\lambda,-}\geq-{C\over\lambda}       \tag{0.7}
\]

is separately equivalent to RH by a one-sided Landau argument.  The odd
subspaces are nested.  Consequently each of `mu_->=-o(1)` and

\[
 E_\lambda
 =q^{\rm phys}_{\lambda,-}-\mu_-n_\lambda
 =o(1)                                               \tag{0.8}
\]

is separately RH-equivalent under odd-sector monotonicity and the
one-sided theorem.  The corresponding complete-bottom statements are
RH-equivalent as well.  No parity-order theorem is needed for these
absolute `o(1)` circularity statements; parity order remains necessary for
the weighted full-bottom splice (0.4)--(0.5).

These are equivalences and conditional reductions, not proofs that any
displayed hypothesis holds.  No energy-ratio bound, no residual gate
(0.6), no parity ordering, no bottom capture, and no Riemann-hypothesis
conclusion is proved.  The standard eight are untouched and the formal
state remains `P0_INVALIDATED`.

## 1. Frozen inputs

No zero table, numerical ground, or external computation is added.  The
minimal direct FROZEN inputs are:

| Dependency | SHA-256 |
|---|---|
| `notes/ACTUAL_MIXED_BRIDGE_CONTINUOUS_COMPACT_SIDE_ODD_CARRIER_TRANSFER_THEOREM.md` | `d60381270462b8148a94269cc62c43b6c65178e89243588c8dcf37047534f3de` |
| `tests/test_actual_mixed_bridge_continuous_compact_side_odd_carrier_transfer_theorem.py` | `f26d9ca46dbafba81ccf8893a2c235a8fd75a81fef0387abfc11f7f58bdc7afa` |
| `notes/ACTUAL_MIXED_BRIDGE_TRANSVERSE_GAP_ENERGY_BARRIER.md` | `d9fea23ec9427a2bfcf8f22ec6465cafbdd5623f4adc311e83114fd8b8591677` |
| `tests/test_actual_mixed_bridge_transverse_gap_energy_barrier.py` | `822711c839de663d5152ea61cc438a194780d80444f02cbac07b365947a608f1` |
| `notes/CUTOFF_FREE_ONE_DIRECTION_WEIGHTED_GROUND_CAPTURE_THEOREM.md` | `770087b56766e0102a915a31e08aba5389065d78dd59a55135adb5f5b6eea948` |
| `tests/test_cutoff_free_one_direction_weighted_ground_capture_theorem.py` | `a9cd2abbf8c3de284e1b375beffc7f186a7f4bebc3ecd7fba111195f435b86fc` |
| `notes/CUTOFF_FREE_PROLATE_GROUND_ALIGNMENT_RH_DICHOTOMY.md` | `37f381b6ed75017633f4c845f90ff7d2660699bc0ae7a4340ec789b0e8dccea7` |
| `tests/test_cutoff_free_prolate_ground_alignment_rh_dichotomy.py` | `b17c3c603d459547c09fd0abb92b595986356e29e1d53f7e8c6f3ace4a8baf80` |
| `notes/ODD_FAVORABLE_LOCKED_SUBSEQUENCE.md` | `6d0067d6c9a520e26a62185baf118de5a29d479b082ea9bd2ae7b2e4ad731f72` |

Checkpoint 1.77 supplies the continuous physical odd self, its exact
carrier formula, the positive limiting bridge norm, and the all-real
remainder.  The transverse-gap pair supplies `kappa<=gamma` and the pole
bound in (0.2).  The one-direction pair supplies `Lambda_max`, the
projector identity, and the matching-metric rule.  The ground-alignment pair
supplies the compact common-core identity, complete-bottom nesting,
monotonicity, a near-zero Rayleigh upper bound, and the pinned CCM
implication.  Since the nested domains reduce inversion, they also supply
odd-sector nesting and monotonicity.  None
supplies parity order or (0.6).  The final note-only dependency supplies
the eventual-nonnegative real-abscissa Laplace lemma used in Section 7:
the Laplace transform of an eventually nonnegative function with finite
real abscissa of convergence cannot be holomorphic near that real
abscissa.  No subsequence conclusion or arithmetic sign assertion is
imported from it.

## 2. Spectral gap gives the stronger norm-scale floor

At fixed `lambda`, decompose

\[
 w_\lambda=a_\lambda g+z_\lambda,
 \qquad z_\lambda\perp g,
 \qquad
 n_\lambda=|a_\lambda|^2+\|z_\lambda\|^2.          \tag{2.1}
\]

Because `mu_-` is the simple odd bottom and `gamma` is the distance to the
rest of the odd spectrum,

\[
 E_\lambda
 =\langle z_\lambda,(Q_--\mu_-)z_\lambda\rangle
 \geq\gamma\|z_\lambda\|^2.                        \tag{2.2}
\]

The frozen transverse theorem gives

\[
 0<\kappa\leq\gamma.                                \tag{2.3}
\]

Consequently

\[
 E_\lambda
 \geq\kappa\{n_\lambda-|a_\lambda|^2\},
 \qquad
 |a_\lambda|^2
 \geq\left[n_\lambda-{E_\lambda\over\kappa}\right]_+.
                                                               \tag{2.4}
\]

The pole-axis Schur factor separately gives

\[
 |a_\lambda|
 \geq\left[x_\lambda-{1\over2}
             \sqrt{{E_\lambda\over\kappa}}\right]_+.
                                                               \tag{2.5}
\]

Squaring (2.5) and taking the larger of (2.4)--(2.5) proves (0.2).
For exact cancellation the two necessary energy thresholds are

\[
 \langle g,w_\lambda\rangle=0
 \quad\Longrightarrow\quad
 E_\lambda\geq\kappa n_\lambda,
 \qquad E_\lambda\geq4\kappa x_\lambda^2.          \tag{2.6}
\]

For the actual bridge,

\[
 n_\lambda\longrightarrow n_\infty:=\|W_\infty\|^2>0,
 \qquad
 x_\lambda
 =2^{-3/4}{\log\lambda\over\sqrt\lambda}\{1+o(1)\}.
                                                               \tag{2.7}
\]

Thus the norm-scale threshold in (2.6) eventually dominates the pole-row
threshold.  The pole row remains useful when only its Schur geometry is
available; it does not weaken the ordinary spectral-gap theorem.

## 3. Legal weighted-capture splice

Let `Delta_M>0` on the declared independent source coordinates and set

\[
 B_M={\cal K}_M\Delta_M^{-1/2},
 \qquad
 \Lambda_M^{\max}=\|P_{\rm full}B_M\|^2.            \tag{3.1}
\]

The Rayleigh quotient form of the operator norm is

\[
 \Lambda_M^{\max}
 =\sup_{f\ne0}{\|P_{\rm full}{\cal K}_Mf\|^2
                    \over\langle f,\Delta_Mf\rangle}.
                                                               \tag{3.2}
\]

If the raw bridge coordinate `b` belongs to this exact family and
`K_Mb=w_lambda`, selecting `f=b` proves

\[
 \Lambda_M^{\max}
 \geq{\|P_{\rm full}w_\lambda\|^2\over d_b}.        \tag{3.3}
\]

If `g` carries the complete bottom eigenvalue, then
`||P_full*w_lambda||^2>=|<g,w_lambda>|^2`, proving (0.4).  An even ground
tied at the same eigenvalue causes no problem.  An even ground strictly
below `mu_-` destroys this splice: `g` is then absent from `P_full`.

The complete-bottom projector identity is

\[
 |\mu_{\rm full}|\sqrt{\Lambda_M^{\max}}
 \leq {\cal C}_M.                                   \tag{3.4}
\]

Combining (3.3)--(3.4) with (0.2) proves (0.5).  Equivalently, the direct
bridge-column version is

\[
 |\mu_{\rm full}|
 \leq{\|Qw_\lambda\|\over\sqrt{R_\lambda}}
 \quad(R_\lambda>0).                                \tag{3.5}
\]

Equation (3.5) makes the remaining graph-residual requirement explicit.
A small quadratic energy does not bound `||Qw_lambda||`.

For completeness, if the source metric is written as

\[
 \Delta_M=
 \begin{bmatrix}\Delta_F&c\\c^*&d\end{bmatrix},
 \qquad
 s_b=d-c^*\Delta_F^{-1}c,
 \qquad
 w_b=t_b-T_F\Delta_F^{-1}c,                         \tag{3.6}
\]

then exact completion of the square gives

\[
 T_M\Delta_M^{-1}T_M^*
 =T_F\Delta_F^{-1}T_F^*+s_b^{-1}|w_b\rangle\langle w_b|.
                                                               \tag{3.7}
\]

Thus the innovation contribution is
`|<g,w_b>|^2/s_b`.  Formula (3.7) neither turns `w_b` into the raw bridge
nor turns `s_b` into `d_b`.  The residual constant, capture statistic, and
defect metric in (0.5) must all come from the same family.

## 4. The actual common core makes `E=o(kappa)` target-strength

Fix a two-dimensional odd subspace `V` of the compactly supported common
form core.  For every sufficiently large `lambda`, domain exhaustion and
reduction by inversion give

\[
 q_\lambda^{\rm form}(f,h)=QW(f,h)
 \qquad(f,h\in V).                                  \tag{4.1}
\]

Put
`C_V=max{1,sup_(f in V,||f||=1) QW(f,f)}`.  The linear functional
`f mapsto <p_lambda,f>` has a nonzero kernel in `V`; choose a unit
`f_lambda in V cap p_lambda^perp`.  On that kernel the pole load vanishes,
so `H_-=Q_-`.  The variational definition of the transverse floor gives

\[
 \boxed{
 \kappa
 \leq\langle f_\lambda,(H_--\mu_-)f_\lambda\rangle
 =QW(f_\lambda,f_\lambda)-\mu_-
 \leq C_V-\mu_-.}                                  \tag{4.2}
\]

The common-core constant `C_V` is independent of `lambda`.  For the actual
bridge,

\[
 q_\lambda=E_\lambda+\mu_-n_\lambda,
 \qquad
 \mu_-\leq{q_\lambda\over n_\lambda},
 \qquad
 q_\lambda\longrightarrow0,
 \qquad n_\lambda\longrightarrow n_\infty>0.     \tag{4.3}
\]

Put `epsilon_lambda=E_lambda/kappa`.  Equations (4.2)--(4.3) give the
denominator-safe squeeze

\[
 q_\lambda-\mu_-n_\lambda=E_\lambda
 \leq\epsilon_\lambda(C_V-\mu_-),
 \qquad
 \mu_-(n_\lambda-\epsilon_\lambda)
 \geq q_\lambda-\epsilon_\lambda C_V.             \tag{4.4}
\]

If `epsilon_lambda->0`, the right inequality in (4.4) gives
`liminf mu_->=0`, while the Rayleigh upper bound in (4.3) gives
`limsup mu_-<=0`.  Hence `mu_-(lambda)->0` and then
`E_lambda=q_lambda-mu_-*n_lambda->0`.  Odd monotonicity makes a
nonincreasing bottom with zero limit nonnegative.  Therefore `q_lambda>=0`
on the complete real family, and the lower one-sided Landau theorem in
Section 7 forces RH.  In short,

\[
 \boxed{
 {E_\lambda\over\kappa}\longrightarrow0
 \quad\Longrightarrow\quad
 \mu_-(\lambda)\longrightarrow0
 \quad\Longrightarrow\quad
 E_\lambda\longrightarrow0
 \quad\Longrightarrow\quad {\rm RH}.}             \tag{4.5}
\]

The same conclusion holds if the energy-ratio premise is known only on a
cofinal schedule.  Equation (4.4) squeezes `mu_-(lambda)->0` on that
schedule; odd monotonicity then gives `mu_->=0` on the complete family,
hence the full-real lower one-sided bound.  No arbitrary noncofinal
sequence is covered.  The converse of (4.5) is not asserted: RH gives
`E_lambda=O(lambda^(-1))`, but no frozen lower bound for `kappa`.

The pointwise spectral inequality also retains its capture consequence.
From (2.4) and (2.7),

\[
 {E_\lambda\over\kappa}\longrightarrow0
 \quad\Longrightarrow\quad
 {|\langle g,w_\lambda\rangle|^2\over n_\lambda}
 \longrightarrow1.                                  \tag{4.6}
\]

Under the legal full-bottom splice this also gives

\[
 \Lambda_M^{\max}
 \geq{n_\infty+o(1)\over d_b}.                      \tag{4.7}
\]

The projector estimate then reads

\[
 |\mu_{\rm full}|^2
 \leq{{\cal C}_M^2d_b\over n_\infty+o(1)}.         \tag{4.8}
\]

Equations (4.6)--(4.8) remain exact overlap and weighted-splice theorems.
For the actual nested operator, however, the parity/residual continuation
is redundant under the premise of (4.5), which already forces RH.  Without
that premise a small scalar `q=<w,Qw>` still need not control `||Qw||`.

## 5. Abstract rational three-dimensional saturation model

Let `m>=3` be an integer and put

\[
 K_m={(m^2+1)^2\over4m^2},
 \qquad
 a_m={m^2-1\over m^2+1},
 \qquad
 b_m={2m\over m^2+1}.                               \tag{5.1}
\]

Then

\[
 a_m^2+b_m^2=1,
 \qquad K_mb_m^2=1,
 \qquad K_m\longrightarrow+\infty.                 \tag{5.2}
\]

On `R^3`, take

\[
 p=e_1,
 \qquad
 H_m=\operatorname {diag}(1,K_m-1,K_m-1),
 \qquad
 Q_m=H_m-2|p\rangle\langle p|
     =\operatorname {diag}(-1,K_m-1,K_m-1).         \tag{5.3}
\]

For all sufficiently large `m`, `H_m>0`, the eigenvalue `mu_m=-1` is
strictly below `sigma(H_m)`, and

\[
 2\langle p,(H_m-\mu_m)^{-1}p\rangle=1.             \tag{5.4}
\]

Thus this is a genuine pole-created simple ground with

\[
 g=e_1,
 \qquad
 \gamma_m=K_m,
 \qquad
 \kappa_m=K_m.                                      \tag{5.5}
\]

Choose the rational bridge

\[
 w_m=(a_m,b_m,0)^T.                                  \tag{5.6}
\]

Direct calculation gives

\[
 n_m=1,
 \qquad
 q_m=\langle w_m,Q_mw_m\rangle=0,
 \qquad
 E_m=q_m-\mu_mn_m=1.                                \tag{5.7}
\]

Consequently

\[
 {E_m\over\kappa_m}=b_m^2\longrightarrow0,
 \qquad
 |\langle g,w_m\rangle|^2=a_m^2
 =1-{E_m\over\kappa_m},
 \qquad
 \mu_m=-1.                                         \tag{5.8}
\]

The gap inequality is saturated and capture tends to one, but the
eigenvalue does not move.  The residual records the obstruction:

\[
 \|Q_mw_m\|^2=K_m-1\longrightarrow+\infty.          \tag{5.9}
\]

This model proves abstract sharpness only when the actual common-core input
is removed.  Indeed every unit vector in `p^perp` has `Q_m`-energy
`K_m-1`, which tends to infinity.  Thus there is no fixed
two-dimensional odd common core with a uniform constant `C_V`, and (4.2)
would read `K_m<=C_V+1`, an impossibility.  The family therefore does not
challenge the actual implication (4.5), the von-Mangoldt operator, or any
arithmetic equivalence below.

## 6. Continuous physical self and unconditional decay

Checkpoint 1.77 proves, for every sufficiently large real `lambda`,

\[
 q_\lambda:=q^{\rm phys}_{\lambda,-}
 ={A_\lambda^2C_\xi\over8\lambda}
  -{A_\lambda^2\over8}{\cal S}_\lambda+r_\lambda,
 \qquad
 r_\lambda=o(\lambda^{-N})
 \quad\hbox{for every fixed }N>0,                   \tag{6.1}
\]

where

\[
 {\cal S}_\lambda
 =\sum_\rho{\lambda^{-2\rho}\over\rho^2},
 \qquad
 \sum_\rho|\rho|^{-2}<\infty,
 \qquad
 A_\lambda=2^{3/4}+O(\lambda^{-2}).                \tag{6.2}
\]

Because every nontrivial zero has `0<Re(rho)<1`, dominated convergence in
(6.2) gives

\[
 {\cal S}_\lambda\longrightarrow0,
 \qquad q_\lambda\longrightarrow0                 \tag{6.3}
\]

unconditionally.  This is qualitative decay, not the RH-strength rate
`O(lambda^(-1))`.

Put `a=log(lambda)` and

\[
 G(a)=e^a{\cal S}_{e^a}
 =\sum_\rho{e^{(1-2\rho)a}\over\rho^2}.             \tag{6.4}
\]

Multiplying (6.1) by `lambda` gives

\[
 \lambda q_\lambda
 ={A_\lambda^2C_\xi\over8}
  -{A_\lambda^2\over8}G(\log\lambda)+o(1).         \tag{6.5}
\]

The coefficient `A_lambda^2/8` is bounded above and away from zero
eventually.  Hence the upper one-sided bound in (0.7) gives
`G(a)>=-C_1`, while the lower one-sided bound gives `G(a)<=C_1`.

## 7. One-sided Landau equivalence

For one `a_0>0`, the Laplace transform of `G` is initially

\[
 {\cal L}(s)
 =\int_{a_0}^\infty G(a)e^{-sa}\,da
 =\sum_\rho
 {e^{-(s-1+2\rho)a_0}
  \over\rho^2(s-1+2\rho)}
 \qquad(\operatorname {Re}s>1).                    \tag{7.1}
\]

The series on the right continues meromorphically to `Re(s)>0`.  A zero
`rho_0` with `Re(rho_0)<1/2` gives the noncancelling pole

\[
 s_0=1-2\rho_0,
 \qquad
 \operatorname {Res}_{s=s_0}{\cal L}(s)
 ={m(\rho_0)\over\rho_0^2}\ne0.                    \tag{7.2}
\]

Suppose first that `G(a)<=C_1` eventually.  Then

\[
 h_+(a)=C_1-G(a)\geq0                               \tag{7.3}
\]

eventually.  The elementary bound `|G(a)|<=C_2e^a` makes the real
abscissa of its tail Laplace transform finite.  The eventual-nonnegative
Landau lemma says that this transform cannot be holomorphic at a positive
real abscissa of convergence.  But the continuation

\[
 {\cal L}_{h_+}(s)
 ={C_1e^{-sa_0}\over s}-{\cal L}(s)                 \tag{7.4}
\]

is holomorphic at every positive real `s`: a real pole in (7.1) would
require a real nontrivial zero, and none exists.  Thus the abscissa is at
most zero, (7.4) is holomorphic throughout `Re(s)>0`, and (7.2) is
impossible.  Functional-equation symmetry then puts every zero on the
critical line.

If `G(a)>=-C_1`, use instead

\[
 h_-(a)=C_1+G(a)\geq0,
 \qquad
 {\cal L}_{h_-}(s)
 ={C_1e^{-sa_0}\over s}+{\cal L}(s).                \tag{7.5}
\]

The same argument applies.  Conversely RH makes `G` uniformly bounded by
the absolutely convergent sum in (6.2).  Therefore, on the complete real
family,

\[
 \boxed{
 q_\lambda\leq C\lambda^{-1}\text{ eventually}
 \quad\Longleftrightarrow\quad {\rm RH},}
 \qquad
 \boxed{
 q_\lambda\geq-C\lambda^{-1}\text{ eventually}
 \quad\Longleftrightarrow\quad {\rm RH}.}           \tag{7.6}
\]

The complete odd halfgrid can also be treated with the frozen mesh and
increment estimate.  No arbitrary sparse subsequence is covered.

## 8. Nested-sector circularity and the weighted parity barrier

The complete domains reduce inversion, so their odd subspaces are nested.
The min--max principle gives

\[
 \lambda'>\lambda
 \quad\Longrightarrow\quad
 \mu_-(\lambda')\leq\mu_-(\lambda).                 \tag{8.1}
\]

The raw odd bridge is an admissible odd test vector, hence

\[
 \mu_-(\lambda)
 \leq{q_\lambda\over n_\lambda},
 \qquad n_\lambda\longrightarrow n_\infty>0.       \tag{8.2}
\]

Suppose first that

\[
 \mu_-(\lambda)\geq-\epsilon_\lambda,
 \qquad \epsilon_\lambda\longrightarrow0.          \tag{8.3}
\]

Equations (6.3) and (8.2)--(8.3) force
`mu_-(lambda)->0`.  A nonincreasing function with limit zero is
nonnegative, so odd monotonicity then gives `mu_-(lambda)>=0`.  Since this
is the odd bottom, the physical bridge self satisfies `q_lambda>=0`.
This is the lower one-sided bound in (7.6) with constant zero, and therefore
it forces RH.  Conversely RH makes every odd Weil form nonnegative.  Thus

\[
 \boxed{
 \mu_-(\lambda)\geq-o(1)
 \quad\Longleftrightarrow\quad {\rm RH}.}           \tag{8.4}
\]

The sectoral shifted energy is

\[
 E_\lambda=q_\lambda-\mu_-(\lambda)n_\lambda
 \geq0.                                             \tag{8.5}
\]

If `E_lambda=o(1)`, then (6.3), (8.5), and the positive norm limit give
`mu_-(lambda)->0`.  Equation (8.1) again forces `mu_->=0`, and then
`q_lambda=E_lambda+mu_-*n_lambda>=0`; the same lower one-sided Landau
theorem gives RH.  Under RH, odd positivity and the bridge Rayleigh upper
bound give

\[
 0\leq\mu_-\leq{q_\lambda\over n_\lambda},
 \qquad
 0\leq E_\lambda\leq q_\lambda=O(\lambda^{-1}).    \tag{8.6}
\]

Consequently

\[
 \boxed{
 E_\lambda=o(1)
 \quad\Longleftrightarrow\quad {\rm RH}.}           \tag{8.7}
\]

The implications remain valid if the lower-shift or energy premise is
known only on a cofinal schedule: (8.1) promotes the resulting zero limit
to the complete odd family, after which odd positivity gives the full-real
one-sided bound `q_lambda>=0`.  No arbitrary noncofinal sequence is used.

For comparison, let `mu_full(lambda)` be the complete bottom and define

\[
 E_\lambda^{\rm full}
 =q_\lambda-\mu_{\rm full}(\lambda)n_\lambda.       \tag{8.8}
\]

The same nesting and bridge Rayleigh upper bound show that each of
`mu_full>=-o(1)` and `E_lambda^full=o(1)` is RH-equivalent; alternatively,
their zero-limit directions may use the pinned CCM implication directly.
The distinction between `mu_-` and `mu_full` therefore does not obstruct
these absolute circularity results.  It still obstructs (0.4)--(0.5): an
odd ground above a lower even ground is absent from `P_full`, so the
weighted full-bottom capture and residual estimate, when used as
standalone algebra, still require the explicit parity identification.

## 9. Final stopping line

For the actual nested odd operator, even on a cofinal schedule, the exact
claim boundary is

\[
 \boxed{
 E_\lambda=o(\kappa)
 \quad\Longrightarrow\quad
 \mu_-(\lambda)\longrightarrow0
 \quad\Longrightarrow\quad
 q_\lambda\geq0\text{ on the complete real family}
 \quad\Longrightarrow\quad {\rm RH}.}              \tag{9.1}
\]

The overlap convergence (4.6) holds simultaneously, but it is not the
strongest consequence of the premise.  If one deliberately omits the
actual common-core and nesting inputs, the standalone weighted algebra
still gives the conditional route

\[
 \left.
 \begin{array}{c}
 \mu_-=\mu_{\rm full}\text{ on a cofinal schedule},\\
 E_\lambda=o(\kappa),\\
 {\cal C}_M^2d_b\to0
 \end{array}
 \right\}
 \quad\Longrightarrow\quad
 \mu_{\rm full}\to0
 \quad\Longrightarrow\quad {\rm RH}.              \tag{9.2}
\]

Every premise in (9.2) that is not an identity remains unproved.  More
importantly, under the actual premise in its second line, the
parity/residual route is redundant: (9.1) already forces RH without
identifying the full bottom.  The sectoral estimates `mu_->=-o(1)`,
`E_lambda=o(1)`, and `E_lambda=o(kappa)`, the global analogues of the first
two, and either one-sided `O(lambda^(-1))` bound for the physical odd self
must not be presented as harmless preliminary bounds.

The abstract family in Section 5 does not evade (9.1); it omits its
common-core hypothesis, since the entire `p^perp` energy grows like
`K_m-1`.  No actual estimate in (0.7), (0.8), (9.1), or (9.2) is proved.
No parity order, residual limit, zero-location theorem, determinant
convergence, or RH conclusion is obtained.  The formal state remains
`P0_INVALIDATED`.

## 10. Reproduction

Run

    python3 -B -m unittest \
      tests.test_actual_mixed_bridge_odd_energy_capture_circularity_barrier -v

from `research-checkpoints/xi-prolate-bridge` with `PYTHONPATH=src` and
`PYTHONDONTWRITEBYTECODE=1`.
