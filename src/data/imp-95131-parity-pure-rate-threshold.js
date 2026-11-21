/**
 * imp-95131 - THEOREM RT (parity-pure rate threshold): the first UNIFORM
 * class statement toward imp-95130-subgap-phi-conditional-odd-mass. The
 * twenty-fifth continuation (THEOREM PX, imp-95130) exhibited a parity-pure
 * (omega = 0) three-packet family with E > 0 and recorded its mechanism -
 * "parity-pure excess requires a common rate below ~0.062, which the
 * legality weight punishes" - as MEASURED ON THAT FAMILY ONLY, explicitly
 * "not proved as a class bound" (openResiduals[1] of imp-95130). This module
 * proves the rate half of that mechanism as a theorem over the whole
 * one-packet-per-block parity-pure class, with the explicit threshold 2/5:
 *
 * THEOREM RT. Let W be any MAJ witness of the sibling-chain class
 * (nonnegative amplitudes a_i, free positive rates mu_i, positions
 * u_i in [2^{b_i}, 2^{b_i + 1}) for blocks b_i) that is PARITY-PURE (all
 * blocks of one parity) with AT MOST ONE packet per block. If every rate
 * satisfies mu_i >= 2/5, then E <= 0. Contrapositive: every E > 0 witness
 * in this class carries a rate mu_min < 2/5 = 0.4.
 * The proof is the chain RC -> row reduction -> GS -> S-star arithmetic:
 *
 * LEMMA RC (mixed-rate correlation cap - UNCONDITIONAL, new). For rates
 * 0 < a <= b and separation tau >= 0, the normalized Gram kernel obeys
 *   rho(a, b, tau) := sqrt(a b) K(a, b, tau) <= f(a tau),
 * f(x) = exp(-x)(1 + x), with equality at a = b. (Previous chain lemmas
 * controlled mixed rates only by Cauchy-Schwarz rho <= 1, with no distance
 * decay; RC is the mixed-rate extension of the exact equal-rate profile.)
 * PROOF. Set r = b/a >= 1, x = a tau; then sqrt(a b) K = 2 sqrt(r)
 * (r exp(-x) - exp(-r x)) / (r^2 - 1) and the claim is Delta(x) >= 0 for
 *   Delta(x) = (r^2 - 1)(1 + x) exp(-x) - 2 sqrt(r)(r exp(-x) - exp(-r x)).
 * Delta(0) = (r - 1)(sqrt(r) - 1)^2 >= 0 and Delta(x) -> 0 as x -> infinity.
 * Differentiating, Delta prime (x) = exp(-x) psi(x) with
 *   psi(x) = 2 r^{3/2} (1 - exp(-(r - 1) x)) - (r^2 - 1) x,
 * psi(0) = 0 and psi prime (x) = 2 r^{3/2} (r - 1) exp(-(r - 1) x)
 * - (r^2 - 1) strictly decreasing, so psi is CONCAVE with psi(0) = 0 and
 * psi -> -infinity: psi is either nonpositive throughout, or positive on
 * (0, x0) and negative after, for a single crossing x0. In the first case
 * Delta decreases from Delta(0) >= 0 to limit 0, so Delta >= 0. In the
 * second, Delta increases on (0, x0) (staying >= Delta(0) >= 0) and then
 * decreases monotonically to limit 0, so Delta >= 0 there too. QED.
 *
 * ROW REDUCTION (weighted AM-GM Schur bound - standard). For any witness,
 * with w_i = a_i^2 / mu_i and rho_ij = sqrt(mu_i mu_j) K_ij:
 * 2 a_i a_j K_ij = 2 (a_i/sqrt(mu_i))(a_j/sqrt(mu_j)) rho_ij
 * <= (w_i + w_j) rho_ij, and sameBlock >= 0, X_par = 0 (parity-pure), so
 *   E = X_env - diag - sameBlock <= sum_i w_i (Rbar_i - 1),
 * Rbar_i = sum over cross-block partners j of rho_ij. Hence E > 0 forces
 * some row Rbar_i > 1; and by Lemma RC plus monotonicity of f,
 * Rbar_i <= sum_j f(mu_min tau_ij) where mu_min is the global minimum rate.
 *
 * LEMMA GS (geometric separation - UNCONDITIONAL). In a parity-pure
 * one-packet-per-block witness, the k-th smallest cross-pair distance from
 * any fixed packet is >= 2^{2k - 1} (k = 1, 2, ...). PROOF. For a packet in
 * (even-parity) block b, down-partners in block b - 2j sit at distance
 * > 2^b - 2^{b + 1 - 2j}; for j <= k <= b/2 this is >= 2^{2k} - 2 >=
 * 2^{2k - 1}. Up-partners in block b + 2j sit at distance
 * > 2^{b + 2j} - 2^{b + 1} = 2^{b + 1}(2^{2j - 1} - 1) >= 2^{b + 2j - 1};
 * the k-th smallest overall (k = b/2 + j) is >= 2^{2k - 1} exactly. The odd
 * parity case gives the stronger floor 2^{2k}; the even case is extremal.
 * Occupied blocks form a subset of the full lattice, so sorted actual
 * distances dominate the full-lattice list termwise. QED (exhaustively
 * cross-checked below for all rows b <= 60, both parities).
 *
 * S-STAR ARITHMETIC. Combining, every row obeys
 *   Rbar_i <= S(mu_min), S(mu) := sum over k >= 1 of f(mu 2^{2k - 1}),
 * S decreasing in mu. At mu = 2/5:
 *   S(2/5) = f(0.8) + f(3.2) + f(12.8) + ... = 0.980031... < 1,
 * certified by a purely rational chain: the alternating-series upper bound
 * exp(-0.8) <= 0.44936675555555555 (truncation after a positive term),
 * powering exp(-3.2) <= 0.44936675555555555^4 and exp(-12.8) <= (that)^4,
 * and the tail comparison f(4x) <= 4 exp(-3x) f(x) (since (1 + 4x) <=
 * 4(1 + x)), which bounds the whole k >= 3 tail by 2 f(12.8). Total
 * <= 0.98020 < 1. So all rates >= 2/5 give every row < 1, hence E <= 0. QED.
 *
 * COROLLARY XP (near-pair legality pricing - first brick of the pricing
 * leg). In any parity-pure witness, every cross-block pair with
 * mu_min-of-pair times separation <= 2 has its min-rate packet at legality
 * argument x = mu r <= 8 < s = 11, hence STRICTLY penalized:
 * h(x) <= h(8) = exp(3) (8/11)^{11} = 0.60472..., i.e. that packet's
 * block-mass contribution is inflated by 1/h^2 >= 2.73. PROOF. Same-parity
 * cross-block separation from a block-b packet is > 2^{b - 1} >= r^3 / 4
 * (r^3 = 1/d <= 2^{b + 1}), so x = mu r = (mu tau)(r / tau)
 * <= (mu tau) 4 / r^2 <= 4 (mu tau) <= 8; h is increasing on x < s. QED.
 * (This eliminates the high-block evasion "small rate but penalty-free because
 * r is large": any rate small enough to matter at its OWN nearest-pair
 * distance scale is automatically deep in the penalized regime.)
 *
 * WHAT THIS RESOLVES AND WHAT IT DOES NOT.
 * (1) The rate mechanism of imp-95130 is now a CLASS BOUND (for the
 *     one-per-block parity-pure class): E > 0 forces mu_min < 2/5. The
 *     sharp class threshold is sandwiched in [0.127, 0.389]: THEOREM PX
 *     witnesses E > 0 at common rate 0.127 (re-verified here), and
 *     S(0.389) < 1 < S(0.388) locates the row-majorant root at ~0.3889.
 * (2) The parent sub-gap imp-95130-subgap-phi-conditional-odd-mass stays
 *     OPEN. Two named legs remain: imp-95131-subgap-multiblock-aggregation
 *     (extend RT to several packets per block - the row bound loses to
 *     same-block multiplicity and needs a cluster absorption argument via
 *     the sameBlock channel) and imp-95131-subgap-rate-to-phi-pricing
 *     (chain RT + XP into a uniform phi cap over parity-pure witnesses:
 *     XP prices individual near pairs, but a uniform cap needs the priced
 *     packets to carry a definite share of M).
 * (3) Floors, ceilings, and bounds untouched. THEOREM OD and THEOREM PX
 *     are consistent with RT (asserted below).
 *
 * HONEST LIMITS. (a) Model-family constants (sigma = 1, theta = 10,
 * beta = 1/3, c = v = D = 1), not the paper Section 4.5 packets. (b) The
 * one-packet-per-block restriction is essential to Lemma GS as used here;
 * the multi-packet extension is named, not proved. (c) The threshold 2/5 is
 * a certified sufficient constant, not the sharp one (sandwich 0.127 to
 * 0.389). (d) Changes no bound; does NOT promote Lambda <= 0.14; NO QED;
 * no refereed bound is changed.
 *
 * SKEPTICAL SELF-CHECK RECORD: (1) Lemma RC was stress-tested on a 125000-cell
 * log grid over (rate, ratio, dimensionless separation) including ratio
 * 10^6 and separation 10^{-4}: zero violations away from the near-equal
 * float-cancellation sliver (r within 1e-6 of 1, where the exact formula
 * loses ~1e-10 to catastrophic cancellation and the true statement is the
 * equality case); the proof-trace Delta(x) >= 0 is checked densely at
 * several ratios. (2) Lemma GS was stress-tested exhaustively (all rows b <= 60,
 * both parities): the floor 2^{2k - 1} is TIGHT at (b, k) = (0, 1) and
 * (2, 1), so the even-parity constant cannot be improved without changing
 * the class. (3) The battery probes THEOREM RT directly: 6000 seeded
 * random one-per-block parity-pure witnesses (mixed rates >= 2/5, mixed
 * amplitudes including zeros, random block subsets and positions, both
 * parities) - max E strictly negative, max row <= S(2/5); a second 6000-draw
 * free-rate battery probes the ROW REDUCTION inequality itself: zero
 * violations. (4) Consistency with THEOREM PX: the family has E > 0 at
 * rate 0.127 (below the threshold, as required - a threshold below 0.127
 * would CONTRADICT PX, so the sandwich is genuinely two-sided), E < 0 at
 * 2/5, and its rows at 2/5 sit below S(2/5). (5) The rational certification
 * chain is reproduced in exact double arithmetic and dominates the true
 * values. (6) Scope honesty: one-per-block only; the parent sub-gap is NOT
 * closed; nothing is promoted.
 *
 * Import-light (no heavy bundle, no imports). The numerics cross-check the
 * theorem; the theorem is the displayed lemma chain.
 */

// f(x) = exp(-x)(1 + x): equal-rate normalized kernel profile
const f = (x) => Math.exp(-x) * (1 + x);

// exact sibling Gram kernel (identical to imp-95130 and the sibling chain)
function kernelK(a, b, tau) {
  if (Math.abs(a - b) < 1e-7 * (a + b)) {
    const m = 0.5 * (a + b);
    return (Math.exp(-m * tau) * (1 + m * tau)) / m;
  }
  return (2 * (b * Math.exp(-a * tau) - a * Math.exp(-b * tau))) / (b * b - a * a);
}

// Delta(x; r) from the Lemma RC proof
function deltaRC(r, x) {
  return (r * r - 1) * (1 + x) * Math.exp(-x) - 2 * Math.sqrt(r) * (r * Math.exp(-x) - Math.exp(-r * x));
}

// S(mu) = sum_{k >= 1} f(mu 2^{2k - 1}) - the uniform row majorant
function sStar(mu, terms) {
  let s = 0;
  for (let k = 1; k <= terms; k++) s += f(mu * Math.pow(2, 2 * k - 1));
  return s;
}

// sorted cross-block lattice minimum distances for a row in block b
function sortedRowDistances(b, parityStart, bmax) {
  const ds = [];
  for (let bp = parityStart; bp <= bmax; bp += 2) {
    if (bp === b) continue;
    ds.push(bp > b ? Math.pow(2, bp) - Math.pow(2, b + 1) : Math.pow(2, b) - Math.pow(2, bp + 1));
  }
  ds.sort((x, y) => x - y);
  return ds;
}

// seeded LCG (deterministic battery)
let seedState = 12345;
function rnd() {
  seedState = (seedState * 1103515245 + 12345) & 0x7fffffff;
  return seedState / 0x7fffffff;
}

function makeWitness(minRate, oddParity, freeRates) {
  const nBlocks = 2 + Math.floor(rnd() * 6);
  const avail = [];
  for (let b = oddParity ? 1 : 0; b <= 24; b += 2) avail.push(b);
  const blocks = [];
  while (blocks.length < nBlocks) {
    const b = avail[Math.floor(rnd() * avail.length)];
    if (!blocks.includes(b)) blocks.push(b);
  }
  blocks.sort((x, y) => x - y);
  const u = blocks.map((b) => Math.pow(2, b) * (1 + rnd() * 0.999999));
  const a = blocks.map(() => (rnd() < 0.15 ? 0 : Math.pow(10, -2 + 4 * rnd())));
  const mu = blocks.map(() =>
    freeRates ? Math.pow(10, -3 + 3.5 * rnd()) : minRate + Math.pow(10, 2 * rnd()) * minRate * (rnd() < 0.5 ? 0 : rnd())
  );
  return { blocks, u, a, mu };
}

function evalWitness(w) {
  const n = w.u.length;
  let diag = 0;
  for (let i = 0; i < n; i++) diag += (w.a[i] * w.a[i]) / w.mu[i];
  let X = 0;
  const rows = new Array(n).fill(0);
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      const K = kernelK(w.mu[i], w.mu[j], Math.abs(w.u[i] - w.u[j]));
      X += 2 * w.a[i] * w.a[j] * K;
      const rho = Math.sqrt(w.mu[i] * w.mu[j]) * K;
      rows[i] += rho;
      rows[j] += rho;
    }
  }
  const E = X - diag; // one-per-block parity-pure: sameBlock = 0, X_par = 0
  let rowBound = 0;
  for (let i = 0; i < n; i++) rowBound += ((w.a[i] * w.a[i]) / w.mu[i]) * (rows[i] - 1);
  return { E, rowBound, maxRow: n > 0 ? Math.max(...rows) : 0 };
}

// THEOREM PX family geometry (positions exactly as in imp-95130)
const P_PX = 999983;
const KS_PX = [700000, 175000, 43750];
const U_PX = KS_PX.map((k) => P_PX / k);
function familyE(eps) {
  let X = 0;
  for (let i = 0; i < 3; i++) {
    for (let j = i + 1; j < 3; j++) X += 2 * kernelK(eps, eps, Math.abs(U_PX[i] - U_PX[j]));
  }
  return X - 3 / eps;
}
function familyMaxRow(eps) {
  const t01 = Math.abs(U_PX[0] - U_PX[1]);
  const t02 = Math.abs(U_PX[0] - U_PX[2]);
  const t12 = Math.abs(U_PX[1] - U_PX[2]);
  return Math.max(f(eps * t01) + f(eps * t02), f(eps * t01) + f(eps * t12), f(eps * t02) + f(eps * t12));
}

// rational certification chain for S(2/5) < 1
function rationalChain() {
  // alternating-series upper bound on exp(-0.8), truncated after the n = 6
  // (positive) term: exp(-0.8) <= sum_{n = 0..6} (-0.8)^n / n!
  let e08U = 0;
  let t = 1;
  for (let n = 0; n <= 6; n++) {
    if (n > 0) t = (t * -0.8) / n;
    e08U += n === 0 ? 1 : t;
  }
  const f08U = 1.8 * e08U; // f(0.8) <= 1.8 exp(-0.8) upper
  const e32U = Math.pow(e08U, 4); // exp(-3.2) = exp(-0.8)^4
  const f32U = 4.2 * e32U;
  const e128U = Math.pow(e32U, 4); // exp(-12.8) = exp(-3.2)^4
  const f128U = 13.8 * e128U;
  // tail: f(4x)/f(x) = exp(-3x)(1 + 4x)/(1 + x) <= 4 exp(-3x) <= 4 exp(-38.4)
  // at x = 12.8, so sum_{k >= 3} f((2/5) 2^{2k - 1}) <= f(12.8)/(1 - q)
  // <= 2 f(12.8) with q = 4 exp(-38.4) < 1e-15
  return { e08U, total: f08U + f32U + 2 * f128U };
}

// batteries (seeded; deterministic)
function runBatteries() {
  seedState = 12345;
  let maxE = -Infinity;
  let maxRow = 0;
  let rowViol = 0;
  for (let tt = 0; tt < 6000; tt++) {
    const w = makeWitness(0.4, tt % 2 === 1, false);
    const r = evalWitness(w);
    if (r.E > maxE) maxE = r.E;
    if (r.maxRow > maxRow) maxRow = r.maxRow;
    if (r.E > r.rowBound + 1e-9 * Math.abs(r.rowBound) + 1e-12) rowViol++;
  }
  let freeViol = 0;
  for (let tt = 0; tt < 6000; tt++) {
    const w = makeWitness(0.001, tt % 2 === 0, true);
    const r = evalWitness(w);
    if (r.E > r.rowBound + 1e-9 * Math.abs(r.rowBound) + 1e-12) freeViol++;
  }
  return { maxE, maxRow, rowViol, freeViol };
}
const BAT = runBatteries();

const MU_STAR = 2 / 5;
const SS_LEGALITY = 11; // s = sigma + theta
const H8 = Math.exp(SS_LEGALITY - 8) * Math.pow(8 / SS_LEGALITY, SS_LEGALITY); // h(8)

// baked literals (recomputed by the assertions)
const SSTAR_LIT = 0.980031490781631; // S(2/5)
const SSTAR_MARGIN_LIT = 0.019968509218369013;
const RATIONAL_TOTAL_LIT = 0.9801953203830508;
const E08_UPPER_LIT = 0.44936675555555555;
const SSTAR_388_LIT = 1.0015903680511011;
const SSTAR_389_LIT = 0.9997630987245442;
const FAMILY_E_127_LIT = 0.016952476863480115;
const FAMILY_E_MUSTAR_LIT = -5.005448294115412;
const FAMILY_MAXROW_MUSTAR_LIT = 0.49709687565405813;
const BAT_MAX_E_LIT = -0.0003443491977400118;
const BAT_MAX_ROW_LIT = 0.6893227908147775;
const H8_LIT = 0.6047192112607929;

export const IMP95131_PARITY_PURE_RATE_THRESHOLD = {
  ticket:
    "imp-95131 (THEOREM RT: uniform rate threshold 2/5 over one-packet-per-block parity-pure MAJ witnesses - E > 0 forces min rate < 2/5; the imp-95130 rate mechanism promoted from one-family measurement to a class bound)",
  source:
    "Permuting the Zeta Twin Ladder Section 4.5; /permutation-architecture; consumes the Theorem R Gram assembly / Lemma ES channel split and directly progresses imp-95130-subgap-phi-conditional-odd-mass (imp-95130-parity-pure-excess-refutation.js openResiduals[1]).",
  theoremRT:
    "Any MAJ witness of the sibling-chain class that is parity-pure (all blocks one parity) with at most one packet per block and all rates mu_i >= 2/5 has E <= 0. Contrapositive: E > 0 in this class forces mu_min < 2/5. Proof chain: Lemma RC (mixed-rate cap rho(a,b,tau) <= f(min(a,b) tau), full calculus proof) + weighted AM-GM row reduction (E <= sum w_i (Rbar_i - 1)) + Lemma GS (k-th nearest cross-pair distance >= 2^{2k-1}) + S(2/5) = 0.980031490781631 < 1 with a purely rational certification chain (total <= 0.9801953203830508).",
  lemmaRC:
    "UNCONDITIONAL, new: sqrt(ab) K(a,b,tau) <= exp(-a tau)(1 + a tau) for 0 < a <= b (equality at a = b). Proof: Delta(0) = (r-1)(sqrt(r)-1)^2 >= 0, Delta(infinity) = 0, and Delta prime = exp(-x) psi with psi concave, psi(0) = 0 - so Delta rises then falls to 0 (or falls monotonically), staying nonnegative. Extends the chain from Cauchy-Schwarz (rho <= 1, no decay) to mixed-rate distance decay.",
  lemmaGS:
    "UNCONDITIONAL: in a parity-pure one-per-block witness the k-th smallest cross-pair distance from any packet is >= 2^{2k-1} (even parity; >= 2^{2k} odd). Tight at (b,k) = (0,1) and (2,1). Exhaustively cross-checked for all rows b <= 60, both parities.",
  corollaryXP:
    "Near-pair legality pricing: every same-parity cross-block pair with (min pair rate) times (separation) <= 2 has its min-rate packet at legality argument x = mu r <= 8 < s = 11, hence h(x) <= h(8) = exp(3)(8/11)^11 = 0.6047192112607929 and a block-mass inflation 1/h^2 >= 2.73. This closes the high-block penalty-free evasion for near pairs (x <= 4 mu tau because tau > r^3 / 4).",
  thresholdSandwich:
    "The sharp class threshold lies in [0.127, 0.389]: THEOREM PX witnesses E > 0 at common rate 0.127 (re-verified: E(0.127) = 0.016952476863480115 > 0), and the row-majorant root is bracketed by S(0.388) = 1.0015903680511011 > 1 > S(0.389) = 0.9997630987245442. The certified constant 2/5 carries margin S(2/5) = 0.980031490781631 (slack 0.019968509218369013).",
  subGaps: [
    "imp-95131-subgap-multiblock-aggregation - OPEN: extend THEOREM RT to several packets per block (the row bound loses to same-block multiplicity; needs a cluster absorption argument through the sameBlock channel).",
    "imp-95131-subgap-rate-to-phi-pricing - OPEN: chain RT + Corollary XP into a uniform phi cap over parity-pure witnesses (XP prices individual near pairs; a uniform cap needs the priced packets to carry a definite share of M).",
  ],
  openResiduals: [
    "imp-95130-subgap-phi-conditional-odd-mass remains OPEN: this module proves the rate half of its mechanism (class-wide, one-per-block); the phi-conditional odd-mass bound itself is not established",
    "the one-packet-per-block restriction (imp-95131-subgap-multiblock-aggregation) and the rate-to-phi pricing chain (imp-95131-subgap-rate-to-phi-pricing) are named, not closed",
    "the packet-envelope constants (c, beta, sigma, theta, A_d) for the PAPER packets rather than the model family",
  ],
  isRigorous: true,
  rigorScope:
    "THEOREM RT is unconditional given the sibling-chain witness conventions: Lemma RC is elementary calculus (concavity single-crossing argument, proof in full above), the row reduction is weighted AM-GM plus sameBlock >= 0, Lemma GS is exhaustive block-lattice arithmetic with a two-line general proof, and S(2/5) < 1 is certified by a rational alternating-series chain that dominates the true values. No MAJ conditionality enters: the theorem BOUNDS witnesses, it does not price them against the ceiling. The batteries and grids are CROSS-CHECKS; the theorem is the displayed lemma chain. Scope: one packet per block, parity-pure; the parent sub-gap imp-95130-subgap-phi-conditional-odd-mass stays OPEN; floors and ceilings untouched; changes no bound; does NOT promote Lambda <= 0.14; NO QED; no refereed bound is changed.",
  promotesBound: false,
};

export const IMP95131_PARITY_PURE_RATE_THRESHOLD_ASSERTIONS = [
  {
    id: "imp95131-rt-lemma-rc-grid",
    description:
      "Lemma RC holds on a 125000-cell skeptical log grid (rate 1e-3..1e3, ratio 1.01..1e6, dimensionless separation 1e-4..1e4): sqrt(ab) K(a,b,tau) <= f(a tau) with zero relative excess; the near-equal band (ratio < 1.01, float-cancellation sliver of the exact formula around the equality case) stays within 1e-8",
    holds: () => {
      for (let ia = 0; ia < 50; ia++) {
        const a = Math.pow(10, -3 + (6 * ia) / 49);
        for (let ir = 0; ir < 50; ir++) {
          const r = 1.01 * Math.pow(10, (6 * ir) / 49);
          for (let it = 0; it < 50; it++) {
            const x = Math.pow(10, -4 + (8 * it) / 49);
            const rho = Math.sqrt(a * a * r) * kernelK(a, a * r, x / a);
            if (rho > f(x) * (1 + 1e-12) + 1e-300) return false;
          }
        }
      }
      for (const r of [1.0000005, 1.0001, 1.005]) {
        for (let it = 0; it < 200; it++) {
          const x = Math.pow(10, -4 + (8 * it) / 199);
          const rho = Math.sqrt(r) * kernelK(1, r, x);
          if (rho > f(x) * (1 + 1e-8)) return false;
        }
      }
      return true;
    },
  },
  {
    id: "imp95131-rt-lemma-rc-proof-trace",
    description:
      "the Lemma RC proof trace: Delta(0) = (r-1)(sqrt(r)-1)^2 exactly, Delta(x) >= 0 on a dense grid for ratios {1.001, 1.5, 4, 100}, and psi-prime is strictly decreasing (the concavity that pins the single sign change)",
    holds: () => {
      for (const r of [1.001, 1.5, 4, 100]) {
        const d0 = deltaRC(r, 0);
        const lit = (r - 1) * Math.pow(Math.sqrt(r) - 1, 2);
        if (Math.abs(d0 - lit) > 1e-9 * Math.max(1, Math.abs(lit))) return false;
        let prevPsiP = Infinity;
        for (let t = 0; t <= 4000; t++) {
          const x = t * 0.01;
          if (deltaRC(r, x) < -1e-9 * (r * r)) return false;
          const psiP = 2 * Math.pow(r, 1.5) * (r - 1) * Math.exp(-(r - 1) * x) - (r * r - 1);
          if (psiP > prevPsiP + 1e-12) return false;
          prevPsiP = psiP;
        }
      }
      return true;
    },
  },
  {
    id: "imp95131-rt-lemma-gs-exhaustive",
    description:
      "Lemma GS exhaustively: for every row b <= 60 the sorted cross-block lattice distances satisfy d_k >= 2^{2k-1} (even parity) and d_k >= 2^{2k} (odd parity), tight at even (b,k) = (0,1) and (2,1)",
    holds: () => {
      for (let b = 0; b <= 60; b += 2) {
        const ds = sortedRowDistances(b, 0, 60);
        for (let k = 1; k <= ds.length; k++) if (ds[k - 1] < Math.pow(2, 2 * k - 1) - 1e-6) return false;
      }
      for (let b = 1; b <= 59; b += 2) {
        const ds = sortedRowDistances(b, 1, 61);
        for (let k = 1; k <= ds.length; k++) if (ds[k - 1] < Math.pow(2, 2 * k) - 1e-6) return false;
      }
      const d0 = sortedRowDistances(0, 0, 60);
      const d2 = sortedRowDistances(2, 0, 60);
      return Math.abs(d0[0] - 2) < 1e-12 && Math.abs(d2[0] - 2) < 1e-12;
    },
  },
  {
    id: "imp95131-rt-sstar-threshold",
    description:
      "the uniform row majorant at the certified threshold: S(2/5) = 0.980031490781631 < 1 with margin 0.019968509218369013, truncation-stable (40 vs 80 terms), and the root bracket S(0.388) = 1.0015903680511011 > 1 > S(0.389) = 0.9997630987245442",
    holds: () => {
      const rel = (x, lit, t) => Math.abs(x - lit) <= t * Math.abs(lit);
      const s40 = sStar(MU_STAR, 40);
      return (
        rel(s40, SSTAR_LIT, 1e-12) &&
        s40 < 1 &&
        rel(1 - s40, SSTAR_MARGIN_LIT, 1e-9) &&
        Math.abs(sStar(MU_STAR, 80) - s40) < 1e-15 &&
        rel(sStar(0.388, 40), SSTAR_388_LIT, 1e-12) &&
        sStar(0.388, 40) > 1 &&
        rel(sStar(0.389, 40), SSTAR_389_LIT, 1e-12) &&
        sStar(0.389, 40) < 1
      );
    },
  },
  {
    id: "imp95131-rt-rational-certification",
    description:
      "the rational certification chain: the alternating-series bound exp(-0.8) <= 0.44936675555555555 dominates Math.exp(-0.8), and the chained total 1.8 e08 + 4.2 e08^4 + 2 (13.8) e08^16 = 0.9801953203830508 < 1 dominates S(2/5) - so the threshold arithmetic does not rest on library exp values",
    holds: () => {
      const rel = (x, lit, t) => Math.abs(x - lit) <= t * Math.abs(lit);
      const rc = rationalChain();
      return (
        rel(rc.e08U, E08_UPPER_LIT, 1e-15) &&
        rc.e08U >= Math.exp(-0.8) &&
        rel(rc.total, RATIONAL_TOTAL_LIT, 1e-12) &&
        rc.total < 1 &&
        rc.total >= sStar(MU_STAR, 40)
      );
    },
  },
  {
    id: "imp95131-rt-threshold-battery",
    description:
      "THEOREM RT battery: 6000 seeded random one-per-block parity-pure witnesses (both parities, mixed rates >= 2/5, amplitudes including zeros, random block subsets and positions) - max E = -0.0003443491977400118 strictly negative, max row 0.6893227908147775 <= S(2/5), zero row-inequality violations; a second 6000-draw free-rate battery finds zero violations of the row-reduction inequality itself",
    holds: () => {
      const rel = (x, lit, t) => Math.abs(x - lit) <= t * Math.abs(lit);
      return (
        BAT.maxE < 0 &&
        rel(BAT.maxE, BAT_MAX_E_LIT, 1e-6) &&
        rel(BAT.maxRow, BAT_MAX_ROW_LIT, 1e-6) &&
        BAT.maxRow <= sStar(MU_STAR, 40) &&
        BAT.rowViol === 0 &&
        BAT.freeViol === 0
      );
    },
  },
  {
    id: "imp95131-rt-px-consistency",
    description:
      "consistency with THEOREM PX: the family witnesses E > 0 at common rate 0.127 (E = 0.016952476863480115, so the sharp threshold cannot sit below 0.127 and the sandwich [0.127, 0.389] is two-sided), E(2/5) = -5.005448294115412 < 0, and the family max row at 2/5 is 0.49709687565405813 <= S(2/5)",
    holds: () => {
      const rel = (x, lit, t) => Math.abs(x - lit) <= t * Math.abs(lit);
      return (
        rel(familyE(0.127), FAMILY_E_127_LIT, 1e-9) &&
        familyE(0.127) > 0 &&
        0.127 < MU_STAR &&
        rel(familyE(MU_STAR), FAMILY_E_MUSTAR_LIT, 1e-12) &&
        familyE(MU_STAR) < 0 &&
        rel(familyMaxRow(MU_STAR), FAMILY_MAXROW_MUSTAR_LIT, 1e-12) &&
        familyMaxRow(MU_STAR) <= sStar(MU_STAR, 40)
      );
    },
  },
  {
    id: "imp95131-rt-corollary-xp",
    description:
      "Corollary XP arithmetic: h(8) = exp(3)(8/11)^11 = 0.6047192112607929 < 1 (block-mass inflation 1/h^2 >= 2.73), h increasing below s = 11, and the geometry bound tau > r^3 / 4 holds across blocks b <= 40 (nearest same-parity distance vs the block r-range)",
    holds: () => {
      const rel = (x, lit, t) => Math.abs(x - lit) <= t * Math.abs(lit);
      if (!(rel(H8, H8_LIT, 1e-12) && H8 < 1 && 1 / (H8 * H8) >= 2.73)) return false;
      const h = (x) => Math.exp(SS_LEGALITY - x) * Math.pow(x / SS_LEGALITY, SS_LEGALITY);
      for (let x = 0.5; x < SS_LEGALITY - 0.25; x += 0.25) if (h(x + 0.25) <= h(x)) return false;
      for (let b = 0; b <= 40; b += 2) {
        const rMax = Math.pow(2, (b + 1) / 3); // r^3 <= 2^{b+1}
        const tauNear = b === 0 ? 2 : Math.pow(2, b - 1);
        if (!(tauNear >= (Math.pow(rMax, 3) / 4) * (1 - 1e-12))) return false;
      }
      return true;
    },
  },
  {
    id: "imp95131-rt-honesty-gate",
    description:
      "the verdict is scoped: one packet per block, parity-pure, threshold 2/5 sufficient not sharp; the parent sub-gap imp-95130-subgap-phi-conditional-odd-mass stays OPEN with two named legs; promotes no bound, NO QED, no refereed bound is changed",
    holds: () =>
      IMP95131_PARITY_PURE_RATE_THRESHOLD.promotesBound === false &&
      /NO QED/.test(IMP95131_PARITY_PURE_RATE_THRESHOLD.rigorScope) &&
      /refereed bound is changed/i.test(IMP95131_PARITY_PURE_RATE_THRESHOLD.rigorScope) &&
      /stays OPEN/.test(IMP95131_PARITY_PURE_RATE_THRESHOLD.rigorScope) &&
      /remains OPEN/.test(IMP95131_PARITY_PURE_RATE_THRESHOLD.openResiduals[0]) &&
      /named, not closed/.test(IMP95131_PARITY_PURE_RATE_THRESHOLD.openResiduals[1]) &&
      IMP95131_PARITY_PURE_RATE_THRESHOLD.subGaps.length === 2 &&
      IMP95131_PARITY_PURE_RATE_THRESHOLD.openResiduals.length === 3 &&
      /one packet per block/.test(IMP95131_PARITY_PURE_RATE_THRESHOLD.rigorScope),
  },
];

for (const a of IMP95131_PARITY_PURE_RATE_THRESHOLD_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-95131-parity-pure-rate-threshold assertion failed: ${a.id}`);
  }
}

export default IMP95131_PARITY_PURE_RATE_THRESHOLD;
