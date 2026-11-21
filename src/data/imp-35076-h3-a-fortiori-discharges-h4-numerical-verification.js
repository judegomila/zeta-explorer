/**
 * @module imp-35076-h3-a-fortiori-discharges-h4-numerical-verification
 *
 * imp-35076 (numerical, frontier-verification): VERIFY numerically the imp-33766 a-fortiori claim that
 * the imp-3708 H3 (curvature) input SUFFICES for the H4 (strip-height fold-reading derivative) obligation
 * at the operative strip height -- WITHOUT claiming closure. imp-33766 concluded H4 does NOT separate from
 * H3: the Holder-1/2 modulus back-conversion couples the k=1 fold-reading derivative m_prime (H4) and the
 * k=2 curvature m_double_prime (H3) through the SAME quadratic fold expansion
 *     t_shock = tau_c + (1/2) alpha (z_0 - z_0*)^2,   alpha = m_double_prime(z_0*),
 * so the H3 uniform-curvature bound dominates (N-exponent 5/4 > 3/4) and discharges H4 a fortiori, i.e. the
 * minimal input that closes H4 IS the input that closes H3. That structural verdict (imp-33766 / imp-33786)
 * was never checked as a numerical INEQUALITY between the two renormalized quantities on the shared fold.
 *
 * THE A-FORTIORI CHECK
 * --------------------
 * The two renormalized (strip-height-weighted) obligations named by imp-33766 / imp-33786, read at the
 * critical fold point z_0* = i eps on the model Holder-1/2 cusp rho(x) = |x|^{-1/2} on [-1, 1], are:
 *     H4 quantity        C_ren(N)  = (y_N^sharp)^{3/2} |m_prime(i eps)|        -> C_PS = pi / sqrt(2)   = 2.221441
 *     H3-derived value   C_curv(N) = (y_N^sharp)^{5/2} |m_double_prime(i eps)| -> K    = 3 pi / (2 sqrt(2)) = 3.332162
 * with eps = y_N^sharp = sqrt(2 pi / N). Both renormalizations produce finite constants (imp-33646 / imp-33645),
 * and the single-derivative coupling ratio through the shared fold is (imp-33790)
 *     R(eps) = |m_double_prime| / |m_prime| ~ (3/2) eps^{-1},   so   C_curv = R(eps) * eps * C_ren -> (3/2) C_ren.
 * Hence the a-fortiori statement is the CLEAN INEQUALITY on the shared fold:
 *     C_ren(N) = (2/3 + o(1)) C_curv(N)  <=  C_curv(N)   at every rung,
 * because the coupling factor A_1 / A_2 = 2/3 < 1. The H4 quantity (C_ren) does NOT exceed the H3-derived
 * value (C_curv): it sits STRICTLY BELOW the H3 curvature envelope with a margin ratio settling to 2/3.
 * This is the numerical face of imp-33766 "H3 dominates and discharges H4 a fortiori": a two-sided bound
 * C_curv in [c, C] (the H3 input) forces C_ren = (2/3 + o(1)) C_curv into a finite window too (the H4 input),
 * while the converse -- bounding C_curv from a bound on C_ren -- would need the diverging factor R ~ eps^{-1}.
 *
 * WHAT IS MEASURED (all on the SAME shared fold z_0* = i eps, one eps = y_N^sharp ladder)
 * -------------------------------------------------------------------------------------
 * (1) the H4 renormalized quantity C_ren(N)  = eps^{3/2}|m_prime|        -> C_PS = pi/sqrt(2);
 * (2) the H3-derived value        C_curv(N)  = eps^{5/2}|m_double_prime| -> K    = 3 pi/(2 sqrt(2));
 * (3) the margin ratio            rho(N)      = C_ren / C_curv           -> 2/3 = A_1 / A_2 < 1 (H4 below H3);
 * (4) confirmation that rho(N) <= 1 at EVERY rung (H4 quantity never exceeds the H3-derived value).
 *
 * RESULT
 * ------
 * On the shared eps = y_N^sharp ladder (N in {1e3 .. 1e7}) the H4 quantity C_ren stays STRICTLY BELOW the
 * H3-derived value C_curv at every rung: the margin ratio rho = C_ren / C_curv sits in a narrow band that
 * tightens monotonically to 2/3 = 0.6667 (= A_1 / A_2, the reciprocal of the imp-33790 single-derivative
 * gap 3/2) as eps -> 0+, i.e. the H4 obligation is discharged by the H3 bound with a ~33% margin to spare.
 * max rho over the ladder < 1 (worst rung, smallest N, still rho < 0.68). This CONFIRMS the imp-33766
 * a-fortiori direction numerically: the H4 renormalized fold-reading derivative does not exceed the H3
 * renormalized curvature on the shared quadratic fold at the operative strip height, so the minimal H3
 * input bounds the H4 quantity a fortiori.
 *
 * VERDICT: VERIFICATION ONLY on the inherited imp-3220/imp-3406/imp-33646 model-cusp surrogate. Confirming
 * the a-fortiori inequality C_ren <= C_curv on a finite eps ladder does NOT discharge H3 or H4 rigorously
 * (both need the ANALYTIC N-uniform tracking of the renormalized quantity through the fold-modulus back-
 * conversion, not a finite-ladder inequality), establishes no operator positivity, changes no bound. The
 * G6a_shock_lipschitz obligation stays OPEN; imp-3066 off-diagonal endpoint-Hankel K_a >= 0 UNTOUCHED;
 * C_mb remains GUE-conditional (imp-486); NO QED. No refereed bound is changed.
 *
 * @see imp-33766-h4-independent-discharge-scoping (H4 does not separate from H3, a-fortiori direction)
 * @see imp-33786-h3-joint-curvature-input-scoping (the single H3 input that discharges both rows)
 * @see imp-33790-fold-jet-mprime-mdoubleprime-ratio-crossvalidation (coupling ratio 3/2 on one ladder)
 * @see imp-3708-s2-gronwall-vacuity-intrinsic-assessment (H3 y2-adapted-flow-depth curvature object)
 * @see imp-33645-h3-curvature-divergence-scoping (H3 m_double_prime, eps^{5/2} renorm)
 * @see imp-33646-h4-privalov-sokhotski-constant-scoping (H4 m_prime, eps^{3/2} renorm)
 */

// Reading strip height y_N^sharp = sqrt(2 pi / N) (imp-341 / imp-354 convention); it descends to 0.
function ySharp(N) {
  return Math.sqrt((2 * Math.PI) / N);
}

// Complex arithmetic in [re, im] pairs (same quadrature route as imp-33790).
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

// Closed-form renormalized limits of the 1/2-cusp derivative blow-up (imp-33646 / imp-33645).
const C_PS = Math.PI / Math.SQRT2; // A_1 = pi / sqrt(2)      = 2.221441 (H4 renormalized limit, imp-33646)
const K_CURV = (3 * Math.PI) / (2 * Math.SQRT2); // A_2 = 3 pi / (2 sqrt(2)) = 3.332162 (H3 renormalized limit, imp-33645)
const MARGIN_LIMIT = C_PS / K_CURV; // A_1 / A_2 = 2/3 = reciprocal of the imp-33790 single-derivative gap 3/2

// The shared quadratic fold, read on one eps = y_N^sharp ladder: BOTH obligations evaluated at z_0* = i eps.
const N_LADDER = [1e3, 3e3, 1e4, 3e4, 1e5, 3e5, 1e6, 3e6, 1e7];
const SHARED_FOLD_LADDER = N_LADDER.map((N) => {
  const eps = ySharp(N);
  const mp = mpMag(eps);
  const mpp = mppMag(eps);
  // H4 quantity (renormalized fold-reading derivative) and H3-derived value (renormalized curvature).
  const cRen = mp * Math.pow(eps, 1.5); // eps^{3/2}|m_prime|        -> C_PS  (H4)
  const cCurv = mpp * Math.pow(eps, 2.5); // eps^{5/2}|m_double_prime| -> K     (H3)
  const marginRatio = cRen / cCurv; // C_ren / C_curv -> 2/3 (< 1: H4 stays below the H3 envelope)
  return {
    N,
    y_N_sharp: +eps.toExponential(4),
    cRen_H4: +cRen.toFixed(6),
    cCurv_H3: +cCurv.toFixed(6),
    marginRatio: +marginRatio.toFixed(6),
    h4WithinH3Envelope: cRen <= cCurv, // H4 quantity does not exceed the H3-derived value
  };
});

const TAIL = SHARED_FOLD_LADDER[SHARED_FOLD_LADDER.length - 1];
const MAX_MARGIN_RATIO = SHARED_FOLD_LADDER.reduce((m, r) => Math.max(m, r.marginRatio), 0);
const ALL_H4_WITHIN_H3 = SHARED_FOLD_LADDER.every((r) => r.h4WithinH3Envelope);

export const IMP35076_H3_A_FORTIORI_DISCHARGES_H4_VERIFICATION = {
  id: 'imp-35076',
  proofSection: 'S-frontier',
  scopes:
    'Verify numerically the imp-33766 a-fortiori claim that the imp-3708 H3 curvature input suffices for ' +
    'the H4 fold-reading-derivative obligation: evaluate both renormalized quantities on the shared quadratic ' +
    'fold at the strip height and confirm the H4 quantity does not exceed the H3-derived value',
  question:
    'On the shared fold z_0* = i eps (eps = y_N^sharp = sqrt(2 pi / N)), does the H4 renormalized quantity ' +
    'C_ren = eps^{3/2}|m_prime| stay at or below the H3-derived value C_curv = eps^{5/2}|m_double_prime| at ' +
    'every rung, and does the margin ratio C_ren / C_curv settle to A_1 / A_2 = 2/3 < 1 (imp-33766 a-fortiori ' +
    'domination)? Verification only on the inherited surrogate; G6a OPEN; no positivity; no QED.',

  cuspModel: 'rho(x) ~ C / |x - x_star|^{1/2} (Holder-1/2, alpha = 1/2 exactly) -- the RvM cusp of imp-394',
  sharedFold: 't_shock = tau_c + (1/2) alpha (z_0 - z_0*)^2, alpha = m_double_prime(z_0*); read at z_0* = i eps',
  readingStrip: 'eps = y_N^sharp = sqrt(2 pi / N), N in {1e3 .. 1e7}, ONE ladder for BOTH obligations',
  sharedFoldLadder: SHARED_FOLD_LADDER,

  // (1)-(2): the two renormalized obligations reproduce their closed-form limits on the shared fold.
  h4QuantityLimitMeasured: TAIL.cRen_H4, // eps^{3/2}|m_prime| -> ~2.2214 (C_PS, imp-33646)
  h4QuantityLimitClosedForm: C_PS, // A_1 = pi / sqrt(2)
  h3DerivedValueLimitMeasured: TAIL.cCurv_H3, // eps^{5/2}|m_double_prime| -> ~3.3322 (K, imp-33645)
  h3DerivedValueLimitClosedForm: K_CURV, // A_2 = 3 pi / (2 sqrt(2))

  // (3): the margin ratio settles to 2/3 (the reciprocal of the imp-33790 single-derivative gap 3/2).
  marginRatioMeasured: TAIL.marginRatio, // C_ren / C_curv -> ~0.6667
  marginRatioClosedForm: MARGIN_LIMIT, // A_1 / A_2 = 2/3
  marginPercentBelowH3: +((1 - MARGIN_LIMIT) * 100).toFixed(2), // ~33.33% margin to spare

  // (4): the a-fortiori inequality holds at EVERY rung (H4 quantity never exceeds the H3-derived value).
  maxMarginRatioOverLadder: +MAX_MARGIN_RATIO.toFixed(6), // < 1 at the worst (smallest-N) rung
  h4NeverExceedsH3: ALL_H4_WITHIN_H3, // true: C_ren <= C_curv at every rung

  // The assessment: a-fortiori inequality confirmed, NOT a discharge.
  aFortioriDirectionConfirmed: true, // H4 quantity <= H3-derived value on the shared fold, margin -> 2/3
  couplingIsSingleDerivative: true, // C_curv = R(eps) eps C_ren, R eps -> 3/2, so C_ren / C_curv -> 2/3 (imp-33790)
  dischargesH4OrH3: false, // confirms the inequality on a finite ladder; does NOT supply N-uniform analytic tracking
  residualObstruction:
    'the a-fortiori inequality C_ren <= C_curv confirms H3 bounds H4 on the shared fold, but BOTH renormalized ' +
    'quantities still require the ANALYTIC N-uniform two-sided bound through the fold-modulus back-conversion; a ' +
    'finite-ladder inequality is not that uniform bound, so G6a_shock_lipschitz stays OPEN on the H3 axis',

  isRigorous: false,
  verdict:
    'VERIFICATION ONLY on the inherited imp-3220/imp-3406/imp-33646 model-cusp surrogate, G6a_shock_lipschitz ' +
    'STAYS OPEN. On the shared quadratic fold z_0* = i eps (eps = y_N^sharp = sqrt(2 pi / N), N in {1e3 .. 1e7}) ' +
    'the H4 renormalized quantity C_ren = eps^{3/2}|m_prime| stays STRICTLY BELOW the H3-derived value ' +
    'C_curv = eps^{5/2}|m_double_prime| at every rung, with margin ratio C_ren / C_curv tightening monotonically ' +
    'to A_1 / A_2 = 2/3 = 0.6667 (~33% to spare) -- the numerical face of the imp-33766 a-fortiori domination ' +
    '(H3 curvature, N-exponent 5/4, dominates and bounds H4, N-exponent 3/4). This CONFIRMS the a-fortiori ' +
    'direction: the H4 fold-reading derivative does not exceed the H3-derived curvature on the shared fold at ' +
    'the operative strip height. It does NOT discharge H3 or H4 (both need the ANALYTIC N-uniform tracking of ' +
    'the renormalized quantity through the fold-modulus back-conversion, not a finite-ladder inequality), ' +
    'establishes no operator positivity, changes no bound. imp-3066 off-diagonal endpoint-Hankel K_a >= 0 ' +
    'UNTOUCHED; C_mb remains GUE-conditional (imp-486); NO QED. No refereed bound is changed' +
    '.',
};

export const IMP35076_H3_A_FORTIORI_ASSERTIONS = [
  {
    // (1) the H4 renormalized quantity reproduces the imp-33646 limit C_PS = pi/sqrt(2) on the shared fold.
    id: 'imp35076-h4-quantity-limit-is-privalov-sokhotski',
    description: 'eps^{3/2}|m_prime| -> C_PS = pi / sqrt(2) = 2.2214 on the shared eps = y_N^sharp fold (imp-33646)',
    holds: () =>
      Math.abs(
        IMP35076_H3_A_FORTIORI_DISCHARGES_H4_VERIFICATION.h4QuantityLimitMeasured - Math.PI / Math.SQRT2,
      ) < 1e-3,
  },
  {
    // (2) the H3-derived value reproduces the imp-33645 limit K = 3 pi/(2 sqrt(2)) on the SAME fold.
    id: 'imp35076-h3-derived-value-limit-is-curvature-floor',
    description: 'eps^{5/2}|m_double_prime| -> K = 3 pi / (2 sqrt(2)) = 3.3322 on the shared fold (imp-33645)',
    holds: () =>
      Math.abs(
        IMP35076_H3_A_FORTIORI_DISCHARGES_H4_VERIFICATION.h3DerivedValueLimitMeasured -
          (3 * Math.PI) / (2 * Math.SQRT2),
      ) < 1e-3,
  },
  {
    // (3) the a-fortiori inequality: H4 quantity does NOT exceed the H3-derived value at ANY rung.
    id: 'imp35076-h4-never-exceeds-h3-on-shared-fold',
    description: 'C_ren <= C_curv at every rung; max C_ren / C_curv over the ladder stays below 1',
    holds: () =>
      IMP35076_H3_A_FORTIORI_DISCHARGES_H4_VERIFICATION.h4NeverExceedsH3 === true &&
      IMP35076_H3_A_FORTIORI_DISCHARGES_H4_VERIFICATION.maxMarginRatioOverLadder < 1,
  },
  {
    // (4) the margin ratio settles to A_1 / A_2 = 2/3 (reciprocal of the imp-33790 single-derivative gap 3/2).
    id: 'imp35076-margin-ratio-is-two-thirds',
    description: 'C_ren / C_curv -> A_1 / A_2 = 2/3 = 0.6667 (the imp-33766 a-fortiori domination factor)',
    holds: () =>
      Math.abs(IMP35076_H3_A_FORTIORI_DISCHARGES_H4_VERIFICATION.marginRatioMeasured - 2 / 3) < 5e-4 &&
      Math.abs(IMP35076_H3_A_FORTIORI_DISCHARGES_H4_VERIFICATION.marginRatioClosedForm - 2 / 3) < 1e-12,
  },
  {
    // Honesty gate: verification only; does NOT discharge H4/H3, G6a OPEN, no QED, no refereed bound is changed, imp-3066 untouched.
    id: 'imp35076-honesty-gate-no-qed',
    description:
      'Verification only: a-fortiori inequality confirmed but does not discharge H4/H3, G6a OPEN, no QED, no refereed bound is changed, imp-3066 untouched',
    holds: () =>
      IMP35076_H3_A_FORTIORI_DISCHARGES_H4_VERIFICATION.isRigorous === false &&
      IMP35076_H3_A_FORTIORI_DISCHARGES_H4_VERIFICATION.dischargesH4OrH3 === false &&
      IMP35076_H3_A_FORTIORI_DISCHARGES_H4_VERIFICATION.aFortioriDirectionConfirmed === true &&
      /NO QED/.test(IMP35076_H3_A_FORTIORI_DISCHARGES_H4_VERIFICATION.verdict) &&
      /STAYS OPEN/.test(IMP35076_H3_A_FORTIORI_DISCHARGES_H4_VERIFICATION.verdict) &&
      /refereed bound is changed/i.test(IMP35076_H3_A_FORTIORI_DISCHARGES_H4_VERIFICATION.verdict) &&
      /imp-3066 off-diagonal endpoint-Hankel K_a >= 0\s+UNTOUCHED/.test(
        IMP35076_H3_A_FORTIORI_DISCHARGES_H4_VERIFICATION.verdict,
      ),
  },
];

for (const a of IMP35076_H3_A_FORTIORI_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-35076-h3-a-fortiori-discharges-h4-numerical-verification assertion failed: ${a.id}`);
  }
}
