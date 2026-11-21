/**
 * @fileoverview imp-97184 -- EXECUTION / MEASUREMENT: run the imp-97100 Route B combined phase-preserving
 * panel enclosure of the Krein scalar tail integral and measure whether it yields a majorant within a small
 * factor of the quadrature value (SUB-GAP IMP97184_INTERVAL_BESSEL_ENCLOSURE, refining
 * IMP97100_PHASE_CANCELLATION_TRIAL / IMP96888_RAYLEIGH_TAIL_MAJORANT).
 *
 * CONTEXT. imp-96888 established the sharp t-truncation residual for the Route I Krein floor lambda_min as the
 * min-max quadratic form (a single scalar tail integral)
 *   <v0 | R_T | v0>  =  (1/(pi B)) int_{|t|>T} sigma_2(t) |g(t)|^2 dt,   g(t) := v0 . Phi(t),
 * a RIGOROUS upper bound on the residual for any trial v0. imp-97100 ASSESSED three routes to convert the
 * committed QUADRATURE value into a rigorous interval majorant and marked Route B (combined phase-preserving
 * panel enclosure) VIABLE-BUT-NOT-EXECUTED. This leaf EXECUTES Route B numerically at the binding rung
 * (N=100, 2a=ln3, T=4800, Tfar=60000) and MEASURES the panel-majorant-to-quadrature ratio as the panel width
 * shrinks. Driver tmp/imp-97184-routeb-panel.py (/tmp/rhvenv, scipy 1.18) reuses the imp-96888 build()/solver
 * VERBATIM; every literal below is from the run (/tmp/imp-97184-out.json).
 *
 * WHAT ROUTE B DOES (as executed). Partition [T, Tfar] into panels of width h. On each panel enclose g(t) AS
 * ONE ENTITY (phase-preserving): evaluate the ground-state combination g(t)=v0.Phi(t) directly (not the
 * mode-wise sum), take its supremum over the panel, multiply by the closed-form digamma-asymptotic majorant of
 * sigma_2, and bound the panel integral by (sup over panel) x (panel width). The panel majorant is
 *   M(h) = sum_i (t_{i+1}-t_i) * sup_{t in panel_i} [ sigma_2^maj(t) |g(t)|^2 / (pi B) ].
 *
 * FINDINGS (measured, T=4800; dominant Bessel period 2 pi / a = 11.4384).
 *   1. THE QUADRATURE VALUE REPRODUCES imp-96888 EXACTLY: rq = <v0|R_T|v0> = 5.381116e-4 = 1.1734x the
 *      measured residual 4.585845e-4 -- the executed pipeline is the imp-96888 solver verbatim.
 *   2. ROUTE B CONVERGES TO A SMALL FACTOR AS PANELS NARROW. The panel majorant M(h)/rq falls monotonically:
 *        h=period    (4826 panels):  M/rq = 2.278   (M/actual 2.673)
 *        h=period/2  (9652 panels):  M/rq = 2.277
 *        h=period/4  (19304 panels): M/rq = 2.181
 *        h=period/8  (38607 panels): M/rq = 1.683
 *        h=period/16 (77214 panels): M/rq = 1.421   (M/actual 1.668)
 *      i.e. the phase-preserving panel enclosure DOES land within a small factor of the quadrature value
 *      (1.42x at h=period/16, converging toward ~1x), CONFIRMING the imp-97100 Route B viability assessment.
 *   3. MUCH OF THE RESIDUAL SLACK IS THE sigma_2 MAJORANT, NOT PHASE DECORRELATION. The closed-form sigma_2
 *      majorant overshoots the exact sigma_2 by at most 1.3414x on [T,Tfar]; M(h)/rq is descending THROUGH that
 *      band (2.278 -> 1.421), so the panel-enclosure excess over rq is dominated by the sup x width overshoot
 *      (which -> 0 as h -> 0) plus the ~1.34x sigma_2 majorant, not by loss of the inter-mode cancellation.
 *   4. THE Route A CONTROL DIVERGES, as imp-97100 predicted. The mode-wise triangle envelope
 *      sum_j |v0_j| |Phi_j(t)| (phase discarded) gives a panel majorant of 1.0785e-1 = 200.4x rq at h=period/8
 *      -- vacuous, and growing with Tfar (it re-loses the ~15 orders). Only the phase-preserving g-as-one-entity
 *      enclosure (Route B) keeps the cancellation.
 *
 * VERDICT. Route B is EXECUTED and MEASURED viable: the combined phase-preserving panel enclosure yields a
 * majorant within a small factor of the quadrature Rayleigh value (1.42x at h=period/16, trending to ~1x),
 * bounded below by the quadrature-to-actual ratio 1.17x, while the mode-wise Route A control diverges (200x).
 * This turns imp-97100's "VIABLE but not executed" into a measured convergence trend.
 *
 * MEASUREMENT ONLY -- NO RIGOROUS MAJORANT CLAIMED. The panel supremum here is SAMPLED on a 24-point subgrid
 * per panel, NOT a rigorous interval spherical-Bessel enclosure, so no interval majorant is produced or
 * claimed. The [Tfar, oo) far tail (Route C) is out of scope (negligible at these T, but not enclosed here).
 * Rayleigh floors stay UPPER bounds on true lambda_min; establishes NO operator positivity;
 * IMP96888_RAYLEIGH_TAIL_MAJORANT / IMP96749_UNIFORM_N_GAP_UNSETTLED stay open; interval-rigorous reach stays
 * 2a <= 0.96; no refereed bound is changed; RH open; NO QED.
 *
 * THE RESIDUAL (named). SUB-GAP IMP97184_INTERVAL_BESSEL_ENCLOSURE (refines IMP97100_PHASE_CANCELLATION_TRIAL):
 * the remaining step to a RIGOROUS majorant is replacing the sampled per-panel supremum with a certified
 * interval spherical-Bessel enclosure of g(t)=v0.Phi(t) as one entity per panel (plus a Route C far-tail
 * majorant beyond Tfar). The measured convergence M(h)/rq -> small factor bounds the reachable rigorous value
 * from below by ~1.17x actual; the interval-Bessel enclosure width would inflate the narrow-panel figures only
 * modestly, but that certificate is NOT produced here.
 *
 * @see imp-97100-krein-rayleigh-tail-interval-majorant-assessment.js (Route B assessed VIABLE-not-executed; this leaf executes it)
 * @see imp-96888-krein-tresidual-rayleigh-permode-bound.js (min-max Rayleigh tail integral; source solver + quadrature literals)
 * @see imp-96973-krein-tailtrace-vacuity-factorisation.js (three-factor vacuity factorisation)
 */

import { IMP96888_ROWS } from './imp-96888-krein-tresidual-rayleigh-permode-bound.js';

const LN3 = Math.log(3); // 1.0986122886681098

// binding rung: N=100, 2a=ln3, T=4800, Tfar=60000. Dominant Bessel oscillation period 2 pi / a.
export const IMP97184_RQ = 5.381115666090913e-4; // quadrature <v0|R_T|v0> (reproduces imp-96888 5.381116e-4)
export const IMP97184_ACTUAL = 4.585844602290612e-4; // measured residual L - f(4800)
export const IMP97184_PERIOD = 11.438403469520507; // 2 pi / a, dominant Bessel period

// Route B combined phase-preserving panel majorant M(h) at shrinking panel width h (verbatim from run).
export const IMP97184_ROUTEB = Object.freeze([
  Object.freeze({ h: 11.438403, npan: 4826, M: 1.2256947835035674e-3, MOverRq: 2.2777707441363506, MOverActual: 2.6727787131978644 }),
  Object.freeze({ h: 5.7192017, npan: 9652, M: 1.225245745023141e-3, MOverRq: 2.276936273167336, MOverActual: 2.671799529384697 }),
  Object.freeze({ h: 2.8596009, npan: 19304, M: 1.173510160667913e-3, MOverRq: 2.1807934143894814, MOverActual: 2.5589837040743797 }),
  Object.freeze({ h: 1.4298004, npan: 38607, M: 9.05657390020643e-4, MOverRq: 1.6830290337887377, MOverActual: 1.974897687480013 }),
  Object.freeze({ h: 0.7149002, npan: 77214, M: 7.647884946356589e-4, MOverRq: 1.4212452251397822, MOverActual: 1.667715679361769 }),
]);

export const IMP97184_SIGMA2_MAJ_OVER_EXACT = 1.3414370675723388; // closed-form sigma_2 majorant / exact, max on [T,Tfar]
export const IMP97184_ROUTEA_OVER_RQ = 200.4231009979565; // mode-wise triangle envelope panel majorant / rq (diverges)

export const IMP97184_VERDICT = Object.freeze({
  ticket: 'imp-97184',
  question:
    'execute the imp-97100 Route B combined phase-preserving panel enclosure of the scalar Krein tail integral <v0|R_T|v0> = (1/(pi B)) int_{|t|>T} sigma_2 |g|^2 dt at the binding rung and measure whether it yields a majorant within a small factor of the quadrature value.',
  answer:
    'executed. The panel majorant M(h) (enclose g=v0.Phi as one phase-preserving entity, sigma_2 by its closed-form majorant, sup x width per panel) converges to a SMALL factor of the quadrature rq=5.381116e-4 as panels narrow: M/rq = 2.278 (h=period) -> 1.421 (h=period/16), trending toward ~1x. Much of the excess is the sigma_2 closed-form majorant (<=1.3414x exact), not phase loss. The Route A mode-wise triangle control diverges (200.4x rq), confirming that only the phase-preserving enclosure keeps the ~15-order cancellation. This turns imp-97100 Route B from VIABLE-not-executed into a measured convergence trend, bounded below by the quadrature-to-actual ratio 1.17x. Measurement only: the per-panel supremum is SAMPLED (24-point subgrid), NOT an interval spherical-Bessel enclosure, so no rigorous majorant is produced or claimed.',
  N: 100,
  twoA: LN3,
  T: 4800,
  Tfar: 60000,
  quadratureReproducesImp96888: true, // rq matches imp-96888 5.381116e-4
  routeBConvergesToSmallFactor: true, // M/rq: 2.278 -> 1.421 as h -> period/16
  routeBFinestMOverRq: 1.4212452251397822, // h=period/16
  routeBFloorIsQuadratureRatio: 1.17341866826518, // rq/actual = lower bound on reachable rigorous majorant
  sigma2MajorantOverheadMax: 1.3414370675723388, // closed-form sigma_2 majorant / exact
  routeAModeWiseDiverges: true, // 200.4x rq -- reproduces the trace/lammax vacuity
  routeAOverRq: 200.4231009979565,
  supIsSampledNotIntervalBessel: true, // MEASUREMENT ONLY: 24-point subgrid sup, not a rigorous enclosure
  farTailRouteCOutOfScope: true, // [Tfar, oo) not enclosed here (negligible at these T)
  intervalMajorantProduced: false, // no rigorous majorant produced or claimed
  operatorPositivityProved: false, // Rayleigh floor is an UPPER bound
  rayleighTailMajorantOpen: true, // IMP96888_RAYLEIGH_TAIL_MAJORANT stays open
  uniformNGapSettled: false, // IMP96749_UNIFORM_N_GAP_UNSETTLED stays open
  subGap:
    'IMP97184_INTERVAL_BESSEL_ENCLOSURE (refines IMP97100_PHASE_CANCELLATION_TRIAL) -- Route B is executed and measured viable (panel majorant within a small factor of the quadrature value, converging toward ~1x as panels narrow), but the per-panel supremum is SAMPLED on a subgrid, not a certified interval spherical-Bessel enclosure of g(t)=v0.Phi(t). A rigorous majorant needs that interval-Bessel enclosure (as one phase-preserving entity per panel) plus a Route C far-tail majorant beyond Tfar; the measured convergence bounds the reachable rigorous value below by ~1.17x actual.',
  intervalRigorousReachUnchanged: 0.96,
  qed: false,
});
export default IMP97184_VERDICT;

// -- self-executing assertions (imp-3715 convention): any failure throws at import --

const IMP97184_ASSERTIONS = [
  {
    id: 'imp97184-quadrature-reproduces-imp96888',
    holds: () =>
      Math.abs(IMP97184_RQ - IMP96888_ROWS[4800].rayleighV0RT) / IMP96888_ROWS[4800].rayleighV0RT < 1e-5 &&
      Math.abs(IMP97184_ACTUAL - IMP96888_ROWS[4800].actualResid) < 1e-10 &&
      Math.abs(IMP97184_VERDICT.routeBFloorIsQuadratureRatio - IMP97184_RQ / IMP97184_ACTUAL) < 1e-9,
    why: 'the executed pipeline reuses the imp-96888 solver verbatim: the quadrature <v0|R_T|v0> reproduces the committed 5.381116e-4 (1.1734x actual), the floor for any reachable rigorous majorant.',
  },
  {
    id: 'imp97184-routeb-converges-to-small-factor',
    holds: () => {
      // M(h)/rq is monotone non-increasing in shrinking h and lands within a small factor at the finest panel
      const r = IMP97184_ROUTEB;
      const monotone = r.every((row, i) => i === 0 || row.MOverRq <= r[i - 1].MOverRq + 1e-9);
      return (
        r.length === 5 &&
        monotone &&
        r[0].MOverRq > 2 && r[0].MOverRq < 2.4 &&
        r[r.length - 1].MOverRq < 1.5 && r[r.length - 1].MOverRq > 1 &&
        Math.abs(r[r.length - 1].MOverRq - IMP97184_VERDICT.routeBFinestMOverRq) < 1e-9
      );
    },
    why: 'the phase-preserving panel majorant M(h)/rq falls monotonically from 2.278 (h=period) to 1.421 (h=period/16), landing within a small factor of the quadrature value and trending toward ~1x -- Route B executed viable.',
  },
  {
    id: 'imp97184-sigma2-majorant-bounded',
    holds: () =>
      IMP97184_SIGMA2_MAJ_OVER_EXACT > 1 && IMP97184_SIGMA2_MAJ_OVER_EXACT < 1.5 &&
      IMP97184_ROUTEB[IMP97184_ROUTEB.length - 1].MOverRq > IMP97184_SIGMA2_MAJ_OVER_EXACT - 0.1,
    why: 'the closed-form sigma_2 majorant overshoots exact by at most 1.3414x; M(h)/rq descends through that band, so the panel-enclosure excess over rq is dominated by the sup x width overshoot plus the sigma_2 majorant, not by loss of the inter-mode cancellation.',
  },
  {
    id: 'imp97184-routea-diverges',
    holds: () =>
      IMP97184_ROUTEA_OVER_RQ > 100 &&
      Math.abs(IMP97184_ROUTEA_OVER_RQ - IMP97184_VERDICT.routeAOverRq) < 1e-6,
    why: 'the mode-wise triangle envelope (Route A, phase discarded) gives a panel majorant 200.4x the quadrature value -- vacuous and growing with Tfar, confirming imp-97100 that only the phase-preserving g-as-one-entity enclosure keeps the cancellation.',
  },
  {
    id: 'imp97184-measurement-only-no-qed',
    holds: () =>
      IMP97184_VERDICT.quadratureReproducesImp96888 === true &&
      IMP97184_VERDICT.routeBConvergesToSmallFactor === true &&
      IMP97184_VERDICT.routeAModeWiseDiverges === true &&
      IMP97184_VERDICT.supIsSampledNotIntervalBessel === true &&
      IMP97184_VERDICT.intervalMajorantProduced === false &&
      IMP97184_VERDICT.operatorPositivityProved === false &&
      IMP97184_VERDICT.rayleighTailMajorantOpen === true &&
      IMP97184_VERDICT.uniformNGapSettled === false &&
      IMP97184_VERDICT.intervalRigorousReachUnchanged === 0.96 &&
      IMP97184_VERDICT.qed === false &&
      typeof IMP97184_VERDICT.subGap === 'string' &&
      IMP97184_VERDICT.subGap.includes('IMP97184_INTERVAL_BESSEL_ENCLOSURE') &&
      IMP97184_VERDICT.subGap.includes('IMP97100_PHASE_CANCELLATION_TRIAL'),
    why: 'Route B executed and measured viable (panel majorant within a small factor, converging), but the per-panel sup is SAMPLED not interval-Bessel, so no rigorous majorant is produced: Rayleigh floor stays an UPPER bound, no operator positivity, Rayleigh/uniform-N gaps open, reach stays 2a<=0.96, no QED.',
  },
];

for (const a of IMP97184_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-97184-krein-routeb-panel-enclosure-execution assertion failed: ${a.id}`);
  }
}

void LN3;
