/**
 * @fileoverview route-4-fejer-riesz-wol-2026-10-07 — roadmap route 4 (batch 2): Fejér–Riesz sum-of-squares certificates for the
 * weak outer lemma (WOL-C) on P47 late cells, as a drop-in for the v4c per-prime fiber maxima. One run plus one adversarial
 * internal referee pass (not refuted, minor); the referee corrections are applied below.
 *
 * Outcome: the SOS step is rigorous and tight (residual ≤ 1.05e-12) but gains only 2.2e-4 to 4.1e-4 per box, which is exactly
 * v4c's θ-grid Lipschitz slack — a 2^20-point grid plus full Lipschitz bound reproduces the SOS box bound to 9.2e-7 (referee).
 * The binding top boxes need 0.0024 (cell 459) to 0.035 (cell 417), and one plain octree split already gives that. Route 4 is
 * not a lever. No floor closes, no new route-P value.
 *
 * PROVED (written in tmp/routes-b2-r4-fr.py header, unrefereed): branch-reduction lemma — the v4c fiber function g_q (terms
 *  |sin kθ|, k = 1..7, |sin θ/2|, max(h_s, 0), nonnegative coefficients) has sup equal to the max over 2^8·2^2 = 1024 sign/branch
 *  choices of the sup of a trigonometric polynomial of degree ≤ 14 in φ = θ/2; whole-circle Fejér–Riesz then certifies it.
 *  Referee re-derived it (needs G, Gh ≥ 0, km ≥ 0, dk ≥ 0, guaranteed by chords()); numerically equal to g to 6e-17.
 * CERTIFIED (per-prime only): sup g_q ≤ c + ||r||_1 with the residual r = (c − P) − |H|² computed exactly in rationals; max
 *  ||r||_1 = 1.045e-12 over 312 per-prime certificates; every certificate ≥ a dense evaluation (gap ≈ 1e-10). SOS-replaced box
 *  bounds keep v4c's grading (single implementation, internal referee). Box margins v4c → SOS: idx 201 (cell 417, target 0.066012)
 *  0.1011112 → 0.1008069 (top box); idx 246 (cell 459, target 0.050) 0.0524348 → 0.0522036 (top box). No open box reaches target.
 *  Referee correction: idx 205's top box has driver margin 0.1575700 (gap bound wins, 0.8883862 < 1.0642256); SOS does not touch the
 *  gap bound, so the SOS gain there is zero (0.3334094 → 0.3330037 is the full bound alone).
 * CONDITIONAL: any use of these SOS maxima keeps v4c's dependence on the shared ledger and needs a referee pass on routes-b2-r4-fr.py.
 * MEASURED: θ_s = 0 point values (201: 0.0580 → 0.0578; 205: 0.0585 → 0.0583; 246: 0.0402 → 0.0400) — referee correction: these are
 *  point evaluations, already below target without SOS, not certified box bounds. One octree split closes the top boxes (children
 *  201: 0.0165–0.0436 vs 0.066; 246: 0.03777–0.04251 vs 0.050, re-run bit-identical by the referee). Fiber relaxation at the 201
 *  top-box centre: v4c 0.0628 vs a measured joint-core LOWER estimate 0.0128 (64-point grid ascent, radii and far tails omitted),
 *  so AT MOST ≈ 0.05 could be recovered by an exact joint argument (referee correction: an upper estimate of available room).
 *  Main-part grid gap 1.6e-5–4.1e-5 (KKT-exact max = grid max to 5.4e-6). Cost: ≈ 17 s per variant, ≈ 34 s per box (A+B);
 *  the one-split contrast costs 16 evaluations (gap + full for 8 children).
 * HEURISTIC: a joint outer-torus SOS over T^12 with ≈ 1e5 label moduli is out of reach (argument, not a demonstrated obstruction);
 *  finishing cells 417–424 by the budget route takes ≈ 8–16 h per floor on one worker (heap 840–1777 open boxes).
 *
 * PT Λ ≤ 0.2 is the accepted benchmark; RH open; NO QED. Import-free. ROUTE_4_ASSERTIONS recompute the margin arithmetic, the
 * needed-vs-gained ratios, the decomposition sums and a live toy test of the branch-reduction principle.
 */

const V = (v4c, sos, target, label) => Object.freeze({ v4c, sos, target, label });

export const ROUTE_4 = Object.freeze({
  id: 'route-4-fejer-riesz-wol-2026-10-07',
  route: 4,
  date: '2026-10-07',
  title: 'Route 4: Fejér–Riesz SOS for WOL-C is rigorous but gains only grid slack (2.2–4.1e-4 per box); not a lever',
  status: 'done',
  headline: 'Fejér–Riesz certificates replace v4c\'s per-prime grid-plus-Lipschitz maxima exactly (residual ≤ 1.05e-12), but they gain only '
    + '2.2e-4 to 4.1e-4 per box — the same as a finer θ grid — while the binding top boxes need 0.0024 to 0.035. One octree split already '
    + 'closes those boxes. Route 4 closes no box and moves no value.',

  boxes: Object.freeze([ // SOS-replaced box margins (certified relative to v4c grading); top open boxes of ckpt_201 / ckpt_246
    V(0.1011112, 0.1008069, 0.066012, 'idx 201 rank 0'), V(0.1010680, 0.1007685, 0.066012, 'idx 201 rank 1'),
    V(0.1010662, 0.1007812, 0.066012, 'idx 201 rank 2'), V(0.1009310, 0.1006201, 0.066012, 'idx 201 rank 3'),
    V(0.0524348, 0.0522036, 0.050, 'idx 246 rank 0'), V(0.0524286, 0.0521999, 0.050, 'idx 246 rank 1'), V(0.0524283, 0.0521991, 0.050, 'idx 246 rank 2'),
  ]),
  idx205: Object.freeze({ fullBoundMargin: [0.3334094, 0.3330037], driverMargin: 0.1575700, gapBound: 0.8883862, fullBound: 1.0642256, sosGainInDriverTerms: 0 }),
  pointValues: Object.freeze([ // MEASURED point evaluations at θ_s = 0 (d = 0), not box certificates
    Object.freeze({ idx: 201, v4c: 0.0580118, sos: 0.0577591, target: 0.066012 }), Object.freeze({ idx: 246, v4c: 0.0402234, sos: 0.0400042, target: 0.050 }),
    Object.freeze({ idx: 205, v4c: 0.0585179, sos: 0.0582653, target: 0.066518 }), Object.freeze({ idx: 269, v4c: 0.0501521, sos: 0.0499248, target: 0.050 }),
    Object.freeze({ idx: 265, v4c: 0.0503566, sos: 0.0501289, target: 0.050 }),
  ]),
  sos: Object.freeze({ gainRange: [2.19e-4, 4.09e-4], maxResidual: 1.045e-12, perPrimeCerts: 312, branches: 1024, maxDegreeInPhi: 14,
    fineGridMatch: Object.freeze({ fineGridUB: 0.73296601, sosUB: 0.73296509, gainThere: 2.31e-4 }) }),
  oneSplit: Object.freeze({ idx201: [0.0165, 0.0436, 0.066012], idx246: [0.03777, 0.04251, 0.050] }),
  decomposition201: Object.freeze({ bound: 0.83063, main: 0.58301, extraConst: 0.12745, fiber: 0.12017, threshold: 0.79553, centreBound: 0.71563,
    excess: Object.freeze({ main: 0.0331, extraConst: 0.0245, fiber: 0.0574 }), fiberCentre: 0.0628, jointCoreLowerEstimate: 0.0128 }),
  mainPartGridGap: [1.6e-5, 4.1e-5],
  cost: Object.freeze({ sosSecondsPerVariant: 17, sosSecondsPerBox: 34, oneSplitEvaluations: 16, evalSeconds: 3 }),

  refereeKilled: Object.freeze([
    'idx 205 misreported: driver margin is 0.1575700 (gap bound wins); SOS gain there is zero in driver terms',
    'θ_s = 0 rows listed as certified box bounds: they are point evaluations that already close without SOS',
    'SOS adds nothing a finer θ grid does not: 2^20 grid + full Lipschitz reproduces the SOS bound to 9.2e-7 (idx 246 rank 0)',
    '"≈ 0.05 lost to triangle inequality/separability" overstated: 0.0128 is a lower estimate of the joint core, so 0.05 is an upper estimate of recoverable room',
    'cost understated: ≈ 34 s per box (two variants), 16 evaluations for the one-split contrast; ≈ 8 h per floor estimate could equally be ≈ 16 h',
  ]),
  nextStep: 'Drop route 4 as a lever. Cells 417–424 and 459–464 are being finished by the route-1 campaign (tmp/route1-campaign, --resume --continue). '
    + 'Optional: certify_q in tmp/routes-b2-r4-fr.py as a 2–3e-4 tightening near θ_s = 0 (equally available from a finer grid). '
    + 'The fiber relaxation (at most ≈ 0.05 of room at one point) needs a non-SOS joint argument for Σ_r |X_r(θ)|.',
  files: Object.freeze(['tmp/routes-b2-r4-fr.py', 'tmp/routes-b2-r4-sosbox.py', 'tmp/routes-b2-r4-refine.py', 'tmp/routes-b2-r4-out/results.json',
    'tmp/routes-b2-ref4-check.py', 'tmp/routes-b2-ref4-gap.py', 'tmp/routes-b2-ref4-out/']),
  verdict: 'Route 4 does not beat v4c. The Fejér–Riesz certificate is a valid drop-in for the per-prime maxima, but its gain (2.2–4.1e-4 per box) '
    + 'equals v4c\'s θ-grid slack and a finer grid recovers it to 9.2e-7. The binding boxes need 0.0024–0.035, which one octree split supplies. '
    + 'No floor closes, no new route-P value, no margin at or below 0.050 for any floor. No refereed bound is changed; RH open; NO QED.',
});

const R = ROUTE_4;

export const ROUTE_4_ASSERTIONS = Object.freeze([
  {
    id: 'r4-gain-range',
    holds: () => R.boxes.every((b) => { const g = b.v4c - b.sos; return g >= 2.0e-4 && g <= R.sos.gainRange[1] + 1e-9 && b.sos > b.target; })
      && Math.min(...R.boxes.map((b) => b.v4c - b.sos)) < 2.4e-4 && Math.max(...R.boxes.map((b) => b.v4c - b.sos)) > 3.1e-4,
    why: 'Per-box SOS gains on the seven top boxes lie in ≈ 2.3e-4 … 3.1e-4 (within 2.19–4.09e-4 overall) and no SOS margin reaches its target.',
  },
  {
    id: 'r4-needed-vs-gained',
    holds: () => { const need201 = R.boxes[0].v4c - R.boxes[0].target, need246 = R.boxes[4].v4c - R.boxes[4].target;
      return Math.abs(need201 - 0.0350992) < 1e-7 && Math.abs(need246 - 0.0024348) < 1e-7 && need201 / R.sos.gainRange[1] > 80 && need246 / R.sos.gainRange[1] > 5.9; },
    why: 'The top boxes need 0.0351 (cell 417) and 0.0024 (cell 459): 80× and 6× the largest SOS gain.',
  },
  {
    id: 'r4-one-split-closes',
    holds: () => R.oneSplit.idx201[1] < R.oneSplit.idx201[2] && R.oneSplit.idx246[1] < R.oneSplit.idx246[2]
      && R.cost.oneSplitEvaluations * R.cost.evalSeconds < 2 * R.cost.sosSecondsPerBox,
    why: 'Every child of one octree split is below target (201: max 0.0436 < 0.066; 246: max 0.0425 < 0.050), for ≈ 48 s vs 34 s per SOS box.',
  },
  {
    id: 'r4-idx205-correction',
    holds: () => R.idx205.gapBound < R.idx205.fullBound && R.idx205.driverMargin < R.idx205.fullBoundMargin[0] && R.idx205.sosGainInDriverTerms === 0,
    why: 'idx 205: min(gap, full) picks the gap bound, so the driver margin is 0.15757 and SOS (full bound only) gains nothing there.',
  },
  {
    id: 'r4-fine-grid-equivalent',
    holds: () => { const f = R.sos.fineGridMatch; const d = f.fineGridUB - f.sosUB; return d > 0 && d < 1e-6 && d / f.gainThere < 0.005; },
    why: 'Referee: a 2^20 grid + full Lipschitz bound is within 9.2e-7 of the SOS bound (< 0.5% of the 2.31e-4 gain).',
  },
  {
    id: 'r4-decomposition-arith',
    holds: () => { const d = R.decomposition201;
      return Math.abs(d.main + d.extraConst + d.fiber - d.bound) < 2e-5 && d.bound > d.threshold && d.centreBound < d.threshold
        && Math.abs(d.excess.main + d.excess.extraConst + d.excess.fiber - (d.bound - d.centreBound)) < 2e-4
        && d.fiberCentre - d.jointCoreLowerEstimate <= 0.0501 && R.mainPartGridGap[1] < 5e-5; },
    why: '0.58301 + 0.12745 + 0.12017 = 0.83063 > 0.79553; the box-size excess ≈ 0.115 explains the gap to the centre value; recoverable fiber room ≤ ≈ 0.05.',
  },
  {
    id: 'r4-point-values-not-certificates',
    holds: () => R.pointValues.filter((p) => [201, 205, 246].includes(p.idx)).every((p) => p.v4c < p.target)
      && R.pointValues.find((p) => p.idx === 265).sos > 0.050 && R.pointValues.find((p) => p.idx === 269).sos < 0.050,
    why: 'Floors 201/205/246 already close at θ_s = 0 without SOS (so those rows say nothing about SOS); 269 dips just under 0.050 only as a point value.',
  },
  {
    id: 'r4-branch-reduction-toy',
    holds: () => { // max over sign choices of Σ a_k ε_k sin kθ equals Σ a_k |sin kθ|; every branch ≤ g
      const a = [0.7, 0.3, 0.5, 0.1, 0.9, 0.2, 0.4];
      for (let i = 0; i <= 400; i++) { const th = (2 * Math.PI * i) / 400; const s = a.map((ak, k) => Math.sin((k + 1) * th));
        const g = a.reduce((acc, ak, k) => acc + ak * Math.abs(s[k]), 0); let best = -Infinity;
        for (let m = 0; m < 1 << a.length; m++) { let p = 0; for (let k = 0; k < a.length; k++) p += a[k] * ((m >> k) & 1 ? 1 : -1) * s[k];
          if (p > g + 1e-12) return false; if (p > best) best = p; }
        if (Math.abs(best - g) > 1e-12) return false; }
      return R.sos.branches === 2 ** 8 * 2 ** 2;
    },
    why: 'Toy instance of the branch-reduction lemma (nonnegative coefficients): each sign branch is ≤ g and the max over 2^7 branches equals g; 1024 = 2^8·2^2.',
  },
  {
    id: 'r4-honest-scope',
    holds: () => R.status === 'done' && /does not beat v4c/.test(R.verdict) && /refereed bound is changed/i.test(R.verdict) && /NO QED/.test(R.verdict)
      && R.refereeKilled.length === 5,
    why: 'Route 4 is not a lever; five referee corrections recorded; no QED.',
  },
]);

export default ROUTE_4;
