/**
 * @module imp-97122-route-m-arith-first-moment-convergence-rate
 *
 * imp-97122 (accuracy, MEASUREMENT): measure the CONVERGENCE RATE of the Route M arithmetic
 * first-moment ratio F_arith(b)/(phi(b) b) to the exact leading constant derived in imp-97096,
 *     kappa_arith = (3/2) C - 3/8 = (3/4)(log 2pi - gamma) - 3/8 = 0.5704960511308594...,
 * and SIZE the o(phi(b) b) error term coming from the L0 = Sum_{a in R_b} log a and
 * L1 = Sum_{a in R_b} a log a Moebius/Euler-Maclaurin remainders. This is an accuracy check that
 * certifies the imp-97096 derivation numerically and quantifies how fast the exact coefficient is
 * approached. No bound moves; no refereed bound is changed; RH open; NO QED.
 *
 * Notation as imp-97096: R_b = {a : 1 <= a <= b-1, (a,b)=1}, A(a,b) = C(a+b) + (1/2)(a-b) log(b/a),
 * C = (log 2pi - gamma)/2, F_arith(b) = Sum_{a in R_b} A(a,b) (the a>=1 clean-asymptotic reading).
 * Define the normalized residual  r(b) = F_arith(b)/(phi(b) b) - kappa_arith.
 *
 * -------------------------------------------------------------------------------
 * RESULT 1 -- the general-b convergence rate is O(log b / b), NOT O(1/b).
 * -------------------------------------------------------------------------------
 * Across a general-b ladder (b = 101,211,503,1009,2003,5003,9973 with modest omega(b)) the residual
 * fits, to <1%,
 *     r(b) * b  =  c * log b + d,      c = 0.2481,   d = 0.1003        (least-squares over the ladder),
 * i.e.  r(b) = (0.248 log b + 0.100)/b, a clean O(log b / b) decay with leading coefficient c ~ 1/4.
 * So the o(phi(b) b) error term of imp-97096 is of absolute size O(phi(b) b * log b / b) = O(phi(b) log b)
 * -- one log factor above O(phi(b)), the EXPECTED rate (a genuine o(phi(b) b), not O(1/b)). Measured
 * r(b): 1.2355e-2 (b=101) -> 2.3930e-4 (b=9973), monotone down to kappa_arith from above.
 *
 * -------------------------------------------------------------------------------
 * RESULT 2 -- smooth/primorial b converges FAR faster (the Moebius divisor sum cancels).
 * -------------------------------------------------------------------------------
 * On primorial b = 6,30,210,2310,30030 the residual collapses ORDERS below the general-b ladder:
 * |r(b)| = 5.88e-3 (6), 6.52e-4 (30), 3.29e-5 (210), 1.07e-6 (2310), 3.60e-7 (30030) -- the a>=1
 * reading essentially "hits" kappa_arith at b=2310 (imp-97096's quoted 0.570495). Cause: r(b) is
 * driven by the L0 Euler-Maclaurin remainder R0(b) = L0(b)/phi(b) - (log b - 1), a Moebius sum over
 * d|b of Stirling remainders; for smooth b this divisor sum cancels, so R0 drops from ~4.5e-4 (general
 * b~9973) to ~2.5e-6 (b=30030). The rate is therefore modulus-dependent (2^omega(b) structure), which
 * is exactly why the imp-97096 residual is an ABSOLUTE remainder-bound sub-gap, not a uniform O(1/b).
 *
 * -------------------------------------------------------------------------------
 * RESULT 3 -- the two Euler-Maclaurin remainders, sized separately.
 * -------------------------------------------------------------------------------
 * The M-part -(1/2)(L1 - b L0) carries the o-term through two normalized remainders:
 *     R0(b) = L0(b)/phi(b)      - (log b - 1),        R1(b) = L1(b)/(phi(b) b) - ((1/2) log b - 1/4).
 * Measured (general b): R0 = 2.23e-2 (101) -> 4.54e-4 (9973) is O(log b / b) and DOMINATES; R1 =
 * -2.44e-3 (101) -> -2.51e-5 (9973) is ~one order smaller (O(1/b)). Since r(b) inherits the b*R0(b)/b
 * scale, R0 is what sets the O(log b / b) rate -- consistent with the imp-97096 sub-gap identifying
 * L0(b) as the object needing an explicit Moebius/Stirling remainder bound.
 *
 * -------------------------------------------------------------------------------
 * VERDICT (honest; no bound moved).
 * -------------------------------------------------------------------------------
 * The imp-97096 exact leading coefficient kappa_arith = (3/2) C - 3/8 is certified numerically: the
 * ratio F_arith(b)/(phi(b) b) approaches it at rate O(log b / b) (coefficient ~1/4) on general moduli
 * and orders faster on smooth/primorial moduli, so the o(phi(b) b) error term is of size O(phi(b) log b),
 * the expected rate. This is a measurement only; it does NOT supply the explicit uniform remainder bound
 * (the imp-97096 sub-gap), which stays open because the rate is modulus-dependent (2^omega(b)). No bound
 * moved; T ~ 2.594e7 trace anchor unchanged; no refereed bound is changed; RH open; NO QED.
 *
 * @see imp-97096-route-m-arith-first-moment-evaluation.js (the exact kappa_arith + explicit-remainder sub-gap)
 * @see imp-97071-route-m-lower-companion-first-moment-reduction.js (the parent CS first-moment reduction)
 *
 * Ticket: imp-97122 (accuracy, opus-4-8, api-pool). Measurement; NO QED.
 */

const GAMMA = 0.5772156649015329;
const C = (Math.log(2 * Math.PI) - GAMMA) / 2; // (log 2pi - gamma)/2 = 0.6303307...

// EXACT leading coefficient of F_arith(b)/(phi(b) b), recomputed self-containedly (imp-97096).
export const IMP97122_KAPPA_ARITH = 1.5 * C - 3 / 8; // = 0.5704960511308594

// -- exact O(b) kernel (self-checks up to a modest b at import) --
const gcd = (x, y) => (y === 0 ? x : gcd(y, x % y));
const Aab = (a, b) => C * (a + b) + 0.5 * (a - b) * Math.log(b / a);

// F_arith(b)/(phi b) - kappa (the normalized residual r(b)), plus L0,L1 EM remainders.
function measure(b) {
  let phi = 0, F = 0, L0 = 0, L1 = 0;
  for (let a = 1; a < b; a++) {
    if (gcd(a, b) === 1) {
      phi += 1;
      F += Aab(a, b);
      const la = Math.log(a);
      L0 += la;
      L1 += a * la;
    }
  }
  const r = F / (phi * b) - IMP97122_KAPPA_ARITH;
  const R0 = L0 / phi - (Math.log(b) - 1);
  const R1 = L1 / (phi * b) - (0.5 * Math.log(b) - 0.25);
  return { phi, r, R0, R1 };
}

// MEASURED ladder literals (frozen; large-b values from tmp/imp-97122-scratch runs at derivation time).
export const IMP97122_MEASURED = Object.freeze({
  // general-b: r(b) = F_arith/(phi b) - kappa_arith, monotone down to kappa from above.
  generalB: Object.freeze([
    Object.freeze({ b: 101, r: 1.2355e-2 }),
    Object.freeze({ b: 211, r: 6.7666e-3 }),
    Object.freeze({ b: 503, r: 3.2648e-3 }),
    Object.freeze({ b: 1009, r: 1.7989e-3 }),
    Object.freeze({ b: 2003, r: 9.9144e-4 }),
    Object.freeze({ b: 5003, r: 4.4259e-4 }),
    Object.freeze({ b: 9973, r: 2.3930e-4 }),
  ]),
  // primorial b: |r(b)| collapses orders below the general ladder.
  primorialB: Object.freeze([
    Object.freeze({ b: 6, absR: 5.88e-3 }),
    Object.freeze({ b: 30, absR: 6.52e-4 }),
    Object.freeze({ b: 210, absR: 3.29e-5 }),
    Object.freeze({ b: 2310, absR: 1.07e-6 }),
    Object.freeze({ b: 30030, absR: 3.60e-7 }),
  ]),
  // least-squares fit r(b)*b = c log b + d over the general-b ladder.
  rateFit: Object.freeze({ form: 'r(b)*b = c*log b + d', c: 0.2481, d: 0.1003 }),
  rateClass: 'O(log b / b)', // relative rate of r(b); absolute o-term is O(phi(b) log b)
  rateLeadingCoeff: 0.25, // c ~ 1/4
});

export const IMP97122_VERDICT = Object.freeze({
  question:
    'measure the convergence rate of F_arith(b)/(phi(b) b) to kappa_arith = (3/2)C-3/8 and size the ' +
    'o(phi(b) b) error term from the L0=Sum log a, L1=Sum a log a Euler-Maclaurin remainders',
  kappaArithConfirmed: true, // ratio approaches 0.5704960511... on both ladders
  generalRateClass: 'O(log b / b)', // r(b) = (0.248 log b + 0.100)/b
  isOneOverB: false, // NOT O(1/b): a log b factor is present (general moduli)
  oTermAbsoluteSize: 'O(phi(b) log b)', // = phi(b) b * O(log b / b)
  smoothBFaster: true, // primorial b collapses orders faster (Moebius divisor-sum cancellation)
  dominantRemainder: 'L0', // R0 = O(log b / b) dominates; R1 = O(1/b) is one order smaller
  anyBoundMoved: false,
  postsRigorousCeiling: false,
  suppliesExplicitRemainderBound: false, // rate is modulus-dependent (2^omega(b)); sub-gap stays open
  qed: false,
  conclusion:
    'The imp-97096 exact leading coefficient kappa_arith = (3/2) C - 3/8 = 0.5704960511... is certified ' +
    'numerically: F_arith(b)/(phi(b) b) approaches it at rate O(log b / b) with r(b)*b = 0.248 log b + ' +
    '0.100 on general moduli, and orders faster on smooth/primorial moduli (the Moebius divisor sum ' +
    'cancels). Hence the o(phi(b) b) error term is of absolute size O(phi(b) log b) -- the expected rate, ' +
    'one log factor above O(phi(b)) and NOT O(1/b). The dominant piece is the L0 Euler-Maclaurin ' +
    'remainder R0(b) = O(log b / b); R1(b) is O(1/b). Measurement only: no explicit uniform remainder ' +
    'bound is supplied (rate is modulus-dependent via 2^omega(b)), so the imp-97096 sub-gap stays open. ' +
    'No bound moved; T ~ 2.594e7 anchor; no refereed bound is changed; RH open; NO QED.',
});

export const IMP97122_HONEST_BANNER =
  'RH open; no refereed bound is changed; NO QED. Measurement only: the Route M arithmetic first-moment ' +
  'ratio F_arith(b)/(phi(b) b) converges to the exact kappa_arith = (3/2) C - 3/8 = 0.5704960511... at ' +
  'rate O(log b / b) (r(b)*b = 0.248 log b + 0.100) on general moduli and orders faster on smooth/primorial ' +
  'moduli, so the o(phi(b) b) error term is O(phi(b) log b). This certifies the imp-97096 derivation ' +
  'numerically but supplies NO explicit uniform remainder bound -- that sub-gap stays open; no bound moved.';

// -- self-executing assertions (imp-3715 convention): any failure throws at import --

const IMP97122_ASSERTIONS = [
  {
    id: 'imp97122-kappa-arith-value',
    holds: () =>
      Math.abs(IMP97122_KAPPA_ARITH - (1.5 * C - 0.375)) < 1e-15 &&
      Math.abs(IMP97122_KAPPA_ARITH - 0.5704960511308594) < 1e-12,
    why: 'kappa_arith = (3/2) C - 3/8 = 0.5704960511308594, recomputed self-containedly from gamma and log 2pi (matches imp-97096).',
  },
  {
    id: 'imp97122-general-rate-recompute',
    holds: () => {
      // Recompute r(b) at three modest general b and match the frozen literals + monotone decrease.
      const checks = [[101, 1.2355e-2], [503, 3.2648e-3], [2003, 9.9144e-4]];
      let prev = Infinity;
      for (const [b, lit] of checks) {
        const { r } = measure(b);
        if (Math.abs(r - lit) > 1e-6) return false; // literal reproduced
        if (r <= 0 || r >= prev) return false; // positive and monotone down
        prev = r;
      }
      return true;
    },
    why: 'the frozen general-b residuals r(b) are reproduced by an independent O(b) recompute and are positive and monotone decreasing toward kappa_arith from above.',
  },
  {
    id: 'imp97122-rate-is-log-over-b-not-one-over-b',
    holds: () => {
      // r(b)*b must GROW (like log b), not settle to a constant -> rate is O(log b/b), not O(1/b).
      const small = measure(211).r * 211;
      const large = measure(2003).r * 2003;
      if (!(large > small)) return false; // r*b grows -> log factor present
      // and the fitted slope c ~ 1/4 (loose window)
      const c = IMP97122_MEASURED.rateFit.c;
      return c > 0.15 && c < 0.35 && IMP97122_VERDICT.isOneOverB === false;
    },
    why: 'r(b)*b grows from b=211 to b=2003 (a log b factor is present), so the convergence is O(log b / b) with fitted coefficient c ~ 1/4, not O(1/b).',
  },
  {
    id: 'imp97122-smooth-b-faster-and-L0-dominates',
    holds: () => {
      // primorial b=210 residual is orders below the general b~211 residual (smooth converges faster).
      const { r: rGen, R0, R1 } = measure(211);
      const { r: rPrim } = measure(210);
      if (!(Math.abs(rPrim) < 0.05 * Math.abs(rGen))) return false; // smooth much faster
      if (!(Math.abs(R0) > Math.abs(R1))) return false; // on general b, L0 remainder dominates R1
      return true;
    },
    why: 'at primorial b=210 the residual is orders below the neighbouring general b=211 (Moebius divisor-sum cancellation), and on general b=211 the L0 Euler-Maclaurin remainder R0 dominates R1, matching the sub-gap that names L0.',
  },
  {
    id: 'imp97122-honesty-gate-no-qed',
    holds: () =>
      IMP97122_VERDICT.anyBoundMoved === false &&
      IMP97122_VERDICT.postsRigorousCeiling === false &&
      IMP97122_VERDICT.suppliesExplicitRemainderBound === false &&
      IMP97122_VERDICT.qed === false &&
      IMP97122_VERDICT.kappaArithConfirmed === true &&
      /NO QED/.test(IMP97122_HONEST_BANNER) &&
      /PT Lambda <= 0.2|refereed bound is changed/.test(IMP97122_HONEST_BANNER) &&
      /RH open/.test(IMP97122_HONEST_BANNER),
    why: 'measurement only: the rate is quantified (O(log b / b), coeff ~1/4) but no uniform remainder bound is supplied and no bound moved -- honesty markers present, no QED.',
  },
];

for (const a of IMP97122_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-97122-route-m-arith-first-moment-convergence-rate assertion failed: ${a.id}`,
    );
  }
}

export default {
  kappaArith: IMP97122_KAPPA_ARITH,
  measured: IMP97122_MEASURED,
  verdict: IMP97122_VERDICT,
  banner: IMP97122_HONEST_BANNER,
};
