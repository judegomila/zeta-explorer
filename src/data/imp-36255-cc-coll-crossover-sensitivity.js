/**
 * @module imp-36255-cc-coll-crossover-sensitivity
 *
 * imp-36255 (numerical, measurement): MEASURE the sensitivity of the imp-35968 / imp-36139
 * E_trunc = E_coll crossover height N_cross ~ 3.28e9 (the imp-35337 sigma = 1/2 landmark) to the
 * pinned collision constant C_C = (1/8) sqrt(3 pi) ~ 0.3837 (imp-2642 / imp-2643), quantifying the
 * log-log slope d log N_cross / d log C_C and confirming the closed-form +2 elasticity predicted by
 * the imp-33723 N_cross ~ (C_C / E_trunc)^2 log T0(N_cross) fixed point.
 *
 * imp-36139 measured N_cross's sensitivity to E_trunc (slope ~ -2.095, steeper than the closed-form
 * -2 because log T0(N_cross) grows as N_cross rises). But the imp-33723 fixed point
 * N_cross ~ (C_C / E_trunc)^2 log T0(N_cross) is EQUALLY sensitive to C_C in the OPPOSITE direction:
 * raising C_C raises E_coll, pushing the E_coll = E_trunc balance to LARGER N. That C_C-elasticity
 * was never measured. This module re-runs the IDENTICAL imp-35968 / imp-36139 bisection of
 * E_coll / E_trunc = 1 (same imp-3406 / imp-33582 sub-terms) over a 9-point geometric grid of C_C
 * spanning half-to-double the imp-2642 value -- the SAME representative range imp-36139 / imp-3443
 * used for the E_trunc study -- then tabulates N_cross(C_C) and fits the log-log slope.
 *
 * WHAT THE SENSITIVITY MEASUREMENT SHOWS (the honest finding).
 *   - The crossover height obeys a CLEAN power law N_cross ~ C_C^{+2.095} across the 4x C_C range
 *     (OLS d log N_cross / d log C_C ~ +2.0953, R^2 ~ 0.9999993; local endpoint slopes +2.101 at
 *     the half-C_C edge, +2.090 at the double-C_C edge -- barely curving). The exponent is
 *     fractionally STEEPER than the closed-form +2 because the log T0(N_cross) factor in the
 *     imp-33723 fixed point grows as N_cross rises (raising C_C pushes N_cross up, which enlarges
 *     log T0 and adds ~0.095 to the raw +2 elasticity). This is the EXACT MIRROR of the imp-36139
 *     E_trunc-elasticity -2.095: N_cross ~ (C_C / E_trunc)^2 makes the two constants equal-and-
 *     opposite levers on the crossover height.
 *   - Over the half-to-double C_C range the crossover swings ~18.3x in N -- from N_cross ~
 *     7.660e8 (half C_C, log10 N ~ 8.88) up to N_cross ~ 1.399e10 (double C_C, log10 N ~ 10.15),
 *     a span of ~1.26 decades in N. The baseline rung reproduces the imp-35968 / imp-36139 /
 *     imp-3444-L5 value N_cross ~ 3.280294e9 exactly.
 *   - sigma at the crossover stays the imp-35337 sigma = 1/2 landmark across the whole grid
 *     (sigma ~ 0.4984 to 0.4999, all rungs just below 1/2 since the tiny positive E_flow pushes the
 *     collision share fractionally under one half) -- so the E_coll = E_trunc balance remains the
 *     sigma = 1/2 landmark at every C_C value; only its N-location moves, and it moves ~ C_C^{+2}.
 *
 * CONSEQUENCE: the imp-35968 quote N_cross ~ 3.28e9 is EQUALLY a readout of the pinned imp-2642
 * collision constant as of the imp-2631 fixed-strip floor -- a factor-2 swing in C_C moves the
 * sigma = 1/2 dominance flip by the same ~1.26 decades (opposite direction) that a factor-2 swing
 * in E_trunc does. The imp-33723 (C_C / E_trunc)^2 fixed point is confirmed on BOTH of its levers.
 *
 * Measurement only; reuses the pinned imp-3406 / imp-33582 constants and the imp-35968 / imp-36139
 * crossover bisector unchanged (only C_C is varied, as an explicit sensitivity sweep); derives no
 * remainder; discharges nothing; changes no bound; establishes no operator positivity; the nominal
 * C_C = (1/8) sqrt(3 pi) (imp-2642 / imp-2643) is UNCHANGED -- only swept for sensitivity; C_C and
 * C_mb GUE-conditional (imp-486) are UNTOUCHED; E_trunc = 3.06e-5 (imp-2631) baseline is unchanged;
 * imp-35337a stays OPEN; NO QED; no refereed bound is changed.
 *
 * @see imp-36139-etrunc-coll-crossover-sensitivity (the E_trunc-elasticity -2.095; mirror of this)
 * @see imp-35968-e-trunc-coll-crossover-location (located N_cross at the single nominal constants)
 * @see imp-33723-sigma-half-vs-crossover-closed-form (the N_cross ~ (C_C/E_trunc)^2 logT0 fixed point)
 * @see polymath15-constant-C-C.js (C_C_PINNED = (1/8) sqrt(3 pi); imp-2642 / imp-2643)
 * @see lambda-rh-height-mapping.js (effectiveHeightForN: N -> T0 RvM inverse)
 * Literature: Riemann-von Mangoldt counting formula; Platt-Trudgian 2021 (Lambda <= 0.2).
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const L_PT = 0.2; // Platt-Trudgian 2021 bound (unchanged by any measurement here)

// EXACT imp-3406 / imp-33582 sub-terms (identical to imp-35968 / imp-36139), but with C_C PARAMETERIZED.
const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631) -- fixed here
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP);
function parts(N, Cc) {
  const T0 = effectiveHeightForN(N);
  const L = Math.log(T0);
  const C_F = (Math.log(T0 / TWO_PI) + 1) / TWO_PI; // imp-398 pinned prefactor
  const E_flow = C_F * (L / T0) * GRONWALL;
  const E_coll = Cc * Math.sqrt(L / N); // GUE-conditional (C_H); C_C parameterized
  const E_N = E_TRUNC_PT + E_flow + E_coll;
  return { sigma: E_coll / E_N, logT0: L, E_trunc: E_TRUNC_PT, E_flow, E_coll, E_N };
}

// Locate the E_trunc = E_coll crossover for a given C_C -- IDENTICAL imp-35968 / imp-36139 bisector.
// E_coll = C_C sqrt(log T0 / N) decreases with N while E_trunc is fixed, so the ratio
// E_coll / E_trunc is monotone-decreasing: > 1 below N_cross, < 1 above it.
function locateCrossover(Cc) {
  let a = Math.log(1e4);
  let b = Math.log(1e18);
  for (let i = 0; i < 300; i++) {
    const m = (a + b) / 2;
    const p = parts(Math.exp(m), Cc);
    if (p.E_coll / p.E_trunc > 1) a = m; // still collision-heavy -> go higher
    else b = m;
  }
  return Math.exp((a + b) / 2);
}

// 9-point geometric grid spanning half-to-double the imp-2642 collision constant (the imp-3443 range).
const GRID = [];
for (let i = 0; i < 9; i++) GRID.push(C_C_PINNED * Math.pow(2, -1 + i * (2 / 8)));

const ROWS = GRID.map((Cc) => {
  const N = locateCrossover(Cc);
  const p = parts(N, Cc);
  return {
    ratio: +(Cc / C_C_PINNED).toFixed(3),
    C_C: +Cc.toExponential(4),
    N_cross: +N.toExponential(6),
    log10_N_cross: +Math.log10(N).toFixed(4),
    sigma_at_cross: +p.sigma.toFixed(6),
    _N: N, // raw (assertions only; not exported)
    _Cc: Cc,
  };
});

// OLS log-log slope d log N_cross / d log C_C on (ln C_C, ln N_cross).
function logLogSlope(rows) {
  const xs = rows.map((r) => Math.log(r._Cc));
  const ys = rows.map((r) => Math.log(r._N));
  const n = xs.length;
  const mx = xs.reduce((a, b) => a + b, 0) / n;
  const my = ys.reduce((a, b) => a + b, 0) / n;
  let sxy = 0;
  let sxx = 0;
  for (let i = 0; i < n; i++) {
    sxy += (xs[i] - mx) * (ys[i] - my);
    sxx += (xs[i] - mx) * (xs[i] - mx);
  }
  const slope = sxy / sxx;
  const yhat = xs.map((x) => my + slope * (x - mx));
  let ssr = 0;
  let sst = 0;
  for (let i = 0; i < n; i++) {
    ssr += (ys[i] - yhat[i]) * (ys[i] - yhat[i]);
    sst += (ys[i] - my) * (ys[i] - my);
  }
  return { slope, R2: 1 - ssr / sst };
}
const { slope: SLOPE, R2: SLOPE_R2 } = logLogSlope(ROWS);

// Local endpoint slopes (bracket the small curvature away from the OLS mean slope).
const localSlope = (i, j) =>
  (Math.log(ROWS[j]._N) - Math.log(ROWS[i]._N)) / (Math.log(ROWS[j]._Cc) - Math.log(ROWS[i]._Cc));
const LOCAL_SLOPE_LO = localSlope(0, 1); // half-C_C edge
const LOCAL_SLOPE_HI = localSlope(7, 8); // double-C_C edge

const N_BASE = ROWS[4]._N; // the 1.0x nominal rung -- must reproduce imp-35968 / imp-36139
const N_HALF = ROWS[0]._N; // 0.5x C_C
const N_DOUBLE = ROWS[8]._N; // 2.0x C_C
const N_SWING = N_DOUBLE / N_HALF; // ~18.3x over the 4x C_C range (N rises WITH C_C)
const DECADE_SPAN = Math.log10(N_DOUBLE) - Math.log10(N_HALF); // ~1.26 decades

export const IMP36255_CC_COLL_CROSSOVER_SENSITIVITY = {
  id: 'imp-36255',
  proofSection: 'S-frontier',
  question:
    'imp-36139 measured the E_trunc-elasticity of the E_trunc = E_coll crossover (imp-35337 sigma = 1/2 landmark) ' +
    'at N_cross ~ 3.28e9 (slope ~ -2.095). The imp-33723 closed form N_cross ~ (C_C/E_trunc)^2 logT0 makes N_cross ' +
    'EQUALLY sensitive to C_C in the OPPOSITE direction, yet that C_C-elasticity was never measured. HOW far does ' +
    'N_cross (and the sigma = 1/2 landmark) move across a half-to-double sweep of the imp-2642 collision constant, ' +
    'and what is d log N_cross / d log C_C -- does it confirm the closed-form +2?',
  method:
    'Re-run the IDENTICAL imp-35968 / imp-36139 bisection of E_coll / E_trunc = 1 on the exact imp-3406 / imp-33582 ' +
    'sub-terms (E_flow = C_F (log T0 / T0) exp|t_c|; E_coll = C_C sqrt(log T0 / N)) with C_C PARAMETERIZED over a ' +
    '9-point geometric grid spanning half-to-double the imp-2642 value (the same range imp-36139 / imp-3443 used ' +
    'for E_trunc). Tabulate N_cross(C_C), log10 N_cross and sigma at each rung, then OLS-fit the log-log slope ' +
    'd log N_cross / d log C_C and bracket it with local endpoint slopes.',
  C_C_baseline: +C_C_PINNED.toExponential(4), // (1/8) sqrt(3 pi) ~ 0.3837 (imp-2642 / imp-2643)
  gridRange: '0.5x to 2.0x the imp-2642 collision constant (9-point geometric, matching imp-36139 / imp-3443)',
  N_cross_baseline: +N_BASE.toExponential(6), // reproduces imp-35968 / imp-36139 / imp-3444-L5 ~ 3.280294e9
  N_cross_halfCC: +N_HALF.toExponential(6),
  N_cross_doubleCC: +N_DOUBLE.toExponential(6),
  N_cross_swing_x: +N_SWING.toFixed(4), // ~18.3x over the 4x C_C range
  decadeSpan_log10N: +DECADE_SPAN.toFixed(4), // ~1.26 decades
  dlogNcross_dlogCC_OLS: +SLOPE.toFixed(6), // ~ +2.0953 (steeper than closed-form +2)
  slope_R2: +SLOPE_R2.toFixed(8), // ~0.9999993: clean power law
  localSlope_halfCCEdge: +LOCAL_SLOPE_LO.toFixed(6), // ~ +2.101
  localSlope_doubleCCEdge: +LOCAL_SLOPE_HI.toFixed(6), // ~ +2.090
  closedFormExponent: 2, // imp-33723 leading N_cross ~ C_C^{+2}
  excessOverClosedForm: +(SLOPE - 2).toFixed(6), // ~ +0.095: the logT0(N_cross) drift contribution
  etruncElasticityMirror: -2.0953, // imp-36139 d log N_cross / d log E_trunc -- equal-and-opposite lever
  sigma_at_cross_baseline: +ROWS[4].sigma_at_cross, // ~0.4995 at the nominal rung
  grid: ROWS.map((r) => ({
    ratio: r.ratio,
    C_C: r.C_C,
    N_cross: r.N_cross,
    log10_N_cross: r.log10_N_cross,
    sigma_at_cross: r.sigma_at_cross,
  })),
  isRigorous: false,
  isUnconditional: false,
  verdict:
    'MEASUREMENT (NOT rigorous). Sweeping C_C over a 9-point half-to-double grid and re-running the imp-35968 / ' +
    'imp-36139 E_coll = E_trunc bisector shows the crossover height obeys a CLEAN power law N_cross ~ C_C^{' +
    SLOPE.toFixed(3) + '} (OLS R^2 ~ ' + SLOPE_R2.toFixed(6) + '; local slopes ' + LOCAL_SLOPE_LO.toFixed(3) +
    ' and ' + LOCAL_SLOPE_HI.toFixed(3) + ' at the two edges). The exponent CONFIRMS the imp-33723 closed-form ' +
    '+2 elasticity (N_cross ~ (C_C/E_trunc)^2), fractionally STEEPER because log T0(N_cross) grows as N_cross rises ' +
    '(raising C_C pushes N_cross up, enlarging log T0 and adding ~' + Math.abs(SLOPE - 2).toFixed(3) + ' to the raw ' +
    '+2 elasticity). This is the EXACT MIRROR of the imp-36139 E_trunc-elasticity -2.095: the two constants are ' +
    'equal-and-opposite levers on the crossover. Over the 4x C_C range the crossover swings ~' + N_SWING.toFixed(1) +
    'x -- from N_cross ~ ' + N_HALF.toExponential(3) + ' (half C_C) up to ~' + N_DOUBLE.toExponential(3) +
    ' (double C_C), a span of ~' + DECADE_SPAN.toFixed(2) + ' decades; the baseline rung reproduces imp-35968 / ' +
    'imp-36139 exactly (N_cross ~ ' + N_BASE.toExponential(4) + '). sigma at the crossover stays just below 1/2 ' +
    '(~0.4984 to 0.4999) at EVERY rung, so the balance remains the imp-35337 sigma = 1/2 landmark at all C_C values ' +
    '-- only its N-location moves, ~ C_C^{+2}. So the imp-35968 quote N_cross ~ 3.28e9 is EQUALLY a readout of the ' +
    'pinned imp-2642 collision constant as of the imp-2631 fixed-strip floor; the imp-33723 (C_C/E_trunc)^2 fixed ' +
    'point is confirmed on BOTH levers. Measurement only; reuses the pinned imp-3406 / imp-33582 constants and the ' +
    'imp-35968 / imp-36139 bisector unchanged (only C_C is swept); derives no remainder; discharges nothing; ' +
    'changes no bound; establishes no operator positivity; the nominal C_C = (1/8) sqrt(3 pi) (imp-2642 / imp-2643) ' +
    'and C_mb GUE-conditional (imp-486) are UNTOUCHED; E_trunc = 3.06e-5 (imp-2631) is unchanged; imp-35337a stays ' +
    'OPEN; no RH verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-36139 (E_trunc-elasticity -2.095, mirror of this C_C-elasticity; reused bisector/grid); imp-35968 (located ' +
    'N_cross at the single nominal constants); imp-33723 (N_cross ~ (C_C/E_trunc)^2 logT0 closed form -> C_C^{+2}); ' +
    'imp-3443 (interior-MAX floor-sensitivity power law, same half-to-double grid); imp-3444 (L5 landmark N_cross ~ ' +
    '3.280294e9); imp-33582 (sigma-decay model); imp-3220 / imp-3406 (RvM surrogate log-height); imp-2642 / ' +
    'imp-2643 (C_C = (1/8) sqrt(3 pi)); imp-2631 (E_trunc fixed-strip floor); imp-486 (GUE-conditional caveat). ' +
    'Literature: Riemann-von Mangoldt counting formula; Platt-Trudgian 2021 (Lambda <= 0.2).',
};

export const IMP36255_CC_COLL_CROSSOVER_SENSITIVITY_ASSERTIONS = [
  {
    // (1) baseline rung reproduces the imp-35968 / imp-36139 / imp-3444-L5 crossover at the nominal C_C.
    id: 'imp36255-baseline-reproduces-imp35968',
    description: 'the 1.0x nominal rung reproduces imp-35968 / imp-36139 N_cross ~ 3.280294e9 (same bisector, same sub-terms)',
    holds: () => Math.abs(N_BASE / 3.280294e9 - 1) < 1e-3,
  },
  {
    // (2) the crossover height obeys a clean power law: OLS R^2 essentially 1.
    id: 'imp36255-clean-power-law',
    description: 'N_cross vs C_C is a clean log-log power law (R^2 > 0.9999)',
    holds: () => SLOPE_R2 > 0.9999,
  },
  {
    // (3) the log-log slope is ~ +2.095, confirming the imp-33723 closed-form +2 elasticity.
    id: 'imp36255-slope-near-plus-two',
    description: 'd log N_cross / d log C_C ~ +2.095, confirming the imp-33723 closed-form +2',
    holds: () => Math.abs(SLOPE - 2.0953) < 0.02 && Math.abs(SLOPE - 2) < 0.2,
  },
  {
    // (4) the slope is STEEPER than +2 (more positive), from the logT0(N_cross) growth term.
    id: 'imp36255-steeper-than-closed-form',
    description: 'slope > +2 (steeper): the logT0(N_cross) drift adds to the raw +2 elasticity',
    holds: () => SLOPE > 2 && SLOPE < 2.2 && LOCAL_SLOPE_LO > 2 && LOCAL_SLOPE_HI > 2,
  },
  {
    // (5) N_cross is monotone-INCREASING in C_C and swings ~18x over the 4x C_C range.
    id: 'imp36255-monotone-and-swing',
    description: 'N_cross increases monotonically with C_C; ~18x swing (~1.26 decades) over half-to-double',
    holds: () => {
      for (let i = 1; i < ROWS.length; i++) if (!(ROWS[i]._N > ROWS[i - 1]._N)) return false;
      return Math.abs(N_SWING / 18.26 - 1) < 0.05 && Math.abs(DECADE_SPAN - 1.2615) < 0.05;
    },
  },
  {
    // (6) the C_C elasticity is the equal-and-opposite mirror of the imp-36139 E_trunc elasticity -2.095.
    id: 'imp36255-mirror-of-etrunc-elasticity',
    description: 'd log N_cross / d log C_C ~ -(d log N_cross / d log E_trunc): the (C_C/E_trunc)^2 equal-opposite lever',
    holds: () => Math.abs(SLOPE - -(-2.0953)) < 0.01,
  },
  {
    // (7) sigma at the crossover stays just below 1/2 across every rung -- still the sigma=1/2 landmark.
    id: 'imp36255-sigma-invariant-at-half',
    description: 'sigma at the crossover ~0.498-0.500 (just below 1/2) at every C_C rung -- the imp-35337 sigma=1/2 landmark',
    holds: () => ROWS.every((r) => Math.abs(r.sigma_at_cross - 0.5) < 2e-3 && r.sigma_at_cross < 0.5),
  },
  {
    // (8) honesty gate: measurement only, conditional, no bound moves, imp-486 kept, imp-35337a OPEN, no refereed bound is changed, NO QED.
    id: 'imp36255-measurement-only-no-qed',
    description: 'measurement only: not rigorous/unconditional, changes no bound, keeps imp-486 caveat, imp-35337a OPEN, PT 0.2, NO QED',
    holds: () => {
      const r = IMP36255_CC_COLL_CROSSOVER_SENSITIVITY;
      return (
        Math.abs(L_PT - 0.2) < 1e-15 &&
        r.isRigorous === false &&
        r.isUnconditional === false &&
        /imp-486/.test(r.verdict) &&
        /imp-35337a\s+stays\s+OPEN/.test(r.verdict) &&
        /NO QED/.test(r.verdict) &&
        /refereed bound is changed/i.test(r.verdict)
      );
    },
  },
];

for (const a of IMP36255_CC_COLL_CROSSOVER_SENSITIVITY_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-36255-cc-coll-crossover-sensitivity assertion failed: ${a.id}`);
  }
}
