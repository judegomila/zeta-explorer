/**
 * @fileoverview route-17-mollifiers-beyond-four-sevenths-2026-10-10 — roadmap route 17 (batch 5): numerical sanity of mollifier
 * lengths θ > 4/7 (twisted second moment) at computable heights, and the conditional one-piece Conrey κ(θ) table.
 * One run plus one adversarial internal referee pass (not refuted; severity minor); the referee corrections are applied below.
 *
 * PROVED: nothing new. Literature only: Conrey's functional c(P, Q, R, θ) and κ ≥ 1 − log(c)/R are theorems for θ < 4/7 (Conrey 1989,
 *  Deshouillers–Iwaniec); the "θ = 4/7" row is the limit θ → 4/7−.
 * CERTIFIED: nothing. ζ values come from Arb (python-flint acb.zeta) but ball midpoints feed a Monte-Carlo average: statistical measurements.
 * CONDITIONAL (twisted second moment at length θ; Farmer's θ-conjecture covers every θ, so 4/7 < θ < 1 is as conditional as θ ≥ 1):
 *  one-piece κ with P deg 6, Q deg 7, R optimised (table below; referee's independent optimiser reproduces every row to 7 digits and
 *  extra degrees move κ ≤ 5e-7). One piece passes PRZZ 0.417294 at θ = 0.58621, 5/12 at 0.58508, 1/2 at 0.75515, 2/3 at 1.31084, the
 *  Alpöge–Furman ψMT value 0.6725 at 1.33926. dκ/dθ = 0.5707 at 4/7, 0.4661 at 0.7, 0.3036 at 1.0.
 * MEASURED: mean of |Vψ(σ0 + it)|² over [T, 2T] from actual ζ values vs the full finite-T recipe main term M_T (all lower-order terms,
 *  exact gcd / Jordan-totient sieve, 2-D Taylor jets for Q). Across 55 (θ, T) configurations on 4 single-seed sample sets (θ up to
 *  2.0 at T = 1e3, 1.5 at 1e4, 1.2 at 1e5, 1.0 at 1e6; y ≤ 1e6): max |z| 1.55, max |direct/M_T − 1| 0.52%, mean +0.02%. Deviations are
 *  correlated across θ at a given T (same samples), so this is about 4 independent comparisons; the test sees off-diagonal terms of
 *  ≈ 1% of the main term or more, not smaller. M_T/c = 0.845 … 0.936 (T = 1e3 … 1e10) at 4/7; finite-T "κ" values sit 0.07–0.13 above
 *  the asymptotic ones; with the zero count folded in (ρ = LT/(2πN)) the 4/7 value is 0.414 / 0.428 / 0.436 / 0.431. Jensen loses a lot:
 *  κ with/without Jensen 0.4903 / 0.8578 (4/7, 1e6), 0.6587 / 0.9434 (θ = 1). Mollifier alone: mean |ψ|² / diagonal ∈ [0.992, 1.011].
 * HEURISTIC: reading the agreement as support for Farmer's θ = ∞ conjecture (at L = 6.9–13.8 a power-decaying off-diagonal term could
 *  hide); finite-T κ values are not bounds (O(1/L) Levinson losses omitted).
 *
 * Referee kill: the "recipe failure at small T" (θ = 0.4, T = 1e3: M_T = −0.462 vs direct 3.083 ± 0.024) was a code bug — the r-series
 * for the e-derivatives of log(1 − p^{−1−δ}) was truncated at r < 80 (r17lib.recipe_main_term); at δ = −2R/L = −0.55 (p = 2) the order-14
 * coefficients had not converged. With r ≤ 400 the route's own code gives 3.074282; an independent 2-D Cauchy evaluation of the whole
 * recipe gives 3.074282 (z ≈ 0.4). The same bug corrupted mainterm.json at θ = 0.3, T = 1e4 (1.039 → 6.8879) and θ = 0.5, T = 1e3
 * (2.111709 → 2.112094, 1.8e-4). The "Q operator amplifies recipe errors" explanation is withdrawn.
 *
 * No Λ bound moves; no proof input supplied (the barrier is still the Deshouillers–Iwaniec Kloosterman bound behind 4/7).
 * PT Lambda <= 0.2 stands; RH open; NO QED. Import-free. ROUTE_17_ASSERTIONS recompute κ = 1 − log(c)/R, the implied R consistency,
 * the zero-count ratios ρ, the θ-reach per T, interpolated thresholds, the corrected θ = 0.4 z-score and the M_T/c ratios live.
 */

const { log, abs, PI } = Math;

const K = (theta, kappa, R = null) => Object.freeze({ theta, kappa, R });

export const ROUTE_17 = Object.freeze({
  id: 'route-17-mollifiers-beyond-four-sevenths-2026-10-10',
  route: 17,
  date: '2026-10-10',
  title: 'Route 17: mollifiers beyond θ = 4/7 — conditional κ(θ) table and finite-T main-term agreement to θ = 2',
  status: 'done',
  headline: 'Conditional on the twisted second moment at length θ, the one-piece Conrey method gives κ = 0.4249 (θ = 0.6) … 0.5884 (1.0) … 0.7703 (2.0). '
    + 'At T = 1e3–1e6 the mollified mean square from actual ζ values matches the full finite-T recipe main term within 0.52% across 55 (θ, T) configurations '
    + 'on 4 single-seed sample sets (θ up to 2.0 at T = 1e3), with no visible off-diagonal main term at the ≈ 1% level. Nothing here helps a proof.',

  kappaTable: Object.freeze([
    K(0.5, 0.365815), K(4 / 7, 0.408959), K(0.6, 0.424899, 1.2332), K(0.625, 0.438266), K(0.65, 0.451114), K(0.675, 0.463467),
    K(0.7, 0.475348, 1.0731), K(0.75, 0.497784), K(0.8, 0.518591), K(0.85, 0.537924), K(0.9, 0.555923), K(1.0, 0.588407, 0.7994),
    K(1.2, 0.642040), K(1.5, 0.702345), K(1.75, 0.740167), K(2.0, 0.770268),
  ]),
  newRows: Object.freeze([0.625, 0.65, 0.675, 0.85, 1.75]),
  literature: Object.freeze({ conrey1983: 0.3658, conrey1989: 0.4088, przz: 0.417294, multiPieceGains1989to2020: 0.0083 }),
  thresholds: Object.freeze({ przz: 0.58621, fiveTwelfths: 0.58508, k045: 0.64779, half: 0.75515, twoThirds: 1.31084, afMT: 1.33926 }),
  slopes: Object.freeze([[4 / 7, 0.5707], [0.7, 0.4661], [1.0, 0.3036]]),

  finiteT: Object.freeze({
    configs: 55, sampleSets: 4, maxAbsZ: 1.55, maxRel: 0.005187, meanRel: 0.00022, sePerPoint: Object.freeze([0.002, 0.005]),
    maxThetaByT: Object.freeze({ 1e3: 2.0, 1e4: 1.5, 1e5: 1.2, 1e6: 1.0 }), yMax: 1e6,
    rows: Object.freeze([
      Object.freeze({ theta: 2.0, T: 1e3, direct: 1.0750, se: 0.0016, MT: 1.0748 }),
      Object.freeze({ theta: 1.75, T: 1e3, direct: 1.0958, se: 0.0016, MT: 1.0956 }),
      Object.freeze({ theta: 1.5, T: 1e4, direct: 1.1396, se: 0.0019, MT: 1.1373 }),
      Object.freeze({ theta: 1.0, T: 1e6, direct: 1.3136, se: 0.0035, MT: 1.3133, c: 1.3896, kappaJensen: 0.6587, kappaNoJensen: 0.9434 }),
      Object.freeze({ theta: 4 / 7, T: 1e6, direct: 1.9314, se: 0.0074, MT: 1.9310, c: 2.1455, kappaJensen: 0.4903, kappaNoJensen: 0.8578 }),
    ]),
    mtOverC47: Object.freeze([[1e3, 0.845], [1e4, 0.866], [1e5, 0.885], [1e6, 0.900], [1e10, 0.936]]),
    zeroCounts: Object.freeze([[1e3, 868, 1.267], [1e4, 12349, 1.187], [1e5, 160131, 1.144]]),
    kappaZeroNormalised47: Object.freeze([0.414, 0.428, 0.436, 0.431]),
    psiOverDiag: Object.freeze([0.992, 1.011]),
  }),
  theta04: Object.freeze({ T: 1e3, direct: 3.083, se: 0.024, MTreported: -0.462, MTcorrected: 3.074282, rrTruncation: 80, rrFixed: 400,
    otherCorrupted: Object.freeze([Object.freeze({ theta: 0.3, T: 1e4, stored: 1.039, correct: 6.8879 }), Object.freeze({ theta: 0.5, T: 1e3, stored: 2.111709, correct: 2.112094 })]) }),

  refereeKilled: Object.freeze([
    'REFUTED: "the recipe fails where Q has large coefficients and T is small" (θ = 0.4, T = 1e3, M_T = −0.462) — a truncation bug (r < 80 in the e-derivative series of log(1 − p^{−1−δ})); corrected M_T = 3.074282 agrees with direct 3.083 ± 0.024 (z ≈ 0.4); the Q-amplification explanation is withdrawn',
    'the same bug corrupts mainterm.json at θ = 0.3, T = 1e4 (1.039 → 6.8879) and θ = 0.5, T = 1e3 (2.111709 → 2.112094); the "≈ 1% bracket" of the 1/L extrapolation holds only for θ ≥ 0.5 (0.2–0.8%)',
    '55 configurations are ≈ 4 independent comparisons (one seed per T, all θ on the same samples); "every θ from 0.5 to 2.0 and T from 1e3 to 1e6" overstated: θ = 2.0 only at 1e3, 1.5 only at ≤ 1e4, ≤ 1.0 at 1e6',
    'detection power: per-point SE 0.2–0.5% hides any off-diagonal term below ≈ 1% of the main term',
    'wording: "cluster-bootstrap" SEs are analytic cluster-mean SEs (a 400-replicate bootstrap agrees); 4/7 < θ < 1 is as conditional as θ ≥ 1',
    'comparing +0.016 per 0.03 θ (conditional) with +0.0083 multi-piece gains (proven) mixes tiers: arithmetic only, not a comparison of achievable levers',
  ]),
  nextStep: 'Close route 17 as a map item. Regenerate mainterm.json with r ≤ 400 (or tmp/routes-b5-ref17/routes-b5-ref17-mt-cauchy.py). Optional: a Feng/PRZZ '
    + 'two-piece mollifier at θ > 4/7 to price the conditional multi-piece gain, and a second T = 1e6 seed (≈ 25 min, 2 workers). The only real lever is a '
    + 'sums-of-Kloosterman-sums input pushing θ past 4/7 for μ*P coefficients (each +0.01 in θ ≈ +0.0057 in κ, conditional).',
  files: Object.freeze(['tmp/routes-b5-r17-mollifier/r17lib.py', 'tmp/routes-b5-r17-mollifier/r17_asymptotic.py', 'tmp/routes-b5-r17-mollifier/r17_direct.py',
    'tmp/routes-b5-r17-mollifier/r17_mainterm.py', 'tmp/routes-b5-r17-mollifier/r17_analyse.py', 'tmp/routes-b5-r17-mollifier/r17_thresholds.py',
    'tmp/routes-b5-r17-mollifier/asymptotic_optima.json', 'tmp/routes-b5-r17-mollifier/mainterm.json', 'tmp/routes-b5-r17-mollifier/analysis.json',
    'tmp/routes-b5-r17-mollifier/summary_stats.json', 'tmp/routes-b5-ref17/routes-b5-ref17-conrey.py', 'tmp/routes-b5-ref17/routes-b5-ref17-pointcheck.py',
    'tmp/routes-b5-ref17/routes-b5-ref17-mt-cauchy.py', 'tmp/routes-b5-ref17/routes-b5-ref17-rrfix.py', 'tmp/routes-b5-ref17/routes-b5-ref17-stats.py']),
  verdict: 'The twisted-second-moment main term holds up numerically past θ = 4/7: at T = 1e3–1e6 the mollified mean square agrees with the full finite-T '
    + 'recipe main term within 0.52% (max |z| 1.55; 55 configurations on 4 single-seed sample sets; sensitive to off-diagonal terms ≳ 1%), up to θ = 2 at T = 1e3. '
    + 'Conditional on the twisted moment (Farmer), one piece gives κ = 0.4249 at θ = 0.6, 0.5884 at 1.0, 0.7703 at 2.0, passes PRZZ at θ = 0.586 and needs '
    + 'θ = 1.339 for 0.6725. The reported small-T recipe failure was a series-truncation bug (corrected M_T = 3.074282 matches). Finite-T κ values are inflated '
    + 'by 0.07–0.13 by lower-order terms and are not evidence for asymptotic gains. No proof input; the barrier is the Kloosterman bound behind 4/7. '
    + 'PT Lambda <= 0.2 stands; RH open; NO QED.',
});

const R = ROUTE_17;
const kap = (th) => R.kappaTable.find((k) => abs(k.theta - th) < 1e-9);
const interp = (target) => { const t = R.kappaTable; for (let i = 1; i < t.length; i += 1) if (t[i].kappa >= target && t[i - 1].kappa < target)
  return t[i - 1].theta + (t[i].theta - t[i - 1].theta) * (target - t[i - 1].kappa) / (t[i].kappa - t[i - 1].kappa); return NaN; };

export const ROUTE_17_ASSERTIONS = Object.freeze([
  {
    id: 'r17-kappa-table-shape',
    holds: () => { const t = R.kappaTable; const inc = t.every((k, i) => i === 0 || k.kappa > t[i - 1].kappa);
      const slopes = t.slice(1).map((k, i) => (k.kappa - t[i].kappa) / (k.theta - t[i].theta));
      return inc && slopes.every((s, i) => i === 0 || s < slopes[i - 1] + 0.02) && abs(kap(0.5).kappa - R.literature.conrey1983) < 1e-4
        && abs(kap(4 / 7).kappa - R.literature.conrey1989) < 2e-4 && R.newRows.every((th) => kap(th)); },
    why: 'κ(θ) increasing and (up to rounding) concave; anchors 0.3658 (θ = 1/2) and 0.4088 (θ = 4/7, Conrey) reproduced; rows 0.625, 0.65, 0.675, 0.85, 1.75 are new.',
  },
  {
    id: 'r17-conrey-formula',
    holds: () => { const r = R.finiteT.rows; const t1 = r.find((x) => x.theta === 1.0); const t47 = r.find((x) => abs(x.theta - 4 / 7) < 1e-9);
      const R47 = log(t47.c) / (1 - kap(4 / 7).kappa); const R47J = log(t47.direct) / (1 - t47.kappaJensen);
      return abs(1 - log(t1.c) / kap(1.0).R - kap(1.0).kappa) < 2e-4 && abs(1 - log(t1.direct) / kap(1.0).R - t1.kappaJensen) < 1e-3
        && abs(R47 - R47J) < 2e-3 && t1.kappaNoJensen > t1.kappaJensen && t47.kappaNoJensen > t47.kappaJensen; },
    why: 'κ = 1 − log(c)/R: θ = 1, c = 1.3896, R = 0.7994 gives 0.5884; the direct mean 1.3136 gives the finite-T 0.6587; at 4/7 the asymptotic and finite-T rows imply the same R ≈ 1.2916; Jensen costs 0.29–0.37 in κ at T = 1e6.',
  },
  {
    id: 'r17-thresholds-interpolate',
    holds: () => abs(interp(R.literature.przz) - R.thresholds.przz) < 1e-3 && abs(interp(0.5) - R.thresholds.half) < 1e-3
      && abs(interp(0.45) - R.thresholds.k045) < 2e-3 && abs(interp(0.6725) - R.thresholds.afMT) < 0.02 && abs(interp(2 / 3) - R.thresholds.twoThirds) < 0.02
      && R.thresholds.fiveTwelfths < R.thresholds.przz && abs(R.slopes[0][1] * 0.01 - 0.0057) < 1e-4,
    why: 'Linear interpolation of the κ table reproduces the brentq thresholds: PRZZ 0.58621, 1/2 at 0.75515, 0.45 at 0.64779 (to 1e-3), 2/3 and 0.6725 at 1.31 / 1.34 (to 0.02, concavity); +0.01 θ ≈ +0.0057 κ at 4/7.',
  },
  {
    id: 'r17-theta-reach-and-zero-counts',
    holds: () => Object.entries(R.finiteT.maxThetaByT).every(([T, th]) => abs(log(R.finiteT.yMax) / log(Number(T)) - th) < 1e-9)
      && R.finiteT.zeroCounts.every(([T, N, rho]) => abs(log(T) * T / (2 * PI * N) - rho) < 1e-3),
    why: 'y ≤ 1e6 caps θ at log(1e6)/log T = 2.0 / 1.5 / 1.2 / 1.0 for T = 1e3 … 1e6; ρ = (log T)·T/(2πN) with N(T, 2T) = 868, 12349, 160131 from the Odlyzko ordinates gives 1.267, 1.187, 1.144.',
  },
  {
    id: 'r17-finite-T-agreement',
    holds: () => { const f = R.finiteT; return f.rows.every((x) => abs(x.direct - x.MT) / x.se <= f.maxAbsZ && abs(x.direct / x.MT - 1) <= f.maxRel)
      && f.mtOverC47.every(([, v], i) => i === 0 || v > f.mtOverC47[i - 1][1]) && abs(f.rows[4].MT / f.rows[4].c - 0.900) < 1e-3
      && abs(f.rows[3].MT / f.rows[3].c - 0.945) < 1e-3 && f.psiOverDiag[0] < 1 && f.psiOverDiag[1] > 1 && f.sampleSets === 4 && f.configs === 55; },
    why: 'Quoted rows (θ = 2.0, 1.75, 1.5, 1.0, 4/7) all within max |z| 1.55 and 0.52%; M_T/c rises 0.845 → 0.936 toward 1 at 4/7 (0.900 at 1e6; 0.945 at θ = 1); 55 configurations on 4 seeds.',
  },
  {
    id: 'r17-referee-truncation-bug',
    holds: () => { const q = R.theta04; const zOld = abs(q.direct - q.MTreported) / q.se; const zNew = abs(q.direct - q.MTcorrected) / q.se;
      return zOld > 100 && zNew < 1 && q.rrFixed >= 5 * q.rrTruncation && q.otherCorrupted.every((x) => x.correct !== x.stored)
        && /^REFUTED/.test(R.refereeKilled[0]); },
    why: 'θ = 0.4, T = 1e3: the reported M_T = −0.462 is 148σ off, the corrected 3.074282 is 0.36σ off; the failure was series truncation, not a recipe limit.',
  },
  {
    id: 'r17-honest-scope',
    holds: () => R.status === 'done' && /Conditional/.test(R.verdict) && /PT Lambda <= 0\.2 stands/.test(R.verdict) && /NO QED/.test(R.verdict)
      && /No proof input/.test(R.verdict) && /4 single-seed/.test(R.verdict),
    why: 'κ(θ > 4/7) conditional; finite-T agreement measured on 4 seeds; no proof input; no Λ change; no QED.',
  },
]);

export default ROUTE_17;
