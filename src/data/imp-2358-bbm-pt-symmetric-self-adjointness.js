/**
 * @module imp-2358-bbm-pt-symmetric-self-adjointness
 * @fileoverview imp-2358 -- fan-out from imp-1308 (Berry-Keating H = xp, which
 *   found the bare H = xp has no discrete spectrum and reproduces only the
 *   smooth counting function). imp-1308 explicitly flagged the Bender-Brody-
 *   Mueller 2017 PT-symmetric Hamiltonian and the Sierra 2019 variants as
 *   NOT-YET-ASSESSED at training cutoff. This ticket assesses them.
 *
 *   QUESTION
 *   --------
 *   Do the PT-symmetric / compactified constructions of Bender-Brody-Mueller
 *   2017 (Phys. Rev. Lett. 118, 130201) and the Sierra 2019 review family
 *   yield a PROVEN self-adjoint (or quasi-Hermitian with a constructed
 *   positive metric) operator whose DISCRETE spectrum is the set of Riemann
 *   zeros? If not, what is the PRECISE unproven step?
 *
 *   HEADLINE VERDICT
 *   ----------------
 *   VERDICT: 'bbm-2017-pt-symmetric-not-rigorous-unbroken-pt-equals-rh'
 *
 *   The BBM 2017 construction is a genuine and elegant formal advance over
 *   the bare Berry-Keating H = xp: it writes down a specific PT-symmetric
 *   operator whose formal secular (quantisation) condition is tied to the
 *   Hurwitz / Riemann zeta function, so that IF its spectrum is real and
 *   discrete THEN the nontrivial zeros lie on the critical line. HOWEVER it
 *   does NOT close the Hilbert-Polya program, for one load-bearing reason
 *   plus two supporting structural reasons:
 *
 *   (P1) THE METRIC OPERATOR IS NOT CONSTRUCTED (the load-bearing gap). The
 *        BBM Hamiltonian is NOT Hermitian on L^2; it is at best
 *        quasi-Hermitian, i.e. self-adjoint with respect to some POSITIVE
 *        metric operator rho (equivalently, similar to a self-adjoint
 *        operator via rho^{1/2}). Reality of the spectrum holds if and only
 *        if PT-symmetry is UNBROKEN, which holds if and only if such a
 *        positive metric rho exists. BBM 2017 do NOT construct rho and do
 *        NOT prove PT is unbroken. They establish reality of the spectrum
 *        only FORMALLY / heuristically.
 *
 *   (P2) UNBROKEN-PT IS EQUIVALENT TO RH (the circularity). For this specific
 *        operator, "the eigenvalues E_n are all real" is precisely the
 *        statement that the nontrivial zeros lie on the critical line, i.e.
 *        RH. So reducing RH to "PT is unbroken" / "a positive metric exists"
 *        does not lessen the difficulty: the remaining step is logically
 *        EQUIVALENT to the target. It renames the hard part rather than
 *        removing it. (Bender-Brody themselves and subsequent commentary,
 *        e.g. Bellissard, noted the spectrum-reality step is exactly the open
 *        problem.)
 *
 *   (P3) THE BOUNDARY CONDITION / DOMAIN IS NOT SELF-ADJOINTNESS-CLOSED.
 *        BBM impose an eigenfunction boundary condition (the relevant
 *        Hurwitz-zeta eigenfunctions are required to vanish at the boundary)
 *        to single out a discrete set. The bare 2xp operator underlying the
 *        similarity transform has CONTINUOUS spectrum on L^2(R+) and is only
 *        essentially self-adjoint after a deficiency-index / boundary choice.
 *        The imposed boundary condition is the SAME zeta-secular condition in
 *        disguise (the eigenfunctions are built from zeta), so requiring them
 *        to vanish reproduces zeta(1/2 + i E_n) = 0 by construction. This is
 *        not an independent self-adjoint realisation; it is the explicit-
 *        formula / quantisation condition re-imposed as a boundary condition.
 *
 *   PRECISE NAMED SUB-GAP
 *   ---------------------
 *   GAP-2358-BBM-METRIC-OPERATOR: construct a positive-definite metric
 *   operator rho (equivalently a bounded C-operator / similarity rho^{1/2})
 *   for the BBM 2017 Hamiltonian such that rho H rho^{-1} is self-adjoint on a
 *   domain on which the spectrum is discrete and equals the imaginary parts of
 *   the nontrivial zeros -- WITHOUT assuming the spectrum is real. This is the
 *   unbroken-PT step and is equivalent to RH for this operator.
 *
 *   SIERRA 2019 FAMILY
 *   ------------------
 *   Sierra 2019 ("The Riemann zeros as spectrum and the Riemann hypothesis",
 *   Symmetry 11, 494, arXiv:1601.01797 and related) is a SURVEY-plus-proposal
 *   covering the H = xp lineage (Berry-Keating, Sierra-Townsend Landau-level,
 *   the Sierra-Rodriguez-Laguna relativistic / Dirac-type variant with a
 *   moving wall whose reflection coefficient encodes the Riemann xi function).
 *   It honestly characterises the situation as a CONJECTURAL spectral
 *   realisation: the relativistic model reproduces the AVERAGE level density
 *   and ties the boundary reflection to xi, but the self-adjoint operator
 *   whose discrete spectrum IS the zeros is not constructed; the reality of
 *   the levels is again the open input. The Sierra 2019 variants therefore
 *   fall under the SAME (P1)-(P3) obstruction as BBM 2017.
 *
 *   RELATION TO imp-1308
 *   --------------------
 *   imp-1308 found the bare Berry-Keating H = xp realises only the SMOOTH
 *   counting function, with Hilbert-Polya unconstructed (its B1) and the
 *   semiclassical 2-point statistic conditional on Hardy-Littlewood (its B2).
 *   imp-2358 extends that audit to the strongest MODERN PT-symmetric variant
 *   and finds the SAME structural verdict, now localised to a single named
 *   gap: the construction is self-adjoint / discrete-spectrum ONLY if a
 *   positive metric exists (unbroken PT), and that step is RH-equivalent for
 *   this operator. Hilbert-Polya remains unconstructed.
 *
 *   HONEST SCOPE
 *   ------------
 *   This is a LITERATURE-GROUNDED CLASSIFICATION, not a proof and not a
 *   refutation. The BBM 2017 and Sierra 2019 constructions are real and
 *   valuable formal advances. The claim here is narrow and honest: as
 *   published they do NOT exhibit a PROVEN self-adjoint operator with the
 *   zeros as discrete spectrum, because the metric / unbroken-PT step is
 *   unproven and (for this operator) equivalent to RH. Training cutoff is
 *   January 2026; the precise operator-domain formulas of the most recent
 *   variants are partially uncertain. The (P1)-(P3) obstructions are robust
 *   because they are domain / spectral-reality obstructions any PT-symmetric
 *   H = xp realisation must traverse. RH is explicitly NOT asserted proven.
 *
 *   @see imp-1308 src/data/imp-1308-berry-keating-quantum-attack.js
 *   @see imp-1339 src/data/imp-1339-hecke-triangle-selberg-trace.js
 *   @see imp-1343 src/data/imp-1343-connes-consani-2019.js
 *
 *   Ticket: imp-2358 (content, medium, FAN-OUT CLASSIFICATION).
 */

const PAPER_REF = 'research-inputs/twin_ladder_consolidated_v52.pdf';

// =========================================================================
// SECTION A - BBM 2017 STATEMENT.
// =========================================================================

const BBM_2017_STATEMENT = Object.freeze({
  source:
    'Bender, C. M., Brody, D. C. and Mueller, M. P., "Hamiltonian for the ' +
    'zeros of the Riemann zeta function", Phys. Rev. Lett. 118, 130201 (2017), ' +
    'arXiv:1608.03679',
  hamiltonian:
    'A PT-symmetric operator obtained from the Berry-Keating 2xp by a ' +
    'non-unitary similarity dressing of the form H = (1 / (1 - e^{-i p})) ' +
    '(x p + p x)(1 - e^{-i p}); formally H is similar to 2 x p but acts on a ' +
    'domain with a PT-symmetric (non-Hermitian) structure',
  isPTsymmetric: true,
  isHermitianOnL2: false,
  zetaConnection:
    'The eigenfunctions are built from Hurwitz / Riemann zeta functions; the ' +
    'imposed eigenfunction boundary condition (vanishing at the boundary) is ' +
    'the secular condition zeta(1/2 + i E_n) = 0, so IF the spectrum is real ' +
    'and discrete THEN the nontrivial zeros lie on the critical line',
  isTrainingTimeUncertain: true,
  trainingTimeUncertaintyNote:
    'The precise operator-domain formula and the exact boundary functional ' +
    'are partially uncertain at training cutoff (January 2026). The ' +
    '(P1)-(P3) obstructions are robust to the exact form because they are ' +
    'metric / spectral-reality obstructions any PT-symmetric H = xp ' +
    'realisation must traverse.',
});

// =========================================================================
// SECTION B - WHY IT DOES NOT CLOSE HILBERT-POLYA.
// =========================================================================

const SELF_ADJOINTNESS_EVALUATION = Object.freeze({
  P1_metric_operator_not_constructed:
    'LOAD-BEARING GAP. H is at best quasi-Hermitian (self-adjoint with ' +
    'respect to a positive metric rho, equivalently similar to a self-adjoint ' +
    'operator via rho^{1/2}). Reality of the spectrum holds iff PT is ' +
    'UNBROKEN iff such positive rho exists. BBM 2017 do NOT construct rho and ' +
    'do NOT prove PT is unbroken; reality of the spectrum is established only ' +
    'formally',
  P2_unbroken_pt_equivalent_to_rh:
    'For this specific operator, "all eigenvalues E_n are real" IS the ' +
    'statement that the nontrivial zeros lie on the critical line (RH). ' +
    'Reducing RH to "PT is unbroken" / "a positive metric exists" renames the ' +
    'hard step rather than removing it; the remaining step is logically ' +
    'EQUIVALENT to the target',
  P3_boundary_condition_is_zeta_secular_in_disguise:
    'The discreteness comes from an imposed eigenfunction boundary condition. ' +
    'The underlying 2xp has CONTINUOUS spectrum on L^2(R+) and is only ' +
    'essentially self-adjoint after a deficiency-index / boundary choice. ' +
    'Because the eigenfunctions are built from zeta, requiring them to vanish ' +
    'reproduces zeta(1/2 + i E_n) = 0 BY CONSTRUCTION -- the explicit-formula ' +
    'quantisation condition re-imposed as a boundary condition, not an ' +
    'independent self-adjoint realisation',
  hilbertPolyaOperatorConstructed: false,
  spectrumProvenRealAndDiscrete: false,
});

// =========================================================================
// SECTION C - NAMED SUB-GAP.
// =========================================================================

const NAMED_SUB_GAP = Object.freeze({
  id: 'GAP-2358-BBM-METRIC-OPERATOR',
  statement:
    'Construct a positive-definite metric operator rho (equivalently a ' +
    'bounded C-operator / similarity rho^{1/2}) for the BBM 2017 Hamiltonian ' +
    'such that rho H rho^{-1} is self-adjoint on a domain where the spectrum ' +
    'is discrete and equals the imaginary parts of the nontrivial zeros -- ' +
    'WITHOUT assuming the spectrum is real',
  isEquivalentToRH: true,
  whyEquivalent:
    'Existence of the positive metric is the unbroken-PT condition, which for ' +
    'this operator is exactly the reality of the eigenvalues, which is exactly ' +
    'RH. Hence closing the gap is not strictly easier than RH itself',
});

// =========================================================================
// SECTION D - SIERRA 2019 FAMILY.
// =========================================================================

const SIERRA_2019_EVALUATION = Object.freeze({
  source:
    'Sierra, G., "The Riemann zeros as spectrum and the Riemann hypothesis", ' +
    'Symmetry 11, 494 (2019), arXiv:1601.01797; survey of the H = xp lineage ' +
    'including the Sierra-Rodriguez-Laguna relativistic / Dirac-type ' +
    'moving-wall model whose reflection coefficient encodes the Riemann xi',
  reproducesAverageLevelDensity: true,
  selfAdjointZeroSpectrumConstructed: false,
  verdict:
    'Sierra 2019 honestly presents a CONJECTURAL spectral realisation: the ' +
    'relativistic model reproduces the average level density and ties the ' +
    'boundary reflection to xi, but the self-adjoint operator whose discrete ' +
    'spectrum IS the zeros is not constructed and the reality of the levels ' +
    'is the open input. Falls under the SAME (P1)-(P3) obstruction as BBM 2017',
});

// =========================================================================
// SECTION E - VERDICT + EXPORT.
// =========================================================================

const ALLOWED_VERDICTS = Object.freeze([
  'bbm-2017-fully-closes-hilbert-polya',
  'bbm-2017-pt-symmetric-not-rigorous-unbroken-pt-equals-rh',
  'bbm-2017-constructs-self-adjoint-operator-but-spectrum-not-zeros',
]);

const VERDICT = 'bbm-2017-pt-symmetric-not-rigorous-unbroken-pt-equals-rh';

export const IMP_2358_BBM_PT_SYMMETRIC_SELF_ADJOINTNESS = Object.freeze({
  id: 'imp-2358-bbm-pt-symmetric-self-adjointness',
  ticket: 'imp-2358',
  category: 'content',
  builtAt: '2026-06-04T00:00:00Z',
  paperSourcePath: PAPER_REF,
  relatedTickets: Object.freeze(['imp-1308', 'imp-1339', 'imp-1343']),

  verdict: VERDICT,
  isAllowedVerdict: ALLOWED_VERDICTS.includes(VERDICT),
  allowedVerdicts: ALLOWED_VERDICTS,

  bbm2017Statement: BBM_2017_STATEMENT,
  selfAdjointnessEvaluation: SELF_ADJOINTNESS_EVALUATION,
  namedSubGap: NAMED_SUB_GAP,
  sierra2019Evaluation: SIERRA_2019_EVALUATION,

  rhAsserted: false,
  honestScope: Object.freeze([
    'LITERATURE-GROUNDED CLASSIFICATION, not a proof and not a refutation. ' +
    'BBM 2017 and Sierra 2019 are real formal advances over the bare ' +
    'Berry-Keating H = xp of imp-1308.',
    'As published they do NOT exhibit a PROVEN self-adjoint operator with the ' +
    'zeros as discrete spectrum: the metric / unbroken-PT step is unproven ' +
    'and (for this operator) equivalent to RH -- the named sub-gap ' +
    'GAP-2358-BBM-METRIC-OPERATOR.',
    'Training cutoff is January 2026; precise operator-domain formulas of the ' +
    'most recent variants are partially uncertain, but the (P1)-(P3) ' +
    'obstructions are robust because they are domain / spectral-reality ' +
    'obstructions any PT-symmetric H = xp realisation must traverse. RH is ' +
    'explicitly NOT asserted proven.',
  ]),

  references: Object.freeze({
    paper: PAPER_REF,
    imp1308: 'src/data/imp-1308-berry-keating-quantum-attack.js',
    benderBrodyMueller2017:
      'Bender, C. M., Brody, D. C. and Mueller, M. P., "Hamiltonian for the ' +
      'zeros of the Riemann zeta function", Phys. Rev. Lett. 118, 130201 ' +
      '(2017), arXiv:1608.03679',
    sierra2019:
      'Sierra, G., "The Riemann zeros as spectrum and the Riemann ' +
      'hypothesis", Symmetry 11, 494 (2019), arXiv:1601.01797',
    benderBoettcher1998:
      'Bender, C. M. and Boettcher, S., "Real spectra in non-Hermitian ' +
      'Hamiltonians having PT symmetry", Phys. Rev. Lett. 80 (1998), 5243 -- ' +
      'origin of PT-symmetric quantum mechanics; reality of spectrum requires ' +
      'unbroken PT (a positive metric)',
    mostafazadeh2002:
      'Mostafazadeh, A., "Pseudo-Hermiticity versus PT symmetry", J. Math. ' +
      'Phys. 43 (2002), 205 -- quasi-Hermiticity and the positive metric ' +
      'operator rho characterising real spectra',
    berryKeating1999:
      'Berry, M. V. and Keating, J. P., "H = xp and the Riemann zeros", SIAM ' +
      'Review 41 (1999), 236-266 -- the base H = xp conjecture audited in imp-1308',
  }),
});

export default IMP_2358_BBM_PT_SYMMETRIC_SELF_ADJOINTNESS;

// =========================================================================
// BUILD-TIME TRIPWIRES (8 shipped; ticket requires 8+).
// =========================================================================

export const IMP_2358_BBM_PT_SYMMETRIC_SELF_ADJOINTNESS_ASSERTIONS = [
  // Tripwire 1: BBM 2017 cited precisely with journal + arXiv id.
  {
    id: 'imp2358-bbm-2017-cited-precisely',
    why:
      'The named candidate is Bender-Brody-Mueller 2017. A precise citation ' +
      '(PRL 118, 130201, arXiv:1608.03679) is required so the classification ' +
      'is anchored to the actual paper.',
    holds: () => {
      const r = IMP_2358_BBM_PT_SYMMETRIC_SELF_ADJOINTNESS.references;
      return (
        typeof r.benderBrodyMueller2017 === 'string' &&
        /Bender/.test(r.benderBrodyMueller2017) &&
        /Brody/.test(r.benderBrodyMueller2017) &&
        /Mueller/.test(r.benderBrodyMueller2017) &&
        /130201/.test(r.benderBrodyMueller2017) &&
        /1608\.03679/.test(r.benderBrodyMueller2017)
      );
    },
  },

  // Tripwire 2: the operator is recorded as PT-symmetric and NOT Hermitian.
  {
    id: 'imp2358-operator-pt-symmetric-not-hermitian',
    why:
      'The whole assessment hinges on H being non-Hermitian but PT-symmetric ' +
      '(quasi-Hermitian). Recording it as Hermitian would falsely make ' +
      'reality of the spectrum automatic.',
    holds: () => {
      const s = IMP_2358_BBM_PT_SYMMETRIC_SELF_ADJOINTNESS.bbm2017Statement;
      return s.isPTsymmetric === true && s.isHermitianOnL2 === false;
    },
  },

  // Tripwire 3: the load-bearing metric-operator gap (P1) is stated.
  {
    id: 'imp2358-metric-operator-gap-stated',
    why:
      'The load-bearing reason BBM does not close Hilbert-Polya is that the ' +
      'positive metric operator (unbroken-PT certificate) is not constructed. ' +
      'This must be explicit.',
    holds: () => {
      const e = IMP_2358_BBM_PT_SYMMETRIC_SELF_ADJOINTNESS.selfAdjointnessEvaluation;
      return (
        typeof e.P1_metric_operator_not_constructed === 'string' &&
        /metric/i.test(e.P1_metric_operator_not_constructed) &&
        /(unbroken|quasi-Hermitian)/i.test(e.P1_metric_operator_not_constructed) &&
        e.hilbertPolyaOperatorConstructed === false &&
        e.spectrumProvenRealAndDiscrete === false
      );
    },
  },

  // Tripwire 4: the circularity (unbroken-PT equivalent to RH) is stated.
  {
    id: 'imp2358-unbroken-pt-equals-rh',
    why:
      'The honest core of the verdict is that the remaining step is ' +
      'EQUIVALENT to RH for this operator, so it renames rather than removes ' +
      'the difficulty. Omitting this would overclaim progress.',
    holds: () => {
      const e = IMP_2358_BBM_PT_SYMMETRIC_SELF_ADJOINTNESS.selfAdjointnessEvaluation;
      return (
        typeof e.P2_unbroken_pt_equivalent_to_rh === 'string' &&
        /EQUIVALENT/.test(e.P2_unbroken_pt_equivalent_to_rh) &&
        /RH|critical line/.test(e.P2_unbroken_pt_equivalent_to_rh)
      );
    },
  },

  // Tripwire 5: the boundary-condition-is-zeta-secular obstruction (P3).
  {
    id: 'imp2358-boundary-is-zeta-secular',
    why:
      'The discreteness is imposed via a boundary condition that is the zeta ' +
      'secular condition in disguise (eigenfunctions built from zeta). This ' +
      'circular re-imposition must be recorded, not mistaken for an ' +
      'independent self-adjoint realisation.',
    holds: () => {
      const e = IMP_2358_BBM_PT_SYMMETRIC_SELF_ADJOINTNESS.selfAdjointnessEvaluation;
      return (
        typeof e.P3_boundary_condition_is_zeta_secular_in_disguise === 'string' &&
        /boundary/i.test(e.P3_boundary_condition_is_zeta_secular_in_disguise) &&
        /zeta/i.test(e.P3_boundary_condition_is_zeta_secular_in_disguise)
      );
    },
  },

  // Tripwire 6: the named sub-gap is present and flagged RH-equivalent.
  {
    id: 'imp2358-named-sub-gap-present',
    why:
      'An honest partial classification must name its precise residual gap. ' +
      'GAP-2358-BBM-METRIC-OPERATOR is the deliverable and must be flagged ' +
      'RH-equivalent so it is not mistaken for an easier sub-problem.',
    holds: () => {
      const g = IMP_2358_BBM_PT_SYMMETRIC_SELF_ADJOINTNESS.namedSubGap;
      return (
        g.id === 'GAP-2358-BBM-METRIC-OPERATOR' &&
        typeof g.statement === 'string' &&
        /metric/i.test(g.statement) &&
        g.isEquivalentToRH === true
      );
    },
  },

  // Tripwire 7: Sierra 2019 assessed and placed under the same obstruction.
  {
    id: 'imp2358-sierra-2019-same-obstruction',
    why:
      'The ticket names Sierra 2019 variants alongside BBM. They must be ' +
      'assessed and recorded as falling under the same (P1)-(P3) obstruction ' +
      'with no constructed self-adjoint zero-spectrum operator.',
    holds: () => {
      const s = IMP_2358_BBM_PT_SYMMETRIC_SELF_ADJOINTNESS.sierra2019Evaluation;
      return (
        typeof s.source === 'string' &&
        /Sierra/.test(s.source) &&
        /494|1601\.01797/.test(s.source) &&
        s.selfAdjointZeroSpectrumConstructed === false
      );
    },
  },

  // Tripwire 8: honest scope -- no RH claim, training-uncertainty acknowledged.
  {
    id: 'imp2358-honest-scope-no-rh-claim',
    why:
      'Per ticket spec this is an honest literature assessment that must ' +
      'explicitly NOT assert RH is proven and must acknowledge training-time ' +
      'uncertainty on the precise operator forms.',
    holds: () => {
      const top = IMP_2358_BBM_PT_SYMMETRIC_SELF_ADJOINTNESS;
      return (
        top.rhAsserted === false &&
        top.bbm2017Statement.isTrainingTimeUncertain === true &&
        Array.isArray(top.honestScope) &&
        top.honestScope.some((x) => /NOT asserted proven|not a proof/i.test(x))
      );
    },
  },
];
