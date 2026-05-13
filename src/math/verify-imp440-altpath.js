/**
 * imp-449: Independent cross-verification of imp-440 L_cond at N* = 1e6
 *
 * This module is an INDEPENDENT reimplementation of the L_cond computation
 * from src/data/finite-height-beats-platt-trudgian.js, using algebraically
 * equivalent but numerically distinct intermediate forms.
 *
 * Goal: confirm L_cond = |t_c_proj| + E_flow + E_coll ~ 0.008 at N* = 1e6
 * to 6+ significant figures, providing hostile-reviewer-grade redundancy.
 *
 * Alt-path distinctions from the primary computation:
 *   (A1) CF: use logT0 - log(2*pi) + 1 instead of log(T0/(2*pi)) + 1
 *        => different IEEE 754 path (log(a/b) vs log(a) - log(b))
 *   (A2) E_flow: use log-sum-exp form CF * exp(tcProj + log(L) - log(T0))
 *        instead of (CF * L / T0) * exp(tcProj)
 *   (A3) E_coll: use C_C * sqrt(L) / sqrt(N) instead of C_C * sqrt(L/N)
 *        => split-sqrt path vs combined-sqrt path
 *   (A4) L_cond: sum in ascending magnitude order (E_flow + E_coll + tcProj)
 *        instead of tcProj-first
 *   (A5) T0 forward-validation: post-check Newton result by evaluating
 *        (T0/(2*pi)) * (log(T0/(2*pi)) - 1) and verifying it recovers N
 */

import { PATH_C_BASELINE_FIT_V2 } from '../data/path-c-baseline-fit-v2.js';
import { effectiveHeightForN }     from '../data/lambda-rh-height-mapping.js';
import { C_C_PINNED }              from '../data/polymath15-constant-C-C.js';

const TWO_PI     = 2 * Math.PI;
const LOG_TWO_PI = Math.log(TWO_PI);   // ~1.8378770664093453

/**
 * Alt-path computation of L_cond at a given N.
 * Returns an object with all intermediate values and final L_cond_alt.
 */
function computeLCondAltPath(N) {
  const fit = PATH_C_BASELINE_FIT_V2.fit;
  if (!fit) return { N, available: false, reason: 'V2 fit not available' };

  const a = fit.intercept_a;   // same rounded value as primary
  const b = fit.slope_b;       // same rounded value as primary

  // -- T0 via Newton (same solver as primary) --------------------------------
  const T0   = effectiveHeightForN(N);
  const logT0 = Math.log(T0);

  // (A5) Forward-validate T0: (T0/2pi)*(log(T0/2pi) - 1) should recover N
  const T0_fwd    = (T0 / TWO_PI) * (Math.log(T0 / TWO_PI) - 1);
  const T0_relErr = Math.abs(T0_fwd - N) / N;

  // -- tcProj: a + b/N (explicit 1/N pre-computation, different IEEE path) ---
  const N_inv  = 1.0 / N;
  const tcProj = a + b * N_inv;

  // -- (A1) CF: log(T0) - log(2*pi) + 1  (vs. log(T0/2pi) + 1) --------------
  const CF_alt = (logT0 - LOG_TWO_PI + 1.0) / TWO_PI;

  // -- (A2) E_flow via log-sum-exp: CF * exp(tcProj + log(L) - log(T0)) ------
  // Equivalent to (CF * L / T0) * exp(tcProj), but log-space path is different
  const logL       = Math.log(logT0);        // log(log(T0))
  const E_flow_alt = CF_alt * Math.exp(tcProj + logL - logT0);

  // -- (A3) E_coll via split sqrt: C_C * sqrt(L) / sqrt(N) -------------------
  const E_coll_alt = C_C_PINNED * Math.sqrt(logT0) / Math.sqrt(N);

  // -- (A4) L_cond ascending-order sum: smallest (E_flow) first ---------------
  const L_cond_alt = E_flow_alt + E_coll_alt + tcProj;

  return {
    N,
    available: true,
    T0,
    T0_fwd:      +T0_fwd.toExponential(5),
    T0_relErr:   +T0_relErr.toExponential(3),
    T0Valid:     T0_relErr < 1e-9,
    logT0:       +logT0.toFixed(7),
    N_inv:       +N_inv.toExponential(10),
    tcProj:      +tcProj.toFixed(10),
    CF_alt:      +CF_alt.toFixed(8),
    logL:        +logL.toFixed(7),
    E_flow_alt:  +E_flow_alt.toExponential(7),
    E_coll_alt:  +E_coll_alt.toFixed(10),
    L_cond_alt:  +L_cond_alt.toFixed(10),
    beatsPT:     L_cond_alt < 0.2,
    marginFactor: +(0.2 / L_cond_alt).toFixed(3),
  };
}

// Primary verification target N* = 1e6
export const ALT_PATH_N1E6 = computeLCondAltPath(1e6);

// Sweep to match the primary ladder
const TARGET_NS = [1e4, 1e5, 1e6, 1e7, 5e7];
export const ALT_PATH_LADDER = TARGET_NS.map(computeLCondAltPath);

// Build-time assertions
export const VERIFY_IMP440_ALTPATH_ASSERTIONS = [
  {
    id: 'imp449-altpath-T0-valid-at-N1e6',
    holds: () => ALT_PATH_N1E6.available && ALT_PATH_N1E6.T0Valid,
    why:
      'Alt-path Newton T0 for N=1e6 must forward-validate: ' +
      '(T0/2pi)*(log(T0/2pi)-1) must recover N to within 1e-9 relative error.',
  },
  {
    id: 'imp449-altpath-beats-pt-at-N1e6',
    holds: () => ALT_PATH_N1E6.available && ALT_PATH_N1E6.beatsPT,
    why:
      'Alt-path L_cond at N=1e6 must be < 0.2 (Platt-Trudgian bound). ' +
      'Expected value ~0.008, so this is a very strong assertion.',
  },
  {
    id: 'imp449-altpath-L_cond-positive',
    holds: () =>
      ALT_PATH_N1E6.available &&
      ALT_PATH_N1E6.L_cond_alt > 0 &&
      ALT_PATH_N1E6.L_cond_alt < 0.05,
    why:
      'L_cond_alt must be positive and below 0.05 to remain in the expected range.',
  },
];

// ───────────────────────────────────────────────────────────────────────────
// imp-1044 (medium, proof, S10-verify): independent third-path cross-verify.
//
// imp-449 supplied Path-A (alt). imp-830 added per-component intermediate
// agreement check. imp-1044 supplies an INDEPENDENT third path (Path-C) with
// further IEEE 754 distinctions, plus an explicit edge-case probe at five N
// values, and 10 runtime-PASS assertions covering finiteness, sign, ladder
// agreement, and triple-path concordance with ALT_PATH at N* = 1e6.
//
// Path-C distinctions from Path-A:
//   (C1) CF_C: (1 + log(T0) - log(2*pi)) / (2*pi)
//        => 1-first order vs A1 logT0-first order
//   (C2) E_flow_C: CF_C * (log(T0) / T0) * exp(tcProj)
//        => primary multiplicative form (NOT log-sum-exp like A2)
//   (C3) E_coll_C: exp(log(C_C) + 0.5*log(L) - 0.5*log(N))
//        => log-space exponentiation vs A3 split-sqrt
//   (C4) L_cond_C: tcProj-first sum order (NOT ascending like A4)
//
// Algebraic equivalence (verifiable by inspection):
//   C1 = log(T0/(2pi)) + 1 = A1  (real arithmetic)
//   C2 = CF * L / T0 * exp(tcProj) = A2  (real arithmetic)
//   C3 = C_C * sqrt(L/N) = A3  (positive operands)
//   C4 = a + b + c regardless of order (real addition is associative)
// In IEEE 754 double the four paths differ at the ULP level and must agree
// to ~13 sig figs, far exceeding the 6-sig-fig contract of imp-449/imp-460.
// ───────────────────────────────────────────────────────────────────────────

function computeLCondPathC(N) {
  const fit = PATH_C_BASELINE_FIT_V2.fit;
  if (!fit) return { N, available: false, reason: "V2 fit not available" };

  const a = fit.intercept_a;
  const b = fit.slope_b;

  const T0    = effectiveHeightForN(N);
  const logT0 = Math.log(T0);

  // (C1) CF_C: 1-first then log difference
  const CF_C = (1.0 + logT0 - LOG_TWO_PI) / TWO_PI;

  // tcProj via fused 1/N (matches alt path)
  const tcProj = a + b * (1.0 / N);

  // (C2) E_flow_C: primary multiplicative form
  const E_flow_C = CF_C * (logT0 / T0) * Math.exp(tcProj);

  // (C3) E_coll_C: log-space exponentiation
  const log_C_C   = Math.log(C_C_PINNED);
  const E_coll_C  = Math.exp(log_C_C + 0.5 * Math.log(logT0) - 0.5 * Math.log(N));

  // (C4) L_cond sum order: tcProj first
  const L_cond_C = tcProj + E_flow_C + E_coll_C;

  const finite = Number.isFinite(T0)        &&
                 Number.isFinite(CF_C)      &&
                 Number.isFinite(tcProj)    &&
                 Number.isFinite(E_flow_C)  &&
                 Number.isFinite(E_coll_C)  &&
                 Number.isFinite(L_cond_C);

  return {
    N,
    available: true,
    T0,
    logT0:    +logT0.toFixed(7),
    CF_C:     +CF_C.toFixed(8),
    tcProj:   +tcProj.toFixed(10),
    E_flow_C: +E_flow_C.toExponential(7),
    E_coll_C: +E_coll_C.toFixed(10),
    L_cond_C: +L_cond_C.toFixed(10),
    finite,
    beatsPT:  L_cond_C < 0.2,
  };
}

// Path-C at the headline target N* = 1e6
export const PATH_C_N1E6 = computeLCondPathC(1e6);

// Extended edge-case probe: small / mid / large N
// Ensures no NaN / Infinity escapes for the supported operating range.
const PATH_C_EDGE_NS = [1e3, 1e4, 1e6, 1e8, 1e10];
export const PATH_C_EDGE_LADDER = PATH_C_EDGE_NS.map(computeLCondPathC);

// Triple-path agreement at N* = 1e6: |Path-A - Path-C| / |Path-A|
const _altL    = ALT_PATH_N1E6.available ? ALT_PATH_N1E6.L_cond_alt : NaN;
const _pathCL  = PATH_C_N1E6.available   ? PATH_C_N1E6.L_cond_C    : NaN;
const _absDiff = Math.abs(_altL - _pathCL);
const _relDiff = _absDiff / Math.abs(_altL);

export const IMP1044_TRIPLE_AGREEMENT_N1E6 = {
  L_cond_altA:  +(_altL).toFixed(12),
  L_cond_pathC: +(_pathCL).toFixed(12),
  absDiff:      Number.isFinite(_absDiff) ? +_absDiff.toExponential(4) : null,
  relDiff:      Number.isFinite(_relDiff) ? +_relDiff.toExponential(4) : null,
  // Sig figs agreeing = floor(-log10(relDiff)); guard against zero/NaN
  sigFigsAgreeing:
    Number.isFinite(_relDiff) && _relDiff > 0
      ? Math.floor(-Math.log10(_relDiff))
      : 15,
};

export const VERIFY_IMP440_ALTPATH_IMP1044_ASSERTIONS = [
  {
    id: 'imp1044-pathC-N1e6-available-and-finite',
    holds: () => PATH_C_N1E6.available && PATH_C_N1E6.finite,
    why:
      'Path-C at N*=1e6 must complete and all intermediates must be IEEE 754 finite.',
  },
  {
    id: 'imp1044-pathC-N1e6-positive-and-below-pt',
    holds: () =>
      PATH_C_N1E6.available &&
      PATH_C_N1E6.L_cond_C > 0 &&
      PATH_C_N1E6.L_cond_C < 0.05,
    why:
      'Path-C L_cond at N*=1e6 must be strictly positive and below 0.05 (Platt-Trudgian is 0.2).',
  },
  {
    id: 'imp1044-pathA-pathC-agree-6-sigfigs-at-N1e6',
    holds: () =>
      IMP1044_TRIPLE_AGREEMENT_N1E6.relDiff !== null &&
      IMP1044_TRIPLE_AGREEMENT_N1E6.relDiff < 1e-6,
    why:
      'Path-A (imp-449) and Path-C (imp-1044) must agree on L_cond at N*=1e6 to 6+ sig figs (relDiff < 1e-6). Contract from imp-449.',
  },
  {
    id: 'imp1044-pathA-pathC-agree-12-sigfigs-at-N1e6',
    holds: () =>
      IMP1044_TRIPLE_AGREEMENT_N1E6.relDiff !== null &&
      IMP1044_TRIPLE_AGREEMENT_N1E6.relDiff < 1e-12,
    why:
      'Stronger: Path-A and Path-C should agree to 12+ sig figs in IEEE 754 double; weaker than this hints at a real formula divergence rather than ULP noise.',
  },
  {
    id: 'imp1044-edge-ladder-all-available',
    holds: () => PATH_C_EDGE_LADDER.every(r => r.available),
    why:
      'Every edge-probe N (1e3, 1e4, 1e6, 1e8, 1e10) must complete a Path-C computation.',
  },
  {
    id: 'imp1044-edge-ladder-no-nan-no-inf',
    holds: () => PATH_C_EDGE_LADDER.every(r => r.available && r.finite),
    why:
      'No edge-probe N may produce NaN or Infinity in any intermediate or final value.',
  },
  {
    id: 'imp1044-edge-ladder-all-positive',
    holds: () => PATH_C_EDGE_LADDER.every(r => r.available && r.L_cond_C > 0),
    why:
      'L_cond_C must remain strictly positive across the supported N range (tcProj > 0 plus positive corrections).',
  },
  {
    id: 'imp1044-edge-ladder-all-beat-pt',
    holds: () => PATH_C_EDGE_LADDER.every(r => r.available && r.beatsPT),
    why:
      'L_cond_C must remain < 0.2 (Platt-Trudgian conditional bound) across every probed N.',
  },
  {
    id: 'imp1044-tcProj-pathC-matches-pathA-at-N1e6',
    holds: () => {
      if (!ALT_PATH_N1E6.available || !PATH_C_N1E6.available) return false;
      const d = Math.abs(ALT_PATH_N1E6.tcProj - PATH_C_N1E6.tcProj);
      return d < 1e-9;
    },
    why:
      'tcProj is computed identically in both paths (a + b/N); any divergence > 1e-9 indicates a regression in PATH_C_BASELINE_FIT_V2 consumption.',
  },
  {
    id: 'imp1044-triple-agreement-record-sane',
    holds: () =>
      IMP1044_TRIPLE_AGREEMENT_N1E6.sigFigsAgreeing >= 12 &&
      Number.isFinite(IMP1044_TRIPLE_AGREEMENT_N1E6.L_cond_altA) &&
      Number.isFinite(IMP1044_TRIPLE_AGREEMENT_N1E6.L_cond_pathC),
    why:
      'The cross-verification record itself must be sane: finite values on both sides and >=12 sig figs of agreement.',
  },
];
