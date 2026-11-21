/**
 * @module imp-95897-c0-offset-monotonicity-envelope-safety
 *
 * imp-95897 -- DECIDING whether the imp-95722 finite-height offset C0 (offset(T) =
 * measuredVar - Selberg term, the sole empirically-pinned r_cap input, ~63-67 pct of the
 * capped numerator) is MONOTONE in T over [3e12, infinity), and therefore whether
 * substituting an Odlyzko high-block (T = 10^20..10^23) offset for C0 would push
 * r_cap(3e12) BELOW the true r(3e12) and BREAK the upper-envelope property flagged by
 * imp-95884 (C). Assessment only; changes no bound; NO QED.
 *
 * SETUP (imp-95722 / imp-95884). r_cap(T) = [ (1/2pi^2) log log(T/2pi) + C0 ] /
 * Sigma^2(L(T)). Every factor except C0 is an analytic closed form exact at every T. C0 is
 * the FINITE-HEIGHT offset, pinned as the MAX over the six imp-95710 heights T = 1e4..5e5
 * of offset(T) = measuredVar(T) - (1/2pi^2) log log(T/2pi). Because C0 enters as an upper
 * ENVELOPE anchor (a max, so r_cap >= r at every sampled height), the envelope-safety of
 * r_cap(3e12) hinges on whether offset(T) is monotone: if offset(T) falls monotonically
 * toward a Selberg asymptote, a near-asymptotic high-block offset is NOT the max over the
 * [3e12, .) regime, so substituting it lowers r_cap below true r and breaks r_cap >= r.
 *
 * MEASUREMENT (the six accessible offsets, recomputed from the imp-95710 / imp-95562 sd
 * literals). offset(T) across T = 1e4..5e5 is:
 *   1e4 -> 0.285428, 3e4 -> 0.230829, 7e4 -> 0.210573, 1.5e5 -> 0.333721,
 *   3e5 -> 0.263850, 5e5 -> 0.246648.
 *
 * FINDINGS.
 *  1. The accessible offset is NOT monotone. It bounces (down, down, UP to its max, down,
 *     down); a log-linear regression of offset on log T has slope 7.64e-4 and R^2 = 0.0007
 *     -- statistically indistinguishable from zero. The 0.211..0.334 spread (0.123, ~47 pct
 *     of the 0.262 mean) is the SAME ~11 pct sd(C - E) measurement scatter imp-95710 already
 *     flagged as noise-dominated, not a trend.
 *  2. The envelope anchor C0 = max = 0.333721 is attained at an INTERIOR height (T = 1.5e5),
 *     NOT an endpoint. An interior maximum is structurally INCOMPATIBLE with a monotone
 *     offset: it is the sd(C - E) noise spike (measuredVar = 0.451 at 1.5e5), not an
 *     asymptotic feature. So the accessible data do not merely fail to confirm monotonicity
 *     -- their shape argues AGAINST a clean monotone offset over the measured window.
 *  3. Analytic structure. offset(T) conflates two finite-height pieces: the Selberg O(1)
 *     remainder in Var S(T) = (1/2pi^2) log log(T/2pi) + O(1), and the imp-95562 windowing
 *     identification slack (sd(C - E) is only IDENTIFIED with Sigma_S^2, not equal to it).
 *     Selberg forces offset(T) to approach a FINITE asymptote as T -> infinity, but the
 *     finite-height APPROACH DIRECTION near 3e12 is set by that O(1)-plus-windowing
 *     remainder, which the noise-dominated accessible data (R^2 ~ 0, interior max) leave
 *     UNDETERMINED. Monotonicity over [3e12, .) is therefore UNDECIDED from the evidence.
 *  4. Envelope-safety quantification. r_cap(3e12) moves linearly with the offset: using the
 *     accessible max (0.3338) gives r_cap(3e12) = 0.25987; using the accessible MIN (0.2106)
 *     would give 0.19593 -- a 0.064 (~25 pct) DROP. So the difference between the max-anchor
 *     and any lower substituted offset is exactly the margin protecting r_cap >= r; a
 *     substitution that lands below the true finite-height offset near 3e12 breaks the
 *     envelope by a fully material amount, not a rounding wobble.
 *
 * DECISION. Monotonicity of C0 over [3e12, infinity) is UNDECIDED (noise-dominated, R^2 ~ 0,
 * interior max). Consequently the imp-95884 (C) hazard is CONFIRMED on the CONSERVATIVE side:
 * because monotonicity is neither established NOR structurally plausible (the accessible max
 * is interior), substituting a single near-asymptotic high-block offset for C0 is UNSAFE --
 * IF the offset does drift downward to its Selberg asymptote, the high-block value sits below
 * the finite-height offset near 3e12 and pushes r_cap(3e12) below true r(3e12), breaking the
 * upper-envelope property (a ~25 pct drop in the worst case measured here). The current
 * construction -- C0 = MAX over the accessible heights -- is the envelope-safe choice
 * PRECISELY because it assumes no monotonicity; it must be RETAINED, and high-block offsets
 * must NOT be substituted. This neither tightens nor loosens r_cap(3e12); it certifies that
 * the existing max-anchor is the correct, safe construction.
 *
 * VERDICT. ASSESSMENT (frontier envelope-safety analysis, NOT rigorous). The finite-height
 * offset C0 is NOT demonstrably monotone in T: across the accessible window T = 1e4..5e5 it
 * is noise-dominated (regression slope 7.64e-4, R^2 = 0.0007) with its maximum at an INTERIOR
 * height (1.5e5), a shape incompatible with monotonicity. Selberg forces a finite asymptote
 * but leaves the finite-height approach direction near 3e12 undetermined, further blurred by
 * the imp-95562 windowing-identification slack. Monotonicity over [3e12, infinity) is thus
 * UNDECIDED, which CONFIRMS the imp-95884 (C) hazard on the conservative side: a high-block
 * offset substitution could drop r_cap(3e12) from 0.260 to as low as 0.196 (~25 pct) and
 * break the upper-envelope r_cap >= r, so it must NOT be performed; the max-over-accessible
 * -heights anchor is retained as the envelope-safe construction. Changes no bound; NO QED;
 * the zero-side route stays PCC / GRH-gated; no refereed bound is changed.
 *
 * Import-light: no zeros bundle, no sibling imports. The r_cap closed forms and the six
 * imp-95710 / imp-95562 measured sd(C - E) literals are recomputed here exactly as imp-95722
 * defines them; the offset trend and envelope-band figures are derived from those literals.
 *
 * @see imp-95722-number-variance-ratio-window-bottom-bound (r_cap envelope; C0 = max offset)
 * @see imp-95884-odlyzko-high-block-calibration-assessment (raised the (C) envelope-safety hazard)
 * @see imp-95710 / imp-95562 (six measured sd(C - E) literals; noise-dominated finite-height data)
 * @see imp-95921-c0-offset-approach-analytic-bracket -- SUPERSEDES the UNDECIDED verdict below:
 *   the saturated box number variance decides the approach direction analytically (UPWARD near
 *   3e12, slope 1/2pi^2), inside the max-anchor cushion but crossing C0 at a finite T_x. Readers
 *   citing this module's "monotonicity UNDECIDED" finding should cite imp-95921 instead.
 * @see imp-95973-six-point-noise-domination-wall-glossary-headword (shared nav index: this
 *   module's raw-slope R^2 = 0.0007 finding is one of four symptoms of the same noise-dominated
 *   six-point sample -- read that headword first if landing here cold)
 */

const TWO_PI = 2 * Math.PI;
const EULER = 0.5772156649015329;

// imp-95722 closed forms (verbatim), so the assessment reuses the exact envelope.
const zeroDensity = (T) => Math.log(T / TWO_PI) / TWO_PI;
const halfWidth = (T) => Math.sqrt(T / TWO_PI);
const envelopeCount = (T) => 2 * halfWidth(T) * zeroDensity(T); // L = 2 Delta delta(T)
const gueNumberVariance = (L) => (Math.log(TWO_PI * L) + EULER + 1) / (Math.PI * Math.PI);
const SELBERG_C = 1 / (2 * Math.PI * Math.PI); // (1/2pi^2)
const logLog = (T) => Math.log(Math.log(T / TWO_PI));

// Same six measured literals imp-95710 baked (imp-95562 over the 10^6 Odlyzko ordinates).
const MEASURED = [
  { Tc: 1.0e4, sd: 0.6218 },
  { Tc: 3.0e4, sd: 0.5823 },
  { Tc: 7.0e4, sd: 0.5689 },
  { Tc: 1.5e5, sd: 0.6714 },
  { Tc: 3.0e5, sd: 0.6199 },
  { Tc: 5.0e5, sd: 0.6078 },
];

// offset(T) = measuredVar(T) - Selberg term; the finite-height piece that C0 pins.
const offsetRows = MEASURED.map((m) => {
  const measuredVar = m.sd * m.sd;
  const selbergTerm = SELBERG_C * logLog(m.Tc);
  return {
    Tc: m.Tc,
    logT: Math.log(m.Tc),
    measuredVar,
    selbergTerm,
    offset: measuredVar - selbergTerm,
  };
});

const C0 = Math.max(...offsetRows.map((r) => r.offset)); // envelope anchor (max over heights)
const argmaxRow = offsetRows.find((r) => r.offset === C0); // where the max is attained
const offsetMin = Math.min(...offsetRows.map((r) => r.offset));
const offsetMean = offsetRows.reduce((s, r) => s + r.offset, 0) / offsetRows.length;
const offsetSpread = C0 - offsetMin;

// Log-linear regression offset ~ a + b log T (is the offset monotone/trending, or noise?).
const n = offsetRows.length;
const meanX = offsetRows.reduce((s, r) => s + r.logT, 0) / n;
const meanY = offsetMean;
let sxy = 0;
let sxx = 0;
let syy = 0;
for (const r of offsetRows) {
  sxy += (r.logT - meanX) * (r.offset - meanY);
  sxx += (r.logT - meanX) * (r.logT - meanX);
  syy += (r.offset - meanY) * (r.offset - meanY);
}
const offsetSlope = sxy / sxx; // near zero => no monotone trend
const offsetR2 = (sxy * sxy) / (sxx * syy); // ~0 => noise-dominated

// The max sits at an INTERIOR height (not the first or last row) -- incompatible with monotone.
const maxAtInterior =
  argmaxRow.Tc !== offsetRows[0].Tc && argmaxRow.Tc !== offsetRows[offsetRows.length - 1].Tc;

// Envelope-safety band: how much r_cap(3e12) moves if a lower offset is substituted for C0.
const WINDOW_BOTTOM_T = 3.0e12;
const rCapAt = (T, off) => (SELBERG_C * logLog(T) + off) / gueNumberVariance(envelopeCount(T));
const rCapMaxAnchor = rCapAt(WINDOW_BOTTOM_T, C0); // ~0.260 -- the imp-95722 value
const rCapMinOffset = rCapAt(WINDOW_BOTTOM_T, offsetMin); // ~0.196 -- if the offset drifted low
const envelopeBandDrop = rCapMaxAnchor - rCapMinOffset; // material margin, not a rounding wobble

export const IMP95897_C0_OFFSET_MONOTONICITY_ENVELOPE_SAFETY = {
  ticket: 'imp-95897',
  proofSection: 'S-frontier',
  question:
    'Is the imp-95722 finite-height offset C0 (offset(T) = measuredVar - Selberg term) monotone in ' +
    'T over [3e12, infinity)? If so, substituting an Odlyzko high-block (T = 10^20..10^23) offset ' +
    'for C0 could push r_cap(3e12) below true r(3e12) and BREAK the upper-envelope property. ' +
    'Assessment only; NO QED.',
  method:
    'Recompute offset(T) = measuredVar(T) - (1/2pi^2) log log(T/2pi) across the six accessible ' +
    'imp-95710 heights, regress it on log T, locate the max (C0), and quantify how far r_cap(3e12) ' +
    'moves between the max-anchor and a lower substituted offset -- deciding monotonicity and the ' +
    'envelope-safety consequence.',
  selbergConstant: SELBERG_C, // 1/2pi^2
  offsetC0: C0, // ~0.3337 -- the sole empirical input, same anchor imp-95722 uses
  offsetRows,
  offsetTrend: {
    slopeVsLogT: offsetSlope, // ~7.64e-4 -- statistically zero
    r2: offsetR2, // ~0.0007 -- noise-dominated, no monotone trend
    min: offsetMin,
    max: C0,
    mean: offsetMean,
    spread: offsetSpread, // ~0.123, ~47 pct of the mean -- measurement scatter
    argmaxHeight: argmaxRow.Tc, // 1.5e5 -- INTERIOR, not an endpoint
    maxAtInterior, // true: interior max is incompatible with a monotone offset
  },
  envelopeSafety: {
    windowBottomT: WINDOW_BOTTOM_T,
    rCapMaxAnchor, // 0.25987 -- r_cap(3e12) with C0 = max (envelope-safe)
    rCapMinOffset, // 0.19593 -- r_cap(3e12) if a lower offset were substituted
    bandDrop: envelopeBandDrop, // ~0.064 (~25 pct) -- material break of r_cap >= r
  },
  findings: {
    offsetNotMonotone:
      'offset(T) across T = 1e4..5e5 bounces (down, down, UP to its max, down, down); log-linear ' +
      'regression slope 7.64e-4, R^2 = 0.0007 -- statistically indistinguishable from zero. The ' +
      '0.211..0.334 spread is the ~11 pct sd(C - E) noise imp-95710 flagged, not a trend.',
    maxIsInterior:
      'The envelope anchor C0 = 0.3337 is attained at an INTERIOR height (1.5e5), the sd(C - E) ' +
      'noise spike (measuredVar 0.451), not an endpoint. An interior maximum is structurally ' +
      'INCOMPATIBLE with a monotone offset, so the data argue AGAINST monotonicity, not merely ' +
      'fail to confirm it.',
    analyticApproachUndetermined:
      'offset(T) conflates the Selberg O(1) remainder (Var S(T) = (1/2pi^2) log log(T/2pi) + O(1)) ' +
      'and the imp-95562 windowing-identification slack. Selberg forces a finite asymptote as ' +
      'T -> infinity but leaves the finite-height APPROACH DIRECTION near 3e12 undetermined by the ' +
      'noise-dominated data; monotonicity over [3e12, .) is UNDECIDED.',
    envelopeHazardConfirmed:
      'r_cap(3e12) moves from 0.260 (max anchor) to 0.196 if the offset drifts to the accessible ' +
      'min -- a ~25 pct drop. Substituting a near-asymptotic high-block offset could therefore push ' +
      'r_cap(3e12) below true r(3e12) and BREAK r_cap >= r; it must NOT be done. The max-over ' +
      '-accessible-heights anchor is the envelope-safe construction and is retained.',
  },
  isRigorous: false,
  decision:
    'MONOTONICITY UNDECIDED. The finite-height offset C0 is NOT demonstrably monotone in T over ' +
    '[3e12, infinity): across the accessible window it is noise-dominated (slope 7.64e-4, R^2 = ' +
    '0.0007) with its maximum at an INTERIOR height (1.5e5), a shape incompatible with ' +
    'monotonicity, and Selberg fixes only the finite asymptote, not the finite-height approach ' +
    'direction. This CONFIRMS the imp-95884 (C) envelope-safety hazard on the conservative side: ' +
    'because monotonicity is neither established nor structurally plausible, a high-block offset ' +
    'substitution is UNSAFE -- it could drop r_cap(3e12) from 0.260 to as low as 0.196 (~25 pct) ' +
    'and break the upper-envelope property. The current C0 = max over accessible heights is the ' +
    'envelope-safe choice precisely because it assumes no monotonicity, and it must be RETAINED.',
  verdict:
    'ASSESSMENT (frontier envelope-safety analysis, NOT rigorous). The imp-95722 finite-height ' +
    'offset C0 is NOT demonstrably monotone in T: across T = 1e4..5e5 it is noise-dominated ' +
    '(regression slope 7.64e-4, R^2 = 0.0007) with its maximum at an INTERIOR height (1.5e5), a ' +
    'shape incompatible with monotonicity. Selberg forces a finite asymptote but leaves the ' +
    'finite-height approach direction near 3e12 undetermined, further blurred by the imp-95562 ' +
    'windowing-identification slack, so monotonicity over [3e12, infinity) is UNDECIDED. This ' +
    'CONFIRMS the imp-95884 (C) hazard on the conservative side: a high-block offset substitution ' +
    'could drop r_cap(3e12) from 0.260 to as low as 0.196 (~25 pct) and break the upper-envelope ' +
    'r_cap >= r, so it must NOT be performed; the max-over-accessible-heights anchor is retained ' +
    'as the envelope-safe construction. Changes no bound; NO QED; the zero-side route stays ' +
    'PCC / GRH-gated; no refereed bound is changed.',
  citation:
    'imp-95722 (r_cap envelope, C0 = max finite-height offset, r_cap(3e12) ~ 0.26); imp-95884 ' +
    '(raised the (C) envelope-safety hazard); imp-95710 / imp-95562 (six measured sd(C - E) ' +
    'literals, noise-dominated); imp-95519 (window bottom T = 3.0e12).',
  supersededBy:
    'imp-95921-c0-offset-approach-analytic-bracket DECIDED what this module left UNDECIDED: via ' +
    'the saturated box number variance, offset(T) rises in log log T with exact analytic slope ' +
    '1/2pi^2, so the approach to C0 near 3e12 is UPWARD (not the downward drift this module could ' +
    'not rule out) and sits inside the max-anchor cushion -- but because offset grows without ' +
    'bound, C0 is only a safe envelope over a FINITE super-window, crossing at a finite T_x. ' +
    'Downstream consumers should cite imp-95921, not this module’s UNDECIDED verdict, for the ' +
    'current monotonicity status.',
};

// --- self-executing internal-consistency assertions (baked-literal re-derivation only) ---
(() => {
  const approx = (a, b, tol) => Math.abs(a - b) <= tol;
  // C0 reproduces the imp-95722 pinned offset (~0.3337).
  if (!approx(C0, 0.3337213835371905, 1e-9))
    throw new Error('imp-95897: C0 drifted from the imp-95722 pinned offset');
  // The offset trend is noise, not monotone: near-zero slope and R^2.
  if (!(Math.abs(offsetSlope) < 5e-3)) throw new Error('imp-95897: offset slope not near zero -- expected noise');
  if (!(offsetR2 < 0.01)) throw new Error('imp-95897: offset R^2 not near zero -- expected noise-dominated');
  // The max is at an INTERIOR height (structurally incompatible with a monotone offset).
  if (!maxAtInterior) throw new Error('imp-95897: envelope max must be interior (incompatible with monotone)');
  if (argmaxRow.Tc !== 1.5e5) throw new Error('imp-95897: offset max must be at T = 1.5e5');
  // The spread is a material fraction of the mean (measurement scatter, not a trend).
  if (!(offsetSpread / offsetMean > 0.3)) throw new Error('imp-95897: offset spread must be a large fraction of the mean');
  // Envelope-safety band: substituting a lower offset materially drops r_cap(3e12).
  if (!approx(rCapMaxAnchor, 0.25987, 5e-4))
    throw new Error('imp-95897: r_cap(3e12) max-anchor disagrees with imp-95722 (~0.26)');
  if (!(rCapMinOffset < rCapMaxAnchor)) throw new Error('imp-95897: lower offset must lower r_cap(3e12)');
  if (!(envelopeBandDrop > 0.03)) throw new Error('imp-95897: envelope band drop must be material (> 0.03)');
  // honesty gates: assessment only, no QED, no refereed bound is changed.
  if (IMP95897_C0_OFFSET_MONOTONICITY_ENVELOPE_SAFETY.isRigorous !== false)
    throw new Error('imp-95897: isRigorous must be false');
  if (!/NO QED/.test(IMP95897_C0_OFFSET_MONOTONICITY_ENVELOPE_SAFETY.verdict))
    throw new Error('imp-95897: verdict dropped the NO QED banner');
  if (!/refereed bound is changed/i.test(IMP95897_C0_OFFSET_MONOTONICITY_ENVELOPE_SAFETY.verdict))
    throw new Error('imp-95897: verdict dropped the no-refereed-bound-change banner');
  // consumer re-point (imp-95952): the UNDECIDED verdict above must forward-cite imp-95921.
  if (!/imp-95921/.test(IMP95897_C0_OFFSET_MONOTONICITY_ENVELOPE_SAFETY.supersededBy))
    throw new Error('imp-95897: supersededBy must cite imp-95921');
})();

export default IMP95897_C0_OFFSET_MONOTONICITY_ENVELOPE_SAFETY;
