/**
 * @module imp-35868-excluded-cost-channels-estimate
 *
 * imp-35868 (numerical/estimate, S-frontier): ASSESS/ESTIMATE the three SEPARATE
 * arbitrary-precision cost channels that imp-35811 EXPLICITLY EXCLUDED from its
 * underflow-only working-digit table -- (1) integrand node count, (2) Phi-series
 * term count, (3) oscillatory argument-reduction precision -- as functions of the
 * height x = 2 gamma, and bound how much they compound the underflow-only
 * ~1e12-digit T_PT wall. Estimate/assessment only.
 *
 * WHAT imp-35811 MEASURED, AND WHAT IT LEFT OUT
 * -----------------------------------------------------------------------------
 * imp-35811 RAN ~520-digit BigInt arithmetic and MEASURED the per-value working-
 * digit requirement D*(x) = (pi/(8 ln10)) x + O(1) ~ 0.17055 x driven by the
 * catastrophic exp(-pi x/8) cancellation of the exact de Bruijn evaluator, and
 * extrapolated the T_PT target x = 2 T_PT = 6e12 to D* ~ 1.02e12 decimal digits
 * (~425 GB of mantissa PER evaluated value). It stated plainly that it "ignores the
 * SEPARATE growing costs a real high-x run carries (integrand node count, Phi-series
 * term count, oscillatory argument-reduction precision), all of which only worsen the
 * picture" -- but it never estimated them. This module supplies that honest estimate.
 *
 * THE THREE EXCLUDED CHANNELS (scaling with x; constants order-unity)
 * -----------------------------------------------------------------------------
 * The evaluator forms H_0(x) = sum_i w_i cos(x u_i), a quadrature of the oscillatory
 * kernel cos(x u) against the de Bruijn / Riemann density Phi(u) = sum_{n>=1}
 * (2 pi^2 n^4 e^{9u} - 3 pi n^2 e^{5u}) exp(-pi n^2 e^{4u}).
 *
 * (1) INTEGRAND NODE COUNT -- LINEAR, O(x). To resolve the oscillatory kernel
 *     cos(x u) over the effective u-support U of Phi, a fixed-order rule needs a
 *     Nyquist-type node budget proportional to the oscillation count x U /(2 pi):
 *         N_nodes(x) ~ (q/(2 pi)) U(x) x,   q = nodes per wavelength = O(1).
 *     The support edge U(x) is where even the n=1 Phi term underflows the working
 *     precision, U ~ (1/4) ln(D*(x) ln10 / pi) -- a LOGARITHMICALLY slow drift -- so
 *     N_nodes grows essentially LINEARLY in x (exponent p_node = 1), with a coefficient
 *     that is order-unity times a slowly-growing log factor. This is a COUNT channel:
 *     it multiplies the number of high-precision kernel evaluations, not the per-value
 *     digit budget.
 *
 * (2) Phi-SERIES TERM COUNT -- SQUARE-ROOT, O(sqrt(x)). The theta-like series for Phi
 *     truncates when its Gaussian factor exp(-pi n^2 e^{4u}) drops below the working
 *     precision 10^{-D*}: pi n^2 e^{4u} > D* ln10. At the dominant small-u edge (u -> 0,
 *     where the integrand is largest) this gives
 *         n_phi(x) ~ sqrt(D*(x) ln10 / pi) ~ sqrt((ln10/pi) . (pi/(8 ln10)) x) = sqrt(x/8).
 *     So the term count grows only as O(sqrt(x)) (exponent p_phi = 1/2). Its terms are
 *     all-positive Gaussians (no extra cancellation), so it adds NO working digits beyond
 *     D*; it is a mild COUNT channel, sub-dominant to the node count.
 *
 * (3) OSCILLATORY ARGUMENT-REDUCTION PRECISION -- ADDITIVE LOGARITHM, +O(log10 x).
 *     To evaluate cos(x u_i) to the RELATIVE accuracy that resolves the exp(-pi x/8)-small
 *     signal, the reduced argument (x u_i mod 2 pi) must be known to absolute error
 *     ~ 10^{-D*}. Since x u_i has integer part of magnitude ~ x, forming/reducing it to
 *     that fractional accuracy requires
 *         D_arg(x) = D*(x) + log10(x u_i) + O(1) ~ D*(x) + log10(x)
 *     working digits. This channel therefore ADDS only ~log10(x) digits to the per-value
 *     mantissa budget -- the sole excluded channel that touches the DIGIT count at all.
 *
 * HOW THEY COMPOUND THE ~1e12-DIGIT WALL (honest total-cost picture)
 * -----------------------------------------------------------------------------
 * PER-VALUE MANTISSA (storage). Only channel (3) touches the digit floor, and only
 * additively by log10(x). At x = 6e12, log10(x) ~ 12.8 digits added to D* ~ 1.02e12 --
 * a RELATIVE increase ~ 1.3e-11. So the imp-35811 underflow floor (~1.02e12 digits,
 * ~425 GB/value) is UNCHANGED to eleven significant figures: the excluded channels do
 * NOT relax it and barely raise it.
 *
 * TOTAL OPERATION COUNT (time). Channels (1) and (2) are COUNT channels: each evaluated
 * H_0 value requires N_nodes . n_phi high-precision kernel/Phi-term evaluations,
 *         E(x) ~ N_nodes(x) . n_phi(x) ~ O(x^{3/2})  (up to log factors),
 * EACH carried at the D* ~ 1e12-digit precision. At x = 6e12 this is ~1e19 high-precision
 * (~1e12-digit) term-evaluations for a SINGLE value. So the excluded channels do not
 * change the categorical DIGIT wall, but they blow the END-TO-END COMPUTE wall up by a
 * further ~x^{3/2} ~ nineteen orders of magnitude beyond the storage-only figure --
 * confirming and quantifying imp-35811's "only worsen the picture."
 *
 * WHAT THIS DOES NOT DO
 * -----------------------------------------------------------------------------
 * Order-of-magnitude ESTIMATE only, in plain double arithmetic. Runs NO arbitrary-
 * precision quadrature; evaluates no true H_0; extends no evaluator; certifies no value
 * at any height; changes no bound; NO QED. The channel coefficients (q, the U(x) and
 * node prefactors) are order-unity illustrative -- the invariant claims are the SCALINGS
 * (p_node = 1, p_phi = 1/2, arg-reduction additive +log10 x) and their qualitative
 * compounding. No refereed bound is changed.
 *
 * @see imp-35811-exact-debruijn-arbitrary-precision-digit-table (the underflow-only D*(x) table this extends)
 * @see imp-35759-exact-debruijn-precision-digit-cost-scope (the OOM digit law)
 * @see imp-35781-exact-debruijn-empirical-x-ceiling-scope (the double ceiling)
 * @see scripts/imp-34813-exact-debruijn-winding-offline.mjs (the exact evaluator; window x in [20,104])
 * @see Platt-Trudgian 2021 (verified zero height T_PT = 3e12; no refereed bound is changed)
 */

// -- Anchor + operative constants (import-light; matching imp-35811) --
const T_PT = 3e12; // Platt-Trudgian 2021 verified zero-ordinate (gamma) height
const L_PT = 0.2; // Platt-Trudgian 2021 bound; unchanged by this estimate
const X_TPT = 2 * T_PT; // x = 2 gamma convention; T_PT ordinate maps to x = 6e12
const PI = Math.PI;
const DIGITS_PER_X = PI / (8 * Math.LN10); // ~0.170547 decimal digits per unit x (imp-35759)
const D_TPT = DIGITS_PER_X * X_TPT; // imp-35811 underflow-only per-value digit floor ~1.02e12

// -- Channel models (scalings; order-unity illustrative coefficients) --
const Q_PER_WAVELENGTH = 4; // nodes per wavelength for a moderate oscillatory rule (order-unity)

// Underflow-only working digits at height x (imp-35811 measured this leading law).
function underflowDigits(x) {
  return DIGITS_PER_X * x;
}

// (1) Phi effective u-support edge: where the n=1 Gaussian underflows 10^{-D*(x)}.
function phiSupportEdge(x) {
  return Math.log(underflowDigits(x) * Math.LN10 / PI) / 4; // U(x) ~ (1/4) ln(D* ln10 / pi)
}

// (1) Integrand node count: Nyquist over the oscillatory kernel across the support U.
function nodeCount(x) {
  return (Q_PER_WAVELENGTH / (2 * PI)) * phiSupportEdge(x) * x; // ~ O(x)
}

// (2) Phi-series term count at the dominant small-u edge: n_phi ~ sqrt(D* ln10 / pi).
function phiTermCount(x) {
  return Math.sqrt(underflowDigits(x) * Math.LN10 / PI); // ~ O(sqrt(x))
}

// (3) Argument-reduction EXTRA working digits added on top of D*: ~ log10(x).
function argReductionExtraDigits(x) {
  return Math.log10(x); // additive; the only channel that touches the digit budget
}

// Total high-precision term-evaluations per single H_0 value: N_nodes . n_phi ~ O(x^{3/2}).
function termEvaluations(x) {
  return nodeCount(x) * phiTermCount(x);
}

// -- Build the estimate ladder (same rungs as imp-35811, plus the T_PT anchor) --
const X_LADDER = [104, 200, 500, 1000, X_TPT];
const TABLE = X_LADDER.map((x) => ({
  x,
  gamma: x / 2,
  underflowDigits: underflowDigits(x), // imp-35811 per-value digit floor
  nodeCount: nodeCount(x), // channel (1), O(x)
  phiTermCount: phiTermCount(x), // channel (2), O(sqrt(x))
  argExtraDigits: argReductionExtraDigits(x), // channel (3), +O(log10 x)
  termEvaluations: termEvaluations(x), // compounded (1).(2), O(x^{3/2})
}));

// -- Compounding summary at the T_PT anchor --
const ROW_TPT = TABLE[TABLE.length - 1];
// Relative bump the arg-reduction digits add to the underflow-only floor (channel 3 vs D*).
const ARG_DIGIT_RELATIVE_BUMP = ROW_TPT.argExtraDigits / ROW_TPT.underflowDigits; // ~1.3e-11
// How many extra OOM the count channels add to the per-value storage cost (channels 1+2).
const OPERATION_OOM_OVER_STORAGE = Math.log10(ROW_TPT.termEvaluations); // ~19

// -- Empirical scaling exponents (log-log slopes over the ASYMPTOTIC window x in [1000, x_TPT]) --
// Measured over the wide asymptotic reach, not the low-x rungs where the slow log-support drift
// U(x) ~ (1/4) ln(D* ln10/pi) still inflates the node slope above its leading value.
function loglogSlope(fn) {
  const a = X_LADDER[X_LADDER.length - 2], b = X_LADDER[X_LADDER.length - 1]; // 1000 .. 6e12
  return (Math.log(fn(b)) - Math.log(fn(a))) / (Math.log(b) - Math.log(a));
}
const P_NODE = loglogSlope(nodeCount); // ~1.08 (linear; residual above 1 = slow log-support drift)
const P_PHI = loglogSlope(phiTermCount); // ~0.5 (square-root, exact)
const P_EVAL = loglogSlope(termEvaluations); // ~1.58 (x^{3/2}, plus the node log-drift)

export const IMP35868_EXCLUDED_COST_CHANNELS_ESTIMATE = {
  id: 'imp-35868',
  proofSection: 'S-frontier',
  question:
    'Assess/estimate the three arbitrary-precision cost channels imp-35811 EXCLUDED from its underflow-only ' +
    'digit table -- integrand node count, Phi-series term count, oscillatory argument-reduction precision -- as ' +
    'functions of x = 2 gamma, and bound how much they compound the underflow-only ~1e12-digit T_PT wall. ' +
    'Estimate only; runs no arbitrary-precision quadrature; extends no evaluator; changes no bound; NO QED.',
  method: {
    arithmetic: 'plain double order-of-magnitude estimate (no arbitrary-precision run)',
    kernel: 'H_0(x) = sum_i w_i cos(x u_i), quadrature of cos(x u) against the de Bruijn density Phi(u)',
    statement:
      'Each excluded channel is modelled by its leading x-scaling with an order-unity coefficient: node count ' +
      'from a Nyquist budget over the Phi support, Phi-series length from the Gaussian underflow threshold, and ' +
      'argument-reduction digits from the magnitude of the reduced oscillatory argument x u.',
  },
  table: TABLE, // [{ x, gamma, underflowDigits, nodeCount, phiTermCount, argExtraDigits, termEvaluations }]
  channels: {
    node: {
      scaling: 'O(x) -- LINEAR (nodes ~ (q/2pi) U(x) x, U ~ (1/4) ln(D* ln10/pi) a slow log drift)',
      exponent: P_NODE, // ~1
      kind: 'COUNT (multiplies high-precision evaluations; adds no working digits)',
    },
    phiTerm: {
      scaling: 'O(sqrt(x)) -- SQUARE-ROOT (n_phi ~ sqrt(D* ln10/pi) = sqrt(x/8))',
      exponent: P_PHI, // ~0.5
      kind: 'COUNT (all-positive Gaussians; adds no working digits)',
    },
    argReduction: {
      scaling: '+O(log10 x) -- ADDITIVE (D_arg = D* + log10(x u), the reduced argument magnitude)',
      extraDigitsAtTPT: ROW_TPT.argExtraDigits, // ~12.8
      kind: 'DIGIT (the only excluded channel that touches the per-value mantissa budget)',
    },
  },
  compounding: {
    underflowFloorDigitsTPT: D_TPT, // ~1.02e12 (imp-35811 storage floor)
    argDigitRelativeBump: ARG_DIGIT_RELATIVE_BUMP, // ~1.3e-11: floor essentially unchanged
    termEvaluationsTPT: ROW_TPT.termEvaluations, // ~1e19 high-precision term-evaluations per value
    operationOOMoverStorage: OPERATION_OOM_OVER_STORAGE, // ~19 extra OOM in TIME over the storage floor
    statement:
      'PER-VALUE STORAGE: only argument reduction touches the digit floor, and only by +log10(x) ~ 13 digits on ' +
      '~1.02e12 -- a ~1.3e-11 relative bump, so the imp-35811 ~425 GB/value floor is unchanged. TIME: the two ' +
      'COUNT channels multiply the per-value cost by N_nodes . n_phi ~ O(x^{3/2}) ~ 1e19 high-precision ' +
      '(~1e12-digit) term-evaluations at x = 6e12, ~19 orders of magnitude beyond the storage-only picture. The ' +
      'excluded channels leave the DIGIT wall categorical and blow up the COMPUTE wall super-linearly.',
  },
  isRigorous: false,
  verdict:
    'ORDER-OF-MAGNITUDE ESTIMATE (frontier-direction, NOT rigorous). The three cost channels imp-35811 excluded ' +
    'scale as: integrand node count O(x) (LINEAR, up to a slow log-support drift), Phi-series term count ' +
    'O(sqrt(x)) (SQUARE-ROOT), and oscillatory argument-reduction precision +O(log10 x) (ADDITIVE digits). Only ' +
    'argument reduction touches the per-value digit budget, adding ~13 digits to the ~1.02e12-digit underflow ' +
    'floor at x = 6e12 (a ~1.3e-11 relative bump) -- so imp-35811 ~425 GB/value floor stands. The two COUNT ' +
    'channels instead multiply the per-value cost by N_nodes . n_phi ~ O(x^{3/2}) ~ 1e19 high-precision term- ' +
    'evaluations at the T_PT height, roughly nineteen orders of magnitude of TIME beyond the storage-only ' +
    'figure. This quantifies imp-35811 "only worsen the picture": the underflow digit wall is a floor, and the ' +
    'end-to-end compute wall is far worse. Estimate only; runs no arbitrary-precision quadrature; evaluates no ' +
    'true H_0; extends no evaluator; certifies no value; changes no bound; NO QED. No refereed bound is changed' +
    '.',
  citation:
    'imp-35811 (measured underflow-only D*(x)~0.17055x, ~1.02e12 digits at x=6e12, explicitly excluded these ' +
    'channels); imp-35759 (OOM digit law); imp-35781 (double ceiling); scripts/imp-34813-exact-debruijn-winding-' +
    'offline.mjs (the exact evaluator; window x in [20,104]); Platt-Trudgian 2021 (T_PT = 3e12; no refereed bound is changed).',
};

export const IMP35868_EXCLUDED_COST_CHANNELS_ESTIMATE_ASSERTIONS = [
  {
    // Node count is LINEAR in x: log-log slope ~ 1 (up to the slow log-support drift).
    id: 'imp35868-node-count-linear',
    description: 'integrand node count scales as O(x): asymptotic log-log slope over x in [1000,6e12] within [1.0,1.15]',
    holds: () => P_NODE > 1.0 && P_NODE < 1.15,
  },
  {
    // Phi-series term count is SQUARE-ROOT in x: log-log slope ~ 0.5.
    id: 'imp35868-phi-term-count-sqrt',
    description: 'Phi-series term count scales as O(sqrt(x)): log-log slope within [0.45,0.55]',
    holds: () => P_PHI > 0.45 && P_PHI < 0.55,
  },
  {
    // Compounded count channels give the operation count exponent ~3/2.
    id: 'imp35868-term-evaluations-three-halves',
    description: 'total term-evaluations N_nodes.n_phi scale as O(x^{3/2}): asymptotic log-log slope within [1.5,1.65]',
    holds: () => P_EVAL > 1.5 && P_EVAL < 1.65,
  },
  {
    // Argument reduction is the ONLY channel touching the digit budget, and its bump is negligible.
    id: 'imp35868-arg-reduction-negligible-on-digits',
    description: 'arg-reduction adds only ~log10(x) digits: relative bump on the ~1e12-digit floor < 1e-9 at x=6e12',
    holds: () =>
      ROW_TPT.argExtraDigits > 12 && ROW_TPT.argExtraDigits < 13.5 &&
      ARG_DIGIT_RELATIVE_BUMP > 0 && ARG_DIGIT_RELATIVE_BUMP < 1e-9,
  },
  {
    // The count channels blow up the COMPUTE wall: ~1e19 high-precision term-evaluations per value at T_PT.
    id: 'imp35868-compute-wall-blowup',
    description: 'term-evaluations at x=6e12 ~1e19 (>=1e18), i.e. >=15 extra OOM in time over the storage floor',
    holds: () =>
      ROW_TPT.termEvaluations > 1e18 && ROW_TPT.termEvaluations < 1e20 &&
      OPERATION_OOM_OVER_STORAGE > 15 && OPERATION_OOM_OVER_STORAGE < 21 &&
      Math.abs(D_TPT / 1.023e12 - 1) < 0.05,
  },
  {
    // Honesty gate: estimate only; no arbitrary-precision run; no evaluator extension; NO QED; no refereed bound is changed.
    id: 'imp35868-honesty-gate-no-qed',
    description: 'Estimate only; runs no arbitrary-precision quadrature; extends no evaluator; NO QED; no refereed bound is changed',
    holds: () =>
      IMP35868_EXCLUDED_COST_CHANNELS_ESTIMATE.isRigorous === false &&
      Math.abs(L_PT - 0.2) < 1e-15 &&
      /extends no evaluator/.test(IMP35868_EXCLUDED_COST_CHANNELS_ESTIMATE.verdict) &&
      /NO QED/.test(IMP35868_EXCLUDED_COST_CHANNELS_ESTIMATE.verdict) &&
      /refereed bound is changed/i.test(IMP35868_EXCLUDED_COST_CHANNELS_ESTIMATE.verdict),
  },
];

for (const a of IMP35868_EXCLUDED_COST_CHANNELS_ESTIMATE_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-35868-excluded-cost-channels-estimate assertion failed: ${a.id}`);
  }
}
