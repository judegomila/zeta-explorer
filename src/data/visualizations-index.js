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
