/**
 * @module imp-95892-intermediate-ordinate-reach-glossary-headword
 * @fileoverview imp-95892 -- import-light glossary/Concepts headword for the imp-95863
 *   intermediate-ordinate-table reach ledger: what "decades bought" means, why the only
 *   in-repo table (N=1e6) buys zero of them, and the N_smooth(3e12) ~ 1.2362e13 price of
 *   closing the ~6.70-decade gap to the T=3.0e12 verified-height window bottom numerically.
 *
 *   WHY A GLOSSARY HEADWORD (not a re-derivation)
 *   -----------------------------------------------
 *   imp-95863 built a decade ledger over candidate consecutive-ordinate table sizes
 *   N = 1e6..1e13, answering whether a "zeros-to-1e7 or higher" table (floated by the
 *   frontier scout) would narrow the imp-95843 / imp-95735 number-variance-ratio
 *   window-reach data-ceiling. A reader landing on that module cold has no quick-lookup
 *   definition of what a "decade bought" is, why the answer is 0.0000 in-repo, or how
 *   large a table would actually be needed. This headword bakes those facts VERBATIM (no
 *   re-import of the imp-95863 module, to stay import-light) as a standalone lookup entry.
 *
 *   THE HEADWORD
 *   -----------------------------------------------
 *   For a consecutive-ordinate table of N zeros, the top ordinate gamma_N is the height
 *   at which the Riemann-von Mangoldt smooth counting function N_smooth(T) =
 *   (T/2pi)[ln(T/2pi) - 1] + 7/8 equals N. "Decades to window" is
 *   log10(3.0e12 / gamma_N): how many powers of ten remain between a table's reach and
 *   the T=3.0e12 verified-height window bottom (imp-95519). "Decades bought" is the
 *   reduction in that gap relative to the in-repo ceiling gamma_1e6 = 600269.677 (the
 *   exact ZEROS_EXTENDED anchor; imp-95801 audited every ordinate source in the repo and
 *   found none higher).
 *
 *   WHY IN-REPO DECADES BOUGHT IS ZERO: the ledger's rows above N=1e6 (1e7..1e13) are
 *   RvM-asymptotic Newton-inversion ESTIMATES of hypothetical tables, not tables that
 *   exist in the repo. Per the imp-95801 catalog, NONE of them is cataloged, so the
 *   decades actually bought by any real, in-repo source is 0.0000 and the baseline gap
 *   (6.6988 decades) stands unchanged regardless of how the estimates read.
 *
 *   THE PRICE OF CLOSING THE GAP NUMERICALLY: because zero density grows only
 *   logarithmically (gamma_N ~ 2pi N / ln N), each 10x increase in N buys only ~0.95
 *   decades of reach, not a full decade -- so the gap narrows sub-linearly in table size.
 *   Landing a window CENTRED at T=3.0e12 needs N_smooth(3.0e12) ~ 1.2362e13 consecutive
 *   ordinates, about 1.24e7 times the in-repo N=1e6 table -- an Odlyzko-scale computation
 *   absent from the repo, not a cheap extension. A merely "zeros-to-1e7" table buys under
 *   one decade (0.92) and leaves the gap still ~5.78 decades short.
 *
 *   STATUS: assessment only, not a construction. It changes no bound: the only in-repo
 *   lever that actually reaches T=3e12 is the imp-95722 analytic r_cap envelope
 *   (r_cap(3e12) ~ 0.26), not a bigger ordinate table.
 *
 *   WHAT THIS IS AND IS NOT
 *   ------------------------
 *   A glossary-style lookup restating the imp-95863 assessment for quick reference. It
 *   establishes nothing, instantiates no interval, closes no sub-gap, moves no bound.
 *   NO QED. No refereed bound is changed.
 *
 * @see imp-95863-intermediate-ordinate-table-reach-ledger (source: the ledger this glosses)
 * @see imp-95801-ordinate-source-reach-audit (in-repo ceiling gamma_1e6 = 6.003e5, no source higher)
 * @see imp-95722 (the r_cap analytic envelope, the only lever that actually reaches T=3e12)
 *
 * Ticket: imp-95892 (content, low). Documentation only; establishes nothing; NO QED;
 * no refereed bound is changed.
 */

// The decades-bought / N_smooth(3e12) headword, baked verbatim (no re-import).
const INTERMEDIATE_ORDINATE_REACH_HEADWORD = Object.freeze({
  key: 'intermediate-ordinate-table-reach-decades-bought',
  term:
    'Decades bought (intermediate verified-ordinate table reach ledger) and '
    + 'N_smooth(3e12) ~ 1.2362e13, the price of closing the reach gap numerically',
  definition:
    'For a consecutive-ordinate table of N zeros, "decades bought" measures how much a '
    + 'candidate table narrows the gap to a target height T, relative to the in-repo '
    + 'ceiling. It is log10(T / gamma_1e6) - log10(T / gamma_N), where gamma_N is the top '
    + 'ordinate of the N-zero table (inverted from the Riemann-von Mangoldt smooth '
    + 'counting function N_smooth(T) = (T/2pi)[ln(T/2pi) - 1] + 7/8 = N) and '
    + 'gamma_1e6 = 600269.677 is the exact ZEROS_EXTENDED anchor, the only real table in '
    + 'the repo (imp-95801 audit).',
  whyZeroInRepo:
    'The imp-95863 ledger tabulates decades bought at N = 1e7..1e13, but those rows are '
    + 'RvM-asymptotic Newton-inversion ESTIMATES of hypothetical tables -- per the '
    + 'imp-95801 catalog NONE of them is cataloged in the repo. So the decades actually '
    + 'bought by any real source is 0.0000, and the baseline gap of 6.6988 decades to '
    + 'T = 3.0e12 stands unchanged no matter how the estimate rows read.',
  priceOfClosingTheGap:
    'Zero density grows only logarithmically (gamma_N ~ 2pi N / ln N), so each 10x '
    + 'increase in table size buys only ~0.95 decades of reach, not a full decade -- the '
    + 'gap narrows sub-linearly in table size. Landing a window centred at T = 3.0e12 '
    + 'needs N_smooth(3.0e12) ~ 1.2362e13 consecutive ordinates, about 1.24e7 times the '
    + 'in-repo N = 1e6 table: an Odlyzko-scale computation absent from the repo, not a '
    + 'cheap extension. Even a "zeros-to-1e7" table buys under one decade (0.92) and '
    + 'leaves the gap still ~5.78 decades short.',
  status:
    'Assessment only, not a construction: no intermediate table exists in-repo, so no '
    + 'decades are actually bought. The only in-repo lever that actually reaches '
    + 'T = 3e12 is the imp-95722 analytic r_cap envelope (r_cap(3e12) ~ 0.26), not a '
    + 'bigger ordinate table.',
});

export const IMP95892_INTERMEDIATE_ORDINATE_REACH_GLOSSARY_HEADWORD = Object.freeze({
  id: 'imp-95892',
  proofSection: 'S-frontier',
  glosses: 'imp-95863',
  question:
    'imp-95863 built a decade ledger assessing whether any intermediate verified-ordinate '
    + 'table narrows the number-variance-ratio window-reach gap toward T = 3.0e12. What '
    + 'does "decades bought" mean, why is the in-repo answer zero, and how large a table '
    + 'would actually close the gap, for a reader landing on that module cold?',
  headword: INTERMEDIATE_ORDINATE_REACH_HEADWORD,
  anyBoundMoved: false,
  verdict:
    'GLOSSARY HEADWORD ONLY (documentation, not a proof). Restates the imp-95863 '
    + 'assessment: decades bought measures the RvM-inverted reach of a candidate '
    + 'consecutive-ordinate table relative to the in-repo N=1e6 ceiling; because no '
    + 'intermediate table is cataloged in-repo (imp-95801), decades actually bought is '
    + '0.0000 and the 6.6988-decade gap to T = 3.0e12 stands; closing it numerically '
    + 'needs N_smooth(3.0e12) ~ 1.2362e13 ordinates, ~1.24e7 times the in-repo table. '
    + 'Establishes nothing; instantiates no interval; moves no bound; NO QED. '
    + 'No refereed bound is changed.',
  citation:
    'imp-95863 (the ledger this glosses); imp-95801 (in-repo ordinate-source reach audit, '
    + 'gamma_1e6 = 6.003e5 ceiling, no source higher); imp-95843 / imp-95735 (the '
    + 'number-variance-ratio window-reach data-ceiling this ledger assesses); imp-95722 '
    + '(the r_cap analytic envelope, the only in-repo lever that actually reaches T=3e12).',
});

export default IMP95892_INTERMEDIATE_ORDINATE_REACH_GLOSSARY_HEADWORD;

// -- Tripwire assertions ------------------------------------------------------
export const IMP95892_INTERMEDIATE_ORDINATE_REACH_GLOSSARY_HEADWORD_ASSERTIONS = [
  {
    id: 'imp95892-headword-has-required-fields',
    why: 'The headword must name decades bought, the zero-in-repo finding, and the N_smooth(3e12) price -- the entire point of the glossary entry.',
    holds: () => {
      const h = INTERMEDIATE_ORDINATE_REACH_HEADWORD;
      return (
        /decades bought/i.test(h.definition) &&
        /0\.0000/.test(h.whyZeroInRepo) &&
        /1\.2362e13/.test(h.priceOfClosingTheGap) &&
        /r_cap/.test(h.status)
      );
    },
  },
  {
    id: 'imp95892-honesty-gate-no-qed',
    why: 'Documentation only: no bound claimed moved, no QED, no-refereed-bound-change line present.',
    holds: () =>
      IMP95892_INTERMEDIATE_ORDINATE_REACH_GLOSSARY_HEADWORD.anyBoundMoved === false &&
      /NO QED/.test(IMP95892_INTERMEDIATE_ORDINATE_REACH_GLOSSARY_HEADWORD.verdict) &&
      /refereed bound is changed/i.test(IMP95892_INTERMEDIATE_ORDINATE_REACH_GLOSSARY_HEADWORD.verdict) &&
      IMP95892_INTERMEDIATE_ORDINATE_REACH_GLOSSARY_HEADWORD.glosses === 'imp-95863',
  },
];

for (const assertion of IMP95892_INTERMEDIATE_ORDINATE_REACH_GLOSSARY_HEADWORD_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(
      `imp-95892-intermediate-ordinate-reach-glossary-headword assertion failed: ${assertion.id}`,
    );
  }
}
