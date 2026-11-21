/**
 * @module imp-97117-debruijn-flow-tpos-mirror-count-assessment
 *
 * imp-97117 (proof / assessment): can a t > 0 de Bruijn-flow mirror-count (rather
 * than the t = 0-proxy rigid lattice of imp-97080 / imp-97101) supply the missing
 * uniform-in-t lower bound M >= p_req = 4.3743 at the binding y0 = 0.165 window --
 * i.e. can it breach the NS-RIGID wall (residual (c) of imp-97101 / imp-97080)?
 *
 * CONTEXT. The conditional theorem B1 of rh-bridge-mirror-descent-2026-09-25
 * needs a topmost-within-2 nonreal zero of H_t at y0 = 0.165 to receive a mirror
 * pull M >= p_req = 4.3743, UNIFORMLY over t in (0, t0] (t0 = 0.1314) and all x.
 * imp-97080 / imp-97101 measured the neutral rigid-lattice Palm mirror-count only
 * on the t = 0-proxy lattice (spacing s = 2 pi / ln N), found the binding seam
 * window (ln N = 13.446) is 1.73x short, and reaching parity is a HEIGHT effect
 * (mirror mean ~ ln N / 2), not a relaxation at y0. Residual (c) / the NS-RIGID
 * wall: no finite-height t = 0-proxy count gives a uniform-in-t, all-x lower bound.
 *
 * THE PROPOSED LEVER. The winding-thread result (imp-34813) established that the
 * repo Gaussian-convolution ladder is EXACT de Bruijn flow: convolving H_0 with a
 * Gaussian of width sqrt(2 tau) is the Fourier multiplier e^{-tau u^2}, i.e.
 * H_{-tau}. So the natural idea is to compute the mirror-count directly on the
 * FLOWED zero configuration H_t at the y0 window, rather than on the t = 0 lattice.
 * This module ASSESSES whether that helps.
 *
 * FINDING 1 -- THE CONVOLUTION INSTRUMENT COVERS ONLY t < 0, THE WRONG SIGN.
 *   The de Bruijn family is H_t(x) = int e^{t u^2} Phi(u) cos(x u) du. Gaussian
 *   convolution supplies the multiplier e^{-tau u^2}, which equals e^{t u^2} only
 *   for t = -tau <= 0. The mirror hypothesis binds at t > 0, whose multiplier
 *   e^{+t u^2} GROWS WITHOUT BOUND in u (measured at t0 = 0.1314: e^{t u^2} for
 *   u = 1..4 is 1.14, 1.69, 3.26, 8.19 -- versus the bounded t < 0 branch 0.877,
 *   0.591, 0.306, 0.122 <= 1). The e^{+t u^2} branch is an ill-posed inverse-heat
 *   (anti-diffusion) multiplier, NOT a smoothing convolution. So the Gaussian-
 *   convolution instrument is UNAVAILABLE in the binding direction; only the exact
 *   de Bruijn integral (the imp-34813 offline collision-meter, feasible because
 *   Phi decays doubly-exponentially) reaches t > 0, and only POINTWISE at finite
 *   height and finite t-samples.
 *
 * FINDING 2 -- THE t > 0 FLOW MOVES THE COUNT THE WRONG WAY (Dyson repulsion).
 *   Along increasing de Bruijn time the repulsive Dyson dynamics SPREAD the
 *   spectrum: min gaps grow (imp-34813 experiment: minGap 3.54 at t = 0 rising
 *   with t >= 0). The neutral Palm mirror-count is strictly DECREASING in the
 *   local spacing s (each kernel term 2*[2y/(D^2 + 4y^2)] and the atan tail 2/s
 *   shrink as s grows). Measured at the seam (y0 = 0.165): count 2.529 at s, but
 *   1.812 at 1.2 s (spread) and 3.750 at 0.8 s (compressed). A t > 0 flow spreads
 *   the local spacing, so a t > 0 flow-count at the fixed y0 window is <= the
 *   t = 0-proxy count that is ALREADY 1.73x short -- it makes the deficit WORSE,
 *   not better. (The t > 0 flow does land new REAL zeros, but that raises the
 *   real-zero total, not the local nonreal-neighbour pull at the y0 window.)
 *
 * FINDING 3 -- UNIFORMITY IS STILL MISSING FOR THE SAME REASON.
 *   Even granting a pointwise exact t > 0 integral at the y0 window, it stays a
 *   finite-height, finite-t-sample MEASUREMENT. The hypothesis needs a bound
 *   uniform over the CONTINUUM t in (0, t0] and all x, on a zero family that (for
 *   t > 0) carries NO Euler product / arithmetic structure to anchor uniformity.
 *   Switching the count from the t = 0 lattice to a t > 0 flow relocates -- but
 *   does not remove -- the wall: the missing ingredient is uniform-in-t control
 *   over a continuum on an arithmetic-free zero family, which no finite-height
 *   pointwise instrument (lattice OR exact-flow) supplies.
 *
 * VERDICT. NO: a t > 0 de Bruijn-flow mirror-count does not breach the NS-RIGID
 * wall. The only well-posed convolution direction (t < 0) is the opposite of the
 * binding one; the exact-flow meter reaches t > 0 only pointwise; the t > 0 flow
 * spreads the spectrum and REDUCES the local mirror count; and uniformity over
 * t in (0, t0] on an Euler-product-free family remains unsupplied. Precise
 * remaining obstruction (sharpened NS-RIGID wall): uniform-in-t, all-x lower bound
 * on the mirror pull at a fixed spatial window over the continuum t in (0, t0],
 * with no arithmetic input and only pointwise finite-height instruments. This is
 * an assessment only: no Lambda bound follows, no refereed bound is changed, RH
 * open, NO QED.
 *
 * @see imp-97101-palm-mirror-parity-crossing-ladder.js (t = 0-proxy ladder, residual (c))
 * @see imp-97080-palm-mirror-baseline-vs-preq-measurement.js (two-height anchor, p_req)
 * @see imp-34813-winding-monotonicity-rigor.js (Gaussian conv = H_{-tau}; exact-flow meter)
 * @see rh-bridge-mirror-descent-2026-09-25.js (theorem B1, p_req, C1 Palm baseline)
 *
 * Import-free; helpers re-derived identically to imp-97101 and cross-checked
 * against its seam anchor (2.5288) and p_req (4.37426).
 */

const T0 = 0.1314;
const Y0 = 0.165;
const N_SEAM = 690988;
const LN_SEAM = Math.log(N_SEAM); // 13.4459
const P_REQ_EXPECTED = 4.37426;

// lane-audit descent time for a constant pull p: int_{y0}^1 Y/(1 + pY) dY
function tNeeded(p, y0) {
  return p === 0
    ? (1 - y0 * y0) / 2
    : (1 - y0) / p - (Math.log(1 + p) - Math.log(1 + p * y0)) / (p * p);
}
// p_req = the constant pull at which the integral condition holds with equality
function pRequired(t0, y0) {
  let lo = 1e-9, hi = 1e4;
  for (let i = 0; i < 200; i++) {
    const m = (lo + hi) / 2;
    if (tNeeded(m, y0) > t0) lo = m; else hi = m;
  }
  return hi;
}
// neutral rigid-lattice Palm mirror count parametrised directly by spacing s,
// conditioning pair excluded, mirror kernel 2*[2y/(D^2 + 4y^2)] both sides, exact
// atan tail (identical to imp-97101 palmMirrorCount with s substituted for 2pi/lnN)
function palmMirrorCountAtSpacing(y, s, slots) {
  const off = slots === 2 ? 1.5 : 1; // first surviving neighbour at off*s
  const K = 20000;
  let acc = 0;
  for (let k = 0; k <= K; k++) {
    const D = (k + off) * s;
    acc += (2 * 2 * y) / (D * D + 4 * y * y);
  }
  acc += (2 / s) * (Math.PI / 2 - Math.atan(((K + 0.5 + off) * s) / (2 * y)));
  return acc;
}
// de Bruijn multiplier for time t at frequency u: H_t = int e^{t u^2} Phi cos(x u) du
function deBruijnMultiplier(t, u) {
  return Math.exp(t * u * u);
}

const P_REQ = pRequired(T0, Y0); // 4.37426
const S_SEAM = (2 * Math.PI) / LN_SEAM;

// FINDING 1 -- multiplier grows unboundedly for t > 0, bounded for t < 0
const MULT_TPOS = [1, 2, 3, 4].map((u) => deBruijnMultiplier(T0, u)); // grows
const MULT_TNEG = [1, 2, 3, 4].map((u) => deBruijnMultiplier(-T0, u)); // <= 1

// FINDING 2 -- count strictly decreasing in spacing: spread (t > 0) lowers it
const COUNT_SEAM = palmMirrorCountAtSpacing(Y0, S_SEAM, 2); // 2.5288
const COUNT_SPREAD = palmMirrorCountAtSpacing(Y0, 1.2 * S_SEAM, 2); // 1.8117
const COUNT_COMPRESS = palmMirrorCountAtSpacing(Y0, 0.8 * S_SEAM, 2); // 3.7499

export const IMP97117_ASSESSMENT = Object.freeze({
  id: 'imp-97117',
  date: '2026-09-25',
  workingRow: Object.freeze({ t0: T0, y0: Y0 }),
  pReq: P_REQ, // 4.37426
  finding1: Object.freeze({
    claim:
      'Gaussian convolution = exact H_{-tau} (multiplier e^{-tau u^2}); it covers ' +
      'ONLY t < 0. The mirror hypothesis binds at t > 0, whose multiplier e^{+t u^2} ' +
      'grows without bound in u (ill-posed inverse-heat, not a smoothing ' +
      'convolution). Only the exact de Bruijn integral reaches t > 0, pointwise.',
    multiplierTpos: Object.freeze(MULT_TPOS), // [1.14, 1.69, 3.26, 8.19] grows
    multiplierTneg: Object.freeze(MULT_TNEG), // [0.877, 0.591, 0.306, 0.122] <= 1
  }),
  finding2: Object.freeze({
    claim:
      'The t > 0 flow spreads the spectrum (Dyson repulsion, growing gaps). The ' +
      'Palm mirror-count is strictly decreasing in spacing, so a t > 0 flow-count ' +
      'at the fixed y0 window is <= the t = 0-proxy count, which is already 1.73x ' +
      'short -- the flow makes the deficit worse, not better.',
    countSeam: COUNT_SEAM, // 2.5288 (spacing s)
    countSpread: COUNT_SPREAD, // 1.8117 (1.2 s -- repulsion)
    countCompress: COUNT_COMPRESS, // 3.7499 (0.8 s)
    surplusSeam: P_REQ / COUNT_SEAM, // 1.7298x short at the binding seam
  }),
  finding3: Object.freeze({
    claim:
      'Even a pointwise exact t > 0 integral stays a finite-height, finite-t-sample ' +
      'measurement. Uniformity over the continuum t in (0, t0] and all x, on a zero ' +
      'family with no Euler product for t > 0, is unsupplied by any finite-height ' +
      'instrument (lattice OR exact-flow). The wall is relocated, not removed.',
  }),
  breachesNsRigidWall: false,
  remainingObstruction:
    'Uniform-in-t, all-x lower bound on the mirror pull at a fixed spatial window ' +
    'over the continuum t in (0, t0], with no arithmetic (Euler-product) input and ' +
    'only pointwise finite-height instruments available -- the sharpened NS-RIGID wall.',
  verdict:
    'NO: a t > 0 de Bruijn-flow mirror-count does not breach the NS-RIGID wall. ' +
    'The only well-posed convolution direction (t < 0, multiplier e^{-tau u^2}) is ' +
    'the OPPOSITE of the binding t > 0 direction (multiplier e^{+t u^2}, unbounded, ' +
    'ill-posed inverse-heat); the exact-flow meter reaches t > 0 only pointwise at ' +
    'finite height; the t > 0 flow spreads the spectrum and REDUCES the local ' +
    'mirror count (2.529 -> 1.812 at 1.2x spacing) below the already-1.73x-short ' +
    't = 0 proxy; and uniformity over t in (0, t0] on an Euler-product-free family ' +
    'stays unsupplied. Assessment only: no Lambda bound follows, no Euler product ' +
    'for t > 0, no refereed bound is changed, RH open. NO QED.',
  anyBoundMoved: false,
});

export default IMP97117_ASSESSMENT;

const near = (a, b, tol) => Math.abs(a - b) <= tol;

// -- Tripwire assertions ------------------------------------------------------
export const IMP97117_ASSESSMENT_ASSERTIONS = [
  {
    id: 'imp97117-preq-and-seam-anchor-reproduced',
    why: 'p_req and the imp-97080 / imp-97101 neutral Palm seam anchor (2.5288) must ' +
      'reproduce exactly from the re-derived spacing-parametrised helper.',
    holds: () =>
      near(P_REQ, P_REQ_EXPECTED, 5e-4) &&
      near(COUNT_SEAM, 2.5288, 5e-4),
  },
  {
    id: 'imp97117-tpos-multiplier-unbounded-tneg-bounded',
    why: 'FINDING 1: the t > 0 de Bruijn multiplier e^{+t u^2} grows without bound in ' +
      'u (ill-posed), while the t < 0 (Gaussian-convolution) multiplier stays <= 1.',
    holds: () =>
      MULT_TPOS.every((v, i) => i === 0 || v > MULT_TPOS[i - 1]) &&
      MULT_TPOS[MULT_TPOS.length - 1] > 5 &&
      MULT_TNEG.every((v) => v <= 1) &&
      MULT_TNEG.every((v, i) => i === 0 || v < MULT_TNEG[i - 1]),
  },
  {
    id: 'imp97117-count-decreasing-in-spacing',
    why: 'FINDING 2: the mirror count is strictly decreasing in spacing, so a t > 0 ' +
      'flow (spectral spread) lowers the count below the already-short t = 0 proxy.',
    holds: () =>
      COUNT_SPREAD < COUNT_SEAM &&
      COUNT_SEAM < COUNT_COMPRESS &&
      P_REQ / COUNT_SEAM > 1 &&
      COUNT_SPREAD < P_REQ,
  },
  {
    id: 'imp97117-honesty-gate-no-qed',
    why: 'assessment only: wall not breached, no bound moved, no Euler product for ' +
      't > 0, no-refereed-bound-change line and NO QED present.',
    holds: () =>
      IMP97117_ASSESSMENT.breachesNsRigidWall === false &&
      IMP97117_ASSESSMENT.anyBoundMoved === false &&
      /no Euler product/i.test(IMP97117_ASSESSMENT.verdict) &&
      /no Lambda bound follows/i.test(IMP97117_ASSESSMENT.verdict) &&
      /refereed bound is changed/i.test(IMP97117_ASSESSMENT.verdict) &&
      /RH open/.test(IMP97117_ASSESSMENT.verdict) &&
      /NO QED/.test(IMP97117_ASSESSMENT.verdict),
  },
];

for (const assertion of IMP97117_ASSESSMENT_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(
      `imp-97117-debruijn-flow-tpos-mirror-count-assessment assertion failed: ${assertion.id}`,
    );
  }
}
