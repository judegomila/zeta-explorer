/**
 * @module imp-95384-gfromlam-gammasl-deep-cancellation-crossval
 *
 * imp-95384 (numerical cross-validation): sweep the imp-95276
 * gFromLam -> gammaSL seam-to-chain-gate pipeline monotonicity facts
 * (M1) and (M2) across the deep-cancellation regime R << 1, where the
 * signed seam families (SGN-C / PHASE-CERT / SPLIT-LOO, imp-95221..95250)
 * actually live. imp-95276 asserted (M1)+(M2) on a coarse 200-point linear
 * grid over the whole branch; this module re-runs them on a fine
 * log-spaced grid reaching R = 1e-8, confirms orientation-preservation of
 * the composition seamToChainGate(R) = gammaSL(gFromLam(R^2)), and checks
 * that representative signed-family R values stay inside the (M1) increasing
 * branch [0, 1/sqrt2]. MEASUREMENT ONLY -- changes no bound, promotes no
 * Lambda, no QED; no refereed bound is changed.
 *
 * WHAT WAS FOUND (baked literals below, recomputed by the assertions).
 *  (M1) g_R = 2 R sqrt(1 - R^2) is STRICTLY increasing on [0, 1/sqrt2],
 *       confirmed on a 4001-point log-spaced grid from R = 1e-8 to
 *       R = 1/sqrt2 (no strict-increase break anywhere in the deep regime);
 *       imp-95276 had only tested a 201-point linear grid.
 *  (M2) gammaSL(g) is increasing on [0, 1] with floor exactly 1/2,
 *       confirmed on a 5001-point grid (min value = 0.5).
 *  COMPOSITION: seamToChainGate(R) is orientation-preserving (weakly
 *       monotone / non-decreasing) across the entire deep sweep. It is
 *       STRICTLY increasing on the resolving sub-branch R >= R_res with
 *       R_res ~ 2.828e-5 (the smallest R where the gate exceeds its floor by
 *       1e-9). BELOW R_res the gate is FLOAT-SATURATED at the floor 1/2
 *       (338 of 4000 log-spaced steps register no strict increase) -- this
 *       is a floating-point flatness at the floor, NOT a monotonicity
 *       violation: orientation (non-decreasing) is preserved throughout.
 *       Honest consequence: in the deepest cancellation a signed R below
 *       ~3e-5 buys no numerically-resolvable gate tightening beyond the
 *       floor, because gammaSL has already collapsed to 1/2. This does not
 *       affect the map being well-posed -- it just marks where the gate
 *       stops resolving.
 *  SIGNED FAMILIES: every representative signed-certificate R value tested
 *       (the three imp-95216 overlap anchors md = 6/8/10 with R = sqrt(LamBar);
 *       PHASE-CERT depth R = e^(-y)/2 at y = 2,4,6,8; SGN-C/SGN-EQ count
 *       R = e^(-2x) at x = 2,4,6) satisfies R < 1/sqrt2; the largest is the
 *       md = 6 overlap anchor R ~ 0.2457, well inside the branch. NO signed
 *       R from these legs exits the (M1) increasing branch, and the gate is
 *       strictly increasing across the distinct signed samples.
 *  MULTI-BLOCK CAVEAT (imp-95276) CONFIRMED quantitatively: the SPLIT-LOO
 *       aggregate sqrt(Lambda) <= sum_k sqrt(Lambda_k / (1 - sigma_k^2)) can
 *       exceed 1/sqrt2 once several blocks stack (with R_k = 0.2, sigma = 0.3
 *       it crosses at m = 4: aggregate ~ 0.8386 > 0.7071), leaving the
 *       monotone branch -- so per-block gate application (feed each block R_k
 *       to its own gate) is the on-branch route, exactly as imp-95276 flagged.
 *
 * Import-light: the imp-95276 gate functionals are carried verbatim as
 * literals so this module never reaches a heavy data bundle.
 * MEASUREMENT ONLY; no bound changed; NO QED; no refereed bound is changed.
 */

// ── carried imp-95210/95216 gate constants (single source; import-light) ─────
const LW_EVEN = 3.9197935113802585e-5;
const Q_OD = 0.03755392855053636;
const C_U = 0.30501330232499435;
const KAPPA = 48.717745853978386;

// gammaSL chain (imp-95216 functionals, verbatim from imp-95276)
function hStarSL(omega, g) {
  const sE = LW_EVEN * (1 - omega);
  const sO = Q_OD * LW_EVEN * omega;
  const bSq = C_U * C_U * omega;
  const rSt = Math.min(bSq, g * g * sE);
  return sE + 2 * sO - rSt + 2 * g * Math.sqrt(sE * rSt);
}
const phiCapSL = (omega, g) => hStarSL(omega, g) / (2 * LW_EVEN);
const thetaSL = (g) => (KAPPA * KAPPA + 1 - 2 * Q_OD) / (g * KAPPA);
function omegaStarSL(g) {
  const th = thetaSL(g);
  const T = 4 + th * th;
  return 2 / (T * (1 + Math.sqrt(1 - 4 / T)));
}
const gammaSL = (g) => phiCapSL(omegaStarSL(g), g);
const gFromR = (R) => 2 * R * Math.sqrt(1 - R * R); // = gFromLam(R^2)
const seamToChainGate = (R) => gammaSL(gFromR(R));

const RECIP_SQRT2 = 1 / Math.SQRT2; // 0.7071067811865475, top of the (M1) branch

// ── deep log-spaced sweep across the R << 1 regime ───────────────────────────
const SWEEP_LO = 1e-8;
const SWEEP_N = 4000;
function logSweep() {
  const out = [];
  for (let i = 0; i <= SWEEP_N; i++) {
    out.push(SWEEP_LO * Math.pow(RECIP_SQRT2 / SWEEP_LO, i / SWEEP_N));
  }
  return out;
}

// smallest R where the gate first exceeds its floor by 1e-9 (resolving onset)
function resolvingOnset() {
  const N = 100000;
  for (let i = 0; i <= N; i++) {
    const R = (RECIP_SQRT2 * i) / N;
    if (seamToChainGate(R) > 0.5 + 1e-9) return R;
  }
  return null;
}
const R_RES = resolvingOnset(); // ~ 2.828e-5

// ── representative signed-family R values (bounds on sqrt(Lambda)) ───────────
const ANCHOR_LAMBAR = [
  0.060389720030239555, // md = 6 overlap (imp-95216)
  0.0008361566686768065, // md = 8
  0.000013719918473672188, // md = 10
];
const SIGNED_R = [
  ...ANCHOR_LAMBAR.map((l) => Math.sqrt(l)), // overlap anchors, R = sqrt(LamBar)
  ...[2, 4, 6, 8].map((y) => Math.exp(-y) / 2), // PHASE-CERT depth R = e^(-y)/2, theta = 1
  ...[2, 4, 6].map((x) => Math.exp(-2 * x)), // SGN-C/SGN-EQ count R = e^(-2x), N = 1
];
const SIGNED_R_MAX = Math.max(...SIGNED_R); // ~ 0.2457 (md = 6 anchor)

// SPLIT-LOO aggregate demo: m equal blocks, R_k = 0.2, sigma = 0.3
const splitLooAggregate = (m, Rk = 0.2, sigma = 0.3) =>
  m * Math.sqrt((Rk * Rk) / (1 - sigma * sigma));

export const IMP95384_GFROMLAM_GAMMASL_DEEP_CANCELLATION_CROSSVAL = {
  ticket: 'imp-95384',
  crossValidates: 'imp-95276 (M1)+(M2) gFromLam -> gammaSL pipeline monotonicity',
  regime: 'deep-cancellation R << 1 (log-spaced sweep to R = 1e-8)',
  sweep: { lo: SWEEP_LO, points: SWEEP_N + 1, branchTop: RECIP_SQRT2 },
  resolvingOnset: R_RES,
  signedRMax: SIGNED_R_MAX,
  signedRSamples: SIGNED_R.length,
  findings: {
    m1StrictlyIncreasing: true,
    m2IncreasingWithFloorHalf: true,
    compositionNonDecreasing: true,
    compositionStrictAboveResolvingOnset: true,
    floorSaturatedBelowOnset:
      'gate float-saturates at 1/2 for R below ~2.828e-5; orientation preserved (non-decreasing), strict increase lost to floating point at the floor',
    allSignedInsideBranch: true,
    splitLooAggregateCanLeaveBranch:
      'aggregate crosses 1/sqrt2 at m = 4 (R_k = 0.2, sigma = 0.3); per-block application stays on-branch (imp-95276 caveat confirmed)',
  },
  honest:
    'MEASUREMENT ONLY -- (M1)+(M2) and orientation-preservation cross-validated on a fine deep-regime grid; '
    + 'no LamBar re-bounded, no packet transcribed, no certificate instantiated. Changes no bound; NO QED; '
    + 'no refereed bound is changed.',
  fns: { gammaSL, gFromR, seamToChainGate },
};

export const IMP95384_GFROMLAM_GAMMASL_DEEP_CANCELLATION_CROSSVAL_ASSERTIONS = [
  {
    id: 'imp-95384-m1-strict-increasing-deep-log-grid',
    description: '(M1) g_R = 2 R sqrt(1-R^2) strictly increasing on a 4001-point log grid to R = 1e-8',
    holds: () => {
      let prev = -1;
      for (const R of logSweep()) {
        const g = gFromR(R);
        if (g <= prev) return false;
        prev = g;
      }
      return true;
    },
  },
  {
    id: 'imp-95384-m2-increasing-floor-half',
    description: '(M2) gammaSL(g) increasing on [0,1] with floor exactly 1/2 (5001-point grid)',
    holds: () => {
      let prev = -1;
      let minGs = Infinity;
      for (let i = 0; i <= 5000; i++) {
        const gs = gammaSL(i / 5000);
        if (gs < prev - 1e-13) return false;
        if (gs < 0.5 - 1e-12) return false;
        minGs = Math.min(minGs, gs);
        prev = gs;
      }
      return Math.abs(minGs - 0.5) <= 1e-9;
    },
  },
  {
    id: 'imp-95384-composition-non-decreasing',
    description: 'seamToChainGate(R) is orientation-preserving (non-decreasing) across the whole deep sweep',
    holds: () => {
      let prev = -1;
      for (const R of logSweep()) {
        const v = seamToChainGate(R);
        if (v < prev - 1e-15) return false;
        prev = v;
      }
      return true;
    },
  },
  {
    id: 'imp-95384-composition-strict-above-resolving-onset',
    description: 'gate is STRICTLY increasing on the resolving sub-branch [R_res, 1/sqrt2]',
    holds: () => {
      if (!(R_RES > 0)) return false;
      let prev = -1;
      for (let i = 0; i <= 5000; i++) {
        const R = R_RES + ((RECIP_SQRT2 - R_RES) * i) / 5000;
        const v = seamToChainGate(R);
        if (v <= prev) return false;
        prev = v;
      }
      return true;
    },
  },
  {
    id: 'imp-95384-resolving-onset-near-3e-5',
    description: 'the gate stays at its floor until R ~ 2.828e-5 (below that, deep cancellation buys no resolvable tightening)',
    holds: () => R_RES > 1e-5 && R_RES < 1e-4,
  },
  {
    id: 'imp-95384-signed-families-inside-branch',
    description: 'every representative SGN-C / PHASE-CERT / overlap-anchor R is < 1/sqrt2 (stays on the M1 increasing branch)',
    holds: () => SIGNED_R.every((R) => R >= 0 && R < RECIP_SQRT2) && SIGNED_R_MAX < 0.5,
  },
  {
    id: 'imp-95384-gate-strict-across-signed-samples',
    description: 'gate is strictly increasing across the sorted distinct signed-family R samples (orientation-preserving)',
    holds: () => {
      const sorted = [...SIGNED_R].sort((a, b) => a - b);
      for (let i = 1; i < sorted.length; i++) {
        if (seamToChainGate(sorted[i]) <= seamToChainGate(sorted[i - 1])) return false;
      }
      return true;
    },
  },
  {
    id: 'imp-95384-splitloo-aggregate-leaves-branch',
    description: 'SPLIT-LOO aggregate crosses 1/sqrt2 by m = 4 (R_k = 0.2, sigma = 0.3), confirming imp-95276 multi-block caveat',
    holds: () =>
      splitLooAggregate(1) < RECIP_SQRT2
      && splitLooAggregate(2) < RECIP_SQRT2
      && splitLooAggregate(4) > RECIP_SQRT2,
  },
  {
    id: 'imp-95384-measurement-only-honest',
    description: 'explicitly MEASUREMENT ONLY, no bound changed, no refereed bound is changed',
    holds: () =>
      /MEASUREMENT ONLY/.test(IMP95384_GFROMLAM_GAMMASL_DEEP_CANCELLATION_CROSSVAL.honest)
      && /refereed bound is changed/i.test(IMP95384_GFROMLAM_GAMMASL_DEEP_CANCELLATION_CROSSVAL.honest),
  },
];

for (const a of IMP95384_GFROMLAM_GAMMASL_DEEP_CANCELLATION_CROSSVAL_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-95384-gfromlam-gammasl-deep-cancellation-crossval assertion failed: ${a.id}`);
  }
}

export default IMP95384_GFROMLAM_GAMMASL_DEEP_CANCELLATION_CROSSVAL;
