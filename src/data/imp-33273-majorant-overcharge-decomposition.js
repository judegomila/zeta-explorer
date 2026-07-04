/**
 * @module imp-33273-majorant-overcharge-decomposition
 * @fileoverview imp-33273 (numerical/measurement, HONEST): QUANTIFY how much of
 * the imp-3910 certified majorant ratio R_maj is majorant OVER-CHARGE on the far
 * (wide path-gap-spread) terms versus GENUINE realised tail contribution, on all
 * 10 imp-3725 plateaus, with the largest-N endpoint plateau 9 (R_maj = 6.82) as
 * the headline. Closes the second imp-33250 obstruction residual: the majorant
 * substitution e_j <= 8/s_min(j)^2 over-charges far terms and that over-charge is
 * what drives R_maj up while the realised ratio K_real stays O(1) ~ 1.
 *
 * WHAT imp-33250 LEFT OPEN (obstruction residual #2)
 * --------------------------------------------------
 * imp-33250 named two coupled obstructions to a certified N-uniform tail-weight
 * constant. Residual #2: the per-term majorant substitution
 *     e_j = 8 P_j/D_j  <=  8 / s_min(j)^2      (imp-3898/imp-3917, proved + per-term verified)
 * OVER-CHARGES far terms whose gap path is wide (many gaps, s_min << D_j), and it
 * is that over-charge -- NOT genuine tail growth -- that lifts the certified
 * aggregate majorant ratio R_maj to 6.82 at the largest-N plateau 9 while the
 * realised ratio K_real stays flat O(1) ~ 1. imp-33250 never QUANTIFIED the split.
 *
 * THE EXACT DECOMPOSITION (derived LIVE from the imp-33269 baked rows)
 * -------------------------------------------------------------------
 * On each plateau imp-33269 baked the two w_j = 1/D_j^2 -weighted aggregates:
 *     M        = 8 (sum_j w_j / s_min(j)^2) / (sum_j w_j)     (majorant weighted avg)
 *     realised = 8 (sum_j w_j P_j/D_j)      / (sum_j w_j)     (realised weighted avg)
 * and the collapse scaling Dmin^2/8 that turns each into a ratio-to-8/Dmin^2:
 *     R_maj  = M        * Dmin^2 / 8   (certified majorant ratio, = C/8)
 *     K_real = realised * Dmin^2 / 8   (realised ratio)
 * Because BOTH ratios share the SAME Dmin^2/8 scaling, R_maj splits EXACTLY into a
 * genuine part and an over-charge part with NO cross term:
 *     R_maj = K_real            +   (M - realised) * Dmin^2 / 8
 *           = genuine (realised)  +   majorant over-charge
 * so the over-charge FRACTION of R_maj is the scaling-free ratio
 *     f_oc = 1 - realised/M = (M - realised)/M                (independent of Dmin).
 * This is EXACT arithmetic on the already-scanned imp-33269 aggregates -- no new
 * scan, no new bound: it merely REFRAMES R_maj = K_real + over-charge and reads
 * off the split. genuineRMaj derived here reproduces the imp-33269 baked K_real
 * (rReal) to full precision, confirming the reframing is faithful.
 *
 * WHERE THE OVER-CHARGE LIVES (imp-3917 per-term saturation profile)
 * -----------------------------------------------------------------
 * imp-3917 machine-checked per-term that ONLY the 1-2 nearest single-gap terms
 * (m_j = 1, s_min = D_j) saturate the majorant (ratio e_j/(8/s_min^2) = 1, zero
 * slack); EVERY other active term -- the far, wide-path-gap-spread terms -- sits
 * STRICTLY below. So the genuine part K_real ~ 1 is carried by the majorant-tight
 * nearest terms, and the ENTIRE over-charge (M - realised) is carried by the far
 * terms. The decomposition below therefore attributes R_maj's rise cleanly: the
 * K_real ~ 1 floor is real nearest-term elasticity; everything above it is far-term
 * majorant slack.
 *
 * THE MEASUREMENT VERDICT (measurement, NOT certification)
 * -------------------------------------------------------
 *  - AT THE ENDPOINT (plateau 9, R_maj = 6.82): over-charge fraction f_oc = 84.70%.
 *    Only 15.30% (K_real = 1.044) is genuine realised tail contribution; the other
 *    +5.776 of R_maj is far-term majorant over-charge. The mean far-term over-charge
 *    factor is M/realised = 6.53x.
 *  - ACROSS ALL 10 PLATEAUS: f_oc is LARGE and O(1)-bounded, in [54.4%, 87.1%]
 *    (min at plateau 4, max at plateau 5). The genuine part genuineRMaj = K_real is
 *    O(1) in [0.80, 1.60] on every plateau -- it NEVER grows with N. So the entire
 *    N-variation of R_maj (1.81 .. 11.08) is far-term over-charge, not tail growth.
 *  - This directly answers imp-33250 residual #2: R_maj's endpoint value 6.82 is
 *    DOMINATED (84.7%) by majorant over-charge on wide-spread far terms; the genuine
 *    tail contribution is the flat K_real ~ 1 floor, so R_maj measures majorant
 *    slack, not a growing tail.
 *
 * HONEST SCOPE
 * ------------
 *  - MEASUREMENT on the 10 plateaus of [1e4,1e6], REFRAMING already-scanned
 *    imp-33269 aggregates. No new offline scan; genuineRMaj cross-checks the
 *    imp-33269 baked K_real live. Do NOT read f_oc as tightening the certified
 *    bound: R_maj <= 8/s_min^2 substitution is what MAKES the tail weight
 *    certifiable at all; the over-charge is the PRICE of that rigor, quantified.
 *  - The N->infinity split is UN-certified; a finite 10-plateau measurement of the
 *    over-charge fraction is NOT a certified N-uniform statement.
 *  - Measurement only. imp-3910 C <= 54.56 (its 3 plateaus) stands as stated;
 *    imp-3066 K_a >= 0 UNTOUCHED; Platt-Trudgian Lambda <= 0.2 remains SOTA; NO QED.
 *
 * @see imp-33269-all-plateaus-majorant-ratio-scan.js (source of the M/realised/Dmin aggregates)
 * @see imp-33250-tail-weight-ratio-n-uniformity-assessment.js (named this obstruction residual #2)
 * @see imp-3917-per-term-majorant-crossvalidation.js (per-term: over-charge lives on the far terms)
 * @see imp-3910-tail-weight-constant-certification.js (the certified majorant ratio decomposed here)
 */

import { IMP_33269_ALL_PLATEAUS_MAJORANT_RATIO_SCAN } from './imp-33269-all-plateaus-majorant-ratio-scan.js';

const SRC = IMP_33269_ALL_PLATEAUS_MAJORANT_RATIO_SCAN.rows;

// Derive the R_maj = genuine + over-charge split LIVE from the imp-33269 baked
// aggregates. genuineRMaj = realised*Dmin^2/8 must reproduce the baked K_real
// (rReal); overChargeRMaj = R_maj - genuineRMaj; f_oc = 1 - realised/M.
const ROWS = SRC.map((r) => {
  const scale = (r.Dmin * r.Dmin) / 8;                 // Dmin^2/8 (shared by both ratios)
  const genuineRMaj = r.realisedScan * scale;          // = K_real (realised part of R_maj)
  const overChargeRMaj = r.rMaj - genuineRMaj;         // far-term majorant over-charge
  const overChargeFraction = 1 - r.realisedScan / r.majorantM; // scaling-free = (M-realised)/M
  const overChargeFactor = r.majorantM / r.realisedScan;       // mean far-term slack M/realised
  return Object.freeze({
    plateauIndex: r.plateauIndex,
    endN: r.endN,
    Dmin: r.Dmin,
    majorantM: r.majorantM,
    realisedScan: r.realisedScan,
    rMaj: r.rMaj,
    genuineRMaj,
    overChargeRMaj,
    overChargeFraction,
    overChargeFactor,
    kRealBaked: r.rReal,
  });
});

const OC_FRAC = ROWS.map((r) => r.overChargeFraction);
const OC_FRAC_MIN = Math.min(...OC_FRAC);
const OC_FRAC_MAX = Math.max(...OC_FRAC);
const OC_FRAC_ARGMIN = ROWS.find((r) => r.overChargeFraction === OC_FRAC_MIN).plateauIndex;
const OC_FRAC_ARGMAX = ROWS.find((r) => r.overChargeFraction === OC_FRAC_MAX).plateauIndex;
const GENUINE = ROWS.map((r) => r.genuineRMaj);
const GENUINE_MIN = Math.min(...GENUINE);
const GENUINE_MAX = Math.max(...GENUINE);
const P9 = ROWS[9];

export const IMP_33273_MAJORANT_OVERCHARGE_DECOMPOSITION = Object.freeze({
  id: 'imp-33273',
  title:
    'Decompose the imp-3910 certified majorant ratio R_maj = K_real (genuine realised ' +
    'tail) + far-term majorant over-charge on all 10 plateaus: at the endpoint plateau 9 ' +
    '(R_maj = 6.82) 84.70% is over-charge and only 15.30% (K_real = 1.044) is genuine; ' +
    'over-charge fraction in [54.4%, 87.1%] with the genuine part flat O(1), not growing',
  status: 'measurement',
  rhFree: true,
  semantics:
    'exact live reframing of the imp-33269 w_j-weighted aggregates M/realised/Dmin into ' +
    'R_maj = realised*Dmin^2/8 (genuine) + (M-realised)*Dmin^2/8 (far-term over-charge); ' +
    'reports the over-charge fraction f_oc = 1 - realised/M per plateau; no new scan, no ' +
    'certified N-uniform constant, no new Lambda, no QED',

  thetaBar: IMP_33269_ALL_PLATEAUS_MAJORANT_RATIO_SCAN.thetaBar, // 0.99
  rows: ROWS,

  verdict: {
    endpointPlateau: 9,
    endpointRMaj: P9.rMaj,                                 // 6.82
    endpointGenuineRMaj: P9.genuineRMaj,                   // ~1.044 (= K_real)
    endpointOverChargeRMaj: P9.overChargeRMaj,             // ~5.776
    endpointOverChargeFraction: P9.overChargeFraction,     // ~0.8470
    endpointOverChargeFactor: P9.overChargeFactor,         // ~6.53x
    overChargeFractionRange: [OC_FRAC_MIN, OC_FRAC_MAX],   // ~[0.544, 0.871]
    overChargeFractionArgmin: OC_FRAC_ARGMIN,              // 4
    overChargeFractionArgmax: OC_FRAC_ARGMAX,              // 5
    genuineRMajRange: [GENUINE_MIN, GENUINE_MAX],          // ~[0.80, 1.60]
    finding:
      'Splitting the imp-3910 certified majorant ratio R_maj = C/8 into its genuine and ' +
      'over-charge parts (both share the Dmin^2/8 collapse scaling, so R_maj = K_real + ' +
      '(M-realised)*Dmin^2/8 EXACTLY, no cross term): at the largest-N endpoint plateau 9 ' +
      '(R_maj = 6.82) the over-charge fraction f_oc = 1 - realised/M = 84.70%. Only 15.30% ' +
      '(K_real = 1.044) is genuine realised tail contribution; the other +5.776 of R_maj is ' +
      'majorant over-charge, the mean far-term slack being M/realised = 6.53x. Per imp-3917 ' +
      'the majorant is tight (zero slack, ratio 1) ONLY at the 1-2 nearest single-gap terms, ' +
      'so the genuine K_real ~ 1 floor is carried by those nearest terms and the ENTIRE ' +
      'over-charge is carried by the far, wide-path-gap-spread terms -- exactly the imp-33250 ' +
      'residual #2 picture. Across all 10 plateaus f_oc is large and O(1)-bounded in ' +
      '[54.4%, 87.1%] (min plateau 4, max plateau 5) and the genuine part genuineRMaj = ' +
      'K_real is O(1) in [0.80, 1.60] on EVERY plateau, never growing with N -- so the whole ' +
      'N-variation of R_maj (1.81..11.08) is far-term majorant over-charge, not a growing ' +
      'tail. MEASUREMENT ONLY (exact reframing of the imp-33269 scan; genuineRMaj reproduces ' +
      'the baked K_real live): the N->infinity split is un-certified, and the over-charge is ' +
      'the PRICE of the rigorous 8/s_min^2 substitution, quantified -- not a defect to remove. ' +
      'imp-3910 C <= 54.56 stands as stated; imp-3066 K_a >= 0 UNTOUCHED; PT Lambda <= 0.2 SOTA; NO QED.',
  },

  closesResidual: {
    id: 'imp-33250-obstruction-residual-2',
    resolution:
      'The imp-3910 majorant substitution over-charge is quantified: at the endpoint ' +
      'plateau 9 R_maj = 6.82 is 84.70% far-term over-charge and only 15.30% (K_real = ' +
      '1.044) genuine realised tail; across all 10 plateaus the over-charge fraction is ' +
      '[54.4%, 87.1%] and the genuine part stays flat O(1), so R_maj measures majorant ' +
      'slack on the far terms, not a growing tail -- exactly imp-33250 residual #2.',
    residual:
      'Still a finite 10-plateau MEASUREMENT of [1e4,1e6]; the N->infinity over-charge ' +
      'split is un-certified. Quantifying the over-charge does not tighten the certified ' +
      'bound -- a certified N-uniform C would need an analytic far-term tail bound tighter ' +
      'than the 8/s_min^2 substitution, not a slack measurement.',
  },

  provenance: {
    source: 'imp-33269-all-plateaus-majorant-ratio-scan.js (M/realised/Dmin/R_maj/K_real, 10 plateaus)',
    perTermProfile: 'imp-3917-per-term-majorant-crossvalidation.js (over-charge lives on the far terms)',
    zeros: 'src/data/zeros-to-1e6.js (Odlyzko; zeros1 3e-9, imp-359/imp-514)',
    method: 'exact live arithmetic reframing of baked aggregates; no new offline scan',
    generatedAt: '2026-07-04',
  },

  scope: {
    measurementOnly: true,
    noNewOfflineScan: true,
    noCertifiedNUniformConstant: true,
    noNewLambdaBound: true,
    imp3066Untouched: true,
    plattTrudgianStillSOTA: 'Lambda <= 0.2 (PT 2021) remains SOTA',
    noQED: true,
  },
});

// -- Build-time assertions (throw on failure via run-assertions harness) -----

const rel = (x, y) => Math.abs(x - y) / Math.max(Math.abs(x), Math.abs(y), 1e-300);

export const IMP_33273_MAJORANT_OVERCHARGE_DECOMPOSITION_ASSERTIONS = [
  {
    id: 'imp33273-genuine-part-reproduces-baked-kreal',
    holds: () =>
      ROWS.length === 10 &&
      ROWS.every((r) => rel(r.genuineRMaj, r.kRealBaked) < 1e-4),
    why:
      'Faithfulness guard: the derived genuine part genuineRMaj = realised*Dmin^2/8 must ' +
      'reproduce the imp-33269 baked realised ratio K_real (rReal) on every plateau, ' +
      'confirming R_maj = K_real + over-charge is an EXACT reframing of the scanned data.',
  },
  {
    id: 'imp33273-split-is-exact-no-cross-term',
    holds: () =>
      ROWS.every((r) =>
        rel(r.genuineRMaj + r.overChargeRMaj, r.rMaj) < 1e-9 &&
        rel(r.overChargeFraction, r.overChargeRMaj / r.rMaj) < 1e-6),
    why:
      'Exactness guard: R_maj = genuineRMaj + overChargeRMaj to machine precision (both ' +
      'ratios share the Dmin^2/8 scaling, so there is no cross term), and the scaling-free ' +
      'over-charge fraction 1 - realised/M equals overChargeRMaj/R_maj.',
  },
  {
    id: 'imp33273-endpoint-plateau9-847pct-overcharge',
    holds: () =>
      rel(P9.rMaj, 6.820032) < 1e-4 &&
      P9.overChargeFraction > 0.845 && P9.overChargeFraction < 0.849 &&
      rel(P9.genuineRMaj, 1.04377) < 1e-3 &&
      P9.overChargeFactor > 6.5 && P9.overChargeFactor < 6.6,
    why:
      'Central measurement: at the largest-N endpoint plateau 9 (R_maj = 6.82) the ' +
      'over-charge fraction is 84.70%, the genuine part is K_real = 1.044 (15.30%), and the ' +
      'mean far-term over-charge factor M/realised is ~6.53x -- so R_maj is dominated by ' +
      'far-term majorant over-charge, resolving imp-33250 residual #2.',
  },
  {
    id: 'imp33273-overcharge-large-genuine-flat-across-plateaus',
    holds: () =>
      OC_FRAC_MIN > 0.5 && OC_FRAC_MAX < 0.9 &&
      OC_FRAC_ARGMIN === 4 && OC_FRAC_ARGMAX === 5 &&
      GENUINE_MIN > 0.7 && GENUINE_MAX < 1.7,
    why:
      'The over-charge fraction is large and O(1)-bounded in [54.4%, 87.1%] on all 10 ' +
      'plateaus (min plateau 4, max plateau 5), while the genuine part genuineRMaj = K_real ' +
      'stays O(1) in [0.80, 1.60] and never grows with N -- so R_maj variation is over-charge, ' +
      'not tail growth.',
  },
  {
    id: 'imp33273-measurement-only-no-lambda-claim',
    holds: () =>
      IMP_33273_MAJORANT_OVERCHARGE_DECOMPOSITION.scope.measurementOnly === true &&
      IMP_33273_MAJORANT_OVERCHARGE_DECOMPOSITION.scope.noCertifiedNUniformConstant === true &&
      IMP_33273_MAJORANT_OVERCHARGE_DECOMPOSITION.scope.noQED === true &&
      IMP_33273_MAJORANT_OVERCHARGE_DECOMPOSITION.scope.imp3066Untouched === true &&
      IMP_33273_MAJORANT_OVERCHARGE_DECOMPOSITION.status === 'measurement' &&
      // must not disturb the certified upstream bound
      IMP_33269_ALL_PLATEAUS_MAJORANT_RATIO_SCAN.scope.noQED === true,
    why:
      'Honesty guard: this quantifies the majorant over-charge but claims no certified ' +
      'N-uniform constant and no new Lambda bound, does not tighten the certified bound, ' +
      'leaves imp-3066 untouched, and Platt-Trudgian Lambda <= 0.2 remains SOTA.',
  },
];

// Self-executing (imp-3715 convention): any failed assertion throws at import.
for (const assertion of IMP_33273_MAJORANT_OVERCHARGE_DECOMPOSITION_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(
      `imp-33273-majorant-overcharge-decomposition assertion failed: ${assertion.id}`,
    );
  }
}

export default IMP_33273_MAJORANT_OVERCHARGE_DECOMPOSITION;
