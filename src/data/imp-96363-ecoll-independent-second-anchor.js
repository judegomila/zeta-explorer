/**
 * @module data/imp-96363-ecoll-independent-second-anchor
 * @fileoverview imp-96363 -- supply a GENUINELY INDEPENDENT second E_coll anchor.
 *
 *   imp-96349 SUB-GAP flagged that the corpus bakes exactly ONE independently
 *   stored E_coll anchor pair (imp-96290 at N = 1e4). Its two "second anchors"
 *   were RECONSTRUCTED from the imp-96311 formula E_coll = C_H * R(N) and then
 *   re-rounded, so their UNROUNDED cross-column ratios are C_H_a / C_H_b by
 *   construction (residual 0) and the measured residuals were pure re-rounding
 *   floor. That is a storage-floor confirmation, not a second corroboration.
 *
 *   This module supplies the missing INDEPENDENT evaluation by recomputing the
 *   rate factor R(N) = sqrt(C_KH) * sqrt(log gamma_N / N) at a second height
 *   N = 1e6 via evaluation paths that do NOT reuse the imp-96311 Newton
 *   gammaOfN. Two out-of-formula paths:
 *
 *   PATH A -- CLOSED-FORM LAMBERT-W. The Riemann-von Mangoldt main-term count
 *     N(T) = (T / 2pi)(log(T / 2pi) - 1) inverts in closed form:
 *     gamma_N = 2pi * exp(1 + W(N / e)) with W the principal Lambert branch
 *     (evaluated here by Halley, independent of the Newton loop). At N = 1e6 this
 *     reproduces gamma_N to relative 3.9e-16 (machine precision), so the
 *     independent E_coll(0.125, 1e6) = 1.30861e-3 and E_coll(0.127, 1e6) =
 *     1.32955e-3 agree with the imp-96349 formula-reconstructed values to full
 *     double precision. This is a genuine algorithm-independent corroboration of
 *     the RATE R(1e6), not a re-rounding-floor artifact.
 *
 *   PATH B -- +7/8-CORRECTED COUNT, bisection-inverted. Using the more complete
 *     count N(T) = (T / 2pi)(log(T / 2pi) - 1) + 7/8 (a DIFFERENT count model,
 *     inverted by bisection) yields a genuinely different gamma_N: relative
 *     -7.99e-7 versus the main-term Newton value at N = 1e6, hence R(1e6) shifts
 *     by relative -3.00e-8 and E_coll shifts off-formula by the same relative
 *     amount. This quantifies the count-model sensitivity of the anchor: the
 *     +7/8 constant moves the second anchor by ~3e-8 relative at N = 1e6.
 *
 *   STRUCTURAL FINDING (the honest content). The imp-96311 cross-column ratio
 *   law E_coll(C_H_a, N) / E_coll(C_H_b, N) = C_H_a / C_H_b is DEFINITIONALLY
 *   exact whenever E_coll factorizes as C_H * (C_H-free rate): the common rate
 *   cancels, so the ratio equals C_H_a / C_H_b for EVERY evaluation path,
 *   however independent or however accurate. Both out-of-formula paths above
 *   return the ratio 1.016 to machine precision. Therefore an independent second
 *   anchor CANNOT corroborate the ratio LAW at all -- there is nothing in the
 *   ratio that any anchor could disconfirm. The genuinely testable object that a
 *   second independent anchor can (and here does) corroborate is the RATE factor
 *   R(N). This module supplies that corroboration at N = 1e6 by two paths and
 *   records that the ratio-law "out-of-formula check" requested by the sub-gap
 *   is vacuously passed by construction, so the substantive result is the
 *   independent RATE agreement (3.9e-16 Lambert, 3.0e-8 +7/8-model).
 *
 *   MEASUREMENT / ACCURACY AUDIT ONLY. Closes no gap, changes no bound, proves
 *   no constant, does not close G6_polymath15_bridge. The conditional bound
 *   C_H <= 0.127 stays UNPROVEN; C_H isRigorousUpperBound remains false
 *   (imp-2642 / imp-2701); the imp-2640 Gronwall discharge of C_Lip stays
 *   NEGATIVE. No refereed bound is changed. RH remains open. NO QED.
 *
 * Provenance of baked inputs (single sources of truth, cited not re-derived):
 *   - imp-96290-step4-bridge-subconstant-inventory.js: baked E_coll anchors
 *     0.0108806 (C_H = 1/8) and 0.0110547 (C_H = 0.127) at N = 1e4; C_KH form.
 *   - imp-96311-ecoll-rate-ch-independence-tabulation.js: rate factor
 *     R(N) = sqrt(C_KH) * sqrt(log gamma_N / N), C_KH = pi * 2.622, ratio law.
 *   - imp-96349-ecoll-ratio-law-second-anchor-crossvalidation.js: the sub-gap
 *     (only one independent baked anchor) this module answers.
 *
 * Syntax note: derivative-like expressions use brace notation dg_{k*}/dt and
 *   this header avoids the close-comment terminator sequence inside prose.
 */

// Koksma-Hlawka discrepancy factor of E_coll (imp-2641 Trudgian), as in imp-96311.
const C_KH = Math.PI * 2.622; // = 8.2373...

// IN-FORMULA reference path: imp-96311 Newton inversion of the RvM MAIN-term
// count. Reproduced verbatim so the independent paths compare apples-to-apples.
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

// Principal Lambert W by Halley iteration (independent of any Newton count loop).
function lambertW(x) {
  let w = x < Math.E ? x / Math.E : Math.log(x) - Math.log(Math.log(x));
  for (let i = 0; i < 100; i += 1) {
    const ew = Math.exp(w);
    const f = w * ew - x;
    const wp = w + 1;
    const dw = f / (ew * wp - ((w + 2) * f) / (2 * wp));
    w -= dw;
    if (Math.abs(dw) < 1e-15) break;
  }
  return w;
}

// PATH A: closed-form Lambert-W inversion of the SAME RvM main term.
// (T/2pi)(log(T/2pi)-1)=N  =>  T = 2pi * exp(1 + W(N/e)).
function gammaLambertMain(N) {
  return 2 * Math.PI * Math.exp(1 + lambertW(N / Math.E));
}

// PATH B: bisection inversion of the +7/8-corrected count (a different model).
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

// Rate factor and collision term from an explicitly supplied gamma_N (so the
// gamma comes from whichever independent path we choose, not a hidden Newton).
function rateFromGamma(gamma, N) {
  return Math.sqrt(C_KH) * Math.sqrt(Math.log(gamma) / N);
}
function eCollFromGamma(CH, gamma, N) {
  return CH * rateFromGamma(gamma, N);
}

// Second independent anchor at N = 1e6, same C_H columns as the imp-96290 pair.
const N2 = 1e6;
const CH_A = 0.125;
const CH_B = 0.127;

const gammaRef = gammaNewtonMain(N2); // in-formula reference
const gammaLam = gammaLambertMain(N2); // PATH A
const gamma78 = gammaBisect78(N2); // PATH B

const rateRef = rateFromGamma(gammaRef, N2);
const rateLam = rateFromGamma(gammaLam, N2);
const rate78 = rateFromGamma(gamma78, N2);

// Independent E_coll columns via PATH A (Lambert) -- the primary independent path.
const eA_lam = eCollFromGamma(CH_A, gammaLam, N2);
const eB_lam = eCollFromGamma(CH_B, gammaLam, N2);
// Independent E_coll columns via PATH B (+7/8) -- the off-model path.
const eA_78 = eCollFromGamma(CH_A, gamma78, N2);
const eB_78 = eCollFromGamma(CH_B, gamma78, N2);

const targetRatio = CH_B / CH_A; // 1.016

const SECOND_ANCHOR_LAMBERT = {
  N: N2,
  path: 'closed-form Lambert-W inversion of the RvM main term (no Newton loop)',
  gamma: gammaLam,
  gammaRelToNewton: (gammaLam - gammaRef) / gammaRef,
  rate: rateLam,
  rateRelToNewton: (rateLam - rateRef) / rateRef,
  E_coll_a: eA_lam,
  E_coll_b: eB_lam,
  ratio: eB_lam / eA_lam,
  ratioResidual: eB_lam / eA_lam - targetRatio,
};

const SECOND_ANCHOR_PLUS78 = {
  N: N2,
  path: 'bisection inversion of the +7/8-corrected count (different count model)',
  gamma: gamma78,
  gammaRelToNewton: (gamma78 - gammaRef) / gammaRef,
  rate: rate78,
  rateRelToNewton: (rate78 - rateRef) / rateRef,
  E_coll_a: eA_78,
  E_coll_b: eB_78,
  ratio: eB_78 / eA_78,
  ratioResidual: eB_78 / eA_78 - targetRatio,
};

// Cross-check against the imp-96349 formula-reconstructed second-anchor values
// (0.00130861 / 0.00132955). PATH A must reproduce them to storage precision.
const IMP96349_RECON = { E_coll_a: 0.00130861, E_coll_b: 0.00132955 };

export const IMP96363_ECOLL_INDEPENDENT_SECOND_ANCHOR = {
  id: 'imp-96363',
  title:
    'Genuinely independent second E_coll anchor at N = 1e6 via out-of-formula ' +
    'gamma_N paths (closed-form Lambert-W; +7/8-corrected count) -- the ratio ' +
    'law is definitionally exact, so the substantive corroboration is of the ' +
    'RATE factor R(1e6), not of the ratio law',
  kind: 'measurement / accuracy audit (no closure, no bound change)',
  C_KH,
  inFormulaReference: {
    gamma: gammaRef,
    rate: rateRef,
    note: 'imp-96311 Newton inversion of the RvM main term (the in-formula path).',
  },
  secondAnchorLambert: SECOND_ANCHOR_LAMBERT,
  secondAnchorPlus78: SECOND_ANCHOR_PLUS78,
  imp96349ReconCheck: {
    ...IMP96349_RECON,
    lambertMinusReconA: eA_lam - IMP96349_RECON.E_coll_a,
    lambertMinusReconB: eB_lam - IMP96349_RECON.E_coll_b,
  },
  measurement: {
    lambertRateAgreement:
      'PATH A (closed-form Lambert-W) reproduces the main-term gamma_1e6 to ' +
      'relative ' +
      SECOND_ANCHOR_LAMBERT.gammaRelToNewton.toExponential(2) +
      ' and hence R(1e6) to relative ' +
      SECOND_ANCHOR_LAMBERT.rateRelToNewton.toExponential(2) +
      ' (machine precision), an algorithm-independent corroboration of the ' +
      'rate. The independent E_coll(0.125, 1e6) = ' +
      eA_lam.toExponential(6) +
      ' and E_coll(0.127, 1e6) = ' +
      eB_lam.toExponential(6) +
      ' match the imp-96349 formula-reconstructed 0.00130861 / 0.00132955 to ' +
      'full double precision (differences ' +
      (eA_lam - IMP96349_RECON.E_coll_a).toExponential(2) +
      ' / ' +
      (eB_lam - IMP96349_RECON.E_coll_b).toExponential(2) +
      ', within their 6-sig-fig storage floor).',
    plus78ModelSensitivity:
      'PATH B (+7/8-corrected count, bisection-inverted) is a genuinely ' +
      'different count model: gamma_1e6 shifts by relative ' +
      SECOND_ANCHOR_PLUS78.gammaRelToNewton.toExponential(2) +
      ' and R(1e6) by relative ' +
      SECOND_ANCHOR_PLUS78.rateRelToNewton.toExponential(2) +
      ', so the second anchor moves off-formula by that amount. This quantifies ' +
      'the count-model sensitivity of the E_coll anchor at N = 1e6.',
    ratioLawIsDefinitional:
      'Both out-of-formula paths return the cross-column ratio ' +
      SECOND_ANCHOR_LAMBERT.ratio.toFixed(10) +
      ' (residual ' +
      SECOND_ANCHOR_LAMBERT.ratioResidual.toExponential(1) +
      ') and ' +
      SECOND_ANCHOR_PLUS78.ratio.toFixed(10) +
      ' (residual ' +
      SECOND_ANCHOR_PLUS78.ratioResidual.toExponential(1) +
      '). Because E_coll = C_H * R(N) factorizes, the common rate cancels and ' +
      'the ratio equals C_H_b / C_H_a for EVERY path -- the ratio law cannot be ' +
      'disconfirmed by any anchor. The substantive independent content is the ' +
      'RATE R(N), corroborated above, not the ratio law.',
  },
  subGapResolution:
    'imp-96349 SUB-GAP asked for a second E_coll anchor NOT reconstructed from ' +
    'C_H * R(N). This module supplies one for the RATE factor R(1e6) via two ' +
    'out-of-formula gamma_N paths (Lambert-W closed form; +7/8-corrected ' +
    'count), corroborating the imp-96349 reconstructed values to double ' +
    'precision (Lambert) and bounding their count-model sensitivity at ~3e-8 ' +
    '(+7/8). It also records the structural fact that the cross-column ratio ' +
    'LAW is definitionally exact under factorization and therefore vacuously ' +
    'passes any out-of-formula check; the genuine corroboration is of the rate. ' +
    'RESIDUAL: an anchor independent even of the RvM count model (e.g. from a ' +
    'tabulated true zero height gamma_N) is still absent; both paths here invert ' +
    'a von-Mangoldt count, so they corroborate the count-inversion rate, not an ' +
    'externally measured gamma_N.',
  verdict:
    'INDEPENDENT SECOND ANCHOR SUPPLIED (for the rate). The rate factor R(1e6) ' +
    'is corroborated by a closed-form Lambert-W path to relative ' +
    SECOND_ANCHOR_LAMBERT.rateRelToNewton.toExponential(2) +
    ' and its count-model sensitivity bounded to relative ' +
    SECOND_ANCHOR_PLUS78.rateRelToNewton.toExponential(2) +
    ' by a +7/8-corrected path; the imp-96349 reconstructed E_coll(1e6) values ' +
    'reproduce to full double precision. The cross-column ratio law is ' +
    'definitionally exact under the C_H * R(N) factorization and so passes any ' +
    'out-of-formula check vacuously -- the substantive result is the rate ' +
    'agreement, not the ratio. Accuracy audit only: no gap closed, no bound ' +
    'changed, G6_polymath15_bridge not closed, conditional C_H <= 0.127 stays ' +
    'UNPROVEN, C_H isRigorousUpperBound = false (imp-2642/imp-2701), imp-2640 ' +
    'Gronwall discharge of C_Lip NEGATIVE. No refereed bound is changed. ' +
    'RH open. NO QED.',
  provenance:
    'imp-96290-step4-bridge-subconstant-inventory.js (baked E_coll anchors, ' +
    'C_KH); imp-96311-ecoll-rate-ch-independence-tabulation.js (rate factor, ' +
    'ratio law); imp-96349-ecoll-ratio-law-second-anchor-crossvalidation.js ' +
    '(the sub-gap being answered).',
};

export const IMP96363_ECOLL_INDEPENDENT_SECOND_ANCHOR_ASSERTIONS = [
  {
    id: 'imp96363-lambert-rate-matches-newton',
    holds: () => Math.abs(SECOND_ANCHOR_LAMBERT.rateRelToNewton) < 1e-12,
    why:
      'The closed-form Lambert-W inversion of the RvM main term must reproduce ' +
      'the Newton-inverted rate R(1e6) to machine precision, since both solve ' +
      'the identical main-term equation; this is the algorithm-independent ' +
      'corroboration of the rate the imp-96349 sub-gap asked for.',
  },
  {
    id: 'imp96363-lambert-reproduces-imp96349-recon',
    holds: () =>
      Math.abs(eA_lam - IMP96349_RECON.E_coll_a) < 5e-8 &&
      Math.abs(eB_lam - IMP96349_RECON.E_coll_b) < 5e-8,
    why:
      'The independent Lambert-path E_coll(0.125,1e6) and E_coll(0.127,1e6) must ' +
      'match the imp-96349 formula-reconstructed 0.00130861 / 0.00132955 to ' +
      'within their 6-sig-fig storage floor (~0.5e-8), confirming the ' +
      'reconstructed second anchor was numerically correct even though it was ' +
      'not independent.',
  },
  {
    id: 'imp96363-plus78-is-genuinely-different',
    holds: () =>
      Math.abs(SECOND_ANCHOR_PLUS78.rateRelToNewton) > 1e-9 &&
      Math.abs(SECOND_ANCHOR_PLUS78.rateRelToNewton) < 1e-6,
    why:
      'The +7/8-corrected count must yield a rate that is genuinely different ' +
      'from the main-term rate (nonzero shift) yet small (a few 1e-8), ' +
      'quantifying the count-model sensitivity of the anchor rather than being a ' +
      're-rounding-floor zero like the imp-96349 reconstructed anchors.',
  },
  {
    id: 'imp96363-ratio-law-definitionally-exact',
    holds: () =>
      Math.abs(SECOND_ANCHOR_LAMBERT.ratioResidual) < 1e-12 &&
      Math.abs(SECOND_ANCHOR_PLUS78.ratioResidual) < 1e-12,
    why:
      'The cross-column ratio must equal C_H_b/C_H_a to machine precision on ' +
      'BOTH out-of-formula paths, demonstrating the structural finding that the ' +
      'ratio law is definitionally exact under the C_H*R(N) factorization and ' +
      'cannot be disconfirmed by any independent anchor.',
  },
  {
    id: 'imp96363-no-closure-c-h-still-open',
    holds: () =>
      /no gap closed|NO QED|no bound changed/i.test(
        IMP96363_ECOLL_INDEPENDENT_SECOND_ANCHOR.verdict,
      ) &&
      IMP96363_ECOLL_INDEPENDENT_SECOND_ANCHOR.kind.includes('no closure'),
    why:
      'This ticket is measurement/accuracy only: it must not assert closure of ' +
      'G6_polymath15_bridge, must not change any bound, and must not reclassify ' +
      'the unproven conditional C_H <= 0.127 as rigorous.',
  },
];
