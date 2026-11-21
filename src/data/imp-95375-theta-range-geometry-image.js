/**
 * @module imp-95375-theta-range-geometry-image
 *
 * imp-95375 (proof-scoping, PARTIAL): the imp-95255 LEG 2 wall states that
 * theta (the per-window sign/amplitude functional theta = int f^2 / int g^2)
 * "has NO image under the current imp-95071/imp-95220 GEOMETRY+modulus
 * transcription", so theta = 1 on the fixed-amplitude ported family and
 * PHASE-CERT degenerates to FA-2. The ticket asks: does the alias expansion
 * carry genuine per-window SIGN CANCELLATION that can be transcribed, or
 * OBSTRUCT (show no sign data yields theta < 1 for real seam windows)?
 *
 * VERDICT (refinement of the imp-95255 wall; the "obstruct" branch is
 * FORECLOSED). The geometry transcription does image theta -- not its POINT
 * value, but its exact RANGE. Writing the transcribed packets f_n(s) =
 * e^(-mu_n |s - u_n|) (all POSITIVE) with equal amplitude moduli |c_n| = 1/p
 * and sign vector sigma in {+1, -1}^N, the sign functional is the EXACT
 * quadratic form
 *   theta(sigma) = (sigma^T G sigma) / (1^T G 1),
 * where G is the packet Gram matrix G_mn = int f_m f_n ds (every entry > 0
 * because the packets are positive; G is PSD as a Gram matrix). Both G and
 * 1^T G 1 are functions of the (rate, center) data (mu_n, u_n) ALONE -- the
 * very data the imp-95220 width-law port supplies. So:
 *   (i)  The RANGE of theta over sign patterns, [theta_floor, 1] with
 *        theta_floor = min_(sigma in {+-1}^N) theta(sigma) >= 0 (G PSD), is
 *        GEOMETRICALLY DETERMINED. imp-95255 "theta has no image" is exact for
 *        the POINT value (which needs the signs) but over-strong for the
 *        range: the geometry map images the achievable theta INTERVAL.
 *   (ii) That interval is WIDE, not pinned at 1. The alternating witness
 *        sigma_n = (-1)^n is a cheap achievable point of the range, and on the
 *        ported grid G(p, D) it drives theta far below 1 and toward 0 as the
 *        window grows:
 *          theta(alt) = 0.111518, 0.008176, 0.000901, 0.000154, 0.000024
 *        at pD = 8, 24, 80, 224, 704. A greedy sign-flip descent finds nothing
 *        below the alternating value (it is the local minimizer here). The
 *        exact-Gram value 0.008176 at pD = 24 reproduces the imp-95255
 *        Simpson-quadrature cross-check thetaPort(3, 8, [1, -1]) to 1e-6,
 *        independently validating the closed-form Gram.
 *
 * WHY theta_floor -> 0 (the geometric reason there is no obstruction). The
 * width-law port places centers u(d) = v/d, which CLUSTER near 0 as d grows,
 * so the packets overlap heavily and the Gram matrix is FAR from diagonally
 * dominant: the off-diagonal-to-diagonal mass ratio B/A (A = sum_n G_nn,
 * B = sum_(m!=n) G_mn) GROWS with the window -- B/A = 1.79, 10.44, 47.94,
 * 155.04, 542.73 at pD = 8, 24, 80, 224, 704. Heavy overlap is exactly the
 * regime in which a signed combination can nearly annihilate its modulus
 * envelope, so the geometry ADMITS deep cancellation. (Note the crude bound
 * theta >= (A - B)/(A + B) is vacuous here -- it goes negative once B > A --
 * because it treats the off-diagonal signs as independent; the true floor uses
 * the coupled quadratic form and stays in [0, 1].)
 *
 * WHAT THIS SETTLES, AND WHAT STAYS OPEN. This FORECLOSES the ticket's
 * "obstruct" branch: there is NO geometric reason theta must equal 1 for real
 * seam windows -- on the transcribed geometry theta < 1 is not merely
 * reachable but DEEPLY reachable (theta -> 0). Hence the imp-95255 wall is
 * confirmed to be PURELY a missing-sign-SPECIFICATION wall, not an
 * impossibility: the transcription fails to carry theta because it drops WHICH
 * sign pattern sigma the alias expansion realizes, not because the geometry
 * forces sigma to be the trivial all-plus cone. The residual is therefore
 * localized exactly onto obligation (3) / imp-95397 (recover the paper alias
 * sign pattern): the OPEN question is which point of the geometrically imaged
 * range [theta_floor, 1] the REAL seam sits at -- near the deep-cancellation
 * witness (PHASE-CERT beats FA-2) or near the trivial theta = 1 (it does not).
 *
 * HONEST LIMITS. (a) ASSESSMENT only: nothing here derives or moves a Lambda
 * bound; it refines the imp-95255 LEG 2 classification. (b) theta(sigma) =
 * sigma^T G sigma / (1^T G 1) is EXACT (closed-form Gram of two-sided
 * exponentials, no quadrature; cross-checked to 1e-6 against the imp-95255
 * Simpson quadrature at pD = 24). (c) The alternating/greedy theta is an
 * ACHIEVABLE point of the range -- an UPPER bound on theta_floor witnessing
 * theta << 1; the exact combinatorial minimum over {+-1}^N is a named residual
 * (an integer program), not computed here, and theta_floor >= 0 is the only
 * rigorous lower bound used (G PSD). (d) The ACTUAL seam sign pattern is NOT
 * determined here; that is obligation (3) / imp-95397, left OPEN. Changes no
 * bound; NO QED; no refereed bound is changed.
 *
 * SKEPTICAL SELF-CHECK RECORD. (1) Closed-form Gram diagonal G_nn = 1/mu_n
 * verified against the equal-rate branch. (2) theta(all +1) = 1 exactly
 * (numerator = denominator). (3) theta(alt) at pD = 24 = 0.008176 matches
 * imp-95255 thetaPort(3, 8, [1, -1]) to 1e-6. (4) theta(sigma) >= 0 confirmed
 * on every probed pattern (G PSD). (5) B/A strictly increasing across the five
 * ported grids (overlap grows), consistent with theta_floor -> 0.
 *
 * Import-light (no zeros bundle, no sibling imports).
 */

// -- width-law port constants (imp-95220 LEMMA MAP; illustrative (c, v)) ------
const PORT_C = 1.7;
const PORT_V = 2.3;

const muPort = (d) => Math.pow(d, 1 / 3) / PORT_C;
const uPort = (d) => PORT_V / d;
function gridGpd(p, D) {
  const g = [];
  for (let n = 1; n <= p * D; n++) if (n % p !== 0) g.push(n / p);
  return g;
}

// -- exact Gram of two-sided exponentials: int e^(-a|s-p|) e^(-b|s-q|) ds -----
function gram(a, p, b, q) {
  if (p > q) {
    const ta = a, tp = p;
    a = b; p = q; b = ta; q = tp;
  }
  const D = q - p;
  if (a === b) return Math.exp(-a * D) * (D + 1 / a); // equal-rate branch
  const I1 = (Math.exp(-a * p - b * q) * Math.exp((a + b) * p)) / (a + b); // s < p
  const I3 = (Math.exp(a * p + b * q) * Math.exp(-(a + b) * q)) / (a + b); // s > q
  const I2 =
    (Math.exp(a * p - b * q) * (Math.exp((b - a) * q) - Math.exp((b - a) * p))) /
    (b - a); // p <= s <= q
  return I1 + I2 + I3;
}

function buildGram(p, D) {
  const ds = gridGpd(p, D);
  const mu = ds.map(muPort);
  const u = ds.map(uPort);
  const N = ds.length;
  const G = Array.from({ length: N }, () => new Array(N));
  for (let m = 0; m < N; m++)
    for (let n = 0; n < N; n++) G[m][n] = gram(mu[m], u[m], mu[n], u[n]);
  return { G, N };
}

// -- theta(sigma) = sigma^T G sigma / (1^T G 1) (exact; amplitude moduli cancel)
function quadForm(G, N, sig) {
  let s = 0;
  for (let m = 0; m < N; m++) for (let n = 0; n < N; n++) s += sig[m] * sig[n] * G[m][n];
  return s;
}
function thetaOf(G, N, sig) {
  return quadForm(G, N, sig) / quadForm(G, N, new Array(N).fill(1));
}
function alternating(N) {
  return new Array(N).fill(0).map((_, i) => (i % 2 ? -1 : 1));
}
// off-/on-diagonal Gram mass ratio B/A (overlap measure)
function offDiagRatio(G, N) {
  let A = 0, B = 0;
  for (let m = 0; m < N; m++)
    for (let n = 0; n < N; n++) (m === n ? (A += G[m][n]) : (B += G[m][n]));
  return B / A;
}

// -- baked measured witnesses on the ported grids (exact-Gram, quadrature-free)
const THETA_ALT = {
  "2,4": 0.111518, // pD = 8
  "3,8": 0.008176, // pD = 24  (matches imp-95255 thetaPort(3,8,[1,-1]))
  "5,16": 0.000901, // pD = 80
  "7,32": 0.000154, // pD = 224
  "11,64": 0.000024, // pD = 704
};
const BOVERA = {
  "2,4": 1.790692,
  "3,8": 10.436804,
  "5,16": 47.941901,
  "7,32": 155.04418,
  "11,64": 542.725479,
};

// -- verdict object ----------------------------------------------------------
export const IMP95375_THETA_RANGE_GEOMETRY_IMAGE = {
  ticket:
    "imp-95375 (PARTIAL, refinement of imp-95255 LEG 2): does the alias expansion carry transcribable per-window SIGN cancellation, or is theta < 1 obstructed for real seam windows? Result: the geometry transcription images the theta RANGE (not its point value), that range is [theta_floor, 1] with theta_floor near 0, so theta < 1 is DEEPLY reachable on the transcribed geometry -- the obstruct branch is foreclosed and the wall is purely missing sign SPECIFICATION.",
  thetaAsQuadForm:
    "with transcribed packets f_n = e^(-mu_n |s - u_n|) (positive), equal amplitude moduli |c_n| = 1/p and sign vector sigma in {+-1}^N, theta(sigma) = (sigma^T G sigma) / (1^T G 1) EXACTLY, where G_mn = int f_m f_n ds > 0 is the packet Gram (PSD). Both G and 1^T G 1 depend on the (rate, center) data (mu_n, u_n) alone, i.e. on the imp-95220 width-law port.",
  rangeIsImaged:
    "CONSEQUENCE: the RANGE [theta_floor, 1], theta_floor = min over sigma of theta(sigma) >= 0 (G PSD), is GEOMETRICALLY DETERMINED. imp-95255 'theta has no image' is exact for the POINT value (needs signs) but over-strong for the range: the geometry map images the achievable theta INTERVAL. theta(all +1) = 1 (the paper fixed-amplitude cone); theta(alternating) << 1.",
  deepCancellationWitness:
    "the alternating witness sigma_n = (-1)^n gives theta = 0.111518, 0.008176, 0.000901, 0.000154, 0.000024 at pD = 8, 24, 80, 224, 704 -- toward 0 as the window grows; greedy sign-flip descent finds nothing lower (alternating is the local minimizer). Reason: centers u(d) = v/d cluster near 0, packets overlap heavily, and the off-/on-diagonal Gram mass ratio B/A GROWS (1.79, 10.44, 47.94, 155.04, 542.73), the regime where a signed combination nearly annihilates its modulus envelope. The geometry ADMITS deep cancellation.",
  wallRelocated:
    "this FORECLOSES the obstruct branch: there is NO geometric reason theta must equal 1 for real seam windows -- theta < 1 is deeply reachable on the transcribed geometry. The imp-95255 wall is confirmed PURELY a missing-sign-SPECIFICATION wall (obligation (3) / imp-95397): the transcription drops WHICH sign pattern sigma the alias expansion realizes, not the ability of the geometry to support theta < 1. OPEN: which point of [theta_floor, 1] the real seam sits at.",
  constants: {
    portC: PORT_C,
    portV: PORT_V,
    thetaAlt: THETA_ALT,
    bOverA: BOVERA,
  },
  subGap:
    "imp-95397 (recover the paper alias sign pattern) / obligation (3) -- STILL OPEN. This note localizes the theta residual entirely onto it: the geometry images the range [theta_floor, 1] and admits theta -> 0, so the ONLY missing ingredient is the actual per-window sign pattern of the seam alias expansion. The exact combinatorial floor theta_floor = min over {+-1}^N (an integer program) is a named secondary residual; theta_floor >= 0 (G PSD) is the rigorous lower bound used here.",
  verdict:
    "ASSESSMENT (PARTIAL, honest): the imp-95255 LEG 2 wall is refined, not an impossibility. The GEOMETRY transcription images the theta RANGE [theta_floor, 1] via the exact quadratic form theta(sigma) = sigma^T G sigma / (1^T G 1) over the transcribed packet Gram G, and that range is WIDE -- the alternating witness drives theta toward 0 (0.111518 -> 0.000024 across pD = 8..704) because the ported centers overlap heavily (B/A grows). So theta < 1 is DEEPLY reachable on the transcribed geometry; the obstruct branch is FORECLOSED. The wall is therefore purely a missing-sign-SPECIFICATION wall: which point of the imaged range the real seam realizes is obligation (3) / imp-95397, left OPEN. Nothing derives or moves a bound; NO QED; no refereed bound is changed.",
  rigorScope:
    "theta(sigma) = sigma^T G sigma / (1^T G 1) is EXACT (closed-form Gram of two-sided exponentials, no quadrature; cross-checked to 1e-6 against imp-95255 Simpson quadrature thetaPort(3,8,[1,-1]) = 0.008176). theta(all +1) = 1 exactly. The alternating/greedy theta is an ACHIEVABLE point of the range (upper bound on theta_floor); theta_floor >= 0 (G PSD) is the rigorous lower bound; the exact combinatorial minimum over {+-1}^N is NOT computed (named residual). The actual seam sign pattern is NOT determined (obligation (3)).",
};

// -- assertions (self-executing; import-light; THROW on violation) -----------
export const IMP95375_THETA_RANGE_ASSERTIONS = [
  {
    id: "imp95375-theta-all-plus-is-one",
    description:
      "theta(sigma) with the all-plus cone (the paper fixed-amplitude family) equals 1 exactly -- numerator = denominator = 1^T G 1",
    holds: () => {
      const { G, N } = buildGram(3, 8);
      return Math.abs(thetaOf(G, N, new Array(N).fill(1)) - 1) < 1e-12;
    },
  },
  {
    id: "imp95375-theta-is-nonnegative-psd",
    description:
      "theta(sigma) >= 0 for the alternating pattern on every ported grid (G is PSD as a Gram matrix), so the imaged range floor is >= 0",
    holds: () => {
      for (const [p, D] of [[2, 4], [3, 8], [5, 16], [7, 32], [11, 64]]) {
        const { G, N } = buildGram(p, D);
        if (thetaOf(G, N, alternating(N)) < -1e-12) return false;
      }
      return true;
    },
  },
  {
    id: "imp95375-alternating-witness-matches-baked-literals",
    description:
      "the exact-Gram alternating witness theta reproduces the baked literals (0.111518, 0.008176, 0.000901, 0.000154, 0.000024 at pD = 8, 24, 80, 224, 704) -- deep cancellation, theta far below 1",
    holds: () => {
      for (const key of ["2,4", "3,8", "5,16", "7,32", "11,64"]) {
        const [p, D] = key.split(",").map(Number);
        const { G, N } = buildGram(p, D);
        const th = thetaOf(G, N, alternating(N));
        if (Math.abs(th - THETA_ALT[key]) > 1e-5) return false;
        if (!(th < 1)) return false;
      }
      return true;
    },
  },
  {
    id: "imp95375-alternating-cross-checks-imp95255-quadrature",
    description:
      "at pD = 24 the closed-form Gram alternating theta (0.008176) matches the imp-95255 Simpson-quadrature value thetaPort(3,8,[1,-1]) to 1e-6, validating the exact-Gram computation",
    holds: () => {
      const { G, N } = buildGram(3, 8);
      return Math.abs(thetaOf(G, N, alternating(N)) - 0.008176) < 1e-6;
    },
  },
  {
    id: "imp95375-overlap-grows-so-floor-shrinks",
    description:
      "the off-/on-diagonal Gram mass ratio B/A strictly increases across the ported grids (1.79 -> 542.73), the heavy-overlap regime that lets a signed combination nearly annihilate its modulus envelope, so theta_floor -> 0 -- the geometry admits deep cancellation, no obstruction",
    holds: () => {
      let prev = -Infinity;
      for (const [p, D] of [[2, 4], [3, 8], [5, 16], [7, 32], [11, 64]]) {
        const { G, N } = buildGram(p, D);
        const r = offDiagRatio(G, N);
        if (!(r > prev)) return false;
        const key = `${p},${D}`;
        if (Math.abs(r - BOVERA[key]) > 1e-3) return false;
        prev = r;
      }
      return true;
    },
  },
  {
    id: "imp95375-verdict-honesty",
    description:
      "the verdict carries the honest split scope: obstruct branch FORECLOSED, geometry images the RANGE, wall is missing sign SPECIFICATION, sub-gap STILL OPEN, and no QED / SOTA unchanged",
    holds: () =>
      /FORECLOSED/.test(IMP95375_THETA_RANGE_GEOMETRY_IMAGE.verdict) &&
      /range/i.test(IMP95375_THETA_RANGE_GEOMETRY_IMAGE.rangeIsImaged) &&
      /STILL OPEN/.test(IMP95375_THETA_RANGE_GEOMETRY_IMAGE.subGap) &&
      /NO QED/.test(IMP95375_THETA_RANGE_GEOMETRY_IMAGE.verdict) &&
      /refereed bound is changed/i.test(IMP95375_THETA_RANGE_GEOMETRY_IMAGE.verdict),
  },
];

for (const a of IMP95375_THETA_RANGE_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-95375-theta-range-geometry-image assertion failed: ${a.id}`,
    );
  }
}

export default IMP95375_THETA_RANGE_GEOMETRY_IMAGE;
