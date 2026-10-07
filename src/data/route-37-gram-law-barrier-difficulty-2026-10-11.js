/**
 * @fileoverview route-37-gram-law-barrier-difficulty-2026-10-11 — roadmap route 37 (batch 6): Gram-law violation statistics as a model of
 * barrier and route-P certificate difficulty at large height. One run plus one adversarial internal referee pass (not refuted; severity
 * minor); the referee corrections are applied below.
 *
 * PROVED (structural, by definition): the binding route-P inputs, the P47 late-cell floors (e.g. cells 417–424, 0.88|sharp), are suprema
 *  of the leading-order model over the Bohr–Jessen/Kronecker torus with every prime phase free; they carry no height coordinate, so no
 *  finite-height statistic (Gram density included) can predict their tightness. Route P depends on height only through global inputs (PT
 *  height, Lemma H2 range) — the run's headline "route P has no height variable at all" is scoped to the late-cell floors by the referee.
 * CERTIFIED (assuming FLINT 3.6 correct; Platt grid + Turing anchors, audited code path): 34 windows, heights 1e8–3e13, 451,291
 *  consecutive Gram points with exact indices, 0 index gaps, deficit = excess blocks in every job (the "sign/parity check" is circular by
 *  construction and is not counted as validation). Gram-law fraction / bad-Gram rate: 1e8 0.7292/0.1715; 1e9 0.7208/0.1790; 1e10
 *  0.7142/0.1886; 1e11 0.7083/0.1973; 1e12 0.7054/0.2044; 3e12–6e12 0.7022/0.2083; 1.5e13–3e13 0.7007/0.2112. Rosser-rule violations:
 *  18 deficit blocks (0 at 1e8–1e10; 1 each at 1e11 and 1e12; 7 in 112,317 blocks at 3e12–6e12; 9 in 157,209 at 1.5e13–3e13); 14 have the
 *  shape [0,0] and 4 the shape [0,1,0]; surplus neighbours are [3], [2,2] or [2,1,2]. The ≥ 3e12 rates are "near selected sites" (windows
 *  of ±700 to ±2500 around proxy-selected Euler-product peaks), not random heights. The 10X′ barrier window overlaps the empty double Gram
 *  interval of a Rosser violation (block at Gram index 134618070142058); raw max|Z| there is 264.2 (≈ 45× the Gram-point RMS of Z).
 *  Referee cross-check: 155 Gram intervals at 1e11, 1e12, 3e13 recomputed via the public FLINT API, 0 mismatches; mpmath siegelz scans
 *  reproduce the 1e11 and 1e12 event patterns; hook Z values match siegelz / hardy_z to 7 digits at 1e11, 1e12, 3e13.
 * CONDITIONAL: the barrier statements use the proxy minA03 (first-order |f_0| on the bottom edge, y0 = 0.03) and the route-38 refine values as
 *  ground truth; the flow part (t ≤ 0.16125) enters only through the 27 refine minima Dall.
 * MEASURED: proxy vs barrier-code t = 0 bottom-edge min|f_0| (Dbot0): Spearman 0.979 (n = 27); vs the t = 0 contour minimum 0.70; vs the
 *  full flow minimum Dall: −0.106 (all 27) and −0.49 (p = 0.014, 24 selected) — for the easy selected sites the flow sets Dall at 0.64–0.86
 *  whatever the t = 0 proxy says, so the 13,730-window test measures t = 0 bottom-edge difficulty, not full certificate difficulty. Gram density
 *  vs proxy over 13,730 background windows: ρ = −0.18 (K = 2), −0.02 (10), −0.08 (50), +0.01 (250), −0.01 (1000); max|Z| +0.74, zero count
 *  −0.47 (referee rebuild over 13,100 windows reproduces these). bad10 AUC 0.645 for the hardest 10% and 0.671 for the easiest 10% (both tails).
 *  Selection: the 24 proxy-selected windows have mean bad10 0.66 vs 0.21 (Mann–Whitney p = 4e-18); 23/24 touch a bad Gram point vs base 0.59
 *  (binomial p ≈ 5.6e-5). Gram density vs Dall: |ρ| ≤ 0.31 over n = 27, ≤ 0.185 among the selected; one nominal hit (bad2 vs D0, p = 0.048)
 *  is not significant after ≈ 18 tests.
 * HEURISTIC: mechanism (large |Z| peaks push zeros out of Gram intervals and are where the selection puts barrier windows; close pairs make
 *  hard windows; both are Gram-irregular); exact-multiple controls 2X, 5X, 10X at the 89th–97th background bad10 percentile (n = 3, post hoc).
 *  Context only, not evidence: bad-Gram rate elasticity 0.0106 (between the 1e12 and 1.5e13–3e13 groups) vs barrier mesh cost 0.446/0.565.
 *
 * No Λ value changes. PT Lambda <= 0.2 stands; RH open; NO QED. Import-free. ROUTE_37_ASSERTIONS recompute live: the Rosser rates and their
 * exact (Garwood) Poisson 95% intervals, the event-shape tally, the binomial selection tail, the height elasticity between groups, the
 * 45× RMS ratio, monotone trends of the certified Gram table, and the rank-correlation bounds that carry the negative conclusion.
 */

const { abs, exp, log } = Math;

export const ROUTE_37 = Object.freeze({
  id: 'route-37-gram-law-barrier-difficulty-2026-10-11',
  route: 37,
  date: '2026-10-11',
  title: 'Route 37: Gram-law violations do not predict certificate difficulty — closed as a negative result',
  status: 'done',
  headline: 'Gram-violation density does not predict where the route-P binding P47 late-cell floors are tight (they are height-free torus '
    + 'suprema; route P depends on height only through global inputs), nor t = 0 bottom-edge barrier difficulty (proxy ↔ barrier code Spearman '
    + '0.98), nor the full flow minimum Dall (|ρ| ≤ 0.31). Local Gram irregularity points at both tails, and the easy proxy-selected barrier '
    + 'sites carry three times the background bad-Gram density.',

  gramTable: Object.freeze([ // [height label, log10 centre, Gram-law fraction, bad-Gram rate]
    ['1e8', 8, 0.7292, 0.1715], ['1e9', 9, 0.7208, 0.1790], ['1e10', 10, 0.7142, 0.1886], ['1e11', 11, 0.7083, 0.1973], ['1e12', 12, 0.7054, 0.2044],
    ['3e12-6e12', 12.628, 0.7022, 0.2083], ['1.5e13-3e13', 13.327, 0.7007, 0.2112],
  ]),
  gramPoints: 451291, windows: 34,
  rosser: Object.freeze({ events: Object.freeze({ '1e8': 0, '1e9': 0, '1e10': 0, '1e11': 1, '1e12': 1, '3e12-6e12': 7, '1.5e13-3e13': 9 }),
    blocks: Object.freeze({ '3e12-6e12': 112317, '1.5e13-3e13': 157209 }), shapes: Object.freeze({ '[0,0]': 14, '[0,1,0]': 4 }),
    ratePer1e4: Object.freeze({ '3e12-6e12': Object.freeze([0.62, 0.25, 1.28]), '1.5e13-3e13': Object.freeze([0.57, 0.26, 1.09]) }), sampling: 'near selected sites' }),
  x10sel: Object.freeze({ gramIndex: 134618070142058, rawMaxZ: 264.2, rmsRatio: 45 }),
  proxy: Object.freeze({ vsDbot0: 0.979, vsD0: 0.70, vsDallAll: -0.106, vsDallSelected: -0.495, vsDallSelectedP: 0.014, DallEasyRange: Object.freeze([0.64, 0.86]) }),
  background: Object.freeze({ windows: 13730, rhoByK: Object.freeze([[2, -0.18], [10, -0.02], [50, -0.08], [250, 0.01], [1000, -0.01]]), maxZ: 0.74, zeroCount: -0.47,
    aucHard: 0.645, aucEasy: 0.671 }),
  selection: Object.freeze({ n: 24, touch: 23, base: 0.59, bad10Selected: 0.66, bad10Background: 0.21, mannWhitneyP: 4e-18, binomP: 5.8e-5 }),
  vsDall: Object.freeze({ maxAbsRhoAll: 0.31, maxAbsRhoSelected: 0.185, nominalHit: Object.freeze({ test: 'bad2 vs D0', rho: -0.41, p: 0.048, tests: 18 }) }),
  elasticity: Object.freeze({ badRate: 0.0106, meshCost: Object.freeze([0.446, 0.565]), grade: 'context only' }),

  refereeKilled: Object.freeze([
    'factual: not every Rosser event is [0,0] next to [3] or [2,2] — 4 of 18 deficit blocks are [0,1,0], and one surplus neighbour is [2,1,2]',
    'omitted counter-evidence: the proxy tracks t = 0 difficulty (Dbot0 0.979) but not the full flow minimum Dall (−0.106 all, −0.49 selected); the prediction test is about t = 0 bottom-edge difficulty; Gram density shows no relation to Dall either (|ρ| ≤ 0.31)',
    'overstated headline: "route P has no height variable at all" — route P is certified at PT height with height-dependent global inputs; only the binding P47 late-cell floors are height-free',
    'circular check: "sign/parity passes on every interval" holds by construction; real checks are 0 index gaps, deficit = excess blocks, and the independent API/mpmath checks',
    'wording: 264 is the raw Hardy |Z| (≈ 45× the Gram-point RMS), not a normalised value',
    'sampling: the ≥ 3e12 Gram/Rosser rates come from windows around proxy-selected peaks (one event at a selected centre by construction) — "near selected sites"; no comparison with published Rosser counts was possible offline',
    'rhetoric: the height-elasticity comparison (0.0106 vs 0.446/0.565) says nothing about where certificates are tight — context, not evidence',
  ]),
  nextStep: 'None required; route 37 is closed. If written up: the barrier-site selection rule (large |Z|, Euler-product peaks) is the predictor to '
    + 'use, not Gram statistics; do not reopen Gram statistics as a route-P lever. Optional: recompute minA03 with an exact off-line Z(γ − iε) and '
    + 'test a flow-aware proxy against Dall.',
  files: Object.freeze(['tmp/routes-b6-r37-gram/r37_gram.c', 'tmp/routes-b6-r37-gram/flint_part_hooked.c', 'tmp/routes-b6-r37-gram/analyze.py',
    'tmp/routes-b6-r37-gram/selection_test.py', 'tmp/routes-b6-r37-gram/totals.py', 'tmp/routes-b6-r37-gram/rosser_detail.py', 'tmp/routes-b6-r37-gram/r37_results.json',
    'tmp/routes-b6-r37-gram/selection_test.json', 'tmp/routes-b6-r37-gram/totals.json', 'tmp/routes-b6-r37-gram/analyze.out', 'tmp/routes-b6-ref37-check/']),
  verdict: 'Route 37 is closed as a negative result. Gram-violation density does not predict where certificates are tight: the route-P binding '
    + 'late-cell floors are height-free torus suprema; for the barrier, Gram irregularity is a weak two-tailed signal for t = 0 bottom-edge '
    + 'difficulty and shows no relation to the full flow minimum Dall; max|Z| and the zero count carry the predictive power, and the easy '
    + 'proxy-selected sites have three times the background bad-Gram density. Gram and Rosser counts certified assuming FLINT 3.6 is correct '
    + '(near selected sites at ≥ 3e12); correlations measured; no Λ value changes. PT Lambda <= 0.2 stands; RH open; NO QED.',
});

const R = ROUTE_37;
const poissonCDF = (k, m) => { let s = 0; let t = exp(-m); for (let i = 0; i <= k; i += 1) { s += t; t *= m / (i + 1); } return s; };
const garwood = (k) => { const bis = (f) => { let lo = 0; let hi = 100; for (let i = 0; i < 200; i += 1) { const m = (lo + hi) / 2; if (f(m)) lo = m; else hi = m; } return lo; };
  return [k === 0 ? 0 : bis((m) => 1 - poissonCDF(k - 1, m) < 0.025), bis((m) => poissonCDF(k, m) > 0.025)]; };

export const ROUTE_37_ASSERTIONS = Object.freeze([
  {
    id: 'r37-rosser-rates-garwood',
    holds: () => Object.entries(R.rosser.blocks).every(([h, nb]) => { const k = R.rosser.events[h]; const [lo, hi] = garwood(k).map((m) => (m / nb) * 1e4);
      const [rate, l, u] = R.rosser.ratePer1e4[h]; return abs((k / nb) * 1e4 - rate) < 0.01 && abs(lo - l) < 0.01 && abs(hi - u) < 0.01; }),
    why: '7/112,317 and 9/157,209 deficit blocks: 0.62 and 0.57 per 1e4 blocks, exact Poisson 95% intervals [0.25, 1.28] and [0.26, 1.09].',
  },
  {
    id: 'r37-rosser-shapes',
    holds: () => { const total = Object.values(R.rosser.events).reduce((a, b) => a + b, 0); const sh = Object.values(R.rosser.shapes).reduce((a, b) => a + b, 0);
      return total === 18 && sh === total && R.rosser.shapes['[0,1,0]'] === 4 && R.rosser.sampling === 'near selected sites'; },
    why: '18 deficit blocks in total (0, 0, 0, 1, 1, 7, 9 by height group): 14 of shape [0,0] and 4 of shape [0,1,0]; ≥ 3e12 rates are near selected sites.',
  },
  {
    id: 'r37-gram-table-trends',
    holds: () => { const t = R.gramTable; return t.every((r, i) => i === 0 || (r[2] < t[i - 1][2] && r[3] > t[i - 1][3])) && t.every((r) => r[2] > 0.7 && r[3] < 0.22)
      && R.gramPoints === 451291 && R.windows === 34; },
    why: 'Certified Gram table: the Gram-law fraction falls monotonically (0.7292 → 0.7007) and the bad-Gram rate rises (0.1715 → 0.2112) from 1e8 to 3e13.',
  },
  {
    id: 'r37-elasticity-context',
    holds: () => { const t = R.gramTable; const e = log(t[6][3] / t[4][3]) / ((t[6][1] - t[4][1]) * log(10));
      return abs(e - R.elasticity.badRate) < 1e-3 && R.elasticity.meshCost.every((m) => m / e > 40) && R.elasticity.grade === 'context only'; },
    why: 'ln(0.2112/0.2044)/ln(2.12e13/1e12) = 0.0107 (between the 1e12 and 1.5e13–3e13 groups), ≈ 42–53× slower than barrier mesh cost (0.446/0.565); context only.',
  },
  {
    id: 'r37-selection-binomial',
    holds: () => { const s = R.selection; const p = s.base; const tail = s.n * p ** (s.n - 1) * (1 - p) + p ** s.n;
      return abs(tail / s.binomP - 1) < 0.1 && s.bad10Selected / s.bad10Background > 3 && s.touch === 23; },
    why: 'P(X ≥ 23 | n = 24, p = 0.59) = 5.6e-5 (≈ 5.8e-5 reported); selected-site bad10 is > 3× background — Gram violations densest where the barrier is easy.',
  },
  {
    id: 'r37-x10sel-rms',
    holds: () => abs(R.x10sel.rawMaxZ / R.x10sel.rmsRatio - 5.87) < 0.05,
    why: 'Raw max|Z| 264.2 at the 10X′ window is ≈ 45× a Gram-point RMS of ≈ 5.9 (raw Hardy Z, not normalised).',
  },
  {
    id: 'r37-negative-conclusion',
    holds: () => { const b = R.background; return b.rhoByK.every(([, r]) => abs(r) < 0.2) && abs(b.maxZ) > 3 * Math.max(...b.rhoByK.map(([, r]) => abs(r)))
      && b.aucHard > 0.5 && b.aucEasy > 0.5 && R.vsDall.maxAbsRhoAll <= 0.31 && R.vsDall.nominalHit.p * R.vsDall.nominalHit.tests > 0.5
      && R.proxy.vsDbot0 > 0.95 && R.proxy.vsDallAll < 0.2 && R.proxy.vsDallSelected < 0; },
    why: 'Gram density |ρ| < 0.2 at every radius vs max|Z| 0.74; AUC > 0.5 for BOTH tails; no relation to Dall (|ρ| ≤ 0.31); the lone nominal hit fails a Bonferroni count; the proxy tracks Dbot0 (0.979) but not Dall (−0.106 / −0.49).',
  },
  {
    id: 'r37-honest-scope',
    holds: () => R.status === 'done' && /negative result/.test(R.verdict) && /Dall/.test(R.verdict) && /PT Lambda <= 0\.2 stands/.test(R.verdict) && /NO QED/.test(R.verdict)
      && !/no height variable at all/.test(R.headline) && R.refereeKilled.length === 7,
    why: 'Headline scoped to the late-cell floors; Dall counter-evidence recorded; certified only assuming FLINT 3.6; no Λ change; no QED.',
  },
]);

export default ROUTE_37;
