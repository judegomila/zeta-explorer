/**
 * @module imp-97801-mcm-cap-snr-monotonicity-glossary-headword
 * @fileoverview imp-124784 -- import-light glossary/Concepts headword recording the imp-97801
 *   MCM trustworthy-cap SNR-monotonicity cross-validation: the caps are weakly decreasing in SNR
 *   at every dps rung, and the SNR=30-above-SNR=10 exponent ordering is only 0.216 jitter-sigma
 *   (jitter, not a genuine anomaly).
 *
 *   THE HEADWORD
 *   -----------------------------------------------
 *   (a) THE RESULT. Across the imp-97783 full MCM trustworthy-cap ladder (SNR thresholds
 *   1/3/10/30/100, dps 16/24/30/36, all under a consistent full-precision Glaisher constant),
 *   imp-97801 confirms two properties: RESULT 1, the caps themselves are weakly monotone
 *   DECREASING in SNR at every dps rung (a stricter SNR trusts no more digits -- one tie at
 *   dps=16 SNR=3==SNR=10, strictly decreasing at dps=24/30/36); RESULT 2, the SNR=30 (0.22328)
 *   above SNR=10 (0.22162) 4-point OLS cap-scaling exponent ordering is a gap of only +0.00167,
 *   which is 0.216 * SD_exp (SD_exp ~0.0077 from the imp-97736 +/-~30 percent cap-metric jitter
 *   propagated through the dps 16..36 OLS design).
 *   (b) WHY IT IS NEW. imp-97783 reported the non-monotone exponent ordering but left both the
 *   cap-level monotonicity and the jitter-vs-anomaly question implicit. imp-97801 is the first
 *   module to check both explicitly, on the same ladder reused byte-for-byte.
 *   (c) WHY IT MATTERS. Level (the caps) and slope (the log-log exponent) live on different axes:
 *   a coherent, cap-monotone surface can still carry a marginally non-monotone exponent set purely
 *   from cap-metric jitter, without any physical inconsistency. This settles that the imp-97783
 *   ordering anomaly is measurement jitter, not a sign the MCM cap ladder is internally broken.
 *   (d) WHY IT DOES NOT MOVE ANY BOUND. The cap-independent 1/(720 d^3) tail budget (< 5.69e-11)
 *   dwarfs any cap-to-infinity shift of the +7.520579e-5 omega=10 gap, so the primorial p_10#
 *   stays the strict minimiser and the MCM onset stays exactly omega=11. MCM stays refuted; the
 *   b/4 ceiling and kappa_arith are untouched.
 *   (e) STATUS: documentation only. No bound moved; no coefficient re-derived beyond re-citing the
 *   imp-97801 cross-validation; RH open; NO QED.
 *
 *   STATUS: documentation only -- a Concepts glossary headword recording an already-established
 *   cross-validation. Not a new derivation. NO QED.
 *
 * @see imp-97801-mcm-cap-snr-monotonicity.js (source: the cross-validation this headword names)
 * @see imp-97783-mcm-cap-fullprec-exponent-set.js (the full ladder + olsFull4 exponent set)
 * @see imp-97736-mcm-cap-jitter-dps36.js (+/-~30 percent cap-metric jitter this propagates)
 *
 * Ticket: imp-124784 (content, low, sonnet-4-6). Documentation only; establishes nothing new;
 * NO QED; no refereed bound is changed.
 */

// The MCM cap SNR-monotonicity headword, baked verbatim (no re-import of the heavy zeros bundle).
const MCM_CAP_SNR_MONOTONICITY_HEADWORD = Object.freeze({
  key: 'mcm-cap-snr-monotonicity-imp97801',
  term:
    'MCM cap SNR-monotonicity: the trustworthy-cap ladder is weakly decreasing in SNR at every ' +
    'dps rung, and the SNR=30-above-SNR=10 exponent inversion is 0.216 jitter-sigma',
  definition:
    'Across the imp-97783 full MCM trustworthy-cap ladder (SNR thresholds 1/3/10/30/100, dps ' +
    '16/24/30/36), the caps themselves are weakly monotone decreasing in SNR at every dps rung -- ' +
    'a stricter SNR threshold never trusts more digits (one tie at dps=16 SNR=3==SNR=10 at 1162; ' +
    'strictly decreasing at dps=24/30/36). Separately, the 4-point OLS cap-scaling exponent set ' +
    'shows SNR=30 (0.22328) sitting above SNR=10 (0.22162), a gap of +0.00167 that is only ' +
    '0.216 * SD_exp (SD_exp ~0.0077, derived from the imp-97736 +/-~30 percent cap-metric jitter ' +
    'propagated through the dps 16..36 OLS design, Sxx ~1161.12).',
  mechanism:
    'Level and slope live on different axes: cap-level monotonicity (RESULT 1) is a property of ' +
    'the raw caps at fixed dps, while the exponent ordering (RESULT 2) is a property of the ' +
    'log-log fit slope across dps. A coherent, cap-monotone surface can still carry a marginally ' +
    'non-monotone exponent set purely from cap-metric jitter (+/-30 percent multiplicative cap ' +
    'jitter is +/-ln(1.3) ~0.2624 in ln(cap)), without any physical inconsistency. The whole ' +
    '5-threshold exponent spread (0.00685) stays under one jitter-sigma, confirming the SNR=30 ' +
    'vs SNR=10 ordering is inside the jitter band rather than a genuine threshold-dependent anomaly.',
  verificationStatus:
    'Re-cited from the imp-97801 cross-validation module ' +
    '(src/data/imp-97801-mcm-cap-snr-monotonicity.js): all four dps rungs pass the weak-monotone ' +
    'cap check, the re-derived 4-point OLS exponents reproduce imp-97783 olsFull4 to 1e-9, and the ' +
    'SNR=30-minus-SNR=10 exponent gap is 0.216 jitter-sigma (< 1/4 of one sigma). Naming / glossary ' +
    'headword only; supplies no new bound; the MCM onset stays omega=11, MCM stays refuted; RH open; ' +
    'no refereed bound is changed; NO QED.',
});

export const IMP97801_MCM_CAP_SNR_MONOTONICITY_GLOSSARY_HEADWORD = Object.freeze({
  id: 'imp-124784',
  proofSection: 'S-frontier',
  glosses: 'imp-97801',
  question:
    'imp-97801 checked two properties left implicit by imp-97783 on the full MCM trustworthy-cap ' +
    'ladder -- are the caps monotone decreasing in SNR at every dps rung, and is the SNR=30 above ' +
    'SNR=10 exponent ordering a genuine anomaly or cap-metric jitter -- what is the headword for ' +
    'this cross-validation?',
  headword: MCM_CAP_SNR_MONOTONICITY_HEADWORD,
  anyBoundMoved: false,
  verdict:
    'GLOSSARY HEADWORD ONLY (documentation, not a proof). Names the imp-97801 cross-validation: ' +
    'the MCM trustworthy-cap ladder is weakly monotone decreasing in SNR at every dps rung (one tie ' +
    'at dps=16), and the SNR=30-above-SNR=10 exponent ordering is 0.216 jitter-sigma -- inside the ' +
    'imp-97736 +/-~30 percent cap-metric jitter band, jitter not anomaly. No bound moved; MCM stays ' +
    'refuted; the onset stays omega=11; NO QED. No refereed bound is changed.',
  citation:
    'imp-97801 (the cross-validation this glosses); imp-97783 (the source full cap ladder + ' +
    'olsFull4 exponent set); imp-97736 (the +/-~30 percent cap-metric jitter this propagates).',
});

export default IMP97801_MCM_CAP_SNR_MONOTONICITY_GLOSSARY_HEADWORD;

// -- Tripwire assertions ------------------------------------------------------
export const IMP97801_MCM_CAP_SNR_MONOTONICITY_GLOSSARY_HEADWORD_ASSERTIONS = [
  {
    id: 'imp124784-headword-names-monotonicity-and-jitter-sigma',
    why: 'The headword must name the weak cap monotonicity result and the 0.216 jitter-sigma ' +
      'reading -- the entire content of the glossary entry.',
    holds: () => {
      const h = IMP97801_MCM_CAP_SNR_MONOTONICITY_GLOSSARY_HEADWORD.headword;
      return (
        /weakly monotone decreasing in SNR/.test(h.definition) &&
        /0\.00167/.test(h.definition) &&
        /0\.216/.test(h.definition) &&
        /SD_exp ~0\.0077/.test(h.definition)
      );
    },
  },
  {
    id: 'imp124784-honesty-gate-no-qed',
    why: 'Documentation only: no bound claimed moved, no QED, no-refereed-bound-change line present, glosses imp-97801.',
    holds: () =>
      IMP97801_MCM_CAP_SNR_MONOTONICITY_GLOSSARY_HEADWORD.anyBoundMoved === false &&
      /NO QED/.test(IMP97801_MCM_CAP_SNR_MONOTONICITY_GLOSSARY_HEADWORD.verdict) &&
      /refereed bound is changed/i.test(IMP97801_MCM_CAP_SNR_MONOTONICITY_GLOSSARY_HEADWORD.verdict) &&
      IMP97801_MCM_CAP_SNR_MONOTONICITY_GLOSSARY_HEADWORD.glosses === 'imp-97801',
  },
];

for (const assertion of IMP97801_MCM_CAP_SNR_MONOTONICITY_GLOSSARY_HEADWORD_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(
      `imp-97801-mcm-cap-snr-monotonicity-glossary-headword assertion failed: ${assertion.id}`,
    );
  }
}
