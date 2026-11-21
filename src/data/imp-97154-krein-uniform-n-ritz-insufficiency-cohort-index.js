/**
 * @module imp-97154-krein-uniform-n-ritz-insufficiency-cohort-index
 * @fileoverview imp-97154 -- META cross-reference index note grouping the uniform-N Krein-floor
 *   lower-bound cohort (imp-96749, imp-97100, imp-97120, imp-97121) as a single RITZ-UPPER-BOUNDS-
 *   INSUFFICIENT family, so future work does not re-read the four tickets in isolation and mistake a
 *   measured Ritz/Rayleigh estimate of lambda_min(T_a[sigma_2]) for a certified lower bound, or forget
 *   that the uniform-in-N positivity question stays open. Index/meta only; establishes nothing new;
 *   changes no bound; NO QED.
 *
 *   THE COHORT (chronological). All four scout the same object: whether the Route I Krein floor
 *   lambda_min(T_a[sigma_2]) stays non-negative UNIFORMLY as the truncation size N grows, at or past
 *   2a=ln3.
 *     imp-96749 -- measures whether lambda_min(T_a[sigma_2]) stays strictly positive past 2a=1.0 as N
 *       grows, and flags this as the open uniform-in-N / de Branges realisation question: the finite
 *       trig-polynomial certificate has negative margin there, but that does not settle true operator
 *       positivity. Measurement only, no positivity theorem. Names IMP96749_UNIFORM_N_GAP_UNSETTLED.
 *     imp-97100 -- assesses routes to convert Ritz/Rayleigh-tail quadrature evaluations into a rigorous
 *       interval majorant for the t-truncation residual; finds a combined phase-preserving panel
 *       enclosure (Route B) viable in principle but NOT executed, and names SUB-GAP
 *       IMP97100_PHASE_CANCELLATION_TRIAL. Assessment only, no operator positivity claimed.
 *     imp-97120 -- measures the T-only Ritz-eta convergence rate at fixed large N_big for the 2a=ln3
 *       Krein floor, isolating whether the imp-97058 exponent q~0.354 is a genuine algebraic rate. The
 *       Ritz value is an UPPER bound on lambda_1(T), so the measured eta_inf is an upper estimate, not
 *       a certified lower bound on the floor.
 *     imp-97121 -- scopes what a uniform-in-N Krein floor certificate at 2a=ln3 would require, given
 *       the fixed-N interval-rigorous reach stays 2a<=0.96 with no proof lambda_min stays non-negative
 *       uniformly as N grows; explicitly names/reinforces IMP96749_UNIFORM_N_GAP_UNSETTLED as the open
 *       residual. Scoping only, produces no certificate.
 *
 *   WHY GROUP THESE (not re-derive). Read individually, imp-96749 reads as an isolated N-sensitivity
 *   measurement, imp-97100 as an unrelated majorant-conversion feasibility study, imp-97120 as a
 *   convergence-rate exponent fit, and imp-97121 as a restatement of an open question. Read together,
 *   the cohort is one story: every quantity measured so far (Rayleigh quadrature in imp-97100, Ritz
 *   eigenvalue in imp-97120) is an UPPER bound on the true lambda_min(T_a[sigma_2]), never a certified
 *   lower bound, and the uniform-in-N question imp-96749 raises is exactly the gap imp-97121 scopes and
 *   finds still unclosed. This index bakes that reading so a future scout does not re-cite a Ritz or
 *   Rayleigh estimate as if it were a certified positivity floor, and does not re-attempt a fixed-N
 *   argument expecting it to settle the N->infinity behaviour.
 *
 *   MEASURED (upper-bound estimates; NOT certified lower bounds).
 *   - the finite trig-polynomial certificate for lambda_min(T_a[sigma_2]) has negative margin past
 *     2a=1.0 as N grows, with no proof of true operator positivity there (imp-96749).
 *   - Route B (combined phase-preserving panel enclosure) is assessed viable in principle for the
 *     t-truncation residual majorant, but has NOT been executed (imp-97100).
 *   - the Ritz-eta convergence exponent at 2a=ln3 measures q~0.354 (T-only, decoupled from the N_big
 *     side), but the Ritz value itself is an upper bound on lambda_1(T), so eta_inf is an upper
 *     estimate (imp-97120).
 *   - the fixed-N interval-rigorous certified reach stays exactly 2a<=0.96 (imp-97121).
 *
 *   NOT ESTABLISHED (what stays open).
 *   - no uniform-in-N certificate exists: IMP96749_UNIFORM_N_GAP_UNSETTLED stays open, raised in
 *     imp-96749 and explicitly reinforced (not closed) by imp-97121's scoping pass.
 *   - IMP97100_PHASE_CANCELLATION_TRIAL (the fixed-rational-trial-with-certified-decay object needed
 *     for a rigorous interval majorant) remains unclosed.
 *   - no Ritz or Rayleigh quantity measured across this cohort amounts to a certified LOWER bound on
 *     lambda_min(T_a[sigma_2]); all are upper-bound estimates (Rayleigh-Ritz variational principle).
 *   - operator positivity past the certified reach is NOT established; interval-rigorous certified
 *     reach stays 2a<=0.96.
 *
 *   STATUS: a grouping/index note over four already-completed tickets, not a new derivation. No bound
 *   changes: interval-rigorous certified reach stays 2a<=0.96; RH open; NO QED. No refereed bound is changed.
 *
 * @see imp-96749-krein-uniform-n-positivity-margin.js (raises the uniform-N positivity question)
 * @see imp-97100-krein-rayleigh-tail-interval-majorant-assessment.js (assesses majorant-conversion routes)
 * @see imp-97120-krein-ritz-eta-t-only-convergence-rate.js (measures the T-only Ritz-eta exponent)
 * @see imp-97121-krein-uniform-n-certificate-scoping.js (scopes the missing uniform-N certificate)
 *
 * Ticket: imp-97154 (meta, low, sonnet-4-6). Documentation/index only; establishes nothing; NO QED;
 * no refereed bound is changed.
 */

const LN3 = Math.log(3); // 1.0986122886681098

const KREIN_UNIFORM_N_RITZ_INSUFFICIENCY_COHORT = Object.freeze([
  Object.freeze({
    id: 'imp-96749',
    role: 'raises the uniform-N positivity question for lambda_min(T_a[sigma_2])',
    result:
      'the finite trig-polynomial certificate has negative margin past 2a=1.0 as truncation N grows; ' +
      'no proof that true operator positivity persists uniformly in N. Measurement only, names ' +
      'IMP96749_UNIFORM_N_GAP_UNSETTLED.',
  }),
  Object.freeze({
    id: 'imp-97100',
    role: 'assesses quadrature-to-rigorous-interval-majorant conversion routes',
    result:
      'finds a combined phase-preserving panel enclosure (Route B) viable in principle for the ' +
      't-truncation residual majorant but NOT executed. Names SUB-GAP ' +
      'IMP97100_PHASE_CANCELLATION_TRIAL.',
  }),
  Object.freeze({
    id: 'imp-97120',
    role: 'measures the T-only Ritz-eta convergence rate at fixed large N_big',
    result:
      'isolates exponent q~0.354 at 2a=ln3, decoupled from the N_big side; the Ritz value is an UPPER ' +
      'bound on lambda_1(T), so the measured eta_inf is an upper estimate, not a certified lower ' +
      'bound on the floor.',
  }),
  Object.freeze({
    id: 'imp-97121',
    role: 'scopes what a uniform-in-N Krein floor certificate at 2a=ln3 would require',
    result:
      'fixed-N interval-rigorous reach stays 2a<=0.96 with no proof lambda_min stays non-negative ' +
      'uniformly as N grows; reinforces IMP96749_UNIFORM_N_GAP_UNSETTLED as still open. Scoping only, ' +
      'produces no certificate.',
  }),
]);

export const IMP97154_KREIN_UNIFORM_N_RITZ_INSUFFICIENCY_COHORT_INDEX = Object.freeze({
  id: 'imp-97154',
  proofSection: 'S-residual',
  cohort: KREIN_UNIFORM_N_RITZ_INSUFFICIENCY_COHORT,
  measuredSignal:
    'every quantity measured across this cohort -- the Rayleigh-tail quadrature estimate (imp-97100) ' +
    'and the Ritz eigenvalue estimate (imp-97120) -- is an UPPER bound on the true ' +
    'lambda_min(T_a[sigma_2]), never a certified lower bound, while the uniform-in-N positivity ' +
    'question imp-96749 raises is exactly the gap imp-97121 scopes and finds still unclosed.',
  namedResiduals: [
    'IMP96749_UNIFORM_N_GAP_UNSETTLED',
    'IMP97100_PHASE_CANCELLATION_TRIAL',
  ],
  certifiedReach: 0.96,
  intervalMajorantProduced: false,
  question:
    'The uniform-N Krein-floor lower-bound cohort (imp-96749/97100/97120/97121) reads as four separate ' +
    'tickets. Grouped, do the measured Ritz/Rayleigh estimates amount to a certified lower bound on ' +
    'lambda_min(T_a[sigma_2]) uniformly in N, or does the uniform-in-N gap remain open with only ' +
    'upper-bound estimates in hand?',
  anyBoundMoved: false,
  verdict:
    'INDEX/META NOTE ONLY (no new derivation). imp-96749 raises the uniform-N positivity question and ' +
    'names the open gap; imp-97100 assesses -- and does NOT close -- the quadrature-to-rigorous-' +
    'majorant conversion needed for the t-truncation residual; imp-97120 measures a Ritz-eta ' +
    'convergence exponent that is itself an upper-bound estimate, not a certified floor; imp-97121 ' +
    'scopes the missing uniform-N certificate and reinforces that it stays unclosed. So the cohort as ' +
    'a whole is a RITZ-UPPER-BOUNDS-INSUFFICIENT family: every measured quantity so far bounds ' +
    'lambda_min(T_a[sigma_2]) from above (Rayleigh-Ritz variational principle), none from below, and ' +
    'the uniform-in-N question stays exactly as open as imp-96749 left it. No operator positivity is ' +
    'established past the fixed-N reach; interval-rigorous certified reach stays EXACTLY 2a<=0.96, ' +
    'unchanged by this whole cohort. Future work on this thread should not re-cite a Ritz or Rayleigh ' +
    'estimate as a certified lower bound, and should treat IMP96749_UNIFORM_N_GAP_UNSETTLED as still ' +
    'open. Establishes nothing new; moves no bound; RH open; NO QED. No refereed bound is changed' +
    '.',
  citation:
    'imp-96749 (uniform-N positivity question); imp-97100 (majorant-conversion route assessment); ' +
    'imp-97120 (T-only Ritz-eta convergence rate); imp-97121 (uniform-N certificate scoping).',
  ln3: LN3,
});

export default IMP97154_KREIN_UNIFORM_N_RITZ_INSUFFICIENCY_COHORT_INDEX;

// -- Tripwire assertions ------------------------------------------------------
export const IMP97154_KREIN_UNIFORM_N_RITZ_INSUFFICIENCY_COHORT_INDEX_ASSERTIONS = [
  {
    id: 'imp97154-cohort-has-all-four-members',
    why: 'The whole point of the index is grouping exactly these four tickets; a missing member ' +
      'silently breaks the cross-reference.',
    holds: () => {
      const ids = IMP97154_KREIN_UNIFORM_N_RITZ_INSUFFICIENCY_COHORT_INDEX.cohort.map((c) => c.id);
      return ['imp-96749', 'imp-97100', 'imp-97120', 'imp-97121'].every((id) => ids.includes(id));
    },
  },
  {
    id: 'imp97154-named-residuals-present',
    why: 'The index exists to surface the open sub-gaps by name, so future work can find them without ' +
      're-reading all four tickets.',
    holds: () => {
      const idx = IMP97154_KREIN_UNIFORM_N_RITZ_INSUFFICIENCY_COHORT_INDEX;
      return (
        Array.isArray(idx.namedResiduals) &&
        idx.namedResiduals.includes('IMP96749_UNIFORM_N_GAP_UNSETTLED') &&
        idx.namedResiduals.includes('IMP97100_PHASE_CANCELLATION_TRIAL') &&
        idx.intervalMajorantProduced === false &&
        idx.certifiedReach === 0.96 &&
        idx.certifiedReach < idx.ln3
      );
    },
  },
  {
    id: 'imp97154-honesty-gate-no-qed',
    why: 'Documentation/index only: no bound claimed moved, no QED, no-refereed-bound-change line present.',
    holds: () =>
      IMP97154_KREIN_UNIFORM_N_RITZ_INSUFFICIENCY_COHORT_INDEX.anyBoundMoved === false &&
      /NO QED/.test(IMP97154_KREIN_UNIFORM_N_RITZ_INSUFFICIENCY_COHORT_INDEX.verdict) &&
      /refereed bound is changed/i.test(IMP97154_KREIN_UNIFORM_N_RITZ_INSUFFICIENCY_COHORT_INDEX.verdict) &&
      /2a<=0\.96/.test(IMP97154_KREIN_UNIFORM_N_RITZ_INSUFFICIENCY_COHORT_INDEX.verdict),
  },
];

for (const assertion of IMP97154_KREIN_UNIFORM_N_RITZ_INSUFFICIENCY_COHORT_INDEX_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(
      `imp-97154-krein-uniform-n-ritz-insufficiency-cohort-index assertion failed: ${assertion.id}`,
    );
  }
}
