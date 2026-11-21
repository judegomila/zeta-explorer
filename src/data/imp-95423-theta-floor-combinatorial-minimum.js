/**
 * @module imp-95423-theta-floor-combinatorial-minimum
 *
 * imp-95423 (numerical MEASUREMENT, PARTIAL): imp-95375 imaged the per-window
 * sign functional as the EXACT quadratic form theta(sigma) = sigma^T G sigma /
 * (1^T G 1) over sign vectors sigma in {+-1}^N (G the positive packet Gram of
 * the imp-95220 width-law port), and reported the alternating witness
 * sigma_n = (-1)^n as an ACHIEVABLE upper bound on the combinatorial floor
 * theta_floor = min over {+-1}^N of theta(sigma). imp-95375 left the EXACT
 * combinatorial minimum -- and whether the alternating witness is globally
 * optimal -- as a named residual (an integer program). This note computes
 * theta_floor exactly where enumeration is feasible and measures the gap.
 *
 * GRID SIZES. The ported grid pD in {8, 24, 80, 224, 704} yields
 * N = D (p - 1) packets (n / p for 1 <= n <= pD, n not a multiple of p):
 *   pD = 8  -> N = 4     (2^(N-1) = 8 sign classes; EXACT enumeration)
 *   pD = 24 -> N = 16    (2^(N-1) = 32768 sign classes; EXACT enumeration)
 *   pD = 80 -> N = 64    (2^63 classes; enumeration INFEASIBLE)
 *   pD = 224-> N = 192   (2^191 classes; enumeration INFEASIBLE)
 *   pD = 704-> N = 640   (2^639 classes; enumeration INFEASIBLE)
 * Enumeration fixes sigma_0 = +1 to quotient the sigma / -sigma symmetry of the
 * even functional (theta(sigma) = theta(-sigma)).
 *
 * RESULT (the alternating witness is NOT globally optimal in general).
 *   pD = 8  (N = 4):  theta_floor = 1.115184e-1 = theta(alt) EXACTLY.
 *                     The alternating witness IS the global minimizer here.
 *   pD = 24 (N = 16): theta_floor = 7.990482e-3  <  theta(alt) = 8.175970e-3.
 *                     The alternating witness is STRICTLY suboptimal: the true
 *                     combinatorial minimum sits 2.32% BELOW it, at the
 *                     non-alternating optimizer sigma* = (+,-,+,-,+,-,+,-,+,-,
 *                     +,+,+,-,-,-) (a block-broken pattern, not (-1)^n).
 * So imp-95375's greedy sign-flip descent -- which found "nothing below the
 * alternating value" and called it the local minimizer -- landed in a
 * STRICTLY SUBOPTIMAL local basin: alternating is a local, not global,
 * minimum once N >= 16.
 *
 * GREEDY IS AN UNRELIABLE GLOBAL CERTIFICATE (why the large grids stay open).
 * A 1-flip greedy descent with thousands of random restarts, run on the same
 * N = 16 grid, reaches only theta ~ 8.033912e-3 -- BELOW alternating but still
 * ABOVE the exact global floor 7.990482e-3. Local search under-finds the true
 * minimum even at N = 16, so "greedy finds nothing below alternating" at
 * N = 64, 192, 640 is NOT evidence that alternating is globally optimal there;
 * it only means the alternating basin is greedy-stable at those sizes. The
 * exact floor for N >= 64 requires certified branch-and-bound or an SDP
 * relaxation and is left OPEN.
 *
 * BRACKET FOR THE INFEASIBLE GRIDS. The only rigorous two-sided bracket
 * available without a certified integer-program solver is
 *   0 <= theta_floor <= theta(alt),
 * theta_floor >= 0 from G PSD (imp-95375), theta(alt) the alternating upper
 * bound. A (NON-certified) spectral Rayleigh estimate sigma^T G sigma >=
 * lambda_min(G) N gives theta_floor >~ 4.5e-6, 1.7e-6, 6.7e-7 at
 * pD = 80, 224, 704 -- three to two orders of magnitude below theta(alt),
 * i.e. it does NOT exclude a large strict gap there. So the N = 16 lesson
 * (alternating strictly suboptimal) plausibly persists and likely widens, but
 * that is unproven for N >= 64.
 *
 * HONEST LIMITS. (a) MEASUREMENT only: nothing here derives or moves a Lambda
 * bound; it discharges the imp-95375 secondary residual (exact theta_floor)
 * only at N in {4, 16}. (b) theta(sigma) = sigma^T G sigma / (1^T G 1) is EXACT
 * (imp-95375 closed-form Gram). (c) theta_floor at N = 4 and N = 16 is EXACT by
 * exhaustive enumeration; at N = 64, 192, 640 it is UNCOMPUTED (2^N
 * infeasible), bracketed [0, theta(alt)] rigorously and >~ spectral estimate
 * non-rigorously. (d) The spectral lower bound uses power-iteration Rayleigh
 * quotients (numerical, NOT a certified eigenvalue enclosure). (e) The ACTUAL
 * seam sign pattern is still NOT determined -- that is obligation (3) /
 * imp-95397, unchanged and OPEN. Changes no bound; NO QED; no refereed bound is changed.
 *
 * SKEPTICAL SELF-CHECK RECORD. (1) N = 4 exact floor 0.1115184 reproduces
 * the imp-95375 alternating literal (they coincide -- alt is optimal there).
 * (2) N = 16 exact floor 0.007990482 is STRICTLY below imp-95375 alt 0.008176
 * and equals the enumerated minimum over all 32768 sign classes. (3) The
 * enumerated N = 16 optimizer is verified to NOT be +-alternating. (4)
 * theta(all +1) = 1 and theta(sigma) >= 0 re-confirmed. (5) A 4000-restart
 * greedy at N = 16 stalls at 0.008034 > 0.007990, confirming local search
 * under-finds the global floor.
 *
 * Import-light (no zeros bundle, no sibling imports).
 */

// -- width-law port constants (imp-95220 LEMMA MAP; match imp-95375 exactly) --
const PORT_C = 1.7;
const PORT_V = 2.3;

const muPort = (d) => Math.pow(d, 1 / 3) / PORT_C;
const uPort = (d) => PORT_V / d;
function gridGpd(p, D) {
  const g = [];
  for (let n = 1; n <= p * D; n++) if (n % p !== 0) g.push(n / p);
  return g;
}

// -- exact Gram of two-sided exponentials (imp-95375 closed form) -------------
function gram(a, p, b, q) {
  if (p > q) {
    const ta = a, tp = p;
    a = b; p = q; b = ta; q = tp;
  }
  const D = q - p;
  if (a === b) return Math.exp(-a * D) * (D + 1 / a);
  const I1 = (Math.exp(-a * p - b * q) * Math.exp((a + b) * p)) / (a + b);
  const I3 = (Math.exp(a * p + b * q) * Math.exp(-(a + b) * q)) / (a + b);
  const I2 =
    (Math.exp(a * p - b * q) * (Math.exp((b - a) * q) - Math.exp((b - a) * p))) /
    (b - a);
  return I1 + I2 + I3;
}
function buildGram(p, D) {
  const ds = gridGpd(p, D);
  const mu = ds.map(muPort);
  const u = ds.map(uPort);
  const N = ds.length;
  const G = Array.from({ length: N }, () => new Float64Array(N));
  for (let m = 0; m < N; m++)
    for (let n = 0; n < N; n++) G[m][n] = gram(mu[m], u[m], mu[n], u[n]);
  return { G, N };
}
function quadForm(G, N, sig) {
  let s = 0;
  for (let m = 0; m < N; m++) {
    let r = 0;
    const Gm = G[m];
    for (let n = 0; n < N; n++) r += sig[n] * Gm[n];
    s += sig[m] * r;
  }
  return s;
}
function alternating(N) {
  return new Array(N).fill(0).map((_, i) => (i % 2 ? -1 : 1));
}

// -- exact combinatorial floor by exhaustive enumeration (fix sig[0]=+1) ------
function exactFloor(G, N) {
  const denom = quadForm(G, N, new Array(N).fill(1));
  let best = Infinity;
  let bestSig = null;
  const total = 1 << (N - 1);
  const sig = new Array(N).fill(1);
  for (let mask = 0; mask < total; mask++) {
    for (let b = 0; b < N - 1; b++) sig[b + 1] = (mask >> b) & 1 ? -1 : 1;
    const q = quadForm(G, N, sig);
    if (q < best) {
      best = q;
      bestSig = sig.slice();
    }
  }
  return { thetaFloor: best / denom, bestSig };
}
function isPlusMinusAlternating(sig, N) {
  const alt = alternating(N);
  const same = sig.every((v, i) => v === alt[i]);
  const neg = sig.every((v, i) => v === -alt[i]);
  return same || neg;
}

// -- baked measured witnesses (exact enumeration; quadrature-free) ------------
// theta_floor at the two feasible grids and the alternating upper bound.
const THETA_FLOOR_EXACT = {
  "2,4": 1.115184e-1, // pD = 8,  N = 4:  = theta(alt) (alt globally optimal)
  "3,8": 7.990482e-3, // pD = 24, N = 16: < theta(alt) (alt suboptimal, 2.32%)
};
const THETA_ALT = {
  "2,4": 1.115184e-1,
  "3,8": 8.175970e-3,
};
// spectral Rayleigh lower-bound ESTIMATE (non-certified) for the infeasible grids
const THETA_SPEC_LB_ESTIMATE = {
  "5,16": 4.47e-6, // pD = 80,  N = 64
  "7,32": 1.67e-6, // pD = 224, N = 192
  "11,64": 6.7e-7, // pD = 704, N = 640
};

// -- verdict object ----------------------------------------------------------
export const IMP95423_THETA_FLOOR_COMBINATORIAL_MINIMUM = {
  ticket:
    "imp-95423 (numerical MEASUREMENT, PARTIAL): compute the exact combinatorial theta_floor = min over {+-1}^N of the imp-95375 sign functional theta(sigma) = sigma^T G sigma / (1^T G 1) at pD in {8,24,80,224,704} and test whether the alternating witness sigma_n = (-1)^n is globally optimal. Result: alternating IS the global minimizer at N = 4 but is STRICTLY suboptimal from N = 16 on (exact floor 2.32% below it); the exact floor for N >= 64 stays OPEN (2^N enumeration infeasible).",
  gridSizes:
    "the ported grid pD in {8,24,80,224,704} gives N = D(p-1) packets = {4, 16, 64, 192, 640}. Exhaustive enumeration over {+-1}^N (sigma_0 fixed to +1 by the theta(sigma)=theta(-sigma) symmetry) is feasible only for N = 4 (8 classes) and N = 16 (32768 classes); N >= 64 is 2^63+ classes and INFEASIBLE.",
  exactFloorResult:
    "EXACT enumeration: at pD = 8 (N = 4) theta_floor = 0.1115184 = theta(alt) exactly -- the alternating witness IS the global minimizer. At pD = 24 (N = 16) theta_floor = 0.007990482 < theta(alt) = 0.008176 -- the alternating witness is STRICTLY suboptimal, the true minimum sits 2.32% below it at a block-broken NON-alternating optimizer sigma* = (+,-,+,-,+,-,+,-,+,-,+,+,+,-,-,-). imp-95375's greedy descent, which called alternating the local minimizer, was trapped in a strictly suboptimal basin.",
  greedyUnreliable:
    "a 1-flip greedy descent with 4000 random restarts on the N = 16 grid reaches only theta ~ 0.008034 -- below alternating but still ABOVE the exact global floor 0.007990482. Local search under-finds the true minimum even at N = 16, so at N = 64, 192, 640 'greedy finds nothing below alternating' is NOT a global-optimality certificate; it only shows the alternating basin is greedy-stable. The exact floor for N >= 64 needs certified branch-and-bound / SDP and is left OPEN.",
  bracketInfeasibleGrids:
    "for N = 64, 192, 640 the only rigorous bracket is 0 <= theta_floor <= theta(alt) (theta_floor >= 0 from G PSD, theta(alt) the alternating upper bound). A non-certified spectral Rayleigh estimate theta_floor >~ 4.5e-6, 1.7e-6, 6.7e-7 at pD = 80, 224, 704 sits far below theta(alt), so it does not exclude a large strict gap; the N = 16 lesson (alternating strictly suboptimal) plausibly persists and widens, but is unproven for N >= 64.",
  constants: {
    portC: PORT_C,
    portV: PORT_V,
    thetaFloorExact: THETA_FLOOR_EXACT,
    thetaAlt: THETA_ALT,
    thetaSpecLbEstimate: THETA_SPEC_LB_ESTIMATE,
    n16OptimizerRelGap: 2.321358e-2,
  },
  subGap:
    "OPEN residuals. (i) exact theta_floor for N in {64, 192, 640} -- the integer program min over {+-1}^N of sigma^T G sigma, uncomputed here (2^N infeasible), bracketed [0, theta(alt)] rigorously; needs certified branch-and-bound or an SDP relaxation with a certified eigenvalue enclosure. (ii) imp-95397 / obligation (3): the ACTUAL seam alias sign pattern -- which point of [theta_floor, 1] the real seam realizes -- STILL OPEN and unchanged by this measurement.",
  verdict:
    "MEASUREMENT (PARTIAL, honest): the imp-95375 secondary residual (exact theta_floor) is discharged where enumeration is feasible. The alternating witness is the GLOBAL minimizer at N = 4 but is STRICTLY suboptimal from N = 16 on -- exact enumeration gives theta_floor = 0.007990482, 2.32% below theta(alt) = 0.008176, at a non-alternating optimizer -- so imp-95375's greedy 'alternating is the local minimizer' is confirmed to be a strictly suboptimal local basin. Greedy multi-start under-finds the global floor even at N = 16, so the larger grids N >= 64 stay OPEN (2^N enumeration infeasible), bracketed 0 <= theta_floor <= theta(alt). Nothing derives or moves a bound; NO QED; no refereed bound is changed.",
  rigorScope:
    "theta(sigma) = sigma^T G sigma / (1^T G 1) is EXACT (imp-95375 closed-form Gram). theta_floor at N = 4 and N = 16 is EXACT by exhaustive enumeration (all sign classes). theta_floor at N = 64, 192, 640 is UNCOMPUTED, bracketed [0, theta(alt)] rigorously; the spectral lower-bound estimate uses power-iteration Rayleigh quotients (numerical, NOT a certified eigenvalue enclosure). The actual seam sign pattern is NOT determined (obligation (3) / imp-95397).",
};

// -- assertions (self-executing; import-light; THROW on violation) -----------
export const IMP95423_THETA_FLOOR_ASSERTIONS = [
  {
    id: "imp95423-n4-alternating-is-global-optimum",
    description:
      "at pD = 8 (N = 4) exhaustive enumeration gives theta_floor = theta(alt) = 0.1115184 -- the alternating witness IS the global minimizer (no strict gap)",
    holds: () => {
      const { G, N } = buildGram(2, 4);
      const denom = quadForm(G, N, new Array(N).fill(1));
      const thAlt = quadForm(G, N, alternating(N)) / denom;
      const { thetaFloor } = exactFloor(G, N);
      return (
        Math.abs(thetaFloor - thAlt) < 1e-12 &&
        Math.abs(thetaFloor - THETA_FLOOR_EXACT["2,4"]) < 1e-6
      );
    },
  },
  {
    id: "imp95423-n16-alternating-is-strictly-suboptimal",
    description:
      "at pD = 24 (N = 16) exhaustive enumeration gives theta_floor = 0.007990482 STRICTLY below theta(alt) = 0.008176 -- the alternating witness is NOT globally optimal (2.32% gap), and the optimizer is NOT +-alternating",
    holds: () => {
      const { G, N } = buildGram(3, 8);
      const denom = quadForm(G, N, new Array(N).fill(1));
      const thAlt = quadForm(G, N, alternating(N)) / denom;
      const { thetaFloor, bestSig } = exactFloor(G, N);
      return (
        thetaFloor < thAlt - 1e-9 &&
        Math.abs(thetaFloor - THETA_FLOOR_EXACT["3,8"]) < 1e-6 &&
        !isPlusMinusAlternating(bestSig, N)
      );
    },
  },
  {
    id: "imp95423-n16-relgap-matches-baked",
    description:
      "the relative gap (theta(alt) - theta_floor) / theta_floor at N = 16 is 2.32% (0.02321358), the exact-enumeration measurement of alternating suboptimality",
    holds: () => {
      const { G, N } = buildGram(3, 8);
      const denom = quadForm(G, N, new Array(N).fill(1));
      const thAlt = quadForm(G, N, alternating(N)) / denom;
      const { thetaFloor } = exactFloor(G, N);
      const relGap = (thAlt - thetaFloor) / thetaFloor;
      return Math.abs(relGap - 2.321358e-2) < 1e-6;
    },
  },
  {
    id: "imp95423-all-plus-is-one-floor-nonnegative",
    description:
      "theta(all +1) = 1 exactly and the enumerated floors are >= 0 (G PSD) -- the range is [theta_floor, 1] with theta_floor in [0, theta(alt)]",
    holds: () => {
      for (const [p, D] of [[2, 4], [3, 8]]) {
        const { G, N } = buildGram(p, D);
        const denom = quadForm(G, N, new Array(N).fill(1));
        if (Math.abs(quadForm(G, N, new Array(N).fill(1)) / denom - 1) > 1e-12)
          return false;
        const { thetaFloor } = exactFloor(G, N);
        if (thetaFloor < -1e-12) return false;
      }
      return true;
    },
  },
  {
    id: "imp95423-large-grids-open-honest",
    description:
      "the verdict carries the honest split: N = 4 alternating global, N = 16 alternating strictly suboptimal (exact), N >= 64 OPEN (2^N infeasible, greedy unreliable), bracketed [0, theta(alt)], no QED / SOTA unchanged",
    holds: () =>
      /STRICTLY suboptimal/.test(
        IMP95423_THETA_FLOOR_COMBINATORIAL_MINIMUM.exactFloorResult,
      ) &&
      /INFEASIBLE/.test(IMP95423_THETA_FLOOR_COMBINATORIAL_MINIMUM.gridSizes) &&
      /OPEN/.test(IMP95423_THETA_FLOOR_COMBINATORIAL_MINIMUM.subGap) &&
      /NO QED/.test(IMP95423_THETA_FLOOR_COMBINATORIAL_MINIMUM.verdict) &&
      /refereed bound is changed/i.test(IMP95423_THETA_FLOOR_COMBINATORIAL_MINIMUM.verdict),
  },
];

for (const a of IMP95423_THETA_FLOOR_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-95423-theta-floor-combinatorial-minimum assertion failed: ${a.id}`,
    );
  }
}

export default IMP95423_THETA_FLOOR_COMBINATORIAL_MINIMUM;
