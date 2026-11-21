/**
 * @module imp-95884-odlyzko-high-block-calibration-assessment
 *
 * imp-95884 -- ASSESSING whether Odlyzko-style LOCAL high blocks near T = 10^20..10^23
 * could CALIBRATE the imp-95722 analytic r_cap number-variance envelope -- either its
 * asymptotic SHAPE (how r approaches the naive-GUE value) or the r_cap(3e12) estimate --
 * DESPITE overshooting the imp-95519 verified-height window bottom T = 3.0e12 by 7.5-10.5
 * decades. Assessment only; changes no bound; NO QED.
 *
 * BACKGROUND. imp-95863 concluded the ONLY in-repo lever that actually reaches the
 * imp-95519 window bottom T = 3.0e12 is the imp-95722 analytic r_cap envelope
 * (r_cap(3e12) ~ 0.26), because no consecutive-ordinate table reaches above
 * gamma_1e6 = 6.003e5, and it noted in passing that Odlyzko-style LOCAL high blocks near
 * T = 10^20..10^23 sit far ABOVE 3e12 and would OVERSHOOT a forecast centred there. This
 * module examines the follow-up question: even overshooting, could those high blocks tell
 * us anything that TIGHTENS r_cap(3e12), or does the overshoot make them uninformative for
 * that target?
 *
 * THE r_cap DECOMPOSITION (imp-95722). r_cap(T) = [ (1/2pi^2) log log(T/2pi) + C0 ] /
 * Sigma^2(L(T)), where:
 *   - the numerator SHAPE (Selberg leading term (1/2pi^2) log log(T/2pi)) is an
 *     UNCONDITIONAL closed form, exact at every T including 3e12;
 *   - the denominator Sigma^2(L(T)) (GUE mean-square envelope, L ~ sqrt(T) log T) is a
 *     closed form, exact at every T;
 *   - the ONLY empirically-pinned input is C0, the FINITE-HEIGHT offset, fixed by imp-95722
 *     as the max over the six imp-95710 heights T = 1e4..5e5 of (measuredVar - Selberg term).
 *
 * WHAT A HIGH-BLOCK MEASUREMENT WOULD AND WOULD NOT TOUCH.
 *
 *  (A) The asymptotic SHAPE needs no calibration. Both the Selberg numerator law and the
 *      GUE denominator are analytic; recomputing r_cap at the high blocks uses the SAME two
 *      closed forms, with no free parameter beyond C0. From 3e12 to 1e23 the Selberg
 *      (shape) term moves only 0.16677 -> 0.19931 (delta = 0.0325, ~19.5 pct) over 10.5
 *      decades -- glacial log log growth -- so a high-block measurement of the shape would
 *      merely re-confirm a curve that is already pinned by theorem, not fit it.
 *
 *  (B) The one uncertain input, C0, is the DOMINANT numerator term (~63-67 pct of the
 *      capped variance at every one of these heights) AND it is a FINITE-HEIGHT offset --
 *      its whole job is to absorb the O(1) approach-to-leading-Selberg slack, which DRIFTS
 *      with height. The offset that governs r_cap(3e12) is the offset AT ~3e12. A block at
 *      1e20..1e23 pins the offset THERE, in the near-asymptotic regime 7.5-10.5 decades
 *      ABOVE the target. Transporting that value DOWN to 3e12 is itself a multi-decade
 *      extrapolation -- the very move (running downward instead of upward) that r_cap was
 *      built to REPLACE, since imp-95710 rejected the symmetric upward six-point log-linear
 *      forecast r -> 0.04 for spanning too few decades.
 *
 *  (C) Envelope-safety hazard. C0 is defined as an UPPER-envelope anchor (a max, so
 *      r_cap >= r at every sampled height). If the finite-height offset is monotone in T
 *      (approaching its asymptote), the high-block offset is not the max over the [3e12, .)
 *      regime, so substituting it could push r_cap(3e12) BELOW the true r(3e12) and BREAK
 *      the upper-bound property -- turning a conservative envelope into an unjustified point
 *      forecast. High blocks cannot certify the max over the lower regime they sit above.
 *
 * WHAT THE HIGH BLOCKS *CAN* DO (and why it does not help the 3e12 bound). They could
 * qualitatively confirm the TREND DIRECTION -- that r keeps FALLING toward 0 rather than
 * rising toward the naive-GUE value r = 1 (r_cap: 0.184 at 1e20 down to 0.166 at 1e23,
 * still < the 0.260 at 3e12). But that direction is ALREADY analytically settled: the
 * numerator grows at most like log log T (Selberg, unconditional) while the denominator
 * grows like log T, so r MUST fall -- no data needed. Confirmation of a theorem-forced
 * trend tightens no bound at 3e12.
 *
 * VERDICT. The overshoot is DECISIVE, not incidental. r_cap(3e12) = [Selberg(3e12) + C0] /
 * Sigma^2(3e12) has every factor except C0 fixed analytically AT 3e12; its residual
 * uncertainty is therefore a FINITE-HEIGHT (sub-asymptotic) effect living AT ~3e12, whereas
 * a high block only pins the near-asymptotic offset 7.5-10.5 decades above. The two things
 * high blocks can inform -- the asymptotic shape and the asymptotic offset -- are exactly
 * the two the 3e12 estimate does NOT need (shape is analytic; the asymptotic offset is the
 * wrong regime), while the one thing it does need -- the finite-height offset near 3e12 --
 * is precisely what a measurement above cannot reach without reintroducing an unwarranted
 * multi-decade extrapolation that also risks breaking the upper-envelope property. So
 * Odlyzko high blocks CONFIRM the falling trend but CANNOT tighten r_cap(3e12). Assessment
 * only; changes no bound; NO QED; the zero-side route stays PCC / GRH-gated;
 * no refereed bound is changed.
 *
 * Import-light: no zeros bundle, no sibling imports. The r_cap closed forms and the six
 * imp-95710 / imp-95562 measured sd(C - E) literals are recomputed here exactly as
 * imp-95722 defines them; the high-block heights are treated as evaluation points only.
 *
 * @see imp-95722-number-variance-ratio-window-bottom-bound (the r_cap envelope; C0 offset)
 * @see imp-95863-intermediate-ordinate-table-reach-ledger (flagged the high-block overshoot)
 * @see imp-95519-localized-barrier-sum-prime-zero-nogo (window bottom T = 3.0e12)
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
// C0: finite-height envelope offset = max over heights of (measuredVar - Selberg term).
const C0 = Math.max(...MEASURED.map((m) => m.sd * m.sd - SELBERG_C * logLog(m.Tc)));
const cappedVariance = (T) => SELBERG_C * logLog(T) + C0;
const cappedRatio = (T) => cappedVariance(T) / gueNumberVariance(envelopeCount(T));

const WINDOW_BOTTOM_T = 3.0e12; // imp-95519 verified-height window bottom

// Row builder: r_cap plus the numerator decomposition (how much of the capped variance is
// the analytic Selberg shape vs the empirical finite-height offset C0).
const buildRow = (T, label) => {
  const selberg = SELBERG_C * logLog(T);
  const L = envelopeCount(T);
  const gue = gueNumberVariance(L);
  return {
    T,
    label,
    selbergShapeTerm: selberg, // analytic, exact at this T
    offsetC0: C0, // empirical finite-height input (same anchor for all rows)
    c0FractionOfNumerator: C0 / (selberg + C0), // C0 dominates the numerator
    gueVariance: gue, // Sigma^2(L(T)), analytic
    rCap: cappedRatio(T), // r_cap(T)
    decadesAboveWindow: Math.log10(T / WINDOW_BOTTOM_T),
  };
};

// The target height (r_cap fully analytic here except for C0) and the Odlyzko high blocks.
const windowBottomRow = buildRow(WINDOW_BOTTOM_T, 'imp-95519 window bottom (target)');
const HIGH_BLOCKS = [1e20, 1e21, 1e22, 1e23].map((T) => buildRow(T, 'Odlyzko high block'));

// Glacial shape movement: Selberg term barely advances across the 10.5-decade overshoot.
const selbergShapeMove = {
  at3e12: windowBottomRow.selbergShapeTerm,
  at1e23: HIGH_BLOCKS[HIGH_BLOCKS.length - 1].selbergShapeTerm,
  absoluteDelta: HIGH_BLOCKS[HIGH_BLOCKS.length - 1].selbergShapeTerm - windowBottomRow.selbergShapeTerm,
  fractionalMove:
    (HIGH_BLOCKS[HIGH_BLOCKS.length - 1].selbergShapeTerm - windowBottomRow.selbergShapeTerm) /
    windowBottomRow.selbergShapeTerm,
  overshootDecades3e12to1e23: Math.log10(1e23 / WINDOW_BOTTOM_T),
};

export const IMP95884_ODLYZKO_HIGH_BLOCK_CALIBRATION_ASSESSMENT = {
  ticket: 'imp-95884',
  proofSection: 'S-frontier',
  question:
    'Could Odlyzko-style LOCAL high blocks near T = 10^20..10^23 -- even though they overshoot the ' +
    'imp-95519 window bottom T = 3.0e12 by 7.5-10.5 decades -- CALIBRATE the imp-95722 r_cap ' +
    'envelope (its asymptotic shape or the r_cap(3e12) estimate), or does the overshoot make them ' +
    'uninformative for the 3e12 target? Assessment only; NO QED.',
  method:
    'Decompose r_cap(T) = [ (1/2pi^2) log log(T/2pi) + C0 ] / Sigma^2(L(T)) into its analytic ' +
    'shape terms (Selberg numerator law + GUE denominator, both exact at every T) and its single ' +
    'empirical input C0 (the finite-height offset). Recompute r_cap at 3e12 and at the four high ' +
    'blocks with the exact imp-95722 closed forms, and ask which factor a high-block measurement ' +
    'could actually re-pin.',
  offsetC0: C0, // ~0.3337 -- the sole empirical input, same anchor imp-95722 uses
  windowBottom: windowBottomRow,
  highBlocks: HIGH_BLOCKS,
  selbergShapeMove,
  findings: {
    shapeIsAnalytic:
      'Both the Selberg numerator law and the GUE denominator are closed forms exact at every T, ' +
      'so the asymptotic shape needs no data; the Selberg term moves only ~19.5 pct over the 10.5 ' +
      'decade overshoot from 3e12 to 1e23 -- a high block would re-confirm a theorem-pinned curve, not fit it.',
    onlyC0IsEmpirical:
      'C0, the finite-height offset, is the sole empirical input and the DOMINANT numerator term ' +
      '(~63-67 pct of the capped variance). It absorbs the O(1) approach-to-Selberg slack, which ' +
      'drifts with height, so the value governing r_cap(3e12) is the offset AT ~3e12.',
    overshootPinsWrongRegime:
      'A block at 1e20..1e23 pins C0 in the near-asymptotic regime 7.5-10.5 decades ABOVE 3e12. ' +
      'Transporting it down to 3e12 is a multi-decade extrapolation -- the same unwarranted move ' +
      '(downward instead of upward) that r_cap was built to replace when it rejected the imp-95710 ' +
      'six-point log-linear forecast.',
    envelopeSafetyHazard:
      'C0 is an upper-envelope anchor (a max, so r_cap >= r). If the offset is monotone in T, the ' +
      'high-block offset is not the max over the [3e12, .) regime, so substituting it could push ' +
      'r_cap(3e12) below true r(3e12) and BREAK the upper-bound property.',
    whatHighBlocksCanDo:
      'They can qualitatively confirm the TREND DIRECTION -- r keeps falling (r_cap 0.184 at 1e20 ' +
      'to 0.166 at 1e23, below 0.260 at 3e12), NOT rising toward the naive-GUE value r = 1 -- but ' +
      'that direction is already analytically forced (log log T numerator vs log T denominator), so ' +
      'it tightens no bound at 3e12.',
  },
  isRigorous: false,
  verdict:
    'ASSESSMENT (frontier calibration analysis, NOT rigorous). The overshoot is DECISIVE. ' +
    'r_cap(3e12) = [Selberg(3e12) + C0] / Sigma^2(3e12) has every factor except the finite-height ' +
    'offset C0 fixed analytically AT 3e12, so its residual uncertainty is a FINITE-HEIGHT ' +
    '(sub-asymptotic) effect living at ~3e12. Odlyzko-style LOCAL high blocks near 10^20..10^23 ' +
    'can inform only the asymptotic shape (already analytic -- the Selberg term moves ~19.5 pct ' +
    'over the 10.5-decade overshoot) and the near-asymptotic offset (the wrong regime, 7.5-10.5 ' +
    'decades above the target); the one input the 3e12 estimate needs -- the finite-height offset ' +
    'near 3e12 -- is exactly what a measurement above cannot reach without reintroducing an ' +
    'unwarranted multi-decade extrapolation that also risks breaking the upper-envelope property. ' +
    'High blocks therefore CONFIRM the falling trend (r toward 0, not toward the naive-GUE r = 1) ' +
    'but CANNOT tighten r_cap(3e12). Changes no bound; NO QED; the zero-side route stays ' +
    'PCC / GRH-gated; no refereed bound is changed.',
  citation:
    'imp-95722 (r_cap envelope, C0 finite-height offset, r_cap(3e12) ~ 0.26); imp-95863 (flagged ' +
    'the high-block overshoot; r_cap the only in-repo lever to 3e12); imp-95710 / imp-95562 ' +
    '(six measured sd(C - E) literals); imp-95519 (window bottom T = 3.0e12).',
};

// --- self-executing internal-consistency assertions (baked-literal re-derivation only) ---
(() => {
  const approx = (a, b, tol) => Math.abs(a - b) <= tol;
  // C0 reproduces the imp-95722 pinned offset (~0.3337).
  if (!approx(C0, 0.3337213835371905, 1e-9))
    throw new Error('imp-95884: C0 drifted from the imp-95722 pinned offset');
  // r_cap(3e12) matches imp-95722s ~0.26.
  if (!approx(windowBottomRow.rCap, 0.25987, 5e-4))
    throw new Error('imp-95884: r_cap(3e12) disagrees with imp-95722 (~0.26)');
  // The high blocks all sit ABOVE 3e12 (positive decades) and OVERSHOOT by 7.5-10.5 decades.
  for (const r of HIGH_BLOCKS) {
    if (!(r.decadesAboveWindow >= 7.5 && r.decadesAboveWindow <= 10.6))
      throw new Error('imp-95884: high block not 7.5-10.5 decades above the window bottom at T=' + r.T);
    // r_cap keeps FALLING above 3e12 (trend toward 0, not toward the naive-GUE value 1).
    if (!(r.rCap < windowBottomRow.rCap && r.rCap > 0 && r.rCap < 1))
      throw new Error('imp-95884: high-block r_cap must fall below r_cap(3e12) and stay in (0,1) at T=' + r.T);
  }
  // The high blocks are monotone decreasing in r_cap as T rises.
  for (let i = 1; i < HIGH_BLOCKS.length; i++)
    if (!(HIGH_BLOCKS[i].rCap < HIGH_BLOCKS[i - 1].rCap))
      throw new Error('imp-95884: high-block r_cap not monotone decreasing at T=' + HIGH_BLOCKS[i].T);
  // C0 is the DOMINANT numerator term at every height (empirical input, not the analytic shape).
  if (!(windowBottomRow.c0FractionOfNumerator > 0.5))
    throw new Error('imp-95884: C0 must dominate the numerator at 3e12 (empirical input governs)');
  for (const r of HIGH_BLOCKS)
    if (!(r.c0FractionOfNumerator > 0.5))
      throw new Error('imp-95884: C0 must dominate the numerator at high block T=' + r.T);
  // The Selberg shape term moves only glacially across the overshoot (~19.5 pct over 10.5 decades).
  if (!(selbergShapeMove.fractionalMove > 0.1 && selbergShapeMove.fractionalMove < 0.3))
    throw new Error('imp-95884: Selberg shape move over the overshoot must be small (~19.5 pct)');
  if (!approx(selbergShapeMove.overshootDecades3e12to1e23, 10.52, 5e-2))
    throw new Error('imp-95884: 3e12->1e23 overshoot must be ~10.52 decades');
  // honesty gates: assessment only, no QED, no refereed bound is changed.
  if (IMP95884_ODLYZKO_HIGH_BLOCK_CALIBRATION_ASSESSMENT.isRigorous !== false)
    throw new Error('imp-95884: isRigorous must be false');
  if (!/NO QED/.test(IMP95884_ODLYZKO_HIGH_BLOCK_CALIBRATION_ASSESSMENT.verdict))
    throw new Error('imp-95884: verdict dropped the NO QED banner');
  if (!/refereed bound is changed/i.test(IMP95884_ODLYZKO_HIGH_BLOCK_CALIBRATION_ASSESSMENT.verdict))
    throw new Error('imp-95884: verdict dropped the no-refereed-bound-change banner');
})();

export default IMP95884_ODLYZKO_HIGH_BLOCK_CALIBRATION_ASSESSMENT;
