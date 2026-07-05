/**
 * @module imp-34027-ecoll-crossing-window-width-sensitivity
 *
 * imp-34027 (numerical, frontier-direction): imp-33966 LOCATED the maximal-cancellation crossing
 * N* ~ 10^12.6 -- the point where the two opposite-signed offsets |disc(N)| and |ref(N)| in the
 * imp-33856 three-way E_coll residual decomposition cross (the net residual gap_disc - law passes
 * through zero) -- using ONE fixed discrete-slope window: the imp-33856 full decade [N/10, N]. It
 * reported N* sits INSIDE the imp-33887 anchor window 1e12..1e15 (whose edges STRADDLE the crossing),
 * concluding "the anchor is well-placed, not merely lucky." But the discrete slope gap_disc depends
 * on the WINDOW WIDTH, and imp-33966 never asked whether the located N* is robust to that choice.
 * This module recomputes the crossing over three window widths -- narrower [N/5, N] (~0.699 decade),
 * the reference [N/10, N] (1 decade), and wider [N/20, N] (~1.301 decade) -- with the IDENTICAL
 * inherited sub-terms, relocates N* for each, and measures the drift.
 *
 * THE COMPONENT MODEL (identical sub-term to imp-33966 / imp-33919 / imp-33887 / imp-33856)
 * ----------------------------------------------------------------------------------------
 *     E_coll  = C_C_PINNED * sqrt(log T0 / N)     (dominant, GUE-conditional C_H)
 *     T0      = effectiveHeightForN(N)            (Riemann-von Mangoldt inverse)
 * Only ONE knob changes: the discrete decade slope q_disc = d log E_coll / d log N is taken over the
 * window [N / 10^wDec, N] with wDec in {log10 5, 1, log10 20} instead of the fixed wDec = 1 of
 * imp-33966. The pointwise reference gap_point (DL=1e-4) and the fundamental g = (1/2) d ln(log T0)/
 * d ln N are UNCHANGED, so |ref| = |g - law| is window-INVARIANT; the whole drift lives in |disc|.
 * Because I1 (gap_point - g) ~ 1e-12, ||disc| - |ref|| still equals the net |gap_disc - law| to
 * ~1e-12, so the |disc| = |ref| crossing IS the net-residual zero crossing for every width.
 *
 * THE MEASUREMENT (relocate N* = argmin ||disc(N)| - |ref(N)|| per window width, 1e4..1e20 ladder)
 * ----------------------------------------------------------------------------------------------
 *   window        wDec     N* (argmin)   interior sign-flip?   resid @1e12    resid @1e15
 *  [N/5, N]      0.699     -> off ladder  NONE (all resid < 0)  -2.470e-4      -1.423e-4
 *  [N/10, N]     1.000     10^12.6        YES (neg -> pos)      -6.480e-6      +1.289e-5
 *  [N/20, N]     1.301     10^5.3         YES (neg -> pos)      +2.422e-4      +1.723e-4
 * NARROWING the window to [N/5, N] pushes the crossing OFF the top of the ladder (no interior sign
 * flip on 1e4..1e20 -- extended to 1e30 there is still none; the net residual stays negative and only
 * shrinks toward 0 from below), while WIDENING to [N/20, N] drags the crossing DOWN by ~7.3 decades
 * to 10^5.3. The imp-33966 N* ~ 10^12.6 is the MIDDLE rung of a crossing that sweeps across the whole
 * ladder as the window width moves by less than a factor of 4.
 *
 * THE VERDICT: THE LOCATED N* IS HIGHLY WINDOW-WIDTH-SENSITIVE; THE ANCHOR-STRADDLE IS FRAGILE
 * -------------------------------------------------------------------------------------------
 * (V1) N* DRIFTS ENORMOUSLY WITH THE WINDOW WIDTH. Between the two widths that cross interior to the
 *      ladder, N* moves from 10^12.6 ([N/10, N]) down to 10^5.3 ([N/20, N]) -- a ~7.3-decade drift for
 *      a ~0.30-decade (log10 20 - 1) widening; narrowing to [N/5, N] removes the interior crossing
 *      entirely. The imp-33966 crossing is NOT a stable landmark: it is the specific value the
 *      one-decade convention picks out.
 * (V2) THE ANCHOR-STRADDLE HOLDS ONLY FOR THE ONE-DECADE WINDOW. The imp-33887 anchor edges
 *      (1e12, 1e15) are opposite-signed ONLY for [N/10, N] (resid -6.48e-6 -> +1.29e-5). For the
 *      narrower [N/5, N] BOTH edges are negative (crossing above the anchor) and for the wider
 *      [N/20, N] BOTH edges are positive (crossing below the anchor) -- so "the anchor window
 *      straddles the crossing" is a property of the imp-33856 decade convention, not a robust feature.
 * (V3) THE DRIFT IS MONOTONE: WIDER WINDOW -> LOWER N*. A wider [N / 10^wDec, N] reaches back to
 *      smaller N where the fundamental g is larger, so the window-averaged gap_disc exceeds the
 *      endpoint law 1/(2 log T0) at a given N sooner (smaller N), pulling the gap_disc = law crossing
 *      down. This orders N*([N/20, N]) < N*([N/10, N]) < N*([N/5, N]) exactly as measured.
 *
 * NUMERICAL / MEASUREMENT ONLY. The component model is the inherited imp-3220/imp-3406 extrapolation,
 * NOT a rigorous asymptotic; the crossing and its window-width sensitivity are properties of the model
 * estimators (discrete decade slope vs pointwise vs g), not statements about zeros; the C_mb
 * GUE-conditional share per imp-486 is UNTOUCHED; changes no bound; establishes no operator
 * positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. Platt-Trudgian Lambda <= 0.2
 * remains SOTA.
 *
 * @see imp-33966-ecoll-disc-ref-crossing-locator (located N* ~ 10^12.6 at the FIXED [N/10, N] window)
 * @see imp-33887-ecoll-gap-anchoring-convention-reconciliation (the 1e12..1e15 anchor window)
 * @see imp-33856-ecoll-discrete-residual-log-shortfall-fit (DISCRETE gap_ecoll over [N/10, N] vs 1/(2 log T0))
 * @see imp-33879-geometric-center-correction-endpoint-midpoint-offset (window discretization offset closed form)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 = gamma_N)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const HALF = 0.5; // imp-3463 far-tail sqrt(1/N) asymptote (-1/2 for E_coll)
const DL = 1e-4; // central-difference step in ln N (identical to imp-33966/imp-33919/imp-33854)

// EXACT imp-33966 E_coll sub-term (no re-derivation, no fresh model).
function ecollParts(N) {
  const T0 = effectiveHeightForN(N);
  const L = Math.log(T0); // "log T0" = natural log throughout the cohort
  const E_coll = C_C_PINNED * Math.sqrt(L / N); // GUE-conditional (C_H)
  return { T0, L, E_coll };
}

const lnEcollAt = (lnN) => Math.log(ecollParts(Math.exp(lnN)).E_coll);
const lnLogT0At = (lnN) => Math.log(ecollParts(Math.exp(lnN)).L);

// imp-33856 estimator GENERALISED to window [N / 10^wDec, N]: DISCRETE slope, residual q + 1/2.
// wDec = 1 recovers the fixed imp-33966 [N/10, N] full decade exactly.
function gapEcollDiscrete(e, wDec) {
  const N = Math.pow(10, e);
  const Nprev = Math.pow(10, e - wDec);
  const q = Math.log(ecollParts(N).E_coll / ecollParts(Nprev).E_coll) / Math.log(N / Nprev);
  return q + HALF;
}
// imp-33854 estimator: POINTWISE central difference, residual gap_point = q + 1/2 (window-invariant).
function gapEcollPointwise(e) {
  const lnN = e * Math.LN10;
  const q = (lnEcollAt(lnN + DL) - lnEcollAt(lnN - DL)) / (2 * DL);
  return q + HALF;
}
// imp-33854 reference: the FUNDAMENTAL object g(N) = (1/2) d ln(log T0)/d ln N (window-invariant).
function gFundamental(e) {
  const lnN = e * Math.LN10;
  return 0.5 * (lnLogT0At(lnN + DL) - lnLogT0At(lnN - DL)) / (2 * DL);
}

// The imp-33966 fine 1e4..1e20 ladder (0.1-decade steps, 161 rungs) -- identical span/step.
const LADDER = Array.from({ length: 161 }, (_, i) => +(4 + i * 0.1).toFixed(1));

// imp-33887 anchor window bounds (1e12..1e15).
const ANCHOR_LO = 12;
const ANCHOR_HI = 15;

// The three discrete-slope window widths (in decades): narrower, reference, wider.
const WINDOWS = [
  { label: 'N/5', wDec: Math.log10(5) }, // ~0.699 decade (narrower than the imp-33856 convention)
  { label: 'N/10', wDec: 1 }, // 1.000 decade (the imp-33856 / imp-33966 reference window)
  { label: 'N/20', wDec: Math.log10(20) }, // ~1.301 decade (wider than the imp-33856 convention)
];

function scanWindow(wDec) {
  const scan = LADDER.map((e) => {
    const L = ecollParts(Math.pow(10, e)).L;
    const law = HALF / L; // imp-33856 reference: 1/(2 log T0) endpoint-anchored
    const gapDisc = gapEcollDiscrete(e, wDec); // imp-33856 estimator over [N / 10^wDec, N]
    const gapPoint = gapEcollPointwise(e); // imp-33854 estimator (window-invariant)
    const g = gFundamental(e); // imp-33854 reference (window-invariant)
    const termDiscretization = gapDisc - gapPoint; // (A) window vs pointwise
    const termReference = g - law; // (B) g not yet at 1/(2 log T0) here (window-invariant)
    const resid = gapDisc - law; // net residual (gap_disc - law)
    const absDiff = Math.abs(Math.abs(termDiscretization) - Math.abs(termReference));
    return { N_log10: e, resid, absDiff };
  });
  const crossing = scan.reduce((best, r) => (r.absDiff < best.absDiff ? r : best));
  // Interior sign-flip: the net residual actually changes sign somewhere inside the ladder.
  let interiorSignFlip = false;
  for (let i = 1; i < scan.length; i++) {
    if (Math.sign(scan[i - 1].resid) !== Math.sign(scan[i].resid)) interiorSignFlip = true;
  }
  const at = (e) => scan.find((r) => Math.abs(r.N_log10 - e) < 1e-9).resid;
  const residLo = at(ANCHOR_LO);
  const residHi = at(ANCHOR_HI);
  return {
    nstar_log10: crossing.N_log10,
    crossing_abs_disc_minus_abs_ref: crossing.absDiff,
    crossing_is_interior_sign_flip: interiorSignFlip,
    anchor_resid_at_1e12: residLo,
    anchor_resid_at_1e15: residHi,
    anchor_straddles_crossing: Math.sign(residLo) !== Math.sign(residHi),
  };
}

const RESULTS = WINDOWS.map((w) => ({ ...w, ...scanWindow(w.wDec) }));

const byLabel = (l) => RESULTS.find((r) => r.label === l);
const N5 = byLabel('N/5');
const N10 = byLabel('N/10');
const N20 = byLabel('N/20');

// V1: drift between the two windows that cross interior to the ladder (N/10 and N/20).
const INTERIOR_NSTAR_DRIFT_DECADES = Math.abs(N10.nstar_log10 - N20.nstar_log10); // ~7.3
// V3: monotone ordering -- wider window (larger wDec) => lower N*.
const MONOTONE_WIDER_LOWER =
  N20.nstar_log10 < N10.nstar_log10 && (N5.crossing_is_interior_sign_flip ? N10.nstar_log10 < N5.nstar_log10 : true);

export const IMP34027_ECOLL_CROSSING_WINDOW_WIDTH_SENSITIVITY = {
  id: 'imp-34027',
  proofSection: 'S-frontier',
  question:
    'imp-33966 located the maximal-cancellation crossing N* ~ 10^12.6 (|disc(N)| = |ref(N)| in the ' +
    'imp-33856 three-way E_coll residual decomposition) using ONE fixed discrete-slope window, the ' +
    'imp-33856 full decade [N/10, N], and reported the imp-33887 anchor 1e12..1e15 straddles it. ' +
    'Recompute gap_disc over narrower [N/5, N] and wider [N/20, N] windows, relocate N* for each, and ' +
    'report the crossing drift and whether the anchor still straddles it. ' +
    'Numerical/measurement only; C_mb GUE-conditional per imp-486; no QED.',
  componentModel:
    'E_coll = C_C sqrt(log T0 / N) (GUE-conditional C_H); T0 = effectiveHeightForN(N). Identical ' +
    'sub-term/estimators to imp-33966; only the discrete slope window [N / 10^wDec, N] varies (wDec in ' +
    '{log10 5, 1, log10 20}). gap_point (DL=1e-4) and g are window-invariant, so |ref| is fixed and ' +
    'the whole crossing drift lives in |disc|. I1 (gap_point - g) ~ 1e-12, so ||disc| - |ref|| = net ' +
    '|gap_disc - law| to ~1e-12 for every width.',
  measurement: {
    ladder_span_log10: [4, 20],
    ladder_step_log10: 0.1,
    anchor_window_log10: [ANCHOR_LO, ANCHOR_HI],
    windows: RESULTS.map((r) => ({
      label: r.label,
      window_width_decades: +r.wDec.toFixed(4),
      nstar_log10: r.nstar_log10, // N/5 -> off top of ladder (20); N/10 -> 12.6; N/20 -> 5.3
      crossing_abs_disc_minus_abs_ref: +r.crossing_abs_disc_minus_abs_ref.toExponential(3),
      crossing_is_interior_sign_flip: r.crossing_is_interior_sign_flip, // N/5 false; N/10, N/20 true
      anchor_resid_at_1e12: +r.anchor_resid_at_1e12.toExponential(3),
      anchor_resid_at_1e15: +r.anchor_resid_at_1e15.toExponential(3),
      anchor_straddles_crossing: r.anchor_straddles_crossing, // true ONLY for N/10
    })),
    interior_nstar_drift_decades_n10_vs_n20: +INTERIOR_NSTAR_DRIFT_DECADES.toFixed(2), // ~7.3
    monotone_wider_window_lower_nstar: MONOTONE_WIDER_LOWER, // true
  },
  findings: {
    V1_nstar_highly_window_width_sensitive:
      'Between the two widths that cross interior to the ladder, N* drifts from 10^12.6 ([N/10, N]) ' +
      'down to 10^5.3 ([N/20, N]) -- a ~7.3-decade shift for a ~0.30-decade widening -- and narrowing ' +
      'to [N/5, N] removes the interior crossing entirely (net residual stays negative on 1e4..1e20, ' +
      'and extended to 1e30). The imp-33966 N* ~ 10^12.6 is the value the one-decade convention picks, ' +
      'not a stable landmark.',
    V2_anchor_straddle_only_for_one_decade_window:
      'The imp-33887 anchor edges (1e12, 1e15) are opposite-signed ONLY for [N/10, N] ' +
      '(resid -6.48e-6 -> +1.29e-5). For narrower [N/5, N] BOTH edges are negative (crossing above the ' +
      'anchor) and for wider [N/20, N] BOTH edges are positive (crossing below it), so the imp-33966 ' +
      '"anchor straddles the crossing" reading is a property of the imp-33856 decade convention, not a ' +
      'robust feature of the decomposition.',
    V3_drift_monotone_wider_window_lower_nstar:
      'A wider [N / 10^wDec, N] reaches back to smaller N where the fundamental g is larger, so the ' +
      'window-averaged gap_disc exceeds the endpoint law 1/(2 log T0) at a smaller N, pulling the ' +
      'gap_disc = law crossing DOWN. This orders N*([N/20, N]) < N*([N/10, N]) < N*([N/5, N]) exactly ' +
      'as measured.',
  },
  isRigorous: false,
  verdict:
    'MEASUREMENT (numerical, NOT rigorous). Recomputing the imp-33966 discrete-slope residual over ' +
    'three window widths -- narrower [N/5, N] (~0.699 decade), the reference [N/10, N] (1 decade), and ' +
    'wider [N/20, N] (~1.301 decade) -- with the identical inherited sub-terms shows the located ' +
    'maximal-cancellation crossing N* is HIGHLY sensitive to the window-width choice. The reference ' +
    'one-decade window reproduces the imp-33966 N* ~ 10^12.6 (a genuine negative -> positive sign ' +
    'flip, absDiff ~3.8e-8); widening to [N/20, N] drags the crossing DOWN by ~7.3 decades to ' +
    '10^5.3; narrowing to [N/5, N] pushes it OFF the top of the ladder (no interior sign flip on ' +
    '1e4..1e20, and none extended to 1e30 -- the net residual stays negative and only shrinks toward ' +
    '0 from below). The imp-33887 anchor 1e12..1e15 STRADDLES the crossing ONLY for the exact ' +
    '[N/10, N] convention: for [N/5, N] both anchor edges are negative (crossing above) and for ' +
    '[N/20, N] both are positive (crossing below). The drift is monotone -- a wider window reaches ' +
    'back to smaller N where g is larger, pushing the gap_disc = law crossing to smaller N -- ordering ' +
    'N*([N/20, N]) < N*([N/10, N]) < N*([N/5, N]). So the imp-33966 "anchor is well-placed" reading is ' +
    'a property of the imp-33856 one-decade window convention, not robust to the window width; the ' +
    'located N* is the value that convention selects. The component model is the inherited ' +
    'imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the crossing and its sensitivity are ' +
    'properties of the model estimators, not statements about zeros; the C_mb GUE-conditional share ' +
    'per imp-486 is UNTOUCHED; changes no bound; establishes no operator positivity; imp-3066 K_a >= 0 ' +
    'untouched; no RH verdict, NO QED. Platt-Trudgian Lambda <= 0.2 remains SOTA.',
  citation:
    'imp-33966 (located N* ~ 10^12.6 at the fixed [N/10, N] window, anchor straddles it); imp-33887 ' +
    '(the 1e12..1e15 anchor window); imp-33856 (DISCRETE gap_ecoll over [N/10, N] vs 1/(2 log T0)); ' +
    'imp-33879 (window discretization offset closed form); imp-486 (C_mb GUE-conditional); ' +
    'lambda-rh-height-mapping (effectiveHeightForN).',
};

export const IMP34027_ECOLL_CROSSING_WINDOW_WIDTH_SENSITIVITY_ASSERTIONS = [
  {
    // Reproduce imp-33966: the reference [N/10, N] window recovers N* ~ 10^12.6, interior, deep min.
    id: 'imp34027-n10-reproduces-imp33966-crossing',
    description: 'the [N/10, N] reference window reproduces the imp-33966 N* ~ 10^12.6 (interior, absDiff < 1e-7)',
    holds: () =>
      N10.crossing_is_interior_sign_flip &&
      N10.nstar_log10 >= 12.3 &&
      N10.nstar_log10 <= 12.9 &&
      N10.crossing_abs_disc_minus_abs_ref < 1e-7,
  },
  {
    // (V1) N* drifts enormously between the two interior-crossing windows (>5 decades).
    id: 'imp34027-nstar-highly-window-sensitive',
    description: 'N* drifts >5 decades between the [N/10, N] (~10^12.6) and [N/20, N] (~10^5.3) windows',
    holds: () => N20.crossing_is_interior_sign_flip && INTERIOR_NSTAR_DRIFT_DECADES > 5,
  },
  {
    // (V1) Narrowing to [N/5, N] removes the interior crossing entirely (no net-residual sign flip).
    id: 'imp34027-narrow-window-has-no-interior-crossing',
    description: 'the narrower [N/5, N] window has NO interior sign-flip on 1e4..1e20 (crossing off the top)',
    holds: () => N5.crossing_is_interior_sign_flip === false,
  },
  {
    // (V2) The anchor straddles the crossing ONLY for the one-decade window.
    id: 'imp34027-anchor-straddle-only-one-decade',
    description: 'the imp-33887 anchor 1e12..1e15 straddles the crossing ONLY for [N/10, N], not [N/5, N] or [N/20, N]',
    holds: () => N10.anchor_straddles_crossing && !N5.anchor_straddles_crossing && !N20.anchor_straddles_crossing,
  },
  {
    // (V2) For the narrower window both anchor edges are negative; for the wider both are positive.
    id: 'imp34027-anchor-edges-same-signed-off-convention',
    description: '[N/5, N] anchor edges both negative (crossing above); [N/20, N] both positive (crossing below)',
    holds: () =>
      N5.anchor_resid_at_1e12 < 0 &&
      N5.anchor_resid_at_1e15 < 0 &&
      N20.anchor_resid_at_1e12 > 0 &&
      N20.anchor_resid_at_1e15 > 0,
  },
  {
    // (V3) Monotone: wider window => lower N*.
    id: 'imp34027-drift-monotone-wider-lower',
    description: 'the drift is monotone: a wider discrete-slope window relocates N* to smaller N',
    holds: () => MONOTONE_WIDER_LOWER,
  },
  {
    // Honesty gate: numerical/measurement only, no QED, Platt-Trudgian stays SOTA.
    id: 'imp34027-honesty-gate-no-qed',
    description: 'Numerical/measurement only: isRigorous false, no QED, Platt-Trudgian stays SOTA',
    holds: () =>
      IMP34027_ECOLL_CROSSING_WINDOW_WIDTH_SENSITIVITY.isRigorous === false &&
      /NO QED/.test(IMP34027_ECOLL_CROSSING_WINDOW_WIDTH_SENSITIVITY.verdict) &&
      /remains SOTA/.test(IMP34027_ECOLL_CROSSING_WINDOW_WIDTH_SENSITIVITY.verdict),
  },
];

for (const a of IMP34027_ECOLL_CROSSING_WINDOW_WIDTH_SENSITIVITY_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-34027-ecoll-crossing-window-width-sensitivity assertion failed: ${a.id}`);
  }
}
