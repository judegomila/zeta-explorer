// @module imp-2460-esy-gap-bandwidth-fit-bk-distance
// imp-2460: Wider-band ESY variance gap -- fit the exp(-4 pi W) closure law and
// pin the Bogomolny-Keating-limit distance as a CONCRETE NUMBER. Wave-4
// follow-on to imp-2441.
//
// CONTEXT (one paragraph)
// -----------------------
// imp-2441 (built on imp-2422 / imp-2354) found the N-independent 2.153e-3 ESY
// variance-form-factor gap closes only as W -> infinity (residual ~ exp(-4 pi W);
// W = 1 cuts it 49x to 4.38e-5), that full Fourier support is exactly the
// Bogomolny-Keating triple-correlation conjecture, and that the high-pass band
// IS the RH-conditional Montgomery pair-correlation range. THIS ticket turns the
// soft phrase "closes as W -> infinity" into hard numbers: (1) tabulate the
// residual gap over the wide grid W in {1, 2, 4, 8, 16}; (2) fit the exp(-4 pi W)
// law by a log-linear least-squares regression and confirm the empirical decay
// rate equals 4 pi; (3) quantify EXACTLY how much unconditional support-widening
// of the RS96 (-2/3, 2/3) band would be needed, expressed as a support-widening
// FACTOR and an exchange rate, pinning the Bogomolny-Keating-limit distance as a
// concrete number rather than the bare "W -> infinity".
//
// METHOD NOTE (why closed forms, not the imp-2441 quadrature)
// ----------------------------------------------------------
// imp-2441 used Simpson quadrature truncated at XI_MAX = 6, which is fine for
// W <= 6 but goes NEGATIVE for W in {8, 16} (in-band integral exceeds the
// truncated total). At y_unfolded = 1 the variance integrand is exactly
// exp(-4 pi |xi|) min(|xi|, 1), so the tail integrals are elementary; we use the
// EXACT closed forms below, which agree with the imp-2441 Simpson values on the
// overlap (W = 2/3 -> 2.153e-3, W = 1 -> 4.38e-5) and stay valid at every W.
//
// HEADLINE VERDICT
// ----------------
// VERDICT: 'exp(-4 pi W) law confirmed; BK-limit distance is INFINITE support
//           (W -> infinity) but the exchange rate is 4351x residual-reduction per
//           RS96-band of extra unconditional 3-point support'
//
// (1) FIT. For W >= 1 the form factor min(|xi|, 1) = 1, so the relative variance
//     gap is EXACTLY g(W) = C * exp(-4 pi W) with C = (4 pi) / (1 - exp(-4 pi))
//     ~ 12.566. A log-linear least-squares fit of ln g over W in {1,2,4,8,16}
//     recovers the decay rate to machine precision: fittedRate / (4 pi) = 1.000.
//     The plain-L2 gap is the cleaner exp(-4 pi W) with no prefactor.
// (2) BK-LIMIT DISTANCE. Full closure means residual -> 0, i.e. W -> infinity:
//     the distance to the Bogomolny-Keating limit in band units is INFINITE --
//     no FINITE unconditional widening of RS96 closes it. This is the honest
//     restatement of imp-2441, now pinned: the support-widening FACTOR needed to
//     reach a residual epsilon grows only LOGARITHMICALLY,
//     W(epsilon) / W_RS96 = [ln C - ln epsilon] / (4 pi * W_RS96), so even
//     epsilon = 1e-6 needs only ~1.95x the RS96 support, but epsilon = 0 needs
//     infinite support.
// (3) EXCHANGE RATE. Each additional RS96-band of unconditional 3-point support
//     (delta W = 2/3) multiplies the variance gap by exp(-4 pi * 2/3) =
//     exp(-8 pi / 3) ~ 2.298e-4, i.e. a 4351x reduction per band. That is the
//     concrete price of progress along this route -- but since the target is
//     residual = 0, no finite number of bands suffices; the limit is the BK
//     conjecture.
//
// CONSEQUENCE FOR THE LAMBDA-ATTACK CHAIN
// ---------------------------------------
// No Lambda bound moves. The imp-407 unconditional baseline (3/2)(log gamma_N)^2
// / N remains operative. This ticket is a numerical SHARPENING of imp-2441: it
// confirms the exp(-4 pi W) law by regression and converts "W -> infinity" into
// two concrete numbers -- an infinite band-distance to the Bogomolny-Keating
// limit and a finite 4351x-per-band exchange rate -- making precise how far the
// bandwidth-restricted ESY variance route is from an unconditional closure.
//
// SYNTAX SAFETY
// -------------
// No JSDoc comment-close sequence inside comments. Single quotes throughout; no
// apostrophes inside single-quoted strings. Derivative-in-comments dg_W/dxi.
//
// @see imp-2441-minimal-input-to-close-esy-gap: parent; scored the closing inputs
// @see imp-2422-bandwidth-restricted-esy-gap: quantified the 2.153e-3 gap
// @see imp-2354-unrestricted-3point-esy-attempt: established y_unfolded = 1
// @see imp-407 / imp-508: ESY closure baseline this route would serve

// =========================================================================
// EXACT CLOSED-FORM VARIANCE FORM-FACTOR INTEGRALS (y_unfolded = 1).
// =========================================================================
//
// Integrand: exp(-a |xi|) min(|xi|, 1), a = 4 pi. Total mass on [0, infinity):
//   VAR_TOTAL = int_0^1 xi e^{-a xi} dxi + int_1^infinity e^{-a xi} dxi
//             = (1 - e^{-a}) / a^2.
// Tail mass on [W, infinity):
//   W >= 1 : int_W^infinity e^{-a xi} dxi = e^{-aW} / a.
//   W <  1 : (W/a + 1/a^2) e^{-aW} - (1/a^2) e^{-a}.
// Relative gap g(W) = tail(W) / VAR_TOTAL. The dg_W/dW slope is strictly
// negative, so g is monotone decreasing.

const A_RATE = 4 * Math.PI; // exponent rate of |hat_phi|^2 at y_unfolded = 1
const W_RS96 = 2 / 3; // unconditional 3-point Fourier band edge (imp-2422)
const EXP_NEG_A = Math.exp(-A_RATE);
const VAR_TOTAL = (1 - EXP_NEG_A) / (A_RATE * A_RATE);

// Closed-form prefactor C with g(W) = C exp(-a W) EXACTLY for W >= 1.
const GAP_PREFACTOR = A_RATE / (1 - EXP_NEG_A); // ~ 12.566

function tailMass(W) {
  if (W >= 1) {
    return EXP_NEG_A === 0 ? 0 : Math.exp(-A_RATE * W) / A_RATE;
  }
  const eW = Math.exp(-A_RATE * W);
  return (W / A_RATE + 1 / (A_RATE * A_RATE)) * eW - EXP_NEG_A / (A_RATE * A_RATE);
}
function varianceGapAtBand(W) {
  return tailMass(W) / VAR_TOTAL;
}
// Plain-L2 residual: exactly exp(-a W), the cleaner law (no form-factor weight).
function l2GapAtBand(W) {
  return Math.exp(-A_RATE * W);
}

// =========================================================================
// (1) WIDE-GRID GAP TABLE over W in {1, 2, 4, 8, 16}.
// =========================================================================

const WIDE_GRID = [1, 2, 4, 8, 16];
const GAP_TABLE = WIDE_GRID.map((W) => ({
  W,
  varianceGap: varianceGapAtBand(W),
  l2Gap: l2GapAtBand(W),
  closedFormCheck: GAP_PREFACTOR * Math.exp(-A_RATE * W), // == varianceGap for W>=1
}));

const BASELINE_GAP_RS96 = varianceGapAtBand(W_RS96); // ~ 2.153e-3 (imp-2422 value)
const GAP_AT_W1 = varianceGapAtBand(1); // ~ 4.38e-5 (imp-2441 value)

// =========================================================================
// (2) FIT the exp(-a W) law: log-linear least squares ln g(W) = b0 + b1 W.
// =========================================================================
//
// For W >= 1, ln g(W) = ln C - a W exactly, so b1 = -a = -4 pi and b0 = ln C.
// We regress over the wide grid and report the recovered rate -b1 against 4 pi.

function logLinearFit(points) {
  const n = points.length;
  let sx = 0;
  let sy = 0;
  let sxx = 0;
  let sxy = 0;
  for (let i = 0; i < n; i += 1) {
    const x = points[i].W;
    const y = Math.log(points[i].varianceGap);
    sx += x;
    sy += y;
    sxx += x * x;
    sxy += x * y;
  }
  const slope = (n * sxy - sx * sy) / (n * sxx - sx * sx);
  const intercept = (sy - slope * sx) / n;
  return { slope, intercept };
}

const FIT = logLinearFit(GAP_TABLE);
const FITTED_RATE = -FIT.slope; // should equal A_RATE = 4 pi
const FITTED_PREFACTOR = Math.exp(FIT.intercept); // should equal GAP_PREFACTOR
const FITTED_RATE_OVER_4PI = FITTED_RATE / A_RATE; // should equal 1
// Per-unit-W decay factor: g(W) / g(W + 1) = exp(a) = exp(4 pi) ~ 2.86e5.
const DECAY_FACTOR_PER_UNIT_W = Math.exp(A_RATE);

// =========================================================================
// (3) BOGOMOLNY-KEATING-LIMIT DISTANCE as a concrete number.
// =========================================================================
//
// Full closure is residual = 0, i.e. W -> infinity: the band-distance to the BK
// limit is INFINITE. We pin the cost two finite ways. (i) Support-widening
// FACTOR to reach a residual target epsilon: W(epsilon) = (1/a)(ln C - ln eps),
// factor = W(epsilon) / W_RS96. (ii) Exchange rate: each extra RS96-band
// (delta W = W_RS96) multiplies the gap by exp(-a W_RS96) = exp(-8 pi / 3).

function bandForGapTarget(eps) {
  // Inverse of g(W) = C exp(-a W) on the W >= 1 branch.
  return (Math.log(GAP_PREFACTOR) - Math.log(eps)) / A_RATE;
}
function supportFactorForTarget(eps) {
  return bandForGapTarget(eps) / W_RS96;
}

const TARGET_1e6 = 1e-6;
const W_FOR_1e6 = bandForGapTarget(TARGET_1e6); // ~ 1.30 (matches imp-2441)
const SUPPORT_FACTOR_1e6 = supportFactorForTarget(TARGET_1e6); // ~ 1.95
const TARGET_1e30 = 1e-30; // an astronomically small residual
const SUPPORT_FACTOR_1e30 = supportFactorForTarget(TARGET_1e30); // grows only log

// Exchange rate: gap reduction bought by one extra RS96-band of unconditional
// 3-point support. exp(-8 pi / 3) ~ 2.298e-4, i.e. ~ 4351x per band.
const REDUCTION_PER_RS96_BAND = Math.exp(-A_RATE * W_RS96);
const FACTOR_PER_RS96_BAND = 1 / REDUCTION_PER_RS96_BAND; // ~ 4351x

// =========================================================================
// EXPORTED FROZEN RECORD.
// =========================================================================

export const IMP_2460_ESY_GAP_BANDWIDTH_FIT_BK_DISTANCE = Object.freeze({
  id: 'imp-2460-esy-gap-bandwidth-fit-bk-distance',
  ticket: 'imp-2460',
  builtAt: '2026-06-04T21:45:00Z',

  verdict:
    'exp(-4 pi W) law confirmed by log-linear fit; Bogomolny-Keating-limit ' +
    'distance is INFINITE band-widening (W -> infinity) but the finite exchange ' +
    'rate is 4351x residual-reduction per RS96-band of extra unconditional ' +
    '3-point support',
  isRigorous: true, // exact closed-form integrals; the fit is a least squares
  isNewClosureOfESY: false,
  isImprovementOver407Baseline: false,
  tightensBoundAt1e6Or1e7: false,

  // Anchors back to the parent tickets (overlap check).
  baselineGapAtRS96: BASELINE_GAP_RS96, // ~ 2.153e-3 (imp-2422)
  gapAtW1: GAP_AT_W1, // ~ 4.38e-5 (imp-2441)

  // (1) Wide-grid table.
  wideGrid: Object.freeze(WIDE_GRID),
  gapTable: Object.freeze(GAP_TABLE),

  // (2) Fit of the exp(-4 pi W) law.
  exactRate4Pi: A_RATE,
  fittedRate: FITTED_RATE,
  fittedRateOver4Pi: FITTED_RATE_OVER_4PI, // ~ 1.000
  fittedPrefactor: FITTED_PREFACTOR, // ~ 12.566
  closedFormPrefactor: GAP_PREFACTOR,
  decayFactorPerUnitW: DECAY_FACTOR_PER_UNIT_W, // exp(4 pi) ~ 2.86e5
  lawConfirmed: true,

  // (3) Bogomolny-Keating-limit distance, pinned.
  bkLimitBandDistanceIsInfinite: true, // full closure needs W -> infinity
  widerBandClosesUnconditionally: false, // no finite unconditional widening closes
  supportWideningFactorFor1e6: SUPPORT_FACTOR_1e6, // ~ 1.95 x RS96 support
  bandFor1e6Target: W_FOR_1e6, // ~ 1.30 (matches imp-2441 W*)
  supportWideningFactorFor1e30: SUPPORT_FACTOR_1e30, // grows only logarithmically
  reductionPerRS96Band: REDUCTION_PER_RS96_BAND, // exp(-8 pi / 3) ~ 2.298e-4
  factorPerRS96Band: FACTOR_PER_RS96_BAND, // ~ 4351x per band

  headlineNumber:
    'The Bogomolny-Keating-limit distance is INFINITE in band units (residual = ' +
    '0 needs W -> infinity), but each RS96-band (delta W = 2/3) of extra ' +
    'UNCONDITIONAL 3-point support multiplies the variance gap by exp(-8 pi / 3) ' +
    '~ 2.298e-4 (a 4351x cut). To reach a residual of 1e-6 takes ~1.95x the RS96 ' +
    'support; the required factor grows only as (1 / (4 pi W_RS96)) ln(1 / ' +
    'epsilon), i.e. logarithmically, so the practical distance is small but the ' +
    'asymptotic (epsilon -> 0) distance is unbounded -- which is exactly the ' +
    'unproven full-support extension of RS96 (the Bogomolny-Keating conjecture).',

  derivation:
    'At y_unfolded = 1 the variance integrand is exp(-4 pi |xi|) min(|xi|, 1), ' +
    'with total mass (1 - e^{-4 pi}) / (4 pi)^2 and tail e^{-4 pi W} / (4 pi) for ' +
    'W >= 1, so the relative gap is exactly g(W) = C e^{-4 pi W}, C = (4 pi) / ' +
    '(1 - e^{-4 pi}) ~ 12.566. Tabulating W in {1, 2, 4, 8, 16} and regressing ' +
    'ln g linearly in W recovers slope -4 pi to machine precision (fittedRate / ' +
    '4 pi = 1.000) and intercept ln C. Full closure (residual 0) is W -> ' +
    'infinity, so the band-distance to the Bogomolny-Keating full-support limit ' +
    'is infinite; the finite content is the exchange rate exp(-8 pi / 3) ~ ' +
    '2.298e-4 per RS96-band and the logarithmic support-widening factor ' +
    '(ln C - ln epsilon) / (4 pi W_RS96), which is ~1.95 at epsilon = 1e-6.',

  namedGap: Object.freeze({
    id: 'GAP-2460-BK-LIMIT-IS-INFINITE-SUPPORT-WIDENING',
    severity: 'critical',
    sameAs: 'GAP-2441-ESY-VARIANCE-RESIDUAL-IS-PCC',
    statement:
      'The ESY variance-form-factor residual obeys g(W) = C exp(-4 pi W) ' +
      'exactly for W >= 1 (C ~ 12.566), confirmed by a log-linear fit over W in ' +
      '{1, 2, 4, 8, 16} that recovers the rate 4 pi to machine precision. Closure ' +
      'requires residual 0, i.e. W -> infinity: the distance to the Bogomolny- ' +
      'Keating full-support limit is INFINITE band-widening, so no finite ' +
      'unconditional extension of the RS96 (-2/3, 2/3) support closes it. The ' +
      'finite cost is an exchange rate of exp(-8 pi / 3) ~ 2.298e-4 (~4351x) gap ' +
      'reduction per additional RS96-band; reaching epsilon takes a support- ' +
      'widening factor (ln C - ln epsilon) / (4 pi W_RS96) that grows only ' +
      'logarithmically (~1.95 at 1e-6). Same obstruction as GAP-2441, now pinned.',
  }),

  references: Object.freeze({
    imp2441: 'src/data/imp-2441-minimal-input-to-close-esy-gap.js',
    imp2422: 'src/data/imp-2422-bandwidth-restricted-esy-gap.js',
    imp2354: 'src/data/imp-2354-unrestricted-3point-esy-attempt.js',
    imp407: 'src/data/esy-rigidity-port.js',
    montgomery1973: 'Montgomery, Pair correlation of zeros of the zeta function, 1973',
    rudnickSarnak1996: 'Duke Math. J. 81, 269-322, Thm 1.1',
    bogomolnyKeating: 'Bogomolny-Keating 1996 triple correlation conjecture',
  }),
});

// =========================================================================
// BUILD-TIME TRIPWIRES (6 required, 7 shipped)
// =========================================================================

export const IMP_2460_ASSERTIONS = [
  {
    id: 'imp2460-verdict-honest-no-esy-closure',
    why:
      'The verdict must stay an honest partial -- a numerical fit and a distance ' +
      'pinning, NOT an ESY closure, a baseline improvement, or a tightening at ' +
      '1e6/1e7. Flipping any of these would overclaim against the BK obstruction.',
    holds: () => {
      const r = IMP_2460_ESY_GAP_BANDWIDTH_FIT_BK_DISTANCE;
      return r.isNewClosureOfESY === false &&
        r.isImprovementOver407Baseline === false &&
        r.tightensBoundAt1e6Or1e7 === false &&
        r.bkLimitBandDistanceIsInfinite === true &&
        r.widerBandClosesUnconditionally === false;
    },
  },
  {
    id: 'imp2460-overlap-matches-parents',
    why:
      'The closed-form gap must reproduce the parent values on the overlap: ' +
      '2.153e-3 at the RS96 band W = 2/3 (imp-2422) and 4.38e-5 at W = 1 ' +
      '(imp-2441). A drift means the kernel or the integral diverged.',
    holds: () => {
      const r = IMP_2460_ESY_GAP_BANDWIDTH_FIT_BK_DISTANCE;
      return r.baselineGapAtRS96 > 2.0e-3 && r.baselineGapAtRS96 < 2.3e-3 &&
        r.gapAtW1 > 4.0e-5 && r.gapAtW1 < 4.8e-5;
    },
  },
  {
    id: 'imp2460-wide-grid-monotone-and-closed-form',
    why:
      'The wide-grid table must be strictly decreasing in W and each varianceGap ' +
      'must match the closed form C exp(-4 pi W) for W >= 1 (relative error ' +
      'below 1e-9). This certifies the table is the exact law, not a quadrature ' +
      'that would go negative at W = 8, 16.',
    holds: () => {
      const t = IMP_2460_ESY_GAP_BANDWIDTH_FIT_BK_DISTANCE.gapTable;
      for (let i = 0; i < t.length; i += 1) {
        if (!(t[i].varianceGap > 0)) return false;
        const rel = Math.abs(t[i].varianceGap - t[i].closedFormCheck) /
          t[i].closedFormCheck;
        if (!(rel < 1e-9)) return false;
        if (i > 0 && !(t[i].varianceGap < t[i - 1].varianceGap)) return false;
      }
      return true;
    },
  },
  {
    id: 'imp2460-fit-recovers-4pi-rate',
    why:
      'The central claim: the log-linear fit of ln g over {1,2,4,8,16} must ' +
      'recover the decay rate 4 pi to machine precision (since ln g is exactly ' +
      'affine in W for W >= 1). fittedRate / (4 pi) must be 1 to within 1e-9.',
    holds: () => {
      const r = IMP_2460_ESY_GAP_BANDWIDTH_FIT_BK_DISTANCE;
      return Math.abs(r.fittedRateOver4Pi - 1) < 1e-9 &&
        Math.abs(r.fittedRate - r.exactRate4Pi) < 1e-7 &&
        Math.abs(r.fittedPrefactor - r.closedFormPrefactor) /
          r.closedFormPrefactor < 1e-9;
    },
  },
  {
    id: 'imp2460-exchange-rate-per-rs96-band',
    why:
      'The concrete BK-distance content: one extra RS96-band (delta W = 2/3) of ' +
      'unconditional 3-point support cuts the gap by exp(-8 pi / 3) ~ 2.298e-4 ' +
      '(~4351x). Pins the price of progress along the route.',
    holds: () => {
      const r = IMP_2460_ESY_GAP_BANDWIDTH_FIT_BK_DISTANCE;
      return r.reductionPerRS96Band > 2.2e-4 && r.reductionPerRS96Band < 2.4e-4 &&
        r.factorPerRS96Band > 4000 && r.factorPerRS96Band < 4700;
    },
  },
  {
    id: 'imp2460-support-factor-logarithmic',
    why:
      'The support-widening factor must be finite-but-growing: ~1.95x RS96 ' +
      'support for a 1e-6 residual, and the 1e30-target factor must be larger ' +
      'yet still modest (logarithmic growth, not a blow-up), confirming the ' +
      'distance to residual 0 is reached only as W -> infinity.',
    holds: () => {
      const r = IMP_2460_ESY_GAP_BANDWIDTH_FIT_BK_DISTANCE;
      return r.supportWideningFactorFor1e6 > 1.9 &&
        r.supportWideningFactorFor1e6 < 2.0 &&
        r.supportWideningFactorFor1e30 > r.supportWideningFactorFor1e6 &&
        r.supportWideningFactorFor1e30 < 9;
    },
  },
  {
    id: 'imp2460-named-gap-links-2441',
    why:
      'The result must be recorded as a SHARPENING of the same obstruction at ' +
      'severity critical and linked to GAP-2441-ESY-VARIANCE-RESIDUAL-IS-PCC, ' +
      'not advertised as a new closure.',
    holds: () => {
      const g = IMP_2460_ESY_GAP_BANDWIDTH_FIT_BK_DISTANCE.namedGap;
      return g.id === 'GAP-2460-BK-LIMIT-IS-INFINITE-SUPPORT-WIDENING' &&
        g.severity === 'critical' &&
        g.sameAs === 'GAP-2441-ESY-VARIANCE-RESIDUAL-IS-PCC';
    },
  },
];
