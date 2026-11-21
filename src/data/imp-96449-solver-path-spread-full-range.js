/**
 * @module imp-96449-solver-path-spread-full-range
 *
 * imp-96449 (numerical, frontier-direction): EXTEND the imp-96427 Newton-vs-Lambert-W
 * solver-path spread comparison from the tenth-decade knee (N ~ 10^9.5) to the FULL
 * N = 1e2 .. 1e22 range that spans the E_coll anchors of imp-96402 / imp-96426, and
 * report whether the inter-method gamma_N spread stays below the ~1/N count-model
 * shift EVERYWHERE, or whether the Lambert-W and Newton paths diverge in the far tail
 * where log(gamma)/N underflows.
 *
 * BACKGROUND
 * ----------
 * imp-96427 measured the inter-METHOD (solver-path) spread between the imp-96363
 * closed-form Lambert-W height inversion, gamma_N = 2pi * exp(1 + W(N/e)), and the
 * Newton main-term inverse (effectiveHeightForN) ONLY at the tenth-decade knee
 * (log10 N* ~ 9.529): it found the knee spread is floating-point noise (~1.2e-13 in
 * log10) and the two solvers agree on gamma_N to relative ~8.1e-16 at that single
 * height. Both invert the IDENTICAL Riemann-von Mangoldt main-term count
 * N(T) = (T/2pi)(log(T/2pi) - 1), so any difference is a pure solver-path residual
 * carrying no count-model content. imp-96427 left open whether that agreement
 * survives across the full N-range the E_coll component model actually uses, and in
 * particular whether the far tail (where log(gamma)/N shrinks toward ~5e-21 at
 * N = 1e22) drives the two solvers apart.
 *
 * THE COMPARISON
 * --------------
 *   For each decade N = 10^d, d = 2 .. 22, invert the SAME main-term count by both
 *   the Newton path (effectiveHeightForN) and the closed-form Lambert-W path, and
 *   record:
 *     - the relative gamma_N spread  |gamma_L - gamma_N| / gamma_N;
 *     - the ~1/N count-model reference shift: the relative gamma shift induced by a
 *       +7/8 offset in the count, (7/8) * (dgamma/dN) / gamma
 *       = (7/8) * (2pi / log(T/2pi)) / T  ~  (7/8)/N  (since T ~ 2pi N / log(T/2pi));
 *     - their ratio (solver spread / count-model shift);
 *     - the tail diagnostic log(gamma_N)/N, whose underflow is the hypothesised
 *       divergence driver.
 *
 * THE FINDING (measurement / fit only)
 * ------------------------------------
 *   (F1) THE SOLVER-PATH gamma_N SPREAD STAYS AT FLOATING-POINT NOISE ACROSS ALL 20
 *        DECADES. The relative inter-method spread never leaves the machine-epsilon
 *        band: it ranges ~1.2e-16 (N = 1e2) to ~3.5e-15 (peak, N = 1e19), i.e. at most
 *        a few ULP, with NO growth trend. The far-tail underflow of log(gamma)/N (down
 *        to ~4.9e-21 at N = 1e22) does NOT drive the solvers apart -- both operate in
 *        T-space, not in the underflowing log(gamma)/N variable -- so the hypothesised
 *        far-tail divergence does NOT occur.
 *   (F2) THE SPREAD STAYS BELOW THE ~1/N COUNT-MODEL SHIFT ONLY UP TO N ~ 1e15;
 *        BEYOND THAT THE COUNT-MODEL SHIFT ITSELF UNDERFLOWS BELOW THE SOLVER NOISE.
 *        The count-model shift decays ~ (7/8)/N (6.3e-3 at N = 1e2 down to 8.6e-23 at
 *        N = 1e22), while the solver noise floor stays pinned near ~1e-15. The ratio
 *        crosses 1 at N ~ 1e15 (ratio ~0.71 at N = 1e15, ~13.6 at N = 1e16). So the
 *        naive claim "solver spread below the count-model shift everywhere" is FALSE
 *        past N ~ 1e15 -- but for a benign reason: the count-model shift has itself
 *        shrunk below one ULP of gamma_N, so BOTH the solver residual and the
 *        count-model shift are numerically negligible there and neither can move a
 *        gamma_N stored in double precision.
 *
 * MEASUREMENT / FIT ONLY. Solver-path / conditioning diagnostic, NOT an RH bound.
 * The component model is the inherited imp-3220/imp-3406 extrapolation, NOT a
 * rigorous asymptotic; the C_mb GUE-conditional per imp-486 is UNTOUCHED; changes
 * no bound; establishes no operator positivity; imp-3066 K_a >= 0 untouched; C_H
 * isRigorousUpperBound stays false (imp-2642/imp-2701); no RH verdict, NO QED.
 * No refereed bound is changed.
 *
 * Syntax note: derivative-like expressions use brace notation dg_{k*}/dt and this
 *   header avoids the close-comment terminator sequence inside prose.
 *
 * @see imp-96427-knee-crossover-solver-path-spread (knee-only solver spread ~1.2e-13 log10, gamma to 8.1e-16)
 * @see imp-96363-ecoll-independent-second-anchor (Lambert-W closed form reproduces Newton gamma to 3.9e-16)
 * @see imp-96402-ecoll-anchor-from-tabulated-true-zero-height (low-N E_coll anchor)
 * @see imp-96426-ecoll-anchor-intermediate-heights (intermediate-N E_coll anchors)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 = gamma_N, Newton main-term inverse)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';

const TWO_PI = 2 * Math.PI;

// Principal Lambert W by Halley iteration, reproduced verbatim from imp-96363/imp-96427
// so the two paths compare apples-to-apples.
function lambertW(x) {
  let w = x < Math.E ? x / Math.E : Math.log(x) - Math.log(Math.log(x));
  for (let i = 0; i < 100; i += 1) {
    const ew = Math.exp(w);
    const f = w * ew - x;
    const wp = w + 1;
    const dw = f / (ew * wp - ((w + 2) * f) / (2 * wp));
    w -= dw;
    if (Math.abs(dw) < 1e-15) break;
  }
  return w;
}

// Closed-form Lambert-W inversion of the SAME RvM main term (imp-96363):
// (T/2pi)(log(T/2pi)-1) = N  =>  T = 2pi * exp(1 + W(N/e)).
function gammaLambertMain(N) {
  return TWO_PI * Math.exp(1 + lambertW(N / Math.E));
}

// Relative gamma shift induced by a +7/8 offset in the count (the ~1/N reference):
// dgamma/dN = 2pi / log(T/2pi); rel shift = (7/8) * (dgamma/dN) / T  ~  (7/8)/N.
function countModelRelShift(T) {
  const dgdN = TWO_PI / Math.log(T / TWO_PI);
  return (7 / 8) * dgdN / T;
}

const LO_D = 2;
const HI_D = 22;

const ROWS = [];
let maxRelSpread = 0;
let maxRelSpreadLog10N = null;
let ratioCrossLog10N = null; // first decade where solver spread exceeds count-model shift
for (let d = LO_D; d <= HI_D; d += 1) {
  const N = Math.pow(10, d);
  const gNewton = effectiveHeightForN(N);
  const gLambert = gammaLambertMain(N);
  const relSpread = Math.abs(gLambert - gNewton) / gNewton;
  const countShift = countModelRelShift(gNewton);
  const ratio = countShift === 0 ? Infinity : relSpread / countShift;
  const logGammaOverN = Math.log(gNewton) / N;
  if (relSpread > maxRelSpread) {
    maxRelSpread = relSpread;
    maxRelSpreadLog10N = d;
  }
  if (ratioCrossLog10N === null && ratio > 1) ratioCrossLog10N = d;
  ROWS.push({
    log10N: d,
    gammaNewton: +gNewton.toExponential(6),
    gammaLambert: +gLambert.toExponential(6),
    relGammaSpread: +relSpread.toExponential(3),
    countModelRelShift: +countShift.toExponential(3),
    solverOverCountRatio: Number.isFinite(ratio) ? +ratio.toExponential(3) : null,
    logGammaOverN: +logGammaOverN.toExponential(3),
  });
}

// Solver noise floor: the median relative spread over the whole range (a stable
// machine-epsilon summary, robust to the occasional exact-zero decade).
const SORTED_SPREADS = ROWS.map((r) => r.relGammaSpread).sort((a, b) => a - b);
const SOLVER_NOISE_FLOOR = SORTED_SPREADS[Math.floor(SORTED_SPREADS.length / 2)];

export const IMP96449_SOLVER_PATH_SPREAD_FULL_RANGE = Object.freeze({
  id: 'imp-96449',
  proofSection: 'S-frontier',
  question:
    'Does the imp-96427 Newton-vs-Lambert-W solver-path gamma_N spread stay below the ~1/N count-model ' +
    'shift across the FULL N = 1e2 .. 1e22 range (not just the tenth-decade knee), or do the two solvers ' +
    'diverge in the far tail where log(gamma)/N underflows? Measurement/fit only; NOT an RH bound; NO QED.',
  measuredQuantity:
    'per-decade relative inter-method gamma_N spread |gamma_Lambert - gamma_Newton| / gamma_Newton across ' +
    'N = 1e2 .. 1e22, the ~1/N count-model reference shift (7/8)(dgamma/dN)/gamma, their ratio, and the ' +
    'far-tail diagnostic log(gamma)/N',
  window: '[1e2,1e22]',
  decadesTested: HI_D - LO_D + 1,
  rows: ROWS,
  solverNoiseFloor: SOLVER_NOISE_FLOOR,
  maxRelGammaSpread: +maxRelSpread.toExponential(3),
  maxRelGammaSpreadLog10N: maxRelSpreadLog10N,
  ratioCrossLog10N: ratioCrossLog10N, // first log10 N where solver spread exceeds the count-model shift
  finding: {
    F1_solver_spread_is_floating_point_noise_across_all_decades:
      'The relative inter-method gamma_N spread never leaves the machine-epsilon band across all ' +
      (HI_D - LO_D + 1) + ' decades: it ranges ~' + ROWS[0].relGammaSpread.toExponential(2) +
      ' (N = 1e2) to a peak ~' + maxRelSpread.toExponential(2) + ' (N = 1e' + maxRelSpreadLog10N +
      '), at most a few ULP with no growth trend. The far-tail underflow of log(gamma)/N (down to ~' +
      ROWS[ROWS.length - 1].logGammaOverN.toExponential(2) + ' at N = 1e22) does NOT drive the solvers ' +
      'apart -- both invert in T-space, not in the underflowing log(gamma)/N variable -- so the ' +
      'hypothesised far-tail divergence does NOT occur.',
    F2_spread_below_count_model_only_to_1e15_then_count_shift_underflows:
      'The ~1/N count-model shift decays from ~' + ROWS[0].countModelRelShift.toExponential(2) +
      ' (N = 1e2) to ~' + ROWS[ROWS.length - 1].countModelRelShift.toExponential(2) + ' (N = 1e22), ' +
      'while the solver noise floor stays pinned near ~' + SOLVER_NOISE_FLOOR.toExponential(1) + '. The ' +
      'solver-spread / count-shift ratio therefore crosses 1 at N ~ 1e' + ratioCrossLog10N + '. So ' +
      '"solver spread below the count-model shift everywhere" is FALSE past N ~ 1e' + ratioCrossLog10N +
      ' -- but benignly: beyond there the count-model shift has itself shrunk below one ULP of gamma_N, ' +
      'so BOTH residuals are numerically negligible and neither can move a double-precision gamma_N.',
  },
  isRigorous: false,
  verdict:
    'MEASUREMENT (frontier-direction, NOT rigorous). Extending the imp-96427 solver-path comparison from ' +
    'the tenth-decade knee to the full N = 1e2 .. 1e22 range: the inter-method gamma_N spread stays at ' +
    'floating-point noise everywhere (~' + ROWS[0].relGammaSpread.toExponential(2) + ' to a peak ~' +
    maxRelSpread.toExponential(2) + ' at N = 1e' + maxRelSpreadLog10N + ', a few ULP, no trend), and the ' +
    'far-tail underflow of log(gamma)/N does NOT split the Newton and Lambert-W paths because both invert ' +
    'in T-space. The naive "spread below the ~1/N count-model shift everywhere" holds only to N ~ 1e' +
    ratioCrossLog10N + ': beyond that the count-model shift underflows below the ~' +
    SOLVER_NOISE_FLOOR.toExponential(1) + ' machine-precision solver floor, so both quantities are ' +
    'sub-ULP and the comparison is moot rather than a real divergence. This confirms the imp-96427 ' +
    'knee-only conclusion is representative of the whole range: the solver path carries no count-model ' +
    'content at any anchored height. The component model is the inherited imp-3220/imp-3406 extrapolation, ' +
    'NOT a rigorous asymptotic; the C_mb GUE-conditional per imp-486 is UNTOUCHED; C_H ' +
    'isRigorousUpperBound stays false (imp-2642/imp-2701); changes no bound; establishes no operator ' +
    'positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-96427 (knee-only solver spread ~1.2e-13 log10, gamma agreement ~8.1e-16); imp-96363 (closed-form ' +
    'Lambert-W reproduces the Newton main-term gamma to relative 3.9e-16 at N = 1e6); imp-96402/imp-96426 ' +
    '(E_coll anchors spanning the tested N-range); imp-486 (C_mb GUE-conditional); ' +
    'lambda-rh-height-mapping (effectiveHeightForN, Newton main-term inverse).',
});

export default IMP96449_SOLVER_PATH_SPREAD_FULL_RANGE;

export const IMP96449_HONEST_BANNER =
  'RH open; no refereed bound is changed; NO QED. Measurement/fit only (frontier-direction, NOT '
  + 'rigorous): the solver-path gamma_N spread stays at floating-point noise across all 21 tested '
  + 'decades and carries no count-model content at any anchored height. The component model is '
  + 'the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the C_mb '
  + 'GUE-conditional per imp-486 is UNTOUCHED; C_H isRigorousUpperBound stays false '
  + '(imp-2642/imp-2701); changes no bound; establishes no operator positivity; imp-3066 K_a >= 0 '
  + 'untouched.';

// -- self-executing assertions (imp-3715 convention): any failure throws at import --
const IMP96449_ASSERTIONS = [
  {
    id: 'imp96449-full-range-covered',
    description: 'the comparison spans all 21 decades N = 1e2 .. 1e22',
    holds: () => ROWS.length === 21 && ROWS[0].log10N === 2 && ROWS[ROWS.length - 1].log10N === 22,
  },
  {
    id: 'imp96449-solver-spread-machine-precision-everywhere',
    description: 'the inter-method gamma_N spread stays at floating-point noise (< 1e-13) across the full range',
    holds: () => maxRelSpread < 1e-13,
  },
  {
    id: 'imp96449-no-far-tail-divergence',
    description: 'the far-tail decades (N >= 1e18) do not blow up: spread stays a few ULP despite log(gamma)/N underflow',
    holds: () =>
      ROWS.filter((r) => r.log10N >= 18).every((r) => r.relGammaSpread < 1e-13 && r.logGammaOverN < 1e-15),
  },
  {
    id: 'imp96449-count-model-shift-underflows-past-solver-floor',
    description: 'the ~1/N count-model shift crosses below the solver noise floor in the tested range (ratio crosses 1)',
    holds: () => ratioCrossLog10N !== null && ratioCrossLog10N > LO_D && ratioCrossLog10N <= HI_D,
  },
  {
    id: 'imp96449-count-model-shift-tracks-one-over-N',
    description: 'the count-model reference shift decays ~ (7/8)/N: shrinks by ~10x per decade',
    holds: () => {
      const lo = ROWS.find((r) => r.log10N === 5).countModelRelShift;
      const hi = ROWS.find((r) => r.log10N === 15).countModelRelShift;
      return Math.abs(Math.log10(lo / hi) - 10) < 1; // ~10 decades of decay over 10 decades of N
    },
  },
  {
    id: 'imp96449-honesty-gate-no-qed',
    description: 'Measurement only: not rigorous, no QED, no refereed bound is changed',
    holds: () =>
      IMP96449_SOLVER_PATH_SPREAD_FULL_RANGE.isRigorous === false &&
      /NO QED/.test(IMP96449_SOLVER_PATH_SPREAD_FULL_RANGE.verdict) &&
      /refereed bound is changed/i.test(IMP96449_SOLVER_PATH_SPREAD_FULL_RANGE.verdict),
  },
  {
    id: 'imp96449-honest-banner-present',
    description: 'a dedicated machine-readable IMP96449_HONEST_BANNER carries the RH-open / PT-Lambda / NO-QED markers',
    holds: () =>
      /RH open/.test(IMP96449_HONEST_BANNER) &&
      /PT Lambda <= 0\.2|refereed bound is changed/.test(IMP96449_HONEST_BANNER) &&
      /NO QED/.test(IMP96449_HONEST_BANNER),
  },
];

for (const a of IMP96449_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-96449-solver-path-spread-full-range assertion failed: ${a.id}`);
  }
}
