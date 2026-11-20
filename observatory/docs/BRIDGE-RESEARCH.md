# Bridge research workbench

The renderer now has six linked numerical research views in `dist/research-math.js`: shear, modal signs, boundary energy, finite Gram/Schur tests, theta/arithmetic cancellation, and shifted-ratio trajectories. The actual heat-zero, prime-mode, and pulse views are implemented separately. All controls are normalized by `dist/research-state.js` and included in the application's shareable state.

These views carry over specific constructions from Math Explorer. An exact algebraic identity, a floating-point finite experiment, and an unresolved global positivity claim are different outputs. The interface labels each calculation accordingly. No plotted sign, finite matrix, synthetic zero, or quadrature residual is presented as a proof of RH.

## Frozen source provenance

The source material below was read from the user's Math Explorer repository. Commit links freeze the conventions even when a branch changes. PR42 and PR43 were research branches, not a claim that all their targets had been proved or merged.

| Construction | Primary source |
|---|---|
| Shear, exact quadratic collision, first modal witness, and parity forms | [PR42 sign-switching note, `83deec06`](https://github.com/judegomila/zeta-explorer/blob/83deec06204c676a7df451da8ba1ab5e4610c3ac/formalization/paper/sign_switching_energy_2026-11-07.md), [source math](https://github.com/judegomila/zeta-explorer/blob/83deec06204c676a7df451da8ba1ab5e4610c3ac/src/math/sign-switching.js) |
| Strip-Poisson boundary-energy reconstruction and endpoint measures | [PR43 boundary energy, `b7f045a3`](https://github.com/judegomila/zeta-explorer/blob/b7f045a34a194d852b645868ea0b8996d64ec2dd/rigorous/theta-bridge-2026-11-08/theta_boundary_energy.md), [two-point kernel](https://github.com/judegomila/zeta-explorer/blob/b7f045a34a194d852b645868ea0b8996d64ec2dd/rigorous/theta-bridge-2026-11-08/theta_boundary_two_point.md) |
| Finite-shift bridge, ratio, and common shifted zeros | [Shift-bridge section, `83deec06`](https://github.com/judegomila/zeta-explorer/blob/83deec06204c676a7df451da8ba1ab5e4610c3ac/src/data/shift-bridge-positivity-section.js) |
| Frozen block and negative-index accounting | [Freezing section, `bc017d51`](https://github.com/judegomila/zeta-explorer/blob/bc017d516b4575594793da711abe5a63c67db5e5/src/data/freezing-bridge-section.js), [Lean inertia file](https://github.com/judegomila/zeta-explorer/blob/bc017d516b4575594793da711abe5a63c67db5e5/formalization/lean-aristotle/frozen-rung/Inertia.lean) |
| Positive-real logarithmic-derivative Pick checkpoint | [Six-node research draft, `ba04ef9b`](https://github.com/judegomila/zeta-explorer/blob/ba04ef9b74ad26448384cf7bf00861dc4ed96d68/rigorous/theta-third-preservation-2026-11-11/README.md), [rational residual draft, `7e99e8c7`](https://github.com/judegomila/zeta-explorer/blob/7e99e8c76d43de00ec30d32db7b0f43f8b992b76/rigorous/theta-fourth-stage-2026-11-09/theta_rational_residual_20261109.md) |
| Arithmetic divisor block | [`HiddenSquareProgramPage.jsx`, `bc017d51`](https://github.com/judegomila/zeta-explorer/blob/bc017d516b4575594793da711abe5a63c67db5e5/src/pages/HiddenSquareProgramPage.jsx), `ArithmeticBlockDiagnostic` |
| Seven-point negative layer and positive integrated direction | [PR43 signed-Gram research note](https://github.com/judegomila/zeta-explorer/blob/b7f045a34a194d852b645868ea0b8996d64ec2dd/rigorous/theta-bridge-2026-11-08/gram_twistor_research_README.txt), [saved numerical data](https://github.com/judegomila/zeta-explorer/blob/b7f045a34a194d852b645868ea0b8996d64ec2dd/rigorous/theta-bridge-2026-11-08/gram_layer_cancellation.json) |

The application recomputes its displayed data; it does not load the saved source figures or reuse a precomputed table. The Lean source is provenance for the algebraic inertia statement, not a declaration that a new formal compilation or a theorem about this numerical matrix has been checked here.

## Coordinates and evaluated sources

The spectral variable is (s=\sigma+it), with transverse distance (x=\sigma-\tfrac12). The main sources are the existing completed-function evaluator (F(s)=\xi(s)), the existing theta heat evaluator (F_\tau(s)), and the explicit control

\[
F_\varepsilon(s)=(s-\tfrac12)^2+2\varepsilon.
\]

The quadratic is centered at (s=\tfrac12); changing the probe height does not silently recenter it. Its derivatives are (F'=2(s-\tfrac12)), (F''=2). Actual derivatives come from `math.js`. In particular, the boundary (h=0) limit uses the analytic theta-contour second derivative, not a finite difference.

The heat convention remains

\[
\partial_\tau F_\tau=\tfrac14\partial_s^2F_\tau.
\]

Research controls restrict the ordinary selected height to (0\le T\le60), with bounded neighboring samples. Negative heights that arise in a symmetric window are permitted by the evaluator. Plot axes identify spectral, local, Mellin, and node coordinates separately.

## 1. Bridge shear

The analytic quantities are

\[
W(s)=\operatorname{Re}(F'(s)\overline{F(s)})
=\tfrac12\partial_\sigma|F(s)|^2,
\qquad
\frac{W}{|F|^2}=\operatorname{Re}\frac{F'}F.
\]

The finite bridge is

\[
B_a(s)=\frac{|F(s+a)|^2-|F(s-a)|^2}
{|F(s+a)|^2+|F(s-a)|^2}
=\tanh\bigl(\log|F(s+a)|-\log|F(s-a)|\bigr).
\]

Away from zeros, (B_a/(2a)\to\operatorname{Re}(F'/F)). A common zero has no normalized bridge value; it is not assigned zero. The logarithmic representation avoids squaring very small values in the finite bridge.

The 49×73 map uses actual σ coordinates. The signed-shear layer applies one positive reference scale followed by the odd compression `asinh`; this preserves the sign. The scale is a display choice and is not differentiated. Logarithmic shear is clipped at ±12 on the map and ±25 in slices, with explicit labels. Phase arrows use the direction of

\[
\nabla\arg F=(\operatorname{Im}(F'/F),\operatorname{Re}(F'/F)).
\]

Contours and winding-cell Newton refinements are numerical zero diagnostics. They need not detect every zero in a coarse grid. On the symmetry axis (W=0); a limiting sign of (W/x) is a separate quantity. This view gives neither a force on zeros nor a zero-motion law.

## 2. Exact modal collision

In local (w=x+iy) coordinates,

\[
F_\varepsilon(w)=w^2+2\varepsilon,
\quad W=2x(x^2+y^2+2\varepsilon),
\quad L_1(y)=4y^2+8\varepsilon.
\]

For ε<0 the negative right-shear region is the **open** half-disk (x>0, x^2+y^2<-2\varepsilon). Its open diameter is exactly the interval where (L_1<0). The axis itself has (W=0); the plotted continuous axis value is (W/x=L_1/2). The endpoints are excluded.

At fixed boundary (a=1),

\[
E_+=2(1+y^2+2\varepsilon),\qquad
E_-=2(1-h^2),\qquad
E_+-E_-=2(y^2+h^2+2\varepsilon).
\]

The starting boundary is PSD only when (1+2\varepsilon\ge0). The allowed slider includes values violating this condition so the scope label changes. The enclosing zero count remains two through the collision; a count alone does not constrain the roots to an axis.

## 3. Even/odd boundary energy

Let (U_a(t)=F(\tfrac12+a+it)). For real (r_1,r_2), the evaluated boundary kernel is

\[
P_a(r_1,r_2)=
\frac{\operatorname{Im}(\overline{U_a(r_1)}U_a(r_2))}{a(r_2-r_1)},
\qquad
P_a(t,t)=\frac{\operatorname{Re}(F'\overline F)(\tfrac12+a+it)}a.
\]

For (0<h<a), the half-line probability density is

\[
\omega_{a,h}(r)=
\frac{\pi r\sin(\pi h/a)\sinh(\pi r/a)}
{a h[\cosh(\pi r/a)+\cos(\pi h/a)]^2},\qquad r\ge0.
\]

With (D_\pm=P_a(t\pm r,t\pm r)), (C=P_a(t-r,t+r)),

\[
e_\pm=(D_-+D_+\pm2C)/4,
\quad E_\pm=\int_0^\infty\omega_{a,h}e_\pm\,dr,
\quad E_+-E_-=W_h(t)/h.
\]

The density is evaluated in a stable exponential form. At (h=0) its analytic limit is used and the direct target is (|F'|^2+\operatorname{Re}(F''\overline F)). At (h=a) the measure is exactly δ₀, giving (E_-=0). The numerical density is never substituted at that endpoint.

Actual ξ/heat uses (a\ge\tfrac12); the quadratic control uses (a=1). For ξ, and for the selected heat family when τ≥0, the stated zero-strip starting-boundary justification applies. For negative heat time the app does not assert boundary PSD. The identity can still be evaluated as a signed-form comparison. Even when the starting boundary is PSD, its cross entries need not all be positive and it does not follow that (E_+\ge E_-) everywhere inside.

The displayed forms use 24-point Gauss–Legendre quadrature on adaptively split **[0,8]**, compared with 12-point quadrature. A separate **[8,12] finite tail probe** reports even, odd, and signed contributions. It is not an infinite-tail bound. For example, at ξ height 60 and (a=1,h=.15), the two tail probes are each about (7.64\times10^{-5}), while their difference is about (-1.23\times10^{-11}). A small signed residual therefore says little by itself about the omitted amount in either positive form.

All terms share one positive normalization, normally (|P_a(t,t)|). If that vanishes numerically, the boundary jet scale (|F'|^2+|F|^2/a^2) is used. No sign is clipped. The test suite independently checks the density's mass and second moment and the quadratic forms, including the finite tail contribution.

## 4. Three finite Gram kernels and a frozen block

The bridge and ratio views use (u_j=x+i(T+\eta_j)), where the CSV entries are height offsets ηⱼ and the node-offset slider is **Re (u)**. It is not an imaginary offset. Set (U(u)=F(\tfrac12+u+a)), (V(u)=F(\tfrac12+u-a)). The two kernels are

\[
K^b_{ij}=\frac{U_i\overline U_j-V_i\overline V_j}
{2\pi(u_i+\overline u_j)},\qquad
K^P_{ij}=\frac{1-R_i\overline R_j}{u_i+\overline u_j},\quad R=V/U.
\]

They are related by diagonal congruence when (U_i\ne0), so they share inertia. The implementation uses local homogeneous scaling for the bridge and rejects unresolved Pick denominators. At (x=0) it uses analytic diagonal limits. Repeated nodes can make blocks singular.

The separate **logPick** checkpoint uses distinct positive real CSV entries (x_i), at height zero:

\[
X(z)=F(\tfrac12+z),\quad L=X'/X,\qquad
K^{\log}_{ij}=\frac{L(x_i)+L(x_j)}{x_i+x_j}.
\]

Height, finite shift (a), and complex-node offset do not enter this kernel. Singular or numerically unresolved logarithmic derivatives are rejected. The weakest direction is also displayed as the Laplace profile (h(u)=\sum b_i e^{-x_i u}) and rational probe (V(z)=\sum b_i/(z+x_i)). The coefficients are transformed back through the positive congruence weights before these profiles are formed.

All three matrices are normalized by positive diagonal congruence. The eigensolver retains both real and imaginary parts through the real representation of a complex Hermitian matrix. A real-part heatmap by itself is not the matrix whose spectrum is tested. Eigenvalues within a scale-dependent (10^{-9}) tolerance are marked unresolved.

The first requested nodes form the frozen block (C). With the remaining live block (A), the code computes

\[
Q_{\rm eff}=A-BC^{-1}B^*,\qquad
\operatorname{ind}_-(Q)=\operatorname{ind}_-(C)+\operatorname{ind}_-(Q_{\rm eff}).
\]

It rejects singular or numerically unresolved (C); it does not add regularization or use a hidden pseudoinverse. The finite numerical signs are not global positivity certificates. In particular, a near-zero eigenvalue must not be read as a proven strict margin.

## 5. Arithmetic blocks and theta-layer cancellation

The arithmetic diagnostic computes the exact finite identity

\[
D_N(\xi)=\sum_{d\mid N}\cos\left(\frac\xi2\log\frac d{\sqrt N}\right)
=\prod_{p^k\parallel N}\sum_{j=0}^k
\cos\left(\frac{\xi\log p}{2}(j-k/2)\right).
\]

The equivalent sine quotient has removable zeros in its denominator. The implementation uses finite sums, so these do not produce 0/0.

The positive-coordinate theta kernel is

\[
\Phi(u)=\sum_{n\ge1}
(2\pi^2n^4e^{9u}-3\pi n^2e^{5u})e^{-\pi n^2e^{4u}},\quad u\ge0.
\]

The selected 1–12-term approximation is compared with a 24-term reference and with the existing evaluated ξ through

\[
\int_0^\infty\Phi(u)\cos(\xi u)\,du=\xi(\tfrac12+i\xi/2)/8.
\]

The displayed integral uses Simpson quadrature on [0,1.5]. Its discrepancy is numerical evidence, not a certified infinite-series or integration-tail bound. The variable (u) is Mellin-dual to the spectral coordinate; it is not a torus angle.

The second experiment takes κ(v)=Φ(v/4), (b_j=.15j), (c=(-2,9,-19,24,-19,9,-2)), and computes

\[
Q(a)=\sum_{j,k}c_jc_k\kappa(a+b_j-b_k)\kappa(a-b_j+b_k),
\qquad\int_0^4 2a\sinh(xa)Q(a)\,da.
\]

Here `researchA` is labeled **Mellin tilt (x)**. Finite theta sums are first computed for nonnegative arguments and then reflected, Φₘ(|u|). That is a defined even approximation; the unreflected individual partial series is not globally even. The full kernel's evenness comes from its modular identity.

The floating-point recomputation reproduces (Q(1/20)\approx-0.000908036036923) and the integrated direction at (x=.25), approximately (+0.001619366968247). PR43 separately gives an interval certificate for the full-kernel layer. This application's floating-point result does not inherit that certificate. A negative individual layer and a positive integrated value for one vector establish neither a universal obstruction nor global positivity.

## 6. Shifted ratio and synthetic poles

The path uses the current evaluator, in common log-polar form:

\[
R_a(s)=F(s-a)/F(s+a).
\]

A zero of (F) at λ gives a numerator candidate at λ+a and a denominator candidate at λ−a. Orders at coincident locations must be combined before labeling a zero or pole. In particular, an uncancelled pole at λ−a has order ([m(\lambda)-m(\lambda-2a)]_+).

The explicit ghost control multiplies the function by

\[
[(w-i\gamma)^2-\delta^2][(w+i\gamma)^2-\delta^2],\quad w=s-\tfrac12.
\]

It changes the function and inserts a chosen symmetric quartet; it is not an inferred off-axis ξ zero. Candidate orders are combined for the markers. At an exactly common zero, the sampled unreduced quotient remains explicitly unresolved instead of inventing a limit. Undeformed known ξ heights are used only as reference markers in ξ mode; they are not relabeled as heat zeros.

Vertical paths, circles, and bridge-width sweeps have 241 cached samples. Animation chooses a prefix using `researchFrame`; changing a frame does not re-evaluate the function. Ratios outside the affine display range introduce line breaks instead of false segments through poles. The logarithmic-modulus plot retains finite values beyond that display cutoff. A finite path staying in the unit disk is not a global Schur test.

## API and verification

Each `compute*` function accepts normalized flat research state and returns plain structured data:

```js
{ title, subtitle, formula, scope,
  metrics: [{label, value}],
  plots: [{kind: 'heatmap' | 'lines' | 'complex' | 'matrix' | 'bars', ...}],
  details: [string] }
```

Heatmap rows increase from `yMin` upward. Null samples are masks; null line points are breaks. Numerical compute functions contain no DOM, network, or drawing code. The worker and panel own scheduling and rendering.

`node --test tests/research-math.test.mjs` verifies 14 grouped invariants: shear/bridge scaling, modal geometry, boundary-density moments, independent quadratic energy formulas, actual ξ/heat boundary identities and endpoints, complex Hermitian eigenpairs, Schur inertia and singular rejection, bridge/Pick congruence, the separate real-node kernel and restored profiles, divisor/product identities including removable singularities, theta reference values, ratio evaluator agreement and frame caching, synthetic common-factor handling, and finite-or-masked plot data.
