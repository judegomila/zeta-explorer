/**
 * @module imp-95740-block-toeplitz-szego-infimum-glossary-headword
 * @fileoverview imp-95740 -- import-light glossary/Concepts headword for the imp-95707
 *   block-Toeplitz Szego infimum: the infinite-lattice limit of the interior rho > 1
 *   twin-pair block floor, and the strictly-positive, monotone-decaying finite-size bias
 *   of the baked imp-95693 80-point proxy table against that limit.
 *
 *   WHY A GLOSSARY HEADWORD (not a re-derivation)
 *   -----------------------------------------------
 *   imp-95707 derived the block-Toeplitz Szego infimum -- the true infinite-lattice
 *   value the finite-80 twin-pair table only approximates -- and measured how far the
 *   baked table sits from it. A reader landing on that module cold has no quick-lookup
 *   definition of what "the block-Toeplitz symbol", "essential infimum via Szego", and
 *   "finite-size bias" name. This headword bakes those facts VERBATIM (no re-import of
 *   the imp-95707 module, to stay import-light) as a standalone lookup entry.
 *
 *   THE HEADWORD
 *   -----------------------------------------------
 *   The 2-periodic twin-pair lattice (period L = delta + D, motif {0, delta}) makes the
 *   seam Gram a 2x2-BLOCK Toeplitz matrix with Hermitian symbol f_rho(theta) having equal
 *   diagonals d(theta) and off-diagonal off(theta), so lambda_min(f_rho(theta)) =
 *   d(theta) - |off(theta)|. Block-Toeplitz Szego / finite-section theory gives
 *   lambda_min(finite section) -> ess inf_theta lambda_min(f_rho(theta)) as the number of
 *   pairs -> infinity: that essential infimum IS the block-Toeplitz Szego infimum, the
 *   infinite-lattice block floor. Computed cancellation-free via the Poisson dual of d
 *   and off, the infimum is attained at theta = 0 across the whole imp-95693 rho grid.
 *   The finite-80 proxy F OVERESTIMATES this infimum at every interior rho -- a strictly
 *   POSITIVE finite-size bias that decays MONOTONICALLY from +5.65pct at rho = 1 to
 *   +0.017pct by rho = 20 and negligibly beyond.
 *
 *   WHAT THIS IS AND IS NOT
 *   ------------------------
 *   A glossary-style lookup restating the imp-95707 infinite-lattice-limit derivation and
 *   the bias figures for quick reference. It establishes nothing, instantiates no
 *   interval, closes no sub-gap, moves no bound. imp-2519 no-overclaim guard preserved;
 *   NO QED. No refereed bound is changed.
 *
 * @see imp-95707-twin-pair-block-toeplitz-interior-limit (source: the infinite-lattice limit and bias this glosses)
 * @see imp-95693-twin-pair-block-floor-second-delta (the finite-80 proxy table this quantifies)
 * @see imp-95689-rho1-szego-dual-convergence-rate (the rho = 1 endpoint exact limit)
 *
 * Ticket: imp-95740 (content, low). Documentation only; establishes nothing; NO QED;
 * no refereed bound is changed.
 */

// The block-Toeplitz Szego infimum headword, baked verbatim (no re-import).
const BLOCK_TOEPLITZ_SZEGO_INFIMUM_HEADWORD = Object.freeze({
  key: 'twin-pair-block-toeplitz-szego-infimum',
  term: 'block-Toeplitz Szego infimum (twin-pair block-floor infinite-lattice limit)',
  definition:
    'The infinite-lattice limit of the interior rho > 1 twin-pair block floor: the ' +
    '2-periodic seam Gram is a 2x2-block Toeplitz matrix with Hermitian symbol ' +
    'f_rho(theta) (equal diagonals d(theta), off-diagonal off(theta)), so ' +
    'lambda_min(f_rho(theta)) = d(theta) - |off(theta)|. Block-Toeplitz Szego / ' +
    'finite-section theory gives lambda_min(finite section) -> ess inf_theta ' +
    'lambda_min(f_rho(theta)) as the pair count grows -- that essential infimum is the ' +
    'block-Toeplitz Szego infimum (imp-95707).',
  cancellationFreeEvaluation:
    'The primal cosine series for d and off suffers ~15-digit cancellation near the ' +
    'rho = 1 end; the Poisson dual (sums of tiny positive terms times a bounded phase) ' +
    'evaluates the symbol cancellation-free. The infimum is attained at theta = 0 across ' +
    'the whole imp-95693 rho grid, exact to full double precision.',
  finiteSizeBias:
    'The baked finite-80 proxy table (imp-95693) OVERESTIMATES the block-Toeplitz Szego ' +
    'infimum at every interior rho -- a strictly POSITIVE finite-size bias that decays ' +
    'MONOTONICALLY from +5.65pct at rho = 1 (matching the imp-95689 finite-size Szego ' +
    'factor 1.0565 at delta = ln 1.5) to +0.017pct by rho = 20 and negligibly beyond -- ' +
    'so the rho-sweep table is a uniform shrinking over-estimate, not a source of ' +
    'qualitative error.',
  rho1Endpoint:
    'The rho = 1 infinite-lattice limit equals the scalar class floor A_opt(ln 1.5) = ' +
    '1.663158e-9 to full double precision, so the imp-95642 left endpoint is the ' +
    'infinite-lattice value, not merely a finite-size coincidence (consistent with ' +
    'imp-95689).',
});

export const IMP95740_BLOCK_TOEPLITZ_SZEGO_INFIMUM_GLOSSARY_HEADWORD = Object.freeze({
  id: 'imp-95740',
  proofSection: 'S-frontier',
  glosses: 'imp-95707',
  scopes: 'imp-95693',
  question:
    'imp-95707 derived the infinite-lattice infimum of the interior rho > 1 twin-pair ' +
    'block floor via block-Toeplitz Szego theory and measured the finite-size bias of ' +
    'the baked imp-95693 80-point table against it. What is the block-Toeplitz Szego ' +
    'infimum, how is it computed cancellation-free, and how large/monotone is the bias, ' +
    'for a reader landing on that module cold?',
  headword: BLOCK_TOEPLITZ_SZEGO_INFIMUM_HEADWORD,
  anyBoundMoved: false,
  verdict:
    'GLOSSARY HEADWORD ONLY (documentation, not a proof). Restates the imp-95707 ' +
    'infinite-lattice-limit derivation: the twin-pair block symbol lambda_min(f_rho) = ' +
    'd(theta) - |off(theta)| has essential infimum at theta = 0, computed ' +
    'cancellation-free via the Poisson dual, and the finite-80 proxy table overestimates ' +
    'that infimum by a strictly positive bias decaying monotonically from +5.65pct ' +
    '(rho = 1) to +0.017pct (rho = 20). Establishes nothing; instantiates no interval; ' +
    'moves no bound; NO QED. No refereed bound is changed.',
  citation:
    'imp-95707 (block-Toeplitz Szego infimum derivation and bias measurement); ' +
    'imp-95693 (finite-80 proxy table this quantifies); imp-95689 (rho = 1 exact limit); ' +
    'imp-95419 (A_opt scalar class floor).',
});

export default IMP95740_BLOCK_TOEPLITZ_SZEGO_INFIMUM_GLOSSARY_HEADWORD;

// -- Tripwire assertions ------------------------------------------------------
export const IMP95740_BLOCK_TOEPLITZ_SZEGO_INFIMUM_GLOSSARY_HEADWORD_ASSERTIONS = [
  {
    id: 'imp95740-headword-has-required-fields',
    why: 'The headword must name the block-Toeplitz symbol, the essential-infimum mechanism, and the strictly-positive monotone finite-size bias -- the entire point of the glossary entry.',
    holds: () => {
      const h = IMP95740_BLOCK_TOEPLITZ_SZEGO_INFIMUM_GLOSSARY_HEADWORD.headword;
      return (
        /block-Toeplitz/i.test(h.definition) &&
        /ess inf/i.test(h.definition) &&
        /cancellation-free/i.test(h.cancellationFreeEvaluation) &&
        /5\.65pct/.test(h.finiteSizeBias) &&
        /0\.017pct/.test(h.finiteSizeBias)
      );
    },
  },
  {
    id: 'imp95740-honesty-gate-no-qed',
    why: 'Documentation only: no bound claimed moved, no QED, no-refereed-bound-change line present.',
    holds: () =>
      IMP95740_BLOCK_TOEPLITZ_SZEGO_INFIMUM_GLOSSARY_HEADWORD.anyBoundMoved === false &&
      /NO QED/.test(IMP95740_BLOCK_TOEPLITZ_SZEGO_INFIMUM_GLOSSARY_HEADWORD.verdict) &&
      /refereed bound is changed/i.test(IMP95740_BLOCK_TOEPLITZ_SZEGO_INFIMUM_GLOSSARY_HEADWORD.verdict) &&
      IMP95740_BLOCK_TOEPLITZ_SZEGO_INFIMUM_GLOSSARY_HEADWORD.glosses === 'imp-95707' &&
      IMP95740_BLOCK_TOEPLITZ_SZEGO_INFIMUM_GLOSSARY_HEADWORD.scopes === 'imp-95693',
  },
];

for (const assertion of IMP95740_BLOCK_TOEPLITZ_SZEGO_INFIMUM_GLOSSARY_HEADWORD_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(
      `imp-95740-block-toeplitz-szego-infimum-glossary-headword assertion failed: ${assertion.id}`,
    );
  }
}
