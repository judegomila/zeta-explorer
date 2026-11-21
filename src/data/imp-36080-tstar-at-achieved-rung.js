/**
 * @module imp-36080-tstar-at-achieved-rung
 * @fileoverview imp-36080 -- MEASUREMENT / BOOKKEEPING ONLY (double precision).
 *   Discharges the CLERICAL residue in the lambda-roadmap conditionalBookkeeping
 *   item B2-effective-height-Tstar (imp-35099): report T_star(N) =
 *   effectiveHeightForN(N) (Riemann-von Mangoldt inversion, imp-327) at the N the
 *   Path C computation has ACTUALLY reached and cross-verified, and state the
 *   conclusion as "RH up to height T_star(N)" -- a FINITE height, NOT RH
 *   unconditionally, and BLOCKED because the upstream Steps 3-perN / 4 links are
 *   still OPEN.
 *
 *   Achieved verified zero-height rungs (largest N at which the conditional chain
 *   L_pt(N) < 0.2 has been assembled and cross-verified, NOT a proof of RH):
 *     - PRIMARY   N* = 1e6  (finite-height-beats-platt-trudgian.js)
 *     - CROSSCHK  N* = 5e5  (chain-crossverify-N5e5.js, independent alt-path)
 *     - DECLARED  N  = 2458 (bridge-lambda-rh.js pathCBound.numberOfZeros, historical)
 *
 *   For each rung we bake T_star(N) = effectiveHeightForN(N) and cross-check it
 *   with the forward count zeroCountAtHeight(T_star) ~ N (the imp-327 self-inverse
 *   guard). At the primary rung N*=1e6, T_star ~ 6.0e5 -- roughly SEVEN orders of
 *   magnitude BELOW the Platt-Trudgian verified height 3e12 (log10 ~ 12.48), so
 *   even were Steps 3-4 closed the finite-height statement would NOT be new; and
 *   ~301.7 decades BELOW the imp-35972 double-precision overflow cliffs (cliff A
 *   effectiveHeightForN -> +Infinity at log10 N ~ 307.4565, cliff B a -> 0 at
 *   log10 N ~ 307.4559), so the RvM inverse is nowhere near either twin cliff.
 *
 *   Ticket: imp-36080 (numerical, medium). Substitutes the achieved N into an
 *   EXISTING, cross-checked inversion; introduces no new numerics and moves NO
 *   Lambda bound. The finite-height RH statement is BLOCKED on the OPEN
 *   Step-4 / per-N / C_mb links (rigorousUpgradeGap), so it asserts NO closure.
 *   No refereed bound is changed; NO QED.
 *
 * @see lambda-rh-height-mapping (effectiveHeightForN / zeroCountAtHeight; imp-327 RvM inverse + self-inverse guard)
 * @see lambda-roadmap (conditionalBookkeeping B2-effective-height-Tstar, the clerical residue this discharges)
 * @see bridge-lambda-rh (sotaUpperBound.verifiedHeight = 3e12; pathCBound.numberOfZeros = 2458)
 * @see imp-35972-effective-height-overflow-cliff-bisection (twin overflow cliffs at log10 N ~ 307.456; this stays FAR below)
 * @see imp-36021-two-cliff-gap-constant-sensitivity (constant-invariance of the twin cliffs)
 */

import { effectiveHeightForN, zeroCountAtHeight } from './lambda-rh-height-mapping.js';
import { LAMBDA_RH_BRIDGE } from './bridge-lambda-rh.js';
import { IMP35972_EFFECTIVE_HEIGHT_OVERFLOW_CLIFF } from './imp-35972-effective-height-overflow-cliff-bisection.js';

const PT_HEIGHT = LAMBDA_RH_BRIDGE.sotaUpperBound.verifiedHeight; // 3e12
const CLIFF_A_LOG10_N = IMP35972_EFFECTIVE_HEIGHT_OVERFLOW_CLIFF.metric.height_overflow_last_finite_log10_N;
const CLIFF_B_LOG10_N = IMP35972_EFFECTIVE_HEIGHT_OVERFLOW_CLIFF.metric.a_zero_last_positive_log10_N;

// Achieved verified zero-height rungs. `role` records how far each has actually
// been carried; NONE of them proves RH -- they are the N at which the CONDITIONAL
// chain has been computed / cross-verified.
const RUNGS = [
  { N: 1e6,  role: 'primary',   note: 'finite-height-beats-platt-trudgian.js primary grid point' },
  { N: 5e5,  role: 'crosscheck', note: 'chain-crossverify-N5e5.js independent alt-path' },
  { N: 2458, role: 'declared',  note: 'bridge-lambda-rh.js pathCBound.numberOfZeros (historical)' },
];

const tStarRow = ({ N, role, note }) => {
  const T = effectiveHeightForN(N);
  const NBack = zeroCountAtHeight(T);
  return {
    N,
    role,
    note,
    T_star: +T.toExponential(9),
    log10_T_star: +Math.log10(T).toFixed(9),
    NBack: +NBack.toExponential(9),
    selfInverseRelErr: +(Math.abs(NBack - N) / N).toExponential(3),
    // How far below the two ceilings this rung sits.
    decades_below_PT_height: +(Math.log10(PT_HEIGHT) - Math.log10(T)).toFixed(6),
    decades_below_cliffA: +(CLIFF_A_LOG10_N - Math.log10(N)).toFixed(6),
    decades_below_cliffB: +(CLIFF_B_LOG10_N - Math.log10(N)).toFixed(6),
  };
};

const ROWS = RUNGS.map(tStarRow);
const PRIMARY = ROWS.find((r) => r.role === 'primary');

export const IMP36080_TSTAR_AT_ACHIEVED_RUNG = Object.freeze({
  id: 'imp-36080',
  title:
    'T_star(N) = effectiveHeightForN(N) at the achieved verified zero-height rung, reported as the ' +
    'finite-height RH-up-to-T_star MEASUREMENT (never unconditional RH), discharging conditionalBookkeeping ' +
    'B2 and sitting FAR below both the Platt-Trudgian 3e12 height and the imp-35972 twin overflow cliffs',
  bookkeepingItem: 'B2-effective-height-Tstar (lambda-roadmap.conditionalBookkeeping, imp-35099)',

  ptHeight: PT_HEIGHT,
  cliffA_log10_N: CLIFF_A_LOG10_N,
  cliffB_log10_N: CLIFF_B_LOG10_N,
  rungs: Object.freeze(ROWS.map((r) => Object.freeze(r))),
  primary: Object.freeze(PRIMARY),

  finiteHeightStatement:
    'IF (and only if) the Calogero-Moser / Dyson flow on the first N zeros yields a certified collision ' +
    'time with -t_c >= 0 (Step-4 bridge) AND the per-N translation and the C_mb tail links close, THEN ' +
    'every non-trivial zero of zeta with height <= T_star(N) lies on the critical line. At the achieved ' +
    'primary rung N* = 1e6 this reads RH up to height T_star ~ ' +
    PRIMARY.T_star.toExponential(4) +
    ' (log10 ~ ' +
    PRIMARY.log10_T_star.toFixed(4) +
    '). The forward count zeroCountAtHeight(T_star) recovers N to rel ' +
    PRIMARY.selfInverseRelErr.toExponential(1) +
    ' (imp-327 self-inverse guard). This is a FINITE height, bounded by the achieved N; it is NOT and ' +
    'CANNOT be upgraded to unconditional RH by this bookkeeping.',

  conclusion:
    'Substituting the achieved N into the imp-327 Riemann-von Mangoldt inverse gives, at the primary ' +
    'cross-verified rung N* = 1e6, T_star ~ ' +
    PRIMARY.T_star.toExponential(4) +
    ' -- about ' +
    PRIMARY.decades_below_PT_height.toFixed(2) +
    ' decades BELOW the Platt-Trudgian verified height 3e12, so even a fully closed Step-3/4 chain at ' +
    'this N would restate a height Platt-Trudgian already covers (NOT a new result), exactly as the ' +
    'imp-327 FINITE_HEIGHT_RH_STATEMENT.whatIsStillMissing warns. The rung also sits ~' +
    PRIMARY.decades_below_cliffA.toFixed(1) +
    ' decades below the imp-35972 effectiveHeightForN overflow cliff A (log10 N ~ ' +
    CLIFF_A_LOG10_N.toFixed(4) +
    ') and cliff B (log10 N ~ ' +
    CLIFF_B_LOG10_N.toFixed(4) +
    '), so the RvM inverse used here is numerically pristine -- nowhere near the twin double-precision ' +
    'cliffs. The ONLY lever on T_star is more achieved verified height (more N), which needs the OPEN ' +
    'upstream rate; the inversion itself is done.',

  honestCaveat: Object.freeze({
    isProof: false,
    isReductionBelowRH: false,
    changesAnyBound: false,
    assertsUnconditionalRH: false,
    beatsPlattTrudgian: false,
    blockedOn: 'G5-step4-bridge + G5-perN-translation + G5-cmb-gue (all OPEN; rigorousUpgradeGap)',
    sota: 'No refereed bound is changed',
  }),

  verdict:
    'BOOKKEEPING DISCHARGED, STATEMENT BLOCKED: T_star(1e6) ~ ' +
    PRIMARY.T_star.toExponential(4) +
    ' via the cross-checked imp-327 inverse, ~' +
    PRIMARY.decades_below_PT_height.toFixed(1) +
    ' decades below Platt-Trudgian 3e12 and ~' +
    PRIMARY.decades_below_cliffA.toFixed(1) +
    ' decades below the imp-35972 overflow cliffs. The finite-height RH-up-to-T_star statement is a ' +
    'MEASUREMENT that stays BLOCKED on the OPEN Step-4 / per-N / C_mb links, so it asserts NO closure ' +
    'and NEVER unconditional RH. Measurement / bookkeeping only; changes no bound; NO QED; ' +
    'no refereed bound is changed.',
});

export const IMP36080_TSTAR_AT_ACHIEVED_RUNG_ASSERTIONS = [
  {
    id: 'imp36080-self-inverse-guard-holds',
    why: 'Every reported T_star must satisfy the imp-327 self-inverse guard: zeroCountAtHeight(T_star(N)) recovers N tightly.',
    holds: () => IMP36080_TSTAR_AT_ACHIEVED_RUNG.rungs.every((r) => r.selfInverseRelErr < 1e-6),
  },
  {
    id: 'imp36080-tstar-far-below-platt-trudgian',
    why: 'The achieved primary rung must sit strictly (many decades) below the Platt-Trudgian 3e12 height, so the statement is NOT new.',
    holds: () =>
      IMP36080_TSTAR_AT_ACHIEVED_RUNG.primary.T_star < IMP36080_TSTAR_AT_ACHIEVED_RUNG.ptHeight &&
      IMP36080_TSTAR_AT_ACHIEVED_RUNG.primary.decades_below_PT_height > 6,
  },
  {
    id: 'imp36080-far-below-twin-overflow-cliffs',
    why: 'Every achieved rung must sit hundreds of decades below both imp-35972 twin overflow cliffs (numerically pristine RvM inverse).',
    holds: () =>
      IMP36080_TSTAR_AT_ACHIEVED_RUNG.rungs.every(
        (r) => r.decades_below_cliffA > 300 && r.decades_below_cliffB > 300,
      ),
  },
  {
    id: 'imp36080-tstar-monotone-in-N',
    why: 'T_star = effectiveHeightForN(N) is strictly increasing in N; the rung ordering by N must carry through to T_star.',
    holds: () => {
      const byN = [...IMP36080_TSTAR_AT_ACHIEVED_RUNG.rungs].sort((a, b) => a.N - b.N);
      for (let i = 1; i < byN.length; i++) {
        if (!(byN[i].T_star > byN[i - 1].T_star)) return false;
      }
      return true;
    },
  },
  {
    id: 'imp36080-honesty-gate',
    why: 'This is a measurement / bookkeeping discharge: it must not claim proof, RH reduction, a changed bound, or unconditional RH.',
    holds: () =>
      IMP36080_TSTAR_AT_ACHIEVED_RUNG.honestCaveat.isProof === false &&
      IMP36080_TSTAR_AT_ACHIEVED_RUNG.honestCaveat.isReductionBelowRH === false &&
      IMP36080_TSTAR_AT_ACHIEVED_RUNG.honestCaveat.changesAnyBound === false &&
      IMP36080_TSTAR_AT_ACHIEVED_RUNG.honestCaveat.assertsUnconditionalRH === false &&
      /Platt-Trudgian|refereed bound is changed/.test(IMP36080_TSTAR_AT_ACHIEVED_RUNG.honestCaveat.sota),
  },
  {
    id: 'imp36080-verdict-blocked-no-qed',
    why: 'The verdict must record that the statement stays BLOCKED and carries NO QED.',
    holds: () =>
      /BLOCKED/.test(IMP36080_TSTAR_AT_ACHIEVED_RUNG.verdict) &&
      /NO QED/.test(IMP36080_TSTAR_AT_ACHIEVED_RUNG.verdict),
  },
];

for (const assertion of IMP36080_TSTAR_AT_ACHIEVED_RUNG_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-36080-tstar-at-achieved-rung assertion failed: ${assertion.id}`);
  }
}

export default IMP36080_TSTAR_AT_ACHIEVED_RUNG;
