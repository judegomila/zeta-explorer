/**
 * @module imp-97478-route-m-mcm-level1-baseterm-extprec
 *
 * imp-97478 (numerical -- MEASUREMENT ONLY; MCM stays VERIFIED at omega<=6, NOT proved; NO QED).
 *
 * imp-97463 fit the level-1 base term c(x) = h(x) - h(2x) to c(x) ~ (1/24)(ln x)/x + M0/x
 * (M0 = LN_A/2 - (ln 2)/24 = 0.095496), strictly positive and monotone decreasing across the reliable
 * double-precision range, but its CAVEAT flagged that beyond x ~ 2e5 the naive G(m) = Sum_{k=1}^m k ln k
 * accumulates catastrophic-cancellation error against GKmain(m) ~ 6e12, so R(m) = G(m) - GKmain(m) and hence
 * c(x) degrade; the non-monotone blip at x = 5e5 (c reported rising back to 1.449e-6) was ASSERTED a
 * floating-point artifact, not a real reversal, but was left unverified past there.
 *
 * -------------------------------------------------------------------------------
 * WHAT THIS LEAF DOES.  Re-evaluates the SAME kernel with an extended-precision (mpmath, 40 digit) G(m) so
 * R(m) is trustworthy, over an x-ladder that reaches the imp-97442 omega=5,6 window top (x = 457015,
 * b = 914030) and well beyond (to x = 2e6), with a DENSE cluster straddling the claimed x = 5e5 blip.
 * Kernel (imp-97422): h = g/m, g(m) = LN_A + (1/12) ln m + R(m), R(m) = G(m) - GKmain(m),
 * GKmain(m) = (m^2/2 + m/2 + 1/12) ln m - m^2/4 + LN_A.
 *
 * -------------------------------------------------------------------------------
 * RESULT 1 -- THE x=5e5 BLIP IS AN ARTIFACT (confirmed).  In 40-digit precision c(5e5) = 1.284522e-6,
 * sitting monotonically between c(490000) = 1.309019e-6 and c(510000) = 1.260954e-6; there is NO rise to
 * 1.449e-6. The double-precision "blip" was pure cancellation noise in R(m), as imp-97463 asserted.
 *
 * RESULT 2 -- STRICT POSITIVITY AND MONOTONICITY PERSIST past the window top.  c(x) is strictly positive
 * and strictly decreasing across the whole ladder through x = 2e6 (over 4x past the omega=5,6 window top),
 * approaching 0 from above without crossing. The base of the MCM tower stays safe in the extended range.
 *
 * RESULT 3 -- THE (ln x)/(24 x) LAW SHARPENS.  With trustworthy R(m) the exact c(x) matches the closed-form
 * two-term prediction (1/24)(ln x)/x + M0/x to a max relative deviation of 1.08e-10 across the entire ladder
 * (vs "< 0.1%" in double precision). The scaled quantity c*x/ln x = K0 + (M0/ln x) drifts monotonically down
 * toward K0 = 1/24 = 0.041667 (0.04825 at x = 2e6, consistent). The remainder R(m) recovers the analytic
 * Euler-Maclaurin leading term EXACTLY: R(457015) = 6.64977e-15 = 1/(720 m^2) to all shown digits -- the
 * double-precision R(m) (~1e-3 absolute noise at these m) had drowned this out.
 *
 * RESULT 4 -- CORRECTS THE imp-97463 GLOBAL-MIN VALUE.  The double-precision baked "tower global minimum"
 * c(457015) = 1.431333e-6 was itself already inside the degraded (> 2e5) regime: the trustworthy value is
 * c(457015) = 1.397144e-6, ~2.4% LOWER, and lands exactly on the smooth two-term law. So imp-97463's fitted
 * "M within 2.4% of M0" gap was double-precision cancellation noise, not a real deviation of the base term
 * from its closed form. (This does not change any conclusion: the base term is still strictly positive,
 * monotone, and ~4 orders of magnitude below the induction top term T(b) in [1.34e-2, 2.02e-2].)
 *
 * -------------------------------------------------------------------------------
 * VERDICT.  MEASUREMENT ONLY. Extended-precision confirms the imp-97463 base-term picture and refutes the
 * x=5e5 blip: c(x) = h(x) - h(2x) stays strictly positive and monotone decreasing toward 0 from above at
 * least to x = 2e6, obeying (1/24)(ln x)/x + M0/x to 1e-10, with a corrected (2.4% lower) window-top value.
 * The base of the tower is safe in the extended range. MCM stays VERIFIED not proved (and FALSE from
 * omega=11 per imp-97432); no bound on Lambda moves; kappa_arith unchanged; no refereed bound is changed;
 * RH open; NO QED.
 *
 * @see imp-97463-route-m-mcm-level1-baseterm-decay.js (the double-precision fit + CAVEAT this leaf resolves)
 * @see imp-97442-route-m-mcm-omega56-subgrid-verification.js (window top x=457015 global minimum)
 * @see imp-97422-route-m-quarter-ceiling-omega4-multiplicative-difference-reduction.js (h=g/m kernel; GKmain)
 * @see imp-97432-route-m-mcm-hypothesis-refuted-ceiling-safe.js (MCM refuted at omega=11)
 *
 * Ticket: imp-97478 (numerical, opus-4-8, api-pool). Extended-precision base-term confirmation; NO QED.
 */

// import-light: only the closed-form two-term law is needed to live-verify the extended-precision ladder,
// which matches it to 1e-10 (no heavy kernel import, no zeros bundle).
const LN_A = 0.2487544770337842;          // Glaisher-Kinkelin log-constant = 1/12 - zeta-prime(-1)
const K0 = 1 / 24;                         // leading coeff of (ln x)/x
const M0 = LN_A / 2 - Math.log(2) / 24;    // constant/x term (= 0.095496...)
function predTwoTerm(x) { return K0 * Math.log(x) / x + M0 / x; }

// Baked extended-precision (mpmath, 40 dps) re-evaluation of the exact kernel c(x) = h(x) - h(2x).
// A single incremental pass computes G(m) = Sum_{k=1}^m k ln k to m = 4e6; R(m) = G(m) - GKmain(m) is
// then trustworthy (double precision loses it to ~1e-3 cancellation noise past m ~ 2e5).
export const IMP97478_MEASUREMENTS = Object.freeze({
  precisionDps: 40,
  ladder: Object.freeze([
    Object.freeze({ x: 5000, c: 9.00758311369e-5, pred: 9.00758311272e-5, scaled: 0.0528788, R: 5.556e-11 }),
    Object.freeze({ x: 10000, c: 4.79260288171e-5, pred: 4.79260288159e-5, scaled: 0.052035, R: 1.389e-11 }),
    Object.freeze({ x: 25000, c: 2.06975627462e-5, pred: 2.06975627462e-5, scaled: 0.0510969, R: 2.222e-12 }),
    Object.freeze({ x: 50000, c: 1.09264040236e-5, pred: 1.09264040235e-5, scaled: 0.0504927, R: 5.556e-13 }),
    Object.freeze({ x: 100000, c: 5.75201333701e-6, pred: 5.75201333701e-6, scaled: 0.0499614, R: 1.389e-13 }),
    Object.freeze({ x: 200000, c: 3.02041233112e-6, pred: 3.02041233112e-6, scaled: 0.0494903, R: 3.472e-14 }),
    Object.freeze({ x: 457015, c: 1.3971439701e-6, pred: 1.3971439701e-6, scaled: 0.0489942, R: 6.65e-15 }),
    Object.freeze({ x: 490000, c: 1.30901932091e-6, pred: 1.30901932091e-6, scaled: 0.0489552, R: 5.785e-15 }),
    Object.freeze({ x: 495000, c: 1.29665148025e-6, pred: 1.29665148025e-6, scaled: 0.0489496, R: 5.668e-15 }),
    Object.freeze({ x: 500000, c: 1.28452249344e-6, pred: 1.28452249344e-6, scaled: 0.048944, R: 5.556e-15 }),
    Object.freeze({ x: 505000, c: 1.27262543334e-6, pred: 1.27262543334e-6, scaled: 0.0489385, R: 5.446e-15 }),
    Object.freeze({ x: 510000, c: 1.26095363959e-6, pred: 1.26095363959e-6, scaled: 0.0489331, R: 5.34e-15 }),
    Object.freeze({ x: 600000, c: 1.08309663042e-6, pred: 1.08309663042e-6, scaled: 0.0488443, R: 3.858e-15 }),
    Object.freeze({ x: 750000, c: 8.78874168298e-7, pred: 8.78874168298e-7, scaled: 0.0487259, R: 2.469e-15 }),
    Object.freeze({ x: 1000000, c: 6.71142379242e-7, pred: 6.71142379242e-7, scaled: 0.0485789, R: 1.389e-15 }),
    Object.freeze({ x: 1500000, c: 4.58691172498e-7, pred: 4.58691172498e-7, scaled: 0.0483818, R: 6.173e-16 }),
    Object.freeze({ x: 2000000, c: 3.50011755883e-7, pred: 3.50011755883e-7, scaled: 0.0482487, R: 3.472e-16 }),
  ]),
  decayLaw: 'c(x) = h(x) - h(2x) ~ (1/24)(ln x)/x + M0/x, M0 = LN_A/2 - (ln 2)/24 = 0.095496',
  leadingCoeff: 1 / 24,
  constOverXCoeff: M0,
  maxRelDevFromTwoTermLaw: 1.079e-10,        // exact c vs closed-form law, whole ladder (was < 0.1% in double)
  reliableRange: 'x <= 2e6 (extended precision; single incremental pass of G(m) to m = 4e6 at 40 dps)',
  strictlyPositive: true,
  monotoneDecreasing: true,                  // strictly, across the whole extended ladder
  approachesZeroFromAbove: true,
  blipAt5e5: Object.freeze({
    doublePrecisionClaim: 1.449e-6,          // imp-97463 reported non-monotone rise
    extendedPrecision: 1.28452249344e-6,     // trustworthy value: monotone, no rise
    isArtifact: true,
  }),
  remainderEulerMaclaurinCheck: Object.freeze({
    x: 457015, Rmeasured: 6.64977e-15, RleadingTerm: 6.64977e-15, // 1/(720 m^2), matches to shown digits
  }),
  windowTopCorrection: Object.freeze({
    x: 457015, doublePrecisionBaked: 1.431333219910749e-6, extendedPrecision: 1.3971439701e-6,
    relDiff: 0.0245, note: 'imp-97463 baked window-top value was itself in the degraded > 2e5 regime; ' +
      'trustworthy value is ~2.4% lower and lands exactly on the smooth two-term law.',
  }),
  topTermTRange: Object.freeze([1.3434888142011e-2, 2.0214044330049495e-2]), // imp-97442 T(b), ~1e4x above
});

export const IMP97478_VERDICT = Object.freeze({
  question: 'does the imp-97463 level-1 base term c(x)=h(x)-h(2x) stay monotone-positive past x=5e5 with a trustworthy extended-precision G(m), and is the x=5e5 blip an artifact?',
  blipIsArtifact: true,
  strictlyPositive: true,
  monotoneDecreasing: true,
  approachesZeroFromAbove: true,
  crossesZero: false,
  lawPersists: true,
  extendedRange: 'x up to 2e6 (>4x past the omega=5,6 window top x=457015)',
  windowTopValueCorrected: true,             // true c(457015)=1.397144e-6, not the baked 1.431333e-6
  mcmProved: false,                          // verified <=6, not proved; FALSE from omega=11 (imp-97432)
  anyBoundMoved: false,
  qed: false,
  conclusion:
    'MEASUREMENT ONLY. Extended-precision (40 dps) re-evaluation confirms the imp-97463 base-term picture ' +
    'and REFUTES the x=5e5 blip: c(5e5)=1.284522e-6 sits monotonically between its neighbours (no rise to ' +
    '1.449e-6). c(x)=h(x)-h(2x) is strictly positive and strictly decreasing toward 0 from above at least ' +
    'to x=2e6 (>4x past the omega=5,6 window top), obeying (1/24)(ln x)/x + M0/x to a max relative ' +
    'deviation of 1.08e-10, with R(m) recovering the Euler-Maclaurin leading term 1/(720 m^2) exactly. The ' +
    'imp-97463 double-precision window-top value 1.431333e-6 was itself in the degraded regime; the ' +
    'trustworthy value is 1.397144e-6 (~2.4% lower, on the smooth law). The base of the MCM tower stays ' +
    'safe in the extended range; the induction top term T(b) stays ~1e4x higher in [1.34e-2, 2.02e-2]. MCM ' +
    'stays VERIFIED not proved (and FALSE from omega=11 per imp-97432); no bound on Lambda moves; ' +
    'kappa_arith unchanged; no refereed bound is changed; RH open; NO QED.',
});

export const IMP97478_HONEST_BANNER =
  'RH open; no refereed bound is changed; NO QED. Extended-precision (mpmath 40 dps) re-evaluation of the ' +
  'imp-97463 level-1 base term c(x)=h(x)-h(2x): the x=5e5 non-monotone blip is confirmed a double-precision ' +
  'artifact (true c(5e5)=1.284522e-6), c stays strictly positive and monotone decreasing to 0 from above at ' +
  'least to x=2e6, matching (1/24)(ln x)/x + M0/x to 1e-10. The imp-97463 window-top value 1.431333e-6 was ' +
  'degraded; the trustworthy value is 1.397144e-6 (~2.4% lower). MCM stays VERIFIED not proved and is FALSE ' +
  'from omega=11 (imp-97432); no bound moved.';

// -- self-executing assertions (imp-3715 convention): the trustworthy ladder obeys the closed-form law and
//    is strictly positive, strictly decreasing, and blip-free -- all live-checkable in double precision --

const IMP97478_ASSERTIONS = [
  {
    id: 'imp97478-extprec-ladder-matches-two-term-law',
    holds: () => {
      // The extended-precision c(x) matches the closed-form (1/24)(ln x)/x + M0/x to < 1e-8 (measured 1e-10).
      for (const row of IMP97478_MEASUREMENTS.ladder) {
        const rel = Math.abs(row.c - predTwoTerm(row.x)) / row.c;
        if (!(rel < 1e-8)) return false;
      }
      return true;
    },
    why: 'with a trustworthy extended-precision R(m), the exact base term c(x) lands on the closed-form two-term decay law to < 1e-8 across x=5000..2e6.',
  },
  {
    id: 'imp97478-strictly-positive-monotone-blipfree',
    holds: () => {
      // Strictly positive and strictly decreasing across the whole extended ladder (through the x=5e5 cluster).
      let prev = Infinity;
      for (const row of IMP97478_MEASUREMENTS.ladder) {
        if (!(row.c > 0)) return false;
        if (!(row.c < prev)) return false;
        prev = row.c;
      }
      // the x=5e5 extended-precision value is strictly below its lower neighbour (no blip)
      const b = IMP97478_MEASUREMENTS.blipAt5e5;
      return b.isArtifact === true && b.extendedPrecision < 1.30901932091e-6 && b.extendedPrecision > 1.26095363959e-6;
    },
    why: 'the extended-precision ladder is strictly positive and strictly decreasing through the x=5e5 cluster; the reported double-precision blip to 1.449e-6 does not occur.',
  },
  {
    id: 'imp97478-coefficients-and-honesty',
    holds: () =>
      Math.abs(IMP97478_MEASUREMENTS.leadingCoeff - 1 / 24) < 1e-15 &&
      Math.abs(K0 - 1 / 24) < 1e-15 &&
      Math.abs(M0 - IMP97478_MEASUREMENTS.constOverXCoeff) < 1e-15 &&
      IMP97478_VERDICT.crossesZero === false &&
      IMP97478_VERDICT.approachesZeroFromAbove === true &&
      IMP97478_VERDICT.blipIsArtifact === true &&
      IMP97478_VERDICT.anyBoundMoved === false &&
      IMP97478_VERDICT.qed === false &&
      IMP97478_VERDICT.mcmProved === false &&
      /NO QED/.test(IMP97478_HONEST_BANNER) &&
      /PT Lambda <= 0.2|refereed bound is changed/.test(IMP97478_HONEST_BANNER) &&
      /RH open/.test(IMP97478_HONEST_BANNER),
    why: 'the decay leading coefficient is exactly 1/24 and the constant term is M0=LN_A/2-(ln2)/24; measurement only, no bound moved, no QED.',
  },
];

for (const a of IMP97478_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-97478-route-m-mcm-level1-baseterm-extprec assertion failed: ${a.id}`);
  }
}

export default {
  measurements: IMP97478_MEASUREMENTS,
  verdict: IMP97478_VERDICT,
  banner: IMP97478_HONEST_BANNER,
};
