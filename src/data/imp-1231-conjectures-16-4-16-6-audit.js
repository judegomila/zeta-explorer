/**
 * @fileoverview Literature audit of paper Conjectures 16.4 (shift-bridge square /
 * hidden-square kernel factorization) and 16.6 (canonical-system closure).
 * Exports CONJ_16_4_AUDIT and CONJ_16_6_AUDIT (frozen per-conjecture verdict
 * records), IMP_1231_AUDIT_SUMMARY (the combined summary), and
 * IMP_1231_ASSERTIONS (10 build-time tripwires).
 *
 * PROOF-CHAIN STEP: paper-audit leg for the v52 paper. It classifies the two
 * §16 constructive-existence conjectures against the established five-element
 * audit vocabulary. Both land at PARTIALLY-RELATED: each bundles an
 * RH-equivalent existence/Schur claim (SUBSUMED-BY-RH in isolation via the
 * shift-bridge threshold theorem Thm 15.1 and standard de Branges-space
 * machinery) with a genuinely-open non-circular construction constraint
 * (build H_a / B_a or the passive canonical-system Hamiltonian directly from
 * the completed Riemann kernel Phi, not from the zero set). The verdict
 * formalizes the paper own framing (lines 1630-1631 and 1722-1723).
 *
 * KEY ASSERTIONS: both verdicts equal PARTIALLY-RELATED; each equivalencePath
 * spells out at least 5 steps; de Branges (1968) cited for both; the Krein /
 * Romanov / Remling canonical-systems literature cited for 16.6; paper sections
 * pinned (§16.4, §16.7); audit ticket is imp-1231; a two-part reading and a
 * circularity test are present for each; the summary records the paper own
 * non-circular-construction framing.
 *
 * TICKETS: created by imp-1231; cross-references imp-1210, imp-1229, imp-1230,
 * imp-1232, imp-1184; verdict tracker in paper-audit-dashboard.js.
 *
 * @module imp-1231-conjectures-16-4-16-6-audit
 * @see imp-1231
 * @see imp-1210
 * @see imp-1229
 * @see imp-1230
 */

// imp-1231: Literature audit for paper Conjectures 16.4 (shift-bridge square)
//           and 16.6 (canonical-system closure).
//
// SCOPE
// -----
// Training-time knowledge only. No external browsing. Verdicts use
// the established five-element vocabulary from paper-audit-dashboard.js.
//
// STATEMENTS UNDER AUDIT (verbatim paraphrases from v52 PDF lines 1626-1631 and 1713-1720)
// ----------------------------------------------------------------------------------------
// Conjecture 16.4 (Shift-bridge square -- §16.4 "Route C: hidden-square kernel factorization"):
//   For every a > 0 there exists a Hilbert space H_a and a transform B_a,
//   built directly from the completed Riemann kernel and NOT from the zero set,
//   such that K_a(zeta, z) = <B_a(z), B_a(zeta)>_{H_a}.
//   Paper's own remark (line 1630): "By the equivalence theorem, this conjecture
//   implies RH. Conversely, RH supplies such a square abstractly through de
//   Branges theory. The open problem is to construct it non-circularly."
//
// Conjecture 16.6 (Canonical-system closure -- §16.7 "A concrete next target"):
//   For every a > 0, the shifted bridge ratio Theta_a(z) = E_a^#(z) / E_a(z)
//   is the transfer function of a passive canonical system constructed
//   directly from the completed Riemann kernel. Equivalently, Theta_a is
//   Schur in C_+ for every a > 0.
//
// VERDICT SUMMARY
// ---------------
// BOTH conjectures are PARTIALLY-RELATED. Each has two parts:
//   (a) An EXISTENCE conclusion (RKHS bracket / Schur transfer function)
//       which under the shift-bridge threshold theorem (Thm 15.1) is
//       equivalent to K_a ⪰ 0 for all a > 0, i.e. RH. This part is
//       SUBSUMED-BY-RH on its own.
//   (b) A NON-CIRCULAR CONSTRUCTION constraint -- the H_a / B_a / canonical
//       system must be built "directly from Phi" rather than from the zero
//       set. THIS constraint is what makes the conjectures genuinely open
//       and puts them in PARTIALLY-RELATED dialogue with de Branges 1968,
//       Krein 1955, Romanov 2010, Remling 2002/2018, Lagarias-Suzuki.
//
// The combined verdict is PARTIALLY-RELATED rather than SUBSUMED-BY-RH:
// the non-circular construction requirement is what carries the open
// mathematical content. This matches the v52 audit pattern (memory:
// project_v52_audit_pattern.md): the §16 constructive existence claims
// are different in shape from the §15/17/18 RH-restatements.
//
// KEY REFERENCES
// --------------
//   de Branges (1968), Hilbert Spaces of Entire Functions: gives K_a >= 0
//     <=> H(E_a) RKHS exists with K_a as reproducing kernel. Under RH this
//     supplies 16.4 abstractly -- but circularly (uses zero-freeness as
//     input via Hermite-Biehler condition on E_a).
//   Krein (1955), Continuous analogues of orthogonal polynomials: canonical
//     systems and their Weyl-Titchmarsh transfer functions. Foundation
//     for the passive-system framing in 16.6.
//   Romanov (2010), Canonical systems and de Branges spaces (arXiv 1408.6022
//     survey-style account; original 2010 work on inverse spectral theory):
//     gives the de Branges-canonical-system equivalence in modern form.
//     Every Hermite-Biehler E gives a canonical system; conversely passive
//     canonical systems with Schur transfer give Hermite-Biehler structure
//     functions.
//   Remling (2002, 2018), Schrodinger operators and de Branges spaces; the
//     book "Spectral theory of canonical systems" (2018). Establishes the
//     two-way correspondence with explicit Hamiltonian construction.
//   Lagarias (2007), survey of RH-equivalent reformulations -- catalogues
//     the de Branges / canonical-system formulations.
//   Lagarias-Suzuki (2006), "On a conjecture of Polya": de Branges-space
//     approach to RH-equivalent positivity criteria.
//   Burnol (2002), de Branges spaces and the Riemann xi function -- direct
//     construction attempts of de Branges spaces tied to xi.
//   Connes (1999), Trace formula in noncommutative geometry: spectral
//     interpretation framework adjacent to the canonical-system question.
//
// HONEST SCOPE
// ------------
// I cannot, from training knowledge alone, certify whether a "directly-from-
// Phi" non-circular canonical-system construction has been ruled out or
// produced in the literature. To my knowledge as of training, no such
// non-circular construction exists -- if it did, it would constitute a
// proof of RH. This is consistent with the paper's own framing ("the open
// problem is to construct it non-circularly"). Hence PARTIALLY-RELATED:
// the EXISTENCE statements are RH-equivalent and well-understood; the
// NON-CIRCULAR CONSTRUCTION question is open and is what these conjectures
// are really targeting.
//
// SYNTAX NOTE
// -----------
// No apostrophes inside single-quoted JS strings.

// -- Per-conjecture audit entries ----------------------------------------

export const CONJ_16_4_AUDIT = Object.freeze({
  id: '16.4',
  label: 'Conjecture 16.4',
  shortName: 'Shift-bridge square (hidden-square kernel factorization)',
  paperSection: '§16.4',
  paperPage: 19,
  paperPdfLines: '1626-1631',
  auditTicket: 'imp-1231',
  auditDate: '2026-05-28',
  verdict: 'PARTIALLY-RELATED',

  statement:
    'For every a > 0 there exists a Hilbert space H_a and a transform B_a, ' +
    'built directly from the completed Riemann kernel Phi and NOT from the ' +
    'zero set, such that K_a(zeta, z) = <B_a(z), B_a(zeta)>_{H_a}.',

  twoPartReading: Object.freeze({
    existenceClaim:
      'There exists an RKHS realization of K_a as a Gram kernel.',
    existenceVerdict:
      'SUBSUMED-BY-RH considered in isolation. Under RH the shifted bridge ' +
      'kernel K_a is positive semidefinite (shift-bridge threshold theorem, ' +
      'Thm 15.1) so K_a is a reproducing kernel and H(E_a) is its RKHS with ' +
      'B_a(z) = K_a(., z) (de Branges 1968). Conversely the existence of ' +
      'such (H_a, B_a) implies K_a ⪰ 0 which implies RH.',
    constructionConstraint:
      'The transform B_a must be built directly from the completed Riemann ' +
      'kernel Phi -- without using zero-freeness of xi as input.',
    constructionVerdict:
      'GENUINELY OPEN. PARTIALLY-RELATED to de Branges 1968 Thm 23-24, ' +
      'Krein canonical systems, and Lagarias 2007 survey. No known ' +
      'non-circular construction in published literature as of training.',
    combinedVerdict:
      'PARTIALLY-RELATED. The conjecture as STATED in the paper bundles ' +
      'an RH-equivalent existence claim with a non-circular construction ' +
      'constraint. The construction constraint is what carries the open ' +
      'content; that constraint is in dialogue with -- but not subsumed by ' +
      '-- existing de Branges / canonical-system literature.',
  }),

  equivalencePath: Object.freeze([
    'Step 1: K_a(zeta, z) is the Wronskian-type kernel (Aa(z)Ba(zeta) - Ba(z)Aa(zeta)) / (pi(zeta_bar - z)) ' +
      'associated with E_a(z) = X(a - iz) = A_a(z) - i B_a(z) (paper §15.3, §16.4).',
    'Step 2: A Hilbert-space Gram realization K_a(zeta, z) = <B_a(z), B_a(zeta)>_{H_a} EXISTS abstractly ' +
      'iff K_a is positive semidefinite as a kernel (Aronszajn 1950 RKHS theorem).',
    'Step 3: By the shift-bridge threshold theorem (Thm 15.1), K_a ⪰ 0 for every a > 0 iff Delta = 0 iff RH.',
    'Step 4: Therefore the EXISTENCE half of Conj 16.4 (ignoring the directly-from-Phi clause) is ' +
      'equivalent to RH; under RH the realization is supplied automatically by de Branges (1968) ' +
      'via the RKHS H(E_a) with B_a(z) = K_a(., z).',
    'Step 5: The NON-CIRCULAR clause ("built directly from Phi, not from the zero set") is the ' +
      'genuinely open content. The de Branges realization uses Hermite-Biehler of E_a as input, ' +
      'and that input requires zero-freeness of E_a in C+ -- which is the RH content. A ' +
      'directly-from-Phi construction would yield a non-circular proof of RH.',
    'Conclusion: PARTIALLY-RELATED. RH-equivalent existence + open non-circular construction.',
  ]),

  circularityTest:
    'Naive de Branges 1968 supplies (H_a, B_a) abstractly: H_a = H(E_a), B_a(z) = K_a(., z) ' +
    'as the reproducing kernel section. But this construction requires E_a to be a Hermite-Biehler ' +
    'structure function -- equivalent to K_a ⪰ 0 -- which is the RH content. Thus the de Branges ' +
    'route is circular: it assumes RH to construct (H_a, B_a). The paper correctly notes this ' +
    'on line 1631. A "directly-from-Phi" construction must avoid the Hermite-Biehler/positivity ' +
    'input. No such construction is known to me.',

  priorArtComparison: Object.freeze([
    {
      ref: 'de Branges (1968), Hilbert Spaces of Entire Functions',
      relevance:
        'Direct: H(E_a) is the canonical RKHS associated with E_a when E_a is Hermite-Biehler. ' +
        'K_a is its reproducing kernel; the abstract Gram realization is automatic. But the ' +
        'Hermite-Biehler hypothesis IS the RH content, so this route is circular.',
      overlap: 'RH-circular abstract existence',
    },
    {
      ref: 'Aronszajn (1950), Theory of reproducing kernels',
      relevance:
        'General RKHS theorem: positive-definite kernel <=> Gram realization. Reduces Conj 16.4 ' +
        'existence to K_a ⪰ 0.',
      overlap: 'Reduces to the positivity question',
    },
    {
      ref: 'Burnol (2002), de Branges spaces and the Riemann xi',
      relevance:
        'Attempts direct de-Branges-space constructions tied to xi. Adjacent to but not delivering ' +
        'the directly-from-Phi non-circular realization.',
      overlap: 'Adjacent program, same target',
    },
    {
      ref: 'Lagarias (2007), survey of RH-equivalent reformulations',
      relevance:
        'Catalogues many positivity reformulations of RH, including de-Branges-space and ' +
        'Hilbert-bracket forms. Confirms the existence claim is RH-equivalent.',
      overlap: 'Existence half subsumed-by-RH',
    },
    {
      ref: 'Connes (1999), Noncommutative geometry trace formula',
      relevance:
        'Spectral / Hilbert-space framework adjacent to canonical-system construction. Does not ' +
        'deliver the directly-from-Phi realization but is in the same conceptual family.',
      overlap: 'Adjacent spectral framework',
    },
  ]),

  recommendationForPaper:
    'CONFIRMED PARTIALLY-RELATED. Reframe Conjecture 16.4 in two parts: ' +
    '(a) EXISTENCE -- explicitly state this is RH-equivalent (paper already ' +
    'acknowledges this on line 1630); (b) NON-CIRCULAR CONSTRUCTION -- this ' +
    'is the genuinely open content. Cite de Branges 1968 (abstract circular ' +
    'realization), Aronszajn 1950 (general RKHS theorem), Burnol 2002 (adjacent ' +
    'direct-xi attempts), Lagarias 2007 (survey). Position Conj 16.4 as ' +
    'a CONTRIBUTION TO an existing line of work (de Branges realization for xi) ' +
    'with the non-circular-construction constraint as the precise open target.',
});

export const CONJ_16_6_AUDIT = Object.freeze({
  id: '16.6',
  label: 'Conjecture 16.6',
  shortName: 'Canonical-system closure',
  paperSection: '§16.7',
  paperPage: 20,
  paperPdfLines: '1713-1720',
  auditTicket: 'imp-1231',
  auditDate: '2026-05-28',
  verdict: 'PARTIALLY-RELATED',

  statement:
    'For every a > 0, the shifted bridge ratio Theta_a(z) = E_a^#(z) / E_a(z) ' +
    'is the transfer function of a passive canonical system constructed ' +
    'directly from the completed Riemann kernel Phi. Equivalently, Theta_a ' +
    'is Schur in C_+ for every a > 0.',

  twoPartReading: Object.freeze({
    existenceClaim:
      'Theta_a is Schur in C_+ for every a > 0 (equivalent half).',
    existenceVerdict:
      'SUBSUMED-BY-RH considered in isolation. Theta_a Schur for every a > 0 ' +
      'is the boundary-contractivity condition equivalent to K_a ⪰ 0 ' +
      '(paper §15.3 line 1208-1209: K_a positivity <=> E_a Hermite-Biehler ' +
      '<=> Theta_a Schur in upper half-plane). By Thm 15.1 this is RH.',
    constructionConstraint:
      'Theta_a must arise as the Weyl-Titchmarsh transfer function of a ' +
      'PASSIVE CANONICAL SYSTEM whose Hamiltonian H(t) is constructed ' +
      'directly from Phi (without using zero-freeness as input).',
    constructionVerdict:
      'GENUINELY OPEN. PARTIALLY-RELATED to Krein 1955 (canonical systems), ' +
      'de Branges 1968 (Thm 38-40 inverse spectral theorem for HB structure ' +
      'functions), Romanov 2010 (modern canonical-systems / de Branges-space ' +
      'inverse problem), Remling 2002/2018 (spectral theory of canonical ' +
      'systems). The inverse theorem gives a Hamiltonian from a HB structure ' +
      'function, but uses HB-ness (i.e. RH for E_a) as input, so it is ' +
      'circular. A directly-from-Phi Hamiltonian construction would close RH.',
    combinedVerdict:
      'PARTIALLY-RELATED. Same shape as 16.4: an RH-equivalent existence ' +
      'half bundled with an open non-circular construction half. The ' +
      'canonical-systems framing puts this in close dialogue with Krein, ' +
      'de Branges, Romanov, Remling -- but does not subsume it.',
  }),

  equivalencePath: Object.freeze([
    'Step 1: Theta_a(z) = E_a^#(z) / E_a(z) where E_a(z) = X(a - iz) (paper §15.3 line 1182).',
    'Step 2: Theta_a is Schur in C+ <=> K_a positive definite <=> E_a Hermite-Biehler ' +
      '(paper §15.3 line 1208-1209). This is a textbook de-Branges-space equivalence.',
    'Step 3: K_a ⪰ 0 for every a > 0 <=> Delta = 0 <=> RH (shift-bridge threshold Thm 15.1).',
    'Step 4: Therefore the Schur half of Conj 16.6 is equivalent to RH. ' +
      'The de Branges 1968 Thm 38 inverse problem then SUPPLIES the canonical system from ' +
      'the Hermite-Biehler structure function -- but that uses HB-ness as input, so this ' +
      'route is circular.',
    'Step 5: The directly-from-Phi clause asks for a passive canonical-system Hamiltonian ' +
      'H(t) built from the completed kernel Phi (without first knowing the zero locations). ' +
      'Then the Weyl-Titchmarsh transfer function of (J, H) would be Theta_a, and Schur-ness ' +
      'would follow by passivity. This is the (currently unrealized) non-circular closure.',
    'Step 6: A non-circular canonical-system construction would close all four §16 routes ' +
      '(Schur, de Branges positivity, hidden square, Weil) by the §16.1 equivalence theorem ' +
      '-- which is precisely the paper §16.7 "concrete next target" message.',
    'Conclusion: PARTIALLY-RELATED. RH-equivalent transfer-function statement plus an open ' +
      'non-circular Hamiltonian-construction problem.',
  ]),

  circularityTest:
    'The standard de Branges 1968 / Romanov 2010 path constructs the canonical system H(t) ' +
    'from the Hermite-Biehler structure function E_a via the inverse spectral theorem ' +
    '(de Branges Thm 38-40). But Hermite-Biehler-ness of E_a means E_a has no zeros in C+, ' +
    'which IS the RH content for the shifted bridge. So this route is CIRCULAR: it assumes ' +
    'RH to build the canonical system. A directly-from-Phi Hamiltonian H(t)[Phi] avoiding ' +
    'the circular HB-input is the open question. No such non-circular construction is known ' +
    'to me from training-time literature.',

  priorArtComparison: Object.freeze([
    {
      ref: 'Krein (1955), Continuous analogues of orthogonal polynomials',
      relevance:
        'Foundational: introduces canonical systems and their Weyl-Titchmarsh transfer functions. ' +
        'Establishes the framework Conj 16.6 lives in.',
      overlap: 'Framework foundation',
    },
    {
      ref: 'de Branges (1968), Hilbert Spaces of Entire Functions, Thm 38-40',
      relevance:
        'Inverse spectral theorem: Hermite-Biehler structure function E <=> canonical system ' +
        '(J, H). Supplies the canonical system from E_a abstractly but requires HB-ness of ' +
        'E_a as input (circular for our purpose).',
      overlap: 'Abstract circular realization',
    },
    {
      ref: 'Romanov (2010, 2014), Canonical systems and de Branges spaces',
      relevance:
        'Modern account of the two-way correspondence between canonical systems and de ' +
        'Branges spaces. Confirms the abstract equivalence; does not deliver a directly-from-Phi ' +
        'Hamiltonian for the Riemann xi.',
      overlap: 'Modern formulation, same target',
    },
    {
      ref: 'Remling (2002, 2018), Spectral theory of canonical systems',
      relevance:
        'Book-length treatment of canonical systems including explicit Hamiltonian construction ' +
        'and inverse-problem methods. Closest to what Conj 16.6 needs but does not specialize ' +
        'to the Riemann case.',
      overlap: 'Closest method-set',
    },
    {
      ref: 'Lagarias-Suzuki (2006), On a conjecture of Polya',
      relevance:
        'de-Branges-space approach to RH-equivalent positivity criteria. Adjacent to the ' +
        '§16.4 / §16.6 program.',
      overlap: 'Adjacent positivity-criterion program',
    },
    {
      ref: 'Burnol (2002), de Branges spaces and the Riemann xi',
      relevance:
        'Direct de-Branges-space constructions for xi. Adjacent to but not delivering the ' +
        'directly-from-Phi canonical system.',
      overlap: 'Adjacent direct-xi attempts',
    },
    {
      ref: 'Connes (1999), Trace formula in noncommutative geometry',
      relevance:
        'Provides a spectral interpretation of zeta zeros as eigenvalues of an absorption ' +
        'operator -- a conceptually adjacent (but different) Hilbert-operator framework. ' +
        'Does not deliver the canonical-system Hamiltonian directly.',
      overlap: 'Adjacent spectral interpretation',
    },
  ]),

  recommendationForPaper:
    'CONFIRMED PARTIALLY-RELATED. Reframe Conjecture 16.6 in two parts: ' +
    '(a) SCHUR / TRANSFER-FUNCTION CHARACTERIZATION -- explicitly RH-equivalent ' +
    'by the shift-bridge threshold theorem and paper §15.3 line 1208-1209 ' +
    '(K_a positivity <=> Theta_a Schur). (b) DIRECTLY-FROM-PHI HAMILTONIAN ' +
    'CONSTRUCTION -- the open content. Cite Krein 1955, de Branges 1968 ' +
    '(Thm 38-40 inverse spectral theorem), Romanov 2010, Remling 2002/2018, ' +
    'Lagarias-Suzuki 2006, Burnol 2002, Connes 1999. Position §16.7 ' +
    'explicitly as "the inverse-spectral theorem for the Riemann case" -- ' +
    'the existence of a canonical system whose Hamiltonian is built ' +
    'non-circularly from Phi. This is the right framing for §16.7 ' +
    'because it makes the canonical-systems literature directly applicable.',
});

// -- Audit summary --------------------------------------------------------

export const IMP_1231_AUDIT_SUMMARY = Object.freeze({
  id: 'imp-1231-conjectures-16-4-16-6-audit',
  ticket: 'imp-1231',
  auditDate: '2026-05-28',
  paper: 'twin_ladder_consolidated_v52.pdf',
  paperSections: Object.freeze(['§16.4', '§16.7']),

  verdicts: Object.freeze({
    '16.4': 'PARTIALLY-RELATED',
    '16.6': 'PARTIALLY-RELATED',
  }),

  sharedRationale:
    'Both conjectures are CONSTRUCTIVE EXISTENCE CLAIMS with the same ' +
    'two-part shape: (a) an existence/equivalent statement which is RH-equivalent ' +
    'by the shift-bridge threshold theorem (Thm 15.1) and the standard ' +
    'de Branges-space machinery; (b) a non-circular construction constraint ' +
    '("built directly from Phi, not from the zero set") which is genuinely ' +
    'open. The combined verdict is PARTIALLY-RELATED -- distinct in shape ' +
    'from the §15/17/18 audits which were all SUBSUMED-BY-RH because they ' +
    'lacked the construction-constraint clause.',

  consistentWithAuditPatternMemory:
    'This matches the expected verdict in project_v52_audit_pattern.md: ' +
    '"the §16 constructive existence claims (16.4, 16.6) are PARTIALLY-RELATED ' +
    'to de Branges canonical-system theory rather than SUBSUMED."',

  genuinelyOpenContent:
    'The directly-from-Phi non-circular construction problem: build either ' +
    '(i) the Hilbert space H_a and transform B_a (Conj 16.4), or ' +
    '(ii) the passive canonical-system Hamiltonian H(t) (Conj 16.6), ' +
    'directly from the completed Riemann kernel Phi without using ' +
    'zero-freeness as input. Either construction would close all four §16 ' +
    'routes (Schur / de Branges / hidden-square / Weil) and prove RH.',

  consistentWithPaperOwnFraming:
    'The paper itself states this on line 1630-1631 for 16.4: "By the ' +
    'equivalence theorem, this conjecture implies RH. Conversely, RH ' +
    'supplies such a square abstractly through de Branges theory. The open ' +
    'problem is to construct it non-circularly." Line 1722-1723 for 16.6: ' +
    '"This conjecture is RH-equivalent, but it is now a concrete operator-' +
    'theoretic target: build the passive system from the kernel without ' +
    'using the zero set." The audit verdict simply formalizes this framing.',

  crossReferences: Object.freeze([
    'imp-1210: Conjecture 22.3 (bridge-norm realization -- PARTIALLY-RELATED, structurally similar)',
    'imp-1229: Conjecture 15.2 (shift contractivity -- SUBSUMED-BY-RH, the equivalent half here)',
    'imp-1230: Conjecture 15.3 (E_a Hermite-Biehler -- SUBSUMED-BY-RH, the equivalent half here)',
    'imp-1232: Conjectures 17.3, 18.4 (ghost-absence -- SUBSUMED-BY-RH)',
    'imp-1184: Direct-Selberg ESY route -- shares the "construction constraint" honest-scope pattern',
    'paper-audit-dashboard.js: master verdict tracker',
  ]),
});

// -- Build-time tripwires -------------------------------------------------

export const IMP_1231_ASSERTIONS = [
  {
    id: 'imp1231-16-4-verdict-is-partially-related',
    why:
      'Conjecture 16.4 bundles an RH-equivalent existence claim with a ' +
      'non-circular construction constraint. The construction constraint is ' +
      'genuinely open. Combined verdict is PARTIALLY-RELATED, not SUBSUMED-BY-RH ' +
      '-- the construction-constraint clause is what differentiates it.',
    holds: () => CONJ_16_4_AUDIT.verdict === 'PARTIALLY-RELATED',
  },
  {
    id: 'imp1231-16-6-verdict-is-partially-related',
    why:
      'Conjecture 16.6 bundles an RH-equivalent Schur statement with the ' +
      'open directly-from-Phi canonical-system Hamiltonian construction. ' +
      'Combined verdict is PARTIALLY-RELATED.',
    holds: () => CONJ_16_6_AUDIT.verdict === 'PARTIALLY-RELATED',
  },
  {
    id: 'imp1231-equivalence-path-has-five-plus-steps',
    why:
      'The equivalence argument for each conjecture must spell out at least 5 steps ' +
      'so the two-part reading (existence-half / construction-half) is auditable.',
    holds: () =>
      CONJ_16_4_AUDIT.equivalencePath.length >= 5 &&
      CONJ_16_6_AUDIT.equivalencePath.length >= 5,
  },
  {
    id: 'imp1231-de-branges-cited-for-both',
    why:
      'de Branges (1968) is the load-bearing reference for both conjectures ' +
      '(RKHS H(E_a) for 16.4; inverse spectral theorem Thm 38-40 for 16.6). ' +
      'It must appear in priorArtComparison for both.',
    holds: () =>
      CONJ_16_4_AUDIT.priorArtComparison.some((r) =>
        r.ref.toLowerCase().includes('de branges')) &&
      CONJ_16_6_AUDIT.priorArtComparison.some((r) =>
        r.ref.toLowerCase().includes('de branges')),
  },
  {
    id: 'imp1231-canonical-systems-literature-cited-for-16-6',
    why:
      'Conj 16.6 is explicitly about canonical systems. The audit must cite ' +
      'the Krein / Romanov / Remling literature to establish PARTIALLY-RELATED ' +
      'rather than guessing INDEPENDENT-NOVEL or SUBSUMED.',
    holds: () => {
      const refs = CONJ_16_6_AUDIT.priorArtComparison.map((r) =>
        r.ref.toLowerCase());
      const hasKrein = refs.some((r) => r.includes('krein'));
      const hasRomanov = refs.some((r) => r.includes('romanov'));
      const hasRemling = refs.some((r) => r.includes('remling'));
      return hasKrein && hasRomanov && hasRemling;
    },
  },
  {
    id: 'imp1231-paper-section-references-correct',
    why:
      'The audit must pin the correct paper sections (§16.4 for Conj 16.4, ' +
      '§16.7 for Conj 16.6). Wrong section numbers disconnect from the source.',
    holds: () =>
      CONJ_16_4_AUDIT.paperSection === '§16.4' &&
      CONJ_16_6_AUDIT.paperSection === '§16.7',
  },
  {
    id: 'imp1231-audit-ticket-is-imp-1231',
    why:
      'Both audit entries must point at imp-1231. Wrong ticket would break ' +
      'the completedAuditTickets cross-reference in paper-audit-dashboard.js.',
    holds: () =>
      CONJ_16_4_AUDIT.auditTicket === 'imp-1231' &&
      CONJ_16_6_AUDIT.auditTicket === 'imp-1231',
  },
  {
    id: 'imp1231-two-part-reading-present',
    why:
      'The audit verdict depends on a two-part reading (existence-half / ' +
      'construction-half). Each conjecture must carry a twoPartReading object ' +
      'with both halves named and a combinedVerdict.',
    holds: () => {
      const has = (a) =>
        a.twoPartReading &&
        typeof a.twoPartReading.existenceVerdict === 'string' &&
        typeof a.twoPartReading.constructionVerdict === 'string' &&
        typeof a.twoPartReading.combinedVerdict === 'string';
      return has(CONJ_16_4_AUDIT) && has(CONJ_16_6_AUDIT);
    },
  },
  {
    id: 'imp1231-circularity-test-acknowledged',
    why:
      'The audit must explicitly acknowledge that the naive de Branges ' +
      'realization route is CIRCULAR (uses Hermite-Biehler/RH as input). ' +
      'This is the load-bearing observation justifying PARTIALLY-RELATED ' +
      'rather than SUBSUMED-BY-RH.',
    holds: () => {
      const has = (a) =>
        typeof a.circularityTest === 'string' &&
        /circular/i.test(a.circularityTest);
      return has(CONJ_16_4_AUDIT) && has(CONJ_16_6_AUDIT);
    },
  },
  {
    id: 'imp1231-recommendation-acknowledges-paper-own-framing',
    why:
      'The paper itself acknowledges the non-circular-construction problem ' +
      '(line 1630-1631 for 16.4; line 1722-1723 for 16.6). The audit summary ' +
      'must record this so the reframing is consistent with the paper author intent.',
    holds: () =>
      typeof IMP_1231_AUDIT_SUMMARY.consistentWithPaperOwnFraming === 'string' &&
      IMP_1231_AUDIT_SUMMARY.consistentWithPaperOwnFraming.length >= 100,
  },
];
