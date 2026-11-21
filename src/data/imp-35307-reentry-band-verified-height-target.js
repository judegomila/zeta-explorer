/**
 * @module imp-35307-reentry-band-verified-height-target
 *
 * imp-35307 (numerical, frontier-direction) -- TRANSLATES the imp-35243 D2 extrapolation gap for the
 * imp-34997/imp-35111 iters-to-floor REENTRY band into a concrete VERIFIED-HEIGHT (T-ordinate) target,
 * tying the reentry-band fidelity question to the sole Lambda lever (more verified zero height; see the
 * verified-height-lever audit and imp-35243 requirement R4).
 *
 * THE QUESTION (imp-35307)
 * ------------------------
 * imp-35243 D2 states the reentry (band-on, log10 N = 27.084691) sits ~14.6 decades and the exit (band-off,
 * log10 N = 37.167107) ~24.7 decades ABOVE the Platt-Trudgian verified-zero anchor N ~ 3e12 (log10 ~ 12.48)
 * that binds Lambda <= 0.2 -- so the band is wholly extrapolated (R4 presently unreachable). D2 gives that gap
 * on the surrogate COUNT axis N. This module answers the ticket: how many additional decades of VERIFIED zero
 * height, and what T-height (imaginary ordinate) target, would be needed to place a verified arithmetic datum
 * (i) at the band edge 10^27.08 and (ii) through the full band to 10^37.17.
 *
 * WHAT IS MEASURED
 * ----------------
 * The surrogate variable N is a zero COUNT; the quantity a verification actually reaches is the imaginary
 * ordinate T. The Riemann-von Mangoldt map T*(N) = effectiveHeightForN(N) (inverse of N(T) ~ (T/2pi)(log(T/2pi)
 * - 1)) converts each count-axis landmark to its ordinate. We anchor at the surrogate PT count N_PT = 3e12
 * (consistent with imp-35243 D2, which uses 3e12 as the count-axis anchor) and report, for the reentry edge
 * and the exit edge:
 *   - the additional decades of verified zero COUNT   (= log10 N_edge - log10 N_PT ; reproduces D2)
 *   - the T-ordinate TARGET T*(N_edge)                (the height a verification would have to reach)
 *   - the additional decades of verified ORDINATE     (= log10 T*(N_edge) - log10 T*(N_PT))
 *
 * RESULT
 * ------
 * Reentry edge (N = 10^27.084691): T-target ~ 1.3323e26 (log10 T ~ 26.1246). Reaching it needs ~14.61 more
 * decades of verified COUNT, i.e. ~14.24 more decades of verified ORDINATE, above the anchor T*(3e12) ~
 * 7.6844e11 (log10 T ~ 11.8856).
 * Exit edge (N = 10^37.167107): T-target ~ 1.1512e36 (log10 T ~ 36.0611). Traversing the FULL band needs
 * ~24.69 more decades of verified COUNT, i.e. ~24.18 more decades of verified ORDINATE.
 *
 * WHY THE ORDINATE DECADE COUNT IS SMALLER THAN THE COUNT DECADE COUNT
 * -------------------------------------------------------------------
 * Because zeros thin out with height (mean density (1/2pi) log(T/2pi) grows), the count N runs slightly ahead
 * of the ordinate T: N/T ~ (log(T/2pi) - 1)/(2pi). So each added decade of zero COUNT buys slightly LESS than
 * a decade of ORDINATE, and the count-axis gap (D2: 14.61 / 24.69) exceeds the ordinate-axis gap (14.24 /
 * 24.18) by exactly log10(N/T), which grows with T: ~0.37 decade at reentry, ~0.51 decade at exit. The gap
 * WIDENS up the band -- the count/ordinate wedge is itself decade-dependent, not a constant offset.
 *
 * HONEST CAVEAT ON THE 3e12 ANCHOR
 * --------------------------------
 * The Platt-Trudgian theorem verifies RH to ORDINATE T ~ 3e12; imp-35243 uses 3e12 as the surrogate COUNT
 * anchor. We keep imp-35243 D2 convention (3e12 as the count anchor) so the COUNT-axis figures reproduce D2
 * exactly; the reported ORDINATE decades are therefore measured from T*(3e12) ~ 7.68e11, not from the literal
 * 3e12 ordinate. Either way the conclusion is identical in scale: the band is ~14-25 decades of verified height
 * above any present datum, so R4 stays presently UNREACHABLE.
 *
 * WHAT THIS IS AND IS NOT
 * -----------------------
 * A MEASUREMENT that expresses the imp-35243 D2 count-axis extrapolation gap as an ordinate (T-height) target
 * on the RvM map, connecting the reentry-band fidelity question to the verified-height lever. It discharges
 * NOTHING: imp-35243a / imp-35174a / imp-35111a stay OPEN; R4 stays presently unreachable. MEASUREMENT ONLY on
 * the inherited imp-3220/imp-3406 surrogate; the C_C = (1/8) sqrt(3 pi) ansatz (imp-2642/imp-2643) is UNTOUCHED;
 * changes no bound; establishes no operator positivity; no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-35243-reentry-band-surrogate-fidelity-assessment (D2 count-axis gap; requirement R4)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T* Riemann-von Mangoldt inverse; zeroCountAtHeight)
 * @see imp-35111-off-by-one-reentry-band-width (band edges on the count axis)
 * @see imp-34997-iters-to-floor-tail-grid-refinement (locates the 10^27.08 reentry)
 */

import { effectiveHeightForN, zeroCountAtHeight } from './lambda-rh-height-mapping.js';

const REENTRY_EXP = 27.084691; // band-on, log10 N (imp-34997/35111/35174)
const EXIT_EXP = 37.167107; // band-off, log10 N (imp-35111/35174)
const N_PT = 3e12; // Platt-Trudgian verified-height anchor, kept as the count anchor per imp-35243 D2
const LOG10_N_PT = Math.log10(N_PT); // ~12.477121

// Count-axis landmarks -> ordinate targets via the RvM inverse.
const N_REENTRY = 10 ** REENTRY_EXP;
const N_EXIT = 10 ** EXIT_EXP;
const T_PT = effectiveHeightForN(N_PT); // ~7.6844e11
const T_REENTRY = effectiveHeightForN(N_REENTRY); // ~1.3323e26
const T_EXIT = effectiveHeightForN(N_EXIT); // ~1.1512e36

const LOG10_T_PT = Math.log10(T_PT);
const LOG10_T_REENTRY = Math.log10(T_REENTRY);
const LOG10_T_EXIT = Math.log10(T_EXIT);

// Additional decades of verified COUNT (reproduces imp-35243 D2) and of verified ORDINATE.
const COUNT_DECADES_TO_REENTRY = REENTRY_EXP - LOG10_N_PT; // ~14.61
const COUNT_DECADES_TO_EXIT = EXIT_EXP - LOG10_N_PT; // ~24.69
const ORDINATE_DECADES_TO_REENTRY = LOG10_T_REENTRY - LOG10_T_PT; // ~14.24
const ORDINATE_DECADES_TO_EXIT = LOG10_T_EXIT - LOG10_T_PT; // ~24.18

// The count/ordinate wedge log10(N/T) at each edge -- the amount by which the count gap exceeds the ordinate gap.
const COUNT_ORDINATE_WEDGE_REENTRY = COUNT_DECADES_TO_REENTRY - ORDINATE_DECADES_TO_REENTRY; // ~0.37
const COUNT_ORDINATE_WEDGE_EXIT = COUNT_DECADES_TO_EXIT - ORDINATE_DECADES_TO_EXIT; // ~0.51

export const IMP35307_REENTRY_BAND_VERIFIED_HEIGHT_TARGET = {
  id: 'imp-35307',
  proofSection: 'S-frontier',
  question:
    'imp-35243 D2 states the reentry band (10^27.08 to 10^37.17 on the surrogate COUNT axis) sits ~14.6-24.7 ' +
    'decades above the Platt-Trudgian verified-zero anchor N ~ 3e12. Express that gap, via the Riemann-von ' +
    'Mangoldt height map, as the T-height (imaginary ordinate) TARGET a verification would have to reach to ' +
    'place a verified arithmetic datum (i) at the band edge and (ii) through the full band.',
  anchor: {
    N_pt: N_PT,
    log10_N_pt: +LOG10_N_PT.toPrecision(7), // ~12.477121
    T_pt: +T_PT.toPrecision(7), // ~7.684366e11 -- RvM ordinate of the count anchor
    log10_T_pt: +LOG10_T_PT.toPrecision(7), // ~11.885608
    note: 'imp-35243 D2 uses 3e12 as the surrogate COUNT anchor; the literal PT theorem verifies to ORDINATE 3e12.',
  },
  reentry_edge: {
    log10_N: REENTRY_EXP, // 27.084691
    T_target: +T_REENTRY.toPrecision(7), // ~1.332273e26
    log10_T_target: +LOG10_T_REENTRY.toPrecision(7), // ~26.124593
    additional_verified_count_decades: +COUNT_DECADES_TO_REENTRY.toPrecision(6), // ~14.6076 (reproduces D2 ~14.6)
    additional_verified_ordinate_decades: +ORDINATE_DECADES_TO_REENTRY.toPrecision(6), // ~14.2390
    count_ordinate_wedge: +COUNT_ORDINATE_WEDGE_REENTRY.toPrecision(4), // ~0.3686 = log10(N/T)
  },
  exit_edge: {
    log10_N: EXIT_EXP, // 37.167107
    T_target: +T_EXIT.toPrecision(7), // ~1.151157e36
    log10_T_target: +LOG10_T_EXIT.toPrecision(7), // ~36.061134
    additional_verified_count_decades: +COUNT_DECADES_TO_EXIT.toPrecision(6), // ~24.6900 (reproduces D2 ~24.7)
    additional_verified_ordinate_decades: +ORDINATE_DECADES_TO_EXIT.toPrecision(6), // ~24.1755
    count_ordinate_wedge: +COUNT_ORDINATE_WEDGE_EXIT.toPrecision(4), // ~0.5145 = log10(N/T)
  },
  reading:
    'To place a verified datum AT the reentry edge, RH verification would have to reach ordinate T ~ 1.33e26 ' +
    '(log10 ~ 26.12) -- ~14.24 more decades of verified ORDINATE (~14.61 more decades of verified COUNT) above ' +
    'the anchor T*(3e12) ~ 7.68e11. To TRAVERSE the full band to the exit edge needs ordinate T ~ 1.15e36 ' +
    '(log10 ~ 36.06), i.e. ~24.18 more decades of ORDINATE (~24.69 of COUNT). Because zeros thin with height, ' +
    'the count gap exceeds the ordinate gap by log10(N/T), which WIDENS from ~0.37 decade at reentry to ~0.51 ' +
    'decade at exit -- the count/ordinate wedge is decade-dependent, not a fixed offset. The current RH-verified ' +
    'frontier is ~14-25 decades of height below the band, so imp-35243 R4 (independent verified-datum agreement) ' +
    'stays presently UNREACHABLE and the band remains a surrogate-only feature.',
  isRigorous: false,
  verdict:
    'MEASUREMENT (numerical, frontier-direction, NOT an RH bound). Expresses the imp-35243 D2 count-axis ' +
    'extrapolation gap as a T-ordinate target on the Riemann-von Mangoldt map: reentry edge needs verification ' +
    'to T ~ 1.33e26 (~14.24 more ordinate decades / ~14.61 count decades), exit edge to T ~ 1.15e36 (~24.18 / ' +
    '~24.69), above the anchor T*(3e12) ~ 7.68e11. The count gap exceeds the ordinate gap by log10(N/T), which ' +
    'grows from ~0.37 to ~0.51 decade up the band. This ties the reentry-band fidelity question to the sole ' +
    'Lambda lever (more verified zero height): imp-35243 R4 is presently UNREACHABLE by ~14-25 decades. ' +
    'MEASUREMENT ONLY on the inherited imp-3220/imp-3406 surrogate; imp-35243a / imp-35174a / imp-35111a stay ' +
    'OPEN; the C_C = (1/8) sqrt(3 pi) ansatz (imp-2642/imp-2643) is UNTOUCHED; changes no bound; establishes no ' +
    'operator positivity; no RH verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-35243 (D2 count-axis gap and requirement R4); lambda-rh-height-mapping (effectiveHeightForN RvM ' +
    'inverse); imp-35111 (band edges); imp-34997 (locates the 10^27.08 reentry).',
};

export const IMP35307_REENTRY_BAND_VERIFIED_HEIGHT_TARGET_ASSERTIONS = [
  {
    // The count-axis decades reproduce imp-35243 D2 (~14.6 / ~24.7) exactly.
    id: 'imp35307-count-decades-match-D2',
    description: 'additional verified COUNT decades reproduce imp-35243 D2: ~14.6 to reentry, ~24.7 to exit',
    holds: () =>
      Math.abs(COUNT_DECADES_TO_REENTRY - 14.6076) < 1e-3 &&
      Math.abs(COUNT_DECADES_TO_EXIT - 24.6900) < 1e-3 &&
      COUNT_DECADES_TO_EXIT > COUNT_DECADES_TO_REENTRY,
  },
  {
    // The ordinate targets are the RvM inverses of the band edges, round-tripping via N(T).
    id: 'imp35307-ordinate-targets-roundtrip',
    description: 'T*(N_edge) round-trips through N(T) back to the band-edge count to 1 part in 10^6',
    holds: () =>
      Math.abs(zeroCountAtHeight(T_REENTRY) / N_REENTRY - 1) < 1e-6 &&
      Math.abs(zeroCountAtHeight(T_EXIT) / N_EXIT - 1) < 1e-6,
  },
  {
    // The ordinate T-target logs are as reported (~26.12 reentry, ~36.06 exit).
    id: 'imp35307-ordinate-target-values',
    description: 'log10 T-targets ~26.12 (reentry) and ~36.06 (exit), both below their count-axis log10 N',
    holds: () =>
      Math.abs(LOG10_T_REENTRY - 26.124593) < 1e-3 &&
      Math.abs(LOG10_T_EXIT - 36.061134) < 1e-3 &&
      LOG10_T_REENTRY < REENTRY_EXP &&
      LOG10_T_EXIT < EXIT_EXP,
  },
  {
    // The ordinate decade gap is smaller than the count decade gap, and the wedge log10(N/T) WIDENS up the band.
    id: 'imp35307-count-exceeds-ordinate-wedge-widens',
    description: 'count gap exceeds ordinate gap by log10(N/T); the wedge grows from ~0.37 at reentry to ~0.51 at exit',
    holds: () =>
      ORDINATE_DECADES_TO_REENTRY < COUNT_DECADES_TO_REENTRY &&
      ORDINATE_DECADES_TO_EXIT < COUNT_DECADES_TO_EXIT &&
      COUNT_ORDINATE_WEDGE_EXIT > COUNT_ORDINATE_WEDGE_REENTRY &&
      Math.abs(COUNT_ORDINATE_WEDGE_REENTRY - 0.3686) < 1e-2 &&
      Math.abs(COUNT_ORDINATE_WEDGE_EXIT - 0.5145) < 1e-2,
  },
  {
    // Honesty gate: measurement only, discharges nothing, R4 unreachable, no QED, no refereed bound is changed.
    id: 'imp35307-honesty-gate-no-qed',
    description: 'Measurement only: isRigorous false, R4 unreachable, imp-35243a OPEN, no QED, no refereed bound is changed',
    holds: () =>
      IMP35307_REENTRY_BAND_VERIFIED_HEIGHT_TARGET.isRigorous === false &&
      /UNREACHABLE/.test(IMP35307_REENTRY_BAND_VERIFIED_HEIGHT_TARGET.reading) &&
      /imp-35243a/.test(IMP35307_REENTRY_BAND_VERIFIED_HEIGHT_TARGET.verdict) &&
      /NO QED/.test(IMP35307_REENTRY_BAND_VERIFIED_HEIGHT_TARGET.verdict) &&
      /refereed bound is changed/i.test(IMP35307_REENTRY_BAND_VERIFIED_HEIGHT_TARGET.verdict),
  },
];

for (const a of IMP35307_REENTRY_BAND_VERIFIED_HEIGHT_TARGET_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-35307-reentry-band-verified-height-target assertion failed: ${a.id}`);
  }
}
