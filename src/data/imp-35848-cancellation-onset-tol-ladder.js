/**
 * @module imp-35848-cancellation-onset-tol-ladder
 *
 * imp-35810 pinned the Krawczyk float-cancellation onset height for a SINGLE tolerance (tol = 1e-6): the
 * height at which the naively-evaluated ratio R_measured = -dFP/dG (via the cancellation-carrying
 * dG = S_inf (M_G - 1)) first sustains a relative departure above tol from the cancellation-free
 * R_clean = 2 (aLo/a)(1-a)/(1-aLo). It then asserted (C2) that the measured onset a matches the closed-form
 * envelope a_onset ~ eps_mach / tol and (C3) that the PT-anchor safety margin is "not sensitive" to tol across
 * 1e-4..1e-8 -- BUT both claims were reported only qualitatively ("to within an order of magnitude",
 * "not sensitive"). The tol ladder was never tabulated.
 *
 * THIS MODULE tabulates the ladder. It reuses the imp-35810 machinery VERBATIM (identical K, delta, S_inf,
 * aOf, the two-evaluation measure(), and the sustained-3-point crossing rule) and re-locates the onset for
 * each tol in {1e-4, 1e-5, 1e-6, 1e-7, 1e-8}. For each rung it records N_onset(tol), a_onset(tol),
 * |dG_onset|(tol), the PT safety margin a_onset / a_PT, and the residual ratio a_onset / (eps_mach / tol)
 * between the measured onset a and the closed-form envelope.
 *
 * WHAT THE LADDER SHOWS
 * ---------------------
 *   (L1) THE ENVELOPE MATCH IS ORDER-OF-MAGNITUDE, SYSTEMATICALLY BELOW UNITY. The measured a_onset tracks
 *        eps_mach / tol at every rung with a residual ratio a_onset / (eps_mach / tol) in [~0.11, ~0.49]
 *        (spread ~4.5x, attributable to the log-grid STEP quantizing where the sustained-3-point crossing
 *        lands). The ratio is systematically < 1 because the sustained-crossing rule fixes the onset just PAST
 *        the nominal threshold (a slightly smaller). This CONFIRMS the imp-35810 (C2) "within an order of
 *        magnitude" reading at every tol -- it does not beat it -- and quantifies the residual as an O(0.1-0.5)
 *        under-shoot of the closed-form envelope, not a sign of a genuine break.
 *   (L2) THE PT MARGIN ERODES ~ONE DECADE PER TOL DECADE. Reliability grows with larger a (further from the
 *        M_G - 1 cancellation), so the anchor margin is a_PT / a_onset. Since a_PT is fixed (the anchor does
 *        not move) and a_onset ~ eps_mach / tol, the margin falls by ~10x for each 10x TIGHTENING of tol --
 *        from ~2.5e7 at tol=1e-4 down to ~1.1e3 at tol=1e-8 (~4.3 decades of a). Even the STRICTEST rung leaves
 *        the anchor >1000x more reliable than the onset threshold, so the imp-35810 (C3) tol-robustness reading
 *        holds, and the ladder QUANTIFIES exactly how the margin erodes.
 *   (L3) THE ONSET STAYS FAR ABOVE THE PT ANCHOR AT EVERY RUNG. N_onset > 1e17 for four of the five
 *        tolerances (tol down to 1e-7); at the strictest tol = 1e-8 it drops to N ~ 1.4e16 -- still ~3
 *        decades above the anchor N(T_PT) ~ 1.236e13, which never approaches the reliable-regime boundary.
 *
 * MEASUREMENT ONLY on the inherited imp-3220/imp-3406 surrogate; reuses the imp-35266/imp-35766/imp-34996/
 * imp-35810 machinery verbatim (identical K, delta, S_inf, aOf, measure). The imp-34714a machine certificate
 * REMAINS OPEN; F(m) = 0 stays a double-precision artifact; C_C = 1/8 (imp-2642/2643) UNTOUCHED; C_mb
 * GUE-conditional per imp-486 UNTOUCHED; changes no bound; establishes no operator positivity; no RH verdict,
 * NO QED. No refereed bound is changed.
 *
 * @see imp-35810-cancellation-onset-height (single-tol onset; C2/C3 asserted qualitatively)
 * @see imp-35766-krawczyk-cancellation-ratio-beyond-band (B3 flagged the float-cancellation artifact)
 * @see imp-35266-krawczyk-headroom-surplus-decomposition (the 2:1 split -dFP/dG ~ 2.00042)
 * @see imp-34996-krawczyk-headroom-safety-factor-asymptote (S_inf = 1/(2 delta) floor)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 RvM inverse; zeroCountAtHeight: forward N(T))
 */

import { effectiveHeightForN, zeroCountAtHeight } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3406/imp-33582)
const K_AMPL = (C_C_PINNED / E_TRUNC_PT) ** 2; // ~1.5727e8 (identical K to imp-35266/imp-35766/imp-35810)
const DELTA = 2e-4; // the fixed imp-34774/34776/34799 relative bracket half-width
const S_INF = 1 / (2 * DELTA); // 2500 exactly (imp-34996 large-N floor)
const T_PT = 3e12; // Platt-Trudgian verified-zero anchor height

const aOf = (N) => {
  const T = effectiveHeightForN(N);
  const u = Math.log(T / TWO_PI);
  return (TWO_PI * K_AMPL) / (T * u);
};

// Two evaluations of the SAME exact ratio R = -dFP/dG = 2 (aLo/a)(1-a)/(1-aLo) -- imp-35810 measure() verbatim.
function measure(N) {
  const a = aOf(N);
  const G = 1 - a;
  const aLo = aOf(N * (1 - DELTA));
  const M_G = (2 * G) / (1 + G); // ~ 1, rounded to ~0.5 ULP absolute
  const dG = S_INF * (M_G - 1); // cancellation route: |M_G - 1| = a/(2-a) -> 0
  const dFP = S_INF * M_G * (aLo / (1 - aLo)); // = S_inf . M_G . (M_FP - 1)
  const R_measured = -dFP / dG; // carries relative error ~ eps_mach / a
  const R_clean = (2 * (aLo / a) * (1 - a)) / (1 - aLo); // cancellation-free reference
  const depart = Math.abs(R_measured - R_clean) / Math.abs(R_clean);
  return { N, a, dG, R_measured, R_clean, depart };
}

// Single log-spaced scan (departure does NOT depend on tol -- only the crossing threshold does).
const LOG_MIN = 13;
const LOG_MAX = 21;
const STEP = 0.05;
const SCAN = [];
for (let L = LOG_MIN; L <= LOG_MAX + 1e-9; L += STEP) SCAN.push(measure(Math.pow(10, L)));

// The PT anchor (fixed across the ladder).
const N_PT = zeroCountAtHeight(T_PT); // ~1.2362e13
const PT = measure(N_PT);
const A_PT = PT.a;

// sustained-3-point crossing (imp-35810 rule) for a given tolerance.
function locateOnset(tol) {
  let idx = -1;
  for (let i = 0; i < SCAN.length - 2; i++) {
    if (SCAN[i].depart > tol && SCAN[i + 1].depart > tol && SCAN[i + 2].depart > tol) {
      idx = i;
      break;
    }
  }
  if (idx < 0) return null;
  const onset = SCAN[idx];
  const a_theory = Number.EPSILON / tol; // closed-form envelope onset a ~ eps_mach / tol
  return {
    tol,
    N_onset: +onset.N.toPrecision(6),
    a_onset: +onset.a.toExponential(4),
    abs_dG_onset: +Math.abs(onset.dG).toExponential(4),
    depart_onset: +onset.depart.toExponential(4),
    a_onset_theory: +a_theory.toExponential(4),
    residual_ratio_a_over_theory: +(onset.a / a_theory).toPrecision(4), // measured a_onset / (eps_mach/tol)
    PT_safety_margin_a_PT_over_a_onset: +(A_PT / onset.a).toExponential(4), // reliability grows with larger a
    N_onset_above_1e17: onset.N > 1e17,
  };
}

const TOL_LADDER = [1e-4, 1e-5, 1e-6, 1e-7, 1e-8];
const LADDER = TOL_LADDER.map(locateOnset).filter(Boolean);

// (L1) residual ratio band across the ladder -- how tightly a_onset tracks eps_mach/tol.
const RESIDUALS = LADDER.map((r) => r.residual_ratio_a_over_theory);
const RESIDUAL_MIN = Math.min(...RESIDUALS);
const RESIDUAL_MAX = Math.max(...RESIDUALS);
const RESIDUAL_SPREAD = RESIDUAL_MAX / RESIDUAL_MIN; // ~4.5 (log-grid quantization of the crossing point)
const ALL_WITHIN_ENVELOPE = RESIDUALS.every((r) => r > 1 / 30 && r < 30); // imp-35810 (C2) order-of-magnitude
const ALL_BELOW_UNITY = RESIDUALS.every((r) => r < 1); // sustained-crossing lands just past the threshold

// (L2) how the PT safety margin a_PT/a_onset erodes as tol tightens: decades of a, loosest to strictest rung.
const MARGIN_LOOSEST = LADDER[0].PT_safety_margin_a_PT_over_a_onset; // tol = 1e-4 (largest margin)
const MARGIN_STRICTEST = LADDER[LADDER.length - 1].PT_safety_margin_a_PT_over_a_onset; // tol = 1e-8 (smallest)
const MARGIN_EROSION_DECADES = Math.log10(MARGIN_LOOSEST / MARGIN_STRICTEST); // ~4.3 (one decade per tol decade)
const N_ONSET_ABOVE_1E17_COUNT = LADDER.filter((r) => r.N_onset_above_1e17).length; // 4 of 5 (all but tol=1e-8)
const ALL_ONSETS_WELL_ABOVE_ANCHOR = LADDER.every((r) => r.N_onset > 100 * N_PT); // every rung >2 decades above PT
const STRICTEST_MARGIN_SAFE = MARGIN_STRICTEST > 100; // anchor still >100x more reliable than onset at tol=1e-8

export const IMP35848_CANCELLATION_ONSET_TOL_LADDER = {
  id: 'imp-35848',
  proofSection: 'S-frontier',
  question:
    'imp-35810 pinned the Krawczyk float-cancellation onset height for tol = 1e-6 and asserted (C2) the ' +
    'measured onset a matches the closed-form envelope a_onset ~ eps_mach/tol and (C3) the PT-anchor safety ' +
    'margin is not sensitive to tol across 1e-4..1e-8 -- both only qualitatively. Tabulate the onset across the ' +
    'tol ladder {1e-4,1e-5,1e-6,1e-7,1e-8}: N_onset(tol), a_onset(tol), |dG_onset|(tol), the PT margin ' +
    'a_onset/a_PT, and the residual between measured a_onset and eps_mach/tol. Measurement only; changes no ' +
    'bound; NO QED.',
  finding:
    'Reusing the imp-35810 two-evaluation measure() and sustained-3-point crossing verbatim over a single ' +
    'log-spaced N scan (1e13..1e21), the onset relocates cleanly for each tol. The measured a_onset tracks the ' +
    'envelope eps_mach/tol with a residual ratio a_onset/(eps_mach/tol) in the band [' +
    RESIDUAL_MIN.toPrecision(3) +
    ', ' +
    RESIDUAL_MAX.toPrecision(3) +
    '] (spread ~' +
    RESIDUAL_SPREAD.toFixed(2) +
    'x from log-grid quantization of the crossing point) -- systematically BELOW unity because the sustained ' +
    'crossing fixes the onset just past the nominal threshold. This CONFIRMS (does not beat) the imp-35810 (C2) ' +
    '"within an order of magnitude" match and quantifies the residual as an O(0.1-0.5) undershoot. The PT ' +
    'safety margin a_PT/a_onset (reliability grows with larger a) falls ~one decade per tol decade (from ~' +
    MARGIN_LOOSEST.toExponential(1) +
    ' at tol=1e-4 to ~' +
    MARGIN_STRICTEST.toExponential(1) +
    ' at tol=1e-8, ~' +
    MARGIN_EROSION_DECADES.toFixed(1) +
    ' decades of a), yet even the strictest rung leaves the anchor >100x more reliable than the onset threshold ' +
    '(N_onset > 1e17 for four of five tol, dropping to N ~ 1.4e16 -- still ~3 decades above the anchor -- only ' +
    'at tol=1e-8). So the imp-35810 (C3) tol-robustness reading holds, now QUANTIFIED. EVIDENCE / measurement, ' +
    'NOT a machine certificate.',
  constants: {
    tol_ladder: TOL_LADDER,
    N_at_PT_anchor: +N_PT.toPrecision(15),
    a_at_PT_anchor: +A_PT.toExponential(4),
    T_PT,
    delta: DELTA,
    S_inf_floor: S_INF,
    machine_epsilon: Number.EPSILON,
  },
  measurement: {
    ladder: LADDER,
    residual_ratio_min: +RESIDUAL_MIN.toPrecision(4),
    residual_ratio_max: +RESIDUAL_MAX.toPrecision(4),
    residual_ratio_spread: +RESIDUAL_SPREAD.toPrecision(4),
    all_residuals_within_order_of_magnitude: ALL_WITHIN_ENVELOPE,
    all_residuals_below_unity: ALL_BELOW_UNITY,
    PT_margin_at_loosest_tol: +MARGIN_LOOSEST.toExponential(4),
    PT_margin_at_strictest_tol: +MARGIN_STRICTEST.toExponential(4),
    PT_margin_erosion_decades: +MARGIN_EROSION_DECADES.toFixed(2),
    onsets_above_1e17_count: N_ONSET_ABOVE_1E17_COUNT,
    all_onsets_well_above_PT_anchor: ALL_ONSETS_WELL_ABOVE_ANCHOR,
    strictest_margin_safe: STRICTEST_MARGIN_SAFE,
  },
  subGap:
    'imp-34714a REMAINS OPEN. Tabulating the float-cancellation onset across a tol ladder says nothing about ' +
    'whether a directed-rounding [g](m)/[F-prime] evaluation yields valid enclosures: it rests on the ' +
    'gamma(n)/k eps surrogate models of the imp-34687a directed-rounding layer, not that layer, and F(m) = 0 ' +
    'remains a double-precision artifact. Adds no RH bound.',
  isRigorous: false,
  verdict:
    'CANCELLATION-ONSET TOL LADDER TABULATED, MEASURED (frontier, NOT an RH bound). The ticket asked to tabulate ' +
    'the imp-35810 onset across tol in {1e-4,1e-5,1e-6,1e-7,1e-8} and quantify the imp-35810 (C2) envelope match ' +
    'and (C3) tol-robustness that were reported only qualitatively. RESULT: reusing the imp-35810 measure() and ' +
    'sustained-3-point crossing verbatim, the measured a_onset tracks eps_mach/tol with a residual ratio in the ' +
    'band [' +
    RESIDUAL_MIN.toPrecision(3) +
    ', ' +
    RESIDUAL_MAX.toPrecision(3) +
    '] (spread ~' +
    RESIDUAL_SPREAD.toFixed(2) +
    'x, systematically below unity) -- CONFIRMING (not beating) the (C2) order-of-magnitude claim -- and the PT ' +
    'margin a_PT/a_onset erodes ~one decade per tol decade (~' +
    MARGIN_EROSION_DECADES.toFixed(1) +
    ' decades across the ladder) while N_onset stays >2 decades above the PT anchor at every rung (> 1e17 for ' +
    'four of five tol), so the (C3) tol-robustness reading holds and is now quantified. EVIDENCE, NOT a machine certificate. SUB-GAP imp-34714a REMAINS OPEN: rests on ' +
    'the gamma(n)/k eps surrogate models, not the imp-34687a directed-rounding layer, and F(m) = 0 remains a ' +
    'double-precision artifact. Measurement only on the inherited imp-3220/imp-3406 surrogate; reuses the ' +
    'imp-35266/imp-35766/imp-34996/imp-35810 machinery (identical K, delta, S_inf, aOf, measure); the C_C 1/8 ' +
    'ansatz (imp-2642/2643) and C_mb GUE-conditional per imp-486 are UNTOUCHED; changes no bound; establishes no ' +
    'operator positivity; no RH verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-35810 (single-tol onset; C2/C3 asserted qualitatively); imp-35766 (B3 float-cancellation artifact); ' +
    'imp-35266 (2:1 split -dFP/dG ~ 2.00042); imp-34996 (S_inf = 1/(2 delta) floor); imp-2642 (C_C 1/8 ansatz); ' +
    'lambda-rh-height-mapping (effectiveHeightForN RvM inverse; zeroCountAtHeight forward N(T)). ' +
    'Catastrophic-cancellation onset from the eps_mach / a envelope: standard floating-point analysis.',
};

export const IMP35848_CANCELLATION_ONSET_TOL_LADDER_ASSERTIONS = [
  {
    // The full ladder relocated: five rungs, one per tol.
    id: 'imp35848-ladder-has-five-rungs',
    description: 'onset located for all five tolerances 1e-4..1e-8',
    holds: () => LADDER.length === 5,
  },
  {
    // (L1) The measured a_onset tracks eps_mach/tol within an order of magnitude, systematically below unity.
    id: 'imp35848-envelope-match-order-of-magnitude',
    description: 'a_onset/(eps_mach/tol) within 30x and below unity at every rung; residual spread < 10x',
    holds: () => ALL_WITHIN_ENVELOPE === true && ALL_BELOW_UNITY === true && RESIDUAL_SPREAD < 10,
  },
  {
    // (L2) The PT margin falls ~one decade per tol decade across the four-decade tol ladder (~3..5 decades).
    id: 'imp35848-PT-margin-erodes-one-decade-per-tol-decade',
    description: 'PT safety margin erosion across tol ladder is ~4 decades (in [3, 5])',
    holds: () => MARGIN_EROSION_DECADES > 3 && MARGIN_EROSION_DECADES < 5,
  },
  {
    // (L3) The onset stays >2 decades above the PT anchor at every rung; N_onset > 1e17 for 4 of 5 (all but
    // the strictest tol=1e-8, where it drops to N ~ 1.4e16, still ~3 decades above the anchor).
    id: 'imp35848-onset-well-above-PT-anchor-at-every-rung',
    description: 'N_onset > 100x N_PT at every rung; > 1e17 for 4 of 5 tolerances; strictest-rung margin > 100',
    holds: () =>
      ALL_ONSETS_WELL_ABOVE_ANCHOR === true &&
      N_ONSET_ABOVE_1E17_COUNT === 4 &&
      STRICTEST_MARGIN_SAFE === true,
  },
  {
    // Honesty gate: measurement / surrogate, not rigorous, sub-gap open, no QED, no refereed bound is changed.
    id: 'imp35848-honesty-gate-no-qed',
    description: 'measurement: isRigorous false, imp-34714a open, no QED, no refereed bound is changed',
    holds: () =>
      IMP35848_CANCELLATION_ONSET_TOL_LADDER.isRigorous === false &&
      /imp-34714a/.test(IMP35848_CANCELLATION_ONSET_TOL_LADDER.subGap) &&
      /REMAINS OPEN/.test(IMP35848_CANCELLATION_ONSET_TOL_LADDER.subGap) &&
      /NO QED/.test(IMP35848_CANCELLATION_ONSET_TOL_LADDER.verdict) &&
      /refereed bound is changed/i.test(IMP35848_CANCELLATION_ONSET_TOL_LADDER.verdict),
  },
];

for (const a of IMP35848_CANCELLATION_ONSET_TOL_LADDER_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-35848-cancellation-onset-tol-ladder assertion failed: ${a.id}`);
  }
}
