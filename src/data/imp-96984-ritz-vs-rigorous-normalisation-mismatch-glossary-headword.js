/**
 * @module imp-96984-ritz-vs-rigorous-normalisation-mismatch-glossary-headword
 * @fileoverview imp-96984 -- import-light glossary/Concepts headword recording the imp-96958
 *   finding: the apparent Ritz-below-rigorous inversion at 2a=0.96 is a basis/normalisation/shift
 *   mismatch between two independent estimators, NOT a certification failure.
 *
 *   WHY A GLOSSARY HEADWORD (not a re-derivation)
 *   -----------------------------------------------
 *   imp-96958 cross-validated the imp-96938 Ritz UPPER estimate of lambda_1(T_{0.48}[sigma_2])
 *   against the interval-rigorous Toeplitz/Krein certificate's lambda_min(T_a[sigma_2]) at the
 *   certified-positive endpoint 2a=0.96. A textbook check expects Ritz-UPPER >= true >=
 *   rigorous-LOWER, but the finest Ritz upper estimate (12.0089) sits slightly BELOW the
 *   log-interpolated rigorous lower bracket (~17.09) -- an apparent inversion. This headword
 *   bakes that finding verbatim (no re-import of the imp-96958 module, to stay import-light) so
 *   a reader does not mistake the surface inversion for a bug in either estimator or a threat to
 *   the certified positivity at 2a=0.96.
 *
 *   THE HEADWORD
 *   -----------------------------------------------
 *   (a) THE APPARENT INVERSION. imp-96938's Ritz floor band at 2a=0.96 is
 *   [12.0089, 21.0155] (min at Nbig=240/T=800, the most adverse cell). The certificate has no
 *   tabulated rung exactly at a=0.48; it is flanked by a=0.45 (56.05) and a=0.50 (7.743), and a
 *   log-linear interpolation gives ~17.09 as the rigorous lower-bound estimate at a=0.48. Because
 *   12.0089 < 17.09, the finest Ritz UPPER estimate sits below the interpolated rigorous LOWER
 *   estimate -- the reverse of the textbook Ritz-upper >= true >= rigorous-lower ordering.
 *   (b) WHY IT IS A NORMALISATION MISMATCH, NOT A FAILURE. The two estimators do not target the
 *   identically-normalised eigenvalue: imp-96938 uses shift-invert compression (shift m=1, trial
 *   N=16, auxiliary Nbig 24..240, cutoff T=800/3200), while the certificate uses an
 *   (a^2-x^2)^3 P_n basis, ||g||^2-normalised, with the positive tail dropped. Different
 *   discretisations, bases, mass normalisations and shifts are not expected to bracket to the
 *   digit. Both estimators independently place lambda_1(T_{0.48}[sigma_2]) firmly in the order-10
 *   positive band -- the full Ritz band [12.0089, 21.0155] lies entirely inside the rigorous
 *   flanking bracket (7.743, 56.05) -- an order of magnitude above zero and ~22x the binding
 *   2a=(ln3)/2 margin (0.5521).
 *   (c) STATUS: an open sub-gap (no matched-normalisation solve at a=0.48 in a single common
 *   basis exists yet to pin the exact gap), not a certification failure. The certificate's
 *   interval-rigorous reach stays 2a<=0.96; operator positivity for 0.96 < 2a < ln3 stays OPEN.
 *
 *   STATUS: documentation only -- a naming/bookkeeping note recording why a surface Ritz-below-
 *   rigorous inversion is a normalisation artefact rather than a threat to the certified 2a=0.96
 *   positivity. Not a proof, not a new bound, not a resolution of the exact Ritz-vs-rigorous gap.
 *   NO QED.
 *
 * @see imp-96958-krein-096-ritz-vs-rigorous-crossval.js (source finding: Findings 1-3, the
 *   IMP96958_VERDICT.subGap field this glosses)
 * @see imp-96938-krein-drift-calibration-096.js (the Ritz floor band at 2a=0.96)
 * @see rh-route-i-toeplitz-krein-certificate-2026-09-24.js (TOEPLITZ_KREIN_LITERALS.lambdaMinSigma2;
 *   interval-rigorous reach 2a <= 0.96)
 *
 * Ticket: imp-96984 (content, low, sonnet-4-6). Documentation only; establishes nothing; NO QED;
 * no refereed bound is changed.
 */

// The Ritz-vs-rigorous normalisation-mismatch headword, baked verbatim (no re-import).
const RITZ_VS_RIGOROUS_NORMALISATION_MISMATCH_HEADWORD = Object.freeze({
  key: 'ritz-vs-rigorous-normalisation-mismatch-imp96958-2a096',
  term:
    'imp-96958 found that at the certified-positive endpoint 2a=0.96, the finest imp-96938 Ritz ' +
    'UPPER estimate (12.0089) sits slightly BELOW the log-interpolated interval-rigorous ' +
    'certificate LOWER estimate (~17.09) -- an apparent Ritz-upper >= true >= rigorous-lower ' +
    'inversion that is a basis/normalisation/shift mismatch between the two estimators, not a ' +
    'certification failure',
  definition:
    'imp-96938s Ritz floor band at 2a=0.96 (a=0.48) is [12.0089, 21.0155] (shift-invert ' +
    'compression, shift m=1, trial N=16, auxiliary Nbig 24..240, cutoff T=800). The certificate ' +
    'has no tabulated rung at a=0.48 -- it is flanked by a=0.45 (56.05) and a=0.50 (7.743), ' +
    'log-linearly interpolating to ~17.09 ((a^2-x^2)^3 P_n basis, ||g||^2-normalised, positive ' +
    'tail dropped => a LOWER bound). Since 12.0089 < 17.09, the finest Ritz upper sits below the ' +
    'interpolated rigorous lower -- the reverse of the textbook bracket ordering.',
  mechanism:
    'A basis/normalisation/shift mismatch, not a certification failure: the two estimators do ' +
    'not target the identically-normalised eigenvalue: different bases, ' +
    'discretisations, mass normalisations and shifts (shift-invert compression vs an ' +
    '(a^2-x^2)^3 P_n Rayleigh floor) are not expected to bracket to the digit. Both estimators ' +
    'still independently place lambda_1(T_{0.48}[sigma_2]) in the same order-10 positive band -- ' +
    'the full Ritz band [12.0089, 21.0155] lies entirely inside the rigorous flanking bracket ' +
    '(7.743, 56.05), ~22x the binding 2a=(ln3)/2 margin (0.5521) -- so the inversion is confined ' +
    'to the strict digit-level ordering, not the order-of-magnitude agreement.',
  verificationStatus:
    'Re-cited from the imp-96958 IMP96958_VERDICT.subGap field ' +
    '(src/data/imp-96958-krein-096-ritz-vs-rigorous-crossval.js), which itself cites the ' +
    'imp-96938 Ritz table and the rh-route-i-toeplitz-krein-certificate-2026-09-24 rungs ' +
    'verbatim. Naming / bookkeeping headword only; resolves no new interval; establishes no ' +
    'operator or zero-side result; does not pin the exact Ritz-vs-rigorous gap; certificate ' +
    'interval-rigorous reach stays 2a<=0.96; operator positivity for 0.96 < 2a < ln3 stays OPEN; ' +
    'RH open; no refereed bound is changed; NO QED.',
});

export const IMP96984_RITZ_VS_RIGOROUS_NORMALISATION_MISMATCH_GLOSSARY_HEADWORD = Object.freeze({
  id: 'imp-96984',
  proofSection: 'Route I',
  glosses: 'imp-96958',
  question:
    'imp-96958 found the finest Ritz upper estimate (12.0089) at 2a=0.96 sits below the ' +
    'interpolated rigorous lower estimate (~17.09) -- is this a certification failure, and does ' +
    'it threaten the certified positivity at 2a=0.96?',
  headword: RITZ_VS_RIGOROUS_NORMALISATION_MISMATCH_HEADWORD,
  anyBoundMoved: false,
  verdict:
    'GLOSSARY HEADWORD ONLY (documentation, not a proof). Records the imp-96958 finding that the ' +
    'apparent Ritz-below-rigorous inversion at 2a=0.96 (Ritz upper 12.0089 vs interpolated ' +
    'rigorous lower ~17.09) is a basis/normalisation/shift mismatch between two independently ' +
    'discretised estimators, not a certification failure -- both estimators place lambda_1 in ' +
    'the same order-10 positive band, ~22x the binding 2a=(ln3)/2 margin. No bound moved; the ' +
    'exact Ritz-vs-rigorous gap (which needs a matched-normalisation solve at a=0.48 in a single ' +
    'common basis) remains open; NO QED. No refereed bound is changed.',
  citation:
    'imp-96958 (the IMP96958_VERDICT.subGap field this glosses); imp-96938 (Ritz floor band at ' +
    '2a=0.96); rh-route-i-toeplitz-krein-certificate-2026-09-24 (rigorous flanking rungs).',
});

export default IMP96984_RITZ_VS_RIGOROUS_NORMALISATION_MISMATCH_GLOSSARY_HEADWORD;

// -- Tripwire assertions ------------------------------------------------------
export const IMP96984_RITZ_VS_RIGOROUS_NORMALISATION_MISMATCH_GLOSSARY_HEADWORD_ASSERTIONS = [
  {
    id: 'imp96984-headword-cites-both-estimates-and-ratio',
    why: 'The headword must name both the Ritz upper estimate and the interpolated rigorous ' +
      'lower estimate and state the inversion direction -- the entire point of the glossary entry.',
    holds: () => {
      const h = IMP96984_RITZ_VS_RIGOROUS_NORMALISATION_MISMATCH_GLOSSARY_HEADWORD.headword;
      return (
        /12\.0089/.test(h.definition) &&
        /17\.09/.test(h.definition) &&
        /mismatch/i.test(h.mechanism) &&
        /order-10 positive band|order of magnitude/i.test(h.mechanism)
      );
    },
  },
  {
    id: 'imp96984-honesty-gate-no-qed',
    why: 'Documentation only: no bound claimed moved, exact gap left open, no QED, no-refereed-bound-change line ' +
      'present.',
    holds: () =>
      IMP96984_RITZ_VS_RIGOROUS_NORMALISATION_MISMATCH_GLOSSARY_HEADWORD.anyBoundMoved === false &&
      /NO QED/.test(IMP96984_RITZ_VS_RIGOROUS_NORMALISATION_MISMATCH_GLOSSARY_HEADWORD.verdict) &&
      /refereed bound is changed/i.test(IMP96984_RITZ_VS_RIGOROUS_NORMALISATION_MISMATCH_GLOSSARY_HEADWORD.verdict) &&
      /remains open/.test(IMP96984_RITZ_VS_RIGOROUS_NORMALISATION_MISMATCH_GLOSSARY_HEADWORD.verdict) &&
      IMP96984_RITZ_VS_RIGOROUS_NORMALISATION_MISMATCH_GLOSSARY_HEADWORD.glosses === 'imp-96958',
  },
];

for (const assertion of IMP96984_RITZ_VS_RIGOROUS_NORMALISATION_MISMATCH_GLOSSARY_HEADWORD_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(
      `imp-96984-ritz-vs-rigorous-normalisation-mismatch-glossary-headword assertion failed: ${assertion.id}`,
    );
  }
}
