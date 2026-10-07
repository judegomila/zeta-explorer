/**
 * @fileoverview route-9-barrier-height-schedule-2026-10-08 — roadmap route 9 (batch 3): optimise the barrier height schedule h(t)
 * of the route-P Track A/B floors. One run plus one adversarial internal referee pass (not refuted, minor); the referee
 * corrections are applied below.
 *
 * Outcome: adding ONE optimised height set W4 (a 10-knot piecewise-linear multiplier of Raymond's PLAN) to the multi-height menu
 * lowers the PT-height route-P value from 0.145694083872924 to 0.145637425999752 (exact gain 14164468293/2.5·10^14 = 5.6657873172e-5);
 * all used certified height sets together give 0.145630653648379 (gain 6.3430224545e-5). W4 is an extra option next to the PLAN
 * sets (κ = 1, 0.94, 0.88 with their r2 floors), not a replacement: the consumer picks it on 7,443 of 74,567 substeps.
 * Λ < 0.145 is NOT certified.
 *
 * PROVED: nothing new. Multi-height licence as before: each certified table row is a valid source floor on its cell, the kernel
 *  inequality is applied at one height per substep (precedent: r7b-stack-consume reading X1_P0_97).
 * CERTIFIED (shared route-P ledger; G0-d family referee now passed on every new height set the consumer uses — W4, W5, ×1.06,
 *  ×1.03, ×0.94 — so the producer layer matches X1_P0_97's grade; joint-pairs, Track-A gains and table layers single-implementation
 *  but re-derived byte-identically from the archived probe files by the referee):
 *  - W4 alone: 18204678249969/(1.25·10^14) = 0.145637425999752; E1–E8 74,567 steps, 0 failures, altlog pass, heights used in
 *    [0.6336, 2.18] ⊂ [63/100, 11/5], window margin 2.06e-3, start margin 2.0e-6. W4: 321/321 cells, 97,263 G0-d checks, 0 failures.
 *  - all used sets: raw 72815326824189/(5·10^14), E6-altlog fails by 1e-15 → robust 145630653648379/10^15 = 0.145630653648379.
 *  - intermediate: X1_P0_97 alone 0.145677988338008; uniform-multiplier union 0.145640165389999; W4 + 0.97 0.145634670957569.
 * CONDITIONAL: G0-c, AF gaps, Lemma B as written, producer layer, RH-win, RH-head; r7 fullref admission (244 of 369 P47 floors WOL-
 *  certified). Under Polymath Thm 1.2, 0.1758354 and 0.1787854 do not move.
 * MEASURED: the 10-knot search (fixed knots, linear-in-h surrogate between menu heights 0.85–1.10, 4 Nelder–Mead starts + compass)
 *  saturates locally (iteration 2: ≈ 5e-7 in the model) — local, not global optimality (referee correction). Heights above PLAN help
 *  around the hard cells 417–424 (small-ρ λ = 2 kernels admissible), below PLAN in 430–465. Multipliers 0.85, 0.91, 1.10 never chosen.
 * HEURISTIC: transporting the r2 structured-floor excess to the new heights gives 0.1453754 (a further −2.55e-4); needs ≈ 128 new r2
 *  inner + WOL certificates (≈ 2 CPU-h each).
 * NOT ADDITIVE (referee correction to the next step): the sets enter the consumer as extra options (best rate per substep), so the
 *  route-9 gain cannot be added to route 3 / route 5 gains; a stacked value needs one joint consumer run plus E1–E8.
 *
 * PT Λ ≤ 0.2 stands; RH open; NO QED. Import-free. ROUTE_9_ASSERTIONS recompute the exact gains, the ordering of the certified
 * points, the W4 multiplier curve (knots, PLAN crossings, range) and the H2 range of the heights used.
 */

const big = (s) => { const [a, b] = String(s).split('/'); return [BigInt(a), BigInt(b ?? '1')]; };
const cmp = (x, y) => { const [a, b] = big(x), [c, d] = big(y); const l = a * d, r = c * b; return l < r ? -1 : l > r ? 1 : 0; };
const lt = (x, y) => cmp(x, y) < 0;
const subStr = (x, y) => { const [a, b] = big(x), [c, d] = big(y); const g = (p, q) => (q === 0n ? (p < 0n ? -p : p) : g(q, p % q));
  const n = a * d - c * b, m = b * d, k = g(n, m); return `${n / k}/${m / k}`; };
const exact15 = (s) => { const [a, b] = big(s); const n = a * 10n ** 15n; return n % b === 0n ? n / b : null; };
const V = (exact, dec, grade, label) => Object.freeze({ exact, dec, grade, label });
const E15 = (dec) => `${dec.replace('0.', '').replace(/^0+/, '')}/1000000000000000`;

export const ROUTE_9 = Object.freeze({
  id: 'route-9-barrier-height-schedule-2026-10-08',
  route: 9,
  date: '2026-10-08',
  title: 'Route 9: one optimised height set lowers route P to 0.145637425999752 (−5.67e-5); all sets 0.145630653648379',
  status: 'done',
  headline: 'Adding one optimised height set (a 10-knot piecewise-linear multiplier of PLAN) to the multi-height menu lowers the certified PT-height '
    + 'route-P value from 0.145694083872924 to 0.145637425999752 (−5.67e-5); all used certified height sets give 0.145630653648379 (−6.34e-5). '
    + 'Certified relative to the shared ledger, G0-d refereed on the new sets. Λ < 0.145 is not certified.',

  values: Object.freeze({
    baseline: V('36423520968231/250000000000000', '0.145694083872924', 'CERTIFIED', 'route-1 r7 (current PLAN sets)'),
    only097: V(E15('0.145677988338008'), '0.145677988338008', 'CERTIFIED', 'existing X1_P0_97 table added'),
    uniformUnion: V(E15('0.145640165389999'), '0.145640165389999', 'CERTIFIED', 'uniform-multiplier menu union'),
    w4: V('18204678249969/125000000000000', '0.145637425999752', 'CERTIFIED', 'W4 single optimised set'),
    w4plus097: V(E15('0.145634670957569'), '0.145634670957569', 'CERTIFIED', 'W4 + 0.97'),
    allRaw: V('72815326824189/500000000000000', '0.145630653648378', 'CERTIFIED (raw; E6-altlog off by 1e-15)', 'all used sets, raw U'),
    allRobust: V('145630653648379/1000000000000000', '0.145630653648379', 'CERTIFIED', 'all used sets, robust (r7 convention)'),
    r2Transport: V(null, '0.1453754', 'HEURISTIC', 'r2 excess transported to the new heights (not certified)'),
  }),
  gains: Object.freeze({ w4: '14164468293/250000000000000', allRobust: '63430224545/1000000000000000' }),
  w4: Object.freeze({
    knots: Object.freeze([280, 330, 380, 400, 410, 420, 430, 445, 465, 500]),
    mult: Object.freeze([0.9518, 0.9867, 1.0322, 1.0671, 1.0557, 1.0378, 0.9992, 0.928, 1.0009, 0.9878]),
    rounding: '1/200 (floor)', heightRange: Object.freeze([0.69, 1.245]), cells: 321, g0dChecks: 97263, usedSubsteps: 7443, totalSubsteps: 74567,
  }),
  heightsUsed: Object.freeze(['6336/10000', '218/100']),
  h2Range: Object.freeze(['63/100', '11/5']),
  g0dReferee: Object.freeze({ W4: 97263, W5: 97263, m106: 54843, m094: 121503, m103: 182103 }),

  refereeKilled: Object.freeze([
    '"same grade as X1_P0_97" — X1_P0_97 had passed the independent G0-d family referee, the route-9 sets had not; the referee ran G0-d on W4, W5, ×1.06, ×1.03, ×0.94 (0 failures), so only the producer layer now matches',
    '"one new schedule" read as a replacement — W4 is a fourth height set next to the PLAN sets; picked on 7,443 of 74,567 substeps',
    '"the Track-A-level schedule lever has converged" — measured local saturation for one fixed-knot 10-knot family and a linear surrogate, not global optimality',
    '"the extra sets enter additively" with route 3 / route 5 — wrong: best-rate-per-substep options; stacked values need one joint consumer run plus E1–E8',
    'menu heights span [0.595, 2.245], outside the tight H2 range — only used heights matter ([0.6336, 2.18] inside); 0.85, 0.91, 1.10 never chosen and not referee-checked',
  ]),
  nextStep: '(1) Stack W4/W5 and the used multiplier sets with the route-3 kernels, the extended 281-kernel grid and the route-5 3-band wall in ONE joint '
    + 'consumer run on the current campaign certfile, then E1–E8 (not additive). (2) Second-precision or second-driver replay of the W4 Track-B chain. '
    + '(3) r2-layer lever (heuristic −2.55e-4): certify r2 inner + WOL floors at the W4/0.97/0.94 heights for the ≈ 128 transported (cell, set) pairs in '
    + 'cells 181–365, highest use first (≈ 2 CPU-h each).',
  files: Object.freeze(['tmp/routes-b3-9-consume.py', 'tmp/routes-b3-9-search.py', 'tmp/routes-b3-9-bb.py', 'tmp/routes-b3-9-r2transport.py',
    'tmp/routes-b3-9-out/summary.json', 'tmp/routes-b3-9-out/plans/W4_single.json', 'tmp/routes-b3-9-out/archive/', 'tmp/routes-b3-9-out/final/',
    'tmp/routes-b3-ref-9-g0d-family.py', 'tmp/routes-b3-ref-9-rederive.sh', 'tmp/routes-b3-ref-9-out/']),
  verdict: 'The barrier height schedule is a real but small certified lever: one extra optimised height set lowers the PT-height route-P value from '
    + '0.145694083872924 to 0.145637425999752 (exact gain 5.6657873172e-5); all used certified height sets give 0.145630653648379 (gain 6.343e-5). '
    + 'Both pass E1–E8 against the shared ledger; G0-d refereed on the new sets; table layers single-implementation. The gain is an option union, not '
    + 'additive with routes 3 and 5. Λ < 0.145 is not certified. PT Lambda <= 0.2 stands; RH open; NO QED.',
});

const R = ROUTE_9;
const v = (k) => R.values[k].exact;
const mAt = (i) => { const { knots: k, mult: m } = R.w4; if (i <= k[0]) return m[0]; if (i >= k[k.length - 1]) return m[m.length - 1];
  const j = k.findIndex((x) => x >= i); return m[j - 1] + (m[j] - m[j - 1]) * (i - k[j - 1]) / (k[j] - k[j - 1]); };

export const ROUTE_9_ASSERTIONS = Object.freeze([
  {
    id: 'r9-values-exact',
    holds: () => Object.values(R.values).filter((x) => x.exact).every((x) => { const n = exact15(x.exact);
      return n !== null && `0.${String(n).padStart(15, '0')}` === x.dec; }),
    why: 'Every stated decimal is the exact 15-digit value of its rational (raw all-sets value 0.145630653648378 exactly).',
  },
  {
    id: 'r9-gains-exact',
    holds: () => subStr(v('baseline'), v('w4')) === R.gains.w4 && cmp(subStr(v('baseline'), v('allRobust')), R.gains.allRobust) === 0
      && cmp(v('allRaw'), v('allRobust')) < 0 && cmp(subStr(v('allRobust'), v('allRaw')), '1/500000000000000') <= 0,
    why: 'Gains 14164468293/2.5e14 = 5.6657873172e-5 (W4) and 6.3430224545e-5 (all sets, robust); robust − raw ≤ 2e-15 (E6-altlog convention).',
  },
  {
    id: 'r9-certified-ordering',
    holds: () => { const seq = ['baseline', 'only097', 'uniformUnion', 'w4', 'w4plus097', 'allRobust'];
      return seq.every((k, i) => i === 0 || lt(v(k), v(seq[i - 1]))) && lt('145/1000', v('allRobust'))
        && Math.abs(Number(R.values.allRobust.dec) - 0.145 - 6.30653648379e-4) < 1e-15 && Number(R.values.r2Transport.dec) < Number(R.values.allRobust.dec); },
    why: 'Each added option set lowers U (0.97 → union → W4 → W4+0.97 → all); all-sets value still 6.31e-4 above 0.145; the r2-transport what-if (heuristic) lies below.',
  },
  {
    id: 'r9-w4-curve',
    holds: () => { const { knots, mult } = R.w4; const cross = [];
      for (let i = 1; i < knots.length; i++) { const a = mult[i - 1] - 1, b = mult[i] - 1;
        if (a * b < 0) cross.push(knots[i - 1] + (knots[i] - knots[i - 1]) * a / (a - b)); }
      return knots.length === 10 && cross.length === 4 && cross[0] > 340 && cross[0] < 350 && cross[1] > 429 && cross[1] < 430
        && cross[2] > 464 && cross[2] < 465 && mAt(420) > 1 && mAt(445) < 0.93 && Math.min(...mult) >= 0.928 && Math.max(...mult) <= 1.0671
        && R.w4.usedSubsteps / R.w4.totalSubsteps < 0.1; },
    why: 'W4 multiplier crosses PLAN near cells 345, 430, 465, 467: above PLAN around the hard cells 417–424, below it on 430–465; range 0.928–1.0671; W4 picked on < 10% of substeps.',
  },
  {
    id: 'r9-h2-range',
    holds: () => cmp(R.h2Range[0], R.heightsUsed[0]) <= 0 && cmp(R.heightsUsed[1], R.h2Range[1]) <= 0
      && Object.values(R.g0dReferee).every((n) => n > 50000) && R.g0dReferee.W4 === R.w4.g0dChecks,
    why: 'Heights used [0.6336, 2.18] lie inside the tight Lemma H2 range [63/100, 11/5]; G0-d family referee ran > 5e4 checks per used set (W4: 97,263, 0 failures).',
  },
  {
    id: 'r9-honest-scope',
    holds: () => R.status === 'done' && /not additive/.test(R.verdict) && /not certified/.test(R.verdict) && /PT Lambda <= 0\.2 stands/.test(R.verdict)
      && /NO QED/.test(R.verdict) && R.values.r2Transport.grade === 'HEURISTIC' && /additively/.test(R.refereeKilled[3]),
    why: 'Λ < 0.145 not certified; option union not additive; r2 transport graded heuristic; no QED.',
  },
]);

export default ROUTE_9;
