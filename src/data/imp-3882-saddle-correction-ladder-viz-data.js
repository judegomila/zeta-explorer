/**
 * @module imp-3882-saddle-correction-ladder-viz-data
 * @fileoverview imp-3882 -- lightweight, import-light literal data for a visualization of the
 *   imp-3848 next-order saddle-correction term ladder C1, C2, C3 (n=10..80) that expands the
 *   imp-3735 reduced moment-ratio drift factor L_n = 1 + C1 + C2 + C3 + ..., alongside the
 *   dimensionless skewness f_ppp*sigma^3 and kurtosis f_pppp*sigma^4 that stay small (|.| < 0.2)
 *   and justify the perturbative expansion.
 *
 *   Values below are baked reference literals reproduced from a one-off evaluation of the
 *   imp-3848 buildMoments(T_A=8, NM=3200, MMAX=82, innerN=4800) moment ladder and its closed-form
 *   saddle derivatives; this module does NOT re-run that self-computing Simpson quadrature, so
 *   importing it into a page costs nothing at load time (the same baked-literal convention
 *   already used by imp-3881).
 *
 *   The truncated prediction 1 + C1 + C2 + C3 crosses 1 between n=17 and n=18 (interpolated
 *   n* ~ 17.1), far earlier than the imp-3735 measured L_n, which crosses 1 between n=48 and
 *   n=49 (interpolated n* ~ 48.6) -- confirming the imp-3848 finding that the single-next-order
 *   truncation is direction-confirming but overshoots quantitatively.
 *
 *   @see imp-3848-moment-ratio-drift-saddle-correction.js (the source measurement)
 *   @see imp-3735-moment-ratio-correction-tail.js (the measured L_n drift crossing 1 near n~48)
 *
 *   Ticket: imp-3882 (ux, low). Presentation only, RH-equivalent; imp-3066 untouched; NO QED.
 */

// n, C1/C2/C3 saddle-correction terms, the truncated prediction 1+C1+C2+C3, the imp-3735
// measured L_n, and the dimensionless skewness/kurtosis at the saddle (imp-3848 RUNGS, n=10..80).
export const IMP3882_RUNGS = Object.freeze([
  { n: 10, c1: 0.4001976043, c2: -0.0838814789, c3: 0.0096227390, driftPredicted: 1.3259388645, driftMeasured: 2.0640465278, skewness: 0.0877393369, kurtosis: -0.1677629577 },
  { n: 20, c1: -0.0621914295, c2: -0.0376130917, c3: 0.0000979693, driftPredicted: 0.9002934481, driftMeasured: 1.6715891452, skewness: -0.0088529903, kurtosis: -0.0752261835 },
  { n: 30, c1: -0.3481497732, c2: -0.0249734590, c3: 0.0018592748, driftPredicted: 0.6287360426, driftMeasured: 1.3847053654, skewness: -0.0385670828, kurtosis: -0.0499469179 },
  { n: 40, c1: -0.5568554610, c2: -0.0191170591, c3: 0.0033397332, driftPredicted: 0.4273672131, driftMeasured: 1.1599645301, skewness: -0.0516893273, kurtosis: -0.0382341181 },
  { n: 50, c1: -0.7217242197, c2: -0.0157097708, c3: 0.0042700705, driftPredicted: 0.2668360800, driftMeasured: 0.9758466323, skewness: -0.0584470396, kurtosis: -0.0314195417 },
  { n: 60, c1: -0.8582217803, c2: -0.0134603230, c3: 0.0048354882, driftPredicted: 0.1331533849, driftMeasured: 0.8202054846, skewness: -0.0621963871, kurtosis: -0.0269206459 },
  { n: 70, c1: -0.9748103980, c2: -0.0118518750, c3: 0.0051738780, driftPredicted: 0.0185116049, driftMeasured: 0.6855737932, skewness: -0.0643358560, kurtosis: -0.0237037500 },
  { n: 80, c1: -1.0766365239, c2: -0.0106371349, c3: 0.0053694408, driftPredicted: -0.0819042180, driftMeasured: 0.5670544890, skewness: -0.0655404658, kurtosis: -0.0212742698 },
]);

// interpolated zero crossings of (value - 1), from the imp-3848 fine integer-n scan
export const IMP3882_PREDICTED_CROSSING_N = 17.13; // 1+C1+C2+C3 crosses 1 between n=17, n=18
export const IMP3882_MEASURED_CROSSING_N = 48.58;  // measured L_n crosses 1 between n=48, n=49

export const IMP3882_SKEW_KURT_BOUND = 0.2; // dimensionless smallness bound asserted by imp-3848
