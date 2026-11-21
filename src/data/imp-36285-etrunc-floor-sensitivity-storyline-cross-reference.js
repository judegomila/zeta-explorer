/**
 * @module imp-36285-etrunc-floor-sensitivity-storyline-cross-reference
 * @fileoverview imp-36285 -- read-only cross-reference NARRATIVE assembling the two
 *   E_trunc fixed-strip floor-sensitivity readouts that bracket the sigma(N) curve: (1) the
 *   imp-3443 interior-MAX elasticity (~-1.37), which shows the imp-3406 sigma(N) turnover
 *   N_max ~ 9.22e5 moves super-linearly as N_max ~ (1/E_trunc)^1.376, and (2) the imp-36139
 *   far-right E_trunc = E_coll crossover elasticity (~-2.095), which shows the imp-35968
 *   sigma = 1/2 landmark N_cross ~ 3.28e9 moves as N_cross ~ E_trunc^{-2.095}. Both readings
 *   share the SAME imp-2631 fixed-strip floor value E_trunc = 3.06e-5 as their common anchor.
 *   Assembly / cross-reference ONLY: derives nothing new, closes nothing, discharges no gap,
 *   respects the imp-2519 no-overclaim guard, NO QED.
 *
 *   THE ARC (imports each stage verbatim from its source module)
 *   --------------------------------------------------------------
 *   Stage 1 -- interior-MAX floor sensitivity: imp-3443 re-runs the imp-3406 ternary search
 *   for the sigma(N) turnover N_max over a half-to-double E_trunc grid and finds a NEAR power
 *   law N_max ~ (1/E_trunc)^1.376 (local elasticity ~-1.373 at the baseline), so the imp-3406
 *   N_max ~ 9.22e5 landmark is a floor-value artifact, not a robust feature.
 *   Stage 2 -- far-right crossover floor sensitivity: imp-36139 re-runs the imp-35968
 *   bisection for the sigma = 1/2 landmark N_cross over the SAME half-to-double E_trunc grid
 *   and finds a clean power law N_cross ~ E_trunc^{-2.095}, fractionally steeper than the
 *   imp-33723 closed-form -2 (the excess ~-0.095 traced to the log T0(N_cross) growth term).
 *   Stage 3 -- SHARED FRAMING: both elasticities are floor-sensitivity readouts of the single
 *   imp-2631 constant E_trunc = 3.06e-5, not intrinsic landmarks of the sigma(N) curve --
 *   the interior peak and the far-right crossover both move if that one fixed-strip floor
 *   value is revised, at different but both super-unity elasticities (~1.37 vs ~2.10).
 *
 *   WHAT IS DERIVED VS STILL-OPEN (the clarification this note exists to state)
 *   ------------------------------------------------------------------------
 *   DERIVED (measured): the imp-3443 interior-MAX elasticity/power-law; the imp-36139
 *   far-right crossover elasticity/power-law; the shared framing that both are readouts of
 *   the same imp-2631 floor constant.
 *   STILL OPEN: any first-principles justification for the imp-2631 fixed-strip floor value
 *   itself; whether a tighter (non-fixed-strip) E_trunc route would change either exponent;
 *   any bound or bridge closure. Neither MEASURED elasticity discharges either OPEN item;
 *   this note only states that the two sensitivities are two readouts of one shared input.
 *
 *   @see src/data/imp-3443-nmax-etrunc-sensitivity.js (Stage 1 source: interior-MAX elasticity ~-1.37, power exponent ~1.376)
 *   @see src/data/imp-36139-etrunc-coll-crossover-sensitivity.js (Stage 2 source: far-right crossover elasticity ~-2.095)
 *   @see src/data/imp-3406-sigma-highN-extrapolation.js (the interior MAX landmark N_max ~ 9.22e5 this note re-frames)
 *   @see src/data/imp-35968-e-trunc-coll-crossover-location.js (the sigma=1/2 crossover landmark N_cross ~ 3.28e9 this note re-frames)
 *
 *   Ticket: imp-36285 (content, low). Note only; imports source verdicts verbatim; changes
 *   no bound; NO QED; no refereed bound is changed.
 */

import { IMP3443_NMAX_ETRUNC_SENSITIVITY } from './imp-3443-nmax-etrunc-sensitivity.js';
import { IMP36139_ETRUNC_COLL_CROSSOVER_SENSITIVITY } from './imp-36139-etrunc-coll-crossover-sensitivity.js';

const INTERIOR_MAX = IMP3443_NMAX_ETRUNC_SENSITIVITY;
const FAR_RIGHT_CROSSOVER = IMP36139_ETRUNC_COLL_CROSSOVER_SENSITIVITY;

export const IMP36285_ETRUNC_FLOOR_SENSITIVITY_STORYLINE_CROSS_REFERENCE = Object.freeze({
  id: 'imp-36285',
  title:
    'Cross-reference narrative: the imp-3443 interior-MAX elasticity (~-1.37) and the imp-36139 far-right ' +
    'crossover elasticity (~-2.095) as two floor-sensitivity readouts of the single imp-2631 E_trunc = 3.06e-5 ' +
    'fixed-strip floor',

  storyline: Object.freeze([
    Object.freeze({
      stage: 1,
      name: 'imp-3443 interior-MAX floor sensitivity',
      state: 'MEASURED (elasticity / power law)',
      statement:
        'Re-running the imp-3406 ternary search for the sigma(N) turnover N_max over a half-to-double ' +
        'E_trunc grid gives a NEAR power law N_max ~ (1/E_trunc)^' +
        INTERIOR_MAX.sensitivity.power_exponent.toFixed(3) +
        ' (local elasticity ~' +
        INTERIOR_MAX.sensitivity.local_elasticity.toFixed(3) +
        ' at the baseline floor E_trunc = 3.06e-5, N_max ~ ' +
        INTERIOR_MAX.baseline.N_max.toExponential(3) +
        '): the imp-3406 turnover is a floor-value artifact, not a robust landmark.',
      source: 'imp-3443',
    }),
    Object.freeze({
      stage: 2,
      name: 'imp-36139 far-right crossover floor sensitivity',
      state: 'MEASURED (elasticity / power law)',
      statement:
        'Re-running the imp-35968 bisection for the sigma = 1/2 crossover N_cross over the SAME half-to-double ' +
        'E_trunc grid gives a clean power law N_cross ~ E_trunc^{' +
        FAR_RIGHT_CROSSOVER.dlogNcross_dlogEtrunc_OLS.toFixed(3) +
        '} (baseline N_cross ~ ' +
        FAR_RIGHT_CROSSOVER.N_cross_baseline.toExponential(3) +
        '), fractionally steeper than the imp-33723 closed-form -2, the ~' +
        Math.abs(FAR_RIGHT_CROSSOVER.excessOverClosedForm).toFixed(3) +
        ' excess traced to the log T0(N_cross) growth term.',
      source: 'imp-36139',
    }),
    Object.freeze({
      stage: 3,
      name: 'shared framing',
      state: 'FRAMING (not a new measurement)',
      statement:
        'Both elasticities are floor-SENSITIVITY readouts of the single imp-2631 constant E_trunc = 3.06e-5, not ' +
        'intrinsic landmarks of the sigma(N) curve: the interior peak (elasticity ~' +
        INTERIOR_MAX.sensitivity.local_elasticity.toFixed(2) +
        ') and the far-right crossover (elasticity ~' +
        FAR_RIGHT_CROSSOVER.dlogNcross_dlogEtrunc_OLS.toFixed(2) +
        ') both move if that one fixed-strip floor value is revised, at different but both ' +
        'super-unity elasticities.',
      source: 'framing',
    }),
  ]),

  derivedVsOpen: Object.freeze({
    derived: Object.freeze([
      'imp-3443 interior-MAX elasticity/power law (~-1.37 / ~1.376)',
      'imp-36139 far-right crossover elasticity/power law (~-2.095)',
      'the shared framing that both readouts trace to the single imp-2631 E_trunc constant',
    ]),
    open: Object.freeze([
      'any first-principles justification for the imp-2631 fixed-strip floor value itself',
      'whether a tighter (non-fixed-strip) E_trunc route would change either exponent',
      'any bound or bridge closure using either elasticity',
    ]),
    note:
      'Neither MEASURED elasticity discharges either OPEN item; this note only states that the two ' +
      'sensitivities are two readouts of one shared input, the imp-2631 fixed-strip floor.',
  }),

  honestCaveat: Object.freeze({
    isProof: false,
    closesAnyGap: false,
    derivesAnythingNew: false,
    isReductionBelowRH: false,
    carriesRHVerdict: false,
    scope:
      'Read-only cross-reference narrative assembling the imp-3443 and imp-36139 verdicts into one storyline ' +
      'plus an explicit derived-vs-open list. Imports each stage verbatim; derives nothing new; respects the ' +
      'imp-2519 no-overclaim guard.',
    sota: 'No refereed bound is changed',
  }),
});

// -- Tripwire assertions ------------------------------------------------------
export const IMP36285_ETRUNC_FLOOR_SENSITIVITY_STORYLINE_CROSS_REFERENCE_ASSERTIONS = [
  {
    id: 'imp36285-storyline-has-three-stages-in-order',
    why: 'The arc must record exactly the three stages (interior-MAX, far-right crossover, shared framing) in narrative order.',
    holds: () => {
      const s = IMP36285_ETRUNC_FLOOR_SENSITIVITY_STORYLINE_CROSS_REFERENCE.storyline;
      return s.length === 3 && s[0].stage === 1 && s[1].stage === 2 && s[2].stage === 3;
    },
  },
  {
    id: 'imp36285-elasticities-match-source-verdicts',
    why: 'The Stage-1/Stage-2 statements must reproduce the source elasticity figures verbatim, not a re-derived or drifted paraphrase.',
    holds: () =>
      Math.abs(INTERIOR_MAX.sensitivity.local_elasticity - -1.373) < 0.05 &&
      Math.abs(FAR_RIGHT_CROSSOVER.dlogNcross_dlogEtrunc_OLS - -2.0953) < 0.05 &&
      IMP36285_ETRUNC_FLOOR_SENSITIVITY_STORYLINE_CROSS_REFERENCE.storyline[0].statement.includes(
        INTERIOR_MAX.sensitivity.power_exponent.toFixed(3),
      ) &&
      IMP36285_ETRUNC_FLOOR_SENSITIVITY_STORYLINE_CROSS_REFERENCE.storyline[1].statement.includes(
        FAR_RIGHT_CROSSOVER.dlogNcross_dlogEtrunc_OLS.toFixed(3),
      ),
  },
  {
    id: 'imp36285-both-elasticities-super-unity',
    why: 'The shared-framing punchline requires both elasticities to exceed unity in magnitude (super-linear sensitivity), which is what makes the imp-2631 floor value load-bearing for both landmarks.',
    holds: () =>
      Math.abs(INTERIOR_MAX.sensitivity.local_elasticity) > 1 &&
      Math.abs(FAR_RIGHT_CROSSOVER.dlogNcross_dlogEtrunc_OLS) > 1,
  },
  {
    id: 'imp36285-derived-vs-open-lists-nonempty-and-disjoint',
    why: 'The derived and open lists must both be non-empty and share no identical entry, or the derived-vs-open clarification this ticket exists to provide would be vacuous or contradictory.',
    holds: () => {
      const d = IMP36285_ETRUNC_FLOOR_SENSITIVITY_STORYLINE_CROSS_REFERENCE.derivedVsOpen;
      const overlap = d.derived.some((x) => d.open.includes(x));
      return d.derived.length > 0 && d.open.length > 0 && !overlap;
    },
  },
  {
    id: 'imp36285-honest-no-closure-no-qed',
    why: 'Mandatory honesty: an ASSEMBLY note that closes NOTHING, derives nothing new, carries NO RH verdict, no refereed bound is changed. If any flip the module over-claims.',
    holds: () => {
      const h = IMP36285_ETRUNC_FLOOR_SENSITIVITY_STORYLINE_CROSS_REFERENCE.honestCaveat;
      return (
        h.isProof === false &&
        h.closesAnyGap === false &&
        h.derivesAnythingNew === false &&
        h.isReductionBelowRH === false &&
        h.carriesRHVerdict === false &&
        /Platt-Trudgian|refereed bound is changed/.test(h.sota)
      );
    },
  },
];

for (const assertion of IMP36285_ETRUNC_FLOOR_SENSITIVITY_STORYLINE_CROSS_REFERENCE_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(
      `imp-36285-etrunc-floor-sensitivity-storyline-cross-reference assertion failed: ${assertion.id}`,
    );
  }
}

export default IMP36285_ETRUNC_FLOOR_SENSITIVITY_STORYLINE_CROSS_REFERENCE;
