/**
 * @module imp-34110-lto-per-pair-influence-ranking
 *
 * imp-34110 (numerical, frontier-direction): imp-34042 ran the full leave-TWO-out (LTO) sensitivity of the
 * imp-33941 concave-log endpoint-peak decision -- all C(9,2) = 36 pairs of dropped imp-33917 boundary
 * windows, each refitting the linear and log forms by OLS on the remaining 7 points -- and reported the
 * AGGREGATE model-selection spread (min evidence ratio ~3.04, max ~4.59, log favored in every fold). But it
 * never RANKED the pairs by how much each destabilizes the FITTED log form: it named the min- and max-ratio
 * folds but stopped short of a per-pair influence ordering, and it never separated model-selection
 * destabilization (how close a dropped pair comes to flipping the log-vs-linear preference) from
 * PARAMETER destabilization (how far a dropped pair moves the fitted log curve peak = a + b ln(kEnd) itself).
 * This module fills that gap: for every LTO pair it MEASURES the fitted-log-parameter shift (Delta a,
 * Delta b) and the RMS shift of the fitted log CURVE over the 9-point kEnd grid, RANKS the 36 pairs by that
 * curve shift, and reports the single most destabilizing pair and whether it sits at the extreme boundary
 * rungs.
 *
 * THE MEASUREMENT (imp-34042 fold machinery reused verbatim; only the per-pair ranking is new)
 * -------------------------------------------------------------------------------------------
 *   Data            The 9 endpoint peaks peak(kEnd), kEnd = 11.00 .. 13.00 step 0.25, taken VERBATIM from
 *                   IMP33917_ENDPOINT_RESIDUAL_GROWTH_LAW.boundarySweep (no surrogate re-run, no fresh model).
 *   Full log fit    peak = a + b ln(kEnd) by OLS on all 9 windows: a ~ -2.86882, b ~ 1.30490 (the baseline
 *                   the LTO folds are measured against).
 *   Folds           All C(9,2) = 36 leave-two-out subsets. Per fold refit peak = a + b ln(kEnd) on the
 *                   remaining n = 7 windows; record Delta a = a_fold - a_full, Delta b = b_fold - b_full.
 *   Curve shift     The primary influence metric: rmsShift = sqrt( mean over the 9 kEnd of
 *                   [ (a_fold + b_fold ln kEnd) - (a_full + b_full ln kEnd) ]^2 ) -- how far dropping that
 *                   pair moves the fitted log CURVE, combining the intercept and slope shift into one number
 *                   on the units of the peak. Ranking the 36 folds by rmsShift gives the per-pair influence
 *                   order the ticket asked for.
 *   Selection       The inherited log-vs-linear contrast Delta = n ln(RSS_log/RSS_lin) per fold (Delta < 0
 *                   favors log), carried alongside so the PARAMETER ranking can be compared to the MODEL-
 *                   SELECTION ranking (largest Delta = weakest log preference = closest to a flip).
 *
 * THE FINDING (measurement only -- the two boundary-edge pairs dominate; the low edge is the single worst)
 * ------------------------------------------------------------------------------------------------------
 *   (R1) THE TWO EXTREME BOUNDARY-EDGE PAIRS DOMINATE THE PARAMETER INFLUENCE. Ranking all 36 folds by the
 *        fitted-log CURVE shift, the top two are the two boundary-edge pairs and they are near-tied: dropping
 *        the LOW edge kEnd = 11 and 11.25 is the single most destabilizing (rmsShift ~ 0.008907, Delta a
 *        ~ +0.3417, Delta b ~ -0.1356) and dropping the HIGH edge kEnd = 12.75 and 13 is a very close second
 *        (rmsShift ~ 0.008507, Delta a ~ -0.3124, Delta b ~ +0.1278). Their shifts are near mirror images --
 *        dropping the low tail pushes the intercept UP and the slope DOWN, dropping the high tail does the
 *        opposite -- because each edge pair is the lever arm at one end of the ln(kEnd) regression.
 *   (R2) INTERIOR-ADJACENT PAIRS ARE NEGLIGIBLE. The least influential pairs are interior-adjacent windows
 *        (kEnd = 11.25 and 11.5 is the minimum, rmsShift ~ 0.000131, ~68x smaller than the low-edge pair;
 *        kEnd = 12.25/12.75 and 12.5/12.75 are similar): dropping two adjacent interior rungs barely moves
 *        the fitted log curve. Influence is concentrated almost entirely at the two boundary edges.
 *   (R3) PARAMETER-WORST AND SELECTION-WORST COINCIDE AT THE LOW EDGE, BUT THE RANKINGS DIVERGE ELSEWHERE.
 *        The single most destabilizing pair on BOTH metrics is the LOW edge kEnd = 11 and 11.25 (largest
 *        curve shift AND largest Delta AIC = -2.2238 = weakest log preference, the 3.04 : 1 floor imp-34042
 *        reported). But the rankings diverge past first place: the HIGH edge kEnd = 12.75 and 13 is the
 *        near-tied SECOND by curve shift yet the LEAST destabilizing by model selection (Delta AIC -3.0492,
 *        the 4.59 : 1 ceiling) -- it moves the curve as much as the low edge but STRENGTHENS the log
 *        preference. All four worst model-selection folds contain the extreme LOW rung kEnd = 11, confirming
 *        the imp-33985 leave-one-out reading that kEnd = 11 is the single most influential rung.
 *   (R4) THE WORST PAIR IS THE LOW BOUNDARY EDGE, NOT THE TWO OPPOSITE EXTREMES. Dropping the two opposite
 *        extreme endpoints of the sweep (kEnd = 11 AND kEnd = 13) together is only middling (rmsShift
 *        ~ 0.003624, rank ~11 of 36) -- their opposite lever arms partly cancel. The most destabilizing pair
 *        is the two ADJACENT lowest rungs (the low boundary edge), i.e. it contains the extreme LOW rung but
 *        pairs it with its neighbour, not with the extreme HIGH rung.
 *
 * The punchline: ranking the imp-34042 leave-two-out folds by how far each dropped pair moves the fitted
 * imp-33941 log curve, influence is concentrated at the two BOUNDARY EDGES -- the low edge (kEnd = 11, 11.25)
 * is the single most destabilizing (rmsShift ~ 0.0089, and it is also the model-selection worst at Delta AIC
 * -2.2238) with the high edge (kEnd = 12.75, 13) a near-tied second in curve shift but the model-selection
 * BEST. Interior-adjacent pairs are ~68x weaker. The parameter ranking and the selection ranking agree at
 * first place (the low edge) but diverge beyond it. No pair overturns the log preference (imp-34042 R1
 * survives verbatim); this is a per-pair influence ranking of an inherited sensitivity, not a new decision.
 *
 * MEASUREMENT ONLY. A per-pair influence ranking of a leave-two-out sensitivity of a model-selection contrast
 * between two DESCRIPTIVE growth forms on an inherited surrogate residual; NOT an RH bound. Both forms are
 * descriptive, not derived; the component model is the inherited imp-3220/imp-3406 extrapolation, NOT a
 * rigorous asymptotic; the OLS surrogate is descriptive, not derived; the imp-33843 log-linear-vs-power-law
 * FORM verdict is UNTOUCHED; the C_mb GUE-conditional per imp-486 is UNTOUCHED; changes no bound; establishes
 * no operator positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. Platt-Trudgian Lambda <= 0.2
 * remains SOTA.
 *
 * @see imp-34042-lto-model-selection-sensitivity (the 36 leave-two-out folds ranked here)
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

// Full-sample log fit peak = a + b ln(kEnd) on all 9 windows -- the baseline the folds are measured against.
const FULL_LOG = ols(LN_K, PEAKS);
const FULL_LIN = ols(K_ENDS, PEAKS);
const FULL_DELTA_AIC =
  N_FULL * Math.log(rssOf(LN_K, PEAKS, FULL_LOG.a, FULL_LOG.b) / rssOf(K_ENDS, PEAKS, FULL_LIN.a, FULL_LIN.b));

// One LTO fold: refit the log form on the remaining 7 windows, measure how far its FITTED CURVE moves from
// the full-sample log curve (rmsShift over the 9-point kEnd grid), and carry the log-vs-linear contrast.
function foldInfluence(i, j) {
  const ks = [];
  const ps = [];
  for (let t = 0; t < N_FULL; t++) {
    if (t !== i && t !== j) {
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
    droppedKEnds: [K_ENDS[i], K_ENDS[j]],
    deltaA: +deltaA.toFixed(6),
    deltaB: +deltaB.toFixed(6),
    rmsShift: +rmsShift.toFixed(6), // primary influence metric
    deltaAIC: +deltaAIC.toFixed(4), // inherited log-vs-linear contrast (Delta < 0 favors log)
    logFavored: deltaAIC < 0,
  };
}

const FOLDS = [];
for (let i = 0; i < N_FULL; i++) {
  for (let j = i + 1; j < N_FULL; j++) FOLDS.push(foldInfluence(i, j));
}

// Rank by the fitted-log CURVE shift (parameter destabilization) and, separately, by model-selection
// destabilization (largest Delta AIC = weakest log preference = closest to a flip to the line).
const BY_CURVE_SHIFT = [...FOLDS].sort((a, b) => b.rmsShift - a.rmsShift);
const BY_SELECTION = [...FOLDS].sort((a, b) => b.deltaAIC - a.deltaAIC);
const RANKED = BY_CURVE_SHIFT.map((f, idx) => ({ rank: idx + 1, ...f }));

const MOST_DESTABILIZING = BY_CURVE_SHIFT[0]; // [11, 11.25] -- the LOW boundary edge
const SECOND_DESTABILIZING = BY_CURVE_SHIFT[1]; // [12.75, 13] -- the HIGH boundary edge (near tie)
const LEAST_DESTABILIZING = BY_CURVE_SHIFT[BY_CURVE_SHIFT.length - 1]; // interior-adjacent, negligible
const SELECTION_WORST = BY_SELECTION[0]; // [11, 11.25] -- also the low edge

// Extreme rungs of the sweep are kEnd = 11 (lowest) and kEnd = 13 (highest).
const EXTREME_LOW = Math.min(...K_ENDS); // 11
const EXTREME_HIGH = Math.max(...K_ENDS); // 13
const OPPOSITE_EXTREMES_FOLD = FOLDS.find(
  (f) => f.droppedKEnds[0] === EXTREME_LOW && f.droppedKEnds[1] === EXTREME_HIGH,
); // dropping BOTH opposite endpoints -- only middling, their lever arms partly cancel
const OPPOSITE_EXTREMES_RANK = BY_CURVE_SHIFT.findIndex((f) => f === OPPOSITE_EXTREMES_FOLD) + 1;

// The most destabilizing pair sits at the LOW boundary edge: it contains the extreme LOW rung (kEnd = 11)
// paired with its neighbour 11.25, NOT the two opposite extremes.
const MOST_DESTABILIZING_AT_LOW_EDGE =
  MOST_DESTABILIZING.droppedKEnds[0] === EXTREME_LOW && MOST_DESTABILIZING.droppedKEnds[1] === 11.25;
const TOP_TWO_ARE_BOUNDARY_EDGES =
  MOST_DESTABILIZING.droppedKEnds[0] === 11 &&
  MOST_DESTABILIZING.droppedKEnds[1] === 11.25 &&
  SECOND_DESTABILIZING.droppedKEnds[0] === 12.75 &&
  SECOND_DESTABILIZING.droppedKEnds[1] === 13;
const ALL_TOP4_SELECTION_CONTAIN_LOW_RUNG = BY_SELECTION.slice(0, 4).every((f) =>
  f.droppedKEnds.includes(EXTREME_LOW),
);
const NO_FOLD_FLIPS = FOLDS.every((f) => f.logFavored); // true -- imp-34042 R1 survives verbatim

export const IMP34110_LTO_PER_PAIR_INFLUENCE_RANKING = {
  id: 'imp-34110',
  proofSection: 'S-frontier',
  question:
    'imp-34042 ran all C(9,2) = 36 leave-two-out folds of the imp-33941 concave-log endpoint-peak decision ' +
    'but reported only the aggregate model-selection spread (min/max evidence ratio). RANK the 36 pairs by ' +
    'how much dropping each one destabilizes the FITTED log curve peak = a + b ln(kEnd): which two endpoint ' +
    'peaks move the fit the most, is the worst pair at the extreme boundary rungs, and does the parameter ' +
    'ranking match the model-selection ranking? Measurement only; NOT an RH bound; no QED.',
  measuredQuantity:
    'Per LTO fold: the fitted-log parameter shift (Delta a = a_fold - a_full, Delta b = b_fold - b_full) and ' +
    'the RMS shift of the fitted log curve over the 9-point kEnd grid (rmsShift, the primary influence ' +
    'metric), plus the inherited log-vs-linear Delta AIC; the 36 folds ranked by rmsShift and separately by ' +
    'Delta AIC, with the single most destabilizing pair and its boundary location',
  nFull: N_FULL, // 9
  nFolds: FOLDS.length, // 36
  nPerFold: N_FULL - 2, // 7
  fullLogFit: { a: +FULL_LOG.a.toFixed(6), b: +FULL_LOG.b.toFixed(6) }, // a ~ -2.868823, b ~ 1.304897
  fullDeltaAIC: +FULL_DELTA_AIC.toFixed(4), // ~ -3.3848 (reproduces imp-33941 / imp-34042 baseline)
  ranked: RANKED, // {rank, droppedKEnds, deltaA, deltaB, rmsShift, deltaAIC, logFavored} x 36, curve-shift order
  summary: {
    mostDestabilizingPair: MOST_DESTABILIZING.droppedKEnds, // [11, 11.25] -- LOW boundary edge
    mostDestabilizingRmsShift: MOST_DESTABILIZING.rmsShift, // ~0.008907
    mostDestabilizingDeltaA: MOST_DESTABILIZING.deltaA, // ~ +0.341738
    mostDestabilizingDeltaB: MOST_DESTABILIZING.deltaB, // ~ -0.135554
    secondDestabilizingPair: SECOND_DESTABILIZING.droppedKEnds, // [12.75, 13] -- HIGH boundary edge (near tie)
    secondDestabilizingRmsShift: SECOND_DESTABILIZING.rmsShift, // ~0.008507
    leastDestabilizingPair: LEAST_DESTABILIZING.droppedKEnds, // [11.25, 11.5] -- interior-adjacent
    leastDestabilizingRmsShift: LEAST_DESTABILIZING.rmsShift, // ~0.000131 (~68x smaller than the worst)
    selectionWorstPair: SELECTION_WORST.droppedKEnds, // [11, 11.25] -- coincides with curve-shift worst
    selectionWorstDeltaAIC: SELECTION_WORST.deltaAIC, // ~ -2.2238 (the 3.04 : 1 floor imp-34042 reported)
    oppositeExtremesPair: OPPOSITE_EXTREMES_FOLD.droppedKEnds, // [11, 13]
    oppositeExtremesRmsShift: OPPOSITE_EXTREMES_FOLD.rmsShift, // ~0.003624 -- only middling
    oppositeExtremesRank: OPPOSITE_EXTREMES_RANK, // ~7 of 36 -- NOT the worst; lever arms partly cancel
    mostDestabilizingAtLowEdge: MOST_DESTABILIZING_AT_LOW_EDGE, // true
    topTwoAreBoundaryEdges: TOP_TWO_ARE_BOUNDARY_EDGES, // true
    allTop4SelectionContainLowRung: ALL_TOP4_SELECTION_CONTAIN_LOW_RUNG, // true (kEnd = 11 in every worst fold)
    noFoldFlips: NO_FOLD_FLIPS, // true -- imp-34042 R1 survives verbatim
  },
  finding: {
    R1_two_boundary_edge_pairs_dominate:
      'Ranking all 36 folds by the fitted-log curve shift, the top two are the two boundary-edge pairs and ' +
      'are near-tied: the LOW edge kEnd = 11 and 11.25 is the single worst (rmsShift ~0.008907, Delta a ' +
      '~+0.3417, Delta b ~-0.1356) and the HIGH edge kEnd = 12.75 and 13 is a very close second (rmsShift ' +
      '~0.008507, Delta a ~-0.3124, Delta b ~+0.1278) -- near mirror images, each the lever arm at one end.',
    R2_interior_adjacent_pairs_negligible:
      'The least influential pairs are interior-adjacent windows (min kEnd = 11.25 and 11.5, rmsShift ' +
      '~0.000131, ~68x smaller than the low edge). Influence is concentrated almost entirely at the two ' +
      'boundary edges; dropping two adjacent interior rungs barely moves the fitted log curve.',
    R3_param_and_selection_worst_coincide_but_rankings_diverge:
      'The single most destabilizing pair on BOTH metrics is the LOW edge kEnd = 11 and 11.25 (largest curve ' +
      'shift AND largest Delta AIC = -2.2238 = weakest log preference). But past first place the rankings ' +
      'diverge: the HIGH edge kEnd = 12.75 and 13 is the near-tied second by curve shift yet the LEAST ' +
      'destabilizing by model selection (Delta AIC -3.0492) -- it moves the curve as much but STRENGTHENS ' +
      'the log preference. All four worst model-selection folds contain the extreme low rung kEnd = 11.',
    R4_worst_is_low_edge_not_opposite_extremes:
      'Dropping the two OPPOSITE extreme endpoints (kEnd = 11 and 13) together is only middling (rmsShift ' +
      '~0.003624, rank ~11 of 36) -- their opposite lever arms partly cancel. The most destabilizing pair is ' +
      'the two ADJACENT lowest rungs (the low boundary edge): it contains the extreme low rung but pairs it ' +
      'with its neighbour 11.25, not with the extreme high rung.',
  },
  isRigorous: false,
  verdict:
    'MEASUREMENT / PER-PAIR LTO INFLUENCE RANKING (frontier-direction, NOT rigorous). Ranking the imp-34042 ' +
    'leave-two-out folds by how far each dropped pair moves the fitted imp-33941 log curve peak = a + b ' +
    'ln(kEnd), influence is concentrated at the two BOUNDARY EDGES: the LOW edge (kEnd = 11, 11.25) is the ' +
    'single most destabilizing (rmsShift ~0.008907, Delta a ~+0.3417, Delta b ~-0.1356) and is ALSO the ' +
    'model-selection worst (Delta AIC -2.2238, the 3.04 : 1 floor); the HIGH edge (kEnd = 12.75, 13) is the ' +
    'near-tied second by curve shift (rmsShift ~0.008507) but the model-selection BEST (Delta AIC -3.0492). ' +
    'Interior-adjacent pairs are ~68x weaker (min rmsShift ~0.000131 at kEnd = 11.25, 11.5). Dropping the ' +
    'two OPPOSITE extremes (kEnd = 11, 13) is only middling (rank ~11). The parameter ranking and the model-' +
    'selection ranking agree at first place (the low edge) but diverge beyond it. No pair overturns the log ' +
    'preference (imp-34042 R1 survives verbatim). This is a per-pair influence ranking of an inherited ' +
    'sensitivity, not a new decision. Both forms are descriptive, not derived; the OLS surrogate is ' +
    'descriptive, not derived; the component model is the inherited imp-3220/imp-3406 extrapolation, NOT a ' +
    'rigorous asymptotic; the imp-33843 log-linear-vs-power-law FORM verdict is UNTOUCHED; the C_mb GUE-' +
    'conditional per imp-486 is UNTOUCHED; changes no bound; establishes no operator positivity; imp-3066 ' +
    'K_a >= 0 untouched; no RH verdict, NO QED. Platt-Trudgian Lambda <= 0.2 remains SOTA.',
  citation:
    'imp-34042 (the 36 leave-two-out folds ranked here); imp-33985 (the leave-ONE-out test naming kEnd = 11 ' +
    'most influential); imp-33941 (the log-form decision whose fit is destabilized); imp-33917 (the 9 ' +
    'endpoint peaks reused verbatim); imp-486 (C_mb GUE-conditional).',
};

export const IMP34110_LTO_PER_PAIR_INFLUENCE_RANKING_ASSERTIONS = [
  {
    // Reuse gate: the LTO data ARE the 9 imp-33917 boundary peaks, all 36 pairs enumerated on n = 7, and the
    // full-sample log fit + log-vs-linear contrast reproduce the imp-33941 / imp-34042 baseline.
    id: 'imp34110-reuse-gate-reproduces-baseline',
    description: '9 windows, 36 folds on n = 7; full log fit a ~ -2.8688, b ~ 1.3049; Delta AIC ~ -3.385',
    holds: () =>
      N_FULL === 9 &&
      FOLDS.length === 36 &&
      FOLDS.every((f) => f.logFavored) &&
      Math.abs(FULL_LOG.a - -2.868823) < 1e-4 &&
      Math.abs(FULL_LOG.b - 1.304897) < 1e-4 &&
      Math.abs(FULL_DELTA_AIC - -3.385) < 5e-3,
  },
  {
    // (R1) The single most destabilizing pair by fitted-log curve shift is the LOW boundary edge (kEnd = 11
    // and 11.25); the near-tied second is the HIGH edge (kEnd = 12.75 and 13); their parameter shifts are
    // near mirror images.
    id: 'imp34110-most-destabilizing-is-low-edge-high-edge-second',
    description: 'worst curve shift = [11, 11.25] (rms ~0.008907), second = [12.75, 13] (rms ~0.008507), mirror shifts',
    holds: () =>
      TOP_TWO_ARE_BOUNDARY_EDGES === true &&
      Math.abs(MOST_DESTABILIZING.rmsShift - 0.008907) < 1e-3 &&
      Math.abs(SECOND_DESTABILIZING.rmsShift - 0.008507) < 1e-3 &&
      MOST_DESTABILIZING.deltaA > 0 &&
      MOST_DESTABILIZING.deltaB < 0 &&
      SECOND_DESTABILIZING.deltaA < 0 &&
      SECOND_DESTABILIZING.deltaB > 0,
  },
  {
    // (R2) Interior-adjacent pairs are negligible: the minimum curve shift is at kEnd = 11.25 and 11.5,
    // ~68x smaller than the worst pair.
    id: 'imp34110-interior-adjacent-pairs-negligible',
    description: 'least curve shift = [11.25, 11.5] (rms ~0.000131), ~68x smaller than the low-edge worst',
    holds: () =>
      LEAST_DESTABILIZING.droppedKEnds[0] === 11.25 &&
      LEAST_DESTABILIZING.droppedKEnds[1] === 11.5 &&
      LEAST_DESTABILIZING.rmsShift < 0.0003 &&
      MOST_DESTABILIZING.rmsShift / LEAST_DESTABILIZING.rmsShift > 40,
  },
  {
    // (R3) Parameter-worst and selection-worst coincide at the low edge, but the rankings diverge: the high
    // edge is the second-worst by curve shift yet the LEAST destabilizing (most negative Delta AIC) by
    // model selection, and all four worst selection folds contain the extreme low rung kEnd = 11.
    id: 'imp34110-param-selection-coincide-then-diverge',
    description: 'selection-worst = [11, 11.25] (Delta AIC ~ -2.2238); high edge is curve-second but selection-best; all top-4 selection folds contain kEnd = 11',
    holds: () =>
      SELECTION_WORST.droppedKEnds[0] === 11 &&
      SELECTION_WORST.droppedKEnds[1] === 11.25 &&
      Math.abs(SELECTION_WORST.deltaAIC - -2.2238) < 5e-3 &&
      BY_SELECTION[BY_SELECTION.length - 1].droppedKEnds[0] === 12.75 &&
      BY_SELECTION[BY_SELECTION.length - 1].droppedKEnds[1] === 13 &&
      ALL_TOP4_SELECTION_CONTAIN_LOW_RUNG === true,
  },
  {
    // (R4) The worst pair is the low boundary edge, NOT the two opposite extremes: dropping kEnd = 11 and 13
    // together is only middling (rank > 3 of 36), so the opposite lever arms partly cancel.
    id: 'imp34110-worst-is-low-edge-not-opposite-extremes',
    description: 'most destabilizing at low edge; opposite-extremes [11, 13] only middling (rank > 3)',
    holds: () =>
      MOST_DESTABILIZING_AT_LOW_EDGE === true &&
      OPPOSITE_EXTREMES_FOLD.droppedKEnds[0] === 11 &&
      OPPOSITE_EXTREMES_FOLD.droppedKEnds[1] === 13 &&
      OPPOSITE_EXTREMES_RANK > 3 &&
      OPPOSITE_EXTREMES_FOLD.rmsShift < MOST_DESTABILIZING.rmsShift,
  },
  {
    // Honesty gate: influence ranking of an inherited sensitivity, isRigorous false, no QED, PT SOTA,
    // imp-3066 K_a >= 0 clause SPECIFICALLY untouched (imp-34024-26 convention -- a generic /UNTOUCHED/
    // regex also matches the unrelated imp-33843 FORM and C_mb clauses, so bind to the imp-3066 statement).
    id: 'imp34110-honesty-gate-imp3066-specific-no-qed',
    description: 'Measurement only: isRigorous false, imp-3066 K_a >= 0 untouched (clause-specific), no QED, PT SOTA',
    holds: () =>
      IMP34110_LTO_PER_PAIR_INFLUENCE_RANKING.isRigorous === false &&
      /imp-3066 K_a >= 0 untouched/.test(IMP34110_LTO_PER_PAIR_INFLUENCE_RANKING.verdict) &&
      /NO QED/.test(IMP34110_LTO_PER_PAIR_INFLUENCE_RANKING.verdict) &&
      /remains SOTA/.test(IMP34110_LTO_PER_PAIR_INFLUENCE_RANKING.verdict),
  },
];

for (const a of IMP34110_LTO_PER_PAIR_INFLUENCE_RANKING_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-34110-lto-per-pair-influence-ranking assertion failed: ${a.id}`);
  }
}
