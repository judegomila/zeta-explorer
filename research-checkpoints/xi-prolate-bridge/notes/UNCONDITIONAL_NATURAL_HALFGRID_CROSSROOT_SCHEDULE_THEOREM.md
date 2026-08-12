# Unconditional natural-halfgrid cross-root schedule theorem

## 0. Exact outcome and claim boundary

There is no need to select a zeta zero in order to put the checkpoint-0.71
even-sector cross-root bridge on a strict odd-half-integer schedule.  For all
sufficiently large odd positive integers `p`, set

\[
 \lambda_p={p\over2},\qquad L_p=2\log\lambda_p,
 \qquad M_p=\lceil\lambda_p\rceil={p+1\over2}.     \tag{0.1}
\]

Either of the outer cutoffs

\[
 \boxed{N_p=M_p+1}
 \qquad\hbox{or more generally}\qquad
 \boxed{N_p=\lceil C\lambda_p\rceil,\quad C>1}     \tag{0.2}
\]

is deterministic, cofinal, and satisfies `M_p<N_p`.  The frozen natural
prolate tail and every schedule-dependent estimate in the projective bridge
remain valid on (0.1)--(0.2).

This note also makes the frozen HSW continuous-`L` phase-shell extraction
compatible with the odd half-grid at this natural outer scale.  The exact
half-grid mesh is `O(lambda^(-1))`, whereas the phase-shell stability radius
is at least `1/(16T)`.  Since the carrier shell has

\[
 T\asymp{N\over L},                                \tag{0.3}
\]

the certified mesh-to-radius ratio tends to zero precisely at the scale

\[
 \boxed{{N\over\lambda L}\longrightarrow0.}       \tag{0.4}
\]

Thus `N=M+1` and every fixed `C*lambda` cutoff admit a deterministic cofinal
HSW-phase-good odd-halfgrid subsequence.  In contrast, the critical-density
cutoff `N=ceil(D*lambda^2*L)` and the older logarithmic Gevrey cutoff
`N=ceil(lambda*L^3)` lie outside this rounding regime.

The HSW statement uses the unconditional count of all zeta ordinates with
algebraic multiplicity.  It does not identify the corresponding finite Weil
matrix with a positive zero Gram.  Such a positive-Gram interpretation is
RH-conditional and is not used in the cross-root schedule theorem.

The theorem proves schedule compatibility only.  It does not prove an
actual-source even complementary sign, simplicity, Ritz-ratio bound,
projective ground alignment, determinant convergence, a zero statement, RH,
a converse from RH, or a de Bruijn--Newman bound.  It changes none of the
standard eight files.  The formal state remains `P0_INVALIDATED`.

## 1. Minimal frozen inputs

Exactly three theorem/test pairs and the two source locks they directly use
are frozen.

| Dependency | SHA-256 |
|---|---|
| `notes/EVEN_SECTOR_CROSS_ROOT_LIMIT_BRIDGE.md` | `c8656f4c5e574ac30972b0645015a3bb57492908efbf0e57ddef5de9c0c6e9c2` |
| `tests/test_even_sector_cross_root_limit_bridge.py` | `73d7705dc170c7081cf99a7669bd74493ed937cac75dcaa075beacdbf9e3b3b1` |
| `notes/NATURAL_CUTOFF_SIGNED_GROUND_ALIGNMENT.md` | `ce6863d26788de9fc0fd9e998094fcb7982845ca298ccf8048d0913f62470450` |
| `tests/test_natural_cutoff_signed_ground_alignment.py` | `3ae99e6bbbc0004aa2560a577eca16d6ef0221d28fb2aefc3aef1d9558fae0bb` |
| `notes/HSW_CONTINUOUS_L_PHASE_SHELL_THEOREM.md` | `49a53cb1f8ee6db85040cd39aa6faa4fff0296d8bb8b99b18e830efce63df70e` |
| `tests/test_hsw_continuous_l_phase_shell_theorem.py` | `54e28858ad50a9b29578ff7719a2bb9818e02d7f275530a9da8cc15a023b6d9f` |
| `ZERO_SAMPLING_SOURCE_LOCK.json` | `f4cad4acb30dbfcdc5b30faafe92934e8958ad1cd11cbf6abea932f902e8c101` |
| `P0_SOURCE_LOCK.json` | `24fd1d3b44f238521ffb157bb808bda3dafbd5883599dc5d49a8bfd5e804a251` |

The first pair supplies the finite even cross-root theorem and its reduced
limit hypotheses.  The second supplies the natural Fourier cutoff, the
superpolynomial prolate tail, and the exact projective alignment observable.
The third and the zero-sampling lock supply the multiplicity-safe HSW shell,
its continuous mean-square estimate, and its explicit count bounds.  The
finite source lock fixes the Fourier sign, inversion, complete source matrix,
and source-normalized prolate state.  No selected zero, zero table, numerical
producer, external computation, or checkpoint-1.53 through checkpoint-1.55
RH-conditional scalar input is imported.

## 2. Exact odd-halfgrid geometry

For consecutive positive odd integers `p` and `p+2`, one has the exact mesh
identity

\[
 \boxed{
 L_{p+2}-L_p
 =2\log{p+2\over p}
 =2\log\left(1+{2\over p}\right)
 \leq{4\over p}={2\over\lambda_p}.}               \tag{2.1}
\]

Conversely, for any sufficiently large real `L`, let `p(L)` be the least
odd integer among the nearest odd integers to `2e^(L/2)`.  Then

\[
 \left|{p(L)\over2}-e^{L/2}\right|\leq{1\over2},
 \qquad
 \boxed{|L_{p(L)}-L|\leq{2\over e^{L/2}}}          \tag{2.2}
\]

eventually.  The tie rule makes `p(L)` deterministic.  Thus every fixed
positive-length interval in the `L` variable contains odd-halfgrid points
once its left endpoint is sufficiently large.

For a cutoff `N_p`, define its top retained Fourier carrier by

\[
 \boxed{\Omega_p={2\pi N_p\over L_p}.}             \tag{2.3}
\]

If `N_p=M_p+1`, then

\[
 N_p={p+3\over2}=\lambda_p+{3\over2},
 \qquad
 \Omega_p\sim{2\pi\lambda_p\over L_p},
 \qquad
 {N_p\over\lambda_pL_p}\sim{1\over L_p}.         \tag{2.4}
\]

The same conclusions, with constants depending on `C`, hold for
`N_p=ceil(C*lambda_p)` and fixed `C>1`.

## 3. Frozen HSW shell and a quantitative stability radius

Fix a sufficiently large integer `T`.  Use the parity-bin selection in the
frozen HSW theorem, choosing `epsilon_T=0` if its two multiplicity totals
tie, and write

\[
 \begin{aligned}
 Q_T&=\sum_{\gamma\in\Gamma_T}m_\gamma,\\
 U_T&=\sum_{\gamma\in\Gamma_T}{m_\gamma\over\gamma^2},\\
 C_T(L)&=\sum_{\gamma\in\Gamma_T}
              {m_\gamma e^{i\gamma L}\over\gamma^2},\\
 W_T(L)&={U_T-\operatorname {Re}C_T(L)\over2}.
 \end{aligned}                                    \tag{3.1}
\]

Every ordinate in `Gamma_T` lies in `(T,2T]`, and algebraic multiplicity is
retained.  Hence the frozen lower count gives

\[
 Q_T\geq{Z(T)\over2},
 \qquad
 \boxed{U_T\geq{Q_T\over4T^2}
             \geq{Z(T)\over8T^2}.}                \tag{3.2}
\]

Differentiation is harmless because the shell is finite, and the same total
multiplicity gives

\[
 C_T'(L)=i\sum_{\gamma\in\Gamma_T}
              {m_\gamma e^{i\gamma L}\over\gamma},
 \qquad
 \boxed{\|C_T'\|_\infty\leq{Q_T\over T}.}         \tag{3.3}
\]

The HSW mean-square estimate is uniform in the left endpoint `A` of every
fixed-length interval:

\[
 \int_A^{A+h}|C_T(L)|^2\,dL
 \leq E(T,h):={B(T)^2\over T^3}
       \{h+8(1+\log T)\}.                          \tag{3.4}
\]

Chebyshev at the stronger threshold `U_T/4` therefore gives

\[
 \left|\left\{L\in[A,A+h]:
       |C_T(L)|>{U_T\over4}\right\}\right|
 \leq{16E(T,h)\over U_T^2}
 =O_h\left({\log T\over T}\right)=o(1).           \tag{3.5}
\]

At any point `L_*` outside this exceptional set, define

\[
 \rho_T={U_T\over4\|C_T'\|_\infty},               \tag{3.6}
\]

with `rho_T=+infinity` if `C_T'` vanishes identically.  Equations
(3.2)--(3.3) give the exact certified radius

\[
 \boxed{\rho_T\geq{1\over16T}.}                   \tag{3.7}
\]

For `|L-L_*|<=rho_T`, the mean-value inequality yields

\[
 |C_T(L)|\leq|C_T(L_*)|
       +\|C_T'\|_\infty|L-L_*|
 \leq{U_T\over2},
 \qquad
 \boxed{W_T(L)\geq{U_T\over4}.}                  \tag{3.8}
\]

This is the quantitative information missing from a bare statement that the
continuous good set has asymptotically full measure.

## 4. Deterministic cofinal odd-halfgrid extraction

Fix `h>0` and disjoint blocks

\[
 I_j=[A_0+2jh,A_0+(2j+1)h],
 \qquad
 I_j^\circ=[A_0+2jh+h/4,A_0+2jh+3h/4].            \tag{4.1}
\]

For the natural schedule (0.2), let

\[
 \Omega_j^-=min\{\Omega_p:L_p\in I_j\},
 \qquad
 T_j=\left\lfloor\vartheta\Omega_j^-\right\rfloor,
 \qquad0<\vartheta<{1\over2}.                     \tag{4.2}
\]

Then `T_j` tends to infinity and

\[
 (T_j,2T_j]\subset(0,\Omega_p]
 \qquad(L_p\in I_j)                               \tag{4.3}
\]

eventually.  Apply (3.5) on the inner interval `I_j^circ`.  Its exceptional
measure tends to zero, so there is an `L_*` in `I_j^circ` satisfying
`|C_(T_j)(L_*)|<=U_(T_j)/4`.

Round `L_*` to the nearest odd-halfgrid point `L_p`.  Equations (2.2),
(3.7), and (4.2) show

\[
 { |L_p-L_*|\over1/(16T_j)}
 \ll {T_j\over\lambda_p}
 \asymp {N_p\over\lambda_pL_p}.                  \tag{4.4}
\]

For `N_p=M_p+1` or `N_p=ceil(C*lambda_p)`, the last expression is
`O(1/L_p)` and tends to zero.  Therefore `|L_p-L_*|<=rho_(T_j)` eventually,
and (3.8) holds at the rounded half-grid point.

Equivalently, define `p_j` without reference to a chosen `L_*` as the least
odd integer whose `L_(p_j)` lies in `I_j` and obeys

\[
 \boxed{|C_{T_j}(L_{p_j})|\leq{U_{T_j}\over2}.}    \tag{4.5}
\]

The preceding argument proves that this set is nonempty eventually.  The
least-element rule makes the sequence deterministic, the disjoint blocks
make it cofinal, and

\[
 \boxed{W_{T_j}(L_{p_j})\geq{U_{T_j}\over4}
       \gg {\log T_j\over T_j}.}                  \tag{4.6}
\]

No individual ordinate is selected as an input carrier before the schedule
is defined.  The definition instead uses the complete multiplicity-weighted
shell produced by the unconditional HSW count.  It is source-defined and
deterministic, but it is not an effective closed-form zero-free schedule.

## 5. Exact scale criterion and the critical incompatibility

On any family for which a common shell satisfies `T asymp N/L`, the known
half-grid mesh and the certified radius have ratio

\[
 {O(\lambda^{-1})\over\Omega(T^{-1})}
 \asymp{T\over\lambda}
 \asymp{N\over\lambda L}.                         \tag{5.1}
\]

Consequently, within the bridge range `M<N` (which already gives
`N/L->infinity`), the frozen stability-radius proof gives uniform
asymptotically safe rounding exactly when

\[
 \boxed{N=o(\lambda L).}                           \tag{5.2}
\]

The word "exactly" refers to the ratio of the two certified scales.  If
(5.2) fails, the argument does not prove that half-grid points are bad; it
only loses control of the rounding displacement.

For fixed critical density `D>0`,

\[
 N_{\rm crit}=\lceil D\lambda^2L\rceil,
 \qquad
 {N_{\rm crit}\over\lambda L}\sim D\lambda
 \longrightarrow\infty.                          \tag{5.3}
\]

For the older logarithmic Gevrey literal ceiling,

\[
 N_{\rm G}=\lceil\lambda L^3\rceil,
 \qquad
 {N_{\rm G}\over\lambda L}\sim L^2
 \longrightarrow\infty.                          \tag{5.4}
\]

The exponential bandwidth `2^(9600*lambda^2)` is farther outside (5.2).
Thus continuous HSW full measure does not transfer to any of these
preassigned half-grids by the frozen derivative argument.  Checkpoint 1.54
obtains critical half-grid phase matching only after starting from an
RH-selected zero; it cannot be used as an unconditional input here.

A fixed-`D` critical all-`p` schedule is nevertheless a perfectly valid
deterministic candidate schedule for the cross-root finite matrices.  What
is absent is an unconditional HSW phase selection on that critical grid.
The cross-root theorem itself does not require the HSW phase gate, so one may
instead attack its actual source gates directly on either schedule.

## 6. Natural-cutoff prolate and projective rates

Let `X_lambda` be the frozen source-normalized even prolate state and put

\[
 a_{\lambda,N}=\|P_NX_\lambda\|,
 \qquad
 \kappa_{\lambda,N}={P_NX_\lambda\over a_{\lambda,N}}.
                                                               \tag{6.1}
\]

The frozen Gevrey argument is an estimate at the low Fourier cutoff itself:

\[
 \boxed{
 \|(I-P_M)X_\lambda\|=O(e^{-c_0L^2}),
 \qquad M=\lceil\lambda\rceil.}                   \tag{6.2}
\]

It does not require the outer cutoff to be exponential.  To transfer the
frozen projected-state normalization, put

\[
 N_{\exp}=2^{9600\lambda^2}.                       \tag{6.2a}
\]

For either natural rule in (0.2), eventually `M<N<N_exp`.  Reverse
triangle inequality, nesting, and (6.2) give

\[
 \boxed{
 |a_{\lambda,N_{\exp}}-a_{\lambda,N}|
 \leq\|(P_{N_{\exp}}-P_N)X_\lambda\|
 \leq\|(I-P_M)X_\lambda\|
 =O(e^{-c_0L^2}).}                                \tag{6.2b}
\]

The frozen exponential-schedule bounds therefore transfer, with harmlessly
smaller and larger constants, to

\[
 \boxed{0<a_-\leq a_{\lambda,N}\leq a_+<\infty}
                                                               \tag{6.2c}
\]

on the natural schedule.  Whenever `N>M`, nested orthogonal
projections also give

\[
 e_{\lambda,N}:=\|(I-P_N)X_\lambda\|
 \leq\|(I-P_M)X_\lambda\|=O(e^{-c_0L^2}).         \tag{6.3}
\]

Consequently

\[
 \|(I-P_M)\kappa_{\lambda,N}\|
 \leq{\|(I-P_M)X_\lambda\|\over a_-}
 =O(e^{-c_0L^2}).                                  \tag{6.4}
\]

Moreover,

\[
 {2\pi(M+1)\over L}\sim{2\pi\lambda\over L}
 \longrightarrow\infty,                          \tag{6.5}
\]

so the compact-frequency separation condition holds on every fixed closed
substrip.  For every fixed `eta<1/2`, the outer and high-mode schedule rates
are

\[
 \boxed{
 \sqrt L\,\lambda^\eta e_{\lambda,N}\longrightarrow0,
 \qquad
 \lambda^\eta\sqrt{L\over M}
 =O(\lambda^{\eta-1/2}\sqrt L)\longrightarrow0.}  \tag{6.6}
\]

Suppose the coefficient-normalized even ground correction is bounded.  If
its low projective squared error is `E_M=O(lambda^(-1))`, then

\[
 \boxed{L\lambda^{2\eta}E_M
 =O(L\lambda^{2\eta-1})\longrightarrow0}          \tag{6.7}
\]

for every fixed `eta<1/2`.  Equations (6.3), (6.6), and (6.7) are exactly the
three schedule-dependent projective transform rates.  Hence changing the
outer cutoff from an exponential or critical scale to (0.2) loses none of
the analytic limit geometry.

## 7. The exact remaining even-line statistic

At one schedule point, abbreviate `kappa=kappa_(lambda,N)` and let `Q_+` be
the inversion-even compression of the exact complete source matrix.  Put

\[
 q=\langle\kappa,Q_+\kappa\rangle,
 \qquad
 r=\|(Q_+-qI)\kappa\|,                            \tag{7.1}
\]

and let `u` be the exact lower Ritz value in the two-vector space generated
by `kappa` and its residual.  In the nonzero-residual branch, retain

\[
 r>0,\qquad {q-u\over r}=O(1),                    \tag{7.2}
\]

together with only the even complementary gate

\[
 \boxed{
 P_{\kappa^\perp\cap\mathcal H_+}(Q_+-uI)
 P_{\kappa^\perp\cap\mathcal H_+}\succ0.}         \tag{7.3}
\]

This gate produces a simple lowest even line.  Let `g` be a unit vector on
that line, require `alpha=<kappa,g>!=0`, and use the projectively normalized
vector

\[
 x={g\over\langle\kappa,g\rangle},
 \qquad\langle\kappa,x\rangle=1.                  \tag{7.4}
\]

With `Pi_M=P_(M,+)`, set

\[
 p_M=\Pi_M\kappa,
 \qquad
 \mathcal L_M=\operatorname {Ran}\Pi_M\cap p_M^\perp.
                                                               \tag{7.5}
\]

The exact unresolved line-orientation statistic is

\[
 \boxed{
 \mathcal A_{p,N}
 =\|P_{\mathcal L_M}x\|^2
 ={\|P_{\mathcal L_M}g\|^2
       \over|\langle\kappa,g\rangle|^2}.}         \tag{7.6}
\]

The natural-cutoff bridge is closed by the convenient sufficient rate

\[
 \boxed{\mathcal A_{p,N}=O(\lambda_p^{-1}).}       \tag{7.7}
\]

The exact weaker condition is

\[
 L_p\lambda_p^{2\eta}\mathcal A_{p,N}\longrightarrow0
 \qquad\hbox{for every fixed }\eta<{1\over2}.      \tag{7.8}
\]

The superpolynomial anchor tail converts (7.7) into the `E_M` estimate used
in (6.7).  The even cross-root theorem then supplies axis-rooted finite
characteristic functions without any shifted odd sign, global finite-ground
parity, boundary normalization, or nonzero central coordinate.

None of (7.2), (7.3), the overlap in (7.4), or the decay in (7.7) follows
from HSW phase selection.  A multiple lowest even eigenspace also remains a
fail-closed branch unless a separate visible canonical-projector theorem is
invoked.

## 8. A gate-restricted `p`-average theorem is sufficient

For a dyadic odd-integer block define

\[
 \mathcal C_P=\{p:P<p\leq2P,\ p\ {\rm odd}\},      \tag{8.1}
\]

and use one fixed natural outer rule from (0.2).  Let `mathcal G_P` be the
subset on which the exact finite conditions (7.2)--(7.4) hold.  It may also
include the optional HSW phase gate (4.5), but that does not change the
argument.

The following two estimates are sufficient:

\[
 \boxed{
 |\mathcal G_P|>0,
 \qquad
 {1\over|\mathcal G_P|}
 \sum_{p\in\mathcal G_P}\mathcal A_{p,N_p}
 \leq{C_0\over P}.}                               \tag{8.2}
\]

Indeed, nonnegativity gives at least one `p` in `mathcal G_P` with

\[
 \mathcal A_{p,N_p}\leq{C_0\over P}
 =O(\lambda_p^{-1}).                              \tag{8.3}
\]

Choose the least such `p` in each cofinal dyadic block.  This gives a
deterministic schedule satisfying every retained checkpoint-0.71 hypothesis.
The exact bridge-scale replacement for the second part of (8.2) is

\[
 \log P\,P^{1-\varepsilon}
 {1\over|\mathcal G_P|}
 \sum_{p\in\mathcal G_P}\mathcal A_{p,N_p}
 \longrightarrow0
 \qquad(\varepsilon>0).                            \tag{8.4}
\]

The average must be gate-restricted.  An unrestricted average may place all
small alignment values on indices where the even complement or overlap
fails.  Conversely, a count of finite-good indices gives no information on
their alignment values.  The frozen diagonal source-Cauchy counterfamily
keeps the analogous alignment equal to `16/9` at every outer cutoff, so no
decay can follow from source-Cauchy structure, nesting, or positivity alone.
Estimate (8.2) would have to be a new actual-arithmetic theorem.

## 9. Quantifier ledger and stopping line

The unconditional schedule chain is

\[
 j\longmapsto I_j\longmapsto T_j
 \longmapsto\Gamma_{T_j}\longmapsto p_j
 \longmapsto(\lambda_{p_j},M_{p_j},N_{p_j}).       \tag{9.1}
\]

Every choice in (9.1) has a least-element or fixed-parameter rule.  It uses
no RH-selected ordinate.  It proves the optional phase inequality (4.6) and
the analytic estimates (6.2)--(6.6), but it supplies none of the finite
source conclusions in Section 7.

Accordingly there are two honest next routes:

1. work on the natural schedule and prove (7.2), (7.3), and (7.7) directly;
2. prove the gate-restricted actual-arithmetic average (8.2).

The critical-density all-`p` schedule remains available for a direct finite
attack, but the frozen HSW full-measure theorem cannot select its half-grid
points.  Checkpoint-1.54 and checkpoint-1.55 scalar conclusions do not remove
the even-line statistic (7.6) and are not imported here.

No actual finite gate or determinant limit is established.  There is no RH
claim.  The formal project state remains `P0_INVALIDATED`.
