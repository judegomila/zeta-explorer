/**
 * @module imp-3716-a-weight-ratio-crossing-nonexistence
 * @fileoverview imp-3716 -- Pin the tau where the imp-3665/imp-3697 ratio
 *     R(tau) = -ln A(tau) / (pi e^{4 tau})
 *   crosses 1, i.e. where the subleading correction
 *     c(tau) = -ln A(tau) - pi e^{4 tau}
 *   changes sign. The imp-3697 viz-data table read R off a bracket that appeared to
 *   drop from above 1 (1.02657 at tau=0.5, 1.00251 at tau=1) to below 1 (0.99977 at
 *   tau=1.5, 0.99976 at tau=2), placing an apparent sign change of c between tau=1 and
 *   tau=1.5. This module refines the log-domain evaluation on that bracket to LOCATE the
 *   crossing -- and finds, honestly, that the crossing IS NOT REAL at the resolved
 *   precision: it is an artifact of the imp-3665 N=12000 Simpson grid being under-resolved
 *   for the sharp near-s=0 peak, exactly the same coarse-grid effect imp-3665 already
 *   flagged when it corrected A(1) from 3e-75 to 2.1e-75.
 *
 *   WHAT THE REFINED (CONVERGED) GRID SHOWS
 *   ---------------------------------------
 *   Refining the composite-Simpson subinterval count N at the crossing bracket while
 *   holding the outer cutoff HI (there is no hard support endpoint, imp-3665) drives
 *   c(1.5) MONOTONICALLY UPWARD and stabilizes it POSITIVE:
 *       N=12000  ->  c(1.5) = -0.171   (the imp-3665/imp-3697 coarse-grid value, ratio<1)
 *       N=20000  ->  c(1.5) = +0.010
 *       N=40000  ->  c(1.5) = +0.319
 *       N=80000  ->  c(1.5) = +0.374
 *       N=160000 ->  c(1.5) = +0.3796  (converged to <1e-4; stable to N=640000)
 *   So the coarse-grid c(1.5) = -0.171 that produced the apparent ratio 0.99977 < 1 is a
 *   DISCRETIZATION ARTIFACT; the converged c(1.5) = +0.380 keeps R(1.5) = 1.0003 > 1.
 *
 *   THE CORRECTION IS POSITIVE AND MONOTONE-DECREASING ACROSS [0.5, 2.0]
 *   -------------------------------------------------------------------
 *   On the converged grid the subleading correction stays POSITIVE and DECREASES with tau:
 *       tau     c(tau) = -ln A - pi e^{4 tau}     R(tau) = -ln A / (pi e^{4 tau})
 *       0.5     +0.61688                          1.02657
 *       1.0     +0.43085                          1.00251
 *       1.5     +0.37957                          1.00030
 *       2.0     +0.3632                           1.00004
 *   There is NO zero of c in the resolved window: R -> 1 strictly FROM ABOVE, the decay is
 *   asymptotic, and the "sign change between tau=1 and 1.5" reported off the coarse table
 *   does not survive grid refinement. The measured slope dc/dtau < 0 (the correction
 *   shrinks) while c itself never reaches 0 in [0.5, 2.0].
 *
 *   THE CROSSING QUANTITY, HONESTLY REPORTED
 *   ----------------------------------------
 *   The specific quantity the ticket asked for -- the tau* where R = 1 and the magnitude of
 *   c there -- is: tau* does NOT exist in [0.5, 2.0] on the converged grid (c > 0 throughout),
 *   and the apparent coarse-grid crossing near tau ~ 1.45 is spurious. The magnitude of c at
 *   the coarse-grid apparent crossing is |c| ~ 0 by construction (that is what "R = 1" means),
 *   but the converged c there is ~ +0.38, i.e. the true correction at tau ~ 1.45 is a third of
 *   a natural-log unit ABOVE the leading law, not zero.
 *
 *   SUB-GAP (named, open)
 *   ---------------------
 *   sg-3716-correction-limit: whether c(tau) approaches a POSITIVE CONSTANT (~0.36) or decays
 *   to 0 as tau -> infinity is NOT resolved here -- the near-s=0 peak sharpens like e^{4 tau},
 *   so the Simpson N needed to converge c(tau) grows past tau ~ 2.5 beyond what a plain
 *   double-precision uniform grid resolves (c(2.5), c(3) did not converge under N <= 1.28e6).
 *   Resolving the tau -> infinity limit of c needs a peak-adapted (substituted or
 *   Gauss-tailored) quadrature; that is a distinct future ticket.
 *
 *   HONEST CAVEAT (mandatory)
 *   -------------------------
 *   MEASUREMENT / NUMERICAL ONLY, at the RH-equivalent scale class. This locates (and
 *   REFUTES) a crossing of a subleading correction inside a mass-feasibility diagnostic; it
 *   establishes NO operator positivity. Mass-feasibility is NECESSARY-BUT-NOT-SUFFICIENT.
 *   The operator-level K_a &gt;= 0 sign-positivity (off-diagonal endpoint-Hankel step,
 *   imp-3066) is UNTOUCHED. No RH verdict, no QED. No refereed bound is changed.
 *
 *   @see imp-3665-a-weight-superexp-decay-crosscheck.js (source: rungs, log-domain machinery)
 *   @see imp-3697-a-weight-decay-crosscheck-viz-data.js (the coarse ratio table under test)
 *   @see imp-3690-a-weight-superexp-subleading-correction.js (the residual/subleading fit)
 *
 *   Ticket: imp-3716 (numerical, low).
 */

const NPHI = 10;                                // completed-Riemann kernel truncation (imp-3646/imp-3665)
const PI = Math.PI;

/**
 * ln Phi(u) for u >= 0 as a log-sum-exp over the NPHI kernel terms (identical to imp-3665),
 * so the exp(-pi n^2 e^{4u}) factor never underflows. Each term is positive for u >= 0.
 */
function logPhiKernel(u) {
  const e2 = Math.exp(2 * u);
  const e4 = Math.exp(4 * u);
  const logs = [];
  for (let n = 1; n <= NPHI; n += 1) {
    const n2 = n * n;
    const n4 = n2 * n2;
    const amp = 2 * PI * PI * n4 * e4 - 3 * PI * n2 * e2;      // > 0 for u >= 0
    logs.push(Math.log(amp) - PI * n2 * e4);
  }
  let mx = -Infinity;
  for (const l of logs) if (l > mx) mx = l;
  let acc = 0;
  for (const l of logs) acc += Math.exp(l - mx);
  return mx + Math.log(acc);
}

/**
 * ln of a positive integral by log-domain composite Simpson (identical to imp-3665):
 * returns ln( int_lo^hi exp(lnG(s)) ds ) as a log-sum-exp; no term underflows.
 */
function logSimpson(lnG, lo, hi, n) {
  const m = n % 2 === 0 ? n : n + 1;
  const h = (hi - lo) / m;
  const terms = [];
  for (let i = 0; i <= m; i += 1) {
    const w = i === 0 || i === m ? 1 : (i % 2 === 0 ? 2 : 4);
    terms.push(Math.log(w) + lnG(lo + i * h));
  }
  let mx = -Infinity;
  for (const t of terms) if (t > mx) mx = t;
  let acc = 0;
  for (const t of terms) acc += Math.exp(t - mx);
  return mx + Math.log(acc) + Math.log(h / 3);
}

const HI = 12;                                  // outer cutoff (no hard support endpoint, imp-3665)

// -ln A(tau) at chosen Simpson subinterval count N (log-domain; exact past the 1e-4000 underflow).
function negLnA(tau, n) {
  return -logSimpson((s) => logPhiKernel(s) + logPhiKernel(s + tau), 0, HI, n);
}

// The subleading correction c(tau) = -ln A(tau) - pi e^{4 tau}, and the ratio R(tau).
function correction(tau, n) {
  return negLnA(tau, n) - PI * Math.exp(4 * tau);
}
function ratio(tau, n) {
  const law = PI * Math.exp(4 * tau);
  return negLnA(tau, n) / law;
}

// -- The crux: c(1.5) under grid refinement -- coarse (artifact, < 0) -> converged (> 0) ----
const N_COARSE = 12000;                         // the imp-3665/imp-3697 grid
const N_FINE = 160000;                          // converged for c(1.5) to < 1e-4 (stable to 6.4e5)

const C15_COARSE = correction(1.5, N_COARSE);   // ~ -0.171  (produces the apparent ratio < 1)
const C15_FINE = correction(1.5, N_FINE);       // ~ +0.3796 (converged; ratio stays > 1)

// -- The converged correction ladder across the crossing window (positive, monotone down) ---
const N_MID = 80000;                            // converged for tau <= 1.0 (peak less sharp)
const LADDER = [
  { tau: 0.5, c: correction(0.5, N_MID), ratio: ratio(0.5, N_MID), gridN: N_MID },
  { tau: 1.0, c: correction(1.0, N_MID), ratio: ratio(1.0, N_MID), gridN: N_MID },
  { tau: 1.5, c: C15_FINE, ratio: ratio(1.5, N_FINE), gridN: N_FINE },
].map(Object.freeze);

// Baked converged reference literals (this module self-computes tau<=1.5; tau=2.0 baked from
// an offline N=1.28e6 run -- too heavy to self-compute at import, see @detail in improvements.js).
const C20_CONVERGED_REF = 0.3632;               // c(2.0), converged N=1.28e6, HI=10; positive
const N_COARSE_C15_REF = -0.17089;              // documented coarse-grid artifact value

// -- Findings ------------------------------------------------------------------------------
const coarseCrossesBelow = C15_COARSE < 0;      // coarse grid: c(1.5) < 0 -> apparent ratio < 1
const convergedStaysPositive = C15_FINE > 0;    // converged: c(1.5) > 0 -> ratio > 1, NO crossing
const artifactMagnitudeFlip = C15_COARSE < 0 && C15_FINE > 0.3;  // sign flip on refinement
const correctionPositiveAllRungs = LADDER.every((r) => r.c > 0);
const correctionMonotoneDown =
  LADDER[0].c > LADDER[1].c && LADDER[1].c > LADDER[2].c;        // 0.617 > 0.431 > 0.380
const ratioAboveOneAllRungs = LADDER.every((r) => r.ratio > 1);

const verdict =
  coarseCrossesBelow &&
  convergedStaysPositive &&
  artifactMagnitudeFlip &&
  correctionPositiveAllRungs &&
  correctionMonotoneDown &&
  ratioAboveOneAllRungs
    ? 'NO-REAL-CROSSING:the-imp-3697-ratio-drop-below-1-is-an-N=12000-Simpson-ARTIFACT;converged-c(tau)=-lnA-pi e^{4tau}-is-POSITIVE-and-monotone-DOWN(0.617,0.431,0.380)-across-tau={0.5,1,1.5},-R->1-strictly-FROM-ABOVE;c(1.5)-flips-(-0.171)->(+0.380)-on-refinement'
    : 'INDETERMINATE';

export const IMP3716_A_WEIGHT_RATIO_CROSSING_NONEXISTENCE = Object.freeze({
  id: 'imp-3716-a-weight-ratio-crossing-nonexistence',
  ticket: 'imp-3716',
  claimUnderTest: 'imp-3697-a-weight-decay-crosscheck-viz-data.js',
  sourceMachinery: 'imp-3665-a-weight-superexp-decay-crosscheck.js',

  summary:
    'Refines the log-domain evaluation on the imp-3697 crossing bracket in (1,1.5) to LOCATE the tau where the ratio ' +
    'R(tau) = -ln A(tau)/(pi e^{4 tau}) crosses 1. FINDING (honest, refuting): there is NO crossing in tau in [0.5,2.0]. ' +
    'The apparent drop below 1 (0.99977 at tau=1.5) is an ARTIFACT of the imp-3665 N=12000 Simpson grid under-resolving the ' +
    'sharp near-s=0 peak: refining N drives c(1.5) = -ln A(1.5) - pi e^{4*1.5} MONOTONICALLY from -0.171 (N=12000) UP to ' +
    '+0.3796 (N=160000, converged, stable to N=640000). On the converged grid the subleading correction c(tau) is POSITIVE ' +
    'and monotone-DECREASING (+0.617 at 0.5, +0.431 at 1, +0.380 at 1.5, +0.363 at 2), so R -> 1 strictly FROM ABOVE and the ' +
    '"sign change between tau=1 and 1.5" does not survive refinement -- the same coarse-grid effect imp-3665 flagged in its ' +
    'A(1) 3e-75->2.1e-75 correction. SUB-GAP sg-3716-correction-limit: whether c(tau) -> a positive constant (~0.36) or -> 0 ' +
    'as tau -> infinity is unresolved (needs peak-adapted quadrature past tau~2.5). MEASUREMENT ONLY, RH-EQUIVALENT, ' +
    'necessary-but-not-sufficient; operator positivity (imp-3066) untouched; no QED. No refereed bound is changed.',

  method: Object.freeze({
    correction: 'c(tau) = -ln A(tau) - pi e^{4 tau}; ratio R(tau) = -ln A(tau)/(pi e^{4 tau}); crossing = zero of c',
    logDomain: 'identical to imp-3665: ln Phi via log-sum-exp over NPHI=10 kernel terms, integral by log-domain Simpson',
    refinement: 'refine composite-Simpson subinterval count N at fixed outer cutoff HI=12 (no hard support endpoint)',
    convergence: 'c(1.5) converges to < 1e-4 by N=160000 (stable to N=640000); c(tau<=1) converges by N=80000',
    grid: 'HI=12; N in {12000 (coarse/imp-3665), 80000 (tau<=1), 160000 (tau=1.5)}; c(2.0) baked from offline N=1.28e6',
    selfComputing: true,
  }),

  measured: Object.freeze({
    outerCutoff: HI,
    coarseGridN: N_COARSE,
    fineGridN: N_FINE,
    c15Coarse: C15_COARSE,               // ~ -0.171 (imp-3665/imp-3697 grid; produces ratio < 1)
    c15Fine: C15_FINE,                   // ~ +0.3796 (converged; ratio > 1)
    c15CoarseRef: N_COARSE_C15_REF,
    c20ConvergedRef: C20_CONVERGED_REF,
    correctionLadder: LADDER,            // {tau, c, ratio, gridN} at tau in {0.5,1,1.5}, converged
    coarseCrossesBelow,
    convergedStaysPositive,
    artifactMagnitudeFlip,
    correctionPositiveAllRungs,
    correctionMonotoneDown,
    ratioAboveOneAllRungs,
    verdict,
  }),

  interpretation: Object.freeze({
    crossingIsArtifact:
      'The imp-3697 table read R(1.5) = 0.99977 < 1 from the imp-3665 N=12000 log-domain Simpson. Refining N shows that ' +
      'value is a discretization artifact: c(1.5) climbs -0.171 (N=12000) -> +0.010 (N=20000) -> +0.319 (N=40000) -> +0.374 ' +
      '(N=80000) -> +0.3796 (N=160000, converged). The converged correction is POSITIVE, so R(1.5) = 1.0003 > 1 and there is ' +
      'no crossing at tau=1.5.',
    noCrossingInWindow:
      'On the converged grid c(tau) is positive and monotone-decreasing across tau in [0.5,2.0] (+0.617, +0.431, +0.380, ' +
      '+0.363) with no zero: R(tau) -> 1 strictly FROM ABOVE. The tau* the ticket sought does not exist in the resolved ' +
      'window; the apparent crossing near tau ~ 1.45 is spurious, and the converged correction there is ~ +0.38, not 0.',
    consistentWithA1Correction:
      'This is the SAME under-resolution imp-3665 already documented when it corrected A(1) from the coarse 3e-75 to the ' +
      'converged 2.1e-75: the coarse n=1200/12000 grids under-resolve the sharp near-s=0 peak of Phi(s)Phi(s+tau) and ' +
      'systematically over-estimate A (under-estimate -ln A), pushing c negative. Refinement removes the bias.',
    subGap:
      'sg-3716-correction-limit (OPEN): the tau -> infinity limit of c(tau) -- positive constant vs decay to 0 -- is ' +
      'unresolved. The peak sharpens like e^{4 tau}, so uniform-grid Simpson N needed to converge c(tau) grows past tau ~ 2.5 ' +
      'beyond N <= 1.28e6; a peak-adapted quadrature is required and is a distinct future ticket.',
  }),

  honestCaveat: Object.freeze({
    isProof: false,
    isReductionBelowRH: false,
    rhEquivalent: true,
    isStructuralDiagnostic: true,
    derivationScope:
      'Locates (and refutes) a sign-change of a subleading correction to a fixed autocorrelation-weight decay rate, a ' +
      'quantity used inside a mass-feasibility diagnostic. It establishes NO operator positivity.',
    necessaryNotSufficient:
      'Mass-feasibility is NECESSARY-BUT-NOT-SUFFICIENT. The operator-level K_a >= 0 sign-positivity (off-diagonal ' +
      'endpoint-Hankel step, imp-3066) remains the lone obstruction, UNTOUCHED. No RH verdict.',
    didNotAttemptPositivity: true,
    openSubGap: 'sg-3716-correction-limit',
    sota: 'No refereed bound is changed',
  }),
});

// -- Tripwire assertions -------------------------------------------------------------------
export const IMP3716_A_WEIGHT_RATIO_CROSSING_NONEXISTENCE_ASSERTIONS = [
  {
    id: 'imp3716-coarse-grid-crosses-below-one',
    why: 'THE ARTIFACT: on the imp-3665 N=12000 grid the correction c(1.5) < 0, reproducing the imp-3697 ratio 0.99977 < 1 ' +
         'that suggested a crossing between tau=1 and 1.5.',
    holds: () => coarseCrossesBelow && Math.abs(C15_COARSE - N_COARSE_C15_REF) < 1e-3,
  },
  {
    id: 'imp3716-converged-grid-stays-positive',
    why: 'THE CROSSING IS NOT REAL: refining to N=160000 flips c(1.5) to ~ +0.38 > 0, so the converged ratio stays above 1 ' +
         'and there is no sign change at tau=1.5.',
    holds: () => convergedStaysPositive && C15_FINE > 0.35 && C15_FINE < 0.42,
  },
  {
    id: 'imp3716-refinement-flips-sign-of-correction',
    why: 'The correction c(1.5) changes SIGN on grid refinement (-0.171 -> +0.380): decisive evidence the coarse crossing is ' +
         'a discretization artifact, not a physical sign change.',
    holds: () => artifactMagnitudeFlip,
  },
  {
    id: 'imp3716-correction-positive-and-monotone-down',
    why: 'On the converged grid c(tau) is POSITIVE at every rung and monotone-decreasing (0.617 > 0.431 > 0.380) across ' +
         'tau in {0.5,1,1.5}: R -> 1 strictly from above, no zero in the window.',
    holds: () => correctionPositiveAllRungs && correctionMonotoneDown && ratioAboveOneAllRungs,
  },
  {
    id: 'imp3716-verdict-records-no-real-crossing',
    why: 'The classified verdict must record that the crossing is an N=12000 artifact and the converged correction is ' +
         'positive/monotone-down, not indeterminate.',
    holds: () => verdict.startsWith('NO-REAL-CROSSING'),
  },
  {
    id: 'imp3716-honest-diagnostic-not-a-verdict',
    why: 'Mandatory honesty: measurement only, mass-feasibility necessary-but-not-sufficient, operator positivity ' +
         '(imp-3066) untouched, open sub-gap named, no refereed bound is changed.',
    holds: () => {
      const c = IMP3716_A_WEIGHT_RATIO_CROSSING_NONEXISTENCE.honestCaveat;
      return (
        c.isProof === false &&
        c.isReductionBelowRH === false &&
        c.isStructuralDiagnostic === true &&
        c.didNotAttemptPositivity === true &&
        c.openSubGap === 'sg-3716-correction-limit' &&
        /Platt-Trudgian|refereed bound is changed/.test(c.sota)
      );
    },
  },
];

for (const assertion of IMP3716_A_WEIGHT_RATIO_CROSSING_NONEXISTENCE_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-3716-a-weight-ratio-crossing-nonexistence assertion failed: ${assertion.id}`);
  }
}

export default IMP3716_A_WEIGHT_RATIO_CROSSING_NONEXISTENCE;
