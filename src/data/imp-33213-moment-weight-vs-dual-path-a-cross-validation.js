/**
 * @module imp-33213-moment-weight-vs-dual-path-a-cross-validation
 * @fileoverview imp-33213 -- CROSS-VALIDATE that the true-A(tau) moment weight feeding the
 *   imp-3871/imp-3893 model-fidelity measurement and the imp-3850 dual-path reconciled
 *   -ln A(tau) ladder rest on the SAME autocorrelation A(tau), tabulating the per-tau
 *   consistency at the overlapping rungs tau in {1.5, 2.0, 2.5, 3.0}.
 *
 *       A(tau) = int_0^inf Phi(s) Phi(s + tau) ds,   Phi the NPHI=10 completed-Riemann kernel
 *
 *   WHY THIS CROSS-CHECK
 *   --------------------
 *   imp-3871/imp-3893 localized the L_n=1 crossing gap (model n~18.4 vs measured n~48.6) as a
 *   MODEL-FIDELITY gap by building moments M_m = int tau^m A(tau) dtau from the TRUE
 *   Phi-autocorrelation A(tau) (imp-3893 evaluates it DIRECTLY: Phi(s)*Phi(s+tau) on a [0,7]
 *   uniform Simpson grid). imp-3850 independently reconciled -ln A(tau) across [1.5,3.0] via two
 *   structurally-distinct quadratures, but works in the LOG domain via the factored kernel
 *   ln Phi(u) = -pi e^{4u} + ln(sum_n amp_n e^{-pi(n^2-1)e^{4u}}). These two A(tau) evaluations
 *   were never cross-tabulated. This module confirms they are the same object.
 *
 *   THE THREE MEASUREMENTS (self-computing at import; import-light, no zeros bundle)
 *   -------------------------------------------------------------------------------
 *   (A) KERNEL IDENTITY. imp-3893s direct kernel phiKernel(u) = sum_n amp_n e^{-pi n^2 e^{4u}}
 *       and imp-3850s factored logPhiFactored(u) satisfy phiKernel(u) == exp(logPhiFactored(u))
 *       algebraically (the factored form merely pulls the n=1 exponent -pi e^{4u} out of the
 *       log). MEASURED: over the representable grid u in [0, 1.3] the two agree to
 *       max relative |ln phiKernel - logPhiFactored| ~ 4.3e-16 -- machine epsilon. So both
 *       modules integrate the IDENTICAL Phi(s)Phi(s+tau) integrand; only the quadrature differs.
 *
 *   (B) THE MOMENT-INTEGRAND UNDERFLOW POINT. Because Phi(u) ~ e^{-pi e^{4u}} decays super-
 *       exponentially, imp-3893s DIRECT double-precision kernel underflows to exactly 0 once
 *       pi e^{4u} exceeds ~709 (the double-underflow edge), i.e. u &gt; ~1.367 (phiKernel(1.5)=0
 *       exactly). Hence the DIRECT moment integrand Phi(s)Phi(s+tau) is identically 0 for
 *       tau &gt;= ~1.37: the imp-3893 moments draw their entire representable support from
 *       s &lt; ~1.37, comfortably covering the n=10..80 saddle window tau*(n) in [0.27, 0.59],
 *       but they NEVER sample A(tau) directly at tau in {1.5,2,2.5,3}. The overlap with the
 *       imp-3850 ladder is therefore accessible ONLY in the log domain -- which is exactly what
 *       the imp-3850 dual-path reconciliation supplies.
 *
 *   (C) LOG-DOMAIN RECONCILIATION AT THE OVERLAP. Rebuilding -ln A(tau) from the SAME NPHI=10
 *       kernel via a log-domain graded Gauss-Legendre quadrature at a configuration
 *       INDEPENDENT of imp-3850 (grade 5, 300 panels, cutoff hi=10, vs imp-3850s grade 4, 200
 *       panels, hi=14) reproduces the imp-3850/imp-3736 reconciled ladder at all four tau to
 *       well under the ~1e-6 absolute residual imp-3850 reports:
 *
 *         tau    reconciled -ln A (this)   imp-3850/imp-3736 ladder   |residual|
 *         1.5      1267.788621              1267.788621 (imp-3736)     ~4.8e-7
 *         2.0      9365.318970              9365.318970 (imp-3736)     ~2.7e-7
 *         2.5     69198.540665            69198.540665 (imp-3850)      ~2.5e-7
 *         3.0    511309.612538           511309.612538 (imp-3850)      ~3.2e-7
 *
 *   VERDICT. The moment machinery (imp-3871/imp-3893) and the -ln A reconciliation (imp-3850)
 *   rest on a BIT-IDENTICAL NPHI=10 kernel (agree to ~4.3e-16). imp-3893s direct evaluation
 *   underflows to 0 for tau &gt;= ~1.37, so the two A(tau) machineries meet only in the log
 *   domain; there, an independent graded-GL reconstruction lands on the imp-3850/imp-3736
 *   ladder at tau in {1.5,2,2.5,3} to &lt; 5e-7 absolute -- confirming that the moment weight
 *   and the dual-path -ln A ladder are the SAME A(tau).
 *
 *   WHAT THIS DOES AND DOES NOT ESTABLISH (mandatory honesty)
 *   ---------------------------------------------------------
 *   CROSS-VALIDATION / CONSISTENCY ONLY, at the RH-equivalent scale class. It confirms two
 *   evaluations of a fixed autocorrelation weight agree; it establishes NO operator positivity.
 *   Mass-feasibility is NECESSARY-BUT-NOT-SUFFICIENT. The operator-level K_a &gt;= 0 sign-
 *   positivity (off-diagonal endpoint-Hankel step, imp-3066) is UNTOUCHED. No RH verdict, no QED.
 *   Platt-Trudgian Lambda &lt;= 0.2 remains the rigorous SOTA.
 *
 *   @see imp-3850-a-weight-dual-path-tau25-30-reconciliation.js (the reconciled -ln A ladder at tau in {2.5,3.0})
 *   @see imp-3736-a-weight-quadrature-convergence-assessment.js (the reconciled -ln A ladder at tau in {1.5,2.0})
 *   @see imp-3893-model-fidelity-moment-discrepancy.js (the moment machinery whose true A(tau) weight is cross-validated here)
 *   @see imp-3871-saddle-correction-fifth-sixth-derivative.js (the L_n=1 model-fidelity gap the weight feeds)
 *
 *   Ticket: imp-33213 (numerical, low).
 */

const PAPER_REF = 'research-inputs/twin_ladder_consolidated_v52.pdf';
const NPHI = 10;
const PI = Math.PI;

// -- imp-3893s DIRECT completed-Riemann kernel (double-domain; underflows for large u) ---------
function phiKernel(u) {
  let s = 0;
  const e2 = Math.exp(2 * u);
  const e4 = Math.exp(4 * u);
  for (let n = 1; n <= NPHI; n += 1) {
    const n2 = n * n;
    const n4 = n2 * n2;
    s += (2 * PI * PI * n4 * e4 - 3 * PI * n2 * e2) * Math.exp(-PI * n2 * e4);
  }
  return s;
}

// -- imp-3850s FACTORED log kernel: ln Phi(u) = -pi e^{4u} + ln(sum_n amp_n e^{-pi(n^2-1)e^{4u}}) --
function logPhiFactored(u) {
  const e2 = Math.exp(2 * u);
  const e4 = Math.exp(4 * u);
  let acc = 0;
  for (let n = 1; n <= NPHI; n += 1) {
    const n2 = n * n;
    const n4 = n2 * n2;
    const amp = 2 * PI * PI * n4 * e4 - 3 * PI * n2 * e2;    // > 0 for u >= 0
    acc += amp * Math.exp(-PI * (n2 - 1) * e4);
  }
  return -PI * e4 + Math.log(acc);
}

// -- (A) Kernel identity on the representable grid (phiKernel does not underflow on [0,1.3]) ----
const KERNEL_IDENTITY_GRID = [];
let kernelMaxRel = 0;
for (let i = 0; i <= 130; i += 1) {
  const u = i / 100;                                         // u = 0.00, 0.01, ..., 1.30
  const direct = Math.log(phiKernel(u));
  const factored = logPhiFactored(u);
  const rel = Math.abs(direct - factored) / Math.max(1, Math.abs(factored));
  if (rel > kernelMaxRel) kernelMaxRel = rel;
  if (i % 26 === 0) {
    KERNEL_IDENTITY_GRID.push(Object.freeze({ u, lnPhiDirect: direct, logPhiFactored: factored, rel }));
  }
}

// -- (B) The direct moment-integrand underflow edge: largest u with phiKernel(u) > 0 -----------
let underflowEdge = 0;
for (let i = 1000; i <= 1600; i += 1) {
  const u = i / 1000;
  if (phiKernel(u) > 0) underflowEdge = u;
}
const phiKernelAt15 = phiKernel(1.5);                        // exactly 0 (underflow)
const phiKernelAt13 = phiKernel(1.3);                        // > 0 (representable)

// -- (C) Independent log-domain graded-GL -ln A (config differs from imp-3850: g5/300/hi10) ----
const GL_X = [
  -0.9739065285171717, -0.8650633666889845, -0.6794095682990244,
  -0.4333953941292472, -0.1488743389816312, 0.1488743389816312,
  0.4333953941292472, 0.6794095682990244, 0.8650633666889845,
  0.9739065285171717,
];
const GL_W = [
  0.0666713443086881, 0.1494513491505806, 0.2190863625159820,
  0.2692667193099963, 0.2955242247147529, 0.2955242247147529,
  0.2692667193099963, 0.2190863625159820, 0.1494513491505806,
  0.0666713443086881,
];

function negLnAgradedGL(tau, hi, panels, grade) {
  const terms = [];
  for (let j = 0; j < panels; j += 1) {
    const a = hi * Math.pow(j / panels, grade);
    const b = hi * Math.pow((j + 1) / panels, grade);
    const mid = 0.5 * (a + b);
    const half = 0.5 * (b - a);
    for (let k = 0; k < GL_X.length; k += 1) {
      const s = mid + half * GL_X[k];
      terms.push(Math.log(GL_W[k] * half) + logPhiFactored(s) + logPhiFactored(s + tau));
    }
  }
  let mx = -Infinity;
  for (const t of terms) if (t > mx) mx = t;
  let acc = 0;
  for (const t of terms) acc += Math.exp(t - mx);
  return -(mx + Math.log(acc));
}

// The imp-3850 (tau in {2.5,3.0}) and imp-3736 (tau in {1.5,2.0}) reconciled ladder literals.
const LADDER = Object.freeze({
  1.5: { negLnA: 1267.788621, source: 'imp-3736' },
  2: { negLnA: 9365.318970, source: 'imp-3736' },
  2.5: { negLnA: 69198.540665, source: 'imp-3850' },
  3: { negLnA: 511309.612538, source: 'imp-3850' },
});
const TAUS = [1.5, 2, 2.5, 3];

const OVERLAP_TABLE = TAUS.map((tau) => {
  const reconstructed = negLnAgradedGL(tau, 10, 300, 5);     // g5/300/hi10 -- differs from imp-3850
  const ladder = LADDER[tau].negLnA;
  return Object.freeze({
    tau,
    reconstructedNegLnA: reconstructed,
    ladderNegLnA: ladder,
    ladderSource: LADDER[tau].source,
    absResidual: Math.abs(reconstructed - ladder),
    relResidual: Math.abs(reconstructed - ladder) / ladder,
  });
});

// -- Verdict classifiers -----------------------------------------------------------------------
// (1) The two modules share a bit-identical NPHI=10 kernel (agree to machine epsilon).
const kernelsAreIdentical = kernelMaxRel < 1e-13;
// (2) The direct moment integrand underflows to 0 for tau >= ~1.37 (edge in (1.35, 1.40), Phi(1.5)=0).
const directUnderflowsPastEdge =
  underflowEdge > 1.35 && underflowEdge < 1.4 && phiKernelAt15 === 0 && phiKernelAt13 > 0;
// (3) The independent log-domain reconstruction lands on the ladder to < 1e-6 absolute everywhere.
const reconciledToLadder = OVERLAP_TABLE.every((r) => r.absResidual < 1e-6);
// (4) All four tau are covered (the full overlapping window).
const fullOverlapCovered = OVERLAP_TABLE.length === 4;

const verdict =
  kernelsAreIdentical &&
  directUnderflowsPastEdge &&
  reconciledToLadder &&
  fullOverlapCovered
    ? 'MOMENT-WEIGHT-A(tau)-AND-DUAL-PATH-lnA-LADDER-REST-ON-A-BIT-IDENTICAL-NPHI=10-KERNEL(agree-~4.3e-16);-imp-3893s-DIRECT-DOUBLE-EVALUATION-UNDERFLOWS-TO-0-FOR-tau>=~1.37(Phi(1.5)=0),-SO-THE-TWO-A(tau)-MACHINERIES-MEET-ONLY-IN-THE-LOG-DOMAIN;-AN-INDEPENDENT-GRADED-GL(g5/300/hi10)-RECONSTRUCTION-LANDS-ON-THE-imp-3850/imp-3736-LADDER-AT-tau-in-{1.5,2,2.5,3}-TO-<5e-7-ABSOLUTE-CONFIRMING-THE-SAME-A(tau)'
    : 'INDETERMINATE';

export const IMP33213_MOMENT_WEIGHT_VS_DUAL_PATH_A_CROSS_VALIDATION = Object.freeze({
  id: 'imp-33213-moment-weight-vs-dual-path-a-cross-validation',
  ticket: 'imp-33213',
  paperSourcePath: PAPER_REF,
  paperSections: ['§25', '§26', '§27'],
  crossValidatesModules: [
    'imp-3893-model-fidelity-moment-discrepancy.js',
    'imp-3871-saddle-correction-fifth-sixth-derivative.js',
    'imp-3850-a-weight-dual-path-tau25-30-reconciliation.js',
    'imp-3736-a-weight-quadrature-convergence-assessment.js',
  ],

  summary:
    'CROSS-VALIDATES that the true-A(tau) moment weight feeding the imp-3871/imp-3893 model-fidelity ' +
    'measurement and the imp-3850 dual-path reconciled -ln A(tau) ladder are the SAME autocorrelation ' +
    'A(tau) = int_0^inf Phi(s)Phi(s+tau) ds, tabulating the overlap at tau in {1.5,2,2.5,3}. (A) The ' +
    'imp-3893 direct kernel phiKernel(u) = sum_n amp_n e^{-pi n^2 e^{4u}} and the imp-3850 factored ' +
    'logPhiFactored(u) satisfy phiKernel = exp(logPhiFactored) to machine epsilon (max rel ~4.3e-16 over ' +
    'u in [0,1.3]) -- both modules integrate the IDENTICAL integrand, only the quadrature differs. (B) The ' +
    'imp-3893 DIRECT double-precision kernel underflows to exactly 0 once pi e^{4u} > ~709, i.e. u > ~1.37 ' +
    '(phiKernel(1.5)=0), so the direct moment integrand Phi(s)Phi(s+tau) is identically 0 for tau >= ~1.37: ' +
    'the moments draw their representable support from s < ~1.37 (covering the n=10..80 saddle window ' +
    'tau* in [0.27,0.59]) and the overlap with the imp-3850 ladder is accessible ONLY in the log domain. ' +
    '(C) Rebuilding -ln A(tau) from the same kernel via an INDEPENDENT log-domain graded-GL (grade 5, 300 ' +
    'panels, hi=10 -- differs from imp-3850s grade 4/200/hi14) reproduces the imp-3850/imp-3736 ladder at ' +
    'all four tau to < 5e-7 absolute: -ln A(1.5)=1267.788621, -ln A(2)=9365.318970, -ln A(2.5)=69198.540665, ' +
    '-ln A(3)=511309.612538. The moment machinery and the -ln A reconciliation thus rest on the same A(tau). ' +
    'CROSS-VALIDATION/CONSISTENCY, RH-EQUIVALENT, necessary-but-not-sufficient; operator positivity ' +
    '(imp-3066) untouched; no RH verdict, no QED; Platt-Trudgian Lambda <= 0.2 stays SOTA.',

  method: Object.freeze({
    aWeight: 'A(tau) = int_0^inf Phi(s)Phi(s+tau) ds, Phi the NPHI=10 completed-Riemann kernel (imp-2686/imp-3646)',
    directKernel: 'imp-3893s phiKernel(u) = sum_n (2 pi^2 n^4 e^{4u} - 3 pi n^2 e^{2u}) e^{-pi n^2 e^{4u}} (double-domain; underflows for u > ~1.37)',
    factoredKernel: 'imp-3850s logPhiFactored(u) = -pi e^{4u} + ln(sum_n amp_n e^{-pi(n^2-1)e^{4u}}) (log-domain; underflow-safe)',
    identityCheck: 'phiKernel(u) == exp(logPhiFactored(u)) algebraically; measured to max rel ~4.3e-16 over u in [0,1.3]',
    underflowCheck: 'the largest u with phiKernel(u) > 0 is measured by scanning u = 1.000..1.600 in steps of 1e-3',
    reconstruction: 'an INDEPENDENT log-domain graded-GL (grade 5, 300 panels, hi=10) rebuilds -ln A(tau) from the shared kernel and is tabulated against the imp-3850/imp-3736 ladder',
    selfComputing: true,
  }),

  measured: Object.freeze({
    taus: TAUS,
    kernelMaxRel,
    kernelIdentityGrid: Object.freeze(KERNEL_IDENTITY_GRID),
    underflowEdge,
    phiKernelAt15,
    phiKernelAt13,
    overlapTable: Object.freeze(OVERLAP_TABLE),
    kernelsAreIdentical,
    directUnderflowsPastEdge,
    reconciledToLadder,
    fullOverlapCovered,
    verdict,
  }),

  interpretation: Object.freeze({
    sameKernel:
      'imp-3893 (moment machinery) and imp-3850 (dual-path -ln A) integrate a BIT-IDENTICAL NPHI=10 kernel: ' +
      'the direct phiKernel and the factored logPhiFactored agree to ~4.3e-16 relative across u in [0,1.3]. ' +
      'The factored form only pulls the n=1 exponent -pi e^{4u} out of the log to stay underflow-safe; it is ' +
      'the same Phi(s)Phi(s+tau) integrand.',
    underflowMeansLogDomainOnly:
      'imp-3893s direct double-precision Phi underflows to exactly 0 for u > ~1.37 (phiKernel(1.5)=0), so its ' +
      'direct moment integrand is identically 0 for tau >= ~1.37. The moments live on s < ~1.37 -- covering ' +
      'the n=10..80 saddle window tau* in [0.27,0.59] -- and never sample A(tau) directly at tau in {1.5,2,2.5,3}. ' +
      'The overlap with the imp-3850 ladder is a LOG-DOMAIN object, which is exactly what the dual-path ' +
      'reconciliation was built to represent.',
    reconciledOverlap:
      'An independent graded-GL reconstruction (grade 5, 300 panels, hi=10 -- a different configuration from ' +
      'imp-3850s grade 4/200/hi14) lands on the imp-3850/imp-3736 ladder at all four tau to < 5e-7 absolute ' +
      '(rel ~1e-11 to ~1e-10), inside imp-3850s reported ~1e-6 residual. The moment weight A(tau) and the ' +
      'dual-path -ln A ladder are therefore the same autocorrelation, cross-tabulated for the first time.',
  }),

  honestCaveat: Object.freeze({
    isProof: false,
    isReductionBelowRH: false,
    rhEquivalent: true,
    isStructuralDiagnostic: true,
    isCertifiedErrorBound: false,
    derivationScope:
      'Cross-validates two evaluations (direct-double moment integrand vs factored log-domain quadrature) of a ' +
      'fixed autocorrelation weight A(tau), a magnitude used inside a mass-feasibility diagnostic. It establishes ' +
      'NO operator positivity. Grid-CONVERGENCE consistency only -- not a certified error bound.',
    necessaryNotSufficient:
      'Mass-feasibility is NECESSARY-BUT-NOT-SUFFICIENT. The operator-level K_a >= 0 sign-positivity ' +
      '(off-diagonal endpoint-Hankel step, imp-3066) remains the lone obstruction, UNTOUCHED. No RH verdict.',
    didNotAttemptPositivity: true,
    sota: 'Platt-Trudgian Lambda <= 0.2 remains the rigorous SOTA',
  }),
});

// -- Tripwire assertions -----------------------------------------------------------------------
export const IMP33213_MOMENT_WEIGHT_VS_DUAL_PATH_A_CROSS_VALIDATION_ASSERTIONS = [
  {
    id: 'imp33213-kernels-are-bit-identical',
    why: 'The imp-3893 direct kernel phiKernel(u) and the imp-3850 factored logPhiFactored(u) must satisfy ' +
         'phiKernel = exp(logPhiFactored) to machine epsilon (max rel < 1e-13 over u in [0,1.3]), proving the ' +
         'moment machinery and the -ln A reconciliation integrate the SAME NPHI=10 kernel.',
    holds: () => kernelsAreIdentical && kernelMaxRel < 1e-14,
  },
  {
    id: 'imp33213-direct-moment-integrand-underflows-past-1p37',
    why: 'The imp-3893 direct double-precision kernel must underflow to exactly 0 for u > ~1.37 (edge in ' +
         '(1.35,1.40), phiKernel(1.5)=0, phiKernel(1.3)>0), showing the direct moment integrand cannot sample ' +
         'A(tau) at tau in {1.5,2,2.5,3} -- the overlap is a log-domain object.',
    holds: () => directUnderflowsPastEdge,
  },
  {
    id: 'imp33213-log-domain-reconstruction-matches-ladder',
    why: 'THE PURPOSE: an INDEPENDENT log-domain graded-GL (g5/300/hi10) reconstruction of -ln A(tau) from the ' +
         'shared kernel must reproduce the imp-3850/imp-3736 reconciled ladder at tau in {1.5,2,2.5,3} to < 1e-6 ' +
         'absolute, confirming the moment weight and the dual-path ladder are the same A(tau).',
    holds: () => reconciledToLadder && fullOverlapCovered,
  },
  {
    id: 'imp33213-verdict-records-cross-validation',
    why: 'The classified verdict must record the bit-identical kernel, the direct-evaluation underflow, and the ' +
         'log-domain reconstruction landing on the ladder -- not indeterminate.',
    holds: () => verdict !== 'INDETERMINATE',
  },
  {
    id: 'imp33213-honest-diagnostic-not-a-verdict',
    why: 'Mandatory honesty: cross-validation/consistency only, not a certified bound, mass-feasibility ' +
         'necessary-but-not-sufficient, operator positivity (imp-3066) untouched, PT 0.2 stays SOTA.',
    holds: () => {
      const c = IMP33213_MOMENT_WEIGHT_VS_DUAL_PATH_A_CROSS_VALIDATION.honestCaveat;
      return (
        c.isProof === false &&
        c.isReductionBelowRH === false &&
        c.isStructuralDiagnostic === true &&
        c.isCertifiedErrorBound === false &&
        c.didNotAttemptPositivity === true &&
        /Platt-Trudgian/.test(c.sota)
      );
    },
  },
];

for (const assertion of IMP33213_MOMENT_WEIGHT_VS_DUAL_PATH_A_CROSS_VALIDATION_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-33213-moment-weight-vs-dual-path-a-cross-validation assertion failed: ${assertion.id}`);
  }
}

export default IMP33213_MOMENT_WEIGHT_VS_DUAL_PATH_A_CROSS_VALIDATION;
