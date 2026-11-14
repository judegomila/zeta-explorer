# Klein phase transport versus annulus energy

Research checkpoint, 14 November 2026.

## Outcome

The comparison identifies a useful analytic reduction and a precise obstruction. The Klein quotient preserves the optimal relative coupling constant, while the annulus supplies an explicit harmonic reference operator. For the actual theta cutoff operator, reflection splits the problem into two half-line kernels. The existing positive Gram majorant vanishes on the entire odd sector. A separate odd-sector estimate is therefore necessary.

Using the established stronger theta concavity, this checkpoint derives strict positivity of the **entries** of the odd half-line kernel. That proves cutoff-energy contraction for odd preimages having one constant phase on the positive half-line. It does not prove positivity for arbitrary oscillatory tests, establish the required estimate for the regularized box pulse, or prove RH. No claim of novelty in the literature is made.

The corresponding exact quotient views are implemented and live in [Zeta Observatory: Klein](https://zeta-view.vercel.app/?view=klein) and [reflection annulus](https://zeta-view.vercel.app/?view=annulus). App release: [zeta-view PR #2](https://github.com/judegomila/zeta-view/pull/2), merge `e88a12315cf4423d77ddc89f961245d83b59204b`.

### Follow-up: oscillatory odd inputs

The [first odd-sector continuation](odd-sector-followup/README.md) advances beyond the constant-phase cone. An interval calculation with explicit series and infinite-tail bounds certifies a strictly positive first odd Taylor block for actual theta. Analyticity then proves positivity for every sufficiently small two-node odd configuration, including arbitrary complex and sign-changing coefficients. An exact comparison kernel shows that stronger convexity alone cannot prove positivity for arbitrary odd inputs, even with double-exponential decay and an order-one transform. An independent Fourier/Löwner reduction shows that positivity of either complete Mellin parity sector is already RH-equivalent.

### Current extension: explicit two-node and four-node bounds

The [quantitative extension](odd-sector-extension/README.md) supplies an explicit radius `1/200` and an energy lower bound for two odd nodes. It also certifies the third and fourth Taylor blocks and proves positivity for **every configuration of up to four distinct odd nodes within radius `1/100000`**, with arbitrary complex coefficients and no minimum separation. These are Mellin distances from the cutoff for actual unheated theta. The fourth block also proves the derivative-polynomial energy inequality through odd degree seven. A checked analytic continuation argument shows that positivity of every finite Taylor block would suffice for the complete odd-sector inequality and RH, without a uniform eigenvalue gap across orders. That all-order sign statement and the uniform bridge estimate remain open.

## Read the derivations

| File | Main content |
|---|---|
| [klein_phase_transport.md](klein_phase_transport.md) | Twisted phase current, zero circulation, exact phase correlation, a conditional positive-contribution/tail bound, exact negative controls, and invariance of the actual Schur target |
| [annulus_theta_coupling.md](annulus_theta_coupling.md) | Exact annulus coupling, conditional transfer criteria, actual theta parity reduction, odd-majorant obstruction, the odd-cone theorem, compactness limits, and actual pulse symmetry |
| [numeric/AUDIT.md](numeric/AUDIT.md) | Finite numerical findings, independent high-precision checks, and reproduction instructions |
| [odd-sector-followup/README.md](odd-sector-followup/README.md) | Certified local oscillatory theorem, exact convexity obstruction, full-sector RH equivalence, and refined seven-node numerical evidence |
| [odd-sector-extension/README.md](odd-sector-extension/README.md) | Explicit two-node and four-node continuum certificates, quantitative energy lower bound, and the all-order derivative-polynomial target |

## 1. The Klein change does not create a coupling margin

For a Hermitian block form

\[
Q=\begin{pmatrix}E&B^*\\B&D\end{pmatrix},
\]

with positive invertible diagonal blocks on the stated energy spaces, the sharp condition is

\[
E-B^*D^{-1}B\succeq0
\quad\Longleftrightarrow\quad
\|D^{-1/2}BE^{-1/2}\|\le1.
\]

A faithful quotient representation preserves this normalized norm. The unnormalized cover multiplies all three blocks by two, leaving the relative bound unchanged. Correct conjugation also preserves the signed boundary kernel: both its phase numerator and transverse offset reverse sign.

The local phase current obeys

\[
j=*d\log|F|,\qquad
d\log|F|(j^\sharp)=0.
\]

Consequently pure phase flow follows modulus contours. It supplies neither an attractive force on zeros nor their heat-evolution law. An explicit polynomial control in the phase note has monotone outer phase and a positive boundary Gram kernel, yet negative inward shear. Any proposed phase estimate must retain the amplitude-weighted negative correlations and the infinite tail.

## 2. What the annulus does supply

For an ordinary uniformizing annulus represented by a cylinder of circumference \(\ell=4K\) and width \(b=K'\), the nonzero Fourier mode \(\kappa_n=2\pi|n|/\ell\) has exact normalized boundary coupling

\[
\rho_n=\operatorname{sech}(\kappa_nb),
\]

and Schur complement \(\kappa_n\tanh(\kappa_nb)\). The constant mode has \(\rho_0=1\) and must be treated separately.

If a genuine comparison with the actual operator establishes relative diagonal losses \(\epsilon_D,\epsilon_E\) and additional normalized coupling \(\beta\), the explicit sufficient condition is

\[
(\rho+\beta)^2\le(1-\epsilon_D)(1-\epsilon_E).
\]

Those comparison estimates have not been proved here. In particular, the theta cutoff operator is compact on ordinary \(L^2(\mathbb R)\), whereas the annulus Dirichlet-to-Neumann operator is unbounded and coercive away from its constant mode. A bounded invertible change of ordinary \(L^2\) coordinates cannot turn one into a uniform positive lower bound by the other. An unbounded trace map or a compactly weighted reference requires its own domain and range analysis.

## 3. The actual theta reduction and the restricted theorem

Use the frozen theta normalization

\[
\xi(1/2+z)=\int_{\mathbb R}\kappa(u)e^{zu/2}\,du,
\qquad h_\pm(u)=(1\pm\alpha u/2)\kappa(u),\quad\alpha>0.
\]

Let \(A\) be convolution by \(h_+\), and let \(Q_c\) project onto the right tail. The exact identity is

\[
\|Q_cA^*a\|_2^2-\|Q_cAa\|_2^2=-\langle a,H_ca\rangle,
\]

with

\[
H_c(u,v)=2\alpha\int_{|c-(u+v)/2|}^{\infty}
t\kappa\!\left(t-\frac{u-v}{2}\right)
\kappa\!\left(t+\frac{u-v}{2}\right)dt.
\]

This operator commutes with reflection about the cutoff. Its unitary half-line reductions are

\[
H_\pm(x,y)=H_0(x,y)\pm H_0(x,-y),\qquad x,y>0.
\]

The earlier majorant \(G_c=B_c^*B_c\) has features depending only on \((u-c)^2\). Therefore

\[
B_cP_-=G_cP_-=0,\qquad H_{c,-}=-\Delta_{c,-},
\quad H_c=G_c-\Delta_c.
\]

An absolute relative-error estimate against \(G_c\) cannot hold on every odd test for any finite constant. This does not refute the desired one-sided bound \(\Delta_c\preceq G_c\); its odd-sector content is exactly the still-unproved inequality \(\Delta_{c,-}\preceq0\).

The established strict convexity of \(-\log\kappa(\sqrt t)\) gives the derived ordering

\[
\boxed{H_0(x,y)>H_0(x,-y)\quad(x,y>0).}
\]

The proof compares squared arguments at fixed sum; their squared-spread difference is \(16xys>0\). It yields

\[
\|Q_cA^*a\|_2\le\|Q_cAa\|_2
\]

for all odd preimages of the form

\[
a(c+x)=e^{i\theta}p(x)/\sqrt2,\qquad
a(c-x)=-e^{i\theta}p(x)/\sqrt2,\quad p\ge0.
\]

The result survives every finite real heat time because
\(\kappa_\tau(u)=e^{\tau u^2/16}\kappa(u)\) changes the convex function only by the affine term \(-\tau t/16\).

Positive entries do not imply a positive quadratic form for arbitrary coefficients. The missing cases include oscillatory half-line tests. The actual regularized pulse preimages are not shown to belong to this cone: their midpoint reflection law includes the boundary phase multiplier, and the endpoint cutoff is a different reflection center. The resolvent is not automatically pointwise positivity preserving.

## 4. The unresolved bridge condition is still explicit

For the previously audited verified-head decomposition \(P_L=H+E\), split the test space as \(\operatorname{ran}H\oplus\ker H\). When \(A_R=H_R+E_{RR}>0\), the required condition is

\[
\boxed{E_{KK}-E_{KR}A_R^{-1}E_{RK}\succeq0.}
\]

The Klein representation preserves this head-null space and condition. It creates no verified-head energy there. A concrete sufficient estimate is

\[
H_R\succeq h_0I,\quad E_{RR}\succeq-\delta I,
\quad E_{KK}\succeq eI,\quad \|E_{RK}\|\le b,
\quad\delta<h_0,
\]

\[
e\ge\frac{b^2}{h_0-\delta}.
\]

No such uniform estimate for the actual residual is claimed. A positive head-null trial value is only an upper bound on the minimized full Schur residual; it cannot certify that minimum's sign.

## 5. Numerical evidence and its limits

The companion scripts sample the deployed numerical modules and independently recompute five xi matrices at 70 decimal digits. Representative normalized coupling values are:

| Finite configuration | Coupling \(\rho\) | Relative Schur margin \(1-\rho^2\) |
|---|---:|---:|
| Four local height nodes near the first xi zero | 0.999999842497481 | \(3.15005\times10^{-7}\) |
| Four wider height nodes near the first xi zero | 0.999820360009188 | \(3.59248\times10^{-4}\) |
| Wider nodes centered at height 30 | 0.942423651969954 | 0.111837660208 |
| Wider nodes centered at height 60 | 0.552352151259645 | 0.694907100999 |

The exact nodes and settings are retained in the JSON outputs. The high-precision inputs use the specified finite decimal center near the first zero. Block congruences, conjugation, and duplicated-cover bookkeeping preserve the coupling to numerical precision. Changing the arbitrary geometric shape improves the annulus reference constant while leaving these fixed spectral bridge data unchanged.

The theta odd-kernel checks agree with the analytic ordering. In this initial audit, a seven-node matrix has an eigenvalue too small to resolve at the stated floating-point tolerance. None of these initial experiments is an interval certificate, an infinite-tail bound, or an all-orders positivity result. The [follow-up](odd-sector-followup/README.md) resolves that finite eigenvalue numerically at higher precision and separately establishes an interval-certified local two-node theorem; it retains the distinction between those two kinds of evidence.

## Sources and validation

- [Exact theta cutoff energy, frozen PR #43](https://github.com/judegomila/mathexplorer/blob/69d4049f289217812051188378a0a9f3f061a169/rigorous/theta-bridge-2026-11-08/theta_boundary_energy.md), especially equations (2.1)--(2.4), (3.4)--(3.6), (4.2)--(4.6), and (4.9).
- [Two-point theta positivity, same checkpoint](https://github.com/judegomila/mathexplorer/blob/69d4049f289217812051188378a0a9f3f061a169/rigorous/theta-bridge-2026-11-08/theta_boundary_two_point.md).
- [Exact verified-head residual](https://github.com/judegomila/mathexplorer/blob/146ce77aa8407e912ed54c73e30664d86936c253/rigorous/theta-fourth-stage-2026-11-09/theta_rational_residual_20261109.md), section 4.
- George Csordas, [Fourier Transforms of Positive Definite Kernels and the Riemann xi-Function](https://arxiv.org/pdf/1309.0055), Theorem 4.2(b). This is the nontrivial external input to the odd-kernel ordering; the deduction is given in full in the annulus note.
- [Exact quotient geometry and app conventions](https://github.com/judegomila/zeta-view/blob/e88a12315cf4423d77ddc89f961245d83b59204b/docs/KLEIN-ANNULUS.md).

The proof comparison distinguishes geometric boundary components, real/imaginary transverse parity, spectral-height parity, Mellin reflection at a cutoff, and verified-head range/nullspace blocks. Identifying these different decompositions without an explicit intertwiner would change the mathematical problem.
