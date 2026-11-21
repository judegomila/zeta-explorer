/**
 * @module imp-36221-layer-ii-rigidity-scale-tabulation
 * @fileoverview imp-36221 -- read-only NUMERICAL characterization of imp-36180
 *   LAYER II (the microscopic RIGIDITY SCALE). imp-36180 broke the idealized ESY
 *   local-law black box gating the irreducible C_mb GUE conditional (G5-cmb-gue /
 *   imp-486) into three input layers; layer II is a microscopic rigidity scale
 *   that the Calogero-Moser / Dyson-Brownian-motion (DBM) literature supplies for
 *   random or regular initial data but that stays OPEN, N-uniformly, for the
 *   DETERMINISTIC arithmetic seed {gamma_k}. This module MEASURES, on the repo
 *   surrogate multiset (the Riemann zeros via their standard density/number-
 *   variance laws), the N-dependence of the rigidity scale the C_mb coupling would
 *   consume -- the typical particle-location fluctuation expressed in units of the
 *   mean spacing -- and tabulates it against the scale the DBM literature
 *   guarantees, quantifying the deterministic-seed gap.
 *
 *   NUMERICAL CHARACTERIZATION ONLY. Establishes no local law, discharges no
 *   conditional, claims NO input is available, changes no bound, respects the
 *   imp-2519 no-overclaim guard, NO QED. C_mb stays irreducible and GUE-
 *   conditional (imp-486). No refereed bound is changed.
 *
 *   WHAT "RIGIDITY SCALE" MEANS HERE (the quantity the coupling consumes)
 *   --------------------------------------------------------------------
 *   Resolving the local spacing statistics -- hence the collision-drift average
 *   that IS C_mb -- requires the particle locations to be pinned to their classical
 *   positions at (a bounded multiple of) the MEAN-SPACING scale. So the natural
 *   dimensionless quantity is the ratio
 *        r(T) = (typical |gamma_k - classical location|) / (mean spacing at T).
 *   For the zeros this ratio is governed by the argument function S(T): the
 *   counting-function fluctuation N(gamma_k) - (k - 1/2) = S(gamma_k) has, on the
 *   Montgomery / GUE model, variance Var(S(T)) ~ (1/(2 pi^2)) log log T, and a
 *   location displacement equals a counting displacement divided by the local
 *   density, i.e. multiplied by the mean spacing. Hence
 *        r(T) = sqrt( (1/(2 pi^2)) log log T )   (unfolded units, mean spacing = 1).
 *   This is order-unity and grows only like sqrt(log log T) -- no numerical
 *   blow-up over any reachable range.
 *
 *   WHAT THE DBM LITERATURE GUARANTEES vs WHAT THE SURROGATE CERTIFIES
 *   -----------------------------------------------------------------
 *   For random or regular initial data ESY / DBM rigidity DELIVERS exactly an
 *   order-unity / slowly-growing r(T) at the mean-spacing scale, unconditionally
 *   and for ALL N. The arithmetic seed exhibits the SAME order-unity ratio at
 *   finite ranges -- but only (a) CONJECTURALLY, via Montgomery pair correlation
 *   (imp-2497 grades this equidistribution input conditional), and (b) CERTIFIED
 *   only on the finite surrogate window [1e4, 1e6] where the imp-3725 true-flow
 *   two-sided enclosure gives K_paper <= 2.4238e-6 (imp-36079). Past the window
 *   top (~1.7e6 zeros) there is NO established scale: the ceiling is bounded
 *   compute (O(N^2) per rung), never a limit. So the gap is NOT a numerical
 *   divergence -- the tabulated ratio stays flat and order-unity -- it is that the
 *   identical scale is unconditional for random/regular data but for the
 *   deterministic seed it is conjectural-and-window-certified only.
 *
 *   @see src/data/imp-36180-esy-cmb-local-law-input-scope.js (parent: the three ESY input layers; LAYER II imported verbatim below)
 *   @see src/data/imp-36241-layer-i-local-semicircle-input-scope.js (sibling deep-dive of LAYER I)
 *   @see src/data/imp-2497-esy-highest-leverage-input-availability-audit.js (the arithmetic-axis conditional-equidistribution sibling)
 *
 *   Ticket: imp-36221 (numerical, medium). Characterization only; imports the
 *   parent layer verbatim; measures a modeled scale WITHOUT claiming rigidity is
 *   established; discharges no conditional; changes no bound; imp-2519 preserved;
 *   NO QED; no refereed bound is changed.
 */

import { IMP36180_ESY_CMB_LOCAL_LAW_INPUT_SCOPE } from './imp-36180-esy-cmb-local-law-input-scope.js';

const TWO_PI = 2 * Math.PI;

// Verbatim import of the parent LAYER II entry this module measures.
const LAYER_II = IMP36180_ESY_CMB_LOCAL_LAW_INPUT_SCOPE.esyInputLayers.find(
  (l) => l.key === 'esy-input-rigidity-scale',
);

// Standard zero-counting laws for the surrogate multiset near height T.
//   N(T)          ~ (T / 2pi) ( log(T/2pi) - 1 )          (Riemann-von Mangoldt)
//   meanSpacing   =  2pi / log(T/2pi)                     (spacing near height T)
//   r(T)          =  sqrt( (1/(2 pi^2)) log log T )        (fluctuation / spacing)
const countN = (T) => (T / TWO_PI) * (Math.log(T / TWO_PI) - 1);
const meanSpacing = (T) => TWO_PI / Math.log(T / TWO_PI);
const rigidityRatio = (T) => Math.sqrt((1 / (2 * Math.PI * Math.PI)) * Math.log(Math.log(T)));

// The imp-3725 true-flow enclosure certifies the window [1e4, 1e6] only.
const WINDOW_LO = 1e4;
const WINDOW_HI = 1e6;
const isCertified = (T) => T >= WINDOW_LO && T <= WINDOW_HI;

// Height ladder: the certified surrogate window, then the Platt-Trudgian verified
// zero height X ~ 3e12, then two rungs beyond it -- all UNCERTIFIED past 1e6.
const LADDER_T = Object.freeze([1e4, 1e5, 1e6, 3e12, 1e18, 1e30]);

const RIGIDITY_TABLE = Object.freeze(
  LADDER_T.map((T) =>
    Object.freeze({
      T,
      // Number of zeros up to height T -- the surrogate "N" the scale runs against.
      N: countN(T),
      // Mean spacing near height T (absolute units).
      meanSpacing: meanSpacing(T),
      // Ratio the C_mb coupling consumes: typical location fluctuation / mean spacing.
      rigidityRatioConsumed: rigidityRatio(T),
      // The DBM literature supplies THIS SAME order-unity ratio -- but only for
      // random / regular initial data, which the arithmetic seed is not.
      dbmGuaranteedForRandomOrRegularData: true,
      // The imp-3725 window enclosure certifies the ratio ONLY inside [1e4, 1e6].
      surrogateCertified: isCertified(T),
      // The deterministic-seed status at this rung.
      deterministicSeedStatus: isCertified(T)
        ? 'window-certified (imp-3725 true-flow enclosure)'
        : 'conjectural (Montgomery, imp-2497 conditional) and UNCERTIFIED (past compute-bounded window top)',
    }),
  ),
);

// Scalar summary of the quantified gap.
const CERTIFIED_WINDOW_TOP_N = countN(WINDOW_HI); // ~1.7e6 zeros
const RATIO_AT_WINDOW_TOP = rigidityRatio(WINDOW_HI);
const RATIO_AT_PT_HEIGHT = rigidityRatio(3e12); // Platt-Trudgian verified height.
const RATIO_AT_LADDER_TOP = rigidityRatio(LADDER_T[LADDER_T.length - 1]);

const VERDICT =
  'layer-ii-rigidity-scale-measured-order-unity-slowly-growing-but-unconditional-only-for-random-regular-data-window-certified-for-arithmetic-seed';

export const IMP36221_LAYER_II_RIGIDITY_SCALE_TABULATION = Object.freeze({
  id: 'imp-36221',
  ticket: 'imp-36221',
  measures: 'imp-36180', // the parent LAYER II this module tabulates.
  scopes: 'imp-486', // the exhaustive search that graded C_mb irreducible.
  axis:
    'microscopic rigidity SCALE (location fluctuation / mean spacing) the C_mb ' +
    'coupling would consume, tabulated over an N ladder for the deterministic ' +
    'arithmetic seed vs the DBM guarantee for random/regular data',
  question:
    'imp-36180 layer II names a microscopic rigidity scale OPEN for the ' +
    'deterministic seed but records it as a single black box. On the repo ' +
    'surrogate multiset, how does the rigidity scale the C_mb coupling consumes ' +
    'depend on N, and how does it compare to the scale the DBM literature ' +
    'guarantees for random/regular initial data?',

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
    '= sqrt( (1/(2 pi^2)) log log T ), from Var(S(T)) ~ (1/(2 pi^2)) log log T and ' +
    'displacement = counting-fluctuation / local density.',

  rigidityTable: RIGIDITY_TABLE,

  gapSummary: Object.freeze({
    certifiedWindow: Object.freeze({ Tlo: WINDOW_LO, Thi: WINDOW_HI }),
    certifiedWindowTopN: CERTIFIED_WINDOW_TOP_N,
    ratioAtWindowTop: RATIO_AT_WINDOW_TOP,
    ratioAtPlattTrudgianHeight: RATIO_AT_PT_HEIGHT,
    ratioAtLadderTop: RATIO_AT_LADDER_TOP,
    finding:
      'The rigidity ratio the coupling consumes is order-unity and grows only ' +
      'like sqrt(log log T) -- no numerical blow-up over any reachable range. The ' +
      'DBM literature supplies exactly this order-unity scale, but UNCONDITIONALLY ' +
      'only for random / regular initial data. For the deterministic arithmetic ' +
      'seed the identical scale is conjectural (Montgomery, imp-2497 conditional) ' +
      'and CERTIFIED only on the finite window [1e4, 1e6] (~1.7e6 zeros); past the ' +
      'window top there is no established scale. The gap is thus a ' +
      'CONDITIONALITY / certification-range gap, not a numerical divergence.',
  }),

  verdict: VERDICT,
  rigidityEstablished: false,

  honestCaveat: Object.freeze({
    isProof: false,
    closesAnyGap: false,
    dischargesCmbConditional: false,
    establishesRigidity: false,
    claimsRigidityEstablished: false,
    establishesOperatorPositivity: false,
    derivesAnythingNew: false,
    isReductionBelowRH: false,
    carriesRHVerdict: false,
    scope:
      'Read-only NUMERICAL characterization tabulating, over an N ladder, the ' +
      'rigidity scale (location fluctuation / mean spacing) the C_mb coupling ' +
      'would consume for the deterministic arithmetic seed vs the scale the DBM ' +
      'literature guarantees for random/regular data. A modeled/measured ' +
      'quantity from the standard density and number-variance laws; establishes ' +
      'no local law and no rigidity; the C_mb conditional stays irreducible and ' +
      'GUE-conditional (imp-486); respects the imp-2519 no-overclaim guard.',
    sota: 'No refereed bound is changed; the assembled Route-A claim stays RH-modulo-GUE-universality',
  }),
});

export default IMP36221_LAYER_II_RIGIDITY_SCALE_TABULATION;

// -- Tripwire assertions ------------------------------------------------------
export const IMP36221_LAYER_II_RIGIDITY_SCALE_TABULATION_ASSERTIONS = [
  {
    id: 'imp36221-parent-layer-ii-imported-verbatim',
    why: 'The measured layer must reproduce the imp-36180 LAYER II key/label/openRemains verbatim, not a paraphrase.',
    holds: () =>
      IMP36221_LAYER_II_RIGIDITY_SCALE_TABULATION.sourceLayer.key === 'esy-input-rigidity-scale' &&
      IMP36221_LAYER_II_RIGIDITY_SCALE_TABULATION.sourceLayer.label === LAYER_II.label &&
      IMP36221_LAYER_II_RIGIDITY_SCALE_TABULATION.sourceLayer.openRemains === LAYER_II.openRemains,
  },
  {
    id: 'imp36221-ladder-monotone-and-order-unity',
    why: 'The rigidity ratio must be strictly increasing along the height ladder and stay order-unity (0.2 < r < 0.6) -- slow sqrt(log log T) growth, no blow-up.',
    holds: () => {
      const rows = IMP36221_LAYER_II_RIGIDITY_SCALE_TABULATION.rigidityTable;
      for (let i = 1; i < rows.length; i += 1) {
        if (!(rows[i].rigidityRatioConsumed > rows[i - 1].rigidityRatioConsumed)) return false;
      }
      return rows.every((r) => r.rigidityRatioConsumed > 0.2 && r.rigidityRatioConsumed < 0.6);
    },
  },
  {
    id: 'imp36221-only-window-rungs-certified',
    why: 'Exactly the ladder rungs inside [1e4, 1e6] may be flagged surrogate-certified; every rung past the window top must be uncertified.',
    holds: () => {
      const rows = IMP36221_LAYER_II_RIGIDITY_SCALE_TABULATION.rigidityTable;
      return rows.every((r) => r.surrogateCertified === (r.T >= WINDOW_LO && r.T <= WINDOW_HI));
    },
  },
  {
    id: 'imp36221-window-top-count-and-pt-ratio',
    why: 'The certified window top must carry ~1.7e6 zeros and the Platt-Trudgian-height ratio must be order-unity (~0.41), confirming no divergence at the verified height.',
    holds: () => {
      const g = IMP36221_LAYER_II_RIGIDITY_SCALE_TABULATION.gapSummary;
      return (
        g.certifiedWindowTopN > 1.5e6 &&
        g.certifiedWindowTopN < 2.0e6 &&
        g.ratioAtPlattTrudgianHeight > 0.38 &&
        g.ratioAtPlattTrudgianHeight < 0.44 &&
        g.ratioAtLadderTop > g.ratioAtWindowTop
      );
    },
  },
  {
    id: 'imp36221-honesty-gate',
    why: 'A numerical characterization that establishes no rigidity, discharges nothing, establishes no positivity, carries NO RH verdict.',
    holds: () => {
      const h = IMP36221_LAYER_II_RIGIDITY_SCALE_TABULATION.honestCaveat;
      return (
        h.isProof === false &&
        h.closesAnyGap === false &&
        h.dischargesCmbConditional === false &&
        h.establishesRigidity === false &&
        h.claimsRigidityEstablished === false &&
        h.establishesOperatorPositivity === false &&
        h.derivesAnythingNew === false &&
        h.isReductionBelowRH === false &&
        h.carriesRHVerdict === false &&
        IMP36221_LAYER_II_RIGIDITY_SCALE_TABULATION.rigidityEstablished === false &&
        /Platt-Trudgian|refereed bound is changed/.test(h.sota)
      );
    },
  },
];

for (const assertion of IMP36221_LAYER_II_RIGIDITY_SCALE_TABULATION_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-36221-layer-ii-rigidity-scale-tabulation assertion failed: ${assertion.id}`);
  }
}
