/**
 * @module imp-124922-kernel-decade-ratio-gap-keyed-glossary-headword
 * @fileoverview imp-124922 -- import-light glossary/Concepts headword naming the imp-124776
 *   GAP-KEYED re-presentation of the imp-97823 reconstruction-kernel sqrt(10)-per-decade growth
 *   law: the shared kernel |K| = |1/(N sigma_N)| per-decade growth ratio, relabeled by the
 *   actual near-peak gap g (rather than a bare decade index), on both arms of the imp-97520 L1
 *   sigma peak.
 *
 *   THE HEADWORD
 *   -----------------------------------------------
 *   (a) THE RESULT. imp-124776 takes the imp-97823 upslope/downslope per-decade |K| growth
 *   ratios -- already named by the imp-97842 inverse-square-root fold-law headword -- and keys
 *   each ratio to the TRAILING near-peak gap g of its decade-to-decade pair instead of a bare
 *   decade index. This produces a "ratio vs gap g" axis: wide-ladder g = 1e-2 .. 1e-7 and
 *   deep-window g = 1e-6 .. 1e-8, both arms converging onto sqrt(10) = 3.162278 as g shrinks.
 *   (b) WHY IT IS A DISTINCT HEADWORD. imp-97842 already glosses the imp-97823 MEASUREMENT (the
 *   deep-window least-squares fit p = -0.4994 / -0.5006). imp-124776 is a different artifact: a
 *   presentation leaf that re-keys the same ratio TABLE by physical gap value g rather than by
 *   decade rank, so a reader can look up "the ratio at g = 1e-7" directly instead of counting
 *   decades from the peak. No new computation; this headword names the re-keying, not a new fit.
 *   (c) WHY IT MATTERS. Gap-keying makes the near-peak bracketing explicit at a glance: the last
 *   deep-window ratio on each arm is closer to sqrt(10) than the first wide-window ratio on that
 *   arm (enforced by an assertion in imp-124776 itself), visually confirming the deep-limit
 *   convergence imp-97823 measured.
 *   (d) WHY IT DOES NOT MOVE ANY BOUND. Pure re-keying of an existing reused table for display;
 *   DIAG3 == 0, the C_C 1/8 ansatz, E_trunc, and the C_F prefactor are all fixed surrogate
 *   inputs, unchanged; no operator positivity established; no RH verdict.
 *   (e) STATUS: documentation only. No bound moved; no coefficient re-derived; the rigorous
 *   anchor stays the trace ceiling; NO QED.
 *
 *   STATUS: documentation only -- a Concepts glossary headword recording an already-established
 *   measurement's re-keyed presentation. Not a new derivation. NO QED.
 *
 * @see imp-124776-kernel-decade-ratio-vs-gap-viz-data.js (source: the gap-keyed re-presentation
 *   this headword names)
 * @see imp-97823-kernel-decade-growth-sqrt10.js (the underlying deep-limit sqrt(10) fit)
 * @see imp-97842-kernel-decade-growth-sqrt10-glossary-headword.js (sibling headword naming the
 *   raw imp-97823 measurement; this headword names the imp-124776 gap-keyed presentation of it,
 *   not a restatement of the same fact)
 *
 * Ticket: imp-124922 (content, low, sonnet-4-6). Documentation only; establishes nothing new;
 * NO QED; no refereed bound is changed.
 */

import { IMP124776_SUMMARY } from './imp-124776-kernel-decade-ratio-vs-gap-viz-data.js';

const KERNEL_DECADE_RATIO_GAP_KEYED_HEADWORD = Object.freeze({
  key: 'kernel-decade-ratio-gap-keyed-imp124776',
  term:
    'Gap-keyed kernel decade-ratio: the reconstruction kernel |K| = |1/(N sigma_N)| per-decade ' +
    'growth ratio, relabeled by the actual near-peak gap g rather than by decade index',
  definition:
    'imp-124776 re-keys the imp-97823/imp-97842 inverse-square-root fold-law ratio table so each ' +
    'per-decade growth ratio of |K| is indexed by its trailing near-peak gap g = sigma_max - sigma ' +
    '(wide ladder g = 1e-2 .. 1e-7, deep window g = 1e-6 .. 1e-8) instead of a bare decade count. ' +
    'Both the upslope and downslope arms of the imp-97520 L1 sigma peak converge onto ' +
    'sqrt(10) = 3.162278 as g shrinks, bracketing it from opposite sides.',
  mechanism:
    'Pure re-keying, no re-derivation: the ratio values are reused verbatim from the imp-97823 ' +
    'upslope/downslope tables (via IMP97823_KERNEL_DECADE_GROWTH_SQRT10), only the lookup key ' +
    'changes from decade index to the physical gap g of that decade-to-decade pair. This makes the ' +
    'deep-limit bracketing of sqrt(10) directly readable from the gap value rather than requiring a ' +
    'decade count from the peak.',
  verificationStatus:
    'Re-cited from the imp-124776 viz-data leaf (src/data/imp-124776-kernel-decade-ratio-vs-gap-' +
    'viz-data.js), itself reusing the imp-97823 measurement verbatim. Naming / glossary headword ' +
    'only; supplies no new bound; DIAG3 == 0 and the C_C 1/8 ansatz are untouched; RH open; ' +
    'no refereed bound is changed; NO QED.',
});

export const IMP124922_KERNEL_DECADE_RATIO_GAP_KEYED_GLOSSARY_HEADWORD = Object.freeze({
  id: 'imp-124922',
  proofSection: 'S-frontier',
  glosses: 'imp-124776',
  question:
    'imp-124776 re-keyed the imp-97823 reconstruction-kernel |K| = |1/(N sigma_N)| sqrt(10)-per-' +
    'decade growth ratios by the actual near-peak gap g instead of decade index -- what is the ' +
    'headword for this gap-keyed presentation?',
  headword: KERNEL_DECADE_RATIO_GAP_KEYED_HEADWORD,
  anyBoundMoved: false,
  verdict:
    'GLOSSARY HEADWORD ONLY (documentation, not a proof). Names the imp-124776 gap-keyed re-' +
    'presentation of the imp-97823/imp-97842 kernel |K| = |1/(N sigma_N)| sqrt(10)-per-decade ' +
    'growth ratio: both arms bracket sqrt(10) = 3.162278 as the trailing gap g shrinks (wide ' +
    'g = 1e-2 .. 1e-7, deep g = 1e-6 .. 1e-8). No new computation; no bound moved; imp-3066 K_a >= 0 ' +
    'untouched; DIAG3 == 0 and all pinned surrogate constants untouched; NO QED. No refereed bound is changed' +
    '.',
  citation:
    'imp-124776 (the gap-keyed presentation this headword names); imp-97823 (the deep-limit ' +
    'sqrt(10) fit it reuses); imp-97842 (sibling headword naming the same fit keyed by decade ' +
    'index instead of gap).',
});

export default IMP124922_KERNEL_DECADE_RATIO_GAP_KEYED_GLOSSARY_HEADWORD;

// -- Tripwire assertions ------------------------------------------------------
export const IMP124922_KERNEL_DECADE_RATIO_GAP_KEYED_GLOSSARY_HEADWORD_ASSERTIONS = [
  {
    id: 'imp124922-headword-names-gap-keying-and-sqrt10',
    why: 'The headword must name the gap-keying re-presentation and the sqrt(10) constant it ' +
      'brackets -- the entire content of the glossary entry.',
    holds: () => {
      const h = IMP124922_KERNEL_DECADE_RATIO_GAP_KEYED_GLOSSARY_HEADWORD.headword;
      return (
        /gap g/.test(h.definition) &&
        /sqrt\(10\)/.test(h.definition) &&
        /re-keying/.test(h.mechanism)
      );
    },
  },
  {
    id: 'imp124922-glosses-imp124776-distinct-from-imp97842',
    why: 'This headword must gloss imp-124776 (the gap-keyed leaf), distinct from the sibling ' +
      'imp-97842 headword which glosses the raw imp-97823 measurement.',
    holds: () => IMP124922_KERNEL_DECADE_RATIO_GAP_KEYED_GLOSSARY_HEADWORD.glosses === 'imp-124776',
  },
  {
    id: 'imp124922-consistent-with-source-leaf-verdict',
    why: 'The headword must not drift from the imp-124776 source leaf it names: both must agree ' +
      'the re-keying establishes no new bound.',
    holds: () => /no new computation/.test(IMP124776_SUMMARY.verdict),
  },
  {
    id: 'imp124922-honesty-gate-no-qed',
    why: 'Documentation only: no bound claimed moved, no QED, no-refereed-bound-change line present.',
    holds: () =>
      IMP124922_KERNEL_DECADE_RATIO_GAP_KEYED_GLOSSARY_HEADWORD.anyBoundMoved === false &&
      /NO QED/.test(IMP124922_KERNEL_DECADE_RATIO_GAP_KEYED_GLOSSARY_HEADWORD.verdict) &&
      /refereed bound is changed/i.test(IMP124922_KERNEL_DECADE_RATIO_GAP_KEYED_GLOSSARY_HEADWORD.verdict),
  },
  {
    id: 'imp124922-imp3066-untouched-citation',
    why: 'imp-124964 honesty-banner audit: the literal imp-3066 K_a >= 0 untouched citation was ' +
      'absent from this module and has been repaired into the verdict string.',
    holds: () => /imp-3066 K_a >= 0 untouched/.test(IMP124922_KERNEL_DECADE_RATIO_GAP_KEYED_GLOSSARY_HEADWORD.verdict),
  },
];

for (const assertion of IMP124922_KERNEL_DECADE_RATIO_GAP_KEYED_GLOSSARY_HEADWORD_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(
      `imp-124922-kernel-decade-ratio-gap-keyed-glossary-headword assertion failed: ${assertion.id}`,
    );
  }
}
