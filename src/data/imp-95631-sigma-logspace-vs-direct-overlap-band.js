/**
 * @module imp-95631-sigma-logspace-vs-direct-overlap-band
 *
 * imp-95631 (numerical, frontier-direction): imp-95602 justifies its log-space sigma/exponent
 * evaluator by noting it "reproduces the imp-95582 direct grid to full precision at the shared
 * endpoint (both give p(1e12) = 0.4526)" -- a SINGLE-POINT check. Before that log-space form is used
 * out to 1e18 / 1e44 / 1e436 (where a materialized N overflows double precision), this module widens
 * the check from the one endpoint to the WHOLE overlapping decade [1e11, 1e12] on the shared
 * half-decade grid and reports the max relative disagreement in sigma(N) and in the pointwise local
 * exponent p(N) = -d ln sigma / d ln N between the two evaluators.
 *
 * THE TWO EVALUATORS (identical component model -- the point is they must AGREE, not differ)
 * ----------------------------------------------------------------------------------------
 *   DIRECT (materialized N): T0 = effectiveHeightForN(N); E_coll = C_C sqrt(log T0 / N);
 *     E_flow = C_F (log T0 / T0) Gronwall; sigma = E_coll / (E_trunc + E_flow + E_coll); p by
 *     symmetric central difference of ln sigma in ln N (imp-95582 pLocal).
 *   LOG-SPACE (from ln N, no materialized N): solve (T0/2pi)(u-1) = N with u = ln(T0/2pi) by Newton,
 *     ln N = u + ln(u-1); then E_coll/E_flow from their logs; sigma and p from ln sigma (imp-95602
 *     lnSigmaFromLnN / pLog10). This is the evaluator imp-95602 carries past N > 1e308.
 * Same C_C_PINNED, same E_trunc = 3.06e-5, same Gronwall -- so any disagreement is purely the
 * numerical cost of the log-space Newton solve vs the direct materialization, NOT a model difference.
 *
 * THE FINDING (cross-validation only)
 * -----------------------------------
 *   (F1) THE LOG-SPACE FORM AGREES WITH THE DIRECT GRID ACROSS THE WHOLE OVERLAP DECADE, NOT JUST AT
 *        1e12. On the shared half-decade grid log10 N in {11, 11.5, 12} the two evaluators match to
 *        max relative disagreement ~1.2e-15 in sigma(N) (machine epsilon) and ~1.0e-11 in the
 *        pointwise exponent p(N) (finite-difference roundoff of the central quotient). The imp-95602
 *        single-endpoint claim "both give p(1e12) = 0.4526" is therefore not a lucky coincidence at
 *        one N: the log-space evaluator introduces NO drift anywhere in the band before it is used out
 *        to 1e18 / 1e44 / 1e436.
 *   (F2) THE BAND VALUES MATCH THE imp-95582 DIRECT GRID TAIL. Across the overlap, sigma falls
 *        0.16297 -> 0.10069 -> 0.06044 and p climbs 0.40186 -> 0.43255 -> 0.45264, reproducing the top
 *        three rows of the imp-95582 half-decade fineGrid (which ends exactly at the 1e12 endpoint
 *        imp-95602 begins from). The two modules meet continuously at the shared decade.
 *
 * CROSS-VALIDATION ONLY. Conditional-share diagnostic, NOT an RH bound. The component model is the
 * inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the C_mb GUE-conditional per
 * imp-486 is UNTOUCHED; changes no bound; establishes no operator positivity; imp-3066 K_a >= 0
 * untouched; no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-95602-sigma-exponent-ramp-past-1e12 (log-space evaluator validated here across the band)
 * @see imp-95582-sigma-postpeak-fine-exponent-ramp (direct half-decade grid, ends at the 1e12 endpoint)
 * @see imp-3529-sigma-postpeak-decay-exponent (pointwise local exponent p(N) definition)
 * @see polymath15-constant-C-C (C_C = C_H sqrt(pi C_Selberg); C_H = 1/8 ansatz)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 = gamma_N)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3406/imp-95582/imp-95602)
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-95582/imp-95602 exactly
const HALF = 0.5;

// DIRECT materialized-N evaluator (exact imp-95582 form).
function partsDirect(N) {
  const T0 = effectiveHeightForN(N);
  const L = Math.log(T0);
  const C_F = (Math.log(T0 / TWO_PI) + 1) / TWO_PI; // imp-398 pinned prefactor
  const E_flow = C_F * (L / T0) * GRONWALL;
  const E_coll = C_C_PINNED * Math.sqrt(L / N);
  const E_N = E_TRUNC_PT + E_flow + E_coll;
  return E_coll / E_N;
}
function pDirect(N, dx = 1e-4) {
  const x = Math.log(N);
  return -(Math.log(partsDirect(Math.exp(x + dx))) - Math.log(partsDirect(Math.exp(x - dx)))) / (2 * dx);
}

// LOG-SPACE evaluator (exact imp-95602 form) -- the SAME sigma indexed by ln N, no materialized N.
function lnSigmaFromLnN(lnN) {
  let u = lnN; // seed: u ~ ln N for large N
  for (let i = 0; i < 80; i++) {
    const f = u + Math.log(u - 1) - lnN;
    const fp = 1 + 1 / (u - 1);
    u -= f / fp;
  }
  const lnT0 = u + Math.log(TWO_PI);
  const L = lnT0;
  const C_F = (u + 1) / TWO_PI;
  const lnEcoll = Math.log(C_C_PINNED) + 0.5 * (Math.log(L) - lnN);
  const lnEflow = Math.log(C_F) + Math.log(L) - lnT0 + Math.log(GRONWALL);
  const Ecoll = Math.exp(lnEcoll);
  const Eflow = Math.exp(lnEflow);
  const EN = E_TRUNC_PT + Eflow + Ecoll;
  return lnEcoll - Math.log(EN);
}
const sigmaLog = (d) => Math.exp(lnSigmaFromLnN(d * Math.LN10));
function pLog10(d, dx = 1e-4) {
  const x = d * Math.LN10;
  return -(lnSigmaFromLnN(x + dx) - lnSigmaFromLnN(x - dx)) / (2 * dx);
}

// (F1)/(F2) shared half-decade grid across the WHOLE overlap decade [1e11, 1e12].
const OVERLAP_BAND = [];
let MAX_REL_SIGMA = 0;
let MAX_REL_P = 0;
let MAX_REL_SIGMA_AT = null;
let MAX_REL_P_AT = null;
for (let d = 11; d <= 12 + 1e-9; d += 0.5) {
  const N = Math.pow(10, d);
  const sDir = partsDirect(N);
  const sLog = sigmaLog(d);
  const pDir = pDirect(N);
  const pLog = pLog10(d);
  const relSigma = Math.abs(sLog / sDir - 1);
  const relP = Math.abs(pLog / pDir - 1);
  if (relSigma > MAX_REL_SIGMA) {
    MAX_REL_SIGMA = relSigma;
    MAX_REL_SIGMA_AT = +d.toFixed(1);
  }
  if (relP > MAX_REL_P) {
    MAX_REL_P = relP;
    MAX_REL_P_AT = +d.toFixed(1);
  }
  OVERLAP_BAND.push({
    log10N: +d.toFixed(1),
    sigma_direct: +sDir.toFixed(6),
    sigma_logspace: +sLog.toFixed(6),
    relSigma: +relSigma.toExponential(3),
    p_direct: +pDir.toFixed(6),
    p_logspace: +pLog.toFixed(6),
    relP: +relP.toExponential(3),
  });
}

export const IMP95631_SIGMA_LOGSPACE_VS_DIRECT_OVERLAP_BAND = {
  id: 'imp-95631',
  proofSection: 'S-frontier',
  question:
    'imp-95602 validates its log-space sigma/exponent evaluator against the imp-95582 direct grid at ' +
    'ONLY the single shared endpoint p(1e12) = 0.4526. Recompute both evaluators (direct materialized-N ' +
    'and log-space) across the WHOLE overlapping decade [1e11, 1e12] on the shared half-decade grid and ' +
    'report the max relative disagreement in sigma(N) and in the pointwise exponent p(N), confirming the ' +
    'log-space form introduces no drift before it is used out to 1e18 / 1e44 / 1e436. Cross-validation ' +
    'only; conditional-share diagnostic, NOT an RH bound; no QED.',
  measuredQuantity:
    'max over the half-decade grid {1e11, 1e11.5, 1e12} of the relative disagreement |sigma_logspace / ' +
    'sigma_direct - 1| and |p_logspace / p_direct - 1| between the imp-95602 log-space evaluator and the ' +
    'imp-95582 direct materialized-N evaluator',
  overlapBand: OVERLAP_BAND,
  maxRelDisagreementSigma: +MAX_REL_SIGMA.toExponential(4), // ~1.2e-15 (machine epsilon)
  maxRelDisagreementSigmaAt: MAX_REL_SIGMA_AT, // log10 N where the sigma gap peaks
  maxRelDisagreementP: +MAX_REL_P.toExponential(4), // ~1.0e-11 (finite-difference roundoff)
  maxRelDisagreementPAt: MAX_REL_P_AT, // log10 N where the p gap peaks
  endpointP1e12Direct: +pDirect(1e12).toFixed(4), // 0.4526 -- the imp-95602 single-point claim
  endpointP1e12Logspace: +pLog10(12).toFixed(4), // 0.4526 -- reproduced band-wide, not just here
  finding: {
    F1_logspace_agrees_across_whole_band:
      'On the shared half-decade grid log10 N in {11, 11.5, 12} the log-space and direct evaluators ' +
      'match to max relative disagreement ~1.2e-15 in sigma(N) (machine epsilon) and ~1.0e-11 in the ' +
      'pointwise exponent p(N) (finite-difference roundoff). The imp-95602 single-endpoint claim ' +
      '"both give p(1e12) = 0.4526" is not a one-N coincidence: the log-space form introduces no drift ' +
      'anywhere in the overlap decade before it is used out to 1e18 / 1e44 / 1e436.',
    F2_band_matches_imp95582_grid_tail:
      'Across the overlap sigma falls 0.16297 -> 0.10069 -> 0.06044 and p climbs 0.40186 -> 0.43255 -> ' +
      '0.45264, reproducing the top three rows of the imp-95582 half-decade fineGrid (which ends exactly ' +
      'at the 1e12 endpoint imp-95602 begins from), so the two modules meet continuously at the shared ' +
      'decade.',
  },
  isRigorous: false,
  verdict:
    'CROSS-VALIDATION (frontier-direction, NOT rigorous). Widening the imp-95602 log-space-vs-direct ' +
    'check from the single endpoint p(1e12) = 0.4526 to the whole overlap decade [1e11, 1e12] on the ' +
    'shared half-decade grid: the two evaluators agree to max relative disagreement ~1.2e-15 in sigma ' +
    'and ~1.0e-11 in the pointwise exponent p -- machine-precision and finite-difference roundoff only. ' +
    'The log-space evaluator introduces no drift across the band, so its use out to 1e18 / 1e44 / 1e436 ' +
    'inherits the direct grid to full precision. The component model is the inherited imp-3220/imp-3406 ' +
    'extrapolation, NOT a rigorous asymptotic; the C_mb GUE-conditional per imp-486 is UNTOUCHED; ' +
    'changes no bound; establishes no operator positivity; imp-3066 K_a >= 0 untouched; no RH verdict, ' +
    'NO QED. No refereed bound is changed.',
  citation:
    'imp-95602 (log-space evaluator validated here across the band); imp-95582 (direct half-decade grid, ' +
    'ends at the 1e12 endpoint); imp-3529 (pointwise local exponent p(N)); imp-486 (C_mb GUE-conditional); ' +
    'imp-2631 (E_trunc fixed-strip route); lambda-rh-height-mapping.',
};

export const IMP95631_SIGMA_LOGSPACE_VS_DIRECT_OVERLAP_BAND_ASSERTIONS = [
  {
    // (F1) sigma agrees across the WHOLE band to machine epsilon, not just at 1e12.
    id: 'imp95631-logspace-sigma-matches-direct-across-band',
    description: 'max relative sigma disagreement over {1e11,1e11.5,1e12} is below 1e-12',
    holds: () => MAX_REL_SIGMA < 1e-12,
  },
  {
    // (F1) pointwise exponent agrees across the whole band to finite-difference roundoff.
    id: 'imp95631-logspace-p-matches-direct-across-band',
    description: 'max relative pointwise-exponent disagreement over the band is below 1e-8',
    holds: () => MAX_REL_P < 1e-8,
  },
  {
    // The band actually spans the overlap decade at half-decade spacing (three points).
    id: 'imp95631-band-spans-overlap-decade',
    description: 'grid is {11, 11.5, 12} (three half-decade points across [1e11,1e12])',
    holds: () =>
      OVERLAP_BAND.length === 3 &&
      OVERLAP_BAND[0].log10N === 11 &&
      OVERLAP_BAND[OVERLAP_BAND.length - 1].log10N === 12,
  },
  {
    // (F2) both evaluators reproduce the imp-95602 single-endpoint value p(1e12) ~ 0.4526.
    id: 'imp95631-endpoint-reproduces-0-4526',
    description: 'both evaluators give p(1e12) = 0.4526, the imp-95602 shared-endpoint value',
    holds: () =>
      IMP95631_SIGMA_LOGSPACE_VS_DIRECT_OVERLAP_BAND.endpointP1e12Direct === 0.4526 &&
      IMP95631_SIGMA_LOGSPACE_VS_DIRECT_OVERLAP_BAND.endpointP1e12Logspace === 0.4526,
  },
  {
    // (F2) sigma and p ramp monotonely across the band toward the imp-3463 far-tail 1/2.
    id: 'imp95631-band-ramps-monotonely',
    description: 'sigma strictly falls and p strictly rises across the band, p stays below 1/2',
    holds: () => {
      for (let i = 1; i < OVERLAP_BAND.length; i++) {
        if (!(OVERLAP_BAND[i].sigma_direct < OVERLAP_BAND[i - 1].sigma_direct)) return false;
        if (!(OVERLAP_BAND[i].p_direct > OVERLAP_BAND[i - 1].p_direct)) return false;
      }
      return OVERLAP_BAND.every((r) => r.p_direct < HALF);
    },
  },
  {
    // Honesty gate: cross-validation only, no QED, no refereed bound is changed.
    id: 'imp95631-honesty-gate-no-qed',
    description: 'Cross-validation only: not rigorous, no QED, no refereed bound is changed',
    holds: () =>
      IMP95631_SIGMA_LOGSPACE_VS_DIRECT_OVERLAP_BAND.isRigorous === false &&
      /NO QED/.test(IMP95631_SIGMA_LOGSPACE_VS_DIRECT_OVERLAP_BAND.verdict) &&
      /refereed bound is changed/i.test(IMP95631_SIGMA_LOGSPACE_VS_DIRECT_OVERLAP_BAND.verdict),
  },
];

for (const a of IMP95631_SIGMA_LOGSPACE_VS_DIRECT_OVERLAP_BAND_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-95631-sigma-logspace-vs-direct-overlap-band assertion failed: ${a.id}`);
  }
}
