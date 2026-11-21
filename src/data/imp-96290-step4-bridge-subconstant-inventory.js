/**
 * @module data/imp-96290-step4-bridge-subconstant-inventory
 * @fileoverview imp-96290 -- measurement inventory of the Step-4 Polymath15
 *   bridge sub-constants (G6, G6a, C_H) and the residual gap to a quantitative
 *   E(N) -> 0 statement.
 *
 *   lambda-roadmap currentStatus names G6/G6a/C_H as the open Step-4 bridge
 *   between the imp-341 Dyson lim-sup skeleton (a := lim sup_N |t_c(N)| = 0)
 *   and an unconditional Lambda theorem. No single module tabulated the current
 *   numerical magnitudes of the three named sub-constants together. This module
 *   ASSEMBLES that inventory: it enumerates the best currently-available
 *   definitions and numerical magnitudes of the three named objects as they
 *   appear across the repo Step-4 modules, tabulates what each controls in the
 *   error decomposition E(N) = E_trunc(N) + E_flow(N) + E_coll(N), and MEASURES
 *   the residual gap -- i.e. which constant N-dependence is still unquantified.
 *
 *   FINDING (measurement): the residual gap is NOT the bridge assembly (G6,
 *   closed by imp-345/366/387) nor the shock Holder modulus mechanism (G6a,
 *   closed by imp-366) nor the cusp factor C_shock (N-uniform, < 1/3 and
 *   decreasing along the ladder, imp-2995/imp-2786). It localizes to the single
 *   sub-factor C_Lip inside C_H = C_shock * C_Lip / 4: the N-uniform Gronwall
 *   Lipschitz constant of the collision-time functional, whose N-dependence is
 *   unquantified (imp-2640 Gronwall discharge NEGATIVE; ch-wall-frontier-verdict
 *   RH-HARD-CONFIRMED). The polylog-over-N RATE of E(N) is unconditional; the
 *   E(N) -> 0 CONCLUSION is gated on this one unquantified factor.
 *
 *   INVENTORY / MEASUREMENT ONLY. This module closes no gap, changes no bound,
 *   proves no constant, and asserts no closure of G6_polymath15_bridge. RH
 *   remains open. NO QED.
 *
 * Provenance of every baked literal (single sources of truth, cited not
 *   recomputed unless noted):
 *   - lambda-polymath15-bridge.js (imp-345/366/387): E(N) decomposition, G6/G6a
 *     closure records, kappa_T = 1 - 0.818 = 0.182 from imp-317.
 *   - polymath15-lemma52-shock-holder.js (imp-366/2642/2995): C_H = C_shock *
 *     C_Lip / 4, C_H_HOLDER placeholder, C_shock closed form < 1/3, C_Lip the
 *     RH-hard Gronwall factor.
 *   - imp-2706-ecoll-conditional-modulo-ch.js: C_KH = pi * 2.622 = 8.2373
 *     (imp-2641 Trudgian discharge), E_trunc ~3.1e-5, E_flow ~1.239e-3,
 *     E_coll(1/8) ~0.010881, E_coll(0.127) ~0.011055, conditional E(N) < 0.2.
 *   - imp-2701-ch-rigor-lock.js / imp-2642: C_H isRigorousUpperBound = false.
 *   - imp-838 (skp3-002): C_F(N) = (log(T_0(N)/2pi) + 1) / (2pi), analytically
 *     pinned with explicit N-dependence.
 *
 * Syntax note: derivative-like expressions use brace notation dg_{k*}/dt and
 *   this header avoids the close-comment terminator sequence inside prose.
 */

// Platt-Trudgian 2021 SOTA unconditional upper bound (reference anchor only).
const PT_BOUND = 0.2;

// The three NAMED Step-4 bridge sub-constants, with best-available magnitude,
// what each controls in E(N), current status, and provenance module.
const SUB_CONSTANTS = [
  {
    name: 'G6 (G6_polymath15_bridge)',
    kind: 'composite bridge blocker (gap label, not a scalar)',
    definition:
      'The load-bearing bridge that upgrades the imp-341 unconditional lim-sup ' +
      'a = lim sup_N |t_c(N)| = 0 (N-particle Calogero-Moser collapse time) to a ' +
      'statement about Lambda itself, via |Lambda - (-t_c(N))| <= E(N) with ' +
      'E(N) = E_trunc(N) + E_flow(N) + E_coll(N).',
    bestNumericalMagnitude:
      'Not a scalar. The composed budget at N = 1e4 is E(N)|_{C_H=1/8} = ' +
      'E_trunc + E_flow + E_coll ~= 3.1e-5 + 1.239e-3 + 0.010881 ~= 0.01212.',
    controlsInEN: 'the whole error term E(N) (all three sub-terms combined)',
    status:
      'assembly CLOSED modulo symbolic constants (imp-345 skeleton, imp-366 ' +
      'E_coll port, imp-387 coordinated flip); RATE O((log N / N)^{1/2}) ' +
      'unconditional, E(N) -> 0 GATED on C_H.',
    provenance: 'lambda-polymath15-bridge.js (imp-345/366/387)',
  },
  {
    name: 'G6a (G6a_shock_lipschitz)',
    kind: 'shock Holder-modulus sub-gap (gap label, mechanism)',
    definition:
      'Quantitative Holder-1/2 modulus of the first-collision time functional ' +
      'tau_c : (empirical N-particle configs, W_1) -> R at the Burgers shock, ' +
      'constants uniform in N. Mechanism: quadratic tangency d(g_min^2)/dt = -8 ' +
      'plus the cusp density rho_inf ~ C_cusp / |gamma - gamma_star|^{1/2}.',
    bestNumericalMagnitude:
      'Quadratic-tangency collision constant C_collision = 8 (exact, from ' +
      '2 g dg_{k*}/dt = 2 g (-4/g) = -8). Holder exponent 1/2 (exact). The ' +
      'MODULUS constant it yields is C_H (next row).',
    controlsInEN:
      'the Holder-1/2 exponent and mechanism of E_coll(N) = C_C * (log gamma_N ' +
      '/ N)^{1/2}, C_C = C_H * sqrt(C_KH)',
    status:
      'CLOSED by imp-366 (Polymath15 Lemma 5.2 port, arXiv:1904.12438). The ' +
      'exponent/mechanism is rigorous; the leading MODULUS constant C_H is not.',
    provenance: 'polymath15-lemma52-shock-holder.js (imp-366)',
  },
  {
    name: 'C_H (Holder-1/2 modulus constant)',
    kind: 'numerical leading constant',
    definition:
      'C_H = C_shock * C_Lip / 4, the N-uniform leading constant of the ' +
      'Holder-1/2 bound |tau_c(mu_1) - tau_c(mu_2)| <= C_H * W_1^{1/2}. It is ' +
      'the linchpin of E_coll and of the whole E(N) -> 0 conclusion.',
    bestNumericalMagnitude:
      'Ansatz / leading-order value 1/8 = 0.125 (EXACT quadratic-tangency ' +
      'coefficient, rigorous only for the R = 0 two-particle dynamics); ' +
      'imp-2642 stress test pushes the effective coefficient to ~0.127 via a ' +
      'positive O(1) drift remainder. Conditional hypothesis C_H <= 0.127 is ' +
      'GENEROUS. Module placeholder C_H_HOLDER = 1.0.',
    controlsInEN:
      'the linear leading factor of E_coll(N) (E_coll(C_H) = C_H * sqrt(C_KH) ' +
      '* sqrt(log T0 / N), strictly increasing and linear in C_H); dominant ' +
      'sub-term of E(N).',
    status:
      'isRigorousUpperBound = false (imp-2642 / imp-2701 lock). No proven ' +
      'N-uniform upper bound; imp-2640 Gronwall discharge NEGATIVE.',
    provenance:
      'polymath15-lemma52-shock-holder.js (imp-2642/2995), imp-2701-ch-rigor-lock.js',
  },
];

// The two factors of C_H = C_shock * C_Lip / 4, classified by whether their
// N-dependence is quantified. This is where the residual gap localizes.
const C_H_FACTORS = {
  formula: 'C_H = C_shock * C_Lip / 4',
  C_shock: {
    role: 'cusp-density scaling factor of the Holder modulus',
    closedForm:
      'C_shock(N) = sqrt(2 pi / N) / sqrt(W_1) = sqrt(2 pi / (C_KH log gamma_N))',
    magnitudeAtN1e4: 0.288, // sqrt(2pi/1e4)/sqrt(8.2373*log(9879)/1e4)
    nDependence:
      'QUANTIFIED: N-uniform up to a slow sqrt(1/log) decay; stays < 1/3 and ' +
      'strictly decreases along LADDER_N (imp-2995/imp-2786 single source).',
    isNDependenceQuantified: true,
  },
  C_Lip: {
    role:
      'Gronwall Lipschitz constant of the gap functional g_min under the Dyson ' +
      'backward flow (|g_min(mu_1) - g_min(mu_2)| <= C_Lip * W_1)',
    closedForm: 'none pinned; asserted N-uniform "via the Gronwall bound" only',
    magnitudeAtN1e4: null,
    nDependence:
      'UNQUANTIFIED: the claimed N-uniformity rests on a Gronwall bound whose ' +
      'discharge is NEGATIVE (imp-2640; ch-wall-frontier-verdict RH-HARD-' +
      'CONFIRMED). This is the RH-hard factor of C_H.',
    isNDependenceQuantified: false,
  },
};

// The other E(N) constants, tabulated for contrast -- all quantified or
// rate-positive, so NONE of them is the residual gap.
const OTHER_EN_CONSTANTS = [
  {
    name: 'C_T / kappa_T (E_trunc)',
    controls: 'E_trunc(N) = C_T * T_0(N)^(-kappa_T) * log T_0(N)',
    status:
      'RATE positive unconditionally: kappa_T = 1 - 0.818 = 0.182 from the ' +
      'imp-317 hybrid Guth-Maynard/Ingham thin-strip exponent. Magnitude at ' +
      'N=1e4 ~3.1e-5 (negligible). C_T symbolic O(1).',
    isNDependenceQuantified: true,
  },
  {
    name: 'C_F (E_flow)',
    controls: 'E_flow(N) = C_F * log T_0(N) / T_0(N) * exp(C_G |t_c(N)|)',
    status:
      'ANALYTICALLY PINNED with explicit N-dependence: C_F(N) = (log(T_0(N)/' +
      '2pi) + 1) / (2pi) (imp-838). Magnitude at N=1e4 ~1.239e-3.',
    isNDependenceQuantified: true,
  },
  {
    name: 'C_KH (E_coll Koksma-Hlawka factor)',
    controls: 'C_C = C_H * sqrt(C_KH), the W_1 discrepancy factor of E_coll',
    status:
      'DISCHARGED: C_KH = pi * C_Selberg = pi * 2.622 = 8.2373 (imp-2641 ' +
      'Trudgian discharge, conservative vs the 3.0 placeholder).',
    isNDependenceQuantified: true,
  },
];

export const IMP96290_STEP4_BRIDGE_SUBCONSTANT_INVENTORY = {
  id: 'imp-96290',
  title:
    'Measurement inventory of the Step-4 G6/G6a/C_H Polymath15 bridge ' +
    'sub-constants and the residual gap to a quantitative E(N) -> 0 statement',
  kind: 'inventory / measurement (no closure, no bound change)',
  errorDecomposition: 'E(N) = E_trunc(N) + E_flow(N) + E_coll(N)',
  subConstants: SUB_CONSTANTS,
  cHFactorization: C_H_FACTORS,
  otherENConstants: OTHER_EN_CONSTANTS,
  residualGapMeasurement: {
    question:
      'Which constant N-dependence is still unquantified between the assembled ' +
      'numerical picture and a quantitative E(N) -> 0 statement?',
    answer:
      'The single sub-factor C_Lip inside C_H = C_shock * C_Lip / 4. Every ' +
      'other input is either quantified (C_F pinned, C_KH discharged, C_shock ' +
      'N-uniform < 1/3) or rate-positive (kappa_T = 0.182). C_Lip is the ' +
      'N-uniform Gronwall Lipschitz constant whose discharge is NEGATIVE ' +
      '(imp-2640), so its N-dependence is unquantified and RH-hard.',
    quantifiedInputs: [
      'kappa_T = 0.182 (rate positive, imp-317)',
      'C_F(N) = (log(T_0/2pi)+1)/(2pi) analytically pinned (imp-838)',
      'C_KH = 8.2373 discharged (imp-2641)',
      'C_shock < 1/3 N-uniform, decreasing (imp-2995/imp-2786)',
    ],
    unquantifiedInput: 'C_Lip (Gronwall Lipschitz factor of C_H; imp-2640 NEGATIVE)',
    consequence:
      'The polylog-over-N RATE O((log N / N)^{1/2}) of E(N) is unconditional; ' +
      'the E(N) -> 0 CONCLUSION is gated on C_Lip (hence on C_H). Conditionally ' +
      'on C_H <= 0.127 the whole budget is E(N) <= 0.0125 < 0.2 (~16x margin, ' +
      'imp-2706), but that hypothesis is UNPROVEN.',
  },
  conditionalAnchor: {
    hypothesis: 'C_H <= 0.127',
    E_trunc: 3.1e-5,
    E_flow: 1.239e-3,
    E_coll_at_1over8: 0.0108806,
    E_coll_at_hyp: 0.0110547,
    E_N_at_hyp_approx: 0.01224,
    PT_BOUND,
    isProven: false,
  },
  verdict:
    'INVENTORY COMPLETE. The three named Step-4 objects: G6 (bridge assembly) ' +
    'and G6a (shock Holder mechanism) are CLOSED; C_H is the one open leading ' +
    'constant and its residual gap localizes to the single factor C_Lip. RATE ' +
    'unconditional, E(N) -> 0 gated on C_Lip. No refereed bound is changed' +
    '. This module closes nothing and changes no bound. RH open. NO QED.',
  provenance:
    'lambda-polymath15-bridge.js; polymath15-lemma52-shock-holder.js; ' +
    'imp-2706-ecoll-conditional-modulo-ch.js; imp-2701-ch-rigor-lock.js; imp-838',
};

export const IMP96290_STEP4_BRIDGE_SUBCONSTANT_INVENTORY_ASSERTIONS = [
  {
    id: 'imp96290-three-named-subconstants-inventoried',
    holds: () => SUB_CONSTANTS.length === 3,
    why:
      'The ticket names exactly three Step-4 bridge sub-constants (G6, G6a, ' +
      'C_H); the inventory must tabulate all three.',
  },
  {
    id: 'imp96290-residual-gap-is-c-lip',
    holds: () =>
      IMP96290_STEP4_BRIDGE_SUBCONSTANT_INVENTORY.residualGapMeasurement.unquantifiedInput.startsWith(
        'C_Lip',
      ) && C_H_FACTORS.C_Lip.isNDependenceQuantified === false,
    why:
      'The measured residual gap must localize to C_Lip, the one factor of ' +
      'C_H whose N-dependence is unquantified (imp-2640 NEGATIVE). If a future ' +
      'edit reclassifies C_Lip as quantified, the same commit must supply the ' +
      'proof and revert this inventory finding.',
  },
  {
    id: 'imp96290-c-shock-quantified-not-the-gap',
    holds: () =>
      C_H_FACTORS.C_shock.isNDependenceQuantified === true &&
      C_H_FACTORS.C_shock.magnitudeAtN1e4 < 1 / 3,
    why:
      'C_shock is N-uniform and < 1/3 (imp-2995/imp-2786), so it is NOT the ' +
      'residual gap; the RH-hardness of C_H lives entirely in C_Lip.',
  },
  {
    id: 'imp96290-c-h-not-rigorous-inventory-honest',
    holds: () =>
      IMP96290_STEP4_BRIDGE_SUBCONSTANT_INVENTORY.conditionalAnchor.isProven === false,
    why:
      'C_H isRigorousUpperBound = false (imp-2642/imp-2701). The inventory must ' +
      'never classify the conditional C_H <= 0.127 anchor as proven; doing so ' +
      'would silently re-introduce the withdrawn overclaim.',
  },
  {
    id: 'imp96290-no-closure-claimed',
    holds: () =>
      /INVENTORY|no closure|closes nothing/i.test(
        IMP96290_STEP4_BRIDGE_SUBCONSTANT_INVENTORY.verdict,
      ) && IMP96290_STEP4_BRIDGE_SUBCONSTANT_INVENTORY.kind.includes('no closure'),
    why:
      'This ticket is inventory/measurement only and must not assert closure ' +
      'of G6_polymath15_bridge or change any bound.',
  },
];
