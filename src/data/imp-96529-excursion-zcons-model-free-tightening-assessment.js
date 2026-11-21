/**
 * imp-96529 -- Assess whether the imp-96509 measured strictly-NEGATIVE lag-1..3 autocorrelations
 * (which reduce effective variance) can RIGOROUSLY tighten the conservative excursion floor
 * z_cons = 1.9234 above the naive independent-window value, or whether any such tightening requires
 * a model assumption that keeps z_cons at the independent floor.
 *
 * THE QUANTITY. The excursion significance is z = relErr / sqrt(2 / n_eff) = relErr * sqrt(n_eff/2),
 * so z scales as sqrt(n_eff) with n_eff = n_w / VIF, where the variance-inflation factor is the exact
 * normalized variance of the window sum,
 *   VIF = Var(S_{n_w}) / (n_w * sigma^2) = 1 + 2 * sum_{k=1}^{n_w-1} (1 - k/n_w) * rho_k,   S = sum of windows.
 * The naive floor z_cons = 1.9234 is exactly the VIF = 1 (independence) value: no correlation credit.
 * Tightening z_cons UPWARD is therefore EQUIVALENT to a rigorous UPPER bound VIF < 1; loosening it
 * DOWNWARD corresponds to VIF > 1. VIF depends on ALL lags k >= 1, while imp-96509 measures only three.
 *
 * THE CRITERION. A model-free upward tightening exists iff every valid (positive-semidefinite)
 * autocorrelation sequence consistent with the four measured moments (rho_0 = 1, rho_1 = -0.4639782,
 * rho_2 = -0.020, rho_3 = -0.008) has VIF < 1. Positive-semidefiniteness is the ONLY model-free
 * constraint: a sequence {rho_k} is admissible iff it is the cosine-moment sequence of a nonnegative
 * spectral measure. The three measured lags fix only the first three cosine moments; the tail k >= 4 is
 * free apart from PSD.
 *
 * DECISIVE OBSTRUCTION (explicit, model-free). A nonnegative spectral measure automatically yields a
 * PSD (admissible) sequence via rho_k = sum_j p_j cos(k*theta_j), p_j >= 0. Place a SMALL atom at the
 * zero frequency theta = 0 (weight p0 = 0.05) plus four atoms at nonzero angles whose weights solve the
 * four residual moments exactly. This measure matches rho_0..rho_3 to 1e-9 yet -- because the atom at
 * theta = 0 contributes a NON-decaying positive long-range correlation rho_k -> 0.05 -- gives finite-
 * window VIF_{291} = 14.5517, i.e. n_eff = 20.0 << n_w = 291 and z = 0.5042, FAR BELOW the naive floor.
 * At the opposite extreme the imp-96509 AR-3 maximum-entropy completion gives VIF = 1/7.978362 = 0.1253
 * (z = 5.4329). So the model-free admissible VIF interval given the three measured lags STRADDLES 1
 * (it spans at least [0.1253, 14.5517]); it does NOT lie entirely below 1.
 *
 * VERDICT ON THE ASSESSMENT QUESTION. The measured strictly-negative lag-1..3 autocorrelations do NOT
 * rigorously tighten z_cons: because three cosine moments cannot certify the sign or size of the tail
 * (k >= 4), an admissible completion with VIF > 1 exists (constructed above), so no PSD-only argument
 * forces VIF < 1. Sharper still, z_cons = 1.9234 is NOT even a model-free strict lower bound -- it is
 * the independence value, and the admissible set brackets it on BOTH sides. The imp-96509 statement
 * that z_cons is a "strict lower bound" is valid ONLY under a model that controls the whole lag
 * structure: e.g. the GUE sine-kernel theorem that ALL box correlations are negative and decay like
 * O(1/k^2) (no spectral mass at frequency 0), which forces VIF < 1. That decay/sign statement is a
 * MODEL for the zeros (the sine-kernel universality picture), not a consequence of the three numbers.
 *
 * THE GAP (guaranteed floor vs best model-free improvement). Best RIGOROUS, model-free improvement over
 * the independent floor: ZERO. The three measured lags supply no PSD-only certificate of VIF < 1, so no
 * portion of the imp-96509 correlation credit is rigorous. The entire climb z_cons = 1.9234 -> z_eff =
 * 3.1787 (AR-1) -> 4.3310 (AR-2) -> 5.4329 (AR-3) is MODEL-CONTINGENT (AR(p) closed-form resummation, or
 * equivalently the sine-kernel decay assumption). The gap between the guaranteed floor (1.9234) and the
 * most conservative model figure (AR-1, 3.1787, which uses only the ONE exactly-known lag rho_1) is
 * ~1.26 sigma, and every bit of it rests on the unmeasured tail behaving as the model dictates.
 *
 * HONEST CAVEAT. rho_1 = -0.4639782 is the imp-96489 directly-evaluated exact union-identity value;
 * rho_2 = -0.020, rho_3 = -0.008 are the theoretical GUE sine-process box correlations, not empirical
 * adjacent-box covariances of the actual zeros. The worst-case measure above is a valid PSD sequence
 * matching those four moments; it is not claimed to be the true zero correlation, only to be admissible,
 * which is exactly what defeats a model-free VIF < 1 claim. Assessment only; changes no bound.
 *
 * VERDICT. The measured negative lag-1..3 autocorrelations CANNOT rigorously tighten z_cons = 1.9234
 * above the naive independent-window floor: an explicit PSD-admissible completion matching all four
 * measured moments exactly has VIF_{291} = 14.55 > 1 (z = 0.50 < 1.9234), so no positive-semidefinite
 * argument forces the effective variance down; the admissible VIF interval straddles 1. The imp-96509
 * "strict lower bound" and the z_eff climb to 3.18/4.33/5.43 are model-contingent (AR(p) / sine-kernel
 * decay), and the best guaranteed model-free improvement over the independent floor is ZERO. Assessment
 * only; changes no bound; RH open; NO QED; no refereed bound is changed; the zero-side
 * route stays PCC/GRH-gated.
 *
 * @see imp-96509-excursion-effective-significance-ar2 (the AR-2/AR-3 model this assesses)
 * @see imp-96489-excursion-effective-significance-direct-rho (the AR-1 effective-count model)
 * @see imp-96452-excursion-confidence-2sigma-reach (carries z_cons = 1.9234)
 *
 * Import-light: no zeros bundle, no sibling imports. n_w = 291 and relErr are the imp-95562/imp-96089
 * literals; rho_1 = -0.4639782 is the imp-96489 exact box-length value; rho_2/rho_3 are the imp-96509
 * caveat figures. The worst-case measure (one atom at theta = 0 plus four nonzero-angle atoms) is baked
 * as verified inputs and re-checked here: it matches all four moments to 1e-9 and yields VIF > 1.
 */

// Fixed inputs (imp-96509 / imp-95562 / imp-96089 literals; no zeros needed).
const N_W = 291; // conservative naive non-overlapping hard-box tiling count at T = 1.5e5
const REL_ERR = 0.15945679221237827; // dip depth |residual|/r (held fixed across all models)
const RHO_1 = -0.4639782; // directly-evaluated union-identity rho_exact at the T = 1.5e5 box length
const RHO_2 = -0.020; // theoretical sine-process lag-2 box correlation (imp-96509 caveat)
const RHO_3 = -0.008; // theoretical sine-process lag-3 box correlation (imp-96509 caveat)
const MOMENTS = [1, RHO_1, RHO_2, RHO_3]; // rho_0..rho_3

const zFromCount = (nEff) => REL_ERR / Math.sqrt(2 / nEff); // z at fixed dip depth, scales as sqrt(nEff)
const zCons = zFromCount(N_W); // 1.923422: the naive VIF = 1 (independence) value

// --- Worst-case ADMISSIBLE (PSD) completion: nonnegative spectral measure -----------------------
// mu = sum_j P[j] * delta(THETA[j]), P[j] >= 0  =>  rho_k = sum_j P[j] cos(k*THETA[j]) is PSD by
// construction. An atom at theta = 0 injects a non-decaying positive long-range correlation rho_k -> P0.
// The five atoms below match rho_0..rho_3 exactly (verified in the assertions).
const THETA = [0, 1.0, 1.7, 2.4, 3.0]; // atom angles (radians); THETA[0] = 0 is the long-range atom
const P = [
  0.05,
  0.012617954496988437,
  0.4217212148342176,
  0.17435198902042254,
  0.3413088416483715,
]; // nonnegative weights solving the four residual moments

// rho_k of the measure, and the finite-window VIF_{n_w} = (1/n) * Var(S_n)/sigma^2 via the Fejer form
// VIF = (1/n) * sum_j P[j] * |sum_{m=1..n} exp(i*m*theta_j)|^2.
const rhoOfMeasure = (k) => P.reduce((s, p, j) => s + p * Math.cos(k * THETA[j]), 0);
const vifOfMeasure = (n) => {
  let v = 0;
  for (let j = 0; j < THETA.length; j++) {
    let re = 0;
    let im = 0;
    for (let m = 1; m <= n; m++) {
      re += Math.cos(THETA[j] * m);
      im += Math.sin(THETA[j] * m);
    }
    v += P[j] * (re * re + im * im);
  }
  return v / n;
};

const VIF_WORST = vifOfMeasure(N_W); // 14.5517: admissible completion with VIF >> 1
const N_EFF_WORST = N_W / VIF_WORST; // 20.0
const Z_WORST = zFromCount(N_EFF_WORST); // 0.5042: significance BELOW the naive floor

// --- Opposite extreme: the imp-96509 AR-3 maximum-entropy completion (all lags negative, decaying) ---
const VIF_AR3 = 1 / 7.978362; // 0.12534: the max-entropy completion the model uses
const Z_AR3 = zFromCount(N_W / VIF_AR3); // 5.4329
// imp-96509 model figures (all model-contingent), for the gap statement.
const Z_AR1 = zFromCount(N_W * 2.731192); // 3.178708 (uses only the exactly-known rho_1)
const Z_AR2 = zFromCount(N_W * 5.070203); // 4.330990

export const IMP96529_EXCURSION_ZCONS_MODEL_FREE_TIGHTENING = {
  ticket: 'imp-96529',
  question:
    'Can the imp-96509 measured strictly-negative lag-1..3 autocorrelations rigorously tighten the conservative excursion floor z_cons = 1.9234 above the naive independent-window value, or does any such tightening require a model assumption that keeps z_cons at the independent floor? Derive the gap between the guaranteed floor and the best model-free improvement.',
  criterion: {
    identity: 'z = relErr * sqrt(n_eff/2), n_eff = n_w / VIF, VIF = 1 + 2*sum_{k>=1}(1-k/n_w) rho_k',
    upwardTighteningIff: 'a rigorous UPPER bound VIF < 1 (n_eff > n_w) over the WHOLE lag structure',
    naiveFloorIsVifOne: true, // z_cons is exactly the VIF = 1 (independence) value
    modelFreeConstraint: 'positive-semidefiniteness only: {rho_k} must be cosine moments of a nonneg spectral measure',
    measuredMoments: MOMENTS, // rho_0..rho_3; the tail k >= 4 is free apart from PSD
  },
  worstCaseCompletion: {
    description:
      'Nonnegative spectral measure (one atom at frequency theta=0 plus four nonzero-angle atoms) matching rho_0..rho_3 exactly to 1e-9; the theta=0 atom injects a non-decaying positive long-range correlation.',
    atomAngles: THETA,
    atomWeights: P,
    matchedMoments: [rhoOfMeasure(0), rhoOfMeasure(1), rhoOfMeasure(2), rhoOfMeasure(3)],
    vif: VIF_WORST, // 14.5517 > 1
    nEff: N_EFF_WORST, // 20.0 << n_w = 291
    z: Z_WORST, // 0.5042 < z_cons = 1.9234
  },
  admissibleVifInterval: {
    lowExtreme: VIF_AR3, // 0.1253 (AR-3 max-entropy completion; z = 5.4329)
    highExtreme: VIF_WORST, // 14.5517 (worst-case admissible completion; z = 0.5042)
    straddlesOne: VIF_AR3 < 1 && VIF_WORST > 1, // true: the model-free set brackets VIF = 1 on both sides
    note: 'Three measured cosine moments cannot certify the sign or size of the tail k >= 4, so the PSD-admissible VIF interval contains values both below and above 1; no PSD-only argument forces VIF < 1.',
  },
  gap: {
    zConservativeFloor: zCons, // 1.923422 (VIF = 1)
    bestModelFreeRigorousImprovement: 0, // ZERO: no PSD-only certificate of VIF < 1 from three lags
    modelContingentClimb: { ar1: Z_AR1, ar2: Z_AR2, ar3: Z_AR3 }, // 3.1787 / 4.3310 / 5.4329
    ar1MinusFloor: Z_AR1 - zCons, // ~1.255 sigma, entirely model-contingent (rests on the unmeasured tail)
    statement:
      'The guaranteed model-free floor stays at z_cons = 1.9234 (the independence value); the best rigorous model-free improvement over it is ZERO. The whole climb to z_eff = 3.18/4.33/5.43 is model-contingent (AR(p) resummation, equivalently the GUE sine-kernel theorem that all box correlations are negative and decay like O(1/k^2), i.e. no spectral mass at frequency 0), which the three measurements cannot certify.',
  },
  verdict:
    'The measured strictly-negative lag-1..3 autocorrelations CANNOT rigorously tighten z_cons = 1.9234 above the naive independent-window floor: an explicit positive-semidefinite completion matching all four measured moments exactly has finite-window VIF_291 = 14.55 > 1 (n_eff = 20.0, z = 0.50 < 1.9234), so no PSD-only argument forces the effective variance down, and the admissible VIF interval straddles 1. Consequently z_cons is not even a model-free strict lower bound; it is the independence value, and the imp-96509 "strict lower bound" plus the z_eff climb to 3.18/4.33/5.43 are model-contingent (AR(p) / sine-kernel decay). The best guaranteed model-free improvement over the independent floor is ZERO. Assessment only; changes no bound; RH open; NO QED; no refereed bound is changed; the zero-side route stays PCC/GRH-gated.',
};

// Machine-readable honest-status banner (imp-96337 / imp-96428 convention).
export const IMP96529_HONEST_BANNER =
  'RH open; no refereed bound is changed; NO QED. Assessment only: three measured cosine moments cannot '
  + 'certify the tail (k >= 4), so a PSD-admissible completion with VIF_291 = 14.55 > 1 (z = 0.50 < 1.9234) '
  + 'exists and the admissible VIF interval straddles 1; the naive z_cons = 1.9234 stays the guaranteed floor '
  + '(best rigorous model-free improvement over independence = ZERO), and the imp-96509 climb to 3.18/4.33/5.43 '
  + 'is model-contingent (AR(p) / GUE sine-kernel decay); changes no bound.';

// --- self-executing internal-consistency assertions (formula/PSD re-derivation only) ---
(() => {
  const approx = (a, b, tol) => Math.abs(a - b) <= tol;
  // the naive floor is the VIF = 1 value
  if (!approx(zCons, 1.923422, 1e-5)) throw new Error('imp-96529: conservative z_cons drifted from 1.9234');
  if (!approx(zCons, zFromCount(N_W / 1), 1e-12)) throw new Error('imp-96529: z_cons must equal the VIF = 1 value');
  // the worst-case measure is genuinely admissible: nonnegative weights
  if (!P.every((p) => p >= 0)) throw new Error('imp-96529: worst-case measure weights must be nonnegative (PSD)');
  // it matches all four measured moments exactly
  for (let k = 0; k < 4; k++) {
    if (!approx(rhoOfMeasure(k), MOMENTS[k], 1e-9))
      throw new Error('imp-96529: worst-case measure fails to match measured moment rho_' + k);
  }
  // and yet its finite-window VIF exceeds 1 (=> significance below the naive floor)
  if (!approx(VIF_WORST, 14.5517, 1e-3)) throw new Error('imp-96529: worst-case VIF_291 drifted from 14.5517');
  if (!(VIF_WORST > 1)) throw new Error('imp-96529: worst-case completion must have VIF > 1 (defeats a model-free VIF < 1 claim)');
  if (!approx(Z_WORST, 0.5042, 1e-3)) throw new Error('imp-96529: worst-case z drifted from 0.5042');
  if (!(Z_WORST < zCons)) throw new Error('imp-96529: worst-case admissible z must fall BELOW the naive floor');
  // the admissible VIF interval straddles 1 (both extremes exhibited)
  if (!(VIF_AR3 < 1 && VIF_WORST > 1)) throw new Error('imp-96529: admissible VIF interval must straddle 1');
  // the gap: best model-free rigorous improvement is zero; the AR-1 climb is model-contingent and positive
  if (IMP96529_EXCURSION_ZCONS_MODEL_FREE_TIGHTENING.gap.bestModelFreeRigorousImprovement !== 0)
    throw new Error('imp-96529: best model-free rigorous improvement must be exactly zero');
  if (!(Z_AR1 > zCons)) throw new Error('imp-96529: AR-1 model figure should exceed the floor (model-contingent gap)');
  // honesty gates
  if (!/NO QED/.test(IMP96529_EXCURSION_ZCONS_MODEL_FREE_TIGHTENING.verdict))
    throw new Error('imp-96529: verdict dropped the NO QED banner');
  if (!/refereed bound is changed/i.test(IMP96529_EXCURSION_ZCONS_MODEL_FREE_TIGHTENING.verdict))
    throw new Error('imp-96529: verdict dropped the no-refereed-bound-change banner');
  if (!(/RH open/.test(IMP96529_HONEST_BANNER) && /PT Lambda <= 0.2|refereed bound is changed/.test(IMP96529_HONEST_BANNER) && /NO QED/.test(IMP96529_HONEST_BANNER)))
    throw new Error('imp-96529: IMP96529_HONEST_BANNER missing RH-open / PT-Lambda / NO-QED markers');
})();

export default IMP96529_EXCURSION_ZCONS_MODEL_FREE_TIGHTENING;
