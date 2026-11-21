/**
 * @module imp-35799-i3-long-edge-derivative-floor-scope
 *
 * imp-35799 (proof/assessment, S-frontier): DERIVE the CERTIFIABLE STRUCTURE of a
 * rigorous lower bound on inf|H_t prime| along a LONG edge |y| = h of the rectangle
 * boundary dR, to replace the sup-B ORDER-OF-MAGNITUDE proxy imp-35778 used in the
 * long-edge floor delta_long ~ inf|H_t prime| . h. imp-35778 wrote delta_long with
 * B = sup|H_t prime| ~ |H_t| . w(T_PT) as an OOM stand-in, explicitly flagging that a
 * rigorous floor needs inf|H_t prime|, NOT the sup B. This module assesses WHAT that
 * rigorous lower bound requires and ties it to the SAME I1 A_t + B_t - C_t interval
 * enclosure (imp-35681 Part A), differentiated.
 *
 * ASSESSMENT / STRUCTURAL SCOPING ONLY. Establishes no positivity; certifies no
 * non-vanishing; lower-bounds no inf|H_t prime| numerically; evaluates no derivative on
 * any edge; fixes no Delta or h; positions no rectangle; changes no bound; no RH verdict,
 * NO QED. No refereed bound is changed.
 *
 * WHY THE sup-B PROXY CANNOT BE A FLOOR (upper vs lower bound are DUAL, not the same)
 * -----------------------------------------------------------------------------
 * The imp-35777 derivative scale B = sup|H_t prime| is obtained by the FORWARD triangle
 * inequality on the term-differentiated series: |H_t prime| = |A_t prime + B_t prime -
 * C_t prime| <= |A_t prime| + |B_t prime| + |C_t prime|, i.e. summing term magnitudes.
 * That OVER-counts, so B is a genuine UPPER bound -- exactly what ingredient I2 wants (a
 * ceiling on the per-panel argument increment). But an upper bound on |H_t prime| gives
 * ZERO information about its infimum: sup B can be main-term scale while inf|H_t prime|
 * dips to 0 at a critical point of the modulus. So delta_long ~ B . h is an OOM SCALING
 * placeholder, never a certified floor. A floor needs a bound in the OPPOSITE direction.
 *
 * THE CERTIFIABLE LOWER BOUND = a DIFFERENTIATED barrier margin (reverse triangle)
 * -----------------------------------------------------------------------------
 * The rigorous replacement is the REVERSE triangle inequality on the SAME A + B - C
 * splitting, now applied to the complex derivative (H_t is entire, so H_t prime is its
 * term-by-term z-derivative):
 *     |H_t prime(z)| = |(A_t prime + B_t prime)(z) - C_t prime(z)|
 *                    >= |A_t prime + B_t prime|(z) - |C_t prime|(z),
 * and the long-edge floor constant is the INFIMUM of this over the edge:
 *     inf|H_t prime| >= inf over the long edge of ( |A_t prime + B_t prime| - |C_t prime| ) =: M_prime.
 * This M_prime is the DERIVATIVE analogue of the I1/W1 barrier margin M = |A_t + B_t| -
 * |C_t| (imp-35725 / imp-35681 Part A): main-derivative magnitude MINUS error-derivative
 * magnitude, certifiable by the SAME interval-arithmetic machinery evaluated on the
 * differentiated retained sum (each of the ~4.886e5 retained terms is elementary, so its
 * z-derivative is closed-form -- differentiation brings down at most a log-frequency
 * factor bounded by log N = w - (1/2) log 2 ~ w). So the rigorous floor is
 * delta_long >= M_prime . h.
 *
 * SAME LEADING OOM AS THE PROXY, DIFFERENT DIRECTION (what the proxy got right)
 * -----------------------------------------------------------------------------
 * Term-by-term differentiation multiplies each coefficient by roughly its log-frequency
 * (<= log N ~ w), so BOTH the main-derivative and the error-derivative inherit the same
 * ~ w factor: |A_t prime + B_t prime| ~ w . |A_t + B_t| and |C_t prime| ~ w . |C_t| to
 * leading OOM. Hence M_prime ~ w . M, and delta_long >= M_prime . h ~ (w . M) . h -- the
 * SAME |H_t| . w . h OOM the sup-B proxy reported, but now as a certified LOWER bound
 * governed by inf M (the derivative barrier margin) instead of sup|H_t|. The proxy's
 * SCALING in h and in w was therefore correct; what it lacked -- a certified infimum -- is
 * supplied by M_prime, at the cost of a NEW differentiated enclosure and its own placement
 * condition (below), NOT for free from B.
 *
 * THE FLOOR INHERITS ITS OWN NON-GRAZING CONDITION (M_prime can collapse)
 * -----------------------------------------------------------------------------
 * M_prime is NOT uniformly positive: |A_t prime + B_t prime| has its own critical points
 * (the local minima of |H_t| along the edge), and near them the derivative margin can
 * collapse toward |C_t prime|, exactly analogous to how the short-edge floor delta_short
 * collapses when an endpoint grazes a real zero (imp-35778 short-edge caveat). So the
 * long-edge floor delta_long >= M_prime . h is certified positive only where the edge is
 * placed so that |A_t prime + B_t prime| stays bounded away from |C_t prime| -- a
 * non-grazing condition on the edge, the derivative-side counterpart of the short-edge
 * between-zeros placement. inf|H_t prime| is thus governed by the WORST point on the edge,
 * and a certified M_prime > 0 there is a genuinely OPEN requirement.
 *
 * WHAT THIS BUYS (over imp-35778) AND WHAT STAYS GREENFIELD
 * -----------------------------------------------------------------------------
 * It replaces the imp-35778 sup-B OOM stand-in with the CORRECT object -- a differentiated
 * barrier margin M_prime = inf(|A_t prime + B_t prime| - |C_t prime|) whose leading OOM
 * matches the proxy (~ w . M) -- and identifies the two open sub-gaps a certified floor
 * still needs: (SG-1) a differentiated A + B - C interval enclosure (the z-derivative of
 * the imp-35681 Part A retained sum, still GREENFIELD); (SG-2) a certified non-grazing /
 * edge-placement condition keeping |A_t prime + B_t prime| bounded away from |C_t prime|
 * at the worst edge point. It ADDS NO greenfield MECHANISM: the differentiated sum reuses
 * the SAME ~4.886e5-term structure and the SAME reverse-triangle architecture as I1, so I3
 * stays downstream of W1 exactly as imp-35727 gated it.
 *
 * WHAT THIS DOES NOT DO
 * -----------------------------------------------------------------------------
 * Assessment / structural scoping only. Builds no differentiated enclosure; evaluates no
 * A_t prime, B_t prime, C_t prime on any edge; produces no numeric M_prime; verifies no
 * M_prime > 0; certifies no non-vanishing; fixes no Delta or h; positions no rectangle;
 * establishes no positivity; changes no bound; C_mb GUE-conditional (imp-486) untouched;
 * no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-35778-i3-edge-type-floor-decomposition-scope (delta_long ~ inf|H_t prime| . h; sup-B proxy flagged)
 * @see imp-35777-i2-logderivative-panel-cap-scope (B = sup|H_t prime| ~ |H_t| . w; UPPER-bound direction, I2)
 * @see imp-35758-i3-modulus-floor-margin-tie-scope (I3 floor = margin - cap; monolithic min over dR)
 * @see imp-35727-w2-certified-winding-count-ingredients-scope (I3 named GREENFIELD)
 * @see imp-35725-w1-effective-error-cap-budget (barrier margin M = |A_t+B_t| - |C_t|; the object M_prime differentiates)
 * @see imp-35681-w1-w2-w4-existing-infra-inventory (Part A: A+B-C interval enclosure greenfield)
 * @see imp-35757-i2-panel-width-count-scope (mean zero gap delta(T_PT) ~ 0.2336; w = pi/gap)
 * @see Polymath15 2019 (effective approximation H_t = A + B - C; barrier method); Platt-Trudgian 2021
 */

// -- Anchor + operative constants (import-light; matching imp-35778 / imp-35777 / imp-35725) --
const T_PT = 3e12; // Platt-Trudgian 2021 verified height (external barrier base)
const L_PT = 0.2; // Platt-Trudgian 2021 bound; unchanged by this scoping
const N_AT_TPT = Math.floor(Math.sqrt(T_PT / (4 * Math.PI))); // ~488602 retained terms (imp-35674 Part D)

// Winding / derivative log-scale w(T) = (1/2) log(T / 2 pi) (imp-35757 / imp-35777).
const windingRate = (T) => 0.5 * Math.log(T / (2 * Math.PI));
const W_TPT = windingRate(T_PT); // ~13.446

// Mean zero gap delta(T) = 2 pi / log(T / 2 pi) = pi / w(T) (imp-35757).
const meanZeroGap = (T) => (2 * Math.PI) / Math.log(T / (2 * Math.PI));
const GAP_TPT = meanZeroGap(T_PT); // ~0.2336

// Log-frequency ceiling from term-by-term differentiation: each retained term picks up a
// factor <= log N = w - (1/2) log 2 ~ w (NOT a certified constant; the OOM ratio only).
const LOG_N_TPT = Math.log(N_AT_TPT); // ~13.10, ~ w scale (log N = w - (1/2)log 2)
// Illustrative OOM: M_prime ~ w . M carries the SAME w-scaling as B ~ |H_t| . w. With an
// O(1) main-term margin M and off-axis height h ~ 1/w the certified floor is O(1) -- the
// SAME OOM as the imp-35778 sup-B proxy, now as a LOWER bound.
const illustrativeMprime = (M, w) => w * M; // ~ |A_t prime + B_t prime| - |C_t prime| scaling
const ILLUSTRATIVE_M = 1; // O(1) main-term barrier margin M = |A_t+B_t| - |C_t|
const H_OFFAXIS = 1 / W_TPT; // ~0.0744, ~ (1/pi) of the mean gap (imp-35778)
const ILLUSTRATIVE_DELTA_LONG_LOWER = illustrativeMprime(ILLUSTRATIVE_M, W_TPT) * H_OFFAXIS; // ~1

export const IMP35799_I3_LONG_EDGE_DERIVATIVE_FLOOR_SCOPE = {
  id: 'imp-35799',
  proofSection: 'S-frontier',
  question:
    'Derive a rigorous, interval-arithmetic-certifiable lower bound on inf|H_t prime| along a LONG edge |y| = h of dR ' +
    'to replace the imp-35778 sup-B OOM proxy in delta_long ~ inf|H_t prime| . h, tied to the SAME I1 A_t + B_t - C_t ' +
    'enclosure (imp-35681 Part A). Assessment / structural scoping only; establishes no positivity; NO QED.',
  proxyIsUpperBound: {
    statement:
      'B = sup|H_t prime| comes from the FORWARD triangle inequality |H_t prime| <= |A_t prime| + |B_t prime| + ' +
      '|C_t prime| -- a genuine UPPER bound (what I2 wants), giving ZERO information about the infimum',
    consequence:
      'sup B can be main-term scale while inf|H_t prime| dips to 0 at a modulus critical point, so delta_long ~ B . h ' +
      'is an OOM SCALING placeholder, never a certified floor; a floor needs the OPPOSITE direction',
  },
  certifiableLowerBound: {
    reverseTriangle:
      '|H_t prime| = |(A_t prime + B_t prime) - C_t prime| >= |A_t prime + B_t prime| - |C_t prime| (reverse triangle ' +
      'on the SAME A + B - C splitting, H_t entire so H_t prime is the term-by-term z-derivative)',
    floorConstant:
      'M_prime := inf over the long edge of ( |A_t prime + B_t prime| - |C_t prime| ), the DERIVATIVE analogue of the ' +
      'imp-35725 barrier margin M = |A_t + B_t| - |C_t|; certified floor delta_long >= M_prime . h',
    sameLeadingOOM:
      'term-by-term differentiation multiplies each coefficient by <= log N ~ w, so |A_t prime + B_t prime| ~ w . ' +
      '|A_t + B_t| and |C_t prime| ~ w . |C_t|; hence M_prime ~ w . M and delta_long >= M_prime . h ~ (w . M) . h -- ' +
      'the SAME |H_t| . w . h OOM the proxy reported, now a LOWER bound governed by inf M not sup|H_t|',
  },
  nonGrazingCondition:
    'M_prime is NOT uniformly positive: |A_t prime + B_t prime| has its own critical points (local minima of |H_t| ' +
    'along the edge) where the derivative margin can collapse toward |C_t prime| -- the derivative-side counterpart of ' +
    'the imp-35778 short-edge between-zeros placement; inf|H_t prime| is governed by the WORST edge point and a ' +
    'certified M_prime > 0 there is OPEN',
  subGaps: {
    'SG-1':
      'a differentiated A + B - C interval enclosure (the z-derivative of the imp-35681 Part A retained sum) -- reuses ' +
      'the SAME ~4.886e5-term structure but is a NEW enclosure, still GREENFIELD',
    'SG-2':
      'a certified non-grazing / edge-placement condition keeping |A_t prime + B_t prime| bounded away from ' +
      '|C_t prime| at the worst edge point',
  },
  windingRateTPT: W_TPT,
  meanZeroGapTPT: GAP_TPT,
  logNTPT: LOG_N_TPT,
  illustrativeM: ILLUSTRATIVE_M,
  offAxisHeight: H_OFFAXIS,
  illustrativeDeltaLongLower: ILLUSTRATIVE_DELTA_LONG_LOWER,
  retainedTermsAtTPT: N_AT_TPT,
  isRigorous: false,
  verdict:
    'ASSESSMENT / STRUCTURAL SCOPING (frontier-direction, NOT rigorous). The imp-35778 long-edge floor delta_long ~ ' +
    'inf|H_t prime| . h used B = sup|H_t prime| ~ |H_t| . w as an OOM proxy, flagging that a rigorous floor needs ' +
    'inf|H_t prime| NOT the sup B. The correct object is a DIFFERENTIATED barrier margin: since B comes from the ' +
    'FORWARD triangle inequality it is an UPPER bound and carries NO infimum information, whereas |H_t prime| = ' +
    '|(A_t prime + B_t prime) - C_t prime| >= |A_t prime + B_t prime| - |C_t prime| gives, on taking the edge ' +
    'infimum, M_prime := inf(|A_t prime + B_t prime| - |C_t prime|), the z-derivative analogue of the imp-35725 / ' +
    'imp-35681 Part A margin M = |A_t + B_t| - |C_t|, certifiable by the SAME interval machinery on the differentiated ' +
    'retained sum (each term elementary; differentiation adds <= log N ~ w). Because differentiation multiplies each ' +
    'coefficient by ~ w, M_prime ~ w . M and delta_long >= M_prime . h ~ (w . M) . h -- the SAME |H_t| . w . h OOM the ' +
    'proxy reported, but now a certified LOWER bound governed by inf M not sup|H_t|: the proxy SCALING was right, only ' +
    'its DIRECTION wrong. M_prime is not uniformly positive -- it collapses at the modulus critical points on the edge ' +
    '(the derivative-side counterpart of the imp-35778 short-edge grazing caveat) -- so a certified floor still needs ' +
    '(SG-1) a differentiated A + B - C enclosure (z-derivative of imp-35681 Part A, GREENFIELD) and (SG-2) a ' +
    'non-grazing edge-placement condition. It ADDS NO greenfield MECHANISM: same ~4.886e5-term structure, same ' +
    'reverse-triangle architecture, I3 stays downstream of W1 (imp-35727). Builds no enclosure; evaluates no ' +
    'derivative; produces no numeric M_prime; verifies no M_prime > 0; certifies no non-vanishing; establishes no ' +
    'positivity; changes no bound; C_mb GUE-conditional (imp-486) untouched; no RH verdict, NO QED. No refereed bound is changed' +
    '.',
  citation:
    'imp-35778 (delta_long ~ inf|H_t prime| . h; sup-B proxy flagged); imp-35777 (B = sup|H_t prime| ~ |H_t| . w, ' +
    'UPPER bound); imp-35758 (I3 floor = margin - cap); imp-35727 (I3 GREENFIELD); imp-35725 (barrier margin M = ' +
    '|A_t+B_t| - |C_t|); imp-35681 Part A (A+B-C interval enclosure greenfield); imp-35674 Part D ' +
    '(N(x)=floor(sqrt(x/4 pi))); imp-35757 (mean zero gap ~0.2336; w = pi/gap); Polymath15 2019 (H_t = A + B - C, ' +
    'barrier method); Platt-Trudgian 2021.',
};

export const IMP35799_I3_LONG_EDGE_DERIVATIVE_FLOOR_SCOPE_ASSERTIONS = [
  {
    // The proxy B is an UPPER bound (forward triangle), so it carries no infimum information.
    id: 'imp35799-proxy-is-upper-bound',
    description: 'B = sup|H_t prime| is a FORWARD-triangle UPPER bound; gives ZERO information about inf|H_t prime|',
    holds: () =>
      /FORWARD triangle inequality/.test(IMP35799_I3_LONG_EDGE_DERIVATIVE_FLOOR_SCOPE.proxyIsUpperBound.statement) &&
      /UPPER bound/.test(IMP35799_I3_LONG_EDGE_DERIVATIVE_FLOOR_SCOPE.proxyIsUpperBound.statement) &&
      /ZERO information/.test(IMP35799_I3_LONG_EDGE_DERIVATIVE_FLOOR_SCOPE.proxyIsUpperBound.statement) &&
      /never a certified floor/.test(IMP35799_I3_LONG_EDGE_DERIVATIVE_FLOOR_SCOPE.proxyIsUpperBound.consequence),
  },
  {
    // The certifiable lower bound = a differentiated reverse-triangle barrier margin M_prime.
    id: 'imp35799-differentiated-barrier-margin',
    description: 'inf|H_t prime| >= M_prime = inf(|A_t prime+B_t prime| - |C_t prime|), the z-derivative analogue of M = |A_t+B_t|-|C_t|',
    holds: () =>
      /reverse triangle/.test(IMP35799_I3_LONG_EDGE_DERIVATIVE_FLOOR_SCOPE.certifiableLowerBound.reverseTriangle) &&
      /DERIVATIVE analogue/.test(IMP35799_I3_LONG_EDGE_DERIVATIVE_FLOOR_SCOPE.certifiableLowerBound.floorConstant) &&
      /delta_long >= M_prime \. h/.test(IMP35799_I3_LONG_EDGE_DERIVATIVE_FLOOR_SCOPE.certifiableLowerBound.floorConstant),
  },
  {
    // Same leading OOM as the proxy: M_prime ~ w . M, so the certified lower bound recovers |H_t| . w . h.
    id: 'imp35799-same-leading-oom',
    description: 'M_prime ~ w . M recovers the SAME |H_t| . w . h OOM as the sup-B proxy; w~13.446, log N = w-(1/2)log2, floor O(1) at h~1/w',
    holds: () => {
      const w = windingRate(3e12);
      return (
        Math.abs(w - 13.446) < 5e-3 &&
        Math.abs(W_TPT * GAP_TPT - Math.PI) < 1e-9 && // w = pi / gap identity
        // log N = w - (1/2) log 2 (log-frequency ceiling from differentiation), ~ w.
        // (N is FLOORED to an integer, so allow a few-ULP slack off the exact identity.)
        Math.abs(LOG_N_TPT - (W_TPT - 0.5 * Math.log(2))) < 1e-4 &&
        LOG_N_TPT > 0.9 * W_TPT && LOG_N_TPT < W_TPT &&
        // M_prime scales linearly with M and with w.
        Math.abs(illustrativeMprime(2 * ILLUSTRATIVE_M, w) - 2 * illustrativeMprime(ILLUSTRATIVE_M, w)) < 1e-12 &&
        // certified floor O(1) at h ~ 1/w with O(1) margin M -- SAME OOM as the imp-35778 proxy.
        Math.abs(ILLUSTRATIVE_DELTA_LONG_LOWER - 1) < 1e-9 &&
        /SAME .* OOM/.test(IMP35799_I3_LONG_EDGE_DERIVATIVE_FLOOR_SCOPE.certifiableLowerBound.sameLeadingOOM)
      );
    },
  },
  {
    // The floor is not uniform: two named open sub-gaps, adds NO greenfield mechanism, N anchored.
    id: 'imp35799-subgaps-no-new-mechanism',
    description: 'Non-grazing condition + SG-1 (differentiated enclosure) / SG-2 (edge placement); adds NO greenfield mechanism; N ~ 4.886e5',
    holds: () =>
      /NOT uniformly positive/.test(IMP35799_I3_LONG_EDGE_DERIVATIVE_FLOOR_SCOPE.nonGrazingCondition) &&
      /differentiated A \+ B - C interval enclosure/.test(IMP35799_I3_LONG_EDGE_DERIVATIVE_FLOOR_SCOPE.subGaps['SG-1']) &&
      /non-grazing/.test(IMP35799_I3_LONG_EDGE_DERIVATIVE_FLOOR_SCOPE.subGaps['SG-2']) &&
      /ADDS NO greenfield MECHANISM/.test(IMP35799_I3_LONG_EDGE_DERIVATIVE_FLOOR_SCOPE.verdict) &&
      N_AT_TPT === Math.floor(Math.sqrt(3e12 / (4 * Math.PI))) &&
      N_AT_TPT > 4.8e5 && N_AT_TPT < 4.9e5,
  },
  {
    // Honesty gate: assessment only, no positivity, no numeric floor, no QED, no refereed bound is changed.
    id: 'imp35799-honesty-gate-no-qed',
    description: 'Assessment only; establishes no positivity; produces no numeric M_prime; changes no bound; NO QED; no refereed bound is changed',
    holds: () =>
      IMP35799_I3_LONG_EDGE_DERIVATIVE_FLOOR_SCOPE.isRigorous === false &&
      Math.abs(L_PT - 0.2) < 1e-15 &&
      /establishes no positivity/.test(IMP35799_I3_LONG_EDGE_DERIVATIVE_FLOOR_SCOPE.verdict) &&
      /verifies no M_prime > 0/.test(IMP35799_I3_LONG_EDGE_DERIVATIVE_FLOOR_SCOPE.verdict) &&
      /NO QED/.test(IMP35799_I3_LONG_EDGE_DERIVATIVE_FLOOR_SCOPE.verdict) &&
      /refereed bound is changed/i.test(IMP35799_I3_LONG_EDGE_DERIVATIVE_FLOOR_SCOPE.verdict),
  },
];

for (const a of IMP35799_I3_LONG_EDGE_DERIVATIVE_FLOOR_SCOPE_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-35799-i3-long-edge-derivative-floor-scope assertion failed: ${a.id}`);
  }
}
