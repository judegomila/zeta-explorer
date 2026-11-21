/**
 * @module imp-97061-mirror-pair-lemma-flow-descent-glossary-headword
 * @fileoverview imp-97061 -- import-light glossary/Concepts headword for the
 *   rh-bridge-mirror-descent-2026-09-25 finding: the mirror PAIR LEMMA (A1) is PROVED
 *   elementary, and it feeds a PROVED conditional flow-descent theorem
 *   (H_desc-mirror => Lambda <= t0 + y0^2/2, modulo flagged residuals). Neither result
 *   makes the underlying hypothesis easier to obtain.
 *
 *   WHY A GLOSSARY HEADWORD (not a re-derivation)
 *   -----------------------------------------------
 *   The source module reconciles three investigations and four adversarial referee
 *   passes into one status line. The two load-bearing claims -- an unconditional
 *   elementary lemma, and a conditional theorem built on top of it -- are easy to
 *   conflate with "progress on Lambda". This headword bakes the distinction verbatim
 *   (no re-import of the source module, to stay import-light): the lemma and theorem
 *   are both PROVED, but the theorem's hypothesis H_desc-mirror is, against the
 *   correct Palm baseline, a local SURPLUS requirement (~1.73x neutral at the seam),
 *   not "no shortage" -- so it is not shown to be any easier than the H_desc hypothesis
 *   it is implied by, and it gives no new Lambda bound.
 *
 *   THE HEADWORD
 *   -----------------------------------------------
 *   (a) PAIR LEMMA (A1, PROVED, elementary). For every horizontal offset Delta > 0 and
 *   a in [0, 2y]: f(a) + f(2y - a) >= f(2y) = 2y/(Delta^2 + 4y^2), where
 *   f(h) = h/(Delta^2 + h^2); equality only at a in {0, 2y} (a neighbour at the same
 *   height). Proof is subadditivity of f(h)/h = 1/(Delta^2 + h^2) (decreasing in h), no
 *   concavity needed. Consequence: a conjugate pair {z_j, conj z_j} with |y_j| <= y
 *   contributes at least this half-weight, double-width Poisson-kernel pull on a
 *   nonreal zero z = x + iy -- a proved, elementary sharpening of the de Bruijn
 *   topmost-zero argument.
 *   (b) CONDITIONAL FLOW-DESCENT THEOREM (B1, PROVED modulo flagged residuals). Given
 *   P15 Thm 1.2 (i)-(ii) and hypothesis H_desc-mirror(p) (every nonreal topmost-within-2
 *   zero of H_t at height y >= y0, x >= X + 1, has mirror-count M_t(z) >= p(y)): IF
 *   int_{y0}^1 dY/(1/Y + p(Y)) <= t0 THEN Lambda <= t0 + y0^2/2 = U. At the working row
 *   t0 = 0.1314, y0 = 0.165: U = 0.145013, required constant p_req = 4.3743,
 *   theta_req = 0.650 (seam, ln N = 13.4459) / 0.473 (ln N1* = 18.509). H_desc(p) implies
 *   H_desc-mirror(p) termwise, so the theorem's hypothesis is FORMALLY WEAKER, not a new
 *   route to a smaller Lambda.
 *   (c) THE HYPOTHESIS IS NOT EASIER. Measured against the correct Palm
 *   (conditioned-on-a-zero) neutral-lattice baseline, the constant-p_req = 4.3743 form
 *   demands a local SURPLUS of about 1.73x the neutral mirror count at the seam
 *   (neutral 2-slot count 2.530, i.e. 0.376 of the seam mean) -- not "no shortage" as an
 *   earlier reading suggested (that reading, and the derived Lambda ~ 0.1035/0.0809,
 *   were withdrawn as an inconsistent baseline).
 *   (d) NO NEW BOUND. Both results are proved, but B1's hypothesis is open, pointwise at
 *   sigma < 1 (NS-RIGID class), and for t > 0 concerns zeros of H_t, which carry no
 *   Euler product. The one place an Euler-product input is unconditional is a single
 *   instant t = 0 rate bound on a hypothetical globally topmost zero (existence
 *   unknown) -- an instantaneous rate, not a flow theorem, and it gives no Lambda bound.
 *
 *   STATUS: the lemma and the conditional theorem are proved; the theorem's hypothesis
 *   remains open and unhelped. No new Lambda bound. NO QED. No refereed bound is changed
 *   ; RH open.
 *
 * @see rh-bridge-mirror-descent-2026-09-25.js (source: pair lemma A1, conditional
 *   theorem B1, and the Palm-baseline surplus reconciliation this glosses)
 * @see lane-arithmetic-input-audit-2026-09-22.js (origin of the H_desc hypothesis this
 *   theorem's H_desc-mirror hypothesis is implied by)
 *
 * Ticket: imp-97061 (content, medium, sonnet-4-6). Documentation only; establishes
 * nothing new; NO QED; no refereed bound is changed.
 */

// The mirror pair-lemma + conditional flow-descent headword, baked verbatim (no re-import).
const MIRROR_PAIR_LEMMA_FLOW_DESCENT_HEADWORD = Object.freeze({
  key: 'mirror-pair-lemma-and-conditional-flow-descent-theorem-hypothesis-not-easier',
  term:
    'rh-bridge-mirror-descent-2026-09-25 finding: the mirror PAIR LEMMA (A1) is PROVED ' +
    'elementary and feeds a PROVED conditional flow-descent theorem ' +
    '(H_desc-mirror(p) => Lambda <= t0 + y0^2/2), but the theorem\'s hypothesis is a ' +
    'Palm-baseline local SURPLUS (~1.73x neutral at the seam), not a relaxation of ' +
    'H_desc -- no new Lambda bound results',
  definition:
    'Pair lemma (A1, PROVED): for Delta > 0 and a in [0, 2y], f(a) + f(2y - a) >= ' +
    'f(2y) = 2y/(Delta^2 + 4y^2) with f(h) = h/(Delta^2 + h^2), equality only at ' +
    'a in {0, 2y}; proved by subadditivity of f(h)/h, no concavity needed. Conditional ' +
    'theorem (B1, PROVED modulo flagged residuals): assuming P15 Thm 1.2 (i)-(ii) and ' +
    'H_desc-mirror(p) (every nonreal topmost-within-2 zero of H_t at y >= y0, ' +
    'x >= X + 1 has mirror-count M_t(z) >= p(y)), if int_{y0}^1 dY/(1/Y + p(Y)) <= t0 ' +
    'then Lambda <= t0 + y0^2/2. At t0 = 0.1314, y0 = 0.165: U = t0 + y0^2/2 = 0.145013, ' +
    'p_req = 4.3743, theta_req = 0.650 (seam) / 0.473 (ln N1* = 18.509). H_desc(p) ' +
    'implies H_desc-mirror(p) termwise, so the hypothesis is formally weaker than ' +
    'H_desc, not shown to be more attainable.',
  mechanism:
    'Against the correct Palm (conditioned-on-a-zero) neutral-lattice baseline, the ' +
    'constant p_req = 4.3743 form demands a local surplus of about 1.73x the neutral ' +
    'mirror count at the seam (neutral 2-slot count 2.530, i.e. 0.376 of the seam mean ' +
    'ln N / 2), not "no shortage" -- an earlier reading that assumed the mirror mean ' +
    'held pointwise, and the Lambda ~ 0.1035/0.0809 it produced, were withdrawn as an ' +
    'inconsistent baseline. Both proved results (the lemma, and the conditional ' +
    'theorem built on it) are therefore correct but do not make the flow-descent route ' +
    'to a smaller Lambda easier: the hypothesis stays open, pointwise at sigma < 1 ' +
    '(NS-RIGID class), and for t > 0 concerns zeros of H_t, which carry no Euler ' +
    'product; the one unconditional Euler-product gain is an instantaneous t = 0 rate ' +
    'on a hypothetical globally topmost zero of unknown existence, not a flow theorem.',
  verificationStatus:
    'Both A1 (pair lemma) and B1 (conditional theorem) independently re-derived and ' +
    'grid/random-checked by >= 2 referees across three investigations and four ' +
    'adversarial referee passes (rh-bridge-mirror-descent-2026-09-25, 12 baked ' +
    'assertions). Documentation only here; establishes nothing beyond the source ' +
    'module; no bound moved; no refereed bound is changed; RH open; NO QED.',
});

export const IMP97061_MIRROR_PAIR_LEMMA_FLOW_DESCENT_GLOSSARY_HEADWORD = Object.freeze({
  id: 'imp-97061',
  proofSection: 'S-frontier',
  glosses: 'rh-bridge-mirror-descent-2026-09-25',
  question:
    'The rh-bridge-mirror-descent-2026-09-25 module proves both an elementary mirror ' +
    'pair lemma (A1) and a conditional flow-descent theorem built on it ' +
    '(H_desc-mirror(p) => Lambda <= t0 + y0^2/2, B1). Does either result make the ' +
    'route to a smaller Lambda bound more attainable, or do they only reformulate the ' +
    'existing H_desc hypothesis without weakening what it demands?',
  headword: MIRROR_PAIR_LEMMA_FLOW_DESCENT_HEADWORD,
  anyBoundMoved: false,
  verdict:
    'GLOSSARY HEADWORD ONLY (documentation, not a proof). Restates the ' +
    'rh-bridge-mirror-descent-2026-09-25 finding: the pair lemma A1 is a proved, ' +
    'elementary sharpening of the de Bruijn topmost-zero argument, and it supports a ' +
    'proved conditional theorem B1 (H_desc-mirror(p) => Lambda <= t0 + y0^2/2 = ' +
    '0.145013 at t0=0.1314, y0=0.165, p_req=4.3743), but measured against the correct ' +
    'Palm baseline the hypothesis demands a local surplus (~1.73x neutral at the seam), ' +
    'not a relaxation of H_desc -- so neither result gives a new Lambda bound. ' +
    'Establishes nothing beyond the source module; instantiates no interval; moves no ' +
    'bound; NO QED. No refereed bound is changed.',
  citation:
    'rh-bridge-mirror-descent-2026-09-25 (source proof of the pair lemma A1 and the ' +
    'conditional theorem B1, and the Palm-baseline surplus reconciliation this ' +
    'glosses); lane-arithmetic-input-audit-2026-09-22 (origin of the H_desc hypothesis ' +
    'H_desc-mirror is implied by).',
});

export default IMP97061_MIRROR_PAIR_LEMMA_FLOW_DESCENT_GLOSSARY_HEADWORD;

// -- Tripwire assertions ------------------------------------------------------
export const IMP97061_MIRROR_PAIR_LEMMA_FLOW_DESCENT_GLOSSARY_HEADWORD_ASSERTIONS = [
  {
    id: 'imp97061-headword-has-required-fields',
    why: 'The headword must name both the proved lemma/theorem status and the Palm ' +
      'surplus finding -- the entire point of the glossary entry.',
    holds: () => {
      const h = IMP97061_MIRROR_PAIR_LEMMA_FLOW_DESCENT_GLOSSARY_HEADWORD.headword;
      return (
        /4\.3743/.test(h.definition) &&
        /0\.145013/.test(h.definition) &&
        /1\.73x/.test(h.mechanism) &&
        /PROVED/.test(h.term)
      );
    },
  },
  {
    id: 'imp97061-honesty-gate-no-qed',
    why: 'Documentation only: no bound claimed moved, no QED, no-refereed-bound-change line present, ' +
      'glosses the correct source module.',
    holds: () =>
      IMP97061_MIRROR_PAIR_LEMMA_FLOW_DESCENT_GLOSSARY_HEADWORD.anyBoundMoved === false &&
      /NO QED/.test(IMP97061_MIRROR_PAIR_LEMMA_FLOW_DESCENT_GLOSSARY_HEADWORD.verdict) &&
      /refereed bound is changed/i.test(IMP97061_MIRROR_PAIR_LEMMA_FLOW_DESCENT_GLOSSARY_HEADWORD.verdict) &&
      IMP97061_MIRROR_PAIR_LEMMA_FLOW_DESCENT_GLOSSARY_HEADWORD.glosses ===
        'rh-bridge-mirror-descent-2026-09-25',
  },
];

for (const assertion of IMP97061_MIRROR_PAIR_LEMMA_FLOW_DESCENT_GLOSSARY_HEADWORD_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(
      `imp-97061-mirror-pair-lemma-flow-descent-glossary-headword assertion failed: ${assertion.id}`,
    );
  }
}
