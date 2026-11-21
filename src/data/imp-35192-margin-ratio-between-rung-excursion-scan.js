/**
 * @module imp-35192-margin-ratio-between-rung-excursion-scan
 *
 * imp-35192 (numerical, frontier-verification): DENSIFY the imp-35076 eps = y_N^sharp margin-ratio ladder
 * to a fine between-rung grid and MEASURE whether the a-fortiori margin ratio
 *     rho(eps) = C_ren / C_curv = eps^{3/2}|m_prime(i eps)| / (eps^{5/2}|m_double_prime(i eps)|)
 *              = |m_prime(i eps)| / (eps |m_double_prime(i eps)|)
 * ever excursions to >= 1 BETWEEN the nine sampled rungs. This is the imp-35152 gap G-a
 * (continuum-sampling gap): the imp-35076 ladder tests only 9 discrete points of the continuum
 * eps in (0, eps_0], and "nothing rules out an excursion rho(eps) >= 1 between rungs". imp-35076 read
 * rho at N in {1e3, 3e3, 1e4, 3e4, 1e5, 3e5, 1e6, 3e6, 1e7} and found rho tightening monotone to
 * A_1 / A_2 = 2/3 with a ladder-max ~0.6754 at the head rung (smallest N, largest eps). Nothing in that
 * finite reading forbids rho poking above the two bracketing rung values -- or even above 1 -- somewhere
 * strictly between two rungs. This module SAMPLES the continuum between the rungs.
 *
 * PROVENANCE (honesty note)
 * -------------------------
 * The surrogate is INHERITED verbatim from imp-35076 (the same Holder-1/2 model cusp rho(x) = |x|^{-1/2}
 * on [-1, 1], the same x = +- u^2 cusp-removing Simpson quadrature route as imp-33790, the same strip
 * height eps = y_N^sharp = sqrt(2 pi / N)). This module changes NOTHING about the surrogate; it only
 * evaluates rho on a DENSE log-uniform N grid that interpolates the nine imp-35076 rungs (40 points per
 * decade, 161 points total spanning N in [1e3, 1e7]), then asks three continuum questions the 9-rung
 * ladder cannot answer: (Q1) does the dense max of rho stay strictly below 1? (Q2) does any dense point
 * excursion ABOVE the ladder envelope (the two bracketing rung values)? (Q3) is rho monotone decreasing
 * in N (increasing in eps) across the whole dense grid, consistent with the imp-35076 monotone tightening?
 *
 * WHAT IS MEASURED
 * ----------------
 * (1) rhoDenseMax  -- the maximum of rho over the 161-point dense grid; the G-a excursion candidate.
 * (2) rhoLadderMax -- the maximum of rho over the nine imp-35076 rungs (reproduces ~0.6754 at the head).
 * (3) excursionAboveLadder = rhoDenseMax - rhoLadderMax -- if <= a quadrature-noise tolerance, NO dense
 *     point excursions meaningfully above the ladder envelope (the ladder max is a genuine sup, not an
 *     artifact of coarse sampling). A between-rung spike would make this positive and large.
 * (4) monotoneViolations -- count of adjacent dense pairs where rho INCREASES as N increases (beyond a
 *     quadrature-noise tolerance); 0 means rho is monotone decreasing across the continuum, matching the
 *     imp-35076 ladder monotonicity between rungs as well as at them.
 *
 * RESULT
 * ------
 * On the 161-point dense grid interpolating the nine rungs, rho(eps) stays STRICTLY BELOW 1 everywhere
 * (rhoDenseMax ~0.6754, attained at the head N = 1e3, i.e. AT a rung, not between two), excursions no
 * more than a few quadrature ULPs above the ladder max (excursionAboveLadder ~ 0, so the ladder max is a
 * genuine continuum sup, not a coarse-sampling artifact), and is MONOTONE decreasing in N across every
 * between-rung interval (monotoneViolations = 0). No between-rung excursion rho >= 1 -- and none even
 * above the ladder envelope -- is exposed by densifying to 40 points per decade. This is NUMERICAL
 * evidence CONSISTENT with (but NOT a proof of) the imp-35152 O1/O2 uniform-amplitude picture: the
 * continuum between the rungs behaves as the ladder suggested, with no hidden spike.
 *
 * VERDICT: MEASUREMENT ONLY on the inherited imp-35076 surrogate. A dense-but-finite scan cannot rule out
 * an excursion between the 161 dense points either -- it only rules out spikes coarser than 40 points per
 * decade; it supplies NO modulus of continuity and NO certified rate, so the imp-35152 gap G-a stays OPEN
 * (G-a is closed only by O3, a certified |rho(eps) - 2/3| <= K eps^theta, which a finer grid cannot
 * supply). Establishes no operator positivity, changes no bound. G6a_shock_lipschitz stays OPEN; imp-3066
 * off-diagonal endpoint-Hankel K_a >= 0 UNTOUCHED; C_mb remains GUE-conditional (imp-486); NO QED.
 * No refereed bound is changed.
 *
 * @see imp-35076-h3-a-fortiori-discharges-h4-numerical-verification (the 9-rung ladder this densifies)
 * @see imp-35152-n-uniform-fold-modulus-back-conversion-scoping (gap G-a; obligation O3 the certified rate)
 * @see imp-33790-fold-jet-mprime-mdoubleprime-ratio-crossvalidation (single-derivative coupling ratio 3/2)
 * @see imp-33646-h4-privalov-sokhotski-constant-scoping (A_1 = C_PS = pi/sqrt(2), eps^{3/2} renorm)
 * @see imp-33645-h3-curvature-divergence-scoping (A_2 = K = 3 pi/(2 sqrt(2)), eps^{5/2} renorm)
 */

// Reading strip height y_N^sharp = sqrt(2 pi / N) (imp-341 / imp-354 convention); it descends to 0.
function ySharp(N) {
  return Math.sqrt((2 * Math.PI) / N);
}

// Complex arithmetic in [re, im] pairs (same quadrature route as imp-35076 / imp-33790).
const N_PANELS = 8000;
function cinv(a) {
  const d = a[0] * a[0] + a[1] * a[1];
  return [a[0] / d, -a[1] / d];
}
function cmul(a, b) {
  return [a[0] * b[0] - a[1] * b[1], a[0] * b[1] + a[1] * b[0]];
}
// B_p(sgn) = integral_0^1 1 / (i eps - sgn u^2)^p du by Simpson quadrature on [0, 1] (x = +- u^2 removes the cusp).
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
// m_double_prime = 2 integral |x|^{-1/2} / (i eps - x)^3 dx = 4 [ B3(+) + B3(-) ].
function mppMag(eps) {
  const Bp = branch(eps, +1, 3);
  const Bm = branch(eps, -1, 3);
  return Math.hypot(4 * (Bp[0] + Bm[0]), 4 * (Bp[1] + Bm[1]));
}

// The a-fortiori margin ratio rho(eps) = C_ren / C_curv = |m_prime| / (eps |m_double_prime|) -> 2/3.
function rhoOfEps(eps) {
  return mpMag(eps) / (eps * mppMag(eps));
}

const MARGIN_LIMIT = Math.PI / Math.SQRT2 / ((3 * Math.PI) / (2 * Math.SQRT2)); // A_1 / A_2 = 2/3

// The nine imp-35076 rungs (the discrete ladder whose between-rung continuum this module scans).
const RUNG_N = [1e3, 3e3, 1e4, 3e4, 1e5, 3e5, 1e6, 3e6, 1e7];
const RUNG_RHO = RUNG_N.map((N) => rhoOfEps(ySharp(N)));
const RHO_LADDER_MAX = RUNG_RHO.reduce((m, r) => Math.max(m, r), 0);

// Dense log-uniform N grid interpolating the rungs: 40 points per decade over [1e3, 1e7] (161 points).
const DENSE_PER_DECADE = 40;
const LOG_LO = 3;
const LOG_HI = 7;
const DENSE_COUNT = (LOG_HI - LOG_LO) * DENSE_PER_DECADE + 1; // 161
const DENSE = [];
for (let i = 0; i < DENSE_COUNT; i++) {
  const log10N = LOG_LO + ((LOG_HI - LOG_LO) * i) / (DENSE_COUNT - 1);
  const N = Math.pow(10, log10N);
  const eps = ySharp(N);
  DENSE.push({ N, eps, rho: rhoOfEps(eps) });
}

// (1) dense max of rho -- the G-a between-rung excursion candidate.
const RHO_DENSE_MAX = DENSE.reduce((m, d) => Math.max(m, d.rho), 0);
// (2) argmax N -- if it lands AT the head rung (1e3), the max is a rung, not a between-rung spike.
const RHO_DENSE_ARGMAX_N = DENSE.reduce((best, d) => (d.rho > best.rho ? d : best), DENSE[0]).N;
// (3) excursion above the ladder envelope: <= quadrature noise => the ladder max is a genuine sup.
const EXCURSION_ABOVE_LADDER = RHO_DENSE_MAX - RHO_LADDER_MAX;
// (4) monotonicity across the continuum: rho should DECREASE as N increases (eps -> 0), toward 2/3.
const MONO_TOL = 1e-7; // quadrature-noise tolerance for the strict-decrease test
let MONOTONE_VIOLATIONS = 0;
for (let i = 1; i < DENSE.length; i++) {
  if (DENSE[i].rho > DENSE[i - 1].rho + MONO_TOL) MONOTONE_VIOLATIONS++;
}
// Between-rung envelope check: every dense rho lies within [rung_hi, rung_lo] of its bracketing rungs
// (monotone envelope) up to noise -- no dense point pokes outside the two rungs that bracket it.
let ENVELOPE_VIOLATIONS = 0;
for (const d of DENSE) {
  // find bracketing rungs by N
  let lo = RUNG_N[0];
  let hi = RUNG_N[RUNG_N.length - 1];
  let rhoLo = RUNG_RHO[0];
  let rhoHi = RUNG_RHO[RUNG_RHO.length - 1];
  for (let j = 0; j < RUNG_N.length - 1; j++) {
    if (d.N >= RUNG_N[j] && d.N <= RUNG_N[j + 1]) {
      lo = RUNG_N[j];
      hi = RUNG_N[j + 1];
      rhoLo = RUNG_RHO[j]; // larger rho (smaller N)
      rhoHi = RUNG_RHO[j + 1]; // smaller rho (larger N)
      break;
    }
  }
  void lo;
  void hi;
  const upper = Math.max(rhoLo, rhoHi) + MONO_TOL;
  const lower = Math.min(rhoLo, rhoHi) - MONO_TOL;
  if (d.rho > upper || d.rho < lower) ENVELOPE_VIOLATIONS++;
}

const HEAD = DENSE[0];
const TAIL = DENSE[DENSE.length - 1];

export const IMP35192_MARGIN_RATIO_BETWEEN_RUNG_EXCURSION_SCAN = {
  id: 'imp-35192',
  proofSection: 'S-frontier',
  scopes:
    'Densify the imp-35076 eps = y_N^sharp margin-ratio ladder to a fine between-rung grid and measure ' +
    'whether rho(eps) = C_ren / C_curv ever excursions to >= 1 between the nine sampled rungs (imp-35152 gap G-a)',
  question:
    'On a dense log-uniform N grid interpolating the nine imp-35076 rungs (40 points per decade, N in ' +
    '[1e3, 1e7]), does the a-fortiori margin ratio rho(eps) = |m_prime| / (eps |m_double_prime|) stay ' +
    'strictly below 1 and monotone decreasing BETWEEN the rungs, or does the continuum expose an ' +
    'excursion rho >= 1 the 9-rung ladder never sampled (imp-35152 gap G-a)? Measurement only; G-a stays ' +
    'OPEN; no positivity; no QED.',

  cuspModel: 'rho(x) ~ C / |x - x_star|^{1/2} (Holder-1/2) -- the RvM cusp of imp-394, inherited from imp-35076',
  marginRatioDefinition: 'rho(eps) = eps^{3/2}|m_prime(i eps)| / (eps^{5/2}|m_double_prime(i eps)|) = |m_prime| / (eps |m_double_prime|)',
  marginRatioLimitClosedForm: MARGIN_LIMIT, // A_1 / A_2 = 2/3

  // The dense between-rung scan.
  densePointsPerDecade: DENSE_PER_DECADE, // 40
  densePointCount: DENSE_COUNT, // 161
  denseHeadN: +HEAD.N.toExponential(4),
  denseHeadRho: +HEAD.rho.toFixed(6),
  denseTailN: +TAIL.N.toExponential(4),
  denseTailRho: +TAIL.rho.toFixed(6),

  // (1)-(4): the four continuum measurements a 9-rung ladder cannot make.
  rhoDenseMax: +RHO_DENSE_MAX.toFixed(6), // the G-a excursion candidate
  rhoDenseArgmaxN: +RHO_DENSE_ARGMAX_N.toExponential(4), // lands at the head rung, not between rungs
  rhoLadderMax: +RHO_LADDER_MAX.toFixed(6), // ~0.6754 (imp-35076 head-rung max)
  excursionAboveLadder: +EXCURSION_ABOVE_LADDER.toExponential(3), // ~0: ladder max is a genuine continuum sup
  monotoneViolations: MONOTONE_VIOLATIONS, // 0: rho decreases across every between-rung interval
  envelopeViolations: ENVELOPE_VIOLATIONS, // 0: no dense point pokes outside its bracketing rungs

  // The three continuum verdicts.
  rhoStaysBelowOne: RHO_DENSE_MAX < 1, // Q1: no between-rung excursion to >= 1
  argmaxIsAtHeadRung: Math.abs(RHO_DENSE_ARGMAX_N - RUNG_N[0]) < 1, // Q2: max is a rung, not a between-rung spike
  monotoneAcrossContinuum: MONOTONE_VIOLATIONS === 0 && ENVELOPE_VIOLATIONS === 0, // Q3: monotone between rungs

  // The assessment: measurement consistent with the ladder, NOT a discharge of G-a.
  betweenRungExcursionExposed: false, // no dense point excursions above the ladder envelope or above 1
  suppliesModulusOfContinuity: false, // a finer grid is still a finite sample; G-a needs O3 (a certified rate)
  residualObstruction:
    'a dense-but-finite scan rules out excursions coarser than 40 points per decade only; it supplies no ' +
    'modulus of continuity and no certified rate |rho(eps) - 2/3| <= K eps^theta, so imp-35152 gap G-a ' +
    '(and its load-bearing obligation O3) stays OPEN and G6a_shock_lipschitz stays OPEN on the H3 axis',

  isRigorous: false,
  verdict:
    'MEASUREMENT ONLY on the inherited imp-35076 model-cusp surrogate, imp-35152 gap G-a STAYS OPEN. ' +
    'Densifying the nine-rung imp-35076 margin-ratio ladder to a 161-point log-uniform grid (40 points per ' +
    'decade, N in [1e3, 1e7]) interpolating the rungs, the a-fortiori margin ratio ' +
    'rho(eps) = |m_prime(i eps)| / (eps |m_double_prime(i eps)|) stays STRICTLY BELOW 1 at every dense ' +
    'point (rhoDenseMax ~0.6754, attained AT the head rung N = 1e3, not between two rungs), excursions no ' +
    'more than a few quadrature ULPs above the ladder max (so the ladder max is a genuine continuum sup, ' +
    'not a coarse-sampling artifact), and is MONOTONE decreasing in N across every between-rung interval ' +
    '(monotoneViolations = 0, envelopeViolations = 0). No between-rung excursion rho >= 1 -- and none even ' +
    'above the ladder envelope -- is exposed. This is numerical evidence CONSISTENT with the imp-35152 ' +
    'O1/O2 uniform-amplitude picture, NOT a proof: a dense-but-finite scan cannot rule out a spike between ' +
    'the 161 dense points, supplies NO modulus of continuity and NO certified rate ' +
    '|rho(eps) - 2/3| <= K eps^theta (the load-bearing obligation O3), so imp-35152 gap G-a stays OPEN. ' +
    'Establishes no operator positivity, changes no bound. G6a_shock_lipschitz stays OPEN; imp-3066 ' +
    'off-diagonal endpoint-Hankel K_a >= 0 UNTOUCHED; C_mb remains GUE-conditional (imp-486); NO QED. ' +
    'No refereed bound is changed.',
};

export const IMP35192_MARGIN_RATIO_BETWEEN_RUNG_EXCURSION_ASSERTIONS = [
  {
    // (1) the dense scan finds no between-rung excursion to >= 1: rho stays strictly below 1 everywhere.
    id: 'imp35192-rho-stays-strictly-below-one-on-dense-grid',
    description: 'rhoDenseMax < 1 across the 161-point between-rung grid (no excursion rho >= 1, imp-35152 gap G-a probe)',
    holds: () =>
      IMP35192_MARGIN_RATIO_BETWEEN_RUNG_EXCURSION_SCAN.rhoStaysBelowOne === true &&
      IMP35192_MARGIN_RATIO_BETWEEN_RUNG_EXCURSION_SCAN.rhoDenseMax < 1,
  },
  {
    // (2) the dense max coincides with the ladder max (at the head rung), so no between-rung spike is hidden.
    id: 'imp35192-dense-max-is-the-head-rung-not-a-between-rung-spike',
    description: 'rhoDenseMax argmax is the head rung N = 1e3 and excursionAboveLadder is at quadrature-noise level',
    holds: () =>
      IMP35192_MARGIN_RATIO_BETWEEN_RUNG_EXCURSION_SCAN.argmaxIsAtHeadRung === true &&
      IMP35192_MARGIN_RATIO_BETWEEN_RUNG_EXCURSION_SCAN.excursionAboveLadder < 1e-4,
  },
  {
    // (3) rho is monotone decreasing across the continuum and never pokes outside its bracketing rungs.
    id: 'imp35192-rho-monotone-and-within-envelope-between-rungs',
    description: 'monotoneViolations = 0 and envelopeViolations = 0 across the 161-point dense grid',
    holds: () =>
      IMP35192_MARGIN_RATIO_BETWEEN_RUNG_EXCURSION_SCAN.monotoneAcrossContinuum === true &&
      IMP35192_MARGIN_RATIO_BETWEEN_RUNG_EXCURSION_SCAN.monotoneViolations === 0 &&
      IMP35192_MARGIN_RATIO_BETWEEN_RUNG_EXCURSION_SCAN.envelopeViolations === 0,
  },
  {
    // (4) the dense tail rho reproduces the imp-35076 / imp-33790 limit 2/3 as eps -> 0.
    id: 'imp35192-dense-tail-rho-approaches-two-thirds',
    description: 'the deepest dense point (N = 1e7) has rho within 1e-3 of A_1/A_2 = 2/3 (imp-35076 limit)',
    holds: () =>
      Math.abs(IMP35192_MARGIN_RATIO_BETWEEN_RUNG_EXCURSION_SCAN.denseTailRho - 2 / 3) < 1e-3 &&
      Math.abs(IMP35192_MARGIN_RATIO_BETWEEN_RUNG_EXCURSION_SCAN.marginRatioLimitClosedForm - 2 / 3) < 1e-12,
  },
  {
    // Honesty gate: measurement only; does NOT close G-a, no modulus, G6a OPEN, no QED, no refereed bound is changed, imp-3066 untouched.
    id: 'imp35192-honesty-gate-no-qed',
    description:
      'Measurement only: no between-rung excursion exposed but G-a not closed (no modulus/rate), G6a OPEN, no QED, no refereed bound is changed, imp-3066 untouched',
    holds: () =>
      IMP35192_MARGIN_RATIO_BETWEEN_RUNG_EXCURSION_SCAN.isRigorous === false &&
      IMP35192_MARGIN_RATIO_BETWEEN_RUNG_EXCURSION_SCAN.betweenRungExcursionExposed === false &&
      IMP35192_MARGIN_RATIO_BETWEEN_RUNG_EXCURSION_SCAN.suppliesModulusOfContinuity === false &&
      /NO QED/.test(IMP35192_MARGIN_RATIO_BETWEEN_RUNG_EXCURSION_SCAN.verdict) &&
      /G6a_shock_lipschitz stays OPEN/.test(IMP35192_MARGIN_RATIO_BETWEEN_RUNG_EXCURSION_SCAN.verdict) &&
      /refereed bound is changed/i.test(IMP35192_MARGIN_RATIO_BETWEEN_RUNG_EXCURSION_SCAN.verdict) &&
      /imp-3066 off-diagonal endpoint-Hankel K_a >= 0 UNTOUCHED/.test(
        IMP35192_MARGIN_RATIO_BETWEEN_RUNG_EXCURSION_SCAN.verdict,
      ),
  },
];

for (const a of IMP35192_MARGIN_RATIO_BETWEEN_RUNG_EXCURSION_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-35192-margin-ratio-between-rung-excursion-scan assertion failed: ${a.id}`);
  }
}
