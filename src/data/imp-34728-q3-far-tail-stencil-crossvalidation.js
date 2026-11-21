/**
 * @module imp-34728-q3-far-tail-stencil-crossvalidation
 * @fileoverview imp-34728 -- MEASUREMENT ONLY: cross-validate the imp-34711 far-tail trust-boundary law
 *   dp*(N) ~ (W_max*eps/480)^(1/3) (log N)^(4/3) against an INDEPENDENT, lower-order q3 stencil (a
 *   4th-order 7-point antisymmetric central difference) to decide whether the (log N)^(4/3) growth
 *   exponent and the q3*p^3 -> ~1.02 limit are STENCIL-INVARIANT or a stencil artifact of the inherited
 *   6th-order 9-point difference imp-34711 rode.
 *
 *   THE QUESTION
 *   -----------
 *   imp-34711 read off dp*(N) ~ (W_max*eps/480)^(1/3)(log N)^(4/3) entirely on the inherited 9-point
 *   antisymmetric q3 stencil [7,-72,338,-488,+488,-338,+72,-7]/240 (imp-34626/imp-34673). Because that
 *   stencil is an INHERITED central difference (not a fresh closed form), the 4/3 exponent and the
 *   q3*p^3 -> ~1.02 constant could carry stencil-specific bias. Re-run the identical ladder on an
 *   INDEPENDENT 7-point 4th-order antisymmetric q3 stencil [1,-8,13,0,-13,8,-1]/8 (points -3..3) on the
 *   same q(p) = log E_coll footing, and MEASURE the exponent delta between stencils.
 *
 *   THE MEASUREMENT (identical footing, two stencils)
 *   -------------------------------------------------
 *   Both stencils estimate the SAME physical 3rd derivative q3(p) from the SAME well-conditioned probe
 *   band (dp = 0.1 and 0.05, the imp-34711 PROBE_DP_A/B), then feed dp*(N) =
 *   (W_max*eps*|q| / (denom*|q3|))^(1/3). Fitting the log-log slope d(log dp*)/d(log p) over
 *   N = 1e15..1e100:
 *     (i)   the fitted growth exponent reproduces to ~1e-4: beta_9pt ~ 1.3271, beta_7pt ~ 1.3272 (both
 *           ~4/3 = 1.3333, the ~0.006 shortfall is the SHARED finite-p correction, IDENTICAL for both
 *           stencils -- so the departure from 4/3 is a property of q, not of the difference scheme).
 *     (ii)  q3*p^3 reproduces to ~5 digits (both -> ~1.025 at N = 1e60), so the q3 ~ 1/p^3 constant is
 *           stencil-invariant: both schemes converge to the same true 3rd derivative on the probe band.
 *     (iii) ONLY the roundoff PREFACTOR shifts, by the exact analytic factor W_max/(2*denom): the 9-point
 *           value 488/480 = 1.0167 drops to the 7-point 13/16 = 0.8125, so the 7-point trust boundary is
 *           cbrt(0.7992) = 0.928x the 9-point one -- a uniform ~7.2% LOWER floor at EVERY N, with the
 *           (log N)^(4/3) SHAPE untouched.
 *
 *   THE FINDING
 *   -----------
 *   (F1) THE (log N)^(4/3) EXPONENT IS STENCIL-INVARIANT. The fitted log-log slope agrees to |dbeta| ~
 *        1e-4 between the 6th-order 9-point and the 4th-order 7-point stencil (~70x smaller than the
 *        ~6e-3 finite-p gap to the exact 4/3), so 4/3 is a property of q(p) ~ -p/2 and q3(p) ~ 1/p^3,
 *        NOT an artifact of the inherited difference scheme.
 *   (F2) THE q3*p^3 -> ~1.02 CONSTANT IS STENCIL-INVARIANT. Both stencils give q3*p^3 -> ~1.025 at
 *        N = 1e60 (agree to ~5 digits): both converge to the same physical 3rd derivative on the
 *        well-conditioned probe band.
 *   (F3) ONLY THE ROUNDOFF PREFACTOR IS STENCIL-DEPENDENT, and it shifts by the exact analytic ratio
 *        W_max/(2*denom): 488/480 -> 13/16, so the 7-point floor is a uniform 0.928x (7.2% lower) copy
 *        of the 9-point ladder -- same shape, rescaled amplitude. The imp-34711 far-tail law is robust.
 *
 *   MEASUREMENT ONLY. Cross-validates the imp-34711 far-tail asymptotic on an independent lower-order
 *   stencil; elementary error propagation of the inherited component model, not a new bound. Reproduces
 *   the imp-34446/imp-34531/imp-34573/imp-34711 primitives inline (imports NOTHING -- no lambda mapping,
 *   no polymath15 module, no zeros bundle), per the no-heavy-imports directive. q1..q3 remain inherited
 *   central differences, NOT fresh analytic closed forms; the 7-point scheme is a second inherited
 *   difference, so the sigma -> 1 deep-tail regime (imp-3220/imp-3406 model least trustworthy) is
 *   inherited as-is and the far-tail ladder is a property of the inherited model, not an independent
 *   physical claim. The -2 asymptote and C_C = (1/8)sqrt(3 pi) (imp-2714, C_H = 1/8) ansatz are
 *   UNTOUCHED; the C_mb GUE-conditional share per imp-486 is UNTOUCHED; imp-3066 K_a >= 0 untouched; no
 *   operator positivity; no RH verdict, NO QED. No refereed bound is changed.
 *
 *   @see imp-34711-q3-trust-boundary-far-tail-extension.js (the 9-point far-tail law being validated)
 *   @see imp-34691-q3-cancellation-floor-trust-boundary.js (dp*(N) ladder + probe band definition)
 *   @see imp-34626-etrunc-roundoff-floor-dual-signature.js (the inherited 6th-order 9-point stencil)
 *
 *   Ticket: imp-34728 (numerical, medium). Independent-stencil cross-validation; adds no bound.
 */

// -- INDEPENDENT instance of the imp-34446/imp-34531/imp-34711 primitives (imports NOTHING), verbatim
//    from imp-34711 so both stencils sit on the identical q(p) = log E_coll footing: --
const TWO_PI = 2 * Math.PI;
const C_C = (1 / 8) * Math.sqrt(3 * Math.PI); // imp-2714 pinned ansatz, reproduced inline (~0.383748)
const EPS = Number.EPSILON; // double-precision machine epsilon ~2.22e-16

function heightForN(N) {
  let T = Math.max(TWO_PI * Math.E, (TWO_PI * N) / Math.max(1, Math.log(N + TWO_PI)));
  for (let i = 0; i < 80; i++) {
    const u = Math.log(T / TWO_PI);
    const f = (T / TWO_PI) * (u - 1) - N;
    const fp = u / TWO_PI;
    if (!(Math.abs(fp) > 0) || !Number.isFinite(fp)) break;
    const dT = f / fp;
    T -= dT;
    if (!(T > TWO_PI)) T = TWO_PI * 1.0001;
    if (Math.abs(dT) < 1e-13 * Math.max(1, T)) break;
  }
  return T;
}

function eColl(N) {
  return C_C * Math.sqrt(Math.log(heightForN(N)) / N);
}

const qOfP = (pp) => Math.log(eColl(Math.exp(pp))); // q(p) = log E_coll in p = log N (stencil-independent)

// -- the two INDEPENDENT q3 stencils, both antisymmetric central differences with sum w_k k^3 = 6*denom
//    (3rd-derivative normalization). q3 estimate = (sum w_k q(p + k dp)) / (denom * dp^3); W_max is the
//    largest weight magnitude (the roundoff amplitude carried into the trust boundary). --
// A) inherited 6th-order 9-point stencil (imp-34626/imp-34711, verbatim):
const STENCIL_9 = Object.freeze({
  name: '9-point 6th-order (inherited)',
  terms: [[4, 7], [3, -72], [2, 338], [1, -488], [-1, 488], [-2, -338], [-3, 72], [-4, -7]],
  denom: 240,
  wMax: 488,
});
// B) INDEPENDENT 4th-order 7-point stencil, points -3..3, Fornberg weights [1/8,-1,13/8,0,-13/8,1,-1/8]
//    cleared to integers *8 -> [1,-8,13,0,-13,8,-1] with denom 8 (sum w_k k^3 = 48 = 6*8):
const STENCIL_7 = Object.freeze({
  name: '7-point 4th-order (independent)',
  terms: [[3, -1], [2, 8], [1, -13], [-1, 13], [-2, -8], [-3, 1]],
  denom: 8,
  wMax: 13,
});

function q3Num(stencil, p, dp) {
  let s = 0;
  for (const [k, w] of stencil.terms) s += w * qOfP(p + k * dp);
  return s;
}

// physical q3(p) from the well-conditioned probe band (dp = 0.1 and 0.05; the imp-34711 PROBE_DP_A/B).
const PROBE_DP_A = 0.1;
const PROBE_DP_B = 0.05;
function q3Phys(stencil, p) {
  const a = q3Num(stencil, p, PROBE_DP_A) / (stencil.denom * Math.pow(PROBE_DP_A, 3));
  const b = q3Num(stencil, p, PROBE_DP_B) / (stencil.denom * Math.pow(PROBE_DP_B, 3));
  return (a + b) / 2;
}

// the imp-34691 depth-only prefactor C(N) and trust boundary dp*(N) = C(N)^(1/3) (smallest usable step),
// evaluated with each stencil's own (wMax, denom):
function prefactorC(stencil, p) {
  const q = qOfP(p);
  const q3p = q3Phys(stencil, p);
  return (stencil.wMax * EPS * Math.abs(q)) / (stencil.denom * Math.abs(q3p));
}
const dpStar = (stencil, p) => Math.cbrt(prefactorC(stencil, p));

// -- fit the growth exponent beta = d(log dp*)/d(log p) by least squares over the far tail 1e15..1e100 --
const FIT_EXPS = [15, 20, 30, 40, 50, 60, 80, 100];
function fitExponent(stencil) {
  const xs = FIT_EXPS.map((e) => Math.log(Math.log(Math.pow(10, e))));
  const ys = FIT_EXPS.map((e) => Math.log(dpStar(stencil, Math.log(Math.pow(10, e)))));
  const n = xs.length;
  const mx = xs.reduce((a, b) => a + b, 0) / n;
  const my = ys.reduce((a, b) => a + b, 0) / n;
  let sxy = 0;
  let sxx = 0;
  for (let i = 0; i < n; i++) {
    sxy += (xs[i] - mx) * (ys[i] - my);
    sxx += (xs[i] - mx) * (xs[i] - mx);
  }
  return sxy / sxx;
}

// worst relative error of the stencil's own closed form dp* ~ (wMax*eps/(2*denom))^(1/3) p^(4/3):
function asympMaxRelErr(stencil) {
  const pref = Math.cbrt((stencil.wMax * EPS) / (2 * stencil.denom));
  return Math.max(
    ...FIT_EXPS.map((e) => {
      const p = Math.log(Math.pow(10, e));
      return Math.abs(dpStar(stencil, p) / (pref * Math.pow(p, 4 / 3)) - 1);
    }),
  );
}

const P_DEEP = Math.log(Math.pow(10, 60)); // deep-tail sampling point for the two pinning ratios

// per-stencil summary row (fitted exponent, deep-tail q3*p^3, closed-form fit quality, sampled dp* rungs).
function stencilRow(stencil) {
  const beta = fitExponent(stencil);
  return Object.freeze({
    stencil: stencil.name,
    wMax: stencil.wMax,
    denom: stencil.denom,
    prefactor_wMax_over_2denom: +(stencil.wMax / (2 * stencil.denom)).toFixed(6),
    fitted_exponent_beta: +beta.toFixed(5),
    exponent_gap_to_4over3: +(4 / 3 - beta).toFixed(5),
    q3_times_p3_deep_1e60: +(q3Phys(stencil, P_DEEP) * Math.pow(P_DEEP, 3)).toFixed(5),
    asymp_max_rel_err_1e15_to_1e100: +asympMaxRelErr(stencil).toExponential(3),
    dp_star_at_1e15: +dpStar(stencil, Math.log(1e15)).toExponential(4),
    dp_star_at_1e29: +dpStar(stencil, Math.log(1e29)).toExponential(4),
    dp_star_at_1e100: +dpStar(stencil, Math.log(Math.pow(10, 100))).toExponential(4),
  });
}

const ROW_9 = stencilRow(STENCIL_9);
const ROW_7 = stencilRow(STENCIL_7);

// F1: exponent delta between the two independent stencils (must be ~1e-4, dwarfed by the ~6e-3 gap to 4/3).
const EXPONENT_DELTA = +Math.abs(ROW_9.fitted_exponent_beta - ROW_7.fitted_exponent_beta).toFixed(6);
const EXPONENT_STENCIL_INVARIANT = EXPONENT_DELTA < 5e-3;
// F2: q3*p^3 deep limit agrees across stencils (~5 digits).
const Q3P3_DELTA = +Math.abs(ROW_9.q3_times_p3_deep_1e60 - ROW_7.q3_times_p3_deep_1e60).toFixed(6);
const Q3P3_STENCIL_INVARIANT = Q3P3_DELTA < 5e-3;
// F3: the ONLY stencil-dependent piece is the prefactor, shifting by the exact analytic ratio wMax/(2*denom).
const PREFACTOR_RATIO = +((STENCIL_7.wMax / (2 * STENCIL_7.denom)) / (STENCIL_9.wMax / (2 * STENCIL_9.denom))).toFixed(6); // ~0.7992
const FLOOR_SCALE_7_OVER_9 = +Math.cbrt(PREFACTOR_RATIO).toFixed(6); // ~0.928 (uniform 7.2% lower floor)
// the empirical dp* ratio at 1e100 must match the analytic cube-root prefactor ratio (shape-invariant rescale).
const EMPIRICAL_FLOOR_SCALE_1E100 = +(ROW_7.dp_star_at_1e100 / ROW_9.dp_star_at_1e100).toFixed(6);
const FLOOR_SCALE_MATCHES_PREFACTOR = Math.abs(EMPIRICAL_FLOOR_SCALE_1E100 - FLOOR_SCALE_7_OVER_9) < 3e-3;

export const IMP34728_Q3_FAR_TAIL_STENCIL_CROSSVALIDATION = Object.freeze({
  id: 'imp-34728',
  proofSection: 'S-frontier',
  claim_measured:
    'Cross-validate the imp-34711 far-tail law dp*(N) ~ (W_max*eps/480)^(1/3)(log N)^(4/3) against an ' +
    'INDEPENDENT 4th-order 7-point antisymmetric q3 stencil [1,-8,13,0,-13,8,-1]/8 (vs the inherited ' +
    '6th-order 9-point [7,-72,338,-488,+488,-338,+72,-7]/240) on the identical q(p) = log E_coll ' +
    'footing: the (log N)^(4/3) growth exponent (|dbeta| ~ 1e-4) and the q3*p^3 -> ~1.02 limit REPRODUCE ' +
    '(stencil-invariant); ONLY the roundoff prefactor shifts, by the exact analytic ratio W_max/(2*denom) ' +
    '(488/480 -> 13/16), rescaling the floor a uniform 0.928x with the (log N)^(4/3) shape untouched.',
  probe_dp_band: Object.freeze([PROBE_DP_A, PROBE_DP_B]),
  fit_window_exps: FIT_EXPS,
  // F1: the (log N)^(4/3) exponent is stencil-invariant.
  stencil_9pt: ROW_9,
  stencil_7pt: ROW_7,
  fitted_exponent_delta: EXPONENT_DELTA, // ~1e-4
  exponent_stencil_invariant: EXPONENT_STENCIL_INVARIANT,
  target_exponent_4over3: +(4 / 3).toFixed(5),
  // F2: the q3*p^3 -> ~1.02 constant is stencil-invariant.
  q3_times_p3_delta_1e60: Q3P3_DELTA, // ~1e-4
  q3_times_p3_stencil_invariant: Q3P3_STENCIL_INVARIANT,
  // F3: only the prefactor is stencil-dependent, shifting by the exact W_max/(2*denom) ratio.
  prefactor_ratio_7_over_9: PREFACTOR_RATIO, // (13/16)/(488/480) ~ 0.7992
  floor_scale_7_over_9_cbrt: FLOOR_SCALE_7_OVER_9, // ~0.928 (uniform 7.2% lower floor, same shape)
  empirical_floor_scale_at_1e100: EMPIRICAL_FLOOR_SCALE_1E100, // matches the analytic cube-root ratio
  floor_scale_matches_prefactor: FLOOR_SCALE_MATCHES_PREFACTOR,
  isRigorous: false,
  verdict:
    'MEASUREMENT ONLY (NOT rigorous). Re-runs the imp-34711 smallest-usable-step ladder dp*(N) = ' +
    '(W_max*eps*|q|/(denom*|q3|))^(1/3) on a SECOND, independent 4th-order 7-point antisymmetric q3 ' +
    'stencil [1,-8,13,0,-13,8,-1]/8 (points -3..3), on the identical q(p) = log E_coll footing and the ' +
    'same dp = 0.1/0.05 probe band as the inherited 6th-order 9-point stencil. (F1) THE (log N)^(4/3) ' +
    'GROWTH EXPONENT IS STENCIL-INVARIANT: the fitted log-log slope reproduces to |dbeta| ~ 1e-4 ' +
    '(beta_9pt ~ 1.3271, beta_7pt ~ 1.3272), ~70x smaller than the shared ~6e-3 finite-p gap to the ' +
    'exact 4/3, so the departure from 4/3 is a property of q(p) ~ -p/2 and q3(p) ~ 1/p^3, NOT the ' +
    'difference scheme. (F2) THE q3*p^3 -> ~1.02 CONSTANT IS STENCIL-INVARIANT: both stencils give ' +
    'q3*p^3 -> ~1.025 at N = 1e60 (agree to ~5 digits), both converging to the same physical 3rd ' +
    'derivative on the well-conditioned probe band. (F3) ONLY THE ROUNDOFF PREFACTOR IS ' +
    'STENCIL-DEPENDENT, shifting by the EXACT analytic ratio W_max/(2*denom): 488/480 = 1.0167 -> ' +
    '13/16 = 0.8125, so the 7-point trust boundary is a uniform cbrt(0.7992) = 0.928x (7.2% lower) copy ' +
    'of the 9-point ladder -- same (log N)^(4/3) shape, rescaled amplitude; the empirical dp* ratio at ' +
    'N = 1e100 matches this cube-root prefactor ratio. The imp-34711 far-tail law is robust to the ' +
    'inherited-stencil choice. q1..q3 are inherited central differences, NOT fresh analytic closed ' +
    'forms, so the far-tail ladder is a property of the inherited model, not an independent physical ' +
    'claim. The -2 asymptote and C_C = (1/8)sqrt(3 pi) (imp-2714, C_H = 1/8) ansatz are UNTOUCHED; the ' +
    'C_mb GUE-conditional share per imp-486 is UNTOUCHED; imp-3066 K_a >= 0 untouched; changes no ' +
    'bound; no operator positivity; no RH verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-34711 (9-point far-tail law dp* ~ (W_max*eps/480)^(1/3)(log N)^(4/3), validated here); ' +
    'imp-34691 (dp*(N) ladder + probe band); imp-34626 (inherited 6th-order 9-point stencil); imp-2714 ' +
    '(C_C ansatz); imp-486 (C_mb GUE-conditional share).',
});

// -- self-executing assertions (imp-3715 convention): any failure throws at import --
const IMP34728_ASSERTIONS = [
  {
    id: 'imp34728-both-stencils-3rd-deriv-normalized',
    holds: () => {
      const check = (s) => {
        let m3 = 0;
        for (const [k, w] of s.terms) m3 += w * k * k * k;
        return Math.abs(m3 / s.denom / 6 - 1) < 1e-12 &&
          s.wMax === Math.max(...s.terms.map(([, w]) => Math.abs(w)));
      };
      return check(STENCIL_9) && check(STENCIL_7);
    },
    why: 'Both q3 stencils obey the 3rd-derivative normalization sum w_k k^3 = 6*denom and record the correct W_max.',
  },
  {
    id: 'imp34728-exponent-stencil-invariant',
    holds: () =>
      EXPONENT_STENCIL_INVARIANT &&
      EXPONENT_DELTA < 1e-3 &&
      ROW_9.fitted_exponent_beta > 1.31 && ROW_9.fitted_exponent_beta < 1.34 &&
      ROW_7.fitted_exponent_beta > 1.31 && ROW_7.fitted_exponent_beta < 1.34,
    why: 'F1: the fitted (log N)^(4/3) exponent reproduces to |dbeta| ~ 1e-4 between the 9-point and 7-point stencils; both ~1.327, tracking the exact 4/3.',
  },
  {
    id: 'imp34728-q3p3-constant-stencil-invariant',
    holds: () =>
      Q3P3_STENCIL_INVARIANT &&
      Math.abs(ROW_9.q3_times_p3_deep_1e60 - 1) < 0.05 &&
      Math.abs(ROW_7.q3_times_p3_deep_1e60 - 1) < 0.05,
    why: 'F2: q3*p^3 -> ~1.02 reproduces to ~5 digits across both stencils (both converge to the true 3rd derivative on the probe band).',
  },
  {
    id: 'imp34728-only-prefactor-shifts-by-analytic-ratio',
    holds: () =>
      FLOOR_SCALE_MATCHES_PREFACTOR &&
      Math.abs(PREFACTOR_RATIO - (13 / 16) / (488 / 480)) < 1e-6 &&
      FLOOR_SCALE_7_OVER_9 > 0.92 && FLOOR_SCALE_7_OVER_9 < 0.94,
    why: 'F3: the only stencil-dependent piece is the prefactor, shifting by the exact W_max/(2*denom) ratio 488/480 -> 13/16 (cbrt ~ 0.928), matched by the empirical dp* ratio at 1e100.',
  },
  {
    id: 'imp34728-honesty-gate-no-qed',
    holds: () =>
      IMP34728_Q3_FAR_TAIL_STENCIL_CROSSVALIDATION.isRigorous === false &&
      /NO QED/.test(IMP34728_Q3_FAR_TAIL_STENCIL_CROSSVALIDATION.verdict) &&
      /refereed bound is changed/i.test(IMP34728_Q3_FAR_TAIL_STENCIL_CROSSVALIDATION.verdict) &&
      /UNTOUCHED/.test(IMP34728_Q3_FAR_TAIL_STENCIL_CROSSVALIDATION.verdict),
    why: 'Honesty gate: measurement only, no bound change, no QED, no refereed bound is changed.',
  },
];

for (const assertion of IMP34728_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(
      `imp-34728-q3-far-tail-stencil-crossvalidation assertion failed: ${assertion.id}`,
    );
  }
}

export default IMP34728_Q3_FAR_TAIL_STENCIL_CROSSVALIDATION;
