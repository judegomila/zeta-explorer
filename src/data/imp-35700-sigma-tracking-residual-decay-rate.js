/**
 * @module imp-35700-sigma-tracking-residual-decay-rate
 *
 * imp-35700 (derivation + measurement, frontier-direction): imp-35654 F3 states that AFTER the
 * imp-34791 E_trunc barrier-lemma port lands, the far-tail bridge residual is "sigma-TRACKING"
 * (it vanishes with tail depth) rather than sigma-blind, but only says it "vanishes" -- it gives
 * NO explicit decay rate in N. This module DERIVES and MEASURES an explicit decay rate for the
 * sole surviving conditional share sigma(N) = E_coll / E(N) in the far tail, giving the residual
 * an explicit RATE, not just a limit.
 *
 * THE DERIVATION (why sigma tracks, and how fast)
 * -----------------------------------------------
 * In the component model E(N) = E_trunc + E_flow + E_coll (identical sub-terms to imp-35410 /
 * imp-35334 / imp-3406 / imp-35699):
 *     E_coll  = C_C sqrt(log T0 / N)  -> 0   (dominant early, GUE-conditional C_H = 1/8, imp-486)
 *     E_flow  = C_F (log T0 / T0) G   -> 0   (unconditionally rigorous, imp-398)
 *     E_trunc = 3.06e-5               = const (N-independent floor, imp-2631/imp-34791)
 * Past the imp-3406 monotone-decay peak BOTH E_coll and E_flow decay while E_trunc stays fixed, so
 * the constant truncation floor OUTLIVES the vanishing GUE-conditional collision term: E(N) -> E_trunc.
 * Hence the residual GUE share has the explicit far-tail closed form
 *
 *     sigma(N)  ->  E_coll / E_trunc  =  (C_C / E_trunc) sqrt(log T0(N) / N),
 *
 * with C_C / E_trunc = 12540.77. Because T0(N) grows sub-polynomially (RvM inverse, log T0 ~ log N),
 * the leading behaviour is sigma(N) ~ N^(-1/2) up to a slowly-varying sqrt(log T0) factor. The
 * EXPLICIT local decay exponent is therefore
 *
 *     p(N) = d ln sigma / d ln N  =  -1/2 + (1/2) d ln(log T0) / d ln N   ->  -1/2 from above,
 *
 * the deficit from -1/2 being the positive O(1/log N) slow-varying log-height correction. Equivalently
 * the "decades of tail height per nine of unconditionality" is -1/p(N) -> 2 from above.
 *
 * THE MEASUREMENT (derivation/measurement only)
 * ---------------------------------------------
 *   far-tail closed-form match  sigma / [(C_C/E_trunc) sqrt(log T0 / N)]:
 *     N = 1e15   ratio 0.997728   N = 1e18  ratio 0.999921   N = 1e22  ratio 0.999999   N = 1e25  ratio 1.000000
 *   local decay exponent p(N) = d ln sigma / d ln N  (finite diff, h = 1e-4 in log10 N):
 *     N = 1e12         p = -0.452645   decades/nine 2.2092
 *     N = 5.432e15     p ~ -0.4864     decades/nine ~2.056   (imp-35334 sigma<1e-3 landmark)
 *     N = 6.165e17     p = -0.487540   decades/nine 2.0511   (imp-35410 sigma<1e-4 / 0.9999 crossing)
 *     N = 6.889e19     p = -0.488853   decades/nine 2.0456   (sigma<1e-5 / 0.99999 crossing)
 *     N = 1e25         p = -0.491149   decades/nine 2.0360
 *     N = 1e30         p = -0.492626   decades/nine 2.0299
 *   The local decades/nine straddling the two imp-35699 crossings (2.0511 -> 2.0456) has midpoint
 *   ~2.048 -- EXACTLY the imp-35699 span of 2.048 decades between the 0.9999 and 0.99999 crossings.
 *   imp-35699's empirically-observed "each extra nine costs ~2.05 decades" is thus DERIVED: sigma ~
 *   N^(-1/2) means one decade of sigma-decay costs ~2 decades of N (the small excess above 2.0 is the
 *   sqrt(log T0) correction, which shrinks the decades/nine toward 2.0 as the tail deepens).
 *
 * THE FINDINGS
 * ------------
 *   (D1) THE EXPLICIT DECAY RATE. The sigma-tracking residual has the far-tail closed form
 *        sigma(N) ~ (C_C/E_trunc) sqrt(log T0 / N) ~ N^(-1/2) sqrt(log T0): a square-root-in-N decay
 *        set by the constant E_trunc floor outliving the vanishing E_coll. Not just "vanishes" -- an
 *        explicit rate.
 *   (D2) THE LOCAL EXPONENT CONVERGES TO -1/2 FROM ABOVE. p(N) = d ln sigma / d ln N climbs
 *        -0.4526 (N=1e12) -> -0.4875 (0.9999 crossing) -> -0.4926 (N=1e30), approaching -1/2; the
 *        deficit is the positive slow-varying (1/2) d ln(log T0)/d ln N log-height term.
 *   (D3) THE imp-35699 "~2.05 DECADES PER NINE" IS DERIVED. decades/nine = -1/p(N) -> 2 from above;
 *        the local value across the two imp-35699 crossings (2.0511 -> 2.0456) has midpoint ~2.048,
 *        reproducing the imp-35699 measured span. The residual vanishes at the N^(-1/2) rate: near-total
 *        unconditionality needs astronomically deep tails BECAUSE the rate is only square-root.
 *
 * DERIVATION/MEASUREMENT ONLY. The far-tail closed form sigma ~ (C_C/E_trunc) sqrt(log T0 / N) is the
 * asymptotics of the inherited imp-3220/imp-3406 EXTRAPOLATION component model, NOT a rigorous
 * asymptotic of the true error terms; the "sigma-tracking residual" is the imp-35654 HYPOTHETICAL
 * post-port model (the imp-34791 E_trunc barrier-lemma port is NOT done). The C_mb GUE-conditional
 * share per imp-486 is UNTOUCHED; the imp-34791 E_trunc = barrier-lemma reclassification is UNCHANGED;
 * ports nothing; changes no bound; establishes no operator positivity; imp-3066 K_a >= 0 untouched;
 * no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-35654 (F3: post-port residual is sigma-tracking and "vanishes" -- no rate given)
 * @see imp-35699 (post-port unconditional share crossings; empirical ~2.05 decades per nine)
 * @see imp-3406 (monotone-decay-past-peak reading: E_trunc floor outlives vanishing E_coll)
 * @see imp-35410 (sigma<1e-4 landmark; parts() + bisection source) / imp-35334 (sigma<1e-3 ladder)
 * @see imp-34791-etrunc-eflow-pt-anchor-honest-discharge (E_trunc = unported barrier lemma; NO GUE/PCC)
 * @see imp-486 (C_mb GUE-conditional); imp-398 (E_flow C_F prefactor)
 * @see polymath15-constant-C-C (C_C = C_H sqrt(pi C_Selberg); C_H = 1/8 ansatz)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 = gamma_N)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3220/imp-34791)
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-35410/imp-35334/imp-35699 exactly
const C_C_OVER_E_TRUNC = C_C_PINNED / E_TRUNC_PT; // ~12540.77 (far-tail closed-form constant)

// EXACT imp-35410/imp-35334/imp-35699 sub-terms (no re-derivation, no fresh model).
function parts(N) {
  const T0 = effectiveHeightForN(N);
  const L = Math.log(T0);
  const C_F = (Math.log(T0 / TWO_PI) + 1) / TWO_PI; // imp-398 pinned prefactor
  const E_flow = C_F * (L / T0) * GRONWALL; // unconditionally rigorous
  const E_coll = C_C_PINNED * Math.sqrt(L / N); // GUE-conditional (C_H)
  const E_N = E_TRUNC_PT + E_flow + E_coll;
  return { T0, L, E_flow, E_coll, E_N, sigma: E_coll / E_N };
}

function sigmaAt(N) {
  return parts(N).sigma;
}

// (D1) far-tail closed form: sigma ~ (C_C/E_trunc) sqrt(log T0 / N).
function sigmaFloorApprox(N) {
  const L = Math.log(effectiveHeightForN(N));
  return C_C_OVER_E_TRUNC * Math.sqrt(L / N);
}

// (D2) explicit local decay exponent p(N) = d ln sigma / d ln N (finite diff, h in log10 space).
function localExponent(log10N, h = 1e-4) {
  const s1 = Math.log(sigmaAt(Math.pow(10, log10N - h)));
  const s2 = Math.log(sigmaAt(Math.pow(10, log10N + h)));
  return (s2 - s1) / (2 * h * Math.log(10));
}
// (D3) decades of tail height per nine of unconditionality = -1 / p(N).
function decadesPerNine(log10N) {
  return -1 / localExponent(log10N);
}

// Far-tail closed-form match ladder (D1): sigma vs (C_C/E_trunc) sqrt(log T0 / N).
const MATCH_LADDER = [15, 18, 22, 25].map((lg) => {
  const N = Math.pow(10, lg);
  const s = sigmaAt(N);
  const approx = sigmaFloorApprox(N);
  return {
    log10_N: lg,
    sigma: +s.toExponential(6),
    floorApprox: +approx.toExponential(6),
    ratio: +(s / approx).toFixed(6),
  };
});

// Explicit local decay exponent ladder (D2/D3) across far-tail landmarks + imp-35699 crossings.
const EXPONENT_LADDER = [
  { label: 'N=1e12', log10_N: 12 },
  { label: 'imp-35334 sigma<1e-3 (N~5.432e15)', log10_N: Math.log10(5.432e15) },
  { label: 'imp-35410 sigma<1e-4 / 0.9999 crossing (N~6.165e17)', log10_N: Math.log10(6.164881782e17) },
  { label: 'sigma<1e-5 / 0.99999 crossing (N~6.889e19)', log10_N: Math.log10(6.888981945e19) },
  { label: 'N=1e25', log10_N: 25 },
  { label: 'N=1e30', log10_N: 30 },
].map((r) => ({
  landmark: r.label,
  log10_N: +r.log10_N.toFixed(6),
  localExponent: +localExponent(r.log10_N).toFixed(6),
  decadesPerNine: +decadesPerNine(r.log10_N).toFixed(4),
}));

// The imp-35699 span (2.048 decades between the 0.9999 and 0.99999 crossings) equals the local
// decades/nine straddling those crossings -- the derivation of imp-35699's empirical rate.
const LOG10_9999 = Math.log10(6.164881782e17);
const LOG10_99999 = Math.log10(6.888981945e19);
const IMP35699_SPAN = LOG10_99999 - LOG10_9999; // ~2.0482
const DEC_PER_NINE_9999 = decadesPerNine(LOG10_9999); // ~2.0511
const DEC_PER_NINE_99999 = decadesPerNine(LOG10_99999); // ~2.0456
const DEC_PER_NINE_MID = (DEC_PER_NINE_9999 + DEC_PER_NINE_99999) / 2; // ~2.0484

export const IMP35700_SIGMA_TRACKING_RESIDUAL_DECAY_RATE = {
  id: 'imp-35700',
  proofSection: 'S-frontier',
  question:
    'imp-35654 F3 asserts the post-port residual is sigma-TRACKING and "vanishes" but gives NO explicit ' +
    'N-decay rate. DERIVE/MEASURE an explicit decay rate for the sole surviving conditional share ' +
    'sigma(N) = E_coll/E(N) in the far tail (imp-3406 monotone-decay reading: constant E_trunc floor ' +
    'outlives vanishing E_coll), giving the residual an explicit rate, not just a limit. ' +
    'Derivation/measurement only; no bound change; C_mb GUE-conditional (imp-486) untouched; NO QED.',
  derivation:
    'Past the imp-3406 peak BOTH E_coll = C_C sqrt(log T0/N) and E_flow = C_F(log T0/T0)G decay to 0 ' +
    'while E_trunc = 3.06e-5 stays fixed, so E(N) -> E_trunc and the residual has the explicit far-tail ' +
    'closed form sigma(N) -> E_coll/E_trunc = (C_C/E_trunc) sqrt(log T0(N)/N), with C_C/E_trunc = ' +
    '12540.77. Since T0 grows sub-polynomially (log T0 ~ log N), sigma(N) ~ N^(-1/2) sqrt(log T0). The ' +
    'explicit local decay exponent p(N) = d ln sigma/d ln N = -1/2 + (1/2) d ln(log T0)/d ln N -> -1/2 ' +
    'from above, the deficit being the positive O(1/log N) slow-varying log-height correction.',
  farTailClosedForm: {
    formula: 'sigma(N) ~ (C_C/E_trunc) sqrt(log T0(N) / N) ~ N^(-1/2) sqrt(log T0)',
    C_C_over_E_trunc: +C_C_OVER_E_TRUNC.toFixed(4), // 12540.7685
    matchLadder: MATCH_LADDER,
  },
  localDecayExponent: {
    formula: 'p(N) = d ln sigma / d ln N = -1/2 + (1/2) d ln(log T0)/d ln N -> -1/2 from above',
    ladder: EXPONENT_LADDER,
  },
  imp35699Connection: {
    claim:
      'The imp-35699 span of 2.048 decades between the 0.9999 and 0.99999 crossings EQUALS the local ' +
      'decades/nine straddling those crossings (2.0511 -> 2.0456, midpoint ~2.048): imp-35699 empirical ' +
      '"~2.05 decades per nine" is DERIVED from the N^(-1/2) rate (one decade of sigma = ~2 decades of N)',
    span_decades: +IMP35699_SPAN.toFixed(4), // 2.0482
    decadesPerNine_at_0_9999: +DEC_PER_NINE_9999.toFixed(4), // 2.0511
    decadesPerNine_at_0_99999: +DEC_PER_NINE_99999.toFixed(4), // 2.0456
    decadesPerNine_midpoint: +DEC_PER_NINE_MID.toFixed(4), // 2.0484
  },
  findings: {
    D1_explicit_decay_rate: {
      claim:
        'The sigma-tracking residual has the explicit far-tail closed form sigma(N) ~ (C_C/E_trunc) ' +
        'sqrt(log T0/N) ~ N^(-1/2) sqrt(log T0): a square-root-in-N decay set by the constant E_trunc ' +
        'floor outliving the vanishing E_coll. Not just "vanishes" -- an explicit rate.',
      C_C_over_E_trunc: +C_C_OVER_E_TRUNC.toFixed(4),
      closedFormMatchRatio_at_1e25: MATCH_LADDER[3].ratio, // 1.000000
    },
    D2_exponent_to_minus_half: {
      claim:
        'The local exponent p(N) = d ln sigma/d ln N climbs -0.4526 (N=1e12) -> -0.4875 (0.9999 ' +
        'crossing) -> -0.4926 (N=1e30), approaching -1/2 from above; the deficit is the positive ' +
        'slow-varying (1/2) d ln(log T0)/d ln N log-height correction.',
      exponent_at_1e12: EXPONENT_LADDER[0].localExponent, // -0.452645
      exponent_at_1e30: EXPONENT_LADDER[5].localExponent, // -0.492626
    },
    D3_imp35699_rate_derived: {
      claim:
        'decades/nine = -1/p(N) -> 2 from above; the local value across the two imp-35699 crossings ' +
        '(2.0511 -> 2.0456, midpoint ~2.048) reproduces the imp-35699 measured span. The residual ' +
        'vanishes only at the N^(-1/2) rate, so near-total unconditionality needs astronomically deep tails.',
      imp35699_span: +IMP35699_SPAN.toFixed(4),
      decadesPerNine_midpoint: +DEC_PER_NINE_MID.toFixed(4),
    },
  },
  isRigorous: false,
  verdict:
    'DERIVATION + MEASUREMENT (frontier-direction, NOT rigorous). imp-35654 F3 said the post-port ' +
    'residual is sigma-tracking and "vanishes" but gave no rate. (D1) The residual has the EXPLICIT ' +
    'far-tail closed form sigma(N) ~ (C_C/E_trunc) sqrt(log T0/N) ~ N^(-1/2) sqrt(log T0) (C_C/E_trunc ' +
    '= 12540.77), because past the imp-3406 peak the constant E_trunc = 3.06e-5 floor outlives the ' +
    'vanishing E_coll and E_flow, so E(N) -> E_trunc; the closed form matches actual sigma to 6 sig ' +
    'figs by N=1e25. (D2) The explicit local decay exponent p(N) = d ln sigma/d ln N climbs -0.4526 ' +
    '(N=1e12) -> -0.4875 (0.9999 crossing) -> -0.4926 (N=1e30), converging to -1/2 from above; the ' +
    'deficit is the positive slow-varying (1/2) d ln(log T0)/d ln N log-height correction. (D3) The ' +
    'decades-of-tail-per-nine = -1/p(N) -> 2 from above; its local value across the two imp-35699 ' +
    'crossings (2.0511 -> 2.0456, midpoint ~2.048) EQUALS the imp-35699 span, so imp-35699 empirical ' +
    '"~2.05 decades per nine" is DERIVED from the N^(-1/2) rate. The far-tail closed form is the ' +
    'asymptotics of the inherited imp-3220/imp-3406 EXTRAPOLATION model, NOT a rigorous asymptotic; ' +
    'the sigma-tracking residual is the imp-35654 HYPOTHETICAL post-port model (E_trunc port NOT done). ' +
    'The C_mb GUE-conditional share per imp-486 is UNTOUCHED; the imp-34791 E_trunc = barrier-lemma ' +
    'reclassification is UNCHANGED; ports nothing; changes no bound; establishes no operator positivity; ' +
    'imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-35654 (F3: residual sigma-tracking, "vanishes", no rate); imp-35699 (post-port share ' +
    'crossings, empirical ~2.05 decades/nine); imp-3406 (monotone-decay peak: E_trunc floor outlives ' +
    'E_coll); imp-35410 (sigma<1e-4 landmark, parts()+bisection source); imp-35334 (sigma<1e-3 ladder); ' +
    'imp-34791 (E_trunc = unported barrier lemma, NO GUE/PCC); imp-486 (C_mb GUE-conditional); imp-398 ' +
    '(E_flow C_F prefactor); imp-2642 (C_H = 1/8); imp-2631 (E_trunc fixed-strip route); ' +
    'lambda-rh-height-mapping (effectiveHeightForN).',
};

export const IMP35700_SIGMA_TRACKING_RESIDUAL_DECAY_RATE_ASSERTIONS = [
  {
    // (D1): the far-tail closed form sigma ~ (C_C/E_trunc) sqrt(log T0/N) matches actual sigma to
    // ~6 sig figs deep in the tail (ratio -> 1), with the closed-form constant C_C/E_trunc ~ 12540.77.
    id: 'imp35700-far-tail-closed-form-match',
    description: 'sigma ~ (C_C/E_trunc) sqrt(log T0/N) match ratio -> 1 as tail deepens (0.9977 at 1e15 -> 1.0 at 1e25); C_C/E_trunc ~ 12540.77',
    holds: () =>
      Math.abs(C_C_OVER_E_TRUNC - 12540.768) < 1e-2 &&
      Math.abs(MATCH_LADDER[0].ratio - 0.997728) < 1e-3 &&
      MATCH_LADDER[0].ratio < MATCH_LADDER[1].ratio &&
      MATCH_LADDER[1].ratio < MATCH_LADDER[3].ratio &&
      Math.abs(MATCH_LADDER[3].ratio - 1.0) < 1e-5,
  },
  {
    // (D2): the local decay exponent p(N) = d ln sigma/d ln N climbs toward -1/2 from above.
    id: 'imp35700-local-exponent-to-minus-half',
    description: 'p(N) = d ln sigma/d ln N: -0.4526 (1e12) -> -0.4875 (0.9999 crossing) -> -0.4926 (1e30), -> -1/2 from above',
    holds: () => {
      const p12 = EXPONENT_LADDER[0].localExponent;
      const p9999 = EXPONENT_LADDER[2].localExponent;
      const p30 = EXPONENT_LADDER[5].localExponent;
      return (
        Math.abs(p12 - -0.452645) < 1e-3 &&
        Math.abs(p9999 - -0.48754) < 1e-3 &&
        Math.abs(p30 - -0.492626) < 1e-3 &&
        p12 > p9999 && p9999 > p30 && p30 > -0.5 // monotone (more negative) toward -1/2 from above
      );
    },
  },
  {
    // (D3): decades/nine = -1/p(N) across the two imp-35699 crossings has midpoint ~2.048, EQUAL to
    // the imp-35699 span of 2.048 decades -- the derivation of imp-35699's empirical rate.
    id: 'imp35700-imp35699-rate-derived',
    description: 'decades/nine midpoint across the two imp-35699 crossings (~2.048) equals the imp-35699 span (~2.048)',
    holds: () =>
      Math.abs(IMP35699_SPAN - 2.0482) < 5e-3 &&
      Math.abs(DEC_PER_NINE_MID - 2.0484) < 5e-3 &&
      Math.abs(DEC_PER_NINE_MID - IMP35699_SPAN) < 5e-3,
  },
  {
    // Honesty gate: derivation/measurement of the imp-35654 hypothetical post-port model, ports
    // nothing, GUE-conditional per imp-486, E_trunc barrier lemma per imp-34791, no QED, no refereed bound is changed.
    id: 'imp35700-honesty-gate-no-qed',
    description: 'Derivation/measurement only: hypothetical post-port model, ports nothing, C_mb GUE-conditional (imp-486), no QED, no refereed bound is changed',
    holds: () =>
      IMP35700_SIGMA_TRACKING_RESIDUAL_DECAY_RATE.isRigorous === false &&
      /GUE-conditional share per imp-486 is UNTOUCHED/.test(
        IMP35700_SIGMA_TRACKING_RESIDUAL_DECAY_RATE.verdict,
      ) &&
      /HYPOTHETICAL post-port model/.test(IMP35700_SIGMA_TRACKING_RESIDUAL_DECAY_RATE.verdict) &&
      /ports nothing/i.test(IMP35700_SIGMA_TRACKING_RESIDUAL_DECAY_RATE.verdict) &&
      /NO QED/.test(IMP35700_SIGMA_TRACKING_RESIDUAL_DECAY_RATE.verdict) &&
      /refereed bound is changed/i.test(IMP35700_SIGMA_TRACKING_RESIDUAL_DECAY_RATE.verdict),
  },
];

for (const a of IMP35700_SIGMA_TRACKING_RESIDUAL_DECAY_RATE_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-35700-sigma-tracking-residual-decay-rate assertion failed: ${a.id}`,
    );
  }
}
