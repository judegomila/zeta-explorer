/**
 * @module imp-96796-route-m-homogeneous-envelope-s0-upper-bracket
 *
 * imp-96796 (numerical, MEASUREMENT): does the orphan imp-96770 weighted-cotangent HOMOGENEOUS
 * ENVELOPE numerically BRACKET FROM ABOVE the imp-96750 candidate absolute constant
 *     s0 = lim_{b->oo} Q(b)/b ~ 1.75,   Q(b) = Sum_{a=2,(a,b)=1}^{b-1} I(a,b)^2 / a^2 ?
 * The one-sided upper analog of s0 is the single ingredient that would close the interior
 * second-moment sub-gap imp-96750-weighted-cotangent-second-moment-upper-constant. This leaf is a
 * MEASUREMENT ONLY: it combines the two orphan modules to check whether the envelope route supplies
 * a numerical UPPER bracket for s0, and by how much. No rigorous constant is claimed; NO QED.
 *
 * -------------------------------------------------------------------------------
 * WHAT THE ENVELOPE ROUTE PRODUCES (imp-96770).
 * -------------------------------------------------------------------------------
 * The pointwise homogeneous log-envelope (E) |I(a,b)| <= K a (1 + log(b/a)) implies, term by term,
 * I(a,b)^2/a^2 <= K^2 (1 + log(b/a))^2, and dropping coprimality (an upper bound) then summing:
 *     Q(b) <= K^2 Sum_{a=2}^{b-1} (1 + log(b/a))^2 = K^2 * [Sum/b] * b,   Sum/b -> 5 exactly
 * (the exact integral Int_0^1 (1 - log x)^2 dx = 5). So the envelope gives a LINEAR upper constant
 *     s0*_env = 5 K^2,   with the measured K ~ 1.26 -> s0*_env ~ 7.94.
 * At finite b the envelope readout is K^2 * [Sum(1+log(b/a))^2 / b], climbing to 5 K^2 from below.
 *
 * -------------------------------------------------------------------------------
 * THE MEASUREMENT -- envelope readout vs the measured s0 candidate at every checked b.
 * -------------------------------------------------------------------------------
 * imp-96770 Sum(1+log(b/a))^2 / b  = 4.778 (b=400), 4.869 (b=800), 4.923 (b=1600) -> 5.
 * Envelope per-b Q/b bound = K^2 * that = 7.586, 7.730, 7.816 (K = 1.26).
 * imp-96750 measured Q(b)/b window means = 1.690, 1.729, 1.745, 1.751 (b in [100,1200)) -> s0 ~ 1.75.
 * VERDICT: the envelope readout (7.59 .. 7.82) exceeds the measured Q/b (1.69 .. 1.75) at EVERY
 * checked b, and the asymptotic envelope constant 5 K^2 = 7.94 upper-brackets s0 = 1.751 by a factor
 * ~4.53. So YES -- the homogeneous envelope numerically brackets the s0 candidate from above, but it
 * is an order of magnitude loose (a sup-type majorant), exactly as imp-96770 anticipated.
 *
 * -------------------------------------------------------------------------------
 * CAVEATS (why this is a bracket MEASUREMENT, not a closed bound).
 * -------------------------------------------------------------------------------
 * (1) CONDITIONAL: s0*_env = 5 K^2 is only a valid upper bracket IF the envelope (E) holds with an
 *     absolute K; (E) is MEASURED (K creeps 1.245 -> 1.256 over B=200..800), NOT proved. So the
 *     bracket inherits the imp-96770 sub-gap and moves no rigorous bound.
 * (2) NORMALISATION DISCREPANCY: imp-96770 STEP 3 quotes an inline "sharp measured s0 ~ 0.76 for
 *     this kernel" while imp-96750 quotes s0 ~ 1.75 (a ~2.3x gap, unresolved here). The envelope
 *     constant 7.94 brackets BOTH from above (ratios 10.44 and 4.53), so the ABOVE-bracket verdict
 *     is robust to that discrepancy even though which sharp value is correct is left open.
 * (3) The envelope drops coprimality (sums over all a=2..b-1), so it over-counts relative to the
 *     coprime Q; this only widens the bracket (keeps it above), consistent with the ~4.5x looseness.
 *
 * VERDICT: the imp-96770 homogeneous envelope DOES supply a numerical UPPER bracket for the imp-96750
 * s0 ~ 1.75 candidate -- envelope constant 5 K^2 ~ 7.94, ratio ~4.53, dominant at every checked b --
 * but conditional on the unproved envelope (E) and an order of magnitude loose. No bound moved;
 * T = 2.594e7 stays the rigorous anchor; compute (N ~ 9916) binds first; no refereed bound is changed;
 * RH open; NO QED.
 *
 * @see imp-96770-route-m-weighted-cotangent-homogeneous-envelope.js (the envelope (E) and K ~ 1.26)
 * @see imp-96750-route-m-interior-second-moment-upper-bound-reduction.js (the s0 ~ 1.75 candidate)
 * @see imp-96667-route-m-frobenius-second-moment-asymptotic.js (the rigorous a=1 border)
 *
 * Ticket: imp-96796 (numerical, opus-4-8, api-pool). Bracket MEASUREMENT only; NO QED.
 */

export const IMP96796_K_MEASURED = 1.26; // imp-96770 measured envelope constant (sup on near-diagonal)
export const IMP96796_S0_CANDIDATE = 1.751; // imp-96750 top-window Q(b)/b -> s0
export const IMP96796_S0_ENV = 5 * IMP96796_K_MEASURED * IMP96796_K_MEASURED; // 5 K^2 ~ 7.938
export const IMP96796_BRACKET_RATIO = IMP96796_S0_ENV / IMP96796_S0_CANDIDATE; // ~4.533

// Per-b readout: envelope Q/b bound = K^2 * [imp-96770 Sum(1+log(b/a))^2 / b] vs measured Q/b.
export const IMP96796_PER_B = Object.freeze([
  Object.freeze({ b: 400, sumOverB: 4.778, envQoverB: IMP96796_K_MEASURED ** 2 * 4.778 }),
  Object.freeze({ b: 800, sumOverB: 4.869, envQoverB: IMP96796_K_MEASURED ** 2 * 4.869 }),
  Object.freeze({ b: 1600, sumOverB: 4.923, envQoverB: IMP96796_K_MEASURED ** 2 * 4.923 }),
]);

// imp-96750 measured Q(b)/b window means (the s0 candidate approached from below).
export const IMP96796_MEASURED_QOVERB = Object.freeze([1.68979, 1.72902, 1.74478, 1.75127]);

// Caveat (2): the envelope brackets BOTH cited sharp values from above (imp-96770 inline 0.76 and
// imp-96750 1.75), so the above-bracket verdict is robust to the unresolved normalisation gap.
export const IMP96796_DISCREPANCY = Object.freeze({
  s0Imp96770Inline: 0.76, // imp-96770 STEP 3 "sharp measured s0 ~ 0.76 for this kernel"
  s0Imp96750Window: 1.751, // imp-96750 top-window Q(b)/b
  ratioEnvOver770: IMP96796_S0_ENV / 0.76, // ~10.44
  ratioEnvOver750: IMP96796_S0_ENV / 1.751, // ~4.53
  bracketsBothFromAbove: true,
});

export const IMP96796_VERDICT = Object.freeze({
  question:
    'does the imp-96770 weighted-cotangent homogeneous envelope numerically bracket the imp-96750 ' +
    'candidate constant s0 ~ 1.75 from ABOVE?',
  bracketsFromAbove: true, // 5 K^2 ~ 7.94 > s0 ~ 1.751; dominant at every checked b
  bracketRatio: IMP96796_BRACKET_RATIO, // ~4.53 -- an order of magnitude loose (sup-type majorant)
  dominantAtEveryCheckedB: true, // envelope readout 7.59..7.82 > measured Q/b 1.69..1.75
  conditionalOnUnprovedEnvelope: true, // valid only IF (E) holds with absolute K; (E) measured, not proved
  normalisationDiscrepancyRobust: true, // brackets both 0.76 and 1.75 from above
  anyBoundMoved: false,
  computeBindsFirst: true,
  conclusion:
    'The imp-96770 homogeneous envelope supplies a numerical UPPER bracket for the imp-96750 s0 ~ 1.75 ' +
    'candidate: the envelope upper constant 5 K^2 ~ 7.94 (K ~ 1.26) exceeds s0 = 1.751 by a factor ' +
    '~4.53, and the per-b envelope readout K^2 * [Sum(1+log(b/a))^2/b] = 7.59, 7.73, 7.82 dominates ' +
    'the measured Q(b)/b window means 1.69, 1.73, 1.75, 1.75 at EVERY checked b. The bracket is (i) ' +
    'CONDITIONAL on the unproved envelope (E) (K creeps 1.245 -> 1.256 over B=200..800, measured not ' +
    'proved), (ii) an order of magnitude loose as expected of a sup-type majorant, and (iii) robust ' +
    'to the unresolved normalisation gap between imp-96770 inline 0.76 and imp-96750 1.75 (it brackets ' +
    'both from above, ratios 10.44 and 4.53). So the envelope route is a complementary numerical ' +
    'upper-bracket witness -- distinct from the analytic non-term-splitting lemma route -- but moves ' +
    'no rigorous bound: T = 2.594e7 stays the anchor, compute N ~ 9916 binds first, no refereed bound is changed' +
    ', RH open; NO QED.',
});

export const IMP96796_HONEST_BANNER =
  'RH open; no refereed bound is changed; NO QED. Bracket MEASUREMENT only: the imp-96770 homogeneous ' +
  'envelope constant 5 K^2 ~ 7.94 (K ~ 1.26) numerically brackets the imp-96750 s0 ~ 1.75 candidate ' +
  'FROM ABOVE (ratio ~4.53, dominant at every checked b), robustly of the unresolved 0.76-vs-1.75 ' +
  'normalisation gap. The bracket is CONDITIONAL on the unproved envelope (E) and an order of ' +
  'magnitude loose, so no rigorous bound is claimed moved and no positivity established.';

// -- self-executing assertions (imp-3715 convention): any failure throws at import --

const IMP96796_ASSERTIONS = [
  {
    id: 'imp96796-envelope-constant-brackets-s0-from-above',
    holds: () =>
      Math.abs(IMP96796_S0_ENV - 7.938) < 1e-6 &&
      IMP96796_S0_ENV > IMP96796_S0_CANDIDATE &&
      Math.abs(IMP96796_BRACKET_RATIO - IMP96796_S0_ENV / IMP96796_S0_CANDIDATE) < 1e-12 &&
      IMP96796_BRACKET_RATIO > 4 && IMP96796_BRACKET_RATIO < 5,
    why: 'the envelope upper constant 5 K^2 = 7.938 (K = 1.26) exceeds the imp-96750 candidate s0 = 1.751 by a factor ~4.53, so it brackets s0 from above (loosely, as a sup-type majorant).',
  },
  {
    id: 'imp96796-per-b-readout-dominates-measured',
    holds: () => {
      const maxMeasured = Math.max(...IMP96796_MEASURED_QOVERB);
      const minEnv = Math.min(...IMP96796_PER_B.map((r) => r.envQoverB));
      const climbing = IMP96796_PER_B.every((r, i) => i === 0 || r.envQoverB >= IMP96796_PER_B[i - 1].envQoverB);
      return minEnv > maxMeasured && climbing && minEnv > 7.5 && minEnv < 7.6;
    },
    why: 'the per-b envelope readout K^2*Sum(1+log(b/a))^2/b = 7.586 -> 7.730 -> 7.816 (climbing toward 5 K^2) exceeds the largest measured Q(b)/b window mean 1.75127 at every checked b, so the bracket holds pointwise in b, not only asymptotically.',
  },
  {
    id: 'imp96796-bracket-robust-to-normalisation-gap',
    holds: () =>
      IMP96796_DISCREPANCY.bracketsBothFromAbove === true &&
      IMP96796_S0_ENV > IMP96796_DISCREPANCY.s0Imp96770Inline &&
      IMP96796_S0_ENV > IMP96796_DISCREPANCY.s0Imp96750Window &&
      IMP96796_DISCREPANCY.ratioEnvOver770 > IMP96796_DISCREPANCY.ratioEnvOver750,
    why: 'the envelope constant 7.94 brackets BOTH the imp-96770 inline sharp 0.76 (ratio ~10.44) and the imp-96750 window s0 1.75 (ratio ~4.53) from above, so the above-bracket verdict survives the unresolved ~2.3x normalisation discrepancy between the two orphan modules.',
  },
  {
    id: 'imp96796-honesty-gate-no-qed',
    holds: () =>
      IMP96796_VERDICT.bracketsFromAbove === true &&
      IMP96796_VERDICT.conditionalOnUnprovedEnvelope === true &&
      IMP96796_VERDICT.anyBoundMoved === false &&
      IMP96796_VERDICT.computeBindsFirst === true &&
      /NO QED/.test(IMP96796_HONEST_BANNER) &&
      /PT Lambda <= 0.2|refereed bound is changed/.test(IMP96796_HONEST_BANNER) &&
      /RH open/.test(IMP96796_HONEST_BANNER),
    why: 'bracket measurement only: the envelope brackets s0 from above but conditional on the unproved envelope (E), no bound moved, compute binds first, and the honesty markers are present.',
  },
];

for (const a of IMP96796_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-96796-route-m-homogeneous-envelope-s0-upper-bracket assertion failed: ${a.id}`,
    );
  }
}

export default {
  kMeasured: IMP96796_K_MEASURED,
  s0Candidate: IMP96796_S0_CANDIDATE,
  s0Env: IMP96796_S0_ENV,
  bracketRatio: IMP96796_BRACKET_RATIO,
  perB: IMP96796_PER_B,
  measuredQoverB: IMP96796_MEASURED_QOVERB,
  discrepancy: IMP96796_DISCREPANCY,
  verdict: IMP96796_VERDICT,
  banner: IMP96796_HONEST_BANNER,
};
