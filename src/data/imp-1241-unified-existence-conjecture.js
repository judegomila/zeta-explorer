// imp-1241: Unified de Branges canonical-system existence audit for paper
//           Conjectures 16.4, 16.6, 18.1, 18.2.
//
// QUESTION UNDER TEST
// -------------------
// Per the imp-1218 paper-audit-dashboard, 4 conjectures were UNAUDITED and
// constructive-existence-flavored: 16.4, 16.6, 18.1, 18.2. Hypothesis: ALL
// FOUR are instances of a SINGLE de Branges canonical-system existence
// problem. If so, the paper should reframe them as ONE conjecture with three
// or four corollaries.
//
// METHOD
// ------
// Training-time knowledge only. No external browsing. We compare each
// conjecture against four reference frameworks:
//   (R1) de Branges (1968): Hilbert spaces of entire functions H(E) for
//        Hermite-Biehler E. Existence of B_a as the reproducing-kernel
//        evaluation map of H(E_a). Existence is automatic; non-circularity
//        from xi-without-zero-set is the open content.
//   (R2) Romanov (2010): canonical systems on a half-line; dm-theory.
//        Krein bijection between Hermite-Biehler E and canonical Hamiltonian
//        dm on R_+ with Weyl m-function whose Cayley is the Schur Theta_a.
//   (R3) Krein-Langer (1973, 1977): generalized Schur class S^k, Pontryagin
//        spaces, negative-index identity. Anti-passive ghost factor sits
//        here, not in canonical-system existence.
//   (R4) Lagarias-Suzuki + Connes-Bost / Tate adelic spectral triples:
//        adelic canonical-system existence via the operator V on L^2(C+).
//        Different existence problem -- adelic boundary measure, not
//        kernel-built dm.
//
// VERDICT SUMMARY
// ---------------
// 16.4 (shift-bridge square existence): de Branges H(E_a) existence problem.
//      The hidden-square is the Kolmogorov factorization K_a = <B_a, B_a>;
//      H_a = de-Branges-space H(E_a); B_a = reproducing-kernel evaluation.
//      Existence is AUTOMATIC once K_a is PSD; the open content is "build
//      H_a, B_a directly from Phi without using the zero set". Maps to (R1).
//
// 16.6 (canonical-system closure): Schur Theta_a = E_a^# / E_a as transfer
//      function of a passive canonical system. de Branges-Krein Hermite-
//      Biehler/canonical-system bijection (Krein 1955, de Branges 1968,
//      Romanov 2010, Winkler 1995) makes this existence AUTOMATIC once E_a
//      is Hermite-Biehler. Open content: build dm from Phi non-circularly.
//      Maps to (R1)+(R2). Identical TYPE of existence as 16.4.
//
// 18.1 (kernel/passivity closure): pair (A_a, B_a) arises from a positive
//      Hamiltonian canonical system whose Weyl-Cayley transfer function is
//      Theta_a. Same Krein-de Branges bijection. K_a is the energy kernel
//      of the passive system. Maps to (R1)+(R2). Identical TYPE of existence
//      as 16.4 and 16.6.
//
// 18.2 (prime-delay domination): Re(X'/X)(w) > 0 for Re(w) > 0; the completed
//      archimedean drift dominates the coherent prime-delay echo train (Weil
//      explicit-formula completed sense). NOT a canonical-system existence
//      claim. It is a SCALAR INEQUALITY on the logarithmic-derivative side
//      of the Hadamard factorization. Conceptually it is "infinitesimal
//      shift-bridge contractivity" -- the differential form of Conjecture
//      15.4 (already SUBSUMED-BY-RH via paired Hadamard).
//
// UNIFIED VERDICT: three-of-four-unified.
//
// HONEST READ
// -----------
// 16.4 + 16.6 + 18.1 are three notational presentations of a SINGLE de
// Branges / Krein canonical-system existence problem: build the structure
// function E_a (or equivalently the Hamiltonian dm, or equivalently the
// passive realization) from Phi NON-CIRCULARLY. By the de Branges 1968
// existence theorem and the Krein-de Branges bijection, the three are
// LOGICALLY EQUIVALENT once K_a positivity is given. The non-circularity
// constraint is what makes them open. The paper should reframe them as
// ONE conjecture (call it the unified de Branges canonical-system existence
// conjecture, CDB-Exist) with three corollaries (Hilbert-space, dm, passive
// realization).
//
// 18.2 is a different mathematical object. It is the Re(xi'/xi) > 0 type
// claim on the right half-plane and structurally identical to Conjecture
// 15.4 (SUBSUMED-BY-RH via imp-1202). It does NOT fold into the
// canonical-system existence cluster.
//
// SYNTAX NOTE
// -----------
// No apostrophes inside single-quoted JS strings.

// -- Per-conjecture entries -------------------------------------------------

const CONJ_16_4 = Object.freeze({
  id: '16.4',
  label: 'Conjecture 16.4',
  shortName: 'Shift-bridge square (hidden square)',
  paperSection: 'para 16.4',
  paperPage: 30,
  statement:
    'For every a > 0 there exists a Hilbert space H_a and a transform B_a, ' +
    'built directly from the completed Riemann kernel and NOT from the zero ' +
    'set, such that K_a(zeta, z) = <B_a(z), B_a(zeta)>_{H_a}.',

  isCanonicalSystemExistence: true,
  category: 'de-Branges H(E) existence',

  deBrangesMapping:
    'H_a = de Branges space H(E_a) with structure function E_a(z) = X(a - iz). ' +
    'B_a(z) is the reproducing-kernel evaluation: B_a(z)(w) = K_a(w, z). The ' +
    'Kolmogorov factorization K_a = <B_a, B_a> is the universal Gram-kernel ' +
    'factorization that exists for any PSD kernel (Aronszajn 1950, de Branges ' +
    '1968 chap 1-2). Once K_a is positive semidefinite, H_a and B_a exist ' +
    'AUTOMATICALLY -- no construction is needed. The open content is the ' +
    'non-circularity clause: build H_a, B_a directly from Phi without using ' +
    'the zero set of X.',

  romanovMapping:
    'In Romanov 2010 dm-theory the dual realization is via the Hamiltonian dm ' +
    'on R_+ whose Krein-Weyl m-function generates E_a. Identical content as ' +
    'the deBrangesMapping above, in canonical-system language.',

  rationale:
    'This IS the de Branges 1968 hidden-square existence problem in shift- ' +
    'bridge dress. The Kolmogorov factorization theorem gives existence ' +
    'automatically. The non-circularity constraint -- construct H_a from Phi, ' +
    'not from zeros -- is the open content. Same as Conjecture 22.3 ' +
    '(PARTIALLY-RELATED via imp-1210).',

  recommendationForPaper:
    'PARTIALLY-RELATED to de Branges 1968 / Lagarias 2007. The existence ' +
    'is automatic by Kolmogorov factorization once K_a is PSD; the open ' +
    'content is the non-circular construction from Phi. Reframe as a special ' +
    'case of the unified de Branges canonical-system existence conjecture ' +
    '(CDB-Exist) below; the cluster {16.4, 16.6, 18.1} should be presented ' +
    'as a single Conjecture with three notational corollaries.',
});

const CONJ_16_6 = Object.freeze({
  id: '16.6',
  label: 'Conjecture 16.6',
  shortName: 'Canonical-system closure',
  paperSection: 'para 16.7',
  paperPage: 32,
  statement:
    'For every a > 0, the shifted bridge ratio Theta_a(z) = E_a^#(z)/E_a(z) ' +
    'is the transfer function of a passive canonical system constructed ' +
    'directly from the completed Riemann kernel. Equivalently, Theta_a is ' +
    'Schur in C_+ for every a > 0.',

  isCanonicalSystemExistence: true,
  category: 'Krein-de Branges canonical-system existence (dm theory)',

  deBrangesMapping:
    'Theta_a Schur in C_+ iff E_a Hermite-Biehler iff K_a PSD (de Branges ' +
    '1968 Theorem 23). Once E_a is Hermite-Biehler, the de Branges chain ' +
    'theorem produces a canonical Hamiltonian dm whose Krein-Weyl transfer ' +
    'function is the Cayley transform of Theta_a. Existence is AUTOMATIC ' +
    'by the de Branges chain / Krein-Langer construction.',

  romanovMapping:
    'Romanov 2010 theorem: every Hermite-Biehler E uniquely determines a ' +
    'canonical Hamiltonian dm on a half-line with that E as the structure ' +
    'function at the right endpoint (de Branges-Krein bijection). Theta_a ' +
    'Schur iff such a dm exists iff E_a Hermite-Biehler iff K_a PSD. ' +
    'Existence is AUTOMATIC. Open content is the non-circular construction ' +
    'of dm from Phi.',

  rationale:
    'Identical existence type as 16.4. Schur Theta_a, Hermite-Biehler E_a, ' +
    'PSD K_a, and existence of passive canonical-system dm are all mutually ' +
    'equivalent by the de Branges-Krein bijection. Once one is established ' +
    'non-circularly from Phi, the others follow. The TYPE of mathematical ' +
    'object (canonical-system existence from a structure function built ' +
    'from Phi) is the same as in 16.4 and 18.1.',

  recommendationForPaper:
    'Reframe as a special case of the unified CDB-Exist conjecture. The ' +
    'Schur / Hermite-Biehler / PSD / canonical-system existence quartet ' +
    'is de Branges 1968 + Krein 1955 textbook material; the open content ' +
    'is the non-circular construction of the structure function or dm from ' +
    'Phi. Cite de Branges 1968, Krein 1955, Romanov 2010, Winkler 1995.',
});

const CONJ_18_1 = Object.freeze({
  id: '18.1',
  label: 'Conjecture 18.1',
  shortName: 'Kernel/passivity closure',
  paperSection: 'para 18.1',
  paperPage: 38,
  statement:
    'For every shift a > 0, the pair (A_a, B_a) -- the even and odd ' +
    'Fourier channels of the centered completed kernel -- arises from a ' +
    'positive Hamiltonian canonical system whose Weyl transfer function is ' +
    'Theta_a(z) = E_a^#(z)/E_a(z). Equivalently, K_a is the energy kernel ' +
    'of a passive system constructed directly from Phi.',

  isCanonicalSystemExistence: true,
  category: 'Krein-de Branges canonical-system existence (passive realization)',

  deBrangesMapping:
    'A_a, B_a are the real and imaginary parts of E_a in the cosh-cos / ' +
    'sinh-sin Fourier expansion of E_a(z) = integral Phi(u) cosh((a - iz)u) du. ' +
    'They are the standard de Branges A/B decomposition of a Hermite-Biehler ' +
    'function. Existence of a positive Hamiltonian dm with Weyl-Cayley Theta_a ' +
    'is the Krein-de Branges canonical-system existence theorem applied to E_a.',

  romanovMapping:
    'Direct restatement of the Krein-de Branges bijection. K_a is the ' +
    'energy kernel of the passive realization (state-space inner product ' +
    'after Krein-Cayley). Romanov 2010 dm-theory + classical KYP lemma ' +
    '(Yakubovich-Kalman-Popov, Anderson-Vongpanitlerd 1973) supply the ' +
    'passive realization given Schur Theta_a.',

  rationale:
    'Identical TYPE of existence claim as 16.4 and 16.6. The passive ' +
    'realization, the canonical-system dm, the Hermite-Biehler E_a, the ' +
    'PSD kernel K_a, and the Kolmogorov factorization are five faces of ' +
    'the same de Branges-Krein object. KYP/passive realization adds the ' +
    'state-space controls perspective but produces the same existence ' +
    'theorem. The crucial unifying observation: A_a(z) and B_a(z) here are ' +
    'NOT the same as B_a in 16.4 (which was the reproducing-kernel ' +
    'evaluation) -- there is overloaded notation in the paper. But the ' +
    'EXISTENCE claim is identical to 16.4 + 16.6.',

  recommendationForPaper:
    'Reframe as a special case of the unified CDB-Exist conjecture. The ' +
    'KYP/passive-realization addition relative to 16.4 + 16.6 is a stylistic ' +
    'enhancement (Anderson-Vongpanitlerd 1973), not a new mathematical claim. ' +
    'Cite de Branges 1968, Krein 1955, Romanov 2010, Anderson-Vongpanitlerd ' +
    '1973, Yakubovich-Kalman-Popov classical KYP. Disambiguate the ' +
    'notational collision between B_a in 16.4 vs 18.1.',
});

const CONJ_18_2 = Object.freeze({
  id: '18.2',
  label: 'Conjecture 18.2',
  shortName: 'Prime-delay domination closure',
  paperSection: 'para 18.2',
  paperPage: 39,
  statement:
    'For every w with Re w > 0, the completed archimedean drift dominates ' +
    'the coherent prime-delay echo train (Weil-explicit-formula completed ' +
    'sense): Re(X\'/X)(w) > 0 for Re w > 0.',

  isCanonicalSystemExistence: false,
  category: 'analytic inequality on the Hadamard logarithmic derivative',

  deBrangesMapping: null,
  romanovMapping: null,

  rationale:
    'This is NOT a canonical-system existence claim. It is a SCALAR ' +
    'INEQUALITY on the logarithmic derivative X\'/X = xi\'/xi after change ' +
    'of variable. Under RH, the paired Hadamard expansion makes Re(xi\'/xi) ' +
    '> 0 manifest for Re(s) > 1/2 (each zero pair contributes a positive ' +
    'term). It is structurally identical to Conjecture 15.4 (infinitesimal ' +
    'form of shift contractivity), already SUBSUMED-BY-RH via imp-1202. ' +
    'The "completed sense / Weil explicit formula" qualification means we ' +
    'are not asked to prove the inequality from the Euler series in the ' +
    'critical half-strip (where it diverges); we are asked to prove it ' +
    'after replacing the Euler series by its analytic continuation, which ' +
    'is exactly xi\'/xi by Hadamard. So 18.2 is a notational restatement ' +
    'of "Re(xi\'/xi)(s) > 0 for Re(s) > 1/2", i.e. 15.4. SUBSUMED-BY-RH.',

  recommendationForPaper:
    'Do NOT bundle into the unified CDB-Exist conjecture. Mark as ' +
    'SUBSUMED-BY-RH (same logic as Conjecture 15.4 audited via imp-1202: ' +
    'paired Hadamard makes Re(xi\'/xi) > 0 for Re(s) > 1/2 manifest under ' +
    'RH). The quantitative refinement (effective lower bound, sub-gap) is ' +
    'where independent content could live, but the LITERAL Re > 0 statement ' +
    'is RH-implied. Cite imp-1202 and imp-1203 (numerical pilot on 18.2 ' +
    'directly).',
});

const PER_CONJECTURE = Object.freeze([CONJ_16_4, CONJ_16_6, CONJ_18_1, CONJ_18_2]);

// -- Unified conjecture statement -------------------------------------------

const UNIFIED_CONJECTURE = Object.freeze({
  shortName: 'CDB-Exist: unified de Branges canonical-system existence',

  statement:
    'For every a > 0, there exists a positive Hamiltonian canonical system ' +
    '(R_+, dm_a) constructed directly from the completed Riemann kernel Phi ' +
    'and NOT from the zero set of X, whose Krein-Weyl transfer function ' +
    'after Cayley transform equals Theta_a(z) = E_a^#(z)/E_a(z) with ' +
    'E_a(z) = X(a - iz). Equivalently, the de Branges space H(E_a) admits ' +
    'a Phi-built reproducing-kernel realization, K_a is the Gram kernel of ' +
    'a Phi-built evaluation map, and Theta_a is Schur in C_+.',

  corollaries: Object.freeze([
    {
      id: '16.4-corollary',
      derivation:
        'From CDB-Exist, take H_a = H(E_a), B_a(z) = K_a(., z). The ' +
        'Kolmogorov factorization K_a(zeta, z) = <B_a(z), B_a(zeta)>_{H_a} ' +
        'is the reproducing-kernel identity in H(E_a). The Phi-built dm_a ' +
        'supplies the non-circular realization.',
    },
    {
      id: '16.6-corollary',
      derivation:
        'From CDB-Exist, Theta_a Schur in C_+ is immediate (Cayley of a ' +
        'passive transfer function is Schur). The canonical-system passive ' +
        'realization is dm_a itself.',
    },
    {
      id: '18.1-corollary',
      derivation:
        'From CDB-Exist, (A_a, B_a) are the de Branges A/B decomposition ' +
        'of E_a. They arise from the canonical-system dm_a as the standard ' +
        'Liouville-coordinate channels. K_a is the energy kernel of the ' +
        'passive realization by KYP (Anderson-Vongpanitlerd 1973).',
    },
  ]),

  notUnifiedBy: Object.freeze([
    {
      id: '18.2',
      reason:
        '18.2 is a scalar inequality on Re(X\'/X) (the Hadamard logarithmic ' +
        'derivative), not a canonical-system existence claim. It is the ' +
        'infinitesimal form of shift-bridge contractivity (Conjecture 15.4) ' +
        'and SUBSUMED-BY-RH via paired Hadamard, not by canonical-system ' +
        'existence.',
    },
  ]),

  openContent:
    'CDB-Exist is RH-equivalent by the Krein-de Branges bijection plus the ' +
    'shift-bridge threshold theorem (K_a PSD for every a > 0 iff RH). The ' +
    'open content is the NON-CIRCULAR construction of dm_a from Phi -- ' +
    'i.e. without inputting either the Riemann zeros or any equivalent ' +
    'RH-positivity statement. This is the central open problem of the ' +
    'paper; the four conjectures (now three under unification) are ' +
    'notational presentations of it.',

  infiniteDimPassivityNote:
    'PARAGRAPH 1: The KYP-passive realization step in Conjecture 18.1 requires ' +
    'the infinite-dimensional generalization of the classical KYP lemma. Arov ' +
    'and Nudelman (1996, Passive Systems and Characteristic Functions) establish ' +
    'that a Schur-class operator function is the transfer function of a passive ' +
    'system with Hilbert state-space: Theta_a Schur in C_+ implies (A_a, B_a) ' +
    'arise from a passive canonical system with energy kernel K_a. This is the ' +
    'missing bridge between the scalar Schur condition and the Hilbert-space ' +
    'passive realization -- imp-1241 cited only the finite-dimensional KYP lemma ' +
    '(Anderson-Vongpanitlerd 1973), which covers finite state-spaces but not the ' +
    'L^2 / de Branges space H(E_a) setting that Conjecture 18.1 lives in. ' +
    'PARAGRAPH 2: Brodskii (1971, Triangular and Jordan Representations of Linear ' +
    'Operators) supplies the complementary operator-colligation and unitary-extension ' +
    'theory. Together, Arov-Nudelman 1996 and Brodskii 1971 fill the gap: for ' +
    'L^2-based systems like the Volterra / de Branges constructions, the Hilbert ' +
    'state-space is H(E_a) itself, and the infinite-dimensional passive transfer- ' +
    'function theory of Arov-Nudelman applies directly. Sz.-Nagy-Foias dilation ' +
    'theory (1970) supplies the unitary dilation underlying the passive realization, ' +
    'connecting to the Krein-de Branges chain theorem that produces the canonical ' +
    'Hamiltonian dm from E_a.',

  conservativeClassAndRegularityNote:
    'PARAGRAPH 1 (simple-conservative class disambiguation): Arov-Nudelman 1996 ' +
    'guarantee a passive Hilbert-state-space realization of a Schur Theta_a, but ' +
    'the passive realization is NOT unique -- minimal-passive, Pontryagin-passive ' +
    '(Krein-Langer S^k), and simple-conservative realizations all coexist for the ' +
    'same transfer function. Identifying the state space with the de Branges space ' +
    'H(E_a) (so that K_a is literally its reproducing kernel) requires the SIMPLE ' +
    'CONSERVATIVE class: the colligation must be lossless (unitary, |Theta_a| = 1 ' +
    'on R, matching the Hermite-Biehler boundary modulus of E_a) AND simple (no ' +
    'reducing subspace on which the main operator acts unitarily, i.e. no decoupled ' +
    'unitary part). Within the simple-conservative class the realization is UNIQUE ' +
    'up to unitary equivalence, which is what pins (A_a, B_a) to the de Branges ' +
    'A/B channels rather than to some other passive model. imp-1241 cited only the ' +
    'finite-dim KYP lemma, which does not make this class selection explicit; the ' +
    'assumption must be stated as a hypothesis of the unified CDB-Exist conjecture. ' +
    'PARAGRAPH 2 (right-endpoint limit-point regularity): the de Branges chain / ' +
    'Krein bijection produces a canonical Hamiltonian dm_a on a half-line whose ' +
    'structure function at the right endpoint is E_a ONLY when that endpoint is in ' +
    'the LIMIT-POINT case (de Branges 1968 Theorem XII; limit-point-at-infinity). ' +
    'In the limit-circle case the Weyl m-function lies on a non-degenerate Weyl ' +
    'disk and E_a is not uniquely determined, so the corollary 18.1 identification ' +
    'would be ambiguous. For E_a(z) = X(a - iz) the relevant check is that the ' +
    'completed-kernel Hamiltonian has non-integrable trace toward the singular ' +
    'endpoint (equivalently, the de Branges space chain is unbounded), placing it ' +
    'in the limit-point case. This regularity check is an additional hypothesis ' +
    'imp-1241 left implicit; it is flagged here per imp-1245 axis a, and its ' +
    'rigorous verification for the Phi-built E_a is left as a named sub-gap ' +
    '(CDB-Exist-regularity) rather than asserted.',

  outerFactorRigidityNote:
    'PARAGRAPH 1 (what no-inner-factor means): The CDB-Exist => 16.4 ' +
    'corollary identifies H_a with the de Branges space H(E_a) for E_a(z) = ' +
    'X(a - iz). This identification is EXACT only if E_a carries no inner ' +
    'factor, i.e. E_a is an OUTER structure function. In the Krein inner- ' +
    'outer factorization of a bounded-type function in C_+, E_a = B * S * O ' +
    'where B is a Blaschke product over the zeros of E_a in the open upper ' +
    'half-plane, S is a singular inner factor, and O is outer. A nontrivial ' +
    'B or singular S would make H(E_a) a proper isometric subspace of the ' +
    'space attached to the outer part O, breaking the precise H_a = H(E_a) ' +
    'identity that 16.4 needs. ' +
    'PARAGRAPH 2 (mean-type term is benign): E_a inherits the genus-1 ' +
    'Hadamard structure of X, so its only exponential factor is the mean- ' +
    'type term exp(alpha + beta z). In de Branges theory this exponential ' +
    'type is a LEGITIMATE feature of the structure function (it fixes the ' +
    'length of the canonical-system base interval) and is NOT an inner-factor ' +
    'obstruction. Rigidity therefore concerns only the Blaschke part B and ' +
    'the singular-measure content of S, not the exponential type. ' +
    'PARAGRAPH 3 (Blaschke half is exactly RH): E_a has a zero in the open ' +
    'upper half-plane iff X has an off-critical zero, because the Hermite- ' +
    'Biehler / shift-bridge threshold sends the critical-line zeros of X to ' +
    'the lower half-plane in the z variable. Hence B is trivial iff X has no ' +
    'off-critical zeros iff RH. The no-Blaschke-inner-factor half of outer- ' +
    'factor rigidity is therefore EXACTLY RH, not a sub-problem dischargeable ' +
    'separately from RH. ' +
    'PARAGRAPH 4 (singular half and honest verdict): absence of a singular- ' +
    'measure inner factor for X is tied to Polya-class membership of X, which ' +
    'is itself classically RH-equivalent (Polya 1927; de Branges 1968), so it ' +
    'likewise yields no unconditional reduction. NET: outer-factor rigidity ' +
    'of the Phi-built E_a is RH-EQUIVALENT, confirming the imp-1245 axis-b ' +
    'flag; the contribution here is to LOCALIZE the obstruction precisely as ' +
    'off-critical zeros (Blaschke) plus Polya-class regularity (singular) and ' +
    'to identify the mean-type exponential as benign. A rigorous UNCONDITIONAL ' +
    'proof is impossible (it would prove RH); this is left as the named sub- ' +
    'gap CDB-Exist-no-inner-factor (honest partial).',

  citations: Object.freeze([
    'de Branges 1968, Hilbert Spaces of Entire Functions (Theorems 19, 23, ' +
      '40; chain theorem)',
    'Krein 1955, On the trace formula in the theory of perturbations',
    'Romanov 2010, Canonical systems and de Branges spaces (dm-theory)',
    'Winkler 1995, The inverse spectral problem for canonical systems',
    'Lagarias 2007, Hilbert spaces of entire functions and Dirichlet series ' +
      '(survey of RH-equivalent reformulations)',
    'Anderson-Vongpanitlerd 1973, Network Analysis and Synthesis (KYP / ' +
      'passive realization; finite-dimensional state-space)',
    'Arov-Nudelman 1996, Passive Systems and Characteristic Functions ' +
      '(infinite-dimensional passivity; Schur-class operator function => ' +
      'passive Hilbert-state-space realization; key bridge for Conj 18.1)',
    'Brodskii 1971, Triangular and Jordan Representations of Linear Operators ' +
      '(operator colligations, unitary extensions; infinite-dim passive ' +
      'realization complementary to Arov-Nudelman)',
    'Sz.-Nagy-Foias 1970, Harmonic Analysis of Operators on Hilbert Space ' +
      '(unitary dilation underlying the passive realization)',
    'Krein-Langer 1973, 1977, generalized Schur class S^k, Pontryagin ' +
      'spaces (NEGATIVE-INDEX theory for ghost factors; not the existence ' +
      'theorem)',
    'Lagarias-Suzuki / Connes-Bost adelic spectral triples (orthogonal ' +
      'existence framework -- not subsumed by CDB-Exist)',
  ]),
});

// -- Final verdict ----------------------------------------------------------

const FINAL_VERDICT = 'three-of-four-unified';

const VERDICT_RATIONALE =
  'Conjectures 16.4, 16.6, and 18.1 are three notational presentations of a ' +
  'single de Branges canonical-system existence problem (CDB-Exist): build ' +
  'the structure function E_a (equivalently the Hamiltonian dm_a, equivalently ' +
  'the passive realization, equivalently the reproducing-kernel evaluation B_a) ' +
  'from the completed kernel Phi NON-CIRCULARLY. By the de Branges 1968 / ' +
  'Krein 1955 / Romanov 2010 bijection, the three are LOGICALLY EQUIVALENT ' +
  'once K_a positivity is given. The non-circularity constraint is the open ' +
  'content. Conjecture 18.2 is a different mathematical object -- a scalar ' +
  'inequality on Re(X\'/X), structurally identical to Conjecture 15.4 and ' +
  'SUBSUMED-BY-RH via paired Hadamard. 18.2 does NOT belong in the unified ' +
  'CDB-Exist cluster.';

// -- Reference framework survey ---------------------------------------------

const REFERENCE_FRAMEWORKS = Object.freeze([
  {
    id: 'de-branges-1968',
    label: 'de Branges 1968, Hilbert Spaces of Entire Functions',
    role:
      'Provides the EXISTENCE theorem for H(E) given Hermite-Biehler E: ' +
      'Theorems 19 (associated Hilbert space), 23 (Hermite-Biehler iff ' +
      'PSD kernel), 40 (chain theorem -- canonical-system dm exists). ' +
      'Covers 16.4 + 16.6 + 18.1 existence content directly.',
    coversConjectures: Object.freeze(['16.4', '16.6', '18.1']),
    doesNotCover: Object.freeze(['18.2']),
  },
  {
    id: 'romanov-2010',
    label: 'Romanov 2010, Canonical systems and de Branges spaces (dm-theory)',
    role:
      'Modern reference for the Krein-de Branges bijection between ' +
      'Hermite-Biehler E and canonical-system Hamiltonian dm on R_+. ' +
      'Existence and uniqueness of dm given E. Directly supplies the ' +
      'canonical-system existence half of 16.6 + 18.1.',
    coversConjectures: Object.freeze(['16.6', '18.1']),
    doesNotCover: Object.freeze(['18.2']),
  },
  {
    id: 'krein-langer-1977',
    label: 'Krein-Langer 1973, 1977 (generalized Schur S^k, Pontryagin spaces)',
    role:
      'The negative-index identity ind_-(K_S) = number of RHP poles of S ' +
      'is the Pontryagin-space tool measuring failure of PSD. Relevant to ' +
      'the GHOST side (17.3, 18.4 = SUBSUMED-BY-RH via imp-1232), not to ' +
      'the existence side. Not the unifier for 16.4 + 16.6 + 18.1.',
    coversConjectures: Object.freeze([]),
    doesNotCover: Object.freeze(['16.4', '16.6', '18.1', '18.2']),
  },
  {
    id: 'lagarias-suzuki-connes',
    label: 'Lagarias-Suzuki / Connes-Bost adelic spectral triples',
    role:
      'Adelic existence framework for an alternative canonical-system ' +
      'construction via Tate-Connes idele-class boundary measures. ' +
      'Different existence problem (adelic, not kernel-built dm). ' +
      'Not the framework that unifies 16.4 + 16.6 + 18.1 -- those are ' +
      'archimedean shift-bridge constructions.',
    coversConjectures: Object.freeze([]),
    doesNotCover: Object.freeze(['16.4', '16.6', '18.1', '18.2']),
  },
  {
    id: 'paired-hadamard',
    label: 'Paired Hadamard product (Riemann xi factorization)',
    role:
      'For each zero pair (rho, 1 - rho), Re(xi\'/xi)(s) gets a positive ' +
      'contribution for Re(s) > 1/2 under RH. Covers Conjecture 15.4 ' +
      '(SUBSUMED-BY-RH via imp-1202) and Conjecture 18.2 (this audit). ' +
      'Not relevant to the canonical-system existence cluster.',
    coversConjectures: Object.freeze(['18.2']),
    doesNotCover: Object.freeze(['16.4', '16.6', '18.1']),
  },
]);

// -- Export -----------------------------------------------------------------

export const IMP_1241_UNIFIED_EXISTENCE_AUDIT = Object.freeze({
  id: 'imp-1241-unified-existence-conjecture',
  ticket: 'imp-1241',
  auditDate: '2026-05-28',
  paper: 'twin_ladder_consolidated_v52.pdf',
  paperSections: Object.freeze(['para 16.4', 'para 16.7', 'para 18.1', 'para 18.2']),

  question:
    'Are paper Conjectures 16.4, 16.6, 18.1, 18.2 all instances of a single ' +
    'de Branges canonical-system existence problem?',

  finalVerdict: FINAL_VERDICT,
  verdictRationale: VERDICT_RATIONALE,

  perConjecture: PER_CONJECTURE,
  perConjectureLookup: Object.freeze({
    '16.4': CONJ_16_4,
    '16.6': CONJ_16_6,
    '18.1': CONJ_18_1,
    '18.2': CONJ_18_2,
  }),

  unifiedConjecture: UNIFIED_CONJECTURE,

  referenceFrameworks: REFERENCE_FRAMEWORKS,

  honestScope: Object.freeze([
    'This audit uses training-time knowledge only. No external browsing. ' +
      'The verdicts on 16.4 / 16.6 / 18.1 / 18.2 are based on the textbook ' +
      'de Branges 1968 / Krein 1955 / Romanov 2010 bijection, which is ' +
      'robust against further literature search.',
    'The final verdict is three-of-four-unified rather than ' +
      'unified-de-branges-existence because Conjecture 18.2 lives on the ' +
      'Hadamard-logarithmic-derivative side (Re(X\'/X) > 0), not the ' +
      'canonical-system side. Forcing it into the CDB-Exist cluster would ' +
      'be a mismatch -- it belongs with 15.4 as a Re(xi\'/xi) > 0 inequality.',
    'The unified CDB-Exist conjecture is RH-equivalent (by Krein-de Branges ' +
      'bijection + shift-bridge threshold theorem). The open content is the ' +
      'NON-CIRCULAR construction of dm_a from Phi, not the existence of ' +
      'dm_a given Hermite-Biehler E_a (which is automatic). The paper ' +
      'should foreground the non-circularity constraint when presenting ' +
      'CDB-Exist.',
    'The recommendation to PARTIALLY-RELATED applies to each of 16.4, 16.6, ' +
      '18.1 individually: there is substantial prior work covering ' +
      'neighbouring existence theorems (de Branges 1968 H(E) existence, ' +
      'Krein 1955 dm-bijection, Anderson-Vongpanitlerd 1973 KYP passive ' +
      'realization), but the non-circular-from-Phi construction is novel ' +
      '(and open). Recommendation for 18.2 is SUBSUMED-BY-RH.',
    'Notational warning: B_a in Conjecture 16.4 (reproducing-kernel ' +
      'evaluation H_a -> functions on C_+) is NOT the same object as B_a ' +
      'in Conjecture 18.1 (Fourier sine channel A_a, B_a in E_a = A_a - i B_a). ' +
      'The paper should disambiguate before presenting them as corollaries ' +
      'of a unified statement.',
  ]),

  recommendationForPaper:
    'Reframe Conjectures 16.4 + 16.6 + 18.1 as a SINGLE unified conjecture ' +
    '(CDB-Exist: de Branges canonical-system existence non-circularly from ' +
    'Phi) with three corollaries listed by notation. Mark Conjecture 18.2 ' +
    'as SUBSUMED-BY-RH (paired Hadamard, same logic as 15.4 via imp-1202). ' +
    'This reduces the paper open-conjecture count by 3 (4 collapse to 1) ' +
    'and isolates the non-circularity constraint as the genuine open content.',

  crossReferences: Object.freeze([
    'imp-1218: parent paper-audit-dashboard ticket',
    'imp-1210: Conjecture 22.3 (bridge-norm realization) -- structurally ' +
      'identical to 16.4; PARTIALLY-RELATED via Weil 1952 / Bombieri 2003 / ' +
      'de Branges 1968 / Lagarias 2007',
    'imp-1202: Conjecture 15.4 (Re(xi\'/xi) > 0) -- SUBSUMED-BY-RH via ' +
      'paired Hadamard; 18.2 inherits the same verdict',
    'imp-1203: numerical pilot of Conjecture 18.2 (finite-w form) -- ' +
      'empirical-supports for Re(w) > 1/2 in the convergent half-plane',
    'imp-1232: Conjectures 17.3 + 18.4 (ghost-absence) -- the Krein-Langer ' +
      'negative-index side, complementary to CDB-Exist',
    'imp-1233: Conjecture 18.1 + 18.2 audit ticket -- partially overlapping ' +
      'scope; CDB-Exist unification supersedes it for 18.1',
  ]),
});

export default IMP_1241_UNIFIED_EXISTENCE_AUDIT;

// -- Build-time tripwires ---------------------------------------------------

export const IMP_1241_ASSERTIONS = [
  {
    id: 'imp1241-final-verdict-is-three-of-four-unified',
    why:
      'The audit concludes 16.4 + 16.6 + 18.1 unify under CDB-Exist while ' +
      '18.2 does not (it lives on the Hadamard logarithmic-derivative side). ' +
      'The final verdict must be three-of-four-unified.',
    holds: () => IMP_1241_UNIFIED_EXISTENCE_AUDIT.finalVerdict === 'three-of-four-unified',
  },
  {
    id: 'imp1241-four-conjectures-tracked',
    why:
      'The audit must cover exactly the 4 UNAUDITED constructive-existence- ' +
      'flavored conjectures named in the ticket: 16.4, 16.6, 18.1, 18.2. ' +
      'Adding or dropping one would misalign with the imp-1218 dashboard.',
    holds: () => {
      const ids = IMP_1241_UNIFIED_EXISTENCE_AUDIT.perConjecture.map((c) => c.id);
      const expected = ['16.4', '16.6', '18.1', '18.2'];
      if (ids.length !== expected.length) return false;
      const idSet = new Set(ids);
      return expected.every((e) => idSet.has(e));
    },
  },
  {
    id: 'imp1241-three-canonical-system-existence-conjectures',
    why:
      'Exactly three of the four (16.4, 16.6, 18.1) must be flagged ' +
      'isCanonicalSystemExistence = true; 18.2 must be flagged false. ' +
      'Misclassifying any of these would break the unification verdict.',
    holds: () => {
      const lk = IMP_1241_UNIFIED_EXISTENCE_AUDIT.perConjectureLookup;
      return lk['16.4'].isCanonicalSystemExistence === true &&
        lk['16.6'].isCanonicalSystemExistence === true &&
        lk['18.1'].isCanonicalSystemExistence === true &&
        lk['18.2'].isCanonicalSystemExistence === false;
    },
  },
  {
    id: 'imp1241-unified-conjecture-has-three-corollaries',
    why:
      'The unified CDB-Exist conjecture must list exactly the three ' +
      'corollaries 16.4, 16.6, 18.1 -- one per unified conjecture. The ' +
      'corollary derivations explain how each individual conjecture follows ' +
      'from CDB-Exist.',
    holds: () => {
      const cors = IMP_1241_UNIFIED_EXISTENCE_AUDIT.unifiedConjecture.corollaries;
      if (cors.length !== 3) return false;
      const ids = new Set(cors.map((c) => c.id));
      return ids.has('16.4-corollary') && ids.has('16.6-corollary') &&
        ids.has('18.1-corollary');
    },
  },
  {
    id: 'imp1241-18-2-explicitly-excluded-from-unification',
    why:
      'Conjecture 18.2 must be explicitly listed in unifiedConjecture. ' +
      'notUnifiedBy with a reason. Silently omitting it would hide a key ' +
      'classification decision (it belongs with 15.4 on the Hadamard side, ' +
      'not with 16.4/16.6/18.1 on the canonical-system side).',
    holds: () => {
      const nu = IMP_1241_UNIFIED_EXISTENCE_AUDIT.unifiedConjecture.notUnifiedBy;
      return Array.isArray(nu) && nu.length === 1 && nu[0].id === '18.2' &&
        typeof nu[0].reason === 'string' && nu[0].reason.length >= 80;
    },
  },
  {
    id: 'imp1241-unified-statement-mentions-non-circularity',
    why:
      'The unified statement must explicitly flag the non-circularity ' +
      'constraint (build dm_a from Phi NOT from the zero set), because ' +
      'that is the genuine open content -- existence given Hermite-Biehler ' +
      'E_a is automatic by de Branges 1968.',
    holds: () => {
      const s = IMP_1241_UNIFIED_EXISTENCE_AUDIT.unifiedConjecture.statement;
      return /NOT from the zero set/.test(s) || /non[-\s]circular/i.test(s);
    },
  },
  {
    id: 'imp1241-reference-frameworks-cover-de-branges-romanov',
    why:
      'The reference-framework survey must at minimum cover de Branges 1968 ' +
      'and Romanov 2010 -- the two textbook existence theorems for the ' +
      'CDB-Exist cluster. Krein-Langer 1977 must also be present (it is the ' +
      'ghost-side framework, complementary).',
    holds: () => {
      const ids = new Set(
        IMP_1241_UNIFIED_EXISTENCE_AUDIT.referenceFrameworks.map((f) => f.id),
      );
      return ids.has('de-branges-1968') && ids.has('romanov-2010') &&
        ids.has('krein-langer-1977');
    },
  },
  {
    id: 'imp1241-every-conjecture-has-recommendation',
    why:
      'Each of the 4 per-conjecture entries must carry a non-empty ' +
      'recommendationForPaper field (>= 80 chars). Empty recommendations ' +
      'leave the paper author without actionable guidance on how to reframe.',
    holds: () =>
      IMP_1241_UNIFIED_EXISTENCE_AUDIT.perConjecture.every(
        (c) => typeof c.recommendationForPaper === 'string' &&
          c.recommendationForPaper.length >= 80,
      ),
  },
  {
    id: 'imp1241-honest-scope-discloses-training-time-only',
    why:
      'The honestScope array must explicitly disclose training-time-only ' +
      'methodology (no external browsing) so future readers can judge the ' +
      'verdict\'s evidentiary weight. Hiding the methodology would overclaim.',
    holds: () => {
      const scope = IMP_1241_UNIFIED_EXISTENCE_AUDIT.honestScope;
      return Array.isArray(scope) && scope.length >= 4 &&
        scope.some((s) => /training-time|no external browsing/i.test(s));
    },
  },
  {
    id: 'imp1241-cross-references-include-imp-1202-and-imp-1210',
    why:
      'The audit verdicts cite imp-1202 (15.4 SUBSUMED-BY-RH via paired ' +
      'Hadamard, inherited by 18.2) and imp-1210 (22.3 PARTIALLY-RELATED via ' +
      'Weil/de Branges, structurally identical to 16.4). Both must appear ' +
      'in crossReferences.',
    holds: () => {
      const crefs = IMP_1241_UNIFIED_EXISTENCE_AUDIT.crossReferences.join(' | ');
      return crefs.includes('imp-1202') && crefs.includes('imp-1210');
    },
  },
  {
    id: 'imp1272-arov-nudelman-1996-in-unified-citations',
    why:
      'imp-1272 adds Arov-Nudelman 1996 as the infinite-dimensional passivity ' +
      'reference for the CDB-Exist <=> KYP-passive bridge in Conjecture 18.1. ' +
      'The citation must appear in UNIFIED_CONJECTURE.citations so the paper ' +
      'author sees the correct reference for the Hilbert-state-space realization.',
    holds: () => {
      const cits = IMP_1241_UNIFIED_EXISTENCE_AUDIT.unifiedConjecture.citations;
      return Array.isArray(cits) && cits.some((c) => /Arov.Nudelman.*1996|1996.*Arov.Nudelman/i.test(c));
    },
  },
  {
    id: 'imp1272-brodskii-1971-in-unified-citations',
    why:
      'imp-1272 adds Brodskii 1971 as the operator-colligation / unitary-extension ' +
      'reference for the infinite-dimensional passive realization. Must appear in ' +
      'UNIFIED_CONJECTURE.citations alongside Arov-Nudelman 1996.',
    holds: () => {
      const cits = IMP_1241_UNIFIED_EXISTENCE_AUDIT.unifiedConjecture.citations;
      return Array.isArray(cits) && cits.some((c) => /Brodskii.*1971|1971.*Brodskii/i.test(c));
    },
  },
  {
    id: 'imp1272-infin-dim-passivity-note-present-and-mentions-arov-nudelman',
    why:
      'imp-1272 adds a 2-paragraph derivation note (infiniteDimPassivityNote) ' +
      'explaining the infinite-dimensional passivity bridge that imp-1241 missed. ' +
      'The note must be non-empty (>= 200 chars) and explicitly mention Arov-Nudelman.',
    holds: () => {
      const note = IMP_1241_UNIFIED_EXISTENCE_AUDIT.unifiedConjecture.infiniteDimPassivityNote;
      return typeof note === 'string' && note.length >= 200 &&
        /Arov.Nudelman/i.test(note);
    },
  },
  {
    id: 'imp1272-infin-dim-passivity-note-mentions-brodskii',
    why:
      'The 2-paragraph derivation note must mention Brodskii, confirming both ' +
      'missing citations are documented. Arov-Nudelman alone is incomplete -- ' +
      'Brodskii supplies the colligation side of the bridge.',
    holds: () => {
      const note = IMP_1241_UNIFIED_EXISTENCE_AUDIT.unifiedConjecture.infiniteDimPassivityNote;
      return typeof note === 'string' && /Brodskii/i.test(note);
    },
  },
  {
    id: 'imp2334-conservative-class-and-regularity-note-present',
    why:
      'imp-2334 closes the imp-1245 axis-a gap by adding an explicit ' +
      'simple-conservative class disambiguation and a de Branges 1968 ' +
      'right-endpoint limit-point regularity check. The note must be present ' +
      '(>= 200 chars) and name BOTH the simple-conservative class and the ' +
      'limit-point case so the paper author sees the two extra hypotheses the ' +
      'unification rests on.',
    holds: () => {
      const note = IMP_1241_UNIFIED_EXISTENCE_AUDIT.unifiedConjecture.conservativeClassAndRegularityNote;
      return typeof note === 'string' && note.length >= 200 &&
        /simple.conservative/i.test(note) && /limit.point/i.test(note);
    },
  },
  {
    id: 'imp2335-outer-factor-rigidity-note-present',
    why:
      'imp-2335 addresses the imp-1245 axis-b 16.4-implication gap: the ' +
      'CDB-Exist => 16.4 identification H_a = H(E_a) is exact only if E_a ' +
      'carries no inner factor (outer-factor rigidity). The note must be ' +
      'present (>= 200 chars), localize the obstruction into a Blaschke part ' +
      'and a singular part, identify the Blaschke part with off-critical zeros, ' +
      'and honestly flag the overall result as RH-equivalent rather than an ' +
      'unconditional closure (a rigorous proof would prove RH).',
    holds: () => {
      const note = IMP_1241_UNIFIED_EXISTENCE_AUDIT.unifiedConjecture.outerFactorRigidityNote;
      return typeof note === 'string' && note.length >= 200 &&
        /Blaschke/.test(note) && /off-critical/i.test(note) &&
        /RH-EQUIVALENT|RH-equivalent/.test(note);
    },
  },
];
