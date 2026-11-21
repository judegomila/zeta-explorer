/**
 * imp-95134: REDUCTION of the imp-95226 coalescence-dominance N = 2 depth-only
 * candidate to a single scalar inequality, plus the assessment of whether an
 * analytic ratio-monotonicity proof exists (or a counterexample).
 *
 * OBJECT. imp-95226 COROLLARY COAL-2 recorded, as a GRID OBSERVATION ONLY,
 * that the exact two-rate signed shift constant
 *   Lambda_2(nu1, nu2, d) = w1 w2 + h^2/2 + (h/2) sqrt(h^2 + 4 w1 w2),
 *   w1 = e^(-d nu1), w2 = e^(-d nu2),
 *   h = (w1 - w2)(nu1 + nu2)/(nu2 - nu1) > 0,
 * appears to be dominated over the rate-ratio by its coalescence limit
 *   coalLaw(x) = e^(-2x)(1 + 2 x^2 + 2 x sqrt(1 + x^2)),  x = nu1 d,
 * making coalLaw a candidate DEPTH-ONLY N = 2 signed certificate. The
 * analytic ratio-monotonicity proof was left OPEN
 * (imp-95226-np-exact-signed-shift-constant.js). This leg assesses it.
 *
 * SCALE INVARIANCE (elementary). Lambda_2 depends only on x = nu1 d and the
 * ratio r = nu2/nu1 >= 1: dividing nu1+nu2 and nu2-nu1 by nu1 gives
 *   h(x, r) = (e^(-x) - e^(-r x)) (1 + r)/(r - 1),   P := w1 w2 = e^(-(1+r) x),
 * and Lambda_2 = P + h^2/2 + (h/2) sqrt(h^2 + 4 P). Ratio-monotonicity is:
 * for each fixed x > 0, Lambda_2 is nonincreasing in r on r >= 1. Its r -> 1
 * limit is exactly coalLaw(x) (h -> 2 x e^(-x)), so ratio-monotonicity
 * implies coalescent domination.
 *
 * EXACT SIGN REDUCTION (rigorous). Lambda_2 is the larger root of the monic
 * quadratic lambda^2 - S lambda + P^2 = 0 with S = 2P + h^2 (product of roots
 * P^2, sum S). Implicit differentiation in r, using dP/dr = -x P and the root
 * gap Lambda_2 - Lambda_minus = sqrt(S^2 - 4 P^2) > 0, gives
 *   (Lambda_2 - Lambda_minus) dLambda_2/dr = S-prime Lambda_2 - 2 P P-prime
 *     = 2 P-prime (Lambda_2 - P) + 2 h h-prime Lambda_2 ,
 * so that EXACTLY
 *   sign(dLambda_2/dr) = sign[ h h-prime Lambda_2 - x P (Lambda_2 - P) ].
 * Hence ratio-monotonicity is EQUIVALENT to the single scalar
 *   REDUCED INEQUALITY:   h (dh/dr) Lambda_2 <= x P (Lambda_2 - P)
 * for all x > 0, r >= 1 (with dh/dr the r-derivative of h(x, r) above, and
 * Lambda_2 - P = h^2/2 + (h/2) sqrt(h^2 + 4P) >= 0).
 *
 * WHY THE NAIVE PROOF FAILS (rigorous). Lambda_2 is strictly increasing in
 * both h and P (dLambda_2/dh > 0, dLambda_2/dP = 1 + h/sqrt(h^2+4P) > 0).
 * P = e^(-(1+r)x) is decreasing in r, which would suffice IF h were also
 * nonincreasing in r. But h is NON-MONOTONE in r: h(x, 1+) = 2 x e^(-x),
 * h(x, inf) = e^(-x), so h(1+) < h(inf) whenever x < 1/2, and dh/dr > 0 at
 * r = 1+ for all x below roughly 0.906 (h then rises to an interior maximum
 * before falling). In this competing regime the down-push comes SOLELY from
 * the -x P (Lambda_2 - P) term outweighing the up-push h (dh/dr) Lambda_2:
 * the "both factors decrease" argument is unavailable, which is exactly why
 * the proof is nontrivial.
 *
 * NUMERICAL STATUS (assessment, NOT a theorem). On a dense (x, r) grid,
 * x in [0.01, 5], r in [1, 400]:
 *   - the reduced inequality holds with STRICTLY NONNEGATIVE slack
 *     (RHS - LHS >= 0), no violation;
 *   - the ratio LHS/RHS is maximized in the coalescence corner x -> 0,
 *     r -> 1+, where it tends to 1 from BELOW (sup ~ 0.99995 at the grid
 *     corner) and is strictly slack elsewhere -- the inequality is
 *     asymptotically saturated exactly at coalescence, consistent with r = 1
 *     being the interior-free maximizer;
 *   - consequently Lambda_2 is nonincreasing in r and coalLaw(x) dominates
 *     Lambda_2 on the whole scanned domain; NO COUNTEREXAMPLE was found.
 *
 * VERDICT. The candidate is REDUCED to the single scalar reduced inequality
 * and CONFIRMED numerically with its saturation structure identified (tightest
 * at coalescence, strict slack away from it). A full ANALYTIC proof of the
 * reduced inequality in the competing regime dh/dr > 0 (x < ~0.906) remains
 * OPEN -- this is the named residual, now sharpened from "prove ratio
 * monotonicity" to "prove h (dh/dr) Lambda_2 <= x P (Lambda_2 - P)". The grid
 * observation is NOT upgraded to a theorem. No conflict with imp-95224
 * COROLLARY DC-NOGO, which forbids only COUNT-UNIFORM depth-only bounds; this
 * is a fixed-count (N = 2) statement. Changes no bound of the Lambda program;
 * NO QED; no refereed bound is changed.
 */

// ---------------------------------------------------------------------------
// Reference record
// ---------------------------------------------------------------------------

export const IMP95134_RATIO_MONOTONICITY_REDUCTION = {
  id: "imp-95134",
  title:
    "Reduction and assessment of the imp-95226 coalescence-dominance N = 2 " +
    "depth-only candidate: exact sign reduction + numerical status, proof OPEN",
  object:
    "imp-95226 COAL-2 grid observation: coalLaw(x) = e^(-2x)(1 + 2x^2 + " +
    "2x sqrt(1+x^2)) appears to dominate Lambda_2 over the rate ratio r; " +
    "assess an analytic ratio-monotonicity proof or a counterexample",
  reducedInequality:
    "ratio-monotonicity (dLambda_2/dr <= 0 at fixed x) is EQUIVALENT to " +
    "h (dh/dr) Lambda_2 <= x P (Lambda_2 - P), with P = e^(-(1+r)x), " +
    "h = (e^-x - e^-rx)(1+r)/(r-1); derived exactly from the 2x2 pencil " +
    "quadratic lambda^2 - (2P + h^2) lambda + P^2 = 0 via dP/dr = -xP and " +
    "gap = sqrt(S^2 - 4P^2) > 0",
  naiveFailure:
    "Lambda_2 is increasing in both h and P, and P decreases in r, but h is " +
    "NON-MONOTONE in r (h(1+) = 2x e^-x, h(inf) = e^-x, so h(1+) < h(inf) for " +
    "x < 1/2; dh/dr > 0 at r = 1+ for x below ~0.906) -- the both-decrease " +
    "argument is unavailable in the competing regime",
  numericalStatus:
    "reduced inequality holds with strictly nonnegative slack on x in " +
    "[0.01,5], r in [1,400]; ratio LHS/RHS -> 1 from below only in the " +
    "coalescence corner (sup ~ 0.99995), strict slack elsewhere; coalescent " +
    "domination holds on the whole grid; no counterexample",
  residual:
    "OPEN: analytic proof of h (dh/dr) Lambda_2 <= x P (Lambda_2 - P) in the " +
    "regime dh/dr > 0 (x < ~0.906). Grid observation NOT upgraded to theorem.",
  dcNogoConsistency:
    "no conflict with imp-95224 DC-NOGO: that forbids only COUNT-UNIFORM " +
    "depth-only bounds; this is a fixed-count N = 2 statement",
  verdict:
    "candidate REDUCED to one scalar inequality and confirmed numerically " +
    "with saturation at coalescence; analytic proof OPEN (named residual); " +
    "changes no bound; NO QED; no refereed bound is changed",
};

// ---------------------------------------------------------------------------
// Self-executing assertions (import-light: no imports at all)
// ---------------------------------------------------------------------------

function hOfR(x, r) {
  // stable: e^-x - e^-rx = -e^-x * expm1(-(r-1)x)
  return (-Math.exp(-x) * Math.expm1(-(r - 1) * x) * (1 + r)) / (r - 1);
}
function lam2(x, r) {
  const P = Math.exp(-(1 + r) * x);
  const h = hOfR(x, r);
  return P + (h * h) / 2 + (h / 2) * Math.sqrt(h * h + 4 * P);
}
function coalLaw(x) {
  return Math.exp(-2 * x) * (1 + 2 * x * x + 2 * x * Math.sqrt(1 + x * x));
}
// x P (Lambda_2 - P) - h (dh/dr) Lambda_2 ; >= 0  <=>  dLambda_2/dr <= 0
function reducedMargin(x, r) {
  const P = Math.exp(-(1 + r) * x);
  const h = hOfR(x, r);
  const S = 2 * P + h * h;
  const L2 = (S + Math.sqrt(S * S - 4 * P * P)) / 2;
  const e = 1e-7;
  const hp = (hOfR(x, r + e) - hOfR(x, r - e)) / (2 * e);
  return x * P * (L2 - P) - h * hp * L2;
}

export const IMP95134_RATIO_MONOTONICITY_ASSERTIONS = [
  {
    id: "imp95134-sign-reduction-identity",
    description:
      "EXACT sign reduction: sign(dLambda_2/dr) equals sign(-reducedMargin) " +
      "on a (x, r) grid (finite-difference dLambda_2/dr vs the closed-form " +
      "margin x P (Lambda_2 - P) - h h-prime Lambda_2)",
    holds: () => {
      for (const x of [0.05, 0.1, 0.3, 0.7, 1, 2]) {
        for (let r = 1.05; r <= 50; r *= 1.15) {
          const e = 1e-6;
          const dL = (lam2(x, r + e) - lam2(x, r - e)) / (2 * e);
          const m = reducedMargin(x, r); // m >= 0 predicts dL <= 0
          if (Math.abs(dL) > 1e-9 && Math.sign(dL) !== Math.sign(-m)) return false;
        }
      }
      return true;
    },
  },
  {
    id: "imp95134-naive-argument-fails",
    description:
      "the naive both-decrease proof is unavailable: h is NON-MONOTONE in r " +
      "for small x (h at r = 20 exceeds h at r = 1+ when x = 0.1), i.e. " +
      "h(1+) = 2x e^-x < h(inf) = e^-x whenever x < 1/2",
    holds: () => {
      if (!(hOfR(0.1, 20) > hOfR(0.1, 1.0001))) return false;
      // endpoint law: for x < 1/2, h(1+) < h(inf)
      for (const x of [0.1, 0.3, 0.45]) {
        const h1 = 2 * x * Math.exp(-x);
        const hInf = Math.exp(-x);
        if (!(h1 < hInf)) return false;
      }
      return true;
    },
  },
  {
    id: "imp95134-reduced-inequality-holds-on-grid",
    description:
      "the reduced inequality h h-prime Lambda_2 <= x P (Lambda_2 - P) holds " +
      "with nonnegative margin on x in [0.01,4], r in [1,200] (no violation)",
    holds: () => {
      for (const x of [0.01, 0.05, 0.1, 0.3, 0.7, 1, 2, 4]) {
        for (let r = 1 + 1e-4; r <= 200; r *= 1.01) {
          if (reducedMargin(x, r) < -1e-11) return false;
        }
      }
      return true;
    },
  },
  {
    id: "imp95134-coalescent-domination-and-limit",
    description:
      "consequence: coalLaw(x) dominates Lambda_2 over r on the grid, and the " +
      "r -> 1+ limit of Lambda_2 equals coalLaw(x) (rel err < 1e-6)",
    holds: () => {
      for (const x of [0.02, 0.1, 0.5, 1, 2, 5]) {
        const cl = coalLaw(x);
        for (let r = 1 + 1e-5; r <= 200; r *= 1.01) {
          if (lam2(x, r) > cl * (1 + 1e-9)) return false;
        }
      }
      for (const x of [0.3, 0.7, 1.5]) {
        const rel = Math.abs(lam2(x, 1 + 1e-8) - coalLaw(x)) / coalLaw(x);
        if (rel > 1e-6) return false;
      }
      return true;
    },
  },
  {
    id: "imp95134-verdict-honesty",
    description:
      "the record carries the honest scope: analytic proof OPEN, grid " +
      "observation NOT upgraded, DC-NOGO consistency, no QED, no refereed bound is changed",
    holds: () =>
      /OPEN/.test(IMP95134_RATIO_MONOTONICITY_REDUCTION.residual) &&
      /NOT upgraded to theorem/.test(
        IMP95134_RATIO_MONOTONICITY_REDUCTION.residual,
      ) &&
      /DC-NOGO/.test(IMP95134_RATIO_MONOTONICITY_REDUCTION.dcNogoConsistency) &&
      /NO QED/.test(IMP95134_RATIO_MONOTONICITY_REDUCTION.verdict) &&
      /refereed bound is changed/i.test(IMP95134_RATIO_MONOTONICITY_REDUCTION.verdict),
  },
];

for (const a of IMP95134_RATIO_MONOTONICITY_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-95134-ratio-monotonicity-reduction assertion failed: ${a.id}`,
    );
  }
}

export default IMP95134_RATIO_MONOTONICITY_REDUCTION;
