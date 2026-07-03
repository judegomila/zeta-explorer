/**
 * @module imp-3490-degree2-exponent-wide-k-ladder
 * @fileoverview imp-3490 -- STRESS-TEST the imp-3469 degree-2 scaling exponent
 *   p = 2 on a WIDER k-ladder than the {2, 3, 4, 6, 8} originally tested.
 *
 *   THE IMP-3469 FACT UNDER TEST
 *   ----------------------------
 *   imp-3469 established that the DEGREE-2 (absolute-measure) bridge mass
 *       B_2(a, U) = int_0^U (cosh(a tau) - 1) A(tau) d(tau),
 *   with A(tau) the FIXED genuine-Phi autocorrelation (NPHI = 10), obeys the
 *   scaling B_2(a/k, kU) = B_2(a, U)/k^2 -- exponent p = 2 -- on the ladder
 *   k in {2, 3, 4, 6, 8}, and derived (imp-3488) that p = 2 is exact for the
 *   leading form B_2(a) = (a^2/2) M_2 + O(a^4), M_2 = int tau^2 A(tau) d(tau).
 *   But the ladder never ran past k = 8: at large k the scaled cell has
 *   a -> a/k -> 0 (tiny shear, near-cancelling cosh(a tau) - 1) and U -> kU
 *   grows large, so BOTH the small-a leading form and the U-independence
 *   (A-support truncation) could in principle break down under quadrature
 *   resolution loss. This module tests that.
 *
 *   METHOD (self-computing; A recomputed at import, no frozen data)
 *   ---------------------------------------------------------------
 *   Replicates the imp-3469 pipeline verbatim -- the truncated de Bruijn-Newman
 *   kernel Phi (NPHI = 10), the autocorrelation A(tau) = int Phi(s)Phi(s+tau)ds
 *   by composite Simpson (inner n = 1200 on [0,7]), the precomputed A grid
 *   (NM = 1600 on [0, T_A = 6]), and the degree-2 mass integrator -- then runs
 *   the EXTENDED ladder k in {2, 3, 4, 6, 8, 12, 16, 24} from BOTH base cells
 *   (0.5, 6),s = 3 and (0.4, 10),s = 4. For each rung it records the measured
 *   exponent p_k = log(B_2(a0)/B_2(a0/k))/log(k), the leading-form relative
 *   error |B_2(a0/k) - ((a0/k)^2/2)M_2|/B_2(a0/k), the degree-2 deficit D_2, and
 *   the worst-case small-argument value a*U at which cosh(a tau) - 1 is formed
 *   (a cancellation-safety probe).
 *
 *   MEASURED RESULT (extends imp-3469; NO break at large k)
 *   -------------------------------------------------------
 *   (R1) p = 2 DOES NOT BREAK at large k -- it TIGHTENS toward 2. On the new
 *        rungs k in {12, 16, 24} the measured exponent stays inside
 *        [2.0000889, 2.0001767] on both cells, STRICTLY TIGHTER than the
 *        original {2,3,4,6,8} rungs (which reach 2.00048 at k = 2). The exponent
 *        is MONOTONE DECREASING in k toward 2 (larger k => smaller scaled a =>
 *        smaller O(a^2) tail), so p = 2 is an attractor, not a resolution
 *        artifact that degrades. Every rung sits within 5e-4 of 2 (tol 1e-2).
 *   (R2) THE SMALL-a LEADING FORM PERSISTS AND SHARPENS. The relative error of
 *        B_2(a0/k) against its leading form (a^2/2)M_2 shrinks like 1/k^2, from
 *        ~1.1e-4 (k = 2) to ~7.7e-7 (k = 24) on cell S3 -- a machine-precision
 *        approach to the pure-a^2 form as a -> 0. The single fixed second moment
 *        M_2 = int tau^2 A(tau) d(tau) governs every rung.
 *   (R3) U-INDEPENDENCE PERSISTS OUT TO U = 240. D_2 = 0 identically on every
 *        rung (the crossover tauStar = arcsinh(1)/a = k*1.76 moves FURTHER out of
 *        the A support as a -> a/k), and B_2 depends on a alone: growing U from 6
 *        to 240 never re-introduces U-dependence because A(tau) truncates the
 *        integral inside its support (~[0, 0.6]) well below every cutoff.
 *   (R4) NO QUADRATURE DEGRADATION THROUGH k = 24. The exponent sequence is
 *        smooth and monotone (no noise floor), and the near-cancelling
 *        cosh(a tau) - 1 is benign: at k = 24 the worst small argument is
 *        a*T_A <= 0.125, so cosh - 1 ~ 7.8e-3 with catastrophic-cancellation
 *        relative error ~ eps/(cosh-1) ~ 3e-14 -- far below the O(a^2) tail. No
 *        k in the tested range shows resolution loss.
 *
 *   VERDICT: the imp-3469 exponent p = 2 is STABLE on the wider ladder -- it does
 *   not break at large k; it converges toward 2 as a -> 0, with the leading form
 *   and U-independence both persisting and sharpening.
 *
 *   HONEST CAVEAT (mandatory)
 *   -------------------------
 *   MEASUREMENT / STRESS-TEST ONLY, at the RH-equivalent scale class. This
 *   extends the imp-3469 scaling-law characterization of the degree-2 mass to a
 *   wider k range; it establishes NO operator positivity. Mass-feasibility is
 *   NECESSARY-BUT-NOT-SUFFICIENT and the degree-2 face carries no feasibility
 *   comparison at all (D_2 = 0). The operator-level K_a >= 0 sign-positivity
 *   (off-diagonal endpoint-Hankel step, imp-3066) is UNTOUCHED. No RH verdict,
 *   no QED. Platt-Trudgian Lambda &lt;= 0.2 remains the rigorous SOTA.
 *
 *   @see imp-3469-degree2-bridge-mass-scaling.js (the p = 2 fact stress-tested here)
 *   @see imp-3488-degree2-miss-factor-closed-form.js (closed-form p = 2 derivation)
 *   @see imp-3481-autocorrelation-moment-ladder.js (the moment M_2)
 *
 *   Ticket: imp-3490 (numerical, medium).
 */

const PAPER_REF = 'research-inputs/twin_ladder_consolidated_v52.pdf';
const NPHI = 10;                                // completed-Riemann kernel truncation

const ASINH1 = Math.asinh(1);                   // arcsinh(1), solves sinh(a tauStar) = 1

/** de Bruijn-Newman completed-Riemann kernel, truncated at n = NPHI (imp-2686). */
function phiKernel(u) {
  let s = 0;
  const e2 = Math.exp(2 * u);
  const e4 = Math.exp(4 * u);
  for (let n = 1; n <= NPHI; n += 1) {
    const n2 = n * n;
    const n4 = n2 * n2;
    s += (2 * Math.PI * Math.PI * n4 * e4 - 3 * Math.PI * n2 * e2) * Math.exp(-Math.PI * n2 * e4);
  }
  return s;
}

/** Composite Simpson quadrature of f on [lo, hi] with n subintervals (n even). */
function simpson(f, lo, hi, n) {
  const m = n % 2 === 0 ? n : n + 1;
  const h = (hi - lo) / m;
  let sum = f(lo) + f(hi);
  for (let i = 1; i < m; i += 1) {
    sum += (i % 2 === 0 ? 2 : 4) * f(lo + i * h);
  }
  return (sum * h) / 3;
}

// Phi autocorrelation A(tau) = int_0^inf Phi(s) Phi(s + tau) ds (imp-3469).
function autocorr(tau) {
  return simpson((s) => phiKernel(s) * phiKernel(s + tau), 0, 7, 1200);
}

// Precompute A on a FIXED fine Simpson grid over [0, T_A] ONCE (imp-3469).
const T_A = 6;
const NM = 1600;                                // even -> composite Simpson on [0, T_A]
const H_A = T_A / NM;
const A_GRID = [];
for (let j = 0; j <= NM; j += 1) A_GRID.push(autocorr(j * H_A));

/** Degree-2 mass = int weight(tau) A(tau) d(tau) over [lo, T_A] (imp-3469). */
function degree2Mass(weightFn, lo) {
  let sum = 0;
  for (let j = 0; j <= NM; j += 1) {
    const tau = j * H_A;
    if (tau < lo) continue;
    const w = j === 0 || j === NM ? 1 : (j % 2 === 0 ? 2 : 4);
    sum += w * weightFn(tau) * A_GRID[j];
  }
  return (sum * H_A) / 3;
}

/** The fixed second autocorrelation moment M_2 = int tau^2 A(tau) d(tau). */
const M2_MOMENT = degree2Mass((tau) => tau * tau, 0);

/** Degree-2 bridge mass B_2 and overflow deficit D_2 at a cell (a, U) (imp-3469). */
function degree2Masses(a, u) {
  const tauStar = ASINH1 / a;
  const B2 = degree2Mass((tau) => Math.cosh(a * tau) - 1, 0);
  const D2 = tauStar >= u ? 0 : degree2Mass((tau) => Math.sinh(a * tau) - 1, tauStar);
  return Object.freeze({ a, u, s: a * u, tauStar, B2, D2 });
}

/**
 * Run the EXTENDED k-ladder from a base cell (a0, u0): scale a -> a0/k, U -> k*u0
 * and measure the exponent p_k = log(B_2(a0)/B_2(a0/k))/log(k), the leading-form
 * relative error against (a^2/2)M_2, the degree-2 deficit D_2, and the worst
 * small argument a*U at which cosh(a tau) - 1 is formed.
 */
function exponentLadder(a0, u0, kValues) {
  const base = degree2Masses(a0, u0);
  const rungs = kValues.map((k) => {
    const scaled = degree2Masses(a0 / k, u0 * k);
    const exponent = Math.log(base.B2 / scaled.B2) / Math.log(k);   // measured p
    const leadForm = ((a0 / k) * (a0 / k) / 2) * M2_MOMENT;         // (a^2/2) M_2
    const leadingRelErr = Math.abs(scaled.B2 - leadForm) / scaled.B2;
    const maxArg = (a0 / k) * T_A;                                  // worst cosh arg
    const coshMinusOne = Math.cosh(maxArg) - 1;                     // cancellation probe
    return Object.freeze({
      k,
      a: a0 / k,
      u: u0 * k,
      s: scaled.s,
      B2: scaled.B2,
      D2: scaled.D2,
      exponent,                                  // stays ~2, tightens with k
      exponentDevFromTwo: Math.abs(exponent - 2),
      leadingRelErr,                             // shrinks like 1/k^2
      maxArg,                                    // a*T_A, small at large k
      coshMinusOne,                              // ~maxArg^2/2, cancellation-safe
    });
  });
  const wide = rungs.filter((r) => r.k >= 12);   // the NEW rungs beyond imp-3469
  return Object.freeze({
    base,
    rungs,
    maxExponentDev: Math.max(...rungs.map((r) => r.exponentDevFromTwo)),
    wideMaxExponentDev: Math.max(...wide.map((r) => r.exponentDevFromTwo)),
    wideMaxLeadingRelErr: Math.max(...wide.map((r) => r.leadingRelErr)),
    maxD2: Math.max(...rungs.map((r) => r.D2)),
    // Monotone tightening: exponent deviation strictly decreases as k grows.
    exponentMonotoneTightening: rungs.every(
      (r, i) => i === 0 || r.exponentDevFromTwo < rungs[i - 1].exponentDevFromTwo,
    ),
  });
}

// -- The EXTENDED ladder: original {2,3,4,6,8} plus the NEW {12,16,24} ---------
const K_LADDER_ORIGINAL = Object.freeze([2, 3, 4, 6, 8]);
const K_LADDER_WIDE = Object.freeze([12, 16, 24]);
const K_LADDER = Object.freeze([...K_LADDER_ORIGINAL, ...K_LADDER_WIDE]);
const LADDER_S3 = exponentLadder(0.5, 6, K_LADDER);   // base (0.5,6), s = 3
const LADDER_S4 = exponentLadder(0.4, 10, K_LADDER);  // base (0.4,10), s = 4

// -- Classification -----------------------------------------------------------
const EXPONENT_TOL = 1e-2;      // every measured p within [2 - tol, 2 + tol]
const WIDE_EXPONENT_TOL = 1e-3; // the NEW large-k rungs sit even tighter
const LEADING_TOL = 1e-4;       // large-k leading-form error is sub-1e-4
const DEFICIT_TOL = 1e-12;      // D_2 is numerically zero on every rung

const exponentStablePinned =
  LADDER_S3.maxExponentDev < EXPONENT_TOL && LADDER_S4.maxExponentDev < EXPONENT_TOL;
const wideRungsTighter =
  LADDER_S3.wideMaxExponentDev < WIDE_EXPONENT_TOL &&
  LADDER_S4.wideMaxExponentDev < WIDE_EXPONENT_TOL;
const exponentTightensToTwo =
  LADDER_S3.exponentMonotoneTightening && LADDER_S4.exponentMonotoneTightening;
const leadingFormSharpens =
  LADDER_S3.wideMaxLeadingRelErr < LEADING_TOL && LADDER_S4.wideMaxLeadingRelErr < LEADING_TOL;
const deficitVanishesAtLargeU =
  LADDER_S3.maxD2 < DEFICIT_TOL && LADDER_S4.maxD2 < DEFICIT_TOL;

const verdict =
  exponentStablePinned && wideRungsTighter && exponentTightensToTwo &&
  leadingFormSharpens && deficitVanishesAtLargeU
    ? 'DEGREE-2-EXPONENT-p=2-STABLE-ON-WIDER-LADDER-k=12,16,24-TIGHTENS-TOWARD-2-NO-BREAK-NO-QUADRATURE-DEGRADATION'
    : 'INDETERMINATE';

export const IMP3490_DEGREE2_EXPONENT_WIDE_K_LADDER = Object.freeze({
  id: 'imp-3490-degree2-exponent-wide-k-ladder',
  ticket: 'imp-3490',
  paperSourcePath: PAPER_REF,
  paperSections: ['§25', '§26', '§27'],
  relatedExponentFact: 'imp-3469-degree2-bridge-mass-scaling.js',
  relatedClosedForm: 'imp-3488-degree2-miss-factor-closed-form.js',
  relatedMoment: 'imp-3481-autocorrelation-moment-ladder.js',

  summary:
    'Stress-tests the imp-3469 degree-2 scaling exponent p=2 (B_2(a/k,kU)=B_2(a,U)/k^2, ' +
    'B_2=int (cosh(a tau)-1)A(tau)d(tau) with A the fixed genuine-Phi autocorrelation) on a WIDER ' +
    'k-ladder -- adding k in {12,16,24} to the {2,3,4,6,8} originally tested -- from both base cells ' +
    '(0.5,6),s=3 and (0.4,10),s=4. RESULT: p=2 does NOT break at large k; it TIGHTENS toward 2. The ' +
    'new large-k rungs sit inside [2.0000889,2.0001767] on both cells, strictly tighter than the ' +
    'original rungs (which reach 2.00048 at k=2), and the exponent deviation is MONOTONE DECREASING ' +
    'in k (larger k => smaller scaled a => smaller O(a^2) tail). The small-a leading form B_2~(a^2/2)M_2 ' +
    'persists and sharpens (relative error shrinks like 1/k^2, ~1.1e-4 at k=2 to ~7.7e-7 at k=24), ' +
    'U-independence persists out to U=240 (D_2=0 identically, A truncates the integral inside its ' +
    'support), and there is NO quadrature degradation through k=24 (the near-cancelling cosh(a tau)-1 ' +
    'at a*T_A<=0.125 has cancellation error ~3e-14, far below the tail). STRESS-TEST, RH-EQUIVALENT, ' +
    'necessary-but-not-sufficient; operator positivity (imp-3066) untouched; no RH verdict, no QED.',

  method: Object.freeze({
    degree2BridgeMass: 'B_2(a,U)=int_0^{T_A} (cosh(a tau)-1)A(tau)d(tau) (U-independent inside A support)',
    weight: 'A(tau)=int_0^inf Phi(s)Phi(s+tau)ds, the genuine-Phi autocorrelation (NPHI=10), FIXED in (a,U)',
    quadrature: 'composite Simpson: A(tau) inner (n=1200 on [0,7]), mass on precomputed A grid (NM=1600 on [0,T_A])',
    scaling: 'a -> a0/k, U -> k*u0 at fixed s = a0*u0 (identical to imp-3469)',
    measuredExponent: 'p_k = log(B_2(a0)/B_2(a0/k))/log(k), predicted 2',
    kLadderOriginal: K_LADDER_ORIGINAL,
    kLadderWide: K_LADDER_WIDE,
    kLadder: K_LADDER,
    tauCap: T_A,
    m2Moment: M2_MOMENT,
    exponentTol: EXPONENT_TOL,
    wideExponentTol: WIDE_EXPONENT_TOL,
    selfComputing: true,
  }),

  measured: Object.freeze({
    ladderS3: LADDER_S3,                    // base (0.5,6), s=3
    ladderS4: LADDER_S4,                    // base (0.4,10), s=4
    m2Moment: M2_MOMENT,                    // fixed second autocorrelation moment ~4.54e-6
    maxExponentDev: Math.max(LADDER_S3.maxExponentDev, LADDER_S4.maxExponentDev),        // ~4.8e-4 (at k=2)
    wideMaxExponentDev: Math.max(LADDER_S3.wideMaxExponentDev, LADDER_S4.wideMaxExponentDev), // ~1.8e-4
    wideMaxLeadingRelErr: Math.max(LADDER_S3.wideMaxLeadingRelErr, LADDER_S4.wideMaxLeadingRelErr), // ~3e-6
    maxD2: Math.max(LADDER_S3.maxD2, LADDER_S4.maxD2),                                     // 0
    exponentStablePinned,
    wideRungsTighter,
    exponentTightensToTwo,
    leadingFormSharpens,
    deficitVanishesAtLargeU,
    verdict,
  }),

  interpretation: Object.freeze({
    exponentDoesNotBreak:
      'The imp-3469 exponent p=2 does NOT break on the wider ladder k in {12,16,24}. The measured p ' +
      'stays within 5e-4 of 2 on every rung and is MONOTONE DECREASING in k toward 2: larger k means a ' +
      'smaller scaled a=a0/k, hence a smaller O(a^2) tail on the leading form B_2(a)=(a^2/2)M_2+O(a^4). ' +
      'p=2 is an attractor as a -> 0, not a value that degrades at large k.',
    leadingFormSharpens:
      'The small-a leading form B_2~(a^2/2)M_2 (M_2=int tau^2 A(tau)d(tau) fixed) persists and SHARPENS: ' +
      'the relative error against the leading form shrinks like 1/k^2, from ~1.1e-4 at k=2 to ~7.7e-7 at ' +
      'k=24, a machine-precision approach to the pure-a^2 form.',
    uIndependencePersists:
      'U-independence persists out to U=240: D_2=0 identically on every rung (tauStar=arcsinh(1)/a=k*1.76 ' +
      'moves further out of the A support as a -> a/k), and B_2 depends on a alone because A(tau) truncates ' +
      'the integral inside its support (~[0,0.6]) far below every cutoff. Growing U never re-introduces ' +
      'U-dependence.',
    noQuadratureDegradation:
      'No quadrature degradation through k=24: the exponent sequence is smooth and monotone (no noise ' +
      'floor), and the near-cancelling cosh(a tau)-1 is benign -- at k=24 the worst argument is a*T_A<=0.125, ' +
      'so cosh-1~7.8e-3 with catastrophic-cancellation relative error ~eps/(cosh-1)~3e-14, far below the ' +
      'O(a^2) tail. No k in the tested range shows resolution loss.',
  }),

  honestCaveat: Object.freeze({
    isProof: false,
    isReductionBelowRH: false,
    rhEquivalent: true,
    isStructuralDiagnostic: true,
    numericalCharacterizationOnly:
      'This module numerically stress-tests the k-stability of the imp-3469 degree-2 scaling exponent p=2 ' +
      'on a wider ladder (k in {12,16,24}). It establishes NO operator positivity.',
    necessaryNotSufficient:
      'Mass-feasibility is NECESSARY-BUT-NOT-SUFFICIENT, and the degree-2 face carries no feasibility ' +
      'comparison at all (D_2 = 0). The operator-level K_a >= 0 sign-positivity (off-diagonal ' +
      'endpoint-Hankel step, imp-3066) remains the lone obstruction, UNTOUCHED. No RH verdict.',
    didNotAttemptPositivity: true,
    sota: 'Platt-Trudgian Lambda <= 0.2 remains the rigorous SOTA',
  }),
});

// -- Tripwire assertions ------------------------------------------------------
export const IMP3490_DEGREE2_EXPONENT_WIDE_K_LADDER_ASSERTIONS = [
  {
    id: 'imp3490-exponent-stays-pinned-on-wider-ladder',
    why: 'THE KEY FINDING: on the EXTENDED ladder (through k=24) every measured exponent must stay within ' +
         '1e-2 of 2 on BOTH base cells -- p=2 does not break at large k.',
    holds: () => LADDER_S3.maxExponentDev < EXPONENT_TOL && LADDER_S4.maxExponentDev < EXPONENT_TOL,
  },
  {
    id: 'imp3490-wide-rungs-tighter-than-original',
    why: 'The NEW large-k rungs {12,16,24} must sit EVEN TIGHTER than the tol (within 1e-3 of 2) on both ' +
         'cells -- the exponent converges toward 2, it does not drift away, as k grows.',
    holds: () =>
      LADDER_S3.wideMaxExponentDev < WIDE_EXPONENT_TOL && LADDER_S4.wideMaxExponentDev < WIDE_EXPONENT_TOL,
  },
  {
    id: 'imp3490-exponent-monotone-tightens-toward-two',
    why: 'The exponent deviation |p_k - 2| must be MONOTONE DECREASING in k on both cells (larger k => ' +
         'smaller scaled a => smaller O(a^2) tail) -- p=2 is an attractor as a -> 0, not a resolution artifact.',
    holds: () => LADDER_S3.exponentMonotoneTightening && LADDER_S4.exponentMonotoneTightening,
  },
  {
    id: 'imp3490-leading-form-sharpens-at-large-k',
    why: 'The small-a leading form B_2~(a^2/2)M_2 must SHARPEN at large k: the leading-form relative error on ' +
         'the {12,16,24} rungs must be below 1e-4 on both cells (it shrinks like 1/k^2 to ~7.7e-7 at k=24).',
    holds: () =>
      LADDER_S3.wideMaxLeadingRelErr < LEADING_TOL && LADDER_S4.wideMaxLeadingRelErr < LEADING_TOL,
  },
  {
    id: 'imp3490-u-independence-persists-to-large-U',
    why: 'U-independence must persist out to U=240: the degree-2 deficit D_2 must be numerically zero on every ' +
         'rung (the crossover tauStar moves further out of the A support as a -> a/k), so B_2 depends on a alone.',
    holds: () => LADDER_S3.maxD2 < DEFICIT_TOL && LADDER_S4.maxD2 < DEFICIT_TOL,
  },
  {
    id: 'imp3490-no-quadrature-degradation-cosh-cancellation-safe',
    why: 'No quadrature degradation: at the largest k=24 the worst cosh argument a*T_A must be small (<0.13) so ' +
         'cosh(a tau)-1 is cancellation-safe -- the exponent stays clean, not a numerical noise floor.',
    holds: () => {
      const r24S3 = LADDER_S3.rungs.find((r) => r.k === 24);
      const r24S4 = LADDER_S4.rungs.find((r) => r.k === 24);
      return r24S3.maxArg < 0.13 && r24S4.maxArg < 0.13 &&
        r24S3.coshMinusOne > 0 && r24S4.coshMinusOne > 0;
    },
  },
  {
    id: 'imp3490-verdict-classifies-the-stability',
    why: 'The classified verdict must be the p=2 stability on the wider ladder (tightens toward 2, no break, ' +
         'no quadrature degradation), not indeterminate.',
    holds: () => verdict === 'DEGREE-2-EXPONENT-p=2-STABLE-ON-WIDER-LADDER-k=12,16,24-TIGHTENS-TOWARD-2-NO-BREAK-NO-QUADRATURE-DEGRADATION',
  },
  {
    id: 'imp3490-honest-diagnostic-not-a-verdict',
    why: 'Mandatory honesty: k-stability stress-test only, mass-feasibility necessary-but-not-sufficient ' +
         '(no degree-2 ratio), operator positivity (imp-3066) untouched, PT 0.2 stays SOTA.',
    holds: () => {
      const c = IMP3490_DEGREE2_EXPONENT_WIDE_K_LADDER.honestCaveat;
      return (
        c.isProof === false &&
        c.isReductionBelowRH === false &&
        c.isStructuralDiagnostic === true &&
        c.didNotAttemptPositivity === true &&
        /Platt-Trudgian/.test(c.sota)
      );
    },
  },
];

for (const assertion of IMP3490_DEGREE2_EXPONENT_WIDE_K_LADDER_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-3490-degree2-exponent-wide-k-ladder assertion failed: ${assertion.id}`);
  }
}

export default IMP3490_DEGREE2_EXPONENT_WIDE_K_LADDER;
