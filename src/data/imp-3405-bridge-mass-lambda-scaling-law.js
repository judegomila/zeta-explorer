/**
 * @module imp-3405-bridge-mass-lambda-scaling-law
 * @fileoverview imp-3405 -- extend the imp-3349 TWO-POINT mass-scale identity
 *   B(0.25,12) = 2*B(0.5,6) (and the same for D_0) to a WHOLE ladder of scale
 *   factors k, testing for a GENERAL lambda-scaling law of the degree-0 bridge
 *   masses:
 *
 *     B(a/k, kU) = k * B(a, U),      D_0(a/k, kU) = k * D_0(a, U),    for all k > 0,
 *
 *   while s = a*U (hence the ratio B/D_0) stays fixed. imp-3349 measured only the
 *   single k = 2 instance (massScaleResidualB, massScaleResidualD ~0 between the
 *   (0.5,6) and (0.25,12) cells). Here we sweep k in {2, 3, 4, 6, 8} from the same
 *   genuine base cell (0.5, 6), s = 3, evaluate B and D_0 at each scaled cell
 *   (0.5/k, 6k) by the SAME independent composite-Simpson quadrature of the raw
 *   integrands cosh(a tau) - 1 and sinh(a tau) - 1 (no antiderivative), and report:
 *
 *     (1) the k-scaling residuals |B(a/k,kU) - k*B(a,U)| and |D_0(a/k,kU) - k*D_0(a,U)|
 *         (absolute and relative) across the whole ladder -- confirming the law is
 *         NOT special to k = 2;
 *     (2) that s = a*U (hence B/D_0) is invariant along the ladder to full precision,
 *         so the 1/a mass scaling and the s-only ratio are two faces of one law;
 *     (3) a second base cell (0.4, 10), s = 4, run through the same k-ladder, to
 *         confirm the law is not special to the s = 3 base either.
 *
 *   The law is the direct numerical face of the closed form (imp-3255): at fixed
 *   s = a*U, B(a,U) = sinh(s)/a - U = (1/a)(sinh s - s), so replacing a -> a/k and
 *   U -> kU multiplies the leading 1/a factor by k while sinh s - s is fixed, giving
 *   B -> k*B exactly (identically for D_0 with cosh s - s + arcsinh1 - sqrt2). This
 *   module certifies that algebra by direct integration across k, not just k = 2.
 *
 *   MEASUREMENT / DIAGNOSTIC ONLY. Accuracy at the RH-equivalent degree-0 scale
 *   class. Mass-feasibility B > D_0 is NECESSARY-BUT-NOT-SUFFICIENT and the
 *   degree-0 budget proxy is circular (its budget IS ||V||). The operator-level
 *   K_a >= 0 sign-positivity (imp-3066) is UNTOUCHED. No RH verdict, no QED.
 *   No refereed bound is changed.
 *
 *   @see imp-3349-bridge-ratio-numerical-certification.js (the k=2 two-point identity extended here)
 *   @see imp-3255-bridge-ratio-closed-form.js (the closed form whose 1/a factor gives the k-law)
 *
 *   Ticket: imp-3405 (numerical, medium).
 */

const PAPER_REF = 'research-inputs/twin_ladder_consolidated_v52.pdf';

const ASINH1 = Math.asinh(1);   // arcsinh(1) = ln(1 + sqrt2), solves sinh(a tauStar) = 1
const RT2 = Math.SQRT2;         // cosh(a tauStar) = sqrt(1 + sinh^2) = sqrt2

/**
 * Composite Simpson quadrature of f on [lo, hi] with n subintervals (n even).
 * Fully independent of the antiderivative -- evaluates only the raw integrand.
 */
function simpson(f, lo, hi, n) {
  const m = n % 2 === 0 ? n : n + 1;       // Simpson needs an even count
  const h = (hi - lo) / m;
  let sum = f(lo) + f(hi);
  for (let i = 1; i < m; i += 1) {
    sum += (i % 2 === 0 ? 2 : 4) * f(lo + i * h);
  }
  return (sum * h) / 3;
}

// n = 6000 keeps the Simpson error ~1e-11 even on the widest scaled cell
// (U = 48 at k = 8), where the step h = U/n stays comfortably small.
const N_SUB = 6000;

/** Degree-0 masses by DIRECT NUMERICAL INTEGRATION (no antiderivative). */
function numericalMasses(a, u) {
  const tauStar = ASINH1 / a;               // sinh(a tauStar) = 1
  const B = simpson((tau) => Math.cosh(a * tau) - 1, 0, u, N_SUB);
  const D = simpson((tau) => Math.sinh(a * tau) - 1, tauStar, u, N_SUB);
  return Object.freeze({ a, u, s: a * u, B, D, ratio: B / D });
}

/**
 * Sweep k over a ladder from a base cell (a0, u0), scaling a -> a0/k, U -> k*u0.
 * At each k the scaled masses are compared to k * (base masses) -- the predicted
 * general lambda-scaling law B(a/k, kU) = k*B(a,U), D_0(a/k, kU) = k*D_0(a,U).
 */
function scaleLadder(a0, u0, kValues) {
  const base = numericalMasses(a0, u0);
  const rungs = kValues.map((k) => {
    const scaled = numericalMasses(a0 / k, u0 * k);
    const predB = k * base.B;
    const predD = k * base.D;
    return Object.freeze({
      k,
      a: a0 / k,
      u: u0 * k,
      s: scaled.s,
      B: scaled.B,
      D: scaled.D,
      ratio: scaled.ratio,
      residB: Math.abs(scaled.B - predB),
      residD: Math.abs(scaled.D - predD),
      relResidB: Math.abs(scaled.B - predB) / predB,
      relResidD: Math.abs(scaled.D - predD) / predD,
      sResid: Math.abs(scaled.s - base.s),          // s = a*U must stay fixed
      ratioResid: Math.abs(scaled.ratio - base.ratio),
    });
  });
  const maxRelResidB = Math.max(...rungs.map((r) => r.relResidB));
  const maxRelResidD = Math.max(...rungs.map((r) => r.relResidD));
  const maxSResid = Math.max(...rungs.map((r) => r.sResid));
  const maxRatioResid = Math.max(...rungs.map((r) => r.ratioResid));
  return Object.freeze({
    base,
    rungs,
    maxRelResidB,
    maxRelResidD,
    maxSResid,
    maxRatioResid,
  });
}

// -- (1) primary ladder: base (0.5, 6), s = 3, k in {2,3,4,6,8} ---------------
// k = 2 is exactly the imp-3349 two-point (0.5,6)->(0.25,12) identity; k = 4 is
// the ticket-suggested (0.125,24) third cell; k in {3,6,8} extend the ladder.
const K_LADDER = Object.freeze([2, 3, 4, 6, 8]);
const LADDER_S3 = scaleLadder(0.5, 6, K_LADDER);

// -- (3) second base: (0.4, 10), s = 4 -- law is not special to s = 3 ---------
const LADDER_S4 = scaleLadder(0.4, 10, K_LADDER);

// Cross-check the recovered k=2 residual against the imp-3349 anchor: the k=2
// rung of the s=3 ladder is exactly imp-3349 massScaleResidualB/massScaleResidualD.
const k2Rung = LADDER_S3.rungs.find((r) => r.k === 2);

// Certification tolerance -- Simpson n = 6000 delivers ~1e-10 relative on these
// smooth integrands across the full k-ladder.
const SCALE_TOL = 1e-8;

const scalingLawHolds =
  LADDER_S3.maxRelResidB < SCALE_TOL &&
  LADDER_S3.maxRelResidD < SCALE_TOL &&
  LADDER_S4.maxRelResidB < SCALE_TOL &&
  LADDER_S4.maxRelResidD < SCALE_TOL;
const sInvariant =
  LADDER_S3.maxSResid < SCALE_TOL &&
  LADDER_S3.maxRatioResid < SCALE_TOL &&
  LADDER_S4.maxSResid < SCALE_TOL &&
  LADDER_S4.maxRatioResid < SCALE_TOL;

const verdict =
  scalingLawHolds && sInvariant
    ? 'GENERAL-LAMBDA-SCALING-LAW-B(a/k,kU)=k*B(a,U)-CERTIFIED-ACROSS-k-LADDER-BY-DIRECT-INTEGRATION'
    : 'INDETERMINATE';

export const IMP3405_BRIDGE_MASS_LAMBDA_SCALING_LAW = Object.freeze({
  id: 'imp-3405-bridge-mass-lambda-scaling-law',
  ticket: 'imp-3405',
  paperSourcePath: PAPER_REF,
  paperSections: ['§25', '§26', '§27'],
  relatedTwoPoint: 'imp-3349-bridge-ratio-numerical-certification.js',
  relatedClosedForm: 'imp-3255-bridge-ratio-closed-form.js',

  summary:
    'Extends the imp-3349 TWO-POINT mass-scale identity B(0.25,12) = 2*B(0.5,6) ' +
    '(the k = 2 case) to a full ladder k in {2,3,4,6,8}, certifying the GENERAL ' +
    'lambda-scaling law B(a/k, kU) = k*B(a,U) and D_0(a/k, kU) = k*D_0(a,U) by ' +
    'direct composite-Simpson integration of the raw integrands cosh(a tau)-1 and ' +
    'sinh(a tau)-1 (no antiderivative). From base (0.5,6), s = 3, every rung matches ' +
    'k*(base mass) to ~1e-10 relative while s = a*U and the ratio B/D_0 stay fixed; ' +
    'a second base (0.4,10), s = 4, confirms the law is not special to s = 3. The ' +
    'law is the numerical face of the closed-form 1/a prefactor: B = (sinh s - s)/a, ' +
    'so a -> a/k at fixed s = a*U multiplies B by k exactly. DIAGNOSTIC, ' +
    'RH-EQUIVALENT, necessary-but-not-sufficient; no RH verdict; operator ' +
    'positivity (imp-3066) untouched.',

  method: Object.freeze({
    quadrature: 'composite Simpson',
    subintervals: N_SUB,
    integrandB: 'cosh(a tau) - 1 on [0, U]',
    integrandD0: 'sinh(a tau) - 1 on [tauStar, U], tauStar = arcsinh(1)/a',
    scaling: 'a -> a0/k, U -> k*u0 at fixed s = a0*u0',
    kLadder: K_LADDER,
    independentOfAntiderivative: true,
    scaleTol: SCALE_TOL,
  }),

  measured: Object.freeze({
    ladderS3: LADDER_S3,                    // base (0.5,6), s=3, full k-ladder
    ladderS4: LADDER_S4,                    // base (0.4,10), s=4, full k-ladder
    k2RungMatchesImp3349TwoPoint: k2Rung,   // this rung IS the imp-3349 k=2 identity
    maxRelResidB: Math.max(LADDER_S3.maxRelResidB, LADDER_S4.maxRelResidB),
    maxRelResidD: Math.max(LADDER_S3.maxRelResidD, LADDER_S4.maxRelResidD),
    scalingLawHolds,
    sInvariant,
    verdict,
  }),

  honestCaveat: Object.freeze({
    isProof: false,
    isReductionBelowRH: false,
    rhEquivalent: true,
    isStructuralDiagnostic: true,
    numericalCertificationOnly:
      'This module numerically certifies the GENERAL k-scaling law of the degree-0 bridge masses B, D_0 ' +
      'across a ladder of scale factors by direct integration, extending the imp-3349 single k = 2 point. ' +
      'It does not establish operator positivity.',
    necessaryNotSufficient:
      'Mass-feasibility B > D_0 eliminates the impossibility option but is NECESSARY-BUT-NOT-SUFFICIENT; the ' +
      'degree-0 budget proxy is circular (its budget IS ||V||). The operator-level K_a >= 0 sign-positivity ' +
      '(off-diagonal endpoint-Hankel step, imp-3066) remains the lone obstruction, UNTOUCHED. No RH verdict.',
    didNotAttemptPositivity: true,
    sota: 'No refereed bound is changed',
  }),
});

// -- Tripwire assertions ------------------------------------------------------
export const IMP3405_BRIDGE_MASS_LAMBDA_SCALING_LAW_ASSERTIONS = [
  {
    id: 'imp3405-general-k-scaling-law-holds',
    why: 'THE KEY CERTIFICATION: across the whole ladder k in {2,3,4,6,8} from base (0.5,6), the numerically ' +
         'integrated masses must satisfy B(a/k,kU) = k*B(a,U) and D_0(a/k,kU) = k*D_0(a,U) to full quadrature ' +
         'precision (max relative residual < tol), extending the imp-3349 single k = 2 identity to a general law.',
    holds: () => LADDER_S3.maxRelResidB < SCALE_TOL && LADDER_S3.maxRelResidD < SCALE_TOL,
  },
  {
    id: 'imp3405-scaling-law-not-special-to-s=3',
    why: 'A second base cell (0.4,10) at s = 4 run through the same k-ladder must obey the same lambda-scaling law, ' +
         'confirming the identity is a general property of the degree-0 masses and not special to the s = 3 base.',
    holds: () => LADDER_S4.maxRelResidB < SCALE_TOL && LADDER_S4.maxRelResidD < SCALE_TOL,
  },
  {
    id: 'imp3405-s-and-ratio-invariant-along-ladder',
    why: 'Along each scaling ladder s = a*U (hence the ratio B/D_0) must stay fixed to full precision, so the 1/a ' +
         'mass scaling and the s-only ratio invariance are two faces of the one closed-form law.',
    holds: () =>
      LADDER_S3.maxSResid < SCALE_TOL &&
      LADDER_S3.maxRatioResid < SCALE_TOL &&
      LADDER_S4.maxSResid < SCALE_TOL &&
      LADDER_S4.maxRatioResid < SCALE_TOL,
  },
  {
    id: 'imp3405-k2-rung-recovers-imp3349-two-point',
    why: 'The k = 2 rung of the s = 3 ladder is exactly the imp-3349 two-point (0.5,6)->(0.25,12) mass-scale ' +
         'identity, so its residual must vanish -- anchoring the extended ladder to the prior result.',
    holds: () => k2Rung.relResidB < SCALE_TOL && k2Rung.relResidD < SCALE_TOL,
  },
  {
    id: 'imp3405-verdict-certifies-general-law',
    why: 'The classified verdict must be the certification of the general lambda-scaling law, not indeterminate.',
    holds: () => verdict === 'GENERAL-LAMBDA-SCALING-LAW-B(a/k,kU)=k*B(a,U)-CERTIFIED-ACROSS-k-LADDER-BY-DIRECT-INTEGRATION',
  },
  {
    id: 'imp3405-honest-diagnostic-not-a-verdict',
    why: 'Mandatory honesty: numerical certification of the scaling-law structure only, mass-feasibility ' +
         'necessary-but-not-sufficient, operator positivity (imp-3066) untouched, no refereed bound is changed.',
    holds: () => {
      const c = IMP3405_BRIDGE_MASS_LAMBDA_SCALING_LAW.honestCaveat;
      return (
        c.isProof === false &&
        c.isReductionBelowRH === false &&
        c.isStructuralDiagnostic === true &&
        c.didNotAttemptPositivity === true &&
        /Platt-Trudgian|refereed bound is changed/.test(c.sota)
      );
    },
  },
];

for (const assertion of IMP3405_BRIDGE_MASS_LAMBDA_SCALING_LAW_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-3405-bridge-mass-lambda-scaling-law assertion failed: ${assertion.id}`);
  }
}

export default IMP3405_BRIDGE_MASS_LAMBDA_SCALING_LAW;
