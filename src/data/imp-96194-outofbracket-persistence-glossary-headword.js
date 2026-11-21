/**
 * @module imp-96194-outofbracket-persistence-glossary-headword
 * @fileoverview imp-96194 -- import-light glossary/Concepts headword for the imp-96170
 *   out-of-bracket persistence finding: the exact GUE two-interval covariance's ~2.7x
 *   AR-1 inflation (f = 2.72095 at T = 8e4, f = 2.75103 at T = 6e5) and its ~1.04-rho-unit
 *   safe-side flip margin extend beyond the imp-96150 sampled {2e4 .. 4e5} band.
 *
 *   WHY A GLOSSARY HEADWORD (not a re-derivation)
 *   -----------------------------------------------
 *   imp-96150 measured the exact adjacent-box count covariance rho_exact, the AR-1
 *   effective-count factor f and the flip-gap at five held-out heights, all INSIDE the
 *   [2e4, 4e5] band, and called the factor "near-constant" and the margin "safe-side" --
 *   but never tested a height outside that band. imp-96170 closed that gap at two fresh
 *   heights (an interior gap point and one above the sampled top). A reader landing on
 *   imp-96170 cold has no quick-lookup definition of what "out-of-bracket" means or which
 *   numbers confirm persistence. This headword bakes that confirmation VERBATIM (no
 *   re-import of the imp-96170 module, to stay import-light) as a standalone lookup entry.
 *
 *   THE HEADWORD
 *   -----------------------------------------------
 *   At T = 8e4 (interior gap, between the imp-96150 5e4 and 1e5 samples) the AR-1 factor
 *   is f = 2.72095, interpolating cleanly inside the imp-96150 in-band range 2.695 .. 2.746.
 *   At T = 6e5 (above the sampled top 4e5) the factor is f = 2.75103, marginally EXCEEDING
 *   the in-band maximum in the expected monotone-toward-rigidity direction, not breaking
 *   away from it. rho_exact continues its drift toward -1/2 (-0.462502 at 8e4, -0.466814
 *   at 6e5, the latter more negative than the in-band minimum -0.466037). The flip-gap
 *   rho_crit - rho_exact stays ~1.04 in rho units on the safe side at both fresh heights
 *   (1.03693 / 1.04124), of the wrong sign to ever approach the positive flip threshold
 *   rho_crit = 0.57443.
 *
 *   MECHANISM: rho_exact is the exact sine-kernel two-interval correlation of edge-to-edge
 *   boxes of unfolded length L = 2*Delta*delta(T), derived from the union identity
 *   Var(N([0,2L])) = Sigma^2(2L) = 2 Sigma^2(L) + 2 Cov. Because the GUE number variance
 *   Sigma^2(L) = (log(2*pi*L) + gamma + 1)/pi^2 grows only logarithmically in L, and L itself
 *   grows with T, rho_exact drifts monotonically and slowly toward -1/2 as T increases --
 *   there is no structural reason for the trend to plateau or reverse at the edges of any
 *   finite sampled band, which is exactly what the out-of-bracket heights confirm.
 *
 *   STATUS: a MEASUREMENT extending the imp-96150 near-constant-factor and safe-side-margin
 *   claims beyond their sampled band. It shows those claims were not an in-band artefact.
 *   Changes no bound; does not raise the ~1.9-sigma significant-dip confidence (set by
 *   excursion depth, not the correlation model).
 *
 *   WHAT THIS IS AND IS NOT
 *   ------------------------
 *   A glossary-style lookup restating the imp-96170 out-of-bracket measurement for quick
 *   reference. It establishes nothing, instantiates no interval, closes no sub-gap, moves
 *   no bound. NO QED. No refereed bound is changed.
 *
 * @see imp-96170-number-variance-two-interval-covariance-outofbracket-heights (source: the measurement this glosses)
 * @see imp-96150-number-variance-two-interval-covariance-heldout-heights (the five in-band held-out heights this extends)
 * @see imp-96128-number-variance-two-interval-covariance-exact (the single significant-height T = 1.5e5 census)
 *
 * Ticket: imp-96194 (content, low). Documentation only; establishes nothing; NO QED;
 * no refereed bound is changed.
 */

// The out-of-bracket persistence headword, baked verbatim (no re-import).
const OUTOFBRACKET_PERSISTENCE_HEADWORD = Object.freeze({
  key: 'outofbracket-persistence-ar1-inflation',
  term:
    'imp-96170 out-of-bracket persistence: the ~2.7x AR-1 inflation (f = 2.72095/2.75103 ' +
    'at T = 8e4/6e5) and ~1.04 safe-side flip margin extend beyond the imp-96150 ' +
    '{2e4 .. 4e5} band',
  definition:
    'At two fresh heights outside the imp-96150 sampled bracket -- T = 8e4 (interior gap, ' +
    'between the sampled 5e4 and 1e5) and T = 6e5 (above the sampled top 4e5) -- the exact ' +
    'GUE two-interval covariance keeps its near-constant AR-1 effective-count factor at ' +
    'f = 2.72095 and f = 2.75103, the latter marginally exceeding the imp-96150 in-band ' +
    'maximum 2.746 in the expected monotone-toward-rigidity direction rather than breaking ' +
    'away from it. rho_exact is -0.462502 at 8e4 and -0.466814 at 6e5, continuing the ' +
    'monotone drift toward -1/2 (the 6e5 value sits marginally past the in-band minimum ' +
    '-0.466037). The flip-gap rho_crit - rho_exact holds at 1.03693 and 1.04124 -- still ' +
    '~1.04 in rho units on the safe side of the positive flip threshold rho_crit = 0.57443.',
  mechanism:
    'rho_exact is the exact sine-kernel two-interval correlation of edge-to-edge boxes of ' +
    'unfolded length L = 2*Delta*delta(T), Delta = sqrt(T/2pi), via the union identity ' +
    'Var(N([0,2L])) = Sigma^2(2L) = 2 Sigma^2(L) + 2 Cov. Since the GUE number variance ' +
    'Sigma^2(L) = (log(2*pi*L) + gamma + 1)/pi^2 grows only logarithmically in L, and L grows ' +
    'with T, rho_exact drifts slowly and monotonically toward -1/2 as T increases -- there is ' +
    'no structural mechanism for the trend to plateau or reverse at the edges of any finite ' +
    'sampled band, so persistence outside the imp-96150 bracket is exactly what the sine-' +
    'kernel formula predicts, not a coincidence of the two fresh heights chosen.',
  verificationStatus:
    'MEASUREMENT extending the imp-96150 near-constant-factor and safe-side-margin claims ' +
    'beyond their sampled band, not a new bound: both fresh heights stay on the safe side of ' +
    'the positive flip threshold rho_crit = 0.57443 by ~1.04 in rho units. Changes no bound; ' +
    'does not raise the ~1.9-sigma significant-dip confidence (set by excursion depth, not ' +
    'the correlation model); no refereed bound is changed; RH open; NO QED.',
});

export const IMP96194_OUTOFBRACKET_PERSISTENCE_GLOSSARY_HEADWORD = Object.freeze({
  id: 'imp-96194',
  proofSection: 'S-frontier',
  glosses: 'imp-96170',
  question:
    'imp-96150 found a near-constant ~2.7x AR-1 inflation factor and a ~1.04 safe-side flip ' +
    'margin at five heights all inside a [2e4, 4e5] band. Does that persist at heights ' +
    'outside the band, for a reader landing on imp-96170 cold?',
  headword: OUTOFBRACKET_PERSISTENCE_HEADWORD,
  anyBoundMoved: false,
  verdict:
    'GLOSSARY HEADWORD ONLY (documentation, not a proof). Restates the imp-96170 ' +
    'out-of-bracket measurement: at T = 8e4 and T = 6e5, outside the imp-96150 {2e4 .. 4e5} ' +
    'band, the AR-1 factor stays near 2.7x (f = 2.72095 / 2.75103) and the flip-gap stays ' +
    '~1.04 in rho units on the safe side (1.03693 / 1.04124), with rho_exact continuing its ' +
    'monotone drift toward -1/2. Establishes nothing; instantiates no interval; moves no ' +
    'bound; NO QED. No refereed bound is changed.',
  citation:
    'imp-96170 (the out-of-bracket measurement this glosses); imp-96150 (the five in-band ' +
    'held-out heights this extends); imp-96128 (the significant-height T = 1.5e5 census).',
});

export default IMP96194_OUTOFBRACKET_PERSISTENCE_GLOSSARY_HEADWORD;

// -- Tripwire assertions ------------------------------------------------------
export const IMP96194_OUTOFBRACKET_PERSISTENCE_GLOSSARY_HEADWORD_ASSERTIONS = [
  {
    id: 'imp96194-headword-has-required-fields',
    why: 'The headword must name both fresh-height factors and the flip-gap safe-side ' +
      'threshold -- the entire point of the glossary entry.',
    holds: () => {
      const h = IMP96194_OUTOFBRACKET_PERSISTENCE_GLOSSARY_HEADWORD.headword;
      return (
        /2\.72095/.test(h.definition) &&
        /2\.75103/.test(h.definition) &&
        /1\.03693/.test(h.definition) &&
        /0\.57443/.test(h.definition)
      );
    },
  },
  {
    id: 'imp96194-honesty-gate-no-qed',
    why: 'Documentation only: no bound claimed moved, no QED, no-refereed-bound-change line present.',
    holds: () =>
      IMP96194_OUTOFBRACKET_PERSISTENCE_GLOSSARY_HEADWORD.anyBoundMoved === false &&
      /NO QED/.test(IMP96194_OUTOFBRACKET_PERSISTENCE_GLOSSARY_HEADWORD.verdict) &&
      /refereed bound is changed/i.test(IMP96194_OUTOFBRACKET_PERSISTENCE_GLOSSARY_HEADWORD.verdict) &&
      IMP96194_OUTOFBRACKET_PERSISTENCE_GLOSSARY_HEADWORD.glosses === 'imp-96170',
  },
];

for (const assertion of IMP96194_OUTOFBRACKET_PERSISTENCE_GLOSSARY_HEADWORD_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(
      `imp-96194-outofbracket-persistence-glossary-headword assertion failed: ${assertion.id}`,
    );
  }
}
