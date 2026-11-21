/**
 * @module imp-35398-finest-rung-compensated-kemp-crosscheck
 *
 * imp-35398 (accuracy, frontier cross-validation): CLOSE the single apparent imp-35264 departure by
 * re-reading the imp-35076 FINEST margin rungs on the imp-35240 Kahan-compensated finite-cutoff route.
 *
 * THE OPEN THREAD
 * ---------------
 * imp-35264 cross-checked the imp-35240 confirmed prefactor K = 8 sqrt(2)/(9 pi) = 0.4001405849...
 * against the imp-35076 finite-ladder 2/3 margin and found the empirical prefactor
 *     kEmp(eps) = (rho_meas(eps) - 2/3) / eps^{3/2}
 * brackets 0.40014 everywhere EXCEPT the single finest rung (N = 1e7, eps = y_N^sharp ~ 7.9e-4), where
 * the imp-35076 STORED margin gives kEmp = 0.41821 -- a ~0.018 excess above the confirmed prefactor.
 * imp-35264 ATTRIBUTED that lone outlier to the imp-35076 6-decimal (toFixed(6)) storage / coarse-
 * quadrature floor rather than a real prefactor drift: rho_meas - 2/3 has shrunk to ~8.8e-6 at that rung,
 * so a single count in the 6th stored decimal (~5e-7) divided by eps^{3/2} ~ 2.2e-5 shifts kEmp by ~0.022,
 * exactly the size of the excess. But imp-35264 never RE-READ that rung on the compensated route -- it
 * argued the floor from grain arithmetic alone. This module closes the thread by direct re-measurement.
 *
 * WHAT THIS DOES
 * -------------
 * It recomputes rho(eps) at the imp-35076 rungs N in {1e5, 1e6, 1e7} (the finest span, including the
 * apparent-departure rung) on the EXACT imp-35240 Kahan-compensated finite-cutoff quadrature -- the
 * machinery built to push past the imp-35076 storage floor. Rescaling u = sqrt(eps) t sends each conjugate
 * branch pair to the real finite-cutoff integral F_p(L) = integral_0^L [(t^2 - i)^{-p} + (t^2 + i)^{-p}] dt,
 * L = eps^{-1/2}, with rho(eps) = |F_2(L)| / (2 |F_3(L)|). The infinite-cutoff values F_p(inf) are read by a
 * compensated mapped Simpson rule (machine precision) and the missing tails R_p(L) by a second compensated
 * quadrature, so dev = rho - 2/3 is NOT swamped by summation roundoff. We then form the compensated
 * kEmp_comp = (rho_comp - 2/3) / eps^{3/2} at the SAME eps = imp-35076 y_N^sharp rungs and compare it to the
 * imp-35076 STORED kEmp (the imp-35264 reading).
 *
 * RESULT (measured, this build)
 * -----------------------------
 * The apparent departure is REMOVED. At the finest rung (N = 1e7, eps ~ 7.9e-4):
 *     imp-35076 STORED  kEmp = 0.418214   (|kEmp - K| = 1.81e-2, the lone imp-35264 outlier)
 *     compensated route kEmp = 0.399887   (|kEmp - K| = 2.54e-4)
 * -- the compensated re-read collapses the finest-rung distance to the confirmed prefactor by ~71x, from
 * 1.81e-2 down to 2.54e-4. Moreover the compensated kEmp approaches K = 8 sqrt(2)/(9 pi) MONOTONICALLY from
 * below across the three rungs (0.397570 -> 0.399335 -> 0.399887 as eps shrinks 7.9e-3 -> 2.5e-3 -> 7.9e-4),
 * a smooth physical O(eps) approach that CONTINUES the imp-35240 finer-ladder climb (K = 0.40010857 at
 * eps = 1e-4) -- NOT the upward storage scatter (0.400059 -> 0.401077 -> 0.418214) the imp-35076 stored
 * column shows at that same finest rung. So the finest-rung 0.4182 is confirmed an imp-35076 6-decimal
 * storage / coarse-quadrature ARTIFACT: kEmp converges back to 0.40014 the moment the floor is pushed past.
 * The single apparent imp-35264 departure is CLOSED.
 *
 * WHY THIS DISCHARGES NOTHING
 * ---------------------------
 * This is arithmetic agreement between two numerical reads of the SAME inherited model-cusp surrogate. It
 * supplies no certified constant, no error bar and no N-uniform inequality, and lives entirely on the
 * imp-3220/imp-3406/imp-33646 surrogate. It confirms the imp-35264 attribution -- the finest-rung outlier is
 * a storage floor, not a prefactor drift -- but it does NOT discharge O3, H3, H4, or G6a. NO QED.
 *
 * VERDICT: CROSS-VALIDATION ONLY on the inherited imp-3220/imp-3406/imp-33646 model-cusp surrogate,
 * G6a_shock_lipschitz STAYS OPEN. Re-reading the imp-35076 finest margin rungs (N = 1e5..1e7) on the
 * imp-35240 Kahan-compensated finite-cutoff quadrature, the empirical prefactor kEmp = (rho - 2/3)/eps^{3/2}
 * at the apparent-departure rung (N = 1e7, eps ~ 7.9e-4) drops from the imp-35076 stored 0.41821 to a
 * compensated 0.39989 -- within 2.54e-4 of the confirmed K = 8 sqrt(2)/(9 pi) = 0.40014, a ~71x reduction
 * in distance -- and approaches K monotonically from below (the imp-35240 O(eps) climb), NOT the imp-35076
 * stored upward scatter. This CLOSES the single apparent imp-35264 departure as an imp-35076 6-decimal
 * storage / coarse-quadrature floor artifact, exactly as imp-35264 diagnosed from grain arithmetic. It
 * certifies no constant, supplies no error bar or N-uniform inequality, establishes no operator positivity,
 * changes no bound, and does NOT discharge O3 / H3 / H4 or G6a. imp-3066 off-diagonal endpoint-Hankel
 * K_a >= 0 UNTOUCHED; C_mb remains GUE-conditional (imp-486); NO QED. No refereed bound is changed.
 *
 * @see imp-35264-rho-prefactor-vs-imp35076-margin-crosscheck (found the lone finest-rung kEmp=0.4182 outlier)
 * @see imp-35240-rho-prefactor-finer-grid-remeasurement (the compensated finite-cutoff route re-used here)
 * @see imp-35076-h3-a-fortiori-discharges-h4-numerical-verification (the stored 2/3 margin, N in 1e3..1e7)
 * @see imp-35216-rho-prefactor-closed-form-assessment (derived K = 4/(3 A_2) = 8 sqrt(2)/(9 pi))
 * @see imp-35379-rho-o-eps-next-order-term-measurement (coarsest-rung next-order residual, eps^{7/2})
 */

import { IMP35076_H3_A_FORTIORI_DISCHARGES_H4_VERIFICATION } from './imp-35076-h3-a-fortiori-discharges-h4-numerical-verification.js';

const PI = Math.PI;
const SQRT2 = Math.SQRT2;

// Inherited amplitude constants (route-sanity reference only).
const A1 = PI / SQRT2; // imp-33646, F_2(infinity) = -A_1/2
const A2 = (3 * PI) / (2 * SQRT2); // imp-33645, F_3(infinity) = -A_2/4

const TWO_THIRDS = 2 / 3; // A_1 / A_2, the shared limit rho(eps) approaches from above.
const K_CLOSED_FORM = (8 * SQRT2) / (9 * PI); // = 4/(3 A_2) = 0.4001405849... (imp-35240 confirmed prefactor)

// Real integrand g_p(t) = (t^2 - i)^{-p} + (t^2 + i)^{-p} (imaginary parts cancel; conjugate branches).
// Identical to the imp-35240 route.
function gp(p, t) {
  const t2 = t * t;
  const t4 = t2 * t2;
  if (p === 2) {
    const A = t4 - 1;
    return (2 * A) / (A * A + 4 * t4);
  }
  const t6 = t4 * t2;
  const A = t6 - 3 * t2;
  const B = 1 - 3 * t4;
  return (2 * A) / (A * A + B * B);
}

// Kahan-compensated composite-Simpson rule over [0, 1] with `panels` intervals (panels even).
function compensatedSimpson(f, panels) {
  const h = 1 / panels;
  let sum = 0;
  let comp = 0;
  for (let i = 0; i <= panels; i++) {
    const w = i === 0 || i === panels ? 1 : i % 2 === 1 ? 4 : 2;
    const y = w * f(i * h) - comp;
    const t = sum + y;
    comp = t - sum - y;
    sum = t;
  }
  return (sum * h) / 3;
}

// F_p(infinity) = integral_0^infinity g_p(t) dt via t = s/(1-s).
function fInfinity(p, panels) {
  return compensatedSimpson((x) => {
    if (x >= 1) return 0;
    const oneMinus = 1 - x;
    const t = x / oneMinus;
    return gp(p, t) / (oneMinus * oneMinus);
  }, panels);
}

// R_p(L) = integral_L^infinity g_p(t) dt via t = L/w, w in (0, 1].
function tailIntegral(p, L, panels) {
  return compensatedSimpson((w) => {
    if (w === 0) return 0;
    const t = L / w;
    return gp(p, t) * (L / (w * w));
  }, panels);
}

// Machine-precision infinite-cutoff values (computed once).
const F2_INF = fInfinity(2, 1000000);
const F3_INF = fInfinity(3, 1000000);
const ABS_F2_INF = Math.abs(F2_INF);
const ABS_F3_INF = Math.abs(F3_INF);

// The imp-35076 FINEST span: N in {1e5, 1e6, 1e7}. N = 1e7 (eps ~ 7.9e-4) is the apparent-departure rung.
const FINEST_N = [1e5, 1e6, 1e7];
const FINEST_RUNGS = IMP35076_H3_A_FORTIORI_DISCHARGES_H4_VERIFICATION.sharedFoldLadder.filter((r) =>
  FINEST_N.includes(r.N),
);

// Re-read each finest rung on the compensated route at the SAME eps = imp-35076 y_N^sharp (matches imp-35264).
const RECHECK = FINEST_RUNGS.map((r) => {
  const eps = r.y_N_sharp;
  const eps32 = Math.pow(eps, 1.5);
  const L = 1 / Math.sqrt(eps);
  const absF2 = ABS_F2_INF + tailIntegral(2, L, 300000); // |F_2(L)| = |F_2(inf)| + R_2(L)
  const absF3 = ABS_F3_INF + tailIntegral(3, L, 300000); // |F_3(L)| = |F_3(inf)| + R_3(L)
  const rhoComp = absF2 / (2 * absF3); // compensated finite-cutoff margin
  const kComp = (rhoComp - TWO_THIRDS) / eps32; // compensated empirical prefactor
  const kStored = (r.marginRatio - TWO_THIRDS) / eps32; // imp-35076 stored reading (the imp-35264 kEmp)
  const distComp = Math.abs(kComp - K_CLOSED_FORM);
  const distStored = Math.abs(kStored - K_CLOSED_FORM);
  return {
    N: r.N,
    eps: +eps.toExponential(4),
    rhoCompensated: +rhoComp.toFixed(10),
    kEmpiricalStored: +kStored.toFixed(6),
    kEmpiricalCompensated: +kComp.toFixed(8),
    distStoredToClosedForm: +distStored.toExponential(3),
    distCompensatedToClosedForm: +distComp.toExponential(3),
    distanceReductionFactor: +(distStored / distComp).toFixed(1),
  };
});

const FINEST = RECHECK[RECHECK.length - 1]; // N = 1e7, eps ~ 7.9e-4: the apparent-departure rung.

// The compensated kEmp approaches K from below monotonically (smooth O(eps) climb, imp-35240-consistent).
const K_COMP_MONOTONE_UP = RECHECK.every(
  (r, i) => i === 0 || r.kEmpiricalCompensated >= RECHECK[i - 1].kEmpiricalCompensated,
);
const K_COMP_DIST_MONOTONE_DOWN = RECHECK.every(
  (r, i) => i === 0 || r.distCompensatedToClosedForm <= RECHECK[i - 1].distCompensatedToClosedForm,
);
const K_COMP_ALL_BELOW = RECHECK.every((r) => r.kEmpiricalCompensated < K_CLOSED_FORM);

export const IMP35398_FINEST_RUNG_COMPENSATED_KEMP_CROSSCHECK = {
  id: 'imp-35398',
  proofSection: 'S-frontier',
  scopes:
    'Re-read the imp-35076 finest margin rungs (N in 1e5..1e7, eps ~ 7.9e-4 at the finest) on the imp-35240 ' +
    'Kahan-compensated finite-cutoff quadrature and confirm the empirical prefactor kEmp = (rho - 2/3)/eps^{3/2} ' +
    'converges back to 8 sqrt(2)/(9 pi) = 0.40014, closing the single apparent imp-35264 finest-rung departure',
  question:
    'Does the imp-35076 finest-rung kEmp = 0.41821 (the lone imp-35264 outlier) collapse back to 0.40014 when ' +
    'rho is re-read on the imp-35240 compensated route, confirming it is an imp-35076 storage / quadrature ' +
    'floor artifact rather than a real prefactor drift? Cross-validation only on the inherited surrogate; NO QED.',

  sharedQuantity: 'rho(eps) = |F_2(L)| / (2 |F_3(L)|), L = eps^{-1/2}, -> 2/3 from above',
  twoThirdsLimit: TWO_THIRDS,
  kClosedForm: +K_CLOSED_FORM.toFixed(10), // 0.4001405850

  // Route sanity: the compensated infinite-cutoff values reproduce -A_1/2, -A_2/4 to machine precision.
  fTwoInfinityResidual: +(F2_INF + A1 / 2).toExponential(3),
  fThreeInfinityResidual: +(F3_INF + A2 / 4).toExponential(3),

  recheck: RECHECK,

  // Headline: the finest-rung (N = 1e7) apparent departure is removed by the compensated re-read.
  finestN: FINEST.N,
  finestEps: FINEST.eps,
  finestKEmpiricalStored: FINEST.kEmpiricalStored, // 0.418214 (the imp-35264 outlier)
  finestKEmpiricalCompensated: FINEST.kEmpiricalCompensated, // 0.399887
  finestDistStored: FINEST.distStoredToClosedForm, // ~1.81e-2
  finestDistCompensated: FINEST.distCompensatedToClosedForm, // ~2.54e-4
  finestDistanceReductionFactor: FINEST.distanceReductionFactor, // ~71x closer after re-read
  departureClosed: FINEST.distCompensatedToClosedForm < 1e-3, // compensated kEmp lands within 1e-3 of 0.40014

  // The compensated kEmp is a smooth monotone approach from below (imp-35240 O(eps) climb), not storage scatter.
  compensatedKMonotoneUp: K_COMP_MONOTONE_UP,
  compensatedDistMonotoneDown: K_COMP_DIST_MONOTONE_DOWN,
  compensatedAllBelowClosedForm: K_COMP_ALL_BELOW,

  consistent: true, // the finest-rung outlier is an imp-35076 artifact; kEmp returns to 0.40014 on the clean route
  dischargesAnything: false,
  residualObstruction:
    'this is arithmetic agreement between two numerical reads of the SAME inherited model-cusp surrogate; it ' +
    'supplies no certified constant, no error bar and no N-uniform inequality, so O3 / H3 / H4 / G6a stay OPEN',

  isRigorous: false,
  verdict:
    'CROSS-VALIDATION ONLY on the inherited imp-3220/imp-3406/imp-33646 model-cusp surrogate, ' +
    'G6a_shock_lipschitz STAYS OPEN. Re-reading the imp-35076 finest margin rungs (N = 1e5..1e7) on the ' +
    'imp-35240 Kahan-compensated finite-cutoff quadrature, the empirical prefactor kEmp = (rho - 2/3)/eps^{3/2} ' +
    'at the apparent-departure rung (N = 1e7, eps ~ 7.9e-4) drops from the imp-35076 stored 0.41821 to a ' +
    'compensated 0.39989 -- within 2.54e-4 of the confirmed K = 8 sqrt(2)/(9 pi) = 0.40014, a ~71x reduction ' +
    'in distance -- and approaches K MONOTONICALLY from below (0.39757 -> 0.39933 -> 0.39989 as eps shrinks), ' +
    'continuing the imp-35240 finer-ladder O(eps) climb rather than the imp-35076 stored upward scatter. This ' +
    'CLOSES the single apparent imp-35264 departure as an imp-35076 6-decimal storage / coarse-quadrature floor ' +
    'artifact, exactly as imp-35264 diagnosed from grain arithmetic. It certifies no constant, supplies no error ' +
    'bar or N-uniform inequality, establishes no operator positivity, changes no bound, and does NOT discharge ' +
    'O3 / H3 / H4 or G6a. imp-3066 off-diagonal endpoint-Hankel K_a >= 0 UNTOUCHED; C_mb remains ' +
    'GUE-conditional (imp-486); NO QED. No refereed bound is changed.',
};

export const IMP35398_FINEST_RUNG_COMPENSATED_KEMP_ASSERTIONS = [
  {
    // (1) route sanity: compensated F_p(inf) reproduce -A_1/2 and -A_2/4 to < 1e-12.
    id: 'imp35398-finf-machine-precision',
    description: 'compensated F_p(inf) reproduce -A_1/2 and -A_2/4 to < 1e-12 (dev = rho - 2/3 not swamped)',
    holds: () => Math.abs(F2_INF + A1 / 2) < 1e-12 && Math.abs(F3_INF + A2 / 4) < 1e-12,
  },
  {
    // (2) the compensated finest-rung kEmp lands within 1e-3 of 8 sqrt(2)/(9 pi) -- the departure is closed.
    id: 'imp35398-finest-rung-kemp-returns-to-closed-form',
    description: 'compensated kEmp at N = 1e7 (eps ~ 7.9e-4) is within 1e-3 of 8 sqrt(2)/(9 pi) = 0.40014',
    holds: () =>
      IMP35398_FINEST_RUNG_COMPENSATED_KEMP_CROSSCHECK.departureClosed === true &&
      FINEST.distCompensatedToClosedForm < 1e-3,
  },
  {
    // (3) we reproduce the imp-35264 finest-rung outlier: the imp-35076 STORED kEmp there really is ~0.42.
    id: 'imp35398-reproduces-imp35264-stored-outlier',
    description: 'the imp-35076 stored finest-rung kEmp exceeds 0.41 (the lone imp-35264 apparent departure)',
    holds: () => FINEST.kEmpiricalStored > 0.41 && FINEST.distStoredToClosedForm > 1e-2,
  },
  {
    // (4) the compensated re-read collapses the finest-rung distance to K by >= 20x versus the stored value.
    id: 'imp35398-compensated-collapses-finest-rung-distance',
    description: 'compensated re-read reduces the finest-rung |kEmp - 8 sqrt(2)/(9 pi)| by at least 20x vs stored',
    holds: () => FINEST.distanceReductionFactor >= 20,
  },
  {
    // (5) the compensated kEmp is a smooth monotone approach from below (O(eps) climb), not storage scatter.
    id: 'imp35398-compensated-monotone-from-below',
    description: 'compensated kEmp rises monotonically toward 8 sqrt(2)/(9 pi) from below (imp-35240 O(eps) climb)',
    holds: () =>
      IMP35398_FINEST_RUNG_COMPENSATED_KEMP_CROSSCHECK.compensatedKMonotoneUp === true &&
      IMP35398_FINEST_RUNG_COMPENSATED_KEMP_CROSSCHECK.compensatedDistMonotoneDown === true &&
      IMP35398_FINEST_RUNG_COMPENSATED_KEMP_CROSSCHECK.compensatedAllBelowClosedForm === true,
  },
  {
    // Honesty gate: cross-validation only; discharges nothing, G6a OPEN, no QED, no refereed bound is changed, imp-3066 untouched.
    id: 'imp35398-honesty-gate-no-qed',
    description:
      'Cross-validation only: departure closed but discharges nothing, G6a OPEN, no QED, no refereed bound is changed, imp-3066 untouched',
    holds: () =>
      IMP35398_FINEST_RUNG_COMPENSATED_KEMP_CROSSCHECK.isRigorous === false &&
      IMP35398_FINEST_RUNG_COMPENSATED_KEMP_CROSSCHECK.dischargesAnything === false &&
      IMP35398_FINEST_RUNG_COMPENSATED_KEMP_CROSSCHECK.consistent === true &&
      /NO QED/.test(IMP35398_FINEST_RUNG_COMPENSATED_KEMP_CROSSCHECK.verdict) &&
      /STAYS OPEN/.test(IMP35398_FINEST_RUNG_COMPENSATED_KEMP_CROSSCHECK.verdict) &&
      /refereed bound is changed/i.test(IMP35398_FINEST_RUNG_COMPENSATED_KEMP_CROSSCHECK.verdict) &&
      /imp-3066 off-diagonal endpoint-Hankel K_a >= 0 UNTOUCHED/.test(
        IMP35398_FINEST_RUNG_COMPENSATED_KEMP_CROSSCHECK.verdict,
      ),
  },
];

for (const a of IMP35398_FINEST_RUNG_COMPENSATED_KEMP_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-35398-finest-rung-compensated-kemp-crosscheck assertion failed: ${a.id}`);
  }
}
