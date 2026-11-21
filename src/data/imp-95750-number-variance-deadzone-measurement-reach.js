/**
 * @module imp-95750-number-variance-deadzone-measurement-reach
 *
 * imp-95750 -- ASSESSING how far up the frontier "dead zone" the DIRECT sd(C - E)
 * pointwise-variance measurement can actually reach. imp-95710 measured the
 * finite-height number-variance conservatism only to T = 5e5; imp-95729 placed the
 * imp-3444 E_coll = E_trunc crossover at T0 ~ 1.14e9, ~3.36 decades ABOVE that top
 * and at the log-midpoint of the ~6.78-decade UNMEASURED gap up to the imp-95519
 * verified-height window bottom T = 3.0e12. F4 names this dead zone as the bottleneck.
 * The open question: can the direct measurement be pushed above T = 5e5 toward the
 * crossover using the zero data already in the repo, and if so, how much of the
 * 3.36-decade gap does it close?
 *
 * THE MEASUREMENT CEILING (import-light, no zeros bundle). The sd(C - E) inputs of
 * imp-95710/imp-95562 were formed by windowing the 10^6 Odlyzko ordinates in
 * src/data/zeros-to-1e6.js. That bundle holds exactly N = 1e6 verified ordinates and
 * its LARGEST ordinate is gamma_1e6 = 6.002697e5 (baked literal, the last entry of
 * ZEROS_EXTENDED, provenance Odlyzko zeros1..zeros10). Any windowed pointwise-variance
 * sample at height Tc requires ordinates spanning a local box around Tc, so the ABSOLUTE
 * ceiling for a directly-measured sd(C - E) is Tc <= gamma_1e6 = 6.003e5. A realistic
 * top sample sits somewhat BELOW that ceiling (it needs a half-window of ordinates
 * above it), so 6.003e5 is an UPPER bound on the reachable top height, not the reachable
 * sample height itself.
 *
 * OTHER IN-REPO ZERO DATA (does it extend the reach?). NO. src/data/zeros-first-25.js
 * holds 25 ordinates (T < 100, far below the current window); the imp-360 / imp-962
 * "extended ladder" modules are N-indexed derived plateau/spacing summaries, not
 * additional verified ordinate tables. zeros-to-1e6.js is the single largest verified
 * ordinate table in the repo, so its ceiling gamma_1e6 = 6.003e5 is the reach for the
 * whole repo, not just for that one module.
 *
 * WHAT FRACTION OF THE GAP IS DIRECTLY MEASURABLE.
 *   measured top (imp-95710)         T = 5.0e5    (log10 ~ 5.699)
 *   direct-measurement ceiling        T = 6.003e5 (log10 ~ 5.778)  <- gamma_1e6
 *   crossover (imp-95729)            T0 = 1.14e9  (log10 ~ 9.057)
 *   window bottom (imp-95519)         T = 3.0e12  (log10 ~ 12.477)
 * The gap from the measured top to the crossover is log10(1.14e9 / 5e5) = 3.358 decades.
 * Pushing the top sample from 5e5 up to the ceiling gamma_1e6 adds AT MOST
 * log10(6.003e5 / 5e5) = 0.0794 decade -- about 2.4% of the 3.36-decade gap to the
 * crossover. So ~97.6% of the way to the crossover (and effectively all of the way to
 * the window bottom) stays UNREACHED by direct measurement: from the ceiling gamma_1e6
 * there remain 3.279 decades to the crossover and 6.699 decades to the window bottom.
 *
 * FINDINGS (assessment only).
 *  (F1) The direct sd(C - E) measurement is capped by the largest verified ordinate in
 *       the repo, gamma_1e6 = 6.003e5. No other in-repo zero table reaches higher.
 *  (F2) That ceiling adds at most 0.079 decade above the imp-95710 measured top (5e5),
 *       i.e. ~2.4% of the 3.36-decade gap to the imp-95729 crossover T0 ~ 1.14e9. The
 *       dead zone is essentially UNTOUCHED by extending the direct measurement.
 *  (F3) Consequently the crossover-height conservatism CANNOT be measured directly with
 *       repo data; it remains reliant on the imp-95722 derived envelope r_cap(T)
 *       (Selberg-unconditional numerator + O(1) offset), which is what carries the
 *       conservatism r_cap < 1 across the remaining ~3.28 decades to the crossover (and
 *       on to r_cap(3e12) ~ 0.26 at the window bottom).
 *
 * VERDICT. The direct sd(C - E) pointwise-variance measurement cannot be meaningfully
 * pushed into the dead zone with in-repo data: the largest verified ordinate is
 * gamma_1e6 = 6.003e5, giving a hard ceiling only ~0.079 decade (~2.4%) into the
 * 3.36-decade gap between the imp-95710 measured top (T = 5e5) and the imp-95729
 * crossover (T0 ~ 1.14e9). No other in-repo zero table (zeros-first-25, the imp-360 /
 * imp-962 ladders) reaches higher. So ~97.6% of the way to the crossover, and all of the
 * way to the imp-95519 window bottom T = 3.0e12, stays reliant on the imp-95722 derived
 * envelope rather than on direct measurement. Assessment only; changes no bound; NO QED;
 * no refereed bound is changed; the zero-side route stays PCC/GRH-gated.
 *
 * Import-light: no zeros bundle, no sibling imports. The only zero-dependent input is the
 * baked largest-ordinate literal gamma_1e6 (last entry of ZEROS_EXTENDED); every decade
 * figure is recomputed here in closed form.
 *
 * @see imp-95710-number-variance-ratio-vs-height (conservatism measured to T = 5e5)
 * @see imp-95729-crossover-height-vs-variance-window (crossover T0 ~ 1.14e9, dead zone)
 * @see imp-95722-number-variance-ratio-window-bottom-bound (derived envelope r_cap)
 * @see imp-95519-localized-barrier-sum-prime-zero-nogo (window bottom T = 3.0e12)
 * @see zeros-to-1e6 (ZEROS_EXTENDED, largest ordinate gamma_1e6 = 6.003e5)
 */

// Zero-dependent input (baked): the largest verified ordinate in the repo -- the last
// entry of ZEROS_EXTENDED in src/data/zeros-to-1e6.js (N = 1e6 Odlyzko ordinates).
const GAMMA_1E6 = 600269.6770124451; // gamma_{1,000,000}; the direct-measurement ceiling

// Landmark heights (baked literals from the cited modules).
const MEASURED_TOP_T = 5.0e5; // imp-95710 top of the measured conservatism window
const CROSSOVER_T0 = 1.14e9; // imp-95729 E_coll = E_trunc crossover height
const WINDOW_BOTTOM_T = 3.0e12; // imp-95519 verified-height window bottom

// Decade arithmetic (closed form; recomputed here).
const gapToCrossoverDecades = Math.log10(CROSSOVER_T0 / MEASURED_TOP_T); // ~3.358
const ceilingGainDecades = Math.log10(GAMMA_1E6 / MEASURED_TOP_T); // ~0.079 (upper bound)
const fractionOfGapAttainable = ceilingGainDecades / gapToCrossoverDecades; // ~0.024
const remainingToCrossoverDecades = Math.log10(CROSSOVER_T0 / GAMMA_1E6); // ~3.279
const remainingToWindowBottomDecades = Math.log10(WINDOW_BOTTOM_T / GAMMA_1E6); // ~6.699
const fullDeadZoneDecades = Math.log10(WINDOW_BOTTOM_T / MEASURED_TOP_T); // ~6.778

export const IMP95750_NUMBER_VARIANCE_DEADZONE_MEASUREMENT_REACH = {
  ticket: 'imp-95750',
  proofSection: 'S-frontier',
  question:
    'How far up the ~6.78-decade dead zone can the direct sd(C - E) pointwise-variance ' +
    'measurement reach using in-repo zero data, and how much of the 3.36-decade gap from ' +
    'the imp-95710 measured top (T = 5e5) to the imp-95729 crossover (T0 ~ 1.14e9) does it ' +
    'close vs. what stays reliant on the imp-95722 derived envelope? Assessment only; NO QED.',
  measurementCeiling: {
    largestOrdinate: +GAMMA_1E6.toExponential(6), // 6.002697e5
    source:
      'last entry of ZEROS_EXTENDED (src/data/zeros-to-1e6.js, N = 1e6 Odlyzko ordinates); ' +
      'a windowed sd(C - E) sample needs ordinates around its height, so the absolute ceiling ' +
      'for a directly-measured sample is Tc <= gamma_1e6 = 6.003e5 (a realistic top sample sits ' +
      'below this, needing a half-window of ordinates above it)',
    otherInRepoZeroData:
      'NONE reaches higher: zeros-first-25.js holds 25 ordinates (T < 100); the imp-360 / ' +
      'imp-962 extended ladders are N-indexed derived summaries, not additional verified ordinate ' +
      'tables. zeros-to-1e6.js is the single largest verified ordinate table in the repo.',
  },
  decades: {
    measuredTopT: MEASURED_TOP_T, // 5e5 (imp-95710)
    crossoverT0: CROSSOVER_T0, // 1.14e9 (imp-95729)
    windowBottomT: WINDOW_BOTTOM_T, // 3.0e12 (imp-95519)
    gapToCrossoverDecades: +gapToCrossoverDecades.toFixed(4), // ~3.36
    ceilingGainDecades: +ceilingGainDecades.toFixed(4), // ~0.079 (upper bound)
    fractionOfGapAttainablePct: +(fractionOfGapAttainable * 100).toFixed(2), // ~2.36
    remainingToCrossoverDecades: +remainingToCrossoverDecades.toFixed(4), // ~3.279
    remainingToWindowBottomDecades: +remainingToWindowBottomDecades.toFixed(4), // ~6.699
    fullDeadZoneDecades: +fullDeadZoneDecades.toFixed(4), // ~6.778
  },
  reliantOnDerivedEnvelope:
    'From the ceiling gamma_1e6 = 6.003e5, ~3.279 decades remain to the crossover and ~6.699 ' +
    'to the window bottom. The crossover-height conservatism cannot be measured directly with ' +
    'repo data; it stays reliant on the imp-95722 derived envelope r_cap(T) (Selberg-unconditional ' +
    'numerator + O(1) offset), which carries the conservatism r_cap < 1 across the whole remaining ' +
    'gap (r_cap(3e12) ~ 0.26 at the window bottom).',
  isRigorous: false,
  verdict:
    'ASSESSMENT (frontier reach, NOT rigorous). The direct sd(C - E) pointwise-variance ' +
    'measurement cannot be meaningfully pushed into the dead zone with in-repo data: the largest ' +
    'verified ordinate is gamma_1e6 = 6.003e5, a hard ceiling only ~0.079 decade (~2.4%) into the ' +
    '3.36-decade gap between the imp-95710 measured top (T = 5e5) and the imp-95729 crossover ' +
    '(T0 ~ 1.14e9). No other in-repo zero table (zeros-first-25, the imp-360 / imp-962 ladders) ' +
    'reaches higher. So ~97.6% of the way to the crossover, and all of the way to the imp-95519 ' +
    'window bottom T = 3.0e12, stays reliant on the imp-95722 derived envelope rather than on ' +
    'direct measurement. Changes no bound; NO QED; no refereed bound is changed; ' +
    'the zero-side route stays PCC/GRH-gated.',
  citation:
    'imp-95710 (conservatism measured to T = 5e5); imp-95729 (crossover T0 ~ 1.14e9, dead zone); ' +
    'imp-95722 (derived envelope r_cap, r_cap(3e12) ~ 0.26); imp-95519 (window bottom T = 3.0e12); ' +
    'zeros-to-1e6 (ZEROS_EXTENDED, largest ordinate gamma_1e6 = 6.003e5).',
};

// --- self-executing internal-consistency assertions (decade re-derivation only) ---
const approx = (a, b, tol) => Math.abs(a - b) <= tol;

// imp-95889: exported as a *_ASSERTIONS array (holds() shape) so the
// scripts/run-assertions.mjs sweep auto-discovers and runs these tripwires --
// the imp-95778 audit flagged this module as exporting no such array, so its
// checks silently never ran under the build-time gate despite being present.
export const IMP95750_NUMBER_VARIANCE_DEADZONE_MEASUREMENT_REACH_ASSERTIONS = [
  {
    id: 'imp95750-gap-to-crossover-decades',
    description: 'the gap to the crossover matches the imp-95729 ~3.36-decade figure',
    holds: () => approx(gapToCrossoverDecades, 3.36, 0.02),
  },
  {
    id: 'imp95750-ceiling-gain-sub-tenth-decade',
    description: 'the direct-measurement ceiling adds well under a tenth of a decade above 5e5',
    holds: () => ceilingGainDecades > 0 && ceilingGainDecades < 0.1,
  },
  {
    id: 'imp95750-attainable-fraction-few-percent',
    description: 'the attainable fraction of the gap is a few percent, not a meaningful dent',
    holds: () => fractionOfGapAttainable > 0 && fractionOfGapAttainable < 0.05,
  },
  {
    id: 'imp95750-ceiling-between-top-and-crossover',
    description: 'the ceiling is the largest ordinate and sits above the measured top but below the crossover',
    holds: () => GAMMA_1E6 > MEASURED_TOP_T && GAMMA_1E6 < CROSSOVER_T0,
  },
  {
    id: 'imp95750-remaining-to-crossover-exceeds-three',
    description: 'most of the gap to the crossover remains unreached',
    holds: () => remainingToCrossoverDecades > 3,
  },
  {
    id: 'imp95750-full-dead-zone-decades',
    description: 'the full dead zone matches the imp-95710/imp-95729 ~6.78-decade figure',
    holds: () => approx(fullDeadZoneDecades, 6.78, 0.05),
  },
  {
    id: 'imp95750-is-rigorous-false',
    description: 'honesty gate: this is an assessment, not a rigorous result',
    holds: () => IMP95750_NUMBER_VARIANCE_DEADZONE_MEASUREMENT_REACH.isRigorous === false,
  },
  {
    id: 'imp95750-verdict-no-qed-banner',
    description: 'the verdict retains the NO QED banner',
    holds: () => /NO QED/.test(IMP95750_NUMBER_VARIANCE_DEADZONE_MEASUREMENT_REACH.verdict),
  },
  {
    id: 'imp95750-verdict-pt-sota-banner',
    description: 'the verdict retains the no-refereed-bound-change banner',
    holds: () => /refereed bound is changed/i.test(IMP95750_NUMBER_VARIANCE_DEADZONE_MEASUREMENT_REACH.verdict),
  },
];

export default IMP95750_NUMBER_VARIANCE_DEADZONE_MEASUREMENT_REACH;
