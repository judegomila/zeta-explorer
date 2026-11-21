/**
 * @module imp-35286-eflow-fartail-surrogate-crossover
 *
 * imp-35286 (numerical, frontier-direction): LOCATE the N at which the imp-35237 full
 * surrogate s(x) = (1 - 1/log N)(2/log T0 - 1) far-tail E_flow residual first OVERTAKES
 * (beats) the imp-35198 leading law -1 + 3/log N, both measured against the imp-35135
 * MEASURED far-tail local exponent d(log E_flow)/d(log N).
 *
 * THE GAP imp-35237 LEFT OPEN
 * ---------------------------
 * imp-35237 tabulated both residuals at four anchors and found the full surrogate is
 * WORSE than the leading law at N = 1e6 (0.0142 vs 0.0119) but BETTER at N = 1e9, 1e12,
 * 1e16 (0.0080 vs 0.0089, 0.0051 vs 0.0064, 0.0032 vs 0.0044). So the full-surrogate
 * residual crosses from worse-than-leading to better-than-leading somewhere in the decade
 * gap between N = 1e6 and N = 1e9, but imp-35237 never pinned the crossover. This module
 * pins it by evaluating both residuals against the imp-35135 measured exponent on a FINE
 * N grid and bisecting.
 *
 * WHY A SEPARATE INDEPENDENT MODULE (matching the imp-35222 / imp-35237 convention)
 * --------------------------------------------------------------------------------
 * This keeps the identical independent code path: it re-implements effectiveHeightForN
 * (the RvM Newton inverse), eFlow, and the imp-35135 central-difference localExponent as
 * fresh local functions, imports NOTHING heavy (no zeros bundle, no imp-35135 / imp-35198
 * module), and re-derives the leading -1 + 3/log N and full surrogate s(x) from first
 * principles. As a reuse gate, the independent measured exponent reproduces the imp-35135
 * baked literals -0.7710 / -0.8463 / -0.8850 / -0.9142 at the four anchors, proving the
 * identical inherited surrogate is in use.
 *
 * THE MEASUREMENT: bisect the residual crossover on a fine grid
 * ------------------------------------------------------------
 *   For each N the two residuals are |lead(x) - m(N)| and |full(x) - m(N)| with x = log N
 *   and m(N) = localExponent(eFlow, N) (the imp-35135 central difference). The residual
 *   difference d(N) = fullResidual(N) - leadResidual(N) runs POSITIVE (leading wins) at
 *   N = 1e6 and NEGATIVE (full wins) at N = 1e9. Bisecting d(N) = 0 in log10 N lands the
 *   crossover at:
 *
 *       N* ~ 2.615e7   (log10 N* ~ 7.4175,  log N* ~ 17.0795)
 *
 *   just above N = 1e7 -- so the full surrogate first beats the leading law at N ~ 2.6e7,
 *   inside the decade the imp-35237 table skipped over.
 *
 * THE STRUCTURAL FINDING: the crossover is the fit-crossing, not a measured coincidence
 * ------------------------------------------------------------------------------------
 * Across the entire [1e6, 1e9] window BOTH fits sit strictly BELOW (more negative than)
 * the imp-35135 measured exponent (e.g. at N* lead = full = -0.8244 < m = -0.8137). When
 * both fits are on the same side of the measurement, |full - m| < |lead - m| iff
 * full > lead, so the residual crossover coincides EXACTLY with the fit-crossing where
 * s(x) = -1 + 3/log N. Independently bisecting that surrogate equation full(x) = lead(x)
 * lands the identical N* ~ 2.615e7 to full precision -- confirming the crossover is a
 * property of where the two closed forms cross, not an artifact of the noisy measured
 * target. (It is the full surrogate's slightly shallower far-tail slope overtaking the
 * leading law's as N grows.)
 *
 * MEASUREMENT ONLY on the inherited surrogate. Changes no bound; establishes no operator
 * positivity. Component model is the imp-3220/imp-3406 extrapolation, NOT a rigorous
 * asymptotic; E_flow > 0 strictness (imp-33848) untouched; C_mb GUE-conditional per imp-486
 * UNTOUCHED; far-tail exponent 1/2 per imp-3463; no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-35237-eflow-fartail-exponent-ladder-crosscheck (the ladder table whose crossover this pins)
 * @see imp-35198-eflow-fartail-exponent-logn-correction (the leading -1 + 3/log N law)
 * @see imp-35135-eflow-fartail-decay-exponent-positivity-reconciliation (the measured drift, reproduced here)
 * @see imp-35222-eflow-fartail-exponent-standalone-crosscheck (the independent-code-path convention)
 */

// --- Independent constants (no imports) --------------------------------------
const TWO_PI = 2 * Math.PI;
const LOG_TWO_PI = Math.log(TWO_PI);
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-35135/imp-35041/imp-33582 exactly

// imp-35135 MEASURED far-tail E_flow local exponents at the four anchors (baked as plain
// literals so the reuse gate can confirm the independent path reproduces them).
const MEASURED_LITERALS = { '1e6': -0.771, '1e9': -0.8463, '1e12': -0.885, '1e16': -0.9142 };

// --- Independent reimplementation of the imp-35135 measurement machinery -------
// RvM Newton inverse N -> T0 (identical to lambda-rh-height-mapping effectiveHeightForN).
function effectiveHeightForN(N) {
  if (!(N > 0) || !Number.isFinite(N)) return 0;
  let T = Math.max(TWO_PI * Math.E, (TWO_PI * N) / Math.max(1, Math.log(N + TWO_PI)));
  for (let i = 0; i < 40; i++) {
    const u = Math.log(T / TWO_PI);
    const f = (T / TWO_PI) * (u - 1) - N;
    const fp = u / TWO_PI;
    if (!(Math.abs(fp) > 0) || !Number.isFinite(fp)) break;
    const dT = f / fp;
    T -= dT;
    if (!(T > TWO_PI)) T = TWO_PI * 1.0001;
    if (Math.abs(dT) < 1e-9 * Math.max(1, T)) break;
  }
  return T;
}

// EXACT imp-35135 sub-terms (product of strictly positive factors).
function eFlow(N) {
  const T0 = effectiveHeightForN(N);
  const L = Math.log(T0);
  const C_F = (Math.log(T0 / TWO_PI) + 1) / TWO_PI; // imp-398 pinned prefactor
  return C_F * (L / T0) * GRONWALL;
}

// imp-35135 central log-log difference: measured local exponent d(log E_flow)/d(log N).
function measuredExponent(N) {
  const h = 1.0002;
  const lo = Math.log(eFlow(N / h));
  const hi = Math.log(eFlow(N * h));
  return (hi - lo) / (Math.log(N * h) - Math.log(N / h));
}

// --- The two closed-form fits being compared ----------------------------------
function leadingLaw(x) {
  return -1 + 3 / x; // imp-35198 leading law
}
function logT0Surrogate(x) {
  return x - Math.log(x) + LOG_TWO_PI; // RvM surrogate T0 = 2 pi N / log N
}
function fullSurrogate(x) {
  const M = logT0Surrogate(x);
  return (1 - 1 / x) * (2 / M - 1); // imp-35237 full surrogate s(x)
}

// Residual difference d(N) = |full - m| - |lead - m|. Positive => leading wins.
function residualDiff(N) {
  const x = Math.log(N);
  const m = measuredExponent(N);
  const leadResidual = Math.abs(leadingLaw(x) - m);
  const fullResidual = Math.abs(fullSurrogate(x) - m);
  return { N, x, m, leadResidual, fullResidual, diff: fullResidual - leadResidual };
}

// --- Reuse gate: reproduce the imp-35135 measured literals independently --------
const REPRODUCED = Object.fromEntries(
  Object.entries(MEASURED_LITERALS).map(([k, lit]) => {
    const N = Number(k);
    return [k, { literal: lit, reproduced: +measuredExponent(N).toFixed(4) }];
  }),
);
const REPRODUCES_IMP35135 = Object.values(REPRODUCED).every(
  (r) => Math.abs(r.reproduced - r.literal) < 5e-4,
);

// --- Bisect the residual crossover in log10 N between 1e6 and 1e9 --------------
// d(1e6) > 0 (leading wins); d(1e9) < 0 (full wins).
function bisectCrossover(loE, hiE, evalDiff) {
  for (let i = 0; i < 80; i++) {
    const midE = (loE + hiE) / 2;
    if (evalDiff(Math.pow(10, midE)) > 0) loE = midE;
    else hiE = midE;
  }
  return (loE + hiE) / 2;
}
const CROSS_LOG10 = bisectCrossover(6, 9, (N) => residualDiff(N).diff);
const CROSS_N = Math.pow(10, CROSS_LOG10);
const CROSS_LOGN = Math.log(CROSS_N);
const AT_CROSS = residualDiff(CROSS_N);

// Endpoint signs that bracket the crossover (imp-35237 anchors 1e6 / 1e9).
const DIFF_1E6 = residualDiff(1e6).diff; // > 0, leading wins
const DIFF_1E9 = residualDiff(1e9).diff; // < 0, full wins

// Both fits sit strictly BELOW the measured exponent across the whole window, so the
// residual crossover coincides with the fit-crossing full(x) = lead(x). Bisect that.
const BOTH_BELOW_MEASURED = [1e6, 1e7, CROSS_N, 1e8, 1e9].every((N) => {
  const x = Math.log(N);
  const m = measuredExponent(N);
  return leadingLaw(x) < m && fullSurrogate(x) < m;
});
const FIT_CROSS_LOG10 = bisectCrossover(6, 9, (N) => {
  const x = Math.log(N);
  return leadingLaw(x) - fullSurrogate(x); // > 0 while lead less negative than full
});
const FIT_CROSS_N = Math.pow(10, FIT_CROSS_LOG10);
// The measured-residual crossover and the pure fit-crossing agree to full precision.
const CROSSOVERS_AGREE = Math.abs(CROSS_LOG10 - FIT_CROSS_LOG10) < 1e-4;

export const IMP35286_EFLOW_FARTAIL_SURROGATE_CROSSOVER = {
  id: 'imp-35286',
  proofSection: 'S-frontier',
  question:
    'Locate the N at which the imp-35237 full surrogate s(x) = (1 - 1/log N)(2/log T0 - 1) ' +
    'far-tail E_flow residual first BEATS the imp-35198 leading law -1 + 3/log N against the ' +
    'imp-35135 measured local exponent: worse at N = 1e6 (0.0142 vs 0.0119), better at N >= 1e9 ' +
    '(0.0080 vs 0.0089). Bisect the crossover on a fine N grid. Measurement only; NO QED.',
  reproducedMeasuredLiterals: REPRODUCED,
  reproducesImp35135: REPRODUCES_IMP35135,
  diffAt1e6: +DIFF_1E6.toExponential(4), // > 0: leading wins at N = 1e6
  diffAt1e9: +DIFF_1E9.toExponential(4), // < 0: full wins at N = 1e9
  crossoverN: +CROSS_N.toExponential(4), // ~ 2.615e7
  crossoverLog10N: +CROSS_LOG10.toFixed(4), // ~ 7.4175
  crossoverLogN: +CROSS_LOGN.toFixed(4), // ~ 17.0795
  crossoverMeasuredExponent: +AT_CROSS.m.toFixed(4), // ~ -0.8137
  crossoverResidual: +AT_CROSS.leadResidual.toFixed(6), // lead == full residual at crossover ~ 0.0106
  bothFitsBelowMeasured: BOTH_BELOW_MEASURED,
  fitCrossingN: +FIT_CROSS_N.toExponential(4), // pure full(x) = lead(x) crossover, ~ 2.615e7
  crossoversAgree: CROSSOVERS_AGREE,
  finding:
    'On the independent code path (which reproduces the imp-35135 measured literals -0.7710 / ' +
    '-0.8463 / -0.8850 / -0.9142), the full-surrogate-minus-leading residual difference runs ' +
    'POSITIVE at N = 1e6 (leading wins) and NEGATIVE at N = 1e9 (full wins); bisecting it lands ' +
    'the crossover at N* ~ 2.615e7 (log N* ~ 17.08), just above N = 1e7 inside the decade the ' +
    'imp-35237 anchor table skipped. Because BOTH fits sit strictly below the measured exponent ' +
    'across the whole window (at N* lead = full = -0.8244 < measured -0.8137), the residual ' +
    'crossover coincides EXACTLY with the fit-crossing s(x) = -1 + 3/log N: independently ' +
    'bisecting full(x) = lead(x) lands the identical N* ~ 2.615e7, so the crossover is a property ' +
    'of where the two closed forms cross, not an artifact of the noisy measured target.',
  isRigorous: false,
  verdict:
    'MEASUREMENT (frontier-direction, NOT rigorous). The imp-35237 full-surrogate residual first ' +
    'beats the imp-35198 leading law at N* ~ 2.615e7 (log N* ~ 17.08), pinned by bisecting the ' +
    'residual difference against the imp-35135 measured exponent on a fine grid -- inside the ' +
    'N = 1e6..1e9 decade the imp-35237 anchor table left open. Both fits sit below the measured ' +
    'exponent throughout, so the crossover coincides to full precision with the pure fit-crossing ' +
    'full(x) = lead(x), i.e. it is the full surrogate slightly shallower far-tail slope overtaking ' +
    'the leading law, not a measured coincidence. Measurement only on the inherited surrogate; ' +
    'changes no bound; component model is the imp-3220/imp-3406 extrapolation, NOT a rigorous ' +
    'asymptotic; E_flow > 0 strictness (imp-33848) untouched; C_mb GUE-conditional per imp-486 ' +
    'UNTOUCHED; far-tail exponent 1/2 per imp-3463; no operator positivity; no RH verdict, NO ' +
    'QED. No refereed bound is changed.',
  citation:
    'imp-35237 (full-surrogate vs leading ladder table whose crossover this pins); imp-35198 ' +
    '(leading +3/log N law); imp-35135 (measured far-tail E_flow exponent, reproduced here); ' +
    'imp-35222 (independent-code-path convention); imp-486 (C_mb GUE-conditional, UNTOUCHED).',
};

export const IMP35286_EFLOW_FARTAIL_SURROGATE_CROSSOVER_ASSERTIONS = [
  {
    // Reuse gate: the independent measured exponent reproduces the imp-35135 baked literals.
    id: 'imp35286-reproduces-imp35135-measured-literals',
    description: 'independent localExponent reproduces -0.7710 / -0.8463 / -0.8850 / -0.9142',
    holds: () => REPRODUCES_IMP35135,
  },
  {
    // The imp-35237 anchors bracket the crossover: leading wins at 1e6, full wins at 1e9.
    id: 'imp35286-crossover-bracketed-by-imp35237-anchors',
    description: 'residual diff > 0 at N = 1e6 (leading wins) and < 0 at N = 1e9 (full wins)',
    holds: () => DIFF_1E6 > 0 && DIFF_1E9 < 0,
  },
  {
    // The crossover lands at N* ~ 2.615e7 (log N* ~ 17.08), inside the 1e7..1e8 window.
    id: 'imp35286-crossover-at-2p6e7',
    description: 'bisected residual crossover at N* ~ 2.615e7 (log10 N* ~ 7.4175)',
    holds: () =>
      Math.abs(CROSS_LOG10 - 7.4175) < 5e-3 && CROSS_N > 1e7 && CROSS_N < 1e8,
  },
  {
    // Both fits sit below the measured exponent across the window, so the residual crossover
    // coincides with the pure fit-crossing full(x) = lead(x) to full precision.
    id: 'imp35286-crossover-is-fit-crossing',
    description: 'both fits below measured; residual crossover equals full(x) = lead(x) crossover',
    holds: () =>
      BOTH_BELOW_MEASURED &&
      CROSSOVERS_AGREE &&
      Math.abs(Math.log10(FIT_CROSS_N) - CROSS_LOG10) < 1e-3,
  },
  {
    // At the crossover the leading and full residuals are equal (definition of the crossover).
    id: 'imp35286-residuals-equal-at-crossover',
    description: 'leading and full residuals coincide at the crossover N*',
    holds: () => Math.abs(AT_CROSS.leadResidual - AT_CROSS.fullResidual) < 1e-6,
  },
  {
    // Honesty gate: measurement only, no bound change, no QED, no refereed bound is changed.
    id: 'imp35286-honesty-gate-no-qed',
    description: 'Measurement only: isRigorous false, no QED, no refereed bound is changed',
    holds: () =>
      IMP35286_EFLOW_FARTAIL_SURROGATE_CROSSOVER.isRigorous === false &&
      /NO QED/.test(IMP35286_EFLOW_FARTAIL_SURROGATE_CROSSOVER.verdict) &&
      /refereed bound is changed/i.test(IMP35286_EFLOW_FARTAIL_SURROGATE_CROSSOVER.verdict),
  },
];

for (const a of IMP35286_EFLOW_FARTAIL_SURROGATE_CROSSOVER_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-35286-eflow-fartail-surrogate-crossover assertion failed: ${a.id}`,
    );
  }
}
