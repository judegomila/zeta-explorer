/**
 * @module imp-3543-xistar-robustness-viz-data
 * @fileoverview imp-3543 -- lightweight, import-light literal data for a
 *   visualization of the imp-3511 xi* range/grid robustness certification.
 *
 *   imp-3511 (never imported by any page -- pure offline assertion module)
 *   re-enumerated the P2(xi) = 0 stationary points of the PSD peak slope
 *   |P1(xi)| = |d/dxi |Phihat(xi)|^2| over a WIDER domain [0, 400] (3.3x the
 *   imp-3483 [0, 120]) and measured two things:
 *     (A) at the CO-REFINED grid (N = 1200, xi_Nyq = pi N/U ~ 628, comfortably
 *         above 400) there is EXACTLY ONE root, at xi* ~ 12.0685 -- the same
 *         global maximizer imp-3483 located, just resolved more finely;
 *     (B) at the COARSE imp-3483 grid (N = 360, xi_Nyq ~ 188.5) the SAME [0,
 *         400] scan manufactures THREE roots: the real peak near 12.087 plus
 *         a near-identical-|P1| SPURIOUS ALIASED PAIR at xi ~ 364.9 and
 *         xi ~ 389.1 -- both well past 2 * xi_Nyq ~ 377, exactly where the
 *         midpoint quadrature aliases high frequencies back into the band.
 *   It also partitioned (xi*, 400] into decade-ish bands and recorded the
 *   band-max of |P1|: at the co-refined grid this falls MONOTONICALLY to a
 *   far-tail max < 1% of the peak (~6.586e-5); at the coarse grid the same
 *   band-max SPIKES back up in the last band (aliased replica), breaking
 *   monotonicity -- the tail-bound argument only holds once sub-Nyquist.
 *
 *   Values below are baked reference literals reproduced from a one-off
 *   evaluation of imp-3511-xistar-uniqueness-wide-range-robustness.js (its
 *   `measured` field, plus the individual bisected root list which that
 *   module does not export); this file does NOT re-run that computation, so
 *   importing it into a page costs nothing at load time.
 *
 *   @see imp-3511-xistar-uniqueness-wide-range-robustness.js (the source measurement)
 *   @see imp-3483-Ttilde-peak-slope-xistar-global-uniqueness.js (single-domain uniqueness)
 *
 *   Ticket: imp-3543 (ux, medium). Presentation only, RH-equivalent; imp-3066
 *   untouched; NO QED.
 */

export const IMP3543_PEAK_SLOPE = 6.585601210176284e-5;
export const IMP3543_ONE_PERCENT_PEAK = IMP3543_PEAK_SLOPE * 0.01; // ~6.586e-7

export const IMP3543_XI_MAX = 400;

// Co-refined wide scan: N = 1200, xi_Nyq = pi*1200/6 ~ 628.3 (comfortably above 400).
export const IMP3543_REFINED = Object.freeze({
  N: 1200,
  xiNyq: 628.3185307179587,
  roots: [12.068529629243379], // EXACTLY ONE root -- the certified xi*
});

// Coarse imp-3483 grid re-run on the wider [0, 400] domain: N = 360, xi_Nyq ~ 188.5.
export const IMP3543_COARSE_ALIAS = Object.freeze({
  N: 360,
  xiNyq: 188.4955592153876,
  roots: [
    { xi: 12.08704387272693, absP1: 6.546394718863046e-5, label: 'real peak' },
    { xi: 364.90407455804825, absP1: 6.546394718863051e-5, label: 'aliased replica' },
    { xi: 389.07816230350215, absP1: 6.546394718863046e-5, label: 'aliased replica' },
  ],
});

// Decade-ish tail bands (xi*, 400], right edge labeled; band-max of |P1| in each.
export const IMP3543_TAIL_BAND_EDGES = Object.freeze([40, 80, 160, 320, 400]);

export const IMP3543_REFINED_TAIL_BANDMAX = Object.freeze([
  6.585601115857862e-5, // includes the peak itself (xi* ~ 12.07 sits in the first band)
  6.849767383098023e-6,
  7.952866453327134e-7,
  9.770766152595572e-8,
  1.178111065103656e-8, // far-tail max: ratio ~1.79e-4 of the peak, well under 1%
]);

export const IMP3543_COARSE_TAIL_BANDMAX = Object.freeze([
  6.546394341056143e-5,
  6.83921991932749e-6,
  7.8286204335019e-7,
  2.2379903944112215e-6,
  6.54639457285164e-5, // SPIKES back up to peak scale -- the aliased replica breaks monotonicity
]);
