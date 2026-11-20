// @module data/imp-2695-debranges-hb-downstream-verify
//
// Historical imp-2695 record (2026-06-25): the downstream chain was described
// as verified conditional on K_a >= 0. That unrestricted first implication is
// withdrawn: PSD supplies only |E#| <= |E|, not strict Hermite-Biehler (HB).
// A zero kernel and a nonzero rank-one kernel with a common upper-half-plane
// zero give exact counterexamples below. Neither is a claim about Riemann Phi.
//
// The source sign convention and the unproved/no-RH flags are preserved.
// Downstream space/realization statements now require explicitly established
// strict HB and the applicable realization hypotheses; these are not supplied
// merely by PSD. Fast decay alone does not imply finite exponential type.
//
// HISTORICAL REFERENCES: de Branges, Hilbert Spaces of Entire Functions (1968),
// Thm 23, 19-22, 37-40; Remling, Spectral Theory of Canonical Systems (2018),
// Ch. 5-6. These theorem numbers were recalled, not freshly verified against
// the texts. They are not offered as verification of the withdrawn claim.
// No numerical research computation or new RH / Lambda bound is asserted.

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
    'The historical program records K_a >= 0 for Riemann Phi as RH-equivalent; ' +
    'that equivalence is not proved here. The program attempt to derive it from ' +
    'a bound, LINK B (||V|| <= 1 <=> K_a >= 0), is ' +
    'REFUTED as a Phi-uniform equivalence (section27-identity-refutation-2026-06-17; ' +
    'independently re-derived in imp-2664 via the scale-degree obstruction). So ' +
    'this module takes K_a >= 0 strictly as a HYPOTHESIS and derives only its ' +
    'consequences.',
  assertedHere: false,
});

// ---------------------------------------------------------------------------
//  STEP 1: PSD gives a weak inequality; strict HB needs a further condition
// ---------------------------------------------------------------------------

const KERNEL_SCOPE = Object.freeze({
  assumptions: 'A and B real entire; E=A-iB and E#=A+iB; Im(z)>0.',
  diagonalIdentity: 'K(z,z) = (|E(z)|^2 - |E#(z)|^2) / (4*pi*Im(z)).',
  weakConclusion: 'Kernel PSD implies |E#(z)| <= |E(z)| in the upper half-plane.',
  strictCriterion:
    'K(z,z)>0 at every upper-half-plane point is equivalent to |E#(z)|<|E(z)| ' +
    'there, and excludes zeros of E there. This strict diagonal condition must ' +
    'be supplied, not inferred from PSD.',
  gramBoundary:
    'Strict diagonal positivity is not strict positive definiteness of every ' +
    'finite Gram matrix: A=1,B=z has the rank-one kernel K=1/pi and is strict HB.',
  commonZeroBoundary:
    'Excluding only E identically zero, or only the zero kernel, is insufficient. ' +
    'Any alternative nondegeneracy/common-zero hypotheses need a separate proof.',
  validDirection:
    'For a strict HB function with the stated kernel convention, the kernel is PSD. ' +
    'The failed assertion is the unrestricted converse.',
});

const COUNTEREXAMPLES = Object.freeze([
  Object.freeze({
    id: 'constant-zero-kernel',
    aCoefficients: Object.freeze([1]),
    bCoefficients: Object.freeze([0]),
    kernel: 'K(w,z)=0',
    failure: 'E=E#=1: PSD holds but the strict HB inequality fails everywhere.',
  }),
  Object.freeze({
    id: 'common-upper-half-plane-zero',
    aCoefficients: Object.freeze([1, 0, 1]),
    bCoefficients: Object.freeze([0, 1, 0, 1]),
    kernel: 'K(w,z)=g(z)*conj(g(w))/pi, g(z)=z^2+1',
    quadraticForm: 'sum(conj(c_i)*K(z_i,z_j)*c_j)=|sum(c_j*g(z_j))|^2/pi >= 0',
    commonZero: Object.freeze({ re: 0, im: 1 }),
    failure: 'The nonzero rank-one PSD kernel has E(i)=E#(i)=0, so strict HB fails.',
  }),
]);

const VALID_MODEL = Object.freeze({
  aCoefficients: Object.freeze([1]),
  bCoefficients: Object.freeze([0, 1]),
  kernel: 'K(w,z)=1/pi',
  hb: 'E(z)=1-iz, E#(z)=1+iz; |E|^2-|E#|^2=4*Im(z)>0.',
  rank: 1,
});

const GROWTH_SCOPE = Object.freeze({
  compactSupport: 'Compact support of the integrable density gives a finite-exponential-type bound.',
  fastDecay: 'Fast decay alone does not imply finite exponential type.',
  gaussian:
    'For Phi(u)=exp(-u^2), the displayed gauges give ' +
    'E_a(z)=(sqrt(pi)/2)*exp((a-iz)^2/4).',
  imaginaryAxis:
    'For fixed a>0, E_a(iy)=(sqrt(pi)/2)*exp((a+y)^2/4); quadratic exponential ' +
    'growth exceeds C*exp(tau*y) for every fixed C,tau as y grows.',
  limitation:
    'No general Polya-class membership or theorem-application hypotheses are ' +
    'established by the old compact-support / fast-decay shorthand.',
});

const STEP1_KERNEL_TO_HB = Object.freeze({
  id: 'step1-K_a-nonneg-implies-E_a-HB',
  claim: 'K_a >= 0 alone gives a weak inequality, not strict Hermite-Biehler.',
  conditional: true,
  citation: 'Historical citation: de Branges 1968, Theorem 23; exact hypotheses not freshly verified.',
  explicitArgument: Object.freeze([
    KERNEL_SCOPE.diagonalIdentity,
    KERNEL_SCOPE.weakConclusion,
    KERNEL_SCOPE.strictCriterion,
    'A=1,B=0 and A=z^2+1,B=z(z^2+1) refute the unrestricted converse. ' +
      'Both are real-entire even/odd polynomial pairs of finite exponential type.',
    KERNEL_SCOPE.validDirection,
    GROWTH_SCOPE.fastDecay,
  ]),
  bidirectional: false,
  verdict: 'corrected-PSD-alone-insufficient-for-strict-HB',
});

// ---------------------------------------------------------------------------
//  STEP 2: E_a HB  =>  H(E_a) is a de Branges space        [de Branges Thm 19-22]
// ---------------------------------------------------------------------------

const STEP2_HB_TO_SPACE = Object.freeze({
  id: 'step2-E_a-HB-implies-de-branges-space',
  claim: 'Given explicitly established strict HB, the de Branges-space construction is available.',
  conditional: true,
  citation: 'Historical citation: de Branges 1968, Theorems 19-22; exact hypotheses not freshly verified.',
  explicitArgument: Object.freeze([
    'Assume E_a is strict HB; the corrected Step 1 does not supply this from PSD alone.',
    'The usual construction selects entire f for which f/E_a and f#/E_a are in ' +
      'H^2 of the upper half-plane, with inner product integral f(x)conj(g(x))/|E_a(x)|^2 dx.',
    'The de Branges-space and reproducing-kernel statements are conditional on ' +
      'that construction and its applicable hypotheses, not a new verification here.',
  ]),
  verdict: 'conditional-on-explicit-strict-HB-and-construction-hypotheses',
});

// ---------------------------------------------------------------------------
//  STEP 3: H(E_a)  =>  canonical-system (Hamiltonian) structure
//          [de Branges Thm 37-40 / Remling Ch. 5-6]
// ---------------------------------------------------------------------------

const STEP3_SPACE_TO_CANONICAL = Object.freeze({
  id: 'step3-de-branges-space-implies-canonical-system',
  claim:
    'A canonical-system realization is a further conditional step requiring ' +
    'the applicable ordering/realization hypotheses and normalization conventions.',
  conditional: true,
  citation: 'Historical citations: de Branges 1968, Theorems 37-40; Remling 2018, Ch. 5-6.',
  explicitArgument: Object.freeze([
    'Start with a valid de Branges space, not with an unqualified PSD kernel.',
    'Supply the hypotheses of the relevant realization theorem before asserting ' +
      'an endpoint system, a Hamiltonian, trace normalization or uniqueness.',
    'This record does not check those hypotheses or freshly verify the cited ' +
      'theorem numbers. PSD alone does not establish this complete chain.',
  ]),
  verdict: 'conditional-on-applicable-realization-hypotheses',
});

// ---------------------------------------------------------------------------
//  CORRECTED CONDITIONAL SCOPE (not a verified PSD-to-realization chain)
// ---------------------------------------------------------------------------

const CONDITIONAL_THEOREM = Object.freeze({
  id: 'debranges-hb-downstream-conditional-theorem',
  hypothesis:
    'K_a >= 0 remains UNPROVEN and is not sufficient by itself for strict HB. ' +
    'Explicit strict HB and applicable construction/realization hypotheses must be supplied.',
  conclusion:
    'Only after those additional hypotheses are established may the ' +
    'de Branges-space and canonical-system conclusions be invoked.',
  statement:
    'PSD gives the weak diagonal inequality. Strict diagonal positivity ' +
    'at every upper-half-plane point yields strict HB; PSD alone does not. ' +
    'The downstream space and realization statements remain conditional on ' +
    'their explicitly applicable hypotheses.',
  whatThisDoesNotEstablish:
    'It does NOT establish K_a >= 0, strict HB for the Riemann kernel, RH, ' +
    'or any new Lambda bound. The old unrestricted first implication is withdrawn.',
  honestPartialClosure: false,
});

// ---------------------------------------------------------------------------
//  Overall verdict
// ---------------------------------------------------------------------------

const OVERALL = Object.freeze({
  finalVerdict: 'corrected-missing-strictness-and-realization-hypotheses',
  summary: Object.freeze([
    'Step 1: PSD implies only the weak HB inequality; the unrestricted converse claim is withdrawn.',
    'Strict diagonal positivity at every upper point gives strict HB, not strict PD of every Gram matrix.',
    'Step 2 requires explicitly established strict HB and the applicable space construction.',
    'Step 3 requires applicable canonical-system realization hypotheses and conventions.',
    'ANTECEDENT K_a >= 0 remains UNPROVEN and is asserted NOWHERE in this module.',
    'LINK B remains refuted; this correction supplies no new route to the antecedent.',
  ]),
  claimsKaNonneg: false,
  collapseConfirmed: false,
  sotaUnchanged:
    'Historical 2026-06-25 benchmark citation: Platt-Trudgian Lambda <= 0.2. ' +
    'No freshly verified current benchmark or new bound is asserted.',
});

const HONEST_SCOPE = Object.freeze([
  'The original citations were recalled, not freshly verified against the texts; ' +
    'no corrected theorem numbering is invented here.',
  'The historical verification date and attribution are retained as provenance, ' +
    'not as current verification of the unrestricted first implication.',
  'The counterexamples address arbitrary real-entire A,B, not the particular Riemann Phi.',
  'No numerical research computation, new positivity theorem for Riemann Phi, or RH proof.',
  'ANTECEDENT.assertedHere, OVERALL.claimsKaNonneg and OVERALL.collapseConfirmed remain false.',
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
  currentStatus: Object.freeze({
    status: 'CORRECTED-MISSING-HYPOTHESES',
    correctionDate: '2026-11-01',
    historicalVerdict: 'downstream-de-branges-chain-verified-as-clean-conditional-on-unproven-K_a-nonneg',
    notice: 'The historical unrestricted PSD-to-strict-HB verification is withdrawn.',
  }),
  kernelScope: KERNEL_SCOPE,
  counterexamples: COUNTEREXAMPLES,
  validModel: VALID_MODEL,
  growthScope: GROWTH_SCOPE,
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
      'Preserve historical citations while keeping each step explicitly conditional; ' +
      'these strings are provenance checks, not theorem verification.',
    holds: () =>
      STEP1_KERNEL_TO_HB.conditional === true &&
      STEP2_HB_TO_SPACE.conditional === true &&
      STEP3_SPACE_TO_CANONICAL.conditional === true &&
      /Theorem 23/.test(STEP1_KERNEL_TO_HB.citation) &&
      /Theorems 19-22/.test(STEP2_HB_TO_SPACE.citation) &&
      /Theorems 37-40/.test(STEP3_SPACE_TO_CANONICAL.citation),
  },
  {
    id: 'imp2695-PSD-alone-is-not-strict-HB',
    why:
      'The corrected first step must not reintroduce the unrestricted PSD/strict-HB biconditional.',
    holds: () => {
      const t = JSON.stringify(STEP1_KERNEL_TO_HB);
      return (
        /Hermite-Biehler/.test(t) &&
        /nonnegative|PSD/.test(t) &&
        STEP1_KERNEL_TO_HB.bidirectional === false
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
      'The corrected scope must retain the unproved antecedent and explicitly ' +
      'disclaim establishing K_a >= 0 / RH / any new bound.',
    holds: () => {
      const t = JSON.stringify(CONDITIONAL_THEOREM);
      return (
        /K_a >= 0/.test(CONDITIONAL_THEOREM.hypothesis) &&
        /UNPROVEN/.test(CONDITIONAL_THEOREM.hypothesis) &&
        /does NOT establish/.test(CONDITIONAL_THEOREM.whatThisDoesNotEstablish) &&
        CONDITIONAL_THEOREM.honestPartialClosure === false
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
      'Honest framing: missing hypotheses, no confirmed collapse, and only a dated benchmark citation.',
    holds: () =>
      OVERALL.collapseConfirmed === false &&
      OVERALL.claimsKaNonneg === false &&
      /Historical 2026-06-25/.test(OVERALL.sotaUnchanged) &&
      /Platt-Trudgian/.test(OVERALL.sotaUnchanged) &&
      OVERALL.summary.length >= 5,
  },
  {
    id: 'imp2695-correction-keeps-both-counterexamples-and-valid-model',
    why: 'Both degeneracy failures and the valid rank-one strict-HB model must remain explicit.',
    holds: () => COUNTEREXAMPLES.length === 2 &&
      COUNTEREXAMPLES[0].id === 'constant-zero-kernel' &&
      COUNTEREXAMPLES[1].commonZero.im === 1 && VALID_MODEL.rank === 1,
  },
  {
    id: 'imp2695-growth-and-strict-diagonal-scope',
    why: 'Do not infer finite exponential type from fast decay or strict Gram PD from strict HB.',
    holds: () => /does not imply/.test(GROWTH_SCOPE.fastDecay) &&
      /not strict positive definiteness/.test(KERNEL_SCOPE.gramBoundary) &&
      /must.*supplied/.test(KERNEL_SCOPE.strictCriterion),
  },
];

for (const a of IMP_2695_DEBRANGES_HB_DOWNSTREAM_VERIFY_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-2695-debranges-hb-downstream-verify assertion failed: ${a.id}`);
  }
}
