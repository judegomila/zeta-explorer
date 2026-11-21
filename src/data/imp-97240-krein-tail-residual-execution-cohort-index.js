/**
 * @module imp-97240-krein-tail-residual-execution-cohort-index
 * @fileoverview imp-97240 -- META cross-reference index note grouping the Krein-floor tail-residual
 *   EXECUTION cohort (imp-97100 Route B assessment / imp-97205 EASY-factor sigma_2 execution / imp-97177
 *   annihilating-trials glossary headword) as a single ARC, plus the still-open sub-gap
 *   IMP97100_PHASE_CANCELLATION_TRIAL, so future work reads the three completed leaves as "assess the
 *   split, execute the easy half, execute the hard half at the coefficient level" instead of three
 *   isolated tickets. Index/meta only; establishes nothing new; moves no bound; NO QED.
 *
 *   THE COHORT (chronological). All three act on the imp-96888/imp-96973 Krein-floor Rayleigh-tail
 *   residual scalar <v0|R_T|v0> = (1/(pi B)) int_{|t|>T} sigma_2(t) |g(t)|^2 dt, g(t) = v0 . Phih(t),
 *   sigma_2(t) = (t^2+1/4)^2 w1(t), the min-max UPPER bound on the t-truncation residual for the Route I
 *   Krein floor at 2a=ln3 (N=100).
 *     imp-97100 -- ASSESSES the conversion of this quadrature value into a rigorous interval majorant.
 *       Splits the integrand into an EASY factor sigma_2 (closed-form majorant available, no delicate
 *       content) and a HARD factor |g(t)|^2 (converges ONLY via inter-mode phase cancellation: measured
 *       decay <v0|R_T|v0> ~ T^-p, p~2.913, forces g(t) ~ t^-3.96 ~ t^-4 vs. single-mode t^-1, i.e. ~3
 *       orders of cancellation). Classifies three routes: A (mode-wise triangle) REJECTED -- diverges,
 *       re-loses all ~15 orders; B (combined phase-preserving panel enclosure) VIABLE -- tightest
 *       reachable; C (analytic far tail) CONDITIONAL on certified t^-4 decay. Names the residual: SUB-GAP
 *       IMP97100_PHASE_CANCELLATION_TRIAL, a fixed rational trial v0 with CERTIFIED g(t)=O(t^-4).
 *     imp-97205 -- EXECUTES the Route B EASY factor. Runs the closed-form sigma_2 majorant S2maj(t) over
 *       a dense 601-point grid on [T=4800,Tfar=60000]: the digamma remainder is NEGATIVE (helps rather
 *       than costs, so c=0 suffices), S2maj dominates sigma_2 at every grid point (min margin +6.92e10,
 *       ratio in [1.0000028,1.3455]), the panel-enclosure mechanism gives a tight 0.41%-width interval on
 *       a sample panel, and the far tail beyond Tfar carries only 0.064% of the mass. Converts sigma_2
 *       from "asserted closed-form" (imp-97100) to "computed-and-verified rigorous majorant", isolating
 *       the obstruction to the single HARD factor. The HARD factor itself is NOT executed here.
 *     imp-97177 -- glosses the imp-97134 execution of the HARD factor at the DEGREE-coefficient level:
 *       two exact-INTEGER trials (even degrees {0,2,4,6} -> (33,55,27,5); odd degrees {1,3,5,7} ->
 *       (143,273,165,35)) annihilate all six imp-97113 leading carrier functionals identically (integer
 *       arithmetic, no rounding), and evaluated against exact spherical-Bessel recursion both keep
 *       |g(z)| z^4 bounded and non-growing over z in {100..3200} (measured O(t^-4), vs. O(t^-1) for a
 *       generic non-annihilating trial). This is the exact cancellation imp-97100 identified as the HARD
 *       factor's content -- but it lives at the {d_k} degree-coefficient level, NOT as a certified
 *       rational v0 propagated through the committed overlap matrix C under interval arithmetic, which
 *       imp-97177 explicitly records as the step NOT done.
 *
 *   WHY GROUP THESE (not re-derive). Read individually, imp-97100 reads as an unexecuted assessment,
 *   imp-97205 reads as a partial execution that only ever touches the "easy" half, and imp-97177 reads as
 *   an unrelated glossary entry about integer kernels. Grouped, the three show the FULL current state of
 *   the Route B conversion: the EASY factor (sigma_2) is done and rigorous (imp-97205); the HARD factor's
 *   cancellation mechanism is exhibited exactly, at the coefficient level, with measured O(t^-4) decay
 *   (imp-97177/imp-97134) -- but the coefficient-level trial has NOT yet been mapped through the overlap
 *   matrix C into a certified-interval rational v0, so no finite rigorous majorant on the FULL scalar tail
 *   integral exists. A scout stopping after imp-97177 could mistake "exact-integer annihilation measured"
 *   for "phase-cancellation trial certified" -- it is not; the v0-overlap mapping step is the one piece
 *   still missing, and this index names it so it is not silently assumed done.
 *
 *   MEASURED / DERIVED (what each leaf actually establishes).
 *   - EASY/HARD split of the tail integrand, with Route A rejected (diverges), Route B viable (combined
 *     phase-preserving panel enclosure), Route C conditional; cancellation depth ~3 orders measured from
 *     the committed T-ladder (imp-97100, assessment).
 *   - sigma_2 EASY-factor majorant S2maj computed and rigorously verified to dominate sigma_2 on a dense
 *     grid (min margin +6.92e10, ratio in [1.0000028,1.3455]), c=0 suffices (digamma remainder negative),
 *     panel enclosure demonstrated tight (0.41% width), far tail beyond Tfar negligible (0.064%)
 *     (imp-97205, execution).
 *   - exact-integer degree-coefficient trials (d0..d6)=(33,55,27,5) even / (d1..d7)=(143,273,165,35) odd
 *     annihilate all six carrier functionals EXACTLY and measurably force g(t)=O(t^-4) against exact
 *     spherical-Bessel evaluation (imp-97177/imp-97134, execution at the {d_k} level).
 *
 *   NOT ESTABLISHED (what stays open).
 *   - SUB-GAP IMP97100_PHASE_CANCELLATION_TRIAL remains OPEN: the exact-integer {d_k} trials are not yet
 *     mapped through the committed overlap matrix C into a certified rational v0 with an interval-verified
 *     g(t)=O(t^-4) bound (imp-97177's own named residual).
 *   - no finite rigorous interval majorant exists on the FULL scalar tail integral (EASY factor alone is
 *     not enough); the Rayleigh value stays a QUADRATURE evaluation, an UPPER bound on lambda_min.
 *   - establishes NO operator positivity; interval-rigorous reach stays 2a<=0.96.
 *
 *   STATUS: a grouping/index note over three already-completed tickets, not a new derivation. No bound
 *   changes: the sigma_2 EASY factor is proved rigorous, the HARD factor's cancellation is exhibited
 *   exactly at the coefficient level but not yet certified as an interval majorant; no refereed bound is changed;
 *   RH open; NO QED.
 *
 * @see imp-97100-krein-rayleigh-tail-interval-majorant-assessment.js (Route B assessment; EASY/HARD split)
 * @see imp-97205-krein-routeb-sigma2-majorant-execution.js (EASY-factor sigma_2 execution, rigorous)
 * @see imp-97177-annihilating-rational-trials-glossary-headword.js (HARD-factor {d_k}-level execution gloss)
 * @see imp-97134-krein-annihilating-rational-trial-execution.js (source of the exact-integer trials)
 * @see imp-96888-krein-tresidual-rayleigh-permode-bound.js (min-max Rayleigh bound; source literals)
 * @see project_route_i_dual_certificate (Route I certificate program, memory)
 *
 * Ticket: imp-97240 (meta, low, sonnet-4-6). Documentation/index only; establishes nothing; NO QED;
 * no refereed bound is changed.
 */

import { IMP97100_VERDICT } from './imp-97100-krein-rayleigh-tail-interval-majorant-assessment.js';
import { IMP97205_VERDICT } from './imp-97205-krein-routeb-sigma2-majorant-execution.js';
import { IMP97177_ANNIHILATING_RATIONAL_TRIALS_GLOSSARY_HEADWORD } from './imp-97177-annihilating-rational-trials-glossary-headword.js';

const KREIN_TAIL_RESIDUAL_EXECUTION_COHORT = Object.freeze([
  Object.freeze({
    id: 'imp-97100',
    role: 'assesses the routes to convert the Rayleigh-tail quadrature into a rigorous interval majorant',
    result:
      'splits the tail integrand into an EASY factor (sigma_2, closed-form majorant) and a HARD factor ' +
      '(|g|^2, phase-cancellation-only convergence, ~3 orders measured); rejects mode-wise Route A ' +
      '(diverges), selects Route B (combined phase-preserving panel enclosure) as tightest reachable, ' +
      'names SUB-GAP IMP97100_PHASE_CANCELLATION_TRIAL.',
  }),
  Object.freeze({
    id: 'imp-97205',
    role: 'executes the Route B EASY factor (sigma_2) and verifies it rigorous',
    result:
      'closed-form majorant S2maj(t) computed on a dense grid on [4800,60000], dominates sigma_2 ' +
      'everywhere (min margin +6.92e10), tight (ratio up to 1.3455), c=0 suffices (digamma remainder ' +
      'negative), panel enclosure tight (0.41% width), far tail beyond Tfar negligible (0.064%); the ' +
      'HARD factor is NOT executed here.',
  }),
  Object.freeze({
    id: 'imp-97177',
    role: 'glosses the imp-97134 HARD-factor execution at the degree-coefficient level',
    result:
      'exact-integer trials (33,55,27,5) even / (143,273,165,35) odd annihilate all six carrier ' +
      'functionals identically and measurably force g(t)=O(t^-4); the mapping of these {d_k} ' +
      'coefficients through the overlap matrix C into a certified interval-rational v0 is explicitly ' +
      'NOT done, leaving IMP97100_PHASE_CANCELLATION_TRIAL open.',
  }),
]);

export const IMP97240_KREIN_TAIL_RESIDUAL_EXECUTION_COHORT_INDEX = Object.freeze({
  id: 'imp-97240',
  proofSection: 'S-frontier',
  cohort: KREIN_TAIL_RESIDUAL_EXECUTION_COHORT,
  measuredSignal:
    'the Krein-floor Rayleigh-tail residual EASY factor (sigma_2) now carries a rigorously verified ' +
    'closed-form majorant (imp-97205), and the HARD factor (|g|^2 phase cancellation) has been exhibited ' +
    'exactly at the degree-coefficient level with measured O(t^-4) decay (imp-97177/imp-97134) -- but the ' +
    'coefficient-level trial has not yet been certified as an interval-rational v0 through the overlap ' +
    'matrix C, so the sub-gap stays open.',
  namedResiduals: ['IMP97100_PHASE_CANCELLATION_TRIAL', 'IMP96888_RAYLEIGH_TAIL_MAJORANT'],
  easyFactorExecuted: true,
  hardFactorCoefficientLevelExecuted: true,
  hardFactorOverlapMapCertified: false,
  fullIntervalMajorantProduced: false,
  anyBoundMoved: false,
  question:
    'The Krein tail-residual execution cohort (imp-97100/97205/97177) reads as three separate tickets, ' +
    'and imp-97177 in isolation could read as "the phase-cancellation trial is done". Grouped, does the ' +
    'cohort show the full state of the Route B conversion and correctly pin what is still missing?',
  verdict:
    'INDEX/META NOTE ONLY (no new derivation). imp-97100 splits the Rayleigh-tail integrand into an EASY ' +
    'factor (sigma_2, closed-form) and a HARD factor (|g|^2, phase-cancellation-only), rejecting the ' +
    'mode-wise route and selecting the combined panel-enclosure route as tightest reachable; imp-97205 ' +
    'executes and rigorously verifies the EASY factor; imp-97177 (glossing imp-97134) exhibits the HARD ' +
    "factor's exact-integer cancellation at the degree-coefficient level with measured O(t^-4) decay. " +
    'Together these show the EASY half is fully discharged and the HARD half is solved at the coefficient ' +
    'level but NOT yet certified as an interval-rational trial vector through the overlap matrix -- so ' +
    'SUB-GAP IMP97100_PHASE_CANCELLATION_TRIAL remains the single open piece, not a fresh unknown. ' +
    'Establishes nothing new; moves no bound; no operator positivity; interval-rigorous reach stays ' +
    '2a<=0.96; RH open; NO QED. No refereed bound is changed.',
  citation:
    'imp-97100 (Route B assessment, EASY/HARD split); imp-97205 (EASY-factor sigma_2 execution, ' +
    'rigorous); imp-97177 (HARD-factor exact-integer coefficient-level execution gloss, sourcing imp-97134).',
});

export default IMP97240_KREIN_TAIL_RESIDUAL_EXECUTION_COHORT_INDEX;

// -- Tripwire assertions ------------------------------------------------------
export const IMP97240_KREIN_TAIL_RESIDUAL_EXECUTION_COHORT_INDEX_ASSERTIONS = [
  {
    id: 'imp97240-cohort-has-all-three-members',
    why: 'The whole point of the index is grouping exactly these three tickets; a missing member ' +
      'silently breaks the cross-reference.',
    holds: () => {
      const ids = IMP97240_KREIN_TAIL_RESIDUAL_EXECUTION_COHORT_INDEX.cohort.map((c) => c.id);
      return ['imp-97100', 'imp-97205', 'imp-97177'].every((id) => ids.includes(id));
    },
  },
  {
    id: 'imp97240-easy-factor-executed-consistent-with-imp97205',
    why: 'The index claims the EASY factor is rigorously executed; this must match the imp-97205 ' +
      'verdict bit-for-bit, not a paraphrase.',
    holds: () =>
      IMP97240_KREIN_TAIL_RESIDUAL_EXECUTION_COHORT_INDEX.easyFactorExecuted === true &&
      IMP97205_VERDICT.sigma2MajorantExecuted === true &&
      IMP97205_VERDICT.sigma2MajorantDominates === true,
  },
  {
    id: 'imp97240-hard-factor-open-not-certified',
    why: 'The whole point of this index is that the {d_k}-level execution (imp-97177) is NOT the same ' +
      'as a certified interval-rational trial; a flipped flag would silently misrepresent what remains ' +
      'open, letting a future scout skip the still-needed overlap-matrix step.',
    holds: () =>
      IMP97240_KREIN_TAIL_RESIDUAL_EXECUTION_COHORT_INDEX.hardFactorCoefficientLevelExecuted === true &&
      IMP97240_KREIN_TAIL_RESIDUAL_EXECUTION_COHORT_INDEX.hardFactorOverlapMapCertified === false &&
      IMP97240_KREIN_TAIL_RESIDUAL_EXECUTION_COHORT_INDEX.fullIntervalMajorantProduced === false &&
      IMP97205_VERDICT.phaseCancellationTrialOpen === true &&
      IMP97177_ANNIHILATING_RATIONAL_TRIALS_GLOSSARY_HEADWORD.anyBoundMoved === false,
  },
  {
    id: 'imp97240-named-residuals-present',
    why: 'The index exists to surface the open sub-gaps by name, so future work can find them without ' +
      're-reading all three tickets.',
    holds: () => {
      const idx = IMP97240_KREIN_TAIL_RESIDUAL_EXECUTION_COHORT_INDEX;
      return (
        Array.isArray(idx.namedResiduals) &&
        idx.namedResiduals.includes('IMP97100_PHASE_CANCELLATION_TRIAL') &&
        idx.namedResiduals.includes('IMP96888_RAYLEIGH_TAIL_MAJORANT') &&
        idx.anyBoundMoved === false
      );
    },
  },
  {
    id: 'imp97240-consistent-with-imp97100-routes',
    why: 'The index reuses the imp-97100 route classification; it must not contradict which route was ' +
      'selected as tightest reachable.',
    holds: () =>
      IMP97100_VERDICT.routeAModeWiseRejected === true &&
      IMP97100_VERDICT.routeBPhasePreservingViable === true &&
      IMP97100_VERDICT.intervalRigorousReachUnchanged === 0.96,
  },
  {
    id: 'imp97240-honesty-gate-no-qed',
    why: 'Documentation/index only: no bound claimed moved, no QED, no-refereed-bound-change line present.',
    holds: () =>
      /NO QED/.test(IMP97240_KREIN_TAIL_RESIDUAL_EXECUTION_COHORT_INDEX.verdict) &&
      /refereed bound is changed/i.test(IMP97240_KREIN_TAIL_RESIDUAL_EXECUTION_COHORT_INDEX.verdict) &&
      /RH open/.test(IMP97240_KREIN_TAIL_RESIDUAL_EXECUTION_COHORT_INDEX.verdict),
  },
];

for (const assertion of IMP97240_KREIN_TAIL_RESIDUAL_EXECUTION_COHORT_INDEX_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(
      `imp-97240-krein-tail-residual-execution-cohort-index assertion failed: ${assertion.id}`,
    );
  }
}
