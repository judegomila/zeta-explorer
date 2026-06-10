/**
 * @module imp-2561-isolated-pair-pinch
 *
 * imp-2561 (S2 fanout survivor, 8 -> 7 after referee): the finite-N
 * isolated-pair PINCH theorem, a standalone companion to
 * src/data/backward-flow-stability-gronwall.js. It supplies the UPPER
 * collision-time bound that matches Lemma D's lower bound t_c >= g_min^2/8
 * with the SAME constant 1/8, sharpening the Theta-squeeze that
 * src/data/sg1-theta-contraction.js consumes.
 *
 * Conventions (pinned to the gronwall module, de Bruijn-Newman units)
 * -------------------------------------------------------------------
 * Particles x_1(s) < ... < x_N(s) evolve under the ATTRACTIVE rational
 * Calogero-Moser flow  dx_k/ds = -2 sum_{j != k} 1/(x_k - x_j),  s = -t,
 * s increasing toward the collision side. For an adjacent pair
 * {x_k, x_{k+1}} write g = x_{k+1} - x_k and let the external set be all
 * other particles, at nearer-member distances D_j > 0.
 *
 * LEMMA E (isolated-pair pinch -- the ticket statement, self-derived)
 * ------------------------------------------------------------------
 * Exact relative dynamics (algebra, no limits): the pair gap obeys
 *
 *     dg/ds = -4/g + R,   R = 2 g sum_j 1/((x_{k+1}-x_j)(x_k-x_j)),
 *
 * the internal -4/g being attractive (contracting) and R the external
 * log-gas force. Equivalently, with u = g^2,
 *
 *     du/ds = -8 + 4 g^2 S(s),   S(s) = sum_j 1/((x_{k+1}-x_j)(x_k-x_j)).
 *
 * Each external product satisfies (x_{k+1}-x_j)(x_k-x_j) >= D_j^2 (the
 * nearer factor is >= D_j, the farther is >= D_j + g > D_j, same sign),
 * so 0 < S(s) <= sum_j D_j^{-2} = E0/2 with the environment constant
 *
 *     E0 := 2 sum_j D_j^{-2}.
 *
 * Hence du/ds <= -8 + 2 E0 u. Comparison with v' = -8 + 2 E0 v, v(0)=g0^2
 * gives v(s) = (g0^2 - 4/E0) e^{2 E0 s} + 4/E0, which reaches 0 at
 *
 *     t_c <= (1/(2 E0)) ln( 1 / (1 - x) ),     x := E0 g0^2 / 4,
 *
 * valid (and the pair genuinely collapses) once x < 1. Using the
 * elementary -ln(1-y) <= y(1+y) on 0 <= y <= 1/2, the side condition
 * x <= 1/2 upgrades this to the matched-constant form
 *
 *     t_c <= (g0^2 / 8) (1 + x),
 *
 * which pairs with Lemma D (t_c >= g_min^2/8) at the identical constant
 * 1/8. So under x <= 1/2,   g0^2/8 <= t_c <= (g0^2/8)(1+x).
 *
 * REFEREE MUST-FIX (mandatory), applied here
 * ------------------------------------------
 * (1) Isolation constant fixed everywhere: the hypothesis that makes x
 *     small is 2g0-ISOLATION -- every adjacent gap OTHER than the minimal
 *     pair gap is >= 2 g0 -- NOT sqrt(2)-isolation. The false "at most one
 *     gap below sqrt(2) g_min at every prefix" diagnostic is deleted; see
 *     the raw-prefix scope demonstration below for why it is false.
 * (2) Real-prefix brackets DEMOTED. Lemma E as stated does NOT apply to
 *     ANY raw Riemann-zero prefix (N = 50, 200, 500, 2458, 1e4, 1e6, the
 *     first-8 case, the 7005 window): 2g0-isolation fails at all of them
 *     (consecutive zero gaps are comparable to, not double, the minimal
 *     gap), and the N = 8 case additionally has x > 1/2. The literature
 *     brackets t_c(2458) ~ 1.192e-3, t_c(1e4) ~ 1.777e-4, t_c(1e6) ~
 *     4.067e-6 are recorded as NUMERICALLY OBSERVED, certification
 *     pending -- they are NOT asserted as theorems here. Lemma E
 *     certifies only configurations that pass the per-config isolation
 *     and x <= 1/2 checks (the synthetic certificates below do).
 *
 * What is and is NOT claimed
 * --------------------------
 * PROVED: Lemma E (algebra + scalar ODE comparison), two-sided, with
 * explicit constants, machine-verified on two in-scope synthetic
 * configurations against the integrated N-body attractive flow.
 * OUT OF SCOPE (named sub-gap imp-2561-sub-real-prefix-isolation, OPEN):
 * extending the certificate to raw zero prefixes, which requires a
 * separate small-gap-isolation input the hypothesis does not supply.
 * NO false QED.
 */

// Attractive CM velocities dx_k/ds = -2 sum_{j != k} 1/(x_k - x_j).
function attractiveVelocities(xs) {
  const n = xs.length;
  const v = new Array(n).fill(0);
  for (let k = 0; k < n; k++) {
    for (let j = 0; j < n; j++) {
      if (j !== k) v[k] -= 2 / (xs[k] - xs[j]);
    }
  }
  return v;
}

function rk4Step(xs, dt) {
  const a = attractiveVelocities(xs);
  const x2 = xs.map((x, i) => x + 0.5 * dt * a[i]);
  const b = attractiveVelocities(x2);
  const x3 = xs.map((x, i) => x + 0.5 * dt * b[i]);
  const c = attractiveVelocities(x3);
  const x4 = xs.map((x, i) => x + dt * c[i]);
  const d = attractiveVelocities(x4);
  return xs.map((x, i) => x + (dt / 6) * (a[i] + 2 * b[i] + 2 * c[i] + d[i]));
}

// Build a symmetric isolated-pair configuration: a central pair of gap g0
// at +-g0/2, then M external particles per side at adjacent spacing
// 2*g0*iso (iso >= 1 enforces 2g0-isolation). Returns particles +
// pair index k (the lower member of the central pair).
function isolatedPairConfig(g0, M, iso) {
  const half = g0 / 2;
  const left = [];
  const right = [];
  let pl = -half;
  let pr = half;
  const spacing = 2 * g0 * iso;
  for (let m = 0; m < M; m++) {
    pl -= spacing;
    pr += spacing;
    left.unshift(pl);
    right.push(pr);
  }
  const xs = [...left, -half, half, ...right];
  return { xs, k: left.length };
}

// Minimal adjacent gap and "2g0-isolation holds" flag for a config whose
// minimal gap is the central pair gap g0: every OTHER adjacent gap >= 2 g0.
function isolationCheck(xs, k) {
  const g0 = xs[k + 1] - xs[k];
  let isolated = true;
  let minOtherGap = Infinity;
  for (let i = 0; i + 1 < xs.length; i++) {
    if (i === k) continue;
    const gap = xs[i + 1] - xs[i];
    if (gap < minOtherGap) minOtherGap = gap;
    if (gap < 2 * g0 - 1e-12) isolated = false;
  }
  return { g0, isolated, minOtherGap };
}

// Environment constant E0 = 2 sum_j D_j^{-2}, D_j = distance from the
// nearer pair member to external particle j.
function environmentE0(xs, k) {
  const xk = xs[k];
  const xk1 = xs[k + 1];
  let sumInv = 0;
  for (let j = 0; j < xs.length; j++) {
    if (j === k || j === k + 1) continue;
    const dNear = Math.min(Math.abs(xs[j] - xk), Math.abs(xs[j] - xk1));
    sumInv += 1 / (dNear * dNear);
  }
  return 2 * sumInv;
}

// Integrate the full N-body attractive flow until the central pair gap
// drops below gThresh, then linearly extrapolate u = g^2 to 0 using the
// near-collision slope du/ds -> -8 (Lemma D limit). Returns t_c estimate.
function measureCollisionTime(xs0, k, dt, gThresh, maxSteps) {
  let xs = xs0.slice();
  let s = 0;
  for (let i = 0; i < maxSteps; i++) {
    const g = xs[k + 1] - xs[k];
    if (g < gThresh) {
      return s + (g * g) / 8;
    }
    xs = rk4Step(xs, dt);
    s += dt;
  }
  return null;
}

// Lemma E predicted bounds for a verified-isolated config.
function lemmaEBounds(g0, E0) {
  const x = (E0 * g0 * g0) / 4;
  const lower = (g0 * g0) / 8;
  const lnUpper = x < 1 ? (1 / (2 * E0)) * Math.log(1 / (1 - x)) : Infinity;
  const taylorUpper = (g0 * g0 / 8) * (1 + x);
  return { x, lower, lnUpper, taylorUpper };
}

// ── In-scope synthetic certificates ─────────────────────────────────────────
// Two configurations that PASS 2g0-isolation and x <= 1/2; the integrated
// N-body collision time must land in [g0^2/8, lnUpper].

function certifyConfig(g0, M, iso, dt, gThresh, maxSteps) {
  const { xs, k } = isolatedPairConfig(g0, M, iso);
  const iso2g0 = isolationCheck(xs, k);
  const E0 = environmentE0(xs, k);
  const b = lemmaEBounds(g0, E0);
  const tc = measureCollisionTime(xs, k, dt, gThresh, maxSteps);
  const inScope = iso2g0.isolated && b.x <= 0.5;
  const twoSidedHolds =
    tc !== null && tc >= b.lower - 1e-9 && tc <= b.lnUpper + 1e-6;
  const lnTighter = b.lnUpper <= b.taylorUpper + 1e-12;
  return {
    g0,
    M,
    iso,
    N: xs.length,
    isolated2g0: iso2g0.isolated,
    minOtherGap: iso2g0.minOtherGap,
    E0,
    x: b.x,
    lowerBound_g0sq_over_8: b.lower,
    lnUpperBound: b.lnUpper,
    taylorUpperBound: b.taylorUpper,
    tc_measured: tc,
    inScope,
    twoSidedHolds,
    lnTighterThanTaylor: lnTighter,
  };
}

const CERT_A = certifyConfig(1.0, 4, 1.0, 2e-5, 0.02, 200000);
const CERT_B = certifyConfig(0.4, 4, 1.0, 1e-5, 0.01, 200000);

// ── Out-of-scope demonstration: raw zero prefix fails 2g0-isolation ──────────
// The first 8 Riemann-zero ordinates. The minimal adjacent gap is ~2.408;
// 2g0-isolation would require EVERY other gap >= 4.816, but the 21.02->25.01
// gap is ~3.989 < 4.816, so the hypothesis FAILS and Lemma E does not apply.
const FIRST_8_ZEROS = [
  14.134725, 21.022040, 25.010858, 30.424876,
  32.935062, 37.586178, 40.918719, 43.327073,
];

function rawPrefixIsolationFails(xs) {
  const gaps = xs.slice(1).map((x, i) => x - xs[i]);
  const gMin = Math.min(...gaps);
  // among the OTHER gaps (exclude one instance of the minimal gap), is any
  // strictly below 2 * gMin? If so, 2g0-isolation fails.
  let removedMin = false;
  let failingGap = null;
  for (const g of gaps) {
    if (!removedMin && Math.abs(g - gMin) < 1e-12) { removedMin = true; continue; }
    if (g < 2 * gMin) { failingGap = g; break; }
  }
  return { gMin, twoGMin: 2 * gMin, failingGap, isolationFails: failingGap !== null };
}

const RAW_PREFIX_SCOPE = rawPrefixIsolationFails(FIRST_8_ZEROS);

// Numerically-observed literature brackets (NOT certified by Lemma E; the
// 2g0-isolation hypothesis fails on these raw prefixes). Recorded only so
// the certification-pending status is explicit and auditable.
const OBSERVED_UNCERTIFIED_BRACKETS = [
  { N: 2458, tc_observed: 1.19231e-3, status: 'numerically observed, certification pending' },
  { N: 10000, tc_observed: 1.7780e-4, status: 'numerically observed, certification pending' },
  { N: 1000000, tc_observed: 4.0667e-6, status: 'numerically observed, certification pending' },
];

// ── The record ───────────────────────────────────────────────────────────────

export const ISOLATED_PAIR_PINCH_IMP2561 = {
  id: 'imp-2561',
  parent: 'backward-flow-stability-gronwall.js (Lemma D lower bound companion)',
  verdict: 'HONEST PARTIAL CLOSURE',
  status:
    'Lemma E (isolated-pair pinch) PROVED two-sided with the matched ' +
    'constant 1/8: under 2g0-isolation and x = E0 g0^2/4 <= 1/2, ' +
    'g0^2/8 <= t_c <= (1/(2 E0)) ln(1/(1-x)) <= (g0^2/8)(1+x). Verified ' +
    'on two synthetic in-scope configurations against the integrated ' +
    'N-body attractive flow. Real Riemann-zero prefixes are OUT OF SCOPE ' +
    '(2g0-isolation fails); their observed t_c brackets are recorded as ' +
    'certification-pending, not asserted as theorems.',
  lemmaE: {
    relativeDynamics: 'dg/ds = -4/g + R, R = 2 g sum 1/((x_{k+1}-x_j)(x_k-x_j))',
    gapSquaredODE: 'd(g^2)/ds = -8 + 4 g^2 S, 0 < S <= E0/2, E0 = 2 sum D_j^{-2}',
    upperBound: 't_c <= (1/(2 E0)) ln(1/(1-x)) <= (g0^2/8)(1+x), x = E0 g0^2/4',
    lowerBound: 't_c >= g_min^2/8 (Lemma D), same constant 1/8',
    sideCondition: 'x <= 1/2 (also forces x < 1, the genuine-collapse regime)',
    isolationHypothesis: '2g0-isolation: every adjacent gap other than g0 is >= 2 g0',
  },
  syntheticCertificates: [CERT_A, CERT_B],
  rawPrefixScope: {
    demonstration: RAW_PREFIX_SCOPE,
    note:
      'first-8 zeros: minimal gap ~2.408 but the 21.02->25.01 gap ~3.989 < ' +
      '4.816 = 2 g_min, so 2g0-isolation FAILS. This is why the literature ' +
      'brackets are not certified here.',
    observedUncertifiedBrackets: OBSERVED_UNCERTIFIED_BRACKETS,
  },
  subGaps: [
    {
      id: 'imp-2561-sub-real-prefix-isolation',
      status: 'open',
      statement:
        'Extend the Lemma E certificate to raw Riemann-zero prefixes. The ' +
        '2g0-isolation hypothesis fails at every tested prefix, so a ' +
        'separate small-gap-isolation input (a positive-proportion ' +
        'well-separated-pair statement) is required before the observed ' +
        'brackets t_c(2458) ~ 1.19e-3 etc. can be promoted to theorems.',
    },
  ],
};

// ── Build-time assertions (self-executing on import) ──────────────────────────

export const ISOLATED_PAIR_PINCH_IMP2561_ASSERTIONS = [
  {
    id: 'imp2561-lemmaE-two-sided-certA',
    holds: () =>
      CERT_A.isolated2g0 &&
      CERT_A.inScope &&
      CERT_A.twoSidedHolds &&
      CERT_A.lnTighterThanTaylor,
    why:
      'Synthetic certificate A (g0 = 1, M = 4, 2g0-spacing): the config ' +
      'passes 2g0-isolation and x <= 1/2, and the integrated N-body ' +
      'collision time lies in [g0^2/8, (1/(2 E0)) ln(1/(1-x))]. Failure ' +
      'means the relative-dynamics algebra or the ODE comparison is wrong.',
  },
  {
    id: 'imp2561-lemmaE-two-sided-certB',
    holds: () =>
      CERT_B.isolated2g0 &&
      CERT_B.inScope &&
      CERT_B.twoSidedHolds &&
      CERT_B.lnTighterThanTaylor,
    why:
      'Synthetic certificate B (g0 = 0.4): a second in-scope configuration ' +
      'at a different pair scale must also satisfy the two-sided Lemma E ' +
      'bound, confirming the bound is scale-correct, not tuned to g0 = 1.',
  },
  {
    id: 'imp2561-matched-constant-eighth',
    holds: () =>
      Math.abs(CERT_A.lowerBound_g0sq_over_8 - (CERT_A.g0 * CERT_A.g0) / 8) < 1e-12 &&
      CERT_A.taylorUpperBound >= CERT_A.lowerBound_g0sq_over_8,
    why:
      'The pinch lower and upper bounds must share the constant 1/8: ' +
      'lower = g0^2/8 and upper = (g0^2/8)(1+x) >= lower. This is the ' +
      'sharpened Theta-squeeze that sg1-theta-contraction.js consumes.',
  },
  {
    id: 'imp2561-raw-prefix-out-of-scope',
    holds: () =>
      RAW_PREFIX_SCOPE.isolationFails &&
      ISOLATED_PAIR_PINCH_IMP2561.subGaps[0].status === 'open' &&
      ISOLATED_PAIR_PINCH_IMP2561.verdict === 'HONEST PARTIAL CLOSURE',
    why:
      'Referee MUST-FIX tripwire: raw zero prefixes must keep FAILING ' +
      '2g0-isolation (so Lemma E genuinely does not certify them), the ' +
      'sub-gap stays OPEN, and the verdict stays an honest partial ' +
      'closure. Flipping any of these requires actually closing the ' +
      'real-prefix isolation gap in the same commit.',
  },
];

// Self-execute the checks so any import of this module exercises Lemma E.
for (const a of ISOLATED_PAIR_PINCH_IMP2561_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error('imp-2561 assertion failed: ' + a.id + ' -- ' + a.why);
  }
}
