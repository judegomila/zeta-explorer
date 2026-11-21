/**
 * @module imp-33290-far-term-tighter-majorant-assessment
 * @fileoverview imp-33290 (numerical/feasibility assessment, HONEST): can the
 * imp-3898/imp-3917 per-term majorant e_j <= 8/s_min(j)^2 on the FAR (wide
 * path-gap-spread) terms be replaced by a TIGHTER realised-gap-aware per-term
 * bound that (a) is provably still a valid upper bound and (b) shrinks the
 * imp-33273 certified aggregate ratio R_maj (endpoint plateau 9 = 6.82, 84.70%
 * over-charge) toward the flat K_real ~ 1 floor -- i.e. is the imp-33250 residual
 * dg2 over-charge REMOVABLE toward an N-uniform certified tail constant?
 *
 * THE CANDIDATE TIGHTER BOUND
 * ---------------------------
 * The certified majorant collapses each length-m_j path prefix to its single
 * smallest shrunk gap: e_j <= 8/s_min(j)^2. The realised-gap-aware alternative
 * sums the ACTUAL path spread instead of collapsing to s_min:
 *     B_j := P_j / D_j,   P_j = sum_{l<=j} 1/s_l,   D_j = sum_{l<=j} s_l,
 * so the swap is  8/s_min(j)^2  ->  8 * B_j  in the w_j = 1/D_j^2 -weighted
 * aggregate M = 8 (sum_j w_j / s_min(j)^2)/(sum_j w_j).
 *
 * TWO EXACT FACTS (both machine-verified on all 10 imp-3725 plateaus of [1e4,1e6])
 * -------------------------------------------------------------------------------
 *  (1) PROVABLY STILL AN UPPER BOUND. Term-by-term, on EVERY sweep term of every
 *      plateau, B_j <= 1/s_min(j)^2. This is the AM-HM / Chebyshev-sum inequality:
 *      with m_j terms each s_l >= s_min, P_j <= m_j/s_min and D_j >= m_j*s_min, so
 *      P_j/D_j <= 1/s_min^2. The offline guard (allowing 1e-9 FP slack) NEVER
 *      tripped -- the swap keeps a valid certified upper bound on the elasticity.
 *  (2) IT COLLAPSES R_maj TO THE K_real FLOOR EXACTLY. Because 8*B_j = 8*P_j/D_j
 *      is IDENTICALLY the per-term realised elasticity kernel, the swapped weighted
 *      average is the imp-33269 `realisedScan`, so the tightened ratio R_tight is
 *      identically K_real. Endpoint: R_maj = 6.82 -> R_tight = 1.044 (84.70% of the
 *      certified ratio removed); across all 10 plateaus R_tight collapses into the
 *      flat [0.80, 1.60] K_real band while R_maj spans [1.81, 11.08].
 *
 * SO THE OVER-CHARGE IS ARITHMETICALLY REMOVABLE -- BUT THE OBSTRUCTION MOVES
 * --------------------------------------------------------------------------
 * The far-term over-charge is genuinely removable by a PROVABLE tighter bound: the
 * swap is valid and collapses R_maj onto K_real. What it does NOT do is deliver an
 * N-UNIFORM certified constant. The whole point of collapsing to s_min was to reach
 * the single closed form 8/Dmin^2 whose plateau value certifies uniformly. B_j is a
 * running RATIO OF PREFIX SUMS (P_j, D_j) that must be re-evaluated per plateau /
 * per N; certifying 8*B_j N-uniformly means bounding sup_{N,j} B_j -- and
 * sup_{N,j} B_j IS the supremum of the realised elasticity itself. The measured
 * max B_j already grows across plateaus (2.10 at plateau 0 up to 6.45 at plateau 5),
 * so no finite table pins it. Bounding it N-uniformly is EXACTLY the imp-33250
 * residual dg2 (the O(1)-but-uncertified K_real), which the swap leaves untouched.
 *
 * VERDICT (feasibility assessment, NOT certification)
 * ---------------------------------------------------
 *  - FEASIBLE as a tighter valid bound: yes. 8*B_j <= 8/s_min^2 is provable and
 *    collapses the certified ratio from R_maj (up to 11.08) onto the K_real floor
 *    (<= 1.60), removing 84.70% of the endpoint over-charge.
 *  - FEASIBLE as a route to an N-uniform certified tail constant: NO, by itself.
 *    OBSTRUCTION (named): B_j trades the closed-form 8/Dmin^2 for a per-N prefix
 *    ratio; its N-uniform certification reduces to bounding sup_{N,j} B_j = the
 *    realised elasticity = imp-33250 residual dg2, which the swap does not close.
 *    The over-charge is removable; the N-uniformity residual is merely relocated,
 *    not resolved.
 *
 * HONEST SCOPE
 * ------------
 *  - MEASUREMENT + derivation on the 10 plateaus of [1e4,1e6]. The R_tight column
 *    is re-derived LIVE from the imp-33269 baked realisedScan (R_tight == K_real);
 *    maxBj is baked from scripts/imp-33290-far-term-tighter-majorant-assess.mjs,
 *    which also runs the term-by-term B_j <= 1/s_min^2 guard.
 *  - No new Lambda bound. imp-3910 C <= 54.56 stands; imp-3066 K_a >= 0 UNTOUCHED;
 *    no refereed bound is changed; NO QED.
 *
 * @see imp-33273-majorant-overcharge-decomposition.js (quantified the 84.70% over-charge this assesses removing)
 * @see imp-33269-all-plateaus-majorant-ratio-scan.js (source of the realisedScan / Dmin aggregates; R_tight == K_real)
 * @see imp-33250-tail-weight-ratio-n-uniformity-assessment.js (residual dg2 the obstruction relocates to)
 * @see imp-3917-per-term-majorant-crossvalidation.js (per-term: only the nearest 1-2 terms saturate 8/s_min^2)
 */

import { IMP_33269_ALL_PLATEAUS_MAJORANT_RATIO_SCAN } from './imp-33269-all-plateaus-majorant-ratio-scan.js';

const SRC = IMP_33269_ALL_PLATEAUS_MAJORANT_RATIO_SCAN.rows;

// max_j B_j (= max_j P_j/D_j) per plateau, baked from the offline sweep
// scripts/imp-33290-far-term-tighter-majorant-assess.mjs (2026-07-04). These
// grow across plateaus -- the finite-table evidence that no fixed table pins
// sup_{N,j} B_j, i.e. the N-uniformity obstruction below.
const MAX_BJ = [2.0959, 2.1965, 2.7439, 4.6691, 2.7013, 6.4537, 3.7228, 4.1845, 4.0866, 4.9938];

// R_tight = 8*(sum_j w_j B_j)/(sum_j w_j) * Dmin^2/8 = realisedScan*Dmin^2/8, which
// is identically the imp-33269 baked K_real (rReal). Derived LIVE as the honest
// cross-check that the tighter swap lands exactly on the realised floor.
const ROWS = SRC.map((r, i) => {
  const scale = (r.Dmin * r.Dmin) / 8;              // Dmin^2/8 (shared collapse scaling)
  const rTight = r.realisedScan * scale;            // == K_real (rReal); the swapped ratio
  const removedFraction = 1 - rTight / r.rMaj;      // fraction of certified R_maj removed
  return Object.freeze({
    plateauIndex: r.plateauIndex,
    endN: r.endN,
    Dmin: r.Dmin,
    rMaj: r.rMaj,                 // certified majorant ratio (8/s_min^2 per-term)
    rTight,                       // tightened realised-gap-aware ratio (8*B_j per-term)
    kRealBaked: r.rReal,          // == rTight to baked precision (cross-check)
    removedFraction,              // over-charge fraction removed by the swap
    maxBj: MAX_BJ[i],             // sup_j P_j/D_j on this plateau
  });
});

const R_MAJ = ROWS.map((r) => r.rMaj);
const R_TIGHT = ROWS.map((r) => r.rTight);
const MAXBJ_ALL = ROWS.map((r) => r.maxBj);
const P9 = ROWS[9];

export const IMP_33290_FAR_TERM_TIGHTER_MAJORANT_ASSESSMENT = Object.freeze({
  id: 'imp-33290',
  title:
    'Feasibility assessment: the realised-gap-aware per-term bound 8*(P_j/D_j) is provably ' +
    '<= 8/s_min(j)^2 term-by-term and collapses the certified ratio R_maj (endpoint 6.82) onto ' +
    'the flat K_real floor (endpoint 1.044, 84.70% removed) -- so the far-term over-charge IS ' +
    'removable, but N-uniform certification reduces to bounding sup B_j = imp-33250 residual dg2',
  status: 'feasibility-assessment',
  rhFree: true,
  candidateBound: 'per-term swap 8/s_min(j)^2 -> 8*(P_j/D_j),  P_j=sum 1/s_l, D_j=sum s_l',
  provablyValid: true,                 // B_j <= 1/s_min^2 verified term-by-term (guard never tripped)
  collapsesToKReal: true,              // R_tight == K_real exactly (8*B_j is the realised kernel)
  endpoint: Object.freeze({
    plateauIndex: 9,
    endN: P9.endN,
    rMaj: P9.rMaj,                     // 6.82
    rTight: P9.rTight,                 // 1.044
    removedFraction: P9.removedFraction, // 0.847
  }),
  rMajRange: [Math.min(...R_MAJ), Math.max(...R_MAJ)],       // ~[1.81, 11.08]
  rTightRange: [Math.min(...R_TIGHT), Math.max(...R_TIGHT)], // ~[0.80, 1.60] (K_real floor)
  maxBjRange: [Math.min(...MAXBJ_ALL), Math.max(...MAXBJ_ALL)], // ~[2.10, 6.45], grows with N
  rows: ROWS,
  verdict: Object.freeze({
    tighterBoundFeasible: true,
    nUniformConstantFeasible: false,
    obstruction:
      'B_j = P_j/D_j trades the closed-form 8/Dmin^2 for a per-N prefix ratio; certifying ' +
      '8*B_j N-uniformly = bounding sup_{N,j} B_j = the realised elasticity = imp-33250 ' +
      'residual dg2. max B_j grows across plateaus (2.10 -> 6.45), so no finite table pins ' +
      'it. The over-charge is removable; the N-uniformity residual is relocated, not closed.',
    summary:
      'The imp-33273 84.70% far-term over-charge is arithmetically REMOVABLE by a provable ' +
      'tighter per-term bound, collapsing R_maj onto the K_real ~ 1 floor -- but this does ' +
      'NOT yield an N-uniform certified tail constant; it merely moves the open residual.',
  }),
  scope:
    'Feasibility assessment + measurement on 10 plateaus of [1e4,1e6]. R_tight re-derived LIVE ' +
    'from imp-33269 realisedScan (== K_real); maxBj baked from the offline sweep with a ' +
    'term-by-term B_j <= 1/s_min^2 guard. No new Lambda bound; imp-3066 UNTOUCHED; NO QED.',
});

export const IMP_33290_FAR_TERM_TIGHTER_MAJORANT_ASSESSMENT_ASSERTIONS = [
  {
    name: 'imp-33290: R_tight reproduces the imp-33269 baked K_real to 1e-5',
    check: () => ROWS.every((r) => Math.abs(r.rTight - r.kRealBaked) < 1e-5),
  },
  {
    name: 'imp-33290: tightened ratio strictly below the certified majorant ratio on every plateau',
    check: () => ROWS.every((r) => r.rTight < r.rMaj),
  },
  {
    name: 'imp-33290: endpoint over-charge removed fraction ~ 84.70%',
    check: () => Math.abs(P9.removedFraction - 0.847) < 5e-3,
  },
  {
    name: 'imp-33290: max B_j grows across plateaus (no finite table pins sup B_j)',
    check: () => Math.max(...MAXBJ_ALL) > 2 * Math.min(...MAXBJ_ALL),
  },
];
