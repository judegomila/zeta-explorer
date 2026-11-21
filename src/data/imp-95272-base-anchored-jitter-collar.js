/**
 * imp-95272: LEMMA BASE-SIDE + THEOREM BL-JIT -- a base-anchored,
 * jitter-robust replacement of the imp-95226 COROLLARY BL-LAT count-uniform
 * lattice collar. RIGOROUS at the stated scope (elementary majorization on
 * top of the proven PROP BL); dissolves the imp-95232 FINDING 1 ~70x
 * count-uniform collar looseness and delivers the FIRST count-uniform
 * OFF-LATTICE signed certificate (the off-lattice ceiling residual named in
 * imp-95226/imp-95232). Changes no bound of the Lambda program; NO QED;
 * no refereed bound is changed.
 *
 * OBJECT (imp-95226 LEMMA SEG-N / SGN-NP). On distinct rates
 * nu_1 < ... < nu_N > 0 and depth d > 0, Lambda = lambda_max of the pencil
 * (D G D, G), Cauchy Gram G_ij = 1/(nu_i + nu_j), D = diag(e^(-d nu_i)).
 * PROP BL (imp-95226, rigorous): sqrt(Lambda) <= BL = sum_i e^(-d nu_i)
 * prod_(j != i) (nu_i + nu_j)/|nu_i - nu_j|. COROLLARY BL-LAT charged EVERY
 * rate the infinite TWO-SIDED product c(rho)^2, c(rho) = prod_(k >= 1)
 * (rho^k + 1)/(rho^k - 1), giving Lambda <= c^4 e^(-2x)(1 + tau)^2 -- which
 * imp-95232 measured ~70x above Lambda at the dyadic baseline.
 *
 * SETTING (jitter windows). Fix rho > 1 and 1 <= delta < sqrt(rho). Say the
 * rates occupy DISTINCT delta-windows of a geometric rho-lattice when there
 * exist mu > 0 and distinct integers k_1 < ... < k_N with
 *   nu_i in [mu rho^(k_i) / delta, mu rho^(k_i) delta] for every i.
 * Since delta^2 < rho the windows are pairwise disjoint and ordered
 * (sup of window k = mu rho^k delta < mu rho^(k+1)/delta = inf of window
 * k+1), so the rates are automatically distinct and their order matches the
 * window order. delta = 1 is exactly the BL-LAT lattice hypothesis.
 * Define
 *   s(rho, delta)   = prod_(m >= 1) (rho^m + delta^2)/(rho^m - delta^2),
 *   tau(rho, delta, x) = sum_(m >= 1) e^(-x (rho^m / delta^2 - 1)),
 * both finite for delta^2 < rho; s(rho, 1) = c(rho) and tau(rho, 1, x) =
 * tau_rho(x) of BL-LAT.
 *
 * LEMMA RATIO (one line). For i < j (so k_i < k_j, m = k_j - k_i >= 1):
 * nu_j / nu_i >= (mu rho^(k_j)/delta)/(mu rho^(k_i) delta) = rho^m/delta^2
 * > 1, and t -> (t + 1)/(t - 1) is strictly decreasing on (1, inf), so
 *   (nu_i + nu_j)/(nu_j - nu_i) <= (rho^m + delta^2)/(rho^m - delta^2).
 *
 * LEMMA BASE-SIDE (the sharpening). In the Blaschke-Lagrange per-rate
 * product, the LOWEST rate has every other rate ABOVE it: its product runs
 * over distinct positive lattice distances m only once each, so by LEMMA
 * RATIO it is <= s(rho, delta) -- ONE-SIDED. Every other rate has at most
 * one factor per distance per side, so its product is <= s(rho, delta)^2.
 * BL-LAT charged the dominant lowest rate the two-sided s^2: that
 * mischarge, not the infinite product per se, is the bulk of the measured
 * ~70x (the imp-95272 ticket premise -- an infinite-product artifact --
 * is thereby REFINED: truncating the product to finite N recovers almost
 * nothing, re-anchoring the base side recovers almost everything).
 *
 * THEOREM BL-JIT. Rates occupying distinct delta-windows of a geometric
 * rho-lattice (any count N, arbitrary real amplitudes), x = d nu_min:
 *   sqrt(Lambda) <= BL <= e^(-x) s(rho, delta) (1 + s(rho, delta)
 *                         tau(rho, delta, x)).
 * Proof. w_1 = e^(-x) exactly and its product is <= s (LEMMA BASE-SIDE).
 * For i >= 2, nu_i / nu_1 >= rho^(m_i)/delta^2 with m_i = k_i - k_1
 * distinct positive integers, so w_i <= e^(-x rho^(m_i)/delta^2) and,
 * since m -> e^(-x rho^m / delta^2) is decreasing, sum_(i >= 2) w_i <=
 * e^(-x) tau(rho, delta, x); each such product is <= s^2. Summing:
 * BL <= e^(-x) s + e^(-x) tau s^2. QED (of this lemma only).
 *
 * COROLLARY BL-JIT-1 (delta = 1 strictly subsumes BL-LAT). The new collar
 * c^2 e^(-2x)(1 + c tau)^2 <= the BL-LAT collar c^4 e^(-2x)(1 + tau)^2
 * for every x, since 1 + c tau <= c (1 + tau) iff 1 <= c. At the imp-95232
 * dyadic baseline (rho = 2, N = 10, x = 6): new collar 4.36114239e-4 vs
 * Lambda 4.100892e-4 -- collar/Lambda drops 69.954 -> 1.06346, a 65.78x
 * count-uniform sharpening; the collar is now within 3.4% of the RAW BL^2
 * (4.217175e-4). The count-uniform firing onset drops
 *   xStarBL(2) = 4.23623878476  ->  xStar1(2) = 2.59369181036337
 * (unique fixed point of x = ln c + ln(1 + c tau_2(x)); RHS strictly
 * decreasing in x, LHS strictly increasing, so uniqueness is elementary).
 *
 * COROLLARY BL-JIT-2 (off-lattice, count-uniform). For delta > 1 the same
 * collar certifies EVERY rate set within multiplicative jitter delta of
 * distinct lattice sites -- the first count-uniform off-lattice signed
 * certificate of the chain (imp-95232 FINDING 2 only measured the raw
 * count-FREE BL there). The price is explicit and diverges gracefully as
 * delta -> sqrt(rho) (the m = 1 factor blows up):
 *   rho = 2:  delta   1     1.05   1.1    1.15   2^(1/4)  1.25   1.3    1.35   1.4
 *             s       8.256 10.586 13.932 18.951 24.857   40.824 68.761 144.57 779.63
 *             xStar   2.594 3.010  3.514  4.132  4.722    5.890  7.195  9.080  13.05
 * So +-10% jitter (delta = 1.1) costs onset 2.59 -> 3.51, still BELOW the
 * old exact-lattice onset 4.236: the sharpened off-lattice certificate at
 * 10% jitter beats the old on-lattice one.
 *
 * HONEST SCOPE AND CAVEATS. (a) The imp-95232 eps = 0.2 fixed witness
 * needs delta = 1.2195 (its worst site factor); at its x = 5.16 the
 * count-uniform collar evaluates to 1.2911 -- it does NOT fire there
 * (onset xStar(2, 1.2195) = 5.2590): count-uniformity is paid for, the
 * count-free raw BL still fires at 1.008-sharp per imp-95232. (b) Windows
 * must be DISTINCT: two rates in one window (in-octave multiplicity)
 * violate the hypothesis and the raw BL exceeds the collar by orders
 * (asserted below) -- that wall stays with SGN-C / SPLIT-2 / COAL-N per
 * imp-95232 FINDING 3, unchanged. (c) This is the off-lattice CEILING
 * (certificate) leg; the off-lattice extension of the RZ-PEN symbol-pencil
 * FLOOR (imp-95335 / imp-95374) is untouched and stays OPEN. (d) Downstream
 * onsets (SPLIT-2 7.10, EV-OCT, SPLIT-RZ 12.82-13.30) compare against
 * xStarBL = 4.236 as a historical anchor; re-basing those comparisons to
 * xStar1 = 2.594 is follow-on bookkeeping, their own certificates are
 * unaffected. (e) Model family only -- does NOT certify the paper packets
 * (imp-95212 envelope port still open). Changes no bound; NO QED;
 * no refereed bound is changed.
 */

// ---------------------------------------------------------------------------
// Reference constants (all cross-checked by the assertions below)
// ---------------------------------------------------------------------------

export const IMP95272_BASE_ANCHORED_JITTER_COLLAR = {
  id: "imp-95272",
  title:
    "LEMMA BASE-SIDE + THEOREM BL-JIT: base-anchored count-uniform lattice " +
    "collar (65.78x sharpening, onset 4.236 -> 2.594) and its jitter-robust " +
    "off-lattice extension delta^2 < rho",
  collar:
    "sqrt(Lambda) <= e^(-x) s(rho,delta) (1 + s(rho,delta) tau(rho,delta,x)), " +
    "s = prod_(m>=1) (rho^m + delta^2)/(rho^m - delta^2), tau = sum_(m>=1) " +
    "e^(-x(rho^m/delta^2 - 1)), x = d nu_min, for rates in distinct " +
    "delta-windows of a geometric rho-lattice; delta = 1 is BL-LAT scope",
  baseline: {
    rho: 2,
    N: 10,
    x: 6,
    lambdaExact: 4.100892e-4,
    blSquaredRaw: 4.217175e-4,
    oldCollar: 2.868751e-2,
    oldOverLambda: 69.954,
    newCollar: 4.36114239e-4,
    newOverLambda: 1.06346,
    sharpening: 65.7798,
    note:
      "the ~70x of imp-95232 FINDING 1 was the two-sided mischarge of the " +
      "dominant lowest rate, not primarily the infinite product",
  },
  onsets: {
    xStarBLOld: 4.23623878476,
    xStar1New: 2.59369181036337,
    note:
      "fixed point of x = ln c(2) + ln(1 + c(2) tau_2(x)); unique since the " +
      "RHS is strictly decreasing in x",
  },
  jitterTable: [
    { delta: 1.0, s: 8.255987935778, xStar: 2.59369181 },
    { delta: 1.05, s: 10.585633032101, xStar: 3.01021053 },
    { delta: 1.1, s: 13.932176152685, xStar: 3.51359891 },
    { delta: 1.15, s: 18.951192472515, xStar: 4.13177402 },
    { delta: 1.189207, s: 24.856838313898, xStar: 4.72173871 },
    { delta: 1.25, s: 40.823710264015, xStar: 5.88980186 },
    { delta: 1.3, s: 68.760828360992, xStar: 7.19471549 },
    { delta: 1.35, s: 144.569829243001, xStar: 9.07986033 },
    { delta: 1.4, s: 779.634856259193, xStar: 13.05293925 },
  ],
  witnessCaveat: {
    deltaNeeded: 1.2195121951219512,
    sNeeded: 31.393817359326167,
    x: 5.16,
    collarValue: 1.2911161403584885,
    xStarNeeded: 5.259008367006105,
    fires: false,
    note:
      "the imp-95232 eps = 0.2 witness sits just below the count-uniform " +
      "onset at its jitter level; the count-free raw BL still fires there " +
      "(ratio 1.008, imp-95232)",
  },
  verdict:
    "RIGOROUS at the stated scope: LEMMA RATIO / LEMMA BASE-SIDE / THEOREM " +
    "BL-JIT are elementary majorizations on top of the proven PROP BL " +
    "(imp-95226). Count-uniform collar sharpened 65.78x at the dyadic " +
    "baseline, onset 4.236 -> 2.594, and extended off-lattice to " +
    "delta^2 < rho jitter windows (10% jitter onset 3.514 beats the old " +
    "exact-lattice 4.236). In-octave multiplicity stays a wall (hypothesis " +
    "load-bearing, asserted); the RZ-PEN FLOOR off-lattice leg (imp-95335/" +
    "imp-95374) remains OPEN; does NOT certify the paper packets. Changes " +
    "no bound of the Lambda program; NO QED; no refereed bound is changed" +
    ".",
};

// ---------------------------------------------------------------------------
// Self-executing assertions (import-light: no imports at all)
// ---------------------------------------------------------------------------

function gramCauchy(nus) {
  return nus.map((a) => nus.map((b) => 1 / (a + b)));
}
function pencilM(nus, d) {
  const w = nus.map((nu) => Math.exp(-d * nu));
  return nus.map((a, i) => nus.map((b, j) => (w[i] * w[j]) / (a + b)));
}
// general small-N pencil lambda_max: Cholesky of G + power iteration
function pencilLmax(M, G, iters) {
  const n = G.length;
  const L = Array.from({ length: n }, () => new Array(n).fill(0));
  for (let i = 0; i < n; i++) {
    for (let j = 0; j <= i; j++) {
      let s = G[i][j];
      for (let k = 0; k < j; k++) s -= L[i][k] * L[j][k];
      if (i === j) L[i][i] = Math.sqrt(s);
      else L[i][j] = s / L[j][j];
    }
  }
  let v = new Array(n).fill(0).map((_, i) => 1 + 0.001 * Math.sin(i + 1));
  let lam = 0;
  for (let it = 0; it < iters; it++) {
    const u = v.slice();
    for (let i = n - 1; i >= 0; i--) {
      for (let k = i + 1; k < n; k++) u[i] -= L[k][i] * u[k];
      u[i] /= L[i][i];
    }
    const w = M.map((row) => row.reduce((s, m, j) => s + m * u[j], 0));
    const sVec = w.slice();
    for (let i = 0; i < n; i++) {
      for (let k = 0; k < i; k++) sVec[i] -= L[i][k] * sVec[k];
      sVec[i] /= L[i][i];
    }
    const norm = Math.hypot(...sVec);
    lam = v.reduce((a, xv, i) => a + xv * sVec[i], 0);
    v = sVec.map((xv) => xv / norm);
  }
  return lam;
}
function blBound(nus, d) {
  let s = 0;
  for (let i = 0; i < nus.length; i++) {
    let prod = Math.exp(-d * nus[i]);
    for (let j = 0; j < nus.length; j++) {
      if (j !== i) prod *= (nus[i] + nus[j]) / Math.abs(nus[i] - nus[j]);
    }
    s += prod;
  }
  return s;
}
function sJit(rho, delta, K = 400) {
  const d2 = delta * delta;
  let P = 1;
  for (let m = 1; m <= K; m++) P *= (rho ** m + d2) / (rho ** m - d2);
  return P;
}
function tauJit(rho, delta, x, K = 400) {
  const d2 = delta * delta;
  let t = 0;
  for (let m = 1; m <= K; m++) {
    const e = x * (rho ** m / d2 - 1);
    if (e > 700) break;
    t += Math.exp(-e);
  }
  return t;
}
function collarJit(rho, delta, x) {
  const s = sJit(rho, delta);
  return (Math.exp(-x) * s * (1 + s * tauJit(rho, delta, x))) ** 2;
}
function xStarFix(rho, delta) {
  const s = sJit(rho, delta);
  let x = Math.log(s) + 1;
  for (let it = 0; it < 600; it++) {
    x = Math.log(s) + Math.log(1 + s * tauJit(rho, delta, x));
  }
  return x;
}
// deterministic LCG for reproducible jitter trials
function prng(seed) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

const K95272 = IMP95272_BASE_ANCHORED_JITTER_COLLAR;

export const IMP95272_BL_JIT_ASSERTIONS = [
  {
    id: "imp95272-s-recovers-c-and-monotone",
    description:
      "s(rho, 1) recovers the BL-LAT constant c(rho) (c(2) = 8.255987935778 " +
      "to 1e-10) and s(2, delta) is strictly increasing in delta on the table",
    holds: () => {
      if (Math.abs(sJit(2, 1) - 8.255987935778251) > 1e-10) return false;
      let prev = 0;
      for (const row of K95272.jitterTable) {
        const s = sJit(2, row.delta);
        if (Math.abs(s - row.s) / row.s > 1e-9) return false;
        if (!(s > prev)) return false;
        prev = s;
      }
      return true;
    },
  },
  {
    id: "imp95272-baseline-sharpening",
    description:
      "COROLLARY BL-JIT-1 at the imp-95232 baseline (rho=2, N=10, x=6): new " +
      "collar 4.36114239e-4, collar/Lambda 69.954 -> 1.06346 (65.78x), and " +
      "the new collar still dominates the raw BL^2",
    holds: () => {
      const base = [1, 2, 4, 8, 16, 32, 64, 128, 256, 512];
      const lam = pencilLmax(pencilM(base, 6), gramCauchy(base), 6000);
      const bl2 = blBound(base, 6) ** 2;
      const c = sJit(2, 1);
      const oldCol = c ** 4 * Math.exp(-12) * (1 + tauJit(2, 1, 6)) ** 2;
      const newCol = collarJit(2, 1, 6);
      const b = K95272.baseline;
      if (Math.abs(lam - b.lambdaExact) / b.lambdaExact > 1e-4) return false;
      if (Math.abs(newCol - b.newCollar) / b.newCollar > 1e-8) return false;
      if (Math.abs(oldCol / lam - b.oldOverLambda) / b.oldOverLambda > 1e-3)
        return false;
      if (Math.abs(newCol / lam - b.newOverLambda) > 1e-3) return false;
      if (Math.abs(oldCol / newCol - b.sharpening) / b.sharpening > 1e-4)
        return false;
      return newCol >= bl2 && newCol / lam < 1.07;
    },
  },
  {
    id: "imp95272-strictly-subsumes-bllat",
    description:
      "new collar <= old BL-LAT collar for every x on a fine grid (algebraic " +
      "reason: 1 + c tau <= c(1 + tau) iff 1 <= c), strictly for x < 20",
    holds: () => {
      const c = sJit(2, 1);
      for (let x = 0.5; x <= 20; x += 0.125) {
        const nu = (c * Math.exp(-x) * (1 + c * tauJit(2, 1, x))) ** 2;
        const ol = (c * c * Math.exp(-x) * (1 + tauJit(2, 1, x))) ** 2;
        if (!(nu < ol)) return false;
      }
      return c > 1;
    },
  },
  {
    id: "imp95272-onset-fixed-point",
    description:
      "xStar1(2) = 2.59369181036337 is the fixed point of x = ln c + " +
      "ln(1 + c tau_2(x)) to 1e-9, strictly below the old 4.23623878476, and " +
      "the collar crosses 1 there (>1 just below, <1 just above)",
    holds: () => {
      const xs = K95272.onsets.xStar1New;
      const c = sJit(2, 1);
      const res = Math.abs(
        xs - (Math.log(c) + Math.log(1 + c * tauJit(2, 1, xs))),
      );
      if (res > 1e-9) return false;
      if (!(xs < K95272.onsets.xStarBLOld - 1.5)) return false;
      return collarJit(2, 1, xs - 1e-4) > 1 && collarJit(2, 1, xs + 1e-4) < 1;
    },
  },
  {
    id: "imp95272-lattice-domination",
    description:
      "proof cross-check on exact lattices: collar >= BL^2 >= Lambda across " +
      "x in {3..10} and N in {3,5,8,10,12} (rho = 2, delta = 1)",
    holds: () => {
      for (const x of [3, 4, 5, 6, 8, 10]) {
        for (const N of [3, 5, 8, 10, 12]) {
          const nus = Array.from({ length: N }, (_, i) => 2 ** i);
          const lam = pencilLmax(pencilM(nus, x), gramCauchy(nus), 3000);
          const bl2 = blBound(nus, x) ** 2;
          const col = collarJit(2, 1, x);
          if (!(col >= bl2 * (1 - 1e-12))) return false;
          if (!(bl2 >= lam * (1 - 1e-6))) return false;
        }
      }
      return true;
    },
  },
  {
    id: "imp95272-jitter-domination",
    description:
      "THEOREM BL-JIT cross-check: 25 deterministic-PRNG jitter trials at " +
      "each delta in {1.05, 1.2, 1.4} (N = 10, x = 6 at the actual minimum " +
      "rate): collar >= BL^2 >= Lambda on every trial",
    holds: () => {
      for (const delta of [1.05, 1.2, 1.4]) {
        const rnd = prng(42);
        for (let t = 0; t < 25; t++) {
          const nus = Array.from(
            { length: 10 },
            (_, i) => 2 ** i * Math.exp((2 * rnd() - 1) * Math.log(delta)),
          );
          nus.sort((a, b) => a - b);
          const d = 6 / nus[0];
          const lam = pencilLmax(pencilM(nus, d), gramCauchy(nus), 3000);
          const bl2 = blBound(nus, d) ** 2;
          const col = collarJit(2, delta, 6);
          if (!(col >= bl2 * (1 - 1e-12))) return false;
          if (!(bl2 >= lam * (1 - 1e-6))) return false;
        }
      }
      return true;
    },
  },
  {
    id: "imp95272-jitter-onset-table",
    description:
      "COROLLARY BL-JIT-2 constants: each tabulated onset is the collar = 1 " +
      "crossing to 1e-6, onsets increase in delta, and the 10% jitter onset " +
      "3.5136 stays below the old exact-lattice onset 4.2362",
    holds: () => {
      let prev = 0;
      for (const row of K95272.jitterTable) {
        const xs = xStarFix(2, row.delta);
        if (Math.abs(xs - row.xStar) > 1e-6) return false;
        if (!(xs > prev)) return false;
        prev = xs;
        if (collarJit(2, row.delta, xs + 1e-5) >= 1) return false;
      }
      const x11 = K95272.jitterTable[2];
      return x11.delta === 1.1 && x11.xStar < K95272.onsets.xStarBLOld;
    },
  },
  {
    id: "imp95272-witness-caveat-honest",
    description:
      "HONEST CAVEAT (a): the imp-95232 eps = 0.2 witness needs delta = " +
      "1.21951..., where the count-uniform collar evaluates to 1.29111 at " +
      "x = 5.16 (does NOT fire; onset there is 5.25901) -- the count-free " +
      "raw BL is what fires on that witness",
    holds: () => {
      const wc = K95272.witnessCaveat;
      const base = [1, 2, 4, 8, 16, 32, 64, 128, 256, 512];
      const pert = [-0.7, 0.4, -0.9, 0.5, -0.3, 0.8, -0.6, 0.2, -0.5, 0.9];
      const nus = base.map((s, i) => s * (1 + 0.2 * pert[i]));
      nus.sort((a, b) => a - b);
      const facts = nus.map((v, i) => v / base[i]);
      const deltaW = Math.max(...facts.map((f) => Math.max(f, 1 / f)));
      if (Math.abs(deltaW - wc.deltaNeeded) > 1e-12) return false;
      if (!(deltaW * deltaW < 2)) return false;
      if (Math.abs(sJit(2, deltaW) - wc.sNeeded) / wc.sNeeded > 1e-9)
        return false;
      const col = collarJit(2, deltaW, 6 * nus[0]);
      if (Math.abs(col - wc.collarValue) / wc.collarValue > 1e-9) return false;
      const xs = xStarFix(2, deltaW);
      if (Math.abs(xs - wc.xStarNeeded) > 1e-6) return false;
      // does not fire at the witness x, fires just above the onset
      return col > 1 && wc.fires === false && wc.x < xs;
    },
  },
  {
    id: "imp95272-distinct-window-hypothesis-load-bearing",
    description:
      "HONEST CAVEAT (b): two rates per window (in-octave ratio 1.1, the " +
      "imp-95232 FINDING 3 configuration) violate the hypothesis and the " +
      "raw BL^2 exceeds the delta = 1.05 collar by > 1e4 -- the collar " +
      "cannot be applied there and the in-octave wall stands",
    holds: () => {
      const sites = [1, 2, 4, 8, 16, 32];
      const nus = [];
      for (const s of sites) {
        nus.push(s);
        nus.push(s * 1.1);
      }
      nus.sort((a, b) => a - b);
      const bl2 = blBound(nus, 6) ** 2;
      const col = collarJit(2, 1.05, 6);
      return bl2 > 1 && col < 1 && bl2 / col > 1e4;
    },
  },
  {
    id: "imp95272-verdict-honesty",
    description:
      "the verdict carries the honest scope: rigorous majorization scope " +
      "stated, in-octave wall stands, the RZ-PEN floor off-lattice leg " +
      "remains OPEN, paper packets not certified, no bound change, NO QED, " +
      "no refereed bound is changed",
    holds: () =>
      /RIGOROUS at the stated scope/.test(K95272.verdict) &&
      /load-bearing/.test(K95272.verdict) &&
      /remains OPEN/.test(K95272.verdict) &&
      /does NOT certify the paper packets/.test(K95272.verdict) &&
      /NO QED/.test(K95272.verdict) &&
      /refereed bound is changed/i.test(K95272.verdict),
  },
];

for (const a of IMP95272_BL_JIT_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-95272-base-anchored-jitter-collar assertion failed: ${a.id}`,
    );
  }
}

export default IMP95272_BASE_ANCHORED_JITTER_COLLAR;
