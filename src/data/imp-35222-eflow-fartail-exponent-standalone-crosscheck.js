/**
 * @module imp-35222-eflow-fartail-exponent-standalone-crosscheck
 *
 * imp-35222 (accuracy, frontier-direction): a LIGHT STANDALONE cross-check that the
 * imp-35198 derived leading law d(log E_flow)/d(log N) = -1 + 3/log N (and the full
 * surrogate s(x) = (1 - 1/log N)(2/log T0 - 1)) reproduces the imp-35135 MEASURED
 * far-tail E_flow exponents at N = 1e6 and N = 1e16 via an INDEPENDENT code path.
 *
 * WHY A SEPARATE MODULE
 * ---------------------
 * imp-35198 derives the closed form AND checks it against the imp-35135 measured drift
 * inside the SAME module (reusing imp-35135 storage fields and its own arithmetic). This
 * module recomputes both the leading -1 + 3/log N and the full surrogate s(x) FROM FIRST
 * PRINCIPLES with fresh local functions, imports NOTHING heavy (no zeros bundle, no
 * effectiveHeightForN, no imp-35135 / imp-35198 module), and compares against the
 * imp-35135 MEASURED LITERALS baked in as plain constants. If a future edit silently
 * changes the imp-35198 internal arithmetic, this independent path still pins the numbers.
 *
 * THE INDEPENDENT RECOMPUTATION (see imp-35198 @module for the derivation)
 * -----------------------------------------------------------------------
 *     x = log N,   M = log T0 = x - log x + log(2 pi)   (RvM surrogate T0 = 2 pi N / log N)
 *     leading:  -1 + 3/x
 *     full:     s(x) = (1 - 1/x)(2/M - 1)
 *
 *   x = log N        leading -1 + 3/x      full s(x)        imp-35135 measured literal
 *   N = 1e6  (13.82)    -0.7829            -0.7852            -0.77
 *   N = 1e16 (36.84)    -0.9186            -0.9174            -0.91
 *
 * Both derived values land within ~0.013 (N = 1e6) and ~0.009 (N = 1e16) of the round
 * imp-35135 measured literals -- an INDEPENDENT confirmation of the imp-35198 agreement,
 * matching its reported ~0.013 / ~0.009 residuals to the digit. The leading and full
 * surrogate agree to ~0.002, confirming +3/log N is the leading term.
 *
 * CROSS-CHECK ONLY. Changes no bound; reproduces the imp-35198 numbers by an independent
 * code path, nothing more. The component model is the imp-3220/imp-3406 extrapolation,
 * NOT a rigorous asymptotic; E_flow > 0 strictness (imp-33848) untouched; C_mb
 * GUE-conditional per imp-486 UNTOUCHED; no operator positivity; no RH verdict, NO QED.
 * No refereed bound is changed.
 *
 * @see imp-35198-eflow-fartail-exponent-logn-correction (the derivation this cross-checks)
 * @see imp-35135-eflow-fartail-decay-exponent-positivity-reconciliation (the measured drift)
 */

// --- Independent constants (no imports) --------------------------------------
const TWO_PI = 2 * Math.PI;
const LOG_TWO_PI = Math.log(TWO_PI);

// imp-35135 MEASURED far-tail E_flow local exponents at the two anchor N (round
// literals, baked in so the comparison does not touch the imp-35135 module).
const MEASURED_EXP_AT_1E6 = -0.77; // N = 1e6
const MEASURED_EXP_AT_1E16 = -0.91; // N = 1e16

// --- Independent recomputation from first principles --------------------------
// M = log T0 under the RvM surrogate T0 = 2 pi N / log N, as a function of x = log N.
function logT0(x) {
  return x - Math.log(x) + LOG_TWO_PI;
}

// Derived leading closed form: -1 + 3 / log N.
function leadingLaw(x) {
  return -1 + 3 / x;
}

// Full surrogate exponent s(x) = (1 - 1/log N)(2/log T0 - 1).
function fullSurrogate(x) {
  const M = logT0(x);
  return (1 - 1 / x) * (2 / M - 1);
}

const ANCHORS = [
  { N: 1e6, measured: MEASURED_EXP_AT_1E6 },
  { N: 1e16, measured: MEASURED_EXP_AT_1E16 },
].map(({ N, measured }) => {
  const x = Math.log(N);
  const lead = leadingLaw(x);
  const full = fullSurrogate(x);
  return {
    N: +N.toExponential(0),
    logN: +x.toFixed(4),
    leading: +lead.toFixed(4), // -1 + 3/log N
    full: +full.toFixed(4), // (1 - 1/log N)(2/log T0 - 1)
    measured, // imp-35135 literal
    residualVsMeasured: +Math.abs(lead - measured).toFixed(4),
    leadMinusFull: +(lead - full).toFixed(4),
  };
});

const TOP = ANCHORS[0]; // N = 1e6
const DEEP = ANCHORS[1]; // N = 1e16

export const IMP35222_EFLOW_FARTAIL_EXPONENT_STANDALONE_CROSSCHECK = {
  id: 'imp-35222',
  proofSection: 'S-frontier',
  question:
    'Standalone cross-check (independent code path, no heavy import): does the imp-35198 leading law ' +
    '-1 + 3/log N and full surrogate s(x) = (1 - 1/log N)(2/log T0 - 1) reproduce the imp-35135 ' +
    'measured far-tail E_flow exponents (-0.77 at N = 1e6, -0.91 at N = 1e16) when recomputed from ' +
    'first principles and compared against the measured literals?',
  anchors: ANCHORS,
  topResidualVsMeasured: TOP.residualVsMeasured, // ~0.013
  deepResidualVsMeasured: DEEP.residualVsMeasured, // ~0.009
  finding:
    'The independent recomputation reproduces the imp-35198 ladder (leading -0.7829 / -0.9186, full ' +
    '-0.7852 / -0.9174) and lands within ~0.013 (N = 1e6) and ~0.009 (N = 1e16) of the imp-35135 ' +
    'measured literals -0.77 and -0.91, matching the imp-35198 reported residuals to the digit via ' +
    'a code path that shares no arithmetic with the derivation module.',
  isRigorous: false,
  verdict:
    'CROSS-CHECK ONLY (independent code path). The imp-35198 leading law -1 + 3/log N and full ' +
    'surrogate s(x) = (1 - 1/log N)(2/log T0 - 1), recomputed here from first principles with no ' +
    'heavy import, reproduce the imp-35135 measured far-tail E_flow exponents (-0.77 at N = 1e6, ' +
    '-0.91 at N = 1e16) to within ~0.013 / ~0.009 -- confirming the imp-35198 agreement by a ' +
    'separate code path. Changes no bound; component model is the imp-3220/imp-3406 extrapolation, ' +
    'NOT a rigorous asymptotic; E_flow > 0 strictness (imp-33848) untouched; C_mb GUE-conditional ' +
    'per imp-486 UNTOUCHED; no operator positivity; no RH verdict, NO QED. No refereed bound is changed' +
    '.',
  citation:
    'imp-35198 (leading +3/log N derivation, cross-checked here); imp-35135 (measured far-tail ' +
    'E_flow exponent drift); imp-486 (C_mb GUE-conditional, UNTOUCHED).',
};

export const IMP35222_EFLOW_FARTAIL_EXPONENT_STANDALONE_CROSSCHECK_ASSERTIONS = [
  {
    // Independent path reproduces the imp-35198 leading ladder values at both anchors.
    id: 'imp35222-leading-matches-imp35198-ladder',
    description: 'independently recomputed -1 + 3/log N equals imp-35198 -0.7829 (1e6) and -0.9186 (1e16)',
    holds: () =>
      Math.abs(TOP.leading - -0.7829) < 5e-4 && Math.abs(DEEP.leading - -0.9186) < 5e-4,
  },
  {
    // Independent path reproduces the imp-35198 full surrogate ladder values at both anchors.
    id: 'imp35222-full-surrogate-matches-imp35198-ladder',
    description: 'independently recomputed full s(x) equals imp-35198 -0.7852 (1e6) and -0.9174 (1e16)',
    holds: () =>
      Math.abs(TOP.full - -0.7852) < 5e-4 && Math.abs(DEEP.full - -0.9174) < 5e-4,
  },
  {
    // The leading law lands within 0.02 of the imp-35135 measured LITERALS at both anchors.
    id: 'imp35222-reproduces-imp35135-measured-literals',
    description: 'leading -1 + 3/log N is within 0.02 of imp-35135 literals -0.77 and -0.91',
    holds: () =>
      TOP.residualVsMeasured < 0.02 &&
      DEEP.residualVsMeasured < 0.02 &&
      MEASURED_EXP_AT_1E6 === -0.77 &&
      MEASURED_EXP_AT_1E16 === -0.91,
  },
  {
    // Leading and full surrogate agree to ~0.003, confirming +3/log N is the leading term.
    id: 'imp35222-leading-agrees-with-full-surrogate',
    description: 'leading -1 + 3/x and full surrogate agree to within 0.003 at both anchors',
    holds: () => Math.abs(TOP.leadMinusFull) < 0.003 && Math.abs(DEEP.leadMinusFull) < 0.003,
  },
  {
    // The exponent deepens toward -1 down the ladder and stays strictly in (-1, 0).
    id: 'imp35222-approaches-minus-one-from-above',
    description: 'derived exponent in (-1, 0) and deepens toward -1 from 1e6 to 1e16',
    holds: () =>
      TOP.leading > -1 && TOP.leading < 0 && DEEP.leading > -1 && DEEP.leading < TOP.leading,
  },
  {
    // Honesty gate: cross-check only, no bound change, no QED, no refereed bound is changed.
    id: 'imp35222-honesty-gate-no-qed',
    description: 'Cross-check only: isRigorous false, no QED, no refereed bound is changed',
    holds: () =>
      IMP35222_EFLOW_FARTAIL_EXPONENT_STANDALONE_CROSSCHECK.isRigorous === false &&
      /NO QED/.test(IMP35222_EFLOW_FARTAIL_EXPONENT_STANDALONE_CROSSCHECK.verdict) &&
      /refereed bound is changed/i.test(IMP35222_EFLOW_FARTAIL_EXPONENT_STANDALONE_CROSSCHECK.verdict),
  },
];

for (const a of IMP35222_EFLOW_FARTAIL_EXPONENT_STANDALONE_CROSSCHECK_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-35222-eflow-fartail-exponent-standalone-crosscheck assertion failed: ${a.id}`,
    );
  }
}
