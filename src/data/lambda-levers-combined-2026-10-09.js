/**
 * @fileoverview lambda-levers-combined-2026-10-09 — batch 4 joint consumer run of the certified route-P levers at PT height:
 * route-1 campaign certificates + route-5 3-band layout + route-3 kernels (281 certified λ < 2 kernels) + route 9's six refereed height
 * sets, plus the newer campaign certificates. One run plus one adversarial internal referee pass (not refuted, minor; referee
 * corrections applied), and a recording re-run on a fresh collect (collect6, same commands as the refereed runs; not separately refereed).
 *
 * Outcome:
 *  - Route 9 adds EXACTLY 0 once the route-3 kernels are present: J1 (with the six route-9 sets) = J0 (without) on collect4, and R1 = R0 on
 *    the referee's collect5, as exact rationals with identical usage; no route-9 option is chosen on any substep (best route-9 rate ≤ 0.99326
 *    of the chosen rate). Route 9 alone was worth −6.06e-5 on route P + campaign and −5.24e-5 on route P + campaign + route 5.
 *  - Certified joint value with the newest campaign certificates (collect6, campaign snapshot 2026-10-07 06:54: 15 floors done, 8
 *    budget-stopped): Λ ≤ 36319092148717/250000000000000 = 0.145276368594868. Referee value on collect5: 36329040337597/(2.5·10^14) = 0.145316161350388
 *    (supersedes the collect4 run value 0.145322418219213, which remains valid for its certfile). Λ < 0.145 is NOT certified.
 *  - MEASURED projection (hypothetical margins, collect6 scenario certfiles, 3-band, 281 kernels): 114 missing floors at target (incomplete ones at current margins) → 0.144963731516124; all remaining floors at target → 0.144962368494868 (both below 0.145, hypothetical; route-9 sets not included — on collect4 they changed the projections by exactly 0).
 *
 * PROVED: nothing new. Removing options that are never chosen cannot change a first-admissible-by-rate choice, so J1 = J0 is forced once
 *  no route-9 option is picked; the multi-height licence already in use covers extra height sets.
 * CERTIFIED (relative to the shared route-P ledger, hence conditional: G0-c, G0-d (OP), AF gaps, Lemma B, producer layer, RH-win, RH-head,
 *  single v4c engine for route-1 floors; 3-band layout: Theorem B'_m (unrefereed) and RH in W2 via Route 2; single implementation
 *  tmp/routes-b3-combine-consume.py; internal referee only):
 *  - collect6 joint (no route-9 sets, which add 0): 36319092148717/250000000000000 (raw 36319092148717/250000000000000; 74,382 steps; E1–E8 0 failures; heights
 *    [396/625, 109/50]); route P + campaign alone on collect6 18191932325061/(1.25·10^14) = 0.145535458600488 (255 certified floors, 0 coverage
 *    holes, certfile bad 0, independent rebuild agrees, E1–E8 and altlog 0 failures, 74,515 steps).
 *  - collect5 (referee): joint 0.145316161350388 with and without route 9 (74,402 steps, one E6-altlog flag absorbed by U_robust); route P +
 *    campaign 0.14566191661303.
 *  - collect4 (run): J1 = J0 = 0.145322418219213 (74,406 steps, 0 failures; = batch-3 k3 with the fixed guard); decomposition k8
 *    0.145681937488254 → D2 (+ route 9) 0.145621339085377; C3 (+ route 5) 0.145619402165476 → D3 (+ route 9) 0.145567012417505 (one
 *    E6-altlog flag, absorbed). --extra path check V1 reproduces route 9's W4 value 18204678249969/(1.25·10^14) exactly.
 *  - PASS guard now strict (pass_ok: x is True or x == 'True') on the three route-P consumer-path guards; 12-case unit test; all 281
 *    kernels and the centre certificate pass. On disk PASS is a JSON boolean (342 true / 338 false), so the old guard never misfired; a
 *    fourth truthiness filter remains in tmp/r3-bb-replay.py mh_catalog() (MH/route-5 band path; all 10 MH PASS values are boolean True).
 * CONDITIONAL: all certified values carry the ledger conditions above; the 3-band value also relies on the recorded X165mid
 *  (0.144912451862679) and U2 (0.144254643222956) replays of 2026-10-01 (tables deleted, not re-run); band 1 binds. Route-9 tables are
 *  single-implementation (they play no part in the value).
 * MEASURED: D1 diagnostic — route-9 options offered on all 74,406 substeps over 582 cells, best route-9 rate ≤ 0.99326 of the chosen rate
 *  (cell 293; cells 181–218 at ≈ 0.989–0.990); D1 counts only generator-B route-9 options, the zero-choice claim is confirmed by the usage
 *  dictionaries. Projections above. Collect4 held 11 incomplete partial floors (201–208, 249, 251, 254), not 5.
 * HEURISTIC: route 9 could matter again only if the route-3 kernel tables were certified at route-9 heights (W4, ×0.97, ×0.94) with Lemma H2
 *  re-checked; gain likely small (route-9 rates within 0.7–1.1% in cells 181–218, 287–312). Route 9's r2-transport idea untested here.
 *
 * PT Λ ≤ 0.2 stands; RH open; NO QED. Import-free. LAMBDA_LEVERS_JOINT_ASSERTIONS recompute the route-9 marginals, the usage sums, the
 * supersession chain collect4 → collect5 → collect6, the projection shifts and the strict PASS guard live, in exact rationals.
 */

const big = (s) => { if (Array.isArray(s)) return s; const [a, b] = String(s).split('/'); return [BigInt(a), BigInt(b ?? '1')]; };
const cmp = (x, y) => { const [a, b] = big(x), [c, d] = big(y); const l = a * d, r = c * b; return l < r ? -1 : l > r ? 1 : 0; };
const lt = (x, y) => cmp(x, y) < 0;
const sub = (x, y) => { const [a, b] = big(x), [c, d] = big(y); return [a * d - c * b, b * d]; };
const num = (x) => { const [a, b] = big(x); return Number(a * 10n ** 18n / b) / 1e18; };
const exact15 = (s) => { const [a, b] = big(s); const n = a * 10n ** 15n; return n % b === 0n ? n / b : null; };
const V = (exact, dec, grade, label) => Object.freeze({ exact, dec, grade, label });
const E15 = (dec) => `${dec.replace('0.', '').replace(/^0+/, '')}/1000000000000000`;
// strict PASS guard, ported from tmp/routes-b2-r3-consume.py pass_ok()
const passOk = (x) => x === true || x === 'True';

export const LAMBDA_LEVERS_JOINT = Object.freeze({
  id: 'lambda-levers-combined-2026-10-09',
  date: '2026-10-09',
  title: 'Joint route-P levers at PT height: route 9 adds 0; Λ ≤ 0.145276368594868 with the newest campaign certificates (certified relative to the ledger)',
  status: 'done',
  headline: 'One joint consumer run adds route 9\'s six refereed height sets to the route-1 campaign + route 5 (3 bands) + route 3 (281 kernels) stack: '
    + 'route 9 changes the value by exactly 0 (never chosen; route-3 kernels dominate). With the newest campaign certificates (15 floors done) the certified '
    + 'value is Λ ≤ 0.145276368594868 at PT height (relative to the shared ledger, hence conditional; single implementation, internal referee). '
    + 'If the remaining campaign floors reach target the measured projection is 0.144962368494868 to 0.144963731516124. Λ < 0.145 is not certified.',

  values: Object.freeze({
    batch3: V(E15('0.145322418219213'), '0.145322418219213', 'CERTIFIED', 'batch-3 k3 (collect3 certfile)'),
    j1Collect4: V(E15('0.145322418219213'), '0.145322418219213', 'CERTIFIED', 'J1 = J0: joint with/without route 9, collect4 (= collect3) certfile'),
    jointCollect5: V('36329040337597/250000000000000', '0.145316161350388', 'CERTIFIED', 'R1 = R0 (referee): joint with/without route 9, collect5'),
    jointCollect5Raw: V(E15('0.145316161350387'), '0.145316161350387', 'CERTIFIED (raw U; robust value one ULP above)', 'R1/R0 raw U'),
    jointCollect6: V('36319092148717/250000000000000', '0.145276368594868', 'CERTIFIED (recording re-run, same commands; not separately refereed)', 'Q0: joint, collect6, no route-9 sets (they add 0)'),
    routePc4: V('72840968744127/500000000000000', '0.145681937488254', 'CERTIFIED', 'k8: route P + campaign, collect4'),
    routePc5: V('14566191661303/100000000000000', '0.145661916613030', 'CERTIFIED', 'route P + campaign, collect5 (referee)'),
    routePc6: V('18191932325061/125000000000000', '0.145535458600488', 'CERTIFIED', 'route P + campaign, collect6'),
    d2: V(E15('0.145621339085377'), '0.145621339085377', 'CERTIFIED', 'D2: route P + campaign + route 9, collect4'),
    c3: V(E15('0.145619402165476'), '0.145619402165476', 'CERTIFIED', 'C3: route P + campaign + route 5, collect4'),
    d3: V(E15('0.145567012417505'), '0.145567012417505', 'CERTIFIED (one E6-altlog flag, absorbed)', 'D3: + route 9, collect4'),
    v1W4: V('18204678249969/125000000000000', '0.145637425999752', 'CERTIFIED', 'V1: --extra path reproduces route 9 W4'),
    projAllC4: V('28992713483773/200000000000000', '0.144963567418865', 'MEASURED (hypothetical)', 'PA9 = PA0: all floors at target, collect4'),
    projMissingC4: V(E15('0.144966396639493'), '0.144966396639493', 'MEASURED (hypothetical)', 'PM9 = PM0: missing at target, collect4'),
    projAllB3: V('72481783718497/500000000000000', '0.144963567436994', 'MEASURED (hypothetical)', 'batch-3 i3'),
    projMissingB3: V(E15('0.144966582977753'), '0.144966582977753', 'MEASURED (hypothetical)', 'batch-3 j4'),
    projMissingC6: V('36240932879031/250000000000000', '0.144963731516124', 'MEASURED (hypothetical)', 'PM: 114 missing at target, incomplete at current margins, collect6 (74222 steps, 0 failures)'),
    projAllC6: V('36240592123717/250000000000000', '0.144962368494868', 'MEASURED (hypothetical)', 'PA: all remaining floors at target, collect6 (74221 steps, 0 failures)'),
    scenTargetRoutePc6: V('28998714426367/200000000000000', '0.144993572131835', 'MEASURED (hypothetical)', 'route P alone, collect6 scen_target'),
    scenMissingRoutePc6: V('72497600653459/500000000000000', '0.144995201306918', 'MEASURED (hypothetical)', 'route P alone, collect6 scen_target_missing (114 missing at target)'),
  }),
  usage: Object.freeze({
    j1Collect4: Object.freeze({ 1: 34305, 0.88: 14208, 0.94: 12220, multi: 13673, steps: 74406 }),
    jointCollect5: Object.freeze({ 1: 34308, 0.88: 14208, 0.94: 12348, multi: 13538, steps: 74402 }),
    jointCollect6: Object.freeze({ 1: 34328, 0.88: 14720, 0.94: 12992, multi: 12342, steps: 74382 }),
  }),
  campaign: Object.freeze({
    collect4: Object.freeze({ certified: 244, complete: 233, incomplete: Object.freeze([201, 202, 203, 204, 205, 206, 207, 208, 249, 251, 254]) }),
    collect5: Object.freeze({ certified: 245, missing: 124, complete: 235, incomplete: Object.freeze([201, 202, 203, 204, 205, 206, 207, 208, 251, 254]) }),
    collect6: Object.freeze({ certified: 255, missing: 114, complete: 246, incomplete: Object.freeze([201, 202, 203, 204, 205, 206, 207, 208, 254]) }),
    snapshot: '2026-10-07 06:54 (status.tsv): 15 done, 8 budget-stopped, 12 running, 103 pending; 12 workers, 29.7 GB',
  }),
  route9: Object.freeze({ sets: Object.freeze(['X1_P0_97', 'x0.94', 'x1.03', 'x1.06', 'W4', 'W5']), substepsOffered: 74406, chosen: 0, bestRateRatio: 0.99326, cells: 582 }),
  guardTest: Object.freeze({ accept: Object.freeze([true, 'True']), reject: Object.freeze(['False', 'false', 'true', 'True ', 1, 1.0, 'PASS', null, 0, false]),
    passCensus: Object.freeze({ true: 342, false: 338 }), kernelsAllTrue: 281 }),

  refereeKilled: Object.freeze([
    'certified value out of date by delivery: floors 249 (cell 461) and 107 (cell 324) finished after collect4; collect5 gives 0.145316161350388 (6.26e-6 below 0.145322418219213); superseded again here by collect6',
    'collect4 "5 budget-stopped partials" — 11 incomplete floors (201–208, 249, 251, 254); wording only',
    '"applied at all three kernel-certificate guards" — the three on the route-P consumer path; a truthiness filter remains in tmp/r3-bb-replay.py mh_catalog() (MH band path, never misfires)',
    'D1 counts only generator-B route-9 options — zero-choice confirmed independently by the J1/R1 usage dictionaries',
    'projections from collect4 scenario certfiles slightly stale — replaced here by collect6 projections',
  ]),
  nextStep: '(1) As campaign floors finish: tmp/route1-campaign/collect.sh into collectN, then routes-b3-combine-consume.py on collectN/merge/certfile_fullref.json '
    + '(tmp/routes-b4-rec-joint-run.sh; ≈ 10 min collect + ≈ 17 min consumer, ≤ 2 procs); the route-9 --extra sets can be dropped (they add 0). (2) Re-replay X165mid and '
    + 'U2 from regenerated tables. (3) Make r3-bb-replay mh_catalog() use the strict pass_ok. (4) Route 9 would matter again only with route-3 kernel tables certified at its heights.',
  files: Object.freeze(['tmp/routes-b2-r3-consume.py', 'tmp/routes-b3-combine-consume.py', 'tmp/routes-b4-joint-out/summary.json', 'tmp/routes-b4-joint-out/J1_joint_c4.json',
    'tmp/routes-b4-joint-out/J0_ctrl_c4.json', 'tmp/routes-b4-joint-out/D1_joint_diag.json', 'tmp/routes-b4-joint-out/guardtest.json', 'tmp/routes-b4-ref-joint-run.sh',
    'tmp/routes-b4-ref-joint-out/R1_c5_r9.json', 'tmp/routes-b4-ref-joint-out/R0_c5.json', 'tmp/routes-b4-rec-joint-run.sh', 'tmp/routes-b4-rec-joint-proj.sh',
    'tmp/routes-b4-rec-joint-out/Q0_c6.json', 'tmp/routes-b4-rec-joint-out/collect6/', 'tmp/routes-b4-rec-joint-out/PM_c6.json', 'tmp/routes-b4-rec-joint-out/PA_c6.json']),
  verdict: 'Certified relative to the shared ledger (hence conditional), single implementation, internal referee: Λ ≤ 0.145276368594868 at PT height with the newest campaign '
    + 'certificates (collect6; referee value on collect5 0.145316161350388; collect4 run value 0.145322418219213 valid for its certfile). Route 9 adds exactly 0 in the joint '
    + 'run (never chosen; route-3 kernels dominate). Measured projection when the campaign finishes: 0.144962368494868 to 0.144963731516124 (below 0.145, hypothetical). Λ < 0.145 is not certified. PT Lambda <= 0.2 stands; RH open; NO QED.',
});

const C = LAMBDA_LEVERS_JOINT;
const v = (k) => C.values[k].exact;
const near = (x, target, tol) => Math.abs(num(x) - target) < tol;
const usageSum = (u) => [u[1], u[0.88], u[0.94], u.multi].reduce((a, b) => a + b, 0);

export const LAMBDA_LEVERS_JOINT_ASSERTIONS = Object.freeze([
  {
    id: 'llj-values-exact',
    holds: () => Object.values(C.values).every((x) => { const n = exact15(x.exact); return n !== null && `0.${String(n).padStart(15, '0')}` === x.dec; }),
    why: 'Every stated decimal is the exact 15-digit value of its rational.',
  },
  {
    id: 'llj-route9-marginals',
    holds: () => near(sub(v('d2'), v('routePc4')), -6.0598402877e-5, 1e-15) && near(sub(v('d3'), v('c3')), -5.2389747971e-5, 1e-15)
      && cmp(v('j1Collect4'), v('batch3')) === 0 && C.route9.chosen === 0 && C.route9.bestRateRatio < 1 && lt(v('d3'), v('d2')),
    why: 'Route 9 worth −6.0598402877e-5 on route P + campaign and −5.2389747971e-5 with route 5; 0 in the joint run (J1 = J0 = batch-3 k3; no option chosen, best rate ratio 0.99326).',
  },
  {
    id: 'llj-usage-sums',
    holds: () => Object.values(C.usage).every((u) => usageSum(u) === u.steps) && C.usage.j1Collect4[0.88] === C.usage.jointCollect5[0.88],
    why: 'Per-height usage sums to the step count: 34,305 + 14,208 + 12,220 + 13,673 = 74,406 (collect4); 74,402 (collect5); collect6 likewise.',
  },
  {
    id: 'llj-supersession',
    holds: () => lt(v('jointCollect6'), v('jointCollect5')) && lt(v('jointCollect5'), v('j1Collect4')) && near(sub(v('j1Collect4'), v('jointCollect5')), 6.256868825e-6, 1e-15)
      && lt(v('routePc6'), v('routePc5')) && lt(v('routePc5'), v('routePc4')) && lt(v('jointCollect6'), v('routePc6'))
      && near(sub(v('jointCollect5'), v('jointCollect5Raw')), 1e-15, 1e-17) && lt('145/1000', v('jointCollect6'))
      && C.campaign.collect6.certified === C.campaign.collect6.complete + C.campaign.collect6.incomplete.length
      && C.campaign.collect4.certified === C.campaign.collect4.complete + C.campaign.collect4.incomplete.length
      && C.campaign.collect6.certified + C.campaign.collect6.missing === 369 && C.campaign.collect5.certified + C.campaign.collect5.missing === 369,
    why: 'collect4 0.145322418219213 > collect5 0.145316161350388 (−6.26e-6) > collect6; route P + campaign falls 0.1456819 → 0.1456619 → 0.1455355; still above 0.145; 244 = 233 + 11, 255 = 246 + 9; 369 floors.',
  },
  {
    id: 'llj-projection',
    holds: () => near(sub(v('projAllC4'), v('projAllB3')), -1.8129e-11, 1e-15) && near(sub(v('projMissingC4'), v('projMissingB3')), -1.86338260e-7, 1e-15)
      && lt(v('projAllC4'), '145/1000') && lt(v('projMissingC4'), '145/1000') && C.values.projAllC4.grade.startsWith('MEASURED') && lt(v('projMissingC6'), '145/1000') && lt(v('projMissingC6'), v('projMissingC4')) && lt(v('projAllC6'), '145/1000') && cmp(v('projAllC6'), v('projMissingC6')) <= 0,
    why: 'Projections stay below 0.145 (measured, hypothetical margins): collect4 0.144963567418865 / 0.144966396639493 (−1.8e-11 / −1.86e-7 vs batch 3); collect6 missing-at-target 0.144963731516124; collect6 all-at-target 0.144962368494868.',
  },
  {
    id: 'llj-pass-guard',
    holds: () => C.guardTest.accept.every(passOk) && !C.guardTest.reject.some(passOk) && C.guardTest.reject.filter((x) => Boolean(x)).length >= 6
      && C.guardTest.passCensus.true + C.guardTest.passCensus.false === 680,
    why: 'Strict guard accepts only true / \'True\' and rejects \'False\', \'false\', \'true\', \'True \', 1, \'PASS\', …; six of the rejected values are truthy (the old guard would have accepted them); census 342 + 338 boolean PASS fields.',
  },
  {
    id: 'llj-honest-scope',
    holds: () => C.status === 'done' && /not certified/.test(C.verdict) && /conditional/.test(C.verdict) && /PT Lambda <= 0\.2 stands/.test(C.verdict)
      && /NO QED/.test(C.verdict) && /not separately refereed/.test(C.values.jointCollect6.grade),
    why: 'Λ < 0.145 not certified; values conditional on the ledger; the collect6 recording re-run is flagged as not separately refereed; no QED.',
  },
]);

export default LAMBDA_LEVERS_JOINT;
