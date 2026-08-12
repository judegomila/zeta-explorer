# Adaptive prolate saturation divergence and orientation barrier

## 0. Exact outcome and claim boundary

Assume RH and use the cofinal nearest-integer adaptive sequence from the
Stokes transfer theorem.  Thus

\[
 L=2\log\lambda,
 \qquad K=\lambda L^3+O(L),
 \qquad \Omega_K={2\pi K\over L},                  \tag{0.1}
\]

where `K` is one of the two adjacent actual finite cutoffs selected below.
The Stokes index is a carrier label: a row labelled `n` belongs to the
projected state with finite cutoff `n-1`.  Thus the selected carrier
`n_* in {m,m+1}` will give `K=n_*-1 in {m-1,m}`.
Let

\[
 q_K^{\rm pr}={\|p_K\|_{\mathfrak Z}^2
                     \over2\|p_K\|_2^2},
 \qquad
 r_K^{\rm pr}={\|p_K''\|_{\mathfrak Z}^2
                     \over2\|p_K''\|_2^2},
 \qquad
 \alpha_K=\lambda_{\min}(A_K^\circ).              \tag{0.2}
\]

The Stokes theorem gives a large quotient for at least one adjacent
cutoff.  This note makes a stronger selection: choose the adjacent cutoff
whose complete actual row energy is larger.  The same cutoff obeys both

\[
 {D_K^{\rm act}\over|d_K^{\rm act}|^2}\gg L
 \quad\hbox{and}\quad
 q_K^{\rm pr}\gg|\widehat F_\lambda(T)|^2.         \tag{0.3}
\]

The zero-endpoint branch is read as an infinite quotient with positive
row energy.  The selected carrier lower bound then gives

\[
 \boxed{
 q_K^{\rm pr},\ r_K^{\rm pr}
 \geq\exp\left\{-(\pi^2+o(1)){K\over L}\right\}.}  \tag{0.4}
\]

The actual-zero quotient construction, extended directly from the exact
ceiling to every `K=lambda*L^3+O(L)`, gives

\[
 \lambda_{k_K}(A_K^\circ)
 \leq\exp\{-(c_\delta-o(1))K\},                    \tag{0.5}
\]

whenever `k_K/K -> delta<1/2`, where

\[
 c_\delta={4(1-\delta)(w_\delta-1)^2\over w_\delta},
 \qquad w_\delta=W(2e(1-\delta)).                  \tag{0.6}
\]

For `k_K=o(K)`, this becomes

\[
 c_*=c_0={4(W(2e)-1)^2\over W(2e)}
 =0.4087565478566\ldots .                           \tag{0.7}
\]

If `alpha_K=0`, the positive-index floor is singular and the extended
saturation is infinite.  If `alpha_K>0`, define

\[
 \kappa_K={r_K^{\rm pr}\over\alpha_K}.
\]

Then

\[
 \boxed{
 \liminf_{K\longrightarrow\infty}{1\over K}\log\kappa_K
 \geq c_*.}                                        \tag{0.8}
\]

Thus the projected-prolate derivative does not saturate the actual floor:
its Rayleigh value is exponentially above it.  More generally, the
fraction of its **sampling energy** carried by the bottom `k_K` spectral
subspace is at most

\[
 \boxed{
 \exp\{-(c_\delta-\pi^2/L-o(1))K\}.}                \tag{0.9}
\]

This is a weighted sampling-energy statement only.  It gives no bound for
the ordinary Hilbert projection of `p_K''` onto that subspace and proves no
Hilbert-space angle.

Consequently the derivative sufficient-reserve criterion from checkpoint
1.40 is eventually impossible on this adaptive sequence.  This does
**not** orient the actual ratio

\[
 \epsilon_{+,K}={\mu_K\over\alpha_K}.
\]

The one-scalar route which survives is the true-ground statistic

\[
 \Theta_K=
 {\displaystyle\int\gamma^{-4}\,d\nu_{\alpha,K}(\gamma)
  \over
  \|\mathcal R_Kh_{\alpha,K}\|_2^2},
 \qquad
 {\mu_K\over\alpha_K}\leq\Theta_K.                \tag{0.10}
\]

The selected adaptive row controls the prolate trial, not the actual
ground distribution `nu_(alpha,K)` or its negative-Sobolev denominator.
It therefore supplies no bound for (0.10).

This is an RH-conditional, cofinal, adaptive-schedule theorem/barrier.  It
does not intersect the selected cutoff with the finite simple-ground,
boundary, shifted-sign, or reserve gates.  It proves no literal ceiling
schedule result, no even reserve, no determinant or normalization transfer,
no unconditional zeta-zero statement, no implication to RH, and no
de Bruijn--Newman bound.  It is an unbound post-checkpoint-1.49 pair; the
standard eight are unchanged and the formal state remains
`P0_INVALIDATED`.

## 1. Frozen inputs

Exactly the following three note/test pairs are imported.

| Dependency | SHA-256 |
|---|---|
| notes/ADAPTIVE_PROLATE_STOKES_ENDPOINT_ROW_TRANSFER_THEOREM.md | 0ae198d3a304960744a04c0ec095ffa6afcd4aa61599de551780efb43f89d878 |
| tests/test_adaptive_prolate_stokes_endpoint_row_transfer_theorem.py | e54bb937552247550c4ed57c1e20b86883556460416b5f046618076b2fbf4b76 |
| notes/RH_EVEN_DERIVATIVE_RELATIVE_LEAKAGE_COMPARISON_BARRIER.md | 0cf345e6eccd543fa2552848bc79be9b51e0e74217b2947ca9c1ad8cde26479c |
| tests/test_rh_even_derivative_relative_leakage_comparison_barrier.py | 5f70ccb12dfc9892f020551a17bdf516706b353fcd60f18108aa93ca923214d7 |
| notes/RH_EVEN_SPECTRAL_CLUSTER_GROUND_PRIMITIVE_EVALUATION_BARRIER.md | 75e5b1b9b916f0ea1732c95bcd9940be4ff0308f561897e64cc0a7141a0c4c4a |
| tests/test_rh_even_spectral_cluster_ground_primitive_evaluation_barrier.py | fc9c3a13e1559393beabd46cb5a1e26c50c042c8e9865e28ec164d45a353a0af |

The first pair supplies the two-adjacent physical endpoint and row norms,
the strengthened Gonek selection, the carrier lower bound, and all four
relative Stokes comparisons.  The second supplies the exact derivative
comparison and the ordinary prolate norm limits.  The third supplies the
actual-zero spectral cluster and the true-ground clamped primitive.  No
external paper, zero table, source lock, numerical ordinate, or serialized
artifact is added.

## 2. The larger-row adjacent cutoff

Retain the Stokes notation

\[
 h={2\pi\over L},
 \qquad q_n^{\rm lat}=-{2(-1)^n\over\sqrt L},
 \qquad \mathcal J_L=\{m,m+1\}.                    \tag{2.1}
\]

The superscript `lat` distinguishes the harmless lattice normalization
from the prolate Rayleigh value `q_K^pr`.  For a carrier label
`n in J_L`, let `D_(n-1)^act` be the squared norm of the complete actual
phase-weighted row of the projected state with cutoff `n-1`, and let
`d_(n-1)^act` be its actual endpoint scalar.  These are exactly the
quantities in the Stokes quotient, with its frozen carrier-to-cutoff shift
retained.

The physical main-row lower bound and the row error in equations
(8.17)--(8.19) of the frozen Stokes theorem imply, for all sufficiently
large `L`,

\[
 \sum_{n\in\mathcal J_L}D_{n-1}^{\rm act}
 \geq {c_{\rm PW}\over4}|q_m^{\rm lat}|^2h^{-2}
              |\widehat F_\lambda(T)|^2.           \tag{2.2}
\]

Indeed, the main-row norm is at least
`sqrt(c_PW)*|q_m^lat|*h^(-1)*|Fhat_lambda(T)|`, while
the actual-minus-main norm is little-oh of that scale.  The factor `1/4`
is a fixed safe loss after applying the reverse triangle inequality and
squaring.

The strengthened endpoint filter gives

\[
 |e_m|^2+\rho_m^2|e_{m+1}|^2
 \leq C L|Z(T)|^2.                                  \tag{2.3}
\]

The adjacent envelope ratios are bounded and tend to one.  Combining
(2.3) with the endpoint part of the same physical Stokes comparison gives
a fixed `C_end>0` such that

\[
 \sum_{n\in\mathcal J_L}|d_{n-1}^{\rm act}|^2
 \leq C_{\rm end}L|q_m^{\rm lat}|^2
              |\widehat F_\lambda(T)|^2.           \tag{2.4}
\]

Choose the carrier label `n_* in J_L` so that

\[
 D_{n_*-1}^{\rm act}
 =\max_{n\in\mathcal J_L}D_{n-1}^{\rm act},
 \qquad
 K=n_*-1\in\{m-1,m\}.                               \tag{2.5}
\]

Then (2.2) gives

\[
 \boxed{
 D_K^{\rm act}\geq {c_{\rm PW}\over8}
 |q_m^{\rm lat}|^2h^{-2}|\widehat F_\lambda(T)|^2.} \tag{2.6}
\]

If `d_K^act` is nonzero, (2.4)--(2.6) give

\[
 {D_K^{\rm act}\over|d_K^{\rm act}|^2}
 \geq {c_{\rm PW}\over8C_{\rm end}}{h^{-2}\over L}
 ={c_{\rm PW}\over32\pi^2C_{\rm end}}L.           \tag{2.7}
\]

If `d_K^act=0`, (2.6) says that the denominator is positive and the
zero-endpoint branch succeeds.  Thus the larger-row rule selects one and
the same cutoff for the absolute row lower bound and the relative endpoint
gain.  No pointwise division by an endpoint was used in making the
selection.

The exact endpoint quotient has

\[
 (\eta_K^{\rm pr})^2
 ={|d_K^{\rm act}|^2S_0\over D_K^{\rm act}},         \tag{2.8}
\]

where the frozen zero-sampling constant `S_0` is bounded.  Equations
(2.7)--(2.8), including the zero-endpoint branch, prove

\[
 \boxed{(\eta_K^{\rm pr})^2=O(L^{-1}).}             \tag{2.9}
\]

## 3. Absolute prolate Rayleigh scale

For the actual projected state, the exact rational transform formula is

\[
 \widehat p_K(t)
 ={2\sin(tL/2)\over\sqrt L\,t}
 H_K\left({tL\over2\pi}\right).                    \tag{3.1}
\]

Consequently

\[
 \|p_K\|_{\mathfrak Z}^2={16\over L}D_K^{\rm act},
 \qquad
 \boxed{q_K^{\rm pr}={8D_K^{\rm act}
                          \over L\|p_K\|_2^2}.}    \tag{3.2}
\]

The ordinary prolate convergence proof uses only
`K=lambda*L^3+O(L)` and `Omega_K=O(lambda*L^2)`.  It therefore applies to
both adjacent adaptive cutoffs and gives

\[
 0<c_p\leq\|p_K\|_2^2\leq C_p<\infty              \tag{3.3}
\]

eventually.  Since

\[
 |q_m^{\rm lat}|^2h^{-2}
 ={4\over L}{L^2\over4\pi^2}={L\over\pi^2},        \tag{3.4}
\]

(2.6), (3.2), and (3.3) give the absolute lower bound

\[
 \boxed{
 q_K^{\rm pr}\geq {c_{\rm PW}\over\pi^2C_p}
                 |\widehat F_\lambda(T)|^2.}        \tag{3.5}
\]

The nearest-integer adaptive schedule has

\[
 T={2\pi(N+1)\over L}=2\pi\lambda L^2+O(1),
 \qquad K=\lambda L^3+O(L).                         \tag{3.6}
\]

The carrier lower bound and its exact action expansion are

\[
 |\widehat F_\lambda(T)|
 \geq P_2(T,L)^{-1}
 \exp\{-\pi T/4+\operatorname {Re}D_c(7/2-iT)\},    \tag{3.7}
\]

\[
 -{\pi T\over4}+\operatorname {Re}D_c(7/2-iT)
 =-{\pi^2\over2}\lambda L^2+{\pi\over4}L^4+O(L). \tag{3.8}
\]

Here `P_2` is fixed polynomial-logarithmic data, so its logarithm is
`O(L)`.  Squaring (3.7), using (3.5), and then using (3.6) proves

\[
 \log q_K^{\rm pr}
 \geq-\pi^2\lambda L^2+{\pi\over2}L^4-O(L)
 =-(\pi^2+o(1)){K\over L}.                          \tag{3.9}
\]

This is the first place where the absolute selected-carrier lower bound is
essential.  Decay of `eta_K^pr` alone supplies only a relative comparison
and would not imply (3.9).

## 4. Derivative comparison and saturation

The exact derivative theorem gives

\[
 {r_K^{\rm pr}\over q_K^{\rm pr}}
 \geq\gamma_*^4{\|p_K\|_2^2\over\|p_K''\|_2^2}
           (1-\eta_K^{\rm pr})_+^2.                \tag{4.1}
\]

The same adaptive-stable ordinary convergence gives

\[
 {\|p_K''\|_2^2\over\|p_K\|_2^2}\longrightarrow m_4,
 \qquad 0<m_4<\infty.                               \tag{4.2}
\]

Together with (2.9), equations (4.1)--(4.2) show that, for example,

\[
 r_K^{\rm pr}\geq {\gamma_*^4\over8m_4}q_K^{\rm pr}
                                                               \tag{4.3}
\]

for every sufficiently large `K`.  The numerical constant `1/8` is only
a safe eventual loss.  Equations (3.9) and (4.3) prove the second lower
bound in (0.4).

If `alpha_K=0`, (4.3) gives `r_K^pr>0`, so the quotient
`r_K^pr/alpha_K` is infinite in the extended sense.  Suppose from now on
that `alpha_K>0`.  Section 5 proves

\[
 \alpha_K\leq\exp\{-(c_*-o(1))K\}.                 \tag{4.4}
\]

Hence

\[
 {1\over K}\log\kappa_K
 \geq c_*-{\pi^2\over L}-o(1).                     \tag{4.5}
\]

Letting `L` tend to infinity proves (0.8).  In particular, no bounded or
subexponential saturation theorem is compatible with these actual
adaptive estimates.

## 5. Spectral cluster on the adjacent adaptive schedule

The frozen cluster proof is pointwise in `L` and the integer dimension; an
exact ceiling is not used in its quotient algebra.  For the selected `K`,
fix

\[
 {1\over2}<\theta<1-\delta,
 \qquad M=\lfloor\theta K\rfloor,
 \qquad s=K-M-k_K.                                  \tag{5.1}
\]

The actual-zero quotient space has dimension `k_K`, annihilates the first
`M` distinct actual zero rows, and gives

\[
 \lambda_{k_K}(A_K^\circ)
 \leq C L T_M\log T_M
       \left({\Omega_K\over T_M}\right)^{4s}.       \tag{5.2}
\]

The multiplicity-aware HSW consequence depends only on
`K/(lambda*L^3)->1`.  It therefore remains

\[
 \liminf {T_M\over\Omega_K}\geq2\theta             \tag{5.3}
\]

when `K=lambda*L^3+O(L)`.  The prefactor in (5.2) is `exp(o(K))`.  If
`k_K/K -> delta<1/2`, (5.1)--(5.3) yield

\[
 \limsup {1\over K}\log\lambda_{k_K}(A_K^\circ)
 \leq-4(1-\delta-\theta)\log(2\theta).             \tag{5.4}
\]

The unique optimizer satisfies

\[
 \theta_\delta={1-\delta\over w_\delta},
 \qquad w_\delta e^{w_\delta}=2e(1-\delta),        \tag{5.5}
\]

and substitution gives (0.5)--(0.6).  The case `k_K=o(K)` has
`delta=0` and gives (0.7).  This proves (4.4) by taking `k_K=1`.

There is no schedule sleight of hand here: replacing the exact ceiling by
an `O(L)` change alters `K`, `M`, `s`, and `Omega_K` by `o(K)` at the
exponential scale and leaves (5.2) itself exact at the selected integer.

## 6. Sampling-energy separation from the bottom cluster

Let

\[
 A_K^\circ u_j=\lambda_j u_j,
 \qquad0\leq\lambda_1\leq\cdots\leq\lambda_K,
 \qquad
 v_K={p_K''\over\|p_K''\|_2},                       \tag{6.1}
\]

and let `P_k` be the ordinary orthogonal projection onto
`span{u_1,...,u_k}`.  The fraction of the derivative's total sampling
energy carried by this bottom space is

\[
 \mathcal E_{K,k}
 :={\langle P_kv_K,A_K^\circ P_kv_K\rangle
       \over
       \langle v_K,A_K^\circ v_K\rangle}
 ={\displaystyle\sum_{j\leq k}\lambda_j
          |\langle v_K,u_j\rangle|^2
    \over r_K^{\rm pr}}.                            \tag{6.2}
\]

Positivity and `||P_kv_K||_2<=1` give the exact inequality

\[
 \boxed{0\leq\mathcal E_{K,k}
 \leq{\lambda_k(A_K^\circ)\over r_K^{\rm pr}}.}    \tag{6.3}
\]

For `k=k_K` and `k_K/K -> delta<1/2`, equations (0.4)--(0.6) give

\[
 \mathcal E_{K,k_K}
 \leq\exp\{-(c_\delta-\pi^2/L-o(1))K\}.            \tag{6.4}
\]

This proves (0.9).  Equation (6.4) says that the bottom cluster carries an
exponentially vanishing fraction of the derivative's **Gram sampling
energy**.  It does not say that

\[
 \|P_{k_K}v_K\|_2^2\longrightarrow0.               \tag{6.5}
\]

Indeed, an arbitrarily small ordinary component in a high-eigenvalue
direction can dominate a Rayleigh quotient.  No upper spectral bound and
no relative gap used here converts (6.4) into (6.5).  Any downstream use
as a Hilbert-angle theorem is invalid.

## 7. What the saturation theorem does and does not decide

The checkpoint-1.40 sufficient reserve criterion is, for fixed
`0<rho<1`,

\[
 {\kappa_K\|p_K''\|_2^2
  \over
  \gamma_*^4\|p_K\|_2^2(1-\eta_K^{\rm pr})^2}
 <1-\rho
 \quad\Longrightarrow\quad
 \delta_{+,K}>\rho.                                 \tag{7.1}
\]

By (0.8), (2.9), and (4.2), the left side of (7.1) tends to infinity.
Thus this particular derivative sufficient condition is eventually
impossible on the adaptive sequence.  This conclusion is stronger than
saying that its saturation factor is uncontrolled.

The implication in (7.1) is one-way.  Its failed antecedent proves neither

\[
 {\mu_K\over\alpha_K}\longrightarrow1              \tag{7.2}
\]

nor any lower bound for that ratio.  The full even ground may lie far
below `alpha_K`; neither `q_K^pr` nor `r_K^pr` determines its scale.
Likewise, a large selected row is a rank-one lower contribution to one
trial form.  It supplies no inverse leverage, determinant ratio, Schur
orientation, or lower frame on the remaining `K-1` directions.

The spectral-cluster construction makes the geometry explicit.  For every
`theta>1/2`, its quotient space annihilates all rows through a height
`T_M` with `T_M/Omega_K>=2*theta-o(1)`.  The adaptive selected zero lies
at height `(1+o(1))*Omega_K`, so that row is already annihilated by the
explicit near-null trial space.  A large response of `p_K` to that one row
cannot lift the cluster or orient its ground.

## 8. The surviving true-ground statistic

Assume `alpha_K>0` and let `h_(alpha,K)` be a unit ground vector of
`A_K^circ`.  Its exact sampling-energy probability is

\[
 \nu_{\alpha,K}(\{\gamma\})
 ={m_\gamma|\widehat h_{\alpha,K}(\gamma)|^2
   \over
   \displaystyle\sum_{\beta>0}
       m_\beta|\widehat h_{\alpha,K}(\beta)|^2}.    \tag{8.1}
\]

The clamped primitive from the frozen ground theorem satisfies

\[
 (\mathcal R_Kh_{\alpha,K})''=h_{\alpha,K},
 \qquad
 \|\mathcal R_Kh_{\alpha,K}\|_2^2
 \geq\Omega_K^{-4}.                                \tag{8.2}
\]

Min--max gives the saturation-free bound

\[
 \boxed{
 {\mu_K\over\alpha_K}
 \leq\Theta_K
 :={\displaystyle\int\gamma^{-4}
                         \,d\nu_{\alpha,K}(\gamma)
    \over
    \|\mathcal R_Kh_{\alpha,K}\|_2^2}.}           \tag{8.3}
\]

It is useful to make the two remaining ground data dimensionless.  Put

\[
 G_K=\Omega_K^4\|\mathcal R_Kh_{\alpha,K}\|_2^2
 \geq1,
 \qquad
 \rho_{\alpha,M}=\nu_{\alpha,K}((0,T_M]).          \tag{8.4}
\]

Splitting the inverse fourth moment at `T_M` gives

\[
 \boxed{
 \Theta_K\leq{1\over G_K}
 \left[
 \left({\Omega_K\over T_M}\right)^4
 +\left\{
 \left({\Omega_K\over\gamma_*}\right)^4
 -\left({\Omega_K\over T_M}\right)^4
 \right\}\rho_{\alpha,M}
 \right].}                                         \tag{8.5}
\]

Thus a fixed reserve `delta_(+,K)>rho` would follow from the right side of
(8.5) being eventually less than `1-rho`; an `o(L^(-1))` reserve would
follow from `Theta_K=o(L^(-1))`.

The adaptive eta theorem controls the row distribution of the prolate
trial.  It does not compare that distribution with (8.1), does not bound
`rho_(alpha,M)`, and does not improve `G_K`.  Moreover its selected row is
at `(1+o(1))*Omega_K`, below `T_M` for every fixed `theta>1/2`; one edge
row cannot force the high-row inverse-fourth-moment contraction in (8.5).
The combined scalar `Theta_K`, or equivalent oriented actual-ground data,
is therefore the minimal surviving route exposed by these estimates.

## 9. Fail-closed stopping line

Any downstream use must reject a claimed pass if it

1. selects the quotient-large cutoff without also making the larger-row
   choice needed for the absolute lower bound;
2. confuses the lattice scalar `q_n^lat` with `q_K^pr`;
3. drops the exact factor `8/L` in (3.2);
4. replaces the nearest-integer relation in (3.6) by a false continuous
   inverse identity;
5. infers (3.9) from eta decay without the selected-carrier lower bound;
6. treats the `O(L)` adaptive dimension perturbation as exponential scale;
7. turns the eigenvalue upper bound (0.5) into a lower frame bound;
8. reads the sampling-energy estimate (6.4) as a Hilbert projection or
   angle estimate;
9. infers failure of the actual even reserve from failure of the
   sufficient criterion (7.1);
10. substitutes the prolate trial distribution for the actual-ground
    distribution in (8.3);
11. claims finite-gate synchronization, a literal ceiling result, an
    unconditional zero theorem, RH, a converse from RH, or a
    de Bruijn--Newman bound.

The terminal conclusion is narrow: the adaptive prolate derivative is
exponentially non-saturating in sampling energy, while the actual even
reserve remains unoriented and requires the true-ground statistic in
(8.3).  The formal state remains `P0_INVALIDATED`.
