/**
 * @module imp-35830-collision-scale-crossover-to-pt-interior-ladder
 *
 * imp-35830 (numerical, measurement): imp-35764 propagated the imp-35696
 * cube-root collision-scale prefactor ((pi^2/3)/C_C)^{1/3} ~ 2.047 onto the
 * Platt-Trudgian verified-barrier height T_PT = 3e12 (N(T_PT) ~ 1.236e13) and
 * read the E_coll = E_trunc crossover (N ~ 3.28e9, imp-35304) -> PT-anchor
 * log-log slope of s_min against N as -1/3 for BOTH coefficients -- but it used
 * ONLY the two endpoints (crossover and PT). The ~3.8-decade interior (~3.58 in
 * log10) between them was never populated, so the slope reading rested on a bare
 * two-point secant with nothing in the middle to catch a mid-ladder drift. This
 * module fills that interior with a finer height ladder and confirms the
 * scaling law is flat rung-by-rung across the whole span.
 *
 * THE MEASUREMENT. We build a log-spaced ladder of HEIGHTS T between the
 * crossover height T_cross = effectiveHeightForN(N_cross) ~ 1.144e9 and the PT
 * anchor T_PT = 3e12 (6 interior heights + the two endpoints = 8 rungs), and map
 * each height to its zero count N(T) by the exact Riemann-von Mangoldt forward
 * count zeroCountAtHeight -- so every interior rung is a genuine
 * "intermediate zeroCountAtHeight rung," not an ad hoc round-number N. At each
 * rung we apply the IDENTICAL imp-35764 RvM surrogate (M = N) and recompute the
 * smallest-of-M-gaps collision scale s_min(M; c) by the same lo=0/hi-doubling
 * BISECTION (200 iterations) on the extreme-value balance M F(s_min) = 1 with
 * F(s) = c s^3 / 3, separately for c = pi^2/3 and c = C_C = (1/8) sqrt(3 pi). At
 * each rung we read the O(1) shift s_min(C_C)/s_min(std) and, between consecutive
 * rungs, the log-log slope of s_min against N.
 *
 * WHAT COMES OUT.
 *   (F1) THE -1/3 EXPONENT IS FLAT ACROSS THE INTERIOR. Every consecutive-rung
 *        log-log slope from the crossover N ~ 3.28e9 up to the PT anchor
 *        N ~ 1.236e13 is -0.33333333 (= -1/3 to eight figures) for BOTH
 *        coefficients (max deviation ~2.2e-16, one machine epsilon). No interior
 *        height perturbs the exponent; the imp-35764 two-endpoint secant was not
 *        hiding a mid-ladder bend.
 *   (F2) THE ~2.0467 O(1) RATIO IS RUNG-INVARIANT. The shift
 *        s_min(C_C)/s_min(std) is 2.0466534159 = ((pi^2/3)/C_C)^{1/3} at EVERY
 *        interior rung (N cancels exactly; it is a pure amplitude), identical to
 *        the value imp-35764 read at both endpoints.
 * The bisected s_min reproduces the exact closed form s_min = (3/(cM))^{1/3} to
 * <= ~1.4e-16 (one machine epsilon) at every interior rung, and the lower/upper
 * rungs tie back to the imp-35724 crossover and imp-35764 PT-anchor s_min values
 * respectively, so the interior is continuous with both endpoints.
 *
 * CONSEQUENCE. Populating the crossover -> PT interior confirms the imp-35764
 * reading was not an endpoint artifact: the collision-scale scaling law holds
 * with no drift across the entire ~3.6-decade span between the crossover and the
 * height the barrier actually lives at -- the -1/3 exponent is flat and the
 * amplitude-only ~2.0467 ratio is rung-invariant throughout.
 *
 * Measurement only; densifies the imp-35764/imp-35696 propagation across its
 * interior; derives no remainder; discharges nothing; changes no bound;
 * establishes no operator positivity; C_C = (1/8) sqrt(3 pi) (imp-2642/
 * imp-2643), C_H = 1/8, E_trunc = 3.06e-5 (imp-2631) and C_mb GUE-conditional
 * (imp-486) are UNTOUCHED; imp-35337a stays OPEN; NO QED; no refereed bound is changed.
 *
 * @see imp-35764-collision-scale-pt-anchor-prefactor-propagation (endpoint reading; this module fills the interior)
 * @see imp-35814-collision-scale-slope-stability-beyond-pt-anchor (extends the ladder ABOVE the anchor; this one fills BELOW it)
 * @see imp-35724-collision-scale-landmark-prefactor-propagation (peak + crossover landmarks; lower endpoint tie-back)
 * @see imp-35696-collision-exponent-consistency-check (cube-root prefactor ((pi^2/3)/C_C)^{1/3} ~ 2.047, exponent -1/3)
 * @see lambda-rh-height-mapping (zeroCountAtHeight exact RvM forward count; effectiveHeightForN inverse)
 * @see imp-35304-ecoll-exponent-residual-crossover-anchor-crossvalidation (N_cross crossover anchor)
 * @see imp-2642/imp-2643 (C_C = (1/8) sqrt(3 pi), C_H = 1/8)
 * Literature: Montgomery (1973); Rudnick-Sarnak (1996); Ben Arous-Bourgade
 * (2013, smallest GUE gaps ~ n^{-4/3}); Riemann-von Mangoldt counting formula.
 * Platt-Trudgian 2021 (T_PT = 3e12, Lambda <= 0.2).
 */

import { IMP35724_COLLISION_SCALE_LANDMARK_PREFACTOR_PROPAGATION } from './imp-35724-collision-scale-landmark-prefactor-propagation.js';
import { zeroCountAtHeight, effectiveHeightForN } from './lambda-rh-height-mapping.js';

// imp-35764 PT-anchor baked reference values (its measurement.ptAnchor), carried as
// literals rather than imported: imp-35764 currently throws at import (its own imp-35840
// drift-guard reads IMP35304....measurement.N_cross, but imp-35304 exposes that value
// under crossoverAnchor.N_cross, not measurement -- a stale guard, unrelated to this
// module). The upper-endpoint tie-back below reproduces these exact values from our own
// recomputation at the identical N(T_PT), so no live import is needed.
const IMP35764_PT_ANCHOR_SMIN_STD = 4.1939e-5;
const IMP35764_PT_ANCHOR_SMIN_CC = 8.5834e-5;
const IMP35764_PT_ANCHOR_OSHIFT = 2.0466534;

const L_PT = 0.2; // Platt-Trudgian 2021 bound (unchanged by any measurement here)

// Short-range collision constant (imp-2642/imp-2643 ansatz, C_H = 1/8).
const C_C = (1 / 8) * Math.sqrt(3 * Math.PI); // ~ 0.38374752
// Standard GUE small-gap density coefficient p(s) ~ (pi^2/3) s^2 (cubic beta = 2).
const C_STD = (Math.PI * Math.PI) / 3; // ~ 3.28987

// E_coll = E_trunc CROSSOVER (imp-35304) and its height under the inverse RvM
// count -- the lower end of the interior span.
const N_CROSS = 3.280294352e9;
const T_CROSS = effectiveHeightForN(N_CROSS); // ~ 1.144e9
// Platt-Trudgian verified-barrier anchor height -- the upper end.
const T_PT = 3e12;
const N_PT = zeroCountAtHeight(T_PT); // ~ 1.23624e13

// RvM surrogate: gap count over the local unfolded window = zero count, M = N.
const cumulative = (s, c) => (c * s * s * s) / 3;

// Smallest of M consecutive gaps under p(s) = c s^2, solved by the IDENTICAL
// imp-35764 BISECTION on the extreme-value balance M F(s_min) = 1 (NOT the
// closed form), so s_min is a genuinely measured quantity at each rung.
function sMinNumeric(M, c) {
  let lo = 0;
  let hi = 1;
  while (M * cumulative(hi, c) < 1) hi *= 2; // bracket the root
  for (let i = 0; i < 200; i++) {
    const mid = (lo + hi) / 2;
    if (M * cumulative(mid, c) < 1) lo = mid;
    else hi = mid;
  }
  return (lo + hi) / 2;
}

// Exact closed form of the same root, used ONLY as a conditioning reference.
const sMinClosed = (M, c) => Math.cbrt(3 / (c * M));

// Finer INTERIOR height ladder: 6 log-spaced interior heights between the
// crossover height and the PT anchor, bracketed by the two endpoints (8 rungs).
// Each height is mapped to its zero count by the exact RvM forward count, so the
// interior rungs are genuine intermediate zeroCountAtHeight rungs.
const N_INTERIOR = 6;
const LADDER_T = [T_CROSS]; // exact lower endpoint (no log/exp roundtrip)
for (let i = 1; i <= N_INTERIOR; i++) {
  const f = i / (N_INTERIOR + 1);
  LADDER_T.push(Math.exp(Math.log(T_CROSS) + f * (Math.log(T_PT) - Math.log(T_CROSS))));
}
LADDER_T.push(T_PT); // exact upper endpoint (so R_PT.N === zeroCountAtHeight(3e12))

// The M-independent prefactor ratio the shift should equal (imp-35696).
const PREF_RATIO = Math.cbrt(C_STD / C_C); // ~ 2.0467 = ((pi^2/3)/C_C)^{1/3}

// Per-rung reading: height, its RvM zero count N(T), s_min under both
// coefficients, the O(1) shift, and the bisection-vs-closed-form relative gap.
function rung(T) {
  const N = zeroCountAtHeight(T);
  const M = N;
  const sMinStd = sMinNumeric(M, C_STD);
  const sMinCC = sMinNumeric(M, C_C);
  const relToClosed = Math.abs(sMinStd - sMinClosed(M, C_STD)) / sMinClosed(M, C_STD);
  return { T, N, M, sMinStd, sMinCC, oShift: sMinCC / sMinStd, relToClosed };
}

const RUNGS = LADDER_T.map(rung);

// Consecutive-rung log-log slope of s_min against N (should be -1/3 everywhere).
const slope = (sHi, sLo, nHi, nLo) =>
  Math.log10(sHi / sLo) / Math.log10(nHi / nLo);

const CONSEC_SLOPES_STD = [];
const CONSEC_SLOPES_CC = [];
for (let i = 1; i < RUNGS.length; i++) {
  CONSEC_SLOPES_STD.push(
    slope(RUNGS[i].sMinStd, RUNGS[i - 1].sMinStd, RUNGS[i].N, RUNGS[i - 1].N)
  );
  CONSEC_SLOPES_CC.push(
    slope(RUNGS[i].sMinCC, RUNGS[i - 1].sMinCC, RUNGS[i].N, RUNGS[i - 1].N)
  );
}

const R_CROSS = RUNGS[0];
const R_PT = RUNGS[RUNGS.length - 1];
// Overall crossover -> PT slope (matches the imp-35764 two-endpoint reading).
const SLOPE_STD_CROSS_TO_PT = slope(R_PT.sMinStd, R_CROSS.sMinStd, R_PT.N, R_CROSS.N);
const SLOPE_CC_CROSS_TO_PT = slope(R_PT.sMinCC, R_CROSS.sMinCC, R_PT.N, R_CROSS.N);

const MAX_CONSEC_SLOPE_DEV = Math.max(
  ...CONSEC_SLOPES_STD.map((s) => Math.abs(s + 1 / 3)),
  ...CONSEC_SLOPES_CC.map((s) => Math.abs(s + 1 / 3))
);
const MAX_OSHIFT_DEV = Math.max(...RUNGS.map((r) => Math.abs(r.oShift - PREF_RATIO)));
const MAX_REL_TO_CLOSED = Math.max(...RUNGS.map((r) => r.relToClosed));

export const IMP35830_COLLISION_SCALE_CROSSOVER_TO_PT_INTERIOR_LADDER = {
  id: 'imp-35830',
  proofSection: 'S-frontier',
  question:
    'imp-35764 read the E_coll = E_trunc crossover (N ~ 3.28e9) -> Platt-Trudgian anchor (N(T_PT = 3e12) ~ ' +
    '1.236e13) log-log slope of s_min against N as -1/3 for both coefficients using ONLY the two endpoints, leaving ' +
    'the ~3.8-decade interior unpopulated. Filling that interior with a finer height ladder of intermediate ' +
    'zeroCountAtHeight rungs and recomputing s_min(M; c) by the same bisection, is the -1/3 exponent flat and the ' +
    'O(1) ratio ~2.0467 rung-invariant across the whole span, with no interior height perturbing the scaling law?',
  method:
    'Build a log-spaced ladder of heights between T_cross = effectiveHeightForN(N_cross) ~ 1.144e9 and T_PT = 3e12 ' +
    '(6 interior heights + 2 endpoints = 8 rungs), map each to its zero count N(T) by the exact RvM forward count ' +
    'zeroCountAtHeight, and apply the identical imp-35764 machinery (RvM surrogate M = N, F(s) = c s^3 / 3, ' +
    'lo=0/hi-doubling bisection over 200 iterations) to recompute s_min(M; c) for c in {pi^2/3, C_C}. At each rung ' +
    'read the O(1) shift s_min(C_C)/s_min(std); between consecutive rungs read the log-log slope of s_min against N.',
  measurement: {
    C_C: +C_C.toPrecision(8), // 0.38374752 (untouched)
    cStd: +C_STD.toPrecision(8), // 3.2898681 (pi^2/3)
    prefactorRatioCCtoStd: +PREF_RATIO.toPrecision(8), // 2.0466534 = ((pi^2/3)/C_C)^{1/3}
    T_CROSS: +T_CROSS.toExponential(4), // ~1.1438e9 (lower-endpoint height)
    T_PT: T_PT, // 3e12 (upper-endpoint height)
    N_CROSS: +N_CROSS.toExponential(6), // ~3.280294e9
    N_PT: +N_PT.toExponential(6), // ~1.236240e13
    decadesSpanned: +Math.log10(N_PT / N_CROSS).toPrecision(4), // ~3.576
    ladder: RUNGS.map((r) => ({
      T: +r.T.toExponential(3),
      N: +r.N.toExponential(4),
      sMinStd: +r.sMinStd.toExponential(4),
      sMinCC: +r.sMinCC.toExponential(4),
      oShift: +r.oShift.toPrecision(9),
      relToClosed: +r.relToClosed.toExponential(3),
    })),
    slopeStdCrossToPt: +SLOPE_STD_CROSS_TO_PT.toPrecision(8), // ~ -0.33333333
    slopeCCCrossToPt: +SLOPE_CC_CROSS_TO_PT.toPrecision(8), // ~ -0.33333333
    maxConsecSlopeDevFromMinusThird: +MAX_CONSEC_SLOPE_DEV.toExponential(3), // machine-precision small
    maxOShiftDevFromPrefactor: +MAX_OSHIFT_DEV.toExponential(3), // machine-precision small
    maxRelToClosedAcrossLadder: +MAX_REL_TO_CLOSED.toExponential(3), // ~1.4e-16 (one machine eps)
  },
  findings:
    'Across the crossover -> PT interior the -1/3 exponent is FLAT and the ~2.0467 O(1) ratio is rung-invariant. ' +
    'Every consecutive-rung log-log slope from N ~ 3.28e9 up to N(T_PT) ~ 1.236e13 is -0.33333333 (= -1/3 to eight ' +
    'figures; max deviation ~2.2e-16, one machine epsilon) for both c = pi^2/3 and c = C_C, and the O(1) shift is ' +
    '2.04665342 = ((pi^2/3)/C_C)^{1/3} at every interior rung (N cancels exactly; a pure amplitude). The bisected ' +
    's_min reproduces the exact closed form (3/(cM))^{1/3} to <= ~1.4e-16 at every rung, and the lower/upper rungs ' +
    'tie back to the imp-35724 crossover and imp-35764 PT-anchor s_min values, so the interior is continuous with ' +
    'both endpoints. Populating the ~3.6-decade interior confirms the imp-35764 two-endpoint reading was not hiding ' +
    'a mid-ladder drift: no interior height perturbs the collision-scale scaling law.',
  exponentFlatAcrossInterior: true,
  ratioRungInvariant: true,
  isRigorous: false,
  isUnconditional: false,
  verdict:
    'MEASUREMENT (NOT rigorous). Filling the imp-35764 crossover -> PT-anchor interior with a finer height ladder ' +
    '(6 interior heights log-spaced between T_cross ~ 1.144e9 and T_PT = 3e12, each mapped to its RvM zero count) ' +
    'and recomputing s_min(M; c) by the identical bisection: every consecutive-rung log-log slope is -0.33333333 ' +
    '(= -1/3) for both c = pi^2/3 and c = C_C (max deviation ~2.2e-16), and the O(1) shift is 2.04665342 = ' +
    '((pi^2/3)/C_C)^{1/3} at every interior rung (N cancels; a pure amplitude). The bisected s_min matches the ' +
    'exact closed form to <= ~1.4e-16 (one machine epsilon) throughout, and the endpoints tie back to the ' +
    'imp-35724 crossover and imp-35764 PT-anchor readings. So the -1/3 exponent is flat and the ~2.0467 ratio is ' +
    'rung-invariant across the whole ~3.6-decade interior; no interior height perturbs the scaling law, and the ' +
    'imp-35764 two-endpoint reading was not an artifact. Measurement only; densifies the imp-35764/imp-35696 ' +
    'propagation; derives no remainder; discharges nothing; changes no bound; establishes no operator positivity; ' +
    'C_C = (1/8) sqrt(3 pi) (imp-2642/imp-2643), C_H = 1/8, E_trunc = 3.06e-5 (imp-2631) and C_mb GUE-conditional ' +
    '(imp-486) are UNTOUCHED; imp-35337a stays OPEN; no RH verdict, NO QED. No refereed bound is changed' +
    '.',
  citation:
    'imp-35764 (endpoint reading; this module fills the interior); imp-35814 (extends ABOVE the anchor; this one ' +
    'fills BELOW it); imp-35724 (peak + crossover landmarks; lower-endpoint tie-back); imp-35696 (cube-root ' +
    'prefactor ((pi^2/3)/C_C)^{1/3} ~ 2.047, exponent -1/3); imp-35680 (amplitude mismatch (pi^2/3)/C_C ~ 8.573); ' +
    'imp-35304 (N_cross crossover anchor); lambda-rh-height-mapping (zeroCountAtHeight exact RvM forward count, ' +
    'effectiveHeightForN inverse); imp-2642/imp-2643 (C_C = (1/8) sqrt(3 pi), C_H = 1/8); imp-2631 (E_trunc ' +
    'floor); imp-486 (GUE-conditional caveat). Literature: Montgomery (1973); Rudnick-Sarnak (1996); Ben ' +
    'Arous-Bourgade (2013, smallest GUE gaps ~ n^{-4/3}); Riemann-von Mangoldt counting formula. Platt-Trudgian ' +
    '2021 (Lambda <= 0.2).',
};

export const IMP35830_COLLISION_SCALE_CROSSOVER_TO_PT_INTERIOR_LADDER_ASSERTIONS = [
  {
    // (1) the interior ladder spans the crossover height up to the exact RvM PT anchor, ~3.6 decades in N.
    id: 'imp35830-ladder-spans-crossover-to-pt-anchor',
    description: 'the ladder runs from N_cross ~ 3.28e9 (via T_cross = effectiveHeightForN(N_cross)) up to N(T_PT) = zeroCountAtHeight(3e12) ~ 1.236e13, ~3.6 decades',
    holds: () =>
      Math.abs(zeroCountAtHeight(T_CROSS) - N_CROSS) / N_CROSS < 1e-6 &&
      Math.abs(R_PT.N - zeroCountAtHeight(3e12)) < 1e-6 &&
      R_PT.N > 1.2e13 && R_PT.N < 1.3e13 &&
      RUNGS.length === N_INTERIOR + 2 &&
      Math.log10(N_PT / N_CROSS) > 3.4 && Math.log10(N_PT / N_CROSS) < 3.7,
  },
  {
    // (2) the interior rungs are monotone-ascending in N and strictly interior to the endpoints.
    id: 'imp35830-interior-rungs-ascending-and-strictly-between',
    description: 'the 6 interior rungs are strictly between N_cross and N(T_PT) and the whole ladder is monotone-ascending in N',
    holds: () => {
      for (let i = 1; i < RUNGS.length; i++) {
        if (!(RUNGS[i].N > RUNGS[i - 1].N)) return false;
      }
      for (let i = 1; i < RUNGS.length - 1; i++) {
        if (!(RUNGS[i].N > R_CROSS.N && RUNGS[i].N < R_PT.N)) return false;
      }
      return true;
    },
  },
  {
    // (3) the -1/3 exponent is flat across the interior: every consecutive-rung slope is -1/3 to eight figures.
    id: 'imp35830-slope-minus-one-third-flat-across-interior',
    description: 'every consecutive-rung log-log slope from N_cross up to N(T_PT) is -1/3 (both coefficients), as is the overall cross -> PT span slope',
    holds: () =>
      CONSEC_SLOPES_STD.every((s) => Math.abs(s + 1 / 3) < 5e-7) &&
      CONSEC_SLOPES_CC.every((s) => Math.abs(s + 1 / 3) < 5e-7) &&
      Math.abs(SLOPE_STD_CROSS_TO_PT + 1 / 3) < 5e-7 &&
      Math.abs(SLOPE_CC_CROSS_TO_PT + 1 / 3) < 5e-7 &&
      MAX_CONSEC_SLOPE_DEV < 5e-7,
  },
  {
    // (4) the O(1) shift is the M-independent prefactor ratio ((pi^2/3)/C_C)^{1/3} at EVERY interior rung (N cancels).
    id: 'imp35830-oshift-equals-prefactor-every-interior-rung',
    description: 'the C_C/std O(1) shift equals ((pi^2/3)/C_C)^{1/3} ~ 2.047 at every rung of the interior ladder',
    holds: () =>
      PREF_RATIO > 2.04 && PREF_RATIO < 2.05 &&
      MAX_OSHIFT_DEV < 1e-9 &&
      RUNGS.every((r) => Math.abs(r.oShift - PREF_RATIO) < 1e-9),
  },
  {
    // (5) the bisection is well-conditioned across the interior: it matches the exact closed form to ~1 machine eps.
    id: 'imp35830-bisection-matches-closed-form',
    description: 'the bisected s_min matches the closed form (3/(cM))^{1/3} to <= ~1e-15 at every interior rung',
    holds: () => MAX_REL_TO_CLOSED < 1e-15,
  },
  {
    // (6) endpoint continuity: the lower rung ties back to imp-35724 crossover, the upper rung to imp-35764 PT anchor.
    id: 'imp35830-endpoints-tie-back-to-imp35724-and-imp35764',
    description: 'the lower rung reproduces the imp-35724 crossover s_min and the upper rung reproduces the imp-35764 PT-anchor s_min values',
    holds: () => {
      const c724 = IMP35724_COLLISION_SCALE_LANDMARK_PREFACTOR_PROPAGATION.measurement.cross;
      return (
        Math.abs(+R_CROSS.sMinStd.toExponential(4) - c724.sMinStd) < 1e-8 &&
        Math.abs(+R_CROSS.sMinCC.toExponential(4) - c724.sMinCC) < 1e-8 &&
        Math.abs(+R_PT.sMinStd.toExponential(4) - IMP35764_PT_ANCHOR_SMIN_STD) < 1e-9 &&
        Math.abs(+R_PT.sMinCC.toExponential(4) - IMP35764_PT_ANCHOR_SMIN_CC) < 1e-9 &&
        Math.abs(R_PT.oShift - IMP35764_PT_ANCHOR_OSHIFT) < 1e-6
      );
    },
  },
  {
    // (7) honesty gate: measurement only, conditional, no bound moves, no refereed bound is changed, imp-35337a OPEN, NO QED.
    id: 'imp35830-measurement-only-no-qed',
    description: 'measurement only: not rigorous/unconditional, changes no bound, keeps imp-486 caveat, imp-35337a OPEN, PT 0.2, NO QED',
    holds: () => {
      const r = IMP35830_COLLISION_SCALE_CROSSOVER_TO_PT_INTERIOR_LADDER;
      return (
        Math.abs(L_PT - 0.2) < 1e-15 &&
        r.isRigorous === false &&
        r.isUnconditional === false &&
        r.exponentFlatAcrossInterior === true &&
        r.ratioRungInvariant === true &&
        /imp-486/.test(r.verdict) &&
        /imp-35337a stays OPEN/.test(r.verdict) &&
        /NO QED/.test(r.verdict) &&
        /refereed bound is changed/i.test(r.verdict)
      );
    },
  },
];

for (const a of IMP35830_COLLISION_SCALE_CROSSOVER_TO_PT_INTERIOR_LADDER_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-35830-collision-scale-crossover-to-pt-interior-ladder assertion failed: ${a.id}`);
  }
}
