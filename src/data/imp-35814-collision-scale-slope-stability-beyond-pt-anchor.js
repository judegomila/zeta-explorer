/**
 * @module imp-35814-collision-scale-slope-stability-beyond-pt-anchor
 *
 * imp-35814 (numerical, measurement): imp-35764 propagated the imp-35696
 * cube-root collision-scale prefactor ((pi^2/3)/C_C)^{1/3} ~ 2.047 onto the
 * Platt-Trudgian verified-barrier height T_PT = 3e12 (N(T_PT) ~ 1.236e13) and
 * confirmed the -1/3 s_min-vs-N log-log slope from the imp-35304 crossover up to
 * that anchor. It STOPPED at the PT anchor. This module extends the ladder
 * BEYOND the anchor toward N ~ 1e15 (and a stress tail out to N ~ 1e30) and asks
 * two questions imp-35764 never tested:
 *   (Q1) do the -1/3 slope and the ~2.0467 O(1) prefactor ratio stay stable
 *        above the barrier height, and
 *   (Q2) does the BISECTION on the extreme-value balance M F(s_min) = 1
 *        (F(s) = c s^3 / 3) develop any double-precision float-cancellation
 *        artifact analogous to the imp-35766 dG breakdown past N ~ 1e18?
 *
 * THE MEASUREMENT. Using the IDENTICAL imp-35764 machinery -- RvM surrogate
 * M = N, cumulative F(s) = c s^3 / 3, and the same lo=0/hi-doubling BISECTION
 * (200 iterations) that recomputes s_min(M; c) for c in {pi^2/3, C_C} -- we run
 * an extended ladder N in {N(T_PT), 3e13, 1e14, 3e14, 1e15} plus a stress tail
 * {1e16, 1e18, 1e20, 1e30}. At each rung we read the O(1) shift
 * s_min(C_C)/s_min(std), the consecutive-rung log-log slope of s_min against N,
 * and the relative gap between the bisected s_min and the exact closed form
 * s_min = (3/(cM))^{1/3} (the direct measure of how well the root-find is
 * conditioned at that height).
 *
 * WHAT COMES OUT.
 *   (F1) SLOPE AND RATIO ARE FLAT ABOVE THE ANCHOR. Every consecutive-rung slope
 *        from N(T_PT) ~ 1.236e13 up to N ~ 1e15 is -0.33333333 (= -1/3 to eight
 *        figures) for BOTH coefficients, and the O(1) shift is 2.04665341589 =
 *        ((pi^2/3)/C_C)^{1/3} at EVERY rung (N cancels exactly; it is a pure
 *        amplitude). Extending ~1.9 decades above the barrier height changes
 *        nothing: s_min moves from ~4.194e-5 (N_PT) to ~9.697e-6 (1e15) for
 *        c = pi^2/3, tracking N^{-1/3} cleanly.
 *   (F2) NO imp-35766-STYLE CANCELLATION ARTIFACT -- THE BISECTION IS
 *        STRUCTURALLY CANCELLATION-FREE. imp-35766 saw its ratio R = -dFP/dG
 *        drift SPURIOUSLY upward past N ~ 1e18 because dG = S_inf(M_G - 1)
 *        SUBTRACTS near-equal quantities (M_G - 1 ~ -a/2 -> 0). The collision-
 *        scale root-find has NO such subtraction: F(s) = c s^3/3 is strictly
 *        monotone and s_min = (3/(cM))^{1/3} is a well-conditioned root. The
 *        bisected s_min reproduces the exact closed form to <= ~2.2e-16
 *        (one machine epsilon) at EVERY rung -- including the stress tail out to
 *        N ~ 1e30, where s_min ~ 9.7e-11 is still nowhere near cubic underflow
 *        (mid^3 would underflow only near mid ~ 1e-36, i.e. N ~ 1e108). So the
 *        -1/3 slope and 2.0467 ratio are stable arbitrarily far above the PT
 *        anchor, and the imp-35766 artifact has no analog in this channel.
 *
 * CONSEQUENCE. The imp-35764 reading is not an anchor-local coincidence: the
 * -1/3 exponent and the amplitude-only ~2.0467 ratio persist indefinitely above
 * the barrier height, and -- unlike the imp-35766 Krawczyk ratio -- the
 * collision-scale bisection carries no float-cancellation liability, so there is
 * no extreme-N height at which its measurement first breaks.
 *
 * Measurement only; extends the imp-35764/imp-35696 propagation beyond the PT
 * anchor; derives no remainder; discharges nothing; changes no bound;
 * establishes no operator positivity; C_C = (1/8) sqrt(3 pi) (imp-2642/
 * imp-2643), C_H = 1/8, E_trunc = 3.06e-5 (imp-2631) and C_mb GUE-conditional
 * (imp-486) are UNTOUCHED; imp-35337a stays OPEN; NO QED; no refereed bound is changed.
 *
 * @see imp-35764-collision-scale-pt-anchor-prefactor-propagation (PT-anchor propagation; this module extends beyond it)
 * @see imp-35766-krawczyk-cancellation-ratio-beyond-band (the dG differencing artifact past N ~ 1e18 that this channel does NOT share)
 * @see imp-35696-collision-exponent-consistency-check (cube-root prefactor ((pi^2/3)/C_C)^{1/3} ~ 2.047, exponent -1/3)
 * @see lambda-rh-height-mapping (zeroCountAtHeight exact RvM forward count)
 * @see imp-2642/imp-2643 (C_C = (1/8) sqrt(3 pi), C_H = 1/8)
 * Literature: Montgomery (1973); Rudnick-Sarnak (1996); Ben Arous-Bourgade
 * (2013, smallest GUE gaps ~ n^{-4/3}); Riemann-von Mangoldt counting formula.
 * Platt-Trudgian 2021 (T_PT = 3e12, Lambda <= 0.2).
 */

import { IMP35764_COLLISION_SCALE_PT_ANCHOR_PREFACTOR_PROPAGATION } from './imp-35764-collision-scale-pt-anchor-prefactor-propagation.js';
import { zeroCountAtHeight } from './lambda-rh-height-mapping.js';

const L_PT = 0.2; // Platt-Trudgian 2021 bound (unchanged by any measurement here)

// Short-range collision constant (imp-2642/imp-2643 ansatz, C_H = 1/8).
const C_C = (1 / 8) * Math.sqrt(3 * Math.PI); // ~ 0.38374752
// Standard GUE small-gap density coefficient p(s) ~ (pi^2/3) s^2 (cubic beta = 2).
const C_STD = (Math.PI * Math.PI) / 3; // ~ 3.28987

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

// Exact closed form of the same root, used ONLY as a conditioning reference to
// detect any float-cancellation artifact in the bisection (there is none).
const sMinClosed = (M, c) => Math.cbrt(3 / (c * M));

// Extended ladder: PT anchor up toward N ~ 1e15, then a stress tail to N ~ 1e30
// to probe for the imp-35766 extreme-N cancellation artifact (absent here).
const N_1E15 = 1e15;
const LADDER_N = [N_PT, 3e13, 1e14, 3e14, N_1E15, 1e16, 1e18, 1e20, 1e30];

// The M-independent prefactor ratio the shift should equal (imp-35696).
const PREF_RATIO = Math.cbrt(C_STD / C_C); // ~ 2.0467 = ((pi^2/3)/C_C)^{1/3}

// Per-rung reading: s_min under both coefficients, the O(1) shift, the relative
// gap between the bisected s_min and the exact closed form (conditioning meter).
function rung(N) {
  const M = N;
  const sMinStd = sMinNumeric(M, C_STD);
  const sMinCC = sMinNumeric(M, C_C);
  const relToClosed = Math.abs(sMinStd - sMinClosed(M, C_STD)) / sMinClosed(M, C_STD);
  return { N, M, sMinStd, sMinCC, oShift: sMinCC / sMinStd, relToClosed };
}

const RUNGS = LADDER_N.map(rung);

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

// Overall slope PT anchor -> N ~ 1e15 (the ~1.9-decade span above the barrier).
const R_PT = RUNGS[0];
const R_1E15 = RUNGS[4];
const SLOPE_STD_PT_TO_1E15 = slope(R_1E15.sMinStd, R_PT.sMinStd, R_1E15.N, R_PT.N);
const SLOPE_CC_PT_TO_1E15 = slope(R_1E15.sMinCC, R_PT.sMinCC, R_1E15.N, R_PT.N);

// The worst (largest) bisection-vs-closed-form relative gap across the WHOLE
// ladder including the extreme-N tail -- the conditioning verdict.
const MAX_REL_TO_CLOSED = Math.max(...RUNGS.map((r) => r.relToClosed));

export const IMP35814_COLLISION_SCALE_SLOPE_STABILITY_BEYOND_PT_ANCHOR = {
  id: 'imp-35814',
  proofSection: 'S-frontier',
  question:
    'imp-35764 confirmed the -1/3 collision-scale slope and the ~2.0467 O(1) prefactor ratio from the imp-35304 ' +
    'crossover up to the Platt-Trudgian anchor N(T_PT = 3e12) ~ 1.236e13, then stopped. Extending the RvM-surrogate ' +
    'bisection ladder beyond the anchor toward N ~ 1e15 (and a stress tail to N ~ 1e30), do the -1/3 slope and the ' +
    '~2.0467 ratio stay stable, and does the bisection on M F(s_min) = 1 develop any double-precision cancellation ' +
    'artifact analogous to the imp-35766 dG breakdown past N ~ 1e18?',
  method:
    'Reuse the identical imp-35764 machinery (RvM surrogate M = N, F(s) = c s^3 / 3, lo=0/hi-doubling bisection over ' +
    '200 iterations) to recompute s_min(M; c) for c in {pi^2/3, C_C} on the extended ladder ' +
    '{N(T_PT), 3e13, 1e14, 3e14, 1e15, 1e16, 1e18, 1e20, 1e30}. At each rung read the O(1) shift ' +
    's_min(C_C)/s_min(std), the consecutive-rung log-log slope of s_min against N, and the relative gap between the ' +
    'bisected s_min and the exact closed form s_min = (3/(cM))^{1/3} as a conditioning meter.',
  measurement: {
    C_C: +C_C.toPrecision(8), // 0.38374752 (untouched)
    cStd: +C_STD.toPrecision(8), // 3.2898681 (pi^2/3)
    prefactorRatioCCtoStd: +PREF_RATIO.toPrecision(8), // 2.0466534 = ((pi^2/3)/C_C)^{1/3}
    N_PT: +N_PT.toExponential(6), // ~1.236240e13 (anchor, lower end of extended ladder)
    ladder: RUNGS.map((r) => ({
      N: +r.N.toExponential(3),
      sMinStd: +r.sMinStd.toExponential(4),
      sMinCC: +r.sMinCC.toExponential(4),
      oShift: +r.oShift.toPrecision(9),
      relToClosed: +r.relToClosed.toExponential(3),
    })),
    slopeStdPtTo1e15: +SLOPE_STD_PT_TO_1E15.toPrecision(8), // ~ -0.33333333
    slopeCCPtTo1e15: +SLOPE_CC_PT_TO_1E15.toPrecision(8), // ~ -0.33333333
    maxConsecSlopeDevFromMinusThird: +Math.max(
      ...CONSEC_SLOPES_STD.map((s) => Math.abs(s + 1 / 3)),
      ...CONSEC_SLOPES_CC.map((s) => Math.abs(s + 1 / 3))
    ).toExponential(3), // machine-precision small
    maxRelToClosedAcrossLadder: +MAX_REL_TO_CLOSED.toExponential(3), // ~2.2e-16 (one machine eps)
    decadesAbovePtAnchor: +Math.log10(N_1E15 / N_PT).toPrecision(4), // ~1.907
  },
  findings:
    'Above the Platt-Trudgian barrier height the -1/3 slope and the amplitude-only ~2.0467 ratio are FLAT. Every ' +
    'consecutive-rung log-log slope from N(T_PT) ~ 1.236e13 to N ~ 1e15 is -0.33333333 (= -1/3 to eight figures) ' +
    'for both c = pi^2/3 and c = C_C, and the O(1) shift is 2.04665342 = ((pi^2/3)/C_C)^{1/3} at every rung (N ' +
    'cancels exactly). Crucially, the bisection carries NO imp-35766-style cancellation artifact: F(s) = c s^3/3 ' +
    'is strictly monotone and s_min = (3/(cM))^{1/3} is a well-conditioned root with no subtraction of near-equal ' +
    'quantities (unlike imp-35766 dG = S_inf(M_G - 1) which differences M_G - 1 ~ -a/2 -> 0). The bisected s_min ' +
    'reproduces the exact closed form to <= ~2.2e-16 (one machine epsilon) at EVERY rung, including the stress ' +
    'tail out to N ~ 1e30, so the slope and ratio stay stable arbitrarily far above the anchor and the imp-35766 ' +
    'extreme-N breakdown has no analog in this channel.',
  slopeStableBeyondAnchor: true,
  ratioStableBeyondAnchor: true,
  cancellationArtifactPresent: false,
  isRigorous: false,
  isUnconditional: false,
  verdict:
    'MEASUREMENT (NOT rigorous). Extending the imp-35764 collision-scale bisection ladder beyond the ' +
    'Platt-Trudgian anchor N(T_PT) ~ 1.236e13 toward N ~ 1e15 (and a stress tail to N ~ 1e30): every ' +
    'consecutive-rung log-log slope is -0.33333333 (= -1/3) for both c = pi^2/3 and c = C_C, and the O(1) shift ' +
    'is 2.04665342 = ((pi^2/3)/C_C)^{1/3} at every rung (N cancels; a pure amplitude). Unlike the imp-35766 ' +
    'Krawczyk ratio -- which drifts spuriously past N ~ 1e18 because dG = S_inf(M_G - 1) subtracts near-equal ' +
    'quantities -- the collision-scale root-find is structurally cancellation-free: s_min = (3/(cM))^{1/3} is a ' +
    'monotone well-conditioned root, and the bisected value matches the exact closed form to <= ~2.2e-16 (one ' +
    'machine epsilon) across the entire ladder including N ~ 1e30. So the -1/3 exponent and the ~2.0467 ratio are ' +
    'stable arbitrarily far above the barrier height and there is no extreme-N artifact analogous to imp-35766. ' +
    'Measurement only; extends the imp-35764/imp-35696 propagation; derives no remainder; discharges nothing; ' +
    'changes no bound; establishes no operator positivity; C_C = (1/8) sqrt(3 pi) (imp-2642/imp-2643), C_H = 1/8, ' +
    'E_trunc = 3.06e-5 (imp-2631) and C_mb GUE-conditional (imp-486) are UNTOUCHED; imp-35337a stays OPEN; no RH ' +
    'verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-35764 (PT-anchor propagation; this module extends beyond it); imp-35766 (the dG differencing artifact ' +
    'past N ~ 1e18 that this channel does NOT share); imp-35696 (cube-root prefactor ((pi^2/3)/C_C)^{1/3} ~ ' +
    '2.047, exponent -1/3); imp-35680 (amplitude mismatch (pi^2/3)/C_C ~ 8.573); lambda-rh-height-mapping ' +
    '(zeroCountAtHeight exact RvM forward count); imp-2642/imp-2643 (C_C = (1/8) sqrt(3 pi), C_H = 1/8); imp-2631 ' +
    '(E_trunc floor); imp-486 (GUE-conditional caveat). Literature: Montgomery (1973); Rudnick-Sarnak (1996); ' +
    'Ben Arous-Bourgade (2013, smallest GUE gaps ~ n^{-4/3}); Riemann-von Mangoldt counting formula. ' +
    'Platt-Trudgian 2021 (Lambda <= 0.2).',
};

export const IMP35814_COLLISION_SCALE_SLOPE_STABILITY_BEYOND_PT_ANCHOR_ASSERTIONS = [
  {
    // (1) the extended ladder starts at the exact RvM PT anchor and reaches ~1.9 decades above it to N ~ 1e15.
    id: 'imp35814-ladder-spans-pt-anchor-to-1e15',
    description: 'the ladder starts at N(T_PT) = zeroCountAtHeight(3e12) ~ 1.236e13 and reaches N ~ 1e15, ~1.9 decades above the anchor',
    holds: () =>
      Math.abs(R_PT.N - zeroCountAtHeight(3e12)) < 1e-6 &&
      R_PT.N > 1.2e13 && R_PT.N < 1.3e13 &&
      Math.abs(R_1E15.N - 1e15) < 1 &&
      Math.log10(N_1E15 / N_PT) > 1.8 && Math.log10(N_1E15 / N_PT) < 2.0,
  },
  {
    // (2) the -1/3 slope is stable above the anchor: every consecutive-rung slope equals -1/3 to eight figures.
    id: 'imp35814-slope-minus-one-third-beyond-anchor',
    description: 'every consecutive-rung log-log slope from N(T_PT) up through the ladder is -1/3 (both coefficients), as is the PT -> 1e15 span slope',
    holds: () =>
      CONSEC_SLOPES_STD.every((s) => Math.abs(s + 1 / 3) < 5e-7) &&
      CONSEC_SLOPES_CC.every((s) => Math.abs(s + 1 / 3) < 5e-7) &&
      Math.abs(SLOPE_STD_PT_TO_1E15 + 1 / 3) < 5e-7 &&
      Math.abs(SLOPE_CC_PT_TO_1E15 + 1 / 3) < 5e-7,
  },
  {
    // (3) the O(1) shift is the M-independent prefactor ratio ((pi^2/3)/C_C)^{1/3} at EVERY rung (N cancels).
    id: 'imp35814-oshift-equals-prefactor-every-rung',
    description: 'the C_C/std O(1) shift equals ((pi^2/3)/C_C)^{1/3} ~ 2.047 at every rung of the extended ladder',
    holds: () =>
      PREF_RATIO > 2.04 && PREF_RATIO < 2.05 &&
      RUNGS.every((r) => Math.abs(r.oShift - PREF_RATIO) < 1e-9),
  },
  {
    // (4) the bisection is cancellation-free: it matches the exact closed form to ~1 machine epsilon at EVERY rung,
    //     INCLUDING the extreme-N stress tail -- so there is NO imp-35766-style artifact in this channel.
    id: 'imp35814-no-imp35766-cancellation-artifact',
    description: 'the bisected s_min matches the closed form (3/(cM))^{1/3} to <= ~1e-15 across the whole ladder incl. N ~ 1e30 (no float-cancellation artifact)',
    holds: () =>
      MAX_REL_TO_CLOSED < 1e-15 &&
      IMP35814_COLLISION_SCALE_SLOPE_STABILITY_BEYOND_PT_ANCHOR.cancellationArtifactPresent === false,
  },
  {
    // (5) continuity with imp-35764: the recomputed PT-anchor rung reproduces the imp-35764 baked ptAnchor s_min values.
    id: 'imp35814-ties-back-to-imp35764-pt-anchor',
    description: 'the PT-anchor rung recomputed here reproduces the imp-35764 baked ptAnchor sMinStd/sMinCC/oShift',
    holds: () => {
      const p = IMP35764_COLLISION_SCALE_PT_ANCHOR_PREFACTOR_PROPAGATION.measurement.ptAnchor;
      return (
        Math.abs(+R_PT.sMinStd.toExponential(4) - p.sMinStd) < 1e-9 &&
        Math.abs(+R_PT.sMinCC.toExponential(4) - p.sMinCC) < 1e-9 &&
        Math.abs(R_PT.oShift - p.oShiftCCoverStd) < 1e-6
      );
    },
  },
  {
    // (6) honesty gate: measurement only, conditional, no bound moves, no refereed bound is changed, imp-35337a OPEN, NO QED.
    id: 'imp35814-measurement-only-no-qed',
    description: 'measurement only: not rigorous/unconditional, changes no bound, keeps imp-486 caveat, imp-35337a OPEN, PT 0.2, NO QED',
    holds: () => {
      const r = IMP35814_COLLISION_SCALE_SLOPE_STABILITY_BEYOND_PT_ANCHOR;
      return (
        Math.abs(L_PT - 0.2) < 1e-15 &&
        r.isRigorous === false &&
        r.isUnconditional === false &&
        r.slopeStableBeyondAnchor === true &&
        /imp-486/.test(r.verdict) &&
        /imp-35337a stays OPEN/.test(r.verdict) &&
        /NO QED/.test(r.verdict) &&
        /refereed bound is changed/i.test(r.verdict)
      );
    },
  },
];

for (const a of IMP35814_COLLISION_SCALE_SLOPE_STABILITY_BEYOND_PT_ANCHOR_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-35814-collision-scale-slope-stability-beyond-pt-anchor assertion failed: ${a.id}`);
  }
}
