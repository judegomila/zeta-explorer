/**
 * @module visualizations-index
 * @fileoverview Master index of every WAVE 13 visualization page.
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
]);

/**
 * Master visualization index. Frozen, immutable at module load.
 *
 * Entry semantics:
 *  - `route`           string  page route (must match an App.jsx <Route>)
 *  - `title`           string  page-level <h1> the card surfaces
 *  - `oneLine`         string  ≤ 160 char one-liner shown on the card
 *  - `mathBucket`      string  one of VIZ_MATH_BUCKETS (drives badge color)
 *  - `dataModule`      string  src-relative path to companion data module
 *  - `paperSourcePath` string  pointer to source paper / section
 *  - `ticket`          string  originating ticket (imp-1222..imp-1227)
 *  - `pedagogicalStep` number  1..6, ordering of the cards on the page
 *
 * @type {Readonly<object>}
 */
export const VISUALIZATIONS_INDEX = Object.freeze({
  ticketId: 'imp-1228',
  routePath: '/visualizations',
  title: 'Visualizations',
  intro:
    'Geometric perspectives on the Riemann zeta-function and its prime ' +
    'structure. The curated sequence walks from a single-curve log-phase ' +
    'spiral through 2D interferometric (twin-ladder), flow-field, and ' +
    'caustic representations to discrete-prime pictures (hyperbolic spiral ' +
    'and Bragg-style crystal), alongside the program’s deep-tail diagnostic ' +
    'visualizations. Together they visualize the twin-ladder framing.',

  paperSource: Object.freeze({
    path: 'research-inputs/twin_ladder_consolidated_v52.pdf',
    note:
      'Twin-Ladder Consolidated v52 — the canonical paper source. The ' +
      'curated visualizations together cover the geometric content of ' +
      '§§15-18 (shift-bridge, closure routes, ghosts, approaches) plus the ' +
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
        'research-inputs/twin_ladder_consolidated_v52.pdf §18 (three approaches)',
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
        'research-inputs/twin_ladder_consolidated_v52.pdf §18 (three approaches: arithmetic rigidity)',
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
        'research-inputs/twin_ladder_consolidated_v52.pdf §18 (three approaches: caustic resonance)',
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
        'research-inputs/twin_ladder_consolidated_v52.pdf §18 (three approaches: phase geometry)',
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
        'research-inputs/twin_ladder_consolidated_v52.pdf §18 (three approaches: phase geometry)',
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
        'Descriptive sensitivity sweep; C_mb remains GUE-conditional, changes no bound, no RH verdict.',
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
        'Descriptive chart re-exporting the imp-35811 BigInt digit-ladder measurement verbatim (no new derivation, no heavy data-module import, no ~520-digit recomputation at page load); measures ONLY the exp(-pi x/8) underflow-driven mantissa-digit requirement off the imp-35781-measured accumulator scale K; evaluates no true H_0 at high precision, extends no evaluator, certifies no value at any height, changes no bound.',
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
        'Descriptive chart re-exporting the imp-35812 exact-BigInt-referenced summation-scheme measurement verbatim (no new derivation, no heavy data-module import, no re-running the summation schemes at page load); measurement only; certifies no W1 bound; evaluates no true H_0; instantiates no interval; verifies no inequality; establishes no positivity; the W1 A+B-C certificate at T_PT stays GREENFIELD (imp-35681 Part A).',
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
        'Descriptive chart re-exporting the imp-35854 exact-BigInt-referenced kappa-sweep measurement verbatim (no new derivation, no heavy data-module import, no re-running the summation schemes at page load); measurement only; certifies no W1 bound; evaluates no true H_0; instantiates no interval; verifies no inequality; establishes no positivity; the W1 A+B-C certificate at T_PT stays GREENFIELD (imp-35681 Part A).',
    }),
    Object.freeze({
      route: '/viz-imp35935-adversarial-ordering',
      title: 'Summation-Scheme Error Under Worst-case Orderings',
      oneLine:
        'Grouped log-scale bar chart of the imp-35852 exact-BigInt-referenced naive/pairwise/Kahan-Babuska normalized error under five hostile term orderings (original/signedAsc/magAsc/magDesc/clustered), showing the worst ordering climbs but never reaches the coherent N*eps ceiling.',
      mathBucket: 'measurement',
      dataModule: 'src/data/imp-35935-adversarial-ordering-viz-data.js',
      paperSourcePath: 'src/data/imp-35852-w1-summation-adversarial-ordering.js (imp-35935 viz page)',
      ticket: 'imp-35935',
      pedagogicalStep: 107,
      honestCeiling:
        'Descriptive chart re-exporting the imp-35852 exact-BigInt-referenced adversarial-ordering measurement verbatim (no new derivation, no heavy data-module import, no re-running the summation schemes at page load); measurement only; certifies no W1 bound; evaluates no true H_0; instantiates no interval; verifies no inequality; establishes no positivity; the W1 A+B-C certificate at T_PT stays GREENFIELD (imp-35681 Part A).',
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
      route: '/viz-imp95240-o5-site-coverage-margins',
      title: 'O5 Site-Coverage Margins: x_*(0.1808) in W_690988',
      oneLine:
        'Proportional bracket chart of the imp-95212 O5 site-coverage certification, placing x_*(0.1808) between zeros x_690988 and x_690989 with its certified leftMargin (~5.377e6) and rightMargin (~1.199e7), both strictly positive.',
      mathBucket: 'measurement',
      dataModule: 'src/data/imp-95212-ythaw-o5-o3.js',
      paperSourcePath:
        'src/data/imp-95212-ythaw-o5-o3.js (O5_SITE_COVERAGE three-lane certified margins; imp-95240 viz page)',
      ticket: 'imp-95240',
      pedagogicalStep: 124,
      honestCeiling:
        'Descriptive bracket chart baking the imp-95212 O5_SITE_COVERAGE leftMargin/rightMargin literals verbatim (no new computation, proportional not true-scale layout); closes obligation O5 of the six-obligation y-thaw package only; O1/O2/O4/O6 remain OPEN and 0.17759432 stays a package value, not a proven bound; changes no bound, establishes no operator positivity, no RH claim; Platt-Trudgian Lambda <= 0.2 remains SOTA; NO QED.',
    }),
    Object.freeze({
      route: '/viz-imp95265-evoct-firing-curve',
      title: 'EV-OCT Certificate Firing Curve, m = 6 Dyadic Skeleton',
      oneLine:
        'Log-scale curve of the imp-95250 COROLLARY EV-OCT closed-form certCoalM(6, x) certificate across depth x, showing the every-octave-twin firing threshold crossing at xStarEvOct = 11.31664319.',
      mathBucket: 'measurement',
      dataModule: 'src/data/imp-95265-evoct-firing-curve-viz-data.js',
      paperSourcePath:
        'src/data/imp-95250-leaveoneout-multiblock-split-certificate.js (COROLLARY EV-OCT closed-form certificate; imp-95265 viz page)',
      ticket: 'imp-95265',
      pedagogicalStep: 125,
      honestCeiling:
        'Descriptive curve chart recomputing the imp-95250 certCoalM(6, x) closed form independently from its documented coalLaw/betaLat pieces (no new derivation, no heavy import); the certificate is a model-family bound sitting orders above the exact pencil (imp-95250 HONEST LIMITS); changes no bound, establishes no operator positivity, no RH claim; Platt-Trudgian Lambda <= 0.2 remains SOTA; NO QED.',
    }),
    Object.freeze({
      route: '/viz-imp95266-theta-vs-k-phase-collapse',
      title: 'Phase Collapse vs Modulus Blow-Up, K = 1..8',
      oneLine:
        'Two log10 panels against packet count K on the imp-95224 SGN-SAT witness family: the imp-95233 phase-alignment ratio theta_K collapsing below the PHASE-CERT vacuity threshold e^(-y_min), and the amplitude modulus (L1 = 2^K, L2 mass = C(2K,K)) diverging.',
      mathBucket: 'measurement',
      dataModule: 'src/data/imp-95266-theta-vs-k-viz-data.js',
      paperSourcePath:
        'src/data/imp-95233-modulus-phase-currency-feasibility.js (theta(phi_K), L1/L2 modulus identities, PHASE-CERT); src/data/imp-95224-signed-depth-currency-nogo.js (THEOREM SGN-SAT witness family; imp-95266 viz page)',
      ticket: 'imp-95266',
      pedagogicalStep: 126,
      honestCeiling:
        'Descriptive two-panel chart recomputing theta_K (exact BigInt rational integration) and the L1/L2 modulus (exact binomial identities) independently from the imp-95233 documented closed forms (no new derivation, no heavy import); illustrates the escape mechanism numerically, proves nothing beyond what imp-95233 already states; changes no bound, establishes no operator positivity, no RH claim; Platt-Trudgian Lambda <= 0.2 remains SOTA; NO QED.',
    }),
    Object.freeze({
      route: '/viz-imp95267-offlattice-robustness',
      title: 'Off-Lattice Robustness of the Raw Blaschke-Lagrange Bound',
      oneLine:
        'Log-scale mean/worst BL^2/Lambda ratio curves against dyadic-site jitter eps (imp-95232 FINDING 2), showing the raw Blaschke-Lagrange bound degrades gracefully (worst 1.58x at eps=0.2, 9.4x at eps=0.3) while a fixed eps=0.2 witness stays near on-lattice (1.008x).',
      mathBucket: 'measurement',
      dataModule: 'src/data/imp-95267-offlattice-robustness-viz-data.js',
      paperSourcePath:
        'src/data/imp-95232-bl-lat-off-lattice-degradation.js (FINDING 2 offLatticeTable / offLatticeWitness; imp-95267 viz page)',
      ticket: 'imp-95267',
      pedagogicalStep: 127,
      honestCeiling:
        'Descriptive curve chart baking the imp-95232 FINDING 2 offLatticeTable / offLatticeWitness literals verbatim (no new computation, no heavy import); the off-lattice degradation measured here is a RAW-BL property, distinct from the count-uniform BL-LAT collar (imp-95232 FINDING 1, ~70x looser); changes no bound, establishes no operator positivity, no RH claim; Platt-Trudgian Lambda <= 0.2 remains SOTA; NO QED.',
    }),
    Object.freeze({
      route: '/viz-imp95268-collar-overprice',
      title: 'BL-LAT Collar Over-Pricing at Finite N',
      oneLine:
        'Log-scale bar chart of the imp-95232 FINDING 1 collar-overpricing factor (collar / Lambda, ~69-79x across depth x=4..8) on the dyadic lattice, against the near-sharp raw Blaschke-Lagrange ratio (~1.03x) shown as a dashed reference line.',
      mathBucket: 'measurement',
      dataModule: 'src/data/imp-95268-collar-overprice-viz-data.js',
      paperSourcePath:
        'src/data/imp-95232-bl-lat-off-lattice-degradation.js (FINDING 1 onLatticeBaseline / collarOverpriceVsX; imp-95268 viz page)',
      ticket: 'imp-95268',
      pedagogicalStep: 133,
      honestCeiling:
        'Descriptive log-scale bar chart baking the imp-95232 FINDING 1 onLatticeBaseline / collarOverpriceVsX literals verbatim (no new computation, no heavy import); the count-uniform BL-LAT collar over-pricing measured here is a finite-N artifact of the collar being an infinite two-sided Blaschke product, distinct from the near-sharp raw BL bound (imp-95232 FINDING 2); changes no bound, establishes no operator positivity, no RH claim; Platt-Trudgian Lambda <= 0.2 remains SOTA; NO QED.',
    }),
    Object.freeze({
      route: '/viz-twistor-dual-intertwiner',
      title: 'Twistor Space, its Dual, and the Intertwiner',
      oneLine:
        'Interactive 3D Robinson congruence (Hopf fibers on nested tori) beside its opposite-helicity dual, with incidence strands pairing s with 1-s and Riemann-Siegel Z(t) painted onto the fibers: zeta zeros appear as color-family flips and fiber neck-downs; a sigma slider breaks the left-right symmetry except through the intertwiner.',
      mathBucket: 'flow-field',
      dataModule: null,
      paperSourcePath:
        'src/pages/TwistorPage.jsx + src/math/twistor.js (twistor / dual-twistor correspondence; intertwiner I_K F+ = F- ∘ R is the paper’s O-status design requirement)',
      ticket: 'imp-95012',
      pedagogicalStep: 123,
      honestCeiling:
        'Faithful rendering of the Robinson congruence (true Hopf-fiber stereographic projection) with live Riemann-Siegel Z(t) / Borwein zeta values painted on; the twistor layer is the paper’s auxiliary O-status geometry and the intertwiner identity I_K F+ = F- ∘ R is a design requirement, not a known theorem; the picture proves nothing about zeta — no Lambda bound, no RH claim.',
    }),
    Object.freeze({
      route: '/viz-imp95125-attainment-shortfall-decay',
      title: 'Finite-Rate Attainment Shortfall Decay at the Dominant Cell',
      oneLine:
        'Two log-log panels on the imp-95090 dominant-cell (0,2) shortfall: decay vs the continuous corner offset eps (linear, per-decade ~0.10) and vs the alias-grid rate p (roughly O(1/p), 0.1742 at p=97 down to 0.0240 at p=769).',
      mathBucket: 'measurement',
      dataModule: 'src/data/imp-95090-finite-rate-attainment-shortfall.js',
      paperSourcePath:
        'src/data/imp-95090-finite-rate-attainment-shortfall.js (continuousLimitLadder / gridRefinementLadder; imp-95125 viz page)',
      ticket: 'imp-95125',
      pedagogicalStep: 128,
      honestCeiling:
        'Descriptive two-panel chart baking the imp-95090 continuousLimitLadder / gridRefinementLadder literals verbatim (no new computation, no heavy import); the shortfall names a conservative, unapplied fixed-97 grid-corner ceiling lever, not an applied bound change; changes no bound, establishes no operator positivity, no RH claim; Platt-Trudgian Lambda <= 0.2 remains SOTA; NO QED.',
    }),
    Object.freeze({
      route: '/viz-imp95141-ythaw-obligation-meter',
      title: 'y-thaw Obligation Progress Meter, O1-O6 at Floor y = 0.1808',
      oneLine:
        'Compact status grid and progress bar over the imp-95140 y-thaw-01775943 six-obligation ledger: O3 (E_max budget) and O5 (site coverage) CLOSED, O1 (sharp-mass y-monotonicity), O2 (barrier/winding slab), O4 (analytic tail), and O6 (criterion assembly) OPEN, with 0.17759432 labeled a package value, not a bound.',
      mathBucket: 'measurement',
      dataModule: 'src/data/imp-95140-ythaw-obligation-ledger.js',
      paperSourcePath:
        'src/data/imp-95140-ythaw-obligation-ledger.js (YTHAW_OBLIGATION_LEDGER / YTHAW_OBLIGATION_SUMMARY; imp-95141 viz page)',
      ticket: 'imp-95141',
      pedagogicalStep: 129,
      honestCeiling:
        'Descriptive status-grid chart baking the imp-95140 YTHAW_OBLIGATION_LEDGER / YTHAW_OBLIGATION_SUMMARY literals verbatim (no new computation); closes no obligation of the six-obligation y-thaw package; O1/O2/O4/O6 remain OPEN and 0.17759432 stays a package value, not a proven bound; changes no bound, establishes no operator positivity, no RH claim; Platt-Trudgian Lambda <= 0.2 remains SOTA; NO QED.',
    }),
    Object.freeze({
      route: '/viz-imp95143-vacuity-saturation-corridor',
      title: 'SGN-C Vacuity vs. SGN-SAT Saturation Corridor',
      oneLine:
        'Plots the imp-95225 SGN-C count-vacuity frontier N = 1 + 1.4427x against the imp-95224 SGN-SAT saturation frontier N ~ 11.6893x over x = m*d, shading the factor-8.1 open corridor between them where sup R is unknown on both sides, and marking the N = 1 SGN-EQ sharp anchor point.',
      mathBucket: 'measurement',
      dataModule: 'src/data/imp-95225-signed-count-priced-shift-certificate.js',
      paperSourcePath:
        'src/data/imp-95225-signed-count-priced-shift-certificate.js (constants.vacuitySlope / constants.satSlope; imp-95143 viz page)',
      ticket: 'imp-95143',
      pedagogicalStep: 130,
      honestCeiling:
        'Descriptive two-frontier chart baking the imp-95225 constants.vacuitySlope / constants.satSlope literals verbatim (no new computation, no bound claim); the corridor between the two frontiers is recorded as OPEN on both sides, not resolved; the width-law paper packets are not certified by SGN-C; changes no bound, establishes no operator positivity, no RH claim; Platt-Trudgian Lambda <= 0.2 remains SOTA; NO QED.',
    }),
    Object.freeze({
      route: '/viz-imp95144-tier-certifier-ballop-budget-gap',
      title: 'Tier-Certifier Ball-Op Budget Gap: Measured 1.0e15 vs 1.1e13 Design',
      oneLine:
        'Log-scale bar chart of the W1-CERT full-window ball-op count across the two built certifier levels: level-1 single-level Taylor (imp-95213, 1.0086e15), level-2 frequency-bin chirp (imp-95214, 1.5456e14, a 6.53x cut), and the 1.1e13 two-level design budget, showing the residual 14.05x gap is now cell/reconstruction-dominated.',
      mathBucket: 'measurement',
      dataModule: 'src/data/imp-95214-tier2-chirp-level.js',
      paperSourcePath:
        'src/data/imp-95214-tier2-chirp-level.js (TIER2_PRICE.baselines / TIER2_PRICE.fullWindow; imp-95144 viz page)',
      ticket: 'imp-95144',
      pedagogicalStep: 131,
      honestCeiling:
        'Descriptive log-scale bar chart baking the imp-95213 / imp-95214 TIER_PRICE and TIER2_PRICE literals verbatim (no new computation); the full-window run was NOT launched at either level, both prices are sub-range extrapolations; changes no bound, establishes no operator positivity, no RH claim; Platt-Trudgian Lambda <= 0.2 remains SOTA; NO QED.',
    }),
    Object.freeze({
      route: '/viz-imp95242-tier-certifier-baseline-vs-design-gap',
      title: 'Tier-Certifier: Below Baseline, Above Design Budget',
      oneLine:
        'Two small log-scale bar panels contrasting the imp-95213 single-level Taylor realization against its direct-baseline CPU-days (433.6x below the 1.64e5 CPU-day dry run) and against the two-level design ball-op budget (91.7x above the 1.1e13 target), making the 434x-below / 92x-above framing legible.',
      mathBucket: 'measurement',
      dataModule: 'src/data/imp-95213-tier-certifier-build.js',
      paperSourcePath:
        'src/data/imp-95213-tier-certifier-build.js (TIER_PRICE.baselines / TIER_PRICE.fullWindow; imp-95242 viz page)',
      ticket: 'imp-95242',
      pedagogicalStep: 132,
      honestCeiling:
        'Descriptive log-scale bar panels baking the imp-95213 TIER_PRICE literals verbatim (no new computation); the full-window run was NOT launched; the second (design-budget-matching) level is the identified residual lever, not built here; changes no bound, establishes no operator positivity, no RH claim; Platt-Trudgian Lambda <= 0.2 remains SOTA; NO QED.',
    }),
    Object.freeze({
      route: '/viz-imp95278-window1-coverage-bar',
      title: 'Window-1 Coverage: 800 of 1,381,977 q-units Certified',
      oneLine:
        'Two coverage bars: the imp-95213 certified slice (800 of 1,381,977 q-units, 0.058% of window 1, both seam charts) nested inside the far larger scope gap (window 1 is 1 of 54,109,012 Gate-2 windows, 54,109,011 left untouched).',
      mathBucket: 'measurement',
      dataModule: 'src/data/imp-95213-tier-certifier-build.js',
      paperSourcePath:
        'src/data/imp-95213-tier-certifier-build.js (CERTIFIED_SLICE / WINDOW_WIDTH_U) + src/data/imp-95238-fullwindow-run-decision.js (windowsBeyondWindow1Untouched); imp-95278 viz page',
      ticket: 'imp-95278',
      pedagogicalStep: 134,
      honestCeiling:
        'Descriptive coverage-bar chart baking the imp-95213 CERTIFIED_SLICE / WINDOW_WIDTH_U literals and the imp-95238 windowsBeyondWindow1Untouched literal verbatim (no new computation); the certified slice sets no G5 window-promotion flag; changes no bound, establishes no operator positivity, no RH claim; Platt-Trudgian Lambda <= 0.2 remains SOTA; NO QED.',
    }),
    Object.freeze({
      route: '/viz-imp95279-phasecert-vs-nogo-ceiling',
      title: 'PHASE-CERT Bound vs DC-NOGO Ceiling and Vacuity Threshold',
      oneLine:
        'Log-log curve of the imp-95233 COROLLARY PHASE-CERT bound R <= e^(-y_min)/(2 theta) against phase-alignment ratio theta, marking the imp-95224 DC-NOGO 1/2 ceiling and the theta_0 = e^(-y_min) vacuity threshold where the curve crosses it, with the two imp-95233 exact witness points (signed and positive-cone) plotted on the curve.',
      mathBucket: 'measurement',
      dataModule: 'src/data/imp-95279-phasecert-vs-nogo-ceiling-viz-data.js',
      paperSourcePath:
        'src/data/imp-95233-modulus-phase-currency-feasibility.js (COROLLARY PHASE-CERT closed form, exact witness/poscone literals); src/data/imp-95224-signed-depth-currency-nogo.js (COROLLARY DC-NOGO symmetry ceiling; imp-95279 viz page)',
      ticket: 'imp-95279',
      pedagogicalStep: 135,
      honestCeiling:
        'Descriptive log-log curve recomputing bound(theta) = e^(-y_min)/(2 theta) independently from the imp-95233 documented closed form and exact witness literals (no new derivation, no heavy import); illustrates the escape mechanism numerically, proves nothing beyond what imp-95233 already states; changes no bound, establishes no operator positivity, no RH claim; Platt-Trudgian Lambda <= 0.2 remains SOTA; NO QED.',
    }),
    Object.freeze({
      route: '/viz-imp95282-coallaw-vs-lambda2',
      title: 'Confluent-Span Domination: coalLaw(x) vs Lambda_2(x, r)',
      oneLine:
        'Curve of the imp-95231 / imp-95227 confluent-span value coalLaw(x) = e^(-2x)(1+2x^2+2x sqrt(1+x^2)) against the exact signed N = 2 constant Lambda_2(x, r) at rate ratios r = 1.01, 1.1, 1.5, 2.0, showing coalLaw(x) dominates every curve and the gap widens as r leaves coalescence (r = 1).',
      mathBucket: 'measurement',
      dataModule: 'src/data/imp-95282-coallaw-vs-lambda2-viz-data.js',
      paperSourcePath:
        'src/data/imp-95231-coalescence-ratio-monotonicity.js (lam2, coalLaw, THEOREM COAL-DESC); src/data/imp-95227-two-rate-coalescence-dominance-theorem.js (capC dominance theorem; imp-95282 viz page)',
      ticket: 'imp-95282',
      pedagogicalStep: 136,
      honestCeiling:
        'Descriptive curve recomputing coalLaw(x) and Lambda_2(x, r) independently from the imp-95231 / imp-95227 documented closed forms (no new derivation, no heavy import); illustrates the r -> 1 dominance numerically, proves nothing beyond what imp-95231 / imp-95227 already state; changes no bound, establishes no operator positivity, no RH claim; Platt-Trudgian Lambda <= 0.2 remains SOTA; NO QED.',
    }),
    Object.freeze({
      route: '/viz-imp95303-conflb-vs-coaln-window-pinch',
      title: 'Confluent Floor sqrt(T(N,x)) vs COAL-N Ceiling coalN(N,1.3,x) at N = 3, 4, 5',
      oneLine:
        'Log10-scale curves of the imp-95286 THEOREM CONF-LB confluent floor sqrt(T(N,x)) against the imp-95251 THEOREM COAL-N ceiling coalN(N,1.3,x) for N = 3, 4, 5, marking the coalN = 1 firing onsets where the imp-95286 overpricing cap rho -> R^(N-1) is read off as the vertical gap.',
      mathBucket: 'measurement',
      dataModule: 'src/data/imp-95303-conf-lb-vs-coaln-window-pinch-viz-data.js',
      paperSourcePath:
        'src/data/imp-95286-confluent-laguerre-floor.js (THEOREM CONF-LB floor, COROLLARY WINDOW-PINCH bracket); src/data/imp-95251-nfold-coalescence-law.js (THEOREM COAL-N ceiling; imp-95303 viz page)',
      ticket: 'imp-95303',
      pedagogicalStep: 137,
      honestCeiling:
        'Descriptive curves recomputing sqrt(T(N,x)) and coalN(N,1.3,x) independently from the imp-95286 / imp-95251 documented closed forms (no new derivation, no heavy import); illustrates the WINDOW-PINCH bracket numerically, proves nothing beyond what imp-95286 / imp-95251 already state; changes no bound, establishes no operator positivity, no RH claim; Platt-Trudgian Lambda <= 0.2 remains SOTA; NO QED.',
    }),
    Object.freeze({
      route: '/viz-imp95304-phaseam-vs-phasecert-ceilx',
      title: 'PHASE-AM Bound vs PHASE-CERT Bound and the CEIL-X Exceedance Point',
      oneLine:
        'Log-log curves of the imp-95254 THEOREM PHASE-AM bound R <= (e^(-y_min)/4)(1+1/theta) against the imp-95233 COROLLARY PHASE-CERT bound R <= e^(-y_min)/(2 theta) at y_min = 1/4, marking the DC-NOGO 1/2 ceiling, both vacuity thresholds, and the imp-95254 PROP CEIL-X witness where the actual R = 0.6962 exceeds 1/2 while both certificates still majorize it.',
      mathBucket: 'measurement',
      dataModule: 'src/data/imp-95304-phaseam-vs-phasecert-ceilx-viz-data.js',
      paperSourcePath:
        'src/data/imp-95254-orthant-split-phase-certificate.js (THEOREM PHASE-AM closed form, PROP CEIL-X exact witness); src/data/imp-95233-modulus-phase-currency-feasibility.js (COROLLARY PHASE-CERT closed form); src/data/imp-95224-signed-depth-currency-nogo.js (COROLLARY DC-NOGO ceiling; imp-95304 viz page)',
      ticket: 'imp-95304',
      pedagogicalStep: 138,
      honestCeiling:
        'Descriptive log-log curves recomputing both bounds independently from the imp-95254 / imp-95233 documented closed forms and exact witness literals (no new derivation, no heavy import); illustrates the strict PHASE-AM dominance and the CEIL-X exceedance numerically, proves nothing beyond what imp-95254 / imp-95233 already state; changes no bound, establishes no operator positivity, no RH claim; Platt-Trudgian Lambda <= 0.2 remains SOTA; NO QED.',
    }),
    Object.freeze({
      route: '/viz-imp95305-splitrz-vs-evoctunif-onset',
      title: 'SPLIT-RZ vs EV-OCT-UNIF Every-Octave Certificate Onset Drop (27.04 -> 15.98)',
      oneLine:
        'Log10-scale curves of the imp-95252 COROLLARY SPLIT-RZ every-octave-twin certificate against the imp-95250 COROLLARY EV-OCT-UNIF certificate, both at unbounded octave count, marking the firing-onset drop from xStarUnif = 27.035582 to xStarRz = 15.981584 at window ratio r = 1.3.',
      mathBucket: 'measurement',
      dataModule: 'src/data/imp-95305-splitrz-vs-evoctunif-onset-viz-data.js',
      paperSourcePath:
        'src/data/imp-95252-muniform-block-riesz-seam-pencil.js (COROLLARY SPLIT-RZ closed form, A_blk); src/data/imp-95250-leaveoneout-multiblock-split-certificate.js (COROLLARY EV-OCT-UNIF closed form, PhiUnif; imp-95305 viz page)',
      ticket: 'imp-95305',
      pedagogicalStep: 139,
      honestCeiling:
        'Descriptive curves recomputing certSplitRz and certUnif independently from the imp-95252 / imp-95250 documented closed forms (no new derivation, no heavy import); illustrates the m-uniform onset drop numerically, proves nothing beyond what imp-95252 / imp-95250 already state; changes no bound, establishes no operator positivity, no RH claim; Platt-Trudgian Lambda <= 0.2 remains SOTA; NO QED.',
    }),
    Object.freeze({
      route: '/viz-imp95623-seam-gram-onset-ladder',
      title: 'Five-Rung Seam-Gram Every-Octave Onset Ladder (SPLIT-RZ 15.98 -> XSTAR_UNIF 27.04)',
      oneLine:
        'Bar chart of the imp-95609 five-rung seam-Gram every-octave onset ladder (SPLIT-RZ < SPLIT-OPT < SPLIT-SEP < SPLIT-LOO = XSTAR_UNIF), with the imp-95419 SEP-OPT supersession and the BLOCK-vs-scalar residual-gap attribution.',
      mathBucket: 'measurement',
      dataModule: 'src/data/imp-95609-seam-gram-onset-ladder-table.js',
      paperSourcePath:
        'src/data/imp-95609-seam-gram-onset-ladder-table.js (five-rung table + attribution; consolidates imp-95457, imp-95335, imp-95419, imp-95475; imp-95623 viz page)',
      ticket: 'imp-95623',
      pedagogicalStep: 140,
      honestCeiling:
        'Descriptive bar chart consuming the imp-95609 reader-facing table verbatim (no new derivation, no heavy import); illustrates the five named / four distinct onset values and the SEP-OPT supersession numerically, proves nothing beyond what imp-95609 already states; changes no bound, establishes no operator positivity, no RH claim; Platt-Trudgian Lambda <= 0.2 remains SOTA; NO QED.',
    }),
    Object.freeze({
      route: '/viz-imp95317-confluent-bracket-across-r',
      title: 'Confluent Bracket Across Window Ratio R at Fixed N = 3',
      oneLine:
        'Log10-scale curves of the imp-95286 THEOREM CONF-LB confluent floor sqrt(T(3,x)) against the imp-95251 THEOREM COAL-N ceiling coalN(3,R,x) at fixed N = 3 for window ratios R = 1, 1.3, 2, 3, showing the firing onset shift and the widening WINDOW-PINCH gap as R grows -- the window-ratio axis that imp-95303 (fixed R, varying N) did not cover.',
      mathBucket: 'measurement',
      dataModule: 'src/data/imp-95317-confluent-bracket-across-r-viz-data.js',
      paperSourcePath:
        'src/data/imp-95286-confluent-laguerre-floor.js (THEOREM CONF-LB floor, COROLLARY WINDOW-PINCH bracket rho(N,R,x) -> R^(N-1)); src/data/imp-95251-nfold-coalescence-law.js (THEOREM COAL-N ceiling; imp-95317 viz page)',
      ticket: 'imp-95317',
      pedagogicalStep: 140,
      honestCeiling:
        'Descriptive curves recomputing sqrt(T(3,x)) and coalN(3,R,x) independently from the imp-95286 / imp-95251 documented closed forms (no new derivation, no heavy import); illustrates the WINDOW-PINCH bracket across the R axis numerically, proves nothing beyond what imp-95286 / imp-95251 already state; changes no bound, establishes no operator positivity, no RH claim; Platt-Trudgian Lambda <= 0.2 remains SOTA; NO QED.',
    }),
    Object.freeze({
      route: '/viz-imp95319-splitrz-vs-splitloo-collar',
      title: 'SPLIT-RZ Flat Constant vs the SPLIT-LOO Linear-in-m Collar',
      oneLine:
        'Log10-scale curve of the imp-95250 LEMMA LOO naive per-block reciprocal-sum constant A_LOO(m) (via the imp-95249 LEMMA ANG-DET fence) against the imp-95252 flat, m-independent block-Riesz constant A_blk at window ratio r = 1.3, showing the crossover at m = 5 and the asymptotically linear-in-m collar (A_LOO(m)*m converging to a positive limit) that motivated the m-uniform SPLIT-RZ result.',
      mathBucket: 'measurement',
      dataModule: 'src/data/imp-95319-splitrz-vs-splitloo-collar-viz-data.js',
      paperSourcePath:
        'src/data/imp-95250-leaveoneout-multiblock-split-certificate.js (LEMMA LOO, HONEST LIMITS (d)); src/data/imp-95252-muniform-block-riesz-seam-pencil.js (COROLLARY RZ-BLOCK flat constant A_blk; imp-95319 viz page)',
      ticket: 'imp-95319',
      pedagogicalStep: 141,
      honestCeiling:
        'Descriptive curve evaluating A_LOO(m) directly from the imp-95249 LEMMA ANG-DET fence definition (no new derivation, no heavy import) against the already-baked imp-95252 A_blk constant; the observed 1/m asymptotic decay is a numeric illustration, proves nothing beyond what imp-95250 / imp-95252 already state; changes no bound, establishes no operator positivity, no RH claim; Platt-Trudgian Lambda <= 0.2 remains SOTA; NO QED.',
    }),
    Object.freeze({
      route: '/viz-imp95349-rzpen-gain-ladder',
      title: 'RZ-PEN Symbol-Pencil Floor Gain Ladder at rho = e^6',
      oneLine:
        'Bar chart of the per-leg floor gain factor A_pen_k/A_pen_{k-1} at rho = e^6 across the imp-95329/95330/95331/95332 RZ-PEN3..RZ-PEN6 chain legs, plus a line chart of the cumulative floor gain relative to RZ-PEN2 (12.877x by RZ-PEN6) and the residual looseness against the exact symbol-pencil infimum, dropping 9.318x -> 6.085x -> 5.060x over the last three legs. Companion page: /viz-imp95366-rzpen-onset-drop-ladder plots the every-octave onset x* for the same RZ-PEN2..RZ-PEN6 chain legs -- the two pages are complementary axes (floor gain vs onset drop) of one chain.',
      mathBucket: 'measurement',
      dataModule: 'src/data/imp-95349-rz-pen-gain-ladder-viz-data.js',
      paperSourcePath:
        'src/data/imp-95329-beta-trace-capped-pencil-floor.js (THEOREM RZ-PEN3 gainRhoE6); src/data/imp-95330-chart-refined-pencil-floor.js (THEOREM RZ-PEN4 gainRhoE6); src/data/imp-95331-split-weight-exact-root-pencil-floor.js (THEOREM RZ-PEN5 gainRhoE6R2, loosenessRhoE6R2); src/data/imp-95332-chart-tail-pencil-floor.js (THEOREM RZ-PEN6 gainRhoE6R2, loosenessRhoE6R2; imp-95349 viz page)',
      ticket: 'imp-95349',
      pedagogicalStep: 142,
      honestCeiling:
        'Presentation only: every plotted value is copied verbatim from the imp-95329 / imp-95330 / imp-95331 / imp-95332 records (no re-derivation, no re-execution of the underlying 256-chart / pair-identity numerics beyond what those modules already compute at import); the cumulative gain is a plain product of already-baked per-leg gains; proves nothing beyond what those four modules already state; changes no bound, establishes no operator positivity, no RH claim; Platt-Trudgian Lambda <= 0.2 remains SOTA; NO QED.',
    }),
    Object.freeze({
      route: '/viz-imp95350-chart-tail-cap-vs-uniform-c3n',
      title: 'Per-Chart Tail Cap vs Theta-Uniform c3n at rho = e^6',
      oneLine:
        'Line chart of the imp-95332 LEMMA TAIL-CHART per-chart tail cap c3nChart(t0, t1) recomputed across all K = 256 charts of [0, pi] at rho = e^6, against the flat imp-95329 theta-uniform c3n constant it replaces, plus the per-chart gain factor (uniform / per-chart, ranging about 8.09x at chart k = 0 down to about 4.09x at chart k = 255).',
      mathBucket: 'measurement',
      dataModule: 'src/data/imp-95350-chart-tail-cap-vs-uniform-c3n-viz-data.js',
      paperSourcePath:
        'src/data/imp-95332-chart-tail-pencil-floor.js (LEMMA TAIL-CHART closed form, function c3nChart, record fields c3nA6 / c3nChartA6K114 / bindingChartRhoE6; imp-95350 viz page)',
      ticket: 'imp-95350',
      pedagogicalStep: 142,
      honestCeiling:
        'Presentation only: the per-chart series is recomputed here with the same closed-form arithmetic imp-95332 already proved (LEMMA TAIL-CHART), cross-checked at the binding chart (k = 114) and the flat uniform constant against the imp-95332 baked record to rel 1e-12; proves nothing beyond what imp-95332 already states; changes no bound, establishes no operator positivity, no RH claim; Platt-Trudgian Lambda <= 0.2 remains SOTA; NO QED.',
    }),
    Object.freeze({
      route: '/viz-imp95351-unif6-vs-unif5-across-rho',
      title: 'A_unif6 vs A_unif5 r-and-m-Uniform Floors Across rho',
      oneLine:
        'Line chart of the imp-95332 COROLLARY PEN-UNIF6 r-and-m-uniform block symbol-pencil floor A_unif6(rho) against the imp-95331 COROLLARY PEN-UNIF5 floor A_unif5(rho) it supersedes, recomputed across rho = e^a for a in [ln 2, 6]: bitwise identical below the exact-root activation crossover (rho <= ~4) and diverging above it to a 1.1951x gain at rho = e^6.',
      mathBucket: 'measurement',
      dataModule: 'src/data/imp-95351-unif6-vs-unif5-across-rho-viz-data.js',
      paperSourcePath:
        'src/data/imp-95332-chart-tail-pencil-floor.js (COROLLARY PEN-UNIF6, functions w5Scan / w6Scan, record fields aUnif6RhoE6 / aUnif5RhoE6Ref / aUnif6Rho2; imp-95351 viz page)',
      ticket: 'imp-95351',
      pedagogicalStep: 142,
      honestCeiling:
        'Presentation only: both curves are recomputed here with the same closed-form arithmetic imp-95332 / imp-95331 already proved (COROLLARY PEN-UNIF6 / PEN-UNIF5), cross-checked at both grid endpoints (rho = 2, rho = e^6) against the imp-95332 baked record to rel 1e-12/1e-9; proves nothing beyond what those modules already state; changes no bound, establishes no operator positivity, no RH claim; Platt-Trudgian Lambda <= 0.2 remains SOTA; NO QED.',
    }),
    Object.freeze({
      route: '/viz-imp95546-rzpen78-gain-ladder',
      title: 'RZ-PEN Symbol-Pencil Floor Gain Ladder, RZ-PEN6 to RZ-PEN8',
      oneLine:
        'Bar chart of the per-leg floor gain factor A_pen_k/A_pen_{k-1} at (rho, r) = (e^6, 2) across the imp-95333/imp-95334 RZ-PEN7/RZ-PEN8 chain legs, plus a line chart of the cumulative floor gain relative to RZ-PEN6 (the imp-95349 endpoint) and the residual looseness against the exact symbol-pencil infimum, dropping 5.060x -> 3.957x -> 1.084x over the two legs. Surfaces the imp-95333/imp-95334 modules that the imp-95407 audit flagged as ORPHAN (import-light but unrouted). Companion page: /viz-imp95349-rzpen-gain-ladder covers the preceding RZ-PEN2..RZ-PEN6 legs.',
      mathBucket: 'measurement',
      dataModule: 'src/data/imp-95546-rzpen7-8-gain-ladder-viz-data.js',
      paperSourcePath:
        'src/data/imp-95333-pair-extended-pencil-floor.js (THEOREM RZ-PEN7 gainRhoE6R2, loosenessRhoE6R2, loosenessRhoE6R2Pen6Ref); src/data/imp-95334-b-exact-trace-pencil-floor.js (THEOREM RZ-PEN8 gainRhoE6R2, loosenessRhoE6R2; imp-95546 viz page)',
      ticket: 'imp-95546',
      pedagogicalStep: 142,
      honestCeiling:
        'Presentation only: every plotted value is copied verbatim from the imp-95333 / imp-95334 records (no re-derivation, no re-execution of the underlying chart-scan numerics beyond what those modules already compute at import); the cumulative gain is a plain product of already-baked per-leg gains; proves nothing beyond what those two modules already state; changes no bound, establishes no operator positivity, no RH claim; Platt-Trudgian Lambda <= 0.2 remains SOTA; NO QED.',
    }),
    Object.freeze({
      route: '/viz-imp95547-alpha-kh-heat-scatter',
      title: 'alpha_{k,h} Across the (k, h) Alias Grid: the imp-95519 PCC-Gated Region',
      oneLine:
        'Heatmap of the imp-95519 section-4 Montgomery frequency alpha_{k,h} = 1 + log(1/(2 pi (k - h/p)))/log T over k = 1..6, h = 1..96 at p = 97, at the window-bottom endpoint N = 690988, marking the alpha = 1 boundary h* = 81.562 (k = 1 only) and the PCC-gated aliases h in {82..96} that carry 59.26% of the named-scalar majorant mass, plus an illustrative per-alias weight bar.',
      mathBucket: 'measurement',
      dataModule: 'src/data/imp-95547-alpha-kh-heat-scatter-viz-data.js',
      paperSourcePath:
        'src/data/imp-95519-localized-barrier-sum-prime-zero-nogo.js (section 4 ZERO SIDE, alphaFormula, alphaOverOneAliasesP97, alphaOverOneMajorantShareP97; imp-95547 viz page)',
      ticket: 'imp-95547',
      pedagogicalStep: 142,
      honestCeiling:
        'Presentation only: alpha_{k,h} and the gated-share figure are recomputed here with the same closed-form formula imp-95519 already states, cross-checked against its baked figures (alpha_max = 1.0953/1.0730, count = 15, share = 59.26%) to rel 5e-4; proves nothing beyond what imp-95519 already states; changes no bound, establishes no operator positivity, no RH claim; Platt-Trudgian Lambda <= 0.2 remains SOTA; NO QED.',
    }),
    Object.freeze({
      route: '/viz-imp95371-bcap-two-branch-cap-vs-exact-ratio',
      title: 'LEMMA BCAP Two-Branch Cap vs the Exact Ratio',
      oneLine:
        'Line chart of the imp-95329 LEMMA BCAP two monotone branches min(4 w^2 c/a^2, 2 + 2/(c-1)) against the exact ratio (1 - cos(w b/a)) / (1 - sech(b/2)) they bound, across c = cosh(b/2) at a = 6 for w = pi and w = 2 pi, marking the crossover c* where both branches meet the flat cap 2 + 4 w^2/a^2.',
      mathBucket: 'measurement',
      dataModule: 'src/data/imp-95371-bcap-two-branch-cap-vs-exact-ratio-viz-data.js',
      paperSourcePath:
        'src/data/imp-95329-beta-trace-capped-pencil-floor.js (LEMMA BCAP, record field lemmaBcap; imp-95371 viz page)',
      ticket: 'imp-95371',
      pedagogicalStep: 142,
      honestCeiling:
        'Presentation only: all four curves are recomputed here with the same closed-form arithmetic imp-95329 already proved (LEMMA BCAP), cross-checked at the crossover point c* (both branches equal the flat cap there, rel 1e-9); the plotted a = 6 slice is not the near-sharp regime the imp-95329 record measures elsewhere (small a, small b); proves nothing beyond what imp-95329 already states; changes no bound, establishes no operator positivity, no RH claim; Platt-Trudgian Lambda <= 0.2 remains SOTA; NO QED.',
    }),
    Object.freeze({
      route: '/viz-imp95366-rzpen-onset-drop-ladder',
      title: 'RZ-PEN Every-Octave Onset-Drop Ladder Across the Chain Legs',
      oneLine:
        'Line chart of the every-octave firing onset x* (m-and-r-uniform, r=1.3, r=1.05 tracks) across the imp-95328/95329/95330/95331/95332 RZ-PEN2..RZ-PEN6 chain legs, plus a bar chart of the per-leg onset drop showing the K=256 chart-cover leg (imp-95330) supplies the bulk of the total drop (~0.94 of ~1.00) while the beta-trace-cap leg contributes only ~0.06 and the last two legs contribute exactly zero at rho = 2. Companion page: /viz-imp95349-rzpen-gain-ladder plots the per-leg symbol-pencil floor gain for the same RZ-PEN2..RZ-PEN6 chain legs -- the two pages are complementary axes (onset drop vs floor gain) of one chain.',
      mathBucket: 'measurement',
      dataModule: 'src/data/imp-95366-rzpen-onset-drop-ladder-viz-data.js',
      paperSourcePath:
        'src/data/imp-95328-two-chart-pencil-floor.js (THEOREM RZ-PEN2 baseline onsets); src/data/imp-95329-beta-trace-capped-pencil-floor.js (THEOREM RZ-PEN3 onsets); src/data/imp-95330-chart-refined-pencil-floor.js (THEOREM RZ-PEN4 onsets); src/data/imp-95331-split-weight-exact-root-pencil-floor.js (THEOREM RZ-PEN5 onsetsUnchanged); src/data/imp-95332-chart-tail-pencil-floor.js (THEOREM RZ-PEN6 onsetsUnchanged; imp-95366 viz page)',
      ticket: 'imp-95366',
      pedagogicalStep: 143,
      honestCeiling:
        'Presentation only: every plotted onset is copied verbatim from the imp-95328 / imp-95329 / imp-95330 / imp-95331 / imp-95332 records (no re-derivation, no re-execution of the underlying 256-chart / pair-identity numerics beyond what those modules already compute at import); the per-leg drops are a plain subtraction of already-baked onsets; proves nothing beyond what those five modules already state; changes no bound, establishes no operator positivity, no RH claim; Platt-Trudgian Lambda <= 0.2 remains SOTA; NO QED.',
    }),
    Object.freeze({
      route: '/viz-imp95390-ri-margin-heatmap',
      title: 'RI-Margin Tightness Map with the r_star(x) Bump-Wedge Boundary',
      oneLine:
        'Heatmap of the imp-95271 dense (x, r) sweep of the imp-95231 LEMMA RI reduced-inequality tightness ratio LHS/RHS, re-rendered on a coarse render-friendly grid, with the r_star(x) bump-wedge boundary (root of h_r = 0) overlaid and the (x -> 0, r -> 1) corner extremum circled.',
      mathBucket: 'measurement',
      dataModule: 'src/data/imp-95390-ri-margin-heatmap-viz-data.js',
      paperSourcePath:
        'src/data/imp-95271-ri-margin-map.js (functions hOf / lam2 / hprime / riMargin / rStar, record IMP95271_RI_MARGIN_MAP; imp-95390 viz page)',
      ticket: 'imp-95390',
      pedagogicalStep: 143,
      honestCeiling:
        'Presentation only: re-implements the same import-light kernel imp-95271 already used (no re-derivation) at a coarser grid chosen for SVG render size; the imp-95271 record itself reports the full 171,600-cell sweep with zero counterexamples; proves nothing beyond what imp-95271 already states; changes no bound, establishes no operator positivity, no RH claim; Platt-Trudgian Lambda <= 0.2 remains SOTA; NO QED.',
      queueReconciliation:
        'imp-95410 (queue: "add a viz page for the imp-95271 RI-margin wedge, M(x,r) >= 0 heatmap, h_r>0 bump wedge, r_star(x) boundary") requests exactly this page; reconciled as already-delivered by imp-95390, not a separate build.',
    }),
    Object.freeze({
      route: '/viz-imp95391-split2-splitloo-crossover',
      title: 'SPLIT-2 vs SPLIT-LOO Crossover: g-vs-sigma Locus',
      oneLine:
        'Scatter of realized two-block configurations from the imp-95256 SPLIT-2 vs SPLIT-LOO non-dominance surface, plotted as balance ratio g against principal-angle cosine sigma against the exact diagonal crossover locus g = sigma, with the imp-95250 anchor and the concrete SPLIT-2-win witness circled.',
      mathBucket: 'measurement',
      dataModule: 'src/data/imp-95391-split2-splitloo-crossover-viz-data.js',
      paperSourcePath:
        'src/data/imp-95256-split2-splitloo-crossover.js (function compareSplits, record IMP95256_SPLIT2_SPLITLOO_CROSSOVER; imp-95391 viz page)',
      ticket: 'imp-95391',
      pedagogicalStep: 144,
      honestCeiling:
        'Presentation only: re-implements the same import-light kernel imp-95256 already used (no re-derivation) over a coarser configuration set chosen for a renderable scatter; proves nothing beyond what imp-95256 already states (the g-vs-sigma criterion is an algebraic identity of two already-proven bounds, not a new one); changes no bound, establishes no operator positivity, no RH claim; Platt-Trudgian Lambda <= 0.2 remains SOTA; NO QED.',
    }),
    Object.freeze({
      route: '/viz-imp95409-rhostar-depthflip',
      title: 'SPLIT-2 vs SPLIT-LOO Crossover: rhoStar(sigma) Locus and the Depth Flip',
      oneLine:
        'The imp-95256 crossover in its rho-vs-rhoStar(sigma) form (rho = max sqrt(L1/L2), sqrt(L2/L1)), plus the concrete depth-flip witness V1={1,1.05}, V2={50,52} where sigma stays fixed but rho crosses the threshold between x=0.05 and x=0.1.',
      mathBucket: 'measurement',
      dataModule: 'src/data/imp-95409-rhostar-depthflip-viz-data.js',
      paperSourcePath:
        'src/data/imp-95256-split2-splitloo-crossover.js (function compareSplits, record IMP95256_SPLIT2_SPLITLOO_CROSSOVER; imp-95409 viz page)',
      ticket: 'imp-95409',
      pedagogicalStep: 147,
      honestCeiling:
        'Presentation only: re-implements the same import-light kernel imp-95256 already used (no re-derivation) to plot the equivalent rho-vs-rhoStar(sigma) form of the identity already rendered by imp-95391 in g-vs-sigma form; proves nothing beyond what imp-95256 already states; changes no bound, establishes no operator positivity, no RH claim; Platt-Trudgian Lambda <= 0.2 remains SOTA; NO QED.',
    }),
    Object.freeze({
      route: '/viz-imp95392-precision-replay-cost-ladder',
      title: 'Tier-2 Precision-Replay Cost Ladder, CPU-Days vs Bit-Band',
      oneLine:
        'Bar chart of the imp-95277 tier-2 full-window W1-CERT CPU-day price at each 64-bit mantissa-limb band (128 through 384 bits), upper (schoolbook, L^2/4) and lower (linear-in-limbs, L/2) brackets side by side, showing the price is flat within a band and jumps only at limb boundaries.',
      mathBucket: 'measurement',
      dataModule: 'src/data/imp-95277-precision-replay-ladder.js',
      paperSourcePath:
        'src/data/imp-95277-precision-replay-ladder.js (record PRECISION_REPLAY_LADDER, derived from imp-95214 TIER2_PRICE and imp-95257 PRECISION_REPLAY_MULTIPLIER; imp-95392 viz page)',
      ticket: 'imp-95392',
      pedagogicalStep: 144,
      honestCeiling:
        'Presentation only: renders the ladder rungs already computed by imp-95277 verbatim (no re-derivation, no native FLINT/Arb replay launched); the 3-limb rung reproduces the imp-95257 headline exactly; proves nothing beyond what imp-95277 already states; changes no bound, establishes no operator positivity, no RH claim; Platt-Trudgian Lambda <= 0.2 remains SOTA; NO QED.',
    }),
    Object.freeze({
      route: '/viz-imp95477-karatsuba-crossover-ladder',
      title: 'Karatsuba-Aware Precision-Replay Ladder, Schoolbook vs f_karat CPU-Days',
      oneLine:
        'Bar chart extending the imp-95277 tier-2 CPU-day ladder past 384 bits (imp-95380 rungs, 6 through 20 mantissa limbs), schoolbook L^2/4 against the Karatsuba-aware f_karat that breaks below it past the ~10-limb (640-bit) crossover, up to a 25% shortfall at the 20-limb top rung.',
      mathBucket: 'measurement',
      dataModule: 'src/data/imp-95380-karatsuba-crossover.js',
      paperSourcePath:
        'src/data/imp-95380-karatsuba-crossover.js (record KARATSUBA_CROSSOVER_LADDER, derived from imp-95214 TIER2_PRICE and imp-95277 PRECISION_REPLAY_LADDER via the GMP schoolbook-to-Karatsuba cost law; imp-95477 viz page)',
      ticket: 'imp-95477',
      pedagogicalStep: 145,
      honestCeiling:
        'Presentation only: renders the ladder rungs already computed by imp-95380 verbatim (no re-derivation, no native FLINT/Arb replay launched, no per-platform MUL_TOOM22_THRESHOLD probe); proves nothing beyond what imp-95380 already states; changes no bound, establishes no operator positivity, no RH claim; Platt-Trudgian Lambda <= 0.2 remains SOTA; NO QED.',
    }),
    Object.freeze({
      route: '/viz-imp95393-ymin-maps-theta-obstructed',
      title: 'Currency Split Verdict: y_min MAPS, theta OBSTRUCTED',
      oneLine:
        'Two-card status view of the imp-95255 split verdict on the imp-95233 model-family currencies: y_min (per-window depth) MAPS onto the imp-95220/imp-95222 geometry transcription with its measured y_min/x_min ratio ladder, while theta (per-window phase) is OBSTRUCTED, a sign functional with no image under the geometry-only map.',
      mathBucket: 'measurement',
      dataModule: 'src/data/imp-95255-currency-per-window-map-assessment.js',
      paperSourcePath:
        'src/data/imp-95255-currency-per-window-map-assessment.js (record IMP95255_CURRENCY_PER_WINDOW_MAP_ASSESSMENT; imp-95393 viz page)',
      ticket: 'imp-95393',
      pedagogicalStep: 144,
      honestCeiling:
        'Presentation only: renders the imp-95255 split-verdict record verbatim (no re-derivation); the ratio table and theta trivial/signed rows reproduce imp-95255 baked literals and assertions exactly; proves nothing beyond what imp-95255 already states; changes no bound, establishes no operator positivity, no RH claim; Platt-Trudgian Lambda <= 0.2 remains SOTA; NO QED.',
    }),
    Object.freeze({
      route: '/viz-imp95434-theta-range-descent-overlap-growth',
      title: 'Theta Sign-Pattern Range: Alternating-Witness Descent vs Overlap Growth',
      oneLine:
        'Dual-axis line chart of the imp-95375 ported-grid measurements: theta(alternating) falling from 0.1115 to 2.4e-5 (left axis) against the packet Gram off-/on-diagonal mass ratio B/A climbing from 1.79 to 542.73 (right axis) across pD = 8..704, showing heavier center overlap drives deeper achievable sign cancellation.',
      mathBucket: 'measurement',
      dataModule: 'src/data/imp-95375-theta-range-geometry-image.js',
      paperSourcePath:
        'src/data/imp-95375-theta-range-geometry-image.js (record IMP95375_THETA_RANGE_GEOMETRY_IMAGE; imp-95434 viz page)',
      ticket: 'imp-95434',
      pedagogicalStep: 144,
      honestCeiling:
        'Presentation only: renders the imp-95375 baked alternating-witness and B/A literals verbatim (exact closed-form Gram, no quadrature, no re-derivation); does not determine the actual seam sign pattern (imp-95397, still open); changes no bound, establishes no operator positivity, no RH claim; Platt-Trudgian Lambda <= 0.2 remains SOTA; NO QED.',
    }),
    Object.freeze({
      route: '/viz-imp95435-rzpen-offlattice-degradation-ladder',
      title: 'RZ-PEN Off-Lattice Degradation Ladder',
      oneLine:
        'Log-scale floor chart plotting the imp-95374 worst-of-400 and mean-of-400 seam-pencil floor against the proven A_unif4 line, plus a bar chart of the worst-of-400 onset shift, across log-rate jitter delta = 2^-6..2^-2 off the dyadic 2^k lattice.',
      mathBucket: 'measurement',
      dataModule: 'src/data/imp-95374-rzpen-offlattice-degradation.js',
      paperSourcePath:
        'src/data/imp-95374-rzpen-offlattice-degradation.js (record IMP95374_RZPEN_OFFLATTICE_DEGRADATION; imp-95435 viz page)',
      ticket: 'imp-95435',
      pedagogicalStep: 145,
      honestCeiling:
        'Presentation only: renders the imp-95374 baked worst/mean floor, degrade, and onset-shift literals verbatim (finite-m Jacobi-eigenvalue pencil measurement, no re-derivation); supplies no off-lattice floor theorem (the separate, looser imp-95335 Ingham route does); onset shift isolates the floor degradation only, holding the numerator fixed; changes no bound, establishes no operator positivity, no RH claim; Platt-Trudgian Lambda <= 0.2 remains SOTA; NO QED.',
    }),
    Object.freeze({
      route: '/viz-imp95565-alpha-over-one-majorant-mass-fraction',
      title: 'alpha > 1 Majorant-Mass Fraction Across All 25 Sieving Primes',
      oneLine:
        'Bar chart of the imp-95540 alpha > 1 weld-majorant-mass share at every sieving prime p <= 97 (0% for p <= 5, 35.09%-59.49% for p >= 7), plus a line chart of the alpha_max(p) window endpoints (N = 690988, N = 54799999) staying strictly above the alpha = 1 line.',
      mathBucket: 'measurement',
      dataModule: 'src/data/imp-95540-alpha-over-one-fraction-table.js',
      paperSourcePath:
        'src/data/imp-95540-alpha-over-one-fraction-table.js (record IMP95540_ALPHA_OVER_ONE_FRACTION_TABLE, extending imp-95519 section 4 spot sample; imp-95565 viz page)',
      ticket: 'imp-95565',
      pedagogicalStep: 146,
      honestCeiling:
        'Presentation only: renders the imp-95540 baked over-one-share and alpha_max literals verbatim (import-light re-derivation of the imp-95519 section 4 construction, no new bound); the alpha > 1 fraction is N-independent combinatorics, not a measurement of the actual zero-side sign or an operator positivity result; changes no bound, establishes no operator positivity, no RH claim; Platt-Trudgian Lambda <= 0.2 remains SOTA; NO QED.',
    }),
    Object.freeze({
      route: '/viz-imp95566-alias-energy-in-algebra',
      title: 'Alias Energy In-Algebra vs Leak-Outside',
      oneLine:
        'Stacked bar chart of the imp-95539 Theorem U alias-energy split -- the 1/phi(q) fraction inside the sieve algebra vs the 1 - 1/phi(q) fraction leaking outside -- across eight aliases a | P = 30030 ordered by gcd(a,P), from 1.736e-4 in / 99.98% out (a coprime to P) up to 1.0 in (q = 2).',
      mathBucket: 'measurement',
      dataModule: 'src/data/imp-95539-alias-energy-in-algebra-table.js',
      paperSourcePath:
        'src/data/imp-95539-alias-energy-in-algebra-table.js (record IMP_95539_ALIAS_ENERGY_IN_ALGEBRA; imp-95566 viz page)',
      ticket: 'imp-95566',
      pedagogicalStep: 149,
      honestCeiling:
        'Presentation only: renders the imp-95539 baked in-algebra/leak-outside literals verbatim (genuine numeric Ramanujan-sum projection, matching 1/phi(q) to < 1e-9, no re-derivation on this page); confirms perm-arch Theorem U (line 44) numerically across gcd(a,P) from 1 to 15015; changes no bound, establishes no operator positivity, no RH claim; Platt-Trudgian Lambda <= 0.2 remains SOTA; NO QED.',
    }),
    Object.freeze({
      route: '/viz-imp95273-theta-vacuity-distribution',
      title: 'Theta Phase-Currency Vacuity Distribution',
      oneLine:
        'Horizontal bar chart of r = theta/e^(-y_min) across ten representative signed seam families, split at the imp-95233 PHASE-CERT vacuity boundary r = 1: co-centered deep-cancellation witnesses sit left (vacuous) while mild-sign / well-separated families sit right (active).',
      mathBucket: 'measurement',
      dataModule: 'src/data/imp-95273-theta-vacuity-distribution.js',
      paperSourcePath:
        'src/data/imp-95273-theta-vacuity-distribution.js (record IMP95273_THETA_VACUITY_DISTRIBUTION, derived from imp-95233 PHASE-CERT and the imp-95224 witness family; imp-95273 viz page)',
      ticket: 'imp-95273',
      pedagogicalStep: 144,
      honestCeiling:
        'Presentation only: renders the imp-95273 baked distribution verbatim (Simpson quadrature recomputed and cross-checked against the imp-95233 exact closed forms to 2e-3 relative); proves nothing beyond what imp-95273 already states; changes no bound, establishes no operator positivity, no RH claim; Platt-Trudgian Lambda <= 0.2 remains SOTA; NO QED.',
    }),
    Object.freeze({
      route: '/viz-cost-floor',
      title: 'The Geometry of the Program Floor',
      oneLine:
        'Filled (t, y) contour map of the Route-VII complete-row cost law ln N1* = (2c0 − y)/t + L0 with iso-U parabolas, budget frontiers, the frozen rows, and the derived U ≈ 0.145–0.150 floor band.',
      mathBucket: 'bound',
      dataModule: 'src/data/imp-95218-route7-cost-curve.js',
      paperSourcePath:
        'src/data/imp-95218-route7-cost-curve.js (calibrated law + SC3 floor; paper section 10.7 / Theorem 11.1); verify_tail_arb.c contraction structure',
      ticket: 'imp-95470',
      pedagogicalStep: 144,
      honestCeiling:
        'Derived ANALYSIS rendered exactly: every pixel is the imp-95218 two-point-calibrated law (Arb points A/B), every overlay an exact level set; the law is calibrated at y in [0.165, 0.19] and UNDERSTATES cost at small y (G ~ N^{-y} wall omitted). Derives no bound, certifies nothing, changes no frontier; no RH claim; Platt-Trudgian Lambda <= 0.2 remains SOTA; NO QED.',
    }),
    Object.freeze({
      route: '/viz-window-landscape',
      title: 'The First-Window Landscape',
      oneLine:
        'The real window-1 dd landscape: max-preserving downsample of the 600,002-evaluation pilotg3 grid — Σ|D_j|(w) and |E97|(w) vs Rex, both seam charts, exact sup witnesses, the certified tier slice, and a phase-scale zoom.',
      mathBucket: 'measurement',
      dataModule: 'src/data/viz-window1-landscape-data.js',
      paperSourcePath:
        'native/gate2-lane-a/pilotg3-300001-result.json (imp-95205 G3 pilot) + deterministic grid re-evaluation for the curve; certified slice literals from src/data/imp-95213-tier-certifier-build.js',
      ticket: 'imp-95471',
      pedagogicalStep: 145,
      honestCeiling:
        'Sampled dd MEASUREMENT (grade: measured), not a certificate: the curves are a max-preserving downsample of the deterministic 300001-point pilotg3 grid, sups verified against the recorded pilot literals; only the shaded u in [73222.5, 74022.5] slice is interval-certified (0.058% of window 1); the window-1 full continuum run is in progress and 54,109,011 windows lie beyond it. Proves no bound, no RH claim; Platt-Trudgian Lambda <= 0.2 remains SOTA; NO QED.',
    }),
    Object.freeze({
      route: '/viz-freeze-flow',
      title: 'The Normal Form as Flow Geometry',
      oneLine:
        'The eq-42 modulus-last normal form animated with the 25 REAL defect packets D_j at the window-1 pilot sup witness: recombine-first vs modulus-first, ratio 1.3430187 computed from the literals.',
      mathBucket: 'flow-field',
      dataModule: 'src/data/viz-freeze-flow-phasors.js',
      paperSourcePath:
        'Permuting the Zeta Twin Ladder (eq. 7 ordering rule, eq. 42 normal form, eq. 13 telescope); packets from native/gate2-lane-a point mode at the imp-95205 supPilot witness',
      ticket: 'imp-95472',
      pedagogicalStep: 146,
      honestCeiling:
        'Renders one ordering lemma (|Σz| ≤ Σ|z|, modulus-last) with one real dd evaluation (telescope identity 2.6e-14); the two bars and the 1.3430187 ratio are computed, the pipeline layout is the only schematic element. Proves no bound, does not certify the window, no RH claim; Platt-Trudgian Lambda <= 0.2 remains SOTA; NO QED.',
    }),
    Object.freeze({
      route: '/viz-imp95413-evoct-onset-sensitivity',
      title: 'EV-OCT Firing-Onset Sensitivity: m, rho, r',
      oneLine:
        'Three sweeps of the imp-95250 every-octave firing onset xStarEvOct = 11.32: rising and saturating in octave count m (11.599 limit), steeply falling in lattice ratio rho (dominant axis, 19.05 at rho=1.5 to 5.03 at rho=4), and nearly flat in intra-pair ratio r (spread < 0.27).',
      mathBucket: 'measurement',
      dataModule: 'src/data/imp-95258-evoct-onset-sensitivity.js',
      paperSourcePath:
        'src/data/imp-95258-evoct-onset-sensitivity.js (function certEvOct/onset, record IMP95258_EVOCT_ONSET_SENSITIVITY; generalizes the imp-95250 COROLLARY EV-OCT certificate)',
      ticket: 'imp-95413',
      pedagogicalStep: 148,
      honestCeiling:
        'Measures the closed-form COROLLARY EV-OCT certificate only (the same object imp-95250 bisected), not the exact pencil Lambda; the cert-vs-exact collar is unchanged and not re-measured; twin-pair blocks only. Changes no bound, establishes no operator positivity, no RH claim; Platt-Trudgian Lambda <= 0.2 remains SOTA; NO QED.',
    }),
    Object.freeze({
      route: '/viz-imp95469-binding-chart-migration',
      title: 'imp-95341 Binding-Chart Migration k*(a, mu) Across rho',
      oneLine:
        'Line chart of the imp-95341 binding chart k*(a, mu) (uniform certificate mu=16/a^2, K=256 charts) migrating from a V4-carried edge chart at small rho, crossing to the Psi6 branch at a~2.28 (rho~9.83), peaking at k*=144 near a~3.34, and retreating to k*=114 at rho=e^6; plus a bar chart of the r-invariance spread (0 charts of 256 for a>=3, up to 5 near the crossover).',
      mathBucket: 'measurement',
      dataModule: 'src/data/imp-95469-binding-chart-migration-viz-data.js',
      paperSourcePath:
        'src/data/imp-95341-binding-chart-migration.js (record IMP95341_BINDING_CHART_MIGRATION; imp-95469 viz page)',
      ticket: 'imp-95469',
      pedagogicalStep: 150,
      honestCeiling:
        'Presentation only: every plotted point is copied verbatim from the imp-95341 record (no re-derivation, no re-execution of the underlying 256-chart numerics beyond what imp-95341 already computes at import); proves nothing beyond what imp-95341 already states; changes no bound, establishes no operator positivity, no RH claim; Platt-Trudgian Lambda <= 0.2 remains SOTA; NO QED.',
    }),
    Object.freeze({
      route: '/viz-imp95449-ppos-enclosure-tightness',
      title: 'imp-95449 P-POS Enclosure Tightness',
      oneLine:
        'Log-scale width curves of the imp-95420 THEOREM P-POS two-sided enclosure (theta 3e^(-2pi^2 t), dual 3e^(-2/t), both 0.406006 at their regime boundary), plus a bar chart of the strict-positivity margin min p/up=0.606345 and the boundary asymmetry up/p=1.649 vs lo/p=0.980.',
      mathBucket: 'measurement',
      dataModule: 'src/data/imp-95449-ppos-enclosure-tightness.js',
      paperSourcePath:
        'src/data/imp-95449-ppos-enclosure-tightness.js (record IMP95449_PPOS_ENCLOSURE_TIGHTNESS; imp-95470 viz page)',
      ticket: 'imp-95470',
      pedagogicalStep: 151,
      honestCeiling:
        'Presentation only: the width curves are plotted from the exact closed-form formulas documented in the imp-95449 record (no re-derivation) and the margin/asymmetry bars are the baked scalars verbatim; proves nothing beyond what imp-95449 already states; changes no bound, establishes no operator positivity, no RH claim; Platt-Trudgian Lambda <= 0.2 remains SOTA; NO QED.',
    }),
    Object.freeze({
      route: '/viz-imp95607-gumbelz-band',
      title: 'imp-95583 Gumbel-Z Per-Height Band Check',
      oneLine:
        'Bar chart overlaying the imp-95583 per-height gumbelZ (max side) and the imp-95599 gumbelZmin (min side) against the |gumbelZ| < 2 no-outlier band, across the six sample heights T_c = 1e4..5e5 (nWindows = 75..443), showing the measured two-sided symmetry.',
      mathBucket: 'measurement',
      dataModule: 'src/data/imp-95583-discrepancy-tail-evt.js',
      paperSourcePath:
        'src/data/imp-95583-discrepancy-tail-evt.js (record IMP95583_DISCREPANCY_TAIL_EVT); src/data/imp-95599-discrepancy-negative-tail-evt.js (record IMP95599_DISCREPANCY_NEGATIVE_TAIL_EVT); imp-95607/imp-95629 viz page',
      ticket: 'imp-95629',
      pedagogicalStep: 152,
      honestCeiling:
        'Presentation only: renders the imp-95583 and imp-95599 baked (T_c, nWindows, gumbelZ, gumbelZmin) tuples verbatim (no re-derivation of the Gumbel EVT formulas); proves nothing beyond what those tickets already state; changes no bound, establishes no operator positivity, no RH claim; Platt-Trudgian Lambda <= 0.2 remains SOTA; NO QED.',
    }),
    Object.freeze({
      route: '/viz-imp95448-ra-ladder-input-provenance',
      title: 'imp-95448 R_A Ladder Input Provenance',
      oneLine:
        'Horizontal-bar chart of the imp-95372 R_A Path C ladder rungs {50,100,200,500,2458} against the ZETA_ZEROS corruption boundary (index 650, repaired), plus a band chart of the imp-2605 neighbour-perturbation factor [1.06, 1.19] and the N=8 exact-heat-vs-RK4 witness point.',
      mathBucket: 'measurement',
      dataModule: 'src/data/imp-95448-ra-ladder-input-data-audit.js',
      paperSourcePath:
        'src/data/imp-95448-ra-ladder-input-data-audit.js (record IMP95448_RA_LADDER_INPUT_DATA_AUDIT; imp-95478 viz page)',
      ticket: 'imp-95478',
      pedagogicalStep: 153,
      honestCeiling:
        'Presentation only: renders the imp-95448 baked rung set, corruption boundary, and neighbour-factor range verbatim (no re-derivation); proves nothing beyond what imp-95448 already states; changes no bound, establishes no operator positivity, no RH claim; Platt-Trudgian Lambda <= 0.2 remains SOTA; NO QED.',
    }),
    Object.freeze({
      route: '/viz-imp95491-combined-offlattice-onset-ladder',
      title: 'Combined Off-Lattice Onset: SPLIT-LOO vs RZ-PEN Total',
      oneLine:
        'Line chart of the imp-95445 combined off-lattice every-octave onset -- imp-95253 SPLIT-LOO Blaschke leg vs imp-95429 RZ-PEN total vs their min -- across jitter magnitude delta = 2^-6..2^-2, plus a bar chart of the RZ-PEN over-estimate widening from 0.25 to 7.48 depth units.',
      mathBucket: 'measurement',
      dataModule: 'src/data/imp-95445-total-offlattice-onset-blaschke-composition.js',
      paperSourcePath:
        'src/data/imp-95445-total-offlattice-onset-blaschke-composition.js (record IMP95445_TOTAL_OFFLATTICE_ONSET_BLASCHKE_COMPOSITION; imp-95491 viz page)',
      ticket: 'imp-95491',
      pedagogicalStep: 154,
      honestCeiling:
        'Presentation only: renders the imp-95445 baked SPLIT-LOO/RZ-PEN/combined onset columns verbatim (SPLIT-LOO recomputed pure arithmetic, RZ-PEN column baked; no re-derivation); the two legs use different model Gram conventions so the combined min is a firing-depth comparison of two independent valid upper bounds, not a unified single certificate; changes no bound, establishes no operator positivity, no RH claim; Platt-Trudgian Lambda <= 0.2 remains SOTA; NO QED.',
    }),
    Object.freeze({
      route: '/viz-imp95492-breach-threshold-surface',
      title: 'Off-Lattice Breach-Threshold delta*(m, rho) Surface',
      oneLine:
        'Line charts of the imp-95430 worst-of-400 crossing threshold delta*(m, rho) -- shrinking from 19.97% to 3.10% as the octave count m grows (rho=2), growing from 5.20% to 28.86% as the lattice ratio rho widens (m=8) -- with the single binding pattern (index 129) annotated at the m=8/rho=2 crossing.',
      mathBucket: 'measurement',
      dataModule: 'src/data/imp-95430-breach-threshold-bound.js',
      paperSourcePath:
        'src/data/imp-95430-breach-threshold-bound.js (record IMP95430_BREACH_THRESHOLD_BOUND; imp-95492 viz page)',
      ticket: 'imp-95492',
      pedagogicalStep: 155,
      honestCeiling:
        'Presentation only: renders the imp-95430 baked mDependence/rhoDependence/bindingGapM8 columns verbatim (no re-derivation); the crossing threshold is a worst-of-400 estimate, not an infimum; changes no bound, establishes no operator positivity, no RH claim; Platt-Trudgian Lambda <= 0.2 remains SOTA; NO QED.',
    }),
    Object.freeze({
      route: '/viz-imp95493-rstar-two-end-accuracy',
      title: 'r_star(x) Two-End Asymptotic Accuracy: Lambert-W vs Edge Series',
      oneLine:
        'Log-scale relative-error curves for the imp-95377 small-x Lambert-W form and the imp-95447 x->1 edge series against the exact RSTAR-EQ root of r_star(x), shading the mid-band x in (0.0742, 0.7579) where neither closed form is within 1%.',
      mathBucket: 'measurement',
      dataModule: 'src/data/imp-95493-rstar-two-end-accuracy-data.js',
      paperSourcePath:
        'src/data/imp-95493-rstar-two-end-accuracy-data.js (record IMP95493_SUMMARY; imp-95493 viz page)',
      ticket: 'imp-95493',
      pedagogicalStep: 158,
      honestCeiling:
        'Derivation/measurement only: both accuracy curves are computed fresh from the imp-95377/imp-95447 closed forms against a bisection root of THEOREM RSTAR-EQ (no re-derivation of either asymptotic); the shaded gap is wider than the imp-95447 informal ~[0.3, 0.6] window but contains it; changes no bound, establishes no operator positivity, no RH claim; Platt-Trudgian Lambda <= 0.2 remains SOTA; NO QED.',
    }),
    Object.freeze({
      route: '/viz-imp95622-sigma-exponent-ramp',
      title: 'sigma(N) Half-Decade Exponent Ramp p(N)',
      oneLine:
        'Line chart of the imp-95582/imp-95606 pointwise decay-exponent ramp p(N) = -d ln sigma / d ln N across log10 N = 6..12, marking the E_coll = E_trunc transition at log10 N = 9.51591 (matching imp-3444) and the imp-3463 far-tail asymptote p = 0.5, plus the whole-decade OLS midpoint-sampling cross-check.',
      mathBucket: 'measurement',
      dataModule: 'src/data/imp-95606-sigma-postpeak-fine-exponent-ramp-viz-data.js',
      paperSourcePath:
        'src/data/imp-95606-sigma-postpeak-fine-exponent-ramp-viz-data.js (records IMP95606_FINE_GRID/IMP95606_MIDPOINT_BRIDGE/IMP95606_TRANSITION; imp-95622 viz page)',
      ticket: 'imp-95622',
      pedagogicalStep: 156,
      honestCeiling:
        'Presentation only: renders the frozen imp-95582/imp-95606 baked pointwise ramp record verbatim (no re-derivation); a measurement/fit of an existing decay quantity, not an RH bound; changes no bound, establishes no operator positivity, no RH claim; Platt-Trudgian Lambda <= 0.2 remains SOTA; NO QED.',
    }),
    Object.freeze({
      route: '/viz-imp95624-mty-vs-vk-crossover',
      title: 'Classical MTY vs Ford VK Zero-Free Width, T in [3e12, 1.9e16]',
      oneLine:
        'Log-log curves comparing the imp-95605 classical Mossinghoff-Trudgian-Yang and Ford Vinogradov-Korobov unconditional zero-free widths across the imp-95519 window T in [3e12, 1.9e16], marking the window endpoints, the log t ~ 1.0242e4 (t ~ e^{10000}) crossover, and the pinned 0.8354 per-zero factor floor.',
      mathBucket: 'measurement',
      dataModule: 'src/data/imp-95624-mty-vs-vk-crossover-viz-data.js',
      paperSourcePath:
        'src/data/imp-95605-zero-free-region-verify.js (IMP_95605_ZERO_FREE_VERIFY closed forms and figures; imp-95624 viz page)',
      ticket: 'imp-95624',
      pedagogicalStep: 157,
      honestCeiling:
        'Descriptive curves recomputing classicalWidth/vkWidth independently from the imp-95605 documented closed forms (no new derivation, no heavy import); illustrates the window-wide classical dominance and the far-outside-window crossover numerically, proves nothing beyond what imp-95605 already states; changes no bound, establishes no operator positivity, no RH claim; Platt-Trudgian Lambda <= 0.2 remains SOTA; NO QED.',
    }),
    Object.freeze({
      route: '/viz-imp95645-kronecker-transfer-constant',
      title: 'Kronecker Sup/RMS Transfer Constant vs sqrt(N)',
      oneLine:
        'Line chart of the imp-95604/imp-95616 measured and theoretical sup_T/rms_T transfer constant for the Lambda(p)p^{-sigma} packet across four prime-set sizes N = 4, 8, 15, 25, tracking the sqrt(N) ceiling from below.',
      mathBucket: 'measurement',
      dataModule: 'src/data/imp-95616-kronecker-suprms-crosscheck.js',
      paperSourcePath:
        'src/data/imp-95616-kronecker-suprms-crosscheck.js (record IMP95616_KRONECKER_SUPRMS_CROSSCHECK.rows; imp-95645 viz page)',
      ticket: 'imp-95645',
      pedagogicalStep: 159,
      honestCeiling:
        'Presentation only: renders the frozen imp-95616 independent-grid reproduction of the imp-95604 witness verbatim (no re-derivation); a measurement of an existing transfer-constant quantity, not an RH bound; changes no bound, establishes no operator positivity, no RH claim; Platt-Trudgian Lambda <= 0.2 remains SOTA; NO QED.',
    }),
    Object.freeze({
      route: '/viz-imp95646-transition-knee-2d-heatmap',
      title: 'Joint (C_C, E_trunc) Transition-Before-Knee Gap Contour',
      oneLine:
        'Heatmap of the imp-95617 joint 2-D (C_C, E_trunc) multiplier sweep over [0.5x, 1.5x]^2, shading the gap = log10 N_knee - log10 N_cross field, overlaying the rising gap = 0 inversion contour, and marking the pinned point and the low-C_C/high-E_trunc box-corner minimum.',
      mathBucket: 'measurement',
      dataModule: 'src/data/imp-95646-transition-knee-2d-heatmap-viz-data.js',
      paperSourcePath:
        'src/data/imp-95617-transition-knee-ordering-joint-2d.js (IMP95617_TRANSITION_KNEE_ORDERING_JOINT_2D jointSweep/inversionContour/pinnedDistance; imp-95646 viz page)',
      ticket: 'imp-95646',
      pedagogicalStep: 160,
      honestCeiling:
        'Presentation/measurement only: re-implements the imp-95617 kernel standalone at a denser render-friendly grid resolution (no re-derivation, no fresh term); a sensitivity diagnostic on the imp-95582 F3 transition-before-knee ordering, not an RH bound; changes no bound, establishes no operator positivity, no RH claim; Platt-Trudgian Lambda <= 0.2 remains SOTA; NO QED.',
    }),
    Object.freeze({
      route: '/viz-imp95647-condition-number',
      title: 'Alternating-Form Condition Number kappa(delta) vs the delta* Float Trap',
      oneLine:
        'Semilog chart of the imp-95621 summation condition number kappa(delta) ~ (1/2) exp(pi^2/delta) and the measured alternating-form relative error vs delta, crossing the 1 percent line at delta* ~ 0.307 (ratio ~1.36), with the ln 1.3 (trapped) and ln 2 (clean) sampled points marked.',
      mathBucket: 'measurement',
      dataModule: 'src/data/imp-95647-condition-number-viz-data.js',
      paperSourcePath:
        'src/data/imp-95621-alt-form-precision-threshold.js (IMP95621_ALT_FORM_PRECISION_THRESHOLD derivation; imp-95647 viz page)',
      ticket: 'imp-95647',
      pedagogicalStep: 161,
      honestCeiling:
        'Presentation/measurement only: re-implements the imp-95621 condition-number kernel standalone at a denser render-friendly delta grid (no re-derivation, no fresh term); a numerical precision diagnostic for the theta-dual mandate, not an RH bound; changes no bound, establishes no operator positivity, no RH claim; Platt-Trudgian Lambda <= 0.2 remains SOTA; NO QED.',
    }),
    Object.freeze({
      route: '/viz-imp95731-number-variance-ratio',
      title: 'Number-Variance Ratio r(T) vs Height and the Window-Reach Gap',
      oneLine:
        'Chart of the imp-95710 finite-height pointwise-variance/GUE number-variance ratio r(T) over the six measured heights T=1e4..5e5 (band [0.349,0.480], mean 0.402), with the GUE asymptote r=1 and a marked ~6.8-decade unmeasured gap out to the imp-95519 window bottom T=3.0e12.',
      mathBucket: 'measurement',
      dataModule: 'src/data/imp-95710-number-variance-ratio-vs-height.js',
      paperSourcePath:
        'src/data/imp-95710-number-variance-ratio-vs-height.js (IMP95710_NUMBER_VARIANCE_RATIO_VS_HEIGHT tabulation; imp-95731 viz page)',
      ticket: 'imp-95731',
      pedagogicalStep: 168,
      honestCeiling:
        'Presentation/measurement only: re-plots the frozen imp-95710 tabulation verbatim (no re-derivation, no fresh term); the conservatism r<1 is established only across the measured window, and the extrapolation to the imp-95519 window bottom is a named, unmeasured sub-gap; changes no bound, establishes no operator positivity, no RH claim; Platt-Trudgian Lambda <= 0.2 remains SOTA; NO QED.',
    }),
    Object.freeze({
      route: '/viz-imp95752-finite80-bias-heatmap',
      title: 'Finite-80 Block-Toeplitz Bias Heatmap over the Full (delta, rho) Grid',
      oneLine:
        'Heatmap of the imp-95723 finite-80 twin-pair block-floor bias F_finite80/F_inf-1 across the full four-delta by nine-rho grid, falling from ~7.27% at the smallest resolved cross-pair gap toward 0% as D grows, with the five float64-unresolvable lower-left cells flagged.',
      mathBucket: 'measurement',
      dataModule: 'src/data/imp-95752-finite80-bias-heatmap-viz-data.js',
      paperSourcePath:
        'src/data/imp-95723-twin-pair-block-floor-full-grid-bias.js (IMP95723_TWIN_PAIR_BLOCK_FLOOR_FULL_GRID_BIAS grid; imp-95752 viz page)',
      ticket: 'imp-95752',
      pedagogicalStep: 169,
      honestCeiling:
        'Presentation/measurement only: reshapes the frozen imp-95723 grid verbatim (no re-derivation, no fresh term); derivation + numerical witness of an already-established interior mechanism; changes no bound, establishes no operator positivity, no RH claim; Platt-Trudgian Lambda <= 0.2 remains SOTA; NO QED.',
    }),
    Object.freeze({
      route: '/viz-imp95753-crossover-height-window',
      title: 'Common-RvM-Height Dead Zone: Crossover vs Conservatism Window',
      oneLine:
        'Log-T axis placing the imp-95710 measured conservatism top (T=5e5), the imp-3444 E_coll=E_trunc crossover (T0~1.14e9), and the imp-95519 verified-height window bottom (T=3.0e12), showing the crossover landing near the log-midpoint of the ~6.78-decade unmeasured gap between them.',
      mathBucket: 'measurement',
      dataModule: 'src/data/imp-95753-crossover-height-window-viz-data.js',
      paperSourcePath:
        'src/data/imp-95729-crossover-height-vs-variance-window.js (IMP95729_CROSSOVER_HEIGHT_VS_VARIANCE_WINDOW placement; imp-95753 viz page)',
      ticket: 'imp-95753',
      pedagogicalStep: 170,
      honestCeiling:
        'Presentation/measurement only: reshapes the frozen imp-95729 placement verbatim (no re-derivation, no fresh term); the crossover-vs-conservatism overlap AT the crossover height remains unmeasured (frontier dead zone); changes no bound, establishes no operator positivity, no RH claim; Platt-Trudgian Lambda <= 0.2 remains SOTA; NO QED.',
    }),
    Object.freeze({
      route: '/viz-imp95754-cf-wedge-depth-vs-multiplier',
      title: 'Transition-Before-Knee Wedge Depth vs the C_F Multiplier',
      oneLine:
        'Log-x curve of the imp-95617/imp-95691/imp-95721 box-min gap minGap deepening monotonically from -0.004682 (nominal cf=1) to -0.171451 (~36.6x) as the honest C_F provenance multiplier cf rises from 1x to the imp-95721 density-weighted 8.6x physical-cutoff band, at the fixed (C_C 0.5x, E_trunc 1.5x) wedge corner.',
      mathBucket: 'measurement',
      dataModule: 'src/data/imp-95754-cf-wedge-depth-vs-multiplier-viz-data.js',
      paperSourcePath:
        'src/data/imp-95617-transition-knee-ordering-joint-2d.js, imp-95691-cf-band-hi-pinned-wedge-opening.js, imp-95721-cf-alpha-weight-density-pinned.js (baked box-min gap landmarks; imp-95754 viz page)',
      ticket: 'imp-95754',
      alsoFulfills: ['imp-95719'],
      pedagogicalStep: 171,
      honestCeiling:
        'Presentation/measurement only: reshapes the frozen imp-95617/imp-95691/imp-95721 box-min gap values verbatim (no re-derivation, no fresh term); does not tame or bound the wedge, only visualizes its monotone deepening; changes no bound, establishes no operator positivity, no RH claim; Platt-Trudgian Lambda <= 0.2 remains SOTA; NO QED.',
    }),
    Object.freeze({
      route: '/viz-imp95759-msq-pointwise-wall',
      title: 'Mean-Square-vs-Pointwise Wall: Two Faces of One Object',
      oneLine:
        'Two panels reshaping the imp-95728 wall assembly: the variance ratio r(T) flat near 0.402 in band [0.349,0.480] across T=1e4..5e5 (no trend toward the GUE value 1), and the additive worst-window excess maxExcess/L decaying like 1/L (2.18e-2 -> 1.79e-3, log-log slope near -1) -- the scale-invariant wall shown as a single visual object.',
      mathBucket: 'measurement',
      dataModule: 'src/data/imp-95759-msq-pointwise-wall-viz-data.js',
      paperSourcePath:
        'src/data/imp-95728-meansquare-pointwise-gap-wall.js (IMP95728_MEANSQUARE_POINTWISE_GAP_WALL rows; imp-95759 viz page)',
      ticket: 'imp-95759',
      pedagogicalStep: 172,
      honestCeiling:
        'Presentation/measurement only: reshapes the frozen imp-95728 rows verbatim (no re-derivation, no fresh term); does not close the mean-square-vs-pointwise gap, only visualizes its two measured faces; changes no bound, establishes no operator positivity, no RH claim; Platt-Trudgian Lambda <= 0.2 remains SOTA; NO QED.',
    }),
    Object.freeze({
      route: '/viz-imp95548-per-prime-sbar-budget',
      title: 'Per-Prime S-bar Budget: the l2-Collapse Route vs R_ex = 0.2797',
      oneLine:
        'Bar chart of the perm-arch section 5(i) S-bar_p weld strength across the 25 primes p<=97 (caveatP2-corrected p=2 term 0.397), overlaid with the running cumulative sqrt-sum against the R_ex=0.27968819555261474 l2-collapse budget line, showing the crossover happens at the very first prime.',
      mathBucket: 'measurement',
      dataModule: 'src/data/imp-95548-per-prime-sbar-budget-viz-data.js',
      paperSourcePath:
        'src/data/perm-arch-sieve-universality-no-go-2026-09-22.js (PERM_ARCH_SIEVE_UNIVERSALITY smallPrimeClosure/perPrimeMeasurement; imp-95548 viz page)',
      ticket: 'imp-95548',
      pedagogicalStep: 162,
      honestCeiling:
        'Presentation/measurement only: re-plots the perm-arch smallPrimeClosure/perPrimeMeasurement literals verbatim (no re-derivation, no fresh term); illustrates the section 5(i) l2-collapse over-budget picture, proves nothing beyond what perm-arch-sieve-universality-no-go-2026-09-22 already states; changes no bound, establishes no operator positivity, no RH claim; Platt-Trudgian Lambda <= 0.2 remains SOTA; NO QED.',
    }),
    Object.freeze({
      route: '/viz-imp95549-ns-rigid-pencil-eigenvalue',
      title: 'NS-RIGID Dichotomy: P_S(eps) Smallest Eigenvalue vs Backward-Flow eps',
      oneLine:
        'Log-log chart of lam_min(P_S(eps); G) for the imp-95530 THEOREM NS-RIGID (A4)(i) Caratheodory-Pick pencil on node set S={1.5,2.5,4.5}, staying strictly positive from eps=1e-12 to eps=100, against the dashed 1.15e-11 Lehmer-pair collision threshold.',
      mathBucket: 'measurement',
      dataModule: 'src/data/imp-95549-ns-rigid-pencil-eigenvalue-viz-data.js',
      paperSourcePath:
        'src/data/imp-95530-native-span-arithmetic-input-rigidity.js (flowedPickPencilMin; THEOREM NS-RIGID A4(i); imp-95549 viz page)',
      ticket: 'imp-95549',
      pedagogicalStep: 163,
      honestCeiling:
        'Presentation/measurement only: recomputes flowedPickPencilMin from imp-95530 on a log-spaced eps grid and bakes the result as literals (no re-derivation, no fresh term); illustrates the A4(i) flow-stable-witness dichotomy, proves nothing beyond what imp-95530 already states; changes no bound, establishes no operator positivity, no RH claim; Platt-Trudgian Lambda <= 0.2 remains SOTA; NO QED.',
    }),
    Object.freeze({
      route: '/viz-imp95567-doubly-exponential-height-ceiling',
      title: 'RES-T Doubly-Exponential Detectable-Height Ceiling',
      oneLine:
        'Chart of ln E(T,delta) = ln ln(H_ceil(T,delta)/2pi) vs support T for the imp-95533/imp-95559 LEMMA RES-T (L4) ceiling H_ceil = 2pi exp(delta^2 S(T delta)^4 T^3), across delta = 0.1/0.25/0.5, with the edge-displacement first-exclusion T_X band [3.882, 4.147] over the verified-zero window X in [3e12, 1.9e16] shaded.',
      mathBucket: 'measurement',
      dataModule: 'src/data/imp-95567-height-ceiling-viz-data.js',
      paperSourcePath:
        'src/data/imp-95533-res-t-standalone-lemma.js (LEMMA RES-T L1-L4); src/data/imp-95559-res-t-moment-refined.js (refined (L4) ceiling table + T_X literals; imp-95567 viz page)',
      ticket: 'imp-95567',
      pedagogicalStep: 164,
      honestCeiling:
        'Presentation/measurement only: re-implements the imp-95533/imp-95559 ceiling kernel standalone at a denser render-friendly (T, delta) grid (no re-derivation, no fresh term); illustrates the (L4) doubly-exponential detectable-height law, proves nothing beyond what imp-95533/imp-95559 already state; supplies no T > T_X existence proof; changes no bound, establishes no operator positivity, no RH claim; Platt-Trudgian Lambda <= 0.2 remains SOTA; NO QED.',
    }),
    Object.freeze({
      route: '/viz-imp95770-barrier-mollifier-length-ceiling',
      title: 'Barrier Mollifier-Length Ceiling vs Verified Height',
      oneLine:
        'Chart of the barrier-mollifier-length-ceiling-2026-09 Wiener-algebra ceiling Lambda_ceil(X) = min(1, gamma*||A/B||) across four verified-height rungs (N = 690,988 / 1.5M / 2.0M / 6.0M), marking the current Lambda_ceil(6.0e12) ~ 0.154 point and the X where the curve crosses the 0.145 and 0.14 targets.',
      mathBucket: 'measurement',
      dataModule: 'src/data/imp-95770-barrier-mollifier-length-ceiling-viz-data.js',
      paperSourcePath:
        'src/data/barrier-mollifier-length-ceiling-2026-09.js (CEILING_HEIGHT_Y0, CROSSING_PIN_Y0; imp-95770 viz page)',
      ticket: 'imp-95770',
      pedagogicalStep: 184,
      honestCeiling:
        'Presentation/measurement only: reuses the baked CEILING_HEIGHT_Y0 literals from barrier-mollifier-length-ceiling-2026-09.js and re-runs its own bracket-crossing interpolation across four height rungs (no re-derivation, no fresh term); illustrates that a longer mollifier cannot beat the fixed-height Wiener-algebra ceiling, proves nothing beyond what that module already states; changes no bound, establishes no operator positivity, no RH claim; Platt-Trudgian Lambda <= 0.2 remains SOTA; the 0.1758354 candidate remains unrefereed; NO QED.',
    }),
    Object.freeze({
      route: '/viz-imp95771-q0-signal-vs-const-sector',
      title: 'Q0 m-Signal vs. m-Free Const Sector',
      oneLine:
        'Two-panel chart contrasting the imp-95746 Q_0 zeta(3) sector (a genuine ~4.15e-5 m-signal across m=18..21) against the m-free const sector (pinned at exactly 3/2, zero spread) that alone carries the imp-95745 pure-rational +4 offset.',
      mathBucket: 'measurement',
      dataModule: 'src/data/imp-95771-q0-signal-vs-const-sector-viz-data.js',
      paperSourcePath:
        'src/data/imp-95746-sun-prop63-plus4-offset-four-moduli.js (PER_MODULUS / mFreeSector literals; imp-95771 viz page)',
      ticket: 'imp-95771',
      pedagogicalStep: 185,
      honestCeiling:
        'Presentation/measurement only: reuses the baked PER_MODULUS / mFreeSector literals from imp-95746 and reshapes them into two plottable per-modulus series (no re-derivation, no fresh term); illustrates the sector split visually, proves nothing beyond what imp-95746/imp-95745 already state; changes no bound, establishes no operator positivity, no RH claim; Catalan G irrationality OPEN; Platt-Trudgian Lambda <= 0.2 remains SOTA; Sun arXiv:2609.04176 remains single-author, unrefereed; NO QED.',
    }),
    Object.freeze({
      route: '/viz-imp95587-legb-straddle-vs-ratio',
      title: 'LEG B DELTA_A Straddle vs. the Direct Ratio Inequality',
      oneLine:
        'Number-line panels comparing the imp-95561 real port-window (3,1) DELTA_A = A_m - A_p eigenpair {-0.01627, +0.09510} straddling zero (Loewner sandwich inconclusive) against the two direct generalized-pencil eigenvalues lambda_max(A_p,B_p) = 0.03933 <= lambda_max(A_m,B_m) = 0.70768 (ratio inequality holds).',
      mathBucket: 'measurement',
      dataModule: 'src/data/imp-95587-legb-straddle-vs-ratio-viz-data.js',
      paperSourcePath:
        'src/data/imp-95561-legb-d2-indefinite-straddle-witness.js (record IMP95561_LEGB_D2_INDEFINITE_STRADDLE_WITNESS.portWindow_3_1; imp-95587 viz page)',
      ticket: 'imp-95587',
      pedagogicalStep: 165,
      honestCeiling:
        'Presentation only: renders the imp-95561 baked port-window (3,1) DELTA_A eigenpair and direct-pencil eigenvalues verbatim (no re-derivation); illustrates imp-95537 D2 witness-completeness at a single fixed window, proves nothing beyond what imp-95561 already states; changes no bound, establishes no operator positivity, no RH claim; Platt-Trudgian Lambda <= 0.2 remains SOTA; NO QED.',
    }),
    Object.freeze({
      route: '/viz-imp95588-msq-gue-envelope',
      title: 'Discrepancy D = C - E vs the GUE Number-Variance Envelope',
      oneLine:
        'Grouped-bar chart of the imp-95562 measured pointwise-vs-mean-square discrepancy sd(D) against the Dyson-Mehta GUE number-variance prediction across the six sample heights T_c = 1e4..5e5, showing the measured fluctuation sits well below the GUE envelope.',
      mathBucket: 'measurement',
      dataModule: 'src/data/imp-95562-meansquare-vs-pointwise-gap.js',
      paperSourcePath:
        'src/data/imp-95562-meansquare-vs-pointwise-gap.js (record IMP95562_MEANSQUARE_VS_POINTWISE_GAP.rows; imp-95588 viz page)',
      ticket: 'imp-95588',
      pedagogicalStep: 166,
      honestCeiling:
        'Presentation only: renders the imp-95562 baked discrepancy/GUE statistics measured over the actual Odlyzko zeros verbatim (no re-derivation); illustrates imp-95534 wall (i) at six sample heights, proves nothing beyond what imp-95562 already states; changes no bound, establishes no operator positivity, no RH claim; Platt-Trudgian Lambda <= 0.2 remains SOTA; NO QED.',
    }),
    Object.freeze({
      route: '/viz-imp95589-w-decay-curves',
      title: 'PD-Persistence Window W(S) Decay Curves vs Node Count',
      oneLine:
        'Log-scale line chart of the imp-95557 PD-persistence window W(S) = mu_S(0)/M1 vs node count n for dyadic, arithmetic, and geometric r=1.5 node families, with the Lehmer collision threshold 1.15e-11 drawn as a reference line far below every resolvable curve.',
      mathBucket: 'measurement',
      dataModule: 'src/data/imp-95557-w-decay-scaling.js',
      paperSourcePath:
        'src/data/imp-95557-w-decay-scaling.js (record IMP95557_LITERALS.tables; imp-95589 viz page)',
      ticket: 'imp-95589',
      pedagogicalStep: 167,
      honestCeiling:
        'Presentation only: renders the imp-95557 baked mu_S(0)/M1/W(S) tables verbatim (no re-derivation); illustrates the imp-95531 A5 all-S flow-criticality decay-law measurement, proves nothing beyond what imp-95557 already states; changes no bound, establishes no operator positivity, no RH claim; Platt-Trudgian Lambda <= 0.2 remains SOTA; NO QED.',
    }),
    Object.freeze({
      route: '/viz-imp95668-deficit-fartail-limit',
      title: 'Far-Tail Deficit Invariant: Excess Toward the 1/2 Limit',
      oneLine:
        'Overlays the imp-95638 closed-form finite-N excess D(N) = 1/2 + (ln(u/2pi)-1)/(2u) against the imp-95614 X4 measured plateau (0.5094/0.5085/0.5056/0.5027 at log10 N = 24/44/100/300) and the exact 1/2 asymptote, showing the plateau is the slowly-decaying head of the limit, not a distinct constant.',
      mathBucket: 'measurement',
      dataModule: 'src/data/imp-95668-deficit-fartail-viz-data.js',
      paperSourcePath:
        'src/data/imp-95638-deficit-invariant-fartail-limit.js (IMP95638_DEFICIT_INVARIANT_FARTAIL_LIMIT samples; imp-95668 viz page)',
      ticket: 'imp-95668',
      pedagogicalStep: 173,
      honestCeiling:
        'Presentation/measurement only: reshapes the frozen imp-95638 closed-form excess and imp-95614 measured samples verbatim (no re-derivation, no fresh term); does not establish rigour for the inherited imp-3220/imp-3406 component model, only visualizes its far-tail limit; changes no bound, establishes no operator positivity, no RH claim; Platt-Trudgian Lambda <= 0.2 remains SOTA; NO QED.',
    }),
    Object.freeze({
      route: '/viz-imp95670-physical-band-vs-wedge',
      title: 'Physical Band vs. the Arbitrary-Box Inversion Wedge',
      oneLine:
        'Overlays the arbitrary [0.5x,1.5x]^2 C_C/E_trunc box gap heatmap and gap=0 inversion contour (imp-95646) with the imp-95635 provenance-grounded physical band ([0.577,1.016]x[0.458,1.1]), showing the physical band stays clear of the contour and the imp-95617 wedge is confined to the physically wrong-signed, unreachable corner.',
      mathBucket: 'measurement',
      dataModule: 'src/data/imp-95646-transition-knee-2d-heatmap-viz-data.js',
      paperSourcePath:
        'src/data/imp-95635-physical-bands-vs-inversion-wedge.js (IMP95635_PHYSICAL_BANDS_VS_INVERSION_WEDGE physicalBands/physicalCorner/contourShortfall; imp-95670 viz page)',
      ticket: 'imp-95670',
      pedagogicalStep: 174,
      honestCeiling:
        'Presentation/measurement only: overlays the frozen imp-95646 heatmap/contour and imp-95635 physical-band computations verbatim (no re-derivation, no fresh term); a sensitivity diagnostic on the imp-95582 F3 transition-before-knee ordering, not an RH bound; changes no bound, establishes no operator positivity, no RH claim; Platt-Trudgian Lambda <= 0.2 remains SOTA; NO QED.',
    }),
    Object.freeze({
      route: '/viz-imp95681-eflow-inversion-contour-surface',
      title: 'E_flow Attribution of the Inversion-Contour Wedge',
      oneLine:
        'Side-by-side (C_C, E_trunc) gap heatmaps from imp-95658 on a shared color scale: WITH the E_flow (imp-398) term the imp-95617 wedge inverts (box-min -0.00468); with E_flow zeroed the same corner stays strictly positive (box-min +0.01708) and the gap=0 contour leaves the search window, isolating the wedge to the E_flow term.',
      mathBucket: 'measurement',
      dataModule: 'src/data/imp-95658-eflow-inversion-contour-surface-viz-data.js',
      paperSourcePath:
        'src/data/imp-95658-eflow-inversion-contour-surface-viz-data.js (IMP95658_GAP_SURFACE_WITH_FLOW/_EFLOW_ZERO, contours, headline; imp-95681 viz page)',
      ticket: 'imp-95681',
      pedagogicalStep: 175,
      honestCeiling:
        'Presentation/measurement only: renders the frozen imp-95658 baked literals verbatim (no re-derivation, no fresh term); an attribution diagnostic on the imp-95617 wedge, not an RH bound; changes no bound, establishes no operator positivity, no RH claim; Platt-Trudgian Lambda <= 0.2 remains SOTA; NO QED.',
    }),
    Object.freeze({
      route: '/viz-imp95682-twin-pair-block-floor-rho',
      title: 'Twin-Pair Block Floor F(delta, rho) Monotone Interpolation',
      oneLine:
        'Log10-y chart of the imp-95659 interior tabulation: F, F/A_opt (block advantage) and F/blockIso (retained fraction) vs rho on a shared ~12-order-of-magnitude axis, marking the rho=1 scalar endpoint (1.09x advantage only) and the ~1/2-retention crossing near rho~15.',
      mathBucket: 'measurement',
      dataModule: 'src/data/imp-95682-twin-pair-block-floor-rho-viz-data.js',
      paperSourcePath:
        'src/data/imp-95659-twin-pair-block-floor-rho-tabulation.js (IMP95659_TWIN_PAIR_BLOCK_FLOOR_RHO_TABULATION table; imp-95682 viz page)',
      ticket: 'imp-95682',
      pedagogicalStep: 176,
      honestCeiling:
        'Presentation only: re-plots the frozen imp-95659 tabulation verbatim (no re-derivation, no fresh term); the rho=1 value carries the same finite-size Szego factor as imp-95642 and is not the infinite-lattice infimum; model seam family only; changes no bound, establishes no operator positivity, no RH claim; Platt-Trudgian Lambda <= 0.2 remains SOTA; NO QED.',
    }),
    Object.freeze({
      route: '/viz-imp95790-rcap-deadzone',
      title: 'Number-Variance Cap r_cap(T) Dead-Zone Monotone Descent',
      oneLine:
        'Log10-T chart of the imp-95766 derived envelope r_cap(T) falling monotonically from 0.4322 at the direct-measurement ceiling through 0.3237 at the imp-95729 crossover to 0.2599 at the imp-95519 window bottom, with the (1-r_cap) margin-below-one band shaded.',
      mathBucket: 'measurement',
      dataModule: 'src/data/imp-95790-rcap-deadzone-viz-data.js',
      paperSourcePath:
        'src/data/imp-95766-number-variance-cap-crossover-deadzone.js (IMP95766_NUMBER_VARIANCE_CAP_CROSSOVER_DEADZONE deadZoneRows; imp-95790 viz page)',
      ticket: 'imp-95790',
      pedagogicalStep: 177,
      honestCeiling:
        'Presentation only: re-plots the frozen imp-95766 dead-zone measurement verbatim (no re-derivation, no fresh term); r_cap(T) is a derived upper envelope, not the true pointwise ratio r(T); changes no bound, establishes no operator positivity, no RH claim; Platt-Trudgian Lambda <= 0.2 remains SOTA; NO QED.',
    }),
    Object.freeze({
      route: '/viz-imp95886-decade-reach-ledger',
      title: 'Intermediate-Ordinate-Table Decade Reach Ledger',
      oneLine:
        'Log10-N chart of the imp-95863 RvM-asymptotic decade ledger: decades bought (rising) vs decades still remaining (falling) to the imp-95519 window bottom T=3.0e12, from the in-repo N=1e6 ceiling (0.0 decades bought) up to N~1.2362e13 (window bottom reached).',
      mathBucket: 'measurement',
      dataModule: 'src/data/imp-95886-decade-reach-ledger-viz-data.js',
      paperSourcePath:
        'src/data/imp-95863-intermediate-ordinate-table-reach-ledger.js (LEDGER rows; imp-95886 viz page)',
      ticket: 'imp-95886',
      pedagogicalStep: 178.5,
      honestCeiling:
        'Presentation only: re-plots the frozen imp-95863 decade ledger verbatim (no re-derivation, no fresh RvM inversion); rows above N=1e6 are asymptotic estimates, not verified ordinates, and no cataloged in-repo source buys any decades; changes no bound, establishes no operator positivity, no RH claim; Platt-Trudgian Lambda <= 0.2 remains SOTA; NO QED.',
    }),
    Object.freeze({
      route: '/viz-imp95997-ufit-ledger',
      title: 'u_fit Cross-Validation Ledger: A-Floor vs Crossing-Constant Observables at ln 1.25',
      oneLine:
        'Standing ledger table for the imp-95963 non-conflation finding: the ln 1.25 imp-95895 A_opt scalar-floor u_fit_rel (+0.0846%) and imp-95939 crossing-constant u_fit_rel (-0.7363%) are two distinct observables differing in scale by ~1.4e19, so mixing them onto the imp-95885 FINDING A reach-vs-conditioning ordering axis is a conflation artifact.',
      mathBucket: 'measurement',
      dataModule: 'src/data/imp-95963-ln125-crossing-vs-floor-ufit-retabulation.js',
      paperSourcePath:
        'src/data/imp-95963-ln125-crossing-vs-floor-ufit-retabulation.js (ln125TwoObservables, aFloorRows; imp-95997 viz page)',
      ticket: 'imp-95997',
      pedagogicalStep: 178.65,
      honestCeiling:
        'Presentation only: re-tabulates the frozen imp-95963 retabulation verbatim (no re-derivation, no fresh extrapolation); changes no bound, establishes no operator positivity, no RH claim; Platt-Trudgian Lambda <= 0.2 remains SOTA; NO QED.',
    }),
    Object.freeze({
      route: '/viz-imp95887-szego-dd-toeplitz-chain',
      title: 'Szego / DD-Toeplitz Chain: C(delta) Crosscheck and Per-Delta Reach',
      oneLine:
        'Renders the imp-95743 double-double Szego edge-coefficient C(delta)=pi^2/(2 delta^2) crosscheck (DD fit tracks the law where the float64 fit breaks at ln 1.3) alongside the imp-95885 per-delta reach/conditioning comparison across ln1.2/ln1.25/ln1.3, closing the imp-95778 page-reachability residual.',
      mathBucket: 'measurement',
      dataModule: 'src/data/imp-95887-szego-dd-toeplitz-chain-viz-data.js',
      paperSourcePath:
        'src/data/imp-95743-szego-coefficient-double-double-crosscheck.js, src/data/imp-95885-per-delta-ufit-comparison-table.js (imp-95887 viz page)',
      ticket: 'imp-95887',
      pedagogicalStep: 178.6,
      honestCeiling:
        'Presentation only: re-plots the frozen imp-95743 and imp-95885 modules verbatim (no re-derivation, no fresh eigensolve); both certified DD-vs-dual intervals contain zero (consistent with agreement, not a separation); changes no bound, establishes no operator positivity, no RH claim; Platt-Trudgian Lambda <= 0.2 remains SOTA; NO QED.',
    }),
    Object.freeze({
      route: '/viz-imp95888-rcap-window-bottom',
      title: 'Number-Variance Ratio Cap r_cap(T): Window-Bottom Envelope',
      oneLine:
        'Log10-T chart of the imp-95722 derived r_cap(T) envelope bridging the ~6.78-decade gap from the imp-95710 measured ceiling T=5e5 (r_cap=0.4359) to the imp-95519 window bottom T=3.0e12 (r_cap=0.2599), the only in-repo lever that reaches that far.',
      mathBucket: 'measurement',
      dataModule: 'src/data/imp-95888-rcap-window-bottom-viz-data.js',
      paperSourcePath:
        'src/data/imp-95722-number-variance-ratio-window-bottom-bound.js (rows, windowBottom; imp-95888 viz page)',
      ticket: 'imp-95888',
      pedagogicalStep: 178.7,
      honestCeiling:
        'Presentation only: re-plots the frozen imp-95722 envelope verbatim (no re-derivation, no fresh measurement); the fine grid above the measured ceiling is the closed form evaluated for chart resolution, not new data; changes no bound, establishes no operator positivity, no RH claim; Platt-Trudgian Lambda <= 0.2 remains SOTA; NO QED.',
    }),
    Object.freeze({
      route: '/viz-imp95971-crossing-height-map',
      title: 'Crossing-Height Map T_x(a_0): Double-Exponential Sensitivity',
      oneLine:
        'Log10(T_x) vs a_0 chart of the imp-95940 closed form T_x(a_0) = 2pi exp(exp(2pi^2 C0 - 2(gamma+1+a_0))), showing why the empirical a_0 spread ~1.18 sweeps the imp-95921 crossing height across ~40 orders of magnitude (d ln T_x/d a_0 ~ -78).',
      mathBucket: 'measurement',
      dataModule: 'src/data/imp-95971-crossing-height-map-viz-data.js',
      paperSourcePath:
        'src/data/imp-95940-arithmetic-intercept-a0-obstruction.js (crossingSensitivity, a0Empirical; imp-95971 viz page)',
      ticket: 'imp-95971',
      pedagogicalStep: 178.8,
      honestCeiling:
        'Presentation only: re-plots the frozen imp-95940 closed form verbatim over its own empirical a_0 range (no re-derivation, no new bound); a_0 is NOT pinned to a point; establishes no operator positivity, no RH claim; Platt-Trudgian Lambda <= 0.2 remains SOTA; NO QED.',
    }),
    Object.freeze({
      route: '/viz-imp95791-biaspct-vs-rho',
      title: 'Twin-Pair Finite-Size biasPct vs rho at delta=ln1.2',
      oneLine:
        'Bar chart + table of the imp-95762 DD-primal vs imp-95744 dual F_inf finite-size bias at delta=ln1.2 across rho in {2, 1.5, 1}: 15.12% -> 25.26% -> 51.63% at the deep corner rho=1.',
      mathBucket: 'measurement',
      dataModule: 'src/data/imp-95762-twin-pair-block-floor-finite80-dd-eigensolver.js',
      paperSourcePath:
        'src/data/imp-95762-twin-pair-block-floor-finite80-dd-eigensolver.js (cells); src/data/imp-95744-twin-pair-block-floor-belowprec-dd-resolve.js (F_inf dual floor); imp-95791 viz page',
      ticket: 'imp-95791',
      pedagogicalStep: 178,
      honestCeiling:
        'Presentation only: re-plots the frozen imp-95762 / imp-95744 literals verbatim (no re-derivation, no fresh term); an independent numerical cross-check of an established interior quantity, not an RH bound; changes no bound, establishes no operator positivity, no RH claim; Platt-Trudgian Lambda <= 0.2 remains SOTA; NO QED.',
    }),
    Object.freeze({
      route: '/viz-imp95792-di-zigzag',
      title: 'Four-Moduli dI Zigzag Band',
      oneLine:
        'Zigzag chart + table of the imp-95765 four-moduli dI(1/m) at m=18,19,20,21: a 4.146e-5-wide band (~4.15e4x the 1e-9 quadrature floor) with non-monotone consecutive-difference signs (-,+,-).',
      mathBucket: 'measurement',
      dataModule: 'src/data/imp-95765-di-variation-four-moduli.js',
      paperSourcePath:
        'src/data/imp-95765-di-variation-four-moduli.js (DI_VARIATION_FOUR_MODULI diTable/variation); imp-95792 viz page',
      ticket: 'imp-95792',
      pedagogicalStep: 179,
      honestCeiling:
        'Presentation only: re-plots the frozen imp-95765 four-point dI table verbatim (no new quadrature); conditional on the +4 offset hypothesis (verified only at m=20); four conditional points, not four certified anchors; changes no bound, establishes no operator positivity, no RH claim; Platt-Trudgian Lambda <= 0.2 remains SOTA; NO QED.',
    }),
    Object.freeze({
      route: '/viz-imp95688-vk-crossover-height-gap',
      title: 'VK-vs-Window Height Gap: Barrier Window Top vs the Ford VK Crossover',
      oneLine:
        'Log10(T) axis placing the imp-95519 barrier window top (T=1.9e16) against the Ford Vinogradov-Korobov / classical zero-free-region crossover (log t~10242.24), showing a ~4431.87-decade separation -- VK offers zero unconditional saving anywhere in the window.',
      mathBucket: 'measurement',
      dataModule: 'src/data/imp-95688-vk-crossover-height-gap-viz-data.js',
      paperSourcePath:
        'src/data/imp-95632-vk-crossover-height-gap.js (IMP_95632_VK_CROSSOVER_HEIGHT_GAP; imp-95688 viz page)',
      ticket: 'imp-95688',
      pedagogicalStep: 180,
      honestCeiling:
        'Presentation/measurement only: reshapes the frozen imp-95632 gap verbatim (no re-derivation, no fresh term); the raw crossover height overflows IEEE-754 double and is carried in log space only; changes no bound, establishes no operator positivity, no RH claim; Platt-Trudgian Lambda <= 0.2 remains SOTA; NO QED.',
    }),
    Object.freeze({
      route: '/viz-imp95697-szego-finite-size-decay',
      title: 'Rho=1 Finite-Size Szego Decay: F/A_opt vs Point Count',
      oneLine:
        'Chart of the imp-95677 rho=1 tabulation: F/A_opt falling monotonically 1.143->1.101->1.010->0.909 as the uniform-lattice point count doubles (80/160/320/640), crossing the infinite-lattice value 1 near nPairs=160, with the float64 cancellation-noise band lmin/(lmax*eps) shaded around each point.',
      mathBucket: 'measurement',
      dataModule: 'src/data/imp-95697-szego-finite-size-decay-viz-data.js',
      paperSourcePath:
        'src/data/imp-95677-rho1-szego-finite-size-convergence.js (IMP95677_RHO1_SZEGO_FINITE_SIZE_CONVERGENCE table; imp-95697 viz page)',
      ticket: 'imp-95697',
      pedagogicalStep: 181,
      honestCeiling:
        'Presentation only: re-plots the frozen imp-95677 tabulation verbatim (no re-derivation, no fresh quadrature); the sub-1 undershoot at 320 pairs is float64 cancellation noise, not a physical drop below the symbol infimum; model seam family only; changes no bound, establishes no operator positivity, no RH claim; Platt-Trudgian Lambda <= 0.2 remains SOTA; NO QED.',
    }),
    Object.freeze({
      route: '/viz-imp95699-cf-band-reachability',
      title: 'C_F Provenance-Band Reachability: cf* vs the Honest Multiplier Band',
      oneLine:
        'Places the honest imp-398 C_F provenance band [~0.995,1.40] (nominal cf=1.0, downward-rigid floor, imp-1134 upward 1.2-1.4x reach) on a multiplier axis against the imp-95660 wedge-closure multiplier cf*=0.839, showing cf* strictly outside (below) the band -- the imp-95617 E_flow inversion wedge is FORECLOSED.',
      mathBucket: 'measurement',
      dataModule: 'src/data/imp-95699-cf-band-reachability-viz-data.js',
      paperSourcePath:
        'src/data/imp-95674-cf-provenance-band-wedge-reachability.js (IMP95674_CF_PROVENANCE_BAND_WEDGE_REACHABILITY honestBand/cfStar/foreclosure; imp-95699 viz page)',
      ticket: 'imp-95699',
      pedagogicalStep: 182,
      honestCeiling:
        'Presentation only: re-plots the frozen imp-95674 provenance-band decision and imp-95660 cf* verbatim (no re-derivation, no fresh term); the component model is the inherited imp-3220/imp-3406 extrapolation, not a rigorous asymptotic; changes no bound, establishes no operator positivity, no RH claim; Platt-Trudgian Lambda <= 0.2 remains SOTA; NO QED.',
    }),
    Object.freeze({
      route: '/viz-imp95737-half-retention-scale',
      title: 'Half-Retention Gap D_cross(delta): Closed Form vs Tabulated',
      oneLine:
        'Delta-axis chart + table comparing the imp-95703 derived closed forms (full-sum seam-symbol root, explicit leading-log form) against the true 40-pair crossover and the imp-95693 tabulated D_cross across ln1.2..ln2.0, all nearly coincident.',
      mathBucket: 'measurement',
      dataModule: 'src/data/imp-95737-half-retention-scale-viz-data.js',
      paperSourcePath:
        'src/data/imp-95703-twin-pair-half-retention-scale-derivation.js (IMP95703_TWIN_PAIR_HALF_RETENTION_SCALE crossoverDerivation; imp-95737 viz page)',
      ticket: 'imp-95737',
      pedagogicalStep: 183,
      honestCeiling:
        'Presentation only: re-plots the frozen imp-95703 derivation verbatim (no re-derivation, no fresh term); derives an already-observed constant of the imp-95659/imp-95693 twin-pair mechanism; model seam family only; changes no bound, establishes no operator positivity, no RH claim; Platt-Trudgian Lambda <= 0.2 remains SOTA; NO QED.',
    }),
    Object.freeze({
      route: '/viz-imp95776-cf-reff-gue-repulsion',
      title: 'GUE Repulsion Regularizes the r_eff Divergence, but Doesn’t Tame It',
      oneLine:
        'Log-cutoff chart of the imp-95747 flat-RvM r_eff diverging (~2.5x per cutoff decade) against the GUE-reweighted r_eff saturating at the cutoff-independent 9.583x, plus the resulting box-min gap deepening from -0.171 to -0.185 at the fixed wedge corner.',
      mathBucket: 'measurement',
      dataModule: 'src/data/imp-95776-cf-reff-gue-viz-data.js',
      paperSourcePath:
        'src/data/imp-95747-cf-reff-gue-repulsion-regularization.js (rEffFlat/rEffGue/boxMinGap literals; imp-95776 viz page)',
      ticket: 'imp-95776',
      pedagogicalStep: 186,
      honestCeiling:
        'Presentation/measurement only: reshapes the frozen imp-95747 r_eff and box-min values verbatim (no re-derivation, no fresh term); the imp-486 C_mb GUE-conditional assumption is reweighted within, not established; changes no bound, establishes no operator positivity, no RH claim; Platt-Trudgian Lambda <= 0.2 remains SOTA; NO QED.',
    }),
    Object.freeze({
      route: '/viz-imp95777-di-share-amplification',
      title: "dI's 40% Share, 100% Drift, 2.484x Amplification",
      oneLine:
        'Stacked-share bar + grouped bar chart from the imp-95724 exact J=3/2+dI split and imp-95749 conditional variation: dI holds ~40% of J but carries 100% of the rho-drift, amplifying its fractional variation 2.484x over J.',
      mathBucket: 'measurement',
      dataModule: 'src/data/imp-95777-di-share-amplification-viz-data.js',
      paperSourcePath:
        'src/data/imp-95724-c-odd-J-variation-magnitude-assessment.js (anchorMagnitude/exactSplit); src/data/imp-95749-di-variation-against-constant-J-null.js (variation); imp-95777 viz page',
      ticket: 'imp-95777',
      pedagogicalStep: 187,
      honestCeiling:
        'Presentation/measurement only: reshapes the frozen imp-95724 / imp-95749 literals verbatim (no re-derivation, no new quadrature); the dI variation is CONDITIONAL on the +4 offset hypothesis, verified only at m=20, not a certified second anchor; changes no bound, establishes no operator positivity, no RH claim; Platt-Trudgian Lambda <= 0.2 remains SOTA; NO QED.',
    }),
    Object.freeze({
      route: '/viz-imp95808-bias-union-heatmap',
      title: 'Twin-Pair Bias Union Heatmap Across Three Deltas',
      oneLine:
        'Heatmap of the imp-95785 13-cell union biasPct table (delta in {ln1.2, ln1.3, ln1.5} x rho) marking the double-double (imp-95762) vs float64 (imp-95707) source of each cell, jointly monotone from 51.63% at the deep corner toward 0%.',
      mathBucket: 'measurement',
      dataModule: 'src/data/imp-95808-twin-pair-bias-union-heatmap-viz-data.js',
      paperSourcePath:
        'src/data/imp-95785-twin-pair-block-bias-union-grid.js (unionTable; imp-95808 viz page)',
      ticket: 'imp-95808',
      pedagogicalStep: 188,
      honestCeiling:
        'Presentation only: re-plots the frozen imp-95785 union table verbatim (no re-derivation, no fresh term); biasPct is an interior model-seam quantity, not an RH bound; the two sources are delta-disjoint so most of the display grid is blank, not zero; changes no bound, establishes no operator positivity, no RH claim; Platt-Trudgian Lambda <= 0.2 remains SOTA; NO QED.',
    }),
    Object.freeze({
      route: '/viz-imp95809-deep-corner-bias-ladder',
      title: 'Deep-Corner Finite-N Bias Convergence Ladder',
      oneLine:
        'Log-log line chart of the imp-95788 N=80,120,160,200 finite-size bias ladder at the deepest twin-pair cell (delta=ln1.2, rho=1), showing biasPct collapsing monotonically 51.63% -> 4.82% toward the fixed imp-95744 dual F_inf.',
      mathBucket: 'measurement',
      dataModule: 'src/data/imp-95809-deep-corner-bias-convergence-ladder-viz-data.js',
      paperSourcePath:
        'src/data/imp-95788-twin-pair-deep-corner-finite-n-bias-convergence.js (ladder; imp-95809 viz page)',
      ticket: 'imp-95809',
      pedagogicalStep: 189,
      honestCeiling:
        'Presentation only: re-plots the frozen imp-95788 N=80..200 bias ladder verbatim (no re-derivation, no fresh DD solve); biasPct is an interior model-seam finite-size diagnostic, not an RH bound; changes no bound, establishes no operator positivity, no RH claim; Platt-Trudgian Lambda <= 0.2 remains SOTA; NO QED.',
    }),
    Object.freeze({
      route: '/viz-imp95810-reach-universality',
      title: 'Szego Reach-Universality Cross-Validation',
      oneLine:
        'Line chart of the imp-95786 relative C_fit error vs reach R=delta(N_max+1) across the four float64-clean deltas (ln1.6/1.5/1.45/1.4), with the sub-1% crossing reaches R* marked for the three cleanly-monotone deltas.',
      mathBucket: 'measurement',
      dataModule: 'src/data/imp-95810-reach-universality-viz-data.js',
      paperSourcePath:
        'src/data/imp-95786-reach-universality-crossval.js (reachTable, crossings; imp-95810 viz page)',
      ticket: 'imp-95810',
      pedagogicalStep: 190,
      honestCeiling:
        'Presentation only: re-plots the frozen imp-95786 reachTable/crossings and imp-95761 ln14PrecisionWall verbatim (no re-derivation, no fresh solve); the reach-universality is an interior model-seam finite-grid diagnostic, not an RH bound; changes no bound, establishes no operator positivity, no RH claim; Platt-Trudgian Lambda <= 0.2 remains SOTA; NO QED.',
    }),
    Object.freeze({
      route: '/viz-imp95828-bracket-cluster',
      title: 'Nine-Height Bracket Cluster Around T=1.5e5: Isolated Spike vs Bracket Mean',
      oneLine:
        'Chart of the imp-95806 nine-height re-measurement bracketing the imp-95710 T=1.5e5 number-variance bump, showing the peak (r=0.4627) strictly above every bracketing height while the immediate neighbours 1.35e5/1.65e5 sit in the baseline band (bracket mean r=0.3547).',
      mathBucket: 'measurement',
      dataModule: 'src/data/imp-95806-number-variance-bracket-1p5e5-bump.js',
      paperSourcePath:
        'src/data/imp-95806-number-variance-bracket-1p5e5-bump.js (IMP95806_NUMBER_VARIANCE_BRACKET_1P5E5_BUMP rows/decision; imp-95828 viz page)',
      ticket: 'imp-95828',
      pedagogicalStep: 191,
      honestCeiling:
        'Presentation/measurement only: re-plots the frozen imp-95806 nine-height tabulation verbatim (no re-derivation, no fresh measurement); confirms the T=1.5e5 bump is a windowing/sampling artifact rather than a genuine finite-height feature, which only deepens the existing r_cap<1 conservatism; changes no bound, establishes no operator positivity, no RH claim; Platt-Trudgian Lambda <= 0.2 remains SOTA; NO QED.',
    }),
    Object.freeze({
      route: '/viz-imp95868-biasn2-widom-fit',
      title: 'biasPct*N^2 Drift Converging to the C_Widom Asymptote',
      oneLine:
        'Log-N chart of the imp-95803 deep-corner biasPct*N^2 ladder (330414 -> 162500 over N=80..500) against the imp-95845 extrapolated P0=C_Widom=146518.83 asymptote and the well-conditioned fit-family band [145019, 147643].',
      mathBucket: 'measurement',
      dataModule: 'src/data/imp-95868-biasn2-widom-fit-viz-data.js',
      paperSourcePath:
        'src/data/imp-95845-deep-corner-biasN2-widom-fit.js (ladder/fits/cWidom literals; imp-95868 viz page)',
      ticket: 'imp-95868',
      pedagogicalStep: 192,
      honestCeiling:
        'Presentation/measurement only: reshapes the frozen imp-95845 fit literals verbatim (no re-derivation, no new least-squares run); the fit-family band is a spread across model orders/windows, not a formal covariance; changes no bound, establishes no operator positivity, no RH claim; Platt-Trudgian Lambda <= 0.2 remains SOTA; NO QED.',
    }),
    Object.freeze({
      route: '/viz-imp95869-two-sided-envelope',
      title: 'Two-Sided Finite-Section Spectral Envelope vs Section Size n',
      oneLine:
        'Chart of lambda_min(G_n) descending to ess-inf f = A_opt and lambda_max(G_n) ascending to ess-sup f = f(0) versus section size n at delta = 3, combining the imp-95825 lower companion and imp-95846 upper companion into one two-sided envelope.',
      mathBucket: 'measurement',
      dataModule: 'src/data/imp-95869-two-sided-envelope-viz-data.js',
      paperSourcePath:
        'src/data/imp-95825-finite-section-positivity-certificate.js, src/data/imp-95846-finite-section-upper-companion-bound.js (A_opt / f(0) constants; imp-95869 viz page)',
      ticket: 'imp-95869',
      pedagogicalStep: 193,
      honestCeiling:
        'Presentation plus light recomputation of the already-verified imp-95825/imp-95846 Rayleigh-quotient method (no new cited input); every n=160 row cross-checked against those frozen certified endpoints; changes no bound, establishes no operator positivity, no RH claim; Platt-Trudgian Lambda <= 0.2 remains SOTA; NO QED.',
    }),
    Object.freeze({
      route: '/viz-imp95914-ufit-comparison-panel',
      title: 'Per-Delta u_fit Comparison Panel',
      oneLine:
        'Renders the imp-95885 three-delta u_fit comparison (A_fit vs dual A_opt, u_fit_rel, u_fit/u_opt, reach, conditioning across ln1.2/ln1.25/ln1.3) as a bar chart and table -- never assembled visually before.',
      mathBucket: 'measurement',
      dataModule: 'src/data/imp-95914-ufit-comparison-panel-viz-data.js',
      paperSourcePath:
        'src/data/imp-95885-per-delta-ufit-comparison-table.js (imp-95914 viz panel)',
      ticket: 'imp-95914',
      pedagogicalStep: 194,
      honestCeiling:
        'Presentation only: re-plots the frozen imp-95885 per-delta comparison verbatim (no re-derivation, no fresh extrapolation run); ln 1.25 carries no u_fit interval (recorded N/A); changes no bound, establishes no operator positivity, no RH claim; Platt-Trudgian Lambda <= 0.2 remains SOTA; NO QED.',
    }),
    Object.freeze({
      route: '/viz-imp95930-c0-offset-envelope',
      title: 'C0 Offset vs log T + r_cap Envelope Band',
      oneLine:
        'Renders the imp-95897 six accessible finite-height offsets (T = 1e4..5e5, interior max C0=0.3338 at 1.5e5) and the resulting r_cap(3e12) min/max envelope band -- never assembled visually before.',
      mathBucket: 'measurement',
      dataModule: 'src/data/imp-95930-c0-offset-envelope-panel-viz-data.js',
      paperSourcePath:
        'src/data/imp-95897-c0-offset-monotonicity-envelope-safety.js (imp-95930 viz panel)',
      ticket: 'imp-95930',
      pedagogicalStep: 195,
      honestCeiling:
        'Presentation only: re-plots the frozen imp-95897 six-offset table and envelope band verbatim (no re-derivation, no fresh measurement); the offset is noise-dominated with an interior max, so monotonicity over [3e12, infinity) is UNDECIDED by this table alone (see imp-95921); changes no bound, establishes no operator positivity, no RH claim; Platt-Trudgian Lambda <= 0.2 remains SOTA; NO QED.',
    }),
    Object.freeze({
      route: '/viz-imp96040-a0-reconcile-panel',
      title: 'Six-Height a_0 Scatter vs Conjectural Line',
      oneLine:
        'Renders the imp-96005 six-height a_0 scatter (T = 1e4..5e5), sample mean +/-SE band, and the imp-95984 conjectural a_0 = -0.176248 (I_F=1) line, annotated with z=0.337 / p~0.736 -- never assembled visually before.',
      mathBucket: 'measurement',
      dataModule: 'src/data/imp-96040-a0-reconcile-panel-viz-data.js',
      paperSourcePath:
        'src/data/imp-96005-a0-published-vs-empirical-reconcile.js (imp-96040 viz panel)',
      ticket: 'imp-96040',
      pedagogicalStep: 207,
      honestCeiling:
        'Presentation only: re-plots the frozen imp-96005 six-height a_0 scatter, mean/SE band and conjectural line verbatim (no re-derivation, no fresh measurement); the gap is 0.337 SE (p~0.736), fully noise-consistent, not a resolved discrepancy; changes no bound, establishes no operator positivity, no RH claim; Platt-Trudgian Lambda <= 0.2 remains SOTA; NO QED.',
    }),
    Object.freeze({
      route: '/viz-imp95931-ln12-descent-ladder',
      title: 'ln 1.2 u_fit_rel Descent Ladder vs the ln 1.3 Target',
      oneLine:
        'Renders the three-rung ln1.2 u_fit_rel descent (imp-95860/imp-95881/imp-95896: 0.54% -> 0.34% -> 0.247% across reach ~182/~511/~948) against the frozen ln1.3 direct target (0.23%) -- never assembled visually before.',
      mathBucket: 'measurement',
      dataModule: 'src/data/imp-95931-ln12-descent-ladder-viz-data.js',
      paperSourcePath:
        'src/data/imp-95896-ln12-past2800-ufit-tightening.js (imp-95931 viz panel)',
      ticket: 'imp-95931',
      pedagogicalStep: 196,
      honestCeiling:
        'Presentation only: re-plots three frozen ln1.2 u_fit_rel measurements verbatim against the frozen ln1.3 target (no re-derivation, no fresh extrapolation run); the final rung (0.247%) is 1.07x looser than the ln1.3 target and has NOT crossed it; changes no bound, establishes no operator positivity, no RH claim; Platt-Trudgian Lambda <= 0.2 remains SOTA; NO QED.',
    }),
    Object.freeze({
      route: '/viz-imp95975-tier13-imbalance-loglog',
      title: 'TIER-1/TIER-3 Imbalance dQ/dm vs midM, Log-Log',
      oneLine:
        'Plots the imp-95925 TIER-1/TIER-3 imbalance |dQ/dm| against midM on log-log axes (tail slope ~-2.95, ~m^-3 decay), flagging the single 41->60 sign wobble as an isolated dip rather than hiding it -- never plotted before.',
      mathBucket: 'measurement',
      dataModule: 'src/data/imp-95975-tier3-imbalance-loglog-viz-data.js',
      paperSourcePath:
        'src/data/imp-95925-tier3-imbalance-largem-sweep.js (imp-95975 viz panel)',
      ticket: 'imp-95975',
      pedagogicalStep: 197,
      honestCeiling:
        'Presentation only: re-plots the frozen imp-95925 seven-interval imbalance sweep verbatim (no re-derivation, no fresh quadrature); the tail fit slope (~-2.95) is a prior offline fit over three points, not a rigorous asymptotic law; changes no bound, establishes no operator positivity, no RH claim; Platt-Trudgian Lambda <= 0.2 remains SOTA; NO QED.',
    }),
    Object.freeze({
      route: '/viz-imp95993-worst-alias-margin',
      title: 'Worst-Alias Collar-Depth Margin vs k',
      oneLine:
        'Plots the imp-95962 worst-alias collar-depth threshold dMin=a_1/mu_ctrl (descending) against the alias seam depth dSeam (ascending) across the four imp-95917 witness windows (3,4)..(11,7), making the growing clearance margin visible -- never plotted before.',
      mathBucket: 'measurement',
      dataModule: 'src/data/imp-95993-worst-alias-margin-viz-data.js',
      paperSourcePath:
        'src/data/imp-95962-worst-alias-collar-depth-threshold.js (imp-95993 viz panel)',
      ticket: 'imp-95993',
      pedagogicalStep: 198,
      honestCeiling:
        'Presentation only: re-plots the frozen imp-95962 four-window threshold table verbatim (no re-derivation); dSeam stands in for the true Section 4.5 turning-point depth, which is imp-95961 leg (i) and STILL OPEN -- if that depth is shallower than dSeam the margins shrink; changes no bound, establishes no operator positivity, no RH claim; Platt-Trudgian Lambda <= 0.2 remains SOTA; NO QED.',
    }),
    Object.freeze({
      route: '/viz-imp95995-vars-constant-decomposition',
      title: 'Var S(T) Constant Decomposition b = M + P2 + K',
      oneLine:
        'Plots the imp-95964 Var S(T) additive-constant decomposition b = M + P2 + K as a stacked bar, contrasting the pinned Mertens M and prime-power sum P2 (O(1e-12), solid) against the unresolved O(1) boundary constant K (hatched, ~100x the O(0.01) tolerance) -- never plotted before.',
      mathBucket: 'measurement',
      dataModule: 'src/data/imp-95995-varS-constant-decomposition-viz-data.js',
      paperSourcePath:
        'src/data/imp-95964-fujii-varS-constant-locate-obstruction.js (imp-95995 viz panel)',
      ticket: 'imp-95995',
      pedagogicalStep: 199,
      honestCeiling:
        'Presentation only: re-plots the frozen imp-95964 decomposition verbatim (no re-derivation, no fresh prime-sieve run); K is backed out from the imp-95940 empirical six-height mean, not derived from a rigorous smoothed explicit-formula computation, so its plotted size is illustrative of the obstruction, not a pinned value; changes no bound, establishes no operator positivity, no RH claim; Platt-Trudgian Lambda <= 0.2 remains SOTA; NO QED.',
    }),
    Object.freeze({
      route: '/viz-imp96075-route-m-vasyunin-dn-ladder',
      title: 'Route M: Vasyunin-Gram NB Distance Ladder and the Zero-Pinned Mellin Residual',
      oneLine:
        'Line chart of the RH Route M exact Vasyunin-Gram Nyman-Beurling distance ratio d_N^2 log N / Sum_rho 1/|rho|^2 across N = 5..500, converging from 1.258 to 0.998 onto the Burnol floor, plus a bar chart of the three baked |1+zeta D_N|^2/(1/4+t^2) residual points (forced to 1 at a zero, median 0.079 and max 0.692 between zeros, normalized by 1/|rho|^2) showing each zero contributes its own 1/|rho|^2 times the 1/log N mollifier resolution width.',
      mathBucket: 'measurement',
      dataModule: 'src/data/imp-96075-route-m-vasyunin-dn-ladder-viz-data.js',
      paperSourcePath:
        'src/data/rh-route-m-nyman-beurling-vasyunin-reciprocity-2026-09-23.js (NB_DISTANCE_LADDER.rows, RECIPROCITY_STRUCTURAL_TEST.mellinResidual; imp-96075 viz page)',
      ticket: 'imp-96075',
      pedagogicalStep: 200,
      honestCeiling:
        'Presentation only: every plotted value is copied verbatim from the rh-route-m NB_DISTANCE_LADDER and RECIPROCITY_STRUCTURAL_TEST.mellinResidual records (no re-derivation, no re-execution of the underlying Gram/Cholesky or quadrature numerics); only the three baked summary points are plotted for the residual, not a fabricated continuous curve; changes no bound, establishes no operator positivity, no RH claim; Platt-Trudgian Lambda <= 0.2 remains SOTA; NO QED.',
    }),
    Object.freeze({
      route: '/viz-imp96080-route-i-symbol-anatomy',
      title: 'Route I: Toeplitz Symbol Anatomy and the mu_max(a) Crossing',
      oneLine:
        'Plots the RH Route I high-resolution pencil map Toeplitz symbol w(t) = 2 theta_prime(t) - m_2(t), sampled directly from the exact closed-form function over t in [0,60] with the archimedean negative window [0,3.597) and six shrinking p=2 resonance windows shaded, plus the mu_max(a; k=0) column of the baked N=128 grid showing the crossing of 1 at a* = 0.56578 past the (ln3)/2 boundary.',
      mathBucket: 'measurement',
      dataModule: 'src/data/imp-96080-route-i-symbol-anatomy-viz-data.js',
      paperSourcePath:
        'src/data/rh-route-i-pencil-highres-map-2026-09-23.js (weilSymbol, PENCIL_HIGHRES_LITERALS.symbol, .gridN128, .crossing; imp-96080 viz page)',
      ticket: 'imp-96080',
      pedagogicalStep: 201,
      honestCeiling:
        'Presentation only: the w(t) curve is a direct evaluation of the source module\'s own exact closed-form weilSymbol (no re-derivation of the underlying Toeplitz forms, no fresh pencil solve); the resonance windows and mu_max(a) grid are copied verbatim from PENCIL_HIGHRES_LITERALS; changes no bound, establishes no operator positivity, no RH claim; Platt-Trudgian Lambda <= 0.2 remains SOTA; NO QED.',
    }),
    Object.freeze({
      route: '/viz-imp96015-fracbelownull-saturation',
      title: 'c_odd Departure Below the Pure-rho^2 Null: Saturation to a Finite Floor',
      oneLine:
        'Plots the imp-95982 fracBelowNull(m) fractional departure across the full imp-95925 eight-modulus grid, showing the even-branch power-law fit (p=1.9608) bending toward a finite ~-1.832e-5 ceiling rather than diverging -- the imp-95966 three-point tabulation was never plotted before.',
      mathBucket: 'measurement',
      dataModule: 'src/data/imp-95982-c-odd-departure-growth-law-saturation.js',
      paperSourcePath:
        'src/data/imp-95982-c-odd-departure-growth-law-saturation.js (DEPARTURE, FIT, DEPARTURE_LIMIT; imp-96015 viz page)',
      ticket: 'imp-96015',
      pedagogicalStep: 202,
      honestCeiling:
        'Presentation only: every plotted point is copied verbatim from the imp-95982 baked departure table and even-branch fit literals (no re-derivation, no fresh quadrature); Q0_RECON is certified only at m=20, so this fits the reconstruction, not a Prop-6.3-certified per-m quantity; changes no bound, establishes no operator positivity, no RH claim; Platt-Trudgian Lambda <= 0.2 remains SOTA; NO QED.',
    }),
    Object.freeze({
      route: '/viz-imp96016-vars-constant-stack',
      title: 'Var S(T) Constant Stack: Fixed Arithmetic Core vs the I_F RH Bracket',
      oneLine:
        'Plots the imp-95984 b = I_F + M + P2 decomposition as a constant stack -- a thin fixed arithmetic-core bar vs the wide I_F pair-correlation bar spanning its (2/3-eps, 2) RH bracket, marks the conjectural I_F=1 point, and compares the induced a_0 = -0.176248 (published) against the imp-95940 empirical mean -0.116.',
      mathBucket: 'measurement',
      dataModule: 'src/data/imp-95984-fujii-varS-constant-literature-locate.js',
      paperSourcePath:
        'src/data/imp-95984-fujii-varS-constant-literature-locate.js (decomposition, unavailableTerm, bValues; imp-96016 viz page)',
      ticket: 'imp-96016',
      pedagogicalStep: 203,
      honestCeiling:
        'Presentation only: every bar and marker is copied verbatim from the imp-95984 baked literature-located literals (Chan Thm 1.1 bracket, Mertens/P2 sums, imp-95940 empirical mean); no re-derivation of the pair-correlation integral, no fresh quadrature; I_F=1 stays conjectural (Montgomery pair correlation); changes no bound, establishes no operator positivity, no RH claim; Platt-Trudgian Lambda <= 0.2 remains SOTA; NO QED.',
    }),
    Object.freeze({
      route: '/viz-imp96115-below-envelope-dip-significance-table',
      title: 'imp-96089: Below-Envelope Dip Significance Verdict (T = 1e4 / 1.5e5 / 3e5)',
      oneLine:
        'Table of the imp-96089 significance verdict for the three imp-96049 below-envelope mean-anchor dips: recovered window count n_w (75/291/411), chi-square crossover (537/79/73194), z-score (0.37/1.92/0.08 sigma), and the resulting SIGNIFICANT (T=1.5e5) vs NOISE (T=1e4, T=3e5) verdict.',
      mathBucket: 'measurement',
      dataModule: 'src/data/imp-96089-mean-anchor-window-count-significance-verdict.js',
      paperSourcePath:
        'src/data/imp-96089-mean-anchor-window-count-significance-verdict.js (rows, belowEnvelopeVerdict, significantHeights; imp-96115 viz page)',
      ticket: 'imp-96115',
      pedagogicalStep: 204,
      honestCeiling:
        'Presentation only: every table cell is copied verbatim from the imp-96089 baked verdict (n_w recovered from the imp-95562 deterministic tiling geometry, crossover and z-score re-derived there); no new measurement or re-derivation here; changes no bound, establishes no operator positivity, no RH claim; Platt-Trudgian Lambda <= 0.2 remains SOTA; NO QED.',
    }),
    Object.freeze({
      route: '/viz-imp96038-route-a-lammin-descent',
      title: 'Route A: Finite-N Reflection-Gram lambda_min(N) Descent',
      oneLine:
        'Plots the rh-route-a-reflection-positivity-primon-gas Pick reflection Gram lambda_min(N) descent (-142.669 at N=0 to -4213.156 at N=1229, p_N=9973) on a log-log axis against a p_N^0.45 reference curve anchored at the final rung, showing the truncated primon gas is never PSD at any finite N.',
      mathBucket: 'measurement',
      dataModule: 'src/data/imp-96038-route-a-reflection-gram-lammin-descent-viz-data.js',
      paperSourcePath:
        'src/data/rh-route-a-reflection-positivity-primon-gas-2026-09-23.js (ROUTE_A_N_LADDER, ROUTE_A_LITERALS.finiteGasLamMin, ROUTE_A_LAMMIN_SCALING; imp-96038 viz page)',
      ticket: 'imp-96038',
      pedagogicalStep: 205,
      honestCeiling:
        'Presentation only: every plotted lambda_min point and the p_N^0.45 reference exponent are copied verbatim from the rh-route-a-reflection-positivity-primon-gas-2026-09-23 baked records (no re-derivation, no fresh Gram solve); the finite-N test REFUTES reflection positivity for the truncated gas, but the infinite-N statement RP<=>Weil positivity<=>RH is an exact equivalence (Lagarias-Pick), not a stronger route; changes no bound, establishes no operator positivity, no RH claim; Platt-Trudgian Lambda <= 0.2 remains SOTA; NO QED.',
    }),
    Object.freeze({
      route: '/viz-imp96039-halfgram-interlacing-census',
      title: 'Route B: Half-Gram vs Classical-Gram Interlacing Census',
      oneLine:
        'Bar-chart census of the Route B Lemma H n=1 half-Gram pencil interlacing failures against the zeta zeros (167/302 intervals up to gamma_300, first violation at gamma_2/gamma_3) versus the far sparser classical Gram-law failure (16/302), plus the imp-96021 height bands showing the violation fraction stays flat near 0.55.',
      mathBucket: 'measurement',
      dataModule: 'src/data/imp-96039-route-b-half-gram-interlacing-census-viz-data.js',
      paperSourcePath:
        'src/data/rh-route-b-arithmetic-freeze-flow-2026-09-23.js (ROUTE_B_FREEZE_FLOW.interlacing halfGram / classicalGram / heightCensus; imp-96039 viz page)',
      ticket: 'imp-96039',
      pedagogicalStep: 206,
      honestCeiling:
        'Presentation only: every census count and height band is copied verbatim from the Route B Lemma H interlacing literals (no re-derivation, no fresh census); interlacing of the n=1 pencil with the zeta zeros presupposes RH (HKO real-rootedness), so this chart establishes no operator positivity and carries no RH claim; changes no bound; Platt-Trudgian Lambda <= 0.2 remains SOTA; NO QED.',
    }),
    Object.freeze({
      route: '/viz-imp96058-fejer-ceiling-floor-ladder',
      title: 'Route J: Fejer Zero-Free-Region Floor Ladder',
      oneLine:
        'Log-x line chart of the RH Route J Fejer ceiling ladder R_floor(n) = 1/c_ceil(n) for trig-polynomial degree n = 2..100, descending monotonically toward the pure-scheme limit R = 5.8284, plus the classical de la Vallee Poussin 3-4-1 marker (R = 34.821) and the Mossinghoff-Trudgian (2015) marker (R = 5.573412) sitting 4.375% below the pure-scheme floor via a different weighting scheme.',
      mathBucket: 'measurement',
      dataModule: 'src/data/imp-96058-fejer-ceiling-floor-ladder-viz-data.js',
      paperSourcePath:
        'src/data/rh-routes-jkl-non-statmech-external-input-hunt-2026-09-23.js (ROUTE_J.fejerCeiling, .fejerLimit, .classical341, .mossinghoffTrudgian2015; imp-96058 viz page)',
      ticket: 'imp-96058',
      pedagogicalStep: 207,
      honestCeiling:
        'Presentation only: every ladder row and marker value is copied verbatim from ROUTE_J (no re-derivation of the Fejer inequality or the c_ceil(n) formula); the c/log t FORM of the zero-free region is unchanged by any weighting scheme, including Mossinghoff-Trudgian\'s tighter constant; changes no bound, establishes no operator positivity, no RH claim; Platt-Trudgian Lambda <= 0.2 remains SOTA; NO QED.',
    }),
    Object.freeze({
      route: '/viz-imp96059-detector-reach-ladder',
      title: 'Route L: CMV Detector Reach Law',
      oneLine:
        'Log-y range-bar chart of the RH Route L CMV detector reach law N_det vs zero height gamma_0: an off-line FE-symmetric quadruple 1/2 +/- delta +/- i*gamma_0 spliced into the exact Herglotz moments is detected (Toeplitz PD fails) at N = 9-14 for zero 1, N = 96-115 for zero 20, and remains undetected through N = 400 for zero 40, plus the resolved-count-vs-N table substantiating the linear-in-N reach ~ gamma_{N/10}.',
      mathBucket: 'measurement',
      dataModule: 'src/data/imp-96059-detector-reach-ladder-viz-data.js',
      paperSourcePath:
        'src/data/rh-routes-jkl-non-statmech-external-input-hunt-2026-09-23.js (ROUTE_L.detector.rows/.law/.reach, ROUTE_L.a20.resolvedFirst40; imp-96059 viz page)',
      ticket: 'imp-96059',
      pedagogicalStep: 208,
      honestCeiling:
        'Presentation only: every detector row, resolved-count row, and law/reach string is copied verbatim from ROUTE_L (no re-derivation of the Levinson-Durbin recursion or the CMV diagonalisation); establishes no operator positivity beyond the already-resolved zeros; changes no bound; Route L stays NOT-A-LEVER (Weil positivity is its completeness step, no external arithmetic input); Platt-Trudgian Lambda <= 0.2 remains SOTA; NO QED.',
    }),
    Object.freeze({
      route: '/viz-imp96060-littlewood-jensen-loss',
      title: 'Route K: Littlewood I(T) vs Jensen-from-Moments Bound',
      oneLine:
        'Log-value line chart of the RH Route K Littlewood integral I(T) vs the first-moment Jensen upper bound J_1(T) for T = 50..500: |I(T)| stays O(1) (even shrinking relative to log T) while J_1(T) grows like (T/2) log log T, widening the loss factor J_1/|I| from 10x at T=50 to 141x at T=200 to 2828x at T=500.',
      mathBucket: 'measurement',
      dataModule: 'src/data/imp-96060-littlewood-jensen-loss-viz-data.js',
      paperSourcePath:
        'src/data/rh-routes-jkl-non-statmech-external-input-hunt-2026-09-23.js (ROUTE_K.littlewoodVsJensen; imp-96060 viz page)',
      ticket: 'imp-96060',
      pedagogicalStep: 209,
      honestCeiling:
        'Presentation only: every I(T), J_1(T), and loss value is copied verbatim from ROUTE_K.littlewoodVsJensen (no re-derivation of the tanh-sinh zero-aware integration or the Jensen inequality); establishes no operator positivity, no RH claim; the wall is Jensen/integration (moments see zeros only through Littlewood\'s integrated lemma), distinct from Weil positivity; changes no bound; Platt-Trudgian Lambda <= 0.2 remains SOTA; NO QED.',
    }),
    Object.freeze({
      route: '/viz-imp96103-route-i-remainder-resonance',
      title: 'Route I: Remainder delta_S(rho) Resonance Structure',
      oneLine:
        'Line chart of the RH Route I semilocal trace remainder delta_S(rho) sampled directly from the exact closed-form function over rho in [0.8,9.2], plus a bar chart of the four baked near-dyadic log spikes at rho = 2^k + 1e-7, k=0..3 (12.15/16.65/22.71/31.70) versus the regular non-dyadic value at rho=3 (0.379) -- over 32x smaller since delta_S has no p=2 resonance there.',
      mathBucket: 'measurement',
      dataModule: 'src/data/imp-96103-route-i-remainder-resonance-viz-data.js',
      paperSourcePath:
        'src/data/rh-route-i-semilocal-sonine-trace-identity-2026-09-23.js (deltaS, ROUTE_I_LITERALS.deltaS; imp-96103 viz page)',
      ticket: 'imp-96103',
      pedagogicalStep: 210,
      honestCeiling:
        'Presentation only: the delta_S(rho) curve and the spike/regular points are direct evaluations of the source module\'s own exact closed-form deltaS(rho) (no re-derivation of the Sonine trace identity, no fresh Galerkin solve); changes no bound, establishes no operator positivity, no RH claim; Platt-Trudgian Lambda <= 0.2 remains SOTA; NO QED.',
    }),
    Object.freeze({
      route: '/viz-imp96120-route-m-burnol-ratio-dense-ladder',
      title: 'Route M: Burnol-Ratio Dense Ladder (N=250..2600)',
      oneLine:
        'Line chart of the RH Route M Burnol-normalized quantity ratio(N) = d_N^2 log N / C_burnol across the ten dense-ladder rungs N=250..2600 against the ratio=1 (RH + simple zeros) target: the ratio stays inside [0.964,1.010] with four sign changes in the successive differences, not tightening toward 1.',
      mathBucket: 'measurement',
      dataModule: 'src/data/imp-96120-route-m-burnol-ratio-dense-ladder-viz-data.js',
      paperSourcePath:
        'src/data/imp-96094-route-m-burnol-ratio-dense-ladder.js (IMP96094_ROWS, IMP96094_VERDICT; imp-96120 viz page)',
      ticket: 'imp-96120',
      pedagogicalStep: 211,
      honestCeiling:
        'Presentation only: every ratio(N) value is copied verbatim from imp-96094\'s own IMP96094_ROWS (no re-derivation of the exact Vasyunin Gram / Cholesky numerics); changes no bound, establishes no operator positivity, no RH claim; Platt-Trudgian Lambda <= 0.2 remains SOTA; NO QED.',
    }),
    Object.freeze({
      route: '/viz-imp96136-route-i-fixed-fraction-panel',
      title: 'Route I: {oo,2,3} Fixed-Fraction Cusp-Allocation Law',
      oneLine:
        'Renders the imp-96110 ten-point {oo,2,3} S-unit table showing the Sonine excess inherits f_out(rho) -> 1 - 1/rho of each log^2 cusp at rho = 2^a 3^b, generalizing (and worsening, via cusp density) the p = 2 half-cusp law -- never assembled visually before.',
      mathBucket: 'measurement',
      dataModule: 'src/data/imp-96136-route-i-fixed-fraction-panel-viz-data.js',
      paperSourcePath:
        'src/data/imp-96110-route-i-p3-cusp-allocation-fixed-fraction-assessment.js (imp-96136 viz panel)',
      ticket: 'imp-96136',
      pedagogicalStep: 212,
      honestCeiling:
        'Presentation only: re-plots the frozen imp-96110 ten-point {oo,2,3} S-unit table verbatim (measured f_out vs target 1 - 1/rho; no re-derivation of the br23 double sum, no fresh numerics); the surviving fixed-fraction law is an obstruction (dense log^2 cusps), not a rescue; corr23 continuity through the cusp is ASSUMED by analogy with p = 2, not proved; changes no bound, establishes no operator positivity, no RH claim; Platt-Trudgian Lambda <= 0.2 remains SOTA; NO QED.',
    }),
    Object.freeze({
      route: '/viz-imp96139-window-robustness-sweep-table',
      title: 'imp-96112: sd(C - E) Window-Robustness Sweep at T = 5e4',
      oneLine:
        'Table of the imp-96112 12-config sweep (half-width k, half-span, box-overlap) of the imp-95562 band() estimator at T=5e4: zero breaches of the imp-95722 max-anchor envelope, with margin ranging +3.6% (finest windows) to +51.4% (narrowest span), showing the imp-96090 +3.0% headline is estimator-specific but the cap sign is robust.',
      mathBucket: 'measurement',
      dataModule: 'src/data/imp-96112-max-anchor-margin-window-robustness.js',
      paperSourcePath:
        'src/data/imp-96112-max-anchor-margin-window-robustness.js (rows, robustness, target; imp-96139 viz page)',
      ticket: 'imp-96139',
      pedagogicalStep: 213,
      honestCeiling:
        'Presentation only: every row is copied verbatim from the imp-96112 baked 12-config sweep (no re-derivation of the band() estimator or the offline quadrature); the +3.0% imp-96090 headline is the tight end of a uniformly-positive family, not a representative central margin; changes no bound, establishes no operator positivity, no RH claim; Platt-Trudgian Lambda <= 0.2 remains SOTA; NO QED.',
    }),
    Object.freeze({
      route: '/viz-imp96212-two-branch-etrunc-obstruction',
      title: 'imp-96190: The Two-Branch E_trunc Obstruction',
      oneLine:
        'Panel of the imp-96190 assessment: the truncation height feeding the Ingham tail has exactly two parameterizations (fixed T_PT, frozen at 3.06e-5, or N-coupled, forced to the moving exponent kappa(H)=(4/3)/log H) and the exact height-cancellation H^-kappa(H)=exp(-4/3)=0.263597 pins the branch-B tail to grow like ~0.4 log H instead of decaying -- neither branch supplies an N-decaying fixed-strip tail.',
      mathBucket: 'measurement',
      dataModule: 'src/data/imp-96190-fixed-strip-n-decaying-tail-obstruction.js',
      paperSourcePath:
        'src/data/imp-96190-fixed-strip-n-decaying-tail-obstruction.js (branches, movingTailTable, heightCancellationIdentity; imp-96212 viz page)',
      ticket: 'imp-96212',
      pedagogicalStep: 215,
      honestCeiling:
        'Presentation only: renders the frozen imp-96190 branch definitions and moving-tail ladder verbatim (no re-derivation of the Ingham density or the height-cancellation identity); this is an assessment/derivation, not a rigorous theorem; changes no bound, establishes no operator positivity, no RH claim; Platt-Trudgian Lambda <= 0.2 remains SOTA; NO QED.',
    }),
    Object.freeze({
      route: '/viz-imp96141-excursion-depth-offset-ledger-table',
      title: 'imp-96108: Excursion-Depth-vs-Max-Anchor Offset Ledger',
      oneLine:
        'Table of the imp-96108 offset-space ledger across 11 measured heights: offset(T), the offset headroom below the max anchor C0_max=0.333721, and the per-height excursion depth d_reach(T) needed to lift the mean cap to the max cap, plus the window-bottom (T=3e12) r_cap_max=0.25987 dead-zone margin 0.740 below 1 -- never tabulated before.',
      mathBucket: 'measurement',
      dataModule: 'src/data/imp-96108-number-variance-excursion-depth-vs-max-anchor.js',
      paperSourcePath:
        'src/data/imp-96108-number-variance-excursion-depth-vs-max-anchor.js (measuredRows, deadZoneBottom; imp-96141 viz page)',
      ticket: 'imp-96141',
      pedagogicalStep: 214,
      honestCeiling:
        'Presentation only: every row is copied verbatim from the imp-96108 baked offset ledger (no re-derivation of the Selberg-subtracted offset or the Odlyzko-fitted sd(C - E) literals); the max anchor is a SAMPLE maximum over 11 finite heights and cannot exclude a deeper unmeasured interior excursion; changes no bound, establishes no operator positivity, no RH claim; Platt-Trudgian Lambda <= 0.2 remains SOTA; NO QED.',
    }),
    Object.freeze({
      route: '/viz-imp96216-route-bd-margin-column-gamma1000-table',
      title: 'imp-96186: Worst-Support On-Line Margin rho(32,T) -- 17-Point Column to gamma_1000',
      oneLine:
        'Table of the full 17-point worst-support on-line margin column (imp-96148 baked + imp-96167 gamma_500 extension + imp-96186 gamma_1000 extension), both re-fit laws, and the floor/R2-gap history showing the fitted floor is non-monotone (0.14256 -> 0.16030 -> 0.11063) and the R2 gap between the two laws collapses at gamma_1000, correcting the imp-96167 "settled asymptote" reading.',
      mathBucket: 'measurement',
      dataModule: 'src/data/imp-96186-route-bd-online-margin-floor-gamma1000.js',
      paperSourcePath:
        'src/data/imp-96186-route-bd-online-margin-floor-gamma1000.js (validation, extendedT/extendedRho, refit; imp-96216 viz page)',
      ticket: 'imp-96216',
      pedagogicalStep: 218,
      honestCeiling:
        'Presentation only: every row and fitted parameter is copied verbatim from the imp-96186 baked column and refit (no re-derivation of the Gilbert min-norm-point LP or the near-collision census); the sign (strictly positive margin, no crossing) is stable but the asymptotic floor and functional form remain undecided by this census depth; changes no bound, establishes no operator positivity, no RH claim; Platt-Trudgian Lambda <= 0.2 remains SOTA; NO QED.',
    }),
    Object.freeze({
      route: '/viz-imp96199-route-bd-margin-column-gamma500-table',
      title: 'imp-96167: Worst-Support On-Line Margin rho(32,T) -- 11-Point Column to gamma_500',
      oneLine:
        'Table of the full 11-point worst-support on-line margin column (imp-96148 baked + imp-96167 gamma_500 extension) and both re-fit laws: log-linear R2=0.96691 vs reciprocal-log-with-floor R2=0.99483, floor 0.16030, with a note that imp-96186 later showed the floor is non-monotone at gamma_1000.',
      mathBucket: 'measurement',
      dataModule: 'src/data/imp-96167-route-bd-online-margin-floor-extended.js',
      paperSourcePath:
        'src/data/imp-96167-route-bd-online-margin-floor-extended.js (validation, extendedT/extendedRho, refit; imp-96199 viz page)',
      ticket: 'imp-96199',
      pedagogicalStep: 226,
      honestCeiling:
        'Presentation only: every row and fitted parameter is copied verbatim from the imp-96167 baked column and refit (no re-derivation of the Gilbert min-norm-point LP or the near-collision census); the imp-96167 "settled positive asymptote" reading was later partly corrected by imp-96186 (floor non-monotone at gamma_1000); changes no bound, establishes no operator positivity, no RH claim; Platt-Trudgian Lambda <= 0.2 remains SOTA; NO QED.',
    }),
    Object.freeze({
      route: '/viz-imp96214-kato-temple-ueps',
      title: 'Route I: Kato-Temple U(eps) on the Real Semilocal {oo,2} Spectrum',
      oneLine:
        'Two line charts of the imp-96188 recalibrated Kato-Temple upper bound U(eps) for a single-mode leak into the adjacent second-largest eigenvalue (certify-threshold eps~8.42e-3) versus the bottom near-modulus-1 twin lam_S(1)=-0.9927022 (certify-threshold eps~1.19e-3, an order of magnitude tighter, and validity itself breaks at eps~0.3245).',
      mathBucket: 'measurement',
      dataModule: 'src/data/imp-96188-route-i-kato-temple-real-spectrum-recalibration.js',
      paperSourcePath:
        'src/data/imp-96188-route-i-kato-temple-real-spectrum-recalibration.js (katoTempleUpperTwoLevel, IMP_96188_LITERALS; imp-96214 viz page)',
      ticket: 'imp-96214',
      pedagogicalStep: 216,
      honestCeiling:
        'Presentation only: both curves are live evaluations of the imp-96188 module\'s own katoTempleUpperTwoLevel on the exact FFT-Mellin semilocal spectrum literals (no re-derivation of the Rayleigh-Ritz eigenvalues or the Kato-Temple gap inequality); the two-level [1, eps] test function models a single-mode leak only, a lower bound on what an actual dyadic-grid ansatz incurs; changes no bound, establishes no operator positivity, no RH claim; Platt-Trudgian Lambda <= 0.2 remains SOTA; NO QED.',
    }),
    Object.freeze({
      route: '/viz-imp96215-ushape-peak-accident',
      title: 'imp-96187: The U-Shape Peak-Ratio 1/sqrt(3) Accident',
      oneLine:
        'Line chart of the imp-96187 N_peak/N_flow ratio across the E_trunc sensitivity sweep (0.25x..16x): the ratio falls monotonically and crosses 1/sqrt(3)=0.57735 near the pinned E_trunc=3.06e-5 with no plateau or fixed point, confirming the imp-96162 proximity is an accident of the inherited constants, not a forced identity.',
      mathBucket: 'measurement',
      dataModule: 'src/data/imp-96187-ushape-peak-ratio-logcorrection-identity-vs-accident.js',
      paperSourcePath:
        'src/data/imp-96187-ushape-peak-ratio-logcorrection-identity-vs-accident.js (IMP96187_USHAPE_PEAK_RATIO_LOGCORRECTION.sensitivity; imp-96215 viz page)',
      ticket: 'imp-96215',
      pedagogicalStep: 217,
      honestCeiling:
        'Presentation only: renders the frozen imp-96187 sensitivity sweep verbatim (no re-derivation of the peak-location formula or the local log-slopes a, b); measurement/derivation only, not a rigorous asymptotic; changes no bound, establishes no operator positivity, no RH claim; Platt-Trudgian Lambda <= 0.2 remains SOTA; NO QED.',
    }),
    Object.freeze({
      route: '/viz-imp96142-decorrelation-safety-margin',
      title: 'Route B/D Robustness: De-Correlation Safety Margin Across the Three Dip Heights',
      oneLine:
        'Log-scale grouped-bar chart of the imp-96109 boundary-sharing estimate rho_boundary vs the critical lag-1 correlation |rho_crit| for the three imp-95562 below-envelope dip heights: only T=1.5e5 has a positive (real) flip threshold, ~285x above rho_boundary=0.00202; the other two heights have negative rho_crit and are unconditionally unpromotable.',
      mathBucket: 'measurement',
      dataModule: 'src/data/imp-96142-decorrelation-safety-margin-viz-data.js',
      paperSourcePath:
        'src/data/imp-96109-tue5-dip-decorrelation-safety-margin.js (rows, significantDip; imp-96142 viz page)',
      ticket: 'imp-96142',
      pedagogicalStep: 219,
      honestCeiling:
        'Presentation only: every rho_boundary, rho_crit, and safety-ratio value is copied verbatim from the imp-96109 baked rows and significantDip block (no re-derivation of the AR-1 de-correlation model or the imp-96071 chi-square crossover); changes no bound, establishes no operator positivity, no RH claim; Platt-Trudgian Lambda <= 0.2 remains SOTA; NO QED.',
    }),
    Object.freeze({
      route: '/viz-imp96236-route-bd-margin-gamma2000',
      title: 'imp-96209: Worst-Support On-Line Margin rho(32,T) -- Full 26-Point Column to gamma_2000',
      oneLine:
        'Log-x chart of the full 26-point imp-96209 worst-support (N=32) on-line signed-force margin column rho(32,T) from gamma_200 to gamma_2000, with both fitted (not re-fit) laws overlaid: the reciprocal-log floor (0.07061, still falling) and the log-linear no-floor law (now the marginally better R2 fit, naive cross T~3.66e5); every observed and fitted value stays strictly above zero.',
      mathBucket: 'measurement',
      dataModule: 'src/data/imp-96236-route-bd-margin-gamma2000-viz-data.js',
      paperSourcePath:
        'src/data/imp-96209-route-bd-online-margin-floor-gamma2000.js (validation/extendedT/extendedRho/refit; imp-96236 viz page)',
      ticket: 'imp-96236',
      pedagogicalStep: 220,
      honestCeiling:
        'Presentation only: the 26-point column and both fit parameters (a, b, c, d) are copied verbatim from the imp-96209 baked fields; only the plotted curve samples are computed here (evaluating the already-fitted formulas, no re-fitting); changes no bound, establishes no operator positivity, no RH claim; Platt-Trudgian Lambda <= 0.2 remains SOTA; NO QED.',
    }),
    Object.freeze({
      route: '/viz-imp96263-route-bd-margin-gamma4000',
      title: 'imp-96224: Worst-Support On-Line Margin rho(32,T) -- Full 34-Point Column to gamma_4000',
      oneLine:
        'Log-x chart of the full 34-point imp-96224 worst-support (N=32) on-line signed-force margin column rho(32,T) from gamma_200 to gamma_4000, with both fitted (not re-fit) laws overlaid: the reciprocal-log floor (0.03411, still falling) and the log-linear no-floor law (now the clearly better R2 fit, naive cross T~4.2e5); every observed and fitted value stays strictly above zero.',
      mathBucket: 'measurement',
      dataModule: 'src/data/imp-96263-route-bd-margin-gamma4000-viz-data.js',
      paperSourcePath:
        'src/data/imp-96224-route-bd-online-margin-floor-gamma4000.js (validation/extendedT/extendedRho/refit; imp-96263 viz page)',
      ticket: 'imp-96263',
      pedagogicalStep: 239,
      honestCeiling:
        'Presentation only: the 34-point column and both fit parameters (a, b, c, d) are copied verbatim from the imp-96224 baked fields; only the plotted curve samples are computed here (evaluating the already-fitted formulas, no re-fitting); changes no bound, establishes no operator positivity, no RH claim; Platt-Trudgian Lambda <= 0.2 remains SOTA; NO QED.',
    }),
    Object.freeze({
      route: '/viz-imp96237-height-to-floor-law',
      title: 'imp-96207: Verified-Height-to-Floor Law H_required(E) = (prefactor/E)^(1/kappa_star)',
      oneLine:
        'Log-log line chart of the imp-96207 height-to-floor law for a certified fixed kappa_star=0.4 (prefactor 3.0): a straight line of slope -2.5 (2.5 height-decades per floor-decade, ~316x per decade) through the three tabulated thresholds (1e-5/1e-6/1e-7), contrasted against the frozen Platt-Trudgian branch-A floor 3.06e-5 at T_PT=3e12.',
      mathBucket: 'measurement',
      dataModule: 'src/data/imp-96237-height-to-floor-viz-data.js',
      paperSourcePath:
        'src/data/imp-96207-verified-height-floor-law-kappa-star.js (anchors/table/sensitivity; imp-96237 viz page)',
      ticket: 'imp-96237',
      pedagogicalStep: 221,
      honestCeiling:
        'Presentation only: the three threshold rows and kappa_star/prefactor/sensitivity anchors are copied verbatim from the imp-96207 baked fields; only the log-log line samples are computed here (evaluating the already-derived law, no re-derivation); changes no bound, establishes no operator positivity, no RH claim; Platt-Trudgian Lambda <= 0.2 remains SOTA; NO QED.',
    }),
    Object.freeze({
      route: '/viz-imp96238-joint-leak-region',
      title: 'imp-96206: Joint (eps_a, eps_b) Kato-Temple Certify Region',
      oneLine:
        'Shaded non-rectangular admissible region on the (eps_a, eps_b) two-leak plane for the imp-96206 3-level Kato-Temple test function, marking the pure-bottom worst case (1.192e-3), the equal-split boundary (1.180627e-3/channel), and the per-channel tightening as the adjacent leak grows.',
      mathBucket: 'measurement',
      dataModule: 'src/data/imp-96238-joint-leak-region-viz-data.js',
      paperSourcePath:
        'src/data/imp-96206-route-i-kato-temple-joint-leak.js (boundary function, coupled slices, literals; imp-96238 viz page)',
      ticket: 'imp-96238',
      pedagogicalStep: 222,
      honestCeiling:
        'Presentation only: the boundary curve re-runs the imp-96206 maxTolerableBottom bisection verbatim at plot resolution (no re-derivation), and the three named markers are copied from the imp-96206 baked literals; changes no bound, establishes no operator positivity, no RH claim; Platt-Trudgian Lambda <= 0.2 remains SOTA; NO QED.',
    }),
    Object.freeze({
      route: '/viz-imp96256-joint-anchor-sweep',
      title: 'imp-96227: Joint Kato-Temple Certify Region, Swept Across the Anchor',
      oneLine:
        'Two line charts over the imp-96227 anchor sweep alpha in (lam_2, lam_top): the pure-bottom worst-case threshold and equal-split boundary both shrink monotonically (~1.7828e-3 low edge to ~5.893e-4 near lam_top), while the per-channel coupling strength stays flat at exactly sqrt(3)/2 ~ 0.8660254 at every anchor.',
      mathBucket: 'measurement',
      dataModule: 'src/data/imp-96256-joint-anchor-sweep-viz-data.js',
      paperSourcePath:
        'src/data/imp-96227-route-i-kato-temple-joint-anchor-sweep.js (anchor-sweep table, literals; imp-96256 viz page)',
      ticket: 'imp-96256',
      pedagogicalStep: 228,
      honestCeiling:
        'Presentation only: every threshold value and the sqrt(3)/2 coupling constant are copied verbatim from the imp-96227 baked anchor-sweep table; only the chart-axis reshaping is computed here (no re-derivation, no new bisection); changes no bound, establishes no operator positivity, no RH claim; Platt-Trudgian Lambda <= 0.2 remains SOTA; NO QED.',
    }),
    Object.freeze({
      route: '/viz-imp96160-max-anchor-window-robustness',
      title: 'imp-96132: Max-Anchor Window-Robustness Sweep Across Four Held-Out Heights',
      oneLine:
        'Signed-sqrt-scale bar chart of the imp-96132 48-config window-robustness sweep (4 held-out heights x 12 configs): 46/48 cap, with the two shallow endpoint breaches (T=2e4 coarse k=2 at -0.47%, T=4e5 fine k=0.5 at -0.0019%) visible next to the imp-96090 canonical-window margins (+15%..+43%).',
      mathBucket: 'measurement',
      dataModule: 'src/data/imp-96160-max-anchor-window-robustness-viz-data.js',
      paperSourcePath:
        'src/data/imp-96132-max-anchor-window-robustness-four-heights.js (48-config margin table; imp-96160 viz page)',
      ticket: 'imp-96160',
      pedagogicalStep: 223,
      honestCeiling:
        'Presentation only: every margin value plotted is imported verbatim from imp-96132 (no re-derivation, no re-baking of the underlying sd(C-E) / mean-L literals); changes no bound, establishes no operator positivity, no RH claim; Platt-Trudgian Lambda <= 0.2 remains SOTA; NO QED.',
    }),
    Object.freeze({
      route: '/viz-imp96176-sigma-closed-form-ladder',
      title: 'imp-96151: Closed-Form Conditional-Share Ladder vs. the Full U-Shape',
      oneLine:
        'Schematic full share sigma_full(N) (U-shape peak at N~9.22e5) vs. the imp-96151 closed-form sigma_CF(N) (monotone right-arm only), plus a per-decade decay-exponent table past the imp-33582 1e12 endpoint (matches to 4 decimals, max relative gap 4.60e-4 over [1e10,1e100]).',
      mathBucket: 'measurement',
      dataModule: 'src/data/imp-96176-sigma-closed-form-ladder-viz-data.js',
      paperSourcePath:
        'src/data/imp-96151-sigma-closed-form-crossover-fartail-reproduction.js (closed-form model, ramp table, U-shape sign findings; imp-96176 viz page)',
      ticket: 'imp-96176',
      pedagogicalStep: 224,
      honestCeiling:
        'Presentation only: the ramp table and landmark values are copied verbatim from the imp-96151 baked fields; the U-shape/monotone comparison curve is illustrative of the imp-96151 sign findings, not a re-derivation of sigma(N); changes no bound, establishes no operator positivity, no RH claim; Platt-Trudgian Lambda <= 0.2 remains SOTA; NO QED.',
    }),
    Object.freeze({
      route: '/viz-imp96197-en-decay-exponent-ladder',
      title: 'imp-96166: E(N) Decay-Exponent Ladder vs. the Step-4 Bridge Threshold',
      oneLine:
        'Local decay exponent p(N) = -dlogE/dlogN of the assembled Step-4 bridge budget E(N): peaks near 0.47 (sqrt-law E_coll regime) then collapses toward 0 past the crossover N_x~3.28e9, where E(N) plateaus at the frozen E_trunc floor ~3.06e-5.',
      mathBucket: 'measurement',
      dataModule: 'src/data/imp-96197-en-decay-exponent-ladder-viz-data.js',
      paperSourcePath:
        'src/data/imp-96166-en-decay-exponent-vs-step4-bridge-threshold.js (decay-exponent ladder, crossover, residual shortfall; imp-96197 viz page)',
      ticket: 'imp-96197',
      pedagogicalStep: 225,
      honestCeiling:
        'Presentation only: every ladder value plotted is imported verbatim from imp-96166 (no re-derivation, no fresh computation); changes no bound, establishes no operator positivity, no RH claim; Platt-Trudgian Lambda <= 0.2 remains SOTA; NO QED.',
    }),
    Object.freeze({
      route: '/viz-imp96239-ushape-slope-drift',
      title: 'imp-96210: U-Shape a(N)/b(N) Slope Drift and the Drift-Integrated Location Law',
      oneLine:
        'Line chart of the imp-96210 local log-slopes a(N) and b(N) across the [N_peak, N_flow] decade of the E(N)-share U-shape: a stays nearly flat while b rises ~6.6x more, and feeding the decade-averaged slope sum into N_peak/N_flow=(b/a)^(1/<a+b>) tightens the imp-96187 constant-slope residual 20x (2.94e-3 to 1.44e-4).',
      mathBucket: 'measurement',
      dataModule: 'src/data/imp-96239-ushape-slope-drift-viz-data.js',
      paperSourcePath:
        'src/data/imp-96210-ushape-peak-slope-drift-location-law.js (a(N), b(N) grid, drift-integrated location law; imp-96239 viz page)',
      ticket: 'imp-96239',
      pedagogicalStep: 227,
      honestCeiling:
        'Presentation only: recomputes the imp-96210 a(N), b(N) grid from the identical inherited component model (E_trunc frozen, Gronwall E_flow, GUE-conditional E_coll) purely to expose the per-N curve for charting, cross-checked against the imp-96210 frozen landmarks; the C_mb GUE-conditional share (imp-486) stays untouched; changes no bound, establishes no operator positivity, no RH claim; Platt-Trudgian Lambda <= 0.2 remains SOTA; NO QED.',
    }),
    Object.freeze({
      route: '/viz-imp96257-ushape-slope-drift',
      title: 'imp-96228: U-Shape Slope Drift Past N_flow, Toward the (1/2, 1/2, 1) Asymptote',
      oneLine:
        'Line chart of a(N), b(N), a+b vs log10 N extending the imp-96210 U-shape slope drift a few decades past N_flow plus a deep probe at log10 N=250: the b-dominated upward drift stays monotone with no reversal, decelerates (saturates), and approaches (1/2, 1/2, 1) from below.',
      mathBucket: 'measurement',
      dataModule: 'src/data/imp-96257-ushape-slope-drift-viz-data.js',
      paperSourcePath:
        'src/data/imp-96228-ushape-slope-drift-beyond-nflow.js (extended grid, deep probe, monotonicity/deceleration/asymptote findings; imp-96257 viz page)',
      ticket: 'imp-96257',
      pedagogicalStep: 229,
      honestCeiling:
        'Presentation only: every a(N), b(N), a+b grid value and the deep-probe reading are copied verbatim from the imp-96228 baked landmarks; only the chart-axis reshaping is computed here (no re-derivation, no new slope measurement); the component model is the inherited imp-3220/imp-3406/imp-33723 extrapolation, not a rigorous asymptotic; the C_mb GUE-conditional per imp-486 stays untouched; changes no bound, establishes no operator positivity, no RH claim; Platt-Trudgian Lambda <= 0.2 remains SOTA; NO QED.',
    }),
    Object.freeze({
      route: '/viz-imp96294-eflow-residual',
      title: 'imp-96266: Closed-Form E_flow Suppression Residual R(N)',
      oneLine:
        'Line chart of the imp-96266 exact identity R(N) = sigma_full - sigma_CF = -sigma_full*E_flow/(E_trunc+E_coll) vs log10 N across the [1e3,1e12] ladder: the residual is strictly negative and deepest near the peak region, the differential suppression that manufactures the imp-3220 U-shape interior maximum.',
      mathBucket: 'measurement',
      dataModule: 'src/data/imp-96294-eflow-residual-viz-data.js',
      paperSourcePath:
        'src/data/imp-96266-eflow-peak-recovery-residual.js (residual identity, ladder, peak/peak-recovery landmarks; imp-96294 viz page)',
      ticket: 'imp-96294',
      pedagogicalStep: 230,
      honestCeiling:
        'Presentation only: every R(N), E_flow/E_N, and peak/peak-recovery reading is copied verbatim from the imp-96266 baked landmarks; only the chart-axis reshaping (log10 N parsing) is computed here (no re-derivation, no new residual measurement); the component model is the inherited imp-3220/imp-3406/imp-33723 extrapolation, not a rigorous asymptotic; the C_mb GUE-conditional per imp-486 stays untouched; changes no bound, establishes no operator positivity, no RH claim; Platt-Trudgian Lambda <= 0.2 remains SOTA; NO QED.',
    }),
    Object.freeze({
      route: '/viz-imp96314-covariance-deviation',
      title: 'imp-96267: GUE Two-Interval Covariance Deviation vs Height, the 1/log T Crawl',
      oneLine:
        'Line chart of the imp-96267 deviation |rho_exact + 1/2| vs log10 T across the decade ladder 1e4..1e12 plus the Platt-Trudgian verified anchor 3e12: the deviation only falls from 0.0436 to 0.0182, confirming the GUE-rigidity limit -1/2 is a 1/log T asymptote no accessible height operationally reaches.',
      mathBucket: 'measurement',
      dataModule: 'src/data/imp-96314-covariance-deviation-viz-data.js',
      paperSourcePath:
        'src/data/imp-96267-covariance-drift-rigidity-limit-reach.js (decade ladder, closed form, epsilon-reach crossings; imp-96314 viz page)',
      ticket: 'imp-96314',
      pedagogicalStep: 230,
      honestCeiling:
        'Presentation only: every deviation, rho_exact, and crossing value is copied verbatim from the imp-96267 baked ladder; only the log10 T axis reshaping is computed here (no re-derivation, no new height measurement); rho_exact is the theoretical GUE (sine-kernel, universality) two-interval correlation, not a measurement of the actual Riemann zeros; changes no bound, establishes no operator positivity, no RH claim; Platt-Trudgian Lambda <= 0.2 remains SOTA; NO QED.',
    }),
    Object.freeze({
      route: '/viz-imp96316-etrunc-sensitivity',
      title: 'imp-96187: N_peak/N_flow vs E_trunc-Scaling Sensitivity Sweep, the 1/sqrt(3) Crossing',
      oneLine:
        'Line chart of the imp-96187 F3 N_peak/N_flow ratio vs E_trunc-scale multiplier (0.2x..20x) at a fine log-spaced grid, showing the ratio fall smoothly through 1/sqrt(3) = 0.57735 with no plateau or fixed point there.',
      mathBucket: 'measurement',
      dataModule: 'src/data/imp-96316-etrunc-sensitivity-viz-data.js',
      paperSourcePath:
        'src/data/imp-96187-ushape-peak-ratio-logcorrection-identity-vs-accident.js (F3 six-point sensitivity sweep; imp-96316 viz page)',
      ticket: 'imp-96316',
      pedagogicalStep: 231,
      honestCeiling:
        'Presentation only: recomputes the imp-96187 F3 E_trunc-scale sensitivity sweep from the identical inherited component model (Gronwall E_flow, GUE-conditional C_C_PINNED E_coll) at a finer grid to expose the smooth crossing for charting, cross-checked against the imp-96187 frozen sensitivity landmarks; the 1/sqrt(3) proximity is a crossing point, not a fixed point; the C_mb GUE-conditional share (imp-486) stays untouched; changes no bound, establishes no operator positivity, no RH claim; Platt-Trudgian Lambda <= 0.2 remains SOTA; NO QED.',
    }),
    Object.freeze({
      route: '/viz-imp96318-confident-span-crossing',
      title: 'imp-96288: Confident Two-Tone Separation Span Crossing L(rho), Flat Plateau Below Rayleigh',
      oneLine:
        'Line chart of the imp-96288 fine-grid AICc>0.90 confident-separation crossing span L(rho) vs amplitude ratio rho=A4/A5: a flat plateau (~9.05-9.25, just below the Rayleigh span 9.999) across near-equal amplitudes, rising monotonically with imbalance outside it.',
      mathBucket: 'measurement',
      dataModule: 'src/data/imp-96318-confident-span-crossing-viz-data.js',
      paperSourcePath:
        'src/data/imp-96288-route-m-confident-span-lower-bound-test.js (fine-grid crossing curve, verdict; imp-96318 viz page)',
      ticket: 'imp-96318',
      pedagogicalStep: 232,
      honestCeiling:
        'Presentation only: every crossSpan and rho value is copied verbatim from the imp-96288 baked fine-grid curve; only the log(rho) axis reshaping is computed here (no re-derivation, no new Monte-Carlo run); synthetic q4+q5 two-tone simulation, not a measurement of the real conductor content or its amplitude ratio; changes no bound, establishes no operator positivity, no RH claim; Platt-Trudgian Lambda <= 0.2 remains SOTA; NO QED.',
    }),
    Object.freeze({
      route: '/viz-imp96320-route-l-reach-band',
      title: 'imp-96287: Route L Reach Band vs Point Estimate at the PT Height',
      oneLine:
        'Log-scale number-line chart of the imp-96287 covariance-propagated Route L reach bands (95% envelope [2.63e11,2.73e19], 1-sigma envelope [1.18e14,4.87e16]) against the three imp-96269 point-estimate extrapolations, all clustered near the reported reach ~1e15.',
      mathBucket: 'measurement',
      dataModule: 'src/data/imp-96320-route-l-reach-band-viz-data.js',
      paperSourcePath:
        'src/data/imp-96287-route-l-reach-band-reconciliation.js (covariance-propagated bands, verdict; imp-96320 viz page)',
      ticket: 'imp-96320',
      pedagogicalStep: 233,
      honestCeiling:
        'Presentation only: every band and point-estimate literal is copied verbatim from the imp-96287 baked reconciliation; only the log10 axis reshaping is computed here (no re-derivation, no new LSQ fit); derivation on baked literals only, changes no bound, establishes no operator positivity, no RH claim; Platt-Trudgian Lambda <= 0.2 remains SOTA; NO QED.',
    }),
    Object.freeze({
      route: '/viz-imp96322-e-decomposition',
      title: 'imp-96290: E(N) = E_trunc + E_flow + E_coll Decomposition and the C_H Factorization',
      oneLine:
        'Log-scale bar chart of the imp-96290 Step-4 bridge E(N) sub-term magnitudes at the N=1e4 conditional anchor (E_trunc~3.1e-5, E_flow~1.239e-3, E_coll~0.0111, total~0.0122) against the Platt-Trudgian bound 0.2, plus a table of the C_H = C_shock * C_Lip / 4 factorization showing C_Lip as the sole unquantified residual.',
      mathBucket: 'measurement',
      dataModule: 'src/data/imp-96322-e-decomposition-viz-data.js',
      paperSourcePath:
        'src/data/imp-96290-step4-bridge-subconstant-inventory.js (G6/G6a/C_H inventory, conditional anchor, C_H factorization; imp-96322 viz page)',
      ticket: 'imp-96322',
      pedagogicalStep: 234,
      honestCeiling:
        'Presentation only: every E_trunc/E_flow/E_coll/E(N) magnitude and every C_shock/C_H value is copied verbatim from the imp-96290 baked inventory; only the log-scale bar layout is computed here (no re-derivation); the conditional anchor (C_H <= 0.127) is UNPROVEN (C_H isRigorousUpperBound = false, imp-2642/imp-2701) and C_Lip is the RH-hard unquantified residual (imp-2640 Gronwall discharge NEGATIVE); changes no bound, establishes no operator positivity, no RH claim; Platt-Trudgian Lambda <= 0.2 remains SOTA; NO QED.',
    }),
    Object.freeze({
      route: '/viz-imp96262-model-selection-scores',
      title: 'imp-96231: Band-vs-Drift Model-Selection Scores (R2, AICc, BIC, LOO PRESS, Akaike Weights)',
      oneLine:
        'Table of the imp-96231 model-selection scores comparing the fixed q4+q5 Vasyunin conductor band against degree-2/3/4 smooth drift polynomials (R2, AICc, BIC, exact LOO PRESS, Akaike weight), plus the free-tone permutation-significance test (5000 shuffles).',
      mathBucket: 'measurement',
      dataModule: 'src/data/imp-96231-route-m-band-vs-drift-identifiability.js',
      paperSourcePath:
        'src/data/imp-96231-route-m-band-vs-drift-identifiability.js (IMP96231_MODELS, IMP96231_SELECTION, IMP96231_PEAK_SIGNIFICANCE; imp-96262 viz page)',
      ticket: 'imp-96262',
      pedagogicalStep: 235,
      honestCeiling:
        'Presentation only: every R2/AICc/BIC/PRESS/Akaike-weight and permutation-test value is copied verbatim from the imp-96231 baked model-selection scores (no re-derivation, no new fit). The band decisively beats a slow smooth non-spectral drift (delta AICc -18.6), but is statistically indistinguishable from a free single tone at the same frequency (delta R2 0.002): the specific q4+q5 conductor content is NOT uniquely identified. Changes no bound, establishes no operator positivity, no RH claim; Platt-Trudgian Lambda <= 0.2 remains SOTA; NO QED.',
    }),
    Object.freeze({
      route: '/viz-imp96334-ecoll-rate-ch-independence',
      title: 'imp-96311: E_coll Rate-vs-Conclusion C_H-Independence',
      oneLine:
        'Log-log family chart of the imp-96311 collision-term E_coll(N) across four C_H magnitudes (1/8, 0.127, 1.0, C_KH): the four lines are exactly parallel (only the prefactor differs) and the shared segment slope crawls from -0.4568 to -0.4801 toward the N^(-1/2) exponent, showing the rate is C_H-independent while only the E(N) -> 0 conclusion is gated on C_H.',
      mathBucket: 'measurement',
      dataModule: 'src/data/imp-96334-ecoll-rate-ch-independence-viz-data.js',
      paperSourcePath:
        'src/data/imp-96311-ecoll-rate-ch-independence-tabulation.js (columns, sharedSlopeProfile, prefactor; imp-96334 viz page)',
      ticket: 'imp-96334',
      pedagogicalStep: 236,
      honestCeiling:
        'Presentation only: every E_coll value, segment slope, and slope-spread literal is copied verbatim from the imp-96311 baked columns/sharedSlopeProfile fields (no re-derivation); only the plotting shape is computed here. C_H isRigorousUpperBound remains false (imp-2642/imp-2701) and the imp-2640 Gronwall discharge of C_Lip remains NEGATIVE; changes no bound, establishes no operator positivity, no RH claim; Platt-Trudgian Lambda <= 0.2 remains SOTA; NO QED.',
    }),
    Object.freeze({
      route: '/viz-imp96337-mixed-ladder-margin',
      title: 'imp-96270: Mixed {oo,2,3} Ladder Spectral-Gap Margin',
      oneLine:
        'Bar chart of the imp-96270 mixed 2^a 3^b S-unit ladder rung magnitudes s_u and their margin below the ceiling s_2 = 0.353553 (attained only at u = 2), plus a step chart of the finite rung-count-within-threshold ladder (1 rung at t=0.30 growing to 19 rungs at t=0.05).',
      mathBucket: 'measurement',
      dataModule: 'src/data/imp-96337-mixed-ladder-margin-viz-data.js',
      paperSourcePath:
        'src/data/imp-96270-mixed-ladder-spectral-gap-margin-tabulation.js (leadingMagnitudes, countAboveThreshold; imp-96337 viz page)',
      ticket: 'imp-96337',
      pedagogicalStep: 237,
      honestCeiling:
        'Presentation only: every rung magnitude, margin, and threshold-count value is copied verbatim from the imp-96270 baked leadingMagnitudes/countAboveThreshold fields (no re-derivation); only the margin subtraction and threshold reordering are computed here. This charts a TABULATION of the already-reduced imp-96143 fact (I): it diagonalizes nothing, establishes no operator positivity, moves no Lambda bound, and does not touch the finitely-many top confined states (the actual residual). Changes no bound, no RH claim; Platt-Trudgian Lambda <= 0.2 remains SOTA; NO QED.',
    }),
    Object.freeze({
      route: '/viz-imp96338-worst-excess-evt',
      title: 'imp-96271: Worst-Excess Extreme-Value Test',
      oneLine:
        'Per-height chart of the imp-96271 worst-window discrepancy excess worstSigma against the E[max] +/-1 Gumbel-sd band expected from a batch of nWindows iid standard Gaussians, across the six imp-95562 heights (deviation in [-1.10, +1.85] Gumbel sd).',
      mathBucket: 'measurement',
      dataModule: 'src/data/imp-96338-worst-excess-evt-viz-data.js',
      paperSourcePath:
        'src/data/imp-96271-worst-excess-evt-gaussianity.js (rows, aggregates; imp-96338 viz page)',
      ticket: 'imp-96338',
      pedagogicalStep: 238,
      honestCeiling:
        'Presentation only: every worstSigma, E[max], Gumbel-sd, and deviation value is copied verbatim from the imp-96271 baked rows (no re-derivation); only the bandLow/bandHigh = E[max] -/+ sd[max] arithmetic is computed here. This charts a measurement comparison already reduced by imp-96271 (itself testing an imp-95562 claim): it establishes no operator positivity, moves no Lambda bound, and touches nothing on the zero side. Changes no bound, no RH claim; Platt-Trudgian Lambda <= 0.2 remains SOTA; NO QED.',
    }),
    Object.freeze({
      route: '/viz-imp96393-discrepancy-envelope',
      title: 'imp-96371: Exact-vs-Asymptotic Number-Variance Discrepancy Envelope',
      oneLine:
        'Log-scale line chart of the imp-96371 |rho_exact - rho_asymp| discrepancy vs log10 T across the imp-96267 decade ladder 1e4..3e12: U-shaped, worst (1.47e-7) at T=1e4, a roundoff floor (~3.23e-13) near T=1e8-1e9, rising back to the imp-96350 PT-anchor reading (2.52e-10) at T=3e12.',
      mathBucket: 'measurement',
      dataModule: 'src/data/imp-96393-discrepancy-envelope-viz-data.js',
      paperSourcePath:
        'src/data/imp-96371-covariance-exact-vs-asymptotic-decade-ladder.js (ladder, shape landmarks, honest caveat; imp-96393 viz page)',
      ticket: 'imp-96393',
      pedagogicalStep: 239,
      honestCeiling:
        'Presentation only: every discrepancy reading is copied verbatim from the imp-96371 baked decade ladder (no re-derivation); only the chart-axis reshaping (log10 T, log10 discrepancy) is computed here. rho is the theoretical GUE (sine-kernel, universality) two-interval correlation for boxes of unfolded length L(T); at these heights (and at 3e12) there are no computed Riemann zeros, so this cross-validates two closed-form evaluations of the same envelope, not a measurement of actual zeros. Changes no bound, establishes no operator positivity, no RH claim; Platt-Trudgian Lambda <= 0.2 remains SOTA; NO QED.',
    }),
    Object.freeze({
      route: '/viz-imp96298-pref-at-rayleigh',
      title: 'imp-96264: Route M Two-Tone AICc Preference at the Rayleigh Span',
      oneLine:
        'Line chart of the imp-96264 AICc two-tone preference prefAtRayleigh vs log(rho) amplitude ratio rho = A4/A5: peaks at rho=1 (0.944, equal amplitude) and falls off symmetrically with imbalance, dropping below the 90% confident-separation threshold past |log rho| ~ ln(1.4).',
      mathBucket: 'measurement',
      dataModule: 'src/data/imp-96298-route-m-pref-at-rayleigh-viz-data.js',
      paperSourcePath:
        'src/data/imp-96264-route-m-amplitude-ratio-sensitivity.js (ratio table, verdict, sub-gap; imp-96298 viz page)',
      ticket: 'imp-96298',
      pedagogicalStep: 240,
      honestCeiling:
        'Presentation only: every prefAtRayleigh and rho value is copied verbatim from the imp-96264 baked ratio table (no re-derivation); only the log(rho) axis reshaping is computed here. Route M off-lattice arithmetic per imp-96189, NOT a zero-tone measurement. Changes no bound, establishes no operator positivity, no RH claim; Platt-Trudgian Lambda <= 0.2 remains SOTA; NO QED.',
    }),
    Object.freeze({
      route: '/viz-imp96299-margin-floor-loo',
      title: 'imp-96265: Margin-Floor Leave-One-Out / Leave-Two-Out Refit Spread',
      oneLine:
        'Bar chart of the imp-96265 leave-one-out refit floor c by dropped height cutoff T, with the highest-leverage drop T=60 highlighted (floor 0.14256 -> 0.17740) and the 21-refit leave-two-out min/max band [0.121, 0.212] shaded behind it.',
      mathBucket: 'measurement',
      dataModule: 'src/data/imp-96299-margin-floor-loo-viz-data.js',
      paperSourcePath:
        'src/data/imp-96265-margin-floor-loo-stability.js (LOO/LTO refit tables, verdict; imp-96299 viz page)',
      ticket: 'imp-96299',
      pedagogicalStep: 241,
      honestCeiling:
        'Presentation only: every LOO/LTO floor value is copied verbatim from the imp-96265 baked refit tables (no re-derivation); only the by-dropped-height sort and delta-from-full-fit are computed here. The positive-floor sign is robust across every held-out subset; the 0.14256 magnitude is endpoint-driven, not a sharp value. Changes no bound, establishes no operator positivity, no RH claim; Platt-Trudgian Lambda <= 0.2 remains SOTA; NO QED.',
    }),
    Object.freeze({
      route: '/viz-imp96302-route-l-reach-power-law',
      title: 'imp-96269: Route L Detector-vs-Christoffel Reach Power Laws and the PT-Height Extrapolation Fan',
      oneLine:
        'Log-log curve chart of the imp-96269 detector power law (N=0.364336*gamma^1.271686) vs the Christoffel eps1e4 re-fit (N=0.396870*gamma^1.248736) over the shared gamma range, with the PT-height T0=3.0001e12 extrapolation fan landing both curves near N~1e15.',
      mathBucket: 'measurement',
      dataModule: 'src/data/imp-96302-route-l-reach-power-law-viz-data.js',
      paperSourcePath:
        'src/data/imp-96269-route-l-reach-law-crosscheck.js (power-law fits, shared measured points, T0 extrapolation, verdict; imp-96302 viz page)',
      ticket: 'imp-96302',
      pedagogicalStep: 242,
      honestCeiling:
        'Presentation only: every fit coefficient, measured point, and T0 extrapolation is copied verbatim from the imp-96269 baked crosscheck (no re-fit); only the log10 curve sampling is computed here. Both extrapolated orders sit ~15 decades beyond feasible computation, so Route L remains a fixed-cost detector, not a lever. Changes no bound, establishes no operator positivity, no RH claim; Platt-Trudgian Lambda <= 0.2 remains SOTA; NO QED.',
    }),
    Object.freeze({
      route: '/viz-imp96410-sigma-peak-knee-crossover',
      title: 'imp-96388: sigma(N) Peak, Knee, and E_coll = E_trunc Crossover on One Shared log10 N Axis',
      oneLine:
        'Log-x curve chart of sigma(N) = E_coll/(E_trunc+E_flow+E_coll) across the shared log10 N axis, marking the imp-96266 E_flow-built peak (log10 N ~ 5.965), the imp-96351 exponent-ramp knee (log10 N ~ 9.529), and the imp-33723 closed-form E_coll = E_trunc crossover, showing the two landmarks sit ~3.56 decades apart with sigma falling monotonically between them.',
      mathBucket: 'measurement',
      dataModule: 'src/data/imp-96410-sigma-peak-knee-crossover-viz-data.js',
      paperSourcePath:
        'src/data/imp-96388-sigma-peak-vs-knee-cross-tabulation.js (peak/knee/crossover measurement, method, verdict; imp-96410 viz page)',
      ticket: 'imp-96410',
      pedagogicalStep: 243,
      honestCeiling:
        'Presentation only: every landmark value, shared-axis row, and finding is copied verbatim from the imp-96388 baked cross-tabulation (no re-derivation); only the log10 curve interpolation and axis sampling are computed here. Confirms two independent landmarks ~3.56 decades apart, not one feature at different differencing orders. Changes no bound, establishes no operator positivity, no RH claim; Platt-Trudgian Lambda <= 0.2 remains SOTA; NO QED.',
    }),
    Object.freeze({
      route: '/viz-imp96377-off-anchor-residual',
      title: 'imp-96345: Off-Anchor Margin Residual Structure vs the Seven-Anchor Design Line',
      oneLine:
        'Scatter of the 34 measured rho(32,T) worst-support margins vs T against the seven-anchor reciprocal-log design line: 23 of 27 off-anchor points sit below the line, worst residual -0.0608 at gamma_4000 (T=4506.31), where the binding envelope (min measured margin 0.3791) also lands.',
      mathBucket: 'measurement',
      dataModule: 'src/data/imp-96377-off-anchor-residual-scatter-viz-data.js',
      paperSourcePath:
        'src/data/imp-96345-route-bd-offline-margin-envelope.js (residual structure, binding envelope; imp-96377 viz page)',
      ticket: 'imp-96377',
      pedagogicalStep: 244,
      honestCeiling:
        'Presentation only: every T/rho pair and the seven-anchor line floor/slope are copied verbatim from imp-96345 (and, before that, imp-96148/imp-96224); only the per-point below-line flag and the line-curve sample points are computed here. The binding envelope stays strictly positive (0.3791 at gamma_4000) even as the fitted floor collapses toward zero off the line -- the margin SIGN survives, the positive FLOOR does not. Changes no bound, establishes no operator positivity, no RH claim; Platt-Trudgian Lambda <= 0.2 remains SOTA; NO QED.',
    }),
    Object.freeze({
      route: '/viz-imp96378-route-m-beat-period-overlap',
      title: 'imp-96344: Route M Adjacent Conductor-Tone (q=4/q=5) Overlap vs Window Span',
      oneLine:
        'Curve chart of the adjacent q=4/q=5 conductor-tone overlap |corr(cos w4 x, cos w5 x)| vs window span L in log N, marking the current span L=3.69 (0.369 of one beat, overlap 0.0674), the sidelobe bump ~0.26 near L=7.5, and the exact first true null at L=9.85 (N~5.5e6), one Rayleigh beat period 2 pi/(w4-w5) out.',
      mathBucket: 'measurement',
      dataModule: 'src/data/imp-96378-route-m-beat-period-overlap-viz-data.js',
      paperSourcePath:
        'src/data/imp-96344-route-m-synthetic-span-identifiability.js (IMP96344_LINE_RESOLUTION, IMP96344_CONDUCTORS; imp-96378 viz page)',
      ticket: 'imp-96378',
      pedagogicalStep: 245,
      honestCeiling:
        'Presentation only: the three marked anchors are copied verbatim from imp-96344; the connecting curve is a closed-form reconstruction of the same overlap definition (product-to-sum trig identity, no sampling/fitting) computed here, verified to agree with the baked anchors to within their own rounding. Establishes no operator positivity, moves no Lambda bound, and does not decide whether the real Route M data carries a genuine multi-conductor band (imp-96344 F4: that needs the actual Vasyunin Gram at N ~ 5.5e6..1.2e11). Changes no bound, no RH claim; Platt-Trudgian Lambda <= 0.2 remains SOTA; NO QED.',
    }),
    Object.freeze({
      route: '/viz-imp96395-sigma-local-exponent-ramp',
      title: 'imp-96351: sigma(N) Local-Exponent Ramp and Its D2 Zero-Crossing Knee across [1e9,1e12]',
      oneLine:
        'Two stacked charts across the tenth-decade grid on [1e9,1e12]: the OLS local decay exponent p_dec(N) ramp on top and its second difference D2 (acceleration) below, both marking the single D2 zero-crossing knee at log10 N* = 9.529 (N* ~ 3.38e9).',
      mathBucket: 'measurement',
      dataModule: 'src/data/imp-96395-sigma-local-exponent-ramp-viz-data.js',
      paperSourcePath:
        'src/data/imp-96351-sigma-knee-tenthdecade-1e12-stability.js (sigma/OLS-exponent/D2 method, knee measurement, verdict; imp-96395 viz page)',
      ticket: 'imp-96395',
      pedagogicalStep: 246,
      honestCeiling:
        'Presentation only: the sigma(N)/OLS-exponent/D2 logic is copied verbatim from imp-96351 (identical sub-terms, identical estimator, no fresh model); it is re-run here only to expose the per-bracket p_dec/D2 series imp-96351 does not export, so the chart can render the ramp and its curvature rather than just the baked summary scalars. Establishes no operator positivity, moves no Lambda bound; measurement/fit only on an inherited, non-rigorous component model; Platt-Trudgian Lambda <= 0.2 remains SOTA; NO QED.',
    }),
    Object.freeze({
      route: '/viz-imp96399-route-m-reach-reprice',
      title: 'imp-96352: Route M Reachable-N Ceiling Reprice',
      oneLine:
        'Bar chart comparing the imp-96230 BUILD-only assumed reach (N~10000 at 399 s) against the imp-96352 corrected-cost-model reach at the same budget (N~5355, a 1.87x overstatement), plus the full corrected reach ladder at 399 s/30 min/1 hour/4 hours.',
      mathBucket: 'measurement',
      dataModule: 'src/data/imp-96399-route-m-reach-reprice-viz-data.js',
      paperSourcePath:
        'src/data/imp-96352-route-m-vasyunin-solve-cost-model.js (IMP96352_REACH, IMP96352_BUILD_ONLY_ESTIMATE); src/data/imp-96230-route-m-vasyunin-gram-n1e4-feasibility.js (IMP96230_N1E4_BUDGET)',
      ticket: 'imp-96399',
      pedagogicalStep: 247,
      honestCeiling:
        'Presentation only: every reach figure is copied verbatim from imp-96352 (corrected cost model) and imp-96230 (BUILD-only budget); no new timing measurement is made here, and the corrected reach ladder is itself an extrapolated cubic fit rather than a re-measured wall-clock run at each budget. Changes no bound, establishes no operator positivity; Platt-Trudgian Lambda <= 0.2 remains SOTA; NO QED.',
    }),
    Object.freeze({
      route: '/viz-imp96401-intercept-se-trajectory',
      title: 'imp-96367: Reciprocal-Log Margin-Floor Intercept-vs-Census-Depth Trajectory',
      oneLine:
        'Curve chart of the imp-96367 reciprocal-log margin-floor intercept falling 0.14256 -> 0.03705 across gamma200..gamma4000 with the flat +/-2 SE band around zero, plus the labeled (not measured) one-doubling gamma8000 projection landing inside the band.',
      mathBucket: 'measurement',
      dataModule: 'src/data/imp-96401-intercept-se-trajectory-viz-data.js',
      paperSourcePath:
        'src/data/imp-96367-route-bd-intercept-se-trajectory.js (trajectory, standard errors, projection, sub-gap; imp-96401 viz page)',
      ticket: 'imp-96401',
      pedagogicalStep: 248,
      honestCeiling:
        'Presentation only: every depth, intercept, and seC value is copied verbatim from the imp-96367 baked trajectory (no re-fit); only the +/-2 SE band and the sixth projected point are computed here. The gamma8000 point is a labeled projection, not a measurement -- the asymptotic sign past gamma4000 stays measurement-undecided pending fresh rho(32,T) evaluations. Changes no bound, establishes no operator positivity; Platt-Trudgian Lambda <= 0.2 remains SOTA; NO QED.',
    }),
    Object.freeze({
      route: '/viz-imp96413-count-model-sensitivity-ladder',
      title: 'imp-96387 / imp-96363: +7/8 Count-Model Relative Sensitivity Ladder',
      oneLine:
        'Log-scale bar ladder comparing the +7/8 count-model relative E_coll shift at the imp-96290 N = 1e4 anchor (-4.11e-6) against the imp-96363 reconstructed N = 1e6 anchor (-3.00e-8), a measured ~137x gap tracking the 100x height ratio.',
      mathBucket: 'measurement',
      dataModule: 'src/data/imp-96413-count-model-sensitivity-ladder-viz-data.js',
      paperSourcePath:
        'src/data/imp-96387-ecoll-anchor-count-model-sensitivity-n1e4.js (IMP96387_ECOLL_ANCHOR_COUNT_MODEL_SENSITIVITY_N1E4; imp-96413 viz page)',
      ticket: 'imp-96413',
      pedagogicalStep: 249,
      honestCeiling:
        'Presentation only: both ladder rungs and the scaling ratios are copied verbatim from the imp-96387 measurement (no re-fit, no re-derivation). Absolute anchor shifts stay tiny (~4.5e-8) despite the ~137x relative-sensitivity gap; conditional C_H <= 0.127 stays UNPROVEN, C_H isRigorousUpperBound = false. Changes no bound, establishes no operator positivity; Platt-Trudgian Lambda <= 0.2 remains SOTA; NO QED.',
    }),
    Object.freeze({
      route: '/viz-imp96422-eflow-frac-ladder-peak-recovery',
      title: 'imp-96266: E_flow Fractional-Suppression Ladder and the Recon-vs-Full Sigma Peak',
      oneLine:
        'Log-scale chart of the imp-96266 E_flow/E_N fractional-suppression ladder vs log10 N (1.38e-1 at 1e3 down to 1.22e-5 at 1e12) alongside a direct recon-vs-full sigma_max comparison at the imp-3220 U-shape peak, showing the reconstruction recovers the peak height to 9.2e-4.',
      mathBucket: 'measurement',
      dataModule: 'src/data/imp-96422-eflow-frac-ladder-peak-recovery-viz-data.js',
      paperSourcePath:
        'src/data/imp-96266-eflow-peak-recovery-residual.js (fractional ladder, peak/peak-recovery landmarks; imp-96422 viz page)',
      ticket: 'imp-96422',
      pedagogicalStep: 250,
      honestCeiling:
        'Presentation only: every E_flow/E_N ladder reading and the recon-vs-full peak location/height are copied verbatim from the imp-96266 baked landmarks; only the chart-axis reshaping is computed here (no re-derivation, no new residual or peak measurement); the component model is the inherited imp-3220/imp-3406/imp-33723 extrapolation, not a rigorous asymptotic; the C_mb GUE-conditional per imp-486 stays untouched; changes no bound, establishes no operator positivity, no RH claim; Platt-Trudgian Lambda <= 0.2 remains SOTA; NO QED.',
    }),
    Object.freeze({
      route: '/viz-imp96438-route-m-full-ladder',
      title: 'Route M: Full Burnol-Ratio Ladder (N=250..6000)',
      oneLine:
        'Single continuous line chart merging the imp-96094 dense ladder (N=250..2600) and the imp-96105 SPD-Gram extension (N=3000..6000) into one 17-rung ratio(N) = d_N^2 log N / C_burnol series against the ratio=1 (RH + simple zeros) target, showing the oscillation in [0.9639,1.0102] does not tighten across the full accessible range.',
      mathBucket: 'measurement',
      dataModule: 'src/data/imp-96438-route-m-full-ladder-viz-data.js',
      paperSourcePath:
        'src/data/imp-96094-route-m-burnol-ratio-dense-ladder.js, src/data/imp-96105-route-m-vasyunin-gram-extend-n6000.js (IMP96094_ROWS, IMP96105_EXT_ROWS; imp-96438 viz page)',
      ticket: 'imp-96438',
      pedagogicalStep: 251,
      honestCeiling:
        'Presentation only: every ratio(N) value is copied verbatim from imp-96094 IMP96094_ROWS and imp-96105 IMP96105_EXT_ROWS (no re-derivation of either exact Vasyunin Gram / Cholesky numerics); changes no bound, establishes no operator positivity, no RH claim; Platt-Trudgian Lambda <= 0.2 remains SOTA; NO QED.',
    }),
    Object.freeze({
      route: '/viz-imp96439-three-basis-rho-crossvalidation',
      title: 'Three-Basis GUE Rho Cross-Validation (L = 30..480)',
      oneLine:
        'Two charts from the imp-96389 three-basis table: rho(L) from the exact Dyson-Mehta variance, the asymptotic module, and the direct pair-correlation integral overlapping to >= 6 figures, plus the pairwise log-agreements showing |A-B| analytic truncation shrink against the basis-C roundoff floor that grows with L.',
      mathBucket: 'measurement',
      dataModule: 'src/data/imp-96439-three-basis-rho-crossvalidation-viz-data.js',
      paperSourcePath:
        'src/data/imp-96389-three-basis-rho-crossvalidation-table.js (IMP96389_THREE_BASIS_RHO_CROSSVALIDATION_TABLE; imp-96439 viz page)',
      ticket: 'imp-96439',
      pedagogicalStep: 252,
      honestCeiling:
        'Presentation only: every rho, agreement and roundoff-floor value is copied verbatim from the imp-96389 baked three-basis table (no re-derivation); rho is the theoretical GUE two-interval correlation with no computed Riemann zeros behind it; changes no bound, establishes no operator positivity, no RH claim; Platt-Trudgian Lambda <= 0.2 remains SOTA; NO QED.',
    }),
    Object.freeze({
      route: '/viz-imp96453-basis-c-corroboration-crossover',
      title: 'Basis-C Corroboration-Reach Crossover',
      oneLine:
        'Log-log chart of the imp-96430 basis-C corroboration-reach crossover: the growing L-linear cancellation floor (two slope calibrations) against the shrinking exact |rho + 1/2| rigidity signal, marking the PT anchor L=5.9e6 and the crossover band [1.3e12, 2.5e12] where the lines meet.',
      mathBucket: 'measurement',
      dataModule: 'src/data/imp-96453-basis-c-corroboration-crossover-viz-data.js',
      paperSourcePath:
        'src/data/imp-96430-basis-c-corroboration-reach-crossover.js (IMP96430_BASIS_C_CORROBORATION_REACH_CROSSOVER; imp-96453 viz page)',
      ticket: 'imp-96453',
      pedagogicalStep: 253,
      honestCeiling:
        'Presentation only: every signal, floor and crossover value is copied verbatim from the imp-96430 baked crossover object (no re-derivation); rho is the theoretical GUE two-interval correlation with no computed Riemann zeros behind it; the crossover band is an extrapolation of a floor model calibrated only on accessible L (<= 960); the PT-anchor headroom marked is the imp-96430 model figure (~3.7e5), superseded by the imp-96448 measured ~640; changes no bound, establishes no operator positivity, no RH claim; Platt-Trudgian Lambda <= 0.2 remains SOTA; NO QED.',
    }),
    Object.freeze({
      route: '/viz-imp96454-ecoll-gap-ladder',
      title: 'E_coll Count-Model Gap Ladder',
      oneLine:
        'Log-log chart of the imp-96426 count-model gap ladder: gammaRelGap and rateRelGap between the RvM main-term count-inversion height and the externally tabulated TRUE Odlyzko height across six anchors N = 1..1e22, showing the 1/(gamma log gamma) decay from the macroscopic first-zero gap to the double-precision floor.',
      mathBucket: 'measurement',
      dataModule: 'src/data/imp-96454-ecoll-gap-ladder-viz-data.js',
      paperSourcePath:
        'src/data/imp-96426-ecoll-anchor-intermediate-heights.js (IMP96426_ECOLL_ANCHOR_INTERMEDIATE_HEIGHTS; imp-96454 viz page)',
      ticket: 'imp-96454',
      pedagogicalStep: 254,
      honestCeiling:
        'Presentation only: every N, true height and relative-gap value is copied verbatim from the imp-96426 baked six-anchor object (no re-derivation); the reference 1/(gamma log gamma) envelope is scaled to match the N=1e3 anchor, a visual check of the imp-96426 prose claim, not an independent re-derivation; measurement/accuracy audit only, no gap closed, no bound changed, G6_polymath15_bridge not closed, conditional C_H <= 0.127 stays UNPROVEN, C_H isRigorousUpperBound = false (imp-2642/imp-2701); Platt-Trudgian Lambda <= 0.2 remains SOTA; NO QED.',
    }),
    Object.freeze({
      route: '/viz-imp96455-ckh-sensitivity',
      title: 'C_KH-Invariance Sweep',
      oneLine:
        'Charts the imp-96429 C_KH-sensitivity sweep: the two relative-gap conclusions (1e22 gap flat at the double-precision floor, first-zero gap flat at 8.47e-2) stay invariant across a 0.1x..100x rescaling of the Koksma-Hlawka factor, while the absolute E_coll(0.125, 1e22) magnitude tracks the exact sqrt(C_KH / baseline) reference line.',
      mathBucket: 'measurement',
      dataModule: 'src/data/imp-96455-ckh-sensitivity-viz-data.js',
      paperSourcePath:
        'src/data/imp-96429-ecoll-ckh-sensitivity.js (IMP96429_ECOLL_CKH_SENSITIVITY; imp-96455 viz page)',
      ticket: 'imp-96455',
      pedagogicalStep: 255,
      honestCeiling:
        'Presentation only: every C_KH, factorVsBaseline, rateRelGap and eCollA1e22 value is copied verbatim from the imp-96429 baked sweep table (no re-derivation); the only new arithmetic is the log10 axis reshaping, a double-precision floor clip for the exact-zero 1e22 gap, and the eCollA1e22-to-baseline ratio; measurement/accuracy audit of a normalization constant only, no gap closed, no bound changed, conditional C_H <= 0.127 stays UNPROVEN, C_H isRigorousUpperBound = false (imp-2642/imp-2701); Platt-Trudgian Lambda <= 0.2 remains SOTA; NO QED.',
    }),
    Object.freeze({
      route: '/viz-imp96456-vasyunin-conditioning-ceiling',
      title: 'Route M Vasyunin Conditioning Ceiling',
      oneLine:
        'Charts the imp-96428 Route M Vasyunin Gram conditioning-ceiling finding: the 12 measured lam_min(N) rungs and power-law fit (p=1.918), and cond#(N) = lam_max/lam_min under the three lam_max proxies against the 1/eps=4.5e15 double-precision breakdown line, marking the imp-96352 compute ceiling N~9916 far below all three conditioning ceilings.',
      mathBucket: 'measurement',
      dataModule: 'src/data/imp-96456-vasyunin-conditioning-ceiling-viz-data.js',
      paperSourcePath:
        'src/data/imp-96428-route-m-vasyunin-lammin-conditioning-ceiling.js (IMP96428_FIT / IMP96428_CEILING; imp-96456 viz page)',
      ticket: 'imp-96456',
      pedagogicalStep: 256,
      honestCeiling:
        'Presentation only: the 12 measured lam_min rungs, the power-law fit, and the three proxy ceiling-N values are copied verbatim from imp-96428; the cond#(N) curves are traced from the exact lam_max(N) proxy formulas imp-96428 names (N, 10 log N, 1), each verified here to reproduce the published ceiling-N and target cond# values; measurement/extrapolation only, no Gram rebuilt, no bound changed, no operator positivity established; Platt-Trudgian Lambda <= 0.2 remains SOTA; RH open; NO QED.',
    }),
    Object.freeze({
      route: '/viz-imp96514-excursion-2sigma-interior-scan',
      title: 'Interior-Height 2-Sigma Scan',
      oneLine:
        'Charts the imp-96493 interior-height 2-sigma scan: the z-score at ten unclipped-and-clipped interior heights T > 1.5e5 against the T=1.5e5 reference excursion (z=1.9234), the z=2 target, and the ordinate-ceiling clip threshold, showing the deepest clean interior dip (z=1.0358 at T=3.879e5) stays well short of 2-sigma.',
      mathBucket: 'measurement',
      dataModule: 'src/data/imp-96514-excursion-2sigma-interior-scan-viz-data.js',
      paperSourcePath:
        'src/data/imp-96493-excursion-2sigma-interior-scan.js (IMP96493_EXCURSION_2SIGMA_INTERIOR_SCAN; imp-96514 viz page)',
      ticket: 'imp-96514',
      pedagogicalStep: 257,
      honestCeiling:
        'Presentation only: every Tc, z, relErr, nW, isDip and clipped value plotted here is copied verbatim from the imp-96493 baked scan object; the only new step is merging the T=1.5e5 reference point into the series and labelling each marker category; measurement/accuracy audit of imp-96452 lever (b) reach only, no gap closed, no bound changed; Platt-Trudgian Lambda <= 0.2 remains SOTA; RH open; NO QED.',
    }),
    Object.freeze({
      route: '/viz-imp96515-ppp-collapse-map',
      title: 'Basis-C ppp-Collapse Map',
      oneLine:
        'Charts the imp-96486 basis-C ppp-collapse map: optimal panels-per-period collapsing monotonically 640 -> 3 across L=960..5.9e6, and the achievable floor tracking the imp-96430 L-linear model within ~2-4x until L~3e5, then departing to 573x above it at the anchor.',
      mathBucket: 'measurement',
      dataModule: 'src/data/imp-96515-ppp-collapse-viz-data.js',
      paperSourcePath:
        'src/data/imp-96486-basis-c-ppp-collapse-transition.js (IMP96486_BASIS_C_PPP_COLLAPSE_TRANSITION; imp-96515 viz page)',
      ticket: 'imp-96515',
      pedagogicalStep: 258,
      honestCeiling:
        'Presentation only: every L, optPpp, floor, floorModel and floorOverModel value plotted here is copied verbatim from the imp-96486 baked rung map; the only new step is labelling each rung cancellation or truncation branch from the existing crossover landmark; feasibility/cross-validation numerics only, theoretical GUE quantity, not real zeros, no bound changed; Platt-Trudgian Lambda <= 0.2 remains SOTA; RH open; NO QED.',
    }),
    Object.freeze({
      route: '/viz-imp96516-route-m-remainder-model',
      title: 'Route M Remainder Model',
      oneLine:
        'Charts the imp-96487 Route M Burnol-ratio 21-rung N=250..10000 ladder against the fitted decaying-oscillation plateau c0~0.9846 vs the RH asymptote 1, and the rms bars showing every decay exponent p in {0,1,2} prefers the plateau by ~1.85-1.98x.',
      mathBucket: 'measurement',
      dataModule: 'src/data/imp-96516-route-m-remainder-viz-data.js',
      paperSourcePath:
        'src/data/imp-96487-route-m-burnol-ratio-asymptotic-remainder-model.js (IMP96487_LADDER, IMP96487_MODELS, IMP96487_C0EQ1_TEST; imp-96516 viz page)',
      ticket: 'imp-96516',
      pedagogicalStep: 259,
      honestCeiling:
        'Presentation only: every N, ratio, c0, a, b, p, w and rms value plotted here is copied verbatim from the imp-96487 baked ladder/model objects; the only new step is sampling the fixed fitted curve at a dense grid for a smooth line; the 3.689-wide log-N window leaves the true asymptote undecided, no bound changed; Platt-Trudgian Lambda <= 0.2 remains SOTA; RH open; NO QED.',
    }),
    Object.freeze({
      route: '/viz-imp96475-etrunc-sensitivity',
      title: 'sigma-Knee / Crossover Sensitivity to the E_trunc Truncation Floor',
      oneLine:
        'Charts the imp-96451 E_trunc sensitivity sweep: the tenth-decade sigma-knee and the sigma = 1/2 crossover both move with elasticity ~-0.911 across a 0.5x..2x band about E_trunc=3.06e-5, tracking the analytic -2/ln10 leading term, with the knee leaving the [1e9,1e12] resolution window at 2x.',
      mathBucket: 'measurement',
      dataModule: 'src/data/imp-96475-etrunc-sensitivity-viz-data.js',
      paperSourcePath:
        'src/data/imp-96451-sigma-knee-etrunc-sensitivity.js (IMP96451_SIGMA_KNEE_ETRUNC_SENSITIVITY; imp-96475 viz page)',
      ticket: 'imp-96475',
      pedagogicalStep: 260,
      honestCeiling:
        'Presentation only: every factor, eTrunc, knee, crossover and gap value plotted here is copied verbatim from the imp-96451 baked row literals; the only new step is the log10(factor) axis projection and the analytic reference line. Component-model curvature/sensitivity diagnostic only, not rigorous; changes no bound; establishes no operator positivity; Platt-Trudgian Lambda <= 0.2 remains SOTA; RH open; NO QED.',
    }),
    Object.freeze({
      route: '/viz-imp96478-count-gap-share',
      title: 'Count-Inversion Gap Split (+7/8 Share vs S(T) Residual)',
      oneLine:
        'Charts the imp-96445 split of the imp-96426 count-inversion relative gap into its deterministic +7/8-only share (60-73% majority at every intermediate anchor N=1e3..1e6) and its residual S(T) fluctuation share (27-40%, does not decay), with the backed-out S(gamma_N) wobble overlaid.',
      mathBucket: 'measurement',
      dataModule: 'src/data/imp-96478-count-gap-share-viz-data.js',
      paperSourcePath:
        'src/data/imp-96445-count-gap-plus78-vs-st-split.js (IMP96445_COUNT_GAP_PLUS78_VS_ST_SPLIT; imp-96478 viz page)',
      ticket: 'imp-96478',
      pedagogicalStep: 261,
      honestCeiling:
        'Presentation only: every N, plus78Fraction, stFraction and S(gamma_N) value plotted here is copied verbatim from the imp-96445 baked per-anchor split; the only new step is the log10(N) stacked-bar projection. Accuracy-audit diagnostic only, not rigorous; changes no bound; conditional C_H <= 0.127 stays UNPROVEN; Platt-Trudgian Lambda <= 0.2 remains SOTA; RH open; NO QED.',
    }),
    Object.freeze({
      route: '/viz-imp96494-sigma-knee-widened-grid',
      title: 'Widened-Grid sigma-Knee Resolution and Window-Exit Factor',
      oneLine:
        'Charts the imp-96464 widened-[1e7,1e13]-grid re-measurement of the imp-96451 sigma-knee: the D2 zero-crossing knee resolves at every 0.5x..2x E_trunc factor (elasticity ~-0.9115, matching the crossover and the on-window imp-96451 value), and marks the bisected factor f*~1.7847 where it exits the original [1e9,1e12] window.',
      mathBucket: 'measurement',
      dataModule: 'src/data/imp-96494-sigma-knee-widened-grid-viz-data.js',
      paperSourcePath:
        'src/data/imp-96464-sigma-knee-widened-grid-window-exit.js (IMP96464_SIGMA_KNEE_WIDENED_GRID_WINDOW_EXIT; imp-96494 viz page)',
      ticket: 'imp-96494',
      pedagogicalStep: 262,
      honestCeiling:
        'Presentation only: every factor, eTrunc, knee, crossover, gap and exit-factor value plotted here is copied verbatim from the imp-96464 baked row literals; the only new step is the log10(factor) axis projection and the analytic reference line. Component-model curvature/sensitivity diagnostic only, not rigorous; changes no bound; establishes no operator positivity; Platt-Trudgian Lambda <= 0.2 remains SOTA; RH open; NO QED.',
    }),
    Object.freeze({
      route: '/viz-imp96497-excursion-significance-sensitivity',
      title: 'imp-96452: Excursion-Significance Sensitivity (naive vs 2-sigma vs correlation-corrected)',
      oneLine:
        'Bar chart of the imp-96452 T = 1.5e5 excursion z-score across three fixed-depth scenarios: the cited naive z ~= 1.923 (n_w = 291), the 2-sigma target (n_w = 315, +24 windows / +8.12%), and the imp-96128 anti-correlation-corrected n_eff ~= 795 (z ~= 3.18).',
      mathBucket: 'measurement',
      dataModule: 'src/data/imp-96497-excursion-significance-sensitivity-viz-data.js',
      paperSourcePath:
        'src/data/imp-96452-excursion-confidence-2sigma-reach.js (IMP96452_EXCURSION_CONFIDENCE_2SIGMA_REACH; imp-96497 viz page)',
      ticket: 'imp-96497',
      pedagogicalStep: 263,
      honestCeiling:
        'Presentation only: every n_w/z-score/window-gap value plotted here is copied verbatim from the imp-96452 baked reach record; only the bar layout is computed here (no re-derivation). The naive ~1.9-sigma is a conservative lower bound on a single fixed-data-ceiling dip whose window is fully interior to the existing 10^6-ordinate set; reaching 2-sigma needs a deeper excursion from new interior data, not more verified-zero height. Changes no bound, establishes no operator positivity, no RH claim; Platt-Trudgian Lambda <= 0.2 remains SOTA; RH open; NO QED.',
    }),
    Object.freeze({
      route: '/viz-imp96498-solver-spread-count-shift-crossover',
      title: 'imp-96449: Solver-Path Spread vs Count-Model Shift',
      oneLine:
        'Log-log chart of the imp-96449 Newton-vs-Lambert-W solver-path gamma_N spread (flat, floating-point noise) against the ~1/N count-model reference shift (decaying) across N = 1e2 .. 1e22, marking the N ~ 1e15 crossover where the count-model shift underflows below the solver noise floor.',
      mathBucket: 'measurement',
      dataModule: 'src/data/imp-96498-solver-spread-count-shift-crossover-viz-data.js',
      paperSourcePath:
        'src/data/imp-96449-solver-path-spread-full-range.js (IMP96449_SOLVER_PATH_SPREAD_FULL_RANGE; imp-96498 viz page)',
      ticket: 'imp-96498',
      pedagogicalStep: 264,
      honestCeiling:
        'Presentation only: every spread/shift value plotted here is copied verbatim from the imp-96449 baked rows; only the log10 axis reshaping is computed here (no re-derivation). The N ~ 1e15 crossover is benign, not a real divergence: past that height both the solver-path residual and the count-model reference shift are numerically negligible (sub-ULP of a double-precision gamma_N). Solver-path / conditioning diagnostic only, not rigorous; changes no bound, establishes no operator positivity, no RH claim; Platt-Trudgian Lambda <= 0.2 remains SOTA; RH open; NO QED.',
    }),
    Object.freeze({
      route: '/viz-imp96520-offset-drift-ldrift-prediction',
      title: 'Offset-Drift L-Drift Prediction vs Measured',
      oneLine:
        'Charts the imp-96467 analytic leading L(N)-drift offset prediction against the imp-96431 measured (sigma-inflection minus crossover) offset drift across the ~5.24-decade crossover ladder, plus a slope-magnitude bar pair shading the ~17-21% residual sub-leading share the L-drift term over-predicts by.',
      mathBucket: 'measurement',
      dataModule: 'src/data/imp-96520-offset-drift-viz-data.js',
      paperSourcePath:
        'src/data/imp-96467-offset-drift-slope-vs-Ldrift-prediction.js (IMP96467_OFFSET_DRIFT_SLOPE_VS_LDRIFT_PREDICTION; imp-96520 viz page)',
      ticket: 'imp-96520',
      pedagogicalStep: 265,
      honestCeiling:
        'Presentation only: every crossoverLog10, offset and slope value plotted here is copied verbatim from the imp-96467 baked fit object; the only new step is sorting the rows and laying out the two charts. The analytic L-drift term reproduces the sign and near-linearity of the measured drift but over-predicts its slope by ~21%, so a residual sub-leading term is shaded, not closed; derivation/measurement diagnostic only, not rigorous; changes no bound, establishes no operator positivity, no RH claim; Platt-Trudgian Lambda <= 0.2 remains SOTA; RH open; NO QED.',
    }),
    Object.freeze({
      route: '/viz-imp96534-ar-effective-count-ladder',
      title: 'AR Effective-Count Ladder',
      oneLine:
        'Charts the imp-96489/imp-96509 excursion effective-count ladder: n_eff and z_eff climbing AR-0 (naive) -> AR-1 -> AR-2 -> AR-3 as successive negative higher-lag sine-process correlations are folded in, with the z_cons=1.9234 conservative floor and the rho_crit=+0.5744 sign-flip threshold marked.',
      mathBucket: 'measurement',
      dataModule: 'src/data/imp-96534-ar-effective-count-ladder-viz-data.js',
      paperSourcePath:
        'src/data/imp-96509-excursion-effective-significance-ar2.js (IMP96509_EXCURSION_EFFECTIVE_SIGNIFICANCE_AR2; imp-96534 viz page)',
      ticket: 'imp-96534',
      pedagogicalStep: 266,
      honestCeiling:
        'Presentation only: every n_eff/z_eff/correlation value plotted here is copied verbatim from the imp-96509 AR(p) resummation (which reproduces the imp-96489 AR-1 baseline exactly); the lag-2/lag-3 inputs are theoretical GUE sine-process box correlations, not empirical zero covariances, so the AR-2/AR-3 figures are indicative, not precise. The headline conservative z_cons = 1.9234 floor is unchanged and remains the strict lower bound; derivation/measurement diagnostic only, not rigorous; changes no bound, establishes no operator positivity, no RH claim; Platt-Trudgian Lambda <= 0.2 remains SOTA; RH open; NO QED.',
    }),
    Object.freeze({
      route: '/viz-imp96535-ledger-reconciliation',
      title: 'Excursion Ledger Reconciliation',
      oneLine:
        'Cards the imp-96512 height-by-height reconciliation of the imp-96493 interior z-score scan against the imp-96089 below-envelope dip table: the two shared heights (1.5e5, 3.0e5) agree bit-for-bit (max delta z = 0), the T=1e4 dip is dip-table-only, and nine dense heights are scan-only.',
      mathBucket: 'measurement',
      dataModule: 'src/data/imp-96535-ledger-reconciliation-viz-data.js',
      paperSourcePath:
        'src/data/imp-96512-excursion-significance-ledger-reconciliation.js (IMP96512_EXCURSION_SIGNIFICANCE_LEDGER_RECONCILIATION; imp-96535 viz page)',
      ticket: 'imp-96535',
      pedagogicalStep: 267,
      honestCeiling:
        'Presentation only: every Tc, nW, z, verdict and agreement flag shown here is copied verbatim from the imp-96512 baked height-by-height comparison; the only new step is picking a display nW/z per row and a ledger-membership category. Cross-validation only: changes no bound, establishes no operator positivity; Platt-Trudgian Lambda <= 0.2 remains SOTA; RH open; NO QED.',
    }),
    Object.freeze({
      route: '/viz-imp96554-two-exponent-relerr-cone',
      title: 'Two-Exponent relErr(T) Cone',
      oneLine:
        'Charts the imp-96528 two-exponent log-log relErr(T) cone: the systematic (p=0) vs sampling-noise (p=-1/4) power laws anchored through the imp-96493 T=1.5e5 measurement, the SE(p)~0.21 error cone, and the actual T=3.879e5 anchor falling outside both predictions.',
      mathBucket: 'measurement',
      dataModule: 'src/data/imp-96554-two-exponent-relerr-cone-viz-data.js',
      paperSourcePath:
        'src/data/imp-96528-independent-unclipped-height-count-exponent-fit-reach.js (IMP96528_INDEPENDENT_UNCLIPPED_HEIGHT_COUNT_EXPONENT_FIT_REACH; imp-96554 viz page)',
      ticket: 'imp-96554',
      pedagogicalStep: 268,
      honestCeiling:
        'Presentation only: SE(p), Delta_p and the separation-in-sigma are copied verbatim from the imp-96528 exponent-fit-reach verdict, and both relErr(T) measurements are copied verbatim from the imp-96493 interior scan; the only new computation is evaluating the two power laws and the cone bounds over a plotting grid. Neither exponent is established -- the fixed 10^6 Odlyzko set cannot resolve Delta_p=0.25 at better than ~1.16 sigma. Changes no bound, establishes no operator positivity; Platt-Trudgian Lambda <= 0.2 remains SOTA; RH open; NO QED.',
    }),
    Object.freeze({
      route: '/viz-imp96555-route-i-concentration-ladder',
      title: 'Route I Concentration Ladder',
      oneLine:
        'Charts the Route I uncertainty/concentration analysis: the classical prolate/Slepian curve lambda_0(c) with the dip time-bandwidth c_dip=0.4751 marked, the dip-window moment ladder falling from 0.3078 (free) to 0.0766 (three moments), and the pole-free sharp-pencil ratio nu_max=0.997689 sitting within 0.23% of a fully cancelling pencil.',
      mathBucket: 'measurement',
      dataModule: 'src/data/imp-96555-route-i-concentration-ladder-viz-data.js',
      paperSourcePath:
        'src/data/rh-route-i-uncertainty-concentration-certificate-2026-09-24.js (UNCERTAINTY_CERTIFICATE_LITERALS.slepian; imp-96555 viz page)',
      ticket: 'imp-96555',
      pedagogicalStep: 269,
      honestCeiling:
        'Presentation only: every lambda_0(c), dip-concentration, and nu_max value plotted here is copied verbatim from the Route I uncertainty/concentration certificate module. The pure concentration bound fails on its own (nu_max=0.997689 is a 0.23% cancellation); the certificate closes D_S <= L_S unconditionally by a different route (Theorem III, constant 9.04e-4), not via this concentration argument. Changes no bound, establishes no operator positivity; Platt-Trudgian Lambda <= 0.2 remains SOTA; RH open; NO QED.',
    }),
    Object.freeze({
      route: '/viz-imp96557-eflow-domination-kappa',
      title: 'E_flow-Domination Required Factor kappa(N)',
      oneLine:
        'Charts the imp-96409 E_flow-domination required-factor kappa(N)=E_coll/E_flow: the diagnostic-regime ladder rising monotonically from ~6.26 (N=1e3) to ~4.94e3 (N=1e12), plus the shallow global infimum ~5.30 at N~95.5 -- never reaching the kappa=1 parity line at any N.',
      mathBucket: 'measurement',
      dataModule: 'src/data/imp-96557-eflow-domination-kappa-viz-data.js',
      paperSourcePath:
        'src/data/imp-96409-eflow-domination-required-factor.js (IMP96409_EFLOW_DOMINATION_REQUIRED_FACTOR; imp-96557 viz page)',
      ticket: 'imp-96557',
      pedagogicalStep: 270,
      honestCeiling:
        'Presentation only: every ladder row and landmark value plotted here is copied verbatim from the imp-96409 required-factor measurement; the only new step is parsing "1eK" N-labels to numeric N and taking log10 for the plotting grid. E_coll stays GUE-conditional (imp-486, UNTOUCHED); the imp-398 pinned C_F is UNTOUCHED; no admissible mollifier reshaping can inflate C_F by the required x5-6x+. Changes no bound, establishes no operator positivity; Platt-Trudgian Lambda <= 0.2 remains SOTA; RH open; NO QED.',
    }),
    Object.freeze({
      route: '/viz-imp96560-basis-c-crossover-band-narrowing',
      title: 'Basis-C Corroboration-Reach Crossover Band Narrowing',
      oneLine:
        'Charts the imp-96479/imp-96444 de-jittering of the basis-C direct-integral floor estimator: the corroboration-reach crossover band narrows from [1.3e12,2.5e12] (width ratio ~1.92x, min-over-coarse-ppp) to a proper subset [1.38e12,1.76e12] (width ratio ~1.27x, median-over-resolved-ppp), plotted against the Platt-Trudgian anchor L=5.9e6.',
      mathBucket: 'measurement',
      dataModule: 'src/data/imp-96560-basis-c-crossover-band-narrowing-viz-data.js',
      paperSourcePath:
        'src/data/imp-96479-basis-c-floor-dejitter-glossary-headword.js (IMP96479_BASIS_C_FLOOR_DEJITTER_GLOSSARY_HEADWORD; imp-96560 viz page)',
      ticket: 'imp-96560',
      pedagogicalStep: 271,
      honestCeiling:
        'Presentation only: both band endpoints and the PT anchor value plotted here are copied verbatim from the imp-96479 baked verdict; the only new step is the shared log10(L) axis projection for the before/after range chart. The crossover L* remains an EXTRAPOLATION never evaluated at L~1e12; changes no bound, establishes no operator positivity; Platt-Trudgian Lambda <= 0.2 remains SOTA; RH open; NO QED.',
    }),
    Object.freeze({
      route: '/viz-imp96576-route-i-window-anatomy',
      title: 'Route I: Certified-Minimizer Window Anatomy',
      oneLine:
        'Bar chart of the Route I exact symbol-side certificate’s certified-minimizer signed window contributions to W(h): [0,3.597) -0.00925, [3.597,8.145) +0.22665, I_1 -0.34093, [9.875,17.54) +0.12563, I_2 -0.00451, rest +0.00338, summing to the true form value 9.7861e-4.',
      mathBucket: 'measurement',
      dataModule: 'src/data/imp-96576-route-i-certified-minimizer-window-anatomy-viz-data.js',
      paperSourcePath:
        'src/data/rh-route-i-uncertainty-concentration-certificate-2026-09-24.js (UNCERTAINTY_CERTIFICATE_LITERALS.anatomy, .certificate.T400N320; imp-96576 viz page)',
      ticket: 'imp-96576',
      pedagogicalStep: 272,
      honestCeiling:
        'Presentation only: every window part/energy value plotted here is copied verbatim from the certificate module\'s own baked anatomy literal (no re-derivation, no fresh solve); the minimizer itself is not interval-verified, only the T=400/N=320 Galerkin lower bound is. Changes no bound, establishes no operator positivity, no RH claim; Platt-Trudgian Lambda <= 0.2 remains SOTA; RH open; NO QED.',
    }),
    Object.freeze({
      route: '/viz-imp96577-route-i-certificate-constant-ladder',
      title: 'Route I: Certificate Constant vs. Truncation T',
      oneLine:
        'Plots the Route I certificate floor-cost ladder c(T) (rigorous lower bounds 8.2047e-4 at T=200 rising to 9.2918e-4 at T=800) against 1/T, alongside the from-above pencil-map Ritz value 9.46e-4, bracketing the true D_S<=L_S constant C* into [9.2918e-4, 9.46e-4].',
      mathBucket: 'measurement',
      dataModule: 'src/data/imp-96577-route-i-certificate-constant-ladder-viz-data.js',
      paperSourcePath:
        'src/data/rh-route-i-uncertainty-concentration-certificate-2026-09-24.js (UNCERTAINTY_CERTIFICATE_LITERALS.certificate.constantReconciliation; imp-96577 viz page)',
      ticket: 'imp-96577',
      pedagogicalStep: 273,
      honestCeiling:
        'Presentation only: every ladder value, extrapolant, and bracket endpoint plotted here is copied verbatim from the certificate module\'s own baked constantReconciliation literal (no re-derivation, no fresh solve); c(T) is a double-precision, non-interval lower bound and the two-term fit / Ritz value are point estimates, not proved bounds. Changes no bound, establishes no operator positivity, no RH claim; Platt-Trudgian Lambda <= 0.2 remains SOTA; RH open; NO QED.',
    }),
    Object.freeze({
      route: '/viz-imp96581-route-m-lammax-rigorous-vs-measured',
      title: 'Route M: lam_max(N) -- Rigorous Trace Bound vs. Measured Fit',
      oneLine:
        'Plots the imp-96548 rigorous SPD trace-domination upper bound lam_max(N)<=I(1,1)H_N (slope 1.2607) against the measured power-iteration fit 3.0247+0.3526 log N over N=250..6000, marking the ~3.6x slope gap and the ~1.92x curve-value gap at N=6000 (kept distinct from imp-96548\'s ~1.58x conditioning-ceiling ratio, a different quantity).',
      mathBucket: 'measurement',
      dataModule: 'src/data/imp-96581-route-m-lammax-rigorous-vs-measured-viz-data.js',
      paperSourcePath:
        'src/data/imp-96548-route-m-lammax-rigorous-upper-bound-assessment.js (IMP96548_INPUTS, IMP96548_CEILING; imp-96581 viz page)',
      ticket: 'imp-96581',
      pedagogicalStep: 274,
      honestCeiling:
        'Presentation only: every curve value is recomputed verbatim from the imp-96548 baked inputs (I(1,1), gamma, fit coefficients); no new measurement. The rigorous curve is an unconditional SPD trace-domination upper bound, not a match to the measured coefficient. Changes no bound, establishes no operator positivity, no RH claim; Platt-Trudgian Lambda <= 0.2 remains SOTA; RH open; NO QED.',
    }),
    Object.freeze({
      route: '/viz-imp96663-route-m-condfit-ladder',
      title: 'Route M: Directly-Measured cond#(N) Ladder and Ceiling Markers',
      oneLine:
        'Plots the imp-96570 directly-measured cond#(N)=lam_max/lam_min ladder (N=250,3000..6000), its single-object power fit (q~1.9557 dense, R^2=0.99975), and the three conditioning ceilings (rigorous lower 2.59e7, composed measured 4.11e7, independent dense 4.30e7) against the imp-96352 wall-clock compute ceiling ~9916 on a log-log axis.',
      mathBucket: 'measurement',
      dataModule: 'src/data/imp-96663-route-m-condfit-ladder-viz-data.js',
      paperSourcePath:
        'src/data/imp-96570-route-m-conditioning-ceiling-crossvalidation.js (IMP96570_COND_ROWS, IMP96570_FIT, IMP96570_CROSSCHECK; imp-96663 viz page)',
      ticket: 'imp-96663',
      pedagogicalStep: 286,
      honestCeiling:
        'Presentation only: every ladder row, fit coefficient, and ceiling value plotted here is copied verbatim from the imp-96570 baked literals (no re-derivation, no fresh solve); the power-law extrapolation is a double-precision, non-interval point estimate, not a proved bound. Changes no bound, establishes no operator positivity, no RH claim; Platt-Trudgian Lambda <= 0.2 remains SOTA; RH open; NO QED.',
    }),
    Object.freeze({
      route: '/viz-imp96598-sine-kernel-lag-decay',
      title: 'Box-Averaged GUE Sine-Kernel Lag Decay: rho_k vs k',
      oneLine:
        'Plots the imp-96567 direct box lag correlations rho_1..rho_6 against the closed-form O(1/k^2) tail rho_k=-(1/(2 pi^2 Sigma^2))ln(k^2/(k^2-1)), marking the ~8.9x gap between rho_1=-0.4640 and the tail curve\'s k=1 extrapolation (a false-anchoring artifact) and the bounded telescoping tail sum sum_{k>=2} rho_k=-0.036022.',
      mathBucket: 'measurement',
      dataModule: 'src/data/imp-96598-sine-kernel-lag-decay-viz-data.js',
      paperSourcePath:
        'src/data/imp-96567-box-averaged-sine-kernel-lag-decay.js (numberVariance, directLagCorrelations, closedFormTail, reconciliation, tailBudget; imp-96598 viz page)',
      ticket: 'imp-96598',
      pedagogicalStep: 275,
      honestCeiling:
        'Presentation only: every value plotted is reused verbatim from imp-96567\'s baked inputs; only the closed-form curve over an extended k-range is recomputed here from those same inputs, using the identical formula. Conditional on the GUE sine kernel / Montgomery pair correlation for the zeta zeros (UNPROVEN). Changes no bound, establishes no operator positivity, no RH claim; Platt-Trudgian Lambda <= 0.2 remains SOTA; RH open; NO QED.',
    }),
    Object.freeze({
      route: '/viz-imp96600-basis-c-floor-ladder',
      title: 'Basis-C floor(L) Ladder: Optimum-ppp Collapse and Super-linear Growth',
      oneLine:
        'Plots the imp-96568 basis-C direct-integral floor(L) at five rungs (1e3, 1e5, 1e6, PT anchor 5.9e6, 1e7) on log-log axes, colored by the optimum-ppp collapse (256 -> 48 -> 6 -> pinned 3), with a fitted dashed line through the two ppp-pinned rungs showing the above-anchor super-linear exponent p~1.81.',
      mathBucket: 'measurement',
      dataModule: 'src/data/imp-96600-basis-c-floor-ladder-viz-data.js',
      paperSourcePath:
        'src/data/imp-96568-basis-c-intermediate-rung-floor-ladder.js (floorLadder, floorGrowth; imp-96600 viz page)',
      ticket: 'imp-96600',
      pedagogicalStep: 276,
      honestCeiling:
        'Presentation only: every ladder value is reused verbatim from imp-96568; only the log10 reshaping and the ppp-pinned regime split are new. imp-96568 itself is a theoretical GUE quantity (no computed zeros) and the above-anchor exponent is fit from only two rungs. Changes no bound, establishes no operator positivity, no RH claim; Platt-Trudgian Lambda <= 0.2 remains SOTA; RH open; NO QED.',
    }),
    Object.freeze({
      route: '/viz-imp96739-basis-c-above-anchor-ladder-lstar-crossover',
      title: 'Basis-C Above-Anchor Floor Ladder and the L* Corroboration-Reach Crossover',
      oneLine:
        'Plots the imp-96690 five-rung above-anchor basis-C floor(L) ladder (PT anchor 5.9e6 through 5e7) on log-log axes alongside the imp-96712 three-model L* bracket [7.6e7,8.2e7] (yellow band), the imp-96690 constant-OLS crossover baseline inside it (~8.08e7, red dashed line), and the earlier looser imp-96568 two-point projection (~1.9e8, grey dotted line) for scale contrast.',
      mathBucket: 'measurement',
      dataModule: 'src/data/imp-96739-basis-c-above-anchor-ladder-lstar-crossover-viz-data.js',
      paperSourcePath:
        'src/data/imp-96690-basis-c-above-anchor-rung-ladder.js (aboveAnchorRungs, crossover); src/data/imp-96712-basis-c-accelerating-exponent-model.js (bracket); imp-96739 viz page',
      ticket: 'imp-96739',
      pedagogicalStep: 277,
      honestCeiling:
        'Presentation only: every ladder, bracket, and crossover value is reused verbatim from imp-96690/imp-96712; only the log10 reshaping is new. Both source modules are theoretical GUE quantities (no computed zeros) and every L* figure is a projection, not a measured reach. Changes no bound, establishes no operator positivity, no RH claim; Platt-Trudgian Lambda <= 0.2 remains SOTA; RH open; NO QED.',
    }),
    Object.freeze({
      route: '/viz-imp96604-lammax-normalized-ratio',
      title: 'Normalized lam_max Ratios: Still ~2x Their Asymptotic Targets',
      oneLine:
        'Plots the imp-96562 two normalized lam_max ratio series against N=250..6000 (lam_max/log N: 0.8929 -> 0.6968 targeting 0.3526; lam_max/trace: 0.6410 -> 0.5183 targeting 0.2797) with dashed target lines, showing both remain > 1.8x their asymptotic targets at the top rung.',
      mathBucket: 'measurement',
      dataModule: 'src/data/imp-96604-lammax-normalized-ratio-viz-data.js',
      paperSourcePath:
        'src/data/imp-96562-route-m-lammax-offdiagonal-szego-assessment.js (IMP96562_ROWS, IMP96562_NUMERICAL_PINNABILITY; imp-96604 viz page)',
      ticket: 'imp-96604',
      pedagogicalStep: 277,
      honestCeiling:
        'Presentation only: every ratio value is reused verbatim from imp-96562; only the two-series reshape and target-line overlay are new. imp-96562 itself is a re-analysis measurement (Szego route does not apply; no bound moved). Changes no bound, establishes no operator positivity, no RH claim; Platt-Trudgian Lambda <= 0.2 remains SOTA; RH open; NO QED.',
    }),
    Object.freeze({
      route: '/viz-imp96606-cert-limit-crossover',
      title: 'Double-Precision Cert Limit: delta(N) vs lam_min(N) Crossover',
      oneLine:
        'Plots the imp-96591 delta(N) = g_{n+1} I(1,1) H_N rounding-shift ladder (rising) against the imp-96428 lam_min(N) ~ A N^-p fit (falling) on log-log axes across N=1e4..2.59e7, marking the measured crossover N ~ 1.0757e5, the imp-96352 compute ceiling 9916, and the imp-96548 conditioning ceiling ~2.59e7.',
      mathBucket: 'measurement',
      dataModule: 'src/data/imp-96606-cert-limit-crossover-viz-data.js',
      paperSourcePath:
        'src/data/imp-96591-route-m-lammin-cert-limit-crossover-measurement.js (IMP96591_CROSSOVER_LADDER, IMP96591_MEASURED_CROSSOVER; imp-96606 viz page)',
      ticket: 'imp-96606',
      pedagogicalStep: 278,
      honestCeiling:
        'Presentation only: every ladder value and the crossover figure are reused verbatim from imp-96591 (itself a re-analysis of the imp-96428 fit and the imp-96563 Higham/Rump rounding-shift formula); only the log10 reshape and marker packaging are new. Changes no bound, establishes no operator positivity, no RH claim; Platt-Trudgian Lambda <= 0.2 remains SOTA; RH open; NO QED.',
    }),
    Object.freeze({
      route: '/viz-imp96621-sigma2-lammin-margin-ladder',
      title: 'lambda_min(T_a[sigma_2]) Margin Ladder vs 2a, and the sigma_1 Sign Ambiguity Near ln 3',
      oneLine:
        'Plots the rh-route-i-toeplitz-krein-certificate lambda_min(T_a[sigma_2]) margin ladder across 2a=0.90..1.16 (falling from 56.05 through 0.552 at (ln 3)/2 to a zero crossing between 2a=1.12 and 1.1316, well past the interval-verified theorem wall 2a=0.96), alongside the CC Q-trick lambda_min(T_a[sigma_1]) ladder and its raw sign-straddle at exactly (ln 3)/2 (tcut300 negative, tcut800 positive) that the tail-inclusive recompute resolves positive.',
      mathBucket: 'measurement',
      dataModule: 'src/data/imp-96621-sigma2-lammin-margin-ladder-viz-data.js',
      paperSourcePath:
        'src/data/rh-route-i-toeplitz-krein-certificate-2026-09-24.js (TOEPLITZ_KREIN_LITERALS.lambdaMinSigma2, .lambdaMinSigma1Full; imp-96621 viz page)',
      ticket: 'imp-96621',
      pedagogicalStep: 279,
      honestCeiling:
        'Presentation only: every ladder value, the crossing bracket, and the sigma_1 straddle/resolution are reused verbatim from the Route I Toeplitz/Krein certificate literals; only the ladder reshape and chart packaging are new. The zero crossing is a floating-point Rayleigh-Ritz measurement past the interval-verified range, not a proof of failure; establishes no operator positivity, no RH claim; Platt-Trudgian Lambda <= 0.2 remains SOTA; RH open; NO QED.',
    }),
    Object.freeze({
      route: '/viz-imp96640-route-m-rankr-power-iteration-bracket',
      title: 'Route M: Rank-r Power-Iteration Bracket on the lam_max Log-Slope',
      oneLine:
        'Plots the imp-96612 rank-r power-iteration moment-ratio log-slopes b_r (r=0..11) as a fraction of the measured Vasyunin lam_max log-slope 0.3526, showing monotone climb from 0 through the r=1 rank-one one-step (4.7%) to within 25% at r=4 and within 10% at r=6 collective modes.',
      mathBucket: 'measurement',
      dataModule: 'src/data/imp-96640-rankr-power-iteration-bracket-viz-data.js',
      paperSourcePath:
        'src/data/imp-96612-route-m-lammax-rankr-power-iteration-bracket.js (IMP96612_RANKR_SLOPES, IMP96612_MODE_COUNT; imp-96640 viz page)',
      ticket: 'imp-96640',
      pedagogicalStep: 280,
      honestCeiling:
        'Presentation only: every ladder value (slope, ratio, r2) is reused verbatim from imp-96612; only the ratio-to-target bar reshape is new. R_r -> lam_max by SPD power/Lanczos construction, so convergence to 0.3526 measures the coefficient collective rank, not an independent prediction. Changes no bound, establishes no operator positivity, no RH claim; Platt-Trudgian Lambda <= 0.2 remains SOTA; RH open; NO QED.',
    }),
    Object.freeze({
      route: '/viz-imp96721-sigma2-emp-vs-gue',
      title: 'Basis-C: Empirical Sigma2 (Real Zeros) vs. Exact GUE Sigma2',
      oneLine:
        'Contrasts the imp-96695 empirical number variance Sigma2_emp(L) (measured from real Odlyzko zeros up to T ~ 1.13e6) against the exact GUE sine-kernel Sigma2_GUE(L), marking the L ~ 3-8 finite-height departure onset and the ~100x safe-direction shrinkage of the |rho + 1/2| corroboration signal at L=960.',
      mathBucket: 'measurement',
      dataModule: 'src/data/imp-96721-sigma2-emp-vs-gue-viz-data.js',
      paperSourcePath:
        'src/data/imp-96695-basis-c-empirical-rho-vs-gue-crossvalidation.js (IMP96695_RHO_TABLE, IMP96695_SATURATION_SWEEP; imp-96721 viz page)',
      ticket: 'imp-96721',
      pedagogicalStep: 281,
      honestCeiling:
        'Presentation only: every Sigma2/rho value is reused verbatim from imp-96695; the |rho + 1/2| signal columns are a direct arithmetic reshape of the same baked rhoEmp/rhoGue values. Measures a finite-height (Berry semiclassical) number-variance saturation effect, not a GUE-universality failure; moves no bound, establishes no operator positivity, no RH claim; Platt-Trudgian Lambda <= 0.2 remains SOTA; RH open; NO QED.',
    }),
    Object.freeze({
      route: '/viz-imp96641-gmin-gue-envelope',
      title: 'g_min(N)/y_N Extreme-Gap Decay vs. the GUE Median Envelope',
      oneLine:
        'Plots the imp-96616 running-min g_min(N)/y_N extreme-gap ladder (N=50..1e6, fit exponent -0.3953) on a log-log axis against the GUE median envelope 0.8582 N^-1/3, marking the three argmin-freeze plateaus (idx 6708, 95247, 420890) where the running-min record gap has not moved between rungs.',
      mathBucket: 'measurement',
      dataModule: 'src/data/imp-96641-gmin-gue-envelope-viz-data.js',
      paperSourcePath:
        'src/data/imp-96616-gmin-ratio-extreme-gap-decay.js (GMIN_RATIO_EXTREME_GAP_DECAY.ladder, .fit, .gue; imp-96641 viz page)',
      ticket: 'imp-96641',
      pedagogicalStep: 282,
      honestCeiling:
        'Presentation only: every ladder value (N, ratio, gueMedian, ratioOverGue, argminIdx) is reused verbatim from imp-96616; only the log-log chart reshape and the isPlateau flag (derived from repeated argminIdx) are new. Changes no bound, establishes no operator positivity, no RH claim; the measured exponent stays conditional on no proven small-gaps theorem; Platt-Trudgian Lambda <= 0.2 remains SOTA; RH open; NO QED.',
    }),
    Object.freeze({
      route: '/viz-imp96646-krein-certificate-margin',
      title: 'Krein Sigma2 Certificate Margin: Verified Rungs, eps -> 0 Wall, ln2 / ln3',
      oneLine:
        'Plots the three interval-verified Route I Krein sigma_2 certificate rungs (2a=0.90/0.94/0.96) against the exactly-linear certified margin eps(2a)=200(1-2a) and the log-linear tail l1-norm growth, marking the projected eps->0 double-precision LP wall (2a in [1.00,1.04]) and the ln2/ln3 landmarks on a reach diagram.',
      mathBucket: 'measurement',
      dataModule: 'src/data/imp-96646-krein-certificate-margin-viz-data.js',
      paperSourcePath:
        'src/data/rh-route-i-toeplitz-krein-certificate-2026-09-24.js (TOEPLITZ_KREIN_LITERALS.epsMarginDecay, .normGrowthLaw, .priorRange; imp-96646 viz page)',
      ticket: 'imp-96646',
      pedagogicalStep: 283,
      honestCeiling:
        'Presentation only: every anchor and fit coefficient (eps, l1, slopes, intercepts, wall band, ln2/ln3) is reused verbatim from the Route I Krein certificate literals; only the paired chart and reach-diagram reshape are new. The double-precision LP wall is a conditioning symptom of the certificate norm, not a positivity failure (lambda_min(T_a[sigma_2]) stays positive well past 2a=1.0). Changes no bound, establishes no operator positivity, no RH claim; Platt-Trudgian Lambda <= 0.2 remains SOTA; RH open; NO QED.',
    }),
    Object.freeze({
      route: '/viz-imp96661-krein-ft-curve',
      title: 'Krein Sigma2 Certificate Positivity Margin: F(t) Over t in [0,60]',
      oneLine:
        'Plots F(t)=sigma_2(t)+nu(t) itself (not a summary statistic) over t in [0,60] for both interval-verified Route I Krein certificates (2a=0.9, 2a=0.96), marking the imp-96633 reported worst points and zooming into the sigma_2/nu near-cancellation window around t~11 where the 2a=0.96 curve oscillates rapidly.',
      mathBucket: 'measurement',
      dataModule: 'src/data/imp-96661-krein-ft-curve-viz-data.js',
      paperSourcePath:
        'src/data/rh-route-i-toeplitz-krein-certificate-2026-09-24.js (certificateF/sigma2, sampled offline by tmp/imp-96661-sample-curve.mjs); src/data/imp-96633-krein-worst-point-crosscheck.js (worst points); src/data/imp-96651-krein-096-fine-extended-scan.js (refined dip)',
      ticket: 'imp-96661',
      pedagogicalStep: 284,
      honestCeiling:
        'Presentation only: the two curves and zoom panel were generated offline from the already-committed double-precision certificateF/sigma2 against the baked certificate coefficient tables (no new numerics), then baked as literals; the worst-point and dip markers reproduce the imp-96633/imp-96651 values exactly. Changes no bound, establishes no operator positivity, no RH claim; Platt-Trudgian Lambda <= 0.2 remains SOTA; RH open; NO QED.',
    }),
    Object.freeze({
      route: '/viz-imp96662-lammax-rankr-slope-onset',
      title: 'Route M lam_max Rank-r Slope Accumulation: b_r vs r',
      oneLine:
        'Plots the imp-96612 discrete rank-r Rayleigh log-slope table b_r against the imp-96636 logistic fit (r0=2.94, k=0.86, R^2=0.996, the honest sigmoidal summary) and overlays the requested fixed-amplitude single-exponential fit (r0=3.22, R^2=0.919) to show why the exponential ansatz misses the delayed, S-shaped onset.',
      mathBucket: 'measurement',
      dataModule: 'src/data/imp-96662-lammax-rankr-slope-onset-viz-data.js',
      paperSourcePath:
        'src/data/imp-96636-route-m-lammax-slope-saturation-fit.js (both fits and the discrete b_r table)',
      ticket: 'imp-96662',
      pedagogicalStep: 285,
      honestCeiling:
        'Presentation only: both curves are baked literals computed offline from the closed-form fit parameters already reported in imp-96636 (no new curve_fit run); the imp-96636 module is not imported at runtime. Changes no bound, establishes no operator positivity; the underlying fit is a measurement of a surrogate that converges to lam_max by construction, not a closed-form derivation of the 0.3526 coefficient. Platt-Trudgian Lambda <= 0.2 remains SOTA; RH open; NO QED.',
    }),
    Object.freeze({
      route: '/viz-imp96670-route-m-lammax-majorants',
      title: 'Route M lam_max Majorants: Row-Sum vs Moment Family',
      oneLine:
        'Plots the imp-96648 four unconditional lam_max majorants (Gershgorin row-sum, Brauer/Cassini, Frobenius, Wolkowicz-Styan) against the measured power-iteration lam_max and the imp-96548 trace bound over N=250..6000, labeling each curve\'s re-solved conditioning ceiling: row-sum/Brauer sit below the trace ceiling 2.59e7 (fails), Frobenius/Wolkowicz-Styan raise it to 3.75e7 (~76% of the way to the measured 4.11e7), all far above the imp-96352 compute ceiling ~9916.',
      mathBucket: 'measurement',
      dataModule: 'src/data/imp-96670-route-m-lammax-majorants-viz-data.js',
      paperSourcePath:
        'src/data/imp-96648-route-m-lammax-frobenius-moment-majorant.js (IMP96648_ROWS, IMP96648_CEILINGS, IMP96648_GAP, IMP96648_VERDICT; imp-96670 viz page)',
      ticket: 'imp-96670',
      pedagogicalStep: 286,
      honestCeiling:
        'Presentation only: every curve value and ceiling is reused verbatim from imp-96648 (rigorous, unconditional matrix inequalities measured on the same exact Vasyunin Gram as imp-96105/imp-96443); no re-solve. Changes no bound, establishes no operator positivity, no RH claim; Platt-Trudgian Lambda <= 0.2 remains SOTA; RH open; NO QED.',
    }),
    Object.freeze({
      route: '/viz-imp96683-route-m-conditioning-ceiling-ci',
      title: 'Route M Conditioning-Ceiling Confidence Interval',
      oneLine:
        'Plots the imp-96656 asymmetric log-normal conditioning-ceiling confidence interval (all-rung N*=3.78e7, 95% CI [3.50e7,4.07e7]; dense N*=4.30e7, 95% CI [2.76e7,6.69e7]) as horizontal error bars on a log-N axis, marking the imp-96548 rigorous trace lower ceiling 2.59e7, the imp-96648 Frobenius sharper lower ceiling 3.75e7, and the imp-96352 compute ceiling 9916, showing compute binds ~2800x below every band edge.',
      mathBucket: 'measurement',
      dataModule: 'src/data/imp-96683-route-m-conditioning-ceiling-ci-viz-data.js',
      paperSourcePath:
        'src/data/imp-96656-route-m-conditioning-ceiling-confidence-interval.js (IMP96656_ALL, IMP96656_DENSE, IMP96656_INTERVAL; imp-96683 viz page)',
      ticket: 'imp-96683',
      pedagogicalStep: 289,
      honestCeiling:
        'Presentation only: every band edge and point estimate is reused verbatim from imp-96656 (delta-method log-normal CI), the Frobenius reference ceiling from imp-96648, and the compute ceiling from imp-96352; no re-fit, no new numerics. Changes no bound, establishes no operator positivity, no RH claim; Platt-Trudgian Lambda <= 0.2 remains SOTA; RH open; NO QED.',
    }),
    Object.freeze({
      route: '/viz-imp96701-frobenius-majorant-eleven-rung',
      title: 'Route M Frobenius Majorant: Eleven-Rung Ladder N=250..9000',
      oneLine:
        'Plots the imp-96684 eleven-rung Frobenius / Wolkowicz-Styan majorant (imp-96648 eight rungs N=250..6000 plus three new measured rungs N=7000,8000,9000) against the measured lam_max and trace, showing the majorant slope flattens ~1.7% while the re-solved rigorous-lower conditioning ceiling barely shifts (3.748e7 -> 3.764e7, +0.42%): ROBUST, not tightened.',
      mathBucket: 'measurement',
      dataModule: 'src/data/imp-96701-frobenius-majorant-eleven-rung-viz-data.js',
      paperSourcePath:
        'src/data/imp-96684-route-m-frobenius-majorant-high-n-rungs.js (IMP96684_NEW_ROWS, IMP96684_CEILINGS, IMP96684_CEILING_SHIFT, IMP96684_VERDICT; imp-96701 viz page)',
      ticket: 'imp-96701',
      pedagogicalStep: 290,
      honestCeiling:
        'Presentation only: every curve value and ceiling is reused verbatim from imp-96648 (eight committed rungs) and imp-96684 (three new rungs + re-fit ceilings); no re-solve, no new numerics. Changes no bound, establishes no operator positivity, no RH claim; Platt-Trudgian Lambda <= 0.2 remains SOTA; RH open; NO QED.',
    }),
    Object.freeze({
      route: '/viz-imp96702-route-m-reach-projection',
      title: 'Route M Reach Projection: Gap Floor vs Compute Ceiling',
      oneLine:
        'Plots the imp-96569 RH-vs-plateau gap (0.0154) against the two fluctuation scales it must clear (sigma_scatter 0.0125, sigma_MB 0.0089, both larger than the gap) and the nine projected reach-N corners (confidence z x drift exponent q), every one landing 1.4 to 11.6 orders of magnitude beyond the imp-96352 compute ceiling N ~ 9916.',
      mathBucket: 'measurement',
      dataModule: 'src/data/imp-96702-route-m-reach-projection-viz-data.js',
      paperSourcePath:
        'src/data/imp-96569-route-m-window-reach-projection.js (IMP96569_SCALES, IMP96569_GAP_FLOOR, IMP96569_PROJECTION, IMP96569_HEADLINE; imp-96702 viz page)',
      ticket: 'imp-96702',
      pedagogicalStep: 291,
      honestCeiling:
        'Presentation only: every gap, sigma, and reach-N value is reused verbatim from imp-96569 (SE-of-mean reach projection, an optimistic lower bound); no re-fit, no new numerics. Changes no bound, establishes no operator positivity, no RH claim; Platt-Trudgian Lambda <= 0.2 remains SOTA; RH open; NO QED.',
    }),
    Object.freeze({
      route: '/viz-imp96777-krein-lammin-n-trend',
      title: 'Route I Krein Floor: lambda_min(T_a[sigma_2]) vs N',
      oneLine:
        'Plots the imp-96749 N-trend of the Rayleigh-Ritz upper floor lambda_min(T_a[sigma_2]) at 2a in {1.00,1.05,ln3} over N=20..76, each curve normalised to its own N=20 value, with the double-precision-trustworthy window (N<=52, condB<=4.6e12) shaded and the Gram-conditioning wall onset (N=60, condB crosses 1e13) marked -- past the wall the visible decrement re-acceleration is a conditioning artifact, not spectral collapse.',
      mathBucket: 'measurement',
      dataModule: 'src/data/imp-96777-krein-lammin-n-trend-viz-data.js',
      paperSourcePath:
        'src/data/imp-96749-krein-lammin-N-trend-measurement.js (IMP96749_LADDER, IMP96749_NS, IMP96749_CONDB, IMP96749_TRUSTED, IMP96749_VERDICT; imp-96777 viz page)',
      ticket: 'imp-96777',
      pedagogicalStep: 292,
      honestCeiling:
        'Presentation only: every floor value, condB reading, and window boundary is reused verbatim from imp-96749 (Rayleigh-Ritz upper floor, not an operator positivity proof); no re-solve, no new numerics. Changes no bound, establishes no operator positivity, no RH claim; interval-rigorous certificate reach stays 2a<=0.96; Platt-Trudgian Lambda <= 0.2 remains SOTA; RH open; NO QED.',
    }),
    Object.freeze({
      route: '/viz-imp96779-route-m-ceiling-ladder',
      title: 'Route M Conditioning-Ceiling Ladder',
      oneLine:
        'Plots the imp-96682 reconciled four-rung Route M conditioning-ceiling ladder (imp-96352 compute 9916 < imp-96548 rigorous trace 2.594e7 < imp-96648 rigorous Frobenius 3.75e7 < imp-96443/96570/96656 measured/fit 4.109e7) as bars on a log10(N) axis, labelling the traceOverCompute/frobeniusOverTrace/measuredOverFrobenius adjacency ratios between rungs and showing compute binds first by >=1500x.',
      mathBucket: 'measurement',
      dataModule: 'src/data/imp-96779-route-m-ceiling-ladder-viz-data.js',
      paperSourcePath:
        'src/data/imp-96682-route-m-conditioning-ceiling-ladder-status.js (IMP96682_LADDER, IMP96682_RATIOS, IMP96682_VERDICT; imp-96779 viz page)',
      ticket: 'imp-96779',
      pedagogicalStep: 293,
      honestCeiling:
        'Presentation only: every ladder value and ratio is reused verbatim from imp-96682 (itself a pure reconciliation of imp-96352/96548/96648/96443/96570/96656, no new measurement); no bound moved, no operator positivity established, no RH claim; Platt-Trudgian Lambda <= 0.2 remains SOTA; RH open; NO QED.',
    }),
    Object.freeze({
      route: '/viz-imp96671-spectral-share-vs-measured-slope',
      title: 'Route M Sigmoid Onset: Two-Scale Weight Share vs Measured Slope Fraction',
      oneLine:
        'Plots the imp-96652 two-scale closed-form top-eigenpair weight share s_r = 1/(1+exp(-(r-r0)/k)) -- width k=1/ln(lam1/lam2) from the top gap ratio, half-saturation r0 from the small top overlap w1~8.7% -- against the measured imp-96612 rank-r Rayleigh log-slope fraction b_r/L, with the exact (non-idealized) N=3000 top-share overlaid for reference.',
      mathBucket: 'measurement',
      dataModule: 'src/data/imp-96671-spectral-share-vs-measured-slope-viz-data.js',
      paperSourcePath:
        'src/data/imp-96652-route-m-lammax-sigmoid-onset-spectral-derivation.js (IMP96652_TWOSCALE_AVG, IMP96652_SHARE_N3000; imp-96671 viz page)',
      ticket: 'imp-96671',
      pedagogicalStep: 287,
      honestCeiling:
        'Presentation only: the two-scale curve is computed at render time from baked closed-form parameters already reported in imp-96652 (no new numerics); the measured points and exact-share overlay are baked literals reused verbatim. Does not close IMP96562_SUBGAP, changes no bound, establishes no operator positivity, no RH claim; Platt-Trudgian Lambda <= 0.2 remains SOTA; RH open; NO QED.',
    }),
    Object.freeze({
      route: '/viz-imp96679-gmin-ratio-sawtooth',
      title: 'GUE Running-Min Sawtooth: ratioOverGue Plateaus and Record-Gap Resets',
      oneLine:
        'Plots the imp-96654 ratioOverGue = g_min(N)/(0.8582 N^-1/3) sawtooth over the imp-96616 14-rung ladder (N=50..1e6) on a log-log axis, tagging each rung as an argmin-freeze plateau continuation (rising as N^+1/3, x1.2599 per doubling) or a fresh record-gap reset, against the y=1 GUE median crossing.',
      mathBucket: 'measurement',
      dataModule: 'src/data/imp-96679-gmin-ratio-sawtooth-viz-data.js',
      paperSourcePath:
        'src/data/imp-96654-gmin-crossover-sensitivity-oscillation.js (GMIN_CROSSOVER_SENSITIVITY_OSCILLATION.oscillation; imp-96679 viz page)',
      ticket: 'imp-96679',
      pedagogicalStep: 288,
      honestCeiling:
        'Presentation only: every ladder value (N, ratioOverGue, argminIdx) is reused verbatim from imp-96616 and every doubling/jump/oscillation figure is reused verbatim from imp-96654; only the plateau/reset flags and the log-log chart reshape are new. Changes no bound, establishes no operator positivity, no RH claim; the measured exponent stays conditional on no proven small-gaps theorem; Platt-Trudgian Lambda <= 0.2 remains SOTA; RH open; NO QED.',
    }),
    Object.freeze({
      route: '/viz-imp96723-route-m-three-ceiling-decomposition',
      title: 'Route M Three-Ceiling Decomposition',
      oneLine:
        'Plots the imp-96693 audited three-ceiling Route M decomposition (rigorous trace-domination T 2.594e7 < Frobenius fit F 3.764e7 < measured M 4.109e7) as bars on a log10(N) axis with each ceiling labelled fit-vs-rigorous, and the F/T ~1.45x and M/F ~1.09x adjacency ratios labelled between rungs, showing the two legs multiply exactly to the total M/T ~1.58x ratio.',
      mathBucket: 'measurement',
      dataModule: 'src/data/imp-96723-route-m-three-ceiling-decomposition-viz-data.js',
      paperSourcePath:
        'src/data/imp-96693-route-m-conditioning-ceiling-residual-decomposition.js (IMP96693_CEILINGS, IMP96693_RATIOS, IMP96693_DECOMPOSITION, IMP96693_VERDICT; imp-96723 viz page)',
      ticket: 'imp-96723',
      pedagogicalStep: 294,
      honestCeiling:
        'Presentation only: every ceiling value and ratio is reused verbatim from imp-96693 (itself a pure re-analysis of the imp-96684 bisection-solved ceilings, no new numerics); the Frobenius and measured ceilings inherit a log-fit extrapolation sub-gap, only the trace ceiling is a rigorous lower bound. Changes no bound, establishes no operator positivity, no RH claim; Platt-Trudgian Lambda <= 0.2 remains SOTA; RH open; NO QED.',
    }),
    Object.freeze({
      route: '/viz-imp96741-route-m-three-ceiling-decomposition',
      title: 'Route M Three-Ceiling Conditioning Decomposition (T < F < M)',
      oneLine:
        'Horizontal bar chart of the imp-96713 re-audited three Route M lam_max conditioning ceilings (rigorous trace-domination T 2.594e7, Frobenius fit F 3.775e7 updated to the imp-96694 N=12000 re-solve, measured composed M 4.109e7), annotated with the M/F ~1.09x residual factor, the (F-T)/(M-T) ~78% gap-fraction, and the invariant total M/T ~1.58x ratio.',
      mathBucket: 'measurement',
      dataModule: 'src/data/imp-96741-route-m-three-ceiling-decomposition-viz-data.js',
      paperSourcePath:
        'src/data/imp-96713-route-m-conditioning-ceiling-decomposition-reaudit.js (IMP96713_CEILINGS, IMP96713_RATIOS, IMP96713_GAP_FRACTION, IMP96713_DECOMPOSITION); imp-96741 viz page',
      ticket: 'imp-96741',
      pedagogicalStep: 295,
      honestCeiling:
        'Presentation only: every ceiling, ratio, and gap-fraction value is reused verbatim from imp-96713 (a pure re-analysis of the imp-96684/imp-96694 ceilings, no new numerics); only the trace ceiling is a rigorous lower bound, the Frobenius and measured ceilings inherit a log-fit extrapolation sub-gap. Changes no bound, establishes no operator positivity, no RH claim; Platt-Trudgian Lambda <= 0.2 remains SOTA; RH open; NO QED.',
    }),
    Object.freeze({
      route: '/viz-imp96742-safe-direction-sign-per-rung',
      title: 'Basis-C: Per-Rung Safe-Direction Sign d_sig(L)',
      oneLine:
        'Bar chart of the imp-96714 per-rung safe-direction sign d_sig(L) = |rho_emp(L)+1/2| - |rho_GUE(L)+1/2| across the imp-96430 calibration window (L=30..960), colored by whether the imp-96695 safe-direction claim holds (d_sig<0, L>=120) or fails (d_sig>0, L in {30,60}).',
      mathBucket: 'measurement',
      dataModule: 'src/data/imp-96742-safe-direction-sign-per-rung-viz-data.js',
      paperSourcePath:
        'src/data/imp-96714-safe-direction-per-rung-verification.js (IMP96714_SAFE_DIRECTION_PER_RUNG.table, safeFromL, failRungs); imp-96742 viz page',
      ticket: 'imp-96742',
      pedagogicalStep: 296,
      honestCeiling:
        'Presentation only: every d_sig(L) value and safe flag is reused verbatim from imp-96714 (itself a pure arithmetic reshape of the imp-96695 baked rhoEmp/rhoGue table); no new measurement, no recomputation from the zeros. Changes no bound, establishes no operator positivity, no RH claim; Platt-Trudgian Lambda <= 0.2 remains SOTA; RH open; NO QED.',
    }),
    Object.freeze({
      route: '/viz-imp96801-gmin-exponent-noise-band',
      title: 'Gmin Exponent Fits vs the GUE Monte-Carlo Noise Band',
      oneLine:
        'Horizontal error-bar chart of the imp-96755 200,000-trial Monte-Carlo sampling-noise band (Weibull-3 block-extreme null) for all eleven imp-96629/imp-96734 gmin exponent estimators, plotting each observed fit against its own 95% null band and a single GUE -1/3 cube-root reference line, showing no estimator falls outside its band.',
      mathBucket: 'measurement',
      dataModule: 'src/data/imp-96801-gmin-exponent-noise-band-viz-data.js',
      paperSourcePath:
        'src/data/imp-96755-gmin-exponent-noise-band.js (GMIN_EXPONENT_NOISE_BAND.bands, mostSignificant; imp-96801 viz page)',
      ticket: 'imp-96801',
      pedagogicalStep: 297,
      honestCeiling:
        'Presentation only: every band edge, z-score, and observed exponent is reused verbatim from imp-96755 (200,000-trial Monte Carlo of the Weibull-3 block-extreme null); no re-fit, no new numerics. Changes no bound, establishes no operator positivity, no RH claim; measurement conditional on GUE; Platt-Trudgian Lambda <= 0.2 remains SOTA; RH open; NO QED.',
    }),
    Object.freeze({
      route: '/viz-imp96822-gmin-ladder-reach-frontier',
      title: 'Dyadic Block-Minima Ladder: Reach Frontier and Acquisition Requirement',
      oneLine:
        'Three-stage fill-fraction bar chart of the imp-96754 dyadic block-minima reach frontier for the imp-96629/imp-96734 gap-exponent ladder: the last COMPLETE block (k=19), the current 90.835%-filled top rung (k=20), and the next rung (k=21), which needs 2,193,252 more consecutive ordinates than the 2,001,052 currently cached.',
      mathBucket: 'measurement',
      dataModule: 'src/data/imp-96822-gmin-ladder-reach-frontier-viz-data.js',
      paperSourcePath:
        'src/data/imp-96754-gmin-ladder-reach-frontier.js (GMIN_LADDER_REACH_FRONTIER.topRung, .acquisition; imp-96822 viz page)',
      ticket: 'imp-96822',
      pedagogicalStep: 298,
      honestCeiling:
        'Presentation only: every N_center, fill fraction, and ordinate count is reused verbatim from imp-96754 (arithmetic on the cached zero COUNT only, no zeros bundle imported, no gaps recomputed). Changes no bound, establishes no operator positivity, no RH claim; measurement/scoping only, conditional on GUE; Platt-Trudgian Lambda <= 0.2 remains SOTA; RH open; NO QED.',
    }),
    Object.freeze({
      route: '/viz-imp96925-krein-t-truncation-deficit',
      title: 'Route I Krein Floor: Fixed-T=800 vs T=3200 t-Truncation Deficit',
      oneLine:
        'Line chart of the imp-96814 per-2a relative Krein Rayleigh-floor t-truncation deficit (T=3200 minus T=800, as a percent of the T=3200 floor) over N=52..124, showing the deficit is SMALLEST at the binding 2a=ln3 rung (~7.79% at N=100) and grows super-linearly with N at every rung -- first confirmed consumer of the previously-orphaned imp-96814 leaf.',
      mathBucket: 'measurement',
      dataModule: 'src/data/imp-96814-krein-t-truncation-deficit-viz-data.js',
      paperSourcePath:
        'src/data/imp-96768-gegenbauer-krein-lammin-recompute.js (IMP96768_LADDER_T800, IMP96768_LADDER_CONVERGED; imp-96925 viz page)',
      ticket: 'imp-96925',
      pedagogicalStep: 299,
      honestCeiling:
        'Presentation only: every deficit and percentage value is reused verbatim from imp-96814 (itself verbatim from imp-96768); no re-solve, no new numerics. The deficit is a LOWER bound on the true t-truncation gap. Changes no bound, establishes no operator positivity, no RH claim; interval-rigorous certificate reach stays 2a<=0.96; Platt-Trudgian Lambda <= 0.2 remains SOTA; RH open; NO QED.',
    }),
    Object.freeze({
      route: '/viz-imp97367-krein-csharp-coupled-nt-grid',
      title: 'Route I Krein Floor: Coupled N x T Grid and the T-to-infinity Plateau',
      oneLine:
        'Line family of the imp-97206 6x4 c_sharp(N,T) Rayleigh-Ritz grid (N-spread collapsing 0.0732 -> 0.0094 as T grows) plus a scatter of the inner T->infinity extrapolant lam(N,inf), showing the reliable band N=84..132 settling on a flat positive plateau ~0.582 rather than descending toward 0.',
      mathBucket: 'measurement',
      dataModule: 'src/data/imp-97206-krein-csharp-coupled-nt-jointlimit.js',
      paperSourcePath:
        'src/data/imp-97206-krein-csharp-coupled-nt-jointlimit.js (IMP97206_GRID, IMP97206_STAGE1_LAM_N_INF, IMP97206_PLATEAU_MEAN; imp-97367 viz page)',
      ticket: 'imp-97367',
      pedagogicalStep: 317,
      honestCeiling:
        'Presentation only: every grid value, extrapolant, and plateau statistic is reused verbatim from imp-97206; no re-solve, no new numerics. These are Rayleigh-Ritz UPPER bounds, not a certified floor. Changes no bound, establishes no operator positivity, no RH claim; interval-rigorous certificate reach stays 2a<=0.96; Platt-Trudgian Lambda <= 0.2 remains SOTA; RH open; NO QED.',
    }),
    Object.freeze({
      route: '/viz-imp97368-w1-sign-profile',
      title: 'Route I Toeplitz-Krein: the w1 Residual Sign Profile Near ln3',
      oneLine:
        'Curve of the bare residual symbol w1(t) over [0,12] marking its three zero crossings and the deeply negative leading well through the band edge t=ln3, plus a ladder of the negMass/posMass ratio over the resolution window [0,pi/a] rising 4.541x (2a=0.96) -> 5.740x (2a=ln3) -> 6.730x (2a=1.16).',
      mathBucket: 'measurement',
      dataModule: 'src/data/imp-97336-w1-residual-sign-profile-near-ln3.js',
      paperSourcePath:
        'src/data/imp-97336-w1-residual-sign-profile-near-ln3.js (IMP97336_W1_SIGN_PROFILE, w1 from rh-route-i-toeplitz-krein-certificate-2026-09-24.js; imp-97368 viz page)',
      ticket: 'imp-97368',
      pedagogicalStep: 318,
      honestCeiling:
        'Presentation only: every landmark, zero crossing, and mass ratio is reused verbatim from imp-97336; no re-solve, no new numerics. w1 is pointwise negative at the band edge -- this is NOT an operator positivity result and establishes no lower bound. Changes no bound; interval-rigorous certificate reach stays 2a<=0.96; Platt-Trudgian Lambda <= 0.2 remains SOTA; RH open; NO QED.',
    }),
    Object.freeze({
      route: '/viz-imp97369-krein-routeb-enclosure',
      title: 'Route I Krein Route B: Certified Per-Panel |g| Enclosure + Route C Far-Tail',
      oneLine:
        'Curve of |g(z)| against the imp-97337 certified interval-Bessel-library-free per-panel step enclosure near the T-truncation rung, a ladder of the true/enclosure ratio across all 572 certified panels (worst 0.9871), and the Route C far-tail envelope |g(z)| z^4 <= C_far ~ 48524.3 beyond Zfar.',
      mathBucket: 'measurement',
      dataModule: 'src/data/imp-97337-krein-routeb-certified-bessel-enclosure.js',
      paperSourcePath:
        'src/data/imp-97337-krein-routeb-certified-bessel-enclosure.js (enclosureUpper, IMP97337_ENCLOSURE, sPoly/cPoly; imp-97369 viz page)',
      ticket: 'imp-97369',
      pedagogicalStep: 319,
      honestCeiling:
        'Presentation only: reuses the exported certified enclosureUpper primitive and sPoly/cPoly verbatim; no re-derivation of the bounding argument, no new numerics. Establishes no operator positivity. Changes no bound; interval-rigorous reach stays 2a<=0.96; Platt-Trudgian Lambda <= 0.2 remains SOTA; RH open; NO QED.',
    }),
    Object.freeze({
      route: '/viz-imp97040-orphaned-calibration-leaves',
      title: 'Orphaned Route I / Route M Calibration Leaves (Tabbed)',
      oneLine:
        'Three-tab page giving the previously-orphaned imp-96959 (Krein floor margin, 2a=ln3 vs 2a=0.96), imp-96960 (E_trunc-vs-C_C conjugate elasticity across all six sigma-share decay landmarks), and imp-96961 (Bessel onset-mass vs measured tail-residual at 2a=ln3) viz-data leaves their first consuming page.',
      mathBucket: 'measurement',
      dataModule: 'src/data/imp-96959-krein-floor-margin-viz-data.js',
      paperSourcePath:
        'src/data/imp-96959-krein-floor-margin-viz-data.js, src/data/imp-96960-etrunc-cc-elasticity-ladder-viz-data.js, src/data/imp-96961-bessel-onset-mass-tail-residual-viz-data.js (imp-97040 tabbed viz page)',
      ticket: 'imp-97040',
      pedagogicalStep: 300,
      honestCeiling:
        'Presentation only: every value across all three tabs is reused verbatim from the imp-96959/imp-96960/imp-96961 viz-data leaves (themselves verbatim reshapes of imp-96938/imp-96936+imp-96950/imp-96934); no re-solve, no new numerics. Changes no bound, establishes no operator positivity, no RH claim; interval-rigorous certificate reach stays 2a<=0.96; Platt-Trudgian Lambda <= 0.2 remains SOTA; RH open; NO QED.',
    }),
    Object.freeze({
      route: '/viz-imp97041-nyquist-alias-periodogram',
      title: 'imp-96832 Nyquist-Alias Relabel: Periodogram',
      oneLine:
        'Stem-plot periodogram of the 21-rung Burnol-ratio ladder showing the imp-96832 claimed frequency w=3.85 sitting above the Nyquist line pi=3.1416 with power identical to its resolvable alias image 2.4332, dwarfed (~13x) by the genuine leave-one-out-robust peak at w=0.70 -- first consuming page for the previously-orphaned imp-96941 viz-data leaf.',
      mathBucket: 'measurement',
      dataModule: 'src/data/imp-96941-lombscargle-periodogram-viz-data.js',
      paperSourcePath:
        'src/data/imp-96915-burnol-oscillation-frequency-periodogram.js (source claimed/alias/genuine-peak numbers), src/data/imp-96941-lombscargle-periodogram-viz-data.js (chart-ready reshape; imp-97041 viz page)',
      ticket: 'imp-97041',
      pedagogicalStep: 301,
      honestCeiling:
        'Presentation only: every frequency and power value is reused verbatim from imp-96915/imp-96941 (no re-derivation of the underlying Lomb-Scargle numerics). Changes no bound, establishes no operator positivity, no RH claim; interval-rigorous certificate reach stays 2a<=0.96; Platt-Trudgian Lambda <= 0.2 remains SOTA; RH open; NO QED.',
    }),
    Object.freeze({
      route: '/viz-imp97082-ritz-vs-rigorous-crossval-range',
      title: 'Route I Krein Floor at 2a=0.96: Ritz vs Rigorous Cross-Validation',
      oneLine:
        'Log-scale range chart of the imp-96983 Ritz UPPER-estimate band [12.0089,21.0155] nested strictly inside the interval-rigorous flanking bracket (7.743,56.05) for lambda_min(T_0.48[sigma_2]), both ~22x the binding 2a=(ln3)/2 margin -- first confirmed consumer of the previously-orphaned imp-96983 leaf.',
      mathBucket: 'measurement',
      dataModule: 'src/data/imp-96983-ritz-vs-rigorous-crossval-viz-data.js',
      paperSourcePath:
        'src/data/imp-96958-krein-096-ritz-vs-rigorous-crossval.js (Finding 2 containment; imp-97082 viz page)',
      ticket: 'imp-97082',
      pedagogicalStep: 301,
      honestCeiling:
        'Presentation only: every band value is reused verbatim from imp-96983 (itself verbatim from imp-96958). The Ritz band is an UPPER estimate, not a certified lower bound. Changes no bound, establishes no operator positivity, no RH claim; interval-rigorous certificate reach stays 2a<=0.96; Platt-Trudgian Lambda <= 0.2 remains SOTA; RH open; NO QED.',
    }),
    Object.freeze({
      route: '/viz-imp97068-mirror-descent-poisson-kernel',
      title: 'Mirror-Descent Pair Lemma: the Poisson-Kernel Descent Floor',
      oneLine:
        'Line charts of the rh-bridge-mirror-descent-2026-09-25 PROVED pair (mirror) lemma A1: the descent-kernel floor f(2y,Delta)=2y/(Delta^2+4y^2) vs horizontal offset Delta at three heights (y0=0.165, 0.5, 1), plus the pair-lemma inequality f(a)+f(2y-a)>=f(2y) swept across a in [0,2y] at a fixed (y,Delta) example -- first visualization for this proved geometric mechanism.',
      mathBucket: 'measurement',
      dataModule: 'src/data/imp-97068-mirror-descent-poisson-kernel-viz-data.js',
      paperSourcePath:
        'src/data/rh-bridge-mirror-descent-2026-09-25.js (source: A1 pair lemma, A4 Poisson domination; imp-97068 viz-data leaf + page)',
      ticket: 'imp-97068',
      pedagogicalStep: 301,
      honestCeiling:
        'Presentation only: every value is computed with the imported f() verbatim, no re-derivation. The pair lemma and Poisson domination are proved elementary facts, but the flow-descent theorem they feed stays conditional (hypothesis open, pointwise NS-RIGID class). Changes no bound, establishes no operator positivity, no RH claim; Platt-Trudgian Lambda <= 0.2 remains SOTA; RH open; NO QED.',
    }),
    Object.freeze({
      route: '/viz-imp97106-palm-mirror-surplus-comparison',
      title: 'Palm Mirror-Count vs p_req: Surplus Comparison',
      oneLine:
        'Bar chart of all six imp-97080 mirror-count baselines (neutral Palm 2-slot/1-slot at the seam and at N1*, empirical 1e12 location-free/pair-replacement, empirical 1e22 location-free) against the required p_req=4.3743, each annotated with its surplus factor -- first visualization for this measurement.',
      mathBucket: 'measurement',
      dataModule: 'src/data/imp-97106-palm-mirror-surplus-comparison-viz-data.js',
      paperSourcePath:
        'src/data/imp-97080-palm-mirror-baseline-vs-preq-measurement.js (source: all baseline counts, p_req, verdict; imp-97106 viz-data leaf + page)',
      ticket: 'imp-97106',
      pedagogicalStep: 301,
      honestCeiling:
        'Presentation only: every count and surplus value is reused verbatim from imp-97080, no re-derivation. Only the far-height N1* Palm baseline and the 1e22 empirical block reach approximate parity (~1.0x); every seam-height / 1e12 baseline falls short of p_req. Changes no bound, establishes no operator positivity, no RH claim; Platt-Trudgian Lambda <= 0.2 remains SOTA; RH open; NO QED.',
    }),
    Object.freeze({
      route: '/viz-imp97111-route-m-reach-confidence-ladder',
      title: 'Route M Reach-Threshold Confidence Ladder',
      oneLine:
        'Bar chart of the imp-97060 confidence table (target ceiling spread S*=10/5/1 percent -> N_top on a log10 axis spanning ~4.07e3 to ~2.01e7) plus the 9-rung anchor back-check (signed law-minus-exact residual, percentage points, at each imp-97033 truncation rung) -- first visualization for this cross-validation.',
      mathBucket: 'measurement',
      dataModule: 'src/data/imp-97111-route-m-reach-confidence-ladder-viz-data.js',
      paperSourcePath:
        'src/data/imp-97060-route-m-fm-discriminant-crossvalidation.js (source: confidence table, anchor back-check, verdict; imp-97111 viz-data leaf + page)',
      ticket: 'imp-97111',
      pedagogicalStep: 301,
      honestCeiling:
        'Presentation only: every value is reused verbatim from imp-97060, no re-derivation. Only the trace ceiling T ~ 2.594e7 is rigorous; the 1-percent confidence rung (~2.01e7, ~49 percent of N*) is a downward extrapolation. Changes no bound, establishes no operator positivity, no RH claim; Platt-Trudgian Lambda <= 0.2 remains SOTA; RH open; NO QED.',
    }),
    Object.freeze({
      route: '/viz-imp97212-route-m-residual-sign-magnitude',
      title: 'Route M Residual Sign / Magnitude Ladder',
      oneLine:
        'Signed-log scatter of the imp-97140 fixed-omega(b) residual r(b) vs b colored by omega(b) parity (highlighting the three sweep exceptions at b=2310, 2730, 30030), plus a log-axis omega -> GM|r(b)| magnitude ladder with the non-clean consecutive ratios (12.43/1.47/2.46) labelled -- first visualization for this measurement.',
      mathBucket: 'measurement',
      dataModule: 'src/data/imp-97169-route-m-residual-sign-magnitude-viz-data.js',
      paperSourcePath:
        'src/data/imp-97140-route-m-fixed-omega-residual-cohorts.js (source: cohort rows, sign law, magnitude ladder; imp-97169 viz-data leaf + imp-97212 page)',
      ticket: 'imp-97212',
      pedagogicalStep: 301,
      honestCeiling:
        'Presentation only: every value is reused verbatim from imp-97140, no re-derivation. The observed sign law is omega odd => r>0 / omega even => r<0 except at the three primorial-floor exceptions (leading-term cancellation); the imp-97140 exponent string (-1)^omega(b) is data-inconsistent, corrected by imp-97167 to (-1)^(omega(b)+1). Changes no bound, establishes no operator positivity, no RH claim; Platt-Trudgian Lambda <= 0.2 remains SOTA; RH open; NO QED.',
    }),
    Object.freeze({
      route: '/viz-imp97389-route-m-sign-law-omega-ladder',
      title: 'Route M Sign-Law Omega-Class Ladder',
      oneLine:
        'Per-omega status ladder for the Route M sign law T(b) < 0 (squarefree b): PROVED elementarily through omega=4 (imp-97333 for omega<=3, imp-97352 D_{p1}-monotonicity injection for omega=4), with the sharp Hall-deficiency wall at omega=5 (6 level-2 positives vs 4 level-1 negatives) shown as the counting margin -- first visualization for this ladder.',
      mathBucket: 'measurement',
      dataModule: 'src/data/imp-97389-route-m-sign-law-omega-ladder-viz-data.js',
      paperSourcePath:
        'src/data/imp-97333-route-m-sign-law-proof-attempt.js, src/data/imp-97352-route-m-sign-law-omega4-proof.js (source: omega<=3 elementary proof, omega=4 D_{p1}-monotonicity injection, omega=5 crossover; imp-97389 viz-data leaf + page)',
      ticket: 'imp-97389',
      pedagogicalStep: 301,
      honestCeiling:
        'Presentation only: every value is reused verbatim from imp-97333/imp-97352, no re-derivation. The domination method is proved for omega<=4 (tight 3-vs-3 match at omega=4) and fails first at omega=5 (Hall deficiency 2), reducing to the open IMP97333_SIGN_TAIL_SUBGAP. Changes no bound, establishes no operator positivity, no RH claim; Platt-Trudgian Lambda <= 0.2 remains SOTA; RH open; NO QED.',
    }),
    Object.freeze({
      route: '/viz-imp97453-route-m-sign-magnitude-omega-ladder',
      title: 'Route M Sign / Magnitude Omega-Ladder',
      oneLine:
        'Two-tab status view of the Route M b/4-ceiling cohort: the sign law T(b)<0 proved through omega=4 (imp-97352) and reduced at omega=5 to a uniform tail lemma via a two-sided Binet bracket (imp-97423), alongside the companion magnitude condition |T(b)|<=1/4 collapsed to a single MCM hypothesis, numerically verified through omega=4 (imp-97422) -- first visualization combining the sign and magnitude ladders.',
      mathBucket: 'measurement',
      dataModule: 'src/data/imp-97453-route-m-sign-magnitude-omega-ladder-viz-data.js',
      paperSourcePath:
        'src/data/imp-97352-route-m-sign-law-omega4-proof.js, src/data/imp-97423-route-m-sign-law-omega5-binet-two-sided-estimate.js, src/data/imp-97422-route-m-quarter-ceiling-omega4-multiplicative-difference-reduction.js (source: sign-law omega=4 proof and omega=5 Hall wall, omega=5 Binet-bracket certification and tail-lemma residual, magnitude reduction to the MCM hypothesis; imp-97453 viz-data leaf + page)',
      ticket: 'imp-97453',
      pedagogicalStep: 301,
      honestCeiling:
        'Presentation only: every value is reused verbatim from imp-97352/imp-97423/imp-97422, no re-derivation. Sign law proved elementarily through omega=4, reduced (not proved) at omega=5 to a uniform-(p1,q1) tail lemma; magnitude collapses to |T(b)|<=1/4 and holds for every omega GIVEN the single MCM hypothesis, which is only numerically verified through omega=4. Changes no bound, establishes no operator positivity, no RH claim; Platt-Trudgian Lambda <= 0.2 remains SOTA; RH open; NO QED.',
    }),
    Object.freeze({
      route: '/viz-imp97470-route-m-sign-law-omega5-binet-decay',
      title: 'Route M Omega=5 Binet Decay Law',
      oneLine:
        'Chart of the imp-97443 X3 decay law: the Route M omega=5 sign-law certificate certA(p1;q1) scaled as q1*certA converges monotonically to the exact constant (1-1/p1)/12 across the minimal-config ladder q1 = 10^2 .. 10^6, for p1 = 2, 3, 5, matched against the mpmath dps=60 extended-precision cross-check.',
      mathBucket: 'measurement',
      dataModule: 'src/data/imp-97470-route-m-sign-law-omega5-binet-decay-viz-data.js',
      paperSourcePath:
        'src/data/imp-97443-route-m-sign-law-omega5-binet-certificate-crossval.js (source: IMP97443_LADDER_REF extended-precision decay-law anchors; imp-97470 viz-data leaf + page)',
      ticket: 'imp-97470',
      pedagogicalStep: 301,
      honestCeiling:
        'Presentation only: every value is reused verbatim from imp-97443, no re-derivation. Confirms the leading Binet-term decay q1*certA -> (1-1/p1)/12 but proves nothing beyond the existing imp-97443 accuracy cross-check; no bound on Lambda moved, establishes no operator positivity, no RH claim; Platt-Trudgian Lambda <= 0.2 remains SOTA; RH open; NO QED.',
    }),
    Object.freeze({
      route: '/viz-imp97409-b4-ceiling-sign-condition-omega-classes',
      title: 'b/4-Ceiling Sign Condition Across Omega Classes',
      oneLine:
        'Per-omega magnitude ratio |Delta(b)|/(b/2) for the Route M b/4-ceiling sign+magnitude condition mu(b)Delta(b)<=0: PROVED through omega<=2 (primes imp-97265, semiprimes imp-97290), OPEN from omega=3 (imp-97393, no violation found in [2,300000], primorial magnitude ratio climbing toward 1/2 from below).',
      mathBucket: 'measurement',
      dataModule: 'src/data/imp-97409-b4-ceiling-sign-condition-omega-classes-viz-data.js',
      paperSourcePath:
        'src/data/imp-97290-route-m-arith-quarter-ceiling-semiprime-proof.js, src/data/imp-97393-route-m-omega3-delta-sign-magnitude-sweep.js (source: leader decomposition + omega<=2 proof, omega>=3 sweep; imp-97409 viz-data leaf + page)',
      ticket: 'imp-97409',
      pedagogicalStep: 301,
      honestCeiling:
        'Presentation only: primorial-ladder values reused verbatim from imp-97393; the semiprime magRatio column is an exact algebraic transform of the imp-97290 ratio field (|Delta|/(b/2) = (1-|E1|/(b/4))/2), no new numerics. The sign+magnitude condition is proved for omega<=2 and open for omega>=3, where the magnitude condition holds with slack (ratio -> 1/2 from below) but the sign condition needs retained Moebius cancellation once the naive triangle bound overcharges. Changes no bound, establishes no operator positivity, no RH claim; Platt-Trudgian Lambda <= 0.2 remains SOTA; RH open; NO QED.',
    }),
    Object.freeze({
      route: '/viz-imp97213-route-m-explicit-remainder-envelope',
      title: 'Route M Explicit Remainder Envelope vs Measured Residual',
      oneLine:
        'Log-log scatter of the imp-97133 explicit eps(b) remainder envelope against the measured relative L0/L1 coprime-sum residual it bounds, plus a ratio ladder by family (prime/smooth/primorial) -- first visualization for the imp-97170 viz-data leaf.',
      mathBucket: 'measurement',
      dataModule: 'src/data/imp-97170-route-m-explicit-remainder-envelope-viz-data.js',
      paperSourcePath:
        'src/data/imp-97133-route-m-arith-first-moment-explicit-remainder.js (source: eps(b) envelope and E0/E1 theorems; imp-97170 viz-data leaf + imp-97213 page)',
      ticket: 'imp-97213',
      pedagogicalStep: 301,
      honestCeiling:
        'Presentation only: every value is reused verbatim from imp-97133, no re-derivation. The eps(b) envelope upper-bounds the measured relative residual on every sampled b (ratio < 1 throughout); tight (ratio ~0.16-0.20) on prime b, loose by 4-5 orders of magnitude on primorial b. Changes no bound, establishes no operator positivity, no RH claim; Platt-Trudgian Lambda <= 0.2 remains SOTA; RH open; NO QED.',
    }),
    Object.freeze({
      route: '/viz-imp97214-route-m-farfield-slopeband-vs-original',
      title: 'Route M Far-Field Slope-Band Interval vs Original Band',
      oneLine:
        'Range chart on a shared fPctVsLine axis comparing the imp-97142 propagated slope-sweep interval [-2.035%, +0.389%] against the imp-96982 original credible band [+1.369%, +8.356%], with the three imp-97142 slope-sweep points (s* = 5.66/5.76/5.80) marked -- first visualization for the imp-97171 viz-data leaf.',
      mathBucket: 'measurement',
      dataModule: 'src/data/imp-97171-route-m-farfield-slopeband-vs-original-viz-data.js',
      paperSourcePath:
        'src/data/imp-97142-route-m-farfield-ceiling-slope-band-interval.js (source: propagated interval; imp-97171 viz-data leaf + imp-97214 page)',
      ticket: 'imp-97214',
      pedagogicalStep: 301,
      honestCeiling:
        'Presentation only: every value is reused verbatim from imp-97142 and imp-96982, no re-derivation. The entire propagated interval sits below the original credible band floor, ~0.98 percentage points at the closest approach. Changes no bound, establishes no operator positivity, no RH claim; Platt-Trudgian Lambda <= 0.2 remains SOTA; RH open; NO QED.',
    }),
    Object.freeze({
      route: '/viz-imp97215-route-m-kappa-decomposition',
      title: 'Route M Kappa Decomposition: Arithmetic + Cotangent',
      oneLine:
        'Two-series convergence ladder (arithmetic part drifting DOWN to its exact limit, cotangent part climbing UP to its measured limit) plus a three-bar stacked decomposition of kappa = kappa_arith + kappa_cot -- first visualization for the imp-97130 viz-data leaf.',
      mathBucket: 'measurement',
      dataModule: 'src/data/imp-97130-route-m-kappa-decomposition-viz-data.js',
      paperSourcePath:
        'src/data/imp-97096-route-m-arith-first-moment-evaluation.js (source: exact kappa_arith); src/data/imp-97097-route-m-cotangent-first-moment-reciprocity.js (source: measured kappa_cot); imp-97130 viz-data leaf + imp-97215 page',
      ticket: 'imp-97215',
      pedagogicalStep: 301,
      honestCeiling:
        'Presentation only: every value is reused verbatim from imp-97096 and imp-97097, no re-derivation. The arithmetic part is EXACT (0.5704960511...); the cotangent part is MEASURED (~0.121); their sum kappa~0.69>0 is therefore MEASURED, not proved. Changes no bound, establishes no operator positivity, no RH claim; Platt-Trudgian Lambda <= 0.2 remains SOTA; RH open; NO QED.',
    }),
    Object.freeze({
      route: '/viz-imp97216-route-m-per-class-saturation-ratio',
      title: 'Route M Per-Class Remainder Saturation Ratios',
      oneLine:
        'Log-b ladder of the imp-97158 saturation ratio r0(b) = |E0(b)|/bound across three b-classes: primes climbing toward the exact 1/4 asymptote, prime powers decaying with the exponent, and primorials collapsing by orders of magnitude -- first visualization for this measurement.',
      mathBucket: 'measurement',
      dataModule: 'src/data/imp-97158-route-m-theorem1-remainder-sharpness.js',
      paperSourcePath:
        'src/data/imp-97133-route-m-arith-first-moment-explicit-remainder.js (source: the Theorem-1/2 constants whose sharpness imp-97158 measures; imp-97216 page)',
      ticket: 'imp-97216',
      pedagogicalStep: 301,
      honestCeiling:
        'Presentation only: every value is reused verbatim from imp-97158, no re-derivation. The named constant 2^omega(b)(log b+2) is sharp only on primes (ratio -> 1/4, a finite factor-4 overhead); it is orders too large on prime powers and primorials (mu-sign cancellation the triangle bound discards). Changes no bound, establishes no operator positivity, no RH claim; Platt-Trudgian Lambda <= 0.2 remains SOTA; RH open; NO QED.',
    }),
    Object.freeze({
      route: '/viz-imp97217-krein-csharp-nt-coupled-descent',
      title: 'Krein c_sharp Coupled N/T Descent Ladder and T-Sweep',
      oneLine:
        'Two-panel view of the imp-97183 extended-precision c_sharp = lambda_min(P_a M_sigma2 P_a) floor at 2a=ln3: the fixed-T=800 N-ladder descends with no stabilisation past the double-precision wall, while a T-sweep at N=100 rises and levels toward ~0.58, the two truncations pushing lambda_min in opposite directions.',
      mathBucket: 'measurement',
      dataModule: 'src/data/imp-97183-krein-csharp-extprec-ladder.js',
      paperSourcePath:
        'src/data/imp-97121-krein-uniform-n-floor-certificate-scope.js (source: coupled N/T tail framing; imp-97183 extended-precision ladder + imp-97217 page)',
      ticket: 'imp-97217',
      pedagogicalStep: 301,
      honestCeiling:
        'Presentation only: every value is reused verbatim from imp-97183, no re-derivation. Rayleigh-Ritz floors are upper bounds only; the still-moving bracket ~[0.50, 0.58] is consistent with a positive limit but neither converges nor crosses zero. Changes no bound, establishes no operator positivity, no RH claim; Platt-Trudgian Lambda <= 0.2 remains SOTA; RH open; NO QED.',
    }),
    Object.freeze({
      route: '/viz-imp97300-palm-mirror-frac-ladder',
      title: 'Palm Mirror-Count Frac-of-Mean: an Infinitely-Slow Approach to 1',
      oneLine:
        'Line chart of the imp-97189 extended ladder: measured frac(lnN) vs the closed-form approach law 1-12.12/lnN (visibly separate at lnN=22, converging by lnN=200), plus the frac-target-vs-lnN bisection table (0.90 at lnN~120.5, 0.99 at ~1212) -- first visualization for this measurement.',
      mathBucket: 'measurement',
      dataModule: 'src/data/imp-97300-palm-mirror-frac-ladder-viz-data.js',
      paperSourcePath:
        'src/data/imp-97189-palm-mirror-frac-of-mean-extended-ladder.js (source: extended rung table, fracTargets bisection table; imp-97300 viz-data leaf + page)',
      ticket: 'imp-97300',
      pedagogicalStep: 301,
      honestCeiling:
        'Presentation only: every (lnN, palm2, frac) and (target, lnN) value is reused verbatim from imp-97189, no re-derivation of the Palm 2-slot mirror kernel. frac approaches 1 but never reaches it at any finite height; the closed-form law is only asymptotic (loose at lnN=22, tight by lnN=200). Changes no bound, establishes no operator positivity, no RH claim; Platt-Trudgian Lambda <= 0.2 remains SOTA; RH open; NO QED.',
    }),
    Object.freeze({
      route: '/viz-imp97301-e1-quarter-b-saturation',
      title: 'Route M: E1 b/4-Saturation Ratio Per Divisor Class',
      oneLine:
        'Log-b line chart of the imp-97269 saturation ratio q(b) = |E1(b)|/(b/4) across four divisor classes: primes climbing to 0.999952, while prime powers, primorials and generic composites undershoot and decay toward 0 as b grows -- first visualization for this measurement.',
      mathBucket: 'measurement',
      dataModule: 'src/data/imp-97269-route-m-e1-quarter-b-class-uniformity-crosscheck.js',
      paperSourcePath:
        'src/data/imp-97208-route-m-theorem2-tighter-remainder.js (source: the b/4 E1 constant and prime asymptotic imp-97269 cross-checks across classes; imp-97301 viz-data leaf + page)',
      ticket: 'imp-97301',
      pedagogicalStep: 301,
      honestCeiling:
        'Presentation only: every (b, omega, q) value is reused verbatim from imp-97269, no re-derivation of the O(b) E1 kernel. The b/4 ceiling holds class-uniformly (0 violations, b in [2,20000]) but saturates toward 1 only on primes; the smooth-class undershoot is measured, not proved uniformly. Changes no bound, establishes no operator positivity, no RH claim; Platt-Trudgian Lambda <= 0.2 remains SOTA; RH open; NO QED.',
    }),
    Object.freeze({
      route: '/viz-imp97302-inverse-line-diag-offdiag-coleading',
      title: 'Inverse-Line DIAG vs OFFDIAG: a Co-Leading Decomposition of M2w',
      oneLine:
        'Log-b line charts of the imp-97267/imp-97284 exact character-detection decomposition M2w = DIAG + OFFDIAG across b=101..1201: both components track each other and each carries roughly half of M2w at every rung -- first visualization for this measurement.',
      mathBucket: 'measurement',
      dataModule: 'src/data/imp-97302-inverse-line-diag-offdiag-coleading-viz-data.js',
      paperSourcePath:
        'src/data/imp-97267-route-m-inverse-map-kloosterman-transfer.js (source: the exact identity + b=101..401 ladder), src/data/imp-97284-inverse-line-offdiag-diag-ladder-extension.js (extension to b=1201; imp-97302 viz-data leaf + page)',
      ticket: 'imp-97302',
      pedagogicalStep: 302,
      honestCeiling:
        'Presentation only: every (b, M2w, diag, offdiag) value is reused verbatim from imp-97267 and imp-97284, no re-derivation of the exact O(b^3) character-detection kernel. OFFDIAG carries ~half of M2w at every measured b (co-leading, not a vanishing remainder), so a Weil-bound route cannot certify M2w -- the transfer stays an open EVALUATION problem. Changes no bound, establishes no operator positivity, no RH claim; Platt-Trudgian Lambda <= 0.2 remains SOTA; RH open; NO QED.',
    }),
    Object.freeze({
      route: '/viz-imp97303-bessel-hankel-majorant',
      title: 'Bessel-Hankel z^-4 Majorant vs the Measured Annihilating-Trial Decay',
      oneLine:
        'Log10 line charts of the imp-97263 closed-form majorant C(Z0) against the imp-97134 measured |g(z)| z^4 curves for the even- and odd-degree annihilating trials, plus the C(Z0)/measured looseness ratio (~5x-210x) vs z -- first visualization for this majorant.',
      mathBucket: 'measurement',
      dataModule: 'src/data/imp-97303-bessel-hankel-majorant-vs-measured-viz-data.js',
      paperSourcePath:
        'src/data/imp-97263-krein-analytic-bessel-z4-remainder-majorant.js (source: the closed-form C(Z0) majorant), src/data/imp-97134-krein-annihilating-rational-trial-execution.js (source: the measured |g(z)| z^4 trial ladder; imp-97303 viz-data leaf + page)',
      ticket: 'imp-97303',
      pedagogicalStep: 303,
      honestCeiling:
        'Presentation only: the majorant constant is reused verbatim from imp-97263 and the measured decay is reused verbatim from imp-97134, no re-evaluation of any spherical-Bessel function. The majorant is valid at every measured rung (bounds both trials) but loose by a factor of ~5x-210x, the price of the triangle inequality not exploiting further cross-degree cancellation. Changes no bound, establishes no operator positivity, no RH claim; Platt-Trudgian Lambda <= 0.2 remains SOTA; RH open; NO QED.',
    }),
    Object.freeze({
      route: '/viz-imp97316-committed-cjk-sparsity-band',
      title: 'Committed c_jk Overlap: the Exact Sparsity/Band Pattern',
      oneLine:
        'Band-area chart of the imp-97293 committed 100x106 overlap matrix support (nonzero exactly where j+k even AND k<=j+6: 2850 of 10600 cells) plus a table of the exact high-degree anchor entries -- first visualization for this sparsity pattern.',
      mathBucket: 'measurement',
      dataModule: 'src/data/imp-97316-committed-cjk-sparsity-band-viz-data.js',
      paperSourcePath:
        'src/data/imp-97293-krein-committed-cjk-gegenbauer-overlap.js (source: exact overlap matrix, sparsity census, anchors; imp-97316 viz-data leaf + page)',
      ticket: 'imp-97316',
      pedagogicalStep: 316,
      honestCeiling:
        'Presentation only: the sparsity census and anchor values are reused verbatim from imp-97293, no re-derivation of the BigInt-rational overlap sweep. The per-row band reconstruction is a direct combinatorial reading of the proved support rule, cross-checked against the imp-97293 offline-swept total. Changes no bound, establishes no operator positivity, no RH claim; Platt-Trudgian Lambda <= 0.2 remains SOTA; RH open; NO QED.',
    }),
    Object.freeze({
      route: '/viz-imp97388-second-moment-decomposition',
      title: 'Interior Second-Moment Decomposition Q(b) = Qhat + Qcross + Qrr',
      oneLine:
        'Stacked-bar per-b decomposition of the imp-97349 interior second moment showing Qhat (the elementary log-polynomial skeleton, no b^(1/2)) carrying ~99.6% of Q(b), plus a zoomed panel comparing the tiny linear-in-b Qcross/Qrr slivers.',
      mathBucket: 'measurement',
      dataModule: 'src/data/imp-97388-route-m-interior-second-moment-decomposition-viz-data.js',
      paperSourcePath:
        'src/data/imp-97349-route-m-diagonal-remainder-profile-separation.js (source: the Ihat/r split, Qhat/Qcross/Qrr measured table, and log^2 b separation decision; imp-97388 viz-data leaf + page)',
      ticket: 'imp-97388',
      pedagogicalStep: 388,
      honestCeiling:
        'Presentation only: the QhatFrac/QrrOverB per-b figures and the Qcross(b)/b constant are reused verbatim from imp-97349, no re-derivation of the exact Vasyunin-kernel split. The qcrossFrac/qrrFrac chart values are an approximation (measured ratio divided by the baked leading slope s0), not an exact identity. Changes no bound, establishes no operator positivity, no RH claim; Platt-Trudgian Lambda <= 0.2 remains SOTA; RH open; NO QED.',
    }),
    Object.freeze({
      route: '/viz-imp97413-sigma-ladder-subdecade-knee',
      title: 'Sigma(N) Decay-Exponent Ladder with the Sub-Decade Knee',
      oneLine:
        'The imp-33582 six-decade per-decade local decay-exponent ladder (0.0105 -> 0.4310, ramping toward the imp-3463 far-tail 1/2 asymptote) with the imp-33721 sub-decade ramp-curvature knee N* ~ 3.38e9 marked on the same log10-N axis, inside the [1e9,1e10] decade bar a full decade below the coarse [1e10,1e11] bracket imp-33701 originally reported.',
      mathBucket: 'measurement',
      dataModule: 'src/data/imp-97413-sigma-ladder-subdecade-knee-viz-data.js',
      paperSourcePath:
        'src/data/imp-33582-sigma-postpeak-nearpeak-threshold-decay.js (source: the six-decade perDecadeLadder), src/data/imp-33721-sigma-ramp-inflection-subdecade.js (source: the sub-decade knee N* ~ 3.38e9; imp-97413 viz-data leaf + page)',
      ticket: 'imp-97413',
      pedagogicalStep: 390,
      honestCeiling:
        'Presentation only: both the exponent ladder and the knee location are reused verbatim from imp-33582 and imp-33721, no re-derivation of the sigma(N) extrapolation model or the OLS local-exponent estimator. Combines two already-published measurements on one axis; changes no bound, establishes no operator positivity, no RH claim; Platt-Trudgian Lambda <= 0.2 remains SOTA; RH open; NO QED.',
    }),
    Object.freeze({
      route: '/viz-imp97390-krein-csharp-upperbrackets-sidebyside',
      title: 'Route I Krein Floor: Two Upper Brackets on c_sharp at 2a=ln3, Side by Side',
      oneLine:
        'imp-97335 fixed-N=100 T-sweep converging to its extrapolated T-to-infinity limit ~0.5822, plotted alongside a three-bar comparison against the imp-97206 coupled N,T plateau (~0.5817) and its joint range [0.5817,0.5842], showing the two independent brackets agree to ~0.0011.',
      mathBucket: 'measurement',
      dataModule: 'src/data/imp-97390-krein-csharp-upperbrackets-sidebyside-viz-data.js',
      paperSourcePath:
        'src/data/imp-97355-krein-csharp-tlimit-vs-coupled-crossval.js (the two-bracket reconciliation; imp-97335/imp-97206 source values; imp-97390 viz-data leaf + page)',
      ticket: 'imp-97390',
      pedagogicalStep: 389,
      honestCeiling:
        'Presentation only: every T-sweep point, extrapolated limit, plateau statistic, and joint range is reused verbatim from imp-97335/imp-97206/imp-97355; no re-solve, no new numerics. Both bars are Rayleigh-Ritz UPPER bounds, not a certified floor. Changes no bound, establishes no operator positivity, no RH claim; interval-rigorous certificate reach stays 2a<=0.96; Platt-Trudgian Lambda <= 0.2 remains SOTA; RH open; NO QED.',
    }),
    Object.freeze({
      route: '/viz-imp97418-krein-csharp-floor-ladder',
      title: 'Route I Krein Floor Ladder at 2a=ln3, Over the Confined sigma_2 Sign Map',
      oneLine:
        'The certified Krein c_sharp floor ladder at 2a=ln3: naive symbol-infimum -4336.198 (imp-97335) -> reproducing-kernel confined-well floor -3200.029 (imp-97399, +1136.169, 26.2% of the way to 0) -> measured Rayleigh-Ritz upper bracket +0.582 (imp-97206), on a signed-log number line, plotted over the confined sigma_2(t) sign map the floors are computed from.',
      mathBucket: 'measurement',
      dataModule: 'src/data/imp-97418-krein-csharp-floor-ladder-viz-data.js',
      paperSourcePath:
        'src/data/imp-97335-krein-csharp-naive-lowerbound-tlimit.js (naive symbol-infimum floor -4336.198), src/data/imp-97399-krein-csharp-reproducing-kernel-concentration-attempt.js (confined well + reproducing-kernel floor -3200.029), src/data/imp-97206-krein-csharp-coupled-nt-jointlimit.js (measured upper bracket ~0.582; imp-97418 viz-data leaf + page)',
      ticket: 'imp-97418',
      pedagogicalStep: 391,
      honestCeiling:
        'Presentation only: both certified floors and the measured bracket are reused verbatim from imp-97335/imp-97399/imp-97206; only the sigma_2(t) sign-map curve is recomputed pointwise (no re-solve of any bound). Neither certified value is positive; the third marker is a Rayleigh-Ritz UPPER bound, not a floor. Changes no bound, establishes no operator positivity, no RH claim; interval-rigorous certificate reach stays 2a<=0.96; Platt-Trudgian Lambda <= 0.2 remains SOTA; RH open; NO QED.',
    }),
    Object.freeze({
      route: '/viz-imp97426-per-term-overcharge-ladder',
      title: 'Route M b/4-Ceiling Per-Term Over-Charge Constant Ladder by omega',
      oneLine:
        'The imp-97392 per-term MAGNITUDE constant maxGroup(omega) x g(2)/2 by omega=2..6 (0.3069, 0.4603, 1.2274, 2.3014, 4.9096) against the 1/2 ceiling: omega<=2,3 PROVED (below threshold), omega>=4 OVER-CHARGE (the largest signed group exceeds 1/g(2)=3.258891).',
      mathBucket: 'measurement',
      dataModule: 'src/data/imp-97426-per-term-overcharge-ladder-viz-data.js',
      paperSourcePath:
        'src/data/imp-97392-route-m-quarter-ceiling-omega3-magnitude-obstruction.js (groupCounts kernel, group table, INV_G2 crossover; imp-97426 viz-data leaf + page)',
      ticket: 'imp-97426',
      pedagogicalStep: 392,
      honestCeiling:
        'Presentation only: the ladder is reused verbatim from the imp-97392 groupCounts kernel, no re-derivation. omega>=4 is an OPEN gap, not a disproof -- the per-term bound over-charges there and a uniform proof needs the retained Moebius cancellation between the positive-mu and negative-mu signed groups. Changes no bound, no RH claim; Platt-Trudgian Lambda <= 0.2 remains SOTA; RH open; NO QED.',
    }),
    Object.freeze({
      route: '/viz-imp97427-sigma-fartail-exponent-ladder',
      title: 'sigma(N) Far-Tail Decay-Exponent Ladder Past 1e12',
      oneLine:
        'The imp-97404 extended sigma(N) per-decade local decay exponent past 1e12: 0.4310 [1e11,1e12] -> 0.4646 -> 0.4777 -> 0.4828 [1e14,1e15], decade R^2 climbing to ~0.999999, and the pointwise exponent p(N) 0.4526 (1e12) -> 0.4842 (1e15) -> 0.4889 (1e20) approaching the imp-3463 1/2 asymptote from below.',
      mathBucket: 'measurement',
      dataModule: 'src/data/imp-97427-sigma-fartail-exponent-ladder-viz-data.js',
      paperSourcePath:
        'src/data/imp-97404-sigma-fartail-exponent-ladder-past-1e12.js (extendedLadder, pointwise, farTailExponent; imp-97427 viz-data leaf + page)',
      ticket: 'imp-97427',
      pedagogicalStep: 393,
      honestCeiling:
        'Presentation only: the decade and pointwise exponent ladders are reused verbatim from the imp-97404 measurement (itself extending imp-33582 on the inherited imp-3406/imp-33582 three-term sigma(N) model). Measurement/fit diagnostic, NOT an RH bound; establishes no operator positivity; Platt-Trudgian Lambda <= 0.2 remains SOTA; RH open; NO QED.',
    }),
    Object.freeze({
      route: '/viz-imp97452-rk-floor-linear-ladder',
      title: 'imp-97431: The Reproducing-Kernel Krein Floor is Linear in the Half-Width a',
      oneLine:
        'The imp-97399 reproducing-kernel Krein floor floor(a) = -(a/pi)*18301.61 charted across 2a in (0, ln3]: exactly linear in a, strictly negative throughout the interval-rigorous reach 2a<=0.96, and approaching 0 only in the vacuous a->0 limit (never attained).',
      mathBucket: 'measurement',
      dataModule: 'src/data/imp-97452-krein-rk-floor-linear-ladder-viz-data.js',
      paperSourcePath:
        'src/data/imp-97431-krein-rk-floor-band-dependence.js (the linear-in-a floor law and measured ladder; imp-97452 viz-data leaf + page), src/data/imp-97399-krein-csharp-reproducing-kernel-concentration-attempt.js (the floor at the binding 2a=ln3)',
      ticket: 'imp-97452',
      pedagogicalStep: 394,
      honestCeiling:
        'Presentation only: the floor law and every measured rung are reused verbatim from imp-97431; no re-solve. The RKHS budget alone certifies c_sharp > 0 for no band in reach; establishes no operator positivity; changes no bound; interval-rigorous certificate reach stays 2a<=0.96; Platt-Trudgian Lambda <= 0.2 remains SOTA; RH open; NO QED.',
    }),
    Object.freeze({
      route: '/viz-imp97467-crossover-fraction-tolerance-ladder',
      title: 'imp-97441: The Route M Crossover Fraction x*(eps) Across Four Tolerances',
      oneLine:
        'The imp-97441 boundary-to-bulk crossover fraction x*(eps) = A(b)/b charted per tolerance across the b-ladder {1000..16000}: flat to 3-4 digits at eps=0.5%/2%/5%, but BIMODAL at eps=1% (steps 0.199 -> 0.1665) where two deviation crests straddle the 1% level.',
      mathBucket: 'measurement',
      dataModule: 'src/data/imp-97467-route-m-crossover-fraction-tolerance-ladder-viz-data.js',
      paperSourcePath:
        'src/data/imp-97441-route-m-crossover-fraction-tolerance-table.js (IMP97441_XSTAR_TABLE, IMP97441_BINDEPENDENCE; imp-97467 viz-data leaf + page)',
      ticket: 'imp-97467',
      pedagogicalStep: 395,
      honestCeiling:
        'Presentation only: every plotted point is reused verbatim from the imp-97441 x*(eps) table; no re-solve. Establishes no operator positivity; changes no bound; the imp-97437 effective-curvature fixed point fits this table only in the mid-band eps ~ 1%-2%; the rigorous anchor stays T = 2.594e7; Platt-Trudgian Lambda <= 0.2 remains SOTA; RH open; NO QED.',
    }),
    Object.freeze({
      route: '/viz-imp97471-mcm-tower-per-level-margin',
      title: 'imp-97442: The MCM Tower Per-Level Margin at omega=5,6',
      oneLine:
        'The imp-97442 MCM per-level minimum tower differences charted per omega (5, 6) on a log scale: the level-1 base term (~1.4e-6, largest x) is where the smallness lives, while the top induction term T(b) (level=omega, x=1) stays four orders of magnitude further from zero.',
      mathBucket: 'measurement',
      dataModule: 'src/data/imp-97471-mcm-tower-per-level-margin-viz-data.js',
      paperSourcePath:
        'src/data/imp-97442-route-m-mcm-omega56-subgrid-verification.js (IMP97442_MEASUREMENTS.perLevelMinDiff; imp-97471 viz-data leaf + page)',
      ticket: 'imp-97471',
      pedagogicalStep: 396,
      honestCeiling:
        'Presentation only: every bar height is reused verbatim from the imp-97442 baked sweep; no re-solve. Establishes no operator positivity; changes no bound; MCM stays VERIFIED (not proved) at omega=5,6 and is FALSE from omega=11 (imp-97432); Platt-Trudgian Lambda <= 0.2 remains SOTA; RH open; NO QED.',
    }),
    Object.freeze({
      route: '/viz-imp97485-krein-realizability-gap',
      title: 'imp-97457: The Krein Bathtub Realizability Gap',
      oneLine:
        'The imp-97457 measurement that the best realizable band-limited density captures only 43.84% of the imp-97416 bathtub negative integral and peaks at just 52.5% of the a/pi ceiling, charted against the exact bathtub indicator, plus the gap split into comparable realizability (56.2%) and discarded far-field (43.8%) shares.',
      mathBucket: 'measurement',
      dataModule: 'src/data/imp-97485-krein-realizability-gap-viz-data.js',
      paperSourcePath:
        'src/data/imp-97457-krein-bathtub-realizability-gap.js (R, gap attribution, verdict; imp-97485 viz-data leaf + page)',
      ticket: 'imp-97485',
      pedagogicalStep: 397,
      honestCeiling:
        'Presentation only: the f_bath indicator and the gap-split numbers are exact recomputation / verbatim reuse of imp-97457; the f_real curve is a labeled illustrative schematic (not the re-solved eigenfunction of P_a M_{sigma_2^-} P_a). R is a finite-section IEEE-double eigenvalue, not interval-certified. Establishes no operator positivity; changes no bound; interval-rigorous certificate reach stays 2a<=0.96; Platt-Trudgian Lambda <= 0.2 remains SOTA; RH open; NO QED.',
    }),
    Object.freeze({
      route: '/viz-imp97486-sigma2-second-moment-profile',
      title: 'imp-97458: The sigma_2(t) Second-Moment Profile',
      oneLine:
        'The imp-97458 sigma_2(t) profile at 2a=ln3 charted over t in [-12,12]: two negative wells straddling a finite positive island ([3.306,6.945], full-line area 2511.030), then an unbounded far tail beyond |t|=10.532 whose cumulative positive area diverges like T^5 ln T.',
      mathBucket: 'measurement',
      dataModule: 'src/data/imp-97486-sigma2-second-moment-profile-viz-data.js',
      paperSourcePath:
        'src/data/imp-97458-krein-csharp-discarded-positive-far-field.js (sigma_2 findings, region boundaries, far-tail table; imp-97486 viz-data leaf + page)',
      ticket: 'imp-97486',
      pedagogicalStep: 398,
      honestCeiling:
        'Presentation only: the sigma_2(t) samples are an exact recomputation; the region boundaries and far-tail area table are reused verbatim from imp-97458. Establishes no operator positivity; changes no bound; interval-rigorous certificate reach stays 2a<=0.96; Platt-Trudgian Lambda <= 0.2 remains SOTA; RH open; NO QED.',
    }),
    Object.freeze({
      route: '/viz-imp97487-bimodal-1pct-crossover',
      title: 'imp-97459: The Bimodal 1% Crossover',
      oneLine:
        'The imp-97459 bimodal x*(1%) crossover charted as two adjacent signed-deviation crests straddling 1%: a lower crest at x=1/6 whose sampled tip climbs 0.9100->1.0920% toward a fixed 1.113% continuum value, and an upper crest at x=1/5 dead-flat at 1.3934%; A(b)=x*b stays piecewise-linear across the flip.',
      mathBucket: 'measurement',
      dataModule: 'src/data/imp-97487-bimodal-1pct-crossover-viz-data.js',
      paperSourcePath:
        'src/data/imp-97459-route-m-bimodal-1pct-crossover-peaks.js (crest table, step point, A(b) scale; imp-97487 viz-data leaf + page)',
      ticket: 'imp-97487',
      pedagogicalStep: 399,
      honestCeiling:
        'Presentation only: the d(a,b) samples are an exact recomputation; the crest tips, step point, and A(b) scale table are reused verbatim from imp-97459. Establishes no operator positivity; changes no bound; the rigorous anchor stays the trace ceiling T=2.594e7; Platt-Trudgian Lambda <= 0.2 remains SOTA; RH open; NO QED.',
    }),
    Object.freeze({
      route: '/viz-imp97488-krein-route2-kbig-saturation',
      title: 'imp-97455: The Route-2 Kbig->inf Saturation',
      oneLine:
        'The imp-97455 Kbig->infinity behaviour of the best-reachable Route-2 lower bound on lambda_2: measured points (-196.863 at Kbig=44 to -303.336 at Kbig=140) hug a saturation fit (R^2=0.9965) flattening toward a finite floor [-322.065,-305.866], against linear (R^2=0.799) and log (R^2=0.913) divergence fits that keep falling once extrapolated past Kbig=140 -- still four orders of magnitude below the required 0.581059.',
      mathBucket: 'measurement',
      dataModule: 'src/data/imp-97488-krein-route2-kbig-saturation-viz-data.js',
      paperSourcePath:
        'src/data/imp-97455-krein-route2-kbig-divergence-rate.js (measured points, fit parameters, finite-floor bracket; imp-97488 viz-data leaf + page)',
      ticket: 'imp-97488',
      pedagogicalStep: 400,
      honestCeiling:
        'Presentation only: the measured points and fit parameters are reused verbatim from imp-97455; the fit curves are the same closed forms evaluated past the measured range. Establishes no operator positivity; changes no bound; interval-rigorous reach stays 2a<=0.96; Platt-Trudgian Lambda <= 0.2 remains SOTA; RH open; NO QED.',
    }),
    Object.freeze({
      route: '/viz-imp97504-krein-route2-kbig-direct-floor',
      title: 'imp-97482: The Route-2 Kbig Floor, Directly Built',
      oneLine:
        'The imp-97482 direct-build extension of the Route-2 Kbig->infinity floor past the imp-97455 Kbig=140 ceiling: four directly-measured points (-303.336 at Kbig=140 to -308.745 at Kbig=260, no extrapolation) with 40-step increments collapsing 3.006->1.524->0.879, tightening the floor to [-313.756,-308.745] inside the earlier extrapolated [-322.065,-305.866], alongside tr(A2) still converging toward ~4819.1M.',
      mathBucket: 'measurement',
      dataModule: 'src/data/imp-97504-krein-route2-kbig-direct-floor-viz-data.js',
      paperSourcePath:
        'src/data/imp-97482-krein-route2-kbig-direct-projector-floor.js (directly-built points, step deltas, tightened floor bracket; imp-97504 viz-data leaf + page)',
      ticket: 'imp-97504',
      pedagogicalStep: 401,
      honestCeiling:
        'Presentation only: every point, step delta, and bracket is reused verbatim from imp-97482. Establishes no operator positivity; changes no bound; interval-rigorous reach stays 2a<=0.96; Platt-Trudgian Lambda <= 0.2 remains SOTA; RH open; NO QED.',
    }),
    Object.freeze({
      route: '/viz-imp97550-krein-route2-lambda-floor-trace',
      title: 'imp-97513: The Route-2 Lambda_2 Floor, Kbig=420-500',
      oneLine:
        'The imp-97513 direct-build extension of the Route-2 Kbig->infinity lambda_2 floor past the imp-97495 Kbig=380 edge: four directly-measured points (-309.931066 at Kbig=380 to -310.375499 at Kbig=500, no extrapolation) with 40-step increments collapsing 0.190536->0.143344->0.110553 (ratios still rising 0.730->0.771, not plateaued), tightening the floor bracket to [-313.756,-310.375499], alongside tr(A2) still converging toward ~4819.1M.',
      mathBucket: 'measurement',
      dataModule: 'src/data/imp-97550-krein-route2-lambda-floor-trace-viz-data.js',
      paperSourcePath:
        'src/data/imp-97513-krein-route2-kbig420-500-deep-floor.js (directly-built points, step deltas, tightened floor bracket; imp-97550 viz-data leaf + page)',
      ticket: 'imp-97550',
      pedagogicalStep: 409,
      honestCeiling:
        'Presentation only: every point, step delta, and bracket is reused verbatim from imp-97513. Establishes no operator positivity; changes no bound; interval-rigorous reach stays 2a<=0.96; Platt-Trudgian Lambda <= 0.2 remains SOTA; RH open; NO QED.',
    }),
    Object.freeze({
      route: '/viz-imp97505-krein-well-capture-tradeoff',
      title: 'imp-97483: The Well-Capture vs Far-Field-Cost Trade-off',
      oneLine:
        'The imp-97483 U-shaped trade-off curve for the band-limited Krein minimiser at 2a=ln3: captured negative, incurred positive, and total int sigma_2|psi|^2 vs confinement radius R, crossing to a single interior minimum at R*=3.35 (total 6.83, converging ~7.3) -- still ~12x the measured c_sharp upper bracket 0.582, with no radius closing the gap.',
      mathBucket: 'measurement',
      dataModule: 'src/data/imp-97505-krein-well-capture-tradeoff-viz-data.js',
      paperSourcePath:
        'src/data/imp-97483-krein-well-capture-vs-farfield-cost-tradeoff.js (the measured trade-off curve, optimum, and verdict; imp-97505 viz-data leaf + page)',
      ticket: 'imp-97505',
      pedagogicalStep: 402,
      honestCeiling:
        'Presentation only: every point and constant is reused verbatim from imp-97483. Establishes no operator positivity; changes no bound; interval-rigorous reach stays 2a<=0.96; Platt-Trudgian Lambda <= 0.2 remains SOTA; RH open; NO QED.',
    }),
    Object.freeze({
      route: '/viz-imp97506-window-set-surrogate-depth',
      title: 'imp-97481: Window-Set Surrogate Depth vs Min-Prime P0',
      oneLine:
        'The imp-97481 exact Mertens window-set limit -c e^{-gamma}/Prod_{p<P0}(1-1/p) vs min-prime P0: the primorial (P0=2) sits at the SHALLOWEST floor -0.046788, and the limit sinks unboundedly (-0.388874 at P0=101, -0.497500 at P0=379), crossing the -1/4-R(1)=-0.251246 threshold well before P0=101 -- refuting the imp-97461 primorial-extremizer premise and the b/4-ceiling lower edge.',
      mathBucket: 'measurement',
      dataModule: 'src/data/imp-97506-window-set-surrogate-depth-viz-data.js',
      paperSourcePath:
        'src/data/imp-97481-route-m-quarter-ceiling-lower-edge-refuted-window-sets.js (the exact closed form, kernel, and verdict; imp-97506 viz-data leaf + page)',
      ticket: 'imp-97506',
      pedagogicalStep: 403,
      honestCeiling:
        'Presentation only: every point is the imp-97481 closed form evaluated verbatim. Establishes no operator positivity; changes no bound; the b/4-ceiling was exploratory Route-M, load-bearing for nothing; kappa_arith unchanged; Platt-Trudgian Lambda <= 0.2 remains SOTA; RH open; NO QED.',
    }),
    Object.freeze({
      route: '/viz-imp97507-krein-nscaled-tgrid-heatmap',
      title: 'imp-97484: lam_min(N,T) Heatmap (N=84..164, T=4800..8000)',
      oneLine:
        'Heatmap / column-family grid of the imp-97484 extended well-resolved lam_min(N,T) table: every row (fixed N) lightens as T rises and every column (fixed T) darkens as N rises, with the darkest, tightest cell at (N=164, T=8000) = 0.578574, the current best directly-read resolved upper bracket on the Krein c_sharp at 2a=ln3.',
      mathBucket: 'measurement',
      dataModule: 'src/data/imp-97507-krein-nscaled-tgrid-heatmap-viz-data.js',
      paperSourcePath:
        'src/data/imp-97484-krein-csharp-nscaled-tgrid-extended.js (the source table, findings, and verdict; imp-97507 viz-data leaf + page)',
      ticket: 'imp-97507',
      pedagogicalStep: 404,
      honestCeiling:
        'Presentation only: every cell is the imp-97484 lam_min(N,T) table reused verbatim. Establishes no operator positivity; no lower bound; changes no bound; interval-rigorous reach stays 2a<=0.96; Platt-Trudgian Lambda <= 0.2 remains SOTA; RH open; NO QED.',
    }),
    Object.freeze({
      route: '/viz-imp97508-mcm-baseterm-extprec',
      title: 'imp-97478: MCM Level-1 Base Term c(x)=h(x)-h(2x), Extended Precision',
      oneLine:
        'The imp-97478 extended-precision (40 dps) level-1 MCM base term c(x)=h(x)-h(2x) against the closed-form two-term law (1/24)(ln x)/x + M0/x (max relative deviation 1.08e-10), and the scaled c*x/ln x drifting down toward K0=1/24=0.041667, with the corrected window-top point c(457015)=1.397144e-6 and the refuted x=5e5 double-precision "blip" annotated.',
      mathBucket: 'measurement',
      dataModule: 'src/data/imp-97508-mcm-baseterm-extprec-viz-data.js',
      paperSourcePath:
        'src/data/imp-97478-route-m-mcm-level1-baseterm-extprec.js (the baked extended-precision ladder, closed form, and verdict; imp-97508 viz-data leaf + page)',
      ticket: 'imp-97508',
      pedagogicalStep: 405,
      honestCeiling:
        'Presentation only: every point is the imp-97478 baked extended-precision ladder reused verbatim. Establishes no operator positivity; changes no bound; MCM stays VERIFIED not proved (and FALSE from omega=11 per imp-97432); kappa_arith unchanged; Platt-Trudgian Lambda <= 0.2 remains SOTA; RH open; NO QED.',
    }),
    Object.freeze({
      route: '/viz-imp97526-named-concentration-tool-verdict-table',
      title: 'imp-97502: Named Concentration Tool Verdict Table',
      oneLine:
        'The imp-97502 tool-by-tool verdict table at 2a=ln3: Donoho-Stark, Amrein-Berthier/Nazarov, Nazarov/Turan-Nazarov reverse-Holder, and Paneah/Logvinenko-Sereda all fall to Wall A (depth 4336.198 dominates any mass-fraction ceiling, needing theta_max<1.153e-4) and Wall B (indicator/Lebesgue mass, never the signed sigma_2 weight), governed by the time-bandwidth product TBW=15.15.',
      mathBucket: 'measurement',
      dataModule: 'src/data/imp-97526-named-concentration-tool-verdict-table-viz-data.js',
      paperSourcePath:
        'src/data/imp-97502-krein-named-concentration-inequality-assessment.js (the source verdict, conversion data, and per-tool booleans; imp-97526 viz-data leaf + page)',
      ticket: 'imp-97526',
      pedagogicalStep: 406,
      honestCeiling:
        'Presentation only: every row and constant is reused verbatim from imp-97502. Establishes no operator positivity; changes no bound; interval-rigorous reach stays 2a<=0.96; Platt-Trudgian Lambda <= 0.2 remains SOTA; RH open; NO QED.',
    }),
    Object.freeze({
      route: '/viz-imp97569-confined-well-sign-map',
      title: 'imp-97537: Confined Well vs Projected Positivity',
      oneLine:
        'The imp-97537 sigma_2(t) sign map -- confined well [0,3.306] u [6.945,10.532], intervening positive band, measured positive out to t=27, rigorously proven positive t>=27 (imp-97501) -- alongside the true (finite-N Galerkin) soft lambda_min(T_a[sigma_2]) curve, which stays positive through 2a=ln3 and crosses zero only at 2a*~1.1316, past ln3.',
      mathBucket: 'measurement',
      dataModule: 'src/data/imp-97569-confined-well-sign-map-viz-data.js',
      paperSourcePath:
        'src/data/imp-97537-confined-well-vs-projected-positivity-assessment.js (the source assessment, well/band boundaries, and lambda_min crossing; imp-97569 viz-data leaf + page)',
      ticket: 'imp-97569',
      pedagogicalStep: 414,
      honestCeiling:
        'Presentation only: sign-map boundaries and lambda_min samples are reused verbatim from imp-97537. Establishes no operator positivity; changes no bound; interval-rigorous reach stays 2a<=0.96; Platt-Trudgian Lambda <= 0.2 remains SOTA; RH open; NO QED.',
    }),
    Object.freeze({
      route: '/viz-imp97528-krein-tail-converged-drift',
      title: 'imp-97497: Tail-Converging the Well-Capture Drift',
      oneLine:
        'The imp-97497 tail-convergence of the imp-97483 well-capture scalar optimum: the truncation drift tot(T)=6.56/6.83/6.97/7.22 at T=200/300/400/800 rises toward the analytic limit tot(inf)=7.53, and the exact/tail split at T0=600/800/1000 moves mass while the sum stays fixed at 7.5352.',
      mathBucket: 'measurement',
      dataModule: 'src/data/imp-97528-krein-tail-converged-drift-viz-data.js',
      paperSourcePath:
        'src/data/imp-97497-krein-welloptimum-tail-converged.js (the tail-converged drift ladder, split-point table, and verdict; imp-97528 viz-data leaf + page)',
      ticket: 'imp-97528',
      pedagogicalStep: 407,
      honestCeiling:
        'Presentation only: every point is reused verbatim from imp-97497. Establishes no operator positivity; changes no bound; interval-rigorous reach stays 2a<=0.96; Platt-Trudgian Lambda <= 0.2 remains SOTA; RH open; NO QED.',
    }),
    Object.freeze({
      route: '/viz-imp97549-two-term-law-descent-surrogate',
      title: 'imp-97500: Two-Term-Law Descent Surrogate vs log Y',
      oneLine:
        'The imp-97500 two-term law surrogate([P0,Y]) = L(P0) + A(P0)/log Y for min-primes P0 in {2,101,379,1009,10007} vs log Y, overlaid with the exact -1/4-R(1)=-0.251246 crossing threshold and the baked exact crossing points (P0=379 at Y=73,612,801, P0=1009 at Y=42,333,157, P0=10007 at Y=75,415,303); P0=2 and P0=101 never reach the threshold within the charted window.',
      mathBucket: 'measurement',
      dataModule: 'src/data/imp-97549-two-term-law-descent-surrogate-viz-data.js',
      paperSourcePath:
        'src/data/imp-97500-route-m-window-surrogate-descent-rate-min-b-crossing.js (the two-term law, kernel, and verdict; imp-97549 viz-data leaf + page)',
      ticket: 'imp-97549',
      pedagogicalStep: 408,
      honestCeiling:
        'Presentation only: every curve is the imp-97500 two-term law evaluated verbatim. Establishes no operator positivity; changes no bound; the b/4-ceiling lower edge was already refuted (imp-97481) and is a dead route; kappa_arith unchanged; Platt-Trudgian Lambda <= 0.2 remains SOTA; RH open; NO QED.',
    }),
    Object.freeze({
      route: '/viz-imp97551-w1lower-farfield-margin',
      title: 'imp-97501: The Rigorous Far-Field Positivity Margin',
      oneLine:
        'The imp-97501 rigorous far-field margin of sigma_2(t)=(t^2+1/4)^2 w_1(t): the actual oscillating w_1(t) charted against its strictly increasing rigorous lower bound w1Lower(t)=L(t)-sqrt2 ln2, crossing zero at t*=26.1023 and giving margin 0.0616061 at the clean threshold t0=27, alongside the confined negative well [0,3.306]u[6.945,10.532] and the guarded bridge window [10.532,27].',
      mathBucket: 'measurement',
      dataModule: 'src/data/imp-97551-w1lower-farfield-margin-viz-data.js',
      paperSourcePath:
        'src/data/imp-97501-sigma2-far-field-positivity-rigorous-margin.js (the rigorous margin, t*, t0, guarded window; imp-97551 viz-data leaf + page)',
      ticket: 'imp-97551',
      pedagogicalStep: 410,
      honestCeiling:
        'Presentation only: the w_1(t) samples are an exact recomputation; the summary constants and confined-well boundaries are reused verbatim from imp-97501/imp-97399. Establishes no operator positivity; changes no bound; interval-rigorous reach stays 2a<=0.96; Platt-Trudgian Lambda <= 0.2 remains SOTA; RH open; NO QED.',
    }),
    Object.freeze({
      route: '/viz-imp97552-e1-envelope-decay',
      title: 'imp-97539: E1(b)/(phi(b) b) Decay vs the Analytic Envelope',
      oneLine:
        'The imp-97539 tabulation of ratio(b)=|E1(b)|/(phi(b) b) (the imp-97516 STEP 3 sub-leading L1 remainder) against the analytic envelope env(b)=log b log log b / b on a log-log scale across a 12-point b-ladder (primorials, prime, squarefree families); ratio(b) sits under env(b) at every point, decaying from 1.175e-3 at b=211 to 8.329e-6 at b=30011 (~1/b).',
      mathBucket: 'measurement',
      dataModule: 'src/data/imp-97552-e1-envelope-decay-viz-data.js',
      paperSourcePath:
        'src/data/imp-97539-route-m-e1-envelope-ladder.js (the tabulated 12-point ladder; imp-97552 viz-data leaf + page)',
      ticket: 'imp-97552',
      pedagogicalStep: 411,
      honestCeiling:
        'Presentation only: all (b, ratio, env) points are reused verbatim from imp-97539, log-log transform only, no new measurement. Establishes no operator positivity; changes no bound; kappa_arith=0.5704960511 unchanged; Platt-Trudgian Lambda <= 0.2 remains SOTA; RH open; NO QED.',
    }),
    Object.freeze({
      route: '/viz-imp97553-kappa-decomposition',
      title: 'imp-97541: kappa = kappa_arith + kappa_cot(b) Decomposition',
      oneLine:
        'The imp-97541 kappa decomposition kappa(b)=kappa_arith+kappa_cot(b) as a stacked area across an 11-point b-ladder: constant kappa_arith=0.5704960511 base plus climbing kappa_cot(b) (0.0588 at b=31 toward the conjectural 1/8 limit), with combined kappa(b) approaching the KAPPA_LIMIT ~0.6955 (matching the memory route_m_lower_companion figure ~0.696).',
      mathBucket: 'measurement',
      dataModule: 'src/data/imp-97553-route-m-kappa-decomposition-viz-data.js',
      paperSourcePath:
        'src/data/imp-97541-route-m-kappa-cot-extended-measurement.js (the tabulated 11-point ladder; imp-97553 viz-data leaf + page)',
      ticket: 'imp-97553',
      pedagogicalStep: 412,
      honestCeiling:
        'Presentation only: all (b, kappaCot, kappa) points are reused verbatim from imp-97541, stacked-decomposition transform only, no new measurement. Establishes no operator positivity; changes no bound; kappa stays MEASURED, not proved; Platt-Trudgian Lambda <= 0.2 remains SOTA; RH open; NO QED.',
    }),
    Object.freeze({
      route: '/viz-imp97554-b4-ceiling-minb-p0',
      title: 'imp-97500: b/4-Ceiling Counterexample Size vs Window Floor P0',
      oneLine:
        'The imp-97500 RESULT 3 CROSSINGS table charting the counterexample size log10(b)=Prod_{P0<=p<=Ycross} p against the window floor P0, showing an interior minimum at P0=1409 (log10(b_min)=17,823,049, ~17.82M digits) -- ~44% fewer digits than the imp-97496 boundary witness at P0=379 (~31.97M digits).',
      mathBucket: 'measurement',
      dataModule: 'src/data/imp-97554-b4-ceiling-minb-p0-viz-data.js',
      paperSourcePath:
        'src/data/imp-97500-route-m-window-surrogate-descent-rate-min-b-crossing.js (the CROSSINGS table; imp-97554 viz-data leaf + page)',
      ticket: 'imp-97554',
      pedagogicalStep: 413,
      honestCeiling:
        'Presentation only: all (P0, log10b) points are reused verbatim from imp-97500, nothing re-derived. The b/4-ceiling lower edge was already REFUTED (imp-97481) and is a dead route; this only charts the already-measured smallest-witness curve. Establishes no operator positivity; changes no bound; Platt-Trudgian Lambda <= 0.2 remains SOTA; RH open; NO QED.',
    }),
    Object.freeze({
      route: '/viz-imp97570-crossover-crest-combined',
      title: 'imp-97441 / imp-97459: The Bimodal 1% Crossover Merged With Its Two Crests',
      oneLine:
        'Merges the imp-97441 four-tolerance crossover-fraction table x*(eps) with the imp-97459 crest-amplitude table on the same b-ladder axis, pinning the eps=1% branch flip (0.199->0.1665) to the row where the 1/6 crest amplitude crosses the 1% line while the 1/5 crest and the other three tolerances stay flat.',
      mathBucket: 'measurement',
      dataModule: 'src/data/imp-97570-crossover-crest-combined-viz-data.js',
      paperSourcePath:
        'src/data/imp-97441-route-m-crossover-fraction-tolerance-table.js (x*(eps) table); src/data/imp-97459-route-m-bimodal-1pct-crossover-peaks.js (crest table, step point; imp-97570 viz-data leaf + page)',
      ticket: 'imp-97570',
      pedagogicalStep: 414,
      honestCeiling:
        'Presentation only: every value is reused verbatim from imp-97441 and imp-97459, merged into one row-aligned table and chart, nothing re-derived. Establishes no operator positivity; changes no bound; the rigorous anchor stays T = 2.594e7; Platt-Trudgian Lambda <= 0.2 remains SOTA; RH open; NO QED.',
    }),
    Object.freeze({
      route: '/viz-imp97572-csharp-floor-ladder',
      title: 'imp-97492: The c_sharp Floor-Sharpening Ladder, Residual Shares Made Explicit',
      oneLine:
        'Charts the imp-97492 Krein c_sharp floor-sharpening ladder (-4336.198 -> -3200.029 -> -3065.435 -> -1343.796 realizable -> ~0.581059 measured) on one axis, with the two named residual shares (realizability +1721.639, 56.2%; discarded t^4 far field +1344.378, 43.8%) that exactly close the gap.',
      mathBucket: 'measurement',
      dataModule: 'src/data/imp-97572-csharp-floor-ladder-viz-data.js',
      paperSourcePath:
        'src/data/imp-97492-krein-csharp-lower-bound-obstruction-cohort-index.js (source cohort index; imp-97572 viz-data leaf + page)',
      ticket: 'imp-97572',
      pedagogicalStep: 415,
      honestCeiling:
        'Presentation only: every value is reused verbatim from the imp-97492 cohort index, nothing re-derived. No rigorous positive lower bound on c_sharp exists; interval-rigorous certified reach stays 2a<=0.96; Platt-Trudgian Lambda <= 0.2 remains SOTA; RH open; NO QED.',
    }),
    Object.freeze({
      route: '/viz-imp97587-krein-farprofile-envelope',
      title: 'imp-97518: The Confinement Far-Profile 1/t^3 Envelope',
      oneLine:
        'Charts the imp-97518 closed-form confinement far profile psi_R(t) ~ -(1/pi) g_pp(a) sin(a t)/t^3 oscillating inside its +-1/t^3 envelope, |psi_R(t)|^2 inside the 1/t^6 envelope on a log-log axis, and the imp-97497 sin^2-peak validation ratios climbing 0.9969 -> 0.9992 -> 0.9999 toward 1 as t grows from 203 to 1004.',
      mathBucket: 'measurement',
      dataModule: 'src/data/imp-97587-krein-farprofile-envelope-viz-data.js',
      paperSourcePath:
        'src/data/imp-97518-krein-tail-endpoint-asymptotic-closed-form.js (gppEdge/gpppEdge/biasRelCoeff closed forms); src/data/imp-97497-krein-welloptimum-tail-converged.js (R*=3.36, peak-validation ratios; imp-97587 viz-data leaf + page)',
      ticket: 'imp-97587',
      pedagogicalStep: 416,
      honestCeiling:
        'Presentation only: the curve samples reuse the imp-97518 closed-form functions and the imp-97497 peak-validation ratios verbatim, nothing re-derived. Establishes no operator positivity; changes no bound; interval-rigorous certified reach stays 2a<=0.96; Platt-Trudgian Lambda <= 0.2 remains SOTA; RH open; NO QED.',
    }),
    Object.freeze({
      route: '/viz-imp97588-mcm-baseterm-K0-approach',
      title: 'imp-97519: Route M MCM Base-Term Approach to K0=1/24',
      oneLine:
        'Charts the imp-97519 Route M MCM level-1 base-term scaled quantity c(x)*x/ln x = K0 + M0/ln x approaching K0=1/24 across x=1e6..1e40, marking the 0.045 crossing at x~2.77e12 and the 0.043 crossing at x~1.2737e31, plus the residual = scaled(x)-K0 tracking M0/ln x exactly on a log-log panel.',
      mathBucket: 'measurement',
      dataModule: 'src/data/imp-97588-mcm-baseterm-K0-approach-viz-data.js',
      paperSourcePath:
        'src/data/imp-97519-route-m-mcm-baseterm-043-crossing-spotcheck.js (K0, M0, crossing043, driftLadder baked verbatim; imp-97588 viz-data leaf + page)',
      ticket: 'imp-97588',
      pedagogicalStep: 417,
      honestCeiling:
        'Presentation only: every value reuses the imp-97499/imp-97519 closed-form law and baked crossing/drift values verbatim, nothing re-derived. No bound moves; MCM stays VERIFIED at omega<=6 and FALSE from omega=11 (imp-97432); Platt-Trudgian Lambda <= 0.2 remains SOTA; RH open; NO QED.',
    }),
    Object.freeze({
      route: '/viz-imp97589-sigma-landmark-ladder',
      title: 'imp-97520: sigma(N) Conditional-Share Landmark Ladder',
      oneLine:
        'Charts the imp-97520 sigma(N) = E_coll/E_N conditional-share decay curve on a log-N axis with the four tabulated landmarks overlaid: interior peak (sigma~0.949429 at N~9.22e5), below-0.9 crossing (N~2.57e7), halving crossing (N~3.27e9), and below-0.1 crossing (N~3.21e11).',
      mathBucket: 'measurement',
      dataModule: 'src/data/imp-97589-sigma-landmark-ladder-viz-data.js',
      paperSourcePath:
        'src/data/imp-97520-sigma-conditional-share-landmark-ladder.js (four-landmark ladder object baked verbatim; imp-97589 viz-data leaf + page)',
      ticket: 'imp-97589',
      pedagogicalStep: 418,
      honestCeiling:
        'Presentation only: the curve re-evaluates the exact inherited imp-3406/imp-33582/imp-33601/imp-33723 sigma(N) sub-terms and the four landmarks are pulled verbatim from the imp-97520 tabulated ladder, nothing re-derived. No bound moves; establishes no operator positivity; Platt-Trudgian Lambda <= 0.2 remains SOTA; RH open; NO QED.',
    }),
    Object.freeze({
      route: '/viz-imp97612-cusp-separation',
      title: 'imp-97576: Two-Scale Cusp Separation (Average Shrinks, Wobble Grows)',
      oneLine:
        'Log-log line chart of the imp-97576 cusp x0 -> 0 ladder: the Gauss-Kuzmin average |mean(r/x^2)| falling monotonically (7.68e-2 -> 2.61e-3) against the pointwise wobble sd rising monotonically (3.21e-3 -> 2.72e-2), crossing the 1e-2 kappa_smooth upper bound near x0=0.01-0.005.',
      mathBucket: 'measurement',
      dataModule: 'src/data/imp-97612-cusp-separation-viz-data.js',
      paperSourcePath:
        'src/data/imp-97576-route-m-gauss-kuzmin-wobble-average.js (IMP97576_CUSP_LADDER FINDING 2/3 baked verbatim; imp-97612 viz-data leaf + page)',
      ticket: 'imp-97612',
      pedagogicalStep: 419,
      honestCeiling:
        'Presentation only: every mean/sd value is reused verbatim from imp-97576 (a measurement, not a derivation); kappa_smooth is NOT pinned to an exact value, only its cusp-limit smallness is measured. Changes no bound, establishes no operator positivity, no RH claim; Platt-Trudgian Lambda <= 0.2 remains SOTA; RH open; NO QED.',
    }),
    Object.freeze({
      route: '/viz-imp97613-eflow-share-decay',
      title: 'imp-97585: Gronwall Flow-Share Decay E_flow/E_trunc',
      oneLine:
        'Log-log line chart of the imp-97585 decade ladder N in {1e6 .. 1e12}: the Gronwall flow share E_flow/E_trunc collapsing monotonically (1.4376 -> 1.3029e-5), with the share=1 crossing (N~1.60e6), the share=1e-3 crossing (N~6.93e9), and the halving landmark N_half~3.27e9 overlaid.',
      mathBucket: 'measurement',
      dataModule: 'src/data/imp-97613-eflow-share-decay-viz-data.js',
      paperSourcePath:
        'src/data/imp-97585-eflow-etrunc-share-full-ladder.js (LADDER and landmarks baked verbatim; imp-97613 viz-data leaf + page)',
      ticket: 'imp-97613',
      pedagogicalStep: 420,
      honestCeiling:
        'Presentation only: every ladder/landmark value is reused verbatim from imp-97585 (a measurement, not a derivation); no new computation. Changes no bound, establishes no operator positivity, no RH claim; Platt-Trudgian Lambda <= 0.2 remains SOTA; RH open; NO QED.',
    }),
    Object.freeze({
      route: '/viz-imp97614-tailbias-Rsweep',
      title: 'imp-97580: Far-Field Tail-Bias Sign Change relBias(R)',
      oneLine:
        'Line chart of the imp-97580 far-field tail-bias relBias(R) = 3(1/a - a R^2) * (I2/I1) across the R ladder, marking the sign-change radius Rc = 1/a = 1.8205 (bias exactly zero) and the imp-97497 far-field-cost optimum R* = 3.36 (bias -2.727e-5, inside the < 1e-3 tail bar).',
      mathBucket: 'measurement',
      dataModule: 'src/data/imp-97614-tailbias-Rsweep-viz-data.js',
      paperSourcePath:
        'src/data/imp-97580-krein-tail-bias-R-sweep-signchange.js (IMP97580_R_SWEEP baked verbatim; imp-97614 viz-data leaf + page)',
      ticket: 'imp-97614',
      pedagogicalStep: 421,
      honestCeiling:
        'Presentation only: every R-sweep value is reused verbatim from imp-97580 (a measurement, not a derivation); no new computation. Changes no bound, establishes no operator positivity, no RH claim; Platt-Trudgian Lambda <= 0.2 remains SOTA; RH open; NO QED.',
    }),
    Object.freeze({
      route: '/viz-imp97627-mcm-margin-collapse-ladder',
      title: 'imp-97583/imp-97601: Route-M MCM Margin-Collapse Ladder T(p_omega#)',
      oneLine:
        'Line chart of the Route-M MCM primorial holding margin T(p_omega#) vs omega (1.00e-2, 6.82e-3, 4.18e-3, 2.10e-3, 4.78e-4 -> first negative -9.62e-4 at omega=11), overlaying the imp-97601 gap-to-limit law gap(omega)~0.166635/log p_omega and the -e^{gamma}/12+Rcorr primorial limit asymptote (~-0.0458).',
      mathBucket: 'measurement',
      dataModule: 'src/data/imp-97627-mcm-margin-collapse-ladder-viz-data.js',
      paperSourcePath:
        'src/data/imp-97583-route-m-mcm-onset-omega11-primorial.js + src/data/imp-97601-route-m-mcm-margin-collapse-rate-law.js (ladder/limit baked verbatim; imp-97627 viz-data leaf + page)',
      ticket: 'imp-97627',
      pedagogicalStep: 422,
      honestCeiling:
        'Presentation only: every ladder/limit value is reused verbatim from imp-97583/imp-97601 (measurements, not derivations); no new computation. Changes no bound; MCM stays refuted from omega=11; Platt-Trudgian Lambda <= 0.2 remains SOTA; RH open; NO QED.',
    }),
    Object.freeze({
      route: '/viz-imp97628-mcm-surrogate-vs-fullh-onset',
      title: 'imp-97583: Route-M MCM Surrogate vs Full-h Onset',
      oneLine:
        'Two-line chart comparing the smooth surrogate iterDiff(H,p_omega#,1) (first negative at omega=10, -5.40e-4) against the full-h value T(p_omega#) (first negative at omega=11, -9.62e-4), showing the near-flat +1.019e-3 R-correction buys exactly one order of reprieve.',
      mathBucket: 'measurement',
      dataModule: 'src/data/imp-97628-mcm-surrogate-vs-fullh-onset-viz-data.js',
      paperSourcePath:
        'src/data/imp-97583-route-m-mcm-onset-omega11-primorial.js (ladder baked verbatim; imp-97628 viz-data leaf + page)',
      ticket: 'imp-97628',
      pedagogicalStep: 423,
      honestCeiling:
        'Presentation only: every surrogate/Rcorr/full-h value is reused verbatim from imp-97583 (a measurement, not a derivation); no new computation. Changes no bound; MCM stays refuted from omega=11; Platt-Trudgian Lambda <= 0.2 remains SOTA; RH open; NO QED.',
    }),
    Object.freeze({
      route: '/viz-imp97629-realizable-fraction-window-climb',
      title: 'imp-97564: Realizable-Fraction Window Climb (correcting imp-97457 43.84%)',
      oneLine:
        'Bar chart of the imp-97564 realizable/bathtub fraction climbing 0.43837 (T=12) -> 0.50552 (T=64) with decelerating increments as the window half-width widens, plus the 1/T Richardson extrapolation to ~0.513 (R_inf~1573), correcting the imp-97457 43.84% figure as a window-truncation artifact rather than a saturated value.',
      mathBucket: 'measurement',
      dataModule: 'src/data/imp-97629-realizable-fraction-window-climb-viz-data.js',
      paperSourcePath:
        'src/data/imp-97564-realizability-fraction-resolution-sweep.js (window ladder baked verbatim; imp-97629 viz-data leaf + page)',
      ticket: 'imp-97629',
      pedagogicalStep: 424,
      honestCeiling:
        'Presentation only: every R/fraction/extrapolation value is reused verbatim from imp-97564 (a measurement, not a derivation); no new computation. Realizability gap still persists (~half the envelope); no bound moved; interval-rigorous reach stays 2a<=0.96; Platt-Trudgian Lambda <= 0.2 remains SOTA; RH open; NO QED.',
    }),
    Object.freeze({
      route: '/viz-imp97630-lambda2-floor-spread-waterfall',
      title: 'imp-97600: Lambda_2 Floor Spread Waterfall (5.6% Geometric Tail + 94.4% Tail-Model Disagreement)',
      oneLine:
        'Floating-bar waterfall decomposing the imp-97538 lambda_2 floor bracket spread (3.063773) into its two measured descent steps from the rigorous upper edge -310.692227: 5.6% honest geometric K-truncation tail to the corrected-tail estimate -310.865, then 94.4% tail-MODEL disagreement on nu_max down to the imp-97482 power-refit deep end -313.756, with the m=2 discretization and enclosure-arithmetic sources both at 0%.',
      mathBucket: 'measurement',
      dataModule: 'src/data/imp-97630-lambda2-floor-spread-waterfall-viz-data.js',
      paperSourcePath:
        'src/data/imp-97600-lambda2-floor-spread-decomposition.js (spread decomposition baked verbatim; imp-97630 viz-data leaf + page)',
      ticket: 'imp-97630',
      pedagogicalStep: 425,
      honestCeiling:
        'Presentation only: every anchor/magnitude/share value is reused verbatim from imp-97600 (a measurement/diagnosis, not a derivation); no new computation. No rigorous lower bound on lambda_2 produced; the floor stays four orders below the required 0.581059; interval-rigorous reach stays 2a<=0.96; Platt-Trudgian Lambda <= 0.2 remains SOTA; RH open; NO QED.',
    }),
    Object.freeze({
      route: '/viz-imp97631-sigma-landmark-elasticity-comparison',
      title: 'imp-97584/imp-97598: Sigma-Landmark Elasticity Comparison (E_trunc vs C_C Sign Flip)',
      oneLine:
        'Grouped bar chart pairing the imp-97584 E_trunc-elasticity and imp-97598 C_C-elasticity of the four imp-97520 sigma(N) landmarks: the three downslope landmarks sign-flip (-2.30/-2.10/-2.08 vs +2.56/+2.10/+2.08) while the interior peak L1 goes from shallow-but-nonzero (-1.373) on E_trunc to exactly zero on C_C, since a constant multiplicative prefactor of E_coll cannot move the extremum it helps define.',
      mathBucket: 'measurement',
      dataModule: 'src/data/imp-97631-sigma-landmark-elasticity-comparison-viz-data.js',
      paperSourcePath:
        'src/data/imp-97584-sigma-landmark-etrunc-sensitivity.js + src/data/imp-97598-sigma-landmark-cc-sensitivity.js (both ELASTICITY objects reused verbatim; imp-97631 viz-data leaf + page)',
      ticket: 'imp-97631',
      pedagogicalStep: 426,
      honestCeiling:
        'Presentation only: both elasticity axes are reused verbatim from imp-97584 and imp-97598 (prior measurements, not derivations); no new computation. Changes no bound; establishes no operator positivity; Platt-Trudgian Lambda <= 0.2 remains SOTA; RH open; NO QED.',
    }),
    Object.freeze({
      route: '/viz-imp97635-omega10-extremality-margin',
      title: 'imp-97606: omega=10 Primorial Extremality Margin (Primorial vs Nearest Competitor)',
      oneLine:
        'Bar chart measuring the imp-97606 omega=10 primorial-extremality margin up from the T=0 MCM-failure line: the primorial p_10#={2,3,5,7,11,13,17,19,23,29} holds at T=+4.782772e-4 (the strict minimiser over 20,437 tested sets) while the nearest non-primorial competitor {..,23,31} (29 -> 31) sits +7.520579e-5 above it at T=+5.534829e-4, with no tested set crossing zero.',
      mathBucket: 'measurement',
      dataModule: 'src/data/imp-97635-omega10-extremality-margin-viz-data.js',
      paperSourcePath:
        'src/data/imp-97606-route-m-mcm-omega10-primorial-extremality-broadened.js (IMP97606_OMEGA10_EXTREMALITY reused verbatim; imp-97635 viz-data leaf + page)',
      ticket: 'imp-97635',
      pedagogicalStep: 427,
      honestCeiling:
        'Presentation only: every T-value and set is reused verbatim from imp-97606 (a measurement, not a derivation); no new computation. The b/4 ceiling is untouched; no bound moves; Platt-Trudgian Lambda <= 0.2 remains SOTA; RH open; NO QED.',
    }),
    Object.freeze({
      route: '/viz-imp97651-tra2-ratio-drift',
      title: 'imp-97599: tr(A2) Uniform-80-Block Ratio Drift Toward 1',
      oneLine:
        'Bar chart of the imp-97599 successive 80-step tr(A2) ratio climbing from r1=0.687945 to r2=0.717237 (toward 1, the algebraic-tail signature), alongside a cluster chart showing the geometric/Aitken/algebraic extrapolators still converging near 4818.77M, ~0.333M below the imp-97482 named ~4819.1M line.',
      mathBucket: 'measurement',
      dataModule: 'src/data/imp-97651-tra2-ratio-drift-viz-data.js',
      paperSourcePath:
        'src/data/imp-97599-tra2-third-block-tail-decision.js (IMP97599_UNIFORM_BLOCKS/IMP97599_EXTRAPOLATION/IMP97599_CROSSCHECK reused verbatim; imp-97651 viz-data leaf + page)',
      ticket: 'imp-97651',
      pedagogicalStep: 428,
      honestCeiling:
        'Presentation only: every ratio and extrapolated value is reused verbatim from imp-97599 (a measurement, not a derivation); no new computation. Decides only the tail model (algebraic); no constant is pinned as rigorous. Changes no bound; establishes no operator positivity; Platt-Trudgian Lambda <= 0.2 remains SOTA; RH open; NO QED.',
    }),
    Object.freeze({
      route: '/viz-imp97652-tail-model-fraction-band',
      title: 'imp-97626: Realizable-Fraction Tail-Model Band (Full Ladder vs Asymptotic Tail)',
      oneLine:
        'Grouped-bar and band-range charts of the imp-97626 three tail-model fits (1/T, 1/T^2, (log T)/T) to the window ladder: the full T=12..64 ladder spreads the realizable fraction 0.508..0.543, while restricting to the asymptotic tail T=28..64 collapses all three models into the tight 0.508..0.520 band bracketing the imp-97564 two-rung headline 0.5132.',
      mathBucket: 'measurement',
      dataModule: 'src/data/imp-97652-tail-model-fraction-band-viz-data.js',
      paperSourcePath:
        'src/data/imp-97626-window-extrapolation-model-spread.js (IMP97626_FIT_FULL/IMP97626_FIT_TAIL4/IMP97626_SPREAD/IMP97626_TWO_RUNG_FRACTION reused verbatim; imp-97652 viz-data leaf + page)',
      ticket: 'imp-97652',
      pedagogicalStep: 429,
      honestCeiling:
        'Presentation only: every fraction and band value is reused verbatim from imp-97626 (a measurement, not a derivation); no new computation. Eigenvalues are baked finite-section IEEE-double, not interval-enclosed; R_inf is an extrapolation, not a certified limit. Changes no bound; establishes no operator positivity; Platt-Trudgian Lambda <= 0.2 remains SOTA; RH open; NO QED.',
    }),
    Object.freeze({
      route: '/viz-imp97653-tail-bias-floor',
      title: 'imp-97625: Tail-Bias Signal vs Edge-Amplitude Measurement Floor',
      oneLine:
        'Log-scale ladder and margin charts comparing the imp-97625 far-field tail bias |relBias(3.36)| = 2.727e-5 against two independent edge-amplitude measurement floors (zero-crossing 9.42e-10, R*-local 2.91e-9) and the imp-97497 < 1e-3 tail bar, showing the negative sign is resolvable ~1e4x above the floor and 36.7x below the tail bar.',
      mathBucket: 'measurement',
      dataModule: 'src/data/imp-97653-krein-tail-bias-floor-viz-data.js',
      paperSourcePath:
        'src/data/imp-97625-krein-tail-bias-signal-vs-floor-assessment.js (IMP97625_FLOOR_ASSESSMENT/IMP97625_VERDICT reused verbatim; imp-97653 viz-data leaf + page)',
      ticket: 'imp-97653',
      pedagogicalStep: 430,
      honestCeiling:
        'Presentation only: every floor, signal, and margin value is reused verbatim from imp-97625 (an assessment, not a derivation); no new computation. Assessment only; the m=1/m=2 Krein enclosure stays unusable at 2a = ln3; interval-rigorous reach stays 2a <= 0.96. Changes no bound; establishes no operator positivity; Platt-Trudgian Lambda <= 0.2 remains SOTA; RH open; NO QED.',
    }),
    Object.freeze({
      route: '/viz-imp97654-additivity-residual-eps-squared-collapse',
      title: 'imp-97623: Additivity-Residual eps^2 Collapse Across Sigma Landmarks',
      oneLine:
        'Log-log residual-vs-eps chart and a ratio bar chart showing the imp-97623 additivity residual |DIAG - (E_CC + E_ET)| quarters at every one of the three imp-97520 sigma landmarks (L2, L3, L4) when the central-difference step halves from eps=1e-3 to eps=5e-4, the O(eps^2) truncation signature that drives the true residual to zero.',
      mathBucket: 'measurement',
      dataModule: 'src/data/imp-97654-additivity-residual-eps-squared-collapse-viz-data.js',
      paperSourcePath:
        'src/data/imp-97623-additivity-residual-multi-landmark-crosscheck.js (IMP97623_ADDITIVITY_RESIDUAL_MULTI_LANDMARK_CROSSCHECK reused verbatim; imp-97654 viz-data leaf + page)',
      ticket: 'imp-97654',
      pedagogicalStep: 431,
      honestCeiling:
        'Presentation only: every residual and ratio value is reused verbatim from imp-97623 (a measurement, not a derivation); no new computation. Conditional-share diagnostic on the inherited imp-3220/imp-3406 extrapolation, not a rigorous asymptotic. Changes no bound; establishes no operator positivity; Platt-Trudgian Lambda <= 0.2 remains SOTA; RH open; NO QED.',
    }),
    Object.freeze({
      route: '/viz-imp97670-three-axis-elasticity',
      title: 'imp-97644: Three-Axis Elasticities (E_CC, E_ET, E_CF) Across Sigma Landmarks',
      oneLine:
        'Grouped bar chart and table showing the imp-97644 single-axis crossing-elasticities E_CC, E_ET and E_CF at the three imp-97520 sigma landmarks (L2, L3, L4): C_C and E_trunc sit close to +/-2 and nearly cancel while the C_F flow-prefactor elasticity is a small same-sign-as-E_ET correction that shrinks outward (2.5e-1 -> 4.0e-3 -> 7.4e-5), and the three-axis diagonal DIAG3 stays machine-zero throughout.',
      mathBucket: 'measurement',
      dataModule: 'src/data/imp-97670-three-axis-elasticity-viz-data.js',
      paperSourcePath:
        'src/data/imp-97644-three-axis-additivity-flow-prefactor.js (IMP97644_THREE_AXIS_ADDITIVITY_FLOW_PREFACTOR.perLandmark reused verbatim; imp-97670 viz-data leaf + page)',
      ticket: 'imp-97670',
      pedagogicalStep: 432,
      honestCeiling:
        'Presentation only: every elasticity and diagonal value is reused verbatim from imp-97644 (a measurement, not a derivation); no new computation. Conditional-share diagnostic on the inherited imp-3220/imp-3406 extrapolation, not a rigorous asymptotic. Changes no bound; establishes no operator positivity; Platt-Trudgian Lambda <= 0.2 remains SOTA; RH open; NO QED.',
    }),
    Object.freeze({
      route: '/viz-imp97812-tra2-ratio-ladder',
      title: 'imp-97684: tr(A2) Uniform-Block Ratio Ladder, Algebraic vs Geometric',
      oneLine:
        'Line chart and drift bar chart showing the imp-97684 tr(A2) five-block ratio ladder r1..r4 climbing monotonically toward 1 (0.687945 -> 0.717237 -> 0.741517 -> 0.761970) with a decelerating increment at every step -- the algebraic (power-law) tail signature, versus the flat ratio a geometric tail would require.',
      mathBucket: 'measurement',
      dataModule: 'src/data/imp-97812-tra2-ratio-ladder-viz-data.js',
      paperSourcePath:
        'src/data/imp-97684-tra2-fifth-block-tail-confirmation.js (IMP97684_LADDER/IMP97684_UNIFORM_BLOCKS/IMP97684_EXTRAPOLATION reused verbatim; imp-97812 viz-data leaf + page)',
      ticket: 'imp-97812',
      pedagogicalStep: 446,
      honestCeiling:
        'Presentation only: every ratio, drift and extrapolated limit is reused verbatim from imp-97684 (a measurement, not a derivation); no new computation. Conditional-share diagnostic on the inherited imp-3220/imp-3406 extrapolation, not a rigorous asymptotic. Changes no bound; establishes no operator positivity; Platt-Trudgian Lambda <= 0.2 remains SOTA; RH open; NO QED.',
    }),
    Object.freeze({
      route: '/viz-imp124815-pairratio-ladder',
      title: 'imp-124770: Pair-Ratio Identity Ladder, Measured vs Analytic',
      oneLine:
        'Log-scale line chart plus bar chart showing the imp-124770 pair-ratio identity cross-check across landmarks L2..L7: measured 5-point E_CF/E_ET tracks analytic E_flow/E_trunc closely at every rung while |reldiff| between them grows monotonically 5.8e-12 -> 6.8e-4 as the flow share E_flow/E_N collapses toward the far tail.',
      mathBucket: 'measurement',
      dataModule: 'src/data/imp-124815-pairratio-ladder-viz-data.js',
      paperSourcePath:
        'src/data/imp-124770-pair-ratio-identity-landmark-ladder.js (IMP124770_PAIR_RATIO_IDENTITY_LANDMARK_LADDER.ladder reused verbatim; imp-124815 viz-data leaf + page)',
      ticket: 'imp-124815',
      pedagogicalStep: 447,
      honestCeiling:
        'Presentation only: every ratio and reldiff value is reused verbatim from imp-124770 (a measurement, not a derivation); no new computation. The identity itself stays exact at every rung; the growing |reldiff| is a stencil/round-off artefact (imp-124769), not a deviation. Conditional-share diagnostic on the inherited imp-3220/imp-3406 extrapolation, not a rigorous asymptotic. Changes no bound; establishes no operator positivity; Platt-Trudgian Lambda <= 0.2 remains SOTA; RH open; NO QED.',
    }),
    Object.freeze({
      route: '/viz-imp97671-gap-law-decay-exponent',
      title: 'imp-97640: Gap-Law Residual Local Decay Exponent vs Fixed Powers q=2, q=3',
      oneLine:
        'Bar chart and table showing the imp-97640 consecutive-rung local decay exponent q of the imp-97619 MCM gap-law residual (6.839, 8.713, 7.495 across p=7919..1999993) against the fixed-power q=2 and q=3 reference lines, with the third rung flagged precision-limited (residual ratio 1.25, 7-sig-fig cancellation).',
      mathBucket: 'measurement',
      dataModule: 'src/data/imp-97671-gap-law-decay-exponent-viz-data.js',
      paperSourcePath:
        'src/data/imp-97640-route-m-gap-law-residual-decay-exponent.js (IMP97640_LOCAL_EXPONENTS reused verbatim; imp-97671 viz-data leaf + page)',
      ticket: 'imp-97671',
      pedagogicalStep: 433,
      honestCeiling:
        'Presentation only: every local exponent and residual ratio value is reused verbatim from imp-97640 (a measurement, not a derivation); no new computation. The precision-limited third rung is flagged, not resolved. Changes no bound; MCM stays refuted from omega=11; Platt-Trudgian Lambda <= 0.2 remains SOTA; RH open; NO QED.',
    }),
    Object.freeze({
      route: '/viz-imp97715-route-m-exponent-robustness',
      title: 'imp-97687: Route-M Average Exponent Robustness Bands vs Fixed Power q=3',
      oneLine:
        'Error-bar chart and tables showing the imp-97687 robustness bands for the imp-97659 ~10.18 Route-M average decay exponent -- a tight leave-one-out (jackknife) band [9.985,10.334] and a wider seeded-bootstrap 95% band [8.19,11.02] -- both clearing the fixed q=3 reference, plus the abscissa/model contrast (10.18 against log(log p) vs 0.62 against log p).',
      mathBucket: 'measurement',
      dataModule: 'src/data/imp-97715-route-m-exponent-robustness-viz-data.js',
      paperSourcePath:
        'src/data/imp-97687-route-m-avg-exponent-robustness.js (IMP97687_ROBUSTNESS reused verbatim; imp-97715 viz-data leaf + page)',
      ticket: 'imp-97715',
      pedagogicalStep: 437,
      honestCeiling:
        'Presentation only: every band and exponent value is reused verbatim from imp-97687 (a measurement, not a derivation); no new computation. Changes no bound; MCM stays refuted from omega=11; Platt-Trudgian Lambda <= 0.2 remains SOTA; RH open; NO QED.',
    }),
    Object.freeze({
      route: '/viz-imp97716-wrapper-elasticity-5point',
      title: 'imp-97686: Wrapper-Elasticity 5-Point Stencil Residuals, E_CKH vs E_GEXP',
      oneLine:
        'Grouped bar chart and table showing the imp-97686 3-point vs 5-point stencil residual precision for the two E_N wrapper elasticities: the sqrt wrapper E_CKH gains ~5 orders at every landmark (cured to ~1e-12..1e-13), while the exp wrapper E_GEXP gains precision only at the flow-heavy L2 (~4.3x) and falls inside the bisection-quantization noise floor at L3/L4.',
      mathBucket: 'measurement',
      dataModule: 'src/data/imp-97716-wrapper-elasticity-5point-viz-data.js',
      paperSourcePath:
        'src/data/imp-97686-wrapper-elasticity-5point-refine.js (IMP97686_WRAPPER_ELASTICITY_5POINT_REFINE.perLandmark reused verbatim; imp-97716 viz-data leaf + page)',
      ticket: 'imp-97716',
      pedagogicalStep: 438,
      honestCeiling:
        'Presentation only: every residual and improvement-factor value is reused verbatim from imp-97686 (a measurement, not a new computation). Conditional-share diagnostic on the inherited imp-3220/imp-3406 extrapolation, not a rigorous asymptotic. Changes no bound; Platt-Trudgian Lambda <= 0.2 remains SOTA; RH open; NO QED.',
    }),
    Object.freeze({
      route: '/viz-imp97745-fartail-diagnostic-asymptote',
      title: 'imp-97723: Far-Tail Diagnostic (1/2-p)*2 log T0 Asymptote-to-One',
      oneLine:
        'Line chart and table showing the imp-97723 far-tail diagnostic (1/2-p)*2 log T0 climbing monotonically from 0.9805 (1e24) to 0.9989 (1e300) against the exact RvM-slope overlay 1 - 1/log(T0/2pi), with the 0.99 and 0.995 crossing heights marked.',
      mathBucket: 'measurement',
      dataModule: 'src/data/imp-97745-fartail-diagnostic-asymptote-viz-data.js',
      paperSourcePath:
        'src/data/imp-97723-sigma-fartail-diagnostic-asymptote-one.js (diagLadder, crossings reused verbatim; imp-97745 viz-data leaf + page)',
      ticket: 'imp-97745',
      pedagogicalStep: 434,
      honestCeiling:
        'Presentation only: every diagnostic value, overlay value, and crossing height is reused verbatim from imp-97723 (a measurement/closed-form derivation, not a new computation). Conditional-share diagnostic, NOT an RH bound; Platt-Trudgian Lambda <= 0.2 remains SOTA; RH open; NO QED.',
    }),
    Object.freeze({
      route: '/viz-imp97765-fartail-crossing-heights',
      title: 'imp-97744: Far-Tail Diagnostic Crossing Heights, Pinned (0.99/0.995/0.999)',
      oneLine:
        'Bar chart and table showing the imp-97744 closed-form crossing heights where the far-tail diagnostic reaches 0.99 (N ~ 2.66124e45), 0.995 (N ~ 1.43797e89), and 0.999 (N ~ 1.96810e437), pinned by inverting L = 1/(1-t) and applying the Riemann-von Mangoldt relation N = (L-1) e^L.',
      mathBucket: 'measurement',
      dataModule: 'src/data/imp-97765-fartail-crossing-heights-viz-data.js',
      paperSourcePath:
        'src/data/imp-97744-fartail-diagnostic-crossing-heights.js (crossings reused verbatim; imp-97765 viz-data leaf + page)',
      ticket: 'imp-97765',
      pedagogicalStep: 444,
      honestCeiling:
        'Presentation only: every L, log10 T0, log10 N, and mantissa value is reused verbatim from imp-97744 (a closed-form measurement, not a new computation). Conditional-share diagnostic, NOT an RH bound; Platt-Trudgian Lambda <= 0.2 remains SOTA; RH open; NO QED.',
    }),
    Object.freeze({
      route: '/viz-imp97746-mcm-dps-cap-scaling',
      title: 'imp-97724: MCM Kernel Cap-Scaling Ladder d*(dps) vs 1/eps',
      oneLine:
        'Log-log chart and table showing the imp-97724 trustworthy exact-Rexact cap d*(dps) climbing from 1233 (dps=16) to 2847849 (dps=30), against the OLS-fitted eps^{-1/4} exponent line (slope 0.2401) and the theoretical 1/4 line, with the SNR=1 vs SNR>=10 threshold-robustness comparison.',
      mathBucket: 'measurement',
      dataModule: 'src/data/imp-97746-mcm-dps-cap-scaling-viz-data.js',
      paperSourcePath:
        'src/data/imp-97724-mcm-dps-cap-scaling-fit.js (capsSnr1, fittedExponentSnr1/10 reused verbatim; imp-97746 viz-data leaf + page)',
      ticket: 'imp-97746',
      pedagogicalStep: 435,
      honestCeiling:
        'Presentation only: every cap value and fitted slope is reused verbatim from imp-97724 (a measured multi-precision fit, not a new computation). The extended cap does not alter the omega=10 gap or the omega=11 MCM onset. Changes no bound; MCM stays refuted from omega=11; Platt-Trudgian Lambda <= 0.2 remains SOTA; RH open; NO QED.',
    }),
    Object.freeze({
      route: '/viz-imp97747-route-m-deep-ladder',
      title: 'imp-97722: Route M Deep-Ladder Gap-Law Residual Decay',
      oneLine:
        'Scatter chart and table showing the imp-97722 23-rung Route M gap-law residual ladder log|residual| vs log(log p) (p from 2e6 to ~4.93e8), with the 8 sign-change (RISE) rungs at indices 5,12,13,16,17,19,21,22 highlighted and the endpoint (~10.29), Theil-Sen (~10.62), and OLS (~10.56) slope estimates overlaid.',
      mathBucket: 'measurement',
      dataModule: 'src/data/imp-97747-route-m-deep-ladder-viz-data.js',
      paperSourcePath:
        'src/data/imp-97722-route-m-deep-ladder-independent-crosscheck.js (IMP97722_LADDER, rise indices, slope estimates reused verbatim; imp-97747 viz-data leaf + page)',
      ticket: 'imp-97747',
      pedagogicalStep: 436,
      honestCeiling:
        'Presentation only: every ladder value, rise index, and slope estimate is reused verbatim from imp-97722 (an independent, non-OLS cross-check, not a new computation). Changes no bound; MCM stays refuted from omega=11; Platt-Trudgian Lambda <= 0.2 remains SOTA; RH open; NO QED.',
    }),
    Object.freeze({
      route: '/viz-imp97806-full-sigma-diagnostic-curve',
      title: 'imp-97723: Full Sigma Diagnostic Curve -- Hump, Local Minimum, Rise-to-1',
      oneLine:
        'Symlog-scaled line chart of the full imp-97723 diagnostic (1/2-p)*2 log T0 across log10 N = 2..50, showing the small-N hump (diag ~14.9 at log10 N ~7.77), the local minimum (diag ~0.976 at log10 N ~18.77), and the slow rise toward exactly 1 (crossing 0.99 near log10 N ~45.4), with all three landmarks marked.',
      mathBucket: 'measurement',
      dataModule: 'src/data/imp-97806-full-sigma-diagnostic-curve-viz-data.js',
      paperSourcePath:
        'src/data/imp-97782-fartail-diagnostic-hump-peak-pin.js (hump peak), src/data/imp-97777-fartail-diagnostic-local-minimum-pin.js (local minimum), src/data/imp-97723-sigma-fartail-diagnostic-asymptote-one.js (rise-to-1 crossing) -- all three landmarks reused verbatim; imp-97806 viz-data leaf + page',
      ticket: 'imp-97806',
      pedagogicalStep: 439,
      honestCeiling:
        'Presentation only: the continuous curve is a fresh sampling of the byte-for-byte imp-97723/imp-97759 closed form; the three marked landmarks are reused verbatim from their pinning modules, not a new computation. Conditional-share diagnostic on the inherited imp-3220/imp-3406 extrapolation, not a rigorous asymptotic. Changes no bound; Platt-Trudgian Lambda <= 0.2 remains SOTA; RH open; NO QED.',
    }),
    Object.freeze({
      route: '/viz-imp97787-fartail-hump-min-crossover',
      title: 'imp-97759: Far-Tail Diagnostic -- Hump, Minimum, Floor-Sensitivity Crossover',
      oneLine:
        'Symlog-scaled line chart of the imp-97759 non-monotone far-tail diagnostic across log10 N = 2..50, reusing the imp-97806 curve and marking the small-N hump (diag ~14.9 at log10 N ~7.77), the local minimum (diag ~0.976 at log10 N ~18.77), and the imp-97759 >1% E_trunc-floor-sensitivity crossover (diag ~0.977 at log10 N ~20.7).',
      mathBucket: 'measurement',
      dataModule: 'src/data/imp-97787-fartail-diagnostic-hump-min-crossover-viz-data.js',
      paperSourcePath:
        'src/data/imp-97806-full-sigma-diagnostic-curve-viz-data.js (curve + hump/minimum, reused verbatim), src/data/imp-97759-fartail-crossing-etrunc-floor-sensitivity-crossover.js (crossover landmark, reused verbatim); imp-97787 viz-data leaf + page',
      ticket: 'imp-97787',
      pedagogicalStep: 445,
      honestCeiling:
        'Presentation only: the curve is reused byte-for-byte from imp-97806; all three marked landmarks are reused verbatim from their source pinning modules, not a new computation. Conditional-share diagnostic on the inherited imp-3220/imp-3406 extrapolation, not a rigorous asymptotic. Changes no bound; Platt-Trudgian Lambda <= 0.2 remains SOTA; RH open; NO QED.',
    }),
    Object.freeze({
      route: '/viz-imp97748-fold-amplitude-landmark-decomposition',
      title: 'imp-97725: Fold-Amplitude Numerator vs Denominator Across L1..L4',
      oneLine:
        'Log-scale grouped bar chart and table decomposing the imp-97725 fold amplitude K = sqrt(S/(2 phi_xx)) into its exact numerator S = sigma(1-sigma) and its curvature denominator phi_xx across the imp-97520 L1..L4 landmark ladder, showing S peak at the L3 halving landmark (algebraic max 0.25) against a monotonically falling phi_xx.',
      mathBucket: 'measurement',
      dataModule: 'src/data/imp-97748-fold-amplitude-landmark-decomposition.js',
      paperSourcePath:
        'src/data/imp-97725-fold-amplitude-analytic-pin.js (K = sqrt(S/(2 phi_xx)) pin, peak-local); src/data/imp-97520-sigma-conditional-share-landmark-ladder.js (L1..L4 landmark N values, reused verbatim); imp-97748 viz-data leaf + page',
      ticket: 'imp-97748',
      pedagogicalStep: 443,
      honestCeiling:
        'Presentation/decomposition only: K is the imp-97725 fold amplitude only at the peak (L1); the L2/L3/L4 entries evaluate the same closed-form numerator and smooth-model curvature off the peak as a diagnostic, not an extended fold law. Conditional-share diagnostic on the inherited imp-3220/imp-3406 extrapolation, not a rigorous asymptotic. Changes no bound; Platt-Trudgian Lambda <= 0.2 remains SOTA; RH open; NO QED.',
    }),
    Object.freeze({
      route: '/viz-imp97729-fartail-residual-twopiece-crossover',
      title: 'imp-97702: Far-Tail Residual Two-Piece Split & Crossover',
      oneLine:
        'Log-y line chart and table showing the imp-97702 residual split into the power-law piece (1/2)sigma (falling ~27x from 1e12 to 1e15) and the nearly-flat logarithmic piece a(1-sigma), crossing at N ~ 3.553e12 (log10 N ~ 12.551), plus the deep-tail diagnostic (1/2-p)*2 log T0 settling to ~0.981 by 1e24.',
      mathBucket: 'measurement',
      dataModule: 'src/data/imp-97729-fartail-residual-twopiece-crossover-viz-data.js',
      paperSourcePath:
        'src/data/imp-97702-sigma-fartail-exponent-residual-half-loglaw.js (ladder, crossover, logAsymptote.resid_times_2logT0 reused verbatim; imp-97729 viz-data leaf + page)',
      ticket: 'imp-97729',
      pedagogicalStep: 440,
      honestCeiling:
        'Presentation only: every piece value, crossover height, and asymptote reading is reused verbatim from imp-97702 (a measurement/decomposition, not a new computation). Conditional-share diagnostic on the inherited imp-3220/imp-3406 extrapolation, not a rigorous asymptotic. Changes no bound; Platt-Trudgian Lambda <= 0.2 remains SOTA; RH open; NO QED.',
    }),
    Object.freeze({
      route: '/viz-imp97730-diag3-stencil-refine',
      title: 'imp-97703: DIAG3 5-Point Stencil Refine -- 3-Point Truncation vs Machine-Zero Floor',
      oneLine:
        'Grouped log-y bar chart comparing |DIAG3| under the 3-point O(eps^2) vs 5-point O(eps^4) central-difference stencil at the L2/L3/L4 landmarks (cuts of ~6.2e4x/1.2e3x/48x), plus an eps-halving ladder at L2 showing the 3-point residual quartering each step, the textbook O(eps^2) truncation signature.',
      mathBucket: 'measurement',
      dataModule: 'src/data/imp-97730-diag3-5point-stencil-refine-viz-data.js',
      paperSourcePath:
        'src/data/imp-97703-diag3-5point-stencil-refine.js (perLandmark, step_probed.eps_ladder, diagnostics.L2_three_point_quartering_ratios reused verbatim; imp-97730 viz-data leaf + page)',
      ticket: 'imp-97730',
      pedagogicalStep: 441,
      honestCeiling:
        'Presentation only: every landmark value and eps-ladder reading is reused verbatim from imp-97703 (a finite-difference cross-check, not a new computation). Conditional-share diagnostic on the inherited imp-3220/imp-3406 extrapolation, not a rigorous asymptotic. Changes no bound; Platt-Trudgian Lambda <= 0.2 remains SOTA; RH open; NO QED.',
    }),
    Object.freeze({
      route: '/viz-imp124845-diag3-additivity-flowshare',
      title: 'imp-124812: DIAG3 Additivity -- Flow-Share Sweep, Linear vs c^2-Broken Numerator',
      oneLine:
        'Log-y line chart comparing the amplitude-partial sum |NUM| across the flow-share sweep {0.1,1,5,20}: machine-zero for the real linear-in-amplitude model (reused imp-124812 values) versus sigma(1-sigma) for the c^2-broken numerator diagnostic (B1 hinge), isolating that the additivity break tracks linearity, not flow share.',
      mathBucket: 'measurement',
      dataModule: 'src/data/imp-124845-diag3-additivity-flowshare-viz-data.js',
      paperSourcePath:
        'src/data/imp-124812-diag3-additivity-exact-identity-assessment.js (flowShareSweep reused verbatim; the c^2-break formula re-evaluated across the same sweep; imp-124845 viz-data leaf + page)',
      ticket: 'imp-124845',
      pedagogicalStep: 442,
      honestCeiling:
        'Presentation only: the linear-model row is reused verbatim from imp-124812; the c^2-break row re-evaluates the identical imp-124812 formula at each flow share (imp-124812 only evaluated it at cf=1.0). Conditional-share diagnostic on the inherited imp-3220/imp-3406 extrapolation, not a rigorous asymptotic. Changes no bound; Platt-Trudgian Lambda <= 0.2 remains SOTA; RH open; NO QED.',
    }),
    Object.freeze({
      route: '/viz-imp97732-wlin-residual-halfdependence',
      title: 'imp-97705: w_lin Residual Half-Dependence Drift vs Factorization-Independence',
      oneLine:
        'Line chart of the residual value w(x)-w_lin(x) at four x nodes across phase-window half=100/200/400, showing the monotonic window-averaging drift (x=0.25: -5.3256e-3 -> -5.2414e-3 -> -5.0952e-3), alongside a table of the factorization relative-span bands per half showing the large-magnitude nodes stay sub-1% -- the fixed point is the factorization-independence, not the residual value.',
      mathBucket: 'measurement',
      dataModule: 'src/data/imp-97732-wlin-residual-halfdependence-viz-data.js',
      paperSourcePath:
        'src/data/imp-97705-wlin-residual-halforder-refinement.js (IMP97705_RESID_BY_HALF, IMP97705_REL_SPAN_PCT reused verbatim; imp-97732 viz-data leaf + page)',
      ticket: 'imp-97732',
      pedagogicalStep: 442,
      honestCeiling:
        'Presentation only: every residual value and relative-span reading is reused verbatim from imp-97705 (a discretization-refinement cross-check, not a new computation). Conditional-share diagnostic on the inherited imp-3220/imp-3406 extrapolation, not a rigorous asymptotic. Changes no bound; Platt-Trudgian Lambda <= 0.2 remains SOTA; RH open; NO QED.',
    }),
    Object.freeze({
      route: '/viz-imp124840-fartail-per-nine-ladder',
      title: 'Far-Tail Per-Nine Spacing Ladder',
      oneLine:
        'Charts the imp-124793 pure per-nine far-tail ladder: log10 N climbing 5.30 -> 45.43 -> 437.29 -> 4346.94 at t = 0.9/0.99/0.999/0.9999, with the consecutive log10 N spacing ratio climbing 9.7655 -> 9.9769 toward the 10 limit.',
      mathBucket: 'measurement',
      dataModule: 'src/data/imp-124840-fartail-per-nine-ladder-viz-data.js',
      paperSourcePath:
        'src/data/imp-124793-fartail-diagnostic-per-nine-spacing-ladder.js (IMP124793_FARTAIL_DIAGNOSTIC_PER_NINE_SPACING_LADDER; imp-124840 viz page)',
      ticket: 'imp-124840',
      pedagogicalStep: 448,
      honestCeiling:
        'Presentation only: every log10 N / spacing / ratio value plotted here is copied verbatim from the imp-124793 closed-form RvM inversion (not a rigorous asymptotic). Conditional-share diagnostic; changes no bound, establishes no operator positivity, no RH claim; Platt-Trudgian Lambda <= 0.2 remains SOTA; RH open; NO QED.',
    }),
    Object.freeze({
      route: '/viz-imp124824-ecf-stencil-crossover',
      title: 'E_CF Stencil Noise-Floor Crossover',
      oneLine:
        'Charts the imp-124769 E_CF finite-difference error ladder L2..L6: a clean O(eps^2) truncation power law bottoming at the round-off floor R~4.5e-13 at L5, then turning back up at L6 past the pinned crossover |E_CF|_crit~1.4e-6.',
      mathBucket: 'measurement',
      dataModule: 'src/data/imp-124824-ecf-stencil-crossover-viz-data.js',
      paperSourcePath:
        'src/data/imp-124769-ecf-stencil-noise-floor-crossover.js (IMP124769_ECF_STENCIL_NOISE_FLOOR_CROSSOVER; imp-124824 viz-data leaf + imp-124937 page)',
      ticket: 'imp-124937',
      pedagogicalStep: 449,
      honestCeiling:
        'Presentation only: every ladder / crossover value plotted here is copied verbatim from the imp-124769 reconstruction (a measurement/cross-validation, not a rigorous asymptotic). Conditional-share diagnostic; changes no bound, establishes no operator positivity, no RH claim; Platt-Trudgian Lambda <= 0.2 remains SOTA; RH open; NO QED.',
    }),
    Object.freeze({
      route: '/viz-imp124841-knee-locator-comparison',
      title: 'Fresh vs Imported Knee-Locator Comparison',
      oneLine:
        'Bar-chart comparison of four independent sigma-ramp knee floor-elasticity readings -- fresh exponent-curvature (-2.1064), reused-sweep OLS (-2.106468), imported two-floor chord (-2.099), fresh ramp-inflection (-2.073) -- all clustered within 0.033 of each other and clear of the imp-33684 interior-peak contrast (-1.375).',
      mathBucket: 'measurement',
      dataModule: 'src/data/imp-124841-knee-locator-comparison-viz-data.js',
      paperSourcePath:
        'src/data/imp-124814-knee-floor-elasticity-fresh-locator-repro.js (IMP124814_KNEE_FLOOR_ELASTICITY_FRESH_LOCATOR_REPRO); src/data/imp-97822-sigma-knee-etrunc-floor-elasticity.js (IMP97822_SIGMA_KNEE_ETRUNC_FLOOR_ELASTICITY; imp-124841 viz-data leaf + page)',
      ticket: 'imp-124841',
      pedagogicalStep: 450,
      honestCeiling:
        'Presentation only: every p_knee value plotted here is copied verbatim from the imp-124814/imp-97822 exported comparison fields (measurement/cross-validation, not a rigorous asymptotic). Conditional-share diagnostic; changes no bound, establishes no operator positivity, no RH claim; Platt-Trudgian Lambda <= 0.2 remains SOTA; RH open; NO QED.',
    }),
    Object.freeze({
      route: '/viz-imp124842-roundoff-law',
      title: 'Pair-Ratio |reldiff|-vs-|E_CF| Round-Off Law',
      oneLine:
        'Log-log scatter of the imp-124811 pair-ratio cross-check |reldiff| against measured |E_CF| across landmarks L2..L7 (slope ~-1.085, within ~9% of the predicted inverse-|E_CF| round-off law), plus a bar chart of the flat invariant product P = |reldiff|*|E_CF| (geomean R~2.34e-12) showing no identity-drift signature.',
      mathBucket: 'measurement',
      dataModule: 'src/data/imp-124842-pairratio-reldiff-ecf-roundoff-law-viz-data.js',
      paperSourcePath:
        'src/data/imp-124811-pairratio-reldiff-ecf-roundoff-law.js (IMP124811_PAIRRATIO_RELDIFF_ECF_ROUNDOFF_LAW.ladder/fit reused verbatim; imp-124842 viz-data leaf + page)',
      ticket: 'imp-124842',
      pedagogicalStep: 451,
      honestCeiling:
        'Presentation only: every ladder row and fit statistic plotted here is copied verbatim from the imp-124811 reconstruction (a measurement/cross-validation, not a rigorous asymptotic). Conditional-share diagnostic; changes no bound, establishes no operator positivity, no RH claim; Platt-Trudgian Lambda <= 0.2 remains SOTA; RH open; NO QED.',
    }),
    Object.freeze({
      route: '/viz-imp124843-kernel-ratio-consumer',
      title: 'Kernel Decade-Ratio: Gap-Keyed vs Decade-Keyed',
      oneLine:
        'Side-by-side tables of the shared imp-97823 reconstruction-kernel per-decade growth ratio under the imp-124776 gap-keyed and imp-97843 decade-keyed framings, both upslope and downslope arms, across the wide and deep windows, bracketing sqrt(10) = 3.162278 from opposite sides.',
      mathBucket: 'measurement',
      dataModule: 'src/data/imp-124776-kernel-decade-ratio-vs-gap-viz-data.js',
      paperSourcePath:
        'src/data/imp-124776-kernel-decade-ratio-vs-gap-viz-data.js; src/data/imp-97843-kernel-decade-growth-viz-data.js (both reused verbatim from imp-97823-kernel-decade-growth-sqrt10.js; imp-124843 consumer page)',
      ticket: 'imp-124843',
      pedagogicalStep: 452,
      honestCeiling:
        'Presentation only: every ratio plotted here is copied verbatim from the two orphaned sibling viz-data leaves (themselves reused from imp-97823, a measurement, not a derivation). Conditional-share diagnostic; changes no bound, establishes no operator positivity, no RH claim; Platt-Trudgian Lambda <= 0.2 remains SOTA; RH open; NO QED.',
    }),
    Object.freeze({
      route: '/viz-imp124880-pairratio-drift-slope-scatter',
      title: 'imp-124850: Drift-Slope OLS Fit -- P = D*|E_CF| + R Scatter + 2-Sigma Envelope',
      oneLine:
        'Log-x scatter of the round-off invariant product P = |reldiff|*|E_CF| against |E_CF| over the L2..L7 landmark rungs, with the imp-124850 OLS fit line and a +/-2-sigma envelope band (slope and intercept each shifted by 2 standard errors) -- the six points sit well inside the band and the line is visually flat, matching the fitted t-statistic of -0.64 against zero slope.',
      mathBucket: 'measurement',
      dataModule: 'src/data/imp-124880-pairratio-drift-slope-scatter-viz-data.js',
      paperSourcePath:
        'src/data/imp-124850-pairratio-drift-slope-fit.js (ladder, fit slope/intercept + standard errors reused verbatim; imp-124880 viz-data leaf + page)',
      ticket: 'imp-124880',
      pedagogicalStep: 453,
      honestCeiling:
        'Presentation only: every scatter point and the fit slope/intercept/standard-errors are reused verbatim from imp-124850 (an OLS regression, not a new computation). Conditional-share diagnostic on the inherited imp-3220/imp-3406 extrapolation, not a rigorous asymptotic; changes no bound, establishes no operator positivity, no RH claim; Platt-Trudgian Lambda <= 0.2 remains SOTA; RH open; NO QED.',
    }),
    Object.freeze({
      route: '/viz-imp124881-floor-elasticity-sidebyside',
      title: 'Floor-Elasticity Side-by-Side: Interior Peak vs Far-Tail Knee',
      oneLine:
        'Overlays the imp-124848 interior-peak (slope ~ -1.412, R^2 ~ 0.99961) and imp-124772 far-tail knee (slope ~ -2.106, R^2 ~ 0.99999) full-ladder OLS fits of log10 N* vs log10 E_trunc on the same imp-33708 0.5x..5x floor ladder, showing the ~0.69 exponent gap and the ~5x larger interior-peak residual directly.',
      mathBucket: 'measurement',
      dataModule: 'src/data/imp-124881-floor-elasticity-sidebyside-viz-data.js',
      paperSourcePath:
        'src/data/imp-124772-knee-floor-elasticity-multifloor-fit.js; src/data/imp-124848-sigma-interior-peak-floor-elasticity-multifloor-fit.js (both fits reused verbatim; imp-124881 viz-data leaf + page)',
      ticket: 'imp-124881',
      pedagogicalStep: 454,
      honestCeiling:
        'Presentation only: every plotted point and fit slope/intercept are reused verbatim from imp-124772 and imp-124848 (two OLS regressions, not new computations). Conditional-share curvature diagnostic on the inherited imp-3220/imp-3406 extrapolation, not a rigorous asymptotic; changes no bound, establishes no operator positivity, no RH claim; Platt-Trudgian Lambda <= 0.2 remains SOTA; RH open; NO QED.',
    }),
  ]),
});

// ── Build-time tripwires (>= 5) ──────────────────────────────────────────
//
// Guard the structural invariants of VISUALIZATIONS_INDEX. The
// run-assertions.mjs harness invokes every .holds() and fails the build
// if any returns false.

const EXPECTED_ROUTES = Object.freeze([
  '/viz-log-phase-spiral',
  '/viz-twin-ladder-tomography',
  '/viz-euler-transport-flow',
  '/viz-prime-caustic',
  '/viz-hyperbolic-prime-spiral',
  '/viz-prime-phase-crystal',
  '/cayley-schur-trajectory',
  '/viz-volterra-kernel-heatmap',
  '/viz-volterra-norm-curve',
]);

const EXPECTED_TICKETS = Object.freeze([
  'imp-1222', 'imp-1223', 'imp-1224', 'imp-1225', 'imp-1226', 'imp-1227',
  'imp-1291', 'imp-1292', 'imp-1294',
]);

export const VISUALIZATIONS_INDEX_ASSERTIONS = [
  {
    id: 'imp1228-record-frozen-and-route-pinned',
    holds: () =>
      Object.isFrozen(VISUALIZATIONS_INDEX) &&
      Object.isFrozen(VISUALIZATIONS_INDEX.entries) &&
      Object.isFrozen(VISUALIZATIONS_INDEX.paperSource) &&
      VISUALIZATIONS_INDEX.ticketId === 'imp-1228' &&
      VISUALIZATIONS_INDEX.routePath === '/visualizations' &&
      typeof VISUALIZATIONS_INDEX.title === 'string' &&
      VISUALIZATIONS_INDEX.title === 'Visualizations' &&
      typeof VISUALIZATIONS_INDEX.intro === 'string' &&
      VISUALIZATIONS_INDEX.intro.length >= 100,
    why:
      'VISUALIZATIONS_INDEX must be a frozen record (and its entries / ' +
      'paperSource sub-records also frozen) with ticketId imp-1228, ' +
      'routePath /visualizations, title "Visualizations", and a non-trivial ' +
      'intro (>= 100 chars). Drift on any of these silently misroutes the ' +
      'nav-link wired into App.jsx.',
  },
  {
    id: 'imp1228-exactly-nine-entries-present',
    holds: () => {
      const e = VISUALIZATIONS_INDEX.entries;
      if (!Array.isArray(e) && !(e && typeof e.length === 'number')) return false;
      if (e.length !== 9) return false;
      for (const entry of e) {
        if (!entry || !Object.isFrozen(entry)) return false;
        if (typeof entry.route !== 'string' || !entry.route.startsWith('/viz-')) return false;
        if (typeof entry.title !== 'string' || entry.title.length < 5) return false;
        if (typeof entry.oneLine !== 'string' || entry.oneLine.length < 20 || entry.oneLine.length > 200) return false;
        if (typeof entry.mathBucket !== 'string') return false;
        if (typeof entry.dataModule !== 'string' || !entry.dataModule.startsWith('src/data/viz-')) return false;
        if (typeof entry.paperSourcePath !== 'string' || entry.paperSourcePath.length < 10) return false;
        if (typeof entry.ticket !== 'string' || !/^imp-\d+$/.test(entry.ticket)) return false;
        if (typeof entry.pedagogicalStep !== 'number') return false;
      }
      return true;
    },
    why:
      'entries must contain exactly 6 frozen records, each with route ' +
      'starting "/viz-", a non-trivial title, oneLine 20..200 chars, a ' +
      'string mathBucket, dataModule under src/data/viz-, paperSourcePath, ' +
      'an imp-NNNN ticket, and a numeric pedagogicalStep. Any miss breaks ' +
      'the card grid the index renders.',
  },
  {
    id: 'imp1228-nine-routes-unique-and-expected',
    holds: () => {
      const routes = VISUALIZATIONS_INDEX.entries.map((e) => e.route);
      const uniq = new Set(routes);
      if (uniq.size !== 9) return false;
      // All nine expected routes must be present.
      for (const r of EXPECTED_ROUTES) {
        if (!uniq.has(r)) return false;
      }
      // And no spurious extras.
      for (const r of routes) {
        if (!EXPECTED_ROUTES.includes(r)) return false;
      }
      return true;
    },
    why:
      'The 9 entry routes must be unique AND must equal the expected ' +
      'routes (WAVE 13 plus WAVE 18 operator visualizations). Any divergence ' +
      'would silently fork the master-index from the actual viz pages.',
  },
  {
    id: 'imp1228-pedagogical-step-is-1-through-9-in-order',
    holds: () => {
      const e = VISUALIZATIONS_INDEX.entries;
      // entries must be ordered by pedagogicalStep 1..9 monotonically.
      const expectedAtStep = [
        '/viz-log-phase-spiral',
        '/viz-twin-ladder-tomography',
        '/viz-euler-transport-flow',
        '/viz-prime-caustic',
        '/viz-hyperbolic-prime-spiral',
        '/viz-prime-phase-crystal',
        '/cayley-schur-trajectory',
        '/viz-volterra-kernel-heatmap',
        '/viz-volterra-norm-curve',
      ];
      for (let i = 0; i < 9; i++) {
        if (e[i].pedagogicalStep !== i + 1) return false;
        if (e[i].route !== expectedAtStep[i]) return false;
      }
      return true;
    },
    why:
      'pedagogicalStep must be 1..9 monotonically with the route at each ' +
      'step pinned to the spec. The sequence progresses from WAVE 13 ' +
      'geometric visualizations (steps 1-6) through operator-theoretic ' +
      'visualizations (steps 7-9): Schur functions, Volterra kernel ' +
      'structure, and norm bounds.',
  },
  {
    id: 'imp1228-math-bucket-is-from-closed-set',
    holds: () => {
      const buckets = new Set(VIZ_MATH_BUCKETS);
      if (buckets.size !== 9) return false;
      // Each entry's bucket must come from the closed VIZ_MATH_BUCKETS set.
      for (const e of VISUALIZATIONS_INDEX.entries) {
        if (!buckets.has(e.mathBucket)) return false;
      }
      // And the buckets must be pairwise distinct (one per viz).
      const used = new Set(VISUALIZATIONS_INDEX.entries.map((e) => e.mathBucket));
      if (used.size !== 9) return false;
      return Object.isFrozen(VIZ_MATH_BUCKETS);
    },
    why:
      'mathBucket on every entry must come from the closed VIZ_MATH_BUCKETS ' +
      'set (frozen, exactly 9 buckets) and each bucket must be used once. ' +
      'This is what the per-card badge color mapping keys off — an unknown ' +
      'bucket renders an uncolored badge and a duplicate bucket would tie ' +
      'two cards to the same color.',
  },
  {
    id: 'imp1228-every-ticket-present',
    holds: () => {
      const tickets = VISUALIZATIONS_INDEX.entries.map((e) => e.ticket);
      const uniq = new Set(tickets);
      if (uniq.size !== 9) return false;
      for (const t of EXPECTED_TICKETS) {
        if (!uniq.has(t)) return false;
      }
      return true;
    },
    why:
      'All visualization tickets (WAVE 13 imp-1222..1227 and WAVE 18 ' +
      'imp-1291..1292, imp-1294) must appear exactly once. A missing or ' +
      'duplicate ticket means the index lost provenance for one of the pages.',
  },
  {
    id: 'imp1228-data-modules-pin-to-viz-files',
    holds: () => {
      const expected = new Set([
        'src/data/viz-log-phase-spiral.js',
        'src/data/viz-twin-ladder-tomography.js',
        'src/data/viz-euler-transport-flow.js',
        'src/data/viz-prime-caustic.js',
        'src/data/viz-hyperbolic-prime-spiral.js',
        'src/data/viz-prime-phase-crystal.js',
      ]);
      const seen = new Set();
      for (const e of VISUALIZATIONS_INDEX.entries) {
        // Entries may have null dataModule (computed visualizations).
        if (e.dataModule !== null && !expected.has(e.dataModule)) return false;
        if (e.dataModule !== null) {
          if (seen.has(e.dataModule)) return false;
          seen.add(e.dataModule);
        }
      }
      return seen.size === 6;
    },
    why:
      'WAVE 13 entries (steps 1-6) must have dataModule pinned to one of six ' +
      'known data files (pairwise distinct). WAVE 18 entries (steps 7-9) may ' +
      'have null dataModule (computed dynamically). A wrong dataModule would ' +
      'point a card at a non-existent file.',
  },
  {
    id: 'imp1228-paper-source-and-intro-pin-v52',
    holds: () => {
      const p = VISUALIZATIONS_INDEX.paperSource;
      if (!p || typeof p.path !== 'string' || typeof p.note !== 'string') return false;
      if (!p.path.includes('twin_ladder_consolidated_v52.pdf')) return false;
      if (p.note.length < 40) return false;
      // Every entry should also pin a paperSourcePath that references the
      // v52 PDF (the canonical source for the WAVE 13 suite).
      for (const e of VISUALIZATIONS_INDEX.entries) {
        if (!e.paperSourcePath.includes('twin_ladder_consolidated_v52.pdf')) return false;
      }
      return true;
    },
    why:
      'paperSource must point at research-inputs/twin_ladder_consolidated_v52.pdf ' +
      'with a substantive note, and every entry.paperSourcePath must ' +
      'reference that same PDF (with section). This pins provenance back ' +
      'to the canonical v52 paper.',
  },
  {
    id: 'imp2728-every-entry-has-honest-ceiling',
    holds: () => {
      for (const e of VISUALIZATIONS_INDEX.entries) {
        if (typeof e.honestCeiling !== 'string') return false;
        if (e.honestCeiling.length < 20) return false;
      }
      return true;
    },
    why:
      'imp-2728: every index entry must carry an honestCeiling string ' +
      '(>= 20 chars) naming the honest mathematical ceiling of that panel ' +
      '(descriptive map / re-derives sign only / conjecture-illustration). ' +
      'This is rendered as a muted footer on each card so a reader cannot ' +
      'infer an unearned Lambda or RH claim from any single visualization.',
  },
  {
    id: 'imp2992-every-ceiling-has-denial-marker',
    holds: () => {
      const DENIAL_PHRASES = [
        'no lambda',
        'no rh claim',
        'not proven',
        'does not',
        'no operator',
        'no upper',
      ];
      for (const e of VISUALIZATIONS_INDEX.entries) {
        const lower = (e.honestCeiling || '').toLowerCase();
        const hasDenial = DENIAL_PHRASES.some((p) => lower.includes(p));
        if (!hasDenial) return false;
      }
      return true;
    },
    why:
      'imp-2992: every honestCeiling must contain at least one denial marker ' +
      '("no lambda", "no rh claim", "not proven", "does not", "no operator", ' +
      '"no upper") so no future visualization can silently overclaim a Lambda ' +
      'bound or RH result. This tripwire fires if a new entry is added with a ' +
      'ceiling that describes only positive results without an explicit denial.',
  },
];
