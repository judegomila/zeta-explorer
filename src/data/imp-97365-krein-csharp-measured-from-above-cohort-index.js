/**
 * @module imp-97365-krein-csharp-measured-from-above-cohort-index
 * @fileoverview imp-97365 -- META cross-reference index note grouping the Krein c_sharp
 *   lower-bound cohort (imp-97161, imp-97182, imp-97183, imp-97206, imp-97335, imp-97336) as a
 *   single EXACT-OPEN-OBJECT-MEASURED-FROM-ABOVE-ONLY family: every one of the six tickets pins,
 *   brackets, or probes the same unresolved constant -- c_sharp = lambda_min(P_a M_{sigma_2} P_a)
 *   at the binding half-width 2a = ln3 -- and none supplies a proven positive lower bound. Index/
 *   meta only; establishes nothing new; changes no bound; NO QED.
 *
 *   THE COHORT (chronological). All six probe the same object: the Route I Krein floor
 *   c_sharp = lambda_min(T_a[sigma_2]) at 2a = ln3.
 *     imp-97161 -- pins the exact extremal object c_sharp = lambda_min of the truncated
 *       convolution kernel; rejects Beurling-Selberg minorants (circular) and flat Slepian/
 *       prolate eigenvalues (hypotheses violated by the recurring unbounded-depth dip) as sources
 *       of a lower bound; Rayleigh-Ritz numerics only bracket from above and descend
 *       (0.552 -> 0.534 -> 0.476).
 *     imp-97182 -- attempts a Fejer-Riesz/de Branges SOS factorisation with a certified margin;
 *       HONEST PARTIAL -- the polynomial prefactor square is free, but the theorem reduces to an
 *       equivalence in which the margin equals c_sharp itself, so no certified c>0 escapes.
 *     imp-97183 -- extended-precision (dps=50) ladder past the double-precision Gram wall; at
 *       fixed T=800 the floor keeps descending (0.625 -> 0.504, N up to 132), but a T-sweep at
 *       fixed N=100 RISES (0.534 -> 0.578) -- the two truncations move in opposite directions,
 *       no convergence, no zero-crossing resolved.
 *     imp-97206 -- runs a coupled 6x4 (N,T) joint-limit extrapolation; the joint extrapolant is
 *       ~0.582, clearly positive, and resolves the imp-97183 fixed-T descent as a pure
 *       t-truncation artifact rather than a sign change -- coercivity now plausible, but the
 *       result is still a Rayleigh-Ritz measurement, an upper bound.
 *     imp-97335 -- shows the only band-limit-free lower bound (the global infimum of the symbol)
 *       is deeply negative (-4336.2, useless); separately extrapolates the fixed-N=100 T->infinity
 *       limit via a near-exact 1/T^2 law to ~0.582 -- again an upper-bracket limit, not a proof of
 *       positivity.
 *     imp-97336 -- measures the pointwise sign profile of the residual weight w_1(t) near ln3:
 *       deeply negative at the band edge (w_1(ln3) = -2.595), with the negative/positive mass
 *       ratio worsening as a grows past ln3; confirms no pointwise margin exists, closing off the
 *       half-pole-free CC Q-trick as a route to a lower bound.
 *
 *   WHY GROUP THESE (not re-derive). Read individually, the six tickets look like a mix of
 *   feasibility rejections (imp-97161), a stalled factorisation attempt (imp-97182), a numerical
 *   sign-flip scare and its resolution (imp-97183/imp-97206), and two further above-only
 *   measurements (imp-97335/imp-97336). Read together, they are one story: every route toward a
 *   provable positive c_sharp -- exact pinning, SOS factorisation, extended-precision refinement,
 *   coupled-limit extrapolation, naive global bounds, pointwise residual sign -- lands on the same
 *   side of the inequality. Nothing in this cohort ever produces a certified c_sharp > 0; every
 *   number produced is either an upper bracket (Rayleigh-Ritz/extrapolation) or a negative/failed
 *   result. This index bakes that reading so a future scout does not mistake the imp-97206/
 *   imp-97335 positive-looking ~0.582 extrapolants for a proof, and does not re-attempt
 *   Beurling-Selberg, flat-prolate, or naive-symbol-infimum arguments expecting them to supply a
 *   lower bound.
 *
 *   MEASURED/DERIVED (all upper-bound estimates, failed factorisation attempts, or negative
 *   pointwise results; NOT a positive lower bound).
 *   - Rayleigh-Ritz floors descend and have not stabilised at a definite limit under one
 *     truncation family and rise under another: imp-97161 0.552 -> 0.534 -> 0.476;
 *     imp-97183 fixed-T=800 0.625 -> 0.504 (N to 132) vs fixed-N=100 T-sweep 0.534 -> 0.578.
 *   - the coupled (N,T) joint-limit and the fixed-N T->infinity 1/T^2 extrapolation agree at
 *     ~0.582 (imp-97206, imp-97335), resolving the imp-97183 apparent descent as a t-truncation
 *     artifact -- still a measurement, not a certificate.
 *   - the Fejer-Riesz/de Branges SOS route supplies the polynomial prefactor for free but its
 *     margin theorem is an equivalence to c_sharp itself, no certified constant (imp-97182).
 *   - the naive band-limit-free lower bound is deeply negative (-4336.2), confirming the
 *     band-limit is essential and offering no usable floor (imp-97335).
 *   - the pointwise residual sign profile w_1(t) is negative at the ln3 band edge and its
 *     negative-mass dominance worsens with a, closing off the half-pole-free CC Q-trick
 *     (imp-97336).
 *
 *   NOT ESTABLISHED (what stays open).
 *   - no proven positive lower bound on c_sharp = lambda_min(P_a M_{sigma_2} P_a) exists at
 *     2a = ln3; every number in this cohort bounds it from above, restates it, or is negative.
 *   - the ~0.582 joint-limit/T->infinity extrapolants (imp-97206, imp-97335) are numerical
 *     measurements, not certificates; they do not move the interval-rigorous certified reach.
 *   - operator positivity past the fixed-N interval-rigorous reach is NOT established; that reach
 *     stays 2a<=0.96.
 *
 *   STATUS: a grouping/index note over six already-completed tickets, not a new derivation. No
 *   bound changes: interval-rigorous certified reach stays 2a<=0.96; RH open; NO QED.
 *   No refereed bound is changed.
 *
 * @see imp-97161-krein-concentration-lower-bound-assessment.js (pins the extremal object; rejects Beurling-Selberg/flat-Slepian)
 * @see imp-97182-krein-fejer-riesz-margin-factorisation-attempt.js (SOS factorisation attempt; margin equals c_sharp itself)
 * @see imp-97183-krein-csharp-extprec-ladder.js (extended-precision ladder; opposite-direction T-sweep vs fixed-T descent)
 * @see imp-97206-krein-csharp-coupled-nt-jointlimit.js (coupled N,T joint-limit extrapolation; ~0.582)
 * @see imp-97335-krein-csharp-naive-lowerbound-tlimit.js (naive global infimum useless; fixed-N T->infinity limit ~0.582)
 * @see imp-97336-w1-residual-sign-profile-near-ln3.js (pointwise residual sign profile; negative at ln3)
 * @see imp-97201-krein-debranges-coercivity-concentration-cohort-index.js (sibling cohort index: same c_sharp object, earlier scoping/reformulation tickets)
 *
 * Ticket: imp-97365 (meta, low, sonnet-4-6). Documentation/index only; establishes nothing; NO QED;
 * no refereed bound is changed.
 */

const LN3 = Math.log(3); // 1.0986122886681098 -- the binding 2a for the Krein floor

const KREIN_CSHARP_MEASURED_FROM_ABOVE_COHORT = Object.freeze([
  Object.freeze({
    id: 'imp-97161',
    role: 'pins the exact extremal object and assesses standard lower-bound tools',
    result:
      'c_sharp = lambda_min of the truncated convolution kernel; rejects Beurling-Selberg minorants ' +
      '(circular) and flat Slepian/prolate eigenvalues (hypotheses violated) as lower-bound sources; ' +
      'Rayleigh-Ritz numerics bracket from above and descend (0.552 -> 0.534 -> 0.476).',
  }),
  Object.freeze({
    id: 'imp-97182',
    role: 'attempts a Fejer-Riesz/de Branges SOS factorisation with a certified margin',
    result:
      'HONEST PARTIAL: the polynomial prefactor square is free, but the margin theorem reduces to an ' +
      'equivalence in which the margin equals c_sharp itself, so no certified c>0 escapes.',
  }),
  Object.freeze({
    id: 'imp-97183',
    role: 'extended-precision (dps=50) ladder past the double-precision Gram wall',
    result:
      'fixed T=800 descends (0.625 -> 0.504, N to 132) but a T-sweep at fixed N=100 RISES ' +
      '(0.534 -> 0.578) -- opposite directions, no convergence, no zero-crossing resolved.',
  }),
  Object.freeze({
    id: 'imp-97206',
    role: 'coupled 6x4 (N,T) joint-limit extrapolation',
    result:
      'joint extrapolant ~0.582, clearly positive; resolves the imp-97183 fixed-T descent as a pure ' +
      't-truncation artifact -- coercivity plausible, but still a Rayleigh-Ritz upper-bound measurement.',
  }),
  Object.freeze({
    id: 'imp-97335',
    role: 'naive band-limit-free lower bound + fixed-N T->infinity extrapolation',
    result:
      'the band-limit-free global infimum is deeply negative (-4336.2, useless); the fixed-N=100 ' +
      'T->infinity limit via a near-exact 1/T^2 law reaches ~0.582 -- again an upper-bracket limit, ' +
      'not a proof of positivity.',
  }),
  Object.freeze({
    id: 'imp-97336',
    role: 'measures the pointwise sign profile of the residual weight w_1(t) near ln3',
    result:
      'deeply negative at the band edge (w_1(ln3) = -2.595), negative/positive mass ratio worsening ' +
      'with a; confirms no pointwise margin exists, closing off the half-pole-free CC Q-trick.',
  }),
]);

export const IMP97365_KREIN_CSHARP_MEASURED_FROM_ABOVE_COHORT_INDEX = Object.freeze({
  id: 'imp-97365',
  proofSection: 'S-frontier',
  cohort: KREIN_CSHARP_MEASURED_FROM_ABOVE_COHORT,
  measuredSignal:
    'every route toward a provable positive c_sharp = lambda_min(P_a M_{sigma_2} P_a) attempted across ' +
    'these six tickets -- exact pinning (imp-97161), SOS factorisation (imp-97182), extended-precision ' +
    'refinement (imp-97183), coupled-limit extrapolation (imp-97206), naive global bounds (imp-97335), ' +
    'pointwise residual sign (imp-97336) -- lands on the same side of the inequality: an upper bracket, ' +
    'a restatement, or a negative result, never a certified positive lower bound.',
  namedResiduals: [
    'IMP97161_CONCENTRATION_LOWER_BOUND_NEEDS_WEIGHTED_PSWF_OR_FEJER_RIESZ_MARGIN',
    'IMP97182_FEJER_RIESZ_MARGIN_EQUALS_CSHARP_ITSELF',
    'IMP97183_EXTPREC_LADDER_TWO_TRUNCATIONS_DISAGREE',
    'IMP97206_COUPLED_NT_EXTRAPOLANT_IS_MEASUREMENT_NOT_CERTIFICATE',
    'IMP97335_NAIVE_LOWERBOUND_VACUOUS_TLIMIT_IS_MEASUREMENT',
    'IMP97336_W1_POINTWISE_MARGIN_NEGATIVE_AT_LN3',
  ],
  certifiedReach: 0.96,
  lowerBoundOnCSharpProved: false,
  question:
    'The Krein c_sharp lower-bound cohort (imp-97161/97182/97183/97206/97335/97336) reads as six ' +
    'separate tickets spanning feasibility assessment, factorisation attempts, precision refinement, ' +
    'and sign-profile measurement. Grouped, does any of them supply a proven positive lower bound on ' +
    'c_sharp, or does the cohort as a whole show c_sharp is only ever measured from above (or shown ' +
    'negative pointwise)?',
  anyBoundMoved: false,
  verdict:
    'INDEX/META NOTE ONLY (no new derivation). Across all six tickets, c_sharp = ' +
    'lambda_min(P_a M_{sigma_2} P_a) at 2a=ln3 is pinned as an exact object (imp-97161), approached via ' +
    'a factorisation whose margin equals c_sharp itself (imp-97182), bracketed by Rayleigh-Ritz floors ' +
    'that disagree in direction under different truncations until a coupled (N,T) extrapolation settles ' +
    'near ~0.582 (imp-97183, imp-97206, imp-97335), and shown pointwise negative at the band edge ' +
    '(imp-97336). So the cohort as a whole is an EXACT-OPEN-OBJECT-MEASURED-FROM-ABOVE-ONLY family: ' +
    'every quantity produced across these six tickets is either an upper-bound measurement/extrapolation, ' +
    'a restatement of c_sharp itself, or a negative pointwise result -- none establishes c_sharp > 0. No ' +
    'operator positivity is established past the fixed-N reach; interval-rigorous certified reach stays ' +
    'EXACTLY 2a<=0.96, unchanged by this whole cohort. Future work on this thread should treat the ' +
    '~0.582 extrapolants as suggestive, not certified, and should not mistake the imp-97206/imp-97335 ' +
    'positive-looking numbers for a proof. Establishes nothing new; moves no bound; RH open; NO QED. ' +
    'No refereed bound is changed.',
  citation:
    'imp-97161 (extremal-object pinning + tool assessment); imp-97182 (Fejer-Riesz factorisation ' +
    'attempt); imp-97183 (extended-precision ladder); imp-97206 (coupled N,T joint-limit); imp-97335 ' +
    '(naive lower bound + T-limit extrapolation); imp-97336 (w_1 pointwise sign profile).',
  ln3: LN3,
});

export default IMP97365_KREIN_CSHARP_MEASURED_FROM_ABOVE_COHORT_INDEX;

// -- Tripwire assertions ------------------------------------------------------
export const IMP97365_KREIN_CSHARP_MEASURED_FROM_ABOVE_COHORT_INDEX_ASSERTIONS = [
  {
    id: 'imp97365-cohort-has-all-six-members',
    why: 'The whole point of the index is grouping exactly these six tickets; a missing member ' +
      'silently breaks the cross-reference.',
    holds: () => {
      const ids = IMP97365_KREIN_CSHARP_MEASURED_FROM_ABOVE_COHORT_INDEX.cohort.map((c) => c.id);
      return [
        'imp-97161',
        'imp-97182',
        'imp-97183',
        'imp-97206',
        'imp-97335',
        'imp-97336',
      ].every((id) => ids.includes(id));
    },
  },
  {
    id: 'imp97365-named-residuals-present',
    why: 'The index exists to surface the open sub-gaps by name, so future work can find them without ' +
      're-reading all six tickets.',
    holds: () => {
      const idx = IMP97365_KREIN_CSHARP_MEASURED_FROM_ABOVE_COHORT_INDEX;
      return (
        Array.isArray(idx.namedResiduals) &&
        idx.namedResiduals.length === 6 &&
        idx.lowerBoundOnCSharpProved === false &&
        idx.certifiedReach === 0.96 &&
        idx.certifiedReach < idx.ln3
      );
    },
  },
  {
    id: 'imp97365-honesty-gate-no-qed',
    why: 'Documentation/index only: no bound claimed moved, no QED, no-refereed-bound-change line present.',
    holds: () =>
      IMP97365_KREIN_CSHARP_MEASURED_FROM_ABOVE_COHORT_INDEX.anyBoundMoved === false &&
      /NO QED/.test(IMP97365_KREIN_CSHARP_MEASURED_FROM_ABOVE_COHORT_INDEX.verdict) &&
      /refereed bound is changed/i.test(IMP97365_KREIN_CSHARP_MEASURED_FROM_ABOVE_COHORT_INDEX.verdict) &&
      /2a<=0\.96/.test(IMP97365_KREIN_CSHARP_MEASURED_FROM_ABOVE_COHORT_INDEX.verdict),
  },
];

for (const assertion of IMP97365_KREIN_CSHARP_MEASURED_FROM_ABOVE_COHORT_INDEX_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(
      `imp-97365-krein-csharp-measured-from-above-cohort-index assertion failed: ${assertion.id}`,
    );
  }
}
