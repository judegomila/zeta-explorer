// @module data/imp-2695-debranges-hb-downstream-verify
//
// imp-2695 (proof, opus-4-8/api-pool) -- VERIFY the de Branges Hermite-Biehler
// DOWNSTREAM chain that SURVIVES the Section-27 LINK B refutation.
//
// section27-identity-refutation-2026-06-17 establishes that the load-bearing
// collapse identity LINK B (||V_{a,Phi}|| <= 1  <=>  K_a >= 0) is FALSE as a
// Phi-uniform equivalence. What it explicitly records as "genuine but
// downstream" is the standard de Branges machinery applied to the hypothesis
// K_a >= 0:
//
//     K_a >= 0  =>  E_a is Hermite-Biehler
//               =>  H(E_a) is a de Branges space
//               =>  H(E_a) carries a canonical-system (Hamiltonian) structure.
//
// This module records that chain as a CLEAN CONDITIONAL THEOREM with K_a >= 0
// as the EXPLICIT, UNPROVEN antecedent. Each implication is textbook de Branges
// theory (citations below). The module NOWHERE claims K_a >= 0 itself: that
// antecedent is RH-equivalent and unproven, and the only route that purported
// to derive it from an operator-norm bound (LINK B) is REFUTED. The value here
// is the honest separation of the rigorous standard-machinery half from the
// unproven antecedent.
//
// PRIMARY CITATION: L. de Branges, "Hilbert Spaces of Entire Functions"
// (Prentice-Hall, 1968), Theorem 23 (Hermite-Biehler characterization via
// kernel positivity), with Theorems 19-22 (the space H(E) and its reproducing
// kernel) and Theorems 37-40 (the ordered chain of spaces / canonical system).
// Modern reference for the canonical-system half: C. Remling, "Spectral Theory
// of Canonical Systems" (de Gruyter, 2018), Ch. 5-6.
//
// METHOD: training-time de Branges / canonical-systems theory only. Citations
// recalled, not freshly verified against the texts. No PDF browsing. No
// numerics: this is a structural conditional-theorem record. No false QED.

// ---------------------------------------------------------------------------
//  GAUGES (as in imp-1219 / imp-1265 / imp-2664)
// ---------------------------------------------------------------------------
//   A_a(z) = int_0^inf Phi(u) cosh(au) cos(zu) du           (real, even gauge)
//   B_a(z) = int_0^inf Phi(u) sinh(au) sin(zu) du           (real, odd gauge)
//   E_a    = A_a - i B_a       (HB candidate)
//   E_a^#(z) = conj(E_a(conj z)) = A_a + i B_a   (Krein / de Branges adjoint)
//   K_a(w,z) = de Branges reproducing kernel of the gauge pair (A_a, B_a),
//              antisymmetric Wronskian numerator (the sign-corrected form per
//              section27-identity-refutation / imp-2664):
//                K_a(w,z) = [B_a(z) A_a(conj w) - A_a(z) B_a(conj w)]
//                           / [pi (z - conj w)]
//                         = [E_a(z) E_a^#(conj w) - E_a^#(z) E_a(conj w)]
//                           / [2 pi i (conj w - z)].

const PAPER_REF =
  'de Branges, Hilbert Spaces of Entire Functions (1968), Thm 23 (+ Thm 19-22, 37-40)';

// ---------------------------------------------------------------------------
//  THE EXPLICIT UNPROVEN ANTECEDENT (never asserted as established)
// ---------------------------------------------------------------------------

const ANTECEDENT = Object.freeze({
  id: 'antecedent-K_a-nonneg-UNPROVEN',
  statement:
    'K_a >= 0: the de Branges kernel of the gauge pair (A_a, B_a) is positive ' +
    'semidefinite (all finite Gram matrices [K_a(z_j, z_k)] are PSD).',
  status: 'UNPROVEN ANTECEDENT (hypothesis only)',
  whyUnproven:
    'K_a >= 0 for the Riemann Phi is RH-equivalent. The sole program route that ' +
    'claimed to derive it from a bound, LINK B (||V|| <= 1 <=> K_a >= 0), is ' +
    'REFUTED as a Phi-uniform equivalence (section27-identity-refutation-2026-06-17; ' +
    'independently re-derived in imp-2664 via the scale-degree obstruction). So ' +
    'this module takes K_a >= 0 strictly as a HYPOTHESIS and derives only its ' +
    'consequences.',
  assertedHere: false,
});

// ---------------------------------------------------------------------------
//  STEP 1: K_a >= 0  =>  E_a is Hermite-Biehler            [de Branges Thm 23]
// ---------------------------------------------------------------------------

const STEP1_KERNEL_TO_HB = Object.freeze({
  id: 'step1-K_a-nonneg-implies-E_a-HB',
  claim: 'K_a >= 0  =>  E_a is Hermite-Biehler (de Branges class HB).',
  conditional: true,
  citation: 'de Branges 1968, Theorem 23.',
  explicitArgument: Object.freeze([
    'de Branges Thm 23: for an entire E = A - iB with A, B real entire, the ' +
      'kernel K(w,z) = [B(z)A(conj w) - A(z)B(conj w)] / [pi (z - conj w)] is ' +
      'nonnegative (PSD) IF AND ONLY IF E belongs to the Hermite-Biehler class, ' +
      'i.e. E has no zeros in the open upper half-plane and ' +
      '|E^#(z)| < |E(z)| for Im z > 0.',
    'The hypothesis K_a >= 0 is exactly the PSD half of this biconditional for ' +
      'E_a = A_a - i B_a, hence E_a is Hermite-Biehler. (This is the genuinely ' +
      'rigorous, bidirectional textbook step; only the hypothesis is in doubt.)',
    'Regularity side-condition: A_a, B_a are entire of finite exponential type ' +
      '(Paley-Wiener: Phi compactly supported / fast-decaying), so E_a is in the ' +
      'Polya class and Thm 23 applies without pathology.',
  ]),
  bidirectional: true,
  verdict: 'rigorous-conditional-on-antecedent',
});

// ---------------------------------------------------------------------------
//  STEP 2: E_a HB  =>  H(E_a) is a de Branges space        [de Branges Thm 19-22]
// ---------------------------------------------------------------------------

const STEP2_HB_TO_SPACE = Object.freeze({
  id: 'step2-E_a-HB-implies-de-branges-space',
  claim: 'E_a Hermite-Biehler  =>  H(E_a) is a de Branges space (RKHS).',
  conditional: true,
  citation: 'de Branges 1968, Theorems 19-22.',
  explicitArgument: Object.freeze([
    'For E in HB, define H(E_a) = { f entire : f/E_a and f^#/E_a are in the ' +
      'Hardy space H^2 of the upper half-plane }, with inner product ' +
      '<f,g> = int_R f(x) conj(g(x)) / |E_a(x)|^2 dx.',
    'de Branges Thm 19-21: H(E_a) is a Hilbert space of entire functions ' +
      'satisfying the three axioms (H1) f in H => f^# in H with equal norm; ' +
      '(H2) point evaluations are bounded; (H3) the difference-quotient ' +
      'isometry. The HB property of E_a is exactly what makes the norm finite ' +
      'and the axioms hold.',
    'Its reproducing kernel is K_a(w, .) above (Thm 22): ' +
      '<f, K_a(w, .)> = f(w) for all f in H(E_a). The PSD-ness of K_a (Step 1 ' +
      'hypothesis route) is the reproducing-kernel positivity, consistent by ' +
      'construction.',
  ]),
  verdict: 'rigorous-conditional-on-antecedent',
});

// ---------------------------------------------------------------------------
//  STEP 3: H(E_a)  =>  canonical-system (Hamiltonian) structure
//          [de Branges Thm 37-40 / Remling Ch. 5-6]
// ---------------------------------------------------------------------------

const STEP3_SPACE_TO_CANONICAL = Object.freeze({
  id: 'step3-de-branges-space-implies-canonical-system',
  claim:
    'H(E_a) is the right-endpoint space of a canonical (Hamiltonian) system ' +
    'dy/dx = z J H(x) y(x), J = [[0,-1],[1,0]], H(x) >= 0 trace-normalized.',
  conditional: true,
  citation: 'de Branges 1968, Theorems 37-40; Remling 2018, Ch. 5-6.',
  explicitArgument: Object.freeze([
    'de Branges structure / ordering theorem: any de Branges space H(E) embeds ' +
      'in a totally ordered chain { H(E(t)) : 0 <= t <= L } of de Branges ' +
      'subspaces (the ordering is by isometric inclusion, Thm 35).',
    'To the chain corresponds a unique (up to reparametrization / trace ' +
      'normalization) Hamiltonian H(x) >= 0, 2x2 real symmetric, locally ' +
      'integrable, with the canonical system dy/dx = z J H(x) y(x) whose ' +
      'transfer matrix builds E(t) = (A(t), B(t)) from the initial data ' +
      '(Thm 37-40 / de Branges inverse spectral theorem).',
    'Identifying E_a with the right-endpoint value E(L) gives H(E_a) as the ' +
      'solution space of that canonical system. The Weyl-Titchmarsh m-function ' +
      'of the system encodes the same spectral data (Remling, the ' +
      'de-Branges-space <-> canonical-system bijection).',
  ]),
  verdict: 'rigorous-conditional-on-antecedent',
});

// ---------------------------------------------------------------------------
//  THE CLEAN CONDITIONAL THEOREM
// ---------------------------------------------------------------------------

const CONDITIONAL_THEOREM = Object.freeze({
  id: 'debranges-hb-downstream-conditional-theorem',
  hypothesis: 'K_a >= 0 (UNPROVEN; RH-equivalent; LINK B route refuted).',
  conclusion:
    'E_a is Hermite-Biehler, H(E_a) is a de Branges space, and H(E_a) is the ' +
    'right-endpoint space of a canonical (Hamiltonian) system.',
  statement:
    'IF K_a >= 0 THEN [Step 1: E_a is HB (Thm 23)] => [Step 2: H(E_a) is a ' +
    'de Branges space (Thm 19-22)] => [Step 3: H(E_a) carries a canonical-system ' +
    'structure (Thm 37-40)]. Each arrow is standard, rigorous de Branges ' +
    'machinery; the ONLY non-rigorous element is the antecedent K_a >= 0.',
  whatThisDoesNotEstablish:
    'It does NOT establish K_a >= 0, RH, or any new Lambda bound. The chain is ' +
    'vacuously available the moment K_a >= 0 is granted; granting it is the ' +
    'entire open problem (and the LINK B derivation of it from ||V|| <= 1 is ' +
    'refuted, so this conditional carries no NEW route to the antecedent).',
  honestPartialClosure: true,
});

// ---------------------------------------------------------------------------
//  Overall verdict
// ---------------------------------------------------------------------------

const OVERALL = Object.freeze({
  finalVerdict:
    'downstream-de-branges-chain-verified-as-clean-conditional-on-unproven-K_a-nonneg',
  summary: Object.freeze([
    'Step 1 (K_a >= 0 => E_a HB): rigorous textbook biconditional, de Branges Thm 23.',
    'Step 2 (E_a HB => H(E_a) de Branges space): rigorous, de Branges Thm 19-22.',
    'Step 3 (H(E_a) => canonical system): rigorous, de Branges Thm 37-40 / Remling.',
    'ANTECEDENT K_a >= 0: UNPROVEN, RH-equivalent, asserted NOWHERE in this module.',
    'LINK B (the only claimed derivation of K_a >= 0 from ||V|| <= 1) is REFUTED; ' +
      'this conditional adds no new route to the antecedent.',
  ]),
  claimsKaNonneg: false,
  collapseConfirmed: false,
  sotaUnchanged:
    'Platt-Trudgian Lambda <= 0.2 remains the rigorous SOTA; this does not move it.',
});

const HONEST_SCOPE = Object.freeze([
  'Training-time de Branges / canonical-systems theory only (de Branges 1968 ' +
    'Thm 23, 19-22, 37-40; Remling 2018). Citations recalled, not freshly ' +
    'verified against the texts.',
  'This is the legitimately-rigorous standard-machinery half of the Section-27 ' +
    'program. The antecedent K_a >= 0 is NOT proved here and is RH-equivalent.',
  'No numerics: a structural conditional-theorem record, not an experiment.',
  'The module is deliberately constructed so that K_a >= 0 appears ONLY as a ' +
    'hypothesis (ANTECEDENT.assertedHere === false, OVERALL.claimsKaNonneg === ' +
    'false), enforced by a tripwire below. No false QED.',
]);

const CROSS_REFERENCES = Object.freeze([
  Object.freeze({
    ticket: 'section27-identity-refutation-2026-06-17',
    role: 'Names this surviving downstream chain as "genuine but downstream"; refutes LINK B.',
    path: 'src/data/section27-identity-refutation-2026-06-17.js',
  }),
  Object.freeze({
    ticket: 'imp-2664',
    role: 'Independent re-derivation: Phi-uniform LINK B refuted via scale obstruction.',
    path: 'src/data/imp-2664-section27-identity-rederivation.js',
  }),
  Object.freeze({
    ticket: 'imp-1219',
    role: 'Section-25-27 structured record (A_a/B_a gauges, Wronskian, K_a definition).',
    path: 'src/data/hidden-square-program-section.js',
  }),
]);

export const IMP_2695_DEBRANGES_HB_DOWNSTREAM_VERIFY = Object.freeze({
  id: 'imp-2695-debranges-hb-downstream-verify',
  ticket: 'imp-2695',
  verifyDate: '2026-06-25',
  verifiedByModel: 'opus-4-8',
  channel: 'api-pool',
  paperSourcePath: PAPER_REF,
  antecedent: ANTECEDENT,
  step1: STEP1_KERNEL_TO_HB,
  step2: STEP2_HB_TO_SPACE,
  step3: STEP3_SPACE_TO_CANONICAL,
  conditionalTheorem: CONDITIONAL_THEOREM,
  overall: OVERALL,
  honestScope: HONEST_SCOPE,
  crossReferences: CROSS_REFERENCES,
});

export default IMP_2695_DEBRANGES_HB_DOWNSTREAM_VERIFY;

// ---------------------------------------------------------------------------
//  Tripwires
// ---------------------------------------------------------------------------

export const IMP_2695_DEBRANGES_HB_DOWNSTREAM_VERIFY_ASSERTIONS = [
  {
    id: 'imp2695-three-downstream-steps-conditional-and-cited',
    why:
      'The three downstream steps (Thm 23; Thm 19-22; Thm 37-40) must each be ' +
      'recorded as conditional (on the antecedent) and carry a de Branges citation.',
    holds: () =>
      STEP1_KERNEL_TO_HB.conditional === true &&
      STEP2_HB_TO_SPACE.conditional === true &&
      STEP3_SPACE_TO_CANONICAL.conditional === true &&
      /Theorem 23/.test(STEP1_KERNEL_TO_HB.citation) &&
      /Theorems 19-22/.test(STEP2_HB_TO_SPACE.citation) &&
      /Theorems 37-40/.test(STEP3_SPACE_TO_CANONICAL.citation),
  },
  {
    id: 'imp2695-step1-is-hb-via-kernel-positivity',
    why:
      'Step 1 must be exactly the de Branges Thm 23 kernel-positivity ' +
      'characterization of the Hermite-Biehler class.',
    holds: () => {
      const t = JSON.stringify(STEP1_KERNEL_TO_HB);
      return (
        /Hermite-Biehler/.test(t) &&
        /nonnegative|PSD/.test(t) &&
        STEP1_KERNEL_TO_HB.bidirectional === true
      );
    },
  },
  {
    id: 'imp2695-antecedent-unproven-and-RH-equivalent',
    why:
      'The antecedent K_a >= 0 must be recorded UNPROVEN and RH-equivalent, with ' +
      'its LINK B derivation noted as refuted.',
    holds: () => {
      const t = JSON.stringify(ANTECEDENT);
      return (
        /UNPROVEN/.test(ANTECEDENT.status) &&
        /RH-equivalent/.test(t) &&
        /REFUTED/.test(t) &&
        ANTECEDENT.assertedHere === false
      );
    },
  },
  {
    id: 'imp2695-conditional-theorem-states-hypothesis-and-non-establishment',
    why:
      'The clean conditional theorem must name K_a >= 0 as hypothesis and ' +
      'explicitly disclaim establishing K_a >= 0 / RH / any new bound.',
    holds: () => {
      const t = JSON.stringify(CONDITIONAL_THEOREM);
      return (
        /K_a >= 0/.test(CONDITIONAL_THEOREM.hypothesis) &&
        /UNPROVEN/.test(CONDITIONAL_THEOREM.hypothesis) &&
        /does NOT establish/.test(CONDITIONAL_THEOREM.whatThisDoesNotEstablish) &&
        CONDITIONAL_THEOREM.honestPartialClosure === true
      );
    },
  },
  {
    id: 'imp2695-module-nowhere-claims-K_a-nonneg',
    why:
      'MANDATORY honesty tripwire: the module must nowhere claim K_a >= 0 as ' +
      'established. Enforced via explicit flags AND a scan that no step verdict ' +
      'marks the antecedent proved.',
    holds: () => {
      const proved =
        ANTECEDENT.assertedHere !== false ||
        OVERALL.claimsKaNonneg !== false ||
        /K_a >= 0 (is )?(proved|established|holds|verified)/i.test(
          JSON.stringify(IMP_2695_DEBRANGES_HB_DOWNSTREAM_VERIFY),
        );
      return proved === false;
    },
  },
  {
    id: 'imp2695-honest-overall-not-collapse-sota-unchanged',
    why:
      'Honest framing: a conditional downstream verification, NOT a confirmed ' +
      'collapse, and SOTA is unchanged.',
    holds: () =>
      OVERALL.collapseConfirmed === false &&
      OVERALL.claimsKaNonneg === false &&
      /Platt-Trudgian/.test(OVERALL.sotaUnchanged) &&
      OVERALL.summary.length >= 5,
  },
];

for (const a of IMP_2695_DEBRANGES_HB_DOWNSTREAM_VERIFY_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-2695-debranges-hb-downstream-verify assertion failed: ${a.id}`);
  }
}
