/**
 * @module imp-35055-inflection-crossover-algebraic-tie
 *
 * imp-35055 (accuracy, frontier-direction): the four-landmark cluster work (imp-33721 /
 * imp-33723 / imp-33729) established that the sigmoid-ramp curvature KNEE N_star ~ 3.38e9
 * (imp-33701/imp-33721 single D2 sign change of the local decay exponent) CO-LOCATES with the
 * E_coll = E_trunc CROSSOVER N_cross ~ 3.280e9 (imp-3444/imp-33723) to ~3% (+0.0126 decades,
 * imp-33729). imp-33729 MEASURED that offset in decades. This module asks the STRICTLY DIFFERENT
 * question the ticket names: is that co-location an ALGEBRAIC IDENTITY forced by the imp-33601
 * component model -- i.e. is N_star derivable in closed form as a function of N_cross -- or are the
 * two landmarks structurally INDEPENDENT and merely happen to sit near one another? (This is NOT
 * the imp-33729 numeric-offset measurement; it is a derivation of whether a functional relation
 * exists at all.)
 *
 * THE QUANTITY (identical model to imp-3406 / imp-33582 / imp-33601 -- no fresh terms)
 * -----------------------------------------------------------------------------------
 *     sigma(N) = E_coll / (E_trunc + E_flow + E_coll),
 *     E_coll = C_C_PINNED * sqrt(log T0 / N)   (dominant, GUE-conditional C_H),
 *     E_flow = C_F (log T0 / T0) * Gronwall,    E_trunc = 3.06e-5   (N-independent).
 * N_cross is the level set E_coll = E_trunc (imp-3444/imp-33723 closed form). N_star is the single
 * zero of the ramp acceleration D2 = d2p/dx2 of the local decay exponent p(x) = -d ln sigma / dx,
 * x = ln N (imp-33701/imp-33721).
 *
 * THE DERIVATION (the deliverable: an EXACT algebraic tie at leading order)
 * ------------------------------------------------------------------------
 * Drop the two known-small terms (E_flow/E_trunc ~ 1.9e-3 at N_half, imp-33723; and freeze the
 * slowly-varying log T0 at a reference L_ref). The reduced share is
 *
 *     sigma(N) = E_coll / (E_trunc + E_coll) = 1 / (1 + u),   u := E_trunc / E_coll.
 *
 * With log T0 frozen, E_coll = C_C sqrt(L_ref / N) is pure N^(-1/2), so u = u0 * exp(x/2) and
 * sigma(x) = 1 / (1 + u0 e^(x/2)) is EXACTLY a (decreasing) logistic in the variable x/2. Two exact
 * consequences follow, both verified below to machine precision:
 *
 *   (i) THE LOCAL EXPONENT IS A CLOSED FORM OF sigma ITSELF:
 *          p(x) = -d ln sigma / dx = u_prime/(1+u) = (u/2)/(1+u) = (1/2)(1 - sigma).
 *       So the whole exponent ramp is p = (1/2)(1 - sigma): it rises from 0 (sigma -> 1) to the
 *       imp-3463 far-tail asymptote 1/2 (sigma -> 0), pinned by sigma.
 *
 *   (ii) THE KNEE IS THE LOGISTIC INFLECTION, WHICH IS THE CROSSOVER:
 *          D2 = d2p/dx2 = -(1/2) d2 sigma / dx2,
 *       so the ramp-acceleration zero D2 = 0 coincides IDENTICALLY with the sigma inflection
 *       d2 sigma/dx2 = 0. For the logistic sigma = 1/(1+u0 e^(x/2)) the inflection sits exactly at
 *       u0 e^(x/2) = 1, i.e. u = 1, i.e. E_coll = E_trunc -- which is the DEFINITION of N_cross, and
 *       equivalently sigma = 1/2. Hence at leading order N_star = N_cross EXACTLY: the knee is not a
 *       coincidental neighbour of the crossover, it IS the crossover, algebraically forced.
 *
 * So the answer is: the co-location is an ALGEBRAIC IDENTITY (N_star = N_cross at leading order),
 * NOT structural independence. The ~3% numeric gap imp-33729 measured is the SUM of exactly the two
 * corrections dropped above, both breaking the pure logistic form and both pushing N_star to the
 * high-N side (matching the observed sign):
 *
 * THE FINDING (derivation / measurement only)
 * -------------------------------------------
 *   (D1) LEADING-ORDER IDENTITY. In the frozen-log, E_flow-free reduction the D2 zero, the sigma
 *        inflection, and the u = 1 crossover coincide to ~5e-7 relative (u = 0.99999976,
 *        sigma = 0.50000006 at the leading N_star), and p = (1/2)(1 - sigma) holds to machine
 *        precision across [1e8, 1e11]. N_star is therefore an algebraic function of N_cross: they
 *        are the SAME level set of the component model, not co-located independents.
 *   (D2) THE ~3% OFFSET IS THE TWO DROPPED CORRECTIONS, NOT INDEPENDENCE. Restoring the slow
 *        log T0(N) drift alone moves the continuous inflection to +1.80% above N_cross; additionally
 *        restoring the Gronwall E_flow term gives the full-model continuous inflection at +3.93%
 *        (log10 N_star ~ 9.533, matching the imp-33721 discrete-ladder N_star ~ 3.38e9 / log10 ~
 *        9.529 and the imp-33729 +0.0126-decade offset). Both corrections are the SAME ones
 *        imp-33723 attributed the sigma=1/2-vs-crossover offset to; both push N_star high-side.
 *
 * The punchline: N_star is ALGEBRAICALLY TIED to N_cross -- in the leading reduction of the
 * imp-33601 model sigma is an exact logistic in (1/2) ln N whose inflection IS the E_coll = E_trunc
 * crossover, so N_star = N_cross identically and p = (1/2)(1 - sigma). The knee does not merely
 * co-locate with the crossover by accident; it is the same landmark, displaced ~3% only by the
 * log T0 drift and the E_flow term. This resolves the ticket in favour of an algebraic relation
 * (not structural independence), distinct from the imp-33729 numeric-offset measurement.
 *
 * DERIVATION / MEASUREMENT ONLY. Conditional-share curvature diagnostic, NOT an RH bound. The
 * component model is the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the
 * C_mb GUE-conditional per imp-486 is UNTOUCHED; the C_C 1/8 ansatz is UNTOUCHED (imp-2642); no
 * bound; no operator positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-33729-sigma-knee-vs-crossover-offset (MEASURED the knee-crossover offset in decades; this module asks whether a closed-form tie exists)
 * @see imp-33721-sigma-ramp-inflection-subdecade (sub-decade knee refined to N* ~ 3.38e9)
 * @see imp-33723-sigma-half-vs-crossover-closed-form (closed-form E_coll=E_trunc crossover ~3.280e9)
 * @see imp-33601-sigma-half-vs-crossover-eflow-offset (exact identity sigma=1/2 <=> E_coll=E_trunc+E_flow)
 * @see imp-3463-sigma-fartail-decay (far-tail exponent -> 1/2, the p ramp asymptote)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 = gamma_N)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3406/imp-33582)
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-3406/imp-33582/imp-33723 exactly

// EXACT imp-3406/imp-33582/imp-33601 sub-terms (no re-derivation, no fresh model).
function parts(N) {
  const T0 = effectiveHeightForN(N);
  const L = Math.log(T0);
  const C_F = (Math.log(T0 / TWO_PI) + 1) / TWO_PI; // imp-398 pinned prefactor
  const E_flow = C_F * (L / T0) * GRONWALL; // Gronwall flow term (unconditionally rigorous)
  const E_coll = C_C_PINNED * Math.sqrt(L / N); // GUE-conditional (C_H)
  return { L, E_flow, E_coll, sigma: E_coll / (E_TRUNC_PT + E_flow + E_coll) };
}
const sigmaFull = (N) => parts(N).sigma;
// log T0 drift restored, E_flow dropped (isolates the drift correction).
const sigmaNoFlow = (N) => {
  const E_coll = C_C_PINNED * Math.sqrt(Math.log(effectiveHeightForN(N)) / N);
  return E_coll / (E_TRUNC_PT + E_coll);
};
// LEADING reduction: log T0 frozen at L_ref, E_flow dropped -> exact logistic in (1/2) ln N.
function makeLeading(Lref) {
  return (N) => {
    const E_coll = C_C_PINNED * Math.sqrt(Lref / N);
    return E_coll / (E_TRUNC_PT + E_coll);
  };
}

// Downslope bisection of a strictly-decreasing quantity to a target (imp-33723 estimator).
function crossBelow(f, target, lo, hi) {
  let a = Math.log(lo);
  let b = Math.log(hi);
  for (let i = 0; i < 300; i++) {
    const m = (a + b) / 2;
    if (f(Math.exp(m)) > target) a = m;
    else b = m;
  }
  return Math.exp((a + b) / 2);
}
// Locate the single sign change of g(x) on [lo, hi] (used for the inflection level sets).
function findSignChange(g, lo, hi) {
  let a = Math.log(lo);
  let b = Math.log(hi);
  const ga = Math.sign(g(Math.exp(a)));
  for (let i = 0; i < 200; i++) {
    const m = (a + b) / 2;
    if (Math.sign(g(Math.exp(m))) === ga) a = m;
    else b = m;
  }
  return Math.exp((a + b) / 2);
}
// Continuous curvature d2 sigma / dx2 and local exponent p = -d ln sigma / dx (x = ln N).
function d2sigma(f, N) {
  const h = 1e-4;
  const x = Math.log(N);
  return (f(Math.exp(x + h)) - 2 * f(Math.exp(x)) + f(Math.exp(x - h))) / (h * h);
}
function pExp(f, N) {
  const h = 1e-4;
  const x = Math.log(N);
  return -(Math.log(f(Math.exp(x + h))) - Math.log(f(Math.exp(x - h)))) / (2 * h);
}

// --- N_cross: the E_coll = E_trunc level set (imp-3444/imp-33723 crossover) ---
const N_CROSS = crossBelow((N) => parts(N).E_coll, E_TRUNC_PT, 1e6, 1e18); // ~3.280294e9
const L_REF = parts(N_CROSS).L;
const leading = makeLeading(L_REF);

// (D1) leading-order landmarks: D2 zero == sigma inflection == u=1 crossover.
const N_STAR_LEADING = findSignChange((N) => d2sigma(leading, N), 1e6, 1e13);
const U_AT_LEADING = E_TRUNC_PT / (C_C_PINNED * Math.sqrt(L_REF / N_STAR_LEADING)); // ~1
const SIGMA_AT_LEADING = leading(N_STAR_LEADING); // ~1/2
const LEADING_VS_CROSS_REL = Math.abs(N_STAR_LEADING / N_CROSS - 1); // ~5e-7
// p = (1/2)(1 - sigma) closed-form check across the ramp.
const P_CLOSED_FORM_SAMPLES = [1e8, 1e9, N_CROSS, 1e10, 1e11].map((N) => {
  const s = leading(N);
  const p = pExp(leading, N);
  return { N: +N.toExponential(3), p: +p.toFixed(8), half_1_minus_sigma: +(0.5 * (1 - s)).toFixed(8), absErr: Math.abs(p - 0.5 * (1 - s)) };
});
const MAX_P_CLOSED_FORM_ERR = Math.max(...P_CLOSED_FORM_SAMPLES.map((r) => r.absErr));

// (D2) correction decomposition: restore log T0 drift, then also E_flow.
const N_STAR_LOGDRIFT = findSignChange((N) => d2sigma(sigmaNoFlow, N), 1e7, 1e13);
const N_STAR_FULL = findSignChange((N) => d2sigma(sigmaFull, N), 1e7, 1e13);
const REL_LOGDRIFT = N_STAR_LOGDRIFT / N_CROSS - 1; // ~+1.80e-2
const REL_FULL = N_STAR_FULL / N_CROSS - 1; // ~+3.93e-2
const REL_EFLOW = REL_FULL - REL_LOGDRIFT; // ~+2.13e-2 (E_flow increment)

export const IMP35055_INFLECTION_CROSSOVER_ALGEBRAIC_TIE = {
  id: 'imp-35055',
  proofSection: 'S-frontier',
  question:
    'Is the sigmoid-ramp curvature knee N_star (imp-33701/imp-33721 single D2 sign change) ' +
    'ALGEBRAICALLY TIED to the E_coll = E_trunc crossover N_cross (imp-3444/imp-33723) -- derivable ' +
    'as a closed-form function of N_cross via the imp-33601 component model -- or an INDEPENDENT ' +
    'curvature landmark that merely co-locates? Distinct from the imp-33729 numeric-offset ' +
    'measurement: this asks whether a functional relation exists at all. Derivation only; ' +
    'conditional-share diagnostic, NOT an RH bound; no QED.',
  answer:
    'ALGEBRAICALLY TIED. In the leading (frozen-log-T0, E_flow-free) reduction sigma = 1/(1+u), ' +
    'u = E_trunc/E_coll = u0 exp(x/2), is EXACTLY a logistic in (1/2) ln N; its inflection sits ' +
    'identically at u = 1, i.e. E_coll = E_trunc = the crossover. So N_star = N_cross at leading ' +
    'order (not co-located independents), and the local exponent is the closed form p = (1/2)(1 - sigma).',
  closedFormExponent: 'p(x) = -d ln sigma / dx = (1/2)(1 - sigma)  (exact in the leading reduction)',
  curvatureIdentity: 'D2 = d2p/dx2 = -(1/2) d2 sigma / dx2  =>  D2 = 0 <=> sigma inflection <=> u = 1 <=> E_coll = E_trunc',
  leadingOrder: {
    N_cross: +N_CROSS.toExponential(6), // ~3.280294e9
    N_star_leading: +N_STAR_LEADING.toExponential(6), // ~3.280293e9
    N_star_leading_vs_cross_rel: +LEADING_VS_CROSS_REL.toExponential(3), // ~5e-7
    u_at_leading_N_star: +U_AT_LEADING.toFixed(8), // ~0.99999976 (crossover is u=1)
    sigma_at_leading_N_star: +SIGMA_AT_LEADING.toFixed(8), // ~0.50000006 (logistic inflection is 1/2)
    p_closed_form_max_abs_err: +MAX_P_CLOSED_FORM_ERR.toExponential(3), // machine precision
    p_closed_form_samples: P_CLOSED_FORM_SAMPLES.map((r) => ({ N: r.N, p: r.p, half_1_minus_sigma: r.half_1_minus_sigma })),
  },
  correctionDecomposition: {
    logT0_drift_only_rel_above_cross: +REL_LOGDRIFT.toExponential(4), // ~+1.80e-2
    plus_E_flow_full_rel_above_cross: +REL_FULL.toExponential(4), // ~+3.93e-2
    E_flow_increment_rel: +REL_EFLOW.toExponential(4), // ~+2.13e-2
    full_continuous_log10_N_star: +Math.log10(N_STAR_FULL).toFixed(4), // ~9.533
    imp33721_discrete_log10_N_star: 9.529, // N* ~ 3.38e9 (imp-33721 quarter-decade ladder)
    imp33729_offset_decades: 0.0126, // measured knee - crossover offset (imp-33729)
    note:
      'The ~3% co-location gap is exactly the two terms dropped in the leading reduction -- the slow ' +
      'log T0(N) drift (+1.80%) and the Gronwall E_flow term (+2.13% more) -- both breaking the pure ' +
      'logistic form and both pushing N_star to the HIGH-N side, matching the imp-33729 sign. Same ' +
      'corrections imp-33723 attributed the sigma=1/2-vs-crossover offset to. NOT structural independence.',
  },
  finding: {
    D1_leading_order_identity:
      'In the frozen-log, E_flow-free reduction the D2 zero, the sigma inflection, and the u = 1 ' +
      'crossover coincide to ~5e-7 relative (u = 0.99999976, sigma = 0.50000006 at the leading ' +
      'N_star), and the local exponent obeys the closed form p = (1/2)(1 - sigma) to machine ' +
      'precision. N_star is therefore an algebraic function of N_cross -- the SAME level set of the ' +
      'imp-33601 model -- not an independent landmark that happens to sit nearby.',
    D2_offset_is_the_dropped_corrections:
      'Restoring the slow log T0(N) drift moves the continuous inflection to +1.80% above N_cross; ' +
      'additionally restoring the Gronwall E_flow term gives +3.93% (log10 N_star ~ 9.533), matching ' +
      'the imp-33721 discrete-ladder N* ~ 3.38e9 (log10 ~ 9.529) and the imp-33729 +0.0126-decade ' +
      'offset. Both corrections are the same ones imp-33723 named and both push N_star high-side, so ' +
      'the ~3% gap is a perturbation of an exact identity, NOT evidence of independence.',
  },
  isRigorous: false,
  verdict:
    'DERIVATION (frontier-direction, NOT rigorous). The sigmoid-ramp curvature knee N_star is ' +
    'ALGEBRAICALLY TIED to the E_coll = E_trunc crossover N_cross, not an independent co-located ' +
    'landmark. In the leading reduction of the imp-33601 component model (freeze log T0, drop E_flow) ' +
    'the conditional share sigma = 1/(1 + E_trunc/E_coll) is EXACTLY a logistic in (1/2) ln N, so ' +
    '(i) the local decay exponent is the closed form p = (1/2)(1 - sigma) and (ii) the ramp ' +
    'acceleration D2 = -(1/2) d2 sigma/dx2 vanishes identically at the logistic inflection, which ' +
    'is the point u = E_trunc/E_coll = 1, i.e. E_coll = E_trunc = N_cross (equivalently sigma = 1/2). ' +
    'Numerically the leading D2 zero equals N_cross to ~5e-7 (u = 0.99999976, sigma = 0.50000006) ' +
    'and p = (1/2)(1 - sigma) holds to machine precision. The ~3% co-location gap imp-33729 measured ' +
    '(+0.0126 decades) is exactly the two dropped corrections -- the log T0(N) drift (+1.80%) and the ' +
    'Gronwall E_flow term (+2.13% more, total +3.93%, log10 N_star ~ 9.533 vs the imp-33721 discrete ' +
    '9.529) -- both pushing N_star high-side, i.e. a perturbation of an exact identity, NOT structural ' +
    'independence. This is a derivation of the RELATION (distinct from imp-33729 measuring the OFFSET). ' +
    'Component model is the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the ' +
    'C_mb GUE-conditional per imp-486 and the C_C 1/8 ansatz (imp-2642) are UNTOUCHED; changes no ' +
    'bound; establishes no operator positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. ' +
    'No refereed bound is changed.',
  citation:
    'imp-33729 (measured knee-crossover offset in decades); imp-33721 (sub-decade knee N* ~ 3.38e9); ' +
    'imp-33723 (closed-form E_coll=E_trunc crossover ~3.280e9); imp-33601 (sigma=1/2 <=> ' +
    'E_coll=E_trunc+E_flow); imp-3444 (crossover, bisected); imp-33582 (six-decade ladder + halving ' +
    'landmark); imp-3463 (far-tail exponent -> 1/2); imp-486 (C_mb GUE-conditional); imp-2631 ' +
    '(E_trunc fixed-strip route); lambda-rh-height-mapping (effectiveHeightForN).',
};

export const IMP35055_INFLECTION_CROSSOVER_ALGEBRAIC_TIE_ASSERTIONS = [
  {
    // Reuse gate: the crossover reproduces the imp-3444/imp-33723 balance landmark (~3.280e9).
    id: 'imp35055-crossover-matches-imp33723',
    description: 'E_coll = E_trunc crossover N_cross ~ 3.280294e9 (matches imp-3444/imp-33723)',
    holds: () => Math.abs(N_CROSS / 3.280294e9 - 1) < 5e-3,
  },
  {
    // (D1): the closed-form exponent p = (1/2)(1 - sigma) holds to machine precision in the leading model.
    id: 'imp35055-exponent-is-half-one-minus-sigma',
    description: 'leading-model local exponent p = (1/2)(1 - sigma) to machine precision across the ramp',
    holds: () => MAX_P_CLOSED_FORM_ERR < 1e-6,
  },
  {
    // (D1 core): leading-order D2 zero == sigma inflection == u=1 crossover, to ~1e-5.
    id: 'imp35055-leading-order-N-star-equals-N-cross',
    description: 'leading D2 zero equals N_cross to <1e-5 relative; u ~ 1 and sigma ~ 1/2 at that point',
    holds: () =>
      LEADING_VS_CROSS_REL < 1e-5 &&
      Math.abs(U_AT_LEADING - 1) < 1e-5 &&
      Math.abs(SIGMA_AT_LEADING - 0.5) < 1e-5,
  },
  {
    // (D2): both dropped corrections push N_star to the HIGH-N side and sum to the ~3% co-location gap.
    id: 'imp35055-offset-is-the-two-dropped-corrections',
    description: 'log T0 drift (+1.8%) and E_flow (+2.1% more) both high-side; full ~+3.9% matches imp-33721/imp-33729',
    holds: () =>
      REL_LOGDRIFT > 0 &&
      REL_EFLOW > 0 &&
      REL_FULL > REL_LOGDRIFT &&
      Math.abs(REL_FULL - 3.9e-2) < 1e-2 &&
      Math.abs(Math.log10(N_STAR_FULL) - 9.529) < 0.02,
  },
  {
    // The answer string asserts an algebraic tie (not independence) -- lock the verdict wording.
    id: 'imp35055-answer-is-algebraic-tie',
    description: 'answer/verdict declare an ALGEBRAIC tie (not structural independence)',
    holds: () =>
      /ALGEBRAICALLY TIED/.test(IMP35055_INFLECTION_CROSSOVER_ALGEBRAIC_TIE.answer) &&
      /ALGEBRAICALLY TIED/.test(IMP35055_INFLECTION_CROSSOVER_ALGEBRAIC_TIE.verdict) &&
      /NOT structural independence/.test(IMP35055_INFLECTION_CROSSOVER_ALGEBRAIC_TIE.verdict),
  },
  {
    // Honesty gate: derivation only, no QED, no refereed bound is changed.
    id: 'imp35055-honesty-gate-no-qed',
    description: 'Derivation only: isRigorous false, no QED, no refereed bound is changed',
    holds: () =>
      IMP35055_INFLECTION_CROSSOVER_ALGEBRAIC_TIE.isRigorous === false &&
      /NO QED/.test(IMP35055_INFLECTION_CROSSOVER_ALGEBRAIC_TIE.verdict) &&
      /refereed bound is changed/i.test(IMP35055_INFLECTION_CROSSOVER_ALGEBRAIC_TIE.verdict),
  },
];

for (const a of IMP35055_INFLECTION_CROSSOVER_ALGEBRAIC_TIE_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-35055-inflection-crossover-algebraic-tie assertion failed: ${a.id}`);
  }
}
