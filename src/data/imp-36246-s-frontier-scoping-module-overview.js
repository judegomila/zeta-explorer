/**
 * @module imp-36246-s-frontier-scoping-module-overview
 *
 * imp-36246 (meta, sonnet-4-6): a single navigable cross-walk over the five recent
 * S-frontier scoping/requirement-enumeration modules -- imp-36154 (Krawczyk R1-R6),
 * imp-36172 (shock-Lipschitz S1-S5), imp-36180 (ESY/CM-B three-layer), imp-36192
 * (Step-2 G-step-error I1-I5), imp-36193 (Step-2 G-interval-enclosure E1-E5) -- so a
 * reader can see, in one place, which OPEN obligation each module enumerates and the
 * shared cruxes that recur across them (the directed-rounding layer, the min-gap
 * floor, and C_mb GUE-conditionality). Documentation/navigation only; restates each
 * module's own requirement labels and verdict verbatim; instantiates no interval;
 * discharges no obligation; changes no bound; NO QED.
 *
 * WHY THIS OVERVIEW. Each of the five source modules independently enumerates a
 * requirement list for its own OPEN obligation, but nothing previously cross-walked
 * them side by side. Reading them in isolation obscures that two pairs of
 * requirements are literally the SAME open crux wearing different module labels:
 * imp-36192 I4 and imp-36193 E3 both bottom out in the certified min-gap floor
 * delta_lo(t) that only G-gronwall (imp-2520) can supply, and imp-36154 R5 /
 * imp-36192 I5 / imp-36193 E2 all lean on the same UNIMPLEMENTED directed-rounding
 * primitive (imp-34687a / the imp-35969 nextafter surrogate).
 *
 * @see imp-36154-krawczyk-existence-uniqueness-subgap-requirements (R1-R6)
 * @see imp-36172-shock-lipschitz-finite-n-surrogate-requirements (S1-S5)
 * @see imp-36180-esy-cmb-local-law-input-scope (three ESY input layers)
 * @see imp-36192-step2-g-step-error-apriori-truncation-scope (I1-I5)
 * @see imp-36193-step2-g-interval-enclosure-nuniform-scope (E1-E5)
 * @see imp-36229-esy-input-layers-glossary-companion (glossary companion for imp-36180)
 * @see imp-36242-g-interval-enclosure-e1-e5-glossary-headword (glossary headword for imp-36193)
 * @see imp-36231-imp3615x-3621x-cross-reference-integrity-audit (prior cross-walk-style audit over an adjacent cohort)
 */

const SCOPING_MODULE_FAMILY = Object.freeze([
  Object.freeze({
    id: 'imp-36154',
    label: 'Krawczyk existence/uniqueness for the residual-node fixed point F(m) = m - K log T0(m)',
    obligation: 'imp-34714a (machine existence/uniqueness certificate for the residual node)',
    requirementCount: 6,
    requirementLabels: [
      'R1 certified residual value [F(m)]',
      'R2 certified derivative enclosure [F-prime(m)]',
      'R3 (H1) nonvanishing-derivative test',
      'R4 (H2) strict self-map inclusion',
      'R5 directed-rounding arithmetic layer',
      'R6 certified seed bracket + assembly',
    ],
    sharedCrux: 'R5: the imp-34687a directed-rounding layer is UNIMPLEMENTED (shared with I5, E2 below)',
    status: 'imp-34714a stays OPEN; imp-34687a stays UNIMPLEMENTED',
  }),
  Object.freeze({
    id: 'imp-36172',
    label: 'Shock-Lipschitz finite-N surrogate for the Step-4 G6a_shock_lipschitz Hoelder-1/2 modulus',
    obligation: 'G6a_shock_lipschitz (uniform modulus RH-HARD-CONFIRMED NEGATIVE; a finite-N surrogate is CONCEIVABLE)',
    requirementCount: 5,
    requirementLabels: [
      'S1 finite regularization height',
      'S2 certified finite-height curvature lower bound',
      'S3 finite-height simple-shock non-degeneracy',
      'S4 finite-strip complex fold inversion',
      'S5 height-conditional assembly + honest downgrade',
    ],
    sharedCrux: 'S5: any discharge is height-conditional (RH-up-to-T_star(N)), never the uniform modulus',
    status: 'G6a_shock_lipschitz stays OPEN for the uniform modulus; finite-N surrogate un-built (S2, S4 GREENFIELD)',
  }),
  Object.freeze({
    id: 'imp-36180',
    label: 'ESY/CM-B local law three-layer input scope for the Calogero-Moser arithmetic seed',
    obligation: 'the ESY-local-law inputs an unconditional C_mb bound would need',
    requirementCount: 3,
    requirementLabels: [
      'Layer I spectral-measure statement (local semicircle law)',
      'Layer II rigidity scale (N-uniform microscopic control)',
      'Layer III coupling to C_mb (universality-to-constant functional)',
    ],
    sharedCrux: 'Layer III: the coupling is only as strong as its GUE-conditional universality input (imp-486)',
    status: 'none established for the deterministic arithmetic seed; C_mb stays GUE-conditional',
  }),
  Object.freeze({
    id: 'imp-36192',
    label: 'Step-2 G-step-error a-priori RK4/DP5 truncation bound',
    obligation: 'G-step-error (imp-35058): an absolute a-priori step-budget truncation bound, distinct from the imp-2466 two-method gap',
    requirementCount: 5,
    requirementLabels: [
      'I1 vector-field Lipschitz bound on a tube',
      'I2 elementary-differential local truncation crux (dt^5 * delta^-9)',
      'I3 accumulated-error discrete Gronwall',
      'I4 certified gap floor delta_lo(t)',
      'I5 per-step outward-rounded arithmetic',
    ],
    sharedCrux: 'I3 needs the N-uniform L from G-gronwall (imp-2520); I4 is circularly coupled to G-interval-enclosure E3 (imp-36193) through the SAME gap floor delta_lo(t)',
    status: 'G-step-error stays OPEN; NOT independently dischargeable (I3, I4 depend on the other two Step-2 obligations)',
  }),
  Object.freeze({
    id: 'imp-36193',
    label: 'Step-2 G-interval-enclosure N-uniform interval certificate for t_c(N)',
    obligation: 'G-interval-enclosure: extend the imp-362 single-N interval witness to an N-uniform half-width law',
    requirementCount: 5,
    requirementLabels: [
      'E1 certified seed intervals for arbitrary N',
      'E2 sound (directed) rounding',
      'E3 interval pole reduction crux (delta_lo^-2 blow-up)',
      'E4 N-uniform accumulated width control',
      'E5 documented N-dependence (the deliverable half-width law)',
    ],
    sharedCrux: 'E3 is the SAME open crux as I4 above (imp-36192): both need the certified gap floor delta_lo(t) > 0 that only G-gronwall (imp-2520) can supply',
    status: 'G-interval-enclosure stuck at a single N (imp-362, 870-zero table); E2/E3/E4/E5 all un-built past that one witness',
  }),
]);

const TOTAL_REQUIREMENT_COUNT = SCOPING_MODULE_FAMILY.reduce((sum, m) => sum + m.requirementCount, 0); // 6+5+3+5+5 = 24

// Cruxes that recur across two or more modules in the family, rather than being
// local to a single one -- the payoff of cross-walking them side by side.
const CROSS_CUTTING_CRUXES = Object.freeze([
  Object.freeze({
    key: 'directed-rounding-layer',
    appearsIn: ['imp-36154 (R5)', 'imp-36192 (I5)', 'imp-36193 (E2)'],
    description:
      'all three lean on the same UNIMPLEMENTED machine directed-rounding primitive (imp-34687a); the ' +
      'imp-35969 nextafter surrogate is a ~2x-conservative stand-in used in place of it, NOT a certificate',
  }),
  Object.freeze({
    key: 'certified-min-gap-floor',
    appearsIn: ['imp-36192 (I4)', 'imp-36193 (E3)'],
    description:
      'CIRCULARLY the same object: I4 and E3 both need a certified gap floor delta_lo(t) > 0 up to ' +
      'just-before the collision time t_c, which only the SEPARATE open G-gronwall obligation (imp-2520) ' +
      'can supply -- the same lemma is Gronwall-vacuous at the nearest-pair front',
  }),
  Object.freeze({
    key: 'gue-conditional-universality',
    appearsIn: ['imp-36180 (Layer III)'],
    description:
      'C_mb stays GUE-conditional (imp-486 found no unconditional bound); distinct from the arithmetic/' +
      'gap-floor cruxes above but the recurring conditional-discharge pattern across the whole S-frontier',
  }),
  Object.freeze({
    key: 'height-conditional-downgrade',
    appearsIn: ['imp-36172 (S5)'],
    description:
      'a discharge, if built, would deliver RH-up-to-T_star(N), NOT the uniform statement -- the same ' +
      'honest-downgrade pattern used by the imp-36173 B2 T_star(N) ladder',
  }),
]);

export const IMP36246_S_FRONTIER_SCOPING_MODULE_OVERVIEW = {
  id: 'imp-36246',
  proofSection: 'S-frontier',
  question:
    'Tabulate the five recent S-frontier scoping-module family members (imp-36154 R1-R6, imp-36172 ' +
    'S1-S5, imp-36180 three-layer, imp-36192 I1-I5, imp-36193 E1-E5) into one navigable requirement-' +
    'enumeration overview, surfacing which requirements are shared cruxes across modules rather than ' +
    'independent obligations. Documentation/navigation only; NO QED.',
  family: SCOPING_MODULE_FAMILY,
  familyCount: SCOPING_MODULE_FAMILY.length,
  totalRequirementCount: TOTAL_REQUIREMENT_COUNT,
  crossCuttingCruxes: CROSS_CUTTING_CRUXES,
  isRigorous: false,
  verdict:
    'OVERVIEW ONLY (navigation, not rigorous, not a measurement). Five S-frontier scoping modules ' +
    '(imp-36154, imp-36172, imp-36180, imp-36192, imp-36193) enumerate 24 requirements total across ' +
    'their own OPEN obligations. Cross-walking them side by side surfaces two genuine shared cruxes ' +
    'rather than 24 independent ones: (1) the imp-34687a directed-rounding layer recurs in imp-36154 ' +
    'R5, imp-36192 I5, and imp-36193 E2; (2) the certified min-gap floor delta_lo(t) is the CIRCULARLY ' +
    'shared object between imp-36192 I4 and imp-36193 E3, both gated on the same open G-gronwall ' +
    'obligation (imp-2520). imp-36180 Layer III and imp-36172 S5 each carry their own recurring pattern ' +
    '(GUE-conditional universality; height-conditional honest downgrade). This module restates each ' +
    'source module’s own labels and verdict verbatim; it discharges no obligation, instantiates no ' +
    'interval, and changes no bound. C_mb stays GUE-conditional (imp-486); no RH verdict, NO QED. ' +
    'No refereed bound is changed.',
  citation:
    'imp-36154 (Krawczyk existence/uniqueness R1-R6); imp-36172 (shock-Lipschitz finite-N surrogate ' +
    'S1-S5); imp-36180 (ESY/CM-B three-layer input scope); imp-36192 (Step-2 G-step-error I1-I5); ' +
    'imp-36193 (Step-2 G-interval-enclosure E1-E5); imp-2520 (G-gronwall, the shared gap-floor gate); ' +
    'imp-34687a (directed-rounding layer, shared UNIMPLEMENTED primitive); imp-486 (C_mb GUE-conditional); ' +
    'imp-36231 (prior cross-walk-style audit over an adjacent cohort, method precedent).',
};

export const IMP36246_S_FRONTIER_SCOPING_MODULE_OVERVIEW_ASSERTIONS = [
  {
    id: 'imp36246-five-modules-tabulated',
    description: 'the overview tabulates exactly the five named S-frontier scoping modules',
    holds: () =>
      IMP36246_S_FRONTIER_SCOPING_MODULE_OVERVIEW.familyCount === 5 &&
      SCOPING_MODULE_FAMILY.map((m) => m.id).join(',') ===
        'imp-36154,imp-36172,imp-36180,imp-36192,imp-36193',
  },
  {
    id: 'imp36246-requirement-count-accounting',
    description: 'the total requirement count is the sum of each module’s own requirement count (6+5+3+5+5=24)',
    holds: () =>
      IMP36246_S_FRONTIER_SCOPING_MODULE_OVERVIEW.totalRequirementCount === 24 &&
      SCOPING_MODULE_FAMILY.every((m) => m.requirementLabels.length === m.requirementCount),
  },
  {
    id: 'imp36246-shared-gap-floor-crux-identified',
    description: 'the min-gap-floor crux names both imp-36192 I4 and imp-36193 E3 as the same circularly-coupled object gated on G-gronwall',
    holds: () => {
      const crux = CROSS_CUTTING_CRUXES.find((c) => c.key === 'certified-min-gap-floor');
      return !!crux &&
        crux.appearsIn.some((s) => /imp-36192/.test(s)) &&
        crux.appearsIn.some((s) => /imp-36193/.test(s)) &&
        /G-gronwall/.test(crux.description) &&
        /imp-2520/.test(crux.description);
    },
  },
  {
    id: 'imp36246-shared-directed-rounding-crux-identified',
    description: 'the directed-rounding crux names all three modules that lean on the imp-34687a layer',
    holds: () => {
      const crux = CROSS_CUTTING_CRUXES.find((c) => c.key === 'directed-rounding-layer');
      return !!crux && crux.appearsIn.length === 3 &&
        crux.appearsIn.some((s) => /imp-36154/.test(s)) &&
        crux.appearsIn.some((s) => /imp-36192/.test(s)) &&
        crux.appearsIn.some((s) => /imp-36193/.test(s));
    },
  },
  {
    id: 'imp36246-honesty-gate-no-qed',
    description: 'overview only: not rigorous, discharges nothing, no QED, no refereed bound is changed',
    holds: () =>
      IMP36246_S_FRONTIER_SCOPING_MODULE_OVERVIEW.isRigorous === false &&
      /NO QED/.test(IMP36246_S_FRONTIER_SCOPING_MODULE_OVERVIEW.verdict) &&
      /refereed bound is changed/i.test(IMP36246_S_FRONTIER_SCOPING_MODULE_OVERVIEW.verdict),
  },
];

for (const a of IMP36246_S_FRONTIER_SCOPING_MODULE_OVERVIEW_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-36246-s-frontier-scoping-module-overview assertion failed: ${a.id}`);
  }
}

export default IMP36246_S_FRONTIER_SCOPING_MODULE_OVERVIEW;
