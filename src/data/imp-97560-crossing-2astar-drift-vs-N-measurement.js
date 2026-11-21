/**
 * @module imp-97560-crossing-2astar-drift-vs-N-measurement
 * @fileoverview imp-97560 -- MEASURE how the soft lambda_min(T_a[sigma_2]) zero-crossing 2a*
 *   (reported ~1.1316 at the committed N in imp-97537) drifts relative to the binding half-width
 *   2a = ln 3 = 1.098612 as the Galerkin dimension N grows.
 *
 *   BACKGROUND. imp-97537 records that the true (finite-N Galerkin) lambda_min(T_a[sigma_2]),
 *   sigma_2 = (t^2+1/4)^2 w_1, stays positive through 2a = ln 3 and crosses zero only at 2a* ~ 1.1316,
 *   a margin of only ~0.033 above ln 3. Those lambda_min values are Rayleigh-Ritz UPPER bounds,
 *   monotone-DECREASING in N (imp-96769/97183). A monotone-decreasing upper bound can only push the
 *   zero-crossing 2a*(N) DOWNWARD (toward smaller 2a) as N grows; the question this leaf measures is
 *   whether that erosion leaves the ~0.033 margin to ln 3 intact or drives 2a*(N) down onto ln 3
 *   (which would threaten soft positivity at the binding half-width).
 *
 *   METHOD (tmp/imp-97560-crossing-drift.py, reusing the imp-97183 extended-precision builder).
 *   Pole-free basis phi_n = (a^2 - x^2)^M P_n(x/a), M = 3; A = P_a M_{sigma_2} P_a, B = exact Gram;
 *   lambda_min = smallest generalized eigenvalue of the pencil (A, B). For each 2a on a grid
 *   [1.080 .. 1.150] bracketing the crossing, (A, B) is built once at N_max = 52 and SLICED (nested
 *   basis) for the ladder N in {20, 28, 36, 44, 52}. For each N the sign change of lambda_min(2a) is
 *   linearly interpolated to read off 2a*(N). dps = 40, T = 200, panel = 1, gl = 24, nq = 4800.
 *
 *   MEASUREMENT (the crossing ladder, 2a*(N) and the margin 2a*(N) - ln 3):
 *       N = 20 : 2a* = 1.13052   margin = +0.03191
 *       N = 28 : 2a* = 1.12543   margin = +0.02682   (d = -0.00509)
 *       N = 36 : 2a* = 1.12025   margin = +0.02164   (d = -0.00518)
 *       N = 44 : 2a* = 1.11046   margin = +0.01184   (d = -0.00980)
 *       N = 52 : 2a* = 1.10033   margin = +0.00172   (d = -0.01013)
 *   The N = 20 crossing 1.1305 reproduces the imp-97537 reading 2a* ~ 1.1316 (its committed N is in the
 *   low-20s). The margin to ln 3 ERODES monotonically, +0.032 -> +0.0017, and the per-rung drift does
 *   not shrink (it steps -0.005, -0.005, -0.010, -0.010): at the finite N reachable here the crossing
 *   has essentially reached ln 3 by N ~ 52.
 *
 *   COUNTERPOINT (lambda_min AT the binding 2a = ln 3, interpolated across the same N):
 *       N = 20 : +0.6048   N = 28 : +0.5464   N = 36 : +0.5035   N = 44 : +0.4784   N = 52 : +0.4671
 *   AT ln 3 itself the floor stays strictly POSITIVE and its descent DECELERATES (decrements 0.058,
 *   0.043, 0.025, 0.011), consistent with a positive N -> infinity limit ~ 0.45. So the binding
 *   half-width retains a positive, decelerating soft floor even while the crossing margin ABOVE it
 *   collapses. The two readings are reconcilable: just above ln 3 a p = 2 resonance eigenvalue dives
 *   near-vertically (lambda_min plunges from ~ +0.47 to < -6 across a single 0.005 step in 2a), and the
 *   left edge of that near-vertical wall creeps toward ln 3 as N grows -- WITHOUT the floor at ln 3
 *   itself turning negative.
 *
 *   HONEST SUB-GAP (imp-97560-crossing-asymptote). Because the resonance plunge is near-vertical, the
 *   interpolated 2a*(N) is grid-resolution-limited (it pins to the left edge of the plunge interval),
 *   so its extrapolation is ambiguous: the finite-N crossing ladder alone cannot decide whether
 *   2a*(infinity) asymptotes STRICTLY ABOVE ln 3 (soft positivity at ln 3 survives with room) or lands
 *   ON ln 3 (soft positivity at ln 3 marginal). What is robust from this measurement: (i) margin(2a* -
 *   ln 3) is monotone-eroding in N; (ii) lambda_min AT ln 3 decelerates to an apparently positive limit
 *   ~ 0.45. Deciding the asymptote needs either the exact p = 2 resonance-eigenvalue asymptotics in N or
 *   a CERTIFIED (not Rayleigh) lower bound -- neither is attempted here.
 *
 *   Measurement only. Rayleigh floors are UPPER bounds; no operator positivity theorem; no coercivity
 *   constant; no bound moves; interval-rigorous certificate reach stays 2a <= 0.96; no refereed bound is changed
 *   ; RH open; NO QED.
 *
 * @see imp-97537-confined-well-vs-projected-positivity-assessment.js (crossingTwoAStar 1.1316, margin ~0.033)
 * @see rh-route-i-toeplitz-krein-certificate-2026-09-24.js (sigma_2, lambdaMinSigma2 table)
 * @see imp-97183-csharp-extprec-ladder.py (extended-precision Galerkin builder reused here)
 *
 * Ticket: imp-97560 (numerical, opus-4-8, api-pool). Crossing drift measured; monotone erosion of the
 * ln 3 margin quantified; floor AT ln 3 decelerates to a positive limit; asymptote of 2a* is the named
 * open sub-gap; no bound moves; reach stays 2a <= 0.96; no refereed bound is changed; RH open; NO QED.
 */

export const IMP97560_LN3 = 1.0986122886681098;
export const IMP97560_REACH_2A = 0.96; // unchanged by this measurement leaf

// crossing 2a*(N) (linear-interp zero of the finite-N Rayleigh lambda_min) and margin to ln 3
export const IMP97560_CROSSING_LADDER = Object.freeze([
  Object.freeze({ N: 20, crossingTwoAStar: 1.1305198545384791, marginToLn3: 0.03190756587036936 }),
  Object.freeze({ N: 28, crossingTwoAStar: 1.1254292736387974, marginToLn3: 0.02681698497068763 }),
  Object.freeze({ N: 36, crossingTwoAStar: 1.1202521434018000, marginToLn3: 0.02163985473369023 }),
  Object.freeze({ N: 44, crossingTwoAStar: 1.1104553101832868, marginToLn3: 0.01184302151517702 }),
  Object.freeze({ N: 52, crossingTwoAStar: 1.1003291180787553, marginToLn3: 0.00171682941064555 }),
]);

// lambda_min AT the binding 2a = ln 3 (interpolated between the 2a = 1.09 and 1.10 grid nodes), by N
export const IMP97560_LAMMIN_AT_LN3 = Object.freeze([
  Object.freeze({ N: 20, lamMin: 0.6047609979753901 }),
  Object.freeze({ N: 28, lamMin: 0.5463939000341533 }),
  Object.freeze({ N: 36, lamMin: 0.5035101787411127 }),
  Object.freeze({ N: 44, lamMin: 0.4784001385649999 }),
  Object.freeze({ N: 52, lamMin: 0.4670811566506421 }),
]);

export const IMP97560_MEASUREMENT = Object.freeze({
  ticket: 'imp-97560',
  question:
    'how does the soft lambda_min(T_a[sigma_2]) zero-crossing 2a* (~1.1316, imp-97537) drift relative ' +
    'to the binding 2a = ln 3 as the Galerkin dimension N grows?',
  method:
    'imp-97183 extended-precision builder (pole-free basis M=3, exact Gram); build (A,B) once per 2a on ' +
    'a [1.080,1.150] grid at N_max=52 and slice lambda_min for N in {20,28,36,44,52}; linearly ' +
    'interpolate the sign change of lambda_min(2a) to read 2a*(N). dps=40, T=200, panel=1, nq=4800.',
  // finding: the ln 3 margin erodes monotonically as N grows
  marginErodesWithN: true,
  marginN20: 0.03190756587036936,
  marginN52: 0.00171682941064555,
  crossingN20MatchesImp97537: true, // 1.1305 at N=20 reproduces imp-97537 crossingTwoAStar ~1.1316
  perRungDriftDoesNotShrink: true,  // steps -0.005,-0.005,-0.010,-0.010 (accelerating, not decelerating)
  // counterpoint: the floor AT ln 3 stays positive and its descent decelerates -> plausible positive limit
  lamMinAtLn3StaysPositive: true,
  lamMinAtLn3N52: 0.4670811566506421,
  lamMinAtLn3DescentDecelerates: true, // decrements 0.058,0.043,0.025,0.011
  lamMinAtLn3ApparentLimit: 0.45,      // heuristic, not a certified limit
  // mechanism: near-vertical p=2 resonance plunge whose left edge creeps toward ln 3 with N
  plungeIsNearVertical: true,          // lambda_min drops ~+0.47 -> < -6 across one 0.005 step in 2a
  // honest open sub-gap
  subGap: 'imp-97560-crossing-asymptote',
  subGapStatement:
    'the near-vertical resonance plunge makes the interpolated 2a*(N) grid-resolution-limited, so the ' +
    'finite-N crossing ladder cannot decide whether 2a*(infinity) asymptotes strictly above ln 3 ' +
    '(soft positivity at ln 3 survives) or lands on ln 3 (marginal); deciding it needs the exact p=2 ' +
    'resonance-eigenvalue asymptotics or a certified (non-Rayleigh) lower bound.',
  // guardrails
  rayleighUpperBoundsNotCertified: true,
  coercivityConstantClaimed: false,
  operatorPositivityProved: false,
  boundMoves: false,
  intervalRigorousReachUnchanged: 0.96,
  qed: false,
});
export default IMP97560_MEASUREMENT;

// -- self-executing assertions (imp-3715 convention): any failure throws at import --

const LN3 = IMP97560_LN3;

const IMP97560_ASSERTIONS = [
  {
    id: 'imp97560-crossing-margin-erodes-monotone',
    holds: () => {
      const L = IMP97560_CROSSING_LADDER;
      // N increases, crossing 2a*(N) and its margin to ln 3 both strictly decrease
      for (let i = 1; i < L.length; i++) {
        if (!(L[i].N > L[i - 1].N)) return false;
        if (!(L[i].crossingTwoAStar < L[i - 1].crossingTwoAStar)) return false;
        if (!(L[i].marginToLn3 < L[i - 1].marginToLn3)) return false;
      }
      // margin stays positive at every measured N (crossing never falls below ln 3 in-sample)
      const allAboveLn3 = L.every((r) => r.crossingTwoAStar > LN3 && r.marginToLn3 > 0);
      // and the crossing recomputes from the margin: 2a* = margin + ln 3
      const consistent = L.every((r) => Math.abs(r.crossingTwoAStar - (r.marginToLn3 + LN3)) < 1e-9);
      return allAboveLn3 && consistent && IMP97560_MEASUREMENT.marginErodesWithN === true;
    },
    why: 'the interp crossing 2a*(N) and its margin 2a*(N)-ln3 both decrease monotonically as N grows, from margin +0.032 (N=20) to +0.0017 (N=52), staying above ln 3 in-sample: the monotone-decreasing Rayleigh upper bound erodes the ln 3 margin.',
  },
  {
    id: 'imp97560-crossing-n20-matches-imp97537',
    holds: () => {
      // the N=20 crossing reproduces the imp-97537 reading 2a* ~ 1.1316 (committed N in the low 20s)
      const n20 = IMP97560_CROSSING_LADDER[0];
      return n20.N === 20 && Math.abs(n20.crossingTwoAStar - 1.1316) < 0.002 &&
        IMP97560_MEASUREMENT.crossingN20MatchesImp97537 === true;
    },
    why: 'the N=20 crossing 1.1305 reproduces the imp-97537 committed crossingTwoAStar ~1.1316 to within 0.002, anchoring this ladder to the prior reading.',
  },
  {
    id: 'imp97560-floor-at-ln3-positive-decelerating',
    holds: () => {
      const F = IMP97560_LAMMIN_AT_LN3;
      // AT ln 3 the floor is positive at every N and decreasing, but the decrements shrink (decelerate)
      let prevDrop = Infinity, ok = true;
      for (let i = 1; i < F.length; i++) {
        if (!(F[i].lamMin > 0)) ok = false;
        const drop = F[i - 1].lamMin - F[i].lamMin;
        if (!(drop > 0)) ok = false;      // strictly decreasing
        if (!(drop < prevDrop)) ok = false; // decelerating decrements
        prevDrop = drop;
      }
      return ok && F[0].lamMin > 0 &&
        IMP97560_MEASUREMENT.lamMinAtLn3StaysPositive === true &&
        IMP97560_MEASUREMENT.lamMinAtLn3DescentDecelerates === true;
    },
    why: 'lambda_min AT 2a=ln3 stays strictly positive (0.605 -> 0.467) across N with decelerating decrements (0.058,0.043,0.025,0.011), consistent with a positive N->infinity limit ~0.45: the binding half-width keeps a positive soft floor even as the crossing margin above it collapses.',
  },
  {
    id: 'imp97560-measurement-only-no-qed',
    holds: () =>
      IMP97560_MEASUREMENT.rayleighUpperBoundsNotCertified === true &&
      IMP97560_MEASUREMENT.coercivityConstantClaimed === false &&
      IMP97560_MEASUREMENT.operatorPositivityProved === false &&
      IMP97560_MEASUREMENT.boundMoves === false &&
      IMP97560_MEASUREMENT.intervalRigorousReachUnchanged === 0.96 &&
      IMP97560_REACH_2A === 0.96 &&
      typeof IMP97560_MEASUREMENT.subGap === 'string' &&
      IMP97560_MEASUREMENT.qed === false,
    why: 'measurement only from finite-N Rayleigh upper bounds: the ln 3 margin erodes (open asymptote sub-gap named) while the floor at ln 3 stays positive; no coercivity constant, no operator positivity, no bound moves; reach stays 2a <= 0.96; NO QED.',
  },
];

for (const t of IMP97560_ASSERTIONS) {
  if (!t.holds()) {
    throw new Error(`imp-97560-crossing-2astar-drift-vs-N-measurement assertion FAILED: ${t.id} -- ${t.why}`);
  }
}
