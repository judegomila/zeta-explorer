/**
 * @fileoverview route-7-time-dependent-mollifiers-2026-10-08 — roadmap route 7 (batch 3): per-cell Euler weights λ_p ∈ [0, 1]
 * on the {2,3,5} heat-evolved mollifier of the Track A / Raymond floors. One run plus one adversarial internal referee pass
 * (not refuted, minor); the referee corrections are applied below.
 *
 * Outcome: route 7 does not move Λ. Certified U stays 36423520968231/(2.5·10^14) = 0.145694083872924 (change exactly 0).
 *
 * PROVED (elementary, project-internal; referee re-derived it): Lemma CG^λ. The head coefficient of
 *  E^λ_t(s) = Π_{p∈{2,3,5}} (1 − λ_p b_t(p) p^{−s}) is a convex combination of the Lemma CG covers C_{g_K}, weights
 *  Π_{p∈K} λ_p Π_{p∈P(n)∖K} (1 − λ_p); hence 0 ≤ c^λ_n(t_L) ≤ c^λ_n(t) ≤ c^λ_n(t_R). Covers λ_p ∈ [0, 1] only.
 * WRITTEN SKETCH, UNREFEREED (referee correction: moved out of "proved"; not checked against the AF manuscript, which is not
 *  stored locally): Theorem 4'^λ / (OP^λ), the generalised floor inequality with λ constant per time cell, per frequency
 *  rectangle and per table entry (substitutions (a)–(f) in the AF Part I §6–9 and Theorem 4' proofs).
 * CERTIFIED: nothing new. The exact consumer (tmp/r2-floor-consume.py on the r7 fullref admission) re-runs byte-identically,
 *  and with the 11 measured λ-increments added it still gives 0.145694083872924 (they sit in modes r_9_20 / r_19_40, which the
 *  path does not use).
 * CONDITIONAL: any λ ≠ 1 floor would need Lemma CG^λ, (OP^λ) and a modified Arb producer (A, B, D_C, C, E_l, pert fields);
 *  not built, since the measured gain is zero. Route-P values rest on the shared ledger (G0-c, G0-d, AF gaps, Lemma B, producer
 *  layer, RH-win, RH-head).
 * MEASURED (float model; calibration factors at λ = 1 within 0.5% of 1; the λ-dependence has no interval enclosure):
 *  - path usage: 15,139 of 74,596 substeps use Track A floors (7,322 sharp + 7,817 fixed-r), in 140 cells spread between 304
 *    and 582 (not every cell in that span); the other 24,468 κ = 1 sharp substeps are r2 sharp windows (referee exact replay);
 *  - uniform λ (author: joint grid, coordinate sweep, refine, near-1 scan) and per-rectangle λ_5 (referee, 9 binding cells): no
 *    gain in any path mode; max gain 2.091e-4 at 430|r_9_20 (λ_5 = 0.82–0.85), off the path;
 *  - row 5 (C5 = 0.638–0.80 < (log 5)/2 on cells 428–497): changing λ on row 5 never raises the one-point floor (126 cells);
 *  - min cone constant on rows 0–4: 0.8122 > (log 5)/2 = 0.8047; λ_p > 1 and adding prime 7 lower the floors;
 *  - consumer sensitivity: all Track A floors +0.001 → −6.27e-6, +0.01 → −5.60e-5.
 * HEURISTIC: λ = 1 is a kink maximum (reintroducing label p costs more than the Euler-cap saving). Referee: incomplete — on
 *  row 5 there is no exceptional debit for p = 5, yet lowering λ_5 still lowers the floor (cost through the label masses).
 *
 * PT Λ ≤ 0.2 is the accepted benchmark; RH open; NO QED. Import-free. ROUTE_7_ASSERTIONS recompute the Lemma CG^λ identity on
 * random data, the exact zero change, the usage split, the cone-constant comparison and the sensitivity ratios.
 */

const big = (s) => { const [a, b] = String(s).split('/'); return [BigInt(a), BigInt(b ?? '1')]; };
const cmp = (x, y) => { const [a, b] = big(x), [c, d] = big(y); const l = a * d, r = c * b; return l < r ? -1 : l > r ? 1 : 0; };
const exact15 = (s) => { const [a, b] = big(s); const n = a * 10n ** 15n; return n % b === 0n ? n / b : null; };
const V = (exact, dec, grade, label) => Object.freeze({ exact, dec, grade, label });

export const ROUTE_7 = Object.freeze({
  id: 'route-7-time-dependent-mollifiers-2026-10-08',
  route: 7,
  date: '2026-10-08',
  title: 'Route 7: per-cell Euler weights on the {2,3,5} mollifier; λ = 1 is already best, U unchanged at 0.145694083872924',
  status: 'done',
  headline: 'Route 7 does not move Λ. In the float model, Raymond\'s weights (λ = 1) are best for every path mode, both with one λ for all '
    + 'rectangles (author) and with λ set per rectangle (referee spot check on 9 binding cells). Certified U is unchanged at '
    + '36423520968231/(2.5·10^14) = 0.145694083872924.',

  values: Object.freeze({
    baseline: V('36423520968231/250000000000000', '0.145694083872924', 'CERTIFIED', 'route-P r7 exact consumer (re-run byte-identically)'),
    withIncrements: V('36423520968231/250000000000000', '0.145694083872924', 'CERTIFIED', 'same consumer with the 11 measured λ-increments'),
    plus001: V('145687814086597/1000000000000000', '0.145687814086597', 'MEASURED (hypothetical)', 'all Track A floors +0.001'),
    plus01: V('145638100730538/1000000000000000', '0.145638100730538', 'MEASURED (hypothetical)', 'all Track A floors +0.01'),
  }),
  usage: Object.freeze({ substeps: 74596, trackA: 15139, trackASharp: 7322, trackAFixedR: 7817, r2SharpWindows: 24468, cells: 140, cellSpan: [304, 582],
    pathModes: Object.freeze(['sharp', 'r_3_5', 'r_23_40', 'r_21_40']) }),
  coneConstant: Object.freeze({ minRows0to4: 0.812185, atCell: 430, row5Range: Object.freeze([0.638, 0.80]), row5Cells: [428, 497] }),
  maxOffPathGain: Object.freeze({ value: 2.091e-4, cell: 430, mode: 'r_9_20', lambda5: [0.82, 0.85] }),
  calibration: Object.freeze({ fAp: [1.0028, 1.0052], fAm: [0.9948, 0.9972], fEl: 1.000033 }),
  modelError: Object.freeze({ onePoint: 8.7e-8, joint: 1.75e-7 }),
  slopes: Object.freeze({ p2: Object.freeze({ down: [-0.585, -0.153], up: [-0.428, -0.214] }), p3: Object.freeze({ down: [-0.180, -0.023], up: [-0.284, -0.127] }),
    p5: Object.freeze({ down: [-0.041, 0.015], up: [-0.137, -0.061] }) }),

  refereeKilled: Object.freeze([
    '"λ = 1 is the best choice in the tested family" — the author searched only one λ for all six rectangles; the per-rectangle freedom the theorem allows was unsearched (referee searched it on 9 binding cells: no path-mode gain; conclusion stands)',
    'slope scan on rows 0–4 only — row 5 has C5 < (log 5)/2 on cells 428–497, so the exceptional-debit argument does not apply there; referee checked row 5 directly on 126 cells: no rise',
    'kink-maximum explanation credited to the exceptional debit — incomplete: on row 5 the label-mass cost alone lowers the floor (heuristic wording)',
    '"validation 8.7e-8" — partly circular (calibration factors fitted at λ = 1); factors within 0.5% of 1, λ-dependence float-model only',
    'Theorem 4\'^λ / (OP^λ) filed as proved — a written sketch, unrefereed, not checked against the AF text; only Lemma CG^λ is proved',
    '"140 cells: 304–508 and 580–582" — the 140 cells are scattered inside those spans (count correct)',
  ]),
  nextStep: 'Retire route 7 as a Λ lever. Only open direction: a mollifier of a different shape (rough primes inside the r2 structured floors, or a '
    + 'mollifier in the Polymath (ii) lane at y0 < 0.1809, Polymath track only). Scripts reusable via tmp/routes-b3-7-joint.py and tmp/routes-b3-7-consume.py --incr.',
  files: Object.freeze(['tmp/routes-b3-7-joint.py', 'tmp/routes-b3-7-consume.py', 'tmp/routes-b3-7-usage.py', 'tmp/routes-b3-7-cglam-check.py',
    'tmp/routes-b3-7-out/summary.json', 'tmp/routes-b3-ref-7-perrect.py', 'tmp/routes-b3-ref-7-row5.py', 'tmp/routes-b3-ref-7-usage.py', 'tmp/routes-b3-ref-7-out/']),
  verdict: 'Route 7 does not move Lambda: the generalised floor inequality for per-cell Euler weights λ_p ∈ [0, 1] (Lemma CG^λ proved; Theorem 4\'^λ a '
    + 'written sketch, unrefereed) gives no gain on the exact consumer, because λ = 1 is best for every path mode in the float model (uniform and '
    + 'per-rectangle λ), λ > 1 and a seventh prime lower the floors, and the only positive gains (≤ 2.1e-4) sit in modes the path does not use. U = '
    + '0.145694083872924 exactly; nothing new certified. PT Lambda <= 0.2 stands; RH open; NO QED.',
});

const R = ROUTE_7;
// Deterministic PRNG for the live identity check.
const rng = (seed) => () => { seed = (seed * 1664525 + 1013904223) % 4294967296; return seed / 4294967296; };
const subsets = (arr) => arr.reduce((acc, p) => acc.concat(acc.map((s) => [...s, p])), [[]]);

export const ROUTE_7_ASSERTIONS = Object.freeze([
  {
    id: 'r7-values-exact',
    holds: () => Object.values(R.values).every((x) => { const n = exact15(x.exact); return n !== null && Math.abs(Number(n) / 1e15 - Number(x.dec)) < 1e-16; }),
    why: 'Every stated decimal is the exact value of its rational.',
  },
  {
    id: 'r7-zero-change',
    holds: () => cmp(R.values.withIncrements.exact, R.values.baseline.exact) === 0 && !R.usage.pathModes.includes(R.maxOffPathGain.mode),
    why: 'With the 11 measured λ-increments the exact consumer returns the baseline exactly; the largest gain (430|r_9_20) is in a mode the path does not use.',
  },
  {
    id: 'r7-cglam-identity',
    holds: () => {
      const r = rng(20261008); const P = [2, 3, 5];
      for (let trial = 0; trial < 200; trial++) {
        const Pn = P.filter(() => r() < 0.7); const lam = Object.fromEntries(P.map((p) => [p, r()]));
        const x = new Map(subsets(Pn).map((D) => [D.join('.'), r() * 2 - 1])); // arbitrary values of μ(D)β_D b(n/D)
        const lamD = (D) => D.reduce((m, p) => m * lam[p], 1);
        const lhs = subsets(Pn).reduce((s, D) => s + lamD(D) * x.get(D.join('.')), 0);
        let rhs = 0; let wsum = 0;
        for (const K of subsets(Pn)) {
          const w = lamD(K) * Pn.filter((p) => !K.includes(p)).reduce((m, p) => m * (1 - lam[p]), 1);
          const Cg = subsets(K).reduce((s, D) => s + x.get(D.join('.')), 0); // Lemma CG cover for g_K = Π K
          rhs += w * Cg; wsum += w; if (w < 0) return false;
        }
        if (Math.abs(lhs - rhs) > 1e-12 || Math.abs(wsum - 1) > 1e-12) return false;
      }
      return true;
    },
    why: 'Lemma CG^λ live: Σ_{D⊆P(n)} λ_D x_D = Σ_K [Π_K λ_p Π_{P∖K}(1−λ_p)] Σ_{D⊆K} x_D for random λ ∈ [0,1] and arbitrary x_D; weights are nonnegative and sum to 1.',
  },
  {
    id: 'r7-usage-split',
    holds: () => { const u = R.usage; return u.trackASharp + u.trackAFixedR === u.trackA && u.trackA + u.r2SharpWindows < u.substeps
      && Math.abs(u.trackA / u.substeps - 0.203) < 0.001 && u.cells === 140 && u.cellSpan[1] - u.cellSpan[0] + 1 > u.cells; },
    why: '15,139 = 7,322 sharp + 7,817 fixed-r Track A substeps (20.3% of 74,596); 140 cells inside a 279-cell span, so the span is not every cell.',
  },
  {
    id: 'r7-cone-constant',
    holds: () => { const half5 = Math.log(5) / 2; const c = R.coneConstant;
      return c.minRows0to4 > half5 && c.minRows0to4 - half5 < 0.01 && c.row5Range[1] < half5 && c.row5Range[0] < c.row5Range[1]; },
    why: 'Rows 0–4: min C = 0.8122 > (log 5)/2 = 0.8047 (each reintroduced label is exceptional); row 5: C5 ≤ 0.80 < (log 5)/2 (no debit there; checked directly by the referee).',
  },
  {
    id: 'r7-sensitivity',
    holds: () => { const b = Number(R.values.baseline.dec); const d1 = Number(R.values.plus001.dec) - b; const d2 = Number(R.values.plus01.dec) - b;
      return Math.abs(d1 + 6.27e-6) < 1e-8 && Math.abs(d2 + 5.60e-5) < 1e-7 && d2 / d1 > 8.5 && d2 / d1 < 9.5 && R.maxOffPathGain.value < 0.001; },
    why: 'Uniform +0.001 on all Track A floors → −6.27e-6, +0.01 → −5.60e-5 (ratio ≈ 8.9); the largest measured gain (2.09e-4, off path) is below 0.001.',
  },
  {
    id: 'r7-slopes-sign',
    holds: () => { const s = R.slopes; return [s.p2.down, s.p2.up, s.p3.down, s.p3.up, s.p5.up].every(([a, b]) => a < b && b < 0) && s.p5.down[1] > 0
      && R.calibration.fAp.every((f) => Math.abs(f - 1) < 0.006) && R.calibration.fAm.every((f) => Math.abs(f - 1) < 0.006); },
    why: 'At λ = 1 every one-sided slope is negative except λ_5 decreasing (max +0.015/unit, rows that do not bind); calibration factors within 0.6% of 1.',
  },
  {
    id: 'r7-honest-scope',
    holds: () => R.status === 'done' && /does not move Lambda/.test(R.verdict) && /PT Lambda <= 0\.2 stands/.test(R.verdict) && /NO QED/.test(R.verdict)
      && /sketch/.test(R.refereeKilled[4]) && /per-rectangle/.test(R.refereeKilled[0]),
    why: 'No Λ change; Theorem 4\'^λ graded as a sketch; the per-rectangle gap the referee closed is recorded; no QED.',
  },
]);

export default ROUTE_7;
