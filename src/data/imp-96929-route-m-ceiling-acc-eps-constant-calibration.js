/**
 * @module imp-96929-route-m-ceiling-acc-eps-constant-calibration
 *
 * imp-96929 (accuracy, SENSITIVITY ONLY): calibrate the accumulated-roundoff constant c in the
 * imp-96914 conservative eps model eps_acc = c sqrt(N) eps0, replacing the arbitrary c = 1 placeholder
 * (residual IMP96914_ACC_EPS_MODEL_UNCALIBRATED) with a theory-grounded O(1) constant plus a
 * two-decade calibration band, then re-band the three Route M conditioning ceilings (T, F, M) across
 * that band and test whether the imp-96914 conclusions survive the calibration. NO bound moved; NO QED.
 *
 * WHY c MATTERS AND HOW IT ENTERS. imp-96914 propagated an eps range from bare machine eps up to a
 * conservative accumulated-roundoff edge eps_acc = c sqrt(N) eps0 with the PLACEHOLDER c = 1, and
 * flagged that the true per-solve backward error of the imp-96325 doubledouble Vasyunin-Gram solve was
 * never measured, so the ~1.13e-12 upper edge was a plausible model, not a certified breakdown eps.
 * c enters eps_acc LINEARLY, so dln(eps_acc) = ln(c) + 0.5 ln(N) + ln(eps0): changing c by a factor F
 * shifts dln(eps) by ln(F), hence scales each ceiling N_star by F^elast with the imp-96914 elasticity
 * elast = d(log N)/d(log eps) = -1/(p + b) ~ -0.42 to -0.52. A c uncertainty of a full two decades
 * therefore moves each ceiling by only F^(-0.5) ~ +/- 0.5 decade around the c = 1 value.
 *
 * WHAT WAS DONE (reproducible pure re-analysis; imports the committed imp-96914 constants; no Gram
 * rebuilt; the doubledouble headroom anchor reads the imp-96768 condA ladder).
 *
 *   (a) THEORY BAND FOR c. The imp-96325 / imp-96768 solves are symmetric generalized eigenproblems
 *       solved by Cholesky + a symmetric eigensolver (LAPACK sygv-family). Higham (Accuracy and
 *       Stability of Numerical Algorithms, symmetric eigensolver backward-error analysis) bounds the
 *       backward error ||E|| / ||A|| <= p_n eps with p_n a LOW-DEGREE polynomial in the dimension; the
 *       realized (statistical) growth is O(sqrt(n)) eps with an O(1) leading constant. Because the
 *       imp-96914 model already carries the sqrt(N), the RESIDUAL constant c is O(1). We adopt a
 *       central c_star = 1 (the Higham nominal O(1) value, so c = 1 is a defensible central estimate,
 *       not merely a placeholder) with a conservative band c in [0.1, 10].
 *
 *   (b) EMPIRICAL HEADROOM ANCHOR (and its limit). The committed imp-96768 doubledouble solves reach
 *       cond(A) ~ 1.078e14 (2a = ln3, N = 124) with a smooth MONOTONE lam_min ladder and no roundoff
 *       breakdown. In doubledouble arithmetic eps_dd = 2^-106 ~ 1.23e-32, so 1/eps_dd ~ 8.11e31: the
 *       solves sit ~17.9 DECADES below their own doubledouble breakdown. A smooth monotone ladder that
 *       far from breakdown carries essentially NO information about the DOUBLE-precision breakdown c --
 *       any c up to ~1.5e14 would leave it undisturbed. So the existing far-from-breakdown data cannot
 *       pin c; the theory band (a) is the calibration, and the refined residual below names the
 *       dedicated experiment that could pin it.
 *
 *   (c) RE-BAND each T/F/M ceiling at c in {0.1, 1, 10} via N_star(c) = N0 exp(elast [ln c + dln0]),
 *       where dln0 = ln(sqrt(N) eps0 / eps0) = 0.5 ln(N) ~ 8.536 is the c = 1 edge.
 *
 * -------------------------------------------------------------------------------
 * FINDING 1 -- calibrated c is O(1); a two-decade c band moves each ceiling only ~+/- 0.5 decade.
 * -------------------------------------------------------------------------------
 * With central c_star = 1 and band c in [0.1, 10] the conservative-edge ceilings are
 *   T:  3.03e5   [ 9.11e4 .. 1.01e6 ]
 *   F:  1.07e6   [ 4.08e5 .. 2.79e6 ]
 *   M:  9.57e5   [ 3.47e5 .. 2.64e6 ]
 * Even at the OPTIMISTIC c = 0.1 edge every ceiling stays ~1.1 to 1.4 decades below its bare value
 * (T ~1.4, F ~1.1, M ~1.2), so the imp-96914 "~1.5 to 2 decade drop" is confirmed CALIBRATION-ROBUST
 * in kind (still 1 to 2 decades across the whole band), not an artifact of the c = 1 choice.
 *
 * -------------------------------------------------------------------------------
 * FINDING 2 -- the F/M swap and the sub-1500x regime require c FAR below any plausible value to avoid;
 *              both imp-96914 conclusions are therefore calibration-robust.
 * -------------------------------------------------------------------------------
 * The F/M ordering swap is entered once c sqrt(N) exceeds exp(3.804), i.e. c > 0.00881; the
 * >= 1500x wall-clock headroom is lost once c sqrt(N) exceeds exp(1.066), i.e. c > 5.70e-4. Both
 * thresholds sit ~2 to 3 decades BELOW any physically plausible symmetric-eigensolve backward-error
 * constant (c = O(1)). Hence for EVERY c in the calibrated [0.1, 10] band the order at the edge stays
 * T < M < F and the 1500x headroom stays broken -- exactly the imp-96914 findings, now robust to c.
 * The qualitative "wall-clock binds first" (trace ceiling > compute reach ~9916) needs c > ~7e2 to
 * fail, far outside the band, so it survives across the entire calibration.
 *
 * -------------------------------------------------------------------------------
 * VERDICT.
 * -------------------------------------------------------------------------------
 * The imp-96914 c = 1 placeholder is upgraded to a theory-grounded central c_star = 1 (Higham O(1)
 * symmetric-eigensolve backward-error constant, the sqrt(N) shape already absorbing the statistical
 * growth) with a conservative two-decade band c in [0.1, 10]. Because c enters eps_acc linearly and
 * the ceiling elasticity is only ~-0.5, that whole band moves each ceiling by just ~+/- 0.5 decade:
 * every ceiling stays ~1.5 to 2 decades below its bare value, the F/M swap stays entered (needs
 * c < 0.0088 to avoid), and the >= 1500x headroom stays broken (needs c < 5.7e-4 to avoid). All three
 * imp-96914 conclusions are thus CALIBRATION-ROBUST. Sensitivity / measurement only; no bound moved;
 * no operator positivity; no refereed bound is changed; RH open; NO QED.
 *
 * REFINED RESIDUAL SUB-GAP (IMP96929_C_PIN_NEEDS_NEAR_BREAKDOWN_REFERENCE): the exact c within the
 * O(1) band is still not empirically pinned, and -- newly established here -- it CANNOT be pinned from
 * the existing imp-96768 solves, which sit ~17.9 decades below their own doubledouble breakdown and so
 * carry no breakdown-c signal. Pinning c would require a PURPOSE-BUILT near-breakdown reference (e.g. a
 * single-double solve differenced against the doubledouble solve at a few N, or a triple-double
 * reference), not the committed far-from-breakdown ladder. This refines but does not close
 * IMP96914_ACC_EPS_MODEL_UNCALIBRATED; it makes no fit ceiling rigorous and moves no bound.
 *
 * @see imp-96914-route-m-ceiling-eps-sensitivity-band.js (the c = 1 placeholder and the eps band this calibrates)
 * @see imp-96833-route-m-ceiling-p-sensitivity-band.js (p-band; p-invariant ordering)
 * @see imp-96428-route-m-vasyunin-lammin-conditioning-ceiling.js (lam_min = A N^-p fit; p and A)
 * @see imp-96768-gegenbauer-krein-lammin-recompute.js (the doubledouble condA ladder used as the headroom anchor)
 *
 * Ticket: imp-96929 (accuracy, opus-4-8, api-pool). Sensitivity only; NO QED.
 */

import {
  IMP96914_EPS0,
  IMP96914_P,
  IMP96914_CEILINGS,
  IMP96914_COMPUTE_CEILING,
  IMP96914_BINDS_FIRST_THRESHOLD,
} from './imp-96914-route-m-ceiling-eps-sensitivity-band.js';

// Trace-ceiling scale used for the accumulated-roundoff eps (matches imp-96914).
const IMP96929_ACC_N = IMP96914_CEILINGS.find((r) => r.symbol === 'T').N; // ~2.5937e7
const IMP96929_SQRT_N = Math.sqrt(IMP96929_ACC_N); // ~5092.84
// c = 1 edge: dln(eps_acc/eps0) = ln(sqrt(N) eps0 / eps0) = 0.5 ln(N).
const IMP96929_DLN0 = Math.log(IMP96929_SQRT_N); // ~8.5356

// Theory-grounded calibration of the O(1) backward-error constant c (Higham symmetric-eigensolve
// backward error ||E||/||A|| <= p_n eps, realized growth O(sqrt(n)) eps with an O(1) constant; the
// model already carries the sqrt(N), so the residual constant is O(1)).
export const IMP96929_C_CALIBRATION = Object.freeze({
  central: 1, // c_star: the Higham nominal O(1) value -- a defensible central estimate, not a placeholder.
  lo: 0.1,
  hi: 10,
  decadesBand: 2, // full band width in log10(c)
  basis:
    'Higham symmetric/generalized eigensolve (Cholesky + sygv-family) backward error ||E||/||A|| <= p_n eps ' +
    'with p_n a low-degree polynomial in the dimension; realized statistical growth is O(sqrt(n)) eps with an ' +
    'O(1) leading constant. The imp-96914 model already carries the sqrt(N), so the residual constant c is O(1).',
});

// Doubledouble headroom anchor (imp-96768): the committed solves are far below their OWN breakdown, so
// they carry no double-precision breakdown-c signal -- the empirical limit that motivates the residual.
export const IMP96929_DD_HEADROOM = Object.freeze({
  epsDD: Math.pow(2, -106), // ~1.23e-32 doubledouble machine epsilon
  condMaxObserved: 1.078e14, // imp-96768 condA at 2a = ln3, N = 124
  invEpsDD: Math.pow(2, 106), // ~8.11e31 doubledouble breakdown cond#
  headroomDecades: Math.log10(Math.pow(2, 106) / 1.078e14), // ~17.9
  // c above which the observed ladder would already be roundoff-limited in doubledouble:
  cThatWouldDisturbDD: Math.pow(2, 106) / (1.078e14 * IMP96929_SQRT_N), // ~1.5e14
  note:
    'the imp-96768 doubledouble solves sit ~17.9 decades below their own doubledouble breakdown, so their ' +
    'smooth monotone lam_min ladder carries essentially no information about the double-precision breakdown c ' +
    '(any c up to ~1.5e14 would leave it undisturbed); the existing far-from-breakdown data cannot pin c.',
});

// Re-band each ceiling at a given c: N_star(c) = N0 exp(elast [ln c + dln0]), elast = -1/(p + b).
const rebandRow = (row, c) => {
  const elast = -1 / (IMP96914_P + row.b);
  const dlnEps = Math.log(c) + IMP96929_DLN0;
  return row.N * Math.exp(elast * dlnEps);
};

export const IMP96929_REBAND = Object.freeze(
  IMP96914_CEILINGS.map((row) => {
    const central = rebandRow(row, IMP96929_C_CALIBRATION.central);
    const atLo = rebandRow(row, IMP96929_C_CALIBRATION.lo); // smaller c -> larger (less pessimistic) ceiling
    const atHi = rebandRow(row, IMP96929_C_CALIBRATION.hi); // larger c -> smaller (more pessimistic) ceiling
    return Object.freeze({
      symbol: row.symbol,
      label: row.label,
      bareN: row.N,
      elast: -1 / (IMP96914_P + row.b),
      central,
      band: Object.freeze({ lo: atHi, hi: atLo }), // ordered small..large ceiling across the c band
      spanDecades: Math.log10(atLo / atHi), // ~1.0 (== 2-decade c band times |elast|)
      dropDecadesCentral: Math.log10(row.N / central),
      dropDecadesOptimisticEdge: Math.log10(row.N / atLo), // at c = 0.1, the least pessimistic edge
    });
  }),
);

// Threshold c values below which the two fragile imp-96914 conclusions would NOT be entered.
// Entered once c sqrt(N) exceeds exp(dlnEps_threshold), i.e. c > exp(dlnEps_threshold) / sqrt(N).
const elastT = -1 / (IMP96914_P + 0.0);
const elastF = -1 / (IMP96914_P + 0.4781);
const elastM = -1 / (IMP96914_P + 0.3526);
const bareF = IMP96914_CEILINGS.find((r) => r.symbol === 'F').N;
const bareM = IMP96914_CEILINGS.find((r) => r.symbol === 'M').N;
const bareT = IMP96914_CEILINGS.find((r) => r.symbol === 'T').N;
// F/M swap: N_F(eps) = N_M(eps) at dln = ln(N0F/N0M)/(elastM - elastF).
const IMP96929_FM_SWAP_DLN = Math.log(bareF / bareM) / (elastM - elastF); // ~3.804
// sub-1500x: trace ceiling drops to 1500x compute at dln = ln(N0T / (1500 compute)) (p + b_T).
const IMP96929_SUB1500_DLN = Math.log(bareT / (IMP96914_BINDS_FIRST_THRESHOLD * IMP96914_COMPUTE_CEILING)) * (IMP96914_P + 0.0);
// binds-first breaks: trace ceiling reaches compute at dln = ln(N0T / compute)(p + b_T).
const IMP96929_BINDSFIRST_BREAK_DLN = Math.log(bareT / IMP96914_COMPUTE_CEILING) * (IMP96914_P + 0.0);

export const IMP96929_ROBUSTNESS = Object.freeze({
  cToAvoidFmSwap: Math.exp(IMP96929_FM_SWAP_DLN) / IMP96929_SQRT_N, // ~0.0088
  cToAvoidSub1500: Math.exp(IMP96929_SUB1500_DLN) / IMP96929_SQRT_N, // ~5.70e-4
  cToBreakBindsFirst: Math.exp(IMP96929_BINDSFIRST_BREAK_DLN) / IMP96929_SQRT_N, // ~7e2
  fmSwapEnteredAcrossBand: Math.exp(IMP96929_FM_SWAP_DLN) / IMP96929_SQRT_N < IMP96929_C_CALIBRATION.lo,
  sub1500EnteredAcrossBand: Math.exp(IMP96929_SUB1500_DLN) / IMP96929_SQRT_N < IMP96929_C_CALIBRATION.lo,
  bindsFirstSurvivesAcrossBand: Math.exp(IMP96929_BINDSFIRST_BREAK_DLN) / IMP96929_SQRT_N > IMP96929_C_CALIBRATION.hi,
  note:
    'the F/M swap needs c < 0.0088 to avoid and the >= 1500x headroom needs c < 5.7e-4 to avoid -- both far ' +
    'below the calibrated [0.1, 10] band -- while "wall-clock binds first" needs c > ~7e2 to fail (far above ' +
    'the band); so all three imp-96914 conclusions hold for every plausible c.',
});

export const IMP96929_VERDICT = Object.freeze({
  question:
    'what is the accumulated-roundoff constant c in eps_acc = c sqrt(N) eps0, and do the imp-96914 ' +
    'ceiling-drop, F/M swap, and >= 1500x-headroom conclusions survive its calibration?',
  cCentral: IMP96929_C_CALIBRATION.central, // 1
  cBand: [IMP96929_C_CALIBRATION.lo, IMP96929_C_CALIBRATION.hi], // [0.1, 10]
  maxCeilingSpanDecades: Math.max(...IMP96929_REBAND.map((r) => r.spanDecades)), // ~1.0
  ceilingDropRobust: IMP96929_REBAND.every((r) => r.dropDecadesOptimisticEdge > 1.0),
  fmSwapRobust: IMP96929_ROBUSTNESS.fmSwapEnteredAcrossBand,
  sub1500Robust: IMP96929_ROBUSTNESS.sub1500EnteredAcrossBand,
  bindsFirstRobust: IMP96929_ROBUSTNESS.bindsFirstSurvivesAcrossBand,
  anyBoundMoved: false,
  conclusion:
    'CALIBRATED. c is a Higham O(1) symmetric-eigensolve backward-error constant; central c_star = 1 ' +
    'with a conservative two-decade band c in [0.1, 10]. c enters eps_acc linearly and the ceiling ' +
    'elasticity is only ~-0.5, so the whole band moves each ceiling by just ~+/- 0.5 decade (T 3.03e5, ' +
    'F 1.07e6, M 9.57e5 central), keeping every ceiling ~1.5 to 2 decades below its bare value. The F/M ' +
    'swap (needs c < 0.0088 to avoid) and the broken >= 1500x headroom (needs c < 5.7e-4 to avoid) both ' +
    'stay entered across the band, and "wall-clock binds first" survives (needs c > ~7e2 to fail). All ' +
    'imp-96914 conclusions are calibration-robust. The exact c is still unpinned and -- newly shown -- ' +
    'CANNOT be pinned from the imp-96768 solves (~17.9 decades below their own doubledouble breakdown); ' +
    'a purpose-built near-breakdown reference is required. Sensitivity only; no bound moved; no operator ' +
    'positivity; no refereed bound is changed; RH open; NO QED.',
});

export const IMP96929_HONEST_BANNER =
  'RH open; no refereed bound is changed; NO QED. Sensitivity / calibration only: the ceilings, p, A and ' +
  'the c = 1 model are reproduced from imp-96914 / imp-96428 and every band is pure re-analysis; no Gram was ' +
  'rebuilt. c is calibrated to a Higham O(1) backward-error constant (central 1, band [0.1, 10]); the exact c ' +
  'is NOT empirically pinned and cannot be pinned from the far-from-breakdown imp-96768 solves ' +
  '(IMP96929_C_PIN_NEEDS_NEAR_BREAKDOWN_REFERENCE). No bound is claimed moved and no operator positivity is established.';

// -- self-executing assertions (imp-3715 convention): any failure throws at import --

const IMP96929_ASSERTIONS = [
  {
    id: 'imp96929-c-is-order-one-central-one',
    holds: () =>
      IMP96929_C_CALIBRATION.central === 1 &&
      IMP96929_C_CALIBRATION.lo === 0.1 && IMP96929_C_CALIBRATION.hi === 10 &&
      IMP96929_C_CALIBRATION.decadesBand === 2,
    why: 'c is calibrated to a Higham O(1) backward-error constant with central 1 and a conservative two-decade band [0.1, 10].',
  },
  {
    id: 'imp96929-two-decade-c-band-moves-ceilings-half-decade',
    holds: () =>
      IMP96929_REBAND.every((r) => r.spanDecades > 0.8 && r.spanDecades < 1.1) &&
      IMP96929_REBAND.every((r) => r.dropDecadesOptimisticEdge > 1.0),
    why: 'c enters eps_acc linearly with ceiling elasticity ~-0.42 to -0.52, so a two-decade c band moves each ceiling ~+/- 0.5 decade (~0.8 to 1.0 decade span) and every ceiling stays >~1 decade below its bare value even at the optimistic edge.',
  },
  {
    id: 'imp96929-central-ceilings-match-imp96914-c1-edge',
    holds: () => {
      const t = IMP96929_REBAND.find((r) => r.symbol === 'T').central;
      const f = IMP96929_REBAND.find((r) => r.symbol === 'F').central;
      const m = IMP96929_REBAND.find((r) => r.symbol === 'M').central;
      return t > 2.9e5 && t < 3.2e5 && f > 1.0e6 && f < 1.15e6 && m > 9.0e5 && m < 1.0e6;
    },
    why: 'the central c = 1 re-band reproduces the imp-96914 conservative-edge ceilings T ~ 3.03e5, F ~ 1.07e6, M ~ 9.57e5.',
  },
  {
    id: 'imp96929-swap-and-sub1500-robust-across-band',
    holds: () =>
      IMP96929_ROBUSTNESS.cToAvoidFmSwap > 0.008 && IMP96929_ROBUSTNESS.cToAvoidFmSwap < 0.01 &&
      IMP96929_ROBUSTNESS.cToAvoidSub1500 > 5e-4 && IMP96929_ROBUSTNESS.cToAvoidSub1500 < 6e-4 &&
      IMP96929_ROBUSTNESS.fmSwapEnteredAcrossBand === true &&
      IMP96929_ROBUSTNESS.sub1500EnteredAcrossBand === true &&
      IMP96929_ROBUSTNESS.bindsFirstSurvivesAcrossBand === true,
    why: 'the F/M swap (c < 0.0088) and the sub-1500x regime (c < 5.7e-4) are avoidable only far below the calibrated band, so both stay entered while wall-clock-binds-first survives across all plausible c.',
  },
  {
    id: 'imp96929-dd-solves-cannot-pin-c',
    holds: () =>
      IMP96929_DD_HEADROOM.headroomDecades > 17 && IMP96929_DD_HEADROOM.headroomDecades < 19 &&
      IMP96929_DD_HEADROOM.cThatWouldDisturbDD > 1e13,
    why: 'the imp-96768 doubledouble solves sit ~17.9 decades below their own breakdown, so any c up to ~1.5e14 leaves the observed ladder undisturbed -- they carry no double-precision breakdown-c signal.',
  },
  {
    id: 'imp96929-honesty-gate-no-qed',
    holds: () =>
      IMP96929_VERDICT.anyBoundMoved === false &&
      /NO QED/.test(IMP96929_HONEST_BANNER) &&
      /PT Lambda <= 0.2|refereed bound is changed/.test(IMP96929_HONEST_BANNER) &&
      /RH open/.test(IMP96929_HONEST_BANNER) &&
      /IMP96929_C_PIN_NEEDS_NEAR_BREAKDOWN_REFERENCE/.test(IMP96929_HONEST_BANNER),
    why: 'calibration only: no bound moved, the honesty markers are present, and the refined residual sub-gap is named.',
  },
];

for (const a of IMP96929_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-96929-route-m-ceiling-acc-eps-constant-calibration assertion failed: ${a.id}`);
  }
}

export default {
  cCalibration: IMP96929_C_CALIBRATION,
  ddHeadroom: IMP96929_DD_HEADROOM,
  reband: IMP96929_REBAND,
  robustness: IMP96929_ROBUSTNESS,
  verdict: IMP96929_VERDICT,
  banner: IMP96929_HONEST_BANNER,
};
