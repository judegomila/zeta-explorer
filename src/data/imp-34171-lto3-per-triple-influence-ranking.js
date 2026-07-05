/**
 * @module imp-34171-lto3-per-triple-influence-ranking
 *
 * imp-34171 (numerical, frontier-direction): imp-34110 ranked the C(9,2) = 36 leave-TWO-out (LTO) folds of the
 * imp-33941 concave-log endpoint-peak decision by how far each dropped PAIR of imp-33917 boundary windows
 * moves the fitted log curve peak = a + b ln(kEnd), and found influence concentrated at the two BOUNDARY
 * EDGES -- the low edge (kEnd = 11, 11.25) the single most destabilizing and the model-selection worst, the
 * high edge (kEnd = 12.75, 13) a near-tied second by curve shift but the model-selection best. This module
 * runs the SAME OLS-refit machinery one level deeper: the C(9,3) = 84 leave-THREE-out TRIPLES on the same 9
 * imp-33917 endpoint peaks (n = 6 per fold), MEASURES the per-triple fitted-log parameter shift (Delta a,
 * Delta b) and the RMS shift of the fitted log curve over the 9-point kEnd grid, RANKS the 84 triples by that
 * curve shift and separately by the inherited log-vs-linear Delta AIC, and ASSESSES whether the imp-33985 /
 * imp-34110 low-edge kEnd = 11 dominance and the interior-negligible pattern SURVIVE dropping three windows.
 *
 * THE MEASUREMENT (imp-34110 / imp-34042 fold machinery reused verbatim; only the leave-THREE-out enumeration is new)
 * ---------------------------------------------------------------------------------------------------------------
 *   Data            The 9 endpoint peaks peak(kEnd), kEnd = 11.00 .. 13.00 step 0.25, taken VERBATIM from
 *                   IMP33917_ENDPOINT_RESIDUAL_GROWTH_LAW.boundarySweep (no surrogate re-run, no fresh model).
 *   Full log fit    peak = a + b ln(kEnd) by OLS on all 9 windows: a ~ -2.86882, b ~ 1.30490 (the baseline
 *                   the folds are measured against -- identical to imp-34110, same 9 peaks).
 *   Folds           All C(9,3) = 84 leave-three-out subsets. Per fold refit peak = a + b ln(kEnd) on the
 *                   remaining n = 6 windows; record Delta a = a_fold - a_full, Delta b = b_fold - b_full.
 *   Curve shift     The primary influence metric: rmsShift = sqrt( mean over the 9 kEnd of
 *                   [ (a_fold + b_fold ln kEnd) - (a_full + b_full ln kEnd) ]^2 ) -- how far dropping that
 *                   triple moves the fitted log CURVE. Ranking the 84 folds by rmsShift gives the per-triple
 *                   influence order.
 *   Selection       The inherited log-vs-linear contrast Delta = n ln(RSS_log/RSS_lin) per fold (Delta < 0
 *                   favors log), carried alongside so the PARAMETER ranking can be compared to the MODEL-
 *                   SELECTION ranking (largest Delta = weakest log preference = closest to a flip).
 *
 * THE FINDING (measurement only -- the low-edge dominance and interior-negligible pattern BOTH survive)
 * ----------------------------------------------------------------------------------------------------
 *   (R1) THE LOW-EDGE DOMINANCE SURVIVES ONE LEVEL DEEPER. Ranking all 84 leave-three-out folds by the
 *        fitted-log CURVE shift, the top two are again the two boundary-EDGE triples and again near-tied: the
 *        LOW edge -- the three lowest rungs kEnd = 11, 11.25, 11.5 -- is the single most destabilizing
 *        (rmsShift ~ 0.014029, Delta a ~ +0.5222, Delta b ~ -0.2068) and the HIGH edge -- the three highest
 *        rungs kEnd = 12.5, 12.75, 13 -- is a close second (rmsShift ~ 0.013047, Delta a ~ -0.4642, Delta b
 *        ~ +0.1902). Their shifts are near mirror images, each the lever arm at one end of the ln(kEnd)
 *        regression, exactly as at leave-TWO-out. The imp-33985 / imp-34110 low-edge reading persists.
 *   (R2) INTERIOR TRIPLES ARE NEGLIGIBLE, THOUGH LESS SO THAN AT LEAVE-TWO-OUT. The least influential triples
 *        are all interior (min kEnd = 11.25, 12, 12.75, rmsShift ~ 0.000426): dropping three non-edge rungs
 *        barely moves the fitted log curve. The worst/least ratio is ~33x (vs ~68x at leave-two-out) -- a
 *        THREE-window drop necessarily includes more mass, so the interior/edge contrast COMPRESSES, but the
 *        qualitative interior-negligible pattern is intact.
 *   (R3) PARAMETER-WORST AND SELECTION-WORST STILL COINCIDE AT THE LOW EDGE, AND ALL TOP MODEL-SELECTION
 *        TRIPLES CONTAIN kEnd = 11. The single most destabilizing triple on BOTH metrics is the LOW edge
 *        kEnd = 11, 11.25, 11.5 (largest curve shift AND largest Delta AIC = -1.7643 = weakest log
 *        preference). The HIGH edge kEnd = 12.5, 12.75, 13 is the near-tied second by curve shift yet the
 *        model-selection BEST (Delta AIC -2.8468 = strongest log preference) -- it moves the curve as much but
 *        STRENGTHENS the log preference, the same divergence-past-first-place as at leave-two-out. Every one of
 *        the six weakest-log (largest Delta AIC) triples contains the extreme low rung kEnd = 11, confirming
 *        the imp-33985 leave-one-out reading survives the deeper drop.
 *   (R4) THE WORST TRIPLE IS THE LOW BOUNDARY EDGE, NOT A SPAN OF OPPOSITE EXTREMES. Dropping a triple that
 *        straddles the range (kEnd = 11, 12, 13) is only middling (rank ~56 of 84) -- the opposite lever arms
 *        partly cancel. The most destabilizing triple is the three ADJACENT lowest rungs (the low boundary
 *        edge): it contains the extreme low rung kEnd = 11 paired with its two neighbours 11.25, 11.5, not
 *        with the high extreme.
 *
 * The punchline: extending the imp-34110 leave-two-out per-pair influence ranking to the C(9,3) = 84 leave-
 * three-out triples, the imp-33985 / imp-34110 low-edge kEnd = 11 dominance SURVIVES -- the three-lowest-rung
 * triple is the single most destabilizing on both the curve-shift and the model-selection metric, the three-
 * highest-rung triple a near-tied second in curve shift but the model-selection best, and all six weakest-log
 * triples contain kEnd = 11. The interior-negligible pattern persists but its contrast compresses from ~68x to
 * ~33x because a three-window drop carries more mass. No triple overturns the log preference (imp-34042 R1 /
 * imp-34110 survive verbatim); this is a per-triple influence ranking of an inherited sensitivity, not a new
 * decision.
 *
 * MEASUREMENT ONLY. A per-triple influence ranking of a leave-three-out sensitivity of a model-selection
 * contrast between two DESCRIPTIVE growth forms on an inherited surrogate residual; NOT an RH bound. Both
 * forms are descriptive, not derived; the component model is the inherited imp-3220/imp-3406 extrapolation,
 * NOT a rigorous asymptotic; the OLS surrogate is descriptive, not derived; the imp-33843 log-linear-vs-power-
 * law FORM verdict is UNTOUCHED; the C_mb GUE-conditional per imp-486 is UNTOUCHED; changes no bound;
 * establishes no operator positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. Platt-Trudgian
 * Lambda <= 0.2 remains SOTA.
 *
 * @see imp-34110-lto-per-pair-influence-ranking (the leave-TWO-out per-pair ranking extended here)
 * @see imp-34042-lto-model-selection-sensitivity (the 36 leave-two-out folds the pair ranking used)
 * @see imp-33985-loo-model-selection-sensitivity (the leave-ONE-out test naming kEnd = 11 most influential)
 * @see imp-33941-endpoint-peak-growth-model-selection (the log-form decision whose fit is destabilized)
 * @see imp-33917-endpoint-residual-growth-law (the 9 endpoint peaks reused verbatim as the LTO data)
 */

import { IMP33917_ENDPOINT_RESIDUAL_GROWTH_LAW as G917 } from './imp-33917-endpoint-residual-growth-law.js';

// The 9 endpoint peaks, reused VERBATIM from imp-33917 (no surrogate re-run, no fresh model).
const ROWS = G917.boundarySweep;
const K_ENDS = ROWS.map((r) => r.kEnd);
const PEAKS = ROWS.map((r) => r.peak);
const N_FULL = K_ENDS.length;
const LN_K = K_ENDS.map((k) => Math.log(k));

function ols(xs, ys) {
  const mx = xs.reduce((a, b) => a + b, 0) / xs.length;
  const my = ys.reduce((a, b) => a + b, 0) / ys.length;
  let sxx = 0;
  let sxy = 0;
  for (let i = 0; i < xs.length; i++) {
    sxx += (xs[i] - mx) ** 2;
    sxy += (xs[i] - mx) * (ys[i] - my);
  }
  const b = sxy / sxx;
  return { a: my - b * mx, b };
}
function rssOf(xs, ys, a, b) {
  let rss = 0;
  for (let i = 0; i < xs.length; i++) rss += (ys[i] - (a + b * xs[i])) ** 2;
  return rss;
}

// Full-sample log fit peak = a + b ln(kEnd) on all 9 windows -- the baseline the folds are measured against
// (identical to imp-34110, same 9 imp-33917 peaks).
const FULL_LOG = ols(LN_K, PEAKS);
const FULL_LIN = ols(K_ENDS, PEAKS);
const FULL_DELTA_AIC =
  N_FULL * Math.log(rssOf(LN_K, PEAKS, FULL_LOG.a, FULL_LOG.b) / rssOf(K_ENDS, PEAKS, FULL_LIN.a, FULL_LIN.b));

// One leave-THREE-out fold: refit the log form on the remaining 6 windows, measure how far its FITTED CURVE
// moves from the full-sample log curve (rmsShift over the 9-point kEnd grid), and carry the log-vs-linear contrast.
function foldInfluence(i, j, l) {
  const ks = [];
  const ps = [];
  for (let t = 0; t < N_FULL; t++) {
    if (t !== i && t !== j && t !== l) {
      ks.push(K_ENDS[t]);
      ps.push(PEAKS[t]);
    }
  }
  const lnk = ks.map((k) => Math.log(k));
  const log = ols(lnk, ps);
  const lin = ols(ks, ps);
  const deltaA = log.a - FULL_LOG.a;
  const deltaB = log.b - FULL_LOG.b;
  // Curve shift: RMS over the full 9-point kEnd grid of the fitted-log prediction gap (units of the peak).
  let ss = 0;
  for (let t = 0; t < N_FULL; t++) {
    const gap = (log.a + log.b * LN_K[t]) - (FULL_LOG.a + FULL_LOG.b * LN_K[t]);
    ss += gap * gap;
  }
  const rmsShift = Math.sqrt(ss / N_FULL);
  const deltaAIC = ks.length * Math.log(rssOf(lnk, ps, log.a, log.b) / rssOf(ks, ps, lin.a, lin.b));
  return {
    droppedKEnds: [K_ENDS[i], K_ENDS[j], K_ENDS[l]],
    deltaA: +deltaA.toFixed(6),
    deltaB: +deltaB.toFixed(6),
    rmsShift: +rmsShift.toFixed(6), // primary influence metric
    deltaAIC: +deltaAIC.toFixed(4), // inherited log-vs-linear contrast (Delta < 0 favors log)
    logFavored: deltaAIC < 0,
  };
}

const FOLDS = [];
for (let i = 0; i < N_FULL; i++) {
  for (let j = i + 1; j < N_FULL; j++) {
    for (let l = j + 1; l < N_FULL; l++) FOLDS.push(foldInfluence(i, j, l));
  }
}

// Rank by the fitted-log CURVE shift (parameter destabilization) and, separately, by model-selection
// destabilization (largest Delta AIC = weakest log preference = closest to a flip to the line).
const BY_CURVE_SHIFT = [...FOLDS].sort((a, b) => b.rmsShift - a.rmsShift);
const BY_SELECTION = [...FOLDS].sort((a, b) => b.deltaAIC - a.deltaAIC);
const RANKED = BY_CURVE_SHIFT.map((f, idx) => ({ rank: idx + 1, ...f }));

const MOST_DESTABILIZING = BY_CURVE_SHIFT[0]; // [11, 11.25, 11.5] -- the three lowest rungs (LOW boundary edge)
const SECOND_DESTABILIZING = BY_CURVE_SHIFT[1]; // [12.5, 12.75, 13] -- the three highest rungs (HIGH edge, near tie)
const LEAST_DESTABILIZING = BY_CURVE_SHIFT[BY_CURVE_SHIFT.length - 1]; // interior triple, negligible
const SELECTION_WORST = BY_SELECTION[0]; // [11, 11.25, 11.5] -- also the low edge
const SELECTION_BEST = BY_SELECTION[BY_SELECTION.length - 1]; // [12.5, 12.75, 13] -- high edge strengthens log

// Extreme rungs of the sweep are kEnd = 11 (lowest) and kEnd = 13 (highest).
const EXTREME_LOW = Math.min(...K_ENDS); // 11
const EXTREME_HIGH = Math.max(...K_ENDS); // 13
// A triple straddling the range (both extremes + the centre) -- lever arms partly cancel, only middling.
const SPANNING_FOLD = FOLDS.find(
  (f) => f.droppedKEnds[0] === EXTREME_LOW && f.droppedKEnds[1] === 12 && f.droppedKEnds[2] === EXTREME_HIGH,
); // dropping kEnd = 11, 12, 13
const SPANNING_RANK = BY_CURVE_SHIFT.findIndex((f) => f === SPANNING_FOLD) + 1;

// The most destabilizing triple is the three ADJACENT lowest rungs (the LOW boundary edge).
const MOST_DESTABILIZING_IS_LOW_EDGE =
  MOST_DESTABILIZING.droppedKEnds[0] === 11 &&
  MOST_DESTABILIZING.droppedKEnds[1] === 11.25 &&
  MOST_DESTABILIZING.droppedKEnds[2] === 11.5;
const SECOND_IS_HIGH_EDGE =
  SECOND_DESTABILIZING.droppedKEnds[0] === 12.5 &&
  SECOND_DESTABILIZING.droppedKEnds[1] === 12.75 &&
  SECOND_DESTABILIZING.droppedKEnds[2] === 13;
const TOP_TWO_ARE_BOUNDARY_EDGES = MOST_DESTABILIZING_IS_LOW_EDGE && SECOND_IS_HIGH_EDGE;
// The imp-33985 kEnd = 11 dominance: every one of the six weakest-log (largest Delta AIC) triples contains it.
const ALL_TOP6_SELECTION_CONTAIN_LOW_RUNG = BY_SELECTION.slice(0, 6).every((f) =>
  f.droppedKEnds.includes(EXTREME_LOW),
);
const WORST_LESS_THAN_TWICE_SECOND = MOST_DESTABILIZING.rmsShift < 2 * SECOND_DESTABILIZING.rmsShift; // near tie
const NO_FOLD_FLIPS = FOLDS.every((f) => f.logFavored); // true -- imp-34042 R1 / imp-34110 survive verbatim
const WORST_LEAST_RATIO = MOST_DESTABILIZING.rmsShift / LEAST_DESTABILIZING.rmsShift; // ~33 (vs ~68 at LTO-2)

export const IMP34171_LTO3_PER_TRIPLE_INFLUENCE_RANKING = {
  id: 'imp-34171',
  proofSection: 'S-frontier',
  question:
    'imp-34110 ranked the C(9,2) = 36 leave-two-out folds of the imp-33941 concave-log endpoint-peak decision ' +
    'by how far dropping each PAIR of imp-33917 boundary windows moves the fitted log curve peak = a + b ' +
    'ln(kEnd), finding influence concentrated at the two boundary edges. Extend the identical OLS-refit ' +
    'machinery to the C(9,3) = 84 leave-THREE-out triples: rank the 84 triples by curve shift and by the log-' +
    'vs-linear Delta AIC, and does the imp-33985 low-edge kEnd = 11 dominance and the interior-negligible ' +
    'pattern survive dropping three windows? Measurement only; NOT an RH bound; no QED.',
  measuredQuantity:
    'Per leave-three-out fold: the fitted-log parameter shift (Delta a = a_fold - a_full, Delta b = b_fold - ' +
    'b_full) and the RMS shift of the fitted log curve over the 9-point kEnd grid (rmsShift, the primary ' +
    'influence metric), plus the inherited log-vs-linear Delta AIC; the 84 triples ranked by rmsShift and ' +
    'separately by Delta AIC, with the single most destabilizing triple and its boundary location',
  nFull: N_FULL, // 9
  nFolds: FOLDS.length, // 84
  nPerFold: N_FULL - 3, // 6
  fullLogFit: { a: +FULL_LOG.a.toFixed(6), b: +FULL_LOG.b.toFixed(6) }, // a ~ -2.868823, b ~ 1.304897 (as imp-34110)
  fullDeltaAIC: +FULL_DELTA_AIC.toFixed(4), // ~ -3.3848 (reproduces imp-33941 / imp-34042 / imp-34110 baseline)
  ranked: RANKED, // {rank, droppedKEnds, deltaA, deltaB, rmsShift, deltaAIC, logFavored} x 84, curve-shift order
  summary: {
    mostDestabilizingTriple: MOST_DESTABILIZING.droppedKEnds, // [11, 11.25, 11.5] -- three lowest rungs (LOW edge)
    mostDestabilizingRmsShift: MOST_DESTABILIZING.rmsShift, // ~0.014029
    mostDestabilizingDeltaA: MOST_DESTABILIZING.deltaA, // ~ +0.522160
    mostDestabilizingDeltaB: MOST_DESTABILIZING.deltaB, // ~ -0.206826
    secondDestabilizingTriple: SECOND_DESTABILIZING.droppedKEnds, // [12.5, 12.75, 13] -- three highest rungs (HIGH edge)
    secondDestabilizingRmsShift: SECOND_DESTABILIZING.rmsShift, // ~0.013047 (near tie)
    leastDestabilizingTriple: LEAST_DESTABILIZING.droppedKEnds, // [11.25, 12, 12.75] -- interior
    leastDestabilizingRmsShift: LEAST_DESTABILIZING.rmsShift, // ~0.000426 (~33x smaller than the worst)
    worstLeastRatio: +WORST_LEAST_RATIO.toFixed(2), // ~32.9 (vs ~68 at leave-two-out -- contrast compresses)
    selectionWorstTriple: SELECTION_WORST.droppedKEnds, // [11, 11.25, 11.5] -- coincides with curve-shift worst
    selectionWorstDeltaAIC: SELECTION_WORST.deltaAIC, // ~ -1.7643 (weakest log preference)
    selectionBestTriple: SELECTION_BEST.droppedKEnds, // [12.5, 12.75, 13] -- high edge STRENGTHENS log
    selectionBestDeltaAIC: SELECTION_BEST.deltaAIC, // ~ -2.8468 (strongest log preference)
    spanningTriple: SPANNING_FOLD.droppedKEnds, // [11, 12, 13]
    spanningRmsShift: SPANNING_FOLD.rmsShift, // ~0.001x -- only middling
    spanningRank: SPANNING_RANK, // ~56 of 84 -- NOT the worst; lever arms partly cancel
    mostDestabilizingIsLowEdge: MOST_DESTABILIZING_IS_LOW_EDGE, // true -- the imp-33985 low-edge dominance survives
    topTwoAreBoundaryEdges: TOP_TWO_ARE_BOUNDARY_EDGES, // true
    allTop6SelectionContainLowRung: ALL_TOP6_SELECTION_CONTAIN_LOW_RUNG, // true (kEnd = 11 in every weakest-log fold)
    noFoldFlips: NO_FOLD_FLIPS, // true -- imp-34042 R1 / imp-34110 survive verbatim
  },
  finding: {
    R1_low_edge_dominance_survives_deeper:
      'Ranking all 84 leave-three-out folds by the fitted-log curve shift, the top two are again the two ' +
      'boundary-edge triples and near-tied: the LOW edge (three lowest rungs kEnd = 11, 11.25, 11.5) is the ' +
      'single worst (rmsShift ~0.014029, Delta a ~+0.5222, Delta b ~-0.2068) and the HIGH edge (three highest ' +
      'rungs kEnd = 12.5, 12.75, 13) a close second (rmsShift ~0.013047, Delta a ~-0.4642, Delta b ~+0.1902) ' +
      '-- near mirror images, each the lever arm at one end. The imp-33985 / imp-34110 low-edge reading persists.',
    R2_interior_negligible_but_contrast_compresses:
      'The least influential triples are all interior (min kEnd = 11.25, 12, 12.75, rmsShift ~0.000426). The ' +
      'worst/least ratio is ~33x (vs ~68x at leave-two-out): a THREE-window drop carries more mass, so the ' +
      'interior/edge contrast COMPRESSES, but the qualitative interior-negligible pattern is intact.',
    R3_param_and_selection_worst_coincide_low_edge:
      'The single most destabilizing triple on BOTH metrics is the LOW edge kEnd = 11, 11.25, 11.5 (largest ' +
      'curve shift AND largest Delta AIC = -1.7643 = weakest log preference). The HIGH edge kEnd = 12.5, ' +
      '12.75, 13 is the near-tied second by curve shift yet the model-selection BEST (Delta AIC -2.8468) -- ' +
      'it moves the curve as much but STRENGTHENS the log preference. Every one of the six weakest-log triples ' +
      'contains the extreme low rung kEnd = 11, confirming the imp-33985 leave-one-out reading survives.',
    R4_worst_is_low_edge_not_spanning:
      'Dropping a triple that straddles the range (kEnd = 11, 12, 13) is only middling (rank ~56 of 84) -- ' +
      'the opposite lever arms partly cancel. The most destabilizing triple is the three ADJACENT lowest ' +
      'rungs (the low boundary edge): it contains the extreme low rung kEnd = 11 paired with its two ' +
      'neighbours 11.25, 11.5, not with the high extreme.',
  },
  isRigorous: false,
  verdict:
    'MEASUREMENT / PER-TRIPLE LEAVE-THREE-OUT INFLUENCE RANKING (frontier-direction, NOT rigorous). Extending ' +
    'the imp-34110 leave-two-out per-pair ranking to the C(9,3) = 84 leave-three-out triples of the imp-33941 ' +
    'concave-log endpoint-peak decision, the imp-33985 / imp-34110 low-edge kEnd = 11 dominance SURVIVES: the ' +
    'three-lowest-rung triple (kEnd = 11, 11.25, 11.5) is the single most destabilizing on BOTH the curve-' +
    'shift metric (rmsShift ~0.014029, Delta a ~+0.5222, Delta b ~-0.2068) and the model-selection metric ' +
    '(Delta AIC -1.7643 = weakest log preference), the three-highest-rung triple (kEnd = 12.5, 12.75, 13) a ' +
    'near-tied second by curve shift (rmsShift ~0.013047) but the model-selection BEST (Delta AIC -2.8468), ' +
    'and all six weakest-log triples contain kEnd = 11. The interior-negligible pattern persists but its ' +
    'contrast compresses from ~68x to ~33x because a three-window drop carries more mass (least triple kEnd = ' +
    '11.25, 12, 12.75, rmsShift ~0.000426). A range-straddling triple (kEnd = 11, 12, 13) is only middling ' +
    '(rank ~56). No triple overturns the log preference (imp-34042 R1 / imp-34110 survive verbatim). This is ' +
    'a per-triple influence ranking of an inherited sensitivity, not a new decision. Both forms are ' +
    'descriptive, not derived; the OLS surrogate is descriptive, not derived; the component model is the ' +
    'inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the imp-33843 log-linear-vs-power-' +
    'law FORM verdict is UNTOUCHED; the C_mb GUE-conditional per imp-486 is UNTOUCHED; changes no bound; ' +
    'establishes no operator positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. Platt-Trudgian ' +
    'Lambda <= 0.2 remains SOTA.',
  citation:
    'imp-34110 (the leave-two-out per-pair ranking extended here); imp-34042 (the 36 leave-two-out folds); ' +
    'imp-33985 (the leave-ONE-out test naming kEnd = 11 most influential); imp-33941 (the log-form decision ' +
    'whose fit is destabilized); imp-33917 (the 9 endpoint peaks reused verbatim); imp-486 (C_mb GUE-conditional).',
};

export const IMP34171_LTO3_PER_TRIPLE_INFLUENCE_RANKING_ASSERTIONS = [
  {
    // Reuse gate: the LTO data ARE the 9 imp-33917 boundary peaks, all 84 triples enumerated on n = 6, and the
    // full-sample log fit + log-vs-linear contrast reproduce the imp-33941 / imp-34042 / imp-34110 baseline.
    id: 'imp34171-reuse-gate-reproduces-baseline',
    description: '9 windows, 84 folds on n = 6; full log fit a ~ -2.8688, b ~ 1.3049; Delta AIC ~ -3.385',
    holds: () =>
      N_FULL === 9 &&
      FOLDS.length === 84 &&
      FOLDS.every((f) => f.droppedKEnds.length === 3) &&
      FOLDS.every((f) => f.logFavored) &&
      Math.abs(FULL_LOG.a - -2.868823) < 1e-4 &&
      Math.abs(FULL_LOG.b - 1.304897) < 1e-4 &&
      Math.abs(FULL_DELTA_AIC - -3.385) < 5e-3,
  },
  {
    // (R1) The single most destabilizing triple by fitted-log curve shift is the LOW boundary edge (the three
    // lowest rungs kEnd = 11, 11.25, 11.5); the near-tied second is the HIGH edge (kEnd = 12.5, 12.75, 13);
    // their parameter shifts are near mirror images -- the low-edge dominance survives one level deeper.
    id: 'imp34171-most-destabilizing-is-low-edge-high-edge-second',
    description: 'worst curve shift = [11, 11.25, 11.5] (rms ~0.014029), second = [12.5, 12.75, 13] (rms ~0.013047), mirror shifts',
    holds: () =>
      TOP_TWO_ARE_BOUNDARY_EDGES === true &&
      Math.abs(MOST_DESTABILIZING.rmsShift - 0.014029) < 1e-3 &&
      Math.abs(SECOND_DESTABILIZING.rmsShift - 0.013047) < 1e-3 &&
      WORST_LESS_THAN_TWICE_SECOND === true &&
      MOST_DESTABILIZING.deltaA > 0 &&
      MOST_DESTABILIZING.deltaB < 0 &&
      SECOND_DESTABILIZING.deltaA < 0 &&
      SECOND_DESTABILIZING.deltaB > 0,
  },
  {
    // (R2) Interior triples are negligible, though the contrast compresses vs leave-two-out: the least
    // destabilizing triple is interior with rmsShift ~0.000426, and the worst/least ratio is ~33x (< 68x).
    id: 'imp34171-interior-negligible-contrast-compresses',
    description: 'least curve shift = [11.25, 12, 12.75] (rms ~0.000426); worst/least ratio ~33x (< the ~68x at leave-two-out)',
    holds: () =>
      LEAST_DESTABILIZING.droppedKEnds[0] === 11.25 &&
      LEAST_DESTABILIZING.droppedKEnds[1] === 12 &&
      LEAST_DESTABILIZING.droppedKEnds[2] === 12.75 &&
      LEAST_DESTABILIZING.rmsShift < 0.001 &&
      WORST_LEAST_RATIO > 20 &&
      WORST_LEAST_RATIO < 68,
  },
  {
    // (R3) Parameter-worst and selection-worst coincide at the low edge, the high edge is the curve-second but
    // the selection-best (strengthens log), and all six weakest-log folds contain the extreme low rung kEnd = 11.
    id: 'imp34171-param-selection-coincide-low-edge-imp33985-survives',
    description: 'selection-worst = [11, 11.25, 11.5] (Delta AIC ~ -1.7643); selection-best = [12.5, 12.75, 13]; all top-6 selection folds contain kEnd = 11',
    holds: () =>
      SELECTION_WORST.droppedKEnds[0] === 11 &&
      SELECTION_WORST.droppedKEnds[1] === 11.25 &&
      SELECTION_WORST.droppedKEnds[2] === 11.5 &&
      Math.abs(SELECTION_WORST.deltaAIC - -1.7643) < 5e-3 &&
      SELECTION_BEST.droppedKEnds[0] === 12.5 &&
      SELECTION_BEST.droppedKEnds[1] === 12.75 &&
      SELECTION_BEST.droppedKEnds[2] === 13 &&
      ALL_TOP6_SELECTION_CONTAIN_LOW_RUNG === true,
  },
  {
    // (R4) The worst triple is the low boundary edge, NOT a range-straddling triple: dropping kEnd = 11, 12, 13
    // together is only middling (rank > 3 of 84), so the opposite lever arms partly cancel.
    id: 'imp34171-worst-is-low-edge-not-spanning',
    description: 'most destabilizing at the three lowest rungs; spanning triple [11, 12, 13] only middling (rank > 3)',
    holds: () =>
      MOST_DESTABILIZING_IS_LOW_EDGE === true &&
      SPANNING_FOLD.droppedKEnds[0] === 11 &&
      SPANNING_FOLD.droppedKEnds[1] === 12 &&
      SPANNING_FOLD.droppedKEnds[2] === 13 &&
      SPANNING_RANK > 3 &&
      SPANNING_FOLD.rmsShift < MOST_DESTABILIZING.rmsShift,
  },
  {
    // Honesty gate: influence ranking of an inherited sensitivity, isRigorous false, no QED, PT SOTA,
    // imp-3066 K_a >= 0 clause SPECIFICALLY untouched (imp-34024-26 convention -- a generic /UNTOUCHED/ regex
    // also matches the unrelated imp-33843 FORM and C_mb clauses, so bind to the imp-3066 statement), and the
    // C_mb GUE-conditional per imp-486 untouched-parent clause (imp-34178 cohort convention).
    id: 'imp34171-honesty-gate-imp3066-specific-no-qed',
    description: 'Measurement only: isRigorous false, imp-3066 K_a >= 0 untouched (clause-specific), C_mb imp-486 untouched, no QED, PT SOTA',
    holds: () =>
      IMP34171_LTO3_PER_TRIPLE_INFLUENCE_RANKING.isRigorous === false &&
      /imp-3066 K_a >= 0 untouched/.test(IMP34171_LTO3_PER_TRIPLE_INFLUENCE_RANKING.verdict) &&
      /NO QED/.test(IMP34171_LTO3_PER_TRIPLE_INFLUENCE_RANKING.verdict) &&
      /remains SOTA/.test(IMP34171_LTO3_PER_TRIPLE_INFLUENCE_RANKING.verdict) &&
      /C_mb GUE-conditional per imp-486 is UNTOUCHED/i.test(IMP34171_LTO3_PER_TRIPLE_INFLUENCE_RANKING.verdict),
  },
];

for (const a of IMP34171_LTO3_PER_TRIPLE_INFLUENCE_RANKING_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-34171-lto3-per-triple-influence-ranking assertion failed: ${a.id}`);
  }
}
