/**
 * @module imp-96599-basis-c-superlinear-floor-glossary-headword
 * @fileoverview imp-96599 -- import-light glossary/Concepts headword for the imp-96568
 *   result: the basis-C direct-integral floor(L) grows SUPER-linearly above the PT
 *   anchor (measured exponent p ~ 1.81, not the L-linear exponent 1 the imp-96531
 *   re-anchoring assumed), which tightens the imp-96531 projected corroboration reach
 *   L* ~ 2.86e9 down to L* ~ 1.90e8 -- ~15x tighter, only ~1.5 decades past the PT
 *   anchor instead of ~2.7.
 *
 *   WHY A GLOSSARY HEADWORD (not a re-derivation)
 *   -----------------------------------------------
 *   imp-96568 directly measured the basis-C floor at intermediate L rungs (1e3, 1e5,
 *   1e6, anchor, 1e7), found the optimum panels-per-period collapses monotonically
 *   (256 -> 48 -> pinned at 3), and used the two ppp-pinned truncation-regime rungs to
 *   fit the above-anchor growth law. The module has no standalone quick-lookup entry
 *   stating the headline numbers for a reader who only wants "how much does this
 *   tighten the reach": p ~ 1.81, L* ~ 1.9e8, ~15x tighter, ~1.5 decades past anchor.
 *   This headword bakes that verbatim (no re-import of the imp-96568/96531/96448/96430
 *   modules, to stay import-light) as a standalone lookup entry.
 *
 *   THE HEADWORD
 *   -----------------------------------------------
 *   The basis-C best-achievable floor(L) is set by two different mechanisms depending
 *   on L: cancellation-set at small L (optimum ppp = 256 at L = 1e3), Simpson-
 *   truncation-set at and above the PT anchor L = 5.9e6 (optimum ppp pinned at 3). Using
 *   the two ppp-pinned truncation-regime rungs (anchor: floor 2.8414e-5; L = 1e7: floor
 *   7.3978e-5), the above-anchor floor-growth exponent measures p ~ 1.81 -- well above
 *   the exponent 1 the imp-96531 L-linear re-anchoring assumed. Re-bisecting the
 *   corroboration-reach crossover (floor(L) = signal(L) = |rho - (-1/2)|) with this
 *   measured power law tightens L* from ~2.86e9 (~2.7 decades past the anchor, p = 1)
 *   to ~1.90e8 (~1.5 decades past the anchor, p ~ 1.81) -- about 15x tighter.
 *   Basis C still independently corroborates basis A across the accessible-to-anchor
 *   range and ~1.5 decades past it, just far less than the imp-96531 projection.
 *   MECHANISM: the mild-L cancellation of Var = L - 2*Int (subtracting ~L from ~L)
 *   becomes severe roundoff that GROWS with panel count at and above the anchor, so
 *   raising ppp raises the error and the optimum collapses to ppp ~ 3 -- the growing
 *   Simpson-truncation error at fixed low ppp is what drives the super-linear exponent.
 *
 *   STATUS: a measurement (offline ppp sweep, re-checked live at L = 1e3) plus a
 *   two-point power-law extrapolation past L = 1e7. The exponent p ~ 1.81 rests on only
 *   two ppp-pinned rungs, so L* ~ 1.9e8 remains a tightened PROJECTION, not a measured
 *   reach. rho is the theoretical GUE two-interval correlation, not computed from real
 *   zeros.
 *
 *   WHAT THIS IS AND IS NOT
 *   ------------------------
 *   A glossary-style lookup restating the imp-96568 verdict for quick reference. It
 *   establishes nothing, instantiates no interval, closes no sub-gap, moves no bound.
 *   NO QED. No refereed bound is changed.
 *
 * @see imp-96568-basis-c-intermediate-rung-floor-ladder (source: the measured floor ladder and growth law this glosses)
 * @see imp-96531-basis-c-crossover-measured-floor (the L-linear re-anchored crossover L* ~ 2.86e9 this tightens)
 * @see imp-96448-direct-basis-c-anchor-floor (the MEASURED anchor floor ~2.84e-5 and ppp = 3 collapse)
 * @see imp-96430-basis-c-corroboration-reach-crossover (the original L-linear floor MODEL)
 * @see imp-96690-basis-c-above-anchor-rung-ladder (SUPERSEDES this headword's numbers: a five-rung
 *   log-log OLS gives p ~ 2.42, not the two-rung p ~ 1.81 here, tightening L* to ~8.1e7, not ~1.9e8)
 *
 * SUPERSEDED (imp-96690, 2026-09-24): the p ~ 1.81 / L* ~ 1.9e8 numbers below rest on only the two
 * ppp-pinned rungs (anchor, 1e7) this headword names. imp-96690 measured three more above-anchor
 * rungs (2e7, 3e7, 5e7), found the optimum ppp collapses further (3 -> 2) past 1e7, and re-fit the
 * exponent via a log-log OLS over all five rungs: p ~ 2.42, tightening the projected reach to
 * L* ~ 8.1e7 (~1.14 decades past the PT anchor, ~2.35x tighter than this headword's L* ~ 1.9e8).
 * This entry is kept as the historical two-rung projection for provenance; imp-96690 is the current
 * best-available projection.
 *
 * Ticket: imp-96599 (content, low). Documentation only; establishes nothing; NO QED;
 * no refereed bound is changed.
 */

// The super-linear-floor headword, baked verbatim (no re-import).
const BASIS_C_SUPERLINEAR_FLOOR_HEADWORD = Object.freeze({
  key: 'basis-c-superlinear-floor-tightens-corroboration-reach',
  term:
    'imp-96568 verdict: the basis-C direct-integral floor(L) grows super-linearly above ' +
    'the PT anchor (exponent p ~ 1.81, not L-linear), tightening the imp-96531 projected ' +
    'corroboration reach L* ~ 2.86e9 down to ~1.9e8',
  definition:
    'The imp-96568 measured basis-C floor ladder shows the optimum panels-per-period ' +
    'collapses monotonically with L (256 at L = 1e3, 48 at 1e5, pinned at 3 at the PT ' +
    'anchor L = 5.9e6 and at 1e7). Using the two ppp-pinned truncation-regime rungs ' +
    '(anchor floor 2.8414e-5, L = 1e7 floor 7.3978e-5), the above-anchor floor-growth ' +
    'exponent measures p ~ 1.81, well above the exponent 1 the imp-96531 L-linear re-' +
    'anchoring assumed. Re-bisecting the corroboration-reach crossover with this ' +
    'measured power law tightens L* from ~2.86e9 (~2.7 decades past the anchor, at p = 1, ' +
    'reproducing imp-96531) to ~1.90e8 (~1.5 decades past the anchor, at the measured ' +
    'p ~ 1.81) -- about 15x tighter.',
  mechanism:
    'At and above the PT anchor, the mild-L cancellation in Var = L - 2*Int (subtracting ' +
    '~L from ~L) becomes severe roundoff that GROWS with panel count, so raising ppp ' +
    'raises the error; the optimum collapses to ppp ~ 3 and the floor becomes Simpson-' +
    'truncation-set at that fixed low resolution, which is what drives the super-linear ' +
    'exponent -- unlike the small-L cancellation-set regime, where high ppp still drives ' +
    'the floor down.',
  verificationStatus:
    'Measured via an offline ppp sweep (re-checked live at L = 1e3, floor ~4.84e-13). The ' +
    'above-anchor exponent p ~ 1.81 rests on only two ppp-pinned rungs (anchor, 1e7), so ' +
    'L* ~ 1.9e8 remains a tightened PROJECTION past 1e7, not a measured reach. rho is the ' +
    'theoretical GUE (sine-kernel) two-interval correlation, not computed from real ' +
    'zeros. Changes no bound; no refereed bound is changed; RH open; NO QED.',
});

export const IMP96599_BASIS_C_SUPERLINEAR_FLOOR_GLOSSARY_HEADWORD = Object.freeze({
  id: 'imp-96599',
  proofSection: 'S-frontier',
  glosses: 'imp-96568',
  question:
    'imp-96531 tightened the basis-C corroboration-reach crossover to L* ~ 2.86e9 by re-' +
    'anchoring an assumed L-linear floor. imp-96568 measured the floor at intermediate ' +
    'rungs instead -- does the floor actually grow linearly, and how much does the ' +
    'measured growth law move the reach?',
  headword: BASIS_C_SUPERLINEAR_FLOOR_HEADWORD,
  anyBoundMoved: false,
  verdict:
    'GLOSSARY HEADWORD ONLY (documentation, not a proof). Restates the imp-96568 verdict: ' +
    'the basis-C floor(L) grows super-linearly above the PT anchor (measured exponent ' +
    'p ~ 1.81, not the L-linear exponent 1 imp-96531 assumed), which tightens the ' +
    'projected corroboration reach from L* ~ 2.86e9 (~2.7 decades past the anchor) to ' +
    'L* ~ 1.90e8 (~1.5 decades past the anchor) -- ~15x tighter. Still a two-point ' +
    'extrapolation past L = 1e7, not a measured reach; theoretical GUE quantity, not real ' +
    'zeros. Establishes nothing; instantiates no interval; moves no bound; NO QED. ' +
    'No refereed bound is changed.',
  citation:
    'imp-96568 (the measured floor ladder and above-anchor growth law this glosses); ' +
    'imp-96531 (the L-linear re-anchored crossover L* ~ 2.86e9 this tightens); imp-96448 ' +
    '(the measured anchor floor and ppp = 3 collapse); imp-96430 (the original L-linear ' +
    'floor model); imp-96690 (SUPERSEDES the p ~ 1.81 / L* ~ 1.9e8 numbers here with a five-' +
    'rung log-log OLS: p ~ 2.42, L* ~ 8.1e7).',
  supersededBy: {
    ticket: 'imp-96690',
    reason:
      'Five-rung log-log OLS above-anchor exponent (p ~ 2.42) replaces the two-rung exponent ' +
      '(p ~ 1.81) this headword names; tightened reach L* ~ 8.1e7 replaces L* ~ 1.9e8.',
    exponent: 2.42,
    crossoverL: 8.1e7,
  },
});

export default IMP96599_BASIS_C_SUPERLINEAR_FLOOR_GLOSSARY_HEADWORD;

// -- Tripwire assertions ------------------------------------------------------
export const IMP96599_BASIS_C_SUPERLINEAR_FLOOR_GLOSSARY_HEADWORD_ASSERTIONS = [
  {
    id: 'imp96599-headword-has-required-fields',
    why: 'The headword must name the measured exponent, the tightened reach, and the ' +
      'tightening factor -- the entire point of the glossary entry.',
    holds: () => {
      const h = IMP96599_BASIS_C_SUPERLINEAR_FLOOR_GLOSSARY_HEADWORD.headword;
      return (
        /1\.81/.test(h.definition) &&
        /1\.90e8|1\.9e8/.test(h.definition) &&
        /2\.86e9/.test(h.definition) &&
        /15x/.test(h.definition)
      );
    },
  },
  {
    id: 'imp96599-honesty-gate-no-qed',
    why: 'Documentation only: no bound claimed moved, no QED, no-refereed-bound-change line present.',
    holds: () =>
      IMP96599_BASIS_C_SUPERLINEAR_FLOOR_GLOSSARY_HEADWORD.anyBoundMoved === false &&
      /NO QED/.test(IMP96599_BASIS_C_SUPERLINEAR_FLOOR_GLOSSARY_HEADWORD.verdict) &&
      /refereed bound is changed/i.test(IMP96599_BASIS_C_SUPERLINEAR_FLOOR_GLOSSARY_HEADWORD.verdict) &&
      IMP96599_BASIS_C_SUPERLINEAR_FLOOR_GLOSSARY_HEADWORD.glosses === 'imp-96568',
  },
  {
    id: 'imp96599-supersededby-imp96690-recorded',
    why: 'imp-96690 measured three more above-anchor rungs and re-fit the exponent (p ~ 2.42, ' +
      'L* ~ 8.1e7), superseding this headword’s two-rung numbers (p ~ 1.81, L* ~ 1.9e8) -- ' +
      'a reader must not treat this entry as the current best-available projection.',
    holds: () => {
      const sb = IMP96599_BASIS_C_SUPERLINEAR_FLOOR_GLOSSARY_HEADWORD.supersededBy;
      return (
        sb != null &&
        sb.ticket === 'imp-96690' &&
        Math.abs(sb.exponent - 2.42) < 0.01 &&
        Math.abs(sb.crossoverL - 8.1e7) / 8.1e7 < 0.01
      );
    },
  },
];

for (const assertion of IMP96599_BASIS_C_SUPERLINEAR_FLOOR_GLOSSARY_HEADWORD_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(
      `imp-96599-basis-c-superlinear-floor-glossary-headword assertion failed: ${assertion.id}`,
    );
  }
}
