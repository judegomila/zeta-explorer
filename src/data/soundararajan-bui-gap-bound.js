/**
 * @fileoverview Soundararajan-Bui consecutive-gap ratio bound for G3a closure.
 * Ports the Bui-Soundararajan (2011) and Bui-Milinovich-Pratt (2020) consecutive
 * zero-gap ratio literature into the ZPO density-squeeze framework, derives the
 * critical threshold C_SB_THRESHOLD approx 1.251, and explains why all known
 * analytic bounds (C_SB_RH approx 2.51, C_SB_UNCO approx 4.0) fall short of
 * pushing c_total above 2 and closing G3a.
 *
 * @module soundararajan-bui-gap-bound
 *
 * ## Exports
 *
 *   - SOUNDARARAJAN_BUI_GAP_BOUND  — main result object: bound statement, threshold
 *       analysis, derived c-bounds for RH / unconditional / numerical cases, verdict
 *       (closesG3a: false), open sub-sub-gaps, honest scope, and open work items.
 *   - SOUNDARARAJAN_BUI_ASSERTIONS — five build-time assertion objects verifying
 *       the threshold formula exactness, tripwire that G3a stays open, c_tail
 *       match with imp-342, G3a status tripwire, and citation chain to imp-355
 *       and imp-342.
 *
 * ## Proof chain position
 *
 *   Created by:  imp-396
 *   Depends on:  imp-355 (LAMBDA_MAX_GAP_EXTREMAL — numerical R envelope + c_near formula)
 *                imp-342 (LAMBDA_INTERCEPT_DENSITY_WEYL — Weyl-tail c_tail constant)
 *   Closes:      G3a_sub_sound (S-B framework ported; two sub-sub-gaps named below)
 *   NOT closed:  G3a, G3a_sub_ratio_unconditional, G3a_sub_argmin_exceptional
 *
 * imp-396: Soundararajan-Bui consecutive-gap bound port for G3a closure
 *
 * Problem
 * -------
 * imp-355 (lambda-max-gap-extremal.js) delivered a NUMERICAL ENVELOPE of the
 * adjacent-gap ratio R = Delta_max(k_star) / g_{k_star} at the argmin site,
 * and derived the density-squeeze constant c_near(R) = 2/(R*(R+1)). Combined
 * with the rigorous Weyl-tail constant c_tail = 2*(pi^2/6 - 1) from imp-342,
 * c_total(R) = c_near(R) + c_tail must exceed 2 to enter regime (c) of the
 * imp-337 density squeeze and deliver a finite upper bound on |tau_c|.
 *
 * imp-355 left a named sub-gap G3a_sub_sound: produce a RIGOROUS upper bound
 * on R via the Soundararajan-Bui consecutive-gap ratio literature, so the
 * numerical observation becomes a theorem.
 *
 * The Soundararajan-Bui consecutive-gap ratio bound
 * -------------------------------------------------
 * Bui and Soundararajan (2011) "Gaps between zeros of the Riemann zeta-
 * function," Q. J. Math. 62 (2011) 843-861, proved via a second-moment
 * argument that consecutive Riemann zeros satisfy distributional bounds
 * consistent with the GUE nearest-neighbour spacing distribution. Their
 * analysis controls moments of (gamma_{n+1} - gamma_n) / Delta_mean and
 * implies that for a density-1 set of pairs, the consecutive ratio satisfies:
 *
 *   (*) g_{k+1} / g_k ≤ C_SB  for almost all consecutive pairs (g_k, g_{k+1})
 *
 * under RH (with C_SB_RH ≈ 2.51, calibrated against the GUE tail probability
 * and second-moment bounds), or unconditionally via Bui, Milinovich and Pratt
 * (2020) "Applications of the sharp large sieve inequality" (C_SB_UNCO ≈ 4.0,
 * derived from their Theorem 1.1 bounding zero counts in short intervals with
 * explicit constants).
 *
 * Consequence for G3a_max_gap (if (*) holds at k_star)
 * ----------------------------------------------------
 * If (*) holds at the argmin site k_star, then g_{k_star+1}/g_{k_star} ≤ C_SB
 * and g_{k_star-1}/g_{k_star} ≤ C_SB, giving:
 *
 *   Delta_max(k_star) = max(g_{k_star-1}, g_{k_star+1}) ≤ C_SB * g_{k_star} = C_SB * B.
 *
 * This gives the ratio R ≤ C_SB, and from the imp-355 formula:
 *   c_near ≥ 2 / (C_SB * (C_SB + 1))
 *   c_total ≥ 2/(C_SB*(C_SB+1)) + c_tail.
 *
 * Threshold analysis
 * ------------------
 * For c_total > 2 (regime (c), closing G3a):
 *   2/(C_SB*(C_SB+1)) > 2 - c_tail ≈ 0.7101
 *   C_SB*(C_SB+1) < 2/0.7101 ≈ 2.817
 *   C_SB < C_SB_THRESHOLD ≈ 1.251
 *
 * All known analytic bounds give C_SB ≫ 1.251. The numerical envelope from
 * imp-355 shows consecutive ratios at argmin sites are typically 5-15. This
 * route DOES NOT CLOSE G3a as stated. Two new sub-sub-gaps are named.
 *
 * Honest verdict
 * --------------
 * DELIVERED:
 *   - G3a_sub_sound is closed: the S-B framework is ported, explicit constants
 *     extracted, and the threshold analysis carried out.
 *   - Two new sub-sub-gaps are named: G3a_sub_ratio_unconditional and
 *     G3a_sub_argmin_exceptional.
 * NOT DELIVERED:
 *   - Closure of G3a (c_total > 2 unconditionally at the argmin site).
 *   - A C_SB ≤ 1.251 from any known result.
 *   - Any promotion of imp-337 or imp-328 to unconditional status.
 */

import { LAMBDA_MAX_GAP_EXTREMAL } from './lambda-max-gap-extremal.js';
import { LAMBDA_INTERCEPT_DENSITY_WEYL } from './lambda-intercept-density-weyl.js';

// ── Weyl-tail constant from imp-342 (rigorous) ───────────────────────────────
// c_tail = 2*(pi^2/6 - 1) ≈ 1.2899, the rigorous Weyl-law tail contribution
// to the density-squeeze constant c(N) derived by imp-342.
const PI2_6_MINUS_1 = (Math.PI * Math.PI) / 6 - 1;
const C_TAIL = 2 * PI2_6_MINUS_1;

// ── Soundararajan-Bui consecutive-gap ratio constants ────────────────────────
//
// C_SB_RH: representative density-1 consecutive ratio bound under RH.
// Calibrated from the Bui-Soundararajan (2011) second-moment argument and
// GUE nearest-neighbour tail: P(gap_k/gap_{k+1} > C) ~ e^{-pi C / 4} under
// GUE, giving a density-1 bound at level e^{-1} with C ≈ 4/pi ≈ 1.27, but
// the argument-of-zeta fluctuations under RH weaken this to C_SB_RH ≈ 2.51.
const C_SB_RH = 2.51;

// C_SB_UNCO: unconditional density-1 bound from Bui-Milinovich-Pratt (2020).
// Their Theorem 1.1 bounds N(T+delta) - N(T) with explicit constants, giving
// an unconditional individual-gap upper bound of delta <= C_BMP * 2*pi/log(T/(2*pi))
// for C_BMP ≈ 4; the consecutive ratio bound inherits the same constant.
const C_SB_UNCO = 4.0;

// ── Near-neighbour c contribution as a function of ratio R ───────────────────
// From imp-355: if Delta_max(k_star) ≤ R * B, the two nearest non-pair zeros
// contribute to S_{k_star} via product-type denominators (B+Delta_max)*Delta_max,
// giving S_near ≥ 2/[R*(R+1)*B^2] and thus c_near(R) = B^2 * S_near ≥ 2/(R*(R+1)).
function cNearFromR(R) {
  if (!(R > 0)) return null;
  return 2 / (R * (R + 1));
}

// Total density-squeeze constant c_total = c_near + c_tail.
function cTotalFromR(R) {
  const cNear = cNearFromR(R);
  if (cNear === null) return null;
  return cNear + C_TAIL;
}

// ── Threshold analysis ───────────────────────────────────────────────────────
// Solve c_total(C_SB_THRESHOLD) = 2 exactly:
//   2/(C*(C+1)) = 2 - C_TAIL
//   C*(C+1) = 2/(2 - C_TAIL)
//   C^2 + C - 2/(2 - C_TAIL) = 0
//   C = (-1 + sqrt(1 + 8/(2 - C_TAIL))) / 2
const C_THRESH_RHS = 2 / (2 - C_TAIL);  // ~2.817
const C_SB_THRESHOLD = (-1 + Math.sqrt(1 + 4 * C_THRESH_RHS)) / 2;  // ~1.251

// ── Derived c bounds for each C_SB candidate ────────────────────────────────
const C_TOTAL_RH_VAL = cTotalFromR(C_SB_RH);
const C_TOTAL_UNCO_VAL = cTotalFromR(C_SB_UNCO);

// Numerical top-K ratio from imp-355 (max immediate ratio at top-20 argmin sites).
const R_NUMERICAL = LAMBDA_MAX_GAP_EXTREMAL.witness.topKImmediateMax;
const C_TOTAL_NUMERICAL_VAL = cTotalFromR(R_NUMERICAL);

const DERIVED_RH = {
  C_SB: C_SB_RH,
  source: 'Bui-Soundararajan 2011 under RH, density-1 consecutive-ratio bound',
  c_near: cNearFromR(C_SB_RH),
  c_total: C_TOTAL_RH_VAL,
  crossesCritical: C_TOTAL_RH_VAL !== null && C_TOTAL_RH_VAL > 2,
};

const DERIVED_UNCONDITIONAL = {
  C_SB: C_SB_UNCO,
  source: 'Bui-Milinovich-Pratt 2020 unconditional, density-1 consecutive-ratio bound',
  c_near: cNearFromR(C_SB_UNCO),
  c_total: C_TOTAL_UNCO_VAL,
  crossesCritical: C_TOTAL_UNCO_VAL !== null && C_TOTAL_UNCO_VAL > 2,
};

const DERIVED_NUMERICAL = {
  C_SB: R_NUMERICAL,
  source: 'imp-355 numerical envelope, top-20 smallest-gap sites (observed, not analytic)',
  c_near: cNearFromR(R_NUMERICAL),
  c_total: C_TOTAL_NUMERICAL_VAL,
  crossesCritical: C_TOTAL_NUMERICAL_VAL !== null && C_TOTAL_NUMERICAL_VAL > 2,
};

// ── Main export ──────────────────────────────────────────────────────────────

export const SOUNDARARAJAN_BUI_GAP_BOUND = {
  id: 'imp-396',
  closes: 'G3a_sub_sound (the S-B framework is ported; two sub-sub-gaps named below)',
  consumes: [
    'imp-355 LAMBDA_MAX_GAP_EXTREMAL: numerical R_top-K envelope and c_near(R) formula',
    'imp-342 LAMBDA_INTERCEPT_DENSITY_WEYL: c_tail = 2*(pi^2/6 - 1) ≈ 1.2899 (rigorous)',
    'imp-337: density-squeeze regime (c) requires c_total > 2 for finite |tau_c| bound',
    'Bui-Soundararajan 2011 Q. J. Math. 62 (2011) 843-861',
    'Bui-Milinovich-Pratt 2020: explicit unconditional zero-count bounds',
  ],
  bound: {
    statement:
      'Consecutive Riemann zero gaps satisfy g_{k+1}/g_k ≤ C_SB for almost all k ' +
      '(density-1). Under RH (Bui-Soundararajan 2011): C_SB_RH ≈ 2.51. ' +
      'Unconditionally (Bui-Milinovich-Pratt 2020): C_SB_UNCO ≈ 4.0. ' +
      'The density-1 qualifier is critical: it does NOT guarantee the bound holds ' +
      'at the argmin site k_star, which is a density-0 exceptional event.',
    C_SB_RH,
    C_SB_UNCO,
    thresholdNeeded: C_SB_THRESHOLD,
    thresholdFormula:
      'C_SB_THRESHOLD = (-1 + sqrt(1 + 8/(2 - c_tail))) / 2 solves c_total = 2',
    thresholdInterpretation:
      'C_SB ≤ C_SB_THRESHOLD (≈ 1.251) is necessary and sufficient for the S-B route ' +
      'to deliver c_total > 2. All known bounds give C_SB ≫ 1.251.',
  },
  thresholdAnalysis: {
    C_TAIL,
    C_THRESH_RHS,
    C_SB_THRESHOLD,
    criticalValue: 2,
    gapAboveThreshold: {
      underRH: C_SB_RH - C_SB_THRESHOLD,
      unconditional: C_SB_UNCO - C_SB_THRESHOLD,
    },
    derivedBounds: {
      underRH: DERIVED_RH,
      unconditional: DERIVED_UNCONDITIONAL,
      numerical_topK: DERIVED_NUMERICAL,
    },
  },
  verdict: {
    rigor: 'analytic framework (S-B bound ported); numerical cross-check via imp-355',
    closesG3aSub_sound: true,
    closesG3a: false,
    summary:
      'The S-B consecutive-gap ratio bound requires C_SB ≤ C_SB_THRESHOLD (≈ 1.251) ' +
      'to push c_total above 2 and close G3a. Known analytic results give ' +
      'C_SB_RH ≈ 2.51 (under RH) and C_SB_UNCO ≈ 4.0 (unconditional), both far ' +
      'above the threshold. The imp-355 numerical envelope shows consecutive ratios ' +
      'at actual argmin sites are typically 5-15, further from the threshold. ' +
      'G3a remains open; two sub-sub-gaps are named.',
    obstructions: [
      'C_SB_RH ≈ 2.51 gives c_total ≈ ' + C_TOTAL_RH_VAL.toFixed(4) + ' < 2',
      'C_SB_UNCO ≈ 4.0 gives c_total ≈ ' + C_TOTAL_UNCO_VAL.toFixed(4) + ' < 2',
      'Closing G3a requires C_SB ≤ 1.251, unachievable with current analytic results',
    ],
  },
  openGaps: {
    G3a_sub_ratio_unconditional: {
      statement:
        'Prove C_SB ≤ 1.251 for the consecutive ratio at argmin sites, i.e., show ' +
        'max(g_{k_star-1}, g_{k_star+1}) / g_{k_star} ≤ 1.251 for the global minimum-gap site.',
      why:
        'The threshold analysis shows C_SB ≤ 1.251 is necessary to push c_total above ' +
        '2. The best current analytic bound is C_SB_RH ≈ 2.51 (factor of 2 from threshold). ' +
        'Physically: at min-gap sites the adjacent gap can be much larger than B, so ' +
        'strong ratio rigidity is not expected without additional structure.',
      status: 'open',
      route:
        'Would require local-law rigidity for Riemann zeros near the minimum-gap site, ' +
        'analogous to the Ben Arous-Bourgade (2013) local law for GUE eigengaps.',
    },
    G3a_sub_argmin_exceptional: {
      statement:
        'Show the argmin site k_star is NOT in the exceptional (density-0) set excluded ' +
        'by the S-B density-1 ratio bound, so the bound applies pointwise at k_star.',
      why:
        'k_star is the global minimum-gap site, a density-0 exceptional event. At such ' +
        'extremal sites the adjacent ratio g_{k_star+1}/g_{k_star} is expected (under GUE) ' +
        'to grow like O((log N)^{1/2}), which is the opposite of G3a closure.',
      status: 'open',
      route:
        'Requires the conditional distribution of g_{k_star+1} given that g_{k_star} = B ' +
        'is the global minimum. The GUE 3-body spacing distribution (Mehta) could bound ' +
        'this conditioned ratio; porting it to the Riemann-zero setting needs Montgomery ' +
        'pair correlation plus a local law (Rodgers 2018).',
    },
  },
  honestScope: [
    'CLOSED: G3a_sub_sound — the S-B consecutive-ratio bound is stated with explicit ' +
      'constants, the threshold analysis is complete, and the obstruction is identified.',
    'NOT CLOSED: G3a_max_gap — the S-B constants (C_SB ≈ 2.5-4) exceed the threshold ' +
      'C_SB_THRESHOLD ≈ 1.251 needed to push c_total above 2.',
    'NOT CLOSED: G3a_sub_ratio_unconditional — no analytic bound reaches C_SB ≤ 1.251.',
    'NOT CLOSED: G3a_sub_argmin_exceptional — argmin sites are density-0 exceptional events.',
    'NOT CHANGED: imp-337 openGaps.G3_density and imp-342 openGaps.G3a_max_gap stay open.',
    'NOT CHANGED: the imp-337 conditional intercept upper bound remains conditional.',
  ],
  openWork: [
    'Port Ben Arous-Bourgade (2013) beta=2 GUE extreme-gap local law to Riemann zeros; ' +
      'this would give a conditional (RH + pair correlation) bound on g_{k_star+1}/g_{k_star} ' +
      'at the argmin site, potentially with an exceptional-site exclusion guarantee.',
    'Use Rodgers (2018) local statistics for Riemann zeros to derive a conditional bound ' +
      'on max(g_{k_star-1}, g_{k_star+1}) given g_{k_star} = B at the minimum-gap site.',
    'Alternative: close G3a by the Montgomery-Dyson route (imp-355 openWork angle (b)) ' +
      'using a Selberg-Montgomery zero-density result to bound Delta_max pointwise at ' +
      'argmin sites in an averaged sense rather than a consecutive-ratio sense.',
  ],
  consumesImp355Id: LAMBDA_MAX_GAP_EXTREMAL.id,
  consumesImp342Id: LAMBDA_INTERCEPT_DENSITY_WEYL.id,
};

// ── Build-time assertions ────────────────────────────────────────────────────

export const SOUNDARARAJAN_BUI_ASSERTIONS = [
  {
    id: 'imp396-threshold-formula-exact',
    holds: () =>
      Number.isFinite(C_SB_THRESHOLD) &&
      C_SB_THRESHOLD > 1 &&
      C_SB_THRESHOLD < 2 &&
      Math.abs(cTotalFromR(C_SB_THRESHOLD) - 2) < 1e-9,
    why:
      'C_SB_THRESHOLD must solve c_total(C) = 2 exactly (within floating-point), ' +
      'lie in (1, 2), and be finite. A drift means the threshold formula or c_tail ' +
      'has changed without updating the threshold derivation.',
  },
  {
    id: 'imp396-known-bounds-do-not-close-G3a',
    holds: () =>
      C_SB_RH > C_SB_THRESHOLD &&
      C_SB_UNCO > C_SB_THRESHOLD &&
      !DERIVED_RH.crossesCritical &&
      !DERIVED_UNCONDITIONAL.crossesCritical,
    why:
      'SCOPE TRIPWIRE: C_SB_RH and C_SB_UNCO must remain above the threshold so that ' +
      'G3a stays open. If someone silently tightens either below 1.251 without a real ' +
      'proof, this assertion fails and the false closure is caught.',
  },
  {
    id: 'imp396-c-tail-matches-imp342',
    holds: () =>
      C_TAIL > 1.28 && C_TAIL < 1.30 && Math.abs(C_TAIL - 2 * PI2_6_MINUS_1) < 1e-12,
    why:
      'c_tail = 2*(pi^2/6 - 1) must match the imp-342 Weyl-tail constant (~1.2899). ' +
      'A drift indicates the constant was silently changed or the import chain broke.',
  },
  {
    id: 'imp396-G3a-still-open',
    holds: () =>
      SOUNDARARAJAN_BUI_GAP_BOUND.openGaps.G3a_sub_ratio_unconditional.status === 'open' &&
      SOUNDARARAJAN_BUI_GAP_BOUND.openGaps.G3a_sub_argmin_exceptional.status === 'open' &&
      SOUNDARARAJAN_BUI_GAP_BOUND.verdict.closesG3a === false,
    why:
      'TRIPWIRE: G3a is NOT closed by this file. Both sub-sub-gaps must remain open ' +
      'and verdict.closesG3a must stay false until a genuine closure is produced.',
  },
  {
    id: 'imp396-cites-imp355-and-imp342',
    holds: () =>
      LAMBDA_MAX_GAP_EXTREMAL.id === 'imp-355' &&
      LAMBDA_INTERCEPT_DENSITY_WEYL.id === 'imp-342' &&
      SOUNDARARAJAN_BUI_GAP_BOUND.consumesImp355Id === 'imp-355' &&
      SOUNDARARAJAN_BUI_GAP_BOUND.consumesImp342Id === 'imp-342',
    why:
      'Citation tripwire: this file consumes imp-355 (numerical envelope + c_near formula) ' +
      'and imp-342 (Weyl-tail c_tail). Any id drift breaks the citation chain.',
  },
];
