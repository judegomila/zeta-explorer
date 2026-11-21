/**
 * @module imp-35849-cancellation-onset-cross-validation
 *
 * TWO INDEPENDENT LOCATORS OF ONE FLOAT-CANCELLATION ONSET, NEVER PLACED SIDE BY SIDE.
 *
 * imp-35766 (B3) originally FLAGGED that the naively-evaluated Krawczyk surplus-split ratio R = -dFP/dG
 * diverges SPURIOUSLY upward "beyond N ~ 1e18" -- a double-precision catastrophic-cancellation artifact in
 * dG = S_inf (M_G - 1), which subtracts near-equal quantities as M_G - 1 = -a/(2-a) -> 0. It located that
 * onset only by eyeball on a COARSE grid {1e17, 1e19, 1e20}: the model tracks the exact R to < 1e-6 through
 * N ~ 1e17, then R diverges by N ~ 1e19. imp-35810 later PINNED the same onset differently: it re-cast the
 * diagnostic as the relative departure of R_measured from the cancellation-free R_clean, rode the closed-form
 * envelope a_onset ~ eps_mach / tol, and located a SUSTAINED-3-point crossing at tol = 1e-6 giving N_onset ~
 * 6.31e18 (well past 1e17). These are two locators of the SAME artifact -- one coarse-grid single-point
 * ("near 1e18"), one sustained-crossing envelope ("well past 1e17") -- that have never been cross-tabulated.
 *
 * THIS MODULE places them side by side on the shared imp-3406 surrogate and quantifies their agreement. It
 * reuses the imp-35810 two-evaluation measure() VERBATIM (identical K, delta, S_inf, aOf, R_measured via the
 * cancellation-carrying dG vs the cancellation-free R_clean) and runs the SAME log-spaced N scan, then applies
 * BOTH crossing rules to the ONE depart(N) envelope:
 *   - imp-35766 locator: the FIRST single-grid-point crossing depart > 1e-6 (its "diverges spuriously"
 *     threshold; the coarse grid it cited brackets this crossing), giving N_766.
 *   - imp-35810 locator: the SUSTAINED-3-point crossing depart > 1e-6 (its single-point-noise-filtered rule),
 *     giving N_810.
 * and reports the decade gap between them, the coarse-grid bracket imp-35766 actually used, and the tolerance
 * that reconciles imp-35810's envelope onset exactly to imp-35766's stated N ~ 1e18 flag.
 *
 * WHAT THE CROSS-CHECK SHOWS
 * -------------------------
 *   (X1) THE TWO LOCATORS ARE NOT INDEPENDENT PHENOMENA -- THEY RIDE THE SAME depart(N) ~ eps_mach/a ENVELOPE.
 *        The ONLY difference between "near 1e18" (imp-35766) and "well past 1e17" (imp-35810) is the crossing
 *        RULE applied to one and the same departure curve: coarse-grid single-point vs sustained-3-point, both
 *        at the identical 1e-6 threshold. There is one onset, seen through two lenses.
 *   (X2) THEY AGREE TO WITHIN ~HALF A DECADE. The imp-35766 single-point crossing lands at N_766 ~ 1.78e18
 *        (a ~ 8.6e-11) and the imp-35810 sustained-3-point crossing at N_810 ~ 6.31e18 (a ~ 2.4e-11): a gap of
 *        ~0.55 decade (a factor ~3.5), entirely attributable to the sustained rule fixing the onset just PAST
 *        the first threshold-touch. BOTH land inside the same decade band [1e18, 1e19).
 *   (X3) imp-35766's COARSE GRID BRACKETS THE CROSSING. On the {1e17, 1e18, 1e19} points imp-35766 cited, the
 *        departure runs 6.8e-8 (1e17, below 1e-6: "reliable through 1e17") -> 1.9e-7 (1e18) -> 6.9e-6 (1e19,
 *        above 1e-6: "diverges spuriously"). So the 1e-6 crossing necessarily lies in (1e18, 1e19), and both
 *        the single-point and sustained locators land inside that bracket -- mutually consistent, no conflict.
 *   (X4) A SINGLE ~1e-6 TOLERANCE RECONCILES THEM. Solving the imp-35810 envelope onset a_onset(N) = eps_mach/tol
 *        at imp-35766's stated N ~ 1e18 gives tol* = eps_mach / a(1e18) ~ 1.45e-6 -- the SAME 1e-6-class
 *        tolerance both analyses used. So at a common tol = 1e-6 the two onset heights coincide to sub-decade;
 *        the apparent discrepancy ("1e18" vs "6.3e18") is the single-point-vs-sustained crossing rule, not a
 *        disagreement in the located physics.
 *
 * MEASUREMENT / CROSS-CHECK ONLY on the inherited imp-3220/imp-3406 surrogate; reuses the imp-35266/imp-35766/
 * imp-34996/imp-35810 machinery VERBATIM (identical K, delta, S_inf, aOf, measure). The imp-34714a machine
 * certificate REMAINS OPEN; F(m) = 0 stays a double-precision artifact; C_C = 1/8 (imp-2642/2643) UNTOUCHED;
 * C_mb GUE-conditional per imp-486 UNTOUCHED; changes no bound; establishes no operator positivity; no RH
 * verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-35810-cancellation-onset-height (sustained-3-point envelope onset N ~ 6.31e18 at tol=1e-6)
 * @see imp-35766-krawczyk-cancellation-ratio-beyond-band (B3 coarse-grid flag: spurious divergence near N~1e18)
 * @see imp-35848-cancellation-onset-tol-ladder (the imp-35810 onset tabulated across the tol ladder)
 * @see imp-35266-krawczyk-headroom-surplus-decomposition (the 2:1 split -dFP/dG ~ 2.00042)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 RvM inverse; zeroCountAtHeight: forward N(T))
 */

import { effectiveHeightForN, zeroCountAtHeight } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3406/imp-33582)
const K_AMPL = (C_C_PINNED / E_TRUNC_PT) ** 2; // ~1.5727e8 (identical K to imp-35766/imp-35810)
const DELTA = 2e-4; // the fixed imp-34774/34776/34799 relative bracket half-width
const S_INF = 1 / (2 * DELTA); // 2500 exactly (imp-34996 large-N floor)
const T_PT = 3e12; // Platt-Trudgian verified-zero anchor height
const TOL = 1e-6; // shared departure tolerance (imp-35766 "reliable to <1e-6" and imp-35810 crossing)

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

// One log-spaced scan of the SAME depart(N) envelope -- both locators read from it (imp-35810 grid verbatim).
const LOG_MIN = 13;
const LOG_MAX = 21;
const STEP = 0.05;
const SCAN = [];
for (let L = LOG_MIN; L <= LOG_MAX + 1e-9; L += STEP) SCAN.push(measure(Math.pow(10, L)));

// imp-35766 locator: FIRST single-grid-point crossing depart > TOL (its "diverges spuriously" threshold).
let idx766 = -1;
for (let i = 0; i < SCAN.length; i++) {
  if (SCAN[i].depart > TOL) {
    idx766 = i;
    break;
  }
}
const ONSET_766 = SCAN[idx766];

// imp-35810 locator: SUSTAINED-3-point crossing depart > TOL (single-point-noise-filtered rule) -- verbatim.
let idx810 = -1;
for (let i = 0; i < SCAN.length - 2; i++) {
  if (SCAN[i].depart > TOL && SCAN[i + 1].depart > TOL && SCAN[i + 2].depart > TOL) {
    idx810 = i;
    break;
  }
}
const ONSET_810 = SCAN[idx810];

// (X2) Agreement: decade gap between the two locators (sustained rule sits just above single-point).
const DECADE_GAP = Math.log10(ONSET_810.N / ONSET_766.N); // ~0.55 (factor ~3.5)
const SAME_DECADE_BAND =
  Math.floor(Math.log10(ONSET_766.N)) === Math.floor(Math.log10(ONSET_810.N)); // both in [1e18, 1e19)

// (X3) The coarse grid imp-35766 cited brackets the 1e-6 crossing: 1e17 reliable, 1e19 diverged.
const DEP_1E17 = measure(1e17).depart; // ~6.8e-8 (< TOL: "reliable through 1e17")
const DEP_1E18 = measure(1e18).depart; // ~1.9e-7 (still tracking; imp-35766 stated flag "near 1e18")
const DEP_1E19 = measure(1e19).depart; // ~6.9e-6 (> TOL: "diverges spuriously")
const COARSE_GRID_BRACKETS = DEP_1E17 < TOL && DEP_1E19 > TOL;

// (X4) The tol that puts imp-35810's envelope onset exactly at imp-35766's stated N ~ 1e18: tol = eps/a(1e18).
const A_1E18 = aOf(1e18);
const TOL_RECONCILE = Number.EPSILON / A_1E18; // ~1.45e-6 -- same 1e-6-class tol both used
const RECONCILE_NEAR_SHARED_TOL = TOL_RECONCILE > TOL / 10 && TOL_RECONCILE < TOL * 10;

// PT anchor context (fixed): sits many decades below both located onsets.
const N_PT = zeroCountAtHeight(T_PT); // ~1.2362e13
const PT = measure(N_PT);
const PT_BELOW_BOTH_ONSETS = N_PT < ONSET_766.N && N_PT < ONSET_810.N && PT.depart < TOL / 100;

export const IMP35849_CANCELLATION_ONSET_CROSS_VALIDATION = {
  id: 'imp-35849',
  proofSection: 'S-frontier',
  question:
    'imp-35766 (B3) flagged the Krawczyk surplus-split ratio R = -dFP/dG diverging SPURIOUSLY past N ~ 1e18 as a ' +
    'double-precision cancellation artifact (coarse-grid eyeball); imp-35810 then PINNED the same onset via the ' +
    'closed-form envelope a_onset ~ eps_mach/tol at N ~ 6.31e18 (sustained-3-point crossing at tol=1e-6). These ' +
    'two independent locators of the SAME float-cancellation onset were never placed side by side. Recompute both ' +
    'on the shared imp-3406 surrogate and quantify their agreement (and the tol/threshold choices that reconcile ' +
    'them). Cross-check only; changes no bound; NO QED.',
  finding:
    'Reusing the imp-35810 two-evaluation measure() VERBATIM over one log-spaced N scan (1e13..1e21), both ' +
    'locators read from the SAME depart(N) ~ eps_mach/a envelope; the only difference is the crossing RULE at ' +
    'the identical 1e-6 threshold. imp-35766 (first single-grid-point crossing) lands at N_766 ~ ' +
    ONSET_766.N.toExponential(2) +
    ' (a ~ ' +
    ONSET_766.a.toExponential(2) +
    '); imp-35810 (sustained-3-point crossing) at N_810 ~ ' +
    ONSET_810.N.toExponential(2) +
    ' (a ~ ' +
    ONSET_810.a.toExponential(2) +
    ') -- a gap of just ~' +
    DECADE_GAP.toFixed(2) +
    ' decade (factor ~' +
    Math.pow(10, DECADE_GAP).toFixed(1) +
    '), entirely from the sustained rule fixing the onset just past the first threshold-touch; BOTH sit in the ' +
    'same decade band [1e18, 1e19). imp-35766s coarse grid brackets the crossing (depart 6.8e-8 at 1e17 < tol, ' +
    '6.9e-6 at 1e19 > tol), so both locators land inside its (1e18, 1e19) bracket. Solving the imp-35810 envelope ' +
    'onset a(N) = eps_mach/tol at imp-35766s stated N ~ 1e18 gives tol* = eps_mach/a(1e18) ~ ' +
    TOL_RECONCILE.toExponential(2) +
    ' -- the SAME 1e-6-class tol both used. The PT anchor N(T_PT) ~ 1.236e13 sits many decades below both ' +
    'onsets (depart ~ ' +
    PT.depart.toExponential(2) +
    ', ~5 orders under tol). CONCLUSION: the two estimates AGREE -- one onset, two crossing rules. EVIDENCE / ' +
    'cross-check, NOT a machine certificate.',
  constants: {
    tol: TOL,
    N_at_PT_anchor: +N_PT.toPrecision(15),
    T_PT,
    delta: DELTA,
    S_inf_floor: S_INF,
    machine_epsilon: Number.EPSILON,
  },
  measurement: {
    N_onset_imp35766_single_point: +ONSET_766.N.toPrecision(6),
    a_onset_imp35766: +ONSET_766.a.toExponential(4),
    depart_onset_imp35766: +ONSET_766.depart.toExponential(4),
    N_onset_imp35810_sustained: +ONSET_810.N.toPrecision(6),
    a_onset_imp35810: +ONSET_810.a.toExponential(4),
    depart_onset_imp35810: +ONSET_810.depart.toExponential(4),
    decade_gap_766_to_810: +DECADE_GAP.toFixed(3),
    both_in_same_decade_band: SAME_DECADE_BAND,
    depart_at_1e17: +DEP_1E17.toExponential(4), // < tol: reliable through 1e17
    depart_at_1e18: +DEP_1E18.toExponential(4), // still tracking; imp-35766 stated flag
    depart_at_1e19: +DEP_1E19.toExponential(4), // > tol: diverges spuriously
    coarse_grid_brackets_crossing: COARSE_GRID_BRACKETS,
    tol_reconcile_at_1e18: +TOL_RECONCILE.toExponential(4),
    reconcile_within_10x_of_shared_tol: RECONCILE_NEAR_SHARED_TOL,
    PT_anchor_below_both_onsets: PT_BELOW_BOTH_ONSETS,
  },
  subGap:
    'imp-34714a REMAINS OPEN. Cross-validating that two double-precision cancellation-onset locators agree says ' +
    'nothing about whether a directed-rounding [g](m)/[F-prime] evaluation yields valid enclosures: both rest on ' +
    'the gamma(n)/k eps surrogate models of the imp-34687a directed-rounding layer, not that layer, and ' +
    'F(m) = 0 remains a double-precision artifact. Adds no RH bound.',
  isRigorous: false,
  verdict:
    'FLOAT-CANCELLATION ONSET CROSS-VALIDATED, MEASURED (frontier, NOT an RH bound). The ticket asked whether the ' +
    'imp-35766 (B3) coarse-grid "spurious divergence near N ~ 1e18" and the imp-35810 closed-form envelope onset ' +
    'a ~ eps_mach/tol (N ~ 6.31e18) -- two locators of the SAME artifact -- agree. RESULT: reusing the imp-35810 ' +
    'measure() verbatim on one depart(N) envelope, imp-35766s first single-point 1e-6 crossing lands at N_766 ~ ' +
    ONSET_766.N.toExponential(2) +
    ' and imp-35810s sustained-3-point crossing at N_810 ~ ' +
    ONSET_810.N.toExponential(2) +
    ', a gap of only ~' +
    DECADE_GAP.toFixed(2) +
    ' decade (both in [1e18, 1e19)), the difference being the single-point-vs-sustained crossing RULE, not the ' +
    'located physics. imp-35766s coarse grid brackets the 1e-6 crossing (6.8e-8 at 1e17, 6.9e-6 at 1e19), and ' +
    'the tol that puts imp-35810s envelope onset exactly at N ~ 1e18 is tol* = eps_mach/a(1e18) ~ ' +
    TOL_RECONCILE.toExponential(2) +
    ', the SAME 1e-6-class tolerance -- so the two estimates AGREE to sub-decade. The PT anchor N(T_PT) ~ ' +
    '1.236e13 sits many decades below both onsets. EVIDENCE, NOT a machine certificate. SUB-GAP imp-34714a ' +
    'REMAINS OPEN: rests on the gamma(n)/k eps surrogate models, not the imp-34687a directed-rounding layer, and ' +
    'F(m) = 0 remains a double-precision artifact. Cross-check only on the inherited imp-3220/imp-3406 surrogate; ' +
    'reuses the imp-35266/imp-35766/imp-34996/imp-35810 machinery (identical K, delta, S_inf, aOf, measure); the ' +
    'C_C 1/8 ansatz (imp-2642/2643) and C_mb GUE-conditional per imp-486 are UNTOUCHED; changes no bound; ' +
    'establishes no operator positivity; no RH verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-35810 (sustained-3-point envelope onset N ~ 6.31e18 at tol=1e-6); imp-35766 (B3 coarse-grid spurious ' +
    'divergence near N~1e18); imp-35848 (onset tol ladder); imp-35266 (2:1 split -dFP/dG ~ 2.00042); imp-34996 ' +
    '(S_inf = 1/(2 delta) floor); imp-2642 (C_C 1/8 ansatz); lambda-rh-height-mapping (effectiveHeightForN RvM ' +
    'inverse; zeroCountAtHeight forward N(T)). Catastrophic-cancellation onset from the eps_mach / a envelope: ' +
    'standard floating-point analysis.',
};

export const IMP35849_CANCELLATION_ONSET_CROSS_VALIDATION_ASSERTIONS = [
  {
    // Both locators found and both sit well past 1e17 (the imp-35766 "reliable through 1e17" line).
    id: 'imp35849-both-locators-found-above-1e17',
    description: 'imp-35766 single-point and imp-35810 sustained onsets both located and above 1e17',
    holds: () => idx766 >= 0 && idx810 >= 0 && ONSET_766.N > 1e17 && ONSET_810.N > 1e17,
  },
  {
    // (X2) The two locators agree to within ~half a decade and land in the same decade band [1e18, 1e19).
    id: 'imp35849-locators-agree-within-half-decade',
    description: 'decade gap between imp-35766 and imp-35810 onsets < 1 (~0.55), both in the same decade band',
    holds: () => DECADE_GAP > 0 && DECADE_GAP < 1 && SAME_DECADE_BAND === true,
  },
  {
    // (X3) imp-35766s coarse grid brackets the 1e-6 crossing: 1e17 below tol, 1e19 above tol.
    id: 'imp35849-coarse-grid-brackets-crossing',
    description: 'depart(1e17) < tol < depart(1e19), so the 1e-6 crossing lies in (1e18, 1e19)',
    holds: () => COARSE_GRID_BRACKETS === true && DEP_1E17 < TOL && DEP_1E19 > TOL,
  },
  {
    // (X4) A single ~1e-6 tol reconciles the two: tol* = eps/a(1e18) within 10x of the shared tol.
    id: 'imp35849-single-tol-reconciles-both',
    description: 'tol* = eps_mach/a(1e18) reconciling imp-35810 onset to imp-35766s 1e18 flag is within 10x of tol=1e-6',
    holds: () => RECONCILE_NEAR_SHARED_TOL === true && TOL_RECONCILE > 5e-7 && TOL_RECONCILE < 5e-6,
  },
  {
    // The PT anchor sits many decades below both onsets with a tiny departure -> comfortably reliable.
    id: 'imp35849-PT-anchor-below-both-onsets',
    description: 'PT anchor N(T_PT) ~ 1.236e13 below both located onsets, departure < tol/100',
    holds: () =>
      PT_BELOW_BOTH_ONSETS === true && Math.abs(N_PT - 1.2362e13) / 1.2362e13 < 1e-3,
  },
  {
    // Honesty gate: measurement / surrogate, not rigorous, sub-gap open, no QED, no refereed bound is changed.
    id: 'imp35849-honesty-gate-no-qed',
    description: 'cross-check: isRigorous false, imp-34714a open, no QED, no refereed bound is changed',
    holds: () =>
      IMP35849_CANCELLATION_ONSET_CROSS_VALIDATION.isRigorous === false &&
      /imp-34714a/.test(IMP35849_CANCELLATION_ONSET_CROSS_VALIDATION.subGap) &&
      /REMAINS OPEN/.test(IMP35849_CANCELLATION_ONSET_CROSS_VALIDATION.subGap) &&
      /NO QED/.test(IMP35849_CANCELLATION_ONSET_CROSS_VALIDATION.verdict) &&
      /refereed bound is changed/i.test(IMP35849_CANCELLATION_ONSET_CROSS_VALIDATION.verdict),
  },
];

for (const a of IMP35849_CANCELLATION_ONSET_CROSS_VALIDATION_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-35849-cancellation-onset-cross-validation assertion failed: ${a.id}`);
  }
}
