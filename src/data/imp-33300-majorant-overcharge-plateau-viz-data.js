/**
 * @module imp-33300-majorant-overcharge-plateau-viz-data
 * @fileoverview imp-33300 -- VIZ DATA ONLY. Bakes the imp-33273 per-plateau R_maj = genuine
 *   K_real + far-term majorant over-charge split (all 10 imp-3725 plateaus) plus the over-charge
 *   fraction f_oc per plateau, for a stacked-bar-with-overlay viz page. Values are baked as
 *   literals (toExponential(6) prints of imp-33273's computed fields), per
 *   [[storage_precision_assertion_tolerance]] -- this module does NOT re-import the imp-33273/
 *   imp-33269 live computation chain.
 *
 *   @see imp-33273-majorant-overcharge-decomposition.js (the measurement this bakes)
 *   @see imp-33269-all-plateaus-majorant-ratio-scan.js (source aggregates, 10 imp-3725 plateaus)
 *
 *   Ticket: imp-33300 (ux, low). Presentation of an already-established decomposition; adds no
 *   new Lambda bound. imp-3066 K_a>=0 UNTOUCHED. RH-EQUIVALENT. NO QED. Platt-Trudgian
 *   Lambda <= 0.2 remains the rigorous SOTA.
 */

// -- baked from imp-33273 (R_maj = genuineRMaj + overChargeRMaj, all 10 imp-3725 plateaus) --
export const IMP33300_PLATEAUS = Object.freeze([
  Object.freeze({ plateauIndex: 0, endN: 18859, rMaj: 3.948907e0, genuineRMaj: 1.045382e0, overChargeRMaj: 2.903525e0, overChargeFraction: 7.352730e-1 }),
  Object.freeze({ plateauIndex: 1, endN: 44555, rMaj: 2.341221e0, genuineRMaj: 7.982689e-1, overChargeRMaj: 1.542952e0, overChargeFraction: 6.590373e-1 }),
  Object.freeze({ plateauIndex: 2, endN: 73997, rMaj: 7.110917e0, genuineRMaj: 1.577120e0, overChargeRMaj: 5.533797e0, overChargeFraction: 7.782115e-1 }),
  Object.freeze({ plateauIndex: 3, endN: 82552, rMaj: 9.896026e0, genuineRMaj: 1.419159e0, overChargeRMaj: 8.476867e0, overChargeFraction: 8.565931e-1 }),
  Object.freeze({ plateauIndex: 4, endN: 87761, rMaj: 1.813396e0, genuineRMaj: 8.266155e-1, overChargeRMaj: 9.867805e-1, overChargeFraction: 5.441617e-1 }),
  Object.freeze({ plateauIndex: 5, endN: 95248, rMaj: 1.107981e1, genuineRMaj: 1.432387e0, overChargeRMaj: 9.647426e0, overChargeFraction: 8.707210e-1 }),
  Object.freeze({ plateauIndex: 6, endN: 354769, rMaj: 9.641983e0, genuineRMaj: 1.602254e0, overChargeRMaj: 8.039729e0, overChargeFraction: 8.338253e-1 }),
  Object.freeze({ plateauIndex: 7, endN: 415587, rMaj: 2.762958e0, genuineRMaj: 8.536230e-1, overChargeRMaj: 1.909335e0, overChargeFraction: 6.910475e-1 }),
  Object.freeze({ plateauIndex: 8, endN: 420891, rMaj: 4.227794e0, genuineRMaj: 8.757608e-1, overChargeRMaj: 3.352033e0, overChargeFraction: 7.928563e-1 }),
  Object.freeze({ plateauIndex: 9, endN: 1000000, rMaj: 6.820032e0, genuineRMaj: 1.043770e0, overChargeRMaj: 5.776262e0, overChargeFraction: 8.469552e-1 }),
]);

export const IMP33300_ENDPOINT_PLATEAU_INDEX = 9;
export const IMP33300_OC_FRACTION_RANGE = [5.441617e-1, 8.707210e-1]; // ~[54.4%, 87.1%]
export const IMP33300_GENUINE_RANGE = [7.982689e-1, 1.602254e0]; // ~[0.80, 1.60]

export default Object.freeze({
  id: 'imp-33300-majorant-overcharge-plateau-viz-data',
  ticket: 'imp-33300',
  source: 'imp-33273-majorant-overcharge-decomposition.js',
  plateaus: IMP33300_PLATEAUS,
  endpointPlateauIndex: IMP33300_ENDPOINT_PLATEAU_INDEX,
  overChargeFractionRange: IMP33300_OC_FRACTION_RANGE,
  genuineRange: IMP33300_GENUINE_RANGE,
});
