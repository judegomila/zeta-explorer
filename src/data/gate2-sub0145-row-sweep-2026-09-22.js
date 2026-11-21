/**
 * @fileoverview Gate-2 freeze-calculus evaluator RUN at sub-0.145 row parameters
 * (2026-09-22). The native double-double evaluator native/gate2-lane-a/gate2
 * (locked convention: bnHasT0=1, bnOnBoth=1, frozenChart=1, real gamma_at; the
 * eq-(13) telescope identity sum_j D_j = E97 checked at every evaluation) was run
 * with the row (t, y) overridden through GATE2_T_NUM/DEN, GATE2_Y2_NUM/DEN on the
 * anchor window N = 690988 (both seam charts, 20001-point grid + top-K zoom =
 * 40,002 + zoom evaluations per row) and on sample windows N = 3.84e6 (120-pt
 * sweep), 2e7 (48-pt sweep), 9465530 and 54799999 (single points). Command
 * (per row): `GATE2_T_NUM=.. GATE2_T_DEN=.. GATE2_Y2_NUM=.. GATE2_Y2_DEN=..
 * ./gate2 pilotg3 20001 6 OUT.json`; artifacts in
 * native/gate2-lane-a/recon/sub0145-rows/ (run-rows.sh, *-pilotg3.json,
 * *-witness.json, *-point-*.json, *-sweep-*.summary).
 *
 * Every number here is a SAMPLED sup (measurement, not certificate): the fastest
 * ladder phase turns ~929x per grid step, so the continuum sup is >= the sample.
 * The contract literal R_strict = 0.27968819555261474 (eq 20) and Rex =
 * 0.2796881955526244 (eq 19) are the 0.14-row allowance; for other rows the
 * allowance itself would have to be re-derived (not done here) -- comparisons
 * below hold the 0.14-row literal fixed. Import-light (literals only).
 * Changes no bound; no refereed bound is changed; RH open; NO QED.
 */

export const R_STRICT = 0.27968819555261474; // eq (20) contract target
export const REX_EXACT = 0.2796881955526244; // eq (19) exact allowance

// Rows: Lambda = t + y^2/2. row0140 = frozen Gate-2 row (imp-95012 eq 8);
// row01399 = paper Theorem 4.5 row (imp-95012 ROW_01399_DECISION); the rest are
// synthetic sub-0.14 rows chosen to separate the t-axis from the y-axis.
export const ROWS = Object.freeze([
  { key: 'row0140', tNum: 24727519, tDen: 200000000, y2Num: 3272481, y2Den: 100000000, lambda: 0.14,
    anchor: { supPilot: 0.2321760180103867, supE97: 0.1783903494217723, wPilot: 0.5865, sidePilot: 0, wE97: 0.40865, maxTel: 6.641e-14 },
    witness: { sigmaB: 1.42166, gamma: 0.08815, absE97: 0.154026, pilot: 0.232176, smallPrimeShare: 0.817, D2: 0.0961, D3: 0.0543, D5: 0.0268, D7: 0.0126 },
    samples: { sweep3840000MaxE97: 0.0904778481855907, sweep20000000MaxE97: 0.0610513925027792,
      point54799999: { absE97: 0.061998, pilot: 0.070501 }, point9465530: { absE97: 0.060215, pilot: 0.080603 } },
    routeVII_N1Star: 2.854e8 },
  { key: 'row01399', tNum: 10103, tDen: 80000, y2Num: 1089, y2Den: 40000, lambda: 0.1399,
    anchor: { supPilot: 0.2654914135877762, supE97: 0.2081292815197759, wPilot: 0.5865, sidePilot: 0, wE97: 0.40865, maxTel: 7.110e-14 },
    witness: { sigmaB: 1.43152, gamma: 0.10912, absE97: 0.182024, pilot: 0.265491, smallPrimeShare: 0.824, D2: 0.1113, D3: 0.0631, D5: 0.0311, D7: 0.0132 },
    samples: { sweep3840000MaxE97: 0.1090659167556785, sweep20000000MaxE97: 0.0750493814179542,
      point54799999: { absE97: 0.075961, pilot: 0.086583 }, point9465530: { absE97: 0.074951, pilot: 0.098424 } },
    routeVII_N1Star: 2.205e8 },
  { key: 'row0130', tNum: 23, tDen: 200, y2Num: 3, y2Den: 100, lambda: 0.13,
    anchor: { supPilot: 0.2845833585863091, supE97: 0.206763341708058, wPilot: 0.5865, sidePilot: 0, wE97: 0.40865, maxTel: 7.255e-14 },
    witness: { sigmaB: 1.35974, gamma: 0.09774, absE97: 0.182606, pilot: 0.284583, smallPrimeShare: 0.803, D2: 0.1132, D3: 0.066, D5: 0.0336, D7: 0.0157 },
    samples: { sweep3840000MaxE97: 0.1059535577017139, sweep20000000MaxE97: 0.0714454555293751,
      point54799999: { absE97: 0.074999, pilot: 0.087131 }, point9465530: { absE97: 0.072662, pilot: 0.100127 } },
    routeVII_N1Star: 1.207e9 },
  { key: 'row0120', tNum: 21, tDen: 200, y2Num: 3, y2Den: 100, lambda: 0.12,
    anchor: { supPilot: 0.3304734285800589, supE97: 0.2222501600516838, wPilot: 0.5865, sidePilot: 0, wE97: 0.40865, maxTel: 7.846e-14 },
    witness: { sigmaB: 1.29251, gamma: 0.09774, absE97: 0.200802, pilot: 0.330473, smallPrimeShare: 0.785, D2: 0.125, D3: 0.0754, D5: 0.0397, D7: 0.0192 },
    samples: { sweep3840000MaxE97: 0.1132546423666394, sweep20000000MaxE97: 0.0754367492400885,
      point54799999: { absE97: 0.082442, pilot: 0.098045 }, point9465530: { absE97: 0.079321, pilot: 0.114018 } },
    routeVII_N1Star: 7.91e9 },
  { key: 'row0100', tNum: 17, tDen: 200, y2Num: 3, y2Den: 100, lambda: 0.10,
    anchor: { supPilot: 0.4968654921603084, supE97: 0.2885307026568336, wPilot: 0.618275239128, sidePilot: 1, wE97: 0.618275252406, maxTel: 1.118e-13 },
    witness: { sigmaB: 1.15805, gamma: 0.09774, absE97: 0.195093, pilot: 0.496865, smallPrimeShare: 0.763, D2: 0.1836, D3: 0.1245, D5: 0.0593, D7: 0.0118 },
    samples: { sweep3840000MaxE97: 0.1279485179889132, sweep20000000MaxE97: 0.0825641751549724,
      point54799999: { absE97: 0.099782, pilot: 0.125934 }, point9465530: { absE97: 0.096435, pilot: 0.15186 } },
    routeVII_N1Star: 1.282e12 },
  { key: 'row0130y', tNum: 1, tDen: 10, y2Num: 3, y2Den: 50, lambda: 0.13,
    anchor: { supPilot: 0.2008201970296318, supE97: 0.1338420167954451, wPilot: 0.618275243326, sidePilot: 1, wE97: 0.618275207395, maxTel: 9.176e-14 },
    witness: { sigmaB: 1.29477, gamma: 0.0373, absE97: 0.094338, pilot: 0.20082, smallPrimeShare: 0.804, D2: 0.08, D3: 0.0493, D5: 0.0266, D7: 0.0055 },
    samples: { sweep3840000MaxE97: 0.0518621603109244, sweep20000000MaxE97: 0.032544332505898,
      point54799999: { absE97: 0.037477, pilot: 0.041982 }, point9465530: { absE97: 0.031733, pilot: 0.049394 } },
    routeVII_N1Star: 1.138e10 },
]);

export const rowOf = (key) => ROWS.find((r) => r.key === key);
export const lambdaOf = (r) => r.tNum / r.tDen + r.y2Num / r.y2Den / 2;

export const GATE2_SUB0145_ROW_SWEEP = Object.freeze({
  id: 'gate2-sub0145-row-sweep',
  date: '2026-09-22',
  status: 'MEASUREMENT (sampled sups, dd evaluator, anchor window + 4 sample windows) -- not a certificate, not a bound',
  tool: 'native/gate2-lane-a/gate2 pilotg3 20001 6 (locked convention; selftest ALL PASS; fast path validated vs eval_E97 <= 1e-11 at 8 points per row; telescope max err <= 1.12e-13)',
  grid: { npts: 20001, sides: 2, evaluationsPerRow: 40002, gridStepX: 868.321758, fastestPhaseTurnsPerStep: 929.095 },
  findings: {
    frozenRow014: 'sampled sup pilot 0.23218 (83.0% of R_strict), sup |E97| 0.17839 (63.8%): consistent with imp-95205 (0.24375 / 0.19344 on 300001 pts) -- the 20001-pt grid under-samples by ~5-8%, as expected for a sampled sup.',
    row01399: 'the paper 0.1399 row (t=10103/80000, y=33/200) is TIGHTER than the 0.14 row on the same x-grid: pilot 0.26549 (94.9%), |E97| 0.20813 (74.4%) -- margin to the pilot budget 0.01420, below the ~5-8% sampling deficit, so a full-grid run would plausibly cross Rex on the pilot.',
    tAxisCrossing: 'at fixed y^2 = 0.03, lowering t crosses the PILOT budget between Lambda 0.1399 and 0.13: row0130 pilot 0.28458 >= Rex (STOP-SIGNAL, +0.00490 = +1.75%), row0120 0.33047 (+18.2%), row0100 0.49687 (+77.6%); |E97| itself stays under until Lambda 0.10 where it crosses too (0.28853, +3.16%).',
    smallPrimeWall: 'in every row the pilot is carried by the four smallest welds: {2,3,5,7} share of sum_j |D_j| = 0.76-0.82, with p=2 alone 0.08-0.18. This is the Theorem U / section 5(i) small-prime-weld wall (S-bar_2 > S-bar_3 > S-bar_5 largest) appearing in the real evaluator: lower t lowers sigma_B = (1+y)/2 + (t/4) ln(x_N/4pi) (1.4217 -> 1.1581), inflating the b_p p^{-sigma_B} defect amplitudes of the small primes.',
    yAxisEscape: 'at the SAME Lambda = 0.13, the y-heavy split (t=0.10, y=sqrt(0.06)=0.2449) gives pilot 0.20082 (71.8%) and |E97| 0.13384 (47.9%) -- below the frozen 0.14 row -- because gamma = exp(0.02y - (y/2) ln(x_N/4pi)) falls 0.0882 -> 0.0373 and mutes the reflected ladder. Sample windows agree (N=3.84e6 max |E97| 0.0519 vs 0.0905; N=5.48e7 0.0375 vs 0.0620).',
    yAxisPrice: 'the y-heavy row is NOT free: by the repo Route VII scaling law lnN1*(t,y) = (2c0 - y)/t + L0 (imp-95218) it needs N1* = 1.14e10, 40x the 0.14 row (2.85e8, itself already priced "economically dead") and 1.4e4x above the current family top 5.48e7. The cocycle margin is bought on the tail/height axis, exactly the PT-floor "only lever is verified height" wall re-binding along Route VII.',
  },
  verdict:
    'WALL QUANTIFIED WITH THE REAL MACHINERY, no conditional-contract lead. On the t-axis (the only axis Route VII can move at fixed verified height) the freeze-calculus pilot budget breaks between Lambda 0.1399 and 0.13 and the recombined |E97| itself breaks at 0.10; the excess sits in the p in {2,3,5,7} welds, i.e. the Theorem U small-prime wall is manifest in the evaluator, not only in the S-bar_p majorant. The one regime where the enclosure dips under 0.2797 at Lambda < 0.14 (y-heavy rows) is priced out by the Route VII N1* law (40x more rows than the 0.14 contract). The frozen 0.14 row remains a CONTRACT (sampled sup < R_strict on the anchor window, full cover not run); nothing here promotes any Lambda bound. No refereed bound is changed; RH open; NO QED.',
});

export const GATE2_SUB0145_ROW_SWEEP_ASSERTIONS = Object.freeze([
  {
    name: 'row labels match Lambda = t + y^2/2 exactly (six rows, all sub-0.145)',
    holds: () => ROWS.every((r) => Math.abs(lambdaOf(r) - r.lambda) < 1e-12 && r.lambda < 0.145),
  },
  {
    name: 'frozen 0.14 row: sampled sups on the anchor window sit under the eq-(20) contract literal',
    holds: () => {
      const a = rowOf('row0140').anchor;
      return a.supPilot < R_STRICT && a.supE97 < R_STRICT && R_STRICT < REX_EXACT;
    },
  },
  {
    name: 't-axis crossing: row0130 pilot exceeds Rex by +1.75%, row0100 |E97| exceeds Rex by +3.16%',
    holds: () => {
      const p = rowOf('row0130').anchor.supPilot, e = rowOf('row0100').anchor.supE97;
      return p > REX_EXACT && Math.abs(p / REX_EXACT - 1.0175) < 1e-3
        && e > REX_EXACT && Math.abs(e / REX_EXACT - 1.0316) < 1e-3
        && rowOf('row0130').anchor.supE97 < R_STRICT && rowOf('row0120').anchor.supE97 < R_STRICT;
    },
  },
  {
    name: 'pilot and |E97| are monotone in t at fixed y^2 = 0.03 (0.115 > 0.105 > 0.085)',
    holds: () => {
      const [a, b, c] = ['row0130', 'row0120', 'row0100'].map((k) => rowOf(k).anchor);
      return a.supPilot < b.supPilot && b.supPilot < c.supPilot && a.supE97 < b.supE97 && b.supE97 < c.supE97;
    },
  },
  {
    name: 'small-prime welds {2,3,5,7} carry >= 76% of the pilot at every witness, p=2 the largest defect',
    holds: () => ROWS.every((r) => r.witness.smallPrimeShare >= 0.76
      && r.witness.D2 > r.witness.D3 && r.witness.D3 > r.witness.D5
      && Math.abs(r.witness.pilot - r.anchor.supPilot) < 2e-6),
  },
  {
    name: 'y-heavy escape at Lambda 0.13 undercuts the 0.14 row but costs 40x Route VII rows',
    holds: () => {
      const y = rowOf('row0130y'), f = rowOf('row0140');
      return y.lambda === 0.13 && y.anchor.supPilot < f.anchor.supPilot && y.anchor.supE97 < f.anchor.supE97
        && y.samples.point54799999.absE97 < f.samples.point54799999.absE97
        && Math.abs(y.routeVII_N1Star / f.routeVII_N1Star - 39.9) < 0.5;
    },
  },
  {
    name: 'honest framing: measurement, not a bound; no refereed bound is changed; NO QED',
    holds: () => /MEASUREMENT/.test(GATE2_SUB0145_ROW_SWEEP.status)
      && /not a certificate, not a bound/.test(GATE2_SUB0145_ROW_SWEEP.status)
      && /refereed bound is changed/i.test(GATE2_SUB0145_ROW_SWEEP.verdict)
      && /NO QED/.test(GATE2_SUB0145_ROW_SWEEP.verdict),
  },
]);

export default GATE2_SUB0145_ROW_SWEEP;
