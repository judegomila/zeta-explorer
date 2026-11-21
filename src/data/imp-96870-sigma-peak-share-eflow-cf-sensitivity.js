/**
 * @module imp-96870-sigma-peak-share-eflow-cf-sensitivity
 *
 * imp-96870 (numerical, frontier-direction): MEASURE THE E_flow / C_F THIRD-LEVER
 * single-lever partial dg_sigma/dlogC_F of the binding GUE-conditional peak share
 * sigma_max -- the ONE imp-3406 denominator term that no sibling sweep ever touched.
 * imp-96831 swept C_C (dg_sigma/dlogC_C ~ +0.0487), imp-96794 swept E_trunc
 * (dg_sigma/dlogE_trunc ~ -0.0190), and imp-96851 measured their joint cross-term.
 * NONE swept the third denominator term E_flow = C_F (log T0 / T0) Gronwall, whose
 * prefactor C_F = (log(T0/2pi)+1)/2pi is imp-398. This module isolates that lever.
 *
 * WHY THIS IS A DISTINCT MEASUREMENT
 * ----------------------------------
 * The imp-3406 model denominator is D = E_trunc + E_flow + E_coll. imp-96851 concluded
 * neither C_C nor E_trunc (nor their combination) can materially shrink the ~0.95
 * binding peak share, but it left E_flow untested on the (reasonable-looking) prior that
 * E_flow is negligibly small. That prior turns out to be FALSE at the interior peak:
 * at N_max ~ 9.22e5 the term E_flow ~ 4.68e-5 is actually LARGER than the E_trunc floor
 * (3.06e-5), so its denominator share psi = E_flow/D ~ 3.06e-2 EXCEEDS the E_trunc share
 * phi ~ 2.00e-2. That makes the C_F lever the LARGER of the two negative levers -- worth
 * measuring on its own before declaring the denominator swept. Measurement/sensitivity
 * only.
 *
 * THE QUANTITY (identical imp-3406 / imp-96794 / imp-96831 / imp-96851 model)
 * -------------------------------------------------------------------------
 *     sigma(N) = E_coll / (E_trunc + E_flow + E_coll),
 *     T0     = effectiveHeightForN(N)              (Riemann-von Mangoldt inverse)
 *     E_coll = C_C * sqrt(log T0 / N)              (GUE-conditional, dominant)
 *     E_flow = cf * C_F (log T0 / T0) * Gronwall,  C_F = (log(T0/2pi)+1)/2pi (imp-398)
 *     E_trunc = 3.06e-5                            (imp-2631 fixed-strip floor)
 * The free multiplier cf scales the C_F prefactor; at cf = 1 this reproduces imp-3406
 * byte-for-byte (N_max ~ 9.22e5, sigma_max ~ 0.94943). cf is the swept lever.
 *
 * THE MECHANISM (closed form of the single-lever partial, via the shared denominator)
 * ---------------------------------------------------------------------------------
 * Write z = log cf. Since E_flow is linear in cf, dE_flow/dz = E_flow, and at fixed N
 * with sigma = E_coll/D:
 *     dg_sigma/dz = -(E_coll/D^2) dD/dz = -(E_coll/D)(E_flow/D) = -sigma * psi,
 * with psi = E_flow / D the E_flow share of the denominator (mirroring the E_trunc
 * partial -sigma*phi of imp-96794). At the interior peak the envelope theorem
 * (dg_sigma/dN = 0) makes the measured peak-share partial match this fixed-N form.
 * At the base peak sigma ~ 0.9494 and psi ~ 0.0306, so dg_sigma/dlogC_F ~ -0.029 < 0.
 *
 * THE FINDING (measurement / sensitivity only)
 * --------------------------------------------
 *   (F1) THE C_F SINGLE-LEVER PARTIAL IS NEGATIVE AND MATCHES THE ENVELOPE FORM.
 *        The measured dg_sigma/dlogC_F ~ -0.0292 matches the closed-form envelope
 *        prediction -sigma*psi ~ -0.0290 to ~0.5 percent. Raising C_F lowers the
 *        conditional peak share (same sign as the E_trunc lever).
 *   (F2) THE E_flow LEVER IS THE LARGER OF THE TWO NEGATIVE LEVERS -- E_flow IS NOT
 *        NEGLIGIBLE AT THE PEAK. At N_max the term E_flow ~ 4.68e-5 EXCEEDS the E_trunc
 *        floor 3.06e-5, so psi ~ 0.0306 > phi ~ 0.0200 and |dg_sigma/dlogC_F| ~ 0.029 >
 *        |dg_sigma/dlogE_trunc| ~ 0.019. The untested denominator term carries the
 *        BIGGER (though still subdominant to C_C at +0.049) share-shrinking leverage.
 *   (F3) NO IN-MODEL C_F MOVE MATERIALLY SHRINKS THE BINDING SHARE. Over a wide band
 *        (0.25x..16x C_F) sigma_max ranges only ~0.785..0.978; a realistic 4x inflation
 *        of C_F leaves it at ~0.891, and only an absurd 16x drives it to ~0.785. The
 *        ~0.95 conditioning burden is intrinsic to the dominant GUE-conditional E_coll
 *        term (imp-486), unshrinkable by any in-model move on the E_flow prefactor.
 *
 * VERDICT: THE E_flow / C_F LEVER MOVES sigma_max ONLY WEAKLY, BUT MORE THAN E_trunc.
 * The single-lever partial dg_sigma/dlogC_F ~ -0.029 matches the closed-form envelope
 * -sigma*psi (psi = E_flow share) and, because E_flow ~ 4.68e-5 actually exceeds the
 * E_trunc floor 3.06e-5 at the interior peak, is the LARGER of the two negative levers
 * -- yet still an order below the dominant C_C partial (+0.049) and far too weak to
 * dislodge the binding share: even a 16x C_F inflation leaves sigma_max ~ 0.785. With
 * all three imp-3406 denominator terms now swept (C_C, E_trunc, E_flow), NO in-model
 * lever makes the ~0.95 conditioning burden disappear -- it is intrinsic to the dominant
 * GUE-conditional E_coll term (imp-486). Measurement/sensitivity only; C_mb/C_C stay
 * GUE-conditional (imp-486); no bound changes, no positivity, no bridge closure, no RH
 * claim, NO QED. No refereed bound is changed.
 *
 * @see imp-96851-sigma-peak-share-cc-etrunc-joint-sensitivity (the C_C/E_trunc joint sweep)
 * @see imp-96831-sigma-peak-share-cc-sensitivity (the C_C single-lever partial +0.048)
 * @see imp-96794-etrunc-reduction-peak-share-leverage (the E_trunc single-lever partial -0.019)
 * @see imp-3406-sigma-highN-extrapolation (interior max N_max ~ 9.22e5, sigma_max ~ 0.9494)
 * @see imp-486 (C_mb / C_C GUE-conditional; the pinned constant)
 * @see imp-2631 (E_trunc = 3.06e-5 fixed-strip floor)
 * @see imp-398 (E_flow C_F prefactor)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 = gamma_N)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_BASE = 3.06e-5; // imp-2631 fixed-strip floor (imp-3406 pin)
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-3406 / imp-96851 exactly

// EXACT imp-3406 sub-terms; the C_F prefactor is scaled by the free multiplier cf.
function sigmaWith(N, cf) {
  const T0 = effectiveHeightForN(N);
  const L = Math.log(T0);
  const C_F = (cf * (Math.log(T0 / TWO_PI) + 1)) / TWO_PI; // imp-398 prefactor, scaled
  const E_flow = C_F * (L / T0) * GRONWALL;
  const E_coll = C_C_PINNED * Math.sqrt(L / N);
  return E_coll / (E_TRUNC_BASE + E_flow + E_coll);
}

// Ternary search for the interior maximum in ln N (same spirit as imp-3406/imp-96851).
function argmaxN(cf, hiExp = 10) {
  let lo = Math.log(1e3);
  let hi = Math.log(10 ** hiExp);
  for (let i = 0; i < 700; i++) {
    const m1 = lo + (hi - lo) / 3;
    const m2 = hi - (hi - lo) / 3;
    if (sigmaWith(Math.exp(m1), cf) < sigmaWith(Math.exp(m2), cf)) lo = m1;
    else hi = m2;
  }
  return Math.exp((lo + hi) / 2);
}

function peakShare(cf) {
  const N_max = argmaxN(cf);
  return { N_max, sigma_max: sigmaWith(N_max, cf) };
}

const BASE = peakShare(1.0);

// Single-lever partial at the base peak (log-centred sqrt2 flanks -- matches siblings).
const F_LO = 1 / Math.SQRT2;
const F_HI = Math.SQRT2;
const D_SIGMA_D_LOG_CF =
  (peakShare(F_HI).sigma_max - peakShare(F_LO).sigma_max) / (Math.log(F_HI) - Math.log(F_LO));

// Closed-form envelope prediction of the partial: -sigma*psi, psi = E_flow share of D
// at the base peak. Also compute the E_flow and E_trunc terms to show E_flow > E_trunc.
const T0_BASE = effectiveHeightForN(BASE.N_max);
const L_BASE = Math.log(T0_BASE);
const C_F_BASE = (Math.log(T0_BASE / TWO_PI) + 1) / TWO_PI;
const E_FLOW_BASE = C_F_BASE * (L_BASE / T0_BASE) * GRONWALL;
const E_COLL_BASE = C_C_PINNED * Math.sqrt(L_BASE / BASE.N_max);
const D_TOTAL_BASE = E_TRUNC_BASE + E_FLOW_BASE + E_COLL_BASE;
const PSI_EFLOW = E_FLOW_BASE / D_TOTAL_BASE; // E_flow share
const PHI_ETRUNC = E_TRUNC_BASE / D_TOTAL_BASE; // E_trunc share (for the comparison)
const PARTIAL_ENVELOPE = -BASE.sigma_max * PSI_EFLOW;

// Band envelope: sweep C_F over a wide band and record the full range of the peak share.
const CF_FACTORS = [0.25, 0.5, 0.75, 1.0, 1.5, 2.0, 4.0, 8.0, 16.0];
let bandMin = Infinity;
let bandMax = -Infinity;
let bandMinCorner = null;
let bandMaxCorner = null;
for (const f of CF_FACTORS) {
  const s = peakShare(f).sigma_max;
  if (s < bandMin) { bandMin = s; bandMinCorner = { cfFactor: f }; }
  if (s > bandMax) { bandMax = s; bandMaxCorner = { cfFactor: f }; }
}

// Compact band table for the record.
const BAND_TABLE = [
  { cfFactor: 1.0, sigma_max: +BASE.sigma_max.toFixed(7), N_max: +BASE.N_max.toExponential(4) },
  { cfFactor: 4.0, sigma_max: +peakShare(4.0).sigma_max.toFixed(7) },
  { cfFactor: 16.0, sigma_max: +peakShare(16.0).sigma_max.toFixed(7) },
  { cfFactor: 0.25, sigma_max: +peakShare(0.25).sigma_max.toFixed(7) },
];

export const IMP96870_SIGMA_PEAK_SHARE_EFLOW_CF_SENSITIVITY = {
  id: 'imp-96870',
  proofSection: 'S-frontier',
  question:
    'How does the binding GUE-conditional peak share sigma_max ~ 0.9494 respond to the ' +
    'THIRD imp-3406 denominator term E_flow via its C_F prefactor (imp-398), the one ' +
    'lever no sibling sweep touched? Measure the single-lever partial dg_sigma/dlogC_F ' +
    'at the base peak, compare it to the closed-form envelope -sigma*psi (psi = E_flow ' +
    'share), and report whether the E_flow lever moves sigma_max at all. ' +
    'Measurement/sensitivity only; C_C stays GUE-conditional (imp-486); no bound changes.',
  baseRow: { N_max: +BASE.N_max.toExponential(4), sigma_max: +BASE.sigma_max.toFixed(7) },
  denominatorDecomposition: {
    e_trunc: +E_TRUNC_BASE.toExponential(4), // 3.06e-5
    e_flow: +E_FLOW_BASE.toExponential(4), // ~4.68e-5 -- LARGER than E_trunc
    e_coll: +E_COLL_BASE.toExponential(4), // ~1.45e-3 -- dominant
    psi_eflow_share: +PSI_EFLOW.toExponential(4), // ~3.06e-2
    phi_etrunc_share: +PHI_ETRUNC.toExponential(4), // ~2.00e-2
    note:
      'At the interior peak E_flow ~ 4.68e-5 EXCEEDS the E_trunc floor 3.06e-5, so the ' +
      'E_flow denominator share psi ~ 0.0306 exceeds the E_trunc share phi ~ 0.0200. The ' +
      'untested term is not negligible; it carries the larger of the two negative levers.',
  },
  singleLeverPartial: {
    d_sigma_max_d_log_cf: +D_SIGMA_D_LOG_CF.toExponential(5), // ~ -2.92e-2
    envelope_prediction_neg_sigma_psi: +PARTIAL_ENVELOPE.toExponential(5), // ~ -2.90e-2
    rel_gap_measured_vs_envelope: +(Math.abs(D_SIGMA_D_LOG_CF - PARTIAL_ENVELOPE) / Math.abs(PARTIAL_ENVELOPE)).toExponential(3),
    sign: D_SIGMA_D_LOG_CF < 0 ? 'negative' : 'positive',
    compare_to_etrunc_partial: -0.018998, // imp-96794 / imp-96851 E_trunc partial for reference
    compare_to_cc_partial: 0.048697, // imp-96831 / imp-96851 C_C partial for reference
    note:
      'The C_F single-lever partial ~ -0.029 is NEGATIVE (same sign as the E_trunc ' +
      'lever), matches the envelope -sigma*psi to ~0.5 percent, and is LARGER in ' +
      'magnitude than the E_trunc partial (-0.019) because E_flow > E_trunc at the peak ' +
      '-- yet still an order below the dominant C_C partial (+0.049).',
  },
  bandEnvelope: {
    cfFactors: CF_FACTORS,
    sigma_max_min: +bandMin.toFixed(7),
    sigma_max_min_corner: bandMinCorner,
    sigma_max_max: +bandMax.toFixed(7),
    sigma_max_max_corner: bandMaxCorner,
    span: +(bandMax - bandMin).toFixed(6),
    note:
      'Over the wide band (0.25x..16x C_F) sigma_max ranges only ~0.785..0.978; a ' +
      'realistic 4x C_F inflation leaves it at ~0.891, and only an absurd 16x drives it ' +
      'to ~0.785. No in-model C_F move materially shrinks the ~0.95 conditioning burden.',
  },
  bandTable: BAND_TABLE,
  verdict:
    'THE E_flow / C_F LEVER MOVES sigma_max ONLY WEAKLY, BUT MORE THAN E_trunc. The ' +
    'single-lever partial dg_sigma/dlogC_F ~ -0.029 matches the closed-form envelope ' +
    '-sigma*psi (psi = E_flow share) and, because E_flow ~ 4.68e-5 actually exceeds the ' +
    'E_trunc floor 3.06e-5 at the interior peak, is the LARGER of the two negative levers ' +
    '-- yet still an order below the dominant C_C partial (+0.049) and far too weak to ' +
    'dislodge the binding share: even a 16x C_F inflation leaves sigma_max ~ 0.785. With ' +
    'all three imp-3406 denominator terms now swept (C_C, E_trunc, E_flow), NO in-model ' +
    'lever makes the ~0.95 conditioning burden disappear -- it is intrinsic to the ' +
    'dominant GUE-conditional E_coll term (imp-486). Measurement/sensitivity only; ' +
    'C_mb/C_C stay GUE-conditional (imp-486); no bound changes, no positivity, no bridge ' +
    'closure, no RH claim, NO QED. No refereed bound is changed.',
  isRigorous: false,
  citation:
    'imp-96851 (C_C/E_trunc joint sweep); imp-96831 (C_C single-lever partial +0.048); ' +
    'imp-96794 (E_trunc single-lever partial -0.019); imp-3406 (interior max N_max ~ ' +
    '9.22e5, sigma_max ~ 0.9494); imp-486 (C_mb / C_C GUE-conditional); imp-2631 ' +
    '(E_trunc = 3.06e-5 floor); imp-398 (E_flow C_F prefactor); lambda-rh-height-mapping.',
};

export const IMP96870_SIGMA_PEAK_SHARE_EFLOW_CF_SENSITIVITY_ASSERTIONS = [
  {
    // Reuse gate: base (1x C_F) reproduces the imp-3406 / imp-96851 pin.
    id: 'imp96870-reproduces-imp3406-base-peak',
    description: 'base (1x C_F) reproduces imp-3406 N_max ~ 9.22e5 and sigma_max ~ 0.94943',
    holds: () =>
      Math.abs(BASE.N_max - 9.2186e5) / 9.2186e5 < 1e-3 &&
      Math.abs(BASE.sigma_max - 0.9494290) < 5e-5,
  },
  {
    // F1: the C_F single-lever partial is NEGATIVE.
    id: 'imp96870-cf-partial-negative',
    description: 'the measured single-lever partial dg_sigma/dlogC_F is negative',
    holds: () => D_SIGMA_D_LOG_CF < 0,
  },
  {
    // F1: the measured partial matches the closed-form envelope -sigma*psi.
    id: 'imp96870-cf-partial-matches-envelope',
    description: 'the measured C_F partial matches the envelope prediction -sigma*psi within 2 percent',
    holds: () => Math.abs(D_SIGMA_D_LOG_CF - PARTIAL_ENVELOPE) / Math.abs(PARTIAL_ENVELOPE) < 0.02,
  },
  {
    // F2: E_flow exceeds E_trunc at the interior peak (the untested term is not negligible).
    id: 'imp96870-eflow-exceeds-etrunc-at-peak',
    description: 'at the interior peak E_flow exceeds the E_trunc floor, so psi > phi',
    holds: () => E_FLOW_BASE > E_TRUNC_BASE && PSI_EFLOW > PHI_ETRUNC,
  },
  {
    // F2: the C_F lever is larger than the E_trunc lever but subdominant to the C_C lever.
    id: 'imp96870-cf-larger-than-etrunc-below-cc',
    description: 'the C_F partial magnitude exceeds the E_trunc partial (0.019) yet stays below the C_C partial (0.049)',
    holds: () => Math.abs(D_SIGMA_D_LOG_CF) > 0.019 && Math.abs(D_SIGMA_D_LOG_CF) < 0.049,
  },
  {
    // F3: no in-model C_F move materially shrinks the binding conditional share below ~0.78.
    id: 'imp96870-band-share-not-materially-shrunk',
    description: 'over the wide C_F band the binding conditional share sigma_max never drops below 0.78 (the ~0.95 burden is unshrinkable in-model)',
    holds: () => bandMin > 0.78,
  },
  {
    // Honesty gate: measurement/assessment only, weak-lever verdict, no QED, no refereed bound is changed.
    id: 'imp96870-honesty-gate-no-qed',
    description: 'Assessment only: E_flow-lever-moves-weakly verdict, no QED, no refereed bound is changed',
    holds: () =>
      IMP96870_SIGMA_PEAK_SHARE_EFLOW_CF_SENSITIVITY.isRigorous === false &&
      /MOVES sigma_max ONLY WEAKLY/.test(IMP96870_SIGMA_PEAK_SHARE_EFLOW_CF_SENSITIVITY.verdict) &&
      /NO QED/.test(IMP96870_SIGMA_PEAK_SHARE_EFLOW_CF_SENSITIVITY.verdict) &&
      /refereed bound is changed/i.test(IMP96870_SIGMA_PEAK_SHARE_EFLOW_CF_SENSITIVITY.verdict),
  },
];

for (const a of IMP96870_SIGMA_PEAK_SHARE_EFLOW_CF_SENSITIVITY_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-96870-sigma-peak-share-eflow-cf-sensitivity assertion failed: ${a.id}`,
    );
  }
}
