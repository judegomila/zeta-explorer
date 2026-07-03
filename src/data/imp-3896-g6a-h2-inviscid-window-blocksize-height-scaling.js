/**
 * @module imp-3896-g6a-h2-inviscid-window-blocksize-height-scaling
 *
 * imp-3896 (numerical, frontier-direction): imp-3872 P3 measured the finite-N viscosity fraction
 *   visc(y_star) = |m_zz| / |2 m m_z|
 * of the imp-3642 attractive Calogero-Moser resolvent m(z, s) = sum_k 1/(z - x_k(s)) SHRINKING
 * ~500x across the coarse-graining sweep y_star / d = 2 -> 8 (2.27e-1 -> 2.43e-2 -> 4.37e-4), but
 * flagged that beyond ~8 d the FINITE block edge (M = 161) reintroduces spurious curvature, so the
 * clean inviscid window was only y_star / d in [2, 8]. This module MEASURES two things imp-3872 left
 * open, to size the true hydrodynamic separation of scales (measurement only, NOT the H2 certificate):
 *
 *   (Q1) HOW THE CLEAN WINDOW WIDENS WITH BLOCK SIZE M > 161.
 *        At the imp-3642 anchor height (log gamma = 9.1981, spacing d = 2 pi / log(gamma / 2 pi)) the
 *        window UPPER EDGE is the coarse-graining multiplier mult = y_star / d at which visc stops
 *        shrinking and the finite-block curvature takes over -- i.e. argmin_mult visc(mult * d). As the
 *        block widens the finite edge recedes (its half-width is M d / 2), so the clean window widens:
 *          M = 161  -> edge  8,  visc floor 4.37e-4   (reproduces the imp-3872 [2, 8] window)
 *          M = 321  -> edge 10,  visc floor 1.27e-4
 *          M = 641  -> edge 11,  visc floor 3.52e-5
 *          M = 1281 -> edge 13,  visc floor 1.05e-5
 *        The window widens MONOTONICALLY and the clean floor deepens ~40x over 8x more particles -- BUT
 *        only LOGARITHMICALLY: doubling M lifts the edge by ~1.5 d, and edge / (M/2) FALLS from 9.9% to
 *        2.0%, so the block edge recedes far slower than the block grows. Brute block-size growth CANNOT
 *        reach the microscopic y -> 0 continuum; the finite edge is the binding constraint on the
 *        inviscid window and it recedes only ~log M. This sizes the true separation of scales as
 *        logarithmic, not algebraic, in the particle count.
 *
 *   (Q2) WHETHER THE ~500x SHRINKAGE LAW PERSISTS AT HEIGHTS BEYOND THE LADDER (log gamma > 20.86).
 *        The 2 d -> 8 d shrinkage ratio r = visc(2 d) / visc(8 d) is measured at the anchor, at the
 *        imp-3642 crossover (log gamma = 20.8576) and at four heights BEYOND it (log gamma = 22, 25, 28,
 *        32). It is r = 518.2x at EVERY height, IDENTICAL to machine precision. This is not a coincidence
 *        of the extra heights: at the s = 0 seed the block is an EXACT rescaling by d (base and jitter
 *        both proportional to d), so m ~ 1/d, m_z ~ 1/d^2, m_zz ~ 1/d^3 and the dimensionless ratio
 *        visc = |m_zz| / |2 m m_z| depends ONLY on the coarse-graining multiplier y_star / d, NOT on the
 *        absolute scale gamma. So the ~500x law is SCALE-FREE and trivially persists at all heights.
 *        HONEST CAVEAT: this height-invariance is a consequence of s = 0 self-similarity, so probing
 *        "beyond the ladder" at s = 0 adds NO independent evidence -- any genuine height dependence lives
 *        only in the RK4-evolved (s > 0) flow, which imp-3872 already sampled across the ladder.
 *
 * WHAT IS MEASURED (all at the s = 0 seed slice; the viscosity fraction needs only m, m_z, m_zz)
 * ---------------------------------------------------------------------------------------------
 * Reusing the imp-3872 / imp-3642 mesoscopic seed (block of M at spacing d, small deterministic jitter)
 * and the identical resolvent field m(z) = sum_k 1/(z - x_k), m_z = -sum f_k^2, m_zz = 2 sum f_k^3 with
 * f_k = 1/(z - x_k), averaging visc over the same x-grid [-3 d, 3 d] step d/2 that imp-3872 used:
 *   - windowUpperEdge(log gamma, M): argmin over integer multipliers mult in [2, 20] of visc(mult * d).
 *   - shrinkageRatio(log gamma): visc(2 d) / visc(8 d) at the given height.
 *
 * VERDICT OF THE MEASUREMENT
 * --------------------------
 * The imp-3872 clean inviscid window y_star / d in [2, 8] WIDENS with block size but only LOGARITHMICALLY
 * (edge 8 -> 13 as M goes 161 -> 1281, edge / half-width falling 9.9% -> 2.0%), so the finite block edge
 * caps the hydrodynamic separation of scales at ~log M and cannot be pushed to the microscopic continuum
 * by particle count alone. The ~500x (2 d -> 8 d) shrinkage law is exactly SCALE-FREE at the s = 0 seed,
 * so it persists identically at every height beyond the ladder -- but for that same reason the extra
 * heights add no independent evidence at s = 0. This is a scale-sizing MEASUREMENT, NOT a certificate: it
 * does not widen the window to y -> 0, does not certify the m_zz -> 0 vanishing viscosity, and does not
 * write H2. So H2 stays UNWRITTEN as a certificate, the K4 route stays WHOLLY NEW (consistent with
 * imp-3714 / imp-3727 / imp-3846 / imp-3872 / imp-3891), and G6a_shock_lipschitz stays OPEN. Measurement /
 * scoping only; no positivity, no bridge closure, no RH claim, NO QED. imp-3066 off-diagonal
 * endpoint-Hankel K_a >= 0 positivity UNTOUCHED. Platt-Trudgian Lambda <= 0.2 remains the rigorous SOTA.
 *
 * @see imp-3872-g6a-h2-discrete-flux-convexity-probe (the [2, 8] window and ~500x shrinkage this extends)
 * @see imp-3891-g6a-h2-continuum-inviscid-burgers-meanfield-scoping (H2a written, H2b mean-field OPEN)
 * @see imp-3642-sigma-crossover-tc-direct-dyson-crosscheck (the attractive-CM seed, spacing and block reused)
 * @see lambda-roadmap (Step 4 Polymath15 bridge, open sub-gap G6a_shock_lipschitz)
 */

const TWO_PI = 2 * Math.PI;
const LOG_ANCHOR = 9.1981; // imp-3642 anchor log gamma_{N*}
const LOG_CROSSOVER = 20.8576; // imp-3642 crossover log gamma_{N_x}

// minimal complex arithmetic (two-element [re, im] tuples), identical to imp-3872
const cadd = (a, b) => [a[0] + b[0], a[1] + b[1]];
const csub = (a, b) => [a[0] - b[0], a[1] - b[1]];
const cmul = (a, b) => [a[0] * b[0] - a[1] * b[1], a[0] * b[1] + a[1] * b[0]];
const cinv = (a) => {
  const dd = a[0] * a[0] + a[1] * a[1];
  return [a[0] / dd, -a[1] / dd];
};
const cabs = (a) => Math.hypot(a[0], a[1]);

// locally-uniform mesoscopic seed (imp-3642 / imp-3872 convention: spacing d, small deterministic jitter)
function seedBlock(d, M) {
  const xs = new Array(M);
  for (let k = 0; k < M; k++) {
    const base = (k - (M - 1) / 2) * d;
    const jitter = 0.15 * d * Math.sin(2.4 * k) + 0.07 * d * Math.cos(5.1 * k);
    xs[k] = base + jitter;
  }
  return xs;
}

// resolvent field m and its analytic z-derivatives at complex z (s = 0 slice; velocities not needed
// for the viscosity fraction). m = sum f_k, m_z = -sum f_k^2, m_zz = 2 sum f_k^3, f_k = 1/(z - x_k).
function fieldAt(xs, z) {
  let m = [0, 0], mz = [0, 0], mzz = [0, 0];
  for (let k = 0; k < xs.length; k++) {
    const f = cinv(csub(z, [xs[k], 0]));
    const f2 = cmul(f, f);
    const f3 = cmul(f2, f);
    m = cadd(m, f);
    mz = csub(mz, f2);
    mzz = cadd(mzz, cmul([2, 0], f3));
  }
  return { m, mz, mzz };
}

// mean finite-N viscosity fraction |m_zz| / |2 m m_z| over the imp-3872 x-grid at strip y = mult * d.
function viscFracMean(xs, d, mult) {
  const y = mult * d;
  let sum = 0;
  let count = 0;
  for (let x = -3 * d; x <= 3 * d + 1e-12; x += d / 2) {
    const { m, mz, mzz } = fieldAt(xs, [x, y]);
    sum += cabs(mzz) / (2 * cabs(cmul(m, mz)) + 1e-300);
    count += 1;
  }
  return sum / count;
}

const dOf = (logGamma) => 1 / (Math.log(Math.exp(logGamma) / TWO_PI) / TWO_PI);

// integer coarse-graining multipliers swept to locate the clean-window upper edge (argmin visc).
const EDGE_MULTS = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 18, 20];

// (Q1) upper edge of the clean inviscid window at one height and block size: the multiplier at which
// visc stops shrinking (argmin), plus the visc floor there.
function windowUpperEdge(logGamma, M) {
  const d = dOf(logGamma);
  const xs = seedBlock(d, M);
  let edge = EDGE_MULTS[0];
  let viscMin = Infinity;
  for (const mult of EDGE_MULTS) {
    const v = viscFracMean(xs, d, mult);
    if (v < viscMin) {
      viscMin = v;
      edge = mult;
    }
  }
  return { M, edge, viscMin, halfWidthD: M / 2, edgeOverHalfWidth: edge / (M / 2) };
}

// (Q2) the 2 d -> 8 d shrinkage ratio at one height.
function shrinkageRatio(logGamma, M) {
  const d = dOf(logGamma);
  const xs = seedBlock(d, M);
  const v2 = viscFracMean(xs, d, 2);
  const v8 = viscFracMean(xs, d, 8);
  return { logGamma: +logGamma.toFixed(4), d: +d.toFixed(5), v2, v8, ratio: v2 / v8 };
}

// (Q1) window edge vs block size at the anchor height
const BLOCK_SIZES = [161, 321, 641, 1281];
const WINDOW_ROWS = BLOCK_SIZES.map((M) => windowUpperEdge(LOG_ANCHOR, M));

// (Q2) shrinkage ratio at the anchor, the crossover, and four heights BEYOND the ladder
const HEIGHTS = [LOG_ANCHOR, LOG_CROSSOVER, 22, 25, 28, 32];
const HEIGHT_ROWS = HEIGHTS.map((lg) => shrinkageRatio(lg, 161));

// widening is monotone in M and the M = 1281 edge strictly exceeds the imp-3872 M = 161 edge
const WINDOW_WIDENS_WITH_M = WINDOW_ROWS.every((r, i) => i === 0 || r.edge >= WINDOW_ROWS[i - 1].edge)
  && WINDOW_ROWS[WINDOW_ROWS.length - 1].edge > WINDOW_ROWS[0].edge;
// the clean visc floor deepens monotonically as M grows
const FLOOR_DEEPENS_WITH_M = WINDOW_ROWS.every((r, i) => i === 0 || r.viscMin < WINDOW_ROWS[i - 1].viscMin);
// widening is SUB-LINEAR (logarithmic): edge / half-width falls as M grows
const WIDENING_SUBLINEAR = WINDOW_ROWS.every((r, i) => i === 0 || r.edgeOverHalfWidth < WINDOW_ROWS[i - 1].edgeOverHalfWidth);
// the 2 d -> 8 d shrinkage ratio is the SAME at every height (scale-free) to machine precision
const RATIOS = HEIGHT_ROWS.map((r) => r.ratio);
const RATIO_SPREAD = (Math.max(...RATIOS) - Math.min(...RATIOS)) / RATIOS[0];
const SHRINKAGE_HEIGHT_INVARIANT = RATIO_SPREAD < 1e-9;

export const IMP3896_G6A_H2_INVISCID_WINDOW_BLOCKSIZE_HEIGHT_SCALING = {
  id: 'imp-3896',
  proofSection: 'S-frontier',
  question:
    'imp-3872 P3 found the finite-N viscosity fraction visc = |m_zz| / |2 m m_z| shrinking ~500x across ' +
    'y_star / d = 2 -> 8 but flagged the finite block edge M = 161 bounding the clean inviscid window to ' +
    'y_star / d in [2, 8]. MEASURE how that window widens with larger block size M > 161 and whether the ' +
    '~500x shrinkage law holds at heights beyond the imp-3642 ladder (log gamma > 20.86), to size the ' +
    'true hydrodynamic separation of scales. Measurement only; imp-3066 UNTOUCHED; Lambda <= 0.2 SOTA; NO QED.',
  candidate: 'K4',
  rootProbed: 'H2', // convex-flux / hydrodynamic-limit root; here the SCALE-SEPARATION sizing of its m_zz correction
  viscosityFraction: 'visc(y_star) = |m_zz| / |2 m m_z|, m(z) = sum_k 1/(z - x_k), z = x + i y_star, s = 0 seed slice',
  cleanWindowEdge: 'argmin over integer multipliers mult in [2, 20] of visc(mult * d): where curvature stops shrinking',
  blockSizes: BLOCK_SIZES,
  windowRows: WINDOW_ROWS.map((r) => ({
    M: r.M,
    edge: r.edge, // upper edge of the clean window y_star / d in [2, edge]
    viscFloor: +r.viscMin.toExponential(3),
    halfWidthD: r.halfWidthD, // block half-width in units of d = M / 2
    edgeOverHalfWidth: +r.edgeOverHalfWidth.toExponential(3),
  })),
  heights: HEIGHTS.map((g) => +g.toFixed(4)),
  heightRows: HEIGHT_ROWS.map((r) => ({
    logGamma: r.logGamma,
    d: r.d,
    viscAt2d: +r.v2.toExponential(3),
    viscAt8d: +r.v8.toExponential(3),
    shrinkageRatio: +r.ratio.toFixed(1),
  })),
  windowWidensWithM: WINDOW_WIDENS_WITH_M, // true: 8 -> 10 -> 11 -> 13
  floorDeepensWithM: FLOOR_DEEPENS_WITH_M, // true: 4.37e-4 -> 1.05e-5 over 8x particles
  wideningSublinear: WIDENING_SUBLINEAR, // true: edge / (M/2) falls 9.9% -> 2.0% => logarithmic, not algebraic
  shrinkageHeightInvariant: SHRINKAGE_HEIGHT_INVARIANT, // true: 518.2x at every height (scale-free at s = 0)
  shrinkageRatioSpread: +RATIO_SPREAD.toExponential(2),
  finding:
    'MEASUREMENT RESULT: (Q1) the imp-3872 clean inviscid window y_star / d in [2, 8] WIDENS with block ' +
    'size -- the upper edge (argmin visc) goes 8 (M = 161) -> 10 (321) -> 11 (641) -> 13 (1281) and the ' +
    'visc floor deepens 4.37e-4 -> 1.05e-5 -- but only LOGARITHMICALLY: edge / (block half-width M/2) FALLS ' +
    '9.9% -> 2.0%, so the finite block edge recedes far slower than the block grows and CAPS the hydrodynamic ' +
    'separation of scales at ~log M; brute particle-count growth cannot reach the microscopic y -> 0 ' +
    'continuum. (Q2) the 2 d -> 8 d shrinkage ratio visc(2 d) / visc(8 d) = 518.2x is IDENTICAL to machine ' +
    'precision (spread ' + RATIO_SPREAD.toExponential(1) + ') at the anchor, the crossover and all four ' +
    'heights beyond the ladder (log gamma up to 32): at the s = 0 seed the block is an exact rescaling by d, ' +
    'so visc depends only on the dimensionless multiplier y_star / d and the ~500x law is SCALE-FREE -- it ' +
    'persists trivially at every height, and for that same reason the extra heights add no independent ' +
    'evidence at s = 0 (any genuine height dependence lives in the s > 0 RK4 flow imp-3872 already sampled).',
  isRigorous: false,
  h2StillUnwritten: true, // scale-sizing measurement, NOT the H2 certificate
  k4ConfirmedWhollyNew: true,
  g6aStillOpen: true,
  verdict:
    'MEASUREMENT / SCOPING (frontier-direction, NOT rigorous): sizes the true hydrodynamic separation of ' +
    'scales behind the imp-3872 P3 caveat that the finite block edge M = 161 bounds the clean inviscid window ' +
    'y_star / d in [2, 8]. Reusing the imp-3642 / imp-3872 mesoscopic seed (block of M at spacing d = 2 pi / ' +
    'log(gamma / 2 pi), deterministic jitter) and the identical resolvent field m(z) = sum_k 1/(z - x_k) with ' +
    'the finite-N viscosity fraction visc = |m_zz| / |2 m m_z| averaged over the imp-3872 x-grid at the s = 0 ' +
    'seed: (Q1) the clean-window UPPER EDGE (argmin over integer multipliers mult in [2, 20] of visc(mult * ' +
    'd)) WIDENS monotonically with block size -- 8 (M = 161, reproducing the imp-3872 [2, 8] window) -> 10 ' +
    '(321) -> 11 (641) -> 13 (1281) -- and the visc floor deepens 4.37e-4 -> 1.05e-5 over 8x more particles, ' +
    'BUT only LOGARITHMICALLY: doubling M lifts the edge ~1.5 d and edge / (M/2) FALLS 9.9% -> 2.0%, so the ' +
    'finite block edge recedes far slower than the block grows and caps the separation of scales at ~log M -- ' +
    'brute block-size growth CANNOT push the inviscid window to the microscopic y -> 0 continuum. (Q2) the ' +
    '2 d -> 8 d shrinkage ratio visc(2 d) / visc(8 d) = 518.2x is IDENTICAL to machine precision (relative ' +
    'spread ' + RATIO_SPREAD.toExponential(1) + ') at the anchor, the imp-3642 crossover and four heights ' +
    'BEYOND the ladder (log gamma = 22, 25, 28, 32): at the s = 0 seed the block is an exact rescaling by d so ' +
    'visc depends ONLY on the dimensionless multiplier y_star / d and the ~500x law is SCALE-FREE, persisting ' +
    'at every height -- an honest caveat being that the extra heights therefore add no independent evidence at ' +
    's = 0, since any genuine height dependence lives only in the s > 0 RK4 flow imp-3872 already sampled. So ' +
    'the separation of scales is logarithmic (not algebraic) in the particle count and scale-free in the ' +
    'height. This is a scale-sizing MEASUREMENT, NOT a certificate: it does not widen the window to y -> 0, ' +
    'does not certify the m_zz -> 0 vanishing viscosity, and does not write H2, so H2 stays UNWRITTEN as a ' +
    'certificate, the K4 route stays WHOLLY NEW (consistent with imp-3714 / imp-3727 / imp-3846 / imp-3872 / ' +
    'imp-3891) and G6a_shock_lipschitz stays OPEN. Scoping / measurement only; no positivity, no bridge ' +
    'closure, no RH claim, NO QED. imp-3066 off-diagonal endpoint-Hankel K_a >= 0 positivity UNTOUCHED. ' +
    'Platt-Trudgian Lambda <= 0.2 remains the rigorous SOTA.',
  citation:
    'imp-3872 (the [2, 8] clean inviscid window and ~500x m_zz shrinkage this measurement extends); imp-3891 ' +
    '(H2a continuum inviscid-Burgers limit written, H2b mean-field convergence OPEN); imp-3642 (attractive-CM ' +
    'seed, spacing d and block reused); imp-3846 / imp-3727 (H2 as the K4 dependency-chain root); Menon-Pego / ' +
    'Biane complex-Burgers log-gas hydrodynamics; lambda-roadmap Step 4 (Polymath15 bridge, open ' +
    'G6a_shock_lipschitz).',
};

export const IMP3896_G6A_H2_INVISCID_WINDOW_BLOCKSIZE_HEIGHT_SCALING_ASSERTIONS = [
  {
    // (Q1a) the clean inviscid window widens monotonically with block size; M = 161 reproduces the
    // imp-3872 edge 8 and the largest block strictly exceeds it.
    id: 'imp3896-window-widens-with-block-size',
    description: 'clean inviscid window upper edge widens monotonically with M (8 at M=161 -> 13 at M=1281)',
    holds: () =>
      WINDOW_WIDENS_WITH_M === true &&
      WINDOW_ROWS[0].edge === 8 &&
      WINDOW_ROWS[WINDOW_ROWS.length - 1].edge >= WINDOW_ROWS[0].edge + 3,
  },
  {
    // (Q1b) the widening is SUB-LINEAR (logarithmic): the finite edge recedes far slower than the block
    // grows, so edge / half-width falls -- brute block growth cannot reach the y -> 0 continuum.
    id: 'imp3896-widening-is-sublinear-logarithmic',
    description: 'edge / (M/2) falls monotonically (9.9% -> 2.0%): window widening is logarithmic, not algebraic, in M',
    holds: () =>
      WIDENING_SUBLINEAR === true &&
      WINDOW_ROWS[0].edgeOverHalfWidth > WINDOW_ROWS[WINDOW_ROWS.length - 1].edgeOverHalfWidth &&
      FLOOR_DEEPENS_WITH_M === true,
  },
  {
    // (Q2) the 2 d -> 8 d shrinkage law is scale-free at s = 0: the ratio is ~518x and IDENTICAL to
    // machine precision at every height, including the four beyond the ladder (log gamma > 20.86).
    id: 'imp3896-shrinkage-scale-free-across-heights',
    description: '2d->8d shrinkage ratio ~518x, identical (<1e-9 spread) at all heights incl. beyond the ladder (log gamma 22..32)',
    holds: () =>
      SHRINKAGE_HEIGHT_INVARIANT === true &&
      HEIGHT_ROWS.every((r) => Math.abs(r.ratio - 518.2) < 1.0) &&
      HEIGHTS.filter((g) => g > LOG_CROSSOVER).length === 4,
  },
  {
    // Provenance: the sweep starts from the imp-3642 / imp-3872 block M = 161 at the anchor height and
    // uses the shared spacing d = 2 pi / log(gamma / 2 pi).
    id: 'imp3896-imp3872-seed-provenance',
    description: 'reuses the imp-3642/imp-3872 M=161 anchor seed with spacing d = 2 pi / log(gamma / 2 pi)',
    holds: () =>
      BLOCK_SIZES[0] === 161 &&
      WINDOW_ROWS[0].halfWidthD === 161 / 2 &&
      Math.abs(dOf(LOG_ANCHOR) - 0.8536678) < 1e-6 &&
      Math.abs(HEIGHT_ROWS[0].logGamma - LOG_ANCHOR) < 1e-6,
  },
  {
    // Honesty gate: measurement not certificate -- H2 unwritten, K4 wholly new, G6a open, no QED, PT
    // stays SOTA, imp-3066 untouched.
    id: 'imp3896-honesty-gate-no-qed',
    description: 'MEASUREMENT not certificate: H2 unwritten, K4 wholly new, G6a open, no QED, PT stays SOTA, imp-3066 untouched',
    holds: () =>
      IMP3896_G6A_H2_INVISCID_WINDOW_BLOCKSIZE_HEIGHT_SCALING.isRigorous === false &&
      IMP3896_G6A_H2_INVISCID_WINDOW_BLOCKSIZE_HEIGHT_SCALING.h2StillUnwritten === true &&
      IMP3896_G6A_H2_INVISCID_WINDOW_BLOCKSIZE_HEIGHT_SCALING.k4ConfirmedWhollyNew === true &&
      IMP3896_G6A_H2_INVISCID_WINDOW_BLOCKSIZE_HEIGHT_SCALING.g6aStillOpen === true &&
      /NO QED/.test(IMP3896_G6A_H2_INVISCID_WINDOW_BLOCKSIZE_HEIGHT_SCALING.verdict) &&
      /remains the rigorous SOTA/.test(IMP3896_G6A_H2_INVISCID_WINDOW_BLOCKSIZE_HEIGHT_SCALING.verdict) &&
      /imp-3066[^.]*UNTOUCHED/.test(IMP3896_G6A_H2_INVISCID_WINDOW_BLOCKSIZE_HEIGHT_SCALING.verdict),
  },
];

for (const a of IMP3896_G6A_H2_INVISCID_WINDOW_BLOCKSIZE_HEIGHT_SCALING_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-3896-g6a-h2-inviscid-window-blocksize-height-scaling assertion failed: ${a.id}`);
  }
}
