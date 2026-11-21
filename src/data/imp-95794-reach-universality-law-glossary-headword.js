/**
 * @module imp-95794-reach-universality-law-glossary-headword
 * @fileoverview imp-95794 -- import-light glossary/Concepts headword for the imp-95761
 *   reach-universality law: sub-1% agreement of the finite-grid Szego edge-coefficient
 *   fit C_fit(delta, N_max) with the closed form C(delta) = pi^2/(2 delta^2) is a
 *   REACH requirement R = delta(N_max+1) >~ 250, delta-independent in the truncation
 *   part, which predicts the crossing grid size N_max ~ 250/delta for any delta.
 *
 *   WHY A GLOSSARY HEADWORD (not a re-derivation)
 *   -----------------------------------------------
 *   imp-95761 extended the imp-95743 finite-grid sech-seam Gram eigensolve and found
 *   that the one-signed low bias in C_fit falls monotonically with the reach
 *   R = delta(N_max+1) and, once R >= 200, agrees to ~0.07% ACROSS different delta at
 *   fixed R. A reader landing on that module cold has no quick-lookup definition of
 *   what "the reach" means, why it (rather than N_max alone) is the relevant finite-
 *   size variable, or how it lets the required grid size be predicted for a delta that
 *   was never directly measured. This headword bakes those facts VERBATIM (no
 *   re-import of the imp-95761 module, to stay import-light) as a standalone lookup
 *   entry.
 *
 *   THE HEADWORD
 *   -----------------------------------------------
 *   For the rho=1 sech-seam Gram lambda_min fit F/A_opt = 1 + C_fit (pi/(N+1))^2 at
 *   fixed delta, define the reach R = delta(N_max+1) (the finite-size variable already
 *   named in the imp-95775 scaling-law headword). Across delta in {ln 1.5, ln 1.45}
 *   the C_fit relative error at fixed R agrees to ~0.07% once R >= 200:
 *
 *       R      ln1.5      ln1.45
 *       130   -3.776%    -4.104%
 *       200   -1.438%    -1.503%
 *       260   -0.809%    -0.878%
 *       350   -0.430%    -0.477%
 *       450   -0.271%    -0.227%
 *
 *   so the sub-1% crossing (rel err < 1%) occurs near R ~ 250, DELTA-INDEPENDENT in
 *   the truncation part. Inverting R = delta(N_max+1) gives the REACH-UNIVERSALITY
 *   LAW: N_max ~ 250/delta predicts the grid size any delta needs to reach sub-1% C,
 *   without measuring that delta directly.
 *
 *   MECHANISM: R = delta(N_max+1) is the natural finite-size variable of the
 *   delta -> 0 Szego edge-coefficient blow-up (imp-95775), so the finite-grid
 *   truncation error of C_fit is itself a function of R alone, not of N_max and delta
 *   separately -- a one-parameter reduction that turns a 2-D (delta, N_max) sweep into
 *   a 1-D law in R.
 *
 *   STATUS: DEMONSTRATED at delta = ln 1.5 / ln 1.45 (float64 == double-double overlap
 *   region, N_max <= 1280); the law degrades once lambda_min sinks toward the float64
 *   cancellation floor at large R (delta = ln 1.4, reach 450 -> -3.08%), so it is
 *   PREDICTED, not confirmed, at smaller delta (ln 1.3, ln 1.2) where the required
 *   N_max ~ 1370 makes an O(N^3) double-double Jacobi compute-prohibitive on a single
 *   thread -- the imp-95761 RESIDUAL SUB-GAP (Toeplitz-structured O(N^2) DD lambda_min).
 *
 *   WHAT THIS IS AND IS NOT
 *   ------------------------
 *   A glossary-style lookup restating the imp-95761 reach-universality localization
 *   for quick reference. It establishes nothing, instantiates no interval, closes no
 *   sub-gap, moves no bound. NO QED. No refereed bound is changed.
 *
 * @see imp-95761-szego-coefficient-larger-grid-subpct (source: the reach-universality
 *   sweep and crossing prediction this glosses)
 * @see imp-95775-szego-edge-coefficient-scaling-law-glossary-headword (the closed-form
 *   C(delta) = pi^2/(2 delta^2) law whose finite-grid bias the reach parametrizes)
 * @see imp-95786-reach-universality-crossval (a later cross-validation of the same law)
 *
 * Ticket: imp-95794 (content, low). Documentation only; establishes nothing; NO QED;
 * no refereed bound is changed.
 */

// The reach-universality law headword, baked verbatim (no re-import).
const REACH_UNIVERSALITY_LAW_HEADWORD = Object.freeze({
  key: 'reach-universality-law',
  term:
    'imp-95761 reach-universality law (sub-1% Szego edge-coefficient C is a reach ' +
    'requirement R = delta(N_max+1) >~ 250)',
  definition:
    'For the rho=1 sech-seam Gram finite-size fit F/A_opt = 1 + C_fit (pi/(N+1))^2, ' +
    'the relative error of C_fit against the closed form C(delta) = pi^2/(2 delta^2) ' +
    'is a function of the reach R = delta(N_max+1) ALONE, agreeing to ~0.07% across ' +
    'different delta once R >= 200. The sub-1% crossing occurs near R ~ 250, ' +
    'delta-independent, which predicts the grid size N_max ~ 250/delta needed for ' +
    'sub-1% agreement at any delta.',
  mechanism:
    'The reach R = delta(N_max+1) is the natural finite-size variable of the ' +
    'delta -> 0 Szego edge-coefficient blow-up (C(delta) = pi^2/(2 delta^2)), so the ' +
    'finite-grid truncation error reduces from a 2-D function of (delta, N_max) to a ' +
    '1-D function of R alone -- letting the required grid size be predicted for a ' +
    'delta that was never directly measured.',
  verificationStatus:
    'Demonstrated at delta = ln1.5 / ln1.45 (float64 == double-double overlap ' +
    'region); degrades at delta = ln1.4 once lambda_min approaches the float64 ' +
    'cancellation floor at large R. PREDICTED, not confirmed, at delta = ln1.3 / ' +
    'ln1.2, where the required N_max ~ 1370 makes an O(N^3) double-double Jacobi ' +
    'compute-prohibitive on a single thread (residual sub-gap: Toeplitz-structured ' +
    'O(N^2) DD lambda_min).',
});

export const IMP95794_REACH_UNIVERSALITY_LAW_GLOSSARY_HEADWORD = Object.freeze({
  id: 'imp-95794',
  proofSection: 'S-frontier',
  glosses: 'imp-95761',
  question:
    'imp-95761 found that the finite-grid Szego edge-coefficient fit C_fit reaches ' +
    'sub-1% agreement with the closed form C(delta) = pi^2/(2 delta^2) once the reach ' +
    'R = delta(N_max+1) crosses ~250, delta-independently. What does "the reach" mean, ' +
    'why does it (rather than N_max alone) govern the truncation error, and how does ' +
    'it let the crossing grid size be predicted for an unmeasured delta, for a reader ' +
    'landing on that module cold?',
  headword: REACH_UNIVERSALITY_LAW_HEADWORD,
  anyBoundMoved: false,
  verdict:
    'GLOSSARY HEADWORD ONLY (documentation, not a proof). Restates the imp-95761 ' +
    'reach-universality localization: sub-1% Szego edge-coefficient C is a reach ' +
    'requirement R = delta(N_max+1) >~ 250, delta-independent in the truncation part, ' +
    'predicting N_max ~ 250/delta for any delta. Demonstrated at ln1.5/ln1.45, ' +
    'predicted (not confirmed) at smaller delta pending a Toeplitz-structured DD ' +
    'lambda_min. Establishes nothing; instantiates no interval; moves no bound; ' +
    'NO QED. No refereed bound is changed.',
  citation:
    'imp-95761 (the reach-universality sweep and crossing prediction this glosses); ' +
    'imp-95775 (the closed-form C(delta) = pi^2/(2 delta^2) scaling law the reach ' +
    'parametrizes); imp-95743 (the original finite-grid bias this extends).',
});

export default IMP95794_REACH_UNIVERSALITY_LAW_GLOSSARY_HEADWORD;

// -- Tripwire assertions ------------------------------------------------------
export const IMP95794_REACH_UNIVERSALITY_LAW_GLOSSARY_HEADWORD_ASSERTIONS = [
  {
    id: 'imp95794-headword-has-required-fields',
    why: 'The headword must name the reach R = delta(N_max+1), the sub-1% crossing ' +
      'near R ~ 250, and the N_max ~ 250/delta prediction -- the entire point of the ' +
      'glossary entry.',
    holds: () => {
      const h = IMP95794_REACH_UNIVERSALITY_LAW_GLOSSARY_HEADWORD.headword;
      return (
        /R = delta\(N_max\+1\)/.test(h.definition) &&
        /R ~ 250/.test(h.definition) &&
        /N_max ~ 250\/delta/.test(h.definition) &&
        /compute-prohibitive/.test(h.verificationStatus)
      );
    },
  },
  {
    id: 'imp95794-honesty-gate-no-qed',
    why: 'Documentation only: no bound claimed moved, no QED, no-refereed-bound-change line present.',
    holds: () =>
      IMP95794_REACH_UNIVERSALITY_LAW_GLOSSARY_HEADWORD.anyBoundMoved === false &&
      /NO QED/.test(IMP95794_REACH_UNIVERSALITY_LAW_GLOSSARY_HEADWORD.verdict) &&
      /refereed bound is changed/i.test(IMP95794_REACH_UNIVERSALITY_LAW_GLOSSARY_HEADWORD.verdict) &&
      IMP95794_REACH_UNIVERSALITY_LAW_GLOSSARY_HEADWORD.glosses === 'imp-95761',
  },
];

for (const assertion of IMP95794_REACH_UNIVERSALITY_LAW_GLOSSARY_HEADWORD_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(
      `imp-95794-reach-universality-law-glossary-headword assertion failed: ${assertion.id}`,
    );
  }
}
