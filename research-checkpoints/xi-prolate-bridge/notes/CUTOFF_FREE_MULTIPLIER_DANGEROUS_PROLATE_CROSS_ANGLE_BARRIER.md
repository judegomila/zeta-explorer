# Cutoff-free multiplier-dangerous prolate cross-angle barrier

## 0. Exact outcome and fail-closed boundary

Use the pinned full arithmetic source map from the even zero-integral
additive source into one finite physical inversion-parity space.  Write it
as

\[
 A:{\cal H}_0^{\rm ev}\longrightarrow X,
 \qquad C=AA^*,                                      \tag{0.1}
\]

and let `E` be the finite raw mixed additive-prolate prefix from checkpoint
1.67.  Let `Y` be either a complete negative/bottom spectral subspace or a
declared bottom slice.  Put

\[
 R_Y=P_YCP_Y\big|_Y,
 \qquad J_Y=A^*P_YR_Y^{-1/2}.                         \tag{0.2}
\]

The full-source row theorem makes `R_Y` invertible and gives the exact
normalization

\[
 \boxed{J_Y^*J_Y=I_Y.}                               \tag{0.3}
\]

Thus the mixed-prefix capture is the normalized Gram

\[
 \boxed{
 \mathfrak q_E(Y)
 =s_{\min}(P_EJ_Y)^2
 =\lambda_{\min}\!\left(
 R_Y^{-1/2}P_YAP_EA^*P_YR_Y^{-1/2}\right).}          \tag{0.4}
\]

In particular,

\[
 \boxed{\dim Y>\dim E\quad\Longrightarrow\quad
        \mathfrak q_E(Y)=0.}                         \tag{0.5}
\]

This is an exact multiplicity obstruction.  The presently frozen
`exp(O(lambda))` negative-index allowance does not imply the necessary
`O(lambda^2)` rank bound for a near-Shannon mixed prefix.

There is nevertheless a genuine actual-multiplier physical-angle theorem.
Let

\[
 B\succeq gI-\mathcal V,
 \qquad \mathcal V\succeq0,
 \qquad
 Y_\kappa=\operatorname {Ran}{\bf1}_{(-\infty,-\kappa]}(B), \tag{0.6}
\]

where `mathcal V` is the appropriate actual complete-symbol deficit
operator, including the odd pole when that convention is used.  If

\[
 \Pi_t={\bf1}_{[t,\infty)}(\mathcal V),
 \qquad 0\leq t<g+\kappa,
 \qquad V=\|\mathcal V\|,                            \tag{0.7}
\]

then every `y in Y_kappa` satisfies

\[
 \boxed{
 \|\Pi_ty\|^2\geq
 {g+\kappa-t\over V-t}\|y\|^2,
 \qquad
 \|(I-\Pi_t)y\|^2\leq
 {V-g-\kappa\over V-t}\|y\|^2.}                    \tag{0.8}
\]

At the usual threshold `t=g-delta`, the first squared angle is
`(kappa+delta)/(V-g+delta)`.  On the frozen actual schedule `V=O(lambda)`,
so this gives only a physical angle of order at least
`lambda^(-1/2)` when `kappa=0` and `delta` is fixed.  Passing through the
full arithmetic adjoint costs its available condition-number scale, and
projecting to `E` may annihilate the result altogether.

For the multiplier split define

\[
 \begin{aligned}
 D_E&=P_EA^*\Pi_tP_YR_Y^{-1/2},\\
 S_E&=P_EA^*(I-\Pi_t)P_YR_Y^{-1/2},\\
 \Delta_E&=s_{\min}(D_E)-\|S_E\|.
 \end{aligned}                                      \tag{0.9}
\]

The exact conclusion is only

\[
 \boxed{
 \mathfrak q_E(Y)^{1/2}=s_{\min}(D_E+S_E)
 \geq[\Delta_E]_+.}                                 \tag{0.10}
\]

Hence `Delta_E >= c/lambda` supplies a polynomial lower capture
`mathfrak q_E(Y)>=c^2/lambda^2`.  It does **not** by itself prove the
checkpoint-1.67 bridge gate.  That gate remains exactly

\[
 \boxed{\mathfrak q_E(e_0)>\delta_E.}                \tag{0.11}
\]

Checkpoint 1.67 proves at its allowed prefix only the one-sided estimate

\[
 \boxed{\delta_{E_R}\geq{1\over16\pi^2\lambda^2}.}   \tag{0.12}
\]

No matching upper bound for `delta_(E_R)` is frozen.  In particular no
two-sided order estimate for this threshold is asserted or used.

Finally, there is a sharp structural countermodel.  Keep the literal map
`A`, the actual prolate prefix, parity, the pole, and the full-source
normalization, but replace the full arithmetic symbol by the synthetic
critical-edge symbol

\[
 m_{\rm edge}(t)=-4\lambda\cos(Lt).                  \tag{0.13}
\]

Its multiplier-dangerous projector is the identity for every threshold
that retains a positive safe floor.  Nevertheless one may take a complete
bottom space of dimension larger than `dim E`, or a codimension-one missed
bottom line in `ker(P_EA^*)`, and obtain

\[
 \boxed{\mathfrak q_E=0,\qquad\Delta_E=0.}           \tag{0.14}
\]

This is not the actual full von-Mangoldt Weil symbol and is not a
counterexample to actual bridge capture.  It proves that literal arithmetic
surjectivity, prolate concentration, parity, critical multiplier geometry,
and uncertainty alone do not imply the missing cross-angle.  The signed
nonendpoint arithmetic remainder must orient the actual bottom space.

No actual mixed-prefix capture, bridge gate, phase-bulk codimension-one
theorem, bottom-projector floor, determinant convergence, zero statement,
Riemann-hypothesis conclusion, converse, or de Bruijn--Newman bound is
proved.  The standard eight are untouched and the formal state remains
`P0_INVALIDATED`.

## 1. Frozen dependencies

No new external source is used.  The exact local inputs are:

| Frozen path | SHA-256 |
|---|---|
| `notes/CUTOFF_FREE_BRIDGE_MIXED_ADJOINT_TAIL_PREFACTOR_REDUCTION.md` | `53dd9fefd8cc05a29cd3e0a043e6f86f8bbdc7545d2c203d29bc59cbbe1a04f8` |
| `tests/test_cutoff_free_bridge_mixed_adjoint_tail_prefactor_reduction.py` | `e532a958742feda3efe00adc37e1ea2879a3676f23b63a47c238e348aaf5b17c` |
| `notes/CUTOFF_FREE_FULL_SOURCE_ADJOINT_PROLATE_CAPTURE_BARRIER.md` | `157bffc55aeec592c263d5973effe1b9506e02dd97311652ecb2fdee0c3ff0e9` |
| `tests/test_cutoff_free_full_source_adjoint_prolate_capture_barrier.py` | `d7f70dffbd10021ce7d6e8887d10589a482b2dc64c9ebbe8c48cc35568c233ae` |
| `notes/FULL_SOURCE_COFRAME_RANK_THEOREM.md` | `3f8b381d9e51e0fa0cf89928851e89dd163ec9982249af8050a90520c0389f81` |
| `tests/test_full_source_coframe_rank.py` | `dc322485178710618f9ace19cd2019200bf0dafeabcbe17cce4e47d41377d66a` |
| `notes/PARITY_MULTIPLIER_SCHUR_REDUCTION.md` | `c6e4a757604bfc9c1299a272054f1174970781e6cd0a92ed0dfb196f9804fa81` |
| `tests/test_parity_multiplier_schur.py` | `94ee818e2747e703d521cfa2a980765569cccfdf442b700b1a6b33ac4ceababb` |
| `notes/GROWING_MULTIPLIER_DEFICIT_GEOMETRY_BOUNDARY_ALIAS_BARRIER.md` | `2e5b38892f73848b4d081de5fef45f10819bd4e7f6a8be5a4edb8f85dae11141` |
| `tests/test_growing_multiplier_deficit_geometry_boundary_alias_barrier.py` | `6dc9991b36db57e6a22155b30e0ab9bf913812d17c0f81d3f356c602da73d9d0` |

The checkpoint-1.67 pair supplies `E`, `delta_E`, the exact bridge gate,
the missed-line notation, and the one-sided lower bound (0.12).  The
adjoint pair supplies the literal arithmetic formula and the coefficient
functional.  The full-source pair supplies the row floor and upper norm.
The multiplier pair supplies the actual source-defined dangerous projector
and safe floor.  The boundary-alias pair supplies the exact critical-edge
collapse used only in the synthetic nonimplication model.

## 2. Normalized prefix Gram and the multiplicity obstruction

The exact full-source constants are

\[
 m_\lambda={1\over2\lambda^2M_\mu(\lambda)^2},
 \qquad M_\lambda={\lambda^2\over2},
 \qquad M_\mu(\lambda)\leq2\lambda,                 \tag{2.1}
\]

and hence

\[
 m_\lambda I_X\preceq C\preceq M_\lambda I_X.       \tag{2.2}
\]

Compression to `Y` preserves (2.2), so `R_Y>0`.  Direct multiplication
proves

\[
 J_Y^*J_Y
 =R_Y^{-1/2}P_YAA^*P_YR_Y^{-1/2}=I_Y,               \tag{2.3}
\]

which proves (0.3)--(0.4).  Since `P_EJ_Y` maps `Y` into `E`, rank-nullity
proves (0.5).  Thus any multiplicity-safe theorem on the complete negative
space must first prove

\[
 \boxed{\dim Y\leq\dim E.}                           \tag{2.4}
\]

This is necessary, not sufficient.  When (2.4) holds, the exact remaining
matrix inequality is

\[
 \boxed{
 P_YAP_EA^*P_Y\succeq
 \gamma_\lambda P_YAA^*P_Y,}                        \tag{2.5}
\]

with `gamma_lambda` large enough for the intended application.  Equation
(2.5) is exactly `mathfrak q_E(Y)>=gamma_lambda`; it is not a consequence
of full-source surjectivity because `P_E` has finite rank.

For one unit line `Y=span{e_0}`, write

\[
 z_0=A^*e_0,
 \qquad\tau_0=\|z_0\|^2.
\]

Then the multiplicity issue disappears and

\[
 \boxed{
 \mathfrak q_E(e_0)={\|P_Ez_0\|^2\over\tau_0}.}      \tag{2.6}
\]

The rest of the note distinguishes this scalar target from the stronger
triangle-separated quantity `Delta_E`.

## 3. Actual multiplier physical angle

### Theorem 3.1 (negative-space angle to a reducing danger projector)

Assume (0.6)--(0.7) and let `0!=y in Y_kappa`.  The spectral definition of
`Y_kappa` and the lower comparison give

\[
 (g+\kappa)\|y\|^2
 \leq\langle y,\mathcal Vy\rangle.                   \tag{3.1}
\]

Because `Pi_t` reduces `mathcal V`, spectral calculus also gives

\[
 \langle y,\mathcal Vy\rangle
 \leq V\|\Pi_ty\|^2+t\|(I-\Pi_t)y\|^2.             \tag{3.2}
\]

Using Pythagoras in (3.2) and rearranging proves (0.8).  If `V<g+kappa`,
equation (3.1) instead proves `Y_kappa={0}`.

For the actual even multiplier one may take the compressed `T_v`.  For the
odd sector one may either use the spectral projector of the complete
positive deficit including the negative-pole load, or keep the separately
frozen sharp odd construction.  The theorem applies directly in the first
convention.  In both cases the exact symbol bounds give

\[
 V=O(\lambda)                                        \tag{3.3}
\]

when `g+U=O(L)` on the frozen schedule.  Consequently the natural threshold
`t=g-delta` proves a nonzero physical angle, but it does not prove an
additive-prolate angle.

The loss through the unprojected full source can be written exactly.  Put

\[
 a_t^2={g+\kappa-t\over V-t},
 \qquad b_t^2={V-g-\kappa\over V-t}.                 \tag{3.4}
\]

For every unit `y in Y_kappa`, set `z=R_Y^{-1/2}y`.  Equations (2.2) and
(0.8) yield

\[
 \boxed{
 s_{\min}(A^*\Pi_tP_YR_Y^{-1/2})
 \geq\sqrt{m_\lambda\over M_\lambda}\,a_t
 ={a_t\over\lambda^2M_\mu(\lambda)}
 \geq{a_t\over2\lambda^3},}                        \tag{3.5}
\]

whereas

\[
 \boxed{
 \|A^*(I-\Pi_t)P_YR_Y^{-1/2}\|
 \leq\sqrt{M_\lambda\over m_\lambda}\,b_t
 =\lambda^2M_\mu(\lambda)b_t
 \leq2\lambda^3b_t.}                               \tag{3.6}
\]

Projection by `P_E` preserves the upper bound (3.6) but not the lower bound
(3.5).  Indeed Sections 2 and 5 give exact kernels after `P_E`.  Thus the
actual physical angle is a theorem, while the required source-prefix angle
is not.

Lowering `t` improves the guaranteed physical angle monotonically because

\[
 {d\over dt}{g+\kappa-t\over V-t}
 ={g+\kappa-V\over(V-t)^2}\leq0.                    \tag{3.7}
\]

At `t=0` this gain comes from retaining the complete positive spectral
support.  Section 6 shows why that endpoint destroys the finite dangerous
reduction.

## 4. Exact normalized cross-angle stopping line

Since

\[
 P_EJ_Y=D_E+S_E,                                     \tag{4.1}
\]

the smallest-singular-value triangle inequality proves (0.10).  This is
only sufficient.  For example, on a one-dimensional domain the same-range
values `D_E=2` and `S_E=3` give total capture `25` but `Delta_E=-1`.

The exact normalized Gram retains the cross term:

\[
 \boxed{
 \begin{aligned}
 \mathfrak G_E
 &:=(D_E+S_E)^*(D_E+S_E)\\
 &=D_E^*D_E+S_E^*S_E+D_E^*S_E+S_E^*D_E.
 \end{aligned}}                                     \tag{4.2}
\]

Put

\[
 C_E=AP_EA^*.                                        \tag{4.3}
\]

Then the signed cross is exactly

\[
 \boxed{
 D_E^*S_E
 =R_Y^{-1/2}P_Y\Pi_tC_E(I-\Pi_t)P_YR_Y^{-1/2}.}      \tag{4.4}
\]

With `[Pi_t,C_E]=Pi_t C_E-C_E Pi_t`, one also has

\[
 \Pi_tC_E(I-\Pi_t)
 =\Pi_t[\Pi_t,C_E](I-\Pi_t).                         \tag{4.5}
\]

Thus a commutator theorem could control the cross, but it would still need
a diagonal floor for `D_E^*D_E`.  No spectral gap at the hard threshold and
no actual bound for `[mathcal V,C_E]` are frozen.  The direct stopping line
is therefore

\[
 \boxed{\mathfrak G_E\succeq\gamma_\lambda I_Y,}     \tag{4.6}
\]

equivalently (2.5).  It is weaker than demanding a small operator norm for
the complete safe contribution.

## 5. Literal-arithmetic exact-edge countermodel

Keep the literal full-source map `A` and its exact bounds (2.1)--(2.2).
Change only the complete multiplier symbol to the synthetic edge member
(0.13).  Let

\[
 \beta=g+U,
 \qquad
 v_\beta(t)=[\beta+4\lambda\cos(Lt)]_+.              \tag{5.1}
\]

For `0<=beta<4lambda`, put

\[
 \alpha=\arccos\!\left(-{\beta\over4\lambda}\right),
 \qquad
 \overline v_\beta
 ={\beta\alpha+4\lambda\sin\alpha\over\pi}.       \tag{5.2}
\]

Critical periodic Wiener--Hopf collapse gives

\[
 \boxed{T_{v_\beta}=\overline v_\beta I.}           \tag{5.3}
\]

Moreover `overline(v)_beta-beta` is the nonzero mean of the complementary
positive part, so `overline(v)_beta>beta>=g`.  Therefore every spectral
threshold `0<=t<g` gives

\[
 \boxed{\Pi_t=I.}                                    \tag{5.4}
\]

The shifted even edge block is

\[
 B_+^{\rm edge}=-UI+2|p_+\rangle\langle p_+|.       \tag{5.5}
\]

For `U>0`, every vector in `p_+^perp` is a bottom eigenvector with eigenvalue
`-U`.  Take a finite physical space large enough that

\[
 Y=p_+^\perp,
 \qquad\dim Y>\dim E.                                \tag{5.6}
\]

The literal full-source floor still makes `R_Y>0`, while (0.5), (5.4), and
`S_E=0` prove

\[
 \boxed{
 \mathfrak q_E(Y)=0,
 \qquad\Delta_E=0.}                                  \tag{5.7}
\]

There is also an exact codimension-one version.  If the physical dimension
exceeds `dim E+1`, choose a unit vector

\[
 e_0\in p_+^\perp\cap\ker(P_EA^*).                  \tag{5.8}
\]

Then

\[
 \tau_0=\|A^*e_0\|^2\geq m_\lambda>0,
 \qquad\mathfrak q_E(e_0)=0.                        \tag{5.9}
\]

For any phase bulk `F subset E`, define the target space as

\[
 X_F=\operatorname {Ran}(A|_F)\mathbin\oplus
             \operatorname {span}\{e_0\}.           \tag{5.10}
\]

Equation (5.8) makes this sum orthogonal and gives `T_F^*e_0=0`.  Thus
`e_0` is the codimension-one missed map direction in `X_F` and is a bottom
line.  The edge block may have additional bottom directions inside
`Ran(A|_F)`; no simplicity is asserted.  The model therefore preserves the
algebraic premise of the checkpoint-1.67 branch.

The edge member is the leading local PNT profile, but it is not the actual
full arithmetic symbol.  It drops the signed nonendpoint prime frequencies,
the archimedean tail, and the complete arithmetic remainder.  Equations
(5.7)--(5.10) are therefore a structural nonimplication theorem, not a
counterexample to the actual Weil operator.

## 6. Threshold and smoothing audit

The edge model already handles every hard threshold compatible with a
positive safe floor.  By (5.3), a threshold below `overline(v)_beta` gives
the identity, while a threshold above it gives zero.  The latter threshold
is larger than `g` and destroys the lower comparison `g-t>0`.

Let `0<=f<=1` be any Borel spectral taper and put

\[
 W_f=f(T_{v_\beta})=cI,
 \qquad c=f(\overline v_\beta).                       \tag{6.1}
\]

On a one-dimensional line with total prefix map `K=P_EJ_Y`, the smoothed
triangle difference is

\[
 \boxed{
 s_{\min}(cK)-\|(1-c)K\|
 =(2c-1)\|K\|\leq\|K\|.}                            \tag{6.2}
\]

For the missed line (5.8), `K=0`, so every smoothing gives zero.  For the
full space (5.6), `s_min(K)=0`, and every `c<1` makes the difference
nonpositive.  Thus smoothing cannot improve the exact-edge obstruction
even though its commutator with every operator vanishes.

For the actual multiplier, `v(t)>0` on a nonempty open interval.  If
`T_vf=0`, then

\[
 0=\langle f,T_vf\rangle
 ={1\over2\pi}\int_{\mathbb R}v(t)|\widehat f(t)|^2dt. \tag{6.3}
\]

The zero extension of `f` has compact support, so its Fourier transform is
entire.  Vanishing on an open interval forces `f=0`.  Hence `T_v` is
injective.  On every finite compression it is positive definite, while on
the full physical space it has infinite positive spectral support.
Consequently a taper positive down to spectral value zero has full support.

If a taper is zero below `s>0`, transitions on `[s,t]`, and equals one above
`t`, its effective dangerous support is at least
`1_[s,infinity)(T_v)`.  To recover an orthogonal safe floor the whole gray
band must be retained as dangerous.  This is the hard threshold at `s`,
with a larger rank.  Smooth functional calculus may help a future
commutator estimate, but only after new bounds for the gray-band rank and
`[T_v,C_E]`; it supplies no capture theorem by itself.

A projector orthogonal in the `C=AA^*` metric would make the two full-source
pieces orthogonal before `P_E`, but its kernel is not the Euclidean
multiplier-safe space.  The known safe floor does not transfer through that
oblique change, whose norm may pay the same `lambda^3` condition scale as
(3.5)--(3.6).  A projector adapted to `C_E` instead builds the desired
capture Gram into its definition and is circular.

Parity removes or adjoins only the declared pole direction.  The edge
bottom space `p_+^perp` remains arbitrarily larger than `E`.  Likewise,
critical-set uncertainty cannot help: periodic collapse (5.3) is stronger
than a thickness estimate, since every vector observes exactly the same
scalar deficit, yet (5.7) still holds.

## 7. Exact one-line coefficient target

For the checkpoint-1.67 missed line, the literal adjoint is

\[
 r_{e_0}(x)=x^{-1/2}\sum_{n\leq\lambda x}
       n^{-1/2}e_0(x/n),
 \qquad
 c_{e_0}={1\over2\lambda}
       \int_{\lambda^{-1}}^\lambda r_{e_0}(x)\,dx.   \tag{7.1}
\]

Let the raw mixed prefix have orthonormal modes indexed by `mathcal I_E`.
Put

\[
 I_j=\langle1,h_j\rangle,
 \qquad
 \beta_j(e_0)=
 \int_{\lambda^{-1}}^\lambda
 r_{e_0}(x)\overline{h_j(x)}\,dx
 -c_{e_0}\overline{I_j}.                             \tag{7.2}
\]

Then the exact one-line statistic is

\[
 \boxed{
 \mathfrak q_E(e_0)
 ={1\over\tau_0}
 \sum_{j\in\mathcal I_E}|\beta_j(e_0)|^2.}          \tag{7.3}
\]

For the admissible zero-integral subspace `M=E cap 1^perp`, with
`s=sum_(j in mathcal I_E)|I_j|^2`, the corresponding corrected energy is

\[
 \boxed{
 {\|P_Mz_0\|^2\over\tau_0}
 ={1\over\tau_0}\left\{
 \sum_{j\in\mathcal I_E}|\beta_j(e_0)|^2
 -{\left|\sum_{j\in\mathcal I_E}
       \overline{I_j}\beta_j(e_0)\right|^2\over s}
 \right\}.}                                         \tag{7.4}
\]

If `beta_j=beta_j^D+beta_j^S` is induced by the multiplier split, (7.3)
retains the signed sum

\[
 2\operatorname {Re}\sum_{j\in\mathcal I_E}
       \beta_j^D\overline{\beta_j^S}.                \tag{7.5}
\]

The `Delta_E` estimate discards (7.5).  The narrow actual theorem needed by
the bridge branch is therefore not a separate dangerous dominance theorem.
It is the direct strict inequality

\[
 \boxed{
 \sum_{j\in\mathcal I_E}|\beta_j(e_0)|^2
 >\delta_E\tau_0.}                                   \tag{7.6}
\]

At the allowed prefix, (0.12) shows only that any successful left side must
exceed a fixed polynomial lower scale.  A bound of the form
`mathfrak q_E(e_0)>=c/lambda^2` does not prove (7.6) unless its constant is
compared with the actual `delta_E`.  Equivalently, one may prove the exact
positive excess `mathfrak q_E(e_0)-delta_E>0`, or the stronger polynomial
strict reserve from checkpoint 1.67.  No such estimate is proved here.

## 8. Reproduction and claim discipline

Run

    python3 -B -m unittest \
      tests.test_cutoff_free_multiplier_dangerous_prolate_cross_angle_barrier -v

The regression checks every frozen hash, normalized full-source Gram,
multiplicity obstruction, the actual physical-angle lemma, exact
conditioning scales, the signed cross identity, literal-arithmetic edge
countermodels for both the full bottom space and one missed line, hard and
smooth threshold nonimplication, the coefficient statistic, the one-sided
`delta_E` language, displayed TeX, and static hygiene.  It reads no zero
table, cached ground, prolate artifact, network resource, API key, or
environment secret.
