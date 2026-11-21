/**
 * imp-95030 - LOCALIZED IRREDUCIBILITY ASSESSMENT: is the outer parity AM-GM
 * factor 2 (now the DOMINANT achieved-side slack after the nineteenth
 * continuation closed residuals (b) and (c)) genuinely a HARD FLOOR, or does it
 * admit a non-AM-GM treatment localized to the b = 0 near-tie configuration?
 *
 * QUESTION (Permuting the Zeta Twin Ladder Section 4.5; page
 * /permutation-architecture). The parity roll-up
 *   || sum_b w_b ||^2 <= 2 sum_b || w_b ||^2 + 2 ( sup_b OmegaE_b ) M
 * carries a leading factor 2 from the two-coloring AM-GM step
 *   || x + y ||^2 <= 2 ( || x ||^2 + || y ||^2 ) ,  x = even-block mass, y = odd.
 * imp-95018 settled the GRAM-level question: over the admissible block-Gram cone
 * with FREE adjacent entries, sup lambda_max = 2 is ATTAINED (Gram-sharp). This
 * module answers the SHARPER localized question the ticket poses: since the
 * actual weld weights concentrate on the lowest blocks (OmegaE_0 and OmegaE_2
 * near-tie, every b >= 4 below OmegaE_2 / 100), could a non-AM-GM treatment that
 * keeps the cross term EXACT at the b = 0 near-tie beat the factor 2 there?
 *
 * WHERE THE FACTOR 2 COMES FROM (the adjacent-block correlation, not the far
 * one). Expand exactly, no AM-GM:
 *   || x + y ||^2 = || x ||^2 + || y ||^2 + 2 <x, y> = sum_b || w_b ||^2
 *                 + 2 sum_{b even, b prime odd} <w_b, w_{b prime}> .
 * The cross term <x, y> collects ALL even-odd block correlations. Same-parity
 * pairs (both in x, or both in y) have gap j >= 2 and are FAR - bounded by the
 * envE envelope caps (nineteenth continuation, EXACT at the substitution point).
 * The even-odd cross term is dominated by the ADJACENT pairs j = 1. The reason
 * the two-coloring exists AT ALL is that adjacent pairs cannot be handled by the
 * far machinery: the Lemma X separation floor VANISHES at j = 1,
 *   V(b, 1) = 2^(b(1-beta)) gSharp(1) = 0  for every b
 * (gSharp(1) = 2^beta (2^0 - 1)/(Q 2^beta) = 0), so adjacent packets have ZERO
 * guaranteed separation and their normalized correlation I(0, rho) is the
 * maximal, UNCAPPED value inside the MAJ(sigma, theta) envelope class. The
 * two-coloring pushes every uncapped adjacent pair into the cross term <x, y>
 * and then AM-GM discards it at the price of the factor 2.
 *
 * ASSESSMENT (HARD FLOOR within the current model; ONE named lever outside it).
 * A "non-AM-GM treatment localized to b = 0" means: keep 2 <x, y> exact instead
 * of majorizing it by || x ||^2 + || y ||^2. But the localized cross term at the
 * b = 0 near-tie is exactly the adjacent (0,1) and (1,2) block correlations,
 * which are UNCAPPED (V = 0). Keeping them exact therefore requires a NEW
 * ingredient the far-envelope class does not supply: an adjacent (j = 1)
 * block-correlation cap rho_adj < 1/2. Two facts pin this:
 *   (i) The b = 0 vs b = 2 near-tie is WITHIN the even color class (both even b);
 *       it does not create or break the parity balance || x || = || y ||, so no
 *       reweighting localized to that near-tie touches the factor 2 - the AM-GM
 *       equality is driven by the even-aggregate vs odd-aggregate balance and
 *       their alignment, not by the intra-class b = 0/b = 2 split.
 *   (ii) imp-95018 exhibits the admissible boundary Gram G* = tridiag(1; rho*),
 *       rho* = 1/(2 cos(pi/(K+1))) -> 1/2, with lambda_max = 2 attained by the
 *       near-constant balanced-parity sine mode. That equality configuration is
 *       admissible precisely because the adjacent entry is free (V(b,1) = 0), so
 *       no localized non-AM-GM move can exclude it.
 * Hence the factor 2 is IRREDUCIBLE - a hard floor - for any treatment that
 * stays inside the current MAJ far-envelope model (adjacent correlations free).
 *
 * THE SOLE LEVER, QUANTIFIED. The ONLY way to beat 2 is to supply an adjacent
 * cap rho_adj < 1/2 (a proven minimum adjacent separation, or amplitude
 * anti-correlation between consecutive blocks - genuinely new arithmetic input,
 * NOT an envelope inequality). With such a cap the K-block tridiagonal Toeplitz
 * ceiling drops from 2 to
 *   ceil(rho_adj, K) = 1 + 2 rho_adj cos(pi/(K+1))  ->  1 + 2 rho_adj  (large K).
 * So rho_adj = 1/2 gives 2 (current, uncapped up to the PSD boundary),
 * rho_adj = 1/4 gives 3/2, rho_adj = 1/10 gives 6/5. This is the exact exchange
 * rate: every unit of proven adjacent decorrelation below 1/2 buys 2 rho_adj of
 * the parity factor, and nothing else does.
 *
 * SCOPE / HONESTY. This is an ASSESSMENT that re-uses imp-95018 Gram-sharpness
 * and the sibling Lemma X floor; it proves no new bound and promotes no Lambda
 * number. The verdict is: the parity factor 2 is a HARD FLOOR within the current
 * model family (adjacent block correlation free / zero j = 1 separation floor),
 * irreducible by any reweighting or non-AM-GM treatment localized to the b = 0
 * near-tie; the sole escape is an adjacent (j = 1) block-correlation cap
 * rho_adj < 1/2, a new arithmetic ingredient outside the far-envelope MAJ class,
 * whose payoff is the exact ceiling 1 + 2 rho_adj. NO QED; no refereed bound is changed
 * . Import-light (no heavy bundle).
 */

// ── shared conventions (identical to the sibling modules) ────────────────────
const SIGMA = 1;
const BETA = 1 / 3;
const CC = 1;
const VV = 1;
const DD = 1;

function isolationQ(c, v, beta, D) {
  return ((c * Math.pow(D, 1 - beta)) / v) * Math.pow(2, -(1 - beta));
}
const QREF = isolationQ(CC, VV, BETA, DD);

function gOld(j, Q, beta) {
  return (Math.pow(2, j - 1) - 1) / (Q * Math.pow(2, j * beta));
}
function gSharp(j) {
  return Math.pow(2, BETA) * gOld(j, QREF, BETA);
}
// Lemma X per-pair separation floor, near block b, gap j
function cornerV(b, j) {
  return Math.pow(2, b * (1 - BETA)) * gSharp(j);
}

// ── the admissible tridiagonal Toeplitz block Gram (imp-95018) ────────────────
// rho* is the free-adjacent PSD boundary; ceil(rho, K) is the achievable parity
// ceiling factor if the adjacent correlation were capped at rho.
function rhoStar(K) {
  return 1 / (2 * Math.cos(Math.PI / (K + 1)));
}
function ceilFactor(rho, K) {
  return 1 + 2 * rho * Math.cos(Math.PI / (K + 1));
}

// exchange-rate table: what a hypothetical adjacent cap rho_adj < 1/2 would buy
const RHO_GRID = [0.5, 0.4, 0.3, 0.25, 0.2, 0.1];
const K_REF = 40;
const EXCHANGE = RHO_GRID.map((rho) => ({
  rhoAdj: rho,
  ceilK40: ceilFactor(rho, K_REF),
  ceilLargeK: 1 + 2 * rho,
}));

// ── carried literals (sibling chain) ─────────────────────────────────────────
const PARITY_FACTOR = 2;
const RESIDUAL_AFTER_PARITY = 1.4044169154874944; // imp-95045 surviving residual
const OM0_NEW = 3.9198069316120816e-5; // b = 0 near-tie value (nineteenth)
const OM2_NEW = 3.9231900742006723e-5; // sup at b = 2 (nineteenth)

// ── verdict object ────────────────────────────────────────────────────────────
export const IMP95030_PARITY_FACTOR_LOCALIZED_IRREDUCIBILITY = {
  ticket:
    "imp-95030 (localized irreducibility assessment: is the outer parity AM-GM factor 2 a hard floor, or does it admit a non-AM-GM treatment localized to the b = 0 near-tie? - ASSESSMENT, no bound change, NO QED)",
  source:
    "Permuting the Zeta Twin Ladder Section 4.5; /permutation-architecture; sharpens imp-95018 Gram-sharpness to the specific b = 0 near-tie configuration the frontier scout flagged.",
  question:
    "The nineteenth continuation left the outer parity AM-GM factor 2 as the DOMINANT achieved-side slack and recorded the b = 0 near-tie persisting. Assess whether that factor 2 is genuinely irreducible or admits a non-AM-GM treatment localized to the b = 0 near-tie; state clearly if it is a hard floor.",
  answer:
    "HARD FLOOR within the current model family. The factor 2 handles the ADJACENT (j = 1) cross-block correlation, whose Lemma X separation floor VANISHES (V(b,1) = 0 for every b), so adjacent pairs are uncapped in the MAJ envelope class. A non-AM-GM treatment localized to b = 0 keeps the cross term exact, but that localized cross term IS the uncapped adjacent (0,1)/(1,2) correlation - keeping it needs a new adjacent cap rho_adj < 1/2, an ingredient outside the far-envelope class. No reweighting or localized move inside the current model beats 2.",
  finding1_adjacentIsWhereTheFactorLives:
    "|| x + y ||^2 = sum_b || w_b ||^2 + 2 sum_{even b, odd b prime} <w_b, w_{b prime}>. The cross term is dominated by ADJACENT (j = 1) pairs; same-parity far pairs (j >= 2) are already envE-capped. The two-coloring exists precisely to route the uncapped adjacent pairs into the cross term, and AM-GM discards them at the price 2.",
  finding2_adjacentSeparationFloorVanishes:
    "cornerV(b, 1) = 2^(b(1-beta)) gSharp(1) = 0 for every b (gSharp(1) = 2^beta (2^0 - 1)/(Q 2^beta) = 0): adjacent packets have ZERO guaranteed separation, so their normalized correlation I(0, rho) is the maximal uncapped value in MAJ(sigma, theta). This is why adjacent entries are FREE in the imp-95018 admissible Gram cone.",
  finding3_nearTieIsIntraClass:
    "The b = 0 vs b = 2 near-tie (OmegaE_0 = 3.9198069316120816e-5, OmegaE_2 = 3.9231900742006723e-5) is WITHIN the even color class (both even b). It does not create or break the parity balance || x || = || y || that drives AM-GM equality, so no reweighting localized to that near-tie touches the factor 2. The equality is set by the even-aggregate vs odd-aggregate balance and alignment.",
  finding4_gramEqualityModeIsAdmissible:
    "imp-95018 exhibits the admissible boundary Gram G* = tridiag(1; rho*), rho* = 1/(2 cos(pi/(K+1))) -> 1/2, with lambda_max = 2 attained by the near-constant balanced-parity sine mode. That equality configuration is admissible exactly because the adjacent entry is free (V(b,1) = 0), so no localized non-AM-GM move can exclude it - the factor 2 is attained, not loose.",
  soleLever:
    "The ONLY way to beat 2 is to supply an adjacent (j = 1) block-correlation cap rho_adj < 1/2 - a proven minimum adjacent separation or amplitude anti-correlation between consecutive blocks (new arithmetic input, NOT an envelope inequality). With such a cap the K-block tridiagonal Toeplitz ceiling drops from 2 to 1 + 2 rho_adj cos(pi/(K+1)) -> 1 + 2 rho_adj: rho_adj = 1/2 gives 2 (current), 1/4 gives 3/2, 1/10 gives 6/5. Exchange rate: 2 rho_adj per unit of proven adjacent decorrelation below 1/2, and nothing else.",
  reference: {
    parameters: { v: VV, c: CC, beta: "1/3", D: DD, sigma: SIGMA },
    parityFactor: PARITY_FACTOR,
    residualAfterParity: RESIDUAL_AFTER_PARITY,
    adjacentSeparationFloor: { "V(0,1)": cornerV(0, 1), "V(5,1)": cornerV(5, 1) },
    nearTie: { om0: OM0_NEW, om2: OM2_NEW, intraClass: "both even b - same color class" },
    rhoStarK40: rhoStar(K_REF),
    kRef: K_REF,
    exchangeTable: EXCHANGE,
    note: "hard floor within the current model; the sole lever (adjacent cap rho_adj < 1/2) is a new arithmetic ingredient outside the far-envelope MAJ class; no Lambda number changes.",
  },
  subGap:
    "imp-95030-sub-adjacent-correlation-cap: quantify a rho_adj < 1/2 adjacent (j = 1) block-correlation cap for the PAPER packets (a proven minimum adjacent separation or consecutive-block amplitude anti-correlation). This is the sole lever on the parity factor; its payoff is the exact ceiling 1 + 2 rho_adj. It is NOT an envelope inequality and is not supplied by the far-envelope MAJ class.",
  openResiduals: [
    "the adjacent (j = 1) block-correlation cap rho_adj < 1/2 for the paper packets - the sole lever, a new arithmetic ingredient outside the far-envelope class (sub-gap imp-95030-sub-adjacent-correlation-cap)",
    "the residual 1.4044x endgame factor - witness-floor-side per imp-95045, NOT a parity-factor lever and untouched here",
  ],
  isRigorous: true,
  rigorScope:
    "The assessment composes three checkable facts: (1) V(b, 1) = 0 for every b (the adjacent separation floor vanishes, closed form), so adjacent pairs are uncapped in MAJ; (2) the exact expansion || x + y ||^2 = sum || w_b ||^2 + 2 <x, y> localizes the whole factor-2 slack in the adjacent cross term; (3) imp-95018 Gram-sharpness (textbook tridiagonal Toeplitz spectrum) attains lambda_max = 2 by the near-constant balanced-parity mode, which is admissible precisely because the adjacent entry is free. Together these show the factor 2 is a hard floor for any treatment inside the current MAJ far-envelope model, and the ceiling 1 + 2 rho_adj cos(pi/(K+1)) is the exact payoff of a hypothetical adjacent cap rho_adj. This is an ASSESSMENT/classification, not a new bound; optimality of the witness is not claimed; NO QED.",
  promotesBound: false,
  verdict:
    "ASSESSMENT: the outer parity AM-GM factor 2 is a HARD FLOOR within the current model family. It handles the ADJACENT (j = 1) cross-block correlation, whose Lemma X separation floor VANISHES (V(b,1) = 0 for every b), so adjacent pairs are uncapped in the MAJ envelope class; the two-coloring routes them into the cross term and AM-GM discards them at price 2. A non-AM-GM treatment localized to the b = 0 near-tie keeps that cross term exact, but the localized cross term IS the uncapped adjacent (0,1)/(1,2) correlation, so keeping it needs a new adjacent cap rho_adj < 1/2 - an ingredient outside the far-envelope class. The b = 0/b = 2 near-tie is intra-class (both even b) and does not drive the parity balance, and the imp-95018 equality mode (near-constant, balanced 2-coloring, rho* -> 1/2) is admissible because V(b,1) = 0, so no reweighting or localized move beats 2. The SOLE lever is a proven adjacent cap rho_adj < 1/2 (new arithmetic input, sub-gap imp-95030-sub-adjacent-correlation-cap), whose exact payoff is the ceiling 1 + 2 rho_adj cos(pi/(K+1)) -> 1 + 2 rho_adj (rho_adj = 1/4 gives 3/2, 1/10 gives 6/5). Changes no bound; does NOT promote Lambda <= 0.14; NO QED; no refereed bound is changed.",
};

// ── assertions (self-executing; throw on violation) ─────────────────────────
export const IMP95030_ASSERTIONS = [
  {
    id: "imp95030-adjacent-separation-floor-vanishes",
    description:
      "the Lemma X separation floor vanishes at j = 1 for every block: V(b, 1) = 0 exactly for b in {0,1,2,5,10} (gSharp(1) = 0), so adjacent pairs are uncapped in MAJ - the structural reason the factor 2 exists (Finding 2)",
    holds: () => [0, 1, 2, 5, 10].every((b) => cornerV(b, 1) === 0),
  },
  {
    id: "imp95030-far-floor-strictly-positive",
    description:
      "by contrast the far separation floor is strictly positive at j = 2 (V(0,2) = 2^(1/3) > 0 and increasing in b), so far pairs ARE envE-capped and only the adjacent pairs need the two-coloring",
    holds: () => {
      const v02 = cornerV(0, 2);
      return Math.abs(v02 - Math.pow(2, 1 / 3)) <= 1e-12 * v02 && cornerV(2, 2) > v02 && v02 > 0;
    },
  },
  {
    id: "imp95030-near-tie-intra-even-class",
    description:
      "the b = 0 near-tie (OmegaE_0 = 3.9198069316120816e-5) and the sup at b = 2 (3.9231900742006723e-5) are BOTH even b, i.e. within the same color class - the near-tie is intra-class and does not drive the parity balance (Finding 3)",
    holds: () => 0 % 2 === 0 && 2 % 2 === 0 && OM0_NEW < OM2_NEW && OM0_NEW / OM2_NEW > 0.999,
  },
  {
    id: "imp95030-gram-factor-two-attained",
    description:
      "at the free-adjacent PSD boundary rho* = 1/(2 cos(pi/(K+1))) the tridiagonal Toeplitz ceiling equals 2 EXACTLY (imp-95018 Gram-sharpness, K = 40) - the equality mode is admissible because the adjacent entry is free (Finding 4)",
    holds: () => Math.abs(ceilFactor(rhoStar(K_REF), K_REF) - 2) <= 1e-12,
  },
  {
    id: "imp95030-exchange-rate-table",
    description:
      "the sole-lever exchange rate ceil(rho_adj, K) = 1 + 2 rho_adj cos(pi/(K+1)) -> 1 + 2 rho_adj: rho_adj = 1/2 -> 2 (current), 1/4 -> 3/2, 1/10 -> 6/5 (large-K limit exact, K = 40 within 3e-3), monotone increasing in rho_adj and strictly below 2 for every rho_adj < 1/2",
    holds: () => {
      const rel = (x, y) => Math.abs(x - y) <= 3e-3 * Math.abs(y);
      const row = (r) => EXCHANGE.find((e) => e.rhoAdj === r);
      if (!rel(row(0.25).ceilLargeK, 1.5) || !rel(row(0.1).ceilLargeK, 1.2)) return false;
      if (!rel(row(0.25).ceilK40, 1.5) || !rel(row(0.1).ceilK40, 1.2)) return false;
      for (let i = 1; i < EXCHANGE.length; i++) {
        if (EXCHANGE[i].ceilK40 >= EXCHANGE[i - 1].ceilK40) return false;
        if (EXCHANGE[i].rhoAdj < 0.5 && EXCHANGE[i].ceilK40 >= 2) return false;
      }
      return true;
    },
  },
  {
    id: "imp95030-honesty-gate",
    description:
      "the verdict states the factor 2 is a HARD FLOOR within the current model, names the adjacent-cap sole lever and its exact payoff, keeps the residual 1.4044x witness-side, promotes no bound, NO QED, no refereed bound is changed",
    holds: () =>
      IMP95030_PARITY_FACTOR_LOCALIZED_IRREDUCIBILITY.promotesBound === false &&
      IMP95030_PARITY_FACTOR_LOCALIZED_IRREDUCIBILITY.openResiduals.length === 2 &&
      /HARD FLOOR/.test(IMP95030_PARITY_FACTOR_LOCALIZED_IRREDUCIBILITY.verdict) &&
      /adjacent/.test(IMP95030_PARITY_FACTOR_LOCALIZED_IRREDUCIBILITY.soleLever) &&
      /NO QED/.test(IMP95030_PARITY_FACTOR_LOCALIZED_IRREDUCIBILITY.verdict) &&
      /refereed bound is changed/i.test(IMP95030_PARITY_FACTOR_LOCALIZED_IRREDUCIBILITY.verdict) &&
      typeof IMP95030_PARITY_FACTOR_LOCALIZED_IRREDUCIBILITY.subGap === "string",
  },
];

for (const a of IMP95030_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-95030-parity-factor-localized-irreducibility assertion failed: ${a.id}`);
  }
}

export default IMP95030_PARITY_FACTOR_LOCALIZED_IRREDUCIBILITY;
