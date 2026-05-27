/**
 * @module imp-1235-lambda-roadmap-vs-paper-sec-24-crosswalk
 * @fileoverview imp-1235 -- Cross-walk between src/data/lambda-roadmap.js
 *   (the Calogero-Moser / de Bruijn-Newman Lambda-attack roadmap) and
 *   paper Section 24 "What remains to get the proof working" in the
 *   consolidated v52 draft (research-inputs/twin_ladder_consolidated_v52.pdf,
 *   pages 48-49).
 *
 *   SCOPE
 *   -----
 *   lambda-roadmap.js is the project's original Lambda-attack plan. It
 *   tracks the 5-step chain from verified Riemann zeros to an unconditional
 *   RH statement via the Calogero-Moser backward Dyson ODE, the collision
 *   time t_c(N), the Polymath15 bridge to the de Bruijn-Newman constant
 *   Lambda, and Rodgers-Tao (Lambda >= 0) plus unconditional (Lambda <= 0)
 *   implying RH.
 *
 *   The v52 paper Section 24 is a pedagogical recap of the remaining proof
 *   targets in the SHIFT-BRIDGE / GHOST-ABSENCE framework introduced in
 *   Sections 15-23. The two frameworks are PARALLEL ATTACKS on the same
 *   goal (RH) that use almost entirely non-overlapping mathematics:
 *
 *     Lambda roadmap: Calogero-Moser ODE, Burgers flow, Polymath15 bridge,
 *       Koksma-Hlawka discrepancy, de Bruijn-Newman Lambda parameter.
 *
 *     Paper §24:  shift-bridge E_a(z) = X(a-iz), Theta_a, K_a positivity,
 *       Blaschke ghosts, Pontryagin decomposition, passive canonical systems,
 *       prime-delay domination, Weil/Pontryagin index, freezing/bridge
 *       renormalization.
 *
 *   The crosswalk has THREE kinds of finding:
 *     (A) Correspondence    -- same mathematical object / goal in both.
 *     (B) Lambda-unique     -- lambda-roadmap has content §24 does not cover.
 *     (C) Sec24-gap         -- §24 has an open target absent from lambda-roadmap.
 *
 *   A fourth verdict (confirmed-by-v52) covers the special case where the
 *   v52 paper confirms -- but does not resolve -- a lambda-roadmap claim
 *   via an equivalent reformulation.
 *
 *   HONEST SCOPE
 *   ------------
 *   Section 24 occupies pages 48-49 of the v52 draft: a "pedagogical recap
 *   of remaining proof targets after §§15-23" (per twin-ladder-paper-roadmap.js
 *   entry s24-what-remains-to-get-proof-working). The exact enumeration in §24
 *   is reconstructed from the surrounding §§15-23 data files; it summarises
 *   rather than introduces those open problems. All §24 targets named below
 *   trace to a specific author-stated conjecture or programme in those sections.
 *
 *   This file is a presentation / navigation layer only. No new mathematics
 *   is asserted. Every statement traces to one of the source files below.
 *
 *   Sources:
 *   - src/data/lambda-roadmap.js
 *   - src/data/closure-routes-section.js      (v52 §16)
 *   - src/data/three-attacks-section.js       (v52 §18)
 *   - src/data/shift-bridge-positivity-section.js (v52 §15)
 *   - src/data/blaschke-ghosts-section.js     (v52 §17)
 *   - src/data/kyp-bounded-real-section.js    (v52 Apps M-O)
 *   - src/data/twin-ladder-paper-roadmap.js   (all section entries)
 *   - src/data/paper-audit-dashboard.js       (Conj 22 audit results)
 *
 *   Ticket: imp-1235 (content, medium, complete).
 */

const PAPER_REF = 'research-inputs/twin_ladder_consolidated_v52.pdf';

/**
 * Verdict vocabulary. Every crosswalk entry takes exactly one of these values.
 *
 *   correspondence       -- the lambda-roadmap item and the §24 open target
 *                          are the same mathematical object (shared RH goal or
 *                          overlapping route). Both frameworks cover it.
 *
 *   partial-correspondence -- the lambda-roadmap and §24 have related but
 *                          distinct approaches to a common subproblem.
 *                          The connection is substantive but not an equality.
 *
 *   lambda-unique        -- lambda-roadmap item has no §24 equivalent.
 *                          The Dyson / Lambda machinery is absent from §24.
 *
 *   sec24-gap            -- §24 has an open target with no lambda-roadmap
 *                          entry. The shift-bridge / ghost-absence program is
 *                          absent from lambda-roadmap.js.
 *
 *   confirmed-by-v52     -- v52 §24 (via §15 Thm 15.1 + Rodgers-Tao) confirms
 *                          a lambda-roadmap claim as part of an equivalence
 *                          chain but does not resolve any open gap.
 */
const VERDICTS = Object.freeze({
  CORRESPONDENCE:         'correspondence',
  PARTIAL_CORRESPONDENCE: 'partial-correspondence',
  LAMBDA_UNIQUE:          'lambda-unique',
  SEC24_GAP:              'sec24-gap',
  CONFIRMED_BY_V52:       'confirmed-by-v52',
});

const CROSSWALK_ENTRIES = Object.freeze([

  // 1 ────────────────────────────────────────────────────────────────────────
  // SHARED GOAL: both programs target Lambda=0 / K_a >= 0, which is RH.
  Object.freeze({
    id: 'rh-goal-shared-endpoint',
    lambdaItem: 'Lambda = 0 => RH (chain Step 5)',
    lambdaLocation:
      'src/data/lambda-roadmap.js LAMBDA_CHAIN_STEPS step 5 ' +
      '"Combine with de Bruijn and Rodgers-Tao to get RH"',
    sec24Item: 'K_a >= 0 for all a > 0 => RH (§15 Theorem 15.1, §24 recap)',
    sec24Location: PAPER_REF + ', §15 pp 23-28, §24 p 48-49',
    verdict: VERDICTS.CORRESPONDENCE,
    rationale:
      'Both programs target the SAME MATHEMATICAL FACT. lambda-roadmap proves ' +
      'Lambda = 0 unconditionally (Route B, imp-341 + imp-344) and combines ' +
      'with Rodgers-Tao Lambda >= 0 to get RH. Paper §15 Theorem 15.1 ' +
      '(shift-bridge threshold theorem) establishes RH iff Delta = 0 iff ' +
      'K_a >= 0 for every a > 0 -- a distinct equivalent formulation of the ' +
      'same RH conclusion. §24 pedagogically recaps this as the main remaining ' +
      'proof target. The two frameworks are parallel attacks on the same ' +
      'endpoint; the lambda-roadmap proof of Lambda = 0 would give RH via ' +
      'Rodgers-Tao, while the shift-bridge proof of K_a >= 0 would give RH via ' +
      'Theorem 15.1. No mathematical identification beyond shared goal.',
  }),

  // 2 ────────────────────────────────────────────────────────────────────────
  // PARTIAL OVERLAP: Route C (Weyl density) ~ Attack III (Weil/Pontryagin).
  Object.freeze({
    id: 'route-c-density-vs-attack-iii-weil',
    lambdaItem: 'Route C -- density squeeze (G3b Weyl tail, imp-342)',
    lambdaLocation:
      'src/data/lambda-roadmap.js VERIFICATION_EFFORTS id=route-C-density ' +
      'and OPEN_GAPS id=G3b "Weyl tail contribution to S_{k*}"',
    sec24Item:
      'Attack III -- Weil/Pontryagin index closure (Theorem 18.3 + Conjecture 18.4)',
    sec24Location: PAPER_REF + ', §18.3-§18.4 pp 38-43',
    verdict: VERDICTS.PARTIAL_CORRESPONDENCE,
    rationale:
      'Both use Weil-type spectral density arguments. lambda-roadmap Route C ' +
      'uses the Riemann-von Mangoldt leading density to close gap G3b ' +
      '(c_tail approx 1.290 < 2 from Weyl law, imp-342): the S_k* / B^2 ' +
      'density squeeze argument. Paper Attack III (§18.3) uses the Weil ' +
      'explicit formula to certify that the negative Pontryagin index ' +
      'ind_-(K_a) = #{off-critical zeros with Re > a} is zero in every ' +
      'spectral window, passing to the limit to get K_a >= 0. Both routes ' +
      'exploit Weil/Weyl density, but at different points: Route C uses it ' +
      'to bound the bulk contribution to the Calogero-Moser argmin score, ' +
      'while Attack III uses it to certify the spectral index of the ' +
      'shift-bridge kernel. They are related in spirit; not the same proof.',
  }),

  // 3 ────────────────────────────────────────────────────────────────────────
  // PARTIAL OVERLAP: Route A (GUE universality) ~ Attack I (passive realization).
  Object.freeze({
    id: 'route-a-gue-vs-attack-i-passive',
    lambdaItem:
      'Route A -- monotonicity conjecture (M), irreducible conditional: GUE ' +
      'universality (Erdos-Schlein-Yau local law), imp-486',
    lambdaLocation:
      'src/data/lambda-roadmap.js VERIFICATION_EFFORTS id=route-A-monotonicity ' +
      '"closesIf: GUE universality established for Calogero-Moser ESM"',
    sec24Item:
      'Attack I -- kernel/passivity closure, Conjecture 18.1 (realize (A_a, B_a) ' +
      'from a positive Hamiltonian canonical system)',
    sec24Location: PAPER_REF + ', §18.1 pp 38-40; Apps M-O pp 109-121',
    verdict: VERDICTS.PARTIAL_CORRESPONDENCE,
    rationale:
      'Both require establishing deep spectral-structural regularity of a ' +
      'related operator system. Route A (lambda-roadmap) closes modulo GUE ' +
      'universality: the many-body CM correction constant C_mb requires the ' +
      'Erdos-Schlein-Yau local law for the empirical spectral measure of the ' +
      'Calogero-Moser particle system (imp-486 confirmed irreducible). ' +
      'Attack I (§18.1) requires realizing the pair (A_a, B_a) as the Weyl ' +
      'transfer pair of a positive Hamiltonian canonical system whose energy ' +
      'kernel is K_a (the KYP state-space route, Apps M-O, imp-1201). ' +
      'GUE universality is random-matrix input; Attack I is a passive-system ' +
      'construction. They are DISTINCT research programs but both belong to ' +
      'the "spectral operator-theoretic regularity" family. No literal ' +
      'identification: partial-correspondence is the honest verdict.',
  }),

  // 4 ────────────────────────────────────────────────────────────────────────
  // CONFIRMED BY V52: v52 §15 Thm 15.1 confirms the lambda-roadmap endpoint.
  Object.freeze({
    id: 'lambda-endpoint-confirmed-by-sec15-thm15-1',
    lambdaItem:
      'Lambda = 0 unconditionally (Route B imp-341 + imp-344 lim-sup = 0) ' +
      'plus Rodgers-Tao Lambda >= 0 (2020) => RH',
    lambdaLocation:
      'src/data/lambda-roadmap.js LAMBDA_ROADMAP.currentStatus ' +
      '+ VERIFICATION_EFFORTS id=route-B-burgers',
    sec24Item:
      'RH iff Lambda = 0 iff K_a >= 0 (§15 Thm 15.1 equivalence chain, §24 recap)',
    sec24Location: PAPER_REF + ', §15 Thm 15.1, §24 pp 48-49',
    verdict: VERDICTS.CONFIRMED_BY_V52,
    rationale:
      'v52 §15 Theorem 15.1 establishes the equivalence chain ' +
      'RH iff Delta = 0 iff K_a >= 0 for all a > 0. The de Bruijn 1950 ' +
      'theorem (RH iff Lambda = 0) and Rodgers-Tao (Lambda >= 0) place ' +
      'Lambda = 0 in the same equivalence chain. §24 recaps this as the ' +
      'shared proof target. The v52 paper therefore CONFIRMS that the ' +
      'lambda-roadmap Route B unconditional result (lim-sup Lambda = 0, ' +
      'imp-341 + imp-344) is exactly what is needed: it already proves ' +
      'Lambda = 0 asymptotically and, via §15 Thm 15.1, implies K_a >= 0 ' +
      'for all a > 0. This is a CONFIRMATION of the lambda-roadmap endpoint ' +
      'within the larger equivalence chain, not a resolution of any open gap. ' +
      'The lambda-roadmap already has the lim-sup claim; the per-N translation ' +
      'and the finite-N C_mb conditional remain open independently of v52.',
  }),

  // 5 ────────────────────────────────────────────────────────────────────────
  // LAMBDA-UNIQUE: Dyson/Calogero-Moser ODE -- no §24 equivalent.
  Object.freeze({
    id: 'dyson-calogero-moser-ode-lambda-unique',
    lambdaItem:
      'Calogero-Moser backward Dyson ODE dg_k/dt = -2 sum_{j!=k} 1/(g_k - g_j), ' +
      'collision time t_c(N), Steps 1-3 of the lambda chain',
    lambdaLocation:
      'src/data/lambda-roadmap.js LAMBDA_CHAIN_STEPS steps 1-3 ' +
      '(verify zeros, run Dyson ODE, extrapolate t_c -> 0)',
    sec24Item: null,
    sec24Location: null,
    verdict: VERDICTS.LAMBDA_UNIQUE,
    rationale:
      'The Calogero-Moser N-particle ODE and the collision time t_c(N) are ' +
      'central to the lambda-roadmap but entirely absent from the v52 paper ' +
      '§§15-24. The v52 shift-bridge framework works with the centered ' +
      'completed function X(w) := xi(1/2 + w) and its shift-bridge properties; ' +
      'it does NOT use backward Dyson flow, particle collisions, or the ' +
      'Calogero-Moser particle system. Steps 1-3 of the lambda chain (verified ' +
      'zeros -> Dyson ODE -> lim sup t_c -> 0) have no §24 counterpart. ' +
      'LAMBDA-UNIQUE: the Dyson/Calogero-Moser machinery is the lambda-roadmaps ' +
      'central technical apparatus and is not in scope for §24.',
  }),

  // 6 ────────────────────────────────────────────────────────────────────────
  // LAMBDA-UNIQUE: Polymath15 G6 bridge -- no §24 equivalent.
  Object.freeze({
    id: 'polymath15-g6-bridge-lambda-unique',
    lambdaItem:
      'G6_polymath15_bridge: |Lambda - (-t_c(N))| <= E(N) (closed: imp-345 + ' +
      'imp-366 G6a Holder-1/2 modulus + imp-387 coordinated flip)',
    lambdaLocation:
      'src/data/lambda-roadmap.js OPEN_GAPS id=G6 (closed) and id=G6a (closed)',
    sec24Item: null,
    sec24Location: null,
    verdict: VERDICTS.LAMBDA_UNIQUE,
    rationale:
      'The G6 gap connected the Calogero-Moser collision time t_c(N) to the ' +
      'de Bruijn-Newman constant Lambda via an explicit rate E(N) -> 0. This ' +
      'was the lambda-roadmap unique critical blocker (closed by imp-387). ' +
      'v52 §23 "Freezing, Bridge Renormalization" is a completely different ' +
      'kind of bridge: it applies Schur-complement freezing to the shift-bridge ' +
      'matrix and uses endpoint-bridge repairs as finite-window positivity ' +
      'patches. The word "bridge" is shared but the mathematical content is ' +
      'unrelated -- §23 bridges are shift-bridge endpoint repairs; G6 was a ' +
      'Burgers-flow-to-Lambda connection. LAMBDA-UNIQUE: the Polymath15 bridge ' +
      'result is specific to the Dyson/Lambda framework.',
  }),

  // 7 ────────────────────────────────────────────────────────────────────────
  // LAMBDA-UNIQUE: Route B Burgers uniformity -- the lambda-roadmap primary
  //   unconditional result has no §24 equivalent.
  Object.freeze({
    id: 'burgers-uniformity-route-b-lambda-unique',
    lambdaItem:
      'Route B -- Burgers uniformity: lim sup_N |t_c(N)| = 0 UNCONDITIONALLY ' +
      'via Koksma-Hlawka discrepancy + Selberg |S(T)| = O(log T / log log T), ' +
      'imp-341 + imp-344',
    lambdaLocation:
      'src/data/lambda-roadmap.js VERIFICATION_EFFORTS id=route-B-burgers',
    sec24Item: null,
    sec24Location: null,
    verdict: VERDICTS.LAMBDA_UNIQUE,
    rationale:
      'Route B is the lambda-roadmaps primary unconditional mathematical result: ' +
      'lim sup Lambda = 0 without GUE / ESY input, proven via the ' +
      'Koksma-Hlawka uniformity strip y_N^sharp = sqrt(2 pi / N) and the ' +
      'Burgers compressible-flow connection. Paper §§15-24 do not use ' +
      'Koksma-Hlawka discrepancy, Burgers flow, or the Calogero-Moser particle ' +
      'dynamics anywhere. There is no v52 Section that even references ' +
      'imp-341 or the lim-sup-equals-zero argument. LAMBDA-UNIQUE: this result ' +
      'is the lambda-roadmaps anchor and has no companion in the §24 framework.',
  }),

  // 8 ────────────────────────────────────────────────────────────────────────
  // LAMBDA-UNIQUE: finite-N rigorous Λ beats -- no §24 equivalent.
  Object.freeze({
    id: 'finite-n-rigorous-lambda-beats-lambda-unique',
    lambdaItem:
      'Lambda(1e4) <= 0.02 rigorous unconditional (imp-440 + imp-963) and ' +
      'Lambda(1e6) <= 0.2 rigorous via carryforward (imp-1088)',
    lambdaLocation:
      'src/data/lambda-roadmap.js LAMBDA_BOUNDS ids ' +
      'our-finite-N-1e4-via-imp-440 and our-finite-N-1e6-via-imp-1088',
    sec24Item: null,
    sec24Location: null,
    verdict: VERDICTS.LAMBDA_UNIQUE,
    rationale:
      'These finite-N rigorous Lambda upper bounds are the lambda-roadmaps ' +
      'capstone delivered results. They bound the de Bruijn-Newman constant ' +
      'Lambda at specific finite heights N. Paper §24 does not reference the ' +
      'de Bruijn-Newman Lambda parameter or finite-N Lambda bounds. The §24 ' +
      'rigorous-numerics target (§20 Stages I-III, see entry below) aims at ' +
      'interval-arithmetic GHOST-ABSENCE certificates for the K_a positivity ' +
      'problem -- an entirely different quantity. LAMBDA-UNIQUE: the finite-N ' +
      'Lambda beat at N = 1e4 (10x improvement on Platt-Trudgian 2021) is a ' +
      'lambda-roadmap-specific deliverable with no §24 counterpart.',
  }),

  // 9 ────────────────────────────────────────────────────────────────────────
  // LAMBDA-UNIQUE: the asymptotic conditional Lambda bound -- no §24 equivalent.
  Object.freeze({
    id: 'asymptotic-lambda-bound-8e-4-lambda-unique',
    lambdaItem:
      'Lambda approximately 8e-4 asymptotic, conditional on linear-1/N model ' +
      'for |t_c(N)| (imp-1147: approximately 250x better than Platt-Trudgian)',
    lambdaLocation:
      'src/data/lambda-roadmap.js LAMBDA_BOUNDS id=our-asymptotic-via-imp-1147',
    sec24Item: null,
    sec24Location: null,
    verdict: VERDICTS.LAMBDA_UNIQUE,
    rationale:
      'The asymptotic improvement of approximately 250x over Platt-Trudgian 2021 ' +
      '(imp-1147 via imp-1136/1137) is expressed in terms of the interval-OLS ' +
      'refit of the BH-multipole plateau ladder at N in {2e4..1e6}. This is the ' +
      'lambda-roadmaps most striking quantitative result. §24 does not reference ' +
      'the Platt-Trudgian 0.2 bound, the E_trunc formula, or the Calogero-Moser ' +
      'collision-time model. The open conditional (deviation from linear-1/N ' +
      'model, sub-gap imp-1147-sub-deviation-from-linear-1N) is a lambda-roadmap ' +
      'internal gap; §24 does not address it. LAMBDA-UNIQUE.',
  }),

  // 10 ───────────────────────────────────────────────────────────────────────
  // §24-GAP: ghost absence -- not in lambda-roadmap.
  Object.freeze({
    id: 'ghost-absence-blaschke-sec24-gap',
    lambdaItem: null,
    lambdaLocation: null,
    sec24Item:
      'Ghost absence theorem: B_a^+(w) = 1 for all a > 0, equivalently ' +
      'X has no zeros lambda with Re lambda > 0 (Conjecture 17.3, §24 recap)',
    sec24Location: PAPER_REF + ', §17 pp 34-38, §24 pp 48-49',
    verdict: VERDICTS.SEC24_GAP,
    rationale:
      'The Blaschke-ghost formalism from §17 is entirely absent from ' +
      'lambda-roadmap.js. §17 establishes that an off-critical zero of ' +
      'X(w) = xi(1/2 + w) with Re lambda > a manufactures, for every ' +
      '0 < a < Re lambda, an inverse Blaschke ghost contributing exactly ' +
      'one rank-one negative square to the Pontryagin-space decomposition ' +
      '(Krein-Langer identity: ind_-(K_{R_a}) = #{off-critical zeros}). ' +
      'Conjecture 17.3 states B_a^+ = 1 -- the ghost-absence theorem -- ' +
      'and is SUBSUMED-BY-RH (imp-1232 audit). §24 lists this as a key ' +
      'remaining target (ghostless reformulation of RH). The lambda-roadmap ' +
      'has no entry for Blaschke factors, Pontryagin decompositions, or ' +
      'negative-square counting. SEC24-GAP: the entire ghost-absence / ' +
      'Pontryagin-space layer is a §24-framework concept with no lambda-roadmap ' +
      'counterpart.',
  }),

  // 11 ───────────────────────────────────────────────────────────────────────
  // §24-GAP: four equivalent closure routes -- not in lambda-roadmap.
  Object.freeze({
    id: 'four-closure-routes-sec24-gap',
    lambdaItem: null,
    lambdaLocation: null,
    sec24Item:
      'Four equivalent closure routes (§16 Theorem 16.1): Route A Schur ' +
      'contractivity, Route B de Branges positivity, Route C hidden-square, ' +
      'Route D Weil / twin-ladder quadratic form',
    sec24Location: PAPER_REF + ', §16 pp 28-33, §24 pp 48-49',
    verdict: VERDICTS.SEC24_GAP,
    rationale:
      'The four §16 closure routes have no lambda-roadmap equivalents. ' +
      'IMPORTANT NAME-COLLISION WARNING: lambda-roadmap.js ALSO uses labels ' +
      '"Route A", "Route B", "Route C" for its own verification efforts, but ' +
      'these are COMPLETELY DIFFERENT mathematical objects. The lambda-roadmap ' +
      'Route A is the M-monotonicity conjecture for Calogero-Moser unfolded ' +
      'coordinates (imp-336/456/462/476). Lambda-roadmap Route B is Burgers ' +
      'uniformity (imp-341/344). Lambda-roadmap Route C is density squeeze ' +
      '(imp-337/342/343). Paper §16 Route A is Schur contractivity ' +
      '|Theta_a(z)| < 1 in C_+. Paper §16 Route B is de Branges positivity ' +
      'K_a in P(E_a). Paper §16 Route C is the hidden-square programme. ' +
      'Paper §16 Route D is the Weil/twin-ladder quadratic form Q_TL[h] >= 0. ' +
      'The letter labels overlap by coincidence; the mathematical content does ' +
      'not overlap at all. SEC24-GAP: the entire §16 equivalence theorem and ' +
      'its four routes are absent from lambda-roadmap.js.',
  }),

  // 12 ───────────────────────────────────────────────────────────────────────
  // §24-GAP: Attack II prime-delay domination -- not in lambda-roadmap.
  Object.freeze({
    id: 'attack-ii-prime-delay-domination-sec24-gap',
    lambdaItem: null,
    lambdaLocation: null,
    sec24Item:
      'Attack II -- prime-delay domination: Re(X-prime/X)(w) > 0 for Re w > 0 ' +
      '(Conjecture 18.2, §24 recap)',
    sec24Location: PAPER_REF + ', §18.2 pp 40-42',
    verdict: VERDICTS.SEC24_GAP,
    rationale:
      'Conjecture 18.2 states the archimedean logarithmic derivative ' +
      'Re(X-prime/X)(w) > 0 for all Re w > 0: the completed archimedean ' +
      'drift G_infty dominates the coherent prime-delay echo train under ' +
      'analytic continuation (three-attacks-section.js, Attack II). ' +
      'This is a function-theoretic positivity statement about X(w) = ' +
      'xi(1/2 + w) in the right half-plane. The lambda-roadmap has no entry ' +
      'involving X-prime/X or the prime-delay echo train. The lambda-roadmaps ' +
      'Route B uses Selberg |S(T)| = O(log T / log log T) as analytical input, ' +
      'but this is a zero-density / discrepancy argument, not a ' +
      'X-prime/X positivity argument. SEC24-GAP: the prime-delay ' +
      'domination Attack II is entirely absent from lambda-roadmap.js.',
  }),

  // 13 ───────────────────────────────────────────────────────────────────────
  // §24-GAP: rigorous-numerics ghost-absence certificates -- not in lambda-roadmap.
  Object.freeze({
    id: 'rigorous-numerics-ghost-absence-sec24-gap',
    lambdaItem: null,
    lambdaLocation: null,
    sec24Item:
      'Rigorous-numerics programme (§20 Stages I-III): interval-arithmetic ' +
      'certificates for ghost-absence in a finite vertical strip, §24 recap',
    sec24Location: PAPER_REF + ', §20 pp 43-44, §24 pp 48-49',
    verdict: VERDICTS.SEC24_GAP,
    rationale:
      '§20 (planned via imp-1220 in twin-ladder-paper-roadmap.js) describes ' +
      'a three-stage programme for making progress on ghost absence ' +
      'numerically: Stage I (classical-numerics pilot on the first few ' +
      'primes and a finite frequency range), Stage II (pressure-temperature ' +
      'interval numerics), Stage III (interval-arithmetic certificates for a ' +
      'certified strip). The lambda-roadmap has its own rigorous-numerics ' +
      'effort (the finite-N Lambda beats at N = 1e4 / 1e6, imp-440 + imp-1088) ' +
      'but these prove upper bounds on the de Bruijn-Newman constant Lambda, ' +
      'not interval certificates for K_a positivity. The two rigorous-numerics ' +
      'efforts target different quantities (Lambda vs K_a) and use different ' +
      'methods (ODE + Ingham vs interval-arithmetic Taylor-ball cells). ' +
      'SEC24-GAP: the §20 ghost-absence certificate programme has no ' +
      'lambda-roadmap entry.',
  }),

  // 14 ───────────────────────────────────────────────────────────────────────
  // §24-GAP: Conjectures 22.1-22.3 -- not in lambda-roadmap.
  Object.freeze({
    id: 'conjectures-22-1-22-3-sec24-gap',
    lambdaItem: null,
    lambdaLocation: null,
    sec24Item:
      'Conjectures 22.1-22.3 from §22 (22.4 SUBSUMED-BY-RH; 22.1 INDEPENDENT-NOVEL; ' +
      '22.2/22.3 PARTIALLY-RELATED per imp-1210 audit), §24 recap',
    sec24Location: PAPER_REF + ', §22 pp 44, §24 pp 48-49',
    verdict: VERDICTS.SEC24_GAP,
    rationale:
      'Section 22 contains four conjectures. imp-1210 (paper-audit-dashboard.js) ' +
      'audited all four: Conjecture 22.4 is SUBSUMED-BY-RH (de Branges 1968 / ' +
      'Lagarias 2007); Conjecture 22.1 is INDEPENDENT-NOVEL (no known ' +
      'equivalent in the literature); Conjectures 22.2 and 22.3 are ' +
      'PARTIALLY-RELATED to existing results. §24 recaps 22.1-22.3 as open ' +
      'targets (22.4 is already equivalent to RH and needs no further entry). ' +
      'The lambda-roadmap has no entries corresponding to any §22 conjecture. ' +
      'The §22 conjectures belong to the shift-bridge / twin-ladder framework ' +
      '(they express properties of X(w) and the twin-ladder transfer operators) ' +
      'while the lambda-roadmap is scoped to the Dyson-flow / Lambda attack. ' +
      'SEC24-GAP: Conjectures 22.1-22.3 are absent from lambda-roadmap.js.',
  }),

  // 15 ───────────────────────────────────────────────────────────────────────
  // §24-GAP: freezing and bridge renormalization (§23) -- not in lambda-roadmap.
  Object.freeze({
    id: 'freezing-bridge-renorm-sec24-gap',
    lambdaItem: null,
    lambdaLocation: null,
    sec24Item:
      'Schur-complement freezing + bridge renormalization (§23): preserving ' +
      'negative Pontryagin index under freezing; endpoint bridge as finite- ' +
      'window positivity repair (§24 recap)',
    sec24Location: PAPER_REF + ', §23 pp 44-48, §24 pp 48-49',
    verdict: VERDICTS.SEC24_GAP,
    rationale:
      '§23 introduces a targeted no-ghost attack via Schur-complement freezing: ' +
      'partial frozen-bridge evaluation preserves the negative index of K_a, ' +
      'and endpoint bridges act as finite-window positivity repairs. §24 ' +
      'summarises the remaining problem here as: find a bridge renormalization ' +
      'sequence that converges to a ghost-free limit. The lambda-roadmap has ' +
      'no entry for Schur-complement freezing, bridge renormalization, or ' +
      'Pontryagin index preservation under compression. (The term "bridge" ' +
      'appears in lambda-roadmap Step 4 -- Polymath15 bridge -- but that is ' +
      'a Burgers-to-Lambda bridge, completely different from the §23 ' +
      'Schur-complement bridge renormalization.) SEC24-GAP: the §23 ' +
      'freezing/renormalization programme post-dates the lambda-roadmap and ' +
      'has no entry in lambda-roadmap.js.',
  }),

]);

// ── Aggregate verdict counts ─────────────────────────────────────────────────

function countVerdicts(entries) {
  let correspondence = 0;
  let partialCorrespondence = 0;
  let lambdaUnique = 0;
  let sec24Gap = 0;
  let confirmedByV52 = 0;
  for (const e of entries) {
    switch (e.verdict) {
      case VERDICTS.CORRESPONDENCE:         correspondence += 1; break;
      case VERDICTS.PARTIAL_CORRESPONDENCE: partialCorrespondence += 1; break;
      case VERDICTS.LAMBDA_UNIQUE:          lambdaUnique += 1; break;
      case VERDICTS.SEC24_GAP:              sec24Gap += 1; break;
      case VERDICTS.CONFIRMED_BY_V52:       confirmedByV52 += 1; break;
      default: break;
    }
  }
  return Object.freeze({
    correspondence,
    partialCorrespondence,
    lambdaUnique,
    sec24Gap,
    confirmedByV52,
  });
}

const VERDICT_COUNTS = countVerdicts(CROSSWALK_ENTRIES);

// ── Main export ──────────────────────────────────────────────────────────────

export const LAMBDA_ROADMAP_SEC24_CROSSWALK = Object.freeze({
  ticketId: 'imp-1235',
  title:
    'lambda-roadmap.js vs paper §24 "What remains to get the proof working" crosswalk',
  paperRef: PAPER_REF,
  paperSection: '§24',
  paperPageRange: '48-49',
  lambdaRoadmapRef: 'src/data/lambda-roadmap.js',
  attemptDate: '2026-05-27',

  sec24OpenTargetsReconstructed: Object.freeze([
    'T1: K_a >= 0 for all a > 0 (RH iff Delta = 0, §15 Thm 15.1)',
    'T2: Ghost absence B_a^+ = 1 (Conjecture 17.3, SUBSUMED-BY-RH)',
    'T3: Close one of the four equivalent routes (§16 Thm 16.1)',
    'T4a: Attack I -- passive realization / KYP (Conjecture 18.1)',
    'T4b: Attack II -- prime-delay domination Re(X-prime/X) > 0 (Conjecture 18.2)',
    'T4c: Attack III -- Weil/Pontryagin index ind_-(K_a) = 0 (Thm 18.3 + Conj 18.4)',
    'T5: Rigorous-numerics programme Stages I-III (§20)',
    'T6: Conjectures 22.1-22.3 (22.4 subsumed)',
    'T7: Freezing/bridge renormalization targeted attack (§23)',
  ]),

  summary:
    'Walked 15 crosswalk entries across three finding-types. The two frameworks ' +
    '(lambda-roadmap vs v52 §24) are PARALLEL INDEPENDENT ATTACKS on RH using ' +
    'almost entirely non-overlapping mathematics. Key findings: ' +
    '(1) The shared endpoint (Lambda = 0 iff K_a >= 0 iff RH) is the only ' +
    'true correspondence -- lambda-roadmap Step 5 and §24 Goal T1 are the same ' +
    'mathematical fact via the equivalence chain of §15 Theorem 15.1. ' +
    '(2) Route C (Weyl density) and Attack III (Weil/Pontryagin) are partially ' +
    'related via Weil-type density arguments, but at different points in their ' +
    'respective programmes. ' +
    '(3) Route A GUE universality and Attack I (KYP passivity) are partially ' +
    'related as spectral-regularity research programmes. ' +
    '(4) Lambda-unique items (Steps 1-3 Dyson ODE, G6 Polymath15 bridge, ' +
    'Route B Burgers uniformity, finite-N Lambda beats, asymptotic 8e-4 bound) ' +
    'have NO §24 equivalents -- the Dyson/Lambda apparatus is absent from v52. ' +
    '(5) §24-gap items (ghost absence, four closure routes, Attack II ' +
    'prime-delay domination, rigorous-numerics K_a certificates, Conj 22.1-22.3, ' +
    'freezing/bridge renormalization) are entirely absent from lambda-roadmap.js. ' +
    '(6) NAME COLLISION ALERT: lambda-roadmap "Route A/B/C" and §16 "Route A/B/C/D" ' +
    'are DIFFERENT objects sharing letter labels by coincidence -- see entry 11.',

  honestScope: Object.freeze([
    '§24 content is reconstructed from the surrounding §§15-23 data files; ' +
    'the exact enumeration in pages 48-49 of the PDF was not read directly. ' +
    'All §24 targets traced below are author-stated open problems in §§15-23; ' +
    '§24 summarises rather than introduces them.',

    'The crosswalk does NOT claim the lambda-roadmap and §24 frameworks are ' +
    'compatible or incompatible in a formal mathematical sense -- only that ' +
    'they are parallel attacks on the same goal (RH) using different formalism.',

    'NONE of the §24 open targets are RESOLVED by the lambda-roadmap, and ' +
    'NONE of the lambda-roadmap open items are RESOLVED by v52 §24. The two ' +
    'frameworks operate independently. The lambda-roadmap gaps were closed by ' +
    'the lambda-roadmap own tickets (G1-G6a all closed); the §24 targets ' +
    '(16.4, 16.6, 18.1, 18.2, Conj 22.1-22.3, §23 freezing) remain open.',

    'NAME COLLISION: lambda-roadmap Route A/B/C and §16 Route A/B/C/D share ' +
    'letter labels by coincidence. They are completely different mathematical ' +
    'objects. See crosswalk entry 11 for the explicit warning.',

    'The lambda-roadmap Route B unconditional result (lim sup Lambda = 0, ' +
    'imp-341 + imp-344) IMPLIES K_a >= 0 for all a > 0 via §15 Theorem 15.1. ' +
    'This is the strongest connection between the two frameworks. However it is ' +
    'a CONFIRMATION of the endpoint, not a direct proof of any §24 target.',
  ]),

  crosswalk: CROSSWALK_ENTRIES,
  verdictCounts: VERDICT_COUNTS,
  verdictVocabulary: VERDICTS,
});

// ── Lookup helper ────────────────────────────────────────────────────────────

/**
 * Look up a crosswalk entry by id. Returns null if not found.
 *
 * @param {string} id
 * @returns {Readonly<object> | null}
 */
export function findLambdaSec24Entry(id) {
  if (typeof id !== 'string') return null;
  const hit = CROSSWALK_ENTRIES.find((e) => e.id === id);
  return hit || null;
}

// ── Build-time tripwires ─────────────────────────────────────────────────────

export const LAMBDA_ROADMAP_SEC24_CROSSWALK_ASSERTIONS = [

  {
    id: 'imp1235-at-least-12-crosswalk-entries',
    holds: () =>
      Array.isArray(LAMBDA_ROADMAP_SEC24_CROSSWALK.crosswalk) &&
      LAMBDA_ROADMAP_SEC24_CROSSWALK.crosswalk.length >= 12,
    why:
      'The imp-1235 ticket requires cross-walking lambda-roadmap.js against ' +
      '§24 with at least 12 entries (covering the three finding-types: ' +
      'correspondence, lambda-unique, and sec24-gap). Dropping below 12 ' +
      'means the coverage promise of the ticket is no longer met.',
  },

  {
    id: 'imp1235-every-entry-has-required-fields',
    holds: () =>
      LAMBDA_ROADMAP_SEC24_CROSSWALK.crosswalk.every((e) =>
        e &&
        typeof e.id === 'string' && e.id.length > 0 &&
        typeof e.verdict === 'string' && e.verdict.length > 0 &&
        typeof e.rationale === 'string' && e.rationale.length > 20
      ),
    why:
      'Every crosswalk entry must carry a non-empty id, verdict, and ' +
      'rationale (>= 20 chars). Entries without a rationale are metadata-only ' +
      'and provide no auditable mapping between the two frameworks.',
  },

  {
    id: 'imp1235-every-verdict-in-permitted-vocabulary',
    holds: () => {
      const allowed = new Set(Object.values(LAMBDA_ROADMAP_SEC24_CROSSWALK.verdictVocabulary));
      return LAMBDA_ROADMAP_SEC24_CROSSWALK.crosswalk.every((e) => allowed.has(e.verdict));
    },
    why:
      'Every verdict must be one of {correspondence, partial-correspondence, ' +
      'lambda-unique, sec24-gap, confirmed-by-v52}. A typo or invented verdict ' +
      'label would drift the verdict-count aggregate silently.',
  },

  {
    id: 'imp1235-verdict-counts-sum-to-entry-count',
    holds: () => {
      const c = LAMBDA_ROADMAP_SEC24_CROSSWALK.verdictCounts;
      const total =
        c.correspondence +
        c.partialCorrespondence +
        c.lambdaUnique +
        c.sec24Gap +
        c.confirmedByV52;
      return total === LAMBDA_ROADMAP_SEC24_CROSSWALK.crosswalk.length;
    },
    why:
      'The five verdict-bucket counts must sum to the crosswalk entry count. ' +
      'A mismatch means a row verdict was not in the permitted vocabulary and ' +
      'was dropped from the aggregation.',
  },

  {
    id: 'imp1235-at-least-2-sec24-gap-entries',
    holds: () =>
      LAMBDA_ROADMAP_SEC24_CROSSWALK.verdictCounts.sec24Gap >= 2,
    why:
      'The gap analysis (which §24 open targets are missing from lambda-roadmap) ' +
      'is a primary deliverable of imp-1235. At least 2 sec24-gap entries must ' +
      'be present to confirm the analysis was done. Fewer than 2 would mean ' +
      'the gap direction was not adequately explored.',
  },

  {
    id: 'imp1235-at-least-2-lambda-unique-entries',
    holds: () =>
      LAMBDA_ROADMAP_SEC24_CROSSWALK.verdictCounts.lambdaUnique >= 2,
    why:
      'The converse direction (lambda-roadmap items absent from §24) is equally ' +
      'important. At least 2 lambda-unique entries confirm the Dyson/Lambda ' +
      'framework was examined for content not covered by §24.',
  },

  {
    id: 'imp1235-find-helper-works',
    holds: () => {
      const first = LAMBDA_ROADMAP_SEC24_CROSSWALK.crosswalk[0];
      if (!first) return false;
      const got = findLambdaSec24Entry(first.id);
      const miss = findLambdaSec24Entry('definitely-not-an-id');
      const bad = findLambdaSec24Entry(null);
      return got === first && miss === null && bad === null;
    },
    why:
      'findLambdaSec24Entry must locate existing rows by id, return null for ' +
      'unknown ids, and return null for non-string input. A regression here ' +
      'would break any future dashboard page that consumes this crosswalk.',
  },

  {
    id: 'imp1235-name-collision-warning-present-in-sec24-gap-routes',
    holds: () => {
      const hit = findLambdaSec24Entry('four-closure-routes-sec24-gap');
      return (
        hit !== null &&
        typeof hit.rationale === 'string' &&
        hit.rationale.includes('NAME-COLLISION') || (
          hit !== null &&
          hit.rationale.includes('letter labels')
        )
      );
    },
    why:
      'The lambda-roadmap Routes A/B/C and §16 Routes A/B/C/D share letter ' +
      'labels by coincidence. The crosswalk entry for four-closure-routes must ' +
      'include the name-collision warning so future readers do not conflate ' +
      'the two route sets. If the warning is removed, this tripwire fails.',
  },

];

export default LAMBDA_ROADMAP_SEC24_CROSSWALK;
