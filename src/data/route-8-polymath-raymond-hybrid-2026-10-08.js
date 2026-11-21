/**
 * @fileoverview route-8-polymath-raymond-hybrid-2026-10-08 — roadmap route 8 (batch 3): a hybrid of the Polymath fixed-time
 * criterion and the Raymond/route-P band barrier (Polymath band above or below the Raymond bands). One run plus one adversarial
 * internal referee pass (not refuted, minor); the referee corrections are applied below.
 *
 * Outcome: route 8 does not move Λ. The best split is the degenerate one with no Polymath band (route P / route 5). With any
 * Polymath band from the existing rows the hybrid is 879177/5000000 = 0.1758354, which is +0.030141316127076 above route P.
 *
 * PROVED (written, unrefereed; built from Lemmas B.1–B.3, Theorem BB and Theorem B' in formalization/paper/lemma-B-two-band.md):
 *  Theorem B'_P (joining lemma). RH head to X, Raymond bands, a walled RH window wider than 7252 ending at x_J, then a Polymath band
 *  C(x_J, ∞) with hypothesis (P-ii) (H_{t0}(x+iy) ≠ 0 for x ≥ x_J, y0 ≤ y ≤ √(1−2t0)). If τ := max(t_e1..t_em, t0) ≤ 41/250 then
 *  Λ ≤ max(U_1, …, U_m, t0 + y0²/2). Polymath's (i) and (iii) are not needed for the Polymath band; before t0 its zeros sit in Lemma
 *  C's far class (b_w < 1 from the strip, distance > 7252). Referee re-derived the logic against the lemma file (sound in outline).
 *  Composition algebra: a hybrid's bound is the max over its bands; if the band next to X is Raymond, the hybrid is ≥ U_1(a_1),
 *  which a Raymond-only layout already achieves.
 * MEASURED (referee correction: this branch of the no-gain lemma is not proved): if the band next to X is Polymath, the hybrid is
 *  ≥ P(X), and P(X) > U_1 rests on the lane model (0.1788 P11, 0.1778 P17) and the ≈ 0.155 infinite-length mollifier ceiling
 *  (src/data/barrier-mollifier-length-ceiling-2026-09.js, double precision, unrefereed) — all well above 0.1457.
 * CERTIFIED (exact Fractions composition of computer-assisted-candidate inputs; conditional on the shared route-P ledger and the
 *  y-transfer sign-off): Polymath band above any Raymond layout → 879177/5000000 (y-transfer row t0 = 1583/10000) or 893927/5000000
 *  (base row t0 = 129/800), y0² = 87677/2500000 in both; minus route P: 7535329031769/2.5e14 = +0.030141316127076 and
 *  +0.033091316127076. The join can reuse the existing walled windows at 9.0e12, 9.9e12, 1.56e13 (all ≥ X + 1), so no new walls.
 *  Polymath band low, C(X, a_1): stated only as a lower bound ≥ 0.1758354 — the certified (ii) rows cover only x ≥ X + √(1 − y0²),
 *  so [X, X + 1] would need the slab or a new wall. The floor-lowering slab is certified only at X = 6000000185827 (producer
 *  hard-wired), so it cannot serve as the join.
 * MEASURED (float64 lane model; reproduces the sealed Mass at N0 = 690988 to the stored 6 significant figures): best Polymath value
 *  P(x) = min_t0 t0 + y0²/2 (P11): 0.1787853 at X_PT … 0.145452 at 1.26e15; it first ties route P at x* = 1.1988e15 (N* = 9.767e6)
 *  and route 5 at 1.2161e15. x* is a P11-model measurement, not a necessary condition: longer mollifiers or the y-transfer lower it.
 * HEURISTIC: a y-transfer gain at x* like the one at X (≈ −0.003) would lower x* to ≈ 7e14.
 *
 * No refereed bound is changed; 0.1758354 and 0.1787854 remain computer-assisted candidates; RH open; NO QED. Import-free.
 * ROUTE_8_ASSERTIONS recompute the exact compositions, the de Bruijn ending condition, the max-over-bands rule, N* from x* and the
 * monotone lane-model bracket.
 */

const big = (s) => { if (Array.isArray(s)) return s; const [a, b] = String(s).split('/'); return [BigInt(a), BigInt(b ?? '1')]; };
const norm = ([a, b]) => { const g = (x, y) => (y === 0n ? (x < 0n ? -x : x) : g(y, x % y)); const d = g(a, b); return [a / d, b / d]; };
const add = (x, y) => { const [a, b] = big(x), [c, d] = big(y); return norm([a * d + c * b, b * d]); };
const sub = (x, y) => { const [a, b] = big(x), [c, d] = big(y); return norm([a * d - c * b, b * d]); };
const half = (x) => { const [a, b] = big(x); return norm([a, 2n * b]); };
const cmp = (x, y) => { const [a, b] = Array.isArray(x) ? x : big(x), [c, d] = Array.isArray(y) ? y : big(y); const l = a * d, r = c * b; return l < r ? -1 : l > r ? 1 : 0; };
const str = ([a, b]) => `${a}/${b}`;
const FOUR_PI = 4 * Math.PI;

export const ROUTE_8 = Object.freeze({
  id: 'route-8-polymath-raymond-hybrid-2026-10-08',
  route: 8,
  date: '2026-10-08',
  title: 'Route 8: Polymath/Raymond hybrid gives no gain; best split = no Polymath band (route P / route 5)',
  status: 'done',
  headline: 'Route 8 does not lower Λ. With a non-empty Polymath band the best hybrid is 879177/5000000 = 0.1758354 (an exact composition of '
    + 'computer-assisted-candidate inputs), +0.030141316127076 above route P. The best split has no Polymath band. A Polymath band can only tie '
    + 'the Raymond value; in the P11 lane model this needs a start at x ≥ x* ≈ 1.2e15 (longer mollifiers or the y-transfer lower x*); it never lowers Λ.',

  polymathRows: Object.freeze({
    yTransfer: Object.freeze({ t0: '1583/10000', y0sq: '87677/2500000', lambda: '879177/5000000', grade: 'computer-assisted candidate (Arb run passed, not entered in the ledger)' }),
    base: Object.freeze({ t0: '129/800', y0sq: '87677/2500000', lambda: '893927/5000000', grade: 'computer-assisted candidate' }),
  }),
  raymond: Object.freeze({
    routeP: Object.freeze({ bands: Object.freeze(['36423520968231/250000000000000', '36063660805739/250000000000000']), dec: '0.145694083872924' }),
    route5Three: Object.freeze({ bands: Object.freeze(['145632847457923/1000000000000000', '144912451862679/1000000000000000', '36063660805739/250000000000000']) }),
    route5Four: Object.freeze({ bands: Object.freeze(['72810191965913/500000000000000', '29066518885033/200000000000000', '144912451862679/1000000000000000', '36063660805739/250000000000000']) }),
  }),
  deltas: Object.freeze({ yTransferMinusRouteP: '7535329031769/250000000000000', baseMinusRouteP: '8272829031769/250000000000000' }),
  tMax: '41/250',
  slab: Object.freeze({ X: 6000000185827, certifiedFloors: Object.freeze([0.1809, 0.174336, 0.17, 0.165, 0.03, 0.025, 0.022]), tMax: 0.16125 }),
  lane: Object.freeze({
    P11: Object.freeze([[6000000185827, 0.1787853], [9.0e12, 0.175763], [9.9e12, 0.175066], [1.56e13, 0.171813], [5.0e13, 0.163945], [1.26e15, 0.145452], [1.26e17, 0.125015], [1.26e19, 0.109465]]),
    P17: Object.freeze([[6000000185827, 0.177827], [5.0e13, 0.163102], [1.26e15, 0.144750], [1.26e17, 0.124464]]),
    xStarRouteP: Object.freeze({ x: 1.1988e15, N: 9.767e6, t0: 0.13347, y0: 0.15633 }),
    xStarRoute5: Object.freeze({ x: 1.2161e15, N: 9.837e6 }),
    sealedOptimum: Object.freeze({ t0: 0.16126, y0: 0.18724 }),
    mollifierLengthCeiling: 0.155,
  }),

  refereeKilled: Object.freeze([
    'x* ≈ 1.2e15 stated as the tie threshold — it is a P11 (and P17) lane-model measurement; longer mollifiers (Δt ≈ 0.021 at X) lower it; not a necessary condition',
    'no-gain lemma filed as proved in full — the Polymath-next-to-X branch needs P(X) > U_1, which is measured (lane model, mollifier-length ceiling), not proved',
    'Polymath band low C(X, a_1) as a certified layout — the certified (ii) rows cover only x ≥ X + √(1 − y0²); [X, X + 1] needs the slab or a new wall; lower bound only',
    '0.1758354 / 0.1787854 listed as "certified" — computer-assisted candidates (y-transfer Theorems B/C sign-off open); the exact composition is certified only relative to them',
    'lane model "reproduces the sealed Mass exactly" — to the stored 6 significant figures only (7.91366e-7 vs 7.913668e-7)',
  ]),
  nextStep: 'Close route 8; no compute on Polymath bands. Optional: internal referee on Theorem B\'_P (Lemma C far class for Polymath-band zeros before t0). '
    + 'A fully Polymath-certified upper tail would need an Arb lane at N ≈ 9.8e6 (t0 ≈ 0.1335, y0 ≈ 0.1563), an RH window near γ ≈ 6e14 and walls there; no Λ gain.',
  files: Object.freeze(['tmp/routes-b3-8-compose.py', 'tmp/routes-b3-8-compose.json', 'tmp/routes-b3-8-results.json', 'tmp/routes-b3-8-lane-lib.py',
    'tmp/routes-b3-8-polyheight-P11.json', 'tmp/routes-b3-8-nstar-P11.json', 'tmp/routes-b3-ref-8-recompose.py', 'tmp/routes-b3-ref-8-recompose.log']),
  verdict: 'Route 8 does not move Lambda. Theorem B\'_P (written, unrefereed) gives Λ ≤ max(Raymond band values, t0 + y0²/2); the band next to X binds, '
    + 'and Polymath near X is far weaker than Raymond (0.1758354 candidate, ≈ 0.178 lane model, vs 0.1457), so the best split is route P / route 5 '
    + 'with no Polymath band; any Polymath band gives 0.1758354 (+0.030141316127076). A Polymath band could only tie, and only from x ≥ ~1.2e15 in the '
    + 'P11 lane model (measured). No refereed bound is changed; 0.1758354 and 0.1787854 remain computer-assisted candidates; RH open; NO QED.',
});

const R = ROUTE_8;
const maxR = (xs) => xs.reduce((m, x) => (cmp(m, x) < 0 ? x : m));

export const ROUTE_8_ASSERTIONS = Object.freeze([
  {
    id: 'r8-polymath-rows-exact',
    holds: () => Object.values(R.polymathRows).every((r) => str(add(r.t0, half(r.y0sq))) === r.lambda)
      && Math.abs(Math.sqrt(87677 / 2500000) - 0.18727) < 1e-5,
    why: 't0 + y0²/2: 1583/10000 + 87677/5000000 = 879177/5000000 and 129/800 + 87677/5000000 = 893927/5000000; y0 = 0.18727.',
  },
  {
    id: 'r8-ending-condition',
    holds: () => Object.values(R.polymathRows).every((r) => cmp(r.t0, R.tMax) <= 0) && cmp(R.polymathRows.yTransfer.lambda, R.tMax) > 0,
    why: 'Theorem B\'_P needs only τ = max(t_e, t0) ≤ 41/250: both rows have t0 ≤ 0.164 although 0.1758354 > 0.164.',
  },
  {
    id: 'r8-max-over-bands',
    holds: () => Object.values(R.raymond).every((lay) => {
      const ray = maxR(lay.bands); const poly = R.polymathRows.yTransfer.lambda;
      return cmp(maxR([...lay.bands, poly]), poly) === 0 && cmp(ray, poly) < 0 && cmp(maxR([...lay.bands]), lay.bands[0]) === 0; })
      && str(sub(R.polymathRows.yTransfer.lambda, R.raymond.routeP.bands[0])) === R.deltas.yTransferMinusRouteP
      && str(sub(R.polymathRows.base.lambda, R.raymond.routeP.bands[0])) === R.deltas.baseMinusRouteP,
    why: 'In route P, route-5 3-band and 4-band layouts band 1 binds; adding a Polymath band makes it bind at 0.1758354; differences +0.030141316127076 / +0.033091316127076 exactly.',
  },
  {
    id: 'r8-nstar-from-xstar',
    holds: () => [R.lane.xStarRouteP, R.lane.xStarRoute5].every(({ x, N }) => Math.abs(Math.sqrt(x / FOUR_PI) - N) / N < 1e-3)
      && R.lane.xStarRouteP.t0 + R.lane.xStarRouteP.y0 ** 2 / 2 - Number(R.raymond.routeP.dec) < 2e-5,
    why: 'N* = √(x*/4π): 9.767e6 at 1.1988e15 and 9.837e6 at 1.2161e15; at the optimum t0 + y0²/2 = 0.145689 ≈ route P (tie).',
  },
  {
    id: 'r8-lane-bracket',
    holds: () => { const p = R.lane.P11; const mono = p.every((v, i) => i === 0 || (v[0] > p[i - 1][0] && v[1] < p[i - 1][1]));
      const at = (x) => p.findIndex((v) => v[0] >= x); const j = at(R.lane.xStarRouteP.x);
      return mono && p[j - 1][1] > Number(R.raymond.routeP.dec) && p[j][1] < Number(R.raymond.routeP.dec)
        && R.lane.P17.every(([x, v]) => { const q = p.find((w) => w[0] === x); return !q || v < q[1]; })
        && Math.abs(p[0][1] - (R.lane.sealedOptimum.t0 + R.lane.sealedOptimum.y0 ** 2 / 2)) < 2e-5
        && R.lane.mollifierLengthCeiling > Number(R.raymond.routeP.dec); },
    why: 'P11 lane value falls monotonically with height and crosses route P between 5e13 and 1.26e15 (x* = 1.1988e15); P17 ≤ P11; the X optimum is the sealed (0.16126, 0.18724); even the ≈ 0.155 ceiling is above 0.1457.',
  },
  {
    id: 'r8-slab-only-at-X',
    holds: () => R.slab.certifiedFloors.every((f) => f * f < Number(R.polymathRows.yTransfer.y0sq.split('/')[0]) / 2500000) && R.slab.tMax === 0.16125,
    why: 'Containment f² < y0² holds at every certified slab floor (0.1809 … 0.022); the slab is certified only at X = 6000000185827, so it cannot be the join.',
  },
  {
    id: 'r8-honest-scope',
    holds: () => R.status === 'done' && /does not move Lambda/.test(R.verdict) && /computer-assisted candidates/.test(R.verdict)
      && /refereed bound is changed/i.test(R.verdict) && /NO QED/.test(R.verdict) && /measured/.test(R.refereeKilled[1]),
    why: 'No Λ change; candidate status of 0.1758354 / 0.1787854 kept; the Polymath-next-to-X branch graded measured; no QED.',
  },
]);

export default ROUTE_8;
