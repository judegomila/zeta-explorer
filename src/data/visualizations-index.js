/**
 * @module visualizations-index
 * @fileoverview Growing visualization catalog, preserving the WAVE 13/18 foundation.
 *
 * Six visualization pages were shipped in WAVE 13 (imp-1222..1227). Until
 * imp-1228 they were scattered across three different "Visualizations" nav
 * groups in src/App.jsx with no master landing page. This module is the
 * single source-of-truth catalog: each entry pins the route, title, one-line
 * description, math bucket, data module path, and a pointer back to the
 * canonical paper source. It is consumed by:
 *
 *   - src/pages/VisualizationsIndexPage.jsx (renders the cards)
 *   - scripts/run-assertions.mjs (runs the tripwires)
 *
 * Ordering is pedagogical, NOT chronological:
 *
 *   1. log-phase-spiral        — single-line phase representation
 *   2. twin-ladder-tomography  — interferometric (sigma, t) tomography
 *   3. euler-transport-flow    — vector field / streamline picture
 *   4. prime-caustic           — coherent-prime caustic density
 *   5. hyperbolic-prime-spiral — primes embedded in the Poincaré disk
 *   6. prime-phase-crystal     — Bragg-style diffraction pattern
 *
 * This sequence walks the reader from a single-curve view through
 * 2D interferometric / flow representations and finally into discrete
 * prime structure (caustic, hyperbolic, crystal).
 *
 * @see imp-1228
 * @see src/pages/VisualizationsIndexPage.jsx
 * @see research-inputs/twin_ladder_consolidated_v52.pdf
 */

/**
 * Closed set of math-buckets used by the index cards. Cards display the
 * bucket as a small badge and the renderer chooses a per-bucket accent
 * color. Adding a new bucket here also requires adding the matching color
 * mapping in VisualizationsIndexPage.jsx (BUCKET_ACCENTS).
 *
 * @type {Readonly<string[]>}
 */
export const VIZ_MATH_BUCKETS = Object.freeze([
  'phase-spiral',
  'tomography',
  'flow-field',
  'caustic',
  'hyperbolic',
  'crystal',
  'schur',
  'kernel',
  'bound',
  'measurement',
]);

/**
 * Master visualization index. Frozen, immutable at module load.
 *
 * Entry semantics:
 *  - `route`           string  page route (must match an App.jsx <Route>)
 *  - `title`           string  page-level <h1> the card surfaces
 *  - `oneLine`         string  bounded card summary (legacy: <=200; later: <=512)
 *  - `mathBucket`      string  one of VIZ_MATH_BUCKETS (drives badge color)
 *  - `dataModule`      string|null  src/data JS/JSON path(s), or computed data
 *  - `paperSourcePath` string  pointer to source paper / section
 *  - `ticket`          string  imp-N ticket or dated user-research provenance
 *  - `pedagogicalStep` number  positive integer rank; original steps 1..9 pinned
 *
 * @type {Readonly<object>}
 */
export const VISUALIZATIONS_INDEX = Object.freeze({
  ticketId: 'imp-1228',
  routePath: '/visualizations',
  title: 'Visualizations',
  intro:
    'Explore zeta geometry, operator models, arithmetic measurements, and ' +
    'bridge-energy diagnostics. The catalog opens with six geometric views ' +
    'of the Twin-Ladder Consolidated v52 paper, followed by Schur and ' +
    'Volterra panels and later research views. Each card names its data ' +
    'or source and the limit of what it establishes.',

  paperSource: Object.freeze({
    path: 'research-inputs/twin_ladder_consolidated_v52.pdf',
    note:
      'Twin-Ladder Consolidated v52 — the source of the opening six-view ' +
      'suite, covering the geometric content of ' +
      '§§15-18 (shift-bridge, closure routes, ghosts, attacks) plus the ' +
      'rigorous-numerics §§20-23 supporting material.',
  }),

  entries: Object.freeze([
    Object.freeze({
      route: '/viz-log-phase-spiral',
      title: 'Log-Phase Interference Spiral',
      oneLine:
        'Polar curve r=log(t+e), θ=arg ζ(½+it); zeros appear as cusps where the phase jumps by π.',
      mathBucket: 'phase-spiral',
      dataModule: 'src/data/viz-log-phase-spiral.js',
      paperSourcePath:
        'research-inputs/twin_ladder_consolidated_v52.pdf §16 (closure routes)',
      ticket: 'imp-1222',
      pedagogicalStep: 1,
      honestCeiling:
        'Descriptive phase-portrait of zeta on the critical line; zeros render as cusps. Makes no Lambda bound or RH claim.',
    }),
    Object.freeze({
      route: '/viz-twin-ladder-tomography',
      title: 'Twin-Ladder Interference Tomography',
      oneLine:
        'Heatmap of |ζ(σ+it)·ζ((1−σ)+it)| over (σ, t); the critical line σ=½ is a tomographic seam.',
      mathBucket: 'tomography',
      dataModule: 'src/data/viz-twin-ladder-tomography.js',
      paperSourcePath:
        'research-inputs/twin_ladder_consolidated_v52.pdf §15 (shift-bridge)',
      ticket: 'imp-1223',
      pedagogicalStep: 2,
      honestCeiling:
        'Descriptive |zeta(s)*zeta(1-s)| heatmap; the sigma=1/2 seam is shown, not proven. No Lambda claim.',
    }),
    Object.freeze({
      route: '/viz-euler-transport-flow',
      title: 'Euler Transport Flow Field',
      oneLine:
        'Streamlines of −ζ′/ζ in the critical strip; zeros are sources, the pole at s=1 is a sink.',
      mathBucket: 'flow-field',
      dataModule: 'src/data/viz-euler-transport-flow.js',
      paperSourcePath:
        'research-inputs/twin_ladder_consolidated_v52.pdf §17 (Blaschke ghosts)',
      ticket: 'imp-1224',
      pedagogicalStep: 3,
      honestCeiling:
        'Descriptive streamline portrait of the logarithmic-derivative flow; zeros appear as sources. No Lambda claim.',
    }),
    Object.freeze({
      route: '/viz-prime-caustic',
      title: 'Prime Caustic',
      oneLine:
        'Density of phase-coherent primes Σ_{p<N} 1[(t log p) mod 2π ≈ 0] over the (σ, t) plane.',
      mathBucket: 'caustic',
      dataModule: 'src/data/viz-prime-caustic.js',
      paperSourcePath:
        'research-inputs/twin_ladder_consolidated_v52.pdf §18 (three attacks)',
      ticket: 'imp-1225',
      pedagogicalStep: 4,
      honestCeiling:
        'Descriptive phase-coherence density map of primes; shows arithmetic structure only. No Lambda claim.',
    }),
    Object.freeze({
      route: '/viz-hyperbolic-prime-spiral',
      title: 'Hyperbolic Prime Spiral',
      oneLine:
        'Primes p_n placed in the Poincaré disk at hyperbolic radius ∝ log p_n with golden-angle θ.',
      mathBucket: 'hyperbolic',
      dataModule: 'src/data/viz-hyperbolic-prime-spiral.js',
      paperSourcePath:
        'research-inputs/twin_ladder_consolidated_v52.pdf §20 (rigorous numerics)',
      ticket: 'imp-1226',
      pedagogicalStep: 5,
      honestCeiling:
        'Descriptive Poincare-disk embedding of primes; aesthetic and structural only. No Lambda claim.',
    }),
    Object.freeze({
      route: '/viz-prime-phase-crystal',
      title: 'Prime Phase Crystal',
      oneLine:
        'Bragg-style 2D diffraction |Σ_p cos(j log p + k t₀)| over (j, k); peaks at Riemann zeros.',
      mathBucket: 'crystal',
      dataModule: 'src/data/viz-prime-phase-crystal.js',
      paperSourcePath:
        'research-inputs/twin_ladder_consolidated_v52.pdf §23 (freezing bridge)',
      ticket: 'imp-1227',
      pedagogicalStep: 6,
      honestCeiling:
        'Descriptive Bragg-style diffraction of prime phases; peaks track known zeros. No Lambda claim.',
    }),
    Object.freeze({
      route: '/cayley-schur-trajectory',
      title: 'Cayley-Schur Trajectory',
      oneLine:
        'Unit-disk trajectory of Schur function Θ_a(it) via Cayley transform of the canonical-system m-function; membership in the disk is Conjecture 27.2.',
      mathBucket: 'schur',
      dataModule: null,
      paperSourcePath:
        'research-inputs/twin_ladder_consolidated_v52.pdf §27 (de Branges-Krein)',
      ticket: 'imp-1294',
      pedagogicalStep: 7,
      honestCeiling:
        'Illustrates Conjecture 27.2 unit-disk membership; the membership is conjectural, not proven. No Lambda claim.',
    }),
    Object.freeze({
      route: '/viz-volterra-kernel-heatmap',
      title: 'Volterra Kernel Heatmap',
      oneLine:
        'Interactive heatmap of |k_{a,Φ}(x,y)|^2 showing rank-1-like concentration along the diagonal and off-diagonal decay of the Volterra operator.',
      mathBucket: 'kernel',
      dataModule: null,
      paperSourcePath:
        'research-inputs/twin_ladder_consolidated_v52.pdf §19 (rigorous Volterra bounds)',
      ticket: 'imp-1291',
      pedagogicalStep: 8,
      honestCeiling:
        'Descriptive |k(x,y)|^2 kernel-concentration heatmap; suggests rank-1-like structure. No operator bound is proven.',
    }),
    Object.freeze({
      route: '/viz-volterra-norm-curve',
      title: 'Volterra Norm Curve',
      oneLine:
        'Log-scale empirical op-norm ‖V_{a,Φ}‖ and rigorous HS bound ‖V‖_HS vs parameter a; exponential growth beyond a ≈ 2.3 is open.',
      mathBucket: 'bound',
      dataModule: null,
      paperSourcePath:
        'research-inputs/twin_ladder_consolidated_v52.pdf §20 (HS bound saturation)',
      ticket: 'imp-1292',
      pedagogicalStep: 9,
      honestCeiling:
        'Plots the rigorous HS upper bound and empirical op-norm only; growth beyond a around 2.3 is open. No Lambda claim.',
    }),
    Object.freeze({
      route: '/vortex-field',
      title: 'Prime-Log Vortex Field',
      oneLine:
        'Domain-colored arg H(s): zeros render as phase vortices on Re s=½ (winding ±1); V_t=H_t′/H_t Newman-flow streamlines + a de Bruijn–Newman heat-flow slider.',
      mathBucket: 'flow-field',
      dataModule: null,
      paperSourcePath: 'user image: Prime-Log Vortex Field Near a Zeta Zero',
      ticket: 'imp-2673',
      pedagogicalStep: 10,
      honestCeiling:
        'Re-derives the Lambda >= 0 sign only via winding; the domain-coloring is descriptive. No upper Lambda bound.',
    }),
    Object.freeze({
      route: '/prime-rigidity',
      title: 'Prime Rigidity — True vs Perturbed',
      oneLine:
        'Caustic field θ=t·log n (mod 2π) for true integers vs a randomized set; the coherent bands dissolve under randomization — the structure is arithmetic, not random.',
      mathBucket: 'caustic',
      dataModule: null,
      paperSourcePath: 'user image: Twin-Ladder Visual Geometries (panel 11, true-vs-perturbed)',
      ticket: 'imp-2673',
      pedagogicalStep: 11,
      honestCeiling:
        'Descriptive true-vs-perturbed caustic contrast; demonstrates arithmetic rigidity qualitatively. No Lambda claim.',
    }),
    Object.freeze({
      route: '/visual-geometries',
      title: 'Visual Geometries of ζ(s) — gallery',
      oneLine:
        'Master gallery tying every log-phase view of ζ into one poster: spiral, caustics, crystal, hyperbolic spiral, vortices, rigidity.',
      mathBucket: 'phase-spiral',
      dataModule: null,
      paperSourcePath: 'user image: Twin-Ladder Visual Geometries of ζ(s)',
      ticket: 'imp-2673',
      pedagogicalStep: 12,
      honestCeiling:
        'Descriptive master gallery; aggregates the other views and asserts no Lambda bound of its own.',
    }),
    Object.freeze({
      route: '/viz-near-zero',
      title: 'Near a Zeta Zero — Rings, Nodal Lines & Vortex',
      oneLine:
        'Amplitude rings, Re/Im nodal-line cross, and phase-winding vortex structure around a chosen Riemann zero gamma_n on the critical line.',
      mathBucket: 'flow-field',
      dataModule: null,
      paperSourcePath: 'VizNearZeroPage: panel 7 of Visual Geometries gallery',
      ticket: 'imp-2892',
      pedagogicalStep: 13,
      honestCeiling:
        'Exact exploratory visualization of local vortex structure at a zero; no Lambda bound or RH claim.',
    }),
    Object.freeze({
      route: '/viz-euler-product',
      title: 'True vs Perturbed Euler Product',
      oneLine:
        'True vs perturbed log|∏_{p≤P}(1-p^{-s})^{-1}| on the critical line; shifting each log p smears the near-zeros, demonstrating arithmetic rigidity.',
      mathBucket: 'caustic',
      dataModule: null,
      paperSourcePath:
        'research-inputs/twin_ladder_consolidated_v52.pdf §18 (three attacks: arithmetic rigidity)',
      ticket: 'imp-2718',
      pedagogicalStep: 14,
      honestCeiling:
        'Descriptive Euler product comparison; near-zeros match known zeta zeros qualitatively. No Lambda bound or RH claim.',
    }),
    Object.freeze({
      route: '/viz-prime-density-caustic',
      title: 'Prime-Density-on-Caustic Heatmap',
      oneLine:
        'Heatmap of which prime index k is coherent at each height t — bright where |(t log p_k) mod 2π| < ε; profile shows coherent fraction vs PNT baseline.',
      mathBucket: 'tomography',
      dataModule: null,
      paperSourcePath:
        'research-inputs/twin_ladder_consolidated_v52.pdf §18 (caustic density)',
      ticket: 'imp-2717',
      pedagogicalStep: 15,
      honestCeiling:
        'Descriptive prime-density-on-caustic heatmap; bright pixels mark phase-coherent primes at each height. No Lambda bound or RH claim.',
    }),
    Object.freeze({
      route: '/viz-caustic-resonance',
      title: 'Caustic Resonance Condition Overlay',
      oneLine:
        'Waveform of coherent-prime count vs t with resonance ticks at t=2πk/log(p_j/p_i); ticks identify where two primes phase-lock, amplifying each caustic spike.',
      mathBucket: 'crystal',
      dataModule: null,
      paperSourcePath:
        'research-inputs/twin_ladder_consolidated_v52.pdf §18 (three attacks: caustic resonance)',
      ticket: 'imp-2724',
      pedagogicalStep: 16,
      honestCeiling:
        'Descriptive resonance-condition overlay; ticks identify prime-pair beat frequencies. No Lambda bound or RH claim.',
    }),
    Object.freeze({
      route: '/viz-winding-dyson-flow',
      title: 'Winding under Dyson/Newman Flow',
      oneLine:
        'Topological winding count W=(1/2pi) oint V_t dz of zeros under the de Bruijn-Newman heat flow; off-axis pairs preserve W but exit the contour when Lambda < 0.',
      mathBucket: 'flow-field',
      dataModule: null,
      paperSourcePath: 'VizWindingDysonFlowPage: panel 14 of Visual Geometries gallery',
      ticket: 'imp-2990',
      pedagogicalStep: 18,
      honestCeiling:
        'Re-derives Lambda >= 0 (Rodgers-Tao 2020) via the argument principle; does not produce a new upper bound and does not beat Platt-Trudgian Lambda <= 0.2.',
    }),
    Object.freeze({
      route: '/viz-phase-cylinder',
      title: 'Log-Phase Cylinder / Flat Rectangle',
      oneLine:
        'Flat-rectangle or cylinder view of θ=t·log(n) mod 2π; primes become diagonal rays, caustics become vertical alignment columns, cylinder wrapping reveals helical structure.',
      mathBucket: 'phase-spiral',
      dataModule: null,
      paperSourcePath:
        'research-inputs/twin_ladder_consolidated_v52.pdf §18 (three attacks: phase geometry)',
      ticket: 'imp-2725',
      pedagogicalStep: 17,
      honestCeiling:
        'Geometric re-parameterisation of the log-phase field; descriptive and exploratory, no Lambda or RH claim.',
    }),
    Object.freeze({
      route: '/viz-unwrapped-rays',
      title: 'Unwrapped Prime Phase Rays',
      oneLine:
        'Flat (log p, t) strip of prime phase rays θ=t·log(p) before mod 2π folding; caustic-crossing ticks mark resonance heights t=2πk/log(p_i/p_j).',
      mathBucket: 'caustic',
      dataModule: null,
      paperSourcePath:
        'research-inputs/twin_ladder_consolidated_v52.pdf §18 (three attacks: phase geometry)',
      ticket: 'imp-2914',
      pedagogicalStep: 19,
      honestCeiling:
        'Exploratory geometric re-parameterisation showing resonance ticks; does not produce a Lambda bound or RH claim.',
    }),
    Object.freeze({
      route: '/viz-imp34978-double-double-log-ulp-band-wide',
      title: 'Double-Double Log ULP, Band-Wide',
      oneLine:
        'Band-wide worst-case double-double log rounding error in ULP across four log sites, checked against the 0.5 ulp correctly-rounded threshold.',
      mathBucket: 'bound',
      dataModule: null,
      paperSourcePath: 'src/data/imp-34952-double-double-log-ulp-band-wide.js (imp-34978 viz page)',
      ticket: 'imp-34978',
      pedagogicalStep: 20,
      honestCeiling:
        'Descriptive numerical-precision audit of a log implementation; establishes no operator positivity, no Lambda bound, no RH claim.',
    }),
    Object.freeze({
      route: '/viz-imp34980-r-margin-dyadic-wall-sweep',
      title: 'R_margin Dyadic-Wall Sweep Across N',
      oneLine:
        'Sweeps the R_margin quantity across a dyadic ladder of N to check the dyadic-wall behavior holds band-wide, not just at one rung.',
      mathBucket: 'bound',
      dataModule: null,
      paperSourcePath: 'src/data/imp-34953-r-margin-dyadic-wall-across-N.js (imp-34980 viz page)',
      ticket: 'imp-34980',
      pedagogicalStep: 21,
      honestCeiling:
        'Descriptive margin sweep across N; changes no bound, establishes no operator positivity, no RH verdict.',
    }),
    Object.freeze({
      route: '/viz-imp34981-landmark-gap-reconstruction-ladder',
      title: 'Landmark-Gap Reconstruction Ladder',
      oneLine:
        'Cross-checks the closed-form surplus prediction against the directly measured landmark gap across a ladder of N, rung by rung.',
      mathBucket: 'bound',
      dataModule: null,
      paperSourcePath:
        'src/data/imp-34954-surplus-closed-form-vs-landmark-gap-crosscheck.js (imp-34981 viz page)',
      ticket: 'imp-34981',
      pedagogicalStep: 22,
      honestCeiling:
        'Descriptive cross-check ladder; establishes no operator positivity, no RH verdict, no Lambda bound.',
    }),
    Object.freeze({
      route: '/viz-imp34983-sigma-knee-crossing-cmb-sensitivity',
      title: 'Sigma-Knee Resummation-Crossing C_mb Sensitivity',
      oneLine:
        'Tests whether the sigma-knee/Domb-Sykes-boundary coincidence survives when the GUE-conditional C_mb constant is perturbed away from its pinned value.',
      mathBucket: 'bound',
      dataModule: null,
      paperSourcePath: 'src/data/imp-34955-sigma-knee-crossing-cmb-sensitivity.js (imp-34983 viz page)',
      ticket: 'imp-34983',
      pedagogicalStep: 23,
      honestCeiling:
        'Descriptive sensitivity sweep; C_mb remains GUE-conditional, changes no bound, no RH claim.',
    }),
    Object.freeze({
      route: '/viz-imp34985-pinned-product-window-sensitivity',
      title: 'Pinned-Product Window Sensitivity',
      oneLine:
        'Checks how the pinned product P = g*·r0 responds to shifting the averaging window, separating the window-invariant factor from the window-variable one.',
      mathBucket: 'bound',
      dataModule: null,
      paperSourcePath: 'src/data/imp-34956-pinned-product-window-sensitivity.js (imp-34985 viz page)',
      ticket: 'imp-34985',
      pedagogicalStep: 24,
      honestCeiling:
        'Descriptive window-sensitivity check; establishes no operator positivity, no Lambda bound, no RH claim.',
    }),
    Object.freeze({
      route: '/viz-imp34986-crossover-numerator-polynomial-ladder',
      title: 'Crossover-Map Numerator Polynomial Ladder P_2..P_12',
      oneLine:
        'Shows the inherited crossover-map derivative numerator polynomial P_n has all-positive coefficients through order n=12, forcing a definite alternating sign with no interior zero.',
      mathBucket: 'bound',
      dataModule: null,
      paperSourcePath: 'src/data/imp-34957-crossover-deriv-p11-p12-extension.js (imp-34986 viz page)',
      ticket: 'imp-34986',
      pedagogicalStep: 25,
      honestCeiling:
        'Descriptive coefficient-positivity ladder; changes no bound, establishes no operator positivity, no RH verdict.',
    }),
    Object.freeze({
      route: '/viz-imp34998-conjugate-pair-singularity-angle-cross-check',
      title: 'Conjugate-Pair Singularity-Angle Cross-Check',
      oneLine:
        'Cross-checks the dominant complex-conjugate singularity angle theta via two independent reads: the sign-cycle period and a direct local Darboux-recurrence argument.',
      mathBucket: 'bound',
      dataModule: null,
      paperSourcePath:
        'src/data/imp-34947-conjugate-pair-argument-theta-cross-check.js (imp-34998 viz page)',
      ticket: 'imp-34998',
      pedagogicalStep: 26,
      honestCeiling:
        'Descriptive cross-check of a singularity angle; establishes no operator positivity, no RH verdict, NO QED.',
    }),
    Object.freeze({
      route: '/viz-imp34999-krawczyk-margin-infimum-band-endpoint',
      title: 'Krawczyk Monotonicity-Margin Infimum',
      oneLine:
        'Locates the infimum of the Krawczyk monotonicity margin across the admissible band and checks it stays away from the band endpoint.',
      mathBucket: 'bound',
      dataModule: null,
      paperSourcePath: 'src/data/imp-34949-krawczyk-margin-infimum-band-endpoint.js (imp-34999 viz page)',
      ticket: 'imp-34999',
      pedagogicalStep: 27,
      honestCeiling:
        'Descriptive margin-infimum band check; changes no bound, establishes no operator positivity, no RH verdict.',
    }),
    Object.freeze({
      route: '/viz-imp35000-eflow-crossing-strength-exponent-decomposition',
      title: 'E_flow Crossing-Strength Exponent Decomposition',
      oneLine:
        'Decomposes the E_flow crossing-strength exponent into its structural components to see which factor dominates the crossing behavior.',
      mathBucket: 'bound',
      dataModule: null,
      paperSourcePath:
        'src/data/imp-34950-eflow-crossing-strength-cmb-exponent-structural.js (imp-35000 viz page)',
      ticket: 'imp-35000',
      pedagogicalStep: 28,
      honestCeiling:
        'Descriptive exponent decomposition; establishes no operator positivity, no Lambda bound, no RH claim.',
    }),
    Object.freeze({
      route: '/viz-imp35001-plus-one-impossibility-margin-band',
      title: 'Plus-One Impossibility Margin Band',
      oneLine:
        'Bands the margin by which a plus-one perturbation is excluded, showing how far the impossibility result sits from its own boundary.',
      mathBucket: 'bound',
      dataModule: null,
      paperSourcePath: 'src/data/imp-34951-plus-one-impossibility-margin-band.js (imp-35001 viz page)',
      ticket: 'imp-35001',
      pedagogicalStep: 29,
      honestCeiling:
        'Descriptive margin-band check; changes no bound, establishes no operator positivity, no RH verdict.',
    }),
    Object.freeze({
      route: '/viz-imp35022-pinned-product-decomposition',
      title: 'Pinned-Product Decomposition: g* vs r0',
      oneLine:
        'Splits the imp-34956 pinned product P = g*·r0 into two panels: the window-invariant g* factor (flat at the FP floor) and the window-variable r0 factor (52.8x swing).',
      mathBucket: 'bound',
      dataModule: null,
      paperSourcePath: 'src/data/imp-34956-pinned-product-window-sensitivity.js (imp-35022 viz page)',
      ticket: 'imp-35022',
      pedagogicalStep: 30,
      honestCeiling:
        'Descriptive factor-decomposition check; changes no bound, establishes no operator positivity, no RH verdict.',
    }),
    Object.freeze({
      route: '/viz-imp35026-sigma-decay-landmark-ladder',
      title: 'Sigma(N) Decay Landmark Ladder',
      oneLine:
        'Plots the imp-33582 E(N)-bridge conditional share sigma(N) across N in [1e6,1e12] with the sigma=0.9/0.5/0.1 threshold-crossing landmarks, the imp-33721 inflection knee, and the per-decade local decay-exponent ramp toward the imp-3463 far-tail 1/2.',
      mathBucket: 'bound',
      dataModule: null,
      paperSourcePath:
        'src/data/imp-33582-sigma-postpeak-nearpeak-threshold-decay.js (imp-35026 viz page)',
      ticket: 'imp-35026',
      pedagogicalStep: 31,
      honestCeiling:
        'Descriptive decay-ladder check; changes no bound, establishes no operator positivity, no RH verdict.',
    }),
    Object.freeze({
      route: '/viz-imp35077-conjugate-pair-darboux-trajectory',
      title: 'Conjugate-Pair Darboux Trajectory theta_k / R_k vs Depth',
      oneLine:
        'Plots the imp-34947 per-window Darboux recurrence angle theta_k and radius R_k versus window depth k, on both a line chart and a polar/complex-plane view, against the sign-cycle and radius-band reference lines.',
      mathBucket: 'bound',
      dataModule: null,
      paperSourcePath:
        'src/data/imp-34947-conjugate-pair-argument-theta-cross-check.js (imp-35077 viz page)',
      ticket: 'imp-35077',
      pedagogicalStep: 32,
      honestCeiling:
        'Descriptive per-window convergence trajectory; changes no bound, establishes no operator positivity, no RH verdict.',
    }),
    Object.freeze({
      route: '/viz-imp35079-combined-inflection-offset-ladder',
      title: 'Combined Inflection-Offset Ladder, 1e6-1e18',
      oneLine:
        'Stitches the imp-34933 near-tail (1e6-1e13) and imp-34948 far-tail (1e14-1e18) inflection-vs-halving offset ladders into one thirteen-rung view, plotting offsetN and the offsetN*(t-1)^2 diagnostic against the imp-33744-predicted 1/(t-1)^2 law and the near-tail band tops.',
      mathBucket: 'bound',
      dataModule: null,
      paperSourcePath:
        'src/data/imp-34933-inflection-offset-running-vs-fixed-ladder.js, src/data/imp-34948-inflection-offset-far-tail-ladder-extension.js (imp-35079 viz page)',
      ticket: 'imp-35079',
      pedagogicalStep: 33,
      honestCeiling:
        'Descriptive combined decay-ladder check; changes no bound, establishes no operator positivity, no RH verdict.',
    }),
    Object.freeze({
      route: '/viz-imp35018-four-landmark-cluster-log-n',
      title: 'Four-Landmark Cluster on One Log-N Axis',
      oneLine:
        'Places the imp-35009 cluster of three point-landmarks (N_half, N_cross, N_star) near N ~ 3.3e9 plus the imp-34693 admissible seed band around N_cross on one shared log-N axis, with pairwise relative spreads annotated.',
      mathBucket: 'bound',
      dataModule: 'src/data/imp-35018-four-landmark-cluster-log-n-viz-data.js',
      paperSourcePath:
        'src/data/imp-33723-sigma-half-vs-crossover-closed-form.js, src/data/imp-33582-sigma-postpeak-nearpeak-threshold-decay.js, src/data/imp-33721-sigma-ramp-inflection-subdecade.js, src/data/imp-34693-crossover-contraction-seed-band.js (imp-35018 viz page)',
      ticket: 'imp-35018',
      pedagogicalStep: 36,
      honestCeiling:
        'Descriptive log-N landmark placement on the inherited surrogate; changes no bound, establishes no operator positivity, no RH verdict.',
    }),
    Object.freeze({
      route: '/viz-imp35080-loglog-crossing-strength-power-law',
      title: 'Crossing-Strength Power Law, Log-Log View',
      oneLine:
        'Plots the imp-34925 21-point s*(C_mb) grid on log-log axes against the imp-34950 pinned power-law exponent p~1.5493 (95% CI) and the clean rationals 3/2 and 8/5, plus the imp-34950 F2 local-slope drift band [1.528,1.562].',
      mathBucket: 'bound',
      dataModule: null,
      paperSourcePath:
        'src/data/imp-34925-eflow-crossing-strength-cmb-functional-form.js, src/data/imp-34950-eflow-crossing-strength-cmb-exponent-structural.js (imp-35080 viz page)',
      ticket: 'imp-35080',
      pedagogicalStep: 34,
      honestCeiling:
        'Descriptive log-log power-law check on the inherited surrogate; changes no bound, establishes no operator positivity, no RH verdict.',
    }),
    Object.freeze({
      route: '/viz-imp35081-surplus-conversion-residual-waterfall',
      title: 'Surplus-to-Gap Conversion Residual Decomposition',
      oneLine:
        'Bar-charts how the imp-34954 ~4.6% residual of the leading sigma-to-N conversion (8*surplus, 2r, 1-(1+r)^-2, all ~4.6-4.9%) drops to ~0.34% when the ideal -1/2 power-law slope is replaced by the measured E_coll log-slope at N_cross.',
      mathBucket: 'bound',
      dataModule: null,
      paperSourcePath:
        'src/data/imp-34954-surplus-closed-form-vs-landmark-gap-crosscheck.js (imp-35081 viz page)',
      ticket: 'imp-35081',
      pedagogicalStep: 35,
      honestCeiling:
        'Descriptive residual-decomposition bar chart on the inherited surrogate; changes no bound, establishes no operator positivity, no RH verdict.',
    }),
    Object.freeze({
      route: '/viz-imp35030-far-tail-inflection-offset-ladder',
      title: 'Far-Tail Inflection-Offset Ladder, 1e14-1e18',
      oneLine:
        'Plots the imp-34948 far-tail extension of the offsetSigmoidPct and offsetRampPct inflection-vs-halving decay across the five rungs N_half in 1e14..1e18, continuing the imp-34933 near-tail (1e6-1e13) band tops.',
      mathBucket: 'bound',
      dataModule: null,
      paperSourcePath:
        'src/data/imp-34948-inflection-offset-far-tail-ladder-extension.js (imp-35030 viz page)',
      ticket: 'imp-35030',
      pedagogicalStep: 37,
      honestCeiling:
        'Descriptive far-tail decay-ladder check on the inherited surrogate; changes no bound, establishes no operator positivity, no RH verdict.',
    }),
    Object.freeze({
      route: '/viz-imp34958-inflection-offset-running-vs-fixed-ladder',
      title: 'Inflection-Offset Running-vs-Fixed Ladder, 1e6-1e13',
      oneLine:
        'Plots the imp-34933 seven-rung near-tail ladder of the sigmoid-inflection and exponent-ramp-knee offsets against N_half in 1e6..1e13, showing the offsets fall monotonically rather than holding at the imp-34904 fixed ~3% reading.',
      mathBucket: 'bound',
      dataModule: null,
      paperSourcePath:
        'src/data/imp-34933-inflection-offset-running-vs-fixed-ladder.js (imp-34958 viz page)',
      ticket: 'imp-35090',
      pedagogicalStep: 38,
      honestCeiling:
        'Descriptive running-vs-fixed decay-ladder check on the inherited surrogate; changes no bound, establishes no operator positivity, no RH verdict.',
    }),
    Object.freeze({
      route: '/viz-imp35118-bernstein-signature-ladder',
      title: 'Bernstein-Signature Derivative Sign Ladder',
      oneLine:
        'Plots the imp-35012 sign(g^(n)) = (-1)^(n+1) trace against the complete-monotonicity-of-g requirement (-1)^n (opposite at every single order) and the Bernstein requirement (-1)^(n-1) (matches at every order), through n=12.',
      mathBucket: 'bound',
      dataModule: null,
      paperSourcePath:
        'src/data/imp-35012-crossover-complete-monotonicity-bernstein-assessment.js (imp-35118 viz page)',
      ticket: 'imp-35118',
      pedagogicalStep: 39,
      honestCeiling:
        'Descriptive sign-arithmetic chart on the inherited surrogate; changes no bound, establishes no operator positivity, no RH verdict.',
    }),
    Object.freeze({
      route: '/viz-imp35121-ecoll-etrunc-eflow-decomposition',
      title: 'E_coll / E_trunc / E_flow Component Decomposition',
      oneLine:
        'Plots the imp-33601 surrogate E(N) = E_coll + E_trunc + E_flow decomposition across N in [1e6,1e13] on a shared log-log axis, annotating which term dominates at the imp-3406 sigma peak, the imp-33582 N_half, the imp-33723 N_cross, and the imp-33721 N_star landmarks.',
      mathBucket: 'bound',
      dataModule: 'src/data/imp-35121-ecoll-etrunc-eflow-decomposition-viz-data.js',
      paperSourcePath:
        'src/data/imp-33601-sigma-half-vs-crossover-eflow-offset.js (imp-35121 viz page)',
      ticket: 'imp-35121',
      pedagogicalStep: 40,
      honestCeiling:
        'Descriptive component-decomposition chart on the inherited surrogate; changes no bound, establishes no operator positivity, no RH verdict.',
    }),
    Object.freeze({
      route: '/viz-imp35123-bootstrap-exponent-distribution',
      title: 'Bootstrap Distribution of the Pinned Crossing-Strength Exponent',
      oneLine:
        'Histograms the imp-34994 bootstrap distribution of the pinned imp-34950 crossing-strength exponent p (4000 seeded-LCG resamples over the imp-34925 21-point C_mb grid, mean ~1.5495, 95% percentile CI ~[1.5475,1.5521]), marking the clean rationals 3/2 and 8/5 ~41 and ~42 sigma outside the band.',
      mathBucket: 'bound',
      dataModule: 'src/data/imp-34994-cmb-exponent-bootstrap-jackknife.js',
      paperSourcePath:
        'src/data/imp-34994-cmb-exponent-bootstrap-jackknife.js (imp-35123 viz page)',
      ticket: 'imp-35123',
      pedagogicalStep: 41,
      honestCeiling:
        'Descriptive resampling-distribution histogram on the inherited surrogate; changes no bound, does not discharge the GUE conditional (imp-486), establishes no operator positivity, no RH verdict.',
    }),
    Object.freeze({
      route: '/viz-imp35138-sigma-deep-tail-threshold-ladder',
      title: 'Sigma(N) Deep-Tail Threshold Ladder',
      oneLine:
        'Plots the imp-35041 sigma(N) = E_coll/E(N) curve across N in [1e6,1e16] with all four threshold crossings marked (0.5, 0.1, 0.01, 0.001), plus the per-factor-10 decade-spacing ladder (1.99, 2.16, 2.07) converging on the imp-3463 far-tail sqrt(1/N) signature.',
      mathBucket: 'bound',
      dataModule: 'src/data/imp-35138-sigma-deep-tail-threshold-ladder-viz-data.js',
      paperSourcePath:
        'src/data/imp-35041-sigma-deep-tail-threshold-extension.js (imp-35138 viz page)',
      ticket: 'imp-35138',
      pedagogicalStep: 42,
      honestCeiling:
        'Descriptive threshold-crossing chart on the inherited surrogate; changes no bound, establishes no operator positivity, no RH verdict.',
    }),
    Object.freeze({
      route: '/viz-imp35139-eflow-qeff-profile',
      title: 'E_flow q_eff Profile: Rising to 1, Not Descending to 1/2',
      oneLine:
        'Plots the imp-35039 E_flow local decay exponent q_eff(x) rising monotonically toward 1 across dex 9..300, marking the single upward q_eff=0.6 crossing at N~1e3.22 (far below the 1e9 crossing band) alongside the separate E_coll log-derivative approaching the imp-3463 far-tail 1/2.',
      mathBucket: 'bound',
      dataModule: 'src/data/imp-35139-eflow-qeff-profile-viz-data.js',
      paperSourcePath:
        'src/data/imp-35039-eflow-qeff-profile-crossing-to-fartail.js (imp-35139 viz page)',
      ticket: 'imp-35139',
      pedagogicalStep: 43,
      honestCeiling:
        'Descriptive log-derivative profile chart on the inherited surrogate; changes no bound, establishes no operator positivity, no RH verdict.',
    }),
    Object.freeze({
      route: '/viz-imp35140-running-g-ramp-vs-sigmoid-split',
      title: 'Running-g vs Sigmoid: Why the Ramp/Sigmoid Split Is Not a Running-g Effect',
      oneLine:
        'Plots the imp-35028 running-g g = -d ln r/d ln N at the sigmoid inflection and ramp knee across the imp-34948 far-tail ladder 1e14..1e18, showing the two curves overlay to five significant figures while the ~1.45e-5 relative gap is orders of magnitude too small to explain the ~0.064 decay-exponent split.',
      mathBucket: 'bound',
      dataModule: 'src/data/imp-35028-running-g-ramp-vs-sigmoid-split.js',
      paperSourcePath:
        'src/data/imp-35028-running-g-ramp-vs-sigmoid-split.js (imp-35140 viz page)',
      ticket: 'imp-35140',
      pedagogicalStep: 44,
      honestCeiling:
        'Descriptive running-g overlay chart on the inherited surrogate; changes no bound, establishes no operator positivity, no RH verdict.',
    }),
    Object.freeze({
      route: '/viz-imp35161-e-component-decomposition-table',
      title: 'E_coll / E_trunc / E_flow Component Decomposition Table',
      oneLine:
        'Tabulates the imp-35105 surrogate E(N) = E_coll + E_trunc + E_flow decomposition (absolute magnitudes and fractional shares) on a log-spaced grid across N in [1e6,1e13] plus the four cluster landmarks, highlighting the twice-flipping dominant-term rank order.',
      mathBucket: 'bound',
      dataModule: 'src/data/imp-35105-e-component-decomposition-table.js',
      paperSourcePath:
        'src/data/imp-35105-e-component-decomposition-table.js (imp-35161 viz page)',
      ticket: 'imp-35161',
      pedagogicalStep: 45,
      honestCeiling:
        'Descriptive component-decomposition table on the inherited surrogate; changes no bound, establishes no operator positivity, no RH verdict.',
    }),
    Object.freeze({
      route: '/viz-imp35206-horizon-front-mismatch',
      title: 'Horizon-Front Mismatch: T_minus(g,beta) vs. t_c(N)',
      oneLine:
        'Plots the imp-35195 measurement of the imp-35167 M5 horizon-front mismatch on a shared log-log axis: the certified non-collision window T_minus(g,beta) against the O(1) collision-front fit t_c(N) across N=5..870, plus the imp-2762 verified g_min(1e4) asymptotic anchor showing the ~20x ratio drop from the small-N O(1) plateau.',
      mathBucket: 'bound',
      dataModule: 'src/data/imp-35195-horizon-front-mismatch-ratio.js',
      paperSourcePath:
        'src/data/imp-35195-horizon-front-mismatch-ratio.js (imp-35206 viz page)',
      ticket: 'imp-35206',
      pedagogicalStep: 46,
      honestCeiling:
        'Descriptive log-log window-vs-front chart on the inherited surrogate; changes no bound, establishes no operator positivity, no RH verdict.',
    }),
    Object.freeze({
      route: '/viz-imp35207-two-window-incompatibility',
      title: 'Two-Window Incompatibility: y_prop vs. y_acc ~ sqrt(N)',
      oneLine:
        'Plots the imp-35168 propagation-safe strip height y_prop (N-independent) against the accumulation-safe strip height y_acc ~ sqrt(N) across N=2..1e6, showing the sqrt(N) divergence past the N=2 coincidence point that leaves no fixed mesoscopic strip serving both the imp-2520 transport lemma and the imp-35127 I3 accumulation constant.',
      mathBucket: 'bound',
      dataModule: 'src/data/imp-35168-mesoscopic-i3-lipschitz-window-assessment.js',
      paperSourcePath:
        'src/data/imp-35168-mesoscopic-i3-lipschitz-window-assessment.js (imp-35207 viz page)',
      ticket: 'imp-35207',
      pedagogicalStep: 47,
      honestCeiling:
        'Descriptive log-log two-window-height chart on the inherited surrogate; changes no bound, establishes no operator positivity, no RH verdict.',
    }),
    Object.freeze({
      route: '/viz-imp35208-deg-ladder',
      title: 'Discrete DEG Ladder: ||R||(DEG) Monotone Inflation',
      oneLine:
        'Plots the imp-35148 discrete truncation-size ladder ||R||(DEG) against the all-ones ceiling DEG+1 across DEG=1..12 at the imp-3066 admissible anchor, with the DEG=4 roadmap anchor marked and a bar panel of the strictly positive forward difference Delta||R||(DEG) showing the axis inflates rather than softens the Perron norm.',
      mathBucket: 'bound',
      dataModule: 'src/data/imp-35148-g7-truncation-deg-lever-probe.js',
      paperSourcePath:
        'src/data/imp-35148-g7-truncation-deg-lever-probe.js (imp-35208 viz page)',
      ticket: 'imp-35208',
      pedagogicalStep: 48,
      honestCeiling:
        'Descriptive DEG-ladder chart on the inherited surrogate; changes no bound, establishes no operator positivity, no RH verdict.',
    }),
    Object.freeze({
      route: '/viz-imp35209-margin-ratio-ladder',
      title: 'Margin-Ratio Ladder: rho(eps) = C_ren / C_curv',
      oneLine:
        'Plots the imp-35076 nine-rung margin-ratio ladder rho(eps) = C_ren / C_curv on the shared quadratic fold, marking the 2/3 closed-form asymptote and the head-worst rho ~ 0.6754, with the imp-35152 G-a un-sampled between-rung continuum shown as shaded bands.',
      mathBucket: 'bound',
      dataModule: 'src/data/imp-35076-h3-a-fortiori-discharges-h4-numerical-verification.js',
      paperSourcePath:
        'src/data/imp-35076-h3-a-fortiori-discharges-h4-numerical-verification.js (imp-35209 viz page)',
      ticket: 'imp-35209',
      pedagogicalStep: 49,
      honestCeiling:
        'Descriptive margin-ratio ladder chart on the inherited surrogate; does not discharge H3/H4 or gap G-a; changes no bound, establishes no operator positivity, no RH verdict.',
    }),
    Object.freeze({
      route: '/viz-imp35210-four-e-component-landmarks',
      title: 'Four E-Component Landmarks on One Shared Log-N Axis',
      oneLine:
        'Places the imp-35153 E_flow=E_trunc crossover (N ~ 1.597752e6), the imp-35154 E_flow 1%/0.1% negligibility thresholds (~3.247e7, ~1.755e10), and the imp-33723 E_coll=E_trunc crossover N_cross (~3.280294e9) together on one shared log-N axis, ordered and annotated with the decade gaps between consecutive landmarks.',
      mathBucket: 'bound',
      dataModule: 'src/data/imp-35210-four-e-component-landmarks-viz-data.js',
      paperSourcePath:
        'src/data/imp-35210-four-e-component-landmarks-viz-data.js (imp-35210 viz page)',
      ticket: 'imp-35210',
      pedagogicalStep: 50,
      honestCeiling:
        'Descriptive landmark-placement chart on the inherited surrogate; conditional-share diagnostic, not an RH bound; changes no bound, establishes no operator positivity, no RH verdict.',
    }),
    Object.freeze({
      route: '/viz-imp35231-eflow-fartail-exponent-logn-correction',
      title: 'E_flow Far-Tail Exponent Log-N Correction',
      oneLine:
        'Plots the imp-35198 derived leading correction -1 + 3/log N and the full surrogate s(x) against the imp-35135 measured far-tail E_flow decay exponents across N = 1e6..1e16, showing the approach to -1 strictly from above.',
      mathBucket: 'bound',
      dataModule: 'src/data/imp-35198-eflow-fartail-exponent-logn-correction.js',
      paperSourcePath:
        'src/data/imp-35198-eflow-fartail-exponent-logn-correction.js (imp-35231 viz page)',
      ticket: 'imp-35231',
      pedagogicalStep: 51,
      honestCeiling:
        'Derivation/measurement chart on the inherited imp-3220/imp-3406 surrogate; NOT a rigorous asymptotic; changes no bound, establishes no operator positivity, no RH verdict.',
    }),
    Object.freeze({
      route: '/viz-imp35232-schedule-corridor-collapse',
      title: 'I3 Schedule-Corridor Collapse: y_floor(N) vs. y_ceil',
      oneLine:
        'Plots the imp-35220 tabulated I3 strip-corridor endpoints for the baseline (S, E_acc, y_ceil) triple: the rising accumulation floor y_floor(N) = sqrt(2 N S / E_acc) against the flat near-front ceiling y_ceil on log-log axes, marking N_crit where the corridor empties, plus the N_crit spread across all eight plausible triples.',
      mathBucket: 'bound',
      dataModule: 'src/data/imp-35220-ncrit-corridor-endpoint-tabulation.js',
      paperSourcePath:
        'src/data/imp-35220-ncrit-corridor-endpoint-tabulation.js (imp-35232 viz page)',
      ticket: 'imp-35232',
      pedagogicalStep: 52,
      honestCeiling:
        'Descriptive log-log floor-vs-ceiling chart on the inherited imp-3220/imp-3406 surrogate; imp-35127 I3 field-Lipschitz requirement stays OPEN; changes no bound, establishes no operator positivity, no RH verdict.',
    }),
    Object.freeze({
      route: '/viz-imp35233-beta-front-law-n-uniformity',
      title: 'Background-Field Sup: N-Uniformity vs. Front-Growth',
      oneLine:
        'Plots the imp-35194 measured background-field sup beta(N) at matched min-gap fractions [0.5, 0.25, 0.1, 0.05]: beta collapses onto a single curve across N = 50, 100, 200 (relative spread < 1.5%), while the product beta * g_min narrows from ~1.33 toward ~1.04 toward the front, the signature of beta ~ 1/g_min.',
      mathBucket: 'bound',
      dataModule: 'src/data/imp-35194-background-field-sup-n-uniformity.js',
      paperSourcePath:
        'src/data/imp-35194-background-field-sup-n-uniformity.js (imp-35233 viz page)',
      ticket: 'imp-35233',
      pedagogicalStep: 53,
      honestCeiling:
        'Measurement-only chart probing the imp-35167 M2 background-field-sup obstruction on the inherited backward Dyson surrogate; does not certify N-uniformity over the full trajectory (sup diverges as g_min -> 0); M5 horizon-front mismatch stays OPEN; changes no bound, establishes no operator positivity, no RH verdict.',
    }),
    Object.freeze({
      route: '/viz-imp35234-rho-deviation-loglog-modulus',
      title: 'rho(eps) - 2/3 Deviation Modulus, Log-Log',
      oneLine:
        'Plots the imp-35193 measured deviation dev(eps) = |rho(eps) - 2/3| against eps on log-log axes with the K eps^{3/2} prefactor reference line (K ~ 0.400), and the local log-log slope theta_i climbing monotonically from ~1.4769 at the head toward the theta = 3/2 Holder-1/2 cusp fingerprint at the tail.',
      mathBucket: 'bound',
      dataModule: 'src/data/imp-35193-rho-convergence-rate-modulus-measurement.js',
      paperSourcePath:
        'src/data/imp-35193-rho-convergence-rate-modulus-measurement.js (imp-35234 viz page)',
      ticket: 'imp-35234',
      pedagogicalStep: 54,
      honestCeiling:
        'Descriptive log-log deviation-modulus chart on the inherited imp-3220/imp-3406/imp-33646 model-cusp surrogate; an OLS slope over 9 rungs is empirical, not a certified modulus; does not discharge O3 or G6a_shock_lipschitz (both stay OPEN); changes no bound, establishes no operator positivity, no RH verdict.',
    }),
    Object.freeze({
      route: '/viz-imp35252-real-vs-unit-background-field-sup-contrast',
      title: 'Background-Field Sup: Real Ordinates vs. Unit Spacing',
      oneLine:
        'Overlays the imp-35218 real-ordinate beta(N) against the imp-35194 unit-spacing beta(N) at matched min-gap fractions [0.5, 0.25, 0.1, 0.05] for N = 50, 100, 200: unit-spacing beta collapses onto one curve (relative spread < 1.5%) while real-ordinate beta fans out with N (spread ~120-140%), showing the N-uniformity breakdown while the beta ~ 1/g_min front law survives on both.',
      mathBucket: 'bound',
      dataModule:
        'src/data/imp-35218-real-ordinate-background-field-sup.js, src/data/imp-35194-background-field-sup-n-uniformity.js',
      paperSourcePath:
        'src/data/imp-35218-real-ordinate-background-field-sup.js, src/data/imp-35194-background-field-sup-n-uniformity.js (imp-35252 viz page)',
      ticket: 'imp-35252',
      pedagogicalStep: 55,
      honestCeiling:
        'Measurement-only overlay chart probing the imp-35167 M2 background-field-sup obstruction under the M3 initial-gap regime on the inherited backward Dyson surrogate; does not certify N-uniformity over the full trajectory (sup diverges as g_min -> 0); M5 horizon-front mismatch stays OPEN; changes no bound, establishes no operator positivity, no RH verdict.',
    }),
    Object.freeze({
      route: '/viz-imp35272-prefactor-ladder',
      title: 'rho(eps) Prefactor Ladder: K(eps) to 8 sqrt(2)/(9 pi)',
      oneLine:
        'Plots the imp-35240 finer-grid prefactor K(eps) = (rho(eps) - 2/3)/eps^{3/2} across eps = 1e-4..1e-6, climbing monotonically toward the derived closed form 8 sqrt(2)/(9 pi) = 0.40014 (matched to ~3.3e-7 at eps = 1e-6) and decisively away from the near-miss candidate 2/5 = 0.4000 (~424x discrimination).',
      mathBucket: 'bound',
      dataModule: 'src/data/imp-35240-rho-prefactor-finer-grid-remeasurement.js',
      paperSourcePath:
        'src/data/imp-35240-rho-prefactor-finer-grid-remeasurement.js (imp-35272 viz page)',
      ticket: 'imp-35272',
      pedagogicalStep: 56,
      honestCeiling:
        'Descriptive prefactor-ladder chart on the inherited imp-3220/imp-3406/imp-33646 model-cusp surrogate; a finer eps ladder discriminating a prefactor is measurement only, not a certified uniform modulus; does not discharge O3 or G6a_shock_lipschitz (both stay OPEN); changes no bound, establishes no operator positivity, no RH verdict.',
    }),
    Object.freeze({
      route: '/viz-imp35273-rho-remainder-structure',
      title: 'rho(eps) Corrected Remainder Structure: eps^(5/2) Empty, eps^(7/2) True',
      oneLine:
        'Plots the imp-35244 residual r1(eps) = rho(eps) - 2/3 - K eps^{3/2} scaled by eps^{5/2} (decaying to 0, the naive -0.32011 coefficient falsified) alongside the same residual scaled by eps^{7/2} (converging to the closed form K_(7/2) = -8 sqrt(2)/(3 pi) = -1.20042) across the imp-35193 clean window N = 1e3..1e6, showing the eps^{5/2} slot is empty and the true next-order term is eps^{7/2}.',
      mathBucket: 'bound',
      dataModule: 'src/data/imp-35244-rho-eps52-coefficient-measurement.js',
      paperSourcePath:
        'src/data/imp-35244-rho-eps52-coefficient-measurement.js (imp-35273 viz page)',
      ticket: 'imp-35273',
      pedagogicalStep: 57,
      honestCeiling:
        'Descriptive remainder-structure chart on the inherited imp-3220/imp-3406/imp-33646 model-cusp surrogate; pinning the eps^{5/2} slot empty and the eps^{7/2} coefficient sharpens the remainder shape but is measurement only, not a certified uniform modulus; does not discharge O3 or G6a_shock_lipschitz (both stay OPEN); changes no bound, establishes no operator positivity, no RH verdict.',
    }),
    Object.freeze({
      route: '/viz-imp35274-ecoll-exponent-residual-ladder',
      title: 'Extended E_coll Exponent-Residual Ladder to N~1e45',
      oneLine:
        'Plots the imp-35242 extended E_coll local-decay-exponent residual to the far-tail -1/2 asymptote (log-log) across the decade grid N = 1e15..1e45, overlaid with the imp-34130 closing law 1/(2 log T0), marking the residual<0.005 landmark at N ~ 4.67e44 and the ~29.7-decade log-T0-saturation-limited convergence span from the imp-33620 N=1e15 rung.',
      mathBucket: 'bound',
      dataModule: 'src/data/imp-35242-ecoll-exponent-residual-0005-tolerance-locate.js',
      paperSourcePath:
        'src/data/imp-35242-ecoll-exponent-residual-0005-tolerance-locate.js (imp-35274 viz page)',
      ticket: 'imp-35274',
      pedagogicalStep: 58,
      honestCeiling:
        'Descriptive exponent-residual ladder chart on the inherited imp-3220/imp-3406 component model; locating the residual<0.005 landmark is measurement only, not a certified uniform modulus of convergence on the true RvM cusp jet; the C_mb GUE-conditional share per imp-486 is UNTOUCHED; changes no bound, establishes no operator positivity, no RH verdict.',
    }),
    Object.freeze({
      route: '/viz-imp35275-krawczyk-headroom-band-profile',
      title: 'Krawczyk Contraction-Validity Headroom Band Profile S(N)',
      oneLine:
        'Plots the imp-35241 Krawczyk contraction-validity headroom S(N) = G/((1+G) delta FP_LO) across the imp-34693 admissible seed band, descending monotonically from ~2561.39 (band-bottom) through ~2558.12 (N_cross) to ~2555.18 (band-top), with the S_inf = 2500 floor and 100x safety-factor reference lines.',
      mathBucket: 'bound',
      dataModule: 'src/data/imp-35241-krawczyk-headroom-band-profile.js',
      paperSourcePath:
        'src/data/imp-35241-krawczyk-headroom-band-profile.js (imp-35275 viz page)',
      ticket: 'imp-35275',
      pedagogicalStep: 59,
      honestCeiling:
        'Descriptive band-profile chart on the inherited imp-3220/imp-3406 surrogate; the imp-34714a machine certificate REMAINS OPEN and F(m) = 0 stays a double-precision artifact; C_C 1/8 ansatz (imp-2642/2643) and C_mb GUE-conditional per imp-486 UNTOUCHED; changes no bound, establishes no operator positivity, no RH verdict.',
    }),
    Object.freeze({
      route: '/viz-imp35288-r2-flow-ladder-slack',
      title: 'R2 One-Sided True-Flow Ladder: t_c_flow vs t_c_hi Slack',
      oneLine:
        'Plots the imp-35150/imp-35190/imp-35221/imp-35235 R2 one-sided true-flow bound t_c_flow(N) <= t_c_hi(N) across the tested rungs N = 50,100,200,500,1000,2000, marking N=1000 as the last robustly-certified rung and N=2000 as the DP45 dt/2 gate-skip point where the worst-case envelope fails but the 3-of-4 clean references still clear the map bracket.',
      mathBucket: 'bound',
      dataModule: 'src/data/imp-35235-r2-n2000-flow-reference.js',
      paperSourcePath:
        'src/data/imp-35150-r2-ladder-assessment.js, src/data/imp-35190-r2-n500-flow-reference.js, src/data/imp-35221-r2-n1000-flow-reference.js, src/data/imp-35235-r2-n2000-flow-reference.js (imp-35288 viz page)',
      ticket: 'imp-35288',
      pedagogicalStep: 60,
      honestCeiling:
        'Descriptive ladder-slack chart reusing baked t_c literals verbatim; measurement/certification only, not a certified R2 bound past N=1000; C_mb stays GUE-conditional per imp-486; changes no bound, establishes no operator positivity, no RH verdict.',
    }),
    Object.freeze({
      route: '/viz-imp35293-three-factor-invariant-real-ordinates',
      title: 'Three-Factor Invariant Convergence on Real Ordinates',
      oneLine:
        'Plots the imp-35238 N=100 real-ordinate backward-Dyson three-factor invariant beta*g_min*(x_2-x_0) converging to 1 across min-gap fraction 0.5 down to 1e-4, overlaid with the smaller N-dependent bare product beta*g_min (imp-35218 R2 0.36-0.64 band), and tabulates the N=50,100,200 front-limit values showing the local-span factor x_2-x_0 closes the gap.',
      mathBucket: 'bound',
      dataModule: 'src/data/imp-35238-real-ordinate-three-factor-invariant.js',
      paperSourcePath:
        'src/data/imp-35238-real-ordinate-three-factor-invariant.js (imp-35293 viz page)',
      ticket: 'imp-35293',
      pedagogicalStep: 61,
      honestCeiling:
        'Descriptive convergence chart reusing baked imp-35238 nearFrontTable/invariantTrajectory literals verbatim; measurement only, beta itself still diverges ~1/g_min toward the front so M2/M5 stay OPEN; C_mb stays GUE-conditional per imp-486; changes no bound, establishes no operator positivity, no RH verdict.',
    }),
    Object.freeze({
      route: '/viz-imp35294-eflow-fartail-residual-monotone',
      title: 'E_flow Far-Tail Residual: Monotone Shrinking Across the Ladder',
      oneLine:
        'Plots the imp-35237 leading-law and full-surrogate E_flow far-tail residuals against the imp-35135 measured exponent across N = 1e6,1e9,1e12,1e16, showing both residuals shrinking monotonically and the full-surrogate curve crossing below the leading-law curve past N = 1e6.',
      mathBucket: 'bound',
      dataModule: 'src/data/imp-35237-eflow-fartail-exponent-ladder-crosscheck.js',
      paperSourcePath:
        'src/data/imp-35237-eflow-fartail-exponent-ladder-crosscheck.js (imp-35294 viz page)',
      ticket: 'imp-35294',
      pedagogicalStep: 62,
      honestCeiling:
        'Descriptive residual-ladder chart reusing baked imp-35237 anchors literals verbatim; cross-check only, component model is the imp-3220/imp-3406 extrapolation not a rigorous asymptotic; C_mb stays GUE-conditional per imp-486; changes no bound, establishes no operator positivity, no RH verdict.',
    }),
    Object.freeze({
      route: '/viz-imp35295-eflow-fartail-residual-decomposition',
      title: 'E_flow Far-Tail Residual Decomposition: Swap Gap + Closed-Form Remnant',
      oneLine:
        'Stacked-bar plot of the imp-35236 E_flow far-tail residual decomposition at N=1e6 and N=1e16, showing the directly-isolated inverse-swap gap (0.0093/0.0025) stacked with the closed-form-Taylor/prefactor remnant (0.0025/0.0019) summing to the imp-35217 leading residual (0.0119/0.0043) at each anchor.',
      mathBucket: 'bound',
      dataModule: 'src/data/imp-35236-eflow-fartail-inverse-swap-isolation.js',
      paperSourcePath:
        'src/data/imp-35236-eflow-fartail-inverse-swap-isolation.js (imp-35295 viz page)',
      ticket: 'imp-35295',
      pedagogicalStep: 63,
      honestCeiling:
        'Descriptive stacked-residual chart reusing baked imp-35236 anchors literals verbatim; measurement only, component model is the imp-3220/imp-3406 extrapolation not a rigorous asymptotic; C_mb stays GUE-conditional per imp-486; changes no bound, establishes no operator positivity, no RH verdict.',
    }),
    Object.freeze({
      route: '/viz-imp35296-min-gap-strip-advantage',
      title: 'Min-Gap-vs-Strip Advantage Factor on Real Ordinates',
      oneLine:
        'Log-log plot of the imp-35239 min-gap-route advantage factor L_strip/L_gap over the imp-35196 strip route across N=200..1e6, contrasting the exact unit-spacing 2N (p_gap=0) against the real-ordinate ~2N^0.36 (p_gap~0.57-0.65, imp-35218 R1), showing the advantage still grows without bound but with a visibly degraded slope.',
      mathBucket: 'bound',
      dataModule: 'src/data/imp-35239-min-gap-prefactor-real-spacing-reassessment.js',
      paperSourcePath:
        'src/data/imp-35239-min-gap-prefactor-real-spacing-reassessment.js (imp-35296 viz page)',
      ticket: 'imp-35296',
      pedagogicalStep: 64,
      honestCeiling:
        'Descriptive advantage-factor chart reusing baked imp-35239 advantageRows/realOrdinateGrowth literals verbatim; assessment only, the residual missing input is still an a-priori g_min(t)>0 whole-trajectory bound (imp-35167 M2/M5, OPEN); C_mb stays GUE-conditional per imp-486; changes no bound, establishes no operator positivity, no RH verdict.',
    }),
    Object.freeze({
      route: '/viz-imp35308-reentry-band',
      title: 'Iters-to-Floor Reentry Band vs Verified Height',
      oneLine:
        'Plots the imp-35243/imp-34997/imp-35111 iters-to-floor off-by-one reentry band [10^27.08, 10^37.17] against the Platt-Trudgian verified-zero height ~10^12.48 (marking the ~14.6/~24.7-decade gaps), and a second panel showing the imp-35243 D1 result that the band slides ~11.99 decades per factor-2 change in the EPS_FP machine-epsilon floor.',
      mathBucket: 'bound',
      dataModule: 'src/data/imp-35243-reentry-band-surrogate-fidelity-assessment.js',
      paperSourcePath:
        'src/data/imp-35243-reentry-band-surrogate-fidelity-assessment.js (imp-35308 viz page)',
      ticket: 'imp-35308',
      pedagogicalStep: 65,
      honestCeiling:
        'Descriptive band-position chart reusing baked imp-35243 demonstration_D1/D2 literals verbatim; the band is a SURROGATE feature ~15-25 decades above any verified datum, not established as a feature of the true dynamic; changes no bound, establishes no operator positivity, no RH verdict.',
    }),
    Object.freeze({
      route: '/viz-imp35183-sigma-fartail-exponent-ladder',
      title: 'Sigma(N) Far-Tail Exponent Ladder: The Log-Slow Approach to 1/2',
      oneLine:
        'Plots the imp-35036 per-decade local decay-exponent ladder p_dec of sigma(N)=E_coll/E(N) climbing from ~0.4310 [1e11] toward the imp-3463 far-tail 1/2 asymptote over k=11..30, overlaid with the 1/(2 ln N) residual-gap envelope, plus the residual gap itself on a log scale, showing the constant E_trunc floor overtakes the vanishing sqrt(1/N) E_coll only logarithmically.',
      mathBucket: 'bound',
      dataModule: 'src/data/imp-35183-sigma-fartail-exponent-ladder-viz-data.js',
      paperSourcePath:
        'src/data/imp-35036-sigma-fartail-exponent-log-slow-half-approach.js (imp-35183 viz page)',
      ticket: 'imp-35183',
      pedagogicalStep: 66,
      honestCeiling:
        'Descriptive exponent-ladder chart reusing baked imp-35036 extendedLadder/gapLaw/crossings literals verbatim; measurement on the inherited imp-3220/imp-3406 surrogate, NOT a rigorous asymptotic; C_mb GUE-conditional per imp-486 untouched; changes no bound, establishes no operator positivity, no RH verdict.',
    }),
    Object.freeze({
      route: '/viz-imp35184-bernstein-ingredients-triple',
      title: 'Bernstein / Lévy-Khintchine Ingredient Triple',
      oneLine:
        'Compact structural diagram of the imp-35114 Bernstein/Lévy-Khintchine ingredients for the surrogate g = K log T0(N): the finite killing term a = g(0+), the zero drift b (all growth in the Lévy integral term), and the completely-monotone g_prime confirmed by the (-1)^(n+1) sign ladder and from-source central-difference tables.',
      mathBucket: 'bound',
      dataModule: 'src/data/imp-35114-bernstein-ingredients-extraction.js',
      paperSourcePath:
        'src/data/imp-35114-bernstein-ingredients-extraction.js (imp-35184 viz page)',
      ticket: 'imp-35184',
      pedagogicalStep: 67,
      honestCeiling:
        'Descriptive ingredient-triple diagram reusing baked imp-35114 cmTable/driftTable literals verbatim; the extracted ingredients are structural properties of the SURROGATE map, NOT operator positivity; C_mb GUE-conditional per imp-486 untouched; changes no bound, establishes no operator positivity, no RH verdict.',
    }),
    Object.freeze({
      route: '/viz-imp35254-eflow-fartail-two-term-law',
      title: 'E_flow Far-Tail Two-Term Exponent Law vs Measurement',
      oneLine:
        'Plots the imp-35217 leading -1+3/log N law against the two-term law with the evaluated c2(x)/(log N)^2 correction and the imp-35135 measured exponents across the N=1e6..1e16 ladder, shading the c2 sign-change at N~2.615e7 where adding the x^-2 term hurts below and helps above.',
      mathBucket: 'bound',
      dataModule: 'src/data/imp-35217-eflow-fartail-exponent-x2-correction.js',
      paperSourcePath:
        'src/data/imp-35217-eflow-fartail-exponent-x2-correction.js (imp-35254 viz page)',
      ticket: 'imp-35254',
      pedagogicalStep: 68,
      honestCeiling:
        'Descriptive exponent-law chart reusing baked imp-35217 ladder/topRung/deepRung literals verbatim; derivation/measurement only on the inherited imp-3220/imp-3406 surrogate, NOT a rigorous asymptotic; C_mb GUE-conditional per imp-486 untouched; changes no bound, establishes no operator positivity, no RH verdict.',
    }),
    Object.freeze({
      route: '/viz-imp35314-fidelity-certificate-diagram',
      title: 'Surrogate-Fidelity Certificate: R1-R4 Structural Diagram',
      oneLine:
        'Compact four-card structural diagram of the imp-35243/imp-35277 surrogate-fidelity certificate for the iters-to-floor reentry band: R1 floor-independence and R4 independent-model agreement flagged BINDING and presently unreachable, R2 single-rate fidelity and R3 height-map fidelity flagged OPEN but not binding.',
      mathBucket: 'bound',
      dataModule: 'src/data/imp-35243-reentry-band-surrogate-fidelity-assessment.js',
      paperSourcePath:
        'src/data/imp-35243-reentry-band-surrogate-fidelity-assessment.js (imp-35314 viz page)',
      ticket: 'imp-35314',
      pedagogicalStep: 69,
      honestCeiling:
        'Descriptive certificate-checklist diagram reusing baked imp-35243 fidelity_certificate_requirements literals verbatim; no requirement is discharged here; the reentry band stays NOT established as a feature of the true dynamic; changes no bound, establishes no operator positivity, no RH verdict.',
    }),
    Object.freeze({
      route: '/viz-imp35320-sign-ladder-roundoff-ceiling',
      title: 'Sign-Ladder Round-off Ceiling: Recovered Sign vs Order',
      oneLine:
        'Plots the imp-35113 finite-difference-recovered sign of g^(n) against order n=1..6 alongside the analytic |g^(n)| geometric collapse, showing the sign matches the analytic (-1)^(n+1) ladder robustly through n*=4, flips step-dependently at n=5, and is round-off dominated beyond.',
      mathBucket: 'bound',
      dataModule: 'src/data/imp-35113-crossover-deriv-sign-ladder-finite-difference.js',
      paperSourcePath:
        'src/data/imp-35113-crossover-deriv-sign-ladder-finite-difference.js (imp-35320 viz page)',
      ticket: 'imp-35320',
      pedagogicalStep: 70,
      honestCeiling:
        'Descriptive round-off-ceiling diagram reusing baked imp-35113 resolvedTable/firstUnresolvedN/firstUnresolvedSignFlips/representativeMagnitudesAtCross literals verbatim; a numerical-differentiation reach limit, not a sign change, on the inherited imp-3220/imp-3406 surrogate; C_mb GUE-conditional per imp-486 untouched; changes no bound, establishes no operator positivity, no RH verdict.',
    }),
    Object.freeze({
      route: '/viz-imp35329-exponent-drift-closing-comparison',
      title: 'Exponent-Drift Closing Comparison: Shared 1/log Envelope',
      oneLine:
        'Places the three logarithmically-closing exponent-drift residuals (E_coll to -1/2 per imp-35242, E_flow to -1 per imp-35198, sigma-share to +1/2 per imp-35183) on one chart, each rescaled by its own already-known closing-law constant so all three collapse onto a shared 1/ln(argument) reference envelope.',
      mathBucket: 'bound',
      dataModule: 'src/data/imp-35242-ecoll-exponent-residual-0005-tolerance-locate.js',
      paperSourcePath:
        'src/data/imp-35242-ecoll-exponent-residual-0005-tolerance-locate.js, src/data/imp-35198-eflow-fartail-exponent-logn-correction.js, src/data/imp-35183-sigma-fartail-exponent-ladder-viz-data.js (imp-35329 viz page)',
      ticket: 'imp-35329',
      pedagogicalStep: 71,
      honestCeiling:
        'Viz-only consolidation reusing the imp-35242/imp-35198/imp-35183 ladders verbatim, with a per-series rescale by each already-established closing-law constant (arithmetic only, no re-derivation); establishes no new numerical claim on the inherited imp-3220/imp-3406 surrogate; C_mb GUE-conditional per imp-486 untouched; changes no bound, establishes no operator positivity, no RH verdict.',
    }),
    Object.freeze({
      route: '/viz-imp35344-floor-sensitivity-curve',
      title: 'D1 Floor-Sensitivity Curve: Reentry Band vs. EPS_FP Scale',
      oneLine:
        'Line plot of the imp-35243 D1 reentry-band position (log10 N) as a linear function of the machine-epsilon floor scale factor EPS_FP*2^k over k=-3..3, showing the ~11.99-decade-per-factor-2 slide and annotating that the true continuum has no floor and hence no counterpart to the curve.',
      mathBucket: 'bound',
      dataModule: 'src/data/imp-35243-reentry-band-surrogate-fidelity-assessment.js',
      paperSourcePath:
        'src/data/imp-35243-reentry-band-surrogate-fidelity-assessment.js (imp-35344 viz page)',
      ticket: 'imp-35344',
      pedagogicalStep: 72,
      honestCeiling:
        'Descriptive floor-sensitivity line chart extending the baked imp-35243 demonstration_D1_floor_sensitivity slope arithmetically over a small k range (no re-derivation); the band is a SURROGATE feature with no continuum counterpart at all; changes no bound, establishes no operator positivity, no RH verdict.',
    }),
    Object.freeze({
      route: '/viz-imp35345-extrapolation-gap',
      title: 'D2 Extrapolation Gap: Verified Height vs. Reentry Band',
      oneLine:
        'Log10 N axis marking the Platt-Trudgian verified-zero height (~3e12) that binds Lambda<=0.2 alongside the imp-35243 reentry-band reentry edge (10^27.08) and exit edge (10^37.17), making visible the 14.6-24.7-decade gap with no verified anchor between them and the band.',
      mathBucket: 'bound',
      dataModule: 'src/data/imp-35243-reentry-band-surrogate-fidelity-assessment.js',
      paperSourcePath:
        'src/data/imp-35243-reentry-band-surrogate-fidelity-assessment.js (imp-35345 viz page)',
      ticket: 'imp-35345',
      pedagogicalStep: 73,
      honestCeiling:
        'Descriptive to-scale axis reusing the baked imp-35243 demonstration_D2_extrapolation_gap literals verbatim (no re-derivation); shows the extrapolation distance only, does not certify the band against any independent witness; changes no bound, establishes no operator positivity, no RH verdict.',
    }),
    Object.freeze({
      route: '/viz-imp35346-expansion-slot-ladder',
      title: 'rho(eps) Expansion-Slot Ladder: eps^(5/2) Skipped',
      oneLine:
        'Renders the three resolved coefficient slots of the imp-35322 model-cusp rho(eps) expansion as a term-by-term ladder: eps^(3/2) K=8 sqrt(2)/(9 pi)=0.40014 (imp-35216/imp-35240), eps^(5/2) EMPTY (imp-35244 falsified the -0.32011 near-miss), eps^(7/2) K_(7/2)=-8 sqrt(2)/(3 pi)=-1.20042 (imp-35244), making visible that the expansion skips the eps^(5/2) slot.',
      mathBucket: 'bound',
      dataModule: 'src/data/imp-35322-rho-eps-expansion-cohort-provenance-rollup.js',
      paperSourcePath:
        'src/data/imp-35322-rho-eps-expansion-cohort-provenance-rollup.js (imp-35346 viz page)',
      ticket: 'imp-35346',
      pedagogicalStep: 74,
      honestCeiling:
        'Descriptive slot-ladder chart baking the imp-35322 roll-up literals verbatim (no new computation); displaying which expansion slots are filled versus skipped is measurement-summary only on the inherited imp-3220/imp-3406/imp-33646 model-cusp surrogate; does not certify a uniform modulus, does not discharge O3 or G6a_shock_lipschitz (both stay OPEN); changes no bound, establishes no operator positivity, no RH verdict.',
    }),
    Object.freeze({
      route: '/viz-imp35347-fixed-point-contraction',
      title: 'Iters-to-Floor Single-Rate Contraction to N_CROSS_FP',
      oneLine:
        'Plots the Picard-iterate log-law contraction g(N)=K*log(T0(N)) to the imp-35243 fixed point N_CROSS_FP~3.2803e9 at rate R_CONTRACT~0.0454235 (LN_INV_R~3.09173 nats/iterate, 1.34272 digits/iterate), reaching the machine-epsilon floor after ~12 iterates, overlaid with the ceil-phase drift (~0.0187/decade) that produces the off-by-one reentry band.',
      mathBucket: 'bound',
      dataModule: 'src/data/imp-35243-reentry-band-surrogate-fidelity-assessment.js',
      paperSourcePath:
        'src/data/imp-35243-reentry-band-surrogate-fidelity-assessment.js (imp-35347 viz page)',
      ticket: 'imp-35347',
      pedagogicalStep: 75,
      honestCeiling:
        'Descriptive contraction-curve chart baking the imp-35243 single-rate log-law literals verbatim (no new computation, no data-module import); shows the iterate-to-floor convergence and drift context only; does not certify surrogate fidelity (R1-R4 stay OPEN), does not discharge imp-35111a/imp-35174a; changes no bound, establishes no operator positivity, no RH verdict.',
    }),
    Object.freeze({
      route: '/viz-imp35362-n2000-collision-envelope',
      title: 'N=2000 Collision-Envelope Bracket: Four Finer-Grid References vs t_c_hi',
      oneLine:
        'Plots the four imp-35324 finer-grid (tauC/4000) N=2000 collision references (RK4 and DP45, each at dt and dt/2) as slack below the imp-857 map bracket t_c_hi=1.2e-3 on a log scale, visualizing the DP45 dt/2 worst-case +6.16e-8 knife-edge clearance against the other three references at ~7.5e-6.',
      mathBucket: 'bound',
      dataModule: 'src/data/imp-35324-r2-n2000-finer-grid-reference.js',
      paperSourcePath:
        'src/data/imp-35324-r2-n2000-finer-grid-reference.js (imp-35362 viz page)',
      ticket: 'imp-35362',
      pedagogicalStep: 76,
      honestCeiling:
        'Descriptive envelope chart baking the imp-35324 finer-grid t_c literals verbatim (no new computation, no data-module import); visualizes the razor-thin worst-case clearance only; does not advance the R2 ladder past N=1000 (imp-35221 stays the largest robustly-certified rung), does not extend the C_mb certificate, does not remove the imp-486 GUE conditional; changes no bound, establishes no operator positivity, no RH verdict.',
    }),
    Object.freeze({
      route: '/viz-imp35381-eflow-fartail-swap-fraction',
      title: 'E_flow Far-Tail Inverse-Swap Fraction Ladder',
      oneLine:
        'Bar chart of the imp-35279 inverse-swap FRACTION of the E_flow far-tail residual across the four-rung ladder N=1e6,1e9,1e12,1e16, showing the fraction decreasing monotonically (0.786->0.568) while staying above 0.5, i.e. the swap is the dominant but never sole residual component.',
      mathBucket: 'bound',
      dataModule: 'src/data/imp-35381-eflow-fartail-swap-fraction-viz-data.js',
      paperSourcePath:
        'src/data/imp-35279-eflow-fartail-inverse-swap-ladder.js (imp-35381 viz page)',
      ticket: 'imp-35381',
      pedagogicalStep: 98,
      honestCeiling:
        'Descriptive bar chart baking the imp-35279 four-rung swapFraction literals verbatim (no new computation, no heavy data-module import); measurement only, component model is the imp-3220/imp-3406 extrapolation not a rigorous asymptotic; C_mb stays GUE-conditional per imp-486; changes no bound, establishes no operator positivity, no RH verdict.',
    }),
    Object.freeze({
      route: '/viz-imp35400-eflow-fartail-two-component-ladder',
      title: 'E_flow Far-Tail Two-Component Decomposition: Full Four-Rung Ladder',
      oneLine:
        'Stacked-bar and fraction-trend plot of the imp-35279/imp-35280 four-rung (N=1e6,1e9,1e12,1e16) extension of the imp-35236/imp-35295 two-endpoint decomposition, showing the inverse-swap gap and fd-vs-analytic remnant summing to the analytic residual at every rung, with the swap fraction decreasing (0.786->0.568) while the remnant fraction grows (0.214->0.432) down the ladder.',
      mathBucket: 'bound',
      dataModule: 'src/data/imp-35400-eflow-fartail-two-component-ladder-viz-data.js',
      paperSourcePath:
        'src/data/imp-35279-eflow-fartail-inverse-swap-ladder.js, src/data/imp-35280-eflow-fartail-fd-vs-analytic-surrogate-gap.js (imp-35400 viz page)',
      ticket: 'imp-35400',
      pedagogicalStep: 77,
      honestCeiling:
        'Descriptive stacked-residual and fraction-trend chart baking the imp-35279/imp-35280 four-rung literals verbatim (no new computation, no heavy data-module import); measurement only, component model is the imp-3220/imp-3406 extrapolation not a rigorous asymptotic; C_mb stays GUE-conditional per imp-486; changes no bound, establishes no operator positivity, no RH verdict.',
    }),
    Object.freeze({
      route: '/viz-imp35404-krawczyk-headroom-cancellation',
      title: 'Krawczyk Headroom 2:1 Cancellation: FP_LO Push vs G-Factor Pull',
      oneLine:
        'Diverging bar chart of the imp-35266 decomposition of the imp-35241 band-top headroom surplus into a positive FP_LO finite-N push (dFP) and a negative asymptotic-floor G-factor pull (dG) at the three imp-34693 band landmarks (band-bottom, N_cross, band-top), showing the near-exact 2:1 cancellation (-dFP/dG ~ 2.00042) whose net residue is the reported surplus above the S_inf = 2500 floor.',
      mathBucket: 'bound',
      dataModule: 'src/data/imp-35404-krawczyk-headroom-cancellation-viz-data.js',
      paperSourcePath:
        'src/data/imp-35266-krawczyk-headroom-surplus-decomposition.js (imp-35404 viz page)',
      ticket: 'imp-35404',
      pedagogicalStep: 78,
      honestCeiling:
        'Descriptive diverging-bar chart baking the imp-35266 measurement literals verbatim (no new computation, no heavy data-module import); measurement only on the inherited imp-3220/imp-3406 surrogate; the imp-34714a machine certificate REMAINS OPEN; C_mb stays GUE-conditional per imp-486; changes no bound, establishes no operator positivity, no RH verdict.',
    }),
    Object.freeze({
      route: '/viz-imp35837-krawczyk-cancellation-ratio',
      title: 'Krawczyk Cancellation Ratio Above the Band: Tightens, Then a Float Artifact',
      oneLine:
        'Line chart of the imp-35766 measurement of the imp-35266 surplus-split ratio -dFP/dG above the imp-34693 admissible seed band, showing the deviation R - 2 decreasing monotonically from band-top (~4.170e-4) to the Platt-Trudgian anchor N(T_PT) ~ 1.236e13 (~3.995e-4) and staying flat out to N ~ 1e17, then diverging spuriously upward beyond N ~ 1e18 as double-precision cancellation in dG takes over.',
      mathBucket: 'measurement',
      dataModule: 'src/data/imp-35837-krawczyk-cancellation-ratio-viz-data.js',
      paperSourcePath: 'src/data/imp-35766-krawczyk-cancellation-ratio-beyond-band.js (imp-35837 viz page)',
      ticket: 'imp-35837',
      pedagogicalStep: 112,
      honestCeiling:
        'Descriptive line chart baking the imp-35766 measurement literals verbatim (no new computation, no heavy data-module import); measurement only on the inherited imp-3220/imp-3406 surrogate; the imp-34714a machine certificate REMAINS OPEN; C_mb stays GUE-conditional per imp-486; changes no bound, establishes no operator positivity, no RH verdict.',
    }),
    Object.freeze({
      route: '/viz-imp35460-reentry-band-landmark-disposal',
      title: 'Reentry-Band Landmark Disposal Split: 2 Demoted vs 3 Surviving',
      oneLine:
        'Number-line and split-list chart of the imp-35415 scoping of the imp-35356 route (ii) disposal, showing the two absolute-coordinate reentry-band landmarks (reentry edge 10^27.08, exit edge 10^37.17) demoted to machine-precision surrogate coordinates, versus the three floor-structural diagnostics (width ~10.08 decades, imp-35332 drift self-consistency, imp-35263 co-moving-vs-fixed window) that survive as legitimate surrogate-map descriptors.',
      mathBucket: 'bound',
      dataModule: 'src/data/imp-35460-reentry-band-landmark-disposal-viz-data.js',
      paperSourcePath:
        'src/data/imp-35415-reentry-band-landmark-disposal-scope.js (imp-35460 viz page)',
      ticket: 'imp-35460',
      pedagogicalStep: 79,
      honestCeiling:
        'Descriptive number-line and split-list chart baking the imp-35415 scoping literals verbatim (no new computation, no heavy data-module import); discharges nothing, R1 stays the OPEN binding obstruction, imp-35111a/imp-35174a/imp-34997a/imp-35243a stay OPEN; C_mb stays GUE-conditional per imp-486; changes no bound, establishes no operator positivity, no RH verdict.',
    }),
    Object.freeze({
      route: '/viz-imp35482-sigma-peak-plateau-width-sqrt-scaling',
      title: 'Sigma-Peak Plateau Width vs sqrt(tol): a Line Through the Origin',
      oneLine:
        'Scatter-plus-fit chart of the imp-35411 sqrt(tol) sweep, showing the four measured (sqrt(tol), plateau-width) points sitting on the W = 15.316494 * sqrt(tol) line through the origin -- the signature of a smooth quadratic sigma-peak maximum.',
      mathBucket: 'bound',
      dataModule: 'src/data/imp-35482-sigma-peak-plateau-width-sqrt-scaling-viz-data.js',
      paperSourcePath:
        'src/data/imp-35411-sigma-peak-plateau-width.js (imp-35482 viz page)',
      ticket: 'imp-35482',
      pedagogicalStep: 80,
      honestCeiling:
        'Descriptive scatter-plus-fit chart baking the imp-35411 sqrt(tol) sweep literals verbatim (no new computation, no heavy data-module import); measurement only on the inherited imp-3220/imp-3406 surrogate; the imp-35337a surrogate-vs-true fidelity sub-gap REMAINS OPEN; C_C = (1/8) sqrt(3 pi) ansatz (imp-2642/imp-2643) UNTOUCHED; changes no bound, establishes no operator positivity, no RH verdict.',
    }),
    Object.freeze({
      route: '/viz-imp35483-eflow-fartail-remnant-sub1e3-crossing',
      title: 'E_flow Far-Tail Remnant Sub-1e-3 Crossing Ladder',
      oneLine:
        'Line chart of the imp-35413 fd-vs-analytic E_flow far-tail remnant ladder (N=1e24..1e28) against the 1e-3 threshold, marking the bisected crossing at N ~ 4.17e25 (log10 N ~ 25.6205).',
      mathBucket: 'bound',
      dataModule: 'src/data/imp-35483-eflow-fartail-remnant-sub1e3-crossing-viz-data.js',
      paperSourcePath:
        'src/data/imp-35413-eflow-fartail-remnant-sub1e3-crossing.js (imp-35483 viz page)',
      ticket: 'imp-35483',
      pedagogicalStep: 81,
      honestCeiling:
        'Descriptive line chart baking the imp-35413 sub-1e-3 crossing ladder literals verbatim (no new computation, no heavy data-module import); measurement only on the inherited imp-3220/imp-3406 surrogate; its own surrogate-vs-true fidelity gap remains an UNNAMED tracked sub-gap (imp-35337a does NOT cover this quantity); E_flow > 0 strictness (imp-33848) UNTOUCHED; C_mb GUE-conditional per imp-486 UNTOUCHED; changes no bound, establishes no operator positivity, no RH verdict.',
    }),
    Object.freeze({
      route: '/viz-imp35506-endpoint-positivity-map',
      title: 'N=2000 Pair-1495 Endpoint-Positivity Map (DP45/RK4/BS3 x dt, dt/2)',
      oneLine:
        'Heatmap tabulating the imp-35452/imp-35477 N=2000 pair-1495 endpoint-positivity matrix across three integrator families (DP45, RK4, BS3) x two grids (dt, dt/2), highlighting the lone endpoint-positive cell (DP45 dt/2) against five endpoint-negative cells.',
      mathBucket: 'bound',
      dataModule: 'src/data/imp-35506-endpoint-positivity-map-viz-data.js',
      paperSourcePath:
        'src/data/imp-35452-n2000-endpoint-positivity-knife-edge-reference.js, src/data/imp-35477-n2000-bs3-dense-crossvalidate-reference.js (imp-35506 viz page)',
      ticket: 'imp-35506',
      pedagogicalStep: 82,
      honestCeiling:
        'Descriptive heatmap baking the imp-35452/imp-35477 endpoint-positivity literals verbatim (no new computation); measurement only on the inherited imp-3220/imp-3406 surrogate; does NOT advance the R2 ladder past N=1000 (imp-35221/imp-35324/imp-35412); does NOT change the imp-35412 slack denominator; C_mb GUE-conditional per imp-486 UNTOUCHED; changes no bound, establishes no operator positivity, no RH verdict.',
    }),
    Object.freeze({
      route: '/viz-imp35541-scheme-independence',
      title: 'N=2000 Pair-1495 Crossing t_c: Scheme-Independence Across Orders 3/4/5',
      oneLine:
        'Bar chart and table of the imp-35477 N=2000 pair-1495 within-step crossing t_c across three integrator families (DP45 order 5, RK4 order 4, BS3 order 3) at two grids (dt, dt/2), with pairwise relative deviations all under ~1e-4.',
      mathBucket: 'bound',
      dataModule: 'src/data/imp-35541-scheme-independence-viz-data.js',
      paperSourcePath:
        'src/data/imp-35477-n2000-bs3-dense-crossvalidate-reference.js (imp-35541 viz page)',
      ticket: 'imp-35541',
      pedagogicalStep: 83,
      honestCeiling:
        'Descriptive bar chart baking the imp-35477 scheme-independence literals verbatim (no new computation, no heavy data-module import); measurement only on the inherited imp-3220/imp-3406 surrogate; does NOT advance the R2 ladder past N=1000 (imp-35221/imp-35324/imp-35412); does NOT change the imp-35412 slack denominator; C_mb GUE-conditional per imp-486 UNTOUCHED; changes no bound, establishes no operator positivity, no RH verdict.',
    }),
    Object.freeze({
      route: '/viz-imp35544-sigma-three-input-decomposition',
      title: 'Sigma(N) Three-Input Decomposition: E_trunc / E_flow / E_coll Shares vs N',
      oneLine:
        'Three-line chart of the imp-35475 sigma(N) = E_coll/E(N) share decomposition vs log10(N), showing the E_coll share (sigma) rise to a flat interior peak (~0.94943 near N ~ 9.2186e5), the monotonically falling E_flow share, and the monotonically rising E_trunc share crossing sigma near the E_coll = E_trunc landmark (N ~ 3.280294e9).',
      mathBucket: 'bound',
      dataModule: 'src/data/imp-35544-sigma-three-input-decomposition-viz-data.js',
      paperSourcePath:
        'src/data/imp-35475-sigma-fidelity-closure-scope.js (imp-35544 viz page)',
      ticket: 'imp-35544',
      pedagogicalStep: 84,
      honestCeiling:
        'Descriptive three-line share chart baking offline-reproduced imp-35475 surrogate-formula literals (no fresh computation at load, no heavy data-module import); measurement only on the inherited imp-3220/imp-3406 surrogate; the imp-35337a surrogate-vs-true fidelity sub-gap REMAINS OPEN; the E_coll share is GUE-conditional and inherits imp-486; C_C = (1/8) sqrt(3 pi) ansatz (imp-2642/imp-2643) and E_trunc = 3.06e-5 (imp-2631) UNTOUCHED; changes no bound, establishes no operator positivity, no RH verdict.',
    }),
    Object.freeze({
      route: '/viz-imp35549-height-map-divergence',
      title: 'Height-Map Divergence: effectiveHeightForN vs Closed Surrogate T0=2piN/logN',
      oneLine:
        'Line chart and table of the relative divergence between the Newton-iterated effectiveHeightForN map (imp-35476) and the closed surrogate T0=2*pi*N/logN (imp-35473/imp-35280) across N=1e6..1e200, falling monotonically from ~32.0% to ~1.57% but never vanishing.',
      mathBucket: 'bound',
      dataModule: 'src/data/imp-35549-height-map-divergence-viz-data.js',
      paperSourcePath:
        'src/data/lambda-rh-height-mapping.js, src/data/imp-35473-eflow-fartail-remnant-sub1e4-crossing.js (imp-35549 viz page)',
      ticket: 'imp-35549',
      pedagogicalStep: 85,
      honestCeiling:
        'Descriptive diagnostic re-plot computing both height maps live from their existing formulas (no fresh derivation, no heavy data-module import); measurement only on the inherited imp-3220/imp-3406 surrogate family; does NOT establish which map is more accurate; C_mb GUE-conditional per imp-486 UNTOUCHED; changes no bound, establishes no operator positivity, no RH verdict.',
    }),
    Object.freeze({
      route: '/viz-imp35561-peak-height-map-sensitivity',
      title: 'Sigma-Peak Height-Map Sensitivity: Robust Height, Drifting Location',
      oneLine:
        'Table of the imp-35536 six-height-map sensitivity sweep of the imp-35337 sigma interior peak, showing sigma_max robust to under 1 percent ([0.9417, 0.9507]) while N_max drifts up to +0.16 decades under the full RvM-inverse-to-surrogate swap.',
      mathBucket: 'bound',
      dataModule: 'src/data/imp-35561-peak-height-map-sensitivity-viz-data.js',
      paperSourcePath: 'src/data/imp-35536-peak-height-map-sensitivity.js (imp-35561 viz page)',
      ticket: 'imp-35561',
      pedagogicalStep: 86,
      honestCeiling:
        'Descriptive table re-exporting the imp-35536 peakLadder literals verbatim (no new computation, no heavy data-module import); measurement only on the inherited imp-3220/imp-3406 surrogate; the imp-35337a surrogate-vs-true fidelity sub-gap REMAINS OPEN; C_C = (1/8) sqrt(3 pi) ansatz (imp-2642/imp-2643) UNTOUCHED; changes no bound, establishes no operator positivity, no RH verdict.',
    }),
    Object.freeze({
      route: '/viz-imp35564-fartail-product-decay',
      title: 'E_flow Far-Tail Remnant*logN Product Decay Ladder',
      oneLine:
        'Plots of the imp-35535 fd-vs-analytic remnant*log N product across N=1e26..1e200, showing the product falling monotonically (0.058620 -> 0.016296) while its local decay exponent q steepens monotonically away from zero (-0.435 -> -0.740), confirming no nonzero log-floor through N=1e200.',
      mathBucket: 'bound',
      dataModule: 'src/data/imp-35564-eflow-fartail-product-decay-viz-data.js',
      paperSourcePath: 'src/data/imp-35535-eflow-fartail-remnant-product-decay-ladder.js (imp-35564 viz page)',
      ticket: 'imp-35564',
      pedagogicalStep: 87,
      honestCeiling:
        'Descriptive plots re-exporting the imp-35535 ladder literals verbatim (no new computation, no heavy data-module import); measurement only on the inherited imp-3220/imp-3406 surrogate; C_mb GUE-conditional per imp-486 UNTOUCHED; changes no bound, establishes no operator positivity, no RH verdict.',
    }),
    Object.freeze({
      route: '/viz-imp35580-req4-height-gap',
      title: 'REQ-4 Required-Height Gap: log T0 Needed vs Actual Landmarks',
      oneLine:
        'Bar chart comparing the imp-35538 REQ-4 needed log-height (log T0 >= 200, for a natural O(1/log T0) route-(i) remainder to hit the 0.5% crossover budget) against the actual sigma-peak (~13.23) and crossover (~20.86) landmark log-heights and the Platt-Trudgian anchor (~28.73), showing the needed height is ~9.6x and ~7.0x those respectively.',
      mathBucket: 'bound',
      dataModule: 'src/data/imp-35580-req4-height-gap-viz-data.js',
      paperSourcePath: 'src/data/imp-35538-route-i-remainder-derivation-requirements.js (imp-35580 viz page)',
      ticket: 'imp-35580',
      pedagogicalStep: 88,
      honestCeiling:
        'Descriptive bar chart re-exporting the imp-35538 REQ-4 heightRegime literals verbatim (no new computation, no heavy data-module import); the needed log-height is a scoping estimate under a GUE local-law rate that does not yet rigorously exist (imp-35538 REQ 2); measurement only on the inherited imp-3220/imp-3406 surrogate; C_mb GUE-conditional per imp-486 UNTOUCHED; changes no bound, establishes no operator positivity, no RH verdict.',
    }),
    Object.freeze({
      route: '/viz-imp35582-reentry-band-data-unreachability',
      title: 'Reentry-Band Data Unreachability: log10(N) vs the Verified Frontier',
      oneLine:
        'Places the Platt-Trudgian verified frontier (log10 N ~12.48) and the imp-35537 R1t reentry-band edges (log10 N ~27.08 reentry, ~37.17 exit) on a shared log10(N) axis, showing the whole band sits ~14.6-24.7 decades above the frontier so route-(ii) direct measurement is infeasible.',
      mathBucket: 'bound',
      dataModule: 'src/data/imp-35582-reentry-band-data-unreachability-viz-data.js',
      paperSourcePath: 'src/data/imp-35537-r1t-reentry-band-closure-scope.js (imp-35582 viz page)',
      ticket: 'imp-35582',
      pedagogicalStep: 89,
      honestCeiling:
        'Descriptive log10(N) marker chart re-exporting the imp-35537 Part D operativeSwap literals verbatim (no new computation, no heavy data-module import); measurement only on the inherited imp-3220/imp-3406 surrogate; the reentry band is a diagnostic iterate-count not a Lambda lever; C_mb GUE-conditional per imp-486 UNTOUCHED; changes no bound, establishes no operator positivity, no RH verdict.',
    }),
    Object.freeze({
      route: '/viz-imp35587-arm-asymmetry',
      title: 'Sigma-Peak Arm Asymmetry: W_rise - W_fall and the Width Ratio',
      oneLine:
        'Table and bars of the imp-35451 rising/falling plateau half-width imbalance W_rise - W_fall and the width ratio W_rise/W_fall across tol in {1e-4..1e-7}, narrowing from 1.01449 to 1.00044, produced by the negative cubic-skew coefficient c3 ~ -2.6237e-4.',
      mathBucket: 'bound',
      dataModule: 'src/data/imp-35587-arm-asymmetry-viz-data.js',
      paperSourcePath: 'src/data/imp-35451-sigma-peak-arm-asymmetry.js (imp-35587 viz page)',
      ticket: 'imp-35587',
      pedagogicalStep: 90,
      honestCeiling:
        'Descriptive table/bars re-exporting the imp-35451 arm_asymmetry table and cubic-skew cross-check verbatim (no new computation, no heavy data-module import); measurement only on the inherited imp-3220/imp-3406 surrogate; the imp-35337a surrogate-vs-true fidelity sub-gap REMAINS OPEN; C_C = (1/8) sqrt(3 pi) ansatz (imp-2642/imp-2643) UNTOUCHED; changes no bound, establishes no operator positivity, no RH verdict.',
    }),
    Object.freeze({
      route: '/viz-imp35593-peak-damping',
      title: 'Peak-Location vs Crossover Height-Map Damping',
      oneLine:
        'Paired bars contrasting the imp-35574 peak-LOCATION height-map damping factor (~0.553, amplified) against the imp-35458 crossover damping factor (~18x, log-damped) across the raw-height gap, relative landmark shift, and damping factor, with the ~32.55x crossover-vs-peak readout.',
      mathBucket: 'bound',
      dataModule: 'src/data/imp-35593-peak-damping-viz-data.js',
      paperSourcePath: 'src/data/imp-35574-peak-location-height-map-damping.js (imp-35593 viz page)',
      ticket: 'imp-35593',
      pedagogicalStep: 91,
      honestCeiling:
        'Descriptive paired-bar chart re-exporting the imp-35574 peak/rawHeightGapAtPeak/dampingComparison fields verbatim (no new computation, no heavy data-module import); measurement only on the inherited imp-3220/imp-3406 surrogate; the imp-35337a surrogate-vs-true fidelity sub-gap REMAINS OPEN; C_C = (1/8) sqrt(3 pi) ansatz (imp-2642/imp-2643) UNTOUCHED; changes no bound, establishes no operator positivity, no RH verdict.',
    }),
    Object.freeze({
      route: '/viz-imp35597-threshold-collapse',
      title: 'Route-(i) Subleading-Rate Threshold-Collapse Curve',
      oneLine:
        'Bars of the imp-35571 required log T0 threshold vs the poly-log exponent a and power-law rate delta, against the sigma-peak (~13.23), crossover (~20.86), and Platt-Trudgian anchor (~28.73) landmark log-heights and the e^200 leading-rate baseline (log T0 = 200).',
      mathBucket: 'bound',
      dataModule: 'src/data/imp-35597-threshold-collapse-viz-data.js',
      paperSourcePath: 'src/data/imp-35571-route-i-subleading-rate-scope.js (imp-35597 viz page)',
      ticket: 'imp-35597',
      pedagogicalStep: 92,
      honestCeiling:
        'Descriptive bar chart re-exporting the imp-35571 candidates/landmark table verbatim plus dense curve series (no new derivation, no heavy data-module import); scoping only -- no subleading rate is proved for the zeta zeros; route-(i) stays imp-486 GUE-conditional; the imp-35337a surrogate-vs-true fidelity sub-gap REMAINS OPEN; C_C = (1/8) sqrt(3 pi) ansatz (imp-2642/imp-2643) UNTOUCHED; changes no bound, establishes no operator positivity, no RH verdict.',
    }),
    Object.freeze({
      route: '/viz-imp35628-req-severity-ranking',
      title: 'Route-(i) Requirement Severity Ranking',
      oneLine:
        'Ranked tier chart of the imp-35551 REQ 1-5 severity ordering (RANK1 REQ2 explicit-rate GUE local law binding crux, RANK2 REQ4 height regime folding into REQ2, RANK3 REQ3 conjectural Fourier support, RANK4 REQ1 reachable C_H=1/8 provenance, RANK5 REQ5 irreducible conditionality ceiling), annotated with the REQ2<-REQ4 coupling and the no-single-discharge-suffices verdict.',
      mathBucket: 'bound',
      dataModule: 'src/data/imp-35628-req-severity-ranking-viz-data.js',
      paperSourcePath: 'src/data/imp-35551-route-i-requirement-severity-ranking.js (imp-35628 viz page)',
      ticket: 'imp-35628',
      pedagogicalStep: 93,
      honestCeiling:
        'Descriptive ranked tier chart re-exporting the imp-35551 severity ranking literals verbatim (no new derivation, no heavy data-module import); scoping only -- assesses reachability, discharges nothing; route-(i) stays imp-486 GUE-conditional; changes no bound, establishes no operator positivity, no RH verdict.',
    }),
    Object.freeze({
      route: '/viz-imp35663-decade-span-growth',
      title: 'E_flow Far-Tail Remnant Decade-Span-Growth Ladder',
      oneLine:
        'Bar chart of the imp-35553 decade span to shed each further factor of ten from the E_flow far-tail fd-vs-analytic remnant (83.5687, 300.8583, 1057.6875), plus the declining span ratio (3.6001 -> 3.5156) and the constant-ratio projection overshoot (~25.44 decades) against the sqrt(10) asymptote.',
      mathBucket: 'bound',
      dataModule: 'src/data/imp-35663-eflow-fartail-decade-span-growth-viz-data.js',
      paperSourcePath: 'src/data/imp-35553-eflow-fartail-remnant-decade-span-growth-fit.js (imp-35663 viz page)',
      ticket: 'imp-35663',
      pedagogicalStep: 94,
      honestCeiling:
        'Descriptive bar chart re-exporting the imp-35553 span ladder literals verbatim (no new derivation, no heavy data-module import); measurement only on the inherited imp-3220/imp-3406 surrogate; C_mb GUE-conditional per imp-486 UNTOUCHED; changes no bound, establishes no operator positivity, no RH verdict.',
    }),
    Object.freeze({
      route: '/viz-imp35664-fartail-crossing-height-map-sensitivity',
      title: 'Far-Tail Crossing Height-Map Sensitivity: Growing, Not Damping',
      oneLine:
        'Table of the imp-35577 far-tail-crossing height-map sensitivity: the surrogate-vs-RvM-inverse crossing shift GROWS from +15.31 to +46.84 decades (sub-1e-3 to sub-1e-4) even as the raw height divergence SHRINKS (9.24% to 2.65%), contrasted against the benign sub-1 percent imp-35458 crossover log-damping.',
      mathBucket: 'bound',
      dataModule: 'src/data/imp-35664-fartail-crossings-height-map-sensitivity-viz-data.js',
      paperSourcePath: 'src/data/imp-35577-fartail-crossings-height-map-sensitivity.js (imp-35664 viz page)',
      ticket: 'imp-35664',
      pedagogicalStep: 95,
      honestCeiling:
        'Descriptive table re-exporting the imp-35577 crossings literals verbatim (no new derivation, no heavy data-module import); measurement only on the inherited imp-3220/imp-3406 surrogate; the imp-35337a surrogate-vs-true fidelity sub-gap REMAINS OPEN; C_mb GUE-conditional per imp-486 UNTOUCHED; changes no bound, establishes no operator positivity, no RH verdict.',
    }),
    Object.freeze({
      route: '/viz-imp35665-pinsker-common-functional-bridge',
      title: 'Pinsker Common-Functional Bridge: an Upper Bound Only',
      oneLine:
        'Table of the imp-35556 Pinsker common-first-order-functional bridge: the three KL g_true values (free 3.214e-4, 1/logT0 1.146e-3, 1/logT0^2 6.816e-4), their Pinsker TV <= sqrt(KL/2) upper bounds (1.2677e-2, 2.3938e-2, 1.8460e-2), and the E_coll-multiple ratios (414.3x, 782.3x, 603.3x), with a banner stating the bound is UPPER-ONLY and cannot certify the g_true >> E_coll gap.',
      mathBucket: 'bound',
      dataModule: 'src/data/imp-35665-pinsker-common-functional-bridge-viz-data.js',
      paperSourcePath: 'src/data/imp-35556-gtrue-ecoll-dimensional-comparability.js (imp-35665 viz page)',
      ticket: 'imp-35665',
      pedagogicalStep: 96,
      honestCeiling:
        'Descriptive table re-exporting the imp-35556 Pinsker-bridge literals verbatim (no new derivation, no heavy data-module import); measurement only on the inherited imp-3220/imp-3406 surrogate; imp-35556a and imp-35337a stay OPEN; C_mb GUE-conditional per imp-486 UNTOUCHED; changes no bound, establishes no operator positivity, no RH verdict.',
    }),
    Object.freeze({
      route: '/viz-imp35710-winding-mesh-cost-delta-ladder',
      title: 'Winding-Barrier Mesh-Cost Delta-Ladder',
      oneLine:
        'Line chart of the imp-35675 finite winding-barrier (B1) mesh cost at T_PT=3e12: boundary evaluations per enclosed zero across the transition-width Delta ladder {1,2,5,10,20,50,100}, decaying monotonically from 18 toward the exact horizontal asymptote of 6, anchored at local density ~4.28 zeros/unit and meshPerUnit ~12.84.',
      mathBucket: 'bound',
      dataModule: 'src/data/imp-35710-winding-mesh-cost-delta-ladder-viz-data.js',
      paperSourcePath: 'src/data/imp-35675-finite-winding-mesh-cost-vs-delta.js (imp-35710 viz page)',
      ticket: 'imp-35710',
      pedagogicalStep: 97,
      honestCeiling:
        'Descriptive chart re-exporting the imp-35675 Delta-ladder cost table verbatim (no new derivation, no heavy data-module import); presentation only, does not discharge the non-finite argument-principle tail lemma (imp-35653 Part D, W3); changes no bound, establishes no operator positivity, no RH verdict.',
    }),
    Object.freeze({
      route: '/viz-imp35386-kemp-bracketing-ladder',
      title: 'Empirical Prefactor kEmp Across the imp-35076 Ladder',
      oneLine:
        'Scatter chart of the imp-35264 empirical prefactor kEmp(eps) at each imp-35076 finite-ladder rung (N in 1e3..1e7) against the imp-35240 confirmed closed form K = 8 sqrt(2)/(9 pi) = 0.400141, with the coarsest and finest rungs annotated as understood departures (physical O(eps) term; imp-35076 6-decimal storage floor).',
      mathBucket: 'measurement',
      dataModule: 'src/data/imp-35386-kemp-bracketing-ladder-viz-data.js',
      paperSourcePath: 'src/data/imp-35264-rho-prefactor-vs-imp35076-margin-crosscheck.js (imp-35386 viz page)',
      ticket: 'imp-35386',
      pedagogicalStep: 98,
      honestCeiling:
        'Descriptive chart re-exporting the imp-35264 crosscheck table verbatim (no new derivation, no heavy data-module import); presentation only on the inherited imp-3220/imp-3406/imp-33646 model-cusp surrogate; does NOT discharge O3 / H3 / H4 / G6a; imp-3066 off-diagonal endpoint-Hankel K_a >= 0 UNTOUCHED; changes no bound, establishes no operator positivity, no RH verdict.',
    }),
    Object.freeze({
      route: '/viz-imp35750-beat-parity-handoff-sigma',
      title: 'Beat -> Parity Handoff Along the Sigma-Axis',
      oneLine:
        'Line chart of the imp-35678 beat-carrier-to-parity handoff: the GUE-conditional beat-carrier share (=sigma) falling toward zero against the surviving C_T-barrier share (=1-sigma-E_flow_share) rising toward one across the imp-35677 four-rung far-tail sigma ladder, with the mathematical crossover at sigma=0.5 noted as lying far above the measured ladder range.',
      mathBucket: 'measurement',
      dataModule: 'src/data/imp-35750-beat-parity-handoff-sigma-viz-data.js',
      paperSourcePath: 'src/data/imp-35678-finite-height-beat-vs-parity-regime-boundary.js (imp-35750 viz page)',
      ticket: 'imp-35750',
      pedagogicalStep: 99,
      honestCeiling:
        'Descriptive chart re-exporting the imp-35677/imp-35678 sigma-share model verbatim (no new derivation, no heavy data-module import); presentation only, illustrates continuation of an already-completed handoff rather than the crossing point; C_mb GUE-conditional (imp-486) UNTOUCHED; changes no bound, establishes no operator positivity, no RH verdict.',
    }),
    Object.freeze({
      route: '/viz-imp35751-postport-shares-sigma',
      title: 'Post-Port Provenance Shares Across the Sigma-Ladder',
      oneLine:
        'Line chart of the imp-35677 post-port error-budget partition: the residual GUE-conditional share (=sigma, imp-486) vanishing by a factor 10 per rung against the surviving unconditional share (=1-sigma, covering E_trunc+E_flow) rising from 0.999 toward 0.999999 across the four-rung far-tail sigma ladder.',
      mathBucket: 'measurement',
      dataModule: 'src/data/imp-35751-postport-shares-sigma-viz-data.js',
      paperSourcePath: 'src/data/imp-35677-postport-residual-share-sigma-ladder.js (imp-35751 viz page)',
      ticket: 'imp-35751',
      pedagogicalStep: 100,
      honestCeiling:
        'Descriptive chart re-exporting the imp-35677 sigma-share model verbatim (no new derivation, no heavy data-module import); presentation only; C_mb GUE-conditional (imp-486) UNTOUCHED; changes no bound, establishes no operator positivity, no RH verdict.',
    }),
    Object.freeze({
      route: '/viz-imp35772-collision-scale-prefactor-propagation',
      title: 'Collision-Scale Prefactor Propagation Onto Sigma-Landmarks',
      oneLine:
        'Log-log line chart of the imp-35724 propagation of the imp-35696 cube-root collision-scale prefactor ((pi^2/3)/C_C)^{1/3} ~ 2.047 onto the two imp-35337 sigma-landmark heights N_peak (~9.22e5) and N_cross (~3.28e9): the standard-vs-C_C s_min shift is the identical O(1) factor at both landmarks while the -1/3 log-log slope of s_min against N is untouched.',
      mathBucket: 'measurement',
      dataModule: 'src/data/imp-35772-collision-scale-prefactor-propagation-viz-data.js',
      paperSourcePath: 'src/data/imp-35724-collision-scale-landmark-prefactor-propagation.js (imp-35772 viz page)',
      ticket: 'imp-35772',
      pedagogicalStep: 110,
      honestCeiling:
        'Descriptive chart re-exporting the imp-35724 propagation measurement verbatim (no new derivation, no heavy data-module import); presentation only; C_mb GUE-conditional (imp-486) UNTOUCHED; changes no bound, establishes no operator positivity, no RH verdict.',
    }),
    Object.freeze({
      route: '/viz-imp35975-beat-parity-nsigma-ladder',
      title: 'Beat-to-Parity Handoff Ladder on the N-Axis',
      oneLine:
        'Log-N line chart of the imp-35723 beat-to-parity handoff ladder: three landmark rungs (interior beat peak N~9.22e5 sigma~0.9494, imp-35750 handoff midpoint N~3.27e9 sigma=0.5, deep parity onset N~3.21e11 sigma=0.1) baked by imp-35791 as an N-ordered ladder, now rendered on a routed page.',
      mathBucket: 'measurement',
      dataModule: 'src/data/imp-35791-beat-parity-Nsigma-ladder-viz-data.js',
      paperSourcePath: 'src/data/imp-35723-beat-parity-regime-boundary-Nsigma-locator.js (imp-35975 viz page)',
      ticket: 'imp-35975',
      pedagogicalStep: 111,
      honestCeiling:
        'Descriptive chart re-exporting the imp-35791 N-sigma ladder verbatim (no new derivation, no heavy data-module import); presentation only; C_mb GUE-conditional (imp-486) UNTOUCHED; changes no bound, establishes no operator positivity, no RH verdict.',
    }),
    Object.freeze({
      route: '/viz-imp35823-required-height-ladder',
      title: 'Merged Required-Height Ladder Across Peak / Sigma / PT Rungs',
      oneLine:
        'Line chart of the imp-35763 merged six-rung REQ-4 required-height ladder: the required-height multiple 200/log T0 descending monotonically across the sigma-peak, sigma<0.9/0.5/0.1 downslope landmarks, the E_coll=E_trunc crossover, and the Platt-Trudgian anchor, none of which reach the imp-35538 binding log-height 200.',
      mathBucket: 'measurement',
      dataModule: 'src/data/imp-35823-required-height-ladder-viz-data.js',
      paperSourcePath: 'src/data/imp-35763-req4-required-height-sigma-landmark-fill.js (imp-35823 viz page)',
      ticket: 'imp-35823',
      pedagogicalStep: 101,
      honestCeiling:
        'Descriptive chart re-exporting the imp-35763/imp-35722 required-height ladder verbatim (no new derivation, no heavy data-module import); presentation only; C_mb GUE-conditional (imp-486) UNTOUCHED; imp-35337a stays OPEN; changes no bound, establishes no operator positivity, no RH verdict.',
    }),
    Object.freeze({
      route: '/viz-imp35824-surplus-waterfall',
      title: 'Krawczyk Surplus Waterfall: Shift vs Curvature Residual',
      oneLine:
        'Stacked-bar waterfall of the imp-35762 D3 residual split across the imp-34693 band-bottom/N_cross/band-top anchors: the leading estimate S_inf.a/2 plus a thin a-shift sliver (~1.7-2.6%) plus the dominant O(a^2) curvature residual (~97-98%) reproduces the exact Krawczyk headroom surplus at every anchor.',
      mathBucket: 'measurement',
      dataModule: 'src/data/imp-35824-krawczyk-surplus-waterfall-viz-data.js',
      paperSourcePath: 'src/data/imp-35762-krawczyk-surplus-shift-residual-isolation.js (imp-35824 viz page)',
      ticket: 'imp-35824',
      pedagogicalStep: 102,
      honestCeiling:
        'Descriptive chart re-exporting the imp-35762 additive surplus split verbatim (no new derivation, no heavy data-module import); presentation only; measurement on the inherited imp-3220/imp-3406 surrogate; imp-34714a REMAINS OPEN; C_C 1/8 (imp-2642/2643) and C_mb GUE-conditional (imp-486) UNTOUCHED; changes no bound, establishes no operator positivity, no RH verdict.',
    }),
    Object.freeze({
      route: '/viz-imp35863-krawczyk-split-inversion',
      title: 'Krawczyk Surplus-Split Height-Axis Inversion',
      oneLine:
        'Line chart of the imp-35809 shift_fraction and curvature_fraction vs log10(N) from the imp-34693 band-top (~98.1% curvature) to the Platt-Trudgian anchor N~1.236e13 (~98.5% shift), marking the 50/50 crossover at a=4.delta (N~1.88e11) and the near-mirror band-top/PT-anchor split.',
      mathBucket: 'measurement',
      dataModule: 'src/data/imp-35863-krawczyk-split-inversion-viz-data.js',
      paperSourcePath: 'src/data/imp-35809-krawczyk-surplus-split-band-and-height-profile.js (imp-35863 viz page)',
      ticket: 'imp-35863',
      pedagogicalStep: 103,
      honestCeiling:
        'Descriptive chart re-exporting the imp-35809 height-axis split-inversion measurement verbatim (no new derivation, no heavy data-module import); presentation only; measurement on the inherited imp-3220/imp-3406 surrogate; imp-34714a REMAINS OPEN; C_C 1/8 (imp-2642/2643) and C_mb GUE-conditional (imp-486) UNTOUCHED; changes no bound, establishes no operator positivity, no RH verdict.',
    }),
    Object.freeze({
      route: '/viz-imp35864-debruijn-digit-ladder',
      title: 'Exact de Bruijn Working-Digit Ladder D*(x)',
      oneLine:
        'Line chart of the imp-35811 BigInt-measured working-digit count D*(x) vs x on [104,1000], with the pi/(8 ln10) linear digit law, the double (~15.95 digit) and quad (~33.9 digit) precision bands, and the T_PT=6e12 extrapolation to ~1.02e12 digits/value annotated.',
      mathBucket: 'measurement',
      dataModule: 'src/data/imp-35864-debruijn-digit-ladder-viz-data.js',
      paperSourcePath: 'src/data/imp-35811-exact-debruijn-arbitrary-precision-digit-table.js (imp-35864 viz page)',
      ticket: 'imp-35864',
      pedagogicalStep: 104,
      honestCeiling:
        'Descriptive chart re-exporting the imp-35811 BigInt digit-ladder measurement verbatim (no new derivation, no heavy data-module import, no ~520-digit recomputation at page load); measures ONLY the exp(-pi x/8) underflow-driven mantissa-digit requirement off the imp-35781-measured accumulator scale K; evaluates no true H_0 at high precision, extends no evaluator, certifies no value at any height, changes no bound; no RH claim.',
    }),
    Object.freeze({
      route: '/viz-imp35865-summation-scheme-ladder',
      title: 'Summation-Scheme Error Ladder',
      oneLine:
        'Log-log line chart of the imp-35812 exact-BigInt-referenced naive/pairwise/Kahan-Babuska summation error ladder vs N=[1e3,4.886e5], against the imp-35761 pessimistic N.eps/log2(N).eps ceilings, with the imp-35760 O(1) barrier-margin headroom annotated.',
      mathBucket: 'measurement',
      dataModule: 'src/data/imp-35865-summation-scheme-ladder-viz-data.js',
      paperSourcePath: 'src/data/imp-35812-w1-summation-scheme-measured-cost.js (imp-35865 viz page)',
      ticket: 'imp-35865',
      pedagogicalStep: 105,
      honestCeiling:
        'Descriptive chart re-exporting the imp-35812 exact-BigInt-referenced summation-scheme measurement verbatim (no new derivation, no heavy data-module import, no re-running the summation schemes at page load); measurement only; certifies no W1 bound; evaluates no true H_0; instantiates no interval; verifies no inequality; establishes no positivity; the W1 A+B-C certificate at T_PT stays GREENFIELD (imp-35681 Part A); no RH claim.',
    }),
    Object.freeze({
      route: '/viz-imp35934-kappa-sweep-ladder',
      title: 'Summation-Scheme Error vs Condition Number kappa',
      oneLine:
        'Log-log line chart of the imp-35854 exact-BigInt-referenced naive/pairwise/Kahan-Babuska relative-error sweep vs the condition number kappa=Sum|t_k|/|Sum t_k| ~1 to ~2e5, showing the naive relative error grows far sublinearly in kappa.',
      mathBucket: 'measurement',
      dataModule: 'src/data/imp-35934-kappa-sweep-viz-data.js',
      paperSourcePath: 'src/data/imp-35854-w1-summation-kappa-sweep.js (imp-35934 viz page)',
      ticket: 'imp-35934',
      pedagogicalStep: 106,
      honestCeiling:
        'Descriptive chart re-exporting the imp-35854 exact-BigInt-referenced kappa-sweep measurement verbatim (no new derivation, no heavy data-module import, no re-running the summation schemes at page load); measurement only; certifies no W1 bound; evaluates no true H_0; instantiates no interval; verifies no inequality; establishes no positivity; the W1 A+B-C certificate at T_PT stays GREENFIELD (imp-35681 Part A); no RH claim.',
    }),
    Object.freeze({
      route: '/viz-imp35935-adversarial-ordering',
      title: 'Summation-Scheme Error Under Adversarial Orderings',
      oneLine:
        'Grouped log-scale bar chart of the imp-35852 exact-BigInt-referenced naive/pairwise/Kahan-Babuska normalized error under five hostile term orderings (original/signedAsc/magAsc/magDesc/clustered), showing the worst ordering climbs but never reaches the coherent N*eps ceiling.',
      mathBucket: 'measurement',
      dataModule: 'src/data/imp-35935-adversarial-ordering-viz-data.js',
      paperSourcePath: 'src/data/imp-35852-w1-summation-adversarial-ordering.js (imp-35935 viz page)',
      ticket: 'imp-35935',
      pedagogicalStep: 107,
      honestCeiling:
        'Descriptive chart re-exporting the imp-35852 exact-BigInt-referenced adversarial-ordering measurement verbatim (no new derivation, no heavy data-module import, no re-running the summation schemes at page load); measurement only; certifies no W1 bound; evaluates no true H_0; instantiates no interval; verifies no inequality; establishes no positivity; the W1 A+B-C certificate at T_PT stays GREENFIELD (imp-35681 Part A); no RH claim.',
    }),
    Object.freeze({
      route: '/viz-imp35936-req4-height-multiple-sigma',
      title: 'REQ-4 Required-Height Multiple vs Sigma',
      oneLine:
        'Line chart of the imp-35853 continuous REQ-4 required-height multiple 200/log T0 versus sigma on the peak-to-PT downslope, marking the Kneedle elbow (sigma~0.783), flattest point (sigma~0.407), and PT-anchor (sigma~0.019, ~6.96x) locators.',
      mathBucket: 'measurement',
      dataModule: 'src/data/imp-35936-req4-height-multiple-sigma-viz-data.js',
      paperSourcePath: 'src/data/imp-35853-req4-required-height-continuous-sigma-knee.js (imp-35936 viz page)',
      ticket: 'imp-35936',
      pedagogicalStep: 108,
      honestCeiling:
        'Descriptive chart re-exporting the imp-35853 measurement verbatim (no new derivation, no heavy data-module import, no re-running the bisection sweep at page load); measurement only; the multiple does not flatten onto the PT-anchor value in sigma-space; establishes no operator positivity; imp-35337a stays OPEN.',
    }),
    Object.freeze({
      route: '/viz-imp35771-req4-height-multiple',
      title: 'REQ-4 Required-Height Multiple Ladder (200 / log T0)',
      oneLine:
        'Bar chart of the imp-35722 required-height multiple 200/log T0 across the three base landmarks (sigma-peak ~15.12x, E_coll=E_trunc crossover ~9.59x, Platt-Trudgian anchor ~6.96x), with the residual log-height gap (200 - log T0) column that imp-35580 bar-charted the raw log-heights for but never turned into a ratio.',
      mathBucket: 'measurement',
      dataModule: 'src/data/imp-35771-req4-required-height-multiple-viz-data.js',
      paperSourcePath: 'src/data/imp-35722-req4-required-height-landmark-ladder.js (imp-35771 viz page)',
      ticket: 'imp-35771',
      pedagogicalStep: 109,
      honestCeiling:
        'Descriptive chart re-exporting the imp-35722 required-height ladder verbatim (no new derivation, no heavy data-module import); presentation only; C_mb GUE-conditional (imp-486) UNTOUCHED; imp-35337a stays OPEN; changes no bound, establishes no operator positivity, no RH verdict.',
    }),
    Object.freeze({
      route: '/viz-imp35957-rdirect-floor-height-sweep',
      title: 'R_direct Floor-vs-Height Sweep: Plateau Then a Hard NaN Cliff',
      oneLine:
        'Line chart of the imp-35892 extended height sweep of the de-cancelled surplus-split ratio R_direct = -S_inf . a/(2-a) against its independent R_clean reference, showing a <= 2 ULP plateau from N = 1e13 to N ~ 2.857e307 followed by an abrupt NaN cliff at N ~ 10^307.46 once the effectiveHeightForN RvM height inverse overflows past Number.MAX_VALUE.',
      mathBucket: 'measurement',
      dataModule: 'src/data/imp-35957-rdirect-floor-height-sweep-viz-data.js',
      paperSourcePath: 'src/data/imp-35892-rdirect-own-floor-departure-height.js (imp-35957 viz page)',
      ticket: 'imp-35957',
      pedagogicalStep: 113,
      honestCeiling:
        'Descriptive chart re-exporting the imp-35892 measurement literals verbatim (no new computation, no heavy data-module import); measurement/diagnostic only, double precision; instantiates no interval; imp-34714a REMAINS OPEN; C_mb stays GUE-conditional per imp-486; changes no bound, establishes no operator positivity, no RH verdict.',
    }),
    Object.freeze({
      route: '/viz-imp36143-e-share-threshold-crossing-ladder',
      title: 'E-Share Threshold-Crossing Ladder',
      oneLine:
        'Line chart of the imp-35889 E(N) = E_trunc + E_flow + E_coll fractional share vs log10 N, combining the imp-36046 tail landmarks with the imp-36097 threshold crossings (shareFlow < 1e-3/1e-5/1e-6, shareColl < 1%), marking the imp-35971 sole-survivor height where the shareColl < 1% crossing lands.',
      mathBucket: 'measurement',
      dataModule: 'src/data/imp-36097-e-share-threshold-crossings-viz-data.js',
      paperSourcePath: 'src/data/imp-36046-e-share-tail-landmarks-viz-data.js (imp-36143 viz page)',
      ticket: 'imp-36143',
      pedagogicalStep: 114,
      honestCeiling:
        'Descriptive chart re-exporting the baked imp-36097 and imp-36046 viz-data literals verbatim (no new computation, no heavy data-module import); measurement/presentation only; C_C GUE-conditional (imp-2642 / imp-2643 / imp-486) untouched; changes no bound, establishes no operator positivity, no RH verdict.',
    }),
    Object.freeze({
      route: '/viz-imp36227-en-threefold-imp321-ladder',
      title: 'E(N) Threefold Across the imp-321 Ladder',
      oneLine:
        'Line chart of the pinned-constants E(N) = E_trunc + E_flow + E_coll (imp-35889 / imp-35968 sub-terms) across the seven imp-321 ladder rungs (N = 2458 to 1e8), marking the fixed imp-2631 / imp-35164 E_trunc = 3.06e-5 floor and the imp-35968 E_trunc = E_coll crossover at N_cross ~ 3.28e9, ~1.52 decades beyond the ladder top.',
      mathBucket: 'measurement',
      dataModule: 'src/data/imp-36227-en-threefold-imp321-ladder-viz-data.js',
      paperSourcePath: 'src/data/lambda-pt-scale-extrapolation.js (imp-321 ladder; imp-36227 viz page)',
      ticket: 'imp-36227',
      pedagogicalStep: 115,
      honestCeiling:
        'Descriptive chart of baked imp-35889 / imp-35968 sub-term literals evaluated on the imp-321 ladder (no heavy data-module import); measurement/presentation only; E_trunc = 3.06e-5 (imp-2631), C_C GUE-conditional (imp-2642 / imp-2643 / imp-486) untouched; E(N) does NOT tend to 0 on the current surrogate (imp-35164); changes no bound, establishes no operator positivity, no RH verdict.',
    }),
    Object.freeze({
      route: '/viz-imp36173-b2-tstar-checklist-ladder',
      title: 'B2 Effective-Height T_star(N) Finite-N Ladder',
      oneLine:
        'Line chart of the imp-327 Riemann-von Mangoldt inverse T_star(N) = effectiveHeightForN(N) swept across the imp-36173 twelve-rung finite-N ladder (N = 2458 to 1.236e13), marking the Platt-Trudgian verified-height crossover at 3e12 and labelling every rung RH-up-to-height (FINITE, never unconditional RH).',
      mathBucket: 'measurement',
      dataModule: 'src/data/imp-36173-b2-tstar-checklist-ladder.js',
      paperSourcePath: 'src/data/lambda-rh-height-mapping.js (imp-327 inverse; imp-36173 viz page)',
      ticket: 'imp-36173',
      pedagogicalStep: 116,
      honestCeiling:
        'Descriptive chart re-exporting the imp-36173 tabulation verbatim (no new numerics, no heavy data-module import); tabulation/bookkeeping only; B2-effective-height-Tstar (imp-35099) stays BLOCKED since the achieved-N of Steps 3-4 is undefined; upgrades no status string; changes no bound, establishes no operator positivity, no RH verdict; NO QED.',
    }),
    Object.freeze({
      route: '/viz-imp36192-i2-truncation-blowup',
      title: 'I2 Local-Truncation Blow-up dt^5 delta^-9 vs Min Gap',
      oneLine:
        'Log-log chart of the imp-36192 I2 crux ingredient: RK4 local truncation scale dt^5 * delta^-9 against the min particle gap delta, tiny in the bulk (delta ~ O(1)) and vacuous (>1) as delta -> 1e-4 near the collision front.',
      mathBucket: 'measurement',
      dataModule: 'src/data/imp-36192-step2-g-step-error-apriori-truncation-scope.js',
      paperSourcePath: 'src/data/imp-36192-step2-g-step-error-apriori-truncation-scope.js (I2 crux; imp-36244 viz page)',
      ticket: 'imp-36244',
      pedagogicalStep: 117,
      honestCeiling:
        'Illustrative curve reusing the baked imp-36192 crux exponents (dt^5, delta^-9) and representative dt = 1e-5 (no new numerics, no heavy data-module import); presentation only; G-step-error stays OPEN and NOT independently dischargeable (coupled to G-gronwall and G-interval-enclosure); changes no bound, establishes no operator positivity, no RH verdict; NO QED.',
    }),
    Object.freeze({
      route: '/viz-imp36251-krawczyk-residual-operator-fixedpoint',
      title: 'Krawczyk Residual Operator F(m) and F-prime(m) at N_cross',
      oneLine:
        'Line charts of the imp-36154 residual operator F(m) = m - K log T0(m) crossing zero at its fixed point N_cross ~ 3.28e9, and its exact derivative F-prime(m) staying in [0.924, 0.968] across a +/-40% window, illustrating the (H1) nonvanishing margin (~0.9546 at the centre) for the Krawczyk existence/uniqueness template.',
      mathBucket: 'measurement',
      dataModule: 'src/data/imp-36251-krawczyk-residual-operator-fixedpoint-viz-data.js',
      paperSourcePath: 'src/data/imp-36154-krawczyk-existence-uniqueness-subgap-requirements.js (F(m)/F-prime(m); imp-36251 viz page)',
      ticket: 'imp-36251',
      pedagogicalStep: 118,
      honestCeiling:
        'Illustrative double-precision grid reusing the imp-36154 F(m)/F-prime(m) closed forms and constants (no new numerics, no heavy data-module import at runtime); presentation only; certifies no interval, constructs no [F-prime] enclosure; the imp-36154 R1-R6 requirements are untouched, imp-34687a stays UNIMPLEMENTED and imp-34714a stays OPEN; changes no bound, establishes no operator positivity, no RH verdict; NO QED.',
    }),
    Object.freeze({
      route: '/viz-imp36267-crossover-sensitivity',
      title: 'E_trunc = E_coll Crossover Height Power Law',
      oneLine:
        'Log-log chart of the imp-36139 sensitivity sweep: the E_trunc = E_coll crossover height N_cross re-located over a 9-point half-to-double grid of the imp-2631 fixed-strip floor, obeying a clean power law N_cross ~ E_trunc^-2.095 (R^2 ~ 0.9999993) and swinging ~18.3x across the 4x floor range.',
      mathBucket: 'measurement',
      dataModule: 'src/data/imp-36139-etrunc-coll-crossover-sensitivity.js',
      paperSourcePath: 'src/data/imp-36139-etrunc-coll-crossover-sensitivity.js (crossover sensitivity sweep; imp-36267 viz page)',
      ticket: 'imp-36267',
      pedagogicalStep: 119,
      honestCeiling:
        'Descriptive chart re-exporting the imp-36139 grid verbatim (no new numerics, no heavy data-module import); presentation only; the imp-35968 quote N_cross ~ 3.28e9 is a floor-sensitivity readout of the pinned imp-2631 value, not an intrinsic landmark; C_C = (1/8) sqrt(3 pi) (imp-2642 / imp-2643) and C_mb GUE-conditional (imp-486) are UNTOUCHED; imp-35337a stays OPEN; changes no bound, establishes no operator positivity, no RH verdict; NO QED.',
    }),
    Object.freeze({
      route: '/viz-imp36268-panel-count-ratio',
      title: 'Route II vs Route I Panel-Count / Panel-Width Ratio',
      oneLine:
        'Bar comparison of the imp-36141 frequency-floor panel ratios for the imp-35777 I2 sup|H_t prime| cap: Route II needs >= 1.0265x the panels of Route I (+2.65%), equivalently 0.9742x the panel width (-2.58%), pinned by the exact identity w - log N = (1/2) log 2.',
      mathBucket: 'measurement',
      dataModule: 'src/data/imp-36141-route-ii-vs-route-i-panel-count-ratio.js',
      paperSourcePath: 'src/data/imp-36141-route-ii-vs-route-i-panel-count-ratio.js (panel-count ratio tabulation; imp-36268 viz page)',
      ticket: 'imp-36268',
      pedagogicalStep: 120,
      honestCeiling:
        'Descriptive chart re-exporting the imp-36141 tabulation verbatim (no new numerics, no heavy data-module import); presentation only; 1.0265 is a frequency-floor LOWER bound on the true panel-count ratio, not the exact ratio; certifies no derivative bound B, certifies no I2 cap; C_mb GUE-conditional (imp-486) is UNTOUCHED; changes no bound, establishes no operator positivity, no RH verdict; NO QED.',
    }),
    Object.freeze({
      route: '/viz-imp36287-kbn-floor-headroom-divergence',
      title: 'KBN Floor vs Certified Run-Max Headroom Divergence',
      oneLine:
        'Log-log chart of the imp-36083 / imp-36135 KBN-compensated-floor (N-flat, ~1.89e-20) against the sqrt(N)-rising certified run-max rung, widening at ~+0.5 orders per decade of N, with the algebraic N_cross ~ 4e-8 (< 1 retained term) crossing annotated as unphysical.',
      mathBucket: 'measurement',
      dataModule: 'src/data/imp-36287-kbn-floor-headroom-divergence-viz-data.js',
      paperSourcePath: 'src/data/imp-36135-kbn-floor-headroom-extrapolation.js (headroom extrapolation + crossing solve; imp-36287 viz page)',
      ticket: 'imp-36287',
      pedagogicalStep: 121,
      honestCeiling:
        'Descriptive chart baking the imp-36083 measured ladder and the imp-36135 extrapolation + crossing solve verbatim (no new numerics, no heavy data-module import); presentation only; N_cross < 1 is an algebraic artifact of solving C sqrt(N) = floor, not a physical event; certifies no W1 bound, instantiates no directed-rounding interval; C_mb GUE-conditional (imp-486) is UNTOUCHED; changes no bound, establishes no operator positivity, no RH verdict; NO QED.',
    }),
    Object.freeze({
      route: '/viz-imp36288-routeb-slope-convergence',
      title: 'Route-B Rate Slope Convergence to -1/4',
      oneLine:
        'Chart of the imp-36082 Route-B rate r_B(N) local log-log slope across ten consecutive windows spanning N = 1e2 through 1e300, showing the slope monotonically tightening toward the pinned -1/4 leading exponent from above, making the imp-36151 slope-convergence witness a chart.',
      mathBucket: 'measurement',
      dataModule: 'src/data/imp-36288-routeB-slope-convergence-viz-data.js',
      paperSourcePath: 'src/data/imp-36151-routeC-vs-routeB-perN-exponent-comparison.js (slope-convergence witness; imp-36288 viz page)',
      ticket: 'imp-36288',
      pedagogicalStep: 122,
      honestCeiling:
        'Descriptive chart baking the imp-36082/imp-36151 r_B(N) rate machinery verbatim across a wider ladder (no new numerics, no heavy data-module import); presentation only; r_B(N) bounds a shock-time DEVIATION, not |t_c(N)| absolutely (imp-36082 CONSUMABLE-MODULO-ANCHOR); does not imply the imp-36045 Route-C > Route-B ranking reflects a faster exponent (imp-36151); C_mb GUE-conditional (imp-486) is UNTOUCHED; changes no bound, establishes no operator positivity, no RH verdict; NO QED.',
    }),
    Object.freeze({
      route: '/sign-switching',
      title: 'Sign Switching & Bridge Energy',
      oneLine:
        'Link a collision half-disk to its modal diameter, then reconstruct the full Ξ shear as even energy minus odd energy from a positive boundary kernel.',
      mathBucket: 'kernel',
      dataModule: 'src/data/sign-switching-xi.json',
      paperSourcePath: 'formalization/paper/sign_switching_energy_2026-11-07.md',
      ticket: 'user-research-2026-11-07',
      pedagogicalStep: 123,
      honestCeiling:
        'The local model and full-kernel identity are exact. Finite numerical benchmarks do not prove the all-height energy inequality; no RH claim.',
    }),
  ]),
});

// ── Build-time tripwires (>= 5) ──────────────────────────────────────────
//
// Guard the structural invariants of VISUALIZATIONS_INDEX. The
// run-assertions.mjs harness invokes every .holds() and fails the build
// if any returns false.

// These original route/ticket/bucket pairings and the six data-file pins are
// independent of the live catalog. Extensions must not silently rewrite them.
const FOUNDATION_ENTRIES = Object.freeze([
  Object.freeze({ route: '/viz-log-phase-spiral', ticket: 'imp-1222', mathBucket: 'phase-spiral', dataModule: 'src/data/viz-log-phase-spiral.js' }),
  Object.freeze({ route: '/viz-twin-ladder-tomography', ticket: 'imp-1223', mathBucket: 'tomography', dataModule: 'src/data/viz-twin-ladder-tomography.js' }),
  Object.freeze({ route: '/viz-euler-transport-flow', ticket: 'imp-1224', mathBucket: 'flow-field', dataModule: 'src/data/viz-euler-transport-flow.js' }),
  Object.freeze({ route: '/viz-prime-caustic', ticket: 'imp-1225', mathBucket: 'caustic', dataModule: 'src/data/viz-prime-caustic.js' }),
  Object.freeze({ route: '/viz-hyperbolic-prime-spiral', ticket: 'imp-1226', mathBucket: 'hyperbolic', dataModule: 'src/data/viz-hyperbolic-prime-spiral.js' }),
  Object.freeze({ route: '/viz-prime-phase-crystal', ticket: 'imp-1227', mathBucket: 'crystal', dataModule: 'src/data/viz-prime-phase-crystal.js' }),
  Object.freeze({ route: '/cayley-schur-trajectory', ticket: 'imp-1294', mathBucket: 'schur', dataModule: null }),
  Object.freeze({ route: '/viz-volterra-kernel-heatmap', ticket: 'imp-1291', mathBucket: 'kernel', dataModule: null }),
  Object.freeze({ route: '/viz-volterra-norm-curve', ticket: 'imp-1292', mathBucket: 'bound', dataModule: null }),
]);
const FOUNDATION_PAPER = 'research-inputs/twin_ladder_consolidated_v52.pdf';
const DENIAL_PHRASES = Object.freeze([
  'no lambda', 'no rh claim', 'not proven', 'does not', 'no operator', 'no upper',
]);
const isRecord = value => value !== null && typeof value === 'object' && !Array.isArray(value);
const hasText = (value, min, max = Infinity) =>
  typeof value === 'string' && value.trim().length >= min && value.length <= max;
const isRoute = value => typeof value === 'string' && /^\/[a-z0-9]+(?:[/-][a-z0-9]+)*$/.test(value);
function isDataModule(value) {
  if (value === null) return true;
  if (typeof value !== 'string') return false;
  // A comparison card can cite several source modules in the rendered string.
  // Validate every component, including later paths, rather than just a prefix.
  const paths = value.split(/,\s*/);
  return new Set(paths).size === paths.length && paths.every(path =>
    /^src\/data\/(?:[a-zA-Z0-9_-]+\/)*[a-zA-Z0-9_-]+\.(?:js|json)$/.test(path));
}
function isTicket(value) {
  if (typeof value !== 'string') return false;
  if (/^imp-\d+$/.test(value)) return true;
  const date = /^user-research-(\d{4}-\d{2}-\d{2})$/.exec(value)?.[1];
  return Boolean(date && Number.isFinite(Date.parse(date)) && new Date(date).toISOString().slice(0, 10) === date);
}

/**
 * Pure assertion factory: the harness uses the live frozen catalog, while the
 * focused regression supplies corrupted copies to prove the same gates reject
 * bad metadata. No assertion is skipped, and no data module is imported here.
 */
export function createVisualizationsIndexAssertions(index = VISUALIZATIONS_INDEX, mathBuckets = VIZ_MATH_BUCKETS) {
  const entries = Array.isArray(index?.entries) ? index.entries : null;
  const checkEntries = predicate => () => Boolean(
    entries && entries.length >= FOUNDATION_ENTRIES.length && Array.from(entries).every(isRecord) && predicate(entries)
  );
  const foundationPresent = predicate => FOUNDATION_ENTRIES.every(required => {
    const entry = entries?.find(candidate => candidate?.route === required.route);
    return entry && predicate(entry, required);
  });
  return [
    {
      id: 'imp1228-record-frozen-and-route-pinned',
      holds: () => Boolean(
        isRecord(index) && Object.isFrozen(index) && entries && Object.isFrozen(entries) &&
        isRecord(index.paperSource) && Object.isFrozen(index.paperSource) &&
        index.ticketId === 'imp-1228' && index.routePath === '/visualizations' &&
        index.title === 'Visualizations' && hasText(index.intro, 100)
      ),
      why: 'The index, entry array and paperSource must be frozen; preserve the landing route, ticket, title and substantive introduction.',
    },
    {
      id: 'imp1228-required-entries-and-metadata',
      holds: checkEntries(items => items.every(entry => {
        const legacy = FOUNDATION_ENTRIES.some(required => required.route === entry.route);
        return Object.isFrozen(entry) && isRoute(entry.route) && hasText(entry.title, 5) &&
          hasText(entry.oneLine, 20, legacy ? 200 : 512) && hasText(entry.mathBucket, 1) &&
          isDataModule(entry.dataModule) && hasText(entry.paperSourcePath, 10) &&
          isTicket(entry.ticket) && Number.isSafeInteger(entry.pedagogicalStep) && entry.pedagogicalStep > 0;
      })),
      why: 'Require at least the original nine frozen cards and valid metadata on every card: local route, title, bounded summary, bucket, JS/JSON data paths or null, source, ticket and positive integer rank. Legacy summaries keep their 200-character ceiling; later catalog summaries are bounded at 512.',
    },
    {
      id: 'imp1228-routes-unique-and-required',
      holds: checkEntries(items => items.every(entry => isRoute(entry.route)) &&
        new Set(items.map(entry => entry.route)).size === items.length && foundationPresent(() => true)),
      why: 'Every route must be a unique local path, and all nine original routes must remain present. Valid catalog additions are allowed.',
    },
    {
      id: 'imp1228-foundation-steps-pinned',
      holds: checkEntries(items => FOUNDATION_ENTRIES.every((required, i) =>
        items[i].route === required.route && items[i].pedagogicalStep === i + 1) &&
        items.every(entry => Number.isSafeInteger(entry.pedagogicalStep) && entry.pedagogicalStep > 0)),
      why: 'Keep the original pedagogical sequence at steps 1..9. Later entries carry positive integer ranks; their existing ranks need not equal their array positions.',
    },
    {
      id: 'imp1228-math-bucket-is-from-closed-set',
      holds: checkEntries(items => {
        if (!Array.isArray(mathBuckets) || !Object.isFrozen(mathBuckets) ||
          !Array.from(mathBuckets).every(bucket => typeof bucket === 'string' && /^[a-z]+(?:-[a-z]+)*$/.test(bucket))) return false;
        const buckets = new Set(mathBuckets);
        return buckets.size === mathBuckets.length &&
          items.every(entry => buckets.has(entry.mathBucket)) &&
          foundationPresent((entry, required) => entry.mathBucket === required.mathBucket);
      }),
      why: 'Every bucket must belong to the frozen, duplicate-free declared set, including the existing measurement family. Preserve the original nine route/bucket pairings; multiple cards may share a category.',
    },
    {
      id: 'imp1228-every-ticket-present',
      holds: checkEntries(items => items.every(entry => isTicket(entry.ticket)) &&
        foundationPresent((entry, required) => entry.ticket === required.ticket &&
          items.filter(candidate => candidate.ticket === required.ticket).length === 1)),
      why: 'Preserve every original route/ticket pairing exactly once. Later provenance must be an imp-N ticket or a valid dated user-research identifier; one later research ticket may legitimately supply several views.',
    },
    {
      id: 'imp1228-data-modules-pin-to-viz-files',
      holds: checkEntries(items => items.every(entry => isDataModule(entry.dataModule)) &&
        foundationPresent((entry, required) => required.dataModule === null || entry.dataModule === required.dataModule)),
      why: 'Keep each of the six original data files pinned to its original route. Other cards may cite one or several safe src/data JS/JSON paths, or null for computed data; validate every cited path, and allow related views to share a source.',
    },
    {
      id: 'imp1228-paper-source-and-intro-pin-v52',
      holds: checkEntries(items => index.paperSource?.path === FOUNDATION_PAPER &&
        hasText(index.paperSource?.note, 40) && items.every(entry => hasText(entry.paperSourcePath, 10)) &&
        foundationPresent(entry => entry.paperSourcePath === FOUNDATION_PAPER ||
          entry.paperSourcePath.startsWith(FOUNDATION_PAPER + ' '))),
      why: 'Preserve the canonical v52 source and substantive note for the original suite. Every later card must cite its actual substantive source rather than falsely attributing new data or user research to v52.',
    },
    {
      id: 'imp2728-every-entry-has-honest-ceiling',
      holds: checkEntries(items => items.every(entry => hasText(entry.honestCeiling, 20))),
      why: 'Every card must retain a substantive honestCeiling so a descriptive view cannot silently be presented as an RH or operator-positivity result.',
    },
    {
      id: 'imp2992-every-ceiling-has-denial-marker',
      holds: checkEntries(items => items.every(entry => typeof entry.honestCeiling === 'string' &&
        DENIAL_PHRASES.some(phrase => entry.honestCeiling.toLowerCase().includes(phrase)))),
      why: 'Retain the original explicit denial-marker gate: no lambda, no rh claim, not proven, does not, no operator, or no upper. Positive claims alone are insufficient.',
    },
  ];
}

export const VISUALIZATIONS_INDEX_ASSERTIONS = createVisualizationsIndexAssertions();
