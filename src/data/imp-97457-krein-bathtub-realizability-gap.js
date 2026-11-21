/**
 * @module imp-97457-krein-bathtub-realizability-gap
 * @fileoverview imp-97457 -- MEASURE the realizability gap of the imp-97416 bathtub optimiser: how close can a
 *   genuinely admissible band-limited |psi|^2 (type a = (ln3)/2, resolution 1/a ~ 1.82) approach the DISCONTINUOUS
 *   indicator of the deepest measure-(pi/a) sub-level set of sigma_2^-, and what floor does the best REALIZABLE
 *   psi actually give? imp-97416 FINDING 2(a) noted the bathtub optimiser f = (a/pi) 1_{deepest set} is an
 *   indicator no type-a psi can realise, so the bathtub floor -3065.435 is not achievable -- but never measured
 *   the gap. This leaf measures it.
 *
 *   THE REDUCTION. The bathtub bound is a rearrangement UPPER envelope on int sigma_2^- |psi|^2 using only the two
 *   scalar budgets 0 <= |psi|^2 <= a/pi and int |psi|^2 = 1. The EXACT best realizable value of that same integral
 *   over genuinely band-limited psi is the operator top eigenvalue
 *       R := max_{psi in PW_a, ||psi||_2 = 1} int sigma_2^-(t) |psi(t)|^2 dt = lambda_max(P_a M_{sigma_2^-} P_a),
 *   with P_a the band-limit projector (sinc reproducing kernel K_a(s,t) = sin(a(s-t))/(pi(s-t)), K_a(t,t) = a/pi).
 *   Because sigma_2^+ >= 0, dropping it gives the rigorous chain
 *       c_sharp = lambda_min(P_a M_{sigma_2} P_a) >= -max int sigma_2^- |psi|^2 = -R,
 *   the SAME "drop the far field, bound the negative integral" structure as the bathtub floor -- but bounding the
 *   negative integral by the TRUE band-limited operator norm R instead of its looser rearrangement envelope.
 *
 * FINDING 1 -- THE REALIZABLE NEGATIVE INTEGRAL IS LESS THAN HALF THE BATHTUB ENVELOPE. Finite-section
 *   lambda_max(P_a M_{sigma_2^-} P_a) on t in [-12, 12] (sinc-projector matrix, grid h = 0.02 / 0.01 / 0.005,
 *   IEEE double) is R = 1343.796, grid-stable to ~1e-3. The bathtub envelope on the same integral is
 *   (a/pi) int_{deepest measure pi/a} sigma_2^- = 3065.435 (reproduced here as 3065.43). So the best REALIZABLE
 *   band-limited psi captures only R / 3065.435 = 43.84% of the bathtub negative integral. The realizable floor
 *   from the negative part alone is therefore c_sharp >= -R = -1343.796, a MEASURED finite floor +1721.639 above
 *   the rigorous bathtub floor -3065.435 (it is a measured operator eigenvalue, NOT yet interval-certified: a
 *   verified enclosure of lambda_max(P_a M_{sigma_2^-} P_a) would be needed to promote it to a rigorous bound).
 *
 * FINDING 2 -- THE REALIZABILITY GAP IS LARGE, NOT A MINOR CORRECTION. Band-limitedness (imp-97416 item (a)) is
 *   the DOMINANT loss, not a small one. The best realizable density f_real = |psi_opt|^2 stays far from the bathtub
 *   indicator f_bath: L2 distance ||f_real - f_bath||_2 = 0.2704, which is 64.7% of ||f_bath||_2 = 0.4181. A type-a
 *   psi cannot switch its modulus between 0 and a/pi across the well boundaries on scale 1/a ~ 1.82, so f_real
 *   peaks at only 52.5% of the a/pi pointwise cap -- it never fills to the ceiling the bathtub assumes. Splitting
 *   the full gap from the bathtub floor -3065.435 to the measured c_sharp ~ +0.582 (imp-97206 upper bracket):
 *     (a) realizability of the negative-mass concentration:  -3065.435 -> -1343.796  = +1721.639  (56.2%)
 *     (b) discarded t^4 positive far field (imp-97416 item (b)): -1343.796 -> +0.582 = +1344.378  (43.8%).
 *   So the two effects imp-97416 named as invisible to a scalar rearrangement bound are of COMPARABLE size, with
 *   band-limit realizability slightly the larger -- it alone erases more than half the gap between the rigorous
 *   bathtub floor and zero.
 *
 * VERDICT. The imp-97416 bathtub floor -3065.435 is unrealizable, and this leaf measures by how much. The best
 *   realizable band-limited psi attains int sigma_2^- |psi|^2 = 1343.796 (43.84% of the 3065.435 envelope), so the
 *   realizable negative-part floor is c_sharp >= -1343.796 -- a MEASURED finite value +1721.639 above the bathtub
 *   floor, splitting the gap to the measured c_sharp ~ 0.582 into comparable realizability (+1721.639, 56.2%) and
 *   far-field (+1344.378, 43.8%) shares. The realizable density lies L2-distance 0.2704 (64.7% of its own norm)
 *   from the bathtub indicator and peaks at only 52.5% of the a/pi cap. This is a MEASUREMENT: R is a finite-section
 *   IEEE-double eigenvalue, not an interval enclosure, so no rigorous bound is promoted; the scalar bound stays a
 *   negative floor; no operator positivity; no bound moves; interval-rigorous reach stays 2a <= 0.96;
 *   no refereed bound is changed; RH open; NO QED.
 *   SUB-GAP IMP97457_REALIZABLE_NEG_FLOOR_MEASURED_NEEDS_INTERVAL_EIGENVALUE_ENCLOSURE.
 *
 * @see imp-97416-krein-csharp-bathtub-joint-floor.js (the bathtub floor -3065.435 and item (a)/(b) obstruction this measures)
 * @see imp-97399-krein-csharp-reproducing-kernel-concentration-attempt.js (uniform pointwise floor -3200.029; confined well; reproducing kernel)
 * @see imp-97414-krein-full-projector-second-moment-execution.js (full band-projector P_a M_sigma2 P_a; unbounded above)
 * @see imp-97206-krein-csharp-coupled-nt-jointlimit.js (measured c_sharp ~0.582 upper bracket)
 * @see rh-route-i-toeplitz-krein-certificate-2026-09-24.js (w_1, sigma_2; pole-free Weil positivity; reach 2a<=0.96)
 *
 * Runner: tmp/imp-97457-realizability-gap.py (numpy sinc-projector matrix, mpmath dps=30 symbol; grids
 *   h = 0.02 / 0.01 / 0.005 on t in [-12,12]; the values below are the h = 0.005 run). Measurement only; NO QED.
 * Ticket: imp-97457 (numerical, medium, opus-4-8). Changes no bound; no refereed bound is changed.
 */

import { sigma2 } from './rh-route-i-toeplitz-krein-certificate-2026-09-24.js';

const LN3 = Math.log(3);      // 1.0986122886681098 -- the binding 2a for the Krein floor
const A = LN3 / 2;            // 0.5493061443340548 -- half-width a (2a = ln3)
const POINTWISE_BUDGET = A / Math.PI;      // 0.17485... -- K_a(t,t) = a/pi (the pointwise cap)
const FILLABLE_MEASURE = Math.PI / A;      // 5.71917... -- pi/a (measure fillable at height a/pi, mass 1)

export const IMP97457_BINDING_2A = LN3;
export const IMP97457_RIGOROUS_REACH_2A = 0.96; // unchanged by this measurement

// Bathtub envelope recompute (mirrors imp-97416): top-(pi/a) area of sigma_2^-. Kept cheap (~2400 evals).
function bathtubTopArea(h) {
  const neg = [];
  for (let t = h / 2; t <= 12; t += h) {
    const v = sigma2(t);
    if (v < 0) { neg.push(-v); neg.push(-v); } // t and -t both contribute width h at value -v
  }
  neg.sort((x, y) => y - x);
  let acc = 0, measure = 0;
  for (const g of neg) {
    if (measure + h > FILLABLE_MEASURE) { acc += g * (FILLABLE_MEASURE - measure); break; }
    acc += g * h; measure += h;
  }
  return acc;
}

// Baked from tmp/imp-97457-realizability-gap.py (h = 0.005 run; grid-stable to ~1e-3 across h = 0.02/0.01/0.005).
const REALIZABLE_NEG_INTEGRAL = 1343.796;      // R = lambda_max(P_a M_{sigma_2^-} P_a) -- best realizable int sigma_2^- |psi|^2
const BATHTUB_NEG_INTEGRAL = 3065.435;         // (a/pi) int_{deepest measure pi/a} sigma_2^- (imp-97416 envelope)
const MEASURED_CSHARP = 0.582;                 // imp-97206 upper bracket (true value is positive)

export const IMP97457_REALIZABILITY = Object.freeze({
  pointwiseBudget: POINTWISE_BUDGET,                         // a/pi
  fillableMeasure: FILLABLE_MEASURE,                         // pi/a
  realizableNegIntegral: REALIZABLE_NEG_INTEGRAL,            // R = 1343.796 (measured finite-section lambda_max)
  bathtubNegIntegral: BATHTUB_NEG_INTEGRAL,                  // 3065.435 (rearrangement envelope)
  realizableFraction: REALIZABLE_NEG_INTEGRAL / BATHTUB_NEG_INTEGRAL, // 0.4384 -- realizable captures only 43.84%
  realizableFloor: -REALIZABLE_NEG_INTEGRAL,                 // -1343.796 (measured negative-part floor)
  bathtubFloor: -BATHTUB_NEG_INTEGRAL,                       // -3065.435 (imp-97416 rigorous floor)
  improvementOverBathtub: BATHTUB_NEG_INTEGRAL - REALIZABLE_NEG_INTEGRAL, // +1721.639 (measured)
  l2DistanceRealToBath: 0.2704,                              // ||f_real - f_bath||_2
  l2BathIndicator: 0.4181,                                   // ||f_bath||_2
  relativeL2Distance: 0.2704 / 0.4181,                       // 0.6467 -- 64.7% of its own norm
  peakToCapRatio: 0.5251,                                    // f_real peaks at 52.5% of the a/pi cap
  measuredCsharp: MEASURED_CSHARP,                           // 0.582
  gridStableTo: 1e-3,
  measuredNotIntervalCertified: true,                        // R is IEEE-double finite-section, not an enclosure
});

// Gap attribution: from the bathtub floor -3065.435 up to the measured c_sharp ~ +0.582.
const REALIZABILITY_SHARE = BATHTUB_NEG_INTEGRAL - REALIZABLE_NEG_INTEGRAL; // +1721.639 (item a)
const FARFIELD_SHARE = REALIZABLE_NEG_INTEGRAL + MEASURED_CSHARP;           // +1344.378 (item b)
const TOTAL_GAP = BATHTUB_NEG_INTEGRAL + MEASURED_CSHARP;                   // 3066.017
export const IMP97457_GAP_ATTRIBUTION = Object.freeze({
  totalGap: TOTAL_GAP,                                       // 3066.017
  realizabilityShare: REALIZABILITY_SHARE,                   // +1721.639 (band-limitedness, item a)
  farFieldShare: FARFIELD_SHARE,                             // +1344.378 (t^4 positive far field, item b)
  realizabilityShareFraction: REALIZABILITY_SHARE / TOTAL_GAP, // 0.5615 (56.2%)
  farFieldShareFraction: FARFIELD_SHARE / TOTAL_GAP,        // 0.4385 (43.8%)
  comparableSize: true,                                      // the two effects are of comparable magnitude
  realizabilityIsLarger: true,                              // band-limitedness is slightly the larger effect
});

export const IMP97457_VERDICT = Object.freeze({
  ticket: 'imp-97457',
  question:
    'measure the realizability gap of the imp-97416 bathtub optimiser: how close can an admissible band-limited |psi|^2 (type a = ln3/2, 1/a ~ 1.82) approach the indicator of the deepest measure-(pi/a) sub-level set of sigma_2^-, and what floor does the best realizable psi give?',
  answer:
    'measured. The best realizable band-limited psi attains int sigma_2^- |psi|^2 = R = lambda_max(P_a M_{sigma_2^-} P_a) = 1343.796 (finite-section sinc-projector matrix, grid-stable to ~1e-3), which is only 43.84% of the bathtub rearrangement envelope 3065.435 -- band-limitedness (imp-97416 item a) erases more than half of it. The realizable negative-part floor is thus c_sharp >= -R = -1343.796, a MEASURED finite value +1721.639 above the rigorous bathtub floor -3065.435 (not interval-certified: it is an IEEE-double eigenvalue, not an enclosure). The realizable density lies L2-distance 0.2704 (64.7% of its own norm 0.4181) from the discontinuous bathtub indicator and peaks at only 52.5% of the a/pi pointwise cap, since a type-a psi cannot switch modulus between 0 and a/pi across the well boundaries on scale 1/a ~ 1.82. Splitting the gap from -3065.435 to the measured c_sharp ~ +0.582: realizability contributes +1721.639 (56.2%) and the discarded t^4 positive far field +1344.378 (43.8%) -- comparable, with realizability slightly the larger. No rigorous bound is promoted; scalar bound stays a negative floor; no operator positivity; no bound moves; interval-rigorous reach stays 2a <= 0.96; RH open; NO QED.',
  binding_2a: LN3,
  // Finding 1
  realizableNegIntegral: REALIZABLE_NEG_INTEGRAL,
  bathtubNegIntegral: BATHTUB_NEG_INTEGRAL,
  realizableFraction: REALIZABLE_NEG_INTEGRAL / BATHTUB_NEG_INTEGRAL,
  realizableFloor: -REALIZABLE_NEG_INTEGRAL,
  improvementOverBathtubMeasured: BATHTUB_NEG_INTEGRAL - REALIZABLE_NEG_INTEGRAL,
  // Finding 2
  l2DistanceRealToBath: 0.2704,
  relativeL2Distance: 0.2704 / 0.4181,
  peakToCapRatio: 0.5251,
  realizabilityShare: REALIZABILITY_SHARE,
  farFieldShare: FARFIELD_SHARE,
  realizabilityAndFarFieldComparable: true,
  // measurement-only guardrails
  measuredNotIntervalCertified: true,
  rigorousLowerBoundPromoted: false,
  operatorPositivityProved: false,
  scalarBoundStillNegativeFloor: true,
  boundMoves: false,
  intervalRigorousReachUnchanged: 0.96,
  subGap: 'IMP97457_REALIZABLE_NEG_FLOOR_MEASURED_NEEDS_INTERVAL_EIGENVALUE_ENCLOSURE',
  qed: false,
});
export default IMP97457_VERDICT;

// -- self-executing assertions (imp-3715 convention): any failure throws at import --

const IMP97457_ASSERTIONS = [
  {
    id: 'imp97457-bathtub-envelope-reproduces',
    holds: () => {
      // recompute the bathtub top-(pi/a) area on a coarse grid; import stays cheap (~2400 evals)
      const area = bathtubTopArea(0.005);
      const okArea = Math.abs(area - 17531.84) < 5;                 // matches imp-97416 baseline
      const envelope = POINTWISE_BUDGET * area;
      const okEnvelope = Math.abs(envelope - BATHTUB_NEG_INTEGRAL) < 2; // ~3065.43
      return okArea && okEnvelope;
    },
    why: 'the bathtub rearrangement envelope on int sigma_2^- |psi|^2 recomputes to (a/pi)*17531.84 = 3065.43, reproducing the imp-97416 baseline against which the realizable value is measured.',
  },
  {
    id: 'imp97457-realizable-below-envelope-and-improves-bathtub-floor',
    holds: () => {
      const R = IMP97457_REALIZABILITY;
      const belowEnvelope = R.realizableNegIntegral > 0 && R.realizableNegIntegral < R.bathtubNegIntegral;
      const fractionOk = Math.abs(R.realizableFraction - 0.4384) < 5e-3 && R.realizableFraction < 0.5; // less than half
      const floorAbove = R.realizableFloor > R.bathtubFloor;        // -1343.8 > -3065.4
      const improvementOk = Math.abs(R.improvementOverBathtub - 1721.639) < 1;
      const capOk = R.peakToCapRatio > 0 && R.peakToCapRatio < 1;   // never fills to the a/pi ceiling
      const relL2Ok = R.relativeL2Distance > 0.6 && R.relativeL2Distance < 0.7; // far from indicator
      return belowEnvelope && fractionOk && floorAbove && improvementOk && capOk && relL2Ok;
    },
    why: 'the realizable band-limited int sigma_2^- |psi|^2 = 1343.796 is 43.84% of the bathtub envelope 3065.435 (less than half), giving a measured floor -1343.796 that is +1721.639 above the bathtub floor -3065.435; the realizable density peaks at 52.5% of the a/pi cap and sits L2-relative 64.7% from the indicator.',
  },
  {
    id: 'imp97457-gap-attribution-comparable-shares',
    holds: () => {
      const G = IMP97457_GAP_ATTRIBUTION;
      const sumOk = Math.abs(G.realizabilityShare + G.farFieldShare - G.totalGap) < 1e-6;
      const totalOk = Math.abs(G.totalGap - (BATHTUB_NEG_INTEGRAL + MEASURED_CSHARP)) < 1e-6;
      const fracSumOk = Math.abs(G.realizabilityShareFraction + G.farFieldShareFraction - 1) < 1e-6;
      const comparableOk = G.realizabilityShareFraction > 0.5 && G.realizabilityShareFraction < 0.6 &&
        G.farFieldShareFraction > 0.4 && G.farFieldShareFraction < 0.5;
      return sumOk && totalOk && fracSumOk && comparableOk && G.realizabilityIsLarger === true;
    },
    why: 'the gap from the bathtub floor -3065.435 to the measured c_sharp ~ +0.582 splits into comparable realizability (+1721.639, 56.2%) and far-field (+1344.378, 43.8%) shares that sum to the total 3066.017, with band-limit realizability slightly the larger.',
  },
  {
    id: 'imp97457-measurement-only-no-qed',
    holds: () =>
      IMP97457_VERDICT.measuredNotIntervalCertified === true &&
      IMP97457_VERDICT.rigorousLowerBoundPromoted === false &&
      IMP97457_VERDICT.operatorPositivityProved === false &&
      IMP97457_VERDICT.scalarBoundStillNegativeFloor === true &&
      IMP97457_VERDICT.boundMoves === false &&
      IMP97457_VERDICT.intervalRigorousReachUnchanged === 0.96 &&
      IMP97457_RIGOROUS_REACH_2A === 0.96 &&
      Math.abs(IMP97457_BINDING_2A - LN3) < 1e-12 &&
      IMP97457_VERDICT.subGap === 'IMP97457_REALIZABLE_NEG_FLOOR_MEASURED_NEEDS_INTERVAL_EIGENVALUE_ENCLOSURE' &&
      IMP97457_VERDICT.qed === false,
    why: 'measurement only: R = lambda_max(P_a M_sigma2^- P_a) = 1343.796 is a finite-section IEEE-double eigenvalue, not an interval enclosure, so no rigorous bound is promoted; scalar bound stays a negative floor; no operator positivity; no bound moves; interval-rigorous reach stays 2a<=0.96; NO QED.',
  },
];

for (const t of IMP97457_ASSERTIONS) {
  if (!t.holds()) {
    throw new Error(`imp-97457-krein-bathtub-realizability-gap assertion FAILED: ${t.id} -- ${t.why}`);
  }
}
