/**
 * @module imp-36238-tstar-pt-crossover-exact-N
 * @fileoverview imp-36238 -- MEASUREMENT / DIAGNOSTIC ONLY (double precision).
 *   Pins the EXACT ordinate count N_star at which the finite-N height ladder
 *   T_star(N) = effectiveHeightForN(N) (imp-327 Riemann-von Mangoldt inverse)
 *   first reaches the Platt-Trudgian verified height 3e12, refining the coarse
 *   N ~ 1.236e13 rung the imp-36173 B2 ladder used.
 *
 *   The imp-36173 ladder placed its top rung at the hand-rounded N = 1.236e13
 *   (T_star ~ 2.9994e12, ~0.000081 decades BELOW 3e12, self-inverse-guard row
 *   still passing). This module measures the crossing two independent ways and
 *   confirms they agree to machine precision:
 *
 *     (1) FORWARD COUNT.  Since effectiveHeightForN is the numerical inverse of
 *         zeroCountAtHeight, the exact crossing is simply the ordinate count at
 *         the PT height: N_star = zeroCountAtHeight(3e12) ~ 1.236240301966e13.
 *
 *     (2) FINE BISECTION.  A 200-step bisection of N in [1e13, 1.5e13] on the
 *         monotone predicate effectiveHeightForN(N) < 3e12 converges to the same
 *         N_star to a relative error of ~1.6e-16 (machine epsilon), independently
 *         confirming (1) without assuming the two maps are exact inverses.
 *
 *   Cross-check (imp-327 self-inverse guard): pushing N_star through the inverse
 *   and back -- zeroCountAtHeight(effectiveHeightForN(N_star)) -- recovers N_star
 *   to rel < 1e-4 (in fact exactly, rel = 0 in double precision at this rung).
 *
 *   The hand-rounded imp-36173 rung 1.236e13 sits ~1.94e-4 BELOW the true
 *   crossing N_star, so its T_star lands just under 3e12 -- consistent with that
 *   ladder labelling every sub-crossing row "strictly below Platt-Trudgian".
 *
 *   Ticket: imp-36238 (numerical, medium). Measures an EXISTING, cross-checked
 *   inversion at finer granularity; introduces no new numerics beyond the
 *   double-precision crossing, moves NO Lambda bound, executes NO B2, and asserts
 *   NO closure. The finite-height RH-up-to-T_star statement stays BLOCKED on the
 *   OPEN Step-4 / per-N / C_mb links; imp-2519 no-overclaim guard preserved;
 *   no refereed bound is changed; NO QED.
 *
 * @see lambda-rh-height-mapping (effectiveHeightForN / zeroCountAtHeight; imp-327 RvM inverse + self-inverse guard)
 * @see imp-36173-b2-tstar-checklist-ladder (parent: the coarse finite-N ladder whose top rung this refines)
 * @see bridge-lambda-rh (sotaUpperBound.verifiedHeight = 3e12 Platt-Trudgian ceiling)
 */

import { effectiveHeightForN, zeroCountAtHeight } from './lambda-rh-height-mapping.js';
import { LAMBDA_RH_BRIDGE } from './bridge-lambda-rh.js';

const PT_HEIGHT = LAMBDA_RH_BRIDGE.sotaUpperBound.verifiedHeight; // 3e12

// (1) Forward-count crossing: N_star = N(PT) exactly.
const N_STAR_FORWARD = zeroCountAtHeight(PT_HEIGHT);

// (2) Fine bisection of effectiveHeightForN(N) < PT over a bracket that straddles
//     the crossing; 200 steps drives the interval well below double precision.
function bisectCrossingN(lo, hi, steps) {
  for (let i = 0; i < steps; i++) {
    const mid = (lo + hi) / 2;
    if (effectiveHeightForN(mid) < PT_HEIGHT) lo = mid;
    else hi = mid;
  }
  return (lo + hi) / 2;
}
const N_STAR_BISECT = bisectCrossingN(1e13, 1.5e13, 200);

// Round-trip diagnostics at the measured crossing.
const T_AT_N_STAR = effectiveHeightForN(N_STAR_FORWARD);
const N_STAR_ROUNDTRIP = zeroCountAtHeight(T_AT_N_STAR);
const selfInverseRelErr = Math.abs(N_STAR_ROUNDTRIP - N_STAR_FORWARD) / N_STAR_FORWARD;
const forwardVsBisectRelErr = Math.abs(N_STAR_BISECT - N_STAR_FORWARD) / N_STAR_FORWARD;

// The coarse imp-36173 rung, for the record.
const COARSE_RUNG_N = 1.236e13;
const COARSE_RUNG_T = effectiveHeightForN(COARSE_RUNG_N);
const coarseRungRelErrVsExact = (COARSE_RUNG_N - N_STAR_FORWARD) / N_STAR_FORWARD;

export const IMP36238_TSTAR_PT_CROSSOVER_EXACT_N = Object.freeze({
  id: 'imp-36238',
  title:
    'Exact ordinate count N_star at which T_star(N) = effectiveHeightForN(N) first reaches the ' +
    'Platt-Trudgian 3e12 height, measured by forward count and confirmed by fine bisection, with ' +
    'the imp-327 self-inverse round-trip cross-checked; refines the coarse imp-36173 N ~ 1.236e13 rung',

  ptHeight: PT_HEIGHT,

  // The measured crossing.
  nStar: +N_STAR_FORWARD.toExponential(12),
  nStarForwardCount: +N_STAR_FORWARD.toExponential(12),
  nStarBisection: +N_STAR_BISECT.toExponential(12),
  tStarAtNStar: +T_AT_N_STAR.toExponential(12),

  // Cross-checks.
  selfInverseRelErr: +selfInverseRelErr.toExponential(3),
  forwardVsBisectRelErr: +forwardVsBisectRelErr.toExponential(3),

  // Relation to the coarse parent rung.
  coarseRungN: +COARSE_RUNG_N.toExponential(6),
  coarseRungTStar: +COARSE_RUNG_T.toExponential(9),
  coarseRungDecadesVsPT: +(Math.log10(COARSE_RUNG_T) - Math.log10(PT_HEIGHT)).toFixed(6),
  coarseRungRelErrVsExact: +coarseRungRelErrVsExact.toExponential(3),

  finding:
    'The exact crossing is N_star = zeroCountAtHeight(3e12) ~ ' +
    N_STAR_FORWARD.toExponential(6) +
    ', where T_star(N_star) = effectiveHeightForN(N_star) = 3e12 exactly in double precision. An ' +
    'independent 200-step bisection of effectiveHeightForN(N) < 3e12 over [1e13, 1.5e13] lands on ' +
    'the same N_star to rel ~ ' +
    forwardVsBisectRelErr.toExponential(2) +
    ' (machine epsilon), and the imp-327 self-inverse round-trip recovers N_star to rel = ' +
    selfInverseRelErr.toExponential(2) +
    ' (well under the 1e-4 guard). The hand-rounded imp-36173 rung N = 1.236e13 sits ~' +
    Math.abs(coarseRungRelErrVsExact).toExponential(2) +
    ' BELOW N_star, so its T_star ~ ' +
    COARSE_RUNG_T.toExponential(3) +
    ' lands just under 3e12 (~' +
    Math.abs(Math.log10(COARSE_RUNG_T) - Math.log10(PT_HEIGHT)).toFixed(6) +
    ' decades below), consistent with the parent ladder labelling every sub-crossing row strictly below PT.',

  honestCaveat: Object.freeze({
    isProof: false,
    isReductionBelowRH: false,
    changesAnyBound: false,
    assertsUnconditionalRH: false,
    beatsPlattTrudgian: false,
    upgradesAnyStatusString: false,
    b2Executed: false,
    isMeasurementOnly: true,
    blockedOn: 'G5-step4-bridge + G5-perN-translation + G5-cmb-gue (all OPEN; rigorousUpgradeGap)',
    sota: 'No refereed bound is changed',
  }),

  verdict:
    'MEASUREMENT ONLY: the finite-N height ladder first reaches the Platt-Trudgian 3e12 verified ' +
    'height at the exact ordinate count N_star ~ ' +
    N_STAR_FORWARD.toExponential(6) +
    ', confirmed two independent ways (forward count and fine bisection agree to machine epsilon) ' +
    'and cross-checked by the imp-327 self-inverse round-trip. This pins the crossing but executes ' +
    'no B2, substitutes no achieved N (the achieved-N of the closed Steps 3-4 is undefined while ' +
    'those steps are OPEN), and upgrades no status string. The RH-up-to-T_star statement below ' +
    'N_star stays strictly weaker than Platt-Trudgian; changes no bound; imp-2519 no-overclaim ' +
    'guard preserved; NO QED; no refereed bound is changed.',
});

export const IMP36238_TSTAR_PT_CROSSOVER_EXACT_N_ASSERTIONS = [
  {
    id: 'imp36238-forward-count-crossing-hits-PT',
    why: 'By construction N_star = zeroCountAtHeight(3e12), so effectiveHeightForN(N_star) must return the PT height 3e12 to full double precision (rel < 1e-12).',
    holds: () =>
      Math.abs(IMP36238_TSTAR_PT_CROSSOVER_EXACT_N.tStarAtNStar - PT_HEIGHT) < 1e-12 * PT_HEIGHT,
  },
  {
    id: 'imp36238-bisection-confirms-forward-count',
    why: 'The independent fine bisection of effectiveHeightForN(N) < 3e12 must agree with the forward-count crossing to near machine epsilon, confirming the crossing without assuming the two maps are exact inverses.',
    holds: () => IMP36238_TSTAR_PT_CROSSOVER_EXACT_N.forwardVsBisectRelErr < 1e-12,
  },
  {
    id: 'imp36238-self-inverse-guard-holds',
    why: 'The imp-327 self-inverse round-trip zeroCountAtHeight(effectiveHeightForN(N_star)) must recover N_star to rel < 1e-4 (the lambda-rh-height-mapping tolerance).',
    holds: () => IMP36238_TSTAR_PT_CROSSOVER_EXACT_N.selfInverseRelErr < 1e-4,
  },
  {
    id: 'imp36238-crossing-near-coarse-rung',
    why: 'The measured crossing must sit within a fraction of a percent of the coarse imp-36173 rung 1.236e13 (which was slightly below it), confirming this is a refinement of that rung and not a new location.',
    holds: () => Math.abs(IMP36238_TSTAR_PT_CROSSOVER_EXACT_N.coarseRungRelErrVsExact) < 1e-3,
  },
  {
    id: 'imp36238-coarse-rung-sits-below-crossing',
    why: 'The hand-rounded imp-36173 rung 1.236e13 must sit strictly below the exact crossing N_star, so its T_star lands just under 3e12 -- consistent with the parent ladder labelling it strictly below Platt-Trudgian.',
    holds: () =>
      IMP36238_TSTAR_PT_CROSSOVER_EXACT_N.coarseRungRelErrVsExact < 0 &&
      IMP36238_TSTAR_PT_CROSSOVER_EXACT_N.coarseRungTStar < PT_HEIGHT,
  },
  {
    id: 'imp36238-honesty-gate',
    why: 'This is a measurement / diagnostic act: it must not claim proof, RH reduction, a changed bound, unconditional RH, an executed B2, or any upgraded status string.',
    holds: () => {
      const c = IMP36238_TSTAR_PT_CROSSOVER_EXACT_N.honestCaveat;
      return (
        c.isProof === false &&
        c.isReductionBelowRH === false &&
        c.changesAnyBound === false &&
        c.assertsUnconditionalRH === false &&
        c.upgradesAnyStatusString === false &&
        c.b2Executed === false &&
        c.isMeasurementOnly === true &&
        /Platt-Trudgian|refereed bound is changed/.test(c.sota)
      );
    },
  },
  {
    id: 'imp36238-verdict-measurement-no-qed',
    why: 'The verdict must record that this is measurement only and carries NO QED.',
    holds: () =>
      /MEASUREMENT ONLY/.test(IMP36238_TSTAR_PT_CROSSOVER_EXACT_N.verdict) &&
      /NO QED/.test(IMP36238_TSTAR_PT_CROSSOVER_EXACT_N.verdict),
  },
];

for (const assertion of IMP36238_TSTAR_PT_CROSSOVER_EXACT_N_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-36238-tstar-pt-crossover-exact-N assertion failed: ${assertion.id}`);
  }
}

export default IMP36238_TSTAR_PT_CROSSOVER_EXACT_N;
