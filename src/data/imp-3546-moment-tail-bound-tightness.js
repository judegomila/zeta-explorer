/**
 * @module imp-3546-moment-tail-bound-tightness
 * @fileoverview imp-3546 -- CERTIFY that the imp-3532 sharp cosh(a T_A) moment-tail
 *   error bound is asymptotically TIGHT, and EXTEND the imp-3532 C1 bound-holds
 *   check beyond the instantiated n = 0..4 / M<=6 rungs using higher moments.
 *
 *   WHERE IMP-3532 STOPPED
 *   ----------------------
 *   imp-3532 promoted the imp-3501 O(a^(n+2)) moment-tail residual to the EXPLICIT
 *   closed certificate
 *       |R_n(a) - (a^n/n!) M_n|  =  |E_n(a)|  <=  (a^(n+2)/(n+2)!) M_(n+2) cosh(a T_A)
 *   (sharp form), the exact residual being E_n(a) = sum_{k>=1} a^(n+2k)/(n+2k)! M_(n+2k)
 *   with M_m the moments of the FIXED genuine-Phi autocorrelation A(tau) (NPHI = 10),
 *   support cap T_A = 6. But it only (C1) checked the bound HOLDS on the truncated
 *   M<=6, n = 0..4 rungs and (C4) that cosh < e^; it never assessed the bound's
 *   TIGHTNESS -- whether the ratio |E_n(a)|/bound approaches a known limit as a -> 0 --
 *   and never pushed the bound-holds verification past n = 4.
 *
 *   THE TIGHTNESS LIMIT (this module)
 *   ---------------------------------
 *   The k = 1 term of the exact residual is exactly the leading term the bound is
 *   built on: E_n(a) = (a^(n+2)/(n+2)!) M_(n+2) [1 + O(a^2)], while the sharp bound
 *   is (a^(n+2)/(n+2)!) M_(n+2) cosh(a T_A) = (a^(n+2)/(n+2)!) M_(n+2) [1 + O(a^2)]
 *   since cosh(a T_A) -> 1 as a -> 0. Hence the exact-residual/bound ratio has the
 *   KNOWN LIMIT
 *       |E_n(a)| / [(a^(n+2)/(n+2)!) M_(n+2) cosh(a T_A)]  ->  1   as a -> 0,
 *   for every rung n: the sharp constant is not merely an upper bound but is
 *   asymptotically EXACT to leading order. The approach is order a^2 -- expanding
 *   numerator and denominator,
 *       1 - ratio = a^2 [ T_A^2/2 - M_(n+4)/((n+3)(n+4) M_(n+2)) ] + O(a^4),
 *   so the deficit 1 - ratio QUARTERS on each halving of a (the fingerprint of the
 *   next even-order term). This is the tightness signature the ticket asks for.
 *
 *   MEASURED RESULT (self-computing; A and moments recomputed at import)
 *   -------------------------------------------------------------------
 *   (T1) TIGHTNESS LIMIT. On the asymptotic sequence a in {0.125, 0.0625, 0.03125,
 *        0.015625} the ratio |E_n(a)|/sharp climbs monotonically toward 1 on every
 *        rung n = 0..4; the smallest-a ratio exceeds 0.99 -- the known limit 1.
 *   (T2) ORDER-a^2 DEFICIT DECAY. The deficit 1 - ratio quarters on each halving of a
 *        (measured ratio deficit(a)/deficit(a/2) sits near 4 on every rung) --
 *        confirming ratio -> 1 is genuine leading-order tightness, not a coincidence.
 *   (H1) EXTENDED BOUND-HOLDS. Recomputing the moment ladder up to M_10 (vs the
 *        imp-3481 M_6) extends the imp-3532 C1 check to n = 0..8: on a in
 *        {0.5, 0.25, 0.125} the truncated exact residual tail never exceeds the sharp
 *        bound which never exceeds the clean e^ bound, on all NINE rungs (imp-3532
 *        checked FIVE).
 *   (H2) EXTENDED MOMENT-DECAY DOMINATION. The (imp-3532 E2) per-term domination
 *        M_(n+2k) <= T_A^(2k-2) M_(n+2) holds across the extended ladder M_0..M_10.
 *   (A1) ANCHOR. The recomputed M_0..M_6 reproduce the imp-3481 ladder to < 1e-9
 *        relative (same weight, grid, and NPHI) -- the extension is on the SAME
 *        genuine-Phi autocorrelation.
 *
 *   VERDICT: the imp-3532 sharp cosh(a T_A) bound is asymptotically TIGHT --
 *   |E_n(a)|/bound -> 1 as a -> 0 with order-a^2 deficit decay -- and its bound-holds
 *   certificate is confirmed on the extended n = 0..8 / M_0..M_10 rungs.
 *
 *   HONEST CAVEAT (mandatory)
 *   -------------------------
 *   MEASUREMENT / CERTIFICATION ONLY, at the RH-equivalent scale class. This measures
 *   the tightness of an explicit constant for the small-a moment-tail error of the
 *   degree-2 (absolute-measure) masses; it establishes NO operator positivity.
 *   Mass-feasibility is NECESSARY-BUT-NOT-SUFFICIENT and the degree-2 face carries no
 *   feasibility comparison at all (imp-3469: D_2 = 0). The operator-level K_a >= 0
 *   sign-positivity (off-diagonal endpoint-Hankel step, imp-3066) is UNTOUCHED. No RH
 *   verdict, no QED. Platt-Trudgian Lambda &lt;= 0.2 remains the rigorous SOTA.
 *
 *   @see imp-3532-moment-tail-closed-error-bound.js (the sharp bound whose tightness is certified)
 *   @see imp-3481-autocorrelation-moment-ladder.js (the measured ladder & support cap; anchor)
 *   @see imp-3501-moment-ladder-general-derivation.js (the O(a^(n+2)) statement made explicit by imp-3532)
 *
 *   Ticket: imp-3546 (accuracy, medium).
 */

import { IMP3481_AUTOCORRELATION_MOMENT_LADDER } from './imp-3481-autocorrelation-moment-ladder.js';

const PAPER_REF = 'research-inputs/twin_ladder_consolidated_v52.pdf';
const NPHI = 10;                                // completed-Riemann kernel truncation (imp-3481)

/** de Bruijn-Newman completed-Riemann kernel, truncated at n = NPHI (imp-2686/imp-3481). */
function phiKernel(u) {
  let s = 0;
  const e2 = Math.exp(2 * u);
  const e4 = Math.exp(4 * u);
  for (let n = 1; n <= NPHI; n += 1) {
    const n2 = n * n;
    const n4 = n2 * n2;
    s += (2 * Math.PI * Math.PI * n4 * e4 - 3 * Math.PI * n2 * e2) * Math.exp(-Math.PI * n2 * e4);
  }
  return s;
}

/** Composite Simpson quadrature of f on [lo, hi] with n subintervals (n even). */
function simpson(f, lo, hi, n) {
  const m = n % 2 === 0 ? n : n + 1;
  const h = (hi - lo) / m;
  let sum = f(lo) + f(hi);
  for (let i = 1; i < m; i += 1) {
    sum += (i % 2 === 0 ? 2 : 4) * f(lo + i * h);
  }
  return (sum * h) / 3;
}

// Phi autocorrelation A(tau) = int_0^inf Phi(s)Phi(s+tau)ds, on the imp-3481 grid.
function autocorr(tau) {
  return simpson((s) => phiKernel(s) * phiKernel(s + tau), 0, 7, 1200);
}

// Precompute A on the SAME fixed fine Simpson grid over [0, T_A] as imp-3481.
const T_A = IMP3481_AUTOCORRELATION_MOMENT_LADDER.method.tauCap;  // = 6
const NM = 1600;                                // even -> composite Simpson on [0, T_A]
const H_A = T_A / NM;
const A_GRID = [];
for (let j = 0; j <= NM; j += 1) A_GRID.push(autocorr(j * H_A));

/** int_0^{T_A} weight(tau) A(tau) d(tau) by composite Simpson on the precomputed grid. */
function aWeightedMass(weightFn) {
  let sum = 0;
  for (let j = 0; j <= NM; j += 1) {
    const tau = j * H_A;
    const w = j === 0 || j === NM ? 1 : (j % 2 === 0 ? 2 : 4);
    sum += w * weightFn(tau) * A_GRID[j];
  }
  return (sum * H_A) / 3;
}

/** n! for small integer n. */
function factorial(n) {
  let f = 1;
  for (let i = 2; i <= n; i += 1) f *= i;
  return f;
}

// -- Extended moment ladder M_0..M_10 (imp-3481 stopped at M_6) ------------------
const MMAX = 10;                                // highest moment -> extends bound-holds to n=8
const M = [];
for (let n = 0; n <= MMAX; n += 1) M.push(aWeightedMass((tau) => Math.pow(tau, n)));

// (A1) Anchor: the recomputed M_0..M_6 must reproduce the imp-3481 ladder.
const REF = IMP3481_AUTOCORRELATION_MOMENT_LADDER.measured.moments;
const REF_M = [REF.M0, REF.M1, REF.M2, REF.M3, REF.M4, REF.M5, REF.M6];
let maxAnchorRelErr = 0;
for (let n = 0; n <= 6; n += 1) {
  const e = Math.abs(M[n] - REF_M[n]) / Math.abs(REF_M[n]);
  if (e > maxAnchorRelErr) maxAnchorRelErr = e;
}

// -- The imp-3532 exact residual tail & closed bounds ---------------------------
// Exact residual E_n(a) = sum_{k>=1} a^(n+2k)/(n+2k)! M_(n+2k), truncated at MMAX.
function exactResidualTail(a, n) {
  let tail = 0;
  for (let m = n + 2; m <= MMAX; m += 2) tail += (Math.pow(a, m) / factorial(m)) * M[m];
  return tail;
}
// Sharp: (a^(n+2)/(n+2)!) M_(n+2) cosh(a T_A). Clean: same with e^(a T_A).
function closedBoundSharp(a, n) {
  return (Math.pow(a, n + 2) / factorial(n + 2)) * M[n + 2] * Math.cosh(a * T_A);
}
function closedBoundClean(a, n) {
  return (Math.pow(a, n + 2) / factorial(n + 2)) * M[n + 2] * Math.exp(a * T_A);
}

// == (T1)/(T2) TIGHTNESS: ratio |E_n(a)|/sharp -> 1 as a -> 0, order-a^2 deficit ==
// Asymptotic sequence (small a, inside the Taylor regime where cosh(a T_A) ~ 1).
const A_TIGHT = Object.freeze([0.125, 0.0625, 0.03125, 0.015625]);
const TIGHT_RUNGS = [0, 1, 2, 3, 4];            // the imp-3532 instantiated rungs (M<=6)

// Per-rung ratio ladder over A_TIGHT and the deficit-decay (order-a^2) ratios.
const tightness = TIGHT_RUNGS.map((n) => {
  const ratios = A_TIGHT.map((a) => exactResidualTail(a, n) / closedBoundSharp(a, n));
  const deficits = ratios.map((r) => 1 - r);
  const deficitDecay = [];
  for (let i = 0; i + 1 < deficits.length; i += 1) deficitDecay.push(deficits[i] / deficits[i + 1]);
  return Object.freeze({
    n,
    ratios,                                     // |E_n(a)|/sharp along A_TIGHT
    deficits,                                   // 1 - ratio (must shrink to 0)
    deficitDecay,                               // ~4 per halving => order a^2
    limitRatio: ratios[ratios.length - 1],      // ratio at the smallest a (-> 1)
    monotoneToOne: ratios.every((r, i) => i === 0 || r > ratios[i - 1]),
  });
});

// Aggregate tightness classifiers.
const smallestRatioAcrossRungs = Math.min(...tightness.map((t) => t.limitRatio));
const allMonotoneToOne = tightness.every((t) => t.monotoneToOne);
const minDeficitDecay = Math.min(...tightness.flatMap((t) => t.deficitDecay));
const maxDeficitDecay = Math.max(...tightness.flatMap((t) => t.deficitDecay));
// The FINEST (smallest-a) decay ratio is the CONVERGED order estimate; the coarser
// ratios sit below 4 (positive higher-order tail terms) and climb toward it.
const finestDecays = tightness.map((t) => t.deficitDecay[t.deficitDecay.length - 1]);
const minFinestDecay = Math.min(...finestDecays);
const maxFinestDecay = Math.max(...finestDecays);

const RATIO_FLOOR = 0.99;                       // smallest-a ratio must exceed this (-> 1)
const SUPERLINEAR_FLOOR = 3.0;                  // every decay ratio > 3 (super-linear, not order a)
const FINEST_DECAY_LO = 3.9;                    // converged decay ratio -> 4 (order a^2)
const FINEST_DECAY_HI = 4.1;
const tightnessLimitConfirmed = smallestRatioAcrossRungs > RATIO_FLOOR && allMonotoneToOne;
const deficitOrderTwo =
  minDeficitDecay > SUPERLINEAR_FLOOR &&
  minFinestDecay > FINEST_DECAY_LO && maxFinestDecay < FINEST_DECAY_HI;

// == (H1)/(H2) EXTENDED BOUND-HOLDS: n = 0..8 on the imp-3532 a-sequence =========
const A_HOLD = Object.freeze([0.5, 0.25, 0.125]);       // imp-3532 sequence
const HOLD_RUNGS = [];                          // n such that M_(n+2) is available (n <= MMAX-2)
for (let n = 0; n + 2 <= MMAX; n += 1) HOLD_RUNGS.push(n);   // 0..8

const holdCells = A_HOLD.map((a) => {
  const rungs = HOLD_RUNGS.map((n) => {
    const tail = exactResidualTail(a, n);
    const sharp = closedBoundSharp(a, n);
    const clean = closedBoundClean(a, n);
    return Object.freeze({
      n, exactResidualTail: tail, boundSharp: sharp, boundClean: clean,
      boundHolds: tail <= sharp && sharp <= clean,
    });
  });
  return Object.freeze({ a, rungs, allHold: rungs.every((r) => r.boundHolds) });
});
const extendedBoundHolds = holdCells.every((c) => c.allHold);

// (H2) moment-decay domination M_(n+2k) <= T_A^(2k-2) M_(n+2) across M_0..M_10.
let extendedMomentDecayHolds = true;
for (const n of HOLD_RUNGS) {
  for (let m = n + 2; m <= MMAX; m += 2) {
    const k = (m - n) / 2;
    if (!(M[m] <= Math.pow(T_A, 2 * k - 2) * M[n + 2])) extendedMomentDecayHolds = false;
  }
}

const ANCHOR_TOL = 1e-9;
const anchorMatches = maxAnchorRelErr < ANCHOR_TOL;
const momentsPositive = M.every((v) => v > 0);

const verdict =
  tightnessLimitConfirmed && deficitOrderTwo && extendedBoundHolds &&
  extendedMomentDecayHolds && anchorMatches && momentsPositive
    ? 'imp-3532-SHARP-cosh(aT_A)-BOUND-ASYMPTOTICALLY-TIGHT-|E_n(a)|/bound->1-AS-a->0-ORDER-a^2-DEFICIT-DECAY-AND-BOUND-HOLDS-EXTENDED-TO-n=0..8/M_0..M_10'
    : 'INDETERMINATE';

export const IMP3546_MOMENT_TAIL_BOUND_TIGHTNESS = Object.freeze({
  id: 'imp-3546-moment-tail-bound-tightness',
  ticket: 'imp-3546',
  paperSourcePath: PAPER_REF,
  paperSections: ['§25', '§26', '§27'],
  relatedClosedBound: 'imp-3532-moment-tail-closed-error-bound.js',
  relatedMomentLadder: 'imp-3481-autocorrelation-moment-ladder.js',
  relatedGeneralDerivation: 'imp-3501-moment-ladder-general-derivation.js',

  summary:
    'Certifies that the imp-3532 sharp cosh(a T_A) moment-tail error bound |E_n(a)| <= ' +
    '(a^(n+2)/(n+2)!) M_(n+2) cosh(a T_A) is asymptotically TIGHT and extends its bound-holds check ' +
    'beyond n=0..4. The k=1 term of the exact residual E_n(a)=sum_{k>=1} a^(n+2k)/(n+2k)! M_(n+2k) is ' +
    'exactly the leading term the bound is built on and cosh(a T_A)->1, so the ratio |E_n(a)|/sharp has ' +
    'the KNOWN LIMIT 1 as a->0, with 1-ratio = a^2[T_A^2/2 - M_(n+4)/((n+3)(n+4)M_(n+2))]+O(a^4) ' +
    '(order-a^2 deficit). MEASURED on a in {0.125,0.0625,0.03125,0.015625}, rungs n=0..4: the ratio ' +
    'climbs monotonically to >0.99 and the deficit 1-ratio quarters per halving (deficit-decay ~4), ' +
    'confirming leading-order tightness. Recomputing the imp-3481 ladder up to M_10 extends the ' +
    'imp-3532 C1 bound-holds check to n=0..8 (NINE rungs vs FIVE) on a in {0.5,0.25,0.125}: tail <= ' +
    'sharp <= clean and the moment-decay domination M_(n+2k) <= T_A^(2k-2) M_(n+2) both hold, and the ' +
    'recomputed M_0..M_6 anchor to the imp-3481 ladder to <1e-9. MEASUREMENT/CERTIFICATION, ' +
    'RH-EQUIVALENT, necessary-but-not-sufficient; degree-2 face carries no feasibility ratio (D_2=0); ' +
    'operator positivity (imp-3066) untouched; no QED.',

  method: Object.freeze({
    exactResidual: 'E_n(a) = R_n(a)-(a^n/n!)M_n = sum_{k>=1} a^(n+2k)/(n+2k)! M_(n+2k) (imp-3532 E1)',
    sharpBound: '(a^(n+2)/(n+2)!) M_(n+2) cosh(a T_A) (imp-3532 exact summation constant)',
    cleanBound: '(a^(n+2)/(n+2)!) M_(n+2) e^(a T_A) (imp-3532 ticket over-estimate)',
    tightnessLimit: '|E_n(a)|/sharp -> 1 as a -> 0 (cosh(a T_A)->1 and the k=1 residual term IS the leading bound term)',
    deficitExpansion: '1 - |E_n(a)|/sharp = a^2 [T_A^2/2 - M_(n+4)/((n+3)(n+4) M_(n+2))] + O(a^4) => quarters per halving',
    tightnessSequence: A_TIGHT,
    tightnessRungs: TIGHT_RUNGS,
    holdSequence: A_HOLD,
    holdRungs: HOLD_RUNGS,
    momentMax: MMAX,
    supportCap: T_A,
    quadrature: 'composite Simpson: A(tau) inner (n=1200 on [0,7]), moments on precomputed A grid (NM=1600 on [0,T_A]) -- the imp-3481 scheme',
    ratioFloor: RATIO_FLOOR,
    superlinearFloor: SUPERLINEAR_FLOOR,
    finestDecayBand: [FINEST_DECAY_LO, FINEST_DECAY_HI],
    selfComputing: true,
  }),

  measured: Object.freeze({
    moments: Object.freeze({
      M0: M[0], M1: M[1], M2: M[2], M3: M[3], M4: M[4], M5: M[5],
      M6: M[6], M7: M[7], M8: M[8], M9: M[9], M10: M[10],
    }),
    tightness,                                  // (T1)/(T2) per-rung ratio & deficit ladders
    smallestRatioAcrossRungs,                   // -> 1
    allMonotoneToOne,
    minDeficitDecay,                            // > 3 (super-linear, every step)
    maxDeficitDecay,
    minFinestDecay,                             // converged decay ratio -> 4 (order a^2)
    maxFinestDecay,
    tightnessLimitConfirmed,
    deficitOrderTwo,
    holdCells,                                  // (H1) extended bound-holds n=0..8
    extendedBoundHolds,
    extendedMomentDecayHolds,                   // (H2)
    maxAnchorRelErr,                            // (A1) recomputed M_0..M_6 vs imp-3481
    anchorMatches,
    momentsPositive,
    knownLimit: 1,
    verdict,
  }),

  interpretation: Object.freeze({
    whatItAdds:
      'imp-3532 checked its sharp cosh(a T_A) bound HOLDS on n=0..4 (M<=6) and that cosh<e^, but never ' +
      'measured HOW tight it is. This module shows the exact-residual/bound ratio has the known limit 1 ' +
      'as a->0 with order-a^2 approach -- the sharp constant is asymptotically exact, not a loose ceiling.',
    whyLimitIsOne:
      'The k=1 term of E_n(a) is exactly (a^(n+2)/(n+2)!)M_(n+2), the very term the bound multiplies by ' +
      'cosh(a T_A); as a->0 cosh(a T_A)->1 and the higher tail terms are O(a^2) smaller, so the ratio ->1.',
    extension:
      'Recomputing the imp-3481 autocorrelation ladder two moments further (to M_10) lets the imp-3532 ' +
      'bound-holds certificate be verified on n=0..8, doubling the checked rung count, on the SAME ' +
      'genuine-Phi weight (anchored to <1e-9).',
  }),

  honestCaveat: Object.freeze({
    isProof: false,
    isReductionBelowRH: false,
    rhEquivalent: true,
    isCertificationAndMeasurement: true,
    numericalCharacterizationOnly:
      'This module measures the asymptotic tightness of the imp-3532 explicit closed constant for the ' +
      'small-a moment-tail error of the A-weighted degree-2 masses and extends its bound-holds range. It ' +
      'establishes NO operator positivity.',
    necessaryNotSufficient:
      'Mass-feasibility is NECESSARY-BUT-NOT-SUFFICIENT, and the degree-2 face carries no feasibility ' +
      'comparison at all (imp-3469: D_2 = 0). The operator-level K_a >= 0 sign-positivity (off-diagonal ' +
      'endpoint-Hankel step, imp-3066) remains the lone obstruction, UNTOUCHED. No RH verdict.',
    didNotAttemptPositivity: true,
    sota: 'Platt-Trudgian Lambda <= 0.2 remains the rigorous SOTA',
  }),
});

// -- Tripwire assertions --------------------------------------------------------
export const IMP3546_MOMENT_TAIL_BOUND_TIGHTNESS_ASSERTIONS = [
  {
    id: 'imp3546-tightness-ratio-approaches-one',
    why: 'THE TIGHTNESS FINDING: the exact-residual/sharp-bound ratio |E_n(a)|/[(a^(n+2)/(n+2)!)M_(n+2)' +
         'cosh(a T_A)] must climb monotonically toward the known limit 1 as a->0 on every rung n=0..4, ' +
         'with the smallest-a ratio exceeding 0.99 -- the sharp constant is asymptotically exact.',
    holds: () => tightnessLimitConfirmed,
  },
  {
    id: 'imp3546-deficit-decays-at-order-a2',
    why: 'The approach to 1 must be GENUINE leading-order tightness: the deficit 1-ratio must decay ' +
         'super-linearly at every step (ratio > 3) and its CONVERGED (finest-a) decay ratio must reach ' +
         '4 (in [3.9,4.1], i.e. order a^2) -- the fingerprint of the next even-order tail term.',
    holds: () => deficitOrderTwo,
  },
  {
    id: 'imp3546-extended-bound-holds-n0-to-8',
    why: 'EXTENSION: recomputing the ladder to M_10 must let the imp-3532 C1 check pass on n=0..8 (nine ' +
         'rungs vs the imp-3532 five) on a in {0.5,0.25,0.125}: exact residual tail <= sharp <= clean.',
    holds: () => extendedBoundHolds,
  },
  {
    id: 'imp3546-extended-moment-decay-domination',
    why: 'The imp-3532 E2 per-term domination M_(n+2k) <= T_A^(2k-2) M_(n+2) must hold across the ' +
         'extended ladder M_0..M_10 for every available pair -- the summation the bound rests on stays valid.',
    holds: () => extendedMomentDecayHolds,
  },
  {
    id: 'imp3546-anchors-to-imp3481-ladder',
    why: 'The recomputed M_0..M_6 must reproduce the imp-3481 exported ladder to <1e-9 relative (same ' +
         'weight/grid/NPHI), confirming the M_7..M_10 extension is on the SAME genuine-Phi autocorrelation.',
    holds: () => anchorMatches,
  },
  {
    id: 'imp3546-moments-positive',
    why: 'All extended moments M_0..M_10 must be positive (A concentrated near tau=0), so Mbar=M and the ' +
         'imp-3532 M-form bound is the operative one across the extended range.',
    holds: () => momentsPositive,
  },
  {
    id: 'imp3546-verdict-classifies-tightness-and-extension',
    why: 'The verdict must certify the sharp bound is asymptotically tight (ratio->1, order-a^2 deficit) ' +
         'and bound-holds extended to n=0..8/M_0..M_10, not indeterminate.',
    holds: () => verdict.startsWith('imp-3532-SHARP-cosh(aT_A)-BOUND-ASYMPTOTICALLY-TIGHT'),
  },
  {
    id: 'imp3546-honest-certification-not-a-verdict',
    why: 'Mandatory honesty: measurement/certification only, mass-feasibility necessary-but-not-sufficient ' +
         '(no degree-2 ratio, D_2=0), operator positivity (imp-3066) untouched, PT 0.2 stays SOTA.',
    holds: () => {
      const c = IMP3546_MOMENT_TAIL_BOUND_TIGHTNESS.honestCaveat;
      return (
        c.isProof === false &&
        c.isReductionBelowRH === false &&
        c.isCertificationAndMeasurement === true &&
        c.didNotAttemptPositivity === true &&
        /Platt-Trudgian/.test(c.sota)
      );
    },
  },
];

for (const assertion of IMP3546_MOMENT_TAIL_BOUND_TIGHTNESS_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-3546-moment-tail-bound-tightness assertion failed: ${assertion.id}`);
  }
}

export default IMP3546_MOMENT_TAIL_BOUND_TIGHTNESS;
