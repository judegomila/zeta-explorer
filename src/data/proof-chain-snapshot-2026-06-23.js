/**
 * @fileoverview Honest proof-chain snapshot as of 2026-06-23.
 *
 * Replaces the stale 2026-04-12 snapshot. Key corrections since April 2026:
 *
 *  - Lambda <= 0.121 claim (imp-2622 / imp-2630) WITHDRAWN.
 *    Frozen-kappa height-mismatch artifact: kappa_T = 0.182 is only valid at
 *    T0=3000; it degrades with height, so the thin-strip route never beats
 *    Platt-Trudgian 0.2.
 *
 *  - C_H (Holder-1/2 shock modulus) is RH-hard / undischargeable (imp-2640).
 *    The Gronwall integral diverges at the collision scale; every route that
 *    would deliver an actual Lambda number below 0.2 is gated on C_H.
 *
 *  - No live claim beats Platt-Trudgian Lambda <= 0.2.
 *    RIGOROUS SOTA remains: Platt-Trudgian (2021) Lambda <= 0.2.
 *    Session estimate: Lambda ~= 0.013 at N*=1e4 is a NUMERICAL ESTIMATE,
 *    not a proof (gated on the undischargeable C_H).
 *
 *  - Full route map (full-route-map-2026-06-19.js) classifies 38 routes.
 *    Only routes with status RIGOROUS-SOTA / CONDITIONAL survive as active
 *    chains; everything else is DEAD-END / RH-EQUIVALENT / REFUTED.
 *
 * EXPORTS (same interface as proof-chain-snapshot-2026-04-12.js):
 *   HEADLINE, PROOF_CHAIN, ROUTE_STATUS, CONDITIONS
 *
 * @module data/proof-chain-snapshot-2026-06-23
 * @see ./full-route-map-2026-06-19.js
 */

// ── 1. HEADLINE CLAIM (updated June 2026) ────────────────────────────────────

export const HEADLINE = {
  bound: 'Lambda <= 0.2 (Platt-Trudgian 2021) — RIGOROUS SOTA',
  baseline: 'Platt-Trudgian 2021 Lambda <= 0.2',
  improvement: 'Session estimate Lambda ~= 0.013 (N*=1e4) — ESTIMATE ONLY, not a proof',
  scale: 'N* = 1e4 Riemann zeros (self-consistent numerical estimate)',
  condition: 'Lambda ~= 0.013 is GATED on C_H (undischargeable, imp-2640 NEGATIVE). No improvement over 0.2 is rigorous.',
  rigorLevel: 'RIGOROUS SOTA: Lambda in [0, 0.2] (Rodgers-Tao lower, Platt-Trudgian upper). Session estimate is NUMERICAL-ESTIMATE only.',
  routeUsed: 'Route B (imp-341 unconditional lim-sup) is the rigorous crown jewel. Route A finite-N* estimate is GATED on C_H. Thin-strip Route (imp-2622) REFUTED (imp-2630).',
  sessionFindings: 'June 2026 session: 4 overclaims caught + withdrawn; C_H wall identified as RH-hard; Volterra ||V||<=1 is RH-EQUIVALENT (not a shortcut); 38 routes classified in full-route-map-2026-06-19.',
  snapshotDate: '2026-06-23',
  previousSnapshotDate: '2026-04-12',
  previousBoundWithdrawn: 'Lambda <= 0.121 — WITHDRAWN (frozen-kappa height-mismatch, imp-2630)',
};

// ── 2. PROOF CHAIN (honest June 2026 state) ──────────────────────────────────

export const PROOF_CHAIN = [
  {
    step: 1,
    ticket: 'imp-341',
    claim:
      'lim sup_{N to inf} |t_c(N)| = 0 UNCONDITIONALLY via deterministic ' +
      'Koksma-Hlawka discrepancy on the empirical Stieltjes transform. ' +
      'Sole analytical input: Selberg |S(T)| = O(log T / log log T). ' +
      'No GUE / local-law / Erdos-Schlein-Yau input required. ' +
      'This is the rigorous crown jewel (Route B) — about the PARTICLE FLOW, not directly Lambda.',
    status: 'CLOSED unconditionally',
  },
  {
    step: 2,
    ticket: 'imp-2563 / heat-discriminant',
    claim:
      'Heat-discriminant exact t_c bounds: rigorous non-dynamical instrument. ' +
      'Provides t_c control as input to E(N) bounding. ' +
      'Classified RIGOROUS-SOTA in full-route-map-2026-06-19 (opp=7).',
    status: 'CLOSED unconditionally',
  },
  {
    step: 3,
    ticket: 'imp-2563 / theta-trap',
    claim:
      'Theta-trap theorems: rigorous CM-flow algebra instrument. ' +
      'Provides |t_c_proj| bounds (A1 lemma: |t_c| <= 2.37e-4) that make C_G non-binding. ' +
      'Classified RIGOROUS-SOTA in full-route-map-2026-06-19 (opp=8).',
    status: 'CLOSED unconditionally',
  },
  {
    step: 4,
    ticket: 'imp-2640',
    claim:
      'C_H (Holder-1/2 shock modulus) discharge: attempt to bound the ' +
      'collision-scale Lipschitz constant from below. ' +
      'NEGATIVE VERDICT: Gronwall integral for backward-flow amplification C_G ' +
      'diverges at the collision scale. C_H is RH-hard at the modulus. ' +
      'Every route to an actual Lambda number below 0.2 is gated on C_H.',
    status: 'OPEN — C_H is RH-hard / undischargeable (imp-2640 NEGATIVE)',
  },
  {
    step: 5,
    ticket: 'imp-2630',
    claim:
      'Thin-strip / kappa_T route (imp-2622): claimed Lambda in [0.099, 0.137] ' +
      'at height gamma = 1e13. WITHDRAWN: kappa_T frozen at T0=3000 (0.182) was ' +
      'multiplied against T0=1e13; height-consistent kappa_T=0.046 gives ' +
      'E_trunc=7.65 >> 0.2; thin-strip route grows with height, never drops below 0.2.',
    status: 'REFUTED — Lambda <= 0.121 headline retracted (imp-2630)',
  },
  {
    step: 6,
    ticket: 'Platt-Trudgian 2021',
    claim:
      'Lambda <= 0.2: unconditional, rigorous, current SOTA upper bound. ' +
      'Session could not improve on this with a rigorous proof. ' +
      'The self-consistent numerical estimate Lambda ~= 0.013 at N*=1e4 ' +
      'is a heuristic target, not a proof, due to the C_H wall.',
    status: 'ESTABLISHED unconditionally (external SOTA — Platt-Trudgian 2021)',
  },
  {
    step: 7,
    ticket: 'Rodgers-Tao 2020',
    claim:
      'Lambda >= 0: unconditional lower bound. ' +
      'Together with Platt-Trudgian, rigorous interval is Lambda in [0, 0.2]. ' +
      'The session supports conjecturing Lambda = 0 (i.e. RH) but cannot prove it.',
    status: 'ESTABLISHED unconditionally (external — Rodgers-Tao 2020)',
  },
  {
    step: 8,
    ticket: 'imp-2672',
    claim:
      'C_H / G6a Holder-1/2 shock modulus: the single remaining lever. ' +
      'Can Theta-trap + discriminant ladder replace the divergent Gronwall integral? ' +
      'This is the TOP OPPORTUNITY — the one open thread that could, in principle, ' +
      'deliver a rigorous Lambda number below 0.2. No resolution yet.',
    status: 'OPEN — active frontier (imp-2672, TOP OPPORTUNITY)',
  },
];

// ── 3. ROUTE STATUS (from full-route-map-2026-06-19) ─────────────────────────

export const ROUTE_STATUS = {
  routeB: {
    name: 'Route B — Burgers lim-sup t_c (imp-341)',
    status: 'RIGOROUS-SOTA',
    summary: 'Unconditional lim sup |t_c(N)| = 0 via Koksma-Hlawka. Rigorous crown jewel. About the PARTICLE FLOW, not directly Lambda.',
    closesIf: 'Already closed unconditionally. Feeds E(N) chain if C_H can be discharged.',
    imp2833: 'Closure verified and locked by build-time tripwires (IMP_2833_ROUTEB_CLOSURE_ASSERTIONS): Route B stays RIGOROUS-SOTA, and the E(N) onward feed stays gated on C_H (OPEN). No false Lambda improvement claimed.',
  },
  routeA: {
    name: 'Route A — Finite-N* = 1e4 estimate',
    status: 'ESTIMATE',
    summary: 'Self-consistent numerical estimate Lambda ~= 0.013 at N*=1e4. Gated on C_H (undischargeable). Heuristic target only.',
    closesIf: 'C_H Holder-1/2 shock modulus bounded unconditionally (imp-2672, currently RH-hard).',
    imp2834: 'HONEST NEGATIVE: the named closure action (bound C_H Holder-1/2 shock modulus UNCONDITIONALLY) is NOT executable. C_H is RH-hard / undischargeable — the Gronwall backward-flow amplification diverges at the collision scale (imp-2640 returned NEGATIVE). Route A therefore stays an ESTIMATE gated on C_H; no rigorous Lambda below the Platt-Trudgian 0.2 SOTA is claimed. Locked against drift by IMP_2834_ROUTEA_GATE_ASSERTIONS.',
  },
  thinStrip: {
    name: 'Route Thin-strip / kappa_T (imp-2622)',
    status: 'REFUTED',
    summary: 'Claimed Lambda in [0.099, 0.137] at height 1e13. WITHDRAWN. Frozen-kappa height mismatch artifact (imp-2630).',
    closesIf: 'N/A — structurally dead. Thin-strip route grows with height.',
    imp2835: 'HONEST NEGATIVE: the closesIf names NO executable action — the route is structurally dead. The withdrawn Lambda in [0.099, 0.137] used kappa_T = 0.182 frozen at T0=3000; the height-consistent kappa_T = 0.046 at gamma = 1e13 recomposes to E_trunc ~= 7.65 >> 0.2, and E_trunc grows with height, so the thin-strip route can never drop below the Platt-Trudgian 0.2 SOTA (imp-2630). Route stays REFUTED; no Lambda claim is made. Locked against revival by IMP_2835_THINSTRIP_REFUTED_ASSERTIONS.',
  },
  volterra: {
    name: 'Volterra ||V||<=1 collapse (imp-1258)',
    status: 'RH-EQUIVALENT',
    summary: 'A faithful reformulation of RH, not a shortcut. 5000x empirical margin was a homogeneity artifact (Wiener-Hopf 1/a bound retracted, imp-2660).',
    closesIf: 'Only if RH is proved; this is RH-EQUIVALENT, not a route to Lambda.',
    imp2836: 'Honest negative recorded and locked by build-time tripwires (IMP_2836_VOLTERRA_RH_EQUIVALENT_ASSERTIONS): the Volterra ||V||<=1 collapse stays RH-EQUIVALENT (a faithful reformulation of RH, not a shortcut), the retracted 5000x margin stays retracted, and it must NEVER move the Platt-Trudgian Lambda<=0.2 headline. No route-to-Lambda is claimed.',
  },
  thetaTrap: {
    name: 'Theta-trap / Min-gap sandwich (imp-2563)',
    status: 'CONDITIONAL',
    summary: 'Rigorous but NEGATIVE for the headline (sign algebra). Provides t_c bounds useful for E(N) machinery. Min-gap sandwich has an unproven field bound beta.',
    closesIf: 'Field bound beta proved (imp-2683) would close the two-sided t_c bracket.',
    imp2837: 'HONEST PARTIAL (imp-2683): the closesIf action — prove field bound beta — was executed only at the INITIAL INSTANT. beta_0 g^2 < 2 now holds RIGOROUSLY and N-uniformly at s=0 (B_p is a sum of POSITIVE terms; telescope B_p G^2 <= 2(1 - 1/(K+1)) < 2; the gate margin GROWS up the verified-zero ladder, 1.9997 at N*=1e4). But the sup over 0<=s<t_c with the FIXED initial g stays CONDITIONAL on a named punctured-min-gap residual (h(s) >= c*g uniformly), so the two-sided t_c bracket is NOT closed unconditionally. thetaTrap stays CONDITIONAL; no rigorous Lambda improvement is claimed. Locked by IMP_2837_THETATRAP_BRACKET_CONDITIONAL_ASSERTIONS.',
  },
  esy: {
    name: 'ESY / Selberg-trace PCC closure',
    status: 'DEAD-END',
    summary: 'Montgomery PCC 50-year wall. All sub-routes terminate here.',
    closesIf: 'Would require a genuine breakthrough on the Montgomery PCC conjecture.',
    imp2838: 'HONEST NEGATIVE: the closesIf names NO executable action — it names the Montgomery pair-correlation conjecture (PCC), a 50-year open wall, as the closure condition. Proving PCC is a structural breakthrough that lies entirely outside this project, not a step that can be executed here. The route stays DEAD-END; PCC stays in CONDITIONS.open as the critical structural blocker for all ESY/Selberg-trace/PCC-adjacent routes. No Lambda claim is made and the rigorous headline stays at the Platt-Trudgian Lambda <= 0.2 SOTA. Locked against a false revival by IMP_2838_ESY_PCC_DEADEND_ASSERTIONS.',
  },
};

// ── 4. CONDITIONS ─────────────────────────────────────────────────────────────

export const CONDITIONS = {
  established: [
    {
      id: 'C_RT',
      description: 'Rodgers-Tao (2020): Lambda >= 0 unconditionally.',
      ticket: 'external',
    },
    {
      id: 'C_PT',
      description: 'Platt-Trudgian (2021): Lambda <= 0.2 unconditionally. CURRENT RIGOROUS SOTA.',
      ticket: 'external',
    },
    {
      id: 'C_B',
      description: 'Route B lim-sup t_c = 0: Burgers/Koksma-Hlawka, unconditional (imp-341).',
      ticket: 'imp-341',
    },
    {
      id: 'C_TT',
      description: 'Theta-trap CM-flow algebra: rigorous instrument for t_c bounds (imp-2563).',
      ticket: 'imp-2563',
    },
  ],
  establishedConditional: [
    {
      id: 'C_G6a',
      description: 'E(N) bound conditional on C_H (Holder-1/2 shock modulus, G6a). If C_H can be discharged, yields Lambda ~= 0.013 estimate.',
      condition: 'C_H dischargeable (currently RH-hard per imp-2640)',
      ticket: 'imp-2672',
    },
    {
      id: 'C_beta',
      description: 'Min-gap sandwich two-sided t_c bracket conditional on field bound beta (imp-2683).',
      condition: 'Field bound beta < 2/g^2 at collision (unproven)',
      ticket: 'imp-2683',
    },
  ],
  open: [
    {
      id: 'C_H',
      description: 'C_H (Holder-1/2 shock modulus): the undischargeable bottleneck. Gronwall backward-flow amplification diverges at the collision scale. imp-2640 returned NEGATIVE. This is THE critical blocker for any improvement over Lambda <= 0.2.',
      wouldClose: 'Route A estimate + every route that would deliver Lambda < 0.2.',
      ticket: 'imp-2640 / imp-2672',
    },
    {
      id: 'PCC',
      description: 'Montgomery pair-correlation conjecture: 50-year open wall. Blocks all ESY/Selberg-trace/PCC-adjacent routes.',
      wouldClose: 'ESY, Selberg-trace, and multiple direct-RH routes.',
      ticket: 'structural',
    },
  ],
};

// ── 5. imp-2833 BUILD-TIME ASSERTIONS ────────────────────────────────────────
//
// closesIf for Route B reads: "Already closed unconditionally. Feeds E(N)
// chain if C_H can be discharged." The named closure condition is therefore
// self-satisfied (Route B is the rigorous crown jewel), and the ONLY honest
// action is to lock that status against drift while guarding against a false
// promotion: Route B closing must NOT be read as closing the Lambda chain,
// because the onward E(N) feed stays gated on C_H, which remains OPEN.
// These tripwires assert the snapshot stays internally consistent on that
// exact point. No new mathematical claim is made.

export const IMP_2833_ROUTEB_CLOSURE_ASSERTIONS = [
  {
    id: 'imp-2833/routeB-rigorous-sota',
    why: 'Route B must stay RIGOROUS-SOTA — the closesIf says it is already closed unconditionally.',
    holds: () => ROUTE_STATUS.routeB.status === 'RIGOROUS-SOTA',
  },
  {
    id: 'imp-2833/routeB-closesif-self-satisfied',
    why: 'Route B closesIf must still record that it is already closed unconditionally.',
    holds: () =>
      typeof ROUTE_STATUS.routeB.closesIf === 'string' &&
      ROUTE_STATUS.routeB.closesIf.includes('Already closed unconditionally'),
  },
  {
    id: 'imp-2833/eN-feed-gated-on-C_H',
    why: 'The E(N) onward feed from Route B must stay conditional on C_H — closesIf names exactly that gate.',
    holds: () =>
      ROUTE_STATUS.routeB.closesIf.includes('C_H') &&
      CONDITIONS.establishedConditional.some(
        (c) => c.id === 'C_G6a' && /C_H/.test(c.condition),
      ),
  },
  {
    id: 'imp-2833/C_H-still-open',
    why: 'C_H must remain in the OPEN bucket; if it migrated the Route B E(N) feed would no longer be honestly gated.',
    holds: () => CONDITIONS.open.some((c) => c.id === 'C_H'),
  },
  {
    id: 'imp-2833/no-false-lambda-improvement-from-routeB',
    why: 'Closing Route B must not move the headline below the Platt-Trudgian 0.2 SOTA — Route B is about the particle flow, not directly Lambda.',
    holds: () =>
      HEADLINE.baseline.includes('0.2') && HEADLINE.bound.includes('0.2'),
  },
];

// ── 6. imp-2834 BUILD-TIME ASSERTIONS ────────────────────────────────────────
//
// closesIf for Route A reads: "C_H Holder-1/2 shock modulus bounded
// unconditionally (imp-2672, currently RH-hard)." The named closure action is
// NOT executable: C_H is RH-hard / undischargeable (imp-2640 NEGATIVE — the
// Gronwall backward-flow amplification diverges at the collision scale). The
// only honest move is to record that negative and lock Route A as a gated
// ESTIMATE so a future drift cannot silently promote it to a rigorous Lambda
// improvement below the Platt-Trudgian 0.2 SOTA. No new mathematical claim is
// made; these tripwires assert the snapshot stays honest on that exact point.

export const IMP_2834_ROUTEA_GATE_ASSERTIONS = [
  {
    id: 'imp-2834/routeA-stays-estimate',
    why: 'Route A must stay an ESTIMATE — its closesIf action (bound C_H unconditionally) is RH-hard and was NOT executed.',
    holds: () => ROUTE_STATUS.routeA.status === 'ESTIMATE',
  },
  {
    id: 'imp-2834/routeA-closesif-still-names-RH-hard-C_H',
    why: 'Route A closesIf must still name C_H as RH-hard — the gate has not been discharged.',
    holds: () =>
      typeof ROUTE_STATUS.routeA.closesIf === 'string' &&
      ROUTE_STATUS.routeA.closesIf.includes('C_H') &&
      ROUTE_STATUS.routeA.closesIf.includes('RH-hard'),
  },
  {
    id: 'imp-2834/honest-negative-recorded',
    why: 'The honest-negative provenance must record that the C_H discharge is NOT executable, not a false QED.',
    holds: () =>
      typeof ROUTE_STATUS.routeA.imp2834 === 'string' &&
      ROUTE_STATUS.routeA.imp2834.includes('HONEST NEGATIVE') &&
      /NOT executable/.test(ROUTE_STATUS.routeA.imp2834),
  },
  {
    id: 'imp-2834/C_H-still-open',
    why: 'C_H must remain in the OPEN bucket — if it migrated, the Route A estimate would no longer be honestly gated.',
    holds: () => CONDITIONS.open.some((c) => c.id === 'C_H'),
  },
  {
    id: 'imp-2834/no-rigorous-lambda-below-0.2',
    why: 'Route A staying gated must not move the rigorous headline below the Platt-Trudgian 0.2 SOTA.',
    holds: () =>
      HEADLINE.baseline.includes('0.2') && HEADLINE.bound.includes('0.2'),
  },
];

// ── 7. imp-2835 BUILD-TIME ASSERTIONS ────────────────────────────────────────
//
// closesIf for the Thin-strip / kappa_T route reads: "N/A — structurally dead.
// Thin-strip route grows with height." There is NO executable closure action:
// the route was REFUTED (imp-2630) because kappa_T = 0.182 was frozen at
// T0=3000 and illegitimately multiplied against gamma = 1e13; the
// height-consistent kappa_T = 0.046 recomposes to E_trunc ~= 7.65 >> 0.2 and
// E_trunc only grows with height. The only honest move is to record that
// negative and lock the REFUTED status so a future drift cannot silently
// revive the withdrawn Lambda in [0.099, 0.137] as a live claim below the
// Platt-Trudgian 0.2 SOTA. No new mathematical claim is made.

export const IMP_2835_THINSTRIP_REFUTED_ASSERTIONS = [
  {
    id: 'imp-2835/thinstrip-stays-refuted',
    why: 'The Thin-strip route must stay REFUTED — its closesIf names no executable action (structurally dead).',
    holds: () => ROUTE_STATUS.thinStrip.status === 'REFUTED',
  },
  {
    id: 'imp-2835/closesif-still-records-structural-death',
    why: 'The closesIf must still record that the route is structurally dead and grows with height.',
    holds: () =>
      typeof ROUTE_STATUS.thinStrip.closesIf === 'string' &&
      /structurally dead/.test(ROUTE_STATUS.thinStrip.closesIf) &&
      /grows with height/.test(ROUTE_STATUS.thinStrip.closesIf),
  },
  {
    id: 'imp-2835/honest-negative-recorded',
    why: 'The honest-negative provenance must record that no executable closure action exists, not a false revival.',
    holds: () =>
      typeof ROUTE_STATUS.thinStrip.imp2835 === 'string' &&
      ROUTE_STATUS.thinStrip.imp2835.includes('HONEST NEGATIVE') &&
      /NO executable action/.test(ROUTE_STATUS.thinStrip.imp2835),
  },
  {
    id: 'imp-2835/withdrawn-lambda-not-revived-in-headline',
    why: 'The withdrawn Lambda <= 0.121 thin-strip headline must stay withdrawn — the rigorous bound stays at the Platt-Trudgian 0.2 SOTA.',
    holds: () =>
      HEADLINE.previousBoundWithdrawn.includes('WITHDRAWN') &&
      HEADLINE.bound.includes('0.2') &&
      HEADLINE.baseline.includes('0.2'),
  },
  {
    id: 'imp-2835/refutation-recorded-in-proof-chain',
    why: 'The proof chain must still carry the imp-2630 REFUTED step for the thin-strip route, naming its grows-with-height failure mode.',
    holds: () =>
      PROOF_CHAIN.some(
        (s) =>
          s.ticket === 'imp-2630' &&
          /REFUTED/.test(s.status) &&
          /grows with height/.test(s.claim),
      ),
  },
];

// ── 8. imp-2836 BUILD-TIME ASSERTIONS ────────────────────────────────────────
//
// closesIf for the Volterra route reads: "Only if RH is proved; this is
// RH-EQUIVALENT, not a route to Lambda." The named closure action is therefore
// NOT executable as a shortcut: ||V||<=1 is a FAITHFUL REFORMULATION of RH, so
// proving it is proving RH — it cannot feed a Lambda improvement on its own.
// The honest move is to record that negative and lock it against drift, in
// particular against the one false reading: that the RH-EQUIVALENT collapse (or
// the retracted 5000x empirical margin) could move the rigorous headline.
// These tripwires assert the snapshot stays internally consistent on that exact
// point. No new mathematical claim is made.

export const IMP_2836_VOLTERRA_RH_EQUIVALENT_ASSERTIONS = [
  {
    id: 'imp-2836/volterra-stays-rh-equivalent',
    why: 'The Volterra ||V||<=1 collapse must stay RH-EQUIVALENT — its closesIf names RH-equivalence, not an executable route to Lambda.',
    holds: () => ROUTE_STATUS.volterra.status === 'RH-EQUIVALENT',
  },
  {
    id: 'imp-2836/closesif-still-names-not-a-route',
    why: 'Volterra closesIf must still record that it closes only if RH is proved and is NOT a route to Lambda.',
    holds: () =>
      typeof ROUTE_STATUS.volterra.closesIf === 'string' &&
      ROUTE_STATUS.volterra.closesIf.includes('RH is proved') &&
      ROUTE_STATUS.volterra.closesIf.includes('not a route to Lambda'),
  },
  {
    id: 'imp-2836/5000x-margin-stays-retracted',
    why: 'The 5000x empirical margin was a homogeneity artifact (Wiener-Hopf 1/a bound retracted, imp-2660); the summary must keep recording that retraction.',
    holds: () =>
      typeof ROUTE_STATUS.volterra.summary === 'string' &&
      /retracted/.test(ROUTE_STATUS.volterra.summary) &&
      ROUTE_STATUS.volterra.summary.includes('not a shortcut'),
  },
  {
    id: 'imp-2836/honest-negative-recorded',
    why: 'The honest-negative provenance must record that no route-to-Lambda is claimed, not a false QED.',
    holds: () =>
      typeof ROUTE_STATUS.volterra.imp2836 === 'string' &&
      ROUTE_STATUS.volterra.imp2836.includes('RH-EQUIVALENT') &&
      ROUTE_STATUS.volterra.imp2836.includes('No route-to-Lambda is claimed'),
  },
  {
    id: 'imp-2836/no-false-lambda-improvement-from-volterra',
    why: 'An RH-EQUIVALENT collapse must not move the rigorous headline below the Platt-Trudgian 0.2 SOTA — proving ||V||<=1 is proving RH, not a Lambda shortcut.',
    holds: () =>
      HEADLINE.baseline.includes('0.2') &&
      HEADLINE.bound.includes('0.2') &&
      ROUTE_STATUS.volterra.summary.includes('reformulation of RH'),
  },
];

// ── 9. imp-2837 BUILD-TIME ASSERTIONS ────────────────────────────────────────
//
// closesIf for the Theta-trap / Min-gap sandwich route reads: "Field bound beta
// proved (imp-2683) would close the two-sided t_c bracket." imp-2683 executed
// that action only PARTIALLY: the gate beta_0 g^2 < 2 is now unconditional and
// N-uniform at the INITIAL INSTANT s=0 (B_p a sum of positive terms; telescope
// B_p G^2 <= 2(1 - 1/(K+1)) < 2; margin grows up the verified-zero ladder), but
// the sup over 0<=s<t_c with the FIXED initial g stays CONDITIONAL on a named
// punctured-min-gap residual (h(s) >= c*g uniformly). So the two-sided t_c
// bracket is NOT closed unconditionally and the route stays CONDITIONAL. These
// tripwires lock that honest partial against a false promotion to closed/
// unconditional. No rigorous Lambda improvement is claimed.

export const IMP_2837_THETATRAP_BRACKET_CONDITIONAL_ASSERTIONS = [
  {
    id: 'imp-2837/thetatrap-stays-conditional',
    why: 'The two-sided t_c bracket stays CONDITIONAL — imp-2683 proved field bound beta only at the initial instant, not over the full collision interval.',
    holds: () => ROUTE_STATUS.thetaTrap.status === 'CONDITIONAL',
  },
  {
    id: 'imp-2837/closesif-still-names-the-beta-action',
    why: 'The closesIf must still name field bound beta (imp-2683) as the action that would close the two-sided t_c bracket.',
    holds: () =>
      typeof ROUTE_STATUS.thetaTrap.closesIf === 'string' &&
      ROUTE_STATUS.thetaTrap.closesIf.includes('Field bound beta') &&
      ROUTE_STATUS.thetaTrap.closesIf.includes('imp-2683') &&
      ROUTE_STATUS.thetaTrap.closesIf.includes('two-sided t_c bracket'),
  },
  {
    id: 'imp-2837/honest-partial-recorded',
    why: 'The honest-partial provenance must record that imp-2683 closed the gate only at the initial instant, with the sup over the interval still conditional.',
    holds: () =>
      typeof ROUTE_STATUS.thetaTrap.imp2837 === 'string' &&
      ROUTE_STATUS.thetaTrap.imp2837.includes('HONEST PARTIAL') &&
      ROUTE_STATUS.thetaTrap.imp2837.includes('INITIAL INSTANT') &&
      ROUTE_STATUS.thetaTrap.imp2837.includes('punctured-min-gap residual') &&
      ROUTE_STATUS.thetaTrap.imp2837.includes('NOT closed unconditionally'),
  },
  {
    id: 'imp-2837/beta-condition-stays-conditional-in-conditions',
    why: 'The C_beta condition must remain in establishedConditional with its unproven field-bound-beta gate — it must not migrate to established.',
    holds: () =>
      CONDITIONS.establishedConditional.some(
        (c) =>
          c.id === 'C_beta' &&
          c.ticket === 'imp-2683' &&
          /unproven/.test(c.condition),
      ) &&
      !CONDITIONS.established.some((c) => c.id === 'C_beta'),
  },
  {
    id: 'imp-2837/no-false-lambda-improvement-from-thetatrap',
    why: 'A still-conditional t_c bracket must not move the rigorous headline below the Platt-Trudgian 0.2 SOTA.',
    holds: () =>
      HEADLINE.baseline.includes('0.2') && HEADLINE.bound.includes('0.2'),
  },
];

// ── 10. imp-2838 BUILD-TIME ASSERTIONS ───────────────────────────────────────
//
// closesIf for the ESY / Selberg-trace PCC closure route reads: "Would require a
// genuine breakthrough on the Montgomery PCC conjecture." This names NO
// executable action — the Montgomery pair-correlation conjecture (PCC) is a
// 50-year open wall, and proving it is a structural breakthrough that lies
// entirely outside this project, not a step that can be executed here. The only
// honest move is to record that negative and lock the DEAD-END status so a
// future drift cannot silently promote an ESY/Selberg-trace/PCC-adjacent route
// to a live Lambda claim below the Platt-Trudgian 0.2 SOTA while PCC stays open.
// No new mathematical claim is made.

export const IMP_2838_ESY_PCC_DEADEND_ASSERTIONS = [
  {
    id: 'imp-2838/esy-stays-dead-end',
    why: 'The ESY / Selberg-trace PCC closure route must stay DEAD-END — its closesIf names no executable action (a 50-year open conjecture).',
    holds: () => ROUTE_STATUS.esy.status === 'DEAD-END',
  },
  {
    id: 'imp-2838/closesif-still-names-pcc-breakthrough',
    why: 'The closesIf must still record that closure would require a genuine breakthrough on the Montgomery PCC conjecture.',
    holds: () =>
      typeof ROUTE_STATUS.esy.closesIf === 'string' &&
      ROUTE_STATUS.esy.closesIf.includes('genuine breakthrough') &&
      ROUTE_STATUS.esy.closesIf.includes('Montgomery PCC'),
  },
  {
    id: 'imp-2838/honest-negative-recorded',
    why: 'The honest-negative provenance must record that no executable closure action exists, not a false revival.',
    holds: () =>
      typeof ROUTE_STATUS.esy.imp2838 === 'string' &&
      ROUTE_STATUS.esy.imp2838.includes('HONEST NEGATIVE') &&
      /NO executable action/.test(ROUTE_STATUS.esy.imp2838),
  },
  {
    id: 'imp-2838/pcc-stays-open-structural-blocker',
    why: 'The Montgomery PCC condition must remain in CONDITIONS.open as the structural blocker for all ESY/Selberg-trace/PCC-adjacent routes — it must not migrate to established.',
    holds: () =>
      CONDITIONS.open.some(
        (c) => c.id === 'PCC' && /50-year open/.test(c.description),
      ) &&
      !CONDITIONS.established.some((c) => c.id === 'PCC'),
  },
  {
    id: 'imp-2838/no-false-lambda-improvement-from-esy',
    why: 'A DEAD-END route behind the open PCC wall must not move the rigorous headline below the Platt-Trudgian 0.2 SOTA.',
    holds: () =>
      HEADLINE.baseline.includes('0.2') && HEADLINE.bound.includes('0.2'),
  },
];
