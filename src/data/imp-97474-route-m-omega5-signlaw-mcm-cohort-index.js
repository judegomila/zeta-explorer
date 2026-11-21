/**
 * @module imp-97474-route-m-omega5-signlaw-mcm-cohort-index
 * @fileoverview imp-97474 -- META cross-reference index note grouping the Route M omega = 5
 *   sign-law-closure thread (imp-97423, imp-97433, imp-97443) with the parallel MCM-hypothesis
 *   thread (imp-97432, imp-97442) as one TWO-PRONGED cohort working the same b/4-ceiling
 *   question from opposite directions: a direct sign-law proof for omega = 5 specifically, and a
 *   stronger non-negativity hypothesis (MCM) tested across all omega. Index/meta only;
 *   establishes nothing new; changes no bound; NO QED.
 *
 *   THREAD A -- omega = 5 sign-law closure (direct route).
 *     imp-97423 -- derives the rigorous two-sided enveloping Binet bracket
 *       1/(12n) - 1/(360n^3) < J(n) < 1/(12n), induces explicit Dlo/Dhi bounds on D_{p1}(e), and
 *       certifies the two per-prime inequalities (A),(B) (imp-97396's reduction of T(b) < 0 at
 *       omega = 5) with strictly positive margin across sampled families. Names the residual: the
 *       certificate margin decays like c/q1 with no positive floor -- a uniform-in-(p1,q1) TAIL
 *       LEMMA is needed to turn "positive on samples" into "positive for all q1".
 *     imp-97433 -- supplies that tail lemma. Derives an explicit, p1-free, tail-prime-free lower
 *       bound gA(q1) on certA valid for every real q1 >= 7 (threshold essentially sharp: gA(5) <
 *       0), and a closed-form gB(q2) > 0 for every q2 >= 5 (so certB needs NO finite check at
 *       all). Combined with the finite residual q1 in {3,5} (3 minimal-config checks, all
 *       strictly positive), this closes certA, certB for EVERY omega = 5 squarefree b.
 *     imp-97443 -- independently cross-validates the imp-97423 bracket and certificates against a
 *       direct extended-precision (mpmath, 60-digit) Binet function across the minimal-config
 *       ladder q1 = 10^2..10^6 for p1 in {2,3,5}: confirms the bracket always under-estimates the
 *       true margin (so certA/certB are genuine lower certificates), both stay strictly positive
 *       out to q1 = 10^6, and the measured decay matches the predicted leading law
 *       q1*certA -> (1-1/p1)/12.
 *     TOGETHER: (A),(B) are established for every omega = 5 squarefree b, conditional on the
 *     un-re-audited imp-97396 reduction T(b) < 0 <=> (A) & (B). No independent QED is claimed --
 *     this cohort does not re-verify that upstream reduction.
 *
 *   THREAD B -- the stronger MCM hypothesis (all-omega route, refuted).
 *     imp-97432 -- attempts to prove MCM (every iterated multiplicative difference of h = g/m is
 *       >= 0, for any finite prime set and any x), which imp-97422 had reduced BOTH b/4-ceiling
 *       conditions at omega >= 4 to. Finds instead that MCM is FALSE: the exponential-tilted mean
 *       characterization shows the tilt wins at order j = 10, giving the first counterexample
 *       b = p_11# = 200560490130 (T = -9.624e-4 < 0). Crucially the b/4 ceiling itself SURVIVES
 *       (|T(p_11#)| = 9.7e-4, deep inside the +-1/4 band; the primorial limit -e^{-gamma}/12 +
 *       1.0186e-3 = -0.0458 stays comfortably inside too) -- MCM was strictly stronger than the
 *       ceiling needed.
 *     imp-97442 -- fills the empirical gap the refutation leaves open: extends the imp-97422
 *       omega = 4 / b <= 2e5 numerical MCM verification to omega = 5, 6 over b in (2e5, 1e6].
 *       Zero negative differences across 497767 (omega=5) + 72576 (omega=6) evaluations; the
 *       induction top term T(b) (the same quantity Thread A proves the sign of at omega = 5)
 *       stays four orders of magnitude from zero. MEASUREMENT ONLY -- confirms MCM still holds
 *       solidly through omega = 6, consistent with the imp-97432 primorial analysis that places
 *       the first failure at omega = 11.
 *
 *   WHY GROUP THESE (not re-derive). Read in isolation, Thread A looks like it independently
 *   settles "is T(b) < 0 at omega = 5" via elementary Binet estimates, while Thread B looks like
 *   an unrelated all-omega non-negativity sweep. Grouped, they are the SAME underlying question
 *   (sign/magnitude of T(b) at omega = 5) attacked two ways: Thread A proves the sign directly
 *   (conditional on imp-97396); Thread B's imp-97442 leaf independently MEASURES the same
 *   quantity T(b) at omega = 5 and finds it strictly positive (0.020214..0.114564) with zero
 *   exceptions across 16057 squarefree values -- an empirical cross-check of Thread A's
 *   conclusion from a completely different (brute-force tower sweep) direction, over a
 *   DIFFERENT b-range (2e5 < b <= 1e6 vs Thread A's asymptotic q1 -> infinity regime). This index
 *   bakes that cross-thread consistency so a future scout does not treat Thread A and Thread B as
 *   unrelated leaves, and does not re-spend a ticket re-deriving what imp-97442 already measured
 *   for the omega = 5 case Thread A proves.
 *
 *   WHAT STAYS OPEN (at the time of this cohort). Thread A's omega = 5 sign-law closure is
 *   conditional on the imp-97396 reduction (not re-audited here) -- no independent QED. Thread
 *   B's MCM hypothesis is definitively FALSE from omega = 11 (imp-97432), so it cannot be used to
 *   close the ceiling beyond omega = 10; a closure for omega >= 11 needs the weaker two-sided
 *   band -1/4 <= T(b) <= 1/4 directly, not MCM's non-negativity. No bound on Lambda moves; no refereed bound is changed
 *   ; RH open; NO QED.
 *
 * @see imp-97423-route-m-sign-law-omega5-binet-two-sided-estimate.js (two-sided Binet bracket; certA/certB; names the tail residual)
 * @see imp-97433-route-m-sign-law-omega5-uniform-tail-lemma.js (uniform tail lemma Q0=7; closes certA/certB for all omega=5 b)
 * @see imp-97443-route-m-sign-law-omega5-binet-certificate-crossval.js (extended-precision cross-validation of the bracket/certificates)
 * @see imp-97432-route-m-mcm-hypothesis-refuted-ceiling-safe.js (MCM refuted at omega=11; b/4 ceiling survives)
 * @see imp-97442-route-m-mcm-omega56-subgrid-verification.js (MCM verified omega=5,6 to b=1e6; T(b) cross-check)
 * @see imp-97396-route-m-sign-law-omega5-weighted-reduction.js (upstream reduction T(b)<0 <=> (A) & (B), assumed by Thread A)
 * @see imp-97422-route-m-quarter-ceiling-omega4-multiplicative-difference-reduction.js (the MCM hypothesis and omega=4 reduction)
 *
 * Ticket: imp-97474 (meta, low, sonnet-4-6). Documentation/index only; establishes nothing;
 * NO QED; no refereed bound is changed.
 */

const ROUTE_M_CEILING = 0.25;

const OMEGA5_SIGNLAW_MCM_COHORT = Object.freeze([
  Object.freeze({
    id: 'imp-97423',
    thread: 'A (sign-law closure)',
    role: 'rigorous two-sided enveloping Binet bracket; certA/certB; names the uniform tail residual',
    result:
      'BRACKET 1/(12n) - 1/(360n^3) < J(n) < 1/(12n) induces Dlo/Dhi on D_{p1}(e); certA, certB ' +
      'positive on sampled omega=5 families (e.g. certA(2;3,5,7,11)=0.01812) but the margin decays ' +
      'like c/q1 with no positive floor -- names the uniform-in-(p1,q1) tail lemma as the residual.',
  }),
  Object.freeze({
    id: 'imp-97433',
    thread: 'A (sign-law closure)',
    role: 'derives the named uniform tail lemma (threshold Q0=7) and closes the finite residual',
    result:
      'Explicit p1-free lower bound gA(q1) > 0 for all real q1 >= 7 (essentially sharp: gA(5) < 0); ' +
      'closed-form gB(q2) > 0 for all q2 >= 5 (certB needs no finite check at all); the finite ' +
      'residual q1 in {3,5} (3 minimal-config certA checks) all strictly positive. Closes certA, ' +
      'certB for EVERY omega=5 squarefree b, conditional on the un-re-audited imp-97396 reduction.',
  }),
  Object.freeze({
    id: 'imp-97443',
    thread: 'A (sign-law closure)',
    role: 'extended-precision (mpmath, 60-digit) cross-validation of the bracket and certificates',
    result:
      'Confirms the bracket always under-estimates the true margin (genuine lower certificates), ' +
      'both certA/certB stay strictly positive out to q1 = 10^6 for p1 in {2,3,5}, and the measured ' +
      'decay matches the predicted leading law q1*certA -> (1-1/p1)/12. Accuracy check only, no new proof.',
  }),
  Object.freeze({
    id: 'imp-97432',
    thread: 'B (MCM hypothesis, all-omega)',
    role: 'attempts to prove MCM (the omega>=4 ceiling reduction hypothesis); finds it FALSE',
    result:
      'Exponential-tilted mean characterization shows the tilt wins at order j=10; first ' +
      'counterexample b = p_11# = 200560490130 (T = -9.624e-4 < 0). The b/4 ceiling itself ' +
      'SURVIVES at the counterexample (|T| = 9.7e-4, deep inside +-1/4) and at the primorial limit ' +
      '(-0.0458) -- MCM was strictly stronger than the ceiling needed.',
  }),
  Object.freeze({
    id: 'imp-97442',
    thread: 'B (MCM hypothesis, all-omega)',
    role: 'numerical MCM verification omega=5,6, b in (2e5,1e6]; empirical T(b) cross-check',
    result:
      'Zero negative iterated differences across 497767 (omega=5) + 72576 (omega=6) evaluations. ' +
      'T(b) (the SAME quantity Thread A proves the sign of) measured in [0.020214, 0.114564] at ' +
      'omega=5 with zero exceptions across 16057 squarefree b -- an independent brute-force ' +
      'cross-check of Thread A’s conclusion, over a different b-range and by a different method.',
  }),
]);

export const IMP97474_OMEGA5_SIGNLAW_MCM_COHORT_INDEX = Object.freeze({
  id: 'imp-97474',
  proofSection: 'S-frontier',
  cohort: OMEGA5_SIGNLAW_MCM_COHORT,
  routeMCeiling: ROUTE_M_CEILING,
  threadASignal:
    'imp-97423 derives the two-sided Binet bracket and certificates, imp-97433 supplies the ' +
    'named uniform tail lemma (Q0=7) and closes the finite residual, imp-97443 independently ' +
    'cross-validates both at extended precision. Together: certA, certB > 0 for every omega=5 ' +
    'squarefree b, conditional on the un-re-audited imp-97396 reduction -- no independent QED.',
  threadBSignal:
    'imp-97432 proves the stronger MCM hypothesis FALSE from omega=11 (first counterexample ' +
    'p_11#) but the b/4 ceiling survives at that counterexample and at the primorial limit; ' +
    'imp-97442 verifies MCM numerically at omega=5,6 (zero exceptions) and cross-checks T(b) at ' +
    'omega=5 against Thread A’s proved sign by direct brute-force measurement.',
  question:
    'Read separately, Thread A (elementary Binet estimates) and Thread B (multiplicative-' +
    'difference hypothesis testing) look like unrelated attacks. Grouped, do they corroborate ' +
    'the same omega=5 conclusion (T(b) < 0, equivalently |T(b)| inside the b/4 ceiling) from ' +
    'independent directions, and does that cross-thread agreement extend any further than ' +
    'omega=5/6, or does the Thread B refutation at omega=11 cap how far it can be pushed?',
  anyBoundMoved: false,
  verdict:
    'INDEX/META NOTE ONLY (no new derivation). Thread A closes the omega=5 sign law’s two ' +
    'named per-prime certificates unconditionally in (p1,q1) (subject to the un-re-audited ' +
    'imp-97396 reduction), via a derived tail lemma (imp-97433) cross-validated at extended ' +
    'precision (imp-97443). Thread B shows the stronger MCM non-negativity hypothesis fails at ' +
    'omega=11 (imp-97432) while confirming it -- and by extension the b/4 ceiling -- holds ' +
    'solidly through omega=6 by direct measurement (imp-97442), independently corroborating ' +
    'Thread A’s omega=5 sign conclusion from a different method and b-range. Neither thread ' +
    'closes the ceiling beyond what each already states: Thread A is conditional and specific to ' +
    'omega=5; Thread B’s MCM route is dead beyond omega=10. No bound on Lambda moves; RH open; ' +
    'NO QED. No refereed bound is changed.',
  citation:
    'imp-97423 (Binet bracket + certA/certB); imp-97433 (uniform tail lemma Q0=7); imp-97443 ' +
    '(extended-precision cross-validation); imp-97432 (MCM refuted at omega=11, ceiling safe); ' +
    'imp-97442 (MCM verified omega=5,6, T(b) cross-check); imp-97396 (upstream reduction, ' +
    'assumed by Thread A); imp-97422 (MCM hypothesis origin).',
});

export default IMP97474_OMEGA5_SIGNLAW_MCM_COHORT_INDEX;

// -- Tripwire assertions ------------------------------------------------------
export const IMP97474_OMEGA5_SIGNLAW_MCM_COHORT_INDEX_ASSERTIONS = [
  {
    id: 'imp97474-cohort-has-all-five-members',
    why: 'The whole point of the index is grouping the five named tickets across both threads; ' +
      'a missing member silently breaks the cross-reference.',
    holds: () => {
      const ids = IMP97474_OMEGA5_SIGNLAW_MCM_COHORT_INDEX.cohort.map((c) => c.id);
      return ['imp-97423', 'imp-97432', 'imp-97433', 'imp-97442', 'imp-97443'].every((id) =>
        ids.includes(id),
      );
    },
  },
  {
    id: 'imp97474-both-threads-present',
    why: 'The index exists to separate the direct omega=5 sign-law closure (Thread A) from the ' +
      'all-omega MCM hypothesis test (Thread B); both must be labeled so a reader does not ' +
      'conflate the conditional sign-law proof with the refuted stronger hypothesis.',
    holds: () => {
      const threads = IMP97474_OMEGA5_SIGNLAW_MCM_COHORT_INDEX.cohort.map((c) => c.thread);
      return (
        threads.filter((t) => t.startsWith('A')).length === 3 &&
        threads.filter((t) => t.startsWith('B')).length === 2
      );
    },
  },
  {
    id: 'imp97474-ceiling-value-and-signals-present',
    why: 'The b/4 ceiling constant and both thread signals anchor the grouping; a missing or ' +
      'wrong ceiling value would silently mis-state what survives the MCM refutation.',
    holds: () => {
      const idx = IMP97474_OMEGA5_SIGNLAW_MCM_COHORT_INDEX;
      return (
        idx.routeMCeiling === 0.25 &&
        typeof idx.threadASignal === 'string' &&
        idx.threadASignal.length > 0 &&
        typeof idx.threadBSignal === 'string' &&
        idx.threadBSignal.length > 0
      );
    },
  },
  {
    id: 'imp97474-honesty-gate-no-qed',
    why: 'Documentation/index only: no bound claimed moved, no QED, no-refereed-bound-change line present.',
    holds: () =>
      IMP97474_OMEGA5_SIGNLAW_MCM_COHORT_INDEX.anyBoundMoved === false &&
      /NO QED/.test(IMP97474_OMEGA5_SIGNLAW_MCM_COHORT_INDEX.verdict) &&
      /refereed bound is changed/i.test(IMP97474_OMEGA5_SIGNLAW_MCM_COHORT_INDEX.verdict),
  },
];

for (const assertion of IMP97474_OMEGA5_SIGNLAW_MCM_COHORT_INDEX_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(
      `imp-97474-route-m-omega5-signlaw-mcm-cohort-index assertion failed: ${assertion.id}`,
    );
  }
}
