/**
 * @module imp-33810-eflow-resid-ratio-N-ladder
 *
 * imp-33810 (accuracy, frontier-direction): imp-33773 finding M2 refuted the cohort
 * attribution of the sub-leading offset residual to "the near-peak E_flow term" by noting
 * (among other mismatches) that the E_flow term is ~1900x too small IN THE TAIL. That single
 * tail ratio (resid/eflow ~= 1928 at the [1e11,1e12] rung) was reported once but never TRACKED
 * across N, so a sceptic could read the refutation as a single-point artifact or, worse, as a
 * mere SIGN coincidence (E_flow and the residual happen to point the same way and the "1900x"
 * is an isolated tail number). This module TRACKS the E_flow-term / offset-residual ratio across
 * a finer N ladder to lock the refutation as a robust, monotone, same-sign MAGNITUDE separation.
 *
 * THE LADDER (identical inherited imp-3220/imp-3406/imp-33773 parts, no fresh model)
 * ---------------------------------------------------------------------------------
 *   Same component model as imp-33773:
 *     sigma(N) = E_coll / (E_trunc + E_flow + E_coll),
 *     E_trunc  = 3.06e-5 (N-independent fixed strip, imp-2631),
 *     E_coll   = C_C_PINNED sqrt(log T0 / N)  (GUE-conditional C_H),
 *     E_flow   = C_F (log T0 / T0) Gronwall,   C_F = (log(T0/2pi)+1)/2pi  (imp-398),
 *     T0       = effectiveHeightForN(N).
 *   Per SLIDING window [10^k, 10^(k+1)] at QUARTER-decade steps k = 6.00, 6.25, ..., 11.00
 *   (21 rungs, versus imp-33773 which sampled only the 6 integer decades k = 6..11):
 *     p_sigma      = -slope OLS(ln sigma vs ln N), 4 pts/decade  (imp-33582/imp-33730 defn),
 *     p_ecoll      = -d log E_coll / d log N over the endpoints  (imp-33620/imp-33727 defn),
 *     resid_exp(k) = p_ecoll (1 - sigma_hi) - p_sigma,           (imp-33773 M2 sub-leading resid),
 *     eflow_attr(k)= (E_flow/E_N) |s_flow|  at the window upper endpoint,  (the attributed term),
 *     ratio(k)     = eflow_attr(k) / resid_exp(k).               (E_flow as a FRACTION of resid)
 *
 * THE FINDING (measurement only -- LOCKS the imp-33773 M2 magnitude separation)
 * ---------------------------------------------------------------------------
 *   (R1) THE INTEGER-DECADE RUNGS REPRODUCE imp-33773 M2. On the shared k = 6..11 the
 *        residual-over-eflow ratio recomputes to {2.1, 7.0, 34.4, 163.5, 623.1, 1927.6},
 *        head ~2.1 and tail ~1928 byte-matching the imp-33773 M2 endpoints -- the finer ladder
 *        is the same measurement at 4x resolution, not a new model.
 *   (R2) E_FLOW IS STRICTLY BELOW THE RESIDUAL AT EVERY RUNG (magnitude-separated). The ratio
 *        eflow_attr/resid_exp = {0.4687, ..., 5.19e-4} is BELOW 1 at all 21 rungs, so the E_flow
 *        term never even reaches the residual it is claimed to BE -- the attribution fails on
 *        magnitude uniformly, not just at one tail point.
 *   (R3) THE SEPARATION WIDENS MONOTONICALLY IN N (the N-trend). eflow_attr/resid_exp is STRICTLY
 *        decreasing across the whole ladder, from ~0.47 (only a factor ~2.1 at the head) to
 *        ~5.19e-4 (~1928x, three orders) in the tail. So the "1900x" is NOT a single-point
 *        artifact: it is the TAIL ENDPOINT of a monotone-widening trend spanning k = 6..11. It
 *        also CORRECTS the loose "orders of magnitude below unity throughout" reading -- the
 *        separation is only ~2x at the head and GROWS into the tail; it is not uniformly large.
 *   (R4) IT IS A SAME-SIGN MAGNITUDE SEPARATION, NOT A SIGN COINCIDENCE. resid_exp > 0 AND
 *        eflow_attr > 0 at every rung, so the two quantities share a sign throughout; the M2
 *        refutation is therefore a genuine magnitude gap (E_flow is a strictly shrinking POSITIVE
 *        fraction of the residual), not an artefact of E_flow having the wrong sign. E_flow cannot
 *        be the residual because it is everywhere too small, and increasingly so.
 *
 * The punchline: the lone imp-33773 M2 tail ratio (~1900x) generalises to a strictly
 * monotone-widening, everywhere-sub-unity, same-sign magnitude separation over the full k = 6..11
 * ladder. The E_flow attribution of the sub-leading offset residual is refuted not by a sign
 * mismatch and not by a single tail point but by a robust order-of-magnitude gap that opens
 * monotonically with N. The imp-33773 M3 saturation-curvature attribution is the one left standing.
 *
 * MEASUREMENT / CROSS-CHECK ONLY. Cross-consistency + attribution diagnostic, NOT an RH bound.
 * The component model is the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic;
 * the C_mb GUE-conditional per imp-486 is UNTOUCHED; changes no bound; establishes no operator
 * positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. Platt-Trudgian Lambda <= 0.2
 * remains SOTA.
 *
 * @see imp-33773-ecoll-sigma-offset-eflow-attribution (M2 refutation whose tail ratio is tracked here)
 * @see imp-33809-saturation-curvature-hump-vs-k (M3 curvature-hump amplitude vs k)
 * @see imp-33727-sigma-ecoll-exponent-ladder-crossvalidation (offset ladder + E_flow attribution)
 * @see imp-33620-etrunc-ecoll-ladder-1e15-extension (separated-E_coll exponent ladder)
 * @see imp-33582-sigma-postpeak-nearpeak-threshold-decay (full-sigma OLS exponent ladder)
 * @see polymath15-constant-C-C (C_C = C_H sqrt(pi C_Selberg); C_H = 1/8 ansatz)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 = gamma_N)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-33582/imp-33620/imp-33773)
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-33727/imp-33730/imp-33773 exactly

// EXACT inherited imp-3406/imp-33773 sub-terms (no re-derivation, no fresh model).
function parts(N) {
  const T0 = effectiveHeightForN(N);
  const L = Math.log(T0);
  const C_F = (Math.log(T0 / TWO_PI) + 1) / TWO_PI; // imp-398 pinned prefactor
  const E_flow = C_F * (L / T0) * GRONWALL;
  const E_coll = C_C_PINNED * Math.sqrt(L / N); // GUE-conditional (C_H)
  const E_N = E_TRUNC_PT + E_flow + E_coll;
  return { T0, L, E_trunc: E_TRUNC_PT, E_flow, E_coll, E_N, sigma: E_coll / E_N };
}
const sigma = (N) => parts(N).sigma;

// imp-33582/imp-33730 definition: p_sigma = -slope of OLS(ln sigma vs ln N), 4 pts/decade.
function olsSigmaExponent(loN, hiN, ptsPerDecade = 4) {
  const step = 1 / ptsPerDecade;
  const xs = [];
  const ys = [];
  for (let d = Math.log10(loN); d <= Math.log10(hiN) + 1e-9; d += step) {
    const N = Math.pow(10, d);
    xs.push(Math.log(N));
    ys.push(Math.log(sigma(N)));
  }
  const n = xs.length;
  const mx = xs.reduce((a, b) => a + b, 0) / n;
  const my = ys.reduce((a, b) => a + b, 0) / n;
  let sxx = 0;
  let sxy = 0;
  for (let i = 0; i < n; i++) {
    sxx += (xs[i] - mx) ** 2;
    sxy += (xs[i] - mx) * (ys[i] - my);
  }
  return -sxy / sxx;
}

// imp-33620/imp-33727 definition (magnitude): p_ecoll = -d log E_coll / d log N over endpoints.
function ecollExponentMag(loN, hiN) {
  return -Math.log(parts(hiN).E_coll / parts(loN).E_coll) / Math.log(hiN / loN);
}

// s_flow = d ln E_flow / d ln N via a symmetric log-N central difference (small, negative).
function eflowLogSlope(N) {
  const h = 1e-3;
  const lp = Math.log(parts(N * Math.pow(10, h)).E_flow);
  const lm = Math.log(parts(N / Math.pow(10, h)).E_flow);
  return (lp - lm) / (2 * h * Math.LN10);
}

// QUARTER-decade sliding-window ladder k = 6.00, 6.25, ..., 11.00 (21 rungs).
const K_START = 6;
const K_END = 11;
const K_STEP = 0.25;
const RUNGS = [];
for (let k = K_START; k <= K_END + 1e-9; k += K_STEP) {
  const kk = +k.toFixed(2);
  const lo = Math.pow(10, kk);
  const hi = Math.pow(10, kk + 1);
  const pSigma = olsSigmaExponent(lo, hi);
  const pEcoll = ecollExponentMag(lo, hi);
  const ph = parts(hi);
  const residExp = pEcoll * (1 - ph.sigma) - pSigma; // imp-33773 M2 sub-leading residual
  const eflowAttr = (ph.E_flow / ph.E_N) * Math.abs(eflowLogSlope(hi)); // attributed E_flow term
  RUNGS.push({
    k: kk,
    resid_exp: +residExp.toExponential(4),
    eflow_attr: +eflowAttr.toExponential(4),
    eflow_over_resid: +(eflowAttr / residExp).toExponential(4), // E_flow as a fraction of resid
    resid_over_eflow: +(residExp / eflowAttr).toFixed(1), // how many x too small E_flow is
    // imp-33946 FULL-PRECISION rung ratio (raw double residExp/eflowAttr, NO toFixed(1) display
    // rounding) so the ladder and its widening factor survive machine precision -- resolves the
    // imp-33939 caveat that resid_over_eflow above is toFixed(1)-rounded.
    resid_over_eflow_fullprec: +(residExp / eflowAttr).toExponential(9),
  });
}

const EFLOW_OVER_RESID = RUNGS.map((r) => r.eflow_over_resid);
const RESID_OVER_EFLOW = RUNGS.map((r) => r.resid_over_eflow);
const RATIO_HEAD = EFLOW_OVER_RESID[0]; // ~0.4687 (only a factor ~2.1 separation at the head)
const RATIO_TAIL = EFLOW_OVER_RESID[EFLOW_OVER_RESID.length - 1]; // ~5.19e-4 (~1928x in the tail)
const RATIO_MONOTONE_DOWN = EFLOW_OVER_RESID.every((x, i) => i === 0 || x < EFLOW_OVER_RESID[i - 1]);
const ALL_BELOW_UNITY = EFLOW_OVER_RESID.every((x) => x < 1);
const ALL_SAME_SIGN_POSITIVE = RUNGS.every((r) => r.resid_exp > 0 && r.eflow_attr > 0);

// Integer-decade rungs (k = 6,7,8,9,10,11) -- the ones imp-33773 M2 sampled -- for the reuse gate.
const DECADE_RUNGS = RUNGS.filter((r) => Number.isInteger(r.k));
const DECADE_RESID_OVER_EFLOW = DECADE_RUNGS.map((r) => r.resid_over_eflow);
// imp-33773 M2 published resid/eflow endpoints: head ~2.1 (k=6), tail ~1928 (k=11).
const IMP33773_M2_HEAD = 2.1;
const IMP33773_M2_TAIL = 1928;

// Separation-widening factor: how much wider the tail gap is than the head gap.
// CAVEAT (imp-33939, confirming imp-33884/imp-33885): this ratio divides the toFixed(1)-rounded
// head rung resid_over_eflow[0] (roe(6) = 2.134 displayed as 2.1), which inflates the reported
// ~917.9 here versus the exact full-double-precision widening 903.538 (imp-33884 R1-R3; imp-33885
// per-rung cross-validation). The ~1.6% gap is a display-rounding artifact of the O(1) head rung,
// NOT a factor-decomposition error -- see imp-33884/imp-33885 for the un-rounded value.
const SEPARATION_WIDENING = +(RESID_OVER_EFLOW[RESID_OVER_EFLOW.length - 1] / RESID_OVER_EFLOW[0]).toFixed(1);

// imp-33946: FULL-PRECISION recompute of the ratio ladder and its widening factor from the raw
// double-precision sub-terms (resid_over_eflow_fullprec = residExp/eflowAttr, no toFixed(1)),
// removing the imp-33939 head-rung display artifact. RESID_OVER_EFLOW_FULLPREC grows strictly
// monotonically {2.1334..1927.60} (R1) and the raw widening = roe(11)/roe(6) = 903.538 --
// reproducing the imp-33884/imp-33885 un-rounded figure and confirming the ~917.9 toFixed(1)
// value above is a pure ~1.6pct rounding inflation of the O(1) head rung, not a real gap.
const RESID_OVER_EFLOW_FULLPREC = RUNGS.map((r) => r.resid_over_eflow_fullprec);
const RAW_ROE_MONOTONE_UP = RESID_OVER_EFLOW_FULLPREC.every(
  (x, i) => i === 0 || x > RESID_OVER_EFLOW_FULLPREC[i - 1]
);
const SEPARATION_WIDENING_FULLPREC = +(
  RESID_OVER_EFLOW_FULLPREC[RESID_OVER_EFLOW_FULLPREC.length - 1] / RESID_OVER_EFLOW_FULLPREC[0]
).toFixed(3); // ~903.538 (matches imp-33884 fullprec; vs 917.9 toFixed(1) artifact)
const SEPARATION_WIDENING_DISPLAY_CAVEAT =
  'This value divides toFixed(1)-rounded rungs (head roe(6)=2.134 shown as 2.1), inflating the ' +
  'reported widening by ~1.6% versus the exact full-precision value 903.538 -- see imp-33884 ' +
  '(fullprec recompute) and imp-33885 (per-rung cross-validation) for the un-rounded figure.';

export const IMP33810_EFLOW_RESID_RATIO_N_LADDER = {
  id: 'imp-33810',
  proofSection: 'S-frontier',
  question:
    'imp-33773 M2 refuted the E_flow attribution of the sub-leading offset residual partly by ' +
    'noting the E_flow term is ~1900x too small in the tail, but that single tail ratio was never ' +
    'tracked across N. Track the E_flow-term / offset-residual ratio across a finer N ladder, ' +
    'confirm E_flow stays below the residual throughout, and report the N-trend to lock the ' +
    'refutation as a robust same-sign magnitude separation rather than a single-point artifact or ' +
    'a sign coincidence. Measurement/attribution only; NOT an RH bound; no QED.',
  measuredQuantity:
    'per quarter-decade window [10^k,10^(k+1)], k = 6.00..11.00 (21 rungs): eflow_attr/resid_exp = ' +
    '((E_flow/E_N)|s_flow|) / (p_ecoll(1 - sigma_hi) - p_sigma), evaluated at the window upper endpoint',
  ladder: RUNGS,
  ratioTrend: {
    head_k6: RATIO_HEAD, // ~0.4687 -> separation only ~2.1x at the head
    tail_k11: RATIO_TAIL, // ~5.19e-4 -> separation ~1928x in the tail
    strictly_monotone_widening: RATIO_MONOTONE_DOWN, // eflow/resid strictly decreasing in N
    all_below_unity: ALL_BELOW_UNITY, // E_flow never reaches the residual it is claimed to be
    same_sign_positive: ALL_SAME_SIGN_POSITIVE, // resid>0 AND eflow>0 -> NOT a sign coincidence
    separation_widening_factor: SEPARATION_WIDENING, // tail gap / head gap ~ 918x
    separation_widening_display_caveat: SEPARATION_WIDENING_DISPLAY_CAVEAT, // imp-33939/imp-33884/imp-33885
    separation_widening_fullprec: SEPARATION_WIDENING_FULLPREC, // imp-33946: ~903.538, un-rounded
    raw_roe_monotone_up: RAW_ROE_MONOTONE_UP, // imp-33946: full-prec resid/eflow strictly rising in N
  },
  reuse: {
    imp33773_M2_head_resid_over_eflow: IMP33773_M2_HEAD, // ~2.1 (k=6)
    imp33773_M2_tail_resid_over_eflow: IMP33773_M2_TAIL, // ~1928 (k=11)
    decade_resid_over_eflow: DECADE_RESID_OVER_EFLOW, // {2.1,7.0,34.4,163.5,623.1,1927.6}
  },
  finding: {
    R1_integer_decades_reproduce_imp33773:
      'On the shared k=6..11 the residual-over-eflow ratio recomputes to {2.1,7.0,34.4,163.5,' +
      '623.1,1927.6}, head ~2.1 and tail ~1928 matching the imp-33773 M2 endpoints -- the finer ' +
      'ladder is the same measurement at 4x resolution, not a new model.',
    R2_eflow_below_residual_throughout:
      'eflow_attr/resid_exp = {0.4687,...,5.19e-4} is BELOW 1 at all 21 rungs, so the E_flow term ' +
      'never even reaches the residual it is claimed to BE -- the attribution fails on magnitude ' +
      'uniformly, not just at one tail point.',
    R3_separation_widens_monotonically:
      'eflow_attr/resid_exp is STRICTLY decreasing in N, from ~0.47 (a factor ~2.1 at the head) to ' +
      '~5.19e-4 (~1928x, three orders) in the tail. The 1900x tail number is the ENDPOINT of a ' +
      'monotone-widening trend across k=6..11, not a single-point artifact; and the separation is ' +
      'only ~2x at the head, so it is NOT uniformly orders-of-magnitude -- it GROWS into the tail.',
    R5_fullprec_ladder_survives_rounding:
      'imp-33946: recomputing the ladder from the raw double-precision sub-terms (resid_exp and ' +
      'E_flow, no toFixed(1)) leaves R1 and R2 intact -- the full-precision resid/eflow ladder is ' +
      'strictly monotone-increasing {2.1334..1927.60} and eflow_attr stays below resid_exp at every ' +
      'rung -- and pins the un-rounded separation-widening at 903.538 (matching imp-33884/imp-33885), ' +
      'confirming the displayed ~917.9 is a ~1.6pct toFixed(1) inflation of the O(1) head rung, not a ' +
      'real magnitude discrepancy.',
    R4_same_sign_not_sign_coincidence:
      'resid_exp > 0 AND eflow_attr > 0 at every rung, so the two quantities share a sign ' +
      'throughout; the M2 refutation is a genuine magnitude gap (E_flow is a strictly shrinking ' +
      'POSITIVE fraction of the residual), not an artefact of E_flow having the wrong sign.',
  },
  isRigorous: false,
  verdict:
    'MEASUREMENT / ATTRIBUTION (frontier-direction, NOT rigorous). Tracking the E_flow-term / ' +
    'offset-residual ratio across a quarter-decade ladder k=6.00..11.00 LOCKS the imp-33773 M2 ' +
    'refutation: eflow_attr/resid_exp is below 1 at every one of the 21 rungs (E_flow never reaches ' +
    'the residual), is strictly monotone-decreasing in N from ~0.47 at the head to ~5.19e-4 in the ' +
    'tail, and both quantities are POSITIVE throughout. So the lone imp-33773 ~1900x tail ratio ' +
    'generalises to a same-sign, everywhere-sub-unity, monotone-widening magnitude separation -- ' +
    'the E_flow attribution is refuted by a robust order-of-magnitude gap that opens with N, not by ' +
    'a sign mismatch and not by a single tail point. This also corrects any "orders of magnitude ' +
    'throughout" reading: the separation is only ~2.1x at the head and widens ~918x into the tail. ' +
    'The imp-33773 M3 saturation-curvature attribution is the one left standing. The component ' +
    'model is the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the C_mb ' +
    'GUE-conditional per imp-486 is UNTOUCHED; changes no bound; establishes no operator ' +
    'positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. Platt-Trudgian Lambda <= 0.2 ' +
    'remains SOTA.',
  citation:
    'imp-33773 (M2 refutation whose tail ratio is tracked here); imp-33809 (M3 curvature-hump vs k); ' +
    'imp-33727 (offset ladder + E_flow attribution); imp-33620 (separated-E_coll exponent ladder); ' +
    'imp-33582 (full-sigma OLS ladder); imp-486 (C_mb GUE-conditional); imp-2631 (E_trunc ' +
    'fixed-strip route); lambda-rh-height-mapping (effectiveHeightForN).',
};

export const IMP33810_EFLOW_RESID_RATIO_N_LADDER_ASSERTIONS = [
  {
    // (R1) Reuse gate: the integer-decade rungs reproduce the imp-33773 M2 resid/eflow endpoints.
    id: 'imp33810-reproduces-imp33773-m2-endpoints',
    description: 'integer-decade resid/eflow head ~2.1 and tail ~1928 match imp-33773 M2',
    holds: () =>
      DECADE_RESID_OVER_EFLOW.length === 6 &&
      Math.abs(DECADE_RESID_OVER_EFLOW[0] - IMP33773_M2_HEAD) < 0.15 &&
      Math.abs(DECADE_RESID_OVER_EFLOW[5] - IMP33773_M2_TAIL) < 5,
  },
  {
    // (R2) E_flow is strictly below the residual at every rung (magnitude-separated throughout).
    id: 'imp33810-eflow-below-residual-throughout',
    description: 'eflow_attr/resid_exp < 1 at all 21 rungs -- E_flow never reaches the residual',
    holds: () => RUNGS.length === 21 && ALL_BELOW_UNITY,
  },
  {
    // (R3) The separation widens monotonically in N -- the 1900x tail is a trend endpoint, and the
    // head separation is only ~2x, so it is NOT uniformly orders-of-magnitude.
    id: 'imp33810-separation-widens-monotonically',
    description: 'eflow/resid strictly decreasing; head ~0.47 (factor ~2.1), tail ~5.19e-4 (~1928x)',
    holds: () =>
      RATIO_MONOTONE_DOWN &&
      RATIO_HEAD > 0.4 &&
      RATIO_HEAD < 0.5 &&
      RATIO_TAIL < 1e-3 &&
      RATIO_TAIL > 0 &&
      SEPARATION_WIDENING > 100,
  },
  {
    // (R4) Same-sign magnitude separation: resid>0 AND eflow>0 everywhere -> NOT a sign coincidence.
    id: 'imp33810-same-sign-not-sign-coincidence',
    description: 'resid_exp > 0 and eflow_attr > 0 at every rung -- a magnitude gap, not a sign flip',
    holds: () => ALL_SAME_SIGN_POSITIVE,
  },
  {
    // (R5, imp-33946) Full-precision recompute: the raw-double resid/eflow ladder is strictly
    // increasing and its widening reproduces the imp-33884 un-rounded 903.538, so R1/R2 survive
    // the removal of the toFixed(1) head-rung display artifact flagged by imp-33939.
    id: 'imp33810-fullprec-ladder-survives-rounding',
    description: 'raw resid/eflow strictly rising; fullprec widening ~903.538 (not the 917.9 artifact)',
    holds: () =>
      RESID_OVER_EFLOW_FULLPREC.length === 21 &&
      RAW_ROE_MONOTONE_UP &&
      ALL_BELOW_UNITY &&
      Math.abs(SEPARATION_WIDENING_FULLPREC - 903.538) < 0.05 &&
      SEPARATION_WIDENING_FULLPREC < SEPARATION_WIDENING,
  },
  {
    // Honesty gate: measurement/attribution only, isRigorous false, no QED, PT SOTA.
    id: 'imp33810-honesty-gate-no-qed',
    description: 'Measurement only: isRigorous false, ratio below unity throughout, no QED, PT SOTA',
    holds: () =>
      IMP33810_EFLOW_RESID_RATIO_N_LADDER.isRigorous === false &&
      IMP33810_EFLOW_RESID_RATIO_N_LADDER.ratioTrend.all_below_unity === true &&
      IMP33810_EFLOW_RESID_RATIO_N_LADDER.ratioTrend.same_sign_positive === true &&
      /NO QED/.test(IMP33810_EFLOW_RESID_RATIO_N_LADDER.verdict) &&
      /remains SOTA/.test(IMP33810_EFLOW_RESID_RATIO_N_LADDER.verdict),
  },
];

for (const a of IMP33810_EFLOW_RESID_RATIO_N_LADDER_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-33810-eflow-resid-ratio-N-ladder assertion failed: ${a.id}`);
  }
}
