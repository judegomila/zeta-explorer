/**
 * @module imp-35397-eflow-fartail-remnant-stencil-refinement
 *
 * imp-35397 (numerical, frontier-direction): imp-35280 read the E_flow far-tail
 * fd-vs-analytic (closed-form/prefactor) remnant -- the gap |analytic - fd-surrogate|
 * between the imp-35198 analytic leading exponent (-1 + 3/log N) and the finite-difference
 * exponent on the CLOSED surrogate height map T0 = 2 pi N / log N -- as a NON-monotone
 * ~0.002 band across N = 1e6/1e9/1e12/1e16 (0.0025/0.0031/0.0026/0.0019) with an apparent
 * interior peak at the 1e9 rung. imp-35377 RESOLVED the finer-N-grid half of the imp-35397
 * question: on a 0.05-decade scan + ternary bisection the remnant has a genuine smooth
 * interior maximum at log10 N* ~= 7.8587 (N* ~= 7.22e7), not a four-decimal read artifact.
 *
 * But imp-35377 used the SAME central-difference stencil h = 1.0002 as imp-35280 and
 * explicitly LEFT OPEN the other half of the imp-35397 ticket -- its honestStatus warned
 * that "height and location are surrogate-channel quantities ... sensitive to the fixed
 * central-difference stencil h = 1.0002; a different stencil would shift the sub-1e-4 crown
 * position slightly." THIS module closes that remaining sub-gap: does the interior maximum
 * SURVIVE a TIGHTER central-difference step, and does it converge as h -> 1?
 *
 * THE MEASUREMENT (surrogate channel only -- no height-map swap, so no heavy import)
 * ---------------------------------------------------------------------------------
 * The remnant holds the height map FIXED at the closed surrogate T0 = 2 pi N / log N
 * (imp-35280/imp-35377), so it is pure Math (no lambda-rh-height-mapping import), exactly
 * as imp-35371 established. This module re-locates the interior peak (0.05-decade scan +
 * 80-round ternary bisection in log10 N, identical to imp-35377) on a LADDER of tightening
 * central-difference stencils h = 1.0002 -> 1.00005 -> 1.00001 -> 1.000002, and -- taking
 * the stencil all the way to its h -> 1 limit -- on the EXACT analytic local exponent
 * d(log E_flow)/d(log N) computed in closed form (no finite difference at all):
 *
 *   with u = log N, L = log(2 pi) + u - log u,
 *   d(log E_flow)/d(log N) = (1 - 1/u) * [ 1/(u - log u + 1) + 1/L - 1 ].
 *
 * THE FINDING (refines the imp-35377 stencil caveat: the crown is stencil-INVARIANT)
 * --------------------------------------------------------------------------------
 *   stencil h        log10 N*        peak height
 *   1.0002           7.85867         0.00324280   (imp-35377, reproduced)
 *   1.00005          7.85859         0.00324280
 *   1.00001          7.85901         0.00324280
 *   1.000002         7.85826         0.00324280
 *   h -> 1 EXACT     7.85858         0.00324280   (closed-form derivative, no fd)
 *
 * The interior maximum SURVIVES stencil refinement essentially unchanged: the peak height is
 * IDENTICAL to eight significant figures (0.00324280) from h = 1.0002 all the way down to
 * h = 1.000002 AND at the exact h -> 1 closed-form derivative, and the argmax stays pinned at
 * log10 N* = 7.8586 +/- 4e-4 (the tiny 5th-decimal jitter 7.85826..7.85901 is ternary-bisection
 * noise on the very flat crown, NOT stencil sensitivity -- the HEIGHT does not move at all). The
 * reason is that already at h = 1.0002 the finite-difference exponent agrees with the exact
 * closed-form derivative to < 1e-6, so the remnant (dominated by the analytic Taylor-truncation
 * of -1 + 3/log N) barely depends on the stencil. This REFINES the imp-35377 honestStatus
 * caveat: the sub-1e-4 crown position does NOT shift with a different stencil -- location and
 * height are stencil-invariant to the precision that matters.
 *
 * VERDICT for imp-35397: the imp-35280 non-monotone reading is a GENUINE interior maximum, not
 * a four-decimal read artifact (finer grid: imp-35377) and not a stencil artifact (tighter step:
 * this module). Both halves of the imp-35397 grid/stencil-refinement question are now answered.
 *
 * MEASUREMENT ONLY on the inherited imp-3220/imp-3406 surrogate extrapolation, NOT a rigorous
 * asymptotic; changes no bound. E_flow > 0 strictness (imp-33848) untouched; C_mb GUE-conditional
 * per imp-486 UNTOUCHED; E_coll far-tail exponent 1/2 per imp-3463; imp-3066 K_a >= 0 untouched; no
 * operator positivity; no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-35377-eflow-fartail-remnant-interior-peak (finer-N-grid half; stencil caveat closed here)
 * @see imp-35280-eflow-fartail-fd-vs-analytic-surrogate-gap (the coarse three-point ladder)
 * @see imp-35371-eflow-fartail-remnant-deep-extension (same remnant, deep extension; pure-Math channel)
 * @see imp-35198-eflow-fartail-exponent-logn-correction (the analytic -1 + 3/log N leading form)
 * @see imp-35135-eflow-fartail-decay-exponent-positivity-reconciliation (far-tail E_flow quantity)
 */

const TWO_PI = 2 * Math.PI;

// imp-35135/imp-35236 exact sub-term constant (no re-derivation): the A1-trap Gronwall factor.
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP);

// The closed RvM surrogate height map T0 = 2 pi N / log N (the inverse the derivation uses).
function surrogateHeightForN(N) {
  return (TWO_PI * N) / Math.log(N);
}

// EXACT imp-35135 far-tail E_flow quantity on the surrogate height map (imp-35236 form).
function eFlow(N) {
  const T0 = surrogateHeightForN(N);
  const L = Math.log(T0);
  const C_F = (Math.log(T0 / TWO_PI) + 1) / TWO_PI; // imp-398 pinned prefactor
  return C_F * (L / T0) * GRONWALL;
}

// Local log-log decay exponent by a central difference with tunable step factor h.
function fdExponent(N, h) {
  const lo = Math.log(eFlow(N / h));
  const hi = Math.log(eFlow(N * h));
  return (hi - lo) / (Math.log(N * h) - Math.log(N / h));
}

// The EXACT h -> 1 limit: closed-form d(log E_flow)/d(log N).
// log E_flow = log(u - log u + 1) - log(2 pi) + log(L) - L + const, with u = log N and
// L = log(2 pi) + u - log u; differentiating in u (= log N) gives the expression below.
function exactExponent(N) {
  const u = Math.log(N);
  const L = Math.log(TWO_PI) + u - Math.log(u);
  return (1 - 1 / u) * (1 / (u - Math.log(u) + 1) + 1 / L - 1);
}

// The imp-35198 analytic leading closed form -1 + 3/log N (the surrogate-channel analytic exponent).
function analyticSurrogateExponent(x) {
  return -1 + 3 / x;
}

// The fd-vs-analytic remnant at a given N (log10 argument) with a chosen stencil, full precision.
// When exact === true the h -> 1 closed-form derivative is used instead of a finite difference.
function remnantAtLog10(l10, h, exact) {
  const N = Math.pow(10, l10);
  const fd = exact ? exactExponent(N) : fdExponent(N, h);
  const analytic = analyticSurrogateExponent(Math.log(N));
  return Math.abs(analytic - fd);
}

// Locate the interior maximum between N = 1e6 and N = 1e12 (in log10 N), identical scheme to imp-35377.
function locatePeak(h, exact) {
  let bestL10 = 6;
  let bestR = -1;
  for (let l10 = 6; l10 <= 12.0001; l10 += 0.05) {
    const r = remnantAtLog10(l10, h, exact);
    if (r > bestR) {
      bestR = r;
      bestL10 = l10;
    }
  }
  let lo = bestL10 - 0.1;
  let hi = bestL10 + 0.1;
  for (let iter = 0; iter < 80; iter++) {
    const m1 = lo + (hi - lo) / 3;
    const m2 = hi - (hi - lo) / 3;
    if (remnantAtLog10(m1, h, exact) < remnantAtLog10(m2, h, exact)) lo = m1;
    else hi = m2;
  }
  const log10N = (lo + hi) / 2;
  return {
    log10N: +log10N.toFixed(5),
    height: +remnantAtLog10(log10N, h, exact).toFixed(8),
  };
}

const STENCILS = [1.0002, 1.00005, 1.00001, 1.000002];
const STENCIL_LADDER = STENCILS.map((h) => {
  const p = locatePeak(h, false);
  return { h, log10N: p.log10N, height: p.height };
});
const EXACT_PEAK = locatePeak(null, true);

// Height spread across the whole ladder including the exact limit (the stencil-invariance meter).
const ALL_HEIGHTS = STENCIL_LADDER.map((r) => r.height).concat(EXACT_PEAK.height);
const HEIGHT_SPREAD = Math.max(...ALL_HEIGHTS) - Math.min(...ALL_HEIGHTS);
const ALL_LOG10N = STENCIL_LADDER.map((r) => r.log10N).concat(EXACT_PEAK.log10N);
const LOG10N_SPREAD = Math.max(...ALL_LOG10N) - Math.min(...ALL_LOG10N);

// Cross-check: at h = 1.0002 the fd exponent already agrees with the exact derivative to < 1e-6,
// which is WHY the remnant is stencil-invariant (the stencil error is far below the ~0.003 remnant).
const FD_VS_EXACT_AT_PEAK = Math.abs(
  fdExponent(EXACT_PEAK ? Math.pow(10, 7.8586) : 0, 1.0002) - exactExponent(Math.pow(10, 7.8586)),
);

export const IMP35397_EFLOW_FARTAIL_REMNANT_STENCIL_REFINEMENT = {
  id: 'imp-35397',
  proofSection: 'S-frontier',
  question:
    'Does the imp-35377 interior maximum of the imp-35280 fd-vs-analytic E_flow far-tail ' +
    'remnant SURVIVE a tighter central-difference step than h = 1.0002, and does it converge ' +
    'as h -> 1 (down to the exact closed-form derivative)?',
  method:
    'Re-locate the interior peak (0.05-decade scan + 80-round ternary bisection in log10 N, ' +
    'identical to imp-35377) on the fd-vs-analytic remnant |analytic - fd-surrogate| over a ' +
    'ladder of tightening stencils h = 1.0002 -> 1.000002, and at the h -> 1 limit using the ' +
    'EXACT closed-form d(log E_flow)/d(log N) = (1 - 1/u)[1/(u - log u + 1) + 1/L - 1] instead ' +
    'of any finite difference (surrogate channel only; no effectiveHeightForN, hence no heavy import).',
  stencilLadder: STENCIL_LADDER,
  exactPeak: EXACT_PEAK,
  heightSpread: +HEIGHT_SPREAD.toExponential(2),
  log10nSpread: +LOG10N_SPREAD.toFixed(5),
  fdVsExactExponentAtPeak: +FD_VS_EXACT_AT_PEAK.toExponential(2),
  finding: {
    F1_height_stencil_invariant:
      'The interior-peak height is IDENTICAL to eight significant figures (0.00324280) across ' +
      'the whole stencil ladder h = 1.0002 / 1.00005 / 1.00001 / 1.000002 AND at the exact ' +
      'h -> 1 closed-form derivative: the height spread over all five channels is below 1e-8. ' +
      'The maximum does not move in height when the stencil tightens.',
    F2_argmax_stencil_invariant:
      'The argmax stays pinned at log10 N* = 7.8586 +/- 4e-4 across all stencils (7.85867 / ' +
      '7.85859 / 7.85901 / 7.85826 and the exact-limit 7.85858). The tiny 5th-decimal jitter is ' +
      'ternary-bisection noise on the very flat crown, NOT stencil sensitivity -- the whole ' +
      'spread is under 8e-4 decade and shows no monotone drift with h.',
    F3_why_invariant:
      'Already at h = 1.0002 the finite-difference exponent agrees with the exact closed-form ' +
      'derivative to < 1e-6 at the crown, far below the ~0.003 remnant, so the remnant is ' +
      'dominated by the analytic Taylor-truncation of -1 + 3/log N and is essentially independent ' +
      'of the stencil -- which is why every tighter step and the exact limit land on the same peak.',
    F4_closes_imp35397:
      'Together with imp-35377 (finer N grid) this answers both halves of the imp-35397 ticket: ' +
      'the imp-35280 non-monotone remnant reading is a GENUINE interior maximum near N ~ 7.2e7 ' +
      '(coarsely "near 1e9"), robust to both grid refinement and stencil refinement -- neither a ' +
      'four-decimal read artifact nor a central-difference-stencil artifact. This REFINES the ' +
      'imp-35377 honestStatus caveat that a different stencil would shift the crown: it does not.',
  },
  isRigorous: false,
  honestStatus:
    'The imp-35280 fd-vs-analytic E_flow far-tail remnant interior maximum (imp-35377: log10 N* ~= ' +
    '7.8586, height 0.003243) is STENCIL-INVARIANT: refining the central-difference step from ' +
    'h = 1.0002 down to h = 1.000002, and all the way to the exact h -> 1 closed-form derivative, ' +
    'leaves the peak height unchanged to eight significant figures and the argmax pinned to log10 ' +
    'N* = 7.8586 +/- 4e-4. This closes the tighter-stencil half of imp-35397 and refines the imp-35377 ' +
    'caveat that a different stencil would shift the crown -- it does not. Height and location remain ' +
    'surrogate-channel quantities on the inherited imp-3220/imp-3406 extrapolation. Measurement only; ' +
    'changes no bound; NO QED.',
  verdict:
    'MEASUREMENT ONLY (frontier-direction, NOT rigorous). The imp-35377 interior maximum of the ' +
    'imp-35280 fd-vs-analytic remnant SURVIVES stencil refinement: peak height 0.00324280 is ' +
    'identical to eight significant figures across h = 1.0002 / 1.00005 / 1.00001 / 1.000002 and ' +
    'the exact h -> 1 closed-form derivative, and the argmax stays at log10 N* = 7.8586 +/- 4e-4 ' +
    '(5th-decimal jitter is bisection noise on the flat crown, not stencil drift). With imp-35377 ' +
    '(finer N grid) this answers both halves of the imp-35397 grid/stencil question: the imp-35280 ' +
    'non-monotone reading is a genuine interior max, neither a four-decimal read artifact nor a ' +
    'stencil artifact. Measurement only on the inherited imp-3220/imp-3406 surrogate, NOT a rigorous ' +
    'asymptotic; E_flow > 0 strictness (imp-33848) untouched; C_mb GUE-conditional per imp-486 ' +
    'UNTOUCHED; E_coll far-tail exponent 1/2 per imp-3463; imp-3066 K_a >= 0 untouched; changes no ' +
    'bound; no operator positivity; no RH verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-35377 (finer-N-grid peak location, stencil caveat closed here); imp-35280 (coarse three-point ' +
    'ladder); imp-35371 (same remnant, deep extension, pure-Math channel); imp-35198 (analytic ' +
    '-1 + 3/log N); imp-35135 (far-tail E_flow quantity); imp-486 (C_mb GUE-conditional, UNTOUCHED).',
};

export const IMP35397_EFLOW_FARTAIL_REMNANT_STENCIL_REFINEMENT_ASSERTIONS = [
  {
    // Reproduce the imp-35377 h = 1.0002 peak (log10 N* ~= 7.8587, height ~0.003243).
    id: 'imp35397-reproduces-imp35377-peak',
    description: 'the h = 1.0002 peak reproduces the imp-35377 argmax ~7.8587 and height ~0.003243',
    holds: () => {
      const base = STENCIL_LADDER.find((r) => r.h === 1.0002);
      return (
        Math.abs(base.log10N - 7.8587) < 0.01 && Math.abs(base.height - 0.003243) < 1e-5
      );
    },
  },
  {
    // The peak HEIGHT is stencil-invariant: spread over all five channels below 1e-7.
    id: 'imp35397-height-stencil-invariant',
    description: 'the peak height is identical across all stencils and the exact limit to < 1e-7',
    holds: () => HEIGHT_SPREAD < 1e-7,
  },
  {
    // The ARGMAX is stencil-invariant: spread under 1e-3 decade, no monotone stencil drift.
    id: 'imp35397-argmax-stencil-invariant',
    description: 'the argmax log10 N* stays within a < 1e-3-decade band across all stencils',
    holds: () => LOG10N_SPREAD < 1e-3 && ALL_LOG10N.every((l) => Math.abs(l - 7.8586) < 1e-3),
  },
  {
    // The exact h -> 1 derivative lands on the same peak as the finite-difference stencils.
    id: 'imp35397-exact-limit-matches-fd',
    description: 'the exact closed-form-derivative peak matches the fd stencil peaks in height and location',
    holds: () =>
      Math.abs(EXACT_PEAK.height - STENCIL_LADDER[0].height) < 1e-7 &&
      Math.abs(EXACT_PEAK.log10N - 7.8586) < 1e-3,
  },
  {
    // WHY invariant: fd exponent already agrees with the exact derivative to < 1e-6 at the crown.
    id: 'imp35397-fd-agrees-exact-below-remnant',
    description: 'at h = 1.0002 the fd exponent agrees with the exact derivative to < 1e-6, far below ~0.003',
    holds: () => FD_VS_EXACT_AT_PEAK < 1e-6,
  },
  {
    // Honesty gate: measurement only, no bound change, no QED, no refereed bound is changed.
    id: 'imp35397-honesty-gate-no-qed',
    description: 'Measurement only: isRigorous false, no QED, no refereed bound is changed',
    holds: () =>
      IMP35397_EFLOW_FARTAIL_REMNANT_STENCIL_REFINEMENT.isRigorous === false &&
      /NO QED/.test(IMP35397_EFLOW_FARTAIL_REMNANT_STENCIL_REFINEMENT.verdict) &&
      /refereed bound is changed/i.test(IMP35397_EFLOW_FARTAIL_REMNANT_STENCIL_REFINEMENT.verdict),
  },
];

for (const a of IMP35397_EFLOW_FARTAIL_REMNANT_STENCIL_REFINEMENT_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-35397-eflow-fartail-remnant-stencil-refinement assertion failed: ${a.id}`,
    );
  }
}

export default IMP35397_EFLOW_FARTAIL_REMNANT_STENCIL_REFINEMENT;
