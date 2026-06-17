// @module data/imp-2664-section27-identity-rederivation
//
// imp-2664 (CRITICAL, proof, opus-4-8/subscription) -- INDEPENDENT re-derivation
// of the SOLE load-bearing Section-27 paper-construct on which the PCC-free
// Volterra/Conj-27.2 collapse rests:
//
//     [[I, V_{a,Phi}], [V_{a,Phi}^#, I]] >= 0    <=>    K_a >= 0
//
// (V^# denotes the Hilbert-space adjoint of V; "#" used to avoid the JSDoc
//  comment-terminator hazard.) Both collapse directions pass through it
// (imp-1258 forward step 3, reverse step 4). Prior records DISAGREE:
//   - imp-1258 two-way-collapse  : equivalence accepted ("paper-construct").
//   - imp-1265 collapse-with-caveats: forward OK, reverse salvaged by
//                                      Arov-Nudelman 1996 (ASYMMETRIC).
//   - section27-identity-refutation-2026-06-17: BOTH arrows REFUTED as a
//                                      Phi-uniform equivalence (scale obstruction),
//                                      plus a sign-bug in the K_a numerator.
//
// The ticket demands: re-derive from the Section-25 commutator decomposition +
// Section-26 measure-domination chain, in BOTH directions, with the EXPLICIT
// operator algebra (do NOT accept "paper says so"). Output a confirmed
// re-derivation OR a precisely-located gap. Maximal skepticism.
//
// This module does NOT modify imp-1258, imp-1265, or the refutation. It is an
// independent operator-algebra audit; the orchestrator decides downstream edits.
//
// METHOD: training-time operator theory only (Schur complement / Bhatia 1997;
// Sz.-Nagy-Foias 1970 characteristic-function bijection; de Branges 1968
// reproducing-kernel / Hermite-Biehler theory). No PDF browsing beyond the
// structured Section-25-27 records (hidden-square-program-section.js, imp-1219).

const PAPER_REF = 'research-inputs/twin_ladder_consolidated_v52.pdf Sections 25-27';

// ---------------------------------------------------------------------------
//  SETUP (gauges, per imp-1265 / imp-1219)
// ---------------------------------------------------------------------------
//   A_a(z) = int_0^inf Phi(u) cosh(au) cos(zu) du           (cosine gauge, real part)
//   B_a(z) = int_0^inf Phi(u) sinh(au) sin(zu) du           (sine gauge, imag part)
//   E_a    = A_a - i B_a,   E_a^#  = A_a + i B_a             (HB candidate + Krein adjoint)
//   K_a(w,z) = de Branges reproducing kernel of H(E_a)
//   (V_{a,Phi} f)(t) = int_0^t Phi(t) Phi(s) sinh(a(t-s)) f(s) ds   on L^2([0,inf))

// ---------------------------------------------------------------------------
//  LINK A: block positivity <=> ||V|| <= 1     [Schur complement; both directions]
// ---------------------------------------------------------------------------

const LINK_A_SCHUR = Object.freeze({
  id: 'link-a-block-positivity-iff-contraction',
  claim: '[[I, V], [V^#, I]] >= 0  <=>  ||V|| <= 1   (any bounded V on a Hilbert space)',
  explicitAlgebra: Object.freeze([
    'M = [[I, V], [V^#, I]] acts on H (+) H. The (1,1) block is I > 0, so M >= 0 ' +
      'iff its Schur complement w.r.t. the (1,1) block is >= 0.',
    'Schur complement S = I - V^# (I)^{-1} V = I - V^# V. Hence M >= 0 <=> I - V^# V >= 0.',
    'I - V^# V >= 0  <=>  V^# V <= I  <=>  ||V||^2 = ||V^# V|| <= 1  <=>  ||V|| <= 1.',
    'Equivalent quadratic-form route (imp-1265 axis-b): <M(f,g),(f,g)> = ' +
      '||f||^2 + ||g||^2 + 2 Re<Vg,f> >= (||f|| - ||V|| ||g||)^2 + (1 - ||V||^2)||g||^2, ' +
      'which is >= 0 for all (f,g) iff ||V|| <= 1.',
  ]),
  bidirectional: true,
  references: 'Bhatia 1997 Prop 1.3.2; Paulsen 2002 Lemma 3.1 (Schur complement).',
  verdict: 'pass',
  verdictRationale:
    'LINK A is a genuine textbook biconditional, both directions, for ANY bounded ' +
    'V. No Hilbert-Schmidt / compactness needed. Confirms imp-1265 axis-b and the ' +
    'refutation LINK-A finding. This half is not in dispute.',
});

// ---------------------------------------------------------------------------
//  SCALE OBSTRUCTION: ||V|| <= 1 <=> K_a >= 0 is FALSE as a Phi-uniform statement
//  (independent re-derivation; robust to the K_a-numerator sign bug)
// ---------------------------------------------------------------------------

const SCALE_OBSTRUCTION = Object.freeze({
  id: 'scale-obstruction-no-phi-uniform-biconditional',
  claim:
    'There is NO Phi-uniform biconditional ||V_{a,Phi}|| <= 1 <=> K_a >= 0, because ' +
    'the two sides transform incompatibly under Phi -> c*Phi (c > 0).',
  explicitAlgebra: Object.freeze([
    'DEGREE IN Phi. A_a and B_a are LINEAR functionals of Phi (Phi appears once in ' +
      'each integrand): Phi -> c*Phi gives A_a -> c*A_a, B_a -> c*B_a.',
    'K_a SIDE. The K_a kernel numerator is BILINEAR in (A_a, B_a) -- regardless of ' +
      'WHICH numerator one uses (symmetric A(z)B(w)+B(z)A(w), or the correct ' +
      'antisymmetric Wronskian A(z)B(w)-B(z)A(w)) -- hence DEGREE-2 HOMOGENEOUS in ' +
      'Phi: K_a -> c^2 K_a. Inertia is scale-invariant, so {Phi : K_a >= 0} is a ' +
      'CONE (closed under positive scaling).',
    'V SIDE. The Volterra kernel Phi(t)Phi(s) sinh(a(t-s)) is QUADRATIC in Phi: ' +
      'V -> c^2 V, so ||V|| -> c^2 ||V||. Thus {Phi : ||V|| <= 1} is a scale-BOUNDED ' +
      'sublevel set (NOT a cone: scaling c large enough pushes ||V|| past 1).',
    'CONCLUSION. A scale-invariant cone cannot coincide with a scale-bounded ' +
      'sublevel set (unless one side is trivial). Therefore no Phi-uniform ' +
      'biconditional can hold. This is an algebraic impossibility, NOT a numerical ' +
      'artifact.',
  ]),
  robustToSignBug:
    'CRITICAL: the obstruction uses ONLY that the K_a numerator is bilinear in ' +
    '(A_a, B_a). Both the symmetric form (imp-1265 / imp-1258 / ' +
    'hidden-square-program-section as written) and the correct antisymmetric de ' +
    'Branges Wronskian are bilinear, hence both degree-2 homogeneous. So the ' +
    'scale obstruction is INDEPENDENT of the numerator sign bug flagged by the ' +
    'refutation -- it survives the sign correction.',
  confirmsRefutation: true,
  verdict: 'refuted-as-phi-uniform',
  verdictRationale:
    'Independently re-derived: the AS-STATED Phi-uniform biconditional ' +
    '||V|| <= 1 <=> K_a >= 0 is false by a scaling-degree mismatch (degree-2 ' +
    'homogeneous cone vs scale-bounded sublevel set). This confirms the ' +
    'section27-identity-refutation headline by an argument that does NOT depend ' +
    'on its (sign-bug-suspect) numerical counterexamples.',
});

// ---------------------------------------------------------------------------
//  REFUTATION-NUMERICS AUDIT: the two counterexamples need a sign-corrected recheck
// ---------------------------------------------------------------------------

const REFUTATION_NUMERICS_AUDIT = Object.freeze({
  id: 'refutation-numerics-sign-correction-needed',
  context:
    'section27-identity-refutation-2026-06-17 cites two numerical counterexamples: ' +
    'FORWARD (Phi=exp(-u), a=0.3: ||V||=0.077 but K_a min-eig=-0.024, not PSD) and ' +
    'REVERSE (Gaussian Phi, a=0.3, scaled up: ||V||=5.6 but K_a PSD). It ALSO finds ' +
    'a sign bug: the as-written numerator E(z)E(w)-E^#(z)E^#(w) expands to the ' +
    'SYMMETRIC -2i(A(z)B(w)+B(z)A(w)), whereas the de Branges Wronskian is the ' +
    'ANTISYMMETRIC 2i(A(z)B(w)-B(z)A(w)) coming from E(z)E^#(w)-E^#(z)E(w).',
  explicitSignCheck: Object.freeze([
    'With E = A - iB, E^# = A + iB and arguments z (first) and conj-w (second):',
    'E(z)E^#(w) - E^#(z)E(w) = (A(z)-iB(z))(A(w)+iB(w)) - (A(z)+iB(z))(A(w)-iB(w))',
    '                        = 2i (A(z)B(w) - B(z)A(w))   [ANTISYMMETRIC -- correct].',
    'E(z)E(w) - E^#(z)E^#(w) = -2i (A(z)B(w) + B(z)A(w))  [SYMMETRIC -- imp-1265 form].',
    'The two differ by more than a sign convention; imp-1265 axis-a "cosmetic ' +
      '(z-w) vs (w-z)" dismissal is incorrect, as the refutation states.',
  ]),
  finding:
    'OPEN AUDIT ITEM: the refutation does not record WHICH numerator its two ' +
    'min-eigenvalue computations used. If they used the symmetric (wrong) numerator, ' +
    'the min-eig = -0.024 forward "counterexample" and the reverse PSD claim are ' +
    'computed on the WRONG kernel and do not, by themselves, refute either arrow. ' +
    'They must be recomputed with the antisymmetric Wronskian before being cited as ' +
    'standalone counterexamples.',
  impactOnHeadline:
    'BENIGN for the headline: the scale obstruction (above) refutes the Phi-uniform ' +
    'biconditional WITHOUT any numerics, so the refutation conclusion stands even if ' +
    'the two counterexamples are sign-tainted. The numerics are corroborative, not ' +
    'load-bearing.',
  verdict: 'pass-with-caveats',
});

// ---------------------------------------------------------------------------
//  CHARACTERISTIC-FUNCTION RECONCILIATION: what (if anything) survives, and is it
//  symmetric or asymmetric in the two directions?
// ---------------------------------------------------------------------------

const CHARFUNCTION_RECONCILIATION = Object.freeze({
  id: 'charfunction-reconciliation-symmetric-once-identified',
  question:
    'Granting the scale obstruction kills the Phi-UNIFORM biconditional, does a ' +
    'SCALE-NORMALIZED equivalence survive for the single Riemann Phi, and is it ' +
    'symmetric (both directions together) or asymmetric (imp-1265)?',
  explicitAlgebra: Object.freeze([
    'DE BRANGES SIDE. K_a >= 0 <=> E_a is Hermite-Biehler <=> the phase ' +
      'Theta_a := E_a^# / E_a is a Schur function in C_+ (|Theta_a| <= 1, Im z > 0). ' +
      'Bidirectional (de Branges 1968 Thm 23).',
    'OPERATOR SIDE. For a completely-non-unitary contraction V (||V|| <= 1), the ' +
      'Sz.-Nagy-Foias characteristic function Theta_V(lam) = ' +
      '[ -V + lam D_{V^#} (I - lam V^#)^{-1} D_V ] |_{defect}, with defect operators ' +
      'D_V = (I - V^# V)^{1/2}, D_{V^#} = (I - V V^#)^{1/2}, is a contractive ' +
      '(Schur) analytic function on the disk; ||V|| <= 1 <=> Theta_V well-defined ' +
      'and contractive. Bidirectional (Sz.-Nagy-Foias 1970).',
    'THE BRIDGE. Under the Cayley map disk <-> half-plane, the scale-normalized ' +
      'biconditional ||V|| <= 1 <=> K_a >= 0 is EQUIVALENT to the IDENTIFICATION ' +
      'Theta_V = Theta_a (the V-colligation characteristic function equals the ' +
      'de Branges phase). The colligation <-> characteristic-function correspondence ' +
      'is itself bidirectional (Brodskii / Sz.-Nagy-Foias model).',
    'CONSEQUENCE. ONCE the identification Theta_V = Theta_a holds, BOTH directions ' +
      'of LINK B hold SIMULTANEOUSLY; if it fails, both fail. The equivalence is ' +
      'SYMMETRIC in the two directions -- it is not "forward via Section-26, reverse ' +
      'via Arov-Nudelman".',
  ]),
  reconcilesPriorVerdicts:
    'This dissolves the imp-1265 / refutation tension. imp-1265 saw an ASYMMETRY ' +
    '(forward argued, reverse needs Arov-Nudelman) -- but that asymmetry is an ' +
    'ARTIFACT of Section-27 writing down only the forward measure-domination ' +
    '(Conj 26.3, mu^pass >= nu); the underlying object (the characteristic-function ' +
    'identification) is symmetric. The refutation saw BOTH arrows fail -- correct ' +
    'for the Phi-UNIFORM reading, because no single Theta_a can be the char function ' +
    'of a scale-family of operators c^2 V. The two findings are consistent: the ' +
    'genuine equivalence is scale-NORMALIZED and symmetric, and rests on ONE ' +
    'identification, not on a direction-dependent chain.',
  verdict: 'pass',
});

// ---------------------------------------------------------------------------
//  THE PRECISELY-LOCATED GAP
// ---------------------------------------------------------------------------

const THE_GAP = Object.freeze({
  id: 'gap-charfunction-identification-theta-V-equals-theta-a',
  statement:
    'The single load-bearing UNVERIFIED statement is the rank-one-defect ' +
    'characteristic-function identification, at the correct Phi-normalization c*: ' +
    'Theta_{V_{a, c* Phi}} = E_a^# / E_a. This is exactly: (i) the Section-25 ' +
    'commutator decomposition exhibiting D_V, D_{V^#} as RANK-ONE with the A_a / ' +
    'B_a gauges as the colligation defect data, and (ii) the Section-26 ' +
    'measure-domination Conj 26.3 (mu^pass >= nu) fixing the scale c* (the passivity ' +
    'inequality that reconciles degree-2-homogeneous K_a with the non-homogeneous ' +
    'I - V V^#).',
  whyItIsTheWholeGame:
    'Given LINK A (Schur, proved), the de Branges side (Thm 23, proved), and the ' +
    'Sz.-Nagy-Foias side (proved), the ENTIRE residual content of the Section-15-27 ' +
    'collapse is this one identification. If it is established operator-algebraically ' +
    'for the Riemann Phi, the 7+ conjecture collapse genuinely reduces to the single ' +
    'bound ||V_{a, c* Phi}|| <= 1 (Conj 27.2 at the pinned scale). If not, the ' +
    'collapse has no rigorous content beyond the textbook de Branges machinery ' +
    'applied to the UNPROVEN hypothesis K_a >= 0.',
  status:
    'OPEN -- NOT independently established here. The structured Section-25 record ' +
    '(hidden-square-program-section.js) ASSERTS the commutator decomposition and the ' +
    'rank-one defect structure but does not derive them operator-algebraically; the ' +
    'rank-one-defect claim in particular is unverified. This is the same narrow ' +
    'target as THE_REAL_GAP in section27-identity-refutation-2026-06-17.',
  sameAsRefutationRealGap: true,
});

// ---------------------------------------------------------------------------
//  Overall verdict
// ---------------------------------------------------------------------------

const OVERALL = Object.freeze({
  finalVerdict: 'phi-uniform-biconditional-refuted-scale-normalized-equivalence-reduces-to-one-open-identification',
  summary: Object.freeze([
    'LINK A (block positivity <=> ||V|| <= 1): PROVED, both directions (Schur).',
    'Phi-UNIFORM LINK B (||V|| <= 1 <=> K_a >= 0): REFUTED, robustly (scale-degree ' +
      'mismatch; independent of the numerator sign bug).',
    'SCALE-NORMALIZED LINK B: reduces -- BOTH directions together, symmetrically -- ' +
      'to the single characteristic-function identification Theta_V = Theta_a ' +
      '(Section-25 rank-one commutator decomposition + Section-26 domination).',
    'That identification is OPEN; not independently established here. So the ' +
      'collapse is CONDITIONAL on it. No verified Section-27 biconditional.',
    'AUDIT: the refutation numerical counterexamples need a sign-corrected ' +
      '(antisymmetric Wronskian) recheck; the scale headline survives without them.',
  ]),
  reconciliationOfPriorRecords: Object.freeze({
    'imp-1258 (two-way-collapse)':
      'OVERSTATED: accepts the biconditional as a paper-construct; the Phi-uniform ' +
      'reading is false and the scale-normalized reading rests on an open identification.',
    'imp-1265 (collapse-with-caveats, asymmetric)':
      'The asymmetry is an ARTIFACT of Section-27 writing only the forward ' +
      'domination; the genuine object is symmetric (both directions on one identification).',
    'section27-identity-refutation (both arrows refuted)':
      'CORRECT for the Phi-uniform reading; this module re-derives that headline ' +
      'independently AND flags that its numerics need a sign-corrected recheck.',
  }),
  honestPartialClosure: true,
  collapseConfirmed: false,
  sotaUnchanged: 'Platt-Trudgian Lambda <= 0.2 remains the rigorous SOTA; this does not move it.',
});

const HONEST_SCOPE = Object.freeze([
  'Training-time operator theory only (Bhatia 1997 / Paulsen 2002 Schur; ' +
    'Sz.-Nagy-Foias 1970 characteristic functions; de Branges 1968; Brodskii ' +
    'colligation model). Citations recalled, not freshly verified against the texts.',
  'The scale obstruction and LINK A are rigorous first-principles derivations. The ' +
    'characteristic-function reconciliation is a structural argument: it shows WHERE ' +
    'the genuine content sits (one identification), it does NOT establish that ' +
    'identification for the Riemann Phi.',
  'THE_GAP (Theta_V = Theta_a, rank-one defect) is NOT closed here. The Section-25 ' +
    'rank-one-defect claim is the specific unverified operator-algebra step; the ' +
    'structured record asserts but does not derive it.',
  'PCC is not addressed: per strategic-reframe-pcc-free-volterra-2026-06-17 the ' +
    '27.2 route is PCC-free, so this gap is operator-theoretic, not pair-correlation.',
  'Maximal skepticism was applied: the module went looking to BREAK the equivalence ' +
    'and found the Phi-uniform form genuinely broken, the scale-normalized form ' +
    'reduced to a single open identification, and a sign-correction audit item in ' +
    'the prior refutation numerics. No false QED.',
]);

const CROSS_REFERENCES = Object.freeze([
  Object.freeze({ ticket: 'imp-1258', role: 'Parent two-way collapse (LINK B steps 3/4); OVERSTATED per this audit.', path: 'src/data/imp-1258-volterra-cdb-bridge.js' }),
  Object.freeze({ ticket: 'imp-1265', role: 'Prior recheck (collapse-with-caveats, asymmetric); asymmetry shown to be an artifact.', path: 'src/data/imp-1265-section27-identity-recheck.js' }),
  Object.freeze({ ticket: 'section27-identity-refutation-2026-06-17', role: 'Refutation (both arrows, scale obstruction + sign bug); headline re-derived, numerics flagged.', path: 'src/data/section27-identity-refutation-2026-06-17.js' }),
  Object.freeze({ ticket: 'strategic-reframe-pcc-free-volterra-2026-06-17', role: 'PCC-free reframe naming GAP-1 (this identity).', path: 'src/data/strategic-reframe-pcc-free-volterra-2026-06-17.js' }),
  Object.freeze({ ticket: 'imp-1219', role: 'Section-25-27 structured record (Wronskian, A_a/B_a gauges, commutator).', path: 'src/data/hidden-square-program-section.js' }),
]);

export const IMP_2664_SECTION27_IDENTITY_REDERIVATION = Object.freeze({
  id: 'imp-2664-section27-identity-rederivation',
  ticket: 'imp-2664',
  auditDate: '2026-06-17',
  auditedByModel: 'opus-4-8',
  channel: 'subscription',
  paperSourcePath: PAPER_REF,
  identityUnderTest: '[[I, V_{a,Phi}], [V_{a,Phi}^#, I]] >= 0  <=>  K_a >= 0',
  linkA: LINK_A_SCHUR,
  scaleObstruction: SCALE_OBSTRUCTION,
  refutationNumericsAudit: REFUTATION_NUMERICS_AUDIT,
  charFunctionReconciliation: CHARFUNCTION_RECONCILIATION,
  theGap: THE_GAP,
  overall: OVERALL,
  honestScope: HONEST_SCOPE,
  crossReferences: CROSS_REFERENCES,
});

export default IMP_2664_SECTION27_IDENTITY_REDERIVATION;

// ---------------------------------------------------------------------------
//  Tripwires
// ---------------------------------------------------------------------------

export const IMP_2664_SECTION27_IDENTITY_REDERIVATION_ASSERTIONS = [
  {
    id: 'imp2664-link-a-proved-both-directions',
    why:
      'LINK A (block positivity <=> ||V|| <= 1) is a genuine Schur-complement ' +
      'biconditional for any bounded V; it must be recorded as proved, both directions.',
    holds: () =>
      LINK_A_SCHUR.bidirectional === true &&
      LINK_A_SCHUR.verdict === 'pass' &&
      /Schur complement/i.test(JSON.stringify(LINK_A_SCHUR)),
  },
  {
    id: 'imp2664-phi-uniform-biconditional-refuted-by-scale',
    why:
      'The independent re-derivation must conclude the Phi-uniform biconditional is ' +
      'refuted via the degree-2-homogeneous-cone vs scale-bounded-sublevel mismatch.',
    holds: () => {
      const t = JSON.stringify(SCALE_OBSTRUCTION);
      return (
        SCALE_OBSTRUCTION.verdict === 'refuted-as-phi-uniform' &&
        /degree-2 homogeneous/i.test(t) &&
        /cone/i.test(t) &&
        /sublevel/i.test(t)
      );
    },
  },
  {
    id: 'imp2664-scale-obstruction-robust-to-sign-bug',
    why:
      'The key independence claim: the scale obstruction uses only bilinearity of the ' +
      'K_a numerator, so it survives the symmetric-vs-antisymmetric numerator sign bug. ' +
      'This is what makes the re-derivation stronger than the numerics.',
    holds: () =>
      /bilinear/i.test(SCALE_OBSTRUCTION.robustToSignBug) &&
      /INDEPENDENT of the numerator sign bug/i.test(SCALE_OBSTRUCTION.robustToSignBug),
  },
  {
    id: 'imp2664-refutation-numerics-need-sign-correction',
    why:
      'Maximal-skepticism audit of the prior refutation: its two numerical ' +
      'counterexamples must be recomputed with the antisymmetric de Branges Wronskian; ' +
      'the headline survives without them (numerics corroborative, not load-bearing).',
    holds: () => {
      const t = JSON.stringify(REFUTATION_NUMERICS_AUDIT);
      return (
        /antisymmetric/i.test(t) &&
        /recomputed|recheck/i.test(t) &&
        /BENIGN for the headline/i.test(REFUTATION_NUMERICS_AUDIT.impactOnHeadline)
      );
    },
  },
  {
    id: 'imp2664-charfunction-makes-equivalence-symmetric',
    why:
      'The reconciliation finding: once Theta_V = Theta_a holds, both directions hold ' +
      'together (symmetric), dissolving the imp-1265 asymmetry as a Section-27 artifact.',
    holds: () => {
      const t = JSON.stringify(CHARFUNCTION_RECONCILIATION);
      return (
        /SYMMETRIC/i.test(t) &&
        /Theta_V = Theta_a/.test(t) &&
        /artifact/i.test(t) &&
        CHARFUNCTION_RECONCILIATION.verdict === 'pass'
      );
    },
  },
  {
    id: 'imp2664-gap-is-rank-one-charfunction-identification',
    why:
      'The precisely-located gap must be the rank-one-defect characteristic-function ' +
      'identification Theta_V = Theta_a (Section-25 commutator + Section-26 domination), ' +
      'recorded OPEN and identified with the refutation THE_REAL_GAP.',
    holds: () => {
      const t = JSON.stringify(THE_GAP);
      return (
        /rank-one/i.test(t) &&
        /Theta_\{V/.test(t) &&
        /OPEN/i.test(THE_GAP.status) &&
        THE_GAP.sameAsRefutationRealGap === true
      );
    },
  },
  {
    id: 'imp2664-overall-honest-partial-not-confirmed-collapse',
    why:
      'Honest framing: a partial closure (Phi-uniform refuted, scale-normalized reduced ' +
      'to one open identification), NOT a confirmed collapse, and SOTA is unchanged.',
    holds: () =>
      OVERALL.honestPartialClosure === true &&
      OVERALL.collapseConfirmed === false &&
      /Platt-Trudgian/i.test(OVERALL.sotaUnchanged) &&
      OVERALL.summary.length >= 5,
  },
  {
    id: 'imp2664-reconciles-three-prior-records',
    why:
      'The audit must explicitly reconcile imp-1258 (overstated), imp-1265 (asymmetry ' +
      'artifact), and the refutation (correct for Phi-uniform reading) into one coherent picture.',
    holds: () => {
      const keys = Object.keys(OVERALL.reconciliationOfPriorRecords);
      return (
        keys.some((k) => /imp-1258/.test(k)) &&
        keys.some((k) => /imp-1265/.test(k)) &&
        keys.some((k) => /refutation/.test(k))
      );
    },
  },
  {
    id: 'imp2664-cross-references-name-the-four-prior-artifacts',
    why:
      'Audit trail: cross-references must name imp-1258, imp-1265, the refutation, and ' +
      'the strategic reframe (GAP-1 source), plus imp-1219 (Section-25-27 record).',
    holds: () => {
      const ids = IMP_2664_SECTION27_IDENTITY_REDERIVATION.crossReferences.map((c) => c.ticket);
      return (
        ids.some((t) => /imp-1258/.test(t)) &&
        ids.some((t) => /imp-1265/.test(t)) &&
        ids.some((t) => /refutation/.test(t)) &&
        ids.some((t) => /strategic-reframe/.test(t))
      );
    },
  },
  {
    id: 'imp2664-honest-scope-flags-training-time-and-open-gap',
    why:
      'Honest scope must disclose training-time-only methodology and that THE_GAP ' +
      '(rank-one-defect identification) is NOT closed here.',
    holds: () => {
      const s = IMP_2664_SECTION27_IDENTITY_REDERIVATION.honestScope.join(' | ');
      return /training[- ]time/i.test(s) && /NOT closed here/i.test(s) && /rank-one/i.test(s);
    },
  },
];

for (const a of IMP_2664_SECTION27_IDENTITY_REDERIVATION_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-2664-section27-identity-rederivation assertion failed: ${a.id}`);
  }
}
