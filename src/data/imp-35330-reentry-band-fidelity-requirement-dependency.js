/**
 * @module imp-35330-reentry-band-fidelity-requirement-dependency
 *
 * imp-35330 (proof, frontier-direction) -- the LOGICAL-DEPENDENCY assessment of the four imp-35243
 * surrogate-fidelity requirements R1-R4 for the imp-34997/imp-35111 iters-to-floor REENTRY band. imp-35243
 * enumerated R1 (floor-independence), R2 (single-rate fidelity), R3 (height-map fidelity), R4 (independent-model
 * agreement) as an UNORDERED checklist and flagged BOTH R1 and R4 as BINDING; imp-35297 then gave R4 its own
 * dedicated treatment and found it has zero independent witnesses. This module asks the ORDERING question those
 * two left open: are the four requirements independent, or is there a dependency DAG among them? It ENUMERATES
 * (i) whether R1 being unmet makes R4 VACUOUS-BY-CONSTRUCTION rather than merely un-attempted, and (ii) whether
 * R2 and R3 are DOMINATED by R1. ASSESSMENT ONLY: it does NOT discharge imp-35111a / imp-35174a / imp-35243a;
 * the surrogate half stays OPEN; it changes no bound; NO QED.
 *
 * THE FOUR REQUIREMENTS, AS INHERITED
 * -----------------------------------
 * R1 FLOOR-INDEPENDENCE  -- re-express the band floor-free, or prove an intrinsic EPS_FP floor.
 * R2 SINGLE-RATE FIDELITY -- bound the nonlinear remainder so the single contraction rate governs the approach.
 * R3 HEIGHT-MAP FIDELITY  -- certify g = K log T0(N) out at N ~ 10^37, where the constants were pinned near 3e12.
 * R4 INDEPENDENT-MODEL AGREEMENT -- a second, structurally-independent witness reproduces the band edges.
 * imp-35243 D1 shows the band POSITION and its off-by-one window WIDTH are set by the machine-epsilon floor
 * EPS_FP = 2.3e-16 (relocating ~11.99 decades in N per factor-2 change; window width is the ratio EPS_FP/PENULT);
 * D2 shows the band sits ~14.6 to ~24.7 decades above the highest verified zero height (~3e12).
 *
 * CLAIM 1  --  R1 UNMET MAKES R4 VACUOUS-BY-CONSTRUCTION (R4 is DOWNSTREAM of R1)
 * ------------------------------------------------------------------------------
 * Suppose R1 is unmet in the strong sense D1 evidences: the band is a PURE floor artifact -- its very existence
 * and its off-by-one window are produced by the terminal ceil of the discrete iterate count against the EPS_FP
 * floor, with no counterpart in the infinite-precision continuum. Then consider R4 witness W1, a floor-FREE
 * independent model (imp-35297): a floor-free model has no machine-epsilon floor, hence no terminal ceil, hence
 * no off-by-one, hence NO BAND to reproduce at 10^27.08 / 10^37.17. The same holds for W2, the true continuum
 * dynamic read off a verified zero: being floor-free, it would carry no band there. So under R1-unmet, the
 * AGREEMENT R4 seeks is not merely un-attempted -- it is IMPOSSIBLE-IN-PRINCIPLE as a positive confirmation: any
 * faithful floor-free witness would place no band there (it would REFUTE, never REPRODUCE, the edges). The only
 * witness that COULD reproduce the band is one that itself carries the EPS_FP floor -- i.e. exactly the kind
 * that is NOT independent (W3, the imp-34862 two-rate reconstruction, shares the floor and, imp-34862 found,
 * does not even remove the off-by-one). CONCLUSION: R1-unmet ==> R4 vacuous-by-construction. R4 is thus not an
 * independent second obstruction; its BINDING-and-UNREACHABLE status (imp-35297) is a DOWNSTREAM CONSEQUENCE of
 * R1. R4 only becomes a live, satisfiable requirement if R1 is first MET (band re-expressed floor-free) -- then
 * and only then is there a floor-free band an independent floor-free witness could agree with.
 *
 * HONESTY QUALIFIER ON CLAIM 1. The implication is conditional: R1-unmet(pure-artifact) ==> R4-vacuous. D1
 * demonstrates strong floor-SENSITIVITY (the ~12-decade-per-factor-2 slide), which is powerful evidence the band
 * is floor-anchored, but it has NOT formally proven the band is a PURE artifact with zero continuum residue --
 * establishing that is precisely R1 itself, still OPEN. So R4 is not yet FORMALLY proven vacuous; rather, R1 and
 * R4 are LOGICALLY CHAINED: any resolution of R1 as pure-artifact automatically resolves R4 as vacuous, and the
 * only route to a live R4 runs through meeting R1. Either way R4 sits DOWNSTREAM of R1.
 *
 * CLAIM 2  --  R2 AND R3 ARE DOMINATED BY R1
 * ------------------------------------------
 * R2 (single-rate fidelity) and R3 (height-map fidelity) both govern WHERE the band edges fall in N -- the phase
 * argument xArg and the height map g = K log T0(N) fix the position, not the existence, of the off-by-one. But
 * D1 shows the band EXISTS at all only because of the terminal ceil against the EPS_FP floor. Hence even if R2
 * and R3 were both perfectly met -- a faithful single rate and a faithful height map out to 10^37 -- the object
 * they faithfully position is still a floor artifact: R2/R3 refine WHERE, R1 governs WHETHER. A floor artifact
 * positioned faithfully is still a floor artifact, so meeting R2/R3 does NOT establish the band as a feature of
 * the true dynamic. Conversely, R2/R3 only become the OPERATIVE fidelity conditions once R1 is met and a
 * floor-free band survives to be positioned. CONCLUSION: R2 and R3 are subordinate to (dominated by) R1.
 *
 * THE RESULTING DEPENDENCY DAG
 * ----------------------------
 * R1 is the ROOT. R4 is a child of R1 (vacuous while R1 unmet; live only once R1 met). R2 and R3 are children of
 * R1 (operative only once R1 met). So the imp-35243 checklist is NOT four independent requirements with two
 * binding -- it is a DAG rooted at the SINGLE binding obstruction R1, from which R4 unreachability follows and to
 * which R2/R3 are subordinate. The count of INDEPENDENT binding obstructions is therefore 1 (R1), not 2. This
 * REFINES imp-35243 (R1 and R4 both flagged BINDING) and imp-35297 (R4 binding, zero witnesses): R4 binding is
 * DERIVED from R1 binding, not co-equal with it, and the whole fidelity gap collapses onto R1.
 *
 * WHAT THIS IS AND IS NOT
 * -----------------------
 * A logical-ordering assessment of the imp-35243 R1-R4 checklist, showing R1 is the root and R4/R2/R3 are
 * downstream of it. It discharges NOTHING: R1 stays the OPEN binding obstruction; imp-35111a / imp-35174a /
 * imp-34997a / imp-35243a stay OPEN. ASSESSMENT ONLY on the inherited imp-3220/imp-3406 surrogate; the
 * C_C = (1/8) sqrt(3 pi) ansatz (imp-2642/imp-2643) is UNTOUCHED; the C_mb GUE-conditional per imp-486 is
 * UNTOUCHED; imp-3066 K_a >= 0 untouched; far-tail exponent stays 1/2 (imp-3463); changes no bound; establishes
 * no operator positivity; no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-35243-reentry-band-surrogate-fidelity-assessment (enumerates R1-R4; unordered checklist, R1/R4 binding)
 * @see imp-35297-r4-independent-model-agreement-assessment (R4 has zero independent witnesses; W1/W2/W3)
 * @see imp-35263 (R1 floor-independence) / imp-35259 (R2 single-rate) / imp-35260 (R3 height-map)
 * @see imp-34862-iters-to-floor-two-rate-law (two-rate law does NOT remove the off-by-one; not independent)
 * @see imp-35174-reentry-band-precision-certification (discharged the ARITHMETIC half; re-pointed imp-35174a)
 */

// Inherited band landmarks (imp-35174 double-double certified) and the PT verified-height anchor.
const REENTRY_EXP = 27.084691; // band-on, log10 N (imp-34997/35111/35174)
const EXIT_EXP = 37.167107; // band-off, log10 N (imp-35111/35174)
const PT_VERIFIED_HEIGHT_LOG10 = Math.log10(3e12); // ~12.48 -- highest verified zero height binding Lambda<=0.2
const BAND_WIDTH_DECADES = EXIT_EXP - REENTRY_EXP; // ~10.08
const NEAREST_EDGE_DECADES_ABOVE_VERIFIED = REENTRY_EXP - PT_VERIFIED_HEIGHT_LOG10; // ~14.6

// The dependency edges among R1-R4. parentOf = the requirement this one is subordinate to; null for the root.
const REQUIREMENT_DAG = [
  {
    id: 'R1',
    name: 'floor-independence',
    role: 'ROOT',
    parentOf: null,
    binding: true,
    bindingIsDerived: false,
    note: 'Root obstruction. D1: the band position slides ~11.99 decades per factor-2 in EPS_FP and its off-by-one window width is the ratio EPS_FP/PENULT -- both machine-precision constants with no continuum counterpart. OPEN.',
  },
  {
    id: 'R4',
    name: 'independent-model agreement',
    role: 'DOWNSTREAM-OF-R1',
    parentOf: 'R1',
    binding: true,
    bindingIsDerived: true,
    note: 'VACUOUS-BY-CONSTRUCTION while R1 unmet: a pure floor artifact has no counterpart in any floor-free independent witness, so agreement can only REFUTE, never REPRODUCE, the band. Live only once R1 is met. R4 binding is a consequence of R1 binding, not co-equal (refines imp-35297).',
  },
  {
    id: 'R2',
    name: 'single-rate fidelity',
    role: 'DOMINATED-BY-R1',
    parentOf: 'R1',
    binding: false,
    bindingIsDerived: false,
    note: 'Governs WHERE the band edges fall (phase argument xArg), not WHETHER a band exists. A floor artifact positioned faithfully is still a floor artifact; operative only once R1 is met.',
  },
  {
    id: 'R3',
    name: 'height-map fidelity',
    role: 'DOMINATED-BY-R1',
    parentOf: 'R1',
    binding: false,
    bindingIsDerived: false,
    note: 'Governs WHERE the band edges fall (g = K log T0(N) at 10^37), not WHETHER a band exists. Operative only once R1 is met.',
  },
];

// Independent binding obstructions = binding requirements whose binding status is NOT derived from another.
const INDEPENDENT_BINDING_COUNT = REQUIREMENT_DAG.filter((r) => r.binding && !r.bindingIsDerived).length; // 1 (R1)

export const IMP35330_REENTRY_BAND_FIDELITY_REQUIREMENT_DEPENDENCY = {
  id: 'imp-35330',
  proofSection: 'S-frontier',
  question:
    'imp-35243 enumerated four surrogate-fidelity requirements R1-R4 for the reentry band as an UNORDERED ' +
    'checklist and flagged both R1 (floor-independence) and R4 (independent-model agreement) as BINDING. ' +
    'Determine their logical ordering: does R1 being unmet make R4 vacuous-by-construction (a pure floor ' +
    'artifact cannot be reproduced by any floor-free independent model, so R4 is unreachable rather than ' +
    'merely un-attempted), and are R2 (single-rate fidelity) and R3 (height-map fidelity) dominated by R1?',
  landmarks: {
    reentry_log10_N: REENTRY_EXP, // 27.084691
    exit_log10_N: EXIT_EXP, // 37.167107
    band_width_decades: +BAND_WIDTH_DECADES.toPrecision(4), // ~10.08
    pt_verified_height_log10: +PT_VERIFIED_HEIGHT_LOG10.toPrecision(5), // ~12.48 (N ~ 3e12)
    nearest_edge_decades_above_verified: +NEAREST_EDGE_DECADES_ABOVE_VERIFIED.toPrecision(4), // ~14.6
  },
  requirement_dag: REQUIREMENT_DAG,
  independent_binding_count: INDEPENDENT_BINDING_COUNT, // 1 (R1 alone)
  r4_vacuous_by_construction:
    'YES (conditionally on R1-unmet, which D1 evidences but has not formally proven). If the band is a pure ' +
    'floor artifact -- existence and off-by-one window set by the terminal ceil against the EPS_FP floor, no ' +
    'continuum counterpart -- then any floor-FREE independent witness (W1 second model, W2 true continuum ' +
    'dynamic) carries no such band, so R4 agreement can only REFUTE, never REPRODUCE, the edges. The only ' +
    'witness that could reproduce the band is one carrying the EPS_FP floor, i.e. NOT independent (W3). So R4 ' +
    'is not merely un-attempted but impossible-in-principle as a positive confirmation while R1 is unmet -- ' +
    'R4 is DOWNSTREAM of R1 and becomes live only once R1 is met.',
  r2_r3_dominated_by_r1:
    'YES. R2 and R3 fix WHERE the band edges fall (phase argument xArg; height map g = K log T0(N)), but D1 ' +
    'shows the band EXISTS only because of the terminal ceil against the EPS_FP floor. A floor artifact ' +
    'positioned faithfully by a perfect R2/R3 is still a floor artifact, so meeting R2/R3 does not establish ' +
    'the band in the true dynamic. R2/R3 are the operative fidelity conditions only once R1 is met.',
  finding:
    'Logical-ordering assessment of the imp-35243 R1-R4 checklist. CLAIM 1: R1-unmet (pure floor artifact) ' +
    'makes R4 VACUOUS-BY-CONSTRUCTION -- a floor-free independent witness has no floor, no terminal ceil, no ' +
    'off-by-one, hence no band to reproduce, so R4 agreement can only refute (never reproduce) the edges; the ' +
    'only reproducing witness carries the floor and is thus not independent. R4 is DOWNSTREAM of R1, live only ' +
    'once R1 is met. CLAIM 2: R2 (single-rate fidelity) and R3 (height-map fidelity) fix WHERE the edges fall, ' +
    'not WHETHER the band exists, so a faithful R2/R3 still positions a floor artifact -- R2/R3 are DOMINATED ' +
    'by R1. VERDICT: the four requirements form a DAG rooted at the SINGLE binding obstruction R1, from which ' +
    'R4 unreachability follows and to which R2/R3 are subordinate; the count of INDEPENDENT binding ' +
    'obstructions is 1 (R1), not 2. This refines imp-35243 (R1/R4 co-flagged binding) and imp-35297 (R4 ' +
    'binding): R4 binding is DERIVED from R1 binding. Discharges nothing; imp-35111a/imp-35174a/imp-35243a stay OPEN.',
  residual_sub_gap:
    'The whole fidelity gap collapses onto R1 (imp-35263): re-express the reentry band floor-free, or prove an ' +
    'intrinsic EPS_FP floor. Meeting R1 unlocks R2/R3 as operative and R4 as satisfiable; leaving R1 unmet ' +
    'keeps R4 vacuous and R2/R3 moot. Inherits, and does not discharge, imp-35111a / imp-35174a / imp-34997a / ' +
    'imp-35243a.',
  isRigorous: false,
  verdict:
    'ASSESSMENT (proof-section, frontier-direction, NOT an RH bound). The imp-35243 R1-R4 surrogate-fidelity ' +
    'requirements for the reentry band [10^27.08, 10^37.17] are NOT an unordered checklist with two binding ' +
    'members: they form a dependency DAG rooted at R1 (floor-independence). CLAIM 1 -- R1-unmet (pure floor ' +
    'artifact, per D1 floor-sensitivity) makes R4 (independent-model agreement) VACUOUS-BY-CONSTRUCTION: a ' +
    'floor-free independent witness carries no band, so R4 agreement can only refute, never reproduce, the ' +
    'edges; R4 is unreachable-in-principle rather than merely un-attempted, and is DOWNSTREAM of R1. CLAIM 2 -- ' +
    'R2 (single-rate) and R3 (height-map) fix WHERE not WHETHER the band exists, so they are DOMINATED by R1. ' +
    'The count of INDEPENDENT binding obstructions is 1 (R1). This refines imp-35243 and imp-35297: R4 binding ' +
    'is DERIVED from R1 binding, not co-equal. HONESTY: the R1-unmet hypothesis is D1-evidenced but not ' +
    'formally proven (that is R1 itself, OPEN), so R4 is not yet formally proven vacuous -- R1 and R4 are ' +
    'logically chained. Discharges NOTHING; imp-35111a / imp-35174a / imp-35243a stay OPEN; imp-35174 ' +
    'arithmetic result unaffected. ASSESSMENT ONLY on the inherited imp-3220/imp-3406 surrogate; the ' +
    'C_C = (1/8) sqrt(3 pi) ansatz (imp-2642/imp-2643) and C_mb GUE-conditional per imp-486 UNTOUCHED; ' +
    'imp-3066 K_a >= 0 untouched; far-tail exponent stays 1/2 (imp-3463); changes no bound; establishes no ' +
    'operator positivity; no RH verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-35243 (enumerates R1-R4, unordered, R1/R4 binding); imp-35297 (R4 zero independent witnesses); ' +
    'imp-35263/35259/35260 (R1/R2/R3 dedicated tickets); imp-34862 (two-rate law does NOT remove the ' +
    'off-by-one, not independent); imp-35174 (discharged the arithmetic half); imp-34997/imp-35111 (locate the ' +
    'band edges); imp-2642 (C_C ansatz); imp-486 (C_mb GUE-conditional).',
};

export const IMP35330_REENTRY_BAND_FIDELITY_REQUIREMENT_DEPENDENCY_ASSERTIONS = [
  {
    // The DAG enumerates all four requirements R1-R4 exactly once.
    id: 'imp35330-four-requirements-in-dag',
    description: 'the dependency DAG covers exactly R1/R2/R3/R4',
    holds: () =>
      REQUIREMENT_DAG.length === 4 &&
      REQUIREMENT_DAG.map((r) => r.id).sort().join(',') === 'R1,R2,R3,R4',
  },
  {
    // R1 is the ROOT (no parent) and the SOLE independent binding obstruction.
    id: 'imp35330-r1-is-root-sole-independent-binding',
    description: 'R1 is the root (parentOf null), binding, non-derived; exactly one independent binding obstruction',
    holds: () => {
      const r1 = REQUIREMENT_DAG.find((r) => r.id === 'R1');
      return (
        r1.parentOf === null &&
        r1.role === 'ROOT' &&
        r1.binding === true &&
        r1.bindingIsDerived === false &&
        INDEPENDENT_BINDING_COUNT === 1
      );
    },
  },
  {
    // R4 is binding-but-DERIVED (downstream of R1); R2/R3 are dominated by R1 and non-binding.
    id: 'imp35330-r4-derived-r2-r3-dominated',
    description: 'R4 binding is derived from R1; R2/R3 are dominated by R1 and not independently binding',
    holds: () => {
      const r4 = REQUIREMENT_DAG.find((r) => r.id === 'R4');
      const r2 = REQUIREMENT_DAG.find((r) => r.id === 'R2');
      const r3 = REQUIREMENT_DAG.find((r) => r.id === 'R3');
      return (
        r4.binding === true &&
        r4.bindingIsDerived === true &&
        r4.parentOf === 'R1' &&
        r2.parentOf === 'R1' &&
        r3.parentOf === 'R1' &&
        r2.binding === false &&
        r3.binding === false
      );
    },
  },
  {
    // The band still sits ~15 decades above any verified height (imp-35243 D2 context restated).
    id: 'imp35330-band-far-above-verified-height',
    description: 'nearest band edge ~14.6 decades above the ~3e12 verified-height anchor; width ~10.08',
    holds: () =>
      Math.abs(NEAREST_EDGE_DECADES_ABOVE_VERIFIED - 14.6) < 0.1 &&
      Math.abs(BAND_WIDTH_DECADES - 10.08) < 0.05,
  },
  {
    // Honesty gate: assessment only, discharges nothing, conditional verdicts, no QED, no refereed bound is changed.
    id: 'imp35330-honesty-gate-no-qed',
    description: 'Assessment only: isRigorous false, R4 vacuous conditional YES, R2/R3 dominated YES, no QED, no refereed bound is changed, sub-gaps OPEN',
    holds: () =>
      IMP35330_REENTRY_BAND_FIDELITY_REQUIREMENT_DEPENDENCY.isRigorous === false &&
      /^YES/.test(IMP35330_REENTRY_BAND_FIDELITY_REQUIREMENT_DEPENDENCY.r4_vacuous_by_construction) &&
      /^YES/.test(IMP35330_REENTRY_BAND_FIDELITY_REQUIREMENT_DEPENDENCY.r2_r3_dominated_by_r1) &&
      /NO QED/.test(IMP35330_REENTRY_BAND_FIDELITY_REQUIREMENT_DEPENDENCY.verdict) &&
      /refereed bound is changed/i.test(IMP35330_REENTRY_BAND_FIDELITY_REQUIREMENT_DEPENDENCY.verdict) &&
      /imp-35243a/.test(IMP35330_REENTRY_BAND_FIDELITY_REQUIREMENT_DEPENDENCY.residual_sub_gap) &&
      /imp-35111a/.test(IMP35330_REENTRY_BAND_FIDELITY_REQUIREMENT_DEPENDENCY.residual_sub_gap),
  },
];

for (const a of IMP35330_REENTRY_BAND_FIDELITY_REQUIREMENT_DEPENDENCY_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-35330-reentry-band-fidelity-requirement-dependency assertion failed: ${a.id}`);
  }
}
