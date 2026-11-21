/**
 * @module imp-95990-crossover-ordinate-count-reach-glossary-headword
 * @fileoverview imp-95990 -- import-light glossary/Concepts headword recording the imp-95947
 *   crossover ordinate-count reach finding: the verified-ordinate-table size a direct WINDOWED
 *   sd(C - E) number-variance measurement would need to reach the imp-95729 crossover
 *   T0 ~ 1.14e9, and the ~3.6-order-of-magnitude shortfall from the in-repo N = 1e6 ceiling.
 *
 *   THE HEADWORD (baked verbatim from imp-95947, no re-import to stay import-light)
 *   -----------------------------------------------------------------------------
 *   Two targets, both evaluated from the Riemann-von-Mangoldt smooth counting function
 *   N_smooth(T) = (T/2pi)(ln(T/2pi) - 1) + 7/8 forward at the crossover:
 *     - REACH:    N_reach  ~ 3.269e9 ordinates (table top exactly at T0).
 *     - WINDOWED: N_window ~ 4.311e9 ordinates (table top at 1.30*T0, to center a +/-30%
 *       tiled sd(C - E) window at the crossover).
 *   Both are a ~3.5..3.6-order-of-magnitude shortfall (factor ~3269x..4311x) from the in-repo
 *   N = 1e6 ordinate ceiling (gamma_1e6 = 6.003e5, the sole in-repo ordinate table per imp-95801)
 *   -- ~26 GB..35 GB of double-precision ordinates, ~1600x..2000x the 16.7 MB in-repo zeros
 *   bundle. The zeros DO exist externally (Gourdon 2004 verified ~1e13 zeros to height ~2.4e12,
 *   far above the crossover), so the crossover is reachable IN PRINCIPLE by an external
 *   Odlyzko/Gourdon-scale dataset, but not by the repo or any cheap near-term extension of it.
 *
 *   WHAT THIS IS AND IS NOT
 *   ------------------------
 *   A glossary-style lookup restating the imp-95947 reach estimate for quick reference. It
 *   establishes nothing, instantiates no interval, closes no sub-gap, moves no bound. Consistent
 *   with imp-95863: the only in-repo lever above gamma_1e6 is the imp-95722 analytic r_cap
 *   envelope, not a bigger ordinate table. imp-2519 no-overclaim guard preserved; NO QED.
 *   No refereed bound is changed.
 *
 * @see imp-95947-crossover-ordinate-count-reach-assessment (source reach/windowed estimate)
 * @see imp-95750-number-variance-deadzone-measurement-reach (F2 dead-zone: ~2.4% reached, ~3.36-decade gap)
 * @see imp-95863-intermediate-ordinate-table-reach-ledger (complementary ledger to the 3e12 window bottom)
 * @see imp-95722 (analytic r_cap envelope, the only in-repo high-T lever above gamma_1e6)
 *
 * Ticket: imp-95990 (content, small). Documentation only; establishes nothing; NO QED;
 * no refereed bound is changed.
 */

// The crossover ordinate-count reach headword, baked verbatim (no re-import).
const CROSSOVER_ORDINATE_COUNT_REACH_HEADWORD = Object.freeze({
  key: 'crossover-ordinate-count-reach',
  term: 'Crossover ordinate-count reach (imp-95947)',
  definition:
    'The verified-ordinate-table size N a direct WINDOWED sd(C - E) number-variance ' +
    'measurement needs to reach the imp-95729 crossover T0 ~ 1.14e9: N_reach ~ 3.269e9 ' +
    '(table top exactly at T0) and N_window ~ 4.311e9 (table top at 1.30*T0, centering a ' +
    '+/-30% tiled window at the crossover).',
  shortfall:
    'Both targets are a ~3.5..3.6-order-of-magnitude shortfall (factor ~3269x..4311x) from ' +
    'the in-repo N = 1e6 ordinate ceiling (gamma_1e6 = 6.003e5, imp-95801) -- roughly 26 ' +
    'GB..35 GB of double-precision ordinates, ~1600x..2000x the 16.7 MB in-repo zeros bundle.',
  reachability:
    'The zeros exist externally (Gourdon 2004 verified ~1e13 zeros to height ~2.4e12, far ' +
    'above the crossover), so the crossover is reachable IN PRINCIPLE by an external ' +
    'Odlyzko/Gourdon-scale table but not by the repo. The only in-repo lever above gamma_1e6 ' +
    'is the imp-95722 analytic r_cap envelope, not a bigger ordinate table (imp-95863).',
});

export const IMP95990_CROSSOVER_ORDINATE_COUNT_REACH_GLOSSARY_HEADWORD = Object.freeze({
  id: 'imp-95990',
  proofSection: 'S-frontier',
  glosses: 'imp-95947',
  question:
    'How large a verified-ordinate table would a direct windowed sd(C - E) measurement need ' +
    'to reach the imp-95729 crossover T0 ~ 1.14e9, and how far short of that is the in-repo ' +
    'N = 1e6 ceiling?',
  headword: CROSSOVER_ORDINATE_COUNT_REACH_HEADWORD,
  anyBoundMoved: false,
  verdict:
    'GLOSSARY HEADWORD ONLY (documentation, not a proof). imp-95947 estimated N_reach ~ 3.269e9 ' +
    'and N_window ~ 4.311e9 verified ordinates to reach/center-window the crossover T0 ~ 1.14e9, ' +
    'a ~3.6-order-of-magnitude (factor ~4300) shortfall from the in-repo N = 1e6 ceiling ' +
    '(gamma_1e6 = 6.003e5) -- ~26..35 GB, reachable only by an external Odlyzko/Gourdon-scale ' +
    'table, never the 16.7 MB in-repo bundle. The analytic r_cap envelope (imp-95722) remains ' +
    'the only in-repo lever above gamma_1e6. Establishes nothing; instantiates no interval; ' +
    'moves no bound; NO QED. No refereed bound is changed.',
  citation:
    'imp-95947 (crossover ordinate-count reach estimate); imp-95750 (dead-zone ~2.4% reached, ' +
    '~3.36-decade gap); imp-95863 (complementary ordinate-table reach ledger); imp-95801 (in-repo ' +
    'ordinate ceiling gamma_1e6 = 6.003e5); imp-95722 (analytic r_cap envelope).',
});

export default IMP95990_CROSSOVER_ORDINATE_COUNT_REACH_GLOSSARY_HEADWORD;

// -- Tripwire assertions ------------------------------------------------------
export const IMP95990_CROSSOVER_ORDINATE_COUNT_REACH_GLOSSARY_HEADWORD_ASSERTIONS = [
  {
    id: 'imp95990-headword-names-both-targets',
    why: 'The headword must record both the reach and windowed ordinate-count targets and the ' +
      'shortfall from the in-repo N=1e6 ceiling -- the entire point of the lookup entry.',
    holds: () => {
      const h = IMP95990_CROSSOVER_ORDINATE_COUNT_REACH_GLOSSARY_HEADWORD.headword;
      return (
        /3\.269e9/.test(h.definition) &&
        /4\.311e9/.test(h.definition) &&
        /1\.14e9/.test(h.definition) &&
        /3\.5\.\.3\.6-order-of-magnitude/.test(h.shortfall) &&
        /6\.003e5/.test(h.shortfall) &&
        /r_cap envelope/.test(h.reachability)
      );
    },
  },
  {
    id: 'imp95990-honesty-gate-no-qed',
    why: 'Documentation only: no bound claimed moved, no QED, no-refereed-bound-change line present, source ' +
      'ticket id recorded.',
    holds: () =>
      IMP95990_CROSSOVER_ORDINATE_COUNT_REACH_GLOSSARY_HEADWORD.anyBoundMoved === false &&
      /NO QED/.test(IMP95990_CROSSOVER_ORDINATE_COUNT_REACH_GLOSSARY_HEADWORD.verdict) &&
      /refereed bound is changed/i.test(IMP95990_CROSSOVER_ORDINATE_COUNT_REACH_GLOSSARY_HEADWORD.verdict) &&
      /imp-95947/.test(IMP95990_CROSSOVER_ORDINATE_COUNT_REACH_GLOSSARY_HEADWORD.glosses),
  },
];

for (const assertion of IMP95990_CROSSOVER_ORDINATE_COUNT_REACH_GLOSSARY_HEADWORD_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(
      `imp-95990-crossover-ordinate-count-reach-glossary-headword assertion failed: ${assertion.id}`,
    );
  }
}
