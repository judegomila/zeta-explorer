/**
 * @module imp-35129-interval-enclosure-n-dependence-scoping
 *
 * imp-35129 (numerical, S-frontier): SCOPES how the imp-362 single-scale one-ULP interval RK4
 * witness (LAMBDA_INTERVAL_DYSON) would have to extend to satisfy the imp-35058 Step-2
 * G-interval-enclosure obligation -- an N-uniform interval / ball-arithmetic enclosure of the
 * backward Dyson flow with the 1/(x_k - x_j) pole reduction carried through in interval form,
 * documented as an N-dependent enclosure [t_c_lo(N), t_c_hi(N)]. imp-362 delivers a witness table
 * over four bundled ordinates (N in {50, 100, 200, 500}; N = 2458 is zero-list-insufficient), and
 * reports a per-N bracket WIDTH that decreases monotonically with N (0.002, 0.001, 0.0005, 0.0003).
 * Read naively that looks like the enclosure TIGHTENS as N grows -- exactly the wrong direction for
 * a wrapper-growth obligation. This module characterizes what that width actually measures and
 * delimits the gap to a documented growth law. MEASUREMENT / SCOPING ONLY on the imp-362 witness;
 * a single-scale witness is NOT an N-uniform certificate; changes no bound; NO QED.
 *
 * THE imp-362 WITNESS (verbatim reference literals; reproduce by running
 * `node src/math/interval-dyson-integrator.mjs`)
 * -----------------------------------------------------------------------------------------
 * The backwardCollisionInterval routine integrates the Dyson ODE backward in interval arithmetic
 * with a per-N step budget budgetForN(N) = { dt, nSteps } and brackets the collision time between
 * the previous-step time and the current-step time at the first step where an adjacent-gap interval
 * lower bound reaches zero. The reported WIDTH is that temporal bracket t_c_hi - t_c_lo.
 *
 * THE FINDINGS (characterization, from the witness)
 * -----------------------------------------------------------------------------------------
 *   (C1) THE REPORTED WIDTH IS THE RK4 STEP dt, NOT THE INTERVAL-ARITHMETIC BALL RADIUS. At every
 *        closed row the bracket width EQUALS the step size dt(N) exactly (width / dt = 1 to the
 *        stored precision): 0.002/0.002, 0.001/0.001, 0.0005/0.0005, 0.0003/0.0003. The collision is
 *        localized to a SINGLE RK4 step, so the bracket is [t_prev, t_prev + dt] and its width is the
 *        temporal step RESOLUTION. The accumulated ULP / wrapper ball radius carried through
 *        divInterval / reciprocalInterval is NOT surfaced as a separate quantity anywhere in the row.
 *   (C2) THE APPARENT N-DEPENDENCE IS A dt-SCHEDULE ARTIFACT, NOT ENCLOSURE TIGHTENING. Because the
 *        width IS dt, the monotone decrease of width with N merely tracks budgetForN shrinking dt
 *        (0.002 -> 0.001 -> 0.0005 -> 0.0003) to keep ~200 steps resolving the shrinking collision
 *        time t_c ~ 1/N. It says NOTHING about whether the interval enclosure tightens or widens with
 *        N. The genuine wrapper-radius N-dependence the obligation asks for is confounded with,
 *        and hidden by, the step-resolution choice; the two cannot be separated from these rows.
 *   (C3) COVERAGE IS ONE DECADE, WITH NO POINT AT THE PATH C ANCHOR. Only four measured N span the
 *        single decade [50, 500]; the N = 2458 target is zero-list-insufficient (bundled ZETA_ZEROS
 *        too short) and there is NO witness beyond N = 500. A growth law needs points across many
 *        decades of N with a decoupled radius readout; the existing witness supplies neither.
 *
 * WHAT DOCUMENTING THE GROWTH REQUIRES (delimiting the gap to the G-interval-enclosure obligation)
 * -----------------------------------------------------------------------------------------
 *   (R1) DECOUPLE THE RADIUS FROM dt. Hold dt (and nSteps) FIXED across N, or scale to a constant
 *        t_c-fraction resolution, so the reported quantity is the interval-arithmetic ball radius and
 *        not the temporal step size.
 *   (R2) SURFACE THE WRAPPER RADIUS. Report the accumulated ball radius per drift evaluation
 *        separately; it grows with the N - 1 reciprocal-difference terms summed in
 *        dysonDriftInterval and with the backward step count (wrapper effect) -- that growth IS the
 *        N-dependence the obligation names.
 *   (R3) EXTEND THE HEIGHT. Load Odlyzko tables at larger heights so rows at N >> 500 (and the Path C
 *        anchor N) can be witnessed rather than flagged zero-list-insufficient.
 *   (R4) TRUE DIRECTED ROUNDING + N-UNIFORMITY. Replace one-ULP inflation with true directed rounding
 *        (Arb / CAPD) so the ULP padding does not dominate, and state a DOCUMENTED radius(N) growth
 *        bound valid for all N up to the target, not a single-scale bracket. Only then is the enclosure
 *        N-uniform in the sense Step-2 requires.
 *
 * PROOF SCOPE / HONESTY. MEASUREMENT / SCOPING ONLY on the imp-362 one-ULP interval RK4 witness. The
 * single-scale witness is NOT an N-uniform certificate; no interval enclosure growth law is
 * established; the 1/(x_k - x_j) pole reduction is NOT carried through in a certified N-uniform form
 * here. The imp-486 GUE-conditional, the C_C 1/8 ansatz (imp-2642/imp-2643), and imp-3066 K_a >= 0
 * are UNTOUCHED. Changes NO bound; no operator positivity; no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see interval-dyson-integrator (imp-362 LAMBDA_INTERVAL_DYSON witness + backwardCollisionInterval)
 * @see lambda-interval-dyson (data-layer manifest + imp362 assertions)
 * @see lambda-roadmap (Step 2 rigorousUpgradeGap.obligations[G-interval-enclosure])
 */

// Reference literals copied VERBATIM from the imp-362 witness (interval-dyson-integrator.mjs).
// Reproduce by running `node src/math/interval-dyson-integrator.mjs`. Kept as inline literals
// (NOT imported) so this assertion module stays light: importing the integrator pulls in the
// bundled ZETA_ZEROS table, which hangs under the vite/npm-run-assert loader.
const IMP362_WITNESS = [
  { N: 50, dt: 0.002, t_c_lo: 0.094, t_c_hi: 0.096, width: 0.002, closed: true },
  { N: 100, dt: 0.001, t_c_lo: 0.075, t_c_hi: 0.076, width: 0.001, closed: true },
  { N: 200, dt: 0.0005, t_c_lo: 0.0325, t_c_hi: 0.033, width: 0.0005, closed: true },
  { N: 500, dt: 0.0003, t_c_lo: 0.0132, t_c_hi: 0.0135, width: 0.0003, closed: true },
  { N: 2458, dt: null, t_c_lo: null, t_c_hi: null, width: null, closed: false },
];

const CLOSED = IMP362_WITNESS.filter((r) => r.closed);
const OUT_OF_SCOPE = IMP362_WITNESS.filter((r) => !r.closed);

// (C1) At every closed row the bracket width EQUALS the RK4 step dt (width / dt = 1). The width is
// the temporal step resolution, not the interval-arithmetic ball radius.
const WIDTH_EQUALS_DT_TABLE = CLOSED.map((r) => ({
  N: r.N,
  dt: r.dt,
  width: r.width,
  widthOverDt: +(r.width / r.dt).toFixed(6),
  widthIsDt: Math.abs(r.width - r.dt) <= 1e-9,
}));
const WIDTH_IS_TEMPORAL_STEP = WIDTH_EQUALS_DT_TABLE.every((r) => r.widthIsDt);

// (C2) The width decreases monotonically with N ONLY because dt does (the budgetForN schedule); the
// two move together, so the apparent N-tightening is a step-resolution artifact, not an enclosure
// property. Verify both sequences are strictly decreasing AND that they are the same sequence.
const WIDTHS = CLOSED.map((r) => r.width);
const DTS = CLOSED.map((r) => r.dt);
const WIDTH_DECREASES = WIDTHS.every((w, i) => i === 0 || w < WIDTHS[i - 1]);
const DT_DECREASES = DTS.every((d, i) => i === 0 || d < DTS[i - 1]);
const WIDTH_TRACKS_DT = WIDTH_DECREASES && DT_DECREASES && WIDTH_IS_TEMPORAL_STEP;

// (C3) Coverage is the single decade [50, 500] with no witness at or beyond N = 2458.
const CLOSED_N = CLOSED.map((r) => r.N);
const N_MIN = Math.min(...CLOSED_N);
const N_MAX = Math.max(...CLOSED_N);
const DECADES_SPANNED = +Math.log10(N_MAX / N_MIN).toFixed(4); // ~1.0 decade
const HAS_OUT_OF_SCOPE = OUT_OF_SCOPE.length >= 1 && OUT_OF_SCOPE.every((r) => r.width === null);

const REQUIREMENTS = [
  'R1 decouple radius from dt: hold dt / nSteps fixed across N (or scale to constant t_c-fraction) so the readout is the ball radius, not the step size',
  'R2 surface the wrapper radius: report the accumulated interval ball radius per drift eval, which grows with the N-1 reciprocal-difference terms and with step count',
  'R3 extend the height: load Odlyzko tables so N >> 500 (and the Path C anchor N) can be witnessed rather than flagged zero-list-insufficient',
  'R4 true directed rounding (Arb / CAPD) plus a DOCUMENTED radius(N) growth bound valid up to the target N -- an N-uniform enclosure, not a single-scale bracket',
];

export const IMP35129_INTERVAL_ENCLOSURE_N_DEPENDENCE_SCOPING = {
  id: 'imp-35129',
  proofSection: 'S-frontier',
  question:
    'How would the imp-362 single-scale one-ULP interval RK4 witness (LAMBDA_INTERVAL_DYSON) extend ' +
    'to the imp-35058 Step-2 G-interval-enclosure obligation (an N-uniform interval enclosure of the ' +
    'backward flow with the 1/(x_k - x_j) pole reduction in interval form, documented as an ' +
    'N-dependent [t_c_lo(N), t_c_hi(N)])? What does the N-dependence of the enclosure width look like ' +
    'across the measured N, and what is needed to document its growth? Scoping only; changes no bound; NO QED.',
  witness: IMP362_WITNESS,
  widthEqualsDtTable: WIDTH_EQUALS_DT_TABLE,
  coverage: {
    closedRows: CLOSED.length,
    outOfScopeRows: OUT_OF_SCOPE.length,
    nMin: N_MIN,
    nMax: N_MAX,
    decadesSpanned: DECADES_SPANNED,
    outOfScopeReason: 'N = 2458 is zero-list-insufficient (bundled ZETA_ZEROS too short); no witness beyond N = 500',
  },
  requirementsToDocumentGrowth: REQUIREMENTS,
  finding: {
    C1_width_is_the_step_dt:
      'At every closed witness row the bracket width EQUALS the RK4 step dt exactly (width / dt = 1): ' +
      '0.002/0.002, 0.001/0.001, 0.0005/0.0005, 0.0003/0.0003. The collision is localized to a single ' +
      'RK4 step, so the reported width is the temporal step RESOLUTION, not the interval-arithmetic ' +
      'ball radius (which is never surfaced as a separate quantity). (widthIsDt=' + WIDTH_IS_TEMPORAL_STEP + ').',
    C2_apparent_tightening_is_a_dt_artifact:
      'The width decreases monotonically with N (0.002 -> 0.0003) ONLY because budgetForN shrinks dt ' +
      'to keep ~200 steps resolving t_c ~ 1/N; width and dt are the SAME sequence, so the apparent ' +
      'N-tightening says nothing about the enclosure and the true wrapper-radius N-dependence is ' +
      'confounded with the step-resolution choice. (tracksDt=' + WIDTH_TRACKS_DT + ').',
    C3_coverage_is_one_decade:
      'Only four measured N span the single decade [' + N_MIN + ', ' + N_MAX + '] (~' + DECADES_SPANNED +
      ' decade); N = 2458 is zero-list-insufficient and there is no witness beyond N = 500 or at the ' +
      'Path C anchor N, so no multi-decade growth law can be read from the witness. (outOfScope=' + HAS_OUT_OF_SCOPE + ').',
  },
  isRigorous: false, // scoping of the single-scale witness against the N-uniform obligation; no QED
  rigorousScope:
    'MEASUREMENT / SCOPING ONLY on the imp-362 one-ULP interval RK4 witness. The single-scale witness ' +
    'is NOT an N-uniform certificate; no interval enclosure growth law is established; the ' +
    '1/(x_k - x_j) pole reduction is NOT carried through in a certified N-uniform form here. ' +
    'Establishes no operator positivity; changes no bound.',
  changesBound: false,
  verdict:
    'SCOPING (frontier-direction, single-scale-witness vs N-uniform obligation). The imp-362 witness ' +
    'reports a per-N bracket WIDTH that EQUALS the RK4 step dt exactly at every closed row (width / dt ' +
    '= 1), so the width measures temporal step RESOLUTION, not the interval-arithmetic ball radius; its ' +
    'monotone decrease with N (0.002 -> 0.0003) merely tracks the shrinking dt schedule and is NOT ' +
    'enclosure tightening. Coverage is the single decade [50, 500] with N = 2458 zero-list-insufficient ' +
    'and no witness at the Path C anchor N. To document the enclosure GROWTH the G-interval-enclosure ' +
    'obligation names, the witness must (R1) decouple the radius from dt, (R2) surface the accumulated ' +
    'wrapper ball radius that grows with the N-1 reciprocal-difference terms and the step count, ' +
    '(R3) extend the height beyond the bundled zeros, and (R4) use true directed rounding with a ' +
    'documented radius(N) bound valid up to the target N. SCOPING ONLY: the single-scale witness is ' +
    'not an N-uniform certificate; the imp-486 GUE-conditional, the C_C 1/8 ansatz (imp-2642/imp-2643), ' +
    'and imp-3066 K_a >= 0 are UNTOUCHED; establishes no operator positivity; changes no bound; no RH ' +
    'verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-362 (LAMBDA_INTERVAL_DYSON one-ULP interval RK4 witness; backwardCollisionInterval, ' +
    'budgetForN, dysonDriftInterval reciprocal-difference sum); imp-35058 (Step-2 ' +
    'G-interval-enclosure obligation); imp-315 (Path C OLS central values); imp-2642/imp-2643 (C_C ' +
    '1/8 ansatz); imp-486 (C_mb GUE-conditional); imp-3066 (K_a >= 0). lambda-roadmap Step 2 ' +
    'rigorousUpgradeGap.obligations[G-interval-enclosure].',
};

export const IMP35129_INTERVAL_ENCLOSURE_N_DEPENDENCE_SCOPING_ASSERTIONS = [
  {
    // (C1): the reported width equals the RK4 step dt exactly at every closed row.
    id: 'imp35129-width-equals-step-dt',
    description:
      'at every closed imp-362 witness row the bracket width equals the RK4 step dt (width / dt = 1), ' +
      'so the width is the temporal step resolution, not the interval-arithmetic ball radius',
    holds: () =>
      WIDTH_IS_TEMPORAL_STEP &&
      WIDTH_EQUALS_DT_TABLE.length === CLOSED.length &&
      WIDTH_EQUALS_DT_TABLE.every((r) => r.widthOverDt === 1),
  },
  {
    // (C2): the width and the dt schedule decrease together -- the apparent N-tightening is a dt artifact.
    id: 'imp35129-apparent-tightening-is-dt-schedule',
    description:
      'the bracket width decreases monotonically with N only because the budgetForN dt schedule does ' +
      '(width and dt are the same sequence), so the apparent N-tightening is a step-resolution artifact',
    holds: () => WIDTH_TRACKS_DT && WIDTH_DECREASES && DT_DECREASES,
  },
  {
    // (C3): coverage is one decade with no witness beyond N = 500; N = 2458 is out of scope.
    id: 'imp35129-coverage-one-decade-no-anchor',
    description:
      'the witness spans only the single decade [50, 500] (~1 decade) with N = 2458 ' +
      'zero-list-insufficient, so no multi-decade enclosure growth law can be read from it',
    holds: () =>
      CLOSED.length === 4 &&
      N_MIN === 50 &&
      N_MAX === 500 &&
      DECADES_SPANNED > 0.9 &&
      DECADES_SPANNED < 1.1 &&
      HAS_OUT_OF_SCOPE,
  },
  {
    // (R): the four requirements delimiting the gap to the N-uniform obligation are recorded.
    id: 'imp35129-requirements-recorded',
    description:
      'the four requirements (R1 decouple radius from dt, R2 surface wrapper radius, R3 extend height, ' +
      'R4 true directed rounding with a documented radius(N) bound) to document the growth are recorded',
    holds: () =>
      REQUIREMENTS.length === 4 &&
      /decouple/.test(REQUIREMENTS[0]) &&
      /wrapper/.test(REQUIREMENTS[1]) &&
      /Odlyzko/.test(REQUIREMENTS[2]) &&
      /directed rounding/.test(REQUIREMENTS[3]),
  },
  {
    // Honesty gate: scoping only, single-scale witness is not an N-uniform certificate, no bound change, no QED.
    id: 'imp35129-honesty-gate-no-qed',
    description:
      'scoping only: the single-scale witness is not an N-uniform certificate, no enclosure growth law ' +
      'is established, changes no bound, no operator positivity, no QED, no refereed bound is changed',
    holds: () =>
      IMP35129_INTERVAL_ENCLOSURE_N_DEPENDENCE_SCOPING.changesBound === false &&
      IMP35129_INTERVAL_ENCLOSURE_N_DEPENDENCE_SCOPING.isRigorous === false &&
      /NO QED/.test(IMP35129_INTERVAL_ENCLOSURE_N_DEPENDENCE_SCOPING.verdict) &&
      /not an N-uniform certificate/.test(IMP35129_INTERVAL_ENCLOSURE_N_DEPENDENCE_SCOPING.verdict) &&
      /no operator positivity/.test(IMP35129_INTERVAL_ENCLOSURE_N_DEPENDENCE_SCOPING.verdict) &&
      /refereed bound is changed/i.test(IMP35129_INTERVAL_ENCLOSURE_N_DEPENDENCE_SCOPING.verdict) &&
      /single-scale witness/i.test(IMP35129_INTERVAL_ENCLOSURE_N_DEPENDENCE_SCOPING.rigorousScope),
  },
];

for (const a of IMP35129_INTERVAL_ENCLOSURE_N_DEPENDENCE_SCOPING_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-35129-interval-enclosure-n-dependence-scoping assertion failed: ${a.id}`);
  }
}
