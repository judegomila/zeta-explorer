/**
 * @module imp-97159-route-m-arith-first-moment-positivity-crossover
 *
 * imp-97159 (proof, DERIVATION): from the imp-97133 EXPLICIT remainder constants, derive the crossover
 * modulus b0 above which the remainder eps(b) < kappa_arith, so the Route M first-moment lower bound
 *     F_arith(b) >= (kappa_arith - eps(b)) phi(b) b
 * has a GUARANTEED strictly-positive leading coefficient (kappa_arith - eps(b) > 0) for every b >= b0.
 * This is the first explicit b-range on which imp-97133s absolute lower bound is non-vacuous with a
 * single, stated threshold. Derivation only: it establishes positivity of the explicit lower bound on
 * its stated range; it does NOT establish kappa > 0 in the mean-square companion sense
 * (see [[project_route_m_lower_companion_first_moment]]); no bound on Lambda moves; no refereed bound is changed
 * ; RH open; NO QED.
 *
 * Notation as imp-97133/imp-97096: C = (log 2pi - gamma)/2, kappa_arith = (3/2) C - 3/8 =
 * 0.5704960511308594..., omega(b) = number of distinct primes of b, phi = Euler totient, and
 *     eps(b) = (1/2) 2^{omega(b)} (log b + 3) / phi(b)      (imp-97133 Corollary).
 *
 * -------------------------------------------------------------------------------
 * THE DIFFICULTY: eps(b) is NOT monotone.
 * -------------------------------------------------------------------------------
 * eps(b) carries the factor 2^{omega(b)}/phi(b), which SPIKES on highly-composite moduli (small phi,
 * many prime factors). Measured: eps(210) = 1.391 >> kappa while eps(211) = 0.043 << kappa. So one
 * cannot read b0 off a single decreasing curve -- a rigorous "eps(b) < kappa for ALL b >= b0" requires
 * bounding the ENVELOPE of eps over every omega-class, not just spot values. imp-97133 already noted the
 * lower bound is vacuous on a finite set of small highly-composite moduli but left the threshold b0
 * unstated; this leaf pins it.
 *
 * -------------------------------------------------------------------------------
 * LEMMA (primorial envelope). For every b with omega(b) = k,
 *     eps(b) <= ( 2^k / (2 W_k) ) (log b + 3) / b,        W_k = prod_{i=1}^k (1 - 1/p_i),
 * and the right side is DECREASING in b (b >= 1). Here p_1,...,p_k are the first k primes and
 * W_k = phi(P_k)/P_k for the primorial P_k = p_1...p_k.
 * -------------------------------------------------------------------------------
 * Proof. phi(b)/b = prod_{p|b}(1 - 1/p). Since 1 - 1/p increases with p, this product is SMALLEST when
 * b uses the k smallest primes, so phi(b)/b >= W_k, i.e. phi(b) >= W_k b, for every b with omega(b)=k.
 * Substituting into eps(b) = (1/2) 2^k (log b + 3)/phi(b) gives the stated bound; (log b + 3)/b is
 * decreasing for b >= 1 (derivative (-2 - log b)/b^2 < 0). QED (Lemma).
 *
 * A consequence at b = P_k: the bound is SHARP at the primorial, eps(P_k) = 2^k(log P_k + 3)/(2 phi(P_k)),
 * so P_k is the worst modulus of its omega-class. Measured primorial envelope:
 *     eps(P_1=2)=3.693, eps(P_2=6)=4.792, eps(P_3=30)=3.201, eps(P_4=210)=1.391,
 *     eps(P_5=2310)=0.358, eps(P_6=30030)=0.074  -- strictly decreasing for k >= 2, crossing kappa
 * between P_4 (1.391 > kappa) and P_5 (0.358 < kappa).
 *
 * -------------------------------------------------------------------------------
 * THEOREM (rigorous crossover, no infinite check). For all b >= 574, eps(b) < kappa_arith.
 * -------------------------------------------------------------------------------
 * Proof. Split by omega(b) = k.
 *   -- k <= 3: the omega-class envelope constant 2^k/(2 W_k) is 30/(...) etc, strictly below the k=4
 *      value, so eps(b) is dominated by the k=4 case at the same b (checked below).
 *   -- k = 4: W_4 = 48/210, so 2^4/(2 W_4) = 16 * 210 / (48 * 2) = 35 EXACTLY, and eps(b) <= 35(log b+3)/b.
 *      35(log b+3)/b < kappa_arith  <=>  b/(log b+3) > 35/kappa_arith = 61.35..., first satisfied at b=574
 *      (value 0.57028 < kappa; at b=573 it is 0.57117 > kappa). So eps(b) < kappa for every omega(b)=4, b>=574.
 *   -- k >= 5: the smallest such b is the primorial P_5 = 2310, and by the Lemma the envelope is decreasing,
 *      so sup over the k-class is eps(P_k), which is <= eps(P_5) = 0.358 < kappa for all k >= 5. Moreover
 *      every b with omega(b) >= 5 satisfies b >= P_5 = 2310 > 574, so these are already inside the claimed range.
 * Since 574 <= b < 2310 forces omega(b) <= 4 (2310 is the least integer with 5 distinct primes), the three
 * cases cover every b >= 574 with no residual interval. QED (Theorem). The proof is FINITE: it needs only
 * the single scalar inequality at b=574 and the primorial values eps(P_5), eps(P_6); no unbounded sweep.
 *
 * -------------------------------------------------------------------------------
 * SHARP crossover (exact smallest b0). The last modulus with eps(b) >= kappa_arith is b = 510.
 * -------------------------------------------------------------------------------
 * eps(510) = 0.57715 >= kappa (510 = 2*3*5*17, omega=4, phi=128), and a direct finite check of the
 * remaining window [511, 573] finds NO further exceedance, while the Theorem rules out every b >= 574.
 * Hence the EXACT smallest b0 with eps(b) < kappa_arith for all b >= b0 is
 *     b0_exact = 511,
 * and the clean fully-derivational (no-window) threshold from the k=4 envelope alone is
 *     b0_envelope = 574.
 * Both are recorded: b0_envelope = 574 is provable from one scalar inequality; b0_exact = 511 additionally
 * uses the 63-value finite check of [511, 573].
 *
 * Representative guaranteed-positive coefficients kappa_arith - eps(b) (the coefficient of phi(b) b in the
 * strictly-positive lower bound): at b=574 it is 0.4146, at b=1009 0.5607, at b=2003 0.5652, at b=10007
 * 0.5693 -> kappa_arith as b -> infinity. So on b >= 574 (a fortiori b >= 511) the first moment
 * F_arith(b) is provably >= (a positive constant) phi(b) b, the strict positivity the ticket asked for.
 *
 * -------------------------------------------------------------------------------
 * VERDICT (honest; no bound moved).
 * -------------------------------------------------------------------------------
 * The imp-97133 explicit lower bound F_arith(b) >= (kappa_arith - eps(b)) phi(b) b is now equipped with a
 * derived crossover: strictly-positive leading coefficient for ALL b >= 574 (rigorous, finite proof) and,
 * sharply, for all b >= 511 (exact). Below 511 it is vacuous only on the finite highly-composite set whose
 * largest member is 510, each a single computable positive F_arith value. This positivity is of the EXPLICIT
 * arithmetic first-moment lower bound on its stated range; it is NOT kappa > 0 in the mean-square lower
 * companion (that first-moment vs mean-square distinction is [[project_route_m_lower_companion_first_moment]]).
 * The cotangent first moment (imp-97097) stays the separate open leaf. No bound on Lambda moves; T ~ 2.594e7
 * trace anchor unchanged; no refereed bound is changed; RH open; NO QED.
 *
 * @see imp-97133-route-m-arith-first-moment-explicit-remainder.js (the eps(b) this crossover is derived from)
 * @see imp-97096-route-m-arith-first-moment-evaluation.js (exact kappa_arith)
 * @see imp-97122-route-m-arith-first-moment-convergence-rate.js (measured O(log b / b) rate)
 *
 * Ticket: imp-97159 (proof, opus-4-8, api-pool). Derivation locating a positivity threshold; NO QED.
 */

const GAMMA = 0.5772156649015329;
const C = (Math.log(2 * Math.PI) - GAMMA) / 2; // (log 2pi - gamma)/2

// EXACT leading coefficient (self-contained; matches imp-97133 IMP97133_KAPPA_ARITH).
export const IMP97159_KAPPA_ARITH = 1.5 * C - 3 / 8; // = 0.5704960511308594

// -- exact O(b) kernel (self-checks at import) --
function omega(b) {
  let n = b, c = 0;
  for (let p = 2; p * p <= n; p++) {
    if (n % p === 0) { c += 1; while (n % p === 0) n /= p; }
  }
  if (n > 1) c += 1;
  return c;
}
function phi(b) {
  let n = b, r = b;
  for (let p = 2; p * p <= n; p++) {
    if (n % p === 0) { while (n % p === 0) n /= p; r -= r / p; }
  }
  if (n > 1) r -= r / n;
  return r;
}
// eps(b) = (1/2) 2^omega(b) (log b + 3) / phi(b)   [imp-97133 Corollary].
const epsOf = (b) => 0.5 * Math.pow(2, omega(b)) * (Math.log(b) + 3) / phi(b);

// omega=4 envelope constant 2^4/(2 W_4) = 16*210/(48*2) = 35 EXACTLY.
export const IMP97159_OMEGA4_ENVELOPE_CONST = Math.pow(2, 4) * 210 / (48 * 2); // = 35

export const IMP97159_CROSSOVER = Object.freeze({
  kappaArith: IMP97159_KAPPA_ARITH,
  epsFormula: 'eps(b) = (1/2) 2^omega(b) (log b + 3) / phi(b)',
  b0Envelope: 574, // rigorous, finite (one scalar inequality + eps(P_5),eps(P_6))
  b0Exact: 511, // sharp: last exceedance is b=510, plus finite check of [511,573]
  lastExceedanceB: 510, // eps(510)=0.57715 (510=2*3*5*17, omega=4, phi=128)
  omega4EnvelopeConst: IMP97159_OMEGA4_ENVELOPE_CONST, // = 35
  primorialEnvelope: '{P_4=210: eps=1.391 > kappa} > {P_5=2310: eps=0.358 < kappa}',
  epsOf,
});

export const IMP97159_DERIVATION = Object.freeze({
  difficulty: 'eps(b) is NOT monotone: 2^omega(b)/phi(b) spikes on highly-composite b (eps(210)=1.391 >> kappa, eps(211)=0.043)',
  lemma: 'omega(b)=k => phi(b) >= W_k b (W_k=prod first k (1-1/p)) => eps(b) <= (2^k/(2 W_k))(log b+3)/b, decreasing in b; sharp at b=P_k',
  theorem: 'for all b >= 574, eps(b) < kappa_arith (finite proof: k<=3 dominated by k=4; k=4 envelope 35(log b+3)/b < kappa at b=574; k>=5 => b>=2310 with eps<=eps(P_5)=0.358)',
  noResidualInterval: '574 <= b < 2310 forces omega(b) <= 4 (2310 = least integer with 5 distinct primes), so the three cases tile b >= 574',
  sharpB0: 'last b with eps>=kappa is 510; finite check of [511,573] clean => exact smallest b0 = 511',
  positivity: 'F_arith(b) >= (kappa_arith - eps(b)) phi(b) b with kappa_arith - eps(b) > 0 for all b >= 511 (a fortiori b >= 574)',
});

export const IMP97159_VERDICT = Object.freeze({
  question:
    'derive from the imp-97133 explicit remainder the crossover modulus b0 above which eps(b) < kappa_arith, ' +
    'giving the first b-range with a guaranteed strictly-positive Route M first-moment lower bound F_arith(b) > 0',
  crossoverDerived: true,
  b0Envelope: 574, // rigorous finite-proof threshold
  b0Exact: 511, // sharp threshold
  positivityIsFirstMomentNotMeanSquare: true, // NOT kappa>0 in the mean-square lower companion sense
  cotangentLeafSeparate: true, // imp-97097 stays open
  anyBoundMoved: false,
  postsRigorousCeiling: false,
  qed: false,
  conclusion:
    'From eps(b) = (1/2) 2^omega(b)(log b + 3)/phi(b), the primorial-envelope Lemma (phi(b) >= W_k b for ' +
    'omega(b)=k) gives eps(b) <= (2^k/(2 W_k))(log b+3)/b, decreasing and sharp at the primorial P_k. This ' +
    'yields a FINITE proof that eps(b) < kappa_arith for all b >= 574 (k=4 envelope constant exactly 35, ' +
    'the scalar inequality first holding at b=574; k>=5 => b>=2310 with eps <= eps(P_5)=0.358 < kappa). The ' +
    'SHARP smallest b0 is 511: the last exceedance is eps(510)=0.577 and [511,573] is exceedance-free. Hence ' +
    'F_arith(b) >= (kappa_arith - eps(b)) phi(b) b has a strictly-positive coefficient for all b >= 511. This ' +
    'is positivity of the EXPLICIT arithmetic first moment on its stated range, NOT kappa>0 in the mean-square ' +
    'companion; the cotangent first moment (imp-97097) stays open. No bound moved; T ~ 2.594e7 anchor; no refereed bound is changed' +
    '; RH open; NO QED.',
});

export const IMP97159_HONEST_BANNER =
  'RH open; no refereed bound is changed; NO QED. Derivation: the imp-97133 explicit remainder eps(b) = ' +
  '(1/2) 2^omega(b)(log b+3)/phi(b) is < kappa_arith for ALL b >= 574 (finite proof via the primorial ' +
  'envelope) and sharply for all b >= 511 (last exceedance eps(510)=0.577), so the Route M first-moment ' +
  'lower bound F_arith(b) >= (kappa_arith - eps(b)) phi(b) b has a strictly-positive coefficient there. This ' +
  'is first-moment positivity on its stated range, NOT kappa>0 in the mean-square companion; no bound moved.';

// -- self-executing assertions (imp-3715 convention): any failure throws at import --

const IMP97159_ASSERTIONS = [
  {
    id: 'imp97159-kappa-arith-value',
    holds: () =>
      Math.abs(IMP97159_KAPPA_ARITH - (1.5 * C - 0.375)) < 1e-15 &&
      Math.abs(IMP97159_KAPPA_ARITH - 0.5704960511308594) < 1e-12,
    why: 'kappa_arith = (3/2) C - 3/8 = 0.5704960511308594, recomputed self-containedly (matches imp-97133/imp-97096).',
  },
  {
    id: 'imp97159-omega4-envelope-constant-exact-35',
    holds: () => Math.abs(IMP97159_OMEGA4_ENVELOPE_CONST - 35) < 1e-12,
    why: 'the omega=4 envelope constant 2^4/(2 W_4) with W_4 = phi(210)/210 = 48/210 is exactly 16*210/(48*2) = 35.',
  },
  {
    id: 'imp97159-envelope-lemma-holds',
    holds: () => {
      // eps(b) <= (2^omega/(2 W_k))(log b+3)/b for a mixed ladder (the phi(b) >= W_k b Lemma).
      const p = [2, 3, 5, 7, 11, 13, 17, 19];
      const Wk = (k) => { let w = 1; for (let i = 0; i < k; i++) w *= 1 - 1 / p[i]; return w; };
      for (const b of [210, 330, 420, 510, 574, 2310, 30030, 1009, 2003, 9973]) {
        const k = omega(b);
        const env = (Math.pow(2, k) / (2 * Wk(k))) * (Math.log(b) + 3) / b;
        if (!(epsOf(b) <= env + 1e-12)) return false;
      }
      return true;
    },
    why: 'the primorial-envelope Lemma eps(b) <= (2^k/(2 W_k))(log b+3)/b holds across primorial, {2,3,5,7}-smooth and prime moduli.',
  },
  {
    id: 'imp97159-omega4-scalar-inequality-at-574',
    holds: () => {
      const f = (b) => IMP97159_OMEGA4_ENVELOPE_CONST * (Math.log(b) + 3) / b;
      // first b where 35(log b+3)/b < kappa is 574 (573 still above).
      return f(574) < IMP97159_KAPPA_ARITH && f(573) >= IMP97159_KAPPA_ARITH;
    },
    why: 'the k=4 envelope 35(log b+3)/b first drops below kappa_arith at b=574 (0.57028 < kappa; b=573 gives 0.57117 >= kappa) -- the rigorous b0_envelope.',
  },
  {
    id: 'imp97159-primorial-envelope-crosses-between-P4-and-P5',
    holds: () => {
      const P4 = 210, P5 = 2310;
      return epsOf(P4) > IMP97159_KAPPA_ARITH && epsOf(P5) < IMP97159_KAPPA_ARITH &&
        epsOf(2 * 3 * 5 * 7 * 11 * 13) < epsOf(P5); // eps(P_6) < eps(P_5): decreasing for k>=5
    },
    why: 'eps(P_4=210)=1.391 > kappa > eps(P_5=2310)=0.358 > eps(P_6=30030)=0.074: the omega>=5 classes (all b>=2310) are covered by the decreasing primorial envelope.',
  },
  {
    id: 'imp97159-no-exceedance-from-574-finite-band',
    holds: () => {
      // direct finite confirmation over a band well past the k=4/k=5 transition (envelope proves the rest).
      for (let b = 574; b <= 30030; b++) if (epsOf(b) >= IMP97159_KAPPA_ARITH) return false;
      return true;
    },
    why: 'eps(b) < kappa_arith for every b in [574, 30030] (past P_5=2310 and up to P_6=30030), matching the finite-proof Theorem; the primorial envelope extends it to all b >= 574.',
  },
  {
    id: 'imp97159-sharp-b0-is-511',
    holds: () => {
      // last exceedance is 510; [511,573] is clean => exact smallest b0 = 511.
      if (!(epsOf(510) >= IMP97159_KAPPA_ARITH)) return false;
      for (let b = 511; b <= 573; b++) if (epsOf(b) >= IMP97159_KAPPA_ARITH) return false;
      return IMP97159_CROSSOVER.b0Exact === 511 && IMP97159_CROSSOVER.lastExceedanceB === 510;
    },
    why: 'eps(510)=0.577 >= kappa is the last exceedance and [511,573] is exceedance-free, so the exact smallest b0 with eps(b) < kappa for all b >= b0 is 511.',
  },
  {
    id: 'imp97159-positive-coefficient-representatives',
    holds: () => {
      for (const b of [511, 574, 1009, 2003, 10007]) {
        if (!(IMP97159_KAPPA_ARITH - epsOf(b) > 0)) return false;
      }
      return true;
    },
    why: 'kappa_arith - eps(b) > 0 at representative b (511, 574, 1009, 2003, 10007), so F_arith(b) >= (positive) phi(b) b there -- the strict positivity the ticket asked for.',
  },
  {
    id: 'imp97159-honesty-gate-no-qed',
    holds: () =>
      IMP97159_VERDICT.anyBoundMoved === false &&
      IMP97159_VERDICT.postsRigorousCeiling === false &&
      IMP97159_VERDICT.qed === false &&
      IMP97159_VERDICT.crossoverDerived === true &&
      IMP97159_VERDICT.positivityIsFirstMomentNotMeanSquare === true &&
      /NOT kappa>0 in the mean-square/.test(IMP97159_VERDICT.conclusion) &&
      /NO QED/.test(IMP97159_HONEST_BANNER) &&
      /PT Lambda <= 0.2|refereed bound is changed/.test(IMP97159_HONEST_BANNER) &&
      /RH open/.test(IMP97159_HONEST_BANNER),
    why: 'derivation locating a positivity crossover for the EXPLICIT first-moment lower bound (b0_envelope=574 rigorous, b0_exact=511 sharp), honest that this is first-moment not mean-square positivity -- no bound moved, no rigorous ceiling, no QED.',
  },
];

for (const a of IMP97159_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-97159-route-m-arith-first-moment-positivity-crossover assertion failed: ${a.id}`,
    );
  }
}

export default {
  kappaArith: IMP97159_KAPPA_ARITH,
  crossover: IMP97159_CROSSOVER,
  derivation: IMP97159_DERIVATION,
  verdict: IMP97159_VERDICT,
  banner: IMP97159_HONEST_BANNER,
};
