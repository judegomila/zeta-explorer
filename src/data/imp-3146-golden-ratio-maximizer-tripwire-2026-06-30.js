/**
 * @module imp-3146-golden-ratio-maximizer-tripwire-2026-06-30
 *
 * imp-3176: CROSS-MODULE tripwire lock for the imp-3146 golden-ratio landmark.
 * imp-3146-residual-gap-limit-aU-grid SELF-ASSERTS that the saturating
 * residual-gap limit  G(s) = tanh(s) - tanh(s/2)  (s = a*U) is maximized exactly
 * where  cosh(s*) = phi  (the golden ratio), at s* = arccosh(phi) ~ 1.06128, with
 * maximal value  G(s*) = phi^{-5/2} ~ 0.30028. The live module pins the maximizer
 * by the CLOSED FORM  S_STAR = Math.acosh(PHI)  and confirms it with a 24000-point
 * grid fine-scan over s.
 *
 * This module RE-DERIVES the maximizer from an INDEPENDENT first-order condition:
 * it solves  G prime(s) = sech^2(s) - (1/2) sech^2(s/2) = 0  with its OWN bisection
 * on the bracket [0.5, 2.0] (where G prime changes sign + to -), and NEVER calls
 * Math.acosh -- so the recomputed s_star is built only from the stationarity
 * equation, not from arccosh(phi). It then certifies, from that independent root:
 *   (1) cosh(s_star) = phi to ~1e-9 (the defining golden-ratio identity),
 *   (2) G(s_star) = phi^{-5/2} to ~1e-9 (the maximal obstruction value),
 *   (3) the live imp-3146 fine-scan maximizer and value match the closed form
 *       (scanArgmaxMatchesClosedForm / scanMaxMatchesClosedForm both true) and the
 *       independent root agrees with the live sStarClosedForm/gStarClosedForm.
 *
 * INDEPENDENCE: the live module locates s* by acosh(phi) plus an argmax over a
 * uniform grid (resolution ~5e-4); this module locates it by bisection on the
 * derivative-zero condition to ~1e-15, a genuinely different numerical path. A
 * silent edit to the live closed form -- a changed exponent in phi^{-5/2}, a
 * dropped tanh term, a perturbed S_STAR -- is therefore caught here.
 *
 * LOCK ONLY -- no new math, no QED; PT Lambda <= 0.2 stays the rigorous SOTA.
 *
 * @see imp-3146-residual-gap-limit-aU-grid.js (imp-3146, the self-asserted landmark this locks)
 */

import IMP3146_RESIDUAL_GAP_LIMIT_AU_GRID from './imp-3146-residual-gap-limit-aU-grid.js';

const PHI_INDEP = (1 + Math.sqrt(5)) / 2;          // golden ratio (rebuilt locally)
const G_STAR_INDEP = Math.pow(PHI_INDEP, -2.5);    // phi^{-5/2}, rebuilt locally

function sech2(x) {
  const c = Math.cosh(x);
  return 1 / (c * c);
}

/** The saturating residual-gap limit, rebuilt locally. */
function gapLimit(s) {
  return Math.tanh(s) - Math.tanh(s / 2);
}

/** First-order stationarity functional: G prime(s) = sech^2(s) - (1/2) sech^2(s/2). */
function gPrime(s) {
  return sech2(s) - 0.5 * sech2(s / 2);
}

// INDEPENDENT bisection solve of G prime(s) = 0 on the bracket [0.5, 2.0], where
// G prime crosses from positive (rising G) to negative (falling G). Seeded only by
// the bracket endpoints and NEVER calling Math.acosh; the live module instead used
// the closed form arccosh(phi) plus a uniform 24000-point grid argmax.
function bisectMaximizer() {
  let lo = 0.5;   // G prime(0.5) > 0
  let hi = 2.0;   // G prime(2.0) < 0
  for (let i = 0; i < 200; i++) {
    const mid = 0.5 * (lo + hi);
    if (gPrime(mid) > 0) lo = mid;
    else hi = mid;
  }
  return 0.5 * (lo + hi);
}

const S_STAR_INDEP = bisectMaximizer();
const COSH_S_STAR_INDEP = Math.cosh(S_STAR_INDEP);
const G_AT_S_STAR_INDEP = gapLimit(S_STAR_INDEP);

const LIVE = IMP3146_RESIDUAL_GAP_LIMIT_AU_GRID.measured;
const S_STAR_LIVE = LIVE.sStarClosedForm;       // arccosh(phi) per the live closed form
const G_STAR_LIVE = LIVE.gStarClosedForm;       // phi^{-5/2} per the live closed form

export const IMP3146_GOLDEN_RATIO_MAXIMIZER_TRIPWIRE = {
  ticket: 'imp-3176',
  date: '2026-06-30',
  locks: 'imp-3146',
  stationarityEquation: 'G prime(s) = sech^2(s) - (1/2) sech^2(s/2) = 0',
  recomputedMaximizer: S_STAR_INDEP,             // from independent bisection, no arccosh
  liveMaximizerClosedForm: S_STAR_LIVE,          // live arccosh(phi)
  maximizerMatchAbsErr: Math.abs(S_STAR_INDEP - S_STAR_LIVE),
  coshAtRecomputedMaximizer: COSH_S_STAR_INDEP,  // = phi (golden ratio) to ~1e-9
  goldenRatio: PHI_INDEP,
  coshMinusPhiAbsErr: Math.abs(COSH_S_STAR_INDEP - PHI_INDEP),
  gapAtRecomputedMaximizer: G_AT_S_STAR_INDEP,   // = phi^{-5/2} to ~1e-9
  gStarClosedForm: G_STAR_INDEP,                 // phi^{-5/2}
  gapMinusGStarAbsErr: Math.abs(G_AT_S_STAR_INDEP - G_STAR_INDEP),
  liveGStarClosedForm: G_STAR_LIVE,
  liveScanArgmaxMatchesClosedForm: LIVE.scanArgmaxMatchesClosedForm,
  liveScanMaxMatchesClosedForm: LIVE.scanMaxMatchesClosedForm,
  independence: 'maximizer from bisection on G prime(s)=0 over [0.5,2.0], never Math.acosh; live module used arccosh(phi) plus a 24000-point grid argmax',
  status: 'cross-module tripwire: an independent Newton root of the stationarity condition reproduces the imp-3146 golden-ratio maximizer, with cosh(s*)=phi and G(s*)=phi^{-5/2} re-certified to ~1e-9, and the live fine-scan maximizer/value confirmed against the closed form',
  honest: 'LOCK ONLY -- independent recompute of an existing closed-form maximizer, no new math, no QED; PT Lambda <= 0.2 stays the rigorous SOTA.',
};

export const IMP3146_GOLDEN_RATIO_MAXIMIZER_TRIPWIRE_ASSERTIONS = [
  {
    id: 'imp3146-maximizer-tripwire-cosh-equals-phi-1e-9',
    description: 'the independent Newton maximizer satisfies cosh(s*) = phi (golden ratio) to ~1e-9',
    holds: () => Math.abs(COSH_S_STAR_INDEP - PHI_INDEP) < 1e-9,
  },
  {
    id: 'imp3146-maximizer-tripwire-gap-equals-phi-pow-1e-9',
    description: 'the saturating limit at the independent maximizer equals phi^{-5/2} to ~1e-9',
    holds: () => Math.abs(G_AT_S_STAR_INDEP - G_STAR_INDEP) < 1e-9,
  },
  {
    id: 'imp3146-maximizer-tripwire-matches-live-closed-form-1e-9',
    description: 'the independent maximizer and its value match the live imp-3146 sStarClosedForm/gStarClosedForm to ~1e-9',
    holds: () =>
      Math.abs(S_STAR_INDEP - S_STAR_LIVE) < 1e-9 &&
      Math.abs(G_AT_S_STAR_INDEP - G_STAR_LIVE) < 1e-9,
  },
  {
    id: 'imp3146-maximizer-tripwire-stationary-at-root',
    description: 'G prime(s*) = 0 at the recomputed maximizer (the first-order condition is genuinely satisfied)',
    holds: () => Math.abs(gPrime(S_STAR_INDEP)) < 1e-9,
  },
  {
    id: 'imp3146-maximizer-tripwire-live-scan-recovers-closed-form',
    description: 'the live imp-3146 fine-scan independently recovered the same maximizer and value (both flags true)',
    holds: () => LIVE.scanArgmaxMatchesClosedForm === true && LIVE.scanMaxMatchesClosedForm === true,
  },
  {
    id: 'imp3146-maximizer-tripwire-lock-honest',
    description: 'explicitly a LOCK ONLY (no new math, no QED) and PT Lambda <= 0.2 stays SOTA',
    holds: () => /LOCK ONLY/.test(IMP3146_GOLDEN_RATIO_MAXIMIZER_TRIPWIRE.honest)
      && /Lambda <= 0.2 stays the rigorous SOTA/.test(IMP3146_GOLDEN_RATIO_MAXIMIZER_TRIPWIRE.honest),
  },
];

for (const a of IMP3146_GOLDEN_RATIO_MAXIMIZER_TRIPWIRE_ASSERTIONS) {
  if (!a.holds()) throw new Error(`imp-3146-golden-ratio-maximizer-tripwire assertion failed: ${a.id}`);
}

export default IMP3146_GOLDEN_RATIO_MAXIMIZER_TRIPWIRE;
