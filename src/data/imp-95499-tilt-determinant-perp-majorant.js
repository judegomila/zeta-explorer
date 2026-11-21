/**
 * imp-95499: THEOREM TILT-DET + COROLLARY PERP-MAJ -- the closed-form
 * coalescence-uniform majorant of the deflated block constant LambdaPerp,
 * executing the named surviving residual of imp-95498 (inherited from
 * imp-95446 (b): "the coalescence-uniform closed-form MAJORANT of
 * LambdaPerp ... is NOT derived here and stays the surviving residual").
 * One elementary two-line device -- an exponential tilt combined with a
 * Cauchy-determinant ratio in which ALL separation factors cancel exactly
 * -- yields a fully closed-form bound with NO separation denominators,
 * NO lattice skeleton, and a log-sum that converges on any geometric
 * lattice: simultaneously coalescence-uniform (valid at exact rate
 * collision), m-uniform (every-octave), r-uniform, and OFF-LATTICE-valid
 * (arbitrary rate sets). Derivation + measurement; changes no bound;
 * NO QED; no refereed bound is changed.
 *
 * OBJECT (imp-95226 / imp-95446 / imp-95498 normalization). Finite rate
 * set P = {p_1, ..., p_K} of positive reals, E_P = span{e^(-p t)} in
 * L2(0, inf), Cauchy Gram G_ij = 1/(p_i + p_j), depth d > 0,
 * Lambda(P, d) = sup over 0 != h in E_P of
 * [int_d^inf h^2] / [int_0^inf h^2]. For blocks V_k deflated against
 * U_k = union of later blocks, LambdaPerp_k = sup of the same ratio over
 * the deflated subspace W_k = B_(U_k) E_(V_k) (imp-95498 THEOREM
 * DEFL-ORTH-N), and W_k is a subspace of E_(V_k u U_k).
 *
 * THEOREM TILT-DET. Let nu = min P and fix any tilt 0 < s < nu. Then
 *   Lambda(P, d) <= e^(-2 s d) * D(P, s),
 *   D(P, s) = prod over ALL ordered pairs (i, j) of
 *             (p_i + p_j) / (p_i + p_j - 2 s),
 * and hence Lambda(P, d) <= min(1, inf over 0 < s < nu of the right side).
 * Proof. (1) TILT: 1_(t >= d) <= e^(2 s (t - d)) pointwise on (0, inf)
 * (for t >= d the exponent is >= 0; for t < d the left side is 0), so
 * int_d^inf h^2 <= e^(-2 s d) int_0^inf e^(2 s t) h(t)^2 dt. (2) The
 * tilted energy is the quadratic form of the TILTED Cauchy Gram
 * G'_ij = 1/(p_i + p_j - 2 s) (finite since p_i + p_j > 2 s; it is the
 * Gram of the shifted rates p_i - s > 0, hence positive definite).
 * (3) e^(2 s t) >= 1 pointwise gives a^T G' a >= a^T G a for every
 * coefficient vector a, so EVERY generalized eigenvalue of the pencil
 * (G', G) is >= 1; therefore lambda_max(G', G) <= product of all
 * generalized eigenvalues = det G' / det G. (4) CAUCHY DETERMINANT:
 * det[1/(x_i + x_j)] = prod_(i<j) (x_i - x_j)^2 / prod_(i,j) (x_i + x_j).
 * Applying it to x = P (for G) and x = P - s (for G'), the difference
 * factors prod_(i<j) (p_i - p_j)^2 are IDENTICAL in numerator and
 * denominator and cancel exactly, leaving det G' / det G = D(P, s). QED.
 * COALESCENCE-UNIFORM: D contains no p_i - p_j factor; the final
 * inequality has no singular quantity, so it extends to confluent
 * (repeated-rate) spans -- span{t^j e^(-p t)} -- by L2 continuity, since
 * confluent spans are L2 limits of distinct-rate spans and D is
 * continuous there. m-UNIFORM: on a geometric lattice log D(P, s) <=
 * sum_(i,j) 2s/(p_i + p_j - 2s), and the double sum converges as the
 * octave count grows (terms decay like 2^(-max octave)), so D stays
 * bounded as m -> inf. OFF-LATTICE: P is an arbitrary finite set -- no
 * grid structure is used anywhere.
 *
 * COROLLARY PERP-MAJ (the imp-95498 residual). Every deflated block
 * constant obeys, for every 0 < s < min(V_k u U_k),
 *   LambdaPerp_k <= Lambda(V_k u U_k, d) <= e^(-2 s d) D(V_k u U_k, s),
 * because W_k is a subspace of E_(V_k u U_k) (imp-95446 LEMMA DEFL-ORTH).
 * Combined with imp-95498 THEOREM SPLIT-DEFL-N this closes the
 * every-octave chain in fully closed form:
 * Lambda(union, d) <= sum_k min(1, e^(-2 s_k d) D(V_k u U_k, s_k)),
 * with block-wise tilts s_k < min V_k growing geometrically under the
 * ascending ordering, so the sum converges m-uniformly.
 *
 * SHARPNESS ENVELOPE (K = 1). For a single rate p and x = p d, the
 * optimal tilt s = p - 1/(2d) gives e^(-2 s d) p/(p - s) = 2 e x e^(-2x)
 * vs the exact Lambda = e^(-2x): looseness factor exactly 2 e x, linear
 * in x. MEASURED: at x = 6 the grid-optimized bound/exact ratio is
 * 32.6194 = 2 e * 6 to 6 digits -- the optimizer attains the analytic
 * envelope.
 *
 * MEASURED (cross-checks of the proven statements, never the claim).
 *  (A) IDENTITY: det G'/det G vs the product formula agree to rel 4e-14
 *      (K = 4); generalized eigenvalues of (G', G) all >= 1 with product
 *      equal to D to rel 4e-10 (K = 5, near-coalescent pair included).
 *  (B) DOMINATION: min(1, bound) >= exact joint pencil on the full grid
 *      r in {1.5, 1.1, 1.01}, m in {1,2,3}, d in {0.5,1,2,4,8,16}. At
 *      r = 1.0001 the FLOAT exact solver overshoots the proven cap
 *      Lambda <= 1 (computes 1.000078 > 1) -- solver breakdown flagged by
 *      the cap, exactly the imp-95498 self-detection mode; the bound
 *      dominates min(exact, 1) there.
 *  (C) PERP-MAJ: LambdaPerp_k <= tilt bound for every block of the m = 4
 *      dyadic twin lattice at d in {1,2,4,8}; max ratio perp/bound =
 *      0.9978 (block 0, d = 1) -- the majorant is near-ATTAINED, not
 *      vacuously loose.
 *  (D) EVERY-OCTAVE ONSETS (dyadic twins r = 1.1, optimized tilt):
 *      x* = 5.4033 / 14.9752 / 15.4776 at m = 2 / 8 / 16, converging in
 *      m (m24 = 15.4814 in the scratch run); fully COALESCED twins
 *      (r = 1, doubled rates, m = 8): x* = 15.7015 -- finite at exact
 *      collision, where every separation-dependent certificate is
 *      undefined.
 *  (E) CURRENCY PLACEMENT: the m-and-r-and-coalescence-uniform onset
 *      15.48 (m = 16) sits BELOW the SPLIT-LOO/EV-OCT closed-form
 *      unbounded-m onset 27.035582 (imp-95250) and ABOVE the RZ-PEN
 *      lattice-chain onsets ~13.0-13.3 (imp-95330): TILT-DET does NOT
 *      supersede RZ-PEN on the lattice; it is the first certificate in
 *      the closed-form currency that needs no lattice at all.
 *  (F) OFF-LATTICE: deterministic-jitter rates (octave jitter up to
 *      delta = 0.3, m = 8, min-rate normalized) fire at x* = 14.4191 --
 *      the certificate is jitter-robust with no re-derivation, touching
 *      the live off-lattice residual (imp-95430/imp-95445 measured the
 *      crossing thresholds of the LATTICE certificates; TILT-DET has no
 *      crossing threshold to crossing).
 *
 * SKEPTICAL SELF-CHECK RECORD. (1) Attempted refutation of step (3)
 * via a pencil eigenvalue below 1: none exists (proven; verified to
 * eigenvalue 1.1154 minimum on a near-coalescent K = 5 config). (2)
 * Attempted refutation of domination at near-coalescence: the only
 * "violations" found were float exact-solver values ABOVE the proven cap
 * Lambda <= 1 (impossible for the true constant) -- breakdown of the
 * comparison solver, not of the bound. (3) The naive alternative split
 * B_U = 1 + (B_U - 1) FAILS coalescence-uniformity (raw partial-fraction
 * coefficients blow up); this is why the determinant route, which never
 * expands in the pole basis, is the one that works. (4) Looseness is
 * REAL and quantified: 2 e x at K = 1, and the product-of-eigenvalues
 * step (lambda_max <= det ratio) pays the whole spectrum -- on-lattice
 * RZ-PEN stays tighter (see (E)); TILT-DET buys generality, not lattice
 * sharpness.
 *
 * HONEST LIMITS. (a) The majorant bounds LambdaPerp_k THROUGH the
 * ambient Lambda(V_k u U_k): it does not use the deflation
 * constraint (the zero conditions at U), so the deflation GAIN measured
 * by imp-95498 (onset 3.56 exact-ingredient) is NOT captured; the
 * re-scoped residual is a closed-form majorant strictly below
 * Lambda(V_k u U_k) that sees the zeros at U. (b) lambda_max <= product
 * of ALL generalized eigenvalues is the crude step; any closed-form
 * lower bound on the sub-leading eigenvalues would divide it out.
 * (c) The optimal tilt s solves sum_(i,j) 1/(p_i + p_j - 2s) = d
 * (scalar, monotone -- but not closed-form); the theorem holds for EVERY
 * admissible s, and baked literals use a deterministic grid+refine
 * optimizer. (d) Model family only (exponential spans, Cauchy Gram); no
 * mapping to paper per-window data; changes NO Lambda bound of the
 * program. (e) Onset literals are 60-step bisections of float
 * evaluations; asserted with 5e-3 absolute tolerances.
 *
 * ROUTING. Executes the imp-95498 surviving residual (a) = imp-95446
 * residual (b): the closed-form coalescence-uniform LambdaPerp majorant
 * now EXISTS, so the closed-form uniform currency no longer routes
 * exclusively through EV-OCT/RZ-PEN -- for OFF-LATTICE or
 * coalescence-complete uniformity TILT-DET is the only closed form; ON
 * the lattice RZ-PEN keeps the sharper onset (~13.0-13.3 vs 15.48) and
 * is NOT retired. Successor targets: (i) a deflation-aware sharpening
 * (HONEST LIMITS (a)); (ii) dividing out sub-leading pencil eigenvalues
 * (HONEST LIMITS (b)); (iii) porting the tilt-determinant device to the
 * RZ-PEN block-symbol floor, where the same Cauchy cancellation may
 * remove the residual chart machinery.
 *
 * Import-light (no imports, no zeros bundle). Numerics are CROSS-CHECKS
 * of proven statements, never the claim itself.
 */

// ---------------------------------------------------------------------------
// Reference record
// ---------------------------------------------------------------------------

export const IMP95499_TILT_DETERMINANT_PERP_MAJORANT = {
  id: "imp-95499",
  title:
    "THEOREM TILT-DET + COROLLARY PERP-MAJ: exponential-tilt Cauchy-" +
    "determinant majorant Lambda(P,d) <= e^(-2sd) prod_(i,j) (p_i+p_j)/" +
    "(p_i+p_j-2s) -- closed-form, coalescence-uniform, m-uniform, " +
    "off-lattice; delivers the imp-95498/imp-95446 LambdaPerp residual",
  tiltDet:
    "for any finite rate set P, depth d, tilt 0 < s < min P: " +
    "Lambda(P, d) <= e^(-2 s d) D(P, s), D = det ratio of tilted vs plain " +
    "Cauchy Gram = prod over ordered pairs (p_i+p_j)/(p_i+p_j-2s); the " +
    "Cauchy-determinant difference factors cancel exactly, so D carries " +
    "NO separation denominator and extends to confluent spans by L2 limit",
  perpMaj:
    "LambdaPerp_k <= Lambda(V_k u U_k, d) <= e^(-2 s d) D(V_k u U_k, s) " +
    "for every admissible s: the closed-form coalescence-uniform majorant " +
    "of the imp-95498 deflated block constant; with SPLIT-DEFL-N it gives " +
    "a fully closed-form m-uniform every-octave certificate",
  sharpnessEnvelope: {
    claim:
      "K = 1 optimal tilt s = p - 1/(2d) gives exactly 2 e x e^(-2x) vs " +
      "exact e^(-2x): looseness 2 e x, attained by the grid optimizer",
    x6Ratio: 32.61938194150854,
    twoEx: 32.61938194150854,
  },
  everyOctave: {
    onsetByM_r1p1: {
      m2: 5.403278227280734,
      m8: 14.97518105718408,
      m16: 15.477587472768666,
    },
    coalescedTwinsM8: 15.701490224721047,
    offLatticeJitter0p3M8: 14.419092144826815,
    splitLooEvOctClosedFormOnset: 27.035582,
    rzPenLatticeOnsetBand: [13.0, 13.3],
    placement:
      "below SPLIT-LOO/EV-OCT closed form (27.04), above RZ-PEN lattice " +
      "chain (~13.0-13.3): buys off-lattice + exact-coalescence " +
      "uniformity, not lattice sharpness",
  },
  perpTightness: {
    config: "m = 4 dyadic twin lattice r = 1.1, d in {1,2,4,8}",
    maxPerpOverBound: 0.9978377963636105,
    note: "majorant near-attained at block 0, d = 1",
  },
  residualExecuted:
    "imp-95498 residual (a) = imp-95446 residual (b): closed-form " +
    "coalescence-uniform LambdaPerp majorant",
  rescopedResidual:
    "a closed-form majorant STRICTLY BELOW Lambda(V_k u U_k) that " +
    "uses the deflation zeros at U (captures the imp-95498 deflation " +
    "gain); dividing out sub-leading pencil eigenvalues; porting the " +
    "tilt-determinant device to the RZ-PEN block-symbol floor",
  honestScope:
    "derivation + measurement; model family only; bound is loose by " +
    "2 e x at K = 1 and does not supersede RZ-PEN on the lattice; " +
    "changes no bound; NO QED; no refereed bound is changed",
  verdict:
    "DERIVATION + MEASUREMENT: THEOREM TILT-DET -- exponential tilt plus " +
    "exact Cauchy-determinant cancellation gives Lambda(P, d) <= " +
    "e^(-2 s d) prod_(i,j) (p_i+p_j)/(p_i+p_j-2s), a closed-form majorant " +
    "with no separation denominators, valid at exact rate collision, " +
    "m-uniform on geometric lattices, and off-lattice. COROLLARY PERP-MAJ " +
    "delivers the imp-95498/imp-95446 named residual: the first " +
    "closed-form coalescence-uniform majorant of the deflated LambdaPerp. " +
    "Every-octave closed-form onset 15.48 (m = 16, r = 1.1) vs SPLIT-LOO/" +
    "EV-OCT 27.04 and RZ-PEN ~13.0-13.3: RZ-PEN keeps the lattice, " +
    "TILT-DET takes everything the lattice chains cannot reach. Changes " +
    "no bound; NO QED; no refereed bound is changed.",
};

// ---------------------------------------------------------------------------
// Self-contained numeric machinery (import-light; mirrors imp-95498)
// ---------------------------------------------------------------------------

function cauchyGram(nus) {
  return nus.map((a) => nus.map((b) => 1 / (a + b)));
}
function transpose(A) {
  return A[0].map((_, j) => A.map((row) => row[j]));
}
function chol(B) {
  const n = B.length;
  const L = Array.from({ length: n }, () => new Array(n).fill(0));
  for (let i = 0; i < n; i++) {
    for (let j = 0; j <= i; j++) {
      let s = B[i][j];
      for (let k = 0; k < j; k++) s -= L[i][k] * L[j][k];
      if (i === j) {
        if (s <= 0) throw new Error("imp-95499 chol: pencil base not PD");
        L[i][i] = Math.sqrt(s);
      } else L[i][j] = s / L[j][j];
    }
  }
  return L;
}
function fwd(L, b) {
  const n = L.length;
  const x = b.slice();
  for (let i = 0; i < n; i++) {
    for (let k = 0; k < i; k++) x[i] -= L[i][k] * x[k];
    x[i] /= L[i][i];
  }
  return x;
}
function jacobiEig(Ain) {
  const n = Ain.length;
  const A = Ain.map((r) => r.slice());
  for (let sweep = 0; sweep < 300; sweep++) {
    let off = 0;
    for (let p = 0; p < n; p++)
      for (let q = p + 1; q < n; q++) off += A[p][q] * A[p][q];
    if (off < 1e-30) break;
    for (let p = 0; p < n; p++)
      for (let q = p + 1; q < n; q++) {
        if (Math.abs(A[p][q]) < 1e-300) continue;
        const th = (A[q][q] - A[p][p]) / (2 * A[p][q]);
        const t = Math.sign(th || 1) / (Math.abs(th) + Math.sqrt(th * th + 1));
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
  return A.map((r, i) => r[i]).sort((a, b) => a - b);
}
function pencilEig(A, B) {
  const L = chol(B);
  const n = A.length;
  const Y = Array.from({ length: n }, () => new Array(n).fill(0));
  for (let j = 0; j < n; j++) {
    const y = fwd(
      L,
      A.map((r) => r[j]),
    );
    for (let i = 0; i < n; i++) Y[i][j] = y[i];
  }
  const Yt = transpose(Y);
  const Ct = Array.from({ length: n }, () => new Array(n).fill(0));
  for (let j = 0; j < n; j++) {
    const y = fwd(
      L,
      Yt.map((r) => r[j]),
    );
    for (let i = 0; i < n; i++) Ct[i][j] = y[i];
  }
  return jacobiEig(transpose(Ct));
}
const lamExact = (nus, d) => {
  const G = cauchyGram(nus);
  const DGD = G.map((row, i) =>
    row.map((g, j) => g * Math.exp(-d * (nus[i] + nus[j]))),
  );
  const ev = pencilEig(DGD, G);
  return ev[ev.length - 1];
};
function detLU(Ain) {
  const n = Ain.length;
  const A = Ain.map((r) => r.slice());
  let s = 1;
  for (let k = 0; k < n; k++) {
    let piv = k;
    for (let i = k + 1; i < n; i++)
      if (Math.abs(A[i][k]) > Math.abs(A[piv][k])) piv = i;
    if (piv !== k) {
      const tmp = A[k];
      A[k] = A[piv];
      A[piv] = tmp;
      s = -s;
    }
    if (A[k][k] === 0) return 0;
    for (let i = k + 1; i < n; i++) {
      const f = A[i][k] / A[k][k];
      for (let j = k; j < n; j++) A[i][j] -= f * A[k][j];
    }
    s *= A[k][k];
  }
  return s;
}
// THEOREM TILT-DET closed form: log D(P, s)
const logD = (P, s) => {
  let acc = 0;
  for (const a of P) for (const b of P) acc += Math.log((a + b) / (a + b - 2 * s));
  return acc;
};
const tiltBound = (P, s, d) => Math.exp(-2 * s * d + logD(P, s));
// deterministic grid + refine optimizer over the admissible tilt (0, min P)
function tiltBoundOpt(P, d) {
  const nu = Math.min(...P);
  let best = Infinity;
  let bestS = 0;
  for (let i = 1; i <= 400; i++) {
    const s = (nu * i) / 401;
    const v = tiltBound(P, s, d);
    if (v < best) {
      best = v;
      bestS = s;
    }
  }
  for (let it = 0; it < 50; it++) {
    const step = nu * 0.0025 * Math.pow(0.85, it);
    for (const s of [bestS - step, bestS + step]) {
      if (s <= 0 || s >= nu) continue;
      const v = tiltBound(P, s, d);
      if (v < best) {
        best = v;
        bestS = s;
      }
    }
  }
  return Math.min(1, best);
}
// imp-95498 deflated-pencil machinery (for the PERP-MAJ cross-check)
const blaschkeAt = (U, nu) => U.reduce((p, m) => (p * (nu - m)) / (nu + m), 1);
const residueAt = (U, m) =>
  -2 *
  U[m] *
  U.reduce((p, x, l) => (l === m ? p : (p * (U[m] + x)) / (U[m] - x)), 1);
function deflCoeffs(nuI, U) {
  const c = new Map();
  c.set(nuI, 1 / blaschkeAt(U, nuI));
  for (let m = 0; m < U.length; m++) c.set(U[m], residueAt(U, m) / (nuI - U[m]));
  return c;
}
function innerTail(c1, c2, d) {
  let s = 0;
  for (const [p, cp] of c1)
    for (const [q, cq] of c2) s += (cp * cq * Math.exp(-d * (p + q))) / (p + q);
  return s;
}
function lamPerp(V, U, d) {
  if (U.length === 0) return lamExact(V, d);
  const coeffs = V.map((nu) => deflCoeffs(nu, U));
  const n = V.length;
  const T = Array.from({ length: n }, () => new Array(n).fill(0));
  for (let i = 0; i < n; i++)
    for (let j = 0; j < n; j++) T[i][j] = innerTail(coeffs[i], coeffs[j], d);
  const ev = pencilEig(T, cauchyGram(V));
  return ev[ev.length - 1];
}
const twinLattice = (m, r = 1.1) => {
  const blocks = [];
  for (let k = 0; k < m; k++) blocks.push([2 ** k, r * 2 ** k]);
  return blocks;
};
function onset(fn, lo = 0.01, hi = 80) {
  for (let i = 0; i < 60; i++) {
    const mid = (lo + hi) / 2;
    if (fn(mid) < 1) hi = mid;
    else lo = mid;
  }
  return (lo + hi) / 2;
}

// ---------------------------------------------------------------------------
// Self-executing assertions
// ---------------------------------------------------------------------------

export const IMP95499_ASSERTIONS = [
  {
    id: "imp95499-cauchy-det-ratio-identity",
    description:
      "step (4) of THEOREM TILT-DET at the matrix level: det G'/det G " +
      "equals the separation-free product prod (p_i+p_j)/(p_i+p_j-2s) to " +
      "rel 1e-10 (K = 4), and the generalized eigenvalues of (G', G) are " +
      "all >= 1 with product equal to D to rel 1e-6 (K = 5, " +
      "near-coalescent pair included)",
    holds: () => {
      const P4 = [1, 1.3, 2.7, 5.2];
      const s4 = 0.55;
      const G = cauchyGram(P4);
      const Gp = P4.map((a) => P4.map((b) => 1 / (a + b - 2 * s4)));
      const direct = Math.log(detLU(Gp) / detLU(G));
      if (Math.abs(direct - logD(P4, s4)) > 1e-10 * Math.abs(direct))
        return false;
      const P5 = [1, 1.05, 2, 2.1, 4.4];
      const s5 = 0.7;
      const ev = pencilEig(
        P5.map((a) => P5.map((b) => 1 / (a + b - 2 * s5))),
        cauchyGram(P5),
      );
      if (!ev.every((l) => l >= 1 - 1e-9)) return false;
      const prod = ev.reduce((a, b) => a * b, 1);
      return Math.abs(prod - Math.exp(logD(P5, s5))) < 1e-6 * prod;
    },
  },
  {
    id: "imp95499-dominates-exact-grid",
    description:
      "min(1, tilt bound) >= exact joint pencil (clipped at the proven " +
      "cap 1, which the float solver can overshoot at near-coalescence) " +
      "on the grid r in {1.5, 1.1, 1.01, 1.0001}, m in {1,2,3}, d in " +
      "{0.5,1,2,4,8,16}",
    holds: () => {
      for (const r of [1.5, 1.1, 1.01, 1.0001])
        for (const m of [1, 2, 3]) {
          const P = twinLattice(m, r).flat();
          for (const d of [0.5, 1, 2, 4, 8, 16]) {
            const ex = Math.min(1, lamExact(P, d));
            if (tiltBoundOpt(P, d) < ex * (1 - 1e-9)) return false;
          }
        }
      return true;
    },
  },
  {
    id: "imp95499-perp-majorant-delivery",
    description:
      "COROLLARY PERP-MAJ (the imp-95498 residual): every deflated block " +
      "constant LambdaPerp_k of the m = 4 dyadic twin lattice (r = 1.1) " +
      "at d in {1,2,4,8} is <= the closed-form tilt bound of its ambient " +
      "rate set, and the majorant is near-attained (max perp/bound = " +
      "0.9978 within 5e-3)",
    holds: () => {
      const blocks = twinLattice(4, 1.1);
      let maxRatio = 0;
      for (const d of [1, 2, 4, 8])
        for (let k = 0; k < blocks.length; k++) {
          const U = blocks.slice(k + 1).flat();
          const lp = lamPerp(blocks[k], U, d);
          const b = tiltBoundOpt([...blocks[k], ...U], d);
          if (lp > b * (1 + 1e-9)) return false;
          maxRatio = Math.max(maxRatio, lp / b);
        }
      return Math.abs(maxRatio - 0.9978377963636105) < 5e-3;
    },
  },
  {
    id: "imp95499-every-octave-onsets-m-uniform",
    description:
      "closed-form every-octave onsets (dyadic twins r = 1.1, optimized " +
      "tilt): 5.4033 / 14.9752 / 15.4776 at m = 2 / 8 / 16 (abs 5e-3), " +
      "m-converging (m16 - m8 < 0.6), below the SPLIT-LOO/EV-OCT " +
      "closed-form unbounded-m onset 27.035582",
    holds: () => {
      const x2 = onset((d) => tiltBoundOpt(twinLattice(2).flat(), d));
      const x8 = onset((d) => tiltBoundOpt(twinLattice(8).flat(), d));
      const x16 = onset((d) => tiltBoundOpt(twinLattice(16).flat(), d));
      return (
        Math.abs(x2 - 5.403278227280734) < 5e-3 &&
        Math.abs(x8 - 14.97518105718408) < 5e-3 &&
        Math.abs(x16 - 15.477587472768666) < 5e-3 &&
        x16 > x8 &&
        x16 - x8 < 0.6 &&
        x16 < 27.035582
      );
    },
  },
  {
    id: "imp95499-coalescence-and-offlattice",
    description:
      "coalescence-uniformity and off-lattice validity: fully coalesced " +
      "twins (r = 1, doubled rates, m = 8) fire at x* = 15.7015 (finite " +
      "at exact collision), and the deterministic-jitter off-lattice " +
      "config (delta = 0.3, m = 8, min-rate normalized) fires at " +
      "x* = 14.4191 (both abs 5e-3)",
    holds: () => {
      const Pc = [];
      for (let k = 0; k < 8; k++) Pc.push(2 ** k, 2 ** k);
      const xc = onset((d) => tiltBoundOpt(Pc, d));
      let seed = 12345;
      const rnd = () => {
        seed = (seed * 1103515245 + 12345) & 0x7fffffff;
        return seed / 0x7fffffff;
      };
      const P = [];
      for (let k = 0; k < 8; k++) {
        const j1 = Math.pow(2, (rnd() * 2 - 1) * 0.3);
        const j2 = Math.pow(2, (rnd() * 2 - 1) * 0.3);
        P.push(2 ** k * j1, 1.1 * 2 ** k * j2);
      }
      const nuMin = Math.min(...P);
      const Pn = P.map((p) => p / nuMin);
      const xj = onset((d) => tiltBoundOpt(Pn, d));
      return (
        Math.abs(xc - 15.701490224721047) < 5e-3 &&
        Math.abs(xj - 14.419092144826815) < 5e-3
      );
    },
  },
  {
    id: "imp95499-k1-sharpness-envelope",
    description:
      "K = 1 looseness envelope: at x = 6 the optimized bound/exact ratio " +
      "equals 2 e x = 32.6194 (rel 1e-4) -- the grid optimizer attains " +
      "the analytic envelope s = p - 1/(2d)",
    holds: () => {
      const ratio = tiltBoundOpt([1], 6) / Math.exp(-12);
      const twoEx = 2 * Math.E * 6;
      return Math.abs(ratio - twoEx) < 1e-4 * twoEx;
    },
  },
  {
    id: "imp95499-verdict-honesty",
    description:
      "verdict and scope carry the honest labels: DERIVATION + " +
      "MEASUREMENT, delivers the named residual, does not supersede " +
      "RZ-PEN on the lattice, no bound change, NO QED, no refereed bound is changed",
    holds: () =>
      /DERIVATION \+ MEASUREMENT/.test(
        IMP95499_TILT_DETERMINANT_PERP_MAJORANT.verdict,
      ) &&
      /named residual/.test(IMP95499_TILT_DETERMINANT_PERP_MAJORANT.verdict) &&
      /RZ-PEN keeps the lattice/.test(
        IMP95499_TILT_DETERMINANT_PERP_MAJORANT.verdict,
      ) &&
      /Changes no bound/.test(IMP95499_TILT_DETERMINANT_PERP_MAJORANT.verdict) &&
      /NO QED/.test(IMP95499_TILT_DETERMINANT_PERP_MAJORANT.verdict) &&
      /refereed bound is changed/i.test(IMP95499_TILT_DETERMINANT_PERP_MAJORANT.verdict),
  },
];

for (const a of IMP95499_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-95499-tilt-determinant-perp-majorant assertion failed: ${a.id}`,
    );
  }
}

export default IMP95499_TILT_DETERMINANT_PERP_MAJORANT;
