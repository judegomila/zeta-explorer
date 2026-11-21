/**
 * imp-95316: ASSESSMENT -- is the imp-95252 COROLLARY RZ-BLOCK Riesz
 * lower constant A_blk = 1.345e-11 the BINDING factor limiting the
 * SPLIT-RZ every-octave onset (15.9816 at r = 1.3), or a loose artifact
 * of the crude symbol infimum / Schur bound? Measures the onset as a
 * function of a hypothetically improved A_blk and reports the elasticity.
 * Assessment only; changes NO bound; NO QED; no refereed bound is changed.
 *
 * SETUP. imp-95252 COROLLARY SPLIT-RZ certifies, on the dyadic twin
 * skeleton (rho = 2, r in (1, 1.3]) and for EVERY octave count m,
 *   Lambda(V, x) <= C(x) := N(x) / A_blk,   N(x) = sum_(k>=0) coalLaw(2^k x),
 * with coalLaw(x) = e^(-2x) (1 + 2x^2 + 2x sqrt(1 + x^2)) the imp-95227
 * COAL-DOM + imp-95231 RATE-MONO confluent law, and
 *   A_blk = A_twin / (1 + sech(b/2)),  b = ln r,
 *   A_twin = 4 sin^2(pi tau) P(pi) P(2pi) / (P(pi) + 2 P(2pi)).
 * The onset xStar solves C(xStar) = 1, i.e. N(xStar) = A_blk.
 *
 * THE QUESTION and its answer. Because N(x) DECAYS EXPONENTIALLY
 * (N(x) ~ 4 x^2 e^(-2x) as x -> inf, the k = 0 term dominating), the
 * onset condition -2 x + 2 ln x + ln 4 = ln A_blk makes xStar only
 * LOGARITHMICALLY dependent on A_blk. Differentiating,
 *   dxStar / d(ln A_blk) = 1 / (-2 + 2/xStar)  ->  -1/2,
 * so the onset moves by only ~1/2 a depth unit per e-fold of A_blk. The
 * measured local elasticity at the baseline is
 *   d(ln xStar) / d(ln A_blk) = -0.03337   (dxStar/d ln A_blk = -0.5333),
 * matching the leading-order prediction 1/(-2 + 2/xStar) = -0.53337 to
 * four figures. CONCLUSION: A_blk is NOT the binding factor in the sense
 * of removable slack -- the binding factor is the EXPONENTIAL DEPTH-DECAY
 * of the coalescence-law numerator N(x), not the constant.
 *
 * SENSITIVITY TABLE (onset as a function of scaled A_blk, r = 1.3):
 *   A_blk factor   effective A_blk    xStar     dxStar vs base
 *      1.0e-6        1.345e-17       23.264      +7.283
 *      1.0e-3        1.345e-14       19.641      +3.660
 *      1.0          1.345e-11       15.982       0.000  (baseline)
 *      2.0          2.690e-11       15.612      -0.370
 *      1.0e+1       1.345e-10       14.750      -1.231
 *      1.0e+3       1.345e-08       12.264      -3.718
 *      1.0e+6       1.345e-05        8.438      -7.544
 *      1.0e+9       1.345e-02        4.326     -11.656
 *      7.4e+10      1.000e+00        1.113     -14.869  (A_blk -> 1)
 * Even lifting A_blk by ELEVEN ORDERS OF MAGNITUDE to O(1) -- a
 * fantasy -- only drops the onset from 15.98 to ~1.1: the smallness of
 * A_blk carries about -(1/2) ln(1/A_blk) = 12.52 depth units of the
 * onset, but that "cost" is logarithmic and cannot be clawed back.
 *
 * IS THE SMALLNESS ARTIFACT OR INTRINSIC? INTRINSIC. imp-95252
 * THEOREM RZ-TWIN measures the symbol-infimum ratio at 1.00000131 (rho =
 * 2), i.e. A_twin is already within rel 1.3e-6 of the EXACT symbol
 * infimum lambda_min(F). Computing the symbol infimum exactly rather than
 * bounding it would move the onset by
 *   dxStar ~ -0.5333 * ln(1.00000131) = -7.0e-7 depth units,
 * i.e. NOTHING. The Szegoe ceiling of RZ-TWIN (Fejer averages ->
 * inf_theta lambda_min(F), no m-uniform constant can exceed it) proves
 * the "crude symbol bound" is not crude: it is the sharp currency, and
 * the tiny A_twin is the true block-Riesz constant of the dyadic twin
 * lattice, not slack.
 *
 * THE ONLY NON-SYMBOL SLACK, and it is small. The single bounded,
 * non-symbol factor in A_blk is the Cauchy-Schwarz block-norm conversion
 * 1 + sech(b/2) = 1.99146 (converting ||F_k||^2 <= (1 + sech(b/2))|c_k|^2
 * in RZ-BLOCK). Replacing A_blk by A_twin (removing this factor entirely)
 * improves the onset by only
 *   15.981584 -> 15.613923,  gain 0.368 depth units,
 * consistent with -0.5333 * ln(1.99146) = -0.368. So the entire
 * recoverable slack in the constant is under 0.4 depth units, versus the
 * ~11 depth-unit onset improvement (27.04 -> 15.98) that SPLIT-RZ already
 * delivers over EV-OCT-UNIF by approaching the NUMERATOR structure.
 *
 * TAKEAWAY. To move the SPLIT-RZ onset by O(1) depth units one must
 * improve the numerator N(x) -- the coalescence-law depth decay or the
 * dyadic-sum structure -- NOT the constant A_blk. A_blk is Szegoe-ceiling
 * sharp and only logarithmically coupled to the onset (elasticity
 * -0.033); the r-uniform block symbol-pencil residual named in imp-95252
 * HONEST LIMITS (d) would, even if closed, buy at most ~0.4 depth units
 * of onset here. Assessment only; no bound changed.
 *
 * Import-light (no imports, no zeros bundle). Numerics reproduce the
 * assessed statements; they are cross-checks, never the claim.
 */

// ---------------------------------------------------------------------------
// Reference record
// ---------------------------------------------------------------------------

export const IMP95316_SPLITRZ_ONSET_ABLK_ELASTICITY = {
  id: "imp-95316",
  title:
    "ASSESSMENT: SPLIT-RZ every-octave onset elasticity to the RZ-BLOCK " +
    "Riesz constant A_blk -- binding factor or crude-bound artifact?",
  setup:
    "onset xStar solves N(xStar) = A_blk with N(x) = sum_k coalLaw(2^k x); " +
    "N decays exponentially so xStar is only logarithmically slaved to A_blk",
  baseline: {
    r: 1.3,
    rho: 2,
    aBlk: 1.344996021e-11,
    aTwin: 2.678501595e-11,
    blockConvFactor: 1.99145689, // 1 + sech(b/2)
    xStar: 15.981584,
  },
  elasticity: {
    dlnXstar_dlnAblk: -0.033370,
    dXstar_dlnAblk: -0.533305, // depth units per e-fold of A_blk
    leadingOrderPrediction: -0.533374, // 1/(-2 + 2/xStar)
    note:
      "matches the closed-form leading-order 1/(-2 + 2/xStar) to four " +
      "figures; the onset is only logarithmically sensitive to A_blk",
  },
  sensitivityTable: [
    { factor: 1e-6, xStar: 23.26431, dXstar: 7.28272 },
    { factor: 1e-3, xStar: 19.64133, dXstar: 3.65975 },
    { factor: 1, xStar: 15.98158, dXstar: 0.0 },
    { factor: 2, xStar: 15.61164, dXstar: -0.36995 },
    { factor: 10, xStar: 14.75029, dXstar: -1.2313 },
    { factor: 1e3, xStar: 12.26358, dXstar: -3.718 },
    { factor: 1e6, xStar: 8.43761, dXstar: -7.54398 },
    { factor: 1e9, xStar: 4.32551, dXstar: -11.65607 },
  ],
  intrinsic:
    "A_twin is within rel 1.3e-6 of the exact symbol infimum (RZ-TWIN " +
    "near-sharp, Szegoe ceiling); computing the symbol infimum exactly " +
    "moves the onset by ~ -7e-7 depth units -- the smallness of A_blk is " +
    "INTRINSIC (the true block-Riesz constant of the dyadic twin lattice), " +
    "NOT an artifact of a crude bound",
  onlyRemovableSlack:
    "the Cauchy-Schwarz block-norm conversion factor 1 + sech(b/2) = " +
    "1.99146 is the only non-symbol slack; replacing A_blk by A_twin " +
    "improves the onset 15.981584 -> 15.613923, a gain of only 0.368 " +
    "depth units",
  depthCarriedByAblk: 12.51602, // -(1/2) ln(1/A_blk)
  verdict:
    "A_blk is NOT the binding factor as removable slack: it is Szegoe- " +
    "ceiling sharp (within 1.3e-6 of the exact symbol infimum) and only " +
    "logarithmically coupled to the onset (elasticity d ln xStar / d ln " +
    "A_blk = -0.0334, i.e. -0.53 depth units per e-fold). Computing the " +
    "symbol infimum exactly gains ~7e-7 depth units; removing the block- " +
    "norm conversion factor gains ~0.37. The binding factor is the " +
    "exponential depth-decay of the coalescence-law numerator N(x), not " +
    "A_blk. Assessment only; changes no bound; NO QED; no refereed bound is changed.",
};

// ---------------------------------------------------------------------------
// Numeric cross-check machinery (self-contained, import-light)
// ---------------------------------------------------------------------------

const sechHalf = (u) => 1 / Math.cosh(u / 2);
const kernelP = (w, lnrho) =>
  (2 * Math.PI) / lnrho / Math.cosh((Math.PI * w) / lnrho);
const aTwin = (lnrho, lnr) => {
  const tau = lnr / lnrho;
  const s2 = Math.sin(Math.PI * tau) ** 2;
  const Ppi = kernelP(Math.PI, lnrho);
  const P2pi = kernelP(2 * Math.PI, lnrho);
  return (4 * s2 * Ppi * P2pi) / (Ppi + 2 * P2pi);
};
const aBlk = (lnrho, lnr) => aTwin(lnrho, lnr) / (1 + sechHalf(lnr));
const coalLaw = (x) =>
  Math.exp(-2 * x) * (1 + 2 * x * x + 2 * x * Math.sqrt(1 + x * x));
function Nnum(x) {
  let s = 0;
  for (let k = 0; k < 60; k++) s += coalLaw(2 ** k * x);
  return s;
}

const LN_RHO = Math.LN2;
const LN_R = Math.log(1.3);
const A_BLK = aBlk(LN_RHO, LN_R);

// onset for a hypothetically scaled A_blk' = factor * A_blk
function onset(factor) {
  let lo = 0.1;
  let hi = 60;
  for (let i = 0; i < 200; i++) {
    const mid = (lo + hi) / 2;
    if (Nnum(mid) > factor * A_BLK) lo = mid;
    else hi = mid;
  }
  return (lo + hi) / 2;
}

// ---------------------------------------------------------------------------
// Self-executing assertions
// ---------------------------------------------------------------------------

export const IMP95316_ASSERTIONS = [
  {
    id: "imp95316-baseline-onset",
    description:
      "the onset N(xStar) = A_blk reproduces the imp-95252 baked literal " +
      "xStar = 15.981584 (r = 1.3) to 1e-4, and A_blk = 1.345e-11",
    holds: () => {
      const x = onset(1);
      if (Math.abs(x - 15.981584) > 1e-4) return false;
      return Math.abs(A_BLK - 1.344996021e-11) < 1e-9 * A_BLK;
    },
  },
  {
    id: "imp95316-elasticity-matches-leading-order",
    description:
      "measured local elasticity dxStar/d(ln A_blk) matches the closed-form " +
      "leading order 1/(-2 + 2/xStar) to 1e-3, confirming the onset is only " +
      "logarithmically sensitive to A_blk (magnitude ~0.53, well below 1)",
    holds: () => {
      const eps = 1e-4;
      const xp = onset(Math.exp(eps));
      const xm = onset(Math.exp(-eps));
      const measured = (xp - xm) / (2 * eps);
      const base = onset(1);
      const predicted = 1 / (-2 + 2 / base);
      if (Math.abs(measured - predicted) > 1e-3) return false;
      // log-log elasticity is tiny (weak coupling)
      const dlnln = (Math.log(xp) - Math.log(xm)) / (2 * eps);
      return Math.abs(dlnln) < 0.05 && Math.abs(measured) < 1;
    },
  },
  {
    id: "imp95316-exact-symbol-inf-gains-nothing",
    description:
      "using the exact symbol infimum (A_twin * 1.00000131, the RZ-TWIN " +
      "measured near-sharp ratio) instead of A_twin moves the onset by less " +
      "than 1e-5 depth units: the crude symbol bound is not the bottleneck",
    holds: () => {
      const fTwin = 1 + sechHalf(LN_R); // A_twin = fTwin * A_blk
      const gain = onset(fTwin * 1.00000131) - onset(fTwin);
      return Math.abs(gain) < 1e-5;
    },
  },
  {
    id: "imp95316-block-conv-slack-under-half-depth",
    description:
      "the only removable (non-symbol) slack is the block-norm conversion " +
      "factor 1 + sech(b/2) = 1.99146; dropping it (A_blk -> A_twin) improves " +
      "the onset by only ~0.368 depth units (15.981584 -> 15.613923)",
    holds: () => {
      const fTwin = 1 + sechHalf(LN_R);
      if (Math.abs(fTwin - 1.99145689) > 1e-6) return false;
      const gain = onset(1) - onset(fTwin);
      return gain > 0.3 && gain < 0.45;
    },
  },
  {
    id: "imp95316-eleven-orders-buy-little",
    description:
      "lifting A_blk by 11 orders of magnitude to O(1) only drops the onset " +
      "from 15.98 to ~1.1: the smallness of A_blk carries -(1/2)ln(1/A_blk) " +
      "= 12.52 depth units of the onset, logarithmically and unrecoverably",
    holds: () => {
      const xO1 = onset(1 / A_BLK);
      if (!(xO1 > 0.9 && xO1 < 1.4)) return false;
      const carried = -0.5 * Math.log(A_BLK);
      return Math.abs(carried - 12.51602) < 1e-3;
    },
  },
  {
    id: "imp95316-verdict-honesty",
    description:
      "the verdict carries the honest labels: A_blk NOT binding as slack, " +
      "Szegoe-ceiling sharp, assessment only, no bound change, NO QED, no refereed bound is changed",
    holds: () =>
      /NOT the binding factor/.test(
        IMP95316_SPLITRZ_ONSET_ABLK_ELASTICITY.verdict,
      ) &&
      /Szegoe/.test(IMP95316_SPLITRZ_ONSET_ABLK_ELASTICITY.verdict) &&
      /Assessment only/.test(
        IMP95316_SPLITRZ_ONSET_ABLK_ELASTICITY.verdict,
      ) &&
      /changes no bound/.test(
        IMP95316_SPLITRZ_ONSET_ABLK_ELASTICITY.verdict,
      ) &&
      /NO QED/.test(IMP95316_SPLITRZ_ONSET_ABLK_ELASTICITY.verdict) &&
      /refereed bound is changed/i.test(IMP95316_SPLITRZ_ONSET_ABLK_ELASTICITY.verdict),
  },
];

for (const a of IMP95316_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-95316-splitrz-onset-ablk-elasticity assertion failed: ${a.id}`,
    );
  }
}

export default IMP95316_SPLITRZ_ONSET_ABLK_ELASTICITY;
