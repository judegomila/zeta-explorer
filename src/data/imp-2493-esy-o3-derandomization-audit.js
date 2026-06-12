// @module imp-2493-esy-o3-derandomization-audit
// imp-2493 (improvement for ticket imp-370, high, proof): sharpen obstacle O3
// of the ESY rigidity port -- the HIGH-PROBABILITY vs DETERMINISTIC transfer --
// from the vague "requires a derandomization argument" framing in
// esy-rigidity-port.js (obstacle3) into a PRECISE, citable obstruction: the
// measure-vs-indicator gap, closable only by the (open) equidistribution /
// Bourgade-Montgomery-Dyson identification of the zeros with the GUE ensemble.
//
// QUESTION (the O3 obstacle, as posed by imp-370 / imp-407)
// ---------------------------------------------------------
// esy-rigidity-port.js obstacle3 says: ESY rigidity holds with PROBABILITY
// 1 - N^{-c} over the Wigner / GUE ENSEMBLE. The Koksma-Hlawka / Burgers chain
// in this codebase needs a DETERMINISTIC bound D_N^star <= f(N) for the single
// fixed sequence of Riemann-zero ordinates {gamma_k}. The current obstacle text
// only states that converting "holds with high probability for a random matrix"
// to "holds for this specific deterministic sequence" needs a derandomization
// argument that "does not currently exist for zeros". This audit pins WHY the
// gap is structural, not merely unproven.
//
// HEADLINE VERDICT
// ----------------
// VERDICT: 'esy-o3-high-prob-does-not-derandomize-without-equidistribution'
//
// A high-probability statement P(bad_N) <= N^{-c} asserts that the GOOD SET
// G_N (matrices satisfying rigidity at scale N) carries ensemble measure
// mu(G_N) = 1 - N^{-c} -> 1. But a measure-theoretic statement of size 1 - eps
// -- even of FULL measure 1 -- conveys ZERO deterministic information about any
// PRESCRIBED point: a full-measure subset of a probability space can still
// exclude any named element (canonical witness: the irrationals have Lebesgue
// measure 1 in [0,1] yet contain no rational, so the named point 1/2 lies
// OUTSIDE a measure-1 set). The Riemann zeros are ONE fixed deterministic
// sequence -- a single named point in the matrix configuration space -- with no
// ensemble to average over and no parameter to union-bound across. Certifying
// that {gamma_k} lies in G_N therefore needs an EQUIDISTRIBUTION input proving
// the zero sequence is a "generic / typical" sample of the GUE law: the
// Montgomery-Dyson pair-correlation identification, in its quantitative
// Bourgade / Rudnick-Sarnak form. That input is itself OPEN and is essentially
// the GUE conjecture for the zeta zeros, so O3 does not derandomize from ESY
// alone.
//
// RELATION TO PRIOR O-AUDITS (orthogonal axes; all three obstacles stay open)
// ---------------------------------------------------------------------------
// imp-508 (esy-o1-closure.js)  -- partially closed O1 (the arithmetic /
//   concentration input), residual sub-gap esy-port-O1-remaining-concentration.
// imp-2492 (imp-2492-...o2...)  -- obstacle O2, the FLOW-DIRECTION axis: forward
//   dissipative DBM vs backward ill-posed de Bruijn collision flow.
// THIS audit (imp-2493)        -- obstacle O3, the PROBABILISTIC-vs-DETERMINISTIC
//   axis: a measure-1 ensemble statement does not certify one fixed sequence.
// These are independent: closing any one does not close the others. O2 and O3
// remain research-grade open; imp-370 angle (b) is NOT closed by this audit.
//
// SYNTAX SAFETY: no star-slash sequences inside comments; single-quoted strings
// contain no apostrophes; subscripts written as G_{N} / k_{max} in prose.
//
// @see imp-370   -- the ticket (close imp-348 angle (b) via local-law rigidity)
// @see imp-407   -- esy-rigidity-port.js, where O1/O2/O3 are defined (obstacle3)
// @see imp-508   -- esy-o1-closure.js (O1 partial closure, orthogonal axis)
// @see imp-2492  -- O2 backward-flow ill-posedness audit (flow-direction axis)

// =========================================================================
// SECTION (a) -- The two kinds of statement and why one does not imply the other.
// =========================================================================
//
// ESY (ENSEMBLE / high-probability): for a random N x N Wigner matrix H drawn
// from the ensemble, P_H( max_k |lambda_k - gamma_k^{sc}| >= rate_N ) <= N^{-c}.
// This is a statement about the MEASURE of a subset of matrix space.
//
// CODEBASE NEED (DETERMINISTIC / pointwise): for the SINGLE fixed sequence of
// Riemann-zero ordinates {gamma_k}, the discrepancy D_N^star({gamma_k}) <= f(N)
// must hold as an INDICATOR (1_{G_N} evaluated at one named point = 1), not as
// a measure. The chasm between "mu(G_N) = 1 - N^{-c}" and "1_{G_N}(point) = 1"
// is the O3 obstruction.

const STATEMENT_TYPES = Object.freeze({
  esyEnsemble: {
    name: 'ESY high-probability rigidity over the Wigner / GUE ensemble',
    form: 'P_H( bad_N ) <= N^{-c}, i.e. ensemble measure mu(G_N) = 1 - N^{-c}',
    quantifier: 'for ALMOST EVERY sample H of the ensemble',
    isMeasure: true,
    certifiesNamedPoint: false,
    role: 'controls the typical sample; says nothing about one prescribed sequence',
  },
  codebaseDeterministic: {
    name: 'deterministic discrepancy bound for the fixed zero sequence',
    form: 'D_N^star({gamma_k}) <= f(N), i.e. indicator 1_{G_N}({gamma_k}) = 1',
    quantifier: 'for THE specific deterministic sequence {gamma_k}',
    isMeasure: false,
    certifiesNamedPoint: true,
    role: 'what the Koksma-Hlawka / Burgers collision-time chain actually consumes',
  },
});

// =========================================================================
// SECTION (b) -- The measure-vs-indicator gap (decisive numeric witness).
// =========================================================================
//
// Canonical, elementary witness that FULL measure does not certify a named
// point: the irrationals I = [0,1] \ Q have Lebesgue measure 1, yet contain no
// rational. So for the named point 1/2 (rational), the indicator 1_I(1/2) = 0
// even though mu(I) = 1. Measure 1 -- the strongest possible high-probability
// statement -- gives ZERO deterministic guarantee for a prescribed point. The
// ESY good set G_N has measure only 1 - N^{-c} < 1, strictly weaker than this
// already-insufficient full-measure case, so a fortiori it cannot certify the
// fixed point {gamma_k} without extra input.

const FULL_MEASURE_SET_MISSES_NAMED_POINT = Object.freeze({
  set: 'irrationals I = [0,1] minus Q',
  lebesgueMeasure: 1, // mu(I) = 1
  namedPoint: '1/2 (rational)',
  indicatorAtNamedPoint: 0, // 1_I(1/2) = 0: the point is OUTSIDE the measure-1 set
  lesson:
    'A measure-1 (probability-1) set can still exclude any prescribed point. ' +
    'Hence a high-probability ensemble statement, even at probability exactly 1, ' +
    'does not certify membership of one named deterministic configuration.',
});

// Quantitative ESY-side witnesses: the good-set measure 1 - N^{-c} tends to 1,
// but the deterministic certificate the chain needs is an indicator (0 or 1)
// that the measure does NOT determine. We exhibit mu(G_N) -> 1 alongside the
// fact that the pointwise certificate stays UNRESOLVED (not derivable from mu).

const C_ESY_DECAY = 1; // illustrative ensemble bad-event exponent: P(bad_N) <= N^{-c}.

function ensembleBadProb(N) {
  // ESY-type bad-event probability over the ensemble: decays in N. (Illustrative.)
  return Math.pow(N, -C_ESY_DECAY);
}
function goodSetMeasure(N) {
  // Ensemble measure of the rigidity good set G_{N}: tends to 1 from below.
  return 1 - ensembleBadProb(N);
}

const MEASURE_WITNESSES = Object.freeze({
  // Good-set measure increases toward 1 -- the high-probability premise holds.
  goodMeasureN10: goodSetMeasure(10),
  goodMeasureN100: goodSetMeasure(100),
  goodMeasureN1000: goodSetMeasure(1000),
  // Bad-event probability decreases toward 0.
  badProbN10: ensembleBadProb(10),
  badProbN100: ensembleBadProb(100),
  badProbN1000: ensembleBadProb(1000),
  // The deterministic certificate is an INDICATOR not fixed by the measure:
  // mu(G_N) -> 1 does not pin 1_{G_N}({gamma_k}). Recorded as the unresolved gap.
  deterministicCertificateDerivableFromMeasure: false,
});

// =========================================================================
// SECTION (c) -- Why standard derandomization routes fail for the zeros.
// =========================================================================
//
// The three textbook ways to turn a high-probability statement into a
// deterministic one all break on a single fixed arithmetic sequence:
//   (D1) UNION BOUND over a family -- needs a PARAMETERIZED family to average
//        over; the zeros are ONE sequence, no parameter, nothing to union over.
//   (D2) EXPLICIT MEMBERSHIP in the good set -- G_N is defined NON-construct-
//        ively as the complement of a small-probability event, so there is no
//        decidable test certifying {gamma_k} in G_N.
//   (D3) GENERICITY / EQUIDISTRIBUTION -- prove the zero sequence equidist-
//        ributes to the GUE / sine-kernel law so it behaves like a typical
//        sample. This is the Montgomery-Dyson identification in quantitative
//        (Bourgade / Rudnick-Sarnak) form, and it is OPEN -- essentially the
//        GUE conjecture for the zeta zeros.

const DERANDOMIZATION_ROUTES = Object.freeze({
  D1_unionBound: {
    route: 'union bound over a parameterized family',
    failsBecause:
      'the Riemann zeros are a SINGLE deterministic sequence -- there is no ' +
      'family index to average over and no probability space carrying the ' +
      'sequence, so there is nothing to union-bound.',
    closes: false,
  },
  D2_explicitMembership: {
    route: 'explicit / constructive membership in the good set G_{N}',
    failsBecause:
      'G_{N} is defined as the COMPLEMENT of a small-probability bad event, a ' +
      'non-constructive set with no decidable membership test; one cannot ' +
      'certify 1_{G_N}({gamma_k}) = 1 without independently controlling the ' +
      'zero discrepancy -- which is the very quantity sought.',
    closes: false,
  },
  D3_equidistribution: {
    route: 'genericity via equidistribution to the GUE / sine-kernel law',
    failsBecause:
      'proving the zeros equidistribute to the GUE law (so they are a typical ' +
      'sample) is the quantitative Montgomery-Dyson / Bourgade / Rudnick-Sarnak ' +
      'identification, which is OPEN and is essentially the GUE conjecture for ' +
      'the zeta zeros -- it cannot be assumed to close O3 without circularity.',
    closes: false,
  },
});

// =========================================================================
// SECTION (d) -- The missing input: quantitative equidistribution (open).
// =========================================================================

const MISSING_INPUT = Object.freeze({
  name: 'quantitative GUE equidistribution of the zeta zeros',
  references: [
    'Montgomery 1973, "The pair correlation of zeros of the zeta function," ' +
      'Proc. Sympos. Pure Math. 24:181-193 (pair-correlation conjecture)',
    'Rudnick-Sarnak 1996, "Zeros of principal L-functions and random matrix ' +
      'theory," Duke Math. J. 81(2):269-322 (n-level correlations, restricted)',
    'Bourgade 2010, "Mesoscopic fluctuations of the zeta zeros," Probab. ' +
      'Theory Related Fields 148:479-500 (mesoscopic / equidistribution framework)',
  ],
  statement:
    'A quantitative statement that the local statistics of the first N zero ' +
    'ordinates {gamma_k} converge to the GUE / sine-kernel law at a rate ' +
    'strong enough to place the deterministic sequence inside the ESY good set ' +
    'G_{N} for all large N -- i.e. to evaluate the indicator 1_{G_N}({gamma_k}) ' +
    '= 1 rather than merely the ensemble measure mu(G_{N}) = 1 - N^{-c}.',
  status:
    'OPEN -- only the leading Montgomery pair-correlation term and ' +
    'test-function-restricted Rudnick-Sarnak n-level correlations are known ' +
    'unconditionally; the full quantitative equidistribution needed for the ' +
    'derandomization is at the level of the GUE conjecture for zeta zeros.',
});

// =========================================================================
// SECTION (e) -- Named sub-gap (honest residual), anchored to the O3 entry.
// =========================================================================

const NAMED_SUBGAP = Object.freeze({
  id: 'imp-2493-sub-equidistribution-deterministic-certificate',
  anchorsExistingSubGap: 'esy-port-O3-derandomization', // OPEN_SUB_GAPS entry in esy-rigidity-port.js
  label:
    'ESY high-probability rigidity does not derandomize to the fixed zero ' +
    'sequence: a measure-1 ensemble good set does not certify one named point',
  detail:
    'ESY rigidity controls the ensemble measure mu(G_{N}) = 1 - N^{-c} of the ' +
    'rigidity good set, but the Koksma-Hlawka / Burgers chain needs the ' +
    'pointwise indicator 1_{G_N}({gamma_k}) = 1 for the single deterministic ' +
    'zero sequence. A measure-1 set can exclude any prescribed point (the ' +
    'irrationals miss 1/2), so the ensemble statement gives no deterministic ' +
    'certificate. The three derandomization routes (union bound, explicit ' +
    'membership, genericity) all fail; closing O3 requires quantitative GUE ' +
    'equidistribution of the zeros (Montgomery-Dyson / Bourgade / ' +
    'Rudnick-Sarnak), which is open.',
  severity: 'critical',
  isResearchGrade: true,
  closesIf:
    'A quantitative equidistribution theorem placing the deterministic zero ' +
    'sequence inside the ESY good set G_{N} for all large N is established -- ' +
    'i.e. the GUE / sine-kernel law is proved for the zeta zeros at a ' +
    'quantitative rate. Open; not implied by ESY ensemble rigidity.',
});

// =========================================================================
// SECTION (f) -- Harvested closesIf resolution (imp-2612, conditional negative).
// =========================================================================
//
// The anti-starvation harvester opened imp-2612 against this module's closesIf
// field: "A quantitative equidistribution theorem placing the deterministic
// zero sequence inside the ESY good set G_{N} for all large N is established."
// Executing that named action is attempted here and resolved as a CONDITIONAL
// NEGATIVE: the closure condition is well-posed, but the input it requires is
// the quantitative GUE / sine-kernel law for the zeta zeros, which is
// unconditionally OPEN -- it is at the level of the GUE conjecture itself
// (Montgomery-Dyson / Bourgade / Rudnick-Sarnak give only the leading pair
// correlation and test-function-restricted n-level correlations). The action
// therefore cannot be executed to close O3; the honest negative is recorded
// instead of an overclaimed closure. This mirrors imp-2610 / imp-2611.

const CLOSESIF_RESOLUTION = Object.freeze({
  ticket: 'imp-2612',
  resolvedDate: '2026-06-12',
  resolution: 'conditional-negative',
  harvestedClosesIf: NAMED_SUBGAP.closesIf,
  closureInputRequired: MISSING_INPUT.name,
  closureInputStatus: 'OPEN',
  closureInputExecutable: false,
  o3Closed: false,
  why:
    'The harvested closesIf is well-posed but not executable: it asks for a ' +
    'quantitative GUE / sine-kernel equidistribution theorem that places the ' +
    'single deterministic zero sequence {gamma_k} inside the ESY good set ' +
    'G_{N} for all large N. That theorem is the GUE conjecture for the zeta ' +
    'zeros at a quantitative rate -- unconditionally open. Only Montgomery ' +
    'pair correlation (leading term) and test-function-restricted ' +
    'Rudnick-Sarnak n-level correlations are known. So the action cannot be ' +
    'carried out to close obstacle O3; the conditional negative is recorded ' +
    'and the verdict / sub-gap stand unchanged.',
});

const VERDICT = 'esy-o3-high-prob-does-not-derandomize-without-equidistribution';

// =========================================================================
// FROZEN EXPORTED RECORD
// =========================================================================

export const IMP2493_ESY_O3_DERANDOMIZATION_AUDIT = Object.freeze({
  id: 'imp-2493',
  ticket: 'imp-370',
  obstacle: 'O3',
  auditDate: '2026-06-07',
  axis: 'probabilistic-vs-deterministic (ensemble measure 1 - N^{-c} vs pointwise indicator for the fixed zero sequence)',
  question:
    'esy-rigidity-port.js obstacle3 flags that ESY rigidity is a ' +
    'high-probability ensemble statement while the codebase needs a ' +
    'deterministic bound for {gamma_k}. Pin the precise obstruction: does the ' +
    'ESY ensemble bound derandomize to the fixed zero sequence?',
  statementTypes: STATEMENT_TYPES,
  fullMeasureSetMissesNamedPoint: FULL_MEASURE_SET_MISSES_NAMED_POINT,
  measureWitnesses: MEASURE_WITNESSES,
  derandomizationRoutes: DERANDOMIZATION_ROUTES,
  missingInput: MISSING_INPUT,
  namedSubGap: NAMED_SUBGAP,
  closesIfResolution: CLOSESIF_RESOLUTION,
  verdict: VERDICT,
  ensembleBoundDerandomizes: false,
  esyStatementIsMeasure: true,
  codebaseNeedIsIndicator: true,
  refinesObstacle3:
    'esy-rigidity-port.js obstacle3 stated only that converting a ' +
    'high-probability Wigner bound to a deterministic bound for {gamma_k} ' +
    '"requires a derandomization argument, which does not currently exist". ' +
    'This audit identifies the concrete mechanism: the gap is the ' +
    'measure-vs-indicator chasm (a measure-1 set can miss any named point), ' +
    'and the only route across is quantitative GUE equidistribution of the ' +
    'zeros, which is open -- so the ensemble bound does not derandomize.',
  honestScope: Object.freeze([
    'This audit does NOT close obstacle O3 and does NOT close imp-370 angle ' +
    '(b). It establishes a NEGATIVE with a precise mechanism: the ESY ' +
    'high-probability ensemble rigidity does not transfer to a deterministic ' +
    'bound for the single fixed zero sequence {gamma_k}.',
    'The decisive structural fact is the measure-vs-indicator gap: the good ' +
    'set carries ensemble measure mu(G_{N}) = 1 - N^{-c} -> 1, but a ' +
    'measure-1 (probability-1) set can still exclude any prescribed point (the ' +
    'irrationals have measure 1 yet exclude 1/2). So the ensemble statement ' +
    'provides no pointwise certificate 1_{G_N}({gamma_k}) = 1. The measure ' +
    'witnesses are elementary illustrations of this signature, not physical ' +
    'rigidity magnitudes.',
    'Named sub-gap imp-2493-sub-equidistribution-deterministic-certificate ' +
    'records the residual and anchors the existing esy-port-O3-derandomization ' +
    'entry: closing O3 needs quantitative GUE equidistribution of the zeros ' +
    '(Montgomery-Dyson / Bourgade / Rudnick-Sarnak), which ESY does not supply ' +
    'and which is open. O2 and O3 remain research-grade open; the route stays ' +
    'conditional.',
  ]),
  parallelTickets: Object.freeze(['imp-370', 'imp-407', 'imp-508', 'imp-2492']),
});

export default IMP2493_ESY_O3_DERANDOMIZATION_AUDIT;

// =========================================================================
// BUILD-TIME TRIPWIRES
// =========================================================================

export const IMP2493_ESY_O3_DERANDOMIZATION_AUDIT_ASSERTIONS = [
  {
    id: 'imp2493-verdict-no-derandomization',
    holds: () =>
      IMP2493_ESY_O3_DERANDOMIZATION_AUDIT.verdict ===
        'esy-o3-high-prob-does-not-derandomize-without-equidistribution' &&
      IMP2493_ESY_O3_DERANDOMIZATION_AUDIT.ensembleBoundDerandomizes === false,
    why:
      'The audit conclusion is that the ESY high-probability ensemble bound ' +
      'does NOT derandomize to the fixed zero sequence. Flipping the verdict or ' +
      'ensembleBoundDerandomizes to true without exhibiting a quantitative ' +
      'equidistribution input would silently overclaim a closure of obstacle O3 ' +
      'that does not exist.',
  },
  {
    id: 'imp2493-measure-vs-indicator-gap-witness',
    holds: () => {
      const w = IMP2493_ESY_O3_DERANDOMIZATION_AUDIT.fullMeasureSetMissesNamedPoint;
      // A measure-1 set (the irrationals) excludes a named rational point:
      // measure 1 but indicator 0 -- the decisive measure-vs-indicator gap.
      return w.lebesgueMeasure === 1 && w.indicatorAtNamedPoint === 0;
    },
    why:
      'The core obstruction is that a measure-1 (probability-1) set can still ' +
      'exclude any prescribed point: the irrationals have Lebesgue measure 1 ' +
      'yet 1/2 lies outside. If this witness were edited so measure and ' +
      'indicator agreed, the audit would falsely suggest a high-probability ' +
      'statement certifies a named deterministic point.',
  },
  {
    id: 'imp2493-good-set-measure-tends-to-one',
    holds: () => {
      const w = IMP2493_ESY_O3_DERANDOMIZATION_AUDIT.measureWitnesses;
      // Ensemble good-set measure 1 - N^{-c} strictly increases toward 1.
      const increases =
        w.goodMeasureN10 < w.goodMeasureN100 &&
        w.goodMeasureN100 < w.goodMeasureN1000 &&
        w.goodMeasureN1000 < 1;
      // Yet the pointwise certificate is NOT derivable from the measure.
      const certificateOpen = w.deterministicCertificateDerivableFromMeasure === false;
      return increases && certificateOpen;
    },
    why:
      'The high-probability premise genuinely holds: the ensemble good-set ' +
      'measure 1 - N^{-c} increases to 1. The honest two-sided position is ' +
      'that this measure still does NOT pin the deterministic indicator -- if ' +
      'either the measure stopped tending to 1 (premise broken) or the ' +
      'certificate were marked derivable (overclaim), the O3 argument would be ' +
      'misstated.',
  },
  {
    id: 'imp2493-bad-prob-times-good-measure-complement',
    holds: () => {
      const w = IMP2493_ESY_O3_DERANDOMIZATION_AUDIT.measureWitnesses;
      // Consistency: good measure + bad prob = 1 at each N (mu(G_N) = 1 - P(bad)).
      const c10 = Math.abs(w.goodMeasureN10 + w.badProbN10 - 1) < 1e-12;
      const c100 = Math.abs(w.goodMeasureN100 + w.badProbN100 - 1) < 1e-12;
      const c1000 = Math.abs(w.goodMeasureN1000 + w.badProbN1000 - 1) < 1e-12;
      // Bad probability strictly decreases in N.
      const decays = w.badProbN10 > w.badProbN100 && w.badProbN100 > w.badProbN1000;
      return c10 && c100 && c1000 && decays;
    },
    why:
      'The good-set measure and the bad-event probability must be genuine ' +
      'complements (sum to 1) at each N, and the bad probability must decay in ' +
      'N -- the structural content of a high-probability statement. A break ' +
      'here means the measure / bad-probability witnesses are no longer a ' +
      'consistent probability pair.',
  },
  {
    id: 'imp2493-all-derandomization-routes-fail',
    holds: () => {
      const r = IMP2493_ESY_O3_DERANDOMIZATION_AUDIT.derandomizationRoutes;
      // All three standard derandomization routes must report closes === false.
      return (
        r.D1_unionBound.closes === false &&
        r.D2_explicitMembership.closes === false &&
        r.D3_equidistribution.closes === false
      );
    },
    why:
      'The three textbook derandomization routes (union bound, explicit ' +
      'membership, genericity via equidistribution) all fail on a single fixed ' +
      'arithmetic sequence. Marking any route closes === true without an ' +
      'established equidistribution theorem would overclaim O3 progress.',
  },
  {
    id: 'imp2493-closesif-resolves-conditional-negative',
    holds: () => {
      const r = IMP2493_ESY_O3_DERANDOMIZATION_AUDIT.closesIfResolution;
      // The harvested imp-2612 closesIf must stay a conditional negative: the
      // closure input is the open GUE equidistribution theorem, so it is not
      // executable and O3 is NOT marked closed.
      return (
        r.ticket === 'imp-2612' &&
        r.resolution === 'conditional-negative' &&
        r.closureInputStatus === 'OPEN' &&
        r.closureInputExecutable === false &&
        r.o3Closed === false
      );
    },
    why:
      'imp-2612 harvested this module closesIf field. The named action -- ' +
      'establishing a quantitative GUE equidistribution theorem placing the ' +
      'deterministic zero sequence in the ESY good set -- is the open GUE ' +
      'conjecture for the zeta zeros, so it cannot be executed to close O3. ' +
      'Flipping closureInputExecutable or o3Closed to true (or the resolution ' +
      'away from conditional-negative) without exhibiting that theorem would ' +
      'silently overclaim a closure of obstacle O3 that does not exist.',
  },
  {
    id: 'imp2493-subgap-critical-anchors-O3',
    holds: () => {
      const g = IMP2493_ESY_O3_DERANDOMIZATION_AUDIT.namedSubGap;
      return (
        g.severity === 'critical' &&
        g.isResearchGrade === true &&
        g.anchorsExistingSubGap === 'esy-port-O3-derandomization'
      );
    },
    why:
      'The honest residual is a critical research-grade sub-gap that anchors ' +
      'the canonical esy-port-O3-derandomization entry in esy-rigidity-port.js. ' +
      'Demoting its severity / research-grade status, or breaking the anchor, ' +
      'would either overclaim O3 progress or sever the link to the obstacle ' +
      'this audit refines.',
  },
];
