/**
 * @module data/zero-free-region-from-lambda
 * @fileoverview imp-418 downstream consequence: zero-free region tightening
 *   from the Lambda bound. Translates a de Bruijn-Newman bound Lambda <= L
 *   into an explicit TYPE B zero-free strip { sigma > 1/2 + L * log(|t|/(2*pi)) }
 *   via the heat-flow ODE for H_t zeros (de Bruijn 1950, Csordas-Norfolk-Varga
 *   1986), and compares it to the unconditional Mossinghoff-Trudgian 2015
 *   TYPE A region zeta(s) != 0 for sigma >= 1 - 1/(R_MT * log|t|) with
 *   R_MT = 5.573412. Computes (i) the dbnBoundary(L, gamma) and
 *   effectiveVKConstant(L, gamma) at fixed gamma, (ii) the crossover height
 *   gamma_crossover(L) ~ 2*pi * exp(1/(2*L)) below which TYPE B dominates
 *   TYPE A, and (iii) a COMPARISON_TABLE across gamma in {1e3, 1e6, 3e12, 1e20}
 *   for the three Lambda levels {Platt-Trudgian 0.2, our OLS headline 0.0166,
 *   asymptotic 0}. Headline number: at gamma = 3e12 (Platt-Trudgian verified
 *   height) the projected Lambda <= 0.0166 yields R_eff ~ 0.649 vs R_MT
 *   = 5.573 (an ~8.6x improvement in zero-free constant), conditional on the
 *   OLS intercept a ~ 0.007 and blockers B1, B2, B4 of lambda-zero-attack.js.
 *
 * Proof-chain step: downstream consequence of the Lambda chain (NOT itself a
 *   proof step). The TYPE B strip is rigorous IF Lambda <= L is rigorous; it
 *   inherits the conditional status of bridge-lambda-rh.js pathCBound. The
 *   mean-density (Poisson-kernel) approximation of the heat-flow collision
 *   time t_c ~ y0 / log(gamma/(2*pi)) is named as the only non-elementary
 *   step beyond the heat-flow ODE itself, and is tracked in the openItems
 *   field "density-approximation".
 *
 * Exports:
 *   - ZERO_FREE_REGION_FROM_LAMBDA: frozen-shape record with typeBStrip
 *     formula, typeAMT2015 reference, effectiveVKAtPTHeight headline at
 *     gamma = 3e12, crossoverHeights (ourBound ~7.2e13, plattTrudgian ~76),
 *     comparisonTable across four heights, finiteHeightLadder rows derived
 *     from FINITE_HEIGHT_LAMBDA_BOUND.ladder (imp-416), honestSummary, and
 *     openItems tracking density-approximation and lambda-chain-rigorous.
 *   - ZERO_FREE_REGION_ASSERTIONS: six build-time assertions covering
 *     boundary range at 1e12, TYPE B < TYPE A at 1e6, R_eff < R_MT at 1e6,
 *     crossover > 1e13, table row count = 4, and R_eff < R_MT at 3e12.
 *
 * Inbound dependencies:
 *   - bridge-lambda-rh.js (imp-316): supplies LAMBDA_RH_BRIDGE.sotaUpperBound
 *     (Platt-Trudgian Lambda <= 0.2) and LAMBDA_RH_BRIDGE.pathCBound (our
 *     OLS projection central + error bar = 0.0166).
 *   - finite-height-lambda-bound.js (imp-416): supplies
 *     FINITE_HEIGHT_LAMBDA_BOUND.ladder for the per-N projected Lambda values
 *     at N in {1e4, 1e5, 1e6}.
 *
 * Tickets that created or modified this file: imp-418 (initial delivery of
 *   the TYPE B strip translation and MT 2015 comparison), imp-1066 (this
 *   @module / @fileoverview header).
 *
 * imp-418: Downstream consequence -- zero-free region tightening from the Lambda bound
 *
 * Central question
 * ----------------
 * A de Bruijn-Newman bound Lambda <= L is not merely an abstract estimate; it
 * directly controls how far the non-trivial zeros of the Riemann zeta function
 * can stray from the critical line Re(s) = 1/2. This file traces that
 * downstream consequence, computes the induced zero-free regions at the heights
 * where our bound applies, and compares them to the Mossinghoff-Trudgian (2015)
 * explicit unconditional result.
 *
 * Two complementary zero-free regions
 * -------------------------------------
 * The literature distinguishes two types:
 *
 *   TYPE A (near sigma = 1, Vinogradov-Korobov style):
 *     zeta(s) != 0 for sigma >= 1 - 1/(R * log|t|)
 *     Best known: R = 5.573412  (Mossinghoff-Trudgian 2015, unconditional)
 *
 *   TYPE B (near sigma = 1/2, de Bruijn-Newman strip):
 *     If Lambda <= L, every zero rho = beta + i*gamma of zeta satisfies
 *       beta <= 1/2 + L * log(gamma / (2*pi))        ... (*)
 *     i.e., the half-plane
 *       { sigma > 1/2 + L * log(|t| / (2*pi)) } is zero-free.
 *     Derivation: the heat-flow collision time for a zero z0 = x0 - i*y0
 *       of H_0 (with y0 = beta - 1/2 > 0, at height x0 ~ gamma) satisfies
 *       t_c ~ y0 / log(gamma/(2*pi)) in the linear-density approximation
 *       (Poisson-kernel integral with mean zero density D(gamma)
 *        = log(gamma/(2*pi)) / (2*pi)). Since t_c <= Lambda <= L, bound (*) follows.
 *
 * Connection: TYPE B subsumes TYPE A below the crossover height gamma_crossover
 * -------------------------------------------------------------------------------
 * Re-writing (*) as a TYPE A-style statement: the TYPE B boundary
 *   sigma_dbn(gamma) = 1/2 + L * log(gamma/(2*pi))
 * is smaller than (i.e. gives a LARGER zero-free region than) the TYPE A boundary
 *   sigma_mt(gamma)  = 1 - 1/(R_MT * log gamma)
 * whenever sigma_dbn < sigma_mt, i.e.
 *   1/2 + L * log(gamma/(2*pi)) < 1 - 1/(R_MT * log gamma)
 * which holds for gamma < gamma_crossover(L) ~ 2*pi * exp(1 / (2*L)).
 *
 * For our headline L = 0.0166:
 *   gamma_crossover ~ 2*pi * exp(30.1) ~ 7.2e13
 * so for all gamma < 7e13 our projected bound is at least as strong as MT 2015.
 *
 * Effective VK constant
 * ----------------------
 * Write the TYPE B boundary in the TYPE A form:
 *   1 - 1/(R_eff * log gamma) = 1/2 + L * log(gamma/(2*pi))
 *   R_eff = 1 / (log gamma * (1/2 - L * log(gamma/(2*pi))))
 *
 * A SMALLER R_eff means a STRONGER (larger) zero-free region. Since R_eff < R_MT,
 * the TYPE B region is strictly stronger than TYPE A for gamma < gamma_crossover.
 *
 * Caveats and rigor level
 * -----------------------
 * The TYPE B bound (*) uses the mean-density (Poisson-kernel) approximation
 * for the heat-flow speed. A RIGOROUS version requires an explicit bound on the
 * local zero density in [gamma - R, gamma + R], either from Selberg-type explicit
 * formulas or from the same Koksma-Hlawka bound (imp-341) that underlies the
 * lim-sup result (but deployed as an explicit per-height statement).
 *
 * The TYPE A comparison to MT 2015 is ILLUSTRATIVE: MT is an unconditional theorem
 * for all |t| >= 2; our bound is a PROJECTION dependent on the OLS intercept
 * a ~ 0.007 and the open blockers B1, B2, B4 in lambda-zero-attack.js.
 *
 * Sources
 * -------
 *   imp-316 bridge-lambda-rh.js (Lambda = 0 iff RH, headline Lambda upper bound)
 *   imp-416 finite-height-lambda-bound.js (Lambda <= L at finite heights)
 *   de Bruijn, Duke Math. J. 17 (1950), 197-226 (heat-flow definition)
 *   Csordas, Norfolk, Varga, Trans. AMS 296 (1986), 521-541 (heat-flow ODE)
 *   Mossinghoff & Trudgian, Math. Comp. 84 (2015), 1521-1535 (TYPE A reference)
 */

import { LAMBDA_RH_BRIDGE } from './bridge-lambda-rh.js';
import { FINITE_HEIGHT_LAMBDA_BOUND } from './finite-height-lambda-bound.js';

// ── Reference constants ──────────────────────────────────────────────────────

// Mossinghoff-Trudgian 2015: zeta(s) != 0 for sigma >= 1 - 1/(R_MT * log|t|)
// (explicit Korobov-Vinogradov-style, unconditional for |t| >= 2)
const R_MT       = 5.573412;
const MT_CITATION = 'Mossinghoff & Trudgian, Math. Comp. 84 (2015), 1521-1535';

// Platt-Trudgian 2021 Lambda <= 0.2 (unconditional)
const PT_LAMBDA  = LAMBDA_RH_BRIDGE.sotaUpperBound.value;      // 0.2
const PT_CITATION = LAMBDA_RH_BRIDGE.sotaUpperBound.citation;

// Our headline Lambda bound: pathC central value + error bar = 0.0166
const OUR_LAMBDA =
  LAMBDA_RH_BRIDGE.pathCBound.centralValue +
  LAMBDA_RH_BRIDGE.pathCBound.errorBar; // 0.0166

// ── TYPE B zero-free strip formula ──────────────────────────────────────────

// Returns the TYPE B boundary sigma_dbn = 1/2 + L * log(gamma/(2*pi))
// or null if the boundary is >= 1 (outside the linearization regime).
function dbnBoundary(L, gamma) {
  if (L === 0) return 0.5; // Lambda = 0 => all zeros on critical line (RH)
  const b = 0.5 + L * Math.log(gamma / (2 * Math.PI));
  return b < 1 ? +b.toFixed(6) : null;
}

// ── TYPE A effective constant R_eff from the TYPE B boundary ─────────────────
//
// Solve 1 - 1/(R_eff * log gamma) = sigma_dbn:
//   R_eff = 1 / (log(gamma) * (1/2 - L * log(gamma/(2*pi))))
//
// A SMALLER R_eff means a STRONGER zero-free region (R_eff < R_MT => TYPE B > TYPE A).
function effectiveVKConstant(L, gamma) {
  if (L === 0) return 0; // full zero-free region (RH), R_eff = 0
  const logG  = Math.log(gamma);
  const inner = 0.5 - L * Math.log(gamma / (2 * Math.PI));
  if (inner <= 0) return null; // boundary >= 1, outside linearization regime
  return +(1 / (logG * inner)).toFixed(6);
}

// ── TYPE A Mossinghoff-Trudgian boundary ─────────────────────────────────────
function mtBoundary(gamma) {
  return +(1 - 1 / (R_MT * Math.log(gamma))).toFixed(6);
}

// ── Crossover height (approximate) ───────────────────────────────────────────
// TYPE B boundary = TYPE A boundary when L * log(gamma/(2*pi)) ~ 1/2
// => gamma ~ 2*pi * exp(1/(2*L))
function crossoverHeightApprox(L) {
  if (L === 0) return Infinity;
  return 2 * Math.PI * Math.exp(1 / (2 * L));
}

// ── Lambda levels for the comparison ─────────────────────────────────────────
const LAMBDA_LEVELS = [
  {
    label:    'Platt-Trudgian 2021  (Lambda <= 0.2, unconditional theorem)',
    L:        PT_LAMBDA,
    rigorous: true,
    source:   PT_CITATION,
  },
  {
    label:    'Our headline bound  (Lambda <= 0.0166, OLS projection, imp-418)',
    L:        OUR_LAMBDA,
    rigorous: false,
    source:   'bridge-lambda-rh.js pathCBound',
  },
  {
    label:    'Asymptotic Lambda = 0  (would imply full RH)',
    L:        0,
    rigorous: false,
    source:   'imp-341 lim-sup statement (G6 bridge still open)',
  },
];

// ── Comparison table ─────────────────────────────────────────────────────────
const TARGET_HEIGHTS = [1e3, 1e6, 3e12, 1e20];

const COMPARISON_TABLE = TARGET_HEIGHTS.map((gamma) => {
  const mt_bdy = mtBoundary(gamma);
  return {
    gamma,
    log10_gamma:               +Math.log10(gamma).toFixed(1),
    mt_boundary:               mt_bdy,
    mt_zero_free_halfplane:    +(1 - mt_bdy).toFixed(6),
    levels: LAMBDA_LEVELS.map((lvl) => {
      const dbn_bdy = dbnBoundary(lvl.L, gamma);
      const r_eff   = lvl.L > 0
        ? effectiveVKConstant(lvl.L, gamma)
        : 0;
      const dbn_stronger = dbn_bdy !== null && dbn_bdy < mt_bdy;
      return {
        label:            lvl.label,
        L:                lvl.L,
        rigorous:         lvl.rigorous,
        dbn_boundary:     dbn_bdy,
        r_eff:            r_eff,
        dbn_stronger:     dbn_stronger,
        // Extra strip excluded by TYPE B beyond what TYPE A already excludes:
        extra_exclusion:
          dbn_bdy !== null && dbn_stronger
            ? +(mt_bdy - dbn_bdy).toFixed(6)
            : null,
      };
    }),
  };
});

// ── Crossover heights ─────────────────────────────────────────────────────────
const OUR_CROSSOVER = crossoverHeightApprox(OUR_LAMBDA);  // ~7.2e13
const PT_CROSSOVER  = crossoverHeightApprox(PT_LAMBDA);   // ~76

// ── Effective VK at the Platt-Trudgian verified height (T = 3e12) ─────────────
const R_EFF_AT_3E12   = effectiveVKConstant(OUR_LAMBDA, 3e12);
const R_RATIO_AT_3E12 = R_EFF_AT_3E12 !== null
  ? +(R_EFF_AT_3E12 / R_MT).toFixed(4)
  : null;

// ── Finite-height projected Lambda bounds from imp-416 ────────────────────────
// FINITE_HEIGHT_LAMBDA_BOUND.ladder carries rows for N in {1e4, 1e5, 1e6}.
// Each row.projection.tc_proj is the OLS-projected |t_c(N)| = a + b/N.
const FINITE_HEIGHT_ROWS = (
  FINITE_HEIGHT_LAMBDA_BOUND.ladder || []
).filter((r) => r.available && r.projection && r.projection.tc_proj > 0)
  .map((r) => {
    const L_N   = r.projection.tc_proj; // projected Lambda at this N
    const T_N   = r.T_star;             // corresponding effective height
    if (!T_N || T_N <= 1) return null;
    const dbn   = dbnBoundary(L_N, T_N);
    const mt    = mtBoundary(T_N);
    const r_eff = effectiveVKConstant(L_N, T_N);
    return {
      N:            r.N,
      T_star:       T_N,
      L_proj:       r.projection.tc_proj,
      dbn_boundary: dbn,
      mt_boundary:  mt,
      dbn_stronger: dbn !== null && dbn < mt,
      r_eff,
      r_mt:         R_MT,
    };
  })
  .filter(Boolean);

// ── Exported record ───────────────────────────────────────────────────────────
export const ZERO_FREE_REGION_FROM_LAMBDA = {
  id:     'imp-418',
  title:  'Downstream consequence: zero-free region tightening from the Lambda bound',
  status: 'delivered',

  // TYPE B parameterization: if Lambda <= L, the strip { sigma > c_param + L * log(|t|/(2*pi)) }
  // is zero-free, with c_param = 1/2 (the critical-line base).
  typeBStrip: {
    formula:   'If Lambda <= L: { sigma > 1/2 + L * log(|t|/(2*pi)) } is zero-free',
    cParam:    OUR_LAMBDA, // c = L directly (the Lambda bound)
    alphaNote: 'Strip width grows as L * log(t), NOT L / log(t)^alpha. '  +
               'The natural parameterization is (c = L, base = 1/2) rather than the TYPE A form.',
    source:    'Heat-flow ODE for H_t zeros (de Bruijn 1950, Csordas-Norfolk-Varga 1986)',
  },

  // TYPE A reference: Mossinghoff-Trudgian 2015
  typeAMT2015: {
    formula:    'zeta(s) != 0 for sigma >= 1 - 1/(R * log|t|)',
    R_constant: R_MT,
    citation:   MT_CITATION,
    rigorLevel: 'unconditional theorem for |t| >= 2',
  },

  // Effective TYPE A constant at the Platt-Trudgian verification height
  effectiveVKAtPTHeight: {
    gamma:         3e12,
    L:             OUR_LAMBDA,
    r_eff:         R_EFF_AT_3E12,
    r_mt:          R_MT,
    r_eff_over_mt: R_RATIO_AT_3E12,
    interpretation:
      'R_eff ~ 0.649 << R_MT = 5.573 at gamma = 3e12: the TYPE B region ' +
      'gives a zero-free half-plane starting at sigma ~ 0.946 while MT only ' +
      'reaches sigma ~ 0.994. TYPE B excludes ~4.8 more percentage points of ' +
      'the strip. Conditioned on Lambda <= 0.0166 and the mean-density approximation.',
  },

  // Crossover heights where TYPE B == TYPE A (approximate)
  crossoverHeights: {
    ourBound: {
      L:              OUR_LAMBDA,
      approxCrossover: OUR_CROSSOVER,
      log10Crossover:  +Math.log10(OUR_CROSSOVER).toFixed(1),
      note:           'For gamma < 10^13.9, our projected bound gives a stronger ' +
                      'zero-free region than MT 2015 (TYPE B subsumes TYPE A).',
    },
    plattTrudgian: {
      L:              PT_LAMBDA,
      approxCrossover: PT_CROSSOVER,
      log10Crossover:  +Math.log10(PT_CROSSOVER).toFixed(1),
      note:           'The PT Lambda = 0.2 TYPE B boundary exits physical range (> 1) ' +
                      'above gamma ~ 76. MT 2015 is stronger than PT TYPE B for gamma > 76.',
    },
  },

  // Comparison table at target heights
  comparisonTable: COMPARISON_TABLE,

  // Projected Lambda values from imp-416 finite-height ladder
  finiteHeightLadder: {
    source:    'imp-416 FINITE_HEIGHT_LAMBDA_BOUND.ladder (N in {1e4, 1e5, 1e6})',
    rows:      FINITE_HEIGHT_ROWS,
    note:      'Each row uses the OLS-projected Lambda |t_c(N)| ~ a + b/N as L ' +
               'and the corresponding effective height T*(N) as gamma. ' +
               'All three projected L values are << R_MT reciprocal, so TYPE B ' +
               'dominates TYPE A across the full projected height range.',
  },

  // Honest assessment
  honestSummary:
    'If Lambda <= 0.0166 (our headline OLS projection), the TYPE B zero-free strip ' +
    'is strictly stronger than the Mossinghoff-Trudgian 2015 TYPE A region for all ' +
    'gamma < 7e13. The effective VK constant at gamma = 3e12 is R_eff ~ 0.649, ' +
    'compared to R_MT = 5.573 (an ~8.6x improvement in zero-free constant). ' +
    'However, this comparison has two important caveats: (1) the MT result is an ' +
    'unconditional theorem for all |t| >= 2, while our bound is a STATISTICAL ' +
    'PROJECTION conditional on the OLS intercept a ~ 0.007 and the open blockers ' +
    'B1, B2, B4 in lambda-zero-attack.js; (2) the TYPE B strip and TYPE A region ' +
    'exclude DIFFERENT parts of the complex plane and are complementary rather than ' +
    'directly comparable -- combined, both are needed to constrain the full strip ' +
    '(1/2, 1). The most honest summary: IF the Lambda chain is rigorized and the ' +
    'Lambda = 0 asymptotic result is established as a theorem, the induced zero-free ' +
    'region would be the entire half-plane {sigma > 1/2} (= RH itself), rendering ' +
    'all finite-L TYPE A comparisons moot.',

  openItems: [
    {
      id:          'density-approximation',
      description: 'The heat-flow formula t_c ~ y0 / log(gamma/(2*pi)) uses the mean ' +
                   'zero density (Poisson-kernel integral). A rigorous version needs an ' +
                   'explicit Selberg-type bound on the local density in [gamma - R, gamma + R].',
    },
    {
      id:          'lambda-chain-rigorous',
      description: 'Until B1, B2, B4 in lambda-zero-attack.js are closed and the measured ' +
                   'Dyson ladder reaches N = 10^4, the headline L = 0.0166 is a statistical ' +
                   'projection, not a theorem. The TYPE B strip inherits this caveat.',
    },
  ],

  sources: [
    'imp-316 bridge-lambda-rh.js (Lambda = 0 iff RH)',
    'imp-416 finite-height-lambda-bound.js (Lambda <= L at finite N)',
    'de Bruijn, Duke Math. J. 17 (1950), 197-226',
    'Csordas, Norfolk, Varga, Trans. AMS 296 (1986), 521-541',
    MT_CITATION,
    PT_CITATION,
  ],
};

// ── Build-time assertions ─────────────────────────────────────────────────────
export const ZERO_FREE_REGION_ASSERTIONS = [
  {
    id:   'imp418-dbn-boundary-in-range-at-1e12',
    holds: () => {
      const b = dbnBoundary(OUR_LAMBDA, 1e12);
      return b !== null && b > 0.5 && b < 1;
    },
    why:  'With Lambda <= 0.0166 at gamma = 1e12, the TYPE B boundary must be in (0.5, 1). ' +
          'Null means the formula exceeded 1 (linearization regime failure).',
  },
  {
    id:   'imp418-dbn-stronger-than-mt-at-1e6',
    holds: () => {
      const dbn = dbnBoundary(OUR_LAMBDA, 1e6);
      const mt  = mtBoundary(1e6);
      return dbn !== null && dbn < mt;
    },
    why:  'At gamma = 1e6, the TYPE B boundary (~ 0.70) must be below the MT boundary (~ 0.987). ' +
          'A failure here means the headline Lambda estimate is too large to outperform MT.',
  },
  {
    id:   'imp418-r-eff-less-than-r-mt-at-1e6',
    holds: () => {
      const r = effectiveVKConstant(OUR_LAMBDA, 1e6);
      return r !== null && r < R_MT;
    },
    why:  'The effective VK constant R_eff at gamma = 1e6 must be less than R_MT = 5.573412, ' +
          'indicating a stronger TYPE A-equivalent zero-free region.',
  },
  {
    id:   'imp418-crossover-above-1e13',
    holds: () => OUR_CROSSOVER > 1e13,
    why:  'The crossover height for our Lambda = 0.0166 must exceed 1e13, ensuring our ' +
          'projected bound outperforms MT 2015 through the Platt-Trudgian height 3e12.',
  },
  {
    id:   'imp418-table-has-four-rows',
    holds: () => COMPARISON_TABLE.length === 4,
    why:  'Comparison table must contain exactly four rows (gamma = 1e3, 1e6, 3e12, 1e20).',
  },
  {
    id:   'imp418-r-eff-at-3e12-less-than-r-mt',
    holds: () => R_EFF_AT_3E12 !== null && R_EFF_AT_3E12 < R_MT,
    why:  'At the Platt-Trudgian height gamma = 3e12, R_eff must be smaller than R_MT. ' +
          'This is the headline comparison between our bound and MT 2015.',
  },
];
