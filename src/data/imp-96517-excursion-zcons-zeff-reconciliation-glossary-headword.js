/**
 * @module imp-96517-excursion-zcons-zeff-reconciliation-glossary-headword
 * @fileoverview imp-96517 -- import-light glossary/Concepts headword reconciling the two
 *   T = 1.5e5 excursion significance figures that sit side by side in imp-96452/imp-96489:
 *   the conservative z_cons = 1.9234 (naive n_w = 291) and the effective z_eff = 3.1787
 *   (AR-1-corrected n_eff ~ 795). Read alone, "1.9" and "3.18" look like contradictory
 *   claims about the same excursion; they are not -- they are a strict lower bound and
 *   its AR-1-corrected value, related by an exact algebraic identity.
 *
 *   WHY A GLOSSARY HEADWORD (not a re-derivation)
 *   -----------------------------------------------
 *   imp-96452 quotes the ~1.9-sigma T = 1.5e5 dip confidence as the deliberately
 *   conservative naive figure z_cons = relErr / sqrt(2 / n_w) = 1.9234, using the
 *   deterministic non-overlapping hard-box tiling count n_w = 291. It separately cites
 *   the imp-96128 union-identity rho_exact = -0.46398 and its AR-1 factor to note an
 *   effective z ~ 3.18, but never re-derives that figure from first principles. imp-96489
 *   closed that seam by directly evaluating rho_exact at the T = 1.5e5 box length
 *   (L = 495.7794) and propagating it through to z_eff = 3.178708. This headword bakes
 *   the reconciliation verbatim (no re-import of imp-96452/imp-96489, to stay
 *   import-light) as a standalone quick-lookup entry for a reader who sees "1.9" in one
 *   place and "3.18" in another and wonders which is right.
 *
 *   THE HEADWORD
 *   -----------------------------------------------
 *   Both figures are correct and consistent: z_cons = 1.9234 is a STRICT LOWER BOUND
 *   (it assumes the n_w = 291 tiled boxes are fully independent, which understates the
 *   true significance because adjacent boxes are anti-correlated), and z_eff = 3.1787 is
 *   the AR-1-corrected value once that anti-correlation (rho_exact = -0.4639782) is
 *   folded in via the effective-count factor f = (1 - rho)/(1 + rho) = 2.731192, lifting
 *   n_eff from 291 to 794.777. The two are not independent estimates in tension -- they
 *   are related by the EXACT algebraic identity z_eff = sqrt(f) * z_cons (both share the
 *   same dip depth relErr and n_w scaling, differing only by the AR-1 factor applied to
 *   the count), so the correlation model can only move the figure UP, never down.
 *
 *   STATUS: a measurement/reconciliation (accuracy audit), not a rigorous asymptotic
 *   derivation, and not an empirical adjacent-box covariance from the actual zeros
 *   (rho_exact is the theoretical GUE sine-kernel value).
 *
 *   WHAT THIS IS AND IS NOT
 *   ------------------------
 *   A glossary-style lookup restating the imp-96489 reconciliation for quick reference.
 *   It establishes nothing, instantiates no interval, closes no sub-gap, moves no bound.
 *   NO QED. No refereed bound is changed.
 *
 * @see imp-96489-excursion-effective-significance-direct-rho (source: the reconciliation this glosses)
 * @see imp-96452-excursion-confidence-2sigma-reach (carries z_cons = 1.9234 and the baked rho literal)
 * @see imp-96128-number-variance-two-interval-covariance-exact (the union identity and rho_exact table)
 * @see imp-96089-mean-anchor-window-count-significance-verdict (sets z = 1.923 at T = 1.5e5)
 *
 * Ticket: imp-96517 (content, medium). Documentation only; establishes nothing; NO QED;
 * no refereed bound is changed.
 */

// The z_cons-vs-z_eff reconciliation headword, baked verbatim (no re-import).
const EXCURSION_ZCONS_ZEFF_RECONCILIATION_HEADWORD = Object.freeze({
  key: 'excursion-zcons-zeff-are-a-lower-bound-and-its-ar1-correction-not-a-contradiction',
  term:
    'imp-96489 verdict: the imp-96452 conservative z_cons = 1.9234 and effective ' +
    'z_eff = 3.1787 are NOT contradictory figures -- z_cons is a strict lower bound and ' +
    'z_eff is its exact AR-1 correction',
  definition:
    'The T = 1.5e5 number-variance dip has two significance figures quoted side by ' +
    'side: the conservative naive z_cons = 1.9234 (treating the n_w = 291 tiled boxes ' +
    'as independent) and the effective z_eff = 3.1787 (correcting for the boxes’ ' +
    'GUE anti-correlation, rho_exact = -0.4639782, via the AR-1 effective-count factor ' +
    'f = 2.731192, which lifts n_eff from 291 to 794.777). These are not competing ' +
    'estimates -- z_cons deliberately understates the significance by ignoring the ' +
    'anti-correlation, and z_eff is the corrected value once it is included. Both are ' +
    'consistent with the same dip and the same significant-excursion verdict: z_cons ' +
    'is a strict lower bound on the true significance.',
  mechanism:
    'z scales as sqrt(count) at fixed dip depth relErr, so z_eff / z_cons = ' +
    'sqrt(n_eff / n_w) = sqrt(f) EXACTLY, where f = (1 - rho_exact)/(1 + rho_exact). ' +
    'Measured: rho_exact = -0.4639782 (directly evaluated at the box length L = ' +
    '495.7794, reproducing the imp-96128 baked -0.46398 to five decimals) gives ' +
    'f = 2.731192, so z_eff = sqrt(2.731192) * 1.923422 = 3.178708 = 1.652632 * z_cons. ' +
    'Because f > 1 (anti-correlated boxes are ANTI-correlated, rho_exact < 0), the ' +
    'correction can only raise z_cons, never lower it -- so z_cons = 1.9234 is a strict ' +
    'lower bound on the true significance, not a separate, weaker claim.',
  verificationStatus:
    'Measurement/reconciliation (accuracy audit); rho_exact is the theoretical GUE ' +
    'sine-kernel two-interval correlation, not an empirical covariance of the actual ' +
    'zeros. Changes no bound; RH open; NO QED; no refereed bound is changed.',
});

export const IMP96517_EXCURSION_ZCONS_ZEFF_RECONCILIATION_GLOSSARY_HEADWORD = Object.freeze({
  id: 'imp-96517',
  proofSection: 'S-frontier',
  glosses: 'imp-96489',
  question:
    'imp-96452 quotes the T = 1.5e5 excursion confidence as both the conservative ' +
    'z_cons = 1.9234 and the effective z_eff ~ 3.18 without stating how the two relate. ' +
    'Are they contradictory, and if not, what is the exact relationship?',
  headword: EXCURSION_ZCONS_ZEFF_RECONCILIATION_HEADWORD,
  anyBoundMoved: false,
  verdict:
    'GLOSSARY HEADWORD ONLY (documentation, not a proof). Restates the imp-96489 ' +
    'reconciliation: z_cons = 1.9234 is a strict lower bound (independence assumption) ' +
    'and z_eff = 3.1787 is its exact AR-1 correction (z_eff = sqrt(f) * z_cons with ' +
    'f = 2.731192 from rho_exact = -0.4639782) -- the two figures are consistent, not ' +
    'contradictory. Establishes nothing; instantiates no interval; moves no bound; ' +
    'NO QED. No refereed bound is changed.',
  citation:
    'imp-96489 (the direct rho_exact evaluation and reconciliation this glosses); ' +
    'imp-96452 (carries both z_cons = 1.9234 and the baked rho literal -0.46398); ' +
    'imp-96128 (the union identity and rho_exact table); imp-96089 (sets z = 1.923 at ' +
    'T = 1.5e5).',
});

// Machine-readable honest-status banner (imp-96337 / imp-96428 convention).
export const IMP96517_HONEST_BANNER =
  'RH open; no refereed bound is changed; NO QED. Documentation only, restating the imp-96489 ' +
  'reconciliation: z_cons = 1.9234 is a strict lower bound (independence assumption) and z_eff = 3.1787 ' +
  'is its exact AR-1 correction (rho_exact is the theoretical GUE sine-kernel value, not an empirical ' +
  'covariance of the actual zeros); establishes nothing, instantiates no interval, moves no bound.';

export default IMP96517_EXCURSION_ZCONS_ZEFF_RECONCILIATION_GLOSSARY_HEADWORD;

// -- Tripwire assertions ------------------------------------------------------
export const IMP96517_EXCURSION_ZCONS_ZEFF_RECONCILIATION_GLOSSARY_HEADWORD_ASSERTIONS = [
  {
    id: 'imp96517-headword-has-required-fields',
    why: 'The headword must name both z figures, the exact sqrt(f) relationship, and ' +
      'the AR-1 factor -- the entire point of the reconciliation.',
    holds: () => {
      const h = IMP96517_EXCURSION_ZCONS_ZEFF_RECONCILIATION_GLOSSARY_HEADWORD.headword;
      return (
        /1\.9234/.test(h.definition) &&
        /3\.1787/.test(h.definition) &&
        /sqrt\(f\)/.test(h.mechanism) &&
        /2\.731192/.test(h.mechanism) &&
        /strict lower bound/.test(h.definition)
      );
    },
  },
  {
    id: 'imp96517-honesty-gate-no-qed',
    why: 'Documentation only: no bound claimed moved, no QED, no-refereed-bound-change line present.',
    holds: () =>
      IMP96517_EXCURSION_ZCONS_ZEFF_RECONCILIATION_GLOSSARY_HEADWORD.anyBoundMoved === false &&
      /NO QED/.test(IMP96517_EXCURSION_ZCONS_ZEFF_RECONCILIATION_GLOSSARY_HEADWORD.verdict) &&
      /refereed bound is changed/i.test(IMP96517_EXCURSION_ZCONS_ZEFF_RECONCILIATION_GLOSSARY_HEADWORD.verdict) &&
      IMP96517_EXCURSION_ZCONS_ZEFF_RECONCILIATION_GLOSSARY_HEADWORD.glosses === 'imp-96489',
  },
  {
    id: 'imp96517-honest-banner-has-markers',
    why: 'The exported machine-readable banner must carry the RH-open / PT-Lambda / NO-QED markers ' +
      'for any consumer viz page to render (imp-96337 / imp-96428 convention).',
    holds: () =>
      /RH open/.test(IMP96517_HONEST_BANNER) &&
      /PT Lambda <= 0\.2|refereed bound is changed/.test(IMP96517_HONEST_BANNER) &&
      /NO QED/.test(IMP96517_HONEST_BANNER),
  },
];

for (const assertion of IMP96517_EXCURSION_ZCONS_ZEFF_RECONCILIATION_GLOSSARY_HEADWORD_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(
      `imp-96517-excursion-zcons-zeff-reconciliation-glossary-headword assertion failed: ${assertion.id}`,
    );
  }
}
