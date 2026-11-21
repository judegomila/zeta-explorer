/**
 * @module imp-97767-cap-metric-jitter-glossary-headword
 * @fileoverview imp-97767 -- import-light glossary/Concepts headword recording the imp-97736
 *   MCM cap-metric jitter result: the imp-97724 trustworthy-cap metric (last checkpoint before
 *   the recovered-remainder relative error fails a threshold for 3 consecutive checkpoints) is
 *   intrinsically NOISY near the crossing -- rel oscillates between ~0.03 and ~4.6 across the
 *   window d in [1.8e6, 2.9e6] at dps=30 -- so a tiny 6.25e-17 change in the Glaisher constant
 *   (17-digit literal vs full precision) flips individual crossings and moves the dps=30 SNR=1
 *   cap 2847849 -> 2182639 (~30 percent). This jitter, not a clean threshold bias, is what makes
 *   the imp-97724 0.240-vs-0.215 SNR-threshold exponent gap look larger than it really is.
 *
 *   THE HEADWORD
 *   -----------------------------------------------
 *   (a) THE RESULT. imp-97736 showed the imp-97724 trustworthy-cap metric oscillates 0.03..4.6
 *   in recovered-remainder relative error near the crossing rather than crossing the threshold
 *   monotonically, so which checkpoint triplet first clears the 3-consecutive-fails rule is
 *   itself noisy: a 6.25e-17 Glaisher-constant change (17-digit literal vs full precision) moves
 *   the dps=30 SNR=1 cap by ~30 percent (2847849 -> 2182639).
 *   (b) WHY IT IS NEW. imp-97724 reported the cap-scaling exponents (0.2401 SNR=1, 0.2150
 *   SNR>=10) and attributed their gap to the slow-log correction, without diagnosing that the
 *   cap metric itself carries this much sampling noise near the crossing.
 *   (c) WHY IT MATTERS. It reclassifies the 0.240-vs-0.215 gap as substantially a measurement
 *   artifact (jitter plus 17-digit-literal contamination) rather than a physical threshold bias:
 *   under a consistent full-precision Glaisher constant the gap HALVES (0.0251 -> 0.0094 over
 *   dps 16/24/30).
 *   (d) WHY IT DOES NOT MOVE ANY BOUND. The jitter only affects where the cap metric latches, not
 *   the cap-independent rigorous 1/(720 d^3) tail budget (< 5.69e-11), which dwarfs any
 *   cap-to-infinity gap shift a million-fold below the +7.520579e-5 omega=10 gap.
 *   (e) STATUS: documentation only. No bound moved; no new inequality; the rigorous anchor stays
 *   the 1/(720 d^3) tail budget; MCM stays refuted from omega=11; NO QED.
 *
 *   STATUS: documentation only -- a Concepts glossary headword recording an already-established
 *   result. Not a new derivation. NO QED.
 *
 * @see imp-97736-mcm-cap-jitter-dps36.js (source: the 0.03..4.6 rel oscillation and the
 *   6.25e-17 -> ~30 percent cap-shift measurement this headword names)
 * @see imp-97724-mcm-dps-cap-scaling-fit.js (the 0.240-vs-0.215 SNR-threshold exponent gap
 *   this jitter partially explains)
 *
 * Ticket: imp-97767 (content, low, sonnet-4-6). Documentation only; establishes nothing new;
 * NO QED; no refereed bound is changed.
 */

// The cap-metric jitter headword, baked verbatim (no re-import).
const CAP_METRIC_JITTER_HEADWORD = Object.freeze({
  key: 'cap-metric-jitter-imp97736',
  term:
    'Cap-metric jitter: the imp-97724 trustworthy-cap latch oscillates 0.03..4.6 in relative ' +
    'error near the crossing, so a 6.25e-17 constant change moves the dps=30 cap by ~30 percent',
  definition:
    'The Route M MCM trustworthy-cap metric declares d* the last checkpoint before the ' +
    'recovered-remainder relative error fails a threshold for 3 consecutive checkpoints. Near ' +
    'the crossing this relative error does NOT decay monotonically: sampled at dps=30 it ' +
    'oscillates between rel ~ 0.03 and rel ~ 4.6 across the whole window d in [1.8e6, 2.9e6] ' +
    'before settling above 1 past ~2.9e6. Because the 3-consecutive-fails rule latches onto ' +
    'whichever checkpoint triplet happens to clear the threshold first, the reported cap is a ' +
    'noisy statistic, not a sharp deterministic boundary.',
  mechanism:
    'A 6.25e-17 change in the Glaisher-Kinkelin log-constant (17-digit literal vs full precision) ' +
    'flips individual crossings in this oscillating window and moves the dps=30 SNR=1 cap from ' +
    '2847849 to 2182639, a ~30 percent shift from a change many orders of magnitude smaller than ' +
    'the cap value itself. Under a consistent full-precision constant across dps 16/24/30 the ' +
    'SNR=1/SNR>=10 exponent gap HALVES (0.0251 -> 0.0094), showing that most of the imp-97724 ' +
    '0.240-vs-0.215 discrepancy was this jitter plus 17-digit-literal contamination, not a clean ' +
    'threshold bias.',
  verificationStatus:
    'Re-cited from the imp-97736 derivation module (src/data/imp-97736-mcm-cap-jitter-dps36.js), ' +
    'with the 0.03..4.6 oscillation range and the 2847849 -> 2182639 cap shift checked verbatim. ' +
    'Naming / glossary headword only; supplies no new bound; MCM stays refuted from omega=11; RH ' +
    'open; no refereed bound is changed; NO QED.',
});

export const IMP97767_CAP_METRIC_JITTER_GLOSSARY_HEADWORD = Object.freeze({
  id: 'imp-97767',
  proofSection: 'Route-M',
  glosses: 'imp-97736',
  question:
    'imp-97736 showed the imp-97724 trustworthy-cap metric oscillates 0.03..4.6 near the ' +
    'crossing and a 6.25e-17 constant change moves the dps=30 cap ~30 percent -- what is the ' +
    'headword for this jitter?',
  headword: CAP_METRIC_JITTER_HEADWORD,
  anyBoundMoved: false,
  verdict:
    'GLOSSARY HEADWORD ONLY (documentation, not a proof). Names the imp-97736 result that the ' +
    'imp-97724 trustworthy-cap latch is jitter-limited (rel oscillates 0.03..4.6 near the ' +
    'crossing; a 6.25e-17 Glaisher-constant change moves the dps=30 SNR=1 cap ~30 percent), which ' +
    'accounts for most of the 0.240-vs-0.215 SNR-threshold exponent gap. No bound moved; MCM stays ' +
    'refuted from omega=11; NO QED. No refereed bound is changed.',
  citation:
    'imp-97736 (the cap-jitter measurement this glosses); imp-97724 (the SNR-threshold exponent ' +
    'gap this jitter partially explains).',
});

export default IMP97767_CAP_METRIC_JITTER_GLOSSARY_HEADWORD;

// -- Tripwire assertions ------------------------------------------------------
export const IMP97767_CAP_METRIC_JITTER_GLOSSARY_HEADWORD_ASSERTIONS = [
  {
    id: 'imp97767-headword-names-oscillation-and-shift',
    why: 'The headword must name the 0.03..4.6 relative-error oscillation and the 6.25e-17 -> ' +
      '~30 percent cap-shift figures -- the entire content of the glossary entry.',
    holds: () => {
      const h = IMP97767_CAP_METRIC_JITTER_GLOSSARY_HEADWORD.headword;
      return (
        /0\.03/.test(h.definition) &&
        /4\.6/.test(h.definition) &&
        /6\.25e-17/.test(h.mechanism) &&
        /2847849/.test(h.mechanism) &&
        /2182639/.test(h.mechanism)
      );
    },
  },
  {
    id: 'imp97767-honesty-gate-no-qed',
    why: 'Documentation only: no bound claimed moved, no QED, no-refereed-bound-change line present, glosses imp-97736.',
    holds: () =>
      IMP97767_CAP_METRIC_JITTER_GLOSSARY_HEADWORD.anyBoundMoved === false &&
      /NO QED/.test(IMP97767_CAP_METRIC_JITTER_GLOSSARY_HEADWORD.verdict) &&
      /refereed bound is changed/i.test(IMP97767_CAP_METRIC_JITTER_GLOSSARY_HEADWORD.verdict) &&
      IMP97767_CAP_METRIC_JITTER_GLOSSARY_HEADWORD.glosses === 'imp-97736',
  },
];

for (const assertion of IMP97767_CAP_METRIC_JITTER_GLOSSARY_HEADWORD_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(
      `imp-97767-cap-metric-jitter-glossary-headword assertion failed: ${assertion.id}`,
    );
  }
}
