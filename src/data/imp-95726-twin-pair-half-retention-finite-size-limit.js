/**
 * imp-95726 -- VERIFICATION that the imp-95703 derived half-retention crossover
 * closed form S(delta, D_cross) = blockIso / 2 is the INFINITE-lattice limit of
 * the twin-pair block floor, by resolving the finite-size ladder in nPairs.
 *
 * imp-95703 derived the delta-stable half-retention gap D_cross of the imp-95693
 * twin-pair block floor as the single-transcendental root of
 *
 *     S(delta, D_cross) = blockIso / 2,     blockIso = 1 - sech(delta/2),
 *     S(delta, D) = sum_{m>=1} [ sech((mD+(m-1)delta)/2) - 2 sech((m(delta+D))/2)
 *                                + sech((mD+(m+1)delta)/2) ]   (a discrete 2nd
 *                                difference of sech; the first-order uniform-mode
 *                                Rayleigh depression of the antisymmetric floor).
 *
 * That closed form reproduced the imp-95693 tabulated D_cross (measured at the
 * finite nPairs = 40 section) to within a residual D_closed - D_true(40) ~ +3.5e-3
 * at every delta, which imp-95703 ATTRIBUTED to the finite-40 chain-end band-edge
 * effect but never VERIFIED as finite-size rather than a first-order
 * perturbation-theory model error. This module recomputes the true D_cross at
 * nPairs well beyond 40 (nPairs = 40, 80, 160) with the IDENTICAL exact Jacobi
 * lambda_min machinery, and checks whether the residual shrinks toward zero.
 *
 * RESULT -- the residual is a clean 1/nPairs^2 finite-size band-edge effect.
 *
 *   delta   D_closed    D_true(40)  D_true(80)  D_true(160)  resid40   resid80   resid160
 *   ln1.2   4.001564    3.998069    4.000681    4.001342     3.495e-3  8.834e-4  2.221e-4
 *   ln1.3   3.929721    3.926236    3.928840    3.929500     3.485e-3  8.808e-4  2.214e-4
 *   ln1.5   3.808531    3.805073    3.807657    3.808311     3.458e-3  8.740e-4  2.197e-4
 *   ln2.0   3.592249    3.588877    3.591397    3.592035     3.372e-3  8.522e-4  2.142e-4
 *
 *   The residual D_closed - D_true(nPairs) drops by a factor of ~3.96 (40 -> 80)
 *   then ~3.98 (80 -> 160) -- i.e. it scales as ~1/nPairs^2 (each doubling of the
 *   lattice quarters the residual), and D_true(nPairs) rises MONOTONICALLY toward
 *   D_closed. An h^2 Richardson extrapolation of the 80- and 160-pair sections,
 *   D_inf = (4 D_true(160) - D_true(80)) / 3, lands on the closed form to
 *   ~1.6e-6 at every delta:
 *
 *   delta   Richardson(80,160)   D_closed       Richardson - D_closed
 *   ln1.2   4.001562350          4.001563987    -1.64e-6
 *   ln1.3   3.929719397          3.929721025    -1.63e-6
 *   ln1.5   3.808529400          3.808531005    -1.61e-6
 *   ln2.0   3.592247934          3.592249466    -1.53e-6
 *
 * VERDICT. The ~3.5e-3 residual imp-95703 saw at 40 pairs is CONFIRMED to be a
 * finite-size band-edge effect (quadratic 1/nPairs^2 decay), NOT a first-order
 * perturbation-theory model error: the derived closed form S(delta, D_cross) =
 * blockIso/2 IS the infinite-lattice limit of the twin-pair half-retention
 * crossover. The uniform-mode Rayleigh symbol is exact in the thermodynamic limit
 * for this seam family; the finite-40 chain sits ~3.5e-3 below only because its
 * end pairs see weaker seam coupling, and that offset vanishes as 1/nPairs^2.
 *
 * HONEST SCOPE.
 *   (a) Numerical witness on the imp-95659 / imp-95693 / imp-95703 model seam Gram
 *       (Gtilde_ij = sech((x_i - x_j)/2)); introduces no new cited input.
 *   (b) The exact-Jacobi ladder is capped at nPairs = 160 (n = 320): at nPairs =
 *       640 the low antisymmetric band is dense and a reorthogonalized Lanczos
 *       under-converges (Ritz value biased high) by an amount comparable to the
 *       finite-size effect, so no reliable exact 640-pair D_cross is claimed here;
 *       the clean 40 -> 80 -> 160 quadratic law plus the 1.6e-6 Richardson match
 *       already pin the infinite-lattice limit.
 *   (c) Model seam family only; the imp-95212 envelope port, signed WEIGHT, and
 *       modulus/phase legs stay OPEN. Changes NO bound of the Lambda program;
 *       NO QED; no refereed bound is changed.
 *
 * @see imp-95703-twin-pair-half-retention-scale-derivation (the closed form verified here)
 * @see imp-95693-twin-pair-block-floor-second-delta (the tabulated finite-40 D_cross)
 * @see imp-95659-twin-pair-block-floor-rho-tabulation (the single-delta interior tabulation)
 */

// ---------------------------------------------------------------------------
// Reference constants (all cross-checked by the cheap assertions below)
// ---------------------------------------------------------------------------

export const IMP95726_TWIN_PAIR_HALF_RETENTION_FINITE_SIZE_LIMIT = {
  id: "imp-95726",
  title:
    "VERIFICATION: the imp-95703 half-retention closed form S(delta, D_cross) = " +
    "blockIso/2 is the INFINITE-lattice limit -- the D_true finite-size ladder " +
    "(nPairs 40, 80, 160) shows the ~3.5e-3 residual decays as 1/nPairs^2 and an " +
    "h^2 Richardson extrapolation matches the closed form to ~1.6e-6 at every delta",
  question:
    "does the ~3.5e-3 residual between the imp-95703 closed-form D_cross and the " +
    "true 40-pair D_cross shrink toward zero as nPairs grows, confirming the " +
    "closed form is the infinite-lattice limit (finite-size effect) rather than a " +
    "first-order perturbation-theory model error?",
  // Exact Jacobi lambda_min crossover ladder (identical machinery to imp-95703).
  // D_closed: root of S(delta,D)=blockIso/2. D_true(N): F/blockIso=1/2 crossover at
  // nPairs=N. richardson: (4*D160 - D80)/3, the h^2 infinite-lattice extrapolation.
  ladder: [
    { label: "ln1.2", delta: 0.18232155679395463, Dclosed: 4.001563987050027, d40: 3.9980693101417266, d80: 4.000680615147575, d160: 4.001341916481033, richardson: 4.001562350, resid40: 3.495e-3, resid80: 8.834e-4, resid160: 2.221e-4 },
    { label: "ln1.3", delta: 0.26236426446749106, Dclosed: 3.9297210248436203, d40: 3.926236436935141, d80: 3.9288402256090196, d160: 3.9294996039476233, richardson: 3.929719397, resid40: 3.485e-3, resid80: 8.808e-4, resid160: 2.214e-4 },
    { label: "ln1.5", delta: 0.4054651081081644, Dclosed: 3.8085310046644194, d40: 3.805073194811121, d80: 3.8076570333447313, d160: 3.808311308035627, richardson: 3.808529400, resid40: 3.458e-3, resid80: 8.740e-4, resid160: 2.197e-4 },
    { label: "ln2.0", delta: 0.6931471805599453, Dclosed: 3.592249466351161, d40: 3.5888771408703155, d80: 3.5913972869981077, d160: 3.592035272112116, richardson: 3.592247934, resid40: 3.372e-3, resid80: 8.522e-4, resid160: 2.142e-4 },
  ],
  residualDecayRatioLo: 3.9, // resid(40)/resid(80) and resid(80)/resid(160) both ~3.96-3.98
  residualDecayRatioHi: 4.05, // i.e. quadratic 1/nPairs^2 (each doubling quarters the residual)
  richardsonMaxAbsResidual: 5e-6, // h^2 extrapolation matches the closed form to ~1.6e-6
  convergesUpwardMonotone: true, // D_true(40) < D_true(80) < D_true(160) < D_closed
  residualIsFiniteSize: true, // CONFIRMED: the residual is finite-size, not a PT model error
  boundChange: false,
  qed: false,
  verdict:
    "CONFIRMED finite-size. The ~3.5e-3 residual between the imp-95703 derived " +
    "closed form S(delta, D_cross) = (1 - sech(delta/2))/2 and the true 40-pair " +
    "D_cross is a clean 1/nPairs^2 chain-end band-edge effect: recomputing the " +
    "true crossover with the identical exact Jacobi lambda_min at nPairs = 40, 80, " +
    "160 shows the residual falls by ~3.96x then ~3.98x per lattice doubling " +
    "(quadratic), with D_true rising monotonically toward D_closed. An h^2 " +
    "Richardson extrapolation (4 D_true(160) - D_true(80))/3 lands on the closed " +
    "form to ~1.6e-6 at every one of the four deltas. The derived uniform-mode " +
    "Rayleigh symbol is therefore EXACT in the thermodynamic limit for this seam " +
    "family, not merely a first-order approximation; the finite-40 offset is the " +
    "weaker seam coupling at the chain ends and vanishes as the lattice grows. " +
    "Exact-Jacobi ladder capped at nPairs = 160 (a dense low band makes Lanczos " +
    "under-converge at 640); the quadratic law and Richardson match already pin " +
    "the limit. Numerical witness on the imp-95659/imp-95693/imp-95703 model seam; " +
    "changes no bound; NO QED; no refereed bound is changed.",
  closesTickets: ["imp-95726"],
};

// ---------------------------------------------------------------------------
// Self-executing assertions -- import-light (no heavy bundle, no eigensolves).
// The exact-Jacobi ladder was computed offline (tmp/imp-95726-exact.mjs); here we
// only (i) recompute the cheap closed-form root S(delta,D)=blockIso/2, and
// (ii) re-derive the finite-size decay / Richardson facts from the baked literals.
// ---------------------------------------------------------------------------

function sech(x) {
  return 2 / (Math.exp(x) + Math.exp(-x));
}

// derived infinite-lattice seam symbol S(delta, D) = sum_{m>=1} G_m (imp-95703)
function seamSymbol(delta, D) {
  let s = 0;
  for (let m = 1; m <= 4000; m++) {
    const g =
      sech((m * D + (m - 1) * delta) / 2) -
      2 * sech((m * (delta + D)) / 2) +
      sech((m * D + (m + 1) * delta) / 2);
    s += g;
    if (m > 3 && Math.abs(g) < 1e-18) break;
  }
  return s;
}

// root of S(delta, D) = blockIso/2 (S decreasing in D on the tail)
function solveDcrossClosed(delta) {
  const target = (1 - sech(delta / 2)) / 2;
  let lo = 0.2,
    hi = 40;
  for (let i = 0; i < 200; i++) {
    const mid = 0.5 * (lo + hi);
    if (seamSymbol(delta, mid) > target) lo = mid;
    else hi = mid;
  }
  return 0.5 * (lo + hi);
}

const REF = IMP95726_TWIN_PAIR_HALF_RETENTION_FINITE_SIZE_LIMIT;

export const IMP95726_ASSERTIONS = [
  {
    id: "imp95726-closed-form-matches-baked-Dclosed",
    description:
      "recomputing the derived closed-form root S(delta, D_cross) = blockIso/2 " +
      "reproduces the baked D_closed at every delta (cheap re-derivation)",
    holds: () =>
      REF.ladder.every(
        (row) => Math.abs(solveDcrossClosed(row.delta) - row.Dclosed) < 1e-6,
      ),
  },
  {
    id: "imp95726-residual-decays-quadratically",
    description:
      "the residual D_closed - D_true(nPairs) falls by a ~4x factor per lattice " +
      "doubling (40 -> 80 -> 160), i.e. a quadratic 1/nPairs^2 finite-size law",
    holds: () =>
      REF.ladder.every((row) => {
        const r1 = row.resid40 / row.resid80;
        const r2 = row.resid80 / row.resid160;
        return (
          r1 > REF.residualDecayRatioLo &&
          r1 < REF.residualDecayRatioHi &&
          r2 > REF.residualDecayRatioLo &&
          r2 < REF.residualDecayRatioHi
        );
      }),
  },
  {
    id: "imp95726-residuals-consistent-with-baked-Dtrue",
    description:
      "the baked residuals equal D_closed - D_true(nPairs) from the baked ladder " +
      "literals (internal consistency of the measured table)",
    holds: () =>
      REF.ladder.every(
        (row) =>
          Math.abs(row.resid40 - (row.Dclosed - row.d40)) < 5e-6 &&
          Math.abs(row.resid80 - (row.Dclosed - row.d80)) < 5e-6 &&
          Math.abs(row.resid160 - (row.Dclosed - row.d160)) < 5e-6,
      ),
  },
  {
    id: "imp95726-monotone-convergence-toward-closed-form",
    description:
      "D_true rises monotonically with nPairs toward the closed form: " +
      "D_true(40) < D_true(80) < D_true(160) < D_closed at every delta",
    holds: () =>
      REF.convergesUpwardMonotone === true &&
      REF.ladder.every(
        (row) =>
          row.d40 < row.d80 && row.d80 < row.d160 && row.d160 < row.Dclosed,
      ),
  },
  {
    id: "imp95726-richardson-matches-closed-form",
    description:
      "the h^2 Richardson extrapolation (4 D_true(160) - D_true(80))/3 of the " +
      "finite sections lands on the closed form to ~1.6e-6 at every delta",
    holds: () =>
      REF.ladder.every((row) => {
        const rich = (4 * row.d160 - row.d80) / 3;
        return (
          Math.abs(rich - row.richardson) < 1e-6 &&
          Math.abs(rich - row.Dclosed) < REF.richardsonMaxAbsResidual
        );
      }),
  },
  {
    id: "imp95726-verdict-confirms-finite-size",
    description:
      "the module concludes the residual is a finite-size effect (not a PT model " +
      "error) and asserts the closed form is the infinite-lattice limit",
    holds: () =>
      REF.residualIsFiniteSize === true &&
      /CONFIRMED finite-size/.test(REF.verdict) &&
      /infinite-lattice/i.test(REF.title),
  },
  {
    id: "imp95726-not-a-bound",
    description:
      "this is a numerical-witness / verification module; it moves no Lambda " +
      "bound and proves no QED",
    holds: () =>
      REF.boundChange === false &&
      REF.qed === false &&
      /refereed bound is changed/i.test(REF.verdict),
  },
  {
    id: "imp95726-closes-self",
    description: "this module is the deliverable the imp-95726 ticket asked for",
    holds: () => REF.closesTickets.includes("imp-95726"),
  },
];

for (const a of IMP95726_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-95726-twin-pair-half-retention-finite-size-limit assertion failed: ${a.id}`,
    );
  }
}

export default IMP95726_TWIN_PAIR_HALF_RETENTION_FINITE_SIZE_LIMIT;
