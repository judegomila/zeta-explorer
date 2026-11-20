# RH route atlas: results, failed approaches, and remaining conditions

This atlas records mathematical research, including routes that did not close. It does **not** claim RH, a new global zero-free region, external peer review, or novelty. A failed sufficient estimate is not a negative direction of the actual Weil form. A counterexample to an auxiliary model is not a counterexample to RH.

The historical app already contains bridge, closure-route, ghost, freezing, and research-roadmap pages. The purpose here is to connect their mathematical objects to the later certificates and corrections, not to replace those pages or silently upgrade their claims. Existing PRs are separate review units, not merged dependencies. GitHub source links require access to this private repository. References to PRs 14–19 are pinned unmerged review-branch sources, not merged dependencies.

## 1. Coordinate and evidence guide

Write

\[
\xi(s)=\tfrac12s(s-1)\pi^{-s/2}\Gamma(s/2)\zeta(s),\qquad X(w)=\xi(\tfrac12+w).
\]

Keep the following quantities distinct:

| Symbol | Meaning | Not interchangeable with |
|---|---|---|
| \(a\) | Horizontal shift in \(R_a(w)=X(w-a)/X(w+a)\) | Heat time |
| \(L\) | A support half-width in the older Weil notes; a truncation parameter in the Hankel notes | A single universal coordinate |
| \(W=2\log\lambda\) | Support width in the later spectral normalization | Newman \(\Lambda\) |
| \(t,\tau\) in \(H_\tau\) | Backward-heat deformation time | Logarithmic arithmetic delay |
| \(r\) in \(\Psi(r)\) | Logarithmic delay; \(e^r\) is an arithmetic cutoff | Zeta-zero height |
| \(\Lambda(n)\) | von Mangoldt function | Newman \(\Lambda\) |
| \(B\) | Proposed boundary for \(\Re\rho\) | An upper bound for Newman \(\Lambda\) |

Here “recorded certificate” means a previously accepted, explicitly scoped computation. It is called replayable only when the needed code and inputs are available. Hashes establish byte identity, not mathematical correctness. Higher-precision replay of the same implementation is not independent implementation or external review.

## 2. Twin ladder and shifted bridge

**Model.** An elementary prime factor is

\[
H_p(s)=\frac1{1-p^{-s}},\qquad E_{p,k}=k\log p.
\]

The Euler product converges in \(\Re s>1\); the completed function, not an unevaluated infinite circuit, supplies continuation elsewhere. The rigorous shifted object is \(R_a\), or equivalently \(E_a(z)=\xi(1/2+a-iz)\) and its de Branges kernel. For \(a>0\), if
\(\Delta=\sup_{X(\rho)=0}|\Re\rho|\), the corrected strict comparison is

\[
|X(w-a)|<|X(w+a)|\quad(\Re w>0)
\quad\Longleftrightarrow\quad a\ge\Delta.
\]

The endpoint is included. Positivity for every positive shift is an RH-equivalent reformulation, not an independent proof.

**What survived.** The completion/shift dictionary and the explicit zero-packet identity

\[
|Q_{\delta,\gamma}(w+a)|^2-|Q_{\delta,\gamma}(w-a)|^2
=8a\Re(w)\bigl((\Re w)^2+(\Im w-\gamma)^2+a^2-\delta^2\bigr)
\]

explain the strict threshold. Here \(Q_{\delta,\gamma}(w)=(w-i\gamma)^2-\delta^2\).

**What failed or needs qualification.** Critical-line unimodularity of the functional-equation factor is already true without RH. A Darlington-lossless slogan does not locate zeros: a denominator zero of \(\zeta(2s)/\zeta(s)\) is generally a pole. At one fixed shift, common zeros can cancel; the remaining pole order is
\([m(\rho)-m(\rho-2a)]_+\). A zero row is compatible with positive semidefiniteness, so strict diagonal positivity, full-kernel positivity, and an uncancelled ghost pole must not be conflated.

The historical hidden-square proposal also required correction: \(u=v\) has two-dimensional Lebesgue measure zero. Its positive one-dimensional comparison integral is not a nonzero channel of the original double integral without an additional measure or exact identity. The repaired paired-coordinate and theta divisor-block identities do not supply global positivity.

**Unresolved condition.** Prove the actual completed kernel positive for every positive shift, with common-zero conventions and tails intact. Passive finite products or a contraction on a deliberately \(X\)-weighted state space do not supply this.

**Sources and reproduction.** The [commit-pinned shift-bridge module](https://github.com/judegomila/mathexplorer/blob/942ba1760c4ef54a519750ab91c37a661c31e0ce/src/data/shift-bridge-positivity-section.js) and [shear-measure correction](https://github.com/judegomila/mathexplorer/blob/942ba1760c4ef54a519750ab91c37a661c31e0ce/formalization/paper/shear_kernel_measure_audit_2026-08-28.md) contain the equations and caveats. App assertions check presentation consistency; they do not prove the unresolved positivity theorem.

## 3. Information, Fisher geometry, and critical tuning

### Two valid information statements

For \(0<\sigma<1\), let \(D_\sigma=\operatorname{diag}(\sigma I_n,(1-\sigma)I_n)\), \(J^*=-J\), consider

\[
dY=(J-D_\sigma)Y\,dt+\sqrt{2D_\sigma}\,dB_t.
\]

The equilibrium is the same standard Gaussian for every split. The sharp entropy rate with **prefactor exactly one**, for every initial finite-entropy law and every time, is

\[
\mathrm{KL}(\nu_t\Vert\mu)\le e^{-Rt}\mathrm{KL}(\nu_0\Vert\mu),
\qquad R=2\min(\sigma,1-\sigma).
\]

Gaussian log-Sobolev gives the bound; translated Gaussians in the weaker-damped rail give sharpness at time zero. Balance uniquely optimizes this criterion. It is a specialization of [Arnold–Erb](https://arxiv.org/abs/1409.5425), not a new zero-location theorem. Long-time spectral rates with transient constants are a different optimization.

For the **actual xi** positive exponential family,

\[
d\mu_a=e^{ax-K(a)}d\mu_0,\quad K(a)=\log\frac{X(a)}{X(0)},
\quad K''(a)=\operatorname{Var}_{\mu_a}(x)>0,
\]
\[
\mathrm{KL}(\mu_a\Vert\mu_0)=aK'(a)-K(a),\qquad
\frac d{da}\mathrm{KL}=aK''(a).
\]

The central member minimizes this KL divergence. The probability family is attributable to [Nakamura](https://arxiv.org/abs/1504.03438); the identities are standard exponential-family calculus. They prove neither an optimum of Fisher information itself nor a Shannon-entropy optimum, and do not control complex cancellation.

### Why critical-fluid tuning did not close the arithmetic problem

For finite independent prime ladders,

\[
Z_X(\beta)=\prod_{p\le X}(1-p^{-\beta})^{-1},\qquad
L_X(\sigma)=\log Z_X(\sigma)+\log Z_X(1-\sigma),
\]

the midpoint uniquely minimizes \(L_X\). With
\(V_X=2\sum_{p\le X}(\log p)^2p^{-1/2}/(1-p^{-1/2})^2\), the normalized difference of the two midpoint energies converges to a Gaussian, not the theta law. A positive quadratic reweighting \(e^{JY_X^2/2}\), \(J>0\), is nonnormalizable even at finite \(X\): one prime occupation gives a subseries of the form \(2^{-n/2}e^{cn^2}\).

A stabilizing quartic weight produces a legitimate limiting density proportional to
\(\exp[-(1-J)y^2/2-gy^4/4]\). This is not the theta density. The recorded theta kurtosis enclosure \([2.79110285146369,2.79110286487817]\) is disjoint from pure-quartic kurtosis \(2.18843961522647\ldots\). A finite prime approximant can fail the Lee–Yang property: at \(X=2,J=0,g=10^{-4}\), its fourth cumulant exceeds \(2.9\), incompatible with all-imaginary zeros for its even entire MGF of order at most \(4/3\).

Finally, normalized Gibbs data are invariant under \(H\mapsto H-cI\), whereas an absolute spectral floor shifts by \(-c\). Positive covariance or critical susceptibility cannot determine the missing absolute Weil lower bound.

**Unresolved condition.** An exact arithmetic comparison to the actual signed form, or ferromagnetic finite partition functions converging locally uniformly to the theta transform, remains missing. Positive densities, finite moments, and a familiar limiting universality class do not suffice.

**Sources and reproduction.** [PR 15 information note](https://github.com/judegomila/mathexplorer/blob/acf2a2cedb42a6388b16e89dd277766effc1e3e8/research-checkpoints/rh-arithmetic-information-2026-10-21/INFORMATION_OPTIMALITY.md); delivered V7 section `18-cofinal-and-criticality.tex`. The latter source and its recorded moment-certificate provenance were inspected; a remote publication of that complete V7 source is not asserted here. This atlas does not rerun the moment certificate.

## 4. Synchronization and finite stochastic correspondences

**Model.** On \(\ell^2\) prime-power rungs, let \(\Omega_{p,k}=k\log p\), \(A_0=i\Omega+J\), with bounded skew-adjoint \(J\), bounded selfadjoint \(C\), and bounded \(K\ge0\). Set

\[
\dot u=A_0u+iC(v-u)-K(u-v),\qquad
\dot v=A_0v+iC(u-v)-K(v-u).
\]

For \(d=(u-v)/\sqrt2\), \(E_d=\|d\|^2/2\),

\[
\dot E_d=-2\langle d,Kd\rangle,\qquad
K\ge\kappa I\Longrightarrow E_d(t)\le e^{-4\kappa t}E_d(0).
\]

**Accepted scope.** This is a domain-correct infinite-dimensional control model. If \(K=0\), difference energy is conserved: a conservative bridge does not attract arbitrary twin states. Also \(\sum_p\sum_{k\ge1}p^{-k}=\sum_p1/(p-1)=\infty\), so the raw critical-line amplitude vector is not a finite-energy vector in the naive unweighted space.

A different exact finite correspondence realizes the Cauchy-phase covariance

\[
K_T(\ell,m)=\tfrac12\cos(T(\ell-m))
[e^{-x|\ell-m|}-e^{-x(\ell+m)}]
\]

by a zero-start two-quadrature Ornstein–Uhlenbeck process. It matches mean and covariance, **not the probability law** or higher cumulants of a common Cauchy phase. The positive variance identity does not become signed arithmetic cancellation.

**Failure controls.** Every finite compression of \(A=-I+2S\), where \(S\) is the unilateral shift, has eigenvalue \(-1\), yet \(+1\) is in the infinite approximate spectrum. Thus stable finite eigenvalue plots cannot justify an infinite limit. Conversely vanishing modal damping can give strong decay without a uniform exponential rate; absence of a uniform gap is not itself instability.

**Actual arithmetic target.** The exact decomposition \(Q_L=B_L-C_L\), with \(B_L,C_L\ge0\) on the common form domain, gives

\[
G_L(\varepsilon)=\sup_{f\ne0}
\frac{C_L[f]}{B_L[f]+\varepsilon\|f\|^2},\qquad
G_L(\varepsilon)\le1\Longleftrightarrow Q_L\ge-\varepsilon I.
\]

All supports and arbitrarily small \(\varepsilon>0\) are still required. Choosing damping in a toy system does not prove this bound for arithmetic coefficients.

**Sources and reproduction.** [Pinned stochastic correspondence](https://github.com/judegomila/mathexplorer/blob/b878c92d3df6a4691f2b40593996e9a2c9e983cc/research-checkpoints/twin-ladder-physics-2026-10-19/poisson/POISSON_OU_AND_PRIME_BEAT_CORRESPONDENCE_v2.md), [exact signed network decomposition](https://github.com/judegomila/mathexplorer/blob/acf2a2cedb42a6388b16e89dd277766effc1e3e8/research-checkpoints/rh-arithmetic-information-2026-10-21/NETWORK_TRANSFORM.md), and the inspected delivered synchronization audit. Its finite simulations are diagnostics; the infinite model statement is analytic. No complete-zeta realization of its dissipative generator is available.

## 5. Vortices, heat collisions, and the winding route

**Actual evolving object.** Use

\[
H_\tau(z)=\int_0^\infty e^{\tau u^2}\Phi(u)\cos(zu)\,du,
\qquad H_0(z)=\xi(1/2+iz/2)/8,
\qquad \partial_\tau H=-H_{zz},
\]
\[
\Phi(u)=\sum_{n\ge1}(2\pi^2n^4e^{9u}-3\pi n^2e^{5u})e^{-\pi n^2e^{4u}}.
\]

A path in the phase field of fixed \(X\) moves a test point, not a zero. Away from zeros, \(\nabla\arg X=J\nabla\log|X|\); phase motion preserves modulus. Attraction in a plotted fixed field is not collision exclusion in \(H_\tau\).

**Exact determinant and failed sign argument.** With \(D=H_x^2-HH_{xx}\),

\[
(\partial_\tau+\partial_x^2)D=2(H_{xx}^2-H_xH_{xxx}).
\]

Reversing time produces a negative source if the right-hand Laguerre difference is positive. This is not a positivity-preserving forward maximum principle. The exact solution \(H_\tau(x)=x^2-2(\tau-c)\), \(c>0\), has real roots after \(c\), a collision at \(c\), and nonreal roots before it. It is a heat-equation countermodel, not the theta family. Separate positive-kernel examples show that strict log-concavity alone, or positive kernels plus compact zero tails, also fail; the two examples do not jointly have every theta hypothesis.

**Conditional adjacent-gap certificate.** Before a first loss of simple real zeros, adjacent zeros with squared gap \(y\) satisfy

\[
y'=8-4Sy,\qquad S=\sum_{r\ne a,b}\frac1{(b-r)(a-r)}\ge0.
\]

If an independently validated lower bound \(S\ge L(t)\ge0\) holds along the continuation, then

\[
y(T)>8\int_{t_0}^T\exp\!\left(-4\int_v^TL(w)\,dw\right)dv
\]

excludes that pair's collision down to \(t_0\). Endpoint roots alone do not provide the required trajectory bound. Higher multiplicities are included; a triple cluster has adjacent squared-gap slope 6, not 8.

**Local index theorem.** For a real analytic backward-heat solution with exact finite spatial multiplicity \(m\ge2\), the zero of \((h,h_x)\) is isolated and has degree

\[
\operatorname{ind}(h,h_x)=-\lfloor m/2\rfloor
\]

in domain order \((t,x)\) and target order \((h,h_x)\). On a bounded Jordan region, analyticity near its closure, no identically zero spatial slice, and boundary nonvanishing give boundary winding equal to the sum of these indices. Zero winding therefore excludes collisions. **Nonvanishing alone is not zero winding.**

**Remaining global hypothesis.** Independently construct zero-winding relative-error boundary certificates on an exhaustive family of boxes, together with a simple all-real anchor, complex-zero confinement on each positive-time slab, and convergence to time zero. The common index sign does not supply the zero winding. No uniform positive margin is needed, but all boxes are needed.

**Sources and reproduction.** [PR 16 determinant proof/countermodels](https://github.com/judegomila/mathexplorer/blob/31e39096e18b6630aeadb81966d444f8e39c314f/research-checkpoints/vortex-collision-2026-10-22/DETERMINANT_OBSTRUCTION.md), [adjacent-gap argument](https://github.com/judegomila/mathexplorer/blob/31e39096e18b6630aeadb81966d444f8e39c314f/research-checkpoints/vortex-collision-2026-10-22/ADJACENT_GAP_CERTIFICATE.md), and [PR 19 full local-index proof](https://github.com/judegomila/mathexplorer/blob/9d33d72ee740933be494258bb6f5540753c36911/research-checkpoints/collision-index-2026-10-24/LOCAL_COLLISION_INDEX.md). PR 16 supplies small symbolic regression checks; PR 19's checker verifies document bytes, not its analytic theorem. Neither depends on the unavailable arithmetic bundle.

## 6. Genuine theta certificates: two different finite results

### Central real-axis positivity — PR 17

For \(M_k(\tau)=\int_0^\infty u^ke^{\tau u^2}\Phi(u)du\),

\[
\frac d{d\tau}\frac{M_2}{M_0}=\operatorname{Var}_\tau(u^2)\ge0,
\qquad H_\tau(x)\ge M_0(\tau)\left(1-\frac{x^2M_2(\tau)}{2M_0(\tau)}\right).
\]

The Arb certificate proves \(M_2(1/2)/M_0(1/2)<2/169\), hence

\[
H_\tau(x)>0\quad\text{for real }|x|\le13,\quad0\le\tau\le1/2.
\]

Both infinite tails are included. This is not a complex zero-free disk; at time zero the stated \(x\)-interval is only \(|\Im s|\le6.5\) on the critical line. The package records 128- and 192-bit runs of the same implementation with 65,536 dyadic cells.

### Nonvanishing of the genuine two-component field — PR 18

The separate certificate proves

\[
G(t,x)=H_t(x)+iH_x(t,x)\ne0
\quad\text{on }[0,1/2]\times[200,220],
\]

with exact zero boundary winding. It directly covers the complete time-zero edge, not just samples. The endpoint package uses 194 derivatives, 24 continuous boundary segments, and 90 closed interior cells, with 384/512-bit outputs. It excludes simultaneous \(H,H_x\) zeros in this bounded real parameter region; it does **not** assert \(H\ne0\), absence of off-real zeros, or control at all heights. Interior coverage does not rely on the local-index theorem.

**Reproduction.** Both packages contain generators, analytic error and tail estimates, pinned python-flint requirements, and saved outputs. Offline rational geometry checks alone do not prove containment of the actual theta values: regeneration plus the analytic lemmas supplies that step. The trust boundary includes Python and Arb, not a proof assistant. See [PR 17 source](https://github.com/judegomila/mathexplorer/blob/006ebb4fa6b96c8c36af66544c6d9a8bcedf3ae4/research-checkpoints/theta-central-2026-10-22/README.md) and [PR 18 endpoint proof](https://github.com/judegomila/mathexplorer/blob/e4e3535c2457d6e94a1ffd089a008a2e40d0af4f/research-checkpoints/genuine-theta-endpoint-2026-10-24/PROOF.md). Neither finite result fills the all-height gap.

## 7. Discrete curvature and finite-prime rigidity

**Exact model.** For normalized interval cells of width \(h\), the Suzuki/Weil compression is Toeplitz:

\[
H_{h,m}=(q_{|i-j|}),\quad q_0=\frac{2\Psi(h)}h,\quad
q_d=\frac{\Psi((d+1)h)-2\Psi(dh)+\Psi((d-1)h)}h.
\]

When the eliminated interior is positive definite, its two-boundary Schur complement is positive precisely when \(e\ge|b|\). This is an exact finite criterion, not an invariant proved for all arithmetic updates. If \(U\) repeats each coordinate twice and divides by \(\sqrt2\), then
\(U^*H_{h/2,2m}U=H_{h,m}\): mesh refinement preserves the same step-function energies.

**Accepted obstruction.** Change finitely many strictly positive delays by

\[
\Psi_\varepsilon(r)=\Psi(r)-\sum_j\varepsilon_j(|r|-\ell_j)_+.
\]

Unless all combined \(\varepsilon_j\) vanish, some finite dyadic-cell matrix has a negative direction. The proof assumes all modified matrices positive, deduces conditional negative definiteness and polynomial growth, then RH by the Laplace transform. Under that consequence, the true spectral measure is discrete, while the perturbation contributes a nonzero mean-zero cosine density; a frequency interval away from zero ordinates yields a negative test, contradiction.

This theorem concerns a **modified** arithmetic model, with every other term fixed. It does not find a negative vector for the true coefficients. A zero-delay compensation is excluded from its hypotheses and can defeat the argument.

**Finite result.** For increasing the prime-2 coefficient, the recorded \(k=4,m=256\), support \(16\log2\), threshold bracket is

\[
0.000010685379<\varepsilon_*<0.000010685380.
\]

Directed coefficient enclosures and exact rational negative witnesses support this bracket. A fixed-support table tending downward does not establish zero limiting tolerance; the proved exhaustive corollary uses both mesh refinement and expanding support.

**Unresolved condition and artifacts.** The true signed Schur residual still needs an all-scale arithmetic estimate; independent fixed-width error bars cannot replace it. The inspected delivered `rigidity.tex`, coefficient enclosures, and `verify_certificates.py` are available locally as a self-contained certificate package. A fresh read-only check passed all twelve saved brackets; it trusts the saved coefficient intervals and does not regenerate them. No remote repository link for this specific October 6 refinement was verified in this audit, and it is not silently included in an older PR. Its underlying scalar framework is [Suzuki](https://arxiv.org/abs/2206.03682).

## 8. Split twistor and thin Hankel continuation

**Model.** In the even compact picture \(L^2_{\mathrm{even}}(S^3)\), the angular operator has multiplier

\[
b_m(w)=\prod_{j=1}^m\frac{w-2j}{w+2j}.
\]

The exact wide bridge is \(T(w)=R_{3/2}(w)A(w)\); it is a right-half-plane contraction. At \(w=2\), \(T=(15/(2\pi^2))P_0\). The constant angular mode has multiplier one, so the scalar arithmetic ratio remains the full norm obstruction. Fourier transformation relates homogeneous distribution spaces; it is not a pointwise map between two twistors.

The separate arithmetic Hankel operator is

\[
(H_{a,L}f)(x)=\int_0^Lh_a(xy)f(y)dy.
\]

**Accepted finite result.** The signed infinite-dimensional certificates, including analytic omitted-mode control, give
\(\|H_{1/4,L}\|\le49999/50000\) for \(1<L\le3/2\), extended to
\(1999999/2000000\) for \(1<L\le8/5\). These certify \(I\pm H>0\), not positivity of the signed Hankel operator itself.

**What failed.** The absolute-kernel norm already exceeds one at the first window, and its all-window norms diverge for every positive width. Absolute domination cannot provide even a nonsharp global finite bound. An unconditional improvement \(\|H_{1/4,L}\|\le\min(L,M\sqrt L)\), with analytically finite but uncertified numerical \(M\), remains unbounded and proves no new strip.

For the actual xi quotient, all-window boundedness at fixed \(a\) is equivalent to cancellation-aware holomorphy and the Schur property. At \(a=1/4\), each zero \(\sigma+i\gamma\), \(\sigma>3/4\), would need a same-ordinate zero \(3/2-\sigma+i\gamma\) of at least its multiplicity. This condition is unproved. One fixed width is not RH-equivalent without this qualification; widths tending to zero would supply RH. A weighted-space cocycle contraction that works even with right-half-plane zeros is not thin arithmetic passivity.

**Sources and reproduction.** [Pinned original twistor research tree](https://github.com/judegomila/mathexplorer/tree/712c4b0ad71693c6f0ba272ded1f3a71b60b5204/research/twistor-bridge-2026-10-03), inspected delivered version-three bundle and October 4 thin-window extension. The latter includes interval generators, analytic tail constants, and replay receipts; this atlas does not rerun them or assert they are already in that older tree. Classical kernel background: [Suzuki's canonical-system paper](https://arxiv.org/abs/1204.1827).

## 9. Arithmetic positivity, dual certificates, and failed extensions

**Fixed-support form.** For zero-extended \(f\) supported in \([-L,L]\), with unitary Fourier transform \(\widehat f\), the earlier completed symbol is

\[
V_L(t)=\Re\psi(1/4+it/2)-\log\pi
-2\sum_{n\le e^{2L}}\frac{\Lambda(n)}{\sqrt n}\cos(t\log n)
+\frac{2\sinh L\cos(2Lt)+4t\cosh L\sin(2Lt)}{t^2+1/4},
\]
\[
Q_L[f]=\int_\mathbb R V_L(t)|\widehat f(t)|^2dt.
\]

The domain requires a finite logarithmic Fourier moment, not zero endpoint trace. The pole completion appears exactly once.

**Recorded result and present replay blocker.** PR 15 records the full-domain result
\(Q_{6/5}\ge10^{-55}I\), with an analytic high complement, not just 160 Ritz modes. Its thin-shift transfer is identity-only and does not inherit an older relative-leakage reserve. The approximately 1.1 GB frozen bundle, including complete couplings and required data, remains unavailable. The repository ledger and hashes do not reconstruct it. This atlas does not upgrade that recorded certificate to a fresh replay.

**Failed extension.** At \(L=5/4\), the specified sufficient comparisons failed at 160 and 180 modes. A rigorously negative frozen comparison value \(\le-0.002602851065047418\) used redistributed diagnostic masses without certified continuum error. It is not an actual negative Weil vector. More precision or more midpoint ports did not fix that coupling loss.

**Null-symbol route.** Because support autocorrelation vanishes outside \([-2L,2L]\), every finite \(W(t)=\sum_jc_j\cos(a_jt)\), \(a_j>2L\), has zero expectation against \(|\widehat f|^2\). The exact fixed-support dual is

\[
\inf_{\|f\|=1}Q_L[f]=\sup_{\text{finite }W}\inf_t(V_L+W).
\]

This is completeness, not an effective all-support construction. Restricting frequencies to one lattice gives a periodic-envelope Toeplitz relaxation. At \(L=11/20\), period \(64\pi\) has strictly negative optimum; even all allowed harmonics cannot certify zero there. An off-lattice correction improves but does not close a specified \(128\pi\) relaxation. A negative relaxed measure need not be the Fourier square of any admissible supported function.

**Unresolved condition.** Construct actual signed all-support lower bounds with the required uniform/subexponential loss. Negative completed rows of \(Q1\) or \(Q\cosh(x/2)\) do not imply negative quadratic energy. The formal state of the separate [PR 6 prolate checkpoint](https://github.com/judegomila/mathexplorer/pull/6) is **P0_INVALIDATED**; preserved formulas and passing tests do not reinstate its invalidated proof item.

**Sources.** [PR 15 fixed-support ledger](https://github.com/judegomila/mathexplorer/blob/acf2a2cedb42a6388b16e89dd277766effc1e3e8/research-checkpoints/rh-arithmetic-information-2026-10-21/FIXED_SUPPORT.md), [null-symbol analysis](https://github.com/judegomila/mathexplorer/blob/acf2a2cedb42a6388b16e89dd277766effc1e3e8/research-checkpoints/rh-arithmetic-information-2026-10-21/NULL_SYMBOL_DUALS.md), and [artifact-availability disclosure](https://github.com/judegomila/mathexplorer/blob/acf2a2cedb42a6388b16e89dd277766effc1e3e8/research-checkpoints/rh-arithmetic-information-2026-10-21/REPRODUCIBILITY.md). The small symbolic/synthetic checks in that PR are not a replacement for its omitted large inputs.

## 10. Möbius energy, zero-free comparisons, and the 7/8 boundary

**Actual reduction.** For the pole-cancelling packet \(k\),

\[
F(y)=\sum_{m\ge2}\frac{\log m}{\sqrt m}k(\log m-y),\quad
S(L)=\sum_{d\ge1}\frac{\mu(d)}{\sqrt d}F(L-\log d)
=\sum_{n\ge2}\frac{\Lambda(n)}{\sqrt n}k(\log n-L).
\]

An eventual bound \(\int_j^{j+1}|S(u)|^2du\le Ce^{0.7496j}\), for all large integers \(j\), is the unproved energy target for boundary \(B=0.8748\). Elementary pieces of the pair sum are controlled; small-common-divisor, large-separation signed correlations remain open. Finite identity checks at \(L=4,6,8\) are not all-scale evidence.

**What PR 14 actually certifies.** Exact rational parameter admissibility for

\[
B=17497733/20000000=0.87488665
\]

improves the imported source's displayed parameter by exactly \(5\times10^{-8}\). The zero-free conclusion remains **conditional on the imported analytic estimates and closure lemma**, which the package does not independently prove. Its exact obstruction excludes \(B\le0.8748\) only inside that numerical admissibility system. The additional \(B=0.874\) target requires an unproved restricted fourth-moment bound of order \(U^{39/40+\varepsilon}\).

The sixth-phase filter takes value 1 at the principal phase and \(-1/5\) at the other five phases. Complete-period Gram orthogonality is exact, but the simultaneous local sixth-power residue subspace retains eigenvalue one. Small mean energy is not a worst-case contraction. Matching numerator and denominator Euler lines also erases the principal detector; differentiation restores removed coefficients.

**7/8 status.** This atlas establishes no new unconditional \(7/8\) zero-free theorem. A numerical value below \(7/8\) in PR 14 does not remove its imported analytic dependency. In the V7 discrepancy route, an actual floor
\(\epsilon_0(\lambda)\ge-C(1+\log\lambda)^m\lambda^p\) with \(p<1\) would imply no zeros in \(\Re s>(1+p)/2\); \(p=3/4\) reaches \(7/8\), and \(p=0\) would imply RH. Those improved global floors remain unproved.

**Sources and reproduction.** [PR 14 exact-certificate README](https://github.com/judegomila/mathexplorer/blob/05cfffbbd673105bada9d45df1666ef4bd770764/rigorous/mobius_bridge_reduction/README.md), [signed-filter note](https://github.com/judegomila/mathexplorer/blob/05cfffbbd673105bada9d45df1666ef4bd770764/rigorous/mobius_bridge_reduction/SIGNED_PHASE_FILTER.md), and [imported Xu–Sang source](https://arxiv.org/html/2610.15291v2). Standard-library rational checkers verify the stated numerical system, not the imported analytic proof. The floor implication is in inspected V7 `03-landau.tex`.

## 11. Curvature cylinder, gamma bulk, and Suzuki scalar reserve

**Exact arithmetic geometry.** In the later normalization, let

\[
a(t)=\Re\psi(5/4+it/2)-\log\pi,\quad
d\nu=\sum_{n\ge2}\frac{\Lambda(n)}{\sqrt n}\delta_{\log n}-e^{r/2}dr,
\]
\[
D(r)=\sum_n\frac{\Lambda(n)}{\sqrt n}(r-\log n)_+
-4(e^{r/2}-1-r/2),\qquad D''=\nu.
\]

For support width \(W\), \(R_f(r)=\int\overline{f(x)}f(x+r)dx\),

\[
q_W[f]=\frac1{2\pi}\int a(t)|\widehat f(t)|^2dt
-2\Re\int_{[0,W)}R_f(r)d\nu(r).
\]

This uses the nonunitary Fourier transform. The adjusted \(5/4\) gamma symbol already absorbs a decaying pole correction; adding the older pole block again changes the operator.

The cylinder metric \(g=e^{-2D(r)}(dr^2+d\theta^2)\) satisfies distributionally
\(K_gdA_g=d\nu\,d\theta\). This is an exact **weighted encoding**, not positive curvature. On a lifted triangle its total curvature equals \(D(W)\), canceled by the sloping edge's boundary curvature. Gauss–Bonnet gives no upper bound on \(D(W)\). A nonarithmetic periodic model \(D_b=b(1-\cos(2\pi r/W))/(2\pi/W)^2\) has zero total curvature yet an unbounded weighted charge as \(b\) grows; topology alone cannot prove the required arithmetic inequality.

**A genuine positive bulk for gamma only.** For \(a_0=a(0)\), \(b_m=2m+5/2\),

\[
\mathcal G[f]=\mathcal A[f]-a_0\|f\|^2
=\inf_{(u_m)}\sum_{m\ge0}\frac2{b_m}
\left(\|f-u_m\|^2+b_m^{-2}\|u_m'\|^2\right).
\]

The auxiliaries live on the whole line; \(u_m=b_m^2(b_m^2-\partial_x^2)^{-1}f\). This realizes the gamma symbol exactly but leaves the signed arithmetic boundary defect. Prime translation deltas off the diagonal obstruct a direct smooth local scalar Dirichlet-to-Neumann identification. Positive cross entries for disjoint nonnegative even tests separately obstruct a positivity/disjointness-preserving scalar Markov trace model, even after a diagonal shift. These limited no-go results do not exclude general nonlocal or coupled-field models and do not prove negative Weil energy.

**What the scalar comparison still needs.** With \(V_W[f]=2\Re\int R_fd\nu\), an exact one-sided target is

\[
(\mathcal G_W+\mu I)^{-1/2}V_W(\mathcal G_W+\mu I)^{-1/2}\le I,
\]

for one fixed \(\mu>0\) cofinally in support. The inverse must be that of the supported gamma form, not a restricted whole-line or periodic inverse. This would give a uniform floor, not an already proved bound. The direct absolute-transport comparison incurs cost at least \(c_\mu\lambda/\sqrt{\log\lambda}\), so scalar optimization cannot make that estimate uniform; it constructs no actual vector attaining the loss.

**Suzuki scalar interface.** The exact box test gives
\(\Psi(W)=(W/2)q_W[W^{-1/2}1_{I_W}]\). Between prime-power events,

\[
\Psi(r)=C(r)-S_nr+J_n,
\quad S_n=\sum_{j\le n}w_j,\quad J_n=\sum_{j\le n}w_jr_j.
\]

For the stated convex archimedean \(C\) on \(r\ge\log2\), its reserve is
\(M_n=J_n-C^*(S_n)\), with exact update

\[
M_{n+1}-M_n=\int_{S_n}^{S_n+w_{n+1}}[r_{n+1}-u(s)]ds,
\]

where \(u\) is the derivative of the one-sided conjugate. Convexity does not determine the update sign. The global all-event nonnegative reserve remains unproved; bounded-support even positivity and finite scalar checks must remain separate. A uniform strictly positive scalar margin is not the right RH target: under RH, the almost-periodic nonnegative zero expansion has arbitrarily small returns.

**Sources and reproduction.** Inspected delivered V7 `19-geometry-bulk-and-suzuki.tex`, with [Suzuki's scalar framework](https://arxiv.org/abs/2206.03682) and [PR 15 scalar/box normalization](https://github.com/judegomila/mathexplorer/blob/acf2a2cedb42a6388b16e89dd277766effc1e3e8/research-checkpoints/rh-arithmetic-information-2026-10-21/VORTEX_AND_TAIL_STATUS.md). The current recurrence and finite-event certificates belong in their separate modules; this atlas does not duplicate their artifact manifests or claim a new replay.

## 12. Newman Λ: what none of these routes may silently claim

Newman \(\Lambda\) is the threshold for **all zeros** of the heat-deformed \(H_t\) to be real. RH is equivalent to \(\Lambda\le0\); Rodgers–Tao proved \(\Lambda\ge0\). Thus RH would give \(\Lambda=0\), but positive-time capture is entirely compatible with the known lower bound. It does not contradict it. See [Rodgers–Tao](https://arxiv.org/abs/1801.05914).

The repository's historical README separately labels its \(0.1787854\) candidate as unestablished/unreviewed and its \(0.1875\) package as unrefereed. These are **historical project statuses**, not a fresh audit of the latest external literature or a certification by this atlas. They are not the spectral-support \(\lambda\), the Möbius boundary \(B\), or a consequence of the finite theta boxes. The old finite-model “beat” and the asymptotic target retain their explicit missing bridge assumptions. [Pinned historical status](https://github.com/judegomila/mathexplorer/blob/942ba1760c4ef54a519750ab91c37a661c31e0ce/README.md).

## Review and availability ledger

| Unit | Status of mathematical content | Artifact boundary |
|---|---|---|
| PR 6 | P0_INVALIDATED | Preserve as failed proof-item history, not a theorem source without individual rechecking |
| PR 14 | Exact parameter checks; conditional analytic zero-free implication | Small arithmetic checkers available; imported analytic source not independently verified |
| PR 15 | Scoped arithmetic/information ledger | Large frozen arithmetic bundle unavailable; small checks are not its replay |
| PR 16 | Exact collision algebra and conditional trajectory certificates | Small symbolic checks available |
| PR 17 | Finite real-axis theta positivity | Generator, both tails, pinned environment and outputs available |
| PR 18 | Finite genuine-field nonvanishing including time zero | Generator, analytic errors, geometry, outputs available |
| PR 19 | Analytic local-index proof; conditional global continuation | No numerical data dependency; hash checker checks bytes only |
| Delivered twistor/discrete/synchronization packages | Scoped local results and obstructions as above | Inspected source exists; latest refinements not assumed published in an older repository tree |
| Delivered V7 | Exact reductions, finite certificates, and explicitly limited obstruction results | Source inspected; this atlas does not replace the edition's detailed evidence catalogue |

The enduring open task is not another analogy: it is a genuine all-scale signed arithmetic estimate, a cofinal actual-form floor, or an exhaustive theta boundary/collision certificate with the stated analytic hypotheses. No route in this atlas has supplied that final quantifier.

**Fresh checks during this curation:** all twelve saved discrete perturbation brackets passed; the saved theta endpoint geometry passed at 384 and 512 bits; the collision-index document manifest passed. These establish only the stated finite signs, saved geometry, and byte integrity. The arithmetic coefficient and theta actual-function generators were not rerun. Latest delivered refinements without a verified remote source remain partially reproducible from this atlas, not a complete bundled release.
