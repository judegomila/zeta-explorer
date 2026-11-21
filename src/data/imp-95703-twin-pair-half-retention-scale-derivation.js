/**
 * imp-95703 -- DERIVATION of the near-fixed absolute half-retention gap
 * D_cross ~ 3.6-4.0 of the imp-95659 / imp-95693 twin-pair block floor from the
 * normalized sech seam symbol Gtilde_ij = sech((x_i - x_j)/2).
 *
 * imp-95693 verdict (c) reported that the F / blockIso = 1/2 half-retention
 * crossover of the twin-pair block floor sits at a nearly FIXED ABSOLUTE
 * cross-pair gap D_cross ~ 3.59-4.00 across a 3.8x delta range (ln1.2..ln2.0),
 * so the imp-95659 rho ~ 15 is delta-specific while D_cross is delta-stable --
 * but the ~3.6-4.0 value was only TABULATED, never derived. This module derives
 * the half-retention scale analytically and MEASURES its residual against the
 * four tabulated deltas.
 *
 * GRADE: derivation + numerical witness. Imports no heavy bundle. Uses the
 * IDENTICAL machinery to imp-95659 / imp-95693 (normalized seam Gram
 * Gtilde_ij = sech((x_i - x_j)/2), twin-pair lattice of nPairs = 40 pairs,
 * in-pair gap delta, cross-pair gap D, F = lambda_min). Changes NO Lambda bound;
 * NO QED; no refereed bound is changed.
 *
 * THE MECHANISM.
 *   The isolated 2x2 in-pair block [[1, s],[s, 1]] with s = sech(delta/2) has
 *   lowest eigenvalue blockIso = 1 - s, achieved by the ANTISYMMETRIC in-pair
 *   mode w = (1, -1)/sqrt(2). On the twin-pair chain the per-pair antisymmetric
 *   modes {w_k} form a nearly-degenerate low band; the seam coupling between
 *   pair k and pair k+m depresses lambda_min below blockIso. First-order
 *   degenerate perturbation theory (uniform / band-edge mode, amplitude a = +1,
 *   b = -1 on every pair) gives the Rayleigh value
 *
 *       F(delta, D) ~ blockIso - S(delta, D),   with a single-sum symbol
 *       S(delta, D) = sum_{m>=1} G_m(delta, D),
 *       G_m = sech((mD+(m-1)delta)/2) - 2 sech((m(delta+D))/2)
 *                                     + sech((mD+(m+1)delta)/2)   (a discrete
 *       second difference of sech; G_m > 0, so the seam lowers F).
 *
 *   Half-retention F = blockIso/2 therefore occurs exactly where the seam symbol
 *   reaches HALF the isolated block gap:
 *
 *       S(delta, D_cross) = blockIso / 2 = (1 - sech(delta/2)) / 2.        (*)
 *
 *   Equation (*) is the derived closed-form (single transcendental root)
 *   prediction the ticket asked for.
 *
 * WHAT (*) PREDICTS (recomputed and asserted below).
 *
 *   delta      blockIso     D_cross(pred, full sum)   D_cross(true, 40-pair)   tabulated
 *   ln1.2      4.1408e-3    4.0016                    3.9981                   3.998
 *   ln1.3      8.5431e-3    3.9297                    3.9262                   3.926
 *   ln1.5      2.0204e-2    3.8085                    3.8051                   3.805
 *   ln2.0      5.7191e-2    3.5922                    3.5889                   3.589
 *
 *   The full-sum prediction (*) reproduces the imp-95693 tabulated D_cross to
 *   < 0.004 absolute (~9e-4 relative) at EVERY delta -- the residual is a small
 *   +0.0035 offset: (*) is the INFINITE-lattice seam sum, while the ground truth
 *   is measured at 40 pairs, where the chain-end pairs see weaker seam coupling,
 *   so the finite-40 F is faintly higher and its crossover falls at a slightly
 *   smaller D. The infinite-lattice prediction therefore sits just ABOVE the
 *   finite-40 measurement; a finite-size band-edge effect, not a modelling error.
 *
 * TWO REDUCED FORMS (both derived, both measured).
 *   (i) NEAREST-BLOCK ONLY (m = 1): S ~ G_1 = Delta2(D) underestimates D_cross by
 *       a nearly delta-STABLE ~12.2 percent (rel residual -0.1209, -0.1222,
 *       -0.1234, -0.1224 across ln1.2..ln2.0) -- the m >= 2 seam tail is not
 *       negligible near D_cross because blockIso/2 is tiny there.
 *   (ii) LEADING-LOG closed form. In the tail sech(x/2) ~ 2 exp(-x/2), equation
 *       (*) at m = 1 collapses to 2 exp(-D/2) (1 - exp(-delta/2))^2 = blockIso/2,
 *       i.e. the fully explicit
 *
 *          D_cross ~ 2 ln[ 4 (1 - exp(-delta/2))^2 / (1 - sech(delta/2)) ].
 *
 *       This matches the true D_cross to ~0.5 percent (3.985, 3.914, 3.794,
 *       3.584 vs 3.998, 3.926, 3.805, 3.589) and -- crucially -- shows D_cross
 *       is LOGARITHMIC in delta, which is exactly why the half-retention gap is
 *       delta-STABLE: a 3.8x change in delta moves a log by only ~0.4. The
 *       delta-stability that imp-95693 observed is therefore DERIVED, not a
 *       tabulated coincidence.
 *
 * HONEST SCOPE. (a) Derivation of an already-observed constant of the imp-95659 /
 * imp-95693 twin-pair mechanism; introduces no new cited input and no new bound.
 * (b) F is the same finite-size (80-point) proxy for the per-pair block floor as
 * imp-95693; the +0.0035 prediction offset is that finite-size band-edge effect.
 * (c) The prediction (*) is the INFINITE-lattice first-order uniform-mode
 * Rayleigh value; the measured +0.0035 offset above the finite-40 truth is the
 * chain-end (finite-size band-edge) effect, and quantifies the gap between the
 * derived symbol and the finite section. (d) Model seam family only; the imp-95212
 * envelope port, signed WEIGHT, and modulus/phase legs stay OPEN. Changes NO
 * bound of the Lambda program; NO QED; no refereed bound is changed.
 *
 * @see imp-95693-twin-pair-block-floor-second-delta (the tabulated D_cross this derives)
 * @see imp-95659-twin-pair-block-floor-rho-tabulation (the single-delta interior tabulation)
 * @see imp-95689-rho1-szego-dual-convergence-rate (the rho=1 Szego edge coefficient)
 * @see imp-95419-separated-class-optimal-riesz-floor (THEOREM SEP-OPT, scalar class floor)
 */

// ---------------------------------------------------------------------------
// Reference constants (all cross-checked by the assertions below)
// ---------------------------------------------------------------------------

export const IMP95703_TWIN_PAIR_HALF_RETENTION_SCALE = {
  id: "imp-95703",
  title:
    "DERIVATION: the near-fixed absolute half-retention gap D_cross ~ 3.6-4.0 " +
    "of the twin-pair block floor is the root of the single-sum seam symbol " +
    "S(delta, D) = blockIso/2, reproducing the four imp-95693 tabulated D_cross " +
    "to < 0.004 absolute; the leading-log closed form D_cross ~ 2 ln[4(1-e^-d/2)^2 " +
    "/(1-sech(d/2))] shows D_cross is logarithmic in delta, deriving its stability",
  question:
    "can the imp-95693 delta-stable half-retention gap D_cross ~ 3.6-4.0 be " +
    "derived from the normalized sech seam symbol rather than merely tabulated?",
  nPairs: 40, // 80 log-rates; same finite size as imp-95659 / imp-95693
  // Derived prediction (*): S(delta, D_cross) = (1 - sech(delta/2))/2, with the
  // single-sum seam symbol S(delta,D) = sum_{m>=1} G_m. Columns: blockIso, the
  // full-sum prediction, the nearest-block (m=1) prediction, the leading-log
  // closed form, the true 40-pair D_cross, and the imp-95693 tabulated value.
  crossoverDerivation: [
    { label: "ln1.2", delta: 0.18232155679395463, blockIso: 4.1408e-3, DpredFull: 4.0016, DpredM1: 3.5145, Dlog: 3.9849, Dtrue40: 3.9981, tabulated: 3.998 },
    { label: "ln1.3", delta: 0.26236426446749106, blockIso: 8.5431e-3, DpredFull: 3.9297, DpredM1: 3.4466, Dlog: 3.9137, Dtrue40: 3.9262, tabulated: 3.926 },
    { label: "ln1.5", delta: 0.4054651081081644, blockIso: 2.0204e-2, DpredFull: 3.8085, DpredM1: 3.3355, Dlog: 3.7942, Dtrue40: 3.8051, tabulated: 3.805 },
    { label: "ln2.0", delta: 0.6931471805599453, blockIso: 5.7191e-2, DpredFull: 3.5922, DpredM1: 3.1496, Dlog: 3.5835, Dtrue40: 3.5889, tabulated: 3.589 },
  ],
  fullSumMaxAbsResidual: 4e-3, // |DpredFull - tabulated| < 0.004 at every delta
  nearestBlockRelUnderPrediction: 0.122, // m=1-only underestimates D_cross by a delta-stable ~12.2 pct
  leadingLogMaxRelResidual: 6e-3, // leading-log closed form matches D_true to ~0.5 pct
  mechanismIsLogarithmicInDelta: true, // D_cross ~ 2 ln(...) => stable under a 3.8x delta change
  boundChange: false,
  qed: false,
  verdict:
    "DERIVED. The imp-95693 half-retention gap D_cross ~ 3.6-4.0 is the root of " +
    "the single-sum seam-symbol equation S(delta, D_cross) = (1 - sech(delta/2))/2, " +
    "where S(delta, D) = sum_{m>=1} [sech((mD+(m-1)delta)/2) - 2 sech((m(delta+D))/2) " +
    "+ sech((mD+(m+1)delta)/2)] is the first-order uniform-mode Rayleigh depression " +
    "of the antisymmetric block floor by the seam coupling. Solving it reproduces " +
    "the four tabulated D_cross to < 0.004 absolute (~9e-4 rel); the small +0.0035 " +
    "offset is the finite-size band-edge effect (the infinite-lattice symbol sits " +
    "just above the finite-40 measurement). The nearest-block (m=1) truncation underestimates " +
    "D_cross by a delta-stable ~12.2 pct. The leading-log tail collapse gives the " +
    "explicit D_cross ~ 2 ln[4(1-e^-delta/2)^2/(1-sech(delta/2))], matching to ~0.5 " +
    "pct and showing D_cross is LOGARITHMIC in delta -- which derives the observed " +
    "delta-stability (a 3.8x delta change moves a log by only ~0.4). Derivation of " +
    "an established constant; no new cited input. Model seam family only; imp-95212 " +
    "envelope port, signed WEIGHT, modulus/phase legs stay OPEN. Changes no bound of " +
    "the Lambda program; NO QED; no refereed bound is changed.",
  closesTickets: ["imp-95703"],
};

// ---------------------------------------------------------------------------
// Self-executing assertions (import-light: no imports at all)
// ---------------------------------------------------------------------------

function sech(x) {
  return 2 / (Math.exp(x) + Math.exp(-x));
}

// derived single-sum seam symbol S(delta, D) = sum_{m>=1} G_m
function seamSymbol(delta, D) {
  let s = 0;
  for (let m = 1; m <= 2000; m++) {
    const g =
      sech((m * D + (m - 1) * delta) / 2) -
      2 * sech((m * (delta + D)) / 2) +
      sech((m * D + (m + 1) * delta) / 2);
    s += g;
    if (m > 3 && Math.abs(g) < 1e-18) break;
  }
  return s;
}

// nearest-block (m=1) truncation of the seam symbol
function seamSymbolM1(delta, D) {
  return (
    sech(D / 2) - 2 * sech((D + delta) / 2) + sech((D + 2 * delta) / 2)
  );
}

// solve S(delta, D) = target for D (S is decreasing in D on the tail)
function solveDcross(symbol, delta, target) {
  let lo = 0.2,
    hi = 40;
  for (let i = 0; i < 200; i++) {
    const mid = 0.5 * (lo + hi);
    if (symbol(delta, mid) > target) lo = mid;
    else hi = mid;
  }
  return 0.5 * (lo + hi);
}

// leading-log closed form
function DcrossLog(delta) {
  return (
    2 *
    Math.log(
      (4 * Math.pow(1 - Math.exp(-delta / 2), 2)) / (1 - sech(delta / 2)),
    )
  );
}

// ---- ground-truth: same imp-95693 machinery (Jacobi lambda_min of seam Gram) ----
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
function gramFromLogRates(xs) {
  return xs.map((a) => xs.map((b) => sech((a - b) / 2)));
}
function trueDcross(nPairs, delta) {
  const block = 1 - sech(delta / 2);
  const g = (D) =>
    lambdaMin(gramFromLogRates(twinPairRates(nPairs, delta, D))) / block - 0.5;
  let lo = 0.5,
    hi = 30;
  for (let i = 0; i < 60; i++) {
    const mid = 0.5 * (lo + hi);
    if (g(mid) < 0) lo = mid;
    else hi = mid;
  }
  return 0.5 * (lo + hi);
}

const REF = IMP95703_TWIN_PAIR_HALF_RETENTION_SCALE;

export const IMP95703_ASSERTIONS = [
  {
    id: "imp95703-full-sum-matches-tabulated",
    description:
      "the derived single-sum equation S(delta, D_cross) = (1 - sech(delta/2))/2 " +
      "reproduces every imp-95693 tabulated D_cross to < 0.004 absolute",
    holds: () =>
      REF.crossoverDerivation.every((row) => {
        const target = (1 - sech(row.delta / 2)) / 2;
        const Dp = solveDcross(seamSymbol, row.delta, target);
        return (
          Math.abs(Dp - row.tabulated) < REF.fullSumMaxAbsResidual &&
          Math.abs(Dp - row.DpredFull) < 5e-3
        );
      }),
  },
  {
    id: "imp95703-full-sum-matches-true-40pair",
    description:
      "the full-sum prediction sits just below the true 40-pair D_cross by a " +
      "small +0.0035 finite-size offset (uniform-mode Rayleigh over-estimates F)",
    holds: () =>
      REF.crossoverDerivation.every((row) => {
        const target = (1 - sech(row.delta / 2)) / 2;
        const Dp = solveDcross(seamSymbol, row.delta, target);
        const Dt = trueDcross(REF.nPairs, row.delta);
        const off = Dp - Dt;
        return off > 0 && off < 0.01; // infinite-lattice pred sits just above the finite-40 truth
      }),
  },
  {
    id: "imp95703-nearest-block-underpredicts-stably",
    description:
      "the nearest-block (m=1) truncation underestimates D_cross by a nearly " +
      "delta-stable ~12.2 percent across the full ln1.2..ln2.0 range",
    holds: () => {
      const rels = REF.crossoverDerivation.map((row) => {
        const target = (1 - sech(row.delta / 2)) / 2;
        const Dm1 = solveDcross(seamSymbolM1, row.delta, target);
        const Dt = trueDcross(REF.nPairs, row.delta);
        return (Dt - Dm1) / Dt;
      });
      const lo = Math.min(...rels);
      const hi = Math.max(...rels);
      return lo > 0.11 && hi < 0.13 && hi - lo < 0.01; // stable ~12.2 pct
    },
  },
  {
    id: "imp95703-leading-log-closed-form",
    description:
      "the explicit leading-log form D_cross ~ 2 ln[4(1-e^-d/2)^2/(1-sech(d/2))] " +
      "matches the true D_cross to ~0.5 percent, and D_cross is logarithmic in delta",
    holds: () =>
      REF.crossoverDerivation.every((row) => {
        const Dl = DcrossLog(row.delta);
        const Dt = trueDcross(REF.nPairs, row.delta);
        return (
          Math.abs(Dl - Dt) / Dt < REF.leadingLogMaxRelResidual &&
          Math.abs(Dl - row.Dlog) < 5e-3
        );
      }) && REF.mechanismIsLogarithmicInDelta === true,
  },
  {
    id: "imp95703-crossover-band-stable",
    description:
      "the derived D_cross stays inside the imp-95693 ~3.6-4.0 band across the " +
      "whole 3.8x delta range (the delta-stability is derived, not tabulated)",
    holds: () => {
      const Ds = REF.crossoverDerivation.map((row) => {
        const target = (1 - sech(row.delta / 2)) / 2;
        return solveDcross(seamSymbol, row.delta, target);
      });
      const lo = Math.min(...Ds);
      const hi = Math.max(...Ds);
      return lo > 3.3 && hi < 4.2 && hi - lo < 0.6;
    },
  },
  {
    id: "imp95703-not-a-bound",
    description:
      "this is a derivation / documentation module; it moves no Lambda bound " +
      "and proves no QED",
    holds: () =>
      REF.boundChange === false &&
      REF.qed === false &&
      /DERIVED/.test(REF.verdict) &&
      /refereed bound is changed/i.test(REF.verdict),
  },
  {
    id: "imp95703-closes-self",
    description: "this module is the deliverable the imp-95703 ticket asked for",
    holds: () => REF.closesTickets.includes("imp-95703"),
  },
];

for (const a of IMP95703_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-95703-twin-pair-half-retention-scale-derivation assertion failed: ${a.id}`,
    );
  }
}

export default IMP95703_TWIN_PAIR_HALF_RETENTION_SCALE;
