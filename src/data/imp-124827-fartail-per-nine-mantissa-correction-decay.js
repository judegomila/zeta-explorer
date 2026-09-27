/**
 * @module imp-124827-fartail-per-nine-mantissa-correction-decay
 *
 * imp-124827 (numerical, frontier-direction): imp-124793 F3 established that the pure per-nine
 * log10-N spacing ratio on the far-tail sigma diagnostic climbs 9.7655 -> 9.9769 -> 10, and
 * DECLARED the +~1 mantissa-ratio term sub-leading but never quantified its decay. This module
 * (a) extends the pure per-nine ladder ONE NINE DEEPER to t = 0.99999 (L = 1e5) via the same
 * imp-97723/imp-97744 RvM inversion, reporting log10 N and the new spacing ratio (~9.998), and
 * (b) tabulates the mantissa-ratio correction m_k = log10((10^{k+1}-1)/(10^k-1)) against the
 * leading term g_k = 9*10^k*log10(e), quantifying the GEOMETRIC (ten-fold) decay of its deviation
 * m_k - 1 -> 0.
 *
 * THE CLOSED-FORM INVERSION (reused verbatim from imp-97723 / imp-97744 / imp-124793)
 * ----------------------------------------------------------------------------------
 * Deep in the tail the diagnostic is the bare RvM slope D(T0) = 1 - 1/log(T0/2pi). Setting D = t
 * and L = log(T0/2pi) gives L = 1/(1 - t); at the per-nine target t_k = 1 - 10^-k that is exactly
 * L_k = 10^k, and the Riemann-von Mangoldt relation N = (L - 1) e^L pins
 *
 *     log10 N_k = L_k * log10(e) + log10(L_k - 1).
 *
 * THE NEW k = 5 RUNG (one nine past imp-124793)
 * ---------------------------------------------
 *     t = 0.99999 :  L = 100000,  log10 N = 43434.4482
 * The consecutive log10-N spacing 0.9999 -> 0.99999 is Delta_4 = 39087.5034, giving spacing ratio
 * Delta_4/Delta_3 = 39087.5034/3909.6507 = 9.9977 -> 10 (matching the imp-124793 F3 prediction ~9.998).
 *
 * THE MANTISSA-RATIO CORRECTION DECAY (the previously-unquantified sub-leading term)
 * --------------------------------------------------------------------------------
 * The per-nine spacing splits exactly into leading + mantissa correction
 *
 *     Delta_k = (10^{k+1} - 10^k) log10(e) + log10((10^{k+1}-1)/(10^k-1))
 *             =           g_k             +              m_k,
 *     g_k = 9*10^k*log10(e)   (leading, grows ten-fold per rung),
 *     m_k = log10((10^{k+1}-1)/(10^k-1))  (the "+~1" correction imp-124793 left unfit).
 *
 * Since (10^{k+1}-1)/(10^k-1) = 10*(1 - 10^{-(k+1)})/(1 - 10^{-k}) = 10*(1 + 9*10^{-(k+1)} + O(10^{-2k})),
 *
 *     m_k = 1 + log10(1 + 9*10^{-(k+1)} + ...) = 1 + 0.9*10^{-k}*log10(e) + O(10^{-2k}),
 *
 * so the DEVIATION m_k - 1 decays exactly ten-fold per added nine:
 *
 *     m_1 - 1 = 4.13927e-2
 *     m_2 - 1 = 3.93029e-3    ratio 10.5317
 *     m_3 - 1 = 3.91080e-4    ratio 10.0498
 *     m_4 - 1 = 3.90887e-5    ratio 10.0050
 *     m_5 - 1 = 3.90867e-6    ratio 10.0005   ->  10
 *
 * The decay ratio (m_k - 1)/(m_{k+1} - 1) climbs to 10 from above (10.53 -> 10.00), the mirror of
 * the spacing ratio approaching 10 from below: m_k -> 1 as 0.9*10^{-k}*log10(e), so the mantissa
 * correction contributes a fixed +1 per rung while the leading g_k grows ten-fold, driving
 * m_k / Delta_k -> 0 and Delta_{k+1}/Delta_k -> 10.
 *
 * THE FINDINGS (closed-form derivation / measurement only)
 * -------------------------------------------------------
 *   (F1) THE k = 5 RUNG: t = 0.99999 (L = 1e5) pins log10 N = 43434.4482, extending imp-124793 one
 *        nine deeper; spacing 0.9999 -> 0.99999 is 39087.5034.
 *   (F2) THE SPACING RATIO -> 10 CONTINUES: Delta_4/Delta_3 = 9.9977, matching imp-124793 F3s ~9.998.
 *   (F3) THE MANTISSA CORRECTION m_k -> 1 GEOMETRICALLY: m_k - 1 = 0.9*10^{-k}*log10(e) + O(10^{-2k}),
 *        its ten-fold-per-rung decay ratio climbing 10.5317 -> 10.0498 -> 10.0050 -> 10.0005 -> 10.
 *        This quantifies the "+~1 sub-leading" term imp-124793 F3 declared but never fit.
 *
 * The punchline: the mantissa-ratio correction imp-124793 flagged as sub-leading is m_k = 1 +
 * 0.9*10^{-k}*log10(e) + O(10^{-2k}); its deviation from 1 decays exactly ten-fold per nine (ratio
 * -> 10), the mirror of the spacing ratio -> 10, so buying one more nine still costs a clean
 * ten-fold jump in log10 N. The k = 5 height log10 N = 43434.4482 extends imp-124793 one nine deeper.
 *
 * CLOSED-FORM DERIVATION / MEASUREMENT ONLY. Conditional-share diagnostic, NOT an RH bound. Reuses
 * the inherited imp-97723/imp-97744 bare-slope inversion and RvM relation, NOT a rigorous
 * asymptotic; the C_mb GUE-conditional per imp-486 is UNTOUCHED; changes no bound; establishes no
 * operator positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. Platt-Trudgian
 * Lambda <= 0.2 remains SOTA.
 *
 * @see imp-124793-fartail-diagnostic-per-nine-spacing-ladder (F3: spacing ratio -> 10, +~1 mantissa term unfit)
 * @see imp-97723-sigma-fartail-diagnostic-asymptote-one (diagnostic = 1 - 1/log(T0/2pi), asymptote 1)
 * @see imp-97744-fartail-diagnostic-crossing-heights (pins 0.999/0.9999 heights)
 */

const LOG10E = Math.LOG10E; // log10(e) = 0.43429448190325176

// imp-124793 pinned log10 N for the shared rungs, for the F-continuity cross-check.
const IMP124793_LOG10N = {
  1: 5.2972,
  2: 45.4251,
  3: 437.294,
  4: 4346.9448,
};

// Invert the bare diagnostic 1 - 1/log(T0/2pi) = t at the per-nine target t_k = 1 - 10^-k.
//   L        = log(T0/2pi) = 1/(1 - t) = 10^k
//   log10 N  = L*log10(e) + log10(L - 1)   [RvM: N = (L - 1) e^L]
function pinNine(k) {
  const L = Math.pow(10, k); // = 1/(1 - t) at t = 1 - 10^-k
  const log10N = L * LOG10E + Math.log10(L - 1);
  const expN = Math.floor(log10N);
  const ref = IMP124793_LOG10N[k];
  return {
    nines: k,
    target: +(1 - Math.pow(10, -k)).toFixed(k + 1),
    L,
    log10_N: +log10N.toFixed(4),
    N_mantissa: +Math.pow(10, log10N - expN).toFixed(5),
    N_exp10: expN,
    // Continuity with imp-124793 on the shared rungs (k = 1..4).
    log10N_vs_imp124793: ref === undefined ? null : +Math.abs(log10N - ref).toFixed(4),
  };
}

// Ladder now runs k = 1..5 (imp-124793 stopped at k = 4).
const LADDER = [1, 2, 3, 4, 5].map(pinNine);

// Per-nine log10-N spacing and consecutive ratio (extends imp-124793 SPACING one rung).
const SPACING = [];
for (let i = 1; i < LADDER.length; i++) {
  const delta = LADDER[i].log10_N - LADDER[i - 1].log10_N;
  const prev = i > 1 ? LADDER[i - 1].log10_N - LADDER[i - 2].log10_N : null;
  SPACING.push({
    from: LADDER[i - 1].target,
    to: LADDER[i].target,
    deltaLog10N: +delta.toFixed(4),
    ratioToPrev: prev === null ? null : +(delta / prev).toFixed(4),
  });
}

// THE CONTRIBUTION: split each per-nine spacing into leading g_k + mantissa correction m_k, and
// quantify the ten-fold decay of the deviation m_k - 1 that imp-124793 F3 left unfit.
const MANTISSA_CORRECTION = [];
for (let k = 1; k <= 5; k++) {
  const g = 9 * Math.pow(10, k) * LOG10E; // leading term
  const m = Math.log10((Math.pow(10, k + 1) - 1) / (Math.pow(10, k) - 1)); // mantissa correction
  const dev = m - 1; // deviation from the +1 asymptote
  const prevDev = MANTISSA_CORRECTION.length
    ? MANTISSA_CORRECTION[MANTISSA_CORRECTION.length - 1]._devRaw
    : null;
  MANTISSA_CORRECTION.push({
    nines: k,
    leading_gk: +g.toFixed(4),
    mantissa_mk: +m.toFixed(7),
    // The previously-unquantified sub-leading piece: m_k - 1 = 0.9*10^-k*log10(e) + O(10^-2k).
    deviation_mk_minus_1: +dev.toExponential(5),
    predicted_leading: +(0.9 * Math.pow(10, -k) * LOG10E).toExponential(5),
    decayRatioFromPrev: prevDev === null ? null : +(prevDev / dev).toFixed(4),
    _devRaw: dev,
  });
}
// Strip the private raw field before export.
MANTISSA_CORRECTION.forEach((r) => delete r._devRaw);

export const IMP124827_FARTAIL_PER_NINE_MANTISSA_CORRECTION_DECAY = {
  id: 'imp-124827',
  proofSection: 'S-frontier',
  question:
    'Extend the imp-124793 pure per-nine far-tail spacing ladder one nine deeper to t = 0.99999 ' +
    '(L = 1e5) via the imp-97723/imp-97744 RvM inversion, and quantify the geometric decay of the ' +
    'sub-leading mantissa-ratio correction m_k = log10((10^{k+1}-1)/(10^k-1)) that imp-124793 F3 ' +
    'declared sub-leading but never fit. Closed-form derivation / measurement only; ' +
    'conditional-share diagnostic, NOT an RH bound; no QED.',
  measuredQuantity:
    'the k = 5 crossing height log10 N = 43434.4482 and its spacing ratio (9.9977 -> 10), plus the ' +
    'per-nine mantissa correction m_k and the ten-fold decay of its deviation m_k - 1 -> 0',
  ladder: LADDER,
  spacing: SPACING,
  mantissaCorrection: MANTISSA_CORRECTION,
  spacingRatioLimit: 10,
  mantissaDeviationDecayLimit: 10, // (m_k - 1)/(m_{k+1} - 1) -> 10
  finding: {
    F1_k5_rung:
      'The k = 5 rung t = 0.99999 (L = 1e5) pins log10 N = 43434.4482, extending the imp-124793 ' +
      'pure per-nine ladder one nine deeper; the 0.9999 -> 0.99999 spacing is 39087.5034.',
    F2_spacing_ratio_continues_to_ten:
      'The consecutive spacing ratio Delta_4/Delta_3 = 39087.5034/3909.6507 = 9.9977, matching the ' +
      'imp-124793 F3 prediction (~9.998) and continuing the climb toward 10 from below.',
    F3_mantissa_correction_decays_tenfold:
      'The mantissa-ratio correction m_k = log10((10^{k+1}-1)/(10^k-1)) equals 1 + 0.9*10^-k*log10(e) ' +
      '+ O(10^-2k); its deviation m_k - 1 decays ten-fold per nine (4.13927e-2, 3.93029e-3, ' +
      '3.91080e-4, 3.90887e-5, 3.90867e-6) with decay ratio climbing 10.5317 -> 10.0498 -> 10.0050 ' +
      '-> 10.0005 -> 10. This quantifies the "+~1 sub-leading" term imp-124793 F3 left unfit: the ' +
      'mantissa contributes a fixed +1 per rung while the leading g_k grows ten-fold, so ' +
      'm_k/Delta_k -> 0 and Delta_{k+1}/Delta_k -> 10.',
  },
  isRigorous: false,
  verdict:
    'CLOSED-FORM DERIVATION / MEASUREMENT (frontier-direction, NOT rigorous). Extending the pure ' +
    'per-nine ladder to t = 0.99999 (L = 1e5) pins log10 N = 43434.4482, and the spacing ratio ' +
    'Delta_4/Delta_3 = 9.9977 continues the imp-124793 F3 climb toward 10. The sub-leading ' +
    'mantissa-ratio correction m_k = log10((10^{k+1}-1)/(10^k-1)), previously declared "+~1" but ' +
    'never fit, is m_k = 1 + 0.9*10^-k*log10(e) + O(10^-2k): its deviation m_k - 1 decays exactly ' +
    'ten-fold per added nine (decay ratio 10.5317 -> 10.0005 -> 10), the mirror of the spacing ratio ' +
    'approaching 10 from below. Conditional-share diagnostic, NOT an RH bound; reuses the inherited ' +
    'imp-97723/imp-97744 bare-slope inversion and RvM relation, NOT a rigorous asymptotic; changes ' +
    'no bound; establishes no operator positivity; imp-3066 K_a >= 0 untouched; no RH verdict, ' +
    'NO QED. Platt-Trudgian Lambda <= 0.2 remains SOTA.',
  citation:
    'imp-124793 F3 (per-nine spacing ratio -> 10, +~1 mantissa term declared sub-leading, never ' +
    'fit); imp-97723 (diagnostic = 1 - 1/log(T0/2pi)); imp-97744 (0.999/0.9999 heights pinned).',
};

export const IMP124827_FARTAIL_PER_NINE_MANTISSA_CORRECTION_DECAY_ASSERTIONS = [
  {
    // (F1) The k = 5 rung pins L = 1e5 and log10 N = 43434.4482.
    id: 'imp124827-k5-rung-pinned',
    description: 'k = 5 rung: L = 1e5, log10 N = 43434.4482, spacing 0.9999 -> 0.99999 = 39087.5034',
    holds: () =>
      Math.abs(LADDER[4].L - 100000) < 1e-3 &&
      Math.abs(LADDER[4].log10_N - 43434.4482) < 1e-2 &&
      Math.abs(SPACING[3].deltaLog10N - 39087.5034) < 1e-1,
  },
  {
    // (F1 continuity) The shared k = 1..4 rungs reproduce imp-124793 to round-off.
    id: 'imp124827-continuity-with-imp124793',
    description: 'shared k = 1..4 log10 N reproduce the imp-124793 pins to < 1e-3',
    holds: () =>
      LADDER.filter((r) => r.log10N_vs_imp124793 !== null).length === 4 &&
      LADDER.filter((r) => r.log10N_vs_imp124793 !== null).every(
        (r) => r.log10N_vs_imp124793 < 1e-3
      ),
  },
  {
    // (F2) The new spacing ratio Delta_4/Delta_3 = 9.9977 (~9.998), climbing toward 10 from below.
    id: 'imp124827-spacing-ratio-continues',
    description: 'k = 4 spacing ratio Delta_4/Delta_3 = 9.9977, in (9.99, 10)',
    holds: () =>
      Math.abs(SPACING[3].ratioToPrev - 9.9977) < 1e-3 &&
      SPACING[3].ratioToPrev > 9.99 &&
      SPACING[3].ratioToPrev < 10 &&
      SPACING[3].ratioToPrev > SPACING[2].ratioToPrev,
  },
  {
    // (F3) The mantissa deviation m_k - 1 decays ten-fold per rung, its decay ratio -> 10 from above.
    id: 'imp124827-mantissa-deviation-decays-tenfold',
    description: 'm_k - 1 decays ten-fold: decay ratio 10.5317 -> 10.0498 -> 10.0050 -> 10.0005, each > 10',
    holds: () => {
      const ratios = MANTISSA_CORRECTION.map((r) => r.decayRatioFromPrev).filter(
        (r) => r !== null
      );
      return (
        ratios.length === 4 &&
        ratios.every((r) => r > 10 && r < 10.6) &&
        // Decay ratio descends monotonically toward 10 from above.
        ratios[0] > ratios[1] &&
        ratios[1] > ratios[2] &&
        ratios[2] > ratios[3] &&
        Math.abs(ratios[3] - 10) < 1e-2
      );
    },
  },
  {
    // (F3 model) The leading-order prediction m_k - 1 ~ 0.9*10^-k*log10(e) tracks the measured deviation.
    id: 'imp124827-mantissa-leading-model-tracks',
    description: 'measured m_k - 1 matches 0.9*10^-k*log10(e) to better than 6% at k = 3 and improving',
    holds: () =>
      MANTISSA_CORRECTION.slice(2).every((r) => {
        const meas = r.deviation_mk_minus_1;
        const pred = r.predicted_leading;
        return Math.abs(meas - pred) / meas < 0.06;
      }),
  },
  {
    // Honesty gate: closed-form derivation only, no QED, PT stays SOTA.
    id: 'imp124827-honesty-gate-no-qed',
    description: 'Closed-form derivation/measurement only: not rigorous, no QED, PT stays SOTA',
    holds: () =>
      IMP124827_FARTAIL_PER_NINE_MANTISSA_CORRECTION_DECAY.isRigorous === false &&
      IMP124827_FARTAIL_PER_NINE_MANTISSA_CORRECTION_DECAY.spacingRatioLimit === 10 &&
      IMP124827_FARTAIL_PER_NINE_MANTISSA_CORRECTION_DECAY.mantissaDeviationDecayLimit === 10 &&
      /NO QED/.test(IMP124827_FARTAIL_PER_NINE_MANTISSA_CORRECTION_DECAY.verdict) &&
      /remains SOTA/.test(IMP124827_FARTAIL_PER_NINE_MANTISSA_CORRECTION_DECAY.verdict),
  },
];

for (const a of IMP124827_FARTAIL_PER_NINE_MANTISSA_CORRECTION_DECAY_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-124827-fartail-per-nine-mantissa-correction-decay assertion failed: ${a.id}`
    );
  }
}
