/**
 * @fileoverview lambda-levers-combined-2026-10-08 — the batch-3 combination of the certified route-P levers at PT height:
 * route-1 campaign certificates + route-5 bands + route-3 two-point kernels (six original + extended λ < 2 grid, 281 kernels).
 * One run plus one adversarial internal referee pass (not refuted, minor); the referee corrections are applied below.
 *
 * Outcome (referee-corrected, current campaign certificates incl. floors 246 and 248 done at target):
 *   Λ ≤ 145322418219213/10^15 = 0.145322418219213 (3-band layout, 281 kernels, E1–E8 0 failures, 74,406 steps).
 * The run value with the 00:12 certfile, 29064511243373/(2·10^14) = 0.145322556216865, remains valid (reproduced exactly by the
 * referee). Total −3.717e-4 against the 0.145694083872924 baseline; 3.22e-4 above 0.145. Λ < 0.145 is NOT certified.
 * PROJECTION (measured, hypothetical margins): remaining route-1 floors at target → 0.144963567436994 (all 138) / 0.144966582977753
 * (125 missing only), both below 0.145, 3-band layout only (the 4-band layout is capped by the X150 band 0.145332594425165).
 *
 * PROVED: nothing new. Kernel inequality, self cap and Lemma H2 are linear in the probe measure (route-3 argument), so a per-substep
 *  choice among separately certified two-point kernels needs no new certificate.
 * CERTIFIED (relative to the shared ledger — hence conditional; single implementation tmp/routes-b3-combine-consume.py; internal referee):
 *  - final: 0.145322418219213 (k3, referee, collect3 certfile) and 0.145322556216865 (j2, collect2 certfile); band 1 binds; X165mid
 *    0.144912451862679 and U2 0.144254643222956 recorded.
 *  - stack (each exact, collect2 certfile): batch-1 route P 0.145694083872924 → + campaign (5 budget-stopped floors 201–205)
 *    0.145682044983672 → + route 5 3-band 0.145619529510199 → + route 3 six kernels 0.145434233036651 → + extended grid 0.145322556216865.
 *  - route-1 campaign with floors 246, 248 at target: route-P alone 72840968744127/(5·10^14) = 0.145681937488254 (−1.2146e-5).
 *  - exact (a)+(b)+(c) with route 3's six kernels, 4-band: 0.145428764270027 (j3); 3-band 0.145434233036651 (j6).
 *  - 281 kernels: exact Bernstein certificates, all PASS == 'True' with matching r, λ, ρ, w = 0, κ = 1 (referee); 3r² ≥ 1 for every r;
 *    Lemma H2 min ratio 1140.46. Track A floors for 10 new r values: all 222 cells match the b145-B-lib pipeline (2,664 entries,
 *    0 mismatches) — a code-path cross-check sharing GainCtx and RECORDS.json, not a separate implementation.
 *  - the final value uses only single-component two-point modes: no dependence on Theorem MP / Lemma MP3 / Lemma R2.
 * CONDITIONAL: G0-c, G0-d (OP), AF gaps, Lemma B as written, producer layer, RH-win, RH-head; single engine (v4c) for route-1 floors;
 *  3-band: Theorem B'_m (unrefereed), RH in W2 via Route 2 (FLINT acb_dirichlet_hardy_z unaudited; Trudgian 2011 Thm 2.2), recorded
 *  X165mid and U2 replays of 2026-10-01 (tables deleted, not re-run). E1–E8 for the new option types are a re-implementation of the
 *  r3-bb-replay rules (controls reproduce route-3 V3, route-5 4-band and the collector's route-P value exactly).
 * E1–E8 FLAGS (referee correction): c2, c3, x1, e2, e5, f2, g1, h2 and j4 log E6-altlog:1 (the redundant alternative-log check),
 *  absorbed by the U_robust convention (r7 / route 5); no reported value changes. j1–j3, j5–j8, i1–i4, k3 have 0 failures.
 * MEASURED: decomposition (batch-1 certfile, 4-band): route 3 on top of route 5 −1.868e-4, route 5 on top of route 3 −3.21e-5,
 *  interaction +4.16e-5 (sub-additive), Theorem MP share −1.98e-7, batch-1 route 1 worth −9.79e-4 inside the combination. Kernel lever
 *  in the projection (referee correction): 2.2–2.8e-6 if all floors reach target, 7.8e-6–1.7e-5 if only the 125 missing do. Kernel
 *  grid rounds not saturated (binding kernels high ρ at small r: 29/50 at ρ = 43/100, λ = 1.9881).
 * NOT INCLUDED: route 9's height sets (an option union, not additive; needs one joint consumer run plus E1–E8). Routes 7, 8, 38, 50
 *  contribute nothing at PT height.
 * LATENT DEFECT (referee): the consumer's extra-kernel guard tests cc['PASS'] truthily but PASS is stored as the string 'True'/'False';
 *  not triggered (all 281 are 'True'); fix before reuse.
 *  LATER CORRECTION (batch 4, 2026-10-09): on disk PASS is a JSON boolean (342 true / 338 false), not a string, so the old guard never
 *  misfired; the guard is now strict (pass_ok: x is True or x == 'True') on the three route-P consumer-path guards; values unchanged.
 *  The joint run with route 9 (marginal exactly 0) and newer campaign certificates is src/data/lambda-levers-combined-2026-10-09.js.
 *
 * PT Λ ≤ 0.2 stands; RH open; NO QED. Import-free. LAMBDA_LEVERS_COMBINED_ASSERTIONS recompute every stack step, the decomposition,
 * the projections and the layout maxima in exact rationals.
 */

const big = (s) => { if (Array.isArray(s)) return s; const [a, b] = String(s).split('/'); return [BigInt(a), BigInt(b ?? '1')]; };
const cmp = (x, y) => { const [a, b] = big(x), [c, d] = big(y); const l = a * d, r = c * b; return l < r ? -1 : l > r ? 1 : 0; };
const lt = (x, y) => cmp(x, y) < 0;
const sub = (x, y) => { const [a, b] = big(x), [c, d] = big(y); return [a * d - c * b, b * d]; };
const add = (x, y) => { const [a, b] = big(x), [c, d] = big(y); return [a * d + c * b, b * d]; };
const num = (x) => { const [a, b] = big(x); return Number(a * 10n ** 18n / b) / 1e18; };
const exact15 = (s) => { const [a, b] = big(s); const n = a * 10n ** 15n; return n % b === 0n ? n / b : null; };
const maxR = (xs) => xs.reduce((m, x) => (lt(m, x) ? x : m));
const V = (exact, dec, grade, label) => Object.freeze({ exact, dec, grade, label });
const E15 = (dec) => `${dec.replace('0.', '').replace(/^0+/, '')}/1000000000000000`;

export const LAMBDA_LEVERS_COMBINED = Object.freeze({
  id: 'lambda-levers-combined-2026-10-08',
  date: '2026-10-08',
  title: 'Combined route-P levers at PT height: Λ ≤ 0.145322418219213 (certified relative to the ledger); projection 0.1449636 (measured)',
  status: 'done',
  headline: 'Stacking the route-1 campaign certificates, route 5\'s 3-band layout and the route-3 kernels (281 certified λ < 2 kernels) gives '
    + 'Λ ≤ 0.145322418219213 at PT height (certified relative to the shared ledger, hence conditional; single implementation, internal referee). '
    + 'That is −3.72e-4 against 0.145694083872924 and 3.22e-4 above 0.145. If the remaining route-1 floors finish at target the 3-band combination '
    + 'lands at 0.1449636–0.1449666 (measured projection). Λ < 0.145 is not certified.',

  values: Object.freeze({
    baseline: V('36423520968231/250000000000000', '0.145694083872924', 'CERTIFIED', 'route-P batch 1 (r7)'),
    campaignRouteP: V('18210255622959/125000000000000', '0.145682044983672', 'CERTIFIED', 'j8: route P + campaign (collect2, floors 201–205 budget-stopped)'),
    campaignRouteP3: V('72840968744127/500000000000000', '0.145681937488254', 'CERTIFIED', 'k8/collect3: + floors 246, 248 at target (referee)'),
    plusRoute5: V(E15('0.145619529510199'), '0.145619529510199', 'CERTIFIED', 'j7: + route 5 3-band'),
    plusSixKernels: V(E15('0.145434233036651'), '0.145434233036651', 'CERTIFIED (multi-point modes chosen: also Theorem MP)', 'j6: + route 3 six kernels, 3-band'),
    final: V('29064511243373/200000000000000', '0.145322556216865', 'CERTIFIED', 'j2: + extended 281-kernel grid, 3-band (collect2)'),
    finalReferee: V(E15('0.145322418219213'), '0.145322418219213', 'CERTIFIED', 'k3: same, collect3 certfile (floors 246, 248)'),
    abcSixFourBand: V(E15('0.145428764270027'), '0.145428764270027', 'CERTIFIED (also Theorem MP)', 'j3: exact (a)+(b)+(c), six kernels, 4-band'),
    batch1Both: V(E15('0.145433536391423'), '0.145433536391423', 'CERTIFIED (also Theorem MP)', 'c3: route 3 + route 5, batch-1 certfile, 4-band'),
    route5Four: V('72810191965913/500000000000000', '0.145620383931826', 'CERTIFIED', 'route 5 alone, 4-band (batch 2)'),
    route3: V(E15('0.145465618111039'), '0.145465618111039', 'CERTIFIED', 'route 3 alone (batch 2)'),
    r6Admission: V('9150812574019/62500000000000', '0.146413001184304', 'CERTIFIED', 'd1: route 3 + 5 on the r6 admission (no route-1 certificates)'),
    j1Band1: V(E15('0.145317251129187'), '0.145317251129187', 'CERTIFIED', 'j1: band 1 of the 4-band layout, 281 kernels'),
    x150: V('29066518885033/200000000000000', '0.145332594425165', 'CERTIFIED', 'X150 band (4-band layout cap)'),
    x165mid: V(E15('0.144912451862679'), '0.144912451862679', 'CERTIFIED (recorded 2026-10-01, not re-run)', 'band X165mid'),
    u2: V('36063660805739/250000000000000', '0.144254643222956', 'CERTIFIED (recorded)', 'last band U2'),
    projAll: V('72481783718497/500000000000000', '0.144963567436994', 'MEASURED (hypothetical)', 'i3: all 138 remaining floors at target, 3-band, 281 kernels'),
    projMissing: V(E15('0.144966582977753'), '0.144966582977753', 'MEASURED (hypothetical)', 'j4: 125 missing at target, incomplete at campaign margins'),
    projMissingI4: V('72484541285651/500000000000000', '0.144969082571302', 'MEASURED (hypothetical)', 'i4: 125 missing at target (batch-1 certfile), 281 kernels'),
    projAllSix: V(E15('0.144965724317423'), '0.144965724317423', 'MEASURED (hypothetical)', 'p3: all at target, six kernels'),
    projMissingSix: V('72488460860161/500000000000000', '0.144976921720322', 'MEASURED (hypothetical)', 'p6: 125 missing at target, six kernels'),
    projAllNoK: V(E15('0.144966349654964'), '0.144966349654964', 'MEASURED (hypothetical)', 'route 5 scen3All (no kernels)'),
    projMissingNoK: V(E15('0.144986019620486'), '0.144986019620486', 'MEASURED (hypothetical)', 'route 5 scen3Missing (no kernels)'),
  }),
  layouts: Object.freeze({ threeBand: Object.freeze(['finalReferee', 'x165mid', 'u2']), fourBand: Object.freeze(['j1Band1', 'x150', 'x165mid', 'u2']) }),
  kernels: Object.freeze({ rounds: Object.freeze([45, 54, 120, 42, 21]), unique: 281, h2MinRatio: 1140.46, trackACells: 222, trackAEntries: 2664, mismatches: 0 }),
  campaign: Object.freeze({ budgetStoppedCerts: Object.freeze([201, 202, 203, 204, 205]), doneAtTarget: Object.freeze([246, 248]),
    snapshot: '2026-10-07 02:39: 2 done, 5 budget-stopped, 6 running, 125 pending (status.tsv)' }),
  e6AltlogRuns: Object.freeze(['c2', 'c3', 'x1', 'e2', 'e5', 'f2', 'g1', 'h2', 'j4']),
  excluded: Object.freeze({ route9: 'option union, not additive; joint run done 2026-10-09: marginal exactly 0 (route-3 kernels dominate; see lambda-levers-combined-2026-10-09)', route7: 'no change', route8: 'no change', route38: 'needs RH to X\'/2', route50: 'closed at PT height' }),

  refereeKilled: Object.freeze([
    '"no campaign floor has finished at target" — floors 246 (00:26:25) and 248 (00:44:17) finished at target before the report; combined value with them 0.145322418219213 (−1.38e-7), route P alone 0.145681937488254',
    '"kernel lever ≈ 1e-6 in the projection" — only for all-at-target (2.2–2.8e-6); with only the 125 missing at target it is 7.8e-6 (vs six kernels) to 1.7e-5 (vs none)',
    '"0 E1–E8 failures" for every run — c2, c3, x1, e2, e5, f2, g1, h2, j4 log E6-altlog:1, absorbed by U_robust; values unchanged',
    'latent consumer defect: kernel guard tests the string PASS truthily (\'False\' is truthy); not triggered here',
    'Track A cross-check called independent on 12 of 222 cells — referee extended it to all 222 (2,664 entries, 0 mismatches), but it shares GainCtx and RECORDS.json: a code-path check',
  ]),
  nextStep: '(1) Re-run the combined consumer as route-1 floors finish (collect.sh into collectN, then routes-b3-combine-consume.py with --a1 9900000003031.5801, '
    + 'the six tables and kernels_all5.json; ≈ 12 min, 1 worker); 3-band layout only. (2) One joint run adding the route-9 height sets (W4, W5, used '
    + 'multipliers), then E1–E8. (3) Re-replay X165mid and U2 from regenerated tables (the 3-band value and the projection depend on them). (4) Fix the '
    + 'PASS-string guard; independent recomputation of tab_X/tab_X2.',
  files: Object.freeze(['tmp/routes-b3-combine-consume.py', 'tmp/routes-b3-combine-out/summary.json', 'tmp/routes-b3-combine-out/j2_R5_W99_c2.json',
    'tmp/routes-b3-combine-out/kernels_all5.json', 'tmp/routes-b3-combine-out/h2_all5.json', 'tmp/routes-b3-combine-out/tab_X.json', 'tmp/routes-b3-combine-out/tab_X2.json',
    'tmp/routes-b3-ref-combine-out/k3_R5_W99_c3.json', 'tmp/routes-b3-ref-combine-out/k8_none_r7_c3.json', 'tmp/routes-b3-ref-combine-out/rj2.json',
    'tmp/routes-b3-ref-combine-out/collect3/', 'tmp/routes-b3-ref-combine-runs.sh']),
  verdict: 'Certified relative to the shared ledger (hence conditional), single implementation, internal referee: Λ ≤ 0.145322418219213 at PT height '
    + '(3-band layout, 281 certified λ < 2 kernels, current route-1 certificates incl. floors 246 and 248); the 00:12-certfile value 0.145322556216865 remains '
    + 'valid. −3.72e-4 against 0.145694083872924, still 3.22e-4 above 0.145. Measured projection: remaining route-1 floors at target give 0.1449636–0.1449666 '
    + '(3-band only; the X150 band caps 4 bands at 0.145333). Route 9 not yet stacked (option union). Λ < 0.145 is not certified. PT Lambda <= 0.2 stands; RH open; NO QED.',
});

const C = LAMBDA_LEVERS_COMBINED;
const v = (k) => C.values[k].exact;
const near = (x, target, tol) => Math.abs(num(x) - target) < tol;

export const LAMBDA_LEVERS_COMBINED_ASSERTIONS = Object.freeze([
  {
    id: 'llc-values-exact',
    holds: () => Object.values(C.values).every((x) => { const n = exact15(x.exact); return n !== null && `0.${String(n).padStart(15, '0')}` === x.dec; }),
    why: 'Every stated decimal is the exact 15-digit value of its rational.',
  },
  {
    id: 'llc-stack',
    holds: () => { const seq = ['baseline', 'campaignRouteP', 'plusRoute5', 'plusSixKernels', 'final'];
      const d = seq.slice(1).map((k, i) => sub(v(k), v(seq[i])));
      const tgt = [-1.2039e-5, -6.2515e-5, -1.85296e-4, -1.11677e-4];
      return d.every((x, i) => lt(x, '0/1') && near(x, tgt[i], 1e-9)) && near(sub(v('final'), v('baseline')), -3.71528e-4, 1e-9)
        && near(sub(v('final'), '145/1000'), 3.22556e-4, 1e-9); },
    why: 'Stack steps −1.2039e-5 (campaign), −6.2515e-5 (route 5), −1.85296e-4 (six kernels), −1.11677e-4 (grid); total −3.71528e-4; gap to 0.145 = 3.22556e-4.',
  },
  {
    id: 'llc-referee-update',
    holds: () => lt(v('finalReferee'), v('final')) && near(sub(v('final'), v('finalReferee')), 1.38e-7, 1e-9)
      && lt(v('campaignRouteP3'), v('campaignRouteP')) && near(sub(v('campaignRouteP3'), v('baseline')), -1.2146e-5, 1e-9) && lt('145/1000', v('finalReferee')),
    why: 'With floors 246 and 248 at target: combined 0.145322418219213 (1.38e-7 lower), route P alone −1.2146e-5; still above 0.145.',
  },
  {
    id: 'llc-layouts',
    holds: () => cmp(maxR(C.layouts.threeBand.map(v)), v('finalReferee')) === 0 && cmp(maxR(C.layouts.fourBand.map(v)), v('x150')) === 0
      && lt(v('j1Band1'), v('x150')) && lt(v('finalReferee'), v('x150')) && lt(v('projAll'), v('x165mid')) === false && lt('145/1000', v('x150')),
    why: '3-band: band 1 binds; 4-band: the X150 band (0.145332594425165) binds above j1\'s band 1, so only the 3-band layout gains from band-1 levers; projections stay above X165mid.',
  },
  {
    id: 'llc-decomposition',
    holds: () => near(sub(v('batch1Both'), v('route5Four')), -1.868475e-4, 1e-9) && near(sub(v('batch1Both'), v('route3')), -3.20817e-5, 1e-9)
      && near(sub(v('batch1Both'), add(sub(v('route5Four'), v('baseline')), v('route3'))), 4.16182e-5, 1e-9)
      && near(sub(v('r6Admission'), v('batch1Both')), 9.79465e-4, 1e-9),
    why: 'Route 3 on top of route 5 −1.868e-4, route 5 on top of route 3 −3.21e-5; additive prediction 0.145391918 vs joint 0.145433536 (interaction +4.16e-5); batch-1 route 1 worth −9.79e-4.',
  },
  {
    id: 'llc-projection',
    holds: () => lt(v('projAll'), '145/1000') && lt(v('projMissing'), '145/1000') && near(sub('145/1000', v('projAll')), 3.6433e-5, 1e-9)
      && near(sub(v('projAllSix'), v('projAll')), 2.157e-6, 1e-8) && near(sub(v('projAllNoK'), v('projAll')), 2.782e-6, 1e-8)
      && near(sub(v('projMissingSix'), v('projMissingI4')), 7.839e-6, 1e-8) && near(sub(v('projMissingNoK'), v('projMissingI4')), 1.6937e-5, 1e-8)
      && C.values.projAll.grade.startsWith('MEASURED'),
    why: 'Projections 0.1449636 / 0.1449666 < 0.145 (measured, hypothetical); kernel lever there 2.2e-6 / 2.8e-6 (all at target) and 7.8e-6 / 1.7e-5 (125 missing only).',
  },
  {
    id: 'llc-kernel-counts',
    holds: () => C.kernels.rounds.reduce((a, b) => a + b, 0) === C.kernels.unique + 1 && C.kernels.trackAEntries === 12 * C.kernels.trackACells
      && C.kernels.mismatches === 0 && C.kernels.h2MinRatio > 1000 && C.campaign.budgetStoppedCerts.length === 5 && C.campaign.doneAtTarget.length === 2,
    why: '45 + 54 + 120 + 42 + 21 = 282 round certificates, 281 unique kernels; Track A check 222 cells × 12 = 2,664 entries, 0 mismatches; H2 min ratio 1140; 5 budget-stopped + 2 at-target campaign floors used.',
  },
  {
    id: 'llc-honest-scope',
    holds: () => C.status === 'done' && /not certified/.test(C.verdict) && /conditional/.test(C.verdict) && /PT Lambda <= 0\.2 stands/.test(C.verdict)
      && /NO QED/.test(C.verdict) && /not additive/.test(C.excluded.route9) && C.e6AltlogRuns.includes('j4'),
    why: 'Λ < 0.145 not certified; certified value conditional on the ledger; route 9 not stacked; E6-altlog flags recorded; no QED.',
  },
]);

export default LAMBDA_LEVERS_COMBINED;
