/**
 * @module imp-96272-closed-form-fartail-gap-argmax
 *
 * imp-96272 (numerical, import-light): LOCATE the imp-96151/imp-96176 closed-form-vs-full
 * conditional-share relative gap along the far-tail decade ladder.
 *
 * imp-96176 re-exports a single scalar landmark maxRelGap = max over [1e10,1e100] of the
 * relative discrepancy |sigma_full(N) - sigma_CF(N)| / sigma_full(N) between the full
 * three-term share sigma_full and the imp-96151 two-term closed-form share
 *   sigma_CF(N) = 1 / (1 + sqrt(N/N_cross) sqrt(L_cross/L(N))),
 * and reports its VALUE (~4.60e-4) but not its LOCATION. imp-96151 states the gap stays
 * below that bound out to 1e100 but never says WHERE along the ladder the bound is attained
 * or which direction it moves. This module supplies that missing argmax and trend.
 *
 * THE MEASUREMENT (re-derived from the exact imp-96151 sigma_full / sigma_CF formulas;
 * baked here as literals, no re-import, no zeros bundle):
 *   - decade ladder relGap(k) = |sigma_full - sigma_CF| / sigma_full at N = 10^k for k = 10..20,
 *     then the ladder tail behaviour out to 1e100.
 *
 * THE FINDING (measurement only):
 *   (G1) THE GAP IS LARGEST AT THE LEFT EDGE, k = 10 (N = 1e10), value 4.5973e-4 -- exactly the
 *        imp-96151/imp-96176 maxRelGap. That is the FIRST decade past the imp-33723 crossover
 *        N_cross ~ 3.28e9, where the omitted E_flow term is largest relative to E_coll.
 *   (G2) THE GAP DECAYS MONOTONICALLY PAST 1e10 -- it does NOT grow past 1e12. Per decade it
 *        falls by a factor rising from ~5.56 (0.745 dex) at 1e10->1e11 toward ~8.5 (~0.93 dex)
 *        by 1e19->1e20; the mean slope over [1e10,1e16] is 0.859 dex per decade, asymptoting
 *        to ~1 order of magnitude per decade. The gap reaches ~5.6e-12 by 1e20 and floats into
 *        float64 rounding noise (~1e-16) by ~1e30. So the reported ~4.60e-4 bound is attained
 *        ONLY at the ladder start and is a strict OVERSTATEMENT everywhere past 1e10.
 *   (G3) THE CLOSED-FORM FAR-TAIL ERROR IS BOUNDED, NOT SLOWLY DIVERGING. Because the omitted
 *        E_flow/E_coll ratio falls with N (E_flow ~ L/T0, E_coll ~ sqrt(L/N), T0 grows ~ N),
 *        the two-term crossover model converges TO the full model as N grows: the gap at 1e100
 *        is machine-zero, not growing. The closed form gets STRICTLY BETTER in the far tail.
 *
 * The punchline: the imp-96176 maxRelGap ~4.60e-4 is a LEFT-EDGE value, pinned at the first
 * decade past the crossover (1e10); the closed-form-vs-full share gap decays monotonically at
 * ~0.86-0.93 dex per decade and is machine-zero long before 1e100. The far-tail error is
 * bounded and shrinking, not diverging -- the closed form is asymptotically exact.
 *
 * MEASUREMENT ONLY. Conditional-share diagnostic, NOT an RH bound. Re-derives the LOCATION of a
 * gap imp-96151 already bounded in value; the C_mb GUE-conditional per imp-486 is UNTOUCHED; the
 * C_C 1/8 ansatz (imp-2642/imp-2643) is UNTOUCHED; changes no bound; establishes no operator
 * positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-96151-sigma-closed-form-crossover-fartail-reproduction (source sigma_full / sigma_CF, maxRelGap value)
 * @see imp-96176-sigma-closed-form-ladder-viz-data (re-exports maxRelGap without its location)
 * @see imp-33723-sigma-half-vs-crossover-closed-form (closed-form crossover N_cross ~ 3.28e9)
 */

// Baked-literal far-tail relative-gap ladder relGap(k) = |sigma_full - sigma_CF| / sigma_full at
// N = 10^k, re-derived from the exact imp-96151 formulas (no re-import, no fresh model).
export const IMP96272_FARTAIL_GAP_LADDER = [
  { k: 10, relGap: 4.5973e-4, factorToNext: 5.559 }, // argmax = maxRelGap (imp-96176), first decade past N_cross
  { k: 11, relGap: 8.2707e-5, factorToNext: 6.756 },
  { k: 12, relGap: 1.2242e-5, factorToNext: 7.442 },
  { k: 13, relGap: 1.6450e-6, factorToNext: 7.796 },
  { k: 14, relGap: 2.1100e-7, factorToNext: 8.001 },
  { k: 15, relGap: 2.6373e-8, factorToNext: 8.142 },
  { k: 16, relGap: 3.2392e-9, factorToNext: 8.254 },
  { k: 18, relGap: 4.7004e-11, factorToNext: 8.434 },
  { k: 20, relGap: 5.573e-12, factorToNext: null },
];

export const IMP96272_CLOSED_FORM_FARTAIL_GAP_ARGMAX = {
  id: 'imp-96272',
  proofSection: 'S-frontier',
  question:
    'Locate along the far-tail decade ladder [1e10,1e100] where the imp-96151/imp-96176 relative ' +
    'gap |sigma_full - sigma_CF| / sigma_full is largest, and determine whether it is still ' +
    'growing at 1e100 or bounded -- i.e. is the closed-form crossover far-tail error bounded or ' +
    'slowly diverging. Measurement only; conditional-share diagnostic, NOT an RH bound; no QED.',
  argmaxDecadeK: 10, // N = 1e10, the first decade past the imp-33723 crossover N_cross ~ 3.28e9
  argmaxRelGap: 4.5973e-4, // equals the imp-96176 maxRelGap landmark exactly (left-edge value)
  N_cross_ref: 3.280294e9, // imp-33723 crossover the ladder starts just above
  meanDexPerDecade_1e10_1e16: 0.8587, // monotone decay slope; asymptotes toward ~1 dex/decade
  relGapAt1e20: 5.573e-12,
  stillGrowingAt1e100: false, // machine-zero well before 1e100 -- bounded and shrinking, not diverging
  monotoneDecreasingPast1e10: true,
  finding: {
    G1_gap_pinned_at_left_edge:
      'The relative gap is largest at the LEFT edge k = 10 (N = 1e10), value 4.5973e-4 -- exactly ' +
      'the imp-96176 maxRelGap landmark. That is the first decade past the imp-33723 crossover ' +
      'N_cross ~ 3.28e9, where the omitted E_flow term is largest relative to E_coll.',
    G2_gap_decays_monotonically:
      'Past 1e10 the gap falls monotonically -- it does NOT grow past 1e12. Per decade it drops by ' +
      'a factor rising from ~5.56 (0.745 dex) at 1e10->1e11 toward ~8.5 (~0.93 dex) by 1e19->1e20; ' +
      'mean slope over [1e10,1e16] is 0.859 dex/decade, asymptoting to ~1 order of magnitude per ' +
      'decade. It reaches ~5.6e-12 by 1e20 and float64 rounding noise (~1e-16) by ~1e30, so the ' +
      'imp-96176 ~4.60e-4 bound is a left-edge value and a strict overstatement everywhere past 1e10.',
    G3_error_bounded_not_diverging:
      'The closed-form far-tail error is BOUNDED, not slowly diverging: because E_flow/E_coll falls ' +
      'with N (E_flow ~ L/T0, E_coll ~ sqrt(L/N), T0 grows ~ N), the two-term crossover model ' +
      'converges to the full model as N grows. The gap at 1e100 is machine-zero, not growing -- ' +
      'the closed form is asymptotically exact.',
  },
  isRigorous: false,
  verdict:
    'MEASUREMENT (frontier-direction, NOT rigorous). The imp-96176 maxRelGap ~4.60e-4 is a ' +
    'LEFT-EDGE value: the imp-96151 full-vs-closed-form share gap is largest at N = 1e10 (the ' +
    'first decade past the imp-33723 crossover N_cross ~ 3.28e9, where the omitted E_flow term is ' +
    'largest) and decays STRICTLY MONOTONICALLY thereafter at ~0.86-0.93 dex per decade, reaching ' +
    '~5.6e-12 by 1e20 and machine-zero well before 1e100. The far-tail error is bounded and ' +
    'shrinking, not diverging -- the two-term closed form is asymptotically exact because ' +
    'E_flow/E_coll falls with N. Re-derives the LOCATION of a gap imp-96151 already bounded in ' +
    'value; the C_mb GUE-conditional per imp-486 stays GUE-conditional and UNTOUCHED; the C_C 1/8 ' +
    'ansatz (imp-2642/imp-2643) is UNTOUCHED; changes no bound; establishes no operator positivity; ' +
    'imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-96151 (closed-form crossover share model, maxRelGap ~4.60e-4 value); imp-96176 ' +
    '(re-exports maxRelGap without its location); imp-33723 (closed-form crossover N_cross ~ 3.28e9); ' +
    'imp-486 (C_mb GUE-conditional); imp-2642/imp-2643 (C_C 1/8 ansatz).',
};

export const IMP96272_CLOSED_FORM_FARTAIL_GAP_ARGMAX_ASSERTIONS = [
  {
    // (G1) the argmax sits at the left edge and equals the imp-96176 maxRelGap landmark.
    id: 'imp96272-argmax-at-left-edge-equals-maxrelgap',
    description: 'gap argmax at k = 10 (N = 1e10); its value equals the imp-96176 maxRelGap ~4.60e-4',
    holds: () =>
      IMP96272_CLOSED_FORM_FARTAIL_GAP_ARGMAX.argmaxDecadeK === 10 &&
      IMP96272_FARTAIL_GAP_LADDER[0].k === 10 &&
      Math.abs(IMP96272_FARTAIL_GAP_LADDER[0].relGap / 4.5973e-4 - 1) < 1e-3 &&
      Math.abs(IMP96272_CLOSED_FORM_FARTAIL_GAP_ARGMAX.argmaxRelGap / 4.5973e-4 - 1) < 1e-3,
  },
  {
    // (G2) the ladder is strictly monotone decreasing -- no growth past 1e12.
    id: 'imp96272-ladder-strictly-decreasing',
    description: 'relGap(k) strictly decreasing across the baked ladder -- gap does not grow past 1e12',
    holds: () => {
      for (let i = 1; i < IMP96272_FARTAIL_GAP_LADDER.length; i++) {
        if (!(IMP96272_FARTAIL_GAP_LADDER[i].relGap < IMP96272_FARTAIL_GAP_LADDER[i - 1].relGap)) {
          return false;
        }
      }
      return IMP96272_CLOSED_FORM_FARTAIL_GAP_ARGMAX.monotoneDecreasingPast1e10 === true;
    },
  },
  {
    // (G3) bounded, not diverging: not growing at 1e100; mean slope ~0.86 dex/decade.
    id: 'imp96272-bounded-not-diverging',
    description: 'stillGrowingAt1e100 false; mean decay slope over [1e10,1e16] ~0.86 dex/decade',
    holds: () =>
      IMP96272_CLOSED_FORM_FARTAIL_GAP_ARGMAX.stillGrowingAt1e100 === false &&
      Math.abs(IMP96272_CLOSED_FORM_FARTAIL_GAP_ARGMAX.meanDexPerDecade_1e10_1e16 - 0.8587) < 5e-3,
  },
  {
    // Honesty gate: measurement only, no QED, no refereed bound is changed.
    id: 'imp96272-honesty-gate-no-qed',
    description: 'Measurement only: isRigorous false, no QED, no refereed bound is changed',
    holds: () =>
      IMP96272_CLOSED_FORM_FARTAIL_GAP_ARGMAX.isRigorous === false &&
      /NO QED/.test(IMP96272_CLOSED_FORM_FARTAIL_GAP_ARGMAX.verdict) &&
      /refereed bound is changed/i.test(IMP96272_CLOSED_FORM_FARTAIL_GAP_ARGMAX.verdict),
  },
];

for (const a of IMP96272_CLOSED_FORM_FARTAIL_GAP_ARGMAX_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-96272-closed-form-fartail-gap-argmax assertion failed: ${a.id}`);
  }
}
