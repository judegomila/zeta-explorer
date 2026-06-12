// @module imp-2481-esy-determinantal-clt-audit
// imp-2481 (critical, proof): ESY obstruction audit -- minimal determinantal-
// process input vs full GUE universality for the many-body correction C_mb.
//
// QUESTION (as posed by the ticket)
// ---------------------------------
// imp-486 declared the C_mb reduction IRREDUCIBLE: C_mb = O(1) at the rate
// N^{-1/2} log N was claimed logically equivalent to full GUE universality
// (Montgomery 1973 pair correlation). The ticket asks the sharper probabilistic
// question on a NEW axis: is a determinantal-process linear-statistics CLT
// (Costin-Lebowitz 1995 / Soshnikov 2000) for the SPECIFIC C_mb kernel a
// strictly weaker, citable input that closes Route A -- or is the full local
// law genuinely required? Concretely: check the Soshnikov 2000 smoothness /
// decay hypotheses against the ACTUAL C_mb test function.
//
// RELATION TO PRIOR AUDITS (two different axes)
// ---------------------------------------------
// imp-2365 (in src/math/c-mb-unconditional-bound.js) answered the RIGIDITY-tier
// axis: the minimal sufficient input is the TIER-2 optimal local law (Stieltjes
// control to scale N^{-1+eps}), strictly weaker than full sine-kernel
// universality (TIER 3) but strictly stronger than edge rigidity (TIER 1).
// THIS ticket answers the orthogonal LINEAR-STATISTICS-CLT axis: it asks
// whether the Costin-Lebowitz / Soshnikov determinantal CLT machinery supplies
// the C_mb bound, and finds the off-the-shelf theorem does NOT cover the C_mb
// test function at all -- because that test function is the singular Hilbert
// kernel f(x) = 1/x, which has INFINITE H^{1/2} seminorm and so violates
// Soshnikov 2000 hypotheses. The two audits agree: full GUE universality is
// NOT required; a 2-point-level input is. imp-1161 is the companion port
// attempt for the (smooth, Schwartz) imp-407/imp-508 observable.
//
// HEADLINE VERDICT
// ----------------
// VERDICT: 'determinantal-clt-not-a-weaker-citable-input-for-C_mb'
//
// A determinantal-process linear-statistics CLT is NOT a strictly weaker
// citable input that unconditionally closes Route A, for TWO independent
// reasons:
//   (R1) HYPOTHESIS MISMATCH. The C_mb statistic is the singular Cauchy /
//        Hilbert sum with test function f(x) = 1/x. Its H^{1/2} Sobolev
//        seminorm (= the Costin-Lebowitz variance) DIVERGES: the Fourier
//        transform of the principal-value kernel p.v. 1/x is -i pi sgn(xi),
//        so int |xi| |f_hat(xi)|^2 dxi = pi^2 int |xi| dxi = +infinity.
//        Soshnikov 2000 Theorem 1 is stated for test functions with FINITE
//        H^{1/2} seminorm (smoothness + decay); the C_mb kernel sits strictly
//        OUTSIDE that class. The off-the-shelf CLT does not apply.
//   (R2) APPLICABILITY. Even a singular-statistic determinantal CLT (a harder,
//        Hilbert-transform / log-correlated-field variant) requires KNOWING
//        the zero process is determinantal with the sine 2-point kernel --
//        which is exactly Montgomery PCC content. The determinantal hypothesis
//        is therefore NOT weaker than the 2-point GUE input; it IS that input.
//
// So the determinantal-CLT angle does not lower the bar below the imp-2365
// TIER-2 conclusion. It confirms it from the cumulant side: C_mb is a
// mean/variance-level correction whose size is fixed by the 2-point function
// alone, so Soshnikov's higher-cumulant machinery (all rho_m, m >= 3) is
// strictly MORE than needed -- but the variance content still needs the sine
// 2-point kernel, and the singular test function makes even that variance
// integral divergent without the local-spacing UV cutoff that produces the
// log N factor in the imp-486 rate.
//
// SYNTAX SAFETY: no star-slash sequences inside comments; single quotes only;
// no apostrophes inside single-quoted strings.
//
// @see imp-486   -- the irreducibility claim this audit refines (src/math/c-mb-unconditional-bound.js)
// @see imp-2365  -- the rigidity-tier axis (TIER-2 optimal local law) in the same file
// @see imp-1161  -- companion Costin-Lebowitz port for the smooth imp-407/imp-508 observable
// @see imp-1180  -- higher-order-correlation alternative route
// @see imp-1184  -- direct Selberg + ESY-rigidity route audit

// =========================================================================
// SECTION (a) -- The C_mb statistic as a linear statistic; its test function.
// =========================================================================
//
// The many-body correction (imp-471 / imp-486) controls the long-range force
//
//   F_mb(N) = 2 * SUM_{j: |j-k*|>=2} rho^2 / (gamma_{k*} - gamma_j),
//
// and the closure needs the normalized Cauchy sum
//
//   S_N := SUM_{j: |j-k*|>=2} 1 / (gamma_{k*} - gamma_j)
//
// pinned at the CLT scale  |S_N| <~ C_mb * rho_N * N^{-1/2} log N.
//
// As a LINEAR STATISTIC of the zero point process, S_N = sum_j f(gamma_{k*} -
// gamma_j) with TEST FUNCTION  f(x) = 1/x  (the principal-value Hilbert /
// Cauchy kernel). This is the object that any determinantal linear-statistics
// CLT (Costin-Lebowitz / Soshnikov) would have to accept as input.

const C_MB_TEST_FUNCTION = Object.freeze({
  statistic: 'S_N = sum_{|j-k*|>=2} 1/(gamma_{k*} - gamma_j)',
  testFunction: 'f(x) = 1/x  (principal-value Hilbert / Cauchy kernel)',
  fourierTransform:
    'FT[ p.v. 1/x ](xi) = -i pi sgn(xi)  (bounded, NON-decaying in |xi|)',
  smooth: false,
  schwartz: false,
  reason_not_schwartz:
    'f(x) = 1/x is singular at x = 0 (non-integrable pole) and decays only ' +
    'like 1/x at infinity; its Fourier transform -i pi sgn(xi) does not decay, ' +
    'so f is neither smooth nor rapidly decreasing.',
});

// =========================================================================
// SECTION (b) -- Soshnikov 2000 hypotheses vs the C_mb test function.
// =========================================================================
//
// Soshnikov 2000 (Ann. Probab. 28, Thm. 1) gives a CLT for the local linear
// statistic L_N(f) of a determinantal process whose kernel converges to the
// sine kernel, PROVIDED the test function f lies in the class with FINITE
// H^{1/2} Sobolev seminorm
//
//   ||f||_{H^{1/2}}^2 = int_R |xi| |f_hat(xi)|^2 d xi  <  infinity,
//
// which is exactly the Costin-Lebowitz limiting variance. (Soshnikov in fact
// works with f of bounded variation with suitable decay; the finite-H^{1/2}
// condition is the sharp variance-finiteness requirement -- see also
// Spohn 1987, Hughes-Keating-O-Connell 2001.)
//
// CHECK against f(x) = 1/x. With f_hat(xi) = -i pi sgn(xi), |f_hat(xi)|^2 =
// pi^2 (constant), so
//
//   ||f||_{H^{1/2}}^2 = pi^2 * int_R |xi| d xi = +infinity.
//
// The C_mb test function therefore SATURATES / VIOLATES the Soshnikov
// variance-finiteness hypothesis: it is the borderline Hilbert kernel sitting
// exactly outside the admissible class. The CLT theorem, AS STATED, does not
// cover it. A regularized statistic (UV cutoff |xi| <= Xi, i.e. truncating the
// sum at the local spacing scale) has FINITE seminorm pi^2 Xi^2, but that is a
// DIFFERENT statistic, and the cutoff is precisely the local-spacing
// regularization that injects the log N factor into the imp-486 C_mb rate.

const SOSHNIKOV_HYPOTHESIS_CHECK = Object.freeze({
  theorem: 'Soshnikov 2000, Ann. Probab. 28, Thm. 1 (determinantal-process linear-statistics CLT)',
  requiredOnTestFunction:
    'finite H^{1/2} seminorm ||f||_{H^{1/2}}^2 = int |xi| |f_hat(xi)|^2 dxi < infinity ' +
    '(= the Costin-Lebowitz limiting variance), plus determinantal/sine-kernel structure.',
  cmbTestFunctionSeminorm: 'INFINITE: pi^2 * int |xi| dxi diverges (|f_hat|^2 = pi^2 constant).',
  hypothesisSatisfied: false,
  consequence:
    'The off-the-shelf Soshnikov 2000 CLT does NOT apply to the singular C_mb ' +
    'kernel f(x) = 1/x. Closing Route A this way would need a SINGULAR-linear-' +
    'statistics determinantal CLT (a Hilbert-transform / log-correlated-field ' +
    'variant), which is a strictly harder probabilistic input -- not a weaker one.',
  regularizedSeminorm:
    'With a UV cutoff |xi| <= Xi the seminorm is finite = pi^2 Xi^2, but the ' +
    'cutoff at the local spacing scale (Xi ~ log T) changes the statistic and ' +
    'is the origin of the log N factor in the C_mb rate.',
});

// Numeric witnesses (recomputation-stable; no Date/random used).
//
// (1) Regularized H^{1/2} seminorm of the Hilbert kernel grows like pi^2 Xi^2
//     -> divergence: doubling the cutoff QUADRUPLES the seminorm.
function hilbertSeminormWithCutoff(Xi) {
  // int_{-Xi}^{Xi} |xi| * pi^2 d xi = pi^2 * Xi^2.
  return Math.PI * Math.PI * Xi * Xi;
}
// (2) For contrast, a smooth Schwartz test function (unit Gaussian f(x) =
//     e^{-x^2/2}, f_hat(xi) = sqrt(2 pi) e^{-xi^2/2}) has FINITE H^{1/2}
//     seminorm int |xi| * 2 pi e^{-xi^2} dxi = 2 pi. It PASSES Soshnikov.
const GAUSSIAN_H_HALF_SEMINORM = 2 * Math.PI; // exact closed form.

const SEMINORM_WITNESSES = Object.freeze({
  hilbertCutoff10: hilbertSeminormWithCutoff(10),
  hilbertCutoff20: hilbertSeminormWithCutoff(20),
  hilbertQuadrupleRatio:
    hilbertSeminormWithCutoff(20) / hilbertSeminormWithCutoff(10), // = 4 (quadratic growth -> divergent)
  gaussianSeminorm: GAUSSIAN_H_HALF_SEMINORM, // finite = 2 pi ~ 6.283
});

// =========================================================================
// SECTION (c) -- The cumulant axis: what tier of input C_mb actually needs.
// =========================================================================
//
// C_mb is a MEAN / VARIANCE-level correction (it bounds the SIZE of a force
// fluctuation), NOT a distributional CLT statement. So even granting the
// determinantal structure, only the SECOND cumulant (variance) of the linear
// statistic is used; the Soshnikov higher-cumulant ladder (rho_m for m >= 3
// vanishing -> Gaussianity) is never invoked. This matches imp-2365: TIER-3
// full sine-kernel universality is strictly MORE than needed; the variance is
// fixed by the 2-point function (TIER-2 / Montgomery PCC). The determinantal
// CLT thus cannot be a WEAKER input than TIER-2 -- its variance content IS the
// 2-point sine kernel, and its Gaussianity content (the part that genuinely
// needs all correlations) is unused for C_mb.

const CUMULANT_AXIS = Object.freeze({
  cmbIsDistributional: false,
  cmbLevel: 'second-cumulant (variance) of a singular linear statistic',
  higherCumulantsUsed: false,
  tierReconciliation:
    'Agrees with imp-2365: variance is fixed by the 2-point function (TIER-2 ' +
    'optimal local law / Montgomery PCC). Soshnikov Gaussianity (all rho_m, ' +
    'm >= 3) is TIER-3-level and UNUSED, so the determinantal CLT is not a ' +
    'weaker input -- the needed part is exactly the 2-point sine kernel.',
  minimalSufficientInput:
    'sine-kernel 2-point asymptotic (Montgomery PCC) regularized at the local ' +
    'spacing scale -- equivalently the imp-2365 TIER-2 optimal local law. Still ' +
    'unproven for zeta; the route stays conditional, refining (not removing) imp-486.',
});

// =========================================================================
// SECTION (d) -- Named sub-gap (honest residual).
// =========================================================================

const NAMED_SUBGAP = Object.freeze({
  id: 'imp-2481-sub-singular-test-function-H-half-divergence',
  label:
    'C_mb test function 1/x has infinite H^{1/2} seminorm -> off-the-shelf ' +
    'determinantal CLT inapplicable',
  detail:
    'Closing Route A via a determinantal-process linear-statistics CLT requires ' +
    'a SINGULAR-statistic variant covering the Hilbert kernel f(x) = 1/x, whose ' +
    'H^{1/2} seminorm diverges. The smooth-test-function Soshnikov 2000 theorem ' +
    'does not apply; a Hilbert-transform CLT for the zero process is a strictly ' +
    'harder probabilistic input and is itself conditional on the sine 2-point ' +
    'kernel (Montgomery PCC). No unconditional route is opened.',
  severity: 'critical',
  closesIf:
    'A singular-linear-statistics determinantal CLT for the Hilbert kernel is ' +
    'established for the zero process AND the sine 2-point asymptotic is proven ' +
    'unconditionally -- i.e. the imp-2365 TIER-2 local law. Both remain open.',
});

// imp-2610 (closesIf harvest): the harvester named the sub-gap closesIf text as
// an action to execute. It is NOT executable: the named closure decomposes into
// two SEPARATELY-OPEN research inputs, neither currently establishable. So the
// honest resolution is a CONDITIONAL NEGATIVE -- the closesIf is recorded as
// not-met (no unconditional closure), preventing a future re-harvest from
// treating it as actionable.
const CLOSESIF_RESOLUTION = Object.freeze({
  ticket: 'imp-2610',
  closesIfText:
    'A singular-linear-statistics determinantal CLT for the Hilbert kernel is ' +
    'established for the zero process AND the sine 2-point asymptotic is proven ' +
    'unconditionally (the imp-2365 TIER-2 optimal local law).',
  status: 'not-met-conditional-negative',
  requiredOpenInputs: Object.freeze([
    'A singular-linear-statistics determinantal CLT covering the Hilbert kernel ' +
      'f(x) = 1/x (infinite H^{1/2} seminorm) for the Riemann zero process -- ' +
      'open, and strictly harder than the smooth-test-function Soshnikov 2000 CLT.',
    'An unconditional sine 2-point asymptotic for the zeta zeros (Montgomery PCC ' +
      '/ the imp-2365 TIER-2 optimal local law) -- open.',
  ]),
  unconditionalClosure: false,
  note:
    'Both conjuncts remain open inputs, so the named action cannot be executed; ' +
    'the honest negative is recorded instead. This refines (does not remove) the ' +
    'imp-486 condition and matches the imp-2365 TIER-2 minimal-input finding.',
});

const VERDICT = 'determinantal-clt-not-a-weaker-citable-input-for-C_mb';

// =========================================================================
// FROZEN EXPORTED RECORD
// =========================================================================

export const IMP2481_ESY_DETERMINANTAL_CLT_AUDIT = Object.freeze({
  id: 'imp-2481',
  ticket: 'imp-2481',
  auditDate: '2026-06-07',
  axis: 'linear-statistics-CLT (orthogonal to the imp-2365 rigidity-tier axis)',
  question:
    'Is a determinantal-process linear-statistics CLT (Costin-Lebowitz / ' +
    'Soshnikov) for the specific C_mb kernel a strictly weaker citable input ' +
    'that closes Route A, or is full GUE universality genuinely required as ' +
    'imp-486 claims? Check Soshnikov 2000 hypotheses against the C_mb test function.',
  cmbTestFunction: C_MB_TEST_FUNCTION,
  soshnikovHypothesisCheck: SOSHNIKOV_HYPOTHESIS_CHECK,
  seminormWitnesses: SEMINORM_WITNESSES,
  cumulantAxis: CUMULANT_AXIS,
  namedSubGap: NAMED_SUBGAP,
  closesIfResolution: CLOSESIF_RESOLUTION,
  verdict: VERDICT,
  determinantalCltIsWeakerInput: false,
  fullGueUniversalityRequired: false, // only the 2-point level (TIER-2) is needed
  refinesImp486:
    'imp-486 treated GUE universality monolithically and called C_mb ' +
    'irreducible. This audit confirms the conditionality but pins the input ' +
    'precisely on the LINEAR-STATISTICS axis: the determinantal CLT is not a ' +
    'weaker citable substitute (its variance content IS the sine 2-point ' +
    'kernel; its Gaussianity content is unused; and the C_mb test function 1/x ' +
    'falls outside the Soshnikov smoothness/decay class). Net minimal input ' +
    'matches imp-2365 TIER-2, reached here from the CLT/cumulant side.',
  honestScope: Object.freeze([
    'This audit does NOT close Route A unconditionally. It establishes a ' +
    'NEGATIVE: the determinantal-process linear-statistics CLT (Costin-' +
    'Lebowitz / Soshnikov 2000) is not a strictly weaker citable input for ' +
    'the C_mb bound, on two independent grounds (R1 hypothesis mismatch, R2 ' +
    'determinantal hypothesis = 2-point GUE content).',
    'The decisive check is the H^{1/2} seminorm of the C_mb test function ' +
    'f(x) = 1/x: with f_hat = -i pi sgn(xi) the seminorm int |xi| |f_hat|^2 ' +
    'dxi = pi^2 int |xi| dxi diverges, so the smooth-test-function Soshnikov ' +
    'theorem does not apply. The regularized seminorm grows quadratically in ' +
    'the UV cutoff (pi^2 Xi^2), confirming divergence; the cutoff at the local ' +
    'spacing scale Xi ~ log T is the heuristic origin of the log N factor in ' +
    'the imp-486 C_mb rate (qualitative, not asserted as an exact identity).',
    'The cumulant axis confirms imp-2365: C_mb is a variance-level correction, ' +
    'so Soshnikov higher-cumulant Gaussianity (all rho_m, m >= 3) is strictly ' +
    'more than needed. The minimal sufficient input is the sine 2-point ' +
    'asymptotic (TIER-2 optimal local law / Montgomery PCC), still unproven ' +
    'for zeta -- the route stays conditional, refining imp-486 rather than ' +
    'removing the condition.',
    'Named sub-gap imp-2481-sub-singular-test-function-H-half-divergence ' +
    'records the precise residual: a SINGULAR-linear-statistics determinantal ' +
    'CLT for the Hilbert kernel would be required, which is harder than (not ' +
    'weaker than) the smooth Soshnikov CLT and is itself conditional on the ' +
    'sine 2-point kernel.',
  ]),
  parallelTickets: Object.freeze(['imp-486', 'imp-2365', 'imp-1161', 'imp-1180', 'imp-1184']),
});

export default IMP2481_ESY_DETERMINANTAL_CLT_AUDIT;

// =========================================================================
// BUILD-TIME TRIPWIRES
// =========================================================================

export const IMP2481_ESY_DETERMINANTAL_CLT_AUDIT_ASSERTIONS = [
  {
    id: 'imp2481-verdict-determinantal-clt-not-weaker',
    holds: () =>
      IMP2481_ESY_DETERMINANTAL_CLT_AUDIT.verdict ===
        'determinantal-clt-not-a-weaker-citable-input-for-C_mb' &&
      IMP2481_ESY_DETERMINANTAL_CLT_AUDIT.determinantalCltIsWeakerInput === false,
    why:
      'The audit conclusion is that a determinantal-process linear-statistics ' +
      'CLT is NOT a strictly weaker citable input that closes Route A. Flipping ' +
      'the verdict or determinantalCltIsWeakerInput to true without exhibiting ' +
      'an unconditional singular-statistic CLT AND an unconditional sine 2-point ' +
      'asymptotic would silently overclaim an unconditional closure that does ' +
      'not exist.',
  },
  {
    id: 'imp2481-soshnikov-hypothesis-fails-on-cmb-kernel',
    holds: () => {
      const c = IMP2481_ESY_DETERMINANTAL_CLT_AUDIT.soshnikovHypothesisCheck;
      const t = IMP2481_ESY_DETERMINANTAL_CLT_AUDIT.cmbTestFunction;
      return c.hypothesisSatisfied === false && t.smooth === false && t.schwartz === false;
    },
    why:
      'The C_mb test function f(x) = 1/x is singular (non-smooth, non-Schwartz) ' +
      'and its H^{1/2} seminorm diverges, so the Soshnikov 2000 finite-variance ' +
      'hypothesis is VIOLATED. Marking hypothesisSatisfied true, or the test ' +
      'function smooth/Schwartz, would falsely advertise that the off-the-shelf ' +
      'CLT applies to the Cauchy kernel.',
  },
  {
    id: 'imp2481-hilbert-seminorm-diverges-quadratically',
    holds: () => {
      const w = IMP2481_ESY_DETERMINANTAL_CLT_AUDIT.seminormWitnesses;
      // Doubling the UV cutoff must quadruple the regularized Hilbert seminorm
      // (quadratic growth -> divergence), and the bare seminorm must exceed the
      // finite Gaussian (Schwartz) seminorm at a modest cutoff.
      const quadOk = Math.abs(w.hilbertQuadrupleRatio - 4) < 1e-9;
      const growsOk = w.hilbertCutoff20 > w.hilbertCutoff10 && w.hilbertCutoff10 > 0;
      const dominatesGaussian = w.hilbertCutoff10 > w.gaussianSeminorm;
      return quadOk && growsOk && dominatesGaussian;
    },
    why:
      'The regularized H^{1/2} seminorm of the Hilbert kernel is pi^2 Xi^2, so ' +
      'doubling the cutoff Xi must quadruple it (ratio exactly 4) and it must ' +
      'grow without bound -- the numeric signature of divergence. The finite ' +
      'Gaussian seminorm (2 pi) is the Schwartz-class contrast: the Hilbert ' +
      'cutoff-10 value (100 pi^2) must dominate it. Drift here means the ' +
      'divergence witness was edited away or the closed forms diverged.',
  },
  {
    id: 'imp2481-gaussian-control-seminorm-finite',
    holds: () => {
      const w = IMP2481_ESY_DETERMINANTAL_CLT_AUDIT.seminormWitnesses;
      return Math.abs(w.gaussianSeminorm - 2 * Math.PI) < 1e-9;
    },
    why:
      'The unit-Gaussian Schwartz test function has the exact finite H^{1/2} ' +
      'seminorm 2 pi (int |xi| 2 pi e^{-xi^2} dxi = 2 pi). This is the ' +
      'admissible-class control showing Soshnikov 2000 DOES apply to smooth ' +
      'rapidly-decaying f -- the contrast that isolates the C_mb kernel as the ' +
      'borderline failure. A change here breaks the smooth-vs-singular contrast.',
  },
  {
    id: 'imp2481-cumulant-axis-variance-level-only',
    holds: () => {
      const c = IMP2481_ESY_DETERMINANTAL_CLT_AUDIT.cumulantAxis;
      return c.cmbIsDistributional === false && c.higherCumulantsUsed === false;
    },
    why:
      'C_mb is a variance-level (second-cumulant) correction, not a ' +
      'distributional CLT statement, so Soshnikov higher-cumulant Gaussianity ' +
      '(all rho_m, m >= 3) is unused. Marking cmbIsDistributional or ' +
      'higherCumulantsUsed true would wrongly imply C_mb needs the full ' +
      'sine-kernel ladder, contradicting the imp-2365 TIER-2 finding.',
  },
  {
    id: 'imp2610-closesif-recorded-as-conditional-negative',
    holds: () => {
      const r = IMP2481_ESY_DETERMINANTAL_CLT_AUDIT.closesIfResolution;
      return (
        Boolean(r) &&
        r.status === 'not-met-conditional-negative' &&
        r.unconditionalClosure === false &&
        Array.isArray(r.requiredOpenInputs) &&
        r.requiredOpenInputs.length === 2
      );
    },
    why:
      'The imp-2610 closesIf harvest names an action that is NOT executable: it ' +
      'decomposes into two separately-open inputs (a singular-statistic ' +
      'determinantal CLT for the Hilbert kernel, and an unconditional sine ' +
      '2-point asymptotic). Recording status not-met-conditional-negative with ' +
      'unconditionalClosure false is the honest resolution. Flipping the status ' +
      'or unconditionalClosure to claim closure -- or dropping either open input ' +
      '-- would advertise an unconditional Route A closure that does not exist.',
  },
  {
    id: 'imp2481-full-gue-not-required-but-route-conditional',
    holds: () => {
      const r = IMP2481_ESY_DETERMINANTAL_CLT_AUDIT;
      // Full GUE universality is NOT required (only 2-point level), yet the
      // route remains conditional via the named sub-gap (not unconditionally
      // closed). Both must hold simultaneously.
      const subGapCritical = r.namedSubGap && r.namedSubGap.severity === 'critical';
      return r.fullGueUniversalityRequired === false && Boolean(subGapCritical);
    },
    why:
      'The honest position is two-sided: full GUE universality is NOT required ' +
      '(the 2-point / TIER-2 level suffices), but Route A is still NOT closed ' +
      'unconditionally -- the critical sub-gap (singular-statistic CLT + sine ' +
      '2-point kernel, both open) remains. Dropping the sub-gap or flipping ' +
      'fullGueUniversalityRequired would either overclaim an unconditional ' +
      'closure or revert to the monolithic imp-486 framing this audit refines.',
  },
];
