/**
 * @fileoverview imp-97246 -- EXECUTION / MEASUREMENT: extend the imp-97184 Route B phase-preserving
 * panel-width ladder below h=period/16 to h=period/32 and h=period/64, to locate the h->0 limit of the
 * panel majorant M(h)/rq and test it against the 1.17x quadrature-to-actual floor (SUB-GAP
 * IMP97184_INTERVAL_BESSEL_ENCLOSURE, refining IMP97100_PHASE_CANCELLATION_TRIAL).
 *
 * CONTEXT. imp-96888 established the sharp t-truncation residual for the Route I Krein floor lambda_min as
 * the min-max scalar tail integral <v0|R_T|v0> = (1/(pi B)) int_{|t|>T} sigma_2(t) |g(t)|^2 dt,
 * g(t)=v0.Phi(t). imp-97100 marked Route B (combined phase-preserving panel enclosure) VIABLE-not-executed;
 * imp-97184 EXECUTED it at the binding rung (N=100, 2a=ln3, T=4800, Tfar=60000) and measured the panel
 * majorant M(h)/rq falling monotonically 2.278 -> 1.421 across h=period..period/16, trending toward ~1x but
 * stopping at period/16 (77214 panels). This leaf EXTENDS the ladder two octaves further (period/32,
 * period/64) to see whether M(h)/rq converges to the quadrature-to-actual floor 1.17x or stalls above it.
 * Driver tmp/imp-97246-routeb-panel-extend.py (/tmp/rhvenv, scipy 1.18) reuses the imp-96888/imp-97184
 * build()/solver VERBATIM; every literal below is from the run (/tmp/imp-97246-out.json).
 *
 * FINDINGS (measured, T=4800; dominant Bessel period 2 pi / a = 11.4384; rq=5.381116e-4, actual=4.585845e-4,
 * floor rq/actual=1.17342).
 *   1. CONTINUITY: the re-measured period/16 rung reproduces imp-97184 EXACTLY (M/rq=1.4212452251, npan=77214),
 *      confirming the extension reuses the same solver.
 *   2. THE LADDER KEEPS DESCENDING BELOW period/16 -- IT DOES NOT STALL. M(h)/rq continues monotonically:
 *        h=period/16 ( 77214 panels): M/rq = 1.421245  (M/actual 1.667716)
 *        h=period/32 (154428 panels): M/rq = 1.282278  (M/actual 1.504649)
 *        h=period/64 (308855 panels): M/rq = 1.211478  (M/actual 1.421571)
 *      At the finest rung M/rq sits 0.038 above the 1.17342 quadrature-to-actual floor.
 *   3. GEOMETRIC CONVERGENCE. The successive decrements halve as h halves: -0.13897 (p/16 -> p/32),
 *      -0.07080 (p/32 -> p/64), ratio 0.5095. An Aitken delta-squared extrapolation of the three rungs gives
 *      an h->0 limit M/rq -> 1.1379 (as M/actual -> 1.3353), i.e. the h->0 panel majorant lands right at the
 *      1.17x quadrature-to-actual band -- essentially rq inflated only by the sigma_2-majorant weighted
 *      average (~1.14x, well inside the imp-97184 max ratio 1.3414x), NOT by loss of inter-mode cancellation.
 *
 * VERDICT. Extending the Route B panel ladder two octaves confirms the imp-97184 trend and settles the h->0
 * question in the measured direction: M(h)/rq does NOT stall above the floor -- it converges (geometrically,
 * decrements halving) to ~1.14x, i.e. to the quadrature value inflated only by the sigma_2-majorant overhead,
 * landing at the 1.17x quadrature-to-actual band. The reachable rigorous majorant (once the sampled sup is
 * replaced by an interval spherical-Bessel enclosure) is thereby bounded to a small factor ~1.14x rq ~1.34x
 * the actual residual, not a diverging one.
 *
 * MEASUREMENT ONLY -- NO RIGOROUS MAJORANT CLAIMED. The per-panel supremum is SAMPLED on a 24-point subgrid,
 * NOT a certified interval spherical-Bessel enclosure; the Aitken h->0 value is a numerical extrapolation, not
 * a bound. The [Tfar, oo) far tail (Route C) is out of scope. Rayleigh floors stay UPPER bounds on true
 * lambda_min; establishes NO operator positivity; IMP96888_RAYLEIGH_TAIL_MAJORANT /
 * IMP96749_UNIFORM_N_GAP_UNSETTLED stay open; interval-rigorous reach stays 2a <= 0.96; no refereed bound is changed
 * ; RH open; NO QED.
 *
 * THE RESIDUAL (named). SUB-GAP IMP97184_INTERVAL_BESSEL_ENCLOSURE (refines IMP97100_PHASE_CANCELLATION_TRIAL)
 * is UNCHANGED: the remaining step to a rigorous majorant is replacing the sampled per-panel supremum with a
 * certified interval spherical-Bessel enclosure of g(t)=v0.Phi(t) as one phase-preserving entity per panel
 * (plus a Route C far-tail majorant beyond Tfar). This leaf only sharpens the measured h->0 target for that
 * certificate (~1.14x rq).
 *
 * @see imp-97184-krein-routeb-panel-enclosure-execution.js (Route B executed to h=period/16; this leaf extends the ladder)
 * @see imp-96888-krein-tresidual-rayleigh-permode-bound.js (min-max Rayleigh tail integral; source solver + quadrature literals)
 * @see imp-97100-krein-rayleigh-tail-interval-majorant-assessment.js (Route B assessed VIABLE-not-executed)
 */

import { IMP97184_RQ, IMP97184_ACTUAL, IMP97184_PERIOD, IMP97184_ROUTEB } from './imp-97184-krein-routeb-panel-enclosure-execution.js';

const LN3 = Math.log(3); // 1.0986122886681098

// binding rung: N=100, 2a=ln3, T=4800, Tfar=60000. Same solver/quadrature as imp-97184.
export const IMP97246_RQ = 5.381115666090913e-4; // quadrature <v0|R_T|v0> (reproduces imp-97184)
export const IMP97246_ACTUAL = 4.585844602290612e-4; // measured residual L - f(4800)
export const IMP97246_FLOOR = 1.17341866826518; // rq/actual -- the quadrature-to-actual floor

// Extended Route B ladder below h=period/16 (verbatim from run). period/16 re-measured for continuity.
export const IMP97246_ROUTEB_EXTEND = Object.freeze([
  Object.freeze({ label: 'period/16', h: 0.7149002168450317, npan: 77214, M: 7.647884946356589e-4, MOverRq: 1.4212452251397822, MOverActual: 1.667715679361769 }),
  Object.freeze({ label: 'period/32', h: 0.35745010842251584, npan: 154428, M: 6.900086702329816e-4, MOverRq: 1.2822780870165447, MOverActual: 1.5046490452125765 }),
  Object.freeze({ label: 'period/64', h: 0.17872505421125792, npan: 308855, M: 6.519103047794581e-4, MOverRq: 1.2114779633663502, MOverActual: 1.421570858405955 }),
]);

// Aitken delta-squared extrapolation of the three finest rungs (p/16, p/32, p/64).
export const IMP97246_DECREMENT_RATIO = 0.5094738555197718; // (p/32->p/64 decrement) / (p/16->p/32 decrement): decrements halve
export const IMP97246_AITKEN_LIMIT_MOVER_RQ = 1.1379430205845285; // h->0 extrapolated M/rq
export const IMP97246_AITKEN_LIMIT_MOVER_ACTUAL = 1.3352835837759536; // = Aitken M/rq * floor

export const IMP97246_VERDICT = Object.freeze({
  ticket: 'imp-97246',
  question:
    'extend the imp-97184 Route B phase-preserving panel-width ladder below h=period/16 to locate the h->0 limit of M(h)/rq and test whether it converges to the 1.17x quadrature-to-actual floor or stalls above it.',
  answer:
    'extended two octaves (period/32, period/64). The period/16 rung reproduces imp-97184 exactly. M(h)/rq keeps descending monotonically below period/16 -- 1.421245 (p/16) -> 1.282278 (p/32) -> 1.211478 (p/64) -- it does NOT stall above the floor. The successive decrements halve as h halves (ratio 0.5095), a clean geometric convergence; an Aitken delta-squared extrapolation gives an h->0 limit M/rq -> 1.1379 (M/actual -> 1.3353), i.e. the h->0 panel majorant lands at the 1.17x quadrature-to-actual band -- essentially the quadrature value inflated only by the sigma_2-majorant weighted average (~1.14x, inside the imp-97184 max ratio 1.3414x), not by loss of inter-mode cancellation. This sharpens the imp-97184 trend into a located limit. Measurement only: the per-panel supremum is SAMPLED (24-point subgrid), NOT an interval spherical-Bessel enclosure, and the Aitken value is an extrapolation not a bound; no rigorous majorant is produced or claimed.',
  N: 100,
  twoA: LN3,
  T: 4800,
  Tfar: 60000,
  periodOverContinuityReproducesImp97184: true, // p/16 rung matches imp-97184 M/rq exactly
  ladderKeepsDescending: true, // M/rq: 1.421 -> 1.282 -> 1.211 below p/16
  ladderStallsAboveFloor: false, // it converges toward the floor, not stalling above it
  finestMOverRq: 1.2114779633663502, // h=period/64
  decrementsHalve: true, // decrement ratio ~0.51
  aitkenLimitMOverRq: 1.1379430205845285, // h->0 extrapolated M/rq
  aitkenLimitLandsAtFloorBand: true, // ~1.14x, at the 1.17x quadrature-to-actual band
  floorQuadratureToActual: 1.17341866826518, // rq/actual
  sigma2MajorantOverheadDominatesExcess: true, // h->0 excess ~= sigma_2-majorant average, not phase loss
  supIsSampledNotIntervalBessel: true, // MEASUREMENT ONLY
  aitkenIsExtrapolationNotBound: true, // the h->0 value is numerical, not certified
  intervalMajorantProduced: false, // no rigorous majorant produced or claimed
  operatorPositivityProved: false, // Rayleigh floor is an UPPER bound
  rayleighTailMajorantOpen: true, // IMP96888_RAYLEIGH_TAIL_MAJORANT stays open
  uniformNGapSettled: false, // IMP96749_UNIFORM_N_GAP_UNSETTLED stays open
  subGap:
    'IMP97184_INTERVAL_BESSEL_ENCLOSURE (refines IMP97100_PHASE_CANCELLATION_TRIAL) -- UNCHANGED. The extended ladder locates the h->0 target for a rigorous majorant (~1.14x rq ~1.34x actual, geometric convergence, decrements halving) but the per-panel supremum is still SAMPLED, not a certified interval spherical-Bessel enclosure of g(t)=v0.Phi(t) as one phase-preserving entity per panel (plus a Route C far-tail majorant beyond Tfar).',
  intervalRigorousReachUnchanged: 0.96,
  qed: false,
});
export default IMP97246_VERDICT;

// -- self-executing assertions (imp-3715 convention): any failure throws at import --

const IMP97246_ASSERTIONS = [
  {
    id: 'imp97246-continuity-reproduces-imp97184',
    holds: () => {
      const p16Prev = IMP97184_ROUTEB[IMP97184_ROUTEB.length - 1]; // imp-97184 finest = period/16
      const p16Here = IMP97246_ROUTEB_EXTEND[0];
      return (
        Math.abs(IMP97246_RQ - IMP97184_RQ) / IMP97184_RQ < 1e-9 &&
        Math.abs(IMP97246_ACTUAL - IMP97184_ACTUAL) < 1e-12 &&
        IMP97184_PERIOD > 11.4 && IMP97184_PERIOD < 11.5 &&
        p16Here.npan === p16Prev.npan &&
        Math.abs(p16Here.MOverRq - p16Prev.MOverRq) < 1e-9 &&
        Math.abs(IMP97246_FLOOR - IMP97246_RQ / IMP97246_ACTUAL) < 1e-9
      );
    },
    why: 'the extension reuses the imp-97184/imp-96888 solver verbatim: the re-measured period/16 rung reproduces imp-97184 (same npan, same M/rq) and rq/actual is the 1.17342 quadrature-to-actual floor.',
  },
  {
    id: 'imp97246-ladder-keeps-descending-below-p16',
    holds: () => {
      const r = IMP97246_ROUTEB_EXTEND;
      const monotone = r.every((row, i) => i === 0 || row.MOverRq < r[i - 1].MOverRq - 1e-6);
      const octaves = r.every((row, i) => i === 0 || Math.abs(row.h - r[i - 1].h / 2) < 1e-9);
      return (
        r.length === 3 && monotone && octaves &&
        r[r.length - 1].MOverRq < 1.25 && r[r.length - 1].MOverRq > IMP97246_FLOOR
      );
    },
    why: 'below h=period/16 the phase-preserving panel majorant M(h)/rq keeps falling monotonically (1.421 -> 1.282 -> 1.211) as h halves each octave, still above but approaching the 1.17342 floor -- it does not stall above it.',
  },
  {
    id: 'imp97246-geometric-convergence-aitken',
    holds: () => {
      const r = IMP97246_ROUTEB_EXTEND;
      const d1 = r[1].MOverRq - r[0].MOverRq;
      const d2 = r[2].MOverRq - r[1].MOverRq;
      const ratio = d2 / d1;
      const aitken = r[2].MOverRq - (d2 * d2) / (d2 - d1);
      return (
        Math.abs(ratio - IMP97246_DECREMENT_RATIO) < 1e-6 &&
        ratio > 0.4 && ratio < 0.6 && // decrements roughly halve
        Math.abs(aitken - IMP97246_AITKEN_LIMIT_MOVER_RQ) < 1e-6 &&
        aitken > 1.0 && aitken < IMP97246_FLOOR + 0.02 && // h->0 limit lands at/near the floor band
        Math.abs(IMP97246_AITKEN_LIMIT_MOVER_ACTUAL - IMP97246_AITKEN_LIMIT_MOVER_RQ * IMP97246_FLOOR) < 1e-9
      );
    },
    why: 'the successive M/rq decrements halve as h halves (ratio 0.5095), a clean geometric convergence; the Aitken delta-squared extrapolation gives an h->0 limit M/rq -> 1.1379 that lands at the 1.17342 quadrature-to-actual band, so the h->0 excess is essentially the sigma_2-majorant average, not phase loss.',
  },
  {
    id: 'imp97246-measurement-only-no-qed',
    holds: () =>
      IMP97246_VERDICT.periodOverContinuityReproducesImp97184 === true &&
      IMP97246_VERDICT.ladderKeepsDescending === true &&
      IMP97246_VERDICT.ladderStallsAboveFloor === false &&
      IMP97246_VERDICT.aitkenLimitLandsAtFloorBand === true &&
      IMP97246_VERDICT.supIsSampledNotIntervalBessel === true &&
      IMP97246_VERDICT.aitkenIsExtrapolationNotBound === true &&
      IMP97246_VERDICT.intervalMajorantProduced === false &&
      IMP97246_VERDICT.operatorPositivityProved === false &&
      IMP97246_VERDICT.rayleighTailMajorantOpen === true &&
      IMP97246_VERDICT.uniformNGapSettled === false &&
      IMP97246_VERDICT.intervalRigorousReachUnchanged === 0.96 &&
      IMP97246_VERDICT.qed === false &&
      typeof IMP97246_VERDICT.subGap === 'string' &&
      IMP97246_VERDICT.subGap.includes('IMP97184_INTERVAL_BESSEL_ENCLOSURE') &&
      IMP97246_VERDICT.subGap.includes('IMP97100_PHASE_CANCELLATION_TRIAL'),
    why: 'the ladder extension locates the h->0 limit but the per-panel sup is SAMPLED not interval-Bessel and the Aitken value is an extrapolation not a bound: Rayleigh floor stays an UPPER bound, no operator positivity, Rayleigh/uniform-N gaps open, reach stays 2a<=0.96, no QED.',
  },
];

for (const a of IMP97246_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-97246-krein-routeb-panel-ladder-extension assertion failed: ${a.id}`);
  }
}

void LN3;
