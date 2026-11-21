/**
 * @module imp-95775-szego-edge-coefficient-scaling-law-glossary-headword
 * @fileoverview imp-95775 -- import-light glossary/Concepts headword for the imp-95704
 *   small-A_opt Szego edge-coefficient scaling law C(delta) = pi^2 / (2 delta^2): the
 *   leading small-delta coefficient of the rho=1 sech-seam Gram lambda_min expansion,
 *   cross-validated dual/float64/double-double.
 *
 *   WHY A GLOSSARY HEADWORD (not a re-derivation)
 *   -----------------------------------------------
 *   imp-95704 measured the imp-95689 finite-size Szego edge coefficient
 *   C = f''(pi) / (2 A_opt) across a delta grid and found it blows up like delta^{-2}
 *   as A_opt underflows toward zero. A reader landing on that module cold has no
 *   quick-lookup definition of the closed-form law itself, why the blow-up is benign,
 *   or what "small-A_opt" regime it governs. This headword bakes those facts VERBATIM
 *   (no re-import of the imp-95704 module, to stay import-light) as a standalone
 *   lookup entry.
 *
 *   THE HEADWORD
 *   -----------------------------------------------
 *   For the rho=1 sech-seam Toeplitz Gram G_{jk} = sech((j-k) delta/2), the finite-size
 *   correction F/A_opt = 1 + C (pi/(N+1))^2 + O(N^{-3}) has an edge coefficient
 *   C = f''(pi)/(2 A_opt) that, as delta -> 0 (equivalently as the class floor
 *   A_opt = min_theta f underflows), obeys the EXACT closed form
 *
 *       C(delta) = pi^2 / (2 delta^2)     (delta -> 0),
 *
 *   confirmed on the grid via C * delta^2 = pi^2/2 = 4.9348022 to full precision for
 *   delta <= 1 (delta = ln1.2, ln1.3, ln1.5, ln2, 1), and only ~1% short of that at
 *   delta = 3 where higher Poisson-dual terms enter.
 *
 *   MECHANISM: both f''(pi) and A_opt are dominated at small delta by the same
 *   leading Poisson-dual term (4 pi/delta) sech(pi^2/delta); this shared prefactor
 *   CANCELS in the ratio C = f''(pi)/(2 A_opt), leaving the pure delta^{-2}
 *   rescaling. The blow-up is therefore benign, not a small-delta pathology: it only
 *   means the natural finite-size variable is delta(N+1), not N+1 alone -- a fixed N
 *   needs N+1 >> pi/delta before the finite-size correction is small.
 *
 *   STATUS: cross-validated dual-form (cancellation-free Poisson sums), float64, and
 *   double-double across the grid; sharp as a small-delta asymptotic inside the
 *   imp-95693 rho-sweep regime (delta = ln1.2 .. ln2). Not claimed exact at large
 *   delta.
 *
 *   WHAT THIS IS AND IS NOT
 *   ------------------------
 *   A glossary-style lookup restating the imp-95704 scaling-law localization for
 *   quick reference. It establishes nothing, instantiates no interval, closes no
 *   sub-gap, moves no bound. NO QED. No refereed bound is changed.
 *
 * @see imp-95704-rho1-szego-coefficient-delta-scaling (source: the C(delta) scaling law this glosses)
 * @see imp-95689-rho1-szego-dual-convergence-rate (the exponent-2 correction and C at delta = ln1.3)
 * @see imp-95419-separated-class-optimal-riesz-floor (A_opt = symbol infimum)
 *
 * Ticket: imp-95775 (content, low). Documentation only; establishes nothing; NO QED;
 * no refereed bound is changed.
 */

// The C(delta) = pi^2/(2 delta^2) scaling-law headword, baked verbatim (no re-import).
const SZEGO_EDGE_COEFFICIENT_SCALING_LAW_HEADWORD = Object.freeze({
  key: 'szego-edge-coefficient-small-delta-scaling-law',
  term:
    'Szego edge-coefficient small-delta scaling law C(delta) = pi^2/(2 delta^2) ' +
    '(rho=1 sech-seam Gram)',
  definition:
    'The exact small-delta closed form of the imp-95689 finite-size Szego edge ' +
    'coefficient C = f’’(pi)/(2 A_opt) governing the rho=1 sech-seam Toeplitz ' +
    'Gram finite-size correction F/A_opt = 1 + C (pi/(N+1))^2 + O(N^-3). As delta -> 0 ' +
    '(A_opt underflows), C * delta^2 -> pi^2/2 = 4.9348022 to full precision, i.e. ' +
    'C(delta) = pi^2/(2 delta^2).',
  mechanism:
    'Both f’’(pi) and A_opt are dominated at small delta by the identical ' +
    'leading Poisson-dual prefactor (4 pi/delta) sech(pi^2/delta); this shared factor ' +
    'CANCELS in the ratio C = f’’(pi)/(2 A_opt), leaving the pure delta^-2 ' +
    'rescaling. The blow-up is therefore benign: it signals only that the natural ' +
    'finite-size variable is delta(N+1), not N+1 alone.',
  verificationStatus:
    'Cross-validated dual-form (cancellation-free Poisson sums), float64, and ' +
    'double-double across delta = ln1.2, ln1.3, ln1.5, ln2, 1 (agreement to full ' +
    'precision) and delta = 3 (only ~1% short, confirming the law is a small-delta ' +
    'asymptotic, sharp inside the imp-95693 rho-sweep regime).',
});

export const IMP95775_SZEGO_EDGE_COEFFICIENT_SCALING_LAW_GLOSSARY_HEADWORD = Object.freeze({
  id: 'imp-95775',
  proofSection: 'S-frontier',
  glosses: 'imp-95704',
  question:
    'imp-95704 measured that the imp-95689 finite-size Szego edge coefficient ' +
    'C = f’’(pi)/(2 A_opt) blows up like delta^-2 as A_opt underflows. What is the ' +
    'exact closed-form scaling law, why is the blow-up benign, and what verification ' +
    'backs it, for a reader landing on that module cold?',
  headword: SZEGO_EDGE_COEFFICIENT_SCALING_LAW_HEADWORD,
  anyBoundMoved: false,
  verdict:
    'GLOSSARY HEADWORD ONLY (documentation, not a proof). Restates the imp-95704 ' +
    'scaling-law localization: C(delta) = pi^2/(2 delta^2) exactly as delta -> 0, with ' +
    'the blow-up shown benign because the shared sech(pi^2/delta) prefactor of ' +
    'f’’(pi) and A_opt cancels in the ratio. Cross-validated dual/float64/double-' +
    'double for delta <= 1; a small-delta asymptotic only (delta = 3 departs by ~1%). ' +
    'Establishes nothing; instantiates no interval; moves no bound; NO QED. ' +
    'No refereed bound is changed.',
  citation:
    'imp-95704 (the C(delta) scaling-law measurement and derivation this glosses); ' +
    'imp-95689 (the exponent-2 finite-size correction and the delta = ln1.3 baked ' +
    'coefficient); imp-95419 (A_opt as the symbol infimum).',
});

export default IMP95775_SZEGO_EDGE_COEFFICIENT_SCALING_LAW_GLOSSARY_HEADWORD;

// -- Tripwire assertions ------------------------------------------------------
export const IMP95775_SZEGO_EDGE_COEFFICIENT_SCALING_LAW_GLOSSARY_HEADWORD_ASSERTIONS = [
  {
    id: 'imp95775-headword-has-required-fields',
    why: 'The headword must name the exact C(delta) = pi^2/(2 delta^2) law, the shared-prefactor cancellation mechanism, and the cross-validation status -- the entire point of the glossary entry.',
    holds: () => {
      const h = IMP95775_SZEGO_EDGE_COEFFICIENT_SCALING_LAW_GLOSSARY_HEADWORD.headword;
      return (
        /pi\^2\/\(2 delta\^2\)/.test(h.definition) &&
        /cancel/i.test(h.mechanism) &&
        /delta\^-2/.test(h.mechanism) &&
        /cross-validated/i.test(h.verificationStatus) &&
        /double-double/i.test(h.verificationStatus)
      );
    },
  },
  {
    id: 'imp95775-honesty-gate-no-qed',
    why: 'Documentation only: no bound claimed moved, no QED, no-refereed-bound-change line present.',
    holds: () =>
      IMP95775_SZEGO_EDGE_COEFFICIENT_SCALING_LAW_GLOSSARY_HEADWORD.anyBoundMoved === false &&
      /NO QED/.test(IMP95775_SZEGO_EDGE_COEFFICIENT_SCALING_LAW_GLOSSARY_HEADWORD.verdict) &&
      /refereed bound is changed/i.test(IMP95775_SZEGO_EDGE_COEFFICIENT_SCALING_LAW_GLOSSARY_HEADWORD.verdict) &&
      IMP95775_SZEGO_EDGE_COEFFICIENT_SCALING_LAW_GLOSSARY_HEADWORD.glosses === 'imp-95704',
  },
];

for (const assertion of IMP95775_SZEGO_EDGE_COEFFICIENT_SCALING_LAW_GLOSSARY_HEADWORD_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(
      `imp-95775-szego-edge-coefficient-scaling-law-glossary-headword assertion failed: ${assertion.id}`,
    );
  }
}
