/**
 * @module imp-97282-route-m-cotangent-c1-m2w-cohort-index
 * @fileoverview imp-97282 -- META cross-reference index note grouping the Route M cotangent
 *   SINGLE-SCALAR OBLIGATION cohort (imp-97180 termwise obstruction / imp-97203 Cauchy-Schwarz
 *   reduction / imp-97204 termwise domination / imp-97225 oversampling ladder / imp-97226
 *   cancellation ratio ladder) as the c_1/M2w-ONLY family the imp-97210 ledger names: the whole
 *   positivity of kappa = kappa_arith + kappa_cot rests on ONE open scalar inequality, not five
 *   separate gaps. Index/meta only; establishes nothing new; changes no bound; NO QED.
 *
 *   THE COHORT (chronological). All five act on the imp-97097 operative varying-modulus cotangent
 *   half S(b) = Sum_{a=2,(a,b)=1}^{b-1} V(b,a), V(b,a) = c_0(h_a/a) (h_a = b-inverse mod a), and its
 *   absolute companion A(b) = Sum_a |c_0(h_a/a)|.
 *     imp-97180 -- rules out an elementary termwise bound |c_0(h/a)| <= K (a/h') log(2a) (worst,
 *       not best, at h' ~ a/2); splits A(b) into a decaying small-inverse tail and a bulk carrying
 *       the constant A(b)/(phi(b) b) ~ 0.145, identifying it as a Bettin-Conrey ABSOLUTE first
 *       moment with no elementary closed form.
 *     imp-97203 -- gives the RIGOROUS, unconditional Cauchy-Schwarz reduction c_1 <= sqrt(M2w),
 *       c_1 = A(b)/(phi(b) b), M2w the a-weighted inverse-line second moment; measures the ceiling
 *       sqrt(M2w) ~ 0.41 clears the target kappa_arith = 0.5705 with ~1.38x margin.
 *     imp-97204 -- proves the EXACT termwise domination |S(b)| <= A(b) (triangle inequality), so
 *       certifying the imp-97180/97203 absolute constant c ALSO certifies the two-sided bound on
 *       kappa_cot (with the extra -(pi/2) weight), collapsing the "signed lower bound" into the
 *       same absolute-value program -- no separate Bettin-Conrey input needed.
 *     imp-97225 -- extends the imp-97203 inverse-map oversampling ratio OVR(b) = M2w / (full-residue
 *       second moment) to b up to 4001: OVR converges to a bounded ~1.25 constant with no drift, so
 *       the residual equidistribution transfer has a fixed (not growing) target.
 *     imp-97226 -- extends the imp-97204 cancellation ratio |S(b)|/A(b) to b up to 24001: stable at
 *       ~0.540 with no drift, confirming the absolute route's ~46% discarded cancellation persists
 *       and quantifying (not certifying) the sharper signed constant ~0.0795 it would buy.
 *
 *   WHY GROUP THESE (not re-derive). Read individually, imp-97180 reads as a ruled-out approach
 *   note, imp-97203 as an isolated Cauchy-Schwarz trick, imp-97204 as an unrelated triangle-
 *   inequality remark, and imp-97225/97226 as two more numerical ladders among many. Read together,
 *   the five collapse the ENTIRE Route M cotangent-positivity obligation onto one scalar: certify
 *   c_1 (equivalently M2w) below kappa_arith and BOTH the absolute-value route (imp-97180/97203) and
 *   the signed route (imp-97204, dominated by the same c) close at once, with imp-97225/97226
 *   confirming the two auxiliary quantities the certification would need (oversampling, cancellation)
 *   are bounded constants, not growing. This index bakes that reading so a future scout does not
 *   re-attempt the elementary termwise bound (already ruled out), does not treat the signed and
 *   absolute cotangent bounds as two separate open problems (already unified), and does not re-run
 *   the OVR/cancellation ladders already pushed to b=4001/24001 with no drift found.
 *
 *   MEASURED / DERIVED (what each leaf actually establishes).
 *   - the elementary termwise bound |c_0(h/a)| <= K (a/h') log(2a) does NOT hold uniformly (worst at
 *     h' ~ a/2, the bulk); A(b)/(phi(b) b) is a bounded Bettin-Conrey absolute-first-moment constant
 *     ~0.145 with no elementary closed form (imp-97180, rigorous ruling-out + measurement).
 *   - c_1 = A(b)/(phi(b) b) <= sqrt(M2w) exactly (finite Cauchy-Schwarz, no hypothesis); measured
 *     sqrt(M2w) ~0.41 clears kappa_arith = 0.5705 by ~1.38x, c_1 itself flat ~0.29 (imp-97203,
 *     rigorous reduction + measurement).
 *   - |S(b)| <= A(b) exactly for every b (triangle inequality); certifying c < (2/pi) kappa_arith =
 *     0.36319 certifies the two-sided kappa_cot bound with NO extra Bettin-Conrey input (imp-97204,
 *     rigorous domination).
 *   - the oversampling factor OVR(b) = M2w / full-residue second moment converges to a bounded ~1.25
 *     constant, flat over b in [701,4001], no drift (imp-97225, measurement, no bound moved).
 *   - the cancellation ratio |S(b)|/A(b) is stable at ~0.540 over b in [101,24001], no drift; the
 *     achievable direct-signed sharpening over the absolute majorant is a stable ~1.85x (imp-97226,
 *     measurement, no bound moved).
 *
 *   NOT ESTABLISHED (what stays open).
 *   - c_1 < kappa_arith = 0.5705 (equivalently M2w < 0.32546) is measured (~0.29 / ~0.17) but NOT
 *     certified; the sole remaining open input is the inverse-map second-moment-equidistribution
 *     transfer from the full-residue Bettin-Conrey mean square to the inverse line a |-> b^{-1} mod a.
 *   - a direct (non-dominated) signed Bettin-Conrey mean value for S(b) is not evaluated; imp-97204
 *     shows it is NOT NEEDED for positivity, only that it would sharpen the constant ~1.85x.
 *
 *   STATUS: a grouping/index note over five already-completed tickets, not a new derivation. No bound
 *   changes: the whole Route M cotangent-positivity obligation is confirmed to rest on the single
 *   scalar c_1/M2w; no refereed bound is changed; RH open; NO QED.
 *
 * @see imp-97097-route-m-cotangent-first-moment-evaluation.js (defines S(b), V(b,a), the operative half)
 * @see imp-97180-route-m-cotangent-absvalue-bulk-firstmoment-obstruction.js (rules out termwise route)
 * @see imp-97203-route-m-cotangent-absvalue-first-moment-cauchy-schwarz.js (c_1 <= sqrt(M2w))
 * @see imp-97204-route-m-cotangent-signed-firstmoment-lower-bound.js (|S| <= A, signed dominated by absolute)
 * @see imp-97225-route-m-inverse-oversampling-ratio-ladder.js (OVR -> ~1.25, bounded)
 * @see imp-97226-route-m-cotangent-cancellation-ratio-ladder.js (|S|/A -> ~0.540, bounded)
 * @see imp-97210-route-m-kappa-obligation-ledger.js (names the single-scalar obligation this cohort feeds)
 * @see project_route_m_lower_companion_first_moment (Route M first-moment program, memory)
 *
 * Ticket: imp-97282 (meta, low, sonnet-4-6). Documentation/index only; establishes nothing; NO QED;
 * no refereed bound is changed.
 */

const KAPPA_ARITH = 0.5704960511308594; // imp-97096, exact
const KAPPA_ARITH_SQUARED_TARGET = KAPPA_ARITH * KAPPA_ARITH; // M2w target, 0.32546...
const COTANGENT_THRESHOLD = (2 / Math.PI) * KAPPA_ARITH; // signed-bound threshold, imp-97204 Result 2

const ROUTE_M_COTANGENT_C1_M2W_COHORT = Object.freeze([
  Object.freeze({
    id: 'imp-97180',
    role: 'rules out an elementary termwise bound and identifies the bulk-carried absolute constant',
    result:
      'no uniform bound |c_0(h/a)| <= K (a/hred) log(2a) exists (worst at hred ~ a/2); A(b)/(phi(b) b) ' +
      'is a bounded Bettin-Conrey absolute-first-moment constant ~0.145 with no elementary closed form.',
  }),
  Object.freeze({
    id: 'imp-97203',
    role: 'reduces the absolute first moment to a mean square via Cauchy-Schwarz',
    result:
      'c_1 = A(b)/(phi(b) b) <= sqrt(M2w) exactly (finite Cauchy-Schwarz, no hypothesis); measured ' +
      'sqrt(M2w) ~0.41 clears kappa_arith = 0.5705 by ~1.38x, c_1 itself flat ~0.29.',
  }),
  Object.freeze({
    id: 'imp-97204',
    role: 'proves the signed cotangent half is dominated by the same absolute-value program',
    result:
      '|S(b)| <= A(b) exactly (triangle inequality); certifying c < (2/pi) kappa_arith = 0.36319 ' +
      'certifies the two-sided kappa_cot bound with NO additional Bettin-Conrey input.',
  }),
  Object.freeze({
    id: 'imp-97225',
    role: 'extends the inverse-map oversampling ratio ladder to test for drift',
    result:
      'OVR(b) = M2w / full-residue second moment converges to a bounded ~1.25 constant, flat over ' +
      'b in [701,4001], no drift.',
  }),
  Object.freeze({
    id: 'imp-97226',
    role: 'extends the signed-vs-absolute cancellation ratio ladder to test for drift',
    result:
      '|S(b)|/A(b) is stable at ~0.540 over b in [101,24001], no drift; the achievable direct-signed ' +
      'sharpening over the absolute majorant is a stable ~1.85x.',
  }),
]);

export const IMP97282_ROUTE_M_COTANGENT_C1_M2W_COHORT_INDEX = Object.freeze({
  id: 'imp-97282',
  proofSection: 'S-frontier',
  cohort: ROUTE_M_COTANGENT_C1_M2W_COHORT,
  measuredSignal:
    'the entire Route M cotangent-positivity obligation (both the absolute-value route and the ' +
    'signed route, which imp-97204 shows is dominated by the same constant) rests on ONE open ' +
    'scalar inequality -- c_1 < kappa_arith, equivalently M2w < 0.32546 -- with the two auxiliary ' +
    'ladders (imp-97225 oversampling, imp-97226 cancellation) confirming bounded, non-drifting ' +
    'constants rather than growing obstructions.',
  namedResiduals: [
    'IMP97203_INVERSE_MAP_SECOND_MOMENT_EQUIDISTRIBUTION_TRANSFER_OPEN',
    'IMP97204_DIRECT_SIGNED_MEAN_VALUE_NOT_EVALUATED',
  ],
  kappaArith: KAPPA_ARITH,
  m2wTarget: KAPPA_ARITH_SQUARED_TARGET,
  cotangentThreshold: COTANGENT_THRESHOLD,
  overSamplingAsymptote: 1.25, // imp-97225: OVR(b) -> ~1.25, flat over b in [701,4001]
  cancellationRatioAsymptote: 0.540, // imp-97226: |S(b)|/A(b) -> ~0.540, flat over b in [101,24001]
  signedDominatedByAbsolute: true, // imp-97204 Result 1
  anyBoundMoved: false,
  question:
    'The Route M cotangent-positivity leaves (imp-97180/97203/97204/97225/97226) read as five ' +
    'separate items -- a ruled-out approach, a moment trick, a triangle-inequality remark, and two ' +
    'numerical ladders. Grouped, do they collapse to a single open obligation, and is there any ' +
    'residual drift in the auxiliary quantities that certification would need to control?',
  verdict:
    'INDEX/META NOTE ONLY (no new derivation). imp-97180 rules out the elementary termwise route and ' +
    'isolates a bounded absolute constant; imp-97203 reduces that constant to a mean square via an ' +
    'exact Cauchy-Schwarz inequality; imp-97204 proves the signed cotangent half is dominated by the ' +
    'SAME absolute constant, unifying what looked like two separate open bounds into one; imp-97225 ' +
    'and imp-97226 push the two auxiliary ratios (oversampling, cancellation) the certification would ' +
    'need an order of magnitude further in b and find no drift. Together these five form the ' +
    'c_1/M2w-ONLY family: the entire Route M cotangent-positivity obligation rests on a single open ' +
    'scalar inequality, and every auxiliary quantity feeding it is a measured bounded constant, not a ' +
    'growing one. Establishes nothing new; moves no bound; RH open; NO QED. No refereed bound is changed' +
    '.',
  citation:
    'imp-97180 (termwise obstruction, bulk-carried constant); imp-97203 (Cauchy-Schwarz reduction ' +
    'c_1 <= sqrt(M2w)); imp-97204 (signed half dominated by the absolute constant, |S| <= A); ' +
    'imp-97225 (oversampling OVR -> ~1.25, no drift); imp-97226 (cancellation |S|/A -> ~0.540, no drift).',
});

export default IMP97282_ROUTE_M_COTANGENT_C1_M2W_COHORT_INDEX;

// -- Tripwire assertions ------------------------------------------------------
export const IMP97282_ROUTE_M_COTANGENT_C1_M2W_COHORT_INDEX_ASSERTIONS = [
  {
    id: 'imp97282-cohort-has-all-five-members',
    why: 'The whole point of the index is grouping exactly these five tickets; a missing member ' +
      'silently breaks the cross-reference.',
    holds: () => {
      const ids = IMP97282_ROUTE_M_COTANGENT_C1_M2W_COHORT_INDEX.cohort.map((c) => c.id);
      return ['imp-97180', 'imp-97203', 'imp-97204', 'imp-97225', 'imp-97226'].every((id) =>
        ids.includes(id),
      );
    },
  },
  {
    id: 'imp97282-kappa-arith-matches-imp97096',
    why: 'The index quotes the proved arithmetic-leaf coefficient; it must match imp-97096/97202 ' +
      'bit-for-bit, not a rounded restatement.',
    holds: () =>
      Math.abs(IMP97282_ROUTE_M_COTANGENT_C1_M2W_COHORT_INDEX.kappaArith - 0.5704960511308594) < 1e-12,
  },
  {
    id: 'imp97282-cotangent-threshold-matches-imp97204',
    why: 'imp-97204 derives the -(pi/2)-weighted threshold (2/pi) kappa_arith = 0.36319 for the ' +
      'signed bound; a mismatch would silently misstate the sharper target.',
    holds: () =>
      Math.abs(
        IMP97282_ROUTE_M_COTANGENT_C1_M2W_COHORT_INDEX.cotangentThreshold - 0.36318906620753183,
      ) < 1e-10,
  },
  {
    id: 'imp97282-signed-dominated-by-absolute',
    why: 'The whole point of this index is that imp-97204 unifies the signed and absolute routes; a ' +
      'flipped flag would silently misrepresent the settled reduction.',
    holds: () => IMP97282_ROUTE_M_COTANGENT_C1_M2W_COHORT_INDEX.signedDominatedByAbsolute === true,
  },
  {
    id: 'imp97282-named-residuals-present',
    why: 'The index exists to surface the open sub-gap by name, so future work can find it without ' +
      're-reading all five tickets.',
    holds: () => {
      const idx = IMP97282_ROUTE_M_COTANGENT_C1_M2W_COHORT_INDEX;
      return (
        Array.isArray(idx.namedResiduals) &&
        idx.namedResiduals.includes('IMP97203_INVERSE_MAP_SECOND_MOMENT_EQUIDISTRIBUTION_TRANSFER_OPEN') &&
        idx.namedResiduals.includes('IMP97204_DIRECT_SIGNED_MEAN_VALUE_NOT_EVALUATED') &&
        idx.anyBoundMoved === false
      );
    },
  },
  {
    id: 'imp97282-honesty-gate-no-qed',
    why: 'Documentation/index only: no bound claimed moved, no QED, no-refereed-bound-change line present.',
    holds: () =>
      /NO QED/.test(IMP97282_ROUTE_M_COTANGENT_C1_M2W_COHORT_INDEX.verdict) &&
      /refereed bound is changed/i.test(IMP97282_ROUTE_M_COTANGENT_C1_M2W_COHORT_INDEX.verdict) &&
      /RH open/.test(IMP97282_ROUTE_M_COTANGENT_C1_M2W_COHORT_INDEX.verdict),
  },
];

for (const assertion of IMP97282_ROUTE_M_COTANGENT_C1_M2W_COHORT_INDEX_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(
      `imp-97282-route-m-cotangent-c1-m2w-cohort-index assertion failed: ${assertion.id}`,
    );
  }
}
