/**
 * @module data/imp-96614-field-channel-vs-g6b-step1-gap-lipschitz
 * @fileoverview imp-96614 -- assessment of whether the imp-3933 vector-FIELD-error
 *   channel reroute DISCHARGES the new blocking condition G6b-Step1-gap-Lipschitz
 *   introduced by the 2026-09-24 Route B overclaim baseline audit, or whether
 *   G6b-Step1-gap-Lipschitz is a genuinely DISTINCT obstruction.
 *
 *   CONTEXT. rh-bridge-route-b-overclaim-baseline-audit-2026-09-24.js FINDING 1
 *   demoted dyson-burgers-shock.js G6_PER_N_BOUND from "closed" to CONDITIONAL and
 *   named a new blocking condition G6b-Step1-gap-Lipschitz: the imp-366/imp-395
 *   Step-1 input
 *       S1    g_min(mu_N) <= C_Lip * W_1(mu_N, rho_inf)      with N-uniform C_Lip -> 1,
 *   which, combined with the imp-341 Koksma-Hlawka bound W_1 <= 3 pi log(gamma_N)/N,
 *   is the per-N small-gaps statement g_min(N) <= C_Lip * 3 pi log(gamma_N)/N. The
 *   audit measured the REQUIRED C_Lip on the Odlyzko zeros growing ~N^0.4 (0.90 at
 *   N=50, 1.39 at N=100, ..., 45.5 at N=1e6), so C_Lip -> 1 is FALSE from N=100 on
 *   and no N-uniform value is known (consistent with imp-2640 / ch-wall-frontier-
 *   verdict-2026-06-26: C_Lip provably non-N-uniform in the W_1 channel).
 *
 *   The imp-3933 reroute (clip-field-channel-reroute) bypasses the C_Lip wall in a
 *   DIFFERENT leg -- the E_coll leg of the Step-4 model-to-true error decomposition
 *   E(N) = E_trunc + E_flow + E_coll -- by replacing C_H * W_1^(1/2) with a
 *   vector-FIELD-error transfer modulus W(eps) between two flows dx/dt = F_Dyson + e
 *   that share the SAME zero-table initial data and obey |e_{l+1}-e_l| <= eps * g_l.
 *   That modulus is table-certified, N-uniform, slope ~3 H^4/64 (max 9.503e-8), and
 *   needs no Gronwall / no W_1 / no GUE (imp-96304 already assessed this for E_coll).
 *
 *   FINDING (assessment; no closure, no bound change).
 *   --------------------------------------------------
 *   The imp-3933 field-channel reroute DOES NOT discharge G6b-Step1-gap-Lipschitz.
 *   G6b-Step1 is a GENUINELY DISTINCT obstruction, in TWO orthogonal senses:
 *
 *   (1) DIFFERENT COMPARISON OBJECT -- discrete-vs-continuum W_1, not flow-vs-flow.
 *       G6b-Step1 bounds the discrete minimum gap g_min(mu_N) by the W_1 MEASURE
 *       distance from the empirical measure mu_N to the CONTINUUM equilibrium rho_inf
 *       (whose collision time tau_c(rho_inf) = 0). mu_N and rho_inf are DIFFERENT
 *       measures with DIFFERENT support. The imp-3933 reroute is architecturally
 *       confined to two flows sharing the SAME discrete zero-table initial data: its
 *       entire mechanism (the K_l := 2 sum_y 1/(|x_l - y||x_{l+1} - y|) <= eps
 *       gap-cancellation reduction, the no-Gronwall plateau-domination bootstrap)
 *       presupposes a common initial configuration so the 1/g_l factors cancel
 *       identically. Applied to (mu_N, rho_inf) the shared-initial-data premise fails
 *       outright -- there is nothing to cancel against a continuum measure. So the
 *       reroute cannot even be POSED for G6b-Step1, let alone discharge it.
 *
 *   (2) DIFFERENT MATHEMATICAL TYPE -- an arithmetic small-gaps theorem, not a
 *       flow-transfer modulus. Written with imp-341, G6b-Step1 IS the per-N
 *       small-gaps statement g_min(N) <= C_Lip * 3 pi log(gamma_N)/N for zeta zeros.
 *       The reroute produces a bound on the model-to-true collision-TIME transfer at
 *       given initial data; it says NOTHING about how small the initial gaps are.
 *       Indeed the reroute TAKES the discrete zero table (hence its gaps) as GIVEN
 *       input -- the very quantity G6b-Step1 must bound is a fixed premise of the
 *       reroute. A flow modulus cannot supply an arithmetic input about the zeros it
 *       flows; the 1-point density alone cannot supply it either (audit closurePath 3).
 *
 *   This is CONSISTENT with, and sharper than, imp-96304 (which found the reroute does
 *   not remove the W_1-metric C_Lip from the E_coll leg either): the SAME W_1-metric
 *   C_Lip verdicts stand, and here the discrete-vs-continuum framing makes the
 *   shared-initial-data premise fail by construction, not merely leave a gate open.
 *
 *   WHAT THE REROUTE DOES AND DOES NOT REACH.
 *   - Reaches: the E_coll leg of the Step-4 model-to-true error E(N) (via the OPEN
 *     imp-3933-sub-eps-certificate; imp-95518 discharges its displacement leg at the
 *     re-anchored plateaus). That leg is flow-to-flow at shared discrete initial data
 *     -- exactly the reroute's home channel.
 *   - Does NOT reach: G6b-Step1-gap-Lipschitz, the Route B per-N COLLISION-TIME bound
 *     |t_c(N)| <= 0.384 sqrt(log gamma_N / N). That bound needs the discrete-to-
 *     continuum gap-Lipschitz / small-gaps input, a distinct channel the reroute does
 *     not touch.
 *
 *   NET: G6b-Step1-gap-Lipschitz remains OPEN and is a genuinely DISTINCT obstruction
 *   from the E_coll C_Lip factor the field reroute re-channels. The rigor of Route B's
 *   per-N bound is unchanged by imp-3933. No refereed bound is changed.
 *   Assessment / measurement only. Closes no gap, changes no bound. RH open. NO QED.
 *
 * Provenance of every baked literal (cited, not recomputed):
 *   - rh-bridge-route-b-overclaim-baseline-audit-2026-09-24.js: requiredCLip ladder
 *     (0.90 @50 .. 45.5 @1e6, growth ~N^0.4); G6b-Step1-gap-Lipschitz named; the
 *     Route B chain S0-S4; closurePath "1-point density alone cannot supply it".
 *   - dyson-burgers-shock.js: G6_PER_N_BOUND.status conditional; blockingConditions
 *     entry G6b-Step1-gap-Lipschitz.
 *   - imp-3933-eps-field-robust-bootstrap.js: field-channel transfer modulus W(eps),
 *     maxCFieldSlope 9.503e-8, shared-initial-data + K_l gap-cancellation mechanism.
 *   - imp-96304-clip-field-channel-reroute-assessment.js: prior finding that the
 *     reroute re-channels (does not eliminate) the E_coll W_1-metric C_Lip.
 *
 * Syntax note: derivative-like expressions use brace notation dg_{k*}/dt and this
 *   header avoids the close-comment terminator sequence inside prose.
 */

// Cited from rh-bridge-route-b-overclaim-baseline-audit-2026-09-24.js (single source).
// requiredCLip = g_min(N) * N / (3 pi log gamma_N): the C_Lip the Step-1 input demands.
const REQUIRED_CLIP_LADDER = [
  { N: 50, requiredCLip: 0.9 },
  { N: 100, requiredCLip: 1.39 },
  { N: 200, requiredCLip: 1.77 },
  { N: 500, requiredCLip: 2.46 },
  { N: 1000, requiredCLip: 2.36 },
  { N: 2458, requiredCLip: 3.18 },
  { N: 5000, requiredCLip: 2.67 },
  { N: 10000, requiredCLip: 4.35 },
  { N: 100000, requiredCLip: 13.9 },
  { N: 1000000, requiredCLip: 45.5 },
];

// Cited from imp-3933-eps-field-robust-bootstrap.js (single source).
const FIELD_CHANNEL = {
  maxCFieldSlope: 9.502858e-8, // W(1)-W(0), the field-channel modulus slope ~3H^4/64
  sharedInitialData: true, // both flows start from the SAME discrete zero table
  cancellationKernel: 'K_l = 2 sum_y 1/(|x_l - y||x_{l+1} - y|) <= eps (g_l cancels identically)',
};

const ASSESSMENT = [
  {
    question:
      'Does the imp-3933 field-channel reroute discharge G6b-Step1-gap-Lipschitz?',
    answer: 'NO',
    detail:
      'G6b-Step1 is g_min(mu_N) <= C_Lip * W_1(mu_N, rho_inf): a discrete-measure-to- ' +
      'CONTINUUM W_1 comparison, equivalently the per-N small-gaps statement ' +
      'g_min(N) <= C_Lip 3 pi log(gamma_N)/N. The reroute is a flow-to-flow transfer ' +
      'modulus at SHARED discrete zero-table initial data; its mechanism presupposes a ' +
      'common configuration, which mu_N and rho_inf do not share. The reroute cannot be ' +
      'posed for this comparison and produces no bound on g_min(N).',
  },
  {
    question:
      'Is G6b-Step1-gap-Lipschitz a genuinely distinct obstruction from the E_coll C_Lip the reroute re-channels?',
    answer: 'YES -- distinct in both comparison object and mathematical type',
    detail:
      '(object) E_coll is a flow-to-flow model-to-true transfer at shared initial data ' +
      '(the reroute home channel; imp-96304). G6b-Step1 is a discrete-vs-continuum W_1 ' +
      'measure comparison. (type) The reroute yields a collision-TIME transfer modulus; ' +
      'G6b-Step1 is an arithmetic small-gaps THEOREM about the zeros the flow takes as ' +
      'fixed input. A flow modulus cannot supply an arithmetic input about its own initial data.',
  },
  {
    question: 'What remains gated for the Route B per-N bound after this assessment?',
    answer: 'G6b-Step1-gap-Lipschitz stays OPEN; the reroute does not move it',
    detail:
      'The per-N bound |t_c(N)| <= 0.384 sqrt(log gamma_N / N) stays CONDITIONAL on ' +
      'G6b-Step1-gap-Lipschitz (audit FINDING 1). The imp-3933 reroute helps only the ' +
      'E_coll leg of the separate Step-4 error E(N) = E_trunc + E_flow + E_coll, itself ' +
      'gated on the OPEN imp-3933-sub-eps-certificate. Two different channels; the ' +
      'required C_Lip in the W_1 channel still grows ~N^0.4 (0.90 @50 .. 45.5 @1e6).',
  },
];

export const IMP96614_FIELD_CHANNEL_VS_G6B_STEP1 = {
  id: 'imp-96614',
  title:
    'Assessment: the imp-3933 field-channel reroute does NOT discharge the new ' +
    'G6b-Step1-gap-Lipschitz blocking condition -- it is a genuinely distinct obstruction',
  kind: 'assessment / measurement (no closure, no bound change)',
  blockingCondition: {
    id: 'G6b-Step1-gap-Lipschitz',
    namedBy: 'rh-bridge-route-b-overclaim-baseline-audit-2026-09-24 FINDING 1',
    statement: 'g_min(mu_N) <= C_Lip * W_1(mu_N, rho_inf) with N-uniform C_Lip -> 1',
    equivalentSmallGaps: 'g_min(N) <= C_Lip * 3 pi log(gamma_N)/N (with imp-341 Koksma-Hlawka)',
    comparison: 'discrete empirical measure mu_N vs CONTINUUM equilibrium rho_inf (different measures)',
    requiredCLipLadder: REQUIRED_CLIP_LADDER,
    requiredCLipGrowth: '~N^0.4 (C_Lip -> 1 false from N=100 on; non-N-uniform, imp-2640 / ch-wall-frontier-verdict)',
    status: 'OPEN',
  },
  fieldChannel: FIELD_CHANNEL,
  rerouteReachesLeg: 'E_coll of E(N) = E_trunc + E_flow + E_coll (flow-to-flow, shared discrete initial data)',
  rerouteDoesNotReach: 'G6b-Step1-gap-Lipschitz (discrete-vs-continuum W_1 / arithmetic small-gaps input)',
  assessment: ASSESSMENT,
  verdict:
    'DISTINCT OBSTRUCTION, NOT DISCHARGED. The imp-3933 vector-field-error reroute is ' +
    'architecturally confined to two flows sharing the SAME discrete zero-table initial ' +
    'data (its K_l gap-cancellation bootstrap presupposes a common configuration), whereas ' +
    'G6b-Step1-gap-Lipschitz bounds g_min(mu_N) by the W_1 distance from the discrete measure ' +
    'mu_N to the CONTINUUM equilibrium rho_inf -- a discrete-vs-continuum comparison the ' +
    'reroute cannot even be posed for. Written with imp-341 it is the per-N small-gaps theorem ' +
    'g_min(N) <= C_Lip 3 pi log(gamma_N)/N, an arithmetic input about the very zeros the flow ' +
    'takes as fixed data; a flow-transfer modulus cannot supply it. This is consistent with, ' +
    'and sharper than, imp-96304 (reroute re-channels but does not eliminate the E_coll ' +
    'W_1-metric C_Lip): here the shared-initial-data premise fails by construction. The reroute ' +
    'therefore helps only the separate E_coll leg of the Step-4 error E(N); the Route B per-N ' +
    'collision-time bound stays CONDITIONAL on G6b-Step1-gap-Lipschitz, which stays OPEN and ' +
    'is a genuinely distinct obstruction. No bound moved. No refereed bound is changed' +
    '. RH open. NO QED.',
  provenance:
    'rh-bridge-route-b-overclaim-baseline-audit-2026-09-24.js (FINDING 1, requiredCLip ladder, ' +
    'G6b-Step1-gap-Lipschitz); dyson-burgers-shock.js (G6_PER_N_BOUND.status conditional, ' +
    'blockingConditions); imp-3933-eps-field-robust-bootstrap.js (W(eps), shared-initial-data ' +
    'K_l mechanism); imp-96304-clip-field-channel-reroute-assessment.js (E_coll re-channeling)',
};

export const IMP96614_FIELD_CHANNEL_VS_G6B_STEP1_ASSERTIONS = [
  {
    id: 'imp96614-reroute-does-not-discharge-g6b-step1',
    holds: () =>
      ASSESSMENT[0].answer === 'NO' &&
      IMP96614_FIELD_CHANNEL_VS_G6B_STEP1.blockingCondition.status === 'OPEN',
    why:
      'The reroute must NOT be recorded as discharging G6b-Step1-gap-Lipschitz: the blocking ' +
      'condition stays OPEN. If a future edit flips this it must exhibit the discrete-to- ' +
      'continuum gap-Lipschitz / small-gaps proof and overturn the audit FINDING 1 verdict.',
  },
  {
    id: 'imp96614-obstruction-is-distinct',
    holds: () =>
      /YES/.test(ASSESSMENT[1].answer) &&
      /DISTINCT OBSTRUCTION, NOT DISCHARGED/.test(
        IMP96614_FIELD_CHANNEL_VS_G6B_STEP1.verdict,
      ),
    why:
      'G6b-Step1 (discrete-vs-continuum W_1 / arithmetic small-gaps) is a genuinely distinct ' +
      'obstruction from the E_coll flow-to-flow C_Lip the reroute re-channels; the record must ' +
      'keep the two channels separate and never conflate them.',
  },
  {
    id: 'imp96614-shared-initial-data-premise',
    holds: () =>
      FIELD_CHANNEL.sharedInitialData === true &&
      IMP96614_FIELD_CHANNEL_VS_G6B_STEP1.rerouteDoesNotReach.includes('G6b-Step1') &&
      IMP96614_FIELD_CHANNEL_VS_G6B_STEP1.rerouteReachesLeg.includes('E_coll'),
    why:
      'The reroute is confined to shared-initial-data flow-to-flow transfer (E_coll); the ' +
      'discrete-vs-continuum G6b-Step1 comparison violates that premise, so the reroute cannot ' +
      'be posed for it. This shared-initial-data confinement is the crux of the distinctness.',
  },
  {
    id: 'imp96614-required-clip-not-n-uniform',
    holds: () => {
      const byN = Object.fromEntries(REQUIRED_CLIP_LADDER.map((r) => [r.N, r.requiredCLip]));
      return byN[50] < 1 && byN[100] > 1.3 && byN[1000000] > 40 && byN[1000000] / byN[100] > 30;
    },
    why:
      'The cited requiredCLip ladder must keep the audit finding that C_Lip -> 1 is false from ' +
      'N=100 on and grows ~N^0.4 (0.90 @50 to 45.5 @1e6); this is why the W_1-channel gate the ' +
      'reroute would need to reach is genuinely non-N-uniform.',
  },
  {
    id: 'imp96614-no-closure-claimed',
    holds: () =>
      IMP96614_FIELD_CHANNEL_VS_G6B_STEP1.kind.includes('no closure') &&
      /NO QED/.test(IMP96614_FIELD_CHANNEL_VS_G6B_STEP1.verdict) &&
      /Platt-Trudgian Lambda <= 0.2|refereed bound is changed/.test(IMP96614_FIELD_CHANNEL_VS_G6B_STEP1.verdict),
    why:
      'This ticket is assessment/measurement only. It must not claim closure of G6b-Step1, of ' +
      'the Route B per-N bound, or of any bound; no refereed bound is changed.',
  },
];
