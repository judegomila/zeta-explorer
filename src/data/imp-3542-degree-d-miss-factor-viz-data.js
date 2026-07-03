/**
 * @module imp-3542-degree-d-miss-factor-viz-data
 * @fileoverview imp-3542 -- lightweight, import-light literal data for a
 *   visualization of the imp-3488/imp-3510/imp-3524 degree-d miss-factor
 *   family 1 - 1/k^(d+1) vs ladder index k.
 *
 *   imp-3488 derived the degree-2 (cosh, even) miss factor 1 - 1/k^3 and
 *   imp-3510 the degree-3 (sinh, odd) miss factor 1 - 1/k^4; imp-3524 unified
 *   both into a single closed-form law 1 - 1/k^(d+1) (exponent p = d,
 *   over-prediction k^(d+1)) and certified it against self-computed degree-2
 *   and degree-3 k-ladders on the imp-3469 base cells S3 (a=0.5, U=6) and
 *   S4 (a=0.4, U=10).
 *
 *   The miss-factor curves themselves are the trivial closed form
 *   1 - 1/k^(d+1) -- cheap to evaluate directly in the page for any d. Only
 *   the MEASURED points (which require the imp-3524 Simpson-quadrature
 *   autocorrelation pipeline) are baked here as literals, reproduced from a
 *   one-off evaluation of imp-3524-general-degree-d-miss-factor.js, so
 *   importing this module into a page costs nothing at load time.
 *
 *   @see imp-3488-degree2-miss-factor-closed-form.js (the d = 2 special case)
 *   @see imp-3510-degree3-miss-factor-closed-form.js (the d = 3 special case)
 *   @see imp-3524-general-degree-d-miss-factor.js (the unifying general-d derivation)
 *
 *   Ticket: imp-3542 (ux, medium). Presentation only, RH-equivalent; imp-3066
 *   untouched; NO QED.
 */

// Measured degree-2 (cosh) miss, k-ladder {2,3,4,6,8}, both imp-3469 base cells.
export const IMP3542_MEASURED_D2_S3 = Object.freeze([
  { k: 2, measuredMiss: 0.8750414314237965, derivedMiss: 0.875 },
  { k: 3, measuredMiss: 0.9629775116467615, derivedMiss: 0.962962962962963 },
  { k: 4, measuredMiss: 0.9843814732858827, derivedMiss: 0.984375 },
  { k: 6, measuredMiss: 0.9953723593971515, derivedMiss: 0.9953703703703703 },
  { k: 8, measuredMiss: 0.9980477246064976, derivedMiss: 0.998046875 },
]);

export const IMP3542_MEASURED_D2_S4 = Object.freeze([
  { k: 2, measuredMiss: 0.8750265166527237, derivedMiss: 0.875 },
  { k: 3, measuredMiss: 0.9629722744542187, derivedMiss: 0.962962962962963 },
  { k: 4, measuredMiss: 0.9843791430737526, derivedMiss: 0.984375 },
  { k: 6, measuredMiss: 0.9953716434048931, derivedMiss: 0.9953703703703703 },
  { k: 8, measuredMiss: 0.9980474187733982, derivedMiss: 0.998046875 },
]);

// Measured degree-3 (sinh) miss, k-ladder {2,3,4,6,8}, both imp-3469 base cells.
export const IMP3542_MEASURED_D3_S3 = Object.freeze([
  { k: 2, measuredMiss: 0.9375170772506106, derivedMiss: 0.9375 },
  { k: 3, measuredMiss: 0.9876583188063406, derivedMiss: 0.9876543209876543 },
  { k: 4, measuredMiss: 0.9960950840937001, derivedMiss: 0.99609375 },
  { k: 6, measuredMiss: 0.9992286683440613, derivedMiss: 0.9992283950617284 },
  { k: 8, measuredMiss: 0.9997559469238082, derivedMiss: 0.999755859375 },
]);

export const IMP3542_MEASURED_D3_S4 = Object.freeze([
  { k: 2, measuredMiss: 0.9375109295663402, derivedMiss: 0.9375 },
  { k: 3, measuredMiss: 0.9876568796551103, derivedMiss: 0.9876543209876543 },
  { k: 4, measuredMiss: 0.9960946038451296, derivedMiss: 0.99609375 },
  { k: 6, measuredMiss: 0.9992285699681563, derivedMiss: 0.9992283950617284 },
  { k: 8, measuredMiss: 0.9997559154081401, derivedMiss: 0.999755859375 },
]);

// Degrees plotted for the general-d closed-form family (curves only, no
// measurement -- 1 - 1/k^(d+1) is cheap to evaluate directly).
export const IMP3542_FAMILY_DEGREES = Object.freeze([1, 2, 3, 4, 5]);

export const IMP3542_K_MIN = 2;
export const IMP3542_K_MAX = 8;
