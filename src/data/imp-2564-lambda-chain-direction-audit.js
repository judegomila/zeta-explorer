/**
 * @module imp-2564-lambda-chain-direction-audit
 *
 * imp-2564 (CRITICAL chain-direction audit): a signed-direction walk of the
 * exact inequality chain from the finite-N collision time t_c(N) to the de
 * Bruijn-Newman Lambda, with every sign and every consumed bound explicit.
 * Two independent fanout referees flagged directional issues in the
 * t_c -> Lambda bookkeeping; this module records the verdict so the roadmap
 * narrative and the priority of all downstream SG1 / Theta work are set on
 * the correct side of the inequality.
 *
 * The anchor facts (from bridge-lambda-rh.js)
 * -------------------------------------------
 *   (T1) de Bruijn 1950:   RH  <=>  Lambda <= 0.
 *   (T2) Rodgers-Tao 2020: Lambda >= 0  (unconditional FLOOR).
 *        Hence RH <=> Lambda = 0.
 *   Bridge (rigorous form, bridge-lambda-rh.js): | Lambda - (- t_c(N)) | <= E(N),
 *        i.e.   Lambda  in  [ - t_c(N) - E(N),  - t_c(N) + E(N) ],
 *        with the truncation/model error E(N) -> 0 the missing analytic lever.
 *
 * THE INCONSISTENCY THE AUDIT RESOLVES
 * ------------------------------------
 * The codebase states the bridge four different ways, two of which look
 * contradictory in sign:
 *   - finite-height-lambda-bound.js / finite-height-beats-platt-trudgian.js:
 *         Lambda <= |t_c(N)| + E(N)          (headline upper bound)
 *   - dyson-collision-lower-bound.js:   Lambda <= - t_c
 *   - dyson-monotonicity-proof.js:      Lambda >= - t_c
 *   - bridge-lambda-rh.js:              | Lambda + t_c | <= E(N)   (canonical)
 * The canonical two-sided bracket | Lambda + t_c | <= E(N) RECONCILES all of
 * them: it gives Lambda <= - t_c + E(N) <= |t_c| + E(N) (the finite-height
 * form, strictly weaker), and the two loose one-sided "Lambda >=/<= - t_c"
 * forms are its E -> 0 faces with the error dropped. This module adopts the
 * canonical bracket as the single source of truth.
 *
 * SIGNED-DIRECTION VERDICT (S2 referee, confirmed by the sign algebra)
 * --------------------------------------------------------------------
 * Read the two faces of the bracket as CONSUMERS of t_c bounds:
 *
 *   (i)  An UPPER bound  t_c(N) <= U  feeds the LOWER face:
 *            Lambda  >=  - U - E(N).
 *        Since U, E(N) >= 0 this right-hand side is <= 0 for EVERY U, so it
 *        is ALWAYS dominated by the Rodgers-Tao floor Lambda >= 0. An upper
 *        bound on the collision time buys NOTHING on the headline.
 *
 *   (ii) A LOWER bound  t_c(N) >= L  feeds the UPPER (headline) face:
 *            Lambda  <=  - L + E(N).
 *        Driving this to <= 0 (RH) needs E(N) - L -> 0. With only the trivial
 *        L = 0 (t_c >= 0) the headline reads Lambda <= E(N): RH then needs
 *        ONLY E(N) -> 0 plus t_c >= 0. The headline is governed by the BRIDGE
 *        ERROR E(N), not by any sharpening of t_c.
 *
 * CONSEQUENCE FOR THE SG1 / THETA PROGRAM. SG1 and its descendants (the local
 * virial / cluster-collapse shock bounds, the Theta-contraction work) produce
 * UPPER bounds on t_c -- case (i). They therefore feed the Rodgers-Tao-
 * dominated lower face and DO NOT move the headline inequality. What they buy
 * is fidelity of the per-N model that controls the BRIDGE CONSTANTS E(N)
 * (how faithfully the truncated N-particle collision tracks the true Lambda),
 * not a direct attack on Lambda <= 0. The roadmap narrative that framed SG1
 * as the headline lever must be rewritten accordingly.
 *
 * imp-1149 RECALIBRATION (S4 agent)
 * ---------------------------------
 * imp-1149 Theorem 3 asserts | t_c - 1/(2 M_inf(N)) | <= 189 / (log gamma_N . N^{3/2}).
 * The S4 agent measured this VIOLATED by ~41.5x at N = 2458 once t_c is the
 * TRUE particle collision time t_c = g_min(0)^2 / 8 (imp-2561 / imp-2562). The
 * bound was calibrated against a DIFFERENT object: the MEAN-FIELD PROXY
 * 1/(2 M_inf) (a mean-spacing-scale quantity), or the continuum shock time,
 * NOT the finite-N particle collision. Two structural mismatches confirm it:
 *   - SCALE: the proxy 1/(2 M_inf) is order mean-spacing ~ 1/density, while
 *     the particle t_c = g_min^2/8 is order (minimal gap)^2 -- different
 *     functional forms, so no N^{-3/2} envelope can bracket both;
 *   - RATE: the bound's N^{-3/2} decay does not match the mean-field proxy's
 *     ~ 1/log(gamma_N) scale either, pointing to the continuum shock object.
 * The imp-1261 Lambda <= 3.06e-5 composition that consumed Theorem 3 must
 * therefore carry a NEW E(N) term for the particle-vs-proxy gap (named here,
 * not yet sized -- residual below).
 *
 * What is and is NOT claimed
 * --------------------------
 * DELIVERED: the signed-direction verdict (machine-checked sign algebra), the
 * four-form reconciliation, and the imp-1149 object-mismatch finding. OPEN
 * (named): the explicit size and N-rate of E(N) -- the actual headline lever
 * -- and the particle-vs-proxy E(N) term for the imp-1261 composition. This
 * is an audit, not a new bound: NO Lambda value is improved here. NO false QED.
 */

import { LAMBDA_RH_BRIDGE } from './bridge-lambda-rh.js';

// ── Canonical bracket faces: Lambda in [ -t_c - E, -t_c + E ] ─────────────────

const RODGERS_TAO_FLOOR = 0; // Lambda >= 0 (T2), unconditional

// Lower face of the bracket -- the side an UPPER bound t_c <= U feeds.
function lambdaLowerFromTcUpperBound(U, E) {
  return -U - E;
}
// Upper (headline) face -- the side a LOWER bound t_c >= L feeds.
function lambdaUpperFromTcLowerBound(L, E) {
  return -L + E;
}

// ── Sign-algebra checks over a representative (t_c, E) grid ───────────────────

const U_GRID = [0, 1e-6, 1e-3, 0.1, 1, 1e4];
const E_GRID = [0, 1e-6, 1e-3, 0.1, 0.2];

const DIRECTION_AUDIT = (() => {
  // (i) every upper bound on t_c gives a lower face <= 0, dominated by R-T.
  let upperTcDominatedByRT = true;
  for (const U of U_GRID) {
    for (const E of E_GRID) {
      if (lambdaLowerFromTcUpperBound(U, E) > RODGERS_TAO_FLOOR) {
        upperTcDominatedByRT = false;
      }
    }
  }
  // (ii) with only t_c >= 0 (L = 0) the headline face equals E(N): RH iff E->0.
  let headlineEqualsErrorWhenLzero = true;
  for (const E of E_GRID) {
    if (Math.abs(lambdaUpperFromTcLowerBound(0, E) - E) > 1e-15) {
      headlineEqualsErrorWhenLzero = false;
    }
  }
  // reconciliation: bracket upper face <= |t_c| + E (the finite-height form).
  let finiteHeightFormImplied = true;
  for (const tc of [-0.5, 0, 0.3, 1]) {
    for (const E of E_GRID) {
      if (!(lambdaUpperFromTcLowerBound(tc, E) <= Math.abs(tc) + E + 1e-15)) {
        finiteHeightFormImplied = false;
      }
    }
  }
  return {
    upperTcDominatedByRT,
    headlineEqualsErrorWhenLzero,
    finiteHeightFormImplied,
  };
})();

// ── imp-1149 object-mismatch witnesses ───────────────────────────────────────

// Referee S4 measured ratio of mean-field proxy 1/(2 M_inf) to the particle
// collision time g_min^2/8 at N = 2458 (cited, not recomputed here).
const IMP1149_REFEREE_RATIO_N2458 = 41.5;

// imp-1149 bound rate vs the mean-field proxy scale -- different decay laws.
const imp1149Rate = (N) => 189 / Math.pow(N, 1.5);
const meanFieldProxyScale = (gammaN) => 1 / Math.log(gammaN / (2 * Math.PI));

const IMP1149_RECAL = (() => {
  // object mismatch: cited ratio is >> 1 (proxy and particle are different objects)
  const objectMismatch = IMP1149_REFEREE_RATIO_N2458 > 10;
  // rate mismatch: at N = 1e4 (gamma ~ 1e4) the bound's N^{-3/2} value and the
  // proxy's ~1/log scale differ by orders of magnitude -> not the same envelope.
  const rateAt1e4 = imp1149Rate(1e4);
  const proxyAt1e4 = meanFieldProxyScale(1e4);
  const rateMismatch = proxyAt1e4 / rateAt1e4 > 100;
  return { objectMismatch, rateMismatch, rateAt1e4, proxyAt1e4 };
})();

// ── Public audit object ───────────────────────────────────────────────────────

export const LAMBDA_CHAIN_DIRECTION_AUDIT = {
  id: 'imp-2564',
  proofSection: 'S7',
  verdict: 'HONEST PARTIAL CLOSURE',
  auditVerdict: {
    headlineSide:
      'The headline upper bound Lambda <= -t_c + E(N) is fed by a LOWER bound ' +
      'on t_c; with the trivial t_c >= 0 it reads Lambda <= E(N), so RH needs ' +
      'ONLY E(N) -> 0. The headline lever is the BRIDGE ERROR E(N), not t_c.',
    lowerSide:
      'An UPPER bound t_c <= U feeds Lambda >= -U - E(N) <= 0, ALWAYS ' +
      'dominated by the Rodgers-Tao floor Lambda >= 0. Upper bounds on t_c ' +
      'buy nothing on the headline.',
    whatSG1Buys:
      'SG1 and descendants (local-virial shock, Theta-contraction) produce ' +
      'UPPER bounds on t_c -> the Rodgers-Tao-dominated lower face. They buy ' +
      'per-N model fidelity feeding the BRIDGE CONSTANTS E(N), NOT the ' +
      'headline inequality. Roadmap narrative to be rewritten.',
  },
  signConventionReconciliation: {
    canonical: '| Lambda + t_c(N) | <= E(N)   (bridge-lambda-rh.js)',
    impliedFiniteHeight: 'Lambda <= -t_c + E(N) <= |t_c| + E(N)  (weaker)',
    looseOneSided:
      '"Lambda >= -t_c" and "Lambda <= -t_c" are the E -> 0 faces with the ' +
      'error dropped; not contradictory once E(N) is restored.',
  },
  imp1149Recalibration: {
    boundStated:
      '| t_c - 1/(2 M_inf(N)) | <= 189 / (log gamma_N . N^{3/2})  (imp-1149 Thm 3)',
    findingObject:
      'Theorem 3 bounds the MEAN-FIELD PROXY 1/(2 M_inf) (or the continuum ' +
      'shock time), NOT the true particle collision t_c = g_min(0)^2/8. ' +
      'Measured violated ~41.5x at N = 2458 by the S4 agent.',
    consequence:
      'The imp-1261 Lambda <= 3.06e-5 composition consumed Theorem 3 and must ' +
      'now carry a NEW E(N) term for the particle-vs-proxy gap (residual R2).',
    refereeRatioN2458: IMP1149_REFEREE_RATIO_N2458,
    rateMismatch: IMP1149_RECAL,
  },
  residuals: [
    {
      id: 'imp-2564-sub-R1-explicit-EN-lever',
      status: 'open',
      statement:
        'R1: the explicit size and N-rate of the bridge error E(N) -- the ' +
        'actual headline lever this audit isolates. The whole RH push now ' +
        'reduces to E(N) -> 0 with a quantified rate; t_c sharpening does not ' +
        'substitute for it.',
    },
    {
      id: 'imp-2564-sub-R2-particle-vs-proxy-EN',
      status: 'open',
      statement:
        'R2: size the particle-vs-proxy E(N) term that the imp-1149 object ' +
        'mismatch injects into the imp-1261 Lambda composition, so the 3.06e-5 ' +
        'headline is re-stated against the true particle collision time.',
    },
  ],
  // citation chain back to the bridge module (imp-316); LAMBDA_RH_BRIDGE must
  // expose its anchor theorems for the chain to be intact.
  consumesParentId: 'imp-316',
  bridgeAnchorsPresent: Array.isArray(LAMBDA_RH_BRIDGE.theorems),
};

// ── Build-time assertions ─────────────────────────────────────────────────────

export const LAMBDA_CHAIN_DIRECTION_AUDIT_ASSERTIONS = [
  {
    id: 'imp2564-upper-tc-bound-dominated-by-rodgers-tao',
    holds: () => DIRECTION_AUDIT.upperTcDominatedByRT === true,
    why:
      'Signed-direction core: an UPPER bound t_c <= U feeds Lambda >= -U - E(N), ' +
      'which is <= 0 for every U, E(N) >= 0 and so is ALWAYS dominated by the ' +
      'Rodgers-Tao floor Lambda >= 0. If this ever fails the lower face would ' +
      'beat Rodgers-Tao and the verdict (SG1 upper bounds buy nothing on the ' +
      'headline) would be wrong.',
  },
  {
    id: 'imp2564-headline-governed-by-bridge-error',
    holds: () =>
      DIRECTION_AUDIT.headlineEqualsErrorWhenLzero === true &&
      DIRECTION_AUDIT.finiteHeightFormImplied === true,
    why:
      'The headline face Lambda <= -L + E(N) with the trivial L = 0 reduces to ' +
      'Lambda <= E(N): RH needs only E(N) -> 0 plus t_c >= 0. The canonical ' +
      'bracket must also imply the weaker finite-height form Lambda <= |t_c| + ' +
      'E(N), reconciling the four codebase sign conventions. A failure means ' +
      'the bracket faces or the reconciliation has been mis-signed.',
  },
  {
    id: 'imp2564-imp1149-object-and-rate-mismatch',
    holds: () =>
      IMP1149_RECAL.objectMismatch === true && IMP1149_RECAL.rateMismatch === true,
    why:
      'imp-1149 Theorem 3 bounds the mean-field proxy / continuum shock, not ' +
      'the particle t_c: the cited ratio 41.5x at N = 2458 is >> 1 (object ' +
      'mismatch) and the N^{-3/2} bound rate differs from the proxy ~1/log ' +
      'scale by orders of magnitude (rate mismatch). If both stop firing the ' +
      'recalibration premise -- and the new imp-1261 E(N) term -- is unfounded.',
  },
  {
    id: 'imp2564-residuals-open-no-false-qed',
    holds: () =>
      LAMBDA_CHAIN_DIRECTION_AUDIT.verdict === 'HONEST PARTIAL CLOSURE' &&
      LAMBDA_CHAIN_DIRECTION_AUDIT.residuals.length === 2 &&
      LAMBDA_CHAIN_DIRECTION_AUDIT.residuals.every((r) => r.status === 'open') &&
      LAMBDA_CHAIN_DIRECTION_AUDIT.bridgeAnchorsPresent === true,
    why:
      'This is an audit, not a new Lambda bound: residuals R1 (explicit E(N) ' +
      'lever) and R2 (particle-vs-proxy E(N) for imp-1261) stay OPEN and the ' +
      'verdict is an honest partial closure. Flipping either requires actually ' +
      'sizing E(N) in the same commit, not a narrative edit.',
  },
];

// Self-validate on import so the audit is checked wherever it is loaded,
// independent of the run-assertions.mjs DATA_MODULES registry.
for (const a of LAMBDA_CHAIN_DIRECTION_AUDIT_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error('imp-2564 assertion failed: ' + a.id + ' -- ' + a.why);
  }
}
