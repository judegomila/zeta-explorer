/**
 * @fileoverview route-2-lowered-barrier-floor-2026-10-06 — roadmap route 2 (batch 1): feed the lowered barrier floor
 * (compact slab [X, X+1] × [f, 1] × [0, 129/800], certified down to f = 0.025 in tmp/floor-lowering) into route P and into
 * the Polymath15 Thm 1.2 composition. One run plus one adversarial internal referee pass (not refuted, minor); the
 * referee corrections are applied below.
 *
 * Outcome: the barrier floor is not an input of route P, and under Thm 1.2 it enters only through containment, which does
 * not bind. No Λ value moves.
 *
 * PROVED (project-internal, one internal referee pass):
 *  - Containment: the floor-f slab supplies hypothesis (iii) of Thm 1.2 iff t0 ≤ 129/800 and f² ≤ y0² (the gate uses the
 *    strict form f² < y0²). (y0² + 2t0 < 1 is a range condition of (ii)/(iii), not a containment condition: referee wording fix.)
 *  - Hybrid argument, referee-corrected: using route P's band barrier B(t0) as hypothesis (ii) gives Λ ≤ t0 + B(t0)/2 with
 *    t0 + B(t0)/2 ≥ U − Σ(jumps), Σ(jumps) ≲ 1e-24 (E4 ceiling 2^-96 plus the Leibniz A18 tail over ~74,181 knots). The
 *    original "B only jumps upward ⇒ ≥ U exactly" step had the wrong direction; exact ≥ U additionally needs min c_k ≳ 1.3e-15
 *    (not checked). Either way route P cannot be improved this way.
 * CERTIFIED: exact rational composition at floors 0.1809 … 0.022 (Λ = 893927/5000000 and 879177/5000000 at every floor);
 *  exact route-P consumer re-run (P-cert, P-cond byte-identical, also on the live repo inputs by the referee); slab floors
 *  0.174336 … 0.025 CLOSED SLAB CERTIFIED with binding-verifier replays (Arb, earlier study, reused); floor 0.022 is
 *  producer-certified only (no binding-verifier replay, no prop612 cross-check) and is graded below the others;
 *  referee Arb lane row (TRIANGLE weight, p17 mollifier, t = 1583/10000, N = 690988, 256 bit): lbound at y = 0.18090 is
 *  −0.02175451616866011 ± 2.4e-27, i.e. the existing lane method fails there (it does not show (ii) false).
 * CONDITIONAL: every route-P value on the shared ledger (G0 chain, Lemma B.1–B.3 unrefereed, (F) floors, RH-win under FLINT
 *  3.6.0); P-cond also on WOL-C (369 P47 floors). Ceilings t0 + f²/2 need hypothesis (ii) at y0 = f, which the project has not
 *  certified at any of these y0.
 * MEASURED: float64 scout lane scan at N0 = 690988, t0 = 129/800 (T = −2.33e-2 at y0 = 0.1809, ≈ 3e4 × the stored floor).
 * HEURISTIC: route 5 (slabs as walls) would cost ≈ f²/2 at the de Bruijn ending, more than the 2.02e-4 sub-0.145 margin.
 *
 * PT Λ ≤ 0.2 is the accepted benchmark; 0.1758354 and 0.1787854 remain computer-assisted candidates; RH open; NO QED.
 * Import-free. ROUTE_2_ASSERTIONS recompute the exact composition, ceilings, margins and orderings live.
 */

const big = (s) => { if (Array.isArray(s)) return s; const [a, b] = String(s).split('/'); return [BigInt(a), BigInt(b ?? '1')]; };
const gcd = (a, b) => { a = a < 0n ? -a : a; b = b < 0n ? -b : b; while (b) [a, b] = [b, a % b]; return a; };
const norm = ([a, b]) => { const g = gcd(a, b) || 1n; return [a / g, b / g]; };
const add = (x, y) => { const [a, b] = big(x), [c, d] = big(y); return norm([a * d + c * b, b * d]); };
const sub = (x, y) => { const [a, b] = big(x), [c, d] = big(y); return norm([a * d - c * b, b * d]); };
const mul = (x, y) => { const [a, b] = big(x), [c, d] = big(y); return norm([a * c, b * d]); };
const cmp = (x, y) => { const [a, b] = big(x), [c, d] = big(y); const l = a * d, r = c * b; return l < r ? -1 : l > r ? 1 : 0; };
const eq = (x, y) => cmp(x, y) === 0;
const num = (x) => { const [a, b] = big(x); return Number(a) / Number(b); };
const dec = (s) => { const [i, f = ''] = s.split('.'); return `${BigInt(i + f)}/${10n ** BigInt(f.length)}`; };
const half = (x) => mul(x, '1/2');

const F = (f, prisms, grade) => Object.freeze({ f, prisms, grade });

export const ROUTE_2 = Object.freeze({
  id: 'route-2-lowered-barrier-floor-2026-10-06',
  route: 2,
  date: '2026-10-06',
  title: 'Route 2: the lowered barrier floor does not move route P or the Polymath Λ values',
  status: 'done',
  headline: 'Lowering the compact-slab barrier floor (certified to 0.025) leaves route P unchanged: the route-P consumers have no floor input, '
    + 'and a hybrid using route P\'s band barrier as hypothesis (ii) cannot beat U (up to ≈ 1e-24). Under Polymath Thm 1.2 the floor enters only '
    + 'through containment f² < y0², which holds at every certified floor because the certified (ii) row has y0 = √(87677/2500000) = 0.18727199; '
    + 'so 0.1787854 and 0.1758354 do not move. A lower floor pays only after an improved mollifier certifies (ii) below y0 = 0.1809.',

  y0sq: '87677/2500000', y0Approx: 0.18727199, t0Base: '129/800', t0YTransfer: '1583/10000',
  lambdaBase: '893927/5000000', lambdaYTransfer: '879177/5000000',

  // Slab floors (tmp/floor-lowering, Arb, fail-closed; reused, not re-run). 0.021 / 0.020: no verdict (rc = 143).
  floors: Object.freeze([
    F('1809/10000', null, 'sealed package barrier'),
    F('174336/1000000', 921, 'CLOSED SLAB CERTIFIED + binding-verifier replay'),
    F('17/100', 948, 'CLOSED SLAB CERTIFIED + binding-verifier replay'),
    F('165/1000', 979, 'CLOSED SLAB CERTIFIED + binding-verifier replay'),
    F('3/100', 3144, 'CLOSED SLAB CERTIFIED + binding-verifier replay'),
    F('25/1000', 3770, 'CLOSED SLAB CERTIFIED + binding-verifier replay (prop612 cross-check killed, rc = 143)'),
    F('22/1000', 4425, 'producer-certified only (no binding-verifier replay, no prop612 cross-check); graded below 0.025–0.174336'),
  ]),
  floorsNoVerdict: Object.freeze(['21/1000', '20/1000']),

  // Barrier-limited ceilings t0 + f²/2 IF (ii) were certified at y0 = f (not available in this project).
  ceilings: Object.freeze({
    '129/800': Object.freeze({ '1809/10000': '35522481/200000000', '174336/1000000': '1378488441/7812500000', '17/100': '1757/10000',
      '165/1000': '13989/80000', '3/100': '1617/10000', '25/1000': '517/3200', '22/1000': '40373/250000' }),
    '1583/10000': Object.freeze({ '1809/10000': '34932481/200000000', '174336/1000000': '677720783/3906250000', '17/100': '691/4000',
      '165/1000': '13753/80000', '3/100': '127/800', '25/1000': '12689/80000', '22/1000': '79271/500000' }),
  }),
  floorSquareMargins: Object.freeze({ '1809/10000': '234599/100000000', '25/1000': '172229/5000000', '22/1000': '86467/2500000' }),
  outsideClaim: Object.freeze({ at1809: '0.1776124', at174336: '0.1764466',
    note: 'outside numbers equal 129/800 + f²/2; they need (ii) at y0 = f; 0.1776124 is 5e-9 below the exact 0.177612405 (as an upper bound it should read 0.1776125)' }),

  routeP: Object.freeze({
    Pcert: '146660920737233/1000000000000000', PcertKeys: 337, PcertLastCell: 586,
    Pcond: '5791903551831/40000000000000', PcondKeys: 2074, PcondLastCell: 579,
    consumerFloorInputs: 0, // grep of r3-outer-mixed.py, r2-floor-consume.py, b145-B-lib.py for slab / 0.1809 / 129/800 / y0
    marginSub0145: 2.02411204225e-4,
  }),
  hybrid: Object.freeze({ jumpSumBound: 1e-24, knots: 74181, minCkForExact: 1.3e-15, minCkChecked: false }),

  lane: Object.freeze({
    scout: Object.freeze({ grade: 'MEASURED (float64 scout, t0 = 129/800, N0 = 690988)', storedT: 7.91e-7,
      rows: Object.freeze([[0.1809, -2.33e-2], [0.174336, -4.84e-2], [0.17, -6.57e-2], [0.165, -8.63e-2]]) }),
    arbReferee: Object.freeze({ grade: 'CERTIFIED (Arb 256-bit) single row; method failure, not a proof that (ii) fails',
      ySq: '327248/10000000', lbound: -0.02175451616866011, radius: 2.4e-27, L12AtCertifiedY0: 1.872347e-3, at174336: 'UNCERT' }),
  }),

  heuristicRoute5Cost: Object.freeze({ '22/1000': 2.42e-4, '25/1000': 3.125e-4 }),

  refereeKilled: Object.freeze([
    'the "B only jumps upward ⇒ t0 + B(t0)/2 ≥ U exactly" step (wrong direction; now ≥ U − 1e-24, exact needs min c_k ≳ 1.3e-15, unchecked)',
    'y0 mislabelled 0.187274 (exact √(87677/2500000) = 0.18727199)',
    'floor 0.022 presented on par with the others (no binding-verifier replay / prop612 cross-check)',
    'y0² + 2t0 < 1 listed as a containment condition',
  ]),
  nextStep: 'Use the lowered floor in the Polymath fixed-time track: certify hypothesis (ii) at y0 < 0.1809 with an improved mollifier '
    + '(scout ρ = 1.115 lever plus the y-transfer). Then the 0.174336 or 0.165 slab caps the bound at 0.17350 or 0.17191 (t0 = 0.1583). '
    + 'For route 5, first write a floor-wall variant of Lemmas B.1/B.3 and check its ≈ f²/2 cost against the 2.02e-4 margin.',
  files: Object.freeze(['tmp/routes-b1-r2-polymath-consumer.py', 'tmp/routes-b1-r2-lane-yscan.py', 'tmp/routes-b1-r2-summary.json',
    'tmp/routes-b1-ref2-Pcert.log', 'tmp/routes-b1-ref2-Pcond.log', 'tmp/routes-b1-ref2-lane-y1809-dbg.log', 'tmp/floor-lowering/README.md',
    'scripts/lambda-01758354-gate.mjs', 'formalization/paper/lemma-B-two-band.md']),
  verdict: 'Route 2 as written does not move Λ. The compact-slab floor is not an input of route P (consumers have 0 floor inputs; Lemma B '
    + 'uses the full-height wall at X), and a Polymath-style hybrid cannot beat U up to ≈ 1e-24. Route-P values reproduced exactly: P-cert '
    + '0.146660920737233; P-cond 0.144797588795775 (conditional on WOL-C), margin 2.02e-4 below 0.145. Under Thm 1.2 the floor enters only '
    + 'through containment; every certified floor lies below y0 = 0.18727199, so 0.1787854 and 0.1758354 stay put. The existing lane fails at '
    + 'y0 = 0.1809 (Arb row lbound −0.0218). PT Lambda <= 0.2 stands; 0.1758354 and 0.1787854 remain computer-assisted candidates; RH open; NO QED.',
});

const R = ROUTE_2;
const fl = R.floors.map((x) => x.f);

export const ROUTE_2_ASSERTIONS = Object.freeze([
  {
    id: 'r2-lambda-composition',
    holds: () => eq(add(R.t0Base, half(R.y0sq)), R.lambdaBase) && eq(add(R.t0YTransfer, half(R.y0sq)), R.lambdaYTransfer)
      && eq(R.lambdaBase, dec('0.1787854')) && eq(R.lambdaYTransfer, dec('0.1758354')),
    why: 'Λ = t0 + y0²/2 with y0² = 87677/2500000: 129/800 → 893927/5000000 = 0.1787854; 1583/10000 → 879177/5000000 = 0.1758354.',
  },
  {
    id: 'r2-containment-every-floor',
    holds: () => fl.every((f) => cmp(mul(f, f), R.y0sq) < 0) && cmp(R.t0YTransfer, R.t0Base) <= 0
      && Math.abs(Math.sqrt(num(R.y0sq)) - R.y0Approx) < 5e-9,
    why: 'f² < y0² for every certified floor (0.1809 … 0.022) and t0 ≤ 129/800 on both rows, so Λ does not depend on the floor; y0 = 0.18727199.',
  },
  {
    id: 'r2-ceilings-exact',
    holds: () => Object.entries(R.ceilings).every(([t0, row]) => fl.every((f) => eq(add(t0, half(mul(f, f))), row[f])))
      && fl.every((f) => cmp(R.ceilings['129/800'][f], R.lambdaBase) < 0 && cmp(R.ceilings['1583/10000'][f], R.lambdaYTransfer) < 0),
    why: 'Every ceiling equals t0 + f²/2 exactly and lies below the Λ of its row (0.1787854 / 0.1758354); none is available without (ii) at y0 = f.',
  },
  {
    id: 'r2-floor-square-margins',
    holds: () => Object.entries(R.floorSquareMargins).every(([f, m]) => eq(sub(R.y0sq, mul(f, f)), m)),
    why: 'y0² − f² = 234599/10^8 at 0.1809, 172229/5000000 at 0.025, 86467/2500000 at 0.022.',
  },
  {
    id: 'r2-outside-rounding',
    holds: () => cmp(dec(R.outsideClaim.at1809), R.ceilings['129/800']['1809/10000']) < 0
      && Math.abs(num(sub(R.ceilings['129/800']['1809/10000'], dec(R.outsideClaim.at1809))) - 5e-9) < 1e-15
      && cmp(dec(R.outsideClaim.at174336), R.ceilings['129/800']['174336/1000000']) > 0,
    why: '0.1776124 is 5e-9 below 129/800 + 0.1809²/2 (rounded the wrong way for an upper bound); 0.1764466 rounds up correctly.',
  },
  {
    id: 'r2-routeP-unchanged',
    holds: () => R.routeP.consumerFloorInputs === 0 && cmp(R.routeP.Pcond, '145/1000') < 0 && cmp('145/1000', R.routeP.Pcert) < 0
      && Math.abs(num(sub('145/1000', R.routeP.Pcond)) - R.routeP.marginSub0145) < 1e-15,
    why: 'Route-P consumers read no floor; P-cond = 0.144797588795775 (WOL-C assumed) is 2.02411204225e-4 below 0.145; P-cert stays above.',
  },
  {
    id: 'r2-route5-heuristic-cost',
    holds: () => Object.entries(R.heuristicRoute5Cost).every(([f, c]) => Math.abs(num(half(mul(f, f))) - c) < 1e-15 && c > R.routeP.marginSub0145),
    why: 'A slab used as a wall would cost ≈ f²/2 (2.42e-4 at 0.022, 3.125e-4 at 0.025), above the 2.02e-4 sub-0.145 margin (HEURISTIC).',
  },
  {
    id: 'r2-lane-fails-at-lower-y0',
    holds: () => R.lane.arbReferee.lbound + R.lane.arbReferee.radius < 0 && R.lane.arbReferee.L12AtCertifiedY0 > 0
      && Math.abs(Math.sqrt(num(R.lane.arbReferee.ySq)) - 0.1809) < 1e-5 && R.lane.scout.rows.every(([, T]) => T < 0)
      && Math.abs(R.lane.scout.rows[0][1]) / R.lane.scout.storedT > 2.9e4,
    why: 'The existing lane certifies (ii) at y0 = 0.18727 (L12 = +1.87e-3) but its Arb lower bound is negative at y = 0.1809; scout deficit ≈ 3e4 × stored floor.',
  },
  {
    id: 'r2-referee-scope',
    holds: () => R.hybrid.minCkChecked === false && R.hybrid.jumpSumBound <= 1e-24 && /producer-certified only/.test(R.floors[6].grade)
      && R.floorsNoVerdict.length === 2 && /PT Lambda <= 0\.2 stands/.test(R.verdict) && /NO QED/.test(R.verdict) && R.status === 'done',
    why: 'Referee corrections carried: hybrid proved up to 1e-24 only; floor 0.022 graded lower; 0.021/0.020 have no verdict; no QED.',
  },
]);

export default ROUTE_2;
