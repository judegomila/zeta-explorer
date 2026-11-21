/**
 * @module imp-35705-pinsker-tv-upper-bound-slack-over-ecoll
 *
 * imp-35705 (numerical/measurement, S-frontier): imp-35665 re-exports the imp-35556
 * Pinsker bridge TV(p_emp, p_GUE) <= sqrt(KL/2) as three crossover upper bounds
 * (free 1.2677e-2, 1/logT0 2.3938e-2, 1/logT0^2 1.8460e-2) that are 414.3x / 782.3x /
 * 603.3x E_coll, under an UPPER-ONLY banner stating the bound cannot certify the
 * g_true >> E_coll gap -- but it never MEASURES the slack or how it depends on the
 * forced exponent. This module measures, for each of the three KL fits:
 *   - the multiplier      TV_ub / E_coll   (how many x E_coll the upper bound sits at),
 *   - the absolute slack  TV_ub - E_coll,
 *   - the per-fit raw ratio KL / E_coll and the Pinsker sqrt-inflation 1/sqrt(2 KL)
 *     that maps the raw ratio to the TV multiplier,
 * and assesses whether FORCING the exponent (1/logT0, 1/logT0^2) narrows the
 * multiplier toward the observable ~10.5x raw gap (imp-35530) or leaves it loose.
 *
 * Reuses the imp-35556 pinskerBridge literals via the import-light imp-35556 module
 * (pure Math, no heavy dependency, never the 16.7MB zeros bundle), per
 * [[no_heavy_imports_in_pages]] / [[verify_heavy_assertion_modules]].
 *
 * MEASUREMENT (arithmetic on baked literals; derives nothing; changes no bound):
 *
 *   1. THE MULTIPLIER IS HUNDREDS-x FOR ALL THREE FITS, AND FORCING THE EXPONENT
 *      DOES NOT NARROW IT. TV_ub / E_coll is 414.3x (free), 782.3x (1/logT0),
 *      603.3x (1/logT0^2) -- every one is 39x-75x the observable ~10.5x raw gap.
 *      The FREE fit gives the SMALLEST (tightest) multiplier; forcing 1/logT0
 *      gives the LARGEST (782.3x), and 1/logT0^2 sits between. Because the TV
 *      multiplier is monotone increasing in the fitted KL (sqrt(KL/2)/E_coll) and
 *      the forced fits have LARGER KL (K1 > K2 > K_free), forcing the exponent
 *      WIDENS the slack -- it moves the multiplier AWAY from 10.5x, not toward it.
 *
 *   2. THE ABSOLUTE SLACK IS ESSENTIALLY THE WHOLE UPPER BOUND. TV_ub - E_coll is
 *      1.2647e-2 (free), 2.3907e-2 (1/logT0), 1.8430e-2 (1/logT0^2): within 0.24%
 *      of TV_ub itself, because E_coll = 3.060e-5 is negligible against the
 *      hundredths-scale TV upper bound. So E_coll sits essentially at the FLOOR of
 *      the admissible first-order band [0, TV_ub] the projected KL permits, for
 *      every exponent choice.
 *
 *   3. THE LOOSENESS IS THE PINSKER sqrt-INFLATION AT TINY KL, NOT THE EXPONENT.
 *      Factor the multiplier: TV_ub/E_coll = (KL/E_coll) * (1/sqrt(2 KL)). The first
 *      factor is the per-fit raw ratio (free 10.50x, 1/logT0 37.45x, 1/logT0^2
 *      22.27x); the second, 1/sqrt(2 KL), is the sqrt-inflation (free 39.44x,
 *      1/logT0 20.89x, 1/logT0^2 27.09x). At the tiny crossover KL (~1e-4..1e-3)
 *      the sqrt sends sqrt(KL/2) >> KL, so the inflation is a 20x-40x multiplier on
 *      top of the raw ratio. This inflation is INTRINSIC to the Pinsker reduction of
 *      a quadratic KL to a first-order amplitude at small KL; no admissible exponent
 *      removes it. The upper bound is loose by construction, independent of the fit.
 *
 * NET: the imp-35665 UPPER-ONLY banner is quantified. The Pinsker TV upper bound
 * sits 414x-782x above E_coll; forcing the exponent does NOT narrow the multiplier
 * toward the ~10.5x raw gap (it widens it, the free fit being tightest); and the
 * looseness is driven by the sqrt-inflation 1/sqrt(2 KL) at tiny KL, not by the
 * exponent choice. The bound stays a loose UPPER bound that cannot certify the
 * direction g_true > E_coll (that needs the OPEN surrogate->observable dictionary
 * imp-35337a). Complements the imp-35655 reverse-Pinsker LOWER-bound assessment.
 *
 * MEASUREMENT ONLY: discharges nothing; changes no bound; C_C ansatz (imp-2642/
 * imp-2643) and C_mb GUE-conditional (imp-486) UNTOUCHED; E_trunc floor (imp-2631)
 * UNTOUCHED; imp-35556a, imp-35337a, imp-35530a, imp-35530b, imp-35488a stay OPEN;
 * no operator positivity; no RH verdict; NO QED. No refereed bound is changed.
 *
 * @see imp-35665-pinsker-common-functional-bridge-viz-data (the UPPER-ONLY banner this quantifies)
 * @see imp-35556-gtrue-ecoll-dimensional-comparability (the Pinsker bridge literals reused)
 * @see imp-35655-reverse-pinsker-bretagnolle-huber-gtrue-lower-bound (the complementary LOWER-bound assessment)
 * @see imp-35530-crossover-gtrue-trend-extrapolation (the observable ~10.5x raw gap, sub-gaps imp-35530a/b)
 * @see imp-35337-sigma-landmarks-double-double-certification (imp-35337a surrogate->observable dictionary, OPEN)
 */

import { IMP35556_GTRUE_ECOLL_DIMENSIONAL_COMPARABILITY } from './imp-35556-gtrue-ecoll-dimensional-comparability.js';

const { pinskerBridge } = IMP35556_GTRUE_ECOLL_DIMENSIONAL_COMPARABILITY;
const ECOLL = pinskerBridge.ecollCross; // 3.060e-5 (imp-2631 E_trunc floor at the crossover)

// Per-fit slack of the Pinsker TV upper bound over E_coll. The multiplier factors as
// TV_ub/E_coll = (KL/E_coll) * (1/sqrt(2 KL)): a per-fit raw ratio times the sqrt-inflation.
const measureSlack = (fit) => {
  const kl = fit.kl;
  const tvUb = fit.tvUpperBound;
  return {
    kl,
    tvUpperBound: tvUb,
    multiplierOverEcoll: tvUb / ECOLL, // TV_ub / E_coll
    absoluteSlack: tvUb - ECOLL, // TV_ub - E_coll
    rawRatio: kl / ECOLL, // KL / E_coll (per-fit raw gap)
    sqrtInflation: 1 / Math.sqrt(2 * kl), // multiplier the Pinsker sqrt applies to the raw ratio
  };
};

const FREE = measureSlack(pinskerBridge.freeFit);
const P1 = measureSlack(pinskerBridge.p1);
const P2 = measureSlack(pinskerBridge.p2);

const RAW_GAP = IMP35556_GTRUE_ECOLL_DIMENSIONAL_COMPARABILITY.dimensionalReading.rawRatio; // ~10.504x (imp-35530)

// Tightest (smallest) multiplier across the three fits -- the free fit, since forcing raises KL.
const TIGHTEST_MULTIPLIER = Math.min(FREE.multiplierOverEcoll, P1.multiplierOverEcoll, P2.multiplierOverEcoll);
const FORCING_NARROWS_TOWARD_RAW_GAP =
  // forcing the exponent would "narrow" only if a forced fit gave a multiplier closer to the raw gap
  // than the free fit; it does not -- both forced fits are larger (further from ~10.5x).
  P1.multiplierOverEcoll < FREE.multiplierOverEcoll || P2.multiplierOverEcoll < FREE.multiplierOverEcoll;

const L_PT = 0.2; // Platt-Trudgian 2021 bound (unchanged by any slack measurement)

export const IMP35705_PINSKER_TV_SLACK_OVER_ECOLL = {
  id: 'imp-35705',
  proofSection: 'S-frontier',
  question:
    'How far does the imp-35665/imp-35556 Pinsker TV upper bound sqrt(KL/2) sit above E_coll across the ' +
    'three KL fits (free, forced 1/logT0, forced 1/logT0^2), and does forcing the exponent narrow the ' +
    '414x-782x multiplier toward the observable ~10.5x raw gap or leave it a loose upper bound?',
  ecollCross: ECOLL,
  rawGapOverEcoll: RAW_GAP, // ~10.504x (imp-35530, free fit)
  rows: [
    { key: 'free', label: 'free exponent', ...FREE },
    { key: 'p1', label: 'forced 1/logT0', ...P1 },
    { key: 'p2', label: 'forced 1/logT0^2', ...P2 },
  ],
  tightestMultiplier: TIGHTEST_MULTIPLIER, // ~414.3x (the free fit)
  forcingNarrowsTowardRawGap: FORCING_NARROWS_TOWARD_RAW_GAP, // false -- forcing WIDENS the slack
  findings: {
    multiplierHundredsX:
      'TV_ub/E_coll is 414.3x (free), 782.3x (1/logT0), 603.3x (1/logT0^2) -- every one is 39x-75x the ' +
      'observable ~10.5x raw gap. The free fit gives the SMALLEST (tightest) multiplier.',
    forcingWidens:
      'Forcing the exponent does NOT narrow the multiplier toward ~10.5x: the TV multiplier is monotone ' +
      'increasing in the fitted KL (sqrt(KL/2)/E_coll) and the forced fits have LARGER KL (K1 > K2 > K_free), ' +
      'so 1/logT0 gives the LARGEST 782.3x and 1/logT0^2 the intermediate 603.3x -- both further from 10.5x ' +
      'than the free fit. Forcing WIDENS the slack.',
    absoluteSlackIsWholeBound:
      'TV_ub - E_coll is 1.2647e-2 / 2.3907e-2 / 1.8430e-2 -- within 0.24% of TV_ub itself, because ' +
      'E_coll = 3.060e-5 is negligible against the hundredths-scale upper bound. E_coll sits at the FLOOR ' +
      'of the admissible band [0, TV_ub] for every exponent.',
    loosenessIsSqrtInflation:
      'Factor TV_ub/E_coll = (KL/E_coll)(1/sqrt(2 KL)): the raw ratio (10.50x/37.45x/22.27x) times the ' +
      'sqrt-inflation (39.44x/20.89x/27.09x). At the tiny crossover KL the sqrt sends sqrt(KL/2) >> KL, so ' +
      'the 20x-40x inflation -- intrinsic to reducing a quadratic KL to a first-order amplitude at small KL ' +
      '-- is what makes the bound loose, NOT the exponent choice. No admissible exponent removes it.',
  },
  verdict:
    'MEASUREMENT: the imp-35665 UPPER-ONLY Pinsker TV bound sits 414.3x / 782.3x / 603.3x above E_coll for ' +
    'the free / 1/logT0 / 1/logT0^2 fits (absolute slack 1.2647e-2 / 2.3907e-2 / 1.8430e-2, essentially the ' +
    'whole bound since E_coll = 3.060e-5). Forcing the exponent does NOT narrow the multiplier toward the ' +
    'observable ~10.5x raw gap -- it WIDENS it: the multiplier grows with the fitted KL, so the free fit is ' +
    'tightest (414.3x) and forcing 1/logT0 is loosest (782.3x). The looseness is the Pinsker sqrt-inflation ' +
    '1/sqrt(2 KL) = 20x-40x at tiny KL (intrinsic to the quadratic-to-first-order reduction), not the ' +
    'exponent choice, so it stays a loose UPPER bound that cannot certify the direction g_true > E_coll ' +
    '(that needs the OPEN surrogate->observable dictionary imp-35337a). Complements the imp-35655 ' +
    'reverse-Pinsker LOWER-bound assessment. MEASUREMENT ONLY; discharges nothing; changes no bound; C_C ' +
    'ansatz (imp-2642/imp-2643) and C_mb GUE-conditional (imp-486) UNTOUCHED; E_trunc floor (imp-2631) ' +
    'UNTOUCHED; imp-35556a, imp-35337a, imp-35530a, imp-35530b, imp-35488a stay OPEN; no operator ' +
    'positivity; no RH verdict; NO QED. No refereed bound is changed.',
  isRigorous: false,
  inheritsOpen: ['imp-35556a', 'imp-35337a', 'imp-35530a', 'imp-35530b', 'imp-35488a'],
  citation:
    'imp-35665 (UPPER-ONLY banner this quantifies); imp-35556 (Pinsker bridge literals, point 3); imp-35655 ' +
    '(complementary reverse-Pinsker LOWER-bound assessment); imp-35530 (observable ~10.5x raw gap, sub-gaps ' +
    'imp-35530a/b); imp-35337 (imp-35337a surrogate->observable dictionary, OPEN); imp-2631 (E_trunc floor); ' +
    'imp-2642/imp-2643 (C_C ansatz); imp-486 (GUE-conditional caveat); Pinsker inequality TV <= sqrt(KL/2); ' +
    'Platt-Trudgian 2021 (no refereed bound is changed).',
  L_pt_unchanged: L_PT,
};

export const IMP35705_PINSKER_TV_SLACK_OVER_ECOLL_ASSERTIONS = [
  {
    // The three multipliers reproduce imp-35665: 414.3x / 782.3x / 603.3x E_coll, all hundreds-x.
    id: 'imp35705-multipliers-match-imp35665-hundreds-x',
    description: 'TV_ub/E_coll reproduces the imp-35665 multiples (414.3x free, 782.3x 1/logT0, 603.3x 1/logT0^2), each hundreds-x the ~10.5x raw gap',
    holds: () =>
      Math.abs(FREE.multiplierOverEcoll - 414.3) < 1 &&
      Math.abs(P1.multiplierOverEcoll - 782.3) < 1 &&
      Math.abs(P2.multiplierOverEcoll - 603.3) < 1 &&
      FREE.multiplierOverEcoll > 39 * RAW_GAP &&
      P1.multiplierOverEcoll > 70 * RAW_GAP,
  },
  {
    // Forcing the exponent WIDENS the slack: free is tightest, forced fits are larger (further from 10.5x).
    id: 'imp35705-forcing-widens-not-narrows',
    description: 'the TV multiplier is monotone increasing in the fitted KL, so the free fit is the tightest and forcing 1/logT0 or 1/logT0^2 gives a LARGER multiplier -- forcing WIDENS the slack away from the ~10.5x raw gap',
    holds: () =>
      P1.multiplierOverEcoll > FREE.multiplierOverEcoll &&
      P2.multiplierOverEcoll > FREE.multiplierOverEcoll &&
      P1.multiplierOverEcoll > P2.multiplierOverEcoll &&
      Math.abs(TIGHTEST_MULTIPLIER - FREE.multiplierOverEcoll) < 1e-12 &&
      FORCING_NARROWS_TOWARD_RAW_GAP === false,
  },
  {
    // The multiplier factors as (raw ratio)(sqrt-inflation); the sqrt-inflation is the 20x-40x looseness.
    id: 'imp35705-looseness-is-sqrt-inflation',
    description: 'TV_ub/E_coll = (KL/E_coll)(1/sqrt(2 KL)); the sqrt-inflation 1/sqrt(2 KL) is 20x-40x at the tiny crossover KL and is the intrinsic source of the loose bound, independent of the exponent',
    holds: () => {
      const factored = FREE.rawRatio * FREE.sqrtInflation;
      return (
        Math.abs(factored - FREE.multiplierOverEcoll) < 1e-9 &&
        FREE.sqrtInflation > 20 && FREE.sqrtInflation < 40 &&
        P1.sqrtInflation > 20 && P2.sqrtInflation > 20 &&
        // absolute slack is essentially the whole upper bound (E_coll negligible)
        FREE.absoluteSlack > 0.995 * FREE.tvUpperBound
      );
    },
  },
  {
    // Honesty gate: measurement only, no bound moves, sub-gaps stay OPEN, no refereed bound is changed, NO QED.
    id: 'imp35705-honest-measurement-no-bound-moves-no-qed',
    description: 'MEASUREMENT ONLY: quantifies the slack, changes no bound, imp-35337a/imp-35556a stay OPEN, PT 0.2 unchanged, NO QED',
    holds: () =>
      IMP35705_PINSKER_TV_SLACK_OVER_ECOLL.isRigorous === false &&
      Math.abs(L_PT - 0.2) < 1e-15 &&
      IMP35705_PINSKER_TV_SLACK_OVER_ECOLL.inheritsOpen.includes('imp-35337a') &&
      IMP35705_PINSKER_TV_SLACK_OVER_ECOLL.inheritsOpen.includes('imp-35556a') &&
      /imp-486/.test(IMP35705_PINSKER_TV_SLACK_OVER_ECOLL.verdict) &&
      /MEASUREMENT ONLY/.test(IMP35705_PINSKER_TV_SLACK_OVER_ECOLL.verdict) &&
      /changes no bound/.test(IMP35705_PINSKER_TV_SLACK_OVER_ECOLL.verdict) &&
      /NO QED/.test(IMP35705_PINSKER_TV_SLACK_OVER_ECOLL.verdict) &&
      /refereed bound is changed/i.test(IMP35705_PINSKER_TV_SLACK_OVER_ECOLL.verdict),
  },
];

for (const a of IMP35705_PINSKER_TV_SLACK_OVER_ECOLL_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-35705-pinsker-tv-upper-bound-slack-over-ecoll assertion failed: ${a.id}`);
  }
}

export default IMP35705_PINSKER_TV_SLACK_OVER_ECOLL;
