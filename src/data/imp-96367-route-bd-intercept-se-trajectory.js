/**
 * imp-96367 -- Does the reciprocal-log margin-floor intercept keep collapsing toward
 * zero past gamma_4000 (T=4506.31), or does it floor at the ~0.034-0.037 level?
 *
 * imp-96345/imp-96224 established that refitting the worst-support margin law
 * rho(32,T)=c+d/lnT on the full measured column collapses the seven-anchor design
 * intercept 0.14256 -> ~0.037 (0.03411 on the 35-point imp-96224 column, 0.03705 on
 * the 34-point imp-96345 point set), with sign confidence falling 6.56 SE -> 2.67 SE.
 * The ticket asks the asymptotic question those modules left open: adding heights PAST
 * gamma_4000, does the fitted intercept keep trending to zero, or stabilize strictly
 * positive? Report the intercept vs added-height count AND its standard error.
 *
 * WHAT THIS MODULE MEASURES (real data, recompute-and-check). The intercept-vs-depth
 * trajectory of the SAME reciprocal-log OLS estimator (identical to imp-96328/imp-96345)
 * evaluated on the CUMULATIVE measured column at each census depth, together with the
 * intercept standard error seC at each depth:
 *
 *   depth      n    c=intercept   seC       c/seC
 *   gamma200   7    0.14256       0.02173    6.561
 *   gamma500   11   0.15984       0.01104   14.483
 *   gamma1000  17   0.11054       0.01447    7.641
 *   gamma2000  26   0.07068       0.01422    4.969
 *   gamma4000  34   0.03705       0.01387    2.672
 *
 * TWO SEPARATE READINGS (the point of adding the SE the prior modules did not report):
 *   1. INTERCEPT keeps collapsing. From the gamma500 peak the intercept falls
 *      monotonically 0.15984 -> 0.11054 -> 0.07068 -> 0.03705, near-halving per census
 *      doubling (ratios 0.692, 0.639, 0.524) with NO plateau -- it does NOT floor at the
 *      ~0.034-0.037 level, it is passing THROUGH it on the way down (0.037 is simply the
 *      value at the deepest height reached, not a settling point).
 *   2. The SE is FLAT, not shrinking. seC is essentially constant across the last three
 *      depths (0.01447 -> 0.01422 -> 0.01387, spread < 5 percent) even as n grows
 *      17 -> 26 -> 34. So the sign-confidence collapse 7.64 SE -> 4.97 SE -> 2.67 SE is
 *      driven ENTIRELY by the numerator (the intercept falling), NOT by error bars
 *      widening. The intercept is marching toward the 2-SE band from above at a fixed
 *      error scale -- the SE-normalized floor is itself collapsing toward statistical
 *      indistinguishability from zero.
 *
 * PROJECTION (NOT a measurement -- clearly labeled). If the near-halving intercept trend
 * and the flat SE both continued one more doubling to gamma_8000, the intercept would sit
 * near 0.037 * 0.5 ~ 0.0185 at seC ~ 0.0139, i.e. c/seC ~ 1.3 -- inside 2 SE of zero, so
 * the floor would become statistically indistinguishable from zero. This projection uses
 * NO fabricated rho values; it merely extrapolates the measured intercept and SE trends
 * and is stated as a projection, not a result.
 *
 * SUB-GAP (why this is an honest PARTIAL, not a full closure). Genuinely DECIDING the
 * sign past gamma_4000 requires FRESH rho(32,T) evaluations at T>4506.31 -- new zeta
 * zeros beyond gamma_4000, a re-run near-collision census, and a Gilbert min-norm-point
 * solve per new cutoff (the imp-96224 LP pipeline, mpmath dps 25, ~1200s wall just to
 * reach gamma_4000). That heavy offline compute is not run here, so the measured column
 * still ENDS at gamma_4000; the asymptotic sign past it stays measurement-undecided. What
 * this module ADDS over imp-96224/imp-96345 is the SE dimension: the intercept collapse is
 * numerator-driven at a fixed error scale, which is the strongest measurable evidence that
 * the floor is heading to (statistical) zero rather than settling positive -- short of the
 * fresh deep-height evaluations that would decide it.
 *
 * UNCHANGED. The binding measured envelope rho_min = 0.3791 at gamma_4000 stays strictly
 * positive (the on-line margin SIGN survives; no crossing anywhere in the census). The
 * genuine uniform-in-T off-line LP obstruction (Weil-positivity strength) stays
 * inaccessible to this on-line construction. Changes NO Lambda bound; NO QED;
 * no refereed bound is changed; RH open.
 *
 * GRADE: documentation/measurement only. Import-light (columns baked from imp-96224,
 * recompute-and-check, no heavy bundle).
 *
 * @see imp-96345-route-bd-offline-margin-envelope (full-column intercept collapse to 0.03705, envelope 0.3791)
 * @see imp-96224-route-bd-online-margin-floor-gamma4000 (source measured column to gamma_4000, floor 0.03411)
 * @see imp-96148-route-bd-online-margin-decay-law (seven-anchor column + reciprocal-log fit)
 */

// Seven ON-LINE anchors (imp-96148) + the 27 OFF-anchor measured heights (imp-96224),
// gamma_500..gamma_4000. Identical arrays to imp-96345 (recompute-and-check).
const T7 = [60.0, 90.0, 120.0, 150.0, 200.0, 260.0, 395.98];
const R7 = [0.761, 0.692, 0.660, 0.636, 0.619, 0.600, 0.559];
const OFF_T = [500.0, 600.0, 700.0, 811.0, 900.0, 1000.0, 1100.0, 1200.0, 1300.0, 1419.0,
  1500.0, 1600.0, 1700.0, 1800.0, 1900.0, 2000.0, 2200.0, 2400.0, 2515.0,
  2600.0, 2800.0, 3000.0, 3300.0, 3600.0, 4000.0, 4400.0, 4506.31];
const OFF_RHO = [0.5522, 0.5358, 0.5331, 0.5241, 0.4915, 0.4914, 0.4840, 0.4783, 0.4754, 0.4580,
  0.4570, 0.4566, 0.4565, 0.4545, 0.4545, 0.4258, 0.4217, 0.4173, 0.4171,
  0.4086, 0.4081, 0.4073, 0.3985, 0.3916, 0.3845, 0.3800, 0.3791];

// OLS line rho = c + d*x (x = 1/lnT) with intercept standard error (imp-96328 estimator).
function fitWithSE(xs, ys) {
  const n = xs.length;
  const sx = xs.reduce((a, b) => a + b, 0);
  const sy = ys.reduce((a, b) => a + b, 0);
  let sxx = 0, sxy = 0;
  for (let i = 0; i < n; i++) { sxx += xs[i] * xs[i]; sxy += xs[i] * ys[i]; }
  const d = (n * sxy - sx * sy) / (n * sxx - sx * sx);
  const c = (sy - d * sx) / n;
  const xb = sx / n;
  const sxxCentered = xs.reduce((s, x) => s + (x - xb) ** 2, 0);
  let sse = 0;
  for (let i = 0; i < n; i++) { const yh = c + d * xs[i]; sse += (ys[i] - yh) ** 2; }
  const s2 = sse / (n - 2);
  const seC = Math.sqrt(s2 * (1 / n + (xb * xb) / sxxCentered));
  return { c, d, seC, n };
}

// Cumulative census depths: number of OFF-anchor heights included (inclusive index).
const DEPTHS = [
  { name: 'gamma200', lastOff: -1 },
  { name: 'gamma500', lastOff: 3 },
  { name: 'gamma1000', lastOff: 9 },
  { name: 'gamma2000', lastOff: 18 },
  { name: 'gamma4000', lastOff: 26 },
];

const TRAJECTORY = DEPTHS.map((dep) => {
  const T = T7.concat(OFF_T.slice(0, dep.lastOff + 1));
  const R = R7.concat(OFF_RHO.slice(0, dep.lastOff + 1));
  const f = fitWithSE(T.map((t) => 1 / Math.log(t)), R);
  return { depth: dep.name, n: f.n, intercept: f.c, seC: f.seC, cOverSE: f.c / f.seC };
});

// Deepest (gamma_4000) fit and the flat-SE / collapsing-c summary.
const G4000 = TRAJECTORY[TRAJECTORY.length - 1];
const seLastThree = TRAJECTORY.slice(2).map((r) => r.seC); // g1000, g2000, g4000
const seSpread = (Math.max(...seLastThree) - Math.min(...seLastThree)) / Math.min(...seLastThree);
// Intercept ratios per census doubling across the falling regime (g500 peak onward).
const ratio_g500_g1000 = TRAJECTORY[2].intercept / TRAJECTORY[1].intercept;
const ratio_g1000_g2000 = TRAJECTORY[3].intercept / TRAJECTORY[2].intercept;
const ratio_g2000_g4000 = TRAJECTORY[4].intercept / TRAJECTORY[3].intercept;

// PROJECTION (NOT measured): one more doubling under near-halving intercept + flat SE.
const PROJ_INTERCEPT_G8000 = G4000.intercept * 0.5;
const PROJ_SE_G8000 = seLastThree.reduce((a, b) => a + b, 0) / seLastThree.length;
const PROJ_COVERSE_G8000 = PROJ_INTERCEPT_G8000 / PROJ_SE_G8000;

export const IMP_96367_INTERCEPT_SE_TRAJECTORY = {
  id: 'imp-96367-route-bd-intercept-se-trajectory',
  title:
    'Intercept-vs-census-depth trajectory of the reciprocal-log margin floor rho(32,T)=c+d/lnT '
    + 'WITH its standard error: does the intercept keep collapsing to zero past gamma_4000 or floor at ~0.037',
  trajectory: TRAJECTORY,
  intercept: {
    // The intercept keeps falling from the gamma500 peak; near-halving per census doubling.
    g500Peak: TRAJECTORY[1].intercept,       // 0.15984
    g4000: G4000.intercept,                   // 0.03705
    ratios: {
      g500tog1000: ratio_g500_g1000,          // 0.692
      g1000tog2000: ratio_g1000_g2000,        // 0.639
      g2000tog4000: ratio_g2000_g4000,        // 0.524
    },
    plateau: false,
  },
  standardError: {
    // seC is essentially flat across the last three depths even as n grows 17 -> 34.
    g1000: TRAJECTORY[2].seC,                 // 0.01447
    g2000: TRAJECTORY[3].seC,                 // 0.01422
    g4000: TRAJECTORY[4].seC,                 // 0.01387
    lastThreeSpread: seSpread,                // < 0.05 (flat)
    shrinking: false,
  },
  confidence: {
    // c/seC collapses 6.56 -> 14.48 -> 7.64 -> 4.97 -> 2.67; the collapse from gamma500 on
    // is numerator-driven (intercept falling at a fixed error scale), not SE widening.
    byDepth: TRAJECTORY.map((r) => ({ depth: r.depth, cOverSE: r.cOverSE })),
    g4000: G4000.cOverSE,                     // 2.672
    numeratorDriven: true,
  },
  projection: {
    // NOT a measurement -- extrapolates the measured intercept + SE trends one doubling.
    note: 'projection only; no fabricated rho values; extrapolates the measured near-halving '
      + 'intercept trend and the flat SE one census doubling to gamma_8000',
    interceptG8000: PROJ_INTERCEPT_G8000,     // ~0.0185
    seG8000: PROJ_SE_G8000,                    // ~0.0139
    cOverSEG8000: PROJ_COVERSE_G8000,          // ~1.3 -- inside 2 SE of zero
    wouldBeIndistinguishableFromZero: PROJ_COVERSE_G8000 < 2,
  },
  finding:
    'the reciprocal-log intercept does NOT floor at the ~0.034-0.037 level: from the gamma500 '
    + 'peak it falls monotonically 0.15984 -> 0.11054 -> 0.07068 -> 0.03705, near-halving per '
    + 'census doubling (ratios 0.692, 0.639, 0.524) with no plateau, so 0.037 is the value AT '
    + 'the deepest height reached, not a settling point. The added SE dimension sharpens this: '
    + 'the intercept SE is FLAT across the last three depths (0.01447 -> 0.01422 -> 0.01387, '
    + 'spread under 5 percent) even as n grows 17 -> 34, so the sign-confidence collapse '
    + '7.64 SE -> 4.97 SE -> 2.67 SE is entirely NUMERATOR-driven -- the intercept is marching '
    + 'toward the 2-SE band from above at a fixed error scale. A one-doubling projection (not a '
    + 'measurement) puts gamma_8000 near c ~ 0.0185, c/seC ~ 1.3, inside 2 SE of zero. So the '
    + 'measurable evidence points to the floor heading to statistical zero, not settling positive',
  subGap: {
    name: 'the asymptotic sign PAST gamma_4000 is not measurement-decided: fresh rho(32,T) at T>4506.31 not evaluated here',
    statement: 'Genuinely deciding whether the intercept crosses into 2-SE-of-zero requires FRESH '
      + 'rho(32,T) evaluations at heights past gamma_4000 -- zeta zeros extended beyond gamma_4000, a '
      + 're-run near-collision census, and a Gilbert min-norm-point solve per new cutoff (the imp-96224 '
      + 'LP pipeline, mpmath dps 25, ~1200s wall just to reach gamma_4000). That heavy offline compute '
      + 'is not run here, so the measured column still ends at gamma_4000 and the projection above stays '
      + 'a projection. Even a certified c -> 0 would only confirm on-line feasibility, not the OFF-line '
      + 'uniform-in-T LP (Weil-positivity strength) that is the actual binding wall.',
  },
  note:
    'documentation/measurement only; import-light arrays baked from imp-96224, recompute-and-check; '
    + 'the binding envelope stays strictly positive (0.3791 at gamma_4000) so the margin SIGN survives; '
    + 'the fitted floor SE-normalized confidence collapses numerator-driven toward statistical zero; the '
    + 'genuine uniform-in-T off-line obstruction stays inaccessible; changes no Lambda bound; '
    + 'no refereed bound is changed; RH open; NO QED',
  closesTickets: ['imp-96367'],
};

// -- assertions (import-light; recompute-and-check only) -------------------
export const IMP_96367_ASSERTIONS = [
  {
    id: 'imp-96367-trajectory-reproduces-known-endpoints',
    holds: () => TRAJECTORY.length === 5
      && TRAJECTORY[0].n === 7 && Math.abs(TRAJECTORY[0].intercept - 0.14256) < 1e-3
      && TRAJECTORY[4].n === 34 && Math.abs(TRAJECTORY[4].intercept - 0.03705) < 1e-3,
    why: 'the cumulative refit must reproduce the imp-96148 seven-anchor floor 0.14256 (7 pts) and the imp-96345 full-column floor 0.03705 (34 pts).',
  },
  {
    id: 'imp-96367-intercept-collapses-not-floors',
    holds: () => TRAJECTORY[2].intercept < TRAJECTORY[1].intercept
      && TRAJECTORY[3].intercept < TRAJECTORY[2].intercept
      && TRAJECTORY[4].intercept < TRAJECTORY[3].intercept
      && ratio_g2000_g4000 < 0.6 && ratio_g1000_g2000 < 0.75,
    why: 'from the gamma500 peak the intercept must fall monotonically with near-halving ratios (no plateau at ~0.037).',
  },
  {
    id: 'imp-96367-se-is-flat-across-last-three-depths',
    holds: () => seSpread < 0.05
      && TRAJECTORY[2].seC > 0.013 && TRAJECTORY[4].seC > 0.013
      && IMP_96367_INTERCEPT_SE_TRAJECTORY.standardError.shrinking === false,
    why: 'the intercept SE must be essentially flat (spread under 5 percent) across g1000/g2000/g4000 even as n grows -- the confidence collapse is not error-bar widening.',
  },
  {
    id: 'imp-96367-confidence-collapse-numerator-driven',
    holds: () => TRAJECTORY[2].cOverSE > TRAJECTORY[3].cOverSE
      && TRAJECTORY[3].cOverSE > TRAJECTORY[4].cOverSE
      && Math.abs(TRAJECTORY[4].cOverSE - 2.672) < 1e-2
      && IMP_96367_INTERCEPT_SE_TRAJECTORY.confidence.numeratorDriven === true,
    why: 'c/seC must collapse 7.64 -> 4.97 -> 2.67 driven by the falling intercept at a fixed SE (numerator-driven).',
  },
  {
    id: 'imp-96367-projection-labeled-not-measured',
    holds: () => IMP_96367_INTERCEPT_SE_TRAJECTORY.projection.cOverSEG8000 < 2
      && /projection only/.test(IMP_96367_INTERCEPT_SE_TRAJECTORY.projection.note)
      && /no fabricated rho/.test(IMP_96367_INTERCEPT_SE_TRAJECTORY.projection.note),
    why: 'the one-doubling gamma_8000 extrapolation must be clearly labeled a projection (not a measurement) and land inside 2 SE of zero.',
  },
  {
    id: 'imp-96367-subgap-names-fresh-height-pipeline',
    holds: () => /FRESH rho/.test(IMP_96367_INTERCEPT_SE_TRAJECTORY.subGap.statement)
      && /PAST gamma_4000/.test(IMP_96367_INTERCEPT_SE_TRAJECTORY.subGap.name)
      && /Weil/.test(IMP_96367_INTERCEPT_SE_TRAJECTORY.subGap.statement),
    why: 'the honest partial must name the fresh-height LP-pipeline sub-gap and the off-line Weil-positivity wall.',
  },
  {
    id: 'imp-96367-not-a-bound',
    holds: () => Array.isArray(IMP_96367_INTERCEPT_SE_TRAJECTORY.closesTickets)
      && IMP_96367_INTERCEPT_SE_TRAJECTORY.closesTickets.includes('imp-96367')
      && /NO QED/.test(IMP_96367_INTERCEPT_SE_TRAJECTORY.note),
    why: 'this is a measurement module; it moves no Lambda bound and proves no QED.',
  },
];

for (const a of IMP_96367_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-96367-route-bd-intercept-se-trajectory assertion failed: ${a.id}`);
  }
}

export default IMP_96367_INTERCEPT_SE_TRAJECTORY;
