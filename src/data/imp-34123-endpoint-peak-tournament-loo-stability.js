/**
 * @module imp-34123-endpoint-peak-tournament-loo-stability
 *
 * imp-34123 (numerical, frontier-direction): imp-34043 admitted a fourth, bounded/saturating growth
 * form peak = a - b/kEnd to the imp-33982 endpoint-peak tournament and reported that the saturating
 * form WINS a four-way AIC/BIC/AICc race on the full set of 9 imp-33917 endpoint peaks (kEnd = 11..13),
 * dethroning the concave-log winner by a POSITIVE-not-decisive margin (Delta AIC(log-sat) ~ +4.18,
 * w_sat ~ 0.872). But that single winner was declared on the full 9-peak fit only; the ROBUSTNESS of
 * the selection to any one peak was never tested. This module closes that gap with a leave-one-peak-out
 * (LOO) stability sweep: for each of the 9 endpoint peaks it DROPS that peak, refits all four forms on
 * the remaining 8, recomputes the four-way Akaike weights, and MEASURES whether the Akaike-selected
 * winner changes -- reporting which dropped peak (if any) flips the crown and, as a stability score, the
 * full-data winner-to-runner-up Delta AIC margin.
 *
 * THE MEASUREMENT (imp-34043 estimators reused VERBATIM; only the 9-fold leave-one-out refit is new)
 * -------------------------------------------------------------------------------------
 *   Data          The 9 endpoint peaks peak(kEnd), kEnd = 11.00 .. 13.00 step 0.25, taken VERBATIM from
 *                 IMP33917_ENDPOINT_RESIDUAL_GROWTH_LAW.boundarySweep -- the identical source imp-34043
 *                 scored (no surrogate re-run, no fresh model).
 *   Four models   M_lin: peak = a + b kEnd    M_log: peak = a + b ln(kEnd)
 *                 M_pow: peak = a*kEnd^b       M_sat: peak = a - b/kEnd  (all p = 3: 2 shape + variance)
 *                 fitted with the SAME ols / Gaussian-MLE infoCriteria helpers as imp-34043.
 *   LOO refits    For i = 0..8, drop peak i, refit all four on the 8 remaining points, recompute AIC and
 *                 the four-way Akaike weights, and record the winner (smallest AIC == smallest RSS, equal
 *                 p) and its Delta AIC margin to the runner-up. n = 8 => AICc denom n-p-1 = 4 (finite, ok).
 *   Stability     The selection is STABLE if every LOO winner equals the full-data winner. The full-data
 *                 winner-to-runner-up Delta AIC is reported as the stability score (larger = more robust).
 *
 * THE FINDING (measurement / model-selection robustness only -- the saturating winner is STABLE: no single
 * dropped peak flips the Akaike selection)
 * -------------------------------------------------------------------------------------------
 *   (R1) THE SATURATING WINNER IS LEAVE-ONE-PEAK-OUT STABLE. Across all 9 refits the Akaike-selected
 *        winner stays M_sat (peak = a - b/kEnd); NO dropped peak flips the crown. The runner-up stays the
 *        concave-log form in every subset, so the full ordering sat > log is preserved throughout.
 *   (R2) THE MARGIN IS THIN-BUT-POSITIVE ON EVERY SUBSET, NEVER DECISIVE, NEVER NEGATIVE. The LOO
 *        winner-to-runner-up Delta AIC ranges ~3.34 .. ~4.04 (all positive, all < 10): dropping the
 *        LOWEST endpoint kEnd = 11 shrinks the sat-over-log edge the most (margin ~3.34, w_sat ~0.807),
 *        while dropping the HIGHEST kEnd = 13 widens it the most (margin ~4.04, w_sat ~0.863). The most
 *        influential peak is thus the low-kEnd anchor, but even its removal leaves sat comfortably ahead.
 *   (R3) THE STABILITY DOES NOT UPGRADE THE VERDICT -- THE imp-34043 CAVEATS ALL SURVIVE. The full-data
 *        stability score (Delta AIC margin ~4.18) is POSITIVE-not-decisive; robustness to single-peak
 *        removal makes the saturating selection reproducible, NOT decisive. The fitted cap still sits far
 *        above the data and the win is still concavity-matching, not a physical plateau (imp-34043 R3
 *        untouched); the imp-33843 FORM verdict and the imp-33917 non-saturating reading are UNTOUCHED.
 *
 * The punchline: the imp-34043 saturating-form crown is LEAVE-ONE-PEAK-OUT STABLE -- across all 9
 * single-peak deletions the Akaike winner stays M_sat and the runner-up stays M_log, so no one peak
 * flips the selection; the winner-to-runner-up margin stays thin-but-positive (~3.34 .. ~4.04, never
 * decisive), most sensitive to the low-kEnd = 11 anchor (margin ~3.34) and most robust when the
 * high-kEnd = 13 point is dropped (margin ~4.04). Stability makes the selection reproducible, NOT
 * decisive: the imp-34043 positive-not-decisive verdict, its distant-cap reconciliation, and the
 * imp-33917 non-saturating reading all survive intact.
 *
 * MEASUREMENT / MODEL-SELECTION ROBUSTNESS ONLY. A 9-fold leave-one-peak-out stability sweep of an
 * inherited four-way Akaike selection on an inherited surrogate residual; NOT an RH bound. All four
 * forms are descriptive, not derived; the fitted saturation cap remains a narrow-window extrapolation
 * that asserts NO physical plateau (imp-34043 R3 untouched); the component model is the inherited
 * imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the imp-33843 log-linear-vs-power-law FORM
 * verdict is UNTOUCHED; the imp-33917 non-saturating reading is UNTOUCHED; the C_mb GUE-conditional per
 * imp-486 is UNTOUCHED; changes no bound; establishes no operator positivity; imp-3066 K_a >= 0
 * untouched; no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-34043-endpoint-peak-saturating-model-tournament (the four-way winner whose stability is tested)
 * @see imp-33982-endpoint-peak-power-law-model-selection (the three-form tournament imp-34043 extended)
 * @see imp-33917-endpoint-residual-growth-law (the 9 endpoint peaks scored here; the non-saturating reading)
 * @see imp-33843-eflow-resid-widening-form-fit (the log-linear OLS whose endpoint residual is the peak)
 */

import { IMP33917_ENDPOINT_RESIDUAL_GROWTH_LAW as G917 } from './imp-33917-endpoint-residual-growth-law.js';

// The 9 endpoint peaks, reused VERBATIM from imp-33917 (no surrogate re-run, no fresh model).
const ROWS = G917.boundarySweep;
const K_ENDS = ROWS.map((r) => r.kEnd);
const PEAKS = ROWS.map((r) => r.peak);
const N = K_ENDS.length;
const P_PARAMS = 3; // two shape params + variance (identical for all four forms)

// --- imp-34043 estimators, reused verbatim ---------------------------------------------------------
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
function rssPred(ys, preds) {
  let rss = 0;
  for (let i = 0; i < ys.length; i++) rss += (ys[i] - preds[i]) ** 2;
  return rss;
}
function aicOf(rss, n, p) {
  const ll = -0.5 * n * (Math.log(2 * Math.PI) + Math.log(rss / n) + 1);
  return 2 * p - 2 * ll;
}

// Fit all four forms on (ks, ps), return per-model AIC, four-way Akaike weights, winner and its
// Delta AIC margin to the runner-up. Equal p => AIC ranking == RSS ranking; every pairwise contrast
// reduces to n ln(RSS ratio), so AIC/BIC/AICc give identical winners and margins.
function fitFour(ks, ps) {
  const n = ks.length;
  const lnk = ks.map((k) => Math.log(k));
  const inv = ks.map((k) => 1 / k);

  const lin = ols(ks, ps);
  const rssLin = rssPred(ps, ks.map((k) => lin.a + lin.b * k));

  const log = ols(lnk, ps);
  const rssLog = rssPred(ps, lnk.map((l) => log.a + log.b * l));

  const powFit = ols(lnk, ps.map((p) => Math.log(p))); // log-log OLS; RSS in ORIGINAL space (as imp-34043)
  const powA = Math.exp(powFit.a);
  const powB = powFit.b;
  const rssPow = rssPred(ps, ks.map((k) => powA * Math.pow(k, powB)));

  const sat = ols(inv, ps); // peak = a + c/kEnd, cap = intercept a, b = -slope
  const rssSat = rssPred(ps, ks.map((k) => sat.a - -sat.b / k));

  const aics = { lin: aicOf(rssLin, n, P_PARAMS), log: aicOf(rssLog, n, P_PARAMS), pow: aicOf(rssPow, n, P_PARAMS), sat: aicOf(rssSat, n, P_PARAMS) };
  const aicMin = Math.min(aics.lin, aics.log, aics.pow, aics.sat);
  const rel = {
    lin: Math.exp(-0.5 * (aics.lin - aicMin)),
    log: Math.exp(-0.5 * (aics.log - aicMin)),
    pow: Math.exp(-0.5 * (aics.pow - aicMin)),
    sat: Math.exp(-0.5 * (aics.sat - aicMin)),
  };
  const relSum = rel.lin + rel.log + rel.pow + rel.sat;
  const w = { lin: rel.lin / relSum, log: rel.log / relSum, pow: rel.pow / relSum, sat: rel.sat / relSum };
  const sorted = Object.entries(aics).sort((x, y) => x[1] - y[1]);
  const winner = sorted[0][0];
  const runnerUp = sorted[1][0];
  const margin = sorted[1][1] - sorted[0][1]; // Delta AIC winner -> runner-up (>= 0)
  return { aics, w, winner, runnerUp, margin };
}

// --- Full-data fit (reproduces imp-34043: sat wins, log runner-up, margin ~4.18) --------------------
const FULL = fitFour(K_ENDS, PEAKS);

// --- Leave-one-peak-out sweep: drop each peak, refit, record winner + margin ------------------------
const LOO = K_ENDS.map((kDrop, i) => {
  const ks = K_ENDS.filter((_, j) => j !== i);
  const ps = PEAKS.filter((_, j) => j !== i);
  const f = fitFour(ks, ps);
  return {
    droppedKEnd: kDrop,
    winner: f.winner,
    runnerUp: f.runnerUp,
    flips: f.winner !== FULL.winner,
    margin: +f.margin.toFixed(4),
    w_sat: +f.w.sat.toFixed(4),
    w_log: +f.w.log.toFixed(4),
  };
});

const FLIPPERS = LOO.filter((r) => r.flips); // dropped peaks that flip the selection (expected: none)
const SELECTION_STABLE = FLIPPERS.length === 0; // no single-peak deletion changes the winner
const ALL_WINNERS_SAT = LOO.every((r) => r.winner === FULL.winner);
const ALL_RUNNERS_LOG = LOO.every((r) => r.runnerUp === 'log');

// Margin extremes across the sweep: which dropped peak is most/least influential on the sat-over-log edge.
const MARGINS = LOO.map((r) => r.margin);
const MIN_MARGIN = Math.min(...MARGINS);
const MAX_MARGIN = Math.max(...MARGINS);
const MOST_INFLUENTIAL = LOO.find((r) => r.margin === MIN_MARGIN); // drop that shrinks the edge most
const MOST_STABILIZING = LOO.find((r) => r.margin === MAX_MARGIN); // drop that widens the edge most
const ALL_POSITIVE = LOO.every((r) => r.margin > 0);
const ALL_NON_DECISIVE = LOO.every((r) => r.margin < 10);

// Stability score = full-data winner-to-runner-up Delta AIC margin (larger = more robust selection).
const STABILITY_SCORE = +FULL.margin.toFixed(4); // ~4.18 (matches imp-34043 deltaAIC_log_minus_sat)

export const IMP34123_ENDPOINT_PEAK_TOURNAMENT_LOO_STABILITY = {
  id: 'imp-34123',
  proofSection: 'S-frontier',
  question:
    'imp-34043 declared the saturating form peak = a - b/kEnd the four-way AIC/BIC/AICc winner over the ' +
    '9 imp-33917 endpoint peaks by a positive-not-decisive margin (~4.18), but never tested robustness to ' +
    'any one peak. Under leave-one-peak-out (9 refits), does the Akaike-selected growth form stay M_sat, ' +
    'or does dropping some single peak flip the crown? Model-selection robustness measurement only; NOT ' +
    'an RH bound; no QED.',
  measuredQuantity:
    'For each of the 9 leave-one-peak-out subsets: the four-way Akaike-selected winner, the runner-up, ' +
    'the winner-to-runner-up Delta AIC margin and w_sat/w_log; plus the full-data stability score (the ' +
    'winner-to-runner-up Delta AIC) and which dropped peak (if any) flips the selection.',
  nPeaks: N,
  fullData: {
    winner: FULL.winner, // 'sat'
    runnerUp: FULL.runnerUp, // 'log'
    marginDeltaAIC: STABILITY_SCORE, // ~4.18
    akaikeWeights: {
      lin: +FULL.w.lin.toFixed(4),
      log: +FULL.w.log.toFixed(4),
      pow: +FULL.w.pow.toFixed(4),
      sat: +FULL.w.sat.toFixed(4),
    },
  },
  looSweep: LOO, // per-dropped-peak: {droppedKEnd, winner, runnerUp, flips, margin, w_sat, w_log}
  stability: {
    selectionStable: SELECTION_STABLE, // true -- no dropped peak flips the winner
    allWinnersSat: ALL_WINNERS_SAT, // true
    allRunnersUpLog: ALL_RUNNERS_LOG, // true
    flippers: FLIPPERS.map((r) => r.droppedKEnd), // [] -- empty: no peak flips the crown
    stabilityScore: STABILITY_SCORE, // ~4.18, full-data winner-to-runner-up Delta AIC
    marginRange: { min: MIN_MARGIN, max: MAX_MARGIN }, // ~[3.34, 4.04]
    mostInfluentialDrop: { kEnd: MOST_INFLUENTIAL.droppedKEnd, margin: MOST_INFLUENTIAL.margin }, // kEnd 11
    mostStabilizingDrop: { kEnd: MOST_STABILIZING.droppedKEnd, margin: MOST_STABILIZING.margin }, // kEnd 13
    allMarginsPositive: ALL_POSITIVE, // true -- sat ahead on every subset
    allMarginsNonDecisive: ALL_NON_DECISIVE, // true -- never crosses the 10-unit decisive threshold
  },
  finding: {
    R1_saturating_winner_is_leave_one_peak_out_stable:
      'Across all 9 leave-one-peak-out refits the Akaike-selected winner stays M_sat (peak = a - b/kEnd) ' +
      'and the runner-up stays the concave-log form -- NO dropped peak flips the crown, so the full ' +
      'ordering sat > log is preserved on every 8-point subset.',
    R2_margin_thin_but_positive_never_decisive_low_kEnd_most_influential:
      'The LOO winner-to-runner-up Delta AIC ranges ~3.34 .. ~4.04 -- all positive, all below the ' +
      '10-unit decisive threshold. Dropping the LOWEST endpoint kEnd = 11 shrinks the sat-over-log edge ' +
      'the most (margin ~3.34, w_sat ~0.807); dropping the HIGHEST kEnd = 13 widens it the most (margin ' +
      '~4.04, w_sat ~0.863). The low-kEnd anchor is the most influential single peak, but even its ' +
      'removal leaves the saturating form comfortably ahead.',
    R3_stability_does_not_upgrade_the_verdict_imp34043_caveats_survive:
      'Robustness to single-peak removal makes the saturating selection REPRODUCIBLE, not DECISIVE: the ' +
      'full-data stability score (Delta AIC ~4.18) is positive-not-decisive and every subset margin is ' +
      'below 10. The fitted cap still sits far above the data and the win is still concavity-matching, ' +
      'not a physical plateau (imp-34043 R3 untouched); the imp-33843 FORM verdict and the imp-33917 ' +
      'non-saturating reading are UNTOUCHED.',
  },
  isRigorous: false,
  verdict:
    'MEASUREMENT / MODEL-SELECTION ROBUSTNESS (frontier-direction, NOT rigorous). Leave-one-peak-out ' +
    'stability sweep of the imp-34043 four-way endpoint-peak tournament: for each of the 9 imp-33917 ' +
    'endpoint peaks (kEnd = 11..13) drop it, refit all four forms (M_lin, M_log, M_pow, M_sat) on the ' +
    'remaining 8 with the identical imp-34043 ols / Gaussian-MLE estimators, and recompute the four-way ' +
    'Akaike weights. RESULT: the saturating winner is STABLE -- in all 9 refits the Akaike-selected ' +
    'winner stays M_sat (peak = a - b/kEnd) and the runner-up stays M_log, so NO single dropped peak ' +
    'flips the crown (flippers = []). The winner-to-runner-up margin stays thin-but-positive across the ' +
    'sweep (~3.34 .. ~4.04, all < 10, never decisive, never negative): the low-kEnd = 11 anchor is the ' +
    'most influential single peak (margin ~3.34, w_sat ~0.807) and the high-kEnd = 13 point the most ' +
    'stabilizing (margin ~4.04, w_sat ~0.863). The full-data stability score is Delta AIC ~4.18. ' +
    'Stability makes the saturating selection REPRODUCIBLE, NOT decisive: the imp-34043 ' +
    'positive-not-decisive verdict, its distant-cap reconciliation (the win is concavity-matching, not a ' +
    'physical plateau -- imp-34043 R3 untouched), and the imp-33917 non-saturating reading all survive ' +
    'intact. All four forms are descriptive, not derived; the component model is the inherited ' +
    'imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the imp-33843 log-linear-vs-power-law ' +
    'FORM verdict is UNTOUCHED; the C_mb GUE-conditional per imp-486 is UNTOUCHED; changes no bound; ' +
    'establishes no operator positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. ' +
    'No refereed bound is changed.',
  citation:
    'imp-34043 (the four-way saturating-form winner whose stability is tested); imp-33982 (the three-form ' +
    'tournament imp-34043 extended); imp-33917 (the 9 endpoint peaks scored here; the non-saturating ' +
    'reading); imp-33843 (the log-linear OLS whose endpoint residual is the peak); imp-486 (C_mb ' +
    'GUE-conditional).',
};

export const IMP34123_ENDPOINT_PEAK_TOURNAMENT_LOO_STABILITY_ASSERTIONS = [
  {
    // Reuse gate: the scored peaks ARE the imp-33917 boundary sweep -- 9 windows, same anchor peaks as
    // imp-34043 scored, and the full-data fit reproduces the imp-34043 winner (sat) and margin (~4.18).
    id: 'imp34123-reuse-gate-reproduces-imp34043-full-fit',
    description: '9 peaks; kEnd 11/11.5/12 match imp-33917 (+0.2479/+0.3218/+0.3830); full-data winner sat, runner-up log, margin ~4.18',
    holds: () => {
      const at = (k) => ROWS.find((r) => r.kEnd === k).peak;
      return (
        N === 9 &&
        Math.abs(at(11) - 0.2479) < 1e-3 &&
        Math.abs(at(11.5) - 0.3218) < 1e-3 &&
        Math.abs(at(12) - 0.383) < 1e-3 &&
        FULL.winner === 'sat' &&
        FULL.runnerUp === 'log' &&
        Math.abs(STABILITY_SCORE - 4.18) < 0.05
      );
    },
  },
  {
    // (R1) The saturating winner is leave-one-peak-out STABLE: no dropped peak flips the selection.
    id: 'imp34123-saturating-winner-loo-stable',
    description: 'all 9 LOO winners are sat, all runners-up log, flippers empty, selectionStable true',
    holds: () =>
      LOO.length === 9 &&
      SELECTION_STABLE === true &&
      ALL_WINNERS_SAT === true &&
      ALL_RUNNERS_LOG === true &&
      FLIPPERS.length === 0,
  },
  {
    // (R2) Margins thin-but-positive on every subset, never decisive; low-kEnd = 11 most influential.
    id: 'imp34123-margins-thin-positive-low-kend-most-influential',
    description: 'all LOO margins in (0,10); range ~[3.34,4.04]; most-influential drop is kEnd 11, most-stabilizing kEnd 13',
    holds: () =>
      ALL_POSITIVE === true &&
      ALL_NON_DECISIVE === true &&
      MIN_MARGIN > 3.0 &&
      MAX_MARGIN < 4.2 &&
      MOST_INFLUENTIAL.droppedKEnd === 11 &&
      MOST_STABILIZING.droppedKEnd === 13,
  },
  {
    // (R3) Honesty gate: stability score = full margin = n ln(RSS ratio) sign; caveats survive; NO QED.
    id: 'imp34123-stability-score-honesty-gate',
    description: 'stabilityScore == full margin; positive-not-decisive (0 < score < 10); isRigorous false; NO QED; no refereed bound is changed; imp-3066 K_a>=0 untouched; imp-34043 R3 untouched',
    holds: () =>
      Math.abs(STABILITY_SCORE - FULL.margin) < 5e-4 &&
      STABILITY_SCORE > 0 &&
      STABILITY_SCORE < 10 &&
      IMP34123_ENDPOINT_PEAK_TOURNAMENT_LOO_STABILITY.isRigorous === false &&
      /NO QED/.test(IMP34123_ENDPOINT_PEAK_TOURNAMENT_LOO_STABILITY.verdict) &&
      /refereed bound is changed/i.test(IMP34123_ENDPOINT_PEAK_TOURNAMENT_LOO_STABILITY.verdict) &&
      /imp-3066 K_a >= 0 untouched/i.test(IMP34123_ENDPOINT_PEAK_TOURNAMENT_LOO_STABILITY.verdict) &&
      /concavity-matching/.test(IMP34123_ENDPOINT_PEAK_TOURNAMENT_LOO_STABILITY.verdict),
  },
];

for (const a of IMP34123_ENDPOINT_PEAK_TOURNAMENT_LOO_STABILITY_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-34123-endpoint-peak-tournament-loo-stability assertion failed: ${a.id}`);
  }
}
