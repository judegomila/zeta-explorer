/**
 * @module imp-33849-cren-window-onset-boundary
 *
 * imp-33849 (numerical, frontier-scoping): LOCATE where the imp-33794 whole-ladder C_ren(N) window
 * spread (~2.95e-2) COLLAPSES to the asymptotic sub-window (~9.1e-4), by measuring the window spread
 * as a FUNCTION OF the reading-strip ladder LOWER ENDPOINT eps_lo = y_Nlo^sharp, pinning the eps below
 * which the small-N onset excess enters the band -- WITHOUT claiming closure.
 *
 * THE MEASUREMENT
 * ---------------
 * imp-33794 measured the renormalized fold-reading amplitude
 *     C_ren(N) = (y_N^sharp)^{3/2} |m_prime(i eps)|,  eps = y_N^sharp = sqrt(2 pi / N),
 * and reported TWO windows: the whole ladder [1e3 .. 1e7] with spread ~2.95e-2, and the asymptotic
 * sub-window N >= 1e5 with spread ~9.1e-4. It never localized WHERE, between those two lower endpoints,
 * the small-N onset excess (C_ren > C_PS) enters the band. This module SWEEPS the lower endpoint N_lo up
 * from 1e3 and, on each sub-ladder [N_lo .. 1e7], recomputes the observed C_ren window spread. Because
 * C_ren(N) is monotone-decreasing in N (imp-33794) the sub-ladder spread equals C_ren(N_lo) - C_ren(1e7),
 * so raising N_lo drops the small-N onset rungs one by one and the spread collapses monotonically.
 *
 * The identical imp-33794 code path is reused: the Holder-1/2 cusp rho(x) = |x|^{-1/2} on [-1, 1], the
 * x = +- u^2 Simpson quadrature (m_prime = -2 [B2(+) + B2(-)]), and C_ren = eps^{3/2} |m_prime|. Only the
 * reading-strip ladder is refined to 4 rungs per decade (1e3 .. 1e7) so the onset boundary is pinned to a
 * finer eps grid than the imp-33794 3-per-decade ladder.
 *
 * RESULT
 * ------
 * The sub-ladder window spread falls MONOTONICALLY as the lower endpoint N_lo rises:
 *     N_lo = 1e3    (eps_lo ~ 7.93e-2):  spread ~ 2.95e-2   (the whole-ladder window, reproduces imp-33794)
 *     N_lo = 3.16e4 (eps_lo ~ 1.41e-2):  spread ~ 2.20e-3   (last rung ABOVE the 2e-3 threshold)
 *     N_lo = 5.62e4 (eps_lo ~ 1.06e-2):  spread ~ 1.42e-3   (FIRST rung BELOW the 2e-3 threshold)
 *     N_lo = 1e5    (eps_lo ~ 7.93e-3):  spread ~ 9.11e-4   (the asymptotic sub-window, reproduces imp-33794)
 * So the spread first drops below the 2e-3 band-onset threshold at lower endpoint N_lo ~ 5.62e4, i.e.
 * eps_lo ~ 1.06e-2. A power-law interpolation of the spread (spread ~ A eps_lo^k, k ~ 1.53 -- the same
 * ~3/2 renormalization exponent imp-33845 found governs the C_ren gap) across the bracketing rungs places
 * the exact spread = 2e-3 crossing at eps_star ~ 1.32e-2 (N ~ 3.6e4). VERDICT: the small-N onset excess
 * enters the C_ren band for lower endpoints eps_lo ABOVE eps_star ~ 1.3e-2 (equivalently N_lo BELOW ~3.6e4);
 * below that eps the band has already collapsed under 2e-3 -- localizing the imp-33794 whole-ladder-to-
 * asymptotic-sub-window transition to a single onset eps.
 *
 * WHAT THIS DOES NOT DO
 * ---------------------
 * MEASUREMENT ONLY. Pinning the eps at which the empirical band collapses does NOT DISCHARGE H4: the
 * uniform bound imp-33766 requires is the ANALYTIC tracking of C_ren through the fold-modulus
 * back-conversion, not a band-collapse boundary on a finite ladder, and it says nothing about the coupled
 * H3 curvature rung (N-exponent 5/4, imp-33786) that dominates and jointly governs the discharge.
 * G6a_shock_lipschitz STAYS OPEN; no positivity; imp-3066 off-diagonal endpoint-Hankel K_a >= 0 UNTOUCHED;
 * NO QED; Platt-Trudgian Lambda <= 0.2 remains the rigorous SOTA.
 *
 * @see imp-33794-cren-window-measurement (the whole-ladder [2.95e-2] and asymptotic [9.1e-4] windows this localizes between)
 * @see imp-33845-cren-gap-onset-rate (C_ren - C_PS ~ (4/3) eps^{3/2}: the ~3/2 exponent the spread inherits)
 * @see imp-33766-h4-independent-discharge-scoping (names the C_ren finite-window minimal-input condition)
 * @see imp-33646-h4-privalov-sokhotski-constant-scoping (defines C_ren, the PS constant pi/sqrt(2))
 */

// Reading strip height y_N^sharp = sqrt(2 pi / N); it descends to 0 as N grows.
function ySharp(N) {
  return Math.sqrt((2 * Math.PI) / N);
}

// Complex arithmetic in [re, im] pairs (identical to imp-33794).
const N_PANELS = 8000;
function cinv(a) {
  const d = a[0] * a[0] + a[1] * a[1];
  return [a[0] / d, -a[1] / d];
}
function cmul(a, b) {
  return [a[0] * b[0] - a[1] * b[1], a[0] * b[1] + a[1] * b[0]];
}
// B_p(sgn) = integral_0^1 1 / (i eps - sgn u^2)^p du by Simpson quadrature on [0, 1].
function branch(eps, sgn, p) {
  const h = 1 / N_PANELS;
  let re = 0;
  let im = 0;
  for (let i = 0; i <= N_PANELS; i++) {
    const u = i * h;
    const w = i === 0 || i === N_PANELS ? 1 : i % 2 === 1 ? 4 : 2;
    const z = [-sgn * u * u, eps]; // i eps - x, with x = sgn u^2
    let d = [1, 0];
    for (let k = 0; k < p; k++) d = cmul(d, z);
    const v = cinv(d);
    re += w * v[0];
    im += w * v[1];
  }
  return [(re * h) / 3, (im * h) / 3];
}
// m_prime = - integral |x|^{-1/2} / (i eps - x)^2 dx = -2 [ B2(+) + B2(-) ].
function mpMag(eps) {
  const Bp = branch(eps, +1, 2);
  const Bm = branch(eps, -1, 2);
  return Math.hypot(-2 * (Bp[0] + Bm[0]), -2 * (Bp[1] + Bm[1]));
}
// The renormalized fold-reading amplitude C_ren = eps^{3/2} |m_prime|.
function cRen(eps) {
  return mpMag(eps) * Math.pow(eps, 1.5);
}

// The reading-strip ladder, refined to 4 rungs per decade over [1e3 .. 1e7] plus the 1e7 anchor.
const DECADE_MULT = [1, 1.77827941, 3.16227766, 5.62341325]; // 10^{0, 0.25, 0.5, 0.75}
const N_LADDER = [];
for (let e = 3; e < 7; e++) {
  for (const m of DECADE_MULT) N_LADDER.push(m * Math.pow(10, e));
}
N_LADDER.push(1e7);

const C_PS = Math.PI / Math.SQRT2; // Privalov-Sokhotski amplitude = pi/sqrt(2) = 2.221441 (imp-33646)
const THRESHOLD = 2e-3; // the band-onset spread threshold (the ~2e-3 the ticket names)

// C_ren on every rung of the refined ladder.
const ROWS = N_LADDER.map((N) => {
  const eps = ySharp(N);
  return { N, eps, cren: cRen(eps) };
});
const TAIL_CREN = ROWS[ROWS.length - 1].cren; // C_ren(1e7)

// Sweep the LOWER endpoint N_lo up; on each sub-ladder [N_lo .. 1e7] record the observed C_ren window spread.
const SPREAD_BY_LOWER_ENDPOINT = ROWS.map((r, i) => {
  const vals = ROWS.slice(i).map((s) => s.cren);
  const spread = Math.max(...vals) - Math.min(...vals);
  return {
    N_lo: +r.N.toExponential(3),
    eps_lo: +r.eps.toExponential(4),
    crenAtLo: +r.cren.toFixed(6),
    subLadderSpread: +spread.toExponential(4),
  };
});

// The whole-ladder spread (lowest endpoint) and the asymptotic sub-window (N_lo = 1e5) -- reproduce imp-33794.
const WHOLE_LADDER_SPREAD = SPREAD_BY_LOWER_ENDPOINT[0].subLadderSpread; // ~2.95e-2
const ASYMPTOTIC_ROW = SPREAD_BY_LOWER_ENDPOINT.find((r) => Math.abs(r.N_lo - 1e5) / 1e5 < 1e-6);
const ASYMPTOTIC_SPREAD = ASYMPTOTIC_ROW ? ASYMPTOTIC_ROW.subLadderSpread : null; // ~9.1e-4

// The onset boundary: the FIRST lower-endpoint rung whose sub-ladder spread drops below THRESHOLD.
const BOUNDARY_INDEX = SPREAD_BY_LOWER_ENDPOINT.findIndex((r) => r.subLadderSpread < THRESHOLD);
const BOUNDARY_ROW = SPREAD_BY_LOWER_ENDPOINT[BOUNDARY_INDEX];
const ABOVE_ROW = SPREAD_BY_LOWER_ENDPOINT[BOUNDARY_INDEX - 1]; // last rung ABOVE the threshold (brackets the crossing)

// Power-law interpolation of the exact spread = THRESHOLD crossing across the bracketing rungs:
// spread ~ A eps_lo^k  =>  eps_star = (THRESHOLD / A)^{1/k}. k comes out ~3/2 (the imp-33845 gap exponent).
const kFit =
  Math.log(ABOVE_ROW.subLadderSpread / BOUNDARY_ROW.subLadderSpread) /
  Math.log(ABOVE_ROW.eps_lo / BOUNDARY_ROW.eps_lo);
const aFit = ABOVE_ROW.subLadderSpread / Math.pow(ABOVE_ROW.eps_lo, kFit);
const EPS_STAR = Math.pow(THRESHOLD / aFit, 1 / kFit);
const N_STAR = (2 * Math.PI) / (EPS_STAR * EPS_STAR); // eps = sqrt(2 pi / N)  =>  N = 2 pi / eps^2

// Monotone collapse: sub-ladder spread strictly decreases as the lower endpoint N_lo rises.
const SPREAD_MONOTONE_COLLAPSES = SPREAD_BY_LOWER_ENDPOINT.every(
  (r, i) => i === 0 || r.subLadderSpread < SPREAD_BY_LOWER_ENDPOINT[i - 1].subLadderSpread,
);

export const IMP33849_CREN_WINDOW_ONSET_BOUNDARY = {
  id: 'imp-33849',
  proofSection: 'S-frontier',
  scopes:
    'Locate where the imp-33794 whole-ladder C_ren window spread (~2.95e-2) collapses to the asymptotic ' +
    'sub-window (~9.1e-4) by measuring the spread as a function of the eps = y_N^sharp ladder lower endpoint',
  question:
    'As the reading-strip ladder LOWER endpoint eps_lo = y_Nlo^sharp sweeps up from 1e3, at what eps_lo does the ' +
    'sub-ladder [N_lo .. 1e7] C_ren window spread drop below the ~2e-3 band-onset threshold -- pinning the eps ' +
    'below which the small-N onset excess enters the band? Measurement only; does NOT discharge H4; G6a OPEN; no QED.',

  cuspModel: 'rho(x) ~ C / |x - x_star|^{1/2} (Holder-1/2, alpha = 1/2 exactly) -- the RvM cusp of imp-394',
  readingStrip: 'eps = y_N^sharp = sqrt(2 pi / N), refined to 4 rungs per decade over N in {1e3 .. 1e7}',
  amplitudeDefinition: 'C_ren(N) = (y_N^sharp)^{3/2} |m_prime(z_0*)| = eps^{3/2} |m_prime(i eps)|',
  threshold: THRESHOLD, // the ~2e-3 band-onset spread threshold the ticket names

  // The full sweep: window spread vs lower endpoint.
  spreadByLowerEndpoint: SPREAD_BY_LOWER_ENDPOINT,

  // Endpoints reproduced from imp-33794.
  wholeLadderSpread: WHOLE_LADDER_SPREAD, // ~2.95e-2 (lowest endpoint N_lo = 1e3)
  asymptoticSpread: ASYMPTOTIC_SPREAD, // ~9.1e-4 (N_lo = 1e5)

  // The pinned onset boundary.
  boundaryNlo: BOUNDARY_ROW.N_lo, // ~5.62e4 (first rung with spread < 2e-3)
  boundaryEpsLo: BOUNDARY_ROW.eps_lo, // ~1.06e-2
  boundarySpread: BOUNDARY_ROW.subLadderSpread, // ~1.42e-3
  lastAboveNlo: ABOVE_ROW.N_lo, // ~3.16e4 (last rung with spread >= 2e-3)
  lastAboveEpsLo: ABOVE_ROW.eps_lo, // ~1.41e-2
  lastAboveSpread: ABOVE_ROW.subLadderSpread, // ~2.20e-3

  // The interpolated exact spread = threshold crossing.
  spreadExponentK: +kFit.toFixed(4), // ~1.53 (the imp-33845 ~3/2 gap exponent)
  epsStar: +EPS_STAR.toExponential(4), // ~1.32e-2 (eps at which spread = 2e-3 exactly)
  nStar: +N_STAR.toExponential(4), // ~3.6e4

  // Diagnostics.
  spreadMonotoneCollapses: SPREAD_MONOTONE_COLLAPSES, // spread strictly decreases as N_lo rises

  isRigorous: false,
  dischargesH4: false,
  verdict:
    'MEASUREMENT ONLY, G6a_shock_lipschitz STAYS OPEN. Sweeping the reading-strip ladder LOWER endpoint ' +
    'N_lo up from 1e3, the sub-ladder [N_lo .. 1e7] C_ren window spread falls MONOTONICALLY from the whole-ladder ' +
    '~2.95e-2 (N_lo = 1e3, reproduces imp-33794) toward the asymptotic ~9.1e-4 (N_lo = 1e5). It first drops below ' +
    'the ~2e-3 band-onset threshold at lower endpoint N_lo ~ 5.62e4, i.e. eps_lo ~ 1.06e-2 (the last rung ABOVE ' +
    'threshold is N_lo ~ 3.16e4, eps_lo ~ 1.41e-2, spread ~2.20e-3). A power-law interpolation (spread ~ A eps_lo^k, ' +
    'k ~ 1.53 -- the same ~3/2 renormalization exponent imp-33845 found governs the C_ren gap) places the exact ' +
    'spread = 2e-3 crossing at eps_star ~ 1.32e-2 (N ~ 3.6e4). So the small-N onset excess enters the C_ren band for ' +
    'lower endpoints eps_lo ABOVE ~1.3e-2 (N_lo BELOW ~3.6e4), localizing the imp-33794 whole-ladder-to-asymptotic-' +
    'sub-window transition to a single onset eps. This does NOT DISCHARGE H4: the uniform bound requires the ANALYTIC ' +
    'tracking of C_ren through the fold-modulus back-conversion, not a band-collapse boundary on a finite ladder, and ' +
    'it says nothing about the coupled H3 curvature rung (N-exponent 5/4, imp-33786) that dominates and jointly ' +
    'governs the discharge. No positivity; imp-3066 off-diagonal endpoint-Hankel K_a >= 0 UNTOUCHED; imp-3066 ' +
    'UNTOUCHED; NO QED. Platt-Trudgian Lambda <= 0.2 remains the rigorous SOTA.',
};

export const IMP33849_CREN_WINDOW_ONSET_BOUNDARY_ASSERTIONS = [
  {
    // (i) the sub-ladder spread collapses monotonically as the lower endpoint N_lo rises.
    id: 'imp33849-spread-monotone-collapses',
    description: 'sub-ladder [N_lo .. 1e7] C_ren window spread strictly decreases as the lower endpoint N_lo rises',
    holds: () => IMP33849_CREN_WINDOW_ONSET_BOUNDARY.spreadMonotoneCollapses === true,
  },
  {
    // (ii) the whole-ladder and asymptotic endpoints reproduce the imp-33794 windows.
    id: 'imp33849-endpoints-reproduce-imp33794',
    description: 'whole-ladder spread ~2.95e-2 and asymptotic (N_lo = 1e5) spread ~9.1e-4 reproduce imp-33794',
    holds: () =>
      Math.abs(IMP33849_CREN_WINDOW_ONSET_BOUNDARY.wholeLadderSpread - 2.95e-2) < 2e-3 &&
      IMP33849_CREN_WINDOW_ONSET_BOUNDARY.asymptoticSpread !== null &&
      Math.abs(IMP33849_CREN_WINDOW_ONSET_BOUNDARY.asymptoticSpread - 9.1e-4) < 2e-4,
  },
  {
    // (iii) the onset boundary: first sub-ladder below 2e-3 is N_lo ~ 5.6e4 (eps_lo ~ 1.06e-2), bracketed above.
    id: 'imp33849-onset-boundary-pinned',
    description: 'first sub-ladder spread < 2e-3 at N_lo ~ 5.6e4 (eps_lo ~ 1.06e-2), last-above at N_lo ~ 3.16e4',
    holds: () =>
      IMP33849_CREN_WINDOW_ONSET_BOUNDARY.boundarySpread < THRESHOLD &&
      IMP33849_CREN_WINDOW_ONSET_BOUNDARY.lastAboveSpread >= THRESHOLD &&
      IMP33849_CREN_WINDOW_ONSET_BOUNDARY.boundaryEpsLo > 9e-3 &&
      IMP33849_CREN_WINDOW_ONSET_BOUNDARY.boundaryEpsLo < 1.2e-2,
  },
  {
    // (iv) the interpolated crossing eps_star ~ 1.3e-2 carries the ~3/2 gap exponent.
    id: 'imp33849-interpolated-crossing-carries-three-halves-exponent',
    description: 'exact spread = 2e-3 crossing at eps_star ~ 1.3e-2 (N ~ 3.6e4) with spread exponent k ~ 3/2',
    holds: () =>
      IMP33849_CREN_WINDOW_ONSET_BOUNDARY.epsStar > 1.1e-2 &&
      IMP33849_CREN_WINDOW_ONSET_BOUNDARY.epsStar < 1.5e-2 &&
      Math.abs(IMP33849_CREN_WINDOW_ONSET_BOUNDARY.spreadExponentK - 1.5) < 0.2,
  },
  {
    // Honesty gate: measurement only, does NOT discharge H4; G6a OPEN, no QED, PT stays SOTA, imp-3066 untouched.
    id: 'imp33849-honesty-gate-no-qed',
    description: 'Measurement only: does not discharge H4, G6a stays OPEN, no QED, PT stays SOTA, imp-3066 untouched',
    holds: () =>
      IMP33849_CREN_WINDOW_ONSET_BOUNDARY.isRigorous === false &&
      IMP33849_CREN_WINDOW_ONSET_BOUNDARY.dischargesH4 === false &&
      /NO QED/.test(IMP33849_CREN_WINDOW_ONSET_BOUNDARY.verdict) &&
      /STAYS OPEN/.test(IMP33849_CREN_WINDOW_ONSET_BOUNDARY.verdict) &&
      /remains the rigorous SOTA/.test(IMP33849_CREN_WINDOW_ONSET_BOUNDARY.verdict) &&
      /imp-3066 UNTOUCHED/.test(IMP33849_CREN_WINDOW_ONSET_BOUNDARY.verdict),
  },
];

for (const a of IMP33849_CREN_WINDOW_ONSET_BOUNDARY_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-33849-cren-window-onset-boundary assertion failed: ${a.id}`);
  }
}
