/**
 * @module imp-96602-lammin-verified-cholesky-cert-limit-glossary-headword
 * @fileoverview imp-96602 -- import-light Concepts glossary headword restating the
 *   imp-96563 verdict: the Route M Vasyunin Gram lam_min(N) admits a per-rung
 *   RIGOROUS lower bound via verified Cholesky (Higham/Rump backward error), but
 *   double-precision verified Cholesky itself expires at N ~ 1.08e5 -- comfortably
 *   above the imp-96352 compute ceiling (~9916) but ~240x BELOW the imp-96548
 *   conditioning ceiling (~2.59e7).
 *
 *   WHY A GLOSSARY HEADWORD (not a re-derivation)
 *   -----------------------------------------------
 *   imp-96563 is a dense assessment module with three findings. This headword bakes
 *   only the two certified numbers a reader needs at a glance -- the double-precision
 *   certification limit N ~ 1.08e5, and its ~240x gap below the conditioning ceiling --
 *   verbatim (no re-import of imp-96563, to stay import-light).
 *
 *   THE HEADWORD
 *   -----------------------------------------------
 *   For any fixed accessible N, a completed floating-point Cholesky of G_N - s I
 *   certifies lam_min(G_N) >= s rigorously (Higham/Rump backward-error bound), with
 *   rounding shift delta(N) = g_{n+1} I(1,1) H_N. Because delta(N) grows like
 *   n u log n while the measured lam_min decays like A N^-p (A=0.8187, p=1.9179), the
 *   two curves cross at N ~ 1.08e5: below that, double-precision verified Cholesky
 *   certifies lam_min(N) > 0; above it, the rounding shift swamps the measured value.
 *   That certification limit sits comfortably above the imp-96352 compute-reachable
 *   ceiling N ~ 9916 (so the "compute binds first" verdict is rigorous end-to-end
 *   over the whole reachable range) but ~240x BELOW the imp-96548 conditioning
 *   ceiling N ~ 2.59e7 (so the ceiling FIGURE itself stays fit-extrapolated, not
 *   certified).
 *
 *   STATUS: a re-analysis/assessment (verified linear algebra applied to existing
 *   measured numbers), not a new rigorous asymptotic lower bound on lam_min.
 *
 *   WHAT THIS IS AND IS NOT
 *   ------------------------
 *   A glossary-style lookup restating the imp-96563 verdict for quick reference. It
 *   establishes nothing, instantiates no interval, closes no sub-gap, moves no bound.
 *   NO QED. No refereed bound is changed.
 *
 * @see imp-96563-route-m-lammin-rigorous-lower-bound-assessment (source: the assessment this glosses)
 * @see imp-96548-route-m-lammax-rigorous-upper-bound-assessment (the conditioning ceiling ~2.59e7)
 * @see imp-96352-route-m-vasyunin-solve-cost-model (the compute ceiling ~9916)
 * @see imp-96428-route-m-vasyunin-lammin-conditioning-ceiling (the A N^-p fit, A=0.8187, p=1.9179)
 *
 * Ticket: imp-96602 (content, low). Documentation only; establishes nothing; NO QED;
 * no refereed bound is changed.
 */

// The certification-limit headword, baked verbatim (no re-import).
const LAMMIN_CHOLESKY_CERT_LIMIT_HEADWORD = Object.freeze({
  key: 'lammin-verified-cholesky-certification-limit-vs-conditioning-ceiling',
  term:
    'imp-96563 verdict: per-rung verified-Cholesky (Rump/Higham) certifies Route M ' +
    'lam_min(N) rigorously, but only up to N ~ 1.08e5 in double precision -- ~240x ' +
    'below the imp-96548 conditioning ceiling ~2.59e7',
  definition:
    'A completed floating-point Cholesky factorization of G_N - s I certifies ' +
    'lam_min(G_N) >= s rigorously, via the classical Higham/Rump backward-error ' +
    'bound on the rounding perturbation. This converts the measured lam_min rungs ' +
    '(imp-96105 / imp-96325) into rigorous lower enclosures at every accessible N. ' +
    'But the rounding shift delta(N) = g_{n+1} I(1,1) H_N GROWS with N while the ' +
    'measured lam_min DECAYS like A N^-1.9179, so double-precision verified Cholesky ' +
    'can only certify lam_min(N) > 0 up to the crossover N ~ 1.08e5 -- comfortably ' +
    'above the imp-96352 compute-reachable ceiling (~9916, so the operative ' +
    '"compute binds first" verdict is rigorous end-to-end) but ~240x BELOW the ' +
    'imp-96548 conditioning ceiling (~2.59e7, so that specific ceiling FIGURE stays ' +
    'fit-extrapolated, not certified).',
  mechanism:
    'delta(N) = g_{n+1} I(1,1) H_N with g_{n+1} = (n+1)u/(1-(n+1)u), u = eps/2, grows ' +
    'like n u log n (rounding accumulates with matrix size); the measured lam_min(N) ' +
    'decays like A N^-p (A=0.8187, p=1.9179, imp-96428 fit). The two curves cross at ' +
    'N ~ 1.08e5: below the crossover the rounding shift is negligible relative to ' +
    'lam_min (< 8e-4 at N=1e4) and certification succeeds; above it the shift ' +
    'exceeds lam_min and double-precision verified Cholesky can no longer certify ' +
    'positivity. Certifying the conditioning ceiling itself (N ~ 2.59e7 / 4.11e7) ' +
    'would need extended-precision (double-double) verified Cholesky at that scale, ' +
    'or an independent rigorous asymptotic lower bound on lam_min -- neither ' +
    'available.',
  verificationStatus:
    'Re-analysis (verified linear algebra applied to existing measurements), not a ' +
    'new rigorous asymptotic lower bound. Changes no bound; no refereed bound is changed; ' +
    'RH open; NO QED.',
});

export const IMP96602_LAMMIN_CHOLESKY_CERT_LIMIT_GLOSSARY_HEADWORD = Object.freeze({
  id: 'imp-96602',
  proofSection: 'Route M',
  glosses: 'imp-96563',
  question:
    'imp-96563 assessed whether the Route M Vasyunin Gram lam_min(N) admits a ' +
    'rigorous lower bound. What is the headline number a reader needs -- how far ' +
    'does double-precision verified Cholesky reach, relative to the compute and ' +
    'conditioning ceilings?',
  headword: LAMMIN_CHOLESKY_CERT_LIMIT_HEADWORD,
  anyBoundMoved: false,
  verdict:
    'GLOSSARY HEADWORD ONLY (documentation, not a proof). Restates the imp-96563 ' +
    'verdict: verified positive-definiteness (Higham/Rump Cholesky backward error) ' +
    'certifies lam_min(G_N) rigorously at each accessible rung, but double-precision ' +
    'certification itself expires at N ~ 1.08e5 -- above the imp-96352 compute ' +
    'ceiling (~9916, operative verdict safe) but ~240x below the imp-96548 ' +
    'conditioning ceiling (~2.59e7, ceiling figure not certifiable in double ' +
    'precision). Establishes nothing; instantiates no interval; moves no bound; ' +
    'NO QED. No refereed bound is changed.',
  citation:
    'imp-96563 (the assessment and finding this glosses); imp-96548 (rigorous ' +
    'lam_max / conditioning ceiling ~2.59e7); imp-96352 (compute ceiling ~9916); ' +
    'imp-96428 (the A N^-p lam_min fit).',
});

export default IMP96602_LAMMIN_CHOLESKY_CERT_LIMIT_GLOSSARY_HEADWORD;

// -- Tripwire assertions ------------------------------------------------------
export const IMP96602_LAMMIN_CHOLESKY_CERT_LIMIT_GLOSSARY_HEADWORD_ASSERTIONS = [
  {
    id: 'imp96602-headword-has-required-fields',
    why: 'The headword must name the certification-limit N, the compute ceiling, and ' +
      'the conditioning ceiling with the ~240x gap -- the entire point of the ' +
      'glossary entry.',
    holds: () => {
      const h = IMP96602_LAMMIN_CHOLESKY_CERT_LIMIT_GLOSSARY_HEADWORD.headword;
      return (
        /1\.08e5/.test(h.definition) &&
        /9916/.test(h.definition) &&
        /2\.59e7/.test(h.definition) &&
        /240x/.test(h.definition) &&
        /1\.9179/.test(h.mechanism)
      );
    },
  },
  {
    id: 'imp96602-honesty-gate-no-qed',
    why: 'Documentation only: no bound claimed moved, no QED, no-refereed-bound-change line present.',
    holds: () =>
      IMP96602_LAMMIN_CHOLESKY_CERT_LIMIT_GLOSSARY_HEADWORD.anyBoundMoved === false &&
      /NO QED/.test(IMP96602_LAMMIN_CHOLESKY_CERT_LIMIT_GLOSSARY_HEADWORD.verdict) &&
      /refereed bound is changed/i.test(IMP96602_LAMMIN_CHOLESKY_CERT_LIMIT_GLOSSARY_HEADWORD.verdict) &&
      IMP96602_LAMMIN_CHOLESKY_CERT_LIMIT_GLOSSARY_HEADWORD.glosses === 'imp-96563',
  },
];

for (const assertion of IMP96602_LAMMIN_CHOLESKY_CERT_LIMIT_GLOSSARY_HEADWORD_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(
      `imp-96602-lammin-verified-cholesky-cert-limit-glossary-headword assertion failed: ${assertion.id}`,
    );
  }
}
