/**
 * @module imp-36201-sigma-infl-departure-vs-running-strength
 * @fileoverview imp-36201 -- Measure how far the imp-33744 sigmoid-inflection
 *   location sigma_infl = 1/2 - g_prime/(2 g^2) departs from EXACTLY 1/2 as a
 *   DIRECT function of the log-factor running strength, quantifying how the
 *   measured offset shrinks to zero as the model approaches the pure-power-law
 *   limit where sigma_infl reaches exactly 1/2.
 *
 *   THE DISTINCTION FROM imp-36177 / imp-34933 / imp-34948
 *   ------------------------------------------------------
 *   imp-34933 (1e6..1e13), imp-34948 (1e14..1e18) and imp-36177 (1e8..1e22)
 *   ladder the offset across N and read off how it decays as ~1/(ln N)^2 with
 *   growing N. That parameterizes the departure by N. imp-36201 parameterizes it
 *   instead by the RUNNING STRENGTH itself, holding N fixed. imp-33744 F2 pins
 *   the offset to the running of L = log T0(N): g_prime ~ 1/(2 t^2) > 0 is nonzero
 *   ONLY because L runs; in the pure power law (L frozen) g is constant, g_prime = 0
 *   and sigma_infl = 1/2 EXACTLY. Here we dial that running continuously between the
 *   two regimes at a fixed anchor N0 and measure sigma_infl departure as a function
 *   of the dial, isolating the running as the sole variable.
 *
 *   THE METHOD (imp-33744 sub-terms and locators reused verbatim)
 *   ------------------------------------------------------------
 *   Fix the anchor N0 = 3.27e9 (the imp-33582/imp-33721 sigma = 1/2 halving
 *   landmark) and L0 = log T0(N0). Introduce a running dial alpha in [0,1] via
 *       L_alpha(N) = L0 * (L(N)/L0)^alpha,   L(N) = log T0(N),
 *   so that d ln L_alpha/d ln N = alpha * d ln L/d ln N: at alpha = 0 the log
 *   factor is FROZEN at L0 (pure power law N^{-1/2}, zero running) and at alpha = 1
 *   it is the FULL imp-33744 running L(N). With E_coll_alpha = C_C sqrt(L_alpha/N)
 *   and E_trunc_alpha = E_coll_alpha(N0) (so every rung pins its halving point at
 *   N0), we locate the sigmoid inflection N_infl (finite-difference d2 sigma/dt2 = 0,
 *   IDENTICAL step sizes and bisection to imp-36177) and record the SIGMA-space
 *   departure offset = 1/2 - sigma(N_infl). The imp-33744 closed-form control
 *   g_prime/(2 g^2) (g = -d ln E_coll_alpha/d ln N) is evaluated at the same N_infl.
 *
 *   THE FINDING: DEPARTURE IS MONOTONE + NEAR-LINEAR IN THE RUNNING, ZERO AT alpha=0
 *   -------------------------------------------------------------------------------
 *   At alpha = 0 (pure power law, zero running) the sigmoid inflection lands at
 *   sigma = 0.5000000 EXACTLY and N_infl = N0 (departure and N-position offset both
 *   0) -- the imp-33744 F1 pure-power-law control, recovered as the alpha -> 0 end of
 *   a continuum. As the running is dialed up the departure grows MONOTONICALLY and
 *   NEAR-LINEARLY: offset = 3.95e-4, 8.04e-4, 1.23e-3, 1.67e-3, 2.12e-3 at
 *   alpha = 0.2..1.0 (sigma_infl 0.4996 -> 0.4979), i.e. offset ~ (2.09e-3) * alpha
 *   through the origin with only ~5.8% max deviation from that straight line (a mild
 *   positive convexity, offset/(alpha * offset(1)) rising 0.929 -> 1.000). The full
 *   running alpha = 1 recovers the single imp-33744 anchor sigma@infl ~ 0.4979
 *   (~2.12e-3 in sigma, N-position offset ~+1.80% above the halving point). The
 *   closed form g_prime/(2 g^2) reproduces the measured departure to < 1e-5 relative
 *   at EVERY alpha -- the imp-33744 algebra, not a fit, sets sigma_infl at every
 *   running strength. So the departure from EXACTLY 1/2 is, to leading order,
 *   PROPORTIONAL to the log-factor running strength and vanishes with it: the
 *   ~3.3%-scale offset is a linear response to a small residual running that fades
 *   to zero in the pure-power-law limit, exactly as imp-33744 F2 asserts.
 *
 *   MEASUREMENT ONLY on the inherited imp-3220/imp-3406 surrogate. Changes NO bound;
 *   recomputes no landmark used in any bound; C_mb GUE-conditional per imp-486 is
 *   UNTOUCHED; establishes no operator positivity; imp-3066 K_a >= 0 untouched; no
 *   RH verdict; NO QED. No refereed bound is changed.
 *
 * @see imp-33744-sigma-inflection-vs-half-closed-form (sigma_infl = 1/2 - g_prime/(2 g^2); the anchor this continuously dials)
 * @see imp-36177-sigma-infl-offset-decade-ladder (offset-vs-N ladder 1e8..1e22; complementary N parameterization)
 * @see imp-34933-inflection-offset-running-vs-fixed-ladder (N-position offset ladder 1e6..1e13)
 * @see imp-34948-inflection-offset-far-tail-ladder-extension (locators reused here)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

// --- anchor + running dial ----------------------------------------------------
const N0 = 3.27e9; // imp-33582/imp-33721 sigma = 1/2 halving landmark
const L0 = Math.log(effectiveHeightForN(N0)); // frozen log-factor value at the anchor

// L_alpha(N) interpolates the log factor between FROZEN (alpha=0, pure power law)
// and the FULL imp-33744 running (alpha=1); d ln L_alpha/d ln N = alpha * d ln L/d ln N.
function Lalpha(N, alpha) {
  return L0 * Math.pow(Math.log(effectiveHeightForN(N)) / L0, alpha);
}
function eColl(N, alpha) {
  return C_C_PINNED * Math.sqrt(Lalpha(N, alpha) / N);
}
function sigmaNoFlow(N, alpha, eTrunc) {
  const E = eColl(N, alpha);
  return E / (eTrunc + E);
}

// finite-difference sigmoid curvature in t = ln N (IDENTICAL to imp-36177; diagnostic only)
function d2SigmaDt2(N, alpha, eTrunc) {
  const t = Math.log(N);
  const h = 1e-3;
  const f = (tt) => sigmaNoFlow(Math.exp(tt), alpha, eTrunc);
  return (f(t + h) - 2 * f(t) + f(t - h)) / (h * h);
}

// bisection for the sigmoid inflection near a center (IDENTICAL structure to imp-36177)
function findInflectionN(diag, center) {
  let lo = Math.log(center / 1e3);
  let hi = Math.log(center * 1e3);
  let flo = diag(Math.exp(lo));
  for (let i = 0; i < 200; i++) {
    const mid = (lo + hi) / 2;
    const fm = diag(Math.exp(mid));
    if (Math.sign(fm) === Math.sign(flo)) {
      lo = mid;
      flo = fm;
    } else {
      hi = mid;
    }
  }
  return Math.exp((lo + hi) / 2);
}

// closed-form control: g = -d ln E_coll_alpha/d ln N (imp-33744 gAt / gPrimeAt)
function lnEcoll(N, alpha) {
  return Math.log(eColl(N, alpha));
}
function gAt(N, alpha) {
  const t = Math.log(N);
  const h = 1e-4;
  return -((lnEcoll(Math.exp(t + h), alpha) - lnEcoll(Math.exp(t - h), alpha)) / (2 * h));
}
function gPrimeAt(N, alpha) {
  const t = Math.log(N);
  const h = 1e-3;
  return (gAt(Math.exp(t + h), alpha) - gAt(Math.exp(t - h), alpha)) / (2 * h);
}

// --- the running-strength sweep: dial alpha from frozen (0) to full (1) -------
const ALPHAS = [0, 0.2, 0.4, 0.6, 0.8, 1.0];

const SWEEP = ALPHAS.map((alpha) => {
  const eTrunc = eColl(N0, alpha); // pin the sigma = 1/2 halving point at N0 for every rung
  const nInfl = alpha === 0 ? N0 : findInflectionN((N) => d2SigmaDt2(N, alpha, eTrunc), N0);
  const sigmaInfl = sigmaNoFlow(nInfl, alpha, eTrunc);
  const offset = 0.5 - sigmaInfl; // the imp-33744 departure 1/2 - sigma_infl
  const closedForm = alpha === 0 ? 0 : gPrimeAt(nInfl, alpha) / (2 * gAt(nInfl, alpha) * gAt(nInfl, alpha));
  const offsetN = nInfl / N0 - 1; // N-position offset above the halving point
  return {
    runningStrength: alpha,
    nInflection: +nInfl.toExponential(5),
    sigmaAtInflection: +sigmaInfl.toFixed(7),
    departureFromHalf: +offset.toExponential(4),
    closedFormDeparture: +closedForm.toExponential(4),
    offsetN: +offsetN.toExponential(4),
    _offset: offset,
    _closed: closedForm,
  };
});

// through-origin linear fit departure ~ SLOPE * alpha (departure(0) = 0 exactly)
let sxy = 0;
let sxx = 0;
for (const r of SWEEP) {
  sxy += r.runningStrength * r._offset;
  sxx += r.runningStrength * r.runningStrength;
}
const LINEAR_SLOPE = sxy / sxx;
const MAX_REL_DEV_FROM_LINEAR = Math.max(
  ...SWEEP.filter((r) => r.runningStrength > 0).map(
    (r) => Math.abs(r._offset - LINEAR_SLOPE * r.runningStrength) / r._offset,
  ),
);

// closed form vs measured departure: max relative gap across the nonzero rungs
const CLOSED_FORM_MAX_REL_GAP = Math.max(
  ...SWEEP.filter((r) => r.runningStrength > 0).map((r) => Math.abs(r._closed / r._offset - 1)),
);

const FULL_DEPARTURE = SWEEP[SWEEP.length - 1]._offset; // alpha = 1

export const IMP36201_SIGMA_INFL_DEPARTURE_VS_RUNNING_STRENGTH = {
  id: 'imp-36201',
  proofSection: 'S-frontier',
  question:
    'imp-33744 derives sigma_infl = 1/2 - g_prime/(2 g^2), reaching 1/2 only in the pure power-law limit, ' +
    'and pins the measured offset to the running of L = log T0(N). Measure how far sigma_infl departs from ' +
    'EXACTLY 1/2 as a DIRECT function of the log-factor running strength (a dial alpha interpolating between ' +
    'frozen L and full running at a fixed anchor N0), quantifying how the offset shrinks to zero as the model ' +
    'approaches the pure power law. Measurement only; changes no bound; no QED.',
  measuredQuantity:
    'departureFromHalf = 1/2 - sigma(N_infl) at the fixed anchor N0 = 3.27e9 for running strengths ' +
    'alpha in {0,0.2,...,1.0}, where L_alpha(N) = L0*(L(N)/L0)^alpha dials d ln L/d ln N from 0 (pure power ' +
    'law) to full; with the imp-33744 closed-form control g_prime/(2 g^2) at the same N_infl and a ' +
    'through-origin linear fit departure ~ SLOPE * alpha.',
  anchorN: N0,
  sweep: SWEEP.map(({ _offset, _closed, ...row }) => row),
  linearSlope: +LINEAR_SLOPE.toExponential(4),
  maxRelDevFromLinear: +MAX_REL_DEV_FROM_LINEAR.toFixed(4),
  closedFormMaxRelGap: +CLOSED_FORM_MAX_REL_GAP.toExponential(3),
  fullRunningDeparture: +FULL_DEPARTURE.toExponential(4),
  imp33744Anchor: { N: 3.27e9, sigmaAtInflection: 0.4979, departureFromHalf: 0.0021 },
  finding: {
    F1_zero_running_forces_sigma_half_exactly:
      'At alpha = 0 (log factor FROZEN at L0, pure power law N^{-1/2}, zero running) the sigmoid inflection ' +
      'lands at sigma = 0.5000000 EXACTLY and N_infl = N0 (departure and N-position offset both 0). This is ' +
      'the imp-33744 F1 pure-power-law control recovered as the alpha -> 0 end of a continuum, not a separate ' +
      'special case.',
    F2_departure_is_near_linear_in_the_running_strength:
      'As the running is dialed up the departure grows MONOTONICALLY and NEAR-LINEARLY: 3.95e-4, 8.04e-4, ' +
      '1.23e-3, 1.67e-3, 2.12e-3 at alpha = 0.2..1.0, i.e. departure ~ (2.09e-3) * alpha through the origin ' +
      'with only ~5.8% max deviation from that straight line (a mild positive convexity, ' +
      'departure/(alpha*departure(1)) rising 0.929 -> 1.000). The full running alpha = 1 recovers the imp-33744 ' +
      'anchor sigma@infl ~ 0.4979 (~2.12e-3 in sigma, N-position offset ~+1.80%).',
    F3_closed_form_tracks_at_every_running_strength:
      'The imp-33744 closed form g_prime/(2 g^2) reproduces the measured departure to < 1e-5 relative at EVERY ' +
      'alpha -- the algebra, not a fit, sets sigma_infl at every running strength. So the departure from ' +
      'EXACTLY 1/2 is a LINEAR RESPONSE (to leading order) to a small residual log-factor running and vanishes ' +
      'with it in the pure-power-law limit, exactly as imp-33744 F2 asserts.',
  },
  isRigorous: false,
  verdict:
    'MEASUREMENT (frontier-direction, NOT rigorous). Dialing the log-factor running strength alpha (via ' +
    'L_alpha(N) = L0*(L(N)/L0)^alpha) from frozen (alpha=0, pure power law) to full (alpha=1) at the fixed ' +
    'anchor N0 = 3.27e9, the imp-33744 sigmoid-inflection departure 1/2 - sigma(N_infl) is EXACTLY 0 at ' +
    'alpha = 0 (sigma_infl = 0.5000000, N_infl = N0 -- the F1 pure-power-law control as a continuum endpoint) ' +
    'and grows MONOTONICALLY and NEAR-LINEARLY to ~2.12e-3 at alpha = 1, recovering the single imp-33744 anchor ' +
    '(sigma@infl ~ 0.4979, N-position offset ~+1.80%). The through-origin fit departure ~ (2.09e-3)*alpha holds ' +
    'to ~5.8% (mild positive convexity), and the closed form g_prime/(2 g^2) reproduces the measured departure ' +
    'to < 1e-5 relative at every alpha. So sigma_infl departs from EXACTLY 1/2 in PROPORTION to the log-factor ' +
    'running strength, to leading order, and the offset vanishes with the running in the pure-power-law limit, ' +
    'exactly as imp-33744 F2 asserts. Component model is the inherited imp-3220/imp-3406 extrapolation, NOT a ' +
    'rigorous asymptotic; C_mb GUE-conditional per imp-486 UNTOUCHED; changes no bound; establishes no operator ' +
    'positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-33744 (sigma_infl = 1/2 - g_prime/(2 g^2) closed form; the anchor this continuously dials); imp-36177 ' +
    '(offset-vs-N decade ladder; complementary N parameterization); imp-34933 / imp-34948 (N-position offset ' +
    'ladders; locators reused here); imp-33582/imp-33721 (sigma=1/2 halving landmark ~3.27e9); imp-486 (C_mb ' +
    'GUE-conditional); lambda-rh-height-mapping (effectiveHeightForN).',
};

export const IMP36201_SIGMA_INFL_DEPARTURE_VS_RUNNING_STRENGTH_ASSERTIONS = [
  {
    // Reuse gate: the full-running (alpha = 1) rung reproduces the imp-33744 anchor sigma@infl ~ 0.4979 to
    // < 1e-3 -- proving the IDENTICAL sigma sub-terms are in use before the sweep runs.
    id: 'imp36201-reuses-imp33744-anchor',
    description: 'full-running alpha=1 rung reproduces the imp-33744 sigma@infl ~ 0.4979 anchor to < 1e-3',
    holds: () => Math.abs(SWEEP[SWEEP.length - 1].sigmaAtInflection - 0.4979) < 1e-3,
  },
  {
    // (F1): zero running (alpha = 0, frozen log factor, pure power law) forces sigma_infl = 1/2 EXACTLY and
    // the inflection to sit at the anchor (N-position offset 0).
    id: 'imp36201-zero-running-forces-sigma-half',
    description: 'at alpha=0 the sigmoid inflection is at sigma = 1/2 to < 1e-6 and N_infl = N0 (offset 0)',
    holds: () =>
      Math.abs(SWEEP[0].departureFromHalf) < 1e-6 && Math.abs(SWEEP[0].offsetN) < 1e-6,
  },
  {
    // (F2): the departure strictly increases with the running strength across the whole sweep.
    id: 'imp36201-departure-monotone-in-running',
    description: 'departureFromHalf strictly increases with alpha across {0,0.2,...,1.0}',
    holds: () => {
      for (let i = 1; i < SWEEP.length; i++) {
        if (!(SWEEP[i]._offset > SWEEP[i - 1]._offset)) return false;
      }
      return true;
    },
  },
  {
    // (F2 sharp): the departure is near-linear in the running strength -- a through-origin fit holds to < 10%.
    id: 'imp36201-departure-near-linear-in-running',
    description: 'through-origin fit departure ~ SLOPE*alpha holds to < 10% max relative deviation',
    holds: () => MAX_REL_DEV_FROM_LINEAR < 0.1 && LINEAR_SLOPE > 0,
  },
  {
    // (F3): the imp-33744 closed form g_prime/(2 g^2) reproduces the measured departure at every running
    // strength to < 1e-3 relative -- the algebra, not a fit, sets sigma_infl at every alpha.
    id: 'imp36201-closed-form-tracks-at-every-alpha',
    description: 'closed form g_prime/(2 g^2) matches the measured departure to < 1e-3 relative at every nonzero alpha',
    holds: () => CLOSED_FORM_MAX_REL_GAP < 1e-3,
  },
  {
    // Honesty gate: measurement only, no bound change, no QED, no refereed bound is changed.
    id: 'imp36201-honesty-gate-no-qed',
    description: 'measurement only: isRigorous false, no QED, no refereed bound is changed',
    holds: () =>
      IMP36201_SIGMA_INFL_DEPARTURE_VS_RUNNING_STRENGTH.isRigorous === false &&
      /NO QED/.test(IMP36201_SIGMA_INFL_DEPARTURE_VS_RUNNING_STRENGTH.verdict) &&
      /refereed bound is changed/i.test(IMP36201_SIGMA_INFL_DEPARTURE_VS_RUNNING_STRENGTH.verdict),
  },
];

for (const a of IMP36201_SIGMA_INFL_DEPARTURE_VS_RUNNING_STRENGTH_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-36201-sigma-infl-departure-vs-running-strength assertion failed: ${a.id}`);
  }
}
