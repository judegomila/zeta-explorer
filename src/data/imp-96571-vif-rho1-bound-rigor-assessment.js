/**
 * imp-96571 -- Is the explicit Route I sine-kernel bound VIF_291 <= 0.0752 (z_eff >= 7.012) GENUINELY
 * RIGOROUS from the sign theorem plus the one exact lag rho_1, or does tail-magnitude softness cap the
 * honest headline back at the sign-level z_eff >= z_cons = 1.9234? Assessment only; conditional on GUE;
 * NO QED.
 *
 * WHY THIS FOLLOWS imp-96543. imp-96543 delivered the conditional-on-sine-kernel VIF < 1 certificate at
 * two levels: a SIGN level (rho_k <= 0 for all k >= 1 => VIF_n <= 1 term by term => z_eff >= 1.9234) and
 * a MAGNITUDE level (the explicit VIF_291 <= 0.075232, z_eff >= 7.012, from the one exactly-known lag
 * rho_1 = -0.4639782 plus the sign of the rest). Its OBSTRUCTION flagged the magnitude level as SOFT --
 * the O(1/k^2) decay clause and the tabulated rho_2 = -0.020, rho_3 = -0.008 are uncalibrated / scale
 * mixed -- and its verdict called z_eff >= 1.9234 "the headline" with z_eff >= 7.01 a "refinement." This
 * ticket asks the sharp question: does that softness actually touch the 0.0752 bound, or only the
 * further sharpening to VIF_291 <= 0.0197 (z >= 13.7)?
 *
 * THE DECISIVE STRUCTURE (what the 0.0752 bound actually uses). Split the finite-window Bartlett sum at
 * the one exact lag:
 *   VIF_291 = 1 + 2 * (1 - 1/291) * rho_1  +  2 * sum_{k=2}^{290} (1 - k/291) * rho_k
 *           = [ 0.075232 ]                 +  [ TAIL ],   TAIL = 2 * sum_{k>=2} (1 - k/291) rho_k.
 * For 2 <= k <= 290 the Bartlett weight (1 - k/291) is STRICTLY POSITIVE, and the sign theorem gives
 * rho_k <= 0, so EVERY tail term is <= 0, hence TAIL <= 0 and
 *   VIF_291 = 0.075232 + TAIL  <=  0.075232.
 * DROPPING the tail therefore only ENLARGES the bound -- it is a one-sided (upper) discard, exactly the
 * safe direction. The 0.0752 constant consumes NO tail magnitude: it needs only (i) the exact rho_1 and
 * (ii) the SIGN of the tail. Both are the ROBUST parts of imp-96543 (rho_1 is the exact union-identity
 * value; sign(rho_{k>=2}) <= 0 is the raw cluster-function negativity, the part imp-96543 called "the
 * robust one"). None of the SOFT inputs (O(1/k^2) rate, tabulated rho_2/rho_3, scale mix) enters.
 *
 * WHERE THE SOFTNESS ACTUALLY BITES. The uncalibrated tail magnitudes are used ONLY to REPLACE the
 * discarded TAIL by a specific negative number, i.e. to move from the upper bound 0.075232 to the
 * SHARPER VIF_291 <= 0.019672 (z >= 13.71). That sharpening consumes rho_2, rho_3 as magnitudes, so it
 * inherits their calibration uncertainty and is correctly labelled soft. The softness is confined to the
 * 0.0197 refinement; it cannot propagate UP to the 0.0752 bound, because a rigorous upper bound is not
 * weakened by dropping a term it never used.
 *
 * INDEPENDENT CORROBORATION (imp-96567). imp-96567 later derived the box-averaged lags directly from
 * T_2 = (sin pi x / pi x)^2 over the actual L = 495.779 tiling: rho_1 = -0.463978 reproduces the exact
 * union value to 6 digits, and the tail is the closed form rho_k = -(1/(2 pi^2 Sigma^2)) ln(k^2/(k^2-1))
 * ~ -0.052/k^2 with sum_{k>=2} rho_k = -0.036022 -- genuinely negative and small. This does NOT change
 * the 0.0752 bound (which never used the tail); it only confirms the discarded TAIL is indeed <= 0 (so no
 * hidden positive term could invalidate the upper bound) and that the true VIF sits BELOW 0.0752, roughly
 * VIF_291 ~ 0.075232 + 2*(-0.036022) ~ 0.0032 -- consistent with, and safely under, 0.0752.
 *
 * VERDICT. The explicit bound VIF_291 <= 0.0752 (z_eff >= 7.012) is GENUINELY RIGOROUS conditional on the
 * sine kernel: it rests only on the exact rho_1 = -0.4639782 and on sign(rho_{k>=2}) <= 0, discarding the
 * nonpositive tail in the bound-ENLARGING direction. Tail-magnitude softness does NOT cap it back at the
 * sign level -- the softness lives entirely in the FURTHER sharpening to VIF_291 <= 0.0197 (z >= 13.71),
 * which does consume the uncalibrated rho_2/rho_3. So the honest hierarchy is: z_eff >= 1.9234 (SIGN only,
 * no rho_1) robust; z_eff >= 7.012 (exact rho_1 + tail sign) ALSO rigorous and the honest EXPLICIT
 * headline, NOT soft; z_eff >= 13.71 (uses tail magnitudes) soft. imp-96543's placement of z_eff >= 1.9234
 * as "the headline" is over-conservative: the correct rigorous conditional headline is z_eff >= 7.012.
 * ALL conditional on the GUE sine kernel / Montgomery pair correlation for the zeta zeros (UNPROVEN,
 * GRH-flavored); changes NO unconditional bound. Assessment only; RH open; NO QED; no refereed bound is changed
 * ; the zero-side route stays PCC/GRH-gated.
 *
 * @see imp-96543-sine-kernel-vif-conditional-lower-bound (the two-level certificate and its OBSTRUCTION)
 * @see imp-96567-box-averaged-sine-kernel-lag-decay (direct tail from T_2; the discarded tail is <= 0)
 * @see imp-96529-excursion-zcons-model-free-tightening-assessment (the model-free straddle z_cons = 1.9234)
 * @see imp-96489-excursion-effective-significance-direct-rho (source of the exact rho_1 = -0.4639782)
 *
 * Import-light: no zeros bundle, no sibling imports. The VIF formula, z map, and the term-by-term upper
 * bound are re-derived here from the imp-96543 / imp-96529 literals.
 */

// Fixed inputs (imp-96543 / imp-96529 literals; no zeros needed).
const N_W = 291; // conservative non-overlapping hard-box tiling count at T = 1.5e5
const REL_ERR = 0.15945679221237827; // dip depth |residual|/r (held fixed across all models)
const RHO_1 = -0.4639782; // imp-96489 directly-evaluated union-identity value (EXACT box value)
const RHO_2 = -0.020; // theoretical sine-process lag-2 box correlation (SOFT: scale-mixed, uncalibrated)
const RHO_3 = -0.008; // theoretical sine-process lag-3 box correlation (SOFT: scale-mixed, uncalibrated)
// imp-96567 direct-from-T_2 tail (independent corroboration that the discarded tail is genuinely <= 0).
const TAIL_RHO_SUM_DIRECT = -0.036022; // sum_{k>=2} rho_k from Cov_k = -(1/(2 pi^2)) ln(k^2/(k^2-1))

const zFromVif = (vif) => REL_ERR / Math.sqrt(2 / (N_W / vif)); // z at fixed dip depth
const zCons = zFromVif(1); // 1.923422: the VIF = 1 independence floor (SIGN-level lower bound)

// The exact-rho_1 explicit upper bound: EVERY dropped tail term is (1 - k/291) > 0 times rho_k <= 0,
// so dropping the tail only ENLARGES the bound => this is a rigorous conditional-on-sine-kernel bound.
const VIF_RHO1_UPPER = 1 + 2 * (1 - 1 / N_W) * RHO_1; // 0.075232 (uses only exact rho_1 + tail SIGN)
const Z_RHO1_LOWER = zFromVif(VIF_RHO1_UPPER); // 7.012484

// The SHARPER bound that DOES consume tail magnitudes (SOFT: inherits rho_2/rho_3 calibration doubt).
const vifFromLags = (lags) => {
  let s = 0;
  for (let k = 1; k <= lags.length; k++) s += (1 - k / N_W) * lags[k - 1];
  return 1 + 2 * s;
};
const VIF_RHO123_UPPER = vifFromLags([RHO_1, RHO_2, RHO_3]); // 0.019672 (SOFT)
const Z_RHO123_LOWER = zFromVif(VIF_RHO123_UPPER); // 13.713 (SOFT)

// What the true VIF looks like once the imp-96567 direct tail is included (a check, not the bound).
const VIF_WITH_DIRECT_TAIL = VIF_RHO1_UPPER + 2 * TAIL_RHO_SUM_DIRECT; // ~ 0.00319 (safely under 0.0752)

export const IMP96571_VIF_RHO1_BOUND_RIGOR_ASSESSMENT = {
  ticket: 'imp-96571',
  question:
    'Is the explicit sine-kernel bound VIF_291 <= 0.0752 (z_eff >= 7.012) genuinely rigorous from the sign theorem plus the one exact lag rho_1, or does tail-magnitude softness cap the honest headline back at the sign-level z_eff >= 1.9234?',
  decisiveStructure: {
    split: 'VIF_291 = [1 + 2 (1 - 1/291) rho_1] + 2 sum_{k=2}^{290} (1 - k/291) rho_k',
    headTerm: VIF_RHO1_UPPER, // 0.075232: exact rho_1 only
    tailSign: 'for 2 <= k <= 290 the weight (1 - k/291) > 0 and rho_k <= 0, so every tail term <= 0',
    consequence:
      'VIF_291 = 0.075232 + TAIL with TAIL <= 0, so dropping the tail only ENLARGES the bound: VIF_291 <= 0.075232 is a valid upper bound consuming NO tail magnitude.',
    inputsUsed:
      'only (i) the EXACT rho_1 = -0.4639782 (imp-96489 union identity) and (ii) sign(rho_{k>=2}) <= 0 (raw cluster-function negativity) -- both the ROBUST parts of imp-96543.',
    inputsNotUsed:
      'NONE of the soft inputs enter: not the O(1/k^2) decay rate, not the tabulated rho_2/rho_3 magnitudes, not the scale mix.',
  },
  whereSoftnessBites: {
    onlyAffects: 'the SHARPER VIF_291 <= 0.019672 (z_eff >= 13.71), which REPLACES the discarded tail by a specific negative number using rho_2, rho_3 as magnitudes.',
    cannotPropagateUp:
      'a rigorous upper bound is not weakened by dropping a term it never used, so the tail-magnitude softness confined to the 0.0197 refinement cannot cap the 0.0752 bound.',
    vifRho123Upper: VIF_RHO123_UPPER, // 0.019672 (SOFT)
    zRho123Lower: Z_RHO123_LOWER, // 13.713 (SOFT)
  },
  corroboration: {
    source: 'imp-96567 direct-from-T_2 tail over the L = 495.779 tiling',
    tailRhoSumDirect: TAIL_RHO_SUM_DIRECT, // -0.036022: genuinely negative and small
    vifWithDirectTail: VIF_WITH_DIRECT_TAIL, // ~ 0.0032: the true VIF sits well under 0.0752
    note:
      'confirms the discarded tail is <= 0 (no hidden positive term could break the upper bound) and that the true VIF is far below 0.0752 -- consistent with, and safely under, the rigorous bound.',
  },
  honestHierarchy: {
    signLevel: { vifUpper: 1, zLower: zCons, inputs: 'sign of the WHOLE tail only (no rho_1 magnitude)', status: 'robust' },
    rho1Level: { vifUpper: VIF_RHO1_UPPER, zLower: Z_RHO1_LOWER, inputs: 'exact rho_1 + tail SIGN', status: 'RIGOROUS -- the honest explicit headline (NOT soft)' },
    tailMagLevel: { vifUpper: VIF_RHO123_UPPER, zLower: Z_RHO123_LOWER, inputs: 'uncalibrated tail magnitudes', status: 'SOFT' },
    correction:
      'imp-96543 placed z_eff >= 1.9234 as "the headline"; that is over-conservative -- the correct rigorous conditional headline is z_eff >= 7.012.',
  },
  conditionality:
    'All of the above is conditional on the GUE sine kernel / Montgomery pair correlation holding for the actual zeta zeros (UNPROVEN, GRH-flavored). It changes NO unconditional bound.',
  verdict:
    'The explicit bound VIF_291 <= 0.0752 (z_eff >= 7.012) is GENUINELY RIGOROUS conditional on the sine kernel: it rests only on the exact rho_1 = -0.4639782 and on sign(rho_{k>=2}) <= 0, discarding the nonpositive finite-window tail in the bound-ENLARGING direction (every dropped term is (1 - k/291) > 0 times rho_k <= 0). Tail-magnitude softness does NOT cap it back at the sign level -- the softness lives entirely in the further sharpening to VIF_291 <= 0.0197 (z >= 13.71), which alone consumes the uncalibrated rho_2/rho_3, and a rigorous upper bound is not weakened by dropping a term it never used. imp-96567 independently confirms the discarded tail is genuinely negative and small (sum_{k>=2} rho_k = -0.036), so the true VIF sits ~0.0032, safely under 0.0752. Honest hierarchy: z_eff >= 1.9234 (sign only) robust; z_eff >= 7.012 (exact rho_1 + tail sign) ALSO rigorous and the honest explicit headline, NOT soft; z_eff >= 13.71 (tail magnitudes) soft -- so imp-96543 placing z_eff >= 1.9234 as "the headline" is over-conservative and the correct rigorous conditional headline is z_eff >= 7.012. Conditional on the GUE sine kernel / Montgomery pair correlation for the zeta zeros (UNPROVEN); changes no unconditional bound; assessment only; RH open; NO QED; no refereed bound is changed; the zero-side route stays PCC/GRH-gated.',
};

// Machine-readable honest-status banner (imp-96337 / imp-96428 convention).
export const IMP96571_HONEST_BANNER =
  'RH open; no refereed bound is changed; NO QED. Assessment only: the explicit VIF_291 <= 0.0752 '
  + '(z_eff >= 7.012) is GENUINELY RIGOROUS conditional on the sine kernel -- it uses only the exact '
  + 'rho_1 = -0.4639782 and sign(rho_{k>=2}) <= 0, dropping the nonpositive tail in the bound-enlarging '
  + 'direction (no tail magnitude). The tail-magnitude softness bites only on the SHARPER VIF <= 0.0197 '
  + '(z >= 13.71), which consumes the uncalibrated rho_2/rho_3, and cannot propagate up. So the honest '
  + 'headline is z_eff >= 7.012, not the over-conservative sign-level 1.9234. Conditional on the pair '
  + 'correlation for the zeta zeros (UNPROVEN); changes no unconditional bound.';

// --- self-executing internal-consistency assertions (formula / bound re-derivation only) ---
(() => {
  const approx = (a, b, tol) => Math.abs(a - b) <= tol;
  // floor is the VIF = 1 value
  if (!approx(zCons, 1.923422, 1e-5)) throw new Error('imp-96571: z_cons drifted from 1.9234');
  // the exact rho_1 is a genuine correlation (|rho_1| < 1) and is nonpositive (sign theorem)
  if (!(RHO_1 < 0 && RHO_1 > -1)) throw new Error('imp-96571: rho_1 must be a nonpositive correlation in (-1, 0)');
  // the explicit rho_1-only upper bound and its z
  if (!approx(VIF_RHO1_UPPER, 0.075232, 1e-5)) throw new Error('imp-96571: rho_1-only VIF drifted from 0.0752');
  if (!(VIF_RHO1_UPPER < 1)) throw new Error('imp-96571: rho_1-only VIF must be < 1');
  if (!approx(Z_RHO1_LOWER, 7.012484, 1e-4)) throw new Error('imp-96571: rho_1-only z drifted from 7.01');
  if (!(Z_RHO1_LOWER > zCons)) throw new Error('imp-96571: rho_1-only z must exceed the sign-level floor');
  // THE CORE CLAIM: dropping a nonpositive tail only ENLARGES the bound. Re-derive the head term as an
  // upper bound over ANY nonpositive tail, and check a specific negative tail lands strictly below it.
  if (!(RHO_2 <= 0 && RHO_3 <= 0)) throw new Error('imp-96571: tail lags must be nonpositive (sign theorem)');
  if (!(VIF_RHO123_UPPER <= VIF_RHO1_UPPER)) throw new Error('imp-96571: adding negative tail lags must not raise the bound');
  // the tail Bartlett weights are strictly positive on 2 <= k <= 290 (so tail terms are <= 0)
  for (let k = 2; k <= N_W - 1; k++) {
    if (!((1 - k / N_W) > 0)) throw new Error('imp-96571: Bartlett weight must be positive for k < n');
  }
  // an ARBITRARY nonpositive tail keeps VIF <= the head term (the rigor of the 0.0752 bound)
  const arbitraryTail = [-0.03, -0.5, -0.001, -0.2]; // any nonpositive values
  const vifArb = VIF_RHO1_UPPER + 2 * arbitraryTail.reduce((acc, r, i) => acc + (1 - (i + 2) / N_W) * r, 0);
  if (!(vifArb <= VIF_RHO1_UPPER)) throw new Error('imp-96571: any nonpositive tail must keep VIF <= the head-term bound');
  // the soft sharpening genuinely uses magnitudes and lands strictly below (it is a real refinement)
  if (!(VIF_RHO123_UPPER < VIF_RHO1_UPPER - 1e-9)) throw new Error('imp-96571: the magnitude-level bound must be strictly sharper');
  if (!(Z_RHO123_LOWER > Z_RHO1_LOWER)) throw new Error('imp-96571: the soft bound must give a larger z');
  // corroboration: the direct tail is negative and puts the true VIF safely under 0.0752
  if (!(TAIL_RHO_SUM_DIRECT < 0)) throw new Error('imp-96571: the imp-96567 direct tail must be negative');
  if (!(VIF_WITH_DIRECT_TAIL < VIF_RHO1_UPPER)) throw new Error('imp-96571: the true VIF must sit under the rigorous bound');
  // honesty gates
  if (!/NO QED/.test(IMP96571_VIF_RHO1_BOUND_RIGOR_ASSESSMENT.verdict))
    throw new Error('imp-96571: verdict dropped the NO QED banner');
  if (!/refereed bound is changed/i.test(IMP96571_VIF_RHO1_BOUND_RIGOR_ASSESSMENT.verdict))
    throw new Error('imp-96571: verdict dropped the no-refereed-bound-change banner');
  if (!/conditional/i.test(IMP96571_VIF_RHO1_BOUND_RIGOR_ASSESSMENT.verdict))
    throw new Error('imp-96571: verdict must flag the result as CONDITIONAL');
  if (!(/RH open/.test(IMP96571_HONEST_BANNER) && /PT Lambda <= 0.2|refereed bound is changed/.test(IMP96571_HONEST_BANNER) && /NO QED/.test(IMP96571_HONEST_BANNER)))
    throw new Error('imp-96571: IMP96571_HONEST_BANNER missing RH-open / PT-Lambda / NO-QED markers');
})();

export default IMP96571_VIF_RHO1_BOUND_RIGOR_ASSESSMENT;
