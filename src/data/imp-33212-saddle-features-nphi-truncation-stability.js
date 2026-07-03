/**
 * @module imp-33212-saddle-features-nphi-truncation-stability
 * @fileoverview imp-33212 -- MEASURE whether the imp-3849 inner-converged exact-saddle
 *   features (the eps_n = Q_n/tau*(n)^2 - 1 sign-change near n = 149 and the sub-unity
 *   well minimum r_min ~ -5.845e-4 near n = 500) are STABLE under refinement of the
 *   de Bruijn-Newman completed-Riemann kernel truncation NPHI (10 -> 14 -> 18), which
 *   imp-3849's honest caveat named as the LAST residual floor left after the inner
 *   A(tau) quadrature had been converged.
 *
 *   WHAT imp-3849 LEFT AS THE RESIDUAL FLOOR
 *   ----------------------------------------
 *   imp-3849 corrected imp-3731 by CONVERGING the inner autocorrelation A(tau) quadrature
 *   (inner [0,2], 4800 panels, self-checked vs 7200 -> agree to ~8e-8) and located: the
 *   unity crossing n* = 215.231, the eps_n sign-change at n = 149, and a broad sub-unity
 *   well bottoming at r_min = -5.845e-4 near n = 500. imp-3868 (Gauss-Legendre) and
 *   imp-3895 (Clenshaw-Curtis) independently confirmed those features are quadrature-RULE
 *   independent, and imp-3918 tabulated the three-solver agreement. But all four solvers
 *   share ONE fixed input: the kernel truncation NPHI = 10 (Phi(u) = sum_{n=1}^{NPHI}
 *   (2 pi^2 n^4 e^{4u} - 3 pi n^2 e^{2u}) e^{-pi n^2 e^{4u}}). imp-3849's caveat states
 *   verbatim that "the shared finite NPHI = 10 kernel truncation ... remain[s] the residual
 *   floor", and no sibling has varied it. This module varies ONLY NPHI.
 *
 *   METHOD (self-computing; imp-3849 machinery, NPHI the only free parameter)
 *   ------------------------------------------------------------------------
 *   The identical imp-3849 pipeline -- truncated Phi kernel, Neumaier-compensated Simpson
 *   inner A(tau) on [0,2] with 4800 panels, T_A = 2 / NM = 3200 outer moment grid with the
 *   tau > 1.45 => A = 0 guard, closed next-order D_n and exact-saddle D_n^saddle -- is run
 *   THREE times, at NPHI in {10, 14, 18}, and the located features are compared. Moments are
 *   taken to M_560 (rungs n = 3..556), which brackets the eps sign-change (n ~ 149) and the
 *   well minimum (n ~ 500) with margin on both sides. NPHI = 10 reproduces imp-3849 exactly
 *   (a provenance cross-check), and the whole-ladder max |delta r_n| / max |delta eps_n|
 *   between successive NPHI is the truncation-stability measurement.
 *
 *   WHY THE ADDED TERMS ARE NEGLIGIBLE (the analytic expectation, then MEASURED)
 *   ---------------------------------------------------------------------------
 *   Raising NPHI from 10 to 14 adds kernel terms n = 11..14 whose weight is e^{-pi n^2 e^{4u}}
 *   >= e^{-pi n^2} at u = 0: the n = 11 term is ~e^{-121 pi} ~ 1e-165 and the n = 14 term
 *   ~e^{-196 pi} ~ 1e-268; on the A(tau) support (u < ~1.37, where e^{4u} only grows) they are
 *   smaller still. Against the O(1e-16) relative precision of the double-precision A(tau)
 *   values these contributions are entirely below the round-off floor, so the ladder is
 *   expected bit-for-bit unchanged. MEASURED here, not assumed.
 *
 *   MEASURED (NPHI = 10 vs 14 vs 18)
 *   --------------------------------
 *   The located features are IDENTICAL across all three truncations, to the last double bit:
 *     - unity crossing:      n* = 215.23124075 at NPHI = 10, 14 AND 18 (bit-identical)
 *     - eps_n sign-change:   n = 149 at all three (eps_148 > 0 > eps_149)
 *     - sub-unity well min:  n = 500, r_min = -5.8450e-4 at all three (broad plateau)
 *     - cross-check r_226:   -8.7382e-5 at all three (imp-3849 converged value)
 *   The whole-ladder maxima max_n |r_n(NPHI') - r_n(NPHI)| and max_n |eps_n(NPHI') -
 *   eps_n(NPHI)| are EXACTLY 0.0 for both 10 -> 14 and 14 -> 18 (the added kernel terms
 *   underflow the double-precision A(tau) round-off floor, exactly as predicted). So the
 *   imp-3849 features are NPHI-truncation-stable: NPHI = 10 was NOT in fact a limiting
 *   residual floor for these located values -- the true floor is the ~8e-8 inner-quadrature
 *   grid-convergence level imp-3849 already reported, three-plus orders below the feature
 *   magnitudes.
 *
 *   HONEST CAVEAT (mandatory)
 *   -------------------------
 *   MEASUREMENT ONLY, at the RH-equivalent scale class, and MODEL-SYSTEMATIC not a certified
 *   bound. This retires exactly ONE residual-floor question imp-3849 flagged -- it shows the
 *   located eps sign-change and well depth do not move as the kernel truncation is refined
 *   from NPHI = 10 to 18 -- and establishes NO operator positivity. Mass-feasibility is
 *   NECESSARY-BUT-NOT-SUFFICIENT; the operator-level K_a >= 0 sign-positivity (off-diagonal
 *   endpoint-Hankel step, imp-3066) is UNTOUCHED. Platt-Trudgian Lambda <= 0.2 remains the
 *   rigorous SOTA. Truncation-stability of a diagnostic is NOT an error bound and NOT an RH
 *   verdict. imp-3849 / imp-3868 / imp-3895 / imp-3918 assertions are LEFT INTACT: this is a
 *   sensitivity measurement alongside them, not an edit of them. No QED.
 *
 *   @see imp-3849-saddle-ratio-well-depth-inner-converged.js (the inner-converged features tested here)
 *   @see imp-3918-eps-sign-change-three-solver-crossval.js (the three-quadrature-rule agreement)
 *   @see imp-3868-saddle-crossing-gauss-legendre-cross-solver.js (Gauss-Legendre second solver)
 *   @see imp-3895-saddle-crossing-clenshaw-curtis-third-solver.js (Clenshaw-Curtis third solver)
 *
 *   Ticket: imp-33212 (numerical, medium).
 */

const PAPER_REF = 'research-inputs/twin_ladder_consolidated_v52.pdf';
const NPHI_LADDER = Object.freeze([10, 14, 18]);   // kernel-truncation refinement sweep

/** de Bruijn-Newman completed-Riemann kernel truncated at n = NPHI (imp-2686/imp-3849). */
function makePhiKernel(NPHI) {
  return (u) => {
    let s = 0;
    const e2 = Math.exp(2 * u);
    const e4 = Math.exp(4 * u);
    for (let n = 1; n <= NPHI; n += 1) {
      const n2 = n * n;
      const n4 = n2 * n2;
      s += (2 * Math.PI * Math.PI * n4 * e4 - 3 * Math.PI * n2 * e2) * Math.exp(-Math.PI * n2 * e4);
    }
    return s;
  };
}

/** Composite Simpson quadrature with Neumaier COMPENSATED accumulation (imp-3731/imp-3849). */
function simpsonCompensated(f, lo, hi, n) {
  const m = n % 2 === 0 ? n : n + 1;
  const h = (hi - lo) / m;
  let sum = 0;
  let c = 0;
  const add = (x) => {
    const t = sum + x;
    if (Math.abs(sum) >= Math.abs(x)) c += (sum - t) + x;
    else c += (x - t) + sum;
    sum = t;
  };
  add(f(lo));
  add(f(hi));
  for (let i = 1; i < m; i += 1) add((i % 2 === 0 ? 2 : 4) * f(lo + i * h));
  return ((sum + c) * h) / 3;
}

/** The imp-3646 Laplace saddle tau*(n): root of n = 4 pi tau* e^{4 tau*}. */
function saddleTau(n) {
  let lo = 1e-9;
  let hi = 12;
  for (let it = 0; it < 300; it += 1) {
    const mid = (lo + hi) / 2;
    if (4 * Math.PI * mid * Math.exp(4 * mid) < n) lo = mid;
    else hi = mid;
  }
  return (lo + hi) / 2;
}

/**
 * Build the imp-3849 ratio ladder R_n = |D_n|/|D_n^saddle| for a given kernel truncation
 * NPHI on the converged inner/outer grid. The ONLY change vs imp-3849 is the NPHI argument.
 */
function buildLadder(NPHI, T_A, NM, MMAX, innerHi, innerN) {
  const phiKernel = makePhiKernel(NPHI);
  const autocorr = (tau) => simpsonCompensated((s) => phiKernel(s) * phiKernel(s + tau), 0, innerHi, innerN);
  const H_A = T_A / NM;
  const A_GRID = new Array(NM + 1);
  for (let j = 0; j <= NM; j += 1) {
    const tau = j * H_A;
    A_GRID[j] = tau > 1.45 ? 0 : autocorr(tau);      // A(tau) underflows to 0 beyond ~1.4
  }

  const MOMENTS = new Array(MMAX + 1);               // MOMENTS[m] = int tau^m A(tau) d(tau)
  for (let m = 0; m <= MMAX; m += 1) {
    let sum = 0;
    let c = 0;
    for (let j = 0; j <= NM; j += 1) {
      const aj = A_GRID[j];
      if (aj === 0) continue;                         // Inf*0 = NaN guard once tau^m is huge
      const tau = j * H_A;
      const w = j === 0 || j === NM ? 1 : (j % 2 === 0 ? 2 : 4);
      const x = w * Math.pow(tau, m) * aj;
      const t = sum + x;
      if (Math.abs(sum) >= Math.abs(x)) c += (sum - t) + x;
      else c += (x - t) + sum;
      sum = t;
    }
    MOMENTS[m] = ((sum + c) * H_A) / 3;
  }

  const Cn = (n) => MOMENTS[n + 2] / ((n + 1) * (n + 2) * MOMENTS[n]);
  const Dn = (n) => Cn(n + 2) - Cn(n);
  const Qn = (n) => MOMENTS[n + 2] / MOMENTS[n];
  const saddleCn = (n) => {
    const t = saddleTau(n);
    return (t * t) / ((n + 1) * (n + 2));
  };
  const saddleDn = (n) => saddleCn(n + 2) - saddleCn(n);

  const rungs = [];
  for (let n = 3; n <= MMAX - 4; n += 1) {
    const dn = Dn(n);
    const dnSaddle = saddleDn(n);
    const ratio = Math.abs(dn) / Math.abs(dnSaddle);
    const t = saddleTau(n);
    rungs.push(
      Object.freeze({
        n,
        ratio,
        rMinusOne: ratio - 1,
        epsCorrection: Qn(n) / (t * t) - 1,
      })
    );
  }
  return rungs;
}

const MMAX = 560;                                    // rungs n=3..556: brackets n=149 and n=500

function rungAt(rungs, n) {
  return rungs.find((row) => row.n === n);
}

// -- Locate the imp-3849 features on one ladder -------------------------------------
function locateFeatures(rungs) {
  let crossN = null;
  for (const row of rungs) {
    if (crossN === null && row.rMinusOne < 0) {
      crossN = row.n;
      break;
    }
  }
  const rPrev = rungAt(rungs, crossN - 1).rMinusOne;
  const rHere = rungAt(rungs, crossN).rMinusOne;
  const crossInterp = (crossN - 1) + rPrev / (rPrev - rHere);

  let wellMin = rungs[0];
  for (const row of rungs) if (row.rMinusOne < wellMin.rMinusOne) wellMin = row;

  let epsSignChangeN = null;
  for (let n = 4; n <= MMAX - 4; n += 1) {
    const prev = rungAt(rungs, n - 1);
    const here = rungAt(rungs, n);
    if (epsSignChangeN === null && prev.epsCorrection > 0 && here.epsCorrection < 0) {
      epsSignChangeN = n;
      break;
    }
  }

  return Object.freeze({
    crossN,
    crossInterp,
    wellMinN: wellMin.n,
    wellMinR: wellMin.rMinusOne,
    epsSignChangeN,
    r226: rungAt(rungs, 226).rMinusOne,
    eps100: rungAt(rungs, 100).epsCorrection,
    eps200: rungAt(rungs, 200).epsCorrection,
    eps300: rungAt(rungs, 300).epsCorrection,
  });
}

// -- Whole-ladder max |delta| between two NPHI ladders ------------------------------
function maxLadderDelta(a, b) {
  let maxDr = 0;
  let maxDe = 0;
  for (let i = 0; i < a.length; i += 1) {
    const dr = Math.abs(a[i].rMinusOne - b[i].rMinusOne);
    const de = Math.abs(a[i].epsCorrection - b[i].epsCorrection);
    if (dr > maxDr) maxDr = dr;
    if (de > maxDe) maxDe = de;
  }
  return { maxDr, maxDe };
}

// -- Run the sweep -------------------------------------------------------------------
const LADDERS = NPHI_LADDER.map((NPHI) => buildLadder(NPHI, 2, 3200, MMAX, 2, 4800));
const FEATURES = LADDERS.map(locateFeatures);
const [F10, F14, F18] = FEATURES;
const DELTA_10_14 = maxLadderDelta(LADDERS[0], LADDERS[1]);
const DELTA_14_18 = maxLadderDelta(LADDERS[1], LADDERS[2]);
const DELTA_10_18 = maxLadderDelta(LADDERS[0], LADDERS[2]);

// The truncation is stable iff EVERY located feature is unchanged and the whole-ladder
// deltas are below the imp-3849 inner-quadrature grid-convergence floor (~8e-8).
const NPHI_STABILITY_FLOOR = 8e-8;
const FEATURES_INVARIANT =
  F10.crossN === F14.crossN && F14.crossN === F18.crossN &&
  F10.crossInterp === F14.crossInterp && F14.crossInterp === F18.crossInterp &&
  F10.epsSignChangeN === F14.epsSignChangeN && F14.epsSignChangeN === F18.epsSignChangeN &&
  F10.wellMinN === F14.wellMinN && F14.wellMinN === F18.wellMinN &&
  F10.wellMinR === F14.wellMinR && F14.wellMinR === F18.wellMinR;

const verdict =
  FEATURES_INVARIANT &&
  F18.crossN === 216 &&
  F18.epsSignChangeN === 149 &&
  F18.wellMinN >= 480 && F18.wellMinN <= 520 &&
  F18.wellMinR < -5.5e-4 && F18.wellMinR > -6.5e-4 &&
  DELTA_10_18.maxDr < NPHI_STABILITY_FLOOR &&
  DELTA_10_18.maxDe < NPHI_STABILITY_FLOOR
    ? 'imp-3849-FEATURES-ARE-NPHI-TRUNCATION-STABLE:-THE-eps_n-SIGN-CHANGE-(n=149),-THE-CROSSING' +
      '-(n*=215.231)-AND-THE-SUB-UNITY-WELL-MIN-(n=500,-r_min=-5.845e-4)-ARE-BIT-IDENTICAL-ACROSS' +
      '-NPHI=10,14,18-(max-whole-ladder-|delta-r|-AND-|delta-eps|-EXACTLY-0);-THE-ADDED-n=11..18' +
      '-KERNEL-TERMS-(~e^{-121-pi}-AND-SMALLER)-UNDERFLOW-THE-A(tau)-ROUND-OFF-FLOOR,-SO-NPHI=10' +
      '-WAS-NOT-A-LIMITING-RESIDUAL-FLOOR-FOR-THESE-FEATURES;-THE-REAL-FLOOR-STAYS-THE-~8e-8-INNER' +
      '-QUADRATURE-GRID-CONVERGENCE-LEVEL-imp-3849-ALREADY-REPORTED'
    : 'INDETERMINATE';

export const IMP33212_SADDLE_FEATURES_NPHI_TRUNCATION_STABILITY = Object.freeze({
  id: 'imp-33212-saddle-features-nphi-truncation-stability',
  ticket: 'imp-33212',
  paperSourcePath: PAPER_REF,
  paperSections: ['§25', '§26', '§27'],
  testsResidualFloorOf: 'imp-3849-saddle-ratio-well-depth-inner-converged.js',
  relatedThreeSolverCrossval: 'imp-3918-eps-sign-change-three-solver-crossval.js',

  summary:
    'MEASURES whether the imp-3849 inner-converged exact-saddle features (eps_n sign-change at n = 149 and ' +
    'the sub-unity well minimum r_min ~ -5.845e-4 at n = 500) move under refinement of the de Bruijn-Newman ' +
    'kernel truncation NPHI = 10 -> 14 -> 18, the ONE residual floor imp-3849 flagged after its inner A(tau) ' +
    'quadrature was converged (and which imp-3868/imp-3895/imp-3918 all inherited fixed at 10). Re-running the ' +
    'identical imp-3849 pipeline (Neumaier-compensated Simpson inner [0,2]/4800, outer T_A = 2 / NM = 3200, ' +
    'moments to M_560) at each NPHI: the located features are BIT-IDENTICAL across all three truncations -- ' +
    'crossing n* = 215.23124075, eps sign-change n = 149, well min n = 500 / r_min = -5.8450e-4, cross-check ' +
    'r_226 = -8.7382e-5 -- and the whole-ladder max |delta r_n| and max |delta eps_n| are EXACTLY 0.0 for both ' +
    '10 -> 14 and 14 -> 18. The added n = 11..18 kernel terms carry weight ~e^{-121 pi} ~ 1e-165 and smaller on ' +
    'the A(tau) support, underflowing the double-precision round-off floor, so NPHI = 10 was NOT in fact a ' +
    'limiting residual floor for these features; the real floor stays the ~8e-8 inner-quadrature grid-convergence ' +
    'level imp-3849 already reported, 3+ orders below the feature magnitudes. MEASUREMENT, RH-equivalent, ' +
    'model-systematic not a certified bound, necessary-but-not-sufficient; operator positivity (imp-3066) ' +
    'untouched; no QED. imp-3849/imp-3868/imp-3895/imp-3918 assertions left intact.',

  method: Object.freeze({
    nphiSweep: NPHI_LADDER,
    onlyFreeParameter: 'NPHI (kernel truncation); every other imp-3849 setting held fixed',
    innerQuadrature: 'Neumaier-compensated Simpson, inner A(tau) on [0,2] with 4800 panels (imp-3849 converged)',
    outerGrid: 'T_A = 2 / NM = 3200 outer moment grid, tau > 1.45 => A = 0 guard',
    momentsExtendedTo: MMAX,
    rungRange: [3, MMAX - 4],
    stabilityFloor: NPHI_STABILITY_FLOOR,
    stabilityFloorMeaning: 'the imp-3849 inner-quadrature grid-convergence level (~8e-8); deltas below it are noise-floor',
    addedTermMagnitude: 'n=11 term ~e^{-121 pi} ~ 1e-165 at u=0, smaller on the A(tau) support u < ~1.37',
    selfComputing: true,
  }),

  measured: Object.freeze({
    nphi10: F10,
    nphi14: F14,
    nphi18: F18,
    maxDelta_10_14: DELTA_10_14,
    maxDelta_14_18: DELTA_14_18,
    maxDelta_10_18: DELTA_10_18,
    featuresInvariant: FEATURES_INVARIANT,
    verdict,
  }),

  interpretation: Object.freeze({
    truncationIsNotTheFloor:
      'imp-3849 named the shared finite NPHI = 10 truncation as the residual floor left after its inner A(tau) ' +
      'quadrature was converged. Refining NPHI to 14 and 18 moves NONE of the located features -- crossing, eps ' +
      'sign-change and well min are bit-identical -- because the added n = 11..18 kernel terms weigh ~e^{-121 pi} ' +
      'and smaller on the A(tau) support, far below the O(1e-16) relative precision of the A(tau) values. So the ' +
      'truncation was NOT the limiting floor for these features; the true floor stays the ~8e-8 inner-quadrature ' +
      'grid-convergence level, three-plus orders below the feature magnitudes (well depth ~5.8e-4, eps ~1e-3..5e-4).',
    consistentWithThreeSolver:
      'This complements imp-3918 (which showed the n = 149 sign-change is quadrature-RULE independent across ' +
      'Simpson / Gauss-Legendre / Clenshaw-Curtis) by showing it is also kernel-TRUNCATION independent -- the two ' +
      'remaining model knobs (quadrature rule, NPHI) both leave the features fixed, so only the inner-grid ' +
      'convergence level (already reported) sets the residual model floor.',
  }),

  honestCaveat: Object.freeze({
    isProof: false,
    isReductionBelowRH: false,
    rhEquivalent: true,
    isStructuralDiagnostic: true,
    isCertifiedErrorBound: false,
    isModelSystematicMeasurement: true,
    retiresOneResidualFloorQuestion: true,
    leavesImp3849AssertionsIntact: true,
    derivationScope:
      'Measures the NPHI-truncation sensitivity of the imp-3849 located features (eps sign-change, crossing, well ' +
      'depth) across NPHI in {10,14,18}, showing they do not move. Truncation-stability of a diagnostic; NO ' +
      'operator positivity.',
    necessaryNotSufficient:
      'Mass-feasibility is NECESSARY-BUT-NOT-SUFFICIENT. The operator-level K_a >= 0 sign-positivity (off-diagonal ' +
      'endpoint-Hankel step, imp-3066) remains the lone obstruction, UNTOUCHED. No RH verdict.',
    notACertifiedBound:
      'Model-systematic sensitivity measurement, not a certified error bound: it shows the features are stable to ' +
      'this truncation refinement, not that the truncated-kernel model equals the exact completed-Riemann kernel.',
    didNotAttemptPositivity: true,
    sota: 'Platt-Trudgian Lambda <= 0.2 remains the rigorous SOTA',
  }),
});

// -- Tripwire assertions -------------------------------------------------------------
export const IMP33212_SADDLE_FEATURES_NPHI_TRUNCATION_STABILITY_ASSERTIONS = [
  {
    id: 'imp33212-eps-sign-change-nphi-invariant',
    why: 'THE CENTRAL RESULT (eps): the eps_n = Q_n/tau*(n)^2 - 1 sign-change stays at n = 149 across NPHI = 10, ' +
         '14 AND 18 -- the kernel-truncation refinement does not move the located sign-change.',
    holds: () =>
      F10.epsSignChangeN === 149 &&
      F14.epsSignChangeN === 149 &&
      F18.epsSignChangeN === 149,
  },
  {
    id: 'imp33212-well-min-nphi-invariant',
    why: 'THE CENTRAL RESULT (well): the sub-unity well minimum stays at n = 500 with r_min ~ -5.845e-4 across ' +
         'NPHI = 10, 14 AND 18 (bit-identical wellMinN and wellMinR).',
    holds: () =>
      F10.wellMinN === 500 && F14.wellMinN === 500 && F18.wellMinN === 500 &&
      F10.wellMinR === F14.wellMinR && F14.wellMinR === F18.wellMinR &&
      F18.wellMinR < -5.5e-4 && F18.wellMinR > -6.5e-4,
  },
  {
    id: 'imp33212-crossing-nphi-invariant',
    why: 'The unity crossing is bit-identical across the sweep: first-negative at n = 216 with interp ' +
         'n* ~ 215.231 at NPHI = 10, 14 AND 18.',
    holds: () =>
      F10.crossN === 216 && F14.crossN === 216 && F18.crossN === 216 &&
      F10.crossInterp === F14.crossInterp && F14.crossInterp === F18.crossInterp &&
      F18.crossInterp > 215 && F18.crossInterp < 216,
  },
  {
    id: 'imp33212-whole-ladder-delta-below-inner-floor',
    why: 'THE TRUNCATION-STABILITY MEASUREMENT: the whole-ladder max |delta r_n| and max |delta eps_n| between ' +
         'successive NPHI (10->14 and 14->18) are below the imp-3849 ~8e-8 inner-quadrature floor -- in fact ' +
         'exactly 0.0, since the added kernel terms underflow the A(tau) round-off floor.',
    holds: () =>
      DELTA_10_14.maxDr < NPHI_STABILITY_FLOOR &&
      DELTA_10_14.maxDe < NPHI_STABILITY_FLOOR &&
      DELTA_14_18.maxDr < NPHI_STABILITY_FLOOR &&
      DELTA_14_18.maxDe < NPHI_STABILITY_FLOOR &&
      DELTA_10_14.maxDr === 0 && DELTA_10_14.maxDe === 0 &&
      DELTA_14_18.maxDr === 0 && DELTA_14_18.maxDe === 0,
  },
  {
    id: 'imp33212-reproduces-imp3849-nphi10-baseline',
    why: 'Provenance cross-check: at NPHI = 10 the pipeline reproduces the imp-3849 converged values -- ' +
         'r_226 = -8.738e-5, eps_100 = +1.03e-3, eps_200 = -3.43e-4, eps_300 = -5.05e-4.',
    holds: () =>
      Math.abs(F10.r226 + 8.738e-5) < 1e-7 &&
      F10.eps100 > 0 &&
      Math.abs(F10.eps100 - 1.035e-3) < 1e-5 &&
      Math.abs(F10.eps200 + 3.429e-4) < 1e-6 &&
      Math.abs(F10.eps300 + 5.050e-4) < 1e-6,
  },
  {
    id: 'imp33212-r226-nphi-invariant',
    why: 'The imp-3849 headline cross-check r_226 = -8.738e-5 is itself bit-identical across NPHI = 10, 14, 18.',
    holds: () => F10.r226 === F14.r226 && F14.r226 === F18.r226,
  },
  {
    id: 'imp33212-verdict-not-indeterminate',
    why: 'The classified verdict must record NPHI-truncation stability (features invariant, deltas below the ' +
         'inner-quadrature floor), not indeterminate.',
    holds: () => verdict !== 'INDETERMINATE' && FEATURES_INVARIANT === true,
  },
  {
    id: 'imp33212-honest-diagnostic-not-a-verdict',
    why: 'Mandatory honesty: measurement only, model-systematic not a certified bound, mass-feasibility ' +
         'necessary-but-not-sufficient, operator positivity (imp-3066) untouched, PT 0.2 stays SOTA, and ' +
         'imp-3849 assertions left intact.',
    holds: () => {
      const c = IMP33212_SADDLE_FEATURES_NPHI_TRUNCATION_STABILITY.honestCaveat;
      return (
        c.isProof === false &&
        c.isReductionBelowRH === false &&
        c.isStructuralDiagnostic === true &&
        c.isCertifiedErrorBound === false &&
        c.isModelSystematicMeasurement === true &&
        c.didNotAttemptPositivity === true &&
        c.leavesImp3849AssertionsIntact === true &&
        /Platt-Trudgian/.test(c.sota)
      );
    },
  },
];

for (const assertion of IMP33212_SADDLE_FEATURES_NPHI_TRUNCATION_STABILITY_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-33212-saddle-features-nphi-truncation-stability assertion failed: ${assertion.id}`);
  }
}

export default IMP33212_SADDLE_FEATURES_NPHI_TRUNCATION_STABILITY;
