/**
 * @module imp-36237-layer-ii-rigidity-scale-across-window
 * @fileoverview imp-36237 -- read-only NUMERICAL measurement of the microscopic
 *   RIGIDITY SCALE (imp-36180 LAYER II) resolved to the ACTUAL RUNGS the imp-3725
 *   true-flow enclosure certifies, ACROSS the finite window [1e4, 1e6].
 *
 *   RELATION TO THE SIBLING imp-36221
 *   ---------------------------------
 *   imp-36221 tabulated the same layer-II ratio r(T) over a COARSE GLOBAL ladder
 *   that steps OUT of the certified window (1e4 -> 1e5 -> 1e6 -> 3e12 -> 1e18 ->
 *   1e30) to expose the conditionality / certification-range gap. This module
 *   does the complementary thing: it stays INSIDE the window and measures r at
 *   each of the ten imp-3725 H_raw-plateau rungs -- the exact heights where the
 *   true-flow two-sided enclosure actually certifies a bound (KpaperBound) -- so
 *   the layer-II rigidity scale is paired, rung by rung, with the enclosure
 *   number that supports it. Where imp-36221 answered "how does the scale behave
 *   past the window", this answers "what scale does the window-local enclosure
 *   certify, and how flat is it across the window it covers".
 *
 *   WHAT IS MEASURED (the quantity the C_mb coupling consumes)
 *   ---------------------------------------------------------
 *   The dimensionless rigidity scale is, as in imp-36221,
 *        r(T) = (typical |gamma_k - classical location|) / (mean spacing at T)
 *             = sqrt( (1/(2 pi^2)) log log T ),
 *   from Var(S(T)) ~ (1/(2 pi^2)) log log T and displacement = counting
 *   fluctuation / local density. Here T is the ACTUAL Odlyzko record-pair ordinate
 *   gammaLeft at the start of each imp-3725 plateau (imported verbatim), so the
 *   height axis is the real arithmetic seed, not a modeled round number.
 *
 *   THE FINDING
 *   -----------
 *   Across the entire certified window the rigidity scale the coupling consumes is
 *   FLAT and order-unity: r rises only from ~0.3324 at the bottom plateau
 *   (T ~ 7.0e3) to ~0.3578 at the top plateau (T ~ 2.7e5) -- a 7.6% drift over the
 *   whole window, exactly the slow sqrt(log log T) growth, no blow-up. At every
 *   one of these rungs the imp-3725 true-flow enclosure certifies KpaperBound <=
 *   2.4238e-6 with zero GUE input. So the window-local enclosure supplies the
 *   layer-II microscopic-rigidity input at a flat order-unity scale across all
 *   ~1.7e6 zeros it covers. This does NOT establish rigidity: the scale is
 *   window-LOCAL (ceiling = bounded O(N^2) compute, never a limit) and the
 *   N-uniform statement stays OPEN; C_mb stays irreducible and GUE-conditional
 *   (imp-486).
 *
 *   NUMERICAL MEASUREMENT ONLY. Establishes no local law, discharges no
 *   conditional, claims NO N-uniform input is available, changes no bound,
 *   respects the imp-2519 no-overclaim guard, NO QED. No refereed bound is changed.
 *
 *   @see src/data/imp-36221-layer-ii-rigidity-scale-tabulation.js (cross-window ladder sibling)
 *   @see src/data/imp-36180-esy-cmb-local-law-input-scope.js (parent: the three ESY input layers; LAYER II imported verbatim below)
 *   @see src/data/imp-3725-fmb-plateau-domination-lemma.js (the window-local true-flow enclosure; plateau rows imported verbatim below)
 *
 *   Ticket: imp-36237 (numerical, medium). Measurement only; imports the parent
 *   layer and the enclosure rows verbatim; discharges no conditional; changes no
 *   bound; imp-2519 preserved; NO QED; no refereed bound is changed.
 */

import { IMP36180_ESY_CMB_LOCAL_LAW_INPUT_SCOPE } from './imp-36180-esy-cmb-local-law-input-scope.js';
import { IMP_3725_FMB_PLATEAU_DOMINATION } from './imp-3725-fmb-plateau-domination-lemma.js';

const TWO_PI = 2 * Math.PI;

// Verbatim import of the parent LAYER II entry this module measures.
const LAYER_II = IMP36180_ESY_CMB_LOCAL_LAW_INPUT_SCOPE.esyInputLayers.find(
  (l) => l.key === 'esy-input-rigidity-scale',
);

// Verbatim import of the imp-3725 window-local true-flow enclosure plateau rows.
const PLATEAU_ROWS = IMP_3725_FMB_PLATEAU_DOMINATION.rows;

// The imp-3725 true-flow enclosure certifies the window [1e4, 1e6] only.
const WINDOW_LO = 1e4;
const WINDOW_HI = 1e6;

// Standard laws for the surrogate multiset near height T (unfolded units).
//   meanSpacing = 2pi / log(T/2pi)                      (spacing near height T)
//   r(T)        = sqrt( (1/(2 pi^2)) log log T )         (fluctuation / spacing)
const meanSpacing = (T) => TWO_PI / Math.log(T / TWO_PI);
const rigidityRatio = (T) => Math.sqrt((1 / (2 * Math.PI * Math.PI)) * Math.log(Math.log(T)));

// Per-plateau tabulation: the layer-II rigidity scale at every rung the imp-3725
// enclosure actually certifies, using the ACTUAL Odlyzko ordinate gammaLeft as the
// height axis (imported verbatim from the enclosure rows).
const RIGIDITY_ACROSS_WINDOW = Object.freeze(
  PLATEAU_ROWS.map((p) =>
    Object.freeze({
      plateauIndex: p.plateauIndex,
      startN: p.startN,
      endN: p.endN,
      // Actual record-pair ordinate at the start of the plateau (the real height).
      heightT: p.gammaLeft,
      // Mean spacing near this height (absolute units).
      meanSpacing: meanSpacing(p.gammaLeft),
      // Ratio the C_mb coupling consumes: typical location fluctuation / mean spacing.
      rigidityRatioConsumed: rigidityRatio(p.gammaLeft),
      // The true-flow enclosure number certified at this rung (imported verbatim).
      enclosureKpaperBound: p.KpaperBound,
      // Every plateau rung lies inside [1e4, 1e6] by construction of the enclosure.
      surrogateCertified: p.startN >= WINDOW_LO && p.endN <= WINDOW_HI,
    }),
  ),
);

// Scalar summary of the flatness across the certified window.
const R_AT_WINDOW_BOTTOM = RIGIDITY_ACROSS_WINDOW[0].rigidityRatioConsumed;
const R_AT_WINDOW_TOP = RIGIDITY_ACROSS_WINDOW[RIGIDITY_ACROSS_WINDOW.length - 1].rigidityRatioConsumed;
const R_DRIFT_FRACTION = (R_AT_WINDOW_TOP - R_AT_WINDOW_BOTTOM) / R_AT_WINDOW_BOTTOM;
const K_PAPER_MAX_ACROSS_WINDOW = Math.max(...RIGIDITY_ACROSS_WINDOW.map((r) => r.enclosureKpaperBound));

const VERDICT =
  'layer-ii-rigidity-scale-flat-order-unity-across-the-imp3725-certified-window-r-drifts-0.3324-to-0.3578-enclosure-Kpaper-le-2.4238e-6-at-every-rung-but-window-local-only-N-uniform-stays-open';

export const IMP36237_LAYER_II_RIGIDITY_SCALE_ACROSS_WINDOW = Object.freeze({
  id: 'imp-36237',
  ticket: 'imp-36237',
  measures: 'imp-36180', // the parent LAYER II this module tabulates.
  enclosure: 'imp-3725', // the window-local true-flow enclosure whose rungs are used.
  scopes: 'imp-486', // the exhaustive search that graded C_mb irreducible.
  axis:
    'microscopic rigidity SCALE (location fluctuation / mean spacing) the C_mb ' +
    'coupling would consume, resolved to the actual imp-3725 plateau rungs across ' +
    'the certified window [1e4, 1e6] and paired rung-by-rung with the true-flow ' +
    'enclosure bound',
  question:
    'imp-36180 layer II names a microscopic rigidity scale the local law must ' +
    'reach. At the actual heights the imp-3725 true-flow enclosure certifies ' +
    'across the window [1e4, 1e6], what rigidity scale does the C_mb coupling ' +
    'consume, and how flat is it across the window the enclosure covers?',

  // Verbatim anchor of the parent LAYER II entry.
  sourceLayer: Object.freeze({
    key: LAYER_II.key,
    layer: LAYER_II.layer,
    label: LAYER_II.label,
    esySupplies: LAYER_II.esySupplies,
    openRemains: LAYER_II.openRemains,
  }),

  ratioDefinition:
    'r(T) = (typical |gamma_k - classical location|) / (mean spacing at height T) ' +
    '= sqrt( (1/(2 pi^2)) log log T ), evaluated at the ACTUAL Odlyzko record-pair ' +
    'ordinate gammaLeft of each imp-3725 plateau.',

  rigidityAcrossWindow: RIGIDITY_ACROSS_WINDOW,

  windowSummary: Object.freeze({
    certifiedWindow: Object.freeze({ Tlo: WINDOW_LO, Thi: WINDOW_HI }),
    plateauRungs: RIGIDITY_ACROSS_WINDOW.length,
    rAtWindowBottom: R_AT_WINDOW_BOTTOM,
    rAtWindowTop: R_AT_WINDOW_TOP,
    rDriftFraction: R_DRIFT_FRACTION,
    enclosureKpaperMaxAcrossWindow: K_PAPER_MAX_ACROSS_WINDOW,
    finding:
      'Across the ten imp-3725 plateau rungs that tile the certified window the ' +
      'rigidity scale the coupling consumes is FLAT and order-unity: r rises only ' +
      'from ~0.3324 (T ~ 7.0e3) to ~0.3578 (T ~ 2.7e5), a ~7.6% drift over the ' +
      'whole window -- the slow sqrt(log log T) growth, no blow-up. At every one ' +
      'of these rungs the imp-3725 true-flow enclosure certifies KpaperBound <= ' +
      '2.4238e-6 with zero GUE input. The window-local enclosure thus supplies the ' +
      'layer-II microscopic-rigidity input at a flat order-unity scale across all ' +
      '~1.7e6 zeros it covers -- but window-LOCALLY only: the ceiling is bounded ' +
      'O(N^2) compute, never a limit, so the N-uniform rigidity statement stays ' +
      'OPEN and C_mb stays irreducible and GUE-conditional (imp-486).',
  }),

  verdict: VERDICT,
  rigidityEstablished: false,

  honestCaveat: Object.freeze({
    isProof: false,
    closesAnyGap: false,
    dischargesCmbConditional: false,
    establishesRigidity: false,
    claimsRigidityEstablished: false,
    establishesNUniformScale: false,
    establishesOperatorPositivity: false,
    derivesAnythingNew: false,
    isReductionBelowRH: false,
    carriesRHVerdict: false,
    scope:
      'Read-only NUMERICAL measurement pairing, at every imp-3725 plateau rung ' +
      'across the certified window [1e4, 1e6], the layer-II rigidity scale ' +
      '(location fluctuation / mean spacing) the C_mb coupling would consume with ' +
      'the true-flow enclosure bound that supports it. A measured quantity from ' +
      'the standard density and number-variance laws at the actual Odlyzko ' +
      'ordinates; establishes no local law and no rigidity; supplies no N-uniform ' +
      'scale past the compute-bounded window top; the C_mb conditional stays ' +
      'irreducible and GUE-conditional (imp-486); respects the imp-2519 ' +
      'no-overclaim guard.',
    sota: 'No refereed bound is changed; the assembled Route-A claim stays RH-modulo-GUE-universality',
  }),
});

export default IMP36237_LAYER_II_RIGIDITY_SCALE_ACROSS_WINDOW;

// -- Tripwire assertions ------------------------------------------------------
export const IMP36237_LAYER_II_RIGIDITY_SCALE_ACROSS_WINDOW_ASSERTIONS = [
  {
    id: 'imp36237-parent-layer-ii-imported-verbatim',
    why: 'The measured layer must reproduce the imp-36180 LAYER II key/label/openRemains verbatim, not a paraphrase.',
    holds: () =>
      IMP36237_LAYER_II_RIGIDITY_SCALE_ACROSS_WINDOW.sourceLayer.key === 'esy-input-rigidity-scale' &&
      IMP36237_LAYER_II_RIGIDITY_SCALE_ACROSS_WINDOW.sourceLayer.label === LAYER_II.label &&
      IMP36237_LAYER_II_RIGIDITY_SCALE_ACROSS_WINDOW.sourceLayer.openRemains === LAYER_II.openRemains,
  },
  {
    id: 'imp36237-enclosure-rows-imported-verbatim',
    why: 'The height axis and enclosure bounds must be the imp-3725 plateau rows verbatim, not re-typed literals.',
    holds: () => {
      const rows = IMP36237_LAYER_II_RIGIDITY_SCALE_ACROSS_WINDOW.rigidityAcrossWindow;
      if (rows.length !== PLATEAU_ROWS.length) return false;
      return rows.every(
        (r, i) =>
          r.heightT === PLATEAU_ROWS[i].gammaLeft &&
          r.enclosureKpaperBound === PLATEAU_ROWS[i].KpaperBound &&
          r.startN === PLATEAU_ROWS[i].startN &&
          r.endN === PLATEAU_ROWS[i].endN,
      );
    },
  },
  {
    id: 'imp36237-all-rungs-inside-certified-window',
    why: 'Every plateau rung tabulated must lie inside [1e4, 1e6] -- this is the window-local measurement, not the cross-window ladder.',
    holds: () =>
      IMP36237_LAYER_II_RIGIDITY_SCALE_ACROSS_WINDOW.rigidityAcrossWindow.every(
        (r) => r.surrogateCertified === true && r.startN >= WINDOW_LO && r.endN <= WINDOW_HI,
      ),
  },
  {
    id: 'imp36237-scale-flat-order-unity-monotone',
    why: 'Across the window the rigidity scale must be strictly increasing, order-unity (0.3 < r < 0.4), and drift by under 10% -- flat slow sqrt(log log T) growth.',
    holds: () => {
      const rows = IMP36237_LAYER_II_RIGIDITY_SCALE_ACROSS_WINDOW.rigidityAcrossWindow;
      for (let i = 1; i < rows.length; i += 1) {
        if (!(rows[i].rigidityRatioConsumed > rows[i - 1].rigidityRatioConsumed)) return false;
      }
      const flat = rows.every((r) => r.rigidityRatioConsumed > 0.3 && r.rigidityRatioConsumed < 0.4);
      const drift = IMP36237_LAYER_II_RIGIDITY_SCALE_ACROSS_WINDOW.windowSummary.rDriftFraction;
      return flat && drift > 0 && drift < 0.1;
    },
  },
  {
    id: 'imp36237-window-endpoints-and-enclosure-bound',
    why: 'The measured endpoints must be ~0.3324 (bottom) and ~0.3578 (top), and the enclosure bound certified at every rung must be <= 2.4238e-6 (the imp-3725 headline).',
    holds: () => {
      const s = IMP36237_LAYER_II_RIGIDITY_SCALE_ACROSS_WINDOW.windowSummary;
      return (
        Math.abs(s.rAtWindowBottom - 0.332395) < 1e-4 &&
        Math.abs(s.rAtWindowTop - 0.357809) < 1e-4 &&
        s.enclosureKpaperMaxAcrossWindow <= 2.4238e-6 &&
        Math.abs(s.enclosureKpaperMaxAcrossWindow - IMP_3725_FMB_PLATEAU_DOMINATION.headline.K_paper_max_on_1e4_1e6) < 1e-12
      );
    },
  },
  {
    id: 'imp36237-honesty-gate',
    why: 'A numerical measurement that establishes no rigidity, discharges nothing, supplies no N-uniform scale, carries NO RH verdict.',
    holds: () => {
      const h = IMP36237_LAYER_II_RIGIDITY_SCALE_ACROSS_WINDOW.honestCaveat;
      return (
        h.isProof === false &&
        h.closesAnyGap === false &&
        h.dischargesCmbConditional === false &&
        h.establishesRigidity === false &&
        h.claimsRigidityEstablished === false &&
        h.establishesNUniformScale === false &&
        h.establishesOperatorPositivity === false &&
        h.derivesAnythingNew === false &&
        h.isReductionBelowRH === false &&
        h.carriesRHVerdict === false &&
        IMP36237_LAYER_II_RIGIDITY_SCALE_ACROSS_WINDOW.rigidityEstablished === false &&
        /Platt-Trudgian|refereed bound is changed/.test(h.sota)
      );
    },
  },
];

for (const assertion of IMP36237_LAYER_II_RIGIDITY_SCALE_ACROSS_WINDOW_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-36237-layer-ii-rigidity-scale-across-window assertion failed: ${assertion.id}`);
  }
}
