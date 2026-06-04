// @module imp-2441-minimal-input-to-close-esy-gap
// imp-2441: Identify the minimal spectral input that closes the N-independent
// 2.153e-3 ESY variance gap quantified in imp-2422. Wave-3 follow-on.
//
// CONTEXT (one paragraph)
// -----------------------
// imp-2422 (built on imp-2354) quantified the gap to ESY closure under the
// only UNCONDITIONAL 3-point input (Rudnick-Sarnak 1996, Fourier band
// |xi| < 2/3): at the microscopic ESY scale the unfolded Poisson kernel sits
// at y_unfolded = 1 for ALL N, so hat_phi(xi) = pi exp(-2 pi |xi|) is
// N-independent and the RS96 band certifies only the in-band projection of the
// variance form factor min(|xi|, 1) |hat_phi|^2. The high-pass residual is the
// gap: 2.153e-3 in the variance form factor (2.300e-4 in plain L2), the same
// number at N = 1e6 and 1e7. THIS ticket asks the next question: what is the
// MINIMAL additional input that closes that residual? Three candidates are
// scored against the same exact form-factor integral -- (A) a wider Fourier
// bandwidth W, (B) a next-order (4-point) correlation input, (C) the residual
// is structural (tied to the Montgomery pair-correlation conjecture, PCC).
//
// HEADLINE VERDICT
// ----------------
// VERDICT: 'esy-variance-gap-is-structural-PCC-no-unconditional-input-closes-it'
//
// (A) WIDER BANDWIDTH closes the gap NUMERICALLY but not unconditionally. The
//     residual shrinks like ~ exp(-4 pi W): W = 1 cuts it 49x to 4.38e-5,
//     W ~ 1.30 reaches 1e-6, W = 2 reaches 2.3e-11. BUT every FINITE W leaves
//     an N-independent residual > 0, and the asymptotic sup-norm ESY observable
//     needs the residual to VANISH -- so only W -> infinity (full Fourier
//     support) strictly closes it, and full-support 3-point input is exactly
//     the Bogomolny-Keating triple-correlation conjecture. Moreover no
//     unconditional widening of the RS96 (-2/3, 2/3) support is known (imp-2354
//     sub-direction 1, BLOCKED). So a wider band is not a realistic
//     UNCONDITIONAL input -- the widening IS the conjecture.
// (B) A 4-POINT (next-order) input REDUCES THE GAP BY ZERO -- in fact it makes
//     it WORSE. The gap lives in the 2nd cumulant (variance) form factor, a
//     2-point object; a 4-point input constrains kappa_4, an orthogonal
//     cumulant that does not touch the kappa_2 high-pass band. And the
//     unconditional 4-point RS band is 2/4 = 1/2 < 2/3, NARROWER, so it
//     certifies even less of the variance band: gap at W = 1/2 is 1.360e-2,
//     6.3x LARGER than the 2.153e-3 at W = 2/3. Wrong observable, narrower
//     support: a strict non-help.
// (C) THE RESIDUAL IS STRUCTURAL. The high-pass band of min(|xi|, 1) |hat_phi|^2
//     is precisely the pair-correlation (2-point) object. The 49x win at W = 1
//     is exactly Montgomery 1973 pair-correlation range |xi| < 1 -- but that
//     range is RH-CONDITIONAL (circular for an RH proof), and the matching
//     min(|xi|, 1) for |xi| >= 1 is the Montgomery pair-correlation conjecture
//     itself. So the gap is not "input-limited" by some forgotten unconditional
//     lever; it is the Montgomery PCC obstruction. No realistic UNCONDITIONAL
//     input drives the residual below the closure threshold (residual -> 0).
//
// CONSEQUENCE FOR THE LAMBDA-ATTACK CHAIN
// ---------------------------------------
// No Lambda bound moves. The imp-407 unconditional baseline (3/2)(log gamma_N)^2
// / N remains operative. This ticket SHARPENS the named gap from imp-2422: the
// 2.153e-3 residual is STRUCTURAL (PCC-tied), so the bandwidth-restricted route
// is asymptotically capped and the only inputs that close it are themselves the
// conjectures (Montgomery PCC for the form factor, Bogomolny-Keating for the
// full-support 3-point correlation). A 4-point input is the wrong observable.
//
// SYNTAX SAFETY
// -------------
// No JSDoc comment-close sequence inside comments. Single quotes throughout; no
// apostrophes inside single-quoted strings. Derivative-in-comments dg_W/dxi.
//
// @see imp-2422-bandwidth-restricted-esy-gap: parent; quantified the 2.153e-3 gap
// @see imp-2354-unrestricted-3point-esy-attempt: established y_unfolded = 1
// @see imp-1180-higher-order-correlation-route: route map, O-HOC-A / O-HOC-E
// @see imp-407 / imp-508: ESY closure baseline this route would serve

// =========================================================================
// SHARED QUADRATURE -- identical kernel and weight as imp-2422.
// =========================================================================
//
// |hat_phi(xi)|^2 = exp(-4 pi |xi|) at y_unfolded = 1 (the common pi^2 prefactor
// cancels in every RATIO). The ESY 2nd-cumulant weight is the GUE form factor
// min(|xi|, 1). XI_MAX = 6 makes the exponential tail negligible (~ 5e-33).

const A_RATE = 4 * Math.PI; // exponent rate of |hat_phi|^2 at y_unfolded = 1
const XI_MAX = 6;
const RS96_3PT_BAND_W = 2 / 3; // unconditional 3-point Fourier band (imp-2422)
const RS96_4PT_BAND_W = 2 / 4; // unconditional 4-point Fourier band = 1/2
const MONTGOMERY_PC_BAND_W = 1; // pair-correlation range |xi| < 1 (RH-conditional)

function simpson(f, a, b, n) {
  const m = n % 2 === 0 ? n : n + 1;
  const h = (b - a) / m;
  let s = f(a) + f(b);
  for (let i = 1; i < m; i += 1) {
    s += (i % 2 === 0 ? 2 : 4) * f(a + i * h);
  }
  return (s * h) / 3;
}

function formFactor(xi) {
  const t = Math.abs(xi);
  return t < 1 ? t : 1;
}
function varIntegrand(xi) {
  return Math.exp(-A_RATE * Math.abs(xi)) * formFactor(xi);
}

const VAR_TOTAL = simpson(varIntegrand, 0, XI_MAX, 8000);

// Relative variance-form-factor gap as a function of the certified band W.
function varianceGapAtBand(W) {
  const inBand = simpson(varIntegrand, 0, W, 8000);
  return (VAR_TOTAL - inBand) / VAR_TOTAL;
}
// Plain-L2 residual closed form exp(-4 pi W) (no form-factor weight).
function l2GapAtBand(W) {
  return Math.exp(-A_RATE * W);
}

// =========================================================================
// CANDIDATE (A) -- WIDER BANDWIDTH. Gap-reduction table vs W.
// =========================================================================
//
// The residual shrinks ~ exp(-4 pi W); each fixed W still leaves an
// N-independent residual > 0. We tabulate representative bands and the
// reduction factor relative to the W = 2/3 baseline (2.153e-3).

const BASELINE_GAP = varianceGapAtBand(RS96_3PT_BAND_W); // ~ 2.153e-3
const BANDWIDTH_GRID = [0.5, 2 / 3, 0.8, 1, 1.2, 1.5, 2];
const BANDWIDTH_TABLE = BANDWIDTH_GRID.map((W) => {
  const gapVar = varianceGapAtBand(W);
  return {
    W,
    varianceGap: gapVar,
    l2Gap: l2GapAtBand(W),
    reductionVsBaseline: BASELINE_GAP / gapVar, // > 1 means smaller gap
  };
});

// Bandwidth needed to drive the relative variance gap below 1e-6 (a practical
// "negligible against the 1e6/1e7 absolute baseline scale" target). Bisection.
const PRACTICAL_TARGET = 1e-6;
function bandForGapTarget(target) {
  let lo = RS96_3PT_BAND_W;
  let hi = 3;
  for (let i = 0; i < 60; i += 1) {
    const mid = (lo + hi) / 2;
    if (varianceGapAtBand(mid) > target) lo = mid;
    else hi = mid;
  }
  return (lo + hi) / 2;
}
const W_STAR_FOR_1e6_TARGET = bandForGapTarget(PRACTICAL_TARGET); // ~ 1.30

// =========================================================================
// CANDIDATE (B) -- 4-POINT (NEXT-ORDER) CORRELATION. Scored honestly.
// =========================================================================
//
// The 2.153e-3 gap is in the 2nd cumulant (variance) form factor min(|xi|, 1),
// a 2-point object. A 4-point input constrains kappa_4 (an orthogonal cumulant)
// and does not touch the kappa_2 high-pass band -- reduction = 0. Worse, the
// unconditional 4-point RS band is 2/4 = 1/2 < 2/3, NARROWER, so taken as a
// substitute for the 2-point variance certification it certifies LESS.

const FOUR_POINT_VARIANCE_GAP = varianceGapAtBand(RS96_4PT_BAND_W); // ~ 1.360e-2
// Reduction the 4-point band buys on the variance gap relative to the 3-point
// band; < 1 means it makes the gap LARGER (a non-help).
const FOUR_POINT_REDUCTION = BASELINE_GAP / FOUR_POINT_VARIANCE_GAP;

// =========================================================================
// CANDIDATE (C) -- STRUCTURAL: the residual is the Montgomery PCC obstruction.
// =========================================================================
//
// The high-pass band of min(|xi|, 1) |hat_phi|^2 is the pair-correlation object.
// The 49x win at W = 1 is exactly the Montgomery 1973 pair-correlation range
// |xi| < 1 -- but that range is RH-CONDITIONAL (Montgomery proves the form
// factor min on |xi| < 1 ASSUMING RH), so it cannot serve an UNCONDITIONAL ESY
// closure without circularity. The matching min(|xi|, 1) for |xi| >= 1 is the
// Montgomery pair-correlation conjecture itself. Hence the residual is
// structural: tied to PCC, not a forgotten unconditional lever.

const MONTGOMERY_BAND_GAP = varianceGapAtBand(MONTGOMERY_PC_BAND_W); // ~ 4.38e-5
const MONTGOMERY_REDUCTION = BASELINE_GAP / MONTGOMERY_BAND_GAP; // ~ 49x

// =========================================================================
// EXPORTED FROZEN RECORD.
// =========================================================================

export const IMP_2441_MINIMAL_INPUT_TO_CLOSE_ESY_GAP = Object.freeze({
  id: 'imp-2441-minimal-input-to-close-esy-gap',
  ticket: 'imp-2441',
  builtAt: '2026-06-04T15:30:00Z',

  verdict: 'esy-variance-gap-is-structural-PCC-no-unconditional-input-closes-it',
  isRigorous: true, // the candidate scoring is the exact form-factor integral
  isNewClosureOfESY: false,
  isImprovementOver407Baseline: false,
  tightensBoundAt1e6Or1e7: false,

  baselineGapAt3PtBand: BASELINE_GAP, // ~ 2.153e-3, the gap to be closed

  // Candidate (A): wider bandwidth.
  bandwidthTable: Object.freeze(BANDWIDTH_TABLE),
  practicalGapTarget: PRACTICAL_TARGET,
  bandwidthForPracticalTarget: W_STAR_FOR_1e6_TARGET, // ~ 1.30
  widerBandClosesNumericallyOnly: true,
  widerBandIsUnconditionallyAvailable: false, // extending RS96 support is open

  // Candidate (B): 4-point correlation.
  fourPointBandW: RS96_4PT_BAND_W,
  fourPointVarianceGap: FOUR_POINT_VARIANCE_GAP, // ~ 1.360e-2, LARGER
  fourPointReductionVsBaseline: FOUR_POINT_REDUCTION, // < 1: makes it worse
  fourPointReducesGap: false,

  // Candidate (C): structural / Montgomery PCC.
  montgomeryBandW: MONTGOMERY_PC_BAND_W,
  montgomeryBandGap: MONTGOMERY_BAND_GAP, // ~ 4.38e-5
  montgomeryReductionVsBaseline: MONTGOMERY_REDUCTION, // ~ 49x
  montgomeryRangeIsRHConditional: true, // circular for an unconditional closure
  residualIsStructuralPCC: true,

  minimalInputThatCloses:
    'NONE that is realistic and unconditional. The only inputs that drive the ' +
    'N-independent 2.153e-3 variance residual below the closure threshold ' +
    '(which, for the asymptotic sup-norm ESY observable, is residual -> 0) are ' +
    'themselves conjectures: (i) the Montgomery pair-correlation conjecture to ' +
    'certify the form factor min(|xi|, 1) on the high-pass band, or ' +
    '(ii) full-support 3-point correlation (W -> infinity), equivalent to the ' +
    'Bogomolny-Keating triple-correlation conjecture. A 4-point input is the ' +
    'wrong observable (orthogonal cumulant, narrower band) and increases the gap.',

  derivation:
    'Score three candidates against the exact ESY variance form-factor integral ' +
    'int exp(-4 pi |xi|) min(|xi|, 1) dxi (y_unfolded = 1, N-independent). ' +
    '(A) Wider band W: relative gap = int_{|xi|>W} / int_all shrinks ~ ' +
    'exp(-4 pi W); W = 1 gives 4.38e-5 (49x), W ~ 1.30 gives 1e-6, W = 2 gives ' +
    '2.31e-11 -- but every finite W leaves a fixed residual > 0, so only ' +
    'W -> infinity (full support = Bogomolny-Keating) strictly closes it, and ' +
    'no unconditional widening of RS96 (-2/3, 2/3) is known. (B) 4-point band ' +
    'W = 2/4 = 1/2 < 2/3 gives gap 1.360e-2, 6.3x LARGER; the variance gap is a ' +
    '2-point (kappa_2) object untouched by a kappa_4 input. (C) The W = 1 win is ' +
    'Montgomery pair-correlation range, RH-conditional; the high-pass form factor ' +
    'is the Montgomery PCC. So the residual is structural, not input-limited.',

  namedGap: Object.freeze({
    id: 'GAP-2441-ESY-VARIANCE-RESIDUAL-IS-PCC',
    severity: 'critical',
    sameAs: 'GAP-2422-HIGHPASS-FORMFACTOR-RESIDUAL',
    statement:
      'The N-independent 2.153e-3 ESY variance-form-factor residual is ' +
      'STRUCTURAL: it is the high-pass band of the pair-correlation form factor ' +
      'min(|xi|, 1) |hat_phi|^2. No realistic UNCONDITIONAL input closes it -- a ' +
      'wider band shrinks it ~ exp(-4 pi W) but is itself the unproven extension ' +
      'of RS96 support (full support = Bogomolny-Keating); a 4-point input is an ' +
      'orthogonal cumulant on a narrower band and increases the gap; and the ' +
      'pair-correlation range that would help (|xi| < 1) is RH-conditional ' +
      '(Montgomery), hence circular. The gap is tied to the Montgomery PCC ' +
      'obstruction, not input-limited.',
  }),

  references: Object.freeze({
    imp2422: 'src/data/imp-2422-bandwidth-restricted-esy-gap.js',
    imp2354: 'src/data/imp-2354-unrestricted-3point-esy-attempt.js',
    imp1180: 'src/data/imp-1180-higher-order-correlation-route.js',
    imp407: 'src/data/esy-rigidity-port.js',
    montgomery1973: 'Montgomery, Pair correlation of zeros of the zeta function, 1973',
    rudnickSarnak1996: 'Duke Math. J. 81, 269-322, Thm 1.1',
    bogomolnyKeating: 'Bogomolny-Keating 1996 triple correlation conjecture',
  }),
});

// =========================================================================
// BUILD-TIME TRIPWIRES (6 required, 7 shipped)
// =========================================================================

export const IMP_2441_ASSERTIONS = [
  {
    id: 'imp2441-verdict-honest-no-esy-closure',
    why:
      'The verdict must stay an honest partial -- structural gap, no ESY ' +
      'closure, no baseline improvement, no tightening at 1e6/1e7. Flipping any ' +
      'of these would overclaim against the PCC-tied residual.',
    holds: () => {
      const r = IMP_2441_MINIMAL_INPUT_TO_CLOSE_ESY_GAP;
      return r.verdict === 'esy-variance-gap-is-structural-PCC-no-unconditional-input-closes-it' &&
        r.isNewClosureOfESY === false &&
        r.isImprovementOver407Baseline === false &&
        r.tightensBoundAt1e6Or1e7 === false;
    },
  },
  {
    id: 'imp2441-baseline-gap-matches-imp2422',
    why:
      'The gap to be closed must reproduce the imp-2422 value 2.153e-3 at the ' +
      '3-point band W = 2/3. A drift would mean the kernel or band edge diverged ' +
      'from the parent ticket.',
    holds: () => {
      const g = IMP_2441_MINIMAL_INPUT_TO_CLOSE_ESY_GAP.baselineGapAt3PtBand;
      return g > 2.0e-3 && g < 2.3e-3;
    },
  },
  {
    id: 'imp2441-wider-band-shrinks-gap-monotonically',
    why:
      'Candidate (A): the variance gap must shrink monotonically as the band W ' +
      'widens (the high-pass residual loses mass). A non-monotone table would ' +
      'mean the in-band integral was mis-computed.',
    holds: () => {
      const t = IMP_2441_MINIMAL_INPUT_TO_CLOSE_ESY_GAP.bandwidthTable;
      for (let i = 1; i < t.length; i += 1) {
        if (!(t[i].varianceGap < t[i - 1].varianceGap)) return false;
      }
      return true;
    },
  },
  {
    id: 'imp2441-four-point-band-makes-gap-worse',
    why:
      'Candidate (B): the 4-point RS band 2/4 = 1/2 is NARROWER than 2/3, so as ' +
      'a substitute for the 2-point variance certification it must give a LARGER ' +
      'gap (reduction factor < 1). This encodes that a 4-point input is a ' +
      'non-help for the kappa_2 residual.',
    holds: () => {
      const r = IMP_2441_MINIMAL_INPUT_TO_CLOSE_ESY_GAP;
      return r.fourPointReducesGap === false &&
        r.fourPointVarianceGap > r.baselineGapAt3PtBand &&
        r.fourPointReductionVsBaseline < 1;
    },
  },
  {
    id: 'imp2441-montgomery-band-gives-49x-reduction',
    why:
      'Candidate (C): widening to the Montgomery pair-correlation band W = 1 cuts ' +
      'the gap by roughly 49x (to ~ 4.4e-5). This pins the magnitude of the ' +
      'would-be win that is forfeited because the |xi| < 1 range is RH-conditional.',
    holds: () => {
      const r = IMP_2441_MINIMAL_INPUT_TO_CLOSE_ESY_GAP;
      return r.montgomeryReductionVsBaseline > 40 &&
        r.montgomeryReductionVsBaseline < 60 &&
        r.montgomeryBandGap < 1e-4;
    },
  },
  {
    id: 'imp2441-no-finite-band-closes-needs-full-support',
    why:
      'The central honest finding: a wider band closes the gap NUMERICALLY but ' +
      'not UNCONDITIONALLY (every finite W leaves a residual > 0; full support is ' +
      'Bogomolny-Keating, and extending RS96 support is open). Both flags must ' +
      'reflect that.',
    holds: () => {
      const r = IMP_2441_MINIMAL_INPUT_TO_CLOSE_ESY_GAP;
      return r.widerBandClosesNumericallyOnly === true &&
        r.widerBandIsUnconditionallyAvailable === false &&
        r.bandwidthForPracticalTarget > 1 &&
        r.bandwidthForPracticalTarget < 2;
    },
  },
  {
    id: 'imp2441-named-gap-is-structural-and-links-2422',
    why:
      'The residual must be recorded as STRUCTURAL (PCC-tied) at severity ' +
      'critical and linked to GAP-2422-HIGHPASS-FORMFACTOR-RESIDUAL, so this is a ' +
      'sharpening of the same obstruction, not a new closure.',
    holds: () => {
      const r = IMP_2441_MINIMAL_INPUT_TO_CLOSE_ESY_GAP;
      const g = r.namedGap;
      return r.residualIsStructuralPCC === true &&
        g.id === 'GAP-2441-ESY-VARIANCE-RESIDUAL-IS-PCC' &&
        g.severity === 'critical' &&
        g.sameAs === 'GAP-2422-HIGHPASS-FORMFACTOR-RESIDUAL';
    },
  },
];
