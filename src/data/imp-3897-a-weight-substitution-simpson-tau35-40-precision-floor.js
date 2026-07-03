/**
 * @module imp-3897-a-weight-substitution-simpson-tau35-40-precision-floor
 * @fileoverview imp-3897 -- LOCATE where import-time double-precision self-computation of -ln A
 *   breaks down, by pushing the imp-3873 peak-scaled substitution-Simpson scheme from tau=3.0 up
 *   to tau=6.0 (the imp-3730 cancellation floor flagged by imp-3866 as the clean-window ceiling).
 *
 *   imp-3873 reproduced the imp-3850 offline literals -ln A(2.5)=69198.540665 and
 *   -ln A(3.0)=511309.612538 SELF-COMPUTINGLY at import (n<=8000) via the peak-scaled substitution
 *       A(tau) = int_0^inf Phi(s) Phi(s+tau) ds = sigma * int_0^Xmax g(sigma x) dx,
 *       g(s) = Phi(s) Phi(s+tau),   sigma = 1/(4 pi e^{4 tau})  (the analytic near-s=0 peak width).
 *   The substitution keeps the peak O(1)-wide in x at EVERY tau, so a uniform Simpson x-mesh with
 *   n<=8000 nodes resolves it regardless of how far sigma collapses. This module MEASURES that
 *   scheme at tau in {3.5, 4.0, 4.5, 5.0, 5.5, 6.0} to find where it (or its companion reference)
 *   loses accuracy, and to separate a genuine double-precision floor from a curable rule artifact.
 *
 *   THE MAGNITUDE GROWS GEOMETRICALLY, SO THE REPRESENTATION FLOOR RISES WITH IT
 *   ---------------------------------------------------------------------------
 *   -ln A ~ pi e^{4 tau} climbs from 6.9e4 (2.5) to 8.3e10 (6.0). A double stores V=-ln A to a
 *   RELATIVE 2^-52, so its ABSOLUTE representation floor is ulp(V) = |V| * 2^-52, which itself
 *   grows: 8.4e-10 (3.5) -> 6.2e-9 (4.0) -> 4.6e-8 (4.5) -> 3.4e-7 (5.0) -> 1.85e-5 (6.0). This
 *   ulp(V) -- not any quadrature error -- is the true limit on how precisely -ln A can be held.
 *
 *   MEASURED (all self-computing at import, n<=8000, Xmax=40)
 *   --------------------------------------------------------
 *   Against a PEAK-ADEQUATELY-REFINED graded-GL reference (hi=14, panels=400, grade=5), the
 *   substitution-Simpson agrees to <=1.41 ULP of the magnitude at EVERY tau up to 6.0:
 *       tau   -ln A            ulp(V)     sub-vs-refined-GL     fixed-GL(200,grade4) gap
 *       3.5   3778093.139036   8.4e-10    0.56 ULP             0.0     ULP
 *       4.0   27916539.884667  6.2e-9     0.00 ULP             1.2     ULP
 *       4.5   206276877.03112  4.6e-8     1.30 ULP             1853.8  ULP
 *       5.0   1524191414.0312  3.4e-7     1.41 ULP             9534.2  ULP
 *       5.5   11262335861.521  2.5e-6     0.76 ULP             1.03e6  ULP
 *       6.0   83218031483.513  1.85e-5    0.00 ULP             1.81e6  ULP
 *   The substitution-Simpson does NOT lose accuracy: it tracks -ln A to the LAST REPRESENTABLE BIT
 *   (<=~1 ULP) through tau=6, its domain-invariance (Xmax in {40,80,120}) and n=4000->8000 rung
 *   step both staying at a few ULP.
 *
 *   WHAT BREAKS DOWN NEAR tau ~ 4, AND WHY IT IS A RULE ARTIFACT NOT A PRECISION FLOOR
 *   ---------------------------------------------------------------------------------
 *   The imp-3873 FIXED graded-GL companion (hi=14, panels=200, grade=4) diverges from the
 *   substitution-Simpson by 1.2 ULP (4.0) -> 1854 ULP (4.5) -> 9534 (5.0) -> ~1.8e6 (6.0). The
 *   onset is set by the fixed rule's INNERMOST power-panel width w_inner = hi*(1/panels)^grade =
 *   14*(1/200)^4 = 8.75e-9 falling below the peak scale sigma(tau) = 1/(4 pi e^{4 tau}):
 *       sigma(4.0) = 8.96e-9 ~ w_inner  (marginal, 1.2 ULP)
 *       sigma(4.5) = 1.21e-9 < w_inner  (fails, 1854 ULP)
 *   The crossover sigma(tau*) = w_inner solves to tau* ~ 4.006 -- exactly the observed 4.0->4.5
 *   breakdown edge. REFINING the reference to grade-5/400 panels (w_inner=8.75e-11) restores
 *   <=1.41-ULP agreement at every tau, PROVING the divergence is fixed-rule under-resolution of the
 *   collapsing peak, NOT a double-precision failure. The substitution-Simpson never breaks down
 *   because its node placement tracks sigma(tau) analytically; only companion rules whose node
 *   budget is fixed (blind to sigma) do.
 *
 *   VERDICT
 *   -------
 *   Import-time double-precision self-computation of -ln A via the peak-scaled substitution-Simpson
 *   stays at the ~1-ULP representation floor across the ENTIRE clean window tau<=6 (the imp-3730
 *   cancellation floor / imp-3866 ceiling). It does not degrade. The apparent breakdown near
 *   tau~4.0-4.5 belongs to FIXED-panel companion rules whose innermost panel drops below sigma(tau);
 *   it is curable by refinement, not a precision floor. The genuine double-precision limit -- where
 *   ulp(V)=|V|*2^-52 reaches O(1) absolute, i.e. V ~ 2^52 -- lands at pi e^{4 tau} ~ 4.5e15, tau ~
 *   8.73, well beyond the tau~6 cancellation floor that actually bounds the clean window.
 *
 *   WHAT THIS DOES AND DOES NOT ESTABLISH (mandatory honesty)
 *   ---------------------------------------------------------
 *   ACCURACY / PROVENANCE MEASUREMENT ONLY, at the RH-equivalent scale class. It measures the
 *   floating-point behaviour of a quadrature value for a fixed autocorrelation weight used inside a
 *   mass-feasibility diagnostic; it establishes NO operator positivity. Mass-feasibility is
 *   NECESSARY-BUT-NOT-SUFFICIENT. The operator-level K_a &gt;= 0 sign-positivity (off-diagonal
 *   endpoint-Hankel step, imp-3066) is UNTOUCHED. No RH verdict, no QED. Platt-Trudgian
 *   Lambda &lt;= 0.2 remains the rigorous SOTA.
 *
 *   @see imp-3873-a-weight-offline-literal-independent-reproduction.js (the tau in {2.5,3.0} scheme this extends)
 *   @see imp-3850-a-weight-dual-path-tau25-30-reconciliation.js (the offline-literal source)
 *   @see imp-3709-a-weight-logdomain-independent-reproduction.js (the graded-GL path)
 *
 *   Ticket: imp-3897 (numerical, medium).
 */

const PAPER_REF = 'research-inputs/twin_ladder_consolidated_v52.pdf';
const NPHI = 10;
const PI = Math.PI;
const EPS = Math.pow(2, -52); // double-precision unit round-off (relative)

/**
 * Factored ln Phi(u) (imp-3709/imp-3850/imp-3873 form): pull out the n=1 leading exponent.
 * ln Phi(u) = -pi e^{4u} + ln( sum_n amp_n e^{-pi (n^2-1) e^{4u}} ).
 */
function logPhiFactored(u) {
  const e2 = Math.exp(2 * u);
  const e4 = Math.exp(4 * u);
  let acc = 0;
  for (let n = 1; n <= NPHI; n += 1) {
    const n2 = n * n;
    const n4 = n2 * n2;
    const amp = 2 * PI * PI * n4 * e4 - 3 * PI * n2 * e2;    // > 0 for u >= 0
    acc += amp * Math.exp(-PI * (n2 - 1) * e4);
  }
  return -PI * e4 + Math.log(acc);
}

// -- Reference path: imp-3850/imp-3873 graded 10-pt Gauss-Legendre panel rule -----------------
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

// -- The imp-3873 peak-scaled substitution uniform log-Simpson (node placement tracks sigma) ---
// s = sigma * x, sigma = 1/(4 pi e^{4 tau}); A = sigma * int_0^Xmax g dx. Uniform x-mesh seats
// O(few-thousand) nodes under the O(1)-wide rescaled peak at ANY tau -- self-computes at import.
function negLnAsubSimpson(tau, Xmax, n) {
  const sigma = 1 / (4 * PI * Math.exp(4 * tau));
  const m = n % 2 === 0 ? n : n + 1;
  const h = Xmax / m;
  const logw = [];
  let mx = -Infinity;
  for (let i = 0; i <= m; i += 1) {
    const w = i === 0 || i === m ? 1 : (i % 2 === 0 ? 2 : 4);
    const s = sigma * (i * h);
    const t = Math.log(w) + logPhiFactored(s) + logPhiFactored(s + tau);
    logw.push(t);
    if (t > mx) mx = t;
  }
  let acc = 0;
  for (const t of logw) acc += Math.exp(t - mx);
  // -ln A = -[ ln(sigma) + ln(h/3) + mx + ln(acc) ]
  return -(Math.log(sigma) + Math.log(h / 3) + mx + Math.log(acc));
}

// tau grid extending imp-3873 (which stopped at 3.0) up to the imp-3730 cancellation floor ~6.
const TAUS = [3.5, 4, 4.5, 5, 5.5, 6];

// The imp-3873 FIXED graded-GL companion rule and a PEAK-ADEQUATELY-REFINED one.
const FIXED_GL = Object.freeze({ hi: 14, panels: 200, grade: 4 }); // imp-3873s reference
const REFINED_GL = Object.freeze({ hi: 14, panels: 400, grade: 5 }); // resolves sigma past tau=6
// Innermost power-panel width w_inner = hi*(1/panels)^grade -- the finest scale each rule resolves.
const wInnerFixed = FIXED_GL.hi * Math.pow(1 / FIXED_GL.panels, FIXED_GL.grade);
const wInnerRefined = REFINED_GL.hi * Math.pow(1 / REFINED_GL.panels, REFINED_GL.grade);

// -- (A) Per-tau precision-floor measurement (everything self-computes at import) --------------
const FLOOR_TABLE = TAUS.map((tau) => {
  const sub = negLnAsubSimpson(tau, 40, 8000);
  const V = Math.abs(sub);
  const ulp = V * EPS; // absolute representation floor of the magnitude
  const sigma = 1 / (4 * PI * Math.exp(4 * tau));
  const refFine = negLnAgradedGL(tau, REFINED_GL.hi, REFINED_GL.panels, REFINED_GL.grade);
  const refFixed = negLnAgradedGL(tau, FIXED_GL.hi, FIXED_GL.panels, FIXED_GL.grade);
  // domain-invariance of the substitution x-cutoff
  const x40 = sub;
  const x80 = negLnAsubSimpson(tau, 80, 8000);
  const x120 = negLnAsubSimpson(tau, 120, 8000);
  const domainSpread = Math.max(Math.abs(x40 - x80), Math.abs(x80 - x120));
  // self-refinement rung step at the top of the ladder
  const r4 = negLnAsubSimpson(tau, 40, 4000);
  const rungStep = Math.abs(sub - r4);
  return Object.freeze({
    tau,
    sigma,
    negLnA: sub,
    ulp,
    subVsRefinedGLulp: Math.abs(sub - refFine) / ulp,
    fixedGLgapUlp: Math.abs(sub - refFixed) / ulp,
    domainSpreadUlp: domainSpread / ulp,
    rungStepUlp: rungStep / ulp,
    peakBelowFixedInnerPanel: sigma < wInnerFixed,
  });
});

// -- (B) The self-refinement ladder at the two boundary tau, in ULP of the magnitude -----------
// Shows the substitution-Simpson DESCENDING toward and SATURATING at the ~1-ULP floor.
const LADDER = [3.5, 4].map((tau) => {
  const V = Math.abs(negLnAsubSimpson(tau, 40, 8000));
  const ulp = V * EPS;
  const refFine = negLnAgradedGL(tau, REFINED_GL.hi, REFINED_GL.panels, REFINED_GL.grade);
  const rungs = [500, 1000, 2000, 4000, 8000].map((n) => {
    const v = negLnAsubSimpson(tau, 40, n);
    return Object.freeze({ n, negLnA: v, gapToRefinedUlp: Math.abs(v - refFine) / ulp });
  });
  return Object.freeze({ tau, ulp, rungs });
});

// -- (C) Fixed-rule breakdown crossover: sigma(tau*) = w_inner(fixed) --------------------------
// sigma = 1/(4 pi e^{4 tau}) = w_inner  =>  tau* = ln( 1/(4 pi w_inner) ) / 4.
const tauStarFixed = Math.log(1 / (4 * PI * wInnerFixed)) / 4;
// Genuine absolute floor: ulp(V) = |V| * 2^-52 = 1  =>  V = 2^52  =>  pi e^{4 tau} = 2^52.
const tauAbsFloor = Math.log(Math.pow(2, 52) / PI) / 4;

// -- Verdict classifiers -----------------------------------------------------------------------
// (1) The substitution-Simpson stays at the ~1-ULP representation floor at EVERY tau up to 6.
const subStaysAtUlpFloor = FLOOR_TABLE.every((r) => r.subVsRefinedGLulp <= 2);
// (2) The self-refinement ladder descends to and saturates at the floor (final rung <= 2 ULP).
const ladderSaturatesAtFloor = LADDER.every((l) => {
  const g = l.rungs.map((r) => r.gapToRefinedUlp);
  return g[0] > g[g.length - 1] && g[g.length - 1] <= 2;
});
// (3) A FIXED-panel companion rule breaks down: gap O(1) ULP at tau<=4, but >>1 (>100 ULP) at
//     tau>=4.5, i.e. exactly where the peak sigma drops below the fixed innermost panel.
const fixedRuleBreaksDown =
  FLOOR_TABLE.filter((r) => r.tau <= 4).every((r) => r.fixedGLgapUlp <= 5) &&
  FLOOR_TABLE.filter((r) => r.tau >= 4.5).every((r) => r.fixedGLgapUlp > 100) &&
  FLOOR_TABLE.filter((r) => r.tau >= 4.5).every((r) => r.peakBelowFixedInnerPanel);
// (4) The breakdown is a RULE artifact not a precision floor: refining the reference restores
//     <=2-ULP agreement at the very tau where the fixed rule diverged by >100 ULP.
const breakdownIsRuleNotPrecision =
  FLOOR_TABLE.filter((r) => r.tau >= 4.5).every((r) => r.subVsRefinedGLulp <= 2 && r.fixedGLgapUlp > 100);
// (5) The crossover sigma(tau*)=w_inner lands in the observed 4.0->4.5 breakdown edge.
const crossoverInBreakdownEdge = tauStarFixed > 4 && tauStarFixed < 4.5;
// (6) Domain-invariance holds (x-cutoff not a truncation artifact) across the whole window.
const domainInvariant = FLOOR_TABLE.every((r) => r.domainSpreadUlp <= 3);

const verdict =
  subStaysAtUlpFloor &&
  ladderSaturatesAtFloor &&
  fixedRuleBreaksDown &&
  breakdownIsRuleNotPrecision &&
  crossoverInBreakdownEdge &&
  domainInvariant
    ? 'IMPORT-TIME-DOUBLE-PRECISION-SELF-COMPUTATION-OF-lnA-VIA-THE-PEAK-SCALED-SUBSTITUTION-SIMPSON(n<=8000)-STAYS-AT-THE-~1-ULP-REPRESENTATION-FLOOR-ACROSS-THE-WHOLE-CLEAN-WINDOW-tau<=6:-IT-DOES-NOT-BREAK-DOWN;-THE-APPARENT-tau~4.0-4.5-BREAKDOWN-BELONGS-TO-THE-FIXED-GRADED-GL(200,grade4)-COMPANION-RULE-WHOSE-INNERMOST-PANEL-w_inner=8.75e-9-FALLS-BELOW-THE-PEAK-sigma(tau)=1/(4pi-e^{4tau})-AT-tau*~4.01-(1.2-ULP-AT-4.0->1854-ULP-AT-4.5->1.8e6-ULP-AT-6.0),-CURED-BY-REFINING-TO-grade5/400;-THE-GENUINE-ABSOLUTE-DOUBLE-PRECISION-FLOOR-ulp(V)=|V|*2^-52=1-LANDS-AT-tau~8.73,-BEYOND-THE-imp-3730-CANCELLATION-FLOOR-tau~6-THAT-ACTUALLY-BOUNDS-THE-WINDOW'
    : 'INDETERMINATE';

export const IMP3897_A_WEIGHT_SUBSTITUTION_SIMPSON_TAU35_40_PRECISION_FLOOR = Object.freeze({
  id: 'imp-3897-a-weight-substitution-simpson-tau35-40-precision-floor',
  ticket: 'imp-3897',
  paperSourcePath: PAPER_REF,
  paperSections: ['§25', '§26', '§27'],
  extendsModule: 'imp-3873-a-weight-offline-literal-independent-reproduction.js',

  summary:
    'PUSHES the imp-3873 peak-scaled substitution-Simpson -ln A self-computation from tau=3.0 up to the ' +
    'imp-3730 cancellation floor tau=6.0 to LOCATE where import-time double precision breaks down. Finding: it ' +
    'does NOT. Against a peak-adequately-refined graded-GL reference (14,400,grade5) the substitution-Simpson ' +
    '(n<=8000, Xmax=40) tracks -ln A to <=1.41 ULP of the magnitude at EVERY tau in {3.5,4.0,4.5,5.0,5.5,6.0}, ' +
    'its domain-invariance (Xmax in {40,80,120}) and n=4000->8000 rung step staying at a few ULP. What breaks ' +
    'down near tau~4.0-4.5 is the imp-3873 FIXED graded-GL companion (14,200,grade4): its gap to the ' +
    'substitution-Simpson jumps 1.2 ULP (4.0) -> 1854 ULP (4.5) -> ~1.8e6 ULP (6.0), onsetting exactly where the ' +
    'peak width sigma(tau)=1/(4 pi e^{4 tau}) drops below the fixed rules innermost power panel ' +
    'w_inner=14*(1/200)^4=8.75e-9 (crossover tau*~4.01). Refining the reference restores <=1.41-ULP agreement, ' +
    'so the breakdown is fixed-rule under-resolution of the collapsing peak, NOT a precision floor. The genuine ' +
    'absolute double-precision floor ulp(V)=|V|*2^-52=1 lands at tau~8.73, beyond the tau~6 cancellation floor ' +
    'that actually bounds the clean window. ACCURACY/PRECISION MEASUREMENT, RH-EQUIVALENT, ' +
    'necessary-but-not-sufficient; operator positivity (imp-3066) untouched; no QED. PT Lambda <= 0.2 stays SOTA.',

  method: Object.freeze({
    aWeight: 'A(tau) = int_0^inf Phi(s) Phi(s+tau) ds, Phi the NPHI=10 completed-Riemann kernel (imp-2686/imp-3646)',
    sharedKernel: 'the factored ln Phi(u) = -pi e^{4u} + ln(sum_n amp_n e^{-pi(n^2-1)e^{4u}}) is held fixed; only the QUADRATURE / reference resolution varies',
    substitutionPath: 'peak-scaled substitution uniform Simpson s=sigma*x, sigma=1/(4 pi e^{4 tau}); node placement TRACKS the analytic peak scale so the rescaled peak stays O(1)-wide in x at every tau and n<=8000 resolves it',
    ulpFraming: 'the double stores V=-ln A to relative 2^-52, so its absolute representation floor is ulp(V)=|V|*2^-52; all gaps are reported in ULP so the geometric growth of V does not masquerade as accuracy loss',
    fixedVsRefinedReference: 'the substitution-Simpson is cross-checked against the imp-3873 FIXED graded-GL (14,200,grade4) AND a peak-adequately-REFINED graded-GL (14,400,grade5) to separate a genuine floor from fixed-rule under-resolution',
    innerPanelDiagnosis: 'a fixed graded rule resolves down to w_inner=hi*(1/panels)^grade; once sigma(tau) < w_inner the innermost panel no longer seats a node under the peak and the rule degrades -- the crossover sigma(tau*)=w_inner predicts the breakdown tau',
    selfComputing: 'every table entry, ladder rung, domain-invariance check and both references recompute at import (max <=8000 nodes); no offline literal is used as an input',
  }),

  measured: Object.freeze({
    taus: TAUS,
    fixedGL: FIXED_GL,
    refinedGL: REFINED_GL,
    wInnerFixed,
    wInnerRefined,
    unitRoundoff: EPS,
    floorTable: FLOOR_TABLE,
    ladder: LADDER,
    tauStarFixed,
    tauAbsFloor,
    subStaysAtUlpFloor,
    ladderSaturatesAtFloor,
    fixedRuleBreaksDown,
    breakdownIsRuleNotPrecision,
    crossoverInBreakdownEdge,
    domainInvariant,
    verdict,
  }),

  interpretation: Object.freeze({
    noBreakdownInTheCleanWindow:
      'The peak-scaled substitution-Simpson self-computes -ln A to <=1.41 ULP of the magnitude at every tau up ' +
      'to 6.0, the imp-3730 cancellation floor (imp-3866 ceiling). Because its node placement follows sigma(tau) ' +
      'analytically, the collapsing peak never outruns the mesh -- so there is NO import-time precision breakdown ' +
      'anywhere in the clean window; the value is held to the last representable bit of its magnitude.',
    theRepresentationFloorRisesWithTheMagnitude:
      '-ln A ~ pi e^{4 tau} grows geometrically (3.78e6 at 3.5 -> 8.32e10 at 6.0), so its absolute representation ' +
      'floor ulp(V)=|V|*2^-52 rises with it (8.4e-10 -> 1.85e-5). This rising floor, not any quadrature error, is ' +
      'the operative limit; the two independent paths agree to within ~1 ULP of it throughout.',
    whatActuallyBreaksIsAFixedRule:
      'The imp-3873 FIXED graded-GL companion (14,200,grade4) diverges by 1.2 ULP (4.0) -> 1854 (4.5) -> 9534 ' +
      '(5.0) -> ~1.8e6 (6.0) because its innermost power-panel width w_inner=8.75e-9 falls below the peak scale ' +
      'sigma(tau); the crossover sigma(tau*)=w_inner solves to tau*~4.01, matching the observed 4.0->4.5 edge.',
    breakdownIsCurableNotFundamental:
      'Refining the reference to grade-5/400 panels (w_inner=8.75e-11) restores <=1.41-ULP agreement at the very ' +
      'tau where the fixed rule diverged by >1e3-1e6 ULP, proving the divergence is under-resolution of the peak, ' +
      'NOT a double-precision failure. The genuine absolute floor ulp(V)=1 (V~2^52, pi e^{4 tau}~4.5e15) lands at ' +
      'tau~8.73, well past the tau~6 cancellation floor that actually caps the clean window.',
  }),

  honestCaveat: Object.freeze({
    isProof: false,
    isReductionBelowRH: false,
    rhEquivalent: true,
    isStructuralDiagnostic: true,
    derivationScope:
      'Measures the floating-point precision behaviour of a quadrature value for a fixed autocorrelation weight ' +
      '-- a magnitude used inside a mass-feasibility diagnostic. It establishes NO operator positivity.',
    necessaryNotSufficient:
      'Mass-feasibility is NECESSARY-BUT-NOT-SUFFICIENT. The operator-level K_a >= 0 sign-positivity ' +
      '(off-diagonal endpoint-Hankel step, imp-3066) remains the lone obstruction, UNTOUCHED. No RH verdict.',
    didNotAttemptPositivity: true,
    precisionScopeOnly:
      'This locates a FLOATING-POINT floor, not a mathematical one: it shows the substitution-Simpson holds -ln A ' +
      'to ~1 ULP through tau=6 and that the only observed degradation is a fixed companion rule under-resolving ' +
      'the peak. It says nothing about the imp-3730 CANCELLATION floor near tau~6 (a property of the amp-sum ' +
      'inside logPhiFactored), which remains the binding limit on the clean window.',
    sota: 'Platt-Trudgian Lambda <= 0.2 remains the rigorous SOTA',
  }),
});

// -- Tripwire assertions -----------------------------------------------------------------------
export const IMP3897_A_WEIGHT_SUBSTITUTION_SIMPSON_TAU35_40_PRECISION_FLOOR_ASSERTIONS = [
  {
    id: 'imp3897-substitution-simpson-stays-at-ulp-floor-through-tau6',
    why: 'THE HEADLINE: the peak-scaled substitution Simpson (n<=8000) must self-compute -ln A to within ~1 ULP ' +
         'of the magnitude (<=2 ULP vs a refined graded-GL) at EVERY tau in {3.5..6.0} -- it does not break down.',
    holds: () => subStaysAtUlpFloor,
  },
  {
    id: 'imp3897-refinement-ladder-descends-to-and-saturates-at-floor',
    why: 'The self-refinement ladder (n=500..8000) must DESCEND toward the ULP floor and saturate there ' +
         '(final rung <=2 ULP), confirming the residual is representation-limited, not under-resolution.',
    holds: () => ladderSaturatesAtFloor,
  },
  {
    id: 'imp3897-fixed-panel-companion-rule-breaks-down-above-crossover',
    why: 'THE LOCATED BREAKDOWN: the FIXED graded-GL (14,200,grade4) must stay <=5 ULP at tau<=4 but exceed ' +
         '100 ULP at tau>=4.5, exactly where the peak sigma(tau) drops below its innermost panel w_inner.',
    holds: () => fixedRuleBreaksDown,
  },
  {
    id: 'imp3897-breakdown-is-fixed-rule-artifact-not-precision-floor',
    why: 'THE DIAGNOSIS: at the tau where the fixed rule diverges by >100 ULP, REFINING the reference restores ' +
         '<=2-ULP agreement -- proving the breakdown is fixed-rule under-resolution of the collapsing peak, ' +
         'not a double-precision floor.',
    holds: () => breakdownIsRuleNotPrecision,
  },
  {
    id: 'imp3897-inner-panel-crossover-predicts-breakdown-edge',
    why: 'The analytic crossover sigma(tau*)=w_inner (tau* = ln(1/(4 pi w_inner))/4) must land in the observed ' +
         '4.0->4.5 breakdown edge, tying the fixed-rule failure to the peak scale.',
    holds: () => crossoverInBreakdownEdge,
  },
  {
    id: 'imp3897-substitution-domain-invariant-through-tau6',
    why: 'Xmax in {40,80,120} must agree to within a few ULP at every tau, proving the substitution x-cutoff ' +
         'is not a truncation artifact even as the peak collapses.',
    holds: () => domainInvariant,
  },
  {
    id: 'imp3897-verdict-records-no-precision-breakdown-in-clean-window',
    why: 'The classified verdict must record that self-computation stays at the ~1-ULP floor across tau<=6 and ' +
         'that the only breakdown is a fixed companion rule, not indeterminate.',
    holds: () => verdict !== 'INDETERMINATE',
  },
  {
    id: 'imp3897-honest-diagnostic-not-a-verdict',
    why: 'Mandatory honesty: precision measurement only, mass-feasibility necessary-but-not-sufficient, ' +
         'operator positivity (imp-3066) untouched, PT 0.2 stays SOTA.',
    holds: () => {
      const c = IMP3897_A_WEIGHT_SUBSTITUTION_SIMPSON_TAU35_40_PRECISION_FLOOR.honestCaveat;
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

for (const assertion of IMP3897_A_WEIGHT_SUBSTITUTION_SIMPSON_TAU35_40_PRECISION_FLOOR_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-3897-a-weight-substitution-simpson-tau35-40-precision-floor assertion failed: ${assertion.id}`);
  }
}

export default IMP3897_A_WEIGHT_SUBSTITUTION_SIMPSON_TAU35_40_PRECISION_FLOOR;
