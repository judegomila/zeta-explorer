/**
 * @module imp-97042-krein-ritz-upper-bound-not-lower-glossary-headword
 * @fileoverview imp-97042 -- import-light glossary/Concepts headword recording a recurring
 *   caveat that surfaces independently across imp-96934, imp-96938, and imp-97012: every
 *   Krein/Ritz/Rayleigh-Ritz operator-floor number quoted in the Route I/M Toeplitz-Krein
 *   program is an UPPER bound on the true infinite-dimensional lam_min (or lambda_1), not a
 *   certified LOWER bound. A large positive floor is reassuring but never itself proves
 *   operator positivity; only an interval-rigorous certificate (the separate Toeplitz/Krein
 *   LP route) does that.
 *
 *   WHY A GLOSSARY HEADWORD (not a re-derivation)
 *   -----------------------------------------------
 *   The three source modules restate the same structural fact in three different contexts:
 *   - imp-96934: "The Rayleigh floor is an UPPER bound on the true infinite-dim lam_min; NO
 *     operator positivity" (Bessel onset-mass tail residual).
 *   - imp-96938: calibrates the imp-96911 coupled-(N,T) Ritz-drift measurement against the
 *     CERTIFIED-POSITIVE endpoint 2a=0.96 and finds the drift directions are IDENTICAL at
 *     both the open (2a=ln3) and certified endpoints -- so the drift pattern by itself
 *     cannot distinguish open from certified; only the interval certificate can.
 *   - imp-97012: "the operator floor here is a Rayleigh UPPER bound", flagging that a
 *     single in-pool cell-local verifier PASS still needs independent adversarial
 *     re-verification before the interpretive step to Weil/operator positivity is licensed.
 *   Because the same one-line caveat is reproduced verbatim in each module's own comments
 *   rather than cross-referenced, a reader skimming any one of them in isolation can mistake
 *   a large Ritz/Rayleigh floor for a proof of positivity. This headword names the caveat
 *   once, generically, so future modules can cite it instead of re-deriving it.
 *
 *   THE HEADWORD
 *   -----------------------------------------------
 *   (a) DIRECTION OF THE BOUND. A Rayleigh-Ritz compression R_N = P_N (K+m)^{-1} P_N onto a
 *   finite nested subspace has top eigenvalue eta; the floor lam1_ritz = 1/eta - m satisfies
 *   lam1_ritz >= lambda_1(true operator), i.e. it is an UPPER bound on the true eigenvalue.
 *   A finite computation can only ever push this floor DOWN toward the truth by refining the
 *   subspace -- it can never certify a LOWER bound on lambda_1 from finitely many Ritz values
 *   alone, no matter how large or how stable the observed floor is.
 *   (b) LARGE MARGIN IS NOT PROOF. imp-96938's own calibration shows the failure mode
 *   directly: at the certified-positive 2a=0.96 endpoint the Ritz floor sits >= 12.0 across
 *   the whole (Nbig,T) sweep and the drift directions (Nbig-monotone eta rise, T-reopening)
 *   are IDENTICAL to those seen at the open 2a=ln3 endpoint (floor order ~0.5). The drift
 *   behaviour alone cannot tell the two cases apart; only the separately-verified
 *   interval-rigorous Toeplitz/Krein certificate (2a <= 0.9, see
 *   project_toeplitz_krein_certificate memory) supplies an actual certified lower bound.
 *   (c) WHAT DOES CLOSE THE GAP. Two routes convert a Ritz upper bound into a certified
 *   statement: a Temple/Kato-Temple-style lower-bound method (needs an explicit spectral-gap
 *   enclosure) or a de Branges-type coercivity estimate T_a[sigma_2] >= cI (see imp-97145).
 *   Neither is supplied by a Ritz/Rayleigh computation by itself.
 *
 *   STATUS: a terminology/scope caveat consolidating three existing findings, not a new
 *   computation or a re-derivation. No bound is moved, no operator positivity is newly
 *   claimed or newly refuted. NO QED. No refereed bound is changed.
 *
 * @see imp-96934-bessel-onset-tail-residual-viz-data.js (Rayleigh floor UPPER bound caveat,
 *   Bessel onset-mass context)
 * @see imp-96938-krein-drift-calibration-096.js (drift-direction calibration showing the
 *   floor's large margin, not its drift, is what separates open from certified)
 * @see imp-97012-krein-kmax5-100-celllocal-w1pp-verify.js (cell-local PASS still needs
 *   independent re-verification before the positivity step is licensed)
 * @see project_toeplitz_krein_certificate.md (memory: the actual interval-rigorous
 *   certificate that DOES certify positivity, 2a <= 0.9)
 *
 * Ticket: imp-97042 (content, low, sonnet-4-6). Documentation only; establishes nothing;
 * NO QED; no refereed bound is changed.
 */

// The Ritz/Rayleigh-upper-bound-not-lower headword, baked verbatim (no re-import).
const KREIN_RITZ_UPPER_BOUND_NOT_LOWER_HEADWORD = Object.freeze({
  key: 'krein-ritz-rayleigh-floor-upper-bound-not-certified-lower-bound',
  term:
    'the Krein/Ritz/Rayleigh operator floor quoted across the Route I/M Toeplitz-Krein ' +
    'program (imp-96934, imp-96938, imp-97012) is an UPPER bound on the true ' +
    'infinite-dimensional lam_min / lambda_1, never itself a certified LOWER bound or a ' +
    'proof of operator positivity',
  definition:
    'A Rayleigh-Ritz compression R_N = P_N (K+m)^{-1} P_N onto a finite nested subspace ' +
    'has top eigenvalue eta; the derived floor lam1_ritz = 1/eta - m satisfies ' +
    'lam1_ritz >= lambda_1(true operator) for every finite truncation -- an UPPER bound by ' +
    'construction, however large or however stable it looks under refinement. imp-96934 ' +
    'states this directly for the Bessel onset-mass tail residual; imp-97012 repeats it ' +
    'for the cell-local kmax=5 verify run, flagging that a single in-pool PASS still needs ' +
    'independent adversarial re-verification before the interpretive step to Weil/operator ' +
    'positivity is licensed.',
  mechanism:
    'imp-96938 calibrates the caveat empirically: at the CERTIFIED-POSITIVE endpoint ' +
    '2a=0.96 the Ritz floor stays >= 12.0 across the whole (Nbig,T) sweep, and the drift ' +
    'directions -- eta rising monotonically with Nbig, falling with T at fixed Nbig -- are ' +
    'IDENTICAL in sign and shape to those measured at the OPEN 2a=ln3 endpoint (floor order ' +
    '~0.5). Since the same drift pattern coexists with both a certified-positive and an ' +
    'open case, the drift behaviour of a Ritz floor cannot by itself distinguish them; what ' +
    'differs is only the absolute margin, which a finite computation cannot certify as ' +
    'positive on its own. Converting a Ritz upper bound into an actual certified statement ' +
    'requires either a Temple/Kato-Temple-style lower-bound method (needs an explicit ' +
    'spectral-gap enclosure) or a de Branges coercivity estimate T_a[sigma_2] >= cI ' +
    '(imp-97145) -- or the separately-verified interval-rigorous Toeplitz/Krein LP ' +
    'certificate itself (2a <= 0.9).',
  verificationStatus:
    'Consolidates the caveat already present verbatim in imp-96934, imp-96938, and ' +
    'imp-97012 into one glossary entry; adds no new computation. Establishes nothing new; ' +
    'moves no bound; the only route that DOES certify positivity remains the separate ' +
    'interval-rigorous Toeplitz/Krein LP certificate (2a <= 0.9). No refereed bound is changed' +
    '; RH open; NO QED.',
});

export const IMP97042_KREIN_RITZ_UPPER_BOUND_NOT_LOWER_GLOSSARY_HEADWORD = Object.freeze({
  id: 'imp-97042',
  proofSection: 'Route-I-Route-M',
  glosses: 'imp-96934,imp-96938,imp-97012',
  question:
    'imp-96934, imp-96938, and imp-97012 each independently note that their quoted ' +
    'Krein/Ritz/Rayleigh operator floor is an upper bound, not a certified lower bound. Is ' +
    'this the same structural caveat recurring three times, or three distinct issues that ' +
    'happen to use similar language?',
  headword: KREIN_RITZ_UPPER_BOUND_NOT_LOWER_HEADWORD,
  anyBoundMoved: false,
  verdict:
    'GLOSSARY HEADWORD ONLY (documentation, not a proof). It is the same structural fact ' +
    'in all three: a Rayleigh-Ritz compression floor lam1_ritz = 1/eta - m is an UPPER ' +
    'bound on the true lambda_1 by construction, so no finite Ritz computation -- however ' +
    'large or stable the floor -- certifies operator positivity on its own. imp-96938 shows ' +
    'this concretely: the drift pattern at the certified-positive 2a=0.96 endpoint is ' +
    'identical in direction to the drift at the open 2a=ln3 endpoint; only the margin ' +
    'differs, and margin size is not itself a certificate. Certifying positivity needs a ' +
    'genuine lower-bound method (Temple/Kato-Temple, de Branges coercivity, or the separate ' +
    'interval-rigorous Toeplitz/Krein LP certificate). Establishes nothing; instantiates no ' +
    'interval; moves no bound; NO QED. No refereed bound is changed.',
  citation:
    'imp-96934 (Bessel onset-mass tail residual, Rayleigh floor UPPER bound caveat); ' +
    'imp-96938 (drift-direction calibration against the certified 2a=0.96 endpoint); ' +
    'imp-97012 (cell-local kmax=5 verify run, re-verification-needed caveat).',
});

export default IMP97042_KREIN_RITZ_UPPER_BOUND_NOT_LOWER_GLOSSARY_HEADWORD;

// -- Tripwire assertions ------------------------------------------------------
export const IMP97042_KREIN_RITZ_UPPER_BOUND_NOT_LOWER_GLOSSARY_HEADWORD_ASSERTIONS = [
  {
    id: 'imp97042-headword-names-upper-bound-and-sources',
    why: 'The headword must state the UPPER-bound direction explicitly and cite all three ' +
      'source modules it consolidates -- the entire point of the glossary entry.',
    holds: () => {
      const h = IMP97042_KREIN_RITZ_UPPER_BOUND_NOT_LOWER_GLOSSARY_HEADWORD.headword;
      return (
        /UPPER bound/.test(h.term) &&
        /lam1_ritz >= lambda_1/.test(h.definition) &&
        /2a=0\.96/.test(h.mechanism) &&
        /2a=ln3/.test(h.mechanism)
      );
    },
  },
  {
    id: 'imp97042-honesty-gate-no-qed',
    why: 'Documentation only: no bound claimed moved, no QED, no-refereed-bound-change line present.',
    holds: () =>
      IMP97042_KREIN_RITZ_UPPER_BOUND_NOT_LOWER_GLOSSARY_HEADWORD.anyBoundMoved === false &&
      /NO QED/.test(IMP97042_KREIN_RITZ_UPPER_BOUND_NOT_LOWER_GLOSSARY_HEADWORD.verdict) &&
      /refereed bound is changed/i.test(IMP97042_KREIN_RITZ_UPPER_BOUND_NOT_LOWER_GLOSSARY_HEADWORD.verdict) &&
      IMP97042_KREIN_RITZ_UPPER_BOUND_NOT_LOWER_GLOSSARY_HEADWORD.glosses ===
        'imp-96934,imp-96938,imp-97012',
  },
];

for (const assertion of IMP97042_KREIN_RITZ_UPPER_BOUND_NOT_LOWER_GLOSSARY_HEADWORD_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(
      `imp-97042-krein-ritz-upper-bound-not-lower-glossary-headword assertion failed: ${assertion.id}`,
    );
  }
}
