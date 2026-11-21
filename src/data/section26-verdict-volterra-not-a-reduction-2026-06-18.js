/**
 * @module section26-verdict-volterra-not-a-reduction-2026-06-18
 *
 * The definitive verdict on the Volterra/Section-27 collapse route to RH
 * (Opus 4.8, section26-conj263-deep workflow, 3 routes + synthesis, decisively
 * reproduced at the GENUINE Riemann Phi via /tmp/riemann_arbiter.py). This
 * supersedes the c-pinning framing in section27-identity-refutation's
 * THE_REAL_GAP and is the honest culmination of the session's Volterra arc.
 *
 * VERDICT: ELIMINATED AS A REDUCTION (with a residual OPEN sub-problem that is
 * RH-EQUIVALENT, not a shortcut).
 *
 * 1. The bare-Volterra biconditional (imp-1240/imp-1258 LINK B,
 *    ||V_{a,Phi}|| <= 1 <=> K_a >= 0) is PROVABLY impossible to revive by any
 *    fixed SCALAR normalization the Section-25-26-27 chain supplies. Confirmed
 *    at the genuine de Bruijn-Newman Phi (not a scaled Gaussian), U=6, N=200:
 *      - ||V|| is exactly degree-2 homogeneous (measured exponent 2.0000 across
 *        c in {1,3,10,100,1000}); K_a INERTIA is scale-INVARIANT (PSD at every c).
 *      - I - VV* = I - c^4 (V0 V0*) is genuinely non-homogeneous; its min-eig
 *        CROSSES zero (c=30: +0.029 PSD; c=100: -119; c=1000: -1.2e6) while K_a
 *        stays PSD throughout -> the two positivity conditions PROVABLY DECOUPLE
 *        even at the un-scaled Riemann Phi. The c=1 agreement is two-separately-
 *        true facts (c=1 sits ~5000x inside the ||V||<=1 ball and ~1e11 inside
 *        the K_a cone), NOT an operator identity.
 *      - Algebraic: sign(eig(K_a / N(c))) is c-invariant for any scalar N(c)>0,
 *        but sign(eig(I-VV*)) flips at c = 1/sqrt(||V0||); no scalar normalization
 *        equates a scale-invariant CONE with a scale-bounded SUBLEVEL SET.
 *
 * 2. THE "5000x FROM SATURATION" EVIDENCE IS A HOMOGENEITY ARTIFACT. imp-1240's
 *    "25 norms all > 5000x below 1" measures the BARE, scale-miscalibrated
 *    operator (||V|| ~ c^2 with c silently absorbing Phi's super-exponentially-
 *    small scale). It is NOT empirical evidence for Conj 27.2. The most
 *    persuasive number behind the whole Volterra route was measuring the wrong
 *    object. (imp-1240 should be downgraded in the program ledger.)
 *
 * 3. THE ONLY SURVIVING TARGET IS RH-EQUIVALENT. The lone non-ruled-out path is
 *    a NON-scalar operator reshaping to the normalized relative operator
 *    R = Gpass^{-1/2} Gshear Gpass^{-1/2} (degree-0, scale-invariant -- the
 *    right class). But proving ||R|| <= 1 <=> K_a >= 0 is, by all three routes,
 *    a faithful, information-preserving restatement of Conj 26.3 / no-ghost /
 *    K_a >= 0 -- it carries FULL RH strength. ||V|| <= 1 is scale-bounded and
 *    carries strictly LESS information than the scale-invariant K_a >= 0; any
 *    normalization restoring the missing scale information must inject the full
 *    K_a content, so it cannot be cheaper than proving K_a >= 0 directly. Conj
 *    26.3 is a RED HERRING for the scale gap: it is itself degree-2 / scale-
 *    invariant (same side as K_a), and at the Riemann Phi the RAW diagonal does
 *    NOT dominate (nu exceeds mu_diag on ~64% of the tau range -- exactly as
 *    Section 27 itself admits); the needed mu^pass (endpoint-bridge-enriched) is
 *    unconstructed.
 *
 * BOTTOM LINE. The Volterra/27.2 route is PCC-FREE but does NOT collapse RH to a
 * single operator-norm bound. It is a faithful REFORMULATION of RH, as hard as
 * RH, not a reduction to something cheaper. This matches the session pattern:
 * every promising route, under skeptical scrutiny, is either NOT rigorous
 * (finite-N beat, C_H undischargeable) or RH-EQUIVALENT (Volterra) -- the
 * project has reformulations of RH, not a hidden shortcut. PLATT-TRUDGIAN
 * Lambda <= 0.2 REMAINS THE RIGOROUS SOTA. No false QED.
 *
 * @see section27-identity-refutation-2026-06-17 (THE_REAL_GAP, now superseded by the below)
 * @see strategic-reframe-pcc-free-volterra-2026-06-17 (the PCC-free finding, still stands)
 * @see imp-1240-volterra-norm-pilot (the 5000x margin -- now a flagged artifact)
 */

import { IMP_1258_VOLTERRA_CDB_BRIDGE } from './imp-1258-volterra-cdb-bridge.js';
import { SECTION26_MUPASS_OPERATOR_VERDICT } from './section26-mupass-operator-verdict-2026-06-30.js';

export const SECTION26_VERDICT = {
  date: '2026-06-18',
  verdict: 'ELIMINATED AS A REDUCTION; residual OPEN sub-problem is RH-EQUIVALENT, not a shortcut',
  bareBiconditional: 'provably impossible to revive by any scalar normalization (decoupling reproduced at the genuine Riemann Phi)',
  fiveThousandXArtifact: 'imp-1240 "5000x below 1" measures the bare scale-miscalibrated operator (||V||~c^2); NOT evidence for Conj 27.2',
  survivingTarget: 'prove ||R||<=1 <=> K_a>=0 for R=Gpass^{-1/2} Gshear Gpass^{-1/2} (degree-0); but this is a faithful restatement of K_a>=0, RH-equivalent',
  conj263: 'RED HERRING for the scale gap (itself scale-invariant); raw diagonal does NOT dominate at the Riemann Phi (64% of tau)',
  sota: 'No refereed bound is changed',
  sessionPattern: 'every route is either NOT rigorous or RH-EQUIVALENT; the project has reformulations of RH, not a shortcut',
};

export const THE_REAL_GAP_REVISED = {
  supersedes: 'section27-identity-refutation-2026-06-17 THE_REAL_GAP (the c-pinning / scalar-normalization framing)',
  statement: 'CONSTRUCT the canonical Section-26 passive-core Gram Gpass (endpoint-bridge-enriched mu^pass, NOT the raw diagonal) and PROVE the de-homogenized ||R||<=1 <=> K_a>=0 with R = Gpass^{-1/2} Gshear Gpass^{-1/2}.',
  honestCaveat: 'RH-EQUIVALENT: even if completed, this is a faithful restatement of Conj 26.3 / no-ghost / K_a>=0, NOT a reduction below RH. It renames the hard problem; it does not collapse 7+ conjectures into a cheaper one.',
  doNot: 'Do NOT re-run the bare-V pilot (imp-1240) -- it measures the wrong (scale-miscalibrated) operator.',
  status: 'open and RH-hard',
};

export const SECTION26_VERDICT_ASSERTIONS = [
  {
    id: 'sec26-killed-as-reduction',
    description: 'Verdict recorded: collapse ELIMINATED as a reduction; bare biconditional impossible by scalar normalization',
    holds: () => /ELIMINATED AS A REDUCTION/.test(SECTION26_VERDICT.verdict) && /provably impossible/.test(SECTION26_VERDICT.bareBiconditional),
  },
  {
    id: 'sec26-5000x-is-artifact',
    description: 'The imp-1240 5000x margin is recorded as a homogeneity artifact, not evidence for Conj 27.2',
    holds: () => /artifact|scale-miscalibrated/.test(SECTION26_VERDICT.fiveThousandXArtifact) && /NOT evidence/.test(SECTION26_VERDICT.fiveThousandXArtifact),
  },
  {
    id: 'sec26-surviving-target-rh-equivalent-sota-unchanged',
    description: 'Surviving target recorded as RH-equivalent (not a shortcut); no refereed bound is changed',
    holds: () => /RH-EQUIVALENT|RH-equivalent|restatement/.test(THE_REAL_GAP_REVISED.honestCaveat) && /Platt-Trudgian|refereed bound is changed/.test(SECTION26_VERDICT.sota),
  },
  {
    id: 'sec26-cross-bridge-cannot-regrade-to-reduction',
    description: 'Cross-file tripwire (imp-2748): the imp-1258 Volterra-CDB bridge and this verdict module cannot diverge. The bridge masterVerdict must stay the downgraded CONDITIONAL / link-B-refuted value (NOT a clean reduction), the bridge one-liner must record NOT ESTABLISHED and never re-assert a shortcut, this verdict must stay RH-EQUIVALENT, and the withdrawn 5000x margin must stay flagged as an artifact (NOT evidence of progress) in both. Fails if either file regrades the collapse to a cheaper-than-RH reduction.',
    holds: () => {
      const mv = IMP_1258_VOLTERRA_CDB_BRIDGE.masterVerdict;
      const bridgeStaysDowngraded = /CONDITIONAL/.test(mv) && /refuted/i.test(mv);
      const oneLine = IMP_1258_VOLTERRA_CDB_BRIDGE.oneLine.toLowerCase();
      const noCheapClaim = oneLine.includes('not established') && !/\bshortcut\b/.test(oneLine);
      const sec26RhEquiv = /RH-EQUIVALENT|RH-equivalent|restatement/.test(THE_REAL_GAP_REVISED.honestCaveat) && /ELIMINATED AS A REDUCTION/.test(SECTION26_VERDICT.verdict);
      const artifactFlagged = /artifact|scale-miscalibrated/.test(SECTION26_VERDICT.fiveThousandXArtifact) && /NOT evidence/.test(SECTION26_VERDICT.fiveThousandXArtifact);
      return bridgeStaysDowngraded && noCheapClaim && sec26RhEquiv && artifactFlagged;
    },
  },
  {
    id: 'sec26-mupass-target-is-operator-order-not-mass-order',
    description: 'Cross-file tripwire (imp-3145), citing section26-mupass-operator-verdict-2026-06-30: the surviving mu^pass / Conj-26.3 target is RH-EQUIVALENT and is governed by OPERATOR order (Gpass >= |Gshear| <=> ||R||<=1 <=> K_a>=0), NEVER by mass order. Mass-feasibility (deficit 2400-20000x below the bridge budget) is necessary-but-NOT-binding, and the only core attaining ||R||<=1 is the tautological Gpass=|Gshear| partial isometry. Fails if the operator-verdict ever drops the RH-EQUIVALENT grade, claims a scalar/diagonal mu^pass dominates Gshear, regrades to a cheaper-than-RH reduction, or asserts mass-feasibility as binding. Any future row claiming mu^pass dominates nu must specify operator order, not mass order.',
    holds: () => {
      const ov = SECTION26_MUPASS_OPERATOR_VERDICT;
      const operatorRhEquiv = /RH-EQUIVALENT/.test(ov.verdict) && /K_a>=0/.test(ov.residualIsKaPositive);
      const onlyTautologicalCore = /no scalar\/diagonal mu\^pass dominates/.test(ov.noScalarCore) && /only Gpass=\|Gshear\| gives \|\|R\|\|=1/.test(ov.noScalarCore);
      const massNotBinding = /necessary-but-not-binding/.test(ov.residualIsKaPositive);
      const operatorNoReduction = /no reduction/.test(ov.sota);
      return operatorRhEquiv && onlyTautologicalCore && massNotBinding && operatorNoReduction;
    },
  },
];

for (const a of SECTION26_VERDICT_ASSERTIONS) {
  if (!a.holds()) throw new Error(`section26-verdict assertion failed: ${a.id}`);
}
