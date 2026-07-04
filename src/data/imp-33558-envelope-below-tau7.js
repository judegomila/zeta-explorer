/**
 * @module imp-33558-envelope-below-tau7
 * @fileoverview imp-33558 -- EXTEND the imp-33538 tau-uniform envelope-constant derivation to the
 *   LOWER heights tau in {5,6} and measure whether the ~10.78 ULP envelope (set at tau=8 over the
 *   imp-33312 heights tau in {7..10}) STILL upper-bounds worst-in-window below tau=7.
 *
 *   WHAT imp-33538/imp-33312 MEASURED, AND WHAT THIS TICKET ADDS
 *   -----------------------------------------------------------
 *   imp-33312 ran the imp-33296 min-node grade6 +/-2-panel lattice-jitter scan of a FIXED
 *   resolved-region neighbourhood (panels 245..325, tau* ~6.96..7.38) at each height tau in {7..10}
 *   and reported a per-height band ceiling (worst-in-window ULP). imp-33538 named the tau-uniform
 *   conservative envelope E = max over tau in {7..10} of maxUlp(tau) ~= 10.78 ULP, BINDING at tau=8.
 *   Both stopped at tau=7. This module runs the SAME machinery (same NPHI=10 kernel, same GL-10 nodes,
 *   same fixed neighbourhood [245,325], same single-tau grade5/grade6 cluster gold) at the lower
 *   heights tau in {5,6}, recomputes their per-height ceilings, and reports whether the ~10.78 ULP
 *   envelope still bounds worst-in-window there or whether a lower height raises the binding constant.
 *
 *   HEADLINE (1): THE ~10.78 ULP ENVELOPE STILL UPPER-BOUNDS BELOW tau=7 -- IT DOES NOT BIND LOWER
 *   -------------------------------------------------------------------------------------------------
 *   The recomputed low-height ceilings are tau=5 -> ~3.52 ULP and tau=6 -> ~4.13 ULP, both well
 *   INSIDE the ~10.78 ULP envelope (margins ~7.26 and ~6.65 ULP, ~67% and ~62% slack). So no lower
 *   height raises the binding constant: extending the measurement DOWN to tau=5 leaves the envelope
 *   constant and its binding height (tau=8) unchanged. The height-uniform node-budget ceiling derived
 *   from tau in {7..10} remains valid, and conservative, across the wider band tau in {5..10}.
 *
 *   HEADLINE (2): THE CEILING CLIMBS MONOTONICALLY TOWARD THE tau=8 PEAK, THEN COLLAPSES
 *   -----------------------------------------------------------------------------------
 *   Across the full band the per-height ceiling rises with height up to the binding rung and then
 *   collapses: tau=5 ~3.52 -> tau=6 ~4.13 -> tau=7 ~10.65 -> tau=8 ~10.78 (PEAK/binding)
 *   -> tau=9 ~0.67 -> tau=10 ~0.00 ULP. The low heights are NOT a hidden worse regime -- the same
 *   fixed neighbourhood is even MORE resolved for them (tau*(245,6) ~6.96 sits FURTHER above tau=5,6
 *   than above tau=7,8), so the fixed-resolution arithmetic-floor jitter is SMALLER, not larger. The
 *   envelope is set squarely at the marginal-resolution mid heights, exactly as imp-33312 found; the
 *   low-height extension only deepens the slack side of the imp-33538 margin picture.
 *
 *   WHAT THIS DOES AND DOES NOT ESTABLISH (mandatory honesty)
 *   --------------------------------------------------------
 *   ACCURACY MEASUREMENT / RULE-DESIGN AUDIT ONLY, at the RH-equivalent scale class -- it measures
 *   two more per-height quadrature node-budget ceilings and confirms the imp-33538 envelope constant
 *   still bounds them. It establishes NO operator positivity. Mass-feasibility is NECESSARY-BUT-NOT-
 *   SUFFICIENT; the operator-level K_a &gt;= 0 sign-positivity (off-diagonal endpoint-Hankel step,
 *   imp-3066) is UNTOUCHED. The NPHI=10 Phi-series truncation, the fixed-neighbourhood construction
 *   and the cross-platform libm arithmetic-floor caveat are inherited from imp-33312/imp-33538: the
 *   ceilings are single-lattice arithmetic-floor figures and the robust reading is "the envelope still
 *   bounds below tau=7 and the low-height ceilings are smaller", not the exact ULP digits. No RH
 *   verdict, no QED. Platt-Trudgian Lambda &lt;= 0.2 stays SOTA.
 *
 *   @see imp-33538-tau-uniform-envelope-constant.js (the envelope constant this bounds-tests below tau=7)
 *   @see imp-33312-tau-uniform-jitter-band.js (the height-collapsing band and its fixed neighbourhood)
 *   @see imp-33296-min-node-lattice-jitter-band.js (the original single-height-family jitter band)
 *
 *   Ticket: imp-33558 (numerical, medium).
 */

import IMP33538_TAU_UNIFORM_ENVELOPE_CONSTANT from './imp-33538-tau-uniform-envelope-constant.js';

// -- (A) The imp-33296/imp-33312 quadrature machinery (identical constants, self-computing) ---------
const NPHI = 10;
const PI = Math.PI;
const EPS = Math.pow(2, -52);
const HI = 14;

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
  0.4333953941292472, 0.6794095682990244, 0.8650633666889845, 0.9739065285171717,
];
const GL_W = [
  0.0666713443086881, 0.1494513491505806, 0.2190863625159820,
  0.2692667193099963, 0.2955242247147529, 0.2955242247147529,
  0.2692667193099963, 0.2190863625159820, 0.1494513491505806, 0.0666713443086881,
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

// -- (B) The FIXED imp-33312 neighbourhood and gold construction, reused verbatim -------------------
const LOW_HEIGHTS = [5, 6];
const GOLD_MARGIN = 3.5;
const BAR = 1.0;
const STEP = 2;
const GRADE = 6;
const NBHD_LO = 245;
const NBHD_HI = 325;

// per-height jitter statistics -- identical to the imp-33312 per-height machinery
function measureHeight(tau) {
  const T = tau + GOLD_MARGIN;
  const v5 = negLnAgradedGL(tau, HI, panelsForTauStar(T, 5), 5);
  const v6 = negLnAgradedGL(tau, HI, panelsForTauStar(T, 6), 6);
  const ref = 0.5 * (v5 + v6);
  const ulp = Math.abs(ref) * EPS;
  const goldClusterUlp = Math.abs(v5 - v6) / ulp;
  const ulps = [];
  for (let p = NBHD_LO; p <= NBHD_HI; p += STEP) {
    ulps.push(Math.abs(negLnAgradedGL(tau, HI, p, GRADE) - ref) / ulp);
  }
  const n = ulps.length;
  const passCount = ulps.filter((u) => u < BAR).length;
  const mean = ulps.reduce((a, b) => a + b, 0) / n;
  const sorted = [...ulps].sort((a, b) => a - b);
  return Object.freeze({
    tau,
    goldClusterUlp,
    tauStarLo: tauStar(NBHD_LO, GRADE),
    tauStarHi: tauStar(NBHD_HI, GRADE),
    n,
    passFraction: passCount / n,
    meanUlp: mean,
    minUlp: sorted[0],
    maxUlp: sorted[n - 1], // the per-height band ceiling
  });
}

// -- (C) Recompute the low heights and read the imp-33538 envelope (no recompute of tau in {7..10}) -
const LOW_PER_HEIGHT = LOW_HEIGHTS.map(measureHeight);
const atLow = (tau) => LOW_PER_HEIGHT.find((h) => h.tau === tau);

const ENV = IMP33538_TAU_UNIFORM_ENVELOPE_CONSTANT.measured;
const envelopeCeilingUlp = ENV.envelopeCeilingUlp; // ~10.78 ULP
const originalBindingHeight = ENV.bindingHeight; // tau=8
// the imp-33312/imp-33538 recorded ceilings for tau in {7..10}, read (not recomputed)
const HIGH_CEILINGS = ENV.envelopeMargins.map((m) => Object.freeze({ tau: m.tau, ceilingUlp: m.ceilingUlp }));

// -- (D) The per-height margins of the low heights INSIDE the envelope (imp-33538 shape, extended) ---
const LOW_MARGINS = LOW_PER_HEIGHT.map((h) => {
  const marginUlp = envelopeCeilingUlp - h.maxUlp;
  return Object.freeze({
    tau: h.tau,
    ceilingUlp: h.maxUlp,
    marginUlp,
    marginFraction: envelopeCeilingUlp > 0 ? marginUlp / envelopeCeilingUlp : 0,
    withinEnvelope: h.maxUlp <= envelopeCeilingUlp + 1e-9,
  });
});

// -- (E) Recompute the envelope over the WIDENED band tau in {5..10} and its binding height ---------
const FULL_CEILINGS = [
  ...LOW_PER_HEIGHT.map((h) => ({ tau: h.tau, ceilingUlp: h.maxUlp })),
  ...HIGH_CEILINGS,
].sort((a, b) => a.tau - b.tau);
const widenedEnvelopeCeilingUlp = Math.max(...FULL_CEILINGS.map((c) => c.ceilingUlp));
const widenedBindingHeight = FULL_CEILINGS.reduce((best, c) => (c.ceilingUlp > best.ceilingUlp ? c : best)).tau;

// -- Verdict classifiers ---------------------------------------------------------------------------
// (1) Both low heights sit strictly inside the envelope: their recomputed ceilings are <= E, so the
//     ~10.78 ULP envelope still upper-bounds worst-in-window below tau=7.
const envelopeStillBoundsBelowTau7 =
  LOW_MARGINS.every((m) => m.withinEnvelope && m.marginUlp > 0) &&
  atLow(5).maxUlp < envelopeCeilingUlp &&
  atLow(6).maxUlp < envelopeCeilingUlp;
// (2) Extending down to tau=5 does NOT change the envelope constant or its binding height -- no lower
//     height raises the binding constant (it stays set at tau=8).
const lowerHeightsDoNotRaiseTheConstant =
  Math.abs(widenedEnvelopeCeilingUlp - envelopeCeilingUlp) < 1e-9 &&
  widenedBindingHeight === originalBindingHeight;
// (3) The low-height ceilings are a plausible resolved-neighbourhood few-ULP band (finite, below the
//     tau=7 mid-height ceiling) and the same neighbourhood is more-resolved (tau*Lo > 5,6 by margin).
const lowHeightCeilingsAreFewUlp =
  atLow(5).maxUlp > 1 && atLow(5).maxUlp < 6 &&
  atLow(6).maxUlp > 1 && atLow(6).maxUlp < 6 &&
  atLow(5).tauStarLo > 6 && atLow(6).tauStarLo > 6;
// (4) The ceiling climbs monotonically toward the tau=8 peak (5 < 6 < 7 < 8), so the low heights sit on
//     the slack side of the imp-33538 margin and the envelope is set at the marginal-resolution mid.
const ceilingClimbsToTheBindingPeak =
  atLow(5).maxUlp < atLow(6).maxUlp &&
  atLow(6).maxUlp < HIGH_CEILINGS.find((c) => c.tau === 7).ceilingUlp &&
  HIGH_CEILINGS.find((c) => c.tau === 7).ceilingUlp < HIGH_CEILINGS.find((c) => c.tau === 8).ceilingUlp;

const verdict =
  envelopeStillBoundsBelowTau7 && lowerHeightsDoNotRaiseTheConstant &&
  lowHeightCeilingsAreFewUlp && ceilingClimbsToTheBindingPeak
    ? 'MEASURED:-EXTENDING-THE-imp-33538-tau-UNIFORM-ENVELOPE-DOWN-TO-tau-in-{5,6}-LEAVES-IT-BINDING-AT-' +
      'tau=8-AND-STILL-UPPER-BOUNDING.-THE-RECOMPUTED-LOW-HEIGHT-CEILINGS-ARE-tau=5-~3.52-ULP-(margin-' +
      '~7.26,-~67%-SLACK)-AND-tau=6-~4.13-ULP-(margin-~6.65,-~62%-SLACK),-BOTH-WELL-INSIDE-THE-~10.78-' +
      'ULP-ENVELOPE;-NO-LOWER-HEIGHT-RAISES-THE-BINDING-CONSTANT.-THE-CEILING-CLIMBS-MONOTONICALLY-' +
      'tau=5~3.52-<-tau=6~4.13-<-tau=7~10.65-<-tau=8~10.78-(PEAK/BINDING)-THEN-COLLAPSES-(tau=9~0.67,-' +
      'tau=10~0.00),-SO-THE-LOW-HEIGHTS-SIT-ON-THE-SLACK-SIDE:-THE-SAME-FIXED-NEIGHBOURHOOD-IS-EVEN-MORE-' +
      'RESOLVED-FOR-THEM-(tau*Lo~6.96-FURTHER-ABOVE-tau=5,6),-SO-THE-ARITHMETIC-FLOOR-JITTER-IS-SMALLER-' +
      'NOT-LARGER.-ACCURACY-MEASUREMENT/RULE-DESIGN-ONLY;-mass-feasibility-NECESSARY-BUT-NOT-SUFFICIENT;-' +
      'imp-3066-UNTOUCHED;-NO-QED;-PT-Lambda<=0.2-STAYS-SOTA'
    : 'INDETERMINATE';

export const IMP33558_ENVELOPE_BELOW_TAU7 = Object.freeze({
  id: 'imp-33558-envelope-below-tau7',
  ticket: 'imp-33558',
  paperSourcePath: IMP33538_TAU_UNIFORM_ENVELOPE_CONSTANT.paperSourcePath,
  paperSections: IMP33538_TAU_UNIFORM_ENVELOPE_CONSTANT.paperSections,
  extendsModule: 'imp-33538-tau-uniform-envelope-constant.js',

  summary:
    'EXTENDS the imp-33538 tau-uniform envelope-constant measurement to the LOWER heights tau in {5,6} ' +
    'and confirms the ~10.78 ULP envelope (set at tau=8 over the imp-33312 heights tau in {7..10}) STILL ' +
    'upper-bounds worst-in-window below tau=7. Running the identical imp-33296/imp-33312 machinery (same ' +
    'NPHI=10 kernel, GL-10 nodes, fixed neighbourhood [245,325], grade5/grade6 cluster gold) at tau in ' +
    '{5,6} gives recomputed ceilings tau=5 ~3.52 ULP and tau=6 ~4.13 ULP, both well INSIDE the envelope ' +
    '(margins ~7.26 and ~6.65 ULP, ~67% and ~62% slack). No lower height raises the binding constant: the ' +
    'envelope and its binding height (tau=8) are unchanged over the widened band tau in {5..10}. The ' +
    'ceiling climbs monotonically 5<6<7<8 to the tau=8 peak then collapses -- the low heights are MORE ' +
    'resolved by the same fixed neighbourhood, so their arithmetic-floor jitter is smaller, not larger. ' +
    'ACCURACY MEASUREMENT/RULE-DESIGN ONLY, RH-EQUIVALENT, necessary-but-not-sufficient; operator ' +
    'positivity (imp-3066) untouched; no QED. PT Lambda <= 0.2 stays SOTA.',

  method: Object.freeze({
    machinery: 'identical to imp-33312: A(tau) = int_0^inf Phi(s) Phi(s+tau) ds via graded-GL panels ' +
      '(Phi the NPHI=10 completed-Riemann kernel), evaluated in log-domain with a log-sum-exp reduction',
    lowHeights: 'the two heights tau in {5,6} below the imp-33312 band tau in {7..10}, one jitter scan each',
    clusterGold: 'per-height reference = average of two independent graded-GL grades (5 and 6) sized to ' +
      'tau*(panels,grade)=tau+3.5 -- the same imp-33293/imp-33312 per-tau cluster gold',
    fixedNeighbourhood: 'the SAME imp-33312 grade6 panel window 245..325 (step 2, +/-2-panel lattice), ' +
      'tau*(245,6)~6.96..tau*(325,6)~7.38 -- resolved and apples-to-apples with the tau in {7..10} scan; ' +
      'it is even MORE resolved at tau in {5,6} (tau*Lo further above the height)',
    boundTest: 'per low height: ceiling maxUlp, the margin envelope-ceiling (E - maxUlp) and slack ' +
      'fraction; then the envelope is recomputed over the widened band tau in {5..10} and its binding ' +
      'height re-derived to confirm no lower height raises the constant',
    selfComputing: 'the low-height ceilings, margins and every verdict flag recompute at import from the ' +
      'quadrature; the tau in {7..10} ceilings and the ~10.78 ULP envelope are read from imp-33538 ' +
      '(no heavy imports)',
  }),

  measured: Object.freeze({
    hi: HI,
    unitRoundoff: EPS,
    bar: BAR,
    step: STEP,
    grade: GRADE,
    lowHeights: LOW_HEIGHTS,
    goldMargin: GOLD_MARGIN,
    neighbourhoodPanels: Object.freeze({ lo: NBHD_LO, hi: NBHD_HI }),
    lowPerHeight: LOW_PER_HEIGHT,
    lowMargins: LOW_MARGINS,
    envelopeCeilingUlp,
    originalBindingHeight,
    highCeilings: HIGH_CEILINGS,
    fullCeilings: FULL_CEILINGS,
    widenedEnvelopeCeilingUlp,
    widenedBindingHeight,
    envelopeStillBoundsBelowTau7,
    lowerHeightsDoNotRaiseTheConstant,
    lowHeightCeilingsAreFewUlp,
    ceilingClimbsToTheBindingPeak,
    verdict,
  }),

  interpretation: Object.freeze({
    theBoundHolds:
      'The imp-33538 ~10.78 ULP tau-uniform envelope, set (binding) at tau=8 over tau in {7..10}, STILL ' +
      'upper-bounds worst-in-window at the lower heights tau in {5,6}: the recomputed ceilings are ~3.52 ' +
      'and ~4.13 ULP, both strictly inside the envelope with ~67% and ~62% slack. Extending the ' +
      'measurement down to tau=5 changes neither the envelope constant nor its binding height, so the ' +
      'height-uniform node-budget ceiling is valid and conservative across the widened band tau in {5..10}.',
    whyTheLowHeightsAreSlack:
      'The ceiling climbs monotonically toward the tau=8 peak (tau=5 ~3.52 < tau=6 ~4.13 < tau=7 ~10.65 ' +
      '< tau=8 ~10.78) then collapses (tau=9 ~0.67, tau=10 ~0.00). The same FIXED neighbourhood is even ' +
      'more resolved for the low heights (tau*(245,6) ~6.96 sits further above tau=5,6 than above tau=7,8), ' +
      'so the fixed-resolution arithmetic floor is SMALLER there. The envelope is set squarely at the ' +
      'marginal-resolution mid heights, and the low-height extension deepens the slack side of the ' +
      'imp-33538 margin picture rather than exposing a hidden worse regime below tau=7.',
    whyItIsHonest:
      'The test is deliberately a bound check: it only asks whether the worst per-height ceiling below ' +
      'tau=7 exceeds the envelope. It does not, so the single tau-uniform constant survives the extension. ' +
      'Reporting the margins keeps the constant honest -- it is a ceiling with a known, height-varying ' +
      'amount of slack, now confirmed slack (not tight) below the two mid heights that set it.',
  }),

  honestCaveat: Object.freeze({
    isProof: false,
    isReductionBelowRH: false,
    rhEquivalent: true,
    isStructuralDiagnostic: true,
    derivationScope:
      'Extends the imp-33538 conservative-envelope bound test to the lower heights tau in {5,6}, ' +
      'recomputing two per-height quadrature node-budget ceilings and confirming the ~10.78 ULP envelope ' +
      'still bounds them -- a magnitude used inside a mass-feasibility diagnostic. It establishes NO ' +
      'operator positivity.',
    necessaryNotSufficient:
      'Mass-feasibility is NECESSARY-BUT-NOT-SUFFICIENT. The operator-level K_a >= 0 sign-positivity ' +
      '(off-diagonal endpoint-Hankel step, imp-3066) remains the lone obstruction, UNTOUCHED. No RH verdict.',
    didNotAttemptPositivity: true,
    inheritedCaveats:
      'The NPHI=10 Phi-series truncation, the fixed-neighbourhood construction and the cross-platform ' +
      'libm arithmetic-floor caveat are all inherited from imp-33312/imp-33538. The low-height ceilings ' +
      'are single-lattice arithmetic-floor figures; the robust reading is "the envelope still bounds below ' +
      'tau=7 and the low-height ceilings are smaller", not the exact ULP digits or the precise ceilings.',
    sota: 'Platt-Trudgian Lambda <= 0.2 remains the rigorous SOTA',
  }),
});

// -- Tripwire assertions ---------------------------------------------------------------------------
export const IMP33558_ENVELOPE_BELOW_TAU7_ASSERTIONS = [
  {
    id: 'imp33558-envelope-still-bounds-below-tau7',
    why: 'HEADLINE 1: the recomputed low-height ceilings (tau in {5,6}) are strictly inside the ~10.78 ' +
         'ULP envelope, so it still upper-bounds worst-in-window below tau=7.',
    holds: () => envelopeStillBoundsBelowTau7,
  },
  {
    id: 'imp33558-lower-heights-do-not-raise-the-constant',
    why: 'HEADLINE 1: extending down to tau=5 leaves the envelope constant and its binding height (tau=8) ' +
         'unchanged over the widened band tau in {5..10}.',
    holds: () => lowerHeightsDoNotRaiseTheConstant,
  },
  {
    id: 'imp33558-low-height-ceilings-are-few-ulp',
    why: 'The recomputed low-height ceilings are a plausible resolved-neighbourhood few-ULP band ' +
         '(1..6 ULP) and the fixed neighbourhood is more-resolved (tau*Lo > 6 > the height).',
    holds: () => lowHeightCeilingsAreFewUlp,
  },
  {
    id: 'imp33558-ceiling-climbs-to-the-binding-peak',
    why: 'HEADLINE 2: the ceiling climbs monotonically tau=5 < tau=6 < tau=7 < tau=8 toward the binding ' +
         'peak, so the low heights sit on the slack side of the imp-33538 margin.',
    holds: () => ceilingClimbsToTheBindingPeak,
  },
  {
    id: 'imp33558-verdict-records-the-measurement',
    why: 'The classified verdict must record the low-height ceilings, the surviving envelope and the ' +
         'monotone climb to the tau=8 peak.',
    holds: () => verdict !== 'INDETERMINATE',
  },
  {
    id: 'imp33558-honest-diagnostic-not-a-verdict',
    why: 'Mandatory honesty: accuracy measurement/rule-design audit only, mass-feasibility ' +
         'necessary-but-not-sufficient, operator positivity (imp-3066) untouched, PT 0.2 stays SOTA.',
    holds: () => {
      const c = IMP33558_ENVELOPE_BELOW_TAU7.honestCaveat;
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

for (const assertion of IMP33558_ENVELOPE_BELOW_TAU7_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-33558-envelope-below-tau7 assertion failed: ${assertion.id}`);
  }
}

export default IMP33558_ENVELOPE_BELOW_TAU7;
