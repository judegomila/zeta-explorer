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
    'Six geometric perspectives on the Riemann zeta-function and its ' +
    'prime structure. The sequence walks from a single-curve log-phase ' +
    'spiral through 2D interferometric (twin-ladder), flow-field, and ' +
    'caustic representations, ending with two discrete-prime pictures ' +
    '(hyperbolic spiral and Bragg-style crystal). Together they ' +
    'visualize the twin-ladder framing of the twin_ladder_consolidated ' +
    'v52 paper from six complementary angles.',

  paperSource: Object.freeze({
    path: 'research-inputs/twin_ladder_consolidated_v52.pdf',
    note:
      'Twin-Ladder Consolidated v52 — the canonical paper source. The ' +
      'six visualizations together cover the geometric content of ' +
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
