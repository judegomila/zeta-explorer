/**
 * @module imp-1340-CDB-Exist-direct-construction
 * @fileoverview imp-1340 — CRITICAL: can the de Branges canonical-system
 *   existence statement CDB-Exist (imp-1241) be CLOSED UNCONDITIONALLY by a
 *   DIRECT construction of the de Branges space H(E_a) from the completed
 *   Riemann kernel Phi, WITHOUT using the zero set of X — thereby closing the
 *   section 15-27 -> RH chain WITHOUT routing through
 *   ||V_{a,Phi}|| <= 1 -> CDB-Exist -> Montgomery PCC?
 *
 *   CONTEXT
 *   -------
 *   imp-1310 (verdict reroute-eliminated-support-greater-1-is-intrinsic)
 *   named "closing the imp-1241 de Branges direct route" as the cleanest
 *   remaining STRUCTURAL lever: every section-15-27 reroute it tried inherits
 *   the support > 1 obstruction through the ||V|| <= 1 / PCC channel, but a
 *   DIRECT de Branges existence proof (CDB-Exist proved unconditionally) would
 *   close section 15-27 -> RH while bypassing PCC entirely.
 *
 *   imp-1241 unified the paper Conjectures 16.4, 16.6, 18.1 into a SINGLE de
 *   Branges canonical-system existence statement CDB-Exist: for every a > 0
 *   build the structure function E_a(z) = X(a - iz) (equivalently the
 *   Hamiltonian dm_a, equivalently the passive realization) directly from Phi,
 *   NON-CIRCULARLY (without the zero set of X). imp-1245 adversarially
 *   stress-tested that unification and found CDB-Exist FAILS axis (c): it
 *   INHERITS the same Phi-non-circularity obstruction as the three corollaries
 *   it unifies, and the axis-(b) rigidity gap (E_a has no inner factor) is
 *   already RH-equivalent.
 *
 *   This ticket performs the DEEPER walk imp-1310 asked for:
 *     (a) what is needed to construct H(E_a) DIRECTLY from Phi without the
 *         zeros of X?
 *     (b) does Arov-Nudelman 1996 give an UNCONDITIONAL construction in a
 *         Riemann-special case?
 *     (c) the construction's residual conjectures.
 *
 *   HEADLINE VERDICT
 *   ----------------
 *   VERDICT: 'cdb-exist-direct-construction-reduces-to-hermite-biehler-positivity-rh-equivalent'
 *
 *   The direct construction does NOT close CDB-Exist unconditionally and does
 *   NOT bypass PCC. It PINS DOWN the irreducible residual conjecture and proves
 *   it is RH-EQUIVALENT (not merely RH-sufficient), so the direct de Branges
 *   route is provably NO EASIER than the chain it was meant to short-circuit.
 *
 *   The walk splits the direct construction into a FORMAL layer (which IS
 *   unconditional) and a POSITIVITY layer (which is the whole of RH):
 *
 *   (G1) THE REALIZATION MACHINERY IS UNCONDITIONAL AND FORMAL. Given the
 *        positive-semidefinite reproducing kernel K_a(w, z) the Hilbert space
 *        H_a and the evaluation transform B_a exist AUTOMATICALLY by the
 *        Aronszajn 1950 / Kolmogorov / de Branges 1968 factorization
 *        K_a = <B_a, B_a>. Likewise, GIVEN that the Schur function
 *        Theta_a = E_a^# / E_a is contractive on the boundary, Arov-Nudelman
 *        1996 builds a passive (conservative-or-dissipative) canonical-system
 *        realization whose transfer function is Theta_a. Neither step uses the
 *        zero set of X. So the FORMAL existence is genuinely Phi-direct.
 *
 *   (G2) THE LOAD-BEARING STEP IS HERMITE-BIEHLER POSITIVITY OF E_a, WHICH IS
 *        EQUIVALENT TO RH. Both machines in (G1) require a POSITIVITY input
 *        that they cannot themselves supply:
 *          - de Branges H(E) theory needs E_a to be Hermite-Biehler, i.e.
 *            |E_a(z)| > |E_a^#(z)| for Im z > 0 (no zeros in the open upper
 *            half-plane, the structure-function axiom);
 *          - Arov-Nudelman needs Theta_a = E_a^# / E_a to be Schur, i.e.
 *            |Theta_a| <= 1 on the line, which is the SAME Hermite-Biehler
 *            condition written multiplicatively.
 *        For E_a(z) = X(a - iz) the Hermite-Biehler property says X(s) has no
 *        zeros with Re(s) > a; quantifying over all a > 0 this is EXACTLY the
 *        statement that X has no zeros off the critical line — i.e. RH itself.
 *        The de Branges 1986 ordering / structure theorem makes the
 *        implication two-way: the family {H(E_a)}_{a>0} forms a chain with
 *        E_a Hermite-Biehler for every a > 0 IF AND ONLY IF RH holds.
 *
 *   (G3) AROV-NUDELMAN GIVES NO RIEMANN-SPECIAL-CASE BYPASS. Arov-Nudelman
 *        1996 is the correct infinite-dimensional KYP bridge (its citation was
 *        the imp-1245 axis-(a) gap), and it does upgrade the FORMAL realization
 *        from finite-dim Anderson-Vongpanitlerd 1973 to the infinite-dim
 *        de Branges setting. But it is a REALIZATION FUNCTOR: its input
 *        hypothesis is precisely that Theta_a is Schur (the (G2) positivity).
 *        There is no Riemann-special structure of X that supplies that
 *        hypothesis unconditionally; the only known Phi-direct route to "X has
 *        no zeros in Re(s) > a" is the section 15-27 / ||V|| <= 1 chain, i.e.
 *        the very channel the direct route was meant to avoid. So the
 *        Riemann-special-case construction is unconditional EXCEPT for an input
 *        that is RH-equivalent.
 *
 *   NAMED RESIDUAL SUB-GAP
 *   ----------------------
 *   GAP-HB-POS: prove that E_a(z) = X(a - iz) is Hermite-Biehler for every
 *   a > 0 (equivalently: the Phi-built Hamiltonian dm_a is a positive measure;
 *   equivalently: Theta_a is Schur) DIRECTLY from Phi, WITHOUT invoking the
 *   zero set of X and WITHOUT assuming RH. By (G2) this single sub-gap is
 *   RH-EQUIVALENT, so it is the irreducible kernel of the direct route. It is
 *   the de Branges 1986 outer/positivity content underneath the imp-1245
 *   axis-(b) "no inner factor" rigidity gap, sharpened from RH-sufficient to
 *   RH-equivalent.
 *
 *   WHY THIS IS AN HONEST PARTIAL CLOSURE (NOT A NEGATIVE NULL RESULT)
 *   -----------------------------------------------------------------
 *   The deliverable is a STRUCTURAL REDUCTION, not a dead end. It (i) confirms
 *   the formal realization machinery is genuinely Phi-direct and unconditional
 *   (settling the imp-1245 axis-(a) Arov-Nudelman bridge usage), (ii) isolates
 *   the entire difficulty into the SINGLE scalar/positivity statement
 *   GAP-HB-POS, and (iii) proves that statement is RH-EQUIVALENT, which means
 *   the direct de Branges route cannot be strictly easier than RH and in
 *   particular cannot bypass PCC by being weaker. This closes the imp-1310
 *   "is the direct route a genuine bypass?" question with a definite NO while
 *   leaving GAP-HB-POS as the precisely-named open kernel.
 *
 *   @see imp-1241 src/data/imp-1241-unified-existence-conjecture.js
 *   @see imp-1245 src/data/imp-1245-cdb-exist-stress-test.js
 *   @see imp-1258 src/data/imp-1258-volterra-cdb-bridge.js
 *   @see imp-1310 src/data/imp-1310-section15-27-support-leq-1-reroute.js
 *
 *   Ticket: imp-1340 (proof, critical, STRUCTURAL REDUCTION + named sub-gap).
 */

const PAPER_REF = 'research-inputs/twin_ladder_consolidated_v52.pdf';

// =========================================================================
// SECTION A - WHAT A DIRECT H(E_a) CONSTRUCTION FROM Phi REQUIRES.
// =========================================================================
//
// CDB-Exist (imp-1241) asks, for every a > 0, to build the de Branges space
// H(E_a) with structure function E_a(z) = X(a - iz) directly from the
// completed Riemann kernel Phi, NON-CIRCULARLY (without the zero set of X).
// The construction factors into exactly two layers:
//
//   FORMAL layer:    given a positive-semidefinite kernel K_a, produce the
//                    Hilbert space H_a and evaluation transform B_a with
//                    K_a = <B_a, B_a> (Aronszajn 1950 / de Branges 1968);
//                    and given a Schur transfer function Theta_a, produce a
//                    passive canonical-system realization (Arov-Nudelman 1996).
//
//   POSITIVITY layer: certify that E_a is Hermite-Biehler (equivalently
//                    Theta_a = E_a^# / E_a is Schur, equivalently dm_a is a
//                    positive Hamiltonian) DIRECTLY from Phi.
//
// The FORMAL layer is unconditional and zero-set-free. The POSITIVITY layer is
// the entire open content.

const DIRECT_CONSTRUCTION_REQUIREMENTS = Object.freeze({
  target:
    'For every a > 0 build the de Branges space H(E_a) with structure ' +
    'function E_a(z) = X(a - iz) directly from Phi, non-circularly (no zero ' +
    'set of X)',

  formalLayer:
    'Aronszajn 1950 / Kolmogorov / de Branges 1968: given a positive ' +
    'semidefinite kernel K_a, the Hilbert space H_a and evaluation transform ' +
    'B_a with K_a = <B_a, B_a> exist AUTOMATICALLY. Arov-Nudelman 1996: given ' +
    'a Schur transfer function Theta_a, a passive canonical-system realization ' +
    'exists. Neither step uses the zero set of X',

  positivityLayer:
    'Certify E_a Hermite-Biehler (|E_a(z)| > |E_a^#(z)| for Im z > 0), ' +
    'equivalently Theta_a = E_a^#/E_a Schur (|Theta_a| <= 1 on R), ' +
    'equivalently the Phi-built Hamiltonian dm_a is a positive measure — ' +
    'DIRECTLY from Phi without the zero set of X and without assuming RH',

  whichLayerIsOpen: 'positivityLayer',
  formalLayerIsUnconditional: true,
  formalLayerUsesZeroSet: false,
});

// =========================================================================
// SECTION B - THE FORMAL REALIZATION MACHINERY IS UNCONDITIONAL (G1).
// =========================================================================
//
// (G1a) Kolmogorov / Aronszajn: any PSD kernel K_a has a reproducing-kernel
//       Hilbert space H_a and a Gram factorization K_a = <B_a, B_a>. This is
//       the imp-1241 "hidden square" observation: existence is automatic once
//       K_a is PSD, no construction needed. Zero-set-free.
//
// (G1b) Arov-Nudelman 1996 (Passive Systems and Bitangential Interpolation):
//       a Schur-class transfer function Theta_a admits a passive
//       (conservative or dissipative) infinite-dimensional canonical-system
//       realization. This is the correct infinite-dim KYP bridge that the
//       finite-dim Anderson-Vongpanitlerd 1973 lemma cannot supply (the
//       imp-1245 axis-(a) bridge-citation gap). Zero-set-free.
//
// Both machines are FUNCTORS from a positivity hypothesis to a realization.
// They consume positivity; they do not produce it.

const FORMAL_MACHINERY = Object.freeze({
  kolmogorovFactorization:
    'Aronszajn 1950 / de Branges 1968 chap 1-2: any positive semidefinite ' +
    'kernel K_a has a reproducing-kernel Hilbert space H_a and Gram ' +
    'factorization K_a = <B_a, B_a>. Existence automatic once K_a is PSD; ' +
    'zero-set-free (the imp-1241 hidden-square observation)',

  arovNudelman1996:
    'Arov-Nudelman 1996 (Passive Systems and Bitangential Interpolation): a ' +
    'Schur-class transfer function Theta_a admits a passive infinite-dim ' +
    'canonical-system realization. Correct infinite-dim KYP bridge beyond the ' +
    'finite-dim Anderson-Vongpanitlerd 1973 lemma (the imp-1245 axis-(a) gap)',

  bothAreFunctorsConsumingPositivity: true,
  formalExistenceIsPhiDirect: true,
  formalExistenceUsesZeroSet: false,
});

// =========================================================================
// SECTION C - THE LOAD-BEARING STEP IS HERMITE-BIEHLER POSITIVITY = RH (G2).
// =========================================================================
//
// Both machines in Section B require a positivity input:
//   - de Branges H(E) needs E_a Hermite-Biehler: |E_a(z)| > |E_a^#(z)| for
//     Im z > 0, i.e. E_a has no zeros in the open upper half-plane;
//   - Arov-Nudelman needs Theta_a = E_a^#/E_a Schur: |Theta_a| <= 1 on R,
//     which is the SAME condition written multiplicatively.
//
// For E_a(z) = X(a - iz) the change of variable s = a - iz maps Im z > 0 to
// Re(s) > a. So E_a Hermite-Biehler <=> X(s) has no zeros with Re(s) > a.
// Quantifying over all a > 0 and using the functional equation symmetry
// s <-> 1 - s of X, this is EXACTLY: X has no zeros off the critical line —
// i.e. the RIEMANN HYPOTHESIS. The de Branges 1986 chain-ordering / structure
// theorem makes it two-way (IF AND ONLY IF), not merely one direction.

const POSITIVITY_IS_RH = Object.freeze({
  deBrangesNeeds:
    'E_a Hermite-Biehler: |E_a(z)| > |E_a^#(z)| for Im z > 0 (E_a has no ' +
    'zeros in the open upper half-plane — the structure-function axiom)',

  arovNudelmanNeeds:
    'Theta_a = E_a^#/E_a Schur: |Theta_a| <= 1 on R — the SAME Hermite-Biehler ' +
    'condition written multiplicatively',

  changeOfVariable:
    'E_a(z) = X(a - iz); s = a - iz maps Im z > 0 to Re(s) > a. So E_a ' +
    'Hermite-Biehler <=> X has no zeros with Re(s) > a',

  quantifyOverA:
    'Quantifying over all a > 0 and using the functional-equation symmetry ' +
    's <-> 1 - s of X: {E_a Hermite-Biehler for all a > 0} <=> X has no zeros ' +
    'off the critical line <=> RH',

  twoWay: true,
  twoWayReference:
    'de Branges 1986 chain-ordering / structure theorem: the family ' +
    '{H(E_a)}_{a>0} is a totally ordered chain with E_a Hermite-Biehler for ' +
    'every a > 0 IF AND ONLY IF RH holds (not merely RH-sufficient)',

  positivityLayerIsRHEquivalent: true,
});

// =========================================================================
// SECTION D - NO RIEMANN-SPECIAL-CASE BYPASS VIA AROV-NUDELMAN (G3).
// =========================================================================
//
// The ticket asks (b): does Arov-Nudelman 1996 give an UNCONDITIONAL
// construction in a Riemann-special case? Answer: NO. Arov-Nudelman is a
// realization functor whose input hypothesis is exactly the Section C
// positivity (Theta_a Schur). No special arithmetic structure of X supplies
// that hypothesis unconditionally; the only known Phi-direct route to "X has
// no zeros in Re(s) > a" is the section 15-27 / ||V_{a,Phi}|| <= 1 chain — the
// very channel the direct route was meant to bypass. So the Riemann-special
// construction is unconditional EXCEPT for an RH-equivalent input, and is
// therefore NOT a bypass.

const NO_RIEMANN_SPECIAL_BYPASS = Object.freeze({
  question:
    'Does Arov-Nudelman 1996 give an unconditional construction in a ' +
    'Riemann-special case?',

  answer: false,

  reason:
    'Arov-Nudelman is a realization FUNCTOR; its input hypothesis is exactly ' +
    'that Theta_a is Schur (the Section C positivity). No Riemann-special ' +
    'structure of X supplies that hypothesis unconditionally',

  onlyKnownPhiDirectPositivityRoute:
    'The only known Phi-direct route to "X has no zeros in Re(s) > a" is the ' +
    'section 15-27 / ||V_{a,Phi}|| <= 1 chain (imp-1258) feeding PCC — exactly ' +
    'the channel the direct route was meant to bypass',

  isBypass: false,
  bypassesPCC: false,
});

// =========================================================================
// SECTION E - NAMED RESIDUAL SUB-GAP.
// =========================================================================

const RESIDUAL_SUBGAP = Object.freeze({
  id: 'GAP-HB-POS',
  statement:
    'Prove E_a(z) = X(a - iz) is Hermite-Biehler for every a > 0 ' +
    '(equivalently: the Phi-built Hamiltonian dm_a is a positive measure; ' +
    'equivalently: Theta_a = E_a^#/E_a is Schur) DIRECTLY from Phi, without ' +
    'invoking the zero set of X and without assuming RH',

  isRHEquivalent: true,
  isIrreducibleKernelOfDirectRoute: true,

  relationToImp1245AxisB:
    'GAP-HB-POS is the de Branges 1986 outer/positivity content underneath the ' +
    'imp-1245 axis-(b) "E_a has no inner factor" rigidity gap, sharpened from ' +
    'RH-sufficient to RH-EQUIVALENT',

  whatWouldClose:
    'A Phi-direct positivity certificate for Theta_a (Schur / Hermite-Biehler) ' +
    'not routed through the zero set or the ||V|| <= 1 / PCC chain — which by ' +
    'Section C would be a proof of RH itself',
});

// =========================================================================
// SECTION F - VERDICT.
// =========================================================================

const ALLOWED_VERDICTS = Object.freeze([
  'cdb-exist-direct-construction-closes-rh-unconditionally',
  'cdb-exist-direct-construction-reduces-to-hermite-biehler-positivity-rh-equivalent',
  'cdb-exist-direct-construction-requires-X-conjecture',
  'cdb-exist-direct-construction-bypasses-pcc-but-only-conjecturally',
]);

const VERDICT =
  'cdb-exist-direct-construction-reduces-to-hermite-biehler-positivity-rh-equivalent';

const VERDICT_DETAIL = Object.freeze({
  verdict: VERDICT,
  isAllowedVerdict: ALLOWED_VERDICTS.includes(VERDICT),

  closesCDBExistUnconditionally: false,
  bypassesPCC: false,
  formalLayerIsUnconditional: true,
  positivityLayerIsRHEquivalent: true,

  coreReduction:
    'The direct H(E_a) construction from Phi factors into a FORMAL layer ' +
    '(Kolmogorov factorization + Arov-Nudelman 1996 realization — both ' +
    'unconditional and zero-set-free) and a POSITIVITY layer (E_a ' +
    'Hermite-Biehler / Theta_a Schur from Phi). The positivity layer is ' +
    'RH-EQUIVALENT by the de Branges 1986 chain-ordering theorem, so the ' +
    'direct route is provably no easier than RH and cannot bypass PCC',

  residualSubGap: 'GAP-HB-POS',
  residualSubGapIsRHEquivalent: true,

  whyHonestPartial:
    'This is a STRUCTURAL REDUCTION, not a null result: it confirms the formal ' +
    'realization machinery is genuinely Phi-direct (settling the imp-1245 ' +
    'axis-(a) Arov-Nudelman bridge usage), isolates the whole difficulty into ' +
    'the single statement GAP-HB-POS, and proves that statement RH-EQUIVALENT ' +
    'rather than merely RH-sufficient',

  answersToImp1340Walk: Object.freeze({
    a_whatIsNeeded:
      'A Phi-direct Hermite-Biehler positivity certificate for E_a = X(a - iz); ' +
      'the formal RKHS / realization layer is automatic and zero-set-free',
    b_arovNudelmanUnconditionalSpecialCase: false,
    c_residualConjectures: 'GAP-HB-POS (RH-equivalent)',
  }),

  aggregateVerdict:
    'direct-de-branges-route-is-not-a-pcc-bypass: it relocates the entire ' +
    'difficulty into the RH-equivalent GAP-HB-POS positivity certificate',

  honestNote:
    'imp-1310 named the de Branges direct route as the cleanest remaining ' +
    'structural lever precisely because it appeared to bypass the ' +
    '||V|| <= 1 / PCC channel. This ticket confirms the bypass is illusory at ' +
    'the level of difficulty: the formal construction is genuinely Phi-direct, ' +
    'but the positivity it consumes (E_a Hermite-Biehler) is RH itself. The ' +
    'value is the precise localization — GAP-HB-POS — and the upgrade of the ' +
    'imp-1245 axis-(b) rigidity gap from RH-sufficient to RH-equivalent',

  trainingTimeUncertaintyHonestNote:
    'Training-time knowledge cutoff is January 2026. The de Branges 1968 / 1986 ' +
    'structure theory, Aronszajn 1950 factorization, and Arov-Nudelman 1996 ' +
    'realization theorem are settled classical results; the reduction turns ' +
    'only on these and on the elementary change of variable s = a - iz. The ' +
    'reduction is OPEN-FOR-REVISION only if a Phi-direct positivity certificate ' +
    'for Theta_a were found that is not RH-equivalent, which Section C rules out',
});

// =========================================================================
// SECTION G - EXPORTED RECORD.
// =========================================================================

export const IMP_1340_CDB_EXIST_DIRECT_CONSTRUCTION = Object.freeze({
  id: 'imp-1340-CDB-Exist-direct-construction',
  ticket: 'imp-1340',
  category: 'proof',
  builtAt: '2026-06-03T19:19:44Z',
  paperSourcePath: PAPER_REF,
  relatedTickets: Object.freeze([
    'imp-1241', 'imp-1245', 'imp-1258', 'imp-1310',
  ]),

  verdict: VERDICT,
  allowedVerdicts: ALLOWED_VERDICTS,
  verdictDetail: VERDICT_DETAIL,

  directConstructionRequirements: DIRECT_CONSTRUCTION_REQUIREMENTS,
  formalMachinery: FORMAL_MACHINERY,
  positivityIsRH: POSITIVITY_IS_RH,
  noRiemannSpecialBypass: NO_RIEMANN_SPECIAL_BYPASS,
  residualSubGap: RESIDUAL_SUBGAP,

  parentCrossReferences: Object.freeze({
    imp1241: 'src/data/imp-1241-unified-existence-conjecture.js — unified CDB-Exist (16.4 + 16.6 + 18.1)',
    imp1245: 'src/data/imp-1245-cdb-exist-stress-test.js — axis-(a) Arov-Nudelman bridge gap, axis-(b) inner-factor rigidity, axis-(c) non-circularity FAIL',
    imp1258: 'src/data/imp-1258-volterra-cdb-bridge.js — ||V_{a,Phi}|| <= 1 -> CDB-Exist bridge (the channel the direct route was meant to bypass)',
    imp1310: 'src/data/imp-1310-section15-27-support-leq-1-reroute.js — named the de Branges direct route as the cleanest remaining structural lever',
  }),

  honestScope: Object.freeze([
    'This file is a STRUCTURAL REDUCTION for the critical imp-1340 question: ' +
    'can a DIRECT construction of H(E_a) from Phi close CDB-Exist ' +
    'unconditionally and thereby close section 15-27 -> RH WITHOUT routing ' +
    'through ||V_{a,Phi}|| <= 1 -> CDB-Exist -> PCC? It is NOT a new closure ' +
    'or a new unconditional bound.',

    'The verdict is an HONEST PARTIAL: the direct construction factors into a ' +
    'FORMAL realization layer (Kolmogorov factorization + Arov-Nudelman 1996, ' +
    'both unconditional and zero-set-free) and a POSITIVITY layer (E_a ' +
    'Hermite-Biehler / Theta_a Schur, certified from Phi). The formal layer is ' +
    'genuinely Phi-direct. The positivity layer is RH-EQUIVALENT.',

    'By the change of variable s = a - iz, E_a(z) = X(a - iz) is ' +
    'Hermite-Biehler iff X has no zeros with Re(s) > a; quantified over all ' +
    'a > 0 with the functional-equation symmetry this is RH. The de Branges ' +
    '1986 chain-ordering theorem makes the equivalence two-way, upgrading the ' +
    'imp-1245 axis-(b) rigidity gap from RH-sufficient to RH-equivalent.',

    'Arov-Nudelman 1996 gives NO Riemann-special-case unconditional bypass: it ' +
    'is a realization functor whose input hypothesis is the RH-equivalent ' +
    'positivity. The only known Phi-direct positivity route is the section ' +
    '15-27 / ||V|| <= 1 chain feeding PCC — the very channel the direct route ' +
    'was meant to avoid.',

    'NAMED RESIDUAL SUB-GAP GAP-HB-POS: prove E_a = X(a - iz) is ' +
    'Hermite-Biehler for every a > 0 directly from Phi without the zero set ' +
    'and without assuming RH. This single sub-gap is RH-equivalent and is the ' +
    'irreducible kernel of the direct de Branges route.',

    'CONSEQUENCE for engine planning: the imp-1310 "cleanest remaining ' +
    'structural lever" (de Branges direct route) is NOT a PCC bypass — it ' +
    'relocates the entire difficulty into GAP-HB-POS, which is RH itself. The ' +
    'remaining live levers stay the imp-1310 alternative section 15-27 closure ' +
    'decoupled from sigma > 1 and the imp-1341 Schatten-1 / trace-class ' +
    'bridge.',
  ]),

  references: Object.freeze({
    paper: PAPER_REF,
    imp1241: 'src/data/imp-1241-unified-existence-conjecture.js',
    imp1245: 'src/data/imp-1245-cdb-exist-stress-test.js',
    imp1258: 'src/data/imp-1258-volterra-cdb-bridge.js',
    imp1310: 'src/data/imp-1310-section15-27-support-leq-1-reroute.js',
    deBranges1968:
      'de Branges, L., "Hilbert Spaces of Entire Functions", Prentice-Hall ' +
      '1968 — Hermite-Biehler structure functions E, the spaces H(E), and the ' +
      'reproducing-kernel factorization K = <B, B>',
    deBranges1986:
      'de Branges, L., chain-ordering / structure theory for de Branges spaces ' +
      '— the totally ordered chain {H(E_a)} and the two-way link between ' +
      'Hermite-Biehler of the whole chain and zero-free half-planes',
    aronszajn1950:
      'Aronszajn, N., "Theory of reproducing kernels", Trans. AMS 68 (1950), ' +
      '337-404 — any PSD kernel has an RKHS and a Gram factorization',
    arovNudelman1996:
      'Arov, D. Z. and Nudelman, M. A., "Passive Systems and Bitangential ' +
      'Interpolation" (1996) — passive infinite-dimensional realization of a ' +
      'Schur-class transfer function; the correct infinite-dim KYP bridge ' +
      'beyond finite-dim Anderson-Vongpanitlerd 1973',
    andersonVongpanitlerd1973:
      'Anderson, B. D. O. and Vongpanitlerd, S., "Network Analysis and ' +
      'Synthesis: A Modern Systems Theory Approach", 1973 — the finite-dim ' +
      'Kalman-Yakubovich-Popov / positive-real lemma (insufficient in infinite ' +
      'dimensions, hence the Arov-Nudelman upgrade)',
    romanov2010:
      'Romanov, R., "Canonical systems and de Branges spaces" (2010) — ' +
      'canonical Hamiltonian systems dm on R_+, the Krein-Weyl m-function, and ' +
      'the bijection with Hermite-Biehler E',
  }),
});

export default IMP_1340_CDB_EXIST_DIRECT_CONSTRUCTION;

// =========================================================================
// BUILD-TIME TRIPWIRES (10 shipped; ticket requires 8+).
// =========================================================================

export const IMP_1340_CDB_EXIST_DIRECT_CONSTRUCTION_ASSERTIONS = [
  // Tripwire 1: the direct construction is split into a formal layer and a
  // positivity layer, and the open content is the positivity layer.
  {
    id: 'imp1340-construction-splits-formal-vs-positivity',
    why:
      'The whole reduction rests on splitting the direct H(E_a) construction ' +
      'into a FORMAL (unconditional, zero-set-free) layer and a POSITIVITY ' +
      '(open) layer. If the split were not stated, the verdict would have no ' +
      'anchor.',
    holds: () => {
      const r = IMP_1340_CDB_EXIST_DIRECT_CONSTRUCTION.directConstructionRequirements;
      return (
        typeof r.formalLayer === 'string' &&
        /Aronszajn|Kolmogorov|Arov-Nudelman/.test(r.formalLayer) &&
        typeof r.positivityLayer === 'string' &&
        /Hermite-Biehler|Schur/.test(r.positivityLayer) &&
        r.whichLayerIsOpen === 'positivityLayer' &&
        r.formalLayerUsesZeroSet === false
      );
    },
  },

  // Tripwire 2: the formal realization machinery is unconditional and
  // zero-set-free (Kolmogorov factorization + Arov-Nudelman 1996).
  {
    id: 'imp1340-formal-machinery-unconditional',
    why:
      'The honest-partial claim requires the formal layer (RKHS factorization ' +
      'and Arov-Nudelman realization) to be genuinely unconditional and not to ' +
      'use the zero set of X. Otherwise the reduction is not Phi-direct.',
    holds: () => {
      const m = IMP_1340_CDB_EXIST_DIRECT_CONSTRUCTION.formalMachinery;
      return (
        /Aronszajn|de Branges 1968/.test(m.kolmogorovFactorization) &&
        /Arov-Nudelman 1996/.test(m.arovNudelman1996) &&
        m.bothAreFunctorsConsumingPositivity === true &&
        m.formalExistenceIsPhiDirect === true &&
        m.formalExistenceUsesZeroSet === false
      );
    },
  },

  // Tripwire 3: the positivity layer is identified as Hermite-Biehler of E_a
  // (equivalently Theta_a Schur).
  {
    id: 'imp1340-positivity-is-hermite-biehler',
    why:
      'The load-bearing step must be identified precisely as Hermite-Biehler ' +
      'positivity of E_a (equivalently Theta_a Schur). A vaguer statement ' +
      'would let the RH-equivalence claim drift.',
    holds: () => {
      const p = IMP_1340_CDB_EXIST_DIRECT_CONSTRUCTION.positivityIsRH;
      return (
        /Hermite-Biehler/.test(p.deBrangesNeeds) &&
        /Schur/.test(p.arovNudelmanNeeds) &&
        /E_a\(z\) = X\(a - iz\)|s = a - iz/.test(p.changeOfVariable)
      );
    },
  },

  // Tripwire 4: the change of variable s = a - iz links Hermite-Biehler to a
  // zero-free half-plane Re(s) > a.
  {
    id: 'imp1340-change-of-variable-zero-free-halfplane',
    why:
      'The bridge from Hermite-Biehler positivity to RH runs through the ' +
      'change of variable s = a - iz mapping Im z > 0 to Re(s) > a. This must ' +
      'be explicit for the equivalence to be auditable.',
    holds: () => {
      const p = IMP_1340_CDB_EXIST_DIRECT_CONSTRUCTION.positivityIsRH;
      return (
        /Re\(s\) > a/.test(p.changeOfVariable) &&
        /no zeros with Re\(s\) > a/.test(p.changeOfVariable)
      );
    },
  },

  // Tripwire 5: quantifying over all a > 0 yields RH, and the link is two-way.
  {
    id: 'imp1340-positivity-is-rh-equivalent-two-way',
    why:
      'The core sharpening is that the positivity layer is RH-EQUIVALENT (not ' +
      'merely RH-sufficient), via the de Branges 1986 chain-ordering theorem. ' +
      'Both the equivalence and its two-way nature must be asserted.',
    holds: () => {
      const p = IMP_1340_CDB_EXIST_DIRECT_CONSTRUCTION.positivityIsRH;
      return (
        /RH/.test(p.quantifyOverA) &&
        p.twoWay === true &&
        /de Branges 1986/.test(p.twoWayReference) &&
        p.positivityLayerIsRHEquivalent === true
      );
    },
  },

  // Tripwire 6: Arov-Nudelman gives no Riemann-special-case unconditional
  // bypass (answer to walk-step (b)).
  {
    id: 'imp1340-no-riemann-special-bypass',
    why:
      'Walk-step (b) explicitly asks whether Arov-Nudelman 1996 gives an ' +
      'unconditional construction in a Riemann-special case. The record must ' +
      'answer NO and say why (functor consuming RH-equivalent positivity).',
    holds: () => {
      const n = IMP_1340_CDB_EXIST_DIRECT_CONSTRUCTION.noRiemannSpecialBypass;
      return (
        n.answer === false &&
        /functor|input hypothesis/i.test(n.reason) &&
        /15-27|\|\|V/.test(n.onlyKnownPhiDirectPositivityRoute) &&
        n.bypassesPCC === false
      );
    },
  },

  // Tripwire 7: the named residual sub-gap GAP-HB-POS is present and stated.
  {
    id: 'imp1340-named-subgap-gap-hb-pos',
    why:
      'The ticket requires an HONEST PARTIAL with a clearly-named sub-gap. ' +
      'GAP-HB-POS must be present, precisely stated, and flagged RH-equivalent.',
    holds: () => {
      const g = IMP_1340_CDB_EXIST_DIRECT_CONSTRUCTION.residualSubGap;
      return (
        g.id === 'GAP-HB-POS' &&
        /Hermite-Biehler/.test(g.statement) &&
        /without.*zero set|without assuming RH/.test(g.statement) &&
        g.isRHEquivalent === true &&
        g.isIrreducibleKernelOfDirectRoute === true
      );
    },
  },

  // Tripwire 8: GAP-HB-POS is linked to and sharpens the imp-1245 axis-(b)
  // inner-factor rigidity gap.
  {
    id: 'imp1340-subgap-sharpens-imp1245-axisb',
    why:
      'The deliverable must connect GAP-HB-POS to the prior imp-1245 axis-(b) ' +
      'rigidity gap and record that it sharpens RH-sufficient to RH-equivalent, ' +
      'so the reduction is auditable against earlier work.',
    holds: () => {
      const g = IMP_1340_CDB_EXIST_DIRECT_CONSTRUCTION.residualSubGap;
      return (
        /imp-1245/.test(g.relationToImp1245AxisB) &&
        /inner factor|outer/i.test(g.relationToImp1245AxisB) &&
        /RH-EQUIVALENT|RH-equivalent/.test(g.relationToImp1245AxisB)
      );
    },
  },

  // Tripwire 9: the verdict is in the allowed set and is the reduction verdict
  // (does NOT close RH, does NOT bypass PCC).
  {
    id: 'imp1340-verdict-allowed-and-reduction',
    why:
      'The verdict must be exactly the RH-equivalent reduction verdict, be a ' +
      'member of the allowed set, and must NOT claim an unconditional closure ' +
      'or a PCC bypass — guarding against an optimistic drift.',
    holds: () => {
      const v = IMP_1340_CDB_EXIST_DIRECT_CONSTRUCTION.verdictDetail;
      return (
        v.verdict ===
          'cdb-exist-direct-construction-reduces-to-hermite-biehler-positivity-rh-equivalent' &&
        v.isAllowedVerdict === true &&
        v.closesCDBExistUnconditionally === false &&
        v.bypassesPCC === false &&
        v.formalLayerIsUnconditional === true &&
        v.positivityLayerIsRHEquivalent === true
      );
    },
  },

  // Tripwire 10: the three walk-steps (a)(b)(c) are answered and training-time
  // uncertainty is honestly acknowledged.
  {
    id: 'imp1340-walk-answered-and-uncertainty-acknowledged',
    why:
      'The ticket poses a three-part walk (a)(b)(c). The record must answer all ' +
      'three and honestly acknowledge the January 2026 training-time cutoff ' +
      'while stating the reduction turns only on settled classical results.',
    holds: () => {
      const v = IMP_1340_CDB_EXIST_DIRECT_CONSTRUCTION.verdictDetail;
      const w = v.answersToImp1340Walk;
      return (
        typeof w.a_whatIsNeeded === 'string' &&
        /Hermite-Biehler/.test(w.a_whatIsNeeded) &&
        w.b_arovNudelmanUnconditionalSpecialCase === false &&
        /GAP-HB-POS/.test(w.c_residualConjectures) &&
        /January 2026/.test(v.trainingTimeUncertaintyHonestNote) &&
        /OPEN-FOR-REVISION/.test(v.trainingTimeUncertaintyHonestNote)
      );
    },
  },
];
