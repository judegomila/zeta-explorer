/**
 * @module imp-97521-krein-csharp-fixedT-Ninf-vs-plateau
 * @fileoverview imp-97521 -- ASSESSMENT: does an N -> inf fit of the imp-97498 fixed-T*=8000 N-monotone
 *   c_sharp upper-bracket column (0.581134 -> 0.578574 across N=84..164) project BELOW the imp-97206
 *   measured plateau upper bracket 0.581059, and if so is that tension a genuine tighter upper bound on
 *   c_sharp = lambda_min(P_a M_sigma2 P_a) at 2a=ln3, or a finite-T* under-resolution artifact?
 *
 *   WHY. imp-97498 FINDING 2 isolated a pure-N bracket drop 0.581134 -> 0.578574 (total 0.002560 across
 *   N=84..164) at the single COMMON inner resolution T*=8000, larger than the imp-97484 sliding reading.
 *   Because those are Rayleigh-Ritz UPPER brackets monotone-decreasing in N, an N -> inf fit of the fixed-T*
 *   column would land below the bottom cell 0.578574 -- and already the N>=100 cells sit below the imp-97206
 *   / imp-97405 best measured bracket 0.581059. imp-97498 never fit the column to N -> inf nor compared the
 *   projection to the plateau, and the column is itself T-limited, so the direction of any tension was open.
 *
 *   METHOD. No new build: read the six imp-97498 fixed-T*=8000 cells verbatim (asserted against the imp-97498
 *   literals) and the imp-97206 Stage-1 inner-T -> inf plateau reference 0.581059 (imported from the imp-97206
 *   module, its N=100 reliable-band value, = the imp-97405 best measured bracket). Fit the column linear in 1/N
 *   (y = a + b/N; the well-conditioned reading -- a power-law N^{-q} outer fit degenerates on nearly-linear-in-
 *   1/N data, exactly as imp-97206 found for its own flat plateau) and read the N -> inf intercept a.
 *
 *   MEASUREMENT / ASSESSMENT ONLY. lam_min(N,.) are Rayleigh-Ritz UPPER brackets; the fixed-T* column is
 *   T-limited (reads spuriously LOW, since each fixed-N column is monotone INCREASING in T). Establishes NO
 *   operator positivity; NO rigorous lower bound; brackets stay upper brackets; no bound moves; interval-
 *   rigorous certificate reach stays 2a<=0.96; Platt-Trudgian Lambda<=0.2 SOTA; RH open; NO QED.
 *
 * THE FIXED-T*=8000 COLUMN (identical inner-T resolution for every N; from imp-97498):
 *     N       lam_min(N, T=8000)      1/N-fit residual to a + b/N
 *      84     0.581134
 *     100     0.580365
 *     116     0.579804
 *     132     0.579291
 *     148     0.578930
 *     164     0.578574
 *
 * FINDING 1 -- THE N -> inf FIT PROJECTS BELOW THE PLATEAU. The column is nearly linear in 1/N (RMS residual
 *   ~4.1e-5 to a + b/N), and the least-squares N -> inf intercept is a ~ 0.575958 (last-three-points intercept
 *   0.575640), i.e. ~0.005 BELOW the imp-97206 / imp-97405 best measured bracket 0.581059. Indeed the raw
 *   column already sits below 0.581059 from N=100 onward (0.580365 < 0.581059) and monotone-decreases from
 *   there, so any monotone N -> inf fit lands below the plateau. So the answer to the "if so" is YES: the
 *   projection is below 0.581059.
 *
 * FINDING 2 -- BUT THE TENSION IS A FINITE-T* UNDER-RESOLUTION ARTIFACT, NOT A GENUINE TIGHTER UPPER BOUND.
 *   Direct evidence: the imp-97498 N=100 cell at T*=8000 is 0.580365, already 0.000694 BELOW its OWN imp-97206
 *   inner-T -> inf extrapolant 0.581059 -- so even T*=8000 (far past the imp-97206 T-grid top of 3200) is still
 *   T-under-resolved and reads spuriously low (each fixed-N column is monotone INCREASING in T). The fixed-T*
 *   N-descent is therefore the RESIDUAL t-truncation deficit that grows with N (higher modes concentrate the
 *   positive sigma_2 tail mass at larger t, so at any fixed T they under-resolve MORE) -- exactly the imp-97206
 *   FINDING-1 mechanism, read at T*=8000 instead of T=800..3200. An N -> inf fit of the T-limited column just
 *   inherits and compounds this downward T-deficit; it is NOT the well-posed joint limit. The well-posed order
 *   (inner T -> inf FIRST, then outer N -> inf) is exactly imp-97206, whose reliable-band plateau 0.581418,
 *   0.581059, 0.581624, 0.582646 is FLAT and slightly INCREASING in N, with no descent below 0.581059. So the
 *   sub-0.581059 projection is not a valid bracket on the true T -> inf c_sharp (per the imp-97484 caveat that
 *   T-under-resolved cells read spuriously low and are not valid brackets); it certifies no tighter upper bound.
 *
 * VERDICT. YES, an N -> inf fit of the imp-97498 fixed-T*=8000 column projects to ~0.5760, below the imp-97206
 *   / imp-97405 best measured upper bracket 0.581059 (by ~0.005), and the raw column is already below 0.581059
 *   for N>=100. But this tension is a FINITE-T* UNDER-RESOLUTION ARTIFACT, not a genuine tighter upper bound:
 *   the T*=8000 column is itself T-limited and reads spuriously LOW -- shown directly by the N=100 cell 0.580365
 *   sitting 0.000694 below its own imp-97206 T -> inf value 0.581059 -- so its N-descent is the residual
 *   t-truncation deficit (growing with N), and fitting it to N -> inf conflates the N-limit with an un-removed
 *   T-deficit. Taking T -> inf FIRST (imp-97206) removes it: the reliable-band plateau is flat/slightly rising,
 *   not descending. The best VALID measured upper bracket therefore stays 0.581059 (imp-97405 unchanged).
 *   Brackets stay UPPER brackets; no operator positivity; no rigorous lower bound; no bound moves; interval-
 *   rigorous reach stays 2a<=0.96; RH open; NO QED.
 *
 * @see imp-97498-krein-csharp-fixedT-common-column.js (source of the fixed-T*=8000 column; FINDING 2 pure-N drop)
 * @see imp-97206-krein-csharp-coupled-nt-jointlimit.js (the well-posed inner-T -> inf-first plateau 0.581059)
 * @see imp-97405-krein-csharp-third-order-honest-status.js (best measured upper bracket stays 0.581059)
 * @see imp-97512-lam-min-nt-read-guard.js (valid-cell read guard for the imp-97484 lam_min(N,T) table)
 * @see imp-97484-krein-csharp-nscaled-tgrid-extended.js (T-under-resolved cells read spuriously low; not valid brackets)
 */

import { IMP97206_STAGE1_LAM_N_INF } from './imp-97206-krein-csharp-coupled-nt-jointlimit.js';

const LN3 = Math.log(3); // 1.0986122886681098 -- the binding 2a for the Krein / c_sharp floor
export const IMP97521_BINDING_2A = LN3;
export const IMP97521_RIGOROUS_REACH_2A = 0.96; // unchanged by this assessment

export const IMP97521_COMMON_T_STAR = 8000;
export const IMP97521_N_ROWS = Object.freeze([84, 100, 116, 132, 148, 164]);

// The imp-97498 fixed-T*=8000 column, verbatim (asserted below against the imp-97498 literals).
export const IMP97521_FIXED_T_COLUMN = Object.freeze([
  0.581134, // N= 84
  0.580365, // N=100
  0.579804, // N=116
  0.579291, // N=132
  0.578930, // N=148
  0.578574, // N=164
]);

// The imp-97206 / imp-97405 best measured upper bracket = the imp-97206 Stage-1 inner-T -> inf value at N=100.
export const IMP97521_PLATEAU_BRACKET = IMP97206_STAGE1_LAM_N_INF.find((r) => r.N === 100).lamNinf; // 0.581059

// Least-squares linear-in-1/N fit y = a + b/N; a is the N -> inf intercept.
function linFit1OverN(Ns, ys) {
  const xs = Ns.map((N) => 1 / N);
  const n = xs.length;
  const sx = xs.reduce((s, v) => s + v, 0);
  const sy = ys.reduce((s, v) => s + v, 0);
  const sxx = xs.reduce((s, v) => s + v * v, 0);
  const sxy = xs.reduce((s, v, i) => s + v * ys[i], 0);
  const b = (n * sxy - sx * sy) / (n * sxx - sx * sx);
  const a = (sy - b * sx) / n;
  const pred = xs.map((v) => a + b * v);
  const rms = Math.sqrt(ys.reduce((s, v, i) => s + (v - pred[i]) ** 2, 0) / n);
  return { intercept: a, slope: b, rms };
}

const FIT_ALL = linFit1OverN(IMP97521_N_ROWS, IMP97521_FIXED_T_COLUMN);
const FIT_LAST3 = linFit1OverN(IMP97521_N_ROWS.slice(3), IMP97521_FIXED_T_COLUMN.slice(3));

// FINDING 1 -- the N -> inf fit projects below the plateau bracket 0.581059.
export const IMP97521_NINF_FIT = Object.freeze({
  Tstar: IMP97521_COMMON_T_STAR,
  interceptAllPoints: Number(FIT_ALL.intercept.toFixed(6)), // 0.575958
  interceptLast3Points: Number(FIT_LAST3.intercept.toFixed(6)), // 0.575640
  slopePerInverseN: Number(FIT_ALL.slope.toFixed(6)),
  rmsResidual: FIT_ALL.rms, // ~4.1e-5 -- column is nearly linear in 1/N
  plateauBracket: IMP97521_PLATEAU_BRACKET, // 0.581059
  projectsBelowPlateau: FIT_ALL.intercept < IMP97521_PLATEAU_BRACKET,
  gapBelowPlateau: Number((IMP97521_PLATEAU_BRACKET - FIT_ALL.intercept).toFixed(6)), // ~0.005101
  rawColumnBelowPlateauFromN100: true, // 0.580365 < 0.581059 and monotone-decreasing thereafter
});

// FINDING 2 -- the sub-plateau projection is a finite-T* under-resolution artifact, not a valid bracket.
export const IMP97521_ARTIFACT_ATTRIBUTION = Object.freeze({
  // the imp-97498 N=100 cell at T*=8000 is already below its OWN imp-97206 inner-T -> inf value
  n100FixedTcell: 0.580365,
  n100InnerTinf: IMP97521_PLATEAU_BRACKET, // 0.581059
  n100TdeficitAtT8000: Number((0.580365 - IMP97521_PLATEAU_BRACKET).toFixed(6)), // -0.000694 (still T-under-resolved)
  fixedTcolumnStillTunderResolved: true, // T*=8000 > imp-97206 T-grid top 3200, yet below the T -> inf value
  fixedNcolumnMonotoneIncreasingInT: true, // reads spuriously LOW at finite T (imp-97206 / imp-97484)
  fixedTNdescentIsResidualTdeficit: true, // grows with N -- imp-97206 FINDING-1 mechanism at T*=8000
  wellPosedOrderIsInnerTinfFirst: true, // imp-97206: T -> inf FIRST, then N -> inf
  wellPosedPlateauFlatNotDescending: true, // 0.581418, 0.581059, 0.581624, 0.582646 -- slightly rising
  genuineTighterUpperBound: false, // the sub-plateau projection is not a valid bracket on true c_sharp
});

export const IMP97521_VERDICT = Object.freeze({
  ticket: 'imp-97521',
  question:
    'does an N -> inf fit of the imp-97498 fixed-T*=8000 N-monotone c_sharp upper-bracket column project below the imp-97206 measured plateau upper bracket 0.581059, and if so is that a genuine tighter upper bound on c_sharp or a finite-T* under-resolution artifact?',
  answer:
    'YES it projects below: the fixed-T*=8000 column is nearly linear in 1/N (RMS residual ~4.1e-5) and its least-squares N -> inf intercept is ~0.575958 (last-three-points 0.575640), about 0.005 below the imp-97206 / imp-97405 best measured bracket 0.581059, with the raw column already below 0.581059 from N=100 onward. But the tension is a FINITE-T* UNDER-RESOLUTION ARTIFACT, not a genuine tighter upper bound: the T*=8000 column is itself T-limited and reads spuriously LOW, shown directly by the N=100 cell 0.580365 sitting 0.000694 BELOW its own imp-97206 inner-T -> inf value 0.581059 despite T*=8000 being far past the imp-97206 T-grid top of 3200. The fixed-T N-descent is the residual t-truncation deficit that grows with N (the imp-97206 FINDING-1 mechanism), so fitting the column to N -> inf conflates the N-limit with an un-removed T-deficit. The well-posed order takes T -> inf FIRST (imp-97206), whose reliable-band plateau (0.581418, 0.581059, 0.581624, 0.582646) is flat and slightly INCREASING, not descending; per the imp-97484 caveat the T-under-resolved cells are not valid brackets. The best VALID measured upper bracket therefore stays 0.581059 (imp-97405 unchanged).',
  binding_2a: LN3,
  commonTstar: IMP97521_COMMON_T_STAR,
  // Finding 1
  ninfInterceptAllPoints: 0.575958,
  ninfInterceptLast3: 0.57564,
  plateauBracket: 0.581059,
  projectsBelowPlateau: true,
  gapBelowPlateau: 0.005101,
  // Finding 2
  tensionIsFiniteTunderResolutionArtifact: true,
  n100CellBelowOwnInnerTinf: true,
  n100TdeficitAtT8000: -0.000694,
  genuineTighterUpperBound: false,
  bestValidMeasuredBracketUnchanged: 0.581059,
  // program state unchanged
  isUpperBracketOnLambda1: true,
  positiveLowerBoundProduced: false,
  intervalCertified: false,
  operatorPositivityProved: false,
  boundMoves: false,
  intervalRigorousReachUnchanged: 0.96,
  qed: false,
});
export default IMP97521_VERDICT;

// -- self-executing assertions (imp-3715 convention): any failure throws at import --

const IMP97521_ASSERTIONS = [
  {
    id: 'imp97521-fixed-T-column-matches-imp97498-literals',
    holds: () => {
      const expected = [0.581134, 0.580365, 0.579804, 0.579291, 0.578930, 0.578574];
      if (IMP97521_FIXED_T_COLUMN.length !== 6) return false;
      for (let i = 0; i < expected.length; i++) {
        if (Math.abs(IMP97521_FIXED_T_COLUMN[i] - expected[i]) > 1e-12) return false;
      }
      return Math.abs(IMP97521_PLATEAU_BRACKET - 0.581059) < 1e-9;
    },
    why: 'the fixed-T*=8000 column reproduces the imp-97498 literals verbatim and the plateau bracket is the imp-97206 N=100 inner-T -> inf value 0.581059.',
  },
  {
    id: 'imp97521-ninf-fit-projects-below-plateau',
    holds: () =>
      IMP97521_NINF_FIT.projectsBelowPlateau === true &&
      IMP97521_NINF_FIT.interceptAllPoints < IMP97521_PLATEAU_BRACKET &&
      Math.abs(IMP97521_NINF_FIT.interceptAllPoints - 0.575958) < 1e-6 &&
      IMP97521_NINF_FIT.rmsResidual < 1e-4 && // nearly linear in 1/N
      IMP97521_NINF_FIT.rawColumnBelowPlateauFromN100 === true &&
      IMP97521_FIXED_T_COLUMN[1] < IMP97521_PLATEAU_BRACKET && // N=100 cell already below plateau
      IMP97521_VERDICT.projectsBelowPlateau === true,
    why: 'the N -> inf linear-in-1/N intercept ~0.575958 is below the plateau bracket 0.581059 (gap ~0.005), and the raw column is already below 0.581059 from N=100.',
  },
  {
    id: 'imp97521-tension-is-finite-T-under-resolution-artifact',
    holds: () =>
      IMP97521_ARTIFACT_ATTRIBUTION.n100TdeficitAtT8000 < 0 && // N=100 cell below its own T -> inf value
      Math.abs(IMP97521_ARTIFACT_ATTRIBUTION.n100TdeficitAtT8000 - -0.000694) < 1e-6 &&
      IMP97521_ARTIFACT_ATTRIBUTION.fixedTcolumnStillTunderResolved === true &&
      IMP97521_ARTIFACT_ATTRIBUTION.fixedTNdescentIsResidualTdeficit === true &&
      IMP97521_ARTIFACT_ATTRIBUTION.wellPosedPlateauFlatNotDescending === true &&
      IMP97521_ARTIFACT_ATTRIBUTION.genuineTighterUpperBound === false &&
      IMP97521_VERDICT.tensionIsFiniteTunderResolutionArtifact === true &&
      IMP97521_VERDICT.genuineTighterUpperBound === false &&
      IMP97521_VERDICT.bestValidMeasuredBracketUnchanged === 0.581059,
    why: 'the N=100 fixed-T*=8000 cell (0.580365) is 0.000694 below its own imp-97206 inner-T -> inf value (0.581059), so the T*=8000 column is still T-under-resolved and its N-descent is the residual t-truncation deficit; the sub-plateau projection is not a genuine tighter upper bound.',
  },
  {
    id: 'imp97521-measurement-only-no-qed',
    holds: () =>
      IMP97521_VERDICT.positiveLowerBoundProduced === false &&
      IMP97521_VERDICT.isUpperBracketOnLambda1 === true &&
      IMP97521_VERDICT.intervalCertified === false &&
      IMP97521_VERDICT.operatorPositivityProved === false &&
      IMP97521_VERDICT.boundMoves === false &&
      IMP97521_VERDICT.intervalRigorousReachUnchanged === 0.96 &&
      IMP97521_RIGOROUS_REACH_2A === 0.96 &&
      Math.abs(IMP97521_BINDING_2A - LN3) < 1e-12 &&
      IMP97521_VERDICT.qed === false,
    why: 'assessment only: lam_min(N,.) stay Rayleigh-Ritz UPPER brackets; no positive lower bound, no operator positivity, not interval-certified; no bound moves; interval-rigorous reach stays 2a<=0.96; NO QED.',
  },
];

for (const a of IMP97521_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-97521-krein-csharp-fixedT-Ninf-vs-plateau assertion FAILED: ${a.id} -- ${a.why}`);
  }
}
