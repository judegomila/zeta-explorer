/**
 * @module imp-96639-gmin-ratio-gue-envelope-glossary-headword
 * @fileoverview imp-96639 -- import-light glossary/Concepts headword for the imp-96616
 *   finding: the extreme-gap ratio g_min(N)/y_N decays as N^{-0.395}, tracking the GUE
 *   median cube-root envelope 0.8582 N^{-1/3} to within 0.90x-2.21x, and this RELOCATES
 *   (does not remove) the pair-correlation wall -- beating the surrogate 1/log^2 fold-law
 *   envelope exponent requires exactly the unproved GUE cube-root small-gaps law.
 *
 *   WHY A GLOSSARY HEADWORD (not a re-derivation)
 *   -----------------------------------------------
 *   imp-96616 measured how fast the running-min normalized gap g_min(N)/y_N shrinks on
 *   2,001,052 Odlyzko zeros, to quantify the exponent any fold-law envelope improvement
 *   would have to supply. This headword bakes that verdict verbatim (no re-import of the
 *   imp-96616 module, to stay import-light) as a standalone quick-lookup entry: a reader
 *   must not read "measured exponent close to GUE" as a proof that the cube-root law
 *   holds, nor as removing the pair-correlation obstruction -- it only relocates where
 *   the obstruction sits (from the 1-point density surrogate to the small-gaps exponent).
 *
 *   THE HEADWORD
 *   -----------------------------------------------
 *   (a) MEASURED EXPONENT. Fitting log(g_min(N)/y_N) = a + b log(N) over the running-min
 *   ladder N = 50..1e6 gives b = -0.3953, close to and slightly steeper than the GUE
 *   (sine-kernel) extreme-gap exponent -1/3 = -0.3333.
 *   (b) TRACKS THE GUE MEDIAN ENVELOPE. The GUE level-repulsion R_2(s) ~ (pi^2/3) s^2
 *   predicts a median ratio 0.8582 N^{-1/3}; the measured ratio stays within a factor
 *   0.8966 (N=500000) to 2.2105 (N=200) of this envelope across the whole range, and
 *   1.1297x at N = 1e6.
 *   (c) RELOCATES, DOES NOT REMOVE, THE WALL. The 1-point-density surrogate rate
 *   2 pi / log^2(gamma_N/2pi) is exactly the fold law |t_c(N)| = g_min(N)^2/8 with g_min
 *   replaced by ~1.13 y_N -- so it can only ever deliver the 1/log^2 rate. Beating that
 *   surrogate exponent needs g_min(N) <= C N^{-1/3+eps} y_N for some eps > 0, i.e. exactly
 *   the (unproved unconditionally) GUE cube-root small-gaps law. The measured -0.395 is
 *   consistent with, but does not establish, that law -- it is a running-min statistic
 *   from a finite (N <= 1e6) sample, not an asymptotic theorem.
 *
 *   STATUS: a numerical measurement (quantifies the target exponent and its GUE
 *   consistency), not a proof of the small-gaps law -- the pair-correlation wall is
 *   restated in sharper (small-gaps-exponent) terms, not dissolved.
 *
 *   WHAT THIS IS AND IS NOT
 *   ------------------------
 *   A glossary-style lookup restating the imp-96616 verdict for quick reference. It
 *   establishes nothing, instantiates no interval, closes no sub-gap, moves no bound.
 *   NO QED. No refereed bound is changed.
 *
 * @see imp-96616-gmin-ratio-extreme-gap-decay.js (source: the measurement this glosses)
 * @see rh-bridge-supercritical-fluid-shock-scaling-2026-09-24 Q1 (names the fold-law lever
 *   this ratio decides: |t_c(N)| = g_min(N)^2/8 vs the 1-point-density surrogate)
 *
 * Ticket: imp-96639 (content, low, sonnet-4-6). Documentation only; establishes
 * nothing; NO QED; no refereed bound is changed.
 */

// The GUE-envelope-tracking headword, baked verbatim (no re-import).
const GMIN_RATIO_GUE_ENVELOPE_HEADWORD = Object.freeze({
  key: 'gmin-ratio-gue-envelope-relocates-pair-correlation-wall',
  term:
    'imp-96616 finding: the extreme-gap ratio g_min(N)/y_N ~ N^{-0.395} tracks the GUE ' +
    'median cube-root envelope 0.8582 N^{-1/3} to within 0.90x-2.21x, RELOCATING (not ' +
    'removing) the pair-correlation wall -- beating the 1/log^2 fold-law surrogate ' +
    'needs the unproved GUE small-gaps law',
  definition:
    'g_min(N)/y_N is the running minimum, over the first N Odlyzko zeta zeros, of the ' +
    'gap between consecutive zeros normalized by the local mean spacing ' +
    'y_N = 2 pi / log(gamma_N / 2 pi). Fitting log(g_min(N)/y_N) = a + b log(N) over ' +
    'N = 50..1e6 (running-min ladder, 2,001,052 zeros read raw) gives a measured decay ' +
    'exponent b = -0.3953, close to and slightly steeper than the GUE cube-root extreme-' +
    'gap exponent -1/3 = -0.3333 predicted by the sine-kernel level-repulsion law ' +
    'R_2(s) ~ (pi^2/3) s^2 (median g_min/y_N = (9 ln2 / (pi^2 N))^{1/3} = 0.8582 N^{-1/3}). ' +
    'The measured ratio stays within a factor 0.8966 (N=500000) to 2.2105 (N=200) of ' +
    'this GUE median envelope across the whole range, landing at 1.1297x at N = 1e6.',
  mechanism:
    'The 1-point-density surrogate rate used for the collision-time envelope, ' +
    '2 pi / log^2(gamma_N/2pi) = y_N^2 / (2 pi), is exactly the exact fold law ' +
    '|t_c(N)| = g_min(N)^2 / 8 with g_min replaced by ~1.13 y_N (the constant ratio ' +
    '8 / (2 pi) = 1.27 between the two normalizations). Because the surrogate hard-codes ' +
    'g_min -> 1.13 y_N, it can only ever deliver the 1/log^2 rate -- it has no room to ' +
    'improve. Any per-N envelope-exponent gain beyond that surrogate is therefore ' +
    'EQUIVALENT to showing g_min(N) <= C N^{-1/3+eps} y_N for some eps > 0, i.e. exactly ' +
    'the GUE cube-root small-gaps theorem, which is not proved unconditionally. The ' +
    'imp-96616 measurement (exponent -0.3953, envelope factor 0.90-2.21x, N up to 1e6) is ' +
    'consistent with that law holding but is a finite-sample running-min statistic, not an ' +
    'asymptotic proof -- so the pair-correlation wall is RELOCATED from the 1-point-' +
    'density surrogate onto this specific small-gaps exponent, not removed.',
  verificationStatus:
    'Numerical measurement over 2,001,052 Odlyzko zeros (quantifies the target exponent ' +
    'and its GUE consistency), not a proof of the small-gaps law. Changes no bound; ' +
    'establishes no operator positivity; no refereed bound is changed; RH open; NO QED.',
});

export const IMP96639_GMIN_RATIO_GUE_ENVELOPE_GLOSSARY_HEADWORD = Object.freeze({
  id: 'imp-96639',
  proofSection: 'S-frontier',
  glosses: 'imp-96616',
  question:
    'rh-bridge-supercritical-fluid-shock-scaling-2026-09-24 Q1 established that the exact ' +
    'fold law |t_c(N)| = g_min(N)^2 / 8 is a sharper per-N collision-time envelope than the ' +
    '1-point-density surrogate 2 pi / log^2(gamma_N/2pi), and that every envelope-exponent ' +
    'improvement over the surrogate is equivalent to a small-gaps theorem g_min(N)/y_N -> 0. ' +
    'imp-96616 measured how fast that ratio actually decays on real zeros and against what ' +
    'GUE prediction. Does the measurement establish or merely gesture at the small-gaps law, ' +
    'and does it remove the pair-correlation wall or only relocate it?',
  headword: GMIN_RATIO_GUE_ENVELOPE_HEADWORD,
  anyBoundMoved: false,
  verdict:
    'GLOSSARY HEADWORD ONLY (documentation, not a proof). Restates the imp-96616 finding: ' +
    'the measured running-min exponent -0.3953 is close to, and slightly steeper than, the ' +
    'GUE cube-root extreme-gap exponent -1/3, and the ratio tracks the GUE median envelope ' +
    '0.8582 N^{-1/3} to within 0.90x-2.21x over N = 50..1e6. This is consistent with the GUE ' +
    'small-gaps law but does not prove it (finite-sample running-min statistic, not an ' +
    'asymptotic theorem), so beating the 1/log^2 surrogate envelope exponent still requires ' +
    'an unconditional small-gaps theorem -- the pair-correlation wall is RELOCATED onto this ' +
    'specific exponent, not removed. Establishes nothing; instantiates no interval; moves no ' +
    'bound; NO QED. No refereed bound is changed.',
  citation:
    'imp-96616 (the measurement and finding this glosses); ' +
    'rh-bridge-supercritical-fluid-shock-scaling-2026-09-24 Q1 (names the fold-law lever ' +
    'and the surrogate-vs-exact-fold-law equivalence this ratio decides).',
});

export default IMP96639_GMIN_RATIO_GUE_ENVELOPE_GLOSSARY_HEADWORD;

// -- Tripwire assertions ------------------------------------------------------
export const IMP96639_GMIN_RATIO_GUE_ENVELOPE_GLOSSARY_HEADWORD_ASSERTIONS = [
  {
    id: 'imp96639-headword-has-required-fields',
    why: 'The headword must name the measured exponent, the GUE envelope factor range, ' +
      'and the relocates-not-removes distinction -- the entire point of the glossary entry.',
    holds: () => {
      const h = IMP96639_GMIN_RATIO_GUE_ENVELOPE_GLOSSARY_HEADWORD.headword;
      return (
        /-0\.3953/.test(h.definition) &&
        /0\.8582/.test(h.definition) &&
        /RELOCAT/i.test(h.mechanism) &&
        /small-gaps/i.test(h.mechanism)
      );
    },
  },
  {
    id: 'imp96639-honesty-gate-no-qed',
    why: 'Documentation only: no bound claimed moved, no QED, no-refereed-bound-change line present.',
    holds: () =>
      IMP96639_GMIN_RATIO_GUE_ENVELOPE_GLOSSARY_HEADWORD.anyBoundMoved === false &&
      /NO QED/.test(IMP96639_GMIN_RATIO_GUE_ENVELOPE_GLOSSARY_HEADWORD.verdict) &&
      /refereed bound is changed/i.test(IMP96639_GMIN_RATIO_GUE_ENVELOPE_GLOSSARY_HEADWORD.verdict) &&
      IMP96639_GMIN_RATIO_GUE_ENVELOPE_GLOSSARY_HEADWORD.glosses === 'imp-96616',
  },
];

for (const assertion of IMP96639_GMIN_RATIO_GUE_ENVELOPE_GLOSSARY_HEADWORD_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(
      `imp-96639-gmin-ratio-gue-envelope-glossary-headword assertion failed: ${assertion.id}`,
    );
  }
}
