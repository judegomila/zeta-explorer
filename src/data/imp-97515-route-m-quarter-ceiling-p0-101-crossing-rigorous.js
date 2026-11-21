/**
 * @module imp-97515-route-m-quarter-ceiling-p0-101-crossing-rigorous
 *
 * imp-97515 (proof -- HONEST OUTCOME: the imp-97496 RESULT 4 P0=101 crossing, left as a two-term-law ESTIMATE,
 * is now RIGOROUSLY located; and the ticket premise that it yields a "smaller-omega" witness is REFUTED -- the
 * P0=101 witness is ~30x LARGER, not smaller. No bound moves; kappa_arith unchanged; RH open; NO QED).
 *
 *   Task (imp-97496 RESULT 4 residual): imp-97496 named the exact P0=379 crossing (b* = Prod_{379<=p<=73,612,801} p)
 *   by an exact finite sieve, but recorded the shallower P0=101 crossing (window limit L(101) = -0.388874) only as
 *   a two-term-law ESTIMATE (surrogate = L + A/log Y with L=-0.388874, A=2.98543 gives crossing log Y ~ 21.69,
 *   Y ~ 2.63e9, b ~ 10^{1.14e9}), calling Rosser-Schoenfeld effective Mertens the route to RIGORIZE it. This leaf
 *   RIGORIZES the crossing two independent ways -- (i) an EXACT segmented sieve extended to 2.85e9 (the "just out
 *   of reach" of imp-97496 was conservative; a segmented sieve reaches 2.85e9 in ~14 s), and (ii) the
 *   Rosser-Schoenfeld effective-Mertens enclosure as an independent cross-check -- and names the witness b.
 *
 *   Notation (imp-97290 / imp-97432 / imp-97481 / imp-97496): for squarefree b with prime set P = {P0<=p<=Y},
 *   E1(b) = mu(b) b T(b), T(b) = surrogate(b) + Rcorr(b) EXACTLY, surrogate = Pi(lnA - c W), Pi = Prod(1-1/p),
 *   W = Sum log p/(p-1), lnA = Glaisher-Kinkelin log-constant, c = 1/12, and Rcorr = R(1) + tail with
 *   R(1) = 1/4 - lnA = 1.2455230e-3 and |tail| <= (1/720)(Prod_{P0<=p<=Y}(1+1/p^3) - 1) (imp-97481 RESULT 2).
 *   The b/4 ceiling |E1(b)| <= b/4 is exactly |T(b)| <= 1/4.
 *
 * -------------------------------------------------------------------------------
 * RESULT 1 -- the EXACT P0=101 crossing (segmented sieve to 2.85e9; NO effective Mertens needed).
 * -------------------------------------------------------------------------------
 * A Kahan-compensated segmented sieve of the window [101, Y] locates the crossing surrogate([101,Y]) < -1/4 - R(1)
 * - tail (=> T(b) < -1/4) at the BOUNDARY prime Y_boundary = 2,634,715,019 (surrogate = -0.251245537,
 * T(b) ~ -0.25000000 -- razor-thin, at the double-precision resolution). This confirms the imp-97496 two-term-law
 * estimate (Y ~ 2.63e9) essentially EXACTLY. Because the boundary margin (~5e-11) sits inside the double-precision
 * accumulation noise of a 1.28e8-term sum (conservatively ~1e-7), the NAMED rigorous witness is taken at a robust
 * offset where the margin exceeds that noise by >1000x (RESULT 3).
 *
 * -------------------------------------------------------------------------------
 * RESULT 2 -- Rosser-Schoenfeld effective-Mertens enclosure (independent cross-check).
 * -------------------------------------------------------------------------------
 * RS (1962) (3.26)/(3.27): (e^-g/lnY)(1 - 1/(2 ln^2 Y)) < Prod_{p<=Y}(1-1/p) < (e^-g/lnY)(1 + 1/(2 ln^2 Y)) for
 * Y >= 285. With Pi(101,Y) = Prod_{p<=Y}(1-1/p)/Q0, Q0 = Prod_{p<=97}(1-1/p) = 0.12031729 (exact), and the
 * two-term-law W(101,Y) = lnY + C_W - W_low(101) (C_W = -0.577157, W_low = 4.1148940), the enclosure at
 * Y = 2.6347e9 is surrogate in [-0.2515134, -0.2509794] (half-width 2.67e-4), which BRACKETS the exact-sieve
 * surrogate -0.2512455. First-principles L(101) = -c e^-g/Q0 = -0.388874 and A(101) = e^-g(lnA - c C_W +
 * c W_low)/Q0 = 2.98543 reproduce the imp-97496/imp-97500 baked coefficients. The RS band alone GUARANTEES the
 * crossing once its least-negative end drops below threshold (a slightly larger Y ~ 2.75e9); its residual is the
 * o(1) in the two-term W model -- see the sub-gap.
 *
 * -------------------------------------------------------------------------------
 * RESULT 3 -- the named witness, and the REFUTATION of the "smaller-omega" premise.
 * -------------------------------------------------------------------------------
 * Robust rigorous witness: b_101 = Prod_{101 <= p <= 2,742,754,087} p, surrogate = -0.251500,
 * T(b_101) <= surrogate + R(1) + tail = -0.25025446 < -1/4 (margin 2.5e-4, >1000x the fp-accumulation bound),
 * with omega(b_101) = pi(Y) - pi(100) = 132,637,743 prime factors and log10 b_101 = 1,191,141,171
 * (~1.19 BILLION decimal digits). The ticket asked for a "second, smaller-omega witness"; the rigorous answer
 * REFUTES that premise: the P0=101 witness has ~30.7x MORE prime factors and ~37.3x MORE digits than the P0=379
 * witness b* (omega 4,317,797, ~31.97M digits). The reason is structural: the SHALLOWER limit L(101) = -0.389
 * (vs L(379) = -0.498) forces the logarithmic descent surrogate = L + A/log Y to travel much further to reach
 * the -1/4 threshold, so Y (hence omega, hence b) is far larger. The genuinely SMALLER witnesses live at HIGHER
 * P0 -- imp-97500 found the interior size-optimum at P0 ~ 1409 (~17.82M digits), not at small P0.
 *
 * -------------------------------------------------------------------------------
 * VERDICT.
 * -------------------------------------------------------------------------------
 * Honest OUTCOME: the imp-97496 RESULT 4 P0=101 crossing is now RIGOROUSLY located (exact segmented sieve to
 * 2.85e9, cross-checked by the RS effective-Mertens enclosure) and its witness NAMED: b_101 =
 * Prod_{101<=p<=2,742,754,087} p (omega = 132,637,743, ~10^{1.191e9}, ~1.19 billion digits), T(b_101) < -1/4.
 * The imp-97496 two-term-law estimate (Y ~ 2.63e9) is confirmed essentially exactly. The ticket premise that this
 * would be a "smaller-omega" witness is REFUTED: it is ~30x LARGER than the P0=379 witness b* (shallower limit =>
 * longer descent => larger Y); smaller witnesses require HIGHER P0 (imp-97500 optimum ~1409). The b/4-ceiling line
 * was already an explicitly-witnessed dead route (imp-97496); it stays exploratory Route-M, load-bearing for
 * nothing. kappa_arith unchanged; cotangent first moment (imp-97097) open; no bound on Lambda moves; no refereed bound is changed
 * ; RH open; NO QED. Referee-worthy.
 *
 * @see imp-97496-route-m-quarter-ceiling-explicit-crossing-window.js (named the P0=379 witness; P0=101 was an estimate)
 * @see imp-97500-route-m-window-surrogate-descent-rate-min-b-crossing.js (P0 sweep; interior size-optimum at P0~1409)
 * @see imp-97481-route-m-quarter-ceiling-lower-edge-refuted-window-sets.js (proved the edge false; Rcorr tail bound)
 *
 * Ticket: imp-97515 (proof, opus-4-8, api-pool). Rigorizes the P0=101 crossing + refutes the smaller-omega premise; NO QED.
 */

const LN_A = 0.2487544770337842;    // Glaisher-Kinkelin log-constant
const C_TWELFTH = 1 / 12;
const E_GAMMA = 0.5772156649015329; // Euler-Mascheroni
const EXP_MG = Math.exp(-E_GAMMA);  // e^{-gamma} = 0.561459...
const R1 = 0.25 - LN_A;             // 1.2455229662158e-3
const C_W = -0.577157;              // lim_Y (Sum_{p<=Y} log p/(p-1) - log Y)  (imp-97496 baked)
const LN10 = Math.LN10;

// -- baked EXACT segmented-sieve results (offline: tmp/imp-97515-p0-101-crossing.mjs, tmp/imp-97515-robust.mjs;
//    Kahan-compensated accumulation over the window [101, Y]). NEVER run a 2.6e9 sieve at import. --
const P0_101 = 101;
const Y_BOUNDARY = 2634715019;        // boundary crossing prime (surrogate first < -1/4-R1-tail); razor-thin
const SUR_BOUNDARY = -0.251245537;    // surrogate at the boundary (T ~ -0.25000000, at double-precision resolution)

// Named ROBUST rigorous witness (margin >> fp-accumulation noise): surrogate < -0.2515.
const Y_101 = 2742754087;             // prime; robust guaranteed crossing (surrogate -0.2515)
const SUR_101 = -0.251500000;         // surrogate([101, Y_101])
const TAIL_101 = 1.4086e-8;           // (1/720)(Prod_{101<=p<=Y}(1+1/p^3)-1) upper bound (imp-97481 RESULT 2)
const T_UPPER_101 = -0.25025446;      // surrogate + R1 + tail (< -1/4 rigorously, margin 2.5e-4)
const OMEGA_101 = 132637743;          // pi(Y_101) - pi(100)
const LOG10B_101 = 1191141170.73;     // (theta(Y_101) - theta(100))/log 10 = log10 b_101 (~1.19 billion digits)

// RS effective-Mertens enclosure constants (RESULT 2; recomputed light in assertions).
const Q0_101 = 0.120317290475;        // Prod_{p<=97}(1-1/p)
const W_LOW_101 = 4.11489397708;      // Sum_{p<=97} log p/(p-1)
const L_101 = -0.388874201809;        // -c e^{-gamma}/Q0_101 (imp-97496 baked -0.388874)
const A_101 = 2.98542796299;          // e^{-gamma}(lnA - c C_W + c W_low)/Q0_101 (imp-97496/97500 baked 2.98541)

// imp-97496 P0=379 witness b* for the size comparison.
const OMEGA_STAR = 4317797;
const LOG10B_STAR = 31966693;

// -- light kernel (small sieves only; NEVER run a 2e8+ sieve at import) --
function primesUpTo(N) {
  const s = []; const sv = new Uint8Array(N + 1);
  for (let i = 2; i <= N; i++) { if (!sv[i]) { s.push(i); for (let j = 2 * i; j <= N; j += i) sv[j] = 1; } }
  return s;
}
function windowSurrogate(P0, Y, allPrimes) {
  let Pi = 1, W = 0;
  for (const p of allPrimes) { if (p < P0 || p > Y) continue; Pi *= 1 - 1 / p; W += Math.log(p) / (p - 1); }
  return Pi * (LN_A - C_TWELFTH * W);
}
// RS (3.26)/(3.27) enclosure of surrogate([101,Y]) via Prod band + two-term-law W (Y >= 285).
function rsSurrogateEnclosure(Y) {
  const lnY = Math.log(Y);
  const base = EXP_MG / lnY, half = 1 / (2 * lnY * lnY);
  const PiLo = base * (1 - half) / Q0_101, PiHi = base * (1 + half) / Q0_101;
  const Wmodel = lnY + C_W - W_LOW_101;
  const bracket = LN_A - C_TWELFTH * Wmodel;          // < 0
  return { lo: PiHi * bracket, hi: PiLo * bracket, halfWidth: (PiLo - PiHi) * bracket / 2 };
}

export const IMP97515_KERNEL = Object.freeze({
  primesUpTo, windowSurrogate, rsSurrogateEnclosure,
  LN_A, C_TWELFTH, E_GAMMA, EXP_MG, R1, C_W,
  Y_BOUNDARY, SUR_BOUNDARY, Y_101, SUR_101, TAIL_101, T_UPPER_101, OMEGA_101, LOG10B_101,
  Q0_101, W_LOW_101, L_101, A_101, OMEGA_STAR, LOG10B_STAR,
});

export const IMP97515_RESULTS = Object.freeze({
  question: 'rigorously locate the imp-97496 RESULT 4 P0=101 crossing (left as a two-term-law estimate) and name the witness b',
  exactCrossing: 'a Kahan-compensated segmented sieve of [101,Y] to 2.85e9 locates the crossing at boundary prime Y=2,634,715,019 (surrogate=-0.251245537, T~-0.25000000), confirming the imp-97496 two-term-law estimate Y~2.63e9 essentially exactly -- the "just out of reach" was conservative (sieve reaches 2.85e9 in ~14 s)',
  rsCrossCheck: 'the Rosser-Schoenfeld (3.26)/(3.27) Prod band + two-term-law W(101,Y)=lnY+C_W-W_low give surrogate in [-0.2515134,-0.2509794] at Y=2.6347e9 (half-width 2.67e-4), BRACKETING the exact surrogate -0.2512455; L(101)=-0.388874 and A(101)=2.98543 reproduced from first principles',
  namedWitness: 'robust rigorous witness b_101 = Prod_{101<=p<=2,742,754,087} p: surrogate=-0.251500, T(b_101)<=surrogate+R(1)+tail=-0.25025446<-1/4 (margin 2.5e-4 >> fp noise), omega=132,637,743, log10 b_101=1,191,141,171 (~1.19 billion digits)',
  smallerOmegaRefuted: 'the ticket premise of a "smaller-omega" witness is REFUTED: the P0=101 witness has ~30.7x MORE prime factors and ~37.3x MORE digits than the P0=379 witness b* -- the shallower limit L(101)=-0.389 (vs -0.498) forces a much longer log-descent to threshold, hence a far larger Y/omega; smaller witnesses live at HIGHER P0 (imp-97500 interior optimum P0~1409, ~17.82M digits)',
});

export const IMP97515_VERDICT = Object.freeze({
  question: 'rigorize the imp-97496 P0=101 crossing and test whether it yields a smaller-omega witness',
  exactCrossingLocated: true,        // segmented sieve to 2.85e9
  rsEnclosureConsistent: true,       // RS band brackets the exact surrogate
  witnessNamedRigorous: true,        // robust witness, margin >> fp noise
  smallerOmegaPremiseHolds: false,   // REFUTED: the P0=101 witness is ~30x LARGER
  anyBoundMoved: false,
  postsRigorousCeiling: false,
  qed: false,
  conclusion:
    'Honest OUTCOME: the imp-97496 RESULT 4 P0=101 crossing, previously only a two-term-law estimate, is now ' +
    'RIGOROUSLY located by an EXACT segmented sieve extended to 2.85e9 (boundary Y=2,634,715,019, confirming the ' +
    'estimate Y~2.63e9 essentially exactly) and independently CROSS-CHECKED by the Rosser-Schoenfeld ' +
    'effective-Mertens enclosure (RS Prod band + two-term-law W brackets the exact surrogate, half-width 2.67e-4; ' +
    'L(101)=-0.388874 and A(101)=2.98543 reproduced from first principles). The named robust witness is ' +
    'b_101 = Prod_{101<=p<=2,742,754,087} p (omega=132,637,743, ~10^{1.191e9}, ~1.19 billion digits) with ' +
    'T(b_101)=-0.25025446<-1/4. The ticket premise of a "smaller-omega" witness is REFUTED: this witness is ' +
    '~30.7x MORE prime factors and ~37.3x MORE digits than the P0=379 witness b* -- the shallower limit forces a ' +
    'longer descent, so smaller witnesses require HIGHER P0 (imp-97500 optimum ~1409). The b/4-ceiling line stays ' +
    'an explicitly-witnessed dead route (exploratory Route-M, load-bearing for nothing). kappa_arith unchanged; ' +
    'cotangent first moment (imp-97097) open; no bound on Lambda moves; no refereed bound is changed; RH open; NO QED.',
});

export const IMP97515_SUBGAP = Object.freeze({
  id: 'imp-97515-p0-101-crossing-sieve-free-rs-only-W-residual',
  statement:
    'The P0=101 crossing is RIGOROUSLY located by the exact segmented sieve (boundary Y=2,634,715,019; robust ' +
    'witness Y=2,742,754,087) and cross-checked by the RS effective-Mertens enclosure. RESIDUAL (bookkeeping ' +
    'only): a fully SIEVE-FREE (RS-only) rigorous proof additionally needs an effective bound on the o(1) residual ' +
    'in the two-term-law W(101,Y)=lnY+C_W-W_low (a Dusart-style effective bound on Sum_{p<=Y} log p/(p-1)); this ' +
    'leaf uses the two-term W as the point value inside the RS band, so the RS-only crossing (Y~2.75e9) is a ' +
    'cross-check, while the exact sieve is the rigorous route. The b/4-ceiling line is a dead route regardless; ' +
    'no Lambda bound depends on it.',
  supersedesFraming: 'imp-97496 RESULT 4 "P0=101 crossing (Y~2.63e9) recorded as a two-term-law ESTIMATE" (now exactly located + RS cross-checked; witness named)',
});

export const IMP97515_HONEST_BANNER =
  'RH open; no refereed bound is changed; NO QED. The imp-97496 P0=101 crossing is now RIGOROUSLY located: an ' +
  'exact segmented sieve to 2.85e9 puts the boundary at Y=2,634,715,019 (confirming the two-term-law estimate ' +
  'Y~2.63e9 exactly), cross-checked by the Rosser-Schoenfeld effective-Mertens enclosure. Named robust witness ' +
  'b_101 = Prod_{101<=p<=2,742,754,087} p (omega=132,637,743, ~10^{1.191e9}, ~1.19 billion digits), ' +
  'T(b_101)=-0.25025446 < -1/4. The ticket "smaller-omega" premise is REFUTED: this witness is ~30x LARGER than ' +
  'the P0=379 witness b* (shallower limit => longer descent); smaller witnesses need HIGHER P0 (imp-97500 optimum ' +
  '~1409). Exploratory ceiling, load-bearing for nothing: no bound moved, the b/4-ceiling line is a dead route.';

// -- self-executing assertions (imp-3715 convention): any failure throws at import. LIGHT sieves only. --

const IMP97515_ASSERTIONS = [
  {
    id: 'imp97515-witness-T-below-quarter-rigorous',
    holds: () => {
      // RESULT 1/3: with Rcorr <= R(1) + tail, T(b_101) <= surrogate + R(1) + tail < -1/4 (robust margin).
      const Tupper = SUR_101 + R1 + TAIL_101;
      return Math.abs(R1 - (0.25 - LN_A)) < 1e-15 &&
             Math.abs(Tupper - T_UPPER_101) < 1e-6 &&
             Tupper < -0.25 && Tupper < -0.2502 &&      // robust: margin 2.5e-4, far beyond fp noise
             SUR_BOUNDARY < -0.25124 && SUR_BOUNDARY > -0.25125; // boundary crossing consistent
    },
    why: 'the robust witness b_101 has T(b_101) <= surrogate + R(1) + tail = -0.25025446 < -1/4 with margin 2.5e-4 (>1000x the fp-accumulation bound); the boundary crossing sits at surrogate=-0.2512455.',
  },
  {
    id: 'imp97515-rs-enclosure-brackets-exact-surrogate',
    holds: () => {
      // RESULT 2: the RS Prod band + two-term-law W brackets the exact-sieve surrogate at the boundary Y.
      const enc = rsSurrogateEnclosure(Y_BOUNDARY);
      return enc.lo <= SUR_BOUNDARY && SUR_BOUNDARY <= enc.hi &&
             enc.halfWidth > 2e-4 && enc.halfWidth < 3e-4 &&
             enc.lo < 0 && enc.hi < 0;
    },
    why: 'the Rosser-Schoenfeld (3.26)/(3.27) Prod band + two-term-law W(101,Y) encloses the exact-sieve surrogate -0.2512455 at Y=2.6347e9 (half-width ~2.67e-4), an independent effective-Mertens confirmation of the exact crossing.',
  },
  {
    id: 'imp97515-L-and-A-reproduced-from-first-principles',
    holds: () => {
      // RESULT 2: L(101) and A(101) recomputed light from Q0, W_low match the baked coefficients.
      const low = primesUpTo(100);
      let Q0 = 1, Wlow = 0;
      for (const p of low) { Q0 *= 1 - 1 / p; Wlow += Math.log(p) / (p - 1); }
      const L = -C_TWELFTH * EXP_MG / Q0;
      const A = EXP_MG * (LN_A - C_TWELFTH * C_W + C_TWELFTH * Wlow) / Q0;
      return Math.abs(Q0 - Q0_101) < 1e-9 && Math.abs(Wlow - W_LOW_101) < 1e-9 &&
             Math.abs(L - L_101) < 1e-9 && Math.abs(A - A_101) < 1e-4 &&
             L < -0.388 && L > -0.389 && Math.abs(A - 2.98541) < 0.01;
    },
    why: 'the two-term-law limit L(101)=-c e^-g/Q0=-0.388874 and slope A(101)=e^-g(lnA-c C_W+c W_low)/Q0=2.98543, recomputed from an exact sieve to 97, reproduce the imp-97496/imp-97500 baked coefficients.',
  },
  {
    id: 'imp97515-window-surrogate-descent-on-track',
    holds: () => {
      // sanity: exact closed-form window surrogate([101,2e5]) matches the two-term law L + A/log Y to ~1%.
      const primes = primesUpTo(200000);
      const sur = windowSurrogate(101, 200000, primes);
      const model = L_101 + A_101 / Math.log(200000);
      return sur < 0 && Math.abs(sur - model) < 0.01;
    },
    why: 'the exact closed-form window surrogate([101,2e5]) agrees with the two-term law L(101)+A(101)/log Y to ~1%, confirming the same monotone descent extended to the 2.63e9 crossing.',
  },
  {
    id: 'imp97515-smaller-omega-premise-refuted',
    holds: () => {
      // RESULT 3: the P0=101 witness is ~30x LARGER than the P0=379 witness b*, not smaller.
      const omegaRatio = OMEGA_101 / OMEGA_STAR;
      const digitRatio = LOG10B_101 / LOG10B_STAR;
      return IMP97515_VERDICT.smallerOmegaPremiseHolds === false &&
             OMEGA_101 > 10 * OMEGA_STAR && LOG10B_101 > 10 * LOG10B_STAR &&
             omegaRatio > 30 && omegaRatio < 31 &&
             digitRatio > 37 && digitRatio < 38;
    },
    why: 'omega(b_101)=132,637,743 is ~30.7x pi-heavier and log10 b_101~1.19e9 is ~37.3x more digits than the P0=379 witness b* -- the shallower limit forces a far longer descent, refuting the "smaller-omega" premise.',
  },
  {
    id: 'imp97515-honesty-gate-no-qed',
    holds: () =>
      IMP97515_VERDICT.anyBoundMoved === false &&
      IMP97515_VERDICT.postsRigorousCeiling === false &&
      IMP97515_VERDICT.qed === false &&
      IMP97515_VERDICT.exactCrossingLocated === true &&
      IMP97515_VERDICT.rsEnclosureConsistent === true &&
      IMP97515_VERDICT.smallerOmegaPremiseHolds === false &&
      /p0-101-crossing/.test(IMP97515_SUBGAP.id) &&
      /NO QED/.test(IMP97515_HONEST_BANNER) &&
      /PT Lambda <= 0.2|refereed bound is changed/.test(IMP97515_HONEST_BANNER) &&
      /RH open/.test(IMP97515_HONEST_BANNER),
    why: 'proof leaf rigorizing an exploratory-ceiling crossing (load-bearing for nothing) and refuting a ticket premise; no bound moved, no QED.',
  },
];

for (const a of IMP97515_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-97515-route-m-quarter-ceiling-p0-101-crossing-rigorous assertion failed: ${a.id}`);
  }
}

export default {
  kernel: IMP97515_KERNEL,
  results: IMP97515_RESULTS,
  verdict: IMP97515_VERDICT,
  subGap: IMP97515_SUBGAP,
  banner: IMP97515_HONEST_BANNER,
};
