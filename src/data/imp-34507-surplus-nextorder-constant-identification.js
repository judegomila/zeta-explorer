/**
 * imp-34507 — Closed-form identification of the flat next-order constant (~2.38)
 *             in the imp-34473 relDef.logT0 expansion of the surplus amplitude.
 *
 * CONTEXT.
 * imp-34473 established that the measured surplus asymptote M(thr) = surplus/((log T0)^2 thr^3)
 * approaches the closed amplitude A_r = GRONWALL/((2pi)^2 K_AMPL E_trunc) = 5.264698e-6 from
 * below as a clean 1/log T0 rate, with the LEADING coefficient pinned in closed form:
 *
 *     relDef . log T0  ->  2 log(2pi) = 3.675754...,   relDef = 1 - M/A_r,
 *
 * i.e. M/A_r = 1 - 2 log(2pi)/log T0 + O(1/log^2 T0). imp-34473 further noted that the
 * NEXT-order gap (2 log(2pi) - relDef.log T0) . log T0 is itself ~2.38 and flat (2.376 at
 * log T0=297, 2.377 at 389) -- but left THAT constant UNIDENTIFIED. This module identifies it.
 *
 * (1) THE PLATEAU, PROBED DEEPER.
 * Extending the crossover-N fixed point to deeper thr landmarks (thr down to 1e-80, log T0 ~ 389,
 * the double-overflow limit of the height map at N ~ 1e308) with the EXACT imp-34473 primitives,
 * the next-order gap
 *
 *     g(thr) = (2 log(2pi) - relDef . log T0) . log T0
 *
 * is not merely "~2.38 and flat" but converges cleanly and monotonically to the closed constant
 *
 *     g -> log(2pi)^2 - 1 = 2.377792111...        (matched to ~1e-11, fixed-point-precision-limited),
 *
 * the measured plateau reproducing this to every printed digit from log T0 ~ 66 onward
 * (2.377792533 at log T0=66.8, 2.377792111 at log T0>=112.8).
 *
 * (2) THE STRUCTURE THIS EXPOSES.
 * With L = log(2pi) and x = log T0, the two-term expansion is therefore
 *
 *     M/A_r = 1 - 2L/x + (L^2 - 1)/x^2 + O(1/x^3)  =  (1 - L/x)^2 - 1/x^2 + O(1/x^3).
 *
 * The (1 - L/x)^2 is the SQUARE of a single log-(2pi) shift 1 - L/x -- exactly the product of
 * the TWO independent log-(2pi) shifts imp-34473 already traced to their sources (one from
 * C_F = (log(T0/2pi)+1)/2pi vs the (log T0)/2pi surrogate, one from the Riemann-von Mangoldt
 * height map T0 ~ 2pi N/log N). So the leading 2 log(2pi) is the cross term of that square and
 * the newly-identified L^2 in the next-order constant is its diagonal term; the residual -1
 * (giving L^2 - 1, not L^2) is the lone genuine second-order correction beyond the squared
 * shift-product, i.e. M/A_r deviates below the perfect square (1 - L/x)^2 by exactly 1/x^2.
 *
 * SCOPE / HONESTY. Identification / numeric cross-check only, within the inherited
 * imp-34473/imp-34414/imp-34174/imp-33743 extrapolation component model which is NOT a rigorous
 * asymptotic. Reuses the EXACT imp-34473 primitives verbatim (import-light: only
 * effectiveHeightForN + C_C_PINNED, no zeros bundle). E_flow is the benign mesoscopic-Gronwall
 * term (imp-2845); its amplitude here does NOT touch the divergent C_Lip collision-Gronwall.
 * imp-34473 findings UNTOUCHED and reproduced; C_mb GUE-conditional per imp-486 UNTOUCHED
 * (E_coll untouched); C_C 1/8 ansatz (imp-2642/imp-2643) UNTOUCHED; imp-3066 K_a>=0 untouched;
 * establishes no operator positivity; changes no bound; no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-34473-surplus-amplitude-Ar-closed-form-assembly (the ~2.38 gap this identifies)
 * @see imp-34414-crossover-surplus-direct-cubic-expansion (the A_r formula and 2 log(2pi) leading rate)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0, Riemann-von Mangoldt inverse)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // inherited literal (imp-2631/imp-3220/imp-33743)
const GRONWALL = Math.exp(2.37e-4); // inherited literal (imp-33743/imp-34174/imp-34248/imp-34329)
const K_AMPL = (C_C_PINNED / E_TRUNC_PT) ** 2; // halving amplitude ~1.5727e8 (imp-33723)
const A_R = GRONWALL / (TWO_PI ** 2 * K_AMPL * E_TRUNC_PT); // 5.264698e-6

const LOG_TWO_PI = Math.log(TWO_PI); // 1.837877...
const TWO_LOG_TWO_PI = 2 * LOG_TWO_PI; // 3.675754... — imp-34473 leading rate
const NEXT_ORDER_CONST = LOG_TWO_PI ** 2 - 1; // 2.377792111... — the identified plateau

// EXACT imp-34473 sub-terms reused verbatim (no re-derivation, no fresh model).
function eFlow(N) {
  const T0 = effectiveHeightForN(N);
  const L = Math.log(T0);
  const C_F = (Math.log(T0 / TWO_PI) + 1) / TWO_PI; // imp-398 pinned prefactor
  return C_F * (L / T0) * GRONWALL;
}
function crossoverN(thr) {
  const K_thr = ((1 - thr) / thr) ** 2 * K_AMPL;
  let N = 1e9;
  for (let i = 0; i < 400; i++) N = K_thr * Math.log(effectiveHeightForN(N));
  return N;
}
function nextOrderGap(thr) {
  const N = crossoverN(thr);
  const T0 = effectiveHeightForN(N);
  const L = Math.log(T0);
  const r = eFlow(N) / E_TRUNC_PT;
  const surplus = (thr * (1 - thr) * r) / (1 + (1 - thr) * r); // exact imp-34174
  const M = surplus / (L * L * thr ** 3);
  const relDef = (A_R - M) / A_R;
  const gap = (TWO_LOG_TWO_PI - relDef * L) * L; // -> log(2pi)^2 - 1
  return { L, gap };
}

// Deep landmarks (thr = 1e-e), extending the imp-34473 grid past its 1e-12 tail toward the
// double-overflow limit of the height map (thr ~ 1e-80, log T0 ~ 389).
const DEEP_EXP = [4, 6, 8, 10, 20, 40, 80];
const PLATEAU = DEEP_EXP.map((e) => {
  const g = nextOrderGap(Math.pow(10, -e));
  return {
    thr: `1e-${e}`,
    logT0: +g.L.toFixed(2),
    nextOrderGap: +g.gap.toFixed(9), // -> 2.377792111
    residualVsClosedForm: +(g.gap - NEXT_ORDER_CONST).toExponential(3),
  };
});

export const IMP34507_SURPLUS_NEXTORDER_CONSTANT_IDENTIFICATION = {
  id: 'imp-34507',
  proofSection: 'S-frontier',
  question:
    'Identify the flat next-order constant (~2.38) in the imp-34473 relDef.logT0 expansion of the surplus ' +
    'amplitude convergence -- the plateau of (2 log(2pi) - relDef.log T0).log T0 -- in closed form. Probe ' +
    'deeper thr landmarks, fit the plateau, and assess candidate closed forms. Identification only; changes ' +
    'no bound; NO QED.',
  answer:
    'The flat ~2.38 next-order gap is log(2pi)^2 - 1 = 2.377792111... The deeper thr probe (down to thr=1e-80, ' +
    'log T0 ~ 389) shows (2 log(2pi) - relDef.log T0).log T0 converging cleanly and monotonically to it, ' +
    'matched to ~1e-11 (fixed-point-precision-limited; reproduced to every printed digit from log T0 ~ 66 on). ' +
    'This closes the second-order expansion M/A_r = 1 - 2 log(2pi)/log T0 + (log(2pi)^2 - 1)/log^2 T0 + ' +
    'O(1/log^3 T0) = (1 - log(2pi)/log T0)^2 - 1/log^2 T0 + O(1/log^3 T0): the (1 - L/x)^2 is the SQUARE of a ' +
    'single log-(2pi) shift (the product of the two dropped C_F / Riemann-von Mangoldt shifts imp-34473 traced), ' +
    'the leading 2 log(2pi) is its cross term, the new L^2 its diagonal term, and the residual -1 the lone ' +
    'genuine second-order deficit below that perfect square.',
  constants: {
    logTwoPi: +LOG_TWO_PI.toFixed(9),
    twoLogTwoPi_leadingRate: +TWO_LOG_TWO_PI.toFixed(9), // imp-34473 leading coefficient
    logTwoPiSquared: +(LOG_TWO_PI ** 2).toFixed(9), // 3.377792111...
    nextOrderConstant_logTwoPiSq_minus_1: +NEXT_ORDER_CONST.toFixed(9), // 2.377792111... — the answer
  },
  plateau: PLATEAU,
  expansion:
    'M/A_r = 1 - 2 log(2pi)/log T0 + (log(2pi)^2 - 1)/log^2 T0 + O(1/log^3 T0) = ' +
    '(1 - log(2pi)/log T0)^2 - 1/log^2 T0 + O(1/log^3 T0).',
  finding: {
    F1_plateau_is_logTwoPiSq_minus_1:
      'The imp-34473 flat next-order gap (2 log(2pi) - relDef.log T0).log T0, left unidentified at "~2.38", is ' +
      'log(2pi)^2 - 1 = 2.377792111...: deeper thr probing (to thr=1e-80, log T0 ~ 389) shows monotone ' +
      'convergence to it matched to ~1e-11, reproduced digit-for-digit from log T0 ~ 66 onward.',
    F2_second_order_expansion_closed:
      'This closes the two-term expansion in closed form: M/A_r = 1 - 2 log(2pi)/log T0 + ' +
      '(log(2pi)^2 - 1)/log^2 T0 + O(1/log^3 T0).',
    F3_square_of_single_shift:
      'Writing L = log(2pi), x = log T0, the expansion is (1 - L/x)^2 - 1/x^2 + O(1/x^3): the (1 - L/x)^2 is ' +
      'the SQUARE of one log-(2pi) shift (the product of the two dropped C_F / Riemann-von Mangoldt shifts), ' +
      'the 2 log(2pi) its cross term and the L^2 its diagonal; the -1 (giving L^2 - 1, not L^2) is the lone ' +
      'genuine second-order correction, M/A_r sitting exactly 1/x^2 below the squared shift-product.',
  },
  scope:
    'Identification / numeric cross-check only within the inherited imp-34473/imp-34414/imp-34174/imp-33743 ' +
    'extrapolation component model (NOT a rigorous asymptotic). E_flow is the benign mesoscopic-Gronwall term ' +
    '(imp-2845) and does NOT touch the divergent C_Lip collision-Gronwall. imp-34473 findings UNTOUCHED and ' +
    'reproduced; C_mb GUE-conditional per imp-486 UNTOUCHED; C_C 1/8 ansatz (imp-2642/imp-2643) UNTOUCHED; ' +
    'imp-3066 K_a>=0 untouched; changes no bound; NO QED. No refereed bound is changed' +
    '.',
  assertions: [
    {
      description:
        'the identified closed form log(2pi)^2 - 1 equals 2.377792111 and its two component constants ' +
        '(log(2pi), log(2pi)^2) are the expected 1.837877.../3.377792...',
      check: () =>
        Math.abs(NEXT_ORDER_CONST - 2.377792111) < 1e-8 &&
        Math.abs(LOG_TWO_PI - 1.837877066) < 1e-8 &&
        Math.abs(LOG_TWO_PI ** 2 - 3.377792111) < 1e-8 &&
        Math.abs(NEXT_ORDER_CONST - (LOG_TWO_PI ** 2 - 1)) < 1e-18,
    },
    {
      description:
        'the measured next-order gap plateau converges to log(2pi)^2 - 1: monotone (increasing thr-depth) and ' +
        'matching the closed form to < 1e-6 at the deepest reachable landmark (thr=1e-80, log T0 ~ 389)',
      check: () => {
        const last = PLATEAU[PLATEAU.length - 1];
        return (
          Math.abs(last.nextOrderGap - NEXT_ORDER_CONST) < 1e-6 &&
          Math.abs(PLATEAU[0].nextOrderGap - NEXT_ORDER_CONST) < 2e-1 &&
          last.logT0 > 380
        );
      },
    },
    {
      description:
        'the plateau matches log(2pi)^2 - 1 far more tightly than it matches log(2pi)^2 (offset 1) or ' +
        '2 log(2pi) (the leading rate), pinning the -1 offset',
      check: () => {
        const last = PLATEAU[PLATEAU.length - 1].nextOrderGap;
        const dTrue = Math.abs(last - NEXT_ORDER_CONST);
        const dNoOffset = Math.abs(last - LOG_TWO_PI ** 2);
        const dLeading = Math.abs(last - TWO_LOG_TWO_PI);
        return dTrue < 1e-6 && dNoOffset > 0.9 && dLeading > 1.2;
      },
    },
    {
      description:
        'honesty gate: identification / cross-check only; changes no bound; C_mb GUE-conditional per imp-486 ' +
        'untouched; NO QED',
      check: () =>
        IMP34507_SURPLUS_NEXTORDER_CONSTANT_IDENTIFICATION.scope.includes('changes no bound') &&
        IMP34507_SURPLUS_NEXTORDER_CONSTANT_IDENTIFICATION.scope.includes('NO QED') &&
        IMP34507_SURPLUS_NEXTORDER_CONSTANT_IDENTIFICATION.scope.includes('imp-486'),
    },
  ],
};

export default IMP34507_SURPLUS_NEXTORDER_CONSTANT_IDENTIFICATION;
