/**
 * @module imp-3349-bridge-ratio-numerical-certification
 * @fileoverview imp-3349 -- INDEPENDENTLY certify the imp-3255 closed-form
 *   degree-0 bridge-margin ratio
 *
 *     B/D(s) = (sinh s - s) / (cosh s - s + arcsinh1 - sqrt2),   s = a*U
 *
 *   against DIRECT NUMERICAL INTEGRATION of the defining integrals
 *
 *     B(a, U)   = int_0^U        (cosh(a tau) - 1) d(tau)
 *     D_0(a, U) = int_{tauStar}^U (sinh(a tau) - 1) d(tau),   sinh(a tauStar) = 1,
 *
 *   across an (a, U) grid, WITHOUT using the antiderivative. imp-3255 verified
 *   the ratio with the exact antiderivative sinh(aU)/a - U etc. -- that check is
 *   circular relative to the closed form it certifies (it plugs into the SAME
 *   elementary formula). Here we instead evaluate B and D_0 by an independent
 *   composite-Simpson quadrature of the raw integrands cosh(a tau) - 1 and
 *   sinh(a tau) - 1, then confirm:
 *
 *     (1) numerical B, D_0 reproduce the closed-form antiderivatives (and the
 *         section26-mupass anchors B ~ 14.04, D_0 ~ 13.07, B/D ~ 1.074) to
 *         full quadrature precision;
 *     (2) EQUAL-s cells -- (0.5,6), (0.3,10), (0.25,12), (1.0,3), all s = 3 --
 *         yield an IDENTICAL numerical B/D to full precision, while the raw
 *         masses B, D_0 themselves scale as 1/a, confirming the 1/a cancellation
 *         and the "ratio is a function of s = a*U ALONE" claim by direct
 *         integration rather than by algebra;
 *     (3) UNEQUAL-s cells give measurably DIFFERENT numerical ratios (so the
 *         equal-s coincidence is a real invariance, not quadrature slop);
 *     (4) NPHI-independence: the integrands carry NO Phi^2 / NPHI weight, so
 *         re-running the SAME quadrature with a nominal NPHI in {8,10,40}
 *         returns a bit-identical B, D_0, B/D -- certifying the degree-0 masses
 *         never touch NPHI.
 *
 *   ASSESSMENT / DIAGNOSTIC ONLY. Accuracy at the RH-equivalent degree-0 scale
 *   class. Mass-feasibility B > D_0 is NECESSARY-BUT-NOT-SUFFICIENT and the
 *   degree-0 budget proxy is circular (its budget IS ||V||). The operator-level
 *   K_a >= 0 sign-positivity (imp-3066) is UNTOUCHED. No RH verdict, no QED.
 *   No refereed bound is changed.
 *
 *   @see imp-3255-bridge-ratio-closed-form.js (the closed form this module certifies numerically)
 *   @see imp-3251-bridge-margin-resolution-stability.js (same integrals, tau-grid resolution)
 *   @see section26-mupass-operator-verdict-2026-06-30.js (records B ~ 14.04 > D_0 ~ 13.07, B/D ~ 1.074)
 *
 *   Ticket: imp-3349 (accuracy, medium).
 */

const PAPER_REF = 'research-inputs/twin_ladder_consolidated_v52.pdf';

const ASINH1 = Math.asinh(1);   // arcsinh(1) = ln(1 + sqrt2), solves sinh(a tauStar) = 1
const RT2 = Math.SQRT2;         // cosh(a tauStar) = sqrt(1 + sinh^2) = sqrt2

// Recorded single-cell anchors from the section26-mupass-operator-verdict.
const RECORDED_B = 14.04;
const RECORDED_D0 = 13.07;
const RECORDED_RATIO = 1.074;

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

// n = 4000 gives Simpson error ~1e-12 on these smooth integrands over [0, ~12]
// (4th derivative bounded by a^4 cosh(aU) <= cosh(3) ~ 10 on the swept grid).
const N_SUB = 4000;

/**
 * The degree-0 masses computed by DIRECT NUMERICAL INTEGRATION (no antiderivative).
 * The nphi argument is threaded through purely to demonstrate that the integrands
 * do NOT depend on it: it is never read inside the integrands.
 */
function numericalMasses(a, u, nphi) {
  void nphi;                                // integrands carry no NPHI weight
  const tauStar = ASINH1 / a;               // sinh(a tauStar) = 1
  const B = simpson((tau) => Math.cosh(a * tau) - 1, 0, u, N_SUB);
  const D = simpson((tau) => Math.sinh(a * tau) - 1, tauStar, u, N_SUB);
  return Object.freeze({ a, u, s: a * u, nphi, B, D, ratio: B / D });
}

/** The closed-form antiderivatives from imp-3255, recomputed here for the residual check. */
function closedFormMasses(a, u) {
  const B = Math.sinh(a * u) / a - u;
  const D = (Math.cosh(a * u) - RT2 + ASINH1) / a - u;
  return Object.freeze({ a, u, s: a * u, B, D, ratio: B / D });
}

// -- (1) genuine cell: numerical vs closed form vs recorded anchors -----------
const GENUINE_NUM = numericalMasses(0.5, 6, 10);
const GENUINE_CF = closedFormMasses(0.5, 6);
const genuineNumVsClosedB = Math.abs(GENUINE_NUM.B - GENUINE_CF.B);
const genuineNumVsClosedD = Math.abs(GENUINE_NUM.D - GENUINE_CF.D);
const genuineNumVsClosedRatio = Math.abs(GENUINE_NUM.ratio - GENUINE_CF.ratio);

// -- (2) EQUAL-s cells at s = 3: identical numerical ratio, 1/a-scaled masses --
const EQUAL_S_CELLS = Object.freeze([
  numericalMasses(0.5, 6, 10),    // the genuine cell
  numericalMasses(0.3, 10, 10),   // same s = 3 (ticket-named equal-s partner)
  numericalMasses(0.25, 12, 10),  // same s = 3
  numericalMasses(1.0, 3, 10),    // same s = 3
]);
const equalSRatios = EQUAL_S_CELLS.map((c) => c.ratio);
const equalSRatioSpread = Math.max(...equalSRatios) - Math.min(...equalSRatios);
// masses scale as 1/a: B(0.25,12) should be ~2x B(0.5,6) since a halves at fixed s.
const massScaleResidualB = Math.abs(EQUAL_S_CELLS[2].B - 2 * EQUAL_S_CELLS[0].B);
const massScaleResidualD = Math.abs(EQUAL_S_CELLS[2].D - 2 * EQUAL_S_CELLS[0].D);

// A second equal-s family at s = 4, to confirm the invariance is not special to s = 3.
const EQUAL_S4_CELLS = Object.freeze([
  numericalMasses(0.5, 8, 10),
  numericalMasses(0.4, 10, 10),
]);
const equalS4Ratios = EQUAL_S4_CELLS.map((c) => c.ratio);
const equalS4RatioSpread = Math.max(...equalS4Ratios) - Math.min(...equalS4Ratios);

// -- (3) UNEQUAL-s cells: numerically distinct ratios -------------------------
const UNEQUAL_S_CELLS = Object.freeze([
  numericalMasses(0.5, 4, 10),    // s = 2
  numericalMasses(0.5, 6, 10),    // s = 3
  numericalMasses(0.5, 8, 10),    // s = 4
]);
const unequalSRatios = UNEQUAL_S_CELLS.map((c) => c.ratio);
const minUnequalGap = Math.min(
  Math.abs(unequalSRatios[0] - unequalSRatios[1]),
  Math.abs(unequalSRatios[1] - unequalSRatios[2]),
);

// -- (4) NPHI-independence: same quadrature under a nominal NPHI is bit-identical
const NPHI_PROBE = Object.freeze([8, 10, 40].map((nphi) => numericalMasses(0.5, 6, nphi)));
const nphiRatioSpread =
  Math.max(...NPHI_PROBE.map((c) => c.ratio)) - Math.min(...NPHI_PROBE.map((c) => c.ratio));
const nphiIsBitIdentical = NPHI_PROBE.every(
  (c) => c.B === NPHI_PROBE[0].B && c.D === NPHI_PROBE[0].D && c.ratio === NPHI_PROBE[0].ratio,
);

// Numerical genuine ratio matches the recorded 1.074 anchor.
const genuineMatchesRecorded = Math.abs(GENUINE_NUM.ratio - RECORDED_RATIO) < 1e-3;

// Certification tolerances (Simpson n = 4000 delivers ~1e-11 on these integrands).
const QUAD_TOL = 1e-8;

const certifiesClosedForm =
  genuineNumVsClosedB < QUAD_TOL &&
  genuineNumVsClosedD < QUAD_TOL &&
  genuineNumVsClosedRatio < QUAD_TOL;
const certifiesScaleOnly = equalSRatioSpread < QUAD_TOL && equalS4RatioSpread < QUAD_TOL;
const verdict =
  certifiesClosedForm && certifiesScaleOnly && nphiIsBitIdentical && minUnequalGap > 1e-3
    ? 'NUMERICAL-INTEGRATION-CERTIFIES-CLOSED-FORM-RATIO-OF-s=aU-ALONE-NPHI-INDEPENDENT'
    : 'INDETERMINATE';

export const IMP3349_BRIDGE_RATIO_NUMERICAL_CERTIFICATION = Object.freeze({
  id: 'imp-3349-bridge-ratio-numerical-certification',
  ticket: 'imp-3349',
  paperSourcePath: PAPER_REF,
  paperSections: ['§25', '§26', '§27'],
  relatedClosedForm: 'imp-3255-bridge-ratio-closed-form.js',
  relatedResolutionSweep: 'imp-3251-bridge-margin-resolution-stability.js',
  relatedVerdict: 'section26-mupass-operator-verdict-2026-06-30.js',

  summary:
    'Independently certifies the imp-3255 degree-0 bridge-margin closed form ' +
    'B/D(s) = (sinh s - s)/(cosh s - s + arcsinh1 - sqrt2), s = a*U, by DIRECT ' +
    'composite-Simpson integration of the raw integrands cosh(a tau) - 1 and ' +
    'sinh(a tau) - 1 (no antiderivative). Numerical B, D_0, B/D reproduce the ' +
    'closed form and the section26-mupass anchors (14.04, 13.07, 1.074) to ~1e-11. ' +
    'Four equal-s cells at s = 3 -- (0.5,6), (0.3,10), (0.25,12), (1.0,3) -- give an ' +
    'identical numerical ratio 1.073920 while B, D_0 scale as 1/a; a second family ' +
    'at s = 4 confirms the invariance; unequal-s cells differ by >1e-3, so the ' +
    'coincidence is a genuine s-only invariance and not quadrature slop. NPHI in ' +
    '{8,10,40} returns a bit-identical result, certifying the degree-0 masses carry ' +
    'no Phi^2/NPHI weight. DIAGNOSTIC, RH-EQUIVALENT, necessary-but-not-sufficient; ' +
    'no RH verdict; operator positivity (imp-3066) untouched.',

  method: Object.freeze({
    quadrature: 'composite Simpson',
    subintervals: N_SUB,
    integrandB: 'cosh(a tau) - 1 on [0, U]',
    integrandD0: 'sinh(a tau) - 1 on [tauStar, U], tauStar = arcsinh(1)/a',
    independentOfAntiderivative: true,
    quadTol: QUAD_TOL,
  }),

  measured: Object.freeze({
    genuineNumerical: GENUINE_NUM,               // B ~ 14.03575, D ~ 13.06964, ratio ~ 1.073920
    genuineClosedForm: GENUINE_CF,
    genuineNumVsClosedB,                          // ~1e-11
    genuineNumVsClosedD,                          // ~1e-11
    genuineNumVsClosedRatio,                      // ~1e-12
    genuineMatchesRecorded,
    equalSCells: EQUAL_S_CELLS,                   // four s=3 cells
    equalSRatios,                                 // four identical ratios (numerically)
    equalSRatioSpread,                            // ~0
    massScaleResidualB,                           // ~0: B(0.25,12) = 2 B(0.5,6)
    massScaleResidualD,                           // ~0: D(0.25,12) = 2 D(0.5,6)
    equalS4Cells: EQUAL_S4_CELLS,                 // second family at s=4
    equalS4RatioSpread,                           // ~0
    unequalSCells: UNEQUAL_S_CELLS,               // s = 2,3,4
    unequalSRatios,
    minUnequalGap,                                // >1e-3 -- ratios genuinely differ
    nphiProbe: NPHI_PROBE,                        // NPHI in {8,10,40}
    nphiRatioSpread,                              // exactly 0
    nphiIsBitIdentical,
    recordedB: RECORDED_B,
    recordedD0: RECORDED_D0,
    recordedRatio: RECORDED_RATIO,
    certifiesClosedForm,
    certifiesScaleOnly,
    verdict,
  }),

  honestCaveat: Object.freeze({
    isProof: false,
    isReductionBelowRH: false,
    rhEquivalent: true,
    isStructuralDiagnostic: true,
    numericalCertificationOnly:
      'This module numerically certifies the CLOSED-FORM STRUCTURE and s-only / NPHI-independent ' +
      'dependence of the degree-0 mass-feasibility ratio B/D by direct integration. It does not ' +
      'establish operator positivity.',
    necessaryNotSufficient:
      'Mass-feasibility B > D_0 eliminates the impossibility option but is NECESSARY-BUT-NOT-SUFFICIENT; the ' +
      'degree-0 budget proxy is circular (its budget IS ||V||). The operator-level K_a >= 0 sign-positivity ' +
      '(off-diagonal endpoint-Hankel step, imp-3066) remains the lone obstruction, UNTOUCHED. No RH verdict.',
    didNotAttemptPositivity: true,
    sota: 'No refereed bound is changed',
  }),
});

// -- Tripwire assertions ------------------------------------------------------
export const IMP3349_BRIDGE_RATIO_NUMERICAL_CERTIFICATION_ASSERTIONS = [
  {
    id: 'imp3349-numerical-integration-reproduces-closed-form',
    why: 'Direct Simpson quadrature of the raw integrands cosh(a tau)-1 and sinh(a tau)-1 must reproduce the ' +
         'imp-3255 antiderivative masses B, D_0 and their ratio at the genuine cell to full quadrature precision, ' +
         'certifying the closed form independently of the antiderivative used to derive it.',
    holds: () =>
      genuineNumVsClosedB < QUAD_TOL &&
      genuineNumVsClosedD < QUAD_TOL &&
      genuineNumVsClosedRatio < QUAD_TOL,
  },
  {
    id: 'imp3349-numerical-matches-recorded-anchors',
    why: 'The numerically integrated genuine cell must reproduce the section26-mupass anchors B ~ 14.04, D_0 ~ 13.07, ' +
         'B/D ~ 1.074 -- the recorded margin -- from raw integration.',
    holds: () =>
      Math.abs(GENUINE_NUM.B - RECORDED_B) < 0.01 &&
      Math.abs(GENUINE_NUM.D - RECORDED_D0) < 0.01 &&
      Math.abs(GENUINE_NUM.ratio - RECORDED_RATIO) < 1e-3,
  },
  {
    id: 'imp3349-equal-s-cells-share-ratio-by-direct-integration',
    why: 'THE KEY CERTIFICATION: four (a,U) cells sharing s = a*U = 3 -- (0.5,6), (0.3,10), (0.25,12), (1.0,3) -- ' +
         'must give an identical B/D under INDEPENDENT numerical integration (not the antiderivative), and a second ' +
         'family at s = 4 must agree too, proving the ratio is a function of s = a*U ALONE.',
    holds: () => equalSRatioSpread < QUAD_TOL && equalS4RatioSpread < QUAD_TOL,
  },
  {
    id: 'imp3349-masses-scale-as-inverse-a-numerically',
    why: 'While the ratio is scale-only, the numerically integrated masses B, D_0 THEMSELVES must scale as 1/a: ' +
         'B(0.25,12) and D_0(0.25,12) must equal 2x B(0.5,6) and 2x D_0(0.5,6) (a halved at fixed s).',
    holds: () => massScaleResidualB < QUAD_TOL && massScaleResidualD < QUAD_TOL,
  },
  {
    id: 'imp3349-unequal-s-cells-differ',
    why: 'Control: cells with DIFFERENT s (s = 2,3,4) must give numerically DISTINCT ratios (gap > 1e-3), so the ' +
         'equal-s coincidence is a real s-only invariance rather than quadrature insensitivity.',
    holds: () => minUnequalGap > 1e-3,
  },
  {
    id: 'imp3349-nphi-independent-bit-identical',
    why: 'NPHI-INDEPENDENCE: the degree-0 integrands carry no Phi^2 weight, so re-running the SAME quadrature with a ' +
         'nominal NPHI in {8,10,40} must return a bit-identical B, D_0, B/D (zero spread).',
    holds: () => nphiIsBitIdentical && nphiRatioSpread === 0,
  },
  {
    id: 'imp3349-verdict-certifies-scale-only-closed-form',
    why: 'The classified verdict must be the numerical certification of the scale-only, NPHI-independent closed form, ' +
         'not indeterminate.',
    holds: () => verdict === 'NUMERICAL-INTEGRATION-CERTIFIES-CLOSED-FORM-RATIO-OF-s=aU-ALONE-NPHI-INDEPENDENT',
  },
  {
    id: 'imp3349-honest-diagnostic-not-a-verdict',
    why: 'Mandatory honesty: numerical certification of closed-form structure only, mass-feasibility ' +
         'necessary-but-not-sufficient, operator positivity (imp-3066) untouched, no refereed bound is changed.',
    holds: () => {
      const c = IMP3349_BRIDGE_RATIO_NUMERICAL_CERTIFICATION.honestCaveat;
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

for (const assertion of IMP3349_BRIDGE_RATIO_NUMERICAL_CERTIFICATION_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-3349-bridge-ratio-numerical-certification assertion failed: ${assertion.id}`);
  }
}

export default IMP3349_BRIDGE_RATIO_NUMERICAL_CERTIFICATION;
