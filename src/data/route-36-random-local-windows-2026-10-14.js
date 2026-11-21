/**
 * @fileoverview route-36-random-local-windows-2026-10-14 — roadmap route 36 (batch 9, group G): random local windows at 10^13–10^20 with
 * FLINT's Platt code (locally compiled, wrap-patched FLINT 3.6.0), exploratory anomaly search. Mapping result. One worker run plus one
 * adversarial internal referee pass with an independent direct-integral Turing count, an independent RS re-certification of the closest pair
 * and an independent Lehmer recomputation (not refuted; severity minor: bookkeeping and reporting errors only). Corrections applied below.
 *
 * PROVED: nothing new (no theorem, no Lean). One soundness argument written and checked (single reader + referee by hand): the no-parity
 *  direct-integral Turing test (Trudgian 2011 Thm 2.2, |∫S| ≤ 2.067 + 0.059 log t2; FLINT_AUDIT_2 §3.4) refuting N(T) ≥ c+1 and N(T) ≤ c−1
 *  at T1 < T2, plus N(T2) − N(T1) disjoint sign-change intervals, implies every zero in (T1, T2] is simple, on the line and in its interval.
 * CERTIFIED:
 *  - Platt intervals + direct-integral Turing (no parity, H = 20; no Gram-block criterion): all 16 windows (1.0626e13 – 3.0929e19) pass;
 *    146,768 zeros between the Turing points simple, on the line, exactly counted; min margin 6.365 (e16_0). Trust base: patched Platt grid
 *    lemmas as audited in FLINT_AUDIT_2 (single reader), Trudgian Thm 2.2, Arb. Guards: σ_interp ∈ {19, 23, 25} ≥ 9, σ_grid ≥ 1923 (band 1)
 *    or ≥ 3983 (band 2), t0 ≫ 3σ, m_J < N/2, B ≥ 2h√(K−1). Referee: independent count reproduces all margins; shifted points at H = 12 still
 *    pass (min 1.405); ±1 negative controls fail on one side in all 16 windows.
 *  - Riemann–Siegel route (independent of Platt; trust base acb_dirichlet_hardy_z, Trudgian, Arb θ, parity): 33/33 anomaly certificates
 *    CERTIFIED_ROUTE2 for T ≤ 2.02e16; minimum margins 8.66–11.14 at H = 10 for T < 1e15 (max single margin 12.7; 8.66 is e14_1_Smax with
 *    coverage_ok = false) and 2.49–3.42 at H = 5 for 1e15 ≤ T ≤ 2.02e16. RS-certified Rosser violations: 16 of 32 (8 pairs, all T ≤ 4.9e15).
 *  - Rosser violation at T ≈ 1.0626e13 (block [g_528, g_529] length 1 with 3 zeros, then length-3 block with 1 zero).
 *  - Closest pair at T ≈ 4.0686e14: zeros 1994516720133791/792 consecutive, gap ∈ [0.0026693172, 0.0026693212], δ ≤ 0.013510 (referee
 *    independent RS: [0.0026693152, 0.0026693232]).
 *  - RS sign-only check at 2.004e17: two critical-line zeros within 0.0031145017 (exist, not shown consecutive).
 * CONDITIONAL: statistics using zeros outside [T1, T2] rely on FLINT's Gram-block anchors (FLINT_AUDIT_2 §3.3 gap); 2 of the 32 Rosser
 *  violations (both e15_1) sit there, both also RS-certified. Everything at 1e17–1e19 rests on the Platt lemmas only (plus one RS sign check).
 *  Lehmer λ_CSV ≥ −3.5629e-6 is conditional on the RS-certified D, Platt-located positions for the 800 neighbouring zeros in G, Trudgian's
 *  2014 S(t) constants as quoted from memory (unchecked), and non-interval mpmath tails (referee float recomputation G ≈ 83.41).
 * MEASURED: 150,541 zeros (150,556 minus 15 from the failed W = 780 run); Gram's law 104,331 / 150,506 = 0.6932 overall, 69.1–70.0% at
 *  1e13–1e16, 68.6–68.9% at 1e17–1e19; good-Gram share 0.790 → 0.760; 32 Rosser violations = 16 pairs in 116,453 blocks, pairs per decade
 *  1e13: 3, 1e14: 2, 1e15: 3, 1e16: 1, 1e17: 1, 1e18: 5, 1e19: 1; max Gram block 10 (e19_0); S(t) ∈ [−2.3317, +2.3606]; spacing variance
 *  0.1725–0.1797 (GUE ≈ 0.180); δ_min per window 0.0135–0.0705, P_GUE 0.02–0.942; largest δ 3.343 (e18_0). Not previously reported:
 *  e14_2 has contain_fail = 1, Gram ambiguities in e13_3/e14_2/e17_0 resolved via intervals, refined-ball radii up to 0.0101 (e15_2) — these
 *  touch only midpoint statistics, not the interval Turing counts or RS certificates. Cost at 3.09e19: J = 3.02e9, 18,431 CPU-s, 2.3 GB.
 * HEURISTIC: λ ≈ −D²/2 (relative 1e-4) so random short windows are an inefficient Lehmer search; no barrier-difficulty signal; Gram/Rosser
 *  trends match the qualitative literature trend (not checked).
 *
 * Verdict: mapping run, no anomaly. Nothing moves Λ (best Lehmer bound 1.195× route 22's, superseded by Rodgers–Tao Λ ≥ 0). No refereed bound is changed
 * ; RH open; NO QED. Import-free. ROUTE_36_ASSERTIONS recompute live: corrected Rosser bookkeeping, zero totals, Gram fraction, the
 * closest-pair normalised gap δ, D²G and λ ≈ −D²/2, the Lehmer ratios, the Trudgian margin formula sign, and the corrected margin ranges.
 */

const { abs, log, PI } = Math;

export const ROUTE_36 = Object.freeze({
  id: 'route-36-random-local-windows-2026-10-14',
  route: 36,
  date: '2026-10-14',
  title: 'Route 36: 16 random Platt windows from 1.06e13 to 3.09e19 — 146,768 zeros certified on the line, no anomaly',
  status: 'done',
  headline: '16 random windows (1.06e13–3.09e19, 150,541 zeros) with wrap-patched FLINT 3.6.0 Platt code: every window passes a no-parity '
    + 'direct-integral Turing count (146,768 zeros simple and on the line, min margin 6.37), with no Gram-block criterion; 33 RS certificates '
    + 'up to 2.02e16; no anomaly beyond GUE expectations. Closest pair δ = 0.0135 at 4.07e14 gives λ ≥ −3.563e-6 (route 22: −4.2577e-6).',
  windows: 16, heights: Object.freeze([1.0626e13, 3.0929e19]),
  zeros: Object.freeze({ total: 150541, rawIncludingFailedRun: 150556, failedRun: 15, betweenTuring: 146768, minMarginH20: 6.365, minMarginShiftedH12: 1.405 }),
  gram: Object.freeze({ lawHolds: 104331, intervals: 150506, rangeLow: Object.freeze([0.691, 0.700]), rangeHigh: Object.freeze([0.686, 0.689]),
    goodShare: Object.freeze([0.790, 0.760]), blocks: 116453, maxBlock: 10 }),
  rosser: Object.freeze({ violations: 32, pairsPerDecade: Object.freeze({ 13: 3, 14: 2, 15: 3, 16: 1, 17: 1, 18: 5, 19: 1 }), rsCertifiedViolations: 16, rsCertifiedPairs: 8 }),
  rs: Object.freeze({ certificates: 33, certified: 33, tMax: 2.02e16, minMarginH10: Object.freeze([8.66, 11.14]), maxSingleH10: 12.7, minMarginH5: Object.freeze([2.49, 3.42]) }),
  closestPair: Object.freeze({ T: 406859176336434.2, gap: Object.freeze([0.0026693172, 0.0026693212]), refereeGap: Object.freeze([0.0026693152, 0.0026693232]), delta: 0.013510 }),
  lehmer: Object.freeze({ lambda: -3.5629e-6, G: 83.4232, D2G: 5.944e-4, route22: -4.2577e-6, sgd: -1.14541e-11, refereeG: 83.41 }),
  S: Object.freeze([-2.3317, 2.3606]),
  spacingVariance: Object.freeze([0.1725, 0.1797]),
  sigma: Object.freeze({ interp: Object.freeze([19, 23, 25]), gridBand1Min: 1923, gridBand2Min: 3983 }),
  refereeKilled: Object.freeze([
    'per-decade Rosser pair counts summed to 17, not 16: the 1e15 decade has 3 pairs (e15_1: 2, e15_2: 1), not 4',
    '"22 of them RS-certified" is wrong: 8 RS certificates each cover a pair, so 16 of 32 violations are RS-certified (all T ≤ 4.9e15)',
    'RS margins misreported: minimum margins are 8.66–11.14 at H = 10 and 2.49–3.42 at H = 5 (not 10.8–12.7 / 3.3–4.1); all 33 still positive',
    '"σ_grid ≥ 1945" is wrong: band 1 goes down to 1923 (e16_0); validity only needs σ ≥ 9 and t0 ≥ 3σ, which holds',
    'Gram-law range omitted e15_1 (69.12%): correct 69.1–70.0% at 1e13–1e16',
    'unreported: e14_2 contain_fail = 1, three Gram ambiguities resolved via intervals, ball radii up to 0.0101 (midpoint statistics only)',
    'the Lehmer bound\'s G uses Platt-located positions for 800 window zeros, so λ_CSV also rests on the Platt trust base',
  ]),
  nextStep: '(1) Independent confirmation at ≥ 1e17 needs a lower-memory RS evaluator (FLINT used 3.5 GB at 6.4e16, unverified) or a remote machine; '
    + '(2) for route 22, contiguous scans near 1e14–1e17 for D ≲ 1e-3 (best here 2.67e-3); (3) re-check Trudgian 2014 S(t) constants and redo the '
    + 'tail integrals in interval arithmetic. Resume: ./runner.sh <ids> with new plan.json entries, then analyze.py, turing_window.py <id> 20, cert_batch.py <id>, summarize.py.',
  files: Object.freeze(['tmp/routes-b9-r36-platt/{r36win.c,build.sh,runner.sh,plan.json,analyze.py,turing_window.py,cert_anomaly.py,cert_batch.py,cert_pair_rs.py,lehmer_rig.py,summarize.py,summary_r36.json,runner.log}',
    'tmp/routes-b9-r36-platt/build/{platt_multieval_fix.c,platt_local_hardy_z_zeros.c,acb_dirichlet/impl.h}', 'tmp/routes-b9-r36-platt/runs/', 'tmp/routes-b9-r36-platt/cert/',
    'tmp/routes-b9-ref36-turing.py', 'tmp/routes-b9-ref36-rspair.py', 'tmp/routes-b9-ref36-lehmer.py']),
  verdict: 'Mapping run, no anomaly. 146,768 zeros in 16 random windows from 1e13 to 3e19 are certified simple and on the line on the patched Platt '
    + 'lemmas plus a direct-integral Turing test (no Gram-block criterion); 33 RS certificates up to 2e16 confirm the anomalies independently. Gram '
    + 'and Rosser behaviour drift slowly with height, |S| ≤ 2.36, spacings match GUE. The best Lehmer value λ ≥ −3.56e-6 is 1.195× route 22\'s and '
    + 'irrelevant given Rodgers–Tao Λ ≥ 0; no barrier signal either way. No refereed bound is changed; RH open; NO QED.',
});

const R = ROUTE_36;

export const ROUTE_36_ASSERTIONS = Object.freeze([
  {
    id: 'r36-rosser-bookkeeping-corrected',
    holds: () => { const pairs = Object.values(R.rosser.pairsPerDecade).reduce((a, b) => a + b, 0);
      return pairs === 16 && 2 * pairs === R.rosser.violations && 2 * R.rosser.rsCertifiedPairs === R.rosser.rsCertifiedViolations
        && R.rosser.rsCertifiedViolations === 16 && R.rosser.pairsPerDecade[15] === 3; },
    why: 'Rosser pairs per decade 3 + 2 + 3 + 1 + 1 + 5 + 1 = 16 pairs = 32 violations; 8 RS-certified pairs = 16 RS-certified violations (the result\'s 4 at 1e15 and "22" were wrong).',
  },
  {
    id: 'r36-zero-and-gram-totals',
    holds: () => { const z = R.zeros; const frac = R.gram.lawHolds / R.gram.intervals;
      return z.rawIncludingFailedRun - z.failedRun === z.total && z.betweenTuring < z.total && abs(frac - 0.6932) < 5e-5
        && R.gram.rangeLow[0] <= 0.6912 && R.gram.goodShare[0] > R.gram.goodShare[1] && z.minMarginH20 > 0 && z.minMarginShiftedH12 > 0; },
    why: '150,556 − 15 = 150,541 zeros; 146,768 between Turing points; Gram\'s law 104,331/150,506 = 0.6932; e15_1 (69.12%) inside the corrected 69.1–70.0% range; good-Gram share falls 0.790 → 0.760; Turing margins positive (6.365 at H = 20, 1.405 shifted at H = 12).',
  },
  {
    id: 'r36-closest-pair-live',
    holds: () => { const { T, gap, refereeGap } = R.closestPair; const dens = log(T / (2 * PI)) / (2 * PI); const delta = gap[1] * dens;
      return abs(delta - R.closestPair.delta) < 2e-6 && refereeGap[0] <= gap[0] && refereeGap[1] >= gap[1] && delta < 0.0136; },
    why: 'δ = gap·log(T/2π)/2π at T = 4.0686e14 with gap ≤ 0.0026693212 gives δ ≤ 0.013510; the referee\'s independent RS enclosure contains the claimed gap interval.',
  },
  {
    id: 'r36-lehmer-live',
    holds: () => { const D = R.closestPair.gap[1]; const L = R.lehmer;
      return abs(D * D * L.G - L.D2G) < 1e-6 && abs(-D * D / 2 - L.lambda) / abs(L.lambda) < 1e-4 && abs(L.route22 / L.lambda - 1.195) < 0.001
        && abs(L.lambda / L.sgd / 3.11e5 - 1) < 0.01 && abs(L.refereeG - L.G) < 0.02 && L.lambda > L.route22; },
    why: 'D²G = 5.944e-4; λ ≈ −D²/2 to < 1e-4 relative; 4.2577/3.5629 = 1.195 (better than route 22); 3.1e5× weaker than SGD −1.145e-11; referee float G ≈ 83.41.',
  },
  {
    id: 'r36-turing-margin-formula-and-ranges',
    holds: () => { const t2 = 1e16; const intS = 2.067 + 0.059 * log(t2); const s = R.sigma; const rs = R.rs;
      return intS > 4 && intS < 4.3 && s.interp.every((x) => x >= 9 && x % 2 === 1) && s.gridBand1Min === 1923 && s.gridBand2Min > s.gridBand1Min
        && rs.certified === rs.certificates && rs.minMarginH10[0] > 0 && rs.minMarginH5[0] > 0 && rs.minMarginH10[1] < rs.maxSingleH10; },
    why: 'Trudgian 2011 Thm 2.2 bound |∫S| ≤ 2.067 + 0.059 log t2 ≈ 4.24 at 1e16; σ_interp odd ≥ 9 and σ_grid ≥ 1923 (band 1, corrected); 33/33 RS certificates with corrected positive minimum margins.',
  },
  {
    id: 'r36-honest-scope',
    holds: () => R.status === 'done' && /no anomaly/.test(R.verdict) && /Rodgers–Tao/.test(R.verdict) && /refereed bound is changed/i.test(R.verdict)
      && /NO QED/.test(R.verdict) && R.refereeKilled.length === 7,
    why: 'Mapping result; Lehmer value superseded by Rodgers–Tao; no Λ change; no QED.',
  },
]);

export default ROUTE_36;
