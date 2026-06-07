// @module imp-2497-esy-highest-leverage-input-availability-audit
// imp-2497 (improvement for ticket imp-370, high, proof): AVAILABILITY audit of
// the single highest-leverage research input identified by the imp-2491 coupling
// matrix. imp-2491 concludes that the best single lever for closing imp-370
// angle (b) is the "Quantitative GUE-equidistribution / Bourgade rigidity for
// {gamma_k}" input, which it credits with closing O3 fully and O1 partially
// (leverage 2). imp-2491 ASSUMES that idealized input as a black box and asks
// how many such inputs are needed. This audit asks the prior, complementary
// question: is that highest-leverage input AVAILABLE TODAY, or does the
// idealized input itself decompose into a proven part plus an open part?
//
// QUESTION
// --------
// The "GUE-equidistribution input" is not a single theorem; it is a tower of
// n-level correlation / equidistribution statements for the zeros {gamma_k}.
// What is actually PROVEN today, and how far short of the ESY rigidity
// requirement does it fall?
//
// HEADLINE VERDICT
// ----------------
// VERDICT: 'highest-leverage-input-only-available-restricted-support-conditional'
//
// The arithmetic equidistribution input the coupling matrix recommends is, in
// its currently-proven form, BOTH (a) restricted to test functions of limited
// Fourier support and (b) conditional on RH / GRH. Montgomery (1973) gives the
// PAIR (2-level) correlation only for test functions whose Fourier transform is
// supported in (-1, 1), and conditionally on RH. Rudnick-Sarnak (1996) extends
// to n-level correlations but only for test functions with restricted support
// (the sum of the support half-widths bounded below 1), again conditionally on
// GRH. ESY local-spacing rigidity, by contrast, requires control at ALL scales
// (effectively unrestricted-support n-level information probing the microscopic
// local-spacing indicator at k_{max} ~ log(gamma_N)), and UNCONDITIONALLY. So
// the idealized GUE-equidistribution input that imp-2491 credits with closing
// O3 in full is STRICTLY STRONGER than anything proven today: the proven inputs
// are support-restricted and conditional, the needed input is unrestricted and
// unconditional. The distance-to-closure on the arithmetic axis is therefore
// nonzero even before the orthogonal O2 (PDE) input is considered.
//
// RELATION TO PRIOR imp-370 AUDITS (refines, does not contradict, imp-2491)
// ------------------------------------------------------------------------
// imp-508 (esy-o1-closure.js)  -- O1 partial closure, residual C_{poly} < 1.
// imp-2492 (O2 backward-flow)  -- O2 ill-posed backward heat equation.
// imp-2493 (O3 derandomization)-- O3 measure-1 set can exclude the fixed point.
// imp-2491 (coupling matrix)   -- joins O1/O2/O3; names GUE-equidistribution the
//   highest-leverage input (leverage 2) and gives the >= 2 independent-inputs
//   lower bound, ASSUMING the idealized input exists.
// THIS audit (imp-2497)        -- decomposes that highest-leverage input into
//   proven (Montgomery 2-level restricted/conditional; Rudnick-Sarnak n-level
//   restricted/conditional) vs needed (unrestricted, all-scales, unconditional),
//   and pins the residual gap. It REFINES imp-2491: imp-2491 marks the idealized
//   input as closing O3 in full; this audit notes that input is not the
//   currently-available one, so the route stays conditional even on the
//   arithmetic axis alone.
//
// SYNTAX SAFETY: no star-slash sequences inside comments; single-quoted strings
// contain no apostrophes; subscripts written as k_{max} in prose.
//
// @see imp-370   -- the ticket (close imp-348 angle (b) via local-law rigidity)
// @see imp-407   -- esy-rigidity-port.js (approachSuggestions; OPEN_SUB_GAPS)
// @see imp-2491  -- esy-obstacle-coupling-matrix.js (names this the top lever)
// @see imp-2493  -- O3 derandomization audit (the obstacle this input targets)

// =========================================================================
// SECTION (a) -- The proven equidistribution inputs and their limits.
// =========================================================================
//
// Each row records: the correlation LEVEL it controls, whether its test-function
// Fourier SUPPORT is restricted, and whether it is CONDITIONAL on RH / GRH.
// supportHalfWidthProven is an illustrative numeric handle on the restriction:
// Montgomery is established for pair correlation with support in (-1, 1), i.e.
// half-width up to 1; Rudnick-Sarnak n-level needs the support half-widths to
// sum below 1, so the per-function effective half-width is strictly below 1.

const PROVEN_INPUTS = Object.freeze({
  montgomeryPairCorrelation: {
    name: 'Montgomery 1973 pair-correlation for the zeros',
    correlationLevel: 2,
    supportRestricted: true,
    supportHalfWidthProven: 1.0, // F(alpha) controlled for |alpha| < 1 (conditional on RH).
    conditional: true,
    condition: 'RH',
    status: 'proven-restricted',
  },
  rudnickSarnakNLevel: {
    name: 'Rudnick-Sarnak 1996 n-level correlation for the zeros',
    correlationLevel: 'n (restricted support)',
    supportRestricted: true,
    supportHalfWidthProven: 0.5, // n-level proven only when summed support half-widths < 1.
    conditional: true,
    condition: 'GRH',
    status: 'proven-restricted',
  },
});

// =========================================================================
// SECTION (b) -- The input ESY rigidity actually requires.
// =========================================================================
//
// ESY local-rigidity needs n-level / all-scales control of the empirical zero
// measure at the MICROSCOPIC scale, with UNRESTRICTED test functions (it must
// resolve the local-spacing indicator at the inverse mean spacing k_{max} ~
// log(gamma_N)), and UNCONDITIONALLY (the port aims at an unconditional bound,
// not one resting on RH / GRH). supportHalfWidthNeeded is set above the proven
// thresholds to encode "unrestricted".

const NEEDED_INPUT = Object.freeze({
  name: 'Unconditional all-scales n-level rigidity for {gamma_k} (unrestricted support)',
  correlationLevel: 'all (n-level, unrestricted support)',
  supportRestricted: false,
  supportHalfWidthNeeded: 2.0, // strictly exceeds the proven thresholds (1.0, 0.5): unrestricted.
  conditional: false, // the port targets an UNCONDITIONAL bound.
  role: 'resolves the microscopic local-spacing indicator at k_{max} ~ log(gamma_N)',
});

// =========================================================================
// SECTION (c) -- The availability gap (numeric witnesses).
// =========================================================================
//
// The gap is two-dimensional: (1) SUPPORT -- the needed half-width strictly
// exceeds the best proven half-width; (2) CONDITIONALITY -- every proven input
// rests on RH / GRH, whereas the needed input must be unconditional. Both
// coordinates are strictly positive, so the highest-leverage input is NOT
// available today.

const bestProvenSupportHalfWidth = Math.max(
  PROVEN_INPUTS.montgomeryPairCorrelation.supportHalfWidthProven,
  PROVEN_INPUTS.rudnickSarnakNLevel.supportHalfWidthProven,
); // = 1.0

const AVAILABILITY_GAP = Object.freeze({
  // Support gap: needed minus best-proven half-width. > 0 means unrestricted is
  // not reached by the proven restricted-support results.
  supportHalfWidthGap: NEEDED_INPUT.supportHalfWidthNeeded - bestProvenSupportHalfWidth, // = 1.0 > 0
  bestProvenSupportHalfWidth,
  neededSupportHalfWidth: NEEDED_INPUT.supportHalfWidthNeeded,
  // Conditionality gap: count of proven inputs that rest on RH / GRH. Every
  // proven input is conditional, so this equals the number of proven inputs.
  conditionalProvenInputCount: Object.values(PROVEN_INPUTS).filter((i) => i.conditional === true).length,
  totalProvenInputCount: Object.values(PROVEN_INPUTS).length,
  // The needed input is unconditional; no proven input matches that requirement.
  unconditionalProvenInputExists: Object.values(PROVEN_INPUTS).some((i) => i.conditional === false),
});

// =========================================================================
// SECTION (d) -- Named sub-gap (honest residual), anchored to the O1/O3 axis.
// =========================================================================

const NAMED_SUBGAP = Object.freeze({
  id: 'imp-2497-sub-highest-leverage-input-restricted-conditional',
  // The arithmetic-axis sub-gaps the highest-leverage input spans (per imp-2491).
  anchorsExistingSubGaps: Object.freeze(['esy-port-O1-unconditional-rigidity', 'esy-port-O3-derandomization']),
  highestLeverageInput: 'gueEquidistribution', // matches imp-2491 highestLeverageInput.
  label:
    'The highest-leverage arithmetic input (GUE-equidistribution / Bourgade ' +
    'rigidity for {gamma_k}) is available today only in restricted-support, ' +
    'conditional form (Montgomery 2-level, support < 1, RH; Rudnick-Sarnak ' +
    'n-level, restricted support, GRH) -- short of the unrestricted, all-scales, ' +
    'unconditional rigidity ESY requires',
  detail:
    'imp-2491 credits the GUE-equidistribution input with closing O3 in full ' +
    'and O1 partially (leverage 2), assuming it as a black box. Decomposing it: ' +
    'what is proven (Montgomery pair correlation for support in (-1,1) under RH; ' +
    'Rudnick-Sarnak n-level for restricted support under GRH) is both support-' +
    'restricted and conditional, while ESY rigidity needs unrestricted all-scales ' +
    'n-level control resolving the local spacing at k_{max} ~ log(gamma_N), ' +
    'unconditionally. The residual is the gap between restricted-conditional and ' +
    'unrestricted-unconditional n-level equidistribution -- itself research-grade ' +
    'open (it is the quantitative GUE-equidistribution conjecture for the zeros).',
  severity: 'critical',
  isResearchGrade: true,
  closesIf:
    'An unconditional, unrestricted-support n-level correlation / equidistribution ' +
    'theorem for {gamma_k} is established (removing both the support restriction ' +
    'and the RH / GRH hypothesis from Montgomery / Rudnick-Sarnak). Open; this is ' +
    'the quantitative GUE-equidistribution conjecture, expected to be at ' +
    'RH-level difficulty.',
});

const VERDICT = 'highest-leverage-input-only-available-restricted-support-conditional';

// =========================================================================
// FROZEN EXPORTED RECORD
// =========================================================================

export const IMP2497_ESY_HIGHEST_LEVERAGE_INPUT_AVAILABILITY_AUDIT = Object.freeze({
  id: 'imp-2497',
  ticket: 'imp-370',
  refines: 'imp-2491', // the coupling matrix that names this the highest-leverage input.
  axis: 'arithmetic-axis input-availability (proven restricted/conditional vs needed unrestricted/unconditional)',
  question:
    'imp-2491 names the GUE-equidistribution input the highest-leverage lever ' +
    '(closes O1 partial + O3 full) and assumes it as a black box. Is that input ' +
    'available today, or does it decompose into a proven restricted/conditional ' +
    'part plus an open unrestricted/unconditional part?',
  provenInputs: PROVEN_INPUTS,
  neededInput: NEEDED_INPUT,
  availabilityGap: AVAILABILITY_GAP,
  namedSubGap: NAMED_SUBGAP,
  verdict: VERDICT,
  highestLeverageInputAvailableToday: false,
  refinesCouplingMatrix:
    'imp-2491 treats the GUE-equidistribution input as a single available black ' +
    'box closing O3 in full. This audit decomposes it: the currently-proven ' +
    'forms (Montgomery 2-level, Rudnick-Sarnak n-level) are support-restricted ' +
    'AND conditional on RH / GRH, whereas the input ESY needs is unrestricted, ' +
    'all-scales, and unconditional. So the highest-leverage lever is itself not ' +
    'available today; the arithmetic-axis distance-to-closure is nonzero before ' +
    'the orthogonal O2 (PDE) input is even considered. This sharpens, and does ' +
    'not contradict, the imp-2491 leverage-2 black-box accounting.',
  honestScope: Object.freeze([
    'This audit does NOT close O1, O3, the highest-leverage input, or imp-370 ' +
    'angle (b). It establishes that the single best lever named by imp-2491 is, ' +
    'in its currently-proven form, support-restricted and conditional on RH / GRH ' +
    '-- strictly weaker than the unrestricted, unconditional, all-scales n-level ' +
    'rigidity ESY requires.',
    'The decisive structural facts are the two gap coordinates: (1) SUPPORT -- ' +
    'the needed test-function Fourier half-width (unrestricted) strictly exceeds ' +
    'the best proven half-width (Montgomery up to 1; Rudnick-Sarnak below 1); ' +
    '(2) CONDITIONALITY -- every proven input rests on RH / GRH, while the port ' +
    'targets an unconditional bound, so no proven input meets the requirement. ' +
    'The numeric half-width handles (1.0, 0.5 proven vs 2.0 needed) are ' +
    'qualitative illustrations of the restricted-vs-unrestricted signature, not ' +
    'sharp constants from the literature.',
    'Named sub-gap imp-2497-sub-highest-leverage-input-restricted-conditional ' +
    'records the residual and anchors BOTH arithmetic-axis sub-gaps ' +
    '(esy-port-O1-unconditional-rigidity and esy-port-O3-derandomization) that ' +
    'imp-2491 says this input spans: closing it needs an unconditional, ' +
    'unrestricted-support n-level equidistribution theorem for {gamma_k}, which ' +
    'is the quantitative GUE-equidistribution conjecture -- open. O1 residual, ' +
    'O2, O3 remain research-grade open; the route stays conditional.',
  ]),
  parallelTickets: Object.freeze(['imp-370', 'imp-407', 'imp-508', 'imp-2491', 'imp-2493']),
});

export default IMP2497_ESY_HIGHEST_LEVERAGE_INPUT_AVAILABILITY_AUDIT;

// =========================================================================
// BUILD-TIME TRIPWIRES
// =========================================================================

export const IMP2497_ESY_HIGHEST_LEVERAGE_INPUT_AVAILABILITY_AUDIT_ASSERTIONS = [
  {
    id: 'imp2497-verdict-input-not-available-today',
    holds: () =>
      IMP2497_ESY_HIGHEST_LEVERAGE_INPUT_AVAILABILITY_AUDIT.verdict ===
        'highest-leverage-input-only-available-restricted-support-conditional' &&
      IMP2497_ESY_HIGHEST_LEVERAGE_INPUT_AVAILABILITY_AUDIT.highestLeverageInputAvailableToday === false,
    why:
      'The audit conclusion is that the highest-leverage GUE-equidistribution ' +
      'input is NOT available today in the form ESY needs. Flipping the verdict ' +
      'or highestLeverageInputAvailableToday to true without exhibiting an ' +
      'unconditional unrestricted-support n-level theorem would silently overclaim ' +
      'that the top lever is in hand, collapsing the imp-370 distance-to-closure.',
  },
  {
    id: 'imp2497-support-gap-strictly-positive',
    holds: () => {
      const g = IMP2497_ESY_HIGHEST_LEVERAGE_INPUT_AVAILABILITY_AUDIT.availabilityGap;
      // Needed unrestricted half-width must strictly exceed the best proven one.
      return (
        g.supportHalfWidthGap > 0 &&
        g.neededSupportHalfWidth > g.bestProvenSupportHalfWidth &&
        g.bestProvenSupportHalfWidth > 0
      );
    },
    why:
      'The SUPPORT coordinate of the availability gap must stay strictly ' +
      'positive: the proven equidistribution results (Montgomery, Rudnick-Sarnak) ' +
      'are restricted to limited Fourier support, while ESY needs unrestricted ' +
      'test functions. Closing the gap to zero here would assert unrestricted ' +
      'n-level control is already proven, which it is not.',
  },
  {
    id: 'imp2497-every-proven-input-is-conditional',
    holds: () => {
      const g = IMP2497_ESY_HIGHEST_LEVERAGE_INPUT_AVAILABILITY_AUDIT.availabilityGap;
      const proven = Object.values(IMP2497_ESY_HIGHEST_LEVERAGE_INPUT_AVAILABILITY_AUDIT.provenInputs);
      // All proven inputs rest on RH / GRH; none is unconditional.
      return (
        g.conditionalProvenInputCount === g.totalProvenInputCount &&
        g.totalProvenInputCount === proven.length &&
        g.unconditionalProvenInputExists === false &&
        proven.every((i) => i.conditional === true)
      );
    },
    why:
      'The CONDITIONALITY coordinate: every currently-proven equidistribution ' +
      'input rests on RH / GRH, while the rigidity port targets an UNCONDITIONAL ' +
      'bound. Marking any proven input unconditional, or asserting an ' +
      'unconditional proven input exists, would falsely close the conditionality ' +
      'half of the availability gap.',
  },
  {
    id: 'imp2497-needed-input-strictly-stronger-than-proven',
    holds: () => {
      const r = IMP2497_ESY_HIGHEST_LEVERAGE_INPUT_AVAILABILITY_AUDIT;
      const proven = Object.values(r.provenInputs);
      // The needed input is unrestricted (supportRestricted false) and
      // unconditional; every proven input is restricted and conditional.
      return (
        r.neededInput.supportRestricted === false &&
        r.neededInput.conditional === false &&
        proven.every((i) => i.supportRestricted === true && i.conditional === true)
      );
    },
    why:
      'The needed input must remain strictly stronger than every proven input on ' +
      'both axes (unrestricted + unconditional vs restricted + conditional). If ' +
      'the needed input were marked restricted or conditional, or a proven input ' +
      'were marked unrestricted/unconditional, the strict-strengthening that ' +
      'makes the highest-leverage lever unavailable would be erased.',
  },
  {
    id: 'imp2497-subgap-critical-anchors-O1-and-O3',
    holds: () => {
      const g = IMP2497_ESY_HIGHEST_LEVERAGE_INPUT_AVAILABILITY_AUDIT.namedSubGap;
      return (
        g.severity === 'critical' &&
        g.isResearchGrade === true &&
        g.highestLeverageInput === 'gueEquidistribution' &&
        Array.isArray(g.anchorsExistingSubGaps) &&
        g.anchorsExistingSubGaps.includes('esy-port-O1-unconditional-rigidity') &&
        g.anchorsExistingSubGaps.includes('esy-port-O3-derandomization')
      );
    },
    why:
      'The honest residual is a critical research-grade sub-gap that anchors BOTH ' +
      'arithmetic-axis sub-gaps the highest-leverage input spans per imp-2491 ' +
      '(O1 and O3), and tags the same highestLeverageInput key. Demoting its ' +
      'severity / research-grade status, dropping either anchor, or renaming the ' +
      'input key would either overclaim progress or sever the link to imp-2491.',
  },
  {
    id: 'imp2497-refines-not-contradicts-coupling-matrix',
    holds: () => {
      const r = IMP2497_ESY_HIGHEST_LEVERAGE_INPUT_AVAILABILITY_AUDIT;
      // This audit must be framed as a refinement of imp-2491, not a closure.
      return (
        r.refines === 'imp-2491' &&
        r.highestLeverageInputAvailableToday === false &&
        r.namedSubGap.highestLeverageInput === 'gueEquidistribution'
      );
    },
    why:
      'This audit refines imp-2491 (which assumes the idealized input as a black ' +
      'box) by showing the input is not available today; it must not be reframed ' +
      'as closing the input or the ticket. Breaking the refines link or asserting ' +
      'availability would desynchronize this audit from the coupling matrix it ' +
      'sharpens.',
  },
];
