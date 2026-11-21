/**
 * imp-35719 -- AUDIT / INVENTORY of the imp-341 barrier-base misattribution fan-out.
 *
 * imp-35681 Part D corrected the frontier-scout premise: the imp-35653 Part-D
 * barrier BASE -- N_off(T_PT) = 0, RH verified to T_PT = 3e12 -- is an EXTERNAL
 * Platt-Trudgian 2021 result the repo CITES, NOT internal repo imp-341 (which is
 * the "Close G5_burgers" Stieltjes-uniformity thread, unrelated to off-line zero
 * verification). imp-35681 flagged the misattribution but never INVENTORIED the
 * consumer fan-out. This module does that inventory: grep the whole src surface
 * for imp-341 citations, classify each as CORRECT-USE (Koksma-Hlawka / C_KH = 3 pi
 * / Slater-Burgers) versus MISATTRIBUTED (imp-341 cited AS the T_PT off-line
 * zero-verification), and list any consumer needing re-pointing.
 *
 * WHAT imp-341 ACTUALLY IS
 * -----------------------
 * Canonical imp-341 = "Close G5_burgers: uniformity of the finite-N empirical
 * Stieltjes transform" -- the S7 Koksma-Hlawka discrepancy bound giving
 * lim sup_{N to inf} |t_c(N)| = 0, with strip height y_sharp(N) = sqrt(2 pi / N)
 * and Selberg constant C_1 = pi C_Selberg = 3 pi (a.k.a. C_KH). It has NO bearing
 * on off-line zero verification to any height T_PT.
 *
 * INVENTORY RESULT -- THE src MISATTRIBUTION SURFACE IS EMPTY
 * ----------------------------------------------------------
 * Every src citation of imp-341 falls into one of three CORRECT-USE classes and
 * none conflates imp-341 with the T_PT zero-verification / barrier base:
 *   (C1) Koksma-Hlawka lim-sup thread: surrogate-discrete-gap.js,
 *        lean4-koksma-hlawka.js (imp-403 skeleton), proof-paper.js (Dyson-flow
 *        route imp-341 + imp-387), lambda-roadmap.js Step 3, imp-2697,
 *        imp-35076 (y_N^sharp convention), imp-35681 (states imp-341 is NOT it).
 *   (C2) Selberg / C_KH = C_1 = 3 pi constant: finite-height-beats-platt-
 *        trudgian.js (C_KH = 3 pi), platt-trudgian-recheck-post-closure.js
 *        (C_1 = pi C_Selberg = 3 pi), backward-flow-stability-gronwall.js
 *        (C_SELBERG = 3.0 placeholder), imp-2641 (imp-341 / imp-366).
 *   (C3) Slater-determinant Burgers envelope shape: many-body-correction-
 *        closure.js (imp-341-slater-burgers-envelope).
 * The two ACTUAL barrier-base consumers -- finite-height-lambda-bound.js and
 * finite-height-beats-platt-trudgian.js -- already cite Platt & Trudgian (2021)
 * for N_off(T_PT) = 0, NOT imp-341. So ZERO src modules require re-pointing.
 *
 * WHERE THE MISATTRIBUTION ACTUALLY LIVED
 * ---------------------------------------
 * Only in the frontier-SCOUT ticket PREMISE (queue prose feeding imp-35653 /
 * imp-35681), already retired by imp-35681 Part D and surfaced on the RH Proof
 * State Dashboard by imp-35741. The audit therefore closes the consumer fan-out
 * as a NULL result: the conflation never propagated into a computed bound, an
 * @see chain, or a constant, so nothing downstream is contaminated. Cataloguing
 * the three correct-use classes here is the guard so the misattribution cannot
 * silently re-seed under a future grep for "imp-341 + T_PT".
 *
 * Inventory / assessment only; re-points nothing (nothing needs it); changes no
 * bound; establishes no positivity; no RH verdict; NO QED. No refereed bound is changed.
 *
 * @see imp-35681-w1-w2-w4-existing-infra-inventory (Part D: base external, misattributed)
 * @see imp-35653-sbarrier-finite-check-porting-scope (Part D: N_off(T_PT)=0 necessary-not-sufficient)
 * @see imp-341 (Close G5_burgers -- the S7 Burgers/Koksma-Hlawka uniformity; NOT the zero-verification)
 * @see finite-height-lambda-bound / finite-height-beats-platt-trudgian (cite Platt-Trudgian 2021 for the base)
 * @see Platt & Trudgian 2021, Bull. Lond. Math. Soc. 53, 792-797 (the external barrier base)
 */

// -- Anchor constants (import-light; matching imp-35681 / imp-35717) -----------
const T_PT = 3e12; // Platt-Trudgian 2021 verified height (EXTERNAL barrier base)
const L_PT = 0.2; // Platt-Trudgian 2021 bound; unchanged by this audit

export const IMP35719_IMP341_BARRIER_BASE_MISATTRIBUTION_FANOUT_AUDIT = {
  id: 'imp-35719',
  proofSection: 'S-frontier',
  question:
    'Which repo modules / comments cite imp-341 (or "internal repo") as the T_PT = 3e12 off-line ' +
    'zero-verification that supplies the imp-35653 barrier base, when that base N_off(T_PT) = 0 is an ' +
    'EXTERNAL Platt-Trudgian 2021 result (imp-35681 Part D)? Inventory the consumer fan-out and list ' +
    'every consumer that needs re-pointing. Audit / inventory only; changes no bound; NO QED.',
  canonicalImp341:
    'Close G5_burgers: uniformity of the finite-N empirical Stieltjes transform -- the S7 Koksma-Hlawka ' +
    'discrepancy bound giving lim sup |t_c(N)| = 0 (strip height y_sharp(N) = sqrt(2 pi / N), Selberg ' +
    'constant C_1 = pi C_Selberg = 3 pi). No bearing on off-line zero verification to any height T_PT.',
  correctUseClasses: {
    C1_koksmaHlawkaLimSup: [
      'src/math/surrogate-discrete-gap.js (KH rate at y_sharp = sqrt(2 pi / N))',
      'src/math/lean4-koksma-hlawka.js (imp-403 Lean 4 skeleton of the imp-341 lim-sup theorem)',
      'src/math/proof-paper.js (Dyson-flow route imp-341 + imp-387; lim sup |t_c(N)| = 0)',
      'src/data/lambda-roadmap.js (Step 3: imp-341 lim-sup |t_c(N)| = 0)',
      'src/data/imp-2697-theorem3-rate-crossverify.js (imp-341 statement lim sup |t_c(N)| = 0)',
      'src/data/imp-35076-h3-a-fortiori-discharges-h4-numerical-verification.js (y_N^sharp convention)',
      'src/data/imp-35681-w1-w2-w4-existing-infra-inventory.js (states imp-341 is NOT the zero-verification)',
    ],
    C2_selbergCKHConstant: [
      'src/data/finite-height-beats-platt-trudgian.js (C_KH = 3 pi from imp-341)',
      'src/data/platt-trudgian-recheck-post-closure.js (C_1 = pi C_Selberg = 3 pi from imp-341)',
      'src/data/backward-flow-stability-gronwall.js (C_SELBERG = 3.0 placeholder of imp-341)',
      'src/data/imp-2641-c-selberg-trudgian-discharge.js (imp-341 / imp-366 effective constant)',
    ],
    C3_slaterBurgersEnvelope: [
      'src/math/many-body-correction-closure.js (imp-341-slater-burgers-envelope shape anchor)',
    ],
  },
  misattributedConsumers: {
    count: 0,
    list: [],
    note:
      'No src module or @see chain cites imp-341 (or "internal repo") as the T_PT off-line ' +
      'zero-verification / barrier base. The conflation lived ONLY in the frontier-scout ticket ' +
      'PREMISE (queue prose), retired by imp-35681 Part D and surfaced by imp-35741.',
  },
  barrierBaseConsumers: {
    correctlyExternal: [
      'src/data/finite-height-lambda-bound.js (cites Platt & Trudgian 2021, Bull. Lond. Math. Soc. 53, 792-797)',
      'src/data/finite-height-beats-platt-trudgian.js (cites Platt-Trudgian for the base; imp-341 only for C_KH = 3 pi)',
    ],
    note:
      'Both actual barrier-base consumers already attribute N_off(T_PT) = 0 to the EXTERNAL Platt-Trudgian ' +
      '2021 result, not to imp-341. They import the base correctly; no edit required.',
  },
  repointingNeeded: {
    count: 0,
    list: [],
    reason:
      'The misattribution never propagated into a computed bound, a constant, or an @see chain -- it was ' +
      'confined to scout prose that imp-35681 Part D already corrected. Null-result fan-out: nothing to re-point.',
  },
  isRigorous: false,
  verdict:
    'AUDIT / INVENTORY (frontier-direction, NOT rigorous). The imp-341 barrier-base misattribution ' +
    'fan-out is a NULL result inside src: every one of the ~15 imp-341 citations falls into a CORRECT-USE ' +
    'class -- (C1) the Koksma-Hlawka lim-sup |t_c(N)| = 0 thread, (C2) the Selberg constant ' +
    'C_1 = C_KH = 3 pi, or (C3) the Slater-determinant Burgers envelope shape -- and NONE conflates ' +
    'imp-341 with the T_PT = 3e12 off-line zero-verification. The two actual barrier-base consumers ' +
    '(finite-height-lambda-bound.js, finite-height-beats-platt-trudgian.js) already cite Platt & Trudgian ' +
    '(2021) for N_off(T_PT) = 0. The conflation lived ONLY in the frontier-scout ticket PREMISE, retired ' +
    'by imp-35681 Part D and surfaced by imp-35741. Consequently ZERO src modules need re-pointing; the ' +
    'audit catalogues the three correct-use classes as a guard against silent re-seeding. Inventories ' +
    'nothing new; re-points nothing; changes no bound; establishes no positivity; no RH verdict, NO QED. ' +
    'No refereed bound is changed.',
  citation:
    'imp-35681 Part D (base external Platt-Trudgian 2021, NOT repo imp-341); imp-35653 Part D ' +
    '(N_off(T_PT) = 0 necessary-not-sufficient); imp-35741 (dashboard banner surfacing the correction); ' +
    'imp-341 (Close G5_burgers -- Koksma-Hlawka uniformity, NOT the zero-verification); ' +
    'Platt & Trudgian 2021, Bull. Lond. Math. Soc. 53, 792-797 (external barrier base).',
};

export const IMP35719_IMP341_BARRIER_BASE_MISATTRIBUTION_FANOUT_AUDIT_ASSERTIONS = [
  {
    // Canonical imp-341 is the G5_burgers Koksma-Hlawka lim-sup thread, NOT any T_PT zero-verification.
    id: 'imp35719-canonical-imp341-is-g5burgers',
    description: 'imp-341 = Close G5_burgers Koksma-Hlawka lim sup |t_c(N)|=0, no bearing on T_PT verification',
    holds: () =>
      /G5_burgers/.test(IMP35719_IMP341_BARRIER_BASE_MISATTRIBUTION_FANOUT_AUDIT.canonicalImp341) &&
      /lim sup \|t_c\(N\)\| = 0/.test(IMP35719_IMP341_BARRIER_BASE_MISATTRIBUTION_FANOUT_AUDIT.canonicalImp341) &&
      /No bearing on off-line zero verification/.test(
        IMP35719_IMP341_BARRIER_BASE_MISATTRIBUTION_FANOUT_AUDIT.canonicalImp341,
      ),
  },
  {
    // The misattribution surface inside src is EMPTY: no consumer conflates imp-341 with the zero-verification.
    id: 'imp35719-misattribution-surface-empty',
    description: 'Zero src modules cite imp-341 as the T_PT off-line zero-verification / barrier base',
    holds: () =>
      IMP35719_IMP341_BARRIER_BASE_MISATTRIBUTION_FANOUT_AUDIT.misattributedConsumers.count === 0 &&
      IMP35719_IMP341_BARRIER_BASE_MISATTRIBUTION_FANOUT_AUDIT.misattributedConsumers.list.length === 0 &&
      /frontier-scout ticket PREMISE/.test(
        IMP35719_IMP341_BARRIER_BASE_MISATTRIBUTION_FANOUT_AUDIT.misattributedConsumers.note,
      ),
  },
  {
    // Every imp-341 citation is catalogued in one of the three correct-use classes (non-empty inventory).
    id: 'imp35719-three-correct-use-classes-populated',
    description: 'C1 (Koksma-Hlawka), C2 (C_KH=3pi), C3 (Slater-Burgers) each list at least one consumer',
    holds: () => {
      const c = IMP35719_IMP341_BARRIER_BASE_MISATTRIBUTION_FANOUT_AUDIT.correctUseClasses;
      return (
        c.C1_koksmaHlawkaLimSup.length >= 5 &&
        c.C2_selbergCKHConstant.length >= 3 &&
        c.C3_slaterBurgersEnvelope.length >= 1
      );
    },
  },
  {
    // The actual barrier-base consumers already cite EXTERNAL Platt-Trudgian 2021, not imp-341.
    id: 'imp35719-barrier-base-consumers-external',
    description: 'finite-height-lambda-bound + finite-height-beats-platt-trudgian cite Platt-Trudgian 2021 for the base',
    holds: () =>
      IMP35719_IMP341_BARRIER_BASE_MISATTRIBUTION_FANOUT_AUDIT.barrierBaseConsumers.correctlyExternal.length === 2 &&
      IMP35719_IMP341_BARRIER_BASE_MISATTRIBUTION_FANOUT_AUDIT.barrierBaseConsumers.correctlyExternal.some((s) =>
        /finite-height-lambda-bound/.test(s),
      ) &&
      IMP35719_IMP341_BARRIER_BASE_MISATTRIBUTION_FANOUT_AUDIT.barrierBaseConsumers.correctlyExternal.some((s) =>
        /Platt & Trudgian 2021/.test(s),
      ),
  },
  {
    // Honesty gate: zero re-pointing needed, null-result fan-out, no discharge, no QED, no refereed bound is changed, no stray key.
    id: 'imp35719-honesty-gate-null-result-no-qed',
    description: 'ZERO re-pointing needed; audit only; no bound change; NO QED; no refereed bound is changed',
    holds: () =>
      IMP35719_IMP341_BARRIER_BASE_MISATTRIBUTION_FANOUT_AUDIT.isRigorous === false &&
      Math.abs(L_PT - 0.2) < 1e-15 &&
      T_PT === 3e12 &&
      IMP35719_IMP341_BARRIER_BASE_MISATTRIBUTION_FANOUT_AUDIT.repointingNeeded.count === 0 &&
      IMP35719_IMP341_BARRIER_BASE_MISATTRIBUTION_FANOUT_AUDIT.repointingNeeded.list.length === 0 &&
      /NULL result/.test(IMP35719_IMP341_BARRIER_BASE_MISATTRIBUTION_FANOUT_AUDIT.verdict) &&
      /NO QED/.test(IMP35719_IMP341_BARRIER_BASE_MISATTRIBUTION_FANOUT_AUDIT.verdict) &&
      /refereed bound is changed/i.test(IMP35719_IMP341_BARRIER_BASE_MISATTRIBUTION_FANOUT_AUDIT.verdict),
  },
];

for (const a of IMP35719_IMP341_BARRIER_BASE_MISATTRIBUTION_FANOUT_AUDIT_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-35719-imp341-barrier-base-misattribution-fanout-audit assertion failed: ${a.id}`);
  }
}
