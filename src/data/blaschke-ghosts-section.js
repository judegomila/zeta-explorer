/**
 * @module data/blaschke-ghosts-section
 * @fileoverview Structured source-of-truth for §17 of the research paper
 * (twin_ladder_consolidated_v52.pdf, pp 22-26): "Attack on the Wall: Inverse
 * Blaschke Ghosts and the Pontryagin Decomposition". Backs the /blaschke-ghosts
 * app page (imp-1198). It records the paper claims so the page can render them;
 * it does NOT prove anything new.
 *
 * Exports:
 *   - BLASCHKE_GHOSTS_SECTION — frozen record (ticket imp-1198) of the §17
 *     content: the shifted scattering ratio R_a, the inverse Blaschke ghost
 *     factor and pole-clearing, the single-ghost-equals-single-negative-square
 *     headline, the generalized-Schur / Krein-Langer negative-index identity,
 *     the four-route consequences (A, B, C, D), Conjecture 17.3, the three
 *     attempted non-circular closures, and the interactive demo parameters.
 *   - BLASCHKE_GHOSTS_SECTION_ASSERTIONS — 7 build-time tripwires re-checking
 *     paper-source path, the negative-square headline, the four-route list, the
 *     negative-index identity, Conjecture 17.3 wording, the three named attacks,
 *     and the demo parameter ranges.
 *
 * Proof-chain role: reference / QA data file, not a step in the analytic Lambda
 * argument. §17 sharpens the no-ghost statement (each off-critical zeta zero is
 * an explicit inverse Blaschke factor contributing one rank-one negative square),
 * making the RH obstruction localised to identifiable ghost channels rather than
 * diffuse.
 *
 * Tickets: created by imp-1198; module-doc navigation block added by this audit.
 */
// imp-1198: structured record of §17 "Attack on the Wall: Inverse Blaschke
// Ghosts and the Pontryagin Decomposition" from the user's paper at
// research-inputs/twin_ladder_consolidated_v52.pdf (pages 22-26).
//
// PURPOSE
// -------
// §17 sharpens the no-ghost theorem: every off-critical zero of ξ contributes
// an explicit inverse Blaschke factor and hence an explicit negative square
// in the shifted bridge kernel. The proof obstruction to RH is therefore
// NOT diffuse — it is carried by identifiable "ghost channels" indexed by
// the (hypothetical) off-critical zeros.
//
// This file is the structured source-of-truth for the /blaschke-ghosts
// app page (imp-1198). It does NOT prove anything new; it records the
// paper's claims and consequences so the app can render them coherently.

export const BLASCHKE_GHOSTS_SECTION = Object.freeze({
  id: 'blaschke-ghosts-section',
  ticket: 'imp-1198',
  paperSourcePath: 'research-inputs/twin_ladder_consolidated_v52.pdf',
  paperSection: '§17',
  paperPageRange: '22-26',
  generatedAt: '2026-05-26T17:00:00Z',

  title: 'Inverse Blaschke Ghosts and the Pontryagin Decomposition',
  oneLine:
    "Off-critical zeros of ξ are not diffuse obstructions — each is an explicit " +
    "inverse Blaschke factor contributing exactly one negative square to the shifted " +
    "bridge kernel.",

  // ── §17.1: The shifted scattering ratio ────────────────────────────────
  shiftedScatteringRatio: Object.freeze({
    definition: 'R_a(w) := X(w - a) / X(w + a),  for ℜw > 0, a > 0, where X(w) = ξ(1/2 + w)',
    boundaryProperty: '|R_a(it)| = 1 for all t ∈ ℝ (functional equation makes it unitary on the imaginary axis)',
    polesAreOffCriticalZeros:
      'If X(λ) = 0 with λ = δ + iγ, then R_a has a right-half-plane pole at α = (δ - a) + iγ ' +
      'exactly when δ > a. So right-half-plane poles of R_a are precisely the off-critical zero ' +
      'witnesses whose horizontal displacement exceeds the bridge thickness a.',
  }),

  // ── §17.2: Right-half-plane Blaschke ghosts + pole-clearing ────────────
  blaschkeGhost: Object.freeze({
    factor: 'b_α(w) := (w - α) / (w + α)',
    properties: [
      '|b_α(it)| = 1 for t ∈ ℝ (unitary boundary)',
      'zero at w = α',
      'multiplying R_a by b_α removes the pole at α',
    ],
    ghostBlaschkeProduct: 'B_a^+(w) := ∏_{α ∈ P_a} b_α(w)',
    poleSet: 'P_a := { λ - a : X(λ) = 0, ℜλ > a }  (with multiplicity)',
    poleClearedBridge: 'R̃_a(w) := B_a^+(w) · R_a(w)',
    decompositionStatement:
      'Proposition 17.1 (Pole-clearing decomposition): R_a = R̃_a / B_a^+. ' +
      'If B_a^+ ≡ 1, the bridge is Schur. If B_a^+ is nontrivial, positivity fails by explicit negative-square channels.',
  }),

  // ── §17.3: Single ghost = single negative square ───────────────────────
  singleGhostNegativeSquare: Object.freeze({
    schurKernel: 'K_S(z, w) := (1 - S(z) S̄(w)) / (z + w̄)',
    forSingleInverseBlaschke: 'S(w) = 1 / b_α(w) = (w + α) / (w - α)',
    computation: 'K_S(z, w) = − 2·ℜα / ((z - α)(w̄ - ᾱ)) = − k_α(z) k̄_α(w̄)',
    rankOneFactorization: 'k_α(z) := √(2·ℜα) / (z - α)',
    headlineResult:
      "ONE inverse Blaschke ghost = ONE rank-one negative square. This is the " +
      "operator-theoretic version of the Gödelian witness principle: a forbidden " +
      "off-critical zero produces an internal certificate of failed bridge positivity.",
    corollary17_2:
      'Corollary 17.2 (Ghost witness): If X has a zero λ = δ + iγ with δ > a, then R_a has a pole at α = (δ - a) + iγ ' +
      'and this pole contributes a negative square −2(δ - a) / ((z - α)(w̄ - ᾱ)) to the indefinite Schur kernel.',
  }),

  // ── §17.4: Generalized Schur interpretation (Krein-Langer) ─────────────
  generalizedSchur: Object.freeze({
    classMembership: 'R_a = R̃_a / B_a^+ places R_a in a generalized Schur class',
    negativeIndexIdentity:
      'ind_− (K_{R_a}) = #{ λ : X(λ) = 0, ℜλ > a },  with multiplicity (the exact Krein-Langer / Pontryagin identity)',
    interpretation:
      "The number of negative squares in R_a's Schur kernel is EXACTLY the number of " +
      "off-critical zeros whose horizontal displacement exceeds a. RH ⇔ this count is 0 for every a > 0.",
  }),

  // ── §17.5: Consequences for the four closure routes ────────────────────
  fourRouteConsequences: Object.freeze([
    Object.freeze({
      route: 'A',
      name: 'Schur contractivity',
      consequence: 'R_a ∈ Schur ⇔ B_a^+ ≡ 1',
      reading: 'Schur contractivity is exactly NO inverse Blaschke ghosts.',
    }),
    Object.freeze({
      route: 'B',
      name: 'de Branges positivity',
      consequence: 'K_a ⪰ 0 ⇔ P_a = ∅',
      reading: 'de Branges positivity is exactly NO right-half-plane ghost poles.',
    }),
    Object.freeze({
      route: 'C',
      name: 'Hidden-square factorization',
      consequence: 'K_a = B*_{passive} B_{passive} − B*_{ghost} B_{ghost}',
      reading: 'The hidden square becomes an INDEFINITE square; true Hilbert square ⇔ B_ghost = 0.',
    }),
    Object.freeze({
      route: 'D',
      name: 'Weil / twin-ladder positivity',
      consequence: 'Q_{TL,a}[h] = ‖B_passive h‖² − Σ_{α ∈ P_a} |⟨h, g_α⟩|²',
      reading: 'Weil-style quadratic form decomposes into passive part minus ghost contributions.',
    }),
  ]),

  // ── §17.6: The sharpened wall + Conjecture 17.3 ───────────────────────
  sharpenedWall: Object.freeze({
    conjecture17_3_statement:
      "Conjecture 17.3 (Ghost-absence theorem): For every a > 0, the right-half-plane ghost " +
      "Blaschke product B_a^+(w) is identically 1.",
    equivalentReformulations: [
      'No off-critical zeros with |ℜρ - 1/2| > a (for the given a > 0)',
      'No right-half-plane poles in the shifted scattering ratio R_a',
      'Empty pole set P_a',
      'Equivalent to RH in the limit a → 0',
    ],
  }),

  // ── §17.7 attempted non-circular closures (named, not solved) ────────
  attemptedClosures: Object.freeze([
    Object.freeze({
      id: 'attack-I-kernel-passivity',
      name: 'kernel/passivity closure',
      description: 'Show R_a arises from a passive realization (KYP / bounded-real) so it cannot have right-half-plane poles.',
      paperSection: '§18.1',
      status: 'research-grade-open',
    }),
    Object.freeze({
      id: 'attack-II-prime-delay',
      name: 'prime-delay domination',
      description: 'Bound the right-half-plane modulus of R_a from above using only prime data + the functional equation.',
      paperSection: '§18.2',
      status: 'research-grade-open',
    }),
    Object.freeze({
      id: 'attack-III-weil-pontryagin',
      name: 'Weil / Pontryagin index closure',
      description: 'Use Weil-positivity-style identities to show the negative-square index must be zero.',
      paperSection: '§18.3',
      status: 'research-grade-open',
    }),
  ]),

  // ── Interactive demo parameters (for the React page slider) ──────────
  demoParameters: Object.freeze({
    deltaRange: { min: 0, max: 0.5, step: 0.01 },
    gammaRange: { min: 0, max: 50, step: 0.5 },
    aRange:     { min: 0.001, max: 0.5, step: 0.001 },
    note:
      "Move δ (horizontal displacement) and γ (imaginary part) of a hypothetical off-critical zero ρ = 1/2 + δ + iγ " +
      "and watch the negative-square count update: ghosts appear iff δ > a.",
  }),

  references: Object.freeze({
    paper:                 'research-inputs/twin_ladder_consolidated_v52.pdf §17',
    rh:                    'Riemann 1859',
    deBruijnNewman:        'de Bruijn 1950 / Newman 1976',
    deBranges:             'L. de Branges, Hilbert Spaces of Entire Functions (1968)',
    kreinLanger:           'Krein-Langer, generalized Schur functions / Pontryagin spaces 1973-77',
    relatedAppRoutes:      'src/data/closure-routes-section.js (imp-1197)',
    relatedAppShiftBridge: 'src/data/shift-bridge-positivity-section.js (imp-1196)',
    relatedAppThreeAttack: 'src/data/three-attacks-section.js (imp-1199)',
  }),
});

export const BLASCHKE_GHOSTS_SECTION_ASSERTIONS = [
  {
    id: 'imp1198-blaschke-ghosts-paper-source-path-correct',
    why: 'The paper-source-path field must point at the actual PDF in research-inputs/. ' +
         'Mis-pointing would silently mis-attribute the section.',
    holds: () => BLASCHKE_GHOSTS_SECTION.paperSourcePath === 'research-inputs/twin_ladder_consolidated_v52.pdf',
  },
  {
    id: 'imp1198-headline-single-ghost-equals-single-negative-square',
    why: 'The §17.3 headline result is "one inverse Blaschke ghost = one rank-one negative square". ' +
         'Misrendering would invert the operator-theoretic statement.',
    holds: () => BLASCHKE_GHOSTS_SECTION.singleGhostNegativeSquare.headlineResult.includes('ONE') &&
                 BLASCHKE_GHOSTS_SECTION.singleGhostNegativeSquare.headlineResult.includes('negative square'),
  },
  {
    id: 'imp1198-four-route-consequences-listed',
    why: '§17.5 spells out consequences for ALL FOUR closure routes (A, B, C, D). Missing any one ' +
         'breaks the cross-link to imp-1197 closure-routes-section.',
    holds: () => {
      const routes = BLASCHKE_GHOSTS_SECTION.fourRouteConsequences.map((r) => r.route);
      return routes.length === 4 && ['A', 'B', 'C', 'D'].every((r) => routes.includes(r));
    },
  },
  {
    id: 'imp1198-negative-index-identity-present',
    why: 'The Krein-Langer/Pontryagin identity ind_-(K) = #off-critical-zeros-beyond-a is the load-bearing ' +
         'sharpening of the no-ghost statement. It must appear in §17.4 generalizedSchur.',
    holds: () => BLASCHKE_GHOSTS_SECTION.generalizedSchur.negativeIndexIdentity.includes('ind_'),
  },
  {
    id: 'imp1198-conjecture-17-3-present',
    why: 'Conjecture 17.3 (Ghost-absence theorem) is the explicit research-grade-open formulation of RH ' +
         'under the bridge framework. Must be cited verbatim or paraphrased honestly.',
    holds: () => {
      const c = BLASCHKE_GHOSTS_SECTION.sharpenedWall.conjecture17_3_statement;
      return c.includes('17.3') && c.includes('every a > 0') && c.includes('identically 1');
    },
  },
  {
    id: 'imp1198-attempted-closures-three-attacks-named',
    why: '§17.7 + §18 name three attempted non-circular closures (kernel/passivity, prime-delay, Weil-Pontryagin). ' +
         'All three must be listed so the live-attack surface stays auditable.',
    holds: () => {
      const ids = BLASCHKE_GHOSTS_SECTION.attemptedClosures.map((a) => a.id);
      return ids.length === 3 &&
             ids.some((i) => i.includes('kernel-passivity')) &&
             ids.some((i) => i.includes('prime-delay')) &&
             ids.some((i) => i.includes('weil-pontryagin'));
    },
  },
  {
    id: 'imp1198-demo-parameter-ranges-sensible',
    why: 'The interactive demo lets readers move δ and γ; ranges must be sensible (δ in [0, 0.5] matches ' +
         'the classical zero strip; γ up to 50 covers the bulk of the first few hundred zeros).',
    holds: () => {
      const d = BLASCHKE_GHOSTS_SECTION.demoParameters;
      return d.deltaRange.min === 0 && d.deltaRange.max === 0.5 &&
             d.aRange.min > 0 && d.aRange.max <= 0.5;
    },
  },
];
