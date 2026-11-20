# Growing signed-discrepancy Feshbach passivity-scale barrier

## 0. Exact outcome and fail-closed boundary

Use the locked schedule

\[
 \lambda={p\over2},\qquad L=2\log\lambda,\qquad
 N=2^{9600\lambda^2}.                                  \tag{0.1}
\]

The paired target audited here uses the stronger absolute-sampling shift

\[
 U=U_Z={\epsilon_\lambda\over a_{\rm src}^2},
 \qquad q=\langle\kappa,Q_+\kappa\rangle\leq U_Z,     \tag{0.1a}
\]

where `p=a_src*kappa` is the source-normalized projected anchor.  This is
not the genuinely lower two-vector Ritz shift `u<=q`.

After the exact boundary-alias main profile is removed, the complete
retained numerator has a still sharper centered form.  Put

\[
 D_\lambda(t)=\sum_{1<n\leq e^t}{\Lambda(n)\over\sqrt n}
              -2(e^{t/2}-1),                           \tag{0.2}
\]

\[
 H_{\rm tail}(t)=\int_t^\infty
 {e^{-5u/2}\over1-e^{-2u}}\,du,\qquad
 c_*=\psi(1/4)-\log\pi+4,
\]

and

\[
 g_\lambda(t)=D_\lambda(t)-H_{\rm tail}(t)-{c_*\over2}.
                                                               \tag{0.3}
\]

For either parity, every vector `y` in the actual multiplier-dangerous
space, every test vector `u` in the same space, and every Feshbach shift
`sigma>=0`, the exact numerator is

\[
 \boxed{
 \mathfrak B_{\epsilon,\sigma}(u,y)
  =(\sigma-U)\langle u,y\rangle
   +\int_0^L g_\lambda(t)
       {d\over dt}C_{u,\mathsf E_{\epsilon,\sigma}y}(t)\,dt.}
                                                               \tag{0.4}
\]

Thus at `sigma=U` the scalar vanishes exactly.  The undamped signed
derivative-transfer itself must supply the retained sign and the required
coframe scale

\[
 \beta_{\lambda,+}^{\rm mv}\gg
 {1\over\sqrt\lambda\operatorname {polylog}(\lambda)},
 \qquad \beta_{\lambda,-}^{\rm mv}>0.                 \tag{0.5}
\]

This note proves four sharp stopping lines for the currently available
routes.

1. Direct Stieltjes variation gives only `O(lambda)`.
2. The pinned PNT estimate still gives a quantity which diverges even on
   one fixed Fourier mode.  On the actual dangerous space it additionally
   meets a missing derivative-graph estimate.
3. The Laplace derivative-transfer is positive real in the unconditional
   safe half-plane `Re(s)>=1/2`.  Positive-real continuation to
   `Re(s)>0` is equivalent to the Riemann hypothesis.
4. Even granting a constant coercive causal transfer at damping `eta`,
   removal of the damping across length `L` costs `exp(eta*L)`.  The safe
   value `eta=1/2` yields only `lambda^(-1)`, below (0.5).  Reaching (0.5)
   by this route would require `eta<=1/4+O(log(L)/L)`, already an unproved
   zero-free strip.

At one fixed finite parameter the dangerous Feshbach numerator tests only a
finite, source-dependent family of correlations, so its sign does not by
itself imply global positive-real continuation.  This does **not** make the
paired target (0.5) weak along the widening schedule.  Exact Feshbach
equivalence identifies positivity of each `beta_(lambda,epsilon)^mv` with
the corresponding complete `U_Z`-shifted even-complement or odd-sector
sign.  Since `q<=U_Z`, the
paired signs imply the `q`-shifted signs, which the frozen widening-core
gate proves are already RH-level.  No density of the union of dangerous
spaces is needed for that implication.

The distinction is only about proof mechanism: global passivity is not
necessary for an individual finite Feshbach sign, while no current density
or graph theorem derives the finite restricted inf--sup from the available
global transform estimates.

No retained sign, parity-sector sign, source-angle theorem, determinant
limit, zero statement, or Riemann-hypothesis conclusion is proved.  The
formal state remains `P0_INVALIDATED`, and the standard eight are
unchanged.

## 1. Frozen inputs

Only the following exact repository bytes are used.

| Dependency | SHA-256 |
|---|---|
| `notes/GROWING_MIXED_BRIDGE_ACTUAL_MULTIPLIER_DANGEROUS_FESHBACH_REDUCTION.md` | `cc2a62d6be1c62985ab9d5e2893c74c9ae773280f6bff4015f998364ccbd924e` |
| `notes/GROWING_MULTIPLIER_DEFICIT_GEOMETRY_BOUNDARY_ALIAS_BARRIER.md` | `2e5b38892f73848b4d081de5fef45f10819bd4e7f6a8be5a4edb8f85dae11141` |
| `notes/WEIGHTED_PNT_DISCREPANCY_NORMAL_FORM.md` | `eda566d5a2867d28f5218a89a48cc95c30fe74491fb11bb74b86c7fb6ed68ac6` |
| `notes/TAIL_DISCREPANCY_TRANSVERSE_SCHUR_NORMAL_FORM.md` | `356bba54acee28d61968973558e5996589c2444843a1bf58650285e29c824fb8` |
| `notes/TAIL_DISCREPANCY_SAFE_HERGLOTZ_AND_ACTUAL_SCHUR_OBSTRUCTION.md` | `5efd87e2ff6bd21b498a1ff3d189fe252f4617c58da28d9650237763e3928341` |
| `notes/CYCLIC_MELLIN_GRAPH_PRODUCT_TRANSITION_PACKET_NONCAPTURE_BARRIER.md` | `b7e29753bb6ff4f4082a114413bf7f80b460f4c8d0a0b5e48ee73e435e2fc488` |
| `notes/Q_SHIFT_SECTOR_WEIL_CORE_GATE.md` | `78e0b9a7c3512bcd2b5fe34d48594734b6323fc57ca55db5e4090d6d6a277fb3` |
| `tests/test_q_shift_sector_weil_core_gate.py` | `714f9839b0514c779f1fc05d558dd9446654de360dd1f0cc70502cba75fa6bf2` |
| `notes/RITZ_SHIFTED_TAIL_DISCREPANCY_SCHUR_GATE.md` | `29a42b181e361c0e42dff96c636f2c5bb31a7b3814a43fec914dbfaa216bfc1e` |

The first note fixes the exact dangerous-space Feshbach numerator and the
target (0.5).  The second fixes the critical boundary alias.  The next
three fix the discrepancy normal form, the cumulative tail collapse, and
the safe positive-real identity.  The final four frozen rows fix
`q<=U_Z`, the RH-level consequence of the paired `q`-shifted signs, and
the exact transport to a genuinely lower Ritz shift.  Section 7 also
audits the current
primary-source theorem of Grigutis--Turcinskas,
[arXiv:2509.18963](https://arxiv.org/abs/2509.18963), v1 submitted
September 23, 2025.  That paper is not treated as a frozen repository dependency, and no
source-lock or standard-eight file is changed.

## 2. Exact centering and parity-pole cancellation

For zero-extended source vectors put

\[
 K_tf(x)=\widetilde f(x+t)+\widetilde f(x-t),\qquad
 C_{u,w}(t)=\langle u,K_tw\rangle.                    \tag{2.1}
\]

Then

\[
 C_{u,w}(0)=2\langle u,w\rangle,\qquad C_{u,w}(L)=0.
                                                               \tag{2.2}
\]

The harmonic lift has first coordinate `y` and its other coordinate lies
orthogonally to the dangerous space.  Hence, with
`w=mathsf E_(epsilon,sigma)y`,

\[
 \langle u,w\rangle=\langle u,y\rangle.              \tag{2.3}
\]

The exact tail-discrepancy form and (2.2) give

\[
\begin{aligned}
 &(c_*+\sigma-U)\langle u,y\rangle
 +\int_0^L\{D_\lambda(t)-H_{\rm tail}(t)\}C_{u,w}'(t)\,dt\\
 &\quad=(\sigma-U)\langle u,y\rangle
 +\int_0^Lg_\lambda(t)C_{u,w}'(t)\,dt,
\end{aligned}                                         \tag{2.4}
\]

which proves (0.4).  The scalar disappears because

\[
 {c_*\over2}\int_0^LC_{u,w}'(t)\,dt
 =-c_*\langle u,y\rangle.                             \tag{2.5}
\]

There is no unused parity-pole reserve in (2.4).  Before centering, the
exact identities are

\[
 P_+-K_+=K_-\quad\hbox{on the even sector},\qquad
 P_--K_+=K_-\quad\hbox{on the odd sector}.            \tag{2.6}
\]

Together with the continuous weighted-prime main and the first
archimedean Levy summand, both identities give the same scalar `c_*` and
tail form.  Adding a positive even pole after (2.4) would count it twice;
the odd pole has also already been retained with its negative sign.

The tail alone supplies no replacement floor.  On every fixed odd Fourier
prefix its form is `O(L^(-2))`.  On the normalized even constant, boundary
killing is `O(L^(-1))`.  Accordingly the comparison `D_lambda=0` has
unbounded negative index as `L` grows.  The actual signed discrepancy must
provide a leading orientation, not a small perturbative correction.

## 3. Direct Stieltjes scale

As a signed measure on `[0,L]`,

\[
 dD_\lambda(t)=
 \sum_{1<n\leq\lambda^2}{\Lambda(n)\over\sqrt n}
       \delta_{\log n}(dt)-e^{t/2}\,dt.               \tag{3.1}
\]

The atomic and continuous parts are mutually singular.  Therefore its
total variation is exactly

\[
\begin{aligned}
 \|dD_\lambda\|_{\rm TV}
 &=W(\lambda^2)+2(\lambda-1)\\
 &=4(\lambda-1)+D_\lambda(L)
  =(4+o(1))\lambda.
\end{aligned}                                         \tag{3.2}
\]

Since `||K_t||<=2`, direct Stieltjes estimation gives

\[
 |\langle u,T_Dw\rangle|
 \leq2\|dD_\lambda\|_{\rm TV}\|u\|\|w\|
 =O(\lambda)\|u\|\|w\|.                            \tag{3.3}
\]

This loses a factor `lambda` against a constant-scale retained short.  If
it is used as an adverse perturbation at the coframe scale (0.5), the ratio
of (3.3) to the target is

\[
 \lambda^{3/2}\operatorname {polylog}(\lambda).       \tag{3.4}
\]

Equation (3.3) is uniform in the Fourier cutoff, but it destroys the signed
prime-versus-continuous cancellation.

## 4. PNT magnitude and the missing graph norm

Let

\[
 E(X)=\sum_{n\leq X}\Lambda(n)-X.
\]

Partial summation gives the exact identity

\[
 D_\lambda(t)=1+e^{-t/2}E(e^t)
 +{1\over2}\int_0^tE(e^u)e^{-u/2}\,du.               \tag{4.1}
\]

The pinned PNT estimate has constants

\[
 {|E(e^t)|\over e^t}
 \leq9.22022\,t^{3/2}e^{-\alpha\sqrt t},
 \qquad \alpha=0.8476836                              \tag{4.2}
\]

in its admitted range.  Since the logarithmic derivative of
`e^(t/2)t^(3/2)e^(-alpha*sqrt(t))` is eventually at least `1/4`, (4.1)
and (4.2) imply

\[
 |D_\lambda(t)|
 \leq C e^{t/2}(1+t)^{3/2}e^{-\alpha\sqrt t},         \tag{4.3}
\]

and

\[
 \int_0^L|D_\lambda(t)|\,dt
 \leq C\lambda L^{3/2}e^{-\alpha\sqrt L}.            \tag{4.4}
\]

This does not reach a constant even on one fixed source mode.  For the
normalized mode `V_n`,

\[
 C_{V_n,V_n}(t)=2\left(1-{t\over L}\right)
       \cos {2\pi nt\over L},                         \tag{4.5}
\]

so

\[
 \|C_{V_n,V_n}'\|_\infty
 \leq{2+4\pi|n|\over L}.                              \tag{4.6}
\]

Equations (4.4)--(4.6) give, for every fixed `n`,

\[
 \left|\int_0^LD_\lambda(t)C_{V_n,V_n}'(t)\,dt\right|
 \leq C_n\lambda\sqrt L\,e^{-\alpha\sqrt L}.         \tag{4.7}
\]

The right side diverges because `lambda=e^(L/2)`.  Relative to (0.5), its
scale is

\[
 \lambda^{3/2}\sqrt L\,
 e^{-\alpha\sqrt L}\operatorname {polylog}(\lambda).
                                                               \tag{4.8}
\]

For completeness, on the full Fourier space `E_N`, differentiation and
the endpoint evaluation bound give

\[
 \|C_{u,w}'\|_\infty
 \leq {4\pi N+4N+2\over L}\|u\|\|w\|.               \tag{4.9}
\]

Indeed the two bulk derivatives cost `4*pi*N/L`, and the two moving
overlap endpoints cost `2*(2N+1)/L`.  Thus the available graph estimate
turns (4.7) into

\[
 O\!\left(N\lambda\sqrt L e^{-\alpha\sqrt L}\right).
                                                               \tag{4.10}
\]

At the locked cutoff in (0.1), this is astronomical.  The
multiplier-dangerous rank bound `exp(O(lambda))` does not improve (4.9):
dimension does not constrain which Fourier frequencies a subspace uses.
Even replacing `N` by the strongest available high-coercivity threshold
`exp(O(lambda*log(lambda)))` does not close (4.10).  A useful integration
by parts therefore requires a new graph localization theorem for the
actual dangerous projector as well as signed cancellation beyond (4.3).

## 5. Exact positive-real boundary

Let

\[
 \Xi_c(s)=\xi(1/2+s),\qquad
 H(s)={\Xi_c'(s)\over\Xi_c(s)}.                       \tag{5.1}
\]

The global centered discrepancy satisfies

\[
 \boxed{
 \int_0^\infty g_\infty(t)e^{-st}\,dt
 =-{1\over s}H(s),\qquad \Re s>{1\over2}.}           \tag{5.2}
\]

Thus `H=-s*L(g_infty)` is the causal derivative-transfer.  The sign and
zero-orbit convention can be checked without an Euler-product estimate.
The functional equation makes `Xi_c` even.  Choose one centered zero
`z_p` from each `+-` orbit, with multiplicity.  Since the inverse squares
are summable, the paired Hadamard product gives

\[
 H(s)=\sum_{\mathfrak p}
 \left({1\over s-z_{\mathfrak p}}
       +{1\over s+z_{\mathfrak p}}\right),            \tag{5.3}
\]

locally normally away from the zeros.  Write
`s=sigma+i*tau` and `z_p=beta+i*gamma`.  Every nontrivial zero lies in the
open critical strip, so `|beta|<1/2`.  Hence, for `sigma>=1/2`,

\[
\begin{aligned}
 \Re\left({1\over s-z_{\mathfrak p}}
          +{1\over s+z_{\mathfrak p}}\right)
 ={}&{\sigma-\beta\over
       (\sigma-\beta)^2+(\tau-\gamma)^2}\\
 &+{\sigma+\beta\over
       (\sigma+\beta)^2+(\tau+\gamma)^2}>0.
\end{aligned}                                         \tag{5.4}
\]

Normal convergence proves

\[
 \boxed{\Re H(s)>0\qquad(\Re s\geq1/2).}             \tag{5.5}
\]

### Theorem 5.1 (positive-real continuation is exactly RH)

The following are equivalent.

\[
\begin{array}{ll}
 {\rm (i)}&H\hbox{ is holomorphic and positive real on }\Re s>0;\\
 {\rm (ii)}&\Re\rho=1/2\hbox{ for every nontrivial zero }\rho.
\end{array}                                           \tag{5.6}
\]

**Proof.**  Under (ii), every centered zero is `z_p=i*gamma`.  Each term
in (5.3) then has real part

\[
 {\sigma\over\sigma^2+(\tau-\gamma)^2}
 +{\sigma\over\sigma^2+(\tau+\gamma)^2}>0           \tag{5.7}
\]

for `sigma>0`; normal convergence proves (i).  Conversely, a centered zero
with positive real part is a pole of the logarithmic derivative in the
right half-plane, with its positive multiplicity as residue.  It cannot be
cancelled by another zero.  Holomorphy in (i) excludes it.  If a centered
zero had negative real part, functional-equation symmetry would place its
negative in the right half-plane.  Thus every centered zero is imaginary,
which is (ii).  `square`

The word `holomorphic` in (5.6) is essential.  Positivity asserted only at
isolated points away from poles is not a positive-real transfer theorem.

## 6. Damping loss at the required scale

The scale loss can be recorded independently of any unproved coercivity.
Let `V_0` be a causal convolution on an interval of length `L`, and let
`V_eta` be obtained by multiplying its causal kernel by `e^(-eta*t)`.
With `M_eta f(x)=e^(eta*x)f(x)` on `[0,L]`,

\[
 V_\eta=M_{-\eta}V_0M_\eta,
 \qquad V_0=M_\eta V_\eta M_{-\eta}.                 \tag{6.1}
\]

Consequently, even if one grants the optimistic estimate

\[
 \|V_\eta f\|\geq c\|f\|                             \tag{6.2}
\]

with an absolute `c>0`, (6.1) gives only

\[
 \|V_0f\|\geq c e^{-\eta L}\|f\|.                   \tag{6.3}
\]

At the unconditional safe damping `eta=1/2`,

\[
 e^{-\eta L}=e^{-L/2}=\lambda^{-1}.                  \tag{6.4}
\]

This is smaller than the target in (0.5) by
`sqrt(lambda)/polylog(lambda)`.  For (6.3) to reach (0.5), it is necessary
that

\[
 \eta\leq{1\over4}+O\!\left({\log L\over L}\right).
                                                               \tag{6.5}
\]

A causal positive-real proof at such a damping requires `H` to be
holomorphic in the corresponding right half-plane.  At `eta=1/4+o(1)`
this already excludes centered zeros with real part larger than
`1/4+o(1)`, equivalently zeta zeros with real part larger than
`3/4+o(1)`.  That zero-free strip is not available.  Taking `eta` to every
positive value reaches the exact equivalence (5.6).

There is an additional structural loss: the source form is the sum of a
causal Volterra operator and its adjoint.  The two summands in the
undamped form are conjugated by opposite exponential weights, so (6.1) is
not a common positive congruence for their sum.  Thus (6.3) is an
optimistic one-sided scale audit, not a proved lower bound for (0.4).

## 7. Frequency-dependent damping does not close the inf--sup

Grigutis--Turcinskas prove the following lower bound.  In the original
zeta coordinate `s=sigma+i*T`, if

\[
 T>3.11\,10^{10},\qquad
 {1\over2}+{1\over\sqrt{\log T}}<\sigma<1,            \tag{7.1}
\]

then the contribution of the zeros known to lie on the critical line
satisfies

\[
 \Re\sum_{\rho=1/2+i\gamma}{1\over s-\rho}
 >{(0.28-\varepsilon(T))c\over\sigma-1/2},
 \qquad \varepsilon(T)=O\!\left({\log\log T\over\log T}\right),
                                                               \tag{7.2}
\]

where `c` is an admitted lower proportion of zeros on the critical line.
At the centered damping

\[
 \eta(T)=\sigma-{1\over2}\asymp{1\over\sqrt{\log T}}, \tag{7.3}
\]

the lower bound in (7.2) is of order `sqrt(log(T))`.  For a high-frequency
block with `log(T) asymp lambda^2`, the formal conjugation loss
`e^(eta(T)*L)` is only `e^(O(L/lambda))`.  Thus (7.2) genuinely improves
the one-sided damping scale for the **critical-line part** of the
transfer.

It does not sign the complete transfer.  A hypothetical off-line quartet
has, at height `gamma`, the centered functional pair `delta+i*gamma` and
`-delta+i*gamma`.  On the line `s=eta+i*T` its complete same-height real
part is

\[
 P_{\eta,\delta}(T-\gamma)
 ={\eta-\delta\over(\eta-\delta)^2+(T-\gamma)^2}
 +{\eta+\delta\over(\eta+\delta)^2+(T-\gamma)^2}.
                                                               \tag{7.4}
\]

When `eta<delta`, the value at the zero height is

\[
 P_{\eta,\delta}(0)
 ={1\over\eta-\delta}+{1\over\eta+\delta}
 =-{2\eta\over\delta^2-\eta^2},                    \tag{7.5}
\]

which is negative and still diverges as `delta` decreases to `eta`.  Thus
the same-height functional partner weakens but does not cancel the
negative well.  The other same-height pair at `-gamma` is far from
`T=gamma`; including it does not remove the local divergence.  The
positive lower bound (7.2) contains only critical-line zeros and supplies
no pointwise upper bound for the sum of these negative off-line wells.

Finite-window smearing removes the point singularity but leaves a sharp
scale loss.  Indeed, with the Fourier-transform convention used for a
Fejer kernel of source length `L`, the pair in (7.4) has multiplier

\[
 \widehat P_{\eta,\delta}(x)
 =\pi\{-e^{-(\delta-\eta)|x|}+e^{-(\delta+\eta)|x|}\},
 \qquad \delta>\eta.                                  \tag{7.6}
\]

For `|x|<=L`, its magnitude is at most `2*pi*eta*|x|`.  Consequently a
normalized Fejer smearing over that window bounds the adverse contribution
of each complete same-height pair by

\[
 {1\over2\pi}\int_{-L}^L
   |\widehat P_{\eta,\delta}(x)|\,dx
 =O(\eta L^2).                                       \tag{7.7}
\]

The standard local count still permits `O(log(T))` off-line zeros near a
height `T`.  Bounding all of their adverse contributions by (7.7) gives
only `O(eta*L^2*log(T))`, whereas the critical-line lower bound (7.2) is
`Omega(1/eta)`.  At `eta=1/sqrt(log(T))`, comparison of the available
upper and lower bounds loses an unresolved factor `O(L^2)`.  Thus even after
functional pairing and Fejer smearing, current local-count or zero-density
information does not prove domination by the critical-line contribution.

More generally, zero-density estimates control the number of off-line
zeros in averaged rectangles.  They do not give the pointwise lower bound,
or the projector-averaged sign required by the smallest singular value in
(0.5).  This distinction is especially sharp here: the
multiplier-dangerous projector is selected by the deficit and may
concentrate on exceptional frequency bands.  No frozen uncertainty or
graph theorem proves that its spectral mass avoids the off-line wells.

There is also no single variable-damping Volterra conjugation.  The curve

\[
 T\longmapsto H(\eta(T)+iT)                            \tag{7.8}
\]

is not the boundary value on one vertical line, and hence is not generated
by multiplying one causal kernel by `e^(-eta*t)`.  Freezing `eta(T)` on
dyadic frequency blocks introduces cross-block terms and commutators with
the actual dangerous projector.  Those terms require precisely the graph
localization missing in (4.9)--(4.10).  The theorem also begins only above
the height in (7.1), leaving the unrestricted low-frequency part.

Therefore the current frequency-dependent result does not improve the
actual retained inf--sup.  It identifies a potentially strong positive
component, but a successful use would still need both a pointwise or
projector-averaged off-line-zero bound and a variable-damping
Littlewood--Paley theorem for the source-defined dangerous space.

## 8. Fixed finite restriction versus widening-schedule strength

Theorem 5.1 concerns the derivative-transfer on the full causal test
space.  The actual Feshbach constant uses only correlations

\[
 C_{u,\mathsf E_{\epsilon,\sigma}y}',qquad
 u,y\in\mathcal Y_\epsilon,                           \tag{8.1}
\]

where `mathcal Y_epsilon` is a finite source-defined spectral subspace.  A
single finite sign in (8.1) need not imply that `H` is positive real on a
half-plane.  Hence failure of the global passivity route does not disprove
a source-specific finite Feshbach proof.

The finite test is nevertheless not an arbitrary positive compression.
The safe multiplier block is restored by the exact harmonic lift and
Schur complement.  At every finite parameter the frozen theorem gives

\[
 \beta_{\lambda,+}^{\rm mv}>0\Longleftrightarrow
 B_+=P_{\kappa^\perp}(Q_+-U_Z I)P_{\kappa^\perp}>0,
                                                               \tag{8.2}
\]

\[
 \beta_{\lambda,-}^{\rm mv}>0\Longleftrightarrow
 B_-=Q_--U_Z I>0.                                     \tag{8.3}
\]

Because `q<=U_Z`, the paired signs imply

\[
 P_{\kappa^\perp}(Q_+-qI)P_{\kappa^\perp}
 =B_++(U_Z-q)I>0,                                    \tag{8.4}
\]

\[
 Q_--qI=B_-+(U_Z-q)I>0.                              \tag{8.5}
\]

On the admitted widening source core, (8.4)--(8.5) imply the global Weil
criterion and are therefore RH-level.  Thus the paired `U_Z` target along
the schedule is already RH-strength; density of the dangerous spaces is
not needed to obtain that consequence.  The genuinely lower Ritz shift
`u<=q` is different and is not the target in (0.5).

### The genuinely lower Ritz route

Write the lower two-vector Ritz shift as `u_R` to distinguish it from a
test vector, and put

\[
 t_R=q-u_R\geq0.                                     \tag{8.6}
\]

The centering argument in Section 2 uses only the scalar shift and the
endpoint identities.  It therefore transfers verbatim to any admitted
lower shift, with the corresponding safe block and harmonic lift:

\[
 \boxed{
 \mathfrak B^{(u_R)}_{\epsilon,\sigma}(v,y)
  =(\sigma-u_R)\langle v,y\rangle
   +\int_0^L g_\lambda(t)
       C'_{v,\mathsf E^{(u_R)}_{\epsilon,\sigma}y}(t)\,dt.}
                                                               \tag{8.7}
\]

If `u_R>=0`, the value `sigma=u_R` is included in the infimum over
`sigma>=0`, and the scalar in (8.7) again vanishes exactly.  In particular,
although the coefficient at `sigma=q` contains the positive reserve
`q-u_R=t_R` when `q>=0`, that reserve cannot improve a uniform-in-`sigma`
estimate: the centered value `sigma=u_R` removes it.  The Stieltjes,
pinned-PNT, graph, Hilbert/passivity, and damping-loss ledgers in Sections
3--7 then apply with exactly the same scales.

At the endpoint Schur level, Ritz lowering is nevertheless a genuine
finite-dimensional improvement.  The frozen exact transport is

\[
 B_{u_R}=B_q+t_RI,\qquad a_{u_R}=a_q+t_R,\qquad
 c_{u_R}=c_q,                                        \tag{8.8}
\]

and, with residual norm `r` and `d_R=c_R-q>0`,

\[
 t_R={\sqrt{d_R^2+4r^2}-d_R\over2},qquad
 {r^2\over d_R+r}\leq t_R\leq
 \min\left\{r,{r^2\over d_R}\right\}.             \tag{8.9}
\]

Thus `t_R` may be second order, comparable to `r^2/d_R`, and it is zero
when `r=0`.  No frozen schedule estimate puts it at a positive constant or
at the coframe scale in (0.5), let alone at the `O(lambda)` Stieltjes scale
or above the divergent PNT and graph bounds.  If `u_R<0`, the centering
point lies outside `sigma>=0` and (8.7) retains the scalar `-u_R` at
`sigma=0`; however, no bound proves that this scalar dominates the adverse
signed transfer, and (8.9) gives no such lower scale.  Hence this case is
also open rather than closed by the reserve.

The lower-Ritz sector signs can therefore hold when the stronger
`q`-shifted signs fail, and are the only individually weaker sign route
considered here.  Without additional control forcing the lowering to
vanish on the widening core, those signs alone do not trigger the frozen
RH-level `q`-shift gate.

Density and graph localization would be needed only for a proposed route
that derives (8.2)--(8.3) from a global transform or magnitude estimate.
The rank estimate for `mathcal Y_epsilon` supplies neither.  Conversely,
the independently assembled actual-source witness in the safe-Herglotz
note shows that global safe passivity, positive diagonal directions, and a
positive transverse compression do not by themselves imply the live-shift
Schur inequality.

The earliest viable new lemma remains the exact RH-strength restricted,
undamped, signed-discrepancy inf--sup

\[
 \beta_{\lambda,+}^{\rm mv}\gg
 (\sqrt\lambda\operatorname {polylog}\lambda)^{-1}
 \quad\hbox{and}\quad \beta_{\lambda,-}^{\rm mv}>0, \tag{8.10}
\]

or an equivalent constant-scale inverse-leverage bound for the retained
short.  Sections 3--7 show why Stieltjes variation, the pinned PNT
magnitude, an unlocalized derivative graph norm, safe-half-plane
passivity, and the current frequency-dependent critical-line estimate do
not prove it.

## 9. Reproduction

Run

    python3 -B -m unittest \
      tests.test_growing_signed_discrepancy_feshbach_passivity_scale_barrier -v

The regression checks the frozen inputs, exact centering, total-variation
scale, the fixed-mode and graph PNT losses, zero-orbit positive-real signs,
the causal damping similarity and half-exponent loss, the
frequency-dependent critical-line/off-line split, restricted-space claim
boundary, displayed TeX, and ASCII hygiene.
