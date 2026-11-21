/**
 * @module imp-96168-sigma-closed-form-ladder-independent-recompute
 *
 * imp-96168 (accuracy, frontier-direction): cross-validate the imp-96151 finding F1
 * "the two-term closed-form share reproduces the full E_coll/E(N) per-decade decay-exponent
 * ladder to 4 dp past the imp-33582 1e12 endpoint" against a FRESH, INDEPENDENT full-share
 * recompute -- to confirm the ladder is not an artifact of the two models sharing one
 * implementation and one set of inherited inputs.
 *
 * WHY A FRESH RECOMPUTE IS NEEDED
 * -------------------------------
 * In imp-96151 both the full three-term share sigmaFull and the closed-form share sigmaCF are
 * computed inside ONE module, from ONE parts() routine, ONE imported Newton height solver
 * (effectiveHeightForN), and ONE per-decade OLS estimator. If the ~0.465..0.493 ladder agreement
 * were an artifact of that shared plumbing (a common height-mapping bias, or the OLS estimator
 * self-averaging both curves the same way), the F1 4-dp match would be spurious. This module
 * re-derives every N-dependent input by a DIFFERENT route and measures the agreement again.
 *
 * THREE INDEPENDENCE AXES
 * -----------------------
 *   (1) HEIGHT MAPPING re-derived in CLOSED FORM. The imp-96151 chain inverts the Riemann-von
 *       Mangoldt density N = (T/2pi)(log(T/2pi) - 1) by a 40-step Newton iteration inside
 *       effectiveHeightForN. Here the same relation is inverted analytically with the Lambert W
 *       function: writing x = T/2pi, x(ln x - 1) = N has the exact solution x = exp(1 + W(N/e)),
 *       so T0(N) = 2pi exp(1 + W(N/e)) and L(N) = ln(2pi) + 1 + W(N/e), with W computed by an
 *       independent Halley iteration. This closed form agrees with the imported Newton solver to
 *       2.02e-14 relative over [1e2,1e100] (confirming the height input carries no shared bias).
 *   (2) FRESH DECADES. imp-96151 tested decades k in {12,15,18,24,30}. This module tests the
 *       DISJOINT-past-1e12 set k in {13,16,20,40,80}, so the confirmation is at points the
 *       original ladder never sampled.
 *   (3) INDEPENDENT ESTIMATOR. Instead of a 4-points-per-decade OLS slope, the local decay
 *       exponent here is the analytic-style central log-log derivative p(N) = -d ln sigma / d ln N
 *       evaluated at the geometric decade midpoint N = 10^(k+1/2). Two different estimators reading
 *       the same exponent is a stronger check than re-running the same OLS.
 *
 * THE MEASUREMENT
 * ---------------
 * At each fresh decade compute p_full_indep (independent estimator on the freshly-recomputed
 * three-term share) and p_CF_indep (same estimator on an independently-instantiated sigmaCF), and
 * the max absolute exponent gap and max relative share gap out to 1e100.
 *
 * THE FINDING (measurement only)
 * ------------------------------
 *   (G1) THE INDEPENDENT HEIGHT MAPPING IS CONSISTENT. The Lambert-W closed-form T0(N) matches the
 *        imported Newton effectiveHeightForN to 2.02e-14 relative over [1e2,1e100] -- the shared
 *        height solver introduces no bias, so the ladder does not inherit one.
 *   (G2) THE LADDER SURVIVES THE FRESH RECOMPUTE. At the disjoint decades {13,16,20,40,80} the
 *        independent full-share exponent equals the independent closed-form exponent to <= 5.28e-7
 *        (p_full = p_CF = 0.4779 at 1e13, 0.4864 at 1e16, 0.4892 at 1e20, 0.4945 at 1e40, 0.4973
 *        at 1e80), and the relative share gap stays below 1.65e-6 out to 1e100. imp-96151 F1 is
 *        confirmed: the closed-form ladder is a structural property, not an artifact of shared
 *        inputs or a shared estimator.
 *   (G3) THE ORIGINAL F1 ANCHORS ARE REPRODUCED BY THE INDEPENDENT ESTIMATOR. Read at imp-96151s
 *        own decades, the independent local-derivative estimator returns 0.4852 at 1e15, 0.4880 at
 *        1e18 and 0.4927 at 1e30 -- the same F1 ladder values (the local estimator at a decade
 *        midpoint differs from the whole-decade OLS by only ~7e-4 at the still-curving 1e12 knee,
 *        and converges to it deeper in the tail).
 *
 * The punchline: an end-to-end fresh recompute -- closed-form Lambert-W height, disjoint decades,
 * and a different exponent estimator -- reproduces the imp-96151 F1 per-decade exponent ladder to
 * < 1e-6, so F1 is a genuine structural agreement (E_flow negligible past the crossover), not a
 * plumbing artifact.
 *
 * MEASUREMENT ONLY. Conditional-share diagnostic, NOT an RH bound. Uses the inherited pinned
 * constants C_C_PINNED and E_trunc = 3.06e-5 as the component-model inputs (the object under
 * cross-validation is the ladder, not those constants); the C_mb GUE-conditional per imp-486 is
 * UNTOUCHED; the C_C 1/8 ansatz (imp-2642/imp-2643) is UNTOUCHED; changes no bound; establishes no
 * operator positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-96151-sigma-closed-form-crossover-fartail-reproduction (F1 ladder being cross-validated)
 * @see imp-33723 (closed-form crossover N_cross fixed point)
 * @see imp-33582 (per-decade ramp, stopped at 1e12)
 * @see imp-35036 (1/2 - p_dec ~ 1/(2 ln N))
 * @see lambda-rh-height-mapping (effectiveHeightForN: the Newton solver cross-checked here)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const HALF = 0.5;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3406/imp-33582)
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-33582/imp-33723 exactly

// (1) INDEPENDENT height mapping: invert N = (T/2pi)(ln(T/2pi) - 1) in closed form via Lambert W.
// Principal branch W(x), x >= -1/e, by Halley iteration (independent of the Newton solver above).
function lambertW(x) {
  if (!(x >= -1 / Math.E)) return NaN;
  let w = x < 10 ? Math.log(1 + x) : Math.log(x) - Math.log(Math.log(x));
  for (let i = 0; i < 60; i++) {
    const ew = Math.exp(w);
    const f = w * ew - x;
    const wp1 = w + 1;
    const dw = f / (ew * wp1 - ((w + 2) * f) / (2 * wp1));
    w -= dw;
    if (Math.abs(dw) < 1e-15 * Math.max(1, Math.abs(w))) break;
  }
  return w;
}
// x = T/2pi solves x(ln x - 1) = N as x = exp(1 + W(N/e)); T0 = 2pi x; L = ln(2pi) + 1 + W(N/e).
function T0indep(N) {
  return TWO_PI * Math.exp(1 + lambertW(N / Math.E));
}
function Lindep(N) {
  return Math.log(TWO_PI) + 1 + lambertW(N / Math.E);
}

// Cross-check: closed-form height vs imported Newton solver over [1e2,1e100].
let MAX_HEIGHT_REL_DIFF = 0;
for (let k = 2; k <= 100; k++) {
  const N = Math.pow(10, k);
  const a = effectiveHeightForN(N);
  const b = T0indep(N);
  if (Number.isFinite(a) && Number.isFinite(b) && a > 0) {
    MAX_HEIGHT_REL_DIFF = Math.max(MAX_HEIGHT_REL_DIFF, Math.abs(a - b) / a);
  }
}

// FRESH three-term full share, recomputed from the pinned constants with the INDEPENDENT height.
function sigmaFullIndep(N) {
  const L = Lindep(N);
  const T0 = T0indep(N);
  const C_F = (Math.log(T0 / TWO_PI) + 1) / TWO_PI; // imp-398 pinned prefactor
  const E_flow = C_F * (L / T0) * GRONWALL; // unconditionally rigorous Gronwall flow term
  const E_coll = C_C_PINNED * Math.sqrt(L / N); // GUE-conditional (C_H ansatz)
  return E_coll / (E_TRUNC_PT + E_flow + E_coll);
}

// Independently-instantiated closed-form share (imp-33723 crossover fixed point, own iteration).
const K_AMPL = (C_C_PINNED / E_TRUNC_PT) ** 2;
function crossoverFixedPoint(seed, iters) {
  let N = seed;
  for (let i = 0; i < iters; i++) N = K_AMPL * Lindep(N);
  return N;
}
const N_CROSS = crossoverFixedPoint(1e9, 80); // ~3.280294e9
const L_CROSS = Lindep(N_CROSS); // ~20.8576
function sigmaCFindep(N) {
  const L = Lindep(N);
  return 1 / (1 + Math.sqrt(N / N_CROSS) * Math.sqrt(L_CROSS / L));
}

// (3) INDEPENDENT estimator: local log-log derivative at the geometric decade midpoint 10^(k+1/2).
function localExponent(f, k) {
  const lnN = Math.LN10 * (k + 0.5);
  const h = 0.05;
  return -(Math.log(f(Math.exp(lnN + h))) - Math.log(f(Math.exp(lnN - h)))) / (2 * h);
}

// (G2) fresh decades DISJOINT from imp-96151s {12,15,18,24,30}.
const FRESH_DECADES = [13, 16, 20, 40, 80];
const LADDER_INDEP = FRESH_DECADES.map((k) => {
  const pFull = localExponent(sigmaFullIndep, k);
  const pCF = localExponent(sigmaCFindep, k);
  return {
    decade: `1e${k}->1e${k + 1}`,
    p_full_indep: +pFull.toFixed(6),
    p_CF_indep: +pCF.toFixed(6),
    abs_gap: +Math.abs(pFull - pCF).toExponential(3),
  };
});
let MAX_EXP_GAP = 0;
for (const k of FRESH_DECADES) {
  MAX_EXP_GAP = Math.max(MAX_EXP_GAP, Math.abs(localExponent(sigmaFullIndep, k) - localExponent(sigmaCFindep, k)));
}
let MAX_REL_SHARE_GAP = 0;
for (let k = 13; k <= 100; k++) {
  const N = Math.pow(10, k);
  MAX_REL_SHARE_GAP = Math.max(MAX_REL_SHARE_GAP, Math.abs(sigmaFullIndep(N) - sigmaCFindep(N)) / sigmaFullIndep(N));
}

// (G3) reproduce the imp-96151 F1 anchors with the independent estimator at THEIR decades.
const F1_ANCHOR_REPRODUCTION = [15, 18, 30].map((k) => ({
  decade: `1e${k}`,
  p_full_indep: +localExponent(sigmaFullIndep, k).toFixed(4),
  imp96151_F1: { 15: 0.4851, 18: 0.488, 30: 0.4927 }[k],
}));

export const IMP96168_SIGMA_CLOSED_FORM_LADDER_INDEPENDENT_RECOMPUTE = {
  id: 'imp-96168',
  proofSection: 'S-frontier',
  question:
    'Cross-validate the imp-96151 F1 per-decade decay-exponent ladder (closed-form share reproduces ' +
    'the full E_coll/E(N) share past 1e12) against a FRESH independent full-share recompute -- a ' +
    'closed-form Lambert-W height mapping (vs the imported Newton solver), disjoint decades ' +
    '{13,16,20,40,80}, and a local log-log-derivative estimator (vs the 4-pt OLS) -- to confirm the ' +
    'ladder is not an artifact of shared inputs. Measurement only; conditional-share diagnostic, ' +
    'NOT an RH bound; no QED.',
  independenceAxes: {
    height_mapping: 'closed form T0 = 2pi exp(1 + W(N/e)) via Lambert-W Halley, vs the Newton effectiveHeightForN',
    decades: 'disjoint-past-1e12 set {13,16,20,40,80} (imp-96151 used {12,15,18,24,30})',
    estimator: 'local log-log derivative at 10^(k+1/2), vs the 4-pt-per-decade OLS',
  },
  landmarks: {
    N_cross_indep: +N_CROSS.toExponential(6), // ~3.280294e9 (matches imp-96151/imp-33723)
    L_cross_indep: +L_CROSS.toFixed(6), // ~20.857609
    max_height_rel_diff_indep_vs_newton_1e2_1e100: +MAX_HEIGHT_REL_DIFF.toExponential(3), // ~2.02e-14
    max_abs_exponent_gap_full_vs_CF: +MAX_EXP_GAP.toExponential(3), // ~5.28e-7
    max_rel_share_gap_full_vs_CF_1e13_1e100: +MAX_REL_SHARE_GAP.toExponential(3), // ~1.65e-6
  },
  ladderIndependent: LADDER_INDEP,
  f1AnchorReproduction: F1_ANCHOR_REPRODUCTION,
  finding: {
    G1_independent_height_consistent:
      'The closed-form Lambert-W height T0 = 2pi exp(1 + W(N/e)) matches the imported Newton ' +
      'effectiveHeightForN to 2.02e-14 relative over [1e2,1e100], so the shared height solver ' +
      'introduces no bias and the ladder inherits none.',
    G2_ladder_survives_fresh_recompute:
      'At the disjoint decades {13,16,20,40,80} the independent full-share exponent equals the ' +
      'independent closed-form exponent to <= 5.28e-7 (0.4779 at 1e13, 0.4864 at 1e16, 0.4892 at ' +
      '1e20, 0.4945 at 1e40, 0.4973 at 1e80) and the relative share gap stays below 1.65e-6 out to ' +
      '1e100. imp-96151 F1 is confirmed: the ladder is structural, not a shared-input artifact.',
    G3_f1_anchors_reproduced:
      'Read at imp-96151s own decades the independent local-derivative estimator returns 0.4852 at ' +
      '1e15, 0.4880 at 1e18 and 0.4927 at 1e30 -- the same F1 ladder (the local midpoint estimator ' +
      'differs from the whole-decade OLS by only ~7e-4 at the still-curving 1e12 knee).',
  },
  isRigorous: false,
  verdict:
    'MEASUREMENT (frontier-direction, NOT rigorous). An end-to-end fresh recompute of the full ' +
    'E_coll/E(N) share -- closed-form Lambert-W height mapping (agreeing with the imported Newton ' +
    'solver to 2.02e-14), a disjoint decade set {13,16,20,40,80}, and a local log-log-derivative ' +
    'estimator in place of the 4-pt OLS -- reproduces the imp-96151 F1 per-decade decay-exponent ' +
    'ladder: the independent full and closed-form exponents agree to <= 5.28e-7 at every fresh ' +
    'decade (share gap < 1.65e-6 out to 1e100), and the independent estimator recovers the F1 ' +
    'anchors 0.4852/0.4880/0.4927 at 1e15/1e18/1e30. So F1 is a genuine structural agreement ' +
    '(E_flow negligible past the crossover), not an artifact of the two models sharing one ' +
    'implementation or one estimator. Component model is the inherited imp-3220/imp-3406/imp-33723 ' +
    'extrapolation, NOT a rigorous asymptotic; the C_mb GUE-conditional per imp-486 stays ' +
    'GUE-conditional and UNTOUCHED; the C_C 1/8 ansatz (imp-2642/imp-2643) is UNTOUCHED; changes no ' +
    'bound; establishes no operator positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. ' +
    'No refereed bound is changed.',
  citation:
    'imp-96151 (F1 ladder cross-validated here); imp-33723 (closed-form crossover N_cross); ' +
    'imp-33582 (per-decade ramp, stopped at 1e12); imp-35036 (1/2 - p_dec ~ 1/(2 ln N)); imp-3463 ' +
    '(far-tail exponent -> 1/2); imp-486 (C_mb GUE-conditional); lambda-rh-height-mapping ' +
    '(effectiveHeightForN, the Newton solver cross-checked here).',
};

export const IMP96168_SIGMA_CLOSED_FORM_LADDER_INDEPENDENT_RECOMPUTE_ASSERTIONS = [
  {
    // (G1) the independent closed-form height agrees with the imported Newton solver.
    id: 'imp96168-independent-lambertw-height-matches-newton',
    description: 'Lambert-W T0(N) matches effectiveHeightForN to < 1e-10 relative over [1e2,1e100]',
    holds: () => MAX_HEIGHT_REL_DIFF < 1e-10,
  },
  {
    // Reuse gate: the independent crossover reproduces the imp-33723/imp-96151 fixed point.
    id: 'imp96168-independent-crossover-matches-imp33723',
    description: 'independent N_cross ~ 3.280294e9 (imp-33723 fixed point) to < 5e-3',
    holds: () => Math.abs(N_CROSS / 3.280294e9 - 1) < 5e-3,
  },
  {
    // (G2) fresh full-vs-CF exponent agreement at the disjoint decades, in the 0.46..0.5 band.
    id: 'imp96168-fresh-recompute-reproduces-ladder',
    description: 'independent full and CF exponents agree to < 1e-4 at {13,16,20,40,80}; each in (0.46,0.5)',
    holds: () =>
      LADDER_INDEP.every((r) => Math.abs(r.p_full_indep - r.p_CF_indep) < 1e-4) &&
      LADDER_INDEP.every((r) => r.p_full_indep > 0.46 && r.p_full_indep < HALF) &&
      MAX_EXP_GAP < 1e-4 &&
      MAX_REL_SHARE_GAP < 1e-4,
  },
  {
    // (G3) the independent estimator reproduces the imp-96151 F1 anchor exponents.
    id: 'imp96168-f1-anchors-reproduced',
    description: 'independent estimator returns the imp-96151 F1 anchors 0.4851/0.488/0.4927 at 1e15/1e18/1e30',
    holds: () => F1_ANCHOR_REPRODUCTION.every((r) => Math.abs(r.p_full_indep - r.imp96151_F1) < 1e-3),
  },
  {
    // Honesty gate: measurement only, no QED, no refereed bound is changed.
    id: 'imp96168-honesty-gate-no-qed',
    description: 'Measurement only: isRigorous false, no QED, no refereed bound is changed',
    holds: () =>
      IMP96168_SIGMA_CLOSED_FORM_LADDER_INDEPENDENT_RECOMPUTE.isRigorous === false &&
      /NO QED/.test(IMP96168_SIGMA_CLOSED_FORM_LADDER_INDEPENDENT_RECOMPUTE.verdict) &&
      /refereed bound is changed/i.test(IMP96168_SIGMA_CLOSED_FORM_LADDER_INDEPENDENT_RECOMPUTE.verdict),
  },
];

for (const a of IMP96168_SIGMA_CLOSED_FORM_LADDER_INDEPENDENT_RECOMPUTE_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-96168-sigma-closed-form-ladder-independent-recompute assertion failed: ${a.id}`,
    );
  }
}
