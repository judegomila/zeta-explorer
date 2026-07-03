/**
 * @module imp-3251-bridge-margin-resolution-stability
 * @fileoverview imp-3251 -- Measure the tau-grid-resolution STABILITY of the
 *   section26-mupass degree-0 cosh-completion bridge margin B/D = 1.074
 *   (B = 14.04 &gt; D_0 = 13.07), the sibling of the imp-3175 overflow-fraction
 *   resolution sweep. Does the ~7.4% mass surplus HOLD, GROW, or SHRINK as the
 *   tau-grid resolution N -&gt; inf?
 *
 *   ASSESSMENT / DIAGNOSTIC ONLY. No new positivity, no RH verdict, not a
 *   reduction. Platt-Trudgian Lambda &lt;= 0.2 remains the rigorous SOTA.
 *
 *   THE TWO QUANTITIES (degree-0, RH-equivalent scale class, Lebesgue on lag tau)
 *   -------------------------------------------------------------------------
 *   The section26-mupass-operator-verdict (point 1, mass-feasibility) records the
 *   degree-0 cosh-completion bridge margin at a SINGLE resolution:
 *
 *     B   = int_0^U (cosh(a tau) - 1) d(tau)                 = sinh(a U)/a - U
 *           (cosh-completion bridge mass -- the total endpoint-bridge weight
 *            w^pass(tau) = cosh(a tau) supplies over the passive baseline 1 across
 *            the whole axis [0, U]; imp-2686 / imp-3007 cosh-completion)
 *
 *     D_0 = int_{tauStar}^U (sinh(a tau) - 1) d(tau)         = [cosh(a tau)/a - tau]
 *           (the raw degree-0 overflow deficit -- the shear weight nu(tau) =
 *            sinh(a tau) above the passive baseline 1, on the overflow tail
 *            [tauStar, U] where sinh(a tau) &gt; 1; imp-2841 / imp-3007 rawDeficit)
 *
 *   with the crossover tauStar = arcsinh(1)/a (sinh(a tauStar) = 1). At the genuine
 *   de Bruijn-Newman cell (NPHI = 10, a = 0.5, U = 6) the closed forms are
 *   B = 14.03575, D_0 = 13.06964, so B/D = 1.073920 -- the recorded "B = 14.04 &gt;
 *   D_0 = 13.07, B/D = 1.074, ~7.4% mass surplus". The pointwise margin is
 *   w^pass - nu = cosh(a tau) - sinh(a tau) = e^{-a tau} &gt; 0 on 100% of [0, U].
 *
 *   WHY THIS MARGIN IS NOT THE imp-3175 OVERFLOW FRACTION (the key contrast)
 *   ----------------------------------------------------------------------
 *   imp-3175 swept the overflow-SUPPORT fraction |{tau : nu &gt; mu}| / U, which is a
 *   PANEL-COUNT INDICATOR (a discontinuous step integrand): its midpoint quadrature
 *   converges only O(1/N) and is coarse-grid-biased, so the fraction drifted
 *   monotonically UP (0.194 -&gt; ~0.209, a ~7.6% relative move) and single-resolution
 *   snapshots under-reported the limit. B and D_0 here are instead MASS integrals of
 *   CONTINUOUS integrands: cosh(a tau) - 1 is C-infinity, and max(0, sinh(a tau) - 1)
 *   is C^0 (it vanishes at the crossover tauStar, only its slope kinks), so midpoint
 *   quadrature converges O(1/N^2). The margin B/D is therefore expected to be
 *   resolution-STABLE, not resolution-sensitive like the fraction.
 *
 *   WHAT THE RESOLUTION SWEEP FINDS (measured, NOT proved)
 *   -----------------------------------------------------
 *   The margin B(N)/D_0(N) is RESOLUTION-CONVERGED -- it holds at ~7.39%, it does
 *   NOT grow or shrink materially as the grid refines:
 *     N =   50 -> B/D = 1.073943  (margin 7.3943%)
 *     N =  100 -> B/D = 1.073931  (margin 7.3931%)
 *     N =  200 -> B/D = 1.073920  (margin 7.3920%)
 *     N =  800 -> B/D = 1.073920  (margin 7.3920%)
 *     N = 6400 -> B/D = 1.073920  (margin 7.3920%)
 *   Both B(N) and D_0(N) converge quadratically to their exact closed forms
 *   (B_exact = 14.035750, D_exact = 13.069644), and the offline extension confirms
 *   the limit is unmoved to 6 digits (N = 204800 -> B/D = 1.073920). THE VERDICT:
 *   the ~7.4% mass surplus HOLDS -- the total drift from the coarsest N = 50 to the
 *   converged value is under 0.003 percentage points (&lt; 0.03% relative), the
 *   OPPOSITE of imp-3175's ~7.6% relative drift. The converged degree-0 bridge
 *   margin is B/D = 1.07392 +/- 1e-4, a genuinely resolution-stable number.
 *
 *   WHY THE CONTRAST (the mechanism)
 *   -------------------------------
 *   The recorded 1.074 is trustworthy AS a single-resolution snapshot precisely
 *   because it is a ratio of smooth-integrand masses -- unlike the imp-3175
 *   overflow fraction, whose single-resolution snapshots were coarse-grid accidents.
 *   The difference is the regularity of the integrand: a discontinuous support
 *   indicator (imp-3175) is resolution-sensitive; a continuous mass functional
 *   (this module) is resolution-converged. Mirroring the imp-3175 sweep on the
 *   bridge margin therefore CONFIRMS the 1.074 rather than correcting it.
 *
 *   HONEST CAVEAT (mandatory)
 *   -------------------------
 *   DIAGNOSTIC at the genuine Phi cell (a = 0.5, U = 6). The degree-0 mass-
 *   feasibility comparison B &gt; D_0 is the RH-EQUIVALENT scale-class restatement:
 *   it kills the impossibility option (there IS enough bridge mass) but is
 *   NECESSARY-BUT-NOT-SUFFICIENT -- the surviving operator-level K_a &gt;= 0 sign-
 *   positivity (the off-diagonal endpoint-Hankel step, imp-3066) is UNTOUCHED, and
 *   the degree-0 budget proxy is itself circular (its budget IS ||V||, the RH-
 *   equivalent quantity). No RH verdict. No false QED.
 *
 *   @see imp-3175-overflow-fraction-resolution-reconcile.js (the sibling FRACTION sweep this mirrors)
 *   @see section26-mupass-operator-verdict-2026-06-30.js (records B = 14.04 > D_0 = 13.07, B/D = 1.074)
 *   @see imp-3007-mupass-overflow-cover.js (the closed-form rawDeficit ~13.07 and cosh-completion)
 *   @see imp-2686-mupass-construction.js (the cosh-completion w^pass = cosh(a tau) and pointwise margin)
 *
 *   Ticket: imp-3251 (numerical, medium).
 */

const PAPER_REF = 'research-inputs/twin_ladder_consolidated_v52.pdf';
const A = 0.5;                                       // headline shear weight (the genuine-Phi cell)
const U = 6;                                         // genuine-Phi lag cutoff (the headline cell)
const ASINH1 = Math.asinh(1);                        // a*tauStar solves sinh(a*tau) = 1
const TAU_STAR = ASINH1 / A;                         // crossover: sinh(a*tauStar) = 1

// Live tau-grid resolutions swept (each is O(N), a single midpoint pass on [0, U]).
const N_SET = Object.freeze([50, 100, 200, 400, 800, 1600, 3200, 6400]);

// Recorded single-resolution anchors from the section26-mupass-operator-verdict.
const RECORDED_B = 14.04;                            // cosh-completion bridge mass
const RECORDED_D0 = 13.07;                           // raw degree-0 overflow deficit
const RECORDED_RATIO = 1.074;                        // B/D margin (~7.4% surplus)

// Exact closed forms of the degree-0 masses at (a, U) = (0.5, 6).
const B_EXACT = Math.sinh(A * U) / A - U;                                        // int_0^U (cosh - 1)
const D_EXACT = (Math.cosh(A * U) / A - U) - (Math.cosh(A * TAU_STAR) / A - TAU_STAR); // int_{tauStar}^U (sinh - 1)
const RATIO_EXACT = B_EXACT / D_EXACT;

/**
 * Degree-0 bridge mass B(N) and raw overflow deficit D_0(N) on an N-panel midpoint
 * grid over [0, U], both O(N):
 *   B   integrand = cosh(a tau) - 1          (C-infinity, smooth)
 *   D_0 integrand = max(0, sinh(a tau) - 1)  (C^0, vanishes at the crossover tauStar)
 */
function marginRow(N) {
  const H = U / N;
  let B = 0;
  let D = 0;
  for (let k = 0; k < N; k++) {
    const tau = (k + 0.5) * H;
    B += (Math.cosh(A * tau) - 1) * H;
    D += Math.max(0, Math.sinh(A * tau) - 1) * H;
  }
  return Object.freeze({ N, B, D, ratio: B / D, marginPct: (B / D - 1) * 100 });
}

const SWEEP = Object.freeze(N_SET.map(marginRow));

const coarsest = SWEEP[0];
const finest = SWEEP[SWEEP.length - 1];

// Distance of the finest live ratio from the exact closed form and from the anchor.
const finestVsExact = Math.abs(finest.ratio - RATIO_EXACT);
const finestVsRecorded = Math.abs(finest.ratio - RECORDED_RATIO);

// Total drift of the margin across the whole live sweep (coarsest -> finest), in
// percentage points -- the deliverable: is the ~7.4% surplus resolution-stable?
const marginDriftPct = Math.abs(finest.marginPct - coarsest.marginPct);

// Every row keeps B > D_0 (mass-feasible) and the ratio near the exact closed form.
const marginHoldsEveryRow = SWEEP.every((row) => row.B > row.D && Math.abs(row.ratio - RATIO_EXACT) < 1e-3);

// VERDICT: unlike the imp-3175 overflow FRACTION (a discontinuous indicator that
// drifted ~7.6% relative), the bridge margin is a smooth-integrand mass ratio and
// is resolution-CONVERGED -- the ~7.4% surplus holds.
const marginIsStable = marginHoldsEveryRow && marginDriftPct < 0.01 && finestVsExact < 1e-5;
const verdict = marginIsStable
  ? 'RESOLUTION-CONVERGED-MARGIN-HOLDS-AT-7.39-PERCENT-UNLIKE-3175-FRACTION'
  : 'INDETERMINATE';

export const IMP3251_BRIDGE_MARGIN_RESOLUTION_STABILITY = Object.freeze({
  id: 'imp-3251-bridge-margin-resolution-stability',
  ticket: 'imp-3251',
  paperSourcePath: PAPER_REF,
  paperSections: ['§25', '§26', '§27'],
  relatedFractionSweep: 'imp-3175-overflow-fraction-resolution-reconcile.js',
  relatedVerdict: 'section26-mupass-operator-verdict-2026-06-30.js',
  relatedCover: 'imp-3007-mupass-overflow-cover.js',
  relatedConstruction: 'imp-2686-mupass-construction.js',

  summary:
    'Measures the tau-grid-resolution stability of the section26-mupass degree-0 ' +
    'cosh-completion bridge margin B/D = 1.074 (B = 14.04 > D_0 = 13.07), the ' +
    'sibling of the imp-3175 overflow-fraction sweep. B = int_0^U (cosh(a tau) - 1) ' +
    'is the cosh-completion bridge mass and D_0 = int_{tauStar}^U (sinh(a tau) - 1) ' +
    'the raw degree-0 overflow deficit, at the genuine cell (NPHI = 10, a = 0.5, ' +
    'U = 6). Sweeping the midpoint tau-grid N in {50..6400}: the margin B/D is ' +
    'RESOLUTION-CONVERGED -- 1.073943 at N = 50, 1.073920 by N = 200, unmoved to 6 ' +
    'digits through N = 6400 (and offline N = 204800). Both B(N) and D_0(N) converge ' +
    'quadratically to their exact closed forms (B_exact = 14.035750, D_exact = ' +
    '13.069644, B/D = 1.073920). VERDICT: the ~7.4% mass surplus HOLDS -- total drift ' +
    'from N = 50 to the limit is under 0.003 percentage points (< 0.03% relative), ' +
    'the OPPOSITE of imp-3175 where the discontinuous overflow FRACTION drifted ~7.6% ' +
    'relative. The mechanism is integrand regularity: a support indicator is ' +
    'resolution-sensitive, a smooth-integrand mass ratio is resolution-stable, so ' +
    'this sweep CONFIRMS the recorded 1.074 rather than correcting it. DIAGNOSTIC, ' +
    'RH-EQUIVALENT, necessary-but-not-sufficient; carries NO RH verdict.',

  construction: Object.freeze({
    bridgeMass: 'B = int_0^U (cosh(a tau) - 1) d(tau) = sinh(a U)/a - U  (cosh-completion bridge weight over baseline 1)',
    rawDeficit: 'D_0 = int_{tauStar}^U (sinh(a tau) - 1) d(tau) = [cosh(a tau)/a - tau]  (shear over baseline 1 on the overflow tail)',
    crossoverTauStar: 'tauStar = arcsinh(1)/a  (sinh(a tauStar) = 1)',
    pointwiseMargin: 'w^pass(tau) - nu(tau) = cosh(a tau) - sinh(a tau) = e^{-a tau} > 0 on 100% of [0, U]',
    integrandRegularity: 'B integrand cosh-1 is C-infinity; D_0 integrand max(0, sinh-1) is C^0 (vanishes at tauStar) -- both give O(1/N^2) midpoint convergence, unlike the imp-3175 support indicator (O(1/N))',
    a: A,
    U,
    tauStar: TAU_STAR,
    resolutionSet: N_SET,
    quadrature: 'midpoint, N panels on [0, U]',
    selfComputing: true,
  }),

  measured: Object.freeze({
    sweep: SWEEP,                                    // per resolution: N, B, D_0, ratio, marginPct
    coarsestRatio: coarsest.ratio,                   // B/D at N = 50
    finestRatio: finest.ratio,                       // B/D at N = 6400 (live finest)
    bExact: B_EXACT,                                 // closed-form bridge mass ~14.03575
    dExact: D_EXACT,                                 // closed-form raw deficit ~13.06964
    ratioExact: RATIO_EXACT,                         // closed-form margin ~1.073920
    marginDriftPct,                                  // drift of the margin, coarsest -> finest (percentage points)
    marginHoldsEveryRow,                             // B > D_0 and ratio near exact at every resolution
    recordedB: RECORDED_B,
    recordedD0: RECORDED_D0,
    recordedRatio: RECORDED_RATIO,
    finestVsExact,                                   // distance of finest ratio from the exact closed form (tiny)
    finestVsRecorded,                                // distance of finest ratio from the recorded 1.074 snapshot (tiny)
    verdict,                                         // RESOLUTION-CONVERGED-MARGIN-HOLDS...
  }),

  interpretation: Object.freeze({
    marginIsResolutionStable:
      'The degree-0 bridge margin B/D holds at ~7.39% across the whole tau-grid sweep: 1.073943 at N = 50 ' +
      'converges to 1.073920 by N = 200 and is unmoved to 6 digits through N = 6400. The total drift is under ' +
      '0.003 percentage points -- the ~7.4% mass surplus neither grows nor shrinks with resolution.',
    contrastWithImp3175:
      'This is the OPPOSITE behaviour to imp-3175, where the overflow-SUPPORT fraction (a discontinuous panel- ' +
      'count indicator) drifted monotonically UP from 0.194 to ~0.209 (~7.6% relative) and single-resolution ' +
      'snapshots under-reported the limit. The distinguishing feature is integrand regularity: B and D_0 are ' +
      'masses of continuous integrands (O(1/N^2) midpoint convergence), so their ratio is resolution-converged.',
    numberToTrust:
      'The recorded 1.074 IS the converged margin: B/D = 1.073920 (margin 7.392%) with uncertainty < 1e-4 (the ' +
      'sub-N = 200 drift). Unlike imp-3175, mirroring the resolution sweep on the bridge margin CONFIRMS the ' +
      'single-resolution snapshot rather than correcting it.',
  }),

  honestCaveat: Object.freeze({
    isProof: false,
    isReductionBelowRH: false,
    rhEquivalent: true,
    isStructuralDiagnostic: true,
    addressesMarginStabilityOnlyNotOperatorPositivity:
      'This module measures the resolution stability of the degree-0 mass-feasibility margin B/D only. Mass- ' +
      'feasibility (B > D_0) kills the impossibility option but is NECESSARY-BUT-NOT-SUFFICIENT; the degree-0 ' +
      'budget proxy is additionally circular (its budget IS ||V||, the RH-equivalent quantity).',
    necessaryNotSufficient:
      'B > D_0 does NOT close the route: the surviving operator-level K_a >= 0 sign-positivity (the off-diagonal ' +
      'endpoint-Hankel step, imp-3066) remains the lone obstruction, UNTOUCHED. No RH verdict.',
    didNotAttemptPositivity: true,
    sota: 'Platt-Trudgian Lambda <= 0.2 remains the rigorous SOTA',
  }),
});

// -- Tripwire assertions ------------------------------------------------------
export const IMP3251_BRIDGE_MARGIN_RESOLUTION_STABILITY_ASSERTIONS = [
  {
    id: 'imp3251-closed-forms-reproduce-recorded-anchors',
    why: 'The exact closed forms must reproduce the section26-mupass verdict anchors: bridge mass B ~ 14.04, ' +
         'raw deficit D_0 ~ 13.07, margin B/D ~ 1.074. A mismatch means the degree-0 masses drifted from the verdict.',
    holds: () =>
      Math.abs(B_EXACT - RECORDED_B) < 0.01 &&
      Math.abs(D_EXACT - RECORDED_D0) < 0.01 &&
      Math.abs(RATIO_EXACT - RECORDED_RATIO) < 1e-3,
  },
  {
    id: 'imp3251-quadrature-converges-to-closed-form',
    why: 'THE MEASUREMENT: the finest live midpoint quadrature must land on the exact closed-form ratio to ' +
         'better than 1e-5, confirming B(N) and D_0(N) converge to their smooth closed forms (not a drifting limit).',
    holds: () => finestVsExact < 1e-5,
  },
  {
    id: 'imp3251-margin-is-resolution-stable',
    why: 'THE DELIVERABLE: the ~7.4% margin HOLDS -- the total drift of B/D from the coarsest N = 50 to the finest ' +
         'N = 6400 must be under 0.01 percentage points, the opposite of the imp-3175 fraction which drifted ~1.5 pp.',
    holds: () => marginDriftPct < 0.01 && marginHoldsEveryRow,
  },
  {
    id: 'imp3251-mass-feasible-every-resolution',
    why: 'Mass-feasibility (B > D_0) must hold at EVERY swept resolution, not just the recorded one -- a flip at ' +
         'any N would mean the impossibility option is resolution-sensitive.',
    holds: () => SWEEP.every((row) => row.B > row.D),
  },
  {
    id: 'imp3251-verdict-is-resolution-converged',
    why: 'The classified verdict must be the resolution-converged / margin-holds reconciliation, not indeterminate; ' +
         'a flip means the sweep stopped being stable or stopped matching the closed form.',
    holds: () => verdict === 'RESOLUTION-CONVERGED-MARGIN-HOLDS-AT-7.39-PERCENT-UNLIKE-3175-FRACTION',
  },
  {
    id: 'imp3251-honest-diagnostic-not-a-verdict',
    why: 'Mandatory honesty: DIAGNOSTIC margin-stability only, mass-feasibility necessary-but-not-sufficient, ' +
         'operator positivity (imp-3066) untouched, positivity not attempted, PT 0.2 stays SOTA. If any flip the ' +
         'module is over-claiming.',
    holds: () => {
      const c = IMP3251_BRIDGE_MARGIN_RESOLUTION_STABILITY.honestCaveat;
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

for (const assertion of IMP3251_BRIDGE_MARGIN_RESOLUTION_STABILITY_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-3251-bridge-margin-resolution-stability assertion failed: ${assertion.id}`);
  }
}

export default IMP3251_BRIDGE_MARGIN_RESOLUTION_STABILITY;
