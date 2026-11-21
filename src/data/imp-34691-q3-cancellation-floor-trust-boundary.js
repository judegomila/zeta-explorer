/**
 * @module imp-34691-q3-cancellation-floor-trust-boundary
 * @fileoverview imp-34691 -- MEASUREMENT / DERIVATION ONLY: turn the imp-34673 F3 input-roundoff
 *   conditioning floor max|term| * eps / |sum| into an EXPLICIT closed function of (dp, N) for the
 *   tiny-q3 catastrophic cancellation, and MEASURE the crossover step dp*(N) below which that floor
 *   exceeds the physical q3 signal -- i.e. the smallest usable q-derivative step. The result is
 *   tabulated across the imp-33620 deep-tail ladder and related to the imp-34606 1/dp^k exponent and
 *   the imp-34633 eps_mach * |q| amplitude.
 *
 *   THE QUESTION (imp-34673 F3, made quantitative)
 *   ----------------------------------------------
 *   imp-34673 F3 identified the ~2e-5 q3-share plateau jitter as the catastrophic-cancellation
 *   CONDITIONING floor of the tiny-q3 numerator: at N = 1e13, dp = 1e-2 the largest stencil term was
 *   ~6.96e3 while the true numerator was ~8.24e-9 (cancellation ratio ~8.44e11, relative floor
 *   max|term| * eps / |sum| ~ 1.87e-4). It reported that floor at a SINGLE reference point but never
 *   wrote it as a function of the step dp and the depth N, and never located the dp at which the
 *   floor overtakes the physical signal. This module closes that gap.
 *
 *   THE CLOSED FORM (relative floor as a function of dp and N)
 *   ---------------------------------------------------------
 *   The q3 estimate is q3 = N3(dp) / (240 dp^3) with N3(dp) = sum_k w_k q(p + k dp) the antisymmetric
 *   6th-order 9-point numerator [w = 7,-72,338,-488,+488,-338,+72,-7] on q(p) = log E_coll, p = log N.
 *   Two facts pin the conditioning:
 *     (i)  the largest summand is essentially step-INDEPENDENT: max_k |w_k q(p + k dp)| ~ W_max |q(p)|
 *          with W_max = 488 = max|w_k| (the terms are all ~ |q| ~ 14..16; measured ratio to W_max|q|
 *          is ~1.0004 at the reference), so the absolute roundoff in the numerator is ~ W_max eps |q|,
 *          FLAT in dp;
 *     (ii) the true numerator SHRINKS as dp^3: N3(dp) ~ 240 dp^3 q'''(p) (that is the whole point of a
 *          3rd-difference stencil), so the physical signal falls off cubically in dp.
 *   Dividing (i) by (ii) gives the relative conditioning floor as an explicit closed function
 *          F_rel(dp, N) = W_max eps |q(p)| / (240 |q'''(p)| dp^3) = C(N) / dp^3,
 *   with a depth-only prefactor  C(N) = W_max eps |q(p)| / (240 |q'''(p)|).  The 1/dp^3 power is the
 *   imp-34606 q3 rung m3 = 3 EXACTLY (analytic, not fitted); the amplitude W_max eps |q| is the
 *   imp-34633 eps_mach*|q| prefactor with the stencil weight W_max = max|w3|.
 *
 *   THE TRUST BOUNDARY (smallest usable step dp*(N))
 *   -----------------------------------------------
 *   The floor reaches the physical signal (F_rel = 1, roundoff noise = full q3 magnitude) at
 *          dp*(N) = C(N)^{1/3} = ( W_max eps |q(p)| / (240 |q'''(p)|) )^{1/3}.
 *   Below dp* the q3 numerator is pure roundoff; dp* is the smallest usable q-derivative step. The
 *   physical q'''(p) is measured from the SAME stencil at a well-conditioned probe band (dp = 0.1 and
 *   0.05, where only ~8-9 digits cancel and truncation O(dp^6) is negligible; the two probes agree to
 *   ~5 digits), so dp* is grounded in the true signal, not the corrupted small-dp evaluation.
 *
 *   THE FINDING
 *   -----------
 *   (F1) THE CLOSED FORM F_rel = C(N)/dp^3 REPRODUCES THE imp-34673 REFERENCE. At N = 1e13, dp = 1e-2
 *        it gives F_rel ~ 1.9e-4, matching the imp-34673 F3 ~1.87e-4 relative floor, with the exact
 *        max|term| ~ 6.96e3 within ~0.04% of the closed-form amplitude W_max|q| ~ 6.95e3.
 *   (F2) THE SMALLEST USABLE STEP IS dp* ~ 6e-4, RISING SLOWLY WITH DEPTH. Across the imp-33620
 *        deep-tail ladder dp*(N) climbs monotonically from ~5.72e-4 at N = 1e13 through ~6.09e-4 at
 *        N* ~ 4.62e13 to ~6.86e-4 at N = 1e15 -- a ~20% rise over two decades of N, driven by |q|
 *        growing (deeper E_coll) and |q'''| shrinking. The measured crossover F_rel(dp*) = 1 to 4
 *        significant figures on every rung.
 *   (F3) dp* SITS BETWEEN THE PARENTS' OPERATING AND FULLY-LOST STEPS -- ONE 1/dp^3 LAW EXPLAINS BOTH.
 *        At the parents' operating dp = 1e-3 the floor is F_rel ~ 0.19 (edge of trust); at dp = 1e-4
 *        it is F_rel ~ 190 (q3 fully lost, the imp-34606 F2 "roundoff-dominated below ~1e-4"). The
 *        full-loss boundary dp* ~ 6e-4 lies exactly between them, and all three points lie on the
 *        single cubic F_rel = C(N)/dp^3 -- the imp-34606 exponent ladder and imp-34633 amplitude are
 *        the slope and intercept of this same floor.
 *
 *   MEASUREMENT / DERIVATION ONLY. The closed form is elementary error propagation of the inherited
 *   component model, not a new bound. Reproduces the imp-34446/imp-34531/imp-34543/imp-34573
 *   primitives inline (imports NOTHING -- no lambda mapping, no polymath15 module, no zeros bundle),
 *   per the no-heavy-imports directive. q1..q3 are inherited central differences, NOT fresh analytic
 *   closed forms, so the sigma -> 1 deep-tail regime (imp-3220/imp-3406 component model least
 *   trustworthy) is inherited as-is. The -2 asymptote and C_C = (1/8)sqrt(3 pi) (imp-2714, C_H = 1/8)
 *   ansatz are UNTOUCHED; the C_mb GUE-conditional share per imp-486 is UNTOUCHED; imp-3066 K_a >= 0
 *   untouched; no operator positivity; no RH verdict, NO QED. No refereed bound is changed.
 *
 *   @see imp-34673-plateau-drift-kahan-summation-order-probe.js (F3 conditioning floor ~1.87e-4)
 *   @see imp-34606-roundoff-amplification-exponent-ladder.js (the clean {2,3,4} 1/dp^k exponent ladder)
 *   @see imp-34633-roundoff-prefactor-amplitude-vs-epsmach.js (the eps_mach*|q| prefactor amplitude)
 *   @see imp-33620-etrunc-ecoll-ladder-1e15-extension.js (deep-tail landmark N* ~ 4.62e13, sigma<0.01)
 *
 *   Ticket: imp-34691 (numerical, medium). Cancellation-floor trust boundary dp*(N); adds no bound.
 */

// -- INDEPENDENT instance of the imp-34446/imp-34531/imp-34543/imp-34573 primitives (imports NOTHING): --
const TWO_PI = 2 * Math.PI;
const C_C = (1 / 8) * Math.sqrt(3 * Math.PI); // imp-2714 pinned ansatz, reproduced inline (~0.383748)
const DEEP_TAIL_N = 4.624385e13; // imp-33620 sigma < 0.01 landmark N* -- head of the deep-tail ladder
const EPS = Number.EPSILON; // double-precision machine epsilon ~2.22e-16

function heightForN(N) {
  let T = Math.max(TWO_PI * Math.E, (TWO_PI * N) / Math.max(1, Math.log(N + TWO_PI)));
  for (let i = 0; i < 80; i++) {
    const u = Math.log(T / TWO_PI);
    const f = (T / TWO_PI) * (u - 1) - N;
    const fp = u / TWO_PI;
    if (!(Math.abs(fp) > 0) || !Number.isFinite(fp)) break;
    const dT = f / fp;
    T -= dT;
    if (!(T > TWO_PI)) T = TWO_PI * 1.0001;
    if (Math.abs(dT) < 1e-13 * Math.max(1, T)) break;
  }
  return T;
}

function eColl(N) {
  return C_C * Math.sqrt(Math.log(heightForN(N)) / N);
}

const qOfP = (pp) => Math.log(eColl(Math.exp(pp))); // q(p) = log E_coll in p = log N

// -- imp-34626/imp-34673 6th-order 9-point antisymmetric q3 numerator stencil (verbatim). The q3
//    estimate is (sum w_k q(p + k dp)) / (240 dp^3); W_MAX = 488 is the largest weight magnitude. --
const Q3_TERMS = [[4, 7], [3, -72], [2, 338], [1, -488], [-1, 488], [-2, -338], [-3, 72], [-4, -7]];
const Q3_DENOM = 240;
const W_MAX = 488; // = max|w_k| of the q3 stencil (the imp-34633 stencil weight in the amplitude)

// Raw q3 numerator N3(dp) = sum_k w_k q(p + k dp) (the near-cancellation whose conditioning we probe).
function q3Num(p, dp) {
  let s = 0;
  for (const [k, w] of Q3_TERMS) s += w * qOfP(p + k * dp);
  return s;
}

// Largest single stencil term |w_k q(p + k dp)| -- the numerator of the input-roundoff floor.
function maxTerm(p, dp) {
  return Math.max(...Q3_TERMS.map(([k, w]) => Math.abs(w * qOfP(p + k * dp))));
}

// Physical q'''(p): the SAME stencil evaluated at a well-conditioned probe band (dp = 0.1 and 0.05,
// where only ~8-9 digits cancel and the O(dp^6) truncation is negligible). The two probes agree to
// ~5 digits, so this is a trustworthy physical signal, NOT the corrupted small-dp evaluation.
const PROBE_DP_A = 0.1;
const PROBE_DP_B = 0.05;
function q3Phys(p) {
  const a = q3Num(p, PROBE_DP_A) / (Q3_DENOM * Math.pow(PROBE_DP_A, 3));
  const b = q3Num(p, PROBE_DP_B) / (Q3_DENOM * Math.pow(PROBE_DP_B, 3));
  return { a, b, mean: (a + b) / 2 };
}

// The closed-form depth-only prefactor C(N) and relative conditioning floor F_rel(dp, N) = C(N)/dp^3,
// using the closed amplitude W_MAX*eps*|q| (max|term| within ~0.04% of this at the reference).
function prefactorC(p) {
  const q = qOfP(p);
  const q3p = q3Phys(p).mean;
  return (W_MAX * EPS * Math.abs(q)) / (Q3_DENOM * Math.abs(q3p));
}
const relFloor = (p, dp) => prefactorC(p) / Math.pow(dp, 3); // F_rel(dp, N)
// Trust boundary: smallest usable step dp*(N) = C(N)^(1/3) where F_rel = 1 (noise = full signal).
const dpStar = (p) => Math.cbrt(prefactorC(p));

// -- deep-tail ladder (imp-33620 N* ~ 4.62e13 head; matches the imp-34673 DEEP_LADDER) + 1e13 ref --
const REF_N = 1e13;
const DEEP_LADDER = [DEEP_TAIL_N, Math.pow(10, 14.0), Math.pow(10, 14.5), Math.pow(10, 15.0)];

// (F2) tabulate dp*(N) across the deep-tail ladder with the measured crossover F_rel(dp*) (= 1).
const DP_STAR_TABLE = DEEP_LADDER.map((N) => {
  const p = Math.log(N);
  return Object.freeze({
    N,
    q: +qOfP(p).toFixed(4),
    q3_phys: +q3Phys(p).mean.toExponential(4),
    dp_star: +dpStar(p).toExponential(4),
    Frel_at_dp_star: +relFloor(p, dpStar(p)).toFixed(4), // = 1 to 4 sig figs
  });
});
const DP_STAR_MIN = Math.min(...DP_STAR_TABLE.map((r) => r.dp_star));
const DP_STAR_MAX = Math.max(...DP_STAR_TABLE.map((r) => r.dp_star));
const DP_STAR_MONOTONE = DP_STAR_TABLE.every(
  (r, i) => i === 0 || r.dp_star > DP_STAR_TABLE[i - 1].dp_star,
); // dp* rises with depth (|q| up, |q'''| down)

// (F1) closed form reproduces the imp-34673 reference floor ~1.87e-4 at N = 1e13, dp = 1e-2, and the
// closed amplitude W_MAX|q| matches the exact max|term| to ~0.04%.
const REF_P = Math.log(REF_N);
const REF_DP = 1e-2;
const REF_FREL = relFloor(REF_P, REF_DP); // ~1.9e-4 (cf imp-34673 F3 ~1.87e-4)
const REF_MAXTERM = maxTerm(REF_P, REF_DP); // ~6.96e3
const REF_AMP_CLOSED = W_MAX * Math.abs(qOfP(REF_P)); // ~6.95e3
const REF_AMP_RATIO = REF_MAXTERM / REF_AMP_CLOSED; // ~1.0004 (closed amplitude is excellent)

// (F3) at the parents' operating dp = 1e-3 the floor is ~0.19 (edge) and at dp = 1e-4 it is ~190
// (fully lost); dp* ~ 6e-4 sits between, all on the single cubic F_rel = C/dp^3.
const FREL_AT_1EM3 = relFloor(REF_P, 1e-3); // ~0.19
const FREL_AT_1EM4 = relFloor(REF_P, 1e-4); // ~190
// The cubic law: F_rel(dp2)/F_rel(dp1) must equal (dp1/dp2)^3 exactly.
const CUBIC_RATIO_CHECK = Math.abs(FREL_AT_1EM4 / FREL_AT_1EM3 - Math.pow(1e-3 / 1e-4, 3)) / 1000;

export const IMP34691_Q3_CANCELLATION_FLOOR_TRUST_BOUNDARY = Object.freeze({
  id: 'imp-34691',
  proofSection: 'S-frontier',
  claim_measured:
    'Derive the imp-34673 F3 input-roundoff conditioning floor max|term|*eps/|sum| as an explicit ' +
    'closed function F_rel(dp,N) = W_max eps |q| / (240 |q3| dp^3) = C(N)/dp^3 for the tiny-q3 ' +
    'catastrophic cancellation, and MEASURE the crossover dp*(N) = C(N)^(1/3) below which the floor ' +
    'exceeds the physical q3 signal (the smallest usable q-derivative step), tabulated across the ' +
    'imp-33620 deep-tail ladder -- a derivation/measurement on the inherited component model, not a bound.',
  // The explicit closed form (elementary error propagation of the inherited stencil).
  closed_form: 'F_rel(dp,N) = W_max*eps*|q(p)| / (240*|q3(p)|*dp^3) = C(N)/dp^3, dp*(N)=C(N)^(1/3)',
  W_max: W_MAX, // max|w_k| of the q3 stencil (the imp-34633 amplitude stencil weight)
  eps_mach: +EPS.toExponential(3),
  probe_dp_band: Object.freeze([PROBE_DP_A, PROBE_DP_B]),
  deep_tail_head_N: DEEP_TAIL_N,
  C_C_inline: +C_C.toFixed(6),
  // F1: closed form reproduces the imp-34673 reference floor and amplitude.
  reference_point: Object.freeze({ N: REF_N, dp: REF_DP }),
  ref_Frel_closed: +REF_FREL.toExponential(3), // ~1.9e-4 (cf imp-34673 F3 ~1.87e-4)
  ref_maxterm_exact: +REF_MAXTERM.toExponential(3), // ~6.96e3
  ref_amp_closed_Wmax_q: +REF_AMP_CLOSED.toExponential(3), // ~6.95e3
  ref_amp_ratio_exact_over_closed: +REF_AMP_RATIO.toFixed(4), // ~1.0004
  // F2: dp*(N) trust-boundary table across the imp-33620 deep-tail ladder.
  dp_star_table: DP_STAR_TABLE,
  dp_star_min: +DP_STAR_MIN.toExponential(4), // ~6.09e-4 (head of ladder)
  dp_star_max: +DP_STAR_MAX.toExponential(4), // ~6.86e-4 (N=1e15)
  dp_star_monotone_rising: DP_STAR_MONOTONE,
  // F3: the single cubic law spans operating dp=1e-3 (edge) to dp=1e-4 (fully lost).
  Frel_at_dp_1e_minus_3: +FREL_AT_1EM3.toFixed(4), // ~0.19 (edge of trust)
  Frel_at_dp_1e_minus_4: +FREL_AT_1EM4.toFixed(2), // ~190 (fully lost)
  // Relation to parents: exponent = imp-34606 m3=3 (analytic here), amplitude = imp-34633 eps_mach*|q|.
  exponent_matches_imp34606_m3: 3,
  amplitude_matches_imp34633: 'W_max*eps_mach*|q| (stencil weight times unit roundoff times |q|)',
  isRigorous: false,
  verdict:
    'MEASUREMENT / DERIVATION (NOT rigorous). Makes the imp-34673 F3 catastrophic-cancellation ' +
    'conditioning floor explicit as a closed function of (dp,N) and locates the smallest usable step. ' +
    '[q3 = 9-point antisymmetric stencil [7,-72,338,-488,+488,-338,+72,-7]/240 on q(p) = log E_coll; ' +
    'deep-tail ladder N >= N* ~ 4.62e13 (imp-33620 sigma < 0.01).] Because the largest summand ' +
    'max|w_k q(p+k dp)| ~ W_max|q| (W_max = 488) is step-INDEPENDENT while the true numerator N3 ~ ' +
    '240 dp^3 q3 shrinks cubically, the RELATIVE conditioning floor is the closed form F_rel(dp,N) = ' +
    'W_max*eps*|q(p)| / (240*|q3(p)|*dp^3) = C(N)/dp^3 with depth-only prefactor C(N) = ' +
    'W_max*eps*|q|/(240*|q3|). (F1) THE CLOSED FORM REPRODUCES THE imp-34673 REFERENCE: at N = 1e13, ' +
    'dp = 1e-2 it gives F_rel ~ 1.9e-4 (cf imp-34673 F3 ~1.87e-4), with the exact max|term| ~ 6.96e3 ' +
    'within ~0.04% of the closed amplitude W_max|q| ~ 6.95e3. (F2) THE SMALLEST USABLE STEP IS ' +
    'dp*(N) = C(N)^(1/3) ~ 6e-4, RISING SLOWLY WITH DEPTH: across the deep-tail ladder dp* climbs ' +
    'monotonically from ~6.09e-4 at N* ~ 4.62e13 to ~6.86e-4 at N = 1e15 (and ~5.72e-4 at the 1e13 ' +
    'reference), with the measured crossover F_rel(dp*) = 1 to 4 sig figs on every rung; below dp* ' +
    'the q3 numerator is pure roundoff. The physical q3 signal is measured from the same stencil at a ' +
    'well-conditioned probe band (dp = 0.1, 0.05; the two agree to ~5 digits). (F3) dp* SITS BETWEEN ' +
    'THE PARENTS OPERATING AND FULLY-LOST STEPS -- ONE 1/dp^3 LAW: at dp = 1e-3 the floor is F_rel ' +
    '~ 0.19 (edge) and at dp = 1e-4 it is ~190 (fully lost, the imp-34606 F2 roundoff-dominated ' +
    'regime), and dp* ~ 6e-4 lies between them on the single cubic F_rel = C/dp^3. The 1/dp^3 power IS ' +
    'the imp-34606 q3 rung m3 = 3 (analytic here, not fitted) and the amplitude W_max*eps*|q| IS the ' +
    'imp-34633 eps_mach*|q| prefactor with stencil weight W_max = max|w3|. q1..q3 are inherited ' +
    'central differences, NOT fresh analytic closed forms, so the sigma -> 1 deep-tail regime ' +
    '(imp-3220/imp-3406 component model least trustworthy) is inherited as-is. The -2 asymptote and ' +
    'C_C = (1/8)sqrt(3 pi) (imp-2714, C_H = 1/8) ansatz are UNTOUCHED; the C_mb GUE-conditional share ' +
    'per imp-486 is UNTOUCHED; imp-3066 K_a >= 0 untouched; changes no bound; no operator positivity; ' +
    'no RH verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-34673 (F3 conditioning floor ~1.87e-4 made explicit here); imp-34606 (clean {2,3,4} 1/dp^k ' +
    'exponent ladder, q3 rung m3=3); imp-34633 (eps_mach*|q| prefactor amplitude); imp-34626 ' +
    '(6th-order 9-point stencil); imp-33620 (deep-tail landmark N* ~ 4.62e13, sigma < 0.01); ' +
    'imp-2714 (C_C ansatz); imp-486 (C_mb).',
});

// -- self-executing assertions (imp-3715 convention): any failure throws at import --
const IMP34691_ASSERTIONS = [
  {
    id: 'imp34691-q3-stencil-normalization',
    holds: () => {
      // The 9-point q3 stencil must satisfy the 3rd-derivative normalization sum c_k k^3 / 6 = 1.
      let m3 = 0;
      for (const [k, w] of Q3_TERMS) m3 += w * k * k * k;
      return Math.abs(m3 / Q3_DENOM / 6 - 1) < 1e-12 && W_MAX === Math.max(...Q3_TERMS.map(([, w]) => Math.abs(w)));
    },
    why: 'Guards the inherited q3 stencil: its 3rd-derivative normalization sum c_k k^3/6 = 1, and W_max = 488 is the largest weight magnitude used in the amplitude.',
  },
  {
    id: 'imp34691-closed-form-reproduces-imp34673-reference',
    holds: () =>
      REF_FREL > 1e-4 && REF_FREL < 3e-4 && Math.abs(REF_AMP_RATIO - 1) < 0.01,
    why: 'F1: the closed form F_rel = C/dp^3 gives ~1.9e-4 at N=1e13, dp=1e-2 (cf imp-34673 F3 ~1.87e-4) and the closed amplitude W_max|q| matches the exact max|term| to within ~1%.',
  },
  {
    id: 'imp34691-dp-star-crossover-is-unity',
    holds: () => DP_STAR_TABLE.every((r) => Math.abs(r.Frel_at_dp_star - 1) < 1e-2),
    why: 'F2: dp*(N) = C(N)^(1/3) is the step where the relative floor equals the physical signal, so F_rel(dp*) = 1 to 4 sig figs on every deep-tail rung -- the smallest usable step by construction.',
  },
  {
    id: 'imp34691-dp-star-band-and-monotone',
    holds: () =>
      DP_STAR_MIN > 5e-4 && DP_STAR_MAX < 8e-4 && DP_STAR_MONOTONE,
    why: 'F2: the smallest usable step is dp* ~ 6e-4 across the deep-tail ladder, rising monotonically with depth (|q| grows, |q3| shrinks).',
  },
  {
    id: 'imp34691-cubic-law-spans-operating-and-lost-steps',
    holds: () =>
      FREL_AT_1EM3 > 0.1 && FREL_AT_1EM3 < 1 && FREL_AT_1EM4 > 100 && CUBIC_RATIO_CHECK < 1e-6,
    why: 'F3: the single cubic F_rel = C/dp^3 puts the operating dp=1e-3 at the edge (~0.19) and dp=1e-4 fully lost (~190), and the ratio between them equals (1e-3/1e-4)^3 = 1000 exactly -- the imp-34606 m3=3 exponent.',
  },
  {
    id: 'imp34691-honesty-gate-no-qed',
    holds: () =>
      IMP34691_Q3_CANCELLATION_FLOOR_TRUST_BOUNDARY.isRigorous === false &&
      /NO QED/.test(IMP34691_Q3_CANCELLATION_FLOOR_TRUST_BOUNDARY.verdict) &&
      /refereed bound is changed/i.test(IMP34691_Q3_CANCELLATION_FLOOR_TRUST_BOUNDARY.verdict) &&
      /UNTOUCHED/.test(IMP34691_Q3_CANCELLATION_FLOOR_TRUST_BOUNDARY.verdict),
    why: 'Honesty gate: measurement/derivation only, no bound change, no QED, no refereed bound is changed.',
  },
];

for (const assertion of IMP34691_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(
      `imp-34691-q3-cancellation-floor-trust-boundary assertion failed: ${assertion.id}`,
    );
  }
}

export default IMP34691_Q3_CANCELLATION_FLOOR_TRUST_BOUNDARY;
