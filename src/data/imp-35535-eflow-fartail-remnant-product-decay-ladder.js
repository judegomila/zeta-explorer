/**
 * @module imp-35535-eflow-fartail-remnant-product-decay-ladder
 *
 * imp-35535 (numerical, frontier-direction): imp-35473 noted the imp-35413
 * E_flow far-tail fd-vs-analytic remnant*log N PRODUCT drops from ~0.05899 at
 * the sub-1e-3 crossing (N ~ 4.17e25) to ~0.02514 at the sub-1e-4 crossing
 * (N ~ 1.546e109) -- a ~2.3x decay between the two crossings -- but recorded the
 * product at those two crossings ONLY and never tabulated it across the ladder.
 * This module tabulates remnant*log N at a dense set of rungs over N = 1e26..1e200
 * on the IDENTICAL closed surrogate channel (byte-identical eFlowWith /
 * localExponent / remnant to imp-35473; no height-map swap, no heavy import) and
 * measures the local decay exponent of the PRODUCT to settle whether it flattens
 * toward a nonzero log-floor (product -> const) or keeps decaying toward zero.
 *
 * THE MEASUREMENT (surrogate channel only -- no effectiveHeightForN, no heavy import)
 * ---------------------------------------------------------------------------------
 * The fd-vs-analytic remnant holds the height map FIXED at the closed surrogate
 * T0 = 2 pi N / log N: both the fd-surrogate exponent (central log-log difference
 * of the exact imp-35135 far-tail E_flow quantity) and the analytic exponent
 * -1 + 3/log N (imp-35198) live on that same closed inverse. The PRODUCT is
 * P(N) = remnant(N) * log N. A nonzero log-floor (remnant ~ c/log N) would pin
 * P -> c > 0, giving a local product exponent q = d log P / d log x -> 0 (x = log N).
 * A product still decaying toward zero keeps q < 0 and away from 0.
 *
 *   N       remnant       remnant*log N    q = d log P / d log x
 *   1e26    9.7916e-4     0.058620         -0.43459
 *   1e50    3.6184e-4     0.041658         -0.59210
 *   1e100   1.1599e-4     0.026707         -0.68264
 *   1e150   ~6.0e-5       ~0.0206          ~-0.727
 *   1e200   3.5385e-5     0.016296         -0.73973
 *
 * THE FINDING
 * -----------
 * Across the full N = 1e26..1e200 ladder the product falls MONOTONICALLY from
 * 0.058620 to 0.016296 (a ~3.60x drop over 174 decades), and the local product
 * decay exponent q = d log P / d log x is NEGATIVE at every rung and STEEPENS
 * monotonically from ~-0.435 (1e26) toward ~-0.740 (1e200) -- it does NOT relax
 * toward 0. So the product does NOT flatten toward a nonzero log-floor: it keeps
 * decaying toward zero and the decay accelerates in log-log terms (q trending more
 * negative, consistent with the imp-35496 component split in which BOTH the
 * prefactor and Taylor pieces vanish faster than 1/log N). The ~2.3x drop imp-35473
 * measured between the two crossings is not a slowing tail -- it is one segment of a
 * still-steepening decay. Had q flattened toward 0 the product would approach a
 * positive log-floor; instead q pulls away from 0, so remnant decays strictly
 * faster than 1/log N with no floor in sight through N = 1e200.
 *
 * MEASUREMENT ONLY on the inherited imp-3220/imp-3406 surrogate extrapolation, NOT a
 * rigorous asymptotic; changes no bound. E_flow > 0 strictness (imp-33848) untouched;
 * C_mb GUE-conditional per imp-486 UNTOUCHED; E_coll far-tail exponent 1/2 per imp-3463;
 * imp-3066 K_a >= 0 untouched; no operator positivity; no RH verdict, NO QED.
 * No refereed bound is changed.
 *
 * @see imp-35473-eflow-fartail-remnant-sub1e4-crossing (two-crossing product datapoints this tabulates)
 * @see imp-35496-eflow-fartail-remnant-two-component-split (both components vanish faster than 1/log N)
 * @see imp-35413-eflow-fartail-remnant-sub1e3-crossing (sub-1e-3 crossing, product ~0.05899)
 * @see imp-35198-eflow-fartail-exponent-logn-correction (the analytic -1 + 3/log N leading form)
 * @see imp-35135-eflow-fartail-decay-exponent-positivity-reconciliation (far-tail E_flow quantity)
 */

const TWO_PI = 2 * Math.PI;

// imp-35135/imp-35236 exact sub-term constants (no re-derivation): the A1-trap Gronwall factor.
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP);

// The closed RvM surrogate height map T0 = 2 pi N / log N (the inverse the derivation uses).
function surrogateHeightForN(N) {
  return (TWO_PI * N) / Math.log(N);
}

// EXACT imp-35135 far-tail E_flow quantity on the closed surrogate height map (imp-35236 form).
function eFlowWith(N) {
  const T0 = surrogateHeightForN(N);
  const L = Math.log(T0);
  const C_F = (Math.log(T0 / TWO_PI) + 1) / TWO_PI; // imp-398 pinned prefactor
  return C_F * (L / T0) * GRONWALL;
}

// Local log-log decay exponent by the SAME central difference as imp-35135/imp-35473 (h = 1.0002).
function localExponent(N) {
  const h = 1.0002;
  const lo = Math.log(eFlowWith(N / h));
  const hi = Math.log(eFlowWith(N * h));
  return (hi - lo) / (Math.log(N * h) - Math.log(N / h));
}

// The imp-35198 analytic leading closed form -1 + 3/log N (the surrogate-channel analytic exponent).
function analyticSurrogateExponent(x) {
  return -1 + 3 / x;
}

// The fd-vs-analytic remnant at a given log10 N exponent e (the imp-35280/imp-35473 quantity).
function remnantAtLog10(e) {
  const N = Math.pow(10, e);
  const x = Math.log(N);
  const fd = localExponent(N);
  const analytic = analyticSurrogateExponent(x);
  return Math.abs(analytic - fd);
}

// The imp-35473 PRODUCT P(N) = remnant(N) * log N at a given log10 N exponent e.
function productAtLog10(e) {
  const N = Math.pow(10, e);
  return remnantAtLog10(e) * Math.log(N);
}

// Local decay exponent of the PRODUCT: q = d log P / d log x, x = log N, central diff in e.
function productExponentAtLog10(e) {
  const de = 0.5;
  const xLo = Math.log((e - de) * Math.LN10);
  const xHi = Math.log((e + de) * Math.LN10);
  return (Math.log(productAtLog10(e + de)) - Math.log(productAtLog10(e - de))) / (xHi - xLo);
}

// The dense product-decay ladder across N = 1e26..1e200 on the fixed closed surrogate channel.
const LADDER_EXPONENTS = [26, 30, 40, 50, 60, 70, 80, 90, 100, 120, 140, 160, 180, 200];
const LADDER = LADDER_EXPONENTS.map((e) => ({
  log10N: e,
  N: +Math.pow(10, e).toExponential(0),
  remnant: +remnantAtLog10(e).toExponential(4),
  product: +productAtLog10(e).toFixed(6),
  productExponent: +productExponentAtLog10(e).toFixed(5),
}));

const PRODUCT_HEAD = productAtLog10(26); // 0.058620
const PRODUCT_TAIL = productAtLog10(200); // 0.016296
const PRODUCT_DROP_FACTOR = PRODUCT_HEAD / PRODUCT_TAIL; // ~3.60x over 174 decades
const Q_HEAD = productExponentAtLog10(26); // ~-0.43459
const Q_TAIL = productExponentAtLog10(200); // ~-0.73973

// Monotonicity flags measured directly off the ladder (product strictly down; q strictly more negative).
const PRODUCT_MONOTONE_DOWN = LADDER.every(
  (row, i) => i === 0 || row.product < LADDER[i - 1].product,
);
const Q_STEEPENS_MONOTONE = LADDER.every(
  (row, i) => i === 0 || row.productExponent < LADDER[i - 1].productExponent,
);
const Q_ALL_NEGATIVE = LADDER.every((row) => row.productExponent < 0);

export const IMP35535_EFLOW_FARTAIL_REMNANT_PRODUCT_DECAY_LADDER = {
  id: 'imp-35535',
  proofSection: 'S-frontier',
  question:
    'Across N = 1e26..1e200 on the imp-35473 closed surrogate channel, does the fd-vs-analytic ' +
    'remnant*log N product flatten toward a nonzero log-floor or keep decaying toward zero?',
  method:
    'On the closed surrogate height map T0 = 2 pi N / log N (surrogate channel only; no ' +
    'effectiveHeightForN, hence no heavy import; byte-identical eFlowWith/localExponent/remnant ' +
    'to imp-35473), tabulate P(N) = remnant*log N at a dense set of rungs and measure the local ' +
    'product decay exponent q = d log P / d log x (x = log N). q -> 0 would signal a log-floor; ' +
    'q bounded away from 0 (and steepening) signals continued decay to zero.',
  ladder: LADDER,
  product: {
    at1e26: +PRODUCT_HEAD.toFixed(6),
    at1e200: +PRODUCT_TAIL.toFixed(6),
    dropFactor1e26to1e200: +PRODUCT_DROP_FACTOR.toFixed(4),
    exponentAt1e26: +Q_HEAD.toFixed(5),
    exponentAt1e200: +Q_TAIL.toFixed(5),
  },
  finding: {
    F1_product_decays_monotonically:
      'Across the full N = 1e26..1e200 ladder the remnant*log N product falls monotonically from ' +
      '0.058620 to 0.016296 -- a ~3.60x drop over 174 decades; the imp-35473 ~2.3x between-crossings ' +
      'drop is one segment of this continuous decline, not a slowing tail.',
    F2_product_exponent_negative_and_steepening:
      'The local product decay exponent q = d log P / d log x is NEGATIVE at every rung and steepens ' +
      'monotonically from ~-0.435 (1e26) toward ~-0.740 (1e200) -- it does NOT relax toward 0, so the ' +
      'product does not approach a positive log-floor.',
    F3_no_log_floor_continues_to_zero:
      'A nonzero log-floor (remnant ~ c/log N) would pin P -> c > 0 with q -> 0; here q pulls AWAY ' +
      'from 0, so the remnant decays strictly faster than 1/log N with no floor in sight through ' +
      'N = 1e200 -- consistent with the imp-35496 split in which both prefactor and Taylor pieces vanish.',
  },
  isRigorous: false,
  honestStatus:
    'On the imp-35473 closed surrogate channel the fd-vs-analytic remnant*log N product decays ' +
    'monotonically from 0.058620 (1e26) to 0.016296 (1e200), and its local decay exponent ' +
    'q = d log P / d log x is negative at every rung and steepens from ~-0.435 to ~-0.740 -- it does ' +
    'NOT flatten toward 0, so the product keeps heading to zero (no nonzero log-floor). Measurement ' +
    'only on the inherited imp-3220/imp-3406 surrogate; changes no bound; NO QED.',
  verdict:
    'MEASUREMENT ONLY (frontier-direction, NOT rigorous). Tabulating the imp-35473 remnant*log N ' +
    'product across N = 1e26..1e200 on the identical closed surrogate channel, the product decays ' +
    'monotonically (0.058620 -> 0.016296, ~3.60x over 174 decades) and its local decay exponent ' +
    'q = d log P / d log x is negative everywhere and steepens from ~-0.435 to ~-0.740, pulling AWAY ' +
    'from 0 -- so the product continues toward zero and does NOT approach a nonzero log-floor; the ' +
    'remnant decays strictly faster than 1/log N. Consistent with imp-35473 slow-decay and the ' +
    'imp-35496 component split. Measurement only on the inherited imp-3220/imp-3406 surrogate, NOT a ' +
    'rigorous asymptotic; E_flow > 0 strictness (imp-33848) untouched; C_mb GUE-conditional per ' +
    'imp-486 UNTOUCHED; E_coll far-tail exponent 1/2 per imp-3463; imp-3066 K_a >= 0 untouched; ' +
    'changes no bound; no operator positivity; no RH verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-35473 (two-crossing product datapoints 0.05899/0.02514, tabulated here); imp-35496 (both ' +
    'components vanish faster than 1/log N); imp-35413 (sub-1e-3 crossing); imp-35198 (analytic ' +
    '-1 + 3/log N); imp-35135 (far-tail E_flow quantity); imp-486 (C_mb GUE-conditional, UNTOUCHED).',
};

export const IMP35535_EFLOW_FARTAIL_REMNANT_PRODUCT_DECAY_LADDER_ASSERTIONS = [
  {
    // Reproduce the imp-35473 surrogate channel: the head-rung product at N = 1e26 ~ 0.05862.
    id: 'imp35535-reproduces-surrogate-head-product',
    description: 'the live remnant*log N at N = 1e26 matches ~0.05862 (imp-35473 surrogate channel)',
    holds: () => Math.abs(PRODUCT_HEAD - 0.058620) < 5e-5,
  },
  {
    // The product decays strictly monotonically down across the whole ladder.
    id: 'imp35535-product-monotone-down',
    description: 'remnant*log N strictly decreases at every rung across N = 1e26..1e200',
    holds: () => PRODUCT_MONOTONE_DOWN === true,
  },
  {
    // The local product decay exponent is negative at every rung (no floor).
    id: 'imp35535-product-exponent-all-negative',
    description: 'q = d log P / d log x < 0 at every rung',
    holds: () => Q_ALL_NEGATIVE === true,
  },
  {
    // The exponent steepens (more negative) monotonically -- it does NOT relax toward 0.
    id: 'imp35535-product-exponent-steepens',
    description: 'q steepens monotonically from ~-0.435 (1e26) toward ~-0.740 (1e200), away from 0',
    holds: () =>
      Q_STEEPENS_MONOTONE === true &&
      Q_HEAD < -0.4 &&
      Q_TAIL < -0.7 &&
      Q_TAIL < Q_HEAD,
  },
  {
    // Over 174 decades the product drops by a clear factor (~3.6x) -- continues toward zero.
    id: 'imp35535-product-drops-over-ladder',
    description: 'product at 1e200 is ~3.6x below the 1e26 value, continuing toward zero',
    holds: () => Math.abs(PRODUCT_DROP_FACTOR - 3.597) < 0.05 && PRODUCT_TAIL < PRODUCT_HEAD,
  },
  {
    // Honesty gate: measurement only, no bound change, no QED, no refereed bound is changed.
    id: 'imp35535-honesty-gate-no-qed',
    description: 'Measurement only: isRigorous false, no QED, no refereed bound is changed',
    holds: () =>
      IMP35535_EFLOW_FARTAIL_REMNANT_PRODUCT_DECAY_LADDER.isRigorous === false &&
      /NO QED/.test(IMP35535_EFLOW_FARTAIL_REMNANT_PRODUCT_DECAY_LADDER.verdict) &&
      /refereed bound is changed/i.test(IMP35535_EFLOW_FARTAIL_REMNANT_PRODUCT_DECAY_LADDER.verdict),
  },
];

for (const a of IMP35535_EFLOW_FARTAIL_REMNANT_PRODUCT_DECAY_LADDER_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-35535-eflow-fartail-remnant-product-decay-ladder assertion failed: ${a.id}`,
    );
  }
}

export default IMP35535_EFLOW_FARTAIL_REMNANT_PRODUCT_DECAY_LADDER;
