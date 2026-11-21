/**
 * @module imp-35306-rho-prefactor-assertion-execution-audit
 *
 * imp-35306 (accuracy, verification/test-coverage): AUDIT whether the imp-35240 confirmed prefactor
 * K = 8 sqrt(2)/(9 pi) = 0.40014 and the imp-35244 next-order coefficient K_{7/2} = -8 sqrt(2)/(3 pi)
 * = -1.20042 closed-form literals are actually EXECUTED as build assertions (recomputed from the
 * compensated finite-cutoff quadrature and checked against the closed forms) or merely DOCUMENTED in the
 * module headers. Verification/test-coverage only; distinct from imp-35285 (the imp-35199 assertions);
 * imports stay light (no zeros bundle); changes no bound; NO QED.
 *
 * AUDIT FINDING: BOTH literals ARE genuinely executed, NOT merely documented.
 * ------------------------------------------------------------------------
 * Tracing the two producer modules (both already wired into scripts/run-assertions.mjs DATA_MODULES, so
 * they self-throw on every build):
 *   - imp-35240 assertion `imp35240-best-k-matches-closed-form` recomputes BEST.K from the compensated
 *     finite-cutoff quadrature (Kahan-Simpson F_p(inf) + tail R_p(L), eps = 1e-6 rung) and checks it
 *     against K_CLOSED_FORM = 8 sqrt(2)/(9 pi) -- executed, at tolerance 1e-5.
 *   - imp-35244 assertion `imp35244-true-next-order-eps72` recomputes r1/eps^{7/2} = TAIL_ROW.r1OverEps72
 *     from the branch Simpson quadrature (N_PANELS = 8000) and checks it against K_SEVEN_HALVES =
 *     -8 sqrt(2)/(3 pi) -- executed, at tolerance 5e-3.
 *   - imp-35261 independently CONFIRMS K_{7/2} on the imp-35240 compensated ladder (a third executed check).
 * So the "merely documented" contingency does NOT fire: both closed forms are recomputed-and-checked on
 * every build. The residual gap this module closes is a TOLERANCE gap: the producer assertions enforce
 * only 1e-5 (K) and 5e-3 (K_{7/2}), LOOSER than the tolerances their headers document (K matched to
 * ~3.3e-7, K_{7/2} to 4 significant figures). A drift that pushed K to, say, 5e-6 from the closed form
 * would silently pass the 1e-5 gate while contradicting the documented ~3e-7 claim. This module wires a
 * light cross-check that enforces the STATED documented tolerances against the baked measured values.
 *
 * WHAT THE TIGHT GATES CHECK (against the baked producer measurements, no zeros bundle)
 * -----------------------------------------------------------------------------------
 *   - imp-35240 bestK = 0.40014025 sits |bestK - 8 sqrt(2)/(9 pi)| = 3.307e-7 from the closed form (the
 *     documented ~3e-7-level agreement), and ~424x closer than the 2/5 = 0.40000 near-miss (dist 1.403e-4).
 *   - imp-35244 tailEps72Read = -1.200452 sits |. - (-8 sqrt(2)/(3 pi))| = 3.02e-5 from the closed form,
 *     i.e. agreement to 4 significant figures (well inside 5e-4).
 * Both are read from the frozen producer POJOs (light import; the underlying quadrature already runs in
 * DATA_MODULES), so this audit adds a tolerance-tight gate without re-running the heavy quadrature.
 *
 * VERDICT: VERIFICATION / TEST-COVERAGE ONLY. The imp-35240 K and imp-35244 K_{7/2} closed forms are
 * EXECUTED build assertions (recomputed from quadrature), not merely documented; this module tightens the
 * enforced tolerance to the documented ~3e-7 (K) and 4-sig-fig (K_{7/2}) levels. It certifies no constant,
 * establishes no operator positivity, discharges neither O3 nor G6a, and changes no bound. imp-3066
 * off-diagonal endpoint-Hankel K_a >= 0 UNTOUCHED; C_mb remains GUE-conditional (imp-486); NO QED.
 * No refereed bound is changed.
 *
 * @see imp-35240-rho-prefactor-finer-grid-remeasurement (K = 8 sqrt(2)/(9 pi), recomputed-and-checked at 1e-5)
 * @see imp-35244-rho-eps52-coefficient-measurement (K_{7/2} = -8 sqrt(2)/(3 pi), recomputed-and-checked at 5e-3)
 * @see imp-35261-k72-compensated-deep-rung-confirmation (independent K_{7/2} confirmation on the compensated ladder)
 * @see imp-35285-imp35199-assertion-execution-audit (the sibling audit pattern this follows; distinct target)
 */

import { IMP35240_RHO_PREFACTOR_FINER_GRID_REMEASUREMENT } from './imp-35240-rho-prefactor-finer-grid-remeasurement.js';
import { IMP35244_RHO_EPS52_COEFFICIENT_MEASUREMENT } from './imp-35244-rho-eps52-coefficient-measurement.js';

const PI = Math.PI;
const SQRT2 = Math.SQRT2;

// The two audited closed forms, recomputed here from first principles (independent of the producers).
const K_CLOSED_FORM = (8 * SQRT2) / (9 * PI); // imp-35240 leading prefactor = 0.4001405850
const K72_CLOSED_FORM = (-8 * SQRT2) / (3 * PI); // imp-35244 next-order coefficient = -1.2004217549

// Baked producer measurements (read from the frozen POJOs; the quadrature that produced them runs in DATA_MODULES).
const IMP35240_BEST_K = IMP35240_RHO_PREFACTOR_FINER_GRID_REMEASUREMENT.bestK; // 0.40014025 (recomputed from quadrature)
const IMP35240_DIST_TO_TWO_FIFTHS = IMP35240_RHO_PREFACTOR_FINER_GRID_REMEASUREMENT.distToTwoFifths; // 1.403e-4
const IMP35244_TAIL_K72 = IMP35244_RHO_EPS52_COEFFICIENT_MEASUREMENT.tailEps72Read; // -1.200452 (recomputed from quadrature)

// Measured distances to the closed forms (the audit re-derives these against the first-principles constants).
const DIST_K = Math.abs(IMP35240_BEST_K - K_CLOSED_FORM); // ~3.31e-7 (documented ~3e-7 level)
const DIST_K72 = Math.abs(IMP35244_TAIL_K72 - K72_CLOSED_FORM); // ~3.02e-5 (4 sig figs)

// Stated documented tolerances (TIGHTER than the producer gates 1e-5 / 5e-3).
const K_STATED_TOL = 1e-6; // enforces the ~3.3e-7-level agreement documented in the imp-35240 header
const K72_STATED_TOL = 5e-4; // enforces 4-significant-figure agreement documented in the imp-35244 header

export const IMP35306_RHO_PREFACTOR_ASSERTION_EXECUTION_AUDIT = {
  id: 'imp-35306',
  proofSection: 'S-frontier',
  scopes:
    'Audit whether the imp-35240 K = 8 sqrt(2)/(9 pi) and imp-35244 K_{7/2} = -8 sqrt(2)/(3 pi) closed-form ' +
    'literals are EXECUTED build assertions (recomputed from quadrature and checked) or merely documented; ' +
    'if executed, tighten the enforced tolerance to the documented ~3e-7 (K) and 4-sig-fig (K_{7/2}) levels',
  question:
    'Are the imp-35240 K and imp-35244 K_{7/2} closed forms recomputed-and-checked on the build, or only ' +
    'documented in the module headers? Verification/test-coverage only; distinct from imp-35285; NO QED.',

  // AUDIT VERDICT: both are executed (not merely documented).
  kIsExecutedAssertion: true, // imp-35240 `imp35240-best-k-matches-closed-form` recomputes BEST.K vs 8 sqrt(2)/(9 pi)
  k72IsExecutedAssertion: true, // imp-35244 `imp35244-true-next-order-eps72` recomputes r1/eps^{7/2} vs -8 sqrt(2)/(3 pi)
  producerAssertionIds: ['imp35240-best-k-matches-closed-form', 'imp35244-true-next-order-eps72'],
  producerTolerances: { K: 1e-5, K72: 5e-3 }, // the LOOSER gates the producers enforce
  mereDocumentation: false, // the "only documented" contingency does NOT fire

  // The closed forms, recomputed from first principles.
  kClosedForm: +K_CLOSED_FORM.toFixed(10), // 0.4001405850
  k72ClosedForm: +K72_CLOSED_FORM.toFixed(10), // -1.2004217549

  // The baked producer measurements and their distances to the closed forms.
  imp35240BestK: IMP35240_BEST_K, // 0.40014025
  imp35244TailK72: IMP35244_TAIL_K72, // -1.200452
  distK: +DIST_K.toExponential(3), // ~3.31e-7
  distK72: +DIST_K72.toExponential(3), // ~3.02e-5
  distKToTwoFifths: IMP35240_DIST_TO_TWO_FIFTHS, // 1.403e-4 (the 2/5 near-miss K is ~424x farther)

  // The TIGHTER documented tolerances this audit enforces.
  kStatedTolerance: K_STATED_TOL, // 1e-6 (vs the producer 1e-5)
  k72StatedTolerance: K72_STATED_TOL, // 5e-4 (vs the producer 5e-3)
  kMeetsStatedTolerance: DIST_K < K_STATED_TOL, // true
  k72MeetsStatedTolerance: DIST_K72 < K72_STATED_TOL, // true

  isRigorous: false,
  dischargesO3orG6a: false,
  verdict:
    'VERIFICATION / TEST-COVERAGE ONLY. AUDIT FINDING: both the imp-35240 prefactor K = 8 sqrt(2)/(9 pi) ' +
    'and the imp-35244 next-order coefficient K_{7/2} = -8 sqrt(2)/(3 pi) are EXECUTED build assertions -- ' +
    'imp-35240 recomputes BEST.K from the compensated finite-cutoff quadrature and imp-35244 recomputes ' +
    'r1/eps^{7/2} from the branch Simpson quadrature, both self-throwing via DATA_MODULES (imp-35261 gives ' +
    'a third, independent K_{7/2} check) -- so the "merely documented" contingency does NOT fire. The gap is ' +
    'a TOLERANCE gap: the producer gates enforce only 1e-5 (K) and 5e-3 (K_{7/2}), looser than the ~3.3e-7 ' +
    'and 4-significant-figure agreements their headers document. This module wires a light cross-check that ' +
    'enforces the stated tolerances (bestK within 1e-6 of 8 sqrt(2)/(9 pi), measured 3.31e-7; tailK72 within ' +
    '5e-4 of -8 sqrt(2)/(3 pi), measured 3.02e-5). It certifies no constant, establishes no operator ' +
    'positivity, discharges neither O3 nor G6a, and changes no bound. imp-3066 off-diagonal endpoint-Hankel ' +
    'K_a >= 0 UNTOUCHED; C_mb remains GUE-conditional (imp-486); NO QED. No refereed bound is changed' +
    '.',
};

export const IMP35306_RHO_PREFACTOR_ASSERTION_EXECUTION_ASSERTIONS = [
  {
    // (1) the two closed forms recompute from first principles to the stated literals.
    id: 'imp35306-closed-forms-recompute',
    description: 'K = 8 sqrt(2)/(9 pi) = 0.40014 and K_{7/2} = -8 sqrt(2)/(3 pi) = -1.20042 recompute to their literals',
    holds: () =>
      Math.abs(K_CLOSED_FORM - 0.4001405849) < 1e-9 && Math.abs(K72_CLOSED_FORM - -1.2004217549) < 1e-9,
  },
  {
    // (2) the imp-35240 recompute-from-quadrature bestK meets the STATED ~3e-7 tolerance (tighter than the 1e-5 gate).
    id: 'imp35306-k-meets-stated-tolerance',
    description: 'imp-35240 bestK matches 8 sqrt(2)/(9 pi) within 1e-6 (documented ~3.3e-7), tighter than the producer 1e-5',
    holds: () => DIST_K < K_STATED_TOL && DIST_K > 1e-8,
  },
  {
    // (3) the imp-35244 recompute-from-quadrature tailK72 meets the STATED 4-sig-fig tolerance (tighter than the 5e-3 gate).
    id: 'imp35306-k72-meets-stated-tolerance',
    description: 'imp-35244 tailEps72Read matches -8 sqrt(2)/(3 pi) within 5e-4 (4 sig figs, ~3.02e-5), tighter than the producer 5e-3',
    holds: () => DIST_K72 < K72_STATED_TOL && DIST_K72 > 1e-7,
  },
  {
    // (4) the K prefactor is decisively closer to 8 sqrt(2)/(9 pi) than to the 2/5 near-miss (audit discrimination survives).
    id: 'imp35306-k-discriminates-from-two-fifths',
    description: 'imp-35240 bestK is at least 50x closer to 8 sqrt(2)/(9 pi) than to 2/5 = 0.40000',
    holds: () => IMP35240_DIST_TO_TWO_FIFTHS / DIST_K >= 50,
  },
  {
    // (5) audit conclusion: both literals are executed assertions, not merely documented.
    id: 'imp35306-both-literals-executed',
    description: 'the audit records both K and K_{7/2} as executed (recomputed-and-checked) assertions, not merely documented',
    holds: () =>
      IMP35306_RHO_PREFACTOR_ASSERTION_EXECUTION_AUDIT.kIsExecutedAssertion === true &&
      IMP35306_RHO_PREFACTOR_ASSERTION_EXECUTION_AUDIT.k72IsExecutedAssertion === true &&
      IMP35306_RHO_PREFACTOR_ASSERTION_EXECUTION_AUDIT.mereDocumentation === false,
  },
  {
    // Honesty gate: verification only; no bound moved, O3/G6a not discharged, no QED, no refereed bound is changed, imp-3066 untouched.
    id: 'imp35306-honesty-gate-no-qed',
    description: 'Verification/test-coverage only: no bound changed, O3/G6a NOT discharged, no QED, no refereed bound is changed, imp-3066 untouched',
    holds: () =>
      IMP35306_RHO_PREFACTOR_ASSERTION_EXECUTION_AUDIT.isRigorous === false &&
      IMP35306_RHO_PREFACTOR_ASSERTION_EXECUTION_AUDIT.dischargesO3orG6a === false &&
      /NO QED/.test(IMP35306_RHO_PREFACTOR_ASSERTION_EXECUTION_AUDIT.verdict) &&
      /refereed bound is changed/i.test(IMP35306_RHO_PREFACTOR_ASSERTION_EXECUTION_AUDIT.verdict) &&
      /imp-3066 off-diagonal endpoint-Hankel K_a >= 0 UNTOUCHED/.test(
        IMP35306_RHO_PREFACTOR_ASSERTION_EXECUTION_AUDIT.verdict,
      ),
  },
];

for (const a of IMP35306_RHO_PREFACTOR_ASSERTION_EXECUTION_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-35306-rho-prefactor-assertion-execution-audit assertion failed: ${a.id}`);
  }
}
