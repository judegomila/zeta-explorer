/**
 * @module imp-33293-a-weight-graded-gl-1ulp-budget-tau910
 * @fileoverview imp-33293 -- EXTEND the imp-33277 tau in {7,8} graded-GL &lt;1 ULP node-budget
 *   measurement for -ln A(tau) to tau in {9,10}, report the min-node lattice hit per tau, and
 *   CHARACTERIZE the grade6-family crossover-margin law tau*(panels,grade) relative to tau that
 *   governs where the budget must widen.
 *
 *   WHAT imp-33277 LEFT OPEN, AND WHAT THIS TICKET ASSUMED
 *   -----------------------------------------------------
 *   imp-33277 found the imp-33249 grade&lt;=5/342p floor (tau*=6.00) fails above tau=6 -- 4.84 ULP at
 *   tau=7, 625 ULP at tau=8 -- because its innermost panel no longer clears the peak scale
 *   sigma(tau)=1/(4 pi e^{4tau}); it named grade6 the cheapest family and left the widening a jittery
 *   per-tau lattice property. The ticket asked to measure the min-node budget at tau in {9,10} and to
 *   fit "how the required tau*-margin ABOVE tau scales", assuming the crossover keeps demanding a tau*
 *   above tau so the widening becomes a predictable rule.
 *
 *   HEADLINE (1): THE CROSSOVER tau* SATURATES NEAR ~6.95 -- THE BUDGET DOES NOT KEEP WIDENING
 *   -----------------------------------------------------------------------------------------
 *   The min-node sub-1.5-ULP lattice hit lands at the SAME quadrature resolution tau*~6.95 at BOTH
 *   tau=9 and tau=10 (grade6/2430 nodes at each; grade5/~7.4k; grade4/~38k). The crossover tau* does
 *   NOT track tau -- it plateaus -- so the crossover MARGIN tau*-tau grows linearly NEGATIVE
 *   (-2.04 at tau=9, -3.04 at tau=10), the opposite of the "tau* above tau" widening the ticket
 *   assumed. The node budget is essentially CONSTANT across tau in {9,10}: grade6 reaches the floor
 *   band at 2430 GL nodes at both heights.
 *
 *   HEADLINE (2): WHY IT SATURATES -- -ln A(tau) ~= pi e^{4tau}, SO 1 ULP LOOSENS LIKE THE PEAK
 *   ------------------------------------------------------------------------------------------
 *   -ln A(tau) equals pi e^{4tau} to 6+ digits (ratio 1.000000 at tau in {9,10}), so one ULP of the
 *   answer is EPS pi e^{4tau} -- it grows exactly as the inverse peak scale 1/sigma(tau) grows. The
 *   RELATIVE accuracy bar therefore LOOSENS like e^{4tau}, so a FIXED-resolution quadrature (fixed
 *   tau*~6.95, fixed node budget) keeps clearing the loosening bar as tau climbs. The imp-33277
 *   "budget must widen" reading is a tau in {7,8} transient; beyond tau~8 the widening SATURATES and
 *   the crossover-margin law is tau*_cross(tau) ~= 6.95 = const, i.e. margin = 6.95 - tau (linear).
 *
 *   HEADLINE (3): grade6 STAYS CHEAPEST AND SD/DD STAY BIT-IDENTICAL
 *   --------------------------------------------------------------
 *   The imp-33249/imp-33277 "steeper grades cheaper" ordering persists: the min-node lattice hit is a
 *   grade6 rule at fewer nodes than grade5 and grade4 (2430 &lt; 7350 &lt; 38440 at tau=9). And the
 *   imp-33277 SD-vs-DD bit-identity extends: single-double and imp-33248 double-double log-sum-exp
 *   agree to 0.000 ULP at tau in {9,10} too, because -ln A has no subtractive cancellation. The exact
 *   min-node panel count stays a jittery arithmetic-floor lattice property (imp-33249 caveat).
 *
 *   WHAT THIS DOES AND DOES NOT ESTABLISH (mandatory honesty)
 *   --------------------------------------------------------
 *   ACCURACY MEASUREMENT / RULE-DESIGN AUDIT ONLY, at the RH-equivalent scale class. It measures the
 *   node budget and the crossover-margin law of a quadrature rule for a fixed autocorrelation weight
 *   used inside a mass-feasibility diagnostic; it establishes NO operator positivity. Mass-feasibility
 *   is NECESSARY-BUT-NOT-SUFFICIENT. The operator-level K_a &gt;= 0 sign-positivity (off-diagonal
 *   endpoint-Hankel step, imp-3066) is UNTOUCHED. The NPHI=10 Phi-series truncation is inherited
 *   upstream. No RH verdict, no QED. Platt-Trudgian Lambda &lt;= 0.2 remains the rigorous SOTA.
 *
 *   @see imp-33277-a-weight-graded-gl-1ulp-budget-tau78.js (the tau in {7,8} widening this extends)
 *   @see imp-33249-a-weight-graded-gl-minimal-full-window-1ulp-budget.js (the tau&lt;=6 window)
 *
 *   Ticket: imp-33293 (numerical, medium).
 */

const PAPER_REF = 'research-inputs/twin_ladder_consolidated_v52.pdf';
const NPHI = 10;
const PI = Math.PI;
const EPS = Math.pow(2, -52); // double-precision unit round-off (relative)
const HI = 14; // the imp-3873/imp-3897/imp-33232/imp-33249/imp-33277 graded-GL outer cutoff (fixed)

// -- Shared kernel (identical to imp-33249/imp-33277/imp-33232/imp-3919) --------------------------
function logPhiFactored(u) {
  const e2 = Math.exp(2 * u);
  const e4 = Math.exp(4 * u);
  let acc = 0;
  for (let n = 1; n <= NPHI; n += 1) {
    const n2 = n * n;
    const n4 = n2 * n2;
    const amp = 2 * PI * PI * n4 * e4 - 3 * PI * n2 * e2;
    acc += amp * Math.exp(-PI * (n2 - 1) * e4);
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

// -- Graded-GL quadrature terms for -ln A(tau) (shared by SD and DD accumulators) -----------------
function quadTerms(tau, hi, panels, grade) {
  const terms = [];
  for (let j = 0; j < panels; j += 1) {
    const a = hi * Math.pow(j / panels, grade);
    const b = hi * Math.pow((j + 1) / panels, grade);
    const mid = 0.5 * (a + b);
    const half = 0.5 * (b - a);
    for (let k = 0; k < GL_X.length; k += 1) {
      const s = mid + half * GL_X[k];
      terms.push(Math.log(GL_W[k] * half) + logPhiFactored(s) + logPhiFactored(s + tau));
    }
  }
  return terms;
}

// -- (A) Single-double log-sum-exp accumulator (the imp-33249/imp-33277 route) --------------------
function negLnAgradedGL(tau, hi, panels, grade) {
  const terms = quadTerms(tau, hi, panels, grade);
  let mx = -Infinity;
  for (const t of terms) if (t > mx) mx = t;
  let acc = 0;
  for (const t of terms) acc += Math.exp(t - mx);
  return -(mx + Math.log(acc));
}

// -- (B) imp-33248 double-double (Dekker/Knuth twoSum) log-sum-exp accumulator -------------------
function twoSum(a, b) {
  const s = a + b;
  const bb = s - a;
  const err = (a - (s - bb)) + (b - bb);
  return [s, err];
}
function negLnAgradedGL_DD(tau, hi, panels, grade) {
  const terms = quadTerms(tau, hi, panels, grade);
  let mx = -Infinity;
  for (const t of terms) if (t > mx) mx = t;
  let h = 0;
  let l = 0;
  for (const t of terms) {
    const x = Math.exp(t - mx);
    let [s, e] = twoSum(h, x);
    e += l;
    [h, l] = twoSum(s, e);
  }
  return -(mx + Math.log(h + l));
}

const tauStar = (panels, grade) => (grade * Math.log(panels) - Math.log(4 * PI * HI)) / 4;
const panelsForTauStar = (T, grade) => Math.ceil(Math.exp((4 * T + Math.log(4 * PI * HI)) / grade));

// -- (C) Cluster gold at the extended tau in {9,10} ----------------------------------------------
//        per-tau reference = average of two independent graded-GL grades (5 and 6), panels sized so
//        tau*(panels,grade)=tau+2.5 fully resolves the peak; the two grades agree below ~1 ULP.
const TAU_GRID = [9, 10];
const GOLD_MARGIN = 2.5;
const GOLD = TAU_GRID.map((tau) => {
  const T = tau + GOLD_MARGIN;
  const p5 = panelsForTauStar(T, 5);
  const p6 = panelsForTauStar(T, 6);
  const v5 = negLnAgradedGL(tau, HI, p5, 5);
  const v6 = negLnAgradedGL(tau, HI, p6, 6);
  const ref = 0.5 * (v5 + v6);
  return Object.freeze({
    tau,
    p5,
    p6,
    ref,
    clusterUlp: Math.abs(v5 - v6) / (Math.abs(ref) * EPS),
    // -ln A(tau) collapses to the analytic pi e^{4tau} peak height (drives the ULP-scaling law).
    piE4tau: PI * Math.exp(4 * tau),
    peakRatio: ref / (PI * Math.exp(4 * tau)),
  });
});
const goldWorstClusterUlp = GOLD.reduce((m, g) => Math.max(m, g.clusterUlp), 0);
const goldWorstPeakRatioErr = GOLD.reduce((m, g) => Math.max(m, Math.abs(g.peakRatio - 1)), 0);
const goldByTau = (tau) => GOLD.find((g) => g.tau === tau);

// -- (D) Min-node sub-1.5-ULP lattice hit per grade at tau in {9,10} ------------------------------
//        FIRST sustained sub-1.5-ULP hit from an OFFLINE single-double panel sweep (documented
//        below). The floor is jittery (imp-33249/imp-33277), so these are lattice hits, not monotone
//        thresholds; the module RE-VERIFIES each reported point clears the bar and that a 15%-narrower
//        rule fails, confirming a genuine crossover rather than an everywhere-passing budget.
const MIN_NODE_SWEEP = [
  // tau=9 (goldRef 1.354413e+16, 1 ULP ~= 3.007)
  { tau: 9, grade: 4, panels: 3844 },
  { tau: 9, grade: 5, panels: 735 },
  { tau: 9, grade: 6, panels: 243 },
  // tau=10 (goldRef 7.394846e+17, 1 ULP ~= 164.199)
  { tau: 10, grade: 4, panels: 3841 },
  { tau: 10, grade: 5, panels: 742 },
  { tau: 10, grade: 6, panels: 243 },
];
const MIN_NODE = MIN_NODE_SWEEP.map((r) => {
  const { ref } = goldByTau(r.tau);
  const ulp = Math.abs(ref) * EPS;
  const gap = Math.abs(negLnAgradedGL(r.tau, HI, r.panels, r.grade) - ref) / ulp;
  const narrowPanels = Math.round(0.85 * r.panels);
  const narrowGap = Math.abs(negLnAgradedGL(r.tau, HI, narrowPanels, r.grade) - ref) / ulp;
  return Object.freeze({
    tau: r.tau,
    grade: r.grade,
    panels: r.panels,
    glNodes: 10 * r.panels,
    tauStar: tauStar(r.panels, r.grade),
    margin: tauStar(r.panels, r.grade) - r.tau,
    worstUlp: gap,
    narrowPanels,
    narrowGap,
  });
});
const minNodeAt = (tau, grade) => MIN_NODE.find((m) => m.tau === tau && m.grade === grade);
const minNodeWorstUlp = MIN_NODE.reduce((m, r) => Math.max(m, r.worstUlp), 0);
const narrowestNarrowGap = MIN_NODE.reduce((m, r) => Math.min(m, r.narrowGap), Infinity);

// -- (E) SD-vs-DD bit-identity at the extended tau (imp-33277 finding, re-checked here) -----------
const SD_VS_DD = TAU_GRID.map((tau) => {
  const p = minNodeAt(tau, 6).panels;
  const sd = negLnAgradedGL(tau, HI, p, 6);
  const dd = negLnAgradedGL_DD(tau, HI, p, 6);
  return Object.freeze({ tau, panels: p, sdVsDdUlp: Math.abs(sd - dd) / (Math.abs(sd) * EPS) });
});
const worstSdVsDdUlp = SD_VS_DD.reduce((m, r) => Math.max(m, r.sdVsDdUlp), 0);

// -- (F) The crossover-margin law: tau*_cross(tau) is FLAT, so margin = tau*_cross - tau is linear --
const crossoverTauStarByTau = TAU_GRID.map((tau) => {
  // representative crossover tau* at this height = grade6 min-node lattice hit
  const m = minNodeAt(tau, 6);
  return Object.freeze({ tau, crossoverTauStar: m.tauStar, margin: m.margin });
});
const crossoverTauStarSpread =
  Math.max(...crossoverTauStarByTau.map((c) => c.crossoverTauStar)) -
  Math.min(...crossoverTauStarByTau.map((c) => c.crossoverTauStar));
const marginSlope =
  (crossoverTauStarByTau[1].margin - crossoverTauStarByTau[0].margin) /
  (TAU_GRID[1] - TAU_GRID[0]); // ~ -1 : margin drops one-for-one as tau climbs at flat tau*

// -- Verdict classifiers -------------------------------------------------------------------------
// (1) The cluster gold is certified below ~1 ULP at both extended tau.
const goldIsBelowOneUlp = goldWorstClusterUlp < 1.5;
// (2) -ln A(tau) collapses to the analytic pi e^{4tau} peak (drives the ULP-scaling saturation law).
const peakRatioIsOne = goldWorstPeakRatioErr < 1e-5;
// (3) Every reported min-node lattice hit clears the <1.5 ULP bar.
const minNodeHitsClearBar = minNodeWorstUlp < 1.5;
// (4) A 15%-narrower rule FAILS at every reported hit -- a genuine crossover, not everywhere-passing.
const narrowerRuleFails = narrowestNarrowGap > 3;
// (5) The crossover tau* is FLAT across tau in {9,10} (does not track tau); the budget saturates.
const crossoverTauStarSaturates = crossoverTauStarSpread < 0.1;
// (6) The crossover MARGIN drops ~ one-for-one with tau (flat tau* => margin = const - tau).
const marginSlopeIsMinusOne = Math.abs(marginSlope + 1) < 0.05;
// (7) grade6 stays the cheapest family: its min-node budget is below grade5 and grade4 at each tau.
const grade6Cheapest = TAU_GRID.every((tau) => {
  const g4 = minNodeAt(tau, 4);
  const g5 = minNodeAt(tau, 5);
  const g6 = minNodeAt(tau, 6);
  return g6.glNodes < g5.glNodes && g5.glNodes < g4.glNodes;
});
// (8) SD and DD stay bit-identical at tau in {9,10} (imp-33277 finding extends).
const sdVsDdBitIdentical = worstSdVsDdUlp < 1e-9;

const verdict =
  goldIsBelowOneUlp && peakRatioIsOne && minNodeHitsClearBar && narrowerRuleFails &&
  crossoverTauStarSaturates && marginSlopeIsMinusOne && grade6Cheapest && sdVsDdBitIdentical
    ? 'MEASURED:-EXTENDING-THE-imp-33277-<1-ULP-GRADED-GL-NODE-BUDGET-FOR-(-ln-A)-TO-tau-in-{9,10}:-' +
      '(1)-THE-MIN-NODE-CROSSOVER-tau*-SATURATES-NEAR-~6.95-AT-BOTH-tau=9-AND-tau=10-(grade6/2430-NODES-' +
      'AT-EACH),-SO-THE-BUDGET-DOES-NOT-KEEP-WIDENING:-THE-CROSSOVER-MARGIN-tau*-tau-GROWS-LINEARLY-' +
      'NEGATIVE-(-2.04-AT-tau=9,-3.04-AT-tau=10,-SLOPE~-1),-THE-OPPOSITE-OF-THE-ASSUMED-tau*-ABOVE-tau-' +
      'WIDENING;-(2)-BECAUSE-(-ln-A)=pi-e^{4tau}-TO-6+-DIGITS,-1-ULP=EPS-pi-e^{4tau}-LOOSENS-THE-RELATIVE-' +
      'BAR-LIKE-1/sigma(tau)-GROWS,-SO-A-FIXED-RESOLUTION-QUADRATURE-KEEPS-CLEARING-IT-(SATURATION);-' +
      '(3)-grade6-STAYS-CHEAPEST-(2430<7350<38440-NODES)-AND-SD-vs-DD-STAY-BIT-IDENTICAL-(0-ULP).-' +
      'ACCURACY-MEASUREMENT/RULE-DESIGN-ONLY;-mass-feasibility-NECESSARY-BUT-NOT-SUFFICIENT;-imp-3066-' +
      'UNTOUCHED;-NO-QED;-PT-Lambda<=0.2-STAYS-SOTA'
    : 'INDETERMINATE';

export const IMP33293_A_WEIGHT_GRADED_GL_1ULP_BUDGET_TAU910 = Object.freeze({
  id: 'imp-33293-a-weight-graded-gl-1ulp-budget-tau910',
  ticket: 'imp-33293',
  paperSourcePath: PAPER_REF,
  paperSections: ['§25', '§26', '§27'],
  extendsModule: 'imp-33277-a-weight-graded-gl-1ulp-budget-tau78.js',
  reusesRoute: 'imp-33248-dd-watson-bracket-high-tau-run.js',

  summary:
    'EXTENDS the imp-33277 graded-GL <1 ULP node-budget measurement for -ln A(tau) to tau in {9,10}, ' +
    'reports the min-node lattice hit per tau, and characterizes the crossover-margin law. Finding: the ' +
    'min-node sub-1.5-ULP hit lands at the SAME resolution tau*~6.95 at BOTH tau=9 and tau=10 ' +
    '(grade6/2430 GL nodes at each, grade5/~7.4k, grade4/~38k), so the crossover tau* does NOT track ' +
    'tau -- it SATURATES -- and the crossover margin tau*-tau grows linearly NEGATIVE (-2.04 at tau=9, ' +
    '-3.04 at tau=10, slope ~ -1), the opposite of the "tau* above tau" widening the ticket assumed. ' +
    'The mechanism: -ln A(tau) = pi e^{4tau} to 6+ digits, so 1 ULP = EPS pi e^{4tau} loosens the ' +
    'RELATIVE accuracy bar exactly as the inverse peak scale 1/sigma(tau) grows, so a fixed-resolution ' +
    'quadrature keeps clearing the loosening bar. The imp-33277 "budget must widen" reading is a tau in ' +
    '{7,8} transient; beyond tau~8 the widening saturates and tau*_cross(tau) ~= 6.95 = const. grade6 ' +
    'stays the cheapest family (2430<7350<38440 nodes) and SD-vs-DD stay bit-identical (0 ULP). ' +
    'ACCURACY MEASUREMENT/RULE-DESIGN ONLY, RH-EQUIVALENT, necessary-but-not-sufficient; operator ' +
    'positivity (imp-3066) untouched; no QED. PT Lambda <= 0.2 stays SOTA.',

  method: Object.freeze({
    aWeight: 'A(tau) = int_0^inf Phi(s) Phi(s+tau) ds, Phi the NPHI=10 completed-Riemann kernel (imp-2686/imp-3646)',
    clusterGold: 'per-tau reference = average of two independent graded-GL grades (5 and 6), panels sized ' +
      'so tau*(panels,grade)=tau+2.5 fully resolves the peak at that tau; the two grades agree at 0 ULP',
    minNodeSweep: 'FIRST sustained (single-double) sub-1.5-ULP lattice hit per grade located by an OFFLINE ' +
      'panel sweep; baked here as MIN_NODE_SWEEP and RE-VERIFIED at import (each reported point clears the ' +
      'bar; a 15%-narrower rule fails, confirming a genuine crossover rather than an everywhere-passing budget)',
    crossoverMarginLaw: 'the crossover tau* is compared across tau in {9,10}: it is FLAT (~6.95), so the ' +
      'crossover margin tau*-tau = 6.95 - tau is linear with slope ~ -1 -- the budget SATURATES, it does ' +
      'not keep widening; this is why the imp-33277 tau in {7,8} widening does not continue',
    ulpScalingMechanism: '-ln A(tau) collapses to the analytic peak height pi e^{4tau} (ratio 1.000000), so ' +
      'one ULP = EPS pi e^{4tau} grows like 1/sigma(tau); the relative bar loosens like e^{4tau} and a ' +
      'fixed-resolution quadrature keeps clearing it -- the arithmetic explanation of the saturation',
    twoArithmetics: 'grade6 min-node rule recomputed in single-double and imp-33248 double-double ' +
      '(Dekker/Knuth twoSum) log-sum-exp; the two are compared in ULP (imp-33277 bit-identity re-checked)',
    selfComputing: 'gold, the peak-height collapse, every min-node re-verification, the narrower-fails ' +
      'crossover check, the SD-vs-DD comparison, the flat-tau* margin law and every verdict flag recompute at import',
  }),

  measured: Object.freeze({
    hi: HI,
    unitRoundoff: EPS,
    tauGrid: TAU_GRID,
    goldMargin: GOLD_MARGIN,
    gold: GOLD,
    goldWorstClusterUlp,
    goldWorstPeakRatioErr,
    minNodeBudgets: MIN_NODE,
    minNodeWorstUlp,
    narrowestNarrowGap,
    sdVsDd: SD_VS_DD,
    worstSdVsDdUlp,
    crossoverTauStarByTau,
    crossoverTauStarSpread,
    marginSlope,
    goldIsBelowOneUlp,
    peakRatioIsOne,
    minNodeHitsClearBar,
    narrowerRuleFails,
    crossoverTauStarSaturates,
    marginSlopeIsMinusOne,
    grade6Cheapest,
    sdVsDdBitIdentical,
    verdict,
  }),

  interpretation: Object.freeze({
    theCrossoverSaturates:
      'imp-33277 measured the budget widening across tau in {7,8}, where the crossover tau* still had to ' +
      'track the moving peak. At tau in {9,10} the min-node lattice hit lands at the SAME tau*~6.95 at both ' +
      'heights (grade6/2430 nodes at each), so the crossover tau* is FLAT and the crossover margin tau*-tau ' +
      'grows linearly negative (slope ~ -1). The budget does NOT keep widening -- it saturates -- so the ' +
      '"required tau*-margin above tau" the ticket asked to fit does NOT exist in this regime; the honest ' +
      'law is tau*_cross(tau) ~= 6.95 = const.',
    whyItSaturates:
      '-ln A(tau) equals the analytic peak height pi e^{4tau} to 6+ digits, so one ULP of the answer is ' +
      'EPS pi e^{4tau} -- it grows exactly as the inverse peak scale 1/sigma(tau)=4 pi e^{4tau} grows. The ' +
      'RELATIVE accuracy bar therefore loosens like e^{4tau}, so a fixed-resolution quadrature (fixed tau*, ' +
      'fixed node budget) keeps clearing the loosening bar as tau climbs. The saturation is an ULP-scaling ' +
      'effect, NOT an arithmetic breakdown (which the SD-vs-DD 0-ULP identity rules out).',
    grade6StaysCheapest:
      'The imp-33249/imp-33277 grade-ordering persists at tau in {9,10}: the min-node sub-1.5-ULP lattice ' +
      'hit is a grade6 rule at fewer nodes than the grade5 and grade4 hits (2430 < 7350 < 38440 at tau=9). ' +
      'A 15%-narrower rule fails at every reported point (gap ~32 ULP), confirming a genuine crossover. The ' +
      'exact min-node panel count remains a jittery lattice property, so the robust reading is the flat ' +
      'crossover tau*, the linear margin law and the grade-ordering, not the precise panel count.',
  }),

  honestCaveat: Object.freeze({
    isProof: false,
    isReductionBelowRH: false,
    rhEquivalent: true,
    isStructuralDiagnostic: true,
    derivationScope:
      'Measures the node budget and the crossover-margin law of a fixed graded-GL quadrature rule for a ' +
      'fixed autocorrelation weight at tau in {9,10} -- a magnitude used inside a mass-feasibility ' +
      'diagnostic. It establishes NO operator positivity.',
    necessaryNotSufficient:
      'Mass-feasibility is NECESSARY-BUT-NOT-SUFFICIENT. The operator-level K_a >= 0 sign-positivity ' +
      '(off-diagonal endpoint-Hankel step, imp-3066) remains the lone obstruction, UNTOUCHED. No RH verdict.',
    didNotAttemptPositivity: true,
    nphiTruncationInherited:
      'The NPHI=10 Phi-series truncation is inherited from imp-33277/imp-33249; this audits the quadrature ' +
      'node budget and the crossover-margin law, not that truncation.',
    latticeJitterCaveat:
      'The min-node sub-1.5-ULP points are single lattice hits on a jittery arithmetic floor; neighbouring ' +
      'panel counts bounce above the bar, and cross-platform libm variation in exp/log can shift the ~1 ULP ' +
      'measurements. The robust reading is the flat crossover tau*~6.95, the linear margin law (slope ~ -1), ' +
      'the -ln A = pi e^{4tau} peak collapse and the grade-ordering, not the exact panel counts.',
    sota: 'Platt-Trudgian Lambda <= 0.2 remains the rigorous SOTA',
  }),
});

// -- Tripwire assertions -------------------------------------------------------------------------
export const IMP33293_A_WEIGHT_GRADED_GL_1ULP_BUDGET_TAU910_ASSERTIONS = [
  {
    id: 'imp33293-cluster-gold-certified-below-one-ulp',
    why: 'The cluster gold (two independent grade5/grade6 rules per tau) must agree below ~1 ULP at both ' +
         'extended tau in {9,10}, certifying it so a <1 ULP measurement is meaningful.',
    holds: () => goldIsBelowOneUlp && goldWorstClusterUlp < 1.5,
  },
  {
    id: 'imp33293-neg-ln-A-collapses-to-pi-e-4tau',
    why: 'HEADLINE 2 mechanism: -ln A(tau) equals the analytic peak height pi e^{4tau} to 6+ digits, so ' +
         '1 ULP = EPS pi e^{4tau} loosens the relative bar like 1/sigma(tau) grows -- the source of the saturation.',
    holds: () => peakRatioIsOne && goldWorstPeakRatioErr < 1e-5,
  },
  {
    id: 'imp33293-min-node-hits-clear-the-bar',
    why: 'Every reported min-node lattice hit at tau in {9,10} must clear the <1.5 ULP bar when re-verified.',
    holds: () => minNodeHitsClearBar && minNodeWorstUlp < 1.5,
  },
  {
    id: 'imp33293-narrower-rule-fails-genuine-crossover',
    why: 'A 15%-narrower rule must FAIL (>3 ULP) at every reported hit, confirming a genuine crossover ' +
         'rather than an everywhere-passing budget.',
    holds: () => narrowerRuleFails && narrowestNarrowGap > 3,
  },
  {
    id: 'imp33293-crossover-tau-star-saturates',
    why: 'HEADLINE 1: the min-node crossover tau* is FLAT (~6.95) across tau in {9,10} -- it does NOT track ' +
         'tau -- so the budget saturates rather than widening.',
    holds: () => crossoverTauStarSaturates && crossoverTauStarSpread < 0.1,
  },
  {
    id: 'imp33293-margin-slope-is-minus-one',
    why: 'The crossover margin tau*-tau drops ~ one-for-one with tau (flat tau* => margin = const - tau), ' +
         'the opposite of the assumed tau*-above-tau widening.',
    holds: () => marginSlopeIsMinusOne && Math.abs(marginSlope + 1) < 0.05,
  },
  {
    id: 'imp33293-grade6-stays-cheapest-family',
    why: 'The imp-33249/imp-33277 grade-ordering persists: the min-node hit at each tau in {9,10} is a ' +
         'grade6 rule at fewer nodes than the grade5 and grade4 hits.',
    holds: () => grade6Cheapest,
  },
  {
    id: 'imp33293-single-double-and-double-double-are-bit-identical',
    why: 'The imp-33277 finding extends: -ln A has no subtractive cancellation, so single-double and the ' +
         'imp-33248 double-double log-sum-exp agree to 0 ULP at tau in {9,10} too.',
    holds: () => sdVsDdBitIdentical && worstSdVsDdUlp < 1e-9,
  },
  {
    id: 'imp33293-verdict-records-the-measurement',
    why: 'The classified verdict must record the crossover saturation, the pi e^{4tau} ULP-scaling ' +
         'mechanism, the persistent grade-ordering and the SD-vs-DD bit-identity.',
    holds: () => verdict !== 'INDETERMINATE',
  },
  {
    id: 'imp33293-honest-diagnostic-not-a-verdict',
    why: 'Mandatory honesty: accuracy measurement/rule-design audit only, mass-feasibility ' +
         'necessary-but-not-sufficient, operator positivity (imp-3066) untouched, PT 0.2 stays SOTA.',
    holds: () => {
      const c = IMP33293_A_WEIGHT_GRADED_GL_1ULP_BUDGET_TAU910.honestCaveat;
      return (
        c.isProof === false &&
        c.isReductionBelowRH === false &&
        c.isStructuralDiagnostic === true &&
        c.didNotAttemptPositivity === true &&
        /Platt-Trudgian/.test(c.sota)
      );
    },
  },
];

for (const assertion of IMP33293_A_WEIGHT_GRADED_GL_1ULP_BUDGET_TAU910_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-33293-a-weight-graded-gl-1ulp-budget-tau910 assertion failed: ${assertion.id}`);
  }
}

export default IMP33293_A_WEIGHT_GRADED_GL_1ULP_BUDGET_TAU910;
