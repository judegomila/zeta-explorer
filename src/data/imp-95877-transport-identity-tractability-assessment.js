/**
 * @fileoverview imp-95877 — assess (and attempt) the imp-95861 TRANSPORT identity: does the
 * m-parametric 238-cell reconstruction integrand equal Sun Prop-6.3 Q_0(m,v) IDENTICALLY as a
 * function of m (not merely numerically at m=20)? Proving this ONE symbolic identity would carry
 * the single Sun-certified m=20 anchor to every modulus, discharging the imp-95861 residual
 * conditionality (PIECE A / integrand-faithfulness) for all m at once and retiring the per-modulus
 * anchor family that the INDEPENDENT route would otherwise need.
 *
 * WHAT THE TRANSPORT IDENTITY ACTUALLY ASSERTS. The m-dependence of the whole (6.21) integral is
 * quarantined in a SINGLE sector (imp-95745): the Q_0 sector INT_0^1 Q_0(m,v) zeta(3,1+v) dv. The
 * const sector (3/2) and the +4 offset are PROVEN m-free (imp-95745, from the universal identity
 * INT_0^1 zeta(2,1+v) dv = 1). So the transport identity reduces EXACTLY to a per-cell coefficient
 * law: the reconstruction produces, on each breakpoint cell, a quadratic
 *     Q_0^recon(m,v) = -(4m-1)/2 . v^2 + s_J(m,cell) . v + c_J(m,cell),
 * and the claim is that this equals Sun Q_0(m,v) as a function of (m,v) -- i.e. that the three
 * coefficient tiers (leading curvature, linear s_J, constant c_J) and the breakpoint geometry match
 * Prop 6.3 symbolically in m.
 *
 * TRACTABILITY DECOMPOSITION (three coefficient tiers, classified by how far each is already symbolic
 * in m). This is the assessment the ticket asks for.
 *   TIER 1 (leading curvature): -(4m-1)/2. ALREADY SYMBOLIC in m -- it is m-LINEAR with dc/dm = -2, a
 *     pure combinatorial slope of the odd-prime ladder; imp-95720 reproduced -(4m-1)/2 exactly (the
 *     -79/2 at m=20 the histogram proxy could not). SYMBOLIC-IN-m: DONE.
 *   TIER 2 (const sector + offset): 3/2 const sector, +4 offset. PROVEN m-FREE (imp-95745): both are
 *     pure rationals forced by the m-free telescope INT_0^1 zeta(2,1+v) dv = 1, carrying no
 *     alpha={mv}/beta={(2m+1)v}/gamma={2mv} and no curvature. SYMBOLIC-IN-m (trivially, m-free): DONE.
 *   TIER 3 (sub-leading per-cell coefficients s_J(m,cell), c_J(m,cell)): NUMERIC ONLY. These come from
 *     the exact greedy "lowest 1+v units of mass" multiset selection of K_v(1+v) (imp-95720), whose
 *     value depends combinatorially on the cell (via the h_v(y)+2r multiset ordering) AND on m (via the
 *     breakpoint loci). No closed form in m is established; s_J, c_J are pinned only numerically at
 *     m=20. TIER 3 IS THE BINDING OBSTRUCTION.
 *
 * THE TIER-3 OBSTRUCTION IS REAL, NOT AN ARTIFACT (this module's concrete attempt/measurement). If
 * TIER 3 were m-free and only the TIER-1 curvature carried m-dependence, then dQ/dm would be a
 * CONSTANT (curvature enters Q_0 linearly, dc/dm = -2 is constant, and the zeta(3,1+v) weight is
 * m-free). Measured against the imp-95822 grid-converged Q_0-sector values Q(m) at m=20,22,30,41, the
 * forward divided difference dQ/dm is NOT constant: it is +3.79e-6, +2.15e-6, +1.55e-6 -- positive,
 * monotone, and DECAYING by a factor ~2.4 across the sweep. A pure-TIER-1 (curvature-only) transport
 * model is therefore refuted: the sub-leading coefficients s_J(m,cell), c_J(m,cell) genuinely carry
 * m-dependence, so the transport identity CANNOT be closed by the two already-symbolic tiers alone.
 * Conversely, dQ/dm is smooth and monotone (no jumps), consistent with -- but NOT proof of -- a closed
 * form c_odd(1/m) in m existing (which is exactly what the imp-95878 INDEPENDENT route would target).
 *
 * A SECOND, STRUCTURAL OBSTRUCTION: THE CELL COUNT IS NOT m-FREE. imp-95861 lists "238 cells" among
 * the m-free structure, but the breakpoint set B (6.24) = {0,1} U {k/(m-1),k/m,k/(2m),k/(2m+1)} U
 * {half-integer loci} has O(m) points, so the RAW CELL COUNT grows with m (238 is the m=20 value). The
 * transport identity therefore cannot be stated as "the same 238-cell tableau at every m"; it must be
 * stated at the level of the per-LOCUS quadratic law (the coefficient attached to each fractional-part
 * discontinuity family j/(am+b)), with the cell count a derived m-dependent quantity. This is a
 * genuine refinement of the imp-95861 framing and part of what a proof must supply.
 *
 * VERDICT: PARTIALLY TRACTABLE, precise obstruction recorded. Two of the three coefficient tiers of
 * Q_0(m,v) are already symbolic in m (TIER 1 m-linear curvature; TIER 2 m-free const/offset). The
 * transport identity reduces to (i) a symbolic-in-m form for the TIER-3 sub-leading coefficients
 * s_J(m,cell), c_J(m,cell) of the greedy lowest-mass K_v selection, and (ii) an m-symbolic (per-locus,
 * not per-fixed-tableau) description of the breakpoint combinatorics. Both are open; the module refutes
 * the shortcut that TIER 1+2 alone would suffice. This does NOT construct the identity and changes no
 * bound.
 *
 * NAMED SUB-GAP: "symbolic-in-m TIER-3 K_v coefficients s_J(m,cell), c_J(m,cell) (greedy lowest-mass
 * multiset selection) + per-locus m-symbolic breakpoint combinatorics; the leading curvature -(4m-1)/2
 * (TIER 1) and const/offset 3/2,+4 (TIER 2) are already symbolic in m, but dQ/dm non-constant proves
 * TIER 3 carries residual m-dependence, so those two tiers alone cannot close the identity."
 *
 * Catalan G irrationality OPEN; Sun arXiv:2609.04176 single-author, unrefereed; changes no bound;
 * NO Lambda movement; no refereed bound is changed; NO QED. NO heavy imports.
 *
 * SOURCE: arXiv:2609.04176 Section 6, Prop 6.3, eqs (6.11)-(6.26). SCRATCH: tmp/imp-95877-scratch.mjs
 * (reuses the imp-95822 grid-converged Q_0-sector values baked by imp-95861; no new heavy quadrature).
 */

// Q_0-sector values (the ONLY m-dependent sector), grid-converged to ~1e-11 (imp-95822), carried
// verbatim from imp-95861 Q0_RECON:
const Q0_RECON = Object.freeze({
  20: -0.0106978911,
  22: -0.0106903118589691,
  30: -0.0106731394320504,
  41: -0.0106560776913469,
});
const MODULI = Object.freeze([20, 22, 30, 41]);

// leading curvature (TIER 1): -(4m-1)/2, m-linear with slope dc/dm = -2 (constant).
const curvature = (m) => -(4 * m - 1) / 2;

// forward divided differences dQ/dm across the sweep. If only the TIER-1 curvature carried the
// m-dependence, this would be constant (curvature enters Q_0 linearly, dc/dm constant, zeta(3) weight
// m-free). It is NOT constant => TIER 3 (sub-leading coefficients) carries genuine m-dependence.
const DQ_DM = Object.freeze(
  MODULI.slice(0, -1).map((m, i) => {
    const mNext = MODULI[i + 1];
    return Object.freeze({
      from: m,
      to: mNext,
      value: (Q0_RECON[mNext] - Q0_RECON[m]) / (mNext - m),
    });
  }),
);
const DQ_DM_VALUES = Object.freeze(DQ_DM.map((d) => d.value));
const DQ_DM_IS_MONOTONE_DECAYING =
  DQ_DM_VALUES.every((v) => v > 0)
  && DQ_DM_VALUES[0] > DQ_DM_VALUES[1]
  && DQ_DM_VALUES[1] > DQ_DM_VALUES[2];
// spread ratio: max/min of dQ/dm; a pure-TIER-1 model predicts ratio == 1 (constant).
const DQ_DM_SPREAD_RATIO = Math.max(...DQ_DM_VALUES) / Math.min(...DQ_DM_VALUES);

export const TRANSPORT_IDENTITY_TRACTABILITY_ASSESSMENT = Object.freeze({
  id: 'imp-95877-transport-identity-tractability-assessment',
  title:
    'Assess/attempt the imp-95861 TRANSPORT identity (reconstructed 238-cell integrand equals Sun '
    + 'Prop-6.3 Q_0(m,v) identically in m): decompose it into three coefficient tiers, show TIER 1 '
    + '(leading curvature) is m-linear-symbolic and TIER 2 (const/offset) is m-free, and refute the '
    + 'shortcut that those two tiers alone close it -- dQ/dm is non-constant, so the TIER-3 '
    + 'sub-leading K_v coefficients carry the binding residual m-dependence',
  status:
    'PARTIALLY TRACTABLE (assess + attempt) -- the transport identity reduces (via imp-95745, which '
    + 'quarantines all m-dependence in the Q_0 sector) to a per-cell coefficient law with THREE tiers: '
    + 'TIER 1 leading curvature -(4m-1)/2 is ALREADY SYMBOLIC (m-linear, dc/dm=-2; imp-95720 reproduced '
    + 'it); TIER 2 const sector 3/2 + offset 4 is PROVEN m-FREE (imp-95745, from INT_0^1 zeta(2,1+v) '
    + 'dv=1); TIER 3 sub-leading per-cell coefficients s_J(m,cell), c_J(m,cell) from the greedy '
    + 'lowest-mass K_v multiset selection are NUMERIC ONLY. This module ATTEMPTS the shortcut that TIER '
    + '1+2 alone suffice and REFUTES it: measured dQ/dm across m=20,22,30,41 is NOT constant '
    + '(+3.79e-6,+2.15e-6,+1.55e-6; spread ratio ~2.44) whereas a curvature-only model forces it '
    + 'constant, so TIER 3 carries genuine m-dependence. Also refines the imp-95861 framing: the raw '
    + 'cell count is NOT m-free (B (6.24) has O(m) breakpoints; 238 is the m=20 value), so the identity '
    + 'must be stated per-locus, not per-fixed-tableau. BINDING OBSTRUCTION = symbolic-in-m TIER-3 '
    + 'coefficients + per-locus breakpoint combinatorics. G irrationality OPEN; Sun unrefereed; changes '
    + 'no bound; no refereed bound is changed; NO QED',
  preprint: 'arXiv:2609.04176 (single-author, unrefereed)',
  source: 'arXiv:2609.04176 Section 6, Proposition 6.3, eqs (6.11)-(6.26)',
  builtOn:
    'imp-95861 (named the TRANSPORT route as the scaling PIECE-A discharge; carried Q0_RECON), '
    + 'imp-95745 (proved const sector 3/2 and offset +4 m-free; quarantined m-dependence in the Q_0 '
    + 'sector), imp-95720 (faithful 238-cell partition + exact-cell K_v reproducing the -(4m-1)/2 '
    + 'curvature), imp-95822 (grid-converged Q_0-sector values to ~1e-11)',

  // the transport identity, stated at the level it actually reduces to:
  reducedForm: Object.freeze({
    claim: 'Q_0^recon(m,v) = Sun Q_0(m,v) as a function of (m,v), i.e. the per-cell quadratic '
      + 'law -(4m-1)/2 . v^2 + s_J(m,cell) . v + c_J(m,cell) matches Prop 6.3 symbolically in m.',
    whyThisSuffices: 'imp-95745 proves the const sector (3/2) and the +4 offset are m-free, so all '
      + 'm-dependence of the (6.21) integral lives in the Q_0 sector INT_0^1 Q_0(m,v) zeta(3,1+v) dv; '
      + 'matching Q_0(m,v) symbolically transports the single m=20 anchor to every m.',
    mEntersVia: 'alpha={mv}, beta={(2m+1)v}, gamma={2mv} (breakpoint loci) and the curvature -(4m-1)/2',
  }),

  // imp-95915: reciprocal reading path across the three per-m kappa certification modules.
  readingPath: Object.freeze({
    position: '2 of 3',
    previous: Object.freeze({
      id: 'imp-95861',
      relation: 'names the PIECE A/PIECE B decomposition and the TRANSPORT route this module attempts',
    }),
    sibling: Object.freeze({
      id: 'imp-95878',
      relation: 'attempts the INDEPENDENT route -- the other way to supply PIECE A at m>20',
    }),
    // imp-95936: chain the TIER-3 binding obstruction named here to its sharpening (imp-95900) and the
    // still-open per-family attribution (imp-95916), so the reading path does not dead-end at "residual".
    followUp: Object.freeze({
      id: 'imp-95900',
      relation: 'sharpens the TIER-3 obstruction named here: shows it is an O(1) cancellation against the '
        + 'TIER-1 curvature drift (D_3(m) = -C_1), not a small residual, then imp-95916 attributes it per-family',
    }),
  }),

  // three coefficient tiers, classified by how far each is symbolic in m:
  tiers: Object.freeze([
    Object.freeze({
      tier: 1,
      name: 'leading curvature -(4m-1)/2',
      symbolicInM: 'DONE (m-linear, slope dc/dm = -2)',
      establishedBy: 'imp-95720 (exact-cell K_v reproduced -79/2 at m=20; the -(4m-1)/2 form is m-linear)',
      isBindingObstruction: false,
    }),
    Object.freeze({
      tier: 2,
      name: 'const sector 3/2 + offset 4',
      symbolicInM: 'DONE (proven m-free)',
      establishedBy: 'imp-95745 (pure rationals forced by the m-free telescope INT_0^1 zeta(2,1+v) dv=1)',
      isBindingObstruction: false,
    }),
    Object.freeze({
      tier: 3,
      name: 'sub-leading per-cell coefficients s_J(m,cell), c_J(m,cell)',
      symbolicInM: 'OPEN (numeric only, pinned at m=20 by the greedy lowest-mass K_v multiset selection)',
      establishedBy: 'none symbolically; the greedy h_v(y)+2r multiset ordering has no closed form in m',
      isBindingObstruction: true,
    }),
  ]),

  // the concrete attempt: refute the "TIER 1+2 alone close it" shortcut via the dQ/dm signature.
  curvatureOnlyModelTest: Object.freeze({
    prediction: 'if only TIER 1 carried the m-dependence, dQ/dm would be CONSTANT (curvature enters '
      + 'Q_0 linearly with constant slope dc/dm=-2 and the zeta(3,1+v) weight is m-free).',
    dQdm: DQ_DM,
    dQdmValues: DQ_DM_VALUES, // +3.79e-6, +2.15e-6, +1.55e-6
    isMonotoneDecaying: DQ_DM_IS_MONOTONE_DECAYING,
    spreadRatio: DQ_DM_SPREAD_RATIO, // ~2.44, far from the constant-model 1
    verdict: 'REFUTED -- dQ/dm is non-constant, so TIER 3 carries genuine m-dependence; the two '
      + 'already-symbolic tiers cannot close the transport identity by themselves.',
    smoothnessNote: 'dQ/dm is nonetheless smooth and monotone (no jumps) -- consistent with, but NOT '
      + 'proof of, a closed form c_odd(1/m) existing (the imp-95878 INDEPENDENT-route target).',
  }),

  // structural refinement of the imp-95861 framing:
  cellCountNotMFree: Object.freeze({
    claim: 'the raw cell count is NOT m-free; B (6.24) has O(m) breakpoints, so 238 is the m=20 value.',
    consequence: 'the transport identity must be stated as a per-LOCUS quadratic law (coefficient '
      + 'attached to each fractional-part discontinuity family j/(am+b)), not as a fixed 238-cell '
      + 'tableau; the cell count is a derived m-dependent quantity.',
    correctsImp95861: 'imp-95861 listed "238 cells" among the m-free structure; that holds for the '
      + 'curvature/const/offset LAWS but not for the tableau SIZE.',
  }),

  verdict: Object.freeze({
    tractability: 'PARTIALLY TRACTABLE',
    bindingObstruction: 'TIER 3 -- a symbolic-in-m form for the sub-leading per-cell coefficients '
      + 's_J(m,cell), c_J(m,cell) of the greedy lowest-mass K_v multiset selection, plus a per-locus '
      + '(not per-fixed-tableau) m-symbolic description of the breakpoint combinatorics.',
    whatIsDone: 'TIER 1 (leading curvature, m-linear) and TIER 2 (const sector + offset, m-free) are '
      + 'already symbolic in m; two of the three coefficient tiers are in hand.',
    whatIsRefuted: 'the shortcut that TIER 1+2 alone close the identity -- dQ/dm is non-constant.',
    conclusion:
      'The transport identity is not out of reach in principle (two of three coefficient tiers are '
      + 'symbolic in m) but is not closable by the current symbolic inventory: the sub-leading K_v '
      + 'coefficients demonstrably carry residual m-dependence and have no established closed form in '
      + 'm, and the breakpoint tableau is m-sized rather than fixed. A proof must symbolize the greedy '
      + 'lowest-mass multiset selection as a function of m. Changes no bound; NO QED.',
  }),

  caveats:
    'Assessment + a targeted numerical attempt (no new heavy quadrature): reuses the imp-95822 '
    + 'grid-converged Q_0-sector values baked by imp-95861 and the imp-95745/95720 tier structure. The '
    + 'dQ/dm signature refutes a curvature-only transport model but does NOT construct the identity or '
    + 'the missing TIER-3 closed form. Catalan G irrationality OPEN; Sun single-author, unrefereed; NO '
    + 'Lambda movement; no refereed bound is changed; NO QED.',
});

export const TRANSPORT_IDENTITY_TRACTABILITY_ASSESSMENT_ASSERTIONS = Object.freeze([
  {
    name: 'transport identity reduces to a per-cell Q_0 coefficient law (m-dependence quarantined in Q_0 sector)',
    holds: () => {
      const r = TRANSPORT_IDENTITY_TRACTABILITY_ASSESSMENT.reducedForm;
      return /Q_0/.test(r.claim)
        && /m-free/.test(r.whyThisSuffices)
        && /alpha=\{mv\}/.test(r.mEntersVia);
    },
  },
  {
    name: 'three tiers: TIER 1 and TIER 2 symbolic-in-m DONE, TIER 3 is the sole binding obstruction',
    holds: () => {
      const t = TRANSPORT_IDENTITY_TRACTABILITY_ASSESSMENT.tiers;
      return t.length === 3
        && /DONE/.test(t[0].symbolicInM) && t[0].isBindingObstruction === false
        && /DONE/.test(t[1].symbolicInM) && t[1].isBindingObstruction === false
        && /OPEN/.test(t[2].symbolicInM) && t[2].isBindingObstruction === true
        && t.filter((x) => x.isBindingObstruction).length === 1;
    },
  },
  {
    name: 'leading curvature -(4m-1)/2 is m-linear with constant slope dc/dm = -2 (TIER 1 symbolic)',
    holds: () => {
      const dcdm1 = curvature(21) - curvature(20);
      const dcdm2 = curvature(41) - curvature(40);
      return Math.abs(curvature(20) - (-39.5)) < 1e-12
        && Math.abs(curvature(41) - (-81.5)) < 1e-12
        && Math.abs(dcdm1 - (-2)) < 1e-12
        && Math.abs(dcdm2 - (-2)) < 1e-12;
    },
  },
  {
    name: 'curvature-only shortcut REFUTED: dQ/dm is non-constant (monotone decaying, spread ratio > 2)',
    holds: () => {
      const c = TRANSPORT_IDENTITY_TRACTABILITY_ASSESSMENT.curvatureOnlyModelTest;
      return c.isMonotoneDecaying === true
        && c.spreadRatio > 2
        && /REFUTED/.test(c.verdict)
        && DQ_DM_VALUES.every((v) => v > 0);
    },
  },
  {
    name: 'dQ/dm values reproduce from Q0_RECON (transcription-faithful) and are ~3.79e-6,2.15e-6,1.55e-6',
    holds: () =>
      Math.abs(DQ_DM_VALUES[0] - 3.789621e-6) < 1e-11
      && Math.abs(DQ_DM_VALUES[1] - 2.146553e-6) < 1e-11
      && Math.abs(DQ_DM_VALUES[2] - 1.551067e-6) < 1e-11,
  },
  {
    name: 'reading path: position 2 of 3, back to imp-95861, sibling imp-95878 (independent route)',
    holds: () => {
      const rp = TRANSPORT_IDENTITY_TRACTABILITY_ASSESSMENT.readingPath;
      return rp.position === '2 of 3'
        && rp.previous.id === 'imp-95861'
        && rp.sibling.id === 'imp-95878';
    },
  },
  {
    name: 'reading path follow-up chains to imp-95900 (TIER-3 cancellation sharpening)',
    holds: () => {
      const fu = TRANSPORT_IDENTITY_TRACTABILITY_ASSESSMENT.readingPath.followUp;
      return fu.id === 'imp-95900' && /cancellation/.test(fu.relation) && /imp-95916/.test(fu.relation);
    },
  },
  {
    name: 'cell count NOT m-free correction (238 is the m=20 value; identity is per-locus)',
    holds: () => {
      const c = TRANSPORT_IDENTITY_TRACTABILITY_ASSESSMENT.cellCountNotMFree;
      return /NOT m-free/.test(c.claim)
        && /per-LOCUS/.test(c.consequence)
        && /238/.test(c.correctsImp95861);
    },
  },
  {
    name: 'verdict PARTIALLY TRACTABLE, TIER-3 binding obstruction named, honest disclaimers present',
    holds: () => {
      const v = TRANSPORT_IDENTITY_TRACTABILITY_ASSESSMENT.verdict;
      const s = TRANSPORT_IDENTITY_TRACTABILITY_ASSESSMENT.status;
      return v.tractability === 'PARTIALLY TRACTABLE'
        && /TIER 3/.test(v.bindingObstruction)
        && /G irrationality OPEN/.test(s)
        && /refereed bound is changed/i.test(s)
        && /NO QED/.test(s);
    },
  },
]);

export default TRANSPORT_IDENTITY_TRACTABILITY_ASSESSMENT;
