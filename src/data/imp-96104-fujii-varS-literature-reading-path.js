/**
 * @module imp-96104-fujii-varS-literature-reading-path
 * @fileoverview imp-96104 -- import-light Concepts/Wiki reading-path note tying the imp-95984
 *   Chan / Goldston 1987 / Montgomery Var S(T) literature-locate to the imp-95964/imp-95940
 *   crossing-height obstruction. imp-95984 has no reader-facing note naming its sources and
 *   its place in the K -> a_0 -> crossing-height chain; this bakes that chain VERBATIM (no
 *   re-import) as a standalone lookup entry, matching the imp-95974 glossary-headword pattern.
 *
 *   THE READING PATH
 *   -----------------------------------------------
 *   1. b = I_F + M + P2 (imp-95984). Chan (arXiv:math/0305339, Thm 1.1), refining Goldston
 *      1987 (JNT 27, 149-177) via Montgomery pair correlation, gives under RH
 *        INT_0^T |S(t)|^2 dt = (T/2pi^2)[loglog T + b] + O(T/log^2 T),
 *        b = I_F + gamma - sum_{m>=2} sum_p (1/m - 1/m^2)/p^m,
 *      where I_F = INT_1^inf F(alpha,T)/alpha^2 d(alpha) is the Montgomery pair-correlation
 *      integral. The Mertens identity gamma - P_Chan = M + P2 reconciles this with imp-95964's
 *      b = M + P2 + K, forcing K = I_F EXACTLY: the imp-95964 boundary constant is not a vague
 *      cutoff residue, it is the published pair-correlation integral.
 *   2. K = I_F -> a_0 non-pinnability (imp-95964). I_F is rigorously bracketed only in
 *      (2/3-eps, 2) under RH -- a spread of 4/3, ~133x the O(0.01) tolerance the crossing-height
 *      range needs -- and equals 1 only under Montgomery pair correlation (conjectural, PCC /
 *      quantitative twin prime), giving the conjectural a_0 = b - gamma - 1 = -P_Chan =
 *      -0.176248 vs the noisy six-height empirical mean ~-0.116.
 *   3. -> crossing-height range (imp-95940). Because the crossing height is double-exponential
 *      in a_0 (d ln T_x/d a_0 ~ -78), the un-pinned rigorous spread in I_F leaves the imp-95940
 *      crossing range [~5.8e17, ~1.36e28] uncollapsed.
 *
 *   WHAT THIS IS AND IS NOT
 *   ------------------------
 *   A reading-path lookup restating the imp-95984 literature-locate and its place in the
 *   K -> a_0 -> crossing-height chain for a reader landing cold. Establishes nothing new,
 *   instantiates no interval, closes no sub-gap, moves no bound. Functional non-marketing
 *   copy; I_F is cited as conjectural (RH-bracketed only), not pinned. imp-2519 no-overclaim
 *   guard preserved; NO QED. No refereed bound is changed.
 *
 * @see imp-95984-fujii-varS-constant-literature-locate (source: literature-locate, K = I_F identity)
 * @see imp-95964-fujii-varS-constant-locate-obstruction (b = M + P2 + K; named the K sub-gap)
 * @see imp-95940-arithmetic-intercept-a0-obstruction (a_0 = b - gamma - 1; double-exp crossing)
 * @see imp-95974-a0-fujii-varS-intercept-glossary-headword (sibling headword, a_0 = b - gamma - 1)
 *
 * Ticket: imp-96017 (content, low). Documentation only; establishes nothing; NO QED;
 * no refereed bound is changed.
 */

// The K -> a_0 -> crossing-height reading path, baked verbatim (no re-import of imp-95984).
const FUJII_VARS_LITERATURE_READING_PATH = Object.freeze({
  key: 'fujii-varS-literature-reading-path',
  term:
    'b = I_F + M + P2 (imp-95984 literature-locate) -> K = I_F non-pinnability (imp-95964) -> ' +
    'crossing-height range (imp-95940)',
  sources:
    'T.H. Chan, "On the second moment of S(T) in the theory of the Riemann zeta function" ' +
    '(arXiv:math/0305339), Theorem 1.1, refining Goldston 1987 (J. Number Theory 27, 149-177) ' +
    'via Montgomery pair correlation.',
  definition:
    'Chan Thm 1.1 gives, under RH, INT_0^T |S(t)|^2 dt = (T/2pi^2)[loglog T + b] + O(T/log^2 T), ' +
    'with b = I_F + gamma - sum_{m>=2} sum_p (1/m - 1/m^2)/p^m and I_F the Montgomery pair-' +
    'correlation integral INT_1^inf F(alpha,T)/alpha^2 d(alpha). The Mertens identity ' +
    'gamma - P_Chan = M + P2 reconciles this with imp-95964 b = M + P2 + K, forcing K = I_F ' +
    'exactly: the imp-95964 boundary constant K IS the published pair-correlation integral.',
  chain:
    'Step 1 (imp-95984): b = I_F + M + P2, arithmetic core M + P2 = 0.400967849 pinned to ' +
    'O(1e-12), K = I_F identified. Step 2 (imp-95964): I_F is rigorously bracketed only in ' +
    '(2/3-eps, 2) under RH, ~133x the O(0.01) tolerance, so a_0 = b - gamma - 1 is not pinned ' +
    '(conjectural a_0 = -P_Chan = -0.176248 under Montgomery PCC vs empirical mean ~-0.116). ' +
    'Step 3 (imp-95940): the crossing height is double-exponential in a_0 (d ln T_x/d a_0 ~ -78), ' +
    'so the un-pinned I_F leaves the crossing range [~5.8e17, ~1.36e28] uncollapsed.',
  consequence:
    'The unpinned term blocking the imp-95940 crossing-height collapse has a name and a source: ' +
    'it is the Montgomery pair-correlation integral I_F, rigorously bracketed but not rigorously ' +
    'pinned, not an arbitrary numerical residue.',
});

export const IMP96104_FUJII_VARS_LITERATURE_READING_PATH = Object.freeze({
  id: 'imp-96104',
  proofSection: 'S-frontier',
  glosses: 'imp-95984',
  question:
    'imp-95984 located the Chan / Goldston 1987 / Montgomery literature for the Var S(T) ' +
    'constant b and named K = I_F. Where does that sit in the imp-95940/imp-95964 crossing-' +
    'height chain, for a reader landing on the thread cold?',
  headword: FUJII_VARS_LITERATURE_READING_PATH,
  anyBoundMoved: false,
  verdict:
    'READING-PATH NOTE ONLY (documentation, not a proof). b = I_F + gamma - P_Chan = I_F + M + P2 ' +
    '(Chan arXiv:math/0305339 Thm 1.1, refining Goldston 1987 via Montgomery pair correlation); ' +
    'the Mertens identity gamma - P_Chan = M + P2 identifies the imp-95964 boundary constant K ' +
    'exactly as the pair-correlation integral I_F, rigorously bracketed only in (2/3-eps, 2) ' +
    'under RH (~133x the O(0.01) tolerance the crossing-height collapse needs). Because the ' +
    'crossing height is double-exponential in a_0, this leaves the imp-95940 crossing range ' +
    '[~5.8e17, ~1.36e28] uncollapsed. Establishes nothing; instantiates no interval; moves no ' +
    'bound; NO QED. No refereed bound is changed.',
  citation:
    'imp-95984 (literature-locate; b = I_F + M + P2; K = I_F identity); imp-95964 (b = M + P2 + K; ' +
    'named the K sub-gap); imp-95940 (a_0 = b - gamma - 1; double-exp crossing); Chan ' +
    '(arXiv:math/0305339, Thm 1.1); Goldston 1987 (JNT 27, 149-177); Montgomery pair correlation.',
});

export default IMP96104_FUJII_VARS_LITERATURE_READING_PATH;

// -- Tripwire assertions ------------------------------------------------------
export const IMP96104_FUJII_VARS_LITERATURE_READING_PATH_ASSERTIONS = [
  {
    id: 'imp96104-reading-path-names-sources-and-chain',
    why: 'The reading-path note must name the Chan/Goldston/Montgomery sources, state ' +
      'b = I_F + M + P2, and link K = I_F (imp-95984) -> a_0 non-pinnability (imp-95964) -> ' +
      'crossing-height range (imp-95940).',
    holds: () => {
      const h = IMP96104_FUJII_VARS_LITERATURE_READING_PATH.headword;
      return (
        /Chan/.test(h.sources) &&
        /Goldston 1987/.test(h.sources) &&
        /Montgomery/.test(h.sources) &&
        /b = I_F \+ M \+ P2/.test(h.chain) &&
        /K = I_F/.test(h.definition) &&
        /imp-95984/.test(h.chain) &&
        /imp-95964/.test(h.chain) &&
        /imp-95940/.test(h.chain)
      );
    },
  },
  {
    id: 'imp96104-honesty-gate-no-qed',
    why: 'Documentation only: no bound claimed moved, no QED, no-refereed-bound-change line present, source ' +
      'ticket id recorded.',
    holds: () =>
      IMP96104_FUJII_VARS_LITERATURE_READING_PATH.anyBoundMoved === false &&
      /NO QED/.test(IMP96104_FUJII_VARS_LITERATURE_READING_PATH.verdict) &&
      /refereed bound is changed/i.test(IMP96104_FUJII_VARS_LITERATURE_READING_PATH.verdict) &&
      /imp-95984/.test(IMP96104_FUJII_VARS_LITERATURE_READING_PATH.glosses),
  },
];

for (const assertion of IMP96104_FUJII_VARS_LITERATURE_READING_PATH_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(
      `imp-96104-fujii-varS-literature-reading-path assertion failed: ${assertion.id}`,
    );
  }
}
