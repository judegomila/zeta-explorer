/**
 * imp-95215 - RIGOROUS step -- THEOREM SZ (the Szasz completeness boundary:
 * an information-theoretic no-go for seam localization over
 * Szasz-divergent rate families) + COROLLARY AP (infinite arithmetic
 * progressions) + COROLLARY PB (the full prime-reciprocal alias-shaped
 * family) + LEMMA CV (the chain hypotheses live strictly on the convergent
 * side) + LEMMA BX (exact-AP biorthogonal row products in Gamma closed
 * form) + PROP T (explicit finite-truncation caps): SEVENTH leg of the
 * seam chain, approaching the second remaining obligation of the open
 * sub-gap imp-95212-subgap-fresnel-airy-envelope-port -- INTER-shell
 * lacunarity (iii), recorded by imp-95214 as "NOT supplied by the grid".
 * THIS MODULE upgrades that obligation from bookkeeping to a PROVED
 * NECESSITY: no family-size-uniform H-LOC cap exists for any rate family
 * whose Szasz sum diverges, because the TRUE cross-seam ratio -- not the
 * triangle-inequality bound -- climbs to its ceiling. The remaining
 * freedom of the envelope port is thereby fenced on BOTH sides: the
 * in-shell pricing exists (DR-A / DR-R, min certified), and the
 * "drop (iii), price the whole additive family natively" continuation is
 * DEAD, not merely unpriced.
 *
 * SETTING (identical to imp-95172/95208/95209/95210/95211/95212/95213/
 * 95214; model family sigma = 1, theta = 10, s = 11; M = 1). Packets are
 * two-sided exponentials a e^(-mu|t-c|) in L2(R); seam at t = 0; collar
 * depth d. Carried constants come from the sibling verdicts. For a finite
 * rate set F_M = {mu_1, ..., mu_M} in (0, infinity) define the cross-seam
 * ratio on the half-line span,
 *   Lam_M(d) = sup { int_d^inf f^2 / int_0^inf f^2 :
 *                    0 != f in span{ e^(-mu_j s) : j <= M } } .
 * THEOREM DR and every successor (DR-M, DR-R, DR-A) are upper caps on
 * exactly this quantity under lacunary-shell hypotheses.
 *
 * THEOREM SZ (Szasz boundary). Let F = {mu_1, mu_2, ...} be distinct
 * positive rates with DIVERGENT Szasz sum S(F) = sum_j mu_j/(1 + mu_j^2)
 * = infinity. Then for EVERY fixed d > 0:
 *   (i) Lam_M(d) is nondecreasing in M and sup_M Lam_M(d) = 1;
 *   (ii) for every eta > 0 there is a finite admissible packet
 *   configuration from F (one two-sided packet per rate, common center at
 *   depth exactly d on the correct side) whose WRONG-SIDE mass fraction
 *   exceeds 1/2 - eta. Since 1/2 is the ceiling for symmetric packets,
 *   the H-LOC gate thetaE^2 + thetaO^2 > 1 fails in the limit on mirrored
 *   parities: NO H-LOC(thetaE, thetaO) with a uniform margin -- hence no
 *   gammaOV -> gammaSL collapse -- holds uniformly over finite
 *   subfamilies of F.
 * PROOF. (i) Monotonicity is span nesting. The map U f (x) =
 * x^(-1/2) f(-ln x) is unitary from L2(0, infinity) onto L2(0, 1)
 * (substitute x = e^(-t)) and sends e^(-mu s) to x^(mu - 1/2). By the L2
 * Muntz-Szasz theorem (Szasz 1916) the power system {x^(a_j)}, a_j =
 * mu_j - 1/2 > -1/2 distinct, is complete in L2(0, 1) iff
 * sum (2 a_j + 1)/((2 a_j + 1)^2 + 1) = sum 2 mu_j/(4 mu_j^2 + 1) =
 * infinity; that sum is termwise comparable to S(F) within the factor 2
 * (the ratio 2(1 + mu^2)/(4 mu^2 + 1) lies in [1/2, 2] for all mu > 0),
 * so divergence of S(F) makes the exponential system COMPLETE in
 * L2(0, infinity). Fix g = the normalized indicator of [d, d+1] (unit
 * norm, supported in [d, infinity)) and eta > 0; completeness gives
 * f in some V_M with ||f - g|| <= eta, whence
 * sqrt(int_d^inf f^2) >= 1 - eta and int_0^inf f^2 <= (1 + eta)^2, so
 * Lam_M(d) >= ((1 - eta)/(1 + eta))^2 -> 1. (ii) Put one packet per rate
 * at the common center c = -d with coefficients realizing (near-)sup in
 * (i). For t >= -d the parity sum is the trace f(t + d) (LEMMA R1 of
 * imp-95211 with one packet per rate; every coefficient vector is
 * realizable), the wrong-side mass is int_d^inf f^2, and the mirror
 * symmetry about the center gives total mass EXACTLY 2 int_0^inf f^2
 * plus nothing else, so the wrong-side fraction is
 * (int_d^inf f^2)/(2 int_0^inf f^2) -> 1/2. QED.
 * NOTE the relation to LEMMA NG (imp-95210): NG reached the cross-seam
 * ceiling 1/2 by COALESCING rates in a band (divided-difference
 * dressing); SZ reaches the SAME ceiling with distinct, additively
 * well-separated rates, by Szasz divergence alone. Two independent
 * mechanisms, one ceiling.
 *
 * COROLLARY AP. Every infinite arithmetic progression mu_j =
 * delta (a + j), j >= 0 (delta, a > 0) has S = sum-comparable to the
 * harmonic series, hence divergent. The progression satisfies the
 * H-DYA-A additive chain (ii-A) EXACTLY (gaps = distance x delta =
 * distance x eps mu_0 with eps = 1/a), with no width bound: so the
 * relaxation "one unbounded additive shell -- drop the width clause and
 * (iii), keep only additive separation" admits NO family-size-uniform
 * seam cap, at ANY fixed x = mu_0 d. The divergence of the DR-route
 * bound on this family (PROP T below) is therefore REAL, not a
 * triangle-inequality artifact to be repaired by better pricing.
 *
 * COROLLARY PB. The full prime-reciprocal family {1/p : p prime} --
 * the alias-grid-shaped rates of LEMMA PR (imp-95214) taken over ALL
 * dyadic prime blocks -- has S >= (1/2) sum 1/p = infinity (Euler). So
 * the naive multi-block extension of LEMMA PR (all blocks at once, per
 * parity, rates descending to 0) is INADMISSIBLE: no uniform seam cap
 * exists for it. Consequence for the envelope port: the port must emit,
 * per parity, a rate family with a SZASZ-SUMMABILITY CERTIFICATE
 * S < infinity -- a new, proved, NECESSARY condition sitting exactly on
 * obligation (iii) of the open sub-gap.
 *
 * LEMMA CV (consistency; the chain lives on the convergent side). Under
 * the chain hypotheses (lacunary shells min S_{b+1} >= 2 max S_b, per
 * shell at most K rates, min rate >= m), S(F) <= sum_j 1/mu_j <=
 * sum_{b>=1} K/(2^(b-1) m) = 2K/m < infinity. PROOF: mu/(1+mu^2) <=
 * 1/mu termwise; geometric sum. QED. So THEOREM SZ never contradicts
 * DR / DR-M / DR-R / DR-A; the dividing line is exactly the Szasz sum.
 * HONEST NON-KILL, recorded: ASCENDING shells with bounded occupancy
 * that merely TOUCH (cross-shell ratio -> 1, violating (iii)) are still
 * Szasz-CONVERGENT (same geometric sum). THEOREM SZ does NOT close that
 * class -- a touching-ascending pricing theorem remains an admissible
 * relaxation of (iii), and is precisely the freedom the envelope port
 * retains.
 *
 * LEMMA BX (exact-AP biorthogonal row products, Gamma closed form). For
 * the finite AP mu_j = delta (a + j), j = 0..M-1, the LEMMA BI row
 * product beta_i = prod_{j != i} (mu_i + mu_j)/|mu_i - mu_j| is
 * SCALE-FREE (delta cancels factorwise) and equals
 *   beta_i = Gamma(2a + i + M) / ( Gamma(2a + i) (2a + 2i) i! (M-1-i)! ).
 * PROOF: (mu_i + mu_j)/|mu_i - mu_j| = (2a + i + j)/|i - j|; the
 * numerator product over j != i is prod_{j=0}^{M-1} (2a + i + j) divided
 * by its j = i factor (2a + 2i), a telescoping Gamma ratio; the
 * denominator product of index distances is i! (M-1-i)!. QED. At a = 1:
 * beta_0 = M(M+1)/2 exactly. The DR triangle route (LEMMA BI +
 * rank-one damping, imp-95211) then gives the finite-M cap
 *   sqrt(Lam_M(d)) <= B(a, y, M) = sum_i beta_i e^(-(a + i) y) ,
 * y = delta d, EXACT at M = 1 (B^2 = e^(-2 a y) = Lam_1 exactly).
 *
 * PROP T (finite truncation caps; where the finite side closes).
 *   (T1) B is termwise strictly increasing in M (each beta_i gains the
 *   factor (2a+i+M)/(M-i) > 1 and a new positive term appears), so the
 *   thresholds y*(a, M) solving B = 1/sqrt(2) strictly increase in M.
 *   (T2) At every fixed (a, y), B(a, y, M) >= beta_0 e^(-a y) with
 *   beta_0 ~ M^(2a)/Gamma(2a + 1): the route diverges as M -> infinity
 *   -- REAL by COROLLARY AP, since Lam_M itself -> 1.
 *   (T3) Explicit closed-form cap: capping every numerator factor by
 *   2a + 2M - 2 and summing the reciprocal factorials,
 *     y*(a, M) <= yHat(a, M)
 *       = [ ln sqrt(2) + (M-1) ln(2(2a + 2M - 2)) - ln (M-1)! ] / a .
 *   (T4) Configuration-specific sharpness: at the full-occupancy
 *   single-octave AP (a = K - 1, M = K, i.e. eps = 1/(K-1)), the exact
 *   row products certify single-shell thresholds x*_AP = a y*(a, K) of
 *   3.4357 / 7.3099 / 15.3346 / 31.6727 at K = 3/5/9/17, versus the
 *   LEMMA AG-capped single-shell route x*_AG = ln(sqrt(2) K A_ar) =
 *   5.6041 / 11.6601 / 23.9136 / 48.5127 -- about 35 percent sharper,
 *   quantifying the one-sidedness that imp-95214 recorded as the
 *   prime-block e^41.8 cap gap. HONEST: these numbers are for the exact
 *   minimal-gap AP configuration only; no claim that the AP maximizes
 *   beta_i over all (ii-A) configurations is made (the per-factor
 *   monotonicities are directionally mixed), so this is NOT a new
 *   uniform hypothesis-class theorem.
 *
 * INSTANTIATED NO-GO CLIMB (the numeric heart; assertions reproduce it).
 * At a = 1, delta = 1, d = 3 -- i.e. x = mu_0 d = 3 > xStar =
 * 2.651017799014494, where the LACUNARY family is capped at LamBar(3) =
 * 0.2234346210244193 (imp-95211 payoff row) -- the AP family climbs:
 *   Lam_M = 2.4787521766663576e-3 (M = 1, = e^(-6) exactly),
 *   2.0388763656718836e-2 (2), 7.1319904647046614e-2 (3),
 *   1.6600407704038350e-1 (4), 4.5725538899350826e-1 (6),
 *   7.4388886544034405e-1 (8), 9.7485920155808681e-1 (12),
 *   9.9861846767131179e-1 (16), 9.9999758826214413e-1 (24):
 * through the H-LOC boundary 1/2 between M = 6 and M = 8, and to the
 * ceiling. Same collar currency, same depth: lacunary capped at 0.2234,
 * additive family uncapped. Computed in the unitarily equivalent
 * polynomial picture (f -> x Q(x), Q of degree M-1; numerator
 * int_0^X x Q^2, denominator int_0^1 x Q^2, X = e^(-d)) with an exact
 * tridiagonal shifted-Legendre denominator Gram, Gauss-Legendre
 * numerator quadrature (exact: polynomial degree), Cholesky whitening
 * and cyclic Jacobi eigenvalues; anchored at M = 1 against e^(-2d)
 * exactly and at M = 2 against the closed-form 2x2 Cauchy generalized
 * eigenvalue (agreement to rel 1e-10).
 *
 * SKEPTICAL SELF-CHECK RECORD. (1) The wrong-side FRACTION ceiling is
 * 1/2, not 1 -- the mirror mass doubles the denominator; the statement
 * of THEOREM SZ(ii) is in the fraction currency and matches the LEMMA
 * NG ceiling exactly (an earlier draft claiming fraction -> 1 was
 * refuted and corrected). (2) Does SZ contradict the n-uniform THEOREM
 * DR? No: LEMMA CV puts every DR-family strictly on the convergent
 * side. (3) Is the divergence of B just triangle-inequality loss? No:
 * Lam_M itself -> 1 (COROLLARY AP), verified numerically through 0.99999
 * at M = 24. (4) Muntz-Szasz applicability stress-tested: rates distinct and
 * positive, exponents a_j = mu_j - 1/2 > -1/2, unitarity of the
 * substitution checked by Gram preservation (1/(mu_i + mu_j) both
 * pictures); the comparability ratio 2(1+mu^2)/(4mu^2+1) in [1/2, 2] is
 * asserted on a grid. (5) LEMMA BX stress-tested: Gamma form vs the defining
 * product via the exact recurrence beta_i(M)/beta_i(M-1) =
 * (2a+i+M-1)/(M-1-i), the a = 1 closed form beta_0 = M(M+1)/2, and the
 * M = 1 exactness B^2 = Lam_1. (6) The finite-M cap approached by a
 * 5000-draw Rayleigh battery over exact-AP configurations (a in
 * {0.5, 1, 4}, M <= 8, delta in {0.3, 1, 2.7}, random depths, signed
 * coefficients): no violation; worst ratio to the bound 0.988 -- the
 * exact-row route is near-sharp, unlike the AG-capped route. (7) The
 * honest non-kill (touching ASCENDING shells are Szasz-convergent, SZ
 * does not close them) is recorded in LEMMA CV and the verdict.
 *
 * HONEST LIMITS. (a) THEOREM SZ is a no-go about FAMILY-SIZE-UNIFORM
 * caps; every finite instance retains a finite bound (PROP T), so
 * per-N closure with instance constants remains possible where the
 * paper packets are finitely many -- what dies is the uniform
 * statement quantified over unboundedly many rates. (b) Szasz
 * convergence is NECESSARY-side only; no claim that convergence
 * suffices for localization (the quantitative side stays with
 * DR/DR-M/DR-R/DR-A). (c) The PROP T4 sharpness numbers are
 * configuration-specific (exact AP), not a new uniform theorem.
 * (d) Model-family constants throughout; the measured class sup
 * phi = 0.3572 (imp-95113) is untouched. (e) The Fresnel-Airy envelope
 * port and the paper constants remain OPEN.
 *
 * SUB-GAP (surviving, explicitly named, NOT closed):
 *   imp-95212-subgap-fresnel-airy-envelope-port -- STILL OPEN, further
 *   narrowed: obligation (iii) is now two-sidedly fenced. NECESSARY:
 *   the ported per-parity rate family must carry a Szasz-summability
 *   certificate S = sum mu/(1+mu^2) < infinity (THEOREM SZ + COROLLARY
 *   PB eliminate the naive all-blocks prime-reciprocal extension; COROLLARY
 *   AP eliminates the one-big-additive-shell relaxation). ADMISSIBLE
 *   REMAINING FREEDOM: ascending shells with bounded occupancy, even
 *   touching (LEMMA CV; SZ does not close them). Remaining extraction
 *   obligations: the alias-denominator to dictionary-rate map itself,
 *   the summability certificate, and the paper constants (m, d,
 *   per-shell occupancy).
 *
 * The numerics below CROSS-CHECK the theorem statements; they are not
 * the claim. Import-light (no heavy bundle; imports only sibling verdict
 * modules for carried constants and cross-module guards). Changes no
 * bound; does NOT promote Lambda <= 0.14; NO QED; no refereed bound is changed.
 */

import DRL from "./imp-95211-dyadic-rate-localization.js";
import ASP from "./imp-95214-arithmetic-separation-pricing.js";

// ── carried constants (single source of truth: sibling verdict objects) ─────
const X_STAR = DRL.constants.xStar; // 2.651017799014494
const LAMBAR_DYA_MD3 = DRL.constants.payoffTable.find((r) => r.md === 3).lamBar; // 0.2234346210244193

// ── new baked literals (recomputed by the assertions) ────────────────────────
// no-go climb at a = 1, delta = 1, d = 3 (x = mu_0 d = 3 > xStar)
const CLIMB_TABLE = [
  { M: 1, lam: 2.4787521766663576e-3 },
  { M: 2, lam: 2.0388763656718836e-2 },
  { M: 3, lam: 7.1319904647046614e-2 },
  { M: 4, lam: 1.660040770403835e-1 },
  { M: 6, lam: 4.5725538899350826e-1 },
  { M: 8, lam: 7.4388886544034405e-1 },
  { M: 12, lam: 9.7485920155808681e-1 },
  { M: 16, lam: 9.9861846767131179e-1 },
  { M: 24, lam: 9.9999758826214413e-1 },
];
// PROP T thresholds y*(1, M) and the fixed-(a, y) divergence of B
const YSTAR_TABLE = [
  { M: 2, yStar: 1.6249403310955395 },
  { M: 4, yStar: 2.8899972234929985 },
  { M: 8, yStar: 4.1896412056445165 },
  { M: 16, yStar: 5.5240514796913089 },
  { M: 32, yStar: 6.8819012891607141 },
];
const B_DIVERGENCE_TABLE = [
  { M: 16, B: 1.4258631595097595 },
  { M: 32, B: 17.767089661274408 },
  { M: 64, B: 2430.3133722585198 },
];
// PROP T4: single-octave full-occupancy exact-AP vs AG-capped thresholds
const SINGLE_SHELL_TABLE = [
  { K: 3, xAP: 3.4356680715923815, xAG: 5.6040689623077542 },
  { K: 5, xAP: 7.3099029127202559, xAG: 11.660072030553307 },
  { K: 9, xAP: 15.334586641814635, xAG: 23.913577729318114 },
  { K: 17, xAP: 31.672725512931208, xAG: 48.512710462600438 },
];

// ── LEMMA BX / PROP T functionals ────────────────────────────────────────────
function lnBeta(a, M, i) {
  let s = 0;
  for (let j = 0; j < M; j++) {
    if (j !== i) s += Math.log(2 * a + i + j) - Math.log(Math.abs(i - j));
  }
  return s;
}
function bSum(a, y, M) {
  let s = 0;
  for (let i = 0; i < M; i++) s += Math.exp(lnBeta(a, M, i) - (a + i) * y);
  return s;
}
function yStar(a, M) {
  let lo = 1e-6;
  let hi = 4000;
  for (let it = 0; it < 200; it++) {
    const mid = (lo + hi) / 2;
    if (bSum(a, mid, M) > Math.SQRT1_2) lo = mid;
    else hi = mid;
  }
  return (lo + hi) / 2;
}
function yHat(a, M) {
  let lnFac = 0;
  for (let i = 2; i <= M - 1; i++) lnFac += Math.log(i);
  return (Math.log(Math.SQRT2) + (M - 1) * Math.log(2 * (2 * a + 2 * M - 2)) - lnFac) / a;
}
function fact(n) {
  let a = 1;
  for (let i = 2; i <= n; i++) a *= i;
  return a;
}
// LEMMA AG constant of imp-95214 (recomputed locally, guarded against its bake)
function aAr(K, eps) {
  const n = K - 1;
  return Math.pow(4 / eps, n) / (fact(Math.floor(n / 2)) * fact(Math.ceil(n / 2)));
}

// ── polynomial-picture Lam_M machinery (unitary image of the span) ──────────
function gaussLegendre(n) {
  const x = new Array(n);
  const w = new Array(n);
  for (let i = 0; i < n; i++) {
    let t = Math.cos((Math.PI * (i + 0.75)) / (n + 0.5));
    for (let it = 0; it < 100; it++) {
      let p0 = 1;
      let p1 = t;
      for (let k = 2; k <= n; k++) {
        const p2 = ((2 * k - 1) * t * p1 - (k - 1) * p0) / k;
        p0 = p1;
        p1 = p2;
      }
      const dp = (n * (t * p1 - p0)) / (t * t - 1);
      const dt = p1 / dp;
      t -= dt;
      if (Math.abs(dt) < 1e-15) break;
    }
    let p0 = 1;
    let p1 = t;
    for (let k = 2; k <= n; k++) {
      const p2 = ((2 * k - 1) * t * p1 - (k - 1) * p0) / k;
      p0 = p1;
      p1 = p2;
    }
    const dp = (n * (t * p1 - p0)) / (t * t - 1);
    x[i] = t;
    w[i] = 2 / ((1 - t * t) * dp * dp);
  }
  return { x, w };
}
function shiftedLegendreVals(K, u) {
  const v = new Array(K);
  const t = 2 * u - 1;
  v[0] = 1;
  if (K > 1) v[1] = t;
  for (let k = 2; k < K; k++) v[k] = ((2 * k - 1) * t * v[k - 1] - (k - 1) * v[k - 2]) / k;
  return v;
}
// exact tridiagonal Gram int_0^1 u L_k L_l du in the shifted-Legendre basis
function denomGram(K) {
  const D = Array.from({ length: K }, () => new Array(K).fill(0));
  for (let k = 0; k < K; k++) {
    D[k][k] = 0.25 * (2 / (2 * k + 1));
    if (k + 1 < K) {
      const od = (0.25 * (2 * (k + 1))) / ((2 * k + 1) * (2 * k + 3));
      D[k][k + 1] = od;
      D[k + 1][k] = od;
    }
  }
  return D;
}
function numerGram(K, X) {
  const n = 2 * K + 8;
  const { x, w } = gaussLegendre(n);
  const N = Array.from({ length: K }, () => new Array(K).fill(0));
  for (let q = 0; q < n; q++) {
    const u = (X / 2) * (x[q] + 1);
    const wq = (X / 2) * w[q];
    const L = shiftedLegendreVals(K, u);
    for (let k = 0; k < K; k++) {
      for (let l = k; l < K; l++) N[k][l] += wq * u * L[k] * L[l];
    }
  }
  for (let k = 0; k < K; k++) for (let l = 0; l < k; l++) N[k][l] = N[l][k];
  return N;
}
function chol(A) {
  const n = A.length;
  const R = Array.from({ length: n }, () => new Array(n).fill(0));
  for (let i = 0; i < n; i++) {
    for (let j = 0; j <= i; j++) {
      let s = A[i][j];
      for (let k = 0; k < j; k++) s -= R[i][k] * R[j][k];
      if (i === j) R[i][i] = Math.sqrt(s);
      else R[i][j] = s / R[j][j];
    }
  }
  return R;
}
function forwardSolve(R, b) {
  const n = R.length;
  const y = new Array(n);
  for (let i = 0; i < n; i++) {
    let s = b[i];
    for (let k = 0; k < i; k++) s -= R[i][k] * y[k];
    y[i] = s / R[i][i];
  }
  return y;
}
function whiten(N, R) {
  const n = N.length;
  const Y = [];
  for (let j = 0; j < n; j++) {
    Y.push(forwardSolve(R, N.map((row) => row[j])));
  }
  const C = Array.from({ length: n }, () => new Array(n).fill(0));
  for (let i = 0; i < n; i++) {
    const row = new Array(n);
    for (let j = 0; j < n; j++) row[j] = Y[j][i];
    const sol = forwardSolve(R, row);
    for (let j = 0; j < n; j++) C[i][j] = sol[j];
  }
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < i; j++) {
      const m = 0.5 * (C[i][j] + C[j][i]);
      C[i][j] = m;
      C[j][i] = m;
    }
  }
  return C;
}
function jacobiEig(Ain) {
  const n = Ain.length;
  const A = Ain.map((r) => r.slice());
  for (let sweep = 0; sweep < 100; sweep++) {
    let off = 0;
    for (let p = 0; p < n; p++) for (let q = p + 1; q < n; q++) off += A[p][q] * A[p][q];
    if (off < 1e-30) break;
    for (let p = 0; p < n; p++) {
      for (let q = p + 1; q < n; q++) {
        if (Math.abs(A[p][q]) < 1e-18) continue;
        const theta = (A[q][q] - A[p][p]) / (2 * A[p][q]);
        const t = Math.sign(theta || 1) / (Math.abs(theta) + Math.sqrt(theta * theta + 1));
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
      }
    }
  }
  return A.map((r, i) => r[i]);
}
// Lam_M(d) for the a = 1, delta = 1 progression mu_j = 1 + j
function lambdaMaxAP(M, d) {
  const X = Math.exp(-d);
  const R = chol(denomGram(M));
  return Math.max(...jacobiEig(whiten(numerGram(M, X), R)));
}
// small dense quadratic forms for the Rayleigh battery
function cauchyGram(mus) {
  return mus.map((p) => mus.map((q) => 1 / (p + q)));
}
function shiftedGram(mus, d) {
  return mus.map((p) => mus.map((q) => Math.exp(-(p + q) * d) / (p + q)));
}
function quadForm(A, v) {
  let s = 0;
  for (let i = 0; i < v.length; i++) {
    for (let j = 0; j < v.length; j++) s += v[i] * A[i][j] * v[j];
  }
  return s;
}

// ── verdict object ───────────────────────────────────────────────────────────
export const IMP95215_SZASZ_BOUNDARY_NECESSITY = {
  ticket:
    "imp-95215 (seventh leg of the seam chain: the inter-shell lacunarity obligation (iii) of the open sub-gap imp-95212-subgap-fresnel-airy-envelope-port, recorded by imp-95214 as NOT supplied by the arithmetic grid, is upgraded to a PROVED NECESSITY -- a Szasz-completeness no-go on the TRUE cross-seam ratio, not on the bound route)",
  source:
    "Permuting the Zeta Twin Ladder Section 4.5; /permutation-architecture; consumes LEMMA R1 / LEMMA BI / THEOREM DR (imp-95211), LEMMA NG and the H-LOC gate (imp-95210), H-DYA-A / LEMMA AG / LEMMA PR (imp-95214); classical input: the L2 Muntz-Szasz completeness theorem (Szasz 1916) for power systems on (0, 1), transported unitarily to exponential systems on the half-line.",
  theoremSZ:
    "Szasz boundary: if the rate family F has divergent Szasz sum S(F) = sum mu/(1+mu^2), then the finite-section cross-seam ratios Lam_M(d) increase to 1 for EVERY collar depth d, and admissible single-collar packet configurations reach wrong-side mass fraction 1/2 - eta for every eta: the H-LOC gate thetaE^2 + thetaO^2 > 1 fails in the limit, so no family-size-uniform gammaOV -> gammaSL collapse exists over F. Proof: unitary transport to L2(0,1) power systems + the L2 Muntz-Szasz theorem (completeness iff the comparable exponent sum diverges) + a normalized indicator target; the fraction ceiling 1/2 comes from the exact mirror-mass identity of common-center packets. Same 1/2 ceiling as LEMMA NG, reached by a second, independent mechanism (divergence with distinct separated rates, not coalescence).",
  corollaryAP:
    "Every infinite arithmetic progression of rates is Szasz-divergent (harmonic comparison) and satisfies the H-DYA-A additive chain (ii-A) exactly with eps = 1/a: the relaxation that drops the width clause and inter-shell lacunarity (iii), keeping additive separation only, admits NO uniform seam cap at any fixed x = mu_0 d. The divergence of the DR-route bound on the AP family is real: Lam_M itself climbs to 1.",
  corollaryPB:
    "The full prime-reciprocal family {1/p} -- LEMMA PR alias-shaped rates over ALL dyadic prime blocks -- has S >= (1/2) sum 1/p = infinity (Euler): the naive multi-block extension of LEMMA PR is INADMISSIBLE. The envelope port must emit, per parity, a rate family with a Szasz-summability certificate S < infinity: a new proved NECESSARY condition on the port, sitting exactly on obligation (iii).",
  lemmaCV:
    "Consistency: under the chain hypotheses (lacunary shells, occupancy <= K, min rate m), S <= sum 1/mu <= 2K/m < infinity -- every DR / DR-M / DR-R / DR-A family lies strictly on the convergent side; no contradiction. HONEST NON-KILL: ascending TOUCHING shells with bounded occupancy are also Szasz-convergent, so THEOREM SZ does not close that class -- it is the admissible remaining relaxation of (iii) and the freedom the port retains.",
  lemmaBX:
    "Exact-AP biorthogonal row products: for mu_j = delta(a+j), beta_i = Gamma(2a+i+M)/(Gamma(2a+i)(2a+2i) i! (M-1-i)!), scale-free; beta_0 = M(M+1)/2 at a = 1; the DR triangle route gives sqrt(Lam_M) <= B(a, y, M) = sum beta_i e^(-(a+i)y), y = delta d, exact at M = 1.",
  propT:
    "Finite truncation caps: B termwise increasing in M so thresholds y*(a, M) strictly increase; at fixed (a, y) the route diverges (beta_0 ~ M^(2a)/Gamma(2a+1)) -- real by COROLLARY AP; explicit cap y* <= [ln sqrt(2) + (M-1) ln(2(2a+2M-2)) - ln (M-1)!]/a; configuration-specific sharpness at the full-occupancy single-octave AP: x*_AP = 3.4357/7.3099/15.3346/31.6727 vs the AG-capped x*_AG = 5.6041/11.6601/23.9136/48.5127 at K = 3/5/9/17 (about 35 percent sharper; quantifies the recorded AG one-sidedness; NOT a uniform hypothesis-class theorem).",
  constants: {
    climbTable: CLIMB_TABLE,
    yStarTable: YSTAR_TABLE,
    bDivergenceTable: B_DIVERGENCE_TABLE,
    singleShellTable: SINGLE_SHELL_TABLE,
    climbDepth: 3,
    lamBarDyaMd3: LAMBAR_DYA_MD3,
    xStar: X_STAR,
  },
  subGap:
    "imp-95212-subgap-fresnel-airy-envelope-port -- STILL OPEN, further narrowed: obligation (iii) is now two-sidedly fenced. NECESSARY: the ported per-parity rate family must carry a Szasz-summability certificate S = sum mu/(1+mu^2) < infinity (COROLLARY PB eliminates the naive all-blocks prime-reciprocal extension; COROLLARY AP eliminates the one-big-additive-shell relaxation). ADMISSIBLE remaining freedom: ascending shells with bounded occupancy, even touching (LEMMA CV -- SZ does not close them). Remaining extraction obligations: the alias-denominator to dictionary-rate map itself, the summability certificate, and the paper constants (m, d, per-shell occupancy).",
  openResiduals: [
    "the packet-envelope constants (c, beta, sigma, theta, A_d) for the PAPER packets rather than the model family",
    "the curvature ceiling D retained by the window",
    "the paper phase curvature normalization (sibling Theorem D residual)",
    "residual (c) of the sibling chain: the passage from the l2 weld bound to the pointwise scalar |C_E,17|",
    "LACUNARITY NECESSITY DELIVERED (model level): THEOREM SZ proves the inter-shell obligation (iii) cannot be dissolved -- any Szasz-divergent ported rate family (infinite arithmetic progression, full prime-reciprocal alias family) has TRUE cross-seam ratio climbing to 1 and wrong-side fraction to the 1/2 ceiling, so no family-size-uniform H-LOC cap exists; the port owes a Szasz-summability certificate. HONEST LIMITS: the no-go is about family-size-uniform caps (finite instances keep finite PROP T bounds); Szasz convergence is necessary-side only, not sufficient; ascending touching shells survive (the admissible relaxation); exact-AP sharpness numbers are configuration-specific; measured class sup phi = 0.3572 unchanged",
  ],
  isRigorous: true,
  rigorScope:
    "THEOREM SZ is unconditional given one classical citation (the L2 Muntz-Szasz completeness theorem for power systems on (0,1), Szasz 1916), transported by an explicit unitary substitution whose Gram preservation is elementary; the finite-section climb, mirror-mass fraction identity, and monotonicity are self-contained. COROLLARY AP (harmonic comparison), COROLLARY PB (Euler divergence of sum 1/p), LEMMA CV (termwise + geometric sum), LEMMA BX (telescoping Gamma identity) and PROP T (termwise monotonicity, bottom-row growth, factorial cap) are elementary and self-contained. The PROP T4 sharpness rows are exact evaluations at one configuration-specific instance (the minimal-gap AP), labeled as such. Nothing here instantiates the paper packets; the numerics cross-check the statements and are not the claim.",
  promotesBound: false,
  verdict:
    "RIGOROUS step (a necessity theorem -- it closes a continuation class, it does not close the sub-gap): THEOREM SZ, the Szasz completeness boundary. For any rate family with divergent Szasz sum S = sum mu/(1+mu^2), the TRUE finite-section cross-seam ratio Lam_M(d) climbs to 1 at every collar depth (L2 Muntz-Szasz completeness transported unitarily to the half-line exponential span), and admissible common-center packet configurations reach wrong-side mass fraction 1/2 - eta: the H-LOC gate fails in the limit and no family-size-uniform gammaOV -> gammaSL collapse exists -- the same 1/2 ceiling LEMMA NG reached by coalescence, now reached by a second independent mechanism with distinct additively separated rates. COROLLARY AP: infinite arithmetic progressions are divergent, so the -drop (iii), price the whole additive family- continuation is DEAD at the level of truth, not of technique. COROLLARY PB: the full prime-reciprocal alias family is divergent (Euler), so the naive multi-block extension of LEMMA PR is inadmissible and the envelope port owes a Szasz-summability certificate -- a new proved NECESSARY condition. LEMMA CV: the chain hypotheses give S <= 2K/m, so every positive theorem of the chain lives strictly on the convergent side; HONEST NON-KILL recorded: ascending touching shells are convergent and remain admissible -- SZ does not close them. LEMMA BX + PROP T supply the finite side: exact Gamma-form row products (exact at M = 1), strictly increasing thresholds with an explicit factorial cap, a REAL route divergence at fixed (a, y), and configuration-specific single-shell thresholds 35 percent below the AG-capped route (3.44/7.31/15.33/31.67 vs 5.60/11.66/23.91/48.51 at K = 3/5/9/17). Instantiated no-go climb at x = mu_0 d = 3 > xStar: the lacunary family is capped at LamBar = 0.2234346210244193 while the additive family climbs 0.0025 -> 0.744 (M = 8) -> 0.9999976 (M = 24) through the 1/2 boundary. HONEST: the no-go concerns family-size-uniform caps only (finite instances keep finite bounds); Szasz convergence is necessary, NOT sufficient; the sharpness rows are configuration-specific; the Fresnel-Airy envelope port, the summability certificate, and the paper constants remain OPEN (sub-gap imp-95212-subgap-fresnel-airy-envelope-port carried, further narrowed); model-family constants; measured class sup phi = 0.3572 untouched. Floors and ceilings untouched; changes no bound; does NOT promote Lambda <= 0.14; NO QED; no refereed bound is changed.",
};

// ── assertions (self-executing; throw on violation) ──────────────────────────
export const IMP95215_SZB_ASSERTIONS = [
  {
    id: "imp95215-szb-machinery-anchors",
    description:
      "the Lam_M machinery is anchored: M = 1 reproduces e^(-2d) exactly (rel 1e-10), M = 2 matches the closed-form 2x2 Cauchy generalized eigenvalue (rel 1e-10); LEMMA BX anchored: the Gamma-form recurrence beta_i(M)/beta_i(M-1) = (2a+i+M-1)/(M-1-i) holds on a grid (rel 1e-12), beta_0 = M(M+1)/2 at a = 1 (rel 1e-12), and B(a, y, 1)^2 = e^(-2ay) = Lam_1 exactly (rel 1e-12)",
    holds: () => {
      const rel = (x, lit, tol) => Math.abs(x - lit) <= tol * Math.abs(lit);
      if (!rel(lambdaMaxAP(1, 3), Math.exp(-6), 1e-10)) return false;
      const d = 3;
      const G = [
        [1 / 2, 1 / 3],
        [1 / 3, 1 / 4],
      ];
      const Gd = [
        [Math.exp(-2 * d) / 2, Math.exp(-3 * d) / 3],
        [Math.exp(-3 * d) / 3, Math.exp(-4 * d) / 4],
      ];
      const qa = G[0][0] * G[1][1] - G[0][1] * G[0][1];
      const qb = -(Gd[0][0] * G[1][1] + Gd[1][1] * G[0][0] - 2 * Gd[0][1] * G[0][1]);
      const qc = Gd[0][0] * Gd[1][1] - Gd[0][1] * Gd[0][1];
      const lam2 = (-qb + Math.sqrt(qb * qb - 4 * qa * qc)) / (2 * qa);
      if (!rel(lambdaMaxAP(2, 3), lam2, 1e-10)) return false;
      for (const a of [0.5, 1, 4]) {
        for (const M of [3, 6, 11]) {
          for (let i = 0; i < M - 1; i++) {
            const ratio = Math.exp(lnBeta(a, M, i) - lnBeta(a, M - 1, i));
            const want = (2 * a + i + M - 1) / (M - 1 - i);
            if (!rel(ratio, want, 1e-12)) return false;
          }
        }
      }
      for (const M of [5, 12, 30]) {
        if (!rel(Math.exp(lnBeta(1, M, 0)), (M * (M + 1)) / 2, 1e-12)) return false;
      }
      for (const [a, y] of [
        [1, 2],
        [4, 0.7],
      ]) {
        const b1 = bSum(a, y, 1);
        if (!rel(b1 * b1, Math.exp(-2 * a * y), 1e-12)) return false;
      }
      return true;
    },
  },
  {
    id: "imp95215-szb-no-go-climb",
    description:
      "THEOREM SZ instantiated: at x = mu_0 d = 3 > xStar (where the lacunary family is capped at the imported LamBar(3) = 0.2234), the a = 1 arithmetic progression climbs through every baked row (rel 1e-9), strictly monotonically, crossing the H-LOC boundary 1/2 between M = 6 and M = 8, exceeding the lacunary cap already at M = 6, reaching > 0.99999 at M = 24 with wrong-side fraction Lam/2 > 0.4999",
    holds: () => {
      const rel = (x, lit, tol) => Math.abs(x - lit) <= tol * Math.abs(lit);
      if (!(CLIMB_TABLE[0].M === 1 && rel(CLIMB_TABLE[0].lam, Math.exp(-6), 1e-12))) return false;
      let prev = 0;
      for (const row of CLIMB_TABLE) {
        const lam = lambdaMaxAP(row.M, 3);
        if (!rel(lam, row.lam, 1e-9)) return false;
        if (!(lam > prev)) return false;
        prev = lam;
      }
      const lam6 = CLIMB_TABLE.find((r) => r.M === 6).lam;
      const lam8 = CLIMB_TABLE.find((r) => r.M === 8).lam;
      const lam24 = CLIMB_TABLE.find((r) => r.M === 24).lam;
      if (!(3 > X_STAR)) return false;
      if (!(lam6 > LAMBAR_DYA_MD3)) return false;
      if (!(lam6 < 0.5 && lam8 > 0.5)) return false;
      if (!(lam24 > 0.99999 && lam24 / 2 > 0.4999)) return false;
      return Math.abs(LAMBAR_DYA_MD3 - 0.2234346210244193) <= 1e-12;
    },
  },
  {
    id: "imp95215-szb-szasz-comparability-and-cv",
    description:
      "the Muntz-Szasz transport is guarded: the exponent-sum comparability ratio 2(1+mu^2)/(4mu^2+1) lies in [1/2, 2] on a mu-grid; the AP Szasz partial sums pass 4.5/9.1/11.4 at 1e2/1e4/1e5 terms (divergence trend; the divergence itself is the harmonic comparison); LEMMA CV: sampled lacunary-shell families obey S <= 2K/m",
    holds: () => {
      for (const mu of [1e-4, 1e-2, 0.3, 1, 2, 17, 1e3]) {
        const r = ((2 * mu) / (4 * mu * mu + 1)) / (mu / (1 + mu * mu));
        if (!(r >= 0.5 - 1e-12 && r <= 2 + 1e-12)) return false;
      }
      let s = 0;
      const marks = [];
      for (let j = 0; j < 100000; j++) {
        const mu = 1 + j;
        s += mu / (1 + mu * mu);
        if (j === 99 || j === 9999 || j === 99999) marks.push(s);
      }
      if (!(marks[0] > 4.5 && marks[1] > 9.1 && marks[2] > 11.4)) return false;
      for (const [m, K] of [
        [0.5, 3],
        [2, 7],
        [0.05, 12],
      ]) {
        let cv = 0;
        for (let b = 1; b <= 60; b++) {
          for (let i = 0; i < K; i++) {
            const mu = Math.pow(2, b - 1) * m * (1 + i / (2 * K));
            cv += mu / (1 + mu * mu);
          }
        }
        if (!(cv <= (2 * K) / m)) return false;
      }
      return true;
    },
  },
  {
    id: "imp95215-szb-prop-t",
    description:
      "PROP T: the baked y*(1, M) table reproduces by bisection (rel 1e-9) and strictly increases; B is termwise increasing in M on samples; the fixed-(a, y) divergence table B(1, 5, 16/32/64) reproduces (rel 1e-9), increases, and already exceeds 1 at M = 16 -- real by COROLLARY AP; y* <= yHat closed-form cap on an (a, M) grid",
    holds: () => {
      const rel = (x, lit, tol) => Math.abs(x - lit) <= tol * Math.abs(lit);
      let prev = 0;
      for (const row of YSTAR_TABLE) {
        const ys = yStar(1, row.M);
        if (!rel(ys, row.yStar, 1e-9)) return false;
        if (!(ys > prev)) return false;
        prev = ys;
      }
      for (const [a, y, M] of [
        [1, 3, 7],
        [4, 1, 5],
        [0.5, 6, 9],
      ]) {
        if (!(bSum(a, y, M + 1) > bSum(a, y, M))) return false;
      }
      let prevB = 0;
      for (const row of B_DIVERGENCE_TABLE) {
        const b = bSum(1, 5, row.M);
        if (!rel(b, row.B, 1e-9)) return false;
        if (!(b > prevB)) return false;
        prevB = b;
      }
      if (!(B_DIVERGENCE_TABLE[0].B > 1)) return false;
      for (const [a, M] of [
        [1, 4],
        [1, 16],
        [2, 8],
        [4, 5],
        [8, 9],
        [16, 17],
      ]) {
        if (!(yStar(a, M) <= yHat(a, M))) return false;
      }
      return true;
    },
  },
  {
    id: "imp95215-szb-single-shell-sharpness",
    description:
      "PROP T4: the full-occupancy single-octave table reproduces (rel 1e-9): x*_AP = (K-1) y*(K-1, K) by bisection on the exact rows, x*_AG = ln(sqrt(2) K A_ar(K, 1/(K-1))) with the local A_ar guarded against the imp-95214 baked aArTable (K = 5 and K = 17 rows, rel 1e-12); x*_AP < x*_AG on every row",
    holds: () => {
      const rel = (x, lit, tol) => Math.abs(x - lit) <= tol * Math.abs(lit);
      const g5 = ASP.constants.aArTable.find((r) => r.K === 5 && r.eps === 0.25);
      const g17 = ASP.constants.aArTable.find((r) => r.K === 17);
      if (!rel(aAr(5, 0.25), g5.aAr, 1e-12)) return false;
      if (!rel(aAr(17, g17.eps), g17.aAr, 1e-12)) return false;
      for (const row of SINGLE_SHELL_TABLE) {
        const a = row.K - 1;
        const xAP = a * yStar(a, row.K);
        const xAG = Math.log(Math.SQRT2 * row.K * aAr(row.K, 1 / (row.K - 1)));
        if (!rel(xAP, row.xAP, 1e-9)) return false;
        if (!rel(xAG, row.xAG, 1e-9)) return false;
        if (!(xAP < xAG)) return false;
      }
      return true;
    },
  },
  {
    id: "imp95215-szb-rayleigh-battery",
    description:
      "LEMMA BX bound validity: 5000 random Rayleigh quotients (signed coefficients, exact-AP configs, a in {0.5, 1, 4}, M <= 8, delta in {0.3, 1, 2.7}, random depths) never exceed B^2; the worst ratio lies in (0.9, 1] -- the exact-row route is near-sharp",
    holds: () => {
      let seed = 991177;
      const rand = () => {
        seed = (seed * 1103515245 + 12345) % 2147483648;
        return seed / 2147483648;
      };
      let worst = 0;
      for (let t = 0; t < 5000; t++) {
        const a = [0.5, 1, 4][t % 3];
        const M = 2 + (t % 7);
        const delta = [0.3, 1, 2.7][(t >> 1) % 3];
        const d = (0.2 + 6 * rand()) / delta;
        const mus = [];
        for (let j = 0; j < M; j++) mus.push(delta * (a + j));
        const v = mus.map(() => 2 * rand() - 1);
        const num = quadForm(shiftedGram(mus, d), v);
        const den = quadForm(cauchyGram(mus), v);
        if (!(den > 0)) return false;
        const b = bSum(a, delta * d, M);
        const r = num / den / (b * b);
        if (!(r <= 1 + 1e-9)) return false;
        if (r > worst) worst = r;
      }
      return worst > 0.9;
    },
  },
  {
    id: "imp95215-szb-honesty-gate",
    description:
      "the verdict delivers the necessity theorem without closing the sub-gap: names imp-95212-subgap-fresnel-airy-envelope-port STILL OPEN, the Szasz-summability certificate as the new necessary condition, the honest non-kill (ascending touching shells survive), the family-size-uniform scope limit, and the necessary-not-sufficient caveat; promotes no bound, NO QED, no refereed bound is changed",
    holds: () =>
      IMP95215_SZASZ_BOUNDARY_NECESSITY.promotesBound === false &&
      IMP95215_SZASZ_BOUNDARY_NECESSITY.openResiduals.length === 5 &&
      /NO QED/.test(IMP95215_SZASZ_BOUNDARY_NECESSITY.verdict) &&
      /refereed bound is changed/i.test(IMP95215_SZASZ_BOUNDARY_NECESSITY.verdict) &&
      /Floors and ceilings untouched/.test(IMP95215_SZASZ_BOUNDARY_NECESSITY.verdict) &&
      /remain OPEN/.test(IMP95215_SZASZ_BOUNDARY_NECESSITY.verdict) &&
      /HONEST NON-KILL/.test(IMP95215_SZASZ_BOUNDARY_NECESSITY.verdict) &&
      /necessary, NOT sufficient/.test(IMP95215_SZASZ_BOUNDARY_NECESSITY.verdict) &&
      /STILL OPEN/.test(IMP95215_SZASZ_BOUNDARY_NECESSITY.subGap) &&
      /fresnel-airy-envelope-port/.test(IMP95215_SZASZ_BOUNDARY_NECESSITY.subGap) &&
      /summability certificate/.test(IMP95215_SZASZ_BOUNDARY_NECESSITY.subGap) &&
      /ascending shells with bounded occupancy/i.test(IMP95215_SZASZ_BOUNDARY_NECESSITY.subGap) &&
      /LACUNARITY NECESSITY DELIVERED/.test(IMP95215_SZASZ_BOUNDARY_NECESSITY.openResiduals[4]) &&
      /HONEST LIMITS/.test(IMP95215_SZASZ_BOUNDARY_NECESSITY.openResiduals[4]) &&
      /0\.3572/.test(IMP95215_SZASZ_BOUNDARY_NECESSITY.verdict) &&
      /configuration-specific/.test(IMP95215_SZASZ_BOUNDARY_NECESSITY.rigorScope) &&
      /Nothing here instantiates the paper packets/.test(IMP95215_SZASZ_BOUNDARY_NECESSITY.rigorScope),
  },
];

for (const a of IMP95215_SZB_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-95215-szasz-boundary-lacunarity-necessity assertion failed: ${a.id}`);
  }
}

export default IMP95215_SZASZ_BOUNDARY_NECESSITY;
