/**
 * @module imp-34348-eflow-gronwall-offset-tc-a1-sensitivity
 *
 * imp-34348 (numerical, frontier-direction): imp-34270 formed the explicit leading E_flow
 * (Gronwall) correction to the ~0.4% offset between the closed-form crossover N_cross and the
 * sigma = 1/2 halving landmark N_half, and reported that the leading 2*E_flow/E_trunc term
 * reproduces 95.74% of the measured relative offset. That whole component chain enters through
 * ONE hard-coded constant: GRONWALL = exp(1.0 * TC_A1_TRAP) with TC_A1_TRAP = 2.37e-4, the
 * imp-3406/imp-33582 A1-trap trapezoid constant that multiplies E_flow. This module measures how
 * much the ~95.7% leading-2r attribution SHARE moves as TC_A1_TRAP is varied across the imp-3406 /
 * imp-2762 A1-trap uncertainty band -- i.e. it bounds the robustness of the leading-vs-drift split
 * to the one constant it depends on multiplicatively.
 *
 * THE BAND (imp-2762 A1 |t_c| trap uncertainty)
 * ---------------------------------------------
 * The trap constant is the worst-case |t_c| <= g_min^2/6, certified by imp-2762 as an
 * outward-rounded interval around g_min^2/6 = 2.368628e-4 with 2.37e-4 the safe rounded-up display
 * ceiling. Because it is an UPPER bound, the honest band on t_c runs from 0 (no A1 amplification,
 * GRONWALL = 1) up through the machine nominal g_min^2/6 and the display ceiling 2.37e-4, to the
 * doubled C_G = 2 flow-factor worst case 4.74e-4 (glossary bracket [1, exp(2*2.37e-4)]). Sweeping
 * TC_A1_TRAP over that whole span is equivalent to sweeping the E_flow multiplier GRONWALL over
 * [1, exp(4.74e-4)] = [1, 1.000474].
 *
 * THE MECHANISM (why the share barely moves)
 * ------------------------------------------
 * E_flow = C_F * (L/T0) * GRONWALL scales linearly in GRONWALL, so r = E_flow/E_trunc and the
 * leading term 2r scale linearly too. But GRONWALL stays within 4.74e-4 of 1 across the entire
 * band, so 2r moves by at most that fraction; and the SHARE = 2r / relOffset = 2r / (2r + deltaL)
 * moves an order of magnitude LESS, because the log T0 drift deltaL is (to leading order)
 * GRONWALL-independent and the same E_flow scaling appears in numerator and denominator.
 *
 * THE FINDING (sensitivity measurement only)
 * ------------------------------------------
 *   (F1) BASELINE REPRODUCES imp-34270. At the imp-34270 constant TC_A1_TRAP = 2.37e-4 the leading
 *        share is 9.573890e-1 -- identical to imp-34270's reported 0.957390, confirming the sweep
 *        reduces to the parent module at the hard-coded value.
 *   (F2) THE ATTRIBUTION IS INVARIANT TO 6 FIGURES ACROSS THE WHOLE BAND. As TC_A1_TRAP runs over
 *        [0, 4.74e-4] the leading-2r share moves monotonically from 9.573884e-1 (t_c = 0) to
 *        9.573897e-1 (doubled worst case) -- a total swing of just 1.338108e-6 absolute
 *        (~1.397664e-6 relative). So the ~95.7% leading-vs-drift split is robust to the one
 *        multiplicative constant it inherits: even zeroing the A1 amplification entirely, or
 *        doubling it to the C_G = 2 flow-factor ceiling, changes the attribution share by under two
 *        parts per million. The Gronwall constant is NOT a hidden lever on the imp-34270 headline.
 *
 * SENSITIVITY MEASUREMENT ONLY. Conditional-share diagnostic, NOT an RH bound. The component model
 * is the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the C_mb
 * GUE-conditional per imp-486 is UNTOUCHED; the C_C 1/8 ansatz (imp-2642/imp-2643) is UNTOUCHED;
 * changes no bound; establishes no operator positivity; imp-3066 K_a >= 0 untouched; no RH verdict,
 * NO QED. No refereed bound is changed.
 *
 * @see imp-34270-eflow-gronwall-crossover-offset-correction (forms the leading 2r attribution this varies)
 * @see imp-2762-tc-a1-trap-interval (outward-rounded A1 |t_c| trap certificate: nominal 2.368628e-4, ceiling 2.37e-4)
 * @see imp-2644-eflow-gronwall-cg-discharge (TC_A1 = g_min^2/6 literal, C_G in [1,2] flow factor)
 * @see imp-33723-sigma-half-vs-crossover-closed-form (closed-form N_cross; named the E_flow offset)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 via Riemann-von Mangoldt inverse)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3406/imp-33582)

// imp-34270 hard-codes GRONWALL = exp(1.0 * TC_A1_TRAP), TC_A1_TRAP = 2.37e-4. We rebuild the
// exact imp-34270 sub-terms but parameterize the ONE constant, so parts(N, tc) at tc = 2.37e-4 is
// byte-identical to the imp-34270 module.
function makeParts(tc) {
  const GRONWALL = Math.exp(1.0 * tc);
  return function parts(N) {
    const T0 = effectiveHeightForN(N);
    const L = Math.log(T0);
    const C_F = (Math.log(T0 / TWO_PI) + 1) / TWO_PI; // imp-398 pinned prefactor
    const E_flow = C_F * (L / T0) * GRONWALL;
    const E_coll = C_C_PINNED * Math.sqrt(L / N); // GUE-conditional (C_H ansatz)
    const E_N = E_TRUNC_PT + E_flow + E_coll;
    return { T0, L, E_flow, E_coll, E_N, sigma: E_coll / E_N };
  };
}

// Downslope bisection in log N for a strictly-decreasing quantity (reference locator).
function crossBelow(f, target, lo, hi) {
  let a = Math.log(lo);
  let b = Math.log(hi);
  for (let i = 0; i < 300; i++) {
    const m = (a + b) / 2;
    if (f(Math.exp(m)) > target) a = m;
    else b = m;
  }
  return Math.exp((a + b) / 2);
}

// Closed-form crossover (imp-33723 fixed point) -- E_flow is DROPPED at the crossover, so N_cross
// is independent of TC_A1_TRAP; only the halving landmark N_half moves with the constant.
const K_AMPL = (C_C_PINNED / E_TRUNC_PT) ** 2;
function crossoverFixedPoint(seed, iters) {
  let N = seed;
  for (let i = 0; i < iters; i++) N = K_AMPL * Math.log(effectiveHeightForN(N));
  return N;
}
const N_CROSS = crossoverFixedPoint(1e9, 40); // ~3.280294e9

// End-to-end recompute of the imp-34270 leading-2r share at one value of the A1-trap constant.
function shareAt(tc) {
  const parts = makeParts(tc);
  const N_half = crossBelow((N) => parts(N).sigma, 0.5, 1e6, 1e18);
  const P_half = parts(N_half);
  const P_cross = parts(N_CROSS);
  const relOffset = (N_CROSS - N_half) / N_CROSS;
  const r = P_half.E_flow / E_TRUNC_PT;
  const predLeading = 2 * r; // doubled by inverse-sqrt E_coll ~ N^{-1/2}
  const leadingShare = predLeading / relOffset;
  return { tc, N_half, relOffset, r, predLeading, leadingShare };
}

// ── The A1-trap uncertainty band (imp-2762 / imp-2644) ──────────────────────
const TC_A1_BASELINE = 2.37e-4; // imp-34270 hard-coded display ceiling
const BAND = [
  { name: 'zero_floor_gronwall_1', tc: 0 }, // no A1 amplification, GRONWALL = 1
  { name: 'machine_nominal_gmin2_over_6', tc: 2.368628e-4 }, // imp-2762 TC_A1_FLOAT
  { name: 'display_ceiling_baseline_imp34270', tc: TC_A1_BASELINE }, // imp-34270 value
  { name: 'doubled_cg2_flowfactor_end', tc: 4.74e-4 }, // glossary [1, exp(2*2.37e-4)]
];

const SWEEP = BAND.map((pt) => ({ ...pt, ...shareAt(pt.tc) }));
const SHARES = SWEEP.map((s) => s.leadingShare);
const SHARE_MIN = Math.min(...SHARES);
const SHARE_MAX = Math.max(...SHARES);
const SHARE_ABS_SWING = SHARE_MAX - SHARE_MIN;

const BASELINE = SWEEP.find((s) => s.tc === TC_A1_BASELINE);
const SHARE_REL_SWING = SHARE_ABS_SWING / BASELINE.leadingShare;

// The mechanism: the E_flow multiplier GRONWALL barely leaves 1 across the whole band.
const GRONWALL_SPAN = Math.exp(4.74e-4) - Math.exp(0); // ~4.74e-4

export const IMP34348_EFLOW_GRONWALL_OFFSET_TC_A1_SENSITIVITY = {
  id: 'imp-34348',
  proofSection: 'S-frontier',
  question:
    'imp-34270 reports the leading 2*E_flow/E_trunc term reproduces ~95.7% of the crossover-vs-halving ' +
    'offset, with E_flow scaled by GRONWALL = exp(1.0 * TC_A1_TRAP), TC_A1_TRAP = 2.37e-4 hard-coded. ' +
    'Measure how much that 95.7% attribution share moves as TC_A1_TRAP is varied across the imp-3406 / ' +
    'imp-2762 A1-trap uncertainty band. Sensitivity measurement only; changes no bound; no QED.',
  band: {
    constant: 'TC_A1_TRAP (A1 |t_c| trap, g_min^2/6; multiplies E_flow via GRONWALL = exp(TC_A1_TRAP))',
    source: 'imp-2762 outward-rounded certificate: nominal g_min^2/6 = 2.368628e-4, display ceiling 2.37e-4',
    span_swept: '[0, 4.74e-4] (zero A1 amplification -> doubled C_G=2 flow-factor worst case)',
    gronwall_multiplier_span: +GRONWALL_SPAN.toExponential(6), // ~4.741124e-4
  },
  sweep: SWEEP.map((s) => ({
    name: s.name,
    tc_A1: +s.tc.toExponential(6),
    N_half: +s.N_half.toExponential(6),
    rel_offset: +s.relOffset.toExponential(6),
    leading_share: +s.leadingShare.toExponential(6),
  })),
  sensitivity: {
    baseline_share_at_2p37e4: +BASELINE.leadingShare.toExponential(6), // 9.573890e-1
    share_min_over_band: +SHARE_MIN.toExponential(6), // 9.573884e-1
    share_max_over_band: +SHARE_MAX.toExponential(6), // 9.573897e-1
    abs_swing_over_band: +SHARE_ABS_SWING.toExponential(6), // ~1.338108e-6
    rel_swing_over_band: +SHARE_REL_SWING.toExponential(6), // ~1.397664e-6
  },
  finding: {
    F1_baseline_reproduces_imp34270:
      'At the imp-34270 hard-coded TC_A1_TRAP = 2.37e-4 the leading-2r share is 9.573890e-1, ' +
      'identical to imp-34270 reported 0.957390: the parameterized sweep reduces to the parent ' +
      'module at the pinned value.',
    F2_attribution_invariant_across_band:
      'As TC_A1_TRAP runs over the full A1-trap band [0, 4.74e-4] the leading-2r share moves ' +
      'monotonically from 9.573884e-1 (t_c = 0, no amplification) to 9.573897e-1 (doubled C_G=2 ' +
      'worst case) -- a swing of just 1.338108e-6 absolute (~1.397664e-6 relative). The ~95.7% ' +
      'leading-vs-drift split is invariant to 6 figures across the whole uncertainty band because ' +
      'GRONWALL = exp(TC_A1_TRAP) stays within 4.74e-4 of 1 and the share is a ratio in which the ' +
      'E_flow scaling largely cancels; TC_A1_TRAP is NOT a hidden lever on the imp-34270 headline.',
  },
  isRigorous: false,
  verdict:
    'SENSITIVITY MEASUREMENT (frontier-direction, NOT rigorous). imp-34270 attributes 95.74% of the ' +
    'crossover-vs-halving offset to the leading 2*E_flow/E_trunc term, with E_flow multiplied by the ' +
    'single hard-coded A1-trap constant GRONWALL = exp(1.0 * TC_A1_TRAP), TC_A1_TRAP = 2.37e-4. ' +
    'Varying that constant end-to-end across the imp-2762-certified A1-trap band [0, 4.74e-4] (zero ' +
    'amplification through g_min^2/6 = 2.368628e-4 and the 2.37e-4 display ceiling to the doubled ' +
    'C_G=2 flow-factor worst case) moves the leading-2r share by only 1.338108e-6 absolute ' +
    '(~1.397664e-6 relative), monotonically; the baseline value reproduces imp-34270 exactly. So the ' +
    '95.7% leading-vs-drift split is robust to ~6 figures against the one constant it depends on ' +
    'multiplicatively -- the Gronwall trapezoid constant is not a hidden lever on the imp-34270 ' +
    'finding. The component model is the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous ' +
    'asymptotic; the C_mb GUE-conditional per imp-486 and the C_C 1/8 ansatz (imp-2642/imp-2643) are ' +
    'UNTOUCHED; changes no bound; establishes no operator positivity; imp-3066 K_a >= 0 untouched; no ' +
    'RH verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-34270 (leading 2r attribution; GRONWALL = exp(1.0*TC_A1_TRAP)); imp-2762 (A1 |t_c| trap ' +
    'interval certificate, nominal 2.368628e-4, ceiling 2.37e-4); imp-2644 (TC_A1 = g_min^2/6, C_G ' +
    'in [1,2]); imp-33723 (closed-form N_cross); imp-33582 (sigma=1/2 halving landmark); ' +
    'lambda-rh-height-mapping (effectiveHeightForN inverse).',
};

export const IMP34348_EFLOW_GRONWALL_OFFSET_TC_A1_SENSITIVITY_ASSERTIONS = [
  {
    // (F1): the baseline sweep point reproduces the imp-34270 reported leading share.
    id: 'imp34348-baseline-reproduces-imp34270',
    description: 'leading share at TC_A1_TRAP=2.37e-4 reproduces imp-34270 0.957390',
    holds: () => Math.abs(BASELINE.leadingShare - 0.957390) < 1e-5,
  },
  {
    // (F2): the share is invariant to ~6 figures across the whole A1-trap band.
    id: 'imp34348-share-invariant-across-band',
    description: 'leading share swing over [0, 4.74e-4] is < 1e-5 absolute (robust attribution)',
    holds: () => SHARE_ABS_SWING < 1e-5 && SHARE_REL_SWING < 1e-5,
  },
  {
    // The share moves monotonically upward with the amplifying constant (band endpoints bracket).
    id: 'imp34348-share-monotone-in-tc',
    description: 'share(t_c=0) < share(2.37e-4) < share(4.74e-4): monotone in the A1 constant',
    holds: () => {
      const s0 = SWEEP.find((s) => s.tc === 0).leadingShare;
      const sb = BASELINE.leadingShare;
      const sd = SWEEP.find((s) => s.tc === 4.74e-4).leadingShare;
      return s0 < sb && sb < sd;
    },
  },
  {
    // Mechanism: the E_flow multiplier GRONWALL stays within 5e-4 of 1 over the whole band.
    id: 'imp34348-gronwall-multiplier-near-one',
    description: 'GRONWALL=exp(TC_A1_TRAP) spans < 5e-4 across the band (small-lever mechanism)',
    holds: () => GRONWALL_SPAN > 0 && GRONWALL_SPAN < 5e-4,
  },
  {
    // Honesty gate: sensitivity measurement only, no QED, no refereed bound is changed.
    id: 'imp34348-honesty-gate-no-qed',
    description: 'Sensitivity only: isRigorous false, no QED, no refereed bound is changed',
    holds: () =>
      IMP34348_EFLOW_GRONWALL_OFFSET_TC_A1_SENSITIVITY.isRigorous === false &&
      /NO QED/.test(IMP34348_EFLOW_GRONWALL_OFFSET_TC_A1_SENSITIVITY.verdict) &&
      /refereed bound is changed/i.test(IMP34348_EFLOW_GRONWALL_OFFSET_TC_A1_SENSITIVITY.verdict),
  },
];

for (const a of IMP34348_EFLOW_GRONWALL_OFFSET_TC_A1_SENSITIVITY_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-34348-eflow-gronwall-offset-tc-a1-sensitivity assertion failed: ${a.id}`);
  }
}
