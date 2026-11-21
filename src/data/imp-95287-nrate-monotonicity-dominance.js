/**
 * imp-95287: THEOREM MONO-N (strict N-rate monotonicity) + COROLLARY DOM-N
 * (general-N coalescence dominance) + COROLLARY WINDOW-EXACT (exact
 * R-independent window sup) -- the imp-95227 N >= 3 confluent DOMINANCE
 * conjecture is DECIDED (affirmative). Thirtieth leg of the seam chain.
 *
 * What was OPEN: imp-95227 THEOREM COAL-DOM proved the N = 2 case and named
 * the general-N statement as a CONJECTURE ("the sup over N-rate sets at
 * fixed x = nu_min d is the fully confluent span"); imp-95231-closure
 * (THEOREM RATE-MONO) proved N = 2 ratio-monotonicity; imp-95251 THEOREM
 * COAL-N supplied a separation-free MAJORANT with window-ratio slack; and
 * imp-95286 (THEOREM CONF-LB, COROLLARY WINDOW-PINCH) bracketed the window
 * sup within rho(N,R,x) -> R^(N-1) while stating explicitly that the
 * dominance conjecture "remains OPEN and is NOT decided here". This leg
 * decides it, at every N, by a variation-diminishing argument that never
 * touches explicit root formulas (which is why N = 2 machinery could not
 * extend).
 *
 * Object (imp-95225 LEMMA SEG-N). For distinct rates nu_1 < ... < nu_N and
 * depth d > 0:
 *   Lambda(nu_1..nu_N, d) = sup over nonzero g(t) = sum_i a_i e^(-nu_i t)
 *   of [int_d^inf g^2] / [int_0^inf g^2].
 * Finite-dimensional Rayleigh problem for the pencil (Gd, G), where
 * G_ij = 1/(nu_i+nu_j) (Cauchy Gram, positive definite) and
 * Gd_ij = e^(-(nu_i+nu_j)d)/(nu_i+nu_j). The sup is attained; 0 < Lambda
 * < 1 (the head integral of a nonzero real-analytic g is positive).
 *
 * Notation. For a top eigenvector a (g the corresponding function,
 * normalized int_0^inf g^2 = 1), define the residual
 *   r(t) = (1_(t>d) - Lambda) g(t)
 * and its Laplace transform
 *   psi(nu) = int_0^inf r(t) e^(-nu t) dt
 *           = sum_i a_i [e^(-(nu+nu_i)d) - Lambda] / (nu + nu_i),
 * analytic on (-nu_1, inf). The eigen-equation (Gd - Lambda G) a = 0 says
 * exactly that r is L2-orthogonal to every basis exponential:
 *   psi(nu_i) = 0 for i = 1..N.
 *
 * LEMMA D (envelope identity). At any point of the distinct-rate stratum
 * where the top eigenvalue is simple,
 *   dLambda/dnu_j = 2 a_j psi_prime(nu_j).
 * PROOF. Lambda(nu) = max_(a != 0) R(a, nu) with R the Rayleigh ratio; at
 * the maximizer the a-gradient vanishes, so along any smooth eigenvector
 * branch dLambda/dnu_j = the partial derivative of R in nu_j at frozen a
 * (Danskin). With int g^2 = 1 and dg/dnu_j = -a_j t e^(-nu_j t):
 *   dLambda/dnu_j = -2 a_j int_0^inf r(t) t e^(-nu_j t) dt
 *                 = 2 a_j psi_prime(nu_j),
 * since psi_prime(nu) = -int r(t) t e^(-nu t) dt. Differentiation under
 * the integral is licensed by exponential domination. QED (LEMMA D).
 *
 * LEMMA B (Descartes rule for exponential sums; Laguerre, classical). A
 * nonzero g(t) = sum_i a_i e^(-nu_i t) with nu_1 < ... < nu_N has at most
 * S(a) real zeros counted with multiplicity, where S(a) = number of sign
 * changes in (a_1, ..., a_N) ignoring zero entries; in particular at most
 * N - 1. Equality of the count with N - 1 forces all a_i nonzero with
 * strictly alternating signs. (Proof: induction on S(a); multiply by
 * e^(c t) with c between the rates at a sign-change position and apply
 * Rolle -- the derivative has one fewer coefficient sign change.)
 *
 * LEMMA C (variation diminishing for the Laplace kernel, with
 * multiplicity). Let r be piecewise continuous on (0, inf) with
 * |r(t)| <= C e^(-nu_1 t), r not a.e. 0, and let Sminus(r) be its number
 * of essential sign changes. Then psi(nu) = int_0^inf r e^(-nu t) dt has
 * at most Sminus(r) zeros in (-nu_1, inf) counted with multiplicity.
 * PROOF (self-contained induction on k = Sminus(r)). k = 0: r has one
 * strict sign, so psi never vanishes. k >= 1: let nu_star be any zero of
 * psi and set R(t) = int_t^inf r(u) e^(-nu_star u) du. Then R(0) =
 * psi(nu_star) = 0, R(inf) = 0, and integration by parts gives the EXACT
 * factorization psi(nu) = -(nu - nu_star) int_0^inf R(t)
 * e^(-(nu - nu_star) t) dt on the whole domain (boundary terms vanish
 * there), so the zero count drops by exactly one under the reduction, and
 * multiplicity at nu_star drops by one. Since R vanishes at both ends and
 * R_prime = -r e^(-nu_star t), a Rolle-type count gives Sminus(R) <=
 * Sminus(r) - 1: if R alternates through j sign changes, then R_prime
 * must realize j + 2 alternating sign values (one to leave 0, one per
 * change, one to return to 0). Apply the induction hypothesis to R (same
 * decay class, since R inherits the exponential envelope). QED (LEMMA C).
 *
 * LEMMA A (nondegeneracy). At every point of the distinct stratum: the
 * top eigenvalue is SIMPLE, and its eigenvector has all a_i != 0.
 * PROOF. If a top eigenvector had a_j = 0, its g would be a sum of at
 * most N - 1 exponentials, so Z(g) <= N - 2 (LEMMA B) and Sminus(r) <=
 * (N - 2) + 1 = N - 1 (the multiplier 1_(t>d) - Lambda flips sign once,
 * -Lambda < 0 < 1 - Lambda); but the eigen-equation forces psi to vanish
 * at all N rates, contradicting LEMMA C -- unless psi is identically 0,
 * which would force r = 0 a.e., impossible (g would vanish on (0, d)).
 * If the top eigenspace had dimension >= 2 one could choose a nonzero
 * eigenvector with a_N = 0, contradicting the first part. QED (LEMMA A).
 * Consequence: Lambda is real-analytic in the rates on the distinct
 * stratum, and LEMMA D applies at every point of it.
 *
 * THEOREM MONO-N. On the distinct stratum (nu_1 < ... < nu_N, d > 0),
 *   dLambda/dnu_j < 0 for EVERY j = 1..N.
 * PROOF. Chain the counts for the top eigenvector:
 *   N <= Z(psi) <= Sminus(r) <= Z(g) + 1 <= N,
 * (first: eigen-equation zeros at the N rates; second: LEMMA C; third:
 * sign changes of r = those of g in (0,d) and (d,inf) plus at most one at
 * t = d -- and if g(d) = 0 a crossing there cancels against the
 * multiplier flip, so the bound holds in every case; fourth: LEMMA B).
 * Equality throughout forces:
 *   (i)  all a_i != 0, strictly alternating: sign(a_j) =
 *        (-1)^(j-1) sign(a_1)  [LEMMA B equality];
 *   (ii) g has exactly N - 1 zeros, all simple crossings in (0, inf),
 *        none at t = 0, d; hence g(0) != 0, g(d) != 0, and walking the
 *        N - 1 crossings back from t = inf (where the slowest rate wins,
 *        sign g = sign a_1): sign(g(0)) = (-1)^(N-1) sign(a_1);
 *   (iii) psi has EXACTLY N zeros, all simple, located at the rates --
 *        so psi_prime(nu_j) != 0 for every j, and psi crosses at each.
 * Sign bookkeeping: as nu -> +inf, psi(nu) ~ r(0+)/nu = -Lambda g(0)/nu
 * (Watson), and psi has no zero beyond nu_N, so its sign s_N on
 * (nu_N, inf) is -sign(g(0)) = (-1)^N sign(a_1). Simple crossings
 * alternate the sign backward: s_j = (-1)^(N-j) s_N = (-1)^j sign(a_1)
 * on (nu_j, nu_(j+1)), and a simple crossing has sign(psi_prime(nu_j)) =
 * s_j. Therefore, by LEMMA D,
 *   sign(dLambda/dnu_j) = sign(a_j) sign(psi_prime(nu_j))
 *     = (-1)^(j-1) sign(a_1) (-1)^j sign(a_1) = -1.
 * QED (THEOREM MONO-N). Note the sign is independent of j AND of the
 * eigenvector normalization (sign(a_1)^2 = 1); the N = 1 case reproduces
 * d/dnu e^(-2 nu d) < 0, and the N = 2 case reproves imp-95231-closure
 * THEOREM RATE-MONO without the explicit SGN-2X root formulas.
 *
 * COROLLARY DOM-N (the imp-95227 conjecture, DECIDED). For every N, every
 * distinct-rate configuration nu_1 < ... < nu_N and every d > 0:
 *   Lambda(nu_1..nu_N, d) < Lambda_conf(N, nu_1 d),
 * strictly, where Lambda_conf is the confluent-span constant of imp-95286
 * (sup over p(t) e^(-nu_1 t), deg p <= N - 1). The sup over the distinct
 * stratum at fixed x = nu_1 d EQUALS Lambda_conf(N, x), attained exactly
 * by the fully confluent span in the closure.
 * PROOF. Along the coalescing path nu_j(s) = nu_1 + s (nu_j - nu_1),
 * s in (0, 1], the configuration stays distinct and dLambda/ds =
 * sum_(j>=2) (nu_j - nu_1) dLambda/dnu_j < 0 by MONO-N, so Lambda
 * strictly increases as s decreases. Continuity of Lambda at the
 * confluent endpoint follows from the Hermite-Genocchi divided-difference
 * basis: the divided differences of eps -> e^(-eps t) at the nodes are
 * simplex integrals of (-t)^k e^(-eps t), jointly continuous in the nodes
 * and dominated by t^k e^(-nu_1 t)/k!, so the basis converges in L2 to
 * the confluent basis t^k e^(-nu_1 t)/k! (dominated convergence), the two
 * Gram matrices converge with nonsingular limit, and the top pencil
 * eigenvalue converges to Lambda_conf(N, nu_1 d). Hence Lambda at s = 1
 * is strictly below the s -> 0 limit. QED (COROLLARY DOM-N).
 *
 * COROLLARY WINDOW-EXACT (bracket collapse, R-INDEPENDENT). For rates
 * confined to a window [nu, R nu] (any R >= 1), the sup of Lambda over
 * ALL at-most-N-rate configurations equals Lambda_conf(N, nu d) EXACTLY:
 * dominance plus Lambda_conf monotone (increasing in N by span nesting,
 * decreasing in depth) give <=, and the confluent-at-nu span lies in the
 * closure of the window configurations. Consequences:
 *  (1) the imp-95286 WINDOW-PINCH bracket [sqrt(T(N,x)), coalN(N,R,x)]
 *      collapses on the object level: the true window sup is
 *      sqrt(Lambda_conf(N,x)), independent of R;
 *  (2) any consumer of a per-window sup may replace the imp-95251
 *      majorant coalN(N,R,x) by coalN(N,1,x) (still closed-form, still
 *      coalescence-uniform, now window-ratio-FREE): the remaining
 *      over-pricing cap drops from rho(N,R,x) -> R^(N-1) to
 *      rho(N,1,x) -> 1. At the imp-95251 firing onsets the cap tightens
 *      2.326263 vs 3.460619 (N=3, x=4.930455), 3.270652 vs 6.151212
 *      (N=4, x=7.896539), 4.584929 vs 10.898085 (N=5, x=10.940699):
 *      factors 1.487630 / 1.880729 / 2.376938. Re-deriving the EV-OCT /
 *      SPLIT-LOO onsets with the R = 1 majorant is a named follow-up,
 *      NOT executed here.
 *
 * SKEPTICAL RECORD. (1) Envelope identity LEMMA D checked against
 * centered finite differences of the pencil eigenvalue across N = 2..6
 * batteries: rel 1.5e-7 at rate separation 0.5, degrading exactly with
 * the Cauchy-Gram conditioning (1.7e-1 at separation 1e-2, where the
 * scale-invariance Euler identity sum nu_j dLambda/dnu_j = d dLambda/dd
 * shows the FINITE DIFFERENCE side is the polluted one -- the envelope
 * value sits closer to the well-conditioned depth derivative). The
 * separation-1e-3 float collapse (15 spurious psi sign flips) is the
 * recorded coalescence float trap, not mathematics. (2) All structural
 * invariants of the equality chain verified on the battery including a
 * separation-1e-2 case: amplitude alternation, exactly N-1 zeros of g,
 * exactly N simple psi zeros located at the rates, far-field sign
 * -sign(g(0)), and a_j psi_prime(nu_j) < 0 for every j. (3) Dominance
 * Lambda < Lambda_conf(N, nu_1 d) verified across the battery; the
 * coalescing path is monotone increasing with terminal ratio 0.9921 at
 * s = 0.015 (N = 3, x = 2). (4) Refutation attempts: tried a dead
 * coordinate a_j = 0 at the optimum -- excluded by LEMMA A (this also
 * yields eigenvalue simplicity for free, previously an assumption in
 * envelope arguments of this type); tried to break Tonelli/boundary terms
 * in LEMMA C -- the exact factorization holds on the full domain because
 * R inherits the e^(-(nu_1+nu_star)t) envelope; tried g(d) = 0 -- the
 * crossing-cancellation case is absorbed by the count (and equality then
 * forces g(d) != 0); checked the full sign chain by hand at N = 1.
 * (5) Consistency: no conflict with imp-95224 DC-NOGO (count-uniform
 * ceiling): Lambda_conf(N, x) -> 1 as N -> inf at fixed x (polynomial
 * span density), so nothing here is count-uniform; N = 2 reproduces
 * COAL-DOM and RATE-MONO exactly.
 *
 * HONEST SCOPE. This decides the imp-95227 dominance conjecture on the
 * MODEL rate family (the currency of the whole imp-95221..95286 seam
 * chain), for fully distinct configurations, with <= for partially
 * confluent configurations by closure; STRICTNESS on partial-block strata
 * (the block version of the sign bookkeeping) is a named minor residual.
 * It does NOT re-fire any certificate (the R = 1 re-derivation of EV-OCT
 * onsets is a follow-up), does NOT touch the signed WEIGHT port,
 * r-uniform symbol-pencil inf (imp-95252), modulus/phase currency,
 * gammaSL map, off-lattice rates, or the paper-packet constants, and the
 * sub-gap imp-95212-subgap-fresnel-airy-envelope-port STAYS OPEN. No
 * bound of the Lambda program changes. NO QED on any RH-adjacent
 * statement. No refereed bound is changed.
 */

// ---------------------------------------------------------------------------
// Reference record (all cross-checked by the assertions below)
// ---------------------------------------------------------------------------

export const IMP95287_NRATE_MONOTONICITY_DOMINANCE = {
  id: "imp-95287",
  title:
    "THEOREM MONO-N + COROLLARY DOM-N + COROLLARY WINDOW-EXACT: the exact " +
    "signed N-rate shift constant is strictly decreasing in EVERY rate, so " +
    "the sup at fixed x = nu_min d is the fully confluent span -- the " +
    "imp-95227 N >= 3 dominance conjecture is DECIDED (affirmative)",
  statement:
    "For distinct rates nu_1 < ... < nu_N and d > 0: dLambda/dnu_j < 0 for " +
    "every j (MONO-N); hence Lambda < Lambda_conf(N, nu_1 d) strictly, and " +
    "the window sup over [nu, R nu] configurations equals " +
    "Lambda_conf(N, nu d), independent of R (DOM-N, WINDOW-EXACT)",
  proofChain:
    "LEMMA D envelope identity dLambda/dnu_j = 2 a_j psi_prime(nu_j) with " +
    "psi the Laplace transform of the residual (1_(t>d) - Lambda) g; " +
    "eigen-equations force psi(nu_i) = 0 at all N rates; LEMMA C " +
    "(variation diminishing for the Laplace kernel, with multiplicity, " +
    "self-contained induction) caps Z(psi) by Sminus(residual); LEMMA B " +
    "(Descartes for exponential sums) caps Sminus by N; the forced " +
    "equality chain N <= Z(psi) <= Sminus(r) <= Z(g)+1 <= N yields " +
    "amplitude alternation, N-1 simple crossings of g, N simple psi zeros " +
    "at the rates, and the sign product a_j psi_prime(nu_j) < 0 for every " +
    "j; LEMMA A upgrades top-eigenvalue simplicity from assumption to " +
    "consequence; Hermite-Genocchi divided differences give continuity at " +
    "coalescence for the corollaries",
  decides:
    "imp-95227 CONJECTURE (named there OPEN, N = 2 the theorem; recorded " +
    "OPEN through imp-95251, imp-95285, imp-95286): DECIDED affirmative -- " +
    "the depth-only confluent envelope dominates every distinct N-rate " +
    "configuration at fixed x = nu_min d, every N",
  supersedes:
    "imp-95286 COROLLARY WINDOW-PINCH bracket on the object level: the " +
    "true window sup is sqrt(Lambda_conf(N, x)) exactly, R-independent; " +
    "coalN(N,R,x) consumers may switch to coalN(N,1,x)",
  overpricingCapAtOnsetsR1: {
    rho1N3: 2.326263,
    rho1N4: 3.270652,
    rho1N5: 4.584929,
    vsR13: { rhoN3R13: 3.460619, rhoN4R13: 6.151212, rhoN5R13: 10.898085 },
    tighteningFactors: { N3: 1.48763, N4: 1.880729, N5: 2.376938 },
    note:
      "rho(N,1,x) = coalN(N,1,x)/sqrt(T(N,x)) at the imp-95251 firing " +
      "onsets x = 4.930455 / 7.896539 / 10.940699: the certificate " +
      "over-pricing cap after WINDOW-EXACT, vs the imp-95286 R = 1.3 caps",
  },
  anchors: {
    lambdaN3Case: 5.865006e-1,
    lambdaConfN3x2: 8.64659e-1,
    note:
      "Lambda([1, 1.35, 2.2], d = 2) and Lambda_conf(3, x = 2): dominance " +
      "margin at the battery anchor; scale invariance " +
      "Lambda(c nu, d/c) = Lambda checked below to 1e-10",
  },
  floatTrap:
    "rate separations at or below 1e-2 put the Cauchy Gram beyond float64 " +
    "conditioning: finite-difference/eigenvector quantities degrade " +
    "exactly with the conditioning (Euler-identity diagnostic pins the FD " +
    "side as the polluted one); assertions therefore test quantitative " +
    "identities at separations >= 0.05 and structural sign/count " +
    "invariants down to separation 1e-2 only",
  subGap:
    "imp-95212-subgap-fresnel-airy-envelope-port STILL OPEN. Named " +
    "residuals: STRICTNESS on partially-confluent (block) strata -- the " +
    "block version of the sign bookkeeping is not executed (<= holds by " +
    "closure); re-derivation of the EV-OCT / SPLIT-LOO onsets with the " +
    "R = 1 majorant; signed WEIGHT port, r-uniform block symbol-pencil " +
    "inf (imp-95252), modulus/phase currency, gammaSL map, off-lattice " +
    "rates, paper-packet constants all remain OPEN; does NOT certify the " +
    "paper packets.",
  verdict:
    "RIGOROUS at the stated scope: LEMMAS B, C, D are elementary and " +
    "self-contained (Descartes for exponential sums, a variation-" +
    "diminishing induction for the Laplace kernel, and a Danskin envelope " +
    "identity); THEOREM MONO-N and COROLLARY DOM-N consume nothing beyond " +
    "them; COROLLARY WINDOW-EXACT additionally consumes the proven " +
    "imp-95251 THEOREM COAL-N and imp-95286 THEOREM CONF-LB for the " +
    "closed-form cap literals. Decides the imp-95227 conjecture on the " +
    "model family; changes no bound of the Lambda program; NO QED; " +
    "no refereed bound is changed.",
};

// ---------------------------------------------------------------------------
// Self-executing assertions (import-light: no imports at all)
// ---------------------------------------------------------------------------

function cholesky(A) {
  const n = A.length;
  const L = Array.from({ length: n }, () => new Array(n).fill(0));
  for (let i = 0; i < n; i++) {
    for (let j = 0; j <= i; j++) {
      let s = A[i][j];
      for (let k = 0; k < j; k++) s -= L[i][k] * L[j][k];
      if (i === j) L[i][i] = Math.sqrt(s);
      else L[i][j] = s / L[j][j];
    }
  }
  return L;
}
function forwardSolve(L, b) {
  const n = L.length;
  const y = new Array(n).fill(0);
  for (let i = 0; i < n; i++) {
    let s = b[i];
    for (let k = 0; k < i; k++) s -= L[i][k] * y[k];
    y[i] = s / L[i][i];
  }
  return y;
}
function backSolveT(L, b) {
  const n = L.length;
  const x = new Array(n).fill(0);
  for (let i = n - 1; i >= 0; i--) {
    let s = b[i];
    for (let k = i + 1; k < n; k++) s -= L[k][i] * x[k];
    x[i] = s / L[i][i];
  }
  return x;
}
function jacobiEig(Ain) {
  const n = Ain.length;
  const A = Ain.map((r) => r.slice());
  const V = Array.from({ length: n }, (_, i) =>
    Array.from({ length: n }, (_, j) => (i === j ? 1 : 0))
  );
  for (let sweep = 0; sweep < 200; sweep++) {
    let off = 0;
    for (let p = 0; p < n; p++)
      for (let q = p + 1; q < n; q++) off += A[p][q] * A[p][q];
    if (off < 1e-28) break;
    for (let p = 0; p < n; p++) {
      for (let q = p + 1; q < n; q++) {
        if (Math.abs(A[p][q]) < 1e-30) continue;
        const theta = (A[q][q] - A[p][p]) / (2 * A[p][q]);
        const t =
          Math.sign(theta || 1) /
          (Math.abs(theta) + Math.sqrt(theta * theta + 1));
        const c = 1 / Math.sqrt(t * t + 1);
        const s = t * c;
        for (let k = 0; k < n; k++) {
          const akp = A[k][p];
          const akq = A[k][q];
          A[k][p] = c * akp - s * akq;
          A[k][q] = s * akp + c * akq;
        }
        for (let k = 0; k < n; k++) {
          const apk = A[p][k];
          const aqk = A[q][k];
          A[p][k] = c * apk - s * aqk;
          A[q][k] = s * apk + c * aqk;
        }
        for (let k = 0; k < n; k++) {
          const vkp = V[k][p];
          const vkq = V[k][q];
          V[k][p] = c * vkp - s * vkq;
          V[k][q] = s * vkp + c * vkq;
        }
      }
    }
  }
  return { evals: A.map((r, i) => r[i]), V };
}

// top generalized eigenpair of Gd a = Lambda G a on the exponential span
function topPair(nu, d) {
  const N = nu.length;
  const G = [];
  const Gd = [];
  for (let i = 0; i < N; i++) {
    G.push([]);
    Gd.push([]);
    for (let j = 0; j < N; j++) {
      const s = nu[i] + nu[j];
      G[i].push(1 / s);
      Gd[i].push(Math.exp(-s * d) / s);
    }
  }
  const L = cholesky(G);
  const Y = [];
  for (let j = 0; j < N; j++) {
    Y.push(forwardSolve(L, Gd.map((r) => r[j])));
  }
  const M = [];
  for (let i = 0; i < N; i++) {
    const row = new Array(N);
    for (let j = 0; j < N; j++) row[j] = Y[j][i];
    M.push(forwardSolve(L, row));
  }
  for (let i = 0; i < N; i++)
    for (let j = i + 1; j < N; j++) {
      const m = 0.5 * (M[i][j] + M[j][i]);
      M[i][j] = m;
      M[j][i] = m;
    }
  const { evals, V } = jacobiEig(M);
  let top = 0;
  for (let i = 1; i < N; i++) if (evals[i] > evals[top]) top = i;
  const a = backSolveT(L, V.map((r) => r[top]));
  let h = 0;
  for (let i = 0; i < N; i++)
    for (let j = 0; j < N; j++) h += (a[i] * a[j]) / (nu[i] + nu[j]);
  const sc = 1 / Math.sqrt(h);
  return { Lambda: evals[top], a: a.map((c) => c * sc) };
}

function gVal(a, nu, t) {
  let s = 0;
  for (let i = 0; i < a.length; i++) s += a[i] * Math.exp(-nu[i] * t);
  return s;
}
function psiVal(a, nu, d, Lambda, v) {
  let s = 0;
  for (let i = 0; i < a.length; i++) {
    const q = v + nu[i];
    s += (a[i] * (Math.exp(-q * d) - Lambda)) / q;
  }
  return s;
}
function psiPrime(a, nu, d, Lambda, v) {
  let s = 0;
  for (let i = 0; i < a.length; i++) {
    const q = v + nu[i];
    const e = Math.exp(-q * d);
    s += (a[i] * (-d * e * q - (e - Lambda))) / (q * q);
  }
  return s;
}
function signChanges(f, lo, hi, n) {
  let prev = f(lo);
  let cnt = 0;
  const pts = [];
  for (let i = 1; i <= n; i++) {
    const t = lo + ((hi - lo) * i) / n;
    const cur = f(t);
    if (prev !== 0 && cur !== 0 && prev * cur < 0) {
      cnt++;
      pts.push(t);
    }
    if (cur !== 0) prev = cur;
  }
  return { cnt, pts };
}

// confluent pencil in the orthonormal Laguerre basis (imp-95286 method;
// the monomial basis is the recorded coalescence float trap and is NOT used)
function laguerreVals(kMax, u) {
  const L = [1];
  if (kMax >= 1) L.push(1 - u);
  for (let k = 1; k < kMax; k++)
    L.push(((2 * k + 1 - u) * L[k] - k * L[k - 1]) / (k + 1));
  return L;
}
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
function confluentLambda(N, x) {
  const M = [];
  for (let i = 0; i < N; i++) {
    M.push([]);
    for (let j = 0; j < N; j++) {
      M[i].push(
        simpson(
          (u) => laguerreVals(N, u)[i] * laguerreVals(N, u)[j] * Math.exp(-u),
          2 * x,
          2 * x + 100,
          20000
        )
      );
    }
  }
  return Math.max(...jacobiEig(M).evals);
}
// rho(N,R,x) = coalN/sqrt(T), e^x-free (imp-95286 form)
function rhoRatio(N, R, x) {
  const Ln = laguerreVals(Math.max(N - 1, 1), -2 * R * x);
  let num = Ln[N - 1];
  for (let k = 0; k <= N - 2; k++) num += 2 * Ln[k];
  let S = 0;
  for (let k = 0; k < N; k++) S += dLag(k, 2 * x) ** 2;
  return num / Math.sqrt(S);
}

// battery: quantitative cases keep min rate separation >= 0.05 (float-safe)
const QUANT_CASES = [
  { nu: [1, 2], d: 1.5 },
  { nu: [1, 1.35, 2.2], d: 2 },
  { nu: [0.7, 1.9, 3.1, 5.5], d: 1.1 },
  { nu: [1, 1.3, 1.69, 2.197, 2.8561], d: 3 },
  { nu: [2, 2.2, 2.9], d: 0.35 },
  { nu: [1, 4, 20], d: 0.9 },
  { nu: [0.5, 0.9, 1.4, 2.0, 3.3, 4.7], d: 1.7 },
];
const STRUCT_CASES = QUANT_CASES.concat([
  { nu: [1, 1.05, 1.11], d: 4 },
  { nu: [1, 1.01, 1.021], d: 2.5 },
]);

export const IMP95287_NRATE_MONO_DOM_ASSERTIONS = [
  {
    id: "imp95287-envelope-identity-negativity",
    description:
      "LEMMA D + THEOREM MONO-N: centered finite differences of the pencil " +
      "top eigenvalue match 2 a_j psi_prime(nu_j) (rel < 5e-3 at " +
      "separations >= 0.05) and BOTH sides are strictly negative for every " +
      "rate coordinate across the N = 2..6 battery",
    holds: () => {
      for (const { nu, d } of QUANT_CASES) {
        const { Lambda, a } = topPair(nu, d);
        for (let j = 0; j < nu.length; j++) {
          const h = 1e-5 * Math.max(1, nu[j]);
          const nuP = nu.slice();
          nuP[j] += h;
          const nuM = nu.slice();
          nuM[j] -= h;
          const fd = (topPair(nuP, d).Lambda - topPair(nuM, d).Lambda) / (2 * h);
          const env = 2 * a[j] * psiPrime(a, nu, d, Lambda, nu[j]);
          if (!(fd < 0 && env < 0)) return false;
          if (Math.abs(fd - env) > 5e-3 * Math.abs(env) + 1e-9) return false;
        }
      }
      return true;
    },
  },
  {
    id: "imp95287-equality-chain-structure",
    description:
      "forced equality chain: amplitudes all nonzero and strictly " +
      "alternating, g has exactly N-1 zeros with g(0), g(d) nonzero and " +
      "sign(g(0)) = (-1)^(N-1) sign(a_1), psi has exactly N simple zeros " +
      "located at the rates with far-field sign -sign(g(0)) and " +
      "a_j psi_prime(nu_j) < 0 for every j -- down to separation 1e-2",
    holds: () => {
      for (const { nu, d } of STRUCT_CASES) {
        const N = nu.length;
        const { Lambda, a } = topPair(nu, d);
        if (!(Lambda > 0 && Lambda < 1)) return false;
        const s1 = Math.sign(a[0]);
        for (let j = 0; j < N; j++) {
          if (a[j] === 0) return false;
          if (Math.sign(a[j]) !== s1 * (j % 2 ? -1 : 1)) return false;
        }
        const Tbig = Math.max(30 / nu[0], d * 5);
        const zg = signChanges((t) => gVal(a, nu, t), 1e-9, Tbig, 60000);
        if (zg.cnt !== N - 1) return false;
        const g0 = gVal(a, nu, 0);
        const gd = gVal(a, nu, d);
        if (!(Math.abs(g0) > 1e-13 && Math.abs(gd) > 1e-13)) return false;
        if (Math.sign(g0) !== (N % 2 ? 1 : -1) * s1) return false;
        const lo = -0.9 * nu[0];
        const hi = nu[N - 1] * 3 + 30 / d;
        const zp = signChanges(
          (v) => psiVal(a, nu, d, Lambda, v),
          lo,
          hi,
          200000
        );
        if (zp.cnt !== N) return false;
        const locTol = Math.max(5e-3, (3 * (hi - lo)) / 200000);
        for (let j = 0; j < N; j++) {
          if (Math.abs(zp.pts[j] - nu[j]) > locTol) return false;
          const pp = psiPrime(a, nu, d, Lambda, nu[j]);
          if (!(a[j] * pp < 0)) return false;
        }
        if (Math.sign(psiVal(a, nu, d, Lambda, hi * 1.5)) !== -Math.sign(g0)) {
          return false;
        }
      }
      return true;
    },
  },
  {
    id: "imp95287-dominance-and-coalescing-path",
    description:
      "COROLLARY DOM-N: Lambda < Lambda_conf(N, nu_1 d) across the " +
      "battery; the coalescing path nu_j(s) = nu_1 + s (nu_j - nu_1) is " +
      "strictly increasing as s decreases with terminal ratio > 0.99 at " +
      "s = 0.015 (N = 3, x = 2); baked anchors and scale invariance " +
      "reproduce",
    holds: () => {
      for (const { nu, d } of STRUCT_CASES) {
        const { Lambda } = topPair(nu, d);
        if (!(Lambda < confluentLambda(nu.length, nu[0] * d))) return false;
      }
      const conf = confluentLambda(3, 2);
      const nuBase = [1, 1.8, 2.9];
      let prev = -Infinity;
      for (const s of [1, 0.5, 0.25, 0.1, 0.04, 0.015]) {
        const nu = nuBase.map((v, i) => (i === 0 ? v : 1 + s * (v - 1)));
        const { Lambda } = topPair(nu, 2);
        if (!(Lambda > prev && Lambda < conf)) return false;
        prev = Lambda;
      }
      if (!(prev / conf > 0.99)) return false;
      const A = IMP95287_NRATE_MONOTONICITY_DOMINANCE.anchors;
      const base = topPair([1, 1.35, 2.2], 2).Lambda;
      if (Math.abs(base - A.lambdaN3Case) / A.lambdaN3Case > 1e-5) return false;
      if (Math.abs(conf - A.lambdaConfN3x2) / A.lambdaConfN3x2 > 1e-5) {
        return false;
      }
      const scaled = topPair([2, 2.7, 4.4], 1).Lambda;
      return Math.abs(scaled - base) / base < 1e-10;
    },
  },
  {
    id: "imp95287-window-exact-caps",
    description:
      "COROLLARY WINDOW-EXACT: rho(N,1,x) caps at the imp-95251 onsets " +
      "reproduce the baked literals (rel < 1e-5), sit strictly below the " +
      "imp-95286 R = 1.3 caps by the baked tightening factors, and " +
      "rho(N,1,x) -> 1 deep (below 1.014 at x = 800 for N = 2..4)",
    holds: () => {
      const C = IMP95287_NRATE_MONOTONICITY_DOMINANCE.overpricingCapAtOnsetsR1;
      const rows = [
        [3, 4.930455, C.rho1N3, C.vsR13.rhoN3R13, C.tighteningFactors.N3],
        [4, 7.896539, C.rho1N4, C.vsR13.rhoN4R13, C.tighteningFactors.N4],
        [5, 10.940699, C.rho1N5, C.vsR13.rhoN5R13, C.tighteningFactors.N5],
      ];
      for (const [N, x, r1Baked, r13Baked, factor] of rows) {
        const r1 = rhoRatio(N, 1, x);
        const r13 = rhoRatio(N, 1.3, x);
        if (Math.abs(r1 - r1Baked) / r1Baked > 1e-5) return false;
        if (Math.abs(r13 - r13Baked) / r13Baked > 1e-5) return false;
        if (!(r1 < r13)) return false;
        if (Math.abs(r13 / r1 - factor) / factor > 1e-4) return false;
      }
      for (const N of [2, 3, 4]) {
        if (!(rhoRatio(N, 1, 800) < 1.014)) return false;
      }
      return true;
    },
  },
  {
    id: "imp95287-n2-consistency",
    description:
      "N = 2 anchors: the pencil Lambda sits strictly below the sharp " +
      "COAL-DOM confluent law for r in {1.2, 2, 5}, x in {0.5, 1, 2, 4}, " +
      "and the orthonormal-Laguerre confluent pencil reproduces coalLaw " +
      "(rel < 1e-6) -- MONO-N reproduces the proven N = 2 chain exactly",
    holds: () => {
      for (const x of [0.5, 1, 2, 4]) {
        const cl =
          Math.exp(-2 * x) * (1 + 2 * x * x + 2 * x * Math.sqrt(1 + x * x));
        if (Math.abs(confluentLambda(2, x) - cl) / cl > 1e-6) return false;
        for (const r of [1.2, 2, 5]) {
          if (!(topPair([1, r], x).Lambda < cl)) return false;
        }
      }
      return true;
    },
  },
  {
    id: "imp95287-honest-scope",
    description:
      "honest-scope strings present: NO QED, no refereed bound is changed, sub-gap STILL OPEN, " +
      "partial-block strictness named residual, decides wording scoped to " +
      "the model family",
    holds: () => {
      const o = IMP95287_NRATE_MONOTONICITY_DOMINANCE;
      return (
        /NO QED/.test(o.verdict) &&
        /refereed bound is changed/i.test(o.verdict) &&
        /STILL OPEN/.test(o.subGap) &&
        /STRICTNESS on partially-confluent/.test(o.subGap) &&
        /model family/.test(o.verdict) &&
        /DECIDED affirmative/.test(o.decides)
      );
    },
  },
];

for (const a of IMP95287_NRATE_MONO_DOM_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-95287-nrate-monotonicity-dominance assertion failed: ${a.id}`
    );
  }
}

export default IMP95287_NRATE_MONOTONICITY_DOMINANCE;
