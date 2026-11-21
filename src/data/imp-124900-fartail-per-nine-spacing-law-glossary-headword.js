/**
 * @module imp-124900-fartail-per-nine-spacing-law-glossary-headword
 * @fileoverview imp-124900 -- import-light glossary/Concepts headword recording the imp-124793 /
 *   imp-124827 / imp-124846 far-tail per-nine spacing law for the sigma far-tail diagnostic
 *   1 - 1/log(T0/2pi): the exact leading + mantissa-correction split of the per-nine log10 N
 *   spacing Delta_k = g_k + m_k and the ten-fold-decaying mantissa share.
 *
 *   THE HEADWORD
 *   -----------------------------------------------
 *   (a) THE RESULT. imp-124793 pinned the per-nine ladder t_k = 1 - 10^-k (one added nine per
 *   rung) for the far-tail diagnostic D(T0) = 1 - 1/log(T0/2pi) and showed the log10-N spacing
 *   Delta_k = log10 N_{k+1} - log10 N_k climbs toward a ten-fold-per-rung ratio. imp-124827 split
 *   Delta_k exactly into a leading term g_k = 9*10^k*log10(e) and a mantissa-ratio correction
 *   m_k = log10((10^{k+1}-1)/(10^k-1)) -> 1, fitting the ten-fold decay of the deviation m_k - 1.
 *   imp-124846 isolated m_k AGAINST the leading term, tabulating the share m_k/Delta_k ~
 *   0.255843*10^-k (equivalently m_k/g_k ~ (1/(9*log10(e)))*10^-k), decaying exactly ten-fold per
 *   added nine, the quantitative closure of "m_k is sub-leading".
 *   (b) WHY IT IS NEW. The three modules build the law in stages (ladder -> exact split -> isolated
 *   share) but none named the composite law Delta_k = g_k + m_k with its mantissa share as a single
 *   citable headword; recent siblings imp-124801/124802 set the precedent of adding a glossary
 *   headword once a measurement chain like this stabilizes.
 *   (c) WHY IT MATTERS. It gives later citations a single name for "the far-tail per-nine spacing
 *   law" instead of having to re-derive the g_k/m_k split and the 0.256*10^-k share from three
 *   separate modules each time the geometric (ten-fold) approach of the diagnostic to 1 is invoked.
 *   (d) WHY IT DOES NOT MOVE ANY BOUND. This is a naming/cross-reference headword over an already
 *   inherited closed-form RvM inversion (imp-97723/imp-97744) applied to a conditional-share
 *   diagnostic. The C_mb GUE-conditional per imp-486, the C_C 1/8 ansatz (imp-2642/imp-2643), the
 *   pinned E_trunc 3.06e-5 and the imp-398 C_F prefactor are UNTOUCHED; establishes no operator
 *   positivity; imp-3066 K_a >= 0 untouched.
 *   (e) STATUS: documentation only. No bound moved; no new coefficient pinned beyond re-citing the
 *   imp-124793/124827/124846 measurements; the rigorous anchor stays the trace ceiling; NO QED.
 *
 *   STATUS: documentation only -- a Concepts glossary headword recording an already-established
 *   measurement chain. Not a new derivation. NO QED.
 *
 * @see imp-124793-fartail-diagnostic-per-nine-spacing-ladder.js (source: pure per-nine ladder,
 *   spacing ratio -> 10, "+~1" mantissa term flagged but unfit)
 * @see imp-124827-fartail-per-nine-mantissa-correction-decay.js (source: exact Delta_k = g_k + m_k
 *   split, m_k - 1 ten-fold decay fit, k = 5 rung added)
 * @see imp-124846-fartail-mantissa-leading-ratio-isolation.js (source: m_k isolated against g_k,
 *   mantissa share m_k/Delta_k ~ 0.255843*10^-k, ten-fold decay)
 * @see imp-97723-sigma-fartail-diagnostic-asymptote-one (diagnostic = 1 - 1/log(T0/2pi), asymptote 1)
 * @see imp-97744-fartail-diagnostic-crossing-heights (0.999/0.9999 crossing heights pinned)
 *
 * Ticket: imp-124900 (content, low, sonnet-4-6). Documentation only; establishes nothing new;
 * NO QED; no refereed bound is changed.
 */

// The far-tail per-nine spacing law headword, baked verbatim (no re-import of the heavy zeros bundle).
const FARTAIL_PER_NINE_SPACING_LAW_HEADWORD = Object.freeze({
  key: 'fartail-per-nine-spacing-law-imp124793',
  term:
    'imp-124793/124827/124846 far-tail per-nine spacing law: Delta_k = g_k + m_k, leading ' +
    'g_k = 9*10^k*log10(e) and mantissa correction m_k -> 1, with mantissa share ' +
    'm_k/Delta_k ~ 0.255843*10^-k decaying ten-fold per added nine',
  definition:
    'On the per-nine ladder t_k = 1 - 10^-k for the far-tail sigma diagnostic ' +
    'D(T0) = 1 - 1/log(T0/2pi), the log10 N spacing between consecutive nines splits exactly as ' +
    'Delta_k = log10 N_{k+1} - log10 N_k = g_k + m_k, with leading term ' +
    'g_k = 9*10^k*log10(e) (grows ten-fold per rung) and mantissa-ratio correction ' +
    'm_k = log10((10^{k+1}-1)/(10^k-1)) = 1 + 0.9*10^-k*log10(e) + O(10^-2k) (-> 1, deviation ' +
    'm_k - 1 decays ten-fold per rung). Isolated against the leading term, the mantissa share ' +
    'm_k/Delta_k ~ 0.255843*10^-k (equivalently m_k/g_k ~ (1/(9*log10(e)))*10^-k) also decays ' +
    'exactly ten-fold per added nine, forcing the overall spacing ratio Delta_{k+1}/Delta_k -> 10.',
  mechanism:
    'Because the per-nine target gives L_k = 1/(1 - t_k) = 10^k exactly, the Riemann-von Mangoldt ' +
    'relation N = (L - 1) e^L turns the fixed ten-fold growth of L into log10 N growth dominated by ' +
    'the linear term L*log10(e); differencing consecutive rungs isolates the ten-fold-per-rung ' +
    'g_k = 9*10^k*log10(e) exactly, leaving the log10(L-1) difference as the mantissa correction ' +
    'm_k that tends to a fixed +1 (a vanishing fraction of the ten-fold-growing g_k) -- the closed- ' +
    'form reason the geometric approach of the diagnostic to 1 costs a clean ten-fold jump in log10 ' +
    'N per added nine.',
  verificationStatus:
    'Re-cited from the imp-124793 (ladder + spacing ratio -> 10), imp-124827 (exact g_k/m_k split, ' +
    'k = 5 rung, m_k - 1 decay ratio 10.5317 -> 10.0005 -> 10) and imp-124846 (m_k isolated against ' +
    'g_k, share m_k/Delta_k from 2.595184e-2 down to 2.558431e-6 over k = 1..5, decay ratio ' +
    '10.1299 -> 10.0001 -> 10) measurement modules. Naming / glossary headword only; supplies no ' +
    'new bound; the C_C 1/8 ansatz and E_trunc/E_flow component model are untouched; RH open; ' +
    'no refereed bound is changed; NO QED.',
});

export const IMP124900_FARTAIL_PER_NINE_SPACING_LAW_GLOSSARY_HEADWORD = Object.freeze({
  id: 'imp-124900',
  proofSection: 'S-frontier',
  glosses: 'imp-124793',
  question:
    'imp-124793/124827/124846 measured, across the far-tail per-nine ladder, the exact leading + ' +
    'mantissa-correction split of the log10 N spacing Delta_k = g_k + m_k and the ten-fold-decaying ' +
    'mantissa share -- what is the headword for that composite spacing law?',
  headword: FARTAIL_PER_NINE_SPACING_LAW_HEADWORD,
  anyBoundMoved: false,
  verdict:
    'GLOSSARY HEADWORD ONLY (documentation, not a proof). Names the imp-124793/124827/124846 ' +
    'result chain: the far-tail per-nine log10 N spacing splits exactly as Delta_k = g_k + m_k, ' +
    'with leading g_k = 9*10^k*log10(e) growing ten-fold per rung and mantissa correction ' +
    'm_k -> 1 whose share m_k/Delta_k ~ 0.255843*10^-k decays ten-fold per added nine. No bound ' +
    'moved; the component model and all pinned surrogate constants are untouched; imp-3066 K_a >= 0 ' +
    'untouched; NO QED. No refereed bound is changed.',
  citation:
    'imp-124793 (per-nine ladder, spacing ratio -> 10, "+~1" mantissa term flagged); imp-124827 ' +
    '(exact Delta_k = g_k + m_k split, m_k - 1 ten-fold decay fit, k = 5 rung); imp-124846 (m_k ' +
    'isolated against g_k, mantissa share ~0.255843*10^-k, ten-fold decay); imp-97723/imp-97744 ' +
    '(inherited diagnostic and RvM inversion).',
});

export default IMP124900_FARTAIL_PER_NINE_SPACING_LAW_GLOSSARY_HEADWORD;

// -- Tripwire assertions ------------------------------------------------------
export const IMP124900_FARTAIL_PER_NINE_SPACING_LAW_GLOSSARY_HEADWORD_ASSERTIONS = [
  {
    id: 'imp124900-headword-names-leading-mantissa-split',
    why: 'The headword must name both the leading term g_k = 9*10^k*log10(e) and the mantissa ' +
      'correction m_k, plus the ten-fold-decaying mantissa share -- the entire content of the ' +
      'glossary entry.',
    holds: () => {
      const h = IMP124900_FARTAIL_PER_NINE_SPACING_LAW_GLOSSARY_HEADWORD.headword;
      return (
        /9\*10\^k\*log10\(e\)/.test(h.definition) &&
        /m_k = log10/.test(h.definition) &&
        /0\.255843\*10\^-k/.test(h.definition) &&
        /Delta_\{k\+1\}\/Delta_k -> 10/.test(h.definition)
      );
    },
  },
  {
    id: 'imp124900-honesty-gate-no-qed',
    why: 'Documentation only: no bound claimed moved, no QED, no-refereed-bound-change line present, glosses imp-124793.',
    holds: () =>
      IMP124900_FARTAIL_PER_NINE_SPACING_LAW_GLOSSARY_HEADWORD.anyBoundMoved === false &&
      /NO QED/.test(IMP124900_FARTAIL_PER_NINE_SPACING_LAW_GLOSSARY_HEADWORD.verdict) &&
      /refereed bound is changed/i.test(IMP124900_FARTAIL_PER_NINE_SPACING_LAW_GLOSSARY_HEADWORD.verdict) &&
      IMP124900_FARTAIL_PER_NINE_SPACING_LAW_GLOSSARY_HEADWORD.glosses === 'imp-124793',
  },
  {
    id: 'imp124900-citation-covers-full-chain',
    why: 'The headword must cross-link all three source modules (imp-124793/124827/124846) so ' +
      'the glossary entry is discoverable from any of them.',
    holds: () => {
      const c = IMP124900_FARTAIL_PER_NINE_SPACING_LAW_GLOSSARY_HEADWORD.citation;
      return /imp-124793/.test(c) && /imp-124827/.test(c) && /imp-124846/.test(c);
    },
  },
  {
    id: 'imp124900-imp3066-untouched-citation',
    why: 'imp-124979 honesty-banner audit: the literal imp-3066 K_a >= 0 untouched citation was ' +
      'present only in the JSDoc fileoverview, not in the exported verdict field; repaired so the ' +
      'citation survives a live-export audit, not just a raw file grep.',
    holds: () =>
      /imp-3066 K_a >= 0 untouched/.test(IMP124900_FARTAIL_PER_NINE_SPACING_LAW_GLOSSARY_HEADWORD.verdict),
  },
];

for (const assertion of IMP124900_FARTAIL_PER_NINE_SPACING_LAW_GLOSSARY_HEADWORD_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(
      `imp-124900-fartail-per-nine-spacing-law-glossary-headword assertion failed: ${assertion.id}`,
    );
  }
}
