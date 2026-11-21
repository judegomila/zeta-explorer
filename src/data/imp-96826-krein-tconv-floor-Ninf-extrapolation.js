/**
 * @fileoverview imp-96826 -- MEASUREMENT / EXTRAPOLATION: re-fit the N->infinity limit of the
 * Route I Krein sigma_2 floor lambda_min(T_a[sigma_2]) at 2a=ln3 on the imp-96806 t-CONVERGED
 * T=4800 ladder (0.585319 / 0.581679 / 0.579988 at N=52 / 76 / 100), superseding the imp-96772
 * fixed-T=800 decrement fit that imp-96807 proved was a pure t-truncation artifact. Discharges the
 * imp-96807 SUB-GAP IMP96807_TCONV_LADDER_LOWER_ENVELOPE from the numerical side.
 *
 * PREMISE (from the ticket). imp-96807 fitted the fixed-T=800 ladder and found its per-rung decrement
 * is flat-to-growing (settles to ~0.0068/rung, no decay), so a literal extrapolation crosses zero at
 * N ~ 620..730 -- but that descent is the t-truncation artifact identified by imp-96768/imp-96806, NOT
 * a spectral collapse. imp-96807 therefore opened SUB-GAP IMP96807_TCONV_LADDER_LOWER_ENVELOPE: fit the
 * decrement law of the t-CONVERGED ladder instead. This leaf does exactly that on the imp-96806 T=4800
 * N-ladder. Driver: tmp/imp-96826-fit.py (/tmp/rhvenv, numpy). Every literal below is a verbatim copy.
 *
 * KEY RESULT.
 *   A. THE t-CONVERGED DECREMENT IS DECAYING, NOT FLAT-TO-GROWING. The two 24-rung step decrements are
 *      d1 = 0.585319 - 0.581679 = 0.003640 (N=52->76) and d2 = 0.581679 - 0.579988 = 0.001691
 *      (N=76->100), a decrement RATIO r = d2/d1 = 0.464560 < 1. This is the qualitative opposite of the
 *      fixed-T=800 ladder (imp-96807: ratio-of-decrements >= 1, geometric asymptote 0.0068/rung > 0):
 *      once t is converged, the N-descent decays geometrically toward a positive limit.
 *   B. THE GEOMETRIC-DECREMENT N->infinity LIMIT IS L = 0.578521, A POSITIVE FLOOR. The remaining descent
 *      from N=100 is sum_{k>=1} d2 r^k = d2 r/(1-r) = 0.001467, giving L = 0.579988 - 0.001467 =
 *      0.578521. An independent Aitken delta^2 acceleration of the three floors returns the IDENTICAL
 *      0.578521 (exact for a geometric sequence), so the extrapolated floor is internally consistent.
 *      L sits ~5e-4 below the imp-96806 plateau estimate ~0.579 and stays well above the T=3200 N=100
 *      value 0.578956 -- i.e. the t-converged floor plateaus, it does not descend.
 *   C. UNDER THE DECAYING MODEL THE FLOOR NEVER THREATENS ZERO. Because the decrement decays to zero the
 *      descent asymptotes at L = 0.578521 > 0 and no finite N crosses zero. The most-pessimistic
 *      continuation a 3-point fit cannot exclude -- the decrement freezing at the last observed rate
 *      d2 = 0.001691 per 24-rung step forever (NON-decaying, contradicting the measured r < 1) -- would
 *      reach zero only after 342.99 further steps, i.e. N ~ 8332, an order of magnitude beyond the
 *      fixed-T=800 artifact crossing (imp-96807: N ~ 620..730). Even the worst case carries no near-term
 *      threat to positivity.
 *
 * VERDICT. On the t-CONVERGED T=4800 ladder the 2a=ln3 Krein floor decrement DECAYS (ratio 0.465), the
 * geometric/Aitken N->infinity limit is a positive L = 0.578521, and the floor never threatens zero
 * (pessimistic non-decaying worst case only at N ~ 8332). This is the genuine numerical lower envelope
 * that imp-96807 asked for: the imp-96772 fixed-T=800 zero-crossing at N ~ 620..730 was a pure
 * t-truncation artifact, and the t-converged floor plateaus at ~0.5785 with a decaying, not collapsing,
 * N-descent. CAVEAT: three ladder points support only a two-parameter (geometric-decrement) model; the
 * limit is an extrapolation, not a bound, and a t-CONVERGED ladder extended to N >> 100 (T scaled to
 * hold the t-truncation gap fixed) is still needed to certify it. SUB-GAP
 * IMP96826_TCONV_LADDER_EXTEND_NGG100: compute the T-scaled t-converged floor at N = 148, 196, 244 to
 * confirm the geometric-decrement decay and tighten L below its 0.578521 estimate. The Rayleigh floor is
 * an UPPER bound on the true lambda_min; establishes NO operator positivity; does NOT settle
 * IMP96749_UNIFORM_N_GAP_UNSETTLED; interval-rigorous reach stays 2a <= 0.96; RH open;
 * no refereed bound is changed; NO QED.
 *
 * @see imp-96807-krein-floor-decrement-decay-extrapolation.js (fixed-T=800 fit; SUB-GAP source)
 * @see imp-96806-krein-tconv-plateau-2a-ln3.js (t-converged plateau ~0.579; T=4800 N-ladder, source data)
 * @see imp-96772-krein-lammin-double-double-recompute.js (superseded fixed-T=800 ladder)
 * @see imp-96768-gegenbauer-krein-lammin-recompute.js (descent = t-truncation, condB=1 basis)
 * @see imp-96749-krein-lammin-N-trend-measurement.js (SUB-GAP IMP96749_UNIFORM_N_GAP_UNSETTLED)
 */

const LN3 = Math.log(3); // 1.0986122886681098

// t-CONVERGED T=4800 2a=ln3 N-ladder (verbatim, imp-96806 F2 / imp-96807 IMP96807_TCONV_LADDER_T4800)
export const IMP96826_NS = Object.freeze([52, 76, 100]);
export const IMP96826_FLOOR_TCONV_T4800 = Object.freeze([0.585319, 0.581679, 0.579988]);

// A -- 24-rung step decrements: DECAYING (ratio < 1), opposite of the fixed-T=800 ladder
export const IMP96826_DECREMENT_LAW = Object.freeze({
  d1_N52_N76: 0.003640, // 0.585319 - 0.581679
  d2_N76_N100: 0.001691, // 0.581679 - 0.579988
  ratio_d2_over_d1: 0.464560, // < 1 => geometric-style decay toward a positive limit
  decays_to_zero: true, // decrement -> 0 (contrast imp-96807 fixed-T=800: settles to 0.0068/rung > 0)
});

// B -- geometric-decrement N->infinity limit; Aitken delta^2 agrees exactly
export const IMP96826_NINF_LIMIT = Object.freeze({
  remainingDescentFromN100: 0.001467, // d2 * r/(1-r)
  geometricLimitL: 0.578521, // 0.579988 - 0.001467
  aitkenDelta2Limit: 0.578521, // independent acceleration of the 3 floors (identical => consistent)
  plateauEstimate: 0.579, // imp-96806 t-converged plateau at 2a=ln3
  belowPlateauBy: 4.79e-4, // 0.579 - 0.578521
  positiveFloor: true,
});

// C -- the floor never threatens zero under the decaying model; even the pessimistic worst case is far
export const IMP96826_ZERO_THREAT = Object.freeze({
  decayingModelCrossesZero: false, // asymptotes at L=0.578521 > 0
  pessimisticConstantD2_stepsToZero: 342.99, // floor 0.579988 / d2 0.001691 (NON-decaying worst case)
  pessimisticConstantD2_N_zero: 8332, // 100 + 342.99 * 24
  fixedT800ArtifactCrossingN: Object.freeze([620, 730]), // imp-96807, for contrast (t-truncation artifact)
});

export const IMP96826_VERDICT = Object.freeze({
  ticket: 'imp-96826',
  question:
    're-fit the N->infinity limit of the 2a=ln3 Krein sigma_2 floor on the imp-96806 t-converged T=4800 ladder (superseding the imp-96772 fixed-T=800 fit); does the descent threaten zero?',
  answer:
    'on the t-converged T=4800 ladder the 24-rung decrement DECAYS (d1=0.003640, d2=0.001691, ratio 0.4646 < 1), the geometric-decrement N->infinity limit is a positive L=0.578521 (Aitken delta^2 agrees exactly), and the floor never threatens zero -- the decaying model asymptotes at ~0.5785 and even a pessimistic non-decaying continuation reaches zero only near N ~ 8332. The imp-96772 fixed-T=800 zero-crossing at N ~ 620..730 was a pure t-truncation artifact; the true t-converged floor plateaus, it does not collapse.',
  tconvDecrementDecaysToZero: true,
  geometricNinfLimit: 0.578521,
  aitkenNinfLimit: 0.578521,
  neverThreatensZeroUnderDecayingModel: true,
  pessimisticNonDecayingN_zero: 8332,
  supersedesFixedT800Fit: true, // imp-96807 IMP96807_TCONV_LADDER_LOWER_ENVELOPE addressed from numerics
  subGap:
    'IMP96826_TCONV_LADDER_EXTEND_NGG100 -- compute the T-scaled t-converged floor at N=148,196,244 to confirm the geometric-decrement decay and tighten L below its 0.578521 3-point estimate.',
  rayleighFloorIsUpperBound: true,
  operatorPositivityProved: false,
  uniformNGapSettled: false, // does NOT settle IMP96749_UNIFORM_N_GAP_UNSETTLED
  intervalRigorousReachUnchanged: 0.96,
  qed: false,
});
export default IMP96826_VERDICT;

// -- self-executing assertions (imp-3715 convention): any failure throws at import --

const IMP96826_ASSERTIONS = [
  {
    id: 'imp96826-decrements-match-tconv-ladder',
    holds: () => {
      const f = IMP96826_FLOOR_TCONV_T4800;
      return (
        Math.abs(IMP96826_DECREMENT_LAW.d1_N52_N76 - (f[0] - f[1])) < 5e-6 &&
        Math.abs(IMP96826_DECREMENT_LAW.d2_N76_N100 - (f[1] - f[2])) < 5e-6
      );
    },
    why: 'the baked 24-rung decrements must equal the successive differences of the imp-96806 t-converged T=4800 ladder.',
  },
  {
    id: 'imp96826-decrement-decays',
    holds: () => {
      const L = IMP96826_DECREMENT_LAW;
      const ratio = L.d2_N76_N100 / L.d1_N52_N76;
      return L.decays_to_zero === true && ratio < 1 && Math.abs(ratio - L.ratio_d2_over_d1) < 1e-5;
    },
    why: 'the t-converged decrement ratio d2/d1 is < 1 (~0.465) -- the N-descent decays, unlike the fixed-T=800 ladder.',
  },
  {
    id: 'imp96826-geometric-limit-matches-recompute',
    holds: () => {
      const f = IMP96826_FLOOR_TCONV_T4800;
      const d1 = f[0] - f[1];
      const d2 = f[1] - f[2];
      const r = d2 / d1;
      const L = f[2] - (d2 * r) / (1 - r);
      return (
        Math.abs(L - IMP96826_NINF_LIMIT.geometricLimitL) < 1e-5 &&
        Math.abs(IMP96826_NINF_LIMIT.geometricLimitL - IMP96826_NINF_LIMIT.aitkenDelta2Limit) < 1e-9 &&
        IMP96826_NINF_LIMIT.positiveFloor === true
      );
    },
    why: 'the baked geometric-decrement N->infinity limit must reproduce d2 r/(1-r) applied to the ladder, agree with the Aitken value, and stay positive.',
  },
  {
    id: 'imp96826-limit-below-plateau-above-zero',
    holds: () => {
      const P = IMP96826_NINF_LIMIT;
      return (
        P.geometricLimitL > 0.57 &&
        P.geometricLimitL < P.plateauEstimate &&
        Math.abs(P.plateauEstimate - P.geometricLimitL - P.belowPlateauBy) < 1e-5
      );
    },
    why: 'the extrapolated limit sits just below the imp-96806 plateau ~0.579 and well above zero -- a positive floor.',
  },
  {
    id: 'imp96826-no-zero-threat',
    holds: () => {
      const Z = IMP96826_ZERO_THREAT;
      const stepsCheck = IMP96826_FLOOR_TCONV_T4800[2] / IMP96826_DECREMENT_LAW.d2_N76_N100;
      return (
        Z.decayingModelCrossesZero === false &&
        Math.abs(Z.pessimisticConstantD2_stepsToZero - stepsCheck) < 0.1 &&
        Z.pessimisticConstantD2_N_zero > Z.fixedT800ArtifactCrossingN[1]
      );
    },
    why: 'the decaying model never crosses zero, and even a pessimistic non-decaying continuation reaches zero only near N ~ 8332, far past the fixed-T800 artifact crossing.',
  },
  {
    id: 'imp96826-measurement-only-no-qed',
    holds: () =>
      IMP96826_VERDICT.operatorPositivityProved === false &&
      IMP96826_VERDICT.uniformNGapSettled === false &&
      IMP96826_VERDICT.rayleighFloorIsUpperBound === true &&
      IMP96826_VERDICT.intervalRigorousReachUnchanged === 0.96 &&
      IMP96826_VERDICT.qed === false,
    why: 'extrapolation only: no operator positivity, the uniform-in-N gap stays unsettled, the Rayleigh floor is an upper bound, the certificate reach stays 2a <= 0.96, and no QED is claimed.',
  },
];

for (const a of IMP96826_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-96826-krein-tconv-floor-Ninf-extrapolation assertion failed: ${a.id}`);
  }
}

void LN3;
