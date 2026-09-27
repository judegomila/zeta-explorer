/**
 * @module imp-97740-sigma-fartail-term-stencil-floor-crossover
 *
 * imp-97740 (numerical -- MEASUREMENT ONLY on the inherited surrogate; NO bound moves; NO QED).
 *
 * imp-97723 (F1) gave the EXACT far-tail diagnostic decomposition
 *
 *     (1/2 - p) * 2 log T0  =  (1 - sigma) * (1 - 1/log(T0/2pi))  +  sigma * log T0
 *                              \___________ bare RvM slope ______/    \__ term __/
 *
 * and noted that deep in the tail the sigma*log T0 term "vanishes", so the FULL model collapses to
 * the BARE 1 - 1/log(T0/2pi). imp-97723 measured that the finite-difference-measured diagnostic
 * matches the full model to the H=1e-5 central-difference floor across [1e18,1e300], but it did NOT
 * tabulate the crossover height at which the sigma*log T0 term itself drops below that measurement
 * floor -- i.e. the height past which the bare RvM slope is indistinguishable from the full model at
 * the resolution of the H=1e-5 stencil. This leaf LOCATES that crossover.
 *
 * THE COMPONENT MODEL (identical sub-terms to imp-3406 / imp-97702 / imp-97723; no re-derivation)
 * ---------------------------------------------------------------------------------------------
 *     sigma(N) = E_coll / (E_trunc + E_flow + E_coll),
 *     E_trunc  = 3.06e-5,   E_coll = C_C_PINNED * sqrt(log T0 / N),
 *     E_flow   = C_F (log T0 / T0) * Gronwall,   C_F = (log(T0/2pi)+1)/2pi,   T0 = effectiveHeightForN(N).
 * The pointwise decay exponent p(N) = -d ln sigma / d ln N is estimated by the SAME central
 * difference (step H=1e-5 in ln N) imp-97723 used, so the "stencil floor" here is exactly its floor.
 *
 * THE STENCIL FLOOR (measured, not assumed)
 * -----------------------------------------
 * The floor is the level at which the finite-difference-measured diag = (1/2 - p)*2 log T0 agrees
 * with the exact full model. It is measured DIRECTLY as the median of |diag_measured - diagModel|
 * over the deep tail k in [40,300], where the sigma*log T0 term is < 1e-13 and so contributes
 * nothing -- the residual there is PURE central-difference roundoff (relative roundoff eps ~ 2.2e-16
 * on ln-sigma values of magnitude ~10^2, divided by 2H). Measured floor ~ 8.0e-7 (median), mean
 * ~9.2e-7, worst ~4.1e-6, consistent with imp-97723 F1 ("< 3e-6 at every rung, 4e-9 at 1e18").
 *
 * THE CROSSOVER (the finding)
 * ---------------------------
 * The term sigma*log T0 falls by ~ one order of magnitude every 1.5 decades of N:
 *     1e24 -> 4.86e-6,  1e25 -> 1.64e-6,  1e26 -> 5.50e-7,  1e27 -> 1.84e-7,  1e30 -> 6.84e-9.
 * It first drops BELOW the ~8.0e-7 stencil floor between N=1e25 (term 1.64e-6, still above) and
 * N=1e26 (term 5.50e-7, below). A fine ln-N scan pins the crossover at k* ~ 25.70 (N ~ 5.0e25),
 * where sigma ~ 1.34e-8, log T0 ~ 57.0, and the term ~ 7.6e-7 = the floor. Past N ~ 1e26 the
 * sigma*log T0 term is sub-stencil, so the far-tail diagnostic reduces to the bare 1 - 1/log(T0/2pi)
 * at the resolution of the H=1e-5 central difference -- exactly the reduction imp-97723 F1 asserted.
 *
 * VERDICT.  MEASUREMENT ONLY. The imp-97723 far-tail diagnostic reduces to the bare RvM slope
 * 1 - 1/log(T0/2pi) once the sigma*log T0 term drops below the H=1e-5 central-difference floor
 * (~8.0e-7), which happens between N=1e25 and N=1e26 -- crossover k* ~ 25.70 (N ~ 5.0e25),
 * sigma ~ 1.34e-8, log T0 ~ 57.0, term ~ 7.6e-7. This is a resolution statement about the surrogate
 * diagnostic, NOT an RH bound. The component model is the inherited imp-3220/imp-3406 extrapolation,
 * NOT a rigorous asymptotic; the C_mb GUE-conditional per imp-486 is UNTOUCHED; changes no bound;
 * establishes no operator positivity; imp-3066 K_a >= 0 untouched; RH open; NO QED. Platt-Trudgian
 * Lambda <= 0.2 remains SOTA.
 *
 * @see imp-97723-sigma-fartail-diagnostic-asymptote-one.js (F1: the exact diagnostic decomposition; floor asserted, crossover not tabulated)
 * @see imp-97702-sigma-fartail-exponent-residual-half-loglaw.js (the residual split (1/2)sigma + a(1-sigma))
 * @see lambda-rh-height-mapping.js (effectiveHeightForN: N -> T0 via the Riemann-von Mangoldt inverse)
 *
 * Ticket: imp-97740 (numerical, opus-4-8, api-pool). Term-vs-stencil crossover probe; NO QED.
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed strip (imp-2631/imp-3406/imp-97702/imp-97723)
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-3406/imp-97702/imp-97723 exactly

// EXACT imp-3406/imp-97702/imp-97723 sub-terms (no re-derivation, no fresh model).
function parts(N) {
  const T0 = effectiveHeightForN(N);
  const L = Math.log(T0);
  const C_F = (Math.log(T0 / TWO_PI) + 1) / TWO_PI;
  const E_flow = C_F * (L / T0) * GRONWALL;
  const E_coll = C_C_PINNED * Math.sqrt(L / N);
  const E_N = E_TRUNC_PT + E_flow + E_coll;
  return { T0, L, E_coll, E_N, sigma: E_coll / E_N };
}
const sigma = (N) => parts(N).sigma;

const H = 1e-5; // SAME central-difference step in ln N as imp-97723 (defines the stencil floor)
function pLocal(N) {
  const lp = Math.log(sigma(Math.exp(Math.log(N) + H)));
  const lm = Math.log(sigma(Math.exp(Math.log(N) - H)));
  return -(lp - lm) / (2 * H);
}
const HALF = 0.5;

// The sigma*log T0 term = the exact gap between the FULL model and the BARE RvM slope, and the
// per-rung stencil residual = |diag_measured - diagModel| (central-difference measurement noise).
function rung(k) {
  const N = Math.pow(10, k);
  const P = parts(N);
  const Lprime = Math.log(P.T0 / TWO_PI);
  const slopeRvM = 1 - 1 / Lprime; // bare RvM log-derivative slope
  const diag = (HALF - pLocal(N)) * 2 * P.L; // central-difference measured diagnostic
  const diagModel = (1 - P.sigma) * slopeRvM + P.sigma * P.L; // exact full model
  return {
    N: `1e${k}`,
    sigma: P.sigma,
    logT0: P.L,
    term: P.sigma * P.L, // sigma*log T0 = full - bare gap
    slopeRvM,
    stencilResidual: Math.abs(diag - diagModel),
  };
}

// (Floor) MEASURE the pure stencil floor on the deep tail (term < 1e-13 there, contributes nothing).
const FLOOR_SAMPLE = [];
for (let k = 40; k <= 300; k++) FLOOR_SAMPLE.push(rung(k).stencilResidual);
FLOOR_SAMPLE.sort((a, b) => a - b);
export const IMP97740_STENCIL_FLOOR = Object.freeze({
  median: FLOOR_SAMPLE[Math.floor(FLOOR_SAMPLE.length / 2)], // ~8.0e-7
  mean: FLOOR_SAMPLE.reduce((a, b) => a + b, 0) / FLOOR_SAMPLE.length, // ~9.2e-7
  worst: FLOOR_SAMPLE[FLOOR_SAMPLE.length - 1], // ~4.1e-6
  samples: FLOOR_SAMPLE.length,
});
const FLOOR = IMP97740_STENCIL_FLOOR.median;

// (Table) integer-k ladder bracketing the crossover: sigma, log T0, and the sigma*log T0 term.
export const IMP97740_TERM_LADDER = Object.freeze(
  [22, 23, 24, 25, 26, 27, 28, 30].map((k) => {
    const r = rung(k);
    return Object.freeze({
      N: r.N,
      sigma: +r.sigma.toExponential(3),
      logT0: +r.logT0.toFixed(3),
      term: +r.term.toExponential(3),
      belowFloor: r.term < FLOOR,
    });
  })
);

// (Crossover) fine ln-N scan for the smallest N with term = sigma*log T0 < the measured floor.
function findCrossover() {
  let cross = null;
  for (let k = 20; k <= 40; k += 0.01) {
    const N = Math.pow(10, k);
    const P = parts(N);
    if (P.sigma * P.L < FLOOR) {
      cross = { k, N, sigma: P.sigma, logT0: P.L, term: P.sigma * P.L };
      break;
    }
  }
  return cross;
}
const CROSS = findCrossover();
export const IMP97740_CROSSOVER = Object.freeze({
  log10N: +CROSS.k.toFixed(2), // ~25.70
  Napprox: `~5.0e25`,
  sigma: +CROSS.sigma.toExponential(4), // ~1.34e-8
  logT0: +CROSS.logT0.toFixed(4), // ~57.0
  term: +CROSS.term.toExponential(4), // ~7.6e-7 = the floor
  floor: +FLOOR.toExponential(4), // ~8.0e-7
  bracketLo: '1e25', // term 1.64e-6, still above the floor
  bracketHi: '1e26', // term 5.50e-7, below the floor
});

export const IMP97740_VERDICT = Object.freeze({
  question:
    'at what height N does the imp-97723 sigma*log T0 correction term first fall below the H=1e-5 ' +
    'central-difference stencil floor, so the far-tail diagnostic reduces to the bare 1 - 1/log(T0/2pi)?',
  stencilFloorMedian: IMP97740_STENCIL_FLOOR.median, // ~8.0e-7 (measured on the deep tail)
  crossoverLog10N: IMP97740_CROSSOVER.log10N, // ~25.70
  crossoverSigma: IMP97740_CROSSOVER.sigma, // ~1.34e-8
  crossoverLogT0: IMP97740_CROSSOVER.logT0, // ~57.0
  crossoverTerm: IMP97740_CROSSOVER.term, // ~7.6e-7
  integerBracket: '1e25 (term 1.64e-6, above) -> 1e26 (term 5.50e-7, below)',
  reducesToBareSlopeBeyond: '~1e26',
  isRigorous: false,
  anyBoundMoved: false,
  ptSOTA: true,
  qed: false,
  conclusion:
    'MEASUREMENT ONLY. The imp-97723 far-tail diagnostic (1/2 - p)*2 log T0 reduces to the bare ' +
    'Riemann-von Mangoldt slope 1 - 1/log(T0/2pi) once the sigma*log T0 correction term drops below ' +
    'the H=1e-5 central-difference stencil floor (measured ~8.0e-7 as the median deep-tail residual, ' +
    'mean ~9.2e-7, worst ~4.1e-6). The term falls ~1 order of magnitude per 1.5 decades of N and ' +
    'crosses the floor between N=1e25 (term 1.64e-6) and N=1e26 (term 5.50e-7); the fine crossover is ' +
    'at log10 N ~ 25.70 (N ~ 5.0e25), where sigma ~ 1.34e-8 and log T0 ~ 57.0, giving term ~ 7.6e-7. ' +
    'Past N ~ 1e26 the sigma*log T0 term is sub-stencil, so the diagnostic is the bare RvM slope at ' +
    'H=1e-5 resolution -- exactly the reduction imp-97723 F1 asserted. Conditional-share resolution ' +
    'statement on the inherited surrogate, NOT an RH bound; the C_mb GUE-conditional per imp-486 is ' +
    'UNTOUCHED; changes no bound; imp-3066 K_a >= 0 untouched; RH open; NO QED. PT Lambda <= 0.2 SOTA.',
});

export const IMP97740_HONEST_BANNER =
  'RH open; PT Lambda <= 0.2 remains SOTA; NO QED. The imp-97723 far-tail diagnostic reduces to the ' +
  'bare 1 - 1/log(T0/2pi) once the sigma*log T0 term drops below the H=1e-5 central-difference floor ' +
  '(measured ~8.0e-7): the term crosses the floor between N=1e25 (1.64e-6) and N=1e26 (5.50e-7), at ' +
  'log10 N ~ 25.70 (N ~ 5.0e25, sigma ~ 1.34e-8, log T0 ~ 57.0). Measurement only; no bound moved.';

// -- self-executing assertions (imp-3715 convention): recompute live; any failure throws --

const IMP97740_ASSERTIONS = [
  {
    id: 'imp97740-stencil-floor-measured-order-1e-6',
    holds: () =>
      IMP97740_STENCIL_FLOOR.samples === 261 &&
      IMP97740_STENCIL_FLOOR.median > 1e-8 &&
      IMP97740_STENCIL_FLOOR.median < 3e-6 &&
      IMP97740_STENCIL_FLOOR.worst < 1e-5,
    why: 'the pure central-difference stencil floor, measured as the median deep-tail |diag_measured - diagModel| (term < 1e-13 there), sits at order 1e-6 (~8.0e-7) with worst rung < 1e-5, matching imp-97723 F1.',
  },
  {
    id: 'imp97740-term-monotone-decreasing',
    holds: () => {
      for (let i = 1; i < IMP97740_TERM_LADDER.length; i++) {
        if (!(IMP97740_TERM_LADDER[i].term < IMP97740_TERM_LADDER[i - 1].term)) return false;
      }
      return true;
    },
    why: 'the sigma*log T0 term decreases monotonically with height across the tabulated ladder, so the crossover below the floor is well defined.',
  },
  {
    id: 'imp97740-crossover-in-1e25-to-1e26-bracket',
    holds: () => {
      const r25 = IMP97740_TERM_LADDER.find((r) => r.N === '1e25');
      const r26 = IMP97740_TERM_LADDER.find((r) => r.N === '1e26');
      return (
        r25 && r26 && r25.belowFloor === false && r26.belowFloor === true &&
        IMP97740_CROSSOVER.log10N > 25 && IMP97740_CROSSOVER.log10N < 26
      );
    },
    why: 'the term is above the floor at 1e25 and below it at 1e26, and the fine crossover lands strictly inside that decade (log10 N ~ 25.70).',
  },
  {
    id: 'imp97740-crossover-values-consistent',
    holds: () =>
      Math.abs(IMP97740_CROSSOVER.term - FLOOR) / FLOOR < 0.1 &&
      IMP97740_CROSSOVER.sigma > 1e-8 && IMP97740_CROSSOVER.sigma < 2e-8 &&
      IMP97740_CROSSOVER.logT0 > 56 && IMP97740_CROSSOVER.logT0 < 58,
    why: 'at the crossover the term equals the floor to within 10 percent, with sigma ~ 1.34e-8 and log T0 ~ 57.0 -- the tabulated (sigma, log T0, term) at the crossover height.',
  },
  {
    id: 'imp97740-honesty-gate-no-qed',
    holds: () =>
      IMP97740_VERDICT.isRigorous === false &&
      IMP97740_VERDICT.anyBoundMoved === false &&
      IMP97740_VERDICT.ptSOTA === true &&
      IMP97740_VERDICT.qed === false &&
      /NO QED/.test(IMP97740_HONEST_BANNER) &&
      /PT Lambda <= 0.2/.test(IMP97740_HONEST_BANNER) &&
      /RH open/.test(IMP97740_HONEST_BANNER),
    why: 'measurement only -- a resolution statement on the inherited surrogate diagnostic; no bound moved, PT stays SOTA, no QED.',
  },
];

for (const a of IMP97740_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-97740-sigma-fartail-term-stencil-floor-crossover assertion failed: ${a.id}`
    );
  }
}

export default {
  stencilFloor: IMP97740_STENCIL_FLOOR,
  termLadder: IMP97740_TERM_LADDER,
  crossover: IMP97740_CROSSOVER,
  verdict: IMP97740_VERDICT,
  banner: IMP97740_HONEST_BANNER,
};
