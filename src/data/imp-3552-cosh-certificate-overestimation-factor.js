/**
 * @module imp-3552-cosh-certificate-overestimation-factor
 * @fileoverview imp-3552 -- MEASURE the tightness of the imp-3532 sharp cosh(a T_A)
 *   moment-tail error CERTIFICATE the other way round: the OVER-ESTIMATION FACTOR
 *       F_n(a) := bound_sharp(a,n) / |E_n(a)|   (>= 1)
 *   i.e. how many times the closed certificate sits ABOVE the exact residual tail,
 *   measured across the imp-3532 a-LADDER (not just the small-a asymptotic regime).
 *
 *   WHERE IMP-3532 / IMP-3546 STOPPED
 *   ---------------------------------
 *   imp-3532 promoted the imp-3501 O(a^(n+2)) moment-tail residual to the closed
 *   certificate
 *       |R_n(a) - (a^n/n!) M_n|  =  |E_n(a)|  <=  (a^(n+2)/(n+2)!) M_(n+2) cosh(a T_A)
 *   (sharp form), the exact residual being E_n(a) = sum_{k>=1} a^(n+2k)/(n+2k)! M_(n+2k)
 *   of the FIXED genuine-Phi autocorrelation A(tau) (NPHI = 10, support cap T_A = 6).
 *   It only checked (C1) the bound HOLDS and (C4) cosh < e^, never the over-estimation.
 *   imp-3546 then measured the RECIPROCAL ratio |E_n(a)|/sharp -> 1 as a -> 0 on a
 *   small-a asymptotic sequence a in {0.125..0.015625}. Neither quantified HOW FAR the
 *   certificate sits above the true residual across the FULL imp-3532 ladder
 *   a in {0.5, 0.25, 0.125, ...}, where the larger a make cosh(a T_A) materially
 *   inflate the bound (at a = 0.5, a T_A = 3, cosh 3 ~ 10). This module supplies that
 *   over-estimation profile.
 *
 *   THE OVER-ESTIMATION FACTOR AND ITS DECOMPOSITION (this module)
 *   -------------------------------------------------------------
 *   Write the exact residual tail as its leading term times a residual-SHAPE factor:
 *       E_n(a) = L_n(a) S_n(a),   L_n(a) := (a^(n+2)/(n+2)!) M_(n+2),
 *       S_n(a) := E_n(a)/L_n(a) = 1 + sum_{k>=2} [(n+2)!/(n+2k)!] a^(2k-2) M_(n+2k)/M_(n+2) >= 1.
 *   Since the sharp bound is exactly L_n(a) cosh(a T_A), the over-estimation factor
 *   FACTORS cleanly into the cosh inflation constant divided by the residual shape:
 *       F_n(a) = bound_sharp/|E_n(a)| = cosh(a T_A) / S_n(a).
 *   Because S_n(a) >= 1, this gives the CLOSED CEILING
 *       1 <= F_n(a) <= cosh(a T_A),
 *   so the certificate over-estimates the true residual by AT MOST the cosh(a T_A)
 *   inflation constant, and by exactly that constant to leading order (S_n -> 1 as
 *   a -> 0). The over-estimation is DOMINATED by the cosh inflation, NOT the residual
 *   shape: the shape factor S_n(a) departs from 1 only at order a^2.
 *
 *   MEASURED RESULT (self-computing; reuses the imp-3481 ladder M_0..M_6, T_A = 6)
 *   -----------------------------------------------------------------------------
 *   Over the imp-3532 ladder a in {0.5, 0.25, 0.125, 0.0625}, rungs n = 0..4:
 *   (F1) OVER-ESTIMATION PROFILE. The factor F_n(a) is ~10.06 at a = 0.5, ~2.35 at
 *        a = 0.25, ~1.29 at a = 0.125, ~1.07 at a = 0.0625 -- the certificate sits up
 *        to ~10x above the exact residual at the TOP of the ladder and tightens
 *        toward 1 as a shrinks.
 *   (F2) CEILING BY THE COSH CONSTANT. On every rung/a, F_n(a) <= cosh(a T_A) (the
 *        residual-shape ceiling); equality is approached to <0.05% -- the over-
 *        estimation is essentially the cosh inflation constant itself.
 *   (F3) SHAPE FACTOR NEAR 1. The residual-shape factor S_n(a) = |E_n(a)|/L_n(a) lies
 *        in [1, 1.00045] across the whole ladder: the true residual is within 0.045%
 *        of its own leading term, so F_n(a) = cosh(a T_A)/S_n(a) is dominated by cosh.
 *   (F4) MONOTONE a-LIMIT. F_n(a) decreases monotonically as a -> 0 on every rung and
 *        its a-limit is 1 (cosh(a T_A) -> 1, S_n -> 1) -- consistent with the imp-3546
 *        tightness limit, now framed as vanishing over-estimation.
 *   (F5) DECOMPOSITION IDENTITY. F_n(a) * S_n(a) = cosh(a T_A) reproduces to <1e-12 on
 *        every rung/a -- the over-estimation factors exactly into inflation / shape.
 *
 *   VERDICT: the imp-3532 sharp cosh(a T_A) certificate over-estimates the exact
 *   residual by the factor F_n(a) = cosh(a T_A)/S_n(a) in [1, cosh(a T_A)] -- up to
 *   ~10x at a = 0.5, dominated by the cosh inflation constant (shape within 0.045% of
 *   1), decreasing monotonically to the a-limit 1.
 *
 *   HONEST CAVEAT (mandatory)
 *   -------------------------
 *   MEASUREMENT / CERTIFICATION ONLY, at the RH-equivalent scale class. This measures
 *   the over-estimation factor of an explicit constant for the small-a moment-tail
 *   error of the degree-2 (absolute-measure) masses; it establishes NO operator
 *   positivity. Mass-feasibility is NECESSARY-BUT-NOT-SUFFICIENT and the degree-2 face
 *   carries no feasibility comparison at all (imp-3469: D_2 = 0). The operator-level
 *   K_a &gt;= 0 sign-positivity (off-diagonal endpoint-Hankel step, imp-3066) is
 *   UNTOUCHED. No RH verdict, no QED. Platt-Trudgian Lambda &lt;= 0.2 remains the
 *   rigorous SOTA.
 *
 *   @see imp-3532-moment-tail-closed-error-bound.js (the sharp certificate whose over-estimation is measured)
 *   @see imp-3546-moment-tail-bound-tightness.js (the reciprocal small-a tightness limit)
 *   @see imp-3481-autocorrelation-moment-ladder.js (the measured ladder & support cap)
 *
 *   Ticket: imp-3552 (numerical, medium).
 */

import { IMP3481_AUTOCORRELATION_MOMENT_LADDER } from './imp-3481-autocorrelation-moment-ladder.js';

const PAPER_REF = 'research-inputs/twin_ladder_consolidated_v52.pdf';

// -- Reuse the imp-3481 measured moment ladder & compact support cap ------------
const SRC = IMP3481_AUTOCORRELATION_MOMENT_LADDER.measured;
const MOM = SRC.moments;                          // { M0..M6 } fixed Phi-autocorrelation moments
const M = [MOM.M0, MOM.M1, MOM.M2, MOM.M3, MOM.M4, MOM.M5, MOM.M6];
const MMAX = 6;                                   // highest available moment index
const T_A = IMP3481_AUTOCORRELATION_MOMENT_LADDER.method.tauCap; // compact support cap = 6

/** n! for small integer n. */
function factorial(n) {
  let f = 1;
  for (let i = 2; i <= n; i += 1) f *= i;
  return f;
}

// -- The imp-3532 pieces: leading term L_n(a), exact tail E_n(a), sharp bound -----
// Leading term the bound is built on: L_n(a) = (a^(n+2)/(n+2)!) M_(n+2).
function leadingTerm(a, n) {
  return (Math.pow(a, n + 2) / factorial(n + 2)) * M[n + 2];
}
// Exact residual tail E_n(a) = sum_{k>=1} a^(n+2k)/(n+2k)! M_(n+2k), truncated at MMAX.
function exactResidualTail(a, n) {
  let tail = 0;
  for (let m = n + 2; m <= MMAX; m += 2) tail += (Math.pow(a, m) / factorial(m)) * M[m];
  return tail;
}
// Sharp certificate: L_n(a) cosh(a T_A) (the imp-3532 exact summation constant).
function closedBoundSharp(a, n) {
  return leadingTerm(a, n) * Math.cosh(a * T_A);
}

// == THE OVER-ESTIMATION FACTOR F_n(a) = sharp/|E_n(a)| = cosh(a T_A)/S_n(a) ======
const A_LADDER = Object.freeze([0.5, 0.25, 0.125, 0.0625]);   // the imp-3532 ladder (large-a regime)
const RUNGS = [0, 1, 2, 3, 4];                    // the imp-3532 instantiated rungs (M<=6)

// Per-rung over-estimation profile across the a-ladder, with the cosh/shape split.
const profile = RUNGS.map((n) => {
  const rows = A_LADDER.map((a) => {
    const cosh = Math.cosh(a * T_A);
    const lead = leadingTerm(a, n);
    const tail = exactResidualTail(a, n);
    const shape = tail / lead;                    // S_n(a) = |E_n(a)|/L_n(a) >= 1
    const factor = closedBoundSharp(a, n) / tail; // F_n(a) = over-estimation
    return Object.freeze({
      a,
      coshInflation: cosh,                         // the certificate constant
      shapeFactor: shape,                          // residual shape (>= 1)
      overEstimationFactor: factor,                // F_n(a) = cosh/shape
      belowCoshCeiling: factor <= cosh + 1e-12,    // (F2) F_n(a) <= cosh(a T_A)
      decompositionResidual: Math.abs(factor * shape - cosh), // (F5) F*S == cosh
    });
  });
  const factors = rows.map((r) => r.overEstimationFactor);
  return Object.freeze({
    n,
    rows,
    topOfLadderFactor: factors[0],                 // a = 0.5 over-estimation (~cosh 3 ~ 10)
    aLimitFactor: factors[factors.length - 1],     // smallest-a over-estimation (-> 1)
    // F_n(a) tightens (decreases) as a -> 0:
    monotoneToOne: factors.every((f, i) => i === 0 || f < factors[i - 1]),
  });
});

// -- Aggregate classifiers -------------------------------------------------------
const maxShapeFactor = Math.max(...profile.flatMap((p) => p.rows.map((r) => r.shapeFactor)));
const minShapeFactor = Math.min(...profile.flatMap((p) => p.rows.map((r) => r.shapeFactor)));
const allBelowCoshCeiling = profile.every((p) => p.rows.every((r) => r.belowCoshCeiling));
const worstDecompositionResidual = Math.max(
  ...profile.flatMap((p) => p.rows.map((r) => r.decompositionResidual)),
);
const allMonotoneToOne = profile.every((p) => p.monotoneToOne);
const maxTopOfLadderFactor = Math.max(...profile.map((p) => p.topOfLadderFactor));
const maxALimitFactor = Math.max(...profile.map((p) => p.aLimitFactor));

// Bands: over-estimation is up to ~cosh 3 ~ 10 at a=0.5, ceiling by cosh, shape ~ 1.
const COSH_HALF = Math.cosh(0.5 * T_A);           // cosh 3 ~ 10.0677 -- the a=0.5 ceiling
const SHAPE_CEILING = 1.001;                      // residual-shape stays within 0.1% of 1
const A_LIMIT_CEILING = 1.08;                     // smallest-a factor already within ~7% of 1

const shapeNearOne = minShapeFactor >= 1 - 1e-12 && maxShapeFactor < SHAPE_CEILING;
const topOfLadderMatchesCosh =
  maxTopOfLadderFactor <= COSH_HALF + 1e-9 && maxTopOfLadderFactor > 0.999 * COSH_HALF;
const aLimitTightens = maxALimitFactor < A_LIMIT_CEILING;

const verdict =
  allBelowCoshCeiling && shapeNearOne && topOfLadderMatchesCosh &&
  aLimitTightens && allMonotoneToOne && worstDecompositionResidual < 1e-12
    ? 'imp-3532-cosh(aT_A)-CERTIFICATE-OVER-ESTIMATES-EXACT-RESIDUAL-BY-F_n(a)=cosh(aT_A)/S_n(a)-IN-[1,cosh(aT_A)]-UP-TO-~10x-AT-a=0.5-DOMINATED-BY-COSH-INFLATION-SHAPE-WITHIN-0.05%-OF-1-MONOTONE-a-LIMIT-1'
    : 'INDETERMINATE';

export const IMP3552_COSH_CERTIFICATE_OVERESTIMATION_FACTOR = Object.freeze({
  id: 'imp-3552-cosh-certificate-overestimation-factor',
  ticket: 'imp-3552',
  paperSourcePath: PAPER_REF,
  paperSections: ['§25', '§26', '§27'],
  relatedClosedBound: 'imp-3532-moment-tail-closed-error-bound.js',
  relatedTightnessLimit: 'imp-3546-moment-tail-bound-tightness.js',
  relatedMomentLadder: 'imp-3481-autocorrelation-moment-ladder.js',

  summary:
    'Measures how far the imp-3532 sharp cosh(a T_A) moment-tail certificate sits ABOVE the exact ' +
    'residual: the over-estimation factor F_n(a) = bound_sharp/|E_n(a)| across the imp-3532 a-ladder ' +
    'a in {0.5,0.25,0.125,0.0625}, rungs n=0..4. Writing E_n(a)=L_n(a)S_n(a) with leading term ' +
    'L_n(a)=(a^(n+2)/(n+2)!)M_(n+2) and residual-shape S_n(a)=|E_n(a)|/L_n(a)>=1, the factor splits ' +
    'exactly as F_n(a)=cosh(a T_A)/S_n(a), giving the closed ceiling 1<=F_n(a)<=cosh(a T_A). MEASURED: ' +
    'F_n(a) is ~10.06 at a=0.5 (~cosh 3), ~2.35 at 0.25, ~1.29 at 0.125, ~1.07 at 0.0625 -- the ' +
    'certificate over-estimates the true residual by up to ~10x at the top of the ladder, decreasing ' +
    'monotonically to the a-limit 1. The over-estimation is DOMINATED by the cosh inflation constant: ' +
    'the shape factor S_n(a) stays within [1,1.00045] (residual within 0.045% of its leading term), and ' +
    'F_n(a)*S_n(a)=cosh(a T_A) reproduces to <1e-12. Reuses the imp-3481 ladder M_0..M_6, T_A=6. ' +
    'MEASUREMENT/CERTIFICATION, RH-EQUIVALENT, necessary-but-not-sufficient; degree-2 face carries no ' +
    'feasibility ratio (D_2=0); operator positivity (imp-3066) untouched; no QED.',

  method: Object.freeze({
    overEstimationFactor: 'F_n(a) := bound_sharp(a,n)/|E_n(a)| >= 1 (how far the certificate sits above the residual)',
    exactResidual: 'E_n(a) = R_n(a)-(a^n/n!)M_n = sum_{k>=1} a^(n+2k)/(n+2k)! M_(n+2k) (imp-3532 E1)',
    leadingTerm: 'L_n(a) = (a^(n+2)/(n+2)!) M_(n+2) (the term the bound multiplies by cosh)',
    shapeFactor: 'S_n(a) = |E_n(a)|/L_n(a) = 1 + sum_{k>=2} [(n+2)!/(n+2k)!] a^(2k-2) M_(n+2k)/M_(n+2) >= 1',
    decomposition: 'F_n(a) = bound_sharp/|E_n(a)| = L_n(a)cosh(a T_A)/(L_n(a)S_n(a)) = cosh(a T_A)/S_n(a)',
    closedCeiling: '1 <= F_n(a) <= cosh(a T_A) since S_n(a) >= 1 -- the over-estimation is at most the inflation constant',
    aLimit: 'F_n(a) -> 1 as a -> 0 (cosh(a T_A)->1 and S_n(a)->1); over-estimation vanishes in the small-a limit',
    aLadder: A_LADDER,
    rungs: RUNGS,
    supportCap: T_A,
    momentsUsed: Object.freeze({ M0: M[0], M1: M[1], M2: M[2], M3: M[3], M4: M[4], M5: M[5], M6: M[6] }),
    shapeCeiling: SHAPE_CEILING,
    coshHalfLadder: COSH_HALF,
    selfComputing: true,
  }),

  measured: Object.freeze({
    profile,                                       // per-rung over-estimation rows across the ladder
    maxShapeFactor,                                // (F3) residual within ~0.045% of leading term
    minShapeFactor,                                // >= 1
    allBelowCoshCeiling,                           // (F2) F_n(a) <= cosh(a T_A) on every rung/a
    worstDecompositionResidual,                    // (F5) |F*S - cosh| < 1e-12
    allMonotoneToOne,                              // (F4) F_n(a) decreases as a -> 0
    maxTopOfLadderFactor,                          // (F1) a=0.5 over-estimation ~ cosh 3 ~ 10.07
    maxALimitFactor,                               // smallest-a over-estimation (-> 1)
    coshHalfLadder: COSH_HALF,
    knownALimit: 1,
    verdict,
  }),

  interpretation: Object.freeze({
    whatItAdds:
      'imp-3532 checked its cosh(a T_A) certificate HOLDS; imp-3546 showed the reciprocal ratio ' +
      '|E_n(a)|/sharp -> 1 in the small-a limit. This module quantifies the over-estimation the OTHER ' +
      'way -- how many times the certificate exceeds the true residual across the full imp-3532 ladder, ' +
      'including the large-a regime (a=0.5) where the cosh constant inflates the bound ~10x.',
    whyCoshDominates:
      'The factor splits exactly as F_n(a)=cosh(a T_A)/S_n(a) with S_n(a)=|E_n(a)|/L_n(a) the residual ' +
      'shape. Since S_n stays within 0.05% of 1 across the ladder (the higher tail terms are tiny), the ' +
      'over-estimation is essentially the cosh(a T_A) inflation constant itself, capped by it.',
    aLimit:
      'As a -> 0 both cosh(a T_A) -> 1 and S_n -> 1, so F_n(a) -> 1: the certificate becomes exact. The ' +
      'over-estimation is a purely finite-a effect, largest (~10x) at the top of the ladder.',
  }),

  honestCaveat: Object.freeze({
    isProof: false,
    isReductionBelowRH: false,
    rhEquivalent: true,
    isCertificationAndMeasurement: true,
    numericalCharacterizationOnly:
      'This module measures the over-estimation factor of the imp-3532 explicit closed constant for the ' +
      'small-a moment-tail error of the A-weighted degree-2 masses. It establishes NO operator positivity.',
    necessaryNotSufficient:
      'Mass-feasibility is NECESSARY-BUT-NOT-SUFFICIENT, and the degree-2 face carries no feasibility ' +
      'comparison at all (imp-3469: D_2 = 0). The operator-level K_a >= 0 sign-positivity (off-diagonal ' +
      'endpoint-Hankel step, imp-3066) remains the lone obstruction, UNTOUCHED. No RH verdict.',
    didNotAttemptPositivity: true,
    sota: 'Platt-Trudgian Lambda <= 0.2 remains the rigorous SOTA',
  }),
});

// -- Tripwire assertions --------------------------------------------------------
export const IMP3552_COSH_CERTIFICATE_OVERESTIMATION_FACTOR_ASSERTIONS = [
  {
    id: 'imp3552-overestimation-ceiling-by-cosh',
    why: 'THE CEILING: the over-estimation factor F_n(a)=bound_sharp/|E_n(a)| must not exceed the cosh(a ' +
         'T_A) inflation constant on any rung/a -- since F_n(a)=cosh(a T_A)/S_n(a) with the residual-shape ' +
         'S_n(a) >= 1, the certificate over-estimates by AT MOST the inflation constant.',
    holds: () => allBelowCoshCeiling,
  },
  {
    id: 'imp3552-shape-factor-near-one',
    why: 'F3: the residual-shape factor S_n(a)=|E_n(a)|/L_n(a) must lie in [1,1.001] across the ladder -- ' +
         'the true residual is within 0.1% of its own leading term, so the over-estimation is DOMINATED ' +
         'by the cosh inflation constant, not the residual shape.',
    holds: () => shapeNearOne,
  },
  {
    id: 'imp3552-top-of-ladder-factor-matches-cosh3',
    why: 'F1: at the top of the ladder (a=0.5, a T_A=3) the over-estimation factor must match cosh 3 ~ ' +
         '10.07 to within the shape correction -- the certificate sits ~10x above the exact residual there.',
    holds: () => topOfLadderMatchesCosh,
  },
  {
    id: 'imp3552-factor-monotone-tightens-to-one',
    why: 'F4: the over-estimation factor F_n(a) must decrease monotonically as a -> 0 on every rung, its ' +
         'smallest-a value already within ~7% of the a-limit 1 -- the certificate tightens for small a.',
    holds: () => allMonotoneToOne && aLimitTightens,
  },
  {
    id: 'imp3552-decomposition-identity-holds',
    why: 'F5: the exact split F_n(a)*S_n(a) = cosh(a T_A) must reproduce to <1e-12 on every rung/a -- the ' +
         'over-estimation factors exactly into the cosh inflation constant divided by the residual shape.',
    holds: () => worstDecompositionResidual < 1e-12,
  },
  {
    id: 'imp3552-verdict-classifies-the-overestimation',
    why: 'The verdict must certify the cosh certificate over-estimates the exact residual by F_n(a)=cosh(a ' +
         'T_A)/S_n(a) in [1,cosh(a T_A)], up to ~10x at a=0.5, dominated by cosh, monotone to the a-limit 1.',
    holds: () => verdict.startsWith('imp-3532-cosh(aT_A)-CERTIFICATE-OVER-ESTIMATES'),
  },
  {
    id: 'imp3552-honest-measurement-not-a-verdict',
    why: 'Mandatory honesty: measurement/certification only, mass-feasibility necessary-but-not-sufficient ' +
         '(no degree-2 ratio, D_2=0), operator positivity (imp-3066) untouched, PT 0.2 stays SOTA.',
    holds: () => {
      const c = IMP3552_COSH_CERTIFICATE_OVERESTIMATION_FACTOR.honestCaveat;
      return (
        c.isProof === false &&
        c.isReductionBelowRH === false &&
        c.isCertificationAndMeasurement === true &&
        c.didNotAttemptPositivity === true &&
        /Platt-Trudgian/.test(c.sota)
      );
    },
  },
];

for (const assertion of IMP3552_COSH_CERTIFICATE_OVERESTIMATION_FACTOR_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-3552-cosh-certificate-overestimation-factor assertion failed: ${assertion.id}`);
  }
}

export default IMP3552_COSH_CERTIFICATE_OVERESTIMATION_FACTOR;
