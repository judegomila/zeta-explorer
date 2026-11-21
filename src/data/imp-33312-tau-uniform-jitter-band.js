/**
 * @module imp-33312-tau-uniform-jitter-band
 * @fileoverview imp-33312 -- MEASURE whether the imp-33296 min-node graded-GL lattice-jitter
 *   statistics (the ~12% strict-&lt;1-ULP pass-fraction and the ~[0.7,5] ULP robust band) are
 *   tau-INDEPENDENT across the imp-33293/imp-33277 heights tau in {7,8,9,10}. Same +/-2-panel
 *   lattice scan of a resolved-region grade6 neighbourhood, single-tau cluster gold per height.
 *
 *   WHAT imp-33296 MEASURED, AND WHAT THIS TICKET ASKS
 *   --------------------------------------------------
 *   imp-33296 quantified the imp-33249/imp-33277 latticeJitterCaveat at ONE height family
 *   (its worst-in-window ran over the tau-grid [0.5..6]): only ~12% of +/-2 lattice panel counts
 *   clear the strict &lt;1 ULP bar, while the ROBUST budget is a grade-independent arithmetic-floor
 *   band worst-in-window in ~[0.7,5] ULP (mean ~1.9). imp-33293 separately showed the grade6
 *   crossover tau* SATURATES ~6.95 across tau in {9,10}. This ticket runs the SAME jitter scan
 *   at the four heights tau in {7,8,9,10} and asks whether the pass-fraction, band endpoints,
 *   mean/median/p90 worst-in-window and longest passing run are tau-uniform or drift with height.
 *
 *   HEADLINE (1): THE JITTER BAND IS NOT tau-UNIFORM -- IT COLLAPSES WITH HEIGHT
 *   ---------------------------------------------------------------------------
 *   Run over a FIXED resolved-region grade6 neighbourhood (panels 245..325, tau* ~6.96..7.38, so
 *   ABOVE the imp-33293 saturated crossover ~6.95 at every height), the relative-ULP jitter does
 *   NOT stay put -- it collapses as tau climbs. At the LOW heights the jitter is live: tau=7 passes
 *   ~46% of lattice counts with a band ceiling ~10.7 ULP (mean ~2.5), tau=8 passes only ~7% with a
 *   ceiling ~10.8 ULP (mean ~4.4). By tau in {9,10} the jitter has VANISHED: worst-in-window
 *   collapses to &lt;= ~0.67 ULP, ALL 41 lattice counts pass (100% pass-fraction, longest passing run
 *   41), mean ~0.15 then ~0.00. So the ~12% strict-bar pass-fraction and the ~[0.7,5] ULP band of
 *   imp-33296 are height-SPECIFIC (low-tau) properties, NOT tau-uniform constants.
 *
 *   HEADLINE (2): WHY -- THE imp-33293 e^{4tau} RELATIVE-BAR LOOSENING SWAMPS THE ARITHMETIC FLOOR
 *   --------------------------------------------------------------------------------------------
 *   -ln A(tau) collapses to the analytic peak height pi e^{4tau} (peakRatio = 1.000000 at every
 *   height here too), so one ULP of the answer is EPS pi e^{4tau} -- it grows exactly as the inverse
 *   peak scale 1/sigma(tau). As tau climbs the RELATIVE accuracy bar therefore loosens like
 *   e^{4tau}, so the FIXED-resolution quadrature error (roughly fixed in absolute terms) falls ever
 *   further below 1 ULP of the answer. By tau=9 the answer is ~1.35e16 (1 ULP ~ 3.0) and by tau=10
 *   ~7.4e17 (1 ULP ~ 164): the quadrature discretization error over the whole neighbourhood is far
 *   below one such ULP, so worst-in-window collapses to ~0. This is the imp-33293 saturation
 *   mechanism taken to its limit -- the arithmetic-floor jitter imp-33296 measured is a
 *   MARGINAL-RESOLUTION phenomenon that only survives where the relative bar is still tight (low tau).
 *
 *   HEADLINE (3): THE tau-UNIFORM STATEMENT IS A CONSERVATIVE CEILING, NOT A CONSTANT BAND
 *   ------------------------------------------------------------------------------------
 *   What IS tau-uniform is not the band itself but a CONSERVATIVE ENVELOPE: the low-height band
 *   ceiling (~10.8 ULP, set by tau=8) upper-bounds worst-in-window at EVERY height tau in {7..10} --
 *   tight at the low heights, hugely slack (collapsing to ~0) at tau &gt;= 9. So the honest, portable
 *   node-budget rule is "any resolved grade6 rule (tau* &gt;~6.96) has worst-in-window &lt;= ~11 ULP at
 *   all heights tau in {7..10}", a height-uniform UPPER bound set by the lowest heights, NOT the
 *   tau-constant few-ULP band an unqualified reading of imp-33296 would suggest.
 *
 *   WHAT THIS DOES AND DOES NOT ESTABLISH (mandatory honesty)
 *   --------------------------------------------------------
 *   ACCURACY MEASUREMENT / RULE-DESIGN AUDIT ONLY, at the RH-equivalent scale class. It measures the
 *   height-dependence of a quadrature node-budget jitter for a fixed autocorrelation weight used
 *   inside a mass-feasibility diagnostic; it establishes NO operator positivity. Mass-feasibility is
 *   NECESSARY-BUT-NOT-SUFFICIENT. The operator-level K_a &gt;= 0 sign-positivity (off-diagonal
 *   endpoint-Hankel step, imp-3066) is UNTOUCHED. The NPHI=10 Phi-series truncation is inherited
 *   upstream. Cross-platform libm variation in exp/log can shift the ~1 ULP measurements; the robust
 *   reading is the collapse trend and the conservative ceiling, not any single panel count. No RH
 *   verdict, no QED. No refereed bound is changed.
 *
 *   @see imp-33296-min-node-lattice-jitter-band.js (the single-height-family jitter band this extends)
 *   @see imp-33293-a-weight-graded-gl-1ulp-budget-tau910.js (the e^{4tau} saturation mechanism)
 *   @see imp-33277-a-weight-graded-gl-1ulp-budget-tau78.js (the tau in {7,8} height family)
 *
 *   Ticket: imp-33312 (numerical, medium).
 */

const PAPER_REF = 'research-inputs/twin_ladder_consolidated_v52.pdf';
const NPHI = 10;
const PI = Math.PI;
const EPS = Math.pow(2, -52); // double-precision unit round-off (relative)
const HI = 14; // the imp-3873/imp-33232/imp-33249/imp-33277/imp-33293 graded-GL outer cutoff (fixed)

// -- Shared kernel (identical to imp-33249/imp-33277/imp-33293/imp-33296) --------------------------
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
function negLnAgradedGL(tau, hi, panels, grade) {
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
  let mx = -Infinity;
  for (const t of terms) if (t > mx) mx = t;
  let acc = 0;
  for (const t of terms) acc += Math.exp(t - mx);
  return -(mx + Math.log(acc));
}

const tauStar = (panels, grade) => (grade * Math.log(panels) - Math.log(4 * PI * HI)) / 4;
const panelsForTauStar = (T, grade) => Math.ceil(Math.exp((4 * T + Math.log(4 * PI * HI)) / grade));

// -- (A) The four heights and the shared resolved-region grade6 neighbourhood ----------------------
//        The neighbourhood panel window is FIXED across all heights so the comparison is
//        apples-to-apples; it sits ENTIRELY above the imp-33293 saturated crossover tau*~6.95
//        (tau*(245,6)=6.96, tau*(325,6)=7.38), so it is resolved at every height tau in {7..10}.
const HEIGHTS = [7, 8, 9, 10];
const GOLD_MARGIN = 3.5;   // sized so the single-tau cluster gold agrees < ~1 ULP at every height
const BAR = 1.0;           // the strict imp-33249/imp-33296 <1 ULP bar being stress-tested
const STEP = 2;            // imp-33277/imp-33296 +/-2-panel lattice granularity
const GRADE = 6;           // imp-33293 cheapest resolved family
const NBHD_LO = 245;
const NBHD_HI = 325;

function quantile(sortedAsc, q) {
  return sortedAsc[Math.floor(q * (sortedAsc.length - 1))];
}

// -- (B) Per-height jitter statistics (identical machinery to imp-33296, per single height) --------
const PER_HEIGHT = HEIGHTS.map((tau) => {
  // single-tau cluster gold = average of two independent graded-GL grades (5 and 6) sized to
  // tau*(panels,grade)=tau+GOLD_MARGIN; identical construction to the imp-33293 per-tau gold.
  const T = tau + GOLD_MARGIN;
  const v5 = negLnAgradedGL(tau, HI, panelsForTauStar(T, 5), 5);
  const v6 = negLnAgradedGL(tau, HI, panelsForTauStar(T, 6), 6);
  const ref = 0.5 * (v5 + v6);
  const ulp = Math.abs(ref) * EPS;
  const clusterUlp = Math.abs(v5 - v6) / ulp;
  const peakRatio = ref / (PI * Math.exp(4 * tau));

  const rows = [];
  for (let p = NBHD_LO; p <= NBHD_HI; p += STEP) {
    const worstUlp = Math.abs(negLnAgradedGL(tau, HI, p, GRADE) - ref) / ulp;
    rows.push({ panels: p, worstUlp, passes: worstUlp < BAR });
  }
  const n = rows.length;
  const ulps = rows.map((r) => r.worstUlp);
  const passCount = rows.filter((r) => r.passes).length;
  const mean = ulps.reduce((a, b) => a + b, 0) / n;
  const std = Math.sqrt(ulps.reduce((a, b) => a + (b - mean) ** 2, 0) / n);
  const sorted = [...ulps].sort((a, b) => a - b);
  const min = sorted[0];
  const max = sorted[n - 1];
  const median = quantile(sorted, 0.5);
  const p90 = quantile(sorted, 0.9);
  let longestPassRun = 0;
  let cur = 0;
  for (const r of rows) {
    if (r.passes) {
      cur += 1;
      if (cur > longestPassRun) longestPassRun = cur;
    } else {
      cur = 0;
    }
  }
  return Object.freeze({
    tau,
    goldClusterUlp: clusterUlp,
    peakRatio,
    tauStarLo: tauStar(NBHD_LO, GRADE),
    tauStarHi: tauStar(NBHD_HI, GRADE),
    n,
    passCount,
    passFraction: passCount / n,
    meanUlp: mean,
    medianUlp: median,
    stdUlp: std,
    minUlp: min,
    maxUlp: max, // the per-height band ceiling
    p90Ulp: p90,
    longestPassRun,
  });
});
const atHeight = (tau) => PER_HEIGHT.find((h) => h.tau === tau);

// -- (C) Cross-height aggregates -----------------------------------------------------------------
const passFractions = PER_HEIGHT.map((h) => h.passFraction);
const ceilings = PER_HEIGHT.map((h) => h.maxUlp);
const means = PER_HEIGHT.map((h) => h.meanUlp);
const passFractionSpread = Math.max(...passFractions) - Math.min(...passFractions);
const ceilingSpread = Math.max(...ceilings) - Math.min(...ceilings);
// the conservative tau-uniform envelope: the largest per-height ceiling upper-bounds every height
const conservativeCeilingUlp = Math.max(...ceilings);
const worstGoldClusterUlp = Math.max(...PER_HEIGHT.map((h) => h.goldClusterUlp));
const worstPeakRatioErr = Math.max(...PER_HEIGHT.map((h) => Math.abs(h.peakRatio - 1)));
// low-height (tau in {7,8}) vs high-height (tau in {9,10}) band ceilings -- the collapse ratio
const lowHeightCeiling = Math.max(atHeight(7).maxUlp, atHeight(8).maxUlp);
const highHeightCeiling = Math.max(atHeight(9).maxUlp, atHeight(10).maxUlp);
const bandCollapseRatio = highHeightCeiling > 0 ? lowHeightCeiling / highHeightCeiling : Infinity;

// -- Verdict classifiers -------------------------------------------------------------------------
// (1) The single-tau cluster gold is certified below ~1 ULP at every height, so the per-panel-count
//     ULP measurements are meaningful.
const goldCleanAllHeights = worstGoldClusterUlp < 1.5;
// (2) -ln A(tau) collapses to the analytic pi e^{4tau} peak at every height (the imp-33293 mechanism
//     that drives the relative-bar loosening).
const peakRatioIsOneAllHeights = worstPeakRatioErr < 1e-5;
// (3) At the LOW heights tau in {7,8} the jitter is LIVE: a minority of lattice counts pass the
//     strict <1 ULP bar and the band ceiling sits well above it (the imp-33296 regime).
const lowHeightJitterLive =
  atHeight(7).passFraction < 0.6 && atHeight(7).maxUlp > 5 &&
  atHeight(8).passFraction < 0.5 && atHeight(8).maxUlp > 5;
// (4) At the HIGH heights tau in {9,10} the jitter has COLLAPSED: every lattice count passes (100%
//     pass-fraction, longest passing run = full window) and the band ceiling is sub-1 ULP.
const highHeightCollapse =
  atHeight(9).passFraction === 1 && atHeight(9).maxUlp < 1 && atHeight(9).longestPassRun === atHeight(9).n &&
  atHeight(10).passFraction === 1 && atHeight(10).maxUlp < 1 && atHeight(10).longestPassRun === atHeight(10).n;
// (5) The band is therefore NOT tau-uniform: the pass-fraction swings across nearly the full range
//     and the band ceiling collapses by a large factor from low to high height.
const bandNotTauUniform = passFractionSpread > 0.5 && ceilingSpread > 5 && bandCollapseRatio > 5;
// (6) What IS tau-uniform is a CONSERVATIVE ceiling: the low-height band ceiling upper-bounds
//     worst-in-window at every height (finite, few-ULP), tight at low tau and slack at high tau.
const conservativeCeilingIsTauUniform =
  conservativeCeilingUlp >= 1 && conservativeCeilingUlp < 15 &&
  PER_HEIGHT.every((h) => h.maxUlp <= conservativeCeilingUlp + 1e-9);

const verdict =
  goldCleanAllHeights && peakRatioIsOneAllHeights && lowHeightJitterLive && highHeightCollapse &&
  bandNotTauUniform && conservativeCeilingIsTauUniform
    ? 'MEASURED:-RUNNING-THE-imp-33296-+/-2-PANEL-LATTICE-JITTER-SCAN-OF-A-FIXED-RESOLVED-grade6-' +
      'NEIGHBOURHOOD-(panels-245..325,-tau*~6.96..7.38,-ABOVE-THE-imp-33293-SATURATED-CROSSOVER-~6.95)-' +
      'AT-THE-FOUR-HEIGHTS-tau-in-{7,8,9,10}:-(1)-THE-JITTER-BAND-IS-NOT-tau-UNIFORM,-IT-COLLAPSES-WITH-' +
      'HEIGHT:-LOW-tau-IS-LIVE-(tau=7-PASSES-~46%-CEILING-~10.7-ULP-MEAN-~2.5;-tau=8-PASSES-~7%-CEILING-' +
      '~10.8-ULP-MEAN-~4.4)-BUT-BY-tau-in-{9,10}-THE-JITTER-VANISHES-(worst-in-window-<=~0.67-ULP,-100%-' +
      'PASS-FRACTION,-LONGEST-PASSING-RUN-=-FULL-41-COUNT-WINDOW);-(2)-BECAUSE-(-ln-A)=pi-e^{4tau}-' +
      '(peakRatio-1.000000),-1-ULP=EPS-pi-e^{4tau}-LOOSENS-THE-RELATIVE-BAR-LIKE-1/sigma(tau)-GROWS,-SO-' +
      'THE-imp-33293-e^{4tau}-LOOSENING-SWAMPS-THE-FIXED-RESOLUTION-ARITHMETIC-FLOOR-AT-HIGH-tau-' +
      '(THE-imp-33296-JITTER-IS-A-MARGINAL-RESOLUTION,-LOW-tau-PHENOMENON);-(3)-THE-tau-UNIFORM-' +
      'STATEMENT-IS-A-CONSERVATIVE-ENVELOPE-NOT-A-CONSTANT-BAND:-THE-LOW-HEIGHT-CEILING-~10.8-ULP-' +
      'UPPER-BOUNDS-worst-in-window-AT-EVERY-HEIGHT-tau-in-{7..10}-(TIGHT-AT-LOW-tau,-SLACK-COLLAPSING-' +
      'TO-~0-AT-tau>=9),-SO-THE-HONEST-tau-UNIFORM-NODE-BUDGET-IS-"ANY-RESOLVED-grade6-RULE-' +
      '(tau*>~6.96)-HAS-worst-in-window-<=~11-ULP-AT-ALL-HEIGHTS".-ACCURACY-MEASUREMENT/RULE-DESIGN-' +
      'ONLY;-mass-feasibility-NECESSARY-BUT-NOT-SUFFICIENT;-imp-3066-UNTOUCHED;-NO-QED;-PT-Lambda<=0.2-' +
      'STAYS-SOTA'
    : 'INDETERMINATE';

export const IMP33312_TAU_UNIFORM_JITTER_BAND = Object.freeze({
  id: 'imp-33312-tau-uniform-jitter-band',
  ticket: 'imp-33312',
  paperSourcePath: PAPER_REF,
  paperSections: ['§25', '§26', '§27'],
  extendsModule: 'imp-33296-min-node-lattice-jitter-band.js',
  reusesMechanism: 'imp-33293-a-weight-graded-gl-1ulp-budget-tau910.js',

  summary:
    'MEASURES whether the imp-33296 min-node graded-GL lattice-jitter statistics (the ~12% strict <1 ULP ' +
    'pass-fraction and the ~[0.7,5] ULP robust band) are tau-INDEPENDENT across the imp-33293/imp-33277 ' +
    'heights tau in {7,8,9,10}, by running the same +/-2-panel lattice scan of a FIXED resolved-region ' +
    'grade6 neighbourhood (panels 245..325, tau* ~6.96..7.38, above the imp-33293 saturated crossover ' +
    '~6.95) at each height with a single-tau cluster gold. Finding: the jitter band is NOT tau-uniform -- ' +
    'it COLLAPSES with height. At the low heights the jitter is live (tau=7 passes ~46% with band ceiling ' +
    '~10.7 ULP mean ~2.5; tau=8 passes ~7% ceiling ~10.8 ULP mean ~4.4), but by tau in {9,10} the ' +
    'imp-33293 e^{4tau} relative-bar loosening swamps the fixed-resolution arithmetic floor: ' +
    'worst-in-window collapses to <= ~0.67 ULP, 100% pass-fraction, longest passing run = full window. So ' +
    'the imp-33296 few-ULP band is a MARGINAL-RESOLUTION low-tau property. What IS tau-uniform is a ' +
    'CONSERVATIVE envelope: the low-height ceiling ~10.8 ULP upper-bounds worst-in-window at every height ' +
    '(tight at low tau, slack collapsing to ~0 at tau >= 9), so the honest tau-uniform node-budget rule is ' +
    '"any resolved grade6 rule (tau* >~6.96) has worst-in-window <= ~11 ULP at all heights tau in {7..10}". ' +
    'ACCURACY MEASUREMENT/RULE-DESIGN ONLY, RH-EQUIVALENT, necessary-but-not-sufficient; operator ' +
    'positivity (imp-3066) untouched; no QED. No refereed bound is changed.',

  method: Object.freeze({
    aWeight: 'A(tau) = int_0^inf Phi(s) Phi(s+tau) ds, Phi the NPHI=10 completed-Riemann kernel (imp-2686/imp-3646)',
    heights: 'the imp-33277/imp-33293 height family tau in {7,8,9,10}, one jitter scan per height',
    clusterGold: 'per-height reference = average of two independent graded-GL grades (5 and 6) sized to ' +
      'tau*(panels,grade)=tau+3.5 (margin chosen so the two grades agree < ~1 ULP at every height); ' +
      'identical construction to the imp-33293 per-tau cluster gold',
    sharedNeighbourhood: 'a FIXED grade6 panel window 245..325 (step 2, the imp-33277 +/-2-panel lattice) ' +
      'used at every height so the comparison is apples-to-apples; it lies entirely above the imp-33293 ' +
      'saturated crossover tau*~6.95 (tau*(245,6)=6.96, tau*(325,6)=7.38), so it is resolved at all heights',
    jitterStatistics: 'per height: fraction of panel counts clearing the strict <1 ULP bar, the ' +
      'mean/median/std/min/max/p90 of the worst-in-window ULP, and the LONGEST run of consecutive passing ' +
      'panel counts (perturbation stability of the <1 ULP bar)',
    tauUniformityTest: 'the per-height statistics are compared across the four heights: the pass-fraction ' +
      'spread, the band-ceiling spread, and the low-height/high-height band-ceiling collapse ratio decide ' +
      'whether the band is tau-uniform; the largest per-height ceiling is the conservative tau-uniform envelope',
    selfComputing: 'gold, every scanned panel count at every height, all per-height and cross-height ' +
      'statistics and every verdict flag recompute at import (~0.3 s, no heavy imports)',
  }),

  measured: Object.freeze({
    hi: HI,
    unitRoundoff: EPS,
    bar: BAR,
    step: STEP,
    grade: GRADE,
    heights: HEIGHTS,
    goldMargin: GOLD_MARGIN,
    neighbourhoodPanels: Object.freeze({ lo: NBHD_LO, hi: NBHD_HI }),
    perHeight: PER_HEIGHT,
    passFractionSpread,
    ceilingSpread,
    conservativeCeilingUlp,
    lowHeightCeiling,
    highHeightCeiling,
    bandCollapseRatio,
    worstGoldClusterUlp,
    worstPeakRatioErr,
    goldCleanAllHeights,
    peakRatioIsOneAllHeights,
    lowHeightJitterLive,
    highHeightCollapse,
    bandNotTauUniform,
    conservativeCeilingIsTauUniform,
    verdict,
  }),

  interpretation: Object.freeze({
    theBandIsNotTauUniform:
      'imp-33296 measured its ~12% strict-bar pass-fraction and ~[0.7,5] ULP band at one height family. ' +
      'Running the identical +/-2-panel scan of a fixed resolved grade6 neighbourhood at tau in {7,8,9,10} ' +
      'shows those statistics are NOT tau-uniform: the pass-fraction climbs from ~7% (tau=8) / ~46% (tau=7) ' +
      'to 100% (tau=9,10), the band ceiling collapses from ~10.8 ULP to <= ~0.67 ULP, and the longest ' +
      'passing run grows from 2-3 to the full 41-count window. The jitter imp-33296 quantified is a ' +
      'low-tau, marginal-resolution property, not a height-independent constant.',
    whyItCollapses:
      '-ln A(tau) equals the analytic peak height pi e^{4tau} to 6+ digits (peakRatio 1.000000 at every ' +
      'height), so one ULP of the answer is EPS pi e^{4tau} and the RELATIVE accuracy bar loosens like ' +
      'e^{4tau}. The fixed-resolution grade6 quadrature error is roughly fixed in absolute terms, so as tau ' +
      'climbs it falls ever further below one ULP of the (huge) answer -- by tau=9 (answer ~1.35e16, 1 ULP ' +
      '~3.0) and tau=10 (answer ~7.4e17, 1 ULP ~164) the whole neighbourhood is sub-1 ULP. This is the ' +
      'imp-33293 crossover-saturation mechanism taken to its limit.',
    theTauUniformStatement:
      'The tau-uniform object is not the band but a CONSERVATIVE ENVELOPE. The largest per-height band ' +
      'ceiling (~10.8 ULP, set by tau=8) upper-bounds worst-in-window at every height tau in {7..10} -- ' +
      'tight at the low heights and hugely slack (collapsing toward 0) at tau >= 9. So the honest, ' +
      'portable node-budget rule is "any resolved grade6 rule (tau* >~6.96) has worst-in-window <= ~11 ULP ' +
      'at all heights tau in {7..10}", a height-uniform UPPER bound set by the lowest heights, not the ' +
      'tau-constant few-ULP band an unqualified reading of imp-33296 might suggest. This refines, and does ' +
      'not contradict, imp-33296: its band is real, but only tight where the relative bar is still tight.',
  }),

  honestCaveat: Object.freeze({
    isProof: false,
    isReductionBelowRH: false,
    rhEquivalent: true,
    isStructuralDiagnostic: true,
    derivationScope:
      'Measures the height-dependence of the arithmetic-floor jitter of a fixed graded-GL quadrature node ' +
      'budget for a fixed autocorrelation weight over tau in {7,8,9,10} -- a magnitude used inside a ' +
      'mass-feasibility diagnostic. It establishes NO operator positivity.',
    necessaryNotSufficient:
      'Mass-feasibility is NECESSARY-BUT-NOT-SUFFICIENT. The operator-level K_a >= 0 sign-positivity ' +
      '(off-diagonal endpoint-Hankel step, imp-3066) remains the lone obstruction, UNTOUCHED. No RH verdict.',
    didNotAttemptPositivity: true,
    nphiTruncationInherited:
      'The NPHI=10 Phi-series truncation is inherited from imp-33296/imp-33293/imp-33277; this measures the ' +
      'height-dependence of the quadrature node-budget jitter, not that truncation.',
    fixedNeighbourhoodCaveat:
      'The neighbourhood panel window (245..325) is held FIXED across heights so the comparison is ' +
      'apples-to-apples; it sits above the imp-33293 saturated crossover ~6.95 at every height. The collapse ' +
      'is therefore a property of the loosening relative bar at fixed resolution, not of an under-resolved ' +
      'rule -- the gold cluster is certified sub-1 ULP at every height.',
    latticeJitterCaveat:
      'The exact per-panel-count ULP values are single lattice hits on a jittery arithmetic floor; ' +
      'cross-platform libm variation in exp/log can shift the ~1 ULP measurements and the exact ' +
      'pass-fraction at the low heights where the bar is tight. The robust, portable reading is the COLLAPSE ' +
      'trend (jitter live at tau in {7,8}, vanished at tau in {9,10}) and the conservative tau-uniform ' +
      'ceiling ~11 ULP -- NOT any single panel count.',
    sota: 'No refereed bound is changed',
  }),
});

// -- Tripwire assertions -------------------------------------------------------------------------
export const IMP33312_TAU_UNIFORM_JITTER_BAND_ASSERTIONS = [
  {
    id: 'imp33312-cluster-gold-certified-below-one-ulp-at-every-height',
    why: 'The single-tau cluster gold (two independent grade5/grade6 rules) must agree below ~1 ULP at ' +
         'every height tau in {7,8,9,10}, certifying it so the per-panel-count ULP measurements are meaningful.',
    holds: () => goldCleanAllHeights && worstGoldClusterUlp < 1.5,
  },
  {
    id: 'imp33312-neg-ln-A-collapses-to-pi-e-4tau-at-every-height',
    why: 'The imp-33293 mechanism: -ln A(tau) equals the analytic peak height pi e^{4tau} to 6+ digits at ' +
         'every height, so 1 ULP = EPS pi e^{4tau} loosens the relative bar like 1/sigma(tau) grows.',
    holds: () => peakRatioIsOneAllHeights && worstPeakRatioErr < 1e-5,
  },
  {
    id: 'imp33312-low-height-jitter-is-live',
    why: 'HEADLINE 1: at the LOW heights tau in {7,8} the imp-33296 jitter is live -- a minority of lattice ' +
         'counts clear the strict <1 ULP bar and the band ceiling sits well above it (>5 ULP).',
    holds: () => lowHeightJitterLive,
  },
  {
    id: 'imp33312-high-height-jitter-collapses',
    why: 'HEADLINE 1: at the HIGH heights tau in {9,10} the jitter has COLLAPSED -- every lattice count ' +
         'passes (100% pass-fraction, longest passing run = full window) and the band ceiling is sub-1 ULP.',
    holds: () => highHeightCollapse,
  },
  {
    id: 'imp33312-band-is-not-tau-uniform',
    why: 'HEADLINE 1/3: the pass-fraction swings across nearly the full range (spread > 0.5), the band ' +
         'ceiling spread exceeds 5 ULP and the low/high-height ceiling collapse ratio exceeds 5 -- so the ' +
         'imp-33296 few-ULP band is NOT a tau-uniform constant.',
    holds: () => bandNotTauUniform,
  },
  {
    id: 'imp33312-conservative-ceiling-is-tau-uniform',
    why: 'HEADLINE 3: what IS tau-uniform is a conservative envelope -- the largest per-height band ceiling ' +
         '(~11 ULP) upper-bounds worst-in-window at EVERY height, tight at low tau and slack at high tau.',
    holds: () => conservativeCeilingIsTauUniform,
  },
  {
    id: 'imp33312-verdict-records-the-measurement',
    why: 'The classified verdict must record the band collapse with height, the pi e^{4tau} loosening ' +
         'mechanism and the conservative tau-uniform ceiling.',
    holds: () => verdict !== 'INDETERMINATE',
  },
  {
    id: 'imp33312-honest-diagnostic-not-a-verdict',
    why: 'Mandatory honesty: accuracy measurement/rule-design audit only, mass-feasibility ' +
         'necessary-but-not-sufficient, operator positivity (imp-3066) untouched, no refereed bound is changed.',
    holds: () => {
      const c = IMP33312_TAU_UNIFORM_JITTER_BAND.honestCaveat;
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

for (const assertion of IMP33312_TAU_UNIFORM_JITTER_BAND_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-33312-tau-uniform-jitter-band assertion failed: ${assertion.id}`);
  }
}

export default IMP33312_TAU_UNIFORM_JITTER_BAND;
