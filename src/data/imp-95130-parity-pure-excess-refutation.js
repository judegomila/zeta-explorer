/**
 * imp-95130 - THEOREM PX (parity-pure excess witness): NEGATIVE resolution of
 * the omega_min branch of imp-95129-subgap-min-odd-mass. The twenty-fourth
 * imp-95008 continuation (THEOREM OD, odd-mass dilution law) reduced the
 * attainment-occupancy tradeoff sub-gap to one leg: "prove a uniform lower
 * bound omega >= omega_min > 0 over E > 0 MAJ witnesses (equivalently,
 * exclude E > 0 in the asymptotically parity-pure regime with three or more
 * even blocks), OR exhibit an E > 0 family with omega -> 0." This module
 * takes the refuting branch and delivers something stronger than omega -> 0:
 * an explicit in-class family with omega = 0 IDENTICALLY and E > 0 on an
 * explicit rigorous window. Hence NO uniform omega_min > 0 over E > 0 MAJ
 * witnesses exists, and the "equivalently exclude E > 0 in the parity-pure
 * regime with three or more even blocks" formulation is FALSE as stated.
 *
 * THEOREM PX. At p = 999983 take the three grid points k = 700000, 175000,
 * 43750 (exact dyadic ratios 4 and 4, so d = k/p places them in blocks
 * 0, 2, 4 - ALL EVEN - with positions u1, 4 u1, 16 u1 for u1 = p/700000),
 * unit amplitudes a_i = 1, and one common rate mu_i = eps > 0. Then
 * M_odd = 0 (omega = 0) and, with f(x) = exp(-x)(1 + x),
 *   E(eps) = (1/eps) [ 2 ( f(3 u1 eps) + f(12 u1 eps) + f(15 u1 eps) ) - 3 ]
 *          >= (1/eps) ( 3 - 378 u1^2 eps^2 ) > 0
 * for every 0 < eps < 1/(u1 sqrt(126)) = 0.06236201660051457.
 * PROOF. The channel split is definitional: all three blocks are even and
 * distinct, so sameBlock = X_par = 0, N = diag = 3/eps, and X_env is the sum
 * of the three cross terms 2 K(eps, eps, tau) with the exact equal-rate
 * kernel K(eps, eps, tau) = f(eps tau)/eps (the Gram identity below), giving
 * the exact E(eps) displayed. Lemma MQ (below) bounds each f(eps tau) from
 * below by 1 - (eps tau)^2 / 2; the pairwise separations are 3 u1, 12 u1,
 * 15 u1 whose squares sum to 378 u1^2, giving the minorant, which is
 * positive exactly on the stated window. QED - the only inputs are the
 * exact kernel evaluation and Lemma MQ; nothing is conditional.
 *
 * LEMMA MQ (elementary minorant - UNCONDITIONAL). For x >= 0,
 * exp(-x)(1 + x) >= 1 - x^2/2. Proof: both sides equal 1 at x = 0, and the
 * derivatives are -x exp(-x) >= -x because exp(-x) <= 1; integrate. QED.
 *
 * GRAM IDENTITY (the sibling kernel is an L2 inner product). With
 * f_{mu,u}(t) = exp(-mu |t - u|), direct integration over the three ranges
 * gives <f_{a,u1}, f_{b,u2}> = 2 (b exp(-a tau) - a exp(-b tau))/(b^2 - a^2)
 * for a != b and exp(-a tau)(1 + a tau)/a for a = b, tau = |u1 - u2| - i.e.
 * exactly the sibling kernelK, so the full witness matrix is a Gram matrix.
 * (Cross-checked below by Simpson quadrature.)
 *
 * LEMMA TP (two-packet exclusion - UNCONDITIONAL; sharpness of THEOREM PX).
 * Any two-packet witness has E <= 0: by Cauchy-Schwarz in the Gram geometry
 * K_12 <= sqrt(K_11 K_22) = 1/sqrt(mu_1 mu_2), so
 * 2 a_1 a_2 K_12 <= 2 a_1 a_2 / sqrt(mu_1 mu_2) <= a_1^2/mu_1 + a_2^2/mu_2
 * = diag <= N by AM-GM. QED. So THREE blocks is the minimal support for
 * E > 0 and THEOREM PX sits at the sharp boundary - consistent with the
 * carried Lemma ES / single-parity anchor (which exclude E > 0 on at most
 * two same-parity blocks) and explaining why they could not be pushed to
 * three.
 *
 * WHAT THIS RESOLVES AND WHAT IT DOES NOT.
 * (1) imp-95129-subgap-min-odd-mass is RESOLVED NEGATIVELY in its stated
 *     E>0-conditioned form: the witness family above is in-class
 *     (nonnegative amplitudes, legal grid points, free positive rates; the
 *     carried per-pair MAJ caps hold at it with >= 1e34 margin - asserted),
 *     has omega = 0 exactly, and has E > 0. No omega_min exists.
 * (2) THEOREM OD is UNTOUCHED and consistent: at omega = 0 its cap
 *     degenerates to phi <= 1, and the family measures phi <= 3.4e-29 over
 *     its whole E > 0 window (sup over the eps grid; at eps = 0.02 phi is
 *     3.77e-44) - the legality weight prices the small common rate at
 *     1/hLegal ~ (s/x)^s per packet, inflating M by ~eps^(-2s) while E only
 *     grows like 1/eps. The family is therefore FLOOR-IRRELEVANT: it moves
 *     no witness floor, no ceiling, no bound. The refutation eliminates only the
 *     LEMMA FORM "E > 0 forces odd mass".
 * (3) The tradeoff sub-gap imp-95008-subgap-attainment-occupancy-tradeoff
 *     remains OPEN. The corrected remaining leg is NAMED:
 *     imp-95130-subgap-phi-conditional-odd-mass - prove a phi-conditional
 *     lower bound omega >= omega_min(phi_0) > 0 uniformly over MAJ witnesses
 *     with phi >= phi_0 (for each phi_0 in (0, 1]), OR exhibit a family with
 *     phi bounded away from 0 and omega -> 0. The mechanism measured here
 *     (parity-pure excess requires a common rate below ~0.062, which the
 *     legality weight punishes to phi ~ eps^(2s-1) -> 0) says the
 *     E>0-conditioned form failed precisely because E > 0 is achievable at
 *     vanishing phi; only the phi-weighted version can be true. That
 *     mechanism is measured on THIS family, not proved as a class bound.
 *
 * HONEST LIMITS. (a) Model-family constants (sigma = 1, theta = 10,
 * beta = 1/3, c = v = D = 1), not the paper Section 4.5 packets. (b) The
 * negative resolution is of the named sub-gap AS STATED; the phi-conditional
 * reformulation is open and named. (c) Floors and ceilings untouched;
 * changes no bound; does NOT promote Lambda <= 0.14; NO QED;
 * no refereed bound is changed.
 *
 * SKEPTICAL SELF-CHECK RECORD: (1) in-class membership was stress-tested: the
 * carried chain constrains amplitudes (nonnegative) and prices legality only
 * through the mass weight 1/hLegal in nb - no lower bound on mu exists in
 * THEOREM ER / OD or the imp-95113 battery (which perturbs mus freely); the
 * per-pair envelope caps and X_env <= capSum are VERIFIED at the witness
 * (margins >= 1e34). (2) the Gram identity behind the exact kernel
 * evaluation is cross-checked by Simpson quadrature to <= 1e-4 relative on
 * mixed-rate and equal-rate triples. (3) the minorant Lemma MQ is verified
 * on a dense grid and the exact E is confirmed to sit ABOVE the minorant at
 * every sampled eps. (4) sharpness: every two-packet sub-witness of the
 * family has E < 0 across the whole eps grid, so the construction genuinely
 * needs three blocks - a fake E > 0 from a coding slip in the channel split
 * would show up here. (5) consistency with THEOREM OD checked (phi far
 * below the omega = 0 cap 1). (6) scope honesty: the resolution is
 * NEGATIVE and scoped to the E>0-conditioned lemma form only; nothing is
 * promoted.
 *
 * Import-light (no heavy bundle). The numerics cross-check THEOREM PX; the
 * theorem itself is the exact kernel evaluation plus Lemma MQ.
 */

// shared conventions (identical to the sibling modules)
const SIGMA = 1;
const BETA = 1 / 3;
const CC = 1;
const VV = 1;
const DD = 1;
const THETA = 10;
const SS = SIGMA + THETA;

const QREF = ((CC * Math.pow(DD, 1 - BETA)) / VV) * Math.pow(2, -(1 - BETA));

// Lemma PF closed form (short copy, nineteenth continuation)
function binom(n, k) {
  let r = 1;
  for (let i = 1; i <= k; i++) r = (r * (n - k + i)) / i;
  return r;
}
function outerFolded(rho, bb, s) {
  let sum = 0;
  for (let k = 2; k <= s; k++) {
    const B = binom(2 * s - k - 1, s - k);
    const ck = Math.pow(-1, s - k) * B * Math.pow(bb - rho, -(2 * s - k));
    const dk = Math.pow(-1, s - k) * B * Math.pow(rho - bb, -(2 * s - k));
    sum += (ck * Math.pow(rho, s + 1 - k) + dk * Math.pow(rho, s) * Math.pow(bb, 1 - k)) / (k - 1);
  }
  const c1s = Math.pow(-1, s - 1) * binom(2 * s - 2, s - 1) * Math.pow(bb - rho, -(2 * s - 1)) * Math.pow(rho, s);
  return sum + (c1s === 0 ? 0 : c1s * Math.log(bb / rho));
}
function farFolded(rho, T, s) {
  const a = rho + T;
  const rs = Math.pow(rho, s);
  if (rs === 0) return 0;
  let sum = 0;
  for (let k = 2; k <= s; k++) {
    const B = binom(2 * s - k - 1, s - k);
    const ck = Math.pow(-1, s - k) * B * Math.pow(1 - a, -(2 * s - k));
    const dk = Math.pow(-1, s - k) * B * Math.pow(a - 1, -(2 * s - k));
    sum += (rs * (ck * Math.pow(a, 1 - k) + dk)) / (k - 1);
  }
  const c1 = Math.pow(-1, s - 1) * binom(2 * s - 2, s - 1) * Math.pow(1 - a, -(2 * s - 1));
  return sum + (c1 === 0 ? 0 : rs * c1 * Math.log(1 / a));
}
function middleFolded(rho, T, s) {
  const c = 1 + T;
  const rs = Math.pow(rho, s);
  let sum = 0;
  for (let k = 1; k <= s; k++) {
    const pk = binom(2 * s - k - 1, s - k) * Math.pow(rho + c, -(2 * s - k));
    if (pk === 0) continue;
    const Ja =
      k === 1
        ? rs === 0
          ? 0
          : rs * Math.log((T + rho) / rho)
        : (Math.pow(rho, s + 1 - k) - rs * Math.pow(T + rho, 1 - k)) / (k - 1);
    const Jc = k === 1 ? rs * Math.log(c) : (rs * (1 - Math.pow(c, 1 - k))) / (k - 1);
    sum += pk * (Ja + Jc);
  }
  return sum;
}
function iExact(T, rho, s) {
  return Math.pow(rho, -0.5) * (outerFolded(rho, 1 + T, s) + middleFolded(rho, T, s) + farFolded(rho, T, s));
}
function cornerV(b, j) {
  return (Math.pow(2, b * (1 - BETA)) * Math.pow(2, BETA) * (Math.pow(2, j - 1) - 1)) / (QREF * Math.pow(2, j * BETA));
}
function rhoCap(j) {
  return Math.pow(2, -(j - 1) * BETA);
}
function envE(b, j) {
  return iExact(cornerV(b, j), rhoCap(j), SS);
}

// sibling kernel / legality / block assembly (identical to the siblings)
function kernelK(a, b, tau) {
  if (Math.abs(a - b) < 1e-7 * (a + b)) {
    const m = 0.5 * (a + b);
    return (Math.exp(-m * tau) * (1 + m * tau)) / m;
  }
  return (2 * (b * Math.exp(-a * tau) - a * Math.exp(-b * tau))) / (b * b - a * a);
}
function hLegal(mu, r, s) {
  const x = mu * r;
  if (x >= s) return 1;
  return Math.exp(s - x) * Math.pow(x / s, s);
}
function blockOf(p, k) {
  let b = 0;
  while (!(k * Math.pow(2, b) <= p && p < k * Math.pow(2, b + 1))) {
    b += 1;
    if (b > 60) throw new Error("imp-95130 parity-pure excess: block search failed");
  }
  return b;
}

// THEOREM PX witness: three grid points in even blocks 0, 2, 4 (exact 4x
// dyadic ratios), unit amplitudes, one common rate eps
const P_PX = 999983;
const KS_PX = [700000, 175000, 43750];
const W_PX = (() => {
  const d = KS_PX.map((k) => k / P_PX);
  return {
    ks: KS_PX,
    d,
    u: d.map((x) => VV / x),
    r: d.map((x) => CC * Math.pow(x, -BETA)),
    block: KS_PX.map((k) => blockOf(P_PX, k)),
  };
})();
const U1 = P_PX / 700000;
const SUM_TAU2 = 378 * U1 * U1; // (3 u1)^2 + (12 u1)^2 + (15 u1)^2
const EPS_WINDOW = 1 / (U1 * Math.sqrt(126)); // rigorous E > 0 window bound

function evalFamily(eps, withCaps) {
  const n = 3;
  const mus = [eps, eps, eps];
  const a = [1, 1, 1];
  let diag = 0;
  for (let i = 0; i < n; i++) diag += (a[i] * a[i]) / mus[i];
  let sameBlock = 0;
  let xPar = 0;
  let xEnv = 0;
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      const ip = a[i] * a[j] * kernelK(mus[i], mus[j], Math.abs(W_PX.u[i] - W_PX.u[j]));
      const bi = W_PX.block[i];
      const bj = W_PX.block[j];
      if (bi === bj) sameBlock += 2 * ip;
      else if ((bi + bj) % 2 === 0) xEnv += 2 * ip;
      else xPar += 2 * ip;
    }
  }
  const N = diag + sameBlock;
  const E = xPar + xEnv - N;
  const bmax = Math.max(...W_PX.block);
  const nb = new Array(bmax + 1).fill(0);
  for (let i = 0; i < n; i++) nb[W_PX.block[i]] += (a[i] * Math.sqrt(W_PX.r[i])) / hLegal(mus[i], W_PX.r[i], SS);
  let M = 0;
  let Modd = 0;
  for (let b = 0; b < nb.length; b++) {
    M += nb[b] * nb[b];
    if (b % 2 === 1) Modd += nb[b] * nb[b];
  }
  const out = {
    E,
    xEnv,
    xPar,
    N,
    M,
    Modd,
    phi: E / (2 * LWE * M),
    eLower: (1 / eps) * (3 - SUM_TAU2 * eps * eps),
  };
  if (withCaps) {
    let capSum = 0;
    for (let b = 0; b <= bmax; b++) {
      for (let bp = b + 1; bp <= bmax; bp++) {
        if ((b + bp) % 2 === 0 && nb[b] > 0 && nb[bp] > 0) capSum += 2 * nb[b] * nb[bp] * envE(b, bp - b);
      }
    }
    out.capSum = capSum;
    out.occ = capSum / (LWE * M);
    let maxPairRatio = 0;
    for (let i = 0; i < n; i++) {
      for (let j = i + 1; j < n; j++) {
        const K = kernelK(mus[i], mus[j], Math.abs(W_PX.u[i] - W_PX.u[j]));
        const nbi = Math.sqrt(W_PX.r[i]) / hLegal(mus[i], W_PX.r[i], SS);
        const nbj = Math.sqrt(W_PX.r[j]) / hLegal(mus[j], W_PX.r[j], SS);
        const cap = nbi * nbj * envE(Math.min(W_PX.block[i], W_PX.block[j]), Math.abs(W_PX.block[i] - W_PX.block[j]));
        const ratio = K / cap;
        if (ratio > maxPairRatio) maxPairRatio = ratio;
      }
    }
    out.maxPairRatio = maxPairRatio;
  }
  return out;
}

const LWE = 3.9197935113802585e-5; // carried twenty-second even-class sandwich

// headline evaluation point (inside the rigorous window)
const EPS_HEAD = 0.02;
const HEAD = evalFamily(EPS_HEAD, true);

// eps-grid scans (step 2e-4 up to 0.4): measured E > 0 extent, sup of phi,
// and the two-packet sub-witness exclusion
function gridScans() {
  let supPhi = 0;
  let supPhiEps = 0;
  let epsStar = 0;
  let worstPairE = -Infinity;
  const taus = [
    Math.abs(W_PX.u[0] - W_PX.u[1]),
    Math.abs(W_PX.u[0] - W_PX.u[2]),
    Math.abs(W_PX.u[1] - W_PX.u[2]),
  ];
  for (let t = 1; t <= 2000; t++) {
    const eps = t * 2e-4;
    const r = evalFamily(eps, false);
    if (r.E > 0) {
      epsStar = eps;
      if (r.phi > supPhi) {
        supPhi = r.phi;
        supPhiEps = eps;
      }
    }
    for (const tau of taus) {
      const pe = 2 * kernelK(eps, eps, tau) - 2 / eps;
      if (pe > worstPairE) worstPairE = pe;
    }
  }
  return { supPhi, supPhiEps, epsStar, worstPairE };
}
const SCANS = gridScans();

// Simpson quadrature cross-check of the Gram identity behind kernelK
function gramQuad(a, b, tau) {
  const L = 60 / Math.min(a, b);
  const nPts = 200000;
  const lo = Math.min(0, tau) - L;
  const hi = Math.max(0, tau) + L;
  const h = (hi - lo) / nPts;
  let s = 0;
  for (let i = 0; i <= nPts; i++) {
    const t = lo + i * h;
    const wgt = i === 0 || i === nPts ? 1 : i % 2 === 1 ? 4 : 2;
    s += wgt * Math.exp(-a * Math.abs(t)) * Math.exp(-b * Math.abs(t - tau));
  }
  return (s * h) / 3;
}

// baked literals (recomputed by the assertions)
const U1_LIT = 1.4285471428571428;
const WINDOW_LIT = 0.06236201660051457;
const E_HEAD_LIT = 138.02395251768871;
const E_LOWER_HEAD_LIT = 134.5719531383983;
const PHI_HEAD_LIT = 3.7742503879046544e-44;
const OCC_HEAD_LIT = 0.01583211285579144;
const MAX_PAIR_RATIO_LIT = 1.0596101149870366e-34;
const SUP_PHI_LIT = 3.3657348450146935e-29;
const SUP_PHI_EPS_LIT = 0.1212;
const EPS_STAR_LIT = 0.127;
const WORST_PAIR_E_LIT = -0.003671246146041085;

export const IMP95130_PARITY_PURE_EXCESS_REFUTATION = {
  ticket:
    "imp-95130 (THEOREM PX: explicit parity-pure MAJ witness family - blocks 0/2/4 all even, omega = 0 identically - with E > 0 on the rigorous window eps < 1/(u1 sqrt(126)); the omega_min branch of imp-95129-subgap-min-odd-mass is RESOLVED NEGATIVELY)",
  source:
    "Permuting the Zeta Twin Ladder Section 4.5; /permutation-architecture; consumes the Theorem R Gram assembly / Lemma ES channel split (imp-95008-witness-erealization-split.js) and resolves the sub-gap named by imp-95129-odd-mass-dilution-law.js.",
  theoremPX:
    "At p = 999983 the grid points k = {700000, 175000, 43750} (exact dyadic ratios 4, 4) lie in blocks {0, 2, 4} - all even, so omega = 0 - at positions u1, 4 u1, 16 u1 with u1 = p/700000. With unit amplitudes and one common rate eps, E(eps) = (1/eps)[2(f(3 u1 eps) + f(12 u1 eps) + f(15 u1 eps)) - 3] with f(x) = exp(-x)(1 + x), and Lemma MQ gives E(eps) >= (1/eps)(3 - 378 u1^2 eps^2) > 0 for all 0 < eps < 1/(u1 sqrt(126)) = 0.06236201660051457. Unconditional: exact kernel evaluation plus the elementary minorant.",
  lemmaMQ:
    "UNCONDITIONAL: exp(-x)(1 + x) >= 1 - x^2/2 for x >= 0 (equality at 0; derivatives -x exp(-x) >= -x; integrate).",
  lemmaTP:
    "UNCONDITIONAL two-packet exclusion (sharpness): any two-packet witness has E <= 0 by Cauchy-Schwarz in the Gram geometry (K_12 <= 1/sqrt(mu_1 mu_2)) plus AM-GM, so three blocks is the minimal support for E > 0 - consistent with the carried Lemma ES / single-parity anchor and at the sharp boundary.",
  resolution:
    "imp-95129-subgap-min-odd-mass RESOLVED NEGATIVELY in its stated E>0-conditioned form: the family is in-class (nonnegative amplitudes, legal grid points, free positive rates; per-pair MAJ caps hold at it with margin >= 1e34), has omega = 0 exactly and E > 0, so no uniform omega_min > 0 over E > 0 MAJ witnesses exists and the equivalent formulation (exclude E > 0 in the parity-pure regime with three or more even blocks) is FALSE. THEOREM OD is untouched (at omega = 0 it degenerates to phi <= 1) and no floor, ceiling, or bound moves: the family measures sup phi = 3.3657348450146935e-29 over its whole E > 0 window (phi = 3.7742503879046544e-44 at the headline eps = 0.02) because the legality weight inflates M by ~eps^(-2s) while E grows only like 1/eps. The refutation eliminates the lemma FORM (E > 0 forces odd mass), not the tradeoff program.",
  subGap:
    "imp-95130-subgap-phi-conditional-odd-mass - OPEN: prove a phi-conditional lower bound omega >= omega_min(phi_0) > 0 uniformly over MAJ witnesses with phi >= phi_0 (each phi_0 in (0, 1]), OR exhibit a family with phi bounded away from 0 and omega -> 0. The mechanism measured here - parity-pure excess requires a common rate below ~0.062 and the legality weight then drives phi ~ eps^(2s-1) -> 0 - says only the phi-weighted version can be true; that mechanism is measured on THIS family, not proved as a class bound.",
  openResiduals: [
    "imp-95130-subgap-phi-conditional-odd-mass: the phi-conditional reformulation of the odd-mass lower bound (the E>0-conditioned form is refuted here; the tradeoff sub-gap imp-95008-subgap-attainment-occupancy-tradeoff remains OPEN)",
    "the parity-pure phi-suppression mechanism (M ~ eps^(-2s) vs E ~ 1/eps) is measured on this family, not proved uniformly over parity-pure witnesses",
    "the packet-envelope constants (c, beta, sigma, theta, A_d) for the PAPER packets rather than the model family",
  ],
  isRigorous: true,
  rigorScope:
    "THEOREM PX is unconditional: the channel split at the witness is definitional (three distinct even blocks), the kernel evaluation is the exact closed form certified by the Gram identity (direct integration, cross-checked by quadrature), and Lemma MQ is elementary calculus - no MAJ conditionality enters because the witness is exhibited, not bounded. Lemma TP is unconditional bilinear algebra. In-class membership of the witness under the carried chain is verified by direct evaluation of the per-pair envelope caps (margin >= 1e34). The eps-grid scans and quadrature are CROSS-CHECKS; the theorem is the displayed two-line inequality. The resolution of imp-95129-subgap-min-odd-mass is NEGATIVE and scoped to its stated E>0-conditioned form; the phi-conditional reformulation is named and OPEN. Floors and ceilings untouched; changes no bound; does NOT promote Lambda <= 0.14; NO QED; no refereed bound is changed.",
  promotesBound: false,
};

export const IMP95130_PARITY_PURE_EXCESS_ASSERTIONS = [
  {
    id: "imp95130-px-blocks-even-omega-zero",
    description:
      "the witness grid points 700000/175000/43750 at p = 999983 have exact dyadic k-ratios 4 and 4, land in blocks 0/2/4 (all even) with u1 = 1.4285471428571428, and the family has M_odd = 0 (omega = 0 identically); the pairwise position separations square-sum to exactly 378 u1^2",
    holds: () => {
      const rel = (x, lit, t) => Math.abs(x - lit) <= t * Math.abs(lit);
      const tau01 = Math.abs(W_PX.u[0] - W_PX.u[1]);
      const tau02 = Math.abs(W_PX.u[0] - W_PX.u[2]);
      const tau12 = Math.abs(W_PX.u[1] - W_PX.u[2]);
      const st2 = tau01 * tau01 + tau02 * tau02 + tau12 * tau12;
      return (
        KS_PX[0] === 4 * KS_PX[1] &&
        KS_PX[1] === 4 * KS_PX[2] &&
        W_PX.block[0] === 0 &&
        W_PX.block[1] === 2 &&
        W_PX.block[2] === 4 &&
        rel(U1, U1_LIT, 1e-15) &&
        rel(st2, SUM_TAU2, 1e-13) &&
        HEAD.Modd === 0
      );
    },
  },
  {
    id: "imp95130-px-lemma-mq-minorant",
    description:
      "Lemma MQ holds on a dense grid (exp(-x)(1 + x) >= 1 - x^2/2 for x in [0, 100]) and the exact E(eps) sits above the minorant (1/eps)(3 - 378 u1^2 eps^2) at every sampled eps in the rigorous window",
    holds: () => {
      for (let t = 0; t <= 10000; t++) {
        const x = t * 0.01;
        if (Math.exp(-x) * (1 + x) < 1 - (x * x) / 2 - 1e-14) return false;
      }
      for (const eps of [0.005, 0.01, 0.02, 0.04, 0.06]) {
        const r = evalFamily(eps, false);
        if (!(r.E >= r.eLower && r.eLower > 0 && eps < EPS_WINDOW)) return false;
      }
      return true;
    },
  },
  {
    id: "imp95130-px-excess-positive-window",
    description:
      "THEOREM PX at the headline eps = 0.02: exact E = 138.02395251768871 > 0 with omega = 0, above the rigorous minorant 134.5719531383983; the rigorous window bound is 1/(u1 sqrt(126)) = 0.06236201660051457 and the measured E > 0 extent on the eps grid reaches 0.127 (the minorant is sufficient, not tight)",
    holds: () => {
      const rel = (x, lit, t) => Math.abs(x - lit) <= t * Math.abs(lit);
      return (
        rel(HEAD.E, E_HEAD_LIT, 1e-12) &&
        HEAD.E > 0 &&
        rel(HEAD.eLower, E_LOWER_HEAD_LIT, 1e-12) &&
        HEAD.E >= HEAD.eLower &&
        HEAD.xPar === 0 &&
        rel(EPS_WINDOW, WINDOW_LIT, 1e-14) &&
        rel(SCANS.epsStar, EPS_STAR_LIT, 1e-12) &&
        SCANS.epsStar > EPS_WINDOW
      );
    },
  },
  {
    id: "imp95130-px-gram-identity-quadrature",
    description:
      "the Gram identity behind kernelK is cross-checked by Simpson quadrature of the defining integral to <= 1e-4 relative on equal-rate and mixed-rate triples including the witness geometry (a, b, tau) = (0.02, 0.02, 4.2856)",
    holds: () => {
      for (const [a, b, tau] of [
        [0.02, 0.02, 4.2856],
        [0.5, 1.5, 2],
        [3, 3, 0.7],
        [0.1, 2, 10],
      ]) {
        const q = gramQuad(a, b, tau);
        const k = kernelK(a, b, tau);
        if (!(Math.abs(q - k) / k <= 1e-4)) return false;
      }
      return true;
    },
  },
  {
    id: "imp95130-px-in-class-caps",
    description:
      "in-class membership under the carried chain at eps = 0.02: every per-pair kernel value sits below its envelope cap with ratio <= 1.0596101149870366e-34, X_env <= capSum, and occupancy capSum/(LwEven M) = 0.01583211285579144 <= 1 - the witness is a legitimate member of the class the omega_min claim quantified over",
    holds: () => {
      const rel = (x, lit, t) => Math.abs(x - lit) <= t * Math.abs(lit);
      return (
        rel(HEAD.maxPairRatio, MAX_PAIR_RATIO_LIT, 1e-9) &&
        HEAD.maxPairRatio < 1e-33 &&
        HEAD.xEnv <= HEAD.capSum &&
        rel(HEAD.occ, OCC_HEAD_LIT, 1e-9) &&
        HEAD.occ <= 1
      );
    },
  },
  {
    id: "imp95130-px-two-packet-sharpness",
    description:
      "Lemma TP sharpness cross-check: every two-packet sub-witness of the family has E < 0 across the whole eps grid (worst value -0.003671246146041085 at the grid edge), so E > 0 genuinely needs three blocks and the construction sits at the Lemma ES boundary",
    holds: () => {
      const rel = (x, lit, t) => Math.abs(x - lit) <= t * Math.abs(lit);
      return SCANS.worstPairE < 0 && rel(SCANS.worstPairE, WORST_PAIR_E_LIT, 1e-9);
    },
  },
  {
    id: "imp95130-px-floor-irrelevance",
    description:
      "the family moves no floor: sup of phi over the whole measured E > 0 window is 3.3657348450146935e-29 (at eps = 0.1212; headline-point phi = 3.7742503879046544e-44), consistent with THEOREM OD whose omega = 0 cap is 1 - the refutation is of the lemma form, not of any bound",
    holds: () => {
      const rel = (x, lit, t) => Math.abs(x - lit) <= t * Math.abs(lit);
      return (
        rel(SCANS.supPhi, SUP_PHI_LIT, 1e-9) &&
        SCANS.supPhi < 1e-28 &&
        rel(SCANS.supPhiEps, SUP_PHI_EPS_LIT, 1e-12) &&
        rel(HEAD.phi, PHI_HEAD_LIT, 1e-9) &&
        HEAD.phi <= 1
      );
    },
  },
  {
    id: "imp95130-px-honesty-gate",
    description:
      "the verdict is scoped as a NEGATIVE resolution of the E>0-conditioned omega_min form only, names the open phi-conditional sub-gap imp-95130-subgap-phi-conditional-odd-mass, promotes no bound, NO QED, no refereed bound is changed",
    holds: () =>
      IMP95130_PARITY_PURE_EXCESS_REFUTATION.promotesBound === false &&
      /NO QED/.test(IMP95130_PARITY_PURE_EXCESS_REFUTATION.rigorScope) &&
      /refereed bound is changed/i.test(IMP95130_PARITY_PURE_EXCESS_REFUTATION.rigorScope) &&
      /RESOLVED NEGATIVELY/.test(IMP95130_PARITY_PURE_EXCESS_REFUTATION.resolution) &&
      /imp-95130-subgap-phi-conditional-odd-mass/.test(IMP95130_PARITY_PURE_EXCESS_REFUTATION.subGap) &&
      /remains OPEN/.test(IMP95130_PARITY_PURE_EXCESS_REFUTATION.openResiduals[0]) &&
      /not proved/.test(IMP95130_PARITY_PURE_EXCESS_REFUTATION.openResiduals[1]) &&
      IMP95130_PARITY_PURE_EXCESS_REFUTATION.openResiduals.length === 3 &&
      /NEGATIVE and scoped/.test(IMP95130_PARITY_PURE_EXCESS_REFUTATION.rigorScope),
  },
];

for (const a of IMP95130_PARITY_PURE_EXCESS_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-95130-parity-pure-excess-refutation assertion failed: ${a.id}`);
  }
}

export default IMP95130_PARITY_PURE_EXCESS_REFUTATION;
