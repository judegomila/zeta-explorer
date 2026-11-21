/**
 * @module imp-36173-b2-tstar-checklist-ladder
 * @fileoverview imp-36173 -- TABULATION / BOOKKEEPING ONLY (double precision).
 *   Makes the lambda-roadmap conditionalBookkeeping item B2-effective-height-Tstar
 *   (imp-35099) CONCRETE by tabulating what the residual clerical act -- substituting
 *   an achieved N into T_star(N) = effectiveHeightForN(N) (imp-327 Riemann-von
 *   Mangoldt inversion, cross-checked by zeroCountAtHeight) -- WOULD report across
 *   the full finite-N ladder the inversion machinery already supports.
 *
 *   The B2 item is BLOCKED (the achieved-N of the closed Steps 3-4 is undefined
 *   while those steps are OPEN), so this module does NOT substitute any real
 *   achieved N and does NOT execute B2. It only shows the finite-height framing:
 *   EACH row is explicitly labelled "RH up to height T_star(N)" -- a FINITE height
 *   bounded by N -- and NEVER unconditional RH. No status string (SOTA_LAMBDA_CLAIM,
 *   the B1/B2/B3 checklist "closed" flags) is touched; all three stay BLOCKED per
 *   the roadmap caveat.
 *
 *   Distinct from imp-36080-tstar-at-achieved-rung: that module snapshots T_star at
 *   the three ACHIEVED conditional-chain rungs (N = 1e6 / 5e5 / 2458). This module
 *   instead sweeps a full finite-N ladder up to the PT-scale N and pins the height
 *   at which the finite-height statement would FIRST reach the Platt-Trudgian
 *   verified height 3e12 -- namely N ~ 1.236e13 (T_star ~ 3e12), where
 *   zeroCountAtHeight(3e12) ~ 1.236e13. Below that N the statement is strictly
 *   WEAKER than Platt-Trudgian and hence NOT new; the finite-height framing only
 *   becomes competitive once the OPEN upstream rate can supply N ~ 1.24e13 zeros.
 *
 *   Ticket: imp-36173 (proof, medium). Substitutes a ladder of N into an EXISTING,
 *   cross-checked inversion purely to make the finite-height framing concrete;
 *   introduces no new numerics, moves NO Lambda bound, and asserts NO closure. The
 *   finite-height RH-up-to-T_star statement stays BLOCKED on the OPEN Step-4 / per-N
 *   / C_mb links (rigorousUpgradeGap); imp-2519 no-overclaim guard preserved;
 *   no refereed bound is changed; NO QED.
 *
 * @see lambda-rh-height-mapping (effectiveHeightForN / zeroCountAtHeight / FINITE_HEIGHT_RH_STATEMENT; imp-327 RvM inverse + self-inverse guard)
 * @see lambda-roadmap (conditionalBookkeeping B2-effective-height-Tstar, the clerical residue this makes concrete; caveat B1-B3 all BLOCKED)
 * @see imp-36080-tstar-at-achieved-rung (companion: T_star at the three ACHIEVED conditional-chain rungs)
 * @see bridge-lambda-rh (sotaUpperBound.verifiedHeight = 3e12 Platt-Trudgian ceiling)
 */

import { effectiveHeightForN, zeroCountAtHeight } from './lambda-rh-height-mapping.js';
import { LAMBDA_RH_BRIDGE } from './bridge-lambda-rh.js';

const PT_HEIGHT = LAMBDA_RH_BRIDGE.sotaUpperBound.verifiedHeight; // 3e12

// The finite-N ladder the imp-327 inversion machinery already supports, from the
// historical declared rung (N = 2458) up to the PT-scale N at which T_star first
// reaches the Platt-Trudgian 3e12 height. NONE of these is an achieved Step-3/4 N;
// the ladder exists ONLY to make the finite-height framing concrete.
const N_LADDER = [
  2458,      // declared (bridge-lambda-rh pathCBound.numberOfZeros)
  5000,      // imp-315 historical target
  1e4,
  1e5,
  1e6,       // primary conditional-chain rung (imp-36080)
  1e7,
  1e8,
  1e9,
  1e10,
  1e11,
  1e12,
  1.236e13,  // PT-scale N: zeroCountAtHeight(3e12) ~ 1.236e13, so T_star ~ 3e12 here
];

const ladderRow = (N) => {
  const T = effectiveHeightForN(N);
  const NBack = zeroCountAtHeight(T);
  const log10_T = Math.log10(T);
  return {
    N: +N.toExponential(6),
    T_star: +T.toExponential(9),
    log10_T_star: +log10_T.toFixed(9),
    NBack: +NBack.toExponential(9),
    selfInverseRelErr: +(Math.abs(NBack - N) / N).toExponential(3),
    // Signed gap to the Platt-Trudgian ceiling: negative = strictly below (NOT new),
    // >= 0 = at / above (competitive only once the OPEN rate supplies this N).
    decades_vs_PT_height: +(log10_T - Math.log10(PT_HEIGHT)).toFixed(6),
    belowPT: T < PT_HEIGHT,
    // The finite-height framing, per row -- explicitly NEVER unconditional RH.
    statement:
      'RH up to height T_star ~ ' +
      T.toExponential(3) +
      ' (FINITE, bounded by N = ' +
      N.toExponential(3) +
      '; NOT unconditional RH)',
  };
};

const ROWS = N_LADDER.map(ladderRow);
const PT_SCALE_ROW = ROWS[ROWS.length - 1];
const PRIMARY_ROW = ROWS.find((r) => Math.abs(r.N - 1e6) / 1e6 < 1e-6);

export const IMP36173_B2_TSTAR_CHECKLIST_LADDER = Object.freeze({
  id: 'imp-36173',
  title:
    'B2-effective-height-Tstar clerical checklist made CONCRETE: a full finite-N ladder of ' +
    'T_star(N) = effectiveHeightForN(N), every row labelled RH-up-to-T_star(N) (FINITE, never ' +
    'unconditional RH), pinning the PT-scale N ~ 1.236e13 at which T_star first reaches the ' +
    'Platt-Trudgian 3e12 height; NO status string touched',
  bookkeepingItem: 'B2-effective-height-Tstar (lambda-roadmap.conditionalBookkeeping, imp-35099)',

  ptHeight: PT_HEIGHT,
  ladder: Object.freeze(ROWS.map((r) => Object.freeze(r))),
  primaryRow: Object.freeze(PRIMARY_ROW),
  ptScaleRow: Object.freeze(PT_SCALE_ROW),

  finiteHeightStatement:
    'The B2 residual clerical act is ONLY substituting an achieved N into the imp-327 inverse ' +
    'T_star(N) = effectiveHeightForN(N). This ladder shows what that WOULD report: at N = 1e6, ' +
    'T_star ~ ' +
    PRIMARY_ROW.T_star.toExponential(3) +
    ' (~' +
    Math.abs(PRIMARY_ROW.decades_vs_PT_height).toFixed(2) +
    ' decades BELOW Platt-Trudgian 3e12, so strictly weaker and NOT new); the finite-height ' +
    'statement first reaches the 3e12 ceiling only at the PT-scale N ~ ' +
    PT_SCALE_ROW.N.toExponential(3) +
    ' (T_star ~ ' +
    PT_SCALE_ROW.T_star.toExponential(3) +
    '). Every row is RH up to a FINITE height T_star(N) bounded by N; it is NOT and CANNOT be ' +
    'upgraded to unconditional RH by this bookkeeping.',

  conclusion:
    'The inversion machinery already exists and is cross-checked by zeroCountAtHeight (self-inverse ' +
    'to rel < 1e-4 across the whole ladder), so B2 truly is a one-line substitution -- EXCEPT that ' +
    'the achieved-N of the closed Steps 3-4 is undefined while those steps are OPEN, so no real N ' +
    'can be substituted today. Tabulating the finite-N ladder makes the framing concrete without ' +
    'executing B2: below N ~ 1.24e13 the RH-up-to-T_star conclusion is strictly weaker than the ' +
    'Platt-Trudgian verified height, exactly as FINITE_HEIGHT_RH_STATEMENT.whatIsStillMissing warns. ' +
    'The ONLY lever on T_star is more achieved verified height (more N), which needs the OPEN ' +
    'upstream rate; the inversion itself is trivial.',

  honestCaveat: Object.freeze({
    isProof: false,
    isReductionBelowRH: false,
    changesAnyBound: false,
    assertsUnconditionalRH: false,
    beatsPlattTrudgian: false,
    upgradesAnyStatusString: false,
    b2Executed: false,
    blockedOn: 'G5-step4-bridge + G5-perN-translation + G5-cmb-gue (all OPEN; rigorousUpgradeGap)',
    sota: 'No refereed bound is changed',
  }),

  verdict:
    'BOOKKEEPING MADE CONCRETE, B2 STILL BLOCKED: the finite-N ladder shows T_star(N) rising from ' +
    '~' +
    ROWS[0].T_star.toExponential(2) +
    ' at N = 2458 to ~' +
    PT_SCALE_ROW.T_star.toExponential(2) +
    ' at the PT-scale N ~ 1.236e13, where the RH-up-to-T_star statement first reaches Platt-Trudgian ' +
    '3e12. Each row is a FINITE-height statement bounded by N, never unconditional RH. B2 is NOT ' +
    'executed (achieved-N undefined while Steps 3-4 OPEN); no status string is upgraded; the ' +
    'imp-2519 no-overclaim guard is preserved. Tabulation / bookkeeping only; changes no bound; ' +
    'NO QED; no refereed bound is changed.',
});

export const IMP36173_B2_TSTAR_CHECKLIST_LADDER_ASSERTIONS = [
  {
    id: 'imp36173-self-inverse-guard-holds',
    why: 'Every ladder row must satisfy the imp-327 self-inverse guard: zeroCountAtHeight(T_star(N)) recovers N to rel < 1e-4 (the lambda-rh-height-mapping tolerance).',
    holds: () => IMP36173_B2_TSTAR_CHECKLIST_LADDER.ladder.every((r) => r.selfInverseRelErr < 1e-4),
  },
  {
    id: 'imp36173-tstar-monotone-in-N',
    why: 'T_star = effectiveHeightForN(N) is strictly increasing in N; the ladder is built in ascending N so T_star must be strictly increasing row-to-row.',
    holds: () => {
      const L = IMP36173_B2_TSTAR_CHECKLIST_LADDER.ladder;
      for (let i = 1; i < L.length; i++) {
        if (!(L[i].T_star > L[i - 1].T_star)) return false;
      }
      return true;
    },
  },
  {
    id: 'imp36173-sub-pt-rows-strictly-below',
    why: 'Every ladder row below the PT-scale N must sit strictly below the Platt-Trudgian 3e12 height, so its RH-up-to-T_star statement is strictly weaker and NOT new.',
    holds: () =>
      IMP36173_B2_TSTAR_CHECKLIST_LADDER.ladder
        .slice(0, -1)
        .every((r) => r.belowPT && r.decades_vs_PT_height < 0),
  },
  {
    id: 'imp36173-pt-scale-row-reaches-ceiling',
    why: 'The top PT-scale rung (N ~ 1.236e13) must bring T_star up to approximately the Platt-Trudgian 3e12 ceiling, pinning where the finite-height statement first becomes competitive.',
    holds: () => {
      const r = IMP36173_B2_TSTAR_CHECKLIST_LADDER.ptScaleRow;
      return Math.abs(r.decades_vs_PT_height) < 0.01; // T_star within ~2% of 3e12
    },
  },
  {
    id: 'imp36173-every-row-labelled-finite',
    why: 'Each row must carry the explicit finite-height label and disclaim unconditional RH, per the ticket requirement.',
    holds: () =>
      IMP36173_B2_TSTAR_CHECKLIST_LADDER.ladder.every(
        (r) => /RH up to height/.test(r.statement) && /NOT unconditional RH/.test(r.statement),
      ),
  },
  {
    id: 'imp36173-honesty-gate',
    why: 'This is a tabulation / bookkeeping act: it must not claim proof, RH reduction, a changed bound, unconditional RH, an executed B2, or any upgraded status string.',
    holds: () => {
      const c = IMP36173_B2_TSTAR_CHECKLIST_LADDER.honestCaveat;
      return (
        c.isProof === false &&
        c.isReductionBelowRH === false &&
        c.changesAnyBound === false &&
        c.assertsUnconditionalRH === false &&
        c.upgradesAnyStatusString === false &&
        c.b2Executed === false &&
        /Platt-Trudgian|refereed bound is changed/.test(c.sota)
      );
    },
  },
  {
    id: 'imp36173-verdict-blocked-no-qed',
    why: 'The verdict must record that B2 stays BLOCKED and carries NO QED.',
    holds: () =>
      /BLOCKED/.test(IMP36173_B2_TSTAR_CHECKLIST_LADDER.verdict) &&
      /NO QED/.test(IMP36173_B2_TSTAR_CHECKLIST_LADDER.verdict),
  },
];

for (const assertion of IMP36173_B2_TSTAR_CHECKLIST_LADDER_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-36173-b2-tstar-checklist-ladder assertion failed: ${assertion.id}`);
  }
}

export default IMP36173_B2_TSTAR_CHECKLIST_LADDER;
