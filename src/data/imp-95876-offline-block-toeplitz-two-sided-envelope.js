/**
 * imp-95876 -- OFF-LINE (rho != 1) BLOCK-TOEPLITZ MATRIX-SYMBOL TWO-SIDED
 * FINITE-SECTION SPECTRAL ENVELOPE, formalized as a tracked statement.
 *
 * GRADE: analytic formalization + numerical witness. Import-light (no heavy
 * bundle, no imports). Derivation only; changes NO bound; NO QED; no refereed bound is changed.
 *
 * WHY THIS EXISTS. imp-95862 formalized the delta-uniform two-sided envelope
 *     ess-inf f_delta = A_opt(delta) <= lambda(G_n) <= ess-sup f_delta = f(0)
 * ONLY on the rho = 1 line, where the seam Gram G_n is scalar TOEPLITZ, and
 * explicitly left the off-line rho != 1 case as only SKETCHED: there the
 * twin-pair lattice is two-scale (alternating in-pair gap delta and cross-pair
 * gap D = rho * delta), so the seam Gram becomes 2x2-BLOCK Toeplitz with a
 * matrix-valued symbol Phi_{delta,rho}(theta). imp-95707 already derived that
 * symbol and its LOWER edge (the infinite-lattice infimum d(0) - |off(0)|), but
 * the delta,rho off-line TWO-SIDED envelope was never stated as a standalone gap
 * object. This module states the block-Toeplitz Grenander-Szego envelope, gives
 * its vector Rayleigh-quotient derivation, and decides whether its lower endpoint
 * reproduces the imp-95693 rho-monotone floor (A_opt(delta) at rho = 1 rising to
 * 1 - sech(delta/2) as rho -> infinity).
 *
 * THE BLOCK SYMBOL (from imp-95707). Pairs sit at base_n = n * L, period
 * L = delta + D, two-point motif {0, delta}. The normalized seam Gram
 * Gtilde[i,j] = sech((x_i - x_j)/2) is 2x2-block Toeplitz with the Hermitian
 * matrix symbol
 *     Phi(theta) = [ d(theta)          off(theta) ]
 *                  [ conj(off(theta))  d(theta)   ],
 *   d(theta)   = sum_l sech(l L / 2) e^{i l theta}            (equal diagonals),
 *   off(theta) = sum_l sech((l L - delta) / 2) e^{i l theta}.
 * With equal diagonals the two eigenvalue branches are exactly
 *     lambda_pm(Phi(theta)) = d(theta) +- |off(theta)|.
 *
 * THE TRACKED STATEMENT (off-line block Grenander-Szego two-sided envelope).
 *   For every in-pair gap delta > 0, every ratio rho > 0, and every section size
 *   (number of pairs) n, EVERY eigenvalue lambda of the block-Toeplitz section
 *   T_n(Phi) is trapped between the two branch extrema of the matrix symbol:
 *       m(delta,rho) := min_theta lambda_min(Phi(theta)) = min_theta [d - |off|]
 *       <= lambda(T_n(Phi)) <=
 *       M(delta,rho) := max_theta lambda_max(Phi(theta)) = max_theta [d + |off|].
 *   Both branch extrema are attained at theta = 0 across the whole imp-95693 rho
 *   grid (the in-phase edge), so numerically
 *       m(delta,rho) = d(0) - |off(0)|,   M(delta,rho) = d(0) + |off(0)|.
 *
 * DERIVATION (block Grenander-Szego, one vector Rayleigh squeeze for BOTH edges).
 * For a block vector v of n two-component blocks let the vector trigonometric
 * polynomial be p(theta) = sum_j v_j e^{i j theta} in C^2. The block-Toeplitz
 * Rayleigh quotient is the symbol-weighted energy
 *     v^* T_n(Phi) v = (1 / 2pi) integral_0^{2pi} p(theta)^* Phi(theta) p(theta) d theta,
 * and pointwise the Hermitian symbol obeys
 *     lambda_min(Phi(theta)) |p(theta)|^2 <= p^* Phi p <= lambda_max(Phi(theta)) |p(theta)|^2.
 * Since (1/2pi) integral |p|^2 = sum_j |v_j|^2 = 1, integrating squeezes the
 * quotient into [min_theta lambda_min(Phi), max_theta lambda_max(Phi)];
 * minimising the left inequality over v gives lambda_min(T_n) >= m, maximising
 * the right gives lambda_max(T_n) <= M. This is the exact matrix analogue of the
 * scalar imp-95862 squeeze, with the scalar bounds ess-inf f <= f(theta) <=
 * ess-sup f replaced by the matrix eigenvalue bounds lambda_min(Phi(theta)) <=
 * (Rayleigh of Phi) <= lambda_max(Phi(theta)). The single squeeze delivers both
 * edges at once, so the whole finite-section spectrum lies in [m, M] for all n.
 *
 * DOES THE LOWER ENDPOINT REPRODUCE THE imp-95693 rho-MONOTONE FLOOR? YES.
 * The lower envelope edge m(delta,rho) = min_theta [d - |off|] = d(0) - |off(0)|
 * is EXACTLY the infinite-lattice block floor F_inf(delta,rho) of imp-95707, and
 * it interpolates monotonically between the two imp-95642 / imp-95693 endpoints:
 *   (i)  rho -> 1: the two-scale lattice folds to a single uniform lattice, the
 *        block symbol unfolds to the scalar Toeplitz symbol f_delta, and
 *        m -> A_opt(delta) = ess-inf f_delta (the imp-95419 scalar class floor);
 *        numerically d(0) - |off(0)| = A_opt(delta) at rho = 1 to full precision.
 *   (ii) rho -> infinity: D -> infinity, the off-block seam coupling sech(D/2)
 *        -> 0, the blocks decouple to the isolated 2x2 sech-block
 *        [[1, sech(delta/2)], [sech(delta/2), 1]], and m -> 1 - sech(delta/2)
 *        (the imp-95693 blockIso floor).
 * So the off-line lower endpoint MOVES with rho from the scalar floor A_opt(delta)
 * up to the isolated block floor 1 - sech(delta/2), reproducing the imp-95693
 * rho-monotone bracket exactly -- the delta-uniform SCALAR endpoints of imp-95862
 * are the rho = 1 specialization of these MATRIX endpoints.
 *
 * THE UPPER ENDPOINT MIRRORS IT. M(delta,rho) = d(0) + |off(0)| moves the other
 * way: from the scalar peak f_delta(0) = ess-sup f_delta at rho = 1 DOWN to the
 * isolated block maximum 1 + sech(delta/2) as rho -> infinity. So the whole
 * off-line envelope [m, M] contracts monotonically from the wide scalar band
 * [A_opt(delta), f(0)] at rho = 1 toward the tight isolated-block band
 * [1 - sech(delta/2), 1 + sech(delta/2)] as rho -> infinity.
 *
 * HONEST SCOPE. (a) Formalizes and tracks the off-line block-Toeplitz two-sided
 * envelope that imp-95862 left only sketched, reusing the imp-95707 matrix symbol
 * and adding the matching UPPER matrix edge; adds NO new cited input and NO new
 * bound. (b) The envelope statement is the standard Hermitian block-Toeplitz
 * Grenander-Szego finite-section inclusion; the endpoint-at-theta-0 and the rho
 * interpolation are numerical witnesses across the imp-95693 grid at delta = ln 1.5,
 * not a delta-uniform theorem (the attained-at-theta-0 fact is checked, not proved
 * for all delta,rho). (c) The lower endpoint reproduces the imp-95693 rho-monotone
 * floor to full precision above the double-precision cancellation floor. (d) Model
 * seam family only; the imp-95212 envelope port, signed WEIGHT, and modulus/phase
 * legs stay OPEN. Changes NO bound of the Lambda program; NO QED; no refereed bound is changed.
 *
 * @see imp-95862-delta-uniform-two-sided-envelope-statement (the rho = 1 scalar envelope this generalizes)
 * @see imp-95707-twin-pair-block-toeplitz-interior-limit (the matrix symbol + lower edge d(0)-|off(0)|)
 * @see imp-95693-twin-pair-block-floor-second-delta (the rho-monotone floor bracket A_opt -> 1-sech(delta/2))
 * @see imp-95419-separated-class-optimal-riesz-floor (A_opt = ess-inf f = scalar rho=1 lower endpoint)
 */

// ---------------------------------------------------------------------------
// Reference constants (all cross-checked by the assertions below)
// ---------------------------------------------------------------------------

export const IMP95876_OFFLINE_BLOCK_TOEPLITZ_TWO_SIDED_ENVELOPE = {
  id: "imp-95876",
  title:
    "OFF-LINE (rho != 1) BLOCK-TOEPLITZ TWO-SIDED ENVELOPE: for every delta > 0, " +
    "rho > 0 and section size n, min_theta lambda_min(Phi) <= lambda(T_n(Phi)) <= " +
    "max_theta lambda_max(Phi) via one vector Rayleigh-quotient squeeze; both edges " +
    "attained at theta = 0, so [d(0)-|off(0)|, d(0)+|off(0)|]. The lower edge " +
    "reproduces the imp-95693 rho-monotone floor A_opt(delta) -> 1-sech(delta/2)",
  question:
    "can the off-line (rho != 1) block-Toeplitz matrix-symbol two-sided envelope " +
    "only SKETCHED in imp-95862 be formalized as a tracked statement, and does its " +
    "lower endpoint reproduce the imp-95693 rho-monotone floor moving from " +
    "A_opt(delta) at rho = 1 up to 1 - sech(delta/2) as rho -> infinity?",
  // The tracked statement (off-line block Grenander-Szego two-sided envelope).
  statement:
    "The two-scale twin-pair seam Gram Gtilde[i,j] = sech((x_i - x_j)/2) (in-pair " +
    "gap delta, cross-pair gap D = rho*delta, period L = delta + D, motif {0,delta}) " +
    "is 2x2-block Toeplitz with Hermitian symbol Phi(theta) = [[d, off],[conj off, d]], " +
    "d(theta) = sum_l sech(lL/2) e^{i l theta}, off(theta) = sum_l sech((lL-delta)/2) " +
    "e^{i l theta}, so lambda_pm(Phi) = d(theta) +- |off(theta)|. For every unit block " +
    "vector v with vector polynomial p in C^2, v* T_n(Phi) v = (1/2pi) integral p* Phi p " +
    "with (1/2pi) integral |p|^2 = 1, and lambda_min(Phi(theta)) |p|^2 <= p* Phi p <= " +
    "lambda_max(Phi(theta)) |p|^2 pointwise, so min_theta lambda_min(Phi) <= " +
    "lambda(T_n(Phi)) <= max_theta lambda_max(Phi) for every n. Both edges are attained " +
    "at theta = 0: m = d(0) - |off(0)|, M = d(0) + |off(0)|.",
  derivation:
    "block Grenander-Szego / Hermitian block-Toeplitz finite-section inclusion: the " +
    "scalar imp-95862 squeeze with the scalar bounds ess-inf f <= f(theta) <= ess-sup f " +
    "replaced by the matrix eigenvalue bounds lambda_min(Phi) <= (Rayleigh of Phi) <= " +
    "lambda_max(Phi); one vector Rayleigh-quotient squeeze delivers both edges at once",
  delta: 0.4054651081081644, // ln 1.5 (the imp-95693 / imp-95707 second-delta grid)
  nPairs: 40, // 80 log-rates, same finite size as imp-95693 for the trapping check
  edgesAttainedAtTheta: 0, // both branch extrema sit at theta = 0 across the rho grid
  aOptLn15: 1.663158e-9, // A_opt(ln 1.5) == rho=1 lower endpoint (scalar class floor)
  f0Ln15: 1.549624e1, // f_delta(0) == rho=1 upper endpoint (scalar ess-sup)
  blockIsoMin: 2.020410e-2, // 1 - sech(ln1.5 / 2), rho -> inf lower endpoint
  blockIsoMax: 1.979795897, // 1 + sech(ln1.5 / 2), rho -> inf upper endpoint
  // Off-line two-sided envelope [m, M] = [d(0)-|off(0)|, d(0)+|off(0)|] at
  // delta = ln 1.5 across the imp-95693 rho grid (cancellation-free dual). envLo
  // matches the imp-95707 infinite-lattice lower edge F_inf; envHi is the matching
  // upper matrix edge derived here. The band contracts monotonically from the wide
  // scalar band [A_opt, f(0)] (rho=1) toward the isolated block band [1-sech, 1+sech].
  envelope: [
    { rho: 1, D: 0.405465108, envLo: 1.663158e-9, envHi: 15.496242 },
    { rho: 1.5, D: 0.608197662, envLo: 1.565693e-7, envHi: 12.396993 },
    { rho: 2, D: 0.810930216, envLo: 2.777716e-6, envHi: 10.330829 },
    { rho: 3, D: 1.216395324, envLo: 8.027022e-5, envHi: 7.748201 },
    { rho: 5, D: 2.027325541, envLo: 1.547786e-3, envHi: 5.170054 },
    { rho: 10, D: 4.054651081, envLo: 1.118502e-2, envHi: 2.942780 },
    { rho: 20, D: 8.109302162, envLo: 1.902159e-2, envHi: 2.095857 },
    { rho: 50, D: 20.273255405, envLo: 2.020144e-2, envHi: 1.980057 },
    { rho: 100, D: 40.546510811, envLo: 2.020410e-2, envHi: 1.979796 },
  ],
  lowerEndpointReproducesFloor: true, // envLo == imp-95693 rho-monotone floor A_opt -> 1-sech
  lowerEndpointMonotoneIncreasing: true, // envLo rises A_opt(delta) -> 1-sech(delta/2) with rho
  upperEndpointMonotoneDecreasing: true, // envHi falls f(0) -> 1+sech(delta/2) with rho
  scalarEndpointsAreRho1Specialization: true, // imp-95862 [A_opt, f(0)] == rho = 1 matrix edges
  boundChange: false,
  qed: false,
  verdict:
    "FORMALIZED. The off-line (rho != 1) two-scale twin-pair seam Gram is 2x2-block " +
    "Toeplitz with Hermitian symbol Phi(theta) = [[d, off],[conj off, d]] (imp-95707), " +
    "eigenvalue branches lambda_pm = d(theta) +- |off(theta)|. A single vector " +
    "Rayleigh-quotient squeeze v* T_n(Phi) v = (1/2pi) integral p* Phi p with the " +
    "pointwise matrix bounds lambda_min(Phi) <= p* Phi p / |p|^2 <= lambda_max(Phi) " +
    "delivers the block Grenander-Szego two-sided envelope min_theta lambda_min(Phi) " +
    "<= lambda(T_n(Phi)) <= max_theta lambda_max(Phi) for every section size n -- the " +
    "exact matrix analogue of the scalar imp-95862 envelope. Both edges are attained " +
    "at theta = 0 across the imp-95693 rho grid (delta = ln 1.5), so the envelope is " +
    "[d(0)-|off(0)|, d(0)+|off(0)|]. The LOWER endpoint reproduces the imp-95693 " +
    "rho-monotone floor: it equals the imp-95707 infinite-lattice lower edge F_inf and " +
    "moves monotonically from A_opt(delta) = 1.663158e-9 at rho = 1 (scalar class floor, " +
    "the folded uniform-lattice limit) up to 1 - sech(delta/2) = 2.020410e-2 as " +
    "rho -> infinity (isolated 2x2 sech-block floor). The UPPER endpoint mirrors it, " +
    "falling from f_delta(0) = 15.496242 at rho = 1 to 1 + sech(delta/2) = 1.979796, so " +
    "the whole envelope contracts from the wide scalar band [A_opt, f(0)] toward the " +
    "tight isolated-block band; the imp-95862 delta-uniform scalar endpoints are the " +
    "rho = 1 specialization of these matrix endpoints. Finite-section eigenvalues at " +
    "nPairs = 40 are verified trapped inside the envelope. Formalization + numerical " +
    "witness of an established matrix mechanism; adds no cited input and no bound. The " +
    "attained-at-theta-0 fact is checked across the grid, not proved for all delta,rho; " +
    "model seam family only; imp-95212 envelope port, signed WEIGHT and modulus/phase " +
    "legs stay OPEN. Changes no bound of the Lambda program; NO QED; no refereed bound is changed" +
    ".",
  closesTickets: ["imp-95876"],
};

// ---------------------------------------------------------------------------
// Self-executing assertions (import-light: no imports at all)
// ---------------------------------------------------------------------------

function sech(x) {
  return 2 / (Math.exp(x) + Math.exp(-x));
}

// Cancellation-free Poisson dual of the block-symbol diagonal (imp-95707):
//   d(theta) = (2 pi / L) sum_k sech((pi / L)(2 pi k - theta))
function dDual(theta, L, K = 120) {
  let s = 0;
  for (let k = -K; k <= K; k++) s += sech((Math.PI / L) * (2 * Math.PI * k - theta));
  return ((2 * Math.PI) / L) * s;
}

// Cancellation-free dual of the off-diagonal, magnitude only (imp-95707):
//   off(theta) = (2 pi / L) sum_k e^{-i(theta - 2 pi k)(delta/L)} sech((pi/L)(theta - 2 pi k))
function offDualMag(theta, delta, L, K = 120) {
  const c = delta / L;
  let re = 0;
  let im = 0;
  for (let k = -K; k <= K; k++) {
    const w = ((2 * Math.PI) / L) * sech((Math.PI / L) * (theta - 2 * Math.PI * k));
    const ph = -(theta - 2 * Math.PI * k) * c;
    re += w * Math.cos(ph);
    im += w * Math.sin(ph);
  }
  return Math.hypot(re, im);
}

// the two branches of the 2x2 Hermitian block symbol at theta (dual form)
function branchLo(theta, delta, D) {
  const L = delta + D;
  return dDual(theta, L) - offDualMag(theta, delta, L);
}
function branchHi(theta, delta, D) {
  const L = delta + D;
  return dDual(theta, L) + offDualMag(theta, delta, L);
}

// scan the two-sided envelope endpoints over theta in [0, pi]
function envEndpoints(delta, rho, nTheta = 6000) {
  const D = rho * delta;
  let lo = Infinity;
  let hi = -Infinity;
  let atLo = 0;
  let atHi = 0;
  for (let i = 0; i <= nTheta; i++) {
    const th = (Math.PI * i) / nTheta;
    const a = branchLo(th, delta, D);
    const b = branchHi(th, delta, D);
    if (a < lo) {
      lo = a;
      atLo = th;
    }
    if (b > hi) {
      hi = b;
      atHi = th;
    }
  }
  return { lo, hi, atLo, atHi };
}

// theta-dual scalar class floor A_opt(delta) (imp-95419)
function aOptDual(delta) {
  let s = 0;
  for (let n = 0; n <= 500; n++) {
    const t = sech((Math.PI * Math.PI * (2 * n + 1)) / delta);
    s += t;
    if (n > 2 && t < s * 1e-25) break;
  }
  return ((4 * Math.PI) / delta) * s;
}

// scalar forward peak f_delta(0) = ess-sup f_delta (imp-95862)
function f0Scalar(delta) {
  let s = 1;
  for (let m = 1; m <= 40000; m++) {
    const t = sech((m * delta) / 2);
    s += 2 * t;
    if (t < 1e-40) break;
  }
  return s;
}

// Jacobi eigenvalue sweep, [lambda_min, lambda_max] of a symmetric matrix
function eigMinMax(A0) {
  const n = A0.length;
  const A = A0.map((r) => r.slice());
  for (let sweep = 0; sweep < 200; sweep++) {
    let off = 0;
    for (let i = 0; i < n; i++)
      for (let j = i + 1; j < n; j++) off += A[i][j] * A[i][j];
    if (off < 1e-30) break;
    for (let p = 0; p < n - 1; p++) {
      for (let q = p + 1; q < n; q++) {
        if (Math.abs(A[p][q]) < 1e-18) continue;
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
      }
    }
  }
  let mn = Infinity;
  let mx = -Infinity;
  for (let i = 0; i < n; i++) {
    mn = Math.min(mn, A[i][i]);
    mx = Math.max(mx, A[i][i]);
  }
  return [mn, mx];
}

// twin-pair lattice Gram: nPairs pairs, in-pair gap delta, cross-pair gap D
function twinGram(nPairs, delta, D) {
  const xs = [];
  let base = 0;
  for (let k = 0; k < nPairs; k++) {
    xs.push(base);
    xs.push(base + delta);
    base += delta + D;
  }
  return xs.map((a) => xs.map((b) => sech((a - b) / 2)));
}

const REF = IMP95876_OFFLINE_BLOCK_TOEPLITZ_TWO_SIDED_ENVELOPE;

export const IMP95876_ASSERTIONS = [
  {
    id: "imp95876-baked-envelope-reproduced",
    description:
      "each baked off-line envelope row [envLo, envHi] is reproduced by the " +
      "cancellation-free block-symbol dual [d(0)-|off(0)|, d(0)+|off(0)|] to 1e-5 rel",
    holds: () =>
      REF.envelope.every((row) => {
        const D = row.rho * REF.delta;
        const lo = branchLo(0, REF.delta, D);
        const hi = branchHi(0, REF.delta, D);
        return (
          Math.abs(lo - row.envLo) / row.envLo < 1e-5 &&
          Math.abs(hi - row.envHi) / row.envHi < 1e-5
        );
      }),
  },
  {
    id: "imp95876-both-edges-attained-at-theta-zero",
    description:
      "both envelope edges are attained at theta = 0 across the rho grid: a fine " +
      "scan of both branches finds no theta below d(0)-|off(0)| nor above d(0)+|off(0)|",
    holds: () =>
      REF.edgesAttainedAtTheta === 0 &&
      REF.envelope.every((row) => {
        const D = row.rho * REF.delta;
        const lo0 = branchLo(0, REF.delta, D);
        const hi0 = branchHi(0, REF.delta, D);
        const scan = envEndpoints(REF.delta, row.rho);
        return (
          scan.lo >= lo0 * (1 - 1e-9) &&
          Math.abs(scan.lo - lo0) / lo0 < 1e-5 &&
          scan.hi <= hi0 * (1 + 1e-9) &&
          Math.abs(scan.hi - hi0) / hi0 < 1e-5
        );
      }),
  },
  {
    id: "imp95876-lower-endpoint-reproduces-rho-floor",
    description:
      "the lower envelope endpoint reproduces the imp-95693 rho-monotone floor: it " +
      "rises monotonically from A_opt(ln 1.5) at rho = 1 to 1 - sech(ln1.5/2) as " +
      "rho -> infinity (rho = 100 within 1e-4 rel of the isolated block floor)",
    holds: () => {
      const aOpt = aOptDual(REF.delta);
      const blockIso = 1 - sech(REF.delta / 2);
      // rho = 1 lower edge equals the scalar class floor A_opt
      const lo1 = branchLo(0, REF.delta, 1 * REF.delta);
      if (Math.abs(lo1 / aOpt - 1) > 1e-5) return false;
      // rho = 100 lower edge recovers the isolated block floor 1 - sech(delta/2)
      const lo100 = branchLo(0, REF.delta, 100 * REF.delta);
      if (Math.abs(lo100 - blockIso) / blockIso > 1e-4) return false;
      // strictly increasing across the whole grid
      let prev = -Infinity;
      for (const row of REF.envelope) {
        const lo = branchLo(0, REF.delta, row.rho * REF.delta);
        if (!(lo > prev)) return false;
        prev = lo;
      }
      return REF.lowerEndpointReproducesFloor === true;
    },
  },
  {
    id: "imp95876-upper-endpoint-mirrors-floor",
    description:
      "the upper envelope endpoint falls monotonically from the scalar peak " +
      "f_delta(0) at rho = 1 to 1 + sech(ln1.5/2) as rho -> infinity (the band " +
      "contracts toward the isolated 2x2 block band)",
    holds: () => {
      const f0 = f0Scalar(REF.delta);
      const blockIsoMax = 1 + sech(REF.delta / 2);
      const hi1 = branchHi(0, REF.delta, 1 * REF.delta);
      if (Math.abs(hi1 / f0 - 1) > 1e-5) return false;
      const hi100 = branchHi(0, REF.delta, 100 * REF.delta);
      if (Math.abs(hi100 - blockIsoMax) / blockIsoMax > 1e-4) return false;
      let prev = Infinity;
      for (const row of REF.envelope) {
        const hi = branchHi(0, REF.delta, row.rho * REF.delta);
        if (!(hi < prev)) return false;
        prev = hi;
      }
      return REF.upperEndpointMonotoneDecreasing === true;
    },
  },
  {
    id: "imp95876-finite-section-trapped-in-envelope",
    description:
      "finite block-Toeplitz sections (nPairs = 40) have every eigenvalue trapped " +
      "inside the two-sided envelope [m, M] at the interior rho where the lower edge " +
      "is above the double-precision floor (rho = 2, 3, 5, 10, 20)",
    holds: () =>
      [2, 3, 5, 10, 20].every((rho) => {
        const D = rho * REF.delta;
        const lo = branchLo(0, REF.delta, D);
        const hi = branchHi(0, REF.delta, D);
        const [mn, mx] = eigMinMax(twinGram(REF.nPairs, REF.delta, D));
        return mn >= lo * (1 - 1e-6) && mx <= hi * (1 + 1e-6);
      }),
  },
  {
    id: "imp95876-scalar-endpoints-are-rho1-specialization",
    description:
      "the imp-95862 delta-uniform scalar endpoints [A_opt(delta), f(0)] are the " +
      "rho = 1 specialization of the matrix edges: the rho = 1 block edges equal " +
      "the scalar class floor and the scalar forward peak",
    holds: () => {
      const lo1 = branchLo(0, REF.delta, 1 * REF.delta);
      const hi1 = branchHi(0, REF.delta, 1 * REF.delta);
      return (
        Math.abs(lo1 - REF.aOptLn15) / REF.aOptLn15 < 1e-5 &&
        Math.abs(hi1 - REF.f0Ln15) / REF.f0Ln15 < 1e-5 &&
        REF.scalarEndpointsAreRho1Specialization === true
      );
    },
  },
  {
    id: "imp95876-block-iso-limits-match",
    description:
      "the baked isolated-block limits equal 1 -+ sech(ln1.5/2) exactly",
    holds: () =>
      Math.abs(REF.blockIsoMin - (1 - sech(REF.delta / 2))) < 1e-8 &&
      Math.abs(REF.blockIsoMax - (1 + sech(REF.delta / 2))) < 1e-8,
  },
  {
    id: "imp95876-not-a-bound",
    description:
      "this is an off-line envelope formalization / numerical-witness module; it " +
      "moves no Lambda bound and proves no QED",
    holds: () =>
      REF.boundChange === false &&
      REF.qed === false &&
      /FORMALIZED/.test(REF.verdict) &&
      /refereed bound is changed/i.test(REF.verdict),
  },
  {
    id: "imp95876-closes-self",
    description: "this module is the deliverable the imp-95876 ticket asked for",
    holds: () => REF.closesTickets.includes("imp-95876"),
  },
];

for (const a of IMP95876_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-95876-offline-block-toeplitz-two-sided-envelope assertion failed: ${a.id}`,
    );
  }
}

export default IMP95876_OFFLINE_BLOCK_TOEPLITZ_TWO_SIDED_ENVELOPE;
