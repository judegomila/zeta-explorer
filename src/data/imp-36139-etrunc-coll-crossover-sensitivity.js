/**
 * @module imp-36139-etrunc-coll-crossover-sensitivity
 *
 * imp-36139 (numerical, measurement): MEASURE the sensitivity of the imp-35968 E_trunc = E_coll
 * crossover height N_cross ~ 3.28e9 (the imp-35337 sigma = 1/2 landmark) to the pinned E_trunc =
 * 3.06e-5 constant (imp-2631) across its fixed-strip uncertainty, quantifying the log-log slope
 * d log N_cross / d log E_trunc.
 *
 * imp-35968 located the E_trunc = E_coll crossover at N_cross ~ 3.280294e9 (log10 N ~ 9.516,
 * sigma ~ 0.4995) using the SINGLE nominal E_trunc = 3.06e-5. The imp-33723 closed-form fixed
 * point N_cross ~ (C_C / E_trunc)^2 * log T0(N_cross) makes N_cross ~ E_trunc^{-2}, so N_cross
 * is HIGHLY sensitive to E_trunc -- but imp-35968 never quantified that sensitivity nor
 * recomputed N_cross across the E_trunc uncertainty. This module re-runs the IDENTICAL imp-35968
 * bisection of E_coll / E_trunc = 1 (same imp-3406 / imp-33582 sub-terms) over a 9-point
 * geometric grid of E_trunc spanning half-to-double the imp-2631 floor -- the SAME representative
 * fixed-strip uncertainty range imp-3443 used for the interior-MAX sensitivity study -- then
 * tabulates N_cross(E_trunc) and fits the log-log slope.
 *
 * WHAT THE SENSITIVITY MEASUREMENT SHOWS (the honest finding).
 *   - The crossover height obeys a CLEAN power law N_cross ~ E_trunc^{-2.095} across the 4x floor
 *     range (OLS d log N_cross / d log E_trunc ~ -2.0953, R^2 ~ 0.9999993; local endpoint slopes
 *     -2.090 at the half-floor edge, -2.101 at the double-floor edge -- barely curving). The
 *     exponent is fractionally STEEPER than the closed-form -2 because the log T0(N_cross) factor
 *     in the imp-33723 fixed point grows as N_cross rises (lowering E_trunc pushes N_cross up,
 *     which enlarges log T0 and adds ~0.095 to the raw -2 elasticity).
 *   - Over the half-to-double floor range the crossover swings ~18.3x in N -- from N_cross ~
 *     1.399e10 (half floor, log10 N ~ 10.15) down to N_cross ~ 7.660e8 (double floor, log10 N ~
 *     8.88), a span of ~1.26 decades in N. The baseline rung reproduces the imp-35968 /
 *     imp-3444-L5 value N_cross ~ 3.280294e9 exactly.
 *   - sigma at the crossover is INVARIANT across the whole grid at sigma ~ 0.4995 (all rungs just
 *     below 1/2, since the tiny positive E_flow pushes the collision share fractionally under one
 *     half) -- so the E_trunc = E_coll balance stays the imp-35337 sigma = 1/2 landmark at every
 *     floor value; only its N-location moves, and it moves ~ E_trunc^{-2}.
 *
 * CONSEQUENCE: the imp-35968 quote N_cross ~ 3.28e9 is a FLOOR-SENSITIVITY READOUT of the
 * specific imp-2631 value, not an intrinsic landmark -- a factor-2 swing in the fixed-strip floor
 * moves the sigma = 1/2 dominance flip by ~1.26 decades. This mirrors the imp-3443 caveat on the
 * interior MAX (elasticity ~ -1.37 there), now made for the far-right crossover (elasticity ~ -2).
 *
 * Measurement only; reuses the pinned imp-3406 / imp-33582 constants and the imp-35968 crossover
 * bisector unchanged (only E_trunc is varied, as an explicit sensitivity sweep); derives no
 * remainder; discharges nothing; changes no bound; establishes no operator positivity; C_C =
 * (1/8) sqrt(3 pi) (imp-2642 / imp-2643) and C_mb GUE-conditional (imp-486) are UNTOUCHED; the
 * nominal E_trunc = 3.06e-5 (imp-2631) baseline is unchanged -- only swept for sensitivity;
 * imp-35337a stays OPEN; NO QED; no refereed bound is changed.
 *
 * @see imp-35968-e-trunc-coll-crossover-location (located N_cross at the single nominal E_trunc)
 * @see imp-33723-sigma-half-vs-crossover-closed-form (the N_cross ~ (C_C/E_trunc)^2 logT0 fixed point)
 * @see imp-3443 (glossary: interior-MAX floor-sensitivity power law, same half-to-double grid)
 * @see lambda-rh-height-mapping.js (effectiveHeightForN: N -> T0 RvM inverse)
 * Literature: Riemann-von Mangoldt counting formula; Platt-Trudgian 2021 (Lambda <= 0.2).
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const L_PT = 0.2; // Platt-Trudgian 2021 bound (unchanged by any measurement here)

// EXACT imp-3406 / imp-33582 sub-terms (identical to imp-35968), but with E_trunc PARAMETERIZED.
const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631) -- the nominal baseline
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP);
function parts(N, Etr) {
  const T0 = effectiveHeightForN(N);
  const L = Math.log(T0);
  const C_F = (Math.log(T0 / TWO_PI) + 1) / TWO_PI; // imp-398 pinned prefactor
  const E_flow = C_F * (L / T0) * GRONWALL;
  const E_coll = C_C_PINNED * Math.sqrt(L / N); // GUE-conditional (C_H)
  const E_N = Etr + E_flow + E_coll;
  return { sigma: E_coll / E_N, logT0: L, E_trunc: Etr, E_flow, E_coll, E_N };
}

// Locate the E_trunc = E_coll crossover for a given E_trunc -- IDENTICAL imp-35968 bisector.
// E_coll = C_C sqrt(log T0 / N) decreases with N while E_trunc is fixed, so the ratio
// E_coll / E_trunc is monotone-decreasing: > 1 below N_cross, < 1 above it.
function locateCrossover(Etr) {
  let a = Math.log(1e4);
  let b = Math.log(1e18);
  for (let i = 0; i < 300; i++) {
    const m = (a + b) / 2;
    const p = parts(Math.exp(m), Etr);
    if (p.E_coll / p.E_trunc > 1) a = m; // still collision-heavy -> go higher
    else b = m;
  }
  return Math.exp((a + b) / 2);
}

// 9-point geometric grid spanning half-to-double the imp-2631 floor (the imp-3443 uncertainty range).
const GRID = [];
for (let i = 0; i < 9; i++) GRID.push(E_TRUNC_PT * Math.pow(2, -1 + i * (2 / 8)));

const ROWS = GRID.map((Etr) => {
  const N = locateCrossover(Etr);
  const p = parts(N, Etr);
  return {
    ratio: +(Etr / E_TRUNC_PT).toFixed(3),
    E_trunc: +Etr.toExponential(4),
    N_cross: +N.toExponential(6),
    log10_N_cross: +Math.log10(N).toFixed(4),
    sigma_at_cross: +p.sigma.toFixed(6),
    _N: N, // raw (assertions only; not exported)
    _Etr: Etr,
  };
});

// OLS log-log slope d log N_cross / d log E_trunc on (ln E_trunc, ln N_cross).
function logLogSlope(rows) {
  const xs = rows.map((r) => Math.log(r._Etr));
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
  (Math.log(ROWS[j]._N) - Math.log(ROWS[i]._N)) / (Math.log(ROWS[j]._Etr) - Math.log(ROWS[i]._Etr));
const LOCAL_SLOPE_LO = localSlope(0, 1); // half-floor edge
const LOCAL_SLOPE_HI = localSlope(7, 8); // double-floor edge

const N_BASE = ROWS[4]._N; // the 1.0x nominal rung -- must reproduce imp-35968
const N_HALF = ROWS[0]._N; // 0.5x floor
const N_DOUBLE = ROWS[8]._N; // 2.0x floor
const N_SWING = N_HALF / N_DOUBLE; // ~18.3x over the 4x floor range
const DECADE_SPAN = Math.log10(N_HALF) - Math.log10(N_DOUBLE); // ~1.26 decades

export const IMP36139_ETRUNC_COLL_CROSSOVER_SENSITIVITY = {
  id: 'imp-36139',
  proofSection: 'S-frontier',
  question:
    'imp-35968 pinned the E_trunc = E_coll crossover (imp-35337 sigma = 1/2 landmark) at N_cross ~ 3.28e9 using ' +
    'the SINGLE nominal E_trunc = 3.06e-5 (imp-2631). The imp-33723 closed form N_cross ~ (C_C/E_trunc)^2 logT0 ' +
    'makes N_cross ~ E_trunc^{-2}, yet that sensitivity was never measured. HOW far does N_cross (and the sigma = ' +
    '1/2 landmark) move across the imp-2631 fixed-strip uncertainty, and what is d log N_cross / d log E_trunc?',
  method:
    'Re-run the IDENTICAL imp-35968 bisection of E_coll / E_trunc = 1 on the exact imp-3406 / imp-33582 sub-terms ' +
    '(E_flow = C_F (log T0 / T0) exp|t_c|; E_coll = C_C sqrt(log T0 / N)) with E_trunc PARAMETERIZED over a 9-point ' +
    'geometric grid spanning half-to-double the imp-2631 floor (the same range imp-3443 used for the interior-MAX ' +
    'study). Tabulate N_cross(E_trunc), log10 N_cross and sigma at each rung, then OLS-fit the log-log slope ' +
    'd log N_cross / d log E_trunc and bracket it with local endpoint slopes.',
  E_trunc_baseline: +E_TRUNC_PT.toExponential(4),
  gridRange: '0.5x to 2.0x the imp-2631 floor (9-point geometric, matching imp-3443)',
  N_cross_baseline: +N_BASE.toExponential(6), // reproduces imp-35968 / imp-3444-L5 ~ 3.280294e9
  N_cross_halfFloor: +N_HALF.toExponential(6),
  N_cross_doubleFloor: +N_DOUBLE.toExponential(6),
  N_cross_swing_x: +N_SWING.toFixed(4), // ~18.3x over the 4x floor range
  decadeSpan_log10N: +DECADE_SPAN.toFixed(4), // ~1.26 decades
  dlogNcross_dlogEtrunc_OLS: +SLOPE.toFixed(6), // ~ -2.0953 (steeper than closed-form -2)
  slope_R2: +SLOPE_R2.toFixed(8), // ~0.9999993: clean power law
  localSlope_halfFloorEdge: +LOCAL_SLOPE_LO.toFixed(6), // ~ -2.090
  localSlope_doubleFloorEdge: +LOCAL_SLOPE_HI.toFixed(6), // ~ -2.101
  closedFormExponent: -2, // imp-33723 leading N_cross ~ E_trunc^{-2}
  excessOverClosedForm: +(SLOPE - -2).toFixed(6), // ~ -0.095: the logT0(N_cross) drift contribution
  sigma_at_cross_invariant: +ROWS[4].sigma_at_cross, // ~0.4995 at every rung
  grid: ROWS.map((r) => ({
    ratio: r.ratio,
    E_trunc: r.E_trunc,
    N_cross: r.N_cross,
    log10_N_cross: r.log10_N_cross,
    sigma_at_cross: r.sigma_at_cross,
  })),
  isRigorous: false,
  isUnconditional: false,
  verdict:
    'MEASUREMENT (NOT rigorous). Sweeping E_trunc over a 9-point half-to-double grid and re-running the imp-35968 ' +
    'E_coll = E_trunc bisector shows the crossover height obeys a CLEAN power law N_cross ~ E_trunc^{' +
    SLOPE.toFixed(3) + '} (OLS R^2 ~ ' + SLOPE_R2.toFixed(6) + '; local slopes ' + LOCAL_SLOPE_LO.toFixed(3) +
    ' and ' + LOCAL_SLOPE_HI.toFixed(3) + ' at the two edges). The exponent is fractionally STEEPER than the ' +
    'imp-33723 closed-form -2 because log T0(N_cross) grows as N_cross rises (lowering E_trunc pushes N_cross up, ' +
    'enlarging log T0 and adding ~' + Math.abs(SLOPE - -2).toFixed(3) + ' to the raw -2 elasticity). Over the 4x ' +
    'floor range the crossover swings ~' + N_SWING.toFixed(1) + 'x -- from N_cross ~ ' + N_HALF.toExponential(3) +
    ' (half floor) down to ~' + N_DOUBLE.toExponential(3) + ' (double floor), a span of ~' + DECADE_SPAN.toFixed(2) +
    ' decades; the baseline rung reproduces imp-35968 exactly (N_cross ~ ' + N_BASE.toExponential(4) + '). sigma at ' +
    'the crossover stays ~' + ROWS[4].sigma_at_cross.toFixed(4) + ' (just below 1/2) at EVERY rung, so the balance ' +
    'remains the imp-35337 sigma = 1/2 landmark at all floor values -- only its N-location moves, ~ E_trunc^{-2}. ' +
    'So the imp-35968 quote N_cross ~ 3.28e9 is a FLOOR-SENSITIVITY READOUT of the specific imp-2631 value, not an ' +
    'intrinsic landmark (mirroring the imp-3443 interior-MAX caveat). Measurement only; reuses the pinned imp-3406 ' +
    '/ imp-33582 constants and the imp-35968 bisector unchanged (only E_trunc is swept); derives no remainder; ' +
    'discharges nothing; changes no bound; establishes no operator positivity; C_C = (1/8) sqrt(3 pi) (imp-2642 / ' +
    'imp-2643) and C_mb GUE-conditional (imp-486) are UNTOUCHED; the nominal E_trunc = 3.06e-5 (imp-2631) baseline ' +
    'is unchanged; imp-35337a stays OPEN; no RH verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-35968 (located N_cross at the single nominal E_trunc, reused bisector); imp-33723 (N_cross ~ (C_C/E_trunc)^2 ' +
    'logT0 closed form -> E_trunc^{-2}); imp-3443 (interior-MAX floor-sensitivity power law, same half-to-double ' +
    'grid); imp-3444 (L5 landmark N_cross ~ 3.280294e9); imp-33582 (sigma-decay model); imp-3220 / imp-3406 (RvM ' +
    'surrogate log-height); imp-2642 / imp-2643 (C_C = (1/8) sqrt(3 pi)); imp-2631 (E_trunc fixed-strip floor); ' +
    'imp-486 (GUE-conditional caveat). Literature: Riemann-von Mangoldt counting formula; Platt-Trudgian 2021 ' +
    '(Lambda <= 0.2).',
};

export const IMP36139_ETRUNC_COLL_CROSSOVER_SENSITIVITY_ASSERTIONS = [
  {
    // (1) baseline rung reproduces the imp-35968 / imp-3444-L5 crossover at the nominal E_trunc.
    id: 'imp36139-baseline-reproduces-imp35968',
    description: 'the 1.0x nominal rung reproduces imp-35968 N_cross ~ 3.280294e9 (same bisector, same sub-terms)',
    holds: () => Math.abs(N_BASE / 3.280294e9 - 1) < 1e-3,
  },
  {
    // (2) the crossover height obeys a clean power law: OLS R^2 essentially 1.
    id: 'imp36139-clean-power-law',
    description: 'N_cross vs E_trunc is a clean log-log power law (R^2 > 0.9999)',
    holds: () => SLOPE_R2 > 0.9999,
  },
  {
    // (3) the log-log slope is ~ -2.095, near (but fractionally steeper than) the closed-form -2.
    id: 'imp36139-slope-near-minus-two',
    description: 'd log N_cross / d log E_trunc ~ -2.095, close to the imp-33723 closed-form -2',
    holds: () => Math.abs(SLOPE - -2.0953) < 0.02 && Math.abs(SLOPE - -2) < 0.2,
  },
  {
    // (4) the slope is STEEPER than -2 (more negative), from the logT0(N_cross) growth term.
    id: 'imp36139-steeper-than-closed-form',
    description: 'slope < -2 (steeper): the logT0(N_cross) drift adds to the raw -2 elasticity',
    holds: () => SLOPE < -2 && SLOPE > -2.2 && LOCAL_SLOPE_LO < -2 && LOCAL_SLOPE_HI < -2,
  },
  {
    // (5) N_cross is monotone-decreasing in E_trunc and swings ~18x over the 4x floor range.
    id: 'imp36139-monotone-and-swing',
    description: 'N_cross decreases monotonically with E_trunc; ~18x swing (~1.26 decades) over half-to-double',
    holds: () => {
      for (let i = 1; i < ROWS.length; i++) if (!(ROWS[i]._N < ROWS[i - 1]._N)) return false;
      return Math.abs(N_SWING / 18.26 - 1) < 0.05 && Math.abs(DECADE_SPAN - 1.2615) < 0.05;
    },
  },
  {
    // (6) sigma at the crossover is invariant ~0.4995 (just below 1/2) across every rung -- still the sigma=1/2 landmark.
    id: 'imp36139-sigma-invariant-at-half',
    description: 'sigma at the crossover ~0.4995 (just below 1/2) at every floor rung -- the imp-35337 sigma=1/2 landmark',
    holds: () => ROWS.every((r) => Math.abs(r.sigma_at_cross - 0.5) < 2e-3 && r.sigma_at_cross < 0.5),
  },
  {
    // (7) honesty gate: measurement only, conditional, no bound moves, imp-486 kept, imp-35337a OPEN, no refereed bound is changed, NO QED.
    id: 'imp36139-measurement-only-no-qed',
    description: 'measurement only: not rigorous/unconditional, changes no bound, keeps imp-486 caveat, imp-35337a OPEN, PT 0.2, NO QED',
    holds: () => {
      const r = IMP36139_ETRUNC_COLL_CROSSOVER_SENSITIVITY;
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

for (const a of IMP36139_ETRUNC_COLL_CROSSOVER_SENSITIVITY_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-36139-etrunc-coll-crossover-sensitivity assertion failed: ${a.id}`);
  }
}
