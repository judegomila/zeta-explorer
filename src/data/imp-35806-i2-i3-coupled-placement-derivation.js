/**
 * @module imp-35806-i2-i3-coupled-placement-derivation
 *
 * imp-35806 (proof/derivation, S-frontier): DERIVE the single coupled two-knob
 * (Delta, h) placement of the transition rectangle R = [T_PT, T_PT + Delta] x [-h, h]
 * that SIMULTANEOUSLY keeps the imp-35777 per-panel argument cap L_panel < pi . delta / B
 * satisfiable with a FINITE panel count AND the imp-35778 modulus floor delta off zero,
 * EDGE BY EDGE on the boundary dR, at the T_PT = 3e12 OOM scale. imp-35777 flagged that
 * I2 and I3 "cannot be budgeted independently" (shrinking R to lift the I3 floor delta
 * lengthens the admissible I2 panels, and grazing a would-be zero shrinks both at once),
 * but the joint (Delta, h) placement that resolves the coupling was never derived.
 * imp-35800 located the (h, Delta) that MAXIMISES the I3 floor alone; imp-35801 quantified
 * the I2 panel amplification vs grazing distance alone. This module COMBINES the two: it
 * writes the TOTAL boundary panel budget as a function of both knobs and minimises it under
 * the floor-positivity constraint, deriving the joint operating corner and showing the
 * coupling is BENIGN there (the I3-optimal and I2-optimal knobs coincide).
 *
 * DERIVATION ON THE SHARED NORMALISED OOM MODEL ONLY (imp-35777 / imp-35778 / imp-35800 /
 * imp-35801). Evaluates no true |H_t| or |H_t prime| on any edge; fixes no Delta or h for
 * any real rectangle; certifies no cap; certifies no delta > 0; establishes no positivity;
 * changes no bound; no RH verdict, NO QED. No refereed bound is changed.
 *
 * THE COUPLED REQUIREMENT, EDGE BY EDGE
 * -----------------------------------------------------------------------------
 * The argument principle on dR needs, on EVERY edge simultaneously:
 *   (I3)  a modulus floor  delta_edge > 0  (f = H_t does not vanish on the edge), and
 *   (I2)  a per-panel argument cap  L_panel < pi . delta_edge / B  (imp-35777),
 *         B = sup|H_t prime|, which forces at least  N_edge = L_edge / L_panel
 *         = L_edge . B / (pi . delta_edge)  panels on that edge.
 * The two edge families carry DIFFERENT floors (imp-35778): the two LONG edges y = +-h
 * (length Delta) see delta_long, the two SHORT edges x = const (length 2h) see delta_short.
 * So the joint budget over the whole boundary dR is
 *     N_total(Delta, h) = 2 . N_long + 2 . N_short
 *                       = 2 . Delta . B / (pi . delta_long)  +  2 . (2h) . B / (pi . delta_short).
 * This is the object imp-35777 said couples I2 to I3: delta_long and delta_short sit in the
 * DENOMINATORS, so any placement that lifts a floor (I3) also shrinks the required panel
 * count (I2). The coupling is REAL; the question is whether it forces a trade-off.
 *
 * THE TWO FLOORS AS FUNCTIONS OF THE KNOBS (imp-35800 closed forms, B = w normalisation)
 * -----------------------------------------------------------------------------
 * Normalise the main-term modulus envelope to 1, so B = sup|H_t prime| ~ |H_t| . w ~ w with
 * w = w(T_PT) = (1/2) log(T_PT / 2 pi) ~ 13.446 (imp-35777) and mean zero gap g = pi/w ~ 0.2336.
 *   delta_long(h)  = min(w h, 1)                      -- h-linear, capped at the envelope (imp-35800)
 *   delta_short(D) = cos(pi . dist(D/g, nearest int) / 2) in [1/sqrt2, 1]  -- phase-optimised
 *                    over a free rectangle slide, NEVER collapses (imp-35800).
 * Substituting B = w:
 *   N_long(Delta, h)  = Delta . w / (pi . min(w h, 1)),
 *   N_short(Delta, h) = 2 h w / (pi . delta_short(Delta)).
 *
 * THE JOINT MINIMISATION (the derivation the ticket asks for)
 * -----------------------------------------------------------------------------
 * Take Delta = m . g (an integer number of mean gaps: this encloses ~ m real zeros AND puts
 * the short-edge endpoints at consecutive inter-zero maxima, so delta_short = 1 -- the
 * imp-35800 no-collapse corner). Then for h <= 1/w (delta_long = w h < 1 not yet saturated):
 *     N_total(h) = 2 . (m g) . w / (pi . w h)  +  4 h w / pi
 *                = 2 m g / (pi h)              +  4 w h / pi.
 * The first term (long edges) FALLS with h; the second (short edges) RISES with h -- this
 * IS the imp-35777 tension, now written explicitly. Setting dN_total/dh = 0:
 *     -2 m g / (pi h^2) + 4 w / pi = 0   =>   h*^2 = m g / (2 w) = m pi / (2 w^2)
 *     =>   h_interior* = sqrt(m pi / 2) / w.
 * For EVERY m >= 1, sqrt(m pi / 2) >= sqrt(pi/2) ~ 1.2533 > 1, so h_interior* > 1/w lies
 * OUTSIDE the not-yet-saturated region h <= 1/w. Hence on (0, 1/w] the budget is strictly
 * DECREASING, and for h >= 1/w (delta_long saturated at 1, so N_long = m constant while
 * N_short keeps rising) it is strictly INCREASING. The constrained minimum is therefore the
 * BOUNDARY h* = 1/w -- EXACTLY the imp-35800 floor-saturation height. THE COUPLING IS BENIGN:
 * the h that minimises the I2 panel budget is the SAME h that saturates the I3 floor.
 *
 * THE DERIVED JOINT PLACEMENT AND ITS TOTAL BUDGET
 * -----------------------------------------------------------------------------
 *   (Delta*, h*) = (m . g,  1/w),   m = 1, 2, 3, ...   (m = smallest integer enclosing the target zeros)
 * At this corner both floors are main-term (delta_long = delta_short = 1) and the total
 * boundary panel budget is
 *     N_total = 2 m + 4/pi ~ 2 m + 1.273,     i.e.   N_total / m = 2 + 4/(pi m)  ->  2  (m -> inf).
 * READ-OUT: two panels per enclosed zero on the long edges (one per mean gap per long edge,
 * two long edges) plus a FIXED short-edge overhead 4/pi ~ 1.273 that amortises away as more
 * zeros are enclosed. The budget is FINITE and O(m) -- no divergence -- precisely because
 * both floors are held at main-term scale by the SAME corner.
 *
 * WHY NEITHER KNOB WANTS TO MOVE (the resolution of the imp-35777 worry)
 * -----------------------------------------------------------------------------
 *   - Pushing h ABOVE 1/w: delta_long saturates at 1, so the long-edge count floors at
 *     N_long = m (no further gain), while the short edges keep LENGTHENING (2h), so N_short
 *     grows -- pure waste.
 *   - Pushing h BELOW 1/w: delta_long = w h < 1 falls, so L_panel_long = pi h shrinks and
 *     N_long = m / (w h) grows FASTER than the short-edge saving 4 w h / pi -- net loss.
 *   - Detuning Delta off integer gaps: delta_short drops toward 1/sqrt2, RAISING N_short by up
 *     to sqrt2 (~41%), with no compensating gain -- so Delta stays quantised to integer gaps.
 * The imp-35777 tension "lift delta by shrinking R => lengthen panels" is therefore resolved:
 * in the ROBUST (free-slide) regime the I3-optimal and I2-optimal placements COINCIDE at the
 * saturation corner, so there is NO residual trade-off. The tension only RE-APPEARS in the
 * GRAZING / pinned-endpoint regime (imp-35801: a would-be zero at standoff d gives
 * delta_local ~ B d and the 1/d panel-budget pole) -- which is exactly where I3 itself fails.
 * So I2 and I3 fail TOGETHER and succeed TOGETHER, confirming imp-35777's qualitative "finite
 * exactly when I3 holds" as a JOINT statement over BOTH knobs.
 *
 * WHAT THIS DERIVES (over imp-35800 / imp-35801)
 * -----------------------------------------------------------------------------
 * imp-35800 maximised the I3 floor min(delta_short, delta_long) alone (which SATURATES, so it
 * is indifferent to h beyond 1/w) and imp-35801 mapped the I2 amplification vs grazing distance
 * alone. Neither wrote the JOINT I2+I3 objective. This module writes N_total(Delta, h) with
 * BOTH floors in the denominators, minimises it under floor-positivity, and derives the single
 * operating corner (Delta*, h*) = (m g, 1/w) with total budget 2m + 4/pi, PLUS the structural
 * fact that the joint I2 optimum coincides with the I3 optimum (benign coupling in the robust
 * regime). It ADDS NO greenfield mechanism: every floor and the scale B are the SAME I1/W1
 * interval-enclosure quantities (imp-35681 Part A) the siblings read, just assembled into one
 * objective.
 *
 * WHAT THIS DOES NOT DO
 * -----------------------------------------------------------------------------
 * DERIVATION on the shared normalised OOM model only. The sine-kernel short-edge floor, the
 * h-linear long-edge floor, and B = w are OOM stand-ins, NOT certified moduli; the budget
 * 2m + 4/pi is a normalised panel COUNT, not a certified count of any real rectangle. Evaluates
 * no true |H_t| or |H_t prime|; lower-bounds no inf|H_t prime|; fixes no Delta or h for any real
 * rectangle; positions no rectangle; verifies no strict inequality; certifies no cap; certifies
 * no delta > 0; establishes no positivity; changes no bound; C_mb GUE-conditional (imp-486)
 * untouched; no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-35777-i2-logderivative-panel-cap-scope (L_panel < pi.delta/B; I2/I3 coupling flagged, joint placement not derived)
 * @see imp-35778-i3-edge-type-floor-decomposition-scope (delta = min(delta_short, delta_long); two-knob prescription)
 * @see imp-35800-i3-two-knob-floor-balance-point (argmax of the FLOOR alone: saturation corner h = 1/w, Delta = integer gaps)
 * @see imp-35801-i2-panel-amplification-vs-grazing-distance (1/d panel-budget pole in the GRAZING regime)
 * @see imp-35757-i2-panel-width-count-scope (mean zero gap g = 2 pi / log(T/2 pi) ~ 0.2336; ~4.28 panels/unit-height)
 * @see imp-35727-w2-certified-winding-count-ingredients-scope (I2, I3 named GREENFIELD)
 * @see imp-35681-w1-w2-w4-existing-infra-inventory (Part A: A+B-C interval enclosure greenfield)
 * @see Polymath15 2019 (H_t = A + B - C; barrier method); Platt-Trudgian 2021
 */

// -- Anchor + operative constants (import-light; matching imp-35777 / imp-35778 / imp-35800 / imp-35801) --
const T_PT = 3e12; // Platt-Trudgian 2021 verified height (external barrier base)
const L_PT = 0.2; // Platt-Trudgian 2021 bound; unchanged by this derivation

// Winding / derivative log-scale w(T) = (1/2) log(T / 2 pi) (imp-35757 / imp-35777).
const windingRate = (T) => 0.5 * Math.log(T / (2 * Math.PI));
const W_TPT = windingRate(T_PT); // ~13.446 rad per unit height at T_PT

// Mean zero gap g(T) = 2 pi / log(T / 2 pi) = pi / w(T) (imp-35757).
const meanZeroGap = (T) => (2 * Math.PI) / Math.log(T / (2 * Math.PI));
const GAP_TPT = meanZeroGap(T_PT); // ~0.2336

// Normalised OOM: main-term envelope == 1, so B = sup|H_t prime| ~ |H_t| . w ~ w.
const B_PROXY = W_TPT; // sup|H_t prime| OOM scale (imp-35777)
const H_SAT = 1 / W_TPT; // off-axis floor-saturation height (imp-35800), ~0.0744

// -- Edge floors (imp-35800 closed forms; NOT certified moduli) --
const distToNearestInt = (x) => {
  const f = x - Math.floor(x);
  return Math.min(f, 1 - f);
};
const deltaShort = (Delta, gap) => Math.cos((Math.PI * distToNearestInt(Delta / gap)) / 2); // in [1/sqrt2, 1]
const deltaLong = (h, w) => Math.min(w * h, 1); // h-linear, capped at the envelope

// -- Per-edge panel counts from the imp-35777 cap L_panel < pi . delta_edge / B --
//   N_edge = L_edge / L_panel = L_edge . B / (pi . delta_edge).
const nLong = (Delta, h) => (Delta * B_PROXY) / (Math.PI * deltaLong(h, W_TPT)); // long edge, length Delta
const nShort = (Delta, h) => (2 * h * B_PROXY) / (Math.PI * deltaShort(Delta, GAP_TPT)); // short edge, length 2h
const nTotal = (Delta, h) => 2 * nLong(Delta, h) + 2 * nShort(Delta, h); // whole boundary dR

// -- Joint minimisation over h at Delta = m mean gaps: locate the operating corner --
function locateJointCorner(m, w, gap, hPanels = 400000) {
  const Delta = m * gap; // integer gaps => delta_short = 1, encloses ~m zeros
  const hMax = 3 / w; // sweep out to 3x the saturation height
  let best = { N: Infinity, h: 0 };
  for (let i = 1; i <= hPanels; i++) {
    const h = (hMax * i) / hPanels;
    const N = nTotal(Delta, h);
    if (N < best.N) best = { N, h };
  }
  return { m, Delta, hStar: best.h, hStarOverSat: best.h * w, nTotal: best.N, nPerZero: best.N / m };
}

// The unconstrained interior stationary point h_interior* = sqrt(m pi / 2) / w (in units of 1/w
// it is sqrt(m pi / 2) >= sqrt(pi/2) ~ 1.2533 > 1, so it lies PAST saturation for every m>=1;
// hence the constrained minimum sits at the boundary h* = 1/w).
const hInteriorOverSat = (m) => Math.sqrt((m * Math.PI) / 2); // = w . h_interior*

const JOINT_CORNERS = [1, 2, 3, 5].map((m) => locateJointCorner(m, W_TPT, GAP_TPT));

export const IMP35806_I2_I3_COUPLED_PLACEMENT_DERIVATION = {
  id: 'imp-35806',
  proofSection: 'S-frontier',
  question:
    'Derive the single coupled two-knob (Delta, h) placement of R = [T_PT, T_PT + Delta] x [-h, h] that ' +
    'SIMULTANEOUSLY keeps the imp-35777 per-panel cap L_panel < pi . delta / B satisfiable with a finite panel ' +
    'count AND the imp-35778 modulus floor delta off zero, edge by edge on dR at T_PT = 3e12. Derivation on the ' +
    'shared OOM model only; certifies no cap; certifies no delta > 0; changes no bound; NO QED.',
  coupledObjective: {
    perEdgeCount: 'N_edge = L_edge . B / (pi . delta_edge) (from imp-35777 L_panel < pi . delta_edge / B)',
    totalBudget:
      'N_total(Delta, h) = 2 . Delta . B/(pi . delta_long(h)) + 2 . (2h) . B/(pi . delta_short(Delta)) -- both ' +
      'floors sit in the DENOMINATORS, so lifting a floor (I3) shrinks the required panel count (I2): coupling is REAL',
    floors: 'delta_long(h) = min(w h, 1); delta_short(Delta) = cos(pi . dist(Delta/gap, int)/2) in [1/sqrt2, 1] (imp-35800)',
    normalisation: 'main-term envelope == 1 => B = sup|H_t prime| ~ w ~ 13.446 (imp-35777)',
  },
  derivation: {
    setup: 'Delta = m mean gaps (integer m): encloses ~m real zeros AND delta_short = 1 (endpoints at inter-zero maxima)',
    objective: 'for h <= 1/w: N_total(h) = 2 m g/(pi h) + 4 w h/pi (long edges FALL with h, short edges RISE with h)',
    stationaryPoint: 'dN_total/dh = 0 => h_interior* = sqrt(m pi/2)/w; in units of 1/w that is sqrt(m pi/2) >= 1.2533 > 1',
    conclusion:
      'the interior optimum lies PAST saturation for every m >= 1, so N_total is decreasing on (0, 1/w] and increasing ' +
      'for h >= 1/w -- the constrained minimum is the BOUNDARY h* = 1/w, the SAME imp-35800 floor-saturation height',
  },
  jointPlacement: {
    Delta: 'Delta* = m . g (integer mean gaps ~0.2336; m = smallest integer enclosing the target zeros)',
    h: 'h* = 1/w ~ 0.0744 (the floor-saturation height; ~ (1/pi) of the mean gap)',
    floorsAtCorner: 'delta_long = delta_short = 1 (both main-term scale)',
    totalBudget: 'N_total = 2 m + 4/pi ~ 2 m + 1.273; per enclosed zero N_total/m = 2 + 4/(pi m) -> 2 as m -> inf',
    readout:
      'two panels per enclosed zero on the long edges (one per mean gap per long edge, two long edges) plus a fixed ' +
      'short-edge overhead 4/pi ~ 1.273 that amortises away; FINITE and O(m), no divergence',
  },
  couplingResolution:
    'the imp-35777 tension "lift delta by shrinking R => lengthen panels" is RESOLVED: in the robust (free-slide) ' +
    'regime the I3-optimal knob (imp-35800 saturation h = 1/w) and the I2-optimal knob (joint panel-budget minimum) ' +
    'COINCIDE, so there is NO residual trade-off at the operating corner. The tension re-appears only in the ' +
    'GRAZING / pinned-endpoint regime (imp-35801: 1/d panel-budget pole) -- exactly where I3 itself fails -- so I2 ' +
    'and I3 fail together and succeed together (a JOINT reading of imp-35777 "finite exactly when I3 holds").',
  windingRateTPT: W_TPT,
  meanZeroGapTPT: GAP_TPT,
  saturationHeight: H_SAT,
  bProxy: B_PROXY,
  jointCorners: JOINT_CORNERS,
  isRigorous: false,
  verdict:
    'DERIVATION on the shared normalised OOM model (frontier-direction, NOT rigorous). Writing the imp-35777 ' +
    'per-panel cap L_panel < pi . delta_edge / B as a per-edge panel count and summing over the two edge families ' +
    'gives the JOINT boundary budget N_total(Delta, h) = 2 Delta B/(pi delta_long) + 4 h B/(pi delta_short) with ' +
    'BOTH imp-35778/imp-35800 floors in the denominators -- the object imp-35777 said couples I2 to I3. Taking ' +
    'Delta = m mean gaps (delta_short = 1) and minimising over h, the interior stationary point h_interior* = ' +
    'sqrt(m pi/2)/w lies PAST the saturation height 1/w for every m >= 1, so the constrained minimum is the ' +
    'BOUNDARY h* = 1/w -- the SAME height imp-35800 found maximises the I3 floor. The derived coupled placement is ' +
    '(Delta*, h*) = (m . g, 1/w) with total budget N_total = 2 m + 4/pi (2 + 4/(pi m) panels per enclosed zero, ' +
    '-> 2 as m -> inf), both floors at main-term scale. The coupling is therefore BENIGN in the robust regime (the ' +
    'I2-optimal and I3-optimal knobs coincide); the imp-35777 tension re-appears only in the grazing/pinned regime ' +
    '(imp-35801), which is where I3 already fails -- so I2 and I3 succeed together. ADDS NO greenfield mechanism -- ' +
    'every floor and the scale B are the SAME I1/W1 interval-enclosure quantities (imp-35681 Part A). Evaluates no ' +
    'true |H_t| or |H_t prime|; lower-bounds no inf|H_t prime|; fixes no Delta or h for any real rectangle; positions ' +
    'no rectangle; verifies no strict inequality; certifies no cap; certifies no delta > 0; establishes no positivity; ' +
    'changes no bound; C_mb GUE-conditional (imp-486) untouched; no RH verdict, NO QED. No refereed bound is changed' +
    '.',
  citation:
    'imp-35777 (L_panel < pi.delta/B; I2/I3 coupling flagged); imp-35778 (delta = min(delta_short, delta_long)); ' +
    'imp-35800 (floor-only argmax: saturation corner h = 1/w, Delta = integer gaps); imp-35801 (1/d panel-budget ' +
    'pole in the grazing regime); imp-35757 (mean zero gap g = 2 pi / log(T/2 pi) ~ 0.2336); imp-35727 (I2, I3 ' +
    'GREENFIELD); imp-35681 Part A (A+B-C interval enclosure greenfield); Polymath15 2019 (H_t = A + B - C, barrier ' +
    'method); Platt-Trudgian 2021.',
};

export const IMP35806_I2_I3_COUPLED_PLACEMENT_DERIVATION_ASSERTIONS = [
  {
    // The joint boundary budget puts BOTH floors in the denominators (the imp-35777 coupling).
    id: 'imp35806-joint-budget-couples-both-floors',
    description: 'N_total = 2 Delta B/(pi delta_long) + 4 h B/(pi delta_short): both edge floors in the denominators',
    holds: () => {
      const m = 2;
      const Delta = m * GAP_TPT;
      const h = H_SAT;
      // Direct assembly matches the exported per-edge formulas.
      const expected =
        (2 * Delta * B_PROXY) / (Math.PI * deltaLong(h, W_TPT)) +
        (2 * (2 * h) * B_PROXY) / (Math.PI * deltaShort(Delta, GAP_TPT));
      return (
        Math.abs(nTotal(Delta, h) - expected) < 1e-12 &&
        // Lowering either floor (denominator) raises the count: coupling is real.
        nLong(Delta, 0.5 * H_SAT) > nLong(Delta, H_SAT) &&
        nShort(1.5 * GAP_TPT, h) > nShort(GAP_TPT, h)
      );
    },
  },
  {
    // The interior stationary point lies PAST saturation for every m >= 1 (=> minimum at the boundary h = 1/w).
    id: 'imp35806-interior-optimum-past-saturation',
    description: 'h_interior* = sqrt(m pi/2)/w > 1/w for all m>=1 (units of 1/w: sqrt(m pi/2) >= sqrt(pi/2) ~ 1.2533)',
    holds: () => {
      for (const m of [1, 2, 3, 5, 10]) {
        if (hInteriorOverSat(m) <= 1 + 1e-9) return false; // must exceed the saturation boundary
      }
      return Math.abs(hInteriorOverSat(1) - Math.sqrt(Math.PI / 2)) < 1e-12 && hInteriorOverSat(1) > 1.25;
    },
  },
  {
    // The joint constrained minimum sits at the saturation height h* = 1/w for every m (numeric argmin).
    id: 'imp35806-joint-corner-at-saturation-height',
    description: 'argmin_h N_total(m g, h) = 1/w for m in {1,2,3,5}: the I2 panel optimum coincides with the I3 floor optimum',
    holds: () =>
      JOINT_CORNERS.every((c) => Math.abs(c.hStarOverSat - 1) < 5e-3) &&
      JOINT_CORNERS.length === 4,
  },
  {
    // The derived total budget equals 2 m + 4/pi, i.e. -> 2 panels per enclosed zero.
    id: 'imp35806-total-budget-2m-plus-4-over-pi',
    description: 'N_total = 2 m + 4/pi at the corner; per-zero budget 2 + 4/(pi m) decreases toward 2 as m grows',
    holds: () => {
      for (const c of JOINT_CORNERS) {
        if (Math.abs(c.nTotal - (2 * c.m + 4 / Math.PI)) > 5e-3) return false;
        if (Math.abs(c.nPerZero - (2 + 4 / (Math.PI * c.m))) > 5e-3) return false;
      }
      // Monotone toward 2 with m, and > 2 for finite m.
      const perZero = JOINT_CORNERS.map((c) => c.nPerZero);
      const strictlyDecreasing = perZero.every((v, i) => i === 0 || v < perZero[i - 1] + 1e-9);
      return strictlyDecreasing && perZero[perZero.length - 1] > 2 && perZero[0] < 3.3;
    },
  },
  {
    // Anchors + coupling-resolution language are pinned; benign in robust regime, tension only in grazing regime.
    id: 'imp35806-anchors-and-coupling-resolution',
    description: 'w(T_PT) ~ 13.446, gap ~ 0.2336, h_sat = 1/w; coupling BENIGN at the corner, tension only in the grazing regime',
    holds: () =>
      Math.abs(W_TPT - 13.446) < 5e-3 &&
      Math.abs(GAP_TPT - 0.2336) < 5e-4 &&
      Math.abs(W_TPT * GAP_TPT - Math.PI) < 1e-9 &&
      Math.abs(W_TPT * H_SAT - 1) < 1e-12 &&
      /I3-optimal knob .* and the I2-optimal knob .* COINCIDE/.test(
        IMP35806_I2_I3_COUPLED_PLACEMENT_DERIVATION.couplingResolution
      ) &&
      /GRAZING \/ pinned-endpoint regime/.test(IMP35806_I2_I3_COUPLED_PLACEMENT_DERIVATION.couplingResolution),
  },
  {
    // Honesty gate: derivation on OOM model only, no positivity, no cap, no delta>0, no QED, no refereed bound is changed.
    id: 'imp35806-honesty-gate-no-qed',
    description: 'OOM derivation only; certifies no cap; certifies no delta>0; establishes no positivity; changes no bound; NO QED; no refereed bound is changed',
    holds: () =>
      IMP35806_I2_I3_COUPLED_PLACEMENT_DERIVATION.isRigorous === false &&
      Math.abs(L_PT - 0.2) < 1e-15 &&
      /certifies no cap/.test(IMP35806_I2_I3_COUPLED_PLACEMENT_DERIVATION.verdict) &&
      /certifies no delta > 0/.test(IMP35806_I2_I3_COUPLED_PLACEMENT_DERIVATION.verdict) &&
      /establishes no positivity/.test(IMP35806_I2_I3_COUPLED_PLACEMENT_DERIVATION.verdict) &&
      /NO QED/.test(IMP35806_I2_I3_COUPLED_PLACEMENT_DERIVATION.verdict) &&
      /refereed bound is changed/i.test(IMP35806_I2_I3_COUPLED_PLACEMENT_DERIVATION.verdict),
  },
];

for (const a of IMP35806_I2_I3_COUPLED_PLACEMENT_DERIVATION_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-35806-i2-i3-coupled-placement-derivation assertion failed: ${a.id}`);
  }
}
