/**
 * @module imp-95795-number-variance-deadzone-glossary-headword
 * @fileoverview imp-95795 -- import-light glossary/Concepts headword for the
 *   number-variance "dead zone": the height range above the imp-95750 direct
 *   sd(C - E) measurement ceiling gamma_1e6 = 6.003e5 up to the imp-95519 window
 *   bottom T = 3.0e12, where the pointwise-variance claim rests entirely on the
 *   imp-95722 DERIVED r_cap(T) envelope, never on direct measurement.
 *
 *   WHY A GLOSSARY HEADWORD (not a re-derivation)
 *   -----------------------------------------------
 *   imp-95750 pinned the direct-measurement ceiling at the largest verified
 *   ordinate in the repo, gamma_1e6 = 6.003e5, and showed it closes only ~2.4% of
 *   the gap to the imp-95729 crossover T0 ~ 1.14e9 -- a ~3.28-decade unreached band
 *   right there, widening to ~6.70 decades by the imp-95519 window bottom
 *   T = 3.0e12. imp-95766 then measured the imp-95722 derived cap r_cap(T) across
 *   that whole band and found it stays conservative (r_cap < 1) throughout,
 *   descending monotonically as height grows. A reader landing on either module
 *   cold has no single quick-lookup definition of what the "dead zone" IS or WHY
 *   the r_cap conservatism is what covers it. This headword bakes those facts
 *   VERBATIM (no re-import of the imp-95750 / imp-95766 modules, to stay
 *   import-light) as a standalone lookup entry.
 *
 *   THE HEADWORD
 *   -----------------------------------------------
 *   The number-variance dead zone is the height range (gamma_1e6, 3.0e12] where no
 *   in-repo zero table can supply a windowed sd(C - E) sample, so the pointwise-
 *   variance claim has nothing to fall back on but the imp-95722 derived envelope
 *   r_cap(T) = [(1/2pi^2) log log(T/2pi) + C0] / Sigma^2(L(T)). The band splits
 *   into a ~3.28-decade span up to the imp-95729 crossover T0 ~ 1.14e9 (the
 *   E_coll = E_trunc turning point the conservatism must protect) and a further
 *   ~3.42 decades on to the window bottom, ~6.70 decades from the ceiling in all.
 *
 *   WHY r_cap CONSERVATISM (r < 1) IS WHAT COVERS IT: imp-95766 measured r_cap at
 *   the ceiling, the crossover, and the window bottom and found it falls
 *   MONOTONICALLY -- 0.4322, 0.3237, 0.2599 respectively -- so the margin below 1
 *   only WIDENS with height (0.568 -> 0.676 -> 0.740). The envelope's Selberg-
 *   unconditional numerator grows only as log log T while the GUE denominator
 *   grows as log T, so the ratio is pushed further below 1 the deeper into the
 *   dead zone one looks -- the conservatism gets STRONGER exactly where the direct
 *   measurement is weakest.
 *
 *   STATUS: a definitional glossary entry only. Changes no bound; the true
 *   r(T) still lies in (0, r_cap(T)], unsharpened.
 *
 *   WHAT THIS IS AND IS NOT
 *   ------------------------
 *   A glossary-style lookup restating the imp-95750 dead-zone extent and the
 *   imp-95766 r_cap coverage of it for quick reference. It establishes nothing,
 *   instantiates no interval, closes no sub-gap, moves no bound. NO QED.
 *   No refereed bound is changed.
 *
 * @see imp-95750-number-variance-deadzone-measurement-reach (source: the dead-zone extent this glosses)
 * @see imp-95766-number-variance-cap-crossover-deadzone (source: the r_cap coverage this glosses)
 * @see imp-95722-number-variance-ratio-window-bottom-bound (the derived r_cap envelope itself)
 * @see imp-95519-localized-barrier-sum-prime-zero-nogo (window bottom T = 3.0e12)
 *
 * Ticket: imp-95795 (content, low). Documentation only; establishes nothing; NO QED;
 * no refereed bound is changed.
 */

// The number-variance dead-zone headword, baked verbatim (no re-import).
const NUMBER_VARIANCE_DEADZONE_HEADWORD = Object.freeze({
  key: 'number-variance-dead-zone',
  term:
    'number-variance dead zone (gamma_1e6 = 6.003e5 to T = 3.0e12, ~6.70 decades)',
  definition:
    'The height range above the imp-95750 direct-measurement ceiling gamma_1e6 = ' +
    '6.003e5 (the largest verified ordinate in the repo) up to the imp-95519 ' +
    'window bottom T = 3.0e12, where no in-repo zero table can supply a windowed ' +
    'sd(C - E) sample. Inside this ~6.70-decade band the pointwise-variance claim ' +
    'rests entirely on the imp-95722 DERIVED GUE/mean-square envelope r_cap(T), ' +
    'never on direct measurement. The band splits into a ~3.28-decade span up to ' +
    'the imp-95729 crossover T0 ~ 1.14e9 and a further ~3.42 decades on to the ' +
    'window bottom.',
  mechanism:
    'r_cap(T) = [(1/2pi^2) log log(T/2pi) + C0] / Sigma^2(L(T)): a Selberg-' +
    'unconditional numerator growing as log log T over a GUE denominator growing ' +
    'as log T, plus a pinned O(1) finite-height offset C0. Because the numerator ' +
    'grows far slower than the denominator, the ratio falls as T increases -- the ' +
    'envelope becomes MORE conservative, not less, deeper into the dead zone.',
  verificationStatus:
    'imp-95766 measured r_cap at the ceiling, the crossover, and the window ' +
    'bottom: 0.4322, 0.3237, 0.2599 respectively, monotonically decreasing, so the ' +
    'margin below 1 widens with height (0.568 -> 0.676 -> 0.740). The dead zone ' +
    'is entirely unmeasured directly, but the conservatism it relies on gets ' +
    'stronger, not weaker, across it.',
});

export const IMP95795_NUMBER_VARIANCE_DEADZONE_GLOSSARY_HEADWORD = Object.freeze({
  id: 'imp-95795',
  proofSection: 'S-frontier',
  glosses: 'imp-95750, imp-95766',
  question:
    'imp-95766 characterized the number-variance dead zone above the imp-95750 ' +
    'direct sd(C - E) ceiling gamma_1e6 = 6.003e5 up to the imp-95519 window ' +
    'bottom T = 3.0e12, where the pointwise-variance claim rests entirely on the ' +
    'imp-95722 derived r_cap(T) envelope. What is the dead zone, what is the ' +
    'direct-measurement ceiling, and why does r_cap conservatism (r < 1) cover ' +
    'it, for a reader landing on either module cold?',
  headword: NUMBER_VARIANCE_DEADZONE_HEADWORD,
  anyBoundMoved: false,
  verdict:
    'GLOSSARY HEADWORD ONLY (documentation, not a proof). Restates the imp-95750 ' +
    'dead-zone extent (ceiling gamma_1e6 = 6.003e5 to window bottom 3.0e12, ~6.70 ' +
    'decades, ~3.28 decades to the imp-95729 crossover) and the imp-95766 finding ' +
    'that the imp-95722 derived r_cap(T) envelope stays conservative (r_cap < 1) ' +
    'and MONOTONICALLY strengthens across the entire band (0.4322 -> 0.3237 -> ' +
    '0.2599). Establishes nothing; instantiates no interval; moves no bound; ' +
    'NO QED. No refereed bound is changed.',
  citation:
    'imp-95750 (dead-zone extent and direct-measurement ceiling this glosses); ' +
    'imp-95766 (r_cap measured across the dead zone); imp-95722 (the derived ' +
    'r_cap(T) envelope itself); imp-95519 (window bottom T = 3.0e12).',
});

export default IMP95795_NUMBER_VARIANCE_DEADZONE_GLOSSARY_HEADWORD;

// -- Tripwire assertions ------------------------------------------------------
export const IMP95795_NUMBER_VARIANCE_DEADZONE_GLOSSARY_HEADWORD_ASSERTIONS = [
  {
    id: 'imp95795-headword-has-required-fields',
    why: 'The headword must name the exact dead-zone bounds (gamma_1e6 = 6.003e5, ' +
      'T = 3.0e12), the ~3.28-decade crossover span, and the monotone r_cap ' +
      'coverage -- the entire point of the glossary entry.',
    holds: () => {
      const h = IMP95795_NUMBER_VARIANCE_DEADZONE_GLOSSARY_HEADWORD.headword;
      return (
        /6\.003e5/.test(h.definition) &&
        /3\.0e12/.test(h.definition) &&
        /3\.28-decade/.test(h.definition) &&
        /monotonically decreasing/i.test(h.verificationStatus) &&
        /0\.4322.*0\.3237.*0\.2599/.test(h.verificationStatus)
      );
    },
  },
  {
    id: 'imp95795-honesty-gate-no-qed',
    why: 'Documentation only: no bound claimed moved, no QED, no-refereed-bound-change line present.',
    holds: () =>
      IMP95795_NUMBER_VARIANCE_DEADZONE_GLOSSARY_HEADWORD.anyBoundMoved === false &&
      /NO QED/.test(IMP95795_NUMBER_VARIANCE_DEADZONE_GLOSSARY_HEADWORD.verdict) &&
      /refereed bound is changed/i.test(IMP95795_NUMBER_VARIANCE_DEADZONE_GLOSSARY_HEADWORD.verdict) &&
      IMP95795_NUMBER_VARIANCE_DEADZONE_GLOSSARY_HEADWORD.glosses === 'imp-95750, imp-95766',
  },
];

for (const assertion of IMP95795_NUMBER_VARIANCE_DEADZONE_GLOSSARY_HEADWORD_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(
      `imp-95795-number-variance-deadzone-glossary-headword assertion failed: ${assertion.id}`,
    );
  }
}
