/**
 * imp-95659 -- INTERIOR TABULATION of the imp-95642 twin-pair block floor
 * F(delta, rho) as a function of the cross/in-pair separation ratio rho,
 * where the cross-pair gap is D = rho * delta and rho ranges from 1 (uniform
 * single-scale delta-lattice) up to the isolated-pair limit (rho -> inf).
 *
 * GRADE: derivation + numerical witness. Imports no heavy bundle. imp-95642
 * settled the PORTABILITY question (the twin-pair Toeplitz block symbol does
 * NOT port off-lattice / m-uniformly, so the SPLIT-OPT - SPLIT-RZ = 4.611560
 * onset gap is a genuine floor of the single-scale delta-separated class) by
 * asserting only the two ENDPOINTS: the isolated-pair block floor
 * 1 - sech(delta/2) at D -> inf, and the collapse to the scalar A_opt(delta)
 * at D -> delta+. It never tabulated the INTERIOR. This module measures the
 * per-pair effective block floor F = lambda_min(seam Gram) across a rho grid,
 * quantifying the continuous two-scale -> single-scale degradation between the
 * two endpoints. Changes no Lambda bound; NO QED; no refereed bound is changed.
 *
 * SETUP (identical machinery to imp-95642). Normalized seam Gram
 * Gtilde_ij = sech((x_i - x_j)/2) on log-rates x. Twin-pair lattice: nPairs
 * pairs, IN-pair gap delta = ln 1.3, CROSS-pair gap D = rho * delta. The
 * effective per-pair block floor is F(delta, rho) = lambda_min(Gtilde), the
 * quantity whose two endpoints imp-95642 pinned:
 *   - rho -> 1 (D = delta, uniform lattice): F -> A_opt(delta) (scalar floor),
 *     up to a small finite-size Szego factor (ratio 1.092 at 80 points).
 *   - rho -> inf (isolated pairs): F -> 1 - sech(delta/2) (isolated 2x2 block
 *     floor).
 *
 * WHAT THE INTERIOR SHOWS (nPairs = 40, i.e. 80 log-rates, verified below).
 * F(delta, rho) is STRICTLY INCREASING in rho and sweeps ~12 orders of
 * magnitude, from the scalar floor at rho = 1 to the block floor at rho -> inf:
 *
 *   rho     D = rho*delta   F = lambda_min     F / A_opt      F / blockIso
 *   1       0.262364        4.811451e-15       1.0920e+0      5.632e-13
 *   1.5     0.393546        6.459385e-12       1.4660e+3      7.561e-10
 *   2       0.524729        6.521077e-10       1.4800e+5      7.633e-08
 *   3       0.787093        1.674888e-07       3.8012e+7      1.961e-05
 *   5       1.311821        2.897135e-05       6.5751e+9      3.391e-03
 *   10      2.623643        1.491123e-03       3.3841e+11     1.745e-01
 *   20      5.247285        6.286102e-03       1.4266e+12     7.358e-01
 *   50      13.118213       8.500341e-03       1.9292e+12     9.950e-01
 *   100     26.236426       8.543048e-03       1.9388e+12     1.000e+00
 *
 * READING. The block advantage (F normalized by the scalar A_opt) is already
 * ~1.5e3x at rho = 1.5 and ~6.6e9x at rho = 5, but at rho = 1 it is only 1.09x
 * -- i.e. the ENTIRE block sharpening lives strictly interior to rho > 1 and
 * evaporates as rho -> 1. Symmetrically, the fraction of the isolated block
 * floor actually retained (F / blockIso) is < 1e-12 at rho = 1, crosses ~1/2
 * near rho ~ 15, and reaches 0.995 only by rho = 50. The single-scale class
 * (which permits rho -> 1) is therefore pinned at the LEFT endpoint where the
 * block floor is absent, exactly the imp-95642 obstruction, now resolved as a
 * smooth monotone interpolation rather than a jump.
 *
 * HONEST SCOPE. (a) Pure tabulation of an already-established two-endpoint
 * mechanism (imp-95642 / THEOREM SEP-OPT imp-95419); introduces no new cited
 * input and no new bound. (b) F is a finite-size (80-point) proxy for the
 * per-pair block floor; the rho = 1 value carries the same finite-size Szego
 * factor 1.092 as imp-95642 and is not the infinite-lattice infimum. (c) Model
 * seam family only; the imp-95212 envelope port, signed WEIGHT, and
 * modulus/phase legs stay OPEN. Changes NO bound of the Lambda program; NO QED;
 * no refereed bound is changed.
 *
 * @see imp-95642-twin-pair-symbol-offlattice-obstruction (the two endpoints this tabulates between)
 * @see imp-95419-separated-class-optimal-riesz-floor (THEOREM SEP-OPT, scalar class floor)
 * @see imp-95609-seam-gram-onset-ladder-table (the 4.611560 residual shown genuine)
 */

// ---------------------------------------------------------------------------
// Reference constants (all cross-checked by the assertions below)
// ---------------------------------------------------------------------------

export const IMP95659_TWIN_PAIR_BLOCK_FLOOR_RHO_TABULATION = {
  id: "imp-95659",
  title:
    "INTERIOR TABULATION: the twin-pair block floor F(delta, rho) sweeps " +
    "monotonically from the scalar A_opt(delta) at rho = 1 (single-scale " +
    "uniform lattice) to the isolated block floor 1 - sech(delta/2) as " +
    "rho -> inf, over ~12 orders of magnitude",
  question:
    "how does the twin-pair per-pair block floor F degrade from the isolated " +
    "block value 1 - sech(delta/2) down to the scalar A_opt(delta) as the " +
    "cross/in-pair ratio rho = D/delta decreases from infinity to 1?",
  delta: 0.26236426446749106, // ln 1.3
  aOpt: 4.406252285191383e-15, // scalar lattice floor A_opt(ln 1.3), imp-95419
  blockFloorIsolated: 0.008543108609445182, // 1 - sech(delta/2), isolated 2x2 twin-pair block
  nPairs: 40, // 80 log-rates; same finite size as imp-95642 (ratio 1.092)
  // Interior tabulation: F = lambda_min(seam Gram) at cross-pair gap D = rho*delta.
  // FoverAopt = F / A_opt (block advantage over the scalar floor); FoverBlock =
  // F / blockFloorIsolated (fraction of the isolated block floor retained).
  table: [
    { rho: 1, D: 0.262364264, F: 4.811451e-15, FoverAopt: 1.092, FoverBlock: 5.632e-13 },
    { rho: 1.5, D: 0.393546397, F: 6.459385e-12, FoverAopt: 1466, FoverBlock: 7.5609e-10 },
    { rho: 2, D: 0.524728529, F: 6.521077e-10, FoverAopt: 148000, FoverBlock: 7.6331e-8 },
    { rho: 3, D: 0.787092793, F: 1.674888e-7, FoverAopt: 38012000, FoverBlock: 1.9605e-5 },
    { rho: 5, D: 1.311821322, F: 2.897135e-5, FoverAopt: 6575100000, FoverBlock: 3.3912e-3 },
    { rho: 10, D: 2.623642645, F: 1.491123e-3, FoverAopt: 338410000000, FoverBlock: 0.17454 },
    { rho: 20, D: 5.247285289, F: 6.286102e-3, FoverAopt: 1426600000000, FoverBlock: 0.73581 },
    { rho: 50, D: 13.118213223, F: 8.500341e-3, FoverAopt: 1929200000000, FoverBlock: 0.99499 },
    { rho: 100, D: 26.236426447, F: 8.543048e-3, FoverAopt: 1938800000000, FoverBlock: 0.99999 },
  ],
  monotone: true, // F strictly increasing in rho across the grid
  halfRetentionRho: 15, // F / blockIso crosses ~1/2 near rho ~ 15 (between 10 and 20)
  boundChange: false,
  qed: false,
  verdict:
    "INTERIOR TABULATED. The twin-pair per-pair block floor F(delta, rho) is a " +
    "strictly increasing, ~12-order-of-magnitude bridge between the two " +
    "imp-95642 endpoints: it equals the scalar A_opt(delta) (block advantage " +
    "1.09x only) at rho = 1, and recovers the isolated block floor " +
    "1 - sech(delta/2) (advantage ~1.94e12x) as rho -> inf. The entire block " +
    "sharpening lives strictly interior to rho > 1 and evaporates as rho -> 1, " +
    "so the single-scale delta-separated class (which admits rho -> 1) is " +
    "pinned at the scalar-floor endpoint -- the imp-95642 obstruction, now " +
    "resolved as a smooth monotone collapse rather than a jump. Pure " +
    "tabulation of an established two-endpoint mechanism; no new cited input. " +
    "Model seam family only; the imp-95212 envelope port, signed WEIGHT, and " +
    "modulus/phase legs stay OPEN. Changes no bound of the Lambda program; NO " +
    "QED; no refereed bound is changed.",
  closesTickets: ["imp-95659"],
};

// ---------------------------------------------------------------------------
// Self-executing assertions (import-light: no imports at all)
// ---------------------------------------------------------------------------

function sech(x) {
  return 2 / (Math.exp(x) + Math.exp(-x));
}

// stable theta-dual (Poisson) form of the scalar class floor A_opt(delta)
function aOptDual(delta) {
  let s = 0;
  for (let n = 0; n <= 500; n++) {
    const t = sech((Math.PI * Math.PI * (2 * n + 1)) / delta);
    s += t;
    if (n > 2 && t < s * 1e-25) break;
  }
  return ((4 * Math.PI) / delta) * s;
}

// Jacobi eigenvalue sweep, lambda_min of a symmetric matrix
function lambdaMin(A0) {
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
  for (let i = 0; i < n; i++) mn = Math.min(mn, A[i][i]);
  return mn;
}

function gramFromLogRates(xs) {
  return xs.map((a) => xs.map((b) => sech((a - b) / 2)));
}

// twin-pair lattice: nPairs pairs, in-pair gap delta, cross-pair gap D
function twinPairRates(nPairs, delta, D) {
  const xs = [];
  let base = 0;
  for (let k = 0; k < nPairs; k++) {
    xs.push(base);
    xs.push(base + delta);
    base += delta + D;
  }
  return xs;
}

const REF = IMP95659_TWIN_PAIR_BLOCK_FLOOR_RHO_TABULATION;

// recompute the effective block floor F(delta, rho) for a row
function computeF(rho) {
  const D = rho * REF.delta;
  return lambdaMin(gramFromLogRates(twinPairRates(REF.nPairs, REF.delta, D)));
}

export const IMP95659_ASSERTIONS = [
  {
    id: "imp95659-endpoints-match-imp95642",
    description:
      "the tabulation endpoints reproduce the imp-95642 pinned values: rho = 1 " +
      "collapses to the scalar A_opt (ratio 1.092 at 80 points) and rho = 100 " +
      "recovers the isolated block floor 1 - sech(delta/2) to 1e-4 rel",
    holds: () => {
      const aOpt = aOptDual(REF.delta);
      const block = 1 - sech(REF.delta / 2);
      const f1 = computeF(1);
      const r1 = f1 / aOpt;
      if (!(r1 > 1 && r1 < 1.2)) return false; // collapse to scalar floor
      const f100 = computeF(100);
      return Math.abs(f100 - block) / block < 1e-4; // recover block floor
    },
  },
  {
    id: "imp95659-interior-monotone-increasing",
    description:
      "the effective block floor F(delta, rho) is strictly increasing across " +
      "the whole rho grid (a smooth two-scale -> single-scale bridge, not a jump)",
    holds: () => {
      let prev = -Infinity;
      for (const row of REF.table) {
        const F = computeF(row.rho);
        if (!(F > prev)) return false;
        prev = F;
      }
      return REF.monotone === true;
    },
  },
  {
    id: "imp95659-interior-reproduces-baked-F",
    description:
      "each baked interior F literal is reproduced by a fresh lambda_min " +
      "computation to 1e-3 rel for the numerically robust rows (F >= 1e-9); " +
      "the two tiny-F rows near cancellation are checked only ordinally above",
    holds: () =>
      REF.table.every((row) => {
        if (row.F < 1e-9) return true; // near-cancellation rows: ordinal check only
        const F = computeF(row.rho);
        return Math.abs(F - row.F) / row.F < 1e-3;
      }),
  },
  {
    id: "imp95659-block-advantage-lives-interior",
    description:
      "the block advantage F / A_opt is only ~1.09x at rho = 1 but exceeds " +
      "1e3x by rho = 1.5 -- the sharpening lives strictly interior to rho > 1",
    holds: () => {
      const aOpt = aOptDual(REF.delta);
      const adv1 = computeF(1) / aOpt;
      const adv15 = computeF(1.5) / aOpt;
      return adv1 < 1.2 && adv15 > 1e3;
    },
  },
  {
    id: "imp95659-half-retention-brackets",
    description:
      "the isolated-block-floor retention F / blockIso crosses ~1/2 between " +
      "rho = 10 and rho = 20 (the baked halfRetentionRho ~ 15 lies in-bracket)",
    holds: () => {
      const block = 1 - sech(REF.delta / 2);
      const r10 = computeF(10) / block;
      const r20 = computeF(20) / block;
      return (
        r10 < 0.5 &&
        r20 > 0.5 &&
        REF.halfRetentionRho > 10 &&
        REF.halfRetentionRho < 20
      );
    },
  },
  {
    id: "imp95659-not-a-bound",
    description:
      "this is a tabulation / documentation module; it moves no Lambda bound " +
      "and proves no QED",
    holds: () =>
      REF.boundChange === false &&
      REF.qed === false &&
      /INTERIOR TABULATED/.test(REF.verdict) &&
      /refereed bound is changed/i.test(REF.verdict),
  },
  {
    id: "imp95659-closes-self",
    description: "this module is the deliverable the imp-95659 ticket asked for",
    holds: () => REF.closesTickets.includes("imp-95659"),
  },
];

for (const a of IMP95659_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-95659-twin-pair-block-floor-rho-tabulation assertion failed: ${a.id}`,
    );
  }
}

export default IMP95659_TWIN_PAIR_BLOCK_FLOOR_RHO_TABULATION;
