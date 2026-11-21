/**
 * @module data/imp-96387-ecoll-anchor-count-model-sensitivity-n1e4
 * @fileoverview imp-96387 -- MEASURE the +7/8-corrected count-model sensitivity
 *   of the imp-96290 N = 1e4 E_coll anchor (the ONE independently baked anchor),
 *   and report whether the shift is comparable to the ~3e-8 measured at the
 *   RECONSTRUCTED N = 1e6 anchor, or whether it scales with N.
 *
 *   BACKGROUND. imp-96363 Path B quantified that switching from the main-term
 *   Riemann-von Mangoldt count N(T) = (T / 2pi)(log(T / 2pi) - 1) to the
 *   +7/8-corrected count N(T) = (T / 2pi)(log(T / 2pi) - 1) + 7/8 moves gamma_N
 *   by relative -7.99e-7 at N = 1e6, hence the rate R(N) = sqrt(C_KH) *
 *   sqrt(log gamma_N / N) -- and therefore E_coll = C_H * R(N) -- by relative
 *   -3.00e-8. That sensitivity was only ever measured at the RECONSTRUCTED
 *   N = 1e6 anchor. The corpus bakes exactly ONE independent E_coll anchor pair,
 *   imp-96290 at N = 1e4 (E_coll = 0.0108806 at C_H = 1/8, 0.0110547 at
 *   C_H = 0.127). This module measures the +7/8 count-model shift THERE.
 *
 *   RESULT (measurement). At N = 1e4 the +7/8 constant moves gamma_N by relative
 *   -7.56e-5 (versus -7.99e-7 at N = 1e6), hence the rate R and E_coll by
 *   relative -4.11e-6 (versus -3.00e-8 at N = 1e6). So the count-model shift is
 *   NOT comparable to the ~3e-8 of the N = 1e6 anchor: it is roughly 137x LARGER
 *   at N = 1e4. It SCALES WITH N -- smaller N gives a larger relative count
 *   correction -- exactly as anticipated, because the fixed additive +7/8 count
 *   offset produces a gamma shift Delta gamma ~ (7/8) * 2pi / log gamma_N, so the
 *   relative gamma shift ~ 1 / (gamma_N log gamma_N) ~ 1 / N and the relative
 *   rate/E_coll shift ~ that over 2 log gamma_N. Concretely the ratio of the two
 *   relative gamma shifts (7.56e-5 / 7.99e-7 ~= 94.6) tracks the 100x ratio of
 *   the two heights, confirming the ~1/N scaling. In ABSOLUTE terms the N = 1e4
 *   anchor 0.0108806 moves by about -4.5e-8 (still tiny), but its RELATIVE
 *   sensitivity is two orders of magnitude above the N = 1e6 anchor.
 *
 *   MEASUREMENT ONLY. Closes no gap, changes no bound, proves no constant. The
 *   conditional bound C_H <= 0.127 stays UNPROVEN; C_H isRigorousUpperBound
 *   remains false (imp-2642 / imp-2701); the imp-2640 Gronwall discharge of
 *   C_Lip stays NEGATIVE. No refereed bound is changed. RH remains
 *   open. NO QED.
 *
 * Provenance of baked inputs (single sources of truth, cited not re-derived):
 *   - imp-96290-step4-bridge-subconstant-inventory.js: baked E_coll anchors
 *     0.0108806 (C_H = 1/8) and 0.0110547 (C_H = 0.127) at N = 1e4; C_KH form.
 *   - imp-96363-ecoll-independent-second-anchor.js: the +7/8-corrected count
 *     path and the N = 1e6 sensitivity (-3.00e-8) this module compares against.
 *   - imp-96311-ecoll-rate-ch-independence-tabulation.js: rate factor
 *     R(N) = sqrt(C_KH) * sqrt(log gamma_N / N), C_KH = pi * 2.622.
 *
 * Syntax note: derivative-like expressions use brace notation dg_{k*}/dt and
 *   this header avoids the close-comment terminator sequence inside prose.
 */

// Koksma-Hlawka discrepancy factor of E_coll (imp-2641 Trudgian), as in imp-96311.
const C_KH = Math.PI * 2.622; // = 8.2373...

// imp-96290 baked anchors at N = 1e4 (the ONE independently stored anchor pair).
const N1 = 1e4;
const CH_A = 0.125; // C_H = 1/8
const CH_B = 0.127; // conditional hypothesis C_H <= 0.127
const ANCHOR_A_BAKED = 0.0108806; // E_coll(1/8, 1e4), imp-96290
const ANCHOR_B_BAKED = 0.0110547; // E_coll(0.127, 1e4), imp-96290

// IN-FORMULA reference path: Newton inversion of the RvM MAIN-term count
// (reproduced verbatim from imp-96363 so the paths compare apples-to-apples).
function gammaNewtonMain(N) {
  let T = 2 * Math.PI * N;
  for (let i = 0; i < 200; i += 1) {
    const u = T / (2 * Math.PI);
    const f = u * (Math.log(u) - 1) - N;
    const df = Math.log(u) / (2 * Math.PI);
    const step = f / df;
    T -= step;
    if (Math.abs(step) < 1e-12) break;
  }
  return T;
}

// +7/8-corrected count, bisection-inverted (the DIFFERENT count model of Path B).
function gammaBisect78(N) {
  const count = (T) => {
    const u = T / (2 * Math.PI);
    return u * (Math.log(u) - 1) + 7 / 8;
  };
  let lo = 2 * Math.PI;
  let hi = 1e12;
  for (let i = 0; i < 300; i += 1) {
    const mid = 0.5 * (lo + hi);
    if (count(mid) < N) lo = mid;
    else hi = mid;
  }
  return 0.5 * (lo + hi);
}

function rateFromGamma(gamma, N) {
  return Math.sqrt(C_KH) * Math.sqrt(Math.log(gamma) / N);
}

// ---- N = 1e4 measurement (the imp-96290 anchor height) ----
const gammaRef1 = gammaNewtonMain(N1);
const gamma781 = gammaBisect78(N1);
const rateRef1 = rateFromGamma(gammaRef1, N1);
const rate781 = rateFromGamma(gamma781, N1);

const gammaRel1 = (gamma781 - gammaRef1) / gammaRef1;
const rateRel1 = (rate781 - rateRef1) / rateRef1;

// E_coll columns: reference (which reproduces the baked anchors to 6 sig figs)
// and +7/8-shifted, for both C_H columns.
const eA_ref1 = CH_A * rateRef1;
const eB_ref1 = CH_B * rateRef1;
const eA_781 = CH_A * rate781;
const eB_781 = CH_B * rate781;
const eA_absShift1 = eA_781 - eA_ref1;
const eB_absShift1 = eB_781 - eB_ref1;

// ---- N = 1e6 comparison (the imp-96363 reconstructed anchor height) ----
const N2 = 1e6;
const gammaRef2 = gammaNewtonMain(N2);
const gamma782 = gammaBisect78(N2);
const rateRef2 = rateFromGamma(gammaRef2, N2);
const rate782 = rateFromGamma(gamma782, N2);
const gammaRel2 = (gamma782 - gammaRef2) / gammaRef2;
const rateRel2 = (rate782 - rateRef2) / rateRef2;

// Scaling ratios: how much larger is the N=1e4 sensitivity than at N=1e6.
const rateSensitivityRatio = rateRel1 / rateRel2; // ~137
const gammaSensitivityRatio = gammaRel1 / gammaRel2; // ~94.6 ~ the 100x height ratio

export const IMP96387_ECOLL_ANCHOR_COUNT_MODEL_SENSITIVITY_N1E4 = {
  id: 'imp-96387',
  title:
    'Count-model (+7/8) sensitivity of the imp-96290 N = 1e4 E_coll anchor: it ' +
    'is NOT comparable to the ~3e-8 of the reconstructed N = 1e6 anchor -- it ' +
    'is ~137x larger (relative -4.11e-6) and scales as ~1/N with height',
  kind: 'measurement / accuracy audit (no closure, no bound change)',
  C_KH,
  anchorN1e4: {
    N: N1,
    CH_A,
    CH_B,
    E_coll_a_baked: ANCHOR_A_BAKED,
    E_coll_b_baked: ANCHOR_B_BAKED,
    gammaRef: gammaRef1,
    gammaPlus78: gamma781,
    gammaRelShift: gammaRel1,
    rateRef: rateRef1,
    ratePlus78: rate781,
    rateRelShift: rateRel1,
    E_coll_a_ref: eA_ref1,
    E_coll_a_plus78: eA_781,
    E_coll_a_absShift: eA_absShift1,
    E_coll_b_ref: eB_ref1,
    E_coll_b_plus78: eB_781,
    E_coll_b_absShift: eB_absShift1,
    refReproducesBakedA: Math.abs(eA_ref1 - ANCHOR_A_BAKED),
    refReproducesBakedB: Math.abs(eB_ref1 - ANCHOR_B_BAKED),
  },
  comparisonN1e6: {
    N: N2,
    gammaRelShift: gammaRel2,
    rateRelShift: rateRel2,
    note: 'imp-96363 Path B: gamma -7.99e-7, R and E_coll -3.00e-8 (relative).',
  },
  scaling: {
    rateSensitivityRatio, // ~137: N=1e4 relative shift over N=1e6 relative shift
    gammaSensitivityRatio, // ~94.6: tracks the 100x height ratio => ~1/N scaling
    verdictScalesWithN: Math.abs(rateRel1) > 10 * Math.abs(rateRel2),
  },
  measurement:
    'At the imp-96290 N = 1e4 anchor the +7/8-corrected count moves gamma_N by ' +
    'relative ' +
    gammaRel1.toExponential(2) +
    ' and hence the rate R and E_coll by relative ' +
    rateRel1.toExponential(2) +
    ' (absolute anchor shift about ' +
    eA_absShift1.toExponential(2) +
    ' on 0.0108806 and ' +
    eB_absShift1.toExponential(2) +
    ' on 0.0110547). That is ' +
    rateSensitivityRatio.toFixed(0) +
    'x the relative ' +
    rateRel2.toExponential(2) +
    ' measured at N = 1e6, so it is NOT comparable to ~3e-8: the count-model ' +
    'sensitivity SCALES WITH N. The two relative gamma shifts differ by a factor ' +
    gammaSensitivityRatio.toFixed(1) +
    ', tracking the 100x ratio of the heights, which confirms the ~1/N scaling ' +
    'expected from a fixed additive +7/8 count offset (Delta gamma ~ (7/8) * ' +
    '2pi / log gamma_N, relative gamma shift ~ 1 / (gamma_N log gamma_N) ~ 1/N).',
  verdict:
    'MEASURED. The +7/8 count-model sensitivity of the ONE independently baked ' +
    'E_coll anchor (imp-96290, N = 1e4) is relative -4.11e-6 -- about 137x the ' +
    '-3.00e-8 of the reconstructed N = 1e6 anchor -- and it scales as ~1/N with ' +
    'height (smaller N, larger relative count correction), NOT a comparable ~3e-8 ' +
    'constant. In absolute terms the anchor still moves only ~4.5e-8, well inside ' +
    'its storage floor. Accuracy audit only: no gap closed, no bound changed, ' +
    'G6_polymath15_bridge not closed, conditional C_H <= 0.127 stays UNPROVEN, ' +
    'C_H isRigorousUpperBound = false (imp-2642/imp-2701), imp-2640 Gronwall ' +
    'discharge of C_Lip NEGATIVE. No refereed bound is changed. RH open. NO QED.',
  provenance:
    'imp-96290-step4-bridge-subconstant-inventory.js (baked N=1e4 anchors, ' +
    'C_KH); imp-96363-ecoll-independent-second-anchor.js (+7/8 count path, N=1e6 ' +
    'sensitivity -3.00e-8); imp-96311-ecoll-rate-ch-independence-tabulation.js ' +
    '(rate factor R(N)).',
};

export const IMP96387_ECOLL_ANCHOR_COUNT_MODEL_SENSITIVITY_N1E4_ASSERTIONS = [
  {
    id: 'imp96387-ref-reproduces-baked-anchors',
    holds: () =>
      Math.abs(eA_ref1 - ANCHOR_A_BAKED) < 5e-8 &&
      Math.abs(eB_ref1 - ANCHOR_B_BAKED) < 5e-8,
    why:
      'The in-formula (main-term Newton) reference rate at N = 1e4 must ' +
      'reproduce the imp-96290 baked anchors 0.0108806 / 0.0110547 to within ' +
      'their 6-sig-fig storage floor, so the +7/8 shift is measured against the ' +
      'correct baseline.',
  },
  {
    id: 'imp96387-plus78-shift-is-larger-than-n1e6',
    holds: () => Math.abs(rateRel1) > 10 * Math.abs(rateRel2),
    why:
      'The relative +7/8 count-model shift of E_coll at N = 1e4 must be an order ' +
      'of magnitude or more LARGER than the -3.00e-8 measured at N = 1e6 ' +
      '(measured ratio ~137x), demonstrating that the sensitivity is NOT a ' +
      'comparable ~3e-8 constant.',
  },
  {
    id: 'imp96387-shift-scales-inverse-N',
    holds: () => {
      const heightRatio = N2 / N1; // 100
      const measured = Math.abs(gammaRel1 / gammaRel2);
      return measured > 0.5 * heightRatio && measured < 2 * heightRatio;
    },
    why:
      'The relative gamma shift from a fixed additive +7/8 count offset scales ' +
      'as ~1/N, so the ratio of the N=1e4 to N=1e6 relative gamma shifts must ' +
      'track the 100x height ratio (measured ~94.6x), within a factor of two.',
  },
  {
    id: 'imp96387-absolute-shift-tiny',
    holds: () =>
      Math.abs(eA_absShift1) < 1e-7 && Math.abs(eB_absShift1) < 1e-7,
    why:
      'Despite the larger RELATIVE sensitivity, the ABSOLUTE +7/8 shift of the ' +
      'N = 1e4 anchor must remain tiny (~4.5e-8), well inside the 6-sig-fig ' +
      'storage floor, so no baked value is materially perturbed.',
  },
  {
    id: 'imp96387-no-closure-c-h-still-open',
    holds: () =>
      /no gap closed|NO QED|no bound changed/i.test(
        IMP96387_ECOLL_ANCHOR_COUNT_MODEL_SENSITIVITY_N1E4.verdict,
      ) &&
      IMP96387_ECOLL_ANCHOR_COUNT_MODEL_SENSITIVITY_N1E4.kind.includes(
        'no closure',
      ),
    why:
      'This ticket is measurement/accuracy only: it must not assert closure of ' +
      'G6_polymath15_bridge, must not change any bound, and must not reclassify ' +
      'the unproven conditional C_H <= 0.127 as rigorous.',
  },
];
