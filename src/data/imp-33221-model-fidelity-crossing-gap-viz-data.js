/**
 * @module imp-33221-model-fidelity-crossing-gap-viz-data
 * @fileoverview imp-33221 -- lightweight, import-light literal data for a
 *   visualization of the imp-3871/imp-3893 model-fidelity L_n = 1 crossing
 *   gap: even the EXACT resummation of the imp-3665 super-exponential
 *   surrogate integrand tau^n exp(-pi e^{4 tau}) crosses L_n = 1 at
 *   n ~ 18.4, while the measurement built from the real Phi-autocorrelation
 *   A(tau) crosses at n ~ 48.6 -- a ~30-unit gap that the imp-3871 C4/C5
 *   (fifth/sixth-derivative) saddle corrections are too small to close.
 *
 *   Values below are baked reference literals reproduced from a one-off
 *   evaluation of imp-3871-saddle-correction-fifth-sixth-derivative.js and
 *   imp-3893-model-fidelity-moment-discrepancy.js (their `measured` fields);
 *   this module does NOT re-run that self-computing quadrature machinery, so
 *   importing it into a page costs nothing at load time.
 *
 *   @see imp-3871-saddle-correction-fifth-sixth-derivative.js (source measurement: C4/C5, crossings)
 *   @see imp-3893-model-fidelity-moment-discrepancy.js (source measurement: moment tilt T_n)
 *
 *   Ticket: imp-33221 (ux, low). Presentation only, RH-equivalent; imp-3066
 *   untouched; NO QED.
 */

// Crossings of L_n = 1 across the four descriptions (imp-3871 measured field).
export const IMP33221_CROSSING_C123 = 17.12778940369757;       // imp-3848 truncation 1+C1+C2+C3
export const IMP33221_CROSSING_EXTENDED = 18.33572799977613;   // + C4 + C5
export const IMP33221_CROSSING_MODEL_EXACT = 18.380055989121608; // full resummation of the surrogate
export const IMP33221_CROSSING_MEASURED = 48.5843411675591;    // real A(tau) measurement
export const IMP33221_CROSSING_GAP = IMP33221_CROSSING_MEASURED - IMP33221_CROSSING_MODEL_EXACT; // ~30.2

// Rung table n = 10..80 (step 10): L_n under the four descriptions, plus the
// C4/C5 saddle corrections (imp-3871 measured.rungs).
export const IMP33221_RUNGS = Object.freeze([
  { n: 10, c4: 0.13074996808391948, c5: -0.016861923881631095, driftC123: 1.3259388644562622, driftExtended: 1.4398269086585507, driftModelExact: 1.3705467419564954, driftMeasured: 2.0640465277953792 },
  { n: 20, c4: 0.03975320698706448, c5: -0.0026377504735480115, driftC123: 0.9002934480827202, driftExtended: 0.9374089045962367, driftModelExact: 0.94440006112585, driftMeasured: 1.6715891451878742 },
  { n: 30, c4: 0.017306416029845915, c5: -0.0009348084774741861, driftC123: 0.6287360426442484, driftExtended: 0.6451076501966202, driftModelExact: 0.6672223179972642, driftMeasured: 1.3847053654246608 },
  { n: 40, c4: 0.008111811080333414, c5: -0.00046330433416288383, driftC123: 0.42736721310063824, driftExtended: 0.4350157198468088, driftModelExact: 0.4610425517564577, driftMeasured: 1.159964530077572 },
  { n: 50, c4: 0.0034147716337239037, c5: -0.0002753165835826965, driftC123: 0.26683607996579295, driftExtended: 0.26997553501593413, driftModelExact: 0.29669540262501115, driftMeasured: 0.9758466322755724 },
  { n: 60, c4: 0.0006989156542576335, c5: -0.00018307415799851415, driftC123: 0.13315338494558923, driftExtended: 0.13366922644184837, driftModelExact: 0.15996890584558815, driftMeasured: 0.8202054846246022 },
  { n: 70, c4: -0.000999343381305809, c5: -0.00013129890873747645, driftC123: 0.018511604944053475, driftExtended: 0.01738096265401019, driftModelExact: 0.04285620543616165, driftMeasured: 0.6855737932295748 },
  { n: 80, c4: -0.002118968544979746, c5: -0.0000993714994764502, driftC123: -0.0819042179643939, driftExtended: -0.08412255800885009, driftModelExact: -0.05960211958565669, driftMeasured: 0.5670544889600455 },
]);

// imp-3893 moment-ratio tilt T_n = Q_n^true/Q_n^model, sub-3% and shrinking (n = 10..80).
export const IMP33221_TILT_MAX = 1.0312736795323105; // n = 10
export const IMP33221_TILT_MIN = 1.0023227709628832; // n = 80
export const IMP33221_TILT_GRID = Object.freeze([
  { n: 10, tilt: 1.0312736795323105, offsetFractionOfGap: 0.9381945885676785 },
  { n: 20, tilt: 1.0144588470753924, offsetFractionOfGap: 0.9812223033030978 },
  { n: 30, tilt: 1.008733161968504, offsetFractionOfGap: 0.9918786087100284 },
  { n: 40, tilt: 1.005998238067925, offsetFractionOfGap: 0.9960432736834289 },
  { n: 50, tilt: 1.0044453376062148, offsetFractionOfGap: 0.9980580006730777 },
  { n: 60, tilt: 1.0034647037416276, offsetFractionOfGap: 0.9991605359587451 },
  { n: 70, tilt: 1.0027990134310514, offsetFractionOfGap: 0.9998133626697917 },
  { n: 80, tilt: 1.0023227709628832, offsetFractionOfGap: 1.0002209217468931 },
]);
