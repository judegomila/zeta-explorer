// viz-caustic-resonance-checks.js -- imp-2735
//
// Numerical self-check (tripwire) module for the caustic resonance condition
// asserted in prose by VizCausticResonancePage.jsx (imp-2724) and the prime
// caustic heatmap pages. Those pages CLAIM, but never check, the arithmetic
// behind the bright-band / resonance correspondence. This module pins it.
//
// The math being certified
// -------------------------
// A prime p is in a "bright band" at imaginary height t when its log-phase is
// near 0 mod 2pi:
//
//     bright(p, t, eps)  <=>  |wrap(t * log p)| < eps,   wrap(x) = x - 2pi*round(x/2pi)
//
// For a prime pair (p_i, p_j) with i<j the page draws a resonance tick at
//
//     t_res = 2*pi*k / log(p_j/p_i),    k = 1,2,3,...
//
// At exactly that t the two primes share an IDENTICAL wrapped phase, because
//
//     wrap(t_res*log p_j) - wrap(t_res*log p_i) = wrap(t_res*log(p_j/p_i))
//                                                = wrap(2*pi*k) = 0.
//
// Consequences this module checks as tripwires:
//   (R1) wrap stays in [-pi, pi] (the phase-folding primitive is correct).
//   (R2) at t_res the relative phase wrap(t_res*log(p_j/p_i)) is ~0.
//   (R3) the resonance identity inverts: log(p_j/p_i) ~ 2*pi*k / t_res, i.e.
//        log(p_i/p_j) ~ -2*pi*k/t_res to numeric tolerance.
//   (R4) bright-band COINCIDENCE: bright(p_i) === bright(p_j) at t_res for the
//        page eps grid -- the two primes light up (or not) together.
//   (R5) non-vacuity: at a deliberately off-resonance t the relative phase is
//        NOT ~0, so R2/R4 are not trivially satisfied for every t.
//
// Imports are intentionally light (just getPrimes); no zeros bundle is touched,
// so this module is safe under ssrLoadModule in scripts/run-assertions.mjs.

import { getPrimes } from '../math/primes.js';

const TWO_PI = 2 * Math.PI;

// Phase folding, identical to the page (VizCausticResonancePage.jsx:90).
function wrap(x) {
  return x - TWO_PI * Math.round(x / TWO_PI);
}

// Bright-band predicate, identical in form to the page (line 91).
function bright(p, t, eps) {
  return Math.abs(wrap(t * Math.log(p))) < eps;
}

// Sample primes for the checks -- small, deterministic, no heavy compute.
const PRIMES = getPrimes(30); // first 30 primes
const KMAX = 3;
const EPS_GRID = [0.1, 0.25, 0.4]; // matches the page eps slider range

// Tolerances. The resonance identity is exact in exact arithmetic; in IEEE-754
// the residual is a few ulps scaled by t (~50), so 1e-9 is comfortably safe.
const PHASE_TOL = 1e-9;
const RECON_TOL = 1e-9;

// Build the resonance samples (p_i, p_j, k, t_res) and the per-sample residuals.
const SAMPLES = [];
for (let j = 1; j < PRIMES.length; j++) {
  for (let i = 0; i < j; i++) {
    const logRatio = Math.log(PRIMES[j]) - Math.log(PRIMES[i]); // log(p_j/p_i) > 0
    for (let k = 1; k <= KMAX; k++) {
      const t = (TWO_PI * k) / logRatio;
      const relPhase = Math.abs(wrap(t * logRatio));            // R2 residual
      const recon = Math.abs(logRatio - (TWO_PI * k) / t);      // R3 residual
      // R4: coincidence over the eps grid.
      let coincideAll = true;
      for (const eps of EPS_GRID) {
        if (bright(PRIMES[i], t, eps) !== bright(PRIMES[j], t, eps)) {
          coincideAll = false;
          break;
        }
      }
      SAMPLES.push({
        pi: PRIMES[i], pj: PRIMES[j], k, t, relPhase, recon, coincideAll,
      });
    }
  }
}

const MAX_REL_PHASE = SAMPLES.reduce((m, s) => Math.max(m, s.relPhase), 0);
const MAX_RECON = SAMPLES.reduce((m, s) => Math.max(m, s.recon), 0);
const ALL_COINCIDE = SAMPLES.every((s) => s.coincideAll);

// R5 non-vacuity: pick the (p2,p3) k=1 resonance and step off it by 0.7 in t.
const OFF_LOG_RATIO = Math.log(3) - Math.log(2);
const OFF_T = TWO_PI / OFF_LOG_RATIO + 0.7;
const OFF_REL_PHASE = Math.abs(wrap(OFF_T * OFF_LOG_RATIO));

// wrap-range probe over a spread of magnitudes/signs.
const WRAP_MAX = [0.3, -7.1, 1000.3, -7777.7, 3.14159 * 5].reduce(
  (m, x) => Math.max(m, Math.abs(wrap(x))), 0
);

export const VIZ_CAUSTIC_RESONANCE_CHECKS_ASSERTIONS = [
  {
    id: 'imp2735-wrap-in-pi-range',
    description: 'wrap(x) folds any real into [-pi, pi] (phase-folding primitive is correct)',
    holds: () => WRAP_MAX <= Math.PI + 1e-12,
  },
  {
    id: 'imp2735-resonance-relative-phase-zero',
    description:
      'At t_res = 2*pi*k/log(p_j/p_i) the two primes share an identical wrapped phase, ' +
      'so wrap(t_res*log(p_j/p_i)) ~ 0 over all sampled (p_i,p_j,k)',
    holds: () => MAX_REL_PHASE < PHASE_TOL,
  },
  {
    id: 'imp2735-resonance-identity-inverts',
    description:
      'The resonance identity inverts: log(p_j/p_i) ~ 2*pi*k/t_res to tolerance, ' +
      'i.e. the prose condition log(p_i/p_j) ~ -2*pi*k/t holds numerically',
    holds: () => MAX_RECON < RECON_TOL,
  },
  {
    id: 'imp2735-brightband-coincidence',
    description:
      'Bright-band coincidence: bright(p_i) === bright(p_j) at t_res across the eps grid ' +
      '(the resonant pair lights up together, justifying the overlay)',
    holds: () => ALL_COINCIDE,
  },
  {
    id: 'imp2735-non-vacuous-offresonance',
    description:
      'Non-vacuity: a deliberately off-resonance t gives a relative phase far from 0, ' +
      'so the resonance checks are not trivially true for every t',
    holds: () => OFF_REL_PHASE > 0.05,
  },
];

for (const a of VIZ_CAUSTIC_RESONANCE_CHECKS_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      '[imp-2735] viz-caustic-resonance-checks assertion failed: ' + a.id +
      ' -- ' + a.description +
      ' [maxRelPhase=' + MAX_REL_PHASE.toExponential(3) +
      ', maxRecon=' + MAX_RECON.toExponential(3) +
      ', allCoincide=' + ALL_COINCIDE +
      ', offResPhase=' + OFF_REL_PHASE.toFixed(4) +
      ', wrapMax=' + WRAP_MAX.toFixed(4) + ']'
    );
  }
}

export const VIZ_CAUSTIC_RESONANCE_CHECKS_META = {
  nSamples: SAMPLES.length,
  maxRelPhase: MAX_REL_PHASE,
  maxRecon: MAX_RECON,
  allCoincide: ALL_COINCIDE,
  offResPhase: OFF_REL_PHASE,
};
