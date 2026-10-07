/**
 * @module imp-3487-degree2-deficit-a-threshold
 * @fileoverview imp-3487 -- ASSESS whether RAISING the shear parameter a (which
 *   SHRINKS the imp-3469 degree-2 crossover tauStar = arcsinh(1)/a) can push
 *   tauStar INSIDE the genuine-Phi autocorrelation A(tau) support and thereby
 *   induce a NONZERO degree-2 overflow deficit
 *
 *     D_2(a, U) = int_{tauStar}^U (sinh(a tau) - 1) A(tau) d(tau),
 *
 *   and to LOCATE the a-threshold at which D_2 first becomes defined (nonzero),
 *   so a degree-2 feasibility ratio B_2/D_2 first exists.
 *
 *   THE SETUP (imp-3469 R4 / imp-3482)
 *   ----------------------------------
 *   imp-3469 found (and imp-3482 certified) that at the two base cells
 *   (a, U) in {(0.5, 6), (0.4, 10)} the degree-2 deficit D_2 = 0 IDENTICALLY,
 *   because the crossover tauStar = arcsinh(1)/a (1.763 at a=0.5, 2.203 at a=0.4)
 *   sits far BEYOND the A(tau) support: A underflows to EXACTLY 0 in double
 *   precision by tau ~ 1.368, well inside both tauStar values, so the whole
 *   deficit tail [tauStar, U] lies where A === 0. Crucially tauStar DECREASES as
 *   a INCREASES (tauStar = arcsinh(1)/a), so a large-enough a should drag tauStar
 *   back inside the support and switch on a nonzero D_2. imp-3469 never explored
 *   this; imp-3487 does.
 *
 *   METHOD (self-computing; A recomputed at import, no frozen data)
 *   --------------------------------------------------------------
 *   The exact imp-3469 kernel Phi (NPHI = 10), autocorrelation A(tau) =
 *   int Phi(s) Phi(s + tau) ds, and precomputed A grid (composite Simpson, inner
 *   n = 1200 on [0, 7], mass grid NM = 1600 on [0, T_A = 6]) are reused verbatim.
 *   We sweep a UPWARD across [0.4, 3.0], compute tauStar(a), the degree-2 bridge
 *   mass B_2(a) = int_0^{T_A} (cosh(a tau) - 1) A(tau) d(tau), the deficit
 *   D_2(a) = int_{tauStar}^{T_A} (sinh(a tau) - 1) A(tau) d(tau), and the ratio
 *   B_2/D_2. Because D_2 flips from EXACTLY 0 to positive precisely when tauStar
 *   crosses the point where A stops being 0 in double precision, we BISECT the
 *   a-threshold aStar where D_2 first becomes > 0 (200 iters). We also report the
 *   softer EFFECTIVE thresholds a_eff = arcsinh(1)/supportEnd(floor) at floors
 *   {1e-6, 1e-12} -- the a at which tauStar reaches the relative-floor support
 *   endpoint, i.e. where D_2 first climbs above that floor's noise level.
 *
 *   MEASURED RESULT
 *   ---------------
 *   (M1) A DEGREE-2 DEFICIT THRESHOLD DOES EXIST. D_2(a) = 0 identically for
 *        a <= aStar and becomes > 0 for a > aStar, with bisected
 *        aStar ~ 0.6475 (tauStar(aStar) ~ 1.361 = the hard A-underflow point).
 *   (M2) THE THRESHOLD LIES ABOVE BOTH BASE CELLS. aStar ~ 0.6475 exceeds the
 *        larger base a = 0.5 by ~29.5% and the smaller base a = 0.4 by ~62%.
 *        The imp-3469 k-ladder scales a DOWNWARD (a -> a/k), so it moves AWAY
 *        from aStar on every rung -- no ladder cell can ever reach the threshold.
 *   (M3) AT THRESHOLD THE DEFICIT IS ASTRONOMICALLY NEGLIGIBLE. Just above aStar,
 *        D_2 sits at the double-precision underflow edge (~1e-300), so the ratio
 *        B_2/D_2 ~ 1e+200+. To lift D_2 above the 1e-12 relative support floor
 *        needs a >= a_eff(1e-12) ~ 1.527 (tauStar = 0.577), and above the 1e-6
 *        floor needs a >= a_eff(1e-6) ~ 2.039 (tauStar = 0.432) -- 3x-4x the base
 *        a. Even at a = 1.5 the ratio B_2/D_2 is ~1.6e+13; at a = 2 it is ~3.4e+6.
 *   (M4) SO THE a-REGIME THAT INDUCES A MEANINGFUL D_2 IS OUTSIDE THE CONSTRUCTION
 *        BAND. The section-26 ladder is built at small a (bases a <= 0.5) and
 *        scales a downward toward the RH-relevant a -> 0 limit, where B_2 ~
 *        (a^2/2) M_2 -> 0 (imp-3469/imp-3481). Raising a past ~0.65-2.0 moves in
 *        the OPPOSITE direction from the leading-order small-a regime, so while a
 *        nonzero D_2 is mathematically inducible, it lives outside the tested
 *        construction band and counter to the ladder direction, and the induced
 *        deficit stays negligible relative to B_2 (ratio >> 1) throughout.
 *
 *   VERDICT: raising a DOES induce a nonzero degree-2 deficit past a locatable
 *   threshold aStar ~ 0.6475 (tauStar = the A-underflow point ~1.361), but that
 *   threshold sits ABOVE both base cells and counter to the imp-3469 ladder
 *   direction; the induced D_2 is astronomically negligible at threshold
 *   (B_2/D_2 ~ 1e+200) and stays >> B_2-dominated even at a = 2, so no physically
 *   meaningful degree-2 feasibility ratio emerges within the small-a construction
 *   band. The imp-3469 D_2 = 0-in-the-construction conclusion stands.
 *
 *   HONEST CAVEAT (mandatory)
 *   -------------------------
 *   MEASUREMENT / ASSESSMENT ONLY, at the RH-equivalent scale class. This locates
 *   an a-threshold for a support-crossing FACT behind the imp-3469 diagnostic; it
 *   establishes NO operator positivity. Mass-feasibility is NECESSARY-BUT-NOT-
 *   SUFFICIENT, and even where a degree-2 ratio B_2/D_2 becomes defined (a > aStar)
 *   it is enormous (deficit negligible). The operator-level K_a >= 0 sign-
 *   positivity (off-diagonal endpoint-Hankel step, imp-3066) is UNTOUCHED. No RH
 *   verdict, no QED. Platt-Trudgian Lambda &lt;= 0.2 remains the rigorous SOTA.
 *
 *   @see imp-3469-degree2-bridge-mass-scaling.js (D_2 = 0 at the base cells)
 *   @see imp-3482-degree2-deficit-support-certification.js (the support separation certified)
 *   @see imp-2686-mupass-construction.js (the degree-2 / absolute measure A(tau))
 *
 *   Ticket: imp-3487 (numerical, medium).
 */

const PAPER_REF = 'research-inputs/twin_ladder_consolidated_v52.pdf';
const NPHI = 10;                                // completed-Riemann kernel truncation
const ASINH1 = Math.asinh(1);                   // arcsinh(1), solves sinh(a tauStar) = 1

/** de Bruijn-Newman completed-Riemann kernel, truncated at n = NPHI (imp-2686). */
function phiKernel(u) {
  let s = 0;
  const e2 = Math.exp(2 * u);
  const e4 = Math.exp(4 * u);
  // Exact early exit: once the n = 1 Gaussian factor underflows to 0, every term
  // (finite prefactor) * 0 is +-0 and the loop sum is exactly +0, so return 0.
  if (e4 < 1e300 && Math.exp(-Math.PI * e4) === 0) return 0;
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

// Phi autocorrelation A(tau) = int_0^inf Phi(s) Phi(s + tau) ds. The kernel decays
// super-exponentially so the upper limit 7 captures the whole overlap (imp-3469).
function autocorr(tau) {
  return simpson((s) => phiKernel(s) * phiKernel(s + tau), 0, 7, 1200);
}

// Precompute A on the FIXED imp-3469 fine Simpson grid over [0, T_A] ONCE.
const T_A = 6;
const NM = 1600;                                // even -> composite Simpson on [0, T_A]
const H_A = T_A / NM;
const A_GRID = [];
for (let j = 0; j <= NM; j += 1) A_GRID.push(autocorr(j * H_A));
const A0 = A_GRID[0];                           // peak value A(0) (Cauchy-Schwarz maximum)

/**
 * Degree-2 mass = int_{lo}^{T_A} weight(tau) A(tau) d(tau) by composite Simpson on
 * the precomputed A grid, restricted to nodes tau >= lo (imp-3469 degree2Mass).
 */
function degree2Mass(weightFn, lo) {
  let sum = 0;
  for (let j = 0; j <= NM; j += 1) {
    const tau = j * H_A;
    if (tau < lo) continue;
    const w = j === 0 || j === NM ? 1 : (j % 2 === 0 ? 2 : 4);
    sum += w * weightFn(tau) * A_GRID[j];
  }
  return (sum * H_A) / 3;
}

/** Degree-2 bridge mass B_2, overflow deficit D_2 and ratio at a shear a. */
function degree2At(a) {
  const tauStar = ASINH1 / a;
  const b2 = degree2Mass((tau) => Math.cosh(a * tau) - 1, 0);
  const d2 = degree2Mass((tau) => Math.sinh(a * tau) - 1, tauStar);
  return Object.freeze({
    a,
    tauStar,
    b2,
    d2,
    ratio: d2 > 0 ? b2 / d2 : Infinity,   // B_2/D_2 (undefined -> Infinity when D_2 = 0)
    deficitDefined: d2 > 0,
  });
}

/**
 * Effective A-support endpoint at relative floor f: the unique tau where
 * |A(tau)| = f*A(0) (A decays monotonically past 0), bisected to ~8 digits.
 */
function supportEndAtFloor(f) {
  const target = f * Math.abs(A0);
  let lo = 0;
  let hi = 6;
  for (let it = 0; it < 200; it += 1) {
    const mid = (lo + hi) / 2;
    if (Math.abs(autocorr(mid)) >= target) lo = mid;
    else hi = mid;
  }
  return (lo + hi) / 2;
}

// -- Locate the hard a-threshold where D_2 flips from EXACTLY 0 to positive ----
// D_2(a) = 0 for small a (tauStar beyond the A-underflow point) and > 0 once
// tauStar re-enters the region where A is nonzero. Bisect that a-threshold.
function bisectDeficitThreshold() {
  let lo = 0.5;                                  // D_2(lo) = 0 (base cell a=0.5)
  let hi = 1.0;                                  // D_2(hi) > 0
  for (let it = 0; it < 200; it += 1) {
    const mid = (lo + hi) / 2;
    if (degree2At(mid).d2 > 0) hi = mid;
    else lo = mid;
  }
  return (lo + hi) / 2;
}

const A_STAR = bisectDeficitThreshold();         // a-threshold where D_2 first > 0
const TAU_STAR_AT_ASTAR = ASINH1 / A_STAR;       // = the hard A-underflow point ~1.361

// Softer EFFECTIVE thresholds: a at which tauStar reaches the relative-floor support
// endpoint (D_2 first climbs above that floor's noise level).
const SUPPORT_END_1E6 = supportEndAtFloor(1e-6);
const SUPPORT_END_1E12 = supportEndAtFloor(1e-12);
const A_EFF_1E6 = ASINH1 / SUPPORT_END_1E6;      // ~2.039
const A_EFF_1E12 = ASINH1 / SUPPORT_END_1E12;    // ~1.527

// -- Upward a-sweep: representative cells straddling the threshold -------------
const A_SWEEP = Object.freeze([0.4, 0.5, A_STAR, 0.7, 1.0, A_EFF_1E12, 2.0, 3.0]);
const SWEEP = Object.freeze(A_SWEEP.map((a) => degree2At(a)));

// The two imp-3469 base cells (below threshold -> D_2 = 0, ratio undefined).
const BASE_A05 = degree2At(0.5);
const BASE_A04 = degree2At(0.4);

// -- Classification -----------------------------------------------------------
const thresholdExists = A_STAR > 0.5 && A_STAR < 1.0 && degree2At(A_STAR + 0.05).d2 > 0;
const thresholdAboveBases = A_STAR > 0.5 && A_STAR > 0.4;
const basesHaveZeroDeficit = BASE_A05.d2 === 0 && BASE_A04.d2 === 0;
// Even where the deficit is "defined", it is astronomically dominated by B_2: at
// a = 1.5 (a_eff 1e-12) the ratio B_2/D_2 exceeds 1e+6.
const deficitNegligible = degree2At(A_EFF_1E12).ratio > 1e6 && degree2At(2.0).ratio > 1e5;

const verdict =
  thresholdExists && thresholdAboveBases && basesHaveZeroDeficit && deficitNegligible
    ? 'DEGREE-2-DEFICIT-THRESHOLD-aStar~0.6475-EXISTS-BUT-ABOVE-BASES-AND-COUNTER-TO-LADDER;D_2-NEGLIGIBLE(B_2/D_2>>1);NO-MEANINGFUL-RATIO-IN-SMALL-a-BAND'
    : 'INDETERMINATE';

export const IMP3487_DEGREE2_DEFICIT_A_THRESHOLD = Object.freeze({
  id: 'imp-3487-degree2-deficit-a-threshold',
  ticket: 'imp-3487',
  paperSourcePath: PAPER_REF,
  paperSections: ['§25', '§26', '§27'],
  assessesTicket: 'imp-3469',
  relatedSupportCertification: 'imp-3482-degree2-deficit-support-certification.js',
  relatedAbsoluteMeasure: 'imp-2686-mupass-construction.js',

  summary:
    'Assesses whether RAISING the shear a (which shrinks the imp-3469 crossover ' +
    'tauStar=arcsinh(1)/a) can push tauStar INSIDE the genuine-Phi autocorrelation A(tau) ' +
    'support and induce a NONZERO degree-2 overflow deficit D_2=int_{tauStar}^U (sinh(a tau)-1) ' +
    'A(tau)d(tau), and locates the a-threshold where a degree-2 feasibility ratio B_2/D_2 first ' +
    'exists. Reuses the imp-3469 Phi kernel (NPHI=10), A(tau)=int Phi(s)Phi(s+tau)ds and precomputed ' +
    'A grid, recomputed at import. RESULT: a threshold DOES exist -- D_2=0 identically for a<=aStar ' +
    'and becomes >0 for a>aStar, bisected aStar~0.6475 (tauStar~1.361 = the hard A-underflow point). ' +
    'But aStar sits ABOVE both base cells (0.5 by ~29.5%, 0.4 by ~62%) and the imp-3469 k-ladder ' +
    'scales a DOWNWARD (a->a/k), moving AWAY from aStar on every rung. At threshold the deficit is ' +
    'astronomically negligible (D_2 at the underflow edge, B_2/D_2~1e+200); lifting D_2 above the ' +
    '1e-12/1e-6 support floors needs a>=1.527/2.039 (3x-4x the base a), and even at a=2 the ratio ' +
    'B_2/D_2~3.4e+6. So a nonzero D_2 is mathematically inducible but only OUTSIDE the small-a ' +
    'construction band and counter to the ladder direction, with the deficit negligible throughout ' +
    '-- no physically meaningful degree-2 feasibility ratio emerges. ASSESSMENT, RH-EQUIVALENT, ' +
    'necessary-but-not-sufficient; operator positivity (imp-3066) untouched; no RH verdict.',

  method: Object.freeze({
    degree2Masses: 'B_2=int_0^{T_A} (cosh(a tau)-1)A(tau)d(tau), D_2=int_{tauStar}^{T_A} (sinh(a tau)-1)A(tau)d(tau)',
    weight: 'A(tau)=int_0^inf Phi(s)Phi(s+tau)ds, genuine-Phi autocorrelation (NPHI=10), FIXED in (a,U)',
    quadrature: 'composite Simpson: A(tau) inner (n=1200 on [0,7]), mass on precomputed A grid (NM=1600 on [0,T_A])',
    crossover: 'tauStar=arcsinh(1)/a, DECREASES as a increases',
    hardThreshold: 'bisect (200 iters) the a where D_2 flips from EXACTLY 0 to positive -> aStar',
    effectiveThresholds: 'a_eff=arcsinh(1)/supportEnd(floor) at floors {1e-6,1e-12} -- a lifting D_2 above the floor',
    aSweep: A_SWEEP,
    baseCells: ['(0.5,6) s=3', '(0.4,10) s=4'],
    selfComputing: true,
  }),

  measured: Object.freeze({
    aPeak: A0,                                   // A(0) ~ 1.047e-2
    aStar: A_STAR,                               // hard threshold, D_2 first > 0 (~0.6475)
    tauStarAtAStar: TAU_STAR_AT_ASTAR,           // ~1.361 = A-underflow point
    supportEnd1e6: SUPPORT_END_1E6,              // ~0.4323
    supportEnd1e12: SUPPORT_END_1E12,            // ~0.5773
    aEff1e6: A_EFF_1E6,                          // ~2.039 (D_2 above 1e-6 floor)
    aEff1e12: A_EFF_1E12,                        // ~1.527 (D_2 above 1e-12 floor)
    aStarOverBaseA05: A_STAR / 0.5,              // ~1.295 (threshold above the larger base)
    aStarOverBaseA04: A_STAR / 0.4,              // ~1.619 (threshold above the smaller base)
    sweep: SWEEP,                                // [{a,tauStar,b2,d2,ratio,deficitDefined}, ...]
    baseA05: BASE_A05,                           // D_2 = 0, ratio undefined
    baseA04: BASE_A04,                           // D_2 = 0, ratio undefined
    ratioAtAEff1e12: degree2At(A_EFF_1E12).ratio,  // ~1.6e+13
    ratioAtA2: degree2At(2.0).ratio,             // ~3.4e+6
    thresholdExists,
    thresholdAboveBases,
    basesHaveZeroDeficit,
    deficitNegligible,
    verdict,
  }),

  interpretation: Object.freeze({
    thresholdExists:
      'Because tauStar=arcsinh(1)/a DECREASES with a, raising a drags the crossover back into the A ' +
      'support. D_2 flips from EXACTLY 0 to positive at aStar~0.6475, where tauStar~1.361 equals the ' +
      'hard point at which A underflows to 0 in double precision -- a genuine, locatable threshold.',
    thresholdOutsideConstruction:
      'aStar~0.6475 sits ABOVE both base cells (a=0.5 by ~29.5%, a=0.4 by ~62%), and the imp-3469 ' +
      'k-ladder scales a DOWNWARD (a->a/k, tauStar->k*tauStar, further OUT), so no ladder cell can ' +
      'reach the threshold -- inducing D_2>0 requires moving OPPOSITE to the ladder, out of the band.',
    deficitNegligible:
      'Just above aStar the deficit sits at the double-precision underflow edge (D_2~1e-300, B_2/D_2 ' +
      '~1e+200). Lifting D_2 above the 1e-12/1e-6 support floors needs a>=1.527/2.039 (3x-4x the base ' +
      'a); even at a=2 the ratio B_2/D_2 is ~3.4e+6, so the deficit never rivals the bridge mass.',
    smallARegimeUnaffected:
      'The section-26 ladder is built at small a (bases a<=0.5) and scales toward the RH-relevant ' +
      'a->0 limit where B_2~(a^2/2)M_2->0 (imp-3469/imp-3481). The nonzero-D_2 regime lives on the ' +
      'far side of a>~0.65, so the imp-3469 D_2=0-in-the-construction conclusion stands untouched.',
  }),

  honestCaveat: Object.freeze({
    isProof: false,
    isReductionBelowRH: false,
    rhEquivalent: true,
    isStructuralDiagnostic: true,
    numericalCharacterizationOnly:
      'This module LOCATES an a-threshold for a support-crossing fact behind the imp-3469 diagnostic ' +
      '(when raising a re-enters the A support and switches on D_2>0). It establishes NO operator positivity.',
    necessaryNotSufficient:
      'Mass-feasibility is NECESSARY-BUT-NOT-SUFFICIENT, and even where a degree-2 ratio B_2/D_2 becomes ' +
      'defined (a>aStar) it is astronomically large (deficit negligible). The operator-level K_a >= 0 ' +
      'sign-positivity (off-diagonal endpoint-Hankel step, imp-3066) remains the lone obstruction, UNTOUCHED.',
    didNotAttemptPositivity: true,
    sota: 'Platt-Trudgian Lambda <= 0.2 remains the rigorous SOTA',
  }),
});

// -- Tripwire assertions ------------------------------------------------------
export const IMP3487_DEGREE2_DEFICIT_A_THRESHOLD_ASSERTIONS = [
  {
    id: 'imp3487-deficit-threshold-exists-and-bracketed',
    why: 'THE ASSESSMENT: raising a must switch on D_2 -- the bisected threshold aStar where D_2 flips ' +
         'from EXACTLY 0 to positive must lie in (0.5,1.0), with tauStar(aStar) at the A-underflow point ~1.36.',
    holds: () =>
      A_STAR > 0.5 && A_STAR < 1.0 &&
      Math.abs(TAU_STAR_AT_ASTAR - 1.361) < 0.05 &&
      degree2At(A_STAR + 0.02).d2 > 0,
  },
  {
    id: 'imp3487-threshold-above-both-base-cells',
    why: 'The threshold must sit ABOVE both imp-3469 base cells (a=0.5, a=0.4), so the ladder (a->a/k, ' +
         'DOWNWARD) moves away from it and no construction cell reaches D_2>0.',
    holds: () => A_STAR > 0.5 && A_STAR > 0.4 && A_STAR / 0.5 > 1.2,
  },
  {
    id: 'imp3487-base-cells-have-zero-deficit',
    why: 'Consistency with imp-3469/imp-3482: both base cells (0.5,6) and (0.4,10) must still give ' +
         'D_2 = 0 EXACTLY (tauStar beyond the A-underflow point), so their ratio B_2/D_2 is undefined.',
    holds: () =>
      BASE_A05.d2 === 0 && BASE_A04.d2 === 0 &&
      BASE_A05.ratio === Infinity && BASE_A04.ratio === Infinity,
  },
  {
    id: 'imp3487-effective-thresholds-ordered-and-above-hard',
    why: 'The effective floor thresholds must satisfy a_eff(1e-6) > a_eff(1e-12) > aStar (a looser floor ' +
         'needs a larger a to lift D_2 above it), matching a_eff~2.04 (1e-6) and ~1.53 (1e-12).',
    holds: () =>
      A_EFF_1E6 > A_EFF_1E12 && A_EFF_1E12 > A_STAR &&
      Math.abs(A_EFF_1E12 - 1.527) < 0.02 && Math.abs(A_EFF_1E6 - 2.039) < 0.02,
  },
  {
    id: 'imp3487-deficit-negligible-where-defined',
    why: 'Even where D_2>0 the deficit must be astronomically dominated by B_2: the ratio B_2/D_2 at ' +
         'a_eff(1e-12)~1.527 must exceed 1e+6 and at a=2 exceed 1e+5 -- no meaningful feasibility ratio.',
    holds: () =>
      degree2At(A_EFF_1E12).ratio > 1e6 && degree2At(2.0).ratio > 1e5 &&
      degree2At(2.0).d2 > 0,
  },
  {
    id: 'imp3487-sweep-monotone-tauStar-and-deficit-onset',
    why: 'Sanity of the upward sweep: tauStar must strictly DECREASE across the a-sweep, and D_2 must be ' +
         '0 at the base a=0.4,0.5 entries and >0 for every sweep a strictly above aStar.',
    holds: () => {
      const monoTau = SWEEP.every((c, i) => i === 0 || c.tauStar < SWEEP[i - 1].tauStar);
      const onset = SWEEP.every((c) => (c.a < A_STAR ? c.d2 === 0 : c.d2 > 0));
      return monoTau && onset;
    },
  },
  {
    id: 'imp3487-verdict-classifies-the-threshold',
    why: 'The classified verdict must record the existing-but-out-of-band threshold with negligible ' +
         'deficit, not be indeterminate.',
    holds: () =>
      verdict ===
      'DEGREE-2-DEFICIT-THRESHOLD-aStar~0.6475-EXISTS-BUT-ABOVE-BASES-AND-COUNTER-TO-LADDER;D_2-NEGLIGIBLE(B_2/D_2>>1);NO-MEANINGFUL-RATIO-IN-SMALL-a-BAND',
  },
  {
    id: 'imp3487-honest-assessment-not-a-verdict',
    why: 'Mandatory honesty: threshold-location assessment only, mass-feasibility necessary-but-not- ' +
         'sufficient (ratio negligible where defined), operator positivity (imp-3066) untouched, PT 0.2 stays SOTA.',
    holds: () => {
      const c = IMP3487_DEGREE2_DEFICIT_A_THRESHOLD.honestCaveat;
      return (
        c.isProof === false &&
        c.isReductionBelowRH === false &&
        c.isStructuralDiagnostic === true &&
        c.didNotAttemptPositivity === true &&
        /Platt-Trudgian/.test(c.sota)
      );
    },
  },
];

for (const assertion of IMP3487_DEGREE2_DEFICIT_A_THRESHOLD_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-3487-degree2-deficit-a-threshold assertion failed: ${assertion.id}`);
  }
}

export default IMP3487_DEGREE2_DEFICIT_A_THRESHOLD;
