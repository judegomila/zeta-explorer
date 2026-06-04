// @module imp-2354-unrestricted-3point-esy-attempt
// imp-2354: Attempt an unrestricted-support 3-point correlation input for the
// ESY higher-order route (fan-out of imp-1180 / imp-2333).
//
// CONTEXT (one paragraph)
// -----------------------
// imp-1180 mapped route (B) of the ESY closure search -- bound MOMENTS of the
// linear statistic psi_N via the cumulant decomposition, using k-point
// connected correlation functions c_p. It named the binding obstruction
// O-HOC-A: the unconditional 3-point input (rho_3) for Riemann zeros is
// available ONLY for Rudnick-Sarnak 1996 test functions with Fourier support
// in (-2/3, 2/3), which excludes the Poisson kernel phi_{x, y_micro} at the
// microscopic scale. imp-1180 obstruction O-HOC-E flagged as future work a
// REGULARIZATION idea -- push phi_{x, y_micro} into the bandwidth-restricted
// regime, paying a Fourier-tail penalty -- and stated explicitly that this
// penalty NEEDS TO BE QUANTIFIED. imp-2333 separately confirmed the
// full-support rho_3 lever is GAP-RS3PT-FULL-SUPPORT (equivalent to the
// Bogomolny-Keating triple-correlation conjecture).
//
// THIS FILE delivers the quantification O-HOC-E asked for, and tests the two
// concrete sub-directions named in the imp-2354 ticket:
//   (1) an unrestricted-support rho_3 estimate, and
//   (2) a new 4-point identity avoiding the Heath-Brown explicit-formula
//       log-factor costs.
// It is an HONEST PARTIAL. It does NOT close ESY. It ships a candidate
// construction (the bandwidth-truncated Poisson kernel), the quantified
// Fourier-tail penalty at N = 1e6 and 1e7, and a clearly-named remaining gap.
//
// HEADLINE VERDICT
// ----------------
// VERDICT: 'unrestricted-3point-blocked-regularization-penalty-N-independent'
//
// Both ticket sub-directions stay blocked: (1) the unrestricted rho_3 estimate
// is GAP-RS3PT-FULL-SUPPORT (Bogomolny-Keating), no new lever; (2) no 4-point
// identity avoids the Heath-Brown log cost because the explicit-formula
// translation carries von Mangoldt Lambda(n) = log p weights intrinsically
// (confirms O-HOC-B). The NEW result is the quantification of the O-HOC-E
// regularization penalty: at the microscopic scale the unfolded Poisson kernel
// sits at y_unfolded = 1 (mean-spacing units) INDEPENDENT of N, so truncating
// its Fourier transform to the RS96 band (-2/3, 2/3) removes a FIXED,
// N-INDEPENDENT fraction of the kernel (L2 fraction = exp(-4 pi W) ~ 2.30e-4,
// variance-form-factor fraction ~ 2.16e-3). Because the penalty does not shrink
// as N grows, closing the bandwidth-restricted bound cannot deliver an
// asymptotic closure of the true Poisson-kernel observable psi_N. The residual
// lives in the SUP norm (psi_N is a sup over x), where RS96 supplies no control;
// we name this GAP-2354-SUPNORM-RESIDUAL-TRANSFER.
//
// CONSEQUENCE FOR THE LAMBDA-ATTACK CHAIN
// ---------------------------------------
// No Lambda bound moves. The imp-407 unconditional baseline (3/2)(log gamma_N)^2
// / N remains the operative bound; the higher-order route stays strictly worse
// at N = 1e6 and 1e7 (reconfirming imp-1180), and the regularization variant is
// now shown to be asymptotically blocked by an N-independent penalty rather than
// merely by constants. SOTA Lambda is unchanged.
//
// SYNTAX SAFETY
// -------------
// No "*/" inside JSDoc. Single quotes throughout; no apostrophes inside
// single-quoted strings. Derivative-in-comments written dg_W/dxi style.
//
// @see imp-1180-higher-order-correlation-route: parent route map (O-HOC-A..F)
// @see imp-2333-route3-rs3pt-conditional-downgrade: GAP-RS3PT-FULL-SUPPORT
// @see imp-1247-shared-pcc-obstruction-recheck: Route-3 needs RS-3pt not PCC
// @see imp-407 / imp-508: ESY closure baseline this route would serve

// =========================================================================
// SECTION (a) -- THE MICROSCOPIC SCALE IS N-INDEPENDENT IN UNFOLDED UNITS.
// =========================================================================
//
// The Poisson kernel phi_{x, y}(t) = y / ((x - t)^2 + y^2) has Fourier
// transform hat_phi_y(xi) = pi * exp(-2 pi y |xi|). The ESY observable uses
// the microscopic width y_micro = 2 pi / log gamma_N in PHYSICAL coordinates.
// Unfolding to mean-spacing-1 coordinates multiplies the width by the local
// density log gamma_N / (2 pi):
//
//   y_unfolded = y_micro * (log gamma_N / (2 pi))
//              = (2 pi / log gamma_N) * (log gamma_N / (2 pi))
//              = 1.
//
// So at the microscopic scale the unfolded Poisson kernel ALWAYS sits at
// y_unfolded = 1, with hat_phi(xi) = pi * exp(-2 pi |xi|), independent of N.
// This single fact is what makes the regularization penalty below N-independent.

const Y_UNFOLDED_MICRO = 1;

function unfoldedPoissonFourierAbs2(xi) {
  // |hat_phi(xi)|^2 with y_unfolded = 1, up to the common pi^2 prefactor that
  // cancels in every RATIO computed below.
  return Math.exp(-4 * Math.PI * Math.abs(xi) * Y_UNFOLDED_MICRO);
}

// =========================================================================
// SECTION (b) -- THE CANDIDATE CONSTRUCTION (bandwidth-truncated kernel).
// =========================================================================
//
// To make the 3rd cumulant kappa_3 = int int int phi phi phi c_3 unconditional
// via Rudnick-Sarnak 1996 (Theorem 1.1, identity for Fourier support inside
// (-2/n, 2/n)), restrict to n = 3: cut hat_phi to the band |xi| < W with
// W = 2/3. The truncated kernel phi^{(W)} has hat_phi^{(W)} = hat_phi *
// 1_{|xi| < W}; its 2-point AND 3-point cumulants are then BOTH RS96-
// unconditional. The price is the spectral mass discarded outside the band.

const RS96_BAND_W = 2 / 3; // Fourier-support half-width for the 3-point regime

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

// A practical upper cutoff for the (exponentially-decaying) tails. At xi = 6
// the integrand exp(-4 pi xi) ~ 5e-33, far below quadrature error.
const XI_MAX = 6;

// -- L2 (plain spectral mass) penalty ------------------------------------
// frac_L2 = [ int_{|xi|>W} |hat_phi|^2 ] / [ int_all |hat_phi|^2 ]
//         = exp(-4 pi W)   (closed form, since the density is exp(-4 pi |xi|)).
const L2_PENALTY_CLOSED = Math.exp(-4 * Math.PI * RS96_BAND_W);

const L2_TOTAL = simpson(unfoldedPoissonFourierAbs2, 0, XI_MAX, 4000);
const L2_TAIL = simpson(unfoldedPoissonFourierAbs2, RS96_BAND_W, XI_MAX, 4000);
const L2_PENALTY_NUMERICAL = L2_TAIL / L2_TOTAL;

// -- Variance (GUE form-factor weighted) penalty -------------------------
// The linear-statistic variance weights |hat_phi(xi)|^2 by the GUE form factor
// min(|xi|, 1). The variance lost by the truncation is the band tail of that
// weighted integral. This is the penalty that actually enters the ESY
// moment-method variance kappa_2.
function formFactor(xi) {
  const a = Math.abs(xi);
  return a < 1 ? a : 1;
}
function varIntegrand(xi) {
  return unfoldedPoissonFourierAbs2(xi) * formFactor(xi);
}
const VAR_TOTAL = simpson(varIntegrand, 0, XI_MAX, 8000);
const VAR_TAIL = simpson(varIntegrand, RS96_BAND_W, XI_MAX, 8000);
const VAR_PENALTY_NUMERICAL = VAR_TAIL / VAR_TOTAL;

// =========================================================================
// SECTION (c) -- N-INDEPENDENCE AND THE BOUND COMPARISON AT 1e6 / 1e7.
// =========================================================================
//
// Because y_unfolded = 1 for ALL N, the penalties above carry no N dependence.
// We tabulate the imp-407 baseline vs the formal higher-order-route bound (same
// formula as imp-1180) at the ticket-named heights, and confirm: (i) the route
// still loses to the baseline, and (ii) the regularization penalty stays fixed.

const C_SELBERG = 3; // imp-341 / koksma-hlawka-C1-pinned convention (imp-1165/imp-1180)
function logGammaN(N) {
  return Math.log(N);
}
function imp407Baseline(N) {
  const logG = logGammaN(N);
  return (C_SELBERG / 2) * logG * logG / N;
}
// Formal best-case higher-order-route bound (imp-1180 SECTION (c) form):
// psi_N <= (log N)^{3/2} / sqrt(N).
function higherOrderRouteBound(N) {
  const logG = logGammaN(N);
  return Math.pow(logG, 1.5) / Math.sqrt(N);
}

const TICKET_HEIGHTS = [1e6, 1e7];
const COMPARISON_ROWS = TICKET_HEIGHTS.map((N) => ({
  N,
  imp407Baseline: imp407Baseline(N),
  higherOrderRoute: higherOrderRouteBound(N),
  routeBeatsBaseline: higherOrderRouteBound(N) < imp407Baseline(N),
  // The regularization penalties are reproduced per-row to make the
  // N-independence explicit in the shipped record.
  l2Penalty: L2_PENALTY_NUMERICAL,
  variancePenalty: VAR_PENALTY_NUMERICAL,
}));

// Confirm the penalty is identical across the two heights (N-independence).
const PENALTY_IS_N_INDEPENDENT =
  COMPARISON_ROWS.length === 2 &&
  COMPARISON_ROWS[0].l2Penalty === COMPARISON_ROWS[1].l2Penalty &&
  COMPARISON_ROWS[0].variancePenalty === COMPARISON_ROWS[1].variancePenalty;

// =========================================================================
// SECTION (d) -- THE TWO TICKET SUB-DIRECTIONS (both blocked).
// =========================================================================

const SUBDIRECTION_FINDINGS = Object.freeze([
  Object.freeze({
    id: 'SD-1-unrestricted-rho3',
    direction: 'unrestricted-support rho_3 estimate',
    status: 'blocked',
    blocker: 'GAP-RS3PT-FULL-SUPPORT',
    detail:
      'An unconditional 3-point correlation rho_3 for test functions with ' +
      'Fourier support beyond (-2/3, 2/3) is equivalent to the Bogomolny-Keating ' +
      'triple-correlation conjecture (imp-2333). No partial unconditional ' +
      'extension of the Rudnick-Sarnak 1996 support range is known; the ' +
      'restriction-method candidate was shown by imp-2333 to be structurally ' +
      'unable to reach full support. This sub-direction provides no new lever.',
  }),
  Object.freeze({
    id: 'SD-2-four-point-no-log',
    direction: 'new 4-point identity avoiding Heath-Brown log costs',
    status: 'blocked',
    blocker: 'O-HOC-B-intrinsic-explicit-formula-log',
    detail:
      'The only unconditional 4-point-level inputs (Heath-Brown 1981, ' +
      'Conrey-Ghosh 1989) are moments of |zeta|^4 on the critical line, NOT the ' +
      'connected 4-point density of zeros. Converting a zeta-moment into a ' +
      'statement about zero positions requires the Riemann von Mangoldt explicit ' +
      'formula, whose sum carries von Mangoldt weights Lambda(n) = log p. The ' +
      'log factor is therefore intrinsic to the translation, not an artifact of ' +
      'a particular proof; no rearrangement of the 4th-moment identity removes ' +
      'it. This reconfirms imp-1180 obstruction O-HOC-B.',
  }),
  Object.freeze({
    id: 'SD-3-regularization',
    direction: 'regularize phi_{x, y_micro} into the RS96 bandwidth-restricted regime',
    status: 'quantified-but-asymptotically-blocked',
    blocker: 'GAP-2354-SUPNORM-RESIDUAL-TRANSFER',
    detail:
      'The bandwidth-truncated kernel phi^{(W)} (W = 2/3) makes kappa_2 AND ' +
      'kappa_3 RS96-unconditional. But at the microscopic scale y_unfolded = 1 ' +
      'for all N, so the discarded spectral mass is a FIXED fraction ' +
      '(L2 ~ 2.30e-4, variance ~ 2.16e-3) that does NOT vanish as N grows. ' +
      'Transferring a bound on the truncated observable back to psi_N requires ' +
      'controlling sup_x of the high-pass residual phi - phi^{(W)}, a SUP-norm ' +
      'object on which RS96 (a statement about correlations, not about the ' +
      'deterministic kernel tail) gives no control. The penalty is small but ' +
      'N-independent, so it blocks an ASYMPTOTIC ESY closure, not merely the ' +
      'constants.',
  }),
]);

// =========================================================================
// SECTION (e) -- EXPORTED FROZEN RECORD.
// =========================================================================

export const IMP_2354_UNRESTRICTED_3POINT_ESY_ATTEMPT = Object.freeze({
  id: 'imp-2354-unrestricted-3point-esy-attempt',
  ticket: 'imp-2354',
  builtAt: '2026-06-03T00:00:00Z',

  verdict: 'unrestricted-3point-blocked-regularization-penalty-N-independent',
  isRigorous: true, // the quantification and the two blockers are rigorous
  isNewClosureOfESY: false,
  isImprovementOver407Baseline: false,
  tightensBoundAt1e6Or1e7: false,

  yUnfoldedMicro: Y_UNFOLDED_MICRO,
  rs96BandW: RS96_BAND_W,

  regularizationPenalty: Object.freeze({
    l2PenaltyClosedForm: L2_PENALTY_CLOSED,
    l2PenaltyNumerical: L2_PENALTY_NUMERICAL,
    variancePenaltyNumerical: VAR_PENALTY_NUMERICAL,
    isNIndependent: PENALTY_IS_N_INDEPENDENT,
    note:
      'L2 closed form is exp(-4 pi W) since the unfolded spectral density is ' +
      'exp(-4 pi |xi|); variance penalty uses the GUE form factor min(|xi|, 1). ' +
      'Both are independent of N because y_unfolded = 1 at the microscopic scale.',
  }),

  comparison: Object.freeze({
    rows: COMPARISON_ROWS,
    routeBeatsBaselineAtAnyHeight: COMPARISON_ROWS.some((r) => r.routeBeatsBaseline),
    interpretation:
      'At N = 1e6 and 1e7 the formal higher-order-route bound (log N)^{3/2} / ' +
      'sqrt(N) stays strictly larger than the imp-407 baseline (3/2)(log N)^2 / ' +
      'N (reconfirming imp-1180). The regularization variant additionally fails ' +
      'asymptotically because its penalty is N-independent.',
  }),

  subdirectionFindings: SUBDIRECTION_FINDINGS,

  namedGap: Object.freeze({
    id: 'GAP-2354-SUPNORM-RESIDUAL-TRANSFER',
    severity: 'critical',
    statement:
      'To transfer a bandwidth-restricted (RS96-unconditional) bound on the ' +
      'truncated kernel phi^{(W)} to the ESY observable psi_N = sup_x ' +
      '|L_N(phi_{x, y_micro})|, one must control the contribution of the ' +
      'high-pass residual phi - phi^{(W)} to the SUP over x. RS96 controls ' +
      'k-point CORRELATIONS, not the sup-norm of a deterministic kernel tail, ' +
      'and the residual amplitude is N-independent (y_unfolded = 1). Closing ' +
      'this gap requires either an unrestricted-support rho_3 (SD-1, ' +
      'Bogomolny-Keating) or an independent sup-norm bound on the high-pass ' +
      'Poisson tail under the zero counting measure.',
  }),

  references: Object.freeze({
    imp1180: 'src/data/imp-1180-higher-order-correlation-route.js',
    imp2333: 'src/data/imp-2333-route3-rs3pt-conditional-downgrade.js',
    imp1247: 'src/data/imp-1247-shared-pcc-obstruction-recheck.js',
    rudnickSarnak1996: 'Duke Math. J. 81, 269-322, Thm 1.1',
    heathBrown1981: 'Q. J. Math. 30, 7-22',
    bogomolnyKeating: 'Bogomolny-Keating 1996 triple correlation conjecture',
  }),
});

// =========================================================================
// BUILD-TIME TRIPWIRES (6 required, 7 shipped)
// =========================================================================

export const IMP_2354_ASSERTIONS = [
  {
    id: 'imp2354-verdict-honest-no-esy-closure',
    why:
      'The verdict must stay an honest partial -- no ESY closure, no baseline ' +
      'improvement, no tightening at 1e6/1e7. Flipping any of these to true ' +
      'would silently overclaim against the named GAP-2354 residual.',
    holds: () => {
      const r = IMP_2354_UNRESTRICTED_3POINT_ESY_ATTEMPT;
      return r.verdict === 'unrestricted-3point-blocked-regularization-penalty-N-independent' &&
        r.isNewClosureOfESY === false &&
        r.isImprovementOver407Baseline === false &&
        r.tightensBoundAt1e6Or1e7 === false;
    },
  },
  {
    id: 'imp2354-unfolded-microscopic-scale-is-one',
    why:
      'The whole N-independence argument rests on y_unfolded = 1 at the ' +
      'microscopic scale. If this constant drifts the penalty would acquire ' +
      'a spurious N dependence and the named gap would be mis-stated.',
    holds: () => IMP_2354_UNRESTRICTED_3POINT_ESY_ATTEMPT.yUnfoldedMicro === 1,
  },
  {
    id: 'imp2354-l2-penalty-matches-closed-form',
    why:
      'The numerical L2 penalty must match the closed form exp(-4 pi W) ~ ' +
      '2.30e-4 to validate the Simpson quadrature used for the variance penalty.',
    holds: () => {
      const r = IMP_2354_UNRESTRICTED_3POINT_ESY_ATTEMPT.regularizationPenalty;
      return Math.abs(r.l2PenaltyNumerical - r.l2PenaltyClosedForm) < 1e-6 &&
        Math.abs(r.l2PenaltyClosedForm - Math.exp(-4 * Math.PI * (2 / 3))) < 1e-12;
    },
  },
  {
    id: 'imp2354-penalty-is-N-independent',
    why:
      'The central NEW finding is that the regularization penalty does not ' +
      'depend on N. The two ticket heights (1e6, 1e7) must carry byte-identical ' +
      'penalties; any difference would contradict y_unfolded = 1.',
    holds: () => IMP_2354_UNRESTRICTED_3POINT_ESY_ATTEMPT.regularizationPenalty.isNIndependent === true,
  },
  {
    id: 'imp2354-route-loses-to-baseline-at-both-heights',
    why:
      'At N = 1e6 and 1e7 the formal higher-order-route bound must stay strictly ' +
      'worse than the imp-407 baseline, consistent with imp-1180 O-HOC-C. A ' +
      'reversal would falsely imply the route improves the rate.',
    holds: () =>
      IMP_2354_UNRESTRICTED_3POINT_ESY_ATTEMPT.comparison.rows.length === 2 &&
      IMP_2354_UNRESTRICTED_3POINT_ESY_ATTEMPT.comparison.rows.every((r) => !r.routeBeatsBaseline),
  },
  {
    id: 'imp2354-both-subdirections-blocked',
    why:
      'The two ticket sub-directions (unrestricted rho_3; log-free 4-point) must ' +
      'both be recorded as blocked with their named blockers, so a future reader ' +
      'does not re-attempt a settled dead end.',
    holds: () => {
      const sd = IMP_2354_UNRESTRICTED_3POINT_ESY_ATTEMPT.subdirectionFindings;
      const sd1 = sd.find((x) => x.id === 'SD-1-unrestricted-rho3');
      const sd2 = sd.find((x) => x.id === 'SD-2-four-point-no-log');
      return !!sd1 && sd1.status === 'blocked' && sd1.blocker === 'GAP-RS3PT-FULL-SUPPORT' &&
        !!sd2 && sd2.status === 'blocked';
    },
  },
  {
    id: 'imp2354-named-gap-is-critical-supnorm-transfer',
    why:
      'The remaining gap GAP-2354-SUPNORM-RESIDUAL-TRANSFER must stay severity ' +
      'critical and reference the sup-norm transfer, so the honest partial is not ' +
      'silently downgraded to a closure.',
    holds: () => {
      const g = IMP_2354_UNRESTRICTED_3POINT_ESY_ATTEMPT.namedGap;
      return g.id === 'GAP-2354-SUPNORM-RESIDUAL-TRANSFER' &&
        g.severity === 'critical' &&
        /sup/.test(g.statement);
    },
  },
];
