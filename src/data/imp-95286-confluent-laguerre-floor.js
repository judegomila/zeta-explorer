/**
 * imp-95286: LEMMA LT (Laguerre translation identity) + THEOREM CONF-LB
 * (closed-form confluent floor) + COROLLARY CONF-EXACT (two-sided pinch of
 * the confluent asymptotics) + COROLLARY WINDOW-PINCH (rigorous bracket of
 * the window sup and of the COAL-N over-pricing) -- the FLOOR side of the
 * imp-95251 THEOREM COAL-N ledger. Twenty-ninth leg of the seam chain.
 *
 * What was only MEASURED before: imp-95251 claim (b) recorded "leading
 * order is CORRECT: coalN grows like e^(-x)(2Rx)^(N-1)/(N-1)!, and at
 * R -> 1 this matches the MEASURED exact confluent pencil leading order"
 * -- a numerical observation, not a theorem. This leg supplies the missing
 * rigorous LOWER bound in closed form and thereby proves that statement.
 *
 * Object (imp-95225 LEMMA SEG-N / imp-95251, confluent case):
 *   Lambda_conf(N, nu, d) = sup over nonzero g(t) = p(t) e^(-nu t),
 *   p a real polynomial of degree <= N-1, of
 *   [int_d^inf g^2] / [int_0^inf g^2],   x = nu d.
 * This is the confluent (all-rates-coalesced) limit span whose value the
 * imp-95227 dominance CONJECTURE proposes as the depth-only envelope, and
 * which the imp-95251 majorant coalN(N, R, x) dominates from above.
 *
 * LEMMA LT (Laguerre translation identity). For the standard Laguerre
 * polynomials L_k and any y >= 0, integers 0 <= j, m:
 *   int_0^inf L_j(u) L_m(u + y) e^(-u) du
 *     = L_(m-j)(y) - L_(m-j-1)(y)   if m >= j   (with L_(-1) := 0),
 *     = 0                            if m < j.
 * PROOF. The m < j case is orthogonality: L_m(u+y) is a polynomial of
 * degree m < j in u. For the rest, fix 0 < z < 1 and multiply the
 * classical generating function
 *   sum_m L_m(u+y) z^m = (1-z)^(-1) exp(-(u+y) z / (1-z))
 * by L_j(u) e^(-u) and integrate over u in (0, inf). Interchange is
 * licensed by Tonelli: |L_m(w)| <= e^(w/2) on w >= 0 gives
 * |L_m(u+y)| e^(-u) <= e^(y/2) e^(-u/2), and int |L_j(u)| e^(-u/2) du is
 * finite, so the double sum-integral converges absolutely for |z| < 1.
 * The classical Laplace transform int_0^inf L_j(u) e^(-s u) du =
 * (s-1)^j / s^(j+1) at s = 1/(1-z) (real s > 1 here) evaluates the
 * u-integral to z^j (1-z), and the prefactor combines to
 *   z^j exp(-y z/(1-z)) = z^j (1-z) sum_k L_k(y) z^k .
 * Matching coefficients of z^m (two power series equal on (0,1)) gives
 * exactly L_(m-j)(y) - L_(m-j-1)(y) at m >= j. QED (LEMMA LT).
 *
 * THEOREM CONF-LB (confluent Laguerre floor). For every N >= 1 and x > 0,
 * with DL_k(y) := L_k(y) - L_(k-1)(y):
 *   Lambda_conf(N, x) >= T(N, x) := e^(-2x) sum_(k=0..N-1) DL_k(2x)^2 ,
 * and T(N, x) is the EXACT Rayleigh value of the explicit trial
 * g*(t) = L_(N-1)(2 nu t) e^(-nu t) in the confluent span:
 *   T(N, x) = int_(2x)^inf L_(N-1)(u)^2 e^(-u) du .
 * PROOF. g* lies in the span (degree N-1) and int_0^inf g*^2 dt =
 * 1/(2 nu) by Laguerre orthonormality (substitute u = 2 nu t). The tail
 * integral is int_(2x)^inf L_(N-1)(u)^2 e^(-u) du after the same
 * substitution, which shifts to e^(-2x) times the squared L2(0,inf) norm
 * of H(u) = L_(N-1)(u + 2x) e^(-u/2). H is a polynomial of degree N-1 in
 * u times e^(-u/2), hence lies in span{ l_j = L_j e^(-u/2) : j < N }, an
 * orthonormal set, so PARSEVAL (equality, not just Bessel) gives
 * ||H||^2 = sum_(j<N) <H, l_j>^2, and each coefficient <H, l_j> equals
 * DL_(N-1-j)(2x) by LEMMA LT. Reindexing k = N-1-j gives the identity;
 * the Rayleigh quotient of ANY admissible trial lower-bounds the sup.
 * QED (CONF-LB).
 *
 * Sanity anchors (proved by hand, asserted below): N = 1 gives
 * T = e^(-2x), the exact single-rate value. N = 2 gives
 * T = e^(-2x)(1 + 4x^2), strictly below the sharp imp-95227 COAL-DOM
 * confluent value e^(-2x)(1 + 2x^2 + 2x sqrt(1+x^2)) -- the gap
 * 2x^2 <= 2x sqrt(1+x^2) is immediate -- with ratio -> 1 as x -> inf.
 *
 * COROLLARY CONF-EXACT (two-sided confluent pinch). Since the confluent
 * span is covered by imp-95251 THEOREM COAL-N at R = 1 (continuity
 * clause),
 *   sqrt(T(N,x)) <= sqrt(Lambda_conf(N,x)) <= coalN(N, 1, x),
 * and the ratio coalN(N,1,x)/sqrt(T(N,x)) -> 1 as x -> inf (both sides
 * are e^(-x) times polynomials in x of degree N-1 with the SAME leading
 * coefficient 2^(N-1)/(N-1)!; the lower side is the square root of a sum
 * of squares dominated by its top term DL_(N-1)(2x)^2). Hence
 *   sqrt(Lambda_conf(N, x)) = e^(-x) (2x)^(N-1)/(N-1)! (1 + o(1))
 * RIGOROUSLY two-sided, for every N. This PROVES imp-95251 claim (b),
 * which was measured-only.
 *
 * COROLLARY WINDOW-PINCH (bracket of the window sup). For rates confined
 * to [nu, R nu] the sup of sqrt(Lambda) over ALL at-most-N-rate
 * configurations satisfies
 *   sqrt(T(N,x)) <= sup <= coalN(N, R, x),
 * (lower: the confluent limit is in the closure of the window
 * configurations; upper: THEOREM COAL-N), so the bracket ratio
 *   rho(N, R, x) := coalN(N, R, x) / sqrt(T(N, x)) -> R^(N-1)
 * as x -> inf (same polynomial-leading-coefficient computation, with
 * (2R)^(N-1) against 2^(N-1)). CONSEQUENCES, both rigorous:
 * (i) COAL-N over-prices the true window sup by AT MOST rho(N, R, x) at
 *     every depth -- measured at the imp-95251 firing onsets:
 *     rho = 3.460619 (N=3, R=1.3, x=4.930455), 6.151212 (N=4, R=1.3,
 *     x=7.896539), 10.898085 (N=5, R=1.3, x=10.940699); and at R = 1,
 *     N = 2, x = 40: rho = 1.037419, reproducing the imp-95251 recorded
 *     1.0373 ratio against sharp COAL-DOM (consistency anchor).
 * (ii) any violation of the imp-95227 N >= 3 dominance CONJECTURE inside
 *     the window is capped by the explicit factor rho(N, R, x), which
 *     tends to R^(N-1): dominance can fail by at most a bounded,
 *     window-ratio-priced amount. The conjecture itself remains OPEN --
 *     nothing here decides it.
 *
 * MEASURED tightness of the floor against the exact confluent pencil
 * (orthonormal-Laguerre-basis eigensolve, well-conditioned; the monomial
 * basis is the recorded coalescence float trap and is NOT used):
 * lambda_max/T = 1.0152 / 1.0039 / 1.0017 at N = 2, x = 4 / 8 / 12;
 * 1.0991 / 1.0200 / 1.0082 at N = 3; 1.4150 / 1.0618 / 1.0225 at N = 4.
 * The floor is 1-2 percent from EXACT at moderate depth, far inside the
 * coalN ceiling slack (2.1x - 4.9x at x = 12): the two-sided bracket on
 * Lambda_conf is now dominated by the CEILING side, which relocates any
 * future sharpening effort to COAL-N itself, not the floor.
 *
 * SKEPTICAL RECORD. (1) LEMMA LT checked by direct quadrature over the
 * full grid j, m <= 6, y in {0.7, 2, 5} including all m < j zero cases:
 * worst deviation 7.1e-12. (2) The Parseval identity T(N,x) =
 * e^(-2x) sum DL_k(2x)^2 checked against direct quadrature of the tail
 * integral at N = 1..5, x = 1..10: worst rel 7.6e-14. (3) The full chain
 * floor <= lambda_max(pencil) <= coalN(N,1,x)^2 checked at N in {2,3,4},
 * x in {4,8,12}: ZERO violations. (4) N = 2 hand-verified against the
 * exact COAL-DOM law (inequality proved analytically, not just measured).
 * (5) Refutation attempts: tried to break Tonelli in LEMMA LT -- the
 * naive |L_j(u)| <= e^(u/2) bound on BOTH factors is NOT integrable (the
 * genuine trap); the proof uses the polynomial-times-e^(-u/2)
 * integrability of the j factor only, which closes it. Tried x -> 0:
 * T(N,0) = 1 (Parseval over the full basis), consistent with
 * Lambda_conf <= 1; no certificate content is claimed there. Tried to
 * push the floor above coalN at small x (would contradict the chain):
 * no violation, as forced by CONF-LB <= sup <= coalN.
 *
 * HONEST SCOPE. This is a FLOOR and a bracket: it proves no new upper
 * bound, fires no new certificate, and does NOT decide the imp-95227
 * dominance conjecture (OPEN). Sub-gap
 * imp-95212-subgap-fresnel-airy-envelope-port STILL OPEN; signed WEIGHT
 * port, r-uniform block symbol-pencil inf (imp-95252), off-lattice rates,
 * modulus/phase currency, gammaSL map all remain OPEN; does NOT certify
 * the paper packets. No bound of the Lambda program changed. NO QED.
 * No refereed bound is changed.
 */

// ---------------------------------------------------------------------------
// Reference constants (all cross-checked by the assertions below)
// ---------------------------------------------------------------------------

export const IMP95286_CONFLUENT_LAGUERRE_FLOOR = {
  id: "imp-95286",
  title:
    "LEMMA LT + THEOREM CONF-LB + COROLLARY CONF-EXACT / WINDOW-PINCH: " +
    "closed-form confluent floor Lambda_conf >= e^(-2x) sum_(k<N) " +
    "(L_k(2x) - L_(k-1)(2x))^2, proving the imp-95251 measured claim (b) " +
    "and bracketing the window sup within rho(N,R,x) -> R^(N-1)",
  statement:
    "Lambda_conf(N,x) >= T(N,x) = e^(-2x) sum_(k=0..N-1) DL_k(2x)^2 with " +
    "DL_k = L_k - L_(k-1) (Laguerre), T the EXACT Rayleigh value of the " +
    "trial L_(N-1)(2 nu t) e^(-nu t); combined with imp-95251 COAL-N: " +
    "sqrt(T) <= sqrt(Lambda_conf) <= coalN(N,1,x) with ratio -> 1, and " +
    "sqrt(T) <= sup over [nu, R nu] configs <= coalN(N,R,x) with ratio " +
    "rho -> R^(N-1)",
  proofChain:
    "LEMMA LT: int_0^inf L_j(u) L_m(u+y) e^(-u) du = DL_(m-j)(y) for " +
    "m >= j, 0 for m < j (generating function + Laplace transform of L_j, " +
    "Tonelli via |L_m(w)| <= e^(w/2) on the m factor only); THEOREM " +
    "CONF-LB: the trial tail integral int_(2x)^inf L_(N-1)^2 e^(-u) du " +
    "equals e^(-2x) sum DL_k(2x)^2 by PARSEVAL (the translated Laguerre " +
    "mode lies in the span of the first N Laguerre functions), and any " +
    "Rayleigh trial lower-bounds the sup",
  provenNowRigorous:
    "imp-95251 claim (b) (confluent leading order, previously MEASURED " +
    "only): sqrt(Lambda_conf(N,x)) = e^(-x) (2x)^(N-1)/(N-1)! (1+o(1)), " +
    "two-sided",
  floorTightnessMeasured:
    "lambda_max(exact confluent pencil)/T = 1.0152/1.0039/1.0017 (N=2, " +
    "x=4/8/12), 1.0991/1.0200/1.0082 (N=3), 1.4150/1.0618/1.0225 (N=4): " +
    "the floor sits 1-2 percent from exact at moderate depth while the " +
    "coalN ceiling slack is 2.1x-4.9x at x=12, so the ceiling side now " +
    "owns the bracket",
  overpricingCapAtOnsets: {
    rhoN3R13: 3.460619,
    rhoN4R13: 6.151212,
    rhoN5R13: 10.898085,
    rhoN2R1x40: 1.037419,
    note:
      "rho(N,R,x) = coalN(N,R,x)/sqrt(T(N,x)) evaluated at the imp-95251 " +
      "firing onsets: COAL-N can over-price the true window sup by at most " +
      "this factor there; the N=2 R=1 x=40 value reproduces the imp-95251 " +
      "recorded 1.0373 ratio against sharp COAL-DOM",
  },
  dominanceConsequence:
    "any violation of the imp-95227 N >= 3 dominance conjecture inside a " +
    "ratio-R window is capped by rho(N,R,x) -> R^(N-1); the conjecture " +
    "itself remains OPEN and is NOT decided here",
  subGap:
    "imp-95212-subgap-fresnel-airy-envelope-port STILL OPEN. The FLOOR " +
    "side of the imp-95251 COAL-N ledger is supplied in closed form; the " +
    "N >= 3 confluent DOMINANCE conjecture (imp-95227) remains OPEN " +
    "(CONF-LB brackets, it does not decide); signed WEIGHT port, " +
    "r-uniform block symbol-pencil inf (imp-95252), off-lattice rates, " +
    "modulus/phase currency, gammaSL map all remain OPEN; does NOT " +
    "certify the paper packets.",
  verdict:
    "RIGOROUS at the stated scope: LEMMA LT and THEOREM CONF-LB are " +
    "elementary and self-contained (generating function, Laplace " +
    "transform, Parseval); the corollaries additionally consume the " +
    "proven imp-95251 THEOREM COAL-N. Floor and bracket only: no new " +
    "upper bound, no certificate fires, dominance NOT decided. Changes " +
    "no bound of the Lambda program; NO QED; no refereed bound is changed" +
    ".",
};

// ---------------------------------------------------------------------------
// Self-executing assertions (import-light: no imports at all)
// ---------------------------------------------------------------------------

// Laguerre values L_0..L_kMax at u via the stable three-term recurrence
function laguerreVals(kMax, u) {
  const L = [1];
  if (kMax >= 1) L.push(1 - u);
  for (let k = 1; k < kMax; k++) {
    L.push(((2 * k + 1 - u) * L[k] - k * L[k - 1]) / (k + 1));
  }
  return L;
}

// DL_k(y) = L_k(y) - L_(k-1)(y), with L_(-1) = 0
function dLag(k, y) {
  if (k === 0) return 1;
  const L = laguerreVals(k, y);
  return L[k] - L[k - 1];
}

function simpson(f, a, b, n) {
  const h = (b - a) / n;
  let s = f(a) + f(b);
  for (let i = 1; i < n; i++) s += f(a + i * h) * (i % 2 ? 4 : 2);
  return (s * h) / 3;
}

// floor T(N, x) in closed form (THEOREM CONF-LB right side)
function floorT(N, x) {
  let S = 0;
  for (let k = 0; k < N; k++) S += dLag(k, 2 * x) ** 2;
  return Math.exp(-2 * x) * S;
}

// imp-95251 THEOREM COAL-N majorant (sqrt-Lambda currency)
function coalN(N, R, x) {
  const Ln = laguerreVals(Math.max(N - 1, 1), -2 * R * x);
  let s = Ln[N - 1];
  for (let k = 0; k <= N - 2; k++) s += 2 * Ln[k];
  return Math.exp(-x) * s;
}

// e^(x)-free bracket ratio rho(N,R,x) = coalN/sqrt(T) (safe at deep x)
function rhoRatio(N, R, x) {
  const Ln = laguerreVals(Math.max(N - 1, 1), -2 * R * x);
  let num = Ln[N - 1];
  for (let k = 0; k <= N - 2; k++) num += 2 * Ln[k];
  let S = 0;
  for (let k = 0; k < N; k++) S += dLag(k, 2 * x) ** 2;
  return num / Math.sqrt(S);
}

// exact confluent pencil lambda_max in the ORTHONORMAL Laguerre basis
// (G = I, M_jk = int_(2x)^inf L_j L_k e^(-u) du); power iteration on the
// small PSD matrix. The monomial basis is the recorded float trap; avoided.
function confluentPencilLambdaMax(N, x) {
  const M = [];
  for (let i = 0; i < N; i++) {
    M.push([]);
    for (let j = 0; j < N; j++) {
      M[i].push(
        simpson(
          (u) => laguerreVals(N, u)[i] * laguerreVals(N, u)[j] * Math.exp(-u),
          2 * x,
          2 * x + 90,
          20000
        )
      );
    }
  }
  let v = new Array(N).fill(1);
  let lam = 0;
  for (let it = 0; it < 1000; it++) {
    const w = M.map((row) => row.reduce((a, c, j) => a + c * v[j], 0));
    const n = Math.hypot(...w);
    v = w.map((c) => c / n);
    lam = n;
  }
  return lam;
}

export const IMP95286_CONFLUENT_FLOOR_ASSERTIONS = [
  {
    id: "imp95286-lt-identity",
    description:
      "LEMMA LT by direct quadrature on the full grid j, m <= 6, y in " +
      "{0.7, 2, 5}, including all m < j zero cases (worst deviation < 1e-8)",
    holds: () => {
      for (const y of [0.7, 2, 5]) {
        for (let m = 0; m <= 6; m++) {
          for (let j = 0; j <= 6; j++) {
            const I = simpson(
              (u) =>
                laguerreVals(6, u)[j] * laguerreVals(6, u + y)[m] * Math.exp(-u),
              0,
              90,
              30000
            );
            const target = j > m ? 0 : dLag(m - j, y);
            if (Math.abs(I - target) / Math.max(1, Math.abs(target)) > 1e-8) {
              return false;
            }
          }
        }
      }
      return true;
    },
  },
  {
    id: "imp95286-parseval-T",
    description:
      "THEOREM CONF-LB Parseval identity: the trial tail integral " +
      "int_(2x)^inf L_(N-1)^2 e^(-u) du equals the closed form " +
      "e^(-2x) sum_(k<N) DL_k(2x)^2, N = 1..5, x = 1..10 (rel < 1e-8)",
    holds: () => {
      for (const N of [1, 2, 3, 4, 5]) {
        for (const x of [1, 3, 6, 10]) {
          const tail = simpson(
            (u) => laguerreVals(N, u)[N - 1] ** 2 * Math.exp(-u),
            2 * x,
            2 * x + 90,
            30000
          );
          if (Math.abs(tail - floorT(N, x)) / floorT(N, x) > 1e-8) return false;
        }
      }
      return true;
    },
  },
  {
    id: "imp95286-chain-floor-pencil-coaln",
    description:
      "chain floor T <= lambda_max(exact confluent pencil, orthonormal " +
      "Laguerre basis) <= coalN(N,1,x)^2 at N in {2,3,4}, x in {4,8,12}, " +
      "plus the measured tightness anchor lambda/T = 1.0082 at N=3, x=12",
    holds: () => {
      for (const N of [2, 3, 4]) {
        for (const x of [4, 8, 12]) {
          const lo = floorT(N, x);
          const lam = confluentPencilLambdaMax(N, x);
          const up = coalN(N, 1, x) ** 2;
          if (!(lo <= lam * (1 + 1e-6))) return false;
          if (!(lam <= up * (1 + 1e-6))) return false;
        }
      }
      const r312 = confluentPencilLambdaMax(3, 12) / floorT(3, 12);
      return Math.abs(r312 - 1.0082) < 5e-3;
    },
  },
  {
    id: "imp95286-n2-hand-anchors",
    description:
      "N = 2 hand anchors: T = e^(-2x)(1 + 4x^2) exactly, T <= the sharp " +
      "imp-95227 COAL-DOM confluent value, and the ratio at x = 40 sits in " +
      "(1, 1.0002)",
    holds: () => {
      for (const x of [0.5, 1, 2, 5, 12, 40]) {
        const t = floorT(2, x);
        const hand = Math.exp(-2 * x) * (1 + 4 * x * x);
        if (Math.abs(t - hand) / hand > 1e-12) return false;
        const coalDom =
          Math.exp(-2 * x) * (1 + 2 * x * x + 2 * x * Math.sqrt(1 + x * x));
        if (!(t <= coalDom)) return false;
      }
      const ratio40 = (1 + 2 * 1600 + 2 * 40 * Math.sqrt(1601)) / (1 + 4 * 1600);
      return ratio40 > 1 && ratio40 < 1.0002;
    },
  },
  {
    id: "imp95286-conf-exact",
    description:
      "COROLLARY CONF-EXACT: rho(N,1,x) = coalN/sqrt(T) decreases toward 1 " +
      "across x = 50/200/800 for N = 2,3,4 (below 1.014 at x = 800), and " +
      "rho(2,1,40) = 1.037419 reproduces the imp-95251 recorded 1.0373 " +
      "ratio against sharp COAL-DOM",
    holds: () => {
      for (const N of [2, 3, 4]) {
        const v = [50, 200, 800].map((x) => rhoRatio(N, 1, x));
        if (!(v[0] > v[1] && v[1] > v[2] && v[2] > 1 && v[2] < 1.014)) {
          return false;
        }
      }
      return Math.abs(rhoRatio(2, 1, 40) - 1.037419) < 1e-5;
    },
  },
  {
    id: "imp95286-window-pinch",
    description:
      "COROLLARY WINDOW-PINCH: rho(N,R,x)/R^(N-1) within [0.99, 1.02] at " +
      "x = 800, R = 1.3, N = 3,4; baked over-pricing caps at the imp-95251 " +
      "onsets reproduce live (rel < 1e-5)",
    holds: () => {
      const p3 = rhoRatio(3, 1.3, 800) / 1.3 ** 2;
      const p4 = rhoRatio(4, 1.3, 800) / 1.3 ** 3;
      if (!(p3 > 0.99 && p3 < 1.02 && p4 > 0.99 && p4 < 1.02)) return false;
      const caps = IMP95286_CONFLUENT_LAGUERRE_FLOOR.overpricingCapAtOnsets;
      const checks = [
        [rhoRatio(3, 1.3, 4.930455), caps.rhoN3R13],
        [rhoRatio(4, 1.3, 7.896539), caps.rhoN4R13],
        [rhoRatio(5, 1.3, 10.940699), caps.rhoN5R13],
      ];
      return checks.every(
        ([live, baked]) => Math.abs(live - baked) / baked < 1e-5
      );
    },
  },
  {
    id: "imp95286-honest-scope",
    description:
      "honest-scope strings present: NO QED, no refereed bound is changed, dominance NOT " +
      "decided, sub-gap STILL OPEN",
    holds: () => {
      const o = IMP95286_CONFLUENT_LAGUERRE_FLOOR;
      return (
        /NO QED/.test(o.verdict) &&
        /refereed bound is changed/i.test(o.verdict) &&
        /STILL OPEN/.test(o.subGap) &&
        /NOT decided/.test(o.dominanceConsequence)
      );
    },
  },
];

for (const a of IMP95286_CONFLUENT_FLOOR_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-95286-confluent-laguerre-floor assertion failed: ${a.id}`);
  }
}

export default IMP95286_CONFLUENT_LAGUERRE_FLOOR;
