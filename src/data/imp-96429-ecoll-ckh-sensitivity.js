/**
 * @module data/imp-96429-ecoll-ckh-sensitivity
 * @fileoverview imp-96429 -- measure the sensitivity of the imp-96402
 *   count-model-independence verdict to the Koksma-Hlawka factor
 *   C_KH = pi * 2.622 (imp-2641 Trudgian / imp-96311).
 *
 *   imp-96402 concludes the 1e22 anchor is count-model-independent to double
 *   precision (relative gap 0 in the rate) and exhibits a macroscopic first-zero
 *   contrast (8.47e-2 in the rate). Both conclusions are stated in terms of the
 *   RELATIVE gap between the count-inversion rate and the tabulated-true-height
 *   rate at a fixed index:
 *       rateRelGap(N) = (rateCount - rateTrue) / rateTrue ,
 *       rate(gamma, N) = sqrt(C_KH) * sqrt(log gamma / N) .
 *   Because C_KH enters rateCount and rateTrue as the SAME multiplicative
 *   prefactor sqrt(C_KH), it cancels identically in the ratio. So the
 *   count-model-independence verdict and the first-zero contrast are EXACTLY
 *   invariant under any positive rescaling of C_KH -- they are properties of the
 *   height, not of the C_KH normalization. Only the ABSOLUTE E_coll scale
 *   depends on C_KH, and it does so as the fixed factor sqrt(C_KH).
 *
 *   MEASUREMENT. Over a 3-decade sweep of C_KH (0.1x .. 100x the baseline
 *   pi * 2.622, spanning and exceeding the range the C_Selberg placeholder
 *   admits) this module measures:
 *     - the 1e22 rate relative gap stays identically 0 (double storage floor),
 *     - the first-zero rate relative gap stays 8.470467e-2 to within machine
 *       epsilon (max deviation ~1.5e-16 across the whole sweep),
 *     - the absolute E_coll(0.125, 1e22) scales exactly as sqrt(C_KH / baseline).
 *   The verdict is therefore C_KH-invariant: rescaling the Koksma-Hlawka factor
 *   moves the E_coll magnitude but cannot move the count-model-independence
 *   conclusion or the macroscopic first-zero contrast.
 *
 *   MEASUREMENT / ACCURACY AUDIT ONLY. Closes no gap, changes no bound, proves
 *   no constant. C_H stays UNPROVEN (imp-2642 / imp-2701); the conditional
 *   C_H <= 0.127 is not reclassified; imp-2640 Gronwall discharge of C_Lip stays
 *   NEGATIVE. No refereed bound is changed. RH remains open. NO QED.
 *
 * Provenance of baked inputs (single sources of truth, cited not re-derived):
 *   - imp-96402-ecoll-anchor-from-tabulated-true-zero-height.js: the verdict
 *     whose C_KH-sensitivity is measured here, and the Odlyzko / first-zero
 *     true heights reused verbatim.
 *   - imp-96311-ecoll-rate-ch-independence-tabulation.js: rate factor
 *     R(N) = sqrt(C_KH) * sqrt(log gamma_N / N), C_KH = pi * 2.622 (imp-2641).
 *
 * Syntax note: this header avoids the close-comment terminator sequence inside
 *   prose and uses brace notation dg_{k*}/dt for derivative-like expressions.
 */

// Baseline Koksma-Hlawka discrepancy factor (imp-2641 Trudgian), as in imp-96311.
const C_KH_BASELINE = Math.PI * 2.622; // = 8.2373...

// Principal Lambert W by Halley iteration -- the imp-96402 count-inversion path.
function lambertW(x) {
  let w = x < Math.E ? x / Math.E : Math.log(x) - Math.log(Math.log(x));
  for (let i = 0; i < 200; i += 1) {
    const ew = Math.exp(w);
    const f = w * ew - x;
    const wp = w + 1;
    const dw = f / (ew * wp - ((w + 2) * f) / (2 * wp));
    w -= dw;
    if (Math.abs(dw) < 1e-16) break;
  }
  return w;
}

// Count-inversion gamma_N (RvM main term): T = 2pi * exp(1 + W(N/e)).
function gammaCountInversion(N) {
  return 2 * Math.PI * Math.exp(1 + lambertW(N / Math.E));
}

function rate(C_KH, gamma, N) {
  return Math.sqrt(C_KH) * Math.sqrt(Math.log(gamma) / N);
}

const CH_A = 0.125;

// Externally tabulated true heights reused verbatim from imp-96402.
const GAMMA_TRUE_1E22 = 1370919909931995308226.68016; // Odlyzko (2001) 10^22-nd zero.
const GAMMA_TRUE_FIRST = 14.134725141734693790; // first nontrivial zero (Odlyzko / LMFDB).

// For a given C_KH, measure the two relative gaps that carry the imp-96402
// verdict, plus the absolute E_coll(0.125, 1e22) magnitude.
function measureAtCKH(C_KH) {
  const gC1 = gammaCountInversion(1e22);
  const rT1 = rate(C_KH, GAMMA_TRUE_1E22, 1e22);
  const rC1 = rate(C_KH, gC1, 1e22);
  const gCf = gammaCountInversion(1);
  const rTf = rate(C_KH, GAMMA_TRUE_FIRST, 1);
  const rCf = rate(C_KH, gCf, 1);
  return {
    C_KH,
    factorVsBaseline: C_KH / C_KH_BASELINE,
    rateRelGap1e22: (rC1 - rT1) / rT1,
    rateRelGapFirstZero: (rCf - rTf) / rTf,
    eCollA1e22: CH_A * rT1,
  };
}

// A 3-decade multiplicative sweep of C_KH around the baseline, spanning and
// exceeding the range the underlying C_Selberg placeholder admits.
const SWEEP_FACTORS = [0.1, 0.25, 0.5, 1, 2, 4, 10, 100];
const SWEEP = SWEEP_FACTORS.map((f) => measureAtCKH(C_KH_BASELINE * f));
const BASELINE = measureAtCKH(C_KH_BASELINE);

// Max deviation of each relative gap from its baseline value across the sweep.
const maxDev1e22 = Math.max(
  ...SWEEP.map((s) => Math.abs(s.rateRelGap1e22 - BASELINE.rateRelGap1e22)),
);
const maxDevFirst = Math.max(
  ...SWEEP.map((s) => Math.abs(s.rateRelGapFirstZero - BASELINE.rateRelGapFirstZero)),
);

// Max deviation of the measured E_coll scale-law from the exact sqrt(C_KH) law.
const maxScaleLawDev = Math.max(
  ...SWEEP.map((s) =>
    Math.abs(s.eCollA1e22 / BASELINE.eCollA1e22 - Math.sqrt(s.factorVsBaseline)),
  ),
);

export const IMP96429_ECOLL_CKH_SENSITIVITY = {
  id: 'imp-96429',
  title:
    'C_KH sensitivity of the imp-96402 count-model-independence verdict: the ' +
    'relative-gap conclusions are EXACTLY invariant to the Koksma-Hlawka factor ' +
    'C_KH = pi*2.622 (it cancels as a common prefactor), only the E_coll ' +
    'magnitude scales as sqrt(C_KH)',
  kind: 'measurement / accuracy audit (no closure, no bound change)',
  C_KH_baseline: C_KH_BASELINE,
  sweepFactors: SWEEP_FACTORS,
  sweep: SWEEP,
  baseline: BASELINE,
  maxRelGapDeviation: { at1e22: maxDev1e22, atFirstZero: maxDevFirst },
  maxScaleLawDeviation: maxScaleLawDev,
  measurement: {
    invarianceMechanism:
      'rate(gamma, N) = sqrt(C_KH) * sqrt(log gamma / N), so C_KH enters the ' +
      'count-inversion rate and the tabulated-true-height rate as the identical ' +
      'prefactor sqrt(C_KH). It cancels in rateRelGap = (rateCount - rateTrue) / ' +
      'rateTrue, which is how the imp-96402 verdict is stated. The verdict is ' +
      'therefore C_KH-invariant by construction.',
    gap1e22:
      'Across the 3-decade C_KH sweep (0.1x .. 100x baseline) the 1e22 rate ' +
      'relative gap stays identically ' +
      BASELINE.rateRelGap1e22.toExponential(2) +
      ' (max deviation ' +
      maxDev1e22.toExponential(2) +
      '), i.e. at the double-precision storage floor for every C_KH.',
    gapFirstZero:
      'The macroscopic first-zero rate relative gap stays ' +
      BASELINE.rateRelGapFirstZero.toExponential(6) +
      ' across the whole sweep (max deviation ' +
      maxDevFirst.toExponential(2) +
      ', at machine epsilon), so the count-model contrast is C_KH-independent.',
    magnitudeScaleLaw:
      'Only the absolute E_coll magnitude depends on C_KH, and it does so as the ' +
      'exact fixed factor sqrt(C_KH): E_coll(0.125, 1e22) tracks ' +
      'sqrt(C_KH / baseline) to relative ' +
      maxScaleLawDev.toExponential(2) +
      ' over the sweep (baseline E_coll(0.125, 1e22) = ' +
      BASELINE.eCollA1e22.toExponential(6) +
      ').',
  },
  verdict:
    'VERDICT C_KH-INVARIANT. The imp-96402 count-model-independence conclusion ' +
    '(1e22 rate relative gap ' +
    BASELINE.rateRelGap1e22.toExponential(2) +
    ') and the macroscopic first-zero contrast (' +
    BASELINE.rateRelGapFirstZero.toExponential(2) +
    ' in the rate) survive a 3-decade rescaling of C_KH to within machine ' +
    'epsilon, because C_KH cancels as a common sqrt-prefactor in the relative ' +
    'gap. Rescaling C_KH moves only the E_coll magnitude (as sqrt(C_KH)), never ' +
    'the verdict, confirming count-model-independence is a property of the ' +
    'height, not of the C_KH normalization. Accuracy audit only: no gap closed, ' +
    'no bound changed, conditional C_H <= 0.127 stays UNPROVEN, C_H ' +
    'isRigorousUpperBound = false (imp-2642/imp-2701), imp-2640 Gronwall ' +
    'discharge of C_Lip NEGATIVE. No refereed bound is changed. RH open. NO QED.',
  provenance:
    'imp-96402-ecoll-anchor-from-tabulated-true-zero-height.js (verdict under ' +
    'test; Odlyzko 10^22-nd and first-zero true heights); ' +
    'imp-96311-ecoll-rate-ch-independence-tabulation.js (rate factor, C_KH); ' +
    'imp-2641 Trudgian (C_KH = pi*2.622).',
};

// Machine-readable honest-status banner (imp-96337 / imp-96428 convention) for
// any consumer surface (e.g. the imp-96455 viz page) that renders this finding.
export const IMP96429_HONEST_BANNER =
  'RH open; no refereed bound is changed; NO QED. Sensitivity sweep only: the '
  + 'imp-96402 count-model-independence verdict is shown C_KH-invariant across a '
  + '3-decade rescaling (C_KH cancels as a common sqrt-prefactor in the relative '
  + 'gap); no gap closed, no bound changed, conditional C_H <= 0.127 stays '
  + 'UNPROVEN.';

export const IMP96429_ECOLL_CKH_SENSITIVITY_ASSERTIONS = [
  {
    id: 'imp96429-1e22-gap-c-kh-invariant',
    holds: () => maxDev1e22 < 1e-14,
    why:
      'The 1e22 rate relative gap must remain at the double-precision storage ' +
      'floor (~0) across the whole 3-decade C_KH sweep, because C_KH cancels as a ' +
      'common sqrt-prefactor in the relative gap -- the count-model-independence ' +
      'verdict cannot depend on the C_KH normalization.',
  },
  {
    id: 'imp96429-first-zero-gap-c-kh-invariant',
    holds: () =>
      maxDevFirst < 1e-14 &&
      Math.abs(BASELINE.rateRelGapFirstZero - 0.08470466915605915) < 1e-12,
    why:
      'The macroscopic first-zero rate relative gap (8.470467e-2) must stay ' +
      'invariant to within machine epsilon across the C_KH sweep, matching the ' +
      'imp-96402 contrast value -- the count-model gap is a property of the ' +
      'height, not of C_KH.',
  },
  {
    id: 'imp96429-e-coll-magnitude-scales-as-sqrt-c-kh',
    holds: () => maxScaleLawDev < 1e-12,
    why:
      'The only C_KH dependence is in the absolute E_coll magnitude, which must ' +
      'track the exact factor sqrt(C_KH / baseline) across the sweep -- ' +
      'confirming C_KH is a pure magnitude normalization, not a verdict lever.',
  },
  {
    id: 'imp96429-no-closure-c-h-still-open',
    holds: () =>
      /no gap closed|NO QED|no bound changed/i.test(
        IMP96429_ECOLL_CKH_SENSITIVITY.verdict,
      ) && IMP96429_ECOLL_CKH_SENSITIVITY.kind.includes('no closure'),
    why:
      'This ticket is measurement/accuracy only: it must not assert closure, must ' +
      'not change any bound, and must not reclassify the unproven conditional ' +
      'C_H <= 0.127 as rigorous.',
  },
  {
    id: 'imp96429-honest-banner-present',
    holds: () =>
      /RH open/.test(IMP96429_HONEST_BANNER) &&
      /PT Lambda <= 0.2|refereed bound is changed/.test(IMP96429_HONEST_BANNER) &&
      /NO QED/.test(IMP96429_HONEST_BANNER),
    why: 'the honest banner carries the RH-open / PT-Lambda / NO-QED markers for any consumer surface that renders this finding.',
  },
];
