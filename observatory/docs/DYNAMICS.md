# Active dynamics and zero experiments

The dynamics lab contains evaluated ξ fields, deformed fields built from ξ,
and explicitly finite numerical models. Its Play button advances a fixed-step
experiment. It does not make the zeros of a fixed function move merely by
animating tracers or changing their color.

The implementation is [`dist/dynamics.js`](../dist/dynamics.js). Snapshots carry
`meta.kind`, `meta.equation`, `meta.note`, and `source` so the renderer can state
which object is evolving. The modules have no DOM, animation-frame, or network
dependencies. A renderer draws the prepared snapshot and never evaluates ξ.

## Provenance and what was transferred

The Math Explorer source was inspected at commit
[`942ba1760c4ef54a519750ab91c37a661c31e0ce`](https://github.com/judegomila/mathexplorer/tree/942ba1760c4ef54a519750ab91c37a661c31e0ce).
The relevant primary implementation files are:

- [`DeBruijnDepartureViz.jsx`](https://github.com/judegomila/mathexplorer/blob/942ba1760c4ef54a519750ab91c37a661c31e0ce/src/components/DeBruijnDepartureViz.jsx): finite coefficient heat, the four real-root presets, and the range `−1.6 ≤ τ ≤ 0.8`.
- [`VortexFieldPage.jsx`](https://github.com/judegomila/mathexplorer/blob/942ba1760c4ef54a519750ab91c37a661c31e0ce/src/pages/VortexFieldPage.jsx): a finite product over a window of known zero heights and finite Dyson evolution. Its continuation after a small-gap threshold imposes an off-axis square-root split and freezes spectators. This heuristic continuation is **not** used here; the exact cubic provides an explicitly solvable collision instead. The source's streamline calculation sums the gradient of log modulus, despite its phase-flow prose.
- [`imp-857-phase-locked-dyson.mjs`](https://github.com/judegomila/mathexplorer/blob/942ba1760c4ef54a519750ab91c37a661c31e0ce/src/math/imp-857-phase-locked-dyson.mjs): reverse-time finite Dyson drift with a traveling cosine force. Its forcing choices `0, 0.01, 0.05` are retained. The original experiment concerns interval-width growth; this display does not reproduce or certify those interval calculations.
- [`imp-857-phased-forcing-memo.js`](https://github.com/judegomila/mathexplorer/blob/942ba1760c4ef54a519750ab91c37a661c31e0ce/src/math/imp-857-phased-forcing-memo.js): motivation and outstanding conditions for that forced prototype.

The repository search did not locate a matching implementation of the requested
spatial random-walk, bounded spatial heat, or conformal transverse-trap controls.
Those controls are new, explicit visualization extensions using the supplied
log-modulus/phase and κ-profile constructions. They are not presented as a
verbatim recovery of an unsynced manuscript. Math Explorer's separate Θ
collision-barrier diagnostics are also different from the κ transverse trap.

## Coordinate, field, and time conventions

The spectral coordinate is `s = σ + it`; `t` increases upward on the canvas.
The actual ξ experiments use `−0.75 ≤ σ ≤ 1.75` and a window of half-height
3.2 around the first zero, `t₀ ≈ 14.134725141734693`. Known zero heights seed
initial displays; evaluated ξ zeros are independently located by the displayed
field's winding and Newton refinement.

For an analytic field `F`, put `U = log|F|`, `Φ = arg F`, and
`q = F′/F = a + ib`. The Cauchy–Riemann equations give

\[
\nabla U=(a,-b),\qquad \nabla\Phi=(b,a),\qquad
v=-\alpha\nabla U+\beta\nabla\Phi
 =(-\alpha a+\beta b,\alpha b+\beta a).
\]

The numerical kernel supplies log-polar ξ and `q` directly. This avoids treating
small raw ξ values caused by its Gamma factor, or underflow, as zeros.
The drift is capped at speed 1.5 spectral units per experiment unit. Away from
the boundary this positive scalar cap changes a deterministic trajectory's
parametrization. Fixed-step integration and boundary handling still introduce
numerical error. Drift uses RK4 with step `du = 0.02`.

### Evaluated ξ circulation and relaxation

`phase` uses `α = 0`; `relax` uses `β = 0`. The function and its zeros remain
fixed. A phase tracer circles a simple local zero; a modulus-descent tracer
approaches it. These are trajectories in a scalar field, not trajectories of
the function's zeros.

Relaxation captures a tracer only after a small scale-free correction `|1/q|`
triggers Newton refinement. The final correction must be below `10⁻⁷`, the
candidate must remain in the domain and within 0.05 of the tracer, and it must
show strong correction contraction, agree with a separately detected winding
zero, or evaluate to a log-polar zero with nonzero derivative. A small `|1/q|`
alone is insufficient: for example `exp(1000s)` has `|1/q| = 0.001` everywhere
and has no zeros. Capture is a numerical display convention, not an interval
certificate or a statement that the continuous singular ODE has been integrated
through a zero.

### Seeded random walks

`walk` adds independent two-dimensional Gaussian increments:

\[
dS_u=(-\alpha\nabla U+\beta\nabla\Phi)\,du+\sqrt{2D}\,dW_u.
\]

Each fixed step uses the deterministic RK4 drift followed by a Gaussian
Euler–Maruyama kick of component variance `2D du`. Mulberry32 and a Box–Muller
transform make the sequence reproducible from the unsigned seed. Walkers do
not become permanently captured. `reflect` reflects a crossed coordinate back
into the finite rectangle; `pin` stops a walker on its first boundary hit.
Neither boundary rule moves a ξ zero.

### Active shifted-field interference

`cancel` evaluates the analytic combination

\[
G(s,u)=\xi(s+a)-c\,e^{i(\phi+\omega u)}\xi(s-a).
\]

The shift `a`, relative amplitude `c`, starting phase `φ`, and phase rate `ω`
are controls. `ω = 0` freezes the field. Positive `ω` changes the combination
and can move its actual numerical zeros. These are zeros of **G**, not newly
discovered zeros of ξ. Multiplying ξ alone by a global phase cannot change its
modulus or zero set.

The two shifted ξ grid records and their analytic derivatives are sampled once
at reset. Animation mixes those cached complex records with a common local
log scale. Tracer stages and zero refinements evaluate the analytic G directly.
Absorbing tracer capture is enabled only when the interference field is frozen;
moving G zeros are marked separately from the tracers following its field.

## Bounded two-dimensional heat

`heat` is ordinary complex diffusion on a rectangle:

\[
\partial_u f=D(\partial_\sigma^2+\partial_t^2)f.
\]

The real and imaginary parts of analytic ξ are harmonic. Applying this planar
Laplacian to unperturbed ξ is therefore **not** an analytic zero-motion
mechanism. The lab instead samples ξ with one common real amplitude scale and
adds an explicit nonholomorphic seed-dependent perturbation. In normalized
rectangle coordinates `X,Y ∈ [0,1]`, the perturbation is

\[
\epsilon\sin(\pi X)\sin(\pi Y)
\left[\cos(2\pi X+A)\cos(\pi Y+B)
+i\sin(2\pi Y+B)\cos(\pi X+A)\right],
\]

where `A,B` are determined by the seed. The perturbation vanishes at the
boundary. `ε = 0` removes it. A reflecting finite domain can still alter the
boundary behavior of a harmonic sample because its normal derivative need not
vanish.

`pin` retains the initial complex values at the outer grid nodes. `reflect`
uses a symmetric graph Laplacian with no outgoing edge at the boundary, a
finite-grid zero-flux convention. Forward Euler substeps satisfy

\[
2D\,\delta u\left(h_\sigma^{-2}+h_t^{-2}\right)\leq0.9.
\]

The reflected graph scheme preserves the discrete complex mass and decreases
its discrete squared norm. Pinned, nonzero boundary data need not conserve mass
or decrease that norm. The separate discrete gradient energy is also reported.
The snapshot exposes the actual scaled complex grid, its common log scale,
mass, squared norm, gradient energy, and substep count.

This generally nonanalytic field uses separate finite-grid derivatives for
`∇U` and `∇Φ`. Its vortices can have positive or negative winding, move, and
cancel. Bilinear interpolation and a two-variable Newton solve refine their
display positions. They are grid vortices, not ξ zeros. There is no inverse
heat button, no claim to resolve every zero, and no identification with the
de Bruijn–Newman parameter.

## Finite trapping and the sign of heat time

For polynomial de Bruijn heat,

\[
\partial_\tau P=-P_{zz},\qquad
\frac{dz_j}{d\tau}=\frac{P_{zz}(z_j)}{P_z(z_j)}
=2\sum_{k\ne j}\frac1{z_j-z_k}
\]

at simple zeros. Mapping `s = 1/2 + i t₀ + iz/2` gives
`ds_j/dτ = −(1/2) Σ 1/(s_j−s_k)`. The trap experiment runs **reverse heat
time** `u = −τ`, which changes that sign. This matches Math Explorer's
positive-step convention for attractive real-zero Dyson motion:

\[
\frac{ds_j}{du}=\frac12\sum_{k\ne j}\frac1{s_j-s_k}
-\kappa(t_j)(\sigma_j-\tfrac12)
+\frac{i\varepsilon}{2}\cos(k_0 g_j-\omega u),
\quad g_j=2(t_j-t_0).
\]

Six initial heights come from the first six ξ zeros, centered and divided by
their mean gap to give a local finite configuration. Their transverse offsets
are seeded perturbations. This unfolding is a display model; these evolving
points are not evaluations of the full ξ zero evolution. The cosine forcing
uses `k₀ = π`, fixed initial mean-density tuning, and
`ε ∈ {0,0.01,0.05}`. The source's interval integrator and its empirical
wrapping-width conclusions are not imported.

The imposed positive profile uses an explicit finite choice of the proposed
prime-frequency form:

\[
\kappa(t)=K\left[1+\eta\sum_{(p,m)}a_{p,m}
(1-\cos(tm\log p))\right],\qquad
a_{p,m}\propto (\log p)p^{-m/2},\quad\sum a_{p,m}=1,
\]

with `(p,m) = (2,1),(2,2),(3,1),(3,2),(5,1),(7,1)` and
`η = dynamicsPerturbation`. The transverse restoring term is an explicitly
added mechanism. It is not claimed to follow automatically from the conformal
metric `exp(2κ(t)x²)` or from ξ itself.

At a configuration of distinct projected heights, the transverse linearization
has the form `ẋ = (L−diag κ)x`, with weights
`w_jk = 1/[2(t_j−t_k)²]`, `L_jj = Σ_k w_jk`, and `L_jk = −w_jk`.
The reported margin is the smallest eigenvalue of `diag κ−L`. A positive
margin describes instantaneous contraction of that frozen linearization; it
does not prove global trapping while the heights evolve. When projected
heights coincide, this linearization is undefined and the margin is reported
as unavailable. The finite solver uses midpoint integration, caps model-point
speed at 3, and stops when a complex pair separation falls below 0.045.

## Exact finite polynomial heat and collisions

For ascending initial coefficients `a_k`, the implementation evaluates

\[
P_\tau=e^{-\tau\partial_z^2}P_0,\qquad
c_k(\tau)=\sum_{j\geq0}\frac{(-\tau)^j}{j!}
\frac{(k+2j)!}{k!}a_{k+2j}.
\]

The sum is finite. The imported presets are:

| Preset | Initial real roots |
| --- | --- |
| Six real | `−2.5, −1.5, −0.5, 0.5, 1.5, 2.5` |
| Lehmer-like | `−3, −1.2, −0.18, 0.18, 1.2, 3` |
| Eight real | `−3.5, −2.5, −1.5, −0.5, 0.5, 1.5, 2.5, 3.5` |
| Quartet | `−1.6, −1.2, 1.2, 1.6` |

The additional exact cubic is

\[
P_\tau(z)=z(z^2+b^2-6\tau),\qquad
z=0,\ \pm\sqrt{6\tau-b^2},\qquad \tau_c=b^2/6,
\]

with `b = 1` in the control view. It crosses a multiple zero without dividing
by a singular zero velocity. For the other presets, coefficients are evaluated
directly and an Aberth solver finds all degree-many numerical roots. The
reported residual is `|P(z)|/[1+Σ|c_k||z|^k]`; small residuals alone do not
certify root accuracy near multiplicities. Minimum-displacement matching keeps
display trails continuous where possible. There is no canonical identity for
individual roots through a multiple collision.

The animation sweeps `τ` from `0.8` to `−1.6` and back at 0.15 τ units per
experiment unit. `τ` is shown separately from the experiment clock. Finite
polynomial collisions, including departures from the real z axis, do not
establish a result about ξ, the Riemann hypothesis, or the Newman constant.
The renderer's separate theta-integral heat preset retains its own convention
`Fτ(s) = 8Hτ(−2i(s−1/2))`, hence `∂τF = (1/4)Fss` and simple-zero velocity
`ds/dτ = −Fss/(4Fs)`. See the kernel's [primary-source normalization link](https://terrytao.wordpress.com/2018/01/19/the-de-bruijn-newman-constant-is-non-negativ/).

## Replay, bounds, and zero diagnostics

- An experiment is specified by its allowlisted controls, unsigned seed, and
  exact integer step. The maximum is 2400 steps, or 48 experiment units.
  Rendering rate changes wall-clock playback, not the fixed mathematical step.
- `new DynamicsSimulation(state, {sampler})` starts at step zero.
  `step(n)` replays n steps; `reset(state)` restores the seeded initial state.
  `snapshot()` returns the prepared state without evaluating a function.
  The optional sampler and domain are used by independent numerical tests.
- Default grids are 48 by 72. Static ξ grids are sampled only at reset;
  interference grids mix cached shifted samples; bounded heat evolves its
  stored complex grid; finite polynomial grids use the finite model.
- Winding is the sum of wrapped phase increments around a grid cell. A marked
  analytic zero additionally passes Newton refinement with a final correction
  below `10⁻⁶`. Failed refinements contribute to `unresolvedWindingCells`
  instead of being labeled confirmed zeros.
- Finite grids can miss close pairs, boundary roots, and rapidly varying phase.
  No displayed zero count is a completeness certificate. The arithmetic is
  double precision; no interval enclosure or theorem claim is attached to a
  trajectory, a root marker, or a positive trap margin.

