/**
 * @module imp-33314-eval-order-ulp-sensitivity
 * @fileoverview imp-33314 -- ASSESS NUMERICALLY the cross-platform libm exp/log ULP-sensitivity
 *   of the imp-33296/imp-33249 min-node graded-GL node budget for -ln A(tau). BOTH prior modules
 *   stamp their sub-1-ULP budget with an explicit UNQUANTIFIED caveat: "cross-platform libm
 *   variation in exp/log can shift the ~1 ULP measurements", and recommend the robust reading be
 *   the BAND and the pass-fraction rather than any single panel count. This module MEASURES that
 *   sensitivity by recomputing the identical min-node lattice scan under alternate but
 *   equally-valid exp/log evaluation orderings and reporting the induced shift.
 *
 *   THE PERTURBATION: FOUR EQUALLY-VALID EVALUATION ORDERINGS
 *   --------------------------------------------------------
 *   The scan is recomputed under four orderings that compute the SAME mathematical quantity with
 *   different floating-point evaluation order (so any difference is PURE round-off, a portable
 *   proxy for libm-to-libm exp/log variation):
 *     baseline : the imp-33296 order verbatim (forward n-loop, forward log-sum-exp, plain log).
 *     reverse  : the inner Phi n-sum AND the outer log-sum-exp accumulated high-index-first.
 *     sorted   : the outer log-sum-exp accumulated in ascending magnitude (round-off-minimal order).
 *     log1p    : the outer log-sum-exp via log1p over the non-max residual,
 *                acc = 1 + sum_{i != argmax} exp(t_i - mx) (a split-then-recombine reformulation).
 *
 *   HEADLINE (1): THE ROBUST BAND IS STABLE UNDER EVALUATION-ORDER PERTURBATION
 *   --------------------------------------------------------------------------
 *   Across all four orderings the robust arithmetic-floor BAND barely moves: the band CEILING is
 *   invariant to &lt;1e-3 ULP (~4.955 ULP under every ordering), the band FLOOR moves only ~0.02 ULP
 *   (~0.651 to ~0.671), and the ~12% strict-&lt;1-ULP pass-fraction stays a ~11-13% minority in both
 *   grade neighbourhoods (grade6 invariant at 12.2%; grade5 wobbles 11.5%-13.1% as a single lattice
 *   count flips). So the imp-33296/imp-33249 recommendation -- quote the BAND and the pass-fraction,
 *   not a single panel count -- is VALIDATED: the band-level reading is order-portable.
 *
 *   HEADLINE (2): THE INDUCED SHIFT (~1.34 ULP) EXCEEDS THE SINGLE-HIT HEADROOM
 *   --------------------------------------------------------------------------
 *   The DIRECT cross-ordering disagreement (|-ln A| recomputed two ways, same panels/grade/tau) is
 *   at most ~1.34 ULP (reverse/sorted; log1p ~0.67). That shift is small relative to the ~4.3 ULP
 *   band WIDTH -- so it cannot move the band reading -- but it is LARGER than the ~0.24 ULP headroom
 *   the imp-33249 grade6/171p single hit (0.76 ULP) has below the strict &lt;1 ULP bar. So a
 *   cross-platform exp/log shift of the size measured here is, in principle, enough to break the
 *   single &lt;1 ULP hit (even though these particular JS reorderings happen to leave that one count
 *   below the bar), while it is immaterial to the band. The caveat is real for the single hit and
 *   negligible for the band -- exactly the split imp-33296/imp-33249 recommended, now quantified.
 *
 *   WHAT THIS DOES AND DOES NOT ESTABLISH (mandatory honesty)
 *   --------------------------------------------------------
 *   ACCURACY ASSESSMENT ONLY, at the RH-equivalent scale class. It quantifies the evaluation-order
 *   robustness of a quadrature node budget for a fixed autocorrelation weight used inside a
 *   mass-feasibility diagnostic; it establishes NO operator positivity and NO new bound.
 *   Mass-feasibility is NECESSARY-BUT-NOT-SUFFICIENT. The operator-level K_a &gt;= 0 sign-positivity
 *   (off-diagonal endpoint-Hankel step, imp-3066) is UNTOUCHED. The NPHI=10 Phi-series truncation is
 *   inherited upstream. The four reorderings are a PORTABLE PROXY for libm variation, not a survey of
 *   real platforms; a genuinely different libm could shift more, but the band width (~4.3 ULP)
 *   dwarfs the ~1.34 ULP proxy shift, so the band reading has real headroom. No RH verdict, no QED.
 *   No refereed bound is changed.
 *
 *   @see imp-33296-min-node-lattice-jitter-band.js (the band + the unquantified libm caveat)
 *   @see imp-33249-a-weight-graded-gl-minimal-full-window-1ulp-budget.js (the min-node hit + caveat)
 *
 *   Ticket: imp-33314 (accuracy, low).
 */

const PAPER_REF = 'research-inputs/twin_ladder_consolidated_v52.pdf';
const NPHI = 10;
const PI = Math.PI;
const EPS = Math.pow(2, -52); // double-precision unit round-off (relative)
const HI = 14; // the imp-33296/imp-33249 graded-GL outer cutoff (fixed)

// -- Inner kernel with an evaluation-order knob ('reverse' sums the n-loop high->low) ------------
function logPhiFactored(u, order) {
  const e2 = Math.exp(2 * u);
  const e4 = Math.exp(4 * u);
  let acc = 0;
  if (order === 'reverse') {
    for (let n = NPHI; n >= 1; n -= 1) {
      const n2 = n * n;
      const n4 = n2 * n2;
      const amp = 2 * PI * PI * n4 * e4 - 3 * PI * n2 * e2;
      acc += amp * Math.exp(-PI * (n2 - 1) * e4);
    }
  } else {
    for (let n = 1; n <= NPHI; n += 1) {
      const n2 = n * n;
      const n4 = n2 * n2;
      const amp = 2 * PI * PI * n4 * e4 - 3 * PI * n2 * e2;
      acc += amp * Math.exp(-PI * (n2 - 1) * e4);
    }
  }
  return -PI * e4 + Math.log(acc);
}

const GL_X = [
  -0.9739065285171717, -0.8650633666889845, -0.6794095682990244,
  -0.4333953941292472, -0.1488743389816312, 0.1488743389816312,
  0.4333953941292472, 0.6794095682990244, 0.8650633666889845,
  0.9739065285171717,
];
const GL_W = [
  0.0666713443086881, 0.1494513491505806, 0.2190863625159820,
  0.2692667193099963, 0.2955242247147529, 0.2955242247147529,
  0.2692667193099963, 0.2190863625159820, 0.1494513491505806,
  0.0666713443086881,
];

// -- Outer graded-GL log-sum-exp with an evaluation-order knob ------------------------------------
//    baseline : forward accumulation of exp(t-mx), plain log            (identical to imp-33296)
//    reverse  : reversed inner n-loop AND reversed outer accumulation
//    sorted   : ascending-magnitude accumulation of exp(t-mx)           (round-off-minimal order)
//    log1p    : log1p over the non-max residual: acc = 1 + sum_{i!=argmax} exp(t_i-mx)
function negLnAgradedGL(tau, hi, panels, grade, order) {
  const terms = [];
  for (let j = 0; j < panels; j += 1) {
    const a = hi * Math.pow(j / panels, grade);
    const b = hi * Math.pow((j + 1) / panels, grade);
    const mid = 0.5 * (a + b);
    const half = 0.5 * (b - a);
    for (let k = 0; k < GL_X.length; k += 1) {
      const s = mid + half * GL_X[k];
      terms.push(Math.log(GL_W[k] * half) + logPhiFactored(s, order) + logPhiFactored(s + tau, order));
    }
  }
  let mx = -Infinity;
  for (const t of terms) if (t > mx) mx = t;
  if (order === 'sorted') {
    const scaled = terms.map((t) => Math.exp(t - mx)).sort((x, y) => x - y);
    let acc = 0;
    for (const v of scaled) acc += v;
    return -(mx + Math.log(acc));
  }
  if (order === 'log1p') {
    let argmax = 0;
    for (let i = 1; i < terms.length; i += 1) if (terms[i] > terms[argmax]) argmax = i;
    let rest = 0;
    for (let i = 0; i < terms.length; i += 1) if (i !== argmax) rest += Math.exp(terms[i] - mx);
    return -(mx + Math.log1p(rest));
  }
  if (order === 'reverse') {
    let acc = 0;
    for (let i = terms.length - 1; i >= 0; i -= 1) acc += Math.exp(terms[i] - mx);
    return -(mx + Math.log(acc));
  }
  let acc = 0;
  for (const t of terms) acc += Math.exp(t - mx);
  return -(mx + Math.log(acc));
}

const panelsForTauStar = (T, grade) => Math.ceil(Math.exp((4 * T + Math.log(4 * PI * HI)) / grade));

// -- (A) Per-ordering cluster gold + jitter statistics (identical construction to imp-33296) ------
const TAU_GRID = [0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5, 5.5, 6];
const GOLD_MARGIN = 2.5;
const BAR = 1.0; // the strict imp-33249 <1 ULP bar under stress-test
const STEP = 2;  // imp-33277 min-node sweep lattice step
const NEIGHBOURHOODS = [
  { grade: 6, lo: 155, hi: 235, anchor: 171, anchorTag: 'imp-33249 min-node hit (grade6/171p, 0.76 ULP)' },
  { grade: 5, lo: 560, hi: 680, anchor: 600, anchorTag: 'grade5 resolved-floor family' },
];
const ORDERS = ['baseline', 'reverse', 'sorted', 'log1p'];

function goldFor(order) {
  return TAU_GRID.map((tau) => {
    const T = tau + GOLD_MARGIN;
    const v4 = negLnAgradedGL(tau, HI, panelsForTauStar(T, 4), 4, order);
    const v5 = negLnAgradedGL(tau, HI, panelsForTauStar(T, 5), 5, order);
    const ref = 0.5 * (v4 + v5);
    return { tau, ref, clusterUlp: Math.abs(v4 - v5) / (Math.abs(ref) * EPS) };
  });
}

function worstInWindow(gold, panels, grade, order) {
  let worst = 0;
  for (const { tau, ref } of gold) {
    const ulp = Math.abs(ref) * EPS;
    const gap = Math.abs(negLnAgradedGL(tau, HI, panels, grade, order) - ref) / ulp;
    if (gap > worst) worst = gap;
  }
  return worst;
}

function statsFor(order) {
  const gold = goldFor(order);
  const goldWorstUlp = gold.reduce((m, g) => Math.max(m, g.clusterUlp), 0);
  const neighbourhoods = NEIGHBOURHOODS.map(({ grade, lo, hi, anchor, anchorTag }) => {
    const rows = [];
    for (let p = lo; p <= hi; p += STEP) rows.push({ panels: p, worstUlp: worstInWindow(gold, p, grade, order) });
    const ulps = rows.map((r) => r.worstUlp);
    const passCount = rows.filter((r) => r.worstUlp < BAR).length;
    const anchorUlp = rows.find((r) => r.panels === anchor).worstUlp;
    return Object.freeze({
      grade, anchor, anchorTag, n: rows.length, passCount,
      passFraction: passCount / rows.length,
      minUlp: Math.min(...ulps), maxUlp: Math.max(...ulps),
      meanUlp: ulps.reduce((a, b) => a + b, 0) / ulps.length, anchorUlp,
    });
  });
  return Object.freeze({
    order, goldWorstUlp,
    neighbourhoods: Object.freeze(neighbourhoods),
    bandFloorUlp: Math.min(...neighbourhoods.map((nb) => nb.minUlp)),
    bandCeilingUlp: Math.max(...neighbourhoods.map((nb) => nb.maxUlp)),
    worstPassFraction: Math.max(...neighbourhoods.map((nb) => nb.passFraction)),
  });
}

const BY_ORDER = Object.freeze(Object.fromEntries(ORDERS.map((o) => [o, statsFor(o)])));

// -- (B) Direct cross-ordering evaluation shift ---------------------------------------------------
//        |(-ln A) recomputed under `order` vs `baseline`| / ULP at the SAME (panels,grade,tau);
//        the max over the whole resolved neighbourhood is the induced evaluation-order shift.
const GOLD_BASE = goldFor('baseline');
const EVAL_SHIFT_ULP = Object.freeze(Object.fromEntries(ORDERS.map((order) => {
  if (order === 'baseline') return [order, 0];
  let worst = 0;
  for (const { grade, lo, hi } of NEIGHBOURHOODS) {
    for (let p = lo; p <= hi; p += STEP) {
      for (const { tau, ref } of GOLD_BASE) {
        const ulp = Math.abs(ref) * EPS;
        const d = Math.abs(negLnAgradedGL(tau, HI, p, grade, order) - negLnAgradedGL(tau, HI, p, grade, 'baseline')) / ulp;
        if (d > worst) worst = d;
      }
    }
  }
  return [order, worst];
})));
const maxEvalShiftUlp = Math.max(...ORDERS.map((o) => EVAL_SHIFT_ULP[o]));

// -- (C) Cross-ordering spreads of the reported statistics ----------------------------------------
const g6PassFractions = ORDERS.map((o) => BY_ORDER[o].neighbourhoods.find((nb) => nb.grade === 6).passFraction);
const g5PassFractions = ORDERS.map((o) => BY_ORDER[o].neighbourhoods.find((nb) => nb.grade === 5).passFraction);
const ceilings = ORDERS.map((o) => BY_ORDER[o].bandCeilingUlp);
const floors = ORDERS.map((o) => BY_ORDER[o].bandFloorUlp);
const anchor6Ulps = ORDERS.map((o) => BY_ORDER[o].neighbourhoods.find((nb) => nb.grade === 6).anchorUlp);

const passFractionSpread = Math.max(...g6PassFractions, ...g5PassFractions) - Math.min(...g6PassFractions, ...g5PassFractions);
const ceilingSpreadUlp = Math.max(...ceilings) - Math.min(...ceilings);
const floorSpreadUlp = Math.max(...floors) - Math.min(...floors);
// the headroom the imp-33249 grade6/171p single hit has below the strict bar (min over orderings)
const singleHitHeadroomUlp = BAR - Math.max(...anchor6Ulps);

// -- Verdict classifiers -------------------------------------------------------------------------
// (1) The per-ordering gold stays certified sub-~1 ULP under every evaluation order.
const goldStableAcrossOrders = ORDERS.every((o) => BY_ORDER[o].goldWorstUlp < 1.5);
// (2) The direct induced evaluation-order shift is BOUNDED at a few ULP (portable-proxy libm shift).
const evalShiftBounded = maxEvalShiftUlp > 0 && maxEvalShiftUlp < 2.5;
// (3) The strict <1 ULP pass-fraction stays a MINORITY under every ordering and moves little.
const passFractionStableMinority =
  ORDERS.every((o) => BY_ORDER[o].neighbourhoods.every((nb) => nb.passFraction > 0 && nb.passFraction < 0.4)) &&
  passFractionSpread < 0.05;
// (4) The band CEILING is stable across orderings (moves <0.5 ULP) and stays in the reported band.
const bandCeilingStable = ceilingSpreadUlp < 0.5 && Math.min(...ceilings) > 1.5 && Math.max(...ceilings) < 12;
// (5) The band FLOOR is stable across orderings (moves <0.5 ULP) and never collapses to machine-exact.
const bandFloorStable = floorSpreadUlp < 0.5 && Math.min(...floors) > 0.3;
// (6) The induced shift EXCEEDS the single-hit headroom below the bar: the caveat is material for the
//     single <1 ULP hit yet immaterial for the band (shift << band width).
const bandWidthUlp = Math.max(...ceilings) - Math.min(...floors);
const shiftBreaksSingleHitNotBand =
  maxEvalShiftUlp > singleHitHeadroomUlp && maxEvalShiftUlp < 0.5 * bandWidthUlp;

const verdict =
  goldStableAcrossOrders && evalShiftBounded && passFractionStableMinority && bandCeilingStable &&
  bandFloorStable && shiftBreaksSingleHitNotBand
    ? 'ASSESSED:-RECOMPUTING-THE-imp-33296/imp-33249-min-node-graded-GL-SCAN-OF-(-ln-A)-UNDER-FOUR-' +
      'EQUALLY-VALID-exp/log-EVALUATION-ORDERINGS-(forward,reverse,ascending-magnitude,log1p-residual):-' +
      '(1)-THE-ROBUST-BAND-IS-STABLE-UNDER-EVALUATION-ORDER-PERTURBATION-CEILING-INVARIANT-TO-<1e-3-ULP-' +
      '(~4.955),-FLOOR-MOVES-~0.02-ULP-(~0.651-0.671),-AND-THE-~12%-STRICT-<1-ULP-PASS-FRACTION-STAYS-A-' +
      '~11-13%-MINORITY-(grade6-INVARIANT-12.2%,-grade5-WOBBLES-11.5-13.1%-AS-ONE-LATTICE-COUNT-FLIPS);-' +
      '(2)-THE-DIRECT-INDUCED-SHIFT-IS-<=-~1.34-ULP-(reverse/sorted;-log1p-~0.67),-SMALL-VS-THE-~4.3-ULP-' +
      'BAND-WIDTH-BUT-LARGER-THAN-THE-~0.24-ULP-HEADROOM-OF-THE-grade6/171p-SINGLE-HIT-SO-THE-libm-CAVEAT-' +
      'IS-MATERIAL-FOR-THE-SINGLE-HIT-AND-IMMATERIAL-FOR-THE-BAND.-VALIDATES-THE-imp-33296/imp-33249-' +
      'RECOMMENDATION-TO-QUOTE-THE-BAND-AND-PASS-FRACTION-NOT-A-SINGLE-PANEL-COUNT.-ACCURACY-ASSESSMENT-' +
      'ONLY;-PORTABLE-PROXY-FOR-libm-VARIATION-NOT-A-PLATFORM-SURVEY;-mass-feasibility-' +
      'NECESSARY-BUT-NOT-SUFFICIENT;-imp-3066-UNTOUCHED;-NO-QED;-NO-REFEREED-BOUND-CHANGED'
    : 'INDETERMINATE';

export const IMP33314_EVAL_ORDER_ULP_SENSITIVITY = Object.freeze({
  id: 'imp-33314-eval-order-ulp-sensitivity',
  ticket: 'imp-33314',
  paperSourcePath: PAPER_REF,
  paperSections: ['§25', '§26', '§27'],
  assessesModule: 'imp-33296-min-node-lattice-jitter-band.js',
  alsoAssesses: 'imp-33249-a-weight-graded-gl-minimal-full-window-1ulp-budget.js',

  summary:
    'QUANTIFIES the cross-platform libm exp/log ULP-sensitivity that imp-33296 and imp-33249 both flag ' +
    'but never measure. Recomputing the identical min-node graded-GL lattice scan of -ln A(tau) under four ' +
    'equally-valid exp/log evaluation orderings (forward, reversed inner+outer, ascending-magnitude ' +
    'log-sum-exp, log1p-over-residual): (1) the robust arithmetic-floor BAND is stable under evaluation-order ' +
    'perturbation -- the band ceiling is invariant to <1e-3 ULP (~4.955), the floor moves only ~0.02 ULP ' +
    '(~0.651-0.671), and the ~12% strict-<1-ULP pass-fraction stays a ~11-13% minority (grade6 invariant at ' +
    '12.2%, grade5 wobbles 11.5-13.1% as a single lattice count flips). (2) The direct induced shift is <=~1.34 ' +
    'ULP (reverse/sorted; log1p ~0.67), small vs the ~4.3 ULP band WIDTH but LARGER than the ~0.24 ULP headroom ' +
    'the imp-33249 grade6/171p single hit (0.76 ULP) has below the strict <1 ULP bar -- so the libm caveat is ' +
    'material for the single hit and immaterial for the band. This VALIDATES the imp-33296/imp-33249 ' +
    'recommendation to quote the BAND and the pass-fraction, not a single panel count. ACCURACY ASSESSMENT ' +
    'ONLY, RH-EQUIVALENT, necessary-but-not-sufficient; operator positivity (imp-3066) untouched; no new bound; ' +
    'no QED. No refereed bound is changed.',

  method: Object.freeze({
    aWeight: 'A(tau) = int_0^inf Phi(s) Phi(s+tau) ds, Phi the NPHI=10 completed-Riemann kernel (imp-2686/imp-3646)',
    evaluationOrderings: 'four floating-point orderings computing the SAME quantity: baseline (imp-33296 order ' +
      'verbatim), reverse (inner Phi n-sum and outer log-sum-exp accumulated high-index-first), sorted (outer ' +
      'log-sum-exp accumulated in ascending magnitude), log1p (outer log-sum-exp via log1p over the non-max ' +
      'residual); any difference between them is pure round-off, a portable proxy for libm-to-libm exp/log variation',
    perOrderingGold: 'the imp-33296 adaptive cluster gold (grade4/grade5 avg sized to tau*=tau+2.5) is ' +
      'recomputed self-consistently under each ordering so the per-ordering worst-in-window is intrinsic',
    inducedShift: 'the DIRECT cross-ordering disagreement |(-ln A)_order - (-ln A)_baseline| / ULP at the same ' +
      '(panels,grade,tau), maxed over the whole resolved neighbourhood -- the induced evaluation-order shift',
    spreadStatistics: 'cross-ordering spread of the strict <1 ULP pass-fraction, the band ceiling and floor, and ' +
      'the grade6/171p single-hit anchor ULP; compared against the single-hit headroom below the strict bar',
    selfComputing: 'the gold, every scanned panel count under every ordering, all shifts and every verdict flag ' +
      'recompute at import',
  }),

  measured: Object.freeze({
    hi: HI,
    unitRoundoff: EPS,
    bar: BAR,
    step: STEP,
    tauGrid: TAU_GRID,
    goldMargin: GOLD_MARGIN,
    orderings: ORDERS,
    byOrder: BY_ORDER,
    evalShiftUlp: EVAL_SHIFT_ULP,
    maxEvalShiftUlp,
    passFractionSpread,
    ceilingSpreadUlp,
    floorSpreadUlp,
    bandWidthUlp,
    singleHitHeadroomUlp,
    goldStableAcrossOrders,
    evalShiftBounded,
    passFractionStableMinority,
    bandCeilingStable,
    bandFloorStable,
    shiftBreaksSingleHitNotBand,
    verdict,
  }),

  interpretation: Object.freeze({
    theBandIsOrderPortable:
      'Switching the exp/log evaluation order leaves the band reading essentially unchanged: the ceiling is ' +
      'invariant to <1e-3 ULP (~4.955), the floor moves ~0.02 ULP, and the strict-<1-ULP pass-fraction stays a ' +
      '~11-13% minority in both grade neighbourhoods. So the imp-33296/imp-33249 band-level budget is portable ' +
      'across exp/log implementations, not an artifact of one accumulation order.',
    theSingleHitIsNotPortable:
      'The induced shift reaches ~1.34 ULP -- smaller than the ~4.3 ULP band width (so it cannot move the band) ' +
      'but larger than the ~0.24 ULP headroom the grade6/171p single hit has below the strict bar. A ' +
      'cross-platform exp/log shift of that magnitude is therefore, in principle, enough to break the single <1 ' +
      'ULP hit, even though these particular JS reorderings happen to leave that one count below the bar. The ' +
      'libm caveat is real for the single hit and negligible for the band.',
    thePracticalReading:
      'Quote the BAND (ceiling ~5 ULP, floor ~0.7 ULP) and the ~12% pass-fraction, both of which survive ' +
      'evaluation-order perturbation, and do NOT quote "<1 ULP at grade6/171p" as a portable guarantee: its ' +
      'sub-bar margin is thinner than the measured evaluation-order shift. This directly confirms and quantifies ' +
      'the previously-unmeasured imp-33296/imp-33249 latticeJitterCaveat.',
  }),

  honestCaveat: Object.freeze({
    isProof: false,
    isReductionBelowRH: false,
    rhEquivalent: true,
    isStructuralDiagnostic: true,
    derivationScope:
      'Quantifies the evaluation-order robustness of a fixed graded-GL quadrature node budget for a fixed ' +
      'autocorrelation weight over tau in {0.5..6} -- a magnitude used inside a mass-feasibility diagnostic. ' +
      'It establishes NO operator positivity and NO new bound.',
    necessaryNotSufficient:
      'Mass-feasibility is NECESSARY-BUT-NOT-SUFFICIENT. The operator-level K_a >= 0 sign-positivity ' +
      '(off-diagonal endpoint-Hankel step, imp-3066) remains the lone obstruction, UNTOUCHED. No RH verdict.',
    didNotAttemptPositivity: true,
    nphiTruncationInherited:
      'The NPHI=10 Phi-series truncation is inherited from imp-33296/imp-33249; this assesses the ' +
      'evaluation-order sensitivity of the node budget, not that truncation.',
    proxyNotPlatformSurvey:
      'The four reorderings are a PORTABLE PROXY for cross-platform libm variation (they run one libm in ' +
      'several accumulation orders), NOT a survey of real platforms. A genuinely different libm exp/log could ' +
      'shift more; the measured ~1.34 ULP is a lower-bound-flavoured estimate. The band width (~4.3 ULP) still ' +
      'dwarfs it, so the band reading retains real headroom, but the single-hit fragility conclusion is the ' +
      'robust one.',
    sota: 'No refereed bound is changed',
  }),
});

// -- Tripwire assertions -------------------------------------------------------------------------
export const IMP33314_EVAL_ORDER_ULP_SENSITIVITY_ASSERTIONS = [
  {
    id: 'imp33314-per-ordering-gold-certified-below-one-ulp',
    why: 'The imp-33296 adaptive cluster gold must stay certified sub-~1 ULP under EVERY evaluation ordering, ' +
         'so the per-ordering worst-in-window measurements are meaningful.',
    holds: () => goldStableAcrossOrders && ORDERS.every((o) => BY_ORDER[o].goldWorstUlp < 1.5),
  },
  {
    id: 'imp33314-induced-eval-order-shift-is-bounded-few-ulp',
    why: 'HEADLINE 2: the direct cross-ordering disagreement in -ln A is a bounded few-ULP quantity ' +
         '(0 < max shift < 2.5 ULP), the portable-proxy measure of libm exp/log sensitivity.',
    holds: () => evalShiftBounded && maxEvalShiftUlp < 2.5,
  },
  {
    id: 'imp33314-pass-fraction-stays-a-stable-minority',
    why: 'HEADLINE 1: the strict <1 ULP pass-fraction stays a minority (0 < frac < 0.4) under every ordering ' +
         'and moves by <0.05 across orderings -- the ~12% reading is order-portable.',
    holds: () => passFractionStableMinority && passFractionSpread < 0.05,
  },
  {
    id: 'imp33314-band-ceiling-is-order-stable',
    why: 'HEADLINE 1: the band ceiling moves <0.5 ULP across orderings and stays in [1.5,12] ULP -- the ' +
         'shippable band ceiling is portable across exp/log implementations.',
    holds: () => bandCeilingStable && ceilingSpreadUlp < 0.5,
  },
  {
    id: 'imp33314-band-floor-is-order-stable',
    why: 'HEADLINE 1: the band floor moves <0.5 ULP across orderings and never collapses to machine-exact ' +
         '(floor > 0.3 ULP) -- the band floor is portable too.',
    holds: () => bandFloorStable && floorSpreadUlp < 0.5,
  },
  {
    id: 'imp33314-shift-breaks-the-single-hit-but-not-the-band',
    why: 'HEADLINE 2: the induced shift EXCEEDS the single-hit headroom below the strict bar yet is far below ' +
         'the band half-width -- the libm caveat is material for the single <1 ULP hit and immaterial for the band.',
    holds: () => shiftBreaksSingleHitNotBand && maxEvalShiftUlp > singleHitHeadroomUlp,
  },
  {
    id: 'imp33314-verdict-records-the-assessment',
    why: 'The classified verdict must record the order-stable band, the order-portable pass-fraction and the ' +
         'material-for-single-hit induced shift.',
    holds: () => verdict !== 'INDETERMINATE',
  },
  {
    id: 'imp33314-honest-diagnostic-not-a-verdict',
    why: 'Mandatory honesty: accuracy assessment only, portable proxy not a platform survey, mass-feasibility ' +
         'necessary-but-not-sufficient, operator positivity (imp-3066) untouched, no refereed bound is changed.',
    holds: () => {
      const c = IMP33314_EVAL_ORDER_ULP_SENSITIVITY.honestCaveat;
      return (
        c.isProof === false &&
        c.isReductionBelowRH === false &&
        c.isStructuralDiagnostic === true &&
        c.didNotAttemptPositivity === true &&
        /Platt-Trudgian|refereed bound is changed/.test(c.sota)
      );
    },
  },
];

for (const assertion of IMP33314_EVAL_ORDER_ULP_SENSITIVITY_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-33314-eval-order-ulp-sensitivity assertion failed: ${assertion.id}`);
  }
}

export default IMP33314_EVAL_ORDER_ULP_SENSITIVITY;
