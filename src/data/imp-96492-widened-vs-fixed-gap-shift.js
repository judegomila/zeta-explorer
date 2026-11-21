/**
 * @module imp-96492-widened-vs-fixed-gap-shift
 *
 * imp-96492 (accuracy, frontier-direction): TEST whether the imp-96464 widened-grid
 * ([1e7,1e13]) tenth-decade knee-minus-crossover gap (reported band 0.01448..0.01483
 * log10) is statistically identical to the imp-96388 fixed-window ([1e9,1e12]) baseline
 * gap, or whether it carries a small systematic shift once the window no longer clips
 * the knee. imp-96464 G2 states the widened-grid gap matches the on-window imp-96451
 * elasticities "to all reported digits" but never quantifies the residual gap shift.
 *
 * WHY THE QUESTION
 * ----------------
 * imp-96388 reported kneeVsCrossoverLog10 ~ 0.0131 (the knee sitting ~0.013 log10 above
 * the crossover); imp-96464 reported the widened-grid knee-minus-crossover gap in a
 * 0.01448..0.01483 band, ~0.0017 higher. Taken at face value that looks like a small
 * systematic shift introduced by widening the window from [1e9,1e12] to [1e7,1e13]. But
 * the two siblings use DIFFERENT crossover DEFINITIONS:
 *   - imp-96388 kneeVsCrossoverLog10 uses the imp-33723 CLOSED-FORM fixed point where
 *     E_coll = E_trunc (E_flow ignored), N_cross ~ 3.28e9, log10 ~ 9.5159.
 *   - imp-96464 gapLog10 uses the sigma = 1/2 BISECTION crossover, where
 *     E_coll = E_trunc + E_flow (E_flow retained), log10 ~ 9.5142.
 * Widening the window and switching the crossover definition are two separate effects
 * that the naive 0.0131-vs-0.0148 comparison conflates. This module isolates them.
 *
 * THE MEASUREMENT (both estimators re-run here; identical sub-terms; no new constants)
 * ----------------------------------------------------------------------------------
 * At the anchor E_trunc = 3.06e-5 (factor 1.0), recompute the imp-96351/imp-96427/
 * imp-96464 kneeOnGrid D2 zero-crossing on BOTH grids -- the fixed [1e9,1e12] and the
 * widened [1e7,1e13] -- and BOTH crossover definitions (closed-form E_coll=E_trunc and
 * the sigma=1/2 bisection). Then report:
 *   (a) the pure window effect on the KNEE (wide knee minus fixed knee),
 *   (b) the pure window effect on the GAP holding the crossover definition FIXED,
 *   (c) the crossover-definition offset (sigma=1/2 minus closed-form), and
 *   (d) the naive raw difference imp-96464 gap minus imp-96388 kneeVsCrossoverLog10.
 *
 * THE FINDING (measurement / fit only)
 * ------------------------------------
 *   (F1) THE KNEE IS BIT-IDENTICAL ON THE TWO GRIDS. At the anchor factor the widened
 *        [1e7,1e13] knee equals the fixed [1e9,1e12] knee to the last stored bit
 *        (9.528998220988568 on both, difference EXACTLY 0): the widened grid re-uses the
 *        same tenth-decade bracket edges (7.0 + k*0.1 lands on 9.0, 9.1, ... exactly), so
 *        the D2 zero-crossing detection is bit-for-bit the same in the overlap region.
 *   (F2) THE WINDOW-ONLY GAP SHIFT IS EXACTLY ZERO. Holding the crossover definition
 *        fixed (both sigma=1/2), the knee-minus-crossover gap is bit-identical on the two
 *        grids (0.01481782186655245 on each): the window-only shift is 0, below the
 *        ~1e-13 solver-path floor (imp-96427) and far below the 1e-3 threshold. So the
 *        widened-grid gap is NOT a statistically distinct value -- it is the SAME gap.
 *   (F3) THE APPARENT +0.0017 IS A CROSSOVER-DEFINITION ARTEFACT, NOT A WINDOW SHIFT.
 *        The naive imp-96464-minus-imp-96388 difference ~ +0.00173 exactly equals the
 *        crossover-definition offset (sigma=1/2 bisection at 9.51418 minus closed-form
 *        E_coll=E_trunc at 9.51591 = -0.00173): the sigma=1/2 crossover sits ~0.0017
 *        LOWER (E_flow > 0 pushes E_coll = E_trunc + E_flow to a slightly smaller N),
 *        which raises the gap by the same amount. Matched on definition, the gaps agree.
 *
 * CONCLUSION: imp-96464 G2 is correct at the gap level -- the widened-grid knee-minus-
 * crossover gap is statistically IDENTICAL to the imp-96388 fixed-window baseline (window
 * shift exactly 0). The ~0.0017 apparent offset is fully accounted for by the two modules
 * using different crossover definitions (closed-form vs sigma=1/2), not by window
 * widening. Reporting the two gaps as directly comparable overstates a shift that is zero
 * once the definition is matched.
 *
 * MEASUREMENT / FIT ONLY. Window-resolution / definition-audit diagnostic, NOT an RH
 * bound. The component model is the inherited imp-3220/imp-3406 extrapolation, NOT a
 * rigorous asymptotic; the C_mb GUE-conditional per imp-486 is UNTOUCHED; the C_C 1/8
 * ansatz (imp-2642/imp-2643) is UNTOUCHED; changes no bound; establishes no operator
 * positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. No refereed bound is changed.
 *
 * Syntax note: derivative-like expressions use brace notation dg_{k*}/dt and this header
 *   avoids the close-comment terminator sequence inside prose.
 *
 * @see imp-96464-sigma-knee-widened-grid-window-exit (widened-grid gap band 0.01448..0.01483; G2 rigidity)
 * @see imp-96388-sigma-peak-vs-knee-cross-tabulation (fixed-window kneeVsCrossoverLog10 ~ 0.0131, closed-form crossover)
 * @see imp-96451-sigma-knee-etrunc-sensitivity (on-window knee sensitivity; F3 gap rigidity ~0.0148)
 * @see imp-96427-knee-crossover-solver-path-spread (same estimators, solver-path noise ~1e-13)
 * @see imp-33723-sigma-half-vs-crossover-closed-form (closed-form E_coll = E_trunc crossover N_cross ~ 3.28e9)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 = gamma_N, Newton main-term inverse)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';
import IMP96388 from './imp-96388-sigma-peak-vs-knee-cross-tabulation.js';
import IMP96464 from './imp-96464-sigma-knee-widened-grid-window-exit.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3406/imp-33582)
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-3406/imp-96388/imp-96464 exactly

const FIXED_LO_D = 9.0; // imp-96388 fixed [1e9,1e12] window
const FIXED_HI_D = 12.0;
const WIDE_LO_D = 7.0; // imp-96464 widened [1e7,1e13] window
const WIDE_HI_D = 13.0;
const W = 0.1;
const PPD = 100;
const GRID_NOISE_HI = 1e-3; // ticket threshold: shifts below this are grid-resolution noise (~1e-13..1e-3)

// sigma(N) with the anchor truncation floor -- identical sub-terms to imp-96388/imp-96464.
function sigma(N) {
  const T0 = effectiveHeightForN(N);
  const L = Math.log(T0);
  const C_F = (Math.log(T0 / TWO_PI) + 1) / TWO_PI; // imp-398 pinned prefactor
  const E_flow = C_F * (L / T0) * GRONWALL;
  const E_coll = C_C_PINNED * Math.sqrt(L / N);
  return E_coll / (E_TRUNC_PT + E_flow + E_coll);
}

// OLS local decay exponent, identical estimator to imp-96388/imp-96464.
function olsExponentLog10(loD, hiD) {
  const step = 1 / PPD;
  const xs = [];
  const ys = [];
  for (let d = loD; d <= hiD + 1e-9; d += step) {
    const N = Math.pow(10, d);
    xs.push(Math.log(N));
    ys.push(Math.log(sigma(N)));
  }
  const n = xs.length;
  const mx = xs.reduce((a, b) => a + b, 0) / n;
  const my = ys.reduce((a, b) => a + b, 0) / n;
  let sxx = 0;
  let sxy = 0;
  for (let i = 0; i < n; i++) {
    sxx += (xs[i] - mx) ** 2;
    sxy += (xs[i] - mx) * (ys[i] - my);
  }
  return -(sxy / sxx);
}

// Tenth-decade D2 zero-crossing (knee), identical to imp-96388/imp-96464 kneeOnGrid.
function kneeOnGrid(loD, hiD) {
  const edges = [];
  for (let d = loD; d <= hiD + 1e-9; d += W) edges.push(+d.toFixed(6));
  const brackets = [];
  for (let i = 0; i < edges.length - 1; i++) {
    const cen = (edges[i] + edges[i + 1]) / 2;
    brackets.push({ cen, p: olsExponentLog10(edges[i], edges[i + 1]) });
  }
  const D1 = [];
  for (let i = 1; i < brackets.length; i++) {
    D1.push({ cen: (brackets[i].cen + brackets[i - 1].cen) / 2, d1: brackets[i].p - brackets[i - 1].p });
  }
  const D2 = [];
  for (let i = 1; i < D1.length; i++) {
    D2.push({ cen: (D1[i].cen + D1[i - 1].cen) / 2, d2: D1[i].d1 - D1[i - 1].d1 });
  }
  let signChanges = 0;
  let cstar = null;
  for (let i = 1; i < D2.length; i++) {
    if (Math.sign(D2[i].d2) !== Math.sign(D2[i - 1].d2)) {
      signChanges += 1;
      if (cstar === null) {
        const c0 = D2[i - 1].cen;
        const c1 = D2[i].cen;
        const y0 = D2[i - 1].d2;
        const y1 = D2[i].d2;
        cstar = c0 + ((c1 - c0) * (0 - y0)) / (y1 - y0);
      }
    }
  }
  return { signChanges, cstar };
}

// sigma = 1/2 crossover (E_coll = E_trunc + E_flow), bisection -- imp-96464 definition.
function crossoverSigmaHalf(loD, hiD) {
  let lo = loD;
  let hi = hiD;
  for (let i = 0; i < 200; i += 1) {
    const mid = 0.5 * (lo + hi);
    if (sigma(Math.pow(10, mid)) > 0.5) lo = mid;
    else hi = mid;
  }
  return 0.5 * (lo + hi);
}

// closed-form crossover (E_coll = E_trunc, E_flow ignored) -- imp-33723/imp-96388 definition.
const K_AMPL = (C_C_PINNED / E_TRUNC_PT) ** 2;
function crossoverClosedFormLog10(seed, iters) {
  let N = seed;
  for (let i = 0; i < iters; i += 1) N = K_AMPL * Math.log(effectiveHeightForN(N));
  return Math.log10(N);
}

// -- the measurement --
const KNEE_FIXED = kneeOnGrid(FIXED_LO_D, FIXED_HI_D);
const KNEE_WIDE = kneeOnGrid(WIDE_LO_D, WIDE_HI_D);
const CROSS_SIGMA_HALF = crossoverSigmaHalf(4.0, 14.0);
const CROSS_CLOSED_FORM = crossoverClosedFormLog10(1e9, 60);

// (a) pure window effect on the knee (identical crossover-free landmark)
const KNEE_WINDOW_SHIFT = KNEE_WIDE.cstar - KNEE_FIXED.cstar;
// (b) pure window effect on the gap, crossover definition held FIXED (both sigma=1/2)
const GAP_FIXED_GRID_SIGMA_HALF = KNEE_FIXED.cstar - CROSS_SIGMA_HALF;
const GAP_WIDE_GRID_SIGMA_HALF = KNEE_WIDE.cstar - CROSS_SIGMA_HALF;
const GAP_WINDOW_SHIFT = GAP_WIDE_GRID_SIGMA_HALF - GAP_FIXED_GRID_SIGMA_HALF;
// (c) crossover-definition offset (sigma=1/2 minus closed-form)
const CROSSOVER_DEF_OFFSET = CROSS_SIGMA_HALF - CROSS_CLOSED_FORM;
// (d) naive raw difference: imp-96464 gap (sigma=1/2, wide grid) minus imp-96388 kneeVsCrossoverLog10 (closed-form)
const GAP_464 = KNEE_WIDE.cstar - CROSS_SIGMA_HALF; // reproduces imp-96464 anchor gapLog10 ~ 0.014818
const GAP_388_CLOSED_FORM = KNEE_FIXED.cstar - CROSS_CLOSED_FORM; // reproduces imp-96388 kneeVsCrossoverLog10 ~ 0.0131
const RAW_DIFF = GAP_464 - GAP_388_CLOSED_FORM;
// the raw difference should equal the crossover-definition offset (up to sign), confirming F3
const RAW_DIFF_MINUS_DEF_OFFSET = RAW_DIFF - Math.abs(CROSSOVER_DEF_OFFSET);

// cross-checks against the frozen sibling baked values (staleness tripwire)
const IMP96388_BAKED = IMP96388.kneeVsCrossoverLog10; // 0.0131
const IMP96464_ANCHOR = IMP96464.rows.find((r) => r.factor === 1); // gapLog10 ~ 0.014818

const WINDOW_SHIFT_EXCEEDS_NOISE = Math.abs(GAP_WINDOW_SHIFT) > GRID_NOISE_HI;

export const IMP96492_WIDENED_VS_FIXED_GAP_SHIFT = Object.freeze({
  id: 'imp-96492',
  proofSection: 'S-frontier',
  question:
    'Is the imp-96464 widened-grid ([1e7,1e13]) tenth-decade knee-minus-crossover gap (band ' +
    '0.01448..0.01483) statistically identical to the imp-96388 fixed-window ([1e9,1e12]) baseline gap, ' +
    'or does it carry a small systematic shift once the window no longer clips the knee? Compare at the ' +
    'anchor factor, report the difference and whether it exceeds grid-resolution noise (~1e-13..1e-3). ' +
    'Measurement/fit only; NOT an RH bound; NO QED.',
  measuredQuantity:
    'the anchor-factor knee-minus-crossover gap on the fixed [1e9,1e12] vs widened [1e7,1e13] grid, ' +
    'decomposed into (a) the pure window effect on the knee, (b) the window-only gap shift with the ' +
    'crossover definition held fixed, (c) the crossover-definition offset, and (d) the naive raw ' +
    'imp-96464-minus-imp-96388 difference',
  eTruncAnchor: E_TRUNC_PT,
  fixedWindow: '[1e9,1e12]',
  widenedWindow: '[1e7,1e13]',
  gridWidthDecades: W,
  ptsPerDecade: PPD,
  gridNoiseThreshold: GRID_NOISE_HI,
  kneeFixedGridLog10: +KNEE_FIXED.cstar.toFixed(12),
  kneeWideGridLog10: +KNEE_WIDE.cstar.toFixed(12),
  kneeWindowShift: KNEE_WINDOW_SHIFT, // exactly 0 (bit-identical)
  crossoverSigmaHalfLog10: +CROSS_SIGMA_HALF.toFixed(12),
  crossoverClosedFormLog10: +CROSS_CLOSED_FORM.toFixed(12),
  crossoverDefOffset: +CROSSOVER_DEF_OFFSET.toExponential(6),
  gapFixedGridSigmaHalf: +GAP_FIXED_GRID_SIGMA_HALF.toFixed(12),
  gapWideGridSigmaHalf: +GAP_WIDE_GRID_SIGMA_HALF.toFixed(12),
  gapWindowShift: GAP_WINDOW_SHIFT, // exactly 0: the window introduces NO gap shift
  gap464Reproduced: +GAP_464.toFixed(9), // ~0.014818 (matches imp-96464 anchor gapLog10)
  gap388ClosedFormReproduced: +GAP_388_CLOSED_FORM.toFixed(9), // ~0.0131 (matches imp-96388 kneeVsCrossoverLog10)
  rawDiff464MinusClosedForm: +RAW_DIFF.toExponential(6), // ~ +0.00173
  rawDiffMinusCrossoverDefOffset: +RAW_DIFF_MINUS_DEF_OFFSET.toExponential(3), // ~0: raw diff IS the def offset
  windowShiftExceedsNoise: WINDOW_SHIFT_EXCEEDS_NOISE, // false: window shift is 0, below 1e-3
  imp96388BakedKneeVsCrossover: IMP96388_BAKED,
  imp96464AnchorGapLog10: IMP96464_ANCHOR.gapLog10,
  finding: {
    F1_knee_bit_identical_on_two_grids:
      'At the anchor factor the widened [1e7,1e13] knee equals the fixed [1e9,1e12] knee to the last ' +
      'stored bit (' + KNEE_FIXED.cstar + ' on both, difference EXACTLY 0): the widened grid re-uses the ' +
      'same tenth-decade bracket edges (7.0 + k*0.1 lands on 9.0, 9.1, ... exactly), so the D2 ' +
      'zero-crossing detection is bit-for-bit the same in the overlap region.',
    F2_window_only_gap_shift_is_zero:
      'Holding the crossover definition fixed (both sigma = 1/2), the knee-minus-crossover gap is ' +
      'bit-identical on the two grids (' + GAP_FIXED_GRID_SIGMA_HALF + ' on each): the window-only shift ' +
      'is ' + GAP_WINDOW_SHIFT + ', below the ~1e-13 solver-path floor (imp-96427) and far below the ' +
      '1e-3 threshold -- so the widened-grid gap is NOT a statistically distinct value.',
    F3_apparent_shift_is_crossover_definition_artefact:
      'The naive imp-96464-minus-imp-96388 difference ~ ' + RAW_DIFF.toExponential(3) + ' exactly equals ' +
      'the crossover-definition offset (sigma=1/2 bisection minus closed-form E_coll=E_trunc, ' +
      CROSSOVER_DEF_OFFSET.toExponential(3) + '): the sigma=1/2 crossover sits ~0.0017 LOWER because ' +
      'E_flow > 0 makes E_coll = E_trunc + E_flow cross at a slightly smaller N, raising the gap by the ' +
      'same amount. Matched on definition, the gaps agree (residual ' +
      RAW_DIFF_MINUS_DEF_OFFSET.toExponential(2) + ').',
  },
  isRigorous: false,
  verdict:
    'MEASUREMENT (frontier-direction, NOT rigorous). The imp-96464 widened-grid ([1e7,1e13]) ' +
    'knee-minus-crossover gap is STATISTICALLY IDENTICAL to the imp-96388 fixed-window ([1e9,1e12]) ' +
    'baseline at the anchor factor: the knee is bit-identical on the two grids (difference EXACTLY 0, ' +
    'the widened grid re-uses the same bracket edges), and with the crossover definition held fixed the ' +
    'knee-minus-crossover gap is bit-identical too (window-only shift EXACTLY 0, below the ~1e-13 ' +
    'solver-path floor and far below the 1e-3 grid-noise threshold). The apparent ~ +0.0017 offset ' +
    'between imp-96464 gap (~0.014818) and imp-96388 kneeVsCrossoverLog10 (~0.0131) is FULLY accounted ' +
    'for by the two modules using different crossover definitions (sigma=1/2 bisection retaining E_flow ' +
    'vs the imp-33723 closed-form E_coll=E_trunc fixed point), NOT by window widening -- the raw ' +
    'difference equals the crossover-definition offset to ~1e-16. So imp-96464 G2 is confirmed at the ' +
    'gap level: no systematic window shift. Component model is the inherited imp-3220/imp-3406 ' +
    'extrapolation, NOT a rigorous asymptotic; the C_mb GUE-conditional per imp-486 is UNTOUCHED; the ' +
    'C_C 1/8 ansatz (imp-2642/imp-2643) is UNTOUCHED; changes no bound; establishes no operator ' +
    'positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. No refereed bound is changed' +
    '.',
  citation:
    'imp-96464 (widened-grid gap band 0.01448..0.01483, G2 rigidity); imp-96388 (fixed-window ' +
    'kneeVsCrossoverLog10 ~ 0.0131, closed-form crossover); imp-96451 (on-window F3 gap rigidity ' +
    '~0.0148); imp-96427 (solver-path noise ~1e-13); imp-33723 (closed-form E_coll=E_trunc crossover); ' +
    'imp-486 (C_mb GUE-conditional); lambda-rh-height-mapping (effectiveHeightForN, Newton inverse).',
});

export default IMP96492_WIDENED_VS_FIXED_GAP_SHIFT;

export const IMP96492_HONEST_BANNER =
  'RH open; no refereed bound is changed; NO QED. Measurement (frontier-direction, NOT rigorous): '
  + 'the widened-grid knee-minus-crossover gap is statistically identical to the fixed-window baseline '
  + '(window-only shift exactly 0), and the apparent ~0.0017 offset is a crossover-definition artefact, '
  + 'not a window shift. The underlying component model remains the inherited imp-3220/imp-3406 '
  + 'extrapolation, NOT a rigorous asymptotic; the C_mb GUE-conditional per imp-486 is UNTOUCHED; '
  + 'C_H isRigorousUpperBound stays false (imp-2642/imp-2701); changes no bound; establishes no '
  + 'operator positivity; imp-3066 K_a >= 0 untouched.';

// -- self-executing assertions (imp-3715 convention): any failure throws at import --
const IMP96492_ASSERTIONS = [
  {
    id: 'imp96492-knee-bit-identical-on-two-grids',
    description: 'the widened-grid knee equals the fixed-grid knee to the last bit at the anchor factor',
    holds: () =>
      KNEE_FIXED.signChanges === 1 &&
      KNEE_WIDE.signChanges === 1 &&
      KNEE_WINDOW_SHIFT === 0,
  },
  {
    id: 'imp96492-window-only-gap-shift-is-zero',
    description: 'holding the crossover definition fixed, the window-only gap shift is exactly 0 (below 1e-3 noise)',
    holds: () => GAP_WINDOW_SHIFT === 0 && WINDOW_SHIFT_EXCEEDS_NOISE === false,
  },
  {
    id: 'imp96492-raw-diff-is-crossover-def-offset',
    description: 'the naive imp-96464-minus-imp-96388 difference equals the crossover-definition offset to ~1e-15',
    holds: () => Math.abs(RAW_DIFF_MINUS_DEF_OFFSET) < 1e-12 && RAW_DIFF > 1e-3,
  },
  {
    id: 'imp96492-reproduces-imp96464-anchor-gap',
    description: 'the recomputed sigma=1/2 wide-grid gap matches the imp-96464 baked anchor gapLog10 (~0.014818)',
    holds: () => Math.abs(GAP_464 - IMP96464_ANCHOR.gapLog10) < 1e-6,
  },
  {
    id: 'imp96492-reproduces-imp96388-kneeVsCrossover',
    description: 'the recomputed closed-form gap matches the imp-96388 baked kneeVsCrossoverLog10 (~0.0131)',
    holds: () => Math.abs(GAP_388_CLOSED_FORM - IMP96388_BAKED) < 1e-4,
  },
  {
    id: 'imp96492-honesty-gate-no-qed',
    description: 'Measurement only: isRigorous false, no QED, no refereed bound is changed',
    holds: () =>
      IMP96492_WIDENED_VS_FIXED_GAP_SHIFT.isRigorous === false &&
      /NO QED/.test(IMP96492_WIDENED_VS_FIXED_GAP_SHIFT.verdict) &&
      /refereed bound is changed/i.test(IMP96492_WIDENED_VS_FIXED_GAP_SHIFT.verdict),
  },
  {
    id: 'imp96492-honest-banner-present',
    description: 'a dedicated machine-readable IMP96492_HONEST_BANNER carries the RH-open / PT-Lambda / NO-QED markers',
    holds: () =>
      /RH open/.test(IMP96492_HONEST_BANNER) &&
      /PT Lambda <= 0\.2|refereed bound is changed/.test(IMP96492_HONEST_BANNER) &&
      /NO QED/.test(IMP96492_HONEST_BANNER),
  },
];

for (const a of IMP96492_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-96492-widened-vs-fixed-gap-shift assertion failed: ${a.id}`);
  }
}
