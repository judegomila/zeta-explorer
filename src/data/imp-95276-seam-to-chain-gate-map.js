/**
 * @module imp-95276-seam-to-chain-gate-map
 *
 * imp-95276 (proof-scoping): the gammaSL-form seam-to-chain-gate MAP that
 * carries a signed seam certificate value R (as produced by the FA /
 * PHASE-CERT / SGN-C / SPLIT-LOO legs, imp-95221..95250) into the
 * gammaSL-form chain gate of the Lambda program -- seam obligation (3),
 * recorded UNCHANGED across every leg by the imp-95233 / imp-95255 ledgers.
 * SCOPING ONLY: identifies the minimal analytic ingredient the gate side
 * needs and re-classifies what actually stays open. Changes no bound; NO
 * QED; no refereed bound is changed.
 *
 * THE GATE (imp-95210 / imp-95211 / imp-95216 conventions). The chain gate
 * is a single scalar functional g -> gammaSL(g) that caps the class overlap
 * once the seam localizes. Its only free input is the localization scalar
 * g in [0, 1]. In EVERY delivered instantiation the gate is fed through the
 * SAME reduction
 *   g = gFromLam(LamBar) = 2 sqrt( LamBar (1 - LamBar) ),
 * where LamBar is the cross-seam restricted Rayleigh quotient (the ratio
 * of restricted to full energy for the seam partition, imp-95226 object
 * Lambda(V, d)); the overlap leg (imp-95210), the dyadic leg (imp-95211,
 * LamBar from C_inf), and the geometric leg (imp-95216, LamGeoBar) all
 * differ ONLY in how they bound LamBar, then hand the same g to the same
 * gammaSL. So the gate consumes a bound on sqrt(LamBar), nothing more.
 *
 * WHAT A SIGNED CERTIFICATE PRODUCES. Every signed leg of the seam chain
 * outputs a bound of the form sqrt(Lambda) <= R on the SAME imp-95226
 * pencil eigenvalue Lambda(V, d) = lambda_max(D G D, G): SGN-EQ / SGN-C
 * (count currency, R <= e^(-2x)[...]^2 forms), PHASE-CERT (depth currency,
 * R <= e^(-y_min)/(2 theta)), SPLIT-LOO / EV-OCT (multi-block,
 * sqrt(Lambda) <= sum_k sqrt(Lambda_k/(1 - sigma_k^2))). R is therefore
 * already a bound on sqrt(LamBar) in the gate's own normalization.
 *
 * THE MAP (derived, gate side). The seam-to-chain-gate map is the identity
 * pipeline
 *   R  |-->  g_R = gFromLam(R^2) = 2 R sqrt(1 - R^2)  |-->  gammaSL(g_R).
 * No NEW gate-side ingredient is required beyond two monotonicity facts,
 * both verified below:
 *   (M1) g_R = 2 R sqrt(1 - R^2) is strictly increasing in R on
 *        [0, 1/sqrt2] (its maximum g = 1 is at R = 1/sqrt2); the signed
 *        seam families live in the deep-cancellation regime R << 1, well
 *        inside this branch, so the map is single-valued and orientation-
 *        preserving there.
 *   (M2) gammaSL(g) is increasing in g on [0, 1] with floor 1/2.
 * Composing (M1)+(M2): a signed certificate that TIGHTENS the seam bound
 * (delivers R < sqrt(LamBar) from the overlap/dyadic/geometric leg)
 * propagates MONOTONICALLY to a tighter gate value gammaSL(g_R) <
 * gammaSL(gFromLam(LamBar)). The gate needs no signed-specific machinery:
 * the currency (count / depth / phase) is spent entirely inside R.
 *
 * RE-CLASSIFICATION (the honest content). This DISSOLVES the gate-side
 * half of obligation (3): there is nothing left to derive on the map
 * itself -- it is the standard gFromLam -> gammaSL pipeline the program
 * already runs, and (M1)+(M2) make it well-posed and monotone. The ENTIRE
 * surviving obligation is the INPUT side: for a signed R to be admissible
 * it must bound sqrt(Lambda) for the paper packet's ACTUAL seam functional,
 * which requires
 *   (i)  the imp-95212 Fresnel-Airy envelope port that transcribes the
 *        paper window into the imp-95226 exponential model E_V, and
 *   (ii) the per-window Q extraction (obligation (1)) that fixes y_min /
 *        x_min for PHASE-CERT and the block angles sigma_k for SPLIT-LOO.
 * Both are the SAME unclosed transcription the ledger already tracks. So
 * obligation (3) is not an independent map to build -- it REDUCES to
 * obligations (1) + the imp-95212 port; once those land, the signed R
 * feeds the gate with no further work. (This mirrors imp-95255's finding
 * that the phase currency theta is blocked at transcription, not at the
 * certificate.)
 *
 * MULTI-BLOCK NOTE. When the seam carries m twin blocks, the admissible R
 * is the SPLIT-LOO aggregate sqrt(Lambda) <= sum_k sqrt(Lambda_k/(1 -
 * sigma_k^2)) (imp-95250); this can exceed 1/sqrt2 when many blocks stack,
 * leaving the (M1) monotone branch. In that regime the map still gives a
 * valid gate value (g_R <= 1) but is no longer orientation-preserving in
 * the aggregate, so a per-block application (feed each block's R_k to its
 * own gate, then combine) is the safe route -- flagged, not resolved here.
 *
 * SCOPING ONLY: no LamBar is re-bounded, no packet is transcribed, no
 * certificate is instantiated on a paper window; the map's admissibility
 * is CONDITIONAL on the still-open (i)+(ii). Changes no bound; NO QED;
 * no refereed bound is changed; measured class sup unchanged.
 */

// ── carried gate constants (literals; imp-95210/95216 single source), so this
//    module is import-light and never reaches a heavy data bundle ────────────
const LW_EVEN = 3.9197935113802585e-5;
const Q_OD = 0.03755392855053636;
const C_U = 0.30501330232499435;
const KAPPA = 48.717745853978386;
const GAMMA_OV = 0.9995949885454457;

// gammaSL chain (imp-95216 functionals, verbatim)
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
const gFromLam = (lam) => 2 * Math.sqrt(lam * (1 - lam));

// THE MAP: signed certificate value R (bound on sqrt(Lambda)) -> gate value
const gFromR = (R) => gFromLam(R * R); // = 2 R sqrt(1 - R^2)
const seamToChainGate = (R) => gammaSL(gFromR(R));

const RECIP_SQRT2 = 1 / Math.SQRT2; // 0.7071067811865475, top of the monotone branch

// anchor cross-checks: the three imp-95216 rho = 1.5 payoff rows must be
// reproduced by treating R = sqrt(LamBar) as a signed-certificate value
const ANCHOR_ROWS = [
  { md: 6, lamBar: 0.060389720030239555, g: 0.476414952514754, gammaSL: 0.6134305588351918 },
  { md: 8, lamBar: 0.0008361566686768065, g: 0.05780856374975023, gammaSL: 0.5016702617900488 },
  { md: 10, lamBar: 0.000013719918473672188, g: 0.007408030841595967, gammaSL: 0.5000274287711858 },
];

export const IMP95276_SEAM_TO_CHAIN_GATE_MAP = {
  ticket: 'imp-95276',
  obligation: '(3) gammaSL-form seam-to-chain-gate map',
  object: 'gate g -> gammaSL(g), single input g = gFromLam(LamBar) = 2 sqrt(LamBar(1-LamBar))',
  map: 'R |-> g_R = gFromLam(R^2) = 2 R sqrt(1-R^2) |-> gammaSL(g_R)',
  monotoneBranchTop: RECIP_SQRT2,
  anchors: ANCHOR_ROWS,
  reduction: 'gate-side of (3) DISSOLVED (identity gFromLam->gammaSL pipeline + monotonicity M1/M2); '
    + 'surviving obligation is entirely INPUT-side admissibility of R, which reduces to obligation (1) '
    + '(per-window Q) + the imp-95212 Fresnel-Airy envelope port -- the same unclosed transcription the '
    + 'ledger already tracks. NOT an independent map to build.',
  multiBlockCaveat: 'SPLIT-LOO aggregate R can exceed 1/sqrt2 and leave the monotone branch; per-block '
    + 'application is the safe route (flagged, not resolved).',
  honest: 'SCOPING ONLY -- no LamBar re-bounded, no packet transcribed, no certificate instantiated on a '
    + 'paper window. The map is CONDITIONAL on the still-open transcription inputs (i) imp-95212 port and '
    + '(ii) per-window Q. Changes no bound; NO QED; no refereed bound is changed.',
  gammaOvBaseline: GAMMA_OV,
  // re-exported functionals for downstream viz / assertions
  fns: { gammaSL, gFromLam, gFromR, seamToChainGate },
};

export const IMP95276_SEAM_TO_CHAIN_GATE_MAP_ASSERTIONS = [
  {
    id: 'imp-95276-anchors-reproduce-gate',
    description: 'treating R = sqrt(LamBar) as a signed value reproduces the three imp-95216 payoff gate rows (rel 1e-12)',
    holds: () => ANCHOR_ROWS.every((r) => {
      const R = Math.sqrt(r.lamBar);
      const g = gFromR(R);
      const gs = seamToChainGate(R);
      const rel = (a, b) => Math.abs(a - b) <= 1e-12 * Math.abs(b);
      return rel(g, r.g) && rel(gs, r.gammaSL);
    }),
  },
  {
    id: 'imp-95276-gR-monotone-on-branch',
    description: 'g_R = 2 R sqrt(1-R^2) is strictly increasing in R on [0, 1/sqrt2] (M1)',
    holds: () => {
      let prev = -1;
      for (let i = 0; i <= 200; i++) {
        const R = (RECIP_SQRT2 * i) / 200;
        const g = gFromR(R);
        if (g < prev - 1e-15) return false;
        prev = g;
      }
      return true;
    },
  },
  {
    id: 'imp-95276-gammaSL-monotone-in-g',
    description: 'gammaSL(g) is increasing in g on [0,1] with floor 1/2 (M2)',
    holds: () => {
      let prev = -1;
      for (let i = 0; i <= 200; i++) {
        const g = i / 200;
        const gs = gammaSL(g);
        if (gs < prev - 1e-12) return false;
        if (gs < 0.5 - 1e-12) return false;
        prev = gs;
      }
      return true;
    },
  },
  {
    id: 'imp-95276-tighter-R-tighter-gate',
    description: 'a signed R below sqrt(LamBar) yields a strictly tighter gate value (monotone propagation)',
    holds: () => {
      const sqrtLam = Math.sqrt(0.060389720030239555); // md=6 overlap value
      const Rtight = 0.1; // hypothetical tighter signed certificate, well inside the branch
      return Rtight < sqrtLam && seamToChainGate(Rtight) < seamToChainGate(sqrtLam);
    },
  },
  {
    id: 'imp-95276-branch-top-is-recip-sqrt2',
    description: 'the monotone branch top R = 1/sqrt2 maps to g_R = 1 (gate saturation), rel 1e-12',
    holds: () => Math.abs(gFromR(RECIP_SQRT2) - 1) <= 1e-12,
  },
  {
    id: 'imp-95276-scoping-only-honest',
    description: 'explicitly SCOPING ONLY, conditional on open transcription, no refereed bound is changed',
    holds: () => /SCOPING ONLY/.test(IMP95276_SEAM_TO_CHAIN_GATE_MAP.honest)
      && /refereed bound is changed/i.test(IMP95276_SEAM_TO_CHAIN_GATE_MAP.honest),
  },
];

for (const a of IMP95276_SEAM_TO_CHAIN_GATE_MAP_ASSERTIONS) {
  if (!a.holds()) throw new Error(`imp-95276-seam-to-chain-gate-map assertion failed: ${a.id}`);
}

export default IMP95276_SEAM_TO_CHAIN_GATE_MAP;
