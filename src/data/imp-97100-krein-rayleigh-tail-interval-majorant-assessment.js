/**
 * @fileoverview imp-97100 -- ASSESSMENT: routes to convert the imp-96973/imp-96888 three-factor Krein rung
 * values (traceRT, lammaxRT, rayleighV0RT, actualResid) from QUADRATURE evaluations into rigorous interval
 * majorants, prototyping the tightest reachable majorant for the binding scalar and naming the residual
 * (SUB-GAP IMP96888_RAYLEIGH_TAIL_MAJORANT).
 *
 * CONTEXT. imp-96888 derived, and imp-96973 reconciled, that the sharp t-truncation residual bound for the
 * Route I Krein floor lambda_min(T_a[sigma_2]) is the min-max quadratic form
 *   <v0 | R_T | v0>  =  (1/(pi B)) int_{|t|>T} sigma_2(t) |v0 . Phih(t)|^2 dt,   with
 *   sigma_2(t) = (t^2 + 1/4)^2 w1(t),   w1(t) = 2 theta'(t) - sqrt(2) ln2 cos(t ln2),
 *   2 theta'(t) = Re psi(1/4 + i t/2) - ln pi,   Phih_j(t) = a^{2M+1} sum_k c_{jk} j_k(a t)  (M=3),
 * where j_k is the spherical Bessel function and v0 the A_T ground state. This is a rigorous UPPER bound on
 * the residual for ANY trial v0 (min-max), and it recovers ~15 orders vs. lambda_max(R_T) (Weyl) and
 * Tr(B^-1 R_T) (all modes). But every committed rung value remains a QUADRATURE evaluation, not a rigorous
 * interval majorant (sub-gap IMP96888_RAYLEIGH_TAIL_MAJORANT). This leaf ASSESSES the conversion routes and
 * prototypes the tightest reachable majorant, from the committed literals only (no new solver run).
 *
 * THE STRUCTURAL SPLIT. The integrand sigma_2(t) |g(t)|^2, g(t) := v0 . Phih(t), factorises into an EASY and
 * a HARD factor for interval arithmetic:
 *   (EASY) sigma_2(t): a rigorous monotone majorant exists in closed form. For t >= T the digamma asymptotic
 *     Re psi(1/4 + i t/2) = ln|1/4 + i t/2| + R_psi(t), |R_psi(t)| <= c/t^2 (rigorous Stirling remainder),
 *     with |1/4 + i t/2| <= (t + 1/2)/2, gives
 *       w1(t) <= ln((t + 1/2)/2) - ln pi + sqrt(2) ln2 + c/T^2,
 *       sigma_2(t) <= (t^2 + 1/4)^2 [ ln((t+1/2)/2) - ln pi + sqrt(2) ln2 + c/T^2 ]  (t >= T).
 *     The cosine and the digamma remainder are bounded by explicit constants; sigma_2 has NO delicate content.
 *   (HARD) |g(t)|^2: the smallness is NOT single-mode decay -- each Bessel mode j_k(a t) ~ 1/(a t) decays only
 *     like t^{-1}, so the trace diagonal sum_j |Phih_j(t)|^2 ~ N t^{-2} and sigma_2 * (that) ~ t^2 ln t
 *     DIVERGES. The convergence of the Rayleigh tail comes ENTIRELY from inter-mode phase cancellation in the
 *     specific ground-state combination g(t), which the trace disperses across all N modes.
 *
 * MEASURED CANCELLATION DEPTH (from the committed imp-96888 T-ladder, this leaf). The Rayleigh tail value
 * decays as <v0|R_T|v0> ~ T^{-p} with p measured from the three committed rungs (T in {4800,6400,9600}):
 *     p(4800->6400) = 2.947,  p(6400->9600) = 2.889,  p(4800->9600) = 2.913.
 * So the integrand decays like t^{-(p+1)} ~ t^{-3.91}; with sigma_2 ~ t^4 (up to the ln factor) this forces
 *   |g(t)| ~ t^{-(p+5)/2} ~ t^{-3.96} ~ t^{-4},
 * i.e. the ground-state combination decays ~3 orders faster (cancellation depth (p+5)/2 - 1 ~ 2.96 ~ 3) than
 * the individual modes (t^{-1}). Annihilating the leading t^{-1}, t^{-2}, t^{-3} Bessel asymptotic
 * coefficients is exactly the ~15-order recovery imp-96888/imp-96973 attribute to the spectral gap.
 *
 * ROUTE ASSESSMENT.
 *   ROUTE A (mode-wise triangle bound) -- REJECTED. Bounding |g(t)| <= sum_j |v0_j| |Phih_j(t)| enclosed
 *     mode-by-mode discards the phase cancellation: each |Phih_j| ~ t^{-1}, so |g|^2 ~ t^{-2} and
 *     sigma_2 |g|^2 ~ t^2 ln t DIVERGES. This re-loses all ~15 orders (reproduces the Tr/lammax vacuity).
 *     Any interval bound that splits the sum before squaring is vacuous.
 *   ROUTE B (combined phase-preserving panel enclosure) -- VIABLE, tightest reachable. Treat g(t) as ONE
 *     explicit finite sum of spherical Bessel functions with FIXED RATIONAL coefficients (v0 replaced by a
 *     fixed rational near-ground trial; min-max stays rigorous for any trial). On each finite tail panel
 *     [t_i, t_{i+1}] subset [T, Tfar] enclose g(t) as a single entity via interval spherical-Bessel
 *     enclosures (keeping phases), enclose sigma_2 via the EASY majorant above, and bound the panel integral
 *     by an interval Gauss rule with remainder. The enclosure width adds to, but does not destroy, the
 *     quadrature value.
 *   ROUTE C (analytic far tail [Tfar, oo)) -- VIABLE only with certified cancellation. |j_k(x)| <= 1/|x|
 *     gives a convergent far-tail majorant ONLY if g(t) is certified to decay like t^{-4}; the naive
 *     |g|^2 <= (sum |v0_j|/(a t))^2 diverges against sigma_2 (same failure as Route A). The far tail needs
 *     the same phase-preserving treatment, or a trial vector that explicitly annihilates the leading orders.
 *
 * TIGHTEST REACHABLE MAJORANT (prototype, from literals). At the binding rung (N=100, 2a=ln3, T=4800) the
 * quadrature Rayleigh value is 5.381116e-4 = 1.1734x the measured residual 4.585862e-4. A phase-preserving
 * interval majorant (Route B) cannot beat the quadrature value; it can only add enclosure slack on top. So
 * the tightest reachable rigorous majorant is bounded BELOW by ~1.17x actual (T=4800), rising to ~2.24x at
 * T=9600 (imp-96888 ladder); pushing T up trades a tighter core against a heavier tail-panel budget. The
 * floor is the quadrature-to-actual ratio; the achievable value is that floor plus the panel-remainder and
 * Bessel-enclosure widths, which are NOT computed here.
 *
 * THE RESIDUAL (named). SUB-GAP IMP97100_PHASE_CANCELLATION_TRIAL, a refinement of
 * IMP96888_RAYLEIGH_TAIL_MAJORANT: the missing object is a FIXED RATIONAL trial vector v0 whose combination
 * g(t) = v0 . Phih(t) carries a CERTIFIED asymptotic decay g(t) = O(t^{-4}) -- i.e. explicit annihilation of
 * the t^{-1}, t^{-2}, t^{-3} spherical-Bessel asymptotic coefficients -- so that the Route-B/Route-C interval
 * majorant is finite. sigma_2 is NOT the obstruction (its majorant is closed-form); the obstruction is
 * certifying, in interval arithmetic, the ~3-order phase cancellation that the numerical ground state
 * achieves automatically. Without that certificate, mode-wise interval bounds diverge (Route A) and the
 * conversion from quadrature to rigorous majorant does not close.
 *
 * ASSESSMENT ONLY. No solver run; the traceRT/lammaxRT/rayleighV0RT/actualResid values remain QUADRATURE
 * evaluations imported verbatim; no interval majorant is produced or claimed; Rayleigh floors stay UPPER
 * bounds on the true lambda_min; establishes NO operator positivity; changes NO bound;
 * IMP96888_RAYLEIGH_TAIL_MAJORANT and IMP96749_UNIFORM_N_GAP_UNSETTLED stay open; interval-rigorous reach
 * stays 2a <= 0.96; no refereed bound is changed; RH open; NO QED.
 *
 * @see imp-96888-krein-tresidual-rayleigh-permode-bound.js (min-max Rayleigh bound + T-ladder; source literals)
 * @see imp-96973-krein-tailtrace-vacuity-factorisation.js (three-factor vacuity factorisation; rung values)
 * @see imp-97002-krein-vacuity-factorisation-viz-data.js (PRESENTATION ONLY caveat this leaf assesses)
 */

import { IMP96888_ROWS, IMP96888_VERDICT } from './imp-96888-krein-tresidual-rayleigh-permode-bound.js';

const LN3 = Math.log(3); // 1.0986122886681098

// measured Rayleigh-tail decay exponent p in <v0|R_T|v0> ~ T^{-p}, from the committed imp-96888 T-ladder
// (N=100, 2a=ln3). Adjacent-pair and endpoint fits; derived here, not transcribed.
const T_LADDER = [4800, 6400, 9600];
function decayExponent(t1, t2) {
  return Math.log(IMP96888_ROWS[t1].rayleighV0RT / IMP96888_ROWS[t2].rayleighV0RT) / Math.log(t2 / t1);
}
export const IMP97100_TAIL_DECAY = Object.freeze({
  pLow: decayExponent(4800, 6400), // 2.9472
  pHigh: decayExponent(6400, 9600), // 2.8890
  pEndpoint: decayExponent(4800, 9600), // 2.9131
  // integrand ~ t^{-(p+1)}; sigma_2 ~ t^4 (up to ln) => |g(t)| ~ t^{-(p+5)/2}; modes ~ t^{-1}
  integrandExponent: decayExponent(4800, 9600) + 1, // ~3.913
  gDecayOrder: (decayExponent(4800, 9600) + 5) / 2, // ~3.957 (~t^-4)
  cancellationDepth: (decayExponent(4800, 9600) + 5) / 2 - 1, // ~2.957 (~3 orders vs single modes)
});

// route-by-route assessment of the quadrature -> interval-majorant conversion
export const IMP97100_ROUTES = Object.freeze([
  Object.freeze({
    route: 'A',
    name: 'mode-wise triangle bound',
    verdict: 'REJECTED',
    reason:
      'bounding |g| <= sum_j |v0_j| |Phih_j| enclosed mode-by-mode discards the inter-mode phase cancellation; each |Phih_j| ~ t^{-1} so sigma_2 |g|^2 ~ t^2 ln t DIVERGES, re-losing all ~15 orders (reproduces the Tr/lammax vacuity).',
  }),
  Object.freeze({
    route: 'B',
    name: 'combined phase-preserving panel enclosure',
    verdict: 'VIABLE',
    reason:
      'treat g(t) as ONE explicit finite Bessel sum with fixed rational coefficients (min-max keeps it rigorous for any trial); enclose g as a single entity per tail panel [t_i,t_{i+1}], sigma_2 via the closed-form digamma-asymptotic majorant, and integrate by an interval Gauss rule with remainder. Tightest reachable; enclosure width adds to but does not destroy the quadrature value.',
  }),
  Object.freeze({
    route: 'C',
    name: 'analytic far-tail [Tfar,oo) majorant',
    verdict: 'CONDITIONAL',
    reason:
      '|j_k(x)| <= 1/|x| yields a convergent far-tail majorant ONLY if g(t) is certified to decay like t^{-4}; the naive per-mode envelope diverges against sigma_2 (same failure as Route A). Needs the phase-preserving treatment or a trial that annihilates the leading orders.',
  }),
]);

export const IMP97100_VERDICT = Object.freeze({
  ticket: 'imp-97100',
  question:
    'assess the routes to replace the imp-96973/imp-96888 QUADRATURE Rayleigh-tail value <v0|R_T|v0> with a rigorous interval-arithmetic majorant on the committed rungs, prototype the tightest majorant reachable, and name the residual (IMP96888_RAYLEIGH_TAIL_MAJORANT).',
  answer:
    'the integrand sigma_2(t) |g(t)|^2 (g = v0.Phih) splits into an EASY factor and a HARD factor. sigma_2 = (t^2+1/4)^2 w1(t) has a closed-form rigorous majorant (digamma asymptotic Re psi(1/4+it/2) = ln|1/4+it/2| + R, |R| <= c/t^2, cosine bounded by sqrt(2) ln2) -- it is NOT the obstruction. The HARD factor is |g(t)|^2: the tail converges ONLY through inter-mode phase cancellation. Measured from the committed T-ladder, <v0|R_T|v0> ~ T^{-p} with p ~ 2.91, forcing |g(t)| ~ t^{-3.96} ~ t^{-4} while single modes decay only t^{-1} (cancellation depth ~3). Route A (mode-wise triangle) is REJECTED (diverges, re-loses ~15 orders); Route B (combined phase-preserving panel enclosure with a fixed rational trial) is the VIABLE tightest route; Route C (analytic far tail) is CONDITIONAL on a certified t^{-4} decay. The tightest reachable majorant is bounded below by the quadrature-to-actual ratio (1.17x at T=4800, up to 2.24x at T=9600) plus uncomputed enclosure slack. The residual is a FIXED RATIONAL trial vector with CERTIFIED g(t) = O(t^{-4}) decay -- explicit annihilation of the t^{-1},t^{-2},t^{-3} Bessel asymptotic coefficients (SUB-GAP IMP97100_PHASE_CANCELLATION_TRIAL).',
  bindingRung: 'N100-2a-ln3-T4800',
  twoA: LN3,
  N: 100,
  bindingT: 4800,
  sigma2MajorantIsClosedForm: true, // digamma asymptotic + bounded cosine: sigma_2 is NOT the obstruction
  obstructionIsPhaseCancellation: true, // the smallness lives entirely in |g|^2 inter-mode cancellation
  measuredTailDecayP: IMP97100_TAIL_DECAY.pEndpoint, // ~2.913
  requiredGDecayOrder: IMP97100_TAIL_DECAY.gDecayOrder, // ~3.957 (~t^-4)
  routeAModeWiseRejected: true, // mode-wise triangle bound diverges (reproduces trace vacuity)
  routeBPhasePreservingViable: true, // combined panel enclosure with fixed rational trial
  routeCFarTailConditional: true, // analytic far tail needs certified t^-4 decay
  tightestReachableFloorBinding: IMP96888_ROWS[4800].rayleighOverActual, // 1.1734x at T=4800
  tightestReachableFloorWorst: IMP96888_ROWS[9600].rayleighOverActual, // 2.2422x at T=9600
  quadratureNotIntervalMajorant: true, // values imported verbatim remain quadrature evaluations
  intervalMajorantProduced: false, // ASSESSMENT ONLY: no majorant computed or claimed
  operatorPositivityProved: false, // Rayleigh floor is an UPPER bound
  rayleighTailMajorantOpen: true, // IMP96888_RAYLEIGH_TAIL_MAJORANT stays open
  uniformNGapSettled: false, // IMP96749_UNIFORM_N_GAP_UNSETTLED stays open
  subGap:
    'IMP97100_PHASE_CANCELLATION_TRIAL (refines IMP96888_RAYLEIGH_TAIL_MAJORANT) -- the conversion from quadrature to a rigorous interval majorant needs a FIXED RATIONAL trial vector v0 whose combination g(t)=v0.Phih(t) carries a CERTIFIED decay g(t) = O(t^{-4}), i.e. explicit interval-arithmetic annihilation of the leading t^{-1},t^{-2},t^{-3} spherical-Bessel asymptotic coefficients. sigma_2 has a closed-form majorant and is not the obstruction; the ~3-order phase cancellation the numerical ground state achieves automatically is what a rigorous certificate must reproduce, else mode-wise interval bounds diverge (Route A) and the majorant is vacuous.',
  intervalRigorousReachUnchanged: 0.96,
  qed: false,
});
export default IMP97100_VERDICT;

// -- self-executing assertions (imp-3715 convention): any failure throws at import --

const IMP97100_ASSERTIONS = [
  {
    id: 'imp97100-tail-decay-near-cubic',
    holds: () =>
      T_LADDER.length === 3 &&
      IMP97100_TAIL_DECAY.pLow > 2.7 &&
      IMP97100_TAIL_DECAY.pLow < 3.1 &&
      IMP97100_TAIL_DECAY.pHigh > 2.7 &&
      IMP97100_TAIL_DECAY.pHigh < 3.1 &&
      Math.abs(IMP97100_TAIL_DECAY.pEndpoint - 2.9131) < 1e-3,
    why: 'the committed imp-96888 T-ladder gives a Rayleigh-tail decay <v0|R_T|v0> ~ T^{-p} with p ~ 2.89-2.95 (near-cubic) at every adjacent pair, the empirical input the majorant must reproduce.',
  },
  {
    id: 'imp97100-cancellation-depth-three',
    holds: () =>
      Math.abs(IMP97100_TAIL_DECAY.gDecayOrder - (IMP97100_TAIL_DECAY.pEndpoint + 5) / 2) < 1e-9 &&
      IMP97100_TAIL_DECAY.gDecayOrder > 3.8 &&
      IMP97100_TAIL_DECAY.gDecayOrder < 4.1 &&
      Math.abs(IMP97100_TAIL_DECAY.cancellationDepth - (IMP97100_TAIL_DECAY.gDecayOrder - 1)) < 1e-9 &&
      IMP97100_TAIL_DECAY.cancellationDepth > 2.8 &&
      IMP97100_TAIL_DECAY.cancellationDepth < 3.1,
    why: 'p ~ 2.91 with sigma_2 ~ t^4 forces the ground-state combination g(t) ~ t^{-3.96} ~ t^{-4}, i.e. ~3 orders of phase cancellation beyond the single-mode t^{-1} decay -- the object a rigorous trial must certify.',
  },
  {
    id: 'imp97100-mode-wise-route-rejected',
    holds: () => {
      const a = IMP97100_ROUTES.find((r) => r.route === 'A');
      const b = IMP97100_ROUTES.find((r) => r.route === 'B');
      return a && a.verdict === 'REJECTED' && b && b.verdict === 'VIABLE';
    },
    why: 'the mode-wise triangle bound (Route A) diverges against sigma_2 ~ t^4 ln t and re-loses the ~15 orders; only the combined phase-preserving enclosure (Route B) keeps the cancellation.',
  },
  {
    id: 'imp97100-floor-matches-imp96888',
    holds: () =>
      Math.abs(IMP97100_VERDICT.tightestReachableFloorBinding - IMP96888_ROWS[4800].rayleighOverActual) < 1e-12 &&
      IMP97100_VERDICT.tightestReachableFloorBinding > 1 &&
      IMP97100_VERDICT.tightestReachableFloorWorst >= IMP97100_VERDICT.tightestReachableFloorBinding &&
      IMP96888_VERDICT.rayleighValueIsQuadratureNotIntervalMajorant === true,
    why: 'the tightest reachable rigorous majorant is bounded below by the imp-96888 quadrature-to-actual ratio (1.17x at T=4800, up to 2.24x at T=9600); a phase-preserving interval bound can only add enclosure slack on top.',
  },
  {
    id: 'imp97100-assessment-only-no-qed',
    holds: () =>
      IMP97100_VERDICT.sigma2MajorantIsClosedForm === true &&
      IMP97100_VERDICT.obstructionIsPhaseCancellation === true &&
      IMP97100_VERDICT.routeAModeWiseRejected === true &&
      IMP97100_VERDICT.routeBPhasePreservingViable === true &&
      IMP97100_VERDICT.intervalMajorantProduced === false &&
      IMP97100_VERDICT.quadratureNotIntervalMajorant === true &&
      IMP97100_VERDICT.operatorPositivityProved === false &&
      IMP97100_VERDICT.rayleighTailMajorantOpen === true &&
      IMP97100_VERDICT.uniformNGapSettled === false &&
      IMP97100_VERDICT.intervalRigorousReachUnchanged === 0.96 &&
      IMP97100_VERDICT.qed === false &&
      typeof IMP97100_VERDICT.subGap === 'string' &&
      IMP97100_VERDICT.subGap.includes('IMP97100_PHASE_CANCELLATION_TRIAL') &&
      IMP97100_VERDICT.subGap.includes('IMP96888_RAYLEIGH_TAIL_MAJORANT'),
    why: 'assessment done (routes classified, cancellation depth measured, sigma_2 majorant closed-form, tightest floor pinned), but NO interval majorant is produced, values stay quadrature, no operator positivity, Rayleigh/uniform-N gaps open, reach stays 2a<=0.96, no QED.',
  },
];

for (const a of IMP97100_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-97100-krein-rayleigh-tail-interval-majorant-assessment assertion failed: ${a.id}`);
  }
}

void LN3;
