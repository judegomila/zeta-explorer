/**
 * @module imp-35237-eflow-fartail-exponent-ladder-crosscheck
 *
 * imp-35237 (accuracy, frontier-direction): EXTEND the imp-35222 INDEPENDENT E_flow
 * far-tail exponent cross-check from its two ENDPOINT anchors (N = 1e6, N = 1e16) to the
 * two INTERMEDIATE anchors N = 1e9 and N = 1e12, testing whether the imp-35198 derived
 * leading law d(log E_flow)/d(log N) = -1 + 3/log N (and the full surrogate
 * s(x) = (1 - 1/log N)(2/log T0 - 1)) reproduces the imp-35135 MEASURED far-tail drift
 * across the FULL ladder rather than just the two extremes.
 *
 * WHY A SEPARATE MODULE (matching the imp-35222 convention)
 * --------------------------------------------------------
 * imp-35222 pins the derivation at only N = 1e6 and N = 1e16 on an INDEPENDENT code path
 * (fresh local functions, no heavy import, imp-35135 measured LITERALS baked in as plain
 * constants). It leaves the intermediate ladder never independently cross-checked. This
 * module keeps the identical independent path -- recomputes both the leading -1 + 3/log N
 * and the full surrogate s(x) FROM FIRST PRINCIPLES with fresh local functions, imports
 * NOTHING heavy (no zeros bundle, no effectiveHeightForN, no imp-35135 / imp-35198 module)
 * -- and adds the N = 1e9 and N = 1e12 rungs so all four anchors are pinned.
 *
 * THE MEASURED INTERMEDIATE LITERALS (imp-35135 local exponents, 4 decimals)
 * -------------------------------------------------------------------------
 * The imp-35135 measurement estimates the far-tail E_flow local exponent d(log E_flow)/
 * d(log N) by central difference on eFlow(N) with T0 = effectiveHeightForN(N). Read off
 * its ladder at the four anchors (baked here as plain constants, so this comparison never
 * touches the imp-35135 module):
 *
 *     N        imp-35135 measured    leading -1 + 3/x    full s(x)     |lead - meas|   |full - meas|
 *   1e6            -0.7710              -0.7829           -0.7852        0.0119          0.0142
 *   1e9            -0.8463              -0.8552           -0.8543        0.0089          0.0080
 *   1e12           -0.8850              -0.8914           -0.8901        0.0064          0.0051
 *   1e16           -0.9142              -0.9186           -0.9174        0.0044          0.0032
 *
 * THE FINDING: the residual is MONOTONE DECREASING across the full ladder. Both the
 * leading-law residual (0.0119 -> 0.0089 -> 0.0064 -> 0.0044) and the full-surrogate
 * residual (0.0142 -> 0.0080 -> 0.0051 -> 0.0032) shrink steadily from N = 1e6 to N = 1e16:
 * the imp-35198 derived law tracks the imp-35135 measured drift INCREASINGLY well at larger
 * N, exactly as a leading-order (log N)-power correction to the asymptotic exponent -1
 * should. The ~0.01 residual imp-35222 saw at the endpoints is not an accident of the two
 * extremes -- it is the top of a monotone-shrinking sequence across the whole ladder.
 *
 * (The 1e6 / 1e16 residuals here, 0.0119 / 0.0044, are measured against the finer imp-35135
 * literals -0.7710 / -0.9142; imp-35222 reported ~0.013 / ~0.009 against the ROUND literals
 * -0.77 / -0.91. Same derivation, finer measured target -- both are consistent.)
 *
 * CROSS-CHECK ONLY. Changes no bound; extends the imp-35222 independent code path to two
 * more anchors, nothing more. The component model is the imp-3220/imp-3406 extrapolation,
 * NOT a rigorous asymptotic; E_flow > 0 strictness (imp-33848) untouched; C_mb
 * GUE-conditional per imp-486 UNTOUCHED; no operator positivity; no RH verdict, NO QED.
 * No refereed bound is changed.
 *
 * @see imp-35222-eflow-fartail-exponent-standalone-crosscheck (the two-anchor cross-check this extends)
 * @see imp-35198-eflow-fartail-exponent-logn-correction (the derivation being cross-checked)
 * @see imp-35135-eflow-fartail-decay-exponent-positivity-reconciliation (the measured drift)
 */

// --- Independent constants (no imports) --------------------------------------
const TWO_PI = 2 * Math.PI;
const LOG_TWO_PI = Math.log(TWO_PI);

// imp-35135 MEASURED far-tail E_flow local exponents at the four anchor N (its ladder read
// to 4 decimals, baked in so the comparison does not touch the imp-35135 module).
const MEASURED_EXP = {
  '1e6': -0.771, // N = 1e6  (imp-35222 round literal -0.77)
  '1e9': -0.8463, // N = 1e9  (intermediate anchor, this ticket)
  '1e12': -0.885, // N = 1e12 (intermediate anchor, this ticket)
  '1e16': -0.9142, // N = 1e16 (imp-35222 round literal -0.91)
};

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
  { N: 1e6, measured: MEASURED_EXP['1e6'] },
  { N: 1e9, measured: MEASURED_EXP['1e9'] },
  { N: 1e12, measured: MEASURED_EXP['1e12'] },
  { N: 1e16, measured: MEASURED_EXP['1e16'] },
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
    residualVsMeasured: +Math.abs(lead - measured).toFixed(4), // |lead - measured|
    fullResidualVsMeasured: +Math.abs(full - measured).toFixed(4), // |full - measured|
    leadMinusFull: +(lead - full).toFixed(4),
  };
});

// Is the residual sequence strictly monotone decreasing down the ladder?
const isStrictlyDecreasing = (arr) => arr.every((v, i) => i === 0 || v < arr[i - 1]);
const LEAD_RESIDUALS = ANCHORS.map((a) => a.residualVsMeasured);
const FULL_RESIDUALS = ANCHORS.map((a) => a.fullResidualVsMeasured);
const LEAD_RESIDUAL_MONOTONE = isStrictlyDecreasing(LEAD_RESIDUALS);
const FULL_RESIDUAL_MONOTONE = isStrictlyDecreasing(FULL_RESIDUALS);

const TOP = ANCHORS[0]; // N = 1e6
const DEEP = ANCHORS[ANCHORS.length - 1]; // N = 1e16

export const IMP35237_EFLOW_FARTAIL_EXPONENT_LADDER_CROSSCHECK = {
  id: 'imp-35237',
  proofSection: 'S-frontier',
  question:
    'Extend the imp-35222 independent E_flow far-tail exponent cross-check from its two endpoint ' +
    'anchors (N = 1e6, N = 1e16) to the intermediate anchors N = 1e9 and N = 1e12: does the ' +
    'imp-35198 leading law -1 + 3/log N and full surrogate s(x) = (1 - 1/log N)(2/log T0 - 1) ' +
    'reproduce the imp-35135 measured far-tail drift across the FULL ladder, and is the ~0.01 ' +
    'residual monotone across it?',
  anchors: ANCHORS,
  leadResiduals: LEAD_RESIDUALS, // [0.0119, 0.0089, 0.0064, 0.0044]
  fullResiduals: FULL_RESIDUALS, // [0.0142, 0.0080, 0.0051, 0.0032]
  leadResidualMonotoneDecreasing: LEAD_RESIDUAL_MONOTONE,
  fullResidualMonotoneDecreasing: FULL_RESIDUAL_MONOTONE,
  finding:
    'On the same independent code path, the two intermediate anchors land at leading -0.8552 ' +
    '(1e9) / -0.8914 (1e12) and full -0.8543 / -0.8901, versus the imp-35135 measured -0.8463 / ' +
    '-0.8850. Across the full four-anchor ladder BOTH residuals shrink monotonically: the ' +
    'leading-law residual runs 0.0119 -> 0.0089 -> 0.0064 -> 0.0044 and the full-surrogate ' +
    'residual runs 0.0142 -> 0.0080 -> 0.0051 -> 0.0032. The imp-35198 law tracks the imp-35135 ' +
    'drift increasingly well at larger N -- the ~0.01 residual is the top of a monotone-shrinking ' +
    'sequence, not an artifact of the two extremes.',
  isRigorous: false,
  verdict:
    'CROSS-CHECK ONLY (independent code path). Extending the imp-35222 cross-check to the ' +
    'intermediate anchors N = 1e9 and N = 1e12 confirms the imp-35198 leading law -1 + 3/log N ' +
    'and full surrogate s(x) = (1 - 1/log N)(2/log T0 - 1) reproduce the imp-35135 measured ' +
    'far-tail E_flow drift across the FULL ladder, with the residual MONOTONE DECREASING from ' +
    '~0.012 at N = 1e6 to ~0.004 at N = 1e16 (leading) -- so the agreement is not an accident of ' +
    'the endpoints. Changes no bound; component model is the imp-3220/imp-3406 extrapolation, ' +
    'NOT a rigorous asymptotic; E_flow > 0 strictness (imp-33848) untouched; C_mb GUE-conditional ' +
    'per imp-486 UNTOUCHED; no operator positivity; no RH verdict, NO QED. No refereed bound is changed' +
    '.',
  citation:
    'imp-35222 (two-anchor independent cross-check, extended here); imp-35198 (leading +3/log N ' +
    'derivation); imp-35135 (measured far-tail E_flow exponent drift); imp-486 (C_mb ' +
    'GUE-conditional, UNTOUCHED).',
};

export const IMP35237_EFLOW_FARTAIL_EXPONENT_LADDER_CROSSCHECK_ASSERTIONS = [
  {
    // The two endpoint anchors reproduce the imp-35222 leading ladder values exactly.
    id: 'imp35237-endpoints-match-imp35222-leading-ladder',
    description: 'leading -1 + 3/log N equals imp-35222 -0.7829 (1e6) and -0.9186 (1e16)',
    holds: () =>
      Math.abs(TOP.leading - -0.7829) < 5e-4 && Math.abs(DEEP.leading - -0.9186) < 5e-4,
  },
  {
    // The two NEW intermediate anchors recompute to the derived ladder values.
    id: 'imp35237-intermediate-anchors-recompute',
    description: 'leading recomputes to -0.8552 (1e9) and -0.8914 (1e12); full to -0.8543 and -0.8901',
    holds: () =>
      Math.abs(ANCHORS[1].leading - -0.8552) < 5e-4 &&
      Math.abs(ANCHORS[2].leading - -0.8914) < 5e-4 &&
      Math.abs(ANCHORS[1].full - -0.8543) < 5e-4 &&
      Math.abs(ANCHORS[2].full - -0.8901) < 5e-4,
  },
  {
    // The leading-law residual against the imp-35135 measured exponents is strictly monotone
    // decreasing across the full four-anchor ladder.
    id: 'imp35237-leading-residual-monotone-decreasing',
    description: 'leading residual shrinks 0.0119 -> 0.0089 -> 0.0064 -> 0.0044 across the ladder',
    holds: () =>
      LEAD_RESIDUAL_MONOTONE &&
      LEAD_RESIDUALS.length === 4 &&
      Math.abs(LEAD_RESIDUALS[0] - 0.0119) < 5e-4 &&
      Math.abs(LEAD_RESIDUALS[3] - 0.0044) < 5e-4,
  },
  {
    // The full-surrogate residual is likewise strictly monotone decreasing across the ladder.
    id: 'imp35237-full-residual-monotone-decreasing',
    description: 'full-surrogate residual shrinks 0.0142 -> 0.0080 -> 0.0051 -> 0.0032 across the ladder',
    holds: () =>
      FULL_RESIDUAL_MONOTONE &&
      FULL_RESIDUALS.length === 4 &&
      Math.abs(FULL_RESIDUALS[0] - 0.0142) < 5e-4 &&
      Math.abs(FULL_RESIDUALS[3] - 0.0032) < 5e-4,
  },
  {
    // Every anchor lands within 0.02 of the imp-35135 measured literal (both fits).
    id: 'imp35237-all-anchors-within-two-hundredths',
    description: 'leading and full within 0.02 of the imp-35135 measured exponent at all four anchors',
    holds: () =>
      ANCHORS.every((a) => a.residualVsMeasured < 0.02 && a.fullResidualVsMeasured < 0.02),
  },
  {
    // The derived exponent deepens monotonically toward -1, staying strictly in (-1, 0).
    id: 'imp35237-exponent-deepens-toward-minus-one',
    description: 'leading exponent in (-1, 0) and strictly deepens 1e6 -> 1e9 -> 1e12 -> 1e16',
    holds: () =>
      ANCHORS.every((a) => a.leading > -1 && a.leading < 0) &&
      ANCHORS.every((a, i) => i === 0 || a.leading < ANCHORS[i - 1].leading),
  },
  {
    // Honesty gate: cross-check only, no bound change, no QED, no refereed bound is changed.
    id: 'imp35237-honesty-gate-no-qed',
    description: 'Cross-check only: isRigorous false, no QED, no refereed bound is changed',
    holds: () =>
      IMP35237_EFLOW_FARTAIL_EXPONENT_LADDER_CROSSCHECK.isRigorous === false &&
      /NO QED/.test(IMP35237_EFLOW_FARTAIL_EXPONENT_LADDER_CROSSCHECK.verdict) &&
      /refereed bound is changed/i.test(IMP35237_EFLOW_FARTAIL_EXPONENT_LADDER_CROSSCHECK.verdict),
  },
];

for (const a of IMP35237_EFLOW_FARTAIL_EXPONENT_LADDER_CROSSCHECK_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-35237-eflow-fartail-exponent-ladder-crosscheck assertion failed: ${a.id}`,
    );
  }
}
