/**
 * @fileoverview route-22-lehmer-pair-hunt-2026-10-11 — roadmap route 22 (batch 6): Lehmer-pair hunt at large height on the lower-bound
 * side (Λ ≥ −ε). One run plus one adversarial internal referee pass (not refuted; severity minor); the referee corrections are applied below.
 *
 * PROVED: no new theorem. The Csordas–Smith–Varga criterion is used in γ-coordinates: D = γ_{k+1} − γ_k, G = Σ_{j ≠ k,k+1, over ±γ_j}
 *  [(γ_k − γ_j)^{−2} + (γ_{k+1} − γ_j)^{−2}]; if D²G < 4/5 then Λ ≥ λ_k = ((1 − (5/4)D²G)^{4/5} − 1)/(2G), decreasing in D and G. Quoted
 *  from memory, not from the paper; re-derived by the referee as the exact solution of the comparison system d(Δ²)/ds = −8 + 2Δ²g,
 *  g′ ≤ 8g² (x = 2γ units), reduces to −D²/2 with no other zeros, and tested on exact polynomial heat flows (λ_CSV ≤ true backward
 *  collision time, ratio 1.00001–1.028 for D²g = 0.011–0.57).
 * CERTIFIED (assuming FLINT 3.6 / Arb correct; audited Platt + Turing code path; trailing digits rounded outward per the referee, since the
 *  neighbour sum in G is double precision with a 1e-12 margin and G moves λ only at relative order ≈ 6e-5):
 *  Λ ≥ −4.2577e-6 from zeros #32130279098/#32130279099 (γ_k = 10000035817.74391433, gap 2.918006925e-3, s = 0.00984, D²G = 4.7e-4);
 *  1e11 window Λ ≥ −1.3453e-5; 1e12 Λ ≥ −7.5676e-6; 1e13 Λ ≥ −4.9407e-6. Independent Hardy-Z sign checks (acb_dirichlet_hardy_z): 15/15
 *  triples alternate. These add nothing beyond Rodgers–Tao Λ ≥ 0 (or beyond SGD's superseded −1.14541e-11).
 * CONDITIONAL: Odlyzko first 1e6 zeros: Λ ≥ −1.6268e-5 (pair #420891/420892, γ = 273193.66), assuming table accuracy ≈ 4e-9 and complete
 *  indices (mpmath zetazero reproduces the gap to 4.5e-10). Every bound also assumes the CSV statement is quoted correctly.
 * MEASURED: 1,551,082 distinct FLINT zeros (≈ 1.86M raw rows incl. chunk overlaps) in four windows near 1e10–1e13 plus Odlyzko's first 1e6.
 *  An independent replication of the known Bogomolny–Bohigas–Leboeuf–Monastra (2006) CUE_Neff finite-height small-gap correction (not a new
 *  law): pooled s < 0.2 gives 12834 observed vs 13186 GUE (0.9733 ± 0.0088, 3.07σ) vs 12782 CUE_Neff (1.004 ± 0.009); at s < 0.1 1570 vs
 *  1688 / 1634 (obs/CUE_Neff 0.961 ± 0.025, 1.6σ low); height dependence across the four windows NOT resolved. Odlyzko 1e6: obs/GUE 0.819 ±
 *  0.012 at s < 0.2 (CUE_Neff 0.83). λ tail exponent 1.38–1.62 (GUE 3/2). 6.2–6.6% of pairs satisfy D²G < 4/5. λ_CSV / first-order collision
 *  time quantiles 0.952/0.962/0.999 (near-sharpness also confirmed against the true collision time by the referee's polynomial test).
 * HEURISTIC: record projection under the measured law — median best bound among the first 1e13 zeros −4.9e-11, P(record or better) ≈ 7.6%
 *  (SGD pair location unverified); median = record would need ≈ 8.6e13 zeros at 1e12 (≈ 2.1e8 core-hours at the measured rate). The
 *  Odlyzko-2000 percentile depends on the assumed zero count (≈ 12% for 1e9 zeros, ≈ 2.3% for the 1.75e8-zero 1e20 set): unverified, not a
 *  confirmation. The Lehmer-pair route gives Λ ≥ −ε_N with ε_N ~ (2π/L)² N^{−2/3}; it would reach Λ ≥ 0 only under unproved small-gap
 *  statistics. Rodgers–Tao proved Λ ≥ 0 unconditionally by a DIFFERENT argument (Λ < 0 forces regular spacing, contradicting pair-correlation
 *  information) — not the N → ∞ limit of this mechanism.
 *
 * Lower-bound side only; nothing touches the upper side. No refereed bound is changed; RH open; NO QED. Import-free. ROUTE_22_ASSERTIONS
 * recompute live: λ_CSV for the certified 1e10 pair (and its G-insensitivity), the two-zero limit, outward rounding of every bound, the
 * ratio to the SGD record, the GUE small-gap counts from the Taylor expansion of the GUE spacing density, the z-scores, and the projection
 * arithmetic.
 */

const { PI, abs, sqrt } = Math;

export const ROUTE_22 = Object.freeze({
  id: 'route-22-lehmer-pair-hunt-2026-10-11',
  route: 22,
  date: '2026-10-11',
  title: 'Route 22: Lehmer-pair hunt to 1e13 — best certified Λ ≥ −4.2577e-6, no competitive bound; replicates the CUE_Neff small-gap correction',
  status: 'done',
  headline: '1,551,082 distinct FLINT zeros (≈ 1.86M raw rows) in four windows near 1e10, 1e11, 1e12, 1e13 plus Odlyzko\'s first 1e6: best '
    + 'certified Lehmer-pair bound Λ ≥ −4.2577e-6 (pair near 1e10), ≈ 3.7e5× weaker than the superseded SGD record −1.14541e-11 and adding '
    + 'nothing beyond Rodgers–Tao Λ ≥ 0. The small-gap rate is 3σ below GUE and matches the known Bogomolny et al. CUE_Neff finite-height model '
    + '(an independent replication, not a new law).',

  csv: Object.freeze({ condition: 'D²G < 4/5', formula: 'λ = ((1 − (5/4)D²G)^{4/5} − 1)/(2G)', source: 'quoted from memory; re-derived; not checked against the paper' }),
  certified: Object.freeze({
    h1e10: Object.freeze({ idx: 32130279098, gamma: 10000035817.74391433, gap: 2.918006925e-3, s: 0.00984, Grig: 55.558, lambdaRaw: -4.25763406562e-6, lambda: -4.2577e-6 }),
    h1e11: Object.freeze({ idx: 357948684672, lambdaRaw: -1.34528879889e-5, lambda: -1.3453e-5 }),
    h1e12: Object.freeze({ idx: 3945951728824, lambdaRaw: -7.56759980552e-6, lambda: -7.5676e-6 }),
    h1e13: Object.freeze({ idx: 43124192401285, gamma: 10000000023298.98298, lambdaRaw: -4.94064427858e-6, lambda: -4.9407e-6 }),
    zSignChecks: '15/15 alternating',
  }),
  odlyzko: Object.freeze({ idx: 420891, gamma: 273193.66313771, gap: 5.7037e-3, lambdaRaw: -1.62670823669e-5, lambda: -1.6268e-5, grade: 'conditional (table accuracy)' }),
  record: Object.freeze({ sgd2011: -1.14541e-11, rodgersTao: 0 }),
  zeros: Object.freeze({ flintDistinct: 1551082, flintRawRows: 1855395, odlyzko: 1000000 }),
  smallGap: Object.freeze({
    s02: Object.freeze({ obs: 12834, gue: 13186, cue: 12782 }), s01: Object.freeze({ obs: 1570, gue: 1688, cue: 1634 }),
    odlyzkoObsOverGUE02: 0.819, odlyzkoCUEpred02: 0.83, perWindowSigmaVsCUE: Object.freeze([1.8, -1.3, 0.7, -0.3]),
  }),
  tailExponent: Object.freeze({ odl: 1.42, h1e10: 1.43, h1e11: 1.62, h1e12: 1.40, h1e13: 1.38, gue: 1.5 }),
  lehmerFraction: Object.freeze([0.062, 0.066]),
  sharpness: Object.freeze({ firstOrderQuantiles: Object.freeze([0.952, 0.962, 0.999]), trueCollisionRatio: Object.freeze([1.00001, 1.028]) }),
  projection: Object.freeze({ median1e13: -4.9e-11, pRecord: 0.076, zerosForMedian: 8.6e13, zerosPerCoreSecond: 112, coreHours: 2.1e8,
    odlyzko2000Percentile: Object.freeze({ zeros1e9: 0.12, zeros1p75e8: 0.023 }), grade: 'heuristic' }),

  refereeKilled: Object.freeze([
    'count: "1.95M zeros" matched neither file count — 1,551,082 distinct FLINT zeros (≈ 1.86M raw rows with chunk overlaps)',
    'wrong mechanism: Rodgers–Tao Λ ≥ 0 is NOT the N → ∞ limit of the Lehmer-pair mechanism; it is unconditional by a different argument (regular spacing forced if Λ < 0, contradicted by pair-correlation information); the Lehmer route would reach 0 only under unproved small-gap statistics',
    'unsourced premise: the Odlyzko-2000 "sanity check" assumed ≈ 1e9 zeros near index 1e20; the published set is ≈ 1.75e8, moving the percentile from ≈ 12–14% to ≈ 2.3% — reported as unverified, not a confirmation',
    'novelty: the CUE_Neff finite-height correction is Bogomolny–Bohigas–Leboeuf–Monastra (2006); this run is an independent replication at ≈ 3σ vs pure GUE; height dependence not resolved (per-window +1.8, −1.3, +0.7, −0.3σ); "matches to 0.4%" holds only at s < 0.2 (s < 0.1: 0.961 ± 0.025)',
    'rigor: 12-digit "certified" values rounded outward (Λ ≥ −4.2577e-6 etc.) because the neighbour sum in G is double precision with a 1e-12 margin',
    'evidence: "nearly sharp" compared λ_CSV with the first-order collision time; the referee confirmed it against the true collision time on polynomial flows (1.00001 at D²g = 0.011 to ≈ 1.027 at 0.57)',
  ]),
  nextStep: 'Optional and cheap; moves no bound: check the CSV statement and the SGD pair location against the primary papers; to test height '
    + 'dependence of the CUE_Neff correction, extend the 1e12–1e13 windows to ≈ 5e6 zeros each with isolation plus candidate-pair refinement '
    + '(≈ 3× faster), taking the GUE test from 3σ to ≈ 10σ.',
  files: Object.freeze(['tmp/routes-b6-r22-lehmer/chainref.c', 'tmp/routes-b6-r22-lehmer/chainref2.c', 'tmp/routes-b6-r22-lehmer/lehmer.py',
    'tmp/routes-b6-r22-lehmer/check.py', 'tmp/routes-b6-r22-lehmer/zcheck.c', 'tmp/routes-b6-r22-lehmer/summarize.py', 'tmp/routes-b6-r22-lehmer/summary.json',
    'tmp/routes-b6-r22-lehmer/result_h1e10.json', 'tmp/routes-b6-r22-lehmer/result_h1e13.json', 'tmp/routes-b6-ref22-indep/']),
  verdict: 'Route 22 cannot produce a competitive or new Λ lower bound: best certified local bound −4.2577e-6 (assuming FLINT/Arb, CSV quoted '
    + 'from memory and re-derived), reach falling like N^{−2/3}, and Rodgers–Tao (Λ ≥ 0, by a different argument) has closed this side. What '
    + 'the run adds is measurement: an independent ≈ 3σ replication of the Bogomolny et al. CUE_Neff finite-height small-gap correction, and '
    + 'near-sharpness of the CSV comparison for close pairs. Lower-bound side only. No refereed bound is changed; RH open; NO QED.',
});

const R = ROUTE_22;
const lambdaCSV = (D, G) => ((1 - 1.25 * D * D * G) ** 0.8 - 1) / (2 * G);
// GUE spacing density p(s) = (π²/3)s² − (2π⁴/45)s⁴ + (π⁶/315)s⁶ + …, integrated term by term
const gueCDF = (e) => ((PI ** 2) / 9) * e ** 3 - ((2 * PI ** 4) / 225) * e ** 5 + ((PI ** 6) / 2205) * e ** 7;

export const ROUTE_22_ASSERTIONS = Object.freeze([
  {
    id: 'r22-csv-1e10-pair',
    holds: () => { const c = R.certified.h1e10; const l = lambdaCSV(c.gap, c.Grig); const l2 = lambdaCSV(c.gap, 2 * c.Grig); const l0 = -(c.gap ** 2) / 2;
      return abs(l - c.lambdaRaw) < 1e-12 && c.gap ** 2 * c.Grig < 0.8 && abs(c.gap ** 2 * c.Grig - 4.7e-4) < 1e-5
        && abs(l2 / l - 1) < 1e-4 && abs(l0 / l - 1) < 1e-4 && l < l0; },
    why: 'D = 2.918006925e-3, G = 55.558: D²G = 4.73e-4 < 4/5 and λ = −4.257634e-6; doubling G moves λ by < 1e-4 relative; the two-zero limit −D²/2 is within 1e-4 and λ ≤ −D²/2 (monotone in G).',
  },
  {
    id: 'r22-outward-rounding',
    holds: () => [...Object.values(R.certified).filter((v) => typeof v === 'object'), R.odlyzko].every((c) => c.lambda <= c.lambdaRaw && abs(c.lambda / c.lambdaRaw - 1) < 1e-4)
      && R.certified.h1e10.lambda === -4.2577e-6,
    why: 'Every quoted bound is rounded outward (more negative) from the 12-digit value, at ≈ 5 significant digits.',
  },
  {
    id: 'r22-gap-to-record',
    holds: () => { const r = -R.certified.h1e10.lambdaRaw / -R.record.sgd2011; const best = Math.max(...Object.values(R.certified).filter((v) => typeof v === 'object').map((c) => c.lambda));
      return abs(r / 3.7e5 - 1) < 0.01 && best === R.certified.h1e10.lambda && best < R.record.sgd2011 && R.record.rodgersTao === 0; },
    why: '4.2576e-6 / 1.14541e-11 ≈ 3.72e5; the 1e10 pair is the best of the four FLINT windows; all are below the SGD record and Rodgers–Tao Λ ≥ 0.',
  },
  {
    id: 'r22-gue-small-gap-counts',
    holds: () => { const n = R.zeros.flintDistinct; return abs(gueCDF(0.2) * n / R.smallGap.s02.gue - 1) < 1e-3 && abs(gueCDF(0.1) * n / R.smallGap.s01.gue - 1) < 1e-3; },
    why: 'Term-by-term integral of the GUE spacing density times 1,551,082 zeros: 13186.5 at s < 0.2 and 1687.6 at s < 0.1, the GUE counts used.',
  },
  {
    id: 'r22-zscores',
    holds: () => { const a = R.smallGap.s02; const b = R.smallGap.s01; const zG = (a.obs - a.gue) / sqrt(a.gue); const zC = (a.obs - a.cue) / sqrt(a.cue);
      const zC1 = (b.obs - b.cue) / sqrt(b.cue);
      return abs(a.obs / a.gue - 0.9733) < 5e-4 && abs(zG + 3.07) < 0.02 && abs(a.obs / a.cue - 1.004) < 1e-3 && abs(zC) < 0.6
        && abs(b.obs / b.cue - 0.961) < 1e-3 && abs(zC1 + 1.58) < 0.03 && R.smallGap.perWindowSigmaVsCUE.some((x) => x > 0) && R.smallGap.perWindowSigmaVsCUE.some((x) => x < 0); },
    why: 's < 0.2: obs/GUE 0.9733 (−3.07σ), obs/CUE_Neff 1.004 (+0.46σ); s < 0.1: obs/CUE_Neff 0.961 (−1.58σ); per-window deviations of both signs (height dependence not resolved).',
  },
  {
    id: 'r22-projection-arithmetic',
    holds: () => { const p = R.projection; return abs(p.zerosForMedian / p.zerosPerCoreSecond / 3600 / p.coreHours - 1) < 0.03 && p.pRecord < 0.1 && p.median1e13 < R.record.sgd2011
      && p.odlyzko2000Percentile.zeros1p75e8 < p.odlyzko2000Percentile.zeros1e9 && p.grade === 'heuristic'; },
    why: '8.6e13 zeros at 112 zeros/core-s ≈ 2.13e8 core-hours; projection is heuristic; the Odlyzko-2000 percentile falls to ≈ 2.3% at the published 1.75e8-zero count.',
  },
  {
    id: 'r22-honest-scope',
    holds: () => R.status === 'done' && /different argument/.test(R.verdict) && /replication/.test(R.verdict) && /refereed bound is changed/i.test(R.verdict)
      && /NO QED/.test(R.verdict) && R.zeros.flintDistinct === 1551082 && !/1\.95M/.test(R.headline),
    why: 'Zero count corrected; Rodgers–Tao mechanism corrected; replication not a new law; lower-bound side only; no QED.',
  },
]);

export default ROUTE_22;
