/**
 * @module frozen-rung-pt-equivalence-2026-07-31
 * @fileoverview PROPOSITION (operator-language reformulation): the Platt–Trudgian
 * verified-height Λ bound IS the winding-form frozen-rung index certificate of the
 * twin-ladder kernel bridge — "freezing the rungs is Platt–Trudgian in operator
 * language" — and by inertia-preservation it can never beat it.
 *
 * PROVENANCE: 2026-07-31, a 3-way freeze investigation (rungs / kernel-bridge §23 /
 * transfer-matrix KYP) run on Fable 5 (claude-fable-5[1m]). This module records the
 * ONE genuinely-new, honest output. It is NOT a new Λ bound and NOT RH.
 *
 * ── HONEST STATUS ──────────────────────────────────────────────────────────
 *   • The "no-better-than-verified-height" (inertia) half is a THEOREM (Prop 23.2
 *     Sylvester inertia + the §17.4 Krein–Langer index identity, imp-1232).
 *   • The FULL equivalence "frozen-rung certificate ⟺ PT verified height" is
 *     CONJECTURAL, gated on two named lemmas: L1 (tail-leakage, plausibly provable)
 *     and L2 (mesh detection/resolution, genuinely OPEN).
 *   • It yields NO Λ improvement: fed the same verified zeros + the same H_t flow
 *     certificates (Polymath15 Thm 1.2 hyps ii/iii) it reproduces EXACTLY
 *     Λ ≤ 0.1787854 (candidate row) / Λ ≤ 0.2 (Polymath row). No refereed bound is changed
 *     . NO false QED.
 *
 * Its value is conceptual: it explains, in the operator frame, WHY the entire
 * barrier/positivity-tightening class (SOS, Carleman, Putinar, Schur/Blaschke
 * freezing) is refuted as a Λ<0.2 lever — inertia-preservation means no frozen-rung
 * cleverness outruns the verified height. Operator-side echo of the PT-floor audit
 * (see [[project_pt_floor_binds_on_verified_height]] / page /pt-floor-audit).
 */

/** The twin-ladder objects the proposition is stated over. */
export const SETUP = Object.freeze({
  X: 'X(w) = ξ(1/2 + w)  (entire, real-even; zeros at w = (β−1/2) + iγ for ξ-zeros ρ=β+iγ)',
  bridge: 'R_a(w) = X(w−a) / X(w+a) on the right half-plane C_+, a > 0',
  kernel: 'K_a = the reproducing/coupling kernel of R_a (the "rungs" between the two ladder sides)',
  indexIdentity:
    'Krein–Langer / §17.4 (imp-1232):  ind_-(K_{R_a}) = #{ ξ-zeros with Re λ > a } — the ghost count at level a.',
  rhLink: 'RH ⟺ ind_-(K_{R_a}) = 0 for all a>0 ⟺ Λ ≤ 0.',
  frozenCert:
    'Frozen-rung certificate (Lemma 23.3): on a finite mesh Z ⊂ band W_T={|Im w|≤T}, a passive ' +
    'frozen approximation G^fr with interval error E gives  λ_min(G^fr) > ‖E‖₂  ⇒  G_a(Z) ≻ 0 on span{k_z : z∈Z}.',
});

/** The proposition, in four parts, each with its honest status. */
export const PROPOSITION = Object.freeze({
  label: 'Frozen-rung ⟺ Platt–Trudgian (operator-language reformulation)',

  // (A) PROVEN — the "can never beat verified height" half.
  provenInertiaHalf: {
    status: 'THEOREM (proven, unconditional)',
    statement:
      'Freezing the rungs is inertia-preserving (Prop 23.2, Sylvester congruence: ' +
      'ind_-(Q) = ind_-(C) + ind_-(Q_eff)). Passive frozen rungs have ind_- = 0 by construction, ' +
      'so ALL negative index lives in the true kernel and no rung rearrangement removes it. Combined ' +
      'with the §17.4 index identity, the frozen-rung certificate can never certify a smaller ghost ' +
      'count than the true zero data supports: its Λ-content is bounded by the verified-height bound, ' +
      'and it can NEVER beat Platt–Trudgian.',
    cites: ['§23.2 Prop 23.2 (Sylvester inertia)', '§17.4 Krein–Langer (imp-1232)'],
  },

  // (B) The sharp identity: PT = the WINDING form.
  windingFormIdentity: {
    status: 'IDENTITY (the sharp equivalence)',
    statement:
      'Platt–Trudgian (Turing-method argument-principle count of ξ-zeros up to height T) EQUALS the ' +
      'winding-number / contour-integral form of the frozen-rung index certificate over ∂W_T. So PT ' +
      'IS the frozen-rung index certificate in winding form — exactly. The Gram/λ_min form (Lemma 23.3) ' +
      'is a STRICTLY WEAKER sibling at any finite mesh (it certifies positivity only on the sampled ' +
      'subspace). The project barrier certificate proves hypothesis (iii) in exactly this winding form ' +
      '(883 prisms, each certified winding zero).',
    cites: ['Turing method', 'BARRIER_CERTIFICATE.md §6.3 (winding form)'],
  },

  // (C) CONJECTURAL — the "no less" half, gated on two named lemmas.
  conditionalEquivalence: {
    status: 'CONJECTURE (open; two named lemmas)',
    statement:
      '"No off-critical ξ-zeros with |γ| ≤ T"  ⟺  "for all a>0 and all sufficiently dense meshes ' +
      'Z ⊂ W_T the frozen-rung certificate passes",  conditional on:',
    L1: {
      name: 'L1 — tail-leakage bound',
      claim:
        'An unconditional bound on the contribution of unverified zeros above T (their rank-one ' +
        'negative-square directions, ~a·σ/γ² per ghost) to any low-window Gram, so window positivity ' +
        'is not spoofed. Needed for ⇒.',
      status: 'plausibly provable (N(T)~T log T counting + Blaschke γ^{-2} decay); it is the ε_U side of §23.4. NOT done.',
    },
    L2: {
      name: 'L2 — mesh detection / resolution',
      claim:
        'An explicit mesh density δ(T,a) at which any ghost with |Im λ| ≤ T is FORCED to produce a ' +
        'certified negative eigenvalue (so sampled-subspace positivity upgrades to region zero-freeness). Needed for ⇐.',
      status: 'GENUINELY OPEN — this is the single load-bearing gap.',
    },
  },

  // (D) Consequence + scope.
  consequence: {
    status: 'HONEST SCOPE',
    statement:
      'Given (C) plus the H_t flow certificates (Polymath15 Thm 1.2 hyps ii/iii), the frozen-rung ' +
      'certificate reproduces EXACTLY Λ ≤ 893927/5000000 = 0.1787854 (candidate row) or Λ ≤ 0.2 ' +
      '(Polymath row) — no improvement, and by (A) it provably cannot do better. The certificate ' +
      'consumes ξ-evaluations on a mesh (a SIBLING finite computation), and its Gram form is ' +
      'exponentially costlier than Turing’s linear winding sweep. Slogan: "the Turing method is the ' +
      'efficient (winding-form) special case of the frozen-rung index certificate."',
    notARHproof: true,
    notANewBound: true,
    ptRemainsSOTA: 'Platt–Trudgian Λ ≤ 0.2 (candidate Λ ≤ 0.1787854 via verified-height reductions).',
  },
});

/** Why this is worth recording even though it is non-improving. */
export const WHY_IT_MATTERS =
  'It is the operator-frame explanation of the obstruction seam on the Λ-upper-bound side: ' +
  'inertia-preservation (A) is precisely WHY the barrier/positivity-tightening class cannot beat the ' +
  'verified height. The only Λ-moving lever remains raising the verified height (inverse-log). This ' +
  'proposition is new to the repo — no prior §15/§17/§23 operator file connects the twin-ladder ' +
  'machinery to Platt–Trudgian.';

export const FROZEN_RUNG_PT_EQUIVALENCE = Object.freeze({
  id: 'frozen-rung-pt-equivalence-2026-07-31',
  setup: SETUP,
  proposition: PROPOSITION,
  whyItMatters: WHY_IT_MATTERS,
  paperPdf: '/frozen-rung-pt-equivalence.pdf',
});

/** Build-time invariants (honesty tripwires). */
export const FROZEN_RUNG_PT_EQUIVALENCE_ASSERTIONS = [
  {
    id: 'inertia-half-is-theorem',
    holds: () => PROPOSITION.provenInertiaHalf.status.startsWith('THEOREM'),
    why: 'The "can never beat PT" (inertia) half must be recorded as proven.',
  },
  {
    id: 'equivalence-is-conjectural-with-open-L2',
    holds: () =>
      PROPOSITION.conditionalEquivalence.status.startsWith('CONJECTURE') &&
      PROPOSITION.conditionalEquivalence.L2.status.includes('OPEN'),
    why: 'The full equivalence must stay CONJECTURAL with L2 flagged OPEN — no false QED.',
  },
  {
    id: 'not-a-new-bound-pt-sota',
    holds: () =>
      PROPOSITION.consequence.notANewBound === true &&
      PROPOSITION.consequence.notARHproof === true &&
      /0\.2|refereed bound is changed/.test(PROPOSITION.consequence.ptRemainsSOTA),
    why: 'Must record that this yields NO new bound, is NOT an RH proof, and no refereed bound is changed.',
  },
];
