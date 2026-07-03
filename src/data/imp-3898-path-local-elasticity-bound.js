/**
 * @module imp-3898-path-local-elasticity-bound
 * @fileoverview imp-3898 (accuracy/derivation, HONEST PARTIAL): derive a
 * PATH-LOCAL horizon-elasticity bound anchored on the nearest-cumulative
 * distance Dmin, sharpening the global (8/smin^2) ceiling that imp-3874(e) and
 * imp-3870 measured to be 2000x-34000x loose. Proves a rigorous per-term
 * path-local majorant, establishes the exact Psi-weighted-average identity for
 * the realised elasticity, and CERTIFIES (live, against the imp-3874 baked
 * finite-difference data) that the Dmin-based effective constant 8/Dmin^2
 * reproduces the realised horizon elasticity to a factor in [0.83, 1.05] -- a
 * 2000x-35000x sharpening -- while HONESTLY flagging that 8/Dmin^2 is a sharp
 * PROXY, not itself a certified upper bound (the realised value exceeds it by
 * ~4.5% on 2 of 3 plateaus). The certified upper bound is the weighted
 * path-local majorant whose tail control is left as a named open sub-gap.
 *
 * SETTING (imp-3725 gap-domination bootstrap, thetaBar = 0.99, unchanged)
 * ----------------------------------------------------------------------
 * With T = H^2/(8*thetaBar) and s_l(T) = sqrt(max(g_l(0)^2 - 8T, 0)):
 *   D_j(T)   = sum of s_l over the gap path from the record pair a to zero j,
 *   Psi_N(T) = 4 H^2 * sum_{j not in pair} 1/D_j(T)^2,
 *   smin     = min over active gaps l != a of s_l(T)   (global smallest gap),
 *   Dmin     = min_j D_j(T)                            (nearest cumulative dist).
 * imp-3854 STEP-1 gives the EXACT per-term log-derivative (H fixed):
 *   e_j := d ln t_j/dT = (8/D_j) P_j,   P_j = sum_{l in path j} 1/s_l,
 *   t_j = 4 H^2 / D_j^2,   dPsi_N/dT = 32 H^2 sum_j P_j/D_j^3.
 * imp-3854 LEMMA bounded each s_l >= smin GLOBALLY and got the uniform ceiling
 * e_j <= 8/smin^2, hence 0 <= dPsi_N/dT <= (8/smin^2) Psi_N. imp-3874(e) verified
 * that ceiling but found it 2000x-34000x loose; imp-3870 traced the sharp
 * effective scale to the nearest-neighbour term (j = a+-1) whose single-gap path
 * has path-local minimum equal to Dmin, giving effective constant (H/Dmin)^2.
 *
 * DERIVATION 1 -- RIGOROUS PER-TERM PATH-LOCAL MAJORANT (sharper than global)
 * --------------------------------------------------------------------------
 * Let s_min(j) := min_{l in path j} s_l be the PATH-LOCAL smallest gap on the
 * path from a to j (each gap active). With m_j := |path j| terms:
 *   P_j = sum_{l in path j} 1/s_l <= m_j / s_min(j),
 *   D_j = sum_{l in path j} s_l   >= m_j * s_min(j),
 * so e_j = 8 P_j / D_j <= 8 (m_j / s_min(j)) / (m_j s_min(j)) = 8 / s_min(j)^2.
 * Because s_min(j) >= smin for every j, this path-local majorant is UNIFORMLY
 * SHARPER than the global one:  e_j <= 8/s_min(j)^2 <= 8/smin^2.
 * For the nearest term (single-gap path, m_j = 1) it is TIGHT: s_min(j) = D_j,
 * so e_{a+-1} = 8/D_j^2 exactly, and min over the two nearest terms is 8/Dmin^2.
 * The global ceiling is loose precisely because it charges EVERY path with the
 * far tail gap that only the far, negligibly weighted terms actually traverse.
 *
 * DERIVATION 2 -- EXACT PSI-WEIGHTED-AVERAGE IDENTITY FOR THE ELASTICITY
 * ---------------------------------------------------------------------
 * The realised horizon elasticity is an EXACT t_j-weighted average of the e_j:
 *   (dPsi_N/dT)/Psi_N = [sum_j t_j e_j] / [sum_j t_j] = sum_j w_j e_j,
 *   w_j = t_j / Psi_N = (1/D_j^2) / (sum_k 1/D_k^2).
 * The weights w_j ~ 1/D_j^2 concentrate hard on the smallest-D_j (nearest)
 * terms, whose e_j = 8/Dmin^2-scale. Hence the realised elasticity SITS at the
 * 8/Dmin^2 scale, perturbed by the O(1) tail whose weight is tiny. Combining
 * with Derivation 1 gives the RIGOROUS weighted majorant
 *   (dPsi_N/dT)/Psi_N <= 8 sum_j w_j / s_min(j)^2,
 * which -- unlike 8/smin^2 -- does NOT charge the near terms with the far tail
 * gap. Certifying that this weighted majorant collapses to C/Dmin^2 with an
 * EXPLICIT O(1) constant C needs the per-term s_min(j)/w_j tail profile (an
 * offline scan) and is the named open sub-gap below.
 *
 * WHAT IS CERTIFIED HERE (live, against imp-3874 finite-difference data)
 * ---------------------------------------------------------------------
 * For plateaus 0/4/9 (imp-3874 verified the flow there), using the LIVE
 * imp-3874 realised elasticity logSens = (dPsi/dT)/Psi and global ceiling
 * 8/smin^2, and the LIVE imp-3725 Dmin/H:
 *  (a) The Dmin-based effective constant dminCeil = 8/Dmin^2 is 7.71 / 17.61 /
 *      16.72 -- an O(1)-O(18) scale matching the realised logSens 8.06 / 14.56 /
 *      17.45 to a factor sharpRatio = logSens/dminCeil in [0.827, 1.045].
 *  (b) The global ceiling 8/smin^2 over-shoots the realised elasticity by
 *      globalSlack = 2279x / 2404x / 34004x -- the imp-3874(e)/imp-3870 looseness.
 *  (c) The Dmin effective constant is dminVsGlobal = 8/smin^2 over 8/Dmin^2 =
 *      1987x-35493x SHARPER than the global one, i.e. the whole looseness is the
 *      global-smin-vs-path-local-Dmin substitution, exactly as imp-3870 argued.
 *  (d) HONESTY: 8/Dmin^2 is a SHARP PROXY, NOT a certified upper bound -- the
 *      realised elasticity EXCEEDS it (sharpRatio > 1) on plateaus 0 and 9 by
 *      ~4.4%-4.5% because far terms with small path-local gaps carry elasticity
 *      above 8/Dmin^2 at nonzero (if tiny) weight. The certified upper bound is
 *      the Derivation-2 weighted path-local majorant, not the bare 8/Dmin^2.
 *
 * HONEST SCOPE
 * ------------
 *  - DERIVATION of a rigorous per-term path-local majorant (e_j <= 8/s_min(j)^2,
 *    sharper than the global 8/smin^2) + the exact weighted-average identity;
 *    CERTIFICATION that the Dmin effective constant is an O(1) sharp proxy on
 *    the 3 imp-3874 plateaus. Everything numeric is LIVE from imp-3874/imp-3725;
 *    nothing new is baked.
 *  - This SHARPENS the elasticity characterization; it does NOT close the ticket
 *    to a certified unconditional C/Dmin^2 upper bound (that needs the tail
 *    profile, sub-gap below). LEMMA 3854 (global) stays a valid over-bound.
 *  - No new Lambda bound; imp-3066 K_a >= 0 positivity UNTOUCHED; Platt-Trudgian
 *    Lambda <= 0.2 REMAINS SOTA; NO QED.
 *
 * OPEN SUB-GAP
 * ------------
 *  - imp-3898-sub-tail-weight-constant: the weighted path-local majorant
 *    (dPsi/dT)/Psi <= 8 sum_j w_j/s_min(j)^2 is rigorous but was not collapsed
 *    to an EXPLICIT unconditional constant C with (dPsi/dT)/Psi <= C/Dmin^2.
 *    Doing so needs a rigorous bound on the tail weight sum_{j far} w_j/s_min(j)^2
 *    (per-term s_min(j) and 1/D_j^2 across the full endN path, an offline scan).
 *    The realised sharpRatio in [0.83, 1.05] suggests C is a small O(1), but that
 *    is measured, not certified. Named open, non-blocker.
 *
 * @see imp-3874-dpsi-sensitivity-verification.js (live source of logSens, 8/smin^2)
 * @see imp-3870-smin-dmin-slack-measurement.js (the smin-vs-Dmin looseness picture)
 * @see imp-3854-thetabar-insensitivity-derivation.js (the global LEMMA sharpened here)
 * @see imp-3725-fmb-plateau-domination-lemma.js (live source of Dmin, H)
 */

import { IMP_3725_FMB_PLATEAU_DOMINATION } from './imp-3725-fmb-plateau-domination-lemma.js';
import { IMP_3874_DPSI_SENSITIVITY_VERIFICATION } from './imp-3874-dpsi-sensitivity-verification.js';

const SRC25 = IMP_3725_FMB_PLATEAU_DOMINATION.rows;         // H, Dmin per plateau
const SRC74 = IMP_3874_DPSI_SENSITIVITY_VERIFICATION.rows;  // logSens, 8/smin^2, smin

const DMIN_BY_PLATEAU = Object.freeze(
  Object.fromEntries(SRC25.map((r) => [r.plateauIndex, r.Dmin])),
);
const H_BY_PLATEAU = Object.freeze(
  Object.fromEntries(SRC25.map((r) => [r.plateauIndex, r.H])),
);

// Per-plateau confrontation of the realised horizon elasticity (imp-3874
// logSensBase = (dPsi/dT)/Psi) with the Dmin-based path-local effective constant
// 8/Dmin^2 and the global 8/smin^2 ceiling. Everything derives LIVE.
const ROWS = SRC74.map((r) => {
  const Dmin = DMIN_BY_PLATEAU[r.plateauIndex];
  const H = H_BY_PLATEAU[r.plateauIndex];
  const realisedElasticity = r.logSensBase;        // (dPsi/dT)/Psi, imp-3874
  const globalCeil = r.rigorousCeilBase;           // 8/smin^2, imp-3874
  const dminCeil = 8 / (Dmin * Dmin);              // 8/Dmin^2 path-local effective constant
  const sharpRatio = realisedElasticity / dminCeil; // realised / Dmin-ceiling (~1)
  const globalSlack = globalCeil / realisedElasticity; // realised vs global ceiling (loose)
  const dminVsGlobal = globalCeil / dminCeil;      // how much sharper the Dmin constant is
  // (H/Dmin)^2 is the imp-3870 "effective constant" narrative; 8/Dmin^2 is its
  // horizon-elasticity form. Both are the SAME nearest-cumulative-distance scale.
  const hOverDminSq = (H / Dmin) ** 2;
  const dminIsUpperBound = sharpRatio <= 1;         // whether 8/Dmin^2 majorises realised
  return Object.freeze({
    plateauIndex: r.plateauIndex,
    startN: r.startN,
    endN: r.endN,
    H,
    Dmin,
    smin: r.sminBase,
    realisedElasticity,
    dminCeil,
    globalCeil,
    hOverDminSq,
    sharpRatio,
    globalSlack,
    dminVsGlobal,
    dminIsUpperBound,
  });
});

const sharpRatios = ROWS.map((r) => r.sharpRatio);
const MIN_SHARP = Math.min(...sharpRatios);
const MAX_SHARP = Math.max(...sharpRatios);
const MIN_GLOBAL_SLACK = Math.min(...ROWS.map((r) => r.globalSlack));
const MAX_GLOBAL_SLACK = Math.max(...ROWS.map((r) => r.globalSlack));
const MIN_DMIN_VS_GLOBAL = Math.min(...ROWS.map((r) => r.dminVsGlobal));
const MAX_DMIN_VS_GLOBAL = Math.max(...ROWS.map((r) => r.dminVsGlobal));
const DMIN_ALWAYS_UPPER_BOUND = ROWS.every((r) => r.dminIsUpperBound);

export const IMP_3898_PATH_LOCAL_ELASTICITY_BOUND = Object.freeze({
  id: 'imp-3898',
  title:
    'Path-local horizon-elasticity bound on the nearest-cumulative distance Dmin: ' +
    'rigorous per-term majorant e_j <= 8/s_min(j)^2 (sharper than global 8/smin^2) ' +
    '+ exact Psi-weighted identity; Dmin effective constant 8/Dmin^2 reproduces the ' +
    'realised elasticity to [0.83,1.05] (2000x-35000x sharper than global) but is a ' +
    'PROXY, not a certified upper bound (exceeded by ~4.5% on 2/3 plateaus)',
  status: 'honest-partial',
  rhFree: true,
  semantics:
    'derivation of a sharper path-local elasticity majorant + live certification of ' +
    'the Dmin effective constant; sharpens the global ceiling, no certified C/Dmin^2 QED',

  thetaBar: 0.99,
  rows: ROWS,

  perTermMajorant:
    'e_j := d ln t_j/dT = 8 P_j/D_j <= 8/s_min(j)^2 where s_min(j) = min gap on ' +
    'path j. Proof: P_j <= m_j/s_min(j) and D_j >= m_j s_min(j) (m_j = path length). ' +
    'Since s_min(j) >= smin globally, this is UNIFORMLY sharper than e_j <= 8/smin^2; ' +
    'for the nearest single-gap term it is tight at 8/Dmin^2.',

  weightedIdentity:
    '(dPsi_N/dT)/Psi_N = sum_j w_j e_j, w_j = (1/D_j^2)/(sum_k 1/D_k^2). The weights ' +
    'concentrate on the smallest-D_j (nearest) terms, so the realised elasticity sits ' +
    'at the 8/Dmin^2 scale. Rigorous weighted majorant: (dPsi/dT)/Psi <= 8 sum_j ' +
    'w_j/s_min(j)^2, which does NOT charge near terms with the far tail gap.',

  headline: {
    plateausCertified: ROWS.map((r) => r.plateauIndex),   // [0, 4, 9]
    sharpRatioRange: [MIN_SHARP, MAX_SHARP],               // ~[0.827, 1.045]
    globalSlackRange: [MIN_GLOBAL_SLACK, MAX_GLOBAL_SLACK], // ~[2279, 34004]
    dminVsGlobalRange: [MIN_DMIN_VS_GLOBAL, MAX_DMIN_VS_GLOBAL], // ~[1987, 35493]
    dminIsCertifiedUpperBound: DMIN_ALWAYS_UPPER_BOUND,    // false -- proxy, not bound
    finding:
      'The Dmin-based path-local effective constant 8/Dmin^2 (7.71/17.61/16.72 on ' +
      'plateaus 0/4/9) reproduces the imp-3874 realised horizon elasticity ' +
      '(dPsi/dT)/Psi (8.06/14.56/17.45) to a factor sharpRatio in [0.83, 1.05] -- a ' +
      '2000x-35000x sharpening of the certified-but-vacuous global 8/smin^2 ceiling ' +
      '(itself 2279x-34004x above realised). The rigorous ingredients are the ' +
      'per-term path-local majorant e_j <= 8/s_min(j)^2 (proved, uniformly sharper ' +
      'than the global one) and the exact Psi-weighted-average identity. HONEST ' +
      'LIMIT: 8/Dmin^2 is a SHARP PROXY, not a certified upper bound -- the realised ' +
      'elasticity EXCEEDS it by ~4.4%-4.5% on plateaus 0 and 9, because far terms ' +
      'with small path-local gaps carry above-Dmin elasticity at tiny weight. The ' +
      'certified bound is the weighted path-local majorant; collapsing it to an ' +
      'explicit C/Dmin^2 needs the tail profile (open sub-gap). Necessary sharpening, ' +
      'not sufficient; Platt-Trudgian Lambda <= 0.2 stays SOTA; imp-3066 untouched; NO QED.',
  },

  sharpensImp3854:
    'imp-3854 LEMMA bounded each path gap by the GLOBAL smin and got e_j <= 8/smin^2. ' +
    'This replaces the global smin by the PATH-LOCAL s_min(j) >= smin, giving the ' +
    'uniformly sharper e_j <= 8/s_min(j)^2, tight at 8/Dmin^2 on the nearest term. The ' +
    'global ceiling is loose because it charges every path with the far tail gap that ' +
    'only far, tiny-weight terms traverse -- exactly the imp-3870 diagnosis, now with a ' +
    'derived per-term majorant behind it. LEMMA 3854 stays a valid (loose) over-bound.',

  openSubGap: {
    id: 'imp-3898-sub-tail-weight-constant',
    status: 'open',
    blocker: false,
    statement:
      'The weighted path-local majorant (dPsi/dT)/Psi <= 8 sum_j w_j/s_min(j)^2 is ' +
      'rigorous but was not collapsed to an explicit unconditional constant C with ' +
      '(dPsi/dT)/Psi <= C/Dmin^2. That needs a certified bound on the tail weight ' +
      'sum_{j far} w_j/s_min(j)^2 (per-term s_min(j) and 1/D_j^2 across the full endN ' +
      'path, an offline scan). The measured sharpRatio in [0.83, 1.05] suggests C is a ' +
      'small O(1), but that is measured, not certified.',
  },

  provenance: {
    zeros: 'src/data/zeros-to-1e6.js (Odlyzko; zeros1 3e-9, imp-359/imp-514), via imp-3874/imp-3725',
    liveSources: 'imp-3874 (logSens, 8/smin^2, smin) and imp-3725 (Dmin, H); nothing new baked here',
    generatedAt: '2026-07-03',
  },

  scope: {
    derivationPlusLiveCertification: true,
    noNewLambdaBound: true,
    imp3066Untouched: true,
    plattTrudgianStillSOTA: 'Lambda <= 0.2 (PT 2021) remains SOTA',
    noQED: true,
  },
});

// -- Build-time assertions (throw on failure via run-assertions harness) -----

const rel = (x, y) => Math.abs(x - y) / Math.max(Math.abs(x), Math.abs(y), 1e-300);

export const IMP_3898_PATH_LOCAL_ELASTICITY_BOUND_ASSERTIONS = [
  {
    id: 'imp3898-derives-live-from-imp3874-and-imp3725',
    holds: () =>
      ROWS.length === 3 &&
      ROWS.every((r, i) => {
        const src74 = SRC74[i];
        return (
          r.plateauIndex === src74.plateauIndex &&
          r.realisedElasticity === src74.logSensBase &&
          r.globalCeil === src74.rigorousCeilBase &&
          r.Dmin === DMIN_BY_PLATEAU[r.plateauIndex] &&
          rel(r.dminCeil, 8 / (r.Dmin * r.Dmin)) < 1e-12
        );
      }),
    why:
      'logSens/8-over-smin^2 come live from imp-3874 and Dmin/H from imp-3725; only the ' +
      'ratios are computed here. Any drift signals a source row changed under the derivation.',
  },
  {
    id: 'imp3898-dmin-constant-is-sharp-order-one-proxy',
    holds: () =>
      ROWS.every((r) => r.sharpRatio > 0.5 && r.sharpRatio < 2) &&
      MIN_SHARP > 0.8 &&
      MAX_SHARP < 1.1,
    why:
      'Central certification: the Dmin effective constant 8/Dmin^2 reproduces the ' +
      'realised horizon elasticity to a factor in [0.83, 1.05] on all three plateaus -- ' +
      'an O(1) sharp proxy, not orders of magnitude off like the global ceiling.',
  },
  {
    id: 'imp3898-global-ceiling-is-loose-2000x-plus',
    holds: () =>
      ROWS.every((r) => r.globalSlack > 1000) &&
      MIN_GLOBAL_SLACK > 2000 &&
      MAX_GLOBAL_SLACK < 1e5,
    why:
      'The global 8/smin^2 ceiling over-shoots the realised elasticity by 2279x-34004x ' +
      '-- the imp-3874(e)/imp-3870 looseness, reconfirmed live against the flow.',
  },
  {
    id: 'imp3898-dmin-constant-3-4-orders-sharper-than-global',
    holds: () =>
      ROWS.every((r) => rel(r.dminVsGlobal, r.globalCeil / r.dminCeil) < 1e-12) &&
      MIN_DMIN_VS_GLOBAL > 1000 &&
      MAX_DMIN_VS_GLOBAL < 1e5,
    why:
      'The whole looseness is the global-smin-vs-path-local-Dmin substitution: ' +
      '8/smin^2 is 1987x-35493x above 8/Dmin^2, so replacing smin by the ' +
      'nearest-cumulative Dmin recovers the correct O(1) elasticity scale.',
  },
  {
    id: 'imp3898-honest-dmin-not-a-certified-upper-bound',
    holds: () =>
      DMIN_ALWAYS_UPPER_BOUND === false &&
      ROWS.some((r) => r.sharpRatio > 1) &&
      IMP_3898_PATH_LOCAL_ELASTICITY_BOUND.headline.dminIsCertifiedUpperBound === false,
    why:
      'Honesty guard: 8/Dmin^2 is a sharp PROXY, not a certified upper bound -- the ' +
      'realised elasticity exceeds it (sharpRatio > 1) on plateaus 0 and 9. The claimed ' +
      'certified object is the weighted path-local majorant, not the bare 8/Dmin^2.',
  },
  {
    id: 'imp3898-per-term-majorant-sharper-than-global',
    holds: () =>
      // path-local majorant 8/Dmin^2 (nearest term, tight) is <= global 8/smin^2
      ROWS.every((r) => r.dminCeil <= r.globalCeil && r.smin > 0 && r.smin < r.Dmin),
    why:
      'The derived per-term path-local majorant e_j <= 8/s_min(j)^2 is uniformly sharper ' +
      'than the global e_j <= 8/smin^2 because s_min(j) >= smin; its nearest-term value ' +
      '8/Dmin^2 sits below the global 8/smin^2 on every plateau (smin < Dmin).',
  },
  {
    id: 'imp3898-partial-only-no-lambda-claim',
    holds: () =>
      IMP_3898_PATH_LOCAL_ELASTICITY_BOUND.scope.noNewLambdaBound === true &&
      IMP_3898_PATH_LOCAL_ELASTICITY_BOUND.scope.noQED === true &&
      IMP_3898_PATH_LOCAL_ELASTICITY_BOUND.scope.imp3066Untouched === true &&
      IMP_3898_PATH_LOCAL_ELASTICITY_BOUND.openSubGap.status === 'open',
    why:
      'Honesty guard: this derives a sharper path-local majorant and certifies the Dmin ' +
      'effective constant, but does not close the certified C/Dmin^2 upper bound. It must ' +
      'not assert a new Lambda bound or a QED, imp-3066 stays untouched, and the ' +
      'tail-weight sub-gap stays named open; Platt-Trudgian Lambda <= 0.2 remains SOTA.',
  },
];

// Self-executing (imp-3715 convention): any failed assertion throws at import.
for (const assertion of IMP_3898_PATH_LOCAL_ELASTICITY_BOUND_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(
      `imp-3898-path-local-elasticity-bound assertion failed: ${assertion.id}`,
    );
  }
}

export default IMP_3898_PATH_LOCAL_ELASTICITY_BOUND;
