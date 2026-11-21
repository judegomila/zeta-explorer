/**
 * @module imp-96556-route-i-ds-le-ls-certificate-precision-glossary-headword
 * @fileoverview imp-96556 -- import-light glossary/Concepts headword recording the
 *   verification status of the Route I D_S <= L_S full-symbol certificate
 *   (rh-route-i-uncertainty-concentration-certificate-2026-09-24): the inequality
 *   W(h) = Arch(h) - P_2(h) >= 9.04e-4 ||h||^2 on every real pole-free h in L^2(-a,a)
 *   for every a <= (ln 3)/2 is established at COMPUTER-ASSISTED IEEE DOUBLE PRECISION,
 *   NOT interval arithmetic.
 *
 *   WHY A GLOSSARY HEADWORD (not a re-derivation)
 *   -----------------------------------------------
 *   The certificate module already proves this: a floor lemma (2theta' - m_2
 *   majorant beyond T) plus a Galerkin (Rayleigh-Ritz) lower bound on [-T,T] plus an
 *   explicit Bernstein-ellipse tail bound, evaluated in double-precision GL quadrature
 *   and Jacobi eigensolvers, checked for stability across four (T, N) resolution
 *   settings. That is a strong, resolution-checked numerical certificate -- but it is
 *   not a rigorous interval-arithmetic enclosure, and imp-96544 (pending, opus-4-8) is
 *   the open ticket to port it to one. A reader who sees only "CERTIFIED" and the
 *   constant 9.04e-4 can mistake the current status for an interval-verified bound;
 *   this headword names the distinction.
 *
 *   THE HEADWORD
 *   -----------------------------------------------
 *   RESULT: D_S <= L_S (equivalently W(h) = Arch(h) - P_2(h) >= 0) on pole-free h in
 *   L^2(-a,a), for every a <= (ln 3)/2, i.e. every 2a <= ln 3, with explicit constant
 *   m = 9.04e-4 in W(h) >= m ||h||^2 (T = 400, N = 320; 8.20e-4 at the coarser T = 200,
 *   N = 160 setting; the two resolutions agree to the printed digits and both exceed
 *   zero).
 *   VERIFICATION LEVEL: double-precision (IEEE 754) computation -- Gauss-Legendre
 *   quadrature of analytic integrands, Jacobi-matrix eigenvalues for the Galerkin
 *   block, an explicit analytic Bernstein-ellipse tail bound -- cross-checked by
 *   resolution changes (N-invariant to 7 digits, quadrature-invariant to 10), NOT an
 *   interval-arithmetic enclosure. No rounding-error propagation bound is carried
 *   through the eigenvalue solve or the quadrature nodes/weights themselves.
 *   OPEN FOLLOW-ON: imp-96544 is the pending ticket to re-verify this same constant
 *   (9.04e-4, pole-free h, 2a <= ln 3) with interval arithmetic, replacing the
 *   double-only computation with a rigorous enclosure.
 *
 *   STATUS: a verification-status headword restating what the certificate module
 *   already says about its own rigor level, not a fresh derivation or re-verification.
 *
 *   WHAT THIS IS AND IS NOT
 *   ------------------------
 *   A glossary-style lookup naming the precision level of an existing certificate for
 *   quick reference. It establishes nothing new, instantiates no interval, closes no
 *   sub-gap, moves no bound. NO QED. No refereed bound is changed.
 *
 * @see rh-route-i-uncertainty-concentration-certificate-2026-09-24 (source: the D_S <= L_S, 9.04e-4 certificate this glosses)
 * @see imp-96544 (the pending interval-arithmetic port of this same certificate)
 * @see rh-route-i-direct-sonine-trace-certificate-2026-09-24 (sibling module, same honest-limits framing)
 *
 * Ticket: imp-96556 (content, medium). Documentation only; establishes nothing; NO QED;
 * no refereed bound is changed.
 */

// The D_S <= L_S certificate precision headword, baked verbatim (no re-import of the
// rh-route-i-uncertainty-concentration-certificate-2026-09-24 module, to stay import-light).
const DS_LE_LS_CERTIFICATE_PRECISION_HEADWORD = Object.freeze({
  key: 'route-i-ds-le-ls-certificate-precision',
  term:
    'The verification level of the Route I D_S <= L_S full-symbol certificate '
    + '(constant 9.04e-4, pole-free h, every 2a <= ln 3)',
  definition:
    'The rh-route-i-uncertainty-concentration-certificate-2026-09-24 module proves '
    + 'W(h) = Arch(h) - P_2(h) >= 9.04e-4 ||h||^2 for every real pole-free h in '
    + 'L^2(-a,a) and every a <= (ln 3)/2 (T = 400, N = 320, with 8.20e-4 at the coarser '
    + 'T = 200, N = 160 setting). This is a COMPUTER-ASSISTED, IEEE-DOUBLE-PRECISION '
    + 'result -- Gauss-Legendre quadrature, Jacobi-eigenvalue Galerkin bounds, and an '
    + 'explicit analytic tail bound, cross-checked across resolution settings -- NOT '
    + 'an interval-arithmetic enclosure.',
  mechanism:
    'The certificate combines a floor lemma majorant for the symbol beyond t = T, a '
    + 'Rayleigh-Ritz (Galerkin) lower bound for the truncated operator on [-T, T], and '
    + 'an explicit Bernstein-ellipse tail bound on the discretization error, all '
    + 'evaluated in double precision and checked for N-invariance to 7 digits and '
    + 'quadrature-invariance to 10 digits across four (T, N) settings. Resolution '
    + 'stability across settings is evidence of correctness but does not itself supply '
    + 'a rigorous rounding-error enclosure the way interval arithmetic would. imp-96544 '
    + 'is the open ticket to redo the same Galerkin lower bound and Bernstein tail in '
    + 'interval arithmetic so the 9.04e-4 margin becomes an enclosure rather than a '
    + 'double-precision computation.',
  intervalVerified: false,
  pendingIntervalPort: 'imp-96544',
  verificationStatus:
    'Verification-status classification headword (accuracy/honesty audit), not a '
    + 'rigorous re-derivation. Changes no bound; RH open; NO QED; no refereed bound is changed'
    + '.',
});

export const IMP96556_DS_LE_LS_CERTIFICATE_PRECISION_GLOSSARY_HEADWORD = Object.freeze({
  id: 'imp-96556',
  proofSection: 'S-frontier',
  glosses: 'rh-route-i-uncertainty-concentration-certificate-2026-09-24',
  question:
    'What is the verification level of the Route I claim that D_S <= L_S '
    + '(W(h) >= 9.04e-4 ||h||^2) holds on pole-free h in L^2(-a,a) for every 2a <= ln 3, '
    + 'and what would upgrade it?',
  headword: DS_LE_LS_CERTIFICATE_PRECISION_HEADWORD,
  anyBoundMoved: false,
  verdict:
    'GLOSSARY HEADWORD ONLY (documentation, not a proof). Names the verification '
    + 'level of the Route I D_S <= L_S certificate: the inequality W(h) = Arch(h) - '
    + 'P_2(h) >= 9.04e-4 ||h||^2 on pole-free h in L^2(-a,a), every 2a <= ln 3, is a '
    + 'COMPUTER-ASSISTED, IEEE-DOUBLE-PRECISION result (Gauss-Legendre quadrature, '
    + 'Jacobi-eigenvalue Galerkin bound, explicit Bernstein-ellipse tail, checked '
    + 'across four resolution settings), NOT interval-arithmetic-verified. imp-96544 '
    + 'is the pending ticket to port it to interval arithmetic. Establishes nothing '
    + 'new; instantiates no interval; moves no bound; NO QED. No refereed bound is changed'
    + '.',
  citation:
    'rh-route-i-uncertainty-concentration-certificate-2026-09-24 (proves the D_S <= '
    + 'L_S, 9.04e-4 certificate this glosses, and states its own double-precision, '
    + 'not-interval-verified honest-limits framing); imp-96544 (pending opus-4-8 '
    + 'ticket to port the same certificate to interval arithmetic); '
    + 'rh-route-i-direct-sonine-trace-certificate-2026-09-24 (sibling module citing '
    + 'the same 9.04e-4 margin with the same honest-limits framing).',
});

export default IMP96556_DS_LE_LS_CERTIFICATE_PRECISION_GLOSSARY_HEADWORD;

// -- Tripwire assertions ------------------------------------------------------
export const IMP96556_DS_LE_LS_CERTIFICATE_PRECISION_GLOSSARY_HEADWORD_ASSERTIONS = [
  {
    id: 'imp96556-headword-names-precision-and-constant',
    why: 'The headword must name the certified constant, the double-precision (not '
      + 'interval) verification level, and the pending interval-port ticket, or it '
      + 'fails to make the distinction it exists for.',
    holds: () => {
      const h = IMP96556_DS_LE_LS_CERTIFICATE_PRECISION_GLOSSARY_HEADWORD.headword;
      return (
        /9\.04e-4/.test(h.definition)
        && /IEEE-DOUBLE-PRECISION/.test(h.definition)
        && /NOT/.test(h.definition)
        && h.intervalVerified === false
        && h.pendingIntervalPort === 'imp-96544'
      );
    },
  },
  {
    id: 'imp96556-honesty-gate-no-qed',
    why: 'Documentation only: no bound claimed moved, no QED, no-refereed-bound-change line present.',
    holds: () =>
      IMP96556_DS_LE_LS_CERTIFICATE_PRECISION_GLOSSARY_HEADWORD.anyBoundMoved === false
      && /NO QED/.test(IMP96556_DS_LE_LS_CERTIFICATE_PRECISION_GLOSSARY_HEADWORD.verdict)
      && /refereed bound is changed/i.test(IMP96556_DS_LE_LS_CERTIFICATE_PRECISION_GLOSSARY_HEADWORD.verdict)
      && IMP96556_DS_LE_LS_CERTIFICATE_PRECISION_GLOSSARY_HEADWORD.glosses
        === 'rh-route-i-uncertainty-concentration-certificate-2026-09-24',
  },
];

for (const assertion of IMP96556_DS_LE_LS_CERTIFICATE_PRECISION_GLOSSARY_HEADWORD_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(
      `imp-96556-route-i-ds-le-ls-certificate-precision-glossary-headword assertion failed: ${assertion.id}`,
    );
  }
}
