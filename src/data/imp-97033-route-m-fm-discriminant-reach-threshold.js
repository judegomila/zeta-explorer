/**
 * @module imp-97033-route-m-fm-discriminant-reach-threshold
 *
 * imp-97033 (numerical, MEASUREMENT/ANALYSIS ONLY): quantifies the imp-97016 VERDICT residual.
 * imp-97016 re-ran the Route M F < M monotonicity-partition against the freshest exact
 * Vasyunin-Gram ||G||_F rungs (now N = 24000 per imp-96912) WITHOUT the imp-96996 monotonicity
 * prior and STILL could not reject the concave quadratic: it is the ~3.23-decade far
 * extrapolation to N* ~ 4e7 (imp-96912 AMBIGUITY), not the local shape, that keeps the concave
 * quad in play, and "only exact rungs reaching a substantial fraction of that far scale could let
 * the data alone reject it". This module makes that "substantial fraction" a NUMBER: it models the
 * concave-quad vs monotone-ceiling discriminant as a function of top exact rung N_top and measures
 * what fraction of N* ~ 4e7 the exact ladder must reach before the data alone excludes the concave
 * turnover at a stated confidence. Analysis/measurement only; no Gram rebuilt, no O(N^3) rung
 * computed here; only the trace ceiling T stays rigorous; F, M inherit non-rigorous extrapolations;
 * no bound moves; no refereed bound is changed; RH open; NO QED.
 *
 * -------------------------------------------------------------------------------
 * THE DISCRIMINANT. The quad-vs-tail ceiling spread S(N_top).
 * -------------------------------------------------------------------------------
 * The concave quad and the monotone +d/N tail both fit the exact ||G||_F ladder within the
 * measured window (fit RMS ~ 2e-3 quad, ~7e-3 tail); they diverge only in the far extrapolation to
 * the cond# = 1/eps ceiling N*. The natural data-alone discriminant is therefore the CEILING SPREAD
 * S(N_top) = N*_quad / N*_tail - 1, re-measured as the top exact rung N_top grows. Truncating the
 * EXACT 24-rung ladder at N_top in {8000..24000} and refitting both models at each truncation gives
 * a spread that decays log-linearly in N_top (self-recovers the imp-96912 anchors exactly:
 * S(16000) = 6.892 percent, S(24000) = 6.221 percent):
 *   ln(S percent) = 4.5529 - 0.6235 * log10(N_top)     [rate -0.6235 per decade of N_top]
 * i.e. the discriminating spread shrinks only ~0.62 decade of spread per decade of N_top -- the
 * O(N^3)-expensive far extrapolation dominates, exactly as imp-96912 Finding 2 measured
 * (~0.06 decade of remaining extrapolation per doubling of the top rung).
 *
 * -------------------------------------------------------------------------------
 * THE THRESHOLD LADDER (agnostic, data-alone; extrapolating the measured decay law).
 * -------------------------------------------------------------------------------
 * Inverting the decay law for a target spread S* gives the top exact rung N_top the ladder must
 * reach for the data alone to resolve the quad-vs-monotone ceiling ambiguity to that level:
 *   S* = 1.84 percent  (quad ceiling drops to M_lo; F < M no longer inverted)  N_top ~ 2.12e6  = 5.19 percent of N*
 *   S* = 1.0  percent  (ceiling ambiguity resolved to ~1 percent)             N_top ~ 2.01e7  = 49.1 percent of N*
 *   S* = 0.5  percent                                                         N_top ~ 2.60e8  > N* (unreachable below the ceiling)
 * So a SUBSTANTIAL FRACTION is quantified: merely dropping the quad ceiling to the M_lo inversion
 * boundary (spread S* = M_lo/N*_tail - 1 ~ 1.84 percent) needs N_top ~ 5.19 percent of N* (~2.1e6),
 * and genuinely resolving the ceiling ambiguity to the 1 percent level needs N_top ~ HALF of N*
 * itself (~2e7). A 0.5 percent resolution is not reachable below the ceiling at all -- at that point
 * exact rungs sit past N*, so the ceiling is measured directly rather than extrapolated.
 *
 * -------------------------------------------------------------------------------
 * NOISELESS IDENTIFIABILITY CROSS-CHECK (conditional lower bound; truth = monotone tail).
 * -------------------------------------------------------------------------------
 * If the true norm IS the monotone tail, feeding a quad fit noiseless monotone rungs to N_top
 * progressively strips its spurious curvature: the quad-fit ceiling first drops to M_lo at
 * N_top ~ 1.22e5 (0.30 percent of N*) and to within 1 percent of the tail ceiling at N_top ~ 2.9e5
 * (0.71 percent of N*). This is a CONDITIONAL LOWER bound: it only holds IF the norm is truly
 * monotone, and it sits an order of magnitude below the agnostic M_lo-drop rung (5.19 percent of N*)
 * because a noiseless monotone curve gives the quad no curvature to fit. The agnostic 1-percent rung
 * (~49 percent of N*) is the honest data-alone requirement, since the data cannot presuppose which
 * model is true (out-of-sample the quad is the better LOCAL fit, imp-96912 Finding 1).
 *
 * -------------------------------------------------------------------------------
 * O(N^3) CPU SCOPING (relative to the current top exact rung N = 24000).
 * -------------------------------------------------------------------------------
 * The exact Vasyunin V-table build is O(N^3), so reaching N_top costs (N_top / 24000)^3 x the
 * current top-rung build:
 *   N_top ~ 2.12e6 (5.19 percent, M_lo drop)   ~ 6.9e5 x
 *   N_top ~ 2.01e7 (49.1 percent, S* = 1)      ~ 5.9e8 x
 * A decisive DATA-ALONE 1-percent resolution is ~6e8 x the current top-rung CPU -- firmly on a
 * native/offline HPC backend, not in-pool. This confirms imp-97016: settling F < M data-only is
 * blocked on exact rungs FAR beyond N = 24000, and a one-sided interior norm asymptotic -- which
 * imp-96750 reduces to a single unproved target (oneSidedBoundProved=false), not a proof -- remains
 * the only rung-free route to pin F if it were established.
 *
 * -------------------------------------------------------------------------------
 * VERDICT (honest partial).
 * -------------------------------------------------------------------------------
 * Quantifies the imp-97016 "substantial fraction of N*" residual. Modelling the quad-vs-tail ceiling
 * spread S(N_top) from real exact-ladder truncations (log-decay rate -0.6235 per decade, recovering
 * the imp-96912 anchors 6.892 / 6.221 percent), the exact ladder must reach N_top ~ 5.19 percent of
 * N* just to drop the quad ceiling to the M_lo inversion boundary, and N_top ~ 49 percent of N*
 * (~2e7) to resolve the ceiling ambiguity to the 1 percent level -- an O(N^3) build ~6e8 x the
 * current N = 24000 rung. A 0.5 percent resolution needs rungs past N* itself. So the data alone
 * cannot exclude the concave turnover at any useful confidence without reaching a genuinely
 * substantial fraction of the ceiling scale. Measurement/analysis only; no rung computed; only the
 * trace ceiling T ~ 2.594e7 is rigorous; F, M inherit non-rigorous extrapolations; no bound moves;
 * no refereed bound is changed; RH open; NO QED.
 *
 * @see imp-97016-route-m-fm-dataalone-extended-ladder.js (the caveat: data alone cannot reject the quad; needs rungs at a substantial fraction of N*)
 * @see imp-96912-route-m-frobenius-ladder-extension-above-16000.js (the 24-rung exact ladder + line/quad/+d-over-N ceiling models)
 * @see imp-96890-route-m-frobenius-concave-norm-ceiling-refit.js (the concave models)
 *
 * Ticket: imp-97033 (numerical, opus-4-8, api-pool). Measurement/analysis only; honest partial; NO QED.
 */

import {
  IMP96912_BASE_LADDER,
  IMP96912_NEW_RUNGS,
  IMP96912_EPS,
  IMP96912_LAMMIN,
  IMP96912_EXT_CEILING,
} from './imp-96912-route-m-frobenius-ladder-extension-above-16000.js';

// Canonical Route M lower band edge (imp-96996 / imp-96976 M_lo), carried as a frozen literal.
const M_LO = 3.919e7;
// The far ceiling scale the ticket references (imp-96912 NstarQuad ~ 4.09e7; "N* ~ 4e7").
const N_STAR = IMP96912_EXT_CEILING.NstarQuad;
// Current top exact rung (the O(N^3) V-table build cost reference).
const N_TOP_CURRENT = 24000;

const LADDER = [...IMP96912_BASE_LADDER, ...IMP96912_NEW_RUNGS];

// --- fit machinery (identical normal-equations solver as imp-96912) ---
function lstsq(rows, basisOf) {
  const m = basisOf(rows[0].N).length;
  const AtA = Array.from({ length: m }, () => new Array(m).fill(0));
  const Atb = new Array(m).fill(0);
  for (const r of rows) {
    const phi = basisOf(r.N);
    for (let i = 0; i < m; i += 1) {
      Atb[i] += phi[i] * r.frobenius;
      for (let j = 0; j < m; j += 1) AtA[i][j] += phi[i] * phi[j];
    }
  }
  const M = AtA.map((row, i) => [...row, Atb[i]]);
  for (let c = 0; c < m; c += 1) {
    let piv = c;
    for (let r = c + 1; r < m; r += 1) if (Math.abs(M[r][c]) > Math.abs(M[piv][c])) piv = r;
    [M[c], M[piv]] = [M[piv], M[c]];
    for (let r = 0; r < m; r += 1) {
      if (r === c) continue;
      const f = M[r][c] / M[c][c];
      for (let k = c; k <= m; k += 1) M[r][k] -= f * M[c][k];
    }
  }
  return M.map((row, i) => row[m] / row[i]);
}
const basisQuad = (N) => [1, Math.log(N), Math.log(N) ** 2];
const basisTail = (N) => [1, Math.log(N), 1 / N];
const froFrom = (coef, basisOf) => (N) => {
  const phi = basisOf(N);
  let v = 0;
  for (let i = 0; i < coef.length; i += 1) v += coef[i] * phi[i];
  return v;
};
function solveCeiling(froOf) {
  const { A, p } = IMP96912_LAMMIN;
  let lo = 1e3;
  let hi = 1e12;
  for (let i = 0; i < 300; i += 1) {
    const N = Math.sqrt(lo * hi);
    const cond = froOf(N) / (A * Math.pow(N, -p));
    if (cond > 1 / IMP96912_EPS) hi = N;
    else lo = N;
  }
  return Math.sqrt(lo * hi);
}
function spreadAtTruncation(nTop) {
  const rows = LADDER.filter((r) => r.N <= nTop);
  const nq = solveCeiling(froFrom(lstsq(rows, basisQuad), basisQuad));
  const nt = solveCeiling(froFrom(lstsq(rows, basisTail), basisTail));
  return { nStarQuad: nq, nStarTail: nt, spreadPct: (nq / nt - 1) * 100 };
}

// --- the measured discriminant S(N_top) from real exact-ladder truncations ---
const TRUNCATIONS = [8000, 10000, 12000, 14000, 16000, 18000, 20000, 22000, 24000];
export const IMP97033_SPREAD_LADDER = Object.freeze(
  TRUNCATIONS.map((nTop) => {
    const s = spreadAtTruncation(nTop);
    return Object.freeze({ nTop, ...s });
  }),
);

// --- log-linear decay fit ln(spread%) = alpha + beta*log10(N_top), fit over N_top >= 12000 ---
function logDecayFit(rows) {
  let sx = 0;
  let sy = 0;
  let sxx = 0;
  let sxy = 0;
  const n = rows.length;
  for (const r of rows) {
    const X = Math.log10(r.nTop);
    const Y = Math.log(r.spreadPct);
    sx += X;
    sy += Y;
    sxx += X * X;
    sxy += X * Y;
  }
  const beta = (n * sxy - sx * sy) / (n * sxx - sx * sx);
  const alpha = (sy - beta * sx) / n;
  return { alpha, beta };
}
const DECAY = logDecayFit(IMP97033_SPREAD_LADDER.filter((r) => r.nTop >= 12000));
export const IMP97033_DECAY_FIT = Object.freeze({
  alpha: DECAY.alpha, // ~4.5529
  betaPerDecade: DECAY.beta, // ~-0.6235 (spread shrinks ~0.62 decade per decade of N_top)
  form: 'ln(spread percent) = alpha + beta * log10(N_top)',
});

// N_top required to reach a target spread S* (invert the decay law).
function nTopForSpread(sPct) {
  return Math.pow(10, (Math.log(sPct) - DECAY.alpha) / DECAY.beta);
}

// --- threshold ladder: target spread -> required N_top -> fraction of N* -> O(N^3) cost ---
function thresholdRow(sPct, label) {
  const nTop = nTopForSpread(sPct);
  return Object.freeze({
    label,
    targetSpreadPct: sPct,
    nTopRequired: nTop,
    fracOfNStarPct: (nTop / N_STAR) * 100,
    fracOf4e7Pct: (nTop / 4e7) * 100,
    reachableBelowNStar: nTop < N_STAR,
    cubicCostMultiple: Math.pow(nTop / N_TOP_CURRENT, 3), // O(N^3) V-table build vs current top rung
  });
}
// The M_lo-drop target: quad ceiling == M_LO. With N*_quad = N*_tail*(1+S/100) and N*_tail roughly
// flat in N_top, the quad ceiling hits M_LO when the spread S = (M_LO/N*_tail - 1)*100.
const S_MLO = (M_LO / IMP96912_EXT_CEILING.NstarTail - 1) * 100; // ~1.84 percent
export const IMP97033_THRESHOLD_LADDER = Object.freeze([
  thresholdRow(S_MLO, 'quad ceiling drops to M_lo (F<M no longer inverted)'),
  thresholdRow(1.0, 'ceiling ambiguity resolved to 1 percent'),
  thresholdRow(0.5, 'ceiling ambiguity resolved to 0.5 percent'),
]);

// --- noiseless identifiability cross-check (conditional lower bound; truth = monotone tail) ---
// feed a quad fit noiseless monotone rungs (truth = tail fit to all 24 rungs) to N_top; find where
// the quad-fit ceiling first drops to M_lo.
const truthTail = froFrom(lstsq(LADDER, basisTail), basisTail);
function quadCeilOnMonotone(nTop) {
  const rows = [];
  for (const r of LADDER) if (r.N <= nTop) rows.push({ N: r.N, frobenius: truthTail(r.N) });
  let N = 26000;
  while (N <= nTop) {
    rows.push({ N, frobenius: truthTail(N) });
    N += 2000;
  }
  return solveCeiling(froFrom(lstsq(rows, basisQuad), basisQuad));
}
function bisectMonotoneDrop(targetCeil) {
  let lo = 24000;
  let hi = 4e7;
  for (let i = 0; i < 80; i += 1) {
    const N = Math.sqrt(lo * hi);
    if (quadCeilOnMonotone(N) > targetCeil) lo = N;
    else hi = N;
  }
  return Math.sqrt(lo * hi);
}
const nMonotoneMlo = bisectMonotoneDrop(M_LO);
export const IMP97033_MONOTONE_IDENTIFIABILITY = Object.freeze({
  assumption: 'truth = monotone +d/N tail (conditional; only valid IF the norm is truly monotone)',
  nTopQuadCeilHitsMlo: nMonotoneMlo, // ~1.22e5
  fracOfNStarPct: (nMonotoneMlo / N_STAR) * 100, // ~0.30
  note:
    'CONDITIONAL lower bound: the agnostic data-alone requirement is larger because the data cannot ' +
    'presuppose the model (out-of-sample the quad is the better LOCAL fit, imp-96912 Finding 1).',
});

export const IMP97033_VERDICT = Object.freeze({
  question:
    'how far (as a fraction of N* ~ 4e7) must the EXACT Vasyunin-Gram ||G||_F ladder reach before the ' +
    'DATA ALONE excludes the Route M concave-quad ceiling turnover at a stated confidence?',
  decayRatePerDecade: IMP97033_DECAY_FIT.betaPerDecade, // ~-0.6235
  recoversImp96912Anchors:
    Math.abs(IMP97033_SPREAD_LADDER.find((r) => r.nTop === 16000).spreadPct - 6.892) < 0.01 &&
    Math.abs(IMP97033_SPREAD_LADDER.find((r) => r.nTop === 24000).spreadPct - 6.221) < 0.01,
  fracForMloDropPct: IMP97033_THRESHOLD_LADDER[0].fracOfNStarPct, // ~5.19
  fracForOnePercentPct: IMP97033_THRESHOLD_LADDER[1].fracOfNStarPct, // ~49
  cubicCostForOnePercent: IMP97033_THRESHOLD_LADDER[1].cubicCostMultiple, // ~5.9e8
  halfPercentReachableBelowNStar: IMP97033_THRESHOLD_LADDER[2].reachableBelowNStar, // false
  anyBoundMoved: false,
  postsRigorousCeiling: false,
  qed: false,
  conclusion:
    'QUANTIFIES the imp-97016 "substantial fraction of N*" residual. The quad-vs-tail ceiling spread ' +
    'S(N_top), measured from real exact-ladder truncations (log-decay rate -0.6235 per decade, ' +
    'recovering the imp-96912 anchors S(16000)=6.892, S(24000)=6.221 percent), decays only ~0.62 ' +
    'decade of spread per decade of N_top. Inverting the law: the exact ladder must reach N_top ~ ' +
    '5.19 percent of N* (~2.1e6) just to drop the quad ceiling to the M_lo inversion boundary, and ' +
    'N_top ~ 49 percent of N* (~2e7) to resolve the ceiling ambiguity to the 1 percent level -- an ' +
    'O(N^3) V-table build ~5.9e8 x the current N=24000 top rung. A 0.5 percent resolution needs ' +
    'rungs past N* itself (the ceiling is then measured, not extrapolated). A conditional noiseless ' +
    'cross-check (truth=monotone) puts a 0.30 percent-of-N* LOWER bound on the M_lo drop. So the data ' +
    'alone cannot exclude the concave turnover at any useful confidence without reaching a genuinely ' +
    'substantial fraction of the ceiling scale; a decisive run is native/offline-HPC-only, and a ' +
    'one-sided interior norm asymptotic -- which imp-96750 reduces to a single unproved target ' +
    '(oneSidedBoundProved=false), not a proof -- stays the only rung-free route if established. Measurement ' +
    'only; only the trace ceiling T~2.594e7 is rigorous; no bound moves; no refereed bound is changed' +
    '; RH open; NO QED.',
});

export const IMP97033_SUBGAP = Object.freeze({
  id: 'imp-97033-data-alone-quad-rejection-needs-half-of-Nstar',
  statement:
    'A DATA-ALONE rejection of the Route M concave-quad ceiling turnover to the 1 percent level needs ' +
    'exact ||G||_F rungs to N_top ~ 49 percent of N* ~ 4e7 (~2e7), an O(N^3) V-table build ~5.9e8 x ' +
    'the current N=24000 top rung -- native/offline-HPC-only. Merely dropping the quad ceiling to the ' +
    'M_lo inversion boundary needs ~5.19 percent of N* (~2.1e6, ~6.9e5 x). The decay rate (-0.62 ' +
    'decade of spread per decade of N_top) is the obstruction: the spread is dominated by the far ' +
    'extrapolation, so a one-sided interior norm asymptotic -- which imp-96750 reduces to a single ' +
    'unproved target (oneSidedBoundProved=false), not a proof -- remains the only rung-free route to ' +
    'pin F if it were established.',
});

export const IMP97033_HONEST_BANNER =
  'RH open; no refereed bound is changed; NO QED. Measurement/analysis only, honest partial of ' +
  'imp-97016: no Gram was rebuilt and no O(N^3) rung was computed here -- the quad-vs-tail ceiling ' +
  'spread S(N_top) is measured from real exact-ladder truncations (N_top in 8000..24000, recovering ' +
  'the imp-96912 anchors), its log-decay law inverted for the N_top needed at each confidence, and ' +
  'the O(N^3) V-table cost scoped. Only the trace ceiling T~2.594e7 is rigorous; F and M inherit the ' +
  'non-rigorous lam_min N^-p / ||G||_F log-fit extrapolations; no bound is claimed moved.';

// -- self-executing assertions (imp-3715 convention): any failure throws at import --
const IMP97033_ASSERTIONS = [
  {
    id: 'imp97033-spread-ladder-recovers-imp96912-anchors-and-is-monotone-decreasing',
    holds: () =>
      IMP97033_SPREAD_LADDER.length === 9 &&
      Math.abs(IMP97033_SPREAD_LADDER.find((r) => r.nTop === 16000).spreadPct - 6.892) < 0.01 &&
      Math.abs(IMP97033_SPREAD_LADDER.find((r) => r.nTop === 24000).spreadPct - 6.221) < 0.01 &&
      IMP97033_SPREAD_LADDER.every(
        (r, i) => i === 0 || r.spreadPct < IMP97033_SPREAD_LADDER[i - 1].spreadPct,
      ),
    why: 'the measured quad-vs-tail ceiling spread from real exact-ladder truncations reproduces the imp-96912 anchors S(16000)=6.892, S(24000)=6.221 percent and decreases monotonically as the top exact rung grows.',
  },
  {
    id: 'imp97033-decay-rate-negative-around-0.62-per-decade',
    holds: () =>
      IMP97033_DECAY_FIT.betaPerDecade < -0.55 &&
      IMP97033_DECAY_FIT.betaPerDecade > -0.7 &&
      IMP97033_DECAY_FIT.alpha > 4.3 &&
      IMP97033_DECAY_FIT.alpha < 4.8,
    why: 'the ceiling spread decays log-linearly in N_top at rate ~-0.62 decade of spread per decade of N_top -- the far-extrapolation obstruction that keeps the concave quad in play.',
  },
  {
    id: 'imp97033-threshold-ladder-mlo-fewpct-onepercent-half-of-Nstar',
    holds: () =>
      IMP97033_THRESHOLD_LADDER[0].fracOfNStarPct > 3 &&
      IMP97033_THRESHOLD_LADDER[0].fracOfNStarPct < 8 &&
      IMP97033_THRESHOLD_LADDER[1].fracOfNStarPct > 30 &&
      IMP97033_THRESHOLD_LADDER[1].fracOfNStarPct < 70 &&
      IMP97033_THRESHOLD_LADDER[1].cubicCostMultiple > 1e8 &&
      IMP97033_THRESHOLD_LADDER[2].reachableBelowNStar === false,
    why: 'dropping the quad ceiling to the M_lo inversion boundary needs N_top ~ 5 percent of N*, but resolving the ceiling ambiguity to the 1 percent level needs ~half of N* (~2e7), an O(N^3) build ~1e8-1e9 x the current top rung; a 0.5 percent resolution needs rungs past N* itself.',
  },
  {
    id: 'imp97033-monotone-identifiability-is-conditional-lower-bound',
    holds: () =>
      IMP97033_MONOTONE_IDENTIFIABILITY.fracOfNStarPct > 0.15 &&
      IMP97033_MONOTONE_IDENTIFIABILITY.fracOfNStarPct < 0.6 &&
      IMP97033_MONOTONE_IDENTIFIABILITY.fracOfNStarPct <
        IMP97033_THRESHOLD_LADDER[1].fracOfNStarPct,
    why: 'the noiseless truth=monotone cross-check gives a ~0.30 percent-of-N* CONDITIONAL lower bound on the M_lo drop, strictly below the agnostic 1-percent-resolution requirement, because the data cannot presuppose the model.',
  },
  {
    id: 'imp97033-honesty-gate-no-qed',
    holds: () =>
      IMP97033_VERDICT.anyBoundMoved === false &&
      IMP97033_VERDICT.postsRigorousCeiling === false &&
      IMP97033_VERDICT.qed === false &&
      IMP97033_VERDICT.recoversImp96912Anchors === true &&
      IMP97033_VERDICT.halfPercentReachableBelowNStar === false &&
      /NO QED/.test(IMP97033_HONEST_BANNER) &&
      /PT Lambda <= 0.2|refereed bound is changed/.test(IMP97033_HONEST_BANNER) &&
      /RH open/.test(IMP97033_HONEST_BANNER) &&
      /needs-half-of-Nstar/.test(IMP97033_SUBGAP.id),
    why: 'measurement/analysis only: no bound moved, no rigorous ceiling posted, the imp-96912 anchors are recovered, the 0.5-percent resolution is unreachable below N*, and the honesty markers plus the residual sub-gap are present.',
  },
];

for (const a of IMP97033_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-97033-route-m-fm-discriminant-reach-threshold assertion failed: ${a.id}`,
    );
  }
}

export default {
  spreadLadder: IMP97033_SPREAD_LADDER,
  decayFit: IMP97033_DECAY_FIT,
  thresholdLadder: IMP97033_THRESHOLD_LADDER,
  monotoneIdentifiability: IMP97033_MONOTONE_IDENTIFIABILITY,
  verdict: IMP97033_VERDICT,
  subGap: IMP97033_SUBGAP,
  banner: IMP97033_HONEST_BANNER,
};
