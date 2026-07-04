/**
 * @module imp-33309-max-bj-growth-fit
 * @fileoverview imp-33309 (numerical, MEASUREMENT + FIT, HONEST): tabulate and
 * fit the growth law of sup_j B_j (= max_j P_j/D_j, the realised-gap-aware
 * per-term elasticity kernel) across all 10 imp-3725 plateaus of [1e4,1e6],
 * characterizing whether the N-uniformity residual dg2 that the imp-33290
 * tighter-majorant swap RELOCATES onto sup_{N,j} B_j is plausibly bounded or
 * genuinely unbounded.
 *
 * WHY THIS MEASUREMENT
 * --------------------
 * imp-33290 proved the swap 8/s_min(j)^2 -> 8*B_j (B_j = P_j/D_j, P_j=sum 1/s_l,
 * D_j=sum s_l) is provably still an upper bound (AM-HM: P_j<=m_j/s_min,
 * D_j>=m_j*s_min => B_j<=1/s_min^2) and collapses the certified ratio R_maj (up
 * to 11.08) onto the flat K_real floor (<=1.60), removing 84.70% of the endpoint
 * over-charge. But it does NOT deliver an N-uniform certified constant: B_j is a
 * running RATIO of prefix sums, so certifying 8*B_j N-uniformly reduces to
 * bounding sup_{N,j} B_j = the realised elasticity = the imp-33250 residual dg2.
 * imp-33290 noted only the endpoints (max B_j 2.10 at plateau 0, 6.45 at plateau
 * 5) -- it never tabulated or FIT the full 10-plateau growth.
 *
 * THE DATA (baked from scripts/imp-33309-max-bj-growth-fit.mjs, itself reading
 * the imp-33290 sweep scripts/imp-33290-far-term-tighter-majorant-assess.mjs)
 * -----------------------------------------------------------------------------
 * max_j B_j per plateau: [2.0959, 2.1965, 2.7439, 4.6691, 2.7013, 6.4537,
 * 3.7228, 4.1845, 4.0866, 4.9938] over endN [18859 .. 1000000].
 *
 * THE DECISIVE QUALITATIVE FACT: NON-MONOTONE
 * -------------------------------------------
 * The global maximum (6.4537) sits at plateau 5 (endN ~ 95248), NOT at the
 * endpoint plateau 9 (endN = 1e6, max B_j = 4.9938). The sequence DIPS after its
 * peak. A genuine monotone-in-N growth law forbids such a dip, so the ~1.72
 * decades of N in [1e4,1e6] do not exhibit a clean growth law at all -- the
 * apparent "growth" imp-33290 flagged (2.10 -> 6.45) is a rising phase that the
 * later plateaus retract.
 *
 * THE FITS (least squares, R^2 computed LIVE below)
 * -------------------------------------------------
 *  - linear vs plateau idx : maxBj = 0.287*idx + 2.49        R^2 ~ 0.40
 *  - log    vs ln(endN)    : maxBj = 0.590*lnN - 3.20        R^2 ~ 0.27
 *  - power  (log-log)      : maxBj = 0.373 * N^0.190         R^2 ~ 0.39
 *  - sub-log vs ln(ln N)   : maxBj = 7.10*lnlnN - 13.74      R^2 ~ 0.28
 * EVERY candidate fit is poor (best R^2 ~ 0.40); the power-law exponent alpha ~
 * 0.19 is tiny (over 1.72 decades of N, max B_j only roughly doubles). The
 * residual scatter dwarfs the trend.
 *
 * VERDICT (fit-only feasibility, NOT certification)
 * -------------------------------------------------
 * The measurement CANNOT distinguish a slow unbounded drift from a bounded
 * lattice fluctuation over this window: the trend is weak (alpha~0.19), the fits
 * are poor (R^2<=0.40), and the sequence is non-monotone. So the relocated
 * imp-33250 dg2 obstruction stays OPEN both ways -- sup_{N,j} B_j is NEITHER
 * certified bounded (no finite table pins it; it climbed to 6.45) NOR
 * demonstrated unbounded (the endpoint dips below the peak and no growth law
 * fits). The honest read is that the imp-33290 tighter swap removes the
 * over-charge but leaves an EMPIRICALLY O(1)-in-this-window, UNCERTIFIED sup B_j.
 *
 * HONEST SCOPE
 * ------------
 *  - MEASUREMENT + curve-fit on the 10 plateaus of [1e4,1e6]. maxBj/endN baked
 *    from the imp-33290 sweep; the four fits and their R^2 are re-derived LIVE.
 *  - No new Lambda bound. imp-3910 C <= 54.56 stands; imp-3066 K_a >= 0
 *    UNTOUCHED; Platt-Trudgian Lambda <= 0.2 remains SOTA; NO QED.
 *
 * @see imp-33290-far-term-tighter-majorant-assessment.js (source of maxBj; proved the swap valid + relocated the obstruction to sup B_j)
 * @see imp-33250-tail-weight-ratio-n-uniformity-assessment.js (residual dg2 that sup_{N,j} B_j equals)
 * @see imp-33269-all-plateaus-majorant-ratio-scan.js (R_maj / realisedScan / Dmin plateau aggregates)
 */

// max_j B_j (= max_j P_j/D_j) per imp-3725 plateau (thetaBar=0.99) of [1e4,1e6],
// with each plateau's running-min end index, baked from the imp-33309 offline
// fit script (2026-07-04). Kept as literals so this module stays light (no
// transitive zeros-bundle import).
const ROWS = Object.freeze([
  { plateauIndex: 0, endN: 18859, maxBj: 2.0959 },
  { plateauIndex: 1, endN: 44555, maxBj: 2.1965 },
  { plateauIndex: 2, endN: 73997, maxBj: 2.7439 },
  { plateauIndex: 3, endN: 82552, maxBj: 4.6691 },
  { plateauIndex: 4, endN: 87761, maxBj: 2.7013 },
  { plateauIndex: 5, endN: 95248, maxBj: 6.4537 },
  { plateauIndex: 6, endN: 354769, maxBj: 3.7228 },
  { plateauIndex: 7, endN: 415587, maxBj: 4.1845 },
  { plateauIndex: 8, endN: 420891, maxBj: 4.0866 },
  { plateauIndex: 9, endN: 1000000, maxBj: 4.9938 },
].map(Object.freeze));

const N = ROWS.length;

// Ordinary least squares of ys ~ slope*xs + intercept; returns slope, intercept, R^2.
function olsFit(xs, ys) {
  const mx = xs.reduce((a, b) => a + b, 0) / N;
  const my = ys.reduce((a, b) => a + b, 0) / N;
  let sxx = 0, sxy = 0, syy = 0;
  for (let i = 0; i < N; i++) {
    const dx = xs[i] - mx, dy = ys[i] - my;
    sxx += dx * dx; sxy += dx * dy; syy += dy * dy;
  }
  const slope = sxy / sxx;
  const r = sxy / Math.sqrt(sxx * syy);
  return Object.freeze({ slope, intercept: my - slope * mx, r2: r * r });
}

const IDXS = ROWS.map((r) => r.plateauIndex);
const MBJ = ROWS.map((r) => r.maxBj);
const ENDN = ROWS.map((r) => r.endN);
const LN_N = ENDN.map(Math.log);
const LN_B = MBJ.map(Math.log);

const fitLinIdx = olsFit(IDXS, MBJ);                  // maxBj = a*idx + b
const fitLogN = olsFit(LN_N, MBJ);                    // maxBj = a*ln(N) + b
const fitPower = olsFit(LN_N, LN_B);                  // ln maxBj = alpha*ln N + c
const fitSubLog = olsFit(LN_N.map(Math.log), MBJ);    // maxBj = a*ln(ln N) + b

const GLOBAL_MAX = Math.max(...MBJ);
const ARGMAX_IDX = MBJ.indexOf(GLOBAL_MAX);
const ENDPOINT = MBJ[N - 1];
const MONOTONE = MBJ.every((v, i) => i === 0 || v >= MBJ[i - 1]);
const BEST_R2 = Math.max(fitLinIdx.r2, fitLogN.r2, fitPower.r2, fitSubLog.r2);

export const IMP_33309_MAX_BJ_GROWTH_FIT = Object.freeze({
  id: 'imp-33309',
  title:
    'Growth-law fit of sup_j B_j across the 10 imp-3725 plateaus of [1e4,1e6]: max B_j is ' +
    'NON-MONOTONE (peaks 6.45 at plateau 5, endpoint 4.99 at N=1e6) and every candidate fit ' +
    '(linear/log/power/sub-log) is poor (best R^2 ~ 0.40, power exponent alpha ~ 0.19), so the ' +
    'relocated imp-33250 dg2 obstruction sup_{N,j} B_j is neither certified bounded nor shown unbounded',
  status: 'measurement-fit',
  rhFree: true,
  window: '10 imp-3725 plateaus (thetaBar=0.99) of [1e4,1e6]',
  rows: ROWS,
  globalMaxBj: GLOBAL_MAX,             // 6.4537
  globalMaxPlateau: ARGMAX_IDX,        // 5
  endpointMaxBj: ENDPOINT,             // 4.9938 (plateau 9, N=1e6)
  monotoneInN: MONOTONE,               // false -- the decisive fact
  endpointBelowPeak: ENDPOINT < GLOBAL_MAX,  // true (a monotone N-growth law forbids this)
  fits: Object.freeze({
    linearVsPlateauIndex: fitLinIdx,   // slope ~0.287, R^2 ~0.40
    logVsLnEndN: fitLogN,              // slope ~0.590, R^2 ~0.27
    powerLogLog: fitPower,             // exponent alpha ~0.190, R^2 ~0.39
    subLogVsLnLnN: fitSubLog,          // slope ~7.10, R^2 ~0.28
  }),
  powerExponent: fitPower.slope,       // ~0.1904 (tiny)
  bestR2: BEST_R2,                      // ~0.3951 (all poor)
  verdict: Object.freeze({
    cleanGrowthLaw: false,
    boundedCertified: false,
    unboundedDemonstrated: false,
    obstructionStatus: 'OPEN both ways',
    summary:
      'Over ~1.72 decades of N in [1e4,1e6], max B_j rises then DIPS to the endpoint (non-monotone) ' +
      'and no candidate fit exceeds R^2 ~ 0.40 with a tiny power exponent ~ 0.19, so the measurement ' +
      'cannot distinguish a slow unbounded drift from a bounded lattice fluctuation. The imp-33290 ' +
      'tighter swap removes the far-term over-charge but leaves sup_{N,j} B_j (= imp-33250 dg2) ' +
      'empirically O(1)-in-window yet UNCERTIFIED: neither pinned by a finite table (it reached 6.45) ' +
      'nor shown to grow (the endpoint retracts below the peak).',
  }),
  scope:
    'Measurement + curve-fit on 10 plateaus of [1e4,1e6]. maxBj/endN baked from the imp-33290 sweep; ' +
    'the four least-squares fits and R^2 re-derived LIVE. No new Lambda bound; imp-3066 UNTOUCHED; NO QED.',
});

export const IMP_33309_MAX_BJ_GROWTH_FIT_ASSERTIONS = [
  {
    name: 'imp-33309: max B_j is NON-MONOTONE in N (endpoint dips below the plateau-5 peak)',
    check: () => !MONOTONE && ENDPOINT < GLOBAL_MAX,
  },
  {
    name: 'imp-33309: global max B_j = 6.4537 sits at plateau 5, not the N=1e6 endpoint',
    check: () => ARGMAX_IDX === 5 && Math.abs(GLOBAL_MAX - 6.4537) < 1e-4,
  },
  {
    name: 'imp-33309: every candidate growth fit is poor (best R^2 < 0.5)',
    check: () => BEST_R2 < 0.5,
  },
  {
    name: 'imp-33309: power-law exponent alpha is tiny/positive (~0.19), max B_j only ~doubles over 1.72 decades',
    check: () => fitPower.slope > 0.1 && fitPower.slope < 0.3,
  },
  {
    name: 'imp-33309: sup_{N,j} B_j neither certified bounded nor demonstrated unbounded (obstruction OPEN)',
    check: () =>
      IMP_33309_MAX_BJ_GROWTH_FIT.verdict.boundedCertified === false &&
      IMP_33309_MAX_BJ_GROWTH_FIT.verdict.unboundedDemonstrated === false,
  },
];
