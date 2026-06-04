// @module imp-2422-bandwidth-restricted-esy-gap
// imp-2422: Quantify the achievable ESY bound at N = 1e6 and 1e7 under the
// Rudnick-Sarnak bandwidth-2/n restriction, and deliver the precise numerical
// gap to closure as a number. Wave-2 fan-out (follow-on to imp-2354).
//
// CONTEXT (one paragraph)
// -----------------------
// imp-1180 mapped the higher-order-correlation route (B) for ESY closure and
// named obstruction O-HOC-E: the only UNCONDITIONAL 3-point input for Riemann
// zeros is Rudnick-Sarnak 1996, valid only for test functions with Fourier
// support inside (-2/n, 2/n); for the 3-point regime that is the band |xi| < 2/3.
// imp-2354 then established the decisive structural fact: at the microscopic
// ESY scale the unfolded Poisson kernel sits at y_unfolded = 1 (mean-spacing
// units) INDEPENDENT of N, so truncating its Fourier transform to the RS96 band
// removes a FIXED fraction of the kernel that does NOT shrink as N grows.
// imp-2354 reported those fractions (L2 ~ 2.30e-4, variance ~ 2.16e-3) but
// framed them as a regularization penalty. THIS ticket converts that penalty
// into the deliverable the ticket asks for: the best ESY moment bound the
// bandwidth-restricted input can actually certify at N = 1e6 and 1e7, and the
// precise numerical GAP to the closure target -- i.e. exactly how much an
// unrestricted rho_3 would have to buy.
//
// HEADLINE VERDICT
// ----------------
// VERDICT: 'bandwidth-restricted-esy-gap-quantified-N-independent-residual'
//
// The bandwidth-restricted (RS96-unconditional) ESY moment input certifies a
// bound on the IN-BAND projection of the linear statistic L_N(phi^{(W)}),
// W = 2/3. Measured by the variance form factor that actually enters the ESY
// 2nd cumulant kappa_2, that in-band projection captures a certified fraction
// f_cert = 1 - p_var of the full Poisson-kernel observable, with
//   p_var = variance-form-factor residual in the high-pass band |xi| > 2/3
//         ~ 2.16e-3   (and the plain-L2 residual ~ 2.30e-4).
// Because y_unfolded = 1 for ALL N (imp-2354), p_var is N-INDEPENDENT: it is
// the SAME number at N = 1e6 and at N = 1e7. The GAP to ESY closure is exactly
// this uncontrolled high-pass residual. As a relative number the gap is fixed
// at ~0.216% of the variance form factor; as an absolute number it tracks the
// imp-407 baseline scale, ~6.2e-7 at N = 1e6 and ~8.4e-8 at N = 1e7. An
// unrestricted rho_3 (full Fourier support, equivalent to Bogomolny-Keating)
// is therefore required to BUY recovery of a fixed 2.16e-3 form-factor band --
// no growth of N can close it. This sharpens the named gap to a target number:
// GAP-2422-HIGHPASS-FORMFACTOR-RESIDUAL (= GAP-2354-SUPNORM-RESIDUAL-TRANSFER,
// now quantified as a fraction to recover).
//
// CONSEQUENCE FOR THE LAMBDA-ATTACK CHAIN
// ---------------------------------------
// No Lambda bound moves. The imp-407 unconditional baseline (3/2)(log gamma_N)^2
// / N remains operative. This ticket only SCOPES the bandwidth-restricted route:
// it tells a future closure attempt the exact size (2.16e-3, N-independent) of
// the deficit an unrestricted rho_3 must supply, so the higher-order route has a
// concrete numerical target rather than a vague "suboptimal".
//
// SYNTAX SAFETY
// -------------
// No "*/" inside JSDoc. Single quotes throughout; no apostrophes inside single-
// quoted strings. Derivative-in-comments written dg_W/dxi style.
//
// @see imp-2354-unrestricted-3point-esy-attempt: parent; established y_unfolded = 1
// @see imp-1180-higher-order-correlation-route: route map, O-HOC-A / O-HOC-E
// @see imp-407 / imp-508: ESY closure baseline this route would serve

// =========================================================================
// SECTION (a) -- THE RS96 BAND AND THE UNFOLDED SPECTRAL DENSITY.
// =========================================================================
//
// At the microscopic ESY scale the unfolded Poisson kernel has Fourier
// transform hat_phi(xi) = pi exp(-2 pi |xi|) (y_unfolded = 1, imp-2354). The
// 3-point Rudnick-Sarnak regime certifies test functions with Fourier support
// inside (-2/3, 2/3). The achievable bound lives on the IN-BAND projection
// phi^{(W)} with hat_phi^{(W)} = hat_phi * 1_{|xi| < W}, W = 2/3.

const RS96_BAND_W = 2 / 3; // Fourier-support half-width for the 3-point regime
const Y_UNFOLDED_MICRO = 1; // microscopic scale is N-independent (imp-2354)

function unfoldedPoissonFourierAbs2(xi) {
  // |hat_phi(xi)|^2 with y_unfolded = 1, up to the common pi^2 prefactor that
  // cancels in every RATIO computed below.
  return Math.exp(-4 * Math.PI * Math.abs(xi) * Y_UNFOLDED_MICRO);
}

// Simpson quadrature on [a, b].
function simpson(f, a, b, n) {
  const m = n % 2 === 0 ? n : n + 1;
  const h = (b - a) / m;
  let s = f(a) + f(b);
  for (let i = 1; i < m; i += 1) {
    s += (i % 2 === 0 ? 2 : 4) * f(a + i * h);
  }
  return (s * h) / 3;
}

// Exponential tails are negligible past xi = 6 (exp(-4 pi * 6) ~ 5e-33).
const XI_MAX = 6;

// =========================================================================
// SECTION (b) -- THE CERTIFIED FRACTION AND THE RESIDUAL (the gap).
// =========================================================================
//
// The ESY 2nd cumulant kappa_2 (the linear-statistic variance, which sets the
// rate per imp-1180 O-HOC-C) weights |hat_phi(xi)|^2 by the GUE form factor
// min(|xi|, 1). The bandwidth-restricted input certifies the part of that
// weighted integral INSIDE the band; the part OUTSIDE the band is the residual
// the input cannot reach -- this is the gap to closure.

function formFactor(xi) {
  const a = Math.abs(xi);
  return a < 1 ? a : 1;
}
function varIntegrand(xi) {
  return unfoldedPoissonFourierAbs2(xi) * formFactor(xi);
}

const VAR_TOTAL = simpson(varIntegrand, 0, XI_MAX, 8000);
const VAR_INBAND = simpson(varIntegrand, 0, RS96_BAND_W, 8000);
const VAR_TAIL = simpson(varIntegrand, RS96_BAND_W, XI_MAX, 8000);

// Certified fraction of the variance form factor and the residual (the gap).
const CERTIFIED_FRACTION = VAR_INBAND / VAR_TOTAL;
const GAP_FRACTION_VARIANCE = VAR_TAIL / VAR_TOTAL; // ~ 2.16e-3

// Plain-L2 residual (closed form exp(-4 pi W), validates the quadrature).
const GAP_FRACTION_L2_CLOSED = Math.exp(-4 * Math.PI * RS96_BAND_W); // ~ 2.30e-4
const L2_TOTAL = simpson(unfoldedPoissonFourierAbs2, 0, XI_MAX, 4000);
const L2_TAIL = simpson(unfoldedPoissonFourierAbs2, RS96_BAND_W, XI_MAX, 4000);
const GAP_FRACTION_L2_NUMERICAL = L2_TAIL / L2_TOTAL;

// =========================================================================
// SECTION (c) -- ABSOLUTE GAP AT N = 1e6 AND 1e7 (the ticket deliverable).
// =========================================================================
//
// The achievable in-band bound and the residual are expressed against the
// operative imp-407 unconditional baseline B(N) = (3/2)(log gamma_N)^2 / N.
// The bandwidth-restricted input certifies CERTIFIED_FRACTION * B(N); the gap
// to closing the full Poisson-kernel observable is the high-pass residual
// GAP_FRACTION_VARIANCE * B(N). The RELATIVE gap is N-independent (it is just
// GAP_FRACTION_VARIANCE); only the absolute number tracks the baseline scale.

const C_SELBERG = 3; // imp-341 convention (matches imp-1180 / imp-2354)
function logGammaN(N) {
  return Math.log(N);
}
function imp407Baseline(N) {
  const logG = logGammaN(N);
  return (C_SELBERG / 2) * logG * logG / N;
}

const TICKET_HEIGHTS = [1e6, 1e7];
const GAP_ROWS = TICKET_HEIGHTS.map((N) => {
  const baseline = imp407Baseline(N);
  return {
    N,
    imp407Baseline: baseline,
    certifiedBound: CERTIFIED_FRACTION * baseline,
    // absolute gap = uncontrolled high-pass residual against the baseline scale
    absoluteGap: GAP_FRACTION_VARIANCE * baseline,
    // relative gap = fraction of the bound that stays uncontrolled (N-independent)
    relativeGap: GAP_FRACTION_VARIANCE,
  };
});

// N-independence check: the relative gap is byte-identical across the two heights.
const GAP_IS_N_INDEPENDENT =
  GAP_ROWS.length === 2 && GAP_ROWS[0].relativeGap === GAP_ROWS[1].relativeGap;

// =========================================================================
// SECTION (d) -- EXPORTED FROZEN RECORD.
// =========================================================================

export const IMP_2422_BANDWIDTH_RESTRICTED_ESY_GAP = Object.freeze({
  id: 'imp-2422-bandwidth-restricted-esy-gap',
  ticket: 'imp-2422',
  builtAt: '2026-06-04T00:00:00Z',

  verdict: 'bandwidth-restricted-esy-gap-quantified-N-independent-residual',
  isRigorous: true, // the gap quantification is rigorous (exact form-factor integral)
  isNewClosureOfESY: false,
  isImprovementOver407Baseline: false,
  tightensBoundAt1e6Or1e7: false,

  rs96BandW: RS96_BAND_W,
  yUnfoldedMicro: Y_UNFOLDED_MICRO,

  // The headline numbers the ticket asks for.
  certifiedFraction: CERTIFIED_FRACTION,
  gapFractionVariance: GAP_FRACTION_VARIANCE, // ~ 2.16e-3, N-independent
  gapFractionL2ClosedForm: GAP_FRACTION_L2_CLOSED, // ~ 2.30e-4
  gapFractionL2Numerical: GAP_FRACTION_L2_NUMERICAL,
  gapIsNIndependent: GAP_IS_N_INDEPENDENT,

  gapTable: Object.freeze(GAP_ROWS),

  derivation:
    'At the microscopic ESY scale y_unfolded = 1 (imp-2354), so hat_phi(xi) = ' +
    'pi exp(-2 pi |xi|) is N-independent. The ESY variance kappa_2 weights ' +
    '|hat_phi|^2 by the GUE form factor min(|xi|, 1). The RS96 3-point regime ' +
    'certifies only the part of that weighted integral inside |xi| < 2/3. The ' +
    'GAP to closure is the high-pass tail: int_{|xi|>2/3} exp(-4 pi |xi|) ' +
    'min(|xi|, 1) dxi over the full integral = GAP_FRACTION_VARIANCE ~ 2.16e-3. ' +
    'Because the integrand has no N dependence, this fraction is identical at ' +
    'N = 1e6 and 1e7. Multiplying by the imp-407 baseline (3/2)(log N)^2 / N ' +
    'gives the absolute gap ~6.2e-7 (1e6) and ~8.4e-8 (1e7). The plain-L2 ' +
    'residual exp(-4 pi * 2/3) ~ 2.30e-4 is the same statement without the ' +
    'form-factor weight.',

  whatUnrestrictedRho3MustBuy:
    'An unrestricted-support rho_3 (full Fourier support, equivalent to the ' +
    'Bogomolny-Keating triple-correlation conjecture) must recover the high-pass ' +
    'band |xi| > 2/3, i.e. a FIXED 2.16e-3 fraction of the variance form factor ' +
    '(2.30e-4 in plain L2). This deficit does NOT shrink with N, so no amount of ' +
    'height growth substitutes for it -- the bandwidth-restricted route is ' +
    'asymptotically capped at certifying 1 - 2.16e-3 ~ 99.784% of the observable.',

  namedGap: Object.freeze({
    id: 'GAP-2422-HIGHPASS-FORMFACTOR-RESIDUAL',
    severity: 'critical',
    sameAs: 'GAP-2354-SUPNORM-RESIDUAL-TRANSFER',
    statement:
      'The bandwidth-restricted (RS96) 3-point input certifies a bound on the ' +
      'in-band projection L_N(phi^{(W)}), W = 2/3, capturing a certified fraction ' +
      '1 - 2.16e-3 of the variance form factor. Closing the full Poisson-kernel ' +
      'ESY observable requires recovering the N-independent high-pass residual ' +
      '(2.16e-3 of the form factor, 2.30e-4 in L2). This residual is exactly the ' +
      'target an unrestricted rho_3 must supply; RS96 gives no control of it.',
  }),

  references: Object.freeze({
    imp2354: 'src/data/imp-2354-unrestricted-3point-esy-attempt.js',
    imp1180: 'src/data/imp-1180-higher-order-correlation-route.js',
    imp407: 'src/data/esy-rigidity-port.js',
    rudnickSarnak1996: 'Duke Math. J. 81, 269-322, Thm 1.1',
    bogomolnyKeating: 'Bogomolny-Keating 1996 triple correlation conjecture',
  }),
});

// =========================================================================
// BUILD-TIME TRIPWIRES (6 required, 7 shipped)
// =========================================================================

export const IMP_2422_ASSERTIONS = [
  {
    id: 'imp2422-verdict-honest-no-esy-closure',
    why:
      'The verdict must stay an honest partial -- no ESY closure, no baseline ' +
      'improvement, no tightening at 1e6/1e7. The ticket only SCOPES the gap; ' +
      'flipping any of these would overclaim against the named residual.',
    holds: () => {
      const r = IMP_2422_BANDWIDTH_RESTRICTED_ESY_GAP;
      return r.verdict === 'bandwidth-restricted-esy-gap-quantified-N-independent-residual' &&
        r.isNewClosureOfESY === false &&
        r.isImprovementOver407Baseline === false &&
        r.tightensBoundAt1e6Or1e7 === false;
    },
  },
  {
    id: 'imp2422-l2-gap-matches-closed-form',
    why:
      'The numerical plain-L2 residual must match the closed form exp(-4 pi W) ~ ' +
      '2.30e-4. This validates the Simpson quadrature used for the form-factor ' +
      'gap, which has no closed form.',
    holds: () => {
      const r = IMP_2422_BANDWIDTH_RESTRICTED_ESY_GAP;
      return Math.abs(r.gapFractionL2Numerical - r.gapFractionL2ClosedForm) < 1e-6 &&
        Math.abs(r.gapFractionL2ClosedForm - Math.exp(-4 * Math.PI * (2 / 3))) < 1e-12;
    },
  },
  {
    id: 'imp2422-variance-gap-in-expected-band',
    why:
      'The headline deliverable -- the variance-form-factor gap -- must land in ' +
      'the (2.0e-3, 2.3e-3) window centered on the imp-2354 value 2.16e-3. A ' +
      'drift would mean the form-factor integral or the band edge was mis-set.',
    holds: () => {
      const g = IMP_2422_BANDWIDTH_RESTRICTED_ESY_GAP.gapFractionVariance;
      return g > 2.0e-3 && g < 2.3e-3;
    },
  },
  {
    id: 'imp2422-certified-plus-gap-is-one',
    why:
      'The certified fraction and the variance gap must partition the variance ' +
      'form factor exactly (they are the in-band and high-pass parts of the same ' +
      'integral). Their sum must be 1 to quadrature precision.',
    holds: () => {
      const r = IMP_2422_BANDWIDTH_RESTRICTED_ESY_GAP;
      return Math.abs(r.certifiedFraction + r.gapFractionVariance - 1) < 1e-6;
    },
  },
  {
    id: 'imp2422-gap-is-N-independent',
    why:
      'The central finding (inherited from imp-2354 y_unfolded = 1) is that the ' +
      'RELATIVE gap does not depend on N. The two ticket heights (1e6, 1e7) must ' +
      'carry byte-identical relative gaps; any difference contradicts the ' +
      'N-independence of the microscopic scale.',
    holds: () => {
      const r = IMP_2422_BANDWIDTH_RESTRICTED_ESY_GAP;
      return r.gapIsNIndependent === true &&
        r.gapTable.length === 2 &&
        r.gapTable[0].relativeGap === r.gapTable[1].relativeGap;
    },
  },
  {
    id: 'imp2422-absolute-gap-tracks-baseline-and-shrinks',
    why:
      'The absolute gap is the relative gap times the imp-407 baseline, so it ' +
      'must shrink from 1e6 to 1e7 (the baseline shrinks) while the relative gap ' +
      'stays fixed. A non-shrinking absolute gap would mean the baseline scale ' +
      'was dropped.',
    holds: () => {
      const rows = IMP_2422_BANDWIDTH_RESTRICTED_ESY_GAP.gapTable;
      const r6 = rows.find((x) => x.N === 1e6);
      const r7 = rows.find((x) => x.N === 1e7);
      return !!r6 && !!r7 &&
        r7.absoluteGap < r6.absoluteGap &&
        Math.abs(r6.absoluteGap - r6.relativeGap * r6.imp407Baseline) < 1e-18;
    },
  },
  {
    id: 'imp2422-named-gap-is-critical-and-links-2354',
    why:
      'The remaining gap must stay severity critical and be linked to ' +
      'GAP-2354-SUPNORM-RESIDUAL-TRANSFER, so the quantification is recorded as a ' +
      'sharpening of the same obstruction rather than a new closure.',
    holds: () => {
      const g = IMP_2422_BANDWIDTH_RESTRICTED_ESY_GAP.namedGap;
      return g.id === 'GAP-2422-HIGHPASS-FORMFACTOR-RESIDUAL' &&
        g.severity === 'critical' &&
        g.sameAs === 'GAP-2354-SUPNORM-RESIDUAL-TRANSFER';
    },
  },
];
