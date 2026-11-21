/**
 * @module imp-97132-krein-rayleigh-tail-majorant-cohort-index
 * @fileoverview imp-97132 -- META cross-reference index note grouping the Krein Rayleigh-tail-majorant
 *   cohort (imp-96888, imp-96973, imp-97002, imp-97100) as a single QUADRATURE-vs-CERTIFIED-MAJORANT
 *   family, so future work does not re-read the four tickets in isolation and mistake the measured
 *   Rayleigh quadrature value for a rigorous interval majorant. Index/meta only; establishes nothing
 *   new; changes no bound; NO QED.
 *
 *   THE COHORT (chronological). All four scout the same object: the t-truncation residual bound for the
 *   Route I Krein floor lambda_min(T_a[sigma_2]), and whether it can be tightened past the ~15-order
 *   vacuous Weyl/trace bounds into something rigorous.
 *     imp-96888 -- assembles the tail block R_T and DERIVES the min-max Rayleigh form <v0|R_T|v0> as the
 *       sharp residual bound: it refutes the imp-96876 "control lambda_max(R_T) directly" prescription
 *       (lambda_max is itself ~1.66e15x vacuous; the lambda_max<=Tr step is only ~1.9x, benign) and shows
 *       the Rayleigh quadratic form in the truncated ground state v0 recovers ~15 orders (1.17-2.24x the
 *       measured residual across T in {4800,6400,9600}), because lambda_min sits at the opposite spectral
 *       end from the R_T mass.
 *     imp-96973 -- RECONCILES the imp-96876-vs-imp-96888 tension into an exact multiplicative
 *       factorisation Tr/actual = [Tr/lammax] x [lammax/rayleigh] x [rayleigh/actual], showing ALL ~14-15
 *       orders live in the middle (spectral-gap) factor at every one of three (N,2a) rungs, confirming
 *       imp-96888 and correcting imp-96876/imp-96900's step-1 mis-localisation.
 *     imp-97002 -- import-light viz-data leaf reshaping the imp-96973 three-rung factorisation table into
 *       chart-ready rows (plus a log10-scaled variant, since step2 spans ~13-15 orders while step1/step3
 *       sit near 1-2x). Presentation only; same honest quadrature caveat.
 *     imp-97100 -- ASSESSES the routes to convert the imp-96888/imp-96973 quadrature Rayleigh value into a
 *       rigorous interval majorant. Splits the integrand into an EASY sigma_2 factor (closed-form digamma
 *       majorant) and a HARD |g(t)|^2 factor (smallness is ~3-order inter-mode phase cancellation, not
 *       single-mode decay); rejects mode-wise interval bounds (Route A, diverges); finds a combined
 *       phase-preserving panel enclosure (Route B) viable in principle but NOT executed; names the residual
 *       IMP97100_PHASE_CANCELLATION_TRIAL, a refinement of IMP96888_RAYLEIGH_TAIL_MAJORANT.
 *
 *   WHY GROUP THESE (not re-derive). Read individually, imp-96888/96973 read as a derivation-plus-
 *   reconciliation of a tight residual bound, imp-97002 as an unrelated presentation leaf, and imp-97100 as
 *   a separate feasibility study. Read together, the cohort is one derivation (96888) that DISCOVERS the
 *   sharp quantity, one reconciliation (96973) that PROVES the attribution is robust and (N,2a)-invariant,
 *   one presentation (97002) of that same table, and one assessment (97100) that draws the sharp line
 *   between "quadrature value" and "rigorous interval majorant" and names exactly what closing that line
 *   requires. This index bakes that reading so a future scout does not re-cite the Rayleigh quadrature
 *   value (1.17-2.24x the measured residual) as a certified majorant, and does not re-attempt Route A
 *   (mode-wise triangle bound), which the cohort already shows diverges.
 *
 *   MEASURED (quadrature; NOT rigorous interval majorants).
 *   - Rayleigh form <v0|R_T|v0> recovers ~15 orders vs lambda_max(R_T) and Tr(B^-1 R_T), landing within
 *     1.17x (T=4800) to 2.24x (T=9600) of the measured residual (imp-96888).
 *   - the total vacuity factorises exactly as [sum-vs-single ~1.9x] x [spectral gap ~1e14-1e15x] x
 *     [trial-vector slack ~1.17-1.19x], robust across three (N,2a) rungs (imp-96973).
 *   - the Rayleigh tail decays like T^{-p}, p ~ 2.91-2.95 measured, forcing the ground-state combination
 *     g(t) ~ t^{-4} (single Bessel modes decay only t^{-1}: a ~3-order cancellation depth) (imp-97100).
 *
 *   NOT ESTABLISHED (what stays open).
 *   - no rigorous interval majorant for the scalar tail integral has been produced (IMP96888_RAYLEIGH_TAIL_
 *     MAJORANT, refined by IMP97100_PHASE_CANCELLATION_TRIAL: a fixed rational trial with CERTIFIED
 *     g(t) = O(t^{-4}) decay is the missing object).
 *   - Route A (mode-wise triangle enclosure) is REJECTED (re-loses all ~15 orders); Route B (combined
 *     phase-preserving panel enclosure) is assessed VIABLE but not executed; Route C (analytic far tail)
 *     is CONDITIONAL on the same certified decay.
 *   - operator positivity is NOT established (Rayleigh floors are UPPER bounds on the true lambda_min);
 *     IMP96749_UNIFORM_N_GAP_UNSETTLED stays open; interval-rigorous certified reach stays 2a<=0.96.
 *
 *   STATUS: a grouping/index note over four already-completed tickets, not a new derivation. No bound
 *   changes: interval-rigorous certified reach stays 2a<=0.96; RH open; NO QED. No refereed bound is changed.
 *
 * @see imp-96888-krein-tresidual-rayleigh-permode-bound.js (derives the min-max Rayleigh residual bound)
 * @see imp-96973-krein-tailtrace-vacuity-factorisation.js (reconciles the 3-factor vacuity attribution)
 * @see imp-97002-krein-vacuity-factorisation-viz-data.js (viz-data leaf presenting the imp-96973 table)
 * @see imp-97100-krein-rayleigh-tail-interval-majorant-assessment.js (assesses quadrature-to-majorant routes)
 *
 * Ticket: imp-97132 (meta, low, sonnet-4-6). Documentation/index only; establishes nothing; NO QED;
 * no refereed bound is changed.
 */

const LN3 = Math.log(3); // 1.0986122886681098

const RAYLEIGH_TAIL_MAJORANT_COHORT = Object.freeze([
  Object.freeze({
    id: 'imp-96888',
    role: 'assembles R_T and derives the min-max Rayleigh residual bound',
    result:
      'REFUTES the imp-96876 lambda_max prescription (lambda_max(R_T) still ~1.66e15x vacuous; the ' +
      'lambda_max<=Tr step is only ~1.9x, benign). The Rayleigh form <v0|R_T|v0> recovers ~15 orders, ' +
      'landing within 1.17-2.24x of the measured residual across T in {4800,6400,9600}.',
  }),
  Object.freeze({
    id: 'imp-96973',
    role: 'reconciles the imp-96876 vs imp-96888 tension via exact factorisation',
    result:
      'Tr/actual = [sum-vs-single ~1.9x] x [spectral gap ~1e14-1e15x] x [trial slack ~1.17-1.19x], ' +
      'exact at every rung, robust across three (N,2a) points: ALL ~14-15 orders live in the spectral-' +
      'gap factor, confirming imp-96888 and correcting imp-96876/imp-96900.',
  }),
  Object.freeze({
    id: 'imp-97002',
    role: 'import-light viz-data leaf for the imp-96973 factorisation table',
    result:
      'Presentation only: chart-ready per-rung rows plus a log10-scaled variant (step2 spans ~13-15 ' +
      'orders while step1/step3 sit near 1-2x), same honest quadrature-not-majorant caveat.',
  }),
  Object.freeze({
    id: 'imp-97100',
    role: 'assesses quadrature-to-rigorous-interval-majorant conversion routes',
    result:
      'splits the integrand into an EASY sigma_2 factor (closed-form majorant) and a HARD phase-' +
      'cancellation factor (g(t) ~ t^-4, ~3 orders faster than single Bessel modes). Route A (mode-' +
      'wise) REJECTED, Route B (phase-preserving panel) VIABLE but not executed. Names SUB-GAP ' +
      'IMP97100_PHASE_CANCELLATION_TRIAL, refining IMP96888_RAYLEIGH_TAIL_MAJORANT.',
  }),
]);

export const IMP97132_RAYLEIGH_TAIL_MAJORANT_COHORT_INDEX = Object.freeze({
  id: 'imp-97132',
  proofSection: 'S-residual',
  cohort: RAYLEIGH_TAIL_MAJORANT_COHORT,
  measuredSignal:
    'the min-max Rayleigh form <v0|R_T|v0> is the sharp t-truncation residual bound, recovering ~15 ' +
    'orders vs the Weyl/trace bounds (imp-96888) via an exact, (N,2a)-robust three-factor vacuity ' +
    'factorisation (imp-96973); the tail decays like T^-2.9, forcing a ~3-order inter-mode phase ' +
    'cancellation in the ground-state combination g(t) ~ t^-4 (imp-97100).',
  namedResiduals: [
    'IMP96888_RAYLEIGH_TAIL_MAJORANT',
    'IMP97100_PHASE_CANCELLATION_TRIAL',
    'IMP96749_UNIFORM_N_GAP_UNSETTLED',
  ],
  certifiedReach: 0.96,
  intervalMajorantProduced: false,
  question:
    'The Krein Rayleigh-tail-majorant cohort (imp-96888/96973/97002/97100) reads as four separate ' +
    'tickets. Grouped, does the measured Rayleigh quadrature value amount to a rigorous interval ' +
    'majorant for the t-truncation residual, or does it remain a quadrature evaluation with the ' +
    'certified-majorant conversion still open?',
  anyBoundMoved: false,
  verdict:
    'INDEX/META NOTE ONLY (no new derivation). imp-96888 derives the min-max Rayleigh form as the ' +
    'sharp residual bound and refutes the prior lambda_max prescription; imp-96973 reconciles that ' +
    'with an exact, rung-robust three-factor vacuity factorisation; imp-97002 presents the same table; ' +
    'imp-97100 then assesses -- and does NOT close -- the conversion from quadrature value to rigorous ' +
    'interval majorant, rejecting the naive mode-wise route and naming the fixed-rational-trial-with-' +
    'certified-decay residual (IMP97100_PHASE_CANCELLATION_TRIAL) that a future majorant needs. So the ' +
    'cohort as a whole is a QUADRATURE-vs-CERTIFIED-MAJORANT family: the Rayleigh residual bound is real, ' +
    'exactly attributed, and (N,2a)-robust, but it does not yet amount to a rigorous interval majorant. ' +
    'No operator positivity is established; interval-rigorous certified reach stays EXACTLY 2a<=0.96, ' +
    'unchanged by this whole cohort. Future work on this thread should not re-cite the Rayleigh ' +
    'quadrature ratio (1.17-2.24x) as a certified majorant, and should not re-attempt Route A (mode-wise ' +
    'triangle enclosure), which this cohort already shows diverges. Establishes nothing new; moves no ' +
    'bound; RH open; NO QED. No refereed bound is changed.',
  citation:
    'imp-96888 (Rayleigh residual derivation); imp-96973 (three-factor vacuity reconciliation); ' +
    'imp-97002 (viz-data leaf); imp-97100 (majorant-conversion route assessment).',
  ln3: LN3,
});

export default IMP97132_RAYLEIGH_TAIL_MAJORANT_COHORT_INDEX;

// -- Tripwire assertions ------------------------------------------------------
export const IMP97132_RAYLEIGH_TAIL_MAJORANT_COHORT_INDEX_ASSERTIONS = [
  {
    id: 'imp97132-cohort-has-all-four-members',
    why: 'The whole point of the index is grouping exactly these four tickets; a missing member ' +
      'silently breaks the cross-reference.',
    holds: () => {
      const ids = IMP97132_RAYLEIGH_TAIL_MAJORANT_COHORT_INDEX.cohort.map((c) => c.id);
      return ['imp-96888', 'imp-96973', 'imp-97002', 'imp-97100'].every((id) => ids.includes(id));
    },
  },
  {
    id: 'imp97132-named-residuals-present',
    why: 'The index exists to surface the open sub-gaps by name, so future work can find them without ' +
      're-reading all four tickets.',
    holds: () => {
      const idx = IMP97132_RAYLEIGH_TAIL_MAJORANT_COHORT_INDEX;
      return (
        Array.isArray(idx.namedResiduals) &&
        idx.namedResiduals.includes('IMP96888_RAYLEIGH_TAIL_MAJORANT') &&
        idx.namedResiduals.includes('IMP97100_PHASE_CANCELLATION_TRIAL') &&
        idx.intervalMajorantProduced === false &&
        idx.certifiedReach === 0.96 &&
        idx.certifiedReach < idx.ln3
      );
    },
  },
  {
    id: 'imp97132-honesty-gate-no-qed',
    why: 'Documentation/index only: no bound claimed moved, no QED, no-refereed-bound-change line present.',
    holds: () =>
      IMP97132_RAYLEIGH_TAIL_MAJORANT_COHORT_INDEX.anyBoundMoved === false &&
      /NO QED/.test(IMP97132_RAYLEIGH_TAIL_MAJORANT_COHORT_INDEX.verdict) &&
      /refereed bound is changed/i.test(IMP97132_RAYLEIGH_TAIL_MAJORANT_COHORT_INDEX.verdict) &&
      /2a<=0\.96/.test(IMP97132_RAYLEIGH_TAIL_MAJORANT_COHORT_INDEX.verdict),
  },
];

for (const assertion of IMP97132_RAYLEIGH_TAIL_MAJORANT_COHORT_INDEX_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(
      `imp-97132-krein-rayleigh-tail-majorant-cohort-index assertion failed: ${assertion.id}`,
    );
  }
}
