/**
 * imp-95133: SCOPING ASSESSMENT of a signed WEIGHT-priced seam certificate
 * (weight W in place of distinct-rate count N) -- the surviving currency
 * leg named OPEN by imp-95225 obligation ledger (2) after the COUNT leg
 * (THEOREM SGN-C) and its NP-terminal identification (imp-95226 THEOREM
 * SGN-NP) closed the count route. This module SCOPES the candidate signed
 * cross-octave compositions and records, with converged double-precision
 * probes, WHICH fail and WHY. It DERIVES NO BOUND: per the ticket, no
 * certificate is claimed; the sub-gap imp-95212-subgap-fresnel-airy
 * -envelope-port stays OPEN.
 *
 * OBJECT (imp-95226 exact). On distinct rates nu_1 < ... < nu_N > 0 at
 * depth d > 0, with Cauchy Gram G_ij = 1/(nu_i + nu_j) and D = diag(w_i),
 * w_i = e^(-d nu_i), the signed shift constant is EXACTLY
 *   Lambda(nu, d) = lambda_max of the symmetric pencil (D G D, G)
 *                 = min over H-inf(C+) interpolants g of ||g||_inf^2 ,
 * g(nu_i) = w_i (THEOREM SGN-NP; the interpolant route is TERMINAL, and
 * the Nevanlinna-Pick matrix IS the seam pencil). Lambda sups over ALL
 * signs -- it is the signed worst case; the positive-cone chain (imp-95222
 * FA-2: R <= (1/2) e^(-y_min), count-free) bounds a strictly smaller
 * quantity (R for NONNEGATIVE amplitudes), which is why the positive-cone
 * devices do not price Lambda.
 *
 * THE WEIGHT-PRICING TARGET. Group the rates into dyadic octaves
 * [2^j m, 2^(j+1) m) with occupancy M_j; the octave-Szasz weight is
 *   W = sum_j M_j 2^(-j) ,
 * which can be much smaller than N = sum_j M_j when occupancy sits in high
 * octaves (imp-95219 H-SZW). A weight-priced signed certificate would bound
 * Lambda through W (and the global depth-rate x = m d) rather than N. The
 * count leg does NOT: THEOREM SGN-C prices by N and goes VACUOUS once
 * N >= 1 + 1.4427 x, wasting the octave depth structure entirely.
 *
 * MOTIVATION (headroom is large, measured). For the octave-SPREAD family
 * with one rate per octave (rates 1.5, 3, 6 at m = 1, d = 6; N = 3,
 * x = 6, W = 1.75), the count-priced bound B(3, 6)^2 = 0.253746561 over
 * -prices the TRUE constant Lambda = 3.80599150e-7 by a factor
 * ~666000 (true/count = 1.4999e-6). The count bound has no knowledge of
 * the octave-depth ladder; a weight-priced bound could in principle
 * recover it -- so the leg is well-motivated, not idle.
 *
 * CANDIDATE WP-A (naive per-octave-in-isolation multiplicative composition;
 * the direct positive-cone TVC port). Price each octave j by its OWN
 * constant Lam_j = Lambda(octave-j rates, d) in isolation and compose
 *   sqrt(Lambda_union) <=? prod_j (1 + sqrt(Lam_j)) - 1 .
 * REFUTED: it UNDERSHOOTS. Already at one rate per octave (Lam_j EXACT =
 * e^(-2 nu_j d), no within-octave coalescence), the union constant EXCEEDS
 * the isolated product: sqrt(Lambda_union) = 6.16927184e-4 against the
 * naive product 1.23425036e-4, a ratio ~4.998 > 1, so the isolated
 * composition is NOT an upper bound. MECHANISM: the Cauchy / Szego kernel
 * 1/(nu_i + nu_j) is LONG-RANGE, so octave blocks are strongly coupled;
 * dropping the cross-block Gram entries loses positive mass in the
 * denominator quadratic form and inflates the true Lambda beyond any
 * isolated-block product. This is the precise sense in which the imp-95218
 * TVC composition is positive-cone: for NONNEGATIVE amplitudes the seam
 * ratio R factorizes across disjoint rate blocks; the signed OPERATOR
 * constant Lambda does not.
 *
 * CANDIDATE WP-B (coupling-aware H-inf multiplicative composition, off
 * -octave normalization). Build g = prod_j g_j where g_j is the bounded
 * interpolant with g_j(nu_i) = w_i for nu_i in octave j and g_j(nu_i) = 1
 * at every OTHER octave. Then g interpolates the full data, so by the
 * NP-CERT product law (||prod g_j||_inf <= prod ||g_j||_inf)
 *   Lambda_union <= (prod_j ||g_j||_inf)^2 -- a VALID upper bound.
 * Here ||g_j||_inf^2 = lambda_max of the pencil (T_j G T_j, G) with target
 * diagonal T_j (w_i on octave j, 1 elsewhere). VALID BUT VACUOUS: for two
 * rates per octave over three octaves (rates 1.25, 1.75 / 2.5, 3.5 / 5, 7,
 * d = 6; N = 6) the product 7.59415852e6 dominates the true
 * sqrt(Lambda_union) = 4.10386029e-2 as it must, but is loose by a factor
 * ~1.85e8; the per-octave factors ||g_j||_inf blow up to 265.6 / 107.7 /
 * 265.6, each far above 1. MECHANISM: the pin-to-1 normalization forces
 * each factor to swing between O(1) at the far nodes and the exponentially
 * small value w_i on its own octave, and that swing costs an
 * O(condition-number) sup-norm. The composition is sound; the
 * normalization choice is what destroys the weight discount.
 *
 * SURVIVING OPEN FREEDOM (the named residual, NOT closed here). The
 * product law Lambda_union <= (prod_j ||g_j||_inf)^2 is valid for ANY data
 * split g_j(nu_i) = w_i^(alpha_ji) with sum_j alpha_ji = 1 for every node
 * i; WP-B is the degenerate split alpha_ji = 1 on octave j, 0 elsewhere. A
 * weight-priced certificate would TAPER alpha across octaves so each factor
 * stays O(1) and its sup-norm is discounted by the octave weight 2^(-j)
 * (deep octaves carry data w_i = e^(-2^j x) that is exponentially small, so
 * a bounded factor need barely move there). No admissible split with a
 * per-factor sup-norm bounded in terms of the octave weight M_j 2^(-j)
 * (rather than the count M_j) is currently known -- that missing lemma IS
 * the "new signed cross-octave composition" the ledger names. Equivalently
 * in the pencil picture: a block-Schur estimate of lambda_max(D G D, G)
 * that uses octave structure fails at the same point, because the
 * Cauchy Gram is NOT block-diagonally dominant (long-range kernel), so the
 * off-diagonal octave blocks cannot be discarded.
 *
 * HONEST SCOPE. This is an ASSESSMENT: no bound is derived and no
 * certificate is claimed. WP-A is refuted (undershoots -- not an upper
 * bound); WP-B is valid but vacuous (no weight discount); the tapered
 * -split / weight-discounted per-factor bound is OPEN. The count leg
 * (SGN-C, SGN-NP) is unchanged and remains terminal in count currency; the
 * depth-only leg stays dead (imp-95224 DC-NOGO). The width-law paper
 * packets (N ~ pD at x = Theta(1)) remain uncertified. Sub-gap imp-95212
 * -subgap-fresnel-airy-envelope-port STILL OPEN; obligation (2) weight
 * leg OPEN; no Lambda bound changes; NO QED; no refereed bound is changed.
 *
 * NUMERICAL RELIABILITY. All probes use shallow, well-separated,
 * well-conditioned configs (within-octave relative spacing >= 0.13, far
 * above the ~1e-3 threshold below which double-precision pencil solves
 * fabricate values -- the imp-95225 referee trap) and are converged (600
 * vs 1500 vs 3000 power-iteration steps agree to 8 digits). The dramatic
 * multi-octave headroom (occupancy growing with octave index) is visible
 * only under extended precision -- the same documented trap -- so the
 * reliable double-precision demonstration is the moderate one above.
 *
 * Import-light (no zeros bundle, no sibling imports). The assertions
 * recompute every literal and THROW on violation.
 */

// -- baked literals (recomputed by the assertions) ----------------------------
const COUNT_B2_N3_X6 = 0.253746561; // B(3, 6)^2, the count-priced SGN-C bound
const LAMBDA_UNION_111 = 3.80599150e-7; // true Lambda, occ = [1,1,1], d = 6
const SQRT_LAMBDA_UNION_111 = 6.16927184e-4; // its square root
const NAIVE_ISOLATED_PROD_111 = 1.23425036e-4; // prod (1 + sqrt(Lam_j)) - 1
const NAIVE_UNDERSHOOT_RATIO = 4.998396; // union / naive (> 1 => not a bound)
const SQRT_LAMBDA_UNION_222 = 4.10386029e-2; // true, occ = [2,2,2], d = 6
const COUPLING_PROD_222 = 7.59415852e6; // valid coupling-aware product bound
const COUPLING_FACTORS_222 = [265.6014, 107.6666, 265.5633]; // per-octave ||g_j||

// -- the count-priced SGN-C bound B(N, x, K) (imp-95225) -----------------------
function logBinom(K, k) {
  let s = 0;
  for (let i = 0; i < k; i++) s += Math.log((K - i) / (i + 1));
  return s;
}
function logB(N, x, K) {
  const base = Math.log(1 + Math.exp(x / K));
  let mx = -Infinity;
  const terms = [];
  for (let k = 0; k <= N - 1; k++) {
    const t = logBinom(K, k) + k * base;
    terms.push(t);
    if (t > mx) mx = t;
  }
  let s = 0;
  for (const t of terms) s += Math.exp(t - mx);
  return -x + mx + Math.log(s);
}
function logBmin(N, x) {
  const cap = Math.max(4 * N, Math.ceil(4 * x), 40);
  let best = Infinity;
  for (let K = Math.max(1, N - 1); K <= cap; K++) {
    const v = logB(N, x, K);
    if (v < best) best = v;
  }
  return best;
}

// -- pencil lambda_max(T G T, G) for a real target diagonal T ------------------
function gaussSolve(Ain, bin) {
  const n = Ain.length;
  const M = Ain.map((r, i) => [...r, bin[i]]);
  for (let c = 0; c < n; c++) {
    let piv = c;
    for (let r = c + 1; r < n; r++)
      if (Math.abs(M[r][c]) > Math.abs(M[piv][c])) piv = r;
    const tmp = M[c];
    M[c] = M[piv];
    M[piv] = tmp;
    for (let r = 0; r < n; r++) {
      if (r === c) continue;
      const fac = M[r][c] / M[c][c];
      for (let j = c; j <= n; j++) M[r][j] -= fac * M[c][j];
    }
  }
  return M.map((r, i) => r[n] / M[i][i]);
}
function pencilLam(nus, t, iters) {
  const G = nus.map((a) => nus.map((b) => 1 / (a + b)));
  const H = nus.map((a, i) => nus.map((b, j) => (t[i] * t[j]) / (a + b)));
  let v = nus.map((_, i) => 1 + 0.13 * i);
  let lam = 0;
  for (let it = 0; it < (iters || 1500); it++) {
    const Hv = H.map((row) => row.reduce((s, e, j) => s + e * v[j], 0));
    const w = gaussSolve(
      G.map((r) => [...r]),
      Hv,
    );
    const nrm = Math.sqrt(w.reduce((s, e) => s + e * e, 0)) || 1;
    v = w.map((e) => e / nrm);
    const Hv2 = H.map((row) => row.reduce((s, e, j) => s + e * v[j], 0));
    const Gv = G.map((row) => row.reduce((s, e, j) => s + e * v[j], 0));
    lam =
      v.reduce((s, e, i) => s + e * Hv2[i], 0) /
      v.reduce((s, e, i) => s + e * Gv[i], 0);
  }
  return Math.abs(lam);
}

// -- verdict object ------------------------------------------------------------
export const IMP95133_SIGNED_WEIGHT_COMPOSITION_SCOPING = {
  ticket:
    "imp-95133 (SCOPING ASSESSMENT of a signed WEIGHT-priced seam certificate: enumerate the candidate signed cross-octave compositions for pricing Lambda = lambda_max(D G D, G) by the octave-Szasz weight W = sum_j M_j 2^(-j) rather than the distinct-rate count N; derive NO bound)",
  object:
    "signed shift constant Lambda(nu, d) = lambda_max of the pencil (D G D, G), G_ij = 1/(nu_i + nu_j), D = diag(e^(-d nu_i)); exactly the min over H-inf(C+) interpolants g of ||g||_inf^2 with g(nu_i) = e^(-d nu_i) (imp-95226 SGN-NP, TERMINAL in count currency). Lambda sups over all signs; the positive-cone chain bounds the strictly smaller nonnegative-amplitude ratio R.",
  motivation:
    "the count-priced SGN-C bound over-prices octave-spread families by orders of magnitude: for one rate per octave (rates 1.5, 3, 6; N = 3, x = 6) B(3, 6)^2 = 0.253746561 exceeds the TRUE Lambda = 3.80599150e-7 by ~666000x, and goes vacuous once N >= 1 + 1.4427x while the true constant stays far below 1 -- large headroom for a weight-priced bound.",
  candidateWPA:
    "naive per-octave-in-isolation multiplicative composition (direct TVC port): sqrt(Lambda_union) <= prod_j (1 + sqrt(Lam_j)) - 1 with Lam_j the octave-j constant in isolation. REFUTED -- it UNDERSHOOTS: already at one rate per octave (Lam_j EXACT, no coalescence) sqrt(Lambda_union) = 6.16927184e-4 exceeds the naive product 1.23425036e-4 by ~4.998, so it is NOT an upper bound. Mechanism: the Cauchy/Szego kernel is long-range, octave blocks are strongly coupled, and dropping cross-block Gram mass inflates the true Lambda beyond any isolated product -- the exact sense in which TVC is positive-cone (R factorizes for nonnegative amplitudes; the signed operator constant does not).",
  candidateWPB:
    "coupling-aware H-inf multiplicative composition with off-octave normalization: g = prod_j g_j, g_j(nu_i) = w_i on octave j and = 1 elsewhere, so Lambda_union <= (prod_j ||g_j||_inf)^2 by the NP-CERT product law -- a VALID upper bound. VACUOUS: for two rates per octave over three octaves the product 7.59415852e6 dominates the true sqrt(Lambda_union) = 4.10386029e-2 but is loose by ~1.85e8, and the per-octave factors ||g_j||_inf blow up to 265.6 / 107.7 / 265.6. Mechanism: the pin-to-1 normalization forces each factor to swing between O(1) at far nodes and exponentially small on its own octave, an O(condition-number) sup-norm; the split, not the composition, is the killer.",
  survivingOpenFreedom:
    "the product law is valid for ANY split g_j(nu_i) = w_i^(alpha_ji) with sum_j alpha_ji = 1 (WP-B is the degenerate alpha = 1 on octave, 0 off). A weight-priced certificate would TAPER alpha across octaves so each factor stays O(1) with sup-norm discounted by the octave weight 2^(-j) (deep octaves carry exponentially small data w_i = e^(-2^j x), so a bounded factor need barely move there). No admissible split with a per-factor bound in the octave WEIGHT M_j 2^(-j) rather than the count M_j is known -- that missing lemma is the new signed cross-octave composition. Pencil form: a block-Schur estimate using octave structure fails identically, since the Cauchy Gram is not block-diagonally dominant.",
  subGap:
    "imp-95212-subgap-fresnel-airy-envelope-port -- STILL OPEN. Obligation (2) currency ledger: depth leg DEAD (imp-95224 DC-NOGO); COUNT leg DELIVERED and TERMINAL (imp-95225 SGN-C, imp-95226 SGN-NP); WEIGHT leg OPEN -- this module scopes it: WP-A refuted (undershoots), WP-B valid but vacuous, tapered-split weight-discounted per-factor bound OPEN; modulus/phase leg OPEN. The width-law paper packets stay uncertified.",
  verdict:
    "ASSESSMENT (no bound derived): the signed weight port needs a NEW cross-octave composition, confirmed constructively. The naive positive-cone TVC port UNDERSHOOTS the signed operator constant (not an upper bound; long-range Cauchy coupling), and the valid coupling-aware H-inf product composition is VACUOUS under the natural pin-to-1 normalization (per-factor sup-norms blow up by orders of magnitude). The surviving lever is a tapered inner-function split whose per-factor sup-norm is discounted by the octave weight 2^(-j); no such weight-priced bound is currently known. Motivation is real -- the count leg over-prices octave-spread families by ~666000x and goes vacuous. Sub-gap STILL OPEN; obligation (2) weight leg OPEN; count leg unchanged and terminal; no Lambda bound changes; NO QED; no refereed bound is changed.",
  constants: {
    countB2N3X6: COUNT_B2_N3_X6,
    lambdaUnion111: LAMBDA_UNION_111,
    sqrtLambdaUnion111: SQRT_LAMBDA_UNION_111,
    naiveIsolatedProd111: NAIVE_ISOLATED_PROD_111,
    naiveUndershootRatio: NAIVE_UNDERSHOOT_RATIO,
    sqrtLambdaUnion222: SQRT_LAMBDA_UNION_222,
    couplingProd222: COUPLING_PROD_222,
    couplingFactors222: COUPLING_FACTORS_222,
  },
};

// -- assertions (self-executing; import-light; THROW on violation) -------------
export const IMP95133_SIGNED_WEIGHT_COMPOSITION_ASSERTIONS = [
  {
    id: "imp95133-count-overprices-octave-spread",
    description:
      "MOTIVATION: for the octave-spread family (rates 1.5, 3, 6; N = 3, x = 6) the count-priced SGN-C bound B(3, 6)^2 = 0.253746561 over-prices the true signed constant Lambda = 3.80599150e-7 by a factor above 1e5 -- large weight-pricing headroom",
    holds: () => {
      const b2 = Math.exp(2 * logBmin(3, 6));
      if (Math.abs(b2 - COUNT_B2_N3_X6) > 1e-6) return false;
      const nus = [1.5, 3, 6];
      const w = nus.map((nu) => Math.exp(-6 * nu));
      const lam = pencilLam(nus, w, 1500);
      if (Math.abs(lam / LAMBDA_UNION_111 - 1) > 1e-4) return false;
      // the count bound over-prices the true constant by more than 1e5
      return b2 / lam > 1e5;
    },
  },
  {
    id: "imp95133-wpa-naive-isolated-composition-undershoots",
    description:
      "CANDIDATE WP-A REFUTED: at one rate per octave (Lam_j exact) the true sqrt(Lambda_union) = 6.16927184e-4 STRICTLY EXCEEDS the naive per-octave-in-isolation product prod (1 + sqrt(Lam_j)) - 1 = 1.23425036e-4 (ratio ~4.998) -- the direct TVC port is NOT an upper bound in the signed sector",
    holds: () => {
      const nus = [1.5, 3, 6];
      const d = 6;
      const w = nus.map((nu) => Math.exp(-d * nu));
      const sqrtUnion = Math.sqrt(pencilLam(nus, w, 1500));
      if (Math.abs(sqrtUnion / SQRT_LAMBDA_UNION_111 - 1) > 1e-4) return false;
      // single-rate octaves: Lam_j = e^(-2 nu_j d) EXACTLY
      let prod = 1;
      for (const nu of nus) prod *= 1 + Math.exp(-nu * d);
      prod -= 1;
      if (Math.abs(prod / NAIVE_ISOLATED_PROD_111 - 1) > 1e-4) return false;
      const ratio = sqrtUnion / prod;
      if (Math.abs(ratio - NAIVE_UNDERSHOOT_RATIO) > 1e-3) return false;
      // the union EXCEEDS the naive product: composition invalid
      return ratio > 1;
    },
  },
  {
    id: "imp95133-wpb-coupling-aware-composition-valid-but-vacuous",
    description:
      "CANDIDATE WP-B: the coupling-aware H-inf product composition (g_j = w_i on octave j, 1 elsewhere) IS a valid upper bound (7.59415852e6 >= true sqrt(Lambda_union) = 4.10386029e-2) but VACUOUS -- loose by ~1.85e8, with per-octave factors 265.6 / 107.7 / 265.6 all far above 1: the pin-to-1 normalization destroys the weight discount",
    holds: () => {
      const nus = [1.25, 1.75, 2.5, 3.5, 5, 7];
      const oidx = [0, 0, 1, 1, 2, 2];
      const d = 6;
      const w = nus.map((nu) => Math.exp(-d * nu));
      const sqrtUnion = Math.sqrt(pencilLam(nus, w, 1500));
      if (Math.abs(sqrtUnion / SQRT_LAMBDA_UNION_222 - 1) > 1e-4) return false;
      let prod = 1;
      const parts = [];
      for (const j of [0, 1, 2]) {
        const t = nus.map((nu, i) => (oidx[i] === j ? w[i] : 1));
        const gj = Math.sqrt(pencilLam(nus, t, 1500));
        parts.push(gj);
        prod *= gj;
      }
      if (Math.abs(prod / COUPLING_PROD_222 - 1) > 1e-3) return false;
      // VALID upper bound
      if (!(prod >= sqrtUnion)) return false;
      // VACUOUS: loose by many orders and every factor blows up above 1
      if (!(prod / sqrtUnion > 1e6)) return false;
      for (let j = 0; j < parts.length; j++) {
        if (!(parts[j] > 10)) return false;
        if (Math.abs(parts[j] / COUPLING_FACTORS_222[j] - 1) > 1e-3)
          return false;
      }
      return true;
    },
  },
  {
    id: "imp95133-verdict-honesty",
    description:
      "the verdict carries the honest scope: no bound derived, WP-A refuted and WP-B vacuous, the tapered-split weight-discounted per-factor bound recorded OPEN, sub-gap STILL OPEN, count leg terminal and unchanged, no QED, no refereed bound is changed",
    holds: () =>
      /no bound derived/.test(
        IMP95133_SIGNED_WEIGHT_COMPOSITION_SCOPING.verdict,
      ) &&
      /UNDERSHOOTS/.test(IMP95133_SIGNED_WEIGHT_COMPOSITION_SCOPING.verdict) &&
      /VACUOUS/.test(IMP95133_SIGNED_WEIGHT_COMPOSITION_SCOPING.verdict) &&
      /STILL OPEN/.test(IMP95133_SIGNED_WEIGHT_COMPOSITION_SCOPING.subGap) &&
      /WEIGHT leg OPEN/.test(IMP95133_SIGNED_WEIGHT_COMPOSITION_SCOPING.subGap) &&
      /NO QED/.test(IMP95133_SIGNED_WEIGHT_COMPOSITION_SCOPING.verdict) &&
      /refereed bound is changed/i.test(IMP95133_SIGNED_WEIGHT_COMPOSITION_SCOPING.verdict),
  },
];

for (const a of IMP95133_SIGNED_WEIGHT_COMPOSITION_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-95133-signed-weight-composition-scoping assertion failed: ${a.id}`,
    );
  }
}

export default IMP95133_SIGNED_WEIGHT_COMPOSITION_SCOPING;
