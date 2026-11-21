/**
 * @module imp-97828-diag3-second-order-contraction-glossary-headword
 * @fileoverview imp-97828 -- import-light Concepts glossary headword for the imp-97720 result:
 *   the first-order additivity identity DIAG3 = E_CC + E_ET + E_CF == 0 (imp-97644/imp-97689)
 *   SURVIVES beyond first order, but as a vanishing log-Hessian row/column sum (a second-order
 *   CONTRACTION), NOT as the vanishing of the individual mixed second elasticities H_ce/H_cf/H_ef
 *   (which are all nonzero, order-1 couplings).
 *
 *   HEADWORD -- SECOND-ORDER DIAG3 CONTRACTION.
 *   -----------------------------------------------
 *   (a) DEFINITION. At a fixed landmark abscissa N_L, ln sigma = ln E_coll - ln E_N is a difference
 *   of two amplitude-linear log-forms in the three log-amplitude axes u = (u_c, u_e, u_f) (C_C,
 *   E_trunc, C_F). Its 3x3 mixed second derivative (log-Hessian) has the exact closed form
 *   H_ij = delta_ij(a_i - b_i) - (a_i a_j - b_i b_j), with numerator shares a = (1,0,0) and
 *   denominator shares b = (sigma, E_trunc/E_N, E_flow/E_N). Differentiating the first-order Euler
 *   identity sum_j dlnsigma/du_j = DIAG3 == 0 once more gives sum_j H_ij = d/du_i(DIAG3) = 0 for
 *   every i: the log-Hessian is doubly centered (every row AND column sums to zero).
 *   (b) THE CONTRACTION IS REAL, THE OFF-DIAGONALS ARE NOT ZERO. imp-97720 measured this Hessian at
 *   landmarks L2/L3/L4 (sigma = 0.9/0.5/0.1): the off-diagonal H_ce = sigma * E_trunc/E_N is a clean
 *   +8.11e-2 / +2.495e-1 / +9.00e-2 -- an order-1 mixed coupling that does NOT vanish. What DOES
 *   vanish is the row/column sum of the whole matrix, down to the O(h^2) central-difference stencil
 *   floor (quartering as h halves: 4.68e-8 -> 1.16e-8 -> 3.15e-9), matching the exact closed form to
 *   < 3e-7 relative.
 *   (c) WHY THIS MATTERS. Degree-0 homogeneity of sigma = E_coll/E_N in the three amplitudes forces
 *   the FIRST-order diagonal sum (DIAG3) to vanish exactly, and that is the ONLY thing it forces at
 *   first order (imp-97644/imp-97689/imp-97644-elasticity-additivity). It is tempting to over-read
 *   this as "every higher mixed elasticity between the three amplitudes vanishes too" -- imp-97720
 *   refutes that over-reading directly: nonzero order-1 second-order couplings coexist with an exact
 *   second-order contraction identity. The homogeneity survives as a STRUCTURAL constraint on the sum
 *   of a row, not as a constraint on any individual entry.
 *   (d) SCOPE. Measurement/audit only on the inherited imp-3220/imp-3406 extrapolation; the pinned
 *   constants (C_C_PINNED, E_TRUNC_PT, Gronwall factor) appear only as symbolic differentiation axes
 *   and are untouched; no bound moves; NO QED.
 *
 *   STATUS: documentation only -- Concepts glossary headword recording an already-established
 *   imp-97720 measurement. Not a proof, not a new bound. NO QED.
 *
 * @see imp-97720-diag3-second-order-hessian.js (source: the 3x3 log-Hessian measurement, closed
 *   form, and the h-ladder contraction floor)
 * @see imp-97689-diag3-additivity-euler-derivation.js (analytic first-order DIAG3 == 0, Euler
 *   degree-0 homogeneity)
 * @see imp-97644-three-axis-additivity-flow-prefactor.js (MEASURED first-order DIAG3 == 0)
 *
 * Ticket: imp-97828 (content, low, sonnet-4-6). Documentation only; establishes nothing new; NO QED;
 * no refereed bound is changed.
 */

import { IMP97720_DIAG3_SECOND_ORDER_HESSIAN } from './imp-97720-diag3-second-order-hessian.js';

// Headword, baked verbatim from the imp-97720 measurement (no re-import of the full kernel).
const DIAG3_SECOND_ORDER_CONTRACTION_HEADWORD = Object.freeze({
  key: 'diag3-second-order-contraction-imp97720',
  term:
    'DIAG3 second-order contraction: the first-order additivity identity DIAG3 = E_CC + E_ET + ' +
    'E_CF == 0 survives beyond first order as a vanishing log-Hessian row/column sum, NOT as the ' +
    'vanishing of the individual mixed second elasticities',
  definition:
    'The 3x3 mixed second derivative (log-Hessian) of ln sigma = ln E_coll - ln E_N in the three ' +
    'log-amplitude axes (C_C, E_trunc, C_F) has the exact closed form H_ij = delta_ij(a_i - b_i) - ' +
    '(a_i a_j - b_i b_j), with numerator shares a = (1,0,0) and denominator shares b = (sigma, ' +
    'E_trunc/E_N, E_flow/E_N). Every row and column of this matrix sums to zero exactly -- the ' +
    'second-order Euler relation sum_j H_ij = d/du_i(DIAG3) = 0 -- measured at the imp-97520 ' +
    'landmarks L2/L3/L4 down to the O(h^2) central-difference stencil floor (quartering as h ' +
    'halves: 4.68e-8 -> 1.16e-8 -> 3.15e-9).',
  mechanism:
    'The off-diagonal entries themselves do NOT vanish: H_ce = sigma * E_trunc/E_N is an order-1 ' +
    'coupling measuring +8.11e-2 / +2.495e-1 / +9.00e-2 at L2/L3/L4. Degree-0 homogeneity of ' +
    'sigma = E_coll/E_N in the three amplitudes forces only the DIAGONAL sum (the row/column ' +
    'contraction) to vanish, not any individual mixed second elasticity -- the same distinction as ' +
    'first order, where DIAG3 == 0 constrains the sum E_CC + E_ET + E_CF but not the individual ' +
    'terms.',
  verificationStatus:
    'Re-cited from imp-97720 (3x3 log-Hessian measurement, closed-form match < 3e-7 relative, ' +
    'h-ladder contraction floor). Naming / glossary headword only; supplies no new bound; RH open; ' +
    'no refereed bound is changed; NO QED.',
});

export const IMP97828_DIAG3_SECOND_ORDER_CONTRACTION_GLOSSARY_HEADWORD = Object.freeze({
  id: 'imp-97828',
  proofSection: 'S-frontier',
  glosses: 'imp-97720',
  question:
    'Does the imp-97644/imp-97689 first-order DIAG3 == 0 additivity identity survive beyond first ' +
    'order as vanishing individual mixed second elasticities, or only as a vanishing sum (a ' +
    'second-order contraction)?',
  headword: DIAG3_SECOND_ORDER_CONTRACTION_HEADWORD,
  anyBoundMoved: false,
  verdict:
    'GLOSSARY HEADWORD ONLY (documentation, not a proof). Names the imp-97720 measurement: the ' +
    'degree-0 homogeneity that forces DIAG3 == 0 at first order survives at second order only as ' +
    'the row/column CONTRACTION of the log-Hessian (sum_j H_ij == 0), while the individual ' +
    'off-diagonal mixed second elasticities H_ce/H_cf/H_ef remain nonzero order-1 couplings. No ' +
    'bound moved; NO QED. No refereed bound is changed.',
  citation:
    'imp-97720-diag3-second-order-hessian.js (3x3 log-Hessian measurement, closed form, h-ladder); ' +
    'imp-97689-diag3-additivity-euler-derivation.js (analytic first-order DIAG3 == 0); imp-97644 ' +
    '(MEASURED first-order DIAG3 == 0).',
});

export default {
  diag3SecondOrderContraction: IMP97828_DIAG3_SECOND_ORDER_CONTRACTION_GLOSSARY_HEADWORD,
};

// -- Tripwire assertions ------------------------------------------------------
const IMP97828_ASSERTIONS = [
  {
    id: 'imp97828-headword-names-contraction-and-nonzero-offdiag',
    why: 'The headword must name both the vanishing contraction and the nonzero off-diagonal ' +
      'H_ce figures, so the distinction (contraction vanishes, entries do not) is explicit.',
    holds: () => {
      const h = IMP97828_DIAG3_SECOND_ORDER_CONTRACTION_GLOSSARY_HEADWORD.headword;
      return (
        /vanishing log-Hessian row\/column sum/.test(h.term) &&
        /sum_j H_ij = d\/du_i\(DIAG3\) = 0/.test(h.definition) &&
        /\+8\.11e-2/.test(h.mechanism) &&
        /\+2\.495e-1/.test(h.mechanism) &&
        /\+9\.00e-2/.test(h.mechanism)
      );
    },
  },
  {
    id: 'imp97828-consistent-with-imp97720-source-figures',
    why: 'The re-cited figures must match the imp-97720 source module exactly -- this is a ' +
      'glossary headword, not an independent re-derivation.',
    holds: () => {
      const [l2, l3, l4] = IMP97720_DIAG3_SECOND_ORDER_HESSIAN.perLandmark;
      return (
        Math.abs(l2.Hoff_CC_ET / 8.11e-2 - 1) < 0.02 &&
        Math.abs(l3.Hoff_CC_ET / 2.495e-1 - 1) < 0.02 &&
        Math.abs(l4.Hoff_CC_ET / 9.00e-2 - 1) < 0.02 &&
        IMP97720_DIAG3_SECOND_ORDER_HESSIAN.isRigorous === false
      );
    },
  },
  {
    id: 'imp97828-honesty-gate-no-qed',
    why: 'Documentation only: no bound claimed moved, no QED, no-refereed-bound-change line present.',
    holds: () =>
      IMP97828_DIAG3_SECOND_ORDER_CONTRACTION_GLOSSARY_HEADWORD.anyBoundMoved === false &&
      /NO QED/.test(IMP97828_DIAG3_SECOND_ORDER_CONTRACTION_GLOSSARY_HEADWORD.verdict) &&
      /refereed bound is changed/i.test(IMP97828_DIAG3_SECOND_ORDER_CONTRACTION_GLOSSARY_HEADWORD.verdict),
  },
];

for (const assertion of IMP97828_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(
      `imp-97828-diag3-second-order-contraction-glossary-headword assertion failed: ${assertion.id}`,
    );
  }
}
