/**
 * @module imp-96838-etrunc-reduction-adverse-sign-glossary-headword
 * @fileoverview imp-96838 -- import-light Concepts glossary headword for the
 *   imp-96794 verdict: an E_trunc truncation-floor REDUCTION cannot shrink the
 *   binding GUE-conditional peak share sigma_max ~ 0.9494 (at N_max ~ 9.22e5,
 *   imp-3406/imp-33582). The dependence has the ADVERSE sign
 *   (d(sigma_max)/d(log E_trunc) ~ -0.019 -- tightening the floor RAISES the
 *   share) and bounded magnitude (< 0.012 over a realistic +/-2x band), so the
 *   ~0.95 conditioning burden is carried by the dominant GUE-conditional E_coll
 *   term, not by the E_trunc floor.
 *
 *   WHY A GLOSSARY HEADWORD (not a re-derivation)
 *   -----------------------------------------------
 *   imp-96794 already establishes the sign, magnitude, and structural limit with
 *   a full sensitivity sweep and five assertions. This headword bakes its
 *   conclusion, once, as a single quick-lookup Concepts entry so a reader
 *   browsing the E_trunc / sigma_max literature does not mistake "reduce
 *   E_trunc" for an open lever on the C_mb GUE-conditional burden.
 *
 *   THE HEADWORD
 *   -----------------------------------------------
 *   (a) ADVERSE SIGN. d(sigma_max)/d(log E_trunc) ~ -0.019: reducing the
 *   truncation floor E_trunc INCREASES sigma_max (0.94943 at 1x -> 0.96119 at
 *   0.5x -> 0.97961 at 0.1x -> 0.99226 at 0.01x), moving it toward 1, not away
 *   from it.
 *   (b) BOUNDED MAGNITUDE. sigma_max in [0,1] means even a 100x floor
 *   reduction moves it only ~0.043 (0.9494 -> 0.9923); a realistic +/-2x band
 *   moves it < 0.012.
 *   (c) STRUCTURAL LIMIT. As E_trunc -> 0 the interior maximum disappears
 *   entirely and sigma climbs monotonically to 1 -- the positive floor is what
 *   CAPS the share below 1, so shrinking the floor uncaps it rather than
 *   shrinking it.
 *   (d) CONSEQUENCE. "Tighten E_trunc" is closed off as a route to reducing
 *   the C_mb GUE-conditional burden: the ~0.95 peak share is carried by
 *   E_coll (imp-486), not by the floor.
 *
 *   STATUS: a glossary restatement of the imp-96794 verdict, not a new
 *   measurement. NO QED. No refereed bound is changed.
 *
 * @see imp-96794-etrunc-reduction-peak-share-leverage.js (source: signed leverage + structural limit)
 * @see imp-3406-sigma-highN-extrapolation (interior max N_max ~ 9.22e5, sigma_max ~ 0.9494)
 * @see imp-486 (C_mb GUE-conditional; the binding share this floor cannot shrink)
 *
 * Ticket: imp-96838 (content, low, sonnet-4-6). Documentation only; establishes
 * nothing; NO QED; no refereed bound is changed.
 */

const ETRUNC_REDUCTION_ADVERSE_SIGN_HEADWORD = Object.freeze({
  key: 'etrunc-reduction-adverse-sign-cannot-shrink-peak-share',
  term:
    'E_trunc reduction on sigma_max (imp-96794): ADVERSE-SIGNED, bounded lever -- ' +
    'tightening the truncation floor RAISES the binding GUE-conditional peak share ' +
    'toward 1, it does not shrink it',
  definition:
    'The interior peak share sigma_max ~ 0.9494 (at N_max ~ 9.22e5, imp-3406) is ' +
    'monotone DECREASING in the truncation floor E_trunc: sigma = E_coll / ' +
    '(E_trunc + E_flow + E_coll), so a smaller E_trunc makes the non-conditional ' +
    'numerator smaller relative to the GUE-conditional E_coll and sigma_max RISES ' +
    '(0.94943 at 1x -> 0.96119 at 0.5x -> 0.97961 at 0.1x -> 0.99226 at 0.01x). ' +
    'Reducing E_trunc is therefore a GROW-lever on the conditioning burden, not a ' +
    'shrink-lever, even though it is the only non-conditional term in the sum.',
  mechanism:
    'The signed leverage d(sigma_max)/d(log E_trunc) ~ -0.019 is small and bounded ' +
    'because sigma_max in [0,1]: a full 100x floor reduction moves it only from ' +
    '0.9494 to 0.9923 (~0.043), and a realistic +/-2x band moves it < 0.012. The ' +
    'headroom 1 - sigma_max has elasticity ~ +0.375, so a 10 percent floor ' +
    'reduction shrinks that headroom only ~3.8 percent. In the structural limit ' +
    'E_trunc -> 0, the interior maximum disappears entirely and sigma climbs ' +
    'monotonically to 1 (verified 1e10 -> 0.99876, 1e20 -> 0.99999992) -- the ' +
    'positive floor is precisely what CAPS the peak share below 1, so shrinking it ' +
    'uncaps rather than shrinks the burden.',
  verificationStatus:
    'Restates the verdict already established and assertion-checked in imp-96794 ' +
    '(five assertions: base-peak reproduction, adverse sign, monotonicity, bounded ' +
    'magnitude, zero-floor limit); no new computation. Changes no bound, ' +
    'establishes no operator positivity, and leaves C_mb GUE-conditional (imp-486). ' +
    'No refereed bound is changed; RH open; NO QED.',
});

export const IMP96838_ETRUNC_REDUCTION_ADVERSE_SIGN_GLOSSARY_HEADWORD = Object.freeze({
  id: 'imp-96838',
  proofSection: 'S-frontier',
  glosses: 'imp-96794',
  question:
    'imp-96794 measured d(sigma_max)/d(log E_trunc) ~ -0.019 (adverse sign, bounded ' +
    'magnitude). Does an E_trunc truncation-floor REDUCTION offer a usable route to ' +
    'shrinking the binding GUE-conditional peak share sigma_max ~ 0.9494?',
  headword: ETRUNC_REDUCTION_ADVERSE_SIGN_HEADWORD,
  anyBoundMoved: false,
  verdict:
    'GLOSSARY HEADWORD ONLY (documentation, not a proof). E_trunc REDUCTION cannot ' +
    'shrink the binding GUE-conditional peak share: the dependence has the ADVERSE ' +
    'sign (d(sigma_max)/d(log E_trunc) ~ -0.019, a tighter floor raises sigma_max ' +
    'toward 1) and bounded magnitude (< 0.012 over a realistic +/-2x band). As ' +
    'E_trunc -> 0 the interior maximum vanishes and sigma -> 1, confirming the floor ' +
    'only caps and places the turnover -- the ~0.95 peak share is carried by E_coll, ' +
    'not the floor. Restates the imp-96794 verdict; changes no bound and does not ' +
    'touch C_mb GUE-conditional status (imp-486). Establishes nothing; NO QED. ' +
    'No refereed bound is changed.',
  citation:
    'imp-96794 (signed leverage -0.019, structural zero-floor limit); imp-3406 ' +
    '(interior max N_max ~ 9.22e5, sigma_max ~ 0.9494); imp-486 (C_mb GUE-conditional).',
});

export default IMP96838_ETRUNC_REDUCTION_ADVERSE_SIGN_GLOSSARY_HEADWORD;

// -- Tripwire assertions ------------------------------------------------------
export const IMP96838_ETRUNC_REDUCTION_ADVERSE_SIGN_GLOSSARY_HEADWORD_ASSERTIONS = [
  {
    id: 'imp96838-headword-names-adverse-sign-and-bounded-magnitude',
    why: 'The headword must name both the adverse sign and the bounded magnitude -- ' +
      'the entire point of the glossary entry.',
    holds: () => {
      const h = IMP96838_ETRUNC_REDUCTION_ADVERSE_SIGN_GLOSSARY_HEADWORD.headword;
      return (
        /adverse/i.test(h.term) &&
        /-0\.019/.test(h.mechanism) &&
        /0\.9494/.test(h.definition) &&
        /bounded/i.test(h.mechanism)
      );
    },
  },
  {
    id: 'imp96838-honesty-gate-no-qed',
    why: 'Documentation only: no bound claimed moved, no QED, no-refereed-bound-change line present.',
    holds: () =>
      IMP96838_ETRUNC_REDUCTION_ADVERSE_SIGN_GLOSSARY_HEADWORD.anyBoundMoved === false &&
      /NO QED/.test(IMP96838_ETRUNC_REDUCTION_ADVERSE_SIGN_GLOSSARY_HEADWORD.verdict) &&
      /refereed bound is changed/i.test(IMP96838_ETRUNC_REDUCTION_ADVERSE_SIGN_GLOSSARY_HEADWORD.verdict) &&
      IMP96838_ETRUNC_REDUCTION_ADVERSE_SIGN_GLOSSARY_HEADWORD.glosses === 'imp-96794',
  },
];

for (const assertion of IMP96838_ETRUNC_REDUCTION_ADVERSE_SIGN_GLOSSARY_HEADWORD_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(
      `imp-96838-etrunc-reduction-adverse-sign-glossary-headword assertion failed: ${assertion.id}`,
    );
  }
}
