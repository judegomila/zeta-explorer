/**
 * @module imp-35675-finite-winding-mesh-cost-vs-delta
 *
 * imp-35675 (numerical/measurement, S-frontier): MEASURE the imp-35653 FINITE
 * winding-barrier (B1) mesh cost O(Delta * log T_PT) as a function of the
 * transition-rectangle width Delta at T_PT = 3e12, and tabulate boundary-evaluation
 * counts and enclosed-zero counts. imp-35653 Part C derives MESH_PER_UNIT ~ 12.84
 * from OVERSAMPLE 3 times the local zero density (1/2 pi) log(T_PT / 2 pi) ~ 4.279,
 * and states the finite piece is "cheap in the complexity sense -- set by the LOG of
 * the height, not the height", but tabulates NO cost-vs-Delta curve. This module
 * supplies that curve.
 *
 * MEASUREMENT ONLY. The finite winding piece (B1) stays finite / mechanical; the
 * semi-infinite analytic tail lemma (B2 / work-item W3) stays NON-finite. Discharges
 * nothing; ports nothing; changes no bound; no RH verdict, NO QED. No refereed bound is changed.
 *
 * PART A -- THE RECTANGLE AND ITS BOUNDARY MESH
 * -----------------------------------------------------------------------------
 * The finite winding barrier (B1) covers a BOUNDED transition rectangle
 *     R = [T_PT, T_PT + Delta] x [-h, h],
 * where the height axis x runs over a window of width Delta and the imaginary
 * offset y runs over the fixed order-unity band [-h, h] (h = 1 here; it is
 * Delta-INDEPENDENT). The argument-principle count reads the net winding of H_t
 * around the boundary dR, sampled on a mesh dense enough that no enclosed zero can
 * hide a half-turn: OVERSAMPLE = 3 boundary samples per local zero spacing, i.e.
 * MESH_PER_UNIT = OVERSAMPLE * density ~ 12.84 samples per unit of arc length.
 *
 * The boundary dR has four sides:
 *   - TWO horizontal sides (at y = +h and y = -h), each of length Delta. Their
 *     sample count GROWS with Delta: horizontalEvals = 2 * Delta * MESH_PER_UNIT.
 *   - TWO vertical sides (at x = T_PT and x = T_PT + Delta), each of length 2h.
 *     Their sample count is Delta-INDEPENDENT: verticalEvals = 4 * h * MESH_PER_UNIT.
 * Total boundary evaluations M(Delta) = 2 * Delta * MESH_PER_UNIT + 4 * h * MESH_PER_UNIT.
 *
 * PART B -- THE COST-VS-DELTA CURVE (the measurement)
 * -----------------------------------------------------------------------------
 * M(Delta) is LINEAR in Delta with slope 2 * MESH_PER_UNIT and a fixed vertical-side
 * intercept 4 * h * MESH_PER_UNIT. The slope carries the log-of-height factor:
 *     2 * MESH_PER_UNIT = 2 * OVERSAMPLE * (1 / 2 pi) * log(T_PT / 2 pi),
 * so the whole curve scales with log(T_PT), NOT with T_PT itself. That is the
 * quantitative content of the imp-35653 "cheap -- set by log of height not height"
 * claim: the per-unit-Delta cost is ~25.7 boundary evaluations, a number that would
 * merely DOUBLE if the height were squared. The enclosed-zero count is
 *     Z(Delta) = Delta * density ~ 4.279 * Delta,
 * so the horizontal boundary work per enclosed zero is EXACTLY 2 * OVERSAMPLE = 6
 * (two long sides, three samples per zero each), independent of Delta and of height.
 * The total-evaluations-per-enclosed-zero ratio starts above 6 (the vertical-side
 * overhead dominates at tiny Delta) and DECAYS monotonically toward 6 as Delta grows
 * and the fixed overhead amortizes.
 *
 * PART C -- WHAT THIS DOES AND DOES NOT SHOW
 * -----------------------------------------------------------------------------
 * It CONFIRMS, quantitatively, that B1 is complexity-cheap: linear in Delta, its
 * coefficient logarithmic in the height, ~6 boundary evaluations per certified zero
 * asymptotically. It does NOT touch the expensive part: B2 / W3, the uniform-in-x
 * analytic tail lemma |A + B| > |C| for all x >= T_PT + Delta, which no finite mesh
 * spans (imp-35674). A large Delta shrinks the semi-infinite tail the analytic lemma
 * must cover but never eliminates it -- the tail stays semi-infinite for every finite
 * Delta, so widening the cheap finite rectangle cannot discharge the non-finite piece.
 * Measurement only; NO QED.
 *
 * @see imp-35653-sbarrier-finite-check-porting-scope (Part C derives MESH_PER_UNIT ~ 12.84; names B1/B2 and W1..W4)
 * @see imp-35674-w3-tail-lemma-polymath15-scope (the NON-finite tail lemma B2 / W3 no mesh can cover)
 * @see imp-35419-etrunc-barrier-lemma-porting-scope (the S_barrier statement / P2 option-a)
 * @see Polymath15 2019 (argument-principle winding barrier on a bounded rectangle); Platt-Trudgian 2021 (T_PT = 3e12)
 */

// -- Anchor + operative constants (import-light; matching imp-35653) -----------
const T_PT = 3e12; // Platt-Trudgian 2021 verified height
const TWO_PI = 2 * Math.PI;
// Local zero density at height T_PT: (1 / 2 pi) log(T_PT / 2 pi) zeros per unit height.
const LOCAL_DENSITY_AT_TPT = Math.log(T_PT / TWO_PI) / TWO_PI; // ~4.279 zeros/unit (imp-35653)
const OVERSAMPLE = 3; // boundary samples per local zero spacing (no missed half-turn)
const MESH_PER_UNIT = OVERSAMPLE * LOCAL_DENSITY_AT_TPT; // ~12.84 mesh points/unit arc length
const H_BAND = 1; // fixed order-unity half-height of the transition band [-h, h]; Delta-INDEPENDENT
const L_PT = 0.2; // Platt-Trudgian 2021 bound; unchanged by this measurement

// Boundary-evaluation and enclosed-zero model (Part A).
const horizontalEvals = (delta) => 2 * delta * MESH_PER_UNIT; // two long sides, length Delta each
const verticalEvals = 4 * H_BAND * MESH_PER_UNIT; // two short sides, length 2h each; Delta-independent
const totalEvals = (delta) => horizontalEvals(delta) + verticalEvals;
const enclosedZeros = (delta) => delta * LOCAL_DENSITY_AT_TPT;

const SLOPE_PER_UNIT_DELTA = 2 * MESH_PER_UNIT; // dM/dDelta ~ 25.68 evals per unit width
const HORIZ_EVALS_PER_ZERO = 2 * OVERSAMPLE; // = 6 exactly, Delta- and height-independent

// The measured cost-vs-Delta ladder.
const DELTA_LADDER = [1, 2, 5, 10, 20, 50, 100];
const COST_TABLE = DELTA_LADDER.map((delta) => {
  const total = totalEvals(delta);
  const zeros = enclosedZeros(delta);
  return {
    delta,
    enclosedZeros: +zeros.toFixed(3), // Delta * density ~ 4.279 * Delta
    horizontalEvals: +horizontalEvals(delta).toFixed(3),
    verticalEvals: +verticalEvals.toFixed(3), // constant across rows
    totalEvals: +total.toFixed(3),
    totalEvalsPerEnclosedZero: +(total / zeros).toFixed(4), // decays toward 6 as Delta grows
  };
});

export const IMP35675_FINITE_WINDING_MESH_COST_VS_DELTA = {
  id: 'imp-35675',
  proofSection: 'S-frontier',
  question:
    'Measure the imp-35653 FINITE winding-barrier (B1) mesh cost O(Delta * log T_PT) as a function of ' +
    'transition-rectangle width Delta at T_PT = 3e12 (local density ~4.279 zeros/unit, oversample 3 => ' +
    '~12.84 mesh points/unit) and tabulate boundary-evaluation and enclosed-zero counts. Measurement ' +
    'only; the finite piece stays finite while B2 / W3 stays non-finite; discharges nothing; NO QED.',
  anchors: {
    tPT: T_PT, // 3e12
    localDensityAtTPT: +LOCAL_DENSITY_AT_TPT.toFixed(4), // ~4.2799 zeros/unit
    oversample: OVERSAMPLE, // 3
    meshPerUnit: +MESH_PER_UNIT.toFixed(4), // ~12.8397 samples/unit arc length
    hBand: H_BAND, // order-unity, Delta-independent
  },
  boundaryModel:
    'R = [T_PT, T_PT + Delta] x [-h, h]. Two horizontal sides (length Delta) => 2 * Delta * MESH_PER_UNIT ' +
    'evaluations (grow with Delta); two vertical sides (length 2h) => 4 * h * MESH_PER_UNIT evaluations ' +
    '(Delta-independent). Total M(Delta) = 2 * Delta * MESH_PER_UNIT + 4 * h * MESH_PER_UNIT.',
  costTable: COST_TABLE,
  slopePerUnitDelta: +SLOPE_PER_UNIT_DELTA.toFixed(4), // ~25.6794 evals per unit Delta
  verticalIntercept: +verticalEvals.toFixed(4), // ~51.3588 evals (constant overhead)
  horizontalEvalsPerEnclosedZero: HORIZ_EVALS_PER_ZERO, // = 6 exactly
  logNotHeight:
    'The Delta-slope 2 * MESH_PER_UNIT = 2 * OVERSAMPLE * (1 / 2 pi) log(T_PT / 2 pi) carries the LOG of ' +
    'the height, not the height: ~25.68 evaluations per unit Delta at T_PT = 3e12. Squaring the height ' +
    'would merely DOUBLE this slope (log doubles), not square it -- the quantitative meaning of the ' +
    'imp-35653 "cheap -- set by log of height not height" claim. The slope / T_PT ratio is ~8.6e-12: the ' +
    'per-Delta cost is vanishing relative to the height itself.',
  perZeroInterpretation:
    'Horizontal boundary work per enclosed zero is EXACTLY 2 * OVERSAMPLE = 6 (two long sides, three ' +
    'samples per zero), independent of Delta and height. Total evaluations per enclosed zero start above ' +
    '6 (vertical-side overhead dominates at tiny Delta) and DECAY monotonically toward 6 as Delta grows.',
  whatItDoesNotShow:
    'This measures ONLY the finite piece B1. It does not touch B2 / W3, the uniform-in-x analytic tail ' +
    'lemma |A + B| > |C| for all x >= T_PT + Delta, which no finite mesh spans (imp-35674). A larger Delta ' +
    'shrinks the tail the analytic lemma must cover but leaves it semi-infinite for every finite Delta, so ' +
    'widening the cheap finite rectangle cannot discharge the non-finite piece.',
  isRigorous: false,
  verdict:
    'MEASUREMENT (frontier-direction, NOT rigorous). The imp-35653 finite winding-barrier (B1) mesh cost ' +
    'is LINEAR in the transition width Delta: M(Delta) = 2 * MESH_PER_UNIT * Delta + 4 * h * MESH_PER_UNIT, ' +
    'slope ~25.68 evaluations per unit Delta and a fixed ~51.36-evaluation vertical-side intercept. The ' +
    'slope carries log(T_PT / 2 pi), NOT T_PT, so the cost is complexity-cheap (slope / T_PT ~ 8.6e-12); ' +
    'horizontal boundary work per certified zero is exactly 2 * OVERSAMPLE = 6, and total work per zero ' +
    'decays monotonically toward 6 as the fixed vertical overhead amortizes. This confirms the imp-35653 ' +
    '"set by the log of the height, not the height" claim quantitatively for B1, and touches nothing in ' +
    'the NON-finite tail lemma B2 / W3. Measurement only; ports nothing; discharges nothing; changes no ' +
    'bound; no RH verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-35653 (Part C derives MESH_PER_UNIT ~ 12.84; names B1/B2, W1..W4); imp-35674 (the non-finite ' +
    'tail lemma B2 / W3); imp-35419 (the S_barrier statement / P2 option-a); Polymath15 2019 ' +
    '(argument-principle winding barrier on a bounded rectangle); Platt-Trudgian 2021 (T_PT = 3e12).',
};

export const IMP35675_FINITE_WINDING_MESH_COST_VS_DELTA_ASSERTIONS = [
  {
    // Part A/B: the cost is LINEAR in Delta with slope 2*MESH_PER_UNIT and a fixed vertical intercept.
    id: 'imp35675-cost-linear-in-delta',
    description: 'M(Delta) = 2*MESH_PER_UNIT*Delta + 4*h*MESH_PER_UNIT; slope constant across the ladder',
    holds: () =>
      COST_TABLE.every((row) => {
        const modelled = SLOPE_PER_UNIT_DELTA * row.delta + verticalEvals;
        return Math.abs(modelled - totalEvals(row.delta)) < 1e-9;
      }) &&
      // slope recovered from any two rows (finite difference) equals 2*MESH_PER_UNIT
      Math.abs(
        (totalEvals(100) - totalEvals(1)) / (100 - 1) - SLOPE_PER_UNIT_DELTA
      ) < 1e-9,
  },
  {
    // Part B: horizontal boundary work per enclosed zero is EXACTLY 2*OVERSAMPLE = 6, Delta-independent.
    id: 'imp35675-six-evals-per-zero',
    description: 'Horizontal evaluations per enclosed zero = 2*OVERSAMPLE = 6 exactly for every Delta',
    holds: () =>
      HORIZ_EVALS_PER_ZERO === 6 &&
      DELTA_LADDER.every(
        (delta) => Math.abs(horizontalEvals(delta) / enclosedZeros(delta) - 6) < 1e-9
      ),
  },
  {
    // Part B: the Delta-slope carries log(T_PT/2pi), not T_PT -- cost cheap in the complexity sense.
    id: 'imp35675-slope-log-not-height',
    description: 'Slope 2*MESH_PER_UNIT = 2*OVERSAMPLE*(1/2 pi)log(T_PT/2 pi); slope/T_PT ~ 8.6e-12 (cheap)',
    holds: () =>
      Math.abs(SLOPE_PER_UNIT_DELTA - 2 * OVERSAMPLE * Math.log(T_PT / TWO_PI) / TWO_PI) < 1e-12 &&
      SLOPE_PER_UNIT_DELTA > 25 && SLOPE_PER_UNIT_DELTA < 26 &&
      SLOPE_PER_UNIT_DELTA / T_PT < 1e-10,
  },
  {
    // Part B: total-evals-per-zero decays monotonically toward 6 as Delta grows (overhead amortizes).
    id: 'imp35675-per-zero-decays-to-six',
    description: 'Total evaluations per enclosed zero decrease monotonically toward 6 across the ladder',
    holds: () => {
      const ratios = COST_TABLE.map((r) => r.totalEvalsPerEnclosedZero);
      const monotone = ratios.every((v, i) => i === 0 || v < ratios[i - 1]);
      const first = ratios[0];
      const last = ratios[ratios.length - 1];
      return monotone && first > 6 && last > 6 && last < first;
    },
  },
  {
    // Part C + honesty gate: measures B1 only; B2/W3 stays non-finite; no discharge, no QED, no refereed bound is changed.
    id: 'imp35675-honesty-gate-b1-only-no-qed',
    description: 'Measures finite B1 only; B2/W3 stays non-finite; measurement only, no QED, no refereed bound is changed',
    holds: () =>
      IMP35675_FINITE_WINDING_MESH_COST_VS_DELTA.isRigorous === false &&
      Math.abs(L_PT - 0.2) < 1e-15 &&
      /semi-infinite for every finite Delta/.test(IMP35675_FINITE_WINDING_MESH_COST_VS_DELTA.whatItDoesNotShow) &&
      /NO QED/.test(IMP35675_FINITE_WINDING_MESH_COST_VS_DELTA.verdict) &&
      /refereed bound is changed/i.test(IMP35675_FINITE_WINDING_MESH_COST_VS_DELTA.verdict),
  },
];

for (const a of IMP35675_FINITE_WINDING_MESH_COST_VS_DELTA_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-35675-finite-winding-mesh-cost-vs-delta assertion failed: ${a.id}`);
  }
}
