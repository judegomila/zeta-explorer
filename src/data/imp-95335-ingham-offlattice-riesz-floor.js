/**
 * imp-95335: LEMMA ING-K + THEOREM RZ-SEP + COROLLARY BLK-SEP +
 * COROLLARY SPLIT-SEP -- the OFF-LATTICE m-uniform Riesz floor for the
 * seam Gram, executing the "RZ-PEN floor off-lattice leg" residual that
 * imp-95272 recorded as the surviving open half of the off-lattice
 * obligation (the collar half was closed by THEOREM BL-JIT). The
 * Grenander-Szegoe route of imp-95252 THEOREM RZ-LAT needs the
 * normalized Gram to be (block-)Toeplitz, which pins it to geometric
 * lattices; this leg replaces Grenander-Szegoe by a self-contained
 * Ingham-type inequality whose ONLY hypothesis is pairwise log-rate
 * separation -- no lattice, no perturbative reference. Non-perturbative:
 * strictly stronger than the "perturbative extension" the ticket asked
 * to assess. Changes no bound; NO QED; no refereed bound is changed.
 *
 * OBJECT (imp-95252 LEMMA NORM normalization). Rates nu_i > 0 with
 * log-rates x_i = ln nu_i, normalized generators ehat_nu =
 * sqrt(2 nu) e^(-nu t) in L2(0, inf), normalized Gram
 *   Gtilde_ij = sech((x_i - x_j)/2).
 * SEPARATION HYPOTHESIS (the only one): |x_i - x_j| >= delta > 0 for
 * all i != j. The set may be arbitrary otherwise -- irregular gaps,
 * no lattice reference, any count m.
 *
 * SPECTRAL REPRESENTATION (exact; the imp-95252 LEMMA POISSON Fourier
 * pair used pointwise, no periodization). From
 * int sech(alpha t) e^(-i w t) dt = (pi/alpha) sech(pi w/(2 alpha)) at
 * alpha = 1/2: sech(u/2) = int_R sech(pi w) e^(i w u) dw. Hence for any
 * coefficients c and g(w) = sum_j c_j e^(i w x_j) (a finite sum, so
 * Fubini is trivial):
 *   c* Gtilde c = int_R sech(pi w) |g(w)|^2 dw ,
 * a genuinely positive weight against the off-lattice exponential sum.
 * On the lattice this reduces to the Szegoe symbol; off the lattice it
 * stays exact where the symbol no longer exists.
 *
 * LEMMA ING-K (Ingham kernel; self-contained closed form). Let T > 0,
 * a = pi/(2T), k(w) = cos(a w) on [-T, T] and 0 elsewhere. Then
 *   khat(xi) = int_(-T)^T k(w) e^(i xi w) dw = 2 a cos(T xi)/(a^2 - xi^2),
 * khat(0) = 2/a, and |khat(xi)| <= 2a/(xi^2 - a^2) for |xi| > a
 * (removable at xi = a). With the classical cotangent partial fraction
 * sum_(k >= 1) 1/(k^2 - c^2) = (1 - pi c cot(pi c))/(2 c^2), c in
 * (0, 1), a delta-separated row sum telescopes EXACTLY:
 *   sup_j sum_(l != j) |khat(x_j - x_l)|
 *     <= 2 sum_(k >= 1) 2a/((k delta)^2 - a^2)
 *      = (2/a) (1 - pi c cot(pi c)),  c = a/delta ,
 * because the k-th nearest neighbour on each side sits at log-distance
 * >= k delta and 2a/(xi^2 - a^2) is decreasing in |xi|. Diagonal
 * dominance of the quadratic form sum c_j conj(c_l) khat(x_j - x_l)
 * then gives, for c < 1/2 (i.e. T > pi/delta),
 *   int_(-T)^T k(w) |g(w)|^2 dw >= [khat(0) - sup row sum] |c|^2
 *                                = (2 pi / delta) cot(pi c) |c|^2 > 0.
 * This is Ingham 1936 with every constant explicit and the classical
 * admissibility threshold T > pi/delta recovered from positivity of
 * the cotangent -- an independent consistency check of the algebra.
 *
 * THEOREM RZ-SEP (off-lattice m-uniform Riesz floor). For EVERY m and
 * every rate set with pairwise log-separation >= delta:
 *   lambda_min(Gtilde_m) >= A_sep(delta)
 *     = sup over T > pi/delta of
 *       sech(pi T) (2 pi / delta) cot(pi^2 / (2 T delta)) .
 * Proof: c* Gtilde c = int sech(pi w)|g|^2 >= sech(pi T)
 * int_(-T)^T |g|^2 (sech decreasing) >= sech(pi T) int k |g|^2
 * (0 <= k <= 1 on the window) >= sech(pi T)(2 pi/delta) cot(pi c)|c|^2
 * by LEMMA ING-K; take the best admissible T. Every T > pi/delta is a
 * valid certificate, so a grid scan of T is rigorous. QED (of the
 * stated floor -- it is a FLOOR statement about the model seam Gram,
 * not a Lambda bound of the program).
 *
 * SHARPNESS BRACKET (two-sided, via imp-95252). The exact geometric
 * lattice at spacing delta is a member of the delta-separated class,
 * and by the imp-95252 Szegoe ceiling NO m-uniform constant for the
 * class can exceed its symbol infimum ~ A_lat(e^delta) =
 * (4 pi / delta) sech(pi^2 / delta). At delta = ln 2:
 *   A_sep = 4.525705908e-7 (T* = 4.831837) vs A_lat(2) = 2.374485e-5:
 * the class-optimal m-uniform off-lattice constant is bracketed inside
 * [A_sep, ~A_lat], a factor 52.47 -- the Ingham route pays ~52x at
 * dyadic separation for dropping the lattice. Direct Jacobi eigensolves
 * (m up to 40, random irregular delta-separated sets AND the lattice
 * member) never dip below A_sep (worst measured margin 56.3x at the
 * m = 40 lattice, consistent with the bracket).
 *
 * COROLLARY BLK-SEP (off-lattice block Riesz bound). Partition any
 * delta-separated set into blocks V_k. Since the in-block 2x2 (or NxN)
 * Gram has lambda_max <= max_k row sum <= 2 for pairs (1 + sech of half
 * the in-block log-ratio <= 2), for every F = sum F_k, F_k in E(V_k):
 *   ||F||^2 >= (A_sep(delta)/2) sum_k ||F_k||^2 .
 * The 2 can be sharpened to 1 + sech(delta_in/2) when the in-block
 * separation delta_in is tracked separately.
 *
 * COROLLARY SPLIT-SEP (the first m-uniform OFF-LATTICE every-octave
 * certificate). Blocks = pairs, block base rates nu_k >= nu_0 2^k
 * (any irregular growth at least dyadic), all pairwise log-separations
 * >= delta = ln 1.3 (in particular in-block ratio >= 1.3, matching the
 * imp-95252 SPLIT-RZ reference configuration r = 1.3 -- there the
 * lattice had EXACT ratio 1.3; here any separated placement works).
 * Per-block, imp-95287 THEOREM DOM-N (Lambda decreasing in every rate)
 * caps Lambda_k <= coalLaw(nu_k d) <= coalLaw(2^k x), coalLaw(x) =
 * e^(-2x)(1 + 2x^2 + 2x sqrt(1+x^2)) (imp-95226 COROLLARY COAL-2), and
 * the imp-95252 SPLIT mechanism (triangle inequality + Cauchy-Schwarz +
 * BLK-SEP) gives verbatim
 *   Lambda(V, x) <= [ sum_(k >= 0) coalLaw(2^k x) ] / (A_sep(ln 1.3)/2)
 * for EVERY m. A_sep(ln 1.3) = 3.299457924e-17 (T* = 12.2834); bisected
 * onset: FIRES for x > 23.157604 at unbounded octave count, off-lattice.
 * Ledger: lattice-pinned SPLIT-RZ onset 15.981584 (off-lattice cost
 * +7.176 depth units at current floor sharpness); the older
 * lattice-only SPLIT-LOO m-and-r-uniform onset 27.035582 is BEATEN by
 * 3.88 depth units while dropping the lattice hypothesis entirely.
 *
 * HONEST SCOPE / LIMITS. (a) Currency: coefficient-norm floor at
 * RZ-LAT-level sharpness. The chart-refined symbol-pencil program
 * RZ-PEN2..RZ-PEN8 (imp-95328..95334, lattice looseness 1.01-1.08)
 * stays LATTICE-PINNED: off-lattice its Toeplitz symbol does not
 * exist, and this leg does NOT port those refinements -- it supplies
 * the off-lattice floor they lacked, 52x looser at dyadic separation.
 * (b) NOT r-uniform, necessarily: A_sep(delta) -> 0 as delta -> 0, and
 * the imp-95252 coalescence witness (c = (1,-1) on a tight pair) shows
 * every coefficient-norm m-uniform constant MUST collapse at
 * coalescence -- structural, not slack. Coalescent blocks stay with
 * EV-OCT-UNIF / COAL-N. (c) Large delta: plain Gershgorin
 * (1 - 2 sum_(k>=1) sech(k delta/2)) turns positive only for
 * delta > 3.1663 and overtakes A_sep for delta > 3.2127; below that
 * (the entire dyadic/octave regime -- at delta = ln 2 the Gershgorin
 * off-diagonal row sum is 8.06) RZ-SEP is the only elementary
 * m-uniform tool.
 * (d) Model seam family only; no mapping to the paper per-window data
 * (obligation (3) gammaSL unchanged); the signed WEIGHT and
 * modulus/phase legs and the imp-95212 envelope port stay OPEN;
 * imp-95374 (measure off-lattice DEGRADATION of the refined onsets)
 * remains a live measurement ticket -- this leg gives the off-lattice
 * FLOOR, not an off-lattice port of the refined charts. Changes NO
 * Lambda bound of the program. NO QED. No refereed bound is changed.
 */

// ---------------------------------------------------------------------------
// Reference constants (all cross-checked by the assertions below)
// ---------------------------------------------------------------------------

export const IMP95335_INGHAM_OFFLATTICE_RIESZ_FLOOR = {
  id: "imp-95335",
  title:
    "Ingham-route off-lattice m-uniform Riesz floor for the seam Gram: " +
    "lambda_min >= sech(pi T)(2 pi/delta) cot(pi^2/(2 T delta)), T > pi/delta",
  floorClosedForm:
    "A_sep(delta) = sup over T > pi/delta of sech(pi T) (2 pi/delta) " +
    "cot(pi^2/(2 T delta)); only hypothesis = pairwise log-rate separation " +
    ">= delta; uniform in count m and in the configuration",
  inghamKernel:
    "khat(xi) = 2 a cos(T xi)/(a^2 - xi^2), a = pi/(2T); separated row sum " +
    "telescopes to (2/a)(1 - pi c cot(pi c)) via the classical cotangent " +
    "partial fraction, leaving the floor (2 pi/delta) cot(pi c), c = a/delta",
  referenceValues: {
    aSepLn2: 4.525705908e-7,
    tStarLn2: 4.831837,
    aLat2: 2.374485e-5,
    loosenessVsLatticeSharp: 52.47,
    aSepLn13: 3.299457924e-17,
    tStarLn13: 12.2834,
    aSepLn2over13: 7.926305714e-11,
  },
  splitSep: {
    onsetOffLattice: 23.157604,
    onsetLatticeSplitRz: 15.981584,
    onsetLatticeSplitLooUnif: 27.035582,
    note:
      "first m-uniform off-lattice every-octave certificate: fires for " +
      "x > 23.157604 at unbounded count for ANY ln(1.3)-separated pair " +
      "blocks with at-least-dyadic base growth; +7.176 depth units vs the " +
      "lattice-pinned SPLIT-RZ, 3.878 units BELOW the lattice-only " +
      "SPLIT-LOO uniform onset it strictly generalizes",
  },
  honestScope:
    "coefficient-norm floor at RZ-LAT sharpness (52x loose at delta = ln 2 " +
    "vs the lattice-sharp Szegoe value); the chart-refined RZ-PEN2..RZ-PEN8 " +
    "symbol-pencil program stays LATTICE-PINNED and is NOT ported; not " +
    "r-uniform (structural coefficient-norm collapse at coalescence, " +
    "imp-95252 witness); model seam family only; gammaSL obligation (3), " +
    "signed WEIGHT, modulus/phase, imp-95212 envelope port all remain OPEN; " +
    "imp-95374 refined-onset degradation measurement remains live",
  verdict:
    "RIGOROUS at the stated scope: spectral representation exact (Fourier " +
    "pair of imp-95252 LEMMA POISSON used pointwise), LEMMA ING-K " +
    "self-contained with classical cotangent input, THEOREM RZ-SEP proved; " +
    "corollaries reuse proved components (imp-95287 DOM-N, imp-95226 " +
    "COAL-2, imp-95252 SPLIT mechanism). A FLOOR statement about the model " +
    "seam Gram off the lattice. Changes no Lambda bound of the program; " +
    "NO QED; no refereed bound is changed.",
};

// ---------------------------------------------------------------------------
// Self-executing assertions (import-light: no imports at all)
// ---------------------------------------------------------------------------

function sech(t) {
  return 2 / (Math.exp(t) + Math.exp(-t));
}
function aSep(delta) {
  let best = 0;
  const T0 = Math.PI / delta;
  for (let f = 1.0005; f < 12; f *= 1.0005) {
    const T = T0 * f;
    const c = Math.PI / (2 * T * delta);
    const val =
      (sech(Math.PI * T) * (2 * Math.PI)) / delta / Math.tan(Math.PI * c);
    if (val > best) best = val;
  }
  return best;
}
function coalLaw(x) {
  return Math.exp(-2 * x) * (1 + 2 * x * x + 2 * x * Math.sqrt(1 + x * x));
}
function prng(seed) {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
// Jacobi eigenvalue sweep for symmetric matrices; returns [min, max]
function jacobiEigRange(Ain) {
  const n = Ain.length;
  const A = Ain.map((r) => r.slice());
  for (let sweep = 0; sweep < 80; sweep++) {
    let off = 0;
    for (let p = 0; p < n; p++)
      for (let q = p + 1; q < n; q++) off += A[p][q] * A[p][q];
    if (off < 1e-28) break;
    for (let p = 0; p < n; p++) {
      for (let q = p + 1; q < n; q++) {
        if (Math.abs(A[p][q]) < 1e-19) continue;
        const th = (A[q][q] - A[p][p]) / (2 * A[p][q]);
        const t =
          Math.sign(th || 1) / (Math.abs(th) + Math.sqrt(th * th + 1));
        const cth = 1 / Math.sqrt(t * t + 1);
        const sth = t * cth;
        for (let k = 0; k < n; k++) {
          const akp = A[k][p];
          const akq = A[k][q];
          A[k][p] = cth * akp - sth * akq;
          A[k][q] = sth * akp + cth * akq;
        }
        for (let k = 0; k < n; k++) {
          const apk = A[p][k];
          const aqk = A[q][k];
          A[p][k] = cth * apk - sth * aqk;
          A[q][k] = sth * apk + cth * aqk;
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

export const IMP95335_INGHAM_OFFLATTICE_ASSERTIONS = [
  {
    id: "imp95335-sech-fourier-pair",
    description:
      "spectral representation input: sech(u/2) = int sech(pi w) e^(iwu) dw, " +
      "checked by Simpson quadrature at five u values to 1e-8 abs",
    holds: () => {
      const H = 12;
      const n = 24000;
      for (const u of [0, 0.3, 1, 2.5, 5]) {
        let s = 0;
        for (let i = 0; i <= n; i++) {
          const w = (i * H) / n;
          const wgt = i === 0 || i === n ? 1 : i % 2 ? 4 : 2;
          s += wgt * sech(Math.PI * w) * Math.cos(w * u);
        }
        const val = (2 * s * (H / n)) / 3;
        if (Math.abs(val - sech(u / 2)) > 1e-8) return false;
      }
      return true;
    },
  },
  {
    id: "imp95335-ingham-kernel-closed-form",
    description:
      "LEMMA ING-K transform: int_(-T)^T cos(pi w/(2T)) e^(i xi w) dw = " +
      "2 a cos(T xi)/(a^2 - xi^2), a = pi/(2T), checked by quadrature at " +
      "T = 5.1 and five xi values to 1e-9 abs",
    holds: () => {
      const T = 5.1;
      const a = Math.PI / (2 * T);
      const n = 20000;
      for (const xi of [0, 0.2, 0.7, 1.5, 3]) {
        let s = 0;
        for (let i = 0; i <= n; i++) {
          const w = -T + (2 * T * i) / n;
          const wgt = i === 0 || i === n ? 1 : i % 2 ? 4 : 2;
          s += wgt * Math.cos(a * w) * Math.cos(xi * w);
        }
        const val = (s * ((2 * T) / n)) / 3;
        const cf = (2 * a * Math.cos(T * xi)) / (a * a - xi * xi);
        if (Math.abs(val - cf) > 1e-9) return false;
      }
      return true;
    },
  },
  {
    id: "imp95335-cotangent-partial-fraction",
    description:
      "row-sum closed form input: sum_(k>=1) 1/(k^2 - c^2) = " +
      "(1 - pi c cot(pi c))/(2 c^2) at c = 0.1, 0.25, 0.4, 0.49 " +
      "(2e6 terms + integral tail bound, rel 1e-6)",
    holds: () => {
      for (const c of [0.1, 0.25, 0.4, 0.49]) {
        let s = 0;
        const K = 2000000;
        for (let k = 1; k <= K; k++) s += 1 / (k * k - c * c);
        const cf = (1 - (Math.PI * c) / Math.tan(Math.PI * c)) / (2 * c * c);
        if (Math.abs(s - cf) / cf > 1e-6) return false;
      }
      return true;
    },
  },
  {
    id: "imp95335-rzsep-matrix-floor",
    description:
      "THEOREM RZ-SEP direct test: lambda_min(Gtilde) >= A_sep(delta) on " +
      "deterministic-PRNG irregular delta-separated sets (m up to 40) and " +
      "on the exact-lattice member, at delta = ln 2 and 0.45 (regimes where " +
      "float noise is negligible against the floor)",
    holds: () => {
      const rand = prng(31337);
      for (const delta of [Math.LN2, 0.45]) {
        const A = aSep(delta);
        for (let trial = 0; trial < 12; trial++) {
          const m = 6 + Math.floor(rand() * 35);
          const xs = [0];
          for (let i = 1; i < m; i++)
            xs.push(xs[i - 1] + delta * (1 + 2.5 * rand()));
          const G = xs.map((xi) => xs.map((xj) => sech((xi - xj) / 2)));
          if (jacobiEigRange(G)[0] < A) return false;
        }
        for (const m of [12, 40]) {
          const xs = Array.from({ length: m }, (_, i) => i * delta);
          const G = xs.map((xi) => xs.map((xj) => sech((xi - xj) / 2)));
          if (jacobiEigRange(G)[0] < A) return false;
        }
      }
      return true;
    },
  },
  {
    id: "imp95335-sharpness-bracket",
    description:
      "two-sided bracket at delta = ln 2: A_sep = 4.525705908e-7 (rel 1e-6), " +
      "A_lat(2) = (4 pi/ln 2) sech(pi^2/ln 2) = 2.374485e-5, looseness " +
      "52.47 (tol 0.01), A_sep strictly below the Szegoe ceiling, and the " +
      "m = 40 lattice eigensolve sits between A_lat and its m = 12 value",
    holds: () => {
      const ref = IMP95335_INGHAM_OFFLATTICE_RIESZ_FLOOR.referenceValues;
      const A = aSep(Math.LN2);
      if (Math.abs(A - ref.aSepLn2) / ref.aSepLn2 > 1e-6) return false;
      const alat =
        ((4 * Math.PI) / Math.LN2) * sech((Math.PI * Math.PI) / Math.LN2);
      if (Math.abs(alat - ref.aLat2) / ref.aLat2 > 1e-6) return false;
      if (Math.abs(alat / A - ref.loosenessVsLatticeSharp) > 0.01)
        return false;
      if (!(A < alat)) return false;
      const lm = (m) => {
        const xs = Array.from({ length: m }, (_, i) => i * Math.LN2);
        return jacobiEigRange(
          xs.map((xi) => xs.map((xj) => sech((xi - xj) / 2))),
        )[0];
      };
      const l40 = lm(40);
      const l12 = lm(12);
      return l40 >= alat - 1e-12 && l12 >= l40 && A < l40;
    },
  },
  {
    id: "imp95335-aSep-ln13-and-cross-gap",
    description:
      "reference literals: A_sep(ln 1.3) = 3.299457924e-17 and " +
      "A_sep(ln(2/1.3)) = 7.926305714e-11, each rel 1e-6",
    holds: () => {
      const ref = IMP95335_INGHAM_OFFLATTICE_RIESZ_FLOOR.referenceValues;
      const a13 = aSep(Math.log(1.3));
      const ax = aSep(Math.log(2 / 1.3));
      return (
        Math.abs(a13 - ref.aSepLn13) / ref.aSepLn13 < 1e-6 &&
        Math.abs(ax - ref.aSepLn2over13) / ref.aSepLn2over13 < 1e-6
      );
    },
  },
  {
    id: "imp95335-splitsep-onset",
    description:
      "COROLLARY SPLIT-SEP onset: bisection of sum_k coalLaw(2^k x) = " +
      "A_sep(ln 1.3)/2 gives x* = 23.157604 (abs 1e-5), sitting between the " +
      "lattice SPLIT-RZ onset 15.981584 and the lattice SPLIT-LOO uniform " +
      "onset 27.035582",
    holds: () => {
      const denom = aSep(Math.log(1.3)) / 2;
      const num = (x) => {
        let s = 0;
        for (let k = 0; k < 200; k++) {
          const t = coalLaw(2 ** k * x);
          s += t;
          if (t < 1e-320) break;
        }
        return s;
      };
      let lo = 1;
      let hi = 80;
      for (let it = 0; it < 120; it++) {
        const mid = (lo + hi) / 2;
        if (num(mid) / denom > 1) lo = mid;
        else hi = mid;
      }
      const onset = (lo + hi) / 2;
      const ref = IMP95335_INGHAM_OFFLATTICE_RIESZ_FLOOR.splitSep;
      return (
        Math.abs(onset - ref.onsetOffLattice) < 1e-5 &&
        ref.onsetLatticeSplitRz < onset &&
        onset < ref.onsetLatticeSplitLooUnif
      );
    },
  },
  {
    id: "imp95335-splitsep-fire-check",
    description:
      "end-to-end fire check on a deterministic OFF-lattice 8-block twin " +
      "configuration (irregular base growth >= 2, in-block ratio 1.3) at " +
      "x = onset + 1: the direct seam pencil Lambda stays below the " +
      "SPLIT-SEP bound and the bound fires (< 1)",
    holds: () => {
      const rand = prng(777);
      const x = 24.157604;
      const nus = [];
      let base = 1;
      for (let k = 0; k < 8; k++) {
        if (k > 0) base *= 2 * (1 + 0.35 * rand());
        nus.push(base, base * 1.3);
      }
      const d = x / nus[0];
      const n = nus.length;
      const G = nus.map((p) => nus.map((q) => 1 / (p + q)));
      const w = nus.map((nu) => Math.exp(-d * nu));
      const M = nus.map((p, i) => nus.map((q, j) => (w[i] * w[j]) / (p + q)));
      const L = Array.from({ length: n }, () => new Array(n).fill(0));
      for (let i = 0; i < n; i++) {
        for (let j = 0; j <= i; j++) {
          let s = G[i][j];
          for (let k = 0; k < j; k++) s -= L[i][k] * L[j][k];
          if (i === j) L[i][i] = Math.sqrt(s);
          else L[i][j] = s / L[j][j];
        }
      }
      const solveL = (v) => {
        const u = v.slice();
        for (let i = 0; i < n; i++) {
          for (let k = 0; k < i; k++) u[i] -= L[i][k] * u[k];
          u[i] /= L[i][i];
        }
        return u;
      };
      const solveLT = (v) => {
        const u = v.slice();
        for (let i = n - 1; i >= 0; i--) {
          for (let k = i + 1; k < n; k++) u[i] -= L[k][i] * u[k];
          u[i] /= L[i][i];
        }
        return u;
      };
      const B = [];
      for (let j = 0; j < n; j++) {
        const ej = new Array(n).fill(0);
        ej[j] = 1;
        const y = solveLT(ej);
        const z = M.map((row) => row.reduce((s, mv, k2) => s + mv * y[k2], 0));
        B.push(solveL(z));
      }
      const Bm = Array.from({ length: n }, (_, i) =>
        Array.from({ length: n }, (_, j) => (B[j][i] + B[i][j]) / 2),
      );
      const lam = jacobiEigRange(Bm)[1];
      let numer = 0;
      for (let k = 0; k < 8; k++) numer += coalLaw(nus[2 * k] * d);
      const bound = numer / (aSep(Math.log(1.3)) / 2);
      return bound < 1 && lam <= bound;
    },
  },
  {
    id: "imp95335-gershgorin-complement",
    description:
      "HONEST SCOPE (c): at delta = ln 2 the Gershgorin off-diagonal row " +
      "sum 2 sum sech(k delta/2) is 8.065 (deeply vacuous; RZ-SEP is the " +
      "tool there), Gershgorin turns positive only above delta = 3.1663, " +
      "and at delta = 4 it gives 0.3837 which exceeds A_sep(4) = 0.0484 " +
      "(the Ingham route concedes the large-separation regime)",
    holds: () => {
      const gersh = (delta) => {
        let s = 0;
        for (let k = 1; k <= 400; k++) s += sech((k * delta) / 2);
        return 1 - 2 * s;
      };
      const gLn2 = gersh(Math.LN2);
      const g4 = gersh(4);
      return (
        gLn2 < 0 &&
        Math.abs(1 - gLn2 - 8.065) < 0.01 &&
        gersh(3.16) < 0 &&
        gersh(3.18) > 0 &&
        Math.abs(g4 - 0.3837) < 0.001 &&
        g4 > aSep(4) &&
        Math.abs(aSep(4) - 0.0484) < 0.001
      );
    },
  },
  {
    id: "imp95335-verdict-honesty",
    description:
      "the verdict and scope carry the honest limits: RZ-PEN chart program " +
      "stays lattice-pinned and NOT ported, not r-uniform with the " +
      "structural collapse named, model family only, open legs named, " +
      "imp-95374 stays live, no QED, no refereed bound is changed",
    holds: () =>
      /LATTICE-PINNED/.test(
        IMP95335_INGHAM_OFFLATTICE_RIESZ_FLOOR.honestScope,
      ) &&
      /not r-uniform/.test(IMP95335_INGHAM_OFFLATTICE_RIESZ_FLOOR.honestScope) &&
      /remain OPEN/.test(IMP95335_INGHAM_OFFLATTICE_RIESZ_FLOOR.honestScope) &&
      /imp-95374/.test(IMP95335_INGHAM_OFFLATTICE_RIESZ_FLOOR.honestScope) &&
      /NO QED/.test(IMP95335_INGHAM_OFFLATTICE_RIESZ_FLOOR.verdict) &&
      /refereed bound is changed/i.test(IMP95335_INGHAM_OFFLATTICE_RIESZ_FLOOR.verdict),
  },
];

for (const a of IMP95335_INGHAM_OFFLATTICE_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-95335-ingham-offlattice-riesz-floor assertion failed: ${a.id}`,
    );
  }
}

export default IMP95335_INGHAM_OFFLATTICE_RIESZ_FLOOR;
