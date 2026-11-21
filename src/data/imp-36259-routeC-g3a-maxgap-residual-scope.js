/**
 * @module imp-36259-routeC-g3a-maxgap-residual-scope
 * @fileoverview imp-36259 -- Scope the Route-C G3a_max_gap residual as an EXPLICIT
 *   gap object. Enumerate exactly what extremal max-gap statistic (the argmin-site
 *   max nearest-neighbour gap and its N-scaling) must be supplied for the
 *   imp-337 / imp-342 / imp-343 density-squeeze integrated bound to acquire a PINNED
 *   per-N exponent r_C(N), and record the CONDITIONAL r_C(N) form that a GUE-type
 *   sqrt(log N) max-gap scale would imply. ILLUSTRATION ONLY: closes NOTHING,
 *   discharges no gap, the per-N translation and G3a_max_gap stay OPEN, respects the
 *   imp-2519 no-overclaim guard, NO QED. No refereed bound is changed.
 *
 *   WHY THIS TICKET
 *   ---------------
 *   imp-36151 resolved that the imp-36045 Route-C > Route-B ranking reflects
 *   unconditional-consumability READINESS, not a faster N-exponent, because Route-C
 *   has NO pinned per-N exponent -- it is gated on the OPEN sub-gap G3a_max_gap.
 *   imp-36151 offered a one-line CONDITIONAL illustration ("IF G3a_max_gap were
 *   discharged with a GUE-type sqrt(log N) max-gap scale, Route-C would acquire a
 *   per-N form") but did NOT pin down (a) what the gap object concretely IS, nor
 *   (b) what that GUE scale actually IMPLIES. This module supplies both -- and finds
 *   the imp-36151 one-liner is, read literally, BACKWARDS: a GROWING max-gap scale
 *   does not hand Route-C a per-N form, it ELIMINATES the density squeeze (matching the
 *   imp-451 diagnostic obstruction).
 *
 *   THE GAP OBJECT G3a_max_gap, ENUMERATED
 *   --------------------------------------
 *   Route-C (imp-337) needs, at the backward-flow argmin site k*(t):
 *       S_{k*}(t) >= c(N) / B(t)^2      with c(N) > 2,
 *   derived from the Weyl density. imp-355 splits the two-site "near" part with the
 *   normalised argmin max nearest-neighbour gap
 *       R_N := Delta_max(k*) * rho_infty(gamma_{k*})     (dimensionless),
 *   giving c_near(R) = 2 / (R*(R+1)) and, with the rigorous Weyl tail from imp-342,
 *       c_total(R) = c_near(R) + c_tail,   c_tail = 2*(pi^2/6 - 1) ~ 1.2899.
 *   The squeeze c_total > 2 holds IFF R_N < R_critical, the root of
 *       2/(R*(R+1)) + c_tail = 2   ==>   R_critical ~ 1.2512.
 *
 *   So the gap object is exactly: a bound on R_N (the normalised argmin-site MAX
 *   nearest-neighbour gap) with (i) a PINNED N-scaling and (ii) the guarantee
 *   R_N <= R_critical - epsilon uniformly in N. Item (i) alone pins the SHAPE of any
 *   candidate r_C(N); item (ii) is what makes the drift dg_{k*}/dt < 0 STRICT so that
 *   there is a positive drift to integrate at all. Without (ii) there is no r_C(N) to
 *   speak of -- not a slower one, but NONE.
 *
 *   THE CONDITIONAL r_C(N) FORM UNDER A GUE sqrt(log N) MAX-GAP SCALE (ILLUSTRATION)
 *   ------------------------------------------------------------------------------
 *   The GUE bulk maximal nearest-neighbour gap over N eigenvalues scales (schematic,
 *   normalised) as R_N ~ sqrt(log N) -> infinity. Feed that into the gap object:
 *       c_near(R_N) = 2/(R_N*(R_N+1)) ~ 2/log N -> 0,
 *       c_total(N)  = c_near(R_N) + c_tail -> c_tail ~ 1.2899 < 2.
 *   R_N = sqrt(log N) already EXCEEDS R_critical ~ 1.2512 once log N > 1.565, i.e. for
 *   every N >= 5. Hence under this scale the squeeze c(N) > 2 FAILS for all N of
 *   interest, the strict drift is NOT established, and the CONDITIONAL r_C(N) is
 *   VACUOUS -- there is no per-N rate to write down. This is the SAME structural
 *   obstruction imp-451 (g3a-extremal-closure) diagnosed for the min-gap reading
 *   (c_total -> 0), now stated on the max-gap axis the ticket names.
 *
 *   CONSEQUENCE (illustration, NOT a claim): the imp-36151 conditional, read as
 *   "GUE sqrt(log N) => Route-C acquires a per-N form", is the wrong sign. A per-N
 *   form would instead require a max-gap statistic that stays BOUNDED below
 *   R_critical uniformly in N -- which NO known extremal input supplies (Soundararajan-
 *   Bui gives C_SB ~ 2.51 under RH, ~4.0 unconditionally; GUE grows). So G3a_max_gap
 *   is not merely "unquantified": within the near+tail framework it is OBSTRUCTED, and
 *   its residual research content lives at the successor sub-gap
 *   G3a_sub_fullsum_dynamical (a Dyson-ODE argument, imp-507), not at any static
 *   max-gap bound. Closes NOTHING; per-N translation and G3a_max_gap stay OPEN.
 *
 *   @see src/data/imp-36151-routeC-vs-routeB-perN-exponent-comparison.js (the one-line conditional this scopes)
 *   @see src/data/g3a-extremal-closure.js (imp-451 diagnostic: near+tail c_total -> 0 under GUE)
 *   @see src/data/lambda-roadmap.js (Route-C route object; G3a_max_gap OPEN; closesIf)
 *
 *   Ticket: imp-36259 (proof, medium).
 */

// -- Gap-object constants (self-contained; identical convention to imp-451) -----
const C_TAIL = 2 * ((Math.PI * Math.PI) / 6 - 1); // Weyl tail, imp-342 ~ 1.2899
// R_critical solves 2/(R*(R+1)) + C_TAIL = 2  ==>  R*(R+1) = 2/(2 - C_TAIL).
const C_THRESH_RHS = 2 / (2 - C_TAIL);
const R_CRITICAL = (-1 + Math.sqrt(1 + 4 * C_THRESH_RHS)) / 2; // ~1.2512

const cNear = (R) => 2 / (R * (R + 1));
const cTotal = (R) => cNear(R) + C_TAIL;

// -- GUE sqrt(log N) max-gap illustration ---------------------------------------
// R_N ~ sqrt(log N) (schematic normalised GUE bulk maximal gap). At each landmark N,
// record R_N, c_near, c_total and whether the squeeze c_total > 2 survives.
const GUE_MAXGAP_R = (N) => Math.sqrt(Math.log(N));
const ILLUSTRATION_LADDER = Object.freeze(
  [1e3, 1e6, 1e13, 1e21, 1e60].map((N) => {
    const R = GUE_MAXGAP_R(N);
    const ct = cTotal(R);
    return Object.freeze({
      N,
      R_N: R,
      cNear: cNear(R),
      cTotal: ct,
      squeezeHolds: ct > 2,
    });
  }),
);
// Threshold N below which R_N < R_critical (squeeze could survive). R = sqrt(log N)
// crosses R_critical at N = exp(R_critical^2) ~ 4.78 -- i.e. no N >= 5 survives.
const N_SQUEEZE_FAILS_ABOVE = Math.exp(R_CRITICAL * R_CRITICAL);

// -- Scope record ---------------------------------------------------------------
export const IMP36259_ROUTEC_G3A_MAXGAP_RESIDUAL_SCOPE = Object.freeze({
  id: 'imp-36259-routeC-g3a-maxgap-residual-scope',
  ticket: 'imp-36259',
  obligationKey: 'G5-perN-translation',
  subGap: 'G3a_max_gap',
  feedsInto: 'Step-4 E(N) bridge constants (NOT the headline inequality) per imp-2564',

  summary:
    'Scopes the Route-C G3a_max_gap residual as an explicit gap object: a bound on the normalised argmin-site ' +
    'MAX nearest-neighbour gap R_N = Delta_max(k*)*rho_infty with (i) a pinned N-scaling and (ii) R_N <= ' +
    'R_critical - epsilon uniformly, where R_critical ~ 1.2512 is the root of 2/(R*(R+1)) + c_tail = 2 and ' +
    'c_tail = 2*(pi^2/6 - 1) ~ 1.2899 (imp-342). Item (i) pins the SHAPE of any r_C(N); item (ii) is what makes ' +
    'dg_{k*}/dt < 0 STRICT so a drift exists to integrate. CONDITIONAL ILLUSTRATION under a GUE-type ' +
    'sqrt(log N) max-gap scale: R_N ~ sqrt(log N) -> infinity EXCEEDS R_critical for every N >= 5, so ' +
    'c_total -> c_tail ~ 1.29 < 2, the squeeze FAILS, and the conditional r_C(N) is VACUOUS (no per-N rate ' +
    'exists). This CORRECTS the imp-36151 one-liner ("GUE sqrt(log N) => Route-C acquires a per-N form"), which ' +
    'is the wrong sign: a GROWING max-gap eliminates the squeeze (matching the imp-451 c_total -> 0 diagnostic). A ' +
    'per-N form would need a max-gap BOUNDED below R_critical uniformly, which no known extremal input supplies ' +
    '(S-B ~ 2.51 under RH, GUE grows). ILLUSTRATION ONLY; closes NOTHING; discharges no gap; per-N translation ' +
    'and G3a_max_gap stay OPEN; respects the imp-2519 no-overclaim guard; NO QED; no refereed bound is changed' +
    '.',

  gapObject: Object.freeze({
    name: 'G3a_max_gap',
    quantity: 'R_N = Delta_max(k*) * rho_infty(gamma_{k*})  -- normalised argmin-site MAX nearest-neighbour gap',
    whatMustBeSupplied:
      'a bound on R_N with (i) a PINNED N-scaling (fixes the shape of any r_C(N)) AND (ii) R_N <= R_critical - ' +
      'epsilon uniformly in N (makes dg_{k*}/dt < 0 strict so a drift exists to integrate)',
    squeezeRequirement: 'S_{k*}(t) >= c(N)/B(t)^2 with c(N) > 2 (imp-337), from the Weyl density',
    cNearFormula: 'c_near(R) = 2/(R*(R+1))   (two-site near part, imp-355)',
    cTail: C_TAIL,
    cTailSource: 'imp-342 Weyl tail c_tail = 2*(pi^2/6 - 1)',
    cTotalFormula: 'c_total(R) = 2/(R*(R+1)) + c_tail',
    rCritical: R_CRITICAL,
    rCriticalCondition: 'c_total(R_critical) = 2  ==>  squeeze c_total > 2 holds IFF R_N < R_critical',
    beyondPureWeyl: true,
    beyondPureWeylNote:
      'R_N is an EXTREMAL (max-gap) statistic at a density-0 argmin site; the Weyl law fixes only the mean ' +
      'density, so pinning R_N imports extremal input beyond pure Weyl (roadmap Route-C progress note)',
  }),

  pinningCondition: Object.freeze({
    r_C_exists_iff:
      'the supplied max-gap bound keeps R_N <= R_critical - epsilon uniformly in N; otherwise c(N) <= 2, the ' +
      'strict drift dg_{k*}/dt < 0 is NOT established, and there is NO r_C(N) (not a slower one -- none)',
    r_C_shape_pinned_by: 'the N-scaling of R_N (and hence of the surplus c(N) - 2 that drives the integrated drift)',
    twoRequirementsAreSeparate: true,
    note:
      'Requirement (i) [pinned scaling] and (ii) [uniform sub-critical bound] are INDEPENDENT: a pinned scaling ' +
      'that is not sub-critical pins no rate because the mechanism does not fire.',
  }),

  conditionalGueIllustration: Object.freeze({
    isClaim: false,
    scale: 'R_N ~ sqrt(log N)  (schematic normalised GUE bulk MAXIMAL nearest-neighbour gap)',
    ladder: ILLUSTRATION_LADDER,
    squeezeSurvivesAnywhere: ILLUSTRATION_LADDER.some((r) => r.squeezeHolds),
    nSqueezeFailsAbove: N_SQUEEZE_FAILS_ABOVE, // ~4.78: R_N crosses R_critical here
    impliedRateForm: null, // VACUOUS: squeeze fails, no drift, no r_C(N)
    verdict:
      'Under R_N ~ sqrt(log N) the squeeze c(N) > 2 FAILS for every N >= 5 (R_N > R_critical ~ 1.2512), so the ' +
      'CONDITIONAL r_C(N) is VACUOUS -- no per-N rate exists. Same structural obstruction as the imp-451 ' +
      'min-gap diagnostic (c_total -> 0), now on the max-gap axis.',
    correctsImp36151:
      'The imp-36151 one-liner "GUE sqrt(log N) => Route-C acquires a per-N form" is, read literally, the WRONG ' +
      'SIGN: a growing max-gap scale eliminates the squeeze rather than pinning a rate. A per-N form would require a ' +
      'max-gap BOUNDED below R_critical uniformly, which no known extremal input (S-B ~ 2.51 under RH, GUE grows) ' +
      'supplies.',
  }),

  honestCaveat: Object.freeze({
    isProof: false,
    closesAnyGap: false,
    dischargesG3aMaxGap: false,
    pinsRouteCExponent: false,
    isScopingOnly: true,
    conditionalIllustrationIsAClaim: false,
    g3aMaxGapStaysOpen: true,
    perNTranslationStaysOpen: true,
    isReductionBelowRH: false,
    carriesRHVerdict: false,
    residualLivesAt: 'G3a_sub_fullsum_dynamical (Dyson-ODE, imp-507) -- NOT any static max-gap bound',
    scope:
      'Enumerates the G3a_max_gap gap object (normalised argmin max-gap R_N, R_critical ~ 1.2512, the two ' +
      'requirements to pin r_C(N)) and records the CONDITIONAL, VACUOUS r_C(N) a GUE sqrt(log N) max-gap scale ' +
      'implies. Closes nothing; discharges no gap; G3a_max_gap and the per-N translation stay OPEN; respects the ' +
      'imp-2519 no-overclaim guard.',
    sota: 'No refereed bound is changed',
  }),
});

// -- Tripwire assertions --------------------------------------------------------
export const IMP36259_ROUTEC_G3A_MAXGAP_RESIDUAL_SCOPE_ASSERTIONS = [
  {
    id: 'imp36259-r-critical-matches-imp451',
    why: 'R_critical is the root of 2/(R*(R+1)) + c_tail = 2 with c_tail = 2*(pi^2/6 - 1); it must land at the ' +
         'imp-451 value ~1.2512 and satisfy its defining equation to machine precision.',
    holds: () =>
      R_CRITICAL > 1.24 && R_CRITICAL < 1.26 &&
      Math.abs(cTotal(R_CRITICAL) - 2) < 1e-12,
  },
  {
    id: 'imp36259-gap-object-two-requirements',
    why: 'The gap object must name BOTH requirements: a pinned N-scaling (shape) AND a uniform sub-critical ' +
         'bound R_N <= R_critical - epsilon (strict drift). Either alone does not pin r_C(N).',
    holds: () => {
      const g = IMP36259_ROUTEC_G3A_MAXGAP_RESIDUAL_SCOPE.gapObject;
      const p = IMP36259_ROUTEC_G3A_MAXGAP_RESIDUAL_SCOPE.pinningCondition;
      return (
        /PINNED N-scaling/.test(g.whatMustBeSupplied) &&
        /uniformly in N/.test(g.whatMustBeSupplied) &&
        p.twoRequirementsAreSeparate === true &&
        Math.abs(g.rCritical - R_CRITICAL) < 1e-12
      );
    },
  },
  {
    id: 'imp36259-gue-scale-vacuous-not-a-rate',
    why: 'CORE ILLUSTRATION: under R_N ~ sqrt(log N) the squeeze FAILS at every ladder rung (R_N > R_critical), ' +
         'so the conditional r_C(N) is VACUOUS (impliedRateForm === null), matching the imp-451 obstruction.',
    holds: () => {
      const c = IMP36259_ROUTEC_G3A_MAXGAP_RESIDUAL_SCOPE.conditionalGueIllustration;
      return (
        c.isClaim === false &&
        c.impliedRateForm === null &&
        c.squeezeSurvivesAnywhere === false &&
        ILLUSTRATION_LADDER.every((r) => r.cTotal < 2 && !r.squeezeHolds && r.R_N > R_CRITICAL) &&
        c.nSqueezeFailsAbove > 4 && c.nSqueezeFailsAbove < 6
      );
    },
  },
  {
    id: 'imp36259-corrects-imp36151-sign',
    why: 'The scoping must record that the imp-36151 conditional is the WRONG SIGN (a growing max-gap eliminates the ' +
         'squeeze) and that a per-N form needs a max-gap BOUNDED below R_critical, which no extremal input gives.',
    holds: () => {
      const c = IMP36259_ROUTEC_G3A_MAXGAP_RESIDUAL_SCOPE.conditionalGueIllustration;
      return (
        /WRONG\s+SIGN/.test(c.correctsImp36151) &&
        /BOUNDED below R_critical/.test(c.correctsImp36151) &&
        /no known extremal input/.test(c.correctsImp36151)
      );
    },
  },
  {
    id: 'imp36259-honest-no-closure-no-qed',
    why: 'Mandatory honesty: a SCOPING that closes NOTHING, discharges no gap, does not pin the Route-C ' +
         'exponent, keeps G3a_max_gap and the per-N translation OPEN, carries NO RH verdict, no refereed bound is changed.',
    holds: () => {
      const h = IMP36259_ROUTEC_G3A_MAXGAP_RESIDUAL_SCOPE.honestCaveat;
      return (
        h.isProof === false &&
        h.closesAnyGap === false &&
        h.dischargesG3aMaxGap === false &&
        h.pinsRouteCExponent === false &&
        h.isScopingOnly === true &&
        h.g3aMaxGapStaysOpen === true &&
        h.perNTranslationStaysOpen === true &&
        h.isReductionBelowRH === false &&
        h.carriesRHVerdict === false &&
        /Platt-Trudgian|refereed bound is changed/.test(h.sota)
      );
    },
  },
];

for (const assertion of IMP36259_ROUTEC_G3A_MAXGAP_RESIDUAL_SCOPE_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(
      `imp-36259-routeC-g3a-maxgap-residual-scope assertion failed: ${assertion.id}`,
    );
  }
}

export default IMP36259_ROUTEC_G3A_MAXGAP_RESIDUAL_SCOPE;
