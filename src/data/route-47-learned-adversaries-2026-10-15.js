/**
 * @fileoverview route-47-learned-adversaries-2026-10-15 — roadmap route 47 (batch 10, group J): learned surrogates as WOL-C adversaries and
 * hard-cell forecasters for the P47 late-cell floors of route P. Training data are existing evaluations only (read-only use of the route-1
 * campaign covers and checkpoints). One worker run plus one adversarial internal referee pass (independent v4c point recompute; re-derivation
 * from the output files; not refuted; severity minor: a false descriptive claim about g and the target rule, a missed g signal on the
 * r_23_40 floors, over-counted evidence for the 17-floor forecast, headline wording, an unstored baseline, small numeric slips). Corrections
 * applied below.
 *
 * PROVED: nothing.
 * CERTIFIED (graded as the unchanged v4c engine tmp/r7-engine-cert-v4c.py, same Piece setup as r7-full-cert.py; used in no Λ value):
 *  exact point bounds U({θ_s = 0}) on 371 point-bound rows (369 floors in diff.json; 0 failures); point margins m0 = U − K0* reproduce
 *  route 4 (idx 269 0.050152, idx 201 0.058012; referee to every printed digit); 48 v4c box bounds on surrogate-proposed boxes (floors 200,
 *  241, 265, 284); 12 origin boxes all have ub ≥ the point bound.
 * CONDITIONAL: engine values inherit the v4c engine's ledger dependence; no bound, certificate or Λ value changes; conditional value
 *  0.116091488672439 untouched. 'No complete certificate at τ when g = τ − m0 ≤ 0' assumes U(B) ≥ U({0}) for boxes containing 0 (12/12
 *  checked, not proved); moot since g > 0 on every floor (min 0.0042).
 * MEASURED:
 *  - Data: 1,062,484 θ_s-boxes (29,166 open) from 318 floors (314 certificate covers + 4 checkpoint-only; 305 complete, 9 budget-stopped).
 *  - Targets (CORRECTED): τ = 0.05 on 245 floors, m0 + 0.008 on 122, 0.0223 on 2 (idx 72, 74). g = τ − m0 ∈ [0.0042, 0.0431], median 0.020
 *    on completed floors; 13 floors have τ = 0.05 < m0 + 0.008 (cells 456, 461, 462, 464, 486, 490–496, 500; referee count 15, recount 13),
 *    so targets do NOT follow max(0.05, m0 + 0.008). No complete certificate has margin below m0 (max m0 − margin = −0.0047).
 *  - Box surrogate (numpy gradient-boosted trees): whole-floor 6-fold CV MAE(z) 0.0041–0.0045; open-box ranking AUC on the 9 held-out
 *    stopped floors 0.967–0.980 vs a distance-to-origin baseline 0.950–0.963 (referee recompute; the route's 0.953–0.968 was not stored);
 *    predicted open fraction ≈ 0 vs 21–47% true (trees do not extrapolate in K0).
 *  - Branch-and-bound simulation: flags 9/9 stopped floors; false positives 2/305 (v1: cells 461, 462) or 4/305 (v2: + 460, 498); AUC 0.997 /
 *    0.993 against 1.000 for K0 alone. log10 box-count LOO RMSE: family+seed 0.223, +K0 0.122, +simulation 0.104, both 0.089–0.095.
 *  - Exact checks of proposals: 1 of 12 'hard' boxes truly open (surrogate pessimistic by 0.0055); 'critical' boxes 0.009–0.017 below τ on
 *    floors 200/241/284, but 0.013–0.039 ABOVE τ on floor 265 (r_23_40, K0 0.688, outside the trained r_23_40 range; sharp covers reach 0.7308).
 *  - v4c bound growth around θ_s = 0 (boxes [0, 2w] × [−w, w]²): +0.0012–0.0016 at w = 0.002, +0.0059–0.0075 at 0.01, +0.018–0.023 at 0.03;
 *    the gap bound is useless there (+0.06 to +0.12 above τ).
 *  - True-Φ adversary (float64 r6 replica, T^15): 6 floor/corner runs, 121,605 evaluations, 336 ascents; every ascent ends at the central
 *    maximum except on idx 209 (424|1|r_23_40), where all 48 end at r6's known kink-displaced maximum (excess 1.98e-6, f = −0.001662); best
 *    Φ − K0* = −0.001563 (idx 3, cell 235) = r6's global maximum. No WOL-C violation; shell maxima agree with random starts to 6.7e-4.
 *  - Campaign (status.tsv 2026-10-08 03:10): 416-sharp (idx 200) budget-stopped in round 1 (margin 0.1289 vs τ 0.0674, 1419 open); 497 and
 *    501 (r_23_40) done at target after continuation; 492–496 and 500 running.
 * HEURISTIC:
 *  - Forecast: all 17 pending/running 0.88-sharp floors (cells 392–416; K0 0.7218–0.7398, g = 0.008) will be budget-stopped under the current
 *    policy. ONE argument (referee): they share K0 ≥ 0.7198 and g = 0.008 with the 8 floors 417–424 stopped after continuation (completed sharp
 *    K0 ≤ 0.6880, stopped ≥ 0.6925); the simulation blow-up is the same K0 argument (trees trained on 417–424), not independent evidence.
 *    416's round-1 stop is consistent, not final. Up to ≈ 187 CPU-h at stake.
 *  - r_23_40 at τ = 0.05 (REFEREE signal): done floors have g ≥ 0.0084, stopped-in-round-1 / running ones g ≤ 0.0077; testable: if idx 283
 *    (K0 0.6739, g 0.0071) ends budget-stopped while idx 292 (K0 0.6737, g 0.0087) completed, g rather than K0 is the operative variable.
 *  - Cost rises faster than exponentially in K0 near the top (parametric log10 nev = family + 4.83·K0 underestimates 417–424).
 *  - Hard cells are hard because of majorant looseness near θ_s = 0, not because Φ approaches K0* (it stays ≥ 0.0016 below); the landscape is
 *    unimodal, so a learned adversary has no advantage over random-start constrained ascent.
 *
 * Verdict: no help as adversary or bound-improver; as a difficulty forecaster about as good as K0 alone (plus g within r_23_40). No refereed bound is changed
 * ; RH open; NO QED. Import-free. ROUTE_47_ASSERTIONS recompute live: target-class counts, the K0 separation, the g split on
 * r_23_40, the RMSE ladder, the adversary maximum against r6, the box-growth bracket and the forecast premises.
 */

const { abs } = Math;

export const ROUTE_47 = Object.freeze({
  id: 'route-47-learned-adversaries-2026-10-15',
  route: 47,
  date: '2026-10-15',
  title: 'Route 47: learned adversaries find nothing r6 missed; difficulty is forecast by K0 (and g within r_23_40) as well as by the surrogate',
  status: 'done',
  headline: 'Learned surrogates trained on 1.06e6 existing θ_s-boxes find no WOL-C violation and no non-central maximum other than r6\'s known '
    + 'kink-displaced maximum on 424|1|r_23_40 (excess 1.98e-6); best Φ − K0* = −0.001563, equal to r6. As forecasters they separate budget-stopped '
    + 'from completed floors about as well as K0 alone, and both point to all 17 pending/running 0.88-sharp floors (cells 392–416) being budget-stopped '
    + 'under the current policy (one argument, heuristic). Within 0.88|r_23_40, g = τ − m0 currently splits outcomes (referee).',
  data: Object.freeze({ boxes: 1062484, open: 29166, floors: 318, covers: 314, complete: 305, stopped: 9, pointRows: 371, diffFloors: 369 }),
  targets: Object.freeze({ tau005: 245, m0plus008: 122, other: 2, otherValue: 0.0223, gMin: 0.0042, gMax: 0.0431, gMedianComplete: 0.020,
    tau005BelowRule: Object.freeze([456, 461, 462, 464, 486, 490, 491, 492, 493, 494, 495, 496, 500]) }),
  pointMargins: Object.freeze({ idx269: 0.050152061, idx201: 0.058011760, idx200: 0.059438785, idx3: 0.003868694 }),
  surrogate: Object.freeze({ cvMae: Object.freeze([0.0041, 0.0045]), aucOpen: Object.freeze([0.967, 0.980]), aucBaseline: Object.freeze([0.950, 0.963]) }),
  simulation: Object.freeze({ aucV1: 0.997, aucV2: 0.993, aucK0: 1.0, fpV1: 2, fpV2: 4, rmse: Object.freeze({ familySeed: 0.223, plusK0: 0.122, plusSim: 0.104, both: Object.freeze([0.089, 0.095]) }) }),
  checks: Object.freeze({ hardOpen: 1, hardTotal: 12, hardBias: 0.0055, critBelow: Object.freeze([0.009, 0.017]), crit265Above: Object.freeze([0.013, 0.039]) }),
  growth: Object.freeze([[0.002, 0.0012, 0.0016], [0.01, 0.0059, 0.0075], [0.03, 0.018, 0.023]]),
  adversary: Object.freeze({ runs: 6, evals: 121605, ascents: 336, best: -0.001563, r6Best: -0.00156, kinkExcess: 1.98e-6, kinkF: -0.001662 }),
  sharp088: Object.freeze({ completedMaxK0: 0.6880, stoppedMinK0: 0.6925, pendingK0: Object.freeze([0.7218, 0.7398]), pendingCount: 17, pendingG: 0.008, cpuHours: 187 }),
  r2340: Object.freeze({
    done: Object.freeze([[497, 0.6723, 0.00845], [501, 0.6737, 0.00873], [498, 0.6693, 0.0094], [499, 0.6663, 0.0104]]),
    open: Object.freeze([[486, 0.6786, 0.00471], [490, 0.6800, 0.00501], [491, 0.6769, 0.00609], [492, 0.6739, 0.00713], [493, 0.6845, 0.00422],
      [494, 0.6814, 0.00533], [495, 0.6783, 0.0064], [496, 0.6753, 0.00744], [500, 0.6768, 0.00773]]),
  }),
  campaignSnapshot: '2026-10-08 03:10 (tmp/route1-campaign/status.tsv): 76 done, 10 budget-stopped, 12 running, 40 pending; idx 200 (416-sharp) budget-stopped round 1, margin 0.1288948 vs 0.067439; idx 288 (497), 292 (501) done at 0.0499995 / 0.0499997',
  refereeKilled: Object.freeze([
    'false claim: g = τ − m0 is 0.008 on only 122 of 369 floors (range 0.0042–0.043, median 0.020 on completed); targets do not follow max(0.05, m0 + 0.008) (13 floors at τ = 0.05 below that rule; 2 at 0.0223)',
    'missed signal: within 0.88|r_23_40 at τ = 0.05, done floors have g ≥ 0.0084 and stopped/running ones g ≤ 0.0077 (testable via idx 283 vs 292)',
    'the 17-of-17 forecast rests on one argument (K0 and g shared with 417–424); the simulation blow-up is not independent; 416\'s round-1 stop is not final',
    'headline "no non-central maximum" must exclude r6\'s known kink-displaced maximum on idx 209 (48/48 ascents end there)',
    'distance baseline AUC not stored; referee recompute 0.950–0.963 (surrogate gain ≈ 0.014–0.021)',
    'numeric slips: CV MAE 0.0041–0.0045; 318 floors not 314; shell agreement 6.7e-4; ρ = 2 drop 0.0032–0.0075; simulation + K0 gains 0.027–0.033 dex over K0',
    '"origin boxes of half-width w" are [0, 2w] × [−w, w]²; floor 265 is outside the trained K0 range only within r_23_40',
  ]),
  nextStep: '(1) Leave the running campaign alone; when idx 200 (416-sharp) finishes its continuation, if budget-stopped, the campaign owner may '
    + 'deprioritise idx 176–199 (cells 392–415) via the campaign\'s own control files. (2) Test a policy change on ONE 0.88-sharp floor instead '
    + '(split the (t, a) piece to lower m0 and the origin growth, or raise g). (3) Test the g hypothesis on r_23_40 with the final outcomes of '
    + '492–496 and 500 (idx 283 vs 292). (4) Do not re-run learned adversaries on the true Φ_E: unimodal landscape.',
  files: Object.freeze(['tmp/routes-b10-r47-{data,gbm,box,point,diff,sim,simeval,mkcheck,checkeval,adv,summary,phitest}.py',
    'tmp/routes-b10-r47-out/{summary,diff,simeval_v1,simeval_v2,sim_pending_v2,checkeval,adv_a,adv_b,box_hold}.json', 'tmp/routes-b10-r47-out/point.jsonl',
    'tmp/routes-b10-ref47-point.py', 'tmp/routes-b10-ref47-point.log']),
  verdict: 'Done. Learned adversaries add nothing on the true Φ_E (unimodal landscape; every maximum found reproduces r6, max Φ − K0* = −0.001563), '
    + 'and their hard-box proposals were mostly wrong when checked against the v4c engine (pessimistic by 0.005–0.017, optimistic by up to 0.039 when '
    + 'extrapolating in K0). As a difficulty forecaster the surrogate matches K0 alone; the referee adds g = τ − m0 as a testable variable within '
    + 'r_23_40. Operational heuristic: the 17 pending/running 0.88-sharp floors (cells 392–416) are expected to be budget-stopped under the current '
    + 'policy. Everything is measured or heuristic; WOL-C is not proved; the conditional value stays 0.116091488672439. No refereed bound is changed; '
    + 'RH open; NO QED.',
});

const R47 = ROUTE_47;

export const ROUTE_47_ASSERTIONS = Object.freeze([
  {
    id: 'r47-target-classes',
    holds: () => { const t = R47.targets; return t.tau005 + t.m0plus008 + t.other === R47.data.diffFloors && t.gMin > 0 && t.gMax > 5 * 0.008
      && t.tau005BelowRule.length === 13 && R47.data.covers + 4 === R47.data.floors && R47.data.complete + R47.data.stopped === R47.data.covers; },
    why: '245 + 122 + 2 = 369 floors; g ∈ [0.0042, 0.043] (not constant 0.008); 13 floors have τ = 0.05 below m0 + 0.008; 314 covers + 4 checkpoint-only = 318; 305 + 9 = 314.',
  },
  {
    id: 'r47-k0-separation',
    holds: () => { const s = R47.sharp088; return s.completedMaxK0 < s.stoppedMinK0 && s.pendingK0[0] > s.stoppedMinK0 && s.pendingCount === 17 && R47.simulation.aucK0 === 1; },
    why: '0.88-sharp: completed K0 ≤ 0.6880 < 0.6925 ≤ stopped K0, and the 17 pending floors sit at 0.7218–0.7398, above every stopped floor; K0 alone separates stopped from completed (AUC 1.000).',
  },
  {
    id: 'r47-g-split-r2340',
    holds: () => { const d = R47.r2340.done.map((r) => r[2]); const o = R47.r2340.open.map((r) => r[2]);
      const p283 = R47.r2340.open.find((r) => r[0] === 492); const p292 = R47.r2340.done.find((r) => r[0] === 501);
      return Math.min(...d) >= 0.0084 && Math.max(...o) < 0.00775 && Math.min(...d) > Math.max(...o) && abs(p283[1] - p292[1]) < 5e-4 && p283[2] < p292[2]; },
    why: 'Within 0.88|r_23_40 at τ = 0.05, done floors have g ≥ 0.0084 and open ones g ≤ 0.0077; cells 492 (idx 283) and 501 (idx 292) are matched in K0 (0.6739 vs 0.6737) but split in g — the referee\'s test.',
  },
  {
    id: 'r47-rmse-ladder-and-auc',
    holds: () => { const r = R47.simulation.rmse; const s = R47.surrogate;
      return r.familySeed > r.plusK0 && r.plusK0 > r.plusSim && r.plusSim > r.both[1] && abs((r.plusK0 - r.both[1]) - 0.027) < 1e-9
        && s.aucOpen[0] > s.aucBaseline[0] && s.aucOpen[1] - s.aucBaseline[1] < 0.025 && R47.simulation.aucV1 < R47.simulation.aucK0; },
    why: 'Box-count RMSE falls 0.223 → 0.122 → 0.104 → 0.089–0.095 (simulation + K0 gains 0.027–0.033 dex over K0); surrogate open-box AUC beats geometry by ≤ 0.02; simulation AUC below K0 alone.',
  },
  {
    id: 'r47-adversary-matches-r6',
    holds: () => { const a = R47.adversary; return a.best < 0 && abs(a.best - a.r6Best) < 1e-5 && a.kinkExcess > 0 && a.kinkExcess < 1e-5 && a.kinkF < a.best && a.ascents === 336; },
    why: 'Best Φ − K0* = −0.001563 matches r6\'s sup ≤ −0.00156 (no violation); the only non-central maximum is r6\'s kink-displaced one (excess 1.98e-6).',
  },
  {
    id: 'r47-origin-growth',
    holds: () => R47.growth.every(([w, lo, hi], i) => lo < hi && (i === 0 || lo > R47.growth[i - 1][2])) && R47.growth[1][2] < 0.008 && R47.growth[2][1] > 0.008,
    why: 'v4c bound growth near θ_s = 0 is monotone in box size: at w = 0.01 it stays below g = 0.008, at w = 0.03 it exceeds it — origin boxes need half-width ≲ 0.01.',
  },
  {
    id: 'r47-checks-and-points',
    holds: () => { const c = R47.checks; const p = R47.pointMargins; return c.hardOpen / c.hardTotal < 0.1 && c.crit265Above[0] > 0 && c.critBelow[1] > c.critBelow[0]
      && abs(p.idx269 - 0.0501521) < 1e-6 && p.idx3 < p.idx269; },
    why: 'Exact checks: 1/12 hard boxes truly open; floor-265 proposals land 0.013–0.039 above τ (extrapolation failure); idx 269 point margin 0.050152 matches route 4.',
  },
  {
    id: 'r47-honesty',
    holds: () => /refereed bound is changed/i.test(R47.verdict) && /NO QED/.test(R47.verdict) && /WOL-C is not proved/.test(R47.verdict)
      && /0\.116091488672439/.test(R47.verdict) && R47.refereeKilled.length === 7,
    why: 'Verdict: measured/heuristic only, WOL-C not proved, conditional value unchanged, no QED; seven referee corrections recorded.',
  },
]);

export default ROUTE_47;
