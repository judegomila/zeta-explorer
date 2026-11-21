/**
 * @module imp-34752-krawczyk-outward-ulp-slack-N
 *
 * imp-34752 (numerical, frontier): imp-34726 measured the outward-ULP budget k* of the imp-34714
 * Krawczyk certificate -- the largest relative widening k*eps*|value| under which (H1) 0 not in
 * [f_prime] and (H2) N([T]) subset int([T]) both survive -- but only at a SINGLE N = 1e9 on one
 * a-priori bracket (k* ~ 4.2512e11 ULP, ~11 orders over few-ULP directed rounding). This module
 * ASSESSES whether comparable slack holds ELSEWHERE by recomputing the (H1)-(H2) margins and the
 * binding-inclusion k* at the imp-3444 E_coll = E_trunc crossover N ~ 3.28e9 and a few neighboring
 * brackets, and TABULATES k*(N). Measurement only; double-precision surrogate for the imp-34687a
 * directed-rounding layer; this does NOT close the imp-34714a machine certificate. NO QED.
 *
 * SETUP (same f, derivative, and outward-ULP surrogate as imp-34726/imp-34732)
 * ---------------------------------------------------------------------------
 * f(T) = (T/2pi)(log(T/2pi) - 1) - N on T > 2pi, f_prime(T) = log(T/2pi)/2pi (increasing, so its
 * range on an interval is the endpoint values). For each N the root T0(N) = effectiveHeightForN(N)
 * (RvM inverse) is enclosed by a bracket of FIXED relative half-width delta = 2e-4 centred at T0:
 * [T_lo, T_hi] = [T0(1 - delta), T0(1 + delta)], m = T0 (same construction as the imp-34732 sweep).
 * The outward-ULP surrogate widens every computed real v to [v - k*eps*|v|, v + k*eps*|v|],
 * eps = 2^-52, and composes the interval-Newton image N([T]) = m - f(m)/[f_prime] under that rule;
 * k*(N) is the largest k for which (H1) and (H2 strict) both survive (bisection, as in imp-34726).
 *
 * WHAT IS MEASURED (ladder N = 1e9, 2e9, 3.28e9, 5e9, 1e10 spanning the imp-3444 crossover)
 * ----------------------------------------------------------------------------------------
 *  (1) k*(N): the largest surviving outward-ULP budget at each bracket.
 *  (2) The nominal (k = 0) strict-inclusion margins N_lo - T_lo and T_hi - N_hi (both grow ~ delta*T0).
 *  (3) Whether (H1) still holds at the break and BOTH inclusions fail just past it (m = T0 centres the
 *      one-step image, so the symmetric bracket loses the lower and upper inclusions together at k*).
 *
 * RESULT (double-precision surrogate for the exact evaluations; see imp-34714a)
 * ----------------------------------------------------------------------------
 * Across N = 1e9 .. 1e10 (including the imp-3444 crossover N ~ 3.28e9):
 *   T0(N):      3.718702e8, 7.159801e8, 1.143688e9, 1.705598e9, 3.293532e9
 *   margin_lo:  7.4374e4,   1.4320e5,   2.2874e5,   3.4112e5,   6.5871e5   (grow linearly in T0)
 *   k*(N):      4.5034e11,  4.5034e11,  4.5034e11,  4.5034e11,  4.5034e11  (N-INDEPENDENT)
 * k*(N) is ESSENTIALLY CONSTANT at ~4.5034e11 ULP (relative widening ~1.0e-4 = delta/2) across the
 * whole ladder, even as the absolute inclusion margins grow ~9x from 7.4e4 to 6.6e5. The reason is
 * scale invariance: both the a-priori margin (~ delta*T0) and the outward-ULP widening (~ k*eps*T0)
 * are proportional to |value|, so the break condition 2*k*eps ~ delta (two compounded outward
 * widenings: midpoint + subtraction) fixes k* ~ delta/(2 eps) independently of N. (H1) survives at
 * every break; the symmetric bracket loses both inclusions together just past k*.
 *
 * INTERPRETATION -- SLACK IS UNIFORM, NOT A CERTIFICATE
 * ----------------------------------------------------
 * YES: the ~11-orders-of-magnitude outward-ULP slack imp-34726 found at N = 1e9 is NOT special to that
 * bracket -- it holds essentially unchanged at the imp-3444 crossover N ~ 3.28e9 and its neighbors, with
 * k* ~ delta/(2 eps) ~ 4.5e11 ULP at every rung. This is EVIDENCE that a real directed-rounding
 * instantiation would preserve (H1)-(H2) across the crossover neighborhood, NOT a proof: the k*eps model
 * is a surrogate for the imp-34687a layer, not that layer. The machine certificate (imp-34714a) REMAINS
 * OPEN -- it still needs the actual outward-rounded arithmetic to guarantee the computed f(m) and
 * [f_prime] endpoints ARE valid enclosures; this module only shows the target margins have uniform room
 * to spare across N once that guarantee exists.
 *
 * MEASUREMENT ONLY. This tabulates the roundoff slack of the interval-Newton solver for the inherited
 * imp-3220/imp-3406 surrogate crossover map across N, NOT a rigorous asymptotic and NOT an RH bound.
 * C_C = (1/8) sqrt(3 pi) 1/8 ansatz (imp-2642/imp-2643) UNTOUCHED; C_mb GUE-conditional per imp-486
 * UNTOUCHED; imp-3066 K_a >= 0 untouched; changes no bound; establishes no operator positivity; no RH
 * verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-34726-krawczyk-outward-ulp-slack (the single-N = 1e9 outward-ULP slack; sub-gap imp-34714a)
 * @see imp-34732-krawczyk-rho-sweep-N (the fixed-delta bracket construction swept across N)
 * @see imp-34714-krawczyk-existence-uniqueness-lemma (the exact lemma; named sub-gap imp-34714a)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 Riemann-von Mangoldt inverse, Newton solver)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';

const TWO_PI = 2 * Math.PI;
const EPS = Number.EPSILON; // 2^-52

// Same f, derivative, and FIXED relative bracket half-width as imp-34732 (delta ~ 2.0e-4).
const fPrime = (T) => Math.log(T / TWO_PI) / TWO_PI;
const DELTA = 2e-4;

// Ladder spanning the imp-3444 E_coll = E_trunc crossover N ~ 3.28e9 and neighboring a-priori brackets.
const N_LADDER = [1e9, 2e9, 3.28e9, 5e9, 1e10];

// One outward-ULP slack measurement at a given N: bracket [T0(1-delta), T0(1+delta)], m = T0.
function slackAtN(N) {
  const T0 = effectiveHeightForN(N); // RvM inverse root
  const f = (T) => (T / TWO_PI) * (Math.log(T / TWO_PI) - 1) - N;
  const M = T0; // centre the fixed-delta bracket at the root
  const T_LO = M * (1 - DELTA);
  const T_HI = M * (1 + DELTA);
  const FP_LO = fPrime(T_LO);
  const FP_HI = fPrime(T_HI);
  const F_M = f(M); // residual at the root (tiny; the RvM Newton solver stops at ~1e-9*T relative)

  // Nominal (k = 0) interval-Newton image N([T]) = m - f(m)/[f_prime]. f(m) is tiny and may be either
  // sign, so enclose the quotient over the four endpoint ratios (outward), then N = m - q.
  function quotientRange(fmLo, fmHi, fpLo, fpHi) {
    const cands = [fmLo / fpLo, fmLo / fpHi, fmHi / fpLo, fmHi / fpHi];
    return { qLo: Math.min(...cands), qHi: Math.max(...cands) };
  }
  const { qLo: Q_LO_NOM, qHi: Q_HI_NOM } = quotientRange(F_M, F_M, FP_LO, FP_HI);
  const N_LO_NOM = M - Q_HI_NOM;
  const N_HI_NOM = M - Q_LO_NOM;
  const MARGIN_LO_NOM = N_LO_NOM - T_LO;
  const MARGIN_HI_NOM = T_HI - N_HI_NOM;

  // Outward-ULP surrogate: widen each computed endpoint by k*eps*|value|; check (H1) and (H2 strict).
  function check(k) {
    const w = k * EPS;
    const fpLo = FP_LO - w * Math.abs(FP_LO);
    const fpHi = FP_HI + w * Math.abs(FP_HI);
    const fmLo = F_M - w * Math.abs(F_M);
    const fmHi = F_M + w * Math.abs(F_M);
    const mLo = M - w * Math.abs(M);
    const mHi = M + w * Math.abs(M);
    let { qLo, qHi } = quotientRange(fmLo, fmHi, fpLo, fpHi);
    qLo = qLo - w * Math.abs(qLo); // widen the quotient result outward
    qHi = qHi + w * Math.abs(qHi);
    let nLo = mLo - qHi; // widen the subtraction result outward
    nLo = nLo - w * Math.abs(nLo);
    let nHi = mHi - qLo;
    nHi = nHi + w * Math.abs(nHi);
    const H1 = fpLo > 0; // 0 not in [f_prime]
    const H2 = nLo > T_LO && nHi < T_HI; // N([T]) subset int([T]) (strict)
    return { H1, H2, nLo, nHi, marginLo: nLo - T_LO, marginHi: T_HI - nHi };
  }

  // Largest surviving outward-ULP budget k*: double then bisect between good and bad.
  function largestSurvivingK() {
    let good = 1;
    let bad = 1;
    while (bad < 1e18) {
      const c = check(bad);
      if (c.H1 && c.H2) {
        good = bad;
        bad *= 2;
      } else {
        break;
      }
    }
    for (let i = 0; i < 200; i++) {
      const mid = 0.5 * (good + bad);
      const c = check(mid);
      if (c.H1 && c.H2) good = mid;
      else bad = mid;
    }
    return good;
  }

  const K_STAR = largestSurvivingK();
  const U = Math.log(M / TWO_PI);
  return {
    N,
    T0,
    U,
    fM: F_M,
    marginLoNom: MARGIN_LO_NOM,
    marginHiNom: MARGIN_HI_NOM,
    kStar: K_STAR,
    kRel: K_STAR * EPS,
    atBreak: check(K_STAR),
    past: check(K_STAR * 1.001),
  };
}

const SWEEP = N_LADDER.map(slackAtN);

// (1) k*(N) is essentially N-independent: relative spread across the ladder is tiny.
const K_STARS = SWEEP.map((r) => r.kStar);
const K_MAX = Math.max(...K_STARS);
const K_MIN = Math.min(...K_STARS);
const K_REL_SPREAD = (K_MAX - K_MIN) / K_MIN; // ~0 if k* does not depend on N

// (2) absolute margins grow ~ delta*T0 while k* stays flat -> scale invariance.
let MARGINS_MONOTONE_INCREASE = true;
for (let i = 1; i < SWEEP.length; i++) {
  if (!(SWEEP[i].marginLoNom > SWEEP[i - 1].marginLoNom)) MARGINS_MONOTONE_INCREASE = false;
}

// index of the imp-3444 crossover rung N ~ 3.28e9 (third entry) and the imp-34726 continuity rung N=1e9.
const CROSSOVER = SWEEP[2]; // N ~ 3.28e9
const RUNG_1E9 = SWEEP[0]; // matches the imp-34726 single-N order (~4.25e11)
const SLACK_ORDERS = Math.log10(CROSSOVER.kStar / 4); // ULP-budget slack over a real few-ULP layer (~11)

export const IMP34752_KRAWCZYK_OUTWARD_ULP_SLACK_N = {
  id: 'imp-34752',
  proofSection: 'S-frontier',
  question:
    'imp-34726 measured the outward-ULP budget k* of the imp-34714 Krawczyk certificate (largest k for ' +
    'which (H1) 0 not in [f_prime] and (H2) N([T]) subset int([T]) survive under widening k*eps*|value|) ' +
    'but only at ONE N = 1e9 bracket (k* ~ 4.2512e11). Recompute the (H1)-(H2) margins and the binding ' +
    'k* at the imp-3444 crossover N ~ 3.28e9 and a few neighboring a-priori brackets, and TABULATE k*(N). ' +
    'Assess whether comparable slack holds beyond N = 1e9; double-precision surrogate for the imp-34687a ' +
    'directed-rounding layer; do NOT claim the machine certificate is closed. NO QED.',
  model: {
    setup:
      'For each N, T0(N) = effectiveHeightForN(N) is bracketed at FIXED relative half-width delta = 2e-4: ' +
      '[T_lo, T_hi] = [T0(1 - delta), T0(1 + delta)], m = T0 (the imp-34732 construction). Every computed ' +
      'real v -> outward enclosure [v - k*eps*|v|, v + k*eps*|v|], eps = 2^-52; the Krawczyk evaluation ' +
      '(f(m), [f_prime] endpoints, quotient, midpoint, subtraction) composed under this rule gives a ' +
      'k-parameterized enclosure of N([T]); k*(N) is the largest k for which (H1) and (H2 strict) hold.',
    scale_invariance:
      'Both the a-priori margin (~ delta*T0) and the outward-ULP widening (~ k*eps*T0) scale with |value|, ' +
      'so the break condition 2*k*eps ~ delta (two compounded outward widenings: midpoint + subtraction) ' +
      'fixes k* ~ delta/(2 eps) INDEPENDENTLY of N. m = T0 centres the one-step image, so the symmetric ' +
      'bracket loses the lower and upper inclusions together at k*.',
  },
  measurement: {
    // Double-precision surrogate for the exact evaluations; certifies nothing (see imp-34714a).
    delta: +DELTA.toExponential(1),
    N_ladder: N_LADDER.map((N) => +N.toExponential(2)),
    crossover_N: +CROSSOVER.N.toExponential(2), // 3.28e9 (imp-3444 E_coll = E_trunc)
    T0: SWEEP.map((r) => +r.T0.toExponential(6)), // 3.718702e8 .. 3.293532e9
    U: SWEEP.map((r) => +r.U.toFixed(4)),
    margin_lo_nominal: SWEEP.map((r) => +r.marginLoNom.toExponential(4)), // 7.4374e4 .. 6.5871e5 (grow ~ delta*T0)
    margin_hi_nominal: SWEEP.map((r) => +r.marginHiNom.toExponential(4)),
    k_star: SWEEP.map((r) => +r.kStar.toExponential(4)), // ~4.5034e11 at EVERY rung
    k_star_relative: SWEEP.map((r) => +r.kRel.toExponential(4)), // ~1.0e-4 = delta/2
    k_star_relative_spread: +K_REL_SPREAD.toExponential(4), // ~0 -> k* is N-independent
    margins_strict_monotone_increase: MARGINS_MONOTONE_INCREASE, // absolute margins grow while k* stays flat
    H1_survives_at_break_all: SWEEP.every((r) => r.atBreak.H1),
    both_inclusions_fail_past_break_all: SWEEP.every((r) => !r.past.H2 && r.past.marginLo <= 0 && r.past.marginHi <= 0),
    k_star_at_crossover: +CROSSOVER.kStar.toExponential(4), // ~4.5034e11 at N ~ 3.28e9
    k_star_at_N_1e9: +RUNG_1E9.kStar.toExponential(4), // ~4.5034e11 (imp-34726 continuity)
    slack_orders_over_few_ulp: +SLACK_ORDERS.toFixed(2), // ~11.05 (log10 of k-star over 4)
  },
  finding:
    'Sweeping N = 1e9, 2e9, 3.28e9, 5e9, 1e10 (spanning the imp-3444 crossover N ~ 3.28e9) at fixed ' +
    'delta = 2e-4, the largest surviving outward-ULP budget k*(N) is ESSENTIALLY CONSTANT at ~4.5034e11 ' +
    'ULP (relative widening ~1.0e-4 = delta/2) at EVERY rung -- the relative spread across the ladder is ' +
    '~0. Meanwhile the nominal strict-inclusion margins grow ~9x with the root (N_lo - T_lo climbs ' +
    '7.4374e4 -> 6.5871e5, tracking delta*T0). k* is N-independent by scale invariance: both the margin ' +
    'and the outward widening scale with |value|, so the break condition 2*k*eps ~ delta fixes ' +
    'k* ~ delta/(2 eps). (H1) survives at every break and the symmetric bracket loses both inclusions ' +
    'together just past k*. So the ~11 orders of ULP-budget slack imp-34726 found at N = 1e9 is NOT ' +
    'special to that bracket -- it holds unchanged at the imp-3444 crossover N ~ 3.28e9 and its neighbors.',
  subGap:
    'imp-34714a REMAINS OPEN. This module ASSESSES slack with a k*eps surrogate for the directed-rounding ' +
    'layer across N; it does NOT instantiate that layer. The uniform ~4.5034e11-ULP budget is EVIDENCE that ' +
    'a real outward-rounded arithmetic would preserve (H1)-(H2) across the crossover neighborhood, not a ' +
    'proof: the machine certificate still needs the imp-34687a error-bounded arithmetic to guarantee the ' +
    'computed f(m) and [f_prime] endpoints ARE valid enclosures. Adds no RH bound.',
  isRigorous: false,
  verdict:
    'OUTWARD-ULP SLACK SWEEP (frontier, NOT an RH bound). The imp-34726 outward-ULP budget k* ~ 4.25e11 ' +
    'ULP, measured at the SINGLE N = 1e9 bracket, is CONFIRMED and EXTENDED across N = 1e9, 2e9, 3.28e9, ' +
    '5e9, 1e10 -- spanning the imp-3444 E_coll = E_trunc crossover N ~ 3.28e9. At fixed relative half-width ' +
    'delta = 2e-4 (bracket m = T0(N)), k*(N) is ESSENTIALLY CONSTANT at ~4.5034e11 ULP (relative widening ' +
    '~1.0e-4 = delta/2) at EVERY rung, with relative spread ~0, even as the absolute strict-inclusion ' +
    'margins grow ~9x (7.4374e4 -> 6.5871e5, tracking delta*T0). k* is N-INDEPENDENT by scale invariance: ' +
    'margin ~ delta*T0 and widening ~ k*eps*T0 both scale with |value|, so the break condition ' +
    '2*k*eps ~ delta (midpoint + subtraction compounded) fixes k* ~ delta/(2 eps). (H1) survives at every ' +
    'break; the symmetric bracket loses both inclusions together just past k*. INTERPRETATION: YES the ' +
    '~11 orders of ULP-budget slack is uniform across the crossover neighborhood, not special to N = 1e9; ' +
    'this is EVIDENCE a real directed-rounding instantiation would preserve (H1)-(H2) there, NOT a machine ' +
    'certificate. SUB-GAP imp-34714a REMAINS OPEN: the k*eps model is a surrogate for the imp-34687a ' +
    'directed-rounding layer, not that layer. Measurement only for the inherited imp-3220/imp-3406 ' +
    'surrogate crossover map; the C_C 1/8 ansatz (imp-2642/imp-2643) and C_mb GUE-conditional per imp-486 ' +
    'are UNTOUCHED; imp-3066 K_a >= 0 untouched; changes no bound; establishes no operator positivity; no ' +
    'RH verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-34726 (outward-ULP slack of the N = 1e9 certificate; sub-gap imp-34714a); ' +
    'imp-34732 (fixed-delta bracket construction swept across N); ' +
    'imp-34714 (Krawczyk existence-uniqueness lemma; sub-gap imp-34714a double-precision surrogate); ' +
    'imp-34687 (crossover interval-arithmetic scope; sub-gap imp-34687a directed-rounding layer); ' +
    'imp-3444 (E_coll = E_trunc crossover N ~ 3.28e9); imp-2642 (C_C 1/8 ansatz); lambda-rh-height-mapping ' +
    '(effectiveHeightForN, Newton inverse of the Riemann-von Mangoldt count). Outward-rounded interval ' +
    'arithmetic: Moore, Neumaier (standard IA theory).',
};

export const IMP34752_KRAWCZYK_OUTWARD_ULP_SLACK_N_ASSERTIONS = [
  {
    // k*(N) is essentially N-independent across the ladder (uniform ~4.5e11 ULP budget).
    id: 'imp34752-k-star-N-independent',
    description: 'k*(N) ~ 4.5034e11 ULP at every rung; relative spread across N = 1e9 .. 1e10 is ~0',
    holds: () =>
      K_REL_SPREAD < 1e-6 &&
      K_MIN > 1e11 &&
      K_MAX < 1e12,
  },
  {
    // Absolute strict-inclusion margins grow with T0 while k* stays flat -> scale invariance.
    id: 'imp34752-margins-grow-k-star-flat',
    description: 'nominal margins grow ~ delta*T0 (monotone increasing) while the ULP budget k* stays flat',
    holds: () =>
      MARGINS_MONOTONE_INCREASE &&
      SWEEP[SWEEP.length - 1].marginLoNom > 5 * SWEEP[0].marginLoNom && // ~9x growth end to end
      K_REL_SPREAD < 1e-6, // yet k* is unchanged
  },
  {
    // At every bracket (H1) survives the break and BOTH inclusions fail just past it (m = T0 centres image).
    id: 'imp34752-break-structure',
    description: 'H1 holds at each k*; both strict inclusions fail just past k* on the symmetric bracket',
    holds: () =>
      SWEEP.every((r) => r.atBreak.H1 && r.atBreak.H2) &&
      SWEEP.every((r) => r.past.H1 && !r.past.H2 && r.past.marginLo <= 0 && r.past.marginHi <= 0),
  },
  {
    // The imp-3444 crossover rung and the N=1e9 rung both carry the imp-34726 order of slack (~11 orders).
    id: 'imp34752-crossover-matches-imp34726',
    description: 'k* at N ~ 3.28e9 and at N = 1e9 both ~4.5e11 ULP; slack over few-ULP >= 8 orders',
    holds: () =>
      CROSSOVER.kStar > 1e11 &&
      RUNG_1E9.kStar > 1e11 &&
      Math.abs(CROSSOVER.kStar - RUNG_1E9.kStar) / RUNG_1E9.kStar < 1e-6 &&
      SLACK_ORDERS >= 8,
  },
  {
    // Honesty gate: slack assessment / surrogate, not rigorous, sub-gap open, no QED, no refereed bound is changed.
    id: 'imp34752-honesty-gate-no-qed',
    description: 'Surrogate sweep: isRigorous false, imp-34714a open, no QED, no refereed bound is changed',
    holds: () =>
      IMP34752_KRAWCZYK_OUTWARD_ULP_SLACK_N.isRigorous === false &&
      /imp-34714a/.test(IMP34752_KRAWCZYK_OUTWARD_ULP_SLACK_N.subGap) &&
      /REMAINS OPEN/.test(IMP34752_KRAWCZYK_OUTWARD_ULP_SLACK_N.subGap) &&
      /NO QED/.test(IMP34752_KRAWCZYK_OUTWARD_ULP_SLACK_N.verdict) &&
      /refereed bound is changed/i.test(IMP34752_KRAWCZYK_OUTWARD_ULP_SLACK_N.verdict),
  },
];

for (const a of IMP34752_KRAWCZYK_OUTWARD_ULP_SLACK_N_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-34752-krawczyk-outward-ulp-slack-N assertion failed: ${a.id}`);
  }
}
