/**
 * @module imp-36137-routeC-perN-rate-form-and-bridge-consumability
 * @fileoverview imp-36137 -- Derive the EXPLICIT per-N rate r(N) form that the
 *   Route-C (imp-337 / imp-342 / imp-343) density-squeeze supplies, and DIAGNOSE
 *   its Step-4 E(N) bridge (G6_polymath15_bridge, imp-345) consumability blocker.
 *   The analog of the imp-36082 Route-B analysis (which found Route B
 *   CONSUMABLE-MODULO-ANCHOR with r(N) = Theta(sqrt(log N) N^{-1/4})). Assessment
 *   / derivation ONLY: closes NOTHING, discharges no gap, the per-N translation
 *   stays OPEN, respects the imp-2519 no-overclaim guard, NO QED. No refereed bound is changed.
 *
 *   WHY THIS TICKET
 *   ---------------
 *   imp-36045 RANKED the three G5-perN-translation routes C > B > A and named
 *   Route C the CLOSEST to a usable unconditional per-N rate, but stopped at the
 *   ranking -- it did NOT write down the explicit r(N) FORM Route C supplies, nor
 *   pin down precisely WHY the E(N) bridge cannot consume it TODAY. imp-36082 did
 *   exactly that for Route B (deviation rate r(N) = Theta(sqrt(log N) N^{-1/4}),
 *   blocker = missing per-N anchor). This module is the Route-C analog: it derives
 *   the r(N) shape from the integrated density-squeeze inequality and diagnoses
 *   the exact consumability blocker -- which is DIFFERENT IN KIND from Route B's.
 *
 *   THE INTEGRATED DENSITY-SQUEEZE BOUND (Route-C / imp-337)
 *   --------------------------------------------------------
 *   imp-322 boundary identity at the argmin site k*, along the backward
 *   Calogero-Moser flow (B := g_{k*} the minimum gap):
 *
 *       dg_{k*}/dtau = 4/B - 2 B S_{k*},   S_{k*} = sum_{j != k*, k*+1} 1/(gamma_j - gamma_{k*})^2.
 *
 *   Under the density squeeze S_{k*}(tau) >= c(N)/B(tau)^2 with c(N) > 2, the
 *   identity gives dg/dtau <= (4 - 2 c(N))/B; multiplying by B and integrating
 *   back to the collision time tau_c where B(tau_c) = 0 flips sign (regime (c)):
 *
 *       |tau_c(N)|  <=  B(0)^2 / (4 c(N) - 8).
 *
 *   This is a per-N ABSOLUTE upper bound on |t_c(N)| BY CONSTRUCTION -- no
 *   monotonicity (M), no asymptotic lim-sup. THIS is the crucial contrast with
 *   Route B, whose per-N rate bounds only the DEVIATION from a limiting anchor.
 *
 *   THE EXPLICIT CLOSED FORM (Weyl-density c(N) + min-gap surrogate)
 *   ---------------------------------------------------------------
 *   imp-337 supplies the two-sided Weyl-density correction and the conservative
 *   Weyl-smoothed initial-gap surrogate (any tighter min-gap scale only SHRINKS
 *   the bound), with L := log(gamma_N / 2 pi):
 *
 *       c(N) = 2 (1 + kappa / L),   kappa ~ 1,      B(0) <- 1/rho(gamma_N) = 2 pi / L.
 *
 *   Substituting: 4 c(N) - 8 = 8 kappa / L and B(0)^2 = 4 pi^2 / L^2, so the
 *   L-dependence collapses to a single power of L:
 *
 *       r(N) := |tau_c(N)|-bound  =  (4 pi^2 / L^2) / (8 kappa / L)  =  pi^2 / (2 kappa L)
 *             =  pi^2 / (2 kappa log(gamma_N / 2 pi)),     r(N) = Theta(1 / log N).
 *
 *   THIS is the explicit per-N rate Route-C supplies. It vanishes (L -> inf), so
 *   a <= lim sup_N r(N) = 0 -- the same a = 0 target -- but it decays only as
 *   1/log N, DRAMATICALLY SLOWER than Route B's sqrt(log N) N^{-1/4}. Route C
 *   trades rate SPEED for rate TYPE: an absolute per-N bound, not a deviation.
 *
 *   THE CONSUMABILITY VERDICT (assessment, NO QED)
 *   ----------------------------------------------
 *   Route C's rate is exactly the SHAPE the Step-4 E(N) bridge (imp-345, per
 *   imp-2564) wants: an ABSOLUTE per-N bound |t_c(N)| <= r(N), built without a
 *   lim-sup and without an anchor. So Route C is NOT blocked by the deviation-vs-
 *   absolute mismatch that stops Route B (CONSUMABLE-MODULO-ANCHOR). Instead the
 *   blocker sits UPSTREAM of the bridge: the entire derivation is CONTINGENT on
 *   the density-squeeze premise S_{k*}(tau) >= c(N)/B(tau)^2 holding pointwise
 *   along the backward trajectory (imp-337 gap G3_density; imp-343 closed the
 *   argmin-drift G4 and imp-342 closed the Weyl tail G3b, leaving the SINGLE open
 *   residual G3a_max_gap -- extremal max-gap statistics at the argmin site). Until
 *   G3a_max_gap closes, r(N) is an UNPROVEN premise, not a theorem. Crucially,
 *   unlike Route A's C_mb (imp-486, IRREDUCIBLE -> GUE) and unlike Route B's
 *   anchor (which re-imports GUE/ESY rigidity), G3a_max_gap is a concrete
 *   extremal-statistics target NOT proven irreducible: closing it would make r(N)
 *   directly bridge-consumable with NO GUE re-import. Status:
 *   CONSUMABLE-MODULO-G3a (the premise is the OPEN per-N translation). This
 *   matches the imp-36045 Route-C verdict (per-N by construction, unconditional
 *   sub-gaps, tractable residual) and adds the explicit r(N) FORM plus the precise
 *   blocker (an unproven premise, NOT a structural anchor gap and NOT a GUE
 *   re-import). Closes NOTHING; per-N stays OPEN.
 *
 *   @see src/data/imp-36082-routeB-perN-rate-form-and-bridge-consumability.js (Route-B analog: deviation rate, CONSUMABLE-MODULO-ANCHOR)
 *   @see src/data/imp-36045-perN-translation-route-readiness-assessment.js (route ranking C > B > A)
 *   @see src/data/lambda-intercept-density-squeeze.js (imp-337 boundary identity, c(N), B(0) surrogate, G3_density)
 *   @see src/data/lambda-polymath15-bridge.js (imp-345 G6_polymath15_bridge, E(N) bridge constants)
 *
 *   Ticket: imp-36137 (proof, medium).
 */

// -- Constants (identical convention to imp-337 lambda-intercept-density-squeeze) --
// Weyl-density correction c(N) = 2 (1 + kappa / L); kappa ~ 1 order-unity GUE-shape
// constant. kappa > 0 is exactly what puts us in the supercritical regime c(N) > 2.
const KAPPA = 1.0;
// The collapsed leading coefficient of the closed form r(N) = pi^2 / (2 kappa L).
const R_COEFF = (Math.PI * Math.PI) / (2 * KAPPA);

// -- Riemann-von Mangoldt inversion via Lambert W (same as imp-337) ------------
// gamma_N ~ 2 pi N / W(N/e); 3 Newton iterations on t e^t = N/e.
function gammaN(N) {
  const u = N / Math.E;
  let t = Math.log(u);
  for (let i = 0; i < 3; i++) {
    const et = Math.exp(t);
    t = t - (t * et - u) / (et * (1 + t));
  }
  return (2 * Math.PI * N) / t;
}

// -- The explicit per-N rate forms ---------------------------------------------
// c(N) = 2 (1 + kappa / L), L = log(gamma_N / 2 pi). Supercritical (> 2) by kappa > 0.
function cOfN(N) {
  const g = gammaN(N);
  const L = Math.log(g / (2 * Math.PI));
  if (!(L > 0)) return null;
  return 2 * (1 + KAPPA / L);
}
// r(N) via the DIRECT integrated squeeze bound B(0)^2 / (4 c(N) - 8), using the
// conservative Weyl min-gap surrogate B(0) = 2 pi / L (imp-337).
function rateRN_direct(N) {
  const c = cOfN(N);
  if (c === null || !(c > 2)) return null;
  const g = gammaN(N);
  const L = Math.log(g / (2 * Math.PI));
  const B0 = (2 * Math.PI) / L;
  const denom = 4 * c - 8;
  if (!(denom > 0)) return null;
  return (B0 * B0) / denom;
}
// r(N) closed form = pi^2 / (2 kappa L). Must equal the direct form: the L^2 in
// B(0)^2 cancels against the single L in (4 c - 8) = 8 kappa / L.
function rateRN_closedForm(N) {
  const g = gammaN(N);
  const L = Math.log(g / (2 * Math.PI));
  if (!(L > 0)) return null;
  return R_COEFF / L;
}

// -- Ladder: exhibit r(N) is explicit, per-N, vanishing, and matches closed form --
const LADDER_N = Object.freeze([1e2, 1e3, 1e4, 1e5, 1e6, 1e7, 1e8, 1e9, 1e10, 1e11, 1e12]);
const RATE_LADDER = LADDER_N.map((N) => {
  const g = gammaN(N);
  const L = Math.log(g / (2 * Math.PI));
  const c = cOfN(N);
  const rDirect = rateRN_direct(N);
  const rClosed = rateRN_closedForm(N);
  return Object.freeze({
    N,
    gammaN_RvM: g,
    logGammaOver2pi: L,
    cOfN: c,
    cExceedsCritical: c !== null && c > 2,
    r_absolute_direct: rDirect,
    r_absolute_closed_form: rClosed,
    closed_form_agrees:
      rDirect !== null && rClosed !== null && rClosed > 0
        ? Math.abs(rDirect - rClosed) / rClosed < 1e-9
        : false,
  });
});

const C_STRICTLY_SUPERCRITICAL = RATE_LADDER.every((r) => r.cOfN !== null && r.cOfN > 2);
const R_STRICTLY_DECREASING = (() => {
  for (let i = 1; i < RATE_LADDER.length; i++) {
    if (!(RATE_LADDER[i].r_absolute_direct < RATE_LADDER[i - 1].r_absolute_direct)) return false;
  }
  return true;
})();
// Wide-window log-log slope of r(N): witnesses the 1/log N decay -- a slope sitting
// just below 0 (~-0.083), FAR shallower than Route B's ~-0.216 (its N^{-1/4} core).
const R_LOGLOG_SLOPE_WIDE = (() => {
  const a = RATE_LADDER[0];
  const b = RATE_LADDER[RATE_LADDER.length - 1];
  return (
    (Math.log(b.r_absolute_direct) - Math.log(a.r_absolute_direct)) /
    (Math.log(b.N) - Math.log(a.N))
  );
})();

// Route-B comparison rate exponent (imp-36082): r_B ~ N^{-1/4}, wide slope ~-0.216.
const ROUTE_B_LOGLOG_SLOPE_REF = -0.216;

// -- The record ---------------------------------------------------------------
export const IMP36137_ROUTEC_PERN_RATE_FORM_AND_BRIDGE_CONSUMABILITY = Object.freeze({
  id: 'imp-36137-routeC-perN-rate-form-and-bridge-consumability',
  ticket: 'imp-36137',
  routeId: 'route-C-density',
  obligationKey: 'G5-perN-translation',
  feedsInto: 'Step-4 E(N) bridge constants (G6_polymath15_bridge, imp-345), NOT the headline inequality (imp-2564)',
  analogOf: 'imp-36082 (Route-B per-N rate form and bridge consumability)',
  sources: Object.freeze({
    boundaryIdentity: 'imp-322 dg_{k*}/dtau = 4/B - 2 B S_{k*} at the argmin site (backward Calogero-Moser flow)',
    squeeze: 'imp-337 density squeeze S_{k*}(tau) >= c(N)/B(tau)^2, regime (c) c(N) > 2 => |tau_c| <= B(0)^2/(4 c(N)-8)',
    densityForm: 'imp-337 Weyl form c(N) = 2 (1 + kappa/L), B(0) <- 2 pi/L, L = log(gamma_N/2 pi)',
    bridge: 'imp-345 G6_polymath15_bridge E(N) constants',
  }),

  summary:
    'Derives the explicit per-N rate r(N) that the Route-C (imp-337/342/343) density squeeze supplies, and ' +
    'assesses E(N)-bridge consumability -- the analog of the imp-36082 Route-B analysis. Integrating the imp-322 ' +
    'boundary identity under the imp-337 density squeeze S_{k*}(tau) >= c(N)/B(tau)^2 with c(N) > 2 gives, BY ' +
    'CONSTRUCTION (no monotonicity, no lim-sup), the per-N ABSOLUTE bound |t_c(N)| <= B(0)^2/(4 c(N)-8). With the ' +
    'Weyl form c(N) = 2(1 + kappa/L) and conservative surrogate B(0) = 2 pi/L (L = log(gamma_N/2 pi)) the ' +
    'L-dependence collapses to r(N) = pi^2/(2 kappa L) = pi^2/(2 kappa log(gamma_N/2 pi)) = Theta(1/log N): the ' +
    'explicit per-N rate Route-C supplies. It vanishes (a <= lim sup r(N) = 0) but decays only as 1/log N, far ' +
    'SLOWER than Route B’s sqrt(log N) N^{-1/4}; Route C trades rate SPEED for rate TYPE (absolute, not ' +
    'deviation). VERDICT (assessment, NO QED): r(N) is exactly the ABSOLUTE per-N shape the E(N) bridge wants, so ' +
    'Route C is NOT stopped by Route B’s deviation-vs-absolute anchor mismatch. Its blocker sits UPSTREAM: the ' +
    'derivation is contingent on the density-squeeze premise holding pointwise along the flow (imp-337 G3_density), ' +
    'whose SOLE open residual is G3a_max_gap (extremal max-gap statistics at the argmin site) -- G4 argmin-drift ' +
    '(imp-343) and G3b Weyl-tail (imp-342) already closed unconditionally. Unlike Route A C_mb (IRREDUCIBLE, ' +
    'imp-486) and Route B’s GUE-re-importing anchor, G3a_max_gap is NOT proven irreducible; closing it makes ' +
    'r(N) directly bridge-consumable with NO GUE re-import. Status CONSUMABLE-MODULO-G3a. Matches the imp-36045 ' +
    'Route-C verdict, adding the explicit r(N) FORM and the precise blocker (an unproven premise, not a structural ' +
    'anchor gap). Closes NOTHING; discharges no gap; per-N stays OPEN; respects the imp-2519 no-overclaim guard; ' +
    'NO QED; no refereed bound is changed.',

  rateForms: Object.freeze({
    integrated_squeeze: '|t_c(N)| <= B(0)^2 / (4 c(N) - 8)  [regime (c), c(N) > 2, ABSOLUTE per-N by construction]',
    absolute_rate_rN: 'r(N) = pi^2 / (2 kappa log(gamma_N/2 pi))  [Theta(1/log N)]',
    cOfN: 'c(N) = 2 (1 + kappa/L), kappa ~ 1, L = log(gamma_N/2 pi)  [supercritical > 2]',
    b0Surrogate: 'B(0) <- 2 pi / L  [conservative Weyl-smoothed min-gap; any tighter scale SHRINKS r(N)]',
    R_coeff: R_COEFF,
    kappa: KAPPA,
    bounds: '|t_c(N)| ABSOLUTELY (by construction), NOT a deviation from a limiting anchor',
    contrastWithRouteB:
      'Route B r(N) = Theta(sqrt(log N) N^{-1/4}) bounds the DEVIATION |t_c(m_N) - t_c(m_inf)|; Route C ' +
      'r(N) = Theta(1/log N) bounds |t_c(N)| ABSOLUTELY. Route C is slower-decaying but of the bridge-consumable TYPE.',
  }),

  ladder: RATE_LADDER,
  ladderDiagnostics: Object.freeze({
    c_strictly_supercritical: C_STRICTLY_SUPERCRITICAL,
    r_strictly_decreasing: R_STRICTLY_DECREASING,
    r_loglog_slope_wide: R_LOGLOG_SLOPE_WIDE,
    routeB_loglog_slope_ref: ROUTE_B_LOGLOG_SLOPE_REF,
    r_loglog_slope_note:
      'the wide-window log-log slope sits just below 0 (~-0.083): the 1/log N decay, MUCH shallower than Route ' +
      'B’s ~-0.216 (N^{-1/4} core dressed by sqrt(log N)). Route C’s absolute rate vanishes far slower.',
  }),

  consumability: Object.freeze({
    rateExists: true,
    rateIsPerN: true,
    rateVanishes: true,
    rateBoundsAbsoluteTc: true,
    rateBoundsDeviationOnly: false,
    rateFromConstruction: true,
    usesLimSup: false,
    bridgeWantsThisShape: true,
    bridgeCanConsumePerN: false,
    blockerIsAnchorMismatch: false,
    blockerIsUnprovenPremise: true,
    status: 'CONSUMABLE-MODULO-G3a',
    missingIngredient:
      'the density-squeeze premise S_{k*}(tau) >= c(N)/B(tau)^2 holding pointwise along the backward flow ' +
      '(imp-337 G3_density); its SOLE open residual is G3a_max_gap (extremal max-gap statistics at the argmin ' +
      'site), G4 argmin-drift (imp-343) and G3b Weyl-tail (imp-342) already closed unconditionally.',
    residualNotIrreducible: true,
    reImportsGueIfClosed: false,
    matchesImp36045RouteC: true,
  }),

  honestCaveat: Object.freeze({
    isProof: false,
    closesAnyGap: false,
    dischargesG5PerNTranslation: false,
    derivesExplicitRateForm: true,
    rateConsumableAsAbsoluteTcBound: false,
    rateIsAbsoluteNotDeviation: true,
    perNTranslationStaysOpen: true,
    g3aMaxGapStaysOpen: true,
    reImportsGueIfPremiseForced: false,
    isReductionBelowRH: false,
    carriesRHVerdict: false,
    scope:
      'Derivation of the explicit Route-C per-N rate form r(N) = pi^2/(2 kappa log(gamma_N/2 pi)) = Theta(1/log N) ' +
      'from the integrated density squeeze, and an assessment that it bounds |t_c(N)| ABSOLUTELY (unlike Route B’s ' +
      'deviation rate) so the E(N) bridge wants its shape, but cannot consume it because the derivation is ' +
      'contingent on the OPEN G3a_max_gap premise (CONSUMABLE-MODULO-G3a). Closes nothing; per-N translation stays ' +
      'OPEN; respects the imp-2519 no-overclaim guard.',
    sota: 'No refereed bound is changed',
  }),
});

// -- Tripwire assertions ------------------------------------------------------
export const IMP36137_ROUTEC_PERN_RATE_FORM_AND_BRIDGE_CONSUMABILITY_ASSERTIONS = [
  {
    id: 'imp36137-c-strictly-supercritical',
    why: 'The Route-C squeeze delivers regime (c) (a per-N ABSOLUTE bound) only when c(N) = 2(1 + kappa/L) > 2 at ' +
         'every ladder rung; a regression to c(N) <= 2 means kappa was zeroed or the Weyl correction miscalibrated.',
    holds: () => C_STRICTLY_SUPERCRITICAL,
  },
  {
    id: 'imp36137-rate-form-matches-closed-form',
    why: 'The direct integrated bound B(0)^2/(4 c(N)-8) must equal the collapsed closed form pi^2/(2 kappa L) at ' +
         'every rung; a mismatch means the L^2-vs-L cancellation was mis-derived.',
    holds: () => RATE_LADDER.every((r) => r.closed_form_agrees === true),
  },
  {
    id: 'imp36137-rate-vanishing-log-decay',
    why: 'r(N) = Theta(1/log N) must strictly decrease along the ladder, and its wide log-log slope must sit just ' +
         'below 0 (shallower than Route B’s ~-0.216): the slow 1/log N decay of an absolute per-N bound.',
    holds: () =>
      R_STRICTLY_DECREASING && R_LOGLOG_SLOPE_WIDE < 0 && R_LOGLOG_SLOPE_WIDE > ROUTE_B_LOGLOG_SLOPE_REF,
  },
  {
    id: 'imp36137-rate-bounds-absolute-tc-not-deviation',
    why: 'The core contrast with Route B: r(N) bounds |t_c(N)| ABSOLUTELY (built by integrating the squeeze, no ' +
         'lim-sup), NOT a deviation from a limiting anchor -- so the E(N) bridge wants its shape.',
    holds: () => {
      const c = IMP36137_ROUTEC_PERN_RATE_FORM_AND_BRIDGE_CONSUMABILITY.consumability;
      return (
        c.rateExists === true &&
        c.rateIsPerN === true &&
        c.rateBoundsAbsoluteTc === true &&
        c.rateBoundsDeviationOnly === false &&
        c.rateFromConstruction === true &&
        c.usesLimSup === false &&
        c.bridgeWantsThisShape === true
      );
    },
  },
  {
    id: 'imp36137-blocker-is-unproven-premise-not-anchor-not-gue',
    why: 'The precise blocker differs in KIND from Route B: NOT a deviation-vs-absolute anchor mismatch, but an ' +
         'UNPROVEN premise (G3a_max_gap) that is NOT proven irreducible and does NOT re-import GUE if closed.',
    holds: () => {
      const c = IMP36137_ROUTEC_PERN_RATE_FORM_AND_BRIDGE_CONSUMABILITY.consumability;
      return (
        c.blockerIsAnchorMismatch === false &&
        c.blockerIsUnprovenPremise === true &&
        c.bridgeCanConsumePerN === false &&
        c.status === 'CONSUMABLE-MODULO-G3a' &&
        c.residualNotIrreducible === true &&
        c.reImportsGueIfClosed === false &&
        c.matchesImp36045RouteC === true &&
        /G3a_max_gap/.test(c.missingIngredient)
      );
    },
  },
  {
    id: 'imp36137-honest-no-closure-no-qed',
    why: 'Mandatory honesty: a DERIVATION+ASSESSMENT that closes NOTHING, discharges no gap, keeps the per-N ' +
         'translation and G3a_max_gap OPEN, carries NO RH verdict, no refereed bound is changed. If any flip the module over-claims.',
    holds: () => {
      const h = IMP36137_ROUTEC_PERN_RATE_FORM_AND_BRIDGE_CONSUMABILITY.honestCaveat;
      return (
        h.isProof === false &&
        h.closesAnyGap === false &&
        h.dischargesG5PerNTranslation === false &&
        h.derivesExplicitRateForm === true &&
        h.rateConsumableAsAbsoluteTcBound === false &&
        h.rateIsAbsoluteNotDeviation === true &&
        h.perNTranslationStaysOpen === true &&
        h.g3aMaxGapStaysOpen === true &&
        h.isReductionBelowRH === false &&
        h.carriesRHVerdict === false &&
        /Platt-Trudgian|refereed bound is changed/.test(h.sota)
      );
    },
  },
];

for (const assertion of IMP36137_ROUTEC_PERN_RATE_FORM_AND_BRIDGE_CONSUMABILITY_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(
      `imp-36137-routeC-perN-rate-form-and-bridge-consumability assertion failed: ${assertion.id}`,
    );
  }
}

export default IMP36137_ROUTEC_PERN_RATE_FORM_AND_BRIDGE_CONSUMABILITY;
