# zeta-view — Zeta Observatory

A dedicated mathematical geometry workbench for the Riemann zeta function, with private source at [judegomila/zeta-view](https://github.com/judegomila/zeta-view).

The app is self-contained and runs on any static HTTP(S) host. Vercel serves `dist/` using `vercel.json` and prepares the projective numerical pack during deployment. Local serving requires no build, ChatGPT runtime, API key, or database. The application keeps the Zeta Observatory name.

The projective atlas, linked bridge/Bloch point state, derivative disk, spinor lift, and chosen Euclidean twistor view are implemented. See [the spinor and twistor conventions](docs/SPINORS-TWISTORS.md) and [the development roadmap](docs/ROADMAP.md) for their scope. The Research workspace adds bridge shear, modal signs, even/odd boundary energies, finite Gram/Schur diagnostics, theta/arithmetic cancellation, prime-mode mixing, ratio paths, pulse response, and actual complex heat-zero continuation.

## Features

- Euler–Maclaurin analytic continuation of ζ, completed ξ, and the actual theta-integral de Bruijn–Newman family.
- Complex phase, modulus, real/imaginary sign, normalized bridge balance, and logarithmic shear; logarithmic or signed height surfaces.
- Plane, inverse stereographic sphere, and the exact elliptic double cover from Math Explorer PRs 43 and 49.
- A Projective toggle with a domain sphere or elliptic torus, reciprocal charts, infinity/anti-bridge markers, branch cuts, and linked two-sphere and homogeneous-coordinate readouts.
- Selected-point domain, shifted-pair Bloch sphere, and derivative Cayley disk, with scale-safe polar arithmetic and explicit unresolved states.
- Spinor/Hopf view with a common-phase fiber, SU(2) rotation, amplitude phases, and the visible 2π sign change / 4π return.
- A chosen Euclidean ℂℙ³ → S⁴ twistor map, complete ℂℙ¹ fiber controls, elliptic sheet selection, north/south charts, and source-versus-moved quadric residuals.
- Spectral infinity end and fixed-strip charts, positive Gaussian display damping, and the elliptic curve's projective conormal family with exact infinity anchors.
- Critical line/two ovals, reference zero markers, limited sampled heat roots, Re/Im contours and transported phase-gradient streamlines.
- Surface-conforming conjugate-aligned twin ladders and finite prime-power packet experiments with independent display time.
- A freshly evaluated point inspector, sampled contour winding, critical-line profile and linked phase atlas.
- Exact numerical fields reused from a bounded memory cache, best-effort IndexedDB storage, and an on-demand starter pack.
- Fully buffered heat playback with 9, 17, or 33 independently evaluated frames, frame scrubbing, explicit forward/reverse direction, and a common locked height reference.
- Automatically updated shareable view URLs, including selected controls, camera and inspected point; browser-local viewpoints and observations, portable session JSON, numerical grid CSV and PNG snapshots.
- GPU rendering plus an automatic Canvas2D 3D fallback using the same mathematical mesh.

## Use the zero channels workspace

Choose **Channels** beside the main geometry buttons. The native workspace uses the full plotting width and contains the same moving-channel, coupling, and Newton experiments as the standalone laboratory:

- [Moving channels](https://zeta-view.vercel.app/?view=channels)
- [Certified quartet channels at tau = -0.13](https://zeta-view.vercel.app/?view=channelsQuartet)
- [Coupling network](https://zeta-view.vercel.app/?view=coupling)
- [Newton guidance](https://zeta-view.vercel.app/?view=newton)

The main app owns the address bar and saved sessions. Changes to the model, view, heat frame, selected branch, direction, disk radius, or probe settings update the current URL. **Copy view link**, **Save view**, and **Export session** retain the selected state; restored views open paused. The controls and plots are scoped inside the app rather than opening a separate page. The standalone laboratory remains available at `experiments/zero-channels.html`.

The existing certificates retain their exact scope: four disjoint quartet channels on `-0.13 <= tau <= 0`, and one fixed first-root theta disk of radius `0.35` on `-0.05 <= tau <= 0.05`. Other theta trajectories are numerical. Resized disks, collisions, and off-line departures retain their explicit status. See [the mathematical derivations and verifier](docs/ZERO-CHANNELS-MATH.md) and [the Zeta Explorer research log](https://github.com/judegomila/mathexplorer/pull/57).

## Use the projective views

Direct entry links on any host are [`?view=projective`](https://zeta-view.vercel.app/?view=projective), [`?view=projectiveSphere`](https://zeta-view.vercel.app/?view=projectiveSphere), [`?view=spinor`](https://zeta-view.vercel.app/?view=spinor), and [`?view=twistor`](https://zeta-view.vercel.app/?view=twistor). They select the corresponding preset regardless of an older browser-local view.

1. Click **Projective** beside Plane, Sphere, and Torus. Alternatively choose **Projective · elliptic double cover** or **Projective · domain sphere** under Starting point.
2. In **Projective geometry**, select **Elliptic torus Eᵣ** or **Projective sphere ℂℙ¹** as the Domain view. The main viewport fills the available screen height; its phase, relief, twin ladder, and other existing layers remain available.
3. Choose a Point state: **Domain [s₀−1:s₀]**, **Shifted pair [U:V]**, or **Derivative disk**. The derivative case exposes its positive scale ℓ.
4. Click a surface point, enter coordinates in the inspector, or use the **Anti-bridge · ½** and **First ξ zero** shortcuts. **Open the linked point panels** moves to the workbench below the viewport: a target sphere/disk and a two-sphere atlas with crosswise branch cuts. Both follow the inspected point.
5. Use **Original projective chart · L = 1** for the literal construction from the projective notes. The presets start at **r = 2, L = 24** to separate high zeros visually. Selecting an ordinary Plane, Sphere, or Torus button leaves projective mode.

The domain chart is

```text
s₀ = 1/2 + (s - 1/2)/L,
w = [s₀ - 1 : s₀],
s = 1/2 + L(1/(1-w) - 1/2).
```

At L = 1 this is exactly w = (s−1)/s. The critical line becomes |w| = 1. Spectral infinity is **w = 1**; the anti-bridge is **w = −1**, at s = 1/2. The reciprocal-chart point **w = ∞** is regular and maps to finite s = 1/2 − L/2. These points have different markers and are never conflated. Increasing L changes the finite spectral chart explicitly; it does not extend the evaluator to infinity.

The elliptic cover is η² = (w² + r²)(w² + r⁻²), with branch values ±ir and ±i/r. Its two sheets are joined crosswise along the marked cuts. The inspector records the projective point [X₀:X₁:X₂:X₃] = [1:w:w²:η] in a scale-safe chart, satisfying

```text
X₁² = X₀X₂,
X₃² = X₀² + (r² + r⁻²)X₁² + X₂².
```

The three-dimensional torus is a display embedding of this elliptic surface; the coordinate readout supplies the ℂℙ³ model. Each ordinary ξ zero has two lifts with the same local winding in the holomorphic orientation. The anti-bridge of ξ is a nonzero phase saddle, not an additional zero. Opposite zero/pole winding in the shifted ratio can cancel in a contour count; this does not cancel the zeros of ξ.

The point-state channels have separate meanings:

| Point state | What is displayed |
| --- | --- |
| Domain | The input coordinate [s₀−1:s₀], switching between w and 1/w as needed. |
| Shifted pair | [U:V] = [G(s+a):G(s−a)] on a Bloch sphere. The vertical coordinate is (|U|²−|V|²)/(|U|²+|V|²); the other coordinates retain relative phase. |
| Derivative disk | C = (G−ℓG′)/(G+ℓG′). Where G is nonzero and the chart is finite, |C| < 1 corresponds to Re(G′/G) > 0. |

The bridge and derivative channels use G = ξ, or the actual heat family Fτ when Heat is selected. They retain log-polar information when raw values underflow. Simultaneous homogeneous zeros and ill-conditioned signs are marked unresolved. Every simple function zero maps to C = −1 regardless of its input location, so this display alone does not constrain zero locations. Infinity remains a puncture of the pulled-back transcendental function; no limiting phase or function value is assigned there.

Projective point calculations pause during buffered playback. Pause and inspect a coordinate to refresh them. Saved views and session exports retain the projective mode, selected channel, lens, and derivative scale.

### Spinor and twistor controls

Choose **Spinor** in the fiber controls, or open `?view=spinor`, to lift the selected Domain, Shifted pair, or Derivative state to a normalized two-component spinor. **Common phase** changes its Hopf fiber while holding the Bloch direction fixed. **Rotation** and **Axis** apply the spin-one-half SU(2) rotation: at 2π the normalized amplitudes change sign, and at 4π they return. The reference overlap and orthonormal frame make the distinction visible. These controls transform the displayed channel state; they do not evolve ξ or move its zeros.

Choose **Twistor**, or open `?view=twistor`, to use the selected elliptic homogeneous quartet. The sheet selector first chooses the source lift or its deck partner. The two fiber angles cover a full ℂℙ¹, and the north/south selector changes the stereographic chart of the same S⁴ base. Three of the resulting four real chart coordinates are drawn spatially and the fourth is retained separately. A genuine chart pole is marked as infinity.

The twistor mode explicitly chooses the quaternionic structure `(X₀ + jX₁, X₂ + jX₃)`. The curve's embedding in ℂℙ³ alone does not canonically choose it. A generic fiber motion leaves the elliptic curve: the source and moved quadric residuals are displayed separately, and the moved point receives no inherited s or ξ value. A local common-phase gauge is used for the fiber controls; its chart can change as the source point moves. The derivation, conventions, sources, and mathematical limits are in [SPINORS-TWISTORS.md](docs/SPINORS-TWISTORS.md).

### Hole at infinity, Ultimate views, and a complete count to height T

- **Hole at infinity** (`?view=holedKlein`, or the toggle under Infinity display on any curved shape): removes the open disc `|s − ½| > ρ` around spectral infinity, leaving a compact surface with a boundary rim. The rim is centred on the anti-bridge, so the Klein and annulus identifications preserve it. Nothing inside is evaluated, filled or damped. The radius ρ is a chosen cutoff, not a canonical one, and the essential singularity is excised, not removed: its content is carried by the values on the rim.
- **Ultimate** (toolbar button, or `?view=ultimatePlane|ultimateSphere|ultimateTorus|ultimateKlein|ultimateAnnulus`): relief, zeros, twin ladder, packets, phase flow, bridge and anti-bridge together on the current shape. Curved shapes use completed ξ. On Klein the relief stays flat and phase flow stops at the seam.
- **Complete count to height T** (inspector): compares the argument-principle count of every zero with `0 < Im s < T` in the strip against the sign changes of Hardy's `Z` on the line. Agreement means every zero below T is on the line and simple. This is a floating-point verification to that height (`dist/zero-count.js`), not an interval-arithmetic certificate, and says nothing above T.

- **Zero traps** (Geometric layers): one disc per tracked zero, centred on the critical line so the reflection `s → 1 − conj(s)` maps it to itself. A disc holding exactly one zero of the completed function must hold it on the line. Green marks the single shipped Arb/Rouché certificate (first zero, radius 0.35, |τ| ≤ 0.05); amber means a floating-point winding count of one; red means unresolved. Finitely many traps say nothing about the remaining zeros.
- **Fall lines** (Geometric layers): test particles released on a grid and moved by the Newton flow `−F/F′`. Each path keeps a constant phase while `|F|` decays, so it runs into a zero wherever that zero is. The particles probe the fixed field; the zeros themselves do not move, and this is not an argument about where zeros must be.

### Klein quotient and reflection annulus

Open [Klein](https://zeta-view.vercel.app/?view=klein) or [Annulus](https://zeta-view.vercel.app/?view=annulus) in the toolbar, the starting-point menu, or the projective domain selector. Both use the exact half-torus fundamental region of the existing Jacobi chart; they are genuine quotients of the elliptic double, with the original torus retained for comparison.

- **Klein:** the free antiholomorphic involution `A(w,η) = (1/conj(w), −conj(η)/conj(w)²)` pairs the two infinity lifts and the two anti-bridge lifts. The boundary seam reverses the periodic coordinate and conjugates the field. The single critical loop does not separate the surface. The 3D figure-eight immersion has visual self-intersections; those are not additional identifications. Scalar normal relief is disabled because the surface is nonorientable.
- **Annulus:** the reflection `R(w,η) = (1/conj(w), conj(η)/conj(w)²)` keeps the two critical ovals as separate boundary circles. Away from the infinity punctures, `Im F = 0` and the outward normal derivative of `Re F` is zero. This exposes boundary data without asserting an energy inequality.

These modes use completed **ξ** or its symmetric **heat family**. Raw ζ does not obey the required simple conjugation law, so selecting a quotient changes ζ to ξ and disables the ζ option there. Local phase and imaginary sign are chart-dependent in the Klein view. The linked projective point panels continue to show the orientable double.

The quotient panel includes an intrinsic seam diagram, probe/partner diagnostics, paired landmark explanations, and direct links to the existing even/odd energy and Gram/Schur experiments. It states the exact limitation: the two-dimensional Dirichlet energy densities of the real and imaginary parts of a holomorphic field are equal. They are not the bridge experiment's even-minus-odd boundary energy. Infinity remains an essential puncture, so finite cutoff energies cannot silently be promoted to a finite global energy or a no-escape theorem.

The derivation, annulus Dirichlet-to-Neumann reference operator, remaining coercivity target, and a symmetry-preserving off-line-zero counterexample are in [KLEIN-ANNULUS.md](docs/KLEIN-ANNULUS.md). Settings, inspected points and cameras share through the existing URL/session controls; quotient fields have distinct numerical cache keys.

### Infinity ends, a damped display, and the dual conormal

| View | Direct link | What to inspect |
| --- | --- | --- |
| Infinity end | [?view=infinityEnd](https://zeta-view.vercel.app/?view=infinityEnd) | The local coordinate q = 1 − w near either spectral puncture, its conjugating Klein partner, and finite evaluation coverage. |
| Fixed strip ends | [?view=stripEnds](https://zeta-view.vercel.app/?view=stripEnds) | The real offset σ − ½ retained across logarithmic-height and reciprocal-height charts, with separate upper and lower ends. |
| Damped Klein display | [?view=smoothKlein](https://zeta-view.vercel.app/?view=smoothKlein) | Positive Gaussian attenuation on the existing completed field. |
| Dual conormal | [?view=dualTwistor](https://zeta-view.vercel.app/?view=dualTwistor) | The ℂℙ¹ family of tangent hyperplanes at the selected point or an exact infinity, anti-bridge, branch, or reciprocal-chart anchor. |

The end charts evaluate finite spectral points only. Gray and hatched regions distinguish unavailable or unresolved samples from known values. The finite-cutoff boundary diagnostic does not certify the remaining tail or a global energy bound. The Klein partner uses the exact nonlinear end-coordinate transformation and the completed function's conjugating symmetry.

The Gaussian weight is exp(−|s−½|²/S²), with default scale S = 120. It preserves every finite zero and the phase away from zeros; it changes amplitudes and makes the weighted field nonholomorphic. For ξ, the weighted field admits a smooth, flat extension by zero at the spectral punctures, while ξ itself remains essential there. The renderer keeps raw samples, inspected values, cached fields, and bridge calculations unchanged. The end panel has its own exact/damped display control. No phase or original-function value is assigned to infinity.

The dual view displays the family W = λ dQ₁ + μ dQ₂ for the two defining quadrics. It reports the bilinear point and tangent incidence residuals W·Z and W·T. There is a family of tangent hyperplanes, not a unique curve normal. Exact geometric infinity anchors require no ξ evaluation. See [the derivations and limits](docs/INFINITY-ENDS-DUAL.md) for the seam, strip metric, smooth-extension proof, full-energy distinction, and conormal conventions.

### Share exactly the current view

The address bar updates automatically as views, controls, the inspected point, or the camera change. Copy the current URL, or use **Copy link**, to reopen the same configuration elsewhere. The short `view` name is accompanied by exact state, probe, and camera overrides when needed. Discrete view changes participate in browser Back/Forward navigation; slider and camera updates replace the current history entry.

Loading a shared URL takes precedence over a saved local view. Links restore a paused scene and do not include notebook notes or computed arrays. Legacy `#view=…` links still load. The view is recomputed or loaded from its exact cache as usual, so a share link does not require somebody else's browser storage.

## Play the dynamics experiments

Open **Dynamics** in the top toolbar, or choose a dynamics starting point:

| URL preset | What evolves |
| --- | --- |
| `?view=dynamics` | Tracers circulating through the actual completed ξ phase field |
| `?view=relaxation` | Dissipative probe trajectories in that fixed field |
| `?view=randomWalk` | Seeded, bounded spectral-plane random walks with adjustable drift |
| `?view=phaseCancel` | The additive shifted field ξ(s+a) − A exp(iφ) ξ(s−a) |
| `?view=boundedHeat` | A perturbed complex grid under spatial diffusion in a bounded box |
| `?view=zeroTrap` | A finite interacting-zero model with imposed confinement and optional forcing |
| `?view=heatCollision` | Exact coefficient heat evolution of finite polynomials and numerical root tracking |

Use **Play**, **Step**, **Reset**, **Perturb**, and the simulation-step slider. The controls expose the seed, drift, circulation, diffusion, interference, and model parameters relevant to the selected experiment. Phase color, velocity, trails, and zero markers can be shown independently. The live diagnostics identify whether the picture uses actual ξ samples, a numerical grid, or an explicit finite model.

The URL stores the seed, parameters, overlays, and fixed simulation step. It updates during playback at a bounded rate and captures the current step exactly on Pause or Copy view link. Opening a link reconstructs that step and stays paused. Random walks are reproducible in the same numerical engine; they are not intrinsic Brownian motion on the sphere or torus.

The finite-polynomial collision presets carry across the six-real, Lehmer-type, eight-real, and quartet experiments from Math Explorer, with an exact cubic collision example. **Open actual theta heat** returns to the existing independently evaluated de Bruijn–Newman family. The bounded spatial heat grid and the finite zero-interaction model are separate experiments. Full equations, provenance, numerical choices, and limits are in [docs/DYNAMICS.md](docs/DYNAMICS.md) and the in-app methods reference.

## Explore the bridge research

Click **Research** in the toolbar or choose a starting point under **Bridge research**. Each experiment has a direct route:

| View | Direct link | What is computed |
| --- | --- | --- |
| Bridge shear | [`?view=bridgeShear`](https://zeta-view.vercel.app/?view=bridgeShear) | Smooth signed shear, logarithmic shear, phase and the finite bridge |
| Modal sign switching | [`?view=modalSigns`](https://zeta-view.vercel.app/?view=modalSigns) | Exact quadratic sign regions and the first modal witness |
| Even & odd energy | [`?view=bridgeEnergy`](https://zeta-view.vercel.app/?view=bridgeEnergy) | Boundary energy decomposition, direct shear and quadrature residual |
| Gram & Schur | [`?view=gramSchur`](https://zeta-view.vercel.app/?view=gramSchur) | A finite Hermitian matrix, spectrum, weakest mode and frozen-block complement |
| Theta cancellation | [`?view=thetaCancellation`](https://zeta-view.vercel.app/?view=thetaCancellation) | Divisor sums, their factorization and theta-kernel contributions |
| Prime-mode mixer | [`?view=primeModes`](https://zeta-view.vercel.app/?view=primeModes) | Signed finite prime/power oscillators with solo and mute |
| Ratio & poles | [`?view=ratioPoles`](https://zeta-view.vercel.app/?view=ratioPoles) | Analytic shifted-ratio paths and optional synthetic quartet factors |
| Pulse response | [`?view=bridgePulse`](https://zeta-view.vercel.app/?view=bridgePulse) | Finite periodic Fourier multiplier, norm and tail measurements |
| Heat-zero motion | [`?view=heatZeros`](https://zeta-view.vercel.app/?view=heatZeros) | Complex theta-root continuation and an exact quartic calibration |

Controls, nodes, model choice, overlays and the displayed frame are included in the URL. Play updates it at a bounded cadence; Pause, Copy view link, session export and saved views flush the exact frame. Opening a link restores a paused experiment. The calculations run in a dedicated worker, with coalesced requests so changing controls stays responsive.

**Open on surface** takes the analytic probe to the main renderer. The new **Logarithmic shear** color is `tanh Re(F′/F)` for the displayed function; its signed color can be mounted on the plane, sphere or torus. Its derivative payload has a separate cache key. The main colorful surface retains the taller viewport.

The calculations are numerical experiments with stated scopes. A negative individual arithmetic block does not settle the full form. A finite positive matrix does not establish all-order positivity. The prime mixer is an explicit oscillator model. Pulse response uses a finite periodic window. The optional quartet changes the model function and does not insert a zero into xi.

For the actual heat family, `∂τ F = F_ss/4` and a simple zero satisfies `ρ′ = −F_ss/(4F_s)`. With `x = Re ρ − 1/2`, the distance diagnostic is `(x²)′ = −x Re(F_ss/F_s)/2`. It is undefined at multiple roots. The heat view reports root residuals, local conditioning and sampled contour margins; it does not certify an entire zero-free boundary or a global no-escape theorem. See [the bridge research definitions](docs/BRIDGE-RESEARCH.md) and [the no-escape analysis](docs/NO-ESCAPE.md).

## Run locally

This is a buildless static app. All runtime dependencies are included in `dist/`.

```sh
python3 -m http.server 8080 --directory dist
```

Open `http://localhost:8080`. The module worker requires HTTP(S); opening `index.html` directly as a file will not work.

```sh
npm test
```

## Continue development and deploy

```sh
git clone https://github.com/judegomila/zeta-view.git
cd zeta-view
python3 -m http.server 8080 --directory dist
```

Edit the source modules directly in `dist/`. They are the maintained application source, not disposable build output. Run `npm test` after numerical or rendering changes. The checked-in runtime dependencies make both serving and the Node.js test suite usable without an install step. The optional Python reference generators require `mpmath`.

Vercel configuration is in `vercel.json` (Other framework, output `dist`, no install command). Its build command runs `node scripts/build-projective-precache.mjs` to extend the shipped pack with default projective fields. Connect the private repository with `main` as the production branch. GitHub source privacy and Vercel deployment access are separate settings; maintain the intended deployment protection when changing hosts.

The browser's saved views, notes, and computed cache belong to the current origin. To move an existing notebook, export its session JSON from the old host and import it on the new host. Computed caches populate independently; the shipped precache assets move with the repository.

### Migration provenance

This source was recovered from the published Zeta Observatory revision `71c6986e47516b27b51cb5b167f499addea2a6d4`. The migration preserves the numerical engine, renderer, original viewport, precache assets, reference fixtures, and existing tests. Hosting-specific Sites metadata is excluded from the new deployment.

## Computed views and heat playback

The field loader checks memory, IndexedDB, and the shipped numerical pack before starting a numerical worker. The cache uses exact numerical keys, including the engine version, selected function and heat parameter, chart and spectral bounds, sampling density, computed extent, and requested numerical overlays. Camera position, phase rotation, opacity, and other display settings reuse the same field. A numerical or sampler change requires a new `FIELD_CACHE_VERSION`.

The memory cache has a **128 MiB** budget. IndexedDB has a **256 MiB** configured budget, reduced when the browser reports limited available storage. Both evict the least recently used fields. Persistence is best effort: unavailable storage or quota pressure falls back to memory and fresh computation. **Clear cache** removes computed views and the active clip while keeping saved viewpoints, notes, and exported sessions separate.

The original starter pack contains **78 independently computed fields exposed through 155 exact keys**, with shared geometry and optional ladder-overlay aliases. Its **59.32 MB** of compressed assets are loaded on demand; this is the original pack size, not a compulsory initial download. It includes ζ and ξ on all three ordinary mounts, several research presets, and 17 heat frames at τ = −0.30, −0.25, …, 0.50 for the default plane, sphere, torus, and narrower heat-preset plane window.

The deployment build preserves that pack and adds **38 default projective fields**: ζ and ξ on the projective sphere and torus, plus 17 heat frames for each projective geometry. These use r = 2, L = 24 and Standard density. Custom lens values, densities, or numerical overlays can require a fresh calculation. Projective field keys are distinct from ordinary chart keys; display-only point-state controls reuse the underlying field. All packed samples come from the same numerical engine as custom worker calculations. Caching changes when the work happens; it does not improve the precision or mathematical accuracy of a field.

In **Cache & playback**, choose the heat range, 9/17/33 exact frames, and **Responsive**, **Standard**, or **Current mesh density**. **Prepare heat frames** loads or computes every frame before the sequence is ready. **Play** performs the same preparation automatically if needed. The active clip has a separate **192 MiB** memory limit; an oversized request asks for fewer frames or Responsive density instead of silently reducing the chosen density. Custom ranges and denser sequences compute any frames that are absent from the cache. **Precache modes** prepares the nine chart/function combinations for the current numerical settings.

Once playback starts, each heat step reads only its buffered field: the surface values, critical traces, landmark values, root markers, requested overlay curves, and 361-point critical-line inset are already present. There is no interpolation between heat times and no ζ, ξ, or heat-kernel evaluation or field loading in the playback step. The sequence traverses the prepared range forward and then reverse, with the direction and actual τ displayed. Frame scrubbing selects an existing frame. Preparation locks a common height reference; keep that lock enabled when comparing amplitudes across the sequence.

Rendering still takes work on every frame. The Canvas fallback uses a smaller motion mesh and restores stationary detail when playback and other motion pause. This affects the drawn triangles, not the stored numerical samples. The requested playback rate remains subject to the device's rendering speed.

Live point and derivative inspection is held during playback. **Inspect** pauses the sequence and evaluates the chosen coordinate afresh; ordinary Pause also resumes point inspection. Scrubbing leaves the inspector held until inspection is requested. The finite prime-power packet panel has its own clock and continues evaluating its small, explicit finite sum while enabled. It is separate from buffered heat evolution.

### Rebuild the shipped pack

```sh
node scripts/build-precache.mjs
node scripts/build-projective-precache.mjs
```

The base script uses the shared sampler, writes `dist/precache/manifest.json`, and stores lossless binary frames compressed with gzip. The projective script extends the manifest with the default projective fields and preserves existing entries. Shared mesh files avoid repeating geometry at every heat time. The codec preserves typed-array bytes, nonfinite puncture coordinates, and signed zero. The browser decodes supported compressed assets and otherwise falls back to the numerical worker. Existing entries with the current engine/codec version can be reused when rebuilding; bump the numerical version after changing numerical or sampling behavior.

For a smaller development build, use `--base-only` or `--without-heat-preset`. `--out <directory>` selects another output directory. Tests cover codec round trips, exact manifest keys, independent frame values, the worker sampler, cache behavior, and buffered sequence preparation.

## Numerical scope

The extended operating window is −128 ≤ Re(s) ≤ 129, |Im(s)| ≤ 2,000 and |τ| ≤ 1. An Original window control retains the previous −12 ≤ Re(s) ≤ 13, |Im(s)| ≤ 120 domain for comparison. Log-polar evaluation preserves phase and magnitude information across raw floating-point overflow/underflow. Curved meshes cluster samples near infinity; the critical guides continue as exact base geometry independently of the function mask. The initial UI heat dial uses −0.3 ≤ τ ≤ 0.5. Independent high-precision reference checks, including expanded-domain log-polar checks, and their error definitions are in `dist/numerics.json`. They are finite numerical validation, not uniform error certificates. There is no prescribed zero placement in the evaluator.

Height normalization, chart lenses, masking, interpolation, finite root coverage, and the distinction between prime packets and zeta heat flow are documented in the in-app `methods.html` reference. This software does not establish RH or global positivity.

## Source map

| File | Purpose |
| --- | --- |
| `dist/math.js` | Raw/log-polar values, analytic derivatives, theta integration and extended Gaussian heat convolution |
| `dist/domain.js` | Shared finite computation bounds and core/extended controls |
| `dist/elliptic.js` | Jacobi uniformization, deck exchange, both inverse lifts and landmarks |
| `dist/dynamics.js` | Deterministic phase, relaxation, random-walk, interference, bounded-heat, trapping and polynomial mechanics |
| `dist/dynamics-panel.js` | Live dynamics controls, canvas rendering, replay, playback and diagnostics |
| `dist/geometry.js` | Exact charts, complete critical guides and clustered mesh axes |
| `dist/projective.js` | Scale-safe homogeneous pairs, Bloch coordinates, derivative Cayley chart and ℂℙ³ curve coordinates |
| `dist/projective-panel.js` | Linked selected-point sphere/disk and two-sphere branch-cut atlas |
| `dist/spinor.js` | Hopf/Bloch lift, common phase, SU(2) rotation and spin frame |
| `dist/twistor.js` | Chosen quaternionic ℂℙ³ → S⁴ map, fibers, charts and quadric residuals |
| `dist/fiber-panels.js` | Linked spinor and twistor displays from held projective snapshots |
| `dist/dual.js`, `dist/dual-panel.js` | Elliptic conormal family, bilinear incidence, and exact geometric anchors |
| `dist/infinity.js`, `dist/infinity-panel.js`, `dist/infinity-worker.js` | Spectral end and fixed-strip coordinates, finite coverage and cutoff diagnostics |
| `dist/display-field.js` | Positive Gaussian display weight, kept separate from analytic samples and caches |
| `dist/view-url.js` | Named view URLs, exact allowed overrides, camera/probe restore and browser history |
| `dist/sampler.js` | Shared pure mesh sampler, finite bridge comparisons, flow curves, markers and critical-line inset |
| `dist/sample-worker.js` | Browser worker wrapper and transferable buffers |
| `dist/critical-samples.js` | Numerical critical traces and landmark values prepared with each frame |
| `dist/field-cache.js` | Exact versioned keys, bounded memory cache and best-effort IndexedDB LRU cache |
| `dist/field-service.js` | Memory → saved cache → shipped frames → worker loading, plus shared mesh reuse |
| `dist/playback.js` | Exact heat sequence plans, complete preparation, cancellation and active-clip memory limit |
| `dist/cache-codec.js` | Lossless binary frame encoder and decoder |
| `dist/precache/manifest.json` | On-demand numerical assets and exact settings for each shipped frame |
| `scripts/build-precache.mjs` | Reproducible offline starter-pack generation |
| `scripts/build-projective-precache.mjs` | Default projective fields and heat sequences added during deployment |
| `dist/renderer.js` | Three.js GPU renderer |
| `dist/canvas-renderer.js` | Software 3D fallback |
| `dist/app.js` | Research controls, probes, winding, storage and export |
| `dist/research-state.js` | Shared controls, bounds and named research presets |
| `dist/research-math.js` | Bridge, energy, Gram, arithmetic and ratio calculations |
| `dist/research-dynamics.js` | Prime modes, periodic pulse response and heat-root continuation |
| `dist/research-panel.js` | Worker-backed research controls, plots and measurements |
| `dist/research-worker.js` | Isolated numerical dispatch for the nine research modes |
| `tests/` | Independent reference fixtures and mathematical integration checks |

Three.js 0.180.0 is vendored with its MIT license. No external scripts, web fonts, analytics or back-end data services are required at runtime. The on-demand frame files are part of this static app. Saved notebooks use the current browser's local storage; computed fields use their separate cache. Export session JSON for a portable copy of a viewpoint and its notes.


