/**
 * @module imp-124846-fartail-mantissa-leading-ratio-isolation
 *
 * imp-124846 (numerical, frontier-direction): imp-124793 F3 declared the per-nine spacing law
 * Delta_k = g_k + m_k with g_k = 9*10^k*log10(e) the leading term and m_k the "+~1" mantissa-ratio
 * correction; imp-124827 extended the ladder to t = 0.99999 (L = 1e5, k = 5) and fit the decay of
 * m_k - 1 -> 0. Both stopped short of the specific deliverable of THIS ticket: isolating the
 * mantissa correction AS ITS OWN TERM AGAINST THE LEADING TERM, i.e. tabulating the ratio
 * m_k / g_k and the share m_k / Delta_k so the sub-leading term is quantified relative to the
 * leading 9*10^k*log10(e), not just relative to 1. imp-124827 stated m_k / Delta_k -> 0 in prose;
 * this module tabulates that share and the leading-term ratio numerically over k = 1..5 and shows
 * both decay exactly ten-fold per added nine.
 *
 * THE CLOSED-FORM INVERSION (reused verbatim from imp-97723 / imp-97744 / imp-124793 / imp-124827)
 * ----------------------------------------------------------------------------------------------
 * Deep in the tail the diagnostic is the bare RvM slope D(T0) = 1 - 1/log(T0/2pi). Setting D = t
 * and L = log(T0/2pi) gives L = 1/(1 - t); at the per-nine target t_k = 1 - 10^-k that is exactly
 * L_k = 10^k, and the Riemann-von Mangoldt relation N = (L - 1) e^L pins
 *
 *     log10 N_k = L_k * log10(e) + log10(L_k - 1),
 *     Delta_k   = log10 N_{k+1} - log10 N_k = g_k + m_k,
 *     g_k = 9*10^k*log10(e)                 (leading term, grows ten-fold per rung),
 *     m_k = log10((10^{k+1}-1)/(10^k-1))    (the mantissa-ratio correction, -> 1).
 *
 * THE ISOLATION (the deliverable: correction against the leading term)
 * -------------------------------------------------------------------
 * Because m_k -> 1 (a fixed +1 per rung) while g_k grows ten-fold, both the leading-term ratio and
 * the share of the per-nine spacing carried by the mantissa correction decay ten-fold per nine:
 *
 *     m_k / g_k :  2.664328e-2, 2.568483e-3, 2.559428e-4, 2.558528e-5, 2.558438e-6
 *     m_k / Del :  2.595184e-2, 2.561903e-3, 2.558774e-4, 2.558462e-5, 2.558431e-6
 *
 * with consecutive decay ratio (m_k/g_k)/(m_{k+1}/g_{k+1}) climbing 10.3732 -> 10.0354 -> 10.0035
 * -> 10.0004 -> 10, and the share ratio 10.1299 -> 10.0122 -> 10.0012 -> 10.0001 -> 10. The leading
 * behaviour is m_k / g_k ~ 1/g_k = (1/(9*log10(e)))*10^-k = 0.255843*10^-k (m_k -> 1), the exact
 * quantitative statement of "the mantissa term is sub-leading": it contributes a fixed +1 while the
 * leading grows ten-fold, so its FRACTION of Delta_k vanishes ten-fold per nine, forcing
 * Delta_{k+1}/Delta_k -> 10.
 *
 * THE FINDINGS (closed-form derivation / measurement only)
 * -------------------------------------------------------
 *   (F1) THE LEADING-TERM RATIO m_k/g_k DECAYS TEN-FOLD: 2.664328e-2 down to 2.558438e-6 over
 *        k = 1..5, decay ratio 10.3732 -> 10.0004 -> 10, isolating the correction against the
 *        leading 9*10^k*log10(e) term (not merely against its own +1 asymptote as imp-124827 did).
 *   (F2) THE MANTISSA SHARE m_k/Delta_k DECAYS TEN-FOLD: 2.595184e-2 down to 2.558431e-6, decay
 *        ratio 10.1299 -> 10.0001 -> 10; the previously-prose "m_k/Delta_k -> 0" now tabulated.
 *   (F3) THE LEADING RATE m_k/g_k ~ 0.255843*10^-k = (1/(9*log10(e)))*10^-k tracks the measured
 *        ratio to better than 5% from k = 3 on (m_k -> 1 makes the fit tighten with k).
 *
 * The punchline: isolated against its leading term, the mantissa-ratio correction carries a fraction
 * m_k/Delta_k ~ 0.256*10^-k of each per-nine spacing, decaying exactly ten-fold per added nine -- the
 * quantitative version of "sub-leading" that closes the imp-124793 F3 / imp-124827 loose end.
 *
 * CLOSED-FORM DERIVATION / MEASUREMENT ONLY. Conditional-share diagnostic, NOT an RH bound. Reuses
 * the inherited imp-97723/imp-97744 bare-slope inversion and RvM relation, NOT a rigorous
 * asymptotic; the C_mb GUE-conditional per imp-486 is UNTOUCHED; changes no bound; establishes no
 * operator positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-124827-fartail-per-nine-mantissa-correction-decay (k=5 rung, m_k - 1 decay fit)
 * @see imp-124793-fartail-diagnostic-per-nine-spacing-ladder (F3: spacing ratio -> 10, +~1 term unfit)
 * @see imp-97723-sigma-fartail-diagnostic-asymptote-one (diagnostic = 1 - 1/log(T0/2pi), asymptote 1)
 */

const LOG10E = Math.LOG10E; // log10(e) = 0.43429448190325176

// Isolate the mantissa-ratio correction m_k against the leading term g_k over the per-nine ladder
// k = 1..5 (t = 0.9 .. 0.99999, L = 10 .. 1e5). Delta_k = g_k + m_k exactly.
const RATIO_TABLE = [];
for (let k = 1; k <= 5; k++) {
  const g = 9 * Math.pow(10, k) * LOG10E; // leading term
  const m = Math.log10((Math.pow(10, k + 1) - 1) / (Math.pow(10, k) - 1)); // mantissa correction
  const delta = g + m; // full per-nine spacing
  const ratioToLeading = m / g; // mantissa vs leading term (the isolation)
  const share = m / delta; // mantissa fraction of the total spacing
  const prev = RATIO_TABLE.length ? RATIO_TABLE[RATIO_TABLE.length - 1] : null;
  RATIO_TABLE.push({
    nines: k,
    leading_gk: +g.toFixed(4),
    mantissa_mk: +m.toFixed(7),
    deltaLog10N: +delta.toFixed(4),
    ratio_mk_over_gk: +ratioToLeading.toExponential(6),
    share_mk_over_delta: +share.toExponential(6),
    // Leading-order model for the ratio: m_k/g_k ~ 1/g_k = (1/(9*log10(e)))*10^-k since m_k -> 1.
    predicted_ratio: +((1 / (9 * LOG10E)) * Math.pow(10, -k)).toExponential(6),
    ratioDecayFromPrev: prev === null ? null : +(prev._ratioRaw / ratioToLeading).toFixed(4),
    shareDecayFromPrev: prev === null ? null : +(prev._shareRaw / share).toFixed(4),
    _ratioRaw: ratioToLeading,
    _shareRaw: share,
  });
}
// Strip the private raw fields before export.
RATIO_TABLE.forEach((r) => {
  delete r._ratioRaw;
  delete r._shareRaw;
});

export const IMP124846_FARTAIL_MANTISSA_LEADING_RATIO_ISOLATION = {
  id: 'imp-124846',
  proofSection: 'S-frontier',
  question:
    'Isolate the imp-124793/imp-124827 sub-leading mantissa-ratio correction m_k = ' +
    'log10((10^{k+1}-1)/(10^k-1)) as its own term against the leading g_k = 9*10^k*log10(e) over the ' +
    'per-nine ladder t = 0.9 .. 0.99999 (L = 10 .. 1e5): tabulate the ratio m_k/g_k and the share ' +
    'm_k/Delta_k and measure their decay. Closed-form derivation / measurement only; ' +
    'conditional-share diagnostic, NOT an RH bound; no QED.',
  measuredQuantity:
    'the mantissa-to-leading ratio m_k/g_k and the mantissa share m_k/Delta_k over k = 1..5, and ' +
    'their ten-fold-per-nine decay isolating the correction against the 9*10^k*log10(e) leading term',
  ratioTable: RATIO_TABLE,
  ratioDecayLimit: 10, // (m_k/g_k)/(m_{k+1}/g_{k+1}) -> 10 and the share ratio -> 10
  leadingRateCoefficient: +(1 / (9 * LOG10E)).toFixed(6), // m_k/g_k ~ 0.255843*10^-k
  finding: {
    F1_leading_ratio_decays_tenfold:
      'The leading-term ratio m_k/g_k = 2.664328e-2, 2.568483e-3, 2.559428e-4, 2.558528e-5, ' +
      '2.558438e-6 over k = 1..5, with consecutive decay ratio 10.3732 -> 10.0354 -> 10.0035 -> ' +
      '10.0004 -> 10. This isolates the mantissa correction against the leading 9*10^k*log10(e) term ' +
      '(imp-124827 measured only m_k - 1 against its own +1 asymptote).',
    F2_mantissa_share_decays_tenfold:
      'The mantissa share of the per-nine spacing m_k/Delta_k = 2.595184e-2 down to 2.558431e-6, ' +
      'decay ratio 10.1299 -> 10.0122 -> 10.0012 -> 10.0001 -> 10. This tabulates the previously ' +
      'prose-only imp-124827 statement m_k/Delta_k -> 0, forcing Delta_{k+1}/Delta_k -> 10.',
    F3_leading_rate_model:
      'The ratio obeys m_k/g_k ~ 1/g_k = (1/(9*log10(e)))*10^-k = 0.255843*10^-k (since m_k -> 1); ' +
      'the model tracks the measured ratio to better than 5% from k = 3 on and tightens with k.',
  },
  isRigorous: false,
  verdict:
    'CLOSED-FORM DERIVATION / MEASUREMENT (frontier-direction, NOT rigorous). Isolating the ' +
    'mantissa-ratio correction m_k = log10((10^{k+1}-1)/(10^k-1)) against the leading term ' +
    'g_k = 9*10^k*log10(e) over the per-nine ladder t = 0.9 .. 0.99999 (L = 10 .. 1e5), the ratio ' +
    'm_k/g_k = 2.664328e-2 .. 2.558438e-6 and the share m_k/Delta_k = 2.595184e-2 .. 2.558431e-6 ' +
    'each decay exactly ten-fold per added nine (decay ratio -> 10), with leading rate ' +
    'm_k/g_k ~ 0.255843*10^-k (m_k -> 1). This closes the imp-124793 F3 / imp-124827 loose end by ' +
    'quantifying the sub-leading term relative to the leading one, not just to its own +1 asymptote. ' +
    'Conditional-share diagnostic, NOT an RH bound; reuses the inherited imp-97723/imp-97744 ' +
    'bare-slope inversion and RvM relation, NOT a rigorous asymptotic; changes no bound; establishes ' +
    'no operator positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. No refereed bound is changed' +
    '.',
  citation:
    'imp-124827 (k=5 rung, m_k - 1 decay fit); imp-124793 F3 (per-nine spacing ratio -> 10, +~1 ' +
    'mantissa term declared sub-leading, never isolated against the leading term); imp-97723 ' +
    '(diagnostic = 1 - 1/log(T0/2pi)); imp-97744 (0.999/0.9999 heights pinned).',
};

export const IMP124846_FARTAIL_MANTISSA_LEADING_RATIO_ISOLATION_ASSERTIONS = [
  {
    // (F1) The leading-term ratio m_k/g_k matches the closed-form values over k = 1..5.
    id: 'imp124846-leading-ratio-pinned',
    description: 'm_k/g_k = 2.664328e-2 .. 2.558438e-6 over k = 1..5',
    holds: () =>
      Math.abs(RATIO_TABLE[0].ratio_mk_over_gk - 2.664328e-2) < 1e-7 &&
      Math.abs(RATIO_TABLE[4].ratio_mk_over_gk - 2.558438e-6) < 1e-11,
  },
  {
    // (F1) The leading-term ratio decays ten-fold per rung, decay ratio -> 10 from above.
    id: 'imp124846-leading-ratio-decays-tenfold',
    description: 'm_k/g_k decay ratio climbs 10.3732 -> 10.0004, each > 10 and descending to 10',
    holds: () => {
      const d = RATIO_TABLE.map((r) => r.ratioDecayFromPrev).filter((x) => x !== null);
      return (
        d.length === 4 &&
        d.every((x) => x > 10 && x < 10.5) &&
        d[0] > d[1] &&
        d[1] > d[2] &&
        d[2] > d[3] &&
        Math.abs(d[3] - 10) < 1e-2
      );
    },
  },
  {
    // (F2) The mantissa share m_k/Delta_k decays ten-fold per rung.
    id: 'imp124846-share-decays-tenfold',
    description: 'm_k/Delta_k share decay ratio climbs 10.1299 -> 10.0001, each > 10 and -> 10',
    holds: () => {
      const d = RATIO_TABLE.map((r) => r.shareDecayFromPrev).filter((x) => x !== null);
      return (
        d.length === 4 &&
        d.every((x) => x > 10 && x < 10.2) &&
        d[0] > d[1] &&
        d[1] > d[2] &&
        d[2] > d[3] &&
        Math.abs(d[3] - 10) < 1e-2
      );
    },
  },
  {
    // (F3) The leading-rate model m_k/g_k ~ 0.255843*10^-k tracks the measured ratio from k = 3 on.
    id: 'imp124846-leading-rate-model-tracks',
    description: 'measured m_k/g_k matches 0.255843*10^-k to better than 5% for k >= 3',
    holds: () =>
      RATIO_TABLE.slice(2).every((r) => {
        const meas = r.ratio_mk_over_gk;
        const pred = r.predicted_ratio;
        return Math.abs(meas - pred) / meas < 0.05;
      }) && Math.abs(IMP124846_FARTAIL_MANTISSA_LEADING_RATIO_ISOLATION.leadingRateCoefficient - 0.255843) < 1e-6,
  },
  {
    // Cross-check: g_k + m_k reproduces the imp-124793/imp-124827 per-nine spacing Delta_k.
    id: 'imp124846-delta-cross-check',
    description: 'g_k + m_k reproduces the per-nine spacing 40.1279 / 391.8690 / 3909.6507',
    holds: () =>
      Math.abs(RATIO_TABLE[0].deltaLog10N - 40.1279) < 1e-3 &&
      Math.abs(RATIO_TABLE[1].deltaLog10N - 391.869) < 1e-3 &&
      Math.abs(RATIO_TABLE[2].deltaLog10N - 3909.6507) < 1e-2,
  },
  {
    // Honesty gate: closed-form derivation only, no QED, no refereed bound is changed.
    id: 'imp124846-honesty-gate-no-qed',
    description: 'Closed-form derivation/measurement only: not rigorous, no QED, no refereed bound is changed',
    holds: () =>
      IMP124846_FARTAIL_MANTISSA_LEADING_RATIO_ISOLATION.isRigorous === false &&
      IMP124846_FARTAIL_MANTISSA_LEADING_RATIO_ISOLATION.ratioDecayLimit === 10 &&
      /NO QED/.test(IMP124846_FARTAIL_MANTISSA_LEADING_RATIO_ISOLATION.verdict) &&
      /refereed bound is changed/i.test(IMP124846_FARTAIL_MANTISSA_LEADING_RATIO_ISOLATION.verdict),
  },
];

for (const a of IMP124846_FARTAIL_MANTISSA_LEADING_RATIO_ISOLATION_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-124846-fartail-mantissa-leading-ratio-isolation assertion failed: ${a.id}`
    );
  }
}
