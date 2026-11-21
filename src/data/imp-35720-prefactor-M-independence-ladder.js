/**
 * @module imp-35720-prefactor-M-independence-ladder
 *
 * imp-35720 (numerical, measurement): TABULATE the imp-35696 collision-scale
 * amplitude prefactor ratio prefCC/prefStd = ((pi^2/3)/C_C)^{1/3} ~ 2.047 across
 * the SAME power-of-ten gap-count ladder M in {10, 1e2, 1e4, 1e6, 1e8} that
 * imp-35695 used, and confirm it is FLAT (M-independent) -- a pure amplitude that
 * never touches the M-exponent -- while the imp-35695 reciprocal resolution-floor
 * factor M^{1/3} scales one order of magnitude per three decades of M.
 *
 * THE SEPARATION. Under GUE cubic (beta = 2) level repulsion the smallest of M
 * consecutive gaps solves the extreme-value balance M F(s_min) = 1 with
 * F(s) = c s^3 / 3, giving s_min(M; c) = (3 / (c M))^{1/3} = (3/c)^{1/3} M^{-1/3}
 * (imp-35696). Two things live in that one expression:
 *   - the M-EXPONENT (-1/3), fixed by the cubic-repulsion POWER, coefficient-free;
 *   - the AMPLITUDE prefactor (3/c)^{1/3}, fixed by the density coefficient c.
 * The RATIO of the two coefficient readings (standard c = pi^2/3 vs c = C_C) at a
 * FIXED M is
 *   s_min(M; C_C) / s_min(M; pi^2/3) = ( (3/C_C) / (3/(pi^2/3)) )^{1/3}
 *                                    = ( (pi^2/3) / C_C )^{1/3} ~ 2.047,
 * in which M CANCELS EXACTLY -- the prefactor ratio is the same at every rung of
 * the ladder. imp-35696 stated this cube-root prefactor (prefCC/prefStd ~ 2.047)
 * but never tabulated it against M alongside the imp-35695 floor factor M^{1/3},
 * so the amplitude-vs-exponent split was never shown side by side, numerically.
 *
 * WHAT THIS MODULE MEASURES. For each M on the imp-35695 ladder it recomputes
 * s_min(M; c) by BISECTION on M F(s) = 1 (NOT the closed form) for both
 * c = pi^2/3 and c = C_C, forms the per-rung prefactor ratio, and reports:
 *   - the ratio is flat at ((pi^2/3)/C_C)^{1/3} ~ 2.047 to ~machine precision
 *     (max relative spread across the ladder ~ 0, a few ULP);
 *   - its log-log slope against M is ~ 0 (the exponent is untouched by amplitude);
 *   - in the SAME rows the imp-35695 floor factor M^{1/3} climbs 2.15x -> 464x with
 *     a log-log slope of exactly 1/3.
 * Amplitude (flat, from the coefficient) and exponent (M^{1/3}, from the power)
 * are thereby separated on one shared ladder.
 *
 * Measurement only; confirms the imp-35696 characterisation quantitatively;
 * derives no remainder; discharges nothing; changes no bound; establishes no
 * operator positivity; C_C = (1/8) sqrt(3 pi) (imp-2642/imp-2643), C_H = 1/8,
 * E_trunc = 3.06e-5 (imp-2631) and C_mb GUE-conditional (imp-486) are UNTOUCHED;
 * imp-35337a stays OPEN; NO QED; no refereed bound is changed.
 *
 * @see imp-35696-collision-exponent-consistency-check (states prefCC/prefStd = ((pi^2/3)/C_C)^{1/3} ~ 2.047, never laddered)
 * @see imp-35695-resolution-floor-factor-M-ladder (the reciprocal floor factor M^{1/3} this is contrasted against)
 * @see imp-35680-constant-mismatch-magnitude (the amplitude mismatch ratio (pi^2/3)/C_C ~ 8.573 whose cube root this is)
 * @see imp-2642/imp-2643 (C_C = (1/8) sqrt(3 pi), C_H = 1/8)
 * Literature: Montgomery (1973); Rudnick-Sarnak (1996); Ben Arous-Bourgade
 * (2013, smallest GUE gaps ~ n^{-4/3}). Platt-Trudgian 2021 (T_PT = 3e12).
 */

import { IMP35695_RESOLUTION_FLOOR_FACTOR_M_LADDER } from './imp-35695-resolution-floor-factor-M-ladder.js';
import { IMP35696_COLLISION_EXPONENT_CONSISTENCY_CHECK } from './imp-35696-collision-exponent-consistency-check.js';

const L_PT = 0.2; // Platt-Trudgian 2021 bound (unchanged by any measurement here)

// Short-range collision constant (imp-2642/imp-2643 ansatz, C_H = 1/8).
const C_C = (1 / 8) * Math.sqrt(3 * Math.PI); // ~ 0.38374752
// Standard GUE small-gap density coefficient p(s) ~ (pi^2/3) s^2 (imp-35680 curvature).
const C_STD = (Math.PI * Math.PI) / 3; // ~ 3.28987

// Cumulative of the model small-gap density p(s) = c s^2: F(s) = c s^3 / 3.
const cumulative = (s, c) => (c * s * s * s) / 3;

// Smallest of M consecutive gaps under p(s) = c s^2, solved by BISECTION on the
// extreme-value balance M F(s_min) = 1 (NOT the closed form), so the per-rung
// prefactor ratio is genuinely measured, not substituted. (Same solver as imp-35696.)
function sMinNumeric(M, c) {
  let lo = 0;
  let hi = 1;
  while (M * cumulative(hi, c) < 1) hi *= 2; // bracket the root
  for (let i = 0; i < 200; i++) {
    const mid = (lo + hi) / 2;
    if (M * cumulative(mid, c) < 1) lo = mid;
    else hi = mid;
  }
  return (lo + hi) / 2;
}

// The exact analytic target: the prefactor ratio in which M cancels.
const PREF_RATIO_TARGET = Math.cbrt(C_STD / C_C); // = ((pi^2/3)/C_C)^{1/3} ~ 2.0466534

// Clean power-of-ten gap-count ladder -- identical to imp-35695.
const M_LADDER = [10, 1e2, 1e4, 1e6, 1e8];

const rows = M_LADDER.map((M) => {
  const sMinStd = sMinNumeric(M, C_STD);
  const sMinCC = sMinNumeric(M, C_C);
  return {
    M,
    logM: +Math.log10(M).toFixed(4),
    // Bisection-measured amplitude prefactor ratio at this rung (M cancels -> flat).
    prefactorRatio: +(sMinCC / sMinStd).toPrecision(10), // ~ 2.0466534 at every M
    // imp-35695 reciprocal resolution-floor factor M^{1/3} at the SAME rung (scales).
    floorFactorM13: +Math.pow(M, 1 / 3).toPrecision(6),
  };
});

// Flatness diagnostics for the amplitude prefactor ratio across the ladder.
const ratios = rows.map((r) => r.prefactorRatio);
const meanRatio = ratios.reduce((a, b) => a + b, 0) / ratios.length;
const maxRelSpread = Math.max(...ratios.map((r) => Math.abs(r - meanRatio) / meanRatio));

// Log-log slope of the prefactor ratio against M: ~ 0 (amplitude, exponent-free).
const first = rows[0];
const last = rows[rows.length - 1];
const prefactorLoglogSlope =
  (Math.log10(last.prefactorRatio) - Math.log10(first.prefactorRatio)) /
  (Math.log10(last.M) - Math.log10(first.M)); // ~ 0

// The contrast: the imp-35695 floor factor M^{1/3} log-log slope is exactly 1/3.
const floorFactorLoglogSlope =
  (Math.log10(last.floorFactorM13) - Math.log10(first.floorFactorM13)) /
  (Math.log10(last.M) - Math.log10(first.M)); // = 1/3

// Amplitude mismatch (pi^2/3)/C_C ~ 8.573 (imp-35680); the prefactor ratio is its cube root.
const AMPLITUDE_RATIO = C_STD / C_C; // ~ 8.573

export const IMP35720_PREFACTOR_M_INDEPENDENCE_LADDER = {
  id: 'imp-35720',
  proofSection: 'S-frontier',
  question:
    'Across the imp-35695 gap-count ladder M in {10, 1e2, 1e4, 1e6, 1e8}, is the imp-35696 collision-scale amplitude ' +
    'prefactor ratio prefCC/prefStd = ((pi^2/3)/C_C)^{1/3} ~ 2.047 FLAT (M-independent, a pure amplitude that never ' +
    'touches the M-exponent), while the reciprocal resolution-floor factor M^{1/3} scales?',
  method:
    'For each M on the imp-35695 ladder recompute the smallest-of-M-gaps scale s_min(M; c) by BISECTION on the ' +
    'extreme-value balance M F(s) = 1 (F(s) = c s^3 / 3, NOT the closed form) for both the standard coefficient ' +
    'c = pi^2/3 and c = C_C, form the per-rung ratio s_min(M; C_C) / s_min(M; pi^2/3), and compare its flatness ' +
    '(max relative spread, log-log slope) against the imp-35695 floor factor M^{1/3} in the same rows.',
  amplitudeVsExponent:
    'The prefactor ratio ((pi^2/3)/C_C)^{1/3} ~ 2.047 is a PURE AMPLITUDE: M cancels in the ratio of the two ' +
    's_min(M; c) = (3/c)^{1/3} M^{-1/3} readings, so it is identical at every rung (log-log slope ~ 0). The ' +
    'imp-35695 reciprocal floor factor M^{1/3} is a PURE EXPONENT effect: it climbs 10^{1/3} ~ 2.1544x per decade ' +
    '(log-log slope exactly 1/3). Amplitude and exponent are orthogonal on the shared ladder -- the coefficient ' +
    'mismatch never leaks into the power.',
  prefactorRatioTarget: +PREF_RATIO_TARGET.toPrecision(10), // ((pi^2/3)/C_C)^{1/3} ~ 2.0466534
  meanPrefactorRatio: +meanRatio.toPrecision(10), // ~ 2.0466534
  maxRelSpreadAcrossLadder: +maxRelSpread.toExponential(3), // ~ 0 (a few ULP)
  prefactorLoglogSlope: +prefactorLoglogSlope.toExponential(3), // ~ 0 (M-independent)
  floorFactorLoglogSlope: +floorFactorLoglogSlope.toFixed(6), // = 1/3 (imp-35695, scales)
  amplitudeRatioStdToCC: +AMPLITUDE_RATIO.toPrecision(8), // 8.5730018 (imp-35680; prefactor is its cube root)
  ladder: rows,
  prefactorIsMIndependent: true,
  floorFactorScalesWithM: true,
  amplitudeSeparatedFromExponent: true,
  isRigorous: false,
  isUnconditional: false,
  verdict:
    'MEASUREMENT (NOT rigorous). Tabulating the imp-35696 collision-scale amplitude prefactor ratio ' +
    'prefCC/prefStd across the imp-35695 ladder M in {10, 1e2, 1e4, 1e6, 1e8}, recomputed by bisection on ' +
    'M F(s_min) = 1 for both c = pi^2/3 and c = C_C, gives ((pi^2/3)/C_C)^{1/3} ~ 2.0467 at EVERY rung -- flat to ' +
    '~machine precision (max relative spread ~ 0, log-log slope ~ 0), a pure amplitude in which M cancels. In the ' +
    'SAME rows the imp-35695 reciprocal floor factor M^{1/3} climbs 2.15x -> 464x with a log-log slope of exactly ' +
    '1/3. So the coefficient mismatch imp-35680 measured ((pi^2/3)/C_C ~ 8.573) enters the collision scale ONLY as ' +
    'its M-independent cube root (~2.047), never touching the M-exponent -- amplitude and exponent are numerically ' +
    'separated on one shared ladder, exactly as imp-35696 asserted. Confirms imp-35696 quantitatively; derives no ' +
    'remainder; discharges nothing; changes no bound; establishes no operator positivity; C_C = (1/8) sqrt(3 pi) ' +
    '(imp-2642/imp-2643), C_H = 1/8, E_trunc = 3.06e-5 (imp-2631) and C_mb GUE-conditional (imp-486) are UNTOUCHED; ' +
    'imp-35337a stays OPEN; route-(ii) (imp-35488 two-height spot check) remains the only viable partial; no RH ' +
    'verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-35696 (states prefCC/prefStd = ((pi^2/3)/C_C)^{1/3} ~ 2.047, laddered here); imp-35695 (reciprocal floor ' +
    'factor M^{1/3} contrasted against); imp-35680 (amplitude mismatch ratio (pi^2/3)/C_C ~ 8.573); imp-2642/' +
    'imp-2643 (C_C = (1/8) sqrt(3 pi), C_H = 1/8); imp-2631 (E_trunc floor); imp-486 (GUE-conditional caveat). ' +
    'Literature: Montgomery (1973); Rudnick-Sarnak (1996); Ben Arous-Bourgade (2013, smallest GUE gaps ~ n^{-4/3}). ' +
    'Platt-Trudgian 2021 (Lambda <= 0.2).',
};

export const IMP35720_PREFACTOR_M_INDEPENDENCE_LADDER_ASSERTIONS = [
  {
    // (1) every ladder rung reproduces the analytic prefactor ratio ((pi^2/3)/C_C)^{1/3} ~ 2.047.
    id: 'imp35720-every-rung-equals-cuberoot-amplitude',
    description: 'each bisection-measured rung has prefactor ratio = ((pi^2/3)/C_C)^{1/3} ~ 2.0467, matching the analytic target',
    holds: () =>
      rows.every(
        (r) =>
          Math.abs(r.prefactorRatio - PREF_RATIO_TARGET) < 1e-8 &&
          r.prefactorRatio > 2.04 && r.prefactorRatio < 2.05,
      ),
  },
  {
    // (2) the prefactor ratio is FLAT across the ladder: negligible spread, log-log slope ~ 0.
    id: 'imp35720-prefactor-flat-M-independent',
    description: 'the prefactor ratio is M-independent: max relative spread across the ladder ~ 0 and log-log slope ~ 0',
    holds: () => {
      const r = IMP35720_PREFACTOR_M_INDEPENDENCE_LADDER;
      return (
        maxRelSpread < 1e-8 &&
        Math.abs(prefactorLoglogSlope) < 1e-8 &&
        r.prefactorIsMIndependent === true
      );
    },
  },
  {
    // (3) SEPARATION: the amplitude ratio is flat (slope ~ 0) while the imp-35695 floor factor scales (slope 1/3).
    id: 'imp35720-amplitude-vs-exponent-separated',
    description: 'amplitude (prefactor ratio, slope ~ 0) is separated from exponent (imp-35695 floor factor M^{1/3}, slope 1/3) on the shared ladder',
    holds: () => {
      const r = IMP35720_PREFACTOR_M_INDEPENDENCE_LADDER;
      return (
        Math.abs(prefactorLoglogSlope) < 1e-8 &&
        Math.abs(floorFactorLoglogSlope - 1 / 3) < 1e-5 &&
        r.floorFactorScalesWithM === true &&
        r.amplitudeSeparatedFromExponent === true &&
        last.floorFactorM13 / first.floorFactorM13 > 200 // 1e8^{1/3} / 10^{1/3} ~ 215x span
      );
    },
  },
  {
    // (4) the flat amplitude is the cube root of the imp-35680 mismatch and matches the imp-35696 reading.
    id: 'imp35720-matches-imp35696-and-imp35680',
    description: 'the flat prefactor ratio equals cbrt((pi^2/3)/C_C) (imp-35680 ratio ~8.573) and the imp-35696 prefactorRatioCCtoStd ~ 2.0467',
    holds: () => {
      const pref696 = IMP35696_COLLISION_EXPONENT_CONSISTENCY_CHECK.measurement.prefactorRatioCCtoStd;
      const amp696 = IMP35696_COLLISION_EXPONENT_CONSISTENCY_CHECK.measurement.amplitudeRatioStdToCC;
      return (
        Math.abs(PREF_RATIO_TARGET - Math.cbrt(AMPLITUDE_RATIO)) < 1e-12 &&
        Math.abs(meanRatio - pref696) < 1e-6 &&
        Math.abs(AMPLITUDE_RATIO - amp696) < 1e-6
      );
    },
  },
  {
    // (5) the ladder is the SAME M set imp-35695 used, and its floor factors match imp-35695 row for row.
    id: 'imp35720-shares-imp35695-ladder',
    description: 'the M-ladder {10,1e2,1e4,1e6,1e8} and its M^{1/3} floor factors reproduce the imp-35695 ladder row for row',
    holds: () => {
      const other = IMP35695_RESOLUTION_FLOOR_FACTOR_M_LADDER.ladder;
      if (other.length !== rows.length) return false;
      return rows.every((r, i) => {
        const o = other[i];
        return o.M === r.M && Math.abs(o.floorFactor - r.floorFactorM13) / o.floorFactor < 1e-4;
      });
    },
  },
  {
    // (6) honesty gate: measurement only, conditional, no bound moves, no refereed bound is changed, imp-35337a OPEN, NO QED.
    id: 'imp35720-measurement-only-no-qed',
    description: 'measurement only: not rigorous/unconditional, changes no bound, keeps imp-486 caveat, imp-35337a OPEN, PT 0.2, NO QED',
    holds: () => {
      const r = IMP35720_PREFACTOR_M_INDEPENDENCE_LADDER;
      return (
        Math.abs(L_PT - 0.2) < 1e-15 &&
        r.isRigorous === false &&
        r.isUnconditional === false &&
        /imp-486/.test(r.verdict) &&
        /imp-35337a stays OPEN/.test(r.verdict) &&
        /NO QED/.test(r.verdict) &&
        /refereed bound is changed/i.test(r.verdict)
      );
    },
  },
];

for (const a of IMP35720_PREFACTOR_M_INDEPENDENCE_LADDER_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-35720-prefactor-M-independence-ladder assertion failed: ${a.id}`);
  }
}
