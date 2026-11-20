# Actual-source anchored routing: vertex obstruction and critical-line bottleneck

## 0. Claim boundary

This note isolates the first scalar inequalities that any successful
actual-source contractive-routing theorem must prove.  For the central vertex,
the necessary inequality is exactly a signed covariance of the projected
prolate anchor with the already-combined weighted-PNT discrepancy.  No pole,
archimedean, or prime term is bounded separately.

An exact unbounded source-Cauchy countermodel then shows that projection
convergence, the admitted fixed-mode anchor direction, arbitrarily small
combined displacement coefficients, and even a connected positive graph do
not imply contractive routing.  The countermodel is deliberately assembled
only at the final combined-displacement level.  It is not the pinned
pole--archimedean--minus-prime source and makes no assertion about the sign of
the actual arithmetic matrices.

No actual-source vertex inequality, positive-graph connectivity, routing
contraction, finite real-rootedness, or Riemann-hypothesis conclusion is
proved here.  The project state remains `P0_INVALIDATED`.

The binding conventions are those of `P0_SOURCE_LOCK.json` and
`P0_NORMALIZATION_AUDIT.md`.  In particular,

\[
 L=2\log\lambda,
 \qquad
 \widehat f(z)=\int_{-L/2}^{L/2}f(t)e^{-izt}\,dt,
 \qquad JV_n=V_{-n},                                      \tag{0.1}
\]

Lebesgue measure, zero extension, every prime power
\(1<n\leq\lambda^2\), and the minus sign of the prime block are retained.

## 1. The actual combined weighted-Loewner graph

Use the untranslated interval `[0,L]` and write the real projected even
anchor as

\[
 f_N(t)={1\over\sqrt L}
 \left(x_0+2\sum_{n=1}^Nx_n\cos{2\pi nt\over L}\right).    \tag{1.1}
\]

Thus its normalized-even coordinates and the weighted-Loewner anchor
coordinates are

\[
 \kappa_0=x_0,
 \qquad \kappa_n=\sqrt2x_n,
 \qquad p_0=x_0,
 \qquad p_n=2x_n\quad(n\geq1).                    \tag{1.2}
\]

For the complete source displacement coefficients put

\[
 t_0=c_0=0,
 \qquad t_n=n^2,
 \qquad c_n=nb_n.                                 \tag{1.3}
\]

The exact anchored weights are

\[
 \boxed{
 w_{ij}=-p_ip_j{c_i-c_j\over t_i-t_j}
 \quad(i\ne j).}                                  \tag{1.4}
\]

Equivalently,

\[
 w_{0n}=-2{b_n\over n}x_0x_n,                    \tag{1.5}
\]

\[
 w_{nm}=-4{nb_n-mb_m\over n^2-m^2}x_nx_m
 \quad(n,m\geq1,\ n\ne m).                      \tag{1.6}
\]

Every `b_n` in (1.3)--(1.6) is the final combined
pole--archimedean--minus-prime coefficient.  The source diagonal has already
cancelled from the forced form.

## 2. The first necessary actual-source inequalities

Let

\[
 d_i=\sum_{j\ne i}w_{ij}=(L_w)_{ii}.              \tag{2.1}
\]

Assume `N>=1`.  If

\[
 L_w\succeq0,
 \qquad \ker L_w=\mathbb C\mathbf1,              \tag{2.2}
\]

then

\[
 \boxed{d_i>0\quad(0\leq i\leq N).}             \tag{2.3}
\]

Indeed, `e_i` is not constant when `N>=1`, so its quadratic energy under
(2.2) is strictly positive.  This elementary vertex condition is a separate
scalar necessary test: it is neither implied by positive-graph connectivity
nor sufficient for that connectivity, and it is much weaker than the full
collective routing contraction.  Failure of one `d_i` nevertheless ends the
route immediately.
For the separate one-vertex branch `N=0`, there are no edges,
`L_w=(0)`, and `d_0=0`; (2.3) is not asserted in that branch.

### Theorem 2.1 (central vertex as one signed source covariance)

Define the right-continuous weighted discrepancy and the pole-cancelled
archimedean tail by

\[
 D_\lambda(t)=
 \sum_{1<n\leq e^t}{\Lambda(n)\over\sqrt n}
 -2(e^{t/2}-1),                                   \tag{2.4}
\]

\[
 \tau(t)={e^{-5t/2}\over1-e^{-2t}},
 \qquad
 H_{\rm tail}(t)=\int_t^\infty\tau(u)\,du,        \tag{2.5}
\]

and retain their already-combined primitive

\[
 F_{\rm align}(t)=D_\lambda(t)-H_{\rm tail}(t).  \tag{2.6}
\]

With

\[
 G_\lambda(t)=e^t-\psi_C(e^t)
 -{1\over2}\log(1-e^{-2t}),                      \tag{2.7}
\]

the exact signed relations are

\[
 dF_{\rm align}=dD_\lambda+\tau(t)\,dt
 =-e^{-t/2}dG_\lambda(t),                        \tag{2.8}
\]

\[
 b_n=\lim_{\epsilon\downarrow0}{1\over\pi}
 \int_{[\epsilon,L]}
 \sin{2\pi nt\over L}\,dF_{\rm align}(t).      \tag{2.9}
\]

Then the central vertex degree is exactly

\[
 \boxed{
 d_0=-2x_0\sum_{n=1}^N{b_nx_n\over n}
 ={2x_0\over\sqrt L}\int_0^L
 F_{\rm align}(t)
 \left(f_N(t)-{x_0\over\sqrt L}\right)dt.}      \tag{2.10}
\]

Consequently, once the admitted fixed-mode theorem gives `x_0>0`, a
necessary actual-source inequality is

\[
 \boxed{
 \int_0^L F_{\rm align}(t)
 \left(f_N(t)-{x_0\over\sqrt L}\right)dt>0.}     \tag{2.11}
\]

**Proof.**  Put

\[
 P_N(t)=\int_0^t
 \left(f_N(u)-{x_0\over\sqrt L}\right)du
 ={\sqrt L\over\pi}\sum_{n=1}^N{x_n\over n}
       \sin{2\pi nt\over L}.                    \tag{2.12}
\]

Thus `P_N(0)=P_N(L)=0`.  Near zero,
`F_align(t)=O(1+|log t|)` and `P_N(t)=O(t)`, so

\[
 \boxed{P_N(t)F_{\rm align}(t)\longrightarrow0
 \quad(t\downarrow0).}                            \tag{2.12a}
\]

All Stieltjes integrals at zero in (2.9) and below mean improper
`epsilon downarrow 0` limits.  Substitute (2.9), interchange the finite sum
and the Stieltjes integral, and integrate by parts on `[epsilon,L]`:

\[
 \sum_{n=1}^N{b_nx_n\over n}
 ={1\over\sqrt L}\lim_{\epsilon\downarrow0}
   \int_{[\epsilon,L]}P_N\,dF_{\rm align}
 =-{1\over\sqrt L}\lim_{\epsilon\downarrow0}\int_\epsilon^L
 F_{\rm align}(t)
 \left(f_N(t)-{x_0\over\sqrt L}\right)dt.       \tag{2.13}
\]

Equation (2.12a) kills the improper lower boundary term, while
`P_N(L)=0` kills the upper one exactly.  The last integrand in (2.13) is
improperly integrable because its first factor is logarithmic and its second
factor is bounded.  Equations (1.5), (2.1), and (2.13) prove (2.10).
\(\square\)

The covariance in (2.11) is not signed by an absolute PNT envelope.  Such
an envelope discards precisely the arithmetic cancellation that remains in
`F_align`.

### Corollary 2.2 (first alternating vertex)

The next degree has the exact form

\[
 \boxed{
 d_1=-2x_1\left{
 b_1x_0+2\sum_{m=2}^Nx_m
 {b_1-mb_m\over1-m^2}\right}.}                  \tag{2.14}
\]

The admitted fixed-mode anchor asymptotic gives `x_1<0` eventually.
Therefore even the vertex test at `1` requires the new signed inequality

\[
 \boxed{
 b_1x_0+2\sum_{m=2}^Nx_m
 {b_1-mb_m\over1-m^2}>0.}                        \tag{2.15}
\]

Neither the bound on `|b_n|`, the logarithmic source diagonal, nor a small
unweighted residual norm proves (2.15).

## 3. Exact truncated critical-line form of the displacement

The same obstruction can be seen before any graph split.  Put

\[
 \delta_*(t)=e^{-t}G_\lambda(t),
 \qquad a_n={2\pi n\over L},                      \tag{3.1}
\]

and, for finite `L`, define the entire truncated transform

\[
 D_L(z)=\int_0^L\delta_*(t)e^{-zt}\,dt.           \tag{3.2}
\]

Because the sine vanishes at both endpoints, the complete source normal
form gives

\[
\begin{aligned}
 b_n
 &= {1\over\pi}\int_0^L
 G_\lambda(t)d\left(e^{-t/2}\sin(a_nt)\right)\\
 &= {1\over\pi}\int_0^L e^{t/2}\delta_*(t)
 \left(a_n\cos(a_nt)-{1\over2}\sin(a_nt)\right)dt.
                                                               \tag{3.3}
\end{aligned}
\]

Equivalently,

\[
 \boxed{
 b_n={1\over\pi}\operatorname {Re}
 \left\{(a_n+i/2)D_L(-1/2-ia_n)\right\}.}        \tag{3.4}
\]

For the infinite transform define, in the proved absolutely convergent
half-plane `Re(z)>0`,

\[
 D(z)=\int_0^\infty\delta_*(t)e^{-zt}\,dt.         \tag{3.4a}
\]

Define the completed function and its critical-line restriction by

\[
 \xi_R(s)={1\over2}s(s-1)\pi^{-s/2}
              \Gamma(s/2)\zeta(s),
 \qquad
 \Xi(a)=\xi_R(1/2+ia).                            \tag{3.4b}
\]

In that half-plane, the locked completed-logarithmic-derivative identity is

\[
 (z+1)D(z)={\xi_R'\over\xi_R}(z+1)
 +1+{\gamma\over2}+{1\over2}\log\pi.             \tag{3.5}
\]

Formally continuing (3.5) to `z=-1/2-ia` would turn (3.4) into

\[
 b(a)=-{1\over\pi}{\Xi'(a)\over\Xi(a)}.          \tag{3.6}
\]

Equation (3.6) is **not** asserted as a limit theorem here.  The original
point `z=-1/2-ia` lies outside the proved absolutely convergent domain
`Re(z)>0`; no equality between the finite `D_L` and the meromorphic
continuation of `D` has been established there.  The continued logarithmic
derivative also has poles at zeros of `Xi`.  A valid argument must control
the finite truncation jointly with the vanishing anchor coordinate; it may
not substitute the meromorphic continuation for `D_L`.  This is why the
available integrable combined-kernel bound does not sign (2.11) or (2.15).

## 4. Unbounded connected-routing countermodel

The following countermodel is sharper than a fixed-rank source-Cauchy
fixture: its dimension tends to infinity, its anchor has exactly the
admitted fixed-mode direction, its positive graph is connected, and its
collective routing overload stays bounded away from one.

### Theorem 4.1 (arbitrarily small combined displacement still overloads)

Let `L_r` and `N_r` tend to infinity, with `N_r>=3`, and let all displayed
raw anchor coordinates be nonzero.  Assume, for a constant `C>0`,

\[
 \sqrt{L_r}(x_0,x_1,x_2,x_3)
 \longrightarrow C(1,-1,1,-1).                  \tag{4.1}
\]

This is the admitted fixed-mode direction of the source-normalized prolate
anchor.  Put `p_0=x_0` and `p_n=2x_n` as in (1.2).  Let
`epsilon_r>0` be arbitrary, even tending to zero faster than any prescribed
rate.  The anchors may, in particular, be taken from an admitted
projection-convergent schedule only when that schedule also satisfies the
simultaneous all-coordinate nonvanishing assumption made at the start of
this theorem.  Fixed-mode convergence alone does not supply that assumption.
The construction below changes only the synthetic combined displacement.
Define combined Loewner data by

\[
 c_0=0,
 \qquad c_1=\varepsilon_r,
 \qquad c_2=-2\varepsilon_r,                     \tag{4.2}
\]

\[
 c_j=\varepsilon_r+\delta_j\quad(3\leq j\leq N_r),
 \qquad b_j={c_j\over j}.                        \tag{4.3}
\]

Choose each nonzero `delta_j` with

\[
 \operatorname {sign}\delta_j=\operatorname {sign}p_j,
 \qquad 0<|\delta_j|<\varepsilon_r/2,             \tag{4.4}
\]

and small enough that

\[
 T_r:=(-p_1)\sum_{j=3}^{N_r}
 {|p_j\delta_j|\over j^2-1}
 =o(\varepsilon_r/L_r).                          \tag{4.5}
\]

Such a choice always exists because the set of displayed coordinates is
finite at each `r`.  Extend by `b_(-j)=-b_j` and choose arbitrary even raw
diagonal coefficients.  This is an exact real inversion-symmetric
source-Cauchy family, with
`max_(1<=j<=N_r)|b_j|<=epsilon_r`.

For all sufficiently large `r`, its positive-edge graph is connected, but

\[
 \boxed{d_1<0}                                    \tag{4.6}
\]

and hence the anchored form is indefinite.  Moreover, if
`S=B_+^dagger B_-` is the minimum-norm routing through the connected
positive graph, then

\[
 \boxed{
 \liminf_{r\to\infty}\|S\|_{\rm op}^2\geq2.}    \tag{4.7}
\]

**Proof.**  Equations (1.4) and (4.2)--(4.3) give

\[
 w_{01}=-\varepsilon_rp_0p_1>0,
 \qquad
 w_{12}=\varepsilon_rp_1p_2<0,                   \tag{4.8}
\]

and, for every `j>=3`,

\[
 w_{1j}=-p_1p_j{\delta_j\over j^2-1}>0.          \tag{4.9}
\]

Thus vertex `0` is positively joined to `1`, and every vertex `j>=3` is
positively joined to `1`.  Since `p_2>0`, `p_3<0`, and
`c_2<c_3`, one also has `w_(23)>0`; hence vertex `2` joins the same positive
component.  The positive graph is connected.

At vertex `1`, (4.8)--(4.9) give exactly

\[
 d_1=\varepsilon_rp_1(p_2-p_0)+T_r.              \tag{4.10}
\]

By (4.1),

\[
 {L_r\over\varepsilon_r}
 \varepsilon_rp_1(p_2-p_0)\longrightarrow-2C^2. \tag{4.11}
\]

Equations (4.5), (4.10), and (4.11) prove (4.6).

Take the trial vector `e_1`.  Its negative and positive graph energies are

\[
 E_-(e_1)=-w_{12},
 \qquad E_+(e_1)=w_{01}+T_r.                     \tag{4.12}
\]

Since `B_-=B_+S`,

\[
 \|S\|_{\rm op}^2
 \geq {\|B_-^*e_1\|^2\over\|B_+^*e_1\|^2}
 ={E_-(e_1)\over E_+(e_1)}\longrightarrow2.     \tag{4.13}
\]

This proves (4.7).  \(\square\)

Multiplying every `c_j` and `delta_j` by a common positive scalar multiplies
both `L_+` and `L_-` by that scalar and leaves the routing norm unchanged.
Thus no upper bound on the magnitude of the final combined `b_n`, however
small, can imply contraction.

The diagonal coefficients cannot repair the example: they cancel from the
forced graph.  In fact, for any chosen scalar `q`, one may choose the even
diagonal entries by

\[
 A_{ii}=q-\sum_{j\ne i}A_{ij}{\kappa_j\over\kappa_i},       \tag{4.14}
\]

and then choose the raw diagonal by `a_0=A_(00)` and
`a_n=A_(nn)-b_n/n`.  This makes `A*kappa=q*kappa` exactly while leaving the
same failed graph.  Hence even zero residual does not imply the routing
inequality.

Theorem 4.1 is a structural non-implication result.  Its `b_n` are not the
pinned arithmetic coefficients.  Its purpose is to prove that a successful
argument must exploit a new signed property of (2.8)--(2.9), not merely
projection convergence, residual smallness, diagonal coercivity, or an
absolute displacement estimate.

## 5. Exact remaining arithmetic target

For an actual candidate schedule, the proof order is now forced.

1. Prove at least the signed covariance (2.11) and the first alternating
   inequality (2.15).  These are necessary before routing is considered.
2. Prove that the positive source graph is connected.
3. With the complete signed weights already assembled, prove

   \[
    \lambda_{\max}\left(
    W_-^{1/2}C_-^*L_+^\dagger C_-W_-^{1/2}
    \right)<1.                                    \tag{5.1}
   \]

   Individual effective-resistance inequalities do not suffice.

A stronger but scalar collective sufficient condition, potentially useful
for a first estimate, is

\[
 \boxed{
 \sum_{e\in E_-}|w_e|R_{\rm eff}^{(+)}(e)<1.}     \tag{5.2}
\]

Indeed, the left side is the trace of the positive-semidefinite matrix in
(5.1), so it bounds its largest eigenvalue.  Absolute values in (5.2) are
taken only after every `w_e` has been assembled from the complete combined
source.

No repository theorem presently proves (2.11), (2.15), positive
connectivity, (5.1), or (5.2) on a projection-convergent unbounded actual
schedule.  Only a schedule satisfying positive-graph connectivity, (5.1),
the simultaneous nonzero-coordinate gate, and all recorded projection and
locally uniform convergence hypotheses would feed the already-recorded
axis-rooted limit route and imply the Riemann hypothesis.  Equation (5.1)
in isolation does not.  Conversely, RH alone would not establish this
particular global finite real-rooted approximation.  The routing target is
therefore not a consequence of the currently admitted source estimates.
