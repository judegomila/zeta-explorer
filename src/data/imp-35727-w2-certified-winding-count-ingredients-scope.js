/**
 * @module imp-35727-w2-certified-winding-count-ingredients-scope
 *
 * imp-35727 (proof/assessment, S-frontier): ENUMERATE the ingredients that a
 * rigorous, interval-arithmetic-CERTIFIED winding (argument-principle) zero count
 * on the boundary of the transition rectangle R = [T_PT, T_PT + Delta] x [-h, h]
 * requires BEYOND the held-but-EXPERIMENTAL winding scaffolding the repo already
 * carries (imp-2696 winding-Lyapunov, imp-33923 off-axis phase-winding quadrature,
 * imp-33968 winding-rate-vs-alpha). This is the imp-35681 Part B graded-W2
 * greenfield gap: the CONCEPT and experimental code are held, the certified
 * rectangle-boundary integer count is greenfield.
 *
 * ASSESSMENT / SCOPING ONLY. Ports nothing; certifies nothing; counts no zeros;
 * changes no bound; no RH verdict, NO QED. No refereed bound is changed.
 *
 * WHY A WINDING COUNT AT ALL (the B1 obligation)
 * -----------------------------------------------------------------------------
 * The Polymath15 barrier route needs to certify that the effective approximation
 * H_t = A + B - C (imp-35681 Part A, imp-35725) has EXACTLY the expected number of
 * zeros inside each transition rectangle R astride the critical line at height
 * T_PT = 3e12, all ON the line. The argument principle turns that into a contour
 * integral: the number of zeros of an analytic f inside R equals
 *     N = (1 / 2 pi) * (total change of arg f as the boundary dR is traversed once).
 * A rigorous count reads that total argument change with CERTIFIED (interval)
 * error small enough to pin the integer N. That certified read is W2.
 *
 * WHAT THE REPO ALREADY HOLDS (all isRigorous:false MEASUREMENTS)
 * -----------------------------------------------------------------------------
 *   imp-2696  -- winding of arg H_tau along the critical line read TWO ways
 *                (sign-change count W_arg and phase-plane unwrapped angle W_pp),
 *                N = 6000 double-precision SAMPLES on a fixed window; a Lyapunov
 *                monotonicity experiment, not a boundary count.
 *   imp-33923 -- off-axis leading-amplitude phase arg(-A(theta)) read from a
 *                complex Simpson QUADRATURE, winding slope by least-squares over a
 *                theta sweep; on the model cusp rho = |x|^{-1/2}, not H_t.
 *   imp-33968 -- winding-rate-vs-alpha curve, same scale-free quadrature, slope
 *                extracted by least-squares fit across an alpha grid.
 * COMMON SHAPE: point-sample the phase on a grid, UNWRAP it, and read a slope /
 * count by least-squares or sign-change tally in double precision. None brackets
 * the phase BETWEEN samples; none lower-bounds |f| off zero on a contour; none
 * closes the read to a certified integer. They establish that the winding is
 * well-defined and behaves as expected -- the qualitative scaffolding -- but carry
 * no interval guarantee. Every one is isRigorous:false.
 *
 * THE CERTIFIED-COUNT INGREDIENT LEDGER (what W2 needs that the above lack)
 * -----------------------------------------------------------------------------
 * I1  INTERVAL ENCLOSURE OF f ALONG EACH EDGE (not node sampling). A validated
 *     interval extension of f = H_t = A + B - C that BRACKETS the true value over
 *     each whole sub-segment of dR, carrying certified truncation + rounding error.
 *     Downstream of the imp-35725 effective-error cap C_t and the imp-35681 Part A
 *     interval-bounded A + B - C evaluator: W2 is GATED on that greenfield W1
 *     evaluator. The experimental modules sample at nodes in double precision --
 *     no between-node enclosure. GREENFIELD.
 * I2  PER-SEGMENT ARGUMENT-INCREMENT CAP (the winding-per-panel bound). To recover
 *     the total argument change from finitely many sub-segments, each sub-segment
 *     must be CERTIFIED to turn f by less than a half-plane, |Delta arg f| < pi over
 *     the panel (equivalently: f stays inside an open half-plane / fixed sector on
 *     the panel, e.g. via an interval bound on f or on |f prime| / |f| times panel
 *     length). This is the guarantee the experimental UNWRAP silently ASSUMES: it
 *     presumes the grid is fine enough that the phase cannot jump by >= pi between
 *     samples, but never certifies it. GREENFIELD.
 * I3  NON-VANISHING ON THE BOUNDARY (f != 0 on dR). The argument principle demands
 *     f has NO zero on the contour itself. Certified as an interval lower bound
 *     |f| >= delta > 0 on every boundary segment (the same enclosure I1 must also
 *     deliver a modulus floor, not just a phase). The experimental code tracks the
 *     phase but never lower-bounds |f| away from zero on the contour. GREENFIELD.
 * I4  CLOSURE TO AN INTEGER. Sum the certified per-segment increments around the
 *     closed dR; the accumulated INTERVAL error on the total argument change must be
 *     < pi (strictly, < 2 pi) so N = total / (2 pi) rounds to a UNIQUE integer. The
 *     experimental unwrap returns a non-integer real (W_pp = 6.413, slope = -3/2)
 *     that a human interprets; a certified count needs the error budget to pin N
 *     with no interpretation. GREENFIELD.
 * I5  CORNER CONTINUITY. The phase must be tracked continuously across the four
 *     rectangle corners so the four edge increments compose into one closed-loop
 *     total (the enclosures on adjacent edges must overlap at each shared corner).
 *     The experimental single-window / single-axis sweeps never traverse a closed
 *     rectangle, so corner composition is untested. GREENFIELD.
 *
 * NET VERDICT
 * -----------------------------------------------------------------------------
 * The repo holds the winding CONCEPT and qualitative experimental code (imp-2696 /
 * imp-33923 / imp-33968), all isRigorous:false point-sampled double-precision
 * measurements. A certified B1 count on dR needs FIVE ingredients none of them
 * supply: (I1) between-node interval ENCLOSURE of H_t along each edge, gated on the
 * greenfield imp-35681 Part A / imp-35725 A + B - C interval evaluator; (I2) a
 * certified per-panel argument-increment cap |Delta arg| < pi; (I3) a modulus floor
 * |f| >= delta > 0 certifying f != 0 on dR; (I4) closure of the accumulated
 * increment to a UNIQUE integer within a < pi error budget; (I5) continuous corner
 * composition around the closed loop. All five are GREENFIELD; the held scaffolding
 * reduces none of them. Assessment only; ports nothing; changes no bound; NO QED.
 *
 * @see imp-2696-winding-lyapunov-experiment (arg H_tau winding, sampled, isRigorous:false)
 * @see imp-33923-off-axis-phase-winding-quadrature (quadrature phase winding, model cusp)
 * @see imp-33968-winding-rate-vs-alpha-curve (least-squares winding slope vs alpha)
 * @see imp-35681-w1-w2-w4-existing-infra-inventory (Part B graded W2: experimental code held, certified count greenfield)
 * @see imp-35725-w1-effective-error-cap-budget (C_t = E_A + E_B + E_C0; the enclosure error I1/I3 rest on)
 * @see imp-35726-w1-sign-reconciliation-cost-scope (sibling W1 scoping module)
 * @see imp-35757-i2-panel-width-count-scope (I2 downstream quantification: mean winding rate, counts flagged LOWER bounds)
 * @see imp-35758-i3-modulus-floor-margin-tie-scope (I3 downstream quantification: floor tied to the imp-35725 margin surplus)
 * @see imp-35777-i2-logderivative-panel-cap-scope (I2 downstream quantification: log-derivative panel cap)
 * @see imp-35778-i3-edge-type-floor-decomposition-scope (I3 downstream quantification: short/long edge-type floor split)
 * @see Polymath15 2019 (effective approximation H_t = A + B - C; barrier method); Platt-Trudgian 2021
 */

// -- Anchor + operative constants (import-light; matching imp-35726 / imp-35725) --
const T_PT = 3e12; // Platt-Trudgian 2021 verified height (external barrier base)
const L_PT = 0.2; // Platt-Trudgian 2021 bound; unchanged by this scoping
const HALF_TURN = Math.PI; // per-panel argument-increment cap threshold (I2)
const CLOSURE_BUDGET = Math.PI; // accumulated argument error must stay under this to pin N (I4)

export const IMP35727_W2_CERTIFIED_WINDING_COUNT_INGREDIENTS_SCOPE = {
  id: 'imp-35727',
  proofSection: 'S-frontier',
  question:
    'Enumerate the per-segment argument-increment cap ingredients a rigorous interval-arithmetic-CERTIFIED ' +
    'winding (argument-principle) zero count on the boundary of R = [T_PT, T_PT + Delta] x [-h, h] requires ' +
    'beyond the held-but-EXPERIMENTAL winding scaffolding (imp-2696 / imp-33923 / imp-33968) -- the ' +
    'imp-35681 Part B graded W2 greenfield gap. Assessment/scoping only; ports nothing; changes no bound; NO QED.',
  argumentPrinciple:
    'N = (1 / 2 pi) * (total change of arg f as the rectangle boundary dR is traversed once); a rigorous ' +
    'count reads that total argument change with certified (interval) error small enough to pin the integer N.',
  heldExperimentalScaffolding: {
    imp2696:
      'imp-2696 winding-Lyapunov: arg H_tau along the critical line read two ways (sign-change count W_arg and ' +
      'phase-plane unwrapped angle W_pp) from N = 6000 double-precision SAMPLES on a fixed window; a ' +
      'monotonicity experiment, isRigorous:false, NOT a boundary count.',
    imp33923:
      'imp-33923 off-axis phase-winding quadrature: leading-amplitude phase arg(-A(theta)) read from a complex ' +
      'Simpson QUADRATURE, winding slope by least-squares over a theta sweep, on the model cusp rho = ' +
      '|x|^{-1/2}, isRigorous:false.',
    imp33968:
      'imp-33968 winding-rate-vs-alpha: winding slope extracted by least-squares fit across an alpha grid from ' +
      'the same scale-free quadrature, isRigorous:false.',
    commonShape:
      'All three point-sample the phase on a grid, UNWRAP it, and read a slope/count by least-squares or ' +
      'sign-change tally in double precision. None brackets the phase BETWEEN samples, lower-bounds |f| off ' +
      'zero on a contour, or closes the read to a certified integer. Qualitative scaffolding, no interval guarantee.',
  },
  certifiedCountIngredients: {
    I1_intervalEnclosurePerEdge:
      'A validated interval extension of f = H_t = A + B - C that BRACKETS the true value over each whole ' +
      'sub-segment of dR, carrying certified truncation + rounding error. GATED on the imp-35725 effective-error ' +
      'cap C_t and the imp-35681 Part A interval-bounded A + B - C evaluator (greenfield W1). The experimental ' +
      'modules sample at nodes in double precision -- no between-node enclosure. GREENFIELD.',
    I2_perSegmentArgumentIncrementCap:
      'Each sub-segment CERTIFIED to turn f by less than a half-plane, |Delta arg f| < pi over the panel ' +
      '(f stays inside an open half-plane / fixed sector; e.g. an interval bound on f or on |f prime| / |f| ' +
      'times panel length). This is exactly the guarantee the experimental UNWRAP silently ASSUMES -- that the ' +
      'grid is fine enough the phase cannot jump by >= pi between samples -- but never certifies. GREENFIELD.',
    I3_nonVanishingOnBoundary:
      'An interval lower bound |f| >= delta > 0 on every boundary segment, certifying f != 0 on dR (required ' +
      'for the argument principle). The enclosure I1 must also deliver a modulus FLOOR, not just a phase. The ' +
      'experimental code tracks the phase but never lower-bounds |f| away from zero on the contour. GREENFIELD.',
    I4_closureToInteger:
      'Sum the certified per-segment increments around the closed dR; the accumulated INTERVAL error on the ' +
      'total argument change must be < pi (strictly < 2 pi) so N = total / (2 pi) rounds to a UNIQUE integer. ' +
      'The experimental unwrap returns a non-integer real (W_pp = 6.413, slope = -3/2) a human interprets; a ' +
      'certified count needs the error budget to pin N with no interpretation. GREENFIELD.',
    I5_cornerContinuity:
      'The phase must be tracked continuously across the four rectangle corners so the four edge increments ' +
      'compose into one closed-loop total (adjacent-edge enclosures must overlap at each shared corner). The ' +
      'experimental single-window / single-axis sweeps never traverse a closed rectangle, so corner ' +
      'composition is untested. GREENFIELD.',
  },
  perSegmentCapThreshold: HALF_TURN,
  closureErrorBudget: CLOSURE_BUDGET,
  ingredientCount: 5,
  greenfieldIngredientCount: 5,
  isRigorous: false,
  verdict:
    'ASSESSMENT / SCOPING (frontier-direction, NOT rigorous). The repo holds the winding CONCEPT and ' +
    'qualitative experimental code (imp-2696 / imp-33923 / imp-33968), all isRigorous:false point-sampled ' +
    'double-precision MEASUREMENTS that unwrap a sampled phase and read a slope/count. A certified B1 ' +
    'argument-principle count on the transition-rectangle boundary dR = [T_PT, T_PT + Delta] x [-h, h] needs ' +
    'FIVE ingredients none of them supply: (I1) between-node interval ENCLOSURE of H_t = A + B - C along each ' +
    'edge, GATED on the greenfield imp-35681 Part A / imp-35725 interval evaluator (so W2 is downstream of W1); ' +
    '(I2) a certified per-panel argument-increment cap |Delta arg f| < pi -- the guarantee the experimental ' +
    'unwrap silently assumes; (I3) a modulus floor |f| >= delta > 0 certifying f != 0 on dR; (I4) closure of ' +
    'the accumulated increment to a UNIQUE integer within a < pi error budget; (I5) continuous corner ' +
    'composition around the closed loop. All five are GREENFIELD; the held scaffolding reduces none of them. ' +
    'Ports nothing; certifies nothing; counts no zeros; changes no bound; no RH verdict, NO QED. ' +
    'No refereed bound is changed.',
  citation:
    'imp-2696 (winding-Lyapunov, arg H_tau sampled, isRigorous:false); imp-33923 (off-axis phase-winding ' +
    'quadrature, model cusp); imp-33968 (winding-rate-vs-alpha least-squares slope); imp-35681 Part B ' +
    '(graded W2: experimental code held, certified count greenfield) and Part A (interval-bounded A + B - C); ' +
    'imp-35725 (effective-error cap C_t = E_A + E_B + E_C0); imp-35726 (sibling W1 scoping); imp-35757/imp-35777 ' +
    '(I2 downstream quantification); imp-35758/imp-35778 (I3 downstream quantification); Polymath15 2019 ' +
    '(effective approximation H_t = A + B - C; barrier method); Platt-Trudgian 2021.',
};

export const IMP35727_W2_CERTIFIED_WINDING_COUNT_INGREDIENTS_SCOPE_ASSERTIONS = [
  {
    // Held scaffolding is enumerated and correctly flagged as experimental (all isRigorous:false).
    id: 'imp35727-held-scaffolding-experimental',
    description: 'imp-2696 / imp-33923 / imp-33968 held as isRigorous:false point-sampled winding MEASUREMENTS',
    holds: () =>
      /isRigorous:false/.test(IMP35727_W2_CERTIFIED_WINDING_COUNT_INGREDIENTS_SCOPE.heldExperimentalScaffolding.imp2696) &&
      /isRigorous:false/.test(IMP35727_W2_CERTIFIED_WINDING_COUNT_INGREDIENTS_SCOPE.heldExperimentalScaffolding.imp33923) &&
      /isRigorous:false/.test(IMP35727_W2_CERTIFIED_WINDING_COUNT_INGREDIENTS_SCOPE.heldExperimentalScaffolding.imp33968) &&
      /point-sample/.test(IMP35727_W2_CERTIFIED_WINDING_COUNT_INGREDIENTS_SCOPE.heldExperimentalScaffolding.commonShape),
  },
  {
    // Exactly five certified-count ingredients enumerated, every one GREENFIELD.
    id: 'imp35727-five-greenfield-ingredients',
    description: 'Five certified-count ingredients I1-I5 enumerated, all GREENFIELD',
    holds: () => {
      const ing = IMP35727_W2_CERTIFIED_WINDING_COUNT_INGREDIENTS_SCOPE.certifiedCountIngredients;
      const vals = Object.values(ing);
      return (
        vals.length === 5 &&
        IMP35727_W2_CERTIFIED_WINDING_COUNT_INGREDIENTS_SCOPE.ingredientCount === 5 &&
        IMP35727_W2_CERTIFIED_WINDING_COUNT_INGREDIENTS_SCOPE.greenfieldIngredientCount === 5 &&
        vals.every((v) => /GREENFIELD/.test(v))
      );
    },
  },
  {
    // I2 (the per-segment cap the ticket names) + I4: half-turn threshold and integer-closure budget are pi.
    id: 'imp35727-cap-and-closure-thresholds',
    description: 'Per-panel argument cap |Delta arg| < pi (I2) and integer-closure error budget < pi (I4)',
    holds: () =>
      /\|Delta arg f\| < pi/.test(IMP35727_W2_CERTIFIED_WINDING_COUNT_INGREDIENTS_SCOPE.certifiedCountIngredients.I2_perSegmentArgumentIncrementCap) &&
      /UNIQUE integer/.test(IMP35727_W2_CERTIFIED_WINDING_COUNT_INGREDIENTS_SCOPE.certifiedCountIngredients.I4_closureToInteger) &&
      Math.abs(IMP35727_W2_CERTIFIED_WINDING_COUNT_INGREDIENTS_SCOPE.perSegmentCapThreshold - Math.PI) < 1e-15 &&
      Math.abs(IMP35727_W2_CERTIFIED_WINDING_COUNT_INGREDIENTS_SCOPE.closureErrorBudget - Math.PI) < 1e-15,
  },
  {
    // I1 gating: W2 enclosure is downstream of the greenfield imp-35681 Part A / imp-35725 A+B-C evaluator (W1).
    id: 'imp35727-w2-gated-on-w1-evaluator',
    description: 'I1 interval enclosure of H_t = A + B - C is GATED on the greenfield imp-35681 Part A / imp-35725 evaluator',
    holds: () =>
      /GATED on the imp-35725/.test(IMP35727_W2_CERTIFIED_WINDING_COUNT_INGREDIENTS_SCOPE.certifiedCountIngredients.I1_intervalEnclosurePerEdge) &&
      /A \+ B - C/.test(IMP35727_W2_CERTIFIED_WINDING_COUNT_INGREDIENTS_SCOPE.certifiedCountIngredients.I1_intervalEnclosurePerEdge),
  },
  {
    // Honesty gate: scoping only, no discharge, no QED, no refereed bound is changed.
    id: 'imp35727-honesty-gate-no-qed',
    description: 'Scoping only; ports nothing; certifies nothing; changes no bound; NO QED; no refereed bound is changed',
    holds: () =>
      IMP35727_W2_CERTIFIED_WINDING_COUNT_INGREDIENTS_SCOPE.isRigorous === false &&
      Math.abs(L_PT - 0.2) < 1e-15 &&
      T_PT === 3e12 &&
      /certifies nothing/.test(IMP35727_W2_CERTIFIED_WINDING_COUNT_INGREDIENTS_SCOPE.verdict) &&
      /NO QED/.test(IMP35727_W2_CERTIFIED_WINDING_COUNT_INGREDIENTS_SCOPE.verdict) &&
      /refereed bound is changed/i.test(IMP35727_W2_CERTIFIED_WINDING_COUNT_INGREDIENTS_SCOPE.verdict),
  },
];

for (const a of IMP35727_W2_CERTIFIED_WINDING_COUNT_INGREDIENTS_SCOPE_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-35727-w2-certified-winding-count-ingredients-scope assertion failed: ${a.id}`);
  }
}
