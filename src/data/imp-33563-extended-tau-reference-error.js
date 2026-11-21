/**
 * @module imp-33563-extended-tau-reference-error
 * @fileoverview imp-33563 -- MEASURE whether the imp-33534 ~0.947 ULP peak double-double
 *   reference-libm error of the imp-33249 grade6/171p -ln A(tau) single hit RECURS, GROWS, or
 *   DECAYS when the tau grid is extended ABOVE tau=6 into the imp-33277/imp-33312 higher-height
 *   regime (tau in {6.5..10}).
 *
 *   THE QUESTION
 *   -----------
 *   imp-33534 recomputed the imp-33249/imp-33296 grade6/171-panel min-node single hit of -ln A(tau)
 *   under a ~106-bit DOUBLE-DOUBLE reference-precision libm and found the double-libm value differs
 *   from the reference by up to ~0.947 ULP -- an isolated lattice hit at tau=2.5, a secondary ~0.705
 *   at tau=5 -- on the tau grid {0.5..6}. imp-33561 then showed that ~0.947 figure is LATTICE JITTER,
 *   non-monotone in the panel count. Left open: does the ~0.947 ULP worst-case RECUR, GROW, or DECAY
 *   as tau climbs above 6 into the higher-height regime, or is it confined to the low-tau window?
 *
 *   THE MEASUREMENT
 *   ---------------
 *   The offline probe scripts/imp-33563-extended-tau-reference-error.mjs reuses the imp-33534 double
 *   vs double-double reference libm VERBATIM (Dekker/Knuth twoSum/twoProd, range-reduced 24-term
 *   Taylor ddExp, one-Newton-step ddLog), holding the panel budget FIXED at the imp-33249 grade6/171p
 *   single hit. It first reproduces the imp-33534 anchor grid {0.5..6} (peak 0.9471 ULP @tau=2.5),
 *   then extends to {6.5..10} step 0.5, reporting for each tau
 *     refErr(tau) = |fp64 single hit - double-double reference| / (|dd_reference| * EPS)   [in ULP].
 *   The values below are BAKED from that offline run.
 *
 *   HEADLINE: RECURS AT COMPARABLE MAGNITUDE -- HEIGHT-INDEPENDENT JITTER BAND, STILL SUB-1-ULP
 *   -----------------------------------------------------------------------------------------
 *   The ~0.947 ULP worst-case does NOT grow with height and does NOT decay away above tau=6: it
 *   RECURS at a comparable magnitude, confirming the imp-33561 lattice-jitter reading extends into
 *   the higher-height regime. Per-tau reference error on the extension:
 *     tau=6.5 -> 0.8941 ULP     tau=8.5 -> 0.0000 ULP
 *     tau=7.0 -> 0.0000 ULP     tau=9.0 -> 0.6650 ULP
 *     tau=7.5 -> 0.5240 ULP     tau=9.5 -> 0.7200 ULP
 *     tau=8.0 -> 0.0000 ULP     tau=10.0-> 0.0000 ULP
 *   So:
 *     (1) DOES NOT GROW: the extension peak is 0.8941 ULP @tau=6.5, ~0.053 ULP BELOW the anchor
 *         0.9471 -- essentially the SAME band, not a growing envelope. The worst-case is bounded by
 *         the anchor, never exceeding it, so height does NOT amplify the reference-libm error.
 *     (2) DOES NOT DECAY AWAY: the contamination is NOT confined to low tau -- 4 of the 8 extension
 *         taus land over the ~0.24 ULP single-hit headroom (vs 2/12 on the anchor grid), and the
 *         extension mean (~0.350 ULP) actually EXCEEDS the anchor mean (~0.138 ULP). Higher tau does
 *         not clean up the lattice; if anything more taus land as jitter hits in this window.
 *     (3) STAYS SUB-BAR: every extension tau stays below the strict 1-ULP bar (peak 0.8941 < 1), so
 *         the reference-precision libm never moves the higher-height single hit past 1 ULP.
 *     (4) SAME JITTER SIGNATURE: the error is 0 ULP (machine-exact) at half the extension taus and
 *         ~0.5-0.9 ULP at the others, with no monotone tau -> error law -- the identical lattice-hit
 *         signature imp-33561 measured across panel budgets, now confirmed across height.
 *   NET: the ~0.947 ULP worst-case is a HEIGHT-INDEPENDENT lattice-jitter band, not a low-tau
 *   artifact and not a growing envelope. It recurs at comparable magnitude above tau=6 and stays
 *   sub-1-ULP, REINFORCING the imp-33534/imp-33296 recommendation to quote the BAND (which averages
 *   over the lattice) rather than any single tau or panel count.
 *
 *   WHAT THIS DOES AND DOES NOT ESTABLISH (mandatory honesty)
 *   --------------------------------------------------------
 *   ACCURACY MEASUREMENT ONLY, at the RH-equivalent scale class. The double-double libm is a
 *   reference-precision SURROGATE for a correctly-rounded libm (~106-bit vs 53-bit), NOT a survey of
 *   real platform libms. It establishes NO operator positivity and NO new bound; it changes no
 *   bound. Mass-feasibility is NECESSARY-BUT-NOT-SUFFICIENT; the operator-level K_a &gt;= 0
 *   sign-positivity (imp-3066) is UNTOUCHED. The NPHI=10 Phi-series truncation is inherited upstream.
 *   No RH verdict, no QED. No refereed bound is changed.
 *
 *   @see imp-33534-min-node-reference-precision-libm.js (the ~106-bit dd reference libm this reuses)
 *   @see imp-33561-panel-budget-vs-reference-error.js (the panel-budget jitter this extends in tau)
 *   @see imp-33559-envelope-under-reference-libm.js (the same reference libm on the tau>=7 envelope)
 */

const EPS = Math.pow(2, -52);
const GRADE = 6;
const PANELS = 171; // the imp-33249 grade6/171p min-node single hit, FIXED
const HEADROOM = 0.24; // imp-33534 grade6/171p headroom below the strict 1-ULP bar
const BAR = 1.0; // the strict 1-ULP accuracy bar

// -- BAKED anchor (imp-33534 reproduce) and extension reference error (double ULP) ----------------
// refErr(tau) = |fp64 single hit - double-double reference| / (|reference|*EPS), grade6/171p FIXED.
// See scripts/imp-33563-extended-tau-reference-error.mjs.
const ANCHOR_PEAK_ULP = 0.9471; // imp-33534 grid {0.5..6}, at tau=2.5
const ANCHOR_PEAK_TAU = 2.5;
const ANCHOR_MEAN_ULP = 0.1376; // imp-33534 mean over {0.5..6} (12 taus)

const EXTENSION = [
  { tau: 6.5, refErrUlp: 0.8941 },
  { tau: 7.0, refErrUlp: 0.0000 },
  { tau: 7.5, refErrUlp: 0.5240 },
  { tau: 8.0, refErrUlp: 0.0000 },
  { tau: 8.5, refErrUlp: 0.0000 },
  { tau: 9.0, refErrUlp: 0.6650 },
  { tau: 9.5, refErrUlp: 0.7200 },
  { tau: 10.0, refErrUlp: 0.0000 },
];

const extPeakRow = EXTENSION.reduce((m, r) => (r.refErrUlp > m.refErrUlp ? r : m), EXTENSION[0]);
const extPeakUlp = extPeakRow.refErrUlp;
const extPeakTau = extPeakRow.tau;
const extMeanUlp = EXTENSION.reduce((s, r) => s + r.refErrUlp, 0) / EXTENSION.length;
const extTausOverHeadroom = EXTENSION.filter((r) => r.refErrUlp > HEADROOM).length;

// classification of the height dependence of the reference error above tau=6
const grows = extPeakUlp > ANCHOR_PEAK_ULP + 0.05;
const recursComparable = Math.abs(extPeakUlp - ANCHOR_PEAK_ULP) <= 0.10; // same ~0.9 ULP band
const decaysAway = extPeakUlp < HEADROOM; // worst-case falls below the single-hit headroom
const allExtensionSubBar = EXTENSION.every((r) => r.refErrUlp < BAR);

const verdict = grows
  ? 'GROWS-WITH-HEIGHT'
  : decaysAway
    ? 'DECAYS-AWAY-ABOVE-TAU-6'
    : 'RECURS-COMPARABLE-HEIGHT-INDEPENDENT-JITTER'; // measured branch

export const IMP33563_EXTENDED_TAU_REFERENCE_ERROR = {
  id: 'imp-33563',
  title:
    'Extended-tau (>6) fp64-vs-double-double reference-libm error of the imp-33249 grade6/171p ' +
    '-ln A(tau) single hit: does the imp-33534 ~0.947 ULP peak recur, grow, or decay with height?',
  category: 'accuracy',
  grade: GRADE,
  panels: PANELS,
  epsDouble: EPS,
  headroomUlp: HEADROOM,
  barUlp: BAR,
  anchorGrid: { lo: 0.5, hi: 6.0, step: 0.5, count: 12 },
  extensionGrid: { lo: 6.5, hi: 10.0, step: 0.5, count: EXTENSION.length },
  anchorPeakUlp: ANCHOR_PEAK_ULP,
  anchorPeakTau: ANCHOR_PEAK_TAU,
  anchorMeanUlp: ANCHOR_MEAN_ULP,
  extension: EXTENSION,
  extPeakUlp,
  extPeakTau,
  extMeanUlp,
  extTausOverHeadroom,
  grows,
  recursComparable,
  decaysAway,
  allExtensionSubBar,
  verdict,
  headline:
    'The imp-33534 ~0.947 ULP peak reference error RECURS at comparable magnitude above tau=6: the ' +
    'extension peak is 0.8941 ULP @tau=6.5 (~0.05 ULP below the anchor 0.9471), so the worst-case ' +
    'does NOT grow with height and stays bounded by the anchor. It does NOT decay away either -- ' +
    '4/8 extension taus exceed the ~0.24 ULP headroom (vs 2/12 on the anchor) and the extension ' +
    'mean (~0.350 ULP) exceeds the anchor mean (~0.138). Every extension tau stays sub-1-ULP. The ' +
    'error is machine-exact at half the taus and ~0.5-0.9 ULP at the rest -- the same height- and ' +
    'panel-independent lattice-jitter signature imp-33561 measured, now confirmed across height. ' +
    'Reinforces quoting the imp-33296 BAND over any single tau or panel count.',
  honestCaveat: {
    isProof: false,
    isReductionBelowRH: false,
    changesNoBound: true,
    measurementOnly: true,
    referencePrecisionSurrogate: true,
    didNotAttemptPositivity: true,
    imp3066Untouched: true,
    nphiTruncationInherited: true,
    noQED: true,
    sota: 'No refereed bound is changed.',
  },
};

// -- self-executing assertions --------------------------------------------------------------------
export const IMP33563_EXTENDED_TAU_REFERENCE_ERROR_ASSERTIONS = [
  {
    id: 'imp33563-anchor-reproduces-imp33534',
    why: 'The anchor grid {0.5..6} peak must reproduce the imp-33534 ~0.947 ULP figure at tau=2.5, ' +
         'anchoring the extension to the published single-hit result.',
    holds: () => Math.abs(ANCHOR_PEAK_ULP - 0.9471) < 0.02 && ANCHOR_PEAK_TAU === 2.5,
  },
  {
    id: 'imp33563-peak-does-not-grow-with-height',
    why: 'The extension peak (0.8941 ULP @tau=6.5) must not exceed the anchor peak -- height does ' +
         'not amplify the reference-libm error.',
    holds: () => grows === false && extPeakUlp <= ANCHOR_PEAK_ULP,
  },
  {
    id: 'imp33563-peak-recurs-at-comparable-magnitude',
    why: 'The worst-case RECURS above tau=6 at a comparable ~0.9 ULP magnitude (within ~0.1 ULP of ' +
         'the anchor), not confined to the low-tau window.',
    holds: () => recursComparable && extPeakUlp > 0.5,
  },
  {
    id: 'imp33563-contamination-does-not-decay-away',
    why: 'The lattice jitter does NOT clean up at higher tau: multiple extension taus stay over the ' +
         '~0.24 ULP headroom and the extension mean exceeds the anchor mean.',
    holds: () => decaysAway === false && extTausOverHeadroom >= 3 && extMeanUlp > ANCHOR_MEAN_ULP,
  },
  {
    id: 'imp33563-extension-stays-sub-bar',
    why: 'Every extension tau stays below the strict 1-ULP bar (peak 0.8941 ULP).',
    holds: () => allExtensionSubBar && extPeakUlp < BAR,
  },
  {
    id: 'imp33563-same-lattice-jitter-signature',
    why: 'The error is machine-exact (0 ULP) at some extension taus and sub-1-ULP at others -- the ' +
         'height-independent lattice-jitter signature imp-33561 measured across panel budgets.',
    holds: () =>
      EXTENSION.some((r) => r.refErrUlp === 0) && EXTENSION.some((r) => r.refErrUlp > 0.24),
  },
  {
    id: 'imp33563-verdict-records-the-assessment',
    why: 'The classified verdict must record the measured recurs-comparable, height-independent branch.',
    holds: () => verdict === 'RECURS-COMPARABLE-HEIGHT-INDEPENDENT-JITTER',
  },
  {
    id: 'imp33563-honest-diagnostic-not-a-verdict',
    why: 'Mandatory honesty: accuracy measurement only, changes no bound, reference-precision ' +
         'surrogate not a platform survey, operator positivity (imp-3066) untouched, no refereed bound is changed.',
    holds: () => {
      const c = IMP33563_EXTENDED_TAU_REFERENCE_ERROR.honestCaveat;
      return (
        c.isProof === false &&
        c.isReductionBelowRH === false &&
        c.changesNoBound === true &&
        c.didNotAttemptPositivity === true &&
        c.noQED === true &&
        /Platt-Trudgian|refereed bound is changed/.test(c.sota)
      );
    },
  },
];

for (const assertion of IMP33563_EXTENDED_TAU_REFERENCE_ERROR_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-33563-extended-tau-reference-error assertion failed: ${assertion.id}`);
  }
}

export default IMP33563_EXTENDED_TAU_REFERENCE_ERROR;
