/**
 * @module imp-97193-coercivity-constant-lambda-min-glossary-headword
 * @fileoverview imp-97193 -- import-light glossary/Concepts headword pinning the PRECISE Route I
 *   coercivity constant identified by imp-97161: the sharp dip-vs-far-field balance constant for
 *   the pole-free Weil symbol sigma_2 = (t^2+1/4)^2 w_1 on PW_a is EXACTLY
 *       c_sharp = lambda_min( P_a M_{sigma_2} P_a ),
 *   the bottom eigenvalue of the compression of multiplication-by-sigma_2 to the Paley-Wiener
 *   space PW_a -- not a Beurling-Selberg deficit and not a flat Slepian concentration eigenvalue
 *   (imp-97161 ruled both out). Finite-N numerics (Legendre, shift-invert Rayleigh-Ritz) bracket
 *   c_sharp only from ABOVE and are still descending; no proven lower bound exists.
 *
 *   WHY A GLOSSARY HEADWORD (not a re-derivation)
 *   -----------------------------------------------
 *   imp-97137 named the missing coercivity input only loosely (a "concentration / extremal
 *   estimate"). imp-97161 pinned the exact extremal object and showed the two standard tools that
 *   might have supplied it both fail. This headword bakes that exact identity and the
 *   one-sided-bracket status verbatim (no re-import of imp-97161) so a reader does not mistake the
 *   finite-N Rayleigh-Ritz numbers for anything but an upper bound on the true constant.
 *
 *   THE HEADWORD
 *   -----------------------------------------------
 *   c_sharp = lambda_min( P_a M_{sigma_2} P_a ) = inf { int sigma_2(t) F(t) dt : F >= 0,
 *   supp Fhat subset [-2a,2a], int F = 1 }, equivalently the smallest eigenvalue of the truncated
 *   convolution kernel Ksig(u) = (D^2+1/4)^2[Karch + Kprime](u) on |u| <= 2a. At the binding
 *   half-width 2a = ln3 the numerics only BRACKET c_sharp from above -- certificate value 0.552,
 *   Legendre-N100 0.533852, shift-invert-N240 0.475606, and still descending -- with NO proven
 *   lower bound. imp-97161 showed this is not an artefact of missing tools: a Beurling-Selberg
 *   minorant route is circular (a type-2a minorant reproduces the identical truncated-Toeplitz
 *   positivity it was meant to remove) and the flat Slepian/prolate route needs a single bounded
 *   dip against a uniform positive far floor, which sigma_2 does not have (recurring negativity
 *   bands, unbounded t^4 dip depth, and a positive far field sharing the same t^4 envelope).
 *
 *   STATUS: a glossary headword pinning an already-committed identity, not a new computation or a
 *   positivity theorem. No lower bound on c_sharp is established here or in imp-97161. Certified
 *   reach stays 2a <= 0.96. NO QED. No refereed bound is changed; RH open.
 *
 * @see imp-97161-krein-concentration-lower-bound-assessment.js (source: the c_sharp identity and
 *   the Beurling-Selberg / flat-prolate rule-out this headword glosses)
 * @see imp-97137-krein-debranges-coercivity-scope.js (named the missing concentration/extremal
 *   input that imp-97161 pinned exactly)
 *
 * Ticket: imp-97193 (content, low, sonnet-4-6). Documentation only; establishes nothing; NO QED;
 * no refereed bound is changed.
 */

// The coercivity-constant identity headword, baked verbatim (no re-import).
const COERCIVITY_CONSTANT_LAMBDA_MIN_HEADWORD = Object.freeze({
  key: 'route-i-coercivity-constant-is-exactly-lambda-min-weighted-compression-upper-bracket-only',
  term:
    'imp-97161 finding: the Route I coercivity constant for sigma_2 on PW_a is EXACTLY ' +
    'c_sharp = lambda_min(P_a M_{sigma_2} P_a), the bottom eigenvalue of the compression of ' +
    'multiplication-by-sigma_2 to the Paley-Wiener space PW_a -- and finite-N numerics bracket it ' +
    'only from ABOVE',
  definition:
    'c_sharp = inf { int sigma_2(t) F(t) dt : F >= 0, supp Fhat subset [-2a,2a], int F = 1 } = ' +
    'lambda_min( P_a M_{sigma_2} P_a ), equivalently the smallest eigenvalue of the truncated ' +
    'convolution kernel Ksig(u) = (D^2+1/4)^2[Karch + Kprime](u) restricted to lags |u| <= 2a. At ' +
    'the binding half-width 2a = ln3 the only numbers on record are upper brackets: certificate ' +
    'value 0.552, Legendre-N100 0.533852, shift-invert-N240 0.475606 -- still descending -- with no ' +
    'proven lower bound.',
  mechanism:
    'Because c_sharp is defined as an infimum over band-limited densities (equivalently a bottom ' +
    'eigenvalue), every finite-dimensional Rayleigh-Ritz computation (Legendre truncation, ' +
    'shift-invert) can only ever certify an upper bound on it, never a lower one; a lower bound ' +
    'requires an independent argument. imp-97161 checked the two standard independent arguments -- ' +
    'a Beurling-Selberg one-sided extremal deficit, and a flat Slepian/prolate concentration ' +
    'eigenvalue -- and found both fail structurally for this weight (the minorant route collapses ' +
    'back to the same truncated-Toeplitz positivity it was meant to avoid; the flat-prolate route ' +
    'needs a single bounded dip against a uniform far floor that sigma_2, with its recurring ' +
    't^4-scaled sign changes, does not have).',
  verificationStatus:
    'Glossary headword pinning an already-committed identity and rule-out (imp-97161); no new ' +
    'numerical computation. No lower bound on c_sharp established here; certified reach unchanged ' +
    'at 2a <= 0.96; no refereed bound is changed; RH open; NO QED.',
});

export const IMP97193_COERCIVITY_CONSTANT_GLOSSARY_HEADWORD = Object.freeze({
  id: 'imp-97193',
  proofSection: 'S-frontier',
  glosses: 'imp-97161',
  question:
    'imp-97137 flagged a missing coercivity input for the Route I dip-vs-far-field balance of ' +
    'sigma_2 on PW_a without pinning it exactly. What is the precise object, and what is its ' +
    'current numerical status?',
  headword: COERCIVITY_CONSTANT_LAMBDA_MIN_HEADWORD,
  anyBoundMoved: false,
  verdict:
    'GLOSSARY HEADWORD ONLY (documentation, not a proof). Restates the imp-97161 finding: the ' +
    'Route I coercivity constant is EXACTLY c_sharp = lambda_min(P_a M_{sigma_2} P_a), the bottom ' +
    'eigenvalue of the compression of multiplication-by-sigma_2 to PW_a -- not a Beurling-Selberg ' +
    'deficit and not a flat Slepian concentration eigenvalue, both of which imp-97161 showed fail ' +
    'for this weight. Finite-N numerics (0.552 certificate, 0.534 Legendre, 0.476 shift-invert, ' +
    'still descending) bracket c_sharp only from ABOVE; no proven lower bound exists. Readers ' +
    'should not treat the descending finite-N numbers as approaching a floor from below. ' +
    'Establishes nothing new; moves no bound; NO QED. No refereed bound is changed.',
  citation:
    'imp-97161 (the c_sharp identity and the Beurling-Selberg / flat-prolate rule-out this ' +
    'headword glosses); imp-97137 (named the missing coercivity input imp-97161 pinned exactly).',
});

export default IMP97193_COERCIVITY_CONSTANT_GLOSSARY_HEADWORD;

// -- Tripwire assertions ------------------------------------------------------
export const IMP97193_COERCIVITY_CONSTANT_GLOSSARY_HEADWORD_ASSERTIONS = [
  {
    id: 'imp97193-headword-names-lambda-min-identity-and-upper-only-status',
    why: 'The headword must state the exact c_sharp = lambda_min identity and that finite-N ' +
      'numerics bracket it only from above -- the entire point of the glossary entry.',
    holds: () => {
      const h = IMP97193_COERCIVITY_CONSTANT_GLOSSARY_HEADWORD.headword;
      return (
        /lambda_min/.test(h.term) &&
        /P_a M_\{sigma_2\} P_a/.test(h.definition) &&
        /descending/.test(h.definition) &&
        /ABOVE/i.test(h.term)
      );
    },
  },
  {
    id: 'imp97193-honesty-gate-no-qed',
    why: 'Documentation only: no bound claimed moved, no QED, no-refereed-bound-change line present.',
    holds: () =>
      IMP97193_COERCIVITY_CONSTANT_GLOSSARY_HEADWORD.anyBoundMoved === false &&
      /NO QED/.test(IMP97193_COERCIVITY_CONSTANT_GLOSSARY_HEADWORD.verdict) &&
      /refereed bound is changed/i.test(IMP97193_COERCIVITY_CONSTANT_GLOSSARY_HEADWORD.verdict) &&
      IMP97193_COERCIVITY_CONSTANT_GLOSSARY_HEADWORD.glosses === 'imp-97161',
  },
];

for (const assertion of IMP97193_COERCIVITY_CONSTANT_GLOSSARY_HEADWORD_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(
      `imp-97193-coercivity-constant-lambda-min-glossary-headword assertion failed: ${assertion.id}`,
    );
  }
}
