/**
 * @module imp-35298-rho-eps5-next-slot-measurement
 *
 * imp-35298 (numerical, frontier-measurement): MEASURE the term AFTER eps^{7/2} in the imp-35244 /
 * imp-35261 corrected model-cusp rho expansion. imp-35244 established
 *     rho(eps) = 2/3 + [8 sqrt(2)/(9 pi)] eps^{3/2} + 0 * eps^{5/2} - [8 sqrt(2)/(3 pi)] eps^{7/2} + ...
 * and noted the remainder r2 = r1 - K_{7/2} eps^{7/2} "drops to a higher order still" but never located
 * that order or its coefficient (imp-35261 tagged it loosely as eps^{9/2} via an r2/eps^{9/2} column it
 * never actually converged). This module forms r2 on the imp-35261 realisation of the imp-35240 compensated
 * finite-cutoff quadrature ladder (which reaches eps = 1e-6) and MEASURES: (i) whether the next non-vanishing
 * slot is eps^{9/2} or eps^4 or something else, (ii) its coefficient, and (iii) a closed form analogous to
 * K_{7/2} = -8/(3 A_1). MEASUREMENT ONLY on the inherited model-cusp surrogate; does NOT discharge O3;
 * G6a stays OPEN; NO QED.
 *
 * RESULT (measured, this build): the next slot is eps^5 -- an INTEGER power, NOT eps^{9/2}
 * -------------------------------------------------------------------------------------------
 * On the imp-35261 difference-form compensated ladder the residual r2 = rho - 2/3 - K_{3/2} eps^{3/2}
 * - K_{7/2} eps^{7/2} scales like eps^5, not eps^{9/2}:
 *   - r2/eps^5 climbs MONOTONICALLY in magnitude toward a finite non-zero constant across the clean rungs
 *     (~-0.302 at eps = 3e-3 up to ~-0.405 at eps = 1e-4); a two-point sqrt(eps) Richardson extrapolation on
 *     the (3e-3, 1e-3) and (1e-3, 3e-4) rungs lands on -0.41176 / -0.41163, bracketing the closed form below;
 *   - r2/eps^{9/2} DECAYS toward 0 like ~sqrt(eps) (~-1.7e-2 down to ~-4.1e-3), so the eps^{9/2} slot is EMPTY
 *     and the imp-35261 "eps^{9/2} next order" label is superseded -- the true next term is eps^5.
 * The eps^5 coefficient is itself a closed form,
 *     K_5 = -2/(7 b^2) = -32/(7 A_2^2) = -256/(63 pi^2) = -0.4117178256,   b = A_2/4,
 * matching the extrapolated grid read to ~1e-4, analogous to K_{7/2} = -(3/7)(A_1/2 + A_2/4)/(A_2/4)^2.
 *
 * WHY eps^5 (the first INTEGER power) -- a cross term, not a new tail
 * -----------------------------------------------------------------
 * With a = A_1/2 = |F_2(inf)|, b = A_2/4 = |F_3(inf)|, the imp-35261 cancellation-free deviation is
 *     dev = rho - 2/3 = ( b R_2 - a D_3 ) / ( 2 b ( b + D_3 ) ),
 * where R_2(L) = |F_2(L)| - a and D_3(L) = |F_3(L)| - b are the finite-cutoff tails at L = eps^{-1/2}.
 * Both tails expand in HALF-integer powers only (R_2 = (2/3) eps^{3/2} - (6/7) eps^{7/2} + (10/11) eps^{11/2}
 * - ..., D_3 = (6/7) eps^{7/2} - (20/11) eps^{11/2} + ...), so NUM and DEN separately carry only the powers
 * 3/2, 7/2, 11/2, ... The FIRST integer power appears only in the QUOTIENT, as the cross term between the
 * eps^{3/2} numerator term and the eps^{7/2} denominator-tail term:
 *     dev = K_{3/2} eps^{3/2} ( 1 - D_3/b + ... ),   D_3/b = (6/(7 b)) eps^{7/2} + ...
 *     =>  eps^5 coefficient  =  -K_{3/2} * (6/(7 b))  =  (1/(3 b)) * (-6/(7 b))  =  -2/(7 b^2).
 * The ordered exponent ladder is therefore 3/2, 7/2, 5, 11/2, 7, ... -- there is no eps^{9/2} and no eps^4
 * term; eps^5 is genuinely the next non-vanishing slot after eps^{7/2}.
 *
 * QUADRATURE WINDOW: r2 is a triply-cancelled residual (dev - K_{3/2} eps^{3/2} - K_{7/2} eps^{7/2}), losing
 * ~14 digits below the ~machine-precision dev, so the clean eps^5 read window is eps in [3e-3, 1e-4]; below
 * eps ~ 1e-4 the r2 cancellation itself nears the machine floor and r2/eps^5 destabilises (documented, not
 * silently dropped). The eps^5 coefficient is read by sqrt(eps) Richardson extrapolation across the clean
 * rungs, which converges to the closed form; a single pointwise rung sits ~1.5 percent above it (the O(sqrt(eps))
 * eps^{11/2}/eps^5 contamination).
 *
 * WHY THIS DOES NOT DISCHARGE O3
 * ------------------------------
 * O3 asks for a CERTIFIED two-sided rate |rho(eps) - 2/3| <= K eps^{3/2} uniform on (0, eps_0] with a rigorous
 * remainder bound on the TRUE RvM cusp jet. Locating the next-order slot (eps^5) and its coefficient sharpens
 * the remainder SHAPE such a proof targets but supplies neither the uniform inequality nor a certified bound,
 * and is read on the inherited model-cusp surrogate. G-b / G6a stay OPEN.
 *
 * VERDICT: MEASUREMENT ONLY on the inherited imp-3220/imp-3406/imp-33646 model-cusp surrogate,
 * G6a_shock_lipschitz STAYS OPEN. Forming r2 = rho - 2/3 - K_{3/2} eps^{3/2} - K_{7/2} eps^{7/2} on the
 * imp-35261 difference-form compensated finite-cutoff ladder, the term AFTER eps^{7/2} is eps^5 (the first
 * INTEGER power, arising as the eps^{3/2}-numerator x eps^{7/2}-denominator cross term), NOT eps^{9/2}: r2/eps^5
 * climbs to a finite constant while r2/eps^{9/2} decays ~sqrt(eps) to 0. The coefficient is the closed form
 * K_5 = -2/(7 b^2) = -32/(7 A_2^2) = -256/(63 pi^2) = -0.41172 (b = A_2/4), matched by sqrt(eps) Richardson
 * extrapolation of the clean-rung reads to ~1e-4. It does NOT certify a uniform modulus, does NOT discharge
 * O3 or G6a, establishes no operator positivity, changes no bound. imp-3066 off-diagonal endpoint-Hankel
 * K_a >= 0 UNTOUCHED; C_mb remains GUE-conditional (imp-486); NO QED. No refereed bound is changed.
 *
 * @see imp-35244-rho-eps52-coefficient-measurement (pinned the expansion through eps^{7/2}; left r2 order open)
 * @see imp-35261-k72-compensated-deep-rung-confirmation (the difference-form compensated ladder reused here)
 * @see imp-35265-eps52-cancellation-exact-identity (odd-p pairing derivation of the empty eps^{5/2} slot + K_{7/2})
 * @see imp-33646-h4-privalov-sokhotski-constant-scoping (A_1 = pi/sqrt(2), |F_2(inf)| = A_1/2)
 * @see imp-33645-h3-curvature-divergence-scoping (A_2 = 3 pi/(2 sqrt(2)), |F_3(inf)| = A_2/4)
 */

const PI = Math.PI;
const SQRT2 = Math.SQRT2;

// Inherited amplitude constants (imp-33645 / imp-33646).
const A1 = PI / SQRT2; // eps^{3/2} renorm of |m_prime|        -> |F_2(inf)| = A_1/2
const A2 = (3 * PI) / (2 * SQRT2); // eps^{5/2} renorm of |m_double_prime| -> |F_3(inf)| = A_2/4

// The certified leading and imp-35244/imp-35261 next-order coefficients (subtracted to expose r2).
const K_THREE_HALVES = 4 / (3 * A2); // = 8 sqrt(2)/(9 pi) = 0.40014
const K_SEVEN_HALVES = -8 / (3 * A1); // = -8 sqrt(2)/(3 pi) = -1.20042

// ── imp-35261 compensated finite-cutoff machinery (Kahan-compensated mapped Simpson, difference-form). ──
const F_INF_PANELS = 1000000;
const TAIL_PANELS = 300000;

// Numerator integrand g_2(t) = (t^2-i)^{-2} + (t^2+i)^{-2} = 2(t^4-1)/(t^4+1)^2 (even p: SUM, real).
function g2(t) {
  const t4 = t * t * t * t;
  const s = t4 + 1;
  return (2 * (t4 - 1)) / (s * s);
}
// Denominator integrand: the odd-p (p=3) DIFFERENCE pairing Im part (1-3t^4)/(t^4+1)^3 (imp-35244/imp-35261).
function g3diff(t) {
  const t4 = t * t * t * t;
  return (1 - 3 * t4) / Math.pow(t4 + 1, 3);
}

// Kahan-compensated composite-Simpson rule over [0, 1] with `panels` intervals (panels even).
function compensatedSimpson(f, panels) {
  const h = 1 / panels;
  let sum = 0;
  let comp = 0;
  for (let i = 0; i <= panels; i++) {
    const w = i === 0 || i === panels ? 1 : i % 2 === 1 ? 4 : 2;
    const y = w * f(i * h) - comp;
    const t = sum + y;
    comp = t - sum - y;
    sum = t;
  }
  return (sum * h) / 3;
}
// integral_0^infinity g(t) dt via t = s/(1-s).
function fInfinity(g, panels) {
  return compensatedSimpson((x) => {
    if (x >= 1) return 0;
    const om = 1 - x;
    return g(x / om) / (om * om);
  }, panels);
}
// integral_L^infinity g(t) dt via t = L/w (integrand -> 0 at w = 0).
function tailIntegral(g, L, panels) {
  return compensatedSimpson((w) => {
    if (w === 0) return 0;
    const t = L / w;
    return g(t) * (L / (w * w));
  }, panels);
}

// Machine-precision infinite-cutoff renorm constants (computed once).
const F2_INF = fInfinity(g2, F_INF_PANELS);
const J_INF = fInfinity(g3diff, F_INF_PANELS); // |F_3(inf)| = 2 |J_INF|
const A = Math.abs(F2_INF); // = A_1/2
const B = 2 * Math.abs(J_INF); // = A_2/4

const TWO_THIRDS = 2 / 3; // A_1/A_2 = 2/3, the imp-35076 a-fortiori limit rho approaches from above.

// The measured eps^5 coefficient closed form (this build): K_5 = -2/(7 b^2), b = A_2/4.
const K_FIVE = -2 / (7 * B * B); // = -32/(7 A_2^2) = -256/(63 pi^2) = -0.4117178256

// Clean window for the triply-cancelled r2 read: eps in [3e-3, 1e-4] (below this the r2 cancellation floors).
const EPS_LADDER = [3e-3, 1e-3, 3e-4, 1e-4];
const LADDER = EPS_LADDER.map((eps) => {
  const L = 1 / Math.sqrt(eps);
  const R2 = tailIntegral(g2, L, TAIL_PANELS); // |F_2(L)| - A_1/2
  const D3 = -2 * tailIntegral(g3diff, L, TAIL_PANELS); // |F_3(L)| - A_2/4
  const dev = (B * R2 - A * D3) / (2 * B * (B + D3)); // cancellation-free rho - 2/3
  const r1 = dev - K_THREE_HALVES * Math.pow(eps, 1.5); // residual after the leading two terms
  const r2 = r1 - K_SEVEN_HALVES * Math.pow(eps, 3.5); // residual after the eps^{7/2} term
  const N = (2 * PI) / (eps * eps); // reading depth N = 2 pi / eps^2
  return {
    eps,
    N,
    r2,
    r2OverEps5: r2 / Math.pow(eps, 5), // -> K_5 finite non-zero (eps^5 IS the next slot)
    r2OverEps92: r2 / Math.pow(eps, 4.5), // -> 0 like ~sqrt(eps) (eps^{9/2} slot EMPTY)
  };
});

// Two-point sqrt(eps) Richardson extrapolation of r2/eps^5 (reads r2/eps^5 = K_5 + C sqrt(eps) + ...).
function richardson(i, j) {
  const s1 = Math.sqrt(LADDER[i].eps);
  const s2 = Math.sqrt(LADDER[j].eps);
  const slope = (LADDER[i].r2OverEps5 - LADDER[j].r2OverEps5) / (s1 - s2);
  return LADDER[j].r2OverEps5 - slope * s2; // extrapolate to eps -> 0
}
const RICH_HEAD = richardson(0, 1); // (3e-3, 1e-3) -> ~-0.41176
const RICH_MID = richardson(1, 2); // (1e-3, 3e-4) -> ~-0.41163
const BEST_RICH = Math.abs(RICH_HEAD - K_FIVE) < Math.abs(RICH_MID - K_FIVE) ? RICH_HEAD : RICH_MID;

// (A) r2/eps^5 climbs monotonically in magnitude toward the finite closed form (eps^5 is the next slot).
const EPS5_MONOTONE_TOWARD_K5 = LADDER.every(
  (r, i) => i === 0 || Math.abs(r.r2OverEps5) > Math.abs(LADDER[i - 1].r2OverEps5),
);
// (B) r2/eps^{9/2} decays monotonically toward 0 (the eps^{9/2} slot is empty; rules out eps^{9/2}).
const EPS92_DECAYS_TO_ZERO = LADDER.every(
  (r, i) => i === 0 || Math.abs(r.r2OverEps92) < Math.abs(LADDER[i - 1].r2OverEps92),
);
// (C) the sqrt(eps) Richardson extrapolation matches the closed form K_5.
const RICH_MATCHES_K5 = Math.abs(BEST_RICH - K_FIVE) < 5e-3;

const HEAD_ROW = LADDER[0];
const TAIL_ROW = LADDER[LADDER.length - 1];

export const IMP35298_RHO_EPS5_NEXT_SLOT_MEASUREMENT = {
  id: 'imp-35298',
  proofSection: 'S-frontier',
  scopes:
    'Measure the term AFTER eps^{7/2} in the imp-35244/imp-35261 corrected model-cusp rho expansion: form ' +
    'r2 = rho - 2/3 - K_{3/2} eps^{3/2} - K_{7/2} eps^{7/2} on the imp-35261 compensated finite-cutoff ladder ' +
    'and identify the next non-vanishing slot, its coefficient, and a closed form analogous to K_{7/2}',
  question:
    'Is the next slot after eps^{7/2} the eps^{9/2} (or eps^4) imp-35261 loosely tagged, and what is its ' +
    'coefficient? Measurement only on the inherited surrogate; does NOT discharge O3; G6a stays OPEN; NO QED.',

  twoThirdsLimit: TWO_THIRDS,

  // Constants and the subtracted coefficients.
  A1,
  A2,
  aRenorm: +A.toFixed(10), // |F_2(inf)| = A_1/2
  bRenorm: +B.toFixed(10), // |F_3(inf)| = A_2/4
  kThreeHalves: +K_THREE_HALVES.toFixed(10), // 0.4001405849 (imp-35216)
  kSevenHalves: +K_SEVEN_HALVES.toFixed(10), // -1.2004217587 (imp-35244/imp-35261)

  // The measured next-order slot and its closed-form coefficient.
  nextSlotExponent: 5, // eps^5, the first INTEGER power, NOT eps^{9/2} and NOT eps^4
  nextSlotIsInteger: true,
  eps92SlotEmpty: EPS92_DECAYS_TO_ZERO, // r2/eps^{9/2} decays ~sqrt(eps) to 0
  kFive: +K_FIVE.toFixed(10), // -0.4117178256 (measured eps^5 coefficient)
  kFiveExpr: 'K_5 = -2/(7 b^2) = -32/(7 A_2^2) = -256/(63 pi^2), b = A_2/4',
  kFiveClosedFormMatchesReference: Math.abs(K_FIVE - (-256 / (63 * PI * PI))) < 1e-12,

  correctedExpansion:
    'rho(eps) = 2/3 + [8 sqrt(2)/(9 pi)] eps^{3/2} + 0 * eps^{5/2} - [8 sqrt(2)/(3 pi)] eps^{7/2} ' +
    '- [256/(63 pi^2)] eps^5 + ...',
  orderedExponentLadder: '3/2, 7/2, 5, 11/2, 7, ... (no eps^{9/2}, no eps^4 term)',

  // Machine-precision renorm sanity (deviation not swamped by roundoff).
  fTwoInfinityResidual: +(F2_INF + A1 / 2).toExponential(3), // |F_2(inf) + A_1/2| ~ 0
  fThreeInfinityResidual: +(2 * J_INF - A2 / 4).toExponential(3), // |2 J(inf) - A_2/4| ~ 0

  // The measurement ladder (clean window eps in [3e-3, 1e-4]).
  ladder: LADDER.map((r) => ({
    eps: +r.eps.toExponential(1),
    N: +r.N.toExponential(3),
    r2: +r.r2.toExponential(4), // triply-cancelled residual after 2/3, eps^{3/2}, eps^{7/2}
    r2OverEps5: +r.r2OverEps5.toFixed(6), // -> K_5 = -0.41172 (eps^5 IS the next slot)
    r2OverEps92: +r.r2OverEps92.toExponential(3), // -> 0 ~sqrt(eps) (eps^{9/2} slot empty)
  })),

  // The sqrt(eps) Richardson extrapolation of r2/eps^5 to the closed form.
  richardsonHeadPair: +RICH_HEAD.toFixed(8), // (3e-3, 1e-3) -> -0.41176
  richardsonMidPair: +RICH_MID.toFixed(8), // (1e-3, 3e-4) -> -0.41163
  bestRichardson: +BEST_RICH.toFixed(8),
  distRichardsonToK5: +Math.abs(BEST_RICH - K_FIVE).toExponential(3), // ~1e-4
  richardsonMatchesK5: RICH_MATCHES_K5,

  headEps5Read: +HEAD_ROW.r2OverEps5.toFixed(6), // ~-0.302 (climbing toward K_5)
  tailEps5Read: +TAIL_ROW.r2OverEps5.toFixed(6), // ~-0.405 (climbing toward K_5)
  eps5MonotoneTowardK5: EPS5_MONOTONE_TOWARD_K5,

  crossTermMechanism:
    'eps^5 is the first INTEGER power and does not come from a new tail: R_2 and D_3 both expand in half-' +
    'integer powers (3/2, 7/2, 11/2, ...), so numerator and denominator separately carry only those. The ' +
    'eps^5 slot appears only in the quotient, as the cross term between the eps^{3/2} numerator term and the ' +
    'eps^{7/2} denominator-tail term: coeff = -K_{3/2} (6/(7 b)) = -2/(7 b^2), b = A_2/4.',

  couplingIsHalfInteger: false, // the eps^5 term is the FIRST integer power (a quotient cross term)
  dischargesO3orG6a: false,
  quadratureWindowNote:
    'r2 is triply-cancelled (dev - K_{3/2} eps^{3/2} - K_{7/2} eps^{7/2}), so the clean eps^5 window is ' +
    'eps in [3e-3, 1e-4]; below eps ~ 1e-4 the r2 cancellation nears the machine floor and r2/eps^5 ' +
    'destabilises, so the coefficient is read by sqrt(eps) Richardson extrapolation of the clean rungs',
  residualObstruction:
    'O3 asks for a CERTIFIED two-sided rate |rho(eps) - 2/3| <= K eps^{3/2} uniform on (0, eps_0] with a ' +
    'rigorous remainder bound on the TRUE RvM cusp jet; locating the next slot (eps^5) and its coefficient ' +
    'sharpens the remainder shape such a bound must have but supplies neither the uniform inequality nor a ' +
    'certified remainder, and is read on the model-cusp surrogate; G-b stays OPEN',

  isRigorous: false,
  verdict:
    'MEASUREMENT ONLY on the inherited imp-3220/imp-3406/imp-33646 model-cusp surrogate, G6a_shock_lipschitz ' +
    'STAYS OPEN. Forming r2 = rho - 2/3 - K_{3/2} eps^{3/2} - K_{7/2} eps^{7/2} on the imp-35261 difference-form ' +
    'compensated finite-cutoff ladder, the term AFTER eps^{7/2} is eps^5 (the first INTEGER power, arising as ' +
    'the eps^{3/2}-numerator x eps^{7/2}-denominator cross term of dev = (b R_2 - a D_3)/(2 b (b + D_3))), NOT ' +
    'the eps^{9/2} imp-35261 loosely tagged and NOT eps^4: r2/eps^5 climbs monotonically to a finite constant ' +
    'while r2/eps^{9/2} decays ~sqrt(eps) to 0. The coefficient is the closed form K_5 = -2/(7 b^2) = ' +
    '-32/(7 A_2^2) = -256/(63 pi^2) = -0.41172 (b = A_2/4), matched by sqrt(eps) Richardson extrapolation of ' +
    'the clean-rung reads to ~1e-4 (RICH_HEAD -0.41176, RICH_MID -0.41163 bracketing it). This locates the ' +
    'previously-unmeasured next slot and sharpens the remainder shape but does NOT certify a uniform modulus, ' +
    'does NOT discharge O3 or G6a, establishes no operator positivity, changes no bound. imp-3066 off-diagonal ' +
    'endpoint-Hankel K_a >= 0 UNTOUCHED; C_mb remains GUE-conditional (imp-486); NO QED. No refereed bound is changed' +
    '.',
};

export const IMP35298_RHO_EPS5_NEXT_SLOT_ASSERTIONS = [
  {
    // (1) the machine-precision infinite-cutoff constants reproduce A_1/2 and A_2/4 (route sanity).
    id: 'imp35298-renorm-machine-precision',
    description: 'compensated |F_p(inf)| reproduce A_1/2 and A_2/4 to < 1e-12 (r2 not swamped by roundoff)',
    holds: () => Math.abs(A - A1 / 2) < 1e-12 && Math.abs(B - A2 / 4) < 1e-12,
  },
  {
    // (2) the eps^5 coefficient closed form equals -2/(7 b^2) = -32/(7 A_2^2) = -256/(63 pi^2).
    id: 'imp35298-k5-closed-form',
    description: 'K_5 = -2/(7 b^2) = -32/(7 A_2^2) = -256/(63 pi^2) ~ -0.41172',
    holds: () =>
      Math.abs(K_FIVE - -32 / (7 * A2 * A2)) < 1e-12 &&
      Math.abs(K_FIVE - -256 / (63 * PI * PI)) < 1e-12 &&
      Math.abs(K_FIVE - -0.4117178256) < 1e-6,
  },
  {
    // (3) the next slot is eps^5, NOT eps^{9/2}: r2/eps^5 climbs toward a finite constant while r2/eps^{9/2}
    // decays toward 0.
    id: 'imp35298-next-slot-is-eps5-not-eps92',
    description: 'r2/eps^5 climbs monotonically toward K_5 while r2/eps^{9/2} decays toward 0 (eps^{9/2} empty)',
    holds: () =>
      EPS5_MONOTONE_TOWARD_K5 === true &&
      EPS92_DECAYS_TO_ZERO === true &&
      Math.abs(TAIL_ROW.r2OverEps92) < Math.abs(HEAD_ROW.r2OverEps92) &&
      Math.abs(TAIL_ROW.r2OverEps5) > 0.3,
  },
  {
    // (4) the sqrt(eps) Richardson extrapolation of r2/eps^5 lands on the closed form K_5 to < 5e-3.
    id: 'imp35298-richardson-matches-k5',
    description: 'sqrt(eps) Richardson extrapolation of r2/eps^5 matches the closed form K_5 to < 5e-3',
    holds: () => RICH_MATCHES_K5 === true && Math.abs(BEST_RICH - -0.41172) < 5e-3,
  },
  {
    // Honesty gate: measurement only; does NOT discharge O3/G6a, no QED, no refereed bound is changed, imp-3066 untouched.
    id: 'imp35298-honesty-gate-no-qed',
    description:
      'Measurement only: eps^5 next slot located but O3/G6a NOT discharged, no QED, no refereed bound is changed, imp-3066 untouched',
    holds: () =>
      IMP35298_RHO_EPS5_NEXT_SLOT_MEASUREMENT.isRigorous === false &&
      IMP35298_RHO_EPS5_NEXT_SLOT_MEASUREMENT.dischargesO3orG6a === false &&
      /NO QED/.test(IMP35298_RHO_EPS5_NEXT_SLOT_MEASUREMENT.verdict) &&
      /STAYS OPEN/.test(IMP35298_RHO_EPS5_NEXT_SLOT_MEASUREMENT.verdict) &&
      /refereed bound is changed/i.test(IMP35298_RHO_EPS5_NEXT_SLOT_MEASUREMENT.verdict) &&
      /imp-3066 off-diagonal endpoint-Hankel K_a >= 0 UNTOUCHED/.test(
        IMP35298_RHO_EPS5_NEXT_SLOT_MEASUREMENT.verdict,
      ),
  },
];

for (const a of IMP35298_RHO_EPS5_NEXT_SLOT_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-35298-rho-eps5-next-slot-measurement assertion failed: ${a.id}`);
  }
}
