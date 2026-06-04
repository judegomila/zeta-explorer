/**
 * @module imp-2359-connes-consani-f1-arithmetic-site-trace
 * @fileoverview imp-2359 — FAN-OUT classification off imp-1307 (Connes-Bost
 *   adelic, NEGATIVE: no rigorous trace on the adele class space). This ticket
 *   reviews the EARLIER Connes-Consani 2010-2014 layer — the F1 ("field with
 *   one element") geometry refinements and the Arithmetic-Site cohomology — and
 *   Meyer 2005 PARTIAL-ABSORPTION approach, and reports whether ANY of them
 *   yields a RIGOROUS trace formula realizing the Riemann zeros, naming the
 *   precise remaining conjectural input.
 *
 *   SCOPE / DELINEATION FROM SIBLING AUDITS
 *   ---------------------------------------
 *   - imp-1307 audited Connes-Bost 1999 (adelic Lefschetz trace on the type-II_1
 *     von Neumann algebra L(Y_Q)); NOT RIGOROUS — the load-bearing triple
 *     (L1) manifold structure, (L2) positive type-II_1 trace, (L3) local
 *     positivity at every place, all open; (L3) is RH-equivalent.
 *   - imp-1343 audited the LATER Connes-Consani 2016-2019 "Riemann-Roch
 *     strategy / complex lift of the scaling site"; ADVANCES (L1) geometry but
 *     the positivity on the SQUARE (RR2) is RH-equivalent and not constructed.
 *   - THIS ticket (imp-2359) sits BETWEEN them in time: the 2010-2014 F1 /
 *     Arithmetic-Site phase plus Meyer 2005 partial absorption. These are the
 *     refinements most often cited as "almost gives a spectral realization of
 *     the zeros". The question is narrow and honest: does ANY of them produce a
 *     RIGOROUS trace formula whose spectrum IS the zeros (unconditionally), and
 *     if not, what EXACTLY is the remaining conjectural input?
 *
 *   HEADLINE VERDICT
 *   ----------------
 *   VERDICT:
 *     f1-arithmetic-site-and-meyer-no-rigorous-zero-realizing-trace-positivity-remains-rh-equivalent
 *
 *   None of the 2010-2014 F1 / Arithmetic-Site refinements, nor Meyer 2005
 *   partial absorption, yields a RIGOROUS trace formula that realizes the
 *   non-trivial Riemann zeros as the spectrum of a constructed operator
 *   UNCONDITIONALLY. Each delivers a genuine, unconditional UPPER-LAYER object
 *   (a counting distribution / a periodic-orbit structure / a bounded-operator
 *   spectral REFORMULATION) whose "trace" REPRODUCES the Weil explicit formula
 *   — i.e. gives BACK input we already have — but the step that would FORCE the
 *   zeros onto the critical line (a positivity / self-adjointness) is in every
 *   case the missing ingredient and is EQUIVALENT TO RH. RH is explicitly NOT
 *   asserted here.
 *
 *   WHAT EACH REFINEMENT ACTUALLY ESTABLISHES (UNCONDITIONAL) vs LEAVES OPEN.
 *
 *   (1) F1 GEOMETRY (Connes-Consani 2011 "Schemes over F1 and zeta functions",
 *       Compositio Math. 146, 1383-1415; building on Soule, Deitmar,
 *       Toen-Vaquie). The dream is to view Spec(Z) as a "curve over F1" and
 *       transcribe Weil 1948 (RH for curves over a finite field F_q), whose
 *       engine is the SURFACE C x_{F_q} C and the positivity of the diagonal
 *       self-intersection (Hodge index / Castelnuovo-Severi). Connes-Consani
 *       give an honest F1-scheme framework and recover the right counting /
 *       zeta data of Spec(Z).
 *       OPEN: the SQUARE Spec(Z) x_{F1} Spec(Z) as an actual algebraic surface
 *       carrying a Frobenius correspondence and a POSITIVE intersection theory
 *       does NOT exist unconditionally. Without that surface-positivity the
 *       Weil-1948 transfer has no engine. This positivity is RH-equivalent.
 *
 *   (2) THE ARITHMETIC SITE (Connes-Consani 2014 "The Arithmetic Site",
 *       C. R. Acad. Sci. Paris 352, 971-975; full version "Geometry of the
 *       Arithmetic Site", Adv. Math. 291 (2016), 274-329). The arithmetic site
 *       is the topos N^x acting on the (tropical / characteristic-1) semiring
 *       Z_max; its points over the max-plus semifield R_max recover the adele
 *       class space of Q, and a counting distribution N(u) attached to the
 *       Frobenius / scaling flow reproduces — via a Hasse-Weil-type formula —
 *       the COMPLETE Riemann zeta with its archimedean factor. This is
 *       unconditional and is a sharper geometric incarnation of the imp-1307
 *       absorption identity.
 *       OPEN: a WEIL COHOMOLOGY of the arithmetic site in characteristic 1 —
 *       an H^1 carrying a Frobenius whose Lefschetz trace is the explicit
 *       formula AND a POSITIVE-DEFINITE pairing forcing the eigenvalues onto
 *       Re = 1/2 — is NOT constructed. The characteristic-1 cohomology exists
 *       only at the level of point-counting / the structure sheaf; the
 *       positivity (the analogue of the Hodge index theorem) is conjectural and
 *       RH-equivalent.
 *
 *   (3) MEYER 2005 PARTIAL ABSORPTION (R. Meyer, "A spectral interpretation
 *       for the zeros of the Riemann zeta function", J. Reine Angew. Math. 587
 *       (2005), 89-116; companion Duke Math. J. 127 (2005), 519-595). Meyer
 *       realizes the zeros as the spectrum of the generator of a representation
 *       of the idele class group on a quotient of nuclear / bornological
 *       function spaces, working with bounded-type operators and AVOIDING the
 *       un-constructed type-II_1 trace of Connes 1999. This is a rigorous
 *       SPECTRAL REFORMULATION.
 *       OPEN: (i) the construction is BUILT ON the explicit formula — the zeros
 *       enter as data, so the "realization" is a reformulation, not an
 *       independent input that could PROVE anything about their location;
 *       (ii) the operator is NOT self-adjoint on a Hilbert space in a way that
 *       would force its spectrum to be real; RH is EQUIVALENT to a
 *       self-adjointness / positivity Meyer does not establish; (iii) the
 *       absorption of the principal (pole) part is only PARTIAL — done for a
 *       restricted class — leaving the global archimedean positivity open.
 *
 *   PRECISE REMAINING CONJECTURAL INPUT (the named sub-gap).
 *   GAP-2359-CHAR1-SURFACE-POSITIVITY: a positive-definite intersection /
 *   inner-product structure in characteristic 1 — concretely, EITHER the
 *   square Spec(Z) x_{F1} Spec(Z) as an algebraic surface with a positive
 *   self-intersection (the Weil-1948 / Hodge-index analogue), OR an H^1 Weil
 *   cohomology of the arithmetic site with a positive-definite Frobenius
 *   pairing, OR a self-adjoint Hilbert-space realization in Meyer's spectral
 *   picture. All three formulations are EQUIVALENT TO RH (via the Weil
 *   positivity criterion) and NONE is established. So the 2010-2014 layer, like
 *   imp-1307 and imp-1343, either gives BACK the explicit formula
 *   (unconditional, same content) or gives FORWARD RH itself (conditional on an
 *   unproven, RH-equivalent positivity).
 *
 *   CONSEQUENCE: as in imp-1307 / imp-1343, NO unconditional 2-point bound at
 *   Fourier support sigma > 1 emerges; the geometric / NCG family does not
 *   bypass the Montgomery PCC obstruction. Engine planning unchanged: the
 *   lambda-attack decoupling track (test-function reformulations inside
 *   sigma <= 1 where Montgomery 1973 is unconditional) remains the productive
 *   lever.
 *
 *   HONEST TRAINING-TIME UNCERTAINTY. The exact internal statements of the
 *   characteristic-1 cohomology (Connes-Consani Adv. Math. 2016 and the
 *   Consani square-of-the-arithmetic-site papers) are uncertain at the training
 *   cutoff. The layer-level obstruction named here is ROBUST to the exact form:
 *   it identifies the single load-bearing step any Weil-1948-transfer or
 *   spectral-realization strategy MUST traverse — a positivity in characteristic
 *   1 / on a Hilbert space — which is the Weil-positivity, RH-equivalent step.
 *   Classification is OPEN-FOR-REVISION if a published result constructs that
 *   positivity unconditionally. RH is NOT asserted.
 *
 *   @see imp-1307 src/data/imp-1307-connes-bost-adelic-attack.js
 *   @see imp-1343 src/data/imp-1343-connes-consani-2019.js
 *   @see imp-1305 src/data/imp-1305-goldston-yildirim-mean-square.js (PCC family)
 *
 *   Ticket: imp-2359 (content, medium, FAN-OUT honest classification; no proof).
 */

const PAPER_REF = 'research-inputs/twin_ladder_consolidated_v52.pdf';

// =========================================================================
// SECTION A - THE THREE 2010-2014 REFINEMENTS (statements + status).
// =========================================================================

const F1_GEOMETRY = Object.freeze({
  source:
    'Connes, A. and Consani, C. (2011). "Schemes over F1 and zeta functions". ' +
    'Compositio Math. 146 (2010), 1383-1415 (building on Soule, Deitmar, ' +
    'Toen-Vaquie).',
  goal:
    'View Spec(Z) as a curve over F1 and transcribe Weil 1948 (RH for curves ' +
    'over a finite field), whose engine is the surface C x_{F_q} C and the ' +
    'positivity of the diagonal self-intersection (Hodge index / ' +
    'Castelnuovo-Severi inequality).',
  unconditionalContent:
    'An honest F1-scheme framework recovering the correct counting / zeta data ' +
    'of Spec(Z). UNCONDITIONAL.',
  remainingConjecturalInput:
    'The square Spec(Z) x_{F1} Spec(Z) as an actual algebraic surface carrying ' +
    'a Frobenius correspondence and a POSITIVE intersection theory does NOT ' +
    'exist unconditionally. Without that surface-positivity the Weil-1948 ' +
    'transfer has no engine. This positivity is RH-equivalent.',
  yieldsRigorousZeroRealizingTrace: false,
});

const ARITHMETIC_SITE = Object.freeze({
  source:
    'Connes, A. and Consani, C. (2014). "The Arithmetic Site". C. R. Acad. ' +
    'Sci. Paris 352 (2014), 971-975; full version "Geometry of the Arithmetic ' +
    'Site", Adv. Math. 291 (2016), 274-329.',
  construction:
    'The topos N^x acting on the tropical / characteristic-1 semiring Z_max; ' +
    'its points over the max-plus semifield R_max recover the adele class space ' +
    'of Q; a counting distribution N(u) attached to the Frobenius / scaling ' +
    'flow reproduces (via a Hasse-Weil-type formula) the COMPLETE Riemann zeta ' +
    'with its archimedean factor.',
  unconditionalContent:
    'The counting distribution and its zeta reproduction are unconditional, a ' +
    'sharper geometric incarnation of the imp-1307 absorption identity (= Weil ' +
    'explicit formula in geometric coordinates).',
  remainingConjecturalInput:
    'A Weil cohomology of the arithmetic site in characteristic 1 — an H^1 ' +
    'with a Frobenius whose Lefschetz trace is the explicit formula AND a ' +
    'POSITIVE-DEFINITE pairing forcing eigenvalues onto Re = 1/2 — is NOT ' +
    'constructed. The positivity (analogue of the Hodge index theorem) is ' +
    'conjectural and RH-equivalent.',
  yieldsRigorousZeroRealizingTrace: false,
});

const MEYER_PARTIAL_ABSORPTION = Object.freeze({
  source:
    'Meyer, R. (2005). "A spectral interpretation for the zeros of the Riemann ' +
    'zeta function". J. Reine Angew. Math. 587 (2005), 89-116; companion ' +
    'Duke Math. J. 127 (2005), 519-595.',
  construction:
    'Realizes the zeros as the spectrum of the generator of a representation of ' +
    'the idele class group on a quotient of nuclear / bornological function ' +
    'spaces, with bounded-type operators, AVOIDING the un-constructed type-II_1 ' +
    'trace of Connes 1999. A rigorous spectral REFORMULATION.',
  unconditionalContent:
    'A bounded-operator spectral interpretation of the zeros for a restricted ' +
    'class, sidestepping the type-II_1 trace. UNCONDITIONAL as a reformulation.',
  remainingConjecturalInput:
    'The construction is BUILT ON the explicit formula (the zeros enter as ' +
    'data, so the realization is a reformulation, not an independent input); ' +
    'the operator is NOT self-adjoint on a Hilbert space in a way forcing real ' +
    'spectrum; RH is EQUIVALENT to a self-adjointness / positivity Meyer does ' +
    'NOT establish; absorption of the principal (pole) part is only PARTIAL ' +
    '(restricted class), leaving the global archimedean positivity open.',
  yieldsRigorousZeroRealizingTrace: false,
});

// =========================================================================
// SECTION B - THE NAMED SUB-GAP (precise remaining conjectural input).
// =========================================================================

const NAMED_SUBGAP = Object.freeze({
  id: 'GAP-2359-CHAR1-SURFACE-POSITIVITY',
  statement:
    'A positive-definite intersection / inner-product structure in ' +
    'characteristic 1 — concretely EITHER the square Spec(Z) x_{F1} Spec(Z) as ' +
    'an algebraic surface with positive self-intersection (Weil-1948 / Hodge ' +
    'index analogue), OR an H^1 Weil cohomology of the arithmetic site with a ' +
    'positive-definite Frobenius pairing, OR a self-adjoint Hilbert-space ' +
    'realization in Meyer spectral picture.',
  allThreeFormulationsAreRHEquivalent: true,
  noneEstablished: true,
  consequence:
    'The 2010-2014 layer either gives BACK the explicit formula (unconditional, ' +
    'same content as imp-1307 / the moment routes, same (log T)^{1/2} ' +
    'Cauchy-Schwarz obstruction at support > 1) or gives FORWARD RH itself ' +
    '(conditional on an unproven, RH-equivalent positivity). No intermediate ' +
    'unconditional 2-point bound at Fourier support sigma > 1 emerges.',
});

// =========================================================================
// SECTION C - VERDICT.
// =========================================================================

const ALLOWED_VERDICTS = Object.freeze([
  'f1-arithmetic-site-or-meyer-gives-rigorous-zero-realizing-trace',
  'f1-arithmetic-site-and-meyer-no-rigorous-zero-realizing-trace-positivity-remains-rh-equivalent',
  'f1-arithmetic-site-realizes-zeros-but-only-conjecturally',
  'f1-arithmetic-site-requires-X-auxiliary-conjecture',
]);

const VERDICT =
  'f1-arithmetic-site-and-meyer-no-rigorous-zero-realizing-trace-positivity-remains-rh-equivalent';

const VERDICT_DETAIL = Object.freeze({
  verdict: VERDICT,
  isAllowedVerdict: ALLOWED_VERDICTS.includes(VERDICT),
  anyYieldsRigorousZeroRealizingTrace: false,
  closesPCCAtSupportGtOne: false,
  rhAsserted: false,
  honestSummary:
    'None of the Connes-Consani 2010-2014 F1 / Arithmetic-Site refinements, nor ' +
    'Meyer 2005 partial absorption, yields a RIGOROUS unconditional trace ' +
    'formula realizing the Riemann zeros as a constructed spectrum. Each gives ' +
    'an unconditional upper-layer object (counting distribution / periodic-orbit ' +
    'structure / bounded-operator reformulation) reproducing the Weil explicit ' +
    'formula, but the positivity / self-adjointness forcing the zeros onto ' +
    'Re = 1/2 is the missing ingredient and is RH-equivalent ' +
    '(GAP-2359-CHAR1-SURFACE-POSITIVITY). RH is NOT asserted.',
  openForRevision:
    'Reclassify if a published result constructs the characteristic-1 surface ' +
    'positivity / Weil cohomology positivity / Meyer self-adjointness ' +
    'unconditionally.',
});

// =========================================================================
// SECTION D - EXPORTED RECORD.
// =========================================================================

export const IMP_2359_CONNES_CONSANI_F1_ARITHMETIC_SITE_TRACE = Object.freeze({
  id: 'imp-2359-connes-consani-f1-arithmetic-site-trace',
  ticket: 'imp-2359',
  category: 'content',
  builtAt: '2026-06-04T00:00:00Z',
  paperSourcePath: PAPER_REF,
  relatedTickets: Object.freeze(['imp-1307', 'imp-1343', 'imp-1305']),

  verdict: VERDICT,
  allowedVerdicts: ALLOWED_VERDICTS,
  verdictDetail: VERDICT_DETAIL,

  f1Geometry: F1_GEOMETRY,
  arithmeticSite: ARITHMETIC_SITE,
  meyerPartialAbsorption: MEYER_PARTIAL_ABSORPTION,
  namedSubGap: NAMED_SUBGAP,

  references: Object.freeze({
    paper: PAPER_REF,
    connesConsani2011F1:
      'Connes, A. and Consani, C. (2011). "Schemes over F1 and zeta ' +
      'functions". Compositio Math. 146 (2010), 1383-1415.',
    connesConsani2014ArithmeticSite:
      'Connes, A. and Consani, C. (2014). "The Arithmetic Site". C. R. Acad. ' +
      'Sci. Paris 352 (2014), 971-975.',
    connesConsani2016GeometryArithmeticSite:
      'Connes, A. and Consani, C. (2016). "Geometry of the Arithmetic Site". ' +
      'Adv. Math. 291 (2016), 274-329.',
    meyer2005Crelle:
      'Meyer, R. (2005). "A spectral interpretation for the zeros of the ' +
      'Riemann zeta function". J. Reine Angew. Math. 587 (2005), 89-116.',
    meyer2005Duke:
      'Meyer, R. (2005). "On a representation of the idele class group related ' +
      'to primes and zeros of L-functions". Duke Math. J. 127 (2005), 519-595.',
    weil1948:
      'Weil, A. (1948). "Sur les courbes algebriques et les varietes qui sen ' +
      'deduisent". Hermann (the curve / Hodge-index positivity engine).',
    imp1307: 'src/data/imp-1307-connes-bost-adelic-attack.js',
    imp1343: 'src/data/imp-1343-connes-consani-2019.js',
  }),

  honestScope: Object.freeze([
    'FAN-OUT classification off imp-1307. Reviews the 2010-2014 F1 / ' +
    'Arithmetic-Site refinements and Meyer 2005 partial absorption ONLY; not a ' +
    'new closure, not a new bound, not a critique of the Connes-Consani program ' +
    'as a mathematical contribution.',
    'Verdict NEGATIVE: none yields a rigorous unconditional zero-realizing ' +
    'trace; the remaining conjectural input is a characteristic-1 / ' +
    'Hilbert-space positivity (GAP-2359-CHAR1-SURFACE-POSITIVITY) equivalent ' +
    'to RH. RH explicitly NOT asserted.',
    'Consequence for the lambda-attack: geometric / NCG family does not bypass ' +
    'the Montgomery PCC obstruction at Fourier support > 1; the lambda-attack ' +
    'decoupling track (sigma <= 1) remains the productive lever.',
  ]),
});

export default IMP_2359_CONNES_CONSANI_F1_ARITHMETIC_SITE_TRACE;

// =========================================================================
// BUILD-TIME TRIPWIRES (8 shipped).
// =========================================================================

export const IMP_2359_CONNES_CONSANI_F1_ARITHMETIC_SITE_TRACE_ASSERTIONS = [
  // Tripwire 1: verdict is one of the allowed strings and is the negative one.
  {
    id: 'imp2359-verdict-allowed-and-negative',
    why:
      'The classification must commit to one of the pre-registered verdict ' +
      'strings, and the honest conclusion is the negative one. A drift to an ' +
      'unlisted or positive verdict would misrepresent the status.',
    holds: () => {
      const r = IMP_2359_CONNES_CONSANI_F1_ARITHMETIC_SITE_TRACE;
      return (
        r.allowedVerdicts.includes(r.verdict) &&
        /no-rigorous-zero-realizing-trace/.test(r.verdict) &&
        /rh-equivalent/.test(r.verdict) &&
        r.verdictDetail.isAllowedVerdict === true
      );
    },
  },

  // Tripwire 2: no rigorous zero-realizing trace, and RH not asserted.
  {
    id: 'imp2359-no-rigorous-trace-and-rh-not-asserted',
    why:
      'The headline content is that NONE of the three refinements yields a ' +
      'rigorous unconditional zero-realizing trace, and that RH is not claimed. ' +
      'A silent flip of either flag would fabricate a closure.',
    holds: () => {
      const r = IMP_2359_CONNES_CONSANI_F1_ARITHMETIC_SITE_TRACE;
      return (
        r.verdictDetail.anyYieldsRigorousZeroRealizingTrace === false &&
        r.verdictDetail.rhAsserted === false &&
        r.f1Geometry.yieldsRigorousZeroRealizingTrace === false &&
        r.arithmeticSite.yieldsRigorousZeroRealizingTrace === false &&
        r.meyerPartialAbsorption.yieldsRigorousZeroRealizingTrace === false
      );
    },
  },

  // Tripwire 3: F1 geometry refinement cited precisely (Compositio 2010/2011).
  {
    id: 'imp2359-f1-geometry-cited-precisely',
    why:
      'The F1 refinement must be pinned to Connes-Consani "Schemes over F1 and ' +
      'zeta functions" (Compositio Math. 146, 1383-1415). A vague "F1 ' +
      'geometry" reference would render the classification ungrounded.',
    holds: () => {
      const f = IMP_2359_CONNES_CONSANI_F1_ARITHMETIC_SITE_TRACE.f1Geometry;
      return (
        typeof f.source === 'string' &&
        /Connes/.test(f.source) &&
        /Consani/.test(f.source) &&
        /F1/.test(f.source) &&
        /Compositio/.test(f.source) &&
        /1383-1415/.test(f.source)
      );
    },
  },

  // Tripwire 4: Arithmetic Site cited precisely (CR 2014 / Adv. Math. 2016).
  {
    id: 'imp2359-arithmetic-site-cited-precisely',
    why:
      'The Arithmetic-Site refinement must be pinned to Connes-Consani "The ' +
      'Arithmetic Site" (C. R. Acad. Sci. 2014) and the Adv. Math. 291 (2016) ' +
      'full version. Missing this would unground the 2014 endpoint.',
    holds: () => {
      const a = IMP_2359_CONNES_CONSANI_F1_ARITHMETIC_SITE_TRACE.arithmeticSite;
      return (
        typeof a.source === 'string' &&
        /Arithmetic Site/i.test(a.source) &&
        /2014/.test(a.source) &&
        /Adv\. Math/i.test(a.source) &&
        /274-329/.test(a.source)
      );
    },
  },

  // Tripwire 5: Meyer 2005 partial absorption cited and named a reformulation.
  {
    id: 'imp2359-meyer-cited-and-reformulation',
    why:
      'Meyer 2005 (Crelle 587, 89-116) must be cited, and the honest point is ' +
      'that it is a spectral REFORMULATION built on the explicit formula, not ' +
      'an independent realization. A drift to "Meyer proves the spectrum" would ' +
      'be false.',
    holds: () => {
      const m =
        IMP_2359_CONNES_CONSANI_F1_ARITHMETIC_SITE_TRACE.meyerPartialAbsorption;
      return (
        typeof m.source === 'string' &&
        /Meyer/.test(m.source) &&
        /587/.test(m.source) &&
        /89-116/.test(m.source) &&
        typeof m.remainingConjecturalInput === 'string' &&
        /reformulation/i.test(m.remainingConjecturalInput) &&
        /self-adjoint/i.test(m.remainingConjecturalInput)
      );
    },
  },

  // Tripwire 6: named sub-gap present, RH-equivalent, none established.
  {
    id: 'imp2359-named-subgap-rh-equivalent',
    why:
      'A negative classification is only useful if it names the PRECISE ' +
      'remaining conjectural input. The sub-gap GAP-2359 must be present, flag ' +
      'all three formulations RH-equivalent, and report none established.',
    holds: () => {
      const g = IMP_2359_CONNES_CONSANI_F1_ARITHMETIC_SITE_TRACE.namedSubGap;
      return (
        typeof g.id === 'string' &&
        /GAP-2359/.test(g.id) &&
        g.allThreeFormulationsAreRHEquivalent === true &&
        g.noneEstablished === true &&
        typeof g.statement === 'string' &&
        /positive/i.test(g.statement)
      );
    },
  },

  // Tripwire 7: each refinement names its remaining conjectural input.
  {
    id: 'imp2359-each-refinement-names-conjectural-input',
    why:
      'The value of the ticket is the itemized "what is open" per refinement. ' +
      'Each of the three must carry a non-empty remainingConjecturalInput ' +
      'string; an empty field would hide where the program stops.',
    holds: () => {
      const r = IMP_2359_CONNES_CONSANI_F1_ARITHMETIC_SITE_TRACE;
      const nonEmpty = (s) => typeof s === 'string' && s.length > 40;
      return (
        nonEmpty(r.f1Geometry.remainingConjecturalInput) &&
        nonEmpty(r.arithmeticSite.remainingConjecturalInput) &&
        nonEmpty(r.meyerPartialAbsorption.remainingConjecturalInput) &&
        /positive|positivity/i.test(r.f1Geometry.remainingConjecturalInput) &&
        /positive|positivity/i.test(r.arithmeticSite.remainingConjecturalInput)
      );
    },
  },

  // Tripwire 8: delineated from siblings imp-1307 and imp-1343.
  {
    id: 'imp2359-delineated-from-siblings',
    why:
      'This ticket must not duplicate imp-1307 (1999 adelic) or imp-1343 ' +
      '(2016-2019 Riemann-Roch). The record must reference both as related and ' +
      'state the no-2-point-bound-at-support>1 consequence shared with them.',
    holds: () => {
      const r = IMP_2359_CONNES_CONSANI_F1_ARITHMETIC_SITE_TRACE;
      return (
        r.relatedTickets.includes('imp-1307') &&
        r.relatedTickets.includes('imp-1343') &&
        r.verdictDetail.closesPCCAtSupportGtOne === false &&
        typeof r.references.imp1307 === 'string' &&
        typeof r.references.imp1343 === 'string'
      );
    },
  },
];
