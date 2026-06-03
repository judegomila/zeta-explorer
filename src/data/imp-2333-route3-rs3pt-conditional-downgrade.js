/**
 * @module data/imp-2333-route3-rs3pt-conditional-downgrade
 * @fileoverview imp-2333 — formally DOWNGRADE the status of Route 3 (the
 * higher-cumulant / higher-order-correlation ESY-closure route) to
 * CONDITIONAL on the Rudnick-Sarnak three-point conjecture for general
 * (unrestricted-Fourier-support) test functions.
 *
 * WHAT THE TICKET ASKED (two alternatives)
 * ----------------------------------------
 * Either (A) establish an UNCONDITIONAL bound on the three-point
 * correlation rho_3 for GENERAL test functions (the ticket suggested a
 * restriction-method attack, e.g. Maynard / Lewko-Radziwill restriction
 * estimates), OR (B) formally restate Route 3 status as conditional on the
 * Rudnick-Sarnak three-point conjecture, so the roadmap reflects that the
 * REAL Route 3 bottleneck is rho_3, not Montgomery PCC (the imp-1247
 * correction of imp-1184 / imp-1184-overstated-PCC per imp-1247).
 *
 * VERDICT (honest, alternative B delivered; alternative A NOT delivered)
 * ---------------------------------------------------------------------
 * VERDICT: 'route-3-formally-conditional-on-rs3pt-general-test-function'
 *
 * No unconditional general-test-function rho_3 bound is established here:
 * delivering one would essentially prove the Rudnick-Sarnak three-point
 * conjecture (open since 1996). The restriction-method candidate the ticket
 * named is surveyed and shown NOT to discharge the obstruction
 * unconditionally, for a STRUCTURAL reason (Section D): every restriction /
 * band-limited / sieve estimate of this family is admissible only on a
 * BOUNDED Fourier window, the same wall as Rudnick-Sarnak 1996; it widens
 * the admissible window but never reaches the FULL support that the
 * microscopic Route 3 observable (the Poisson kernel phi_{x,y_micro} of
 * imp-1180) requires. Route 3 is therefore formally CONDITIONAL on the
 * Rudnick-Sarnak three-point conjecture.
 *
 * This module is an HONEST-SCOPE / STATUS record. It adds no new
 * mathematics and claims none. Its contribution is to (a) pin the
 * load-bearing Route 3 gap as gap-RS-3pt-general-test-fn (confirming the
 * imp-1247 correction), (b) record the precise unconditional-vs-conditional
 * boundary for rho_3, (c) survey the restriction-method candidate and name
 * why it does not close the gap, and (d) set the formal Route 3 status flag.
 *
 * CONSEQUENCE FOR THE HEADLINE
 * ----------------------------
 * Route 3 is NOT an unconditional ESY-closure route. The established
 * no-asterisk SOTA (Platt-Trudgian Lambda <= 0.2) is UNCHANGED. No
 * Lambda bound moves. This downgrade only corrects the roadmap label so a
 * future reader does not mistake Route 3 for an unconditional path.
 *
 * @see imp-1180 imp-1180-higher-order-correlation-route.js (route B map; names c_3 gap)
 * @see imp-1184 imp-1184-direct-selberg-esy-route-audit.js (original 5x3 obstruction map)
 * @see imp-1247 imp-1247-shared-pcc-obstruction-recheck.js (PCC-not-load-bearing-for-Route-3 correction)
 * @see imp-1297 imp-1297-selberg-trace-pcc-route.js (no 4th route bypasses RS-3pt)
 */

// =========================================================================
// SECTION A — THE THREE-POINT CONJECTURE: UNCONDITIONAL vs CONDITIONAL.
// =========================================================================
//
// The Rudnick-Sarnak 1996 theorem gives the random-matrix sine-kernel
// n-point correlation prediction UNCONDITIONALLY, but ONLY for test
// functions whose Fourier transform is supported in (-2/n, 2/n). For
// n = 3 the admissible window is (-2/3, 2/3). The FULL-support n-point
// correlation is the (still-conjectural) Bogomolny-Keating / Conrey-Snaith
// statement. The dividing line is exactly the Fourier-support width.

const RS3PT = Object.freeze({
  name: 'Rudnick-Sarnak three-point correlation rho_3',
  unconditionalPart: Object.freeze({
    statement:
      'For test functions phi with Fourier support in (-2/3, 2/3), the ' +
      '3-point correlation sum of the Riemann zeros equals the GUE ' +
      'sine-kernel prediction UNCONDITIONALLY.',
    fourierSupportWindow: 2 / 3, // half-width for n = 3
    isUnconditional: true,
    citation: 'Rudnick-Sarnak 1996, Duke Math. J. 81, 269-322, Thm 1.1',
  }),
  conditionalPart: Object.freeze({
    statement:
      'For GENERAL (unrestricted Fourier support) test functions the 3-point ' +
      'correlation equalling the sine-kernel prediction is the Rudnick-Sarnak ' +
      'three-point CONJECTURE (subsumed by Bogomolny-Keating / Conrey-Snaith ' +
      'full n-point), and is OPEN.',
    fourierSupportWindow: Infinity, // full support
    isUnconditional: false,
    isConjecture: true,
    citation: 'Bogomolny-Keating 1996; Conrey-Snaith 2007 ratios conjecture',
  }),
  whyRoute3NeedsTheGeneralCase:
    'The Route 3 higher-cumulant kappa_3 contraction bounds a MOMENT of the ' +
    'microscopic linear statistic psi_N built on the Poisson kernel ' +
    'phi_{x, y_micro} (imp-1180). That kernel is NOT band-limited to ' +
    '(-2/3, 2/3): its Fourier transform has full support at the microscopic ' +
    'scale, so only the CONJECTURAL general-test-function rho_3 controls it. ' +
    'The unconditional restricted-support identity does not reach it.',
});

// =========================================================================
// SECTION B — ROUTE 3 LOAD-BEARING GAP (confirms the imp-1247 correction).
// =========================================================================
//
// imp-1184 listed Montgomery PCC as required by all three routes. imp-1247
// corrected this: for Route 3 the kappa_2 (variance) term uses only the
// Selberg 1944 second-moment UPPER bound, which is unconditional and does
// NOT need PCC; the genuinely load-bearing gap for Route 3 is the
// general-test-function rho_3 entering at kappa_p for p >= 3. This module
// pins that and makes the conditional explicit.

const ROUTE3_DEPENDENCY = Object.freeze({
  routeId: 'route-3-higher-cumulant',
  loadBearingGapId: 'gap-RS-3pt-general-test-fn',
  pccIsLoadBearing: false, // corrected from imp-1184 by imp-1247
  pccRoleOnRoute3:
    'kappa_2 uses the Selberg 1944 second-moment UPPER bound (unconditional); ' +
    'PCC is referenced but its failure mode is NOT why Route 3 fails.',
  rs3ptIsLoadBearing: true,
  rs3ptRoleOnRoute3:
    'the general-test-function rho_3 enters the kappa_3 connected-correlation ' +
    'contraction; without it the third-cumulant term is not controlled, so ' +
    'the moment bound on psi_N cannot be closed unconditionally.',
  confirmsTicket: 'imp-1247',
});

// =========================================================================
// SECTION C — RESTRICTION-METHOD CANDIDATE SURVEY (alternative A attempt).
// =========================================================================
//
// The ticket proposed attacking the general-test-function rho_3 via
// restriction estimates (named "Maynard-Lewko restrictions"). We do NOT
// assert any specific published three-point theorem of that name; we assess
// the STRUCTURAL viability of any such restriction / band-limited / sieve
// approach for delivering the FULL-support rho_3 unconditionally.

const RESTRICTION_METHOD_SURVEY = Object.freeze({
  candidateClass:
    'restriction / large-values / sieve estimates for Dirichlet polynomials ' +
    'and zero correlations (the restriction-method family the ticket named).',
  whatItBuys:
    'A WIDER but still BOUNDED admissible Fourier window than the naive ' +
    'Rudnick-Sarnak (-2/3, 2/3): restriction inputs can push the support ' +
    'threshold for unconditional control above 2/3, sharpening the constant.',
  whyItDoesNotClose:
    'Every estimate of this family is admissible only on a BOUNDED frequency ' +
    'window by construction (it controls a band-limited L^p norm). The ' +
    'microscopic Poisson kernel phi_{x, y_micro} has FULL Fourier support, so ' +
    'no finite widening of the window reaches it. Pushing the threshold to ' +
    'the full line is EQUIVALENT to the general-test-function rho_3 itself, ' +
    'i.e. equivalent to proving the Rudnick-Sarnak three-point conjecture. ' +
    'The restriction route therefore re-derives the CONDITIONAL statement on ' +
    'a sub-class; it does not discharge the obstruction unconditionally.',
  deliversUnconditionalGeneralRho3: false,
  honestCitationNote:
    'No specific "Maynard-Lewko" general-test-function three-point theorem is ' +
    'asserted here; the survey audits the structural ceiling of the method ' +
    'class and refuses to fabricate a citation.',
});

// =========================================================================
// SECTION D — NAMED RESIDUAL SUB-GAP.
// =========================================================================

const RESIDUAL = Object.freeze({
  id: 'GAP-RS3PT-FULL-SUPPORT',
  statement:
    'Prove the GUE sine-kernel 3-point correlation prediction for the Riemann ' +
    'zeros holds for GENERAL (full-Fourier-support) test functions, ' +
    'unconditionally. Equivalent to the Rudnick-Sarnak three-point ' +
    'conjecture; would unblock Route 3 (and the kappa_3 term of Route 1) at ' +
    'the unconditional level.',
  isOpen: true,
  isResearchGrade: true,
  blocksRoutes: Object.freeze(['route-1-direct-DSE', 'route-3-higher-cumulant']),
});

// =========================================================================
// EXPORTED RECORD.
// =========================================================================

export const IMP_2333_ROUTE3_RS3PT_CONDITIONAL_DOWNGRADE = Object.freeze({
  id: 'imp-2333-route3-rs3pt-conditional-downgrade',
  ticket: 'imp-2333',
  builtAt: '2026-06-03T00:00:00Z',
  relatedTickets: Object.freeze(['imp-1180', 'imp-1184', 'imp-1247', 'imp-1297']),

  verdict: 'route-3-formally-conditional-on-rs3pt-general-test-function',
  outcome: 'formal-downgrade-delivered',
  unconditionalGeneralRho3Delivered: false,
  route3FormalStatus: 'CONDITIONAL-ON-RS3PT-GENERAL-TEST-FUNCTION',

  rs3pt: RS3PT,
  route3Dependency: ROUTE3_DEPENDENCY,
  restrictionMethodSurvey: RESTRICTION_METHOD_SURVEY,
  residual: RESIDUAL,

  consequenceForHeadline: Object.freeze({
    route3IsUnconditionalClosureRoute: false,
    lambdaBoundMoved: false,
    establishedNoAsteriskSOTA: 'Platt-Trudgian Lambda <= 0.2 (unchanged)',
    note:
      'This is a roadmap-status correction only. It records that Route 3 is ' +
      'conditional on the Rudnick-Sarnak three-point conjecture, NOT on ' +
      'Montgomery PCC (per imp-1247). No bound improves.',
  }),

  recommendation:
    'Mark Route 3 as CONDITIONAL-ON-RS3PT in the roadmap. Track ' +
    'general-test-function rho_3 progress (GAP-RS3PT-FULL-SUPPORT) as a ' +
    'SEPARATE priority from Montgomery PCC: the two unblock DIFFERENT routes ' +
    'and closing one does not close the other. Do NOT promote any bounded-' +
    'window restriction estimate as an unconditional Route 3 closure.',
});

export default IMP_2333_ROUTE3_RS3PT_CONDITIONAL_DOWNGRADE;

// ── Build-time assertions ───────────────────────────────────────────────────

export const IMP_2333_ROUTE3_RS3PT_CONDITIONAL_DOWNGRADE_ASSERTIONS = [
  {
    id: 'imp2333-route3-is-conditional-not-unconditional',
    holds: () =>
      IMP_2333_ROUTE3_RS3PT_CONDITIONAL_DOWNGRADE.route3FormalStatus ===
        'CONDITIONAL-ON-RS3PT-GENERAL-TEST-FUNCTION' &&
      IMP_2333_ROUTE3_RS3PT_CONDITIONAL_DOWNGRADE.unconditionalGeneralRho3Delivered ===
        false,
    why:
      'imp-2333 delivers the FORMAL DOWNGRADE (alternative B), not an ' +
      'unconditional general rho_3 (alternative A). If a future edit flips ' +
      'unconditionalGeneralRho3Delivered to true it must discharge ' +
      'GAP-RS3PT-FULL-SUPPORT (the Rudnick-Sarnak three-point conjecture), not ' +
      'merely re-label. Guards against silent overclaim.',
  },
  {
    id: 'imp2333-load-bearing-gap-is-rs3pt-not-pcc',
    holds: () =>
      IMP_2333_ROUTE3_RS3PT_CONDITIONAL_DOWNGRADE.route3Dependency.loadBearingGapId ===
        'gap-RS-3pt-general-test-fn' &&
      IMP_2333_ROUTE3_RS3PT_CONDITIONAL_DOWNGRADE.route3Dependency.pccIsLoadBearing ===
        false &&
      IMP_2333_ROUTE3_RS3PT_CONDITIONAL_DOWNGRADE.route3Dependency.rs3ptIsLoadBearing ===
        true,
    why:
      'The whole point of imp-2333 (and the imp-1247 correction it confirms) ' +
      'is that the Route 3 bottleneck is general-test-function rho_3, NOT ' +
      'Montgomery PCC. If these flags drift, the roadmap correction is lost.',
  },
  {
    id: 'imp2333-unconditional-rho3-restricted-support-only',
    holds: () =>
      IMP_2333_ROUTE3_RS3PT_CONDITIONAL_DOWNGRADE.rs3pt.unconditionalPart
        .isUnconditional === true &&
      IMP_2333_ROUTE3_RS3PT_CONDITIONAL_DOWNGRADE.rs3pt.unconditionalPart
        .fourierSupportWindow === 2 / 3 &&
      IMP_2333_ROUTE3_RS3PT_CONDITIONAL_DOWNGRADE.rs3pt.conditionalPart
        .isUnconditional === false,
    why:
      'The unconditional Rudnick-Sarnak 1996 rho_3 holds ONLY on the bounded ' +
      'window (-2/3, 2/3); the general-support case is conjectural. Conflating ' +
      'the two would mis-state the unconditional-vs-conditional boundary that ' +
      'is the core of this downgrade.',
  },
  {
    id: 'imp2333-restriction-method-does-not-close',
    holds: () =>
      IMP_2333_ROUTE3_RS3PT_CONDITIONAL_DOWNGRADE.restrictionMethodSurvey
        .deliversUnconditionalGeneralRho3 === false,
    why:
      'The restriction-method candidate (the ticket alternative A) is surveyed ' +
      'as STRUCTURALLY unable to reach full Fourier support unconditionally. ' +
      'If this flips to true without an actual proof, the downgrade premise ' +
      'is broken.',
  },
  {
    id: 'imp2333-residual-named-and-open',
    holds: () =>
      IMP_2333_ROUTE3_RS3PT_CONDITIONAL_DOWNGRADE.residual.id ===
        'GAP-RS3PT-FULL-SUPPORT' &&
      IMP_2333_ROUTE3_RS3PT_CONDITIONAL_DOWNGRADE.residual.isOpen === true,
    why:
      'The named residual sub-gap (general-test-function rho_3) is the precise ' +
      'scope a future unconditional closure must discharge. Removing or ' +
      'closing it without a proof loses the honest scoping.',
  },
  {
    id: 'imp2333-no-lambda-bound-moved',
    holds: () =>
      IMP_2333_ROUTE3_RS3PT_CONDITIONAL_DOWNGRADE.consequenceForHeadline
        .lambdaBoundMoved === false &&
      IMP_2333_ROUTE3_RS3PT_CONDITIONAL_DOWNGRADE.consequenceForHeadline.establishedNoAsteriskSOTA.includes(
        '0.2',
      ),
    why:
      'This is a roadmap-status correction, not a bound improvement. The ' +
      'established no-asterisk SOTA stays Platt-Trudgian Lambda <= 0.2. Guards ' +
      'against an honest-scope file being mis-read as a Lambda improvement.',
  },
];
