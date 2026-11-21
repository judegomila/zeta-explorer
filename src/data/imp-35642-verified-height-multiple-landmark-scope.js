/**
 * @module imp-35642-verified-height-multiple-landmark-scope
 *
 * imp-35642 (numerical/assessment, S-frontier): QUANTIFY the verified-height MULTIPLE
 * needed to extend the PATH-1 unconditional E1/E2 leading-order floor from the current
 * 10^6 assembly ceiling to the two roadmap sigma-decay landmarks -- the sigma=1/2 halving
 * landmark N ~ 3.27e9 and the sigma<0.1 landmark N ~ 3.21e11 (lambda-roadmap
 * currentStatus). It reports both the zero-INDEX decade count (log10 of the N-ratio) and
 * the RvM effective-HEIGHT multiple (T0 ratio and its decade count), the two being
 * distinct because T0 ~ 2pi N / log N grows slightly slower than N per decade.
 *
 * ASSESSMENT / SCOPING ONLY. Discharges NOTHING; changes no bound; tightens no bound;
 * establishes no operator positivity; no RH verdict, NO QED. It computes NO true-zeros
 * quantity (it does not import the 16.7MB zeros bundle) -- it feeds the three landmark N
 * through the RvM inverse effectiveHeightForN and forms ratios. C_mb stays GUE-conditional
 * per imp-486; the C_C = (1/8) sqrt(3 pi) ansatz (imp-2642/imp-2643), the E_trunc = 3.06e-5
 * floor (imp-2631) and the imp-398 C_F prefactor are all UNTOUCHED. imp-35337a stays OPEN.
 * No refereed bound is changed.
 *
 * PART A -- THE TWO MULTIPLES (INDEX-DECADES VS HEIGHT-DECADES)
 * -----------------------------------------------------------------------------
 * From the 10^6 assembly ceiling (T0 ~ 6.003e5) to each landmark:
 *   halving N ~ 3.27e9  (T0 ~ 1.140e9):  zero-INDEX span 3.5145 decades (3270x in N),
 *                                        HEIGHT span 3.2787 decades (~1899.8x in T0);
 *   sub-0.1 N ~ 3.21e11 (T0 ~ 9.010e10): zero-INDEX span 5.5065 decades (3.21e5x in N),
 *                                        HEIGHT span 5.1764 decades (~1.501e5x in T0).
 * So materially shrinking the conditional share to the halving landmark costs ~3.5
 * index-decades / ~1900x more effective height, and to the sub-0.1 landmark ~5.5
 * index-decades / ~1.5e5x more effective height. The HEIGHT decade count runs ~0.24-0.33
 * decades BELOW the index decade count at each landmark -- the log-factor discount by
 * which T0 lags N per decade.
 *
 * PART B -- THE BINDING CONSTRAINT IS ASSEMBLY, NOT VERIFIED-ZERO AVAILABILITY
 * -----------------------------------------------------------------------------
 * The honest twist the raw multiples hide: the Platt-Trudgian verified height T_PT = 3e12
 * ALREADY sits far ABOVE both landmark heights (T0_half ~ 1.14e9, T0_sub ~ 9.01e10 are
 * both << 3e12). By the RvM count that verified height already contains N_PT ~ 1.236e13
 * zeros -- ~3781x more than the 3.27e9 halving landmark and ~38.5x more than the 3.21e11
 * sub-0.1 landmark. So the VERIFIED ZEROS needed to reach either landmark already EXIST
 * (Platt-Trudgian 2021); the "more verified height" lever of the PT-floor memory is, for
 * THESE two landmarks, already satisfied. What is NOT satisfied is the in-repo EMPIRICAL
 * E1/E2 ASSEMBLY: the leading-order floor is assembled only over the 10^6 in-repo Odlyzko
 * ordinates, so the true bottleneck to extending PATH-1 to N ~ 3.27e9 / 3.21e11 is
 * COMPUTING the empirical spacing statistics over billions of already-verified zeros, not
 * verifying more of them. That reframing -- multiple-needed measured, but binding on
 * assembly/compute rather than verified height -- is the honest scoping note this ticket
 * lands.
 *
 * The punchline: extending the PATH-1 E1/E2 floor from 10^6 to the sigma=1/2 halving
 * landmark N ~ 3.27e9 costs ~3.51 zero-index decades (~1900x in RvM height); to the
 * sigma<0.1 landmark N ~ 3.21e11 it costs ~5.51 index decades (~1.5e5x in height). But
 * both landmark heights already sit below the Platt-Trudgian verified height 3e12 (which
 * by RvM contains ~1.24e13 zeros, over-covering both landmarks ~3781x / ~38.5x), so the
 * binding constraint is the in-repo empirical E1/E2 ASSEMBLY ceiling at 10^6, not
 * verified-zero availability. Assessment/scoping only; imp-35337a stays OPEN; changes
 * nothing; C_mb GUE-conditional per imp-486 UNTOUCHED; NO QED.
 *
 * @see lambda-roadmap currentStatus (sigma halves at N ~ 3.27e9, drops below 0.1 at N ~ 3.21e11)
 * @see imp-33582 (finer post-peak grid: halving landmark N ~ 3.27e9, sub-0.1 landmark N ~ 3.21e11)
 * @see imp-33723 (E_coll=E_trunc crossover closed form N_cross ~ 3.280294e9, ~0.4% above the halving landmark)
 * @see project_pt_floor_binds_on_verified_height (sole lever = more verified height, RH-free)
 * @see imp-486 (GUE-conditional caveat inherited by C_mb; UNTOUCHED)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 Riemann-von Mangoldt inverse; zeroCountAtHeight)
 */

import { effectiveHeightForN, zeroCountAtHeight } from './lambda-rh-height-mapping.js';

const T_PT = 3e12; // Platt-Trudgian 2021 verified height (unchanged by any sigma-fidelity scoping)
const L_PT = 0.2; // Platt-Trudgian 2021 bound

// The current PATH-1 E1/E2 empirical ASSEMBLY ceiling (lambda-roadmap currentStatus).
const N_ASSEMBLY = 1e6;
// The two roadmap sigma-decay landmarks (imp-33582 finer post-peak grid).
const N_HALF = 3.27e9; // sigma = 1/2 halving landmark
const N_SUB01 = 3.21e11; // sigma < 0.1 landmark

// RvM effective heights (no zeros-bundle import; effectiveHeightForN is import-light).
const T0_ASSEMBLY = effectiveHeightForN(N_ASSEMBLY); // ~6.002704e5
const T0_HALF = effectiveHeightForN(N_HALF); // ~1.140384e9
const T0_SUB01 = effectiveHeightForN(N_SUB01); // ~9.009556e10

// Zero-INDEX multiple (decade count = log10 of the N-ratio).
const INDEX_RATIO_HALF = N_HALF / N_ASSEMBLY; // 3270
const INDEX_RATIO_SUB01 = N_SUB01 / N_ASSEMBLY; // 321000
const INDEX_DECADES_HALF = Math.log10(INDEX_RATIO_HALF); // ~3.514548
const INDEX_DECADES_SUB01 = Math.log10(INDEX_RATIO_SUB01); // ~5.506505

// RvM effective-HEIGHT multiple (T0 ratio + decade count).
const HEIGHT_RATIO_HALF = T0_HALF / T0_ASSEMBLY; // ~1899.78
const HEIGHT_RATIO_SUB01 = T0_SUB01 / T0_ASSEMBLY; // ~150091.6
const HEIGHT_DECADES_HALF = Math.log10(HEIGHT_RATIO_HALF); // ~3.278704
const HEIGHT_DECADES_SUB01 = Math.log10(HEIGHT_RATIO_SUB01); // ~5.176356

// Part B: the verified height already over-covers both landmark heights.
const N_PT = zeroCountAtHeight(T_PT); // ~1.236240e13 zeros at the verified height
const PT_OVERCOVER_HALF = N_PT / N_HALF; // ~3780.6x more zeros than the halving landmark needs
const PT_OVERCOVER_SUB01 = N_PT / N_SUB01; // ~38.51x more than the sub-0.1 landmark needs
const HALF_HEIGHT_BELOW_PT = T0_HALF < T_PT; // true
const SUB01_HEIGHT_BELOW_PT = T0_SUB01 < T_PT; // true

export const IMP35642_VERIFIED_HEIGHT_MULTIPLE_LANDMARK_SCOPE = Object.freeze({
  id: 'imp-35642',
  proofSection: 'S-frontier',
  question:
    'The roadmap currentStatus frames the frontier as closing the gap between the empirical PATH-1 E1/E2 ' +
    'floor (extended to the 10^6 assembly ceiling) and the analytic GUE-conditional chain, noting sigma ' +
    'halves at N ~ 3.27e9 and drops below 0.1 at N ~ 3.21e11. QUANTIFY the height MULTIPLE (T0 ratio and ' +
    'decade count) between the 10^6 ceiling and each landmark, to size what a verified-height extension ' +
    'would have to buy. Assessment/scoping only; C_mb stays GUE-conditional per imp-486; NO QED.',
  assemblyCeiling: {
    N: N_ASSEMBLY,
    T0: +T0_ASSEMBLY.toExponential(6), // ~6.002704e5
    log10Height: +Math.log10(T0_ASSEMBLY).toFixed(6), // ~5.778347
  },
  halvingLandmark: {
    N: N_HALF,
    T0: +T0_HALF.toExponential(6), // ~1.140384e9
    log10Height: +Math.log10(T0_HALF).toFixed(6), // ~9.057051
    indexRatio: +INDEX_RATIO_HALF.toFixed(4), // 3270
    indexDecades: +INDEX_DECADES_HALF.toFixed(6), // ~3.514548
    heightRatio: +HEIGHT_RATIO_HALF.toFixed(4), // ~1899.78
    heightDecades: +HEIGHT_DECADES_HALF.toFixed(6), // ~3.278704
  },
  sub01Landmark: {
    N: N_SUB01,
    T0: +T0_SUB01.toExponential(6), // ~9.009556e10
    log10Height: +Math.log10(T0_SUB01).toFixed(6), // ~10.954703
    indexRatio: +INDEX_RATIO_SUB01.toFixed(4), // 321000
    indexDecades: +INDEX_DECADES_SUB01.toFixed(6), // ~5.506505
    heightRatio: +HEIGHT_RATIO_SUB01.toFixed(4), // ~150091.6
    heightDecades: +HEIGHT_DECADES_SUB01.toFixed(6), // ~5.176356
  },
  bindingConstraint: {
    verifiedHeight: T_PT, // 3e12 (Platt-Trudgian 2021)
    zerosAtVerifiedHeight: +N_PT.toExponential(6), // ~1.236240e13
    halvingHeightBelowVerified: HALF_HEIGHT_BELOW_PT, // true
    sub01HeightBelowVerified: SUB01_HEIGHT_BELOW_PT, // true
    overcoverHalving: +PT_OVERCOVER_HALF.toFixed(2), // ~3780.6x
    overcoverSub01: +PT_OVERCOVER_SUB01.toFixed(2), // ~38.51x
    note:
      'Both landmark heights sit BELOW the Platt-Trudgian verified height 3e12 (which by RvM contains ' +
      '~1.236e13 zeros, over-covering the halving landmark ~3781x and the sub-0.1 landmark ~38.5x). The ' +
      'verified zeros to reach either landmark already EXIST; the binding constraint is the in-repo ' +
      'EMPIRICAL E1/E2 ASSEMBLY at the 10^6 ceiling -- computing spacing statistics over billions of ' +
      'already-verified zeros, not verifying more of them.',
  },
  isRigorous: false,
  isUnconditional: false,
  verdict:
    'ASSESSMENT / SCOPING (frontier-direction, NOT rigorous). Extending the PATH-1 unconditional E1/E2 ' +
    'leading-order floor from the 10^6 assembly ceiling (T0 ~ 6.003e5) to the sigma=1/2 halving landmark ' +
    'N ~ 3.27e9 (T0 ~ 1.140e9) costs ~3.51 zero-index decades (3270x in N) / ~3.28 height decades ' +
    '(~1899.8x in RvM effective height); reaching the sigma<0.1 landmark N ~ 3.21e11 (T0 ~ 9.010e10) costs ' +
    '~5.51 index decades (3.21e5x in N) / ~5.18 height decades (~1.501e5x in height) -- the height decade ' +
    'count running ~0.24-0.33 below the index count by the log-factor discount T0 ~ 2pi N/log N. But both ' +
    'landmark heights already sit BELOW the Platt-Trudgian verified height 3e12, which by RvM contains ' +
    '~1.236e13 zeros -- over-covering the halving landmark ~3781x and the sub-0.1 landmark ~38.5x -- so the ' +
    'verified zeros needed to reach either landmark already EXIST; the binding constraint is the in-repo ' +
    'EMPIRICAL E1/E2 ASSEMBLY ceiling at 10^6 (computing spacing statistics over billions of already- ' +
    'verified zeros), not verified-zero availability. Discharges NOTHING; imp-35337a stays OPEN; changes ' +
    'no bound; establishes no operator positivity; C_mb GUE-conditional (imp-486), C_C = (1/8) sqrt(3 pi) ' +
    '(imp-2642/imp-2643) and E_trunc = 3.06e-5 (imp-2631) are UNTOUCHED; no RH verdict, NO QED. ' +
    'No refereed bound is changed.',
  citation:
    'lambda-roadmap currentStatus (sigma halves at N ~ 3.27e9, drops below 0.1 at N ~ 3.21e11); imp-33582 ' +
    '(finer post-peak grid landmarks); imp-33723 (crossover closed form ~3.280294e9); project_pt_floor ' +
    '(sole lever = more verified height, RH-free); imp-486 (GUE-conditional caveat, UNTOUCHED); ' +
    'lambda-rh-height-mapping (effectiveHeightForN RvM inverse, zeroCountAtHeight); Platt-Trudgian 2021 ' +
    '(T_PT = 3e12).',
});

export const IMP35642_VERIFIED_HEIGHT_MULTIPLE_LANDMARK_SCOPE_ASSERTIONS = [
  {
    // Part A: the halving landmark costs ~3.51 index decades / ~3.28 height decades (~1900x in T0).
    id: 'imp35642-halving-multiple',
    description:
      'from the 10^6 ceiling to the sigma=1/2 halving landmark N ~ 3.27e9 the zero-index span is ~3.51 ' +
      'decades (3270x) and the RvM height span is ~3.28 decades (~1900x in T0), with the height decades ' +
      'strictly below the index decades',
    holds: () =>
      Math.abs(INDEX_RATIO_HALF - 3270) < 1e-6 &&
      INDEX_DECADES_HALF > 3.51 && INDEX_DECADES_HALF < 3.52 &&
      HEIGHT_RATIO_HALF > 1890 && HEIGHT_RATIO_HALF < 1910 &&
      HEIGHT_DECADES_HALF > 3.27 && HEIGHT_DECADES_HALF < 3.29 &&
      HEIGHT_DECADES_HALF < INDEX_DECADES_HALF, // height lags index per decade (log-factor discount)
  },
  {
    // Part A: the sub-0.1 landmark costs ~5.51 index decades / ~5.18 height decades (~1.5e5x in T0).
    id: 'imp35642-sub01-multiple',
    description:
      'from the 10^6 ceiling to the sigma<0.1 landmark N ~ 3.21e11 the zero-index span is ~5.51 decades ' +
      '(3.21e5x) and the RvM height span is ~5.18 decades (~1.50e5x in T0), with the height decades ' +
      'strictly below the index decades',
    holds: () =>
      Math.abs(INDEX_RATIO_SUB01 - 321000) < 1e-3 &&
      INDEX_DECADES_SUB01 > 5.5 && INDEX_DECADES_SUB01 < 5.51 &&
      HEIGHT_RATIO_SUB01 > 1.49e5 && HEIGHT_RATIO_SUB01 < 1.51e5 &&
      HEIGHT_DECADES_SUB01 > 5.17 && HEIGHT_DECADES_SUB01 < 5.18 &&
      HEIGHT_DECADES_SUB01 < INDEX_DECADES_SUB01,
  },
  {
    // Part B: both landmark heights sit below the verified height 3e12, which over-covers them in zero count.
    id: 'imp35642-verified-height-overcovers-landmarks',
    description:
      'both landmark heights (T0_half ~ 1.14e9, T0_sub01 ~ 9.01e10) sit below the Platt-Trudgian verified ' +
      'height 3e12, which by RvM contains ~1.24e13 zeros -- over-covering the halving landmark ~3781x and ' +
      'the sub-0.1 landmark ~38.5x -- so verified-zero availability is NOT the binding constraint',
    holds: () =>
      HALF_HEIGHT_BELOW_PT === true &&
      SUB01_HEIGHT_BELOW_PT === true &&
      N_PT > 1.2e13 && N_PT < 1.3e13 &&
      PT_OVERCOVER_HALF > 3700 && PT_OVERCOVER_HALF < 3860 &&
      PT_OVERCOVER_SUB01 > 37 && PT_OVERCOVER_SUB01 < 40,
  },
  {
    // Honesty gate: assessment only, imp-35337a stays OPEN, no bound moves, no refereed bound is changed, NO QED.
    id: 'imp35642-honesty-gate-no-qed',
    description:
      'assessment/scoping only: not rigorous, not unconditional, imp-35337a stays OPEN, no bound moves, ' +
      'C_mb GUE-conditional per imp-486, no refereed bound is changed, NO QED',
    holds: () =>
      Math.abs(L_PT - 0.2) < 1e-15 &&
      IMP35642_VERIFIED_HEIGHT_MULTIPLE_LANDMARK_SCOPE.isRigorous === false &&
      IMP35642_VERIFIED_HEIGHT_MULTIPLE_LANDMARK_SCOPE.isUnconditional === false &&
      /imp-35337a stays OPEN/.test(IMP35642_VERIFIED_HEIGHT_MULTIPLE_LANDMARK_SCOPE.verdict) &&
      /changes\s+no bound/.test(IMP35642_VERIFIED_HEIGHT_MULTIPLE_LANDMARK_SCOPE.verdict) &&
      /imp-486/.test(IMP35642_VERIFIED_HEIGHT_MULTIPLE_LANDMARK_SCOPE.verdict) &&
      /NO QED/.test(IMP35642_VERIFIED_HEIGHT_MULTIPLE_LANDMARK_SCOPE.verdict) &&
      /refereed bound is changed/i.test(IMP35642_VERIFIED_HEIGHT_MULTIPLE_LANDMARK_SCOPE.verdict),
  },
];

for (const a of IMP35642_VERIFIED_HEIGHT_MULTIPLE_LANDMARK_SCOPE_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-35642-verified-height-multiple-landmark-scope assertion failed: ${a.id}`);
  }
}

export default Object.freeze({
  id: 'imp-35642-verified-height-multiple-landmark-scope',
  ticket: 'imp-35642',
  scope: IMP35642_VERIFIED_HEIGHT_MULTIPLE_LANDMARK_SCOPE,
});
