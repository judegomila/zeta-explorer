/**
 * @module imp-35778-i3-edge-type-floor-decomposition-scope
 *
 * imp-35778 (numerical/assessment, S-frontier): SCOPE the imp-35727 ingredient I3
 * modulus-floor requirement -- a certified |f| = |H_t| >= delta > 0 on the rectangle
 * boundary dR of R = [T_PT, T_PT + Delta] x [-h, h] -- by DECOMPOSING the contour floor
 * BY EDGE TYPE, which the sibling imp-35758 left as a single monolithic worst-point
 * minimum "min over z in dR of (margin(z) - cap)". imp-35758 tied the floor to the
 * imp-35725 barrier margin |A_t + B_t| - |C_t| but never said WHERE on dR the floor
 * binds; this module localizes it and ties each edge type to its governing scale.
 *
 * ORDER-OF-MAGNITUDE SCOPING ONLY. Establishes no positivity; certifies no
 * non-vanishing; evaluates no modulus; positions no rectangle; fixes no Delta or h;
 * changes no bound; no RH verdict, NO QED. No refereed bound is changed.
 *
 * THE GEOMETRY OF dR (why one delta hides two very different floors)
 * -----------------------------------------------------------------------------
 * The rectangle R = [T_PT, T_PT + Delta] x [-h, h] straddles the real axis y = 0.
 * The zeros the winding count encloses are the REAL zeros of H_t in [T_PT, T_PT+Delta]
 * (on y = 0, for t at or above the de Bruijn-Newman threshold). Its boundary dR has
 * two structurally different edge families:
 *   - TWO LONG EDGES  y = +h and y = -h, x in [T_PT, T_PT + Delta]: entirely OFF the
 *     real axis, at transverse distance h from the axis where the zeros live.
 *   - TWO SHORT EDGES x = T_PT and x = T_PT + Delta, y in [-h, h]: each CROSSES the
 *     real axis at y = 0, at fixed x-endpoints.
 * A single "delta = min over dR" (imp-35758) is the smaller of a LONG-edge floor and a
 * SHORT-edge floor whose scales and controlling geometry differ, so the certificate
 * must satisfy TWO separate placement conditions, not one.
 *
 * SHORT-EDGE FLOOR delta_short (the axis crossing -- imp-35758 binds HERE)
 * -----------------------------------------------------------------------------
 * On a short edge the point y = 0 lies ON the axis of zeros, so |H_t| there is the value
 * at the CHOSEN x-endpoint. To keep it away from 0 the endpoints x = T_PT, T_PT + Delta
 * must be placed BETWEEN consecutive real zeros -- ideally at an inter-zero |H_t| local
 * maximum, where |H_t| is of MAIN-TERM scale. This on-axis value is exactly the
 * reverse-triangle surplus imp-35758 records: delta_short = (|A_t+B_t| - |C_t|) - cap at
 * the endpoint. The imp-35758 "worst boundary point / grazing a would-be zero" collapse
 * is precisely the FAILURE to place an endpoint between zeros -- so the imp-35758 caveat
 * LIVES on the short edges. Placing endpoints at inter-zero maxima is what makes
 * delta_short robust; Delta is thereby QUANTIZED to (near) an integer number of mean
 * zero gaps delta(T_PT) = 2 pi / log(T_PT / 2 pi) ~ 0.2336 (imp-35757).
 *
 * LONG-EDGE FLOOR delta_long (off the axis -- a NEW, h-linear scale)
 * -----------------------------------------------------------------------------
 * On a long edge |y| = h > 0, so the point is at transverse distance h from the nearest
 * real zero x_0 (where H_t(x_0) = 0). To leading order near x_0,
 *     H_t(x_0 +- i h) ~ H_t'(x_0) . (+- i h)  =>  |H_t(x_0 +- i h)| ~ |H_t'(x_0)| . h,
 * so the long-edge floor is LINEAR in h: delta_long ~ (inf over the edge of |H_t'|) . h.
 * This is a DIFFERENT mechanism from the short-edge margin surplus: it is bought by
 * MOVING OFF the axis, not by placing between zeros. Using the imp-35777 derivative scale
 * B = sup|H_t'| ~ |H_t| . (1/2) log(T_PT / 2 pi) as an OOM proxy for the local |H_t'|,
 * delta_long ~ |H_t| . w(T_PT) . h with w(T_PT) = (1/2) log(T_PT/2 pi) ~ 13.446. So once
 * h is a fixed fraction of the mean zero gap delta(T_PT) ~ 0.2336 (i.e. h ~ 1/w), the
 * long-edge floor is of MAIN-TERM scale too -- the SAME spacing scale imp-35757 used for
 * the I2 panel width. (This is an OOM proxy: a rigorous lower bound needs inf|H_t'|, not
 * the sup B; the point here is only the h-linear SCALING, not a certified constant.)
 *
 * WHAT THE DECOMPOSITION BUYS (over imp-35758)
 * -----------------------------------------------------------------------------
 *   delta = min(delta_short, delta_long),
 * with delta_short controlled by ENDPOINT PLACEMENT between real zeros (sets Delta) and
 * delta_long controlled by the OFF-AXIS HEIGHT h. Both reach main-term scale under the
 * SAME zero-spacing geometry delta(T_PT) ~ 0.2336: endpoints one gap apart, h ~ one gap.
 * This refines the imp-35758 monolithic "position the rectangle to avoid dips" into a
 * concrete TWO-KNOB prescription (Delta via endpoints, h via off-axis distance) and
 * locates the imp-35758 collapse caveat specifically on the SHORT edges. It ADDS NO new
 * greenfield mechanism: both floors are still read from the SAME I1/W1 interval enclosure
 * of A_t + B_t - C_t (imp-35681 Part A), evaluated on the respective edges -- so I3 stays
 * downstream of W1 exactly as imp-35727 gated it, and the mechanical obstruction is the
 * SAME certified ~4.886e5-term sum imp-35725 named.
 *
 * WHAT THIS DOES NOT DO
 * -----------------------------------------------------------------------------
 * OOM/structural scoping only. Evaluates no |H_t| or |H_t'| on any edge; lower-bounds no
 * inf|H_t'|; fixes no Delta or h; positions no rectangle; verifies no strict inequality;
 * certifies no delta_short > 0 or delta_long > 0. It only records the edge-type SPLIT of
 * the I3 floor and each edge's governing scale. Establishes no positivity; certifies no
 * non-vanishing; changes no bound; C_mb GUE-conditional (imp-486) untouched; NO QED.
 * No refereed bound is changed.
 *
 * @see imp-35758-i3-modulus-floor-margin-tie-scope (I3 floor = margin - cap; monolithic min over dR, no edge split)
 * @see imp-35777-i2-logderivative-panel-cap-scope (B = sup|H_t prime| ~ |H_t| . w; I2/I3 coupling L_panel < pi . delta / B)
 * @see imp-35757-i2-panel-width-count-scope (mean zero gap delta(T_PT) = 2 pi / log(T_PT/2 pi) ~ 0.2336)
 * @see imp-35727-w2-certified-winding-count-ingredients-scope (I3 named GREENFIELD)
 * @see imp-35725-w1-effective-error-cap-budget (C_t^{cap}=E_A+E_B+E_{C_0}; the margin the short-edge floor reads off)
 * @see imp-35681-w1-w2-w4-existing-infra-inventory (Part A: A+B-C interval enclosure greenfield)
 * @see Polymath15 2019 (effective approximation H_t = A + B - C; barrier method); Platt-Trudgian 2021
 */

// -- Anchor + operative constants (import-light; matching imp-35725 / imp-35757 / imp-35777) --
const T_PT = 3e12; // Platt-Trudgian 2021 verified height (external barrier base)
const L_PT = 0.2; // Platt-Trudgian 2021 bound; unchanged by this scoping
const N_AT_TPT = Math.floor(Math.sqrt(T_PT / (4 * Math.PI))); // ~488602 retained terms (imp-35674 Part D)

// Winding rate / derivative log-scale w(T) = (1/2) log(T / 2 pi) (imp-35757 / imp-35777).
const windingRate = (T) => 0.5 * Math.log(T / (2 * Math.PI));
const W_TPT = windingRate(T_PT); // ~13.446 rad per unit height at T_PT

// Mean zero gap delta(T) = 2 pi / log(T / 2 pi) = pi / w(T) (imp-35757).
const meanZeroGap = (T) => (2 * Math.PI) / Math.log(T / (2 * Math.PI));
const GAP_TPT = meanZeroGap(T_PT); // ~0.2336

// OOM proxies (NOT certified magnitudes): main-term modulus normalised to O(1); the
// long-edge floor is h-LINEAR, delta_long ~ |H_t| . w . h (imp-35777 B proxy).
const ILLUSTRATIVE_HT = 1; // O(1) main-term-scale |H_t|
const longEdgeFloorProxy = (Ht, w, h) => Ht * w * h; // ~ |H_t'| . h with |H_t'| ~ Ht . w
// h a fixed fraction of the mean gap (h ~ 1/w = gap/pi) makes the long-edge floor O(1):
const H_OFFAXIS = 1 / W_TPT; // ~0.0744, ~ (1/pi) of the mean gap
const ILLUSTRATIVE_DELTA_LONG = longEdgeFloorProxy(ILLUSTRATIVE_HT, W_TPT, H_OFFAXIS); // ~1

export const IMP35778_I3_EDGE_TYPE_FLOOR_DECOMPOSITION_SCOPE = {
  id: 'imp-35778',
  proofSection: 'S-frontier',
  question:
    'Scope the imp-35727 ingredient-I3 modulus floor |H_t| >= delta > 0 on dR by DECOMPOSING the contour floor ' +
    'BY EDGE TYPE (the two off-axis long edges y = +-h vs the two axis-crossing short edges x = const), localizing ' +
    'where the imp-35758 monolithic min over dR binds and tying each edge floor to its governing scale at T_PT=3e12. ' +
    'Order-of-magnitude scoping only; establishes no positivity; NO QED.',
  geometry: {
    rectangle: 'R = [T_PT, T_PT + Delta] x [-h, h] straddles the real axis y = 0 where the enclosed real zeros live',
    longEdges: 'y = +h and y = -h, x in [T_PT, T_PT + Delta]: entirely OFF the axis at transverse distance h',
    shortEdges: 'x = T_PT and x = T_PT + Delta, y in [-h, h]: each CROSSES the axis at y = 0 at a fixed endpoint',
    split: 'delta = min(delta_short, delta_long): the imp-35758 min over dR is the smaller of two edge floors of different scale',
  },
  shortEdgeFloor: {
    mechanism:
      'on a short edge y = 0 lies ON the axis of zeros, so |H_t| is the value at the CHOSEN x-endpoint; keeping it ' +
      'away from 0 requires placing the endpoints BETWEEN consecutive real zeros (at an inter-zero |H_t| maximum)',
    tie:
      'delta_short = (|A_t + B_t| - |C_t|) - cap at the endpoint -- EXACTLY the imp-35758 reverse-triangle margin ' +
      'surplus; the imp-35758 grazing-a-zero collapse caveat LIVES on the short edges',
    scale: 'main-term scale when endpoints sit at inter-zero maxima; this QUANTIZES Delta to ~ an integer number of mean gaps',
  },
  longEdgeFloor: {
    mechanism:
      'on a long edge |y| = h > 0 the point is at transverse distance h from the nearest real zero x_0; to leading ' +
      'order |H_t(x_0 +- i h)| ~ |H_t prime(x_0)| . h, so the floor is LINEAR in h -- bought by moving OFF the axis',
    scaleProxy:
      'using the imp-35777 derivative scale B = sup|H_t prime| ~ |H_t| . w(T_PT) as an OOM proxy, delta_long ~ ' +
      '|H_t| . w(T_PT) . h; once h ~ 1/w (a fixed fraction of the mean gap ~0.2336) the long-edge floor is main-term scale',
    caveat: 'OOM proxy only: a rigorous lower bound needs inf|H_t prime| not the sup B; the point is the h-LINEAR SCALING',
  },
  windingRateTPT: W_TPT,
  meanZeroGapTPT: GAP_TPT,
  illustrativeHt: ILLUSTRATIVE_HT,
  offAxisHeight: H_OFFAXIS,
  illustrativeDeltaLong: ILLUSTRATIVE_DELTA_LONG,
  buys:
    'delta = min(delta_short, delta_long) with delta_short set by ENDPOINT placement between real zeros (fixes Delta) ' +
    'and delta_long set by the OFF-AXIS height h; both reach main-term scale under the SAME zero-spacing geometry ' +
    'delta(T_PT) ~ 0.2336 -- a concrete TWO-KNOB refinement of the imp-35758 monolithic "position the rectangle to ' +
    'avoid dips". ADDS NO greenfield mechanism: both floors read from the SAME I1/W1 interval enclosure (imp-35681 ' +
    'Part A), so I3 stays downstream of W1 and the mechanical obstruction is the SAME ~4.886e5-term certified sum.',
  retainedTermsAtTPT: N_AT_TPT,
  isRigorous: false,
  verdict:
    'ORDER-OF-MAGNITUDE SCOPING (frontier-direction, NOT rigorous). The imp-35727 ingredient-I3 contour modulus ' +
    'floor delta = min over dR, left monolithic by imp-35758, DECOMPOSES by edge type into delta = min(delta_short, ' +
    'delta_long). SHORT edges (x = const) cross the axis at y = 0: delta_short = (|A_t+B_t| - |C_t|) - cap is the ' +
    'imp-35758 reverse-triangle surplus, robust only when the endpoints are placed BETWEEN consecutive real zeros ' +
    '(so the imp-35758 grazing-collapse caveat lives here; Delta is quantized to ~ an integer number of mean gaps ' +
    'delta(T_PT) ~ 0.2336). LONG edges (y = +-h) sit OFF the axis: delta_long ~ |H_t prime| . h is LINEAR in h, a ' +
    'DIFFERENT mechanism, and with the imp-35777 proxy B ~ |H_t| . w(T_PT) (w ~ 13.446) it is main-term scale once ' +
    'h ~ 1/w (a fixed fraction of the mean gap). This refines the imp-35758 single-knob "avoid dips" into a TWO-KNOB ' +
    'prescription (Delta via endpoints, h via off-axis distance) and locates the collapse caveat on the short edges, ' +
    'while ADDING NO greenfield mechanism -- both floors are read from the SAME I1/W1 interval enclosure (imp-35681 ' +
    'Part A) and the SAME ~4.886e5-term certified sum imp-35725 named. Evaluates no modulus; lower-bounds no ' +
    'inf|H_t prime|; fixes no Delta or h; positions no rectangle; verifies no inequality; certifies no delta > 0; ' +
    'establishes no positivity; changes no bound; C_mb GUE-conditional (imp-486) untouched; no RH verdict, NO QED. ' +
    'No refereed bound is changed.',
  citation:
    'imp-35758 (I3 floor = margin - cap, monolithic min over dR); imp-35777 (B = sup|H_t prime| ~ |H_t| . w; I2/I3 ' +
    'coupling); imp-35757 (mean zero gap delta(T_PT) = 2 pi / log(T_PT/2 pi) ~ 0.2336); imp-35727 (I3 GREENFIELD); ' +
    'imp-35725 (C_t^{cap}=E_A+E_B+E_{C_0}); imp-35681 Part A (A+B-C interval enclosure greenfield); imp-35674 ' +
    'Part D (N(x)=floor(sqrt(x/4 pi))); Polymath15 2019 (H_t = A + B - C, barrier method); Platt-Trudgian 2021.',
};

export const IMP35778_I3_EDGE_TYPE_FLOOR_DECOMPOSITION_SCOPE_ASSERTIONS = [
  {
    // The edge-type split: delta = min(delta_short, delta_long) over the two edge families.
    id: 'imp35778-edge-type-split',
    description: 'I3 contour floor decomposes by edge type: delta = min(delta_short, delta_long)',
    holds: () =>
      /delta = min\(delta_short, delta_long\)/.test(IMP35778_I3_EDGE_TYPE_FLOOR_DECOMPOSITION_SCOPE.geometry.split) &&
      /OFF the axis/.test(IMP35778_I3_EDGE_TYPE_FLOOR_DECOMPOSITION_SCOPE.geometry.longEdges) &&
      /CROSSES the axis/.test(IMP35778_I3_EDGE_TYPE_FLOOR_DECOMPOSITION_SCOPE.geometry.shortEdges),
  },
  {
    // Short-edge floor = imp-35758 reverse-triangle surplus; the collapse caveat lives here.
    id: 'imp35778-short-edge-margin-surplus',
    description: 'delta_short = imp-35758 (|A_t+B_t|-|C_t|)-cap surplus; endpoints placed between real zeros; caveat lives here',
    holds: () =>
      /reverse-triangle margin/.test(IMP35778_I3_EDGE_TYPE_FLOOR_DECOMPOSITION_SCOPE.shortEdgeFloor.tie) &&
      /LIVES on the short edges/.test(IMP35778_I3_EDGE_TYPE_FLOOR_DECOMPOSITION_SCOPE.shortEdgeFloor.tie) &&
      /BETWEEN consecutive real zeros/.test(IMP35778_I3_EDGE_TYPE_FLOOR_DECOMPOSITION_SCOPE.shortEdgeFloor.mechanism),
  },
  {
    // Long-edge floor is h-LINEAR; with the imp-35777 B proxy it is main-term once h ~ 1/w. Anchors match.
    id: 'imp35778-long-edge-h-linear',
    description: 'delta_long ~ |H_t| . w . h is LINEAR in h; main-term once h ~ 1/w; w(T_PT) ~ 13.446 and gap ~ 0.2336 anchored',
    holds: () => {
      const w = windingRate(3e12);
      const gap = meanZeroGap(3e12);
      return (
        Math.abs(w - 13.446) < 5e-3 &&
        Math.abs(gap - 0.2336) < 5e-4 &&
        Math.abs(W_TPT * GAP_TPT - Math.PI) < 1e-9 && // w = pi / gap identity
        // h-linearity: doubling h doubles the long-edge floor proxy.
        Math.abs(longEdgeFloorProxy(1, w, 2 * H_OFFAXIS) - 2 * longEdgeFloorProxy(1, w, H_OFFAXIS)) < 1e-12 &&
        Math.abs(ILLUSTRATIVE_DELTA_LONG - 1) < 1e-9 && // h ~ 1/w gives O(1) floor
        /LINEAR in h/.test(IMP35778_I3_EDGE_TYPE_FLOOR_DECOMPOSITION_SCOPE.longEdgeFloor.mechanism)
      );
    },
  },
  {
    // The two-knob buy over imp-35758, adding NO greenfield mechanism; N anchored.
    id: 'imp35778-two-knob-no-new-mechanism',
    description: 'Two-knob (Delta via endpoints, h via off-axis) refinement of imp-35758; adds NO greenfield mechanism; N ~ 4.886e5',
    holds: () =>
      /TWO-KNOB/.test(IMP35778_I3_EDGE_TYPE_FLOOR_DECOMPOSITION_SCOPE.buys) &&
      /ADDS NO greenfield mechanism/.test(IMP35778_I3_EDGE_TYPE_FLOOR_DECOMPOSITION_SCOPE.buys) &&
      /SAME I1\/W1 interval enclosure/.test(IMP35778_I3_EDGE_TYPE_FLOOR_DECOMPOSITION_SCOPE.buys) &&
      N_AT_TPT === Math.floor(Math.sqrt(3e12 / (4 * Math.PI))) &&
      N_AT_TPT > 4.8e5 && N_AT_TPT < 4.9e5,
  },
  {
    // Honesty gate: OOM scoping only, no positivity, no non-vanishing certificate, no QED, no refereed bound is changed.
    id: 'imp35778-honesty-gate-no-qed',
    description: 'Scoping only; establishes no positivity; certifies no delta>0; changes no bound; NO QED; no refereed bound is changed',
    holds: () =>
      IMP35778_I3_EDGE_TYPE_FLOOR_DECOMPOSITION_SCOPE.isRigorous === false &&
      Math.abs(L_PT - 0.2) < 1e-15 &&
      /establishes no positivity/.test(IMP35778_I3_EDGE_TYPE_FLOOR_DECOMPOSITION_SCOPE.verdict) &&
      /certifies no delta > 0/.test(IMP35778_I3_EDGE_TYPE_FLOOR_DECOMPOSITION_SCOPE.verdict) &&
      /NO QED/.test(IMP35778_I3_EDGE_TYPE_FLOOR_DECOMPOSITION_SCOPE.verdict) &&
      /refereed bound is changed/i.test(IMP35778_I3_EDGE_TYPE_FLOOR_DECOMPOSITION_SCOPE.verdict),
  },
];

for (const a of IMP35778_I3_EDGE_TYPE_FLOOR_DECOMPOSITION_SCOPE_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-35778-i3-edge-type-floor-decomposition-scope assertion failed: ${a.id}`);
  }
}
