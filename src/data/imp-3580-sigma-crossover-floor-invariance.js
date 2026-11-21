/**
 * @module imp-3580-sigma-crossover-floor-invariance
 *
 * imp-3580 (numerical, frontier-direction): imp-3556 certified that the sigma(N) = 1/2
 * half-decay of the conditional collision share COINCIDES with the imp-3444 E_coll = E_trunc
 * crossover -- the exact sigma = 1/2 crossing N = 3.267e9 sitting 0.40% below the crossover
 * N_x = 3.280e9, the gap being exactly the O(E_flow/E_trunc) flow correction. That was done at
 * the SINGLE baseline floor E_trunc = 3.06e-5. This module RE-ROOT-SOLVES both N_half (sigma = 1/2)
 * and N_x (E_coll = E_trunc) across the imp-3443 HALF-to-DOUBLE E_trunc floor grid (0.5x .. 2x the
 * imp-2631 baseline) and CERTIFIES which parts of the coincidence are structural and which are
 * baseline-floor-specific.
 *
 * THE QUANTITY (identical to imp-3220 / imp-3406 / imp-3463 / imp-3529 / imp-3556)
 * ------------------------------------------------------------------------------
 *     sigma(N) = E_coll / (E_trunc + E_flow + E_coll),
 *     T0     = effectiveHeightForN(N)              (Riemann-von Mangoldt inverse)
 *     E_coll = C_C_PINNED * sqrt(log T0 / N)       (dominant, GUE-conditional C_H)
 *     E_flow = C_F (log T0 / T0) * Gronwall,  C_F = (log(T0/2pi)+1)/2pi  (imp-398)
 *     E_trunc = f * 3.06e-5,  f in {0.5, 0.75, 1.0, 1.5, 2.0}   (half-to-double floor grid)
 * Same C_C_PINNED = (1/8) sqrt(3 pi), same Gronwall = exp(2.37e-4). ONLY the floor value moves;
 * no re-derivation of any sub-term, no fresh model.
 *
 * (A) THE COINCIDENCE IS EXACTLY FLOOR-INVARIANT (structural, not a baseline accident)
 * -----------------------------------------------------------------------------------
 * Dropping the tiny E_flow, sigma = x/(1+x) with x = E_coll/E_trunc, so sigma = 1/2 <=> x = 1
 * <=> E_coll = E_trunc EXACTLY, for ANY floor value. Root-solving E_coll(N) = E_trunc at every
 * node gives the odds ratio x(N_x) = 1.000000 to machine precision at all five floors, and the
 * full share sitting just under 1/2 there: sigma(N_x) = 0.499727 / 0.499622 / 0.499526 /
 * 0.499348 / 0.499184 (f = 0.5 .. 2). So the ALGEBRAIC coincidence (half-decay <=> crossover, the
 * denominator pushed just above the collision term by E_flow > 0) holds at every floor by
 * construction -- it is a structural property of the odds-ratio form, NOT a baseline-floor accident.
 *
 * (B) THE N_half / N_x RATIO STAYS ~0.996 ACROSS THE GRID
 * -------------------------------------------------------
 * Root-solving BOTH crossings at each floor (400-iter bisection in ln N, residual < 1e-9):
 *   f=0.5   E_trunc=1.530e-5   N_half=1.395523e10  N_x=1.398717e10  ratio=0.997717  gap=0.228%
 *   f=0.75  E_trunc=2.295e-5   N_half=5.972372e9   N_x=5.991331e9   ratio=0.996836  gap=0.316%
 *   f=1.0   E_trunc=3.060e-5   N_half=3.267235e9   N_x=3.280294e9   ratio=0.996019  gap=0.398%  <- imp-3556
 *   f=1.5   E_trunc=4.590e-5   N_half=1.393979e9   N_x=1.401669e9   ratio=0.994514  gap=0.549%
 *   f=2.0   E_trunc=6.120e-5   N_half=7.607425e8   N_x=7.660072e8   ratio=0.993127  gap=0.687%
 * The ratio stays in the tight band [0.99313, 0.99772] ~ 0.996 +- 0.0023 across the whole
 * half-to-double window, and the baseline node reproduces imp-3556 to the last digit (0.996019,
 * gap 0.398%, N_x = 3.280294e9).
 *
 * (C) HONEST REFINEMENT: the ~0.40% flow-gap is NOT a floor-invariant CONSTANT
 * ----------------------------------------------------------------------------
 * The gap is not fixed at 0.40%: it grows monotonically with the floor, 0.228% (0.5x) ->
 * 0.398% (1x) -> 0.687% (2x), straddling the imp-3556 baseline 0.40%. What IS invariant is the
 * STRUCTURAL LAW behind it. Since E_coll ~ sqrt(log T0 / N) and sigma = 1/2 requires
 * E_coll = E_trunc + E_flow while the crossover requires E_coll = E_trunc, the ~sqrt(N_x/N_half)
 * inversion gives
 *     gap = 1 - N_half/N_x  ~  2 E_flow(N_x) / E_trunc   (leading order in E_flow/E_trunc).
 * The measured gap tracks 2 E_flow(N_x)/E_trunc across the grid within the sqrt/log-drift
 * linearization: 0.228 vs 0.218, 0.316 vs 0.302, 0.398 vs 0.380, 0.549 vs 0.522, 0.687 vs 0.653
 * (percent). So the coincidence is a genuine E_flow/E_trunc PROPERTY -- exactly as imp-3556
 * suspected -- but the SPECIFIC 0.40% is a baseline-floor reading of that law, not a universal
 * constant. This is the honest correction to a literal "gap stays ~0.40%" expectation.
 *
 * THE FINDING (measurement / certification only)
 * ----------------------------------------------
 *   (F1) The half-decay <=> crossover coincidence is EXACTLY floor-invariant: root-solving
 *        E_coll = E_trunc gives x(N_x) = 1.000000 and sigma(N_x) just under 1/2 (0.4992..0.4997)
 *        at every node of the half-to-double grid -- a structural odds-ratio property, not a
 *        baseline-floor accident.
 *   (F2) The N_half/N_x ratio stays in the tight band [0.99313, 0.99772] ~ 0.996 across the grid,
 *        with the baseline node reproducing imp-3556 (0.996019, N_x = 3.280294e9) exactly.
 *   (F3) HONEST REFINEMENT: the flow-gap is NOT a fixed 0.40% -- it grows monotonically with the
 *        floor (0.228% -> 0.687%, straddling the baseline 0.40%) and tracks the structural law
 *        gap ~ 2 E_flow(N_x)/E_trunc within the sqrt/log linearization. The 0.40% is a baseline
 *        reading of an E_flow/E_trunc law, not a universal constant.
 *
 * DERIVATION / MEASUREMENT ONLY. No positivity, no bridge closure, no RH claim, NO QED.
 * imp-3066 off-diagonal endpoint-Hankel K_a >= 0 positivity UNTOUCHED. No refereed bound is changed.
 *
 * @see imp-3556-sigma-threshold-crossings-rootsolve (baseline-floor half-decay <=> crossover certification)
 * @see imp-3444-sigma-nshape-landmark-ladder (E_coll = E_trunc crossover N ~ 3.280e9)
 * @see imp-3443-nmax-etrunc-sensitivity (half-to-double E_trunc floor grid 0.5x .. 2x)
 * @see imp-3462-nmax-turnover-exponent-derivation (closed floor-elasticity of the interior landmark)
 * @see imp-2631-honest-truncation-route-assessment (baseline floor E_trunc = 3.06e-5)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 = gamma_N)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_BASE = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3220/imp-3556)
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-3220/imp-3406/imp-3463/imp-3556 exactly

// EXACT imp-3406/imp-3463/imp-3556 sub-terms (no re-derivation); only E_trunc is a parameter.
function parts(N, eTrunc) {
  const T0 = effectiveHeightForN(N);
  const L = Math.log(T0);
  const C_F = (Math.log(T0 / TWO_PI) + 1) / TWO_PI; // imp-398 pinned prefactor
  const E_flow = C_F * (L / T0) * GRONWALL;
  const E_coll = C_C_PINNED * Math.sqrt(L / N); // GUE-conditional (C_H)
  const E_N = eTrunc + E_flow + E_coll;
  return { T0, L, E_flow, E_coll, E_N, sigma: E_coll / E_N };
}

// Right-arm interior maximum (ternary in ln N; same bracket as imp-3406/imp-3556) -- the flat cap
// above which sigma is strictly decreasing, so a single half-decay crossing is bracketed.
function argmaxSigmaLnN(loN, hiN, eTrunc) {
  let lo = Math.log(loN);
  let hi = Math.log(hiN);
  for (let i = 0; i < 500; i++) {
    const m1 = lo + (hi - lo) / 3;
    const m2 = hi - (hi - lo) / 3;
    if (parts(Math.exp(m1), eTrunc).sigma < parts(Math.exp(m2), eTrunc).sigma) lo = m1;
    else hi = m2;
  }
  return Math.exp((lo + hi) / 2);
}

// N_half: post-peak crossing where sigma first drops below 1/2 (400-iter bisection in ln N).
function crossHalf(eTrunc) {
  const nMax = argmaxSigmaLnN(1e4, 1e9, eTrunc);
  let a = Math.log(nMax);
  let b = Math.log(1e60);
  for (let i = 0; i < 400; i++) {
    const m = (a + b) / 2;
    if (parts(Math.exp(m), eTrunc).sigma > 0.5) a = m;
    else b = m;
  }
  return Math.exp((a + b) / 2);
}

// N_x: the imp-3444 crossover where E_coll(N) = E_trunc (odds ratio x = 1 there).
function crossCollEqTrunc(eTrunc) {
  let a = Math.log(1e6);
  let b = Math.log(1e15);
  for (let i = 0; i < 400; i++) {
    const m = (a + b) / 2;
    if (parts(Math.exp(m), eTrunc).E_coll > eTrunc) a = m;
    else b = m;
  }
  return Math.exp((a + b) / 2);
}

// (A)+(B)+(C) Re-root-solve both crossings across the half-to-double floor grid.
const FACTORS = [0.5, 0.75, 1.0, 1.5, 2.0];
const GRID = FACTORS.map((f) => {
  const eTrunc = f * E_TRUNC_BASE;
  const N_half = crossHalf(eTrunc);
  const N_x = crossCollEqTrunc(eTrunc);
  const px = parts(N_x, eTrunc);
  const ratio = N_half / N_x;
  const gap_pct = (1 - ratio) * 100;
  const eflow_over_etrunc = px.E_flow / eTrunc;
  return {
    factor: f,
    E_trunc: +eTrunc.toExponential(4),
    N_half: +N_half.toExponential(6),
    N_x: +N_x.toExponential(6),
    ratio_half_over_x: +ratio.toFixed(6),
    flow_gap_pct: +gap_pct.toFixed(4),
    sigma_at_x: +px.sigma.toFixed(6), // just under 1/2 by the E_flow correction
    x_at_x: +(px.E_coll / eTrunc).toFixed(6), // 1.000000 at every node (the coincidence)
    structural_gap_pct: +(2 * eflow_over_etrunc * 100).toFixed(4), // 2 E_flow(N_x)/E_trunc law
    residual_half: +Math.abs(parts(N_half, eTrunc).sigma - 0.5).toExponential(2), // certified root
  };
});

const BASELINE = GRID.find((r) => r.factor === 1.0);
const RATIOS = GRID.map((r) => r.ratio_half_over_x);
const GAPS = GRID.map((r) => r.flow_gap_pct);
const RATIO_MIN = Math.min(...RATIOS);
const RATIO_MAX = Math.max(...RATIOS);
const GAP_MIN = Math.min(...GAPS);
const GAP_MAX = Math.max(...GAPS);
// The measured flow-gap tracks the 2 E_flow/E_trunc structural law within the sqrt/log linearization.
const MAX_LAW_REL_ERR = Math.max(
  ...GRID.map((r) => Math.abs(r.flow_gap_pct / r.structural_gap_pct - 1))
);

export const IMP3580_SIGMA_CROSSOVER_FLOOR_INVARIANCE = {
  id: 'imp-3580',
  proofSection: 'S-frontier',
  question:
    'Certify whether the imp-3556 sigma=1/2 <=> E_coll=E_trunc crossover coincidence is robust to ' +
    'the imp-2631 E_trunc floor value: re-root-solve N_half and N_x across the imp-3443 half-to-double ' +
    'floor grid (0.5x..2x baseline) and test whether the N_half/N_x ratio and the ~0.40% flow-gap are ' +
    'floor-invariant. Measurement/certification only; conditional-share diagnostic, NOT an RH bound; no QED.',
  quantity: 'sigma(N)=E_coll/(E_trunc+E_flow+E_coll) with E_trunc=f*3.06e-5; N_half (sigma=1/2) and N_x (E_coll=E_trunc) root-solved per floor',
  floorGrid: GRID,
  baselineNode: BASELINE, // reproduces imp-3556: ratio 0.996019, N_x 3.280294e9, gap 0.398%
  ratioBand: { min: +RATIO_MIN.toFixed(6), max: +RATIO_MAX.toFixed(6), around: 0.996 },
  gapBand: { min: +GAP_MIN.toFixed(4), max: +GAP_MAX.toFixed(4), baseline: BASELINE.flow_gap_pct },
  maxStructuralLawRelErr: +MAX_LAW_REL_ERR.toFixed(4), // gap vs 2 E_flow/E_trunc within linearization
  finding: {
    F1_coincidence_exactly_invariant:
      'The half-decay <=> crossover coincidence is EXACTLY floor-invariant: root-solving ' +
      'E_coll=E_trunc gives x(N_x)=1.000000 and sigma(N_x) just under 1/2 (0.4992..0.4997) at ' +
      'every node of the half-to-double grid -- a structural odds-ratio property, not a ' +
      'baseline-floor accident.',
    F2_ratio_stays_996:
      'The N_half/N_x ratio stays in the tight band [' + RATIO_MIN.toFixed(6) + ', ' +
      RATIO_MAX.toFixed(6) + '] ~ 0.996 across the grid; the baseline node reproduces imp-3556 ' +
      '(ratio 0.996019, N_x=3.280294e9) exactly.',
    F3_gap_not_constant:
      'HONEST REFINEMENT: the flow-gap is NOT a fixed 0.40% -- it grows monotonically with the ' +
      'floor (0.228% -> 0.687%, straddling the baseline 0.40%) and tracks the structural law ' +
      'gap ~ 2 E_flow(N_x)/E_trunc within the sqrt/log linearization. The 0.40% is a baseline ' +
      'reading of an E_flow/E_trunc law, not a universal constant.',
  },
  isRigorous: false,
  verdict:
    'MEASUREMENT/CERTIFICATION (frontier-direction, NOT rigorous). Re-root-solving BOTH the ' +
    'sigma=1/2 half-decay N_half and the E_coll=E_trunc crossover N_x across the imp-3443 ' +
    'half-to-double E_trunc floor grid (0.5x..2x the imp-2631 baseline 3.06e-5; each a certified ' +
    '400-iter bisection root, residual <1e-9) shows: (F1) the coincidence itself is EXACTLY ' +
    'floor-invariant -- x(N_x)=E_coll/E_trunc=1.000000 and sigma(N_x) just under 1/2 ' +
    '(0.499727/0.499622/0.499526/0.499348/0.499184 for f=0.5..2) at every node, a structural ' +
    'odds-ratio property (sigma=x/(1+x), sigma=1/2 <=> x=1) that holds at ANY floor by ' +
    'construction, NOT a baseline accident; (F2) the N_half/N_x ratio stays in the tight band ' +
    '[0.99313, 0.99772] ~ 0.996 across the whole window, with the baseline node reproducing ' +
    'imp-3556 to the last digit (0.996019, N_x=3.280294e9, gap 0.398%); (F3) but -- HONEST ' +
    'REFINEMENT of a literal "gap stays ~0.40%" expectation -- the flow-gap 1-N_half/N_x is NOT a ' +
    'fixed constant: it grows monotonically with the floor (0.228% at 0.5x -> 0.398% at 1x -> ' +
    '0.687% at 2x, straddling the baseline) because it tracks the structural law ' +
    'gap ~ 2 E_flow(N_x)/E_trunc (measured vs law agree within the sqrt/log-drift linearization, ' +
    'max rel err ~5%). So the coincidence is a genuine E_flow/E_trunc property -- exactly as ' +
    'imp-3556 suspected -- but the specific 0.40% is a baseline-floor READING of that law, not a ' +
    'universal constant. Measurement/certification only; no positivity, no bridge closure, no RH ' +
    'claim, NO QED. imp-3066 off-diagonal endpoint-Hankel K_a>=0 positivity UNTOUCHED. ' +
    'No refereed bound is changed.',
  citation:
    'imp-3556 (baseline half-decay <=> crossover certification, ratio 0.996019, gap 0.40%); ' +
    'imp-3444 (E_coll=E_trunc crossover N ~ 3.280e9); imp-3443 (half-to-double E_trunc floor grid ' +
    '0.5x..2x); imp-3462 (closed floor-elasticity of the interior landmark); imp-3220 (U-shaped ' +
    'sigma(N) exact sub-terms); imp-2642 (C_H=1/8 ansatz); imp-398 (E_flow C_F prefactor); ' +
    'imp-2631 (E_trunc fixed-strip floor 3.06e-5); lambda-rh-height-mapping (effectiveHeightForN).',
};

export const IMP3580_SIGMA_CROSSOVER_FLOOR_INVARIANCE_ASSERTIONS = [
  {
    // (F1) The coincidence is EXACTLY floor-invariant: at every crossover node the odds ratio
    // x = E_coll/E_trunc = 1 to machine precision and sigma sits just under 1/2 by the E_flow term.
    id: 'imp3580-coincidence-exactly-floor-invariant',
    description: 'x(N_x)=1.000000 and sigma(N_x) in (0.499, 0.5) at every half-to-double floor node',
    holds: () =>
      GRID.every((r) => Math.abs(r.x_at_x - 1) < 1e-5) &&
      GRID.every((r) => r.sigma_at_x > 0.499 && r.sigma_at_x < 0.5),
  },
  {
    // (F1) Both crossings are certified roots: the half-decay residual lands at machine level.
    id: 'imp3580-half-decay-roots-certified',
    description: 'sigma(N_half) residual < 1e-9 at every floor node',
    holds: () => GRID.every((r) => r.residual_half < 1e-9),
  },
  {
    // (F2) The N_half/N_x ratio stays ~0.996 across the whole half-to-double window.
    id: 'imp3580-ratio-stays-around-996',
    description: 'N_half/N_x ratio band [0.993, 0.998] ~ 0.996 across 0.5x..2x floors',
    holds: () => RATIO_MIN > 0.993 && RATIO_MAX < 0.998 && GRID.every((r) => Math.abs(r.ratio_half_over_x - 0.996) < 3e-3),
  },
  {
    // (F2) The baseline floor node reproduces imp-3556 to the last digit.
    id: 'imp3580-baseline-reproduces-imp3556',
    description: 'f=1.0 node reproduces imp-3556: ratio 0.996019, N_x 3.280294e9, gap 0.398%',
    holds: () =>
      Math.abs(BASELINE.ratio_half_over_x - 0.996019) < 1e-6 &&
      Math.abs(BASELINE.N_x / 3.280294e9 - 1) < 1e-5 &&
      Math.abs(BASELINE.flow_gap_pct - 0.398) < 2e-3,
  },
  {
    // (F3) HONEST REFINEMENT: the flow-gap is NOT a fixed 0.40% -- it grows monotonically with the
    // floor (so a literal "gap stays ~0.40%" expectation is false), while tracking the structural
    // law gap ~ 2 E_flow(N_x)/E_trunc within the sqrt/log linearization.
    id: 'imp3580-gap-monotone-not-constant-tracks-law',
    description: 'flow-gap grows monotonically with floor (0.228->0.687%), tracks 2 E_flow/E_trunc within ~5%',
    holds: () => {
      for (let i = 1; i < GRID.length; i++) if (!(GRID[i].flow_gap_pct > GRID[i - 1].flow_gap_pct)) return false;
      return GAP_MIN < 0.3 && GAP_MAX > 0.6 && MAX_LAW_REL_ERR < 0.07;
    },
  },
  {
    // Honesty gate: measurement/certification only, no QED, no refereed bound is changed, imp-3066 untouched.
    id: 'imp3580-honesty-gate-no-qed',
    description: 'Measurement/certification only: no QED, no refereed bound is changed, imp-3066 untouched',
    holds: () =>
      IMP3580_SIGMA_CROSSOVER_FLOOR_INVARIANCE.isRigorous === false &&
      /NO QED/.test(IMP3580_SIGMA_CROSSOVER_FLOOR_INVARIANCE.verdict) &&
      /refereed bound is changed/i.test(IMP3580_SIGMA_CROSSOVER_FLOOR_INVARIANCE.verdict) &&
      /imp-3066[^.]*UNTOUCHED/.test(IMP3580_SIGMA_CROSSOVER_FLOOR_INVARIANCE.verdict),
  },
];

for (const a of IMP3580_SIGMA_CROSSOVER_FLOOR_INVARIANCE_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-3580-sigma-crossover-floor-invariance assertion failed: ${a.id}`);
  }
}
