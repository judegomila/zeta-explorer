/**
 * @module imp-3573-tightness-coefficient-certification
 * @fileoverview imp-3573 -- DERIVE and CERTIFY the imp-3546 closed second-order
 *   tightness coefficient c_n against the MEASURED a^2 deficit slope of the
 *   cosh-certificate ratio on every rung n = 0..4.
 *
 *   WHERE IMP-3546 STOPPED
 *   ----------------------
 *   imp-3546 certified that the imp-3532 sharp cosh(a T_A) moment-tail bound is
 *   asymptotically TIGHT -- the ratio |E_n(a)|/sharp climbs to 1 as a -> 0 -- and
 *   STATED the second-order deficit expansion
 *       1 - |E_n(a)|/sharp = a^2 c_n + O(a^4),   c_n = T_A^2/2 - M_(n+4)/((n+3)(n+4) M_(n+2)),
 *   but only ever MEASURED the DECAY of the deficit (that it quarters per halving of
 *   a, the order-a^2 fingerprint). It never certified the VALUE of the coefficient
 *   c_n per rung -- i.e. that the deficit slope is the DERIVED closed number built
 *   from the moments, not merely something that decays at order a^2.
 *
 *   WHAT THIS MODULE ADDS (self-computing; moments reused from imp-3546)
 *   -------------------------------------------------------------------
 *   The k = 1 and k = 2 terms of the exact residual E_n(a) = sum_(k>=1)
 *   a^(n+2k)/(n+2k)! M_(n+2k), together with cosh(a T_A) = 1 + (a T_A)^2/2 + O(a^4),
 *   give
 *       E_n(a)  = L_n(a) [ 1 + a^2 M_(n+4)/((n+3)(n+4) M_(n+2)) + O(a^4) ],
 *       sharp   = L_n(a) [ 1 + a^2 T_A^2/2 + O(a^4) ],   L_n(a) = (a^(n+2)/(n+2)!) M_(n+2),
 *   so 1 - E_n(a)/sharp = a^2 [ T_A^2/2 - M_(n+4)/((n+3)(n+4) M_(n+2)) ] + O(a^4) = a^2 c_n + O(a^4).
 *
 *   (D1) CLOSED COEFFICIENT. c_n is formed per rung directly from the imp-3546
 *        moment ladder (T_A = 6, so T_A^2/2 = 18 dominates; the moment correction is
 *        the ~1e-3 term that separates the rungs). c_n rises monotonically in n.
 *   (D2) FIT REFINES TO THE CLOSED VALUE. Reading the measured deficit slope
 *        g(a) = (1 - E_n(a)/sharp)/a^2 on the imp-3546 sequence a in {0.125, 0.0625,
 *        0.03125, 0.015625} and Richardson-extrapolating away the O(a^4) contamination
 *        (g(a) = c_n + d_n a^2 + e_n a^4 + ...), the fitted coefficient c_n^fit
 *        converges to the closed c_n: the raw finest-a read matches to ~3.6e-3, one
 *        Richardson level to ~5e-5, two levels to ~3e-6 -- STRICTLY refining on every
 *        rung, the signature that the deficit slope IS the derived a^2 coefficient.
 *   (D3) PER-RUNG RESOLUTION. The two-level fit resolves the small (~1e-4) rung-to-rung
 *        differences: the fitted c_n^fit ladder is strictly increasing in n, matching
 *        the closed c_n ordering -- the fit sees the moment correction, not just the
 *        shared T_A^2/2 = 18 curvature.
 *   (A1) ANCHOR. The moments are the imp-3546 ladder (itself anchored to imp-3481 to
 *        < 1e-9), so the certified coefficient is on the SAME genuine-Phi autocorrelation.
 *
 *   VERDICT: the imp-3546 closed second-order tightness coefficient c_n is CERTIFIED
 *   -- the measured a^2 deficit slope Richardson-converges to the derived closed value
 *   on every rung n = 0..4 to the ~1e-6 quadrature/truncation floor, and the fit
 *   resolves the per-rung ordering. The order-a^2 tightness is not just a decay rate
 *   but carries the derived moment-built coefficient.
 *
 *   HONEST CAVEAT (mandatory)
 *   -------------------------
 *   MEASUREMENT / DERIVATION ONLY, at the RH-equivalent scale class. This certifies the
 *   VALUE of an explicit small-a expansion coefficient for the degree-2 (absolute-measure)
 *   moment-tail error; it establishes NO operator positivity. Mass-feasibility is
 *   NECESSARY-BUT-NOT-SUFFICIENT and the degree-2 face carries no feasibility comparison
 *   at all (imp-3469: D_2 = 0). The operator-level K_a &gt;= 0 sign-positivity
 *   (off-diagonal endpoint-Hankel step, imp-3066) is UNTOUCHED. No RH verdict, no QED.
 *   No refereed bound is changed.
 *
 *   @see imp-3546-moment-tail-bound-tightness.js (states the closed c_n; supplies the moment ladder)
 *   @see imp-3532-moment-tail-closed-error-bound.js (the sharp cosh(a T_A) bound)
 *   @see imp-3481-autocorrelation-moment-ladder.js (the measured ladder & support cap; anchor)
 *
 *   Ticket: imp-3573 (accuracy, medium).
 */

import { IMP3546_MOMENT_TAIL_BOUND_TIGHTNESS } from './imp-3546-moment-tail-bound-tightness.js';

const PAPER_REF = 'research-inputs/twin_ladder_consolidated_v52.pdf';

// -- Reuse the imp-3546 moment ladder (anchored to imp-3481) & support cap -------
const MOM = IMP3546_MOMENT_TAIL_BOUND_TIGHTNESS.measured.moments;   // { M0..M10 }
const M = [MOM.M0, MOM.M1, MOM.M2, MOM.M3, MOM.M4, MOM.M5, MOM.M6, MOM.M7, MOM.M8];
const MMAX = 8;                                    // highest moment needed (M_(n+4), n<=4)
const T_A = IMP3546_MOMENT_TAIL_BOUND_TIGHTNESS.method.supportCap;  // compact support cap = 6

/** n! for small integer n. */
function factorial(n) {
  let f = 1;
  for (let i = 2; i <= n; i += 1) f *= i;
  return f;
}

// -- The imp-3532 pieces: exact residual tail & sharp cosh bound ------------------
// Exact residual E_n(a) = sum_(k>=1) a^(n+2k)/(n+2k)! M_(n+2k), truncated at MMAX.
function exactResidualTail(a, n) {
  let tail = 0;
  for (let m = n + 2; m <= MMAX; m += 2) tail += (Math.pow(a, m) / factorial(m)) * M[m];
  return tail;
}
// Sharp bound: (a^(n+2)/(n+2)!) M_(n+2) cosh(a T_A).
function closedBoundSharp(a, n) {
  return (Math.pow(a, n + 2) / factorial(n + 2)) * M[n + 2] * Math.cosh(a * T_A);
}

// == (D1) CLOSED COEFFICIENT c_n = T_A^2/2 - M_(n+4)/((n+3)(n+4) M_(n+2)) =========
function closedCoefficient(n) {
  return (T_A * T_A) / 2 - M[n + 4] / ((n + 3) * (n + 4) * M[n + 2]);
}

// == (D2)/(D3) FIT: measured deficit slope g(a) = (1 - E_n/sharp)/a^2 -> c_n ======
// Same asymptotic sequence imp-3546 used (small a, inside the Taylor regime).
const A_TIGHT = Object.freeze([0.125, 0.0625, 0.03125, 0.015625]);
const RUNGS = [0, 1, 2, 3, 4];                     // the imp-3532/imp-3546 instantiated rungs

// Richardson step removing the leading O(h^p) term from a halving sequence:
//   y(h) = y0 + c h^p + ...  =>  (2^p y(h/2) - y(h)) / (2^p - 1).
function richardsonStep(seq, p) {
  const f = Math.pow(2, p);
  const out = [];
  for (let i = 0; i + 1 < seq.length; i += 1) out.push((f * seq[i + 1] - seq[i]) / (f - 1));
  return out;
}

const perRung = RUNGS.map((n) => {
  const cClosed = closedCoefficient(n);
  const deficits = A_TIGHT.map((a) => 1 - exactResidualTail(a, n) / closedBoundSharp(a, n));
  const g = A_TIGHT.map((a, i) => deficits[i] / (a * a));   // slope estimate at each a
  // g(a) = c_n + d_n a^2 + e_n a^4 + ... : remove a^2, then a^4.
  const r1 = richardsonStep(g, 2);                 // removes the a^2 contamination
  const r2 = richardsonStep(r1, 4);                // removes the a^4 contamination
  const cFitRaw = g[g.length - 1];                 // finest-a single-point read
  const cFitR1 = r1[r1.length - 1];                // one Richardson level
  const cFitR2 = r2[r2.length - 1];                // converged two-level fit
  const rel = (x) => Math.abs(x - cClosed) / Math.abs(cClosed);
  const relRaw = rel(cFitRaw);
  const relR1 = rel(cFitR1);
  const relR2 = rel(cFitR2);
  return Object.freeze({
    n,
    cClosed,
    deficits,
    g,
    cFitRaw,
    cFitR1,
    cFitR2,
    relRaw,
    relR1,
    relR2,
    // The fit must REFINE strictly with each extrapolation order (the a^2-then-a^4
    // signature): if the deficit slope were not the derived coefficient this fails.
    refinesStrictly: relRaw > relR1 && relR1 > relR2,
  });
});

// -- Aggregate certification classifiers ----------------------------------------
const maxRelRaw = Math.max(...perRung.map((p) => p.relRaw));
const maxRelR1 = Math.max(...perRung.map((p) => p.relR1));
const maxRelR2 = Math.max(...perRung.map((p) => p.relR2));      // -> ~1e-6 floor
const allRefineStrictly = perRung.every((p) => p.refinesStrictly);

// (D3) per-rung ordering: closed c_n and fitted c_n^fit must both increase in n,
// i.e. the fit resolves the ~1e-4 moment-correction differences between rungs.
const closedIncreasing = perRung.every((p, i) => i === 0 || p.cClosed > perRung[i - 1].cClosed);
const fitIncreasing = perRung.every((p, i) => i === 0 || p.cFitR2 > perRung[i - 1].cFitR2);
const orderingResolved = closedIncreasing && fitIncreasing;

// The closed coefficient is dominated by the curvature term T_A^2/2 = 18 with a
// ~1e-3 moment correction: every c_n must sit just below 18.
const curvatureTerm = (T_A * T_A) / 2;
const allBelowCurvature = perRung.every((p) => p.cClosed < curvatureTerm && p.cClosed > curvatureTerm - 0.01);

// Certification floor: the two-level fit must match the closed value to <1e-5 on
// every rung (observed ~3e-6; the imp-3546 quadrature/moment-truncation floor).
const FIT_FLOOR = 1e-5;
const coefficientCertified = maxRelR2 < FIT_FLOOR && allRefineStrictly && orderingResolved;

const verdict = coefficientCertified && allBelowCurvature
  ? 'imp-3546-CLOSED-TIGHTNESS-COEFFICIENT-c_n=T_A^2/2-M_(n+4)/((n+3)(n+4)M_(n+2))-CERTIFIED-DEFICIT-SLOPE-RICHARDSON-CONVERGES-TO-CLOSED-VALUE-ON-RUNGS-n=0..4-TO-~1e-6-AND-RESOLVES-PER-RUNG-ORDERING'
  : 'INDETERMINATE';

export const IMP3573_TIGHTNESS_COEFFICIENT_CERTIFICATION = Object.freeze({
  id: 'imp-3573-tightness-coefficient-certification',
  ticket: 'imp-3573',
  paperSourcePath: PAPER_REF,
  paperSections: ['§25', '§26', '§27'],
  relatedTightness: 'imp-3546-moment-tail-bound-tightness.js',
  relatedClosedBound: 'imp-3532-moment-tail-closed-error-bound.js',
  relatedMomentLadder: 'imp-3481-autocorrelation-moment-ladder.js',

  summary:
    'Derives and CERTIFIES the imp-3546 closed second-order tightness coefficient ' +
    'c_n = T_A^2/2 - M_(n+4)/((n+3)(n+4) M_(n+2)) against the measured a^2 deficit slope of the ' +
    'imp-3532 cosh(a T_A) certificate ratio on every rung n=0..4. imp-3546 measured only that the ' +
    'deficit 1-|E_n(a)|/sharp quarters per halving (order a^2) but never certified the coefficient VALUE. ' +
    'Forming c_n per rung from the imp-3546 moment ladder (T_A=6 so T_A^2/2=18 dominates; the ~1e-3 moment ' +
    'correction separates the rungs) and reading the deficit slope g(a)=(1-E_n(a)/sharp)/a^2 on ' +
    'a in {0.125,0.0625,0.03125,0.015625}, then Richardson-removing the O(a^4) contamination, the fitted ' +
    'c_n^fit converges to the closed c_n: raw finest-a read ~3.6e-3, one Richardson level ~5e-5, two levels ' +
    '~3e-6 -- STRICTLY refining on every rung, and the two-level fit resolves the ~1e-4 rung-to-rung ' +
    'differences (c_n^fit strictly increasing in n, matching the closed ordering). MEASUREMENT/DERIVATION, ' +
    'RH-EQUIVALENT, necessary-but-not-sufficient; degree-2 face carries no feasibility ratio (D_2=0); ' +
    'operator positivity (imp-3066) untouched; no QED.',

  method: Object.freeze({
    closedCoefficient: 'c_n = T_A^2/2 - M_(n+4)/((n+3)(n+4) M_(n+2)) (imp-3546 deficit expansion coefficient)',
    deficitSlope: 'g(a) = (1 - E_n(a)/sharp)/a^2, with E_n(a)=sum_(k>=1) a^(n+2k)/(n+2k)! M_(n+2k) and sharp=(a^(n+2)/(n+2)!)M_(n+2)cosh(a T_A)',
    fit: 'g(a) = c_n + d_n a^2 + e_n a^4 + ... ; Richardson-extrapolate (remove a^2 then a^4) to recover c_n^fit',
    tightnessSequence: A_TIGHT,
    rungs: RUNGS,
    supportCap: T_A,
    curvatureTerm,
    momentSource: 'imp-3546 ladder M_0..M_8 (anchored to imp-3481 to <1e-9)',
    fitFloor: FIT_FLOOR,
    selfComputing: true,
  }),

  measured: Object.freeze({
    perRung,                                       // closed c_n, deficit slopes, fitted c_n, rel errors
    maxRelRaw,                                     // finest-a single read vs closed (~3.6e-3)
    maxRelR1,                                      // one Richardson level (~5e-5)
    maxRelR2,                                      // two-level fit vs closed (~3e-6 floor)
    allRefineStrictly,                             // fit improves with each extrapolation order
    closedIncreasing,
    fitIncreasing,
    orderingResolved,                              // (D3) per-rung differences resolved
    allBelowCurvature,                             // c_n just below T_A^2/2 = 18
    coefficientCertified,
    verdict,
  }),

  interpretation: Object.freeze({
    whatItAdds:
      'imp-3546 showed the deficit 1-ratio decays at order a^2 (it quarters per halving) but never ' +
      'certified that the a^2 slope equals the DERIVED closed coefficient c_n built from the moments. ' +
      'This module certifies the VALUE: the measured slope Richardson-converges to the closed c_n on ' +
      'every rung, so the tightness is not just an order but carries the moment-built coefficient.',
    whyRichardson:
      'The deficit slope g(a)=(1-E_n/sharp)/a^2 equals c_n only in the a->0 limit; at finite a it carries ' +
      'an O(a^2) term from the a^4 tail of the deficit. Removing that (and the next a^4 term) by Richardson ' +
      'extrapolation on the halving sequence isolates c_n to the quadrature/truncation floor (~3e-6).',
    perRungMeaning:
      'The rungs share the T_A^2/2=18 curvature term and differ only in the ~1e-3 moment correction ' +
      'M_(n+4)/((n+3)(n+4)M_(n+2)); the fit resolving the ~1e-4 rung-to-rung spread confirms it sees the ' +
      'moment structure, not just the common curvature.',
  }),

  honestCaveat: Object.freeze({
    isProof: false,
    isReductionBelowRH: false,
    rhEquivalent: true,
    isCertificationAndMeasurement: true,
    numericalCharacterizationOnly:
      'This module certifies the VALUE of the imp-3546 closed second-order tightness coefficient for the ' +
      'small-a moment-tail error of the A-weighted degree-2 masses. It establishes NO operator positivity.',
    necessaryNotSufficient:
      'Mass-feasibility is NECESSARY-BUT-NOT-SUFFICIENT, and the degree-2 face carries no feasibility ' +
      'comparison at all (imp-3469: D_2 = 0). The operator-level K_a >= 0 sign-positivity (off-diagonal ' +
      'endpoint-Hankel step, imp-3066) remains the lone obstruction, UNTOUCHED. No RH verdict.',
    didNotAttemptPositivity: true,
    sota: 'No refereed bound is changed',
  }),
});

// -- Tripwire assertions --------------------------------------------------------
export const IMP3573_TIGHTNESS_COEFFICIENT_CERTIFICATION_ASSERTIONS = [
  {
    id: 'imp3573-fit-converges-to-closed-coefficient',
    why: 'THE CERTIFICATION: the measured deficit slope g(a)=(1-E_n(a)/sharp)/a^2, Richardson-extrapolated ' +
         'to a->0, must match the closed c_n=T_A^2/2-M_(n+4)/((n+3)(n+4)M_(n+2)) to <1e-5 relative on every ' +
         'rung n=0..4 -- the a^2 tightness slope IS the derived moment-built coefficient.',
    holds: () => maxRelR2 < FIT_FLOOR,
  },
  {
    id: 'imp3573-fit-refines-strictly-with-order',
    why: 'The fit must IMPROVE with each Richardson level (raw > one-level > two-level relative error) on ' +
         'every rung -- the a^2-then-a^4 signature confirming the deficit really is a^2 c_n + O(a^4) with ' +
         'the derived coefficient, not a coincidental near-match.',
    holds: () => allRefineStrictly,
  },
  {
    id: 'imp3573-resolves-per-rung-ordering',
    why: 'The two-level fit must resolve the ~1e-4 rung-to-rung differences: both the closed c_n and the ' +
         'fitted c_n^fit must be strictly increasing in n, so the fit sees the moment correction that ' +
         'separates the rungs, not only the shared T_A^2/2=18 curvature.',
    holds: () => orderingResolved,
  },
  {
    id: 'imp3573-coefficient-below-curvature-term',
    why: 'Every closed c_n must sit just below the curvature term T_A^2/2=18 (within 0.01), since the ' +
         'moment correction M_(n+4)/((n+3)(n+4)M_(n+2)) is a small positive ~1e-3 subtraction.',
    holds: () => allBelowCurvature,
  },
  {
    id: 'imp3573-verdict-certifies-coefficient',
    why: 'The verdict must certify the closed tightness coefficient (deficit slope Richardson-converges to ' +
         'the closed value and resolves per-rung ordering), not be indeterminate.',
    holds: () => verdict.startsWith('imp-3546-CLOSED-TIGHTNESS-COEFFICIENT'),
  },
  {
    id: 'imp3573-honest-certification-not-a-verdict',
    why: 'Mandatory honesty: measurement/derivation only, mass-feasibility necessary-but-not-sufficient ' +
         '(no degree-2 ratio, D_2=0), operator positivity (imp-3066) untouched, no refereed bound is changed.',
    holds: () => {
      const c = IMP3573_TIGHTNESS_COEFFICIENT_CERTIFICATION.honestCaveat;
      return (
        c.isProof === false &&
        c.isReductionBelowRH === false &&
        c.isCertificationAndMeasurement === true &&
        c.didNotAttemptPositivity === true &&
        /Platt-Trudgian|refereed bound is changed/.test(c.sota)
      );
    },
  },
];

for (const assertion of IMP3573_TIGHTNESS_COEFFICIENT_CERTIFICATION_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-3573-tightness-coefficient-certification assertion failed: ${assertion.id}`);
  }
}

export default IMP3573_TIGHTNESS_COEFFICIENT_CERTIFICATION;
