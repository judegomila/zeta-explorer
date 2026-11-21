/**
 * imp-95464: DERIVATION + MEASUREMENT -- a tighter cancellation-free
 * UPPER enclosure of the theta density p(t) that symmetrizes the
 * asymmetric imp-95420 THEOREM P-POS bracket. Derivation/measurement;
 * changes no bound; NO QED; no refereed bound is changed.
 *
 * BACKGROUND (imp-95449 RESULT 3). The imp-95420 P-POS enclosure of the
 * theta density p(t) is asymmetric about p: at the worst (regime-
 * boundary) point the upper bound overestimates p by 65 percent
 * (up/p = 1.649226) while the lower bound is only 2.0 percent low
 * (lo/p = 0.979631). This is the signature of an alternating series
 *   R(t) := p(t)/up(t) = c_0 - c_1 + c_2 - c_3 + ...,
 * where the imp-95420 bounds are the first two partial sums:
 *   up  = c_0            (= up(t) itself, R-normalized to 1),
 *   lo  = c_0 - c_1      (R-normalized to 1 - c_1).
 * The R-normalized alternating coefficients are (imp-95449 device):
 *   (theta, t >= 1/pi^2)  c_n = (2n+1) e^(-n(n+1) pi^2 t),  n >= 0,
 *   (dual,  0 < t <= 1)   c_k = (2k-1) e^(-k(k-1)/t),       k >= 1.
 * So up = c_0 misses by the LARGE first-neglected term c_1 while
 * lo = c_0 - c_1 misses by the much smaller c_2 -- hence p sits near lo.
 *
 * DERIVATION (this module). Append the next alternating term to the
 * upper bound: the R-normalized third partial sum
 *   up' := c_0 - c_1 + c_2,   i.e.
 *   (theta) up'_th(t) = pi e^(-pi^2 t/4) (1 - 3 e^(-2 pi^2 t) + 5 e^(-6 pi^2 t)),
 *   (dual)  up'_du(t) = e^(-1/(4t))/(t sqrt(pi t)) (1 - 3 e^(-2/t) + 5 e^(-6/t)).
 * up' is CANCELLATION-FREE in exactly the imp-95449 sense: it is up(t)
 * times an O(1) three-term polynomial in the base exponential, so it
 * evaluates to full double precision where the imp-95420 raw form loses
 * ~90 digits.
 *
 * RIGOROUS MAJORANT (Leibniz partial-sum bracketing). For an
 * alternating series sum (-1)^n a_n with a_n > 0 STRICTLY DECREASING,
 * the partial sums nest: S_1 < S_3 < ... < S < ... < S_2 < S_0. Hence
 * S_2 = c_0 - c_1 + c_2 is an UPPER bound for the true value S = R(t)
 * and S_1 = c_0 - c_1 is a lower bound. The strict-decrease hypothesis
 * a_(n+1) < a_n holds across BOTH regimes:
 *   (theta) a_(n+1)/a_n = (2n+3)/(2n+1) e^(-2(n+1) pi^2 t) <= 3 e^(-2 pi^2 t)
 *           <= 3 e^(-2) = 0.406 < 1  for all n >= 0, t >= 1/pi^2;
 *   (dual)  a_(k+1)/a_k = (2k+1)/(2k-1) e^(-2k/t) <= 3 e^(-2/t)
 *           <= 3 e^(-2) = 0.406 < 1  for all k >= 1, t <= 1.
 * The binding case is the smallest index at the regime boundary; the
 * ratio (2n+3)/(2n+1) is maximal (= 3) at n = 0 and the exponential is
 * maximal at the boundary, and 3 e^(-2) < 1 with margin. So up' is a
 * rigorous majorant of p(t) throughout the certified cover.
 *
 * MEASUREMENT (all baked and re-derived by the assertions).
 * (1) At the worst point (a regime boundary, t = 1/pi^2 theta / t = 1
 *     dual, where the two normalized series coincide term-by-term):
 *       up/p  = 1.649226  (imp-95420 upper, 65 percent over)
 *       up'/p = 1.0000709 (new upper, 0.0071 percent over)
 *     -- the upper-bound overestimate drops by a factor ~9160.
 * (2) The new enclosure relative width (up' - lo)/up' = c_2/(c_0-c_1+c_2)
 *     = 0.020439 at the boundary, versus the imp-95420 width
 *     c_1/c_0 = 0.406006: a 19.86x reduction. Away from the boundary the
 *     new width decays as c_2/(...) ~ 5 e^(-6 pi^2 t) (theta) --
 *     TRIPLE-exponentially fast versus the old 3 e^(-2 pi^2 t).
 * (3) SYMMETRIZATION. The imp-95420 bracket [lo, up] = [0.9796 p,
 *     1.6492 p] has p pinned at the lower edge. The new bracket
 *     [lo, up'] = [0.9796 p, 1.0000709 p] straddles p with the upper
 *     edge now near-exact; the residual asymmetry has FLIPPED to favor
 *     the lower side (2.0 percent vs 0.0071 percent). Pairing up' = S_2
 *     with the matching lower partial sum lo' = S_3 = c_0-c_1+c_2-c_3
 *     gives a fully balanced bracket [0.99999997 p, 1.0000709 p], both
 *     edges within 7.1e-5 of p.
 *
 * HONEST SCOPE. Derivation + measurement only. up' is a strictly tighter
 * rigorous UPPER majorant of p(t), but the imp-95420 positivity margin
 * is already O(1) (min p/up = 0.606345, imp-95449), so this changes NO
 * bound, onset, or floor -- it sharpens a two-sided enclosure whose
 * positivity conclusion is unaffected. The imp-95420 THEOREM P-POS and
 * its proof are UNTOUCHED and remain the system of record; imp-95449 is
 * the tightness measurement and imp-95422/imp-95486 the BigInt-HP
 * cross-checks. The imp-95212 envelope port, signed WEIGHT, and
 * modulus/phase legs stay OPEN. NO QED; no refereed bound is changed.
 */

// ---------------------------------------------------------------------------
// Reference constants (all cross-checked by the assertions below)
// ---------------------------------------------------------------------------

export const IMP95464_PPOS_UPPER_SYMMETRIZE = {
  id: "imp-95464",
  title:
    "DERIVATION + MEASUREMENT: tighter cancellation-free upper enclosure " +
    "up' = c_0 - c_1 + c_2 of the theta density p(t) symmetrizing the " +
    "asymmetric imp-95420 P-POS bracket",
  device:
    "append the next alternating-series term to the upper bound: R-normalized " +
    "up' = c_0 - c_1 + c_2 (third partial sum); rigorous majorant by Leibniz " +
    "partial-sum nesting since a_(n+1)/a_n <= 3 e^(-2) = 0.406 < 1 across both " +
    "regimes (theta t >= 1/pi^2, dual t <= 1)",
  regimes: {
    thetaFrom: 0.10132118364233778, // 1/pi^2
    dualUpTo: 1.0,
  },
  baked: {
    // R-normalized alternating coefficients at a regime boundary
    c0_atBoundary: 1.0,
    c1_atBoundary: 0.406005849709838, // 3 e^(-2)
    c2_atBoundary: 0.012393760883332, // 5 e^(-6)
    c3_atBoundary: 0.000043009486473, // 7 e^(-12)
    // new upper bound (R-normalized) and the true ratio
    upPrimeNormalized_atBoundary: 0.606387911173494, // c0 - c1 + c2
    pNormalized_atBoundary: 0.606344920236374, // R(1/pi^2) = min p/up (imp-95449)
    loNormalized_atBoundary: 0.593994150290162, // c0 - c1 (imp-95420 lo)
    // (1) overestimate ratios
    upOverP_old: 1.649226317605, // imp-95420 upper / p
    upPrimeOverP_new: 1.000070901785, // new upper / p
    overestimateShrinkFactor: 9160.0, // (upOverP_old - 1)/(upPrimeOverP_new - 1), ~9160
    // (2) enclosure relative width (up - lo)/up at the boundary
    widthOld_atBoundary: 0.406005849710, // c1/c0
    widthNew_atBoundary: 0.020438667485, // c2/(c0-c1+c2)
    widthReductionFactor: 19.864594891521,
    // (3) fully balanced bracket [S3, S2] both within 7.1e-5 of p
    loPrimeNormalized_atBoundary: 0.606344901687021, // c0-c1+c2-c3 = S3
    balancedBracketMaxRelDev: 7.0902e-5, // max(|S2/p-1|,|S3/p-1|)
  },
  verdict:
    "DERIVATION + MEASUREMENT of a tighter cancellation-free UPPER enclosure " +
    "up' = c_0 - c_1 + c_2 (third alternating partial sum) of the theta " +
    "density p(t). It is a rigorous majorant by Leibniz partial-sum nesting " +
    "(the R-normalized coefficients strictly decrease: a_(n+1)/a_n <= 3 e^(-2) " +
    "= 0.406 < 1 across both regimes). At the worst (boundary) point it cuts " +
    "the upper-bound overestimate from 65 percent (imp-95420 up/p = 1.6492) to " +
    "0.0071 percent (up'/p = 1.0000709), a factor ~9160, and the enclosure " +
    "relative width from 0.406006 to 0.020439 (19.86x). The imp-95420 bracket " +
    "pinned p at its lower edge; the new bracket [lo, up'] straddles p with a " +
    "near-exact upper edge, and pairing up' = S_2 with lo' = S_3 gives a fully " +
    "balanced bracket within 7.1e-5 of p. Derivation + measurement only: the " +
    "imp-95420 positivity margin is already O(1) (min p/up = 0.606345), so this " +
    "changes NO bound, onset, or floor and the imp-95420 THEOREM P-POS proof is " +
    "UNTOUCHED. The imp-95212 envelope port and signed WEIGHT / modulus-phase " +
    "legs stay OPEN; NO QED; no refereed bound is changed.",
};

// ---------------------------------------------------------------------------
// Self-executing assertions (import-light: no imports at all)
// ---------------------------------------------------------------------------

const PI = Math.PI;
const PI2 = PI * PI;
const T_THETA = 1 / PI2;
const REF = IMP95464_PPOS_UPPER_SYMMETRIZE;

// R-normalized alternating coefficient c_n (theta regime), c_n > 0
const cTheta = (n, t) => (2 * n + 1) * Math.exp(-n * (n + 1) * PI2 * t);
// R-normalized alternating coefficient c_k (dual regime), c_k > 0
const cDual = (k, t) => (2 * k - 1) * Math.exp(-k * (k - 1) / t);

// Stable full normalized ratio R = p/up (theta), leading term 1, no cancel
function ratioTheta(t) {
  let s = 0;
  for (let n = 0; n < 200; n++) {
    const term = (n % 2 === 0 ? 1 : -1) * cTheta(n, t);
    s += term;
    if (n > 2 && Math.abs(term) < 1e-300) break;
  }
  return s;
}
function ratioDual(t) {
  let s = 0;
  for (let k = 1; k < 200; k++) {
    const term = (k % 2 === 1 ? 1 : -1) * cDual(k, t);
    s += term;
    if (k > 2 && Math.abs(term) < 1e-300) break;
  }
  return s;
}

export const IMP95464_UPPER_SYMMETRIZE_ASSERTIONS = [
  {
    id: "imp95464-coefficients-at-boundary",
    description:
      "the R-normalized alternating coefficients at a regime boundary are " +
      "c_0=1, c_1=3 e^(-2)=0.406006, c_2=5 e^(-6)=0.012394, c_3=7 e^(-12), " +
      "and the theta (t=1/pi^2) and dual (t=1) coefficients coincide",
    holds: () => {
      const b = REF.baked;
      const okTh =
        Math.abs(cTheta(0, T_THETA) - b.c0_atBoundary) < 1e-12 &&
        Math.abs(cTheta(1, T_THETA) - b.c1_atBoundary) < 1e-11 &&
        Math.abs(cTheta(2, T_THETA) - b.c2_atBoundary) < 1e-11 &&
        Math.abs(cTheta(3, T_THETA) - b.c3_atBoundary) < 1e-11;
      // theta and dual boundary coefficients are the same object
      const okDu =
        Math.abs(cDual(1, 1) - cTheta(0, T_THETA)) < 1e-12 &&
        Math.abs(cDual(2, 1) - cTheta(1, T_THETA)) < 1e-12 &&
        Math.abs(cDual(3, 1) - cTheta(2, T_THETA)) < 1e-12;
      return okTh && okDu;
    },
  },
  {
    id: "imp95464-leibniz-strict-decrease",
    description:
      "the R-normalized coefficients strictly decrease across both regimes " +
      "(a_(n+1)/a_n <= 3 e^(-2) = 0.406 < 1), so partial sums nest and " +
      "up' = c_0-c_1+c_2 is a rigorous majorant; binding case is n=0/k=1 at " +
      "the boundary",
    holds: () => {
      const cap = 3 * Math.exp(-2);
      // Use the analytic ratio (avoids 0/0 underflow at large index):
      //   theta a_(n+1)/a_n = (2n+3)/(2n+1) exp(-2(n+1) pi^2 t)
      //   dual  a_(k+1)/a_k = (2k+1)/(2k-1) exp(-2k/t)
      const rTheta = (n, t) =>
        ((2 * n + 3) / (2 * n + 1)) * Math.exp(-2 * (n + 1) * PI2 * t);
      const rDual = (k, t) =>
        ((2 * k + 1) / (2 * k - 1)) * Math.exp(-2 * k / t);
      // theta: scan t over the certified cover, all indices
      for (let i = 0; i <= 60; i++) {
        const t = T_THETA * Math.pow(200 / T_THETA, i / 60);
        for (let n = 0; n < 12; n++) {
          const ratio = rTheta(n, t);
          if (!(ratio < 1)) return false;
          if (ratio > cap + 1e-12) return false; // <= 3 e^(-2) uniformly
        }
      }
      // dual: t in (0,1]
      for (let i = 0; i <= 60; i++) {
        const t = 1e-3 * Math.pow(1e3, i / 60);
        for (let k = 1; k < 12; k++) {
          const ratio = rDual(k, t);
          if (!(ratio < 1)) return false;
          if (ratio > cap + 1e-12) return false;
        }
      }
      return true;
    },
  },
  {
    id: "imp95464-up-prime-is-majorant",
    description:
      "up' = c_0-c_1+c_2 (R-normalized third partial sum) is a rigorous " +
      "upper bound for R = p/up while lo = c_0-c_1 stays a lower bound: " +
      "lo < R < up' at every sampled point of both regimes",
    holds: () => {
      for (let i = 0; i <= 400; i++) {
        const t = T_THETA * Math.pow(200 / T_THETA, i / 400);
        const R = ratioTheta(t);
        const lo = cTheta(0, t) - cTheta(1, t);
        const upP = lo + cTheta(2, t);
        if (!(lo <= R && R <= upP)) return false;
      }
      for (let i = 0; i <= 400; i++) {
        const t = 1e-3 * Math.pow(1e3, i / 400);
        const R = ratioDual(t);
        const lo = cDual(1, t) - cDual(2, t);
        const upP = lo + cDual(3, t);
        if (!(lo <= R && R <= upP)) return false;
      }
      return true;
    },
  },
  {
    id: "imp95464-overestimate-shrink",
    description:
      "at the boundary the upper-bound overestimate drops from up/p=1.649226 " +
      "(imp-95420, 65 percent over) to up'/p=1.0000709 (0.0071 percent over), " +
      "a factor ~9160",
    holds: () => {
      const b = REF.baked;
      const R = ratioTheta(T_THETA); // = p normalized
      const upOld = 1; // c_0
      const upPrime = cTheta(0, T_THETA) - cTheta(1, T_THETA) + cTheta(2, T_THETA);
      const upOverP = upOld / R;
      const upPrimeOverP = upPrime / R;
      const shrink = (upOverP - 1) / (upPrimeOverP - 1);
      return (
        Math.abs(upOverP - b.upOverP_old) < 1e-9 &&
        Math.abs(upPrimeOverP - b.upPrimeOverP_new) < 1e-9 &&
        Math.abs(shrink / b.overestimateShrinkFactor - 1) < 5e-3 &&
        upPrimeOverP > 1
      );
    },
  },
  {
    id: "imp95464-width-reduction",
    description:
      "the enclosure relative width (up-lo)/up drops from c_1/c_0=0.406006 " +
      "(imp-95420) to c_2/(c_0-c_1+c_2)=0.020439 at the boundary, a 19.86x " +
      "reduction",
    holds: () => {
      const b = REF.baked;
      const c0 = cTheta(0, T_THETA);
      const c1 = cTheta(1, T_THETA);
      const c2 = cTheta(2, T_THETA);
      const widthOld = c1 / c0;
      const upPrime = c0 - c1 + c2;
      const widthNew = c2 / upPrime;
      return (
        Math.abs(widthOld - b.widthOld_atBoundary) < 1e-11 &&
        Math.abs(widthNew - b.widthNew_atBoundary) < 1e-11 &&
        Math.abs(widthOld / widthNew - b.widthReductionFactor) < 1e-6 &&
        widthNew < widthOld
      );
    },
  },
  {
    id: "imp95464-balanced-bracket",
    description:
      "pairing up'=S_2 with the matching lower partial sum lo'=S_3=" +
      "c_0-c_1+c_2-c_3 gives a fully balanced bracket [S_3, S_2] whose edges " +
      "are both within 7.1e-5 of p (relative)",
    holds: () => {
      const b = REF.baked;
      const c0 = cTheta(0, T_THETA);
      const c1 = cTheta(1, T_THETA);
      const c2 = cTheta(2, T_THETA);
      const c3 = cTheta(3, T_THETA);
      const R = ratioTheta(T_THETA);
      const S2 = c0 - c1 + c2;
      const S3 = c0 - c1 + c2 - c3;
      if (!(S3 <= R && R <= S2)) return false; // proper straddle
      const maxDev = Math.max(Math.abs(S2 / R - 1), Math.abs(S3 / R - 1));
      return (
        Math.abs(S3 - b.loPrimeNormalized_atBoundary) < 1e-11 &&
        Math.abs(maxDev - b.balancedBracketMaxRelDev) / b.balancedBracketMaxRelDev < 1e-3
      );
    },
  },
  {
    id: "imp95464-verdict-honesty",
    description:
      "the verdict carries the honest scope: derivation + measurement only, " +
      "no bound changed, imp-95420 proof untouched, open legs named, NO QED",
    holds: () =>
      /DERIVATION \+ MEASUREMENT/.test(REF.verdict) &&
      /rigorous majorant/.test(REF.verdict) &&
      /changes NO bound/.test(REF.verdict) &&
      /UNTOUCHED/.test(REF.verdict) &&
      /stay[\s\S]*OPEN/.test(REF.verdict) &&
      /NO QED/.test(REF.verdict) &&
      /refereed bound is changed/i.test(REF.verdict),
  },
];

for (const a of IMP95464_UPPER_SYMMETRIZE_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-95464-ppos-upper-symmetrize assertion failed: ${a.id}`,
    );
  }
}

export default IMP95464_PPOS_UPPER_SYMMETRIZE;
