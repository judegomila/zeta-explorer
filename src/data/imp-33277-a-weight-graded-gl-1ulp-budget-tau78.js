/**
 * @module imp-33277-a-weight-graded-gl-1ulp-budget-tau78
 * @fileoverview imp-33277 -- EXTEND the imp-33249 full-window graded-GL &lt;1 ULP node-budget measurement
 *   for -ln A(tau) to tau in {7,8}, running each rule in BOTH single-double and the imp-33248 double-double
 *   (Dekker/Knuth) log-sum-exp arithmetic, and report whether the imp-33249 grade&lt;=5/342p empirical floor
 *   still holds or must widen above the tau&lt;=6 clean window.
 *
 *   WHY imp-33249 STOPPED AT tau=6, AND WHAT THE TICKET ASSUMED
 *   ----------------------------------------------------------
 *   imp-33249 measured the minimal (panels,grade) graded-GL budget holding worst-in-window &lt;1 ULP through
 *   the clean window tau in {0.5,1,...,6} and named grade&lt;=5/342p only as the EMPIRICAL floor (the true
 *   &lt;1 ULP bar sits at a jittery ~0.6-3 ULP arithmetic floor). The window was capped at 6 because the
 *   imp-33208/imp-33248 WATSON-MAJORANT BRACKET single-double route blows up above tau~4 (subtracting two
 *   magnitudes ~pi e^{4tau}), and imp-33248 supplied a cancellation-free DOUBLE-DOUBLE reconstruction to
 *   push that quantity higher. The ticket asked to extend the -ln A node budget to tau in {7,8} "through
 *   the imp-33248 double-double route where single-double breaks down".
 *
 *   HEADLINE (1): THE DOUBLE-DOUBLE ROUTE IS UNNECESSARY FOR -ln A(tau) -- SD AND DD ARE BIT-IDENTICAL
 *   -------------------------------------------------------------------------------------------------
 *   Unlike the Watson bracket, the -ln A(tau) log-sum-exp accumulator has NO subtractive cancellation:
 *   every quadrature term log(w_k*half) + logPhi(s) + logPhi(s+tau) is combined as exp(t - mx) &gt;= 0 and
 *   summed, so the sum never loses leading digits to a difference of near-equal magnitudes. Accumulating
 *   that same sum in imp-33248 double-double (twoSum/Dekker) changes NOTHING: SD and DD agree to 0.000 ULP
 *   at every (tau,grade,panels) probed through tau=8 (gold cluster AND every scored rule). So the ticket
 *   premise -- "single-double breaks down, use the DD route" -- does NOT transfer from the Watson bracket
 *   to this weight: single-double ALREADY reaches the arithmetic floor at tau in {7,8}. The DD route buys
 *   zero accuracy here; the binding limit is the log-sum-exp round-off floor, not additive cancellation.
 *
 *   HEADLINE (2): THE grade&lt;=5/342p FLOOR DOES NOT HOLD ABOVE tau=6 -- IT WIDENS WITH THE PEAK
 *   ------------------------------------------------------------------------------------------
 *   The imp-33249 named budget grade5/342p has tau*(342,5)=6.00, exactly resolving the tau=6 peak. Above
 *   tau=6 its innermost panel no longer clears the peak scale sigma(tau)=1/(4 pi e^{4tau}), so it fails
 *   badly: worst gap 4.84 ULP at tau=7 and 625 ULP at tau=8 (vs the &lt;1 ULP bar). The imp-33249 binding
 *   requirement -- innermost-panel WIDTH a few-fold below sigma(tau), i.e. a tau* MARGIN above tau -- is
 *   the same at tau in {7,8}: the budget must WIDEN so tau* tracks the new peak. The grade6 family stays
 *   the cheapest to reach the floor band (grade6/348p, tau*=7.49, hits ~0 ULP at tau=7 and 0.57 at tau=8;
 *   grade6/600p, tau*=8.30, hits 0.57 at tau=8), and the min-node sub-1.5-ULP lattice hit at each tau is a
 *   grade6 rule at fewer nodes than the grade4/grade5 rows -- the imp-33249 "steeper grades are cheaper
 *   with a small crossover margin" ordering persists. The exact min-node panel count remains a jittery
 *   arithmetic-floor lattice property (imp-33249 latticeJitterCaveat), not a monotone threshold.
 *
 *   WHAT THIS DOES AND DOES NOT ESTABLISH (mandatory honesty)
 *   --------------------------------------------------------
 *   ACCURACY MEASUREMENT / RULE-DESIGN AUDIT ONLY, at the RH-equivalent scale class. It measures the node
 *   budget and the SD-vs-DD arithmetic behaviour of a quadrature rule for a fixed autocorrelation weight
 *   used inside a mass-feasibility diagnostic; it establishes NO operator positivity. Mass-feasibility is
 *   NECESSARY-BUT-NOT-SUFFICIENT. The operator-level K_a &gt;= 0 sign-positivity (off-diagonal
 *   endpoint-Hankel step, imp-3066) is UNTOUCHED. The NPHI=10 Phi-series truncation is inherited upstream.
 *   No RH verdict, no QED. Platt-Trudgian Lambda &lt;= 0.2 remains the rigorous SOTA.
 *
 *   @see imp-33249-a-weight-graded-gl-minimal-full-window-1ulp-budget.js (the tau&lt;=6 window this extends)
 *   @see imp-33248-dd-watson-bracket-high-tau-run.js (the double-double route this reuses)
 *
 *   Ticket: imp-33277 (numerical, medium).
 */

const PAPER_REF = 'research-inputs/twin_ladder_consolidated_v52.pdf';
const NPHI = 10;
const PI = Math.PI;
const EPS = Math.pow(2, -52); // double-precision unit round-off (relative)
const HI = 14; // the imp-3873/imp-3897/imp-3919/imp-33232/imp-33249 graded-GL outer cutoff (fixed)

// -- Shared kernel (identical to imp-33249/imp-33232/imp-3919) -----------------------------------
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

// -- (A) Single-double log-sum-exp accumulator (the imp-33249 route) -----------------------------
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
function ddAddD(a, b) {
  let [s, e] = twoSum(a[0], b);
  e += a[1];
  const [hi, lo] = twoSum(s, e);
  return [hi, lo];
}
const ddToNumber = (a) => a[0] + a[1];
function negLnAgradedGL_DD(tau, hi, panels, grade) {
  const terms = quadTerms(tau, hi, panels, grade);
  let mx = -Infinity;
  for (const t of terms) if (t > mx) mx = t;
  let acc = [0, 0];
  for (const t of terms) acc = ddAddD(acc, Math.exp(t - mx));
  return -(mx + Math.log(ddToNumber(acc)));
}

const tauStar = (panels, grade) => (grade * Math.log(panels) - Math.log(4 * PI * HI)) / 4;
const panelsForTauStar = (T, grade) => Math.ceil(Math.exp((4 * T + Math.log(4 * PI * HI)) / grade));

// -- (C) Adaptive cluster gold (imp-33249 construction) at the extended tau in {7,8} -------------
//        per-tau reference = DD average of two independent grade4/grade5 rules sized to tau*=tau+2.5.
const TAU_GRID = [7, 8];
const GOLD_MARGIN = 2.5;
const GOLD = TAU_GRID.map((tau) => {
  const T = tau + GOLD_MARGIN;
  const p4 = panelsForTauStar(T, 4);
  const p5 = panelsForTauStar(T, 5);
  const v4dd = negLnAgradedGL_DD(tau, HI, p4, 4);
  const v5dd = negLnAgradedGL_DD(tau, HI, p5, 5);
  const v4sd = negLnAgradedGL(tau, HI, p4, 4);
  const v5sd = negLnAgradedGL(tau, HI, p5, 5);
  const refdd = 0.5 * (v4dd + v5dd);
  const refsd = 0.5 * (v4sd + v5sd);
  return Object.freeze({
    tau,
    p4,
    p5,
    ref: refdd,
    clusterUlp: Math.abs(v4dd - v5dd) / (Math.abs(refdd) * EPS),
    // SD-vs-DD bit-identity of the gold itself
    sdVsDdRefUlp: Math.abs(refsd - refdd) / (Math.abs(refdd) * EPS),
  });
});
const goldWorstClusterUlp = GOLD.reduce((m, g) => Math.max(m, g.clusterUlp), 0);
const goldWorstSdVsDdUlp = GOLD.reduce((m, g) => Math.max(m, g.sdVsDdRefUlp), 0);
const goldByTau = (tau) => GOLD.find((g) => g.tau === tau);

// -- (D) Representative (grade,panels) rules scored at tau in {7,8} in BOTH arithmetics -----------
// The imp-33249 named floor (grade5/342p, tau*=6.00) plus rules with growing tau* margin.
const RULE_SET = [
  { grade: 5, panels: 342, tag: 'imp-33249 named floor (tau*=6.00)' },
  { grade: 6, panels: 171, tag: 'imp-33249 min-node (tau*=6.42)' },
  { grade: 6, panels: 348, tag: 'grade6 margin tau*=7.49' },
  { grade: 5, panels: 1440, tag: 'grade5 margin tau*=7.80' },
  { grade: 6, panels: 600, tag: 'grade6 margin tau*=8.30' },
  { grade: 6, panels: 1000, tag: 'grade6 margin tau*=9.07' },
  { grade: 5, panels: 3000, tag: 'grade5 margin tau*=8.72' },
];
const SCORED = TAU_GRID.map((tau) => {
  const { ref } = goldByTau(tau);
  const ulp = Math.abs(ref) * EPS;
  const rows = RULE_SET.map((r) => {
    const sd = negLnAgradedGL(tau, HI, r.panels, r.grade);
    const dd = negLnAgradedGL_DD(tau, HI, r.panels, r.grade);
    return Object.freeze({
      ...r,
      glNodes: 10 * r.panels,
      tauStar: tauStar(r.panels, r.grade),
      sdUlp: Math.abs(sd - ref) / ulp,
      ddUlp: Math.abs(dd - ref) / ulp,
      sdVsDdUlp: Math.abs(sd - dd) / ulp,
    });
  });
  return Object.freeze({ tau, ref, rows });
});
const allRows = SCORED.flatMap((s) => s.rows);
const worstSdVsDdRowUlp = allRows.reduce((m, r) => Math.max(m, r.sdVsDdUlp), 0);

// -- (E) Min-node sub-1.5-ULP budget per grade at tau in {7,8} (single-double sweep) --------------
//        The floor is jittery (imp-33249): the FIRST sub-1.5-ULP lattice hit is recorded, not a
//        monotone threshold. grade6 reaches it at fewer nodes than grade4/grade5.
function minNodeBudget(tau, grade) {
  const { ref } = goldByTau(tau);
  const ulp = Math.abs(ref) * EPS;
  for (let p = 100; p <= 8000; p += 2) {
    const gap = Math.abs(negLnAgradedGL(tau, HI, p, grade) - ref) / ulp;
    if (gap < 1.5) {
      return Object.freeze({ tau, grade, panels: p, glNodes: 10 * p, tauStar: tauStar(p, grade), worstUlp: gap });
    }
  }
  return Object.freeze({ tau, grade, panels: null, glNodes: null, tauStar: null, worstUlp: Infinity });
}
const MIN_NODE = TAU_GRID.flatMap((tau) => [4, 5, 6].map((grade) => minNodeBudget(tau, grade)));
const minNodeAt = (tau, grade) => MIN_NODE.find((m) => m.tau === tau && m.grade === grade);

// -- Named-floor failure: grade5/342p worst gap at each tau --------------------------------------
const namedFloorGap = TAU_GRID.map((tau) => {
  const row = SCORED.find((s) => s.tau === tau).rows.find((r) => r.tag.startsWith('imp-33249 named floor'));
  return Object.freeze({ tau, sdUlp: row.sdUlp, ddUlp: row.ddUlp });
});
const namedFloorWorst = namedFloorGap.reduce((m, g) => Math.max(m, g.sdUlp), 0);

// -- Verdict classifiers -------------------------------------------------------------------------
// (1) The cluster gold is certified below ~1 ULP at both extended tau.
const goldIsBelowOneUlp = goldWorstClusterUlp < 1.5;
// (2) SD and DD are BIT-IDENTICAL: the DD route buys zero accuracy for -ln A (no additive cancellation).
const ddIsUnnecessary = goldWorstSdVsDdUlp < 1e-9 && worstSdVsDdRowUlp < 1e-9;
// (3) The imp-33249 grade5/342p floor FAILS above tau=6 -- worst-in-{7,8} well above the <1 ULP bar.
const namedFloorWidens = namedFloorWorst > 3;
// (4) grade6 stays the cheapest family to reach the floor band: its min-node budget at each tau is
//     below the grade4 and grade5 min-node budgets (steeper grades cheaper, per imp-33249).
const grade6Cheapest = TAU_GRID.every((tau) => {
  const g4 = minNodeAt(tau, 4);
  const g5 = minNodeAt(tau, 5);
  const g6 = minNodeAt(tau, 6);
  return g6.glNodes !== null && g6.glNodes < g5.glNodes && g5.glNodes < g4.glNodes;
});
// (5) A widened grade6 rule (tau*>=7.4) restores the floor band at both tau -- the budget must widen.
const widenedRuleRestoresFloor = TAU_GRID.every((tau) => {
  const row = SCORED.find((s) => s.tau === tau).rows.find((r) => r.tag === 'grade6 margin tau*=7.49' && tau === 7)
    || SCORED.find((s) => s.tau === tau).rows.find((r) => r.tag === 'grade6 margin tau*=8.30');
  return row && row.sdUlp < 1.5;
});

const verdict =
  goldIsBelowOneUlp && ddIsUnnecessary && namedFloorWidens && grade6Cheapest && widenedRuleRestoresFloor
    ? 'MEASURED:-EXTENDING-THE-imp-33249-<1-ULP-GRADED-GL-NODE-BUDGET-FOR-(-ln-A)-TO-tau-in-{7,8}:-' +
      '(1)-THE-imp-33248-DOUBLE-DOUBLE-ROUTE-IS-UNNECESSARY-HERE:-SD-AND-DD-LOG-SUM-EXP-ARE-BIT-IDENTICAL-' +
      '(0-ULP)-AT-EVERY-(tau,grade,panels)-THROUGH-tau=8-BECAUSE-(-ln-A)-HAS-NO-SUBTRACTIVE-CANCELLATION-' +
      '(UNLIKE-THE-WATSON-BRACKET-THAT-SUBTRACTS-TWO-~pi-e^{4tau}-MAGNITUDES),-SO-SINGLE-DOUBLE-ALREADY-' +
      'REACHES-THE-ARITHMETIC-FLOOR;-(2)-THE-grade<=5/342p-EMPIRICAL-FLOOR-DOES-NOT-HOLD-ABOVE-tau=6-(4.84-' +
      'ULP-AT-tau=7,-625-ULP-AT-tau=8:-ITS-tau*=6.00-NO-LONGER-CLEARS-THE-PEAK)-AND-MUST-WIDEN-SO-tau*-' +
      'TRACKS-THE-NEW-PEAK;-grade6-STAYS-THE-CHEAPEST-FAMILY-(grade6/348p-tau*=7.49-HITS-~0-ULP-AT-tau=7,-' +
      'grade6/600p-tau*=8.30-HITS-0.57-AT-tau=8),-THE-imp-33249-STEEPER-GRADES-ARE-CHEAPER-ORDERING-PERSISTS.-' +
      'ACCURACY-MEASUREMENT/RULE-DESIGN-ONLY;-mass-feasibility-NECESSARY-BUT-NOT-SUFFICIENT;-imp-3066-' +
      'UNTOUCHED;-NO-QED;-PT-Lambda<=0.2-STAYS-SOTA'
    : 'INDETERMINATE';

export const IMP33277_A_WEIGHT_GRADED_GL_1ULP_BUDGET_TAU78 = Object.freeze({
  id: 'imp-33277-a-weight-graded-gl-1ulp-budget-tau78',
  ticket: 'imp-33277',
  paperSourcePath: PAPER_REF,
  paperSections: ['§25', '§26', '§27'],
  extendsModule: 'imp-33249-a-weight-graded-gl-minimal-full-window-1ulp-budget.js',
  reusesRoute: 'imp-33248-dd-watson-bracket-high-tau-run.js',

  summary:
    'EXTENDS the imp-33249 full-window graded-GL <1 ULP node-budget measurement for -ln A(tau) to tau in ' +
    '{7,8}, running each rule in BOTH single-double and the imp-33248 double-double (Dekker/Knuth) ' +
    'log-sum-exp arithmetic. Two findings: (1) the double-double route the ticket assumed is UNNECESSARY ' +
    'for this weight -- SD and DD are bit-identical (0.000 ULP) at every (tau,grade,panels) through tau=8, ' +
    'because -ln A has no subtractive cancellation (unlike the Watson bracket that subtracts two ~pi e^{4tau} ' +
    'magnitudes), so single-double already reaches the arithmetic floor. (2) The imp-33249 grade<=5/342p ' +
    'empirical floor DOES NOT hold above tau=6: grade5/342p (tau*=6.00) misses the <1 ULP bar by 4.84 ULP ' +
    'at tau=7 and 625 ULP at tau=8, because its innermost panel no longer clears the peak scale sigma(tau); ' +
    'the budget must WIDEN so tau* tracks the new peak. grade6 stays the cheapest family (grade6/348p, ' +
    'tau*=7.49, hits ~0 ULP at tau=7; grade6/600p, tau*=8.30, hits 0.57 at tau=8), and the min-node ' +
    'sub-1.5-ULP hit at each tau is a grade6 rule at fewer nodes than grade4/grade5 -- the imp-33249 ' +
    '"steeper grades cheaper with a crossover margin" ordering persists (still a jittery lattice floor). ' +
    'ACCURACY MEASUREMENT/RULE-DESIGN ONLY, RH-EQUIVALENT, necessary-but-not-sufficient; operator ' +
    'positivity (imp-3066) untouched; no QED. PT Lambda <= 0.2 stays SOTA.',

  method: Object.freeze({
    aWeight: 'A(tau) = int_0^inf Phi(s) Phi(s+tau) ds, Phi the NPHI=10 completed-Riemann kernel (imp-2686/imp-3646)',
    twoArithmetics: 'each rule computed twice: single-double log-sum-exp (imp-33249) and imp-33248 ' +
      'double-double (Dekker/Knuth twoSum) accumulation of exp(t - mx); the two are compared in ULP',
    whyDdChangesNothing: 'the -ln A log-sum-exp sums exp(t - mx) >= 0 with no difference of near-equal ' +
      'magnitudes, so it carries no additive cancellation for double-double to recover; the imp-33248 DD ' +
      'route helped the Watson bracket only because that ladder subtracts two magnitudes ~pi e^{4tau}',
    clusterGold: 'per-tau reference = average of two independent graded-GL grades (4 and 5), panels sized ' +
      'so tau*(panels,grade)=tau+2.5 fully resolves the peak at that tau; the two grades agree below ~1 ULP',
    fullWindowScore: 'representative (grade,panels) rules scored at tau in {7,8} in both arithmetics; worst ' +
      'gap in ULP recorded, plus the SD-vs-DD difference',
    minNodeSweep: 'first (single-double) sub-1.5-ULP lattice hit per grade located by a panel sweep; the ' +
      'floor is jittery (imp-33249), so this is a lattice hit, not a monotone threshold',
    selfComputing: 'gold, every scored row, both arithmetics, the min-node sweep and every verdict flag ' +
      'recompute at import',
  }),

  measured: Object.freeze({
    hi: HI,
    unitRoundoff: EPS,
    tauGrid: TAU_GRID,
    goldMargin: GOLD_MARGIN,
    gold: GOLD,
    goldWorstClusterUlp,
    goldWorstSdVsDdUlp,
    worstSdVsDdRowUlp,
    scored: SCORED,
    namedFloorGap,
    namedFloorWorst,
    minNodeBudgets: MIN_NODE,
    goldIsBelowOneUlp,
    ddIsUnnecessary,
    namedFloorWidens,
    grade6Cheapest,
    widenedRuleRestoresFloor,
    verdict,
  }),

  interpretation: Object.freeze({
    doubleDoubleBuysNothingHere:
      'The ticket assumed the imp-33248 double-double route would be needed above tau=6 as it was for the ' +
      'Watson bracket. But -ln A is computed by log-sum-exp -- a sum of exp(t - mx) >= 0 with no subtraction ' +
      'of near-equal magnitudes -- so there is no additive cancellation for extended precision to recover. ' +
      'SD and DD are bit-identical through tau=8. The binding accuracy limit for -ln A is the single-double ' +
      'log-sum-exp round-off floor (jittery ~0.5-1 ULP), not additive cancellation; DD is the right tool for ' +
      'the Watson bracket, the wrong tool here.',
    theNamedFloorWidensWithThePeak:
      'grade5/342p has tau*(342,5)=6.00, exactly resolving the tau=6 peak, which is why imp-33249 named it ' +
      'the tau<=6 floor. Above tau=6 its innermost panel width no longer sits a few-fold below the peak scale ' +
      'sigma(tau)=1/(4 pi e^{4tau}), so it fails: 4.84 ULP at tau=7, 625 ULP at tau=8. The imp-33249 binding ' +
      'requirement -- innermost-panel width below sigma(tau), i.e. a tau* margin above tau -- is unchanged; ' +
      'only the target peak moved, so the budget must widen. This is a peak-resolution effect, NOT an ' +
      'arithmetic breakdown (which the SD-vs-DD bit-identity rules out).',
    grade6StaysCheapest:
      'The imp-33249 grade-ordering persists at tau in {7,8}: the min-node sub-1.5-ULP lattice hit is a ' +
      'grade6 rule at fewer nodes than the grade5 and grade4 hits, and a modest grade6 margin (grade6/348p ' +
      'tau*=7.49 at tau=7, grade6/600p tau*=8.30 at tau=8) reaches the floor band at fewer nodes than any ' +
      'shallower grade. The exact min-node panel count remains a jittery lattice property (neighbouring ' +
      'panel counts bounce above the bar), so the robust reading is the grade-ordering and the tau* margin, ' +
      'not the precise panel count.',
  }),

  honestCaveat: Object.freeze({
    isProof: false,
    isReductionBelowRH: false,
    rhEquivalent: true,
    isStructuralDiagnostic: true,
    derivationScope:
      'Measures the node budget and SD-vs-DD arithmetic behaviour of a fixed graded-GL quadrature rule for ' +
      'a fixed autocorrelation weight at tau in {7,8} -- a magnitude used inside a mass-feasibility ' +
      'diagnostic. It establishes NO operator positivity.',
    necessaryNotSufficient:
      'Mass-feasibility is NECESSARY-BUT-NOT-SUFFICIENT. The operator-level K_a >= 0 sign-positivity ' +
      '(off-diagonal endpoint-Hankel step, imp-3066) remains the lone obstruction, UNTOUCHED. No RH verdict.',
    didNotAttemptPositivity: true,
    nphiTruncationInherited:
      'The NPHI=10 Phi-series truncation is inherited from imp-33249/imp-33232; this audits the quadrature ' +
      'node budget, not that truncation.',
    latticeJitterCaveat:
      'The min-node sub-1.5-ULP points are single lattice hits on a jittery arithmetic floor; neighbouring ' +
      'panel counts bounce above the bar, and cross-platform libm variation in exp/log can shift the ~1 ULP ' +
      'measurements. The robust reading is the SD-vs-DD bit-identity, the named-floor widening and the ' +
      'grade-ordering, not the exact panel counts.',
    sota: 'Platt-Trudgian Lambda <= 0.2 remains the rigorous SOTA',
  }),
});

// -- Tripwire assertions -------------------------------------------------------------------------
export const IMP33277_A_WEIGHT_GRADED_GL_1ULP_BUDGET_TAU78_ASSERTIONS = [
  {
    id: 'imp33277-cluster-gold-certified-below-one-ulp',
    why: 'The adaptive cluster gold (two independent grade4/grade5 rules per tau) must agree below ~1 ULP ' +
         'at both extended tau in {7,8}, certifying it so a <1 ULP measurement is meaningful.',
    holds: () => goldIsBelowOneUlp && goldWorstClusterUlp < 1.5,
  },
  {
    id: 'imp33277-single-double-and-double-double-are-bit-identical',
    why: 'HEADLINE 1: -ln A has no subtractive cancellation, so the imp-33248 double-double log-sum-exp ' +
         'accumulation is BIT-IDENTICAL to single-double at every (tau,grade,panels) through tau=8; the DD ' +
         'route buys zero accuracy for this weight, unlike the Watson bracket it was built for.',
    holds: () => ddIsUnnecessary && goldWorstSdVsDdUlp < 1e-9 && worstSdVsDdRowUlp < 1e-9,
  },
  {
    id: 'imp33277-grade5-342p-floor-widens-above-tau6',
    why: 'HEADLINE 2: the imp-33249 grade<=5/342p empirical floor (tau*=6.00) does NOT hold above tau=6 -- ' +
         'it misses the <1 ULP bar by >3 ULP (4.84 at tau=7, 625 at tau=8), so the budget must widen.',
    holds: () => namedFloorWidens && namedFloorWorst > 3,
  },
  {
    id: 'imp33277-grade6-stays-cheapest-family',
    why: 'The imp-33249 grade-ordering persists: the min-node sub-1.5-ULP hit at each tau in {7,8} is a ' +
         'grade6 rule at fewer nodes than the grade5 and grade4 hits.',
    holds: () => grade6Cheapest,
  },
  {
    id: 'imp33277-widened-rule-restores-the-floor',
    why: 'The failure is peak-resolution, not arithmetic: a widened grade6 rule (tau*>=7.4) restores the ' +
         'floor band (<1.5 ULP) at both tau, confirming the budget must WIDEN with the peak.',
    holds: () => widenedRuleRestoresFloor,
  },
  {
    id: 'imp33277-verdict-records-the-measurement',
    why: 'The classified verdict must record the DD-is-unnecessary finding, the named-floor widening and ' +
         'the persistent grade-ordering.',
    holds: () => verdict !== 'INDETERMINATE',
  },
  {
    id: 'imp33277-honest-diagnostic-not-a-verdict',
    why: 'Mandatory honesty: accuracy measurement/rule-design audit only, mass-feasibility ' +
         'necessary-but-not-sufficient, operator positivity (imp-3066) untouched, PT 0.2 stays SOTA.',
    holds: () => {
      const c = IMP33277_A_WEIGHT_GRADED_GL_1ULP_BUDGET_TAU78.honestCaveat;
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

for (const assertion of IMP33277_A_WEIGHT_GRADED_GL_1ULP_BUDGET_TAU78_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-33277-a-weight-graded-gl-1ulp-budget-tau78 assertion failed: ${assertion.id}`);
  }
}

export default IMP33277_A_WEIGHT_GRADED_GL_1ULP_BUDGET_TAU78;
