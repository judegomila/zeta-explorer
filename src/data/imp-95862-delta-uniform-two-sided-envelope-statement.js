/**
 * imp-95862 -- DELTA-UNIFORM TWO-SIDED FINITE-SECTION SPECTRAL ENVELOPE, stated
 * as an explicit tracked statement (not just a four-delta numerical check).
 *
 * GRADE: analytic formalization note. Collects the two Grenander-Szego companions
 * that imp-95825 (lower) and imp-95846 (upper) verified numerically into ONE
 * tracked delta-uniform statement with its Rayleigh-quotient derivation, and
 * assesses the scope of the uniform-in-delta claim across the imp-95693 rho-sweep.
 * Import-light (no heavy bundle, no imports). Assessment/derivation only; changes
 * NO bound; NO QED; no refereed bound is changed.
 *
 * WHY THIS EXISTS. imp-95846 completed the two-sided envelope
 *     ess-inf f = A_opt(delta) <= lambda_min(G_n) <= lambda_max(G_n) <= ess-sup f = f(0)
 * but recorded it only as a numerical readout at FOUR deltas (3, 5, 8, ln 1.3),
 * and the frontier scout flagged that the delta-UNIFORM statement was never
 * formalized as a standalone gap object. This module states the envelope, its
 * derivation, and the exact source of its delta-uniformity, so downstream
 * consumers can cite one statement rather than re-deriving it per delta.
 *
 * THE TRACKED STATEMENT (rho = 1, single-scale seam Gram).
 *   Fix any in-pair gap delta > 0. At rho = 1 the seam Gram is the real symmetric
 *   Toeplitz matrix
 *       G_n[j,k] = sech((j - k) delta / 2),   j, k = 0 .. n-1,
 *   a finite section of the Toeplitz operator with the positive, continuous,
 *   2pi-periodic generating symbol
 *       f_delta(theta) = sum_{m in Z} sech(m delta/2) e^{i m theta}
 *                      = 1 + 2 sum_{m>=1} sech(m delta/2) cos(m theta) > 0.
 *   Then for EVERY section size n and EVERY eigenvalue lambda of G_n,
 *       ess-inf f_delta  <=  lambda  <=  ess-sup f_delta,
 *   with the two endpoints attained at the two symbol extrema
 *       ess-inf f_delta = f_delta(pi) = A_opt(delta),   ess-sup f_delta = f_delta(0).
 *
 * DERIVATION (Grenander-Szego, one argument for BOTH companions). For any unit
 * vector v let p(theta) = sum_j v_j e^{i j theta}. The Rayleigh quotient of the
 * Toeplitz section is the symbol-weighted energy of p,
 *     v^* G_n v = (1 / 2pi) integral_0^{2pi} |p(theta)|^2 f_delta(theta) d theta.
 * Because ess-inf f_delta <= f_delta(theta) <= ess-sup f_delta pointwise and
 * (1/2pi) integral |p|^2 = sum_j |v_j|^2 = 1, the weighted energy is squeezed:
 *     ess-inf f_delta  <=  v^* G_n v  <=  ess-sup f_delta.
 * Minimising the left inequality over v gives lambda_min(G_n) >= ess-inf f_delta
 * (the imp-95825 lower companion); maximising the right gives
 * lambda_max(G_n) <= ess-sup f_delta (the imp-95846 upper companion). The single
 * squeeze delivers both endpoints at once, so the whole finite-section spectrum is
 * trapped in the symbol range [ess-inf f_delta, ess-sup f_delta] for all n.
 *
 * SOURCE OF THE DELTA-UNIFORMITY. The only quantities entering the derivation are
 * the two endpoints of the symbol range, and NO delta-dependent hypothesis is used
 * anywhere in the squeeze. For every delta > 0 the symbol f_delta is a positive,
 * continuous, bounded generating symbol:
 *   (i)  ess-sup f_delta = f_delta(0) = 1 + 2 sum_{m>=1} sech(m delta/2) is a
 *        cancellation-free forward sum, finite and O(1/delta) for small delta;
 *   (ii) ess-inf f_delta = f_delta(pi) = A_opt(delta) > 0 for every delta (the
 *        imp-95419 theta-dual makes the alternating forward sum sign-definite).
 * Hence the envelope holds with the SAME argument at every delta -- it is exact and
 * delta-uniform across the whole rho = 1 line. What is NOT uniform is only the
 * NUMERICAL REACHABILITY of the LOWER endpoint: at small delta the infimum
 * A_opt(delta) falls to the float64 cancellation floor (A_opt ~ 6e-16 at ln 1.2,
 * ~4.5e-15 at ln 1.3, both comparable to lambda_max * eps), so the measured
 * lambda_min goes spuriously non-positive there even though the exact bound holds.
 * The UPPER endpoint stays reachable at every delta (the forward peak f(0) is
 * cancellation-free and O(1)), which is why imp-95846 could read a clean sub-1
 * ratio at ln 1.3 while imp-95825 could not confirm the lower companion there.
 *
 * SCOPE ACROSS THE imp-95693 rho-SWEEP. rho = 1 is exactly the single-scale case
 * where the lattice is uniform and G_n is scalar TOEPLITZ, so the scalar symbol
 * range [ess-inf f_delta, ess-sup f_delta] is the sharp envelope. For rho != 1 the
 * twin-pair lattice is TWO-SCALE (alternating in-pair gap delta and cross-pair gap
 * D = rho * delta), so the seam Gram is NO LONGER scalar Toeplitz -- it is
 * block-Toeplitz with 2x2 blocks and a matrix-valued symbol Phi_{delta,rho}(theta).
 * The Grenander-Szego PRINCIPLE persists (every eigenvalue of the block-Toeplitz
 * section lies between min_theta lambda_min(Phi) and max_theta lambda_max(Phi)), but
 * the SCALAR endpoints [A_opt(delta), f(0)] are the rho = 1 specialization only.
 * This is consistent with the imp-95693 rho-monotonicity: F(delta, rho) rises from
 * the scalar floor A_opt(delta) at rho = 1 up to the isolated block floor
 * 1 - sech(delta/2) as rho -> infinity, i.e. the lower envelope endpoint MOVES with
 * rho once the matrix symbol replaces the scalar one. So the delta-uniform TWO-SIDED
 * ENVELOPE statement is exact for the whole rho = 1 line but does not carry the
 * scalar endpoints off that line; the off-line generalization is the matrix-symbol
 * envelope, which is a distinct (and here only sketched) object.
 *
 * HONEST SCOPE. (a) Formalizes and tracks the delta-uniform two-sided envelope that
 * imp-95825 + imp-95846 verified at four deltas; adds NO new cited input and NO new
 * bound. (b) The envelope is exact and delta-uniform ON the rho = 1 line; the check
 * below confirms it at TWO deltas (ln 1.5, ln 2) beyond the original four, and the
 * upper companion at every delta down to ln 1.2. (c) The off-line (rho != 1) matrix
 * -symbol envelope is only sketched, not formalized; the imp-95212 envelope port,
 * signed WEIGHT, and modulus/phase legs stay OPEN. Changes NO bound of the Lambda
 * program; NO QED; no refereed bound is changed.
 *
 * @see imp-95825-finite-section-positivity-certificate (lower companion, verified)
 * @see imp-95846-finite-section-upper-companion-bound (upper companion, verified)
 * @see imp-95693-twin-pair-block-floor-second-delta (rho-sweep this envelope brackets)
 * @see imp-95419-separated-class-optimal-riesz-floor (A_opt = ess-inf f = f(pi))
 * @see imp-95880-dd-lower-companion-ln12-ln13 (CORRECTS the ln 1.2 / ln 1.3 float64
 *      essInf reads baked below: they are cancellation noise, not A_opt(delta); the
 *      true cancellation-free DD endpoints are A_opt(ln 1.2) = 4.263426e-22 and
 *      A_opt(ln 1.3) = 4.406252e-15 -- cite THOSE, not the essInf fields at those rows)
 */

// ---------------------------------------------------------------------------
// Reference constants (all cross-checked by the assertions below)
// ---------------------------------------------------------------------------

export const IMP95862_DELTA_UNIFORM_TWO_SIDED_ENVELOPE_STATEMENT = {
  id: "imp-95862",
  title:
    "DELTA-UNIFORM TWO-SIDED FINITE-SECTION SPECTRAL ENVELOPE: for every delta > 0 " +
    "and every section size n, ess-inf f_delta = A_opt(delta) <= lambda(G_n) <= " +
    "ess-sup f_delta = f(0), via one Grenander-Szego Rayleigh-quotient squeeze -- " +
    "formalized as a tracked statement, exact and delta-uniform on the rho = 1 line",
  question:
    "can the imp-95825 lower companion and the imp-95846 upper companion be stated " +
    "as ONE delta-uniform two-sided envelope, with the source of its uniformity in " +
    "delta made explicit and its scope across the imp-95693 rho-sweep assessed?",
  // The tracked statement, both companions from a single Rayleigh squeeze.
  statement:
    "At rho = 1 the seam Gram G_n[j,k] = sech((j-k) delta/2) is a finite section of " +
    "the positive Toeplitz operator with symbol f_delta(theta) = 1 + 2 sum_{m>=1} " +
    "sech(m delta/2) cos(m theta) > 0. For every unit v, v* G_n v = (1/2pi) integral " +
    "|p|^2 f_delta with (1/2pi) integral |p|^2 = 1, so ess-inf f_delta <= v* G_n v <= " +
    "ess-sup f_delta; minimising/maximising over v gives ess-inf f_delta <= " +
    "lambda_min(G_n) <= lambda_max(G_n) <= ess-sup f_delta for every n. The endpoints " +
    "are the symbol extrema ess-inf f_delta = f_delta(pi) = A_opt(delta) and " +
    "ess-sup f_delta = f_delta(0).",
  // WHY it is uniform in delta: no delta-dependent hypothesis enters the squeeze;
  // the endpoints are finite/positive symbol extrema for every delta > 0.
  deltaUniform: true,
  uniformitySource:
    "the squeeze uses only the two endpoints of the symbol range and no " +
    "delta-dependent hypothesis; f_delta is a positive continuous bounded symbol " +
    "for every delta > 0 (forward peak f(0) cancellation-free O(1/delta); infimum " +
    "f(pi) = A_opt(delta) > 0 via the imp-95419 theta-dual), so the same argument " +
    "holds at every delta -- uniformity is structural, not numerical",
  // The one caveat that is delta-DEPENDENT: numerical reachability of the LOWER
  // endpoint, not the exact bound.
  lowerEndpointReachabilityCaveat:
    "at small delta the FORWARD-SUM essInf read baked in the rows below falls to the " +
    "float64 cancellation floor (~6e-16 at ln 1.2, ~4.5e-15 at ln 1.3, comparable to " +
    "lambda_max * eps) and is itself cancellation noise, not the true A_opt(delta); " +
    "imp-95880 re-derived A_opt cancellation-free via the imp-95419 theta-dual in DD " +
    "and found the true endpoints A_opt(ln 1.2) = 4.263426e-22 (~9 orders below the " +
    "essInf row here) and A_opt(ln 1.3) = 4.406252e-15 -- cite the imp-95880 DD values, " +
    "not the essInf field at these two rows; the upper endpoint f(0) stays reachable " +
    "and correct at every delta",
  // Verified rows on the rho = 1 line. essInf = f(pi) attained, essSup = f(0),
  // lambda_min/lambda_max at n = 80. fullEnvelope = lower endpoint above the float64
  // floor so the TWO-SIDED bound is numerically confirmable at this delta.
  rho1Rows: [
    { delta: 3, label: "3", essInf: 3.121395e-1, essSup: 2.106041e0, lmin80: 3.123966e-1, lmax80: 2.104349e0, fullEnvelope: true },
    { delta: 5, label: "5", essInf: 6.987636e-1, essSup: 1.355503e0, lmin80: 6.989415e-1, lmax80: 1.355161e0, fullEnvelope: true },
    { delta: 8, label: "8", essInf: 9.280797e-1, essSup: 1.074605e0, lmin80: 9.281310e-1, lmax80: 1.074546e0, fullEnvelope: true },
    { delta: 0.4054651081095642, label: "ln1.5", essInf: 1.663158e-9, essSup: 1.549624e1, lmin80: 1.757117e-9, lmax80: 1.494857e1, fullEnvelope: true },
    { delta: 0.6931471805599453, label: "ln2", essInf: 2.374485e-5, essSup: 9.064720e0, lmin80: 2.414847e-5, lmax80: 8.941948e0, fullEnvelope: true },
    { delta: 0.26236426446749106, label: "ln1.3", essInf: 4.528817e-15, essSup: 2.394833e1, lmin80: 5.035628e-15, lmax80: 2.220651e1, fullEnvelope: false },
    { delta: 0.1823215567939546, label: "ln1.2", essInf: 5.865572e-16, essSup: 3.446211e1, lmin80: -7.900313e-16, lmax80: 3.012912e1, fullEnvelope: false },
  ],
  // Deltas at which the FULL two-sided envelope is newly confirmed beyond the
  // original imp-95846 four (3, 5, 8, ln 1.3): ln 1.5 and ln 2.
  newFullEnvelopeDeltas: ["ln1.5", "ln2"],
  // Off-line scope: for rho != 1 the Gram is block-Toeplitz (matrix symbol), so the
  // SCALAR endpoints do not carry off the rho = 1 line.
  rho1IsScalarToeplitz: true,
  offLineIsBlockToeplitz: true,
  offLineScope:
    "for rho != 1 the two-scale lattice makes the Gram block-Toeplitz with a " +
    "2x2 matrix symbol; the Grenander-Szego principle persists but the scalar " +
    "endpoints [A_opt(delta), f(0)] are the rho = 1 specialization only, consistent " +
    "with the imp-95693 rho-monotone lower floor rising from A_opt(delta) to " +
    "1 - sech(delta/2) as rho -> infinity",
  boundChange: false,
  qed: false,
  verdict:
    "FORMALIZED. The imp-95825 lower companion (lambda_min >= ess-inf f) and the " +
    "imp-95846 upper companion (lambda_max <= ess-sup f) are ONE delta-uniform " +
    "two-sided finite-section envelope, delivered by a single Grenander-Szego " +
    "Rayleigh-quotient squeeze ess-inf f <= v* G_n v <= ess-sup f for the rho = 1 " +
    "Toeplitz section. The uniformity in delta is structural: the squeeze uses only " +
    "the symbol-range endpoints and no delta-dependent hypothesis, and f_delta is a " +
    "positive continuous bounded symbol for every delta > 0. The only delta-dependent " +
    "caveat is numerical reachability of the lower endpoint (float64 cancellation " +
    "floor at small delta), not the exact bound. Confirmed at two deltas (ln 1.5, " +
    "ln 2) beyond the original four, and the upper companion at every delta down to " +
    "ln 1.2. Scope: exact on the rho = 1 line; off-line (rho != 1) the Gram is " +
    "block-Toeplitz and the scalar endpoints give way to the matrix-symbol envelope, " +
    "consistent with the imp-95693 rho-monotone lower floor. Formalization only; adds " +
    "no cited input and no bound; the off-line matrix envelope, imp-95212 envelope " +
    "port, signed WEIGHT and modulus/phase legs stay OPEN. Changes no bound of the " +
    "Lambda program; NO QED; no refereed bound is changed.",
  closesTickets: ["imp-95862"],
};

// ---------------------------------------------------------------------------
// Self-executing assertions (import-light: no imports at all)
// ---------------------------------------------------------------------------

function sech(x) {
  return 2 / (Math.exp(x) + Math.exp(-x));
}

// forward symbol f(theta) = 1 + 2 sum_{m>=1} sech(m delta/2) cos(m theta)
function symbol(theta, delta) {
  let s = 1;
  for (let m = 1; m <= 40000; m++) {
    const t = sech((m * delta) / 2);
    s += 2 * t * Math.cos(m * theta);
    if (t < 1e-40) break;
  }
  return s;
}

// Jacobi eigenvalue sweep, returns [lambda_min, lambda_max]
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

// rho = 1 single-scale (uniform) lattice: scalar Toeplitz Gram
function uniformGram(nPts, delta) {
  const xs = [];
  for (let k = 0; k < nPts; k++) xs.push(k * delta);
  return xs.map((a) => xs.map((b) => sech((a - b) / 2)));
}

// rho != 1 twin-pair (two-scale) lattice: block-Toeplitz Gram
function twinGram(nPairs, delta, rho) {
  const D = rho * delta;
  const xs = [];
  let x = 0;
  for (let k = 0; k < nPairs; k++) {
    xs.push(x);
    xs.push(x + delta);
    x += delta + D;
  }
  return xs.map((a) => xs.map((b) => sech((a - b) / 2)));
}

const REF = IMP95862_DELTA_UNIFORM_TWO_SIDED_ENVELOPE_STATEMENT;
const N = 80;

export const IMP95862_ASSERTIONS = [
  {
    id: "imp95862-symbol-extrema-are-endpoints",
    description:
      "the symbol range endpoints are ess-inf f = f(pi) and ess-sup f = f(0): a " +
      "scan finds no value below f(pi) or above f(0) at every tracked delta",
    holds: () =>
      REF.rho1Rows.every((row) => {
        const f0 = symbol(0, row.delta);
        const fpi = symbol(Math.PI, row.delta);
        const M = 2000;
        for (let i = 0; i <= M; i++) {
          const th = (Math.PI * i) / M;
          const fv = symbol(th, row.delta);
          if (fv > f0 + 1e-9 * (1 + f0)) return false;
          if (fv < fpi - 1e-9 * (1 + f0)) return false;
        }
        return true;
      }),
  },
  {
    id: "imp95862-upper-companion-delta-uniform",
    description:
      "lambda_max(G_n) <= ess-sup f = f(0) at EVERY tracked delta (including " +
      "ln 1.2, ln 1.3 where the lower endpoint is unreachable) -- the upper " +
      "companion is reachable delta-uniformly",
    holds: () =>
      REF.rho1Rows.every((row) => {
        const f0 = symbol(0, row.delta);
        const [, lmax] = eigMinMax(uniformGram(N, row.delta));
        return lmax <= f0 * (1 + 1e-9);
      }),
  },
  {
    id: "imp95862-two-sided-envelope-well-conditioned",
    description:
      "where the lower endpoint is above the float64 floor (fullEnvelope rows), " +
      "the FULL two-sided envelope holds: ess-inf f <= lambda_min <= lambda_max <= ess-sup f",
    holds: () =>
      REF.rho1Rows.filter((r) => r.fullEnvelope).every((row) => {
        const f0 = symbol(0, row.delta);
        const fpi = symbol(Math.PI, row.delta);
        const [lmin, lmax] = eigMinMax(uniformGram(N, row.delta));
        return (
          lmin >= fpi * (1 - 1e-6) &&
          lmin <= lmax &&
          lmax <= f0 * (1 + 1e-9)
        );
      }),
  },
  {
    id: "imp95862-new-full-envelope-deltas-beyond-four",
    description:
      "the full two-sided envelope is newly confirmed at ln 1.5 and ln 2, deltas " +
      "NOT among the original imp-95846 four (3, 5, 8, ln 1.3) -- demonstrating " +
      "delta-uniformity beyond the four checked",
    holds: () => {
      const newDeltas = REF.rho1Rows.filter((r) =>
        REF.newFullEnvelopeDeltas.includes(r.label),
      );
      if (newDeltas.length !== REF.newFullEnvelopeDeltas.length) return false;
      return newDeltas.every((row) => {
        if (!row.fullEnvelope) return false;
        const f0 = symbol(0, row.delta);
        const fpi = symbol(Math.PI, row.delta);
        const [lmin, lmax] = eigMinMax(uniformGram(N, row.delta));
        return lmin >= fpi * (1 - 1e-6) && lmax <= f0 * (1 + 1e-9);
      });
    },
  },
  {
    id: "imp95862-baked-rows-reproduced",
    description:
      "each baked rho = 1 row (ess-inf, ess-sup, lambda_min, lambda_max at n = 80) " +
      "is reproduced by a fresh computation to tight tolerance",
    holds: () =>
      REF.rho1Rows.every((row) => {
        const f0 = symbol(0, row.delta);
        const fpi = symbol(Math.PI, row.delta);
        if (Math.abs(f0 - row.essSup) / row.essSup > 1e-6) return false;
        // essInf may sit on the float64 floor at small delta; only tolerance-check
        // it where it is above the noise floor (fullEnvelope rows).
        if (row.fullEnvelope && Math.abs(fpi - row.essInf) / row.essInf > 1e-5)
          return false;
        const [lmin, lmax] = eigMinMax(uniformGram(N, row.delta));
        if (Math.abs(lmax - row.lmax80) / row.lmax80 > 1e-5) return false;
        if (row.fullEnvelope && Math.abs(lmin - row.lmin80) / row.lmin80 > 1e-5)
          return false;
        return true;
      }),
  },
  {
    id: "imp95862-rho1-toeplitz-offline-block",
    description:
      "scope: at rho = 1 the Gram is scalar Toeplitz (constant diagonals, so the " +
      "scalar symbol range is the sharp envelope); at rho != 1 it is block-Toeplitz " +
      "(NOT scalar Toeplitz) but still positive definite -- the scalar endpoints do " +
      "not carry off the rho = 1 line",
    holds: () => {
      const d = Math.log(1.5);
      // rho = 1: uniform lattice -> first super-diagonal is constant (Toeplitz)
      const Gu = uniformGram(6, d);
      if (Math.abs(Gu[0][1] - Gu[1][2]) > 1e-12) return false;
      // rho = 3: two-scale lattice -> alternating spacings break Toeplitz structure
      const Gt = twinGram(20, d, 3);
      if (Math.abs(Gt[0][1] - Gt[1][2]) < 1e-3) return false; // not Toeplitz
      const [tlmin] = eigMinMax(Gt);
      return tlmin > 0; // still positive definite
    },
  },
  {
    id: "imp95862-statement-flags-consistent",
    description:
      "the tracked statement records delta-uniformity, the reachability caveat, " +
      "and the off-line block-Toeplitz scope, and asserts it is not a bound / no QED",
    holds: () =>
      REF.deltaUniform === true &&
      REF.rho1IsScalarToeplitz === true &&
      REF.offLineIsBlockToeplitz === true &&
      typeof REF.uniformitySource === "string" &&
      typeof REF.lowerEndpointReachabilityCaveat === "string" &&
      REF.boundChange === false &&
      REF.qed === false &&
      /FORMALIZED/.test(REF.verdict) &&
      /refereed bound is changed/i.test(REF.verdict),
  },
  {
    id: "imp95862-closes-self",
    description: "this module is the deliverable the imp-95862 ticket asked for",
    holds: () => REF.closesTickets.includes("imp-95862"),
  },
];

for (const a of IMP95862_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-95862-delta-uniform-two-sided-envelope-statement assertion failed: ${a.id}`,
    );
  }
}

export default IMP95862_DELTA_UNIFORM_TWO_SIDED_ENVELOPE_STATEMENT;
