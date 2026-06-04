/**
 * @fileoverview Literature audit for twin_ladder_consolidated_v52.pdf Section 22
 * Conjectures 22.1-22.4, classifying each against published prior work.
 *
 * @module data/imp-1210-conjecture-22-literature-audit
 *
 * Exports:
 *  - IMP_1210_CONJECTURE_22_LITERATURE_AUDIT (default + named): frozen audit
 *    record with the four conjectures, their related_work citations, per-
 *    conjecture verdicts, an overall_verdict, and an honestScope disclaimer.
 *  - IMP_1210_CONJECTURE_22_LITERATURE_AUDIT_ASSERTIONS: build-time tripwires
 *    consumed by run-assertions.mjs to keep the audit structurally honest.
 *
 * Proof-chain role: a documentation / paper-hygiene step (not a numerical proof
 * link). Following the imp-1163 precedent it walks each Section 22 target
 * through training-time literature to decide SUBSUMED / PARTIALLY-RELATED /
 * INDEPENDENT-NOVEL before the paper ships. Key verdict: reframe 22.4 as an
 * RH-equivalent and cite existing literature for 22.2/22.3.
 *
 * Tickets: created by imp-1210; parallel audits imp-1163, imp-1197, imp-1212;
 * module-doc added by imp-2409.
 */

// imp-1210: Literature audit for paper Section 22 Conjectures 22.1-22.4.
//
// PURPOSE
// -------
// twin_ladder_consolidated_v52.pdf Section 22 (page 32) collects four
// conjectures/theorem targets that frame the residual gap between the
// paper's twin-ladder/bridge programme and an unconditional proof of RH:
//
//   22.1 Twin-ladder usefulness
//        There exists a frozen-ladder approximation whose certified
//        remainder bound in the classical case is smaller, at equal
//        runtime, than a comparable baseline approximation.
//
//   22.2 Admissible pressure families
//        There exists a nontrivial family M_{beta, P} satisfying
//        completed-kernel admissibility and approximable by real-zero
//        preserving universal factors.
//
//   22.3 Bridge-norm realization
//        The Weil/twin-ladder quadratic form admits a non-circular
//        norm-square realization Q_TL[h] = || B_xi h ||^2.
//
//   22.4 Zero bridge-thickness
//        For every a > 0, the shifted bridge function
//        E_a(z) = xi(1/2 + a - i z) is Hermite-Biehler. Equivalently the
//        shifted bridge kernel K_a is positive definite for every a > 0.
//
// Per the imp-1163 precedent (which found paper Section 4.5 Conjecture 1
// was subsumed by Hughes-Rudnick 2003 + Bourgade 2010), we owe each of
// these four conjectures the same explicit walk through the published
// literature BEFORE the paper ships a final draft.
//
// SCOPE
// -----
// Training-time knowledge only. No external browsing, MathSciNet, arXiv
// search, or recent (2024-2026) preprint sweep. The verdicts here name
// the closest published prior work known to the author at training time
// and classify the overlap as one of:
//
//   SUBSUMED          a named published theorem directly implies the
//                     conjecture (possibly up to translation of
//                     notation), so it should not be advertised as a
//                     new conjecture.
//   PARTIALLY-RELATED prior work covers a related statement but does
//                     not directly imply the conjecture; the conjecture
//                     is a sharpening / specialization / re-packaging.
//   INDEPENDENT-NOVEL the conjecture is genuinely new in the published
//                     literature known at training time; it may still
//                     be folklore.
//
// HONEST READ
// -----------
// 22.1 is INDEPENDENT-NOVEL as a specific quantitative claim about the
//      paper's frozen-ladder approximation, but PARTIALLY-RELATED to a
//      large body of literature on Mellin-Barnes / Riemann-Siegel /
//      smoothed-explicit-formula remainder bounds.
// 22.2 is PARTIALLY-RELATED to a large body of work on universal
//      factors / Laguerre-Polya class / Hermite-Biehler functions
//      (Newman 1976, Csordas-Norfolk-Varga 1988, Stahl-Totik 1992) and
//      to thermodynamic-formalism-style pressure families
//      (Bost-Connes 1995), but the SPECIFIC "completed-kernel
//      admissibility + real-zero-preserving universal factor" framing
//      is not directly subsumed.
// 22.3 is PARTIALLY-RELATED to Weil's positivity criterion (Weil 1952,
//      Bombieri 2003) and to de Branges space theory (de Branges 1968,
//      Lagarias 2007), which give DIFFERENT norm-square realizations
//      of the Weil quadratic form. The "non-circular" qualifier is the
//      novel content: an explicit factorization Q = ||B h||^2 with B
//      built from xi without using zero-freeness as an input.
// 22.4 is the major item. The Hermite-Biehler property of E_a(z) for
//      every a > 0 is well-known to be EQUIVALENT to RH (this is the
//      de Branges / Lagarias formulation). So 22.4 is exactly RH
//      restated, NOT a stepping stone, and the paper should not list
//      it as a "conjecture to prove" in the same breath as 22.1-22.3.
//      The de Bruijn-Newman framework + Rodgers-Tao 2018 give RELATED
//      but distinct positivity-on-flow statements.
//
// RECOMMENDED PAPER CHANGE
// ------------------------
// Reframe Section 22 honestly:
//   - 22.1 keep as a concrete benchmark conjecture (it is genuinely a
//     new quantitative claim; flag it as benchmarkable not theoretical).
//   - 22.2 reframe with explicit citations to Newman / Csordas-Norfolk-
//     Varga / Bost-Connes; clarify what is novel beyond universal-factor
//     theory.
//   - 22.3 reframe with explicit citation to Weil 1952 / Bombieri 2003 /
//     de Branges 1968 / Lagarias 2007; isolate the "non-circular"
//     constraint as the actual novel content.
//   - 22.4 acknowledge openly that 22.4 = RH (de Branges / Lagarias
//     formulation). Move it out of "theorem targets" and into a
//     standalone "RH-equivalent reformulation" subsection. Cite
//     de Branges 1968 and Lagarias 2007 explicitly. Mention the
//     Rodgers-Tao 2018 de Bruijn-Newman framework as the closest
//     unconditional positive-direction result.
//
// SYNTAX NOTE
// -----------
// JSDoc comments do NOT use close-comment sequences. All JS string
// literals use single quotes and avoid apostrophes inside.

// -- Per-conjecture audit records -----------------------------------------

const CONJECTURES = [
  {
    id: '22.1',
    name: 'Twin-ladder usefulness',
    paraphrased_statement:
      'There exists a frozen-ladder approximation to the completed zeta function ' +
      'whose certified remainder bound in the classical case is smaller, at equal ' +
      'runtime, than a comparable baseline approximation (e.g. Riemann-Siegel or ' +
      'a smoothed explicit-formula sum).',
    related_work: [
      {
        author: 'Riemann-Siegel (classical)',
        year: 1932,
        title: 'Riemann-Siegel formula (posthumous, Siegel)',
        venue: 'Quellen Studien zur Geschichte der Math. Astron. Physik B 2 (1932), 45-80',
        relevance:
          'Canonical algorithm for evaluating zeta(1/2 + it) at large t with ' +
          'explicit asymptotic remainder. The natural baseline against which any ' +
          '"useful frozen-ladder" candidate must be benchmarked.',
      },
      {
        author: 'Odlyzko-Schonhage',
        year: 1988,
        title: 'Fast algorithms for multiple evaluations of the Riemann zeta function',
        venue: 'Trans. AMS 309, 797-809',
        relevance:
          'Best published practical algorithm for bulk zeta evaluation; gives the ' +
          'state-of-the-art runtime against which a frozen-ladder must compete to ' +
          'be useful. Does not directly subsume a remainder-bound improvement ' +
          'claim, but constrains the bar for "useful at equal runtime".',
      },
      {
        author: 'Hiary',
        year: 2011,
        title: 'Fast methods to compute the Riemann zeta function',
        venue: 'Ann. of Math. 174, 891-946',
        relevance:
          'Sharpens Odlyzko-Schonhage to O(t^{1/3}) per evaluation. Same ' +
          'baseline-runtime role as Odlyzko-Schonhage for the conjecture.',
      },
      {
        author: 'Platt-Trudgian',
        year: 2021,
        title: 'The Riemann hypothesis is true up to 3 * 10^{12}',
        venue: 'Bull. London Math. Soc. 53, 792-797',
        relevance:
          'State-of-the-art rigorous numerical verification using interval ' +
          'arithmetic. The specific worked-example "classical case" benchmark ' +
          'against which a frozen-ladder useful claim must show improved bounds.',
      },
    ],
    overlap: 'INDEPENDENT-NOVEL',
    rationale:
      'The QUALITATIVE statement (some new ladder beats some baseline) is so weak ' +
      'that it is unfalsifiable. The QUANTITATIVE form (a specific frozen ladder ' +
      'beats Riemann-Siegel / Odlyzko-Schonhage / Hiary at equal runtime with a ' +
      'certified remainder bound) is genuinely new because no published frozen-' +
      'ladder competitor exists in the named numerical-zeta literature. ' +
      'PARTIALLY-RELATED as a research direction; INDEPENDENT-NOVEL as the ' +
      'specific quantitative claim.',
    recommendation_for_paper:
      'KEEP as a concrete benchmark target. Strengthen the conjecture by naming ' +
      'the baseline explicitly (Platt-Trudgian 2021 interval arithmetic at ' +
      'T = 3e12 is the natural anchor) and naming a target runtime regime. Cite ' +
      'Riemann-Siegel / Odlyzko-Schonhage / Hiary as the runtime benchmarks. The ' +
      'paper imp-440 / imp-963 finite-height beat (Lambda <= 0.02 at N* = 1e4) ' +
      'already partially realizes this conjecture in the de Bruijn-Newman setting.',
  },

  {
    id: '22.2',
    name: 'Admissible pressure families',
    paraphrased_statement:
      'There exists a nontrivial family M_{beta, P} of completed-kernel-admissible ' +
      'deformations of xi indexed by a thermodynamic-style pressure parameter P ' +
      'and an inverse-temperature parameter beta, and the family is approximable ' +
      'by real-zero-preserving universal factors (i.e. Laguerre-Polya class ' +
      'operators).',
    related_work: [
      {
        author: 'Newman',
        year: 1976,
        title: 'Fourier transforms with only real zeros',
        venue: 'Proc. AMS 61, 245-251',
        relevance:
          'Introduced the de Bruijn-Newman flow H_t(z) = integral Phi(u) exp(t u^2 + i z u) du ' +
          'as a one-parameter family of deformations of xi by a universal Gaussian ' +
          'factor. This is the prototype "admissible deformation by a real-zero-' +
          'preserving universal factor" and the paper M_{beta, P} family generalizes it.',
      },
      {
        author: 'Csordas-Norfolk-Varga',
        year: 1988,
        title: 'The Riemann Hypothesis and the Turan inequalities',
        venue: 'Trans. AMS 296, 521-541',
        relevance:
          'Develops the Laguerre-Polya / universal-factor framework for ' +
          'deformations of xi preserving real zeros. Gives sufficient conditions ' +
          '(Turan / Laguerre inequalities) for a perturbation to preserve real ' +
          'zeros. Closest published technology to "real-zero-preserving universal ' +
          'factors" in the paper.',
      },
      {
        author: 'Stahl-Totik',
        year: 1992,
        title: 'General Orthogonal Polynomials',
        venue: 'Cambridge University Press, Encyclopedia of Mathematics 43',
        relevance:
          'Provides the general theory of measures dmu on R with regularity ' +
          'conditions ("admissibility") for which approximation by polynomials with ' +
          'real zeros is dense. The thermodynamic-pressure parameter P in the ' +
          'paper plays the role of the Stahl-Totik logarithmic-equilibrium ' +
          'potential weight. PARTIALLY-RELATED at the technology level.',
      },
      {
        author: 'Bost-Connes',
        year: 1995,
        title: 'Hecke algebras, type III factors and phase transitions with spontaneous symmetry breaking in number theory',
        venue: 'Selecta Mathematica 1, 411-457',
        relevance:
          'Introduces a thermodynamic-formalism-style C^*-algebra associated to ' +
          'the Riemann zeta function with a beta = inverse-temperature phase ' +
          'transition at beta = 1. The paper M_{beta, P} family inherits the ' +
          'BETA parameter language from Bost-Connes thermodynamic-formalism ' +
          'tradition. PARTIALLY-RELATED in language and conceptual setup, but ' +
          'Bost-Connes is operator-algebraic and the paper M_{beta, P} is ' +
          'function-theoretic (universal-factor based); they do not subsume one ' +
          'another.',
      },
      {
        author: 'Polya',
        year: 1927,
        title: 'Bemerkung uber die Integraldarstellung der Riemannschen Xi-Funktion',
        venue: 'Acta Math. 48, 305-317',
        relevance:
          'The original Polya criterion: xi(z) is the Fourier transform of an ' +
          'even positive measure (Phi). Universal-factor deformations preserve the ' +
          'Polya class. Foundational for ALL real-zero-preserving deformation ' +
          'theory.',
      },
    ],
    overlap: 'PARTIALLY-RELATED',
    rationale:
      'The general framework "deform xi by a parameter family of real-zero-' +
      'preserving universal factors" is the de Bruijn-Newman / Csordas-Norfolk-' +
      'Varga programme, well-developed since 1976. The "thermodynamic pressure" ' +
      'language is the Bost-Connes / KMS-state direction. The specific ' +
      '"completed-kernel admissibility" criterion the paper requires is, as far ' +
      'as I can tell from training-time knowledge, not directly named in the ' +
      'published literature -- but the criterion is close enough to known ' +
      'admissibility conditions in Csordas-Norfolk-Varga and Stahl-Totik that the ' +
      'novelty bar is "specific axiomatization" rather than "new direction".',
    recommendation_for_paper:
      'REFRAME with explicit citations to Newman 1976, Csordas-Norfolk-Varga ' +
      '1988, Polya 1927, and Bost-Connes 1995. Isolate the novel content: ' +
      'EXACTLY which admissibility axiom in the M_{beta, P} family is not ' +
      'subsumed by existing universal-factor theory? If the answer is "none -- ' +
      'it is a re-axiomatization", flag the conjecture as a definitional ' +
      'reformulation rather than an open problem. If there is genuine new ' +
      'content (e.g. a pressure-parameter scaling not previously studied), ' +
      'state that content explicitly.',
  },

  {
    id: '22.3',
    name: 'Bridge-norm realization',
    paraphrased_statement:
      'The Weil/twin-ladder quadratic form Q_TL[h] admits a non-circular norm-' +
      'square realization Q_TL[h] = ||B_xi h||^2, where B_xi is a bounded ' +
      'linear operator constructed from xi without using zero-freeness as an ' +
      'input.',
    related_work: [
      {
        author: 'Weil',
        year: 1952,
        title: 'Sur les "formules explicites" de la theorie des nombres premiers',
        venue: 'Comm. Sem. Math. Univ. Lund (1952), 252-265',
        relevance:
          'The original Weil explicit-formula positivity criterion: RH is ' +
          'equivalent to Q_Weil[h] >= 0 for all admissible test functions h. ' +
          'Establishes the QUADRATIC FORM but does NOT exhibit a norm-square ' +
          'realization; that is what Conjecture 22.3 demands.',
      },
      {
        author: 'Bombieri',
        year: 2003,
        title: 'A variational approach to the explicit formula',
        venue: 'Comm. Pure Appl. Math. 56, 1151-1164',
        relevance:
          'Refines Weil to a variational principle. Shows positivity reduces to ' +
          'a generalized Pick-Nevanlinna interpolation problem. CLOSEST published ' +
          'work to a "norm-square realization", but the realization Bombieri ' +
          'gives is CIRCULAR in the sense Conjecture 22.3 forbids: the operator ' +
          'B is built using the zero set of xi.',
      },
      {
        author: 'de Branges',
        year: 1968,
        title: 'Hilbert Spaces of Entire Functions',
        venue: 'Prentice-Hall, Englewood Cliffs',
        relevance:
          'Foundational text for the spaces H(E) where E is Hermite-Biehler. ' +
          'The de Branges norm ||f||_{H(E)}^2 is a SPECIFIC norm-square ' +
          'realization of a positivity-criterion quadratic form. Conjecture 22.3 ' +
          'asks for a de-Branges-style realization with the additional non-' +
          'circularity constraint, i.e. that E itself is built from xi without ' +
          'first knowing the zeros are real. This is a NEW constraint atop a ' +
          'known framework.',
      },
      {
        author: 'Lagarias',
        year: 2007,
        title: 'Hilbert spaces of entire functions and Dirichlet L-functions',
        venue: 'Frontiers in Number Theory, Physics, and Geometry I, 365-377',
        relevance:
          'Surveys de-Branges-space attacks on RH for zeta and L-functions. ' +
          'Notes explicitly that all known constructions of an E with H(E) ' +
          'realizing the Weil form REQUIRE RH as input. So Lagarias confirms ' +
          'that the non-circular realization Conjecture 22.3 demands is exactly ' +
          'the missing piece and is OPEN.',
      },
      {
        author: 'Connes',
        year: 1999,
        title: 'Trace formula in noncommutative geometry and the zeros of the Riemann zeta function',
        venue: 'Selecta Math. 5, 29-106',
        relevance:
          'Spectral interpretation programme. Gives a different (operator-' +
          'algebraic) realization of the Weil positivity. PARTIALLY-RELATED but ' +
          'arguably also circular in the sense Conjecture 22.3 wants to avoid: ' +
          'the relevant operator H is defined via a quotient that bakes in the ' +
          'arithmetic structure of zeros.',
      },
    ],
    overlap: 'PARTIALLY-RELATED',
    rationale:
      'The Weil quadratic form Q_TL is classical (Weil 1952); a norm-square ' +
      'realization Q = ||B h||^2 is automatic from the spectral theorem once ' +
      'Q >= 0 is established (which is what RH gives). The de Branges / ' +
      'Lagarias programme provides realizations BUT requires RH as input. ' +
      'Conjecture 22.3 NOVEL CONTENT: the demand that B be constructed from ' +
      'xi without using zero-freeness. This is a published OPEN PROBLEM ' +
      '(Lagarias 2007 surveys it as such), not subsumed in the literature. ' +
      'PARTIALLY-RELATED because the surrounding theory (Weil, de Branges, ' +
      'Bombieri) is well-developed; the SPECIFIC non-circular form is open.',
    recommendation_for_paper:
      'REFRAME with explicit citations to Weil 1952, Bombieri 2003, de Branges ' +
      '1968, Lagarias 2007, and Connes 1999. State the conjecture as: "we seek ' +
      'a de-Branges-space realization of the Weil form in which the structure ' +
      'function E is constructed from xi without circular use of RH". This is ' +
      'an OPEN problem already in the literature (Lagarias 2007 surveys it), ' +
      'so position 22.3 as a CONTRIBUTION TO an existing line of work rather ' +
      'than a free-standing new conjecture.',
  },

  {
    id: '22.4',
    name: 'Zero bridge-thickness',
    paraphrased_statement:
      'For every a > 0, the shifted bridge function E_a(z) = xi(1/2 + a - i z) ' +
      'is Hermite-Biehler. Equivalently the shifted bridge kernel K_a is ' +
      'positive definite for every a > 0.',
    related_work: [
      {
        author: 'de Branges',
        year: 1968,
        title: 'Hilbert Spaces of Entire Functions',
        venue: 'Prentice-Hall, Englewood Cliffs',
        relevance:
          'The Hermite-Biehler property of E_a for every a > 0 is, via the ' +
          'standard de Branges machinery, EQUIVALENT to xi having only real ' +
          'zeros. This is essentially the de Branges formulation of RH. So ' +
          'Conjecture 22.4 is not a stepping stone toward RH; it IS RH ' +
          '(up to standard translation).',
      },
      {
        author: 'Lagarias',
        year: 2007,
        title: 'Hilbert spaces of entire functions and Dirichlet L-functions',
        venue: 'Frontiers in Number Theory, Physics, and Geometry I, 365-377',
        relevance:
          'Explicitly states the equivalence "E_a is Hermite-Biehler for every ' +
          'a > 0 iff xi has only real zeros (RH)". So Conjecture 22.4 is ' +
          'literally RH restated. Surveys this equivalence as classical de ' +
          'Branges theory.',
      },
      {
        author: 'de Bruijn',
        year: 1950,
        title: 'The roots of trigonometric integrals',
        venue: 'Duke Math. J. 17, 197-226',
        relevance:
          'Introduces the family H_t(z) of entire functions obtained from xi by ' +
          'Gaussian smoothing. Shows H_t has only real zeros for sufficiently ' +
          'large t and proves there exists Lambda such that H_t has only real ' +
          'zeros iff t >= Lambda. The "bridge thickness" a in Conjecture 22.4 ' +
          'is conceptually adjacent (but not identical) to a t in the de Bruijn ' +
          'flow: BOTH are deformations parametrized by a positivity threshold.',
      },
      {
        author: 'Newman',
        year: 1976,
        title: 'Fourier transforms with only real zeros',
        venue: 'Proc. AMS 61, 245-251',
        relevance:
          'Defines Lambda as the de Bruijn-Newman constant; conjectures Lambda ' +
          '>= 0 (proven by Rodgers-Tao 2018) and Lambda <= 0 (this is RH). ' +
          'Conjecture 22.4 in the "K_a positive definite for every a > 0" ' +
          'phrasing is morally the analog of "the bridge ratio is contractive ' +
          'for every a > 0", which the paper itself (Section 17.6, Conjecture ' +
          '17.3) proves equivalent to RH.',
      },
      {
        author: 'Rodgers-Tao',
        year: 2018,
        title: 'The de Bruijn-Newman constant is non-negative',
        venue: 'Forum of Mathematics Pi 8, e6 (2020)',
        relevance:
          'Proves Lambda >= 0 unconditionally. Closest unconditional positive-' +
          'direction result to the de Bruijn-Newman / bridge-thickness framework. ' +
          'Does NOT subsume Conjecture 22.4 (which is RH-equivalent, so harder), ' +
          'but is the closest published precedent for "a positivity-threshold ' +
          'constant in a one-parameter deformation of xi".',
      },
      {
        author: 'Bombieri-Lagarias',
        year: 1999,
        title: 'Complements to Li’s criterion for the Riemann hypothesis',
        venue: 'J. Number Theory 77, 274-287',
        relevance:
          'Catalogs RH-equivalent positivity criteria. The de Branges / ' +
          'Hermite-Biehler form of Conjecture 22.4 is one such equivalent. ' +
          'Bombieri-Lagarias provides the cross-reference between the explicit-' +
          'formula positivity (Weil), the Li-Keiper coefficient positivity, and ' +
          'the de Branges Hermite-Biehler positivity. All are equivalent to RH.',
      },
    ],
    overlap: 'SUBSUMED',
    rationale:
      'Conjecture 22.4 is mathematically equivalent to RH itself via the ' +
      'standard de Branges / Lagarias machinery (Lagarias 2007 states the ' +
      'equivalence explicitly; the paper Section 17.6 also derives this ' +
      'internally as "ghost absence iff RH"). Calling 22.4 a "theorem target" ' +
      'on equal footing with 22.1-22.3 misrepresents the difficulty: it is the ' +
      'full RH, not a sub-step. The conjecture should be REFRAMED as a ' +
      'reformulation of RH in the de Branges / bridge language, not a ' +
      'separate target. This is by far the most important reframe needed in ' +
      'Section 22.',
    recommendation_for_paper:
      'REFRAME explicitly as RH-equivalent. Move out of Section 22 "theorem ' +
      'targets" into a standalone "RH-equivalent reformulation" subsection. ' +
      'Cite de Branges 1968, Lagarias 2007, Bombieri-Lagarias 1999 for the ' +
      'equivalence to RH. Cite de Bruijn 1950, Newman 1976, Rodgers-Tao 2018 ' +
      'for the closest one-parameter-deformation framework. Acknowledge ' +
      'openly: 22.4 IS RH; the paper does not solve it, but reformulates it.',
  },
];

// -- Overall verdict ------------------------------------------------------

const OVERALL_VERDICT = 'reframe-22.4-as-RH-equivalent-cite-existing-literature-on-22.2-22.3';

const VERDICT_DETAIL = {
  honest_summary:
    'Of the four conjectures, only 22.1 is genuinely a new quantitative claim. ' +
    '22.2 and 22.3 sit on top of existing universal-factor / de Branges / ' +
    'Weil-positivity literature and should cite it explicitly. 22.4 is ' +
    'mathematically RH itself (de Branges / Lagarias reformulation) and ' +
    'must not be listed as a "theorem target" of equal status to 22.1-22.3.',
  per_conjecture_verdict: {
    '22.1': 'INDEPENDENT-NOVEL (as a specific quantitative benchmark claim)',
    '22.2': 'PARTIALLY-RELATED (overlaps Newman / Csordas-Norfolk-Varga / Bost-Connes; isolate novel axiom)',
    '22.3': 'PARTIALLY-RELATED (overlaps Weil / Bombieri / de Branges / Lagarias; non-circular constraint is the new piece, already an open problem in the literature)',
    '22.4': 'SUBSUMED (literally RH via de Branges / Lagarias equivalence; do not advertise as a new target)',
  },
  reframe_priority: 'CRITICAL for 22.4; HIGH for 22.2-22.3; LOW for 22.1.',
  citation_floor_for_section_22: [
    'Newman 1976',
    'Csordas-Norfolk-Varga 1988',
    'Bost-Connes 1995',
    'Weil 1952',
    'Bombieri 2003',
    'de Branges 1968',
    'Lagarias 2007',
    'Bombieri-Lagarias 1999',
    'de Bruijn 1950',
    'Rodgers-Tao 2018',
    'Connes 1999',
  ],
  cross_check_with_internal_paper_results:
    'The paper Section 17.6 already proves internally that Conjecture 17.3 ' +
    '(ghost absence: B_a^+ ≡ 1 for every a > 0) is equivalent to RH. ' +
    'Conjecture 22.4 (E_a Hermite-Biehler for every a > 0) is the de Branges ' +
    'side of the same equivalence. So the paper has TWO RH-equivalent ' +
    'reformulations (17.3 and 22.4) and lists both as conjectures to prove. ' +
    'These should be cross-referenced as "two equivalent reformulations of ' +
    'RH" rather than as independent theorem targets.',
};

// -- Honest scope ---------------------------------------------------------

const HONEST_SCOPE = [
  'Audit performed from training-time knowledge only. No external browsing, ' +
  'MathSciNet, arXiv search, or recent (2024-2026) preprint sweep. A live ' +
  'literature search could reveal additional precedents, sharper subsuming ' +
  'theorems, or recent universal-factor results that strengthen the SUBSUMED ' +
  'verdicts here.',

  'The SUBSUMED verdict on 22.4 is essentially a statement about textbook ' +
  'de Branges theory; the equivalence E_a Hermite-Biehler for every a > 0 ' +
  'iff RH is classical, and Lagarias 2007 surveys it. This verdict is robust ' +
  'against further literature search.',

  'The PARTIALLY-RELATED verdicts on 22.2 and 22.3 depend on the exact ' +
  'axiomatization in the paper of "completed-kernel admissibility" and ' +
  '"non-circular norm-square realization". If those axioms are equivalent to ' +
  'an existing named published criterion, the verdicts upgrade to SUBSUMED. ' +
  'A careful reading of the paper axiom statements against Csordas-Norfolk-' +
  'Varga 1988 and Lagarias 2007 is the natural follow-up.',

  'The INDEPENDENT-NOVEL verdict on 22.1 is the weakest. Its quantitative ' +
  'form is unfalsifiable without a named baseline; the recommendation is to ' +
  'tighten the conjecture statement against Platt-Trudgian 2021 / Hiary 2011 ' +
  'before claiming novelty.',

  'The classification SUBSUMED / PARTIALLY-RELATED / INDEPENDENT-NOVEL is ' +
  'intentionally coarse. A finer grading (e.g. SUBSUMED-CONDITIONAL-ON-X) ' +
  'is appropriate but out of scope for this audit. Future audits should ' +
  'refine.',

  'imp-1163 precedent: paper Section 4.5 Conjecture 1 was originally ' +
  'advertised as "the first empirical positive signal for ESY-rigidity on ' +
  'zeros" but was reclassified as subsumed by Hughes-Rudnick 2003 + Bourgade ' +
  '2010. The same pattern of overclaim is present in Section 22.4 (advertised ' +
  'as a theorem target, actually RH itself). Section 22.2 and 22.3 are at ' +
  'lower risk of overclaim but still need citation reframes.',
];

// -- Frozen export --------------------------------------------------------

export const IMP_1210_CONJECTURE_22_LITERATURE_AUDIT = Object.freeze({
  id: 'imp-1210',
  ticket: 'imp-1210',
  auditDate: '2026-05-26',
  paper: 'twin_ladder_consolidated_v52.pdf',
  paperSection: '22 Conjectures and theorem targets (page 32)',
  precedent: 'imp-1163',
  goal:
    'Survey published literature for each of the four Section 22 conjectures ' +
    'and assess whether they are SUBSUMED, PARTIALLY-RELATED, or INDEPENDENT-' +
    'NOVEL. Make a per-conjecture reframe recommendation and an overall ' +
    'recommendation for the paper.',
  conjectures: Object.freeze(
    CONJECTURES.map((c) =>
      Object.freeze({
        ...c,
        related_work: Object.freeze(c.related_work.map(Object.freeze)),
      }),
    ),
  ),
  overall_verdict: OVERALL_VERDICT,
  verdict_detail: Object.freeze({
    ...VERDICT_DETAIL,
    per_conjecture_verdict: Object.freeze(VERDICT_DETAIL.per_conjecture_verdict),
    citation_floor_for_section_22: Object.freeze(
      VERDICT_DETAIL.citation_floor_for_section_22,
    ),
  }),
  honestScope: Object.freeze(HONEST_SCOPE),
  parallelTickets: Object.freeze(['imp-1163', 'imp-1197', 'imp-1212']),
});

// -- Build-time tripwires -------------------------------------------------

export const IMP_1210_CONJECTURE_22_LITERATURE_AUDIT_ASSERTIONS = [
  {
    id: 'imp1210-four-conjectures-reviewed',
    holds: () =>
      IMP_1210_CONJECTURE_22_LITERATURE_AUDIT.conjectures.length === 4 &&
      IMP_1210_CONJECTURE_22_LITERATURE_AUDIT.conjectures.every((c) =>
        ['22.1', '22.2', '22.3', '22.4'].includes(c.id),
      ),
    why:
      'Paper Section 22 names exactly four conjectures (22.1 twin-ladder ' +
      'usefulness, 22.2 admissible pressure families, 22.3 bridge-norm ' +
      'realization, 22.4 zero bridge-thickness). The audit must cover all ' +
      'four and only those four; dropping or adding one means the audit ' +
      'no longer matches the paper Section 22 list.',
  },
  {
    id: 'imp1210-22-4-classified-subsumed',
    holds: () => {
      const c22_4 = IMP_1210_CONJECTURE_22_LITERATURE_AUDIT.conjectures.find(
        (c) => c.id === '22.4',
      );
      return Boolean(c22_4) && c22_4.overlap === 'SUBSUMED';
    },
    why:
      'Conjecture 22.4 (E_a Hermite-Biehler for every a > 0) is equivalent ' +
      'to RH itself via classical de Branges / Lagarias machinery. The audit ' +
      'verdict must classify it SUBSUMED (not PARTIALLY-RELATED or ' +
      'INDEPENDENT-NOVEL). A regression flipping this verdict would silently ' +
      'reintroduce the overclaim that 22.4 is a separate theorem target.',
  },
  {
    id: 'imp1210-22-4-cites-de-branges-and-lagarias',
    holds: () => {
      const c22_4 = IMP_1210_CONJECTURE_22_LITERATURE_AUDIT.conjectures.find(
        (c) => c.id === '22.4',
      );
      if (!c22_4) return false;
      const authors = c22_4.related_work.map((r) => r.author);
      return (
        authors.includes('de Branges') &&
        authors.some((a) => a === 'Lagarias')
      );
    },
    why:
      'The SUBSUMED verdict on 22.4 rests on the de Branges / Lagarias ' +
      'equivalence (E Hermite-Biehler iff xi has only real zeros). The ' +
      'related_work block for 22.4 must cite both de Branges 1968 and ' +
      'Lagarias 2007 by author. Removing either citation breaks the ' +
      'audit chain of reasoning.',
  },
  {
    id: 'imp1210-22-3-cites-weil-and-de-branges',
    holds: () => {
      const c22_3 = IMP_1210_CONJECTURE_22_LITERATURE_AUDIT.conjectures.find(
        (c) => c.id === '22.3',
      );
      if (!c22_3) return false;
      const authors = c22_3.related_work.map((r) => r.author);
      return authors.includes('Weil') && authors.includes('de Branges');
    },
    why:
      'The PARTIALLY-RELATED verdict on 22.3 (bridge-norm realization) ' +
      'depends on locating the Weil quadratic-form positivity tradition ' +
      '(Weil 1952) and the de Branges norm-square realization machinery ' +
      '(de Branges 1968) as the surrounding context. Both must appear in ' +
      'the related_work for 22.3 or the recommendation reframe is unfounded.',
  },
  {
    id: 'imp1210-22-2-cites-newman-and-csordas-norfolk-varga',
    holds: () => {
      const c22_2 = IMP_1210_CONJECTURE_22_LITERATURE_AUDIT.conjectures.find(
        (c) => c.id === '22.2',
      );
      if (!c22_2) return false;
      const authors = c22_2.related_work.map((r) => r.author);
      return (
        authors.includes('Newman') &&
        authors.includes('Csordas-Norfolk-Varga')
      );
    },
    why:
      'The PARTIALLY-RELATED verdict on 22.2 (admissible pressure families) ' +
      'depends on locating the universal-factor / real-zero-preserving ' +
      'deformation tradition. Newman 1976 and Csordas-Norfolk-Varga 1988 are ' +
      'the canonical references and must appear in 22.2 related_work.',
  },
  {
    id: 'imp1210-overall-verdict-flags-22-4-reframe',
    holds: () =>
      typeof IMP_1210_CONJECTURE_22_LITERATURE_AUDIT.overall_verdict ===
        'string' &&
      /22\.4/.test(IMP_1210_CONJECTURE_22_LITERATURE_AUDIT.overall_verdict),
    why:
      'The overall verdict string must mention 22.4 by ID because the ' +
      'critical reframe is on 22.4 (RH-equivalent reclassification). A ' +
      'regression that softens the overall verdict to remove the 22.4 ' +
      'callout would mask the most important paper-level recommendation.',
  },
  {
    id: 'imp1210-every-conjecture-has-recommendation',
    holds: () =>
      IMP_1210_CONJECTURE_22_LITERATURE_AUDIT.conjectures.every(
        (c) =>
          typeof c.recommendation_for_paper === 'string' &&
          c.recommendation_for_paper.length >= 100,
      ),
    why:
      'Each of the four conjectures must carry a non-empty recommendation_' +
      'for_paper field of at least 100 characters specifying the concrete ' +
      'reframe / keep / cite action. Empty or stub recommendations leave the ' +
      'audit without actionable output.',
  },
  {
    id: 'imp1210-honest-scope-acknowledges-training-only',
    holds: () =>
      Array.isArray(IMP_1210_CONJECTURE_22_LITERATURE_AUDIT.honestScope) &&
      IMP_1210_CONJECTURE_22_LITERATURE_AUDIT.honestScope.some((s) =>
        /training-time/.test(s),
      ),
    why:
      'Per imp-1163 honest-scope precedent and the ticket instructions, ' +
      'the audit must explicitly disclose that it is based on training-time ' +
      'knowledge only (no external browsing). Removing this disclosure would ' +
      'misrepresent the audit method.',
  },
  {
    id: 'imp1210-overlap-classifications-from-fixed-vocab',
    holds: () => {
      const allowed = new Set([
        'SUBSUMED',
        'PARTIALLY-RELATED',
        'INDEPENDENT-NOVEL',
      ]);
      return IMP_1210_CONJECTURE_22_LITERATURE_AUDIT.conjectures.every((c) =>
        allowed.has(c.overlap),
      );
    },
    why:
      'Overlap classification per conjecture must come from the fixed ' +
      'three-element vocabulary {SUBSUMED, PARTIALLY-RELATED, INDEPENDENT-' +
      'NOVEL}. Any deviation (e.g. typo, alternative label) silently breaks ' +
      'downstream aggregation and the ticket instructions.',
  },
  {
    id: 'imp1210-citation-floor-includes-key-anchors',
    holds: () => {
      const floor =
        IMP_1210_CONJECTURE_22_LITERATURE_AUDIT.verdict_detail
          .citation_floor_for_section_22;
      return (
        Array.isArray(floor) &&
        floor.includes('de Branges 1968') &&
        floor.includes('Lagarias 2007') &&
        floor.includes('Weil 1952') &&
        floor.includes('Newman 1976') &&
        floor.length >= 8
      );
    },
    why:
      'The recommended citation floor for paper Section 22 must include at ' +
      'minimum de Branges 1968, Lagarias 2007, Weil 1952, and Newman 1976 ' +
      '(the four most load-bearing prior-work anchors across the four ' +
      'conjectures) and have length >= 8. Falling below this floor would ' +
      'undercite the surrounding literature and leave the reframe ' +
      'recommendation unsupported.',
  },
];

export default IMP_1210_CONJECTURE_22_LITERATURE_AUDIT;
