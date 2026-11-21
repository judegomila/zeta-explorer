/**
 * imp-95008 continuation - arithmetic separation of the shifted alias
 * denominators, the exact curvature floor lambda >= 1/p, the fold-overlap
 * INVERSION, and a closed-form worst-case-curvature bracket of the named
 * scalar sum_{h != 0} w(h)^2 lambda(h)^(-2/3).
 *
 * SETTING (Permuting the Zeta Twin Ladder Section 4.5; page
 * /permutation-architecture "alias-packet coupling" box; module
 * imp-95008-weld-alias-l2-collapse.js). The weld [B_v, Pi_p] decomposes into
 * nonzero aliases h in {1..p-1} whose Fresnel-Airy packets sit at the shifted
 * stationary points u = v/(k - h/p), k in Z, with phase curvature lambda.
 * imp-95008 reduced the five-shell correlated weld to single-shell packet
 * masses times ONE overlap constant K (bounded-overlap l2 collapse) and left
 * three residuals: (a) K near the fold, where it recorded "adjacent-h
 * stationary points coalesce, which is exactly where support disjointness
 * fails"; (b) the named scalar itself, uniform over the window and both seam
 * sides; (c) the l2-to-pointwise |C_E,17| duality step.
 *
 * THIS MODULE: two unconditional lemmas, one conditional proposition, one
 * conditional theorem. The unconditional part is pure integer arithmetic on
 * the stationary-point family the page itself states; the conditional parts
 * are labeled with their exact hypotheses.
 *
 * LEMMA A (arithmetic separation + curvature floor - UNCONDITIONAL, exact).
 * Write d_{k,h} = k - h/p, so p d_{k,h} = pk - h is an integer.
 *  (i)  For h in {1..p-1} the integer pk - h is never 0 (0 < h < p), hence
 *       |d_{k,h}| >= 1/p for EVERY alias and every branch k: the curvature
 *       scale of the shifted stationary point is floored at 1/p. In
 *       particular lambda^(-1/3) <= p^(1/3) and lambda^(-2/3) <= p^(2/3):
 *       no single Airy packet amplitude exceeds C w(h) p^(1/3) - with the
 *       equal comb weight w(h) = 1/p that is C p^(-2/3) per packet.
 *  (ii) The map (k,h) -> d_{k,h} is INJECTIVE and its distinct values differ
 *       by at least 1/p: d_{k,h} - d_{k',h'} = (p(k-k') - (h-h'))/p, and the
 *       numerator is an integer which vanishes only if p | (h-h'), forcing
 *       h = h' (range width p-2 < p) and then k = k'. The shifted-denominator
 *       set is globally (1/p)-separated.
 *  (iii) Sharpness: min over k of |k - h/p| equals dist(h/p, Z)
 *       = min(h, p-h)/p, attained at k in {0, 1}; the global floor 1/p is
 *       attained exactly at (k,h) = (0,1) and (1, p-1).
 *
 * LEMMA B (hyperbolic spacing - UNCONDITIONAL). For same-sign denominators
 * d, d' the stationary points u = v/d, u' = v/d' satisfy the exact identity
 *   |u - u'| = v |d - d'| / (d d'),
 * so by Lemma A(ii), within a dyadic curvature block Delta < |d| <= 2 Delta
 * the pairwise stationary-point spacing is at least v / (4 p Delta^2).
 * FOLD INVERSION corollary: as the curvature floor is approached
 * (Delta down to 1/p - the degenerate, large-amplitude Airy end) the
 * guaranteed spacing v/(4 p Delta^2) GROWS like v p / 4, while any packet
 * half-width of the form c lambda^(-beta), beta <= 1/2, grows only like
 * Delta^(-beta). The recorded residual-(a) geometry is therefore INVERTED:
 * adjacent-alias stationary points do NOT coalesce near the fold - they
 * separate fastest there; coalescence (|u - u'| -> 0) occurs only as
 * d d' -> infinity, i.e. at the HIGH-curvature end, where the packets are
 * narrowest and the plain stationary-phase regime (beta = 1/2) applies.
 * Scope note: this controls INTER-alias support overlap - exactly the K of
 * the imp-95008 collapse. The intra-alias fold (two stationary points of one
 * packet coalescing) sets the packet width/amplitude scale and enters only
 * through the hypothesis constants (c, beta) below.
 *
 * PROPOSITION C (dyadic overlap bracket - CONDITIONAL on the packet-width
 * hypothesis: each packet supported, or majorized, in
 * |u - u_{k,h}| <= c lambda^(-beta)). Per branch sign, within the dyadic
 * block Delta < lambda <= 2 Delta the overlap multiplicity obeys
 *   K(Delta) <= 1 + floor( 8 c p Delta^(2-beta) / v ),
 * because at most floor(2 rho_max / s_min) further centers can sit within
 * rho_max of any point (centers s_min-separated), with
 * rho_max = c Delta^(-beta), s_min = v/(4 p Delta^2). The admissible
 * curvature range [1/p, D] splits into B = ceil(log2(p D)) dyadic blocks, so
 * the imp-95008 l2 collapse applies BLOCKWISE at the cost of one
 * Cauchy-Schwarz factor B: ||sum a||^2 <= B sum_blocks K(Delta_b) sum ||a||^2.
 * At the fold-most block Delta = 1/p (Airy regime beta = 1/3):
 * K <= 1 + floor(8 c p^(-2/3) / v) = 1 whenever 8c/v < p^(2/3) - at p = 97,
 * c = v = 1 the packets there are provably DISJOINT (8 x 97^(-2/3) ~ 0.379).
 *
 * THEOREM D (closed-form worst-case-curvature bracket of the named scalar -
 * CONDITIONAL on the curvature normalization lambda(h) >= mu ||h/p||, with
 * ||x|| = dist(x, Z) and mu a fixed constant; exact with mu = 1 for the
 * quadratic Fresnel model phase phi(u) = v u - (k - h/p) u^2 / 2, whose
 * stationary points are exactly u = v/(k - h/p) with |phi''| = |k - h/p|).
 * Since x -> x^(-2/3) is decreasing and min over k of |k - h/p| = ||h/p||
 * (Lemma A(iii)), the named scalar with equal comb weights w(h) = 1/p obeys
 *   S = sum_{h != 0} w(h)^2 lambda(h)^(-2/3)
 *     <= mu^(-2/3) (1/p^2) sum_{h=1}^{p-1} ||h/p||^(-2/3)
 *      = mu^(-2/3) 2 p^(-4/3) sum_{j=1}^{(p-1)/2} j^(-2/3)          (p odd),
 * because min(h, p-h) sweeps each j in {1..(p-1)/2} exactly twice. The
 * finite sum has the exact integral brackets (f decreasing)
 *   3((m+1)^(1/3) - 1) <= sum_{j=1}^{m} j^(-2/3) <= 3 m^(1/3) - 2,
 * so p^(4/3) S / 2 is pinned in closed form; asymptotically
 * S ~ (6/2^(1/3)) / p ~ 4.7622 / p. At p = 97 (mu = 1) the module computes
 *   S <= 2 x 97^(-4/3) x sum_{j=1}^{48} j^(-2/3) ~ 0.03811,
 * a ~5.65x refinement of the floor-only cap (p-1) p^(-4/3) ~ 0.21540 that
 * Lemma A(i) alone gives. UNIFORMITY DISSOLUTION: the h-sum is N-free,
 * window-free and seam-free; under any separable normalization
 * lambda(N,h,k) = mu(N) |k - h/p| with mu monotone on the window, the
 * "uniform over 690988 <= N <= 54799999 and both seam sides" requirement of
 * residual (b) collapses to ONE endpoint evaluation of mu.
 *
 * SKEPTICAL SELF-CHECK RECORD: (1) Lemma A needs only 0 < h < p - no
 * primality; (2) the inversion cannot be an artifact of branch choice:
 * opposite-sign denominators put u on opposite sides of 0 at distance
 * |u| + |u'| >= 2 v p / (numerator scale), handled by treating branches
 * separately (per-branch K, at most doubled); (3) Theorem D majorizes
 * whatever branch the true packet occupies, since lambda_true(h) >= mu
 * min_k |k - h/p|; (4) the closeness of the floor-only cap 0.21540 to the
 * measured |C_E,17| peak 0.2141255 is a numerical coincidence of unrelated
 * quantities (an l2 controller cap vs a pointwise carrier peak) and is NOT
 * claimed as structure.
 *
 * WHAT REMAINS OPEN (honest residuals):
 *  - the curvature normalization mu for the PAPER phase (Theorem D is exact
 *    only for the quadratic Fresnel model phase; the paper packet phase may
 *    carry a different, possibly N-dependent, normalization - the separable
 *    case reduces to one constant, the non-separable case is unhandled);
 *  - the packet-width constants (c, beta) of Proposition C;
 *  - the high-curvature ceiling D retained by the window (sets the worst
 *    block bracket and the block count B);
 *  - residual (c) unchanged: the passage from the l2 weld bound to the
 *    pointwise scalar |C_E,17|.
 *
 * The numerics below CROSS-CHECK the exact statements (integer arithmetic
 * for Lemma A, explicit interval sweeps for Proposition C, the finite sum
 * and its brackets for Theorem D); they are not the claim. Import-light (no
 * heavy bundle). Changes no bound; does NOT promote Lambda <= 0.14; NO QED;
 * no refereed bound is changed.
 */

const P = 97; // the telescope prime

// ── Lemma A cross-checks (exact integer arithmetic) ─────────────────────────
// numerators pk - h over k in [-6..6], h in 1..p-1
function lemmaAGrid() {
  const numerators = [];
  for (let k = -6; k <= 6; k++) {
    for (let h = 1; h <= P - 1; h++) {
      numerators.push(P * k - h);
    }
  }
  const distinct = new Set(numerators);
  let minAbs = Infinity;
  for (const n of numerators) minAbs = Math.min(minAbs, Math.abs(n));
  const sorted = [...numerators].sort((a, b) => a - b);
  let minGap = Infinity;
  for (let i = 1; i < sorted.length; i++) {
    minGap = Math.min(minGap, sorted[i] - sorted[i - 1]);
  }
  return { count: numerators.length, distinctCount: distinct.size, minAbs, minGap };
}
const LEMMA_A = lemmaAGrid();

// (iii) min over k of |pk - h| equals min(h, p-h) for every alias h,
// and k in {0,1} attains it while |k| >= 2 branches cannot beat it.
function lemmaAiiiHolds() {
  for (let h = 1; h <= P - 1; h++) {
    const near = Math.min(Math.abs(0 * P - h), Math.abs(1 * P - h)); // k = 0, 1
    if (near !== Math.min(h, P - h)) return false;
    // any |k| >= 2 or k <= -1 gives |pk - h| >= p + h or >= 2p - h > p - h
    if (Math.abs(-P - h) <= near || Math.abs(2 * P - h) <= near) return false;
  }
  return true;
}
const LEMMA_A_III = lemmaAiiiHolds();

// ── Lemma B spacing identity cross-check ────────────────────────────────────
function spacingIdentityMaxRelErr(v) {
  const pairs = [
    [2 / P, 3 / P],
    [5 / P, 190 / P],
    [98 / P, 193 / P],
    [1 / P, 96 / P],
  ];
  let worst = 0;
  for (const [d, dp] of pairs) {
    const lhs = Math.abs(v / d - v / dp);
    const rhs = (v * Math.abs(d - dp)) / (d * dp);
    worst = Math.max(worst, Math.abs(lhs - rhs) / rhs);
  }
  return worst;
}
const SPACING_IDENTITY_RELERR = spacingIdentityMaxRelErr(1);

// ── Proposition C: dyadic block overlap, measured vs bracket ────────────────
// Positive branch: enumerate d = numer/p with numer an integer NOT divisible
// by p (every such numer is realized by exactly one (k,h) pair - Lemma A(ii)),
// Delta < d <= 2 Delta; packet half-width c d^(-beta); measure the true max
// overlap by sweeping all interval endpoints and centers (the coverage count
// only changes at endpoints, so this sweep attains the maximum).
function blockOverlap(Delta, beta, c, v) {
  const pts = [];
  const loNumer = Math.floor(P * Delta) + 1;
  const hiNumer = Math.floor(2 * P * Delta + 1e-9);
  for (let numer = loNumer; numer <= hiNumer; numer++) {
    if (numer % P === 0) continue; // h = 0 fold: not an alias
    const d = numer / P;
    if (d <= Delta || d > 2 * Delta) continue;
    pts.push({ u: v / d, rho: c * Math.pow(d, -beta) });
  }
  let measuredK = 0;
  for (const q of pts) {
    for (const x of [q.u - q.rho, q.u, q.u + q.rho]) {
      let cover = 0;
      for (const r of pts) {
        if (Math.abs(x - r.u) <= r.rho + 1e-12) cover++;
      }
      measuredK = Math.max(measuredK, cover);
    }
  }
  const bracketK = 1 + Math.floor((8 * c * P * Math.pow(Delta, 2 - beta)) / v);
  return { nPackets: pts.length, measuredK, bracketK };
}

// fold-most block (Airy regime beta = 1/3): provable disjointness
const FOLD_BLOCK = blockOverlap(1 / P, 1 / 3, 1, 1);
// second fold-side block: still disjoint, bracket allows 2
const FOLD_BLOCK_2 = blockOverlap(2 / P, 1 / 3, 1, 1);
// high-curvature block (stationary-phase regime beta = 1/2): overlap accrues
const HIGH_BLOCK = blockOverlap(1, 1 / 2, 1, 1);

// width/spacing ratio 8 c p Delta^(2-beta) is strictly increasing in Delta
const RATIO_FOLD = 8 * P * Math.pow(1 / P, 2 - 1 / 3);
const RATIO_HIGH = 8 * P * Math.pow(1, 2 - 1 / 2);

// ── Theorem D: closed-form worst-case-curvature scalar bracket ──────────────
function sumJPow23(m) {
  let s = 0;
  for (let j = 1; j <= m; j++) s += Math.pow(j, -2 / 3);
  return s;
}
const bracketLo = (m) => 3 * (Math.cbrt(m + 1) - 1);
const bracketHi = (m) => 3 * Math.cbrt(m) - 2;

// S_bound(p) = 2 p^(-4/3) sum_{j=1..(p-1)/2} j^(-2/3), p odd, mu = 1
function scalarBound(p) {
  return 2 * Math.pow(p, -4 / 3) * sumJPow23((p - 1) / 2);
}

const SUM_48 = sumJPow23(48);
const S_97 = scalarBound(97);
const FLOOR_ONLY_CAP_97 = (P - 1) * Math.pow(P, -4 / 3); // Lemma A(i) alone
const REFINEMENT_FACTOR = FLOOR_ONLY_CAP_97 / S_97;
const ASYMPTOTIC_CONST = 6 / Math.cbrt(2); // lim p S_bound(p) ~ 4.7622
const P_SCALING_SAMPLE = [13, 97, 997, 9973].map((p) => ({
  p,
  pTimesS: p * scalarBound(p),
}));

// per-packet Airy amplitude cap from the curvature floor (Lemma A(i))
const AIRY_AMP_CAP_UNIT_C = Math.pow(P, 1 / 3) / P; // w(h) p^(1/3) = p^(-2/3)

// ── verdict object ──────────────────────────────────────────────────────────
export const IMP95008_ALIAS_SEPARATION_CURVATURE_FLOOR = {
  ticket: "imp-95008 (continuation: residual (a) geometry + residual (b) closed form)",
  source:
    "Permuting the Zeta Twin Ladder Section 4.5; /permutation-architecture alias-packet coupling box; imp-95008-weld-alias-l2-collapse.js residuals (a),(b)",
  lemmaA:
    "UNCONDITIONAL: the shifted denominators k - h/p are globally (1/p)-separated and satisfy |k - h/p| >= 1/p (curvature floor); min over k equals dist(h/p, Z), floor attained at (0,1) and (1,p-1). Pure integer arithmetic.",
  lemmaB:
    "UNCONDITIONAL: |u - u'| = v|d - d'|/(d d') for same-sign denominators; within a dyadic curvature block the spacing is >= v/(4 p Delta^2), which GROWS toward the curvature floor.",
  foldInversion:
    "The imp-95008 residual-(a) geometry is inverted: adjacent-alias stationary points separate fastest at the fold (Airy) end and coalesce only at the high-curvature end where packets are narrowest; at p = 97, c = v = 1 the fold-most dyadic block is provably disjoint (K = 1).",
  propositionC:
    "CONDITIONAL on packet half-width c lambda^(-beta): per branch and dyadic block, K(Delta) <= 1 + floor(8 c p Delta^(2-beta) / v); blockwise l2 collapse costs one Cauchy-Schwarz factor B = ceil(log2(p D)).",
  theoremD:
    "CONDITIONAL on curvature normalization lambda(h) >= mu ||h/p|| (exact, mu = 1, for the quadratic Fresnel model phase): S <= mu^(-2/3) 2 p^(-4/3) sum_{j<=(p-1)/2} j^(-2/3) - an N-free, window-free, seam-free closed form with exact integral brackets; the window-uniformity demand of residual (b) collapses to one normalization constant in the separable case.",
  numbersAtP97: {
    scalarBoundMu1: S_97,
    floorOnlyCap: FLOOR_ONLY_CAP_97,
    refinementFactor: REFINEMENT_FACTOR,
    finiteSum48: SUM_48,
    sumBrackets: [bracketLo(48), bracketHi(48)],
    asymptoticConst: ASYMPTOTIC_CONST,
    airyAmpCapUnitC: AIRY_AMP_CAP_UNIT_C,
    foldBlock: FOLD_BLOCK,
    highBlock: HIGH_BLOCK,
  },
  coincidenceDisclaimer:
    "floor-only cap 0.21540 vs measured |C_E,17| peak 0.2141255: numerically close, structurally unrelated (l2 controller cap vs pointwise carrier peak); no connection claimed",
  namedResiduals: [
    "curvature normalization mu of the PAPER packet phase (Theorem D exact only for the quadratic Fresnel model phase; non-separable N-dependence unhandled)",
    "packet-width constants (c, beta) of Proposition C",
    "high-curvature ceiling D retained by the window (worst block bracket + block count B)",
    "imp-95008 residual (c) unchanged: the l2-to-pointwise |C_E,17| duality step",
  ],
  isRigorous: true,
  rigorScope:
    "Lemmas A and B are unconditional exact arithmetic/algebra of the stationary-point family stated on the page; Proposition C is conditional on the packet-width hypothesis; Theorem D is conditional on the curvature normalization. Numerics are cross-checks, not the claim.",
  promotesBound: false,
  verdict:
    "RIGOROUS SUB-LEMMAS + conditional closed form: the shifted-denominator set is exactly (1/p)-separated with curvature floor 1/p, the fold-overlap worry of imp-95008 residual (a) is INVERTED (disjointness improves toward the fold; overlap lives at the high-curvature end with an explicit dyadic bracket), and under the quadratic-Fresnel curvature normalization the named scalar has the N-free closed-form majorant 2 p^(-4/3) sum j^(-2/3) ~ 0.03811 at p = 97 (5.65x below the floor-only cap). The paper-phase curvature normalization, the packet-width constants, the high-curvature ceiling, and the l2-to-pointwise step remain open. Changes no bound; NO QED. No refereed bound is changed.",
};

// ── assertions (self-executing; throw on violation) ─────────────────────────
export const IMP95008_ALIAS_SEPARATION_CURVATURE_FLOOR_ASSERTIONS = [
  {
    id: "imp95008b-denominators-injective-on-grid",
    description: "Lemma A(ii): all 13x96 grid numerators pk - h are pairwise distinct (exact integers)",
    holds: () => LEMMA_A.count === 13 * 96 && LEMMA_A.distinctCount === LEMMA_A.count,
  },
  {
    id: "imp95008b-one-over-p-separation-attained",
    description: "Lemma A(ii): the minimal numerator gap on the grid is exactly 1, i.e. denominator separation exactly 1/p",
    holds: () => LEMMA_A.minGap === 1,
  },
  {
    id: "imp95008b-curvature-floor-attained",
    description: "Lemma A(i): min |pk - h| on the grid is exactly 1 (curvature floor 1/p), attained at (k,h) = (0,1) and (1,p-1)",
    holds: () =>
      LEMMA_A.minAbs === 1 &&
      Math.abs(0 * P - 1) === 1 &&
      Math.abs(1 * P - (P - 1)) === 1,
  },
  {
    id: "imp95008b-min-over-k-is-fractional-distance",
    description: "Lemma A(iii): min over k of |pk - h| equals min(h, p-h) for every alias h, attained at k in {0,1}",
    holds: () => LEMMA_A_III === true,
  },
  {
    id: "imp95008b-spacing-identity-exact",
    description: "Lemma B: |v/d - v/d'| = v|d - d'|/(d d') to float precision on sample pairs",
    holds: () => SPACING_IDENTITY_RELERR < 1e-12,
  },
  {
    id: "imp95008b-fold-block-provably-disjoint",
    description: "Proposition C at the fold-most block (Delta = 1/p, beta = 1/3, c = v = 1): bracket forces K = 1 and the measured overlap is 1",
    holds: () => FOLD_BLOCK.bracketK === 1 && FOLD_BLOCK.measuredK === 1,
  },
  {
    id: "imp95008b-second-fold-block-disjoint-within-bracket",
    description: "second fold-side block: measured K = 1, bracket 2 (bracket valid, not tight)",
    holds: () =>
      FOLD_BLOCK_2.measuredK === 1 &&
      FOLD_BLOCK_2.bracketK === 2 &&
      FOLD_BLOCK_2.measuredK <= FOLD_BLOCK_2.bracketK,
  },
  {
    id: "imp95008b-high-curvature-block-overlap-accrues",
    description: "high-curvature block (Delta = 1, beta = 1/2): all 96 packets overlap (measured K = 96) yet respect the bracket 777 - overlap lives at the HIGH-curvature end",
    holds: () =>
      HIGH_BLOCK.nPackets === 96 &&
      HIGH_BLOCK.measuredK === 96 &&
      HIGH_BLOCK.bracketK === 777 &&
      HIGH_BLOCK.measuredK <= HIGH_BLOCK.bracketK,
  },
  {
    id: "imp95008b-fold-inversion-monotone-ratio",
    description: "the width/spacing ratio 8 p Delta^(2-beta) is far smaller at the fold block than at the high block (inversion direction)",
    holds: () => RATIO_FOLD < 1 && RATIO_HIGH > 100 && RATIO_FOLD < RATIO_HIGH,
  },
  {
    id: "imp95008b-integral-brackets-contain-sum",
    description: "Theorem D brackets 3((m+1)^(1/3)-1) <= sum j^(-2/3) <= 3 m^(1/3) - 2 hold at m = 5, 48, 500",
    holds: () =>
      [5, 48, 500].every((m) => {
        const s = sumJPow23(m);
        return bracketLo(m) <= s && s <= bracketHi(m);
      }),
  },
  {
    id: "imp95008b-scalar-closed-form-value",
    description: "S_bound(97) = 2 x 97^(-4/3) x sum_{j<=48} j^(-2/3) lands in (0.0378, 0.0384)",
    holds: () => S_97 > 0.0378 && S_97 < 0.0384,
  },
  {
    id: "imp95008b-refinement-over-floor-cap",
    description: "the worst-case-curvature closed form refines the floor-only cap (p-1)p^(-4/3) ~ 0.21540 by a factor in (5.5, 5.8)",
    holds: () =>
      Math.abs(FLOOR_ONLY_CAP_97 - 0.2154) < 5e-4 &&
      REFINEMENT_FACTOR > 5.5 &&
      REFINEMENT_FACTOR < 5.8,
  },
  {
    id: "imp95008b-p-scaling-approaches-asymptote-from-below",
    description: "p x S_bound(p) increases toward 6/2^(1/3) ~ 4.7622 from below across p = 13, 97, 997, 9973 (within 5.5% at 9973)",
    holds: () => {
      const vals = P_SCALING_SAMPLE.map((x) => x.pTimesS);
      const increasing = vals.every((v, i) => i === 0 || v > vals[i - 1]);
      const below = vals.every((v) => v < ASYMPTOTIC_CONST);
      const close = Math.abs(vals[3] - ASYMPTOTIC_CONST) / ASYMPTOTIC_CONST < 0.055;
      return increasing && below && close;
    },
  },
  {
    id: "imp95008b-airy-amplitude-cap",
    description: "Lemma A(i) packet amplitude cap: w(h) lambda^(-1/3) <= p^(-2/3) ~ 0.0473 at unit C",
    holds: () =>
      Math.abs(AIRY_AMP_CAP_UNIT_C - Math.pow(P, -2 / 3)) < 1e-15 &&
      AIRY_AMP_CAP_UNIT_C > 0.047 &&
      AIRY_AMP_CAP_UNIT_C < 0.048,
  },
  {
    id: "imp95008b-honesty-gate-no-qed",
    description: "promotes no bound, names the open residuals (paper-phase normalization, packet width, ceiling D, duality step), NO QED, no refereed bound is changed",
    holds: () =>
      IMP95008_ALIAS_SEPARATION_CURVATURE_FLOOR.promotesBound === false &&
      IMP95008_ALIAS_SEPARATION_CURVATURE_FLOOR.namedResiduals.length === 4 &&
      /NO QED/.test(IMP95008_ALIAS_SEPARATION_CURVATURE_FLOOR.verdict) &&
      /refereed bound is changed/i.test(IMP95008_ALIAS_SEPARATION_CURVATURE_FLOOR.verdict),
  },
];

for (const a of IMP95008_ALIAS_SEPARATION_CURVATURE_FLOOR_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-95008-alias-separation-curvature-floor assertion failed: ${a.id}`
    );
  }
}

export default IMP95008_ALIAS_SEPARATION_CURVATURE_FLOOR;
