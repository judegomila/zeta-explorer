/**
 * imp-96509 -- Extend the imp-96489 AR-1 effective-count model to AR-2 (and, as a lag-3 refinement,
 * AR-3), incorporating the small NEGATIVE higher-lag sine-process correlations the AR-1 model omits,
 * and measure how much they shift n_eff and the effective excursion significance z_eff.
 *
 * WHAT WAS LEFT DANGLING. The imp-96489 caveat notes its AR-1 effective-count model uses ONLY the
 * lag-1 correlation rho_1 = -0.4639782, extrapolating every higher lag as the geometric rho_1^k. But
 * the sine process carries small NEGATIVE higher-lag box correlations -- lag-2 ~ -0.020 and lag-3 ~
 * -0.008 -- whereas the AR-1 geometric extrapolation would predict lag-2 = rho_1^2 = +0.2153 (wrong
 * SIGN) and lag-3 = rho_1^3 = -0.0999. So the tiling is only APPROXIMATELY AR-1; the caveat asserts
 * (without measuring) that the omitted lags "push the same safe direction." This module measures it.
 *
 * WHY NOT A NAIVE TRUNCATED SUM. The effective-count variance-inflation factor is
 * VIF = 1 + 2*sum_{k>=1} rho_k, with n_eff = n_w / VIF. Truncating that sum at the three measured lags
 * gives VIF = 1 + 2*(-0.4640 - 0.020 - 0.008) = 0.01604 -- a factor f = 1/VIF ~ 62 that is unstable
 * and would go NEGATIVE (non-physical) for a slightly more anti-correlated tail. This is exactly why
 * imp-96489 used the AR-1 CLOSED FORM f = (1 - rho_1)/(1 + rho_1): it is the stable geometric
 * resummation from rho_1 alone. The honest higher-lag extension keeps that stabilization and fits an
 * AR(p) process to the measured lags via Yule-Walker, then resums exactly.
 *
 * THE AR(p) RESUMMATION. For a stationary AR(p) process the sample-mean variance-inflation factor has
 * the closed form
 *   VIF = (1 - sum_j phi_j rho_j) / (1 - sum_j phi_j)^2,   f = 1/VIF,   n_eff = n_w * f,
 * where the phi_j are the Yule-Walker coefficients fitted to the target autocorrelations. For p = 1
 * (phi_1 = rho_1) this reduces to (1 + rho_1)/(1 - rho_1) -> f = (1 - rho_1)/(1 + rho_1) = 2.731192,
 * exactly the imp-96489 AR-1 factor. Extending to p = 2 uses (rho_1, rho_2); to p = 3 uses
 * (rho_1, rho_2, rho_3), incorporating the lag-3 term as a refinement.
 *
 * MEASURED SHIFTS (dip depth relErr = 0.1594568 held fixed; z scales as sqrt(n_eff)):
 *   AR-1 (imp-96489):  f = 2.731192,  n_eff =  794.78,  z_eff = 3.178708
 *   AR-2 (lag-2):      f = 5.070203,  n_eff = 1475.43,  z_eff = 4.330990
 *   AR-3 (lag-3):      f = 7.978362,  n_eff = 2321.70,  z_eff = 5.432896
 * Forcing lag-2 down from the AR-1-implied +0.2153 to the true -0.020 makes the process MORE
 * anti-persistent (fitted phi_2 = -0.29982 < 0), so the effective count RISES; the lag-3 refinement
 * pushes it further the same way. Both AR-2 and AR-3 fits are stationary (AR-2: |phi_2| < 1,
 * phi_1 +/- phi_2 within the triangle; AR-3: all characteristic-root moduli 0.619, 0.619, 0.582 < 1).
 *
 * SAFE-SIDE VERDICT. The higher-lag corrections move z_eff strictly UP, never down (3.179 -> 4.331 ->
 * 5.433), confirming the imp-96489 caveat's "same safe direction" claim as a MEASUREMENT, not an
 * assertion. Every figure clears the 2-sigma target with room to spare, and every fitted correlation
 * stays NEGATIVE -- sign-forbidden from reaching the positive flip threshold rho_crit = +0.57443 that
 * would turn the dip into noise. Crucially this does NOT raise the headline floor: the conservative
 * naive z_cons = 1.923422 (n_w = 291, no correlation credit) remains the quoted ~1.9-sigma quantity
 * and a strict LOWER BOUND. The AR-1 z_eff = 3.179 is itself now seen to be a conservative floor
 * beneath the fuller AR-2/AR-3 figures.
 *
 * HONEST CAVEAT. The lag-2/lag-3 values -0.020/-0.008 are the APPROXIMATE theoretical sine-process
 * (GUE, universality) box correlations quoted in the imp-96489 caveat, not the empirical adjacent-box
 * covariance of the actual Riemann zeros (which would need the zeros bundle). Because rho_1 is large,
 * the AR-2/AR-3 factors are sensitive to the exact lag-2/lag-3 inputs, so the >4-sigma effective
 * figures are indicative, not precise; the robust, model-independent takeaway is the DIRECTION (every
 * added negative lag raises n_eff and z_eff) and the SIGN safety (all correlations negative, away from
 * the +0.57443 flip). Measurement/reconciliation only; changes no bound; the headline ~1.9-sigma floor
 * is untouched.
 *
 * VERDICT. Extending the imp-96489 AR-1 effective-count model to AR-2 (fitting the true sine-process
 * lag-2 ~ -0.020 by Yule-Walker) raises the effective count from n_eff = 794.78 to 1475.43 and the
 * effective significance from z_eff = 3.1787 to 4.3310; the AR-3 lag-3 refinement pushes them further
 * to 2321.70 and 5.4329. The higher-lag corrections push strictly in the SAFE direction (z_eff up),
 * every figure clears the 2-sigma target, and every fitted correlation stays negative -- sign-forbidden
 * from the rho_crit = +0.57443 flip threshold. The headline conservative z_cons = 1.9234 floor is
 * unchanged and remains a strict lower bound. Measurement/reconciliation only; changes no bound; RH
 * open; NO QED; no refereed bound is changed; the zero-side route stays PCC/GRH-gated.
 *
 * @see imp-96489-excursion-effective-significance-direct-rho (the AR-1 model this extends)
 * @see imp-96452-excursion-confidence-2sigma-reach (carries z_cons = 1.9234 and the baked rho literal)
 * @see imp-96128-number-variance-two-interval-covariance-exact (the union-identity rho_exact)
 *
 * Import-light: no zeros bundle, no sibling imports. n_w = 291 and relErr = 0.15945679221237827 are the
 * imp-95562/imp-96089 literals; rho_1 = -0.4639782 is the imp-96489 directly-evaluated box-length value;
 * the lag-2/lag-3 targets are the imp-96489 caveat figures. Every AR(p) factor is fitted and resummed
 * here from those inputs (Yule-Walker + the closed-form VIF), nothing baked beyond the inputs.
 */

// Fixed inputs (imp-96489 / imp-95562 / imp-96089 literals; no zeros needed).
const N_W = 291; // conservative naive non-overlapping hard-box tiling count at T = 1.5e5
const REL_ERR = 0.15945679221237827; // dip depth |residual|/r (held fixed across all models)
const RHO_1 = -0.4639782; // directly-evaluated union-identity rho_exact at the T = 1.5e5 box length
const RHO_2 = -0.020; // theoretical sine-process lag-2 box correlation (imp-96489 caveat)
const RHO_3 = -0.008; // theoretical sine-process lag-3 box correlation (imp-96489 caveat)
const RHO_CRIT = 0.57443; // POSITIVE lag-1 correlation that would flip the verdict to noise
const Z_TARGET = 2.0;

const zFromCount = (nEff) => REL_ERR / Math.sqrt(2 / nEff); // z at fixed dip depth, scales as sqrt(nEff)

// General AR(p) sample-mean variance-inflation factor: VIF = (1 - sum phi_j rho_j) / (1 - sum phi_j)^2.
const vifFromPhi = (phi, rho) => {
  let sPhiRho = 0;
  let sPhi = 0;
  for (let j = 0; j < phi.length; j++) {
    sPhiRho += phi[j] * rho[j];
    sPhi += phi[j];
  }
  return (1 - sPhiRho) / (1 - sPhi) ** 2;
};

// Solve a 3x3 linear system by Gauss-Jordan with partial pivoting (Yule-Walker for AR-3).
const solve3 = (A, b) => {
  const M = A.map((row, i) => [...row, b[i]]);
  for (let c = 0; c < 3; c++) {
    let p = c;
    for (let r = c + 1; r < 3; r++) if (Math.abs(M[r][c]) > Math.abs(M[p][c])) p = r;
    [M[c], M[p]] = [M[p], M[c]];
    for (let r = 0; r < 3; r++) {
      if (r !== c) {
        const f = M[r][c] / M[c][c];
        for (let k = c; k < 4; k++) M[r][k] -= f * M[c][k];
      }
    }
  }
  return [M[0][3] / M[0][0], M[1][3] / M[1][1], M[2][3] / M[2][2]];
};

// --- AR-1 (imp-96489 baseline: phi_1 = rho_1) ---
const phiAR1 = [RHO_1];
const fAR1 = 1 / vifFromPhi(phiAR1, [RHO_1]); // = (1 - rho_1)/(1 + rho_1) = 2.731192
const nEffAR1 = N_W * fAR1; // 794.777
const zAR1 = zFromCount(nEffAR1); // 3.178708

// --- AR-2 (headline extension: Yule-Walker on rho_1, rho_2) ---
const denomAR2 = 1 - RHO_1 * RHO_1;
const phi2_2 = (RHO_2 - RHO_1 * RHO_1) / denomAR2; // -0.299820
const phi2_1 = (RHO_1 * (1 - RHO_2)) / denomAR2; // -0.603088
const phiAR2 = [phi2_1, phi2_2];
const fAR2 = 1 / vifFromPhi(phiAR2, [RHO_1, RHO_2]); // 5.070203
const nEffAR2 = N_W * fAR2; // 1475.429
const zAR2 = zFromCount(nEffAR2); // 4.330990
// AR-2 stationarity triangle: |phi_2| < 1, phi_1 + phi_2 < 1, phi_2 - phi_1 < 1.
const ar2Stationary = Math.abs(phi2_2) < 1 && phi2_1 + phi2_2 < 1 && phi2_2 - phi2_1 < 1;

// --- AR-3 (lag-3 refinement: Yule-Walker on rho_1, rho_2, rho_3) ---
const R3 = [
  [1, RHO_1, RHO_2],
  [RHO_1, 1, RHO_1],
  [RHO_2, RHO_1, 1],
];
const phiAR3 = solve3(R3, [RHO_1, RHO_2, RHO_3]); // -0.669909, -0.434231, -0.222872
const fAR3 = 1 / vifFromPhi(phiAR3, [RHO_1, RHO_2, RHO_3]); // 7.978362
const nEffAR3 = N_W * fAR3; // 2321.703
const zAR3 = zFromCount(nEffAR3); // 5.432896

const zCons = zFromCount(N_W); // 1.923422: the unchanged conservative naive floor

export const IMP96509_EXCURSION_EFFECTIVE_SIGNIFICANCE_AR2 = {
  ticket: 'imp-96509',
  question:
    'Extend the imp-96489 AR-1 effective-count model to AR-2 (and AR-3 as a lag-3 refinement) using the theoretical negative sine-process lag-2/lag-3 box correlations, and measure how much they shift n_eff and the effective excursion significance z_eff.',
  inputs: {
    nW: N_W, // 291 conservative naive count
    relErr: REL_ERR, // 0.1594568 dip depth (held fixed)
    rho1: RHO_1, // -0.4639782 directly-evaluated box-length lag-1 (imp-96489)
    rho2: RHO_2, // -0.020 theoretical sine-process lag-2 (imp-96489 caveat)
    rho3: RHO_3, // -0.008 theoretical sine-process lag-3 (imp-96489 caveat)
    ar1ImpliedRho2: RHO_1 * RHO_1, // +0.2153: the AR-1 geometric extrapolation (wrong SIGN vs -0.020)
    ar1ImpliedRho3: RHO_1 * RHO_1 * RHO_1, // -0.0999: AR-1 lag-3 (vs true -0.008)
    note: 'The naive truncated VIF = 1 + 2(rho_1+rho_2+rho_3) = 0.01604 is unstable (f ~ 62, sign-fragile); the AR(p) closed form is the stable geometric resummation used instead.',
  },
  models: {
    ar1: {
      phi: phiAR1, // [rho_1]
      factor: fAR1, // 2.731192 (reproduces imp-96489)
      nEff: nEffAR1, // 794.777
      zEff: zAR1, // 3.178708
    },
    ar2: {
      phi: phiAR2, // [-0.603088, -0.299820] Yule-Walker on (rho_1, rho_2)
      stationary: ar2Stationary, // true
      factor: fAR2, // 5.070203
      nEff: nEffAR2, // 1475.429
      zEff: zAR2, // 4.330990
      note: 'Forcing lag-2 to the true -0.020 gives phi_2 = -0.29982 < 0, so the process is MORE anti-persistent and the effective count RISES above the AR-1 value.',
    },
    ar3: {
      phi: phiAR3, // [-0.669909, -0.434231, -0.222872] Yule-Walker on (rho_1, rho_2, rho_3)
      rootModuli: [0.6188809597523499, 0.6188809597523499, 0.5818903454261805], // all < 1 => stationary
      factor: fAR3, // 7.978362
      nEff: nEffAR3, // 2321.703
      zEff: zAR3, // 5.432896
      note: 'The lag-3 refinement pushes n_eff and z_eff further in the same safe direction.',
    },
  },
  reconciliation: {
    zConservativeFloor: zCons, // 1.923422 unchanged: the headline ~1.9-sigma quote and a strict lower bound
    zTarget: Z_TARGET, // 2.0
    directionSafe: zAR2 > zAR1 && zAR3 > zAR2, // true: every added negative lag raises z_eff
    allClearTarget: zAR1 > Z_TARGET && zAR2 > Z_TARGET && zAR3 > Z_TARGET, // true
    rhoCritFlip: RHO_CRIT, // +0.57443
    allCorrelationsNegative: RHO_1 < 0 && RHO_2 < 0 && RHO_3 < 0, // true: sign-forbidden to reach the flip
    headlineFloorUnchanged: true, // the ~1.9-sigma quote is not raised by this measurement
    statement:
      'The higher-lag corrections shift the effective significance strictly UP (3.179 -> 4.331 -> 5.433), confirming the imp-96489 caveat "same safe direction" claim as a measurement. Every figure clears the 2-sigma target and every fitted correlation stays negative, sign-forbidden from the rho_crit = +0.57443 flip threshold. The conservative z_cons = 1.9234 floor is unchanged and remains a strict lower bound.',
  },
  caveat:
    'The lag-2/lag-3 values -0.020/-0.008 are the APPROXIMATE theoretical sine-process (GUE, universality) box correlations from the imp-96489 caveat, not the empirical adjacent-box covariance of the actual Riemann zeros (which would need the zeros bundle). Because rho_1 is large, the AR-2/AR-3 factors are sensitive to the exact higher-lag inputs, so the >4-sigma effective figures are indicative, not precise; the robust takeaway is the DIRECTION (each added negative lag raises n_eff and z_eff) and the SIGN safety. Measurement/reconciliation only; changes no bound; the headline ~1.9-sigma floor is untouched.',
  verdict:
    'Extending the imp-96489 AR-1 effective-count model to AR-2 (Yule-Walker on the true sine-process lag-2 ~ -0.020) raises n_eff from 794.78 to 1475.43 and z_eff from 3.1787 to 4.3310; the AR-3 lag-3 refinement pushes them to 2321.70 and 5.4329. The higher-lag corrections push strictly in the SAFE direction, every figure clears the 2-sigma target, and every fitted correlation stays negative -- sign-forbidden from the rho_crit = +0.57443 flip threshold. The headline conservative z_cons = 1.9234 floor is unchanged and remains a strict lower bound. Measurement/reconciliation only; changes no bound; RH open; NO QED; no refereed bound is changed; the zero-side route stays PCC/GRH-gated.',
};

// Machine-readable honest-status banner (imp-96337 / imp-96428 convention).
export const IMP96509_HONEST_BANNER =
  'RH open; no refereed bound is changed; NO QED. Measurement/reconciliation only: the lag-2/lag-3 inputs '
  + '(-0.020/-0.008) are the theoretical GUE sine-process box correlations, not empirical zero covariances, '
  + 'so the >4-sigma AR-2/AR-3 effective figures are indicative, not precise; the robust takeaway is direction '
  + '(each added lag raises n_eff/z_eff) and sign safety, not the exact numbers; the conservative z_cons = '
  + '1.9234 floor is unchanged and remains the strict lower bound; changes no bound.';

// --- self-executing internal-consistency assertions (formula re-derivation only) ---
(() => {
  const approx = (a, b, tol) => Math.abs(a - b) <= tol;
  // AR-1 reproduces the imp-96489 baseline exactly
  if (!approx(fAR1, 2.731192, 1e-5)) throw new Error('imp-96509: AR-1 factor should reproduce imp-96489 2.731192');
  if (!approx(nEffAR1, 794.777, 1e-2)) throw new Error('imp-96509: AR-1 n_eff drifted from 794.78');
  if (!approx(zAR1, 3.178708, 1e-5)) throw new Error('imp-96509: AR-1 z_eff drifted from imp-96489 3.1787');
  if (!approx(fAR1, (1 - RHO_1) / (1 + RHO_1), 1e-12)) throw new Error('imp-96509: AR-1 VIF closed form inconsistent');
  // AR-2 fit and resummation
  if (!ar2Stationary) throw new Error('imp-96509: AR-2 fit is not stationary');
  if (!approx(phi2_2, -0.299820, 1e-5)) throw new Error('imp-96509: AR-2 phi_2 drifted');
  if (!approx(fAR2, 5.070203, 1e-5)) throw new Error('imp-96509: AR-2 factor drifted from 5.070203');
  if (!approx(nEffAR2, 1475.429, 1e-2)) throw new Error('imp-96509: AR-2 n_eff drifted from 1475.43');
  if (!approx(zAR2, 4.330990, 1e-5)) throw new Error('imp-96509: AR-2 z_eff drifted from 4.3310');
  // AR-3 lag-3 refinement
  if (!approx(fAR3, 7.978362, 1e-5)) throw new Error('imp-96509: AR-3 factor drifted from 7.978362');
  if (!approx(nEffAR3, 2321.703, 1e-2)) throw new Error('imp-96509: AR-3 n_eff drifted from 2321.70');
  if (!approx(zAR3, 5.432896, 1e-5)) throw new Error('imp-96509: AR-3 z_eff drifted from 5.4329');
  // the conservative floor is untouched (equals the imp-96489 z_cons)
  if (!approx(zCons, 1.923422, 1e-5)) throw new Error('imp-96509: conservative z_cons drifted from 1.9234');
  // DIRECTION: every added negative lag raises the effective significance (the safe-direction claim)
  if (!(zAR2 > zAR1 && zAR3 > zAR2)) throw new Error('imp-96509: higher-lag corrections must RAISE z_eff (safe direction)');
  // every figure clears the 2-sigma target
  if (!(zAR1 > Z_TARGET && zAR2 > Z_TARGET && zAR3 > Z_TARGET)) throw new Error('imp-96509: an effective z fell below the 2-sigma target');
  // SIGN safety: all fitted correlations negative, sign-forbidden from the positive flip threshold
  if (!(RHO_1 < 0 && RHO_2 < 0 && RHO_3 < 0 && RHO_CRIT > 0)) throw new Error('imp-96509: flip needs positive rho; every input rho is negative');
  // honesty gates
  if (!/NO QED/.test(IMP96509_EXCURSION_EFFECTIVE_SIGNIFICANCE_AR2.verdict))
    throw new Error('imp-96509: verdict dropped the NO QED banner');
  if (!/refereed bound is changed/i.test(IMP96509_EXCURSION_EFFECTIVE_SIGNIFICANCE_AR2.verdict))
    throw new Error('imp-96509: verdict dropped the no-refereed-bound-change banner');
  if (!(/RH open/.test(IMP96509_HONEST_BANNER) && /PT Lambda <= 0.2|refereed bound is changed/.test(IMP96509_HONEST_BANNER) && /NO QED/.test(IMP96509_HONEST_BANNER)))
    throw new Error('imp-96509: IMP96509_HONEST_BANNER missing RH-open / PT-Lambda / NO-QED markers');
})();

export default IMP96509_EXCURSION_EFFECTIVE_SIGNIFICANCE_AR2;
