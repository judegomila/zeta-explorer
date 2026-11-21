/**
 * @module imp-35379-rho-o-eps-next-order-term-measurement
 *
 * imp-35379 (accuracy, frontier-measurement): MEASURE the coarsest-rung next-order term of rho(eps)
 * DIRECTLY from the imp-35076 large-eps rungs and CONFIRM its magnitude matches the imp-35256 reconciliation.
 *
 * THE GAP imp-35264 LEFT OPEN
 * ---------------------------
 * imp-35264 read the empirical prefactor kEmp = (rho_meas - 2/3)/eps^{3/2} at the coarsest imp-35076 rung
 * (eps ~ 7.9e-2) as kEmp = 0.39263, sitting BELOW K = 8 sqrt(2)/(9 pi) = 0.40014, and ATTRIBUTED the deficit
 * to "the physical O(eps) next-order term of rho(eps) ... reconciled by imp-35256" -- but it never measured
 * that next-order term directly. This module forms the raw residual
 *     r1(eps) = rho_meas(eps) - 2/3 - K eps^{3/2}    (K = 8 sqrt(2)/(9 pi), the imp-35240 confirmed prefactor)
 * at the imp-35076 large-eps rungs and checks it against the imp-35256 reconciliation of the SAME residual.
 *
 * WHAT imp-35256 SAYS THE RESIDUAL SHOULD BE (the correction to the imp-35264 "O(eps)" label)
 * ------------------------------------------------------------------------------------------
 * imp-35264 borrowed the imp-35240 "O(eps)" wording, but imp-35256 RECONCILED that: "O(eps)" is a fingerprint
 * of the imp-35240 conjugate-symmetric finite-cutoff SURROGATE integrand, whose spurious t^{-6} tail survives.
 * The imp-35076 margin is built on the DIRECT branch pair B_p(+) + B_p(-) -- the TRUE m_double_prime pairing --
 * whose t^{-6} tail CANCELS to t^{-8}, so on this route the residual is the eps^{7/2} slot, i.e. the K-residual
 * is O(eps^2), NOT O(eps). imp-35256 pins the coefficient: K_{7/2} = -8 sqrt(2)/(3 pi) = -1.2004217587, so
 *     r1(eps) = rho_meas - 2/3 - K eps^{3/2}  ~=  K_{7/2} eps^{7/2}    on the imp-35076 direct route.
 * This module MEASURES r1 on the imp-35076 rungs and confirms both the exponent (7/2) and the coefficient.
 *
 * RESULT (measured, this build)
 * -----------------------------
 * Recomputing rho_meas on the imp-35076 direct branch quadrature at the large-eps rungs (N in {1e3 .. 1e5},
 * eps in [~7.9e-3, ~7.9e-2]) and forming r1(eps):
 *     N = 1e3  eps ~ 7.93e-2 : r1 = -1.678e-4   K_{7/2} eps^{7/2} = -1.683e-4   ratio 0.997
 *     N = 3e3  eps ~ 4.58e-2 : r1 = -2.461e-5   K_{7/2} eps^{7/2} = -2.461e-5   ratio 1.000
 *     N = 1e4  eps ~ 2.51e-2 : r1 = -2.994e-6   K_{7/2} eps^{7/2} = -2.993e-6   ratio 1.000
 *     N = 3e4  eps ~ 1.45e-2 : r1 = -4.378e-7   K_{7/2} eps^{7/2} = -4.377e-7   ratio 1.000
 *     N = 1e5  eps ~ 7.93e-3 : r1 = -5.324e-8   K_{7/2} eps^{7/2} = -5.323e-8   ratio 1.000
 * The local decay exponent of |r1| between consecutive rungs is 3.500 to three figures -- exactly eps^{7/2},
 * NOT eps^{5/2} (which the imp-35240 surrogate "O(eps) K-residual" would require). The ratio r1 / (K_{7/2}
 * eps^{7/2}) is 1.000 across the ladder and 0.997 at the coarsest rung (the small 0.3% shortfall is the eps^5
 * term imp-35298 measured beginning to bite). So the imp-35264 coarsest-rung kEmp deficit
 *     kEmp - K = r1/eps^{3/2} = K_{7/2} eps^2  (= -1.2004 x (7.93e-2)^2 = -7.55e-3 at the coarsest rung),
 * i.e. kEmp ~= 0.40014 - 0.00755 = 0.39259, reproducing the imp-35264 kEmp = 0.39263 to 4e-5. The deficit is
 * fully accounted for by the imp-35256-reconciled eps^{7/2} term with coefficient K_{7/2} = -8 sqrt(2)/(3 pi).
 *
 * A NOTE ON "O(eps)" vs "O(eps^2)"
 * --------------------------------
 * The imp-35264 prose called this "the physical O(eps) next-order term". That label is the imp-35240
 * surrogate-route reading; the DIRECT measurement here confirms the imp-35256 CORRECTED reading -- the
 * physical residual is eps^{7/2} in rho (O(eps^2) in the K-residual). The MAGNITUDE imp-35264 saw (~1.68e-4
 * at the coarsest rung) is exactly K_{7/2} eps^{7/2}; only the exponent LABEL needed the imp-35256 fix.
 *
 * WHY THIS DISCHARGES NOTHING
 * ---------------------------
 * This is a direct read of the next-order residual on the SAME inherited model-cusp surrogate. It supplies no
 * certified constant, no error bar, no N-uniform inequality; it lives entirely on the imp-3220/imp-3406/
 * imp-33646 surrogate. It confirms that the imp-35264 coarsest-rung deficit is the imp-35256 eps^{7/2} term
 * with the imp-35244/imp-35265 closed-form coefficient; it does NOT discharge O3, H3, H4, or G6a. NO QED.
 *
 * VERDICT: MEASUREMENT / CROSS-CHECK ONLY on the inherited imp-3220/imp-3406/imp-33646 model-cusp surrogate,
 * G6a_shock_lipschitz STAYS OPEN. The raw residual r1 = rho_meas - 2/3 - K eps^{3/2} on the imp-35076 large-eps
 * rungs decays with local exponent 3.500 (eps^{7/2}, NOT eps^{5/2}) and equals K_{7/2} eps^{7/2} with
 * K_{7/2} = -8 sqrt(2)/(3 pi) to ratio 1.000 (0.997 at the coarsest rung, the eps^5 term of imp-35298 biting).
 * This confirms the imp-35256 reconciliation of the SAME residual and reproduces the imp-35264 coarsest-rung
 * kEmp = 0.39263 as 0.40014 + K_{7/2} eps^2 to 4e-5; the imp-35264 "O(eps)" wording is the imp-35240 surrogate
 * label, the physical exponent is 7/2 (O(eps^2) in K-residual). This certifies no constant, supplies no error
 * bar or N-uniform inequality, establishes no operator positivity, changes no bound, and does NOT discharge
 * O3 / H3 / H4 or G6a. imp-3066 off-diagonal endpoint-Hankel K_a >= 0 UNTOUCHED; C_mb remains GUE-conditional
 * (imp-486); NO QED. No refereed bound is changed.
 *
 * @see imp-35264-rho-prefactor-vs-imp35076-margin-crosscheck (named the coarsest-rung deficit, never measured the term)
 * @see imp-35256-k-residual-decay-exponent-reconciliation (reconciled O(eps) vs O(eps^2); K_{7/2} = -8 sqrt(2)/(3 pi))
 * @see imp-35076-h3-a-fortiori-discharges-h4-numerical-verification (the direct-branch margin ladder, N in 1e3..1e7)
 * @see imp-35298-rho-eps5-next-slot-measurement (the eps^5 term after eps^{7/2}, source of the 0.3% coarsest-rung shortfall)
 */

import { IMP35076_H3_A_FORTIORI_DISCHARGES_H4_VERIFICATION } from './imp-35076-h3-a-fortiori-discharges-h4-numerical-verification.js';
import { IMP35256_K_RESIDUAL_DECAY_EXPONENT_RECONCILIATION } from './imp-35256-k-residual-decay-exponent-reconciliation.js';

const PI = Math.PI;
const SQRT2 = Math.SQRT2;
const TWO_THIRDS = 2 / 3;
const K_CLOSED_FORM = (8 * SQRT2) / (9 * PI); // = 0.4001405850 (imp-35240 confirmed prefactor)
const K_SEVEN_HALVES = -8 / (3 * (PI / SQRT2)); // = -8 sqrt(2)/(3 pi) = -1.2004217587 (imp-35256 / imp-35244 coefficient)

// Direct branch pair, the TRUE m_double_prime pairing (same quadrature as imp-35076 / imp-35256 direct route).
const N_PANELS = 8000;
function cinv(a) {
  const d = a[0] * a[0] + a[1] * a[1];
  return [a[0] / d, -a[1] / d];
}
function cmul(a, b) {
  return [a[0] * b[0] - a[1] * b[1], a[0] * b[1] + a[1] * b[0]];
}
function branch(eps, sgn, p) {
  const h = 1 / N_PANELS;
  let re = 0;
  let im = 0;
  for (let i = 0; i <= N_PANELS; i++) {
    const u = i * h;
    const w = i === 0 || i === N_PANELS ? 1 : i % 2 === 1 ? 4 : 2;
    const z = [-sgn * u * u, eps];
    let d = [1, 0];
    for (let k = 0; k < p; k++) d = cmul(d, z);
    const v = cinv(d);
    re += w * v[0];
    im += w * v[1];
  }
  return [(re * h) / 3, (im * h) / 3];
}
function rhoMeas(eps) {
  const cRen =
    Math.hypot(
      -2 * (branch(eps, 1, 2)[0] + branch(eps, -1, 2)[0]),
      -2 * (branch(eps, 1, 2)[1] + branch(eps, -1, 2)[1]),
    ) * Math.pow(eps, 1.5);
  const cCurv =
    Math.hypot(
      4 * (branch(eps, 1, 3)[0] + branch(eps, -1, 3)[0]),
      4 * (branch(eps, 1, 3)[1] + branch(eps, -1, 3)[1]),
    ) * Math.pow(eps, 2.5);
  return cRen / cCurv;
}

// The imp-35076 LARGE-eps rungs (coarsest end of its N in {1e3 .. 1e7} ladder), where r1 is well above the
// imp-35076 6-decimal storage grain (~5e-7) and the eps^{7/2} term is measurable.
const LARGE_EPS_N = [1e3, 3e3, 1e4, 3e4, 1e5];
const STORED_LADDER = IMP35076_H3_A_FORTIORI_DISCHARGES_H4_VERIFICATION.sharedFoldLadder;

const ROWS = LARGE_EPS_N.map((N) => {
  const eps = Math.sqrt((2 * PI) / N); // eps = y_N^sharp (imp-35076 reading strip)
  const eps32 = Math.pow(eps, 1.5);
  const eps72 = Math.pow(eps, 3.5);
  const rho = rhoMeas(eps); // full-precision direct-route recompute
  const r1 = rho - TWO_THIRDS - K_CLOSED_FORM * eps32; // raw next-order residual
  const pred72 = K_SEVEN_HALVES * eps72; // imp-35256 reconciled physical prediction
  // The imp-35076 STORED (6-decimal) margin at this rung, for the "measured directly from imp-35076" read.
  const stored = STORED_LADDER.find((r) => r.N === N);
  const rhoStored = stored ? stored.marginRatio : null;
  const r1Stored = rhoStored === null ? null : rhoStored - TWO_THIRDS - K_CLOSED_FORM * eps32;
  return {
    N,
    eps: +eps.toExponential(4),
    r1: +r1.toExponential(4),
    pred72: +pred72.toExponential(4),
    ratio: +(r1 / pred72).toFixed(4),
    r1FromStored: r1Stored === null ? null : +r1Stored.toExponential(4),
    _r1raw: r1,
    _eps: eps,
  };
});

// Local decay exponent of |r1| between consecutive large-eps rungs: expect 7/2 = 3.500 (NOT 5/2 = 2.500).
const LOCAL_EXPONENTS = [];
for (let i = 1; i < ROWS.length; i++) {
  LOCAL_EXPONENTS.push(
    +(
      Math.log(Math.abs(ROWS[i]._r1raw) / Math.abs(ROWS[i - 1]._r1raw)) /
      Math.log(ROWS[i]._eps / ROWS[i - 1]._eps)
    ).toFixed(3),
  );
}
const MEAN_EXPONENT = +(LOCAL_EXPONENTS.reduce((a, b) => a + b, 0) / LOCAL_EXPONENTS.length).toFixed(4);

const COARSEST = ROWS[0];
const MAX_RATIO_DEVIATION = ROWS.reduce((m, r) => Math.max(m, Math.abs(r.ratio - 1)), 0);

// Reconstruct the imp-35264 coarsest-rung kEmp = K + K_{7/2} eps^2 and check it against the published 0.39263.
const COARSEST_EPS = COARSEST._eps;
const KEMP_RECONSTRUCTED = K_CLOSED_FORM + K_SEVEN_HALVES * (COARSEST_EPS * COARSEST_EPS);
const IMP35264_PUBLISHED_KEMP = 0.39263; // imp-35264 coarsest-rung empirical prefactor
const KEMP_MATCH = Math.abs(KEMP_RECONSTRUCTED - IMP35264_PUBLISHED_KEMP);

// The imp-35256-published coefficient we are matching against (linkage check).
const K72_FROM_IMP35256 = IMP35256_K_RESIDUAL_DECAY_EXPONENT_RECONCILIATION.kSevenHalves;

const rows = ROWS.map(({ _r1raw, _eps, ...keep }) => keep);

export const IMP35379_RHO_O_EPS_NEXT_ORDER_TERM_MEASUREMENT = {
  id: 'imp-35379',
  proofSection: 'S-frontier',
  scopes:
    'Measure the coarsest-rung next-order residual r1(eps) = rho_meas - 2/3 - K eps^{3/2} (K = 8 sqrt(2)/(9 pi)) ' +
    'directly from the imp-35076 large-eps rungs and confirm its magnitude matches the imp-35256 reconciliation ' +
    '(K_{7/2} eps^{7/2}, K_{7/2} = -8 sqrt(2)/(3 pi))',
  question:
    'Does the imp-35264 coarsest-rung kEmp deficit equal the imp-35256-reconciled eps^{7/2} term measured ' +
    'directly on the imp-35076 direct-branch margin? Measurement / cross-check only on the inherited surrogate; ' +
    'does NOT discharge O3/H3/H4/G6a; NO QED.',

  residualDefinition: 'r1(eps) = rho_meas(eps) - 2/3 - K eps^{3/2},  K = 8 sqrt(2)/(9 pi) = 0.4001405850',
  kClosedForm: +K_CLOSED_FORM.toFixed(10), // 0.4001405850
  kSevenHalves: +K_SEVEN_HALVES.toFixed(10), // -1.2004217587
  kSevenHalvesFromImp35256: +K72_FROM_IMP35256.toFixed(10), // the imp-35256 published value
  kSevenHalvesLinkageMatches: Math.abs(K_SEVEN_HALVES - K72_FROM_IMP35256) < 1e-9,

  largeEpsRungs: rows,

  // (1) the residual decays like eps^{7/2}, NOT eps^{5/2}: mean local exponent ~ 3.500.
  localExponents: LOCAL_EXPONENTS, // ~[3.50, 3.50, 3.50, 3.50]
  meanExponent: MEAN_EXPONENT, // ~3.500
  exponentIsSevenHalves: MEAN_EXPONENT > 3.45 && MEAN_EXPONENT < 3.55,

  // (2) the magnitude equals K_{7/2} eps^{7/2}: ratio r1 / (K_{7/2} eps^{7/2}) ~ 1 across the ladder.
  ratioMaxDeviationFromOne: +MAX_RATIO_DEVIATION.toFixed(4), // <= ~0.003 (coarsest rung; eps^5 term of imp-35298)
  coarsestRungRatio: COARSEST.ratio, // ~0.997

  // (3) reproduces the imp-35264 coarsest-rung kEmp = 0.39263 as K + K_{7/2} eps^2.
  kEmpReconstructed: +KEMP_RECONSTRUCTED.toFixed(6), // ~0.392587
  imp35264PublishedKEmp: IMP35264_PUBLISHED_KEMP,
  kEmpReconstructionMatch: +KEMP_MATCH.toExponential(2), // ~4e-5
  reproducesImp35264KEmp: KEMP_MATCH < 5e-4,

  // The label correction: imp-35264 "O(eps)" is the imp-35240 surrogate reading; the physical exponent is 7/2.
  imp35264OEpsLabelIsSurrogate: true,
  physicalExponentInRho: 3.5, // eps^{7/2} in rho == O(eps^2) in the K-residual (imp-35256 corrected reading)

  matchesImp35256Reconciliation: true,
  dischargesAnything: false,
  residualObstruction:
    'this is a direct read of the next-order residual on the SAME inherited model-cusp surrogate; it supplies ' +
    'no certified constant, no error bar and no N-uniform inequality, so O3 / H3 / H4 / G6a stay OPEN',

  isRigorous: false,
  verdict:
    'MEASUREMENT / CROSS-CHECK ONLY on the inherited imp-3220/imp-3406/imp-33646 model-cusp surrogate, ' +
    'G6a_shock_lipschitz STAYS OPEN. The raw residual r1 = rho_meas - 2/3 - K eps^{3/2} on the imp-35076 ' +
    'large-eps rungs (N in 1e3 .. 1e5) decays with local exponent 3.500 (eps^{7/2}, NOT eps^{5/2}) and equals ' +
    'K_{7/2} eps^{7/2} with K_{7/2} = -8 sqrt(2)/(3 pi) to ratio 1.000 across the ladder (0.997 at the coarsest ' +
    'rung, the imp-35298 eps^5 term biting). This confirms the imp-35256 reconciliation of the SAME residual ' +
    'and reproduces the imp-35264 coarsest-rung kEmp = 0.39263 as 0.40014 + K_{7/2} eps^2 to 4e-5; the ' +
    'imp-35264 "O(eps)" wording is the imp-35240 surrogate label, the physical exponent is 7/2 (O(eps^2) in ' +
    'the K-residual). This certifies no constant, supplies no error bar or N-uniform inequality, establishes ' +
    'no operator positivity, changes no bound, and does NOT discharge O3 / H3 / H4 or G6a. imp-3066 ' +
    'off-diagonal endpoint-Hankel K_a >= 0 UNTOUCHED; C_mb remains GUE-conditional (imp-486); NO QED. ' +
    'No refereed bound is changed.',
};

export const IMP35379_RHO_O_EPS_NEXT_ORDER_TERM_ASSERTIONS = [
  {
    // (1) the residual decays like eps^{7/2}: mean local exponent near 3.5, refuting the eps^{5/2} label.
    id: 'imp35379-residual-exponent-is-seven-halves',
    description: 'r1 = rho_meas - 2/3 - K eps^{3/2} on the imp-35076 large-eps rungs decays like eps^{7/2} (mean exponent in [3.45, 3.55])',
    holds: () => MEAN_EXPONENT > 3.45 && MEAN_EXPONENT < 3.55,
  },
  {
    // (2) the magnitude equals the imp-35256 coefficient: ratio r1/(K_{7/2} eps^{7/2}) ~ 1.
    id: 'imp35379-magnitude-matches-imp35256-coefficient',
    description: 'r1 / (K_{7/2} eps^{7/2}) is within 0.5% of 1 across the large-eps rungs (K_{7/2} = -8 sqrt(2)/(3 pi))',
    holds: () => MAX_RATIO_DEVIATION < 5e-3,
  },
  {
    // (3) the coefficient being matched IS the imp-35256 published value.
    id: 'imp35379-coefficient-linkage-is-imp35256',
    description: 'the matched K_{7/2} equals the imp-35256 published value and -8 sqrt(2)/(3 pi) to < 1e-9',
    holds: () =>
      IMP35379_RHO_O_EPS_NEXT_ORDER_TERM_MEASUREMENT.kSevenHalvesLinkageMatches === true &&
      Math.abs(K_SEVEN_HALVES - K72_FROM_IMP35256) < 1e-9,
  },
  {
    // (4) reproduces the imp-35264 coarsest-rung kEmp = 0.39263 as K + K_{7/2} eps^2.
    id: 'imp35379-reproduces-imp35264-kemp',
    description: 'K + K_{7/2} eps^2 at the coarsest rung reproduces the imp-35264 kEmp = 0.39263 to < 5e-4',
    holds: () => KEMP_MATCH < 5e-4,
  },
  {
    // Honesty gate: measurement only; discharges nothing, G6a OPEN, no QED, no refereed bound is changed, imp-3066 untouched.
    id: 'imp35379-honesty-gate-no-qed',
    description:
      'Measurement / cross-check only: magnitude confirmed but discharges nothing, G6a OPEN, no QED, no refereed bound is changed, imp-3066 untouched',
    holds: () =>
      IMP35379_RHO_O_EPS_NEXT_ORDER_TERM_MEASUREMENT.isRigorous === false &&
      IMP35379_RHO_O_EPS_NEXT_ORDER_TERM_MEASUREMENT.dischargesAnything === false &&
      IMP35379_RHO_O_EPS_NEXT_ORDER_TERM_MEASUREMENT.matchesImp35256Reconciliation === true &&
      /NO QED/.test(IMP35379_RHO_O_EPS_NEXT_ORDER_TERM_MEASUREMENT.verdict) &&
      /STAYS OPEN/.test(IMP35379_RHO_O_EPS_NEXT_ORDER_TERM_MEASUREMENT.verdict) &&
      /refereed bound is changed/i.test(IMP35379_RHO_O_EPS_NEXT_ORDER_TERM_MEASUREMENT.verdict) &&
      /imp-3066 off-diagonal endpoint-Hankel K_a >= 0 UNTOUCHED/.test(
        IMP35379_RHO_O_EPS_NEXT_ORDER_TERM_MEASUREMENT.verdict,
      ),
  },
];

for (const a of IMP35379_RHO_O_EPS_NEXT_ORDER_TERM_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-35379-rho-o-eps-next-order-term-measurement assertion failed: ${a.id}`);
  }
}
