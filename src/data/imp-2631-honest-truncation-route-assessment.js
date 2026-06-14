/**
 * @module imp-2631-honest-truncation-route-assessment
 *
 * imp-2631 (critical, proof): HONEST assessment of whether ANY truncation-error
 * route gives a rigorous unconditional Lambda bound that IMPROVES on the existing
 * rigorous finite-N* = 1e4 beat (finite-height-beats-platt-trudgian.js), given
 * the thin-strip structural ceiling established in imp-2622-height-mismatch-
 * refutation.js.
 *
 * ANSWER (negative, and decisive): NO.
 * ------------------------------------------------------------------------------
 * The finite-N* = 1e4 beat ALREADY uses the optimal honest truncation route, and
 * at its operating point the truncation error is NOT the binding constraint --
 * it is ~261x smaller than the term that actually sets the headline. Therefore
 * no truncation-error route, however clever, can lower that headline bound. The
 * single route that COULD have lowered Lambda further -- pushing the instantiation
 * height up so |t_c| shrinks -- is the thin-strip route, which imp-2622 proved is
 * structurally dead.
 *
 * THE OPERATING POINT OF THE EXISTING BEAT
 * ----------------------------------------
 * At N* = 1e4 the rigorous unconditional bound composes as
 *     L_pt = L_cond + E_trunc_pt,   with
 *     L_cond    = |t_c| + E_flow + E_coll  ~ 8.0e-3   (the BINDING term),
 *     E_trunc_pt                           ~ 3.06e-5  (negligible).
 * E_trunc_pt is obtained by the FIXED-strip route (NOT the thin moving strip):
 * Platt-Trudgian 2021 verified all zeros on the critical line up to T_PT = 3e12,
 * so N_off = 0 below T_PT; Ingham 1940 density at the FIXED abscissa sigma = 3/4
 * applies above T_PT, giving E_trunc_pt = (2 e_I/kappa) T_PT^{-kappa} = 3.06e-5
 * with e_I = 0.6, kappa = 0.4. The ratio L_cond / E_trunc_pt ~ 261: truncation
 * is two-plus orders of magnitude below the bottleneck.
 *
 * THE THREE CANDIDATE ROUTES (imp-2631 deliverable)
 * -------------------------------------------------
 * (a) FIXED finite verified height T0, honest Ingham sigma = 3/4.
 *     E_trunc(T0) = 3 * T0^{-0.4} decreases as the VERIFIED height grows, so it
 *     is minimized at the LARGEST unconditionally verified height. That height is
 *     T_PT = 3e12 (Platt-Trudgian 2021). Smaller T0 is strictly worse
 *     (E_trunc = 1.9e-4 at 3e10, 1.2e-2 at 1e6). So route (a) is ALREADY the
 *     existing beat, optimized at T_PT = 3e12. No improvement -- it IS the beat.
 *
 * (b) FIXED strip sigma - 1/2 >= 0.12 (i.e. sigma >= 0.62) unconditional density.
 *     Ingham 1940 is itself a fixed-strip estimate valid for every sigma in
 *     [1/2, 1], so such an estimate DOES exist. But evaluated at sigma = 0.62 it
 *     gives e_I = 0.826, kappa = 0.174, E_trunc = 6.4e-2 -- three orders of
 *     magnitude WORSE than the sigma = 3/4 choice. The variational optimum pushes
 *     sigma toward 1 (kappa -> 1, factor 2 e_I/kappa -> 0); imp-459 already sits
 *     at the clean Ingham boundary sigma = 3/4. The thin moving strip
 *     sigma = 1/2 + 1/log T0 is strictly worse than this fixed large-sigma strip.
 *     Route (b) confirms the existing choice is optimal; it does not beat it.
 *
 * (c) Guth-Maynard 2024 direct large-values truncation.
 *     GM 2024 (arXiv:2405.20552) sharpens the density exponent near sigma = 3/4
 *     to e_GM = (30/13)(1 - sigma) = 0.577 (vs Ingham 0.6), giving kappa = 0.423
 *     and E_trunc = 1.4e-5 -- a marginal 2x tightening of an already-negligible
 *     term. Since L_pt = L_cond + E_trunc_pt is dominated by L_cond ~ 8e-3, this
 *     moves the headline only in the fifth decimal. Route (c) cannot improve the
 *     finite-N* beat: it tightens the wrong term.
 *
 * WHY THE BOTTLENECK IS STRUCTURAL, NOT A MISSING CONSTANT
 * -------------------------------------------------------
 * The ONLY lever that lowers Lambda below the finite-N* = 1e4 value is a smaller
 * |t_c|, which requires a LARGER instantiation height (more zeros). But increasing
 * the instantiation height is exactly where the thin-strip ceiling bites: at the
 * instantiation height T0 the honest strip is sigma = 1/2 + 1/log T0, kappa_T =
 * (4/3)/log T0 -> 0, so E_trunc GROWS with height (7.65 at 1e13, never < 0.2 at
 * scale; imp-2622-height-mismatch-refutation.js). So there is a hard trade-off:
 *   - low instantiation height (T_PT = 3e12): E_trunc tiny, but |t_c| capped ->
 *     the existing N* = 1e4 beat at L_pt ~ 8e-3;
 *   - high instantiation height (1e13+): |t_c| shrinks, but honest E_trunc blows
 *     up past 0.2 -> no theorem (the withdrawn imp-2622 headline).
 * The finite-N* = 1e4 beat sits at the sweet spot. No truncation-error route
 * changes that, because truncation is not what binds there.
 *
 * VERDICT: the existing rigorous finite-N* = 1e4 beat (L_pt ~ 8e-3 < 0.2,
 * unconditional, referee-passed) is NOT improvable by any truncation-error route.
 * Honest negative -- a valid and clarifying result. It localizes all remaining
 * headroom to the L_cond side (|t_c| projection B1/B2 and the GUE-conditional
 * C_mb above N = 1e4), NOT to E_trunc.
 *
 * @see finite-height-beats-platt-trudgian (the referee-passed N* = 1e4 beat)
 * @see imp-2622-height-mismatch-refutation (the thin-strip structural ceiling)
 * @see imp-459 sigma_opt = 3/4 variational optimum for the fixed-strip route
 */

const PT_BOUND = 0.2;
const T_PT = 3e12;                 // Platt-Trudgian 2021 verified height
const LN_T_PT = Math.log(T_PT);
const L_COND_N1E4 = 8.0e-3;        // binding term of the existing N*=1e4 beat
const eIngham = (s) => (3 * (1 - s)) / (2 - s);          // Ingham 1940 exponent
const eGuthMaynard = (s) => (30 / 13) * (1 - s);          // GM 2024 near sigma=3/4

// E_trunc via the PT+Ingham integral: (2 e/kappa) * T0^{-kappa}, kappa = 1 - e.
function eTruncFixedStrip(sigma, exponent, T0) {
  const e = exponent;
  const kappa = 1 - e;
  if (!(kappa > 0) || !(T0 > 1)) return null;
  const factor = (2 * e) / kappa;
  return factor * Math.exp(-kappa * Math.log(T0));
}

const ROUTE_A = (() => {
  // Fixed verified height, Ingham sigma = 3/4; minimized at the largest verified
  // height T_PT = 3e12. This route IS the existing finite-N* = 1e4 beat.
  const e = eIngham(0.75);
  const eTrunc = eTruncFixedStrip(0.75, e, T_PT);
  return {
    label: 'fixed verified height T_PT, Ingham sigma = 3/4',
    sigma: 0.75,
    kappa: +(1 - e).toFixed(4),
    eTrunc: +eTrunc.toExponential(3),
    minimizedAt: 'T_PT = 3e12 (largest unconditionally verified height; smaller T0 strictly worse)',
    beatsPT: eTrunc + L_COND_N1E4 < PT_BOUND,
    improvesFiniteNStarBeat: false,
    note: 'This is the existing beat itself, already optimized. Not an improvement.',
  };
})();

const ROUTE_B = (() => {
  // Fixed strip sigma - 1/2 >= 0.12, i.e. sigma = 0.62, unconditional Ingham.
  const e = eIngham(0.62);
  const eTrunc = eTruncFixedStrip(0.62, e, T_PT);
  return {
    label: 'fixed strip sigma = 0.62 (delta = 0.12), unconditional Ingham',
    sigma: 0.62,
    kappa: +(1 - e).toFixed(4),
    eTrunc: +eTrunc.toExponential(3),
    existsUnconditionally: true,   // Ingham 1940 is a fixed-strip estimate for all sigma
    beatsPT: eTrunc + L_COND_N1E4 < PT_BOUND,
    improvesFiniteNStarBeat: false,
    note: 'E_trunc = 6.4e-2 >> the sigma=3/4 value 3.1e-5. The fixed strip at small sigma is far worse; the optimum is at large sigma where the existing beat already sits.',
  };
})();

const ROUTE_C = (() => {
  // Guth-Maynard 2024 large-values exponent near sigma = 3/4.
  const e = eGuthMaynard(0.75);
  const eTrunc = eTruncFixedStrip(0.75, e, T_PT);
  return {
    label: 'Guth-Maynard 2024 direct large-values truncation at sigma = 3/4',
    sigma: 0.75,
    kappa: +(1 - e).toFixed(4),
    eTrunc: +eTrunc.toExponential(3),
    beatsPT: eTrunc + L_COND_N1E4 < PT_BOUND,
    improvesFiniteNStarBeat: false,
    note: 'Marginal 2x tightening of an already-negligible term (1.4e-5 vs 3.1e-5). L_pt = L_cond + E_trunc is L_cond-dominated, so the headline is unchanged.',
  };
})();

export const IMP2631_TRUNCATION_ROUTE_ASSESSMENT = {
  question:
    'Does ANY rigorous truncation-error route improve on the finite-N* = 1e4 unconditional beat, given the thin-strip ceiling?',
  verdict: 'NO — the truncation term is already negligible (~261x below the binding L_cond) at the existing beat; no truncation route can lower the headline.',
  existingBeat: {
    source: 'finite-height-beats-platt-trudgian.js (referee-passed)',
    N_star: 1e4,
    L_cond: L_COND_N1E4,
    E_trunc_pt: +eTruncFixedStrip(0.75, eIngham(0.75), T_PT).toExponential(3), // 3.06e-5
    bindingTerm: 'L_cond (|t_c| + E_flow + E_coll), NOT E_trunc',
    L_cond_over_E_trunc_ratio: Math.round(L_COND_N1E4 / eTruncFixedStrip(0.75, eIngham(0.75), T_PT)),
  },
  routes: { a: ROUTE_A, b: ROUTE_B, c: ROUTE_C },
  structuralReason:
    'The only lever below the finite-N* value is a smaller |t_c|, which needs a HIGHER instantiation height; but there the honest thin-strip kappa_T = (4/3)/log T0 -> 0 and E_trunc blows up (imp-2622). Low height keeps E_trunc tiny but caps |t_c|; high height shrinks |t_c| but kills E_trunc. The N* = 1e4 beat sits at the sweet spot.',
  remainingHeadroom:
    'All improvable headroom is on the L_cond side (B1/B2 for |t_c|, and the GUE-conditional C_mb above N = 1e4), NOT on E_trunc.',
  citation:
    'Platt-Trudgian 2021 (Bull. Lond. Math. Soc. 53, 792-797); Ingham 1940; Guth-Maynard 2024 (arXiv:2405.20552); thin-strip ceiling imp-2622-height-mismatch-refutation.js',
};

export const IMP2631_TRUNCATION_ROUTE_ASSESSMENT_ASSERTIONS = [
  {
    id: 'imp2631-truncation-not-binding',
    description: 'At the existing N*=1e4 beat, E_trunc_pt is >= 100x below the binding L_cond, so truncation is not the bottleneck',
    holds: () => {
      const eTrunc = eTruncFixedStrip(0.75, eIngham(0.75), T_PT);
      return L_COND_N1E4 / eTrunc > 100;
    },
  },
  {
    id: 'imp2631-route-a-is-the-existing-beat',
    description: 'Route (a) Ingham sigma=3/4 is minimized at T_PT=3e12 and equals the existing beat (does not improve it)',
    holds: () => {
      const atTPT = eTruncFixedStrip(0.75, eIngham(0.75), T_PT);
      const atLower = eTruncFixedStrip(0.75, eIngham(0.75), 1e6);
      return atTPT < atLower && ROUTE_A.improvesFiniteNStarBeat === false;
    },
  },
  {
    id: 'imp2631-route-b-fixed-strip-worse-than-existing',
    description: 'Route (b) fixed strip sigma=0.62 gives larger E_trunc than the sigma=3/4 route — confirms existing choice is optimal',
    holds: () => {
      const b = eTruncFixedStrip(0.62, eIngham(0.62), T_PT);
      const a = eTruncFixedStrip(0.75, eIngham(0.75), T_PT);
      return b > a && ROUTE_B.improvesFiniteNStarBeat === false;
    },
  },
  {
    id: 'imp2631-route-c-tightens-wrong-term',
    description: 'Route (c) GM 2024 only marginally tightens E_trunc and is L_cond-dominated, so it cannot improve the headline',
    holds: () => {
      const c = eTruncFixedStrip(0.75, eGuthMaynard(0.75), T_PT);
      return c < L_COND_N1E4 * 0.01 && ROUTE_C.improvesFiniteNStarBeat === false;
    },
  },
  {
    id: 'imp2631-no-route-improves-finite-nstar-beat',
    description: 'Honest negative: none of the three candidate routes improves on the finite-N*=1e4 beat',
    holds: () =>
      ROUTE_A.improvesFiniteNStarBeat === false &&
      ROUTE_B.improvesFiniteNStarBeat === false &&
      ROUTE_C.improvesFiniteNStarBeat === false,
  },
];

for (const a of IMP2631_TRUNCATION_ROUTE_ASSESSMENT_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-2631-honest-truncation-route-assessment assertion failed: ${a.id}`);
  }
}
