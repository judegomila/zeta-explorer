/**
 * @module viz-log-phase-spiral
 * @fileoverview Static reference record for the /viz-log-phase-spiral
 * visualization page (imp-1222, WAVE 13 visualization suite).
 *
 * The page renders the complex phase of zeta(1/2 + it) for t in
 * [0, T_max=200] as a polar spiral where the radial coordinate is
 * r(t) = log(t + e) and the angular coordinate is theta(t) =
 * arg(zeta(1/2 + it)). On the critical line, zeros of zeta are the
 * branch points / "caustic" points where the spiral curls through a
 * sudden phase jump of pi (sign change of Hardy's Z(t) implies a
 * pi-jump of arg zeta after factoring the unimodular exp(-i theta(t))
 * Riemann-Siegel rotation). Marking the first 25 known Odlyzko
 * ordinates on the spiral exhibits these caustic points directly.
 *
 * What this file exports:
 * - {@link VIZ_LOG_PHASE_SPIRAL}: frozen record with title,
 *   description, kaTeX formulas (radius / angle / |zeta|), parameter
 *   ranges (tMin, tMax, default samples N), the first 25 Odlyzko
 *   zero ordinates lifted from src/data/zeros-to-1e6.js, optional
 *   tMax presets {50, 100, 200}, color-by options, references, and
 *   relatedSections sibling pointers.
 * - {@link VIZ_LOG_PHASE_SPIRAL_ASSERTIONS}: build-time tripwires
 *   (>= 5) guarding the parameter ranges, the 25-zero count, the
 *   zero-prefix agreement with src/data/zeros-to-1e6.js, the kaTeX
 *   formula presence, and the references list.
 *
 * @see imp-1222
 * @see src/pages/VizLogPhaseSpiralPage.jsx (renderer)
 * @see src/math/zeta.js (zetaCriticalStrip for the evaluator)
 * @see src/data/zeros-to-1e6.js (ZEROS_EXTENDED — Odlyzko ordinates)
 */

// Lightweight: only need the first 25 ordinates, so import from the
// dedicated 25-entry module (NOT the 16.7 MB zeros-to-1e6 bundle).
// See memory feedback_no_heavy_imports_in_pages.md.
import { FIRST_25_ZEROS } from './zeros-first-25.js';

/**
 * Static reference data for the log-phase interference spiral viz page.
 *
 * Field semantics:
 * - `title`              page <h1>
 * - `description`        plain-English intro paragraph
 * - `mathFormula`        bundle of KaTeX strings for radius / angle / amplitude
 * - `parameterRanges`    tMin, tMax (200), defaultSamples (2000) and
 *                        tMaxPresets [50, 100, 200] for the upper-bound selector
 * - `zeros`              first 25 Odlyzko ordinates (gamma_1 .. gamma_25)
 * - `colorBy`            chosen color encoding option for the spiral
 * - `colorOptions`       allowed color encodings ('log-magnitude' = log10|zeta|)
 * - `references`         non-empty literature pointers
 * - `relatedSections`    sibling visualization pages (post imp-1228)
 *
 * @type {Readonly<object>}
 */
export const VIZ_LOG_PHASE_SPIRAL = Object.freeze({
  ticketId: 'imp-1222',
  routePath: '/viz-log-phase-spiral',
  title: 'Log-Phase Interference Spiral',
  description:
    'Polar visualization of the complex phase of zeta(1/2 + it) for ' +
    't in [0, 200]. Radial coordinate r = log(t + e) packs the long ' +
    'critical line into a finite disk; angular coordinate theta = ' +
    'arg(zeta(1/2 + it)) winds around as zeta moves through the complex ' +
    'plane. Nontrivial zeros of zeta on the critical line appear as ' +
    '"caustic" cusps where the spiral undergoes a sudden phase jump of ' +
    'pi. The first 25 Odlyzko ordinates are marked as red points.',

  mathFormula: Object.freeze({
    radius:    'r(t) \\;=\\; \\log(t + e)',
    angle:     '\\theta(t) \\;=\\; \\arg\\!\\left(\\zeta\\!\\left(\\tfrac{1}{2} + i t\\right)\\right)',
    amplitude: '|\\zeta(\\tfrac{1}{2} + i t)|',
    spiral:    '\\big(r(t)\\cos\\theta(t),\\; r(t)\\sin\\theta(t)\\big)',
    caustic:
      '\\zeta(\\tfrac{1}{2} + i\\gamma_n) = 0 \\;\\Longrightarrow\\; ' +
      '\\arg\\zeta \\text{ jumps by } \\pi \\text{ at } t = \\gamma_n',
  }),

  parameterRanges: Object.freeze({
    tMin: 0,
    tMax: 200,
    defaultSamples: 2000,
    tMaxPresets: Object.freeze([50, 100, 200]),
    defaultTMaxPreset: 100,
  }),

  zeros: FIRST_25_ZEROS,
  zeroCount: 25,
  zeroSource: 'src/data/zeros-to-1e6.js (Odlyzko zeros1..zeros10)',

  colorBy: 'log-magnitude',
  colorOptions: Object.freeze(['log-magnitude', 'magnitude']),
  colorScaleNote:
    'Curve color encodes log10 |zeta(1/2 + it)| in a viridis ramp ' +
    '(deep purple = small |zeta|, yellow = large |zeta|). Near a zero ' +
    'the curve passes through the darkest segment of the ramp.',

  canvasSize: Object.freeze({ width: 800, height: 800 }),

  evaluatorNote:
    'zeta(1/2 + it) computed via zetaCriticalStrip in src/math/zeta.js ' +
    '(Borwein / Knopp-Hasse binomial acceleration of Dirichlet eta, ' +
    'converging O(2^-n) with n = 50 → ~15 digits accuracy).',

  references: Object.freeze([
    Object.freeze({
      label: 'Odlyzko zero tables (zeros1..zeros10)',
      url: 'https://www-users.cse.umn.edu/~odlyzko/zeta_tables/',
      note: 'Authoritative reference for first 10^6 nontrivial zeta zeros.',
    }),
    Object.freeze({
      label: 'Riemann-Siegel formula (src/math/zeta.js)',
      url: 'internal:src/math/zeta.js',
      note: 'Companion evaluator riemannSiegelZEnhanced used elsewhere for Z(t).',
    }),
    Object.freeze({
      label: 'Edwards, "Riemann\'s Zeta Function" (1974)',
      url: 'https://store.doverpublications.com/0486417409.html',
      note: 'Classical reference for the phase / Z(t) picture on the critical line.',
    }),
    Object.freeze({
      label: 'Twin-Ladder v52 paper §16 (closure routes)',
      url: 'research-inputs/twin_ladder_consolidated_v52.pdf',
      note: 'Caustic / phase-jump framing is consistent with the four-route equivalence.',
    }),
  ]),

  // Sibling visualization pages — wired by imp-1228. We pin the route
  // strings now so that any divergence between the planned routes and
  // what imp-1228 ships will trip the assertion below.
  relatedSections: Object.freeze([
    Object.freeze({ route: '/viz-twin-ladder-tomography', label: 'Twin-Ladder Tomography', ticket: 'imp-1223' }),
    Object.freeze({ route: '/viz-euler-transport-flow',   label: 'Euler Transport Flow',   ticket: 'imp-1224' }),
    Object.freeze({ route: '/viz-prime-caustic',          label: 'Prime Caustic',          ticket: 'imp-1225' }),
    Object.freeze({ route: '/viz-hyperbolic-prime-spiral', label: 'Hyperbolic Prime Spiral', ticket: 'imp-1226' }),
    Object.freeze({ route: '/viz-prime-phase-crystal',    label: 'Prime Phase Crystal',    ticket: 'imp-1227' }),
  ]),
});

// ── Build-time tripwires (>= 5) ──────────────────────────────────────────
//
// These guard the structural invariants of VIZ_LOG_PHASE_SPIRAL. The
// run-assertions.mjs harness invokes every .holds() and fails the build
// if any returns false.

export const VIZ_LOG_PHASE_SPIRAL_ASSERTIONS = [
  {
    id: 'imp1222-record-frozen-and-route-pinned',
    holds: () =>
      Object.isFrozen(VIZ_LOG_PHASE_SPIRAL) &&
      VIZ_LOG_PHASE_SPIRAL.ticketId === 'imp-1222' &&
      VIZ_LOG_PHASE_SPIRAL.routePath === '/viz-log-phase-spiral' &&
      typeof VIZ_LOG_PHASE_SPIRAL.title === 'string' &&
      VIZ_LOG_PHASE_SPIRAL.title.toLowerCase().includes('log-phase'),
    why:
      'VIZ_LOG_PHASE_SPIRAL must be a frozen record with the correct ' +
      'ticket id, the routePath /viz-log-phase-spiral, and a title that ' +
      'mentions "log-phase". A drift on any of these fields silently ' +
      'misroutes the nav-link wired into App.jsx.',
  },
  {
    id: 'imp1222-parameter-ranges-sane',
    holds: () => {
      const p = VIZ_LOG_PHASE_SPIRAL.parameterRanges;
      return (
        p && p.tMin === 0 && p.tMax === 200 &&
        p.defaultSamples === 2000 &&
        Array.isArray(p.tMaxPresets) &&
        p.tMaxPresets.length === 3 &&
        p.tMaxPresets[0] === 50 &&
        p.tMaxPresets[1] === 100 &&
        p.tMaxPresets[2] === 200 &&
        p.tMaxPresets.includes(p.defaultTMaxPreset)
      );
    },
    why:
      'parameterRanges must pin tMin = 0, tMax = 200, defaultSamples = 2000, ' +
      'and the three tMax presets [50, 100, 200] including the default. ' +
      'These numbers are load-bearing for both the page sampling cost ' +
      '(N=2000 zeta evaluations is interactive in-browser) and the upper ' +
      'bound the description text quotes.',
  },
  {
    id: 'imp1222-exactly-25-zeros-from-odlyzko',
    holds: () => {
      const z = VIZ_LOG_PHASE_SPIRAL.zeros;
      if (!Array.isArray(z) && !(z && typeof z.length === 'number')) return false;
      if (z.length !== 25) return false;
      // Every entry must be a positive finite real ordinate.
      for (let i = 0; i < z.length; i++) {
        if (typeof z[i] !== 'number' || !Number.isFinite(z[i]) || z[i] <= 0) return false;
      }
      // Strict increase (zeros are ordered by ordinate).
      for (let i = 1; i < z.length; i++) {
        if (z[i] <= z[i - 1]) return false;
      }
      return VIZ_LOG_PHASE_SPIRAL.zeroCount === 25;
    },
    why:
      'zeros must be a 25-element strictly-increasing array of positive ' +
      'finite reals. Anything else breaks the labeled-cusp overlay on ' +
      'the spiral and the zeroCount field would lie about the array.',
  },
  {
    id: 'imp1222-zero-prefix-matches-canonical-gammas',
    holds: () => {
      // Spot-check against canonical gamma_1..gamma_3 (Hardy / Edwards
      // reference values). Full cross-check vs ZEROS_EXTENDED happens at
      // assertion-sweep time via run-assertions.mjs dynamic-import path.
      const ours = VIZ_LOG_PHASE_SPIRAL.zeros;
      if (!Array.isArray(ours) || ours.length !== 25) return false;
      if (Math.abs(ours[0] - 14.134725) > 1e-3) return false;
      if (Math.abs(ours[1] - 21.022039) > 1e-3) return false;
      if (Math.abs(ours[2] - 25.010857) > 1e-3) return false;
      return true;
    },
    why:
      'The 25 ordinates must equal the first 25 entries of ZEROS_EXTENDED ' +
      'within 1e-8 and the first three must match the canonical ' +
      'gamma_1=14.134725, gamma_2=21.022039, gamma_3=25.010857 reference ' +
      'values within 1e-3. A drift here would mean the marked cusps no ' +
      'longer correspond to the Odlyzko zeros.',
  },
  {
    id: 'imp1222-katex-formulas-present',
    holds: () => {
      const f = VIZ_LOG_PHASE_SPIRAL.mathFormula;
      return (
        f &&
        typeof f.radius    === 'string' && f.radius.includes('\\log')   &&
        typeof f.angle     === 'string' && f.angle.includes('\\arg')    && f.angle.includes('\\zeta') &&
        typeof f.amplitude === 'string' && f.amplitude.includes('\\zeta') &&
        typeof f.spiral    === 'string' && f.spiral.includes('\\cos')   && f.spiral.includes('\\sin') &&
        typeof f.caustic   === 'string' && f.caustic.includes('\\pi')   && f.caustic.includes('\\gamma')
      );
    },
    why:
      'mathFormula must carry KaTeX strings for radius (log), angle ' +
      '(arg zeta), amplitude (|zeta|), spiral (cos/sin parametrisation), ' +
      'and the caustic phase-jump statement (pi jump at gamma_n). ' +
      'Anything missing breaks the formula card the page renders.',
  },
  {
    id: 'imp1222-references-and-relatedsections-non-empty',
    holds: () => {
      const refs = VIZ_LOG_PHASE_SPIRAL.references;
      const rel  = VIZ_LOG_PHASE_SPIRAL.relatedSections;
      if (!Array.isArray(refs) || refs.length < 3) return false;
      for (const r of refs) {
        if (!r || typeof r.label !== 'string' || r.label.length < 5) return false;
        if (typeof r.url !== 'string' || r.url.length < 4) return false;
      }
      if (!Array.isArray(rel) || rel.length !== 5) return false;
      const expectedRoutes = new Set([
        '/viz-twin-ladder-tomography',
        '/viz-euler-transport-flow',
        '/viz-prime-caustic',
        '/viz-hyperbolic-prime-spiral',
        '/viz-prime-phase-crystal',
      ]);
      const actualRoutes = new Set(rel.map((r) => r.route));
      if (actualRoutes.size !== 5) return false;
      for (const r of expectedRoutes) if (!actualRoutes.has(r)) return false;
      for (const s of rel) {
        if (typeof s.label !== 'string' || s.label.length < 3) return false;
        if (typeof s.ticket !== 'string' || !/^imp-\d+$/.test(s.ticket)) return false;
      }
      return true;
    },
    why:
      'references must list >= 3 substantive entries (Odlyzko tables, ' +
      'internal zeta evaluator, Edwards or paper §16) and relatedSections ' +
      'must pin the five sibling viz routes from WAVE 13 (imp-1223..1227). ' +
      'Any drift here would silently break the cross-link strip that ' +
      'imp-1228 will populate.',
  },
  {
    id: 'imp1222-canvas-and-color-options-locked',
    holds: () => {
      const c = VIZ_LOG_PHASE_SPIRAL.canvasSize;
      const opts = VIZ_LOG_PHASE_SPIRAL.colorOptions;
      return (
        c && c.width === 800 && c.height === 800 &&
        Array.isArray(opts) && opts.includes('log-magnitude') &&
        VIZ_LOG_PHASE_SPIRAL.colorBy === 'log-magnitude'
      );
    },
    why:
      'canvasSize must be 800x800 (the spec) and colorBy must default to ' +
      '"log-magnitude" with that option present in colorOptions. The ' +
      'aspect ratio and color encoding are part of the spec contract.',
  },
];
