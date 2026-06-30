/**
 * @module imp-3175-overflow-fraction-resolution-reconcile
 * @fileoverview imp-3175 -- Reconcile the imp-3154 genuine degree-2 overflow
 *   fraction (recorded 0.200 of tau, "reproducing the imp-3144 19.4% anchor")
 *   against the imp-3144 / section26-mupass-operator-verdict recorded 19.4%.
 *   0.200 and 0.194 differ by ~3%, so they are NOT equal: this module pins
 *   whether that gap is a quadrature-resolution effect (0.200 should converge
 *   DOWN to 0.194 as the grid refines) or a genuine difference (0.200 stabilizes,
 *   or moves elsewhere).
 *
 *   ASSESSMENT / DIAGNOSTIC ONLY. No new positivity, no RH verdict, not a
 *   reduction. Platt-Trudgian Lambda &lt;= 0.2 remains the rigorous SOTA.
 *
 *   WHAT IS RECOMPUTED
 *   ------------------
 *   imp-3154 measures the overflow fraction |{tau : nu(tau) > mu(tau)}| / U at a
 *   SINGLE tau-grid resolution (N = 200 midpoint panels on [0, U]), at the
 *   lightweight de Bruijn-Newman Phi (NPHI = 10, a = 0.5, U = 6):
 *
 *     nu(tau) = int_0^tau du int_tau^U dv  Phi(u) Phi(v) sinh(a(v-u))   (genuine
 *               past([0,tau]) - future([tau,U]) shear Volterra block)
 *     mu(tau) = (1 / 2pi) int_tau^U Phi(u)^2 sinh(2 a u) du             (the
 *               integrated Phi^2-tail passive diagonal density, Sec 26-27)
 *
 *   imp-3154 found this overflow fraction DEG-independent (pinned at 0.200 across
 *   monomial truncation degrees 2..10), so the relevant knob is NOT the basis
 *   degree but the tau-grid resolution N. This module sweeps N upward and watches
 *   the overflow fraction.
 *
 *   THE O(N) FACTORIZATION (why high resolution is cheap)
 *   ----------------------------------------------------
 *   The shear weight obeys the genuine hyperbolic addition law
 *     sinh(a(v - u)) = sinh(a v) cosh(a u) - cosh(a v) sinh(a u),
 *   so the past-future double sum FACTORS into a product of a past-prefix sum and
 *   a future-suffix sum:
 *     nu(tau_k) = H^2 [ (sum_{j>k} Phi_j sinh a v_j)(sum_{i<=k} Phi_i cosh a u_i)
 *                     - (sum_{j>k} Phi_j cosh a v_j)(sum_{i<=k} Phi_i sinh a u_i) ].
 *   With prefix/suffix accumulators the whole overflow fraction is O(N) per
 *   resolution (the imp-3154 module evaluates the same quantity as an O(N^2)
 *   double loop at the single N = 200, and the two AGREE at N = 200 -- see the
 *   tripwire below). This lets us reach N = 6400 live.
 *
 *   WHAT THE RESOLUTION SWEEP FINDS (measured, NOT proved)
 *   -----------------------------------------------------
 *   The overflow fraction is MONOTONE INCREASING in N and converges to ~0.2092 of
 *   tau -- it does NOT converge down to the recorded 0.194:
 *     N =  100 -> 0.1900
 *     N =  200 -> 0.2000   (the imp-3154 recorded value, reproduced exactly)
 *     N =  400 -> 0.20250
 *     N =  800 -> 0.20625
 *     N = 1600 -> 0.20750
 *     N = 3200 -> 0.208750
 *     N = 6400 -> 0.209063
 *   and the offline extension confirms the limit (N = 25600 -> 0.209180,
 *   N = 204800 -> 0.2092285). THE VERDICT: the ~3% gap is a quadrature-resolution
 *   effect, but it does NOT close toward 0.194 -- refining the grid moves the
 *   value the OTHER way, UP and away from 0.194, to a converged genuine overflow
 *   fraction of ~0.209. The near-coincidence of imp-3154's coarse N = 200 value
 *   (0.200) with the imp-3144 recorded 0.194 is a COARSE-GRID ACCIDENT, not a
 *   convergence: both 0.194 and 0.200 UNDER-report the resolved genuine overflow
 *   fraction. The number to trust is the resolution-converged ~0.209.
 *
 *   WHICH MODULE NUMBER TO TRUST
 *   ----------------------------
 *   Neither recorded anchor is the converged value. The imp-3144 / section26
 *   "19.4%" and the imp-3154 "0.200" are both single-resolution snapshots that
 *   sit below the limit; the resolution-converged genuine overflow fraction at
 *   this lightweight Phi cell is ~0.209. imp-3154's claim that 0.200 "reproduces
 *   the 19.4% anchor" should be read as "same ~20% order at coarse grid", not as
 *   an equality -- this module records the corrected converged value.
 *
 *   HONEST CAVEAT (mandatory)
 *   -------------------------
 *   DIAGNOSTIC at the genuine Phi (NPHI = 10). The overflow fraction is the
 *   MEASURE of the support where the shear overflows the passive diagonal; the
 *   absolute deficit magnitude (a separate quantity) still carries the offline
 *   normalization convention and is NOT addressed here. A nonzero overflow
 *   fraction is necessary-but-NOT-sufficient at operator order; the off-diagonal
 *   endpoint-Hankel operator step (imp-3066) remains the lone obstruction. No RH
 *   verdict. No false QED.
 *
 *   @see imp-3154-genuine-deg2-deficit-degree-sweep.js (the DEG sweep; records 0.200)
 *   @see section26-mupass-operator-verdict-2026-06-30.js (imp-3144: the 19.4% anchor)
 *   @see imp-mu-pass-overflow-quantification.js (imp-2841: the genuine Phi kernel)
 *
 *   Ticket: imp-3175 (numerical, medium).
 */

const PAPER_REF = 'research-inputs/twin_ladder_consolidated_v52.pdf';
const NPHI = 10;                                    // de Bruijn-Newman truncation (imp-2841 grid)
const A = 0.5;                                       // headline shear weight (the genuine-Phi cell)
const U = 6;                                         // genuine-Phi lag cutoff (the headline cell)

// Live tau-grid resolutions swept (O(N) each via the hyperbolic factorization).
const N_SET = Object.freeze([100, 200, 400, 800, 1600, 3200, 6400]);

const RECORDED_IMP3144_OVERFLOW = 0.194;            // imp-3144 / section26-verdict anchor
const RECORDED_IMP3154_OVERFLOW = 0.200;            // imp-3154 single-resolution (N = 200) value

// Offline-verified limit (extends N_SET to N = 204800 -> 0.2092285, monotone increasing).
const OFFLINE_CONVERGED_OVERFLOW = 0.2092;

/** de Bruijn-Newman completed-Riemann kernel, truncated at n = NPHI (same as imp-2841). */
function phiKernel(u) {
  let s = 0;
  const e2 = Math.exp(2 * u);
  const e4 = Math.exp(4 * u);
  for (let n = 1; n <= NPHI; n++) {
    const n2 = n * n;
    const n4 = n2 * n2;
    s += (2 * Math.PI * Math.PI * n4 * e4 - 3 * Math.PI * n2 * e2) * Math.exp(-Math.PI * n2 * e4);
  }
  return s;
}

/**
 * Genuine (exact hyperbolic) overflow fraction |{tau : nu(tau) > mu(tau)}| / U on
 * an N-panel midpoint grid, computed in O(N) via the sinh(a(v-u)) addition law.
 */
function overflowFraction(N) {
  const H = U / N;
  const phi = new Array(N);
  const ch = new Array(N);
  const sh = new Array(N);
  for (let i = 0; i < N; i++) {
    const u = (i + 0.5) * H;
    phi[i] = phiKernel(u);
    ch[i] = Math.cosh(A * u);
    sh[i] = Math.sinh(A * u);
  }
  // Past prefix accumulators (indices 0..k inclusive).
  const pastCosh = new Array(N);
  const pastSinh = new Array(N);
  let ac = 0;
  let asum = 0;
  for (let k = 0; k < N; k++) {
    ac += phi[k] * ch[k];
    asum += phi[k] * sh[k];
    pastCosh[k] = ac;
    pastSinh[k] = asum;
  }
  // Future suffix accumulators (indices > k) and the passive mu suffix (indices k..N-1).
  const futSinh = new Array(N);
  const futCosh = new Array(N);
  const muSuffix = new Array(N);
  let fs = 0;
  let fc = 0;
  let ms = 0;
  for (let k = N - 1; k >= 0; k--) {
    futSinh[k] = fs;                                 // sum over j > k (set BEFORE folding in k)
    futCosh[k] = fc;
    fs += phi[k] * sh[k];
    fc += phi[k] * ch[k];
    ms += phi[k] * phi[k] * Math.sinh(2 * A * (k + 0.5) * H);
    muSuffix[k] = ms;                                // sum over j >= k
  }
  let overflowPanels = 0;
  for (let k = 0; k < N; k++) {
    const nu = H * H * (futSinh[k] * pastCosh[k] - futCosh[k] * pastSinh[k]);
    const mu = (H / (2 * Math.PI)) * muSuffix[k];
    if (nu > mu) overflowPanels += 1;
  }
  return overflowPanels / N;                         // = (overflowPanels * H) / U
}

const SWEEP = Object.freeze(
  N_SET.map((N) => Object.freeze({ N, overflowFraction: overflowFraction(N) })),
);

const fractionAt200 = SWEEP.find((row) => row.N === 200).overflowFraction;
const finestFraction = SWEEP[SWEEP.length - 1].overflowFraction;
const coarsestFraction = SWEEP[0].overflowFraction;

// Monotone increasing in N (refining the grid moves the fraction UP, not down to 0.194).
const monotoneIncreasing = SWEEP.every(
  (row, i) => i === 0 || row.overflowFraction >= SWEEP[i - 1].overflowFraction - 1e-12,
);

// Distance of the finest live value from each recorded anchor and from the offline limit.
const finestVsImp3144 = Math.abs(finestFraction - RECORDED_IMP3144_OVERFLOW);
const finestVsImp3154 = Math.abs(finestFraction - RECORDED_IMP3154_OVERFLOW);
const finestVsConverged = Math.abs(finestFraction - OFFLINE_CONVERGED_OVERFLOW);

// VERDICT: the gap is a resolution effect, but it does NOT close toward 0.194 --
// the value converges UP to ~0.209, so both recorded anchors under-report it.
const movesAwayFromImp3144 = finestFraction > RECORDED_IMP3144_OVERFLOW + 0.005;
const verdict =
  monotoneIncreasing && movesAwayFromImp3144
    ? 'RESOLUTION-EFFECT-CONVERGES-UP-TO-0.209-NOT-DOWN-TO-0.194'
    : 'INDETERMINATE';

export const IMP3175_OVERFLOW_FRACTION_RESOLUTION_RECONCILE = Object.freeze({
  id: 'imp-3175-overflow-fraction-resolution-reconcile',
  ticket: 'imp-3175',
  paperSourcePath: PAPER_REF,
  paperSections: ['§25', '§26', '§27'],
  relatedDegSweep: 'imp-3154-genuine-deg2-deficit-degree-sweep.js',
  relatedVerdict: 'section26-mupass-operator-verdict-2026-06-30.js',
  relatedGenuinePhi: 'imp-mu-pass-overflow-quantification.js',

  summary:
    'Reconciles the imp-3154 genuine degree-2 overflow fraction (0.200 of tau at ' +
    'N = 200, claimed to "reproduce" the imp-3144 / section26 19.4% anchor) by ' +
    'recomputing |{tau : nu(tau) > mu(tau)}| / U at increasing tau-grid resolution ' +
    'N in {100..6400}, at the lightweight de Bruijn-Newman Phi (NPHI = 10, a = 0.5, ' +
    'U = 6). Using the sinh(a(v-u)) addition law the past-future shear block factors ' +
    'into prefix/suffix sums, so each resolution is O(N). FINDING: the overflow ' +
    'fraction is MONOTONE INCREASING in N (0.1900 at N = 100, 0.2000 at N = 200 ' +
    'reproducing imp-3154 exactly, 0.209063 at N = 6400) and converges to ~0.2092 ' +
    '(offline N = 204800 -> 0.2092285). VERDICT: the ~3% gap is a quadrature-' +
    'resolution effect, but it does NOT close toward 0.194 -- refinement moves the ' +
    'value UP and away from 0.194 to a converged genuine overflow fraction of ~0.209. ' +
    'The near-coincidence of the coarse 0.200 with 0.194 is a grid accident; BOTH ' +
    'recorded anchors under-report the resolved fraction, which is the number to ' +
    'trust (~0.209). DIAGNOSTIC; carries NO RH verdict.',

  construction: Object.freeze({
    phiKernel: 'de Bruijn-Newman: sum_{n=1..10} (2 pi^2 n^4 e^{4u} - 3 pi n^2 e^{2u}) exp(-pi n^2 e^{4u})',
    phiTruncationN: NPHI,
    shearDensity: 'nu(tau) = int_0^tau du int_tau^U dv Phi(u) Phi(v) sinh(a(v-u))  (past-future Volterra block)',
    passiveDensity: 'mu(tau) = (1/2pi) int_tau^U Phi(u)^2 sinh(2 a u) du  (integrated Phi^2-tail diagonal)',
    overflowFunctional: '|{tau : nu(tau) > mu(tau)}| / U  (fraction of [0, U] where the shear overflows the passive)',
    factorization: 'sinh(a(v-u)) = sinh(av)cosh(au) - cosh(av)sinh(au) -> past-prefix x future-suffix, O(N) per resolution',
    a: A,
    U,
    resolutionSet: N_SET,
    quadrature: 'midpoint, N panels on [0, U]',
    selfComputing: true,
  }),

  measured: Object.freeze({
    sweep: SWEEP,                                    // per resolution: N, overflow fraction of tau
    coarsestFraction,                                // overflow fraction at N = 100
    fractionAt200,                                   // overflow fraction at N = 200 (reproduces imp-3154 0.200)
    finestFraction,                                  // overflow fraction at N = 6400 (live finest)
    offlineConvergedOverflow: OFFLINE_CONVERGED_OVERFLOW, // ~0.2092 limit (offline N = 204800)
    monotoneIncreasing,                              // refining the grid moves the fraction UP
    recordedImp3144Overflow: RECORDED_IMP3144_OVERFLOW,
    recordedImp3154Overflow: RECORDED_IMP3154_OVERFLOW,
    finestVsImp3144,                                 // distance from the 19.4% anchor (~0.015, growing with N)
    finestVsImp3154,                                 // distance from the 0.200 snapshot (~0.009)
    finestVsConverged,                               // distance from the ~0.209 limit (small)
    verdict,                                         // RESOLUTION-EFFECT-CONVERGES-UP-TO-0.209-NOT-DOWN-TO-0.194
  }),

  interpretation: Object.freeze({
    gapIsResolutionNotEquality:
      'The overflow fraction is grid-dependent: 0.200 is the coarse N = 200 snapshot, not a converged value. ' +
      'Refining the tau grid does NOT bring 0.200 down to the recorded 0.194 -- it raises it monotonically, ' +
      'to 0.209063 by N = 6400 and ~0.2092 in the offline limit. The ~3% gap is therefore a quadrature ' +
      'effect, but it points AWAY from 0.194, not toward it.',
    coarseGridAccident:
      'imp-3154 reports its N = 200 value 0.200 as "reproducing the recorded 19.4% anchor". The two are ' +
      'within ~3% only because N = 200 happens to sit between the true ~0.209 limit and the coarsest 0.190; ' +
      'it is a grid accident, not an equality. Both 0.194 and 0.200 under-report the resolved fraction.',
    numberToTrust:
      'The resolution-converged genuine overflow fraction at this lightweight Phi cell is ~0.209 (monotone ' +
      'limit of the N sweep). Neither the imp-3144 "19.4%" nor the imp-3154 "0.200" is the converged value; ' +
      'this module records ~0.209 as the corrected number to trust for the overflow-support fraction.',
  }),

  honestCaveat: Object.freeze({
    isProof: false,
    isReductionBelowRH: false,
    rhEquivalent: true,
    isStructuralDiagnostic: true,
    addressesOverflowFractionOnlyNotAbsoluteDeficitMagnitude:
      'This module reconciles the overflow-SUPPORT fraction |{nu > mu}| / U only. The absolute deg-2 deficit ' +
      'magnitude (~1.19e-7 in imp-3154) is a separate quantity that still carries the offline normalization ' +
      'convention and is NOT re-derived here.',
    necessaryNotSufficient:
      'A nonzero overflow fraction is necessary-but-NOT-sufficient at operator order; the off-diagonal ' +
      'endpoint-Hankel operator step (imp-3066) remains the lone obstruction. No RH verdict.',
    didNotAttemptPositivity: true,
    sota: 'Platt-Trudgian Lambda <= 0.2 remains the rigorous SOTA',
  }),
});

// -- Tripwire assertions ------------------------------------------------------
export const IMP3175_OVERFLOW_FRACTION_RESOLUTION_RECONCILE_ASSERTIONS = [
  {
    id: 'imp3175-reproduces-imp3154-at-n200',
    why: 'The O(N) factorized overflow fraction must reproduce the imp-3154 O(N^2) double-loop value EXACTLY ' +
         'at the shared N = 200 resolution (0.200 of tau); a mismatch means the factorization or the genuine ' +
         'densities drifted from imp-3154.',
    holds: () => Math.abs(fractionAt200 - RECORDED_IMP3154_OVERFLOW) < 1e-9,
  },
  {
    id: 'imp3175-overflow-fraction-monotone-increasing',
    why: 'THE DELIVERABLE: refining the tau grid moves the overflow fraction MONOTONICALLY UP, not down. If ' +
         'it were a discretization gap closing to 0.194 the sweep would DECREASE; instead it increases.',
    holds: () => monotoneIncreasing && finestFraction > fractionAt200,
  },
  {
    id: 'imp3175-converges-up-not-down-to-0p194',
    why: 'THE VERDICT: the converged value sits ABOVE both recorded anchors, near ~0.209 -- it does NOT ' +
         'converge down to the recorded 0.194. The finest live value must exceed 0.194 by a clear margin and ' +
         'land near the offline limit.',
    holds: () =>
      finestFraction > RECORDED_IMP3144_OVERFLOW + 0.005 &&
      finestFraction > RECORDED_IMP3154_OVERFLOW &&
      Math.abs(finestFraction - OFFLINE_CONVERGED_OVERFLOW) < 0.005,
  },
  {
    id: 'imp3175-finest-closer-to-converged-than-to-either-anchor',
    why: 'Sanity: the finest resolution must be closer to the ~0.209 converged limit than to either the ' +
         '0.194 or the 0.200 recorded snapshot, confirming neither anchor is the converged value.',
    holds: () => finestVsConverged < finestVsImp3144 && finestVsConverged < finestVsImp3154,
  },
  {
    id: 'imp3175-verdict-is-resolution-up',
    why: 'The classified verdict must be the resolution-up reconciliation, not indeterminate; a flip means ' +
         'the sweep stopped being monotone or stopped clearing 0.194.',
    holds: () => verdict === 'RESOLUTION-EFFECT-CONVERGES-UP-TO-0.209-NOT-DOWN-TO-0.194',
  },
  {
    id: 'imp3175-honest-diagnostic-not-a-verdict',
    why: 'Mandatory honesty: DIAGNOSTIC reconciliation, overflow-fraction-only (not the absolute deficit ' +
         'magnitude), necessary-but-not-sufficient at operator order, positivity not attempted, PT 0.2 stays ' +
         'SOTA. If any flip the module is over-claiming.',
    holds: () => {
      const c = IMP3175_OVERFLOW_FRACTION_RESOLUTION_RECONCILE.honestCaveat;
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

for (const assertion of IMP3175_OVERFLOW_FRACTION_RESOLUTION_RECONCILE_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-3175-overflow-fraction-resolution-reconcile assertion failed: ${assertion.id}`);
  }
}

export default IMP3175_OVERFLOW_FRACTION_RESOLUTION_RECONCILE;
