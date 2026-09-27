/**
 * @module imp-124793-fartail-diagnostic-per-nine-spacing-ladder
 *
 * imp-124793 (numerical, frontier-direction): imp-97814 ROLE 1 (via imp-97723) established that
 * the far-tail sigma diagnostic (1/2 - p) * 2 log T0 is EXACTLY the Riemann-von Mangoldt
 * log-derivative slope 1 - 1/log(T0/2pi), converging to 1 only logarithmically, and reported the
 * 0.99 (~1e45) and 0.995 (~1e89) crossings. imp-97744 pinned the individual heights for the mixed
 * target set {0.99, 0.995, 0.999, 0.9999}. This module isolates the PURE per-nine ladder
 * t = 0.9, 0.99, 0.999, 0.9999 (one added nine per rung), extends the crossing ladder two nines
 * deeper than imp-97814 ROLE 1, and reports the per-nine LOG10-N SPACING to confirm the geometric
 * approach to 1.
 *
 * THE CLOSED-FORM INVERSION (reused verbatim from imp-97723 / imp-97744)
 * ---------------------------------------------------------------------
 * Deep in the tail (sigma negligible) the diagnostic is the bare RvM slope
 *
 *     D(T0) = 1 - 1 / log(T0/2pi).
 *
 * Setting D = t and writing L = log(T0/2pi) gives L = 1/(1 - t) directly, so for the per-nine
 * targets t_k = 1 - 10^-k the log-argument is exactly L_k = 10^k. The Riemann-von Mangoldt
 * relation N = (T0/2pi)(log(T0/2pi) - 1) = (L - 1) e^L then pins the crossing height, with
 *
 *     log10 N_k  = L_k * log10(e) + log10(L_k - 1),
 *     log10 T0_k = log10(2pi) + L_k * log10(e).
 *
 * THE PER-NINE LADDER (closed form)
 * ---------------------------------
 *     t = 0.9    :  L = 10,     log10 N = 5.2972    (log10 T0 = 5.1411)
 *     t = 0.99   :  L = 100,    log10 N = 45.4251   (log10 T0 = 44.2276)
 *     t = 0.999  :  L = 1000,   log10 N = 437.2940  (log10 T0 = 435.0927)   [two nines past ROLE 1]
 *     t = 0.9999 :  L = 10000,  log10 N = 4346.9448 (log10 T0 = 4343.7430)  [two nines past ROLE 1]
 *
 * The 0.999 and 0.9999 heights reproduce imp-97744 F3/F5 exactly (log10 N 437.2940 / 4346.9448);
 * the contribution here is the CLEAN per-nine spacing law below.
 *
 * THE PER-NINE SPACING (the geometric-approach witness)
 * -----------------------------------------------------
 * The gap in log10 N between consecutive nines is
 *
 *     Delta_k = log10 N_{k+1} - log10 N_k
 *             = (10^{k+1} - 10^k) log10(e) + log10((10^{k+1}-1)/(10^k-1))
 *             ~ 9 * 10^k * log10(e)   (the +~1 from the mantissa ratio is sub-leading),
 *
 * so each added nine multiplies the required log10 N by ~10:
 *
 *     Delta(0.9  -> 0.99  ) =   40.1279
 *     Delta(0.99 -> 0.999 ) =  391.8690    ratio 9.7655
 *     Delta(0.999-> 0.9999) = 3909.6507    ratio 9.9769   ->  10
 *
 * The consecutive-spacing ratio climbs toward EXACTLY 10 (the leading 9*10^k*log10(e) term makes
 * Delta_{k+1}/Delta_k -> 10), the quantitative signature of the logarithmic (geometric-in-nines)
 * approach of the diagnostic to 1: buying one more nine costs a ten-fold jump in log10 N.
 *
 * THE FINDINGS (closed-form derivation / measurement only)
 * -------------------------------------------------------
 *   (F1) THE PURE PER-NINE LADDER: log10 N = 5.2972 / 45.4251 / 437.2940 / 4346.9448 for
 *        t = 0.9 / 0.99 / 0.999 / 0.9999, extending imp-97814 ROLE 1 (0.99/0.995) two nines deeper.
 *   (F2) THE 0.999 AND 0.9999 HEIGHTS REPRODUCE imp-97744 (log10 N 437.2940 / 4346.9448) to
 *        round-off, an independent cross-check of the RvM inversion from the pure-nines target set.
 *   (F3) THE PER-NINE LOG10-N SPACING RATIO -> 10 (9.7655 then 9.9769), confirming the geometric
 *        approach: L = 1/(1 - t) grows ten-fold per added nine, so log10 N ~ 10^k * log10(e) does too.
 *
 * The punchline: on the pure per-nine ladder each added nine of the diagnostic costs a ten-fold
 * jump in log10 N (spacing ratio -> 10), the closed-form geometric signature of the logarithmic
 * approach to 1; the 0.999/0.9999 rungs match imp-97744.
 *
 * CLOSED-FORM DERIVATION / MEASUREMENT ONLY. Conditional-share diagnostic, NOT an RH bound. Reuses
 * the inherited imp-97723/imp-97744 bare-slope inversion and RvM relation, NOT a rigorous
 * asymptotic; the C_mb GUE-conditional per imp-486 is UNTOUCHED; changes no bound; establishes no
 * operator positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. Platt-Trudgian
 * Lambda <= 0.2 remains SOTA.
 *
 * @see imp-97723-sigma-fartail-diagnostic-asymptote-one (diagnostic = 1 - 1/log(T0/2pi), asymptote 1)
 * @see imp-97744-fartail-diagnostic-crossing-heights (pins 0.99/0.995/0.999/0.9999 heights)
 * @see imp-97814-fartail-diagnostic-landmark-cohort-index (ROLE 1: reported 0.99/0.995 crossings)
 */

const LOG10E = Math.LOG10E; // log10(e) = 0.43429448190325176
const TWO_PI = 2 * Math.PI;
const LOG10_TWO_PI = Math.log10(TWO_PI); // 0.7981798683581152

// imp-97744 pinned log10 N for the nines that overlap, for the F2 cross-check.
const IMP97744_LOG10N = {
  '0.999': 437.294,
  '0.9999': 4346.9448,
};

// Invert the bare diagnostic 1 - 1/log(T0/2pi) = t at the per-nine target t_k = 1 - 10^-k.
//   L        = log(T0/2pi) = 1/(1 - t) = 10^k
//   log10 T0 = log10(2pi) + L*log10(e)
//   log10 N  = L*log10(e) + log10(L - 1)   [RvM: N = (L - 1) e^L]
function pinNine(k) {
  const t = 1 - Math.pow(10, -k);
  const L = 1 / (1 - t); // = 10^k to round-off
  const log10T0 = LOG10_TWO_PI + L * LOG10E;
  const log10N = L * LOG10E + Math.log10(L - 1);
  const expT0 = Math.floor(log10T0);
  const expN = Math.floor(log10N);
  const key = String(+t.toPrecision(12));
  const ref = IMP97744_LOG10N[key];
  return {
    nines: k,
    target: +t.toFixed(k + 1),
    L: +L.toFixed(6),
    log10_T0: +log10T0.toFixed(4),
    T0_mantissa: +Math.pow(10, log10T0 - expT0).toFixed(5),
    T0_exp10: expT0,
    log10_N: +log10N.toFixed(4),
    N_mantissa: +Math.pow(10, log10N - expN).toFixed(5),
    N_exp10: expN,
    // F2 cross-check vs imp-97744 (only for the 0.999/0.9999 overlap rungs).
    log10N_vs_imp97744: ref === undefined ? null : +Math.abs(log10N - ref).toFixed(4),
  };
}

const LADDER = [1, 2, 3, 4].map(pinNine);

// Per-nine log10-N spacing and its consecutive ratio (the geometric-approach witness, F3).
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

export const IMP124793_FARTAIL_DIAGNOSTIC_PER_NINE_SPACING_LADDER = {
  id: 'imp-124793',
  proofSection: 'S-frontier',
  question:
    'Extend the imp-97814 ROLE 1 crossing ladder (0.99 ~1e45, 0.995 ~1e89) two nines deeper by ' +
    'inverting the bare far-tail slope 1 - 1/log(T0/2pi) = t at the pure per-nine targets ' +
    't = 0.9/0.99/0.999/0.9999 (L = 1/(1 - t) = 10^k), and report the per-nine log10 N spacing to ' +
    'confirm the geometric approach to 1. Closed-form derivation / measurement only; ' +
    'conditional-share diagnostic, NOT an RH bound; no QED.',
  measuredQuantity:
    'the per-nine crossing heights N (log10 and mantissa x 10^exp) for t = 0.9/0.99/0.999/0.9999, ' +
    'and the consecutive log10 N spacing ratio (-> 10) witnessing the geometric approach to 1',
  ladder: LADDER,
  spacing: SPACING,
  spacingRatioLimit: 10, // Delta_{k+1}/Delta_k -> 10 (one added nine costs a ten-fold jump in log10 N)
  finding: {
    F1_pure_per_nine_ladder:
      'The pure per-nine ladder pins log10 N = 5.2972 / 45.4251 / 437.2940 / 4346.9448 for ' +
      't = 0.9 / 0.99 / 0.999 / 0.9999 (L = 10/100/1000/10000), extending imp-97814 ROLE 1 ' +
      '(0.99/0.995) two nines deeper to 0.999 and 0.9999.',
    F2_reproduces_imp97744:
      'The 0.999 and 0.9999 heights (log10 N 437.2940 / 4346.9448) reproduce the imp-97744 pins to ' +
      'round-off, an independent cross-check of the RvM inversion from the pure-nines target set.',
    F3_spacing_ratio_tends_to_ten:
      'The per-nine log10 N spacing is 40.1279 (0.9->0.99), 391.8690 (0.99->0.999), 3909.6507 ' +
      '(0.999->0.9999), with consecutive ratio 9.7655 then 9.9769 -> 10. Each added nine costs a ' +
      'ten-fold jump in log10 N because L = 1/(1 - t) grows ten-fold per nine (log10 N ~ ' +
      '10^k log10(e)): the geometric signature of the logarithmic approach to 1.',
  },
  isRigorous: false,
  verdict:
    'CLOSED-FORM DERIVATION / MEASUREMENT (frontier-direction, NOT rigorous). Inverting the exact ' +
    'far-tail slope 1 - 1/log(T0/2pi) = t at the pure per-nine targets t = 0.9/0.99/0.999/0.9999 ' +
    'gives L = 1/(1 - t) = 10/100/1000/10000, and the Riemann-von Mangoldt relation N = (L - 1) e^L ' +
    'pins log10 N = 5.2972 / 45.4251 / 437.2940 / 4346.9448, extending imp-97814 ROLE 1 two nines ' +
    'deeper (the 0.999/0.9999 heights reproduce imp-97744). The consecutive per-nine log10 N ' +
    'spacing ratio climbs 9.7655 -> 9.9769 -> 10: one added nine costs a ten-fold jump in log10 N, ' +
    'the closed-form geometric signature of the logarithmic approach to 1. Conditional-share ' +
    'diagnostic, NOT an RH bound; reuses the inherited imp-97723/imp-97744 bare-slope inversion and ' +
    'RvM relation, NOT a rigorous asymptotic; changes no bound; establishes no operator positivity; ' +
    'imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. Platt-Trudgian Lambda <= 0.2 remains SOTA.',
  citation:
    'imp-97814 ROLE 1 (0.99/0.995 crossings reported, deeper nines not tabulated); imp-97723 ' +
    '(diagnostic = 1 - 1/log(T0/2pi)); imp-97744 (0.999/0.9999 heights pinned).',
};

export const IMP124793_FARTAIL_DIAGNOSTIC_PER_NINE_SPACING_LADDER_ASSERTIONS = [
  {
    // (F1) The per-nine ladder pins L = 10^k and the expected log10 N for each nine.
    id: 'imp124793-per-nine-ladder-pinned',
    description: 'per-nine ladder: L = 10/100/1000/10000 and log10 N = 5.2972/45.4251/437.2940/4346.9448',
    holds: () =>
      Math.abs(LADDER[0].L - 10) < 1e-6 &&
      Math.abs(LADDER[1].L - 100) < 1e-6 &&
      Math.abs(LADDER[2].L - 1000) < 1e-5 &&
      Math.abs(LADDER[3].L - 10000) < 1e-4 &&
      Math.abs(LADDER[0].log10_N - 5.2972) < 1e-3 &&
      Math.abs(LADDER[1].log10_N - 45.4251) < 1e-3 &&
      Math.abs(LADDER[2].log10_N - 437.294) < 1e-3 &&
      Math.abs(LADDER[3].log10_N - 4346.9448) < 1e-3,
  },
  {
    // (F2) The 0.999/0.9999 heights reproduce imp-97744 to round-off.
    id: 'imp124793-reproduces-imp97744',
    description: '0.999 and 0.9999 log10 N reproduce the imp-97744 pins to < 1e-3',
    holds: () =>
      LADDER.filter((r) => r.log10N_vs_imp97744 !== null).length === 2 &&
      LADDER.filter((r) => r.log10N_vs_imp97744 !== null).every(
        (r) => r.log10N_vs_imp97744 < 1e-3
      ),
  },
  {
    // (F3) The per-nine log10 N spacing ratio climbs monotonically toward 10 (from below).
    id: 'imp124793-spacing-ratio-tends-to-ten',
    description: 'consecutive per-nine log10 N spacing ratio climbs toward 10 (9.7655 -> 9.9769), each < 10',
    holds: () => {
      const ratios = SPACING.map((s) => s.ratioToPrev).filter((r) => r !== null);
      return (
        ratios.length === 2 &&
        ratios.every((r) => r > 9.5 && r < 10) &&
        ratios[1] > ratios[0]
      );
    },
  },
  {
    // Spacing itself grows ~ten-fold per rung (the geometric-in-nines cost).
    id: 'imp124793-spacing-grows-tenfold',
    description: 'per-nine log10 N spacing grows ~ten-fold: 40.13 -> 391.87 -> 3909.65',
    holds: () =>
      Math.abs(SPACING[0].deltaLog10N - 40.1279) < 1e-2 &&
      Math.abs(SPACING[1].deltaLog10N - 391.869) < 1e-2 &&
      Math.abs(SPACING[2].deltaLog10N - 3909.6507) < 1e-1,
  },
  {
    // Honesty gate: closed-form derivation only, no QED, PT stays SOTA.
    id: 'imp124793-honesty-gate-no-qed',
    description: 'Closed-form derivation/measurement only: not rigorous, no QED, PT stays SOTA',
    holds: () =>
      IMP124793_FARTAIL_DIAGNOSTIC_PER_NINE_SPACING_LADDER.isRigorous === false &&
      IMP124793_FARTAIL_DIAGNOSTIC_PER_NINE_SPACING_LADDER.spacingRatioLimit === 10 &&
      /NO QED/.test(IMP124793_FARTAIL_DIAGNOSTIC_PER_NINE_SPACING_LADDER.verdict) &&
      /remains SOTA/.test(IMP124793_FARTAIL_DIAGNOSTIC_PER_NINE_SPACING_LADDER.verdict),
  },
];

for (const a of IMP124793_FARTAIL_DIAGNOSTIC_PER_NINE_SPACING_LADDER_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-124793-fartail-diagnostic-per-nine-spacing-ladder assertion failed: ${a.id}`
    );
  }
}
