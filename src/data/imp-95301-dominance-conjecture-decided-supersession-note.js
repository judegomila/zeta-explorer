/**
 * @module imp-95301-dominance-conjecture-decided-supersession-note
 *
 * imp-95301 (content, S-frontier) was queued to record that the imp-95286
 * COROLLARY WINDOW-PINCH brackets the confluent span sup without deciding
 * the imp-95227 N >= 3 confluent dominance conjecture -- true when the
 * ticket was written, since imp-95286 explicitly says the conjecture
 * "remains OPEN and is NOT decided here". By the time this ticket was
 * picked up, that premise was already superseded: imp-95287 (THEOREM
 * MONO-N + COROLLARY DOM-N + COROLLARY WINDOW-EXACT) DECIDED the imp-95227
 * conjecture AFFIRMATIVE for fully distinct rate configurations (with <=
 * by closure on partially confluent ones; STRICTNESS on partial-block
 * strata is a named minor residual).
 *
 * This module IS the honest-status note the ticket asked for, corrected
 * to the current state of the seam chain: it records BOTH the historical
 * bracketed-not-decided status (imp-95286) AND the later decision
 * (imp-95287), so a reader lands on the accurate timeline instead of a
 * stale "still open" claim.
 *
 * DOCUMENTATION ONLY. Ports nothing; measures nothing new; changes no
 * bound; no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-95227-two-rate-coalescence-dominance-theorem (conjecture stated OPEN)
 * @see imp-95286-confluent-laguerre-floor (COROLLARY WINDOW-PINCH brackets, does not decide)
 * @see imp-95287-nrate-monotonicity-dominance (THEOREM MONO-N / DOM-N / WINDOW-EXACT decides it)
 */

export const IMP95301_DOMINANCE_CONJECTURE_DECIDED_SUPERSESSION_NOTE = {
  id: 'imp-95301',
  proofSection: 'S-frontier',
  headline:
    'THE IMP-95227 N >= 3 DOMINANCE CONJECTURE, BRACKETED-NOT-DECIDED AS OF IMP-95286, WAS SUBSEQUENTLY DECIDED (AFFIRMATIVE) BY IMP-95287',
  timeline: {
    T1_conjecture_stated: {
      source: 'imp-95227',
      claim:
        'States the N >= 3 confluent dominance conjecture and proves only the N = 2 case (COAL-DOM); ' +
        'the general-N analytic ratio-monotonicity proof is recorded OPEN.',
    },
    T2_bracketed_not_decided: {
      source: 'imp-95286',
      claim:
        'COROLLARY WINDOW-PINCH brackets the window sup between the CONF-LB floor and the COAL-N majorant, ' +
        'and its own verdict states this "does NOT decide the imp-95227 dominance conjecture (OPEN)".',
    },
    T3_decided_affirmative: {
      source: 'imp-95287',
      claim:
        'THEOREM MONO-N proves the exact signed N-rate shift constant is strictly decreasing in every rate; ' +
        'COROLLARY DOM-N and COROLLARY WINDOW-EXACT conclude the window sup equals Lambda_conf(N, nu_min d) ' +
        'exactly and is R-independent. This DECIDES the imp-95227 conjecture affirmative for fully distinct ' +
        'configurations, with <= by closure on partially confluent ones; strictness on partial-block strata ' +
        'is a named minor residual, not an open conjecture.',
    },
  },
  isRigorous: false,
  verdict:
    'HONEST-STATUS NOTE (documentation, NOT a new claim). The ticket that requested this note predates imp-95287 ' +
    'and its literal instruction ("bracketed but NOT decided") is now stale. This note corrects the record: the ' +
    'conjecture is DECIDED (imp-95287), and consumers citing imp-95286 WINDOW-PINCH as the state of the art should ' +
    'cite imp-95287 WINDOW-EXACT instead. Ports nothing; measures nothing new; changes no bound; no RH verdict, ' +
    'NO QED. No refereed bound is changed.',
  citation:
    'imp-95227-two-rate-coalescence-dominance-theorem (conjecture stated); ' +
    'imp-95286-confluent-laguerre-floor (bracket, does not decide); ' +
    'imp-95287-nrate-monotonicity-dominance (decides affirmative).',
};

export const IMP95301_DOMINANCE_CONJECTURE_DECIDED_SUPERSESSION_NOTE_ASSERTIONS = [
  {
    id: 'imp95301-headline-names-both-modules-and-verdict',
    description: 'Headline names imp-95286 (bracketed) and the imp-95287 decision',
    holds: () =>
      /IMP-95227/.test(IMP95301_DOMINANCE_CONJECTURE_DECIDED_SUPERSESSION_NOTE.headline) &&
      /DECIDED/.test(IMP95301_DOMINANCE_CONJECTURE_DECIDED_SUPERSESSION_NOTE.headline) &&
      /IMP-95287/.test(IMP95301_DOMINANCE_CONJECTURE_DECIDED_SUPERSESSION_NOTE.headline),
  },
  {
    id: 'imp95301-t2-records-not-decided-verbatim',
    description: 'T2 records the imp-95286 "does NOT decide" verdict, matching the ticket premise at the time it was written',
    holds: () =>
      /does NOT decide/.test(IMP95301_DOMINANCE_CONJECTURE_DECIDED_SUPERSESSION_NOTE.timeline.T2_bracketed_not_decided.claim) &&
      IMP95301_DOMINANCE_CONJECTURE_DECIDED_SUPERSESSION_NOTE.timeline.T2_bracketed_not_decided.source === 'imp-95286',
  },
  {
    id: 'imp95301-t3-records-decided-affirmative',
    description: 'T3 records the imp-95287 decision, sourced correctly',
    holds: () =>
      /DECIDES the imp-95227 conjecture affirmative/.test(
        IMP95301_DOMINANCE_CONJECTURE_DECIDED_SUPERSESSION_NOTE.timeline.T3_decided_affirmative.claim,
      ) && IMP95301_DOMINANCE_CONJECTURE_DECIDED_SUPERSESSION_NOTE.timeline.T3_decided_affirmative.source === 'imp-95287',
  },
  {
    id: 'imp95301-honesty-gate-no-qed',
    description: 'Documentation only: not rigorous, no new claim, no QED, no refereed bound is changed',
    holds: () =>
      IMP95301_DOMINANCE_CONJECTURE_DECIDED_SUPERSESSION_NOTE.isRigorous === false &&
      /HONEST-STATUS NOTE/.test(IMP95301_DOMINANCE_CONJECTURE_DECIDED_SUPERSESSION_NOTE.verdict) &&
      /NOT a new claim/.test(IMP95301_DOMINANCE_CONJECTURE_DECIDED_SUPERSESSION_NOTE.verdict) &&
      /NO QED/.test(IMP95301_DOMINANCE_CONJECTURE_DECIDED_SUPERSESSION_NOTE.verdict) &&
      /refereed bound is changed/i.test(IMP95301_DOMINANCE_CONJECTURE_DECIDED_SUPERSESSION_NOTE.verdict),
  },
];

for (const a of IMP95301_DOMINANCE_CONJECTURE_DECIDED_SUPERSESSION_NOTE_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-95301-dominance-conjecture-decided-supersession-note assertion failed: ${a.id}`);
  }
}
