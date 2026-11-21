/**
 * @module imp-34369-peak-relocation-regime-width
 *
 * imp-34369 (numerical, frontier-direction): imp-34288 found the imp-34085 |trough|/|peak| OLS
 * amplitude ratio climbs to a maximum ~0.9072 at window width w = 9.25 (kEnd = 15.25) then RECEDES
 * because the argmax peak MIGRATES off the receding right endpoint (argmax.k = kEnd) to the near-left
 * rung k = 6.5, after which the ratio falls to ~0.6184 by the grid stopping point kEnd = 20 (w = 14).
 * imp-34288 quoted the migration width as "w ~ 9.25" and STOPPED at kEnd = 20. This module answers the
 * two concrete questions imp-34288 left open, reusing the VERBATIM imp-33843/imp-34288 OLS residual
 * machinery (parts/buildLadder/fitLadder re-implemented identically; a reuse gate reproduces the
 * imp-34288 max ratio, crossover width, and kEnd = 20 last-row ratio exactly):
 *
 *   (Q1) LOCATE THE MIGRATION WIDTH w* MORE PRECISELY. Probe a fine kEnd grid (15.00 .. 15.75 in 0.05
 *        steps) around the imp-34288 crossover.
 *   (Q2) EXTEND THE GRID PAST kEnd = 20. Continue the window-width grid past the imp-34288 stopping
 *        point and measure whether the post-migration receding ratio (~0.6184 at kEnd = 20) restabilizes
 *        at a floor or keeps falling.
 *
 * THE FINDING (measurement only; two sharp results, both refining imp-34288)
 * -------------------------------------------------------------------------
 *   (F1) THE MIGRATION IS A DISCRETE RUNG-QUANTIZED STEP AT w* = 9.5, NOT A CONTINUOUS THRESHOLD. The
 *        imp-33810 ladder is quantized at dk = 0.25 (rungs k = 6.00, 6.25, ... start at 6), so a kEnd
 *        strictly between two rungs TRUNCATES to the last rung <= kEnd and produces the IDENTICAL ladder
 *        and IDENTICAL fit. Concretely kEnd = 15.30, 15.35, 15.40, 15.45 all reproduce the kEnd = 15.25
 *        fit EXACTLY (ratio 0.9072, peak endpoint-locked at k = 15.25); the peak RELOCATES to k = 6.5 the
 *        instant the rung at k = 15.5 is added (kEnd = 15.5, w = 9.5). So w* is NOT a continuous parameter
 *        crossing that finer resolution would sharpen -- it is bracketed to the half-open rung interval
 *        (9.25, 9.5] and TRIGGERED by the discrete addition of the k = 15.5 rung. imp-34288 "w ~ 9.25" is
 *        the last endpoint-locked width (carrying the maximum ratio 0.9072); the first migrated width is
 *        w* = 9.5 exactly. The migration is a step function of the rung count, not a smooth transition.
 *   (F2) THE POST-MIGRATION RATIO DOES NOT RESTABILIZE -- IT FALLS MONOTONICALLY TO A HARD MODEL-BREAKDOWN
 *        WALL. Extending past kEnd = 20 the ratio keeps DECLINING with no floor: 0.6184 (kEnd = 20) ->
 *        0.6026 -> 0.5847 (near-left peak k = 6.25) -> 0.5109 -> 0.3628 -> 0.1607 (kEnd = 21.25). A SECOND
 *        regime flip occurs at kEnd = 20.75 (w = 14.75): the argmax peak RE-LOCKS to the receding right
 *        endpoint (peakK = kEnd again), and the ratio then collapses ~0.585 -> ~0.161 over three rungs.
 *        Past kEnd = 21.25 the OLS log-linear surrogate DISSOLVES ENTIRELY: the imp-33773 M2 sub-leading
 *        residual denominator residExp = pEcoll (1 - sigma) - pSigma crosses zero (residExp = +8.19e-9 at
 *        k = 21.25 turns to -4.97e-8 at k = 21.5, interpolated zero at k* ~ 21.29), so the ladder response
 *        eflow_over_resid goes NEGATIVE, its logarithm is undefined, and every fit on a ladder reaching
 *        k >= 21.5 returns NaN. So the answer to "restabilize or keep falling" is UNAMBIGUOUS: the ratio
 *        KEEPS FALLING, to zero-ish, and the grid has a HARD RIGHT WALL at the residExp sign change near
 *        kEnd ~ 21.3 -- there is NO floor and the surrogate cannot be evaluated further on this component
 *        model. The imp-34288 kEnd = 20 stopping point was inside a monotone decline, not near a plateau.
 *
 * The punchline: sharpening imp-34288 in both directions shows (F1) the peak relocation is a discrete
 * rung-addition step at w* = 9.5 (not a continuously-resolvable threshold; the maximum ratio 0.9072 sits
 * at the last pre-migration width w = 9.25) and (F2) the post-migration ratio does NOT restabilize -- it
 * declines monotonically 0.6184 -> 0.1607, re-locks its peak to the right endpoint at kEnd = 20.75, and
 * then the whole OLS surrogate becomes ill-defined at kEnd ~ 21.5 because the imp-33773 residExp
 * denominator changes sign (k* ~ 21.29). No amplitude floor exists on this grid; the component model
 * simply runs out at the residExp zero.
 *
 * MEASUREMENT / GRID-REFINEMENT ONLY. A finer + longer sweep of an inherited descriptive OLS surrogate on
 * an inherited ladder, NOT an RH bound. The component model sigma = E_coll / (E_trunc + E_flow + E_coll)
 * is the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the residExp sign change is
 * a feature of that surrogate denominator, NOT a statement about zeros; the C_mb GUE-conditional per
 * imp-486 is UNTOUCHED; changes no bound; establishes no operator positivity; imp-3066 K_a >= 0 untouched;
 * the imp-33843 log-linear form verdict is untouched; no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-34288-trough-peak-ratio-ceiling-extension (the ~0.907 max, w ~ 9.25 migration, kEnd = 20 stop)
 * @see imp-34085-trough-peak-ratio-convergence (the |trough|/|peak| ratio sequence and machinery reused)
 * @see imp-33843-eflow-resid-widening-form-fit (the log-linear OLS re-run on the refined grid)
 * @see imp-33810-eflow-resid-ratio-N-ladder (the k=6..kEnd ladder, quantized at dk = 0.25)
 * @see imp-33773 (the M2 sub-leading residual residExp whose sign change walls the grid)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 = gamma_N)
 * @see polymath15-constant-C-C (C_C_PINNED collision constant in E_coll)
 * @see imp-486 (C_mb GUE-conditional, untouched)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';
import { IMP34288_TROUGH_PEAK_RATIO_CEILING_EXTENSION } from './imp-34288-trough-peak-ratio-ceiling-extension.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631), exactly as imp-33810/imp-34288
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP);

// EXACT inherited imp-3406/imp-33810/imp-34288 sub-terms (no re-derivation, no fresh model).
function parts(N) {
  const T0 = effectiveHeightForN(N);
  const L = Math.log(T0);
  const C_F = (Math.log(T0 / TWO_PI) + 1) / TWO_PI;
  const E_flow = C_F * (L / T0) * GRONWALL;
  const E_coll = C_C_PINNED * Math.sqrt(L / N);
  const E_N = E_TRUNC_PT + E_flow + E_coll;
  return { E_flow, E_coll, E_N, sigma: E_coll / E_N };
}
const sigma = (N) => parts(N).sigma;

function olsSlope(xs, ys) {
  const n = xs.length;
  const mx = xs.reduce((a, b) => a + b, 0) / n;
  const my = ys.reduce((a, b) => a + b, 0) / n;
  let sxx = 0;
  let sxy = 0;
  for (let i = 0; i < n; i++) {
    sxx += (xs[i] - mx) ** 2;
    sxy += (xs[i] - mx) * (ys[i] - my);
  }
  return sxy / sxx;
}
function ols(xs, ys) {
  const b = olsSlope(xs, ys);
  const mx = xs.reduce((a, c) => a + c, 0) / xs.length;
  const my = ys.reduce((a, c) => a + c, 0) / ys.length;
  return { a: my - b * mx, b };
}
function olsSigmaExponent(loN, hiN, ptsPerDecade = 4) {
  const step = 1 / ptsPerDecade;
  const xs = [];
  const ys = [];
  for (let d = Math.log10(loN); d <= Math.log10(hiN) + 1e-9; d += step) {
    const N = Math.pow(10, d);
    xs.push(Math.log(N));
    ys.push(Math.log(sigma(N)));
  }
  return -olsSlope(xs, ys);
}
function ecollExponentMag(loN, hiN) {
  return -Math.log(parts(hiN).E_coll / parts(loN).E_coll) / Math.log(hiN / loN);
}
function eflowLogSlope(N) {
  const h = 1e-3;
  const lp = Math.log(parts(N * Math.pow(10, h)).E_flow);
  const lm = Math.log(parts(N / Math.pow(10, h)).E_flow);
  return (lp - lm) / (2 * h * Math.LN10);
}

// imp-33773 M2 sub-leading residual denominator (the quantity whose sign change walls the grid).
function residExpAt(kk) {
  const lo = Math.pow(10, kk);
  const hi = Math.pow(10, kk + 1);
  const pSigma = olsSigmaExponent(lo, hi);
  const pEcoll = ecollExponentMag(lo, hi);
  const ph = parts(hi);
  return pEcoll * (1 - ph.sigma) - pSigma;
}

// Build the quarter-decade ladder eflow_over_resid over k = 6.00 .. kEnd (inclusive), same as imp-33810.
function buildLadder(kEnd) {
  const R = [];
  for (let k = 6; k <= kEnd + 1e-9; k += 0.25) {
    const kk = +k.toFixed(2);
    const hi = Math.pow(10, kk + 1);
    const ph = parts(hi);
    const residExp = residExpAt(kk);
    const eflowAttr = (ph.E_flow / ph.E_N) * Math.abs(eflowLogSlope(hi));
    R.push({ k: kk, eflow_over_resid: +(eflowAttr / residExp).toExponential(4) });
  }
  return R;
}

// Fit the imp-33843 log-linear surrogate; NaN propagates if any rung eflow_over_resid <= 0 (log undefined).
function fitLadder(R) {
  const KS = R.map((r) => r.k);
  const Y = R.map((r) => Math.log(r.eflow_over_resid));
  const F = ols(KS, Y);
  const RES = KS.map((k, i) => Y[i] - (F.a + F.b * k));
  let minI = 0;
  let maxI = 0;
  for (let i = 0; i < RES.length; i++) {
    if (RES[i] < RES[minI]) minI = i;
    if (RES[i] > RES[maxI]) maxI = i;
  }
  const my = Y.reduce((a, b) => a + b, 0) / Y.length;
  const ssTot = Y.reduce((s, y) => s + (y - my) ** 2, 0);
  const ssRes = RES.reduce((s, e) => s + e * e, 0);
  return {
    r2: +(1 - ssRes / ssTot).toFixed(6),
    argmax: { k: KS[maxI], resid: +RES[maxI].toExponential(4), isEndpoint: maxI === RES.length - 1 },
    argmin: { k: KS[minI], resid: +RES[minI].toExponential(4) },
  };
}

function rowFor(kEnd) {
  const ke = +kEnd.toFixed(2);
  const f = fitLadder(buildLadder(ke));
  return {
    kEnd: ke,
    w: +(ke - 6).toFixed(2),
    peakK: f.argmax.k,
    peakIsEndpoint: f.argmax.isEndpoint,
    peak: f.argmax.resid,
    troughK: f.argmin.k,
    trough: f.argmin.resid,
    ratio: +(Math.abs(f.argmin.resid) / Math.abs(f.argmax.resid)).toFixed(4),
    r2: f.r2,
  };
}

// ---- (Q1) Fine migration probe: kEnd = 15.00 .. 15.75 in 0.05 steps around the imp-34288 crossover ----
// effectiveW is the width of the EFFECTIVE last rung (kEnd truncated to the dk = 0.25 grid): a nominal
// kEnd between two rungs contributes NO new rung, so its ladder (and fit) equals that of the lower rung.
const effectiveW = (kEnd) => +(0.25 * Math.floor((kEnd - 6) / 0.25 + 1e-9)).toFixed(2);
const MIGRATION_PROBE = [];
for (let ke = 15.0; ke <= 15.75 + 1e-9; ke += 0.05) {
  const r = rowFor(+ke.toFixed(2));
  r.effectiveW = effectiveW(r.kEnd);
  MIGRATION_PROBE.push(r);
}
// Bracket w* by the EFFECTIVE rung width: the largest endpoint-locked effective width and the smallest
// migrated effective width straddle the migration to a single rung interval.
const LOCKED_EFF_WIDTHS = MIGRATION_PROBE.filter((r) => r.peakIsEndpoint === true).map((r) => r.effectiveW);
const MIGRATED_EFF_WIDTHS = MIGRATION_PROBE.filter((r) => r.peakIsEndpoint === false).map((r) => r.effectiveW);
const LAST_ENDPOINT_LOCKED = [...MIGRATION_PROBE].reverse().find((r) => r.peakIsEndpoint === true);
const FIRST_MIGRATED = MIGRATION_PROBE.find((r) => r.peakIsEndpoint === false);
// Sub-grid quantization witness: kEnd 15.25 and 15.45 (both truncate to the k = 15.25 last rung).
const ROW_1525 = MIGRATION_PROBE.find((r) => r.kEnd === 15.25);
const ROW_1545 = MIGRATION_PROBE.find((r) => Math.abs(r.kEnd - 15.45) < 1e-9);
const SUBGRID_IDENTICAL = ROW_1525 && ROW_1545 && ROW_1525.ratio === ROW_1545.ratio && ROW_1525.peakK === ROW_1545.peakK;
const MIGRATION_WIDTH_STAR = MIGRATED_EFF_WIDTHS.length ? Math.min(...MIGRATED_EFF_WIDTHS) : null; // 9.5
const MAX_ENDPOINT_LOCKED_W = LOCKED_EFF_WIDTHS.length ? Math.max(...LOCKED_EFF_WIDTHS) : null; // 9.25

// ---- (Q2) Extended grid past kEnd = 20 up to the residExp wall (0.25 steps) ----
const EXTENDED_GRID = [];
for (let ke = 20; ke <= 21.25 + 1e-9; ke += 0.25) {
  EXTENDED_GRID.push(rowFor(+ke.toFixed(2)));
}
const EXT_RATIOS = EXTENDED_GRID.map((r) => r.ratio);
// Ratio keeps falling (strict monotone decline) across the whole extended grid -- no floor / restabilization.
let RATIO_STRICTLY_DECLINES = true;
for (let i = 1; i < EXT_RATIOS.length; i++) {
  if (!(EXT_RATIOS[i] < EXT_RATIOS[i - 1])) RATIO_STRICTLY_DECLINES = false;
}
// Second regime flip: the argmax RE-LOCKS to the receding right endpoint at kEnd = 20.75 (w = 14.75).
const ENDPOINT_RELOCK_ROW = EXTENDED_GRID.find((r) => r.kEnd > 20.5 && r.peakIsEndpoint === true);
// The hard wall: the first kEnd whose ladder reaches a rung with residExp <= 0, giving a NaN fit.
const WALL_ROW = rowFor(21.5);
const SURROGATE_DISSOLVES_AT_WALL = Number.isNaN(WALL_ROW.ratio);
// Bracket the residExp zero crossing and interpolate k* (the model-breakdown rung).
const RESID_AT_2125 = residExpAt(21.25);
const RESID_AT_2150 = residExpAt(21.5);
const RESID_SIGN_CHANGE = RESID_AT_2125 > 0 && RESID_AT_2150 < 0;
const RESID_ZERO_KSTAR = +(21.25 + 0.25 * (RESID_AT_2125 / (RESID_AT_2125 - RESID_AT_2150))).toFixed(4); // ~21.29

// ---- Reuse gate: the machinery reproduces imp-34288 at the migration and the kEnd = 20 last row ----
const IMP34288 = IMP34288_TROUGH_PEAK_RATIO_CEILING_EXTENSION;
const GATE_ROW_1525 = rowFor(15.25); // imp-34288 max ratio 0.9072 at w = 9.25
const GATE_ROW_1550 = rowFor(15.5); // imp-34288 crossover: peak migrates to k = 6.5, ratio 0.8946
const GATE_ROW_20 = rowFor(20); // imp-34288 last row ratio 0.6184
const REUSE_GATE_OK =
  Math.abs(GATE_ROW_1525.ratio - IMP34288.maxRatio) < 1e-9 &&
  GATE_ROW_1550.peakK === IMP34288.crossoverPeakK &&
  Math.abs(GATE_ROW_20.ratio - IMP34288.lastRowRatio) < 1e-9;

export const IMP34369_PEAK_RELOCATION_REGIME_WIDTH = {
  id: 'imp-34369',
  proofSection: 'S-frontier',
  question:
    'imp-34288 found the imp-34085 |trough|/|peak| OLS amplitude ratio peaks at ~0.9072 (w = 9.25) then ' +
    'recedes to ~0.6184 by kEnd = 20 as the argmax peak migrates off the receding right endpoint to the ' +
    'near-left rung k = 6.5. (Q1) Locate the migration width w* more precisely, and (Q2) extend the grid ' +
    'past kEnd = 20 to determine whether the post-migration receding ratio restabilizes at a floor or ' +
    'keeps falling. Measurement / grid-refinement only; NOT an RH bound; no QED.',
  measuredQuantity:
    'A fine kEnd probe (15.00..15.75, 0.05 steps) resolving the migration width, and the extended ' +
    'window-width grid (kEnd = 20.00..21.25, 0.25 steps) with its residExp-zero wall, using the verbatim ' +
    'imp-33843/imp-34288 OLS residual machinery (reuse gate reproduces the imp-34288 max ratio, crossover ' +
    'peak, and kEnd = 20 last row exactly)',
  reuseGateOk: REUSE_GATE_OK, // true -- same measurement, refined
  // (Q1) The migration width.
  migrationProbeStep: 0.05,
  subgridIdentical: SUBGRID_IDENTICAL, // true -- kEnd 15.25 and 15.45 give identical fits (rung-quantized)
  maxEndpointLockedW: MAX_ENDPOINT_LOCKED_W, // 9.25 -- last endpoint-locked width, carries the max ratio
  maxEndpointLockedRatio: LAST_ENDPOINT_LOCKED ? LAST_ENDPOINT_LOCKED.ratio : null, // 0.9072
  migrationWidthStar: MIGRATION_WIDTH_STAR, // 9.5 -- first migrated width (rung k = 15.5 added)
  migrationIsRungQuantizedStep: SUBGRID_IDENTICAL && MIGRATION_WIDTH_STAR === 9.5, // true, not continuous
  // (Q2) The extension past kEnd = 20.
  extendedGrid: EXTENDED_GRID, // kEnd 20.00..21.25
  extendedRatios: EXT_RATIOS, // 0.6184, 0.6026, 0.5847, 0.5109, 0.3628, 0.1607
  ratioStrictlyDeclinesPastKEnd20: RATIO_STRICTLY_DECLINES, // true -- NO restabilization, NO floor
  endpointRelockKEnd: ENDPOINT_RELOCK_ROW ? ENDPOINT_RELOCK_ROW.kEnd : null, // 20.75 -- second regime flip
  endpointRelockW: ENDPOINT_RELOCK_ROW ? ENDPOINT_RELOCK_ROW.w : null, // 14.75
  wallKEnd: 21.5, // first kEnd whose ladder reaches a residExp <= 0 rung
  surrogateDissolvesAtWall: SURROGATE_DISSOLVES_AT_WALL, // true -- NaN fit past the residExp zero
  residExpSignChange: RESID_SIGN_CHANGE, // true -- +8.19e-9 at k=21.25 -> -4.97e-8 at k=21.5
  residExpAtK2125: +RESID_AT_2125.toExponential(4),
  residExpAtK2150: +RESID_AT_2150.toExponential(4),
  residExpZeroKStar: RESID_ZERO_KSTAR, // ~21.29 -- interpolated model-breakdown rung
  ratioRestabilizes: false, // the answer to the ticket: it keeps falling, no floor
  finding: {
    F1_migration_is_rung_quantized_step_at_w_star_9p5:
      'The imp-33810 ladder is quantized at dk = 0.25, so a kEnd strictly between two rungs truncates to ' +
      'the last rung <= kEnd and gives the IDENTICAL fit: kEnd = 15.30..15.45 all reproduce the ' +
      'kEnd = 15.25 fit exactly (ratio 0.9072, peak endpoint-locked at k = 15.25). The peak relocates to ' +
      'k = 6.5 the instant the k = 15.5 rung is added (kEnd = 15.5, w = 9.5). So w* is NOT a continuous ' +
      'threshold that finer resolution sharpens -- it is bracketed to the rung interval (9.25, 9.5] and ' +
      'triggered by the discrete rung addition. The imp-34288 "w ~ 9.25" is the last endpoint-locked ' +
      'width (carrying the maximum ratio 0.9072); the first migrated width is w* = 9.5 exactly.',
    F2_post_migration_ratio_falls_to_a_residExp_wall_no_floor:
      'Past kEnd = 20 the ratio keeps DECLINING with no floor: 0.6184 -> 0.6026 -> 0.5847 -> 0.5109 -> ' +
      '0.3628 -> 0.1607 (kEnd = 21.25). A SECOND regime flip at kEnd = 20.75 (w = 14.75) RE-LOCKS the ' +
      'argmax peak to the receding right endpoint, and the ratio then collapses. Past kEnd = 21.25 the OLS ' +
      'log-linear surrogate DISSOLVES: the imp-33773 residExp denominator crosses zero (+8.19e-9 at ' +
      'k = 21.25 -> -4.97e-8 at k = 21.5, interpolated k* ~ 21.29), so eflow_over_resid goes negative, its ' +
      'log is undefined, and every fit reaching k >= 21.5 returns NaN. The ratio does NOT restabilize; it ' +
      'keeps falling to a HARD model-breakdown wall at the residExp sign change near kEnd ~ 21.3.',
  },
  isRigorous: false,
  verdict:
    'MEASUREMENT / GRID-REFINEMENT (frontier-direction, NOT rigorous). Refining imp-34288 in both ' +
    'directions with the verbatim imp-33843 OLS residual machinery (reuse gate reproduces the imp-34288 ' +
    'max ratio 0.9072, the crossover peak k = 6.5, and the kEnd = 20 ratio 0.6184 exactly): (F1) the ' +
    'peak-relocation is a DISCRETE rung-quantized step at w* = 9.5 (adding the k = 15.5 rung), NOT a ' +
    'continuously-resolvable threshold -- sub-0.25 kEnd values reproduce the kEnd = 15.25 fit identically ' +
    'because the ladder is quantized at dk = 0.25, and the maximum ratio 0.9072 sits at the last ' +
    'pre-migration width w = 9.25; (F2) the post-migration ratio does NOT restabilize at a floor -- it ' +
    'declines monotonically 0.6184 -> 0.1607, re-locks its peak to the receding right endpoint at ' +
    'kEnd = 20.75, and then the whole OLS surrogate becomes ill-defined at kEnd ~ 21.5 because the ' +
    'imp-33773 residExp denominator changes sign (interpolated k* ~ 21.29), driving eflow_over_resid ' +
    'negative and its logarithm undefined. So the ratio KEEPS FALLING to a hard model-breakdown wall; ' +
    'there is no amplitude floor on this grid. The component model is the inherited imp-3220/imp-3406 ' +
    'extrapolation, NOT a rigorous asymptotic; the residExp sign change is a surrogate-denominator ' +
    'feature, NOT a statement about zeros; the imp-33843 log-linear form verdict is untouched; the C_mb ' +
    'GUE-conditional per imp-486 is UNTOUCHED; changes no bound; establishes no operator positivity; ' +
    'imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-34288 (the ~0.907 max, w ~ 9.25 migration, kEnd = 20 stop, refined here); imp-34085 (the ' +
    '|trough|/|peak| ratio sequence and machinery reused); imp-33843 (the log-linear OLS re-run); ' +
    'imp-33810 (the k=6..kEnd ladder quantized at dk = 0.25); imp-33773 (the residExp M2 residual whose ' +
    'sign change walls the grid); lambda-rh-height-mapping (effectiveHeightForN); polymath15-constant-C-C ' +
    '(C_C_PINNED); imp-486 (C_mb GUE-conditional, untouched).',
};

export const IMP34369_PEAK_RELOCATION_REGIME_WIDTH_ASSERTIONS = [
  {
    // Reuse gate: the machinery reproduces the imp-34288 max ratio, crossover peak, and kEnd = 20 row.
    id: 'imp34369-reuse-gate-reproduces-imp34288',
    description: 'reuse gate reproduces imp-34288 max ratio 0.9072, crossover peak k=6.5, kEnd=20 ratio 0.6184',
    holds: () =>
      REUSE_GATE_OK === true &&
      Math.abs(GATE_ROW_1525.ratio - 0.9072) < 1e-9 &&
      GATE_ROW_1550.peakK === 6.5 &&
      Math.abs(GATE_ROW_20.ratio - 0.6184) < 1e-9,
  },
  {
    // (F1) The migration is a discrete rung-quantized step: sub-0.25 kEnd give identical fits, w* = 9.5.
    id: 'imp34369-migration-is-rung-quantized-step-w-star-9p5',
    description: 'kEnd 15.25 and 15.45 identical; last endpoint-locked w=9.25 (ratio 0.9072); first migrated w*=9.5',
    holds: () =>
      SUBGRID_IDENTICAL === true &&
      Math.abs(MAX_ENDPOINT_LOCKED_W - 9.25) < 1e-9 &&
      Math.abs(LAST_ENDPOINT_LOCKED.ratio - 0.9072) < 1e-9 &&
      Math.abs(MIGRATION_WIDTH_STAR - 9.5) < 1e-9 &&
      FIRST_MIGRATED.peakK === 6.5,
  },
  {
    // (F2a) The post-migration ratio declines strictly and never restabilizes across kEnd = 20..21.25.
    id: 'imp34369-post-migration-ratio-strictly-declines-no-floor',
    description: 'extended ratios 0.6184..0.1607 strictly decreasing (no floor); ratioRestabilizes false',
    holds: () =>
      RATIO_STRICTLY_DECLINES === true &&
      EXTENDED_GRID.length === 6 &&
      Math.abs(EXT_RATIOS[0] - 0.6184) < 1e-9 &&
      Math.abs(EXT_RATIOS[EXT_RATIOS.length - 1] - 0.1607) < 1e-9 &&
      IMP34369_PEAK_RELOCATION_REGIME_WIDTH.ratioRestabilizes === false,
  },
  {
    // (F2b) Second regime flip: the argmax re-locks to the receding right endpoint at kEnd = 20.75.
    id: 'imp34369-endpoint-relock-second-regime-flip',
    description: 'argmax re-locks to right endpoint at kEnd 20.75 (w 14.75), a second regime flip',
    holds: () =>
      ENDPOINT_RELOCK_ROW !== undefined &&
      ENDPOINT_RELOCK_ROW.kEnd === 20.75 &&
      Math.abs(ENDPOINT_RELOCK_ROW.w - 14.75) < 1e-9 &&
      ENDPOINT_RELOCK_ROW.peakIsEndpoint === true,
  },
  {
    // (F2c) The hard wall: residExp crosses zero at k* ~ 21.29 and the surrogate dissolves to NaN.
    id: 'imp34369-residExp-sign-change-walls-the-grid',
    description: 'residExp +8.19e-9 (k=21.25) -> -4.97e-8 (k=21.5); k* ~ 21.29; kEnd=21.5 fit is NaN',
    holds: () =>
      RESID_SIGN_CHANGE === true &&
      RESID_AT_2125 > 0 &&
      RESID_AT_2150 < 0 &&
      Math.abs(RESID_ZERO_KSTAR - 21.29) < 0.05 &&
      SURROGATE_DISSOLVES_AT_WALL === true,
  },
  {
    // Honesty gate: measurement only, isRigorous false, ratio does not restabilize, no QED, no refereed bound is changed.
    id: 'imp34369-honesty-gate-no-qed',
    description: 'measurement only: isRigorous false, ratioRestabilizes false, no QED, no refereed bound is changed, imp-3066 untouched',
    holds: () =>
      IMP34369_PEAK_RELOCATION_REGIME_WIDTH.isRigorous === false &&
      IMP34369_PEAK_RELOCATION_REGIME_WIDTH.ratioRestabilizes === false &&
      /NO QED/.test(IMP34369_PEAK_RELOCATION_REGIME_WIDTH.verdict) &&
      /refereed bound is changed/i.test(IMP34369_PEAK_RELOCATION_REGIME_WIDTH.verdict) &&
      /imp-3066 K_a >= 0 untouched/.test(IMP34369_PEAK_RELOCATION_REGIME_WIDTH.verdict),
  },
];

for (const a of IMP34369_PEAK_RELOCATION_REGIME_WIDTH_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-34369-peak-relocation-regime-width assertion failed: ${a.id}`);
  }
}
