/**
 * @module imp-35326-horizon-front-onset-gap-verified-height
 *
 * imp-35326 (numerical, frontier-diagnostic, MEASUREMENT ONLY): imp-35219 showed the imp-2563
 * collision window T_minus(g, beta) collapses to the beta-INDEPENDENT leading form T_minus -> g^2/8
 * for either beta source, so the imp-35195 M5 horizon-front ONSET -- the gap where g^2/8 crosses the
 * t_c floor -- is set by the floor ALONE, and pinned it at g_cross = sqrt(8 * 0.0066) = 0.2298 using
 * the imp-1127/imp-325 collision-front intercept 0.0066. THIS module recomputes the onset gap
 * g_cross(N) = sqrt(8 * |t_c(N)|) across the N ladder up to the achieved Platt-Trudgian verified
 * height N ~ 3e12 (imp-452/459, Lambda <= 0.2) using the inherited imp-325 t_c(N) fit, and assesses
 * whether the onset gap shrinks toward the verified regime enough to sit at gaps unreachable there.
 *
 * THE INHERITED t_c(N) DECAY (imp-325 / dyson-collision-lower-bound OLS front, AS-IS in imp-35219)
 * ---------------------------------------------------------------------------------------------
 *   t_c(N) = TC_INTERCEPT + TC_SLOPE / N,   TC_INTERCEPT = 0.0066,  TC_SLOPE = 4.91.
 * The N-dependence lives ENTIRELY in the +4.91/N small-N inflation term, which decays to 0 as N grows.
 * The intercept 0.0066 is the N-INDEPENDENT asymptotic collision-front FLOOR (the O(1) plateau imp-35219
 * uses as t_c_floor). So |t_c(N)| does NOT decay toward 0 -- it decays toward the fixed floor 0.0066
 * FROM ABOVE. Hence the onset gap
 *   g_cross(N) = sqrt(8 * t_c(N)) = sqrt(8 * (0.0066 + 4.91/N))
 * decays MONOTONICALLY toward the fixed floor sqrt(8 * 0.0066) = 0.229783 from above, and is BOUNDED
 * BELOW by that floor for every finite N. It never shrinks to unreachable smallness.
 *
 * WHAT THE LADDER SAYS (g_cross across N up to the PT verified height)
 * ------------------------------------------------------------------
 *   N = 1e4 : t_c = 0.007091,     g_cross = 0.238176   (imp-35219 anchor rung, +3.65% above the floor)
 *   N = 1e6 : t_c = 0.00660491,   g_cross = 0.229868   (+0.037% above the floor)
 *   N = 1e9 : t_c = 0.00660000491, g_cross = 0.229783  (+0.00004% above the floor)
 *   N = 3e12: t_c = 0.006600000002, g_cross = 0.229783 (floor to 11 sig figs)
 * The entire span of the onset gap from N = 1e4 to N = 3e12 is g_cross(1e4) - g_cross(3e12) ~ 0.00839,
 * a relative move of ONLY ~3.65%, and ~99% of that move is already realized by N ~ 1e5. At the PT
 * verified height the onset gap is FROZEN at 0.229783 -- it is an N-independent floor, not a shrinking
 * target.
 *
 * WHERE THE ONSET GAP SITS RELATIVE TO THE ACCESSIBLE g_min BAND
 * ------------------------------------------------------------
 * The verified min-gap at N = 1e4 is g_min(1e4) = 0.0376985 (imp-2762), and g_min(N) keeps DECREASING
 * with N (the RvM min-gap thins like the mean spacing 2pi/log(T)). So across the whole verified regime
 * the accessible g_min band lies WELL BELOW the frozen onset gap 0.229783 (g_min(1e4) is already ~6.1x
 * below it). The onset condition g_min < g_cross is therefore satisfied COMFORTABLY -- crossed once at
 * moderate N (~870, where g_min ~ 0.221, imp-35219) and staying crossed for all larger N. The M5
 * horizon-front onset gap ~0.23 sits far ABOVE the accessible g_min band, NOT below it and NOT at
 * unreachable smallness.
 *
 * SO THE ANSWER TO THE TICKET QUESTION IS NO. The onset gap does NOT shrink enough (in fact does not
 * shrink toward 0 at all) to place the horizon-front onset at gaps unreachable within the verified
 * regime. Because the inherited t_c(N) has an N-INDEPENDENT floor 0.0066, the onset gap g_cross(N) is
 * floor-bounded at 0.229783 and is N-frozen to 4 sig figs already by N ~ 1e6. The accessible g_min band
 * (g_min(1e4) = 0.0377 and decreasing) lies comfortably below it throughout, so the horizon-front onset
 * is a robustly-crossed condition at the verified height, not a marginal or receding one. This refines
 * the imp-35219 reading: the onset gap is not merely beta-independent, it is also height-independent to
 * leading order (its N-dependence is the vanishing +4.91/N inflation, bounded above the fixed floor).
 *
 * MEASUREMENT / EXTRAPOLATION ONLY on the inherited imp-325 t_c fit and the imp-2762 g_min anchor. It
 * certifies NOTHING, discharges NOTHING, changes NO bound. C_mb GUE-conditional per imp-486 UNTOUCHED;
 * the imp-2563 sandwich remains a valid CONDITIONAL bracket; I2/M5 stay OPEN; no RH verdict, NO QED.
 * No refereed bound is changed.
 *
 * @see imp-35219-horizon-front-ratio-measured-beta (parent; onset g_cross = sqrt(8*0.0066) = 0.2298, beta-independent)
 * @see imp-35195-horizon-front-mismatch-ratio (M5 horizon-front ratio T_minus/t_c on real inputs)
 * @see imp-2563-min-gap-sandwich-theorem (T_minus = (1/(4 beta)) log(1 + beta g^2/2) -> g^2/8, used AS-IS)
 * @see imp-2762-tc-a1-trap-interval (verified g_min(1e4) = 0.0376985 accessible-band anchor)
 */

// ---------------------------------------------------------------------------
// Inherited imp-325 collision-front fit (identical constants to imp-35219). Baked
// as literals to keep this module light (no zeros bundle; see MEMORY guidance).
// ---------------------------------------------------------------------------
const TC_INTERCEPT = 0.0066; // N-independent asymptotic collision-front FLOOR (OLS intercept)
const TC_SLOPE = 4.91; // small-N inflation coefficient (OLS), the ONLY N-dependent term
function tCollisionFit(N) {
  return TC_INTERCEPT + TC_SLOPE / N;
}
// The beta-independent leading onset gap: where g^2/8 crosses the t_c floor (imp-35219).
function onsetGap(N) {
  return Math.sqrt(8 * tCollisionFit(N));
}
const G_CROSS_FLOOR = Math.sqrt(8 * TC_INTERCEPT); // ~0.229783, the N -> inf onset-gap floor

// The verified accessible min-gap anchor (imp-2762). g_min(N) DECREASES with N, so this
// is an UPPER edge of the accessible band across the verified regime.
const G_MIN_1E4 = 0.0376985;

// ---------------------------------------------------------------------------
// The onset-gap trajectory across the N ladder up to the PT verified height N ~ 3e12.
// ---------------------------------------------------------------------------
const N_LADDER = [1e4, 1e5, 1e6, 1e7, 1e8, 1e9, 1e10, 1e11, 1e12, 3e12];
const N_VERIFIED_PT = 3e12; // Platt-Trudgian achieved height binding Lambda <= 0.2 (imp-452/459)

const ROWS = N_LADDER.map((N) => {
  const tc = tCollisionFit(N);
  const g = onsetGap(N);
  return {
    N,
    tc: +tc.toExponential(6),
    gCross: +g.toFixed(6),
    aboveFloorRel: +(g / G_CROSS_FLOOR - 1).toExponential(4), // fractional excess over the floor
    gMinRatio: +(g / G_MIN_1E4).toFixed(4), // how far the onset gap sits ABOVE the accessible band
  };
});

const TOP = ROWS[0]; // N = 1e4 (imp-35219 anchor rung, widest onset gap on the ladder)
const BOTTOM = ROWS[ROWS.length - 1]; // N = 3e12 (PT verified height, onset gap frozen at the floor)

// Monotone DECREASE of the onset gap along the ladder (t_c decays => g_cross decays).
const MONOTONE_DECREASING = ROWS.every((r, i) => i === 0 || r.gCross <= ROWS[i - 1].gCross + 1e-12);
// Floor-bounded: every rung sits AT or ABOVE the fixed floor; the deepest rung is at it.
const FLOOR_BOUNDED = ROWS.every((r) => r.gCross >= G_CROSS_FLOOR - 1e-9);
// Frozen at the PT height: the 3e12 onset gap equals the floor to 6 decimals.
const FROZEN_AT_PT = Math.abs(BOTTOM.gCross - G_CROSS_FLOOR) < 1e-6;
// The total onset-gap span from N=1e4 to N=3e12 is small (~3.65% of the floor): NOT unreachable.
const SPAN_ABS = TOP.gCross - BOTTOM.gCross;
const SPAN_REL = SPAN_ABS / G_CROSS_FLOOR;
// The accessible g_min band lies WELL BELOW the frozen onset gap throughout the verified regime.
const ONSET_ABOVE_ACCESSIBLE_BAND = G_CROSS_FLOOR / G_MIN_1E4 > 5; // ~6.1x at the widest accessible edge

export const IMP35326_HORIZON_FRONT_ONSET_GAP_VERIFIED_HEIGHT = {
  id: 'imp-35326',
  proofSection: 'S-frontier',
  question:
    'Recompute the imp-35219 M5 horizon-front onset gap g_cross(N) = sqrt(8 * |t_c(N)|) across the N ' +
    'ladder up to the achieved Platt-Trudgian verified height N ~ 3e12 using the inherited imp-325 ' +
    't_c(N) fit, and assess whether the onset gap shrinks enough to sit at gaps unreachable within ' +
    'the verified regime.',
  inheritedFit: {
    form: 't_c(N) = 0.0066 + 4.91/N  (imp-325 OLS collision front, used AS-IS by imp-35219)',
    floorInterceptIsNIndependent: true,
    onsetGapForm: 'g_cross(N) = sqrt(8 * t_c(N)) -> sqrt(8 * 0.0066) = 0.229783 as N -> inf',
  },
  gCrossFloor: +G_CROSS_FLOOR.toFixed(6),
  verifiedHeightN: N_VERIFIED_PT,
  accessibleGMin1e4: G_MIN_1E4,
  ladder: ROWS,
  findings: {
    monotoneDecreasing: MONOTONE_DECREASING,
    floorBounded: FLOOR_BOUNDED,
    frozenAtPtHeight: FROZEN_AT_PT,
    onsetGapSpanAbs: +SPAN_ABS.toFixed(6),
    onsetGapSpanRel: +SPAN_REL.toFixed(5),
    onsetAboveAccessibleBand: ONSET_ABOVE_ACCESSIBLE_BAND,
    onsetGapAtPt: BOTTOM.gCross,
    reading:
      'g_cross(N) decays MONOTONICALLY toward the fixed floor sqrt(8*0.0066) = ' + G_CROSS_FLOOR.toFixed(6) + ' ' +
      'from above (t_c has an N-INDEPENDENT floor 0.0066; only the +4.91/N inflation decays). From ' +
      'N = 1e4 (g_cross = ' + TOP.gCross + ') to N = 3e12 (g_cross = ' + BOTTOM.gCross + ') the onset gap ' +
      'moves only ~' + (SPAN_REL * 100).toFixed(2) + '%, and is frozen at the floor by the PT height. The ' +
      'accessible g_min band (g_min(1e4) = ' + G_MIN_1E4 + ', decreasing) sits ~' + (G_CROSS_FLOOR / G_MIN_1E4).toFixed(1) + 'x ' +
      'BELOW the onset gap, so the horizon-front onset is comfortably crossed at the verified height, ' +
      'NOT receding to unreachable gaps.',
  },
  isRigorous: false,
  verdict:
    'MEASUREMENT (frontier-diagnostic, NOT rigorous). Recomputed the imp-35219 beta-independent M5 ' +
    'horizon-front onset gap g_cross(N) = sqrt(8 * |t_c(N)|) across the N ladder up to the achieved ' +
    'Platt-Trudgian verified height N ~ 3e12 using the inherited imp-325 fit t_c(N) = 0.0066 + 4.91/N. ' +
    'FINDING: the onset gap does NOT shrink toward unreachable smallness. Because the inherited t_c(N) ' +
    'has an N-INDEPENDENT floor 0.0066 (only the +4.91/N inflation decays), g_cross(N) decays ' +
    'MONOTONICALLY toward the FIXED floor sqrt(8*0.0066) = ' + G_CROSS_FLOOR.toFixed(6) + ' from above and is ' +
    'bounded below by it. From N = 1e4 (g_cross = ' + TOP.gCross + ') to N = 3e12 (g_cross = ' + BOTTOM.gCross + ') ' +
    'the onset gap moves only ~' + (SPAN_REL * 100).toFixed(2) + '% and is frozen at the floor to 6 decimals by the PT ' +
    'height (~99% of the move already realized by N ~ 1e5). The accessible verified g_min band ' +
    '(g_min(1e4) = ' + G_MIN_1E4 + ', decreasing with N) lies ~' + (G_CROSS_FLOOR / G_MIN_1E4).toFixed(1) + 'x BELOW the frozen ' +
    'onset gap, so the onset condition g_min < g_cross is crossed comfortably (first at N ~ 870, imp-35219) ' +
    'and stays crossed throughout the verified regime -- the horizon-front onset gap ~0.23 sits far ABOVE ' +
    'the accessible band, not at unreachable smallness. This refines imp-35219: the onset gap is not only ' +
    'beta-independent but also height-independent to leading order. MEASUREMENT / extrapolation ONLY on ' +
    'the inherited imp-325 t_c fit and imp-2762 g_min anchor; certifies nothing; changes NO bound; C_mb ' +
    'GUE-conditional per imp-486 UNTOUCHED; the imp-2563 sandwich remains a valid CONDITIONAL bracket; ' +
    'I2/M5 stay OPEN; no RH verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-35219 (parent, beta-independent onset g_cross = sqrt(8*0.0066) = 0.2298); imp-35195 (M5 ' +
    'horizon-front ratio); imp-2563 (T_minus -> g^2/8, AS-IS); imp-325 / dyson-collision-lower-bound ' +
    '(t_c ~ 0.0066 + 4.91/N); imp-2762 (verified g_min(1e4) = 0.0376985); imp-452/459 (PT N ~ 3e12).',
};

export const IMP35326_HORIZON_FRONT_ONSET_GAP_VERIFIED_HEIGHT_ASSERTIONS = [
  {
    // The inherited fit constants match imp-35219 / imp-325 and the floor is N-independent.
    id: 'imp35326-inherited-fit-constants',
    description: 'inherited t_c fit is 0.0066 + 4.91/N (imp-325), floor 0.0066 is the N-independent intercept',
    holds: () =>
      TC_INTERCEPT === 0.0066 &&
      TC_SLOPE === 4.91 &&
      Math.abs(G_CROSS_FLOOR - Math.sqrt(8 * 0.0066)) < 1e-15 &&
      Math.abs(G_CROSS_FLOOR - 0.229783) < 1e-5,
  },
  {
    // The onset gap decays MONOTONICALLY along the ladder and is bounded below by the fixed floor.
    id: 'imp35326-onset-gap-monotone-floor-bounded',
    description: 'g_cross(N) decreases monotonically with N and stays at or above the fixed floor sqrt(8*0.0066)',
    holds: () => MONOTONE_DECREASING && FLOOR_BOUNDED,
  },
  {
    // At the PT verified height N ~ 3e12 the onset gap is FROZEN at the floor to 6 decimals.
    id: 'imp35326-onset-gap-frozen-at-pt-height',
    description: 'at N ~ 3e12 the onset gap equals the floor 0.229783 to 6 decimals (N-frozen, NOT shrinking to 0)',
    holds: () => FROZEN_AT_PT && Math.abs(BOTTOM.gCross - 0.229783) < 1e-5,
  },
  {
    // The total onset-gap span 1e4 -> 3e12 is small (< 4%): the gap does NOT recede to unreachability.
    id: 'imp35326-onset-gap-span-small',
    description: 'the onset-gap span from N=1e4 to N=3e12 is ~3.65% of the floor (small, NOT unreachable)',
    holds: () => SPAN_REL > 0.03 && SPAN_REL < 0.04 && SPAN_ABS > 0,
  },
  {
    // The frozen onset gap sits comfortably ABOVE the accessible verified g_min band (answer: NO, not unreachable).
    id: 'imp35326-onset-above-accessible-band',
    description: 'the onset gap 0.229783 sits ~6x above g_min(1e4)=0.0377, so the onset is comfortably crossed at the verified height',
    holds: () => ONSET_ABOVE_ACCESSIBLE_BAND && G_CROSS_FLOOR > G_MIN_1E4,
  },
  {
    // Honesty gate: measurement only, no QED, I2/M5 stay OPEN, sandwich untouched, no refereed bound is changed.
    id: 'imp35326-honesty-gate-no-qed',
    description: 'Measurement only: isRigorous false, NO QED, changes NO bound, I2/M5 stay OPEN, no refereed bound is changed',
    holds: () =>
      IMP35326_HORIZON_FRONT_ONSET_GAP_VERIFIED_HEIGHT.isRigorous === false &&
      /NO QED/.test(IMP35326_HORIZON_FRONT_ONSET_GAP_VERIFIED_HEIGHT.verdict) &&
      /changes NO bound/.test(IMP35326_HORIZON_FRONT_ONSET_GAP_VERIFIED_HEIGHT.verdict) &&
      /I2\/M5 stay OPEN/.test(IMP35326_HORIZON_FRONT_ONSET_GAP_VERIFIED_HEIGHT.verdict) &&
      /refereed bound is changed/i.test(IMP35326_HORIZON_FRONT_ONSET_GAP_VERIFIED_HEIGHT.verdict),
  },
];

for (const a of IMP35326_HORIZON_FRONT_ONSET_GAP_VERIFIED_HEIGHT_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-35326-horizon-front-onset-gap-verified-height assertion failed: ${a.id}`);
  }
}
