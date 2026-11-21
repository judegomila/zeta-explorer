/**
 * @module imp-35992-sigma-fartail-loglog-slope
 *
 * imp-35992 (accuracy, measurement): MEASURE the observed local log-log slope of the
 * conditional-share sigma(N) = E_coll / E(N) in the far tail past the imp-33582 interior
 * peak (N > 9.22e5) and test whether it matches the E_coll ~ sqrt(L/N) => sigma ~
 * sqrt(L/N)/E_trunc prediction (effective exponent ~ -1/2), quantifying how the slow
 * L = log T0 growth bends it away from a clean -1/2.
 *
 * imp-3406 reconciled the "widest at 10^6" reading as a sampling artifact and stated
 * sigma(N) decays MONOTONICALLY past its true interior peak at N ~ 9.22e5, but never
 * measured the tail DECAY EXPONENT. On the pinned surrogate E(N) = E_trunc + E_flow +
 * E_coll (E_trunc = 3.06e-5 N-independent, imp-2631; E_flow = C_F (log T0 / T0) exp|t_c|;
 * E_coll = C_C sqrt(log T0 / N), C_C = (1/8) sqrt(3 pi), imp-2642 / imp-2643) the far tail
 * has E_flow negligible and E_coll declining, so sigma ~ E_coll / (E_trunc + E_coll) and,
 * once truncation dominates, sigma ~ (C_C / E_trunc) sqrt(L / N) with L = log T0. Its
 * log-log slope is therefore NOT a clean -1/2: it is modulated both by (a) the transition
 * ramp -- while E_coll is still a sizeable share the slope reads roughly -shareTrunc/2, so
 * it steepens toward -1/2 only as truncation takes over -- and (b) the slow L growth, which
 * adds a POSITIVE bend d log sigma / d log N |_asympt = -1/2 + (1/2) d log L / d log N ~
 * -1/2 + 1/(2 log T0), pushing the asymptote ABOVE -1/2 and reached only logarithmically.
 *
 * WHAT THE MEASUREMENT SHOWS (the honest finding). Central-difference local log-log slope
 * m(N) = d log sigma / d log N, stepped down the height ladder past the peak:
 *   log10 N :   6        7        9        11       13       15
 *   m(N)    : -0.0006  -0.0233  -0.1714  -0.4019  -0.4731  -0.4842
 *   -1/2+bend: -0.4657  -0.4700  -0.4761  -0.4802  -0.4831  -0.4853   (asymptotic prediction)
 *   shareTrunc: 0.0208   0.0595   0.3614   0.8369   0.9793   0.9977
 *   log T0   : 13.31    15.42    19.73    24.11    28.53    32.97
 * The slope steepens MONOTONICALLY from ~ 0 at the peak (flat by construction) toward -1/2,
 * tracking the shareTrunc ramp: it does NOT read a clean -1/2 until truncation dominates
 * (log10 N >~ 13, shareTrunc >~ 0.98). Even then it settles at ~ -0.484, NOT -1/2: the
 * log T0 factor holds the asymptote at -1/2 + bend with bend ~ 1/(2 log T0) (~ +0.034 near
 * the peak shrinking to ~ +0.015 at log10 N = 15), so the effective exponent approaches
 * -1/2 FROM ABOVE and reaches it only as log T0 -> infinity (logarithmically slowly). The
 * observed slope matches the -1/2 + bend prediction to within ~ 0.001 once shareTrunc ~ 1
 * (log10 N = 15: observed -0.4842 vs predicted -0.4853), confirming the sqrt(L/N)/E_trunc
 * law with the L-growth correction as the leading far-tail behaviour.
 *
 * Measurement only; reuses the pinned imp-3406 / imp-33582 sub-terms and the
 * effectiveHeightForN mapping unchanged; derives no remainder; discharges nothing; changes
 * no bound; establishes no operator positivity; C_C = (1/8) sqrt(3 pi) (imp-2642 / imp-2643),
 * E_trunc = 3.06e-5 (imp-2631) and C_mb GUE-conditional (imp-486) are UNTOUCHED; imp-35337a
 * stays OPEN; NO QED; no refereed bound is changed.
 *
 * @see imp-3406-sigma-highN-extrapolation (stated monotone post-peak decay; never measured the exponent)
 * @see imp-33582-sigma-postpeak-nearpeak-threshold-decay (source sigma model; interior peak N ~ 9.22e5)
 * @see imp-35950-etrunc-ecoll-crossover-height (same surrogate; sigma = 0.5 crossover at N ~ 3.267e9)
 * @see lambda-rh-height-mapping.js (effectiveHeightForN: N -> T0 RvM inverse)
 * Literature: Riemann-von Mangoldt counting formula; Platt-Trudgian 2021 (Lambda <= 0.2).
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const L_PT = 0.2; // Platt-Trudgian 2021 bound (unchanged by any measurement here)

// EXACT imp-3406 / imp-33582 sub-terms (identical to imp-35950; no fresh model).
const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631)
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP);
function parts(N) {
  const T0 = effectiveHeightForN(N);
  const L = Math.log(T0);
  const C_F = (Math.log(T0 / TWO_PI) + 1) / TWO_PI; // imp-398 pinned prefactor
  const E_flow = C_F * (L / T0) * GRONWALL;
  const E_coll = C_C_PINNED * Math.sqrt(L / N); // GUE-conditional (C_H)
  const E_N = E_TRUNC_PT + E_flow + E_coll;
  return { sigma: E_coll / E_N, logT0: L, E_trunc: E_TRUNC_PT, E_flow, E_coll, E_N };
}
const sigma = (N) => parts(N).sigma;

// Interior peak (reproduces imp-33582 / imp-35813 N ~ 9.22e5) -- anchors the "past the peak" region.
function dSigmadN(N) {
  const h = N * 1e-6;
  return (sigma(N + h) - sigma(N - h)) / (2 * h);
}
function locatePeak() {
  let a = Math.log(1e4);
  let b = Math.log(1e7);
  for (let i = 0; i < 200; i++) {
    const m = (a + b) / 2;
    if (dSigmadN(Math.exp(m)) > 0) a = m;
    else b = m;
  }
  return Math.exp((a + b) / 2);
}
const N_PEAK = locatePeak();

// Local log-log slope m(N) = d log sigma / d log N via a symmetric step in log N.
const DLOG = 1e-3;
function loglogSlope(N) {
  const lp = Math.log(sigma(N * Math.exp(DLOG)));
  const lm = Math.log(sigma(N * Math.exp(-DLOG)));
  return (lp - lm) / (2 * DLOG);
}
// The log T0 bend term (1/2) d log L / d log N, with L = log T0 -- the sole source of the
// asymptotic departure of the slope from a clean -1/2.
function logT0Bend(N) {
  const Ll = (n) => Math.log(Math.log(effectiveHeightForN(n)));
  return 0.5 * (Ll(N * Math.exp(DLOG)) - Ll(N * Math.exp(-DLOG))) / (2 * DLOG);
}

// Height ladder several decades past the peak (log10 N ~ 5.965). Include one point near the
// peak (log10 N = 6) to show the slope starts flat and steepens.
const LADDER_LOG10 = [6, 7, 9, 11, 13, 15];
const tail = LADDER_LOG10.map((e) => {
  const N = Math.pow(10, e);
  const p = parts(N);
  const m = loglogSlope(N);
  const bend = logT0Bend(N);
  return {
    log10N: e,
    slope: +m.toFixed(5),
    asymptoticPred: +(-0.5 + bend).toFixed(5), // -1/2 + (1/2) dlogL/dlogN
    bend: +bend.toFixed(5),
    shareTrunc: +(p.E_trunc / p.E_N).toFixed(4),
    logT0: +p.logT0.toFixed(3),
  };
});

const FAR = tail[tail.length - 1]; // log10 N = 15 -- most truncation-dominated tabulated rung
const NEAR = tail[0]; // log10 N = 6 -- essentially at the peak (slope ~ 0)

// Slope steepens monotonically toward -1/2 across the ladder (each rung more negative).
const monotoneSteepening = tail.every((r, i) => i === 0 || r.slope < tail[i - 1].slope);
// The log T0 bend is positive everywhere and shrinks as N grows (L grows) -- so the
// asymptote sits ABOVE -1/2 and drifts toward it only logarithmically.
const bendPositiveAndShrinking = tail.every(
  (r, i) => r.bend > 0 && (i === 0 || r.bend < tail[i - 1].bend)
);

export const IMP35992_SIGMA_FARTAIL_LOGLOG_SLOPE = {
  id: 'imp-35992',
  proofSection: 'S-frontier',
  question:
    'imp-3406 stated sigma(N) = E_coll / E(N) decays monotonically past its interior peak at ' +
    'N ~ 9.22e5 but never measured the tail decay exponent. What is the observed local log-log ' +
    'slope of sigma(N) several decades past the peak, does it match the sqrt(L/N)/E_trunc ' +
    'prediction (effective exponent ~ -1/2), and how does the slow L = log T0 growth bend it ' +
    'away from a clean -1/2?',
  method:
    'On the exact imp-3406 / imp-33582 surrogate (E_trunc = 3.06e-5 fixed; E_flow = C_F ' +
    '(log T0 / T0) exp|t_c|; E_coll = C_C sqrt(log T0 / N)) with the pinned effectiveHeightForN ' +
    'mapping, compute the central-difference local log-log slope m(N) = d log sigma / d log N ' +
    'across a height ladder log10 N in {6, 7, 9, 11, 13, 15} past the peak. Alongside each rung ' +
    'record the truncation share E_trunc / E(N) and the isolated log T0 bend (1/2) d log L / ' +
    'd log N, and compare m(N) against the asymptotic prediction -1/2 + bend.',
  peakN: +N_PEAK.toExponential(6), // ~ 9.22e5 -- confirms the imp-33582 model / peak in use
  tail, // per-rung {log10N, slope, asymptoticPred, bend, shareTrunc, logT0}
  nearPeakSlope: NEAR.slope, // ~ 0 (flat by construction at the peak)
  farTailSlope: FAR.slope, // ~ -0.484 at log10 N = 15 (NOT a clean -1/2)
  farTailAsymptoticPred: FAR.asymptoticPred, // ~ -0.485 (-1/2 + bend)
  farTailBend: FAR.bend, // ~ +0.015 -- the residual log T0 departure from -1/2
  monotoneSteepening, // slope grows more negative every rung (steepens toward -1/2)
  bendPositiveAndShrinking, // bend > 0 and shrinking: asymptote above -1/2, approached logarithmically
  matchesRootLawWhenTruncDominant: Math.abs(FAR.slope - FAR.asymptoticPred) < 3e-3,
  isRigorous: false,
  isUnconditional: false,
  verdict:
    'MEASUREMENT (NOT rigorous). On the same imp-3406 / imp-33582 surrogate and the pinned ' +
    'effectiveHeightForN mapping, the local log-log slope m(N) = d log sigma / d log N past the ' +
    'interior peak (N ~ 9.22e5) is NOT a clean -1/2 across the accessible decades. It steepens ' +
    'MONOTONICALLY from ~ 0 at the peak (log10 N = 6: m ~ -0.001, flat by construction) toward ' +
    '-1/2 -- m ~ -0.023 (10^7), -0.171 (10^9), -0.402 (10^11), -0.473 (10^13), -0.484 (10^15) -- ' +
    'tracking the truncation-share ramp (shareTrunc 0.02 -> 0.99), so the sqrt(L/N)/E_trunc ' +
    'exponent only emerges once truncation dominates (log10 N >~ 13). Even then the slope settles ' +
    'at ~ -0.484, NOT -1/2: the slow L = log T0 growth adds a POSITIVE bend (1/2) d log L / ' +
    'd log N ~ 1/(2 log T0) (~ +0.034 near the peak shrinking to ~ +0.015 at log10 N = 15), so ' +
    'the effective exponent is -1/2 + bend, approaching -1/2 FROM ABOVE only as log T0 -> ' +
    'infinity (logarithmically slowly). Once shareTrunc ~ 1 the observed slope matches the ' +
    '-1/2 + bend prediction to within ~ 0.001 (log10 N = 15: -0.4842 observed vs -0.4853 ' +
    'predicted), confirming sigma ~ (C_C / E_trunc) sqrt(log T0 / N) with the L-growth ' +
    'correction as the leading far-tail behaviour. Reuses the pinned imp-3406 / imp-33582 ' +
    'sub-terms and the effectiveHeightForN mapping unchanged; derives no remainder; discharges ' +
    'nothing; changes no bound; establishes no operator positivity; C_C = (1/8) sqrt(3 pi) ' +
    '(imp-2642 / imp-2643), E_trunc = 3.06e-5 (imp-2631) and C_mb GUE-conditional (imp-486) are ' +
    'UNTOUCHED; imp-35337a stays OPEN; no RH verdict, NO QED. No refereed bound is changed' +
    '.',
  citation:
    'imp-3406 (stated monotone post-peak decay; never measured the exponent); imp-33582 ' +
    '(sigma-decay model; interior peak N ~ 9.22e5); imp-35950 (same surrogate; sigma = 0.5 ' +
    'crossover N ~ 3.267e9); imp-3220 / imp-3406 (RvM surrogate log-height); imp-2642 / ' +
    'imp-2643 (C_C = (1/8) sqrt(3 pi)); imp-2631 (E_trunc floor); imp-486 (GUE-conditional ' +
    'caveat). Literature: Riemann-von Mangoldt counting formula; Platt-Trudgian 2021 (Lambda <= 0.2).',
};

export const IMP35992_SIGMA_FARTAIL_LOGLOG_SLOPE_ASSERTIONS = [
  {
    // (1) same imp-33582 model in use: reproduces the interior peak the tail is measured past.
    id: 'imp35992-reproduces-imp33582-peak',
    description: 'peak N ~ 9.22e5 -- confirms the identical imp-33582 sigma model is in use',
    holds: () => Math.abs(N_PEAK / 9.22e5 - 1) < 5e-3,
  },
  {
    // (2) slope starts flat at the peak (~ 0) -- consistent with a decay maximum.
    id: 'imp35992-near-peak-slope-flat',
    description: 'log-log slope ~ 0 near the peak (log10 N = 6): |m| < 0.01',
    holds: () => Math.abs(NEAR.slope) < 0.01,
  },
  {
    // (3) monotone steepening: the slope grows more negative every rung down the ladder.
    id: 'imp35992-monotone-steepening-toward-half',
    description: 'm(N) strictly more negative at each larger N (steepens toward -1/2)',
    holds: () => monotoneSteepening === true,
  },
  {
    // (4) far-tail slope sits BELOW -1/2 in magnitude (shallower than -1/2), NOT a clean -1/2.
    id: 'imp35992-far-tail-not-clean-half',
    description: 'far-tail slope in (-0.5, -0.48): approaches -1/2 but stays strictly above it',
    holds: () => FAR.slope > -0.5 && FAR.slope < -0.48,
  },
  {
    // (5) once truncation dominates the slope matches the -1/2 + bend root law to ~ 1e-3.
    id: 'imp35992-matches-root-law-when-trunc-dominant',
    description: 'at log10 N = 15 (shareTrunc ~ 1) observed slope matches -1/2 + bend within 3e-3',
    holds: () =>
      FAR.shareTrunc > 0.99 && Math.abs(FAR.slope - FAR.asymptoticPred) < 3e-3,
  },
  {
    // (6) the log T0 bend is positive and shrinks as N grows -- the sole departure from -1/2.
    id: 'imp35992-logT0-bend-positive-shrinking',
    description: 'bend = (1/2) dlogL/dlogN > 0 and shrinking; asymptote above -1/2, reached logarithmically',
    holds: () =>
      bendPositiveAndShrinking === true &&
      FAR.bend > 0 &&
      FAR.bend < NEAR.bend &&
      Math.abs(FAR.bend - 1 / (2 * FAR.logT0)) < 5e-3, // bend ~ 1/(2 log T0)
  },
  {
    // (7) honesty gate: measurement only, conditional, no bound moves, imp-486 kept, imp-35337a OPEN, no refereed bound is changed, NO QED.
    id: 'imp35992-measurement-only-no-qed',
    description: 'measurement only: not rigorous/unconditional, changes no bound, keeps imp-486 caveat, imp-35337a OPEN, PT 0.2, NO QED',
    holds: () => {
      const r = IMP35992_SIGMA_FARTAIL_LOGLOG_SLOPE;
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

for (const a of IMP35992_SIGMA_FARTAIL_LOGLOG_SLOPE_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-35992-sigma-fartail-loglog-slope assertion failed: ${a.id}`);
  }
}
