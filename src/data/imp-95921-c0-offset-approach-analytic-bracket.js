/**
 * @module imp-95921-c0-offset-approach-analytic-bracket
 *
 * imp-95921 -- ANALYTIC BRACKET on the imp-95897 finite-height offset C0 approach
 * DIRECTION near T = 3e12, to decide (or bound) the monotonicity that imp-95897 left
 * UNDECIDED from the noise-dominated accessible data (regression slope 7.64e-4,
 * R^2 = 0.0007, interior max at 1.5e5). Assessment only; changes no bound; NO QED.
 *
 * SETUP (imp-95722 / imp-95897). offset(T) = measuredVar(T) - Selberg term, where
 * measuredVar(T) = sd(C - E)^2 is the imp-95562 windowed BOX number variance
 * Sigma^2(L(T)) of a hard box of half-width Delta = sqrt(T/2pi) containing on average
 * L(T) = 2 Delta delta(T) zeros, and the Selberg term is S_Sel(T) =
 * (1/2pi^2) log log(T/2pi). C0 is pinned as the MAX of offset over the six accessible
 * heights T = 1e4..5e5 (all BELOW the imp-95519 window bottom 3e12), and enters r_cap as
 * an UPPER envelope anchor, so envelope-safety needs offset(T) <= C0 for all T >= 3e12.
 * imp-95897 could not decide the sign of the approach from the data; this module attacks
 * it analytically via the number-variance SATURATION law plus the imp-95562 windowing
 * slack, exactly the two pieces imp-95897 named as conflated in the O(1) remainder.
 *
 * PIECE A -- SATURATION of the box number variance (Berry 1988; Bogomolny-Keating).
 * The box number variance has two regimes split by the outer scale L_max ~
 * (1/2pi) log(T/2pi) (the effective prime count ~ log T): for L << L_max it follows the
 * universal GUE form Sigma^2_GUE(L) = (1/pi^2)[log(2pi L) + gamma + 1] (log-GROWING);
 * for L >> L_max it SATURATES, stopping its growth in L and instead tracking only
 * log(2pi L_max) = log log(T/2pi). The saturated value equals TWICE Selberg Var S(T)
 * (the box has two decorrelated endpoints, each contributing Var S(T) ~
 * (1/2pi^2) log log(T/2pi)), i.e.
 *     Sigma^2_sat(T) = (1/pi^2) log log(T/2pi) + (1/pi^2)(gamma + 1 + a_0),
 * with a_0 an O(1) arithmetic (prime-sum) constant. Our regime is DEEP saturation:
 * L(T)/L_max ranges 80 (T=1e4) to 564 (T=5e5) to 1.38e6 (T=3e12), all >> 1, so the
 * measured variance is fully saturated at every accessible height AND at 3e12 -- which is
 * exactly why the accessible measuredVar sits at ~40 pct of the (still-growing) GUE
 * curve (imp-95562 finding 4), not a defect but the saturated regime.
 *
 * BRACKET (the DECISIVE step). Because the saturated box variance carries a
 * (1/pi^2) log log coefficient while S_Sel subtracts only (1/2pi^2) log log (a SINGLE
 * endpoint), the difference does NOT cancel to a constant:
 *     offset(T) = Sigma^2_sat(T) - S_Sel(T)
 *               = (1/pi^2 - 1/2pi^2) log log(T/2pi) + (1/pi^2)(gamma + 1 + a_0)
 *               = (1/2pi^2) log log(T/2pi) + const.
 * So the analytic APPROACH DIRECTION near 3e12 is UPWARD (rising in log log T with the
 * exact slope d offset / d loglog = 1/2pi^2 = 0.05066), the OPPOSITE of the imp-95884 /
 * imp-95897 downward-drift hazard (which feared offset FALLS to a finite Selberg
 * asymptote so a high-block value lands below the true finite-height offset). The rise
 * over the accessible top 5e5 to the window bottom 3e12 is
 *     Delta offset = (1/2pi^2)(loglog(3e12) - loglog(5e5)) = (0.05066)(0.8684) = +0.0440,
 * which is well INSIDE the max-anchor cushion C0 - offset(5e5) = 0.3337 - 0.2466 =
 * +0.0871. So offset(3e12) ~ 0.291 < C0 = 0.334: the max-over-accessible-heights anchor
 * REMAINS a valid upper envelope through 3e12, now for a POSITIVE reason (bounded upward
 * drift inside the cushion) rather than the conservative no-monotonicity assumption.
 *
 * PIECE B -- windowing-identification slack (imp-95562). The gap between the windowed
 * box count C and the mean-square envelope E is ADDITIVE and O(1-2) zeros, with relative
 * size maxExcess/L decaying ~1/L (2.18e-2 at 1e4 down to 1.79e-3 at 5e5). At 3e12,
 * L = 5.9e6, so the additive worst excess relative to the envelope is ~3.0e-7 -- utterly
 * negligible and unable to flip the sign of the log log drift. The windowing slack is
 * thus BRACKETED AWAY near 3e12: it cannot rescue the downward-drift hazard.
 *
 * WHERE THE ENVELOPE FINALLY CROSSES (the honest ceiling and its sub-gap). Because
 * offset grows without bound (~ (1/2pi^2) log log), C0 is NOT an upper envelope on the
 * FULL [3e12, infinity): the drift line reaches C0 at a finite crossing height. Anchored
 * at the LOW accessible top offset(5e5) = 0.2466 the crossing is T_x ~ 1.36e28; anchored
 * at the noise-limited MEAN offset 0.2618 (imp-95787) it is T_x ~ 5.8e17. Either way the
 * safe super-window comfortably CONTAINS 3e12 (and the imp-95729 crossover 1.14e9); the
 * imp-95884 high-block range 1e20..1e23 lands RIGHT AT the C0 boundary (offset_pred(1e20)
 * = 0.316, offset_pred(1e23) = 0.323 from the low anchor, both just below C0 = 0.334, but
 * ABOVE it from the mean anchor) -- so high blocks are unsafe to substitute for the NEW
 * reason that they may sit ABOVE C0, not below it. The SUB-GAP: the safe ceiling is a
 * RANGE [~5.8e17, ~1.36e28], not a point, because the O(1) arithmetic intercept
 * (gamma + 1 + a_0) is not analytically pinned -- only the log log SLOPE 1/2pi^2 is.
 *
 * DECISION. The approach direction near 3e12 is DECIDED: offset(T) drifts UPWARD, not
 * downward, with analytic slope d offset / d loglog = 1/2pi^2, refuting the imp-95884 /
 * imp-95897 downward-drift hazard on the finite span [5e5, 3e12]. The max-anchor C0
 * remains a valid upper envelope through 3e12 (the +0.044 rise fits inside the +0.087
 * cushion), and the windowing slack (~3e-7 at 3e12) cannot flip this. This turns the
 * envelope-safety from resting SOLELY on the conservative no-monotonicity assumption into
 * resting on a bounded-upward-drift bracket. It does NOT establish envelope-safety on the
 * full [3e12, infinity): offset grows unboundedly, so C0 fails as an envelope beyond a
 * finite crossing height T_x in [~5.8e17, ~1.36e28], the range set by the unpinned O(1)
 * arithmetic intercept (named sub-gap). Changes no bound; NO QED.
 *
 * VERDICT. ASSESSMENT (frontier envelope-safety analytic bracket, NOT rigorous). Via the
 * Berry / Bogomolny-Keating number-variance SATURATION law -- the box variance saturates
 * to TWICE Selberg Var S(T), carrying a (1/pi^2) log log coefficient while the offset
 * subtracts only the single-endpoint (1/2pi^2) log log -- the finite-height offset drifts
 * UPWARD near 3e12 with the exact analytic slope d offset / d loglog = 1/2pi^2 = 0.05066,
 * REVERSING the imp-95884 / imp-95897 downward-drift hazard. Our regime is deep saturation
 * (L / L_max ~ 1.38e6 at 3e12), the imp-95562 windowing slack is ~3e-7 at 3e12 and cannot
 * flip the sign, and the +0.044 rise over [5e5, 3e12] fits inside the +0.087 max-anchor
 * cushion, so C0 REMAINS a valid upper envelope through 3e12 for a POSITIVE (bounded
 * upward-drift) reason rather than the conservative no-monotonicity assumption. The safe
 * ceiling is bounded, NOT infinite: offset grows ~ (1/2pi^2) log log without bound and
 * crosses C0 at T_x in [~5.8e17, ~1.36e28], the range fixed by the unpinned O(1) arithmetic
 * intercept -- the named sub-gap imp-95921-subgap-arithmetic-intercept. The saturation law
 * itself is semiclassical / Selberg-identity based, so this is an ASSESSMENT, not rigorous.
 * Changes no bound; NO QED; Catalan G irrationality OPEN; Sun arXiv:2609.04176
 * single-author unrefereed; the zero-side route stays PCC / GRH-gated; no refereed bound is changed.
 *
 * Import-light: no zeros bundle, no sibling imports. The r_cap / envelope closed forms and
 * the six imp-95710 / imp-95562 measured sd(C - E) literals are recomputed here exactly as
 * imp-95722 / imp-95897 define them; the bracket figures are derived analytically from
 * those literals plus the saturation slope 1/2pi^2.
 *
 * @see imp-95897-c0-offset-monotonicity-envelope-safety (left the approach direction UNDECIDED)
 * @see imp-95884-odlyzko-high-block-calibration-assessment (raised the downward-drift hazard)
 * @see imp-95722-number-variance-ratio-window-bottom-bound (r_cap envelope; C0 = max offset)
 * @see imp-95562-meansquare-vs-pointwise-gap (windowing slack: additive, ~1/L decaying)
 */

const TWO_PI = 2 * Math.PI;
const EULER = 0.5772156649015329;

// imp-95722 / imp-95897 closed forms (verbatim).
const zeroDensity = (T) => Math.log(T / TWO_PI) / TWO_PI; // delta(T)
const halfWidth = (T) => Math.sqrt(T / TWO_PI); // Delta = sqrt(v), v = T/2pi
const envelopeCount = (T) => 2 * halfWidth(T) * zeroDensity(T); // L = 2 Delta delta
const gueNumberVariance = (L) => (Math.log(TWO_PI * L) + EULER + 1) / (Math.PI * Math.PI);
const SELBERG_C = 1 / (2 * Math.PI * Math.PI); // single-endpoint Selberg coeff (1/2pi^2)
const SAT_C = 1 / (Math.PI * Math.PI); // saturated box-variance coeff = 2 * Selberg
const logLog = (T) => Math.log(Math.log(T / TWO_PI));
const outerScaleLmax = (T) => Math.log(T / TWO_PI) / TWO_PI; // L_max ~ (1/2pi) log(T/2pi)

// Same six measured literals imp-95710 / imp-95897 baked (imp-95562 over the 10^6 Odlyzko ordinates).
const MEASURED = [
  { Tc: 1.0e4, sd: 0.6218, maxPosExcess: 2.028 },
  { Tc: 3.0e4, sd: 0.5823, maxPosExcess: 1.494 },
  { Tc: 7.0e4, sd: 0.5689, maxPosExcess: 1.397 },
  { Tc: 1.5e5, sd: 0.6714, maxPosExcess: 1.669 },
  { Tc: 3.0e5, sd: 0.6199, maxPosExcess: 1.939 },
  { Tc: 5.0e5, sd: 0.6078, maxPosExcess: 1.752 },
];

const offsetRows = MEASURED.map((m) => {
  const measuredVar = m.sd * m.sd;
  return {
    Tc: m.Tc,
    loglog: logLog(m.Tc),
    measuredVar,
    offset: measuredVar - SELBERG_C * logLog(m.Tc),
    L: envelopeCount(m.Tc),
    Lmax: outerScaleLmax(m.Tc),
  };
});

const C0 = Math.max(...offsetRows.map((r) => r.offset)); // envelope anchor (max over heights)
const topRow = offsetRows[offsetRows.length - 1]; // T = 5e5, accessible top
const offsetTop = topRow.offset;
const offsetMean = offsetRows.reduce((s, r) => s + r.offset, 0) / offsetRows.length;

// Deep-saturation check across the sampled + target heights (L / L_max >> 1 everywhere).
const saturationRatios = offsetRows.map((r) => r.L / r.Lmax);
const minSaturationRatio = Math.min(...saturationRatios);

// --- PIECE A: the analytic upward drift slope and the [5e5, 3e12] rise ---
const WINDOW_BOTTOM_T = 3.0e12;
const APPROACH_SLOPE = SELBERG_C; // d offset / d loglog = 1/pi^2 - 1/2pi^2 = 1/2pi^2
const dLogLogToWindow = logLog(WINDOW_BOTTOM_T) - topRow.loglog;
const riseToWindow = APPROACH_SLOPE * dLogLogToWindow; // + drift over [5e5, 3e12]
const offsetAtWindowLowAnchor = offsetTop + riseToWindow; // growth-model offset(3e12)
const anchorCushion = C0 - offsetTop; // headroom the max-anchor buys

// --- PIECE B: windowing slack at 3e12 (imp-95562 additive, ~1/L decaying) ---
const worstExcessTop = MEASURED[MEASURED.length - 1].maxPosExcess; // ~1.75 zeros at 5e5
const windowingRelSlackAtWindow = worstExcessTop / envelopeCount(WINDOW_BOTTOM_T); // ~3e-7

// --- crossing heights: where the upward drift line reaches C0 (the safe ceiling range) ---
const crossingT = (anchorOffset, anchorLogLog) => {
  const targetLogLog = anchorLogLog + (C0 - anchorOffset) / APPROACH_SLOPE;
  return TWO_PI * Math.exp(Math.exp(targetLogLog));
};
const crossingLowAnchor = crossingT(offsetTop, topRow.loglog); // ~1.36e28 (low top anchor)
const meanLogLog = offsetRows.reduce((s, r) => s + r.loglog, 0) / offsetRows.length;
const crossingMeanAnchor = crossingT(offsetMean, meanLogLog); // ~5.8e17 (noise-limited mean)

// high-block predictions (imp-95884 range) from the low anchor
const offsetPredAt = (T) => offsetTop + APPROACH_SLOPE * (logLog(T) - topRow.loglog);
const highBlockPreds = [1.0e20, 1.0e23].map((T) => ({ T, offsetPred: offsetPredAt(T), belowC0: offsetPredAt(T) < C0 }));

export const IMP95921_C0_OFFSET_APPROACH_ANALYTIC_BRACKET = {
  ticket: 'imp-95921',
  proofSection: 'S-frontier',
  question:
    'imp-95897 left the finite-height offset C0 approach direction near T = 3e12 UNDECIDED ' +
    '(noise-dominated: slope 7.64e-4, R^2 = 0.0007, interior max at 1.5e5). Attempt an analytic ' +
    'bracket on the Selberg O(1) remainder plus the imp-95562 windowing slack to decide (or bound) ' +
    'the approach direction, so the max-anchor envelope-safety no longer rests solely on the ' +
    'conservative no-monotonicity assumption. Assessment only; NO QED.',
  method:
    'Use the Berry / Bogomolny-Keating number-variance SATURATION law: for L >> L_max the box ' +
    'variance stops growing in L and tracks log log(T/2pi), saturating to TWICE Selberg Var S(T). ' +
    'Subtracting the single-endpoint Selberg term (1/2pi^2) log log leaves offset(T) with a residual ' +
    '(1/2pi^2) log log growth, giving an analytic approach slope; bracket the imp-95562 windowing ' +
    'slack (~1/L) at 3e12 and locate where the drift line crosses C0.',
  constants: {
    selbergCoeff: SELBERG_C, // 1/2pi^2 -- single-endpoint Selberg / the residual offset slope
    saturatedBoxVarCoeff: SAT_C, // 1/pi^2 = 2 * Selberg -- saturated box number-variance coeff
    approachSlopeDOffsetDLogLog: APPROACH_SLOPE, // 1/pi^2 - 1/2pi^2 = 1/2pi^2 (UPWARD)
  },
  offsetRows,
  offsetC0: C0, // ~0.3337 -- the sole empirical input, same anchor imp-95722 uses
  saturation: {
    minLOverLmax: minSaturationRatio, // ~80 -- deep saturation at every accessible height
    windowLOverLmax: envelopeCount(WINDOW_BOTTOM_T) / outerScaleLmax(WINDOW_BOTTOM_T), // ~1.38e6 at 3e12
    note:
      'L / L_max >> 1 at every sampled height AND at 3e12, so measuredVar is fully saturated; this ' +
      'is why the accessible measuredVar is ~40 pct of the still-growing GUE curve (imp-95562 F4).',
  },
  approachBracket: {
    windowBottomT: WINDOW_BOTTOM_T,
    dLogLogToWindow, // loglog(3e12) - loglog(5e5)
    riseToWindow, // +0.044 -- bounded UPWARD drift over [5e5, 3e12]
    offsetTop, // offset(5e5) = 0.2466
    offsetAtWindowLowAnchor, // ~0.291 growth-model offset(3e12)
    anchorCushion, // +0.087 = C0 - offset(5e5) -- the max-anchor headroom
    riseFitsInsideCushion: riseToWindow < anchorCushion, // true: envelope holds through 3e12
    windowingRelSlackAtWindow, // ~3e-7 -- imp-95562 slack, cannot flip the sign
  },
  safeCeiling: {
    crossingLowAnchor, // ~1.36e28 -- from the LOW accessible-top offset(5e5)
    crossingMeanAnchor, // ~5.8e17 -- from the noise-limited MEAN offset (imp-95787)
    highBlockPreds, // imp-95884 range 1e20..1e23 sits RIGHT AT the C0 boundary (low anchor: just below)
    subGap: 'imp-95921-subgap-arithmetic-intercept',
    note:
      'offset grows ~ (1/2pi^2) log log without bound, so C0 is NOT an envelope on the full ' +
      '[3e12, infinity); the safe ceiling is the RANGE [~5.8e17, ~1.36e28], its width set by the ' +
      'unpinned O(1) arithmetic intercept (gamma + 1 + a_0). Only the log log SLOPE 1/2pi^2 is analytic.',
  },
  findings: {
    approachDirectionUpward:
      'The saturated box variance carries a (1/pi^2) log log coefficient (= 2 * Selberg Var S, two ' +
      'decorrelated box endpoints) while offset subtracts only the single-endpoint (1/2pi^2) log log, ' +
      'so offset(T) = (1/2pi^2) log log(T/2pi) + const drifts UPWARD near 3e12 -- the OPPOSITE of the ' +
      'imp-95884 / imp-95897 downward-drift-to-a-finite-asymptote hazard.',
    deepSaturationRegime:
      'L / L_max ranges 80 (1e4) to 564 (5e5) to 1.38e6 (3e12), all >> 1, so measuredVar is fully in ' +
      'the saturated regime everywhere; the accessible ~40 pct-of-GUE ratio (imp-95562 F4) is that ' +
      'saturation, not a defect, and it PERSISTS to 3e12.',
    envelopeHoldsThroughWindow:
      'The upward rise over [5e5, 3e12] is only +0.044, inside the max-anchor cushion C0 - offset(5e5) ' +
      '= +0.087, so offset(3e12) ~ 0.291 < C0 = 0.334; the max-over-accessible-heights anchor REMAINS a ' +
      'valid upper envelope through 3e12 for a POSITIVE (bounded upward-drift) reason, not merely the ' +
      'conservative no-monotonicity assumption. The imp-95562 windowing slack is ~3e-7 at 3e12 and ' +
      'cannot flip this.',
    ceilingIsBoundedNotInfinite:
      'Because offset grows unboundedly, C0 fails as an envelope beyond a finite crossing height T_x in ' +
      '[~5.8e17, ~1.36e28] (the range fixed by the unpinned O(1) arithmetic intercept); the imp-95884 ' +
      'high blocks 1e20..1e23 land RIGHT AT the C0 boundary. Sub-gap: pin the arithmetic intercept ' +
      'gamma + 1 + a_0 to collapse the ceiling range to a point.',
  },
  isRigorous: false,
  decision:
    'APPROACH DIRECTION DECIDED (upward). Via the Berry / Bogomolny-Keating number-variance saturation ' +
    'law the finite-height offset drifts UPWARD near 3e12 with analytic slope d offset / d loglog = ' +
    '1/2pi^2 = 0.05066, refuting the imp-95884 / imp-95897 downward-drift hazard on the finite span ' +
    '[5e5, 3e12]. The +0.044 rise fits inside the +0.087 max-anchor cushion and the imp-95562 windowing ' +
    'slack is ~3e-7 at 3e12, so the max-over-accessible-heights anchor C0 REMAINS a valid upper envelope ' +
    'through 3e12 for a bounded-upward-drift reason, replacing the conservative no-monotonicity ' +
    'assumption. It does NOT establish envelope-safety on the full [3e12, infinity): offset grows ' +
    'unboundedly and crosses C0 at T_x in [~5.8e17, ~1.36e28], the range set by the unpinned O(1) ' +
    'arithmetic intercept (named sub-gap imp-95921-subgap-arithmetic-intercept).',
  verdict:
    'ASSESSMENT (frontier envelope-safety analytic bracket, NOT rigorous). The saturated box number ' +
    'variance equals TWICE Selberg Var S(T) (a (1/pi^2) log log coefficient), while offset subtracts ' +
    'only the single-endpoint (1/2pi^2) log log, so offset(T) drifts UPWARD near 3e12 with the exact ' +
    'analytic slope d offset / d loglog = 1/2pi^2 = 0.05066 -- REVERSING the imp-95884 / imp-95897 ' +
    'downward-drift hazard. Our regime is deep saturation (L / L_max ~ 1.38e6 at 3e12), the imp-95562 ' +
    'windowing slack is ~3e-7 at 3e12 and cannot flip the sign, and the +0.044 rise over [5e5, 3e12] ' +
    'fits inside the +0.087 max-anchor cushion, so C0 REMAINS a valid upper envelope through 3e12 for a ' +
    'POSITIVE (bounded upward-drift) reason rather than the conservative no-monotonicity assumption. The ' +
    'safe ceiling is bounded, NOT infinite: offset grows ~ (1/2pi^2) log log without bound and crosses ' +
    'C0 at T_x in [~5.8e17, ~1.36e28], the range fixed by the unpinned O(1) arithmetic intercept -- the ' +
    'named sub-gap imp-95921-subgap-arithmetic-intercept. The saturation law is semiclassical / ' +
    'Selberg-identity based, so this is an ASSESSMENT, not rigorous. Changes no bound; NO QED; Catalan G ' +
    'irrationality OPEN; Sun arXiv:2609.04176 single-author unrefereed; the zero-side route stays ' +
    'PCC / GRH-gated; no refereed bound is changed.',
  citation:
    'imp-95897 (offset approach direction UNDECIDED); imp-95884 (downward-drift hazard); imp-95722 ' +
    '(r_cap envelope, C0 = max offset); imp-95562 (windowing slack additive ~1/L); imp-95787 (mean ' +
    'offset 0.2618); Berry 1988 / Bogomolny-Keating (number-variance saturation = 2 x Selberg Var S).',
};

// --- self-executing internal-consistency assertions (baked-literal re-derivation only) ---
(() => {
  const approx = (a, b, tol) => Math.abs(a - b) <= tol;
  // C0 reproduces the imp-95722 / imp-95897 pinned offset (~0.3337).
  if (!approx(C0, 0.3337213835371905, 1e-9))
    throw new Error('imp-95921: C0 drifted from the imp-95722 / imp-95897 pinned offset');
  // saturated box-variance coefficient is exactly twice the single-endpoint Selberg coefficient.
  if (!approx(SAT_C, 2 * SELBERG_C, 1e-15))
    throw new Error('imp-95921: saturated coeff must be twice the Selberg coeff');
  // the residual approach slope is exactly the single-endpoint Selberg coeff and POSITIVE (upward).
  if (!approx(APPROACH_SLOPE, SAT_C - SELBERG_C, 1e-15))
    throw new Error('imp-95921: approach slope must be SAT_C - SELBERG_C = 1/2pi^2');
  if (!(APPROACH_SLOPE > 0)) throw new Error('imp-95921: approach slope must be positive (upward drift)');
  // deep saturation at every sampled height and at 3e12 (L / L_max >> 1).
  if (!(minSaturationRatio > 50)) throw new Error('imp-95921: not deep saturation at some accessible height');
  if (!(envelopeCount(WINDOW_BOTTOM_T) / outerScaleLmax(WINDOW_BOTTOM_T) > 1e5))
    throw new Error('imp-95921: 3e12 must be deeply saturated');
  // the [5e5, 3e12] rise is bounded and fits inside the max-anchor cushion (envelope holds through 3e12).
  if (!approx(riseToWindow, 0.0440, 5e-3)) throw new Error('imp-95921: rise-to-window disagrees with the bracket');
  if (!(riseToWindow < anchorCushion)) throw new Error('imp-95921: rise must fit inside the max-anchor cushion');
  if (!(offsetAtWindowLowAnchor < C0)) throw new Error('imp-95921: growth-model offset(3e12) must stay below C0');
  // the windowing slack at 3e12 is negligible (~3e-7) and cannot flip the sign.
  if (!(windowingRelSlackAtWindow < 1e-5)) throw new Error('imp-95921: windowing slack at 3e12 not negligible');
  // the safe ceiling is a bounded range comfortably above 3e12 (mean anchor >> 3e12, low anchor larger).
  if (!(crossingMeanAnchor > WINDOW_BOTTOM_T * 1e3)) throw new Error('imp-95921: mean-anchor ceiling must exceed 3e12');
  if (!(crossingLowAnchor > crossingMeanAnchor)) throw new Error('imp-95921: low-anchor ceiling must exceed mean-anchor');
  // honesty gates: assessment only, no QED, sub-gap named, no refereed bound is changed.
  if (IMP95921_C0_OFFSET_APPROACH_ANALYTIC_BRACKET.isRigorous !== false)
    throw new Error('imp-95921: isRigorous must be false');
  if (!/NO QED/.test(IMP95921_C0_OFFSET_APPROACH_ANALYTIC_BRACKET.verdict))
    throw new Error('imp-95921: verdict dropped the NO QED banner');
  if (!/imp-95921-subgap-arithmetic-intercept/.test(IMP95921_C0_OFFSET_APPROACH_ANALYTIC_BRACKET.verdict))
    throw new Error('imp-95921: verdict dropped the named sub-gap');
  if (!/refereed bound is changed/i.test(IMP95921_C0_OFFSET_APPROACH_ANALYTIC_BRACKET.verdict))
    throw new Error('imp-95921: verdict dropped the no-refereed-bound-change banner');
})();

export default IMP95921_C0_OFFSET_APPROACH_ANALYTIC_BRACKET;
