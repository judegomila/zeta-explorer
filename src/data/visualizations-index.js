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
];
