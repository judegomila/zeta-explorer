/**
 * @module imp-97752-sigma-fartail-asymptotic-cohort-index
 * @fileoverview imp-97752 -- META cross-reference index grouping the sigma far-tail asymptotic
 *   cohort (imp-3406, imp-33582, imp-97702, imp-97723) by ROLE in the single asymptotic story of
 *   sigma(N) = E_coll(N)/E(N), the E(N)-bridge GUE-conditional share: peak-and-decay (does the
 *   right arm keep widening past the imp-3220 10^6 ceiling?), decay-rate-ramp (how fast does it
 *   fall once past the peak?), exponent decomposition (what functional form does the residual to
 *   the far-tail 1/2 asymptote take?), and the RvM log-derivative asymptote-to-1 (does the deep-tail
 *   diagnostic reach exactly 1, or floor short?). Index/meta only; establishes nothing new; changes
 *   no bound; NO QED.
 *
 *   THE FOUR ROLES (one ticket each, forming a single chained asymptotic narrative).
 *
 *   ROLE 1 -- PEAK-AND-DECAY (imp-3406). Extrapolates the imp-3220 U-shaped sigma(N) decade ladder
 *     past its sampled 10^6 ceiling and shows the right arm does NOT keep widening: sigma(N) has an
 *     interior MAXIMUM at N_max ~ 9.219e5 (sigma_max ~ 0.949429), only ~2.1e-5 above the 10^6
 *     decade-ladder sample, then decays MONOTONICALLY to 0 because the constant truncation floor
 *     E_trunc = 3.06e-5 eventually outlives the vanishing GUE-conditional E_coll ~ sqrt(log T0/N).
 *     Establishes the SHAPE (rise, interior min at N~97.8, interior max at N~9.22e5, monotone decay).
 *
 *   ROLE 2 -- DECAY-RATE-RAMP (imp-33582). Quantifies HOW FAST the post-peak decay of ROLE 1
 *     proceeds: the per-decade local OLS exponent on [1e6,1e12] is not fixed-rate but RAMPS
 *     monotonically ~0.0105 -> ~0.0447 -> ~0.1176 -> ~0.2360 -> ~0.3561 -> ~0.4310, climbing toward
 *     the imp-3463 far-tail asymptote 1/2 from below. Also pins the threshold crossings (sigma < 0.9
 *     at N ~ 2.57e7, < 0.5 at N ~ 3.27e9 -- matching the independent imp-3444 E_coll=E_trunc crossover
 *     to ~0.4% -- and < 0.1 at N ~ 3.21e11).
 *
 *   ROLE 3 -- EXPONENT DECOMPOSITION (imp-97702). Extends the ROLE 2 ramp to [1e12,1e15] and DECIDES
 *     the functional form of the residual to the 1/2 asymptote: it splits EXACTLY as
 *     1/2 - p = (1/2)sigma + a(1-sigma), a POWER-LAW piece (1/2)sigma ~ N^-1/2 (falling ~1/sqrt(10)
 *     per decade) plus a LOGARITHMIC piece a(1-sigma) with a = (1/2) d ln(log T0)/d ln N ~ 1/(2 log T0)
 *     (nearly flat), matching the pointwise ramp to < 2e-5. The two pieces cross at N ~ 3.553e12; past
 *     that the residual is log-dominated, and the deep-tail diagnostic (1/2-p)*2 log T0 settles near
 *     ~0.98 by 1e18-1e24 -- leaving open whether ~0.98 is a floor or an unreached asymptote of 1.
 *
 *   ROLE 4 -- RVM LOG-DERIVATIVE ASYMPTOTE-TO-1 (imp-97723). Resolves the ROLE 3 open question by
 *     extending the grid to 1e300 (the double-precision RvM ceiling) and deriving the CLOSED FORM:
 *     the deep-tail diagnostic (1/2-p)*2 log T0 is EXACTLY the Riemann-von Mangoldt log-derivative
 *     slope d ln T0/d ln N = 1 - 1/log(T0/2pi), which climbs 0.9805 (1e24) -> 0.9989 (1e300) and
 *     converges to EXACTLY 1 -- CASE (i), not a ~0.98 floor. The next-order coefficient in
 *     a = (1/(2 log T0))(1 + c/log T0 + ...) is c(L) = -log T0/(log T0 - ln 2pi) -> -1 from below, the
 *     negative sign being the mechanism of the from-below approach.
 *
 *   WHY GROUP THESE (not re-derive). All four tickets measure the SAME quantity sigma(N) at
 *     successively deeper N and successively sharper questions, forming one continuous asymptotic
 *     narrative (shape -> rate -> functional form -> closed-form limit) that reads, filed
 *     separately across a wide id range (imp-3406 .. imp-97723), as unrelated leaves. This index
 *     bakes the chain so a future scout can find, at a glance, which of the four roles each ticket
 *     answers and how each role's open question becomes the next role's question.
 *
 *   MEASURED/DERIVED (all cohort verdicts; no new numerics beyond what each ticket already committed).
 *   - ROLE 1: interior maximum N_max ~ 9.219e5, sigma_max ~ 0.949429; monotone decay to 0 thereafter
 *     (imp-3406).
 *   - ROLE 2: per-decade exponent ramps 0.0105 -> 0.4310 on [1e6,1e12]; threshold crossings at
 *     N ~ 2.57e7 / 3.27e9 / 3.21e11 for sigma < 0.9/0.5/0.1 (imp-33582).
 *   - ROLE 3: exact two-piece residual split 1/2-p = (1/2)sigma + a(1-sigma), crossover at
 *     N ~ 3.553e12; deep-tail diagnostic reads ~0.98 out to 1e24 (imp-97702).
 *   - ROLE 4: diagnostic IS the exact RvM slope 1 - 1/log(T0/2pi); converges to EXACTLY 1 (not a 0.98
 *     floor), crossing 0.99 near 1e45 and 0.995 near 1e89; next-order coefficient c -> -1 from below
 *     (imp-97723).
 *
 *   NOT ESTABLISHED (what stays open at the end of this batch).
 *   - No rigorous asymptotic derivation anywhere in the chain: all four tickets extrapolate the
 *     inherited imp-3220/imp-3406 component model (C_C 1/8 ansatz, E_trunc fixed-strip route,
 *     effectiveHeightForN RvM inverse), none re-derived.
 *   - The C_mb GUE-conditional (imp-486) and C_C 1/8 ansatz (imp-2642/imp-2643) are UNTOUCHED
 *     throughout; imp-3066 K_a >= 0 untouched.
 *   - No coefficient newly pinned toward a bound; no operator positivity established.
 *
 *   STATUS: a grouping/index note over four already-completed tickets, not a new derivation. No
 *   bound changes: interval-rigorous certified reach stays 2a<=0.96; RH open; NO QED.
 *   Platt-Trudgian Lambda <= 0.2 SOTA.
 *
 * @see imp-3406-sigma-highN-extrapolation.js (ROLE 1: interior maximum, turns over past the 10^6 ceiling)
 * @see imp-33582-sigma-postpeak-nearpeak-threshold-decay.js (ROLE 2: per-decade decay-exponent ramp)
 * @see imp-97702-sigma-fartail-exponent-residual-half-loglaw.js (ROLE 3: exact power-law + log residual split)
 * @see imp-97723-sigma-fartail-diagnostic-asymptote-one.js (ROLE 4: RvM log-derivative slope, converges to exactly 1)
 *
 * Ticket: imp-97752 (meta, low, sonnet-4-6). Documentation/index only; establishes nothing; NO QED;
 * Platt-Trudgian Lambda <= 0.2 SOTA.
 */

const LN3 = Math.log(3); // 1.0986122886681098 -- reference constant carried by convention

const PEAK_AND_DECAY_ROLE = Object.freeze([
  Object.freeze({
    id: 'imp-3406',
    role: 'peak-and-decay',
    step: 'extrapolate the imp-3220 U-shaped sigma(N) decade ladder past the sampled 10^6 ceiling',
    result:
      'the right arm TURNS OVER, not keeps widening: interior MAXIMUM at N_max ~ 9.219e5 ' +
      '(sigma_max ~ 0.949429), only ~2.1e-5 above the 10^6 decade-ladder sample; beyond the peak ' +
      'sigma(N) decays monotonically to 0 as the constant E_trunc = 3.06e-5 floor eventually ' +
      'outlives the vanishing E_coll ~ sqrt(log T0/N).',
  }),
]);

const DECAY_RATE_RAMP_ROLE = Object.freeze([
  Object.freeze({
    id: 'imp-33582',
    role: 'decay-rate-ramp',
    step: 'quantify the per-decade local decay exponent and threshold crossings past the imp-3406 peak',
    result:
      'the per-decade OLS exponent on [1e6,1e12] RAMPS monotonically ~0.0105 -> ~0.4310, climbing ' +
      'toward the imp-3463 far-tail 1/2 from below (not a fixed rate); sigma drops below 0.9 at ' +
      'N ~ 2.57e7, below 0.5 at N ~ 3.27e9 (matching the independent imp-3444 E_coll=E_trunc ' +
      'crossover to ~0.4%), and below 0.1 at N ~ 3.21e11.',
  }),
]);

const EXPONENT_DECOMPOSITION_ROLE = Object.freeze([
  Object.freeze({
    id: 'imp-97702',
    role: 'exponent-decomposition',
    step: 'extend the ramp to [1e12,1e15] and decide the functional form of the residual to the 1/2 asymptote',
    result:
      'the residual splits EXACTLY as 1/2 - p = (1/2)sigma + a(1-sigma) -- a dying POWER-LAW piece ' +
      '(1/2)sigma ~ N^-1/2 plus a nearly-flat LOGARITHMIC piece a(1-sigma), a ~ 1/(2 log T0) -- ' +
      'matching the measured ramp to < 2e-5; the two pieces cross at N ~ 3.553e12, past which the ' +
      'deep-tail diagnostic (1/2-p)*2 log T0 settles near ~0.98 by 1e18-1e24, leaving open whether ' +
      '~0.98 is a floor or an unreached asymptote of exactly 1.',
  }),
]);

const RVM_LOGDERIV_ASYMPTOTE_ROLE = Object.freeze([
  Object.freeze({
    id: 'imp-97723',
    role: 'rvm-log-derivative-asymptote-to-one',
    step: 'extend the diagnostic grid to 1e300 and derive its closed form to decide the imp-97702 open question',
    result:
      'the diagnostic (1/2-p)*2 log T0 IS EXACTLY the Riemann-von Mangoldt log-derivative slope ' +
      'd ln T0/d ln N = 1 - 1/log(T0/2pi); it climbs 0.9805 (1e24) -> 0.9989 (1e300) and converges ' +
      'to EXACTLY 1 -- CASE (i), not a ~0.98 floor; the next-order coefficient c(L) in ' +
      'a = (1/(2 log T0))(1 + c/log T0 + ...) is -log T0/(log T0 - ln 2pi) -> -1 from below, the ' +
      'negative sign being the mechanism of the from-below approach to 1.',
  }),
]);

export const IMP97752_SIGMA_FARTAIL_ASYMPTOTIC_COHORT_INDEX = Object.freeze({
  id: 'imp-97752',
  proofSection: 'S-frontier',
  peakAndDecayRole: PEAK_AND_DECAY_ROLE,
  decayRateRampRole: DECAY_RATE_RAMP_ROLE,
  exponentDecompositionRole: EXPONENT_DECOMPOSITION_ROLE,
  rvmLogDerivativeAsymptoteRole: RVM_LOGDERIV_ASYMPTOTE_ROLE,
  measuredSignal:
    'four sigma(N) = E_coll/E(N) far-tail asymptotic leaves (imp-3406, imp-33582, imp-97702, ' +
    'imp-97723), grouped by role in a single chained narrative: peak-and-decay (shape), ' +
    'decay-rate-ramp (rate), exponent decomposition (functional form of the residual), and the ' +
    'RvM log-derivative asymptote-to-1 (closed-form limit).',
  namedResiduals: [
    'IMP3406_PEAK_AND_DECAY_TURNS_OVER_AT_9P219E5',
    'IMP33582_DECAY_RATE_RAMPS_NOT_FIXED',
    'IMP97702_RESIDUAL_EXACT_POWERLAW_PLUS_LOG_SPLIT',
    'IMP97723_DIAGNOSTIC_CONVERGES_TO_EXACTLY_ONE',
  ],
  certifiedReach: 0.96,
  role1PeakN: 9.219e5,
  role1SigmaMax: 0.949429,
  role2ExponentFirstDecade: 0.0105,
  role2ExponentLastDecade: 0.4310,
  role2HalfCrossingN: 3.27e9,
  role3CrossoverN: 3.553e12,
  role3DeepTailReadAt1e24: 0.98,
  role4DiagnosticLimit: 1,
  role4NextOrderCoefficientLimit: -1,
  farTailExponent: 0.5,
  lowerBoundOnLambda2Proved: false,
  coercivityConstantProved: false,
  mcmProved: false,
  anyBoundMoved: false,
  question:
    'The four sigma(N) far-tail asymptotic tickets imp-3406, imp-33582, imp-97702, imp-97723, filed ' +
    'across a wide id range, each measure a progressively sharper question about the same quantity. ' +
    'Split by role -- peak-and-decay (imp-3406) versus decay-rate-ramp (imp-33582) versus exponent ' +
    'decomposition (imp-97702) versus RvM log-derivative asymptote-to-1 (imp-97723) -- does each ' +
    'settle a distinct link in the chain, and does the chain close (does ROLE 4 resolve the open ' +
    'question ROLE 3 left)?',
  verdict:
    'INDEX/META NOTE ONLY (no new derivation). The chain closes: ROLE 1 (imp-3406) establishes the ' +
    'sigma(N) right arm turns over at N_max ~ 9.22e5 and decays to 0, not keeps widening; ROLE 2 ' +
    '(imp-33582) quantifies that decay as a RAMPING (not fixed-rate) per-decade exponent climbing ' +
    'toward 1/2, with threshold crossings that independently corroborate the imp-3444 crossover; ' +
    'ROLE 3 (imp-97702) decomposes the residual to 1/2 EXACTLY into a dying power-law piece and a ' +
    'nearly-flat logarithmic piece, leaving open whether the deep-tail diagnostic floors at ~0.98 or ' +
    'approaches exactly 1; ROLE 4 (imp-97723) CLOSES that question by deriving the diagnostic as the ' +
    'exact Riemann-von Mangoldt log-derivative slope, proving convergence to EXACTLY 1 with a ' +
    'negative next-order coefficient. No bound moves in any role: interval-rigorous certified reach ' +
    'stays EXACTLY 2a<=0.96, the C_mb GUE-conditional (imp-486) and C_C 1/8 ansatz ' +
    '(imp-2642/imp-2643) stay untouched throughout, and no operator positivity is established. RH ' +
    'open; NO QED. Platt-Trudgian Lambda <= 0.2 remains SOTA.',
  citation:
    'imp-3406 (interior maximum, turns over at N~9.22e5); imp-33582 (per-decade exponent ramp, ' +
    'threshold crossings); imp-97702 (exact power-law + log residual split, crossover N~3.553e12); ' +
    'imp-97723 (RvM log-derivative closed form, converges to exactly 1).',
  ln3: LN3,
});

export default IMP97752_SIGMA_FARTAIL_ASYMPTOTIC_COHORT_INDEX;

// -- Tripwire assertions ------------------------------------------------------
export const IMP97752_SIGMA_FARTAIL_ASYMPTOTIC_COHORT_INDEX_ASSERTIONS = [
  {
    id: 'imp97752-all-four-roles-present-and-correctly-tagged',
    why: 'The four-role split must contain exactly the four sigma far-tail tickets, one per role, ' +
      'and each role array must tag its member with the matching role string.',
    holds: () => {
      const idx = IMP97752_SIGMA_FARTAIL_ASYMPTOTIC_COHORT_INDEX;
      const roles = [
        [idx.peakAndDecayRole, 'imp-3406', 'peak-and-decay'],
        [idx.decayRateRampRole, 'imp-33582', 'decay-rate-ramp'],
        [idx.exponentDecompositionRole, 'imp-97702', 'exponent-decomposition'],
        [idx.rvmLogDerivativeAsymptoteRole, 'imp-97723', 'rvm-log-derivative-asymptote-to-one'],
      ];
      return roles.every(
        ([arr, id, role]) => arr.length === 1 && arr[0].id === id && arr[0].role === role,
      );
    },
  },
  {
    id: 'imp97752-four-tickets-total-no-overlap',
    why: 'The index covers exactly four tickets in four disjoint roles; an overlap or a dropped ' +
      'ticket would misreport the cohort.',
    holds: () => {
      const idx = IMP97752_SIGMA_FARTAIL_ASYMPTOTIC_COHORT_INDEX;
      const allIds = [
        ...idx.peakAndDecayRole.map((c) => c.id),
        ...idx.decayRateRampRole.map((c) => c.id),
        ...idx.exponentDecompositionRole.map((c) => c.id),
        ...idx.rvmLogDerivativeAsymptoteRole.map((c) => c.id),
      ];
      const noOverlap = new Set(allIds).size === allIds.length;
      return (
        allIds.length === 4 &&
        noOverlap &&
        Array.isArray(idx.namedResiduals) &&
        idx.namedResiduals.length === 4
      );
    },
  },
  {
    id: 'imp97752-role1-peak-value-consistent-with-source',
    why: 'imp-3406 pinned the interior maximum near N ~ 9.22e5 with sigma_max ~ 0.9494; the index ' +
      'must not misreport either magnitude.',
    holds: () => {
      const idx = IMP97752_SIGMA_FARTAIL_ASYMPTOTIC_COHORT_INDEX;
      return (
        Math.abs(idx.role1PeakN / 9.219e5 - 1) < 0.01 &&
        idx.role1SigmaMax > 0.9 &&
        idx.role1SigmaMax < 1
      );
    },
  },
  {
    id: 'imp97752-role2-exponent-ramp-increases-toward-half',
    why: 'imp-33582 established the per-decade exponent ramps upward from a small first-decade ' +
      'value toward (but not past) the far-tail 1/2 asymptote.',
    holds: () => {
      const idx = IMP97752_SIGMA_FARTAIL_ASYMPTOTIC_COHORT_INDEX;
      return (
        idx.role2ExponentFirstDecade > 0 &&
        idx.role2ExponentLastDecade > idx.role2ExponentFirstDecade &&
        idx.role2ExponentLastDecade < idx.farTailExponent
      );
    },
  },
  {
    id: 'imp97752-role4-closes-role3-open-question-toward-exactly-one',
    why: 'imp-97702 left open whether the deep-tail diagnostic floors at ~0.98 or approaches exactly ' +
      '1; imp-97723 closes it toward exactly 1 with a negative next-order coefficient -- the index ' +
      'must state the resolved limit, not the still-open ~0.98 read.',
    holds: () => {
      const idx = IMP97752_SIGMA_FARTAIL_ASYMPTOTIC_COHORT_INDEX;
      return (
        idx.role4DiagnosticLimit === 1 &&
        idx.role4NextOrderCoefficientLimit < 0 &&
        idx.role3DeepTailReadAt1e24 < idx.role4DiagnosticLimit
      );
    },
  },
  {
    id: 'imp97752-honesty-gate-no-qed',
    why: 'Documentation/index only: no bound claimed moved, no QED, PT SOTA line present.',
    holds: () => {
      const idx = IMP97752_SIGMA_FARTAIL_ASYMPTOTIC_COHORT_INDEX;
      return (
        idx.anyBoundMoved === false &&
        idx.certifiedReach === 0.96 &&
        idx.certifiedReach < idx.ln3 &&
        /NO QED/.test(idx.verdict) &&
        /remains SOTA/.test(idx.verdict) &&
        /2a<=0\.96/.test(idx.verdict)
      );
    },
  },
];

for (const assertion of IMP97752_SIGMA_FARTAIL_ASYMPTOTIC_COHORT_INDEX_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(
      `imp-97752-sigma-fartail-asymptotic-cohort-index assertion failed: ${assertion.id}`,
    );
  }
}
