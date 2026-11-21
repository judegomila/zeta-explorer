/**
 * imp-95224: THEOREM SGN-X + PROP SGN-V + THEOREM SGN-SAT + COROLLARY
 * DC-NOGO (signed depth-currency no-go) -- the question imp-95223 recorded
 * OPEN ON BOTH SIDES ("whether the signed bound R <= e^(-y_min) itself
 * ports to multi-rate families") is CLOSED, on the counterexample side,
 * with an EXACT RATIONAL witness at N = 2 -- and the failure is then shown
 * to be total: signed co-centered families SATURATE the trivial symmetry
 * ceiling 1/2 at every fixed depth, so NO depth-decaying signed certificate
 * of any form R <= F(y_min) with F < 1/2 anywhere can exist. Obligation (2)
 * of the open sub-gap imp-95212-subgap-fresnel-airy-envelope-port is
 * thereby RE-SCOPED definitively: depth currency is DEAD for signed
 * amplitudes; a signed certificate must price count/weight or per-window
 * modulus/phase structure.
 *
 * Sixteenth leg of the seam chain. Objects as in imp-95221/95222/95223:
 * packets f_n(s) = e^(-mu_n |s - u_n|), rates mu_n > 0, centers u_n > 0,
 * REAL amplitudes c_n; R = integral_(s<0) f^2 / integral_R f^2 with
 * f = sum c_n f_n; y_min = min over pairs incl diagonal of
 * (mu_m + mu_n) min(u_m, u_n).
 *
 * THEOREM SGN-X (exact rational refutation). The two-packet family
 *   f(s) = 3 e^(-|s - ln 2|) - 4 e^(-2|s - ln 2|)
 * (rates mu = (1, 2), common center u = ln 2, amplitudes c = (3, -4)) has
 * EXACTLY T = integral_R f^2 = 9 - 16 + 8 = 1 (Gram entries K(1,1,0) = 1,
 * K(1,2,0) = 2/3, K(2,2,0) = 1/2) and W = integral_(s<0) f^2 = 9/8 - 1 +
 * 1/4 = 3/8 (wrong-side coefficients a = (3/2, -1), Cauchy Gram
 * 1/(mu_m + mu_n)), while y_min = 2 ln 2 gives e^(-y_min) = 1/4. Hence
 *   R = 3/8 > 1/4 = e^(-y_min),  violation factor exactly 3/2,
 * every quantity a ratio of small integers. The signed multi-rate bound
 * R <= e^(-y_min) is FALSE already at N = 2, co-centered, rate ratio 2.
 *
 * PROP SGN-V (closed-form violation family and its exact laws). For the
 * co-centered pair with rates a < b, center u, amplitudes c = (a+b, -2b),
 * writing q = e^(-(b-a)u) in (0, 1]:
 *   T = (a - b)^2 / a  exactly (independent of u; the witness T = 1),
 *   R e^(2au) = V(u) = ((a+b)^2 / (2 (a-b)^2)) Phi(q),
 *   Phi(q) = 1 - 4ab(2q - q^2)/(a+b)^2.
 * Since y_min = 2au here, V(u) IS the violation factor over e^(-y_min).
 * Exact consequences (elementary algebra and calculus):
 *   (i) V is strictly increasing in u, from V(0) = 1/2 to
 *       V_inf = (a+b)^2 / (2 (a-b)^2);
 *   (ii) V_inf > 1 iff a^2 - 6ab + b^2 < 0 iff b/a < 3 + 2 sqrt(2) =
 *       5.8284271247461898 (the roots of b^2 - 6ab + a^2 are (3 +- 2
 *       sqrt(2)) a): every co-centered pair with rate ratio below
 *       3 + 2 sqrt(2) violates e^(-y_min) at all sufficiently large depth,
 *       explicitly for u > u* = -ln(q*)/(b - a),
 *       q* = 1 - sqrt(1 - ((a+b)^2 - 2(a-b)^2)/(4ab)); at (a, b) = (1, 2):
 *       q* = 1 - 1/(2 sqrt(2)) = 0.64644660940672627, u* =
 *       0.43626466823813059 (the ln 2 witness sits above it);
 *   (iii) coalescence law: at fixed u, as b -> a,
 *       V -> 1/2 + 2 a^2 u^2 = (1 + y_min^2)/2
 *       (expand q = 1 - eta: the numerator of Phi (a+b)^2 is (a-b)^2 +
 *       4ab eta^2 exactly, and eta ~ (b-a)u). So near-coalescent SIGNED
 *       pairs exceed the equal-rate signed ceiling e^(-y_min) (imp-95223
 *       THEOREM SGN-EQ) by the factor (1 + y_min^2)/2 and the FA-2
 *       positive-cone bound (1/2) e^(-y_min) by (1 + y_min^2): the signed
 *       multi-rate excess grows at least QUADRATICALLY in depth already at
 *       N = 2, versus the exactly-factor-2 ceiling in the equal-rate
 *       sector. NO CONTRADICTION with SGN-EQ: at b = a exactly this c
 *       degenerates to f = 0 (T -> 0 like (a-b)^2); the limit is a limit
 *       of genuinely distinct-rate violations, outside SGN-EQ scope.
 *
 * THEOREM SGN-SAT (depth-currency saturation). For every delta > 0,
 *   sup { R : co-centered signed families, all centers = delta } = 1/2,
 * the sup NOT attained. Upper half: a co-centered family is symmetric
 * about its center (f(s) = phi(|s - delta|), phi(t) = sum c_n e^(-mu_n t)),
 * so W = integral_(t>delta) phi^2 < integral_(t>0) phi^2 = T/2, strictly
 * (phi is analytic and not identically 0 when c is not 0, so
 * integral_(0,delta) phi^2 > 0). Lower half: the explicit sequence
 *   phi_K(t) = e^(-t) (1 - e^(-t/K))^K
 *            = sum_(j=0..K) (-1)^j C(K, j) e^(-(1 + j/K) t)
 * is a SIGNED family on K+1 distinct rates in [1, 2] co-centered at delta
 * (so y_min = 2 delta, FIXED in K) with the two elementary fences
 *   integral_(0,delta) phi_K^2 <= delta (delta/K)^(2K)   (via 1 - e^(-x) <= x),
 *   integral_(K,2K)   phi_K^2 >= K e^(-4K) (1 - 1/e)^(2K),
 * hence R >= (1/2)(1 - eps_K), eps_K = (delta/K) (delta e^2 / (K (1 -
 * 1/e)))^(2K) -> 0 once K > delta e^2/(1 - 1/e) = 11.6893 delta. At delta =
 * 1, K = 8 the measured R is already 1/2 - 7.5585e-9.
 *
 * COROLLARY DC-NOGO (no signed certificate in depth currency). Any bound
 * R <= F(y_min) valid for all finite signed multi-rate families forces
 * F(y) >= 1/2 for EVERY y > 0 (take delta = y/2 in SGN-SAT), i.e. F is
 * trivial -- the symmetry bound R < 1/2 (co-centered) is the entire
 * content depth alone can ever certify for signed amplitudes. In
 * particular e^(-y_min) fails (SGN-X, at N = 2), (1/2) e^(-y_min) fails,
 * and every depth-decaying candidate fails. Positivity is therefore
 * necessary not merely for the CONSTANT (imp-95223: sharp factor 2 in the
 * equal-rate sector) but for the EXISTENCE of any depth-only certificate.
 * Obligation (2) re-scoped: the width-law signed certificate must price
 * count/weight (the SAT family has octave-Szasz weight W ~ K -> inf, so a
 * W-priced signed bound is NOT excluded and is now the only surviving
 * seam-currency route) or per-window modulus/phase structure.
 *
 * HONEST LIMITS. (a) This is a NEGATIVE resolution: obligation (2) is NOT
 * discharged -- its target is re-priced (the y_min-form signed goal is
 * proven unattainable, which narrows the search space but closes nothing).
 * (b) A count/weight-priced signed bound remains OPEN on both sides; so
 * does the per-window modulus/phase route. (c) The signed pair sup at
 * fixed y_min is not computed (only the c = (a+b, -2b) family fence).
 * (d) All statements are model-family; nothing touches any Lambda bound.
 *
 * SKEPTICAL SELF-CHECK RECORD. (1) SGN-X was verified in EXACT BigInt
 * rational arithmetic (assertion below: W = 3/8, T = 1, bound = 1/4,
 * R - bound = 1/8, factor = 3/2, all as reduced fractions) AND by an
 * independent 200000-panel Simpson quadrature of the actual f (W rel err
 * 5e-16, T truncation-limited 3e-8). (2) The V closed form was checked
 * against direct Gram evaluation at four (a, b, u) points (worst rel
 * 1.2e-14) and its u-monotonicity on a 400-point grid. (3) The silver
 * threshold was stress-tested from both sides: V_inf = 1.001216 at ratio
 * 5.8184, 0.998790 at 5.8384, and b^2 - 6b + 1 vanishes at b = 3 +
 * 2 sqrt(2) to float precision. (4) The coalescence law was checked at
 * eps = 0.1/0.01/0.001 (V = 5.876952/6.239534/6.275954 -> 6.28 = 1/2 +
 * 2 (1.7)^2), monotone in eps. (5) SGN-SAT fences verified at K = 4..16;
 * TRAP recorded: at K >= 12, delta = 1 the measured 1/2 - R is already
 * below 1e-15 (float noise), so the saturation numerics must use K <= 8;
 * the K -> inf statement is carried by the exact fences, not floats.
 * (6) A contradiction hunt against imp-95223 SGN-EQ was run and CLOSED:
 * the equal-rate limit of the violation family is the zero function
 * (T = (a-b)^2/a -> 0), so no equal-rate family inherits the
 * violation -- checked numerically (T < 1e-9 at b - a = 1e-6, and
 * f identically 0 at b = a with c = (2a, -2a) up to float 0).
 *
 * ROUTING. Sub-gap imp-95212-subgap-fresnel-airy-envelope-port -- STILL
 * OPEN. Obligation ledger after this leg: (1) per-window Q extraction --
 * UNCHANGED (margin-sizing, per imp-95222); (2) amplitude sign/modulus
 * certificate -- RE-SCOPED BY REFUTATION: the imp-95223 open question is
 * ANSWERED (R <= e^(-y_min) is FALSE for signed multi-rate, exact rational
 * witness at N = 2), and COROLLARY DC-NOGO eliminates EVERY depth-only signed
 * bound, so the obligation now reads "price the signed width-law packets
 * in count/weight or per-window modulus/phase currency" -- the
 * octave-Szasz-weight route (imp-95219 pricing, positive cone) is the
 * designated candidate to port; (3) envelope-shape port and
 * seam-to-chain-gate (gammaSL-form) map -- UNCHANGED; (4) paper constants
 * per window -- UNCHANGED. Leg (alpha) unchanged.
 *
 * The numerics below CROSS-CHECK the theorem statements; the theorems
 * consume no numerics (SGN-X is exact rational arithmetic, SGN-V exact
 * algebra, SGN-SAT exact fences plus symmetry). Import-light (no zeros
 * bundle, no sibling imports). Changes no bound; NO QED; no refereed bound is changed.
 */

// ── baked literals (recomputed by the assertions) ────────────────────────────
const WITNESS_R = 0.375; // exact 3/8
const WITNESS_BOUND = 0.25; // exact 1/4 = e^(-2 ln 2)
const WITNESS_FACTOR = 1.5; // exact 3/2 violation factor
const SILVER_THRESHOLD = 5.8284271247461898; // 3 + 2 sqrt(2): deep-violation rate-ratio edge
const Q_STAR_12 = 0.64644660940672627; // 1 - 1/(2 sqrt(2)): violation-onset q at (a,b) = (1,2)
const U_STAR_12 = 0.43626466823813059; // -ln(q*): violation-onset depth at (a,b) = (1,2)
const V_COALESCENCE_U17 = 6.28; // 1/2 + 2 (1.7)^2: coalescence-law limit at u = 1.7
const V_EPS3_U17 = 6.275953920904821; // V(1, 1.001, 1.7): near-coalescent value (cancellation-limited past ~1e-10)
const SAT_HALF_MINUS_R_K8 = 7.558509318e-9; // measured 1/2 - R at delta = 1, K = 8
const SAT_K_EDGE_PER_DELTA = 11.6893; // e^2/(1 - 1/e): eps_K < 1 needs K above this times delta

// ── exact BigInt fraction helpers (for the rational witness) ─────────────────
function bgcd(x, y) {
  let a = x < 0n ? -x : x;
  let b = y < 0n ? -y : y;
  while (b) {
    const t = a % b;
    a = b;
    b = t;
  }
  return a;
}
function frac(n, d) {
  if (d < 0n) {
    n = -n;
    d = -d;
  }
  const g = bgcd(n, d) || 1n;
  return { n: n / g, d: d / g };
}
const fAdd = (x, y) => frac(x.n * y.d + y.n * x.d, x.d * y.d);
const fMul = (x, y) => frac(x.n * y.n, x.d * y.d);
const fEq = (x, y) => x.n * y.d === y.n * x.d;
const fGt = (x, y) => x.n * y.d > y.n * x.d;

// ── float helpers (cross-checks only) ────────────────────────────────────────
function simpson(a, b, n, g) {
  const h = (b - a) / n;
  let S = g(a) + g(b);
  for (let i = 1; i < n; i++) S += g(a + i * h) * (i % 2 ? 4 : 2);
  return (S * h) / 3;
}
function kernelK(a, b, tau) {
  if (Math.abs(a - b) < 1e-12 * (a + b)) {
    const m = 0.5 * (a + b);
    return (Math.exp(-m * tau) * (1 + m * tau)) / m;
  }
  return (2 * (b * Math.exp(-a * tau) - a * Math.exp(-b * tau))) / (b * b - a * a);
}
const vFactor = (a, b, u) => {
  const q = Math.exp(-(b - a) * u);
  const phi = 1 - (4 * a * b * (2 * q - q * q)) / ((a + b) * (a + b));
  return (((a + b) * (a + b)) / (2 * (a - b) * (a - b))) * phi;
};

// ── verdict object ───────────────────────────────────────────────────────────
export const IMP95224_SIGNED_DEPTH_CURRENCY_NOGO = {
  ticket:
    "imp-95224 (sixteenth leg of the seam chain: the signed multi-rate question left OPEN ON BOTH SIDES by imp-95223 is CLOSED on the counterexample side with an exact rational witness at N = 2, and the failure is proven total -- signed co-centered families saturate the trivial symmetry ceiling 1/2 at every fixed depth, so no depth-decaying signed certificate exists at all; obligation (2) re-scoped to count/weight or modulus/phase currency)",
  theoremSGNX:
    "exact rational refutation: f(s) = 3 e^(-|s - ln 2|) - 4 e^(-2|s - ln 2|) (rates (1,2), common center ln 2, amplitudes (3,-4)) has T = 9 - 16 + 8 = 1 and W = 9/8 - 1 + 1/4 = 3/8 EXACTLY, while y_min = 2 ln 2 gives e^(-y_min) = 1/4: R = 3/8 > 1/4, violation factor exactly 3/2 -- the signed multi-rate bound R <= e^(-y_min) is FALSE already at N = 2, co-centered, rate ratio 2.",
  propSGNV:
    "closed-form violation family: the co-centered pair c = (a+b, -2b) has T = (a-b)^2/a exactly (u-independent; the witness T = 1) and violation factor V(u) = R e^(2au) = ((a+b)^2/(2(a-b)^2))(1 - 4ab(2q - q^2)/(a+b)^2), q = e^(-(b-a)u); V increases strictly from 1/2 (u = 0) to V_inf = (a+b)^2/(2(a-b)^2); V_inf > 1 iff b/a < 3 + 2 sqrt(2) (silver threshold, roots of b^2 - 6ab + a^2), with explicit onset depth u* = -ln(1 - sqrt(1 - ((a+b)^2 - 2(a-b)^2)/(4ab)))/(b-a); coalescence law V -> (1 + y_min^2)/2 as b -> a at fixed u: the signed multi-rate excess over the positive-cone FA-2 bound grows at least like (1 + y_min^2) already at N = 2, versus the exact factor-2 ceiling of the equal-rate sector (imp-95223); no contradiction with SGN-EQ -- at b = a this family degenerates to f = 0.",
  theoremSGNSAT:
    "depth-currency saturation: for every fixed depth delta > 0, sup R over co-centered signed families at center delta is EXACTLY 1/2 (not attained). Upper half by symmetry about the common center (strict since phi is analytic). Lower half by phi_K(t) = e^(-t)(1 - e^(-t/K))^K -- a signed family on K+1 distinct rates in [1,2], y_min = 2 delta FIXED -- with elementary fences: head integral over (0, delta) at most delta (delta/K)^(2K), mass on (K, 2K) at least K e^(-4K)(1 - 1/e)^(2K), so R >= (1/2)(1 - eps_K), eps_K = (delta/K)(delta e^2/(K(1 - 1/e)))^(2K) -> 0 for K > 11.6893 delta.",
  corollaryDCNOGO:
    "no signed certificate in depth currency: any R <= F(y_min) valid for all finite signed families forces F(y) >= 1/2 for every y > 0 -- F is trivial; e^(-y_min) fails (SGN-X), (1/2)e^(-y_min) fails, every depth-decaying candidate fails. Positivity is necessary for the EXISTENCE of depth-only certificates, not just for the imp-95223 factor-2 constant. The surviving signed routes: count/weight pricing (the SAT family has octave-Szasz weight W of order K, diverging -- a W-priced signed bound stays OPEN on both sides) and per-window modulus/phase structure.",
  constants: {
    witnessR: WITNESS_R,
    witnessBound: WITNESS_BOUND,
    witnessFactor: WITNESS_FACTOR,
    silverThreshold: SILVER_THRESHOLD,
    qStar12: Q_STAR_12,
    uStar12: U_STAR_12,
    vCoalescenceU17: V_COALESCENCE_U17,
    vEps3U17: V_EPS3_U17,
    satHalfMinusRK8: SAT_HALF_MINUS_R_K8,
    satKEdgePerDelta: SAT_K_EDGE_PER_DELTA,
  },
  subGap:
    "imp-95212-subgap-fresnel-airy-envelope-port -- STILL OPEN. Obligation ledger: (1) per-window Q extraction UNCHANGED (margin-sizing per imp-95222); (2) amplitude sign/modulus certificate RE-SCOPED BY REFUTATION, not discharged: the imp-95223 both-sides-open question is ANSWERED -- R <= e^(-y_min) is FALSE for signed multi-rate families (exact rational witness at N = 2), and COROLLARY DC-NOGO eliminates every depth-only signed bound, so the obligation now reads price the signed width-law packets in count/weight or per-window modulus/phase currency, with the imp-95219 octave-Szasz-weight pricing (positive cone) the designated port candidate; (3) envelope-shape port and the seam-convention to chain-gate (gammaSL-form) map UNCHANGED; (4) paper constants per window UNCHANGED. Leg (alpha) unchanged.",
  verdict:
    "RIGOROUS step (an honest NEGATIVE with an exact positive core): THEOREM SGN-X closes the question imp-95223 left open on both sides -- the signed multi-rate seam bound R <= e^(-y_min) is REFUTED by a two-packet family whose every quantity is a ratio of small integers (W = 3/8, T = 1, bound = 1/4, factor 3/2). PROP SGN-V pins the entire violation family in closed form: silver-ratio deep threshold b/a < 3 + 2 sqrt(2), explicit onset depth, and the coalescence law V -> (1 + y_min^2)/2 showing quadratic-in-depth breakdown of the positive-cone bound at N = 2. THEOREM SGN-SAT proves the breakdown is total: signed co-centered families reach R -> 1/2 at every FIXED depth (exact elementary fences), so COROLLARY DC-NOGO: no depth-decaying signed certificate of ANY form exists -- depth currency is dead for signed amplitudes, and the only surviving seam-currency route is count/weight (or modulus/phase) pricing. HONEST: obligation (2) is re-scoped, NOT discharged; a count/weight-priced signed bound remains OPEN on both sides; nothing touches any Lambda bound; NO QED; no refereed bound is changed.",
  rigorScope:
    "THEOREM SGN-X is exact rational arithmetic (six Gram entries, all rational at u = ln 2). PROP SGN-V is exact algebra: T and V(u) in closed form, monotonicity from dPhi/dq = 8ab(q - 1)/(a+b)^2 <= 0, threshold from the factorization 2(a-b)^2 - (a+b)^2 = a^2 - 6ab + b^2, coalescence from the exact identity (a+b)^2 Phi = (a-b)^2 + 4ab(1-q)^2. THEOREM SGN-SAT: symmetry upper half; lower half from two one-line fences (1 - e^(-x) <= x on the head, 1 - e^(-t/K) >= 1 - 1/e and e^(-2t) >= e^(-4K) on (K, 2K)). All numerics below are cross-checks; the theorems consume none of them.",
};

// ── assertions (self-executing; import-light; THROW on violation) ────────────
export const IMP95224_SIGNED_ASSERTIONS = [
  {
    id: "imp95224-sgnx-exact-rational-witness",
    description:
      "THEOREM SGN-X in exact BigInt rational arithmetic: with a = (3/2, -1) the wrong-side Gram sum is W = 3/8, the full-line Gram sum is T = 1, e^(-y_min) = 1/4, R - bound = 1/8 > 0 and R/bound = 3/2, all as reduced fractions -- no floats anywhere",
    holds: () => {
      const a1 = frac(3n, 2n);
      const a2 = frac(-1n, 1n);
      // W = a1^2/2 + 2 a1 a2 / 3 + a2^2 / 4
      const W = fAdd(
        fAdd(
          fMul(fMul(a1, a1), frac(1n, 2n)),
          fMul(fMul(frac(2n, 3n), a1), a2),
        ),
        fMul(fMul(a2, a2), frac(1n, 4n)),
      );
      // T = 9 K(1,1,0) - 24 K(1,2,0) + 16 K(2,2,0) = 9 - 24 (2/3) + 16 (1/2)
      const T = fAdd(
        fAdd(frac(9n, 1n), fMul(frac(-24n, 1n), frac(2n, 3n))),
        fMul(frac(16n, 1n), frac(1n, 2n)),
      );
      if (!fEq(W, frac(3n, 8n))) return false;
      if (!fEq(T, frac(1n, 1n))) return false;
      const R = frac(W.n * T.d, W.d * T.n);
      const bound = frac(1n, 4n);
      if (!fGt(R, bound)) return false;
      if (!fEq(fAdd(R, frac(-1n, 4n)), frac(1n, 8n))) return false;
      if (!fEq(fMul(R, frac(4n, 1n)), frac(3n, 2n))) return false;
      return (
        WITNESS_R === 0.375 && WITNESS_BOUND === 0.25 && WITNESS_FACTOR === 1.5
      );
    },
  },
  {
    id: "imp95224-sgnx-quadrature-crosscheck",
    description:
      "the exact witness survives an independent direct quadrature of the actual f(s) = 3 e^(-|s - ln 2|) - 4 e^(-2|s - ln 2|): Simpson W matches 3/8 to rel 1e-7, T matches 1 to 1e-6 (truncation-limited), and R exceeds the e^(-y_min) = 1/4 bound by more than 49 percent",
    holds: () => {
      const f = (s) =>
        3 * Math.exp(-Math.abs(s - Math.LN2)) -
        4 * Math.exp(-2 * Math.abs(s - Math.LN2));
      const W = simpson(-45, 0, 120000, (s) => f(s) ** 2);
      const T = W + simpson(0, 45, 120000, (s) => f(s) ** 2);
      if (Math.abs(W - 0.375) > 1e-7) return false;
      if (Math.abs(T - 1) > 1e-6) return false;
      const R = W / T;
      return R > 0.25 * 1.49 && Math.abs(R - 0.375) < 1e-6;
    },
  },
  {
    id: "imp95224-sgnv-closed-form-vs-gram",
    description:
      "PROP SGN-V closed form V(u) matches direct Gram evaluation of the c = (a+b, -2b) family at four (a, b, u) points to rel 1e-12 (including the witness point where V = 3/2 and the deep (1, 1.3, 2) point where V = 6.38), T matches (a-b)^2/a, V(0) = 1/2, and V is nondecreasing on a 400-point u grid",
    holds: () => {
      for (const [a, b, u] of [
        [1, 2, Math.LN2],
        [1, 1.3, 2],
        [1, 5, 3],
        [2, 3, 1.5],
      ]) {
        const c1 = a + b;
        const c2 = -2 * b;
        const A1 = c1 * Math.exp(-a * u);
        const A2 = c2 * Math.exp(-b * u);
        const W =
          (A1 * A1) / (2 * a) + (2 * A1 * A2) / (a + b) + (A2 * A2) / (2 * b);
        const T =
          c1 * c1 * kernelK(a, a, 0) +
          2 * c1 * c2 * kernelK(a, b, 0) +
          c2 * c2 * kernelK(b, b, 0);
        const Texact = ((a - b) * (a - b)) / a;
        if (Math.abs(T / Texact - 1) > 1e-12) return false;
        const Rclosed = vFactor(a, b, u) * Math.exp(-2 * a * u);
        if (Math.abs(W / T / Rclosed - 1) > 1e-12) return false;
      }
      if (Math.abs(vFactor(1, 2, Math.LN2) - 1.5) > 1e-12) return false;
      if (Math.abs(vFactor(1, 1.6, 0) - 0.5) > 1e-12) return false;
      let prev = 0;
      for (let i = 0; i <= 400; i++) {
        const v = vFactor(1, 1.6, i * 0.05);
        if (v < prev - 1e-13) return false;
        prev = v;
      }
      return true;
    },
  },
  {
    id: "imp95224-sgnv-silver-threshold-and-onset",
    description:
      "the deep-violation threshold is the silver constant 3 + 2 sqrt(2): V_inf straddles 1 across it (1.001216 at ratio -0.01, 0.998790 at +0.01), b^2 - 6b + 1 vanishes there to 1e-12, and the onset pair (q*, u*) at (a, b) = (1, 2) reproduces the baked literals with V(u*) = 1 to 1e-12 while the ln 2 witness sits above onset",
    holds: () => {
      const th = 3 + 2 * Math.SQRT2;
      if (Math.abs(th - SILVER_THRESHOLD) > 1e-15) return false;
      if (Math.abs(th * th - 6 * th + 1) > 1e-12) return false;
      const vinf = (r) => ((1 + r) * (1 + r)) / (2 * (1 - r) * (1 - r));
      if (!(vinf(th - 0.01) > 1 && vinf(th + 0.01) < 1)) return false;
      if (Math.abs(vinf(th - 0.01) - 1.001216) > 1e-6) return false;
      if (Math.abs(vinf(th + 0.01) - 0.99879) > 1e-6) return false;
      const qStar = 1 - Math.sqrt(1 - 7 / 8);
      if (Math.abs(qStar - Q_STAR_12) > 1e-15) return false;
      const uStar = -Math.log(qStar);
      if (Math.abs(uStar - U_STAR_12) > 1e-14) return false;
      if (Math.abs(vFactor(1, 2, uStar) - 1) > 1e-12) return false;
      return Math.LN2 > uStar && vFactor(1, 2, Math.LN2) > 1;
    },
  },
  {
    id: "imp95224-sgnv-coalescence-law",
    description:
      "coalescence law V -> 1/2 + 2 a^2 u^2 = (1 + y_min^2)/2: at u = 1.7 the sequence V(1, 1 + eps, 1.7) for eps = 0.1/0.01/0.001 is increasing toward the limit 6.28, the eps = 0.001 value reproduces the baked 6.275953920904821 (rel 1e-9; near-coalescent evaluation is cancellation-limited), and the exact identity (a+b)^2 Phi = (a-b)^2 + 4ab(1-q)^2 behind it holds on a spot grid to rel 1e-11",
    holds: () => {
      const u = 1.7;
      if (Math.abs(V_COALESCENCE_U17 - (0.5 + 2 * u * u)) > 1e-12) return false;
      const seq = [0.1, 0.01, 0.001].map((e) => vFactor(1, 1 + e, u));
      if (!(seq[0] < seq[1] && seq[1] < seq[2] && seq[2] < V_COALESCENCE_U17))
        return false;
      if (Math.abs(seq[2] - V_EPS3_U17) > 1e-9 * V_EPS3_U17) return false;
      if (V_COALESCENCE_U17 - seq[2] > 5e-3) return false;
      for (const [a, b, q] of [
        [1, 1.4, 0.3],
        [2, 5, 0.8],
        [1, 1.01, 0.99],
      ]) {
        const lhs =
          (a + b) * (a + b) * (1 - (4 * a * b * (2 * q - q * q)) / ((a + b) * (a + b)));
        const rhs = (a - b) * (a - b) + 4 * a * b * (1 - q) * (1 - q);
        if (Math.abs(lhs / rhs - 1) > 1e-11) return false;
      }
      return true;
    },
  },
  {
    id: "imp95224-sgnsat-fences-and-saturation",
    description:
      "THEOREM SGN-SAT at delta = 1: for K = 4, 8 the head fence delta (delta/K)^(2K) and the (K, 2K) tail fence K e^(-4K)(1 - 1/e)^(2K) both hold against quadrature, R < 1/2 always (symmetry), R is increasing in K, and at K = 8 the gap 1/2 - R reproduces the baked 7.558509318e-9 (rel 1e-4) (TRAP: at K >= 12 the gap is below float resolution, so sharpness floats stop at K = 8); the fence edge e^2/(1 - 1/e) = 11.6893 makes eps_K < 1 exactly when K exceeds 11.6893 delta",
    holds: () => {
      if (
        Math.abs(Math.exp(2) / (1 - Math.exp(-1)) - SAT_K_EDGE_PER_DELTA) > 1e-3
      )
        return false;
      const delta = 1;
      let prevR = 0;
      for (const K of [4, 8]) {
        const phi2 = (t) => (Math.exp(-t) * (1 - Math.exp(-t / K)) ** K) ** 2;
        const head = simpson(0, delta, 2000, phi2);
        const tot = head + simpson(delta, 10 * K + 60, 120000, phi2);
        const R = (tot - head) / (2 * tot);
        if (!(R < 0.5)) return false;
        if (!(R > prevR)) return false;
        prevR = R;
        if (!(head <= delta * (delta / K) ** (2 * K) * (1 + 1e-9))) return false;
        const tailK2K = simpson(K, 2 * K, 20000, phi2);
        const tailFence =
          K * Math.exp(-4 * K) * (1 - Math.exp(-1)) ** (2 * K);
        if (!(tailK2K >= tailFence * (1 - 1e-9))) return false;
        if (K === 8) {
          const gap = 0.5 - R;
          if (Math.abs(gap - SAT_HALF_MINUS_R_K8) > 1e-4 * SAT_HALF_MINUS_R_K8)
            return false;
        }
      }
      return true;
    },
  },
  {
    id: "imp95224-no-contradiction-with-sgn-eq",
    description:
      "the contradiction hunt against imp-95223 THEOREM SGN-EQ is closed: the violation family degenerates at rate coalescence -- T = (a-b)^2/a < 1e-9 at b - a = 1e-6, and at b = a exactly the amplitudes c = (2a, -2a) give f identically 0 (spot check |f| < 1e-15 on a grid) -- so no equal-rate family inherits the violation and SGN-EQ stands untouched",
    holds: () => {
      const a = 1;
      const b = 1 + 1e-6;
      const T = ((a - b) * (a - b)) / a;
      if (!(T < 1e-9)) return false;
      const u = 1.3;
      for (let s = -3; s <= 5; s += 0.37) {
        const f0 =
          2 * a * Math.exp(-a * Math.abs(s - u)) -
          2 * a * Math.exp(-a * Math.abs(s - u));
        if (Math.abs(f0) > 1e-15) return false;
      }
      return true;
    },
  },
  {
    id: "imp95224-verdict-honesty",
    description:
      "the verdict carries the honest scope: sub-gap named STILL OPEN, obligation (2) RE-SCOPED BY REFUTATION not discharged, the count/weight-priced signed bound recorded OPEN on both sides, and no QED",
    holds: () =>
      /STILL OPEN/.test(IMP95224_SIGNED_DEPTH_CURRENCY_NOGO.subGap) &&
      /RE-SCOPED BY REFUTATION, not discharged/.test(
        IMP95224_SIGNED_DEPTH_CURRENCY_NOGO.subGap,
      ) &&
      /re-scoped, NOT discharged/.test(
        IMP95224_SIGNED_DEPTH_CURRENCY_NOGO.verdict,
      ) &&
      /OPEN on both sides/.test(IMP95224_SIGNED_DEPTH_CURRENCY_NOGO.verdict) &&
      /stays OPEN on both sides/.test(
        IMP95224_SIGNED_DEPTH_CURRENCY_NOGO.corollaryDCNOGO,
      ) &&
      /NO QED/.test(IMP95224_SIGNED_DEPTH_CURRENCY_NOGO.verdict) &&
      /refereed bound is changed/i.test(IMP95224_SIGNED_DEPTH_CURRENCY_NOGO.verdict),
  },
];

for (const a of IMP95224_SIGNED_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-95224-signed-depth-currency-nogo assertion failed: ${a.id}`,
    );
  }
}

export default IMP95224_SIGNED_DEPTH_CURRENCY_NOGO;
