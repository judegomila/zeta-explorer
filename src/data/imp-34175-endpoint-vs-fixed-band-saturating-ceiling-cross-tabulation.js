/**
 * @module imp-34175-endpoint-vs-fixed-band-saturating-ceiling-cross-tabulation
 *
 * imp-34175 (accuracy, frontier-direction): imp-34108 and imp-34109 both fit the SAME bounded
 * saturating form peak = a - b/kEnd and each read off a nominal asymptotic ceiling, but on DIFFERENT
 * residual peaks and over DIFFERENT boundary windows, and the two were never compared side by side.
 *   - imp-34108 took the imp-34043 four-way Akaike WINNER (saturating, w_sat ~ 0.872) on the 9 imp-33917
 *     boundary-locked ENDPOINT-residual peaks (fit window kEnd = 11..13) and measured a ceiling
 *     a = 1.678095 (b = 15.629706) approached within 1% only at kEnd ~ 931.40 (~72x the window edge).
 *   - imp-34109 fit the same bounded form to the 13 imp-34040-continuation FIXED-BAND (k <= 10) peaks
 *     over kEnd = 14..20 and read a NOMINAL ceiling a ~ 1.95178 (b ~ 22.06795) approached within 1% at
 *     kEnd ~ 1131 (~57x the edge) -- but found the UNBOUNDED log form BEATS the bounded fit
 *     (R^2 0.99948 > 0.99804 > linear 0.99617), so its own ceiling is NOT the selected form.
 *
 * This module TABULATES the two bounded-fit ceilings, their b coefficients, their 1% and 0.1% ceiling-
 * approach kEnds and window-multiples SIDE BY SIDE (all read VERBATIM from the two parent objects -- no
 * re-fit, no re-run of either surrogate), and MEASURES (a) the ceiling ratio, (b) the b-coefficient and
 * approach-scale ratios, and (c) whether the two saturating fits are mutually CONSISTENT given
 * imp-34109's log-dominance caveat. imp-34109 reports only its 1% approach kEnd; because both fits share
 * the identical shortfall law (a - peak)/a = b/(a kEnd), the 0.1% approach kEnd is exactly 10x the 1%
 * one (derived here, same closed form kEnd(tol) = b/(a tol)).
 *
 * THE CROSS-TABULATION (both rows read verbatim from imp-34108 / imp-34109; only the ratios are new)
 * -------------------------------------------------------------------------------------------------
 *   peak family            ceiling a    b            1%-kEnd   (xEdge)   0.1%-kEnd   (xEdge)   form status
 *   imp-34108 endpoint     1.678095     15.629706     931.40   ~71.6x     9313.96   ~716.5x   Akaike WINNER
 *   imp-34109 fixed-band   1.951780     22.067946    1130.66   ~56.5x    11306.60   ~565.3x   BEATEN by log
 *
 *   Ceiling ratio (fixed-band / endpoint)   a_B / a_A = 1.163093  (the two caps within ~16.3% of each other)
 *   b-coefficient ratio                     b_B / b_A = 1.411923
 *   1%-approach kEnd ratio                  k_B / k_A = 1.213936  (fixed-band ceiling is ~21% further out in kEnd)
 *   window-reach ratio (edge-multiples)     reachA / reachB = 1.266517 (endpoint fit extrapolates ~27% further
 *                                            in WINDOW-widths despite a nearer kEnd, because its window edge is
 *                                            kEnd = 13 vs the fixed-band edge kEnd = 20)
 *
 * THE FINDING (cross-tabulation / measurement only -- the two ceilings are NUMERICALLY CLOSE but NOT a
 * shared physical plateau: one fit is the selected form, the other is explicitly DISOWNED by its own selector)
 * ------------------------------------------------------------------------------------------------------------
 *   (X1) THE TWO BOUNDED-FIT CEILINGS ARE WITHIN ~16% OF EACH OTHER. a_endpoint = 1.678095 and
 *        a_fixedBand = 1.951780 give a ratio 1.163093 -- order-of-magnitude comparable cap heights read from
 *        two independent residual families by the SAME functional form. Both sit well above their observed
 *        peaks (imp-34108 cap ~3.6x its largest endpoint peak; imp-34109 cap ~2.3x its kEnd = 20 peak 0.8653).
 *   (X2) BOTH CEILINGS ARE DISTANT EXTRAPOLATIONS -- NEITHER IS APPROACHED WITHIN ITS DATA. The 1%-approach
 *        kEnds (931.40 and 1130.66) sit ~71.6x and ~56.5x beyond the respective fit-window edges (kEnd = 13
 *        and 20); the 0.1% approaches are a further 10x out. In WINDOW-widths the endpoint fit reaches
 *        ~1.27x further (reachA / reachB = 1.266517) even though its absolute kEnd is nearer, because its
 *        window edge is smaller.
 *   (X3) THE FITS ARE NOT MUTUALLY CONSISTENT AS A PLATEAU -- ONE IS SELECTED, THE OTHER IS REJECTED. The
 *        ~1.16 ceiling ratio compares an ACCEPTED intercept against a DISOWNED one: imp-34108's saturating
 *        form was the imp-34043 four-way Akaike WINNER, whereas imp-34109's identical bounded form is BEATEN
 *        by the unbounded log form (R^2 0.99948 > 0.99804), keepsClimbing = true. So the two caps agreeing to
 *        within ~16% is a NUMERICAL COINCIDENCE of two narrow-window curve-fit intercepts, NOT evidence of a
 *        common physical ceiling: the fixed-band amplitude is judged to KEEP CLIMBING, its 1.95178 cap never
 *        selected. The agreement therefore does NOT strengthen either extrapolation.
 *
 * The punchline: side by side the imp-34108 endpoint ceiling a = 1.678095 (Akaike winner, 1%-approach
 * kEnd ~ 931, ~72x its window) and the imp-34109 fixed-band ceiling a ~ 1.95178 (BEATEN by log, 1%-approach
 * kEnd ~ 1131, ~57x its window) sit within ~16.3% of each other (ratio 1.163093), with b coefficients in
 * ratio 1.411923 and 1%-approach kEnds in ratio 1.213936. But the numerical proximity of the two caps is a
 * coincidence of two distant narrow-window extrapolations on different residual families -- one selected, one
 * rejected in favour of an unbounded log form -- NOT a shared physical plateau, so it corroborates neither.
 *
 * MEASUREMENT / CROSS-TABULATION ONLY. Every ceiling, b and approach kEnd is read VERBATIM from imp-34108 /
 * imp-34109; only the ratios and the consistency verdict are new. Both parents are narrow-window curve-fit
 * extrapolations asserting NO physical plateau, and imp-34109's bounded fit is explicitly NOT its selected
 * form. This changes no bound; the imp-34043 saturating-vs-log SELECTION margin and the imp-33843 log-linear-
 * vs-power-law FORM verdict are UNTOUCHED; the component model is the inherited imp-3220/imp-3406
 * extrapolation, NOT a rigorous asymptotic; the C_mb GUE-conditional per imp-486 is UNTOUCHED; establishes no
 * operator positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-34108-endpoint-peak-saturating-ceiling-extrapolation (endpoint-peak ceiling row; read verbatim)
 * @see imp-34109-fixed-band-peak-amplitude-saturation-fit (fixed-band ceiling row; read verbatim; log-dominance caveat)
 * @see imp-34043-endpoint-peak-saturating-model-tournament (the four-way Akaike winner behind imp-34108)
 * @see imp-34192-endpoint-vs-fixed-band-peak-shared-grid-knee (a distinct endpoint-vs-fixed-band comparison)
 * @see imp-486 (C_mb GUE-conditional)
 */

import { IMP34108_ENDPOINT_PEAK_SATURATING_CEILING_EXTRAPOLATION as A } from './imp-34108-endpoint-peak-saturating-ceiling-extrapolation.js';
import { IMP34109_FIXED_BAND_PEAK_AMPLITUDE_SATURATION_FIT as B } from './imp-34109-fixed-band-peak-amplitude-saturation-fit.js';

// --- Row A: imp-34108 endpoint-peak saturating fit (Akaike winner), read VERBATIM ---
const A_CEILING = A.extrapolatedCeiling; // 1.678095
const A_B = A.b; // 15.629706
const A_WINDOW_EDGE = A.fitWindowEndKEnd; // 13
const A_K1 = A.approachThresholds.within1Percent.kEnd; // 931.40
const A_K01 = A.approachThresholds.within0p1Percent.kEnd; // 9313.96
const A_REACH1 = A.approachThresholds.within1Percent.windowsPastEdge; // ~71.6x
const A_REACH01 = A.approachThresholds.within0p1Percent.windowsPastEdge; // ~716.5x

// --- Row B: imp-34109 fixed-band-peak saturating fit (BEATEN by log), read VERBATIM ---
const B_CEILING = B.saturatingFit.ceiling; // 1.95178
const B_B = B.saturatingFit.b; // 22.067946
const B_WINDOW_EDGE = B.kEnds[B.kEnds.length - 1]; // 20
const B_K1 = B.saturatingFit.within1PercentKEnd; // 1130.66
// imp-34109 reports only the 1% approach kEnd; the identical shortfall law b/(a kEnd) = tol makes the
// 0.1% approach exactly kEnd(1e-3) = b/(a*1e-3) = 10 * kEnd(1e-2), so it is derived as 10x the reported
// 1% value from the same closed form (kept consistent with imp-34109 s rounded 1% kEnd).
const B_K01 = 10 * B_K1; // ~11306.60 (= 10 * the imp-34109-reported 1% approach kEnd)
const B_REACH1 = B_K1 / B_WINDOW_EDGE; // ~56.5x
const B_REACH01 = B_K01 / B_WINDOW_EDGE; // ~565.3x

// --- The new measurements: ratios across the two rows ---
const CEILING_RATIO = B_CEILING / A_CEILING; // 1.163093 -- fixed-band / endpoint caps within ~16.3%
const B_COEFF_RATIO = B_B / A_B; // 1.411923
const K1_RATIO = B_K1 / A_K1; // 1.213936 -- fixed-band 1%-approach is ~21% further out in kEnd
const REACH1_RATIO = A_REACH1 / B_REACH1; // 1.266517 -- endpoint fit extrapolates ~27% further in WINDOW-widths

// imp-34109's own selection verdict: the bounded ceiling is NOT the selected form (log wins; keeps climbing).
const FIXED_BAND_CEILING_SELECTED = !(B.unboundedLogWins && B.keepsClimbing); // false
const ENDPOINT_CEILING_SELECTED = true; // imp-34108 = imp-34043 four-way Akaike winner

export const IMP34175_ENDPOINT_VS_FIXED_BAND_SATURATING_CEILING_CROSS_TABULATION = {
  id: 'imp-34175',
  proofSection: 'S-frontier',
  question:
    'imp-34108 (endpoint peak, ceiling a = 1.678095, 1%-approach kEnd ~ 931, Akaike WINNER) and imp-34109 ' +
    '(fixed-band k <= 10 peak, nominal ceiling a ~ 1.95178, 1%-approach kEnd ~ 1131, but BEATEN by the ' +
    'unbounded log form) both fit the same bounded saturating form peak = a - b/kEnd yet were never ' +
    'compared side by side. Tabulate the two ceilings, b coefficients and 1%/0.1% approach kEnds together, ' +
    'measure the ceiling and approach-scale ratios, and decide whether the two saturating fits are mutually ' +
    'consistent given imp-34109 s log-dominance caveat. Cross-tabulation / measurement only; no QED.',
  measuredQuantity:
    'The two bounded-fit ceilings a, their b coefficients, and their within-1% and within-0.1% ceiling-' +
    'approach kEnds (closed form kEnd(tol) = b/(a tol)) with window-edge multiples, tabulated side by side, ' +
    'plus the ceiling ratio, b-coefficient ratio, 1%-approach-kEnd ratio and window-reach ratio, and a ' +
    'consistency verdict conditioned on imp-34109 s bounded fit NOT being its selected form',
  rows: [
    {
      peakFamily: 'imp-34108 endpoint (boundary-locked kEnd = 11..13)',
      ceiling: A_CEILING,
      b: A_B,
      fitWindowEndKEnd: A_WINDOW_EDGE,
      within1PercentKEnd: A_K1,
      within1PercentWindowsPastEdge: A_REACH1,
      within0p1PercentKEnd: A_K01,
      within0p1PercentWindowsPastEdge: A_REACH01,
      formStatus: 'imp-34043 four-way Akaike WINNER (w_sat ~ 0.872); ceiling IS the selected form',
      ceilingSelected: ENDPOINT_CEILING_SELECTED, // true
    },
    {
      peakFamily: 'imp-34109 fixed-band k <= 10 (kEnd = 14..20)',
      ceiling: B_CEILING,
      b: B_B,
      fitWindowEndKEnd: B_WINDOW_EDGE,
      within1PercentKEnd: +B_K1.toFixed(2),
      within1PercentWindowsPastEdge: +B_REACH1.toFixed(1),
      within0p1PercentKEnd: +B_K01.toFixed(2), // derived: 10x the 1% approach (same shortfall law)
      within0p1PercentWindowsPastEdge: +B_REACH01.toFixed(1),
      formStatus: 'BEATEN by unbounded log (R^2 0.99948 > 0.99804); keepsClimbing; ceiling NOT selected',
      ceilingSelected: FIXED_BAND_CEILING_SELECTED, // false
    },
  ],
  ratios: {
    ceilingFixedBandOverEndpoint: +CEILING_RATIO.toFixed(6), // 1.163093 -- caps within ~16.3%
    bCoeffFixedBandOverEndpoint: +B_COEFF_RATIO.toFixed(6), // 1.411923
    within1PercentKEndFixedBandOverEndpoint: +K1_RATIO.toFixed(6), // 1.213936
    windowReachEndpointOverFixedBand1Percent: +REACH1_RATIO.toFixed(6), // 1.266517
  },
  finding: {
    X1_two_ceilings_within_16_percent:
      'The endpoint ceiling a = 1.678095 and the fixed-band ceiling a = 1.951780 give a ratio 1.163093 -- ' +
      'order-of-magnitude comparable cap heights read from two independent residual families by the SAME ' +
      'bounded form peak = a - b/kEnd, both well above their observed peaks (~3.6x and ~2.3x respectively).',
    X2_both_ceilings_are_distant_extrapolations:
      'The 1%-approach kEnds (931.40 and 1130.66) sit ~71.6x and ~56.5x beyond the fit-window edges ' +
      '(kEnd = 13 and 20); the 0.1% approaches are a further 10x out (9313.96 and 11306.60). In ' +
      'WINDOW-widths the endpoint fit reaches ~1.27x further (reach ratio 1.266517) despite a nearer kEnd, ' +
      'because its window edge (13) is smaller than the fixed-band edge (20).',
    X3_not_mutually_consistent_as_a_plateau_one_selected_one_rejected:
      'The ~1.16 ceiling ratio compares an ACCEPTED intercept against a DISOWNED one: imp-34108 s ' +
      'saturating form was the imp-34043 four-way Akaike WINNER, whereas imp-34109 s identical bounded form ' +
      'is BEATEN by the unbounded log form (R^2 0.99948 > 0.99804), keepsClimbing = true, ceiling never ' +
      'selected. The two caps agreeing to within ~16% is thus a NUMERICAL COINCIDENCE of two narrow-window ' +
      'curve-fit intercepts on different residual families, NOT evidence of a common physical ceiling; the ' +
      'agreement corroborates neither extrapolation.',
  },
  isRigorous: false,
  verdict:
    'MEASUREMENT / CROSS-TABULATION (frontier-direction, NOT rigorous). Side by side the imp-34108 endpoint ' +
    'ceiling a = 1.678095 (b = 15.629706; imp-34043 four-way Akaike WINNER; 1%-approach kEnd ~ 931.40 at ' +
    '~71.6x its kEnd = 13 window, 0.1% at ~9313.96) and the imp-34109 fixed-band ceiling a = 1.951780 ' +
    '(b = 22.067946; BEATEN by the unbounded log form R^2 0.99948 > 0.99804, keepsClimbing; 1%-approach ' +
    'kEnd ~ 1130.66 at ~56.5x its kEnd = 20 window, 0.1% at ~11306.60) sit within ~16.3% of each other ' +
    '(ceiling ratio 1.163093), with b coefficients in ratio 1.411923 and 1%-approach kEnds in ratio ' +
    '1.213936 (window-reach ratio 1.266517 in the endpoint fit s favour). But the numerical proximity of ' +
    'the two caps is a COINCIDENCE of two distant narrow-window extrapolations on DIFFERENT residual ' +
    'families -- one selected (endpoint saturating winner), one REJECTED in favour of an unbounded log form ' +
    '(fixed-band) -- NOT a shared physical plateau, so it corroborates neither. All ceilings, b and ' +
    'approach kEnds are read VERBATIM from imp-34108 / imp-34109 (no re-fit); only the ratios and the ' +
    'consistency verdict are new. This changes no bound; the imp-34043 saturating-vs-log SELECTION margin ' +
    'and the imp-33843 log-linear-vs-power-law FORM verdict are UNTOUCHED; the component model is the ' +
    'inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the C_mb GUE-conditional per ' +
    'imp-486 is UNTOUCHED; establishes no operator positivity; imp-3066 K_a >= 0 untouched; no RH verdict, ' +
    'NO QED. No refereed bound is changed.',
  citation:
    'imp-34108 (endpoint-peak ceiling row, read verbatim); imp-34109 (fixed-band ceiling row, read ' +
    'verbatim, log-dominance caveat); imp-34043 (the four-way Akaike winner behind imp-34108); imp-33843 ' +
    '(the log-linear OLS whose residual is the peak); imp-486 (C_mb GUE-conditional).',
};

export const IMP34175_ENDPOINT_VS_FIXED_BAND_SATURATING_CEILING_CROSS_TABULATION_ASSERTIONS = [
  {
    // Reuse gate: both rows ARE the imp-34108 / imp-34109 published ceilings and b coefficients, verbatim.
    id: 'imp34175-reuse-gate-verbatim-parent-ceilings',
    description: 'endpoint ceiling = imp-34108 (1.678095, b 15.629706); fixed-band ceiling = imp-34109 (1.951780, b 22.067946)',
    holds: () =>
      Math.abs(A_CEILING - 1.678095) < 1e-6 &&
      Math.abs(A_B - 15.629706) < 1e-6 &&
      Math.abs(B_CEILING - 1.95178) < 1e-6 &&
      Math.abs(B_B - 22.067946) < 1e-6 &&
      A_CEILING === A.extrapolatedCeiling &&
      B_CEILING === B.saturatingFit.ceiling,
  },
  {
    // (X1) The two bounded-fit ceilings are within ~16% of each other; ratio matches the closed value.
    id: 'imp34175-ceiling-ratio-within-16-percent',
    description: 'ceiling ratio fixed-band/endpoint = 1.163093 (both caps in (1.6, 2.0); agree to within ~16.3%)',
    holds: () =>
      Math.abs(CEILING_RATIO - 1.163093) < 1e-6 &&
      CEILING_RATIO > 1.0 &&
      CEILING_RATIO < 1.2 &&
      A_CEILING > 1.6 &&
      A_CEILING < 2.0 &&
      B_CEILING > 1.6 &&
      B_CEILING < 2.0,
  },
  {
    // (X2) Both ceilings are distant extrapolations; the 0.1% approach is exactly 10x the 1% approach for
    // each (shared shortfall law), and the endpoint fit reaches further in window-widths.
    id: 'imp34175-both-distant-extrapolations-0p1-is-10x-1pct',
    description: '1%-approach kEnds ~931/~1131 both >> window edges; 0.1% approach exactly 10x the 1% each; window-reach ratio 1.266517',
    holds: () =>
      A_REACH1 > 50 &&
      B_REACH1 > 50 &&
      Math.abs(A_K01 / A_K1 - 10) < 1e-3 && // A row uses imp-34108 rounded literals (9313.96 / 931.40)
      Math.abs(B_K01 / B_K1 - 10) < 1e-9 &&
      Math.abs(REACH1_RATIO - 1.266517) < 1e-6 &&
      REACH1_RATIO > 1,
  },
  {
    // (X3) The fits are NOT mutually consistent as a plateau: endpoint ceiling IS selected (Akaike winner),
    // fixed-band ceiling is NOT selected (log wins, keeps climbing).
    id: 'imp34175-not-consistent-one-selected-one-rejected',
    description: 'endpoint ceiling selected (Akaike winner); fixed-band ceiling NOT selected (unbounded log wins, keepsClimbing)',
    holds: () =>
      ENDPOINT_CEILING_SELECTED === true &&
      FIXED_BAND_CEILING_SELECTED === false &&
      B.unboundedLogWins === true &&
      B.keepsClimbing === true &&
      B.logFit.r2 > B.saturatingFit.r2,
  },
  {
    // Honesty gate: cross-tabulation only, isRigorous false, no bound change, selection/form verdicts
    // untouched, NO QED, no refereed bound is changed, imp-3066 K_a>=0 untouched, imp-486 C_mb untouched.
    id: 'imp34175-honesty-gate-no-qed',
    description: 'Cross-tabulation only: isRigorous false, no bound change, imp-34043/imp-33843 untouched, NO QED, no refereed bound is changed, imp-3066/imp-486 untouched',
    holds: () =>
      IMP34175_ENDPOINT_VS_FIXED_BAND_SATURATING_CEILING_CROSS_TABULATION.isRigorous === false &&
      /NOT a rigorous asymptotic/.test(IMP34175_ENDPOINT_VS_FIXED_BAND_SATURATING_CEILING_CROSS_TABULATION.verdict) &&
      /changes no bound/.test(IMP34175_ENDPOINT_VS_FIXED_BAND_SATURATING_CEILING_CROSS_TABULATION.verdict) &&
      /NO QED/.test(IMP34175_ENDPOINT_VS_FIXED_BAND_SATURATING_CEILING_CROSS_TABULATION.verdict) &&
      /refereed bound is changed/i.test(IMP34175_ENDPOINT_VS_FIXED_BAND_SATURATING_CEILING_CROSS_TABULATION.verdict) &&
      /imp-3066 K_a >= 0 untouched/i.test(IMP34175_ENDPOINT_VS_FIXED_BAND_SATURATING_CEILING_CROSS_TABULATION.verdict) &&
      /C_mb GUE-conditional per imp-486 is UNTOUCHED/i.test(IMP34175_ENDPOINT_VS_FIXED_BAND_SATURATING_CEILING_CROSS_TABULATION.verdict),
  },
];

for (const a of IMP34175_ENDPOINT_VS_FIXED_BAND_SATURATING_CEILING_CROSS_TABULATION_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-34175-endpoint-vs-fixed-band-saturating-ceiling-cross-tabulation assertion failed: ${a.id}`);
  }
}
