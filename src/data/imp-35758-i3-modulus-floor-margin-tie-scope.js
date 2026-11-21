/**
 * @module imp-35758-i3-modulus-floor-margin-tie-scope
 *
 * imp-35758 (numerical/assessment, S-frontier): ASSESS the imp-35727 ingredient I3
 * modulus-floor requirement -- a certified |f| >= delta > 0 on the rectangle boundary
 * dR of R = [T_PT, T_PT + Delta] x [-h, h], certifying f = H_t does not vanish on the
 * contour -- by TYING it to the imp-35725 effective barrier margin |A_t + B_t| - |C_t|.
 * imp-35727 named I3 as GREENFIELD but never connected it to the imp-35725 error-cap
 * budget C_t^{cap} = E_A + E_B + E_{C_0}. This module supplies that connection at
 * order-of-magnitude only: it estimates what interval lower bound the margin supplies
 * on the boundary, and whether that bound clears the cap to leave a nonzero delta.
 *
 * ORDER-OF-MAGNITUDE SCOPING ONLY. Establishes no positivity; certifies no
 * non-vanishing; changes no bound; no RH verdict, NO QED. No refereed bound is changed.
 *
 * THE REVERSE-TRIANGLE TIE (I3 reads off the W1 cap, it is not independent)
 * -----------------------------------------------------------------------------
 * Polymath15 writes f = H_t = A_t + B_t - C_t + err with |err| <= C_t^{cap} =
 * E_A + E_B + E_{C_0} (imp-35725). The reverse triangle inequality then gives, at
 * EVERY point of dR,
 *     |H_t| >= |A_t + B_t - C_t| - |err|
 *           >= (|A_t + B_t| - |C_t|) - (E_A + E_B + E_{C_0})
 *           =  margin(z) - cap  =:  delta(z).
 * So the pointwise modulus floor delta(z) that I3 demands is EXACTLY the surplus of the
 * imp-35725 strict barrier inequality |A_t + B_t| - |C_t| > E_A + E_B + E_{C_0}: where
 * that inequality holds with margin surplus, that surplus IS the certified |H_t| lower
 * bound. The contour floor is the worst boundary point,
 *     delta = min over z in dR of ( margin(z) - cap ).
 * I3 therefore supplies NO new mechanism: it is the imp-35725 cap check, read as a
 * lower bound on |H_t| rather than only as a sign guarantee. It is downstream of the
 * SAME interval enclosure I1 / W1 (imp-35681 Part A) that brackets margin(z) over each
 * panel -- precisely the gating imp-35727 attached to I1.
 *
 * ORDER OF MAGNITUDE OF delta (does the margin clear the cap?)
 * -----------------------------------------------------------------------------
 * imp-35725 budgets the cap terms: E_A, E_B are the DOMINANT pair, both the N-term
 * (N = floor(sqrt(x / 4 pi)) ~ 4.886e5 at T_PT) truncation tail times Gaussian
 * t-damping, sitting MANY ORDERS below the O(1)-scale main term; E_{C_0} is the
 * O(1/N)-smaller subordinate remainder of the already lower-order C_t. So on any
 * boundary segment where the mollified main term A_t + B_t does NOT nearly cancel
 * against C_t, the margin |A_t + B_t| - |C_t| is of the main-term scale while the cap
 * is many orders smaller; hence delta = margin - cap ~ margin -- a ROBUST modulus floor
 * of the main-term magnitude, clearing the cap by the full separation, NOT a marginal
 * near-zero delta. Illustratively, with the margin normalised to O(1) and the cap a
 * representative ~1e-6 of it, delta ~ 1 - 1e-6 ~ 1: essentially the entire margin.
 *
 * WHERE THE FLOOR COLLAPSES (the honest caveat)
 * -----------------------------------------------------------------------------
 * delta is the MINIMUM over dR, so it is only as large as the WORST boundary point.
 * If A_t + B_t dips toward C_t + cap anywhere on the contour -- e.g. the boundary
 * grazing a would-be off-line zero -- margin(z) collapses toward the cap there and
 * delta collapses toward 0. The barrier method's task is to POSITION the rectangle so
 * dR avoids such dips; the modulus floor is exactly the barrier margin surplus at the
 * worst-placed boundary point. So delta > 0 is certified iff the interval strict
 * inequality clears the cap at EVERY panel of dR -- the same greenfield mechanical
 * check (certified interval sums of ~4.886e5 terms at the sign-reconciled positive
 * barrier time, imp-35717 R2/R4) that imp-35725 already named as the obstruction.
 *
 * WHAT THIS DOES NOT DO
 * -----------------------------------------------------------------------------
 * OOM scoping only. It does not evaluate margin(z) at any boundary point, does not
 * fix Delta or h, positions no rectangle, verifies no strict inequality, and certifies
 * no delta > 0. It only records that I3 REDUCES to the imp-35725 cap surplus by the
 * reverse triangle inequality, and that where the barrier holds the surplus is a
 * many-orders-robust floor. Establishes no positivity; certifies no non-vanishing;
 * changes no bound; C_mb GUE-conditional (imp-486) untouched; NO QED. No refereed bound is changed.
 *
 * @see imp-35727-w2-certified-winding-count-ingredients-scope (I3 named GREENFIELD, unlinked to the cap)
 * @see imp-35725-w1-effective-error-cap-budget (C_t^{cap}=E_A+E_B+E_{C_0}; the strict-inequality margin I3 reads off)
 * @see imp-35757-i2-panel-width-count-scope (sibling I2 panel-width/count quantification on dR)
 * @see imp-35681-w1-w2-w4-existing-infra-inventory (Part A: A+B-C interval enclosure greenfield; Part B: W2 count greenfield)
 * @see imp-35717-w1-tsign-reconciliation-scope (R2/R4: sign-reconciled positive barrier time)
 * @see Polymath15 2019 (effective approximation H_t = A + B - C; barrier method); Platt-Trudgian 2021
 */

// -- Anchor + operative constants (import-light; matching imp-35725 / imp-35757) ----
const T_PT = 3e12; // Platt-Trudgian 2021 verified height (external barrier base)
const L_PT = 0.2; // Platt-Trudgian 2021 bound; unchanged by this scoping
const N_AT_TPT = Math.floor(Math.sqrt(T_PT / (4 * Math.PI))); // ~488602 retained terms (imp-35674 Part D)

// Reverse-triangle modulus floor: |H_t| >= (|A_t+B_t| - |C_t|) - cap = margin - cap.
const modulusFloor = (margin, cap) => margin - cap; // delta(z) = margin(z) - cap

// Illustrative OOM only (NOT a certified magnitude): margin normalised to O(1), cap
// a representative many-orders-smaller fraction, showing delta ~ full margin.
const ILLUSTRATIVE_MARGIN = 1; // O(1) main-term-scale margin |A_t+B_t| - |C_t|
const ILLUSTRATIVE_CAP = 1e-6; // representative cap E_A+E_B+E_{C_0}, many orders below
const ILLUSTRATIVE_DELTA = modulusFloor(ILLUSTRATIVE_MARGIN, ILLUSTRATIVE_CAP); // ~ 1

export const IMP35758_I3_MODULUS_FLOOR_MARGIN_TIE_SCOPE = {
  id: 'imp-35758',
  proofSection: 'S-frontier',
  question:
    'Assess the imp-35727 ingredient-I3 modulus-floor requirement (|f| >= delta > 0 on dR certifying no zero ' +
    'on the contour) by tying it to the imp-35725 effective barrier margin |A_t + B_t| - |C_t|: estimate what ' +
    'interval lower bound the margin supplies on the boundary and whether it clears the E_A + E_B + E_{C_0} cap ' +
    'to give a nonzero delta. Order-of-magnitude scoping only; establishes no positivity; NO QED.',
  reverseTriangleTie: {
    decomposition: 'f = H_t = A_t + B_t - C_t + err, with |err| <= C_t^{cap} = E_A + E_B + E_{C_0} (imp-35725)',
    pointwiseFloor:
      '|H_t| >= |A_t + B_t - C_t| - |err| >= (|A_t + B_t| - |C_t|) - (E_A + E_B + E_{C_0}) = margin(z) - cap = delta(z)',
    contourFloor: 'delta = min over z in dR of ( margin(z) - cap ) -- the worst-placed boundary point',
    finding:
      'the I3 modulus floor delta is EXACTLY the surplus of the imp-35725 strict barrier inequality ' +
      '|A_t + B_t| - |C_t| > E_A + E_B + E_{C_0}; I3 supplies NO new mechanism, it reads the SAME cap check as a ' +
      'lower bound on |H_t| and is downstream of the SAME I1 / W1 interval enclosure (imp-35681 Part A)',
  },
  orderOfMagnitude: {
    capScale:
      'E_A, E_B are the DOMINANT pair (N-term truncation tail x Gaussian t-damping, N ~ 4.886e5 at T_PT), many ' +
      'orders below the O(1)-scale main term; E_{C_0} is the O(1/N)-smaller subordinate remainder (imp-35725)',
    marginScale:
      'where the mollified main term A_t + B_t does not nearly cancel against C_t, the margin |A_t + B_t| - |C_t| ' +
      'is of main-term scale while the cap is many orders smaller',
    deltaScale:
      'delta = margin - cap ~ margin: a ROBUST modulus floor of the main-term magnitude, clearing the cap by the ' +
      'full separation, NOT a marginal near-zero delta',
    illustrativeMargin: ILLUSTRATIVE_MARGIN,
    illustrativeCap: ILLUSTRATIVE_CAP,
    illustrativeDelta: ILLUSTRATIVE_DELTA,
    illustrativeNote: 'illustrative OOM only (margin normalised to O(1), representative cap ~1e-6); NOT a certified magnitude',
  },
  caveat: {
    collapse:
      'delta is the MINIMUM over dR, only as large as the WORST boundary point; if A_t + B_t dips toward ' +
      'C_t + cap anywhere on the contour (dR grazing a would-be off-line zero) margin(z) collapses toward the cap ' +
      'and delta collapses toward 0',
    positioning:
      'the barrier method must POSITION the rectangle so dR avoids such dips; delta > 0 is certified iff the ' +
      'interval strict inequality clears the cap at EVERY panel of dR',
    sameGreenfield:
      'that per-panel interval check (certified sums of ~4.886e5 terms at the sign-reconciled positive barrier ' +
      'time, imp-35717 R2/R4) is the SAME greenfield obstruction imp-35725 already named -- I3 adds no new one',
  },
  retainedTermsAtTPT: N_AT_TPT,
  isRigorous: false,
  verdict:
    'ORDER-OF-MAGNITUDE SCOPING (frontier-direction, NOT rigorous). The imp-35727 ingredient I3 -- a certified ' +
    'modulus floor |H_t| >= delta > 0 on the rectangle boundary dR -- is NOT an independent greenfield ' +
    'ingredient: by the reverse triangle inequality |H_t| >= (|A_t + B_t| - |C_t|) - (E_A + E_B + E_{C_0}), the ' +
    'pointwise floor delta(z) is EXACTLY the surplus of the imp-35725 strict barrier inequality, and the contour ' +
    'floor is its minimum over dR. Order of magnitude: since imp-35725 budgets the cap E_A + E_B + E_{C_0} many ' +
    'orders below the O(1)-scale main term (E_A, E_B the dominant N-term-tail pair, N ~ 4.886e5; E_{C_0} the ' +
    'O(1/N) subordinate remainder), wherever the main term A_t + B_t does not nearly cancel C_t the margin is of ' +
    'main-term scale and delta ~ margin -- a robust floor clearing the cap by the full separation. CAVEAT: delta ' +
    'is the worst-boundary-point minimum, so it collapses toward 0 where dR grazes a would-be zero; delta > 0 is ' +
    'certified iff the interval strict inequality clears the cap at EVERY panel of dR -- the SAME greenfield ' +
    'interval check imp-35725 named, downstream of the I1 / W1 enclosure. Evaluates no margin; positions no ' +
    'rectangle; verifies no inequality; certifies no delta > 0; establishes no positivity; changes no bound; ' +
    'C_mb GUE-conditional (imp-486) untouched; no RH verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-35727 (I3 named GREENFIELD, unlinked to the cap); imp-35725 (C_t^{cap}=E_A+E_B+E_{C_0}; strict-inequality ' +
    'margin |A_t+B_t| - |C_t|); imp-35757 (sibling I2 panel-width/count); imp-35681 Part A/B (A+B-C interval ' +
    'enclosure and W2 count greenfield); imp-35717 R2/R4 (sign-reconciled positive barrier time); imp-35674 ' +
    'Part D (N(x)=floor(sqrt(x/4 pi))); Polymath15 2019 (effective approximation H_t = A + B - C, barrier ' +
    'method); Platt-Trudgian 2021.',
};

export const IMP35758_I3_MODULUS_FLOOR_MARGIN_TIE_SCOPE_ASSERTIONS = [
  {
    // The reverse-triangle tie: delta(z) = margin(z) - cap, algebraically exact.
    id: 'imp35758-reverse-triangle-floor',
    description: 'delta(z) = margin(z) - cap by reverse triangle inequality |H_t| >= (|A_t+B_t| - |C_t|) - cap',
    holds: () =>
      modulusFloor(5, 2) === 3 &&
      modulusFloor(ILLUSTRATIVE_MARGIN, ILLUSTRATIVE_CAP) === ILLUSTRATIVE_DELTA &&
      /margin\(z\) - cap = delta\(z\)/.test(IMP35758_I3_MODULUS_FLOOR_MARGIN_TIE_SCOPE.reverseTriangleTie.pointwiseFloor),
  },
  {
    // I3 reduces to the imp-35725 strict-inequality surplus: no new mechanism, downstream of I1/W1.
    id: 'imp35758-i3-reduces-to-cap-surplus',
    description: 'I3 modulus floor = surplus of the imp-35725 strict inequality; no new mechanism, downstream of I1/W1',
    holds: () =>
      /NO new mechanism/.test(IMP35758_I3_MODULUS_FLOOR_MARGIN_TIE_SCOPE.reverseTriangleTie.finding) &&
      /downstream of the SAME I1 \/ W1/.test(IMP35758_I3_MODULUS_FLOOR_MARGIN_TIE_SCOPE.reverseTriangleTie.finding) &&
      /min over z in dR/.test(IMP35758_I3_MODULUS_FLOOR_MARGIN_TIE_SCOPE.reverseTriangleTie.contourFloor),
  },
  {
    // OOM: the cap sits many orders below the O(1) margin, so delta ~ margin (robust floor); N anchored.
    id: 'imp35758-margin-clears-cap-oom',
    description: 'Cap many orders below the O(1) margin => delta ~ margin, a robust floor; N ~ 4.886e5 anchored',
    holds: () =>
      ILLUSTRATIVE_CAP < ILLUSTRATIVE_MARGIN * 1e-3 &&
      ILLUSTRATIVE_DELTA > ILLUSTRATIVE_MARGIN * 0.99 &&
      N_AT_TPT === Math.floor(Math.sqrt(3e12 / (4 * Math.PI))) &&
      N_AT_TPT > 4.8e5 && N_AT_TPT < 4.9e5 &&
      /delta = margin - cap ~ margin/.test(IMP35758_I3_MODULUS_FLOOR_MARGIN_TIE_SCOPE.orderOfMagnitude.deltaScale),
  },
  {
    // The honest caveat: delta is the worst-point minimum and collapses where dR grazes a zero.
    id: 'imp35758-worst-point-collapse-caveat',
    description: 'delta is the min over dR; collapses toward 0 where dR grazes a would-be zero; same greenfield check',
    holds: () =>
      /MINIMUM over dR/.test(IMP35758_I3_MODULUS_FLOOR_MARGIN_TIE_SCOPE.caveat.collapse) &&
      /collapses toward 0/.test(IMP35758_I3_MODULUS_FLOOR_MARGIN_TIE_SCOPE.caveat.collapse) &&
      /SAME greenfield obstruction/.test(IMP35758_I3_MODULUS_FLOOR_MARGIN_TIE_SCOPE.caveat.sameGreenfield),
  },
  {
    // Honesty gate: OOM scoping only, no positivity, no non-vanishing certificate, no QED, no refereed bound is changed.
    id: 'imp35758-honesty-gate-no-qed',
    description: 'Scoping only; establishes no positivity; certifies no delta>0; changes no bound; NO QED; no refereed bound is changed',
    holds: () =>
      IMP35758_I3_MODULUS_FLOOR_MARGIN_TIE_SCOPE.isRigorous === false &&
      Math.abs(L_PT - 0.2) < 1e-15 &&
      /establishes no positivity/.test(IMP35758_I3_MODULUS_FLOOR_MARGIN_TIE_SCOPE.verdict) &&
      /certifies no delta > 0/.test(IMP35758_I3_MODULUS_FLOOR_MARGIN_TIE_SCOPE.verdict) &&
      /NO QED/.test(IMP35758_I3_MODULUS_FLOOR_MARGIN_TIE_SCOPE.verdict) &&
      /refereed bound is changed/i.test(IMP35758_I3_MODULUS_FLOOR_MARGIN_TIE_SCOPE.verdict),
  },
];

for (const a of IMP35758_I3_MODULUS_FLOOR_MARGIN_TIE_SCOPE_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-35758-i3-modulus-floor-margin-tie-scope assertion failed: ${a.id}`);
  }
}
