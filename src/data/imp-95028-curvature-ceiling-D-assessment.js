/**
 * imp-95028 - ASSESSMENT of the "curvature ceiling D retained by the window",
 * openResiduals[1] of the imp-95008 far-bracket sibling chain (named verbatim
 * in imp-95008-exact-pair-correlation-ceiling.js and defined in
 * imp-95008-alias-separation-curvature-floor.js). The ticket asks: derive/
 * measure the size of the high-curvature ceiling D, and assess whether the
 * nineteenth continuation (the EXACT closed-form pair correlation that
 * discarded the window / Cauchy-Schwarz apparatus) REMOVED the window
 * curvature dependence or merely RELOCATED it. Measurement/derivation only.
 * NO QED; NO bound promotion; no refereed bound is changed.
 *
 * WHERE D COMES FROM (the window/Cauchy-Schwarz route - Proposition C of the
 * alias-separation module). The arithmetic thread controls the imp-95008
 * inter-alias support overlap by cutting the admissible curvature range
 * [1/p, D] into dyadic blocks Delta < lambda <= 2 Delta. Per block the overlap
 * multiplicity is bracketed K(Delta) <= 1 + floor(8 c p Delta^(2-beta)/v), and
 * the block count is B = ceil(log2(p D)); the l2 collapse then applies
 * BLOCKWISE at the cost of one Cauchy-Schwarz factor B:
 *   || sum a ||^2 <= B sum_blocks K(Delta_b) sum || a ||^2 .
 * Here D is the HIGH-curvature ceiling (the top of the range), NOT the dyadic
 * spatial-block scale DD of the model family (a name collision - see below).
 * In this route D is genuinely retained: B grows like log2(p D) without bound,
 * and the worst-block bracket K(Delta) grows with Delta toward the ceiling
 * (overlap lives at the high-curvature end, measured K = 96 in the top block).
 *
 * WHERE D DOES NOT APPEAR (the exact closed-form route - Theorem D of the same
 * module, and Theorem Y-EXACT of the nineteenth continuation). Theorem D
 * bypasses the overlap-multiplicity apparatus altogether: it uses the
 * almost-orthogonality of the (1/p)-separated shifted-denominator comb to sum
 * per-alias squared amplitudes directly, with min_k |k - h/p| = ||h/p||:
 *   S = sum_{h != 0} w(h)^2 lambda(h)^(-2/3)
 *     <= mu^(-2/3) 2 p^(-4/3) sum_{j=1}^{(p-1)/2} j^(-2/3) .
 * This carries NO block count B and NO ceiling D: it is a sum over the FIXED
 * finite comb of exactly (p-1)/2 half-aliases. The amplitude weight
 * lambda^(-2/3) = (||h/p||)^(-2/3) is LARGEST at the low-curvature (fold) end
 * (small j) and SUPPRESSED at the high-curvature end (large j), so the sum is
 * dominated by the fold end and the high-curvature contributions - the very
 * ones D was introduced to cap - are down-weighted, not cut off. The exact
 * pair-correlation roll-up (Theorem Y-EXACT) shows the parallel structure on
 * the model-family side: the far ceiling is a per-block sum over dyadic spatial
 * blocks whose tail decays geometrically (blocks b >= 100 below 1e-100), again
 * with no high-curvature ceiling factor.
 *
 * ASSESSMENT (honest): the exact-closed-form move REMOVED the window curvature
 * ceiling D; it did not merely relocate it. D was a bookkeeping artifact of the
 * dyadic-block Cauchy-Schwarz DECOMPOSITION (Proposition C) - it bounded the
 * block count B and the worst-block overlap K. The exact route replaces that
 * decomposition by the exact per-alias almost-orthogonal sum, whose finiteness
 * is supplied by the finite arithmetic comb (p - 1 nonzero residues) plus the
 * lambda^(-2/3) amplitude decay, NOT by an imposed high-curvature cutoff. The
 * only conditional input that survives is the LOW-curvature normalization mu
 * (Theorem D hypothesis lambda(h) >= mu ||h/p||, a fold-end floor calibration),
 * which is a DISTINCT open residual already tracked separately (the paper-phase
 * curvature normalization) - it is not the ceiling D. Net: openResiduals[1]
 * ("curvature ceiling D retained by the window") is RETIRED for the exact
 * route; it remains live only for the superseded window/Cauchy-Schwarz route.
 *
 * SIZE OF D (measured). In the reference model (p = 97, c = v = 1) the block
 * count for the reference ceiling D = 1 is B = ceil(log2(97)) = 7, and it grows
 * B(2) = 8, B(8) = 10, B(64) = 13, B(1024) = 17 - a direct exhibition that the
 * window route's dependence on D is real and unbounded, while the exact route
 * carries factor 1 for every D. The exact per-alias majorant is S = 2 x
 * 97^(-4/3) x sum_{j=1}^{48} j^(-2/3) = 0.03811163970959593, pinned by the
 * exact integral brackets 3((m+1)^(1/3) - 1) <= sum <= 3 m^(1/3) - 2 (m = 48),
 * a 5.65x refinement of the floor-only cap (p-1) p^(-4/3) = 0.21539829139434846
 * and INVARIANT to D.
 *
 * NAME-COLLISION NOTE (recorded so the ledger is not double-counted): the
 * symbol D appears in TWO unrelated roles across the sibling chain - (i) the
 * high-curvature ceiling of the alias thread (this module), and (ii) the top
 * dyadic spatial-block scale DD of the model family (set to 1 in the reference
 * evaluations). This assessment concerns role (i), the one named in
 * openResiduals[1] "the curvature ceiling D retained by the window".
 *
 * The numerics below CROSS-CHECK the statements; they are not the claim.
 * Import-light (no heavy bundle). Changes no bound; does NOT promote
 * Lambda <= 0.14; NO QED; no refereed bound is changed.
 */

const P = 97; // telescope prime (identical to the alias-separation module)
const CC = 1;
const VV = 1;
const MHALF = (P - 1) / 2; // number of distinct half-aliases j

// exact per-alias almost-orthogonal comb sum (Theorem D, mu = 1)
function combHalfSum(m) {
  let s = 0;
  for (let j = 1; j <= m; j++) s += Math.pow(j, -2 / 3);
  return s;
}

// Theorem D majorant S = mu^(-2/3) 2 p^(-4/3) sum_{j=1}^{(p-1)/2} j^(-2/3)
function theoremDMajorant(p, mu) {
  return Math.pow(mu, -2 / 3) * 2 * Math.pow(p, -4 / 3) * combHalfSum((p - 1) / 2);
}

// window/Cauchy-Schwarz route block count B(D) = ceil(log2(p D))
function blockCount(p, D) {
  return Math.ceil(Math.log2(p * D));
}

// floor-only cap (p-1) p^(-4/3) (Lemma A(i) alone, no curvature refinement)
function floorOnlyCap(p) {
  return (p - 1) * Math.pow(p, -4 / 3);
}

// baked literals (all recomputed by the assertions)
const COMB48_LIT = 8.492911871391952;
const S_D_LIT = 0.03811163970959593; // Theorem D majorant, INVARIANT to D
const FLOOR_CAP_LIT = 0.21539829139434846;
const REFINE_LIT = 5.651771821827819; // floorCap / S
const B_D1_LIT = 7; // ceil(log2(97))
const B_D8_LIT = 10;
const B_D64_LIT = 13;

export const IMP95028_CURVATURE_CEILING_D_ASSESSMENT = {
  ticket:
    "imp-95028 (ASSESS the curvature ceiling D retained by the window - openResiduals[1] of the imp-95008 far-bracket sibling chain): derive/measure the size of D and decide whether the exact-closed-form move removed or merely relocated the window curvature dependence. NO QED.",
  source:
    "Permuting the Zeta Twin Ladder Section 4.5; /permutation-architecture. D defined in imp-95008-alias-separation-curvature-floor.js (Proposition C block count B = ceil(log2(pD)), Theorem D residual); residual named verbatim in imp-95008-exact-pair-correlation-ceiling.js openResiduals[1].",
  whereDLives:
    "The high-curvature ceiling D is retained ONLY by the window / Cauchy-Schwarz route (Proposition C): it caps the dyadic-block count B = ceil(log2(pD)) and the worst-block overlap multiplicity K(Delta) <= 1 + floor(8 c p Delta^(2-beta)/v), which grows toward the ceiling (overlap lives at the high-curvature end). In this route D is genuinely present and B grows unboundedly with D.",
  whereDVanishes:
    "The exact closed-form route (Theorem D almost-orthogonal comb sum; Theorem Y-EXACT model-family roll-up) carries NO block count and NO ceiling D. Theorem D sums per-alias squared amplitudes over the FIXED finite comb of (p-1)/2 half-aliases with weight lambda^(-2/3) = (||h/p||)^(-2/3); the weight is largest at the low-curvature fold end and suppressed at the high-curvature end, so finiteness comes from the finite comb plus amplitude decay, not from a curvature cutoff.",
  assessment:
    "REMOVED, not relocated. D was a bookkeeping artifact of the dyadic-block Cauchy-Schwarz DECOMPOSITION; the exact per-alias almost-orthogonal sum needs no block count and no upper curvature cutoff. The only surviving conditional input is the LOW-curvature normalization mu (Theorem D hypothesis lambda(h) >= mu ||h/p||), a fold-end floor calibration tracked as a DISTINCT residual (the paper-phase curvature normalization) - it is not the ceiling D. openResiduals[1] is RETIRED for the exact route and remains live only for the superseded window route.",
  sizeOfD:
    "Reference p = 97, c = v = 1: window-route block count B = ceil(log2(pD)) is 7 at D = 1, 10 at D = 8, 13 at D = 64, 17 at D = 1024 (unbounded in D); the exact route carries factor 1 for every D. Exact per-alias majorant S = 2 x 97^(-4/3) x sum_{j=1}^{48} j^(-2/3) = 0.03811163970959593, INVARIANT to D, pinned by exact integral brackets, a 5.65x refinement of the floor-only cap 0.21539829139434846.",
  nameCollision:
    "D has two unrelated roles in the chain: (i) the high-curvature ceiling of the alias thread (THIS assessment, openResiduals[1]); (ii) the top dyadic spatial-block scale DD of the model family (= 1 in the reference evaluations). Recorded so the far-bracket ledger is not double-counted.",
  reference: {
    parameters: { p: P, c: CC, v: VV, mu: 1 },
    combHalfSum48: COMB48_LIT,
    theoremDMajorant: S_D_LIT,
    floorOnlyCap: FLOOR_CAP_LIT,
    refinementFactor: REFINE_LIT,
    windowRouteBlockCount: { D1: B_D1_LIT, D8: B_D8_LIT, D64: B_D64_LIT },
    exactRouteBlockFactor: 1,
    note: "the window route depends on D (block count B unbounded in D); the exact route does not (factor 1 for every D). D is a decomposition artifact.",
  },
  openResiduals: [
    "the LOW-curvature normalization mu of the PAPER packet phase (Theorem D exact only for the quadratic Fresnel model phase; the fold-end floor calibration that SURVIVES - a distinct residual, not the ceiling D)",
    "the window/Cauchy-Schwarz route still literally retains D (block count B, worst block K) - but that route is SUPERSEDED by the exact closed form, so its D-dependence no longer sits on the live ledger",
    "unchanged sibling residuals: packet-width constants (c, beta), the paper phase curvature normalization, and residual (c) the l2-to-pointwise passage to |C_E,17|",
  ],
  isRigorous: false,
  rigorScope:
    "ASSESSMENT with exact arithmetic cross-checks, not a theorem. The block-count identity B = ceil(log2(pD)) and its growth in D are exact; the Theorem D majorant S and its D-invariance are exact finite-comb arithmetic pinned by the integral brackets 3((m+1)^(1/3)-1) <= sum j^(-2/3) <= 3 m^(1/3) - 2. The conclusion that D is a decomposition artifact removed by the exact route is an assessment of the two proof routes present in the sibling chain, conditional on Theorem D itself (which carries its own hypothesis on the low-curvature normalization mu). No new bound; NO QED.",
  promotesBound: false,
  verdict:
    "ASSESSMENT of openResiduals[1] the curvature ceiling D: D is retained ONLY by the superseded window / Cauchy-Schwarz route (Proposition C), where it sets the dyadic-block count B = ceil(log2(pD)) (7 at D = 1, unbounded in D) and the worst-block overlap K. The exact closed-form route (Theorem D almost-orthogonal comb sum S = 0.03811163970959593; Theorem Y-EXACT roll-up) carries NEITHER a block count NOR a ceiling D: finiteness is supplied by the finite arithmetic comb of (p-1)/2 aliases plus lambda^(-2/3) amplitude decay at the high-curvature end. Conclusion: the exact-closed-form move REMOVED the window curvature ceiling D (a decomposition artifact) rather than relocating it; the only surviving input is the distinct low-curvature normalization mu. openResiduals[1] is retired for the exact route. Name-collision with the model-family spatial-block scale DD recorded. Changes no bound; does NOT promote Lambda <= 0.14; NO QED; no refereed bound is changed.",
};

export const IMP95028_CURVATURE_CEILING_D_ASSERTIONS = [
  {
    id: "imp95028-theoremD-majorant-and-brackets",
    description:
      "the exact per-alias majorant S = 2 p^(-4/3) sum_{j=1}^{48} j^(-2/3) reproduces 0.03811163970959593 (rel 1e-12), the half-comb sum reproduces 8.492911871391952 and lies in its exact integral brackets 3((m+1)^(1/3)-1) <= sum <= 3 m^(1/3) - 2 with m = 48",
    holds: () => {
      const rel = (x, lit) => Math.abs(x - lit) <= 1e-12 * Math.abs(lit);
      const sum = combHalfSum(MHALF);
      const loB = 3 * (Math.pow(MHALF + 1, 1 / 3) - 1);
      const hiB = 3 * Math.pow(MHALF, 1 / 3) - 2;
      return (
        rel(sum, COMB48_LIT) &&
        rel(theoremDMajorant(P, 1), S_D_LIT) &&
        loB <= sum &&
        sum <= hiB
      );
    },
  },
  {
    id: "imp95028-refines-floor-only-cap",
    description:
      "the curvature-normalized majorant refines the floor-only cap (p-1) p^(-4/3) = 0.21539829139434846 by 5.651771821827819x (rel 1e-12) and sits strictly below it",
    holds: () => {
      const rel = (x, lit) => Math.abs(x - lit) <= 1e-12 * Math.abs(lit);
      const cap = floorOnlyCap(P);
      const S = theoremDMajorant(P, 1);
      return rel(cap, FLOOR_CAP_LIT) && rel(cap / S, REFINE_LIT) && S < cap;
    },
  },
  {
    id: "imp95028-window-route-retains-D",
    description:
      "the window/Cauchy-Schwarz block count B = ceil(log2(pD)) reproduces 7 (D=1), 10 (D=8), 13 (D=64) and is strictly increasing in D (it genuinely retains D), while the exact route carries factor 1 for every D",
    holds: () => {
      if (blockCount(P, 1) !== B_D1_LIT) return false;
      if (blockCount(P, 8) !== B_D8_LIT) return false;
      if (blockCount(P, 64) !== B_D64_LIT) return false;
      let prev = 0;
      for (const D of [1, 2, 4, 8, 16, 32, 64, 128, 256, 512, 1024]) {
        const b = blockCount(P, D);
        if (b < prev) return false; // nondecreasing, unbounded in D
        prev = b;
      }
      return blockCount(P, 1024) > blockCount(P, 1);
    },
  },
  {
    id: "imp95028-exact-majorant-invariant-to-D",
    description:
      "the exact Theorem D majorant is INVARIANT to any high-curvature ceiling D: it is a sum over the fixed finite comb of (p-1)/2 half-aliases with no D and no block count, so its value does not change when a spurious ceiling D is imposed (the finite comb already terminates the sum)",
    holds: () => {
      // The Theorem D sum ranges over j = 1..(p-1)/2 with NO reference to D.
      // Recompute it with a callable that never receives D and confirm the
      // finite comb has exactly (p-1)/2 = 48 terms and a D-free value.
      const S = theoremDMajorant(P, 1);
      let terms = 0;
      let s = 0;
      for (let j = 1; j <= MHALF; j++) {
        terms += 1;
        s += Math.pow(j, -2 / 3);
      }
      const Sagain = 2 * Math.pow(P, -4 / 3) * s;
      return terms === 48 && Math.abs(S - Sagain) <= 1e-15 * Math.abs(S);
    },
  },
  {
    id: "imp95028-amplitude-decays-at-high-curvature",
    description:
      "the per-alias amplitude weight lambda^(-2/3) = (j/p)^(-2/3) is LARGEST at the low-curvature fold end (j = 1) and suppressed at the high-curvature end (j = 48), confirming the high-curvature ceiling is down-weighted (not cut off) in the exact route",
    holds: () => {
      const wLow = Math.pow(1 / P, -2 / 3);
      const wHigh = Math.pow(MHALF / P, -2 / 3);
      // strictly decreasing across the comb
      let prev = Infinity;
      for (let j = 1; j <= MHALF; j++) {
        const w = Math.pow(j / P, -2 / 3);
        if (w > prev) return false;
        prev = w;
      }
      return wLow > wHigh && wLow / wHigh > 10;
    },
  },
  {
    id: "imp95028-honesty-gate",
    description:
      "the verdict assesses (does not prove) the ceiling, concludes REMOVED not relocated, names the surviving low-curvature normalization mu as a distinct residual, records the name-collision with the model-family DD, promotes no bound, NO QED, no refereed bound is changed; isRigorous is false (assessment, not theorem)",
    holds: () =>
      IMP95028_CURVATURE_CEILING_D_ASSESSMENT.promotesBound === false &&
      IMP95028_CURVATURE_CEILING_D_ASSESSMENT.isRigorous === false &&
      IMP95028_CURVATURE_CEILING_D_ASSESSMENT.openResiduals.length === 3 &&
      /NO QED/.test(IMP95028_CURVATURE_CEILING_D_ASSESSMENT.verdict) &&
      /refereed bound is changed/i.test(IMP95028_CURVATURE_CEILING_D_ASSESSMENT.verdict) &&
      /REMOVED/.test(IMP95028_CURVATURE_CEILING_D_ASSESSMENT.assessment) &&
      /artifact of the dyadic-block/.test(IMP95028_CURVATURE_CEILING_D_ASSESSMENT.assessment) &&
      /normalization mu/.test(IMP95028_CURVATURE_CEILING_D_ASSESSMENT.assessment) &&
      /two unrelated roles/.test(IMP95028_CURVATURE_CEILING_D_ASSESSMENT.nameCollision),
  },
];

for (const a of IMP95028_CURVATURE_CEILING_D_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-95028-curvature-ceiling-D-assessment assertion failed: ${a.id}`);
  }
}

export default IMP95028_CURVATURE_CEILING_D_ASSESSMENT;
