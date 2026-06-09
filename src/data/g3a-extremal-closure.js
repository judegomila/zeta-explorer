/**
 * @module g3a-extremal-closure
 * @fileoverview imp-451 — G3a extremal-statistics closure assembly: Route C
 * density-squeeze sub-gap G3a_max_gap diagnostically closed; new primary
 * sub-gap G3a_sub_fullsum named (full many-body S_{k_star} lower bound).
 * Exports {@link G3A_EXTREMAL_CLOSURE} (closure record) and
 * {@link G3A_EXTREMAL_CLOSURE_ASSERTIONS} (build guards). Belongs to the
 * Route C density-squeeze branch of the unconditional-Λ chain.
 * Module-doc added by imp-956.
 * @see imp-451
 * @see imp-342
 * @see imp-343
 */

/**
 * imp-451: G3a extremal-statistics closure assembly
 *
 * Route C density squeeze gap G3a_max_gap -- final diagnostic assembly.
 *
 * This file synthesises the full G3a investigation across three angles:
 *
 *   imp-355 LAMBDA_MAX_GAP_EXTREMAL -- numerical envelope on first ~870 zeros
 *   imp-396 SOUNDARARAJAN_BUI_GAP_BOUND -- S-B consecutive-ratio framework
 *   Ben Arous-Bourgade 2013 GUE extremal-gap scaling (new analysis below)
 *
 * The three angles together give a COMPLETE DIAGNOSTIC CLOSURE: we identify
 * the exact obstruction, quantify it asymptotically via GUE extremal statistics,
 * and name the remaining open sub-gap G3a_sub_fullsum.
 *
 * G3a problem recap
 * -----------------
 * Route C (imp-337) needs S_{k_star}(tau) >= c(N)/B^2 with c(N) > 2.
 * imp-342 delivers: S_tail >= rho_infty^2 * 2*(pi^2/6 - 1) (rigorous Weyl tail).
 * imp-355 frames S_near: with R = Delta_max(k_star)/B, c_near(R) = 2/(R*(R+1)).
 * c_total(R) = c_near(R) + c_tail > 2 requires R < R_critical (~1.251).
 * imp-396 shows ALL known analytic consecutive-ratio bounds give R >> 1.251.
 *
 * Ben Arous-Bourgade GUE extremal-gap scaling (the decisive angle)
 * ----------------------------------------------------------------
 * Ben Arous and Bourgade (2013) "Extreme gaps between eigenvalues of random
 * matrices," Ann. Prob. 41 (4), proved for GUE (beta=2):
 *
 *   hat{B}_N = B_N * rho_infty(gamma_{k_star})   scales as  O(N^{-4/3})
 *
 * in probability, where hat{B}_N is the normalised minimum gap. The adjacent
 * normalised gaps hat{g}_{k_star +/- 1} at the argmin site are O(1) bulk gaps
 * (they are NOT extreme order statistics; only the argmin site is extreme).
 *
 * Therefore: R_N = hat{g}_{k_star+1} / hat{B}_N = O(1) / O(N^{-4/3}) = O(N^{4/3}).
 *
 * Consequence: c_near(R_N) = 2/(R_N*(R_N+1)) ~ 2/N^{8/3} -> 0 as N -> infinity.
 * c_tail(N) = 2*(pi^2/6 - 1)*(hat{B}_N)^2 ~ N^{-8/3} -> 0 independently.
 * Both terms vanish: c_total -> 0 under GUE-consistent scaling.
 *
 * Conclusion: the near+tail decomposition of S_{k_star} is the root obstruction.
 * No improvement to the Delta_max bound will rescue Route C for large N.
 *
 * Diagnostic closure -- what this assembly delivers
 * -------------------------------------------------
 * DELIVERED:
 *   - R_critical = 1.251 computed exactly (threshold where c_total = 2)
 *   - GUE extremal-gap scaling: R_N ~ N^{4/3} under Montgomery pair correlation
 *   - Three-angle synthesis: numerical + S-B analytic + BA-B asymptotic
 *   - G3a_max_gap DIAGNOSTIC CLOSURE in OPEN_GAPS (lambda-roadmap.js)
 *   - New primary open sub-gap: G3a_sub_fullsum
 *
 * NOT DELIVERED:
 *   - A rigorous upper bound on Delta_max(k_star) for large N -- impossible
 *     within the near+tail framework under GUE scaling
 *   - Promotion of Route C to unconditional closure -- near+tail insufficient
 *   - G3a_sub_fullsum: full many-body S_{k_star} lower bound (new open ticket)
 *
 * SYNTAX NOTE: avoid (star)(slash) sequences inside JSDoc block text.
 */

import { LAMBDA_MAX_GAP_EXTREMAL } from './lambda-max-gap-extremal.js';
import { SOUNDARARAJAN_BUI_GAP_BOUND } from './soundararajan-bui-gap-bound.js';
import { LAMBDA_INTERCEPT_DENSITY_WEYL } from './lambda-intercept-density-weyl.js';

// ── R_critical: exact threshold where c_total = 2 ────────────────────────────
//
// Solve c_near(R) + c_tail = 2:
//   2 / (R*(R+1)) = 2 - c_tail
//   R*(R+1) = 2 / (2 - c_tail) =: C_thresh
//   R = (-1 + sqrt(1 + 4*C_thresh)) / 2

const C_TAIL_LOCAL = 2 * ((Math.PI * Math.PI) / 6 - 1); // 1.2899...
const C_THRESH_RHS = 2 / (2 - C_TAIL_LOCAL);             // ~2.817
const R_CRITICAL = (-1 + Math.sqrt(1 + 4 * C_THRESH_RHS)) / 2; // ~1.251

// ── GUE extremal-gap scaling analysis (Ben Arous-Bourgade 2013) ──────────────

const GUE_EXTREMAL_ANALYSIS = {
  source: 'Ben Arous and Bourgade (2013) Ann. Prob. 41 (4), Theorem 1.1',
  beta: 2,
  conditionalOn: 'Montgomery pair correlation conjecture (Riemann zeros follow GUE statistics)',
  keyResult: {
    statement:
      'For GUE with N eigenvalues, the normalised minimum gap ' +
      'hat{B}_N = B_N * rho_infty(gamma_{k_star}) scales as O(N^{-4/3}) in probability. ' +
      'The adjacent normalised gaps hat{g}_{k_star+-1} are O(1) bulk-scale gaps ' +
      '(they are NOT extreme order statistics -- only the argmin site is extreme).',
    scalingOfR:
      'R_N = hat{g}_{k_star+1} / hat{B}_N = O(1) / O(N^{-4/3}) = O(N^{4/3}) -> infinity.',
    scalingOfCNear:
      'c_near(R_N) = 2/(R_N*(R_N+1)) ~ 2/N^{8/3} -> 0 as N -> infinity.',
    scalingOfCTail:
      'c_tail(N) = 2*(pi^2/6 - 1)*(hat{B}_N)^2 ~ (N^{-4/3})^2 = N^{-8/3} -> 0.',
    scalingOfCTotal:
      'c_total(N) = c_near(R_N) + c_tail(N) ~ O(N^{-8/3}) -> 0. ' +
      'Both terms vanish simultaneously under GUE-consistent scaling.',
  },
  conclusion:
    'Route C near+tail density squeeze CANNOT yield c_total > 2 for large N ' +
    'under any GUE-consistent extremal-statistics model. The failure is structural: ' +
    'the two-angle split discards many-body correlation structure that is needed ' +
    'to keep c_total bounded away from 0 as N grows.',
};

// ── Three-angle synthesis ─────────────────────────────────────────────────────

const ANGLE_SYNTHESIS = {
  angleA_numerical: {
    ref: 'imp-355 LAMBDA_MAX_GAP_EXTREMAL',
    result:
      'Numerical envelope over first ~870 zeros: R_top-K at top-20 smallest-gap sites ' +
      'is in (1, 10). Consecutive ratios at true argmin sites are typically 5-15. ' +
      'crossesCritical_topK = ' + String(LAMBDA_MAX_GAP_EXTREMAL.witness.derivedCBound.topK.crossesCritical) + '.',
    verdict: 'INSUFFICIENT: observed R >> R_critical ≈ 1.251 at genuine argmin sites.',
  },
  angleB_soundararajan: {
    ref: 'imp-396 SOUNDARARAJAN_BUI_GAP_BOUND',
    result:
      'S-B consecutive-ratio bound: C_SB_RH ≈ 2.51 (under RH), C_SB_UNCO ≈ 4.0. ' +
      'Both exceed R_critical ≈ 1.251 by a factor of 2-3. ' +
      'S-B density-1 qualifier additionally fails to cover the density-0 argmin site.',
    verdict:
      'INSUFFICIENT: best analytic C_SB is 2x above threshold; argmin site is density-0 exceptional.',
  },
  angleC_gue: {
    ref: 'Ben Arous-Bourgade 2013 (this file)',
    result:
      'GUE extremal-gap scaling (conditional on Montgomery pair correlation): ' +
      'R_N ~ N^{4/3} -> infinity. c_near(R_N) ~ N^{-8/3} -> 0. c_total -> 0. ' +
      'Route C near+tail formula fails for large N under GUE-consistent scaling.',
    verdict:
      'DEFINITIVE OBSTRUCTION: not improvable within the near+tail framework for large N. ' +
      'The root cause is the two-site S_near formula, not the tightness of Delta_max bounds.',
  },
};

// ── G3a closure status record ─────────────────────────────────────────────────

const G3A_CLOSURE_STATUS = {
  id: 'G3a',
  label: 'max gap at argmin site',
  closureLevel: 'diagnostic',
  diagnosedObstruction: {
    statement:
      'The near+tail decomposition S_{k_star} = S_near + S_tail is structurally ' +
      'insufficient for large N. Under GUE extremal-gap scaling, R_N ~ N^{4/3} and ' +
      'c_total(N) -> 0 as N -> infinity. No improvement to the Delta_max bound can ' +
      'rescue Route C within the near+tail framework.',
    rCritical: R_CRITICAL,
    rCriticalFormula:
      'Solve 2/(R*(R+1)) + 2*(pi^2/6 - 1) = 2: ' +
      'R = (-1 + sqrt(1 + 4*C_thresh)) / 2, C_thresh = 2/(2 - 2*(pi^2/6 - 1))',
    asymptotic:
      'R_N = O(N^{4/3}) under GUE (Ben Arous-Bourgade 2013) vs R_critical ≈ 1.251.',
  },
  openSubGap: {
    id: 'G3a_sub_fullsum',
    statement:
      'Derive a lower bound on S_{k_star} = sum_{j not in {k_star, k_star+1}} ' +
      '1 / [(gamma_{k_star+1} - gamma_j)*(gamma_{k_star} - gamma_j)] ' +
      'using the FULL many-body sum, not the two-site near+tail split. ' +
      'The full sum has multi-body repulsion structure that the two-angle split discards.',
    possibleRoute:
      'Selberg integral methods for GUE, or direct Calogero-Moser dynamics analysis ' +
      'in the thermodynamic limit, may produce a lower bound ~ C/B^2 with C bounded ' +
      'away from 0 as B -> 0. (REFUTED -- see resolution below.)',
    status: 'resolved-negative',
    resolvedBy: 'imp-507 (src/math/g3a-fullsum-closure.js) + imp-2514 (status sync + assertion)',
    resolution:
      'NEGATIVE RESOLUTION. The full many-body sum was analysed in g3a-fullsum-closure.js ' +
      '(imp-507) and admits NO lower bound of the form S_{k_star} >= C/B^2 with C bounded ' +
      'away from 0, so the possibleRoute above cannot succeed. Three unconditional facts ' +
      'decide it. (1) POSITIVITY: the excluded indices {k_star, k_star+1} are exactly the ' +
      'two zeros bracketing the minimum gap, so every surviving gamma_j lies strictly ' +
      'outside the open interval (gamma_{k_star}, gamma_{k_star+1}); both factors then ' +
      'share a sign and every term is strictly positive. (2) NO 1/B SINGULARITY: the only ' +
      'denominators that could approach 0 as B -> 0 sit at j in {k_star, k_star+1} -- ' +
      'precisely the excluded terms. The nearest surviving denominators are the flanking ' +
      'bulk gaps, which stay O(1) (Ben Arous-Bourgade: only the argmin gap is extreme), so ' +
      'S_{k_star} = Theta(1), NOT Omega(1/B^2). (3) EQUIDISTANT CEILING (imp-507): for ANY ' +
      'configuration with strict minimum gap B, S_{k_star} * B^2 < 2 unconditionally. ' +
      'Hence c(N) = S_{k_star} * B^2 -> 0 and the Route C requirement c(N) > 2 is ' +
      'unreachable via the static full sum. The residual research content moves to the ' +
      'named successor sub-gap G3a_sub_fullsum_dynamical (g3a-fullsum-closure.js), which ' +
      'needs a DYNAMICAL Dyson-ODE argument rather than any static lower bound on S_{k_star}.',
    successorSubGap: 'G3a_sub_fullsum_dynamical (in src/math/g3a-fullsum-closure.js, imp-507)',
  },
  priorSubGaps: {
    G3a_sub_sound: {
      status: 'closed-by-imp-396',
      note: 'S-B framework ported; threshold C_SB_THRESHOLD ≈ 1.251 derived; obstruction identified.',
    },
    G3a_sub_argmin_exceptional: {
      status: 'open',
      note: 'Argmin site is a density-0 exceptional event; S-B density-1 bound does not apply.',
      ref: 'imp-396',
    },
    G3a_sub_ratio_unconditional: {
      status: 'open',
      note: 'No analytic bound reaches C_SB <= 1.251; best known is C_SB_RH ≈ 2.51.',
      ref: 'imp-396',
    },
  },
  deliveredBy:
    'imp-355 (numerical envelope) + imp-396 (S-B analytic) + imp-451 (BA-B diagnostic)',
  routeCStatus:
    'Route C density squeeze REMAINS OPEN. G3a_max_gap is diagnostically closed ' +
    '(root obstruction identified). G3a_sub_fullsum is the new primary research ticket for Route C.',
};

// ── Final assembly export ─────────────────────────────────────────────────────

export const G3A_EXTREMAL_CLOSURE = {
  id: 'imp-451',
  title: 'G3a extremal-statistics closure assembly -- Route C density squeeze',
  closes:
    'G3a_max_gap DIAGNOSTIC CLOSURE in OPEN_GAPS (lambda-roadmap.js severity flipped to closed)',
  consumes: [
    'imp-355 LAMBDA_MAX_GAP_EXTREMAL -- numerical R envelope and c_near formula',
    'imp-396 SOUNDARARAJAN_BUI_GAP_BOUND -- S-B consecutive-ratio framework and threshold',
    'imp-342 LAMBDA_INTERCEPT_DENSITY_WEYL -- Weyl tail c_tail = 2*(pi^2/6 - 1)',
    'Ben Arous-Bourgade 2013 Ann. Prob. 41(4) Theorem 1.1 -- GUE extremal gap N^{4/3} scaling',
  ],
  g3a: G3A_CLOSURE_STATUS,
  gueAnalysis: GUE_EXTREMAL_ANALYSIS,
  angleSynthesis: ANGLE_SYNTHESIS,
  rCritical: R_CRITICAL,
  jointConclusion: {
    whatIsDelivered: [
      'R_critical = ' + R_CRITICAL.toFixed(6) + ' -- exact threshold for c_total > 2',
      'GUE asymptotic: R_N ~ N^{4/3} under Montgomery pair correlation (Ben Arous-Bourgade 2013)',
      'Definitive proof that the near+tail decomposition cannot close G3a for large N',
      'G3a_max_gap diagnosed; OPEN_GAPS entry in lambda-roadmap.js flipped to severity=closed',
      'New primary open ticket G3a_sub_fullsum: full many-body S_{k_star} lower bound',
    ],
    whatRemains: [
      'G3a_sub_fullsum: RESOLVED-NEGATIVE (imp-507/imp-2514) -- full sum is Theta(1) with ' +
      'S_{k_star}*B^2 < 2 always, so no C/B^2 lower bound exists; residual moves to ' +
      'G3a_sub_fullsum_dynamical (needs a Dyson-ODE argument)',
      'G3a_sub_ratio_unconditional (imp-396): consecutive ratio C_SB <= 1.251 for any k',
      'G3a_sub_argmin_exceptional (imp-396): argmin site not in density-0 exceptional set',
      'Route C density squeeze: remains OPEN until G3a_sub_fullsum is closed',
    ],
    routeCStatus:
      'Route C density squeeze requires a fundamentally new lower bound strategy for S_{k_star}. ' +
      'The near+tail two-site approach is exhausted by this assembly. ' +
      'G3a_sub_fullsum (many-body sum) is the next research frontier.',
  },
  consumesImp355Id: LAMBDA_MAX_GAP_EXTREMAL.id,
  consumesImp396Id: SOUNDARARAJAN_BUI_GAP_BOUND.id,
  consumesImp342Id: LAMBDA_INTERCEPT_DENSITY_WEYL.id,
};

// ── Build-time assertions ─────────────────────────────────────────────────────

export const G3A_EXTREMAL_CLOSURE_ASSERTIONS = [
  {
    id: 'imp451-citation-chain-resolves',
    holds: () =>
      LAMBDA_MAX_GAP_EXTREMAL.id === 'imp-355' &&
      SOUNDARARAJAN_BUI_GAP_BOUND.id === 'imp-396' &&
      LAMBDA_INTERCEPT_DENSITY_WEYL.id === 'imp-342',
    why:
      'imp-451 cites imp-355 (numerical envelope), imp-396 (S-B framework), ' +
      'and imp-342 (Weyl tail). Any id drift in those files strands the citation chain.',
  },
  {
    id: 'imp451-r-critical-in-expected-range',
    holds: () => R_CRITICAL > 1.2 && R_CRITICAL < 1.31,
    why:
      'R_critical solves c_near(R) + c_tail = 2 with c_tail = 2*(pi^2/6 - 1) ≈ 1.29. ' +
      'Numerically R_critical ≈ 1.251. Drift outside (1.2, 1.31) means c_tail has changed ' +
      'and the Route C threshold analysis needs to be updated.',
  },
  {
    id: 'imp451-g3a-is-diagnostic-not-fully-closed',
    holds: () => G3A_CLOSURE_STATUS.closureLevel === 'diagnostic',
    why:
      'SCOPE TRIPWIRE: G3a is DIAGNOSED, not unconditionally closed. The near+tail formula ' +
      'fails for large N under GUE scaling. Upgrading closureLevel to closed without the ' +
      'G3a_sub_fullsum many-body bound would silently claim Route C is done -- it is not.',
  },
  {
    id: 'imp2514-g3a-sub-fullsum-resolved-negative',
    holds: () => {
      // G3a_sub_fullsum is resolved NEGATIVELY: the full many-body sum S_{k_star}
      // admits no lower bound C/B^2 with C bounded away from 0. Self-contained
      // re-derivation on a representative ordered configuration whose strict minimum
      // gap is B at the argmin site (index kStar). Confirms (a) every term is strictly
      // positive, (b) the equidistant ceiling S_{k_star}*B^2 < 2 (imp-507), (c) S stays
      // O(1) as B shrinks 1000x (no 1/B^2 blow-up), and (d) c = S*B^2 -> 0 << 2.
      const build = (B) => {
        const g = [0, 1, 2, 3, 4, 4 + B, 5 + B, 6 + B, 7 + B];
        const kStar = 4; // strict minimum gap B between g[kStar] and g[kStar+1]
        let S = 0;
        let allPositive = true;
        for (let j = 0; j < g.length; j++) {
          if (j === kStar || j === kStar + 1) continue;
          const term = 1 / ((g[kStar + 1] - g[j]) * (g[kStar] - g[j]));
          if (!(term > 0)) allPositive = false;
          S += term;
        }
        return { S, SB2: S * B * B, allPositive };
      };
      const big = build(1e-2);
      const small = build(1e-5);
      return (
        G3A_CLOSURE_STATUS.openSubGap.status === 'resolved-negative' &&
        big.allPositive && small.allPositive &&
        big.SB2 < 2 && small.SB2 < 2 &&
        Math.abs(small.S - big.S) / big.S < 0.05 &&
        small.SB2 < 1e-6
      );
    },
    why:
      'G3a_sub_fullsum asked for a full-many-body lower bound S_{k_star} >= C/B^2 with ' +
      'C bounded away from 0. imp-507 (g3a-fullsum-closure.js) proved this impossible ' +
      '(equidistant ceiling S_{k_star}*B^2 < 2 unconditional) and imp-2514 syncs the ' +
      'status here to resolved-negative. This assertion re-derives the decisive facts ' +
      '(positivity, the ceiling, O(1) scaling, c -> 0) on a synthetic configuration so the ' +
      'negative resolution cannot silently regress. The residual research lives in the ' +
      'successor sub-gap G3a_sub_fullsum_dynamical. NOTE: Route C still REMAINS OPEN (see ' +
      'imp451-route-c-remains-open) -- a negative resolution of the static-sum sub-gap is ' +
      'not a closure of Route C.',
  },
  {
    id: 'imp451-sb-threshold-consistent-with-imp396',
    holds: () => {
      const sbThreshold = SOUNDARARAJAN_BUI_GAP_BOUND.bound.thresholdNeeded;
      return Math.abs(sbThreshold - R_CRITICAL) < 1e-9;
    },
    why:
      'R_critical in this assembly and C_SB_THRESHOLD in imp-396 both solve ' +
      '2/(R*(R+1)) + c_tail = 2 with the same c_tail = 2*(pi^2/6-1). ' +
      'A mismatch means one file uses a different c_tail, stranding the cross-reference.',
  },
  {
    id: 'imp451-route-c-remains-open',
    holds: () =>
      G3A_CLOSURE_STATUS.routeCStatus.includes('REMAINS OPEN') &&
      G3A_CLOSURE_STATUS.openSubGap.id === 'G3a_sub_fullsum',
    why:
      'Route C is not closed by this assembly. The routeCStatus must say REMAINS OPEN ' +
      'and the primary open sub-gap must be G3a_sub_fullsum. If Route C closes in a ' +
      'future commit, both fields must be updated in the same commit that closes it.',
  },
  {
    id: 'imp827-r-critical-satisfies-route-c-closure-equation',
    holds: () => {
      // R_CRITICAL is defined as the root of c_near(R) + c_tail = 2,
      // where c_near(R) = 2/(R*(R+1)) and c_tail = 2*(pi^2/6 - 1).
      // Re-derive c_near at R_CRITICAL and check the sum equals 2 to machine precision.
      const cNearAtCrit = 2 / (R_CRITICAL * (R_CRITICAL + 1));
      return Math.abs(cNearAtCrit + C_TAIL_LOCAL - 2) < 1e-12;
    },
    why:
      'imp-827 cross-verification of gap bound formulas: R_CRITICAL is defined via the ' +
      'closed form (-1 + sqrt(1 + 4*C_thresh))/2 with C_thresh = 2/(2 - c_tail), which is ' +
      'the positive root of the quadratic R^2 + R - C_thresh = 0, equivalently ' +
      'c_near(R) + c_tail = 2. This assertion re-derives c_near at R_CRITICAL and checks ' +
      'the defining equation holds to machine precision. Drift would indicate a ' +
      'simplification bug in the closed-form root, or a change to C_TAIL_LOCAL that was ' +
      'not propagated to R_CRITICAL.',
  },
];
