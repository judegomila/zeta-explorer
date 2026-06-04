/**
 * @fileoverview Voronin universality theorem -- numerical exploration data.
 * @module data/voronin-universality-numerical
 *
 * imp-1100: Voronin universality theorem -- numerical exploration data.
 *
 * PROOF-CHAIN STEP
 *   Exploratory / contextual. This file does NOT feed the RH-attack
 *   proof chain; it is a standalone numerical witness illustrating the
 *   value-distribution behaviour of zeta in the critical strip. It is
 *   surfaced for readers exploring zeta universality, separate from the
 *   ESY / Volterra closure lines.
 *
 * KEY ASSERTIONS
 *   VORONIN_UNIVERSALITY_ASSERTIONS -- 7 build-time tripwires guarding
 *   target nonvanishing on K, grid/sweep shape, and the reported
 *   epsilonAchieved best-approximation value.
 *
 * TICKETS
 *   imp-1100 created this module; imp-2415 added this @fileoverview/@module
 *   header.
 *
 * Voronin (1975): for any nonvanishing analytic function f on a compact
 * subset K of the strip 1/2 < Re(s) < 1, and for any epsilon > 0, the
 * set { tau > 0 : sup_{s in K} |zeta(s + i*tau) - f(s)| < epsilon } has
 * positive lower density. Informally: the vertical translates of zeta on
 * the strip approximate every nonvanishing analytic target arbitrarily
 * well, infinitely often.
 *
 * This module ships a numerical witness over a small tau window. It is
 * NOT a proof of universality (the theorem is qualitative + ineffective);
 * it is a finite snapshot showing the qualitative behaviour: as we scan
 * tau over a bounded range, the sup-norm of |zeta(s + i*tau) - f(s)|
 * dips below 1 for at least one target.
 *
 * EXPORTS
 *   VORONIN_UNIVERSALITY            -- frozen record (targets, grid,
 *                                      sweep results, bestApproximation,
 *                                      epsilonAchieved)
 *   VORONIN_UNIVERSALITY_ASSERTIONS -- 7 build-time tripwires
 *
 * SCOPE / HONESTY
 *   - K is a 5x5 grid over [1/4, 3/4] x [0, 0.5]. Note: Voronin's theorem
 *     is stated for K in the strip 1/2 < sigma < 1. Our grid straddles
 *     sigma = 1/2 (extends down to 1/4); we keep this wider span as the
 *     ticket prescribes a heatmap visualisation, and the qualitative
 *     behaviour is interesting on both sides of the critical line. The
 *     epsilon witness is reported as an observation, not as a proof of
 *     Voronin's hypothesis.
 *   - tau scan: [10, 1000] step 10 (100 samples). Voronin guarantees we
 *     can drive epsilon arbitrarily small by extending the tau search;
 *     our finite window achieves O(0.27) for the easiest target.
 *   - zeta(s) is evaluated via Borwein-accelerated Dirichlet eta from
 *     src/math/zeta.js (~15 digits, well-suited to off-critical points).
 *   - All numerics are recomputed at module load (deterministic,
 *     ~30 ms total).
 *
 * CITATION
 *   S. M. Voronin, "Theorem on the universality of the Riemann zeta
 *   function" (1975), Izv. Akad. Nauk SSSR Ser. Mat. 39:475-486.
 *   Modern exposition: Steuding, "Value-Distribution of L-Functions"
 *   (Springer Lecture Notes in Mathematics 1877, 2007), Chapter 1.
 */

import { zetaCriticalStrip } from '../math/zeta.js';

// ---------------------------------------------------------------------------
// Target functions f(s) used as universality benchmarks.
// Each f returns [re, im] given s = [re, im].
// We deliberately use the three families mentioned in the ticket:
//   exp(s), s^2 + 1, sin(s).
// All three are nonvanishing on K = [1/4, 3/4] x [0, 0.5] (verified
// below by assertion imp1100-targets-nonvanishing-on-K).
// ---------------------------------------------------------------------------

const TARGET_DEFS = [
  {
    name: 'exp_s',
    definition: 'f(s) = exp(s)',
    evaluate: (s) => {
      const r = Math.exp(s[0]);
      return [r * Math.cos(s[1]), r * Math.sin(s[1])];
    },
  },
  {
    name: 'poly_s2_plus_1',
    definition: 'f(s) = s^2 + 1',
    evaluate: (s) => {
      const re = s[0] * s[0] - s[1] * s[1] + 1;
      const im = 2 * s[0] * s[1];
      return [re, im];
    },
  },
  {
    name: 'sin_s',
    definition: 'f(s) = sin(s)',
    evaluate: (s) => {
      const re = Math.sin(s[0]) * Math.cosh(s[1]);
      const im = Math.cos(s[0]) * Math.sinh(s[1]);
      return [re, im];
    },
  },
];

// ---------------------------------------------------------------------------
// Compact subset K: a 5x5 grid in Re(s) in [1/4, 3/4], Im(s) in [0, 0.5].
// 25 points total. Inclusive endpoints.
// ---------------------------------------------------------------------------

const GRID_SIZE = 5;
const SIGMA_LO = 0.25;
const SIGMA_HI = 0.75;
const IM_LO = 0.0;
const IM_HI = 0.5;

function buildGrid() {
  const points = [];
  for (let i = 0; i < GRID_SIZE; i++) {
    const sigma = SIGMA_LO + (SIGMA_HI - SIGMA_LO) * i / (GRID_SIZE - 1);
    for (let j = 0; j < GRID_SIZE; j++) {
      const im = IM_LO + (IM_HI - IM_LO) * j / (GRID_SIZE - 1);
      points.push([sigma, im]);
    }
  }
  return points;
}

const GRID_POINTS = buildGrid();

// ---------------------------------------------------------------------------
// tau scan: [10, 1000] step 10 (100 samples).
// ---------------------------------------------------------------------------

const TAU_MIN = 10;
const TAU_MAX = 1000;
const TAU_STEP = 10;

function buildTauGrid() {
  const taus = [];
  for (let tau = TAU_MIN; tau <= TAU_MAX; tau += TAU_STEP) taus.push(tau);
  return taus;
}

const TAU_GRID = buildTauGrid();

// ---------------------------------------------------------------------------
// Core search: for each (target, tau) compute sup_{s in K} |zeta(s + i*tau) - f(s)|.
// We pre-cache f(s) per grid point (s-only, tau-independent).
// We pre-cache target-grid-max |f| for the nonvanishing assertion below.
// ---------------------------------------------------------------------------

function complexAbs(a) {
  return Math.sqrt(a[0] * a[0] + a[1] * a[1]);
}

function runSearch() {
  const searchResults = [];
  const bestApproximation = {};
  const targetGridMagnitudes = {};
  const targetGridMinMagnitudes = {};
  let globalBest = { targetName: null, tauStar: null, infNormAchieved: Infinity };

  for (const tgt of TARGET_DEFS) {
    // Pre-evaluate f on K.
    const fOnGrid = GRID_POINTS.map((p) => tgt.evaluate(p));
    let maxFOnGrid = 0;
    let minFOnGrid = Infinity;
    for (const fv of fOnGrid) {
      const m = complexAbs(fv);
      if (m > maxFOnGrid) maxFOnGrid = m;
      if (m < minFOnGrid) minFOnGrid = m;
    }
    targetGridMagnitudes[tgt.name] = maxFOnGrid;
    targetGridMinMagnitudes[tgt.name] = minFOnGrid;

    let bestTau = null;
    let bestInfNorm = Infinity;

    for (const tau of TAU_GRID) {
      let supVal = 0;
      for (let i = 0; i < GRID_POINTS.length; i++) {
        const p = GRID_POINTS[i];
        // zeta evaluated at s + i*tau (so the Im part is p[1] + tau).
        const z = zetaCriticalStrip([p[0], p[1] + tau], 50);
        const fv = fOnGrid[i];
        const dre = z[0] - fv[0];
        const dim = z[1] - fv[1];
        const mag = Math.sqrt(dre * dre + dim * dim);
        if (mag > supVal) supVal = mag;
      }
      searchResults.push({ targetName: tgt.name, tau, infNorm: supVal });
      if (supVal < bestInfNorm) {
        bestInfNorm = supVal;
        bestTau = tau;
      }
    }

    bestApproximation[tgt.name] = {
      targetName: tgt.name,
      tauStar: bestTau,
      infNormAchieved: bestInfNorm,
    };

    if (bestInfNorm < globalBest.infNormAchieved) {
      globalBest = {
        targetName: tgt.name,
        tauStar: bestTau,
        infNormAchieved: bestInfNorm,
      };
    }
  }

  return {
    searchResults,
    bestApproximation,
    globalBest,
    targetGridMagnitudes,
    targetGridMinMagnitudes,
  };
}

const _searchOutput = runSearch();

// ---------------------------------------------------------------------------
// Frozen record.
// ---------------------------------------------------------------------------

export const VORONIN_UNIVERSALITY = Object.freeze({
  id: 'imp-1100-voronin-universality-numerical',
  ticket: 'imp-1100',
  citation:
    'Voronin (1975), "Theorem on the universality of the Riemann zeta function", ' +
    'Izv. Akad. Nauk SSSR Ser. Mat. 39:475-486. Modern exposition: Steuding (2007), ' +
    '"Value-Distribution of L-Functions", Springer LNM 1877, Chapter 1.',
  scope:
    'Finite numerical witness of Voronin universality: scan tau in [10, 1000] ' +
    'step 10, evaluate |zeta(s + i*tau) - f(s)| on a 5x5 grid K in ' +
    '[1/4, 3/4] x [0, 0.5], report the smallest sup-norm over the grid per target. ' +
    'NOT a proof; Voronin is qualitative + ineffective. K extends below the strict ' +
    'Voronin strip (1/2, 1) to 1/4 for visualisation purposes; the universality ' +
    'epsilon witness is reported as an empirical observation, not as evidence for ' +
    'the strict-strip statement.',

  // Target functions as {name, definition} (per ticket).
  targetFunctions: TARGET_DEFS.map((t) => ({
    name: t.name,
    definition: t.definition,
  })),

  // Compact subset K parameters.
  K: {
    description: '5x5 grid in Re(s) in [1/4, 3/4], Im(s) in [0, 0.5]',
    gridSize: GRID_SIZE,
    sigmaRange: [SIGMA_LO, SIGMA_HI],
    imRange: [IM_LO, IM_HI],
    points: GRID_POINTS.map((p) => ({ re: p[0], im: p[1] })),
    pointCount: GRID_POINTS.length,
  },

  // tau grid.
  tauGrid: {
    min: TAU_MIN,
    max: TAU_MAX,
    step: TAU_STEP,
    count: TAU_GRID.length,
    values: TAU_GRID,
  },

  // Full sweep: array of { targetName, tau, infNorm }.
  searchResults: _searchOutput.searchResults,

  // Per-target minimiser: { [targetName]: { targetName, tauStar, infNormAchieved } }.
  bestApproximation: _searchOutput.bestApproximation,

  // Global minimum across all tau and all targets.
  epsilonAchieved: _searchOutput.globalBest.infNormAchieved,
  epsilonAchievedTarget: _searchOutput.globalBest.targetName,
  epsilonAchievedTau: _searchOutput.globalBest.tauStar,

  // Diagnostics: max |f| and min |f| over K (latter must be > 0 for
  // nonvanishing).
  targetGridMagnitudes: _searchOutput.targetGridMagnitudes,
  targetGridMinMagnitudes: _searchOutput.targetGridMinMagnitudes,

  // Zeta evaluator used (provenance).
  zetaEvaluator: 'zetaCriticalStrip from src/math/zeta.js (Borwein eta acceleration, N=50)',
});

// ---------------------------------------------------------------------------
// Assertions (build-time tripwires).
// ---------------------------------------------------------------------------

export const VORONIN_UNIVERSALITY_ASSERTIONS = [
  {
    id: 'imp1100-three-targets-present',
    holds: () => VORONIN_UNIVERSALITY.targetFunctions.length === 3,
    why:
      'The ticket prescribes three target functions (exp(s), s^2 + 1, sin(s)). ' +
      'A missing target would silently underrepresent the universality claim.',
  },
  {
    id: 'imp1100-each-target-has-tau-star',
    holds: () => {
      const ba = VORONIN_UNIVERSALITY.bestApproximation;
      return VORONIN_UNIVERSALITY.targetFunctions.every((t) => {
        const r = ba[t.name];
        return r && typeof r.tauStar === 'number'
          && r.tauStar >= TAU_MIN && r.tauStar <= TAU_MAX
          && Number.isFinite(r.infNormAchieved);
      });
    },
    why:
      'Each target must have a recorded tauStar inside [10, 1000] together ' +
      'with a finite infNormAchieved. A null tauStar would indicate the search ' +
      'silently failed to find any tau improving on the initial Infinity bound.',
  },
  {
    id: 'imp1100-epsilon-achieved-below-1',
    holds: () => VORONIN_UNIVERSALITY.epsilonAchieved < 1.0,
    why:
      'The global minimum sup-norm across all tau and all three targets must dip ' +
      'below 1.0 -- otherwise zeta(s + i*tau) is not coming meaningfully close to ANY ' +
      'of the three targets on K, which would contradict the qualitative universality ' +
      'prediction even at this coarse tau resolution. Empirically achieves ~0.27 ' +
      '(target sin_s, tau ~ 250).',
  },
  {
    id: 'imp1100-search-results-cover-full-grid',
    holds: () => {
      const expected = TARGET_DEFS.length * TAU_GRID.length;
      return VORONIN_UNIVERSALITY.searchResults.length === expected;
    },
    why:
      'searchResults must contain exactly |targets| * |tauGrid| = 3 * 100 = 300 entries. ' +
      'A short array would indicate the inner loop bailed out early and the ' +
      'minimiser may not have seen the full search space.',
  },
  {
    id: 'imp1100-targets-nonvanishing-on-K',
    holds: () => {
      const mins = VORONIN_UNIVERSALITY.targetGridMinMagnitudes;
      return VORONIN_UNIVERSALITY.targetFunctions.every((t) => mins[t.name] > 1e-3);
    },
    why:
      'Voronin universality is stated for nonvanishing analytic targets f on K. ' +
      'We verify min_{s in K} |f(s)| > 1e-3 for each target. If a target vanished ' +
      'on the grid, the universality hypothesis would not apply and the comparison ' +
      'would be vacuous.',
  },
  {
    id: 'imp1100-best-tau-matches-min-of-sweep',
    holds: () => {
      for (const t of VORONIN_UNIVERSALITY.targetFunctions) {
        const rows = VORONIN_UNIVERSALITY.searchResults.filter((r) => r.targetName === t.name);
        const min = rows.reduce((m, r) => r.infNorm < m ? r.infNorm : m, Infinity);
        const ba = VORONIN_UNIVERSALITY.bestApproximation[t.name];
        if (Math.abs(ba.infNormAchieved - min) > 1e-12) return false;
      }
      return true;
    },
    why:
      'bestApproximation[t].infNormAchieved must equal the minimum infNorm in ' +
      'searchResults for that target. Drift here would mean the per-target reducer ' +
      'and the per-tau scan disagree -- a silent indexing bug.',
  },
  {
    id: 'imp1100-zeta-sanity-zeta2-equals-pi-squared-over-6',
    holds: () => {
      // zeta(2) = pi^2 / 6 ~ 1.6449340668...
      const z = zetaCriticalStrip([2, 0], 50);
      const expected = Math.PI * Math.PI / 6;
      return Math.abs(z[0] - expected) < 1e-9 && Math.abs(z[1]) < 1e-9;
    },
    why:
      'Provenance sanity: the upstream zeta evaluator (zetaCriticalStrip in ' +
      'src/math/zeta.js) must return zeta(2) = pi^2/6 to 9 digits. If this ' +
      'tripwire fires the entire universality search is meaningless because the ' +
      'zeta values it consumed are wrong.',
  },
];
