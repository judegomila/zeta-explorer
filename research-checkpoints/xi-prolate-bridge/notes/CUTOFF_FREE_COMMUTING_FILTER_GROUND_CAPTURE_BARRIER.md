# Cutoff-free commuting-filter ground-capture barrier

## 0. Exact outcome and claim boundary

Let `Q_lambda` be the cutoff-free semilocal Weil operator, let
`mu_lambda` be its bottom value, and let `P_lambda` be the complete bottom
projector, including all multiplicities and both inversion parities.  This
note tests a natural proposed bypass of the remaining ground-orientation
problem: apply polynomial, resolvent, heat, or other spectral filters to a
small-residual radical anchor, hoping to amplify its bottom component while
preserving its defect-relative residual.

For a real center `q`, a vector `kappa in Dom(Q)`, bounded Borel functions
`phi_1,...,phi_m`, and a positive source metric `Delta`, define

\[
 K_\Phi c=\sum_{j=1}^m c_j\phi_j(Q)\kappa,
 \qquad B_\Phi=K_\Phi\Delta^{-1/2}.                    \tag{0.1}
\]

Put

\[
 \rho=\|P\kappa\|^2,
 \qquad
 \Lambda_\Phi=\|PB_\Phi\|^2,
 \qquad
 \mathcal R_\Phi=\|(Q-qI)B_\Phi\|.                  \tag{0.2}
\]

The exact filtered bottom row is

\[
 \boxed{
 \Lambda_\Phi
 =\rho\,\|\boldsymbol\phi(\mu)\Delta^{-1/2}\|^2,}
 \qquad
 \boldsymbol\phi(t)=(\phi_1(t),\ldots,\phi_m(t)),     \tag{0.3}
\]

and the centered filtered residual obeys

\[
 \boxed{
 \mathcal R_\Phi^2
 \geq |\mu-q|^2\Lambda_\Phi.}                         \tag{0.4}
\]

Thus a commuting filter cannot create bottom capture when `rho=0`, and it
cannot amplify captured bottom mass without amplifying the bottom part of
the residual by the same factor.

There is a sharper no-improvement statement for the only currently
certified input.  If

\[
 r=\|(Q-qI)\kappa\|,
 \qquad
 M_{\Phi,\Delta}
 =\sup_{t\in\operatorname {spec}Q}
   \|\boldsymbol\phi(t)\Delta^{-1/2}\|,               \tag{0.5}
\]

then

\[
 \mathcal R_\Phi\leq rM_{\Phi,\Delta},
 \qquad
 \|\boldsymbol\phi(\mu)\Delta^{-1/2}\|
 \leq M_{\Phi,\Delta}.                               \tag{0.6}
\]

Consequently, whenever `rho>0` and the filtered capture is nonzero, the
upper estimate obtained from the original residual is

\[
 \boxed{
 {rM_{\Phi,\Delta}\over\sqrt{\Lambda_\Phi}}
 ={r\over\sqrt\rho}
 {M_{\Phi,\Delta}
  \over\|\boldsymbol\phi(\mu)\Delta^{-1/2}\|}
 \geq {r\over\sqrt\rho}.}                            \tag{0.7}
\]

Equation (0.7) is a comparison of certified **upper bounds**; it does not
assert the false reverse inequality
`mathcal R_Phi/sqrt(Lambda_Phi)>=r/sqrt(rho)`.  The exact lower bound is
(0.4).  In particular, no bounded finite filter family improves the known
residual-to-overlap stopping statistic.  A common single filter pays the
familiar factor

\[
 {\|\phi\|_\infty\over|\phi(\mu)|}\geq1.              \tag{0.8}
\]

Literal Krylov powers do not evade the theorem.  Nonconstant polynomials
are unbounded on the unbounded compact-resolvent spectrum, and the frozen
radical graph theorem certifies `kappa in Dom(Q)` but not the growing
higher-graph estimates needed to control `Q^(j+1)kappa`.  If such estimates
are supplied separately, their residual Gram still contains the positive
bottom atom in (0.4).  Showing that atom is negligible relative to filtered
capture is already the desired conclusion `mu_lambda-q_lambda->0`.

There is one genuine alternate source family.  High-Fourier coercivity
gives at least half of every unit bottom vector in

\[
 |n|\leq M_\lambda,
 \qquad M_\lambda=\exp\{O(\lambda\log\lambda)\}.       \tag{0.9}
\]

The arbitrary-vector Mobius construction gives a global radical lift of
every vector in this finite Fourier space.  Hence this family has an
unweighted largest bottom capture at least `1/2`.  It does not have a small
residual: its compact restrictions are the Fourier vectors themselves, so
the residual synthesis is `Q P_(<=M)`.  The exact canonical exterior-tail
identity reconstructs `-Q` on this space; it does not insert a prolate
defect.  The large capture therefore comes with the original Weil action,
not with the exponentially small radical residual of the prolate anchor.

The theorem applies to the actual cutoff-free operator.  The sharp model in
Section 6 is only a structural source-Cauchy model.  No actual bottom
overlap, filtered one-direction pass, parity order, spectral gap,
determinant convergence, zero theorem, Riemann-hypothesis conclusion,
converse, or de Bruijn--Newman bound is proved.  The standard eight are
unchanged and the formal state remains `P0_INVALIDATED`.

## 1. Frozen dependencies and novelty boundary

No external source is added.  The exact repository inputs are:

| Dependency | SHA-256 |
|---|---|
| `notes/CUTOFF_FREE_ONE_DIRECTION_WEIGHTED_GROUND_CAPTURE_THEOREM.md` | `770087b56766e0102a915a31e08aba5389065d78dd59a55135adb5f5b6eea948` |
| `tests/test_cutoff_free_one_direction_weighted_ground_capture_theorem.py` | `a9cd2abbf8c3de284e1b375beffc7f186a7f4bebc3ecd7fba111195f435b86fc` |
| `notes/CUTOFF_FREE_CYCLICITY_EFFECTIVE_DIMENSION_CAPTURE_BARRIER.md` | `e27463c41c6a45fcb6a3a332b8e5ab173178f35a4abb9fd5eff07dfbbc27eccd` |
| `tests/test_cutoff_free_cyclicity_effective_dimension_capture_barrier.py` | `1bc88d49195b54c185be767a217d952145839962bf894e06dfe38ce9bfbed515` |
| `notes/COMMON_RADICAL_LEAKAGE_GRAM_ORIENTATION_OBSTRUCTION.md` | `e589c3bce1174a94666364dea523f23e0828a2906338f36e81f05c8d25378816` |
| `tests/test_common_radical_leakage_gram_orientation.py` | `d897e662d05665930d3b651d0460dd14f84f8e143ed010c9e248c948a5ace417` |
| `notes/LOCKED_ROTATED_HIGH_GRAPH_SCHUR_REDUCTION.md` | `ac50057befa429894ba1498869a602324489f34aa5795e2d39cfc62bd549df73` |
| `notes/ODD_RADICAL_PARITY_SCHUR_REDUCTION.md` | `3186182c5c3c6ef235e6a48bbe5a7e049f21db4094a8edbfaeb0160663a43c2e` |
| `notes/EVEN_KRYLOV_RITZ_ESCAPE_AUDIT.md` | `a9b903914caf9b6e05ebdece3b45071082835c8bd72641a62a6e4a04d8aa75a8` |
| `tests/test_even_krylov_ritz_escape.py` | `8425c05383710e0e362b945aa46eb07b08e4c18e2a3eaea0ecea3d52239af319` |

The first pair supplies the largest-capture criterion which the proposed
filter is meant to close.  The second supplies the actual effective Fourier
dimension and its exact rank-kernel warning.  The third supplies the common
radical-leakage calculus.  The next two notes directly supply the even and
odd arbitrary-vector Mobius lifts and their canonical exterior-tail
representations.  The final pair fixes the finite Krylov route and the
absence of higher combined-moment estimates.

The multi-anchor theorem already records the bottom atom and the
projector-residual identity for a declared anchor family.  It does not give
(0.3), the bounded-filter envelope comparison (0.7), or the audit of the
source-realizable low-Fourier alternate seed.  The finite Krylov notes use
polynomial moments to lower a Ritz value; they do not claim that a
commuting filter preserves a defect-relative near-null residual.  The
theorem/barrier here is therefore a narrow synthesis of a distinct proposed
bypass, not a relabelling of a Krylov Ritz theorem.

## 2. Exact bounded-filter theorem

Fix `lambda` and abbreviate

\[
 Q=Q_\lambda,\qquad \mu=\mu_\lambda,
 \qquad P=P_\lambda.                                  \tag{2.1}
\]

The operator is self-adjoint and bounded below with compact resolvent.
Let `phi` be bounded and Borel on its spectrum.  Spectral calculus maps
`Dom(Q)` into itself and gives

\[
 Q\phi(Q)x=\phi(Q)Qx\qquad(x\in\operatorname {Dom}Q). \tag{2.2}
\]

For `c in C^m`, put

\[
 F_c(t)=\boldsymbol\phi(t)\Delta^{-1/2}c.             \tag{2.3}
\]

Then

\[
 B_\Phi c=F_c(Q)\kappa.                               \tag{2.4}
\]

Because `P` is the complete spectral projector at the scalar eigenvalue
`mu`,

\[
 PB_\Phi c=F_c(\mu)P\kappa.                           \tag{2.5}
\]

Taking the operator norm of this rank-one map proves (0.3), including a
multiple bottom and a tie between inversion parities.  It also proves

\[
 P(Q-qI)B_\Phi=(\mu-q)PB_\Phi.                        \tag{2.6}
\]

Projection is contractive, so (2.6) proves (0.4).  No gap, simplicity, or
parity selection is used.

Now set `e=(Q-qI)kappa`.  Equations (2.2)--(2.4) give

\[
 (Q-qI)B_\Phi c=F_c(Q)e.                              \tag{2.7}
\]

The spectral theorem and (0.5) imply

\[
 \|F_c(Q)e\|\leq M_{\Phi,\Delta}\|e\|\|c\|.          \tag{2.8}
\]

This proves the first inequality in (0.6).  Evaluating the same supremum at
`t=mu` proves the second.  Substitution into (0.3) proves (0.7).

If `rho=0`, equation (2.5) says `PB_Phi=0` for every bounded commuting
filter.  Qualitative cyclicity of some other vector, or a large physical
coordinate of a ground eigenvector, cannot change this statement for the
chosen seed.

For the uncentered one-direction statistic put

\[
 \mathcal C_\Phi=\|QB_\Phi\|.                         \tag{2.9}
\]

The same bottom row gives

\[
 \boxed{\mathcal C_\Phi^2\geq|\mu|^2\Lambda_\Phi.}   \tag{2.10}
\]

An upper estimate may use

\[
 \mathcal C_\Phi
 \leq |q|\,\|B_\Phi\|+\mathcal R_\Phi.               \tag{2.11}
\]

Filtering can enlarge `||B_Phi||`; `q->0` alone does not remove that term.
If an independent proof makes the right side of (2.11)
`o(sqrt(Lambda_Phi))`, then (2.10) proves `mu->0`.  That independent proof
is a solution of the ground-capture problem, not a consequence of the
original anchor residual.

## 3. Common filters, finite families, and resolvents

There is a useful operator version for an existing synthesis `K_0`.  Let

\[
 \Lambda_0=\|PK_0\Delta^{-1/2}\|^2,
 \qquad
 \mathcal R_0=\|(Q-qI)K_0\Delta^{-1/2}\|.             \tag{3.1}
\]

For one common bounded filter `phi`, put `K_phi=phi(Q)K_0`.  Then

\[
 \Lambda_\phi=|\phi(\mu)|^2\Lambda_0,
 \qquad
 \mathcal R_\phi\leq\|\phi\|_\infty\mathcal R_0.    \tag{3.2}
\]

Therefore the certified relative residual pays (0.8).  Constant-modulus
filters attain the factor one; no common bounded filter has a smaller
uniform factor.

This covers bounded resolvent and semigroup filters.  A resolvent pole near
the bottom can make `|phi(mu)|` large, but its operator norm is at least that
large.  A ground-amplifying heat filter has its norm at the bottom and
amplifies the bottom residual by the identical exponential.  When `rho>0`,
heat filtering can approximate the bottom spectral subspace.  Its centered
ratio tends to `|mu-q|` and its uncentered one-direction ratio tends to
`|mu|`; neither supplies an independent route to either quantity tending to
zero.

For several filters, different eigenvalues cannot cancel in the residual
norm.  In the spectral measure `nu_kappa`,

\[
 \|(Q-qI)B_\Phi c\|^2
 =\int |t-q|^2|F_c(t)|^2\,d\nu_\kappa(t).             \tag{3.3}
\]

The bottom atom in this integral is exactly

\[
 |\mu-q|^2\rho|F_c(\mu)|^2.                           \tag{3.4}
\]

Cancellation of (3.4) forces `F_c(mu)=0` and therefore deletes the same
bottom capture.  Coherent cancellation among filtered columns can remove
excited spectral components; it cannot remove (3.4) while retaining the
bottom row.

## 4. Literal polynomial/Krylov audit

For polynomials `p_1,...,p_m`, the formal synthesis is

\[
 K_pc=\sum_jc_jp_j(Q)\kappa.                          \tag{4.1}
\]

Whenever all columns belong to `Dom(Q)`, its residual Gram has the spectral
representation

\[
 G_p=\left(
 \int t^2\overline{p_i(t)}p_j(t)\,d\nu_\kappa(t)
 \right)_{i,j}.                                       \tag{4.2}
\]

It contains the positive rank-one bottom term

\[
 \boxed{
 G_p\succeq
 \mu^2\rho\,
 \overline{\boldsymbol p(\mu)}^{\,T}
 \boldsymbol p(\mu).}                                \tag{4.3}
\]

The centered version replaces `mu^2` by `(mu-q)^2`.  Equation (4.3) is
the unbounded-polynomial form of (0.4).

There are two additional domain and estimate obligations.

1. Since the spectrum is unbounded above, every nonconstant polynomial is
   unbounded on `spec(Q)`.  The bounded-filter estimate (0.6) is
   unavailable.
2. A degree-`d` residual uses `Q^(d+1)kappa`.  The frozen cutoff-free graph
   theorem proves only the first graph action with the required uniform
   defect-relative rate.  Fixed finite-section moments do not constitute a
   cutoff-free growing-degree estimate.

Supplying those higher graph bounds can make a Krylov Ritz calculation
legal.  It cannot delete (4.3).  In particular, a Chebyshev polynomial on a
bounded interval still needs a bounded spectral cutoff and control of the
discarded unbounded tail.  Replacing it by a bounded rational approximation
returns to Section 2.

## 5. Source-realizable low-Fourier alternate seed

Let `P_M` project onto the physical modes `|n|<=M`, where the exact
high-Fourier theorem is used with `G=c_lambda` and the locked near-zero
Rayleigh trial.  Every unit `g in Ran(P)` satisfies

\[
 \|P_Mg\|^2\geq{1\over2}.                             \tag{5.1}
\]

Let `E_M` be the isometric synthesis of that Fourier band.  Taking
`c=E_M^*g/||E_M^*g||` in the operator norm gives

\[
 \boxed{\|PE_M\|^2\geq{1\over2}.}                    \tag{5.2}
\]

This avoids both a parity choice and a coordinate pigeonhole loss.  The
same theorem also gives the weaker explicit coordinate statement

\[
 \max_{|n|\leq M}|\langle V_n,g\rangle|^2
 \geq {1\over2(2M+1)}
 =\exp\{-O(\lambda\log\lambda)\}.                    \tag{5.3}
\]

The finite Mobius right inverse makes every `v in Ran(E_M)` the compact
restriction of a global two-sided radical.  This is genuine source
realizability.  But the cutoff-free compact state is still `v`, and hence
its residual is

\[
 Qv.                                                   \tag{5.4}
\]

For each inversion parity put

\[
 V_\sigma=\operatorname {Ran}E_M^\sigma.
\]

Restrict the canonical exterior-tail bilinear form to observations and
targets in `V_sigma`, and call its Riesz operator
`T_{{rm ext},sigma}^(M)`.  The even and odd arbitrary-vector radical
identities give

\[
 \boxed{
 T_{{\rm ext},\sigma}^{(M)}
 =-P_{V_\sigma}Q_\sigma|_{V_\sigma}.}                 \tag{5.5}
\]

Thus the exterior radical identity reconstructs the original signed Weil
action.  It does not multiply (5.4) by the exponentially small prolate
defect.  The source has Mobius breakpoints and is not a leading
low-defect prolate source.

The diagonal-plus-Cauchy bounds give only a finite polynomial upper bound
for `||QE_M||` when
`log M=O(lambda log lambda)`; they do not make it tend to zero.  More
decisively, (2.10) applied to `E_M` says

\[
 \|QE_M\Delta^{-1/2}\|^2
 \geq |\mu|^2\|PE_M\Delta^{-1/2}\|^2                 \tag{5.6}
\]

for every positive metric.  Choosing a metric which makes the left-to-right
ratio tend to zero is exactly a new directional source estimate.  Scalar
rescaling changes both sides equally.

Hence the two available inputs live on opposite families:

* the prolate radical anchor has exponentially small residual but unknown
  bottom capture;
* the low-Fourier Mobius family has proved bottom capture but no small
  defect-relative residual.

A bounded function of `Q` cannot splice their advantages because it obeys
Sections 2--3.  A noncommuting splice would require a new commutator or
source-angle theorem and is outside the filter bypass.

## 6. Sharp logarithmic source-Cauchy model

The obstruction is sharp in a cutoff-free source-Cauchy model.  Let
`0<epsilon<1`, put

\[
 \tau={\epsilon^2\over1-\epsilon^2},                  \tag{6.1}
\]

and work in the inversion-symmetric Fourier basis.  Set `b_n=0` for every
integer `n`, and define

\[
 a_0=-1,\qquad a_{1}=a_{-1}=\tau,
 \qquad a_n=\log(|n|+1)\quad(|n|\geq2).               \tag{6.2}
\]

Then

\[
 Q=D_a+D_bH-HD_b=D_a                                  \tag{6.3}
\]

has compact resolvent and logarithmic diagonal growth.  Its simple full
bottom is `mu=-1` with ground `V_0`.  In the even sector put

\[
 \kappa=\epsilon V_0+\sqrt{1-\epsilon^2}\,e_1^+.
                                                               \tag{6.4}
\]

Direct calculation gives

\[
 q=\langle\kappa,Q\kappa\rangle=0,
 \qquad \rho=\epsilon^2,
 \qquad r^2=\|Q\kappa\|^2
 ={\epsilon^2\over1-\epsilon^2}.                     \tag{6.5}
\]

Thus `epsilon_lambda=exp(-3*pi*lambda^2)`, for example, gives an
exponentially small centered residual and an even smaller bottom weight,
while

\[
 {r^2\over\rho}={1\over1-\epsilon^2}\longrightarrow1. \tag{6.6}
\]

The ground has the maximal possible physical Fourier coordinate
`|<V_0,V_0>|=1`, so the physical-coordinate conclusion (5.3) is also
present.

Choose any bounded Borel filter which is nonzero at `-1` and zero at
`tau`.  On the spectral support of `kappa`, the filtered state lies exactly
on the ground line.  Therefore

\[
 {\|Q\phi(Q)\kappa\|
  \over\|P\phi(Q)\kappa\|}=1=|\mu|.                  \tag{6.7}
\]

This attains (2.10).  Ground isolation succeeds, but near-null residual
preservation fails by exactly the ground eigenvalue.

The family (6.2) is not the actual von-Mangoldt Weil operator and says
nothing negative about its true overlap.  It proves that inversion,
source-Cauchy displacement, compact resolvent, logarithmic confinement, an
exponentially accurate near-null anchor, and a large physical ground
coordinate do not make a commuting filter satisfy the one-direction gate.

## 7. Exact stopping line

For any filtered family, the only valid one-direction stopping condition is
still

\[
 {\mathcal C_\Phi^2\over\Lambda_\Phi}\longrightarrow0. \tag{7.1}
\]

Equations (0.3)--(0.7) show that the original small residual proves (7.1)
only after an independent lower bound for `rho`, or after a genuinely new
estimate of the exact filtered spectral integral which is strong enough to
overcome its bottom atom.  Equations (5.2)--(5.6) show that changing to the
source-realizable low-Fourier family exchanges the missing capture for a
missing small residual.

Accordingly, useful next inputs remain one of:

1. an actual pre-Shannon adjoint/source-angle lower bound;
2. an actual mixed bridge contrast lower bound;
3. a noncommuting source construction with a directly proved
   defect-relative residual and low-Fourier capture; or
4. an estimate which directly proves (7.1), and hence already proves
   `mu_lambda->0`.

Bounded spectral filtering, resolvent amplification, heat evolution, and a
finite raw Krylov list supply none of these by themselves.

## 8. Reproduction and claim discipline

Run

    python3 -B -m unittest \
      tests.test_cutoff_free_commuting_filter_ground_capture_barrier -v

The regression checks the frozen hashes, the exact filtered bottom row,
the centered bottom-atom inequality, the uniform-envelope no-improvement
factor, zero-capture preservation, the source-Cauchy saturation model, the
low-Fourier capture calculation, displayed TeX, and fail-closed language.
It reads no zero table, cached ground, prolate artifact, network resource,
API key, or environment secret.

Any downstream use must reject a claimed pass if it:

1. treats a certified upper envelope in (0.7) as a lower bound for the
   actual filtered residual ratio;
2. suppresses the bottom atom (3.4) after filtering;
3. applies a nonconstant polynomial as a bounded function on the unbounded
   cutoff-free spectrum;
4. assumes growing higher-graph estimates from the first graph-domain
   theorem;
5. identifies a Mobius radical lift with a low-defect prolate source;
6. identifies the structural model with the actual Weil operator; or
7. claims a ground overlap, one-direction pass, zero theorem, RH, a
   converse, or a de Bruijn--Newman bound.
