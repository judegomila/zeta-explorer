/**
 * @module imp-3332-onset-decay-second-order-certification
 * @fileoverview imp-3332 -- Independently CERTIFY the three now-load-bearing
 *   imp-3222 second-order onset/decay closed-form anchors
 *       A2 (onset) = -(2 sqrt2 - 1)/(6 G0) - 1/36            ~ -2.596664811178753,
 *       S1 (decay) = 8 K0 - 2/K0                             ~ +0.5092476676475832,
 *       S0 (decay) = 4 K0^2 - 3                              ~ -1.864326242660904,
 *   (G0 = 1 - arcsinh1, K0 = sqrt2 - arcsinh1) via an INDEPENDENT high-precision
 *   finite-difference / direct evaluation of phi(s) = G(s)/F(s), because imp-3222
 *   backed these three constants with only a SELF-cross-check: a finite-eps
 *   residual to ~1e-2 (onset) and a finite-s residual to ~1% (decay, at s=10).
 *   Since imp-3222 A2 and B(s) now BOUND the imp-3155 two-term accuracy radius,
 *   these anchors deserve a certification that does not reuse the imp-3222 hand
 *   telescope, mirroring the imp-3291 / imp-3422 constant-certification pattern.
 *
 *   The imp-3222 second-order data are the O(eps^2) onset coefficient A2 and the
 *   O(e^{-2s}) large-s prefactor B(s) = 4 s^2 + S1 s + S0 in the two asymptotic
 *   laws for the imp-3064 excess fraction phi(s) = G(s)/F(s):
 *       onset:   phi(s0+eps) = (C/eps^2)[1 + A1 eps + A2 eps^2 + O(eps^3)],
 *       large-s: phi(s)      = K e^{-s}[1 + (2 s + D0) e^{-s} + B(s) e^{-2s} + ...].
 *
 *   ONSET A2 -- TWO independent routes.
 *   ROUTE O1 (the ticket-requested finite-difference of phi): a CONVERGED Neville
 *   ladder to eps=0 of the residual r2(eps) = (S_true(eps) - 1 - A1 eps)/eps^2,
 *   built from the RAW phi = G/F (S_true = phi(s0+eps) eps^2/C), where the imp-3155
 *   leading term A1 eps is subtracted. The base-0.02 geometric ladder pins A2 to
 *   ~2.8e-9 (~8 agreed digits) directly from the fraction -- far tighter than the
 *   imp-3222 self-check ~1e-2.
 *   ROUTE O2 (independent series division): the onset G-block divided by the
 *   F-block by forward long division reproduces A2 = S[2] to the double-precision
 *   floor ~1e-15, independent of the imp-3222 g2 - f1 g1 + f1^2 - f2 telescope.
 *
 *   DECAY S1, S0 -- TWO independent routes.
 *   ROUTE D1 (independent series-division-in-u, solve the quadratic): factor
 *       F = (1/2) e^s [1 - a u + u^2],  a = 2(s + K0),  u = e^{-s},   G = K0[1 - u/K0],
 *   and extract the u^2 coefficient of N/D = (1 - u/K0)/(1 - a u + u^2) by forward
 *   long division IN u at three distinct numeric s. Solving the resulting quadratic
 *   recovers S2 = 4 (to ~9e-16, so the leading power is CONFIRMED quadratic not
 *   assumed), S1 (~1.3e-15) and S0 (~9e-16) at the double-precision floor, all
 *   independent of the imp-3222 hand N/D expansion.
 *   ROUTE D2 (the ticket-requested finite-difference of phi): the direct-phi
 *   residual B_direct(s) = ((phi e^s/K - 1) - (2 s + D0) e^{-s}) e^{2s} from the RAW
 *   phi = G/F is scanned over a moderate-s ladder. Its minimum relative error vs the
 *   closed B(s) is ~8e-7 (~6 agreed digits) near s ~ 15.75.
 *
 *   HONEST SUB-GAP -- decay finite-difference precision floor.
 *   The u^2 decay term is O(e^{-2s}) and sits on the double-precision cancellation
 *   floor: at s ~ 16 the O(1) part of phi e^s/K loses ~5 digits before the u^2
 *   residual is exposed, so the LITERAL finite-difference of phi (Route D2) certifies
 *   the decay coefficients to only ~6 significant figures (~8e-7). Full 16-digit
 *   certification of S1 and S0 rests on the independent series-division-in-u route
 *   (Route D1, ~1e-15), NOT on the direct finite-difference. The onset finite
 *   difference (Route O1) has no such floor and reaches ~3e-9. All three anchors
 *   reproduce their closed forms to a zero double-precision difference, so every
 *   recorded digit is verified; only the direct-phi PRECISION on the decay pair is
 *   the named residual.
 *
 *   VERDICT. A2 ~ -2.59666481, S1 ~ +0.50924767, S0 ~ -1.86432624 are CONFIRMED:
 *   onset finite-difference of phi ~2.8e-9 and series division ~1e-15; decay
 *   series-division-in-u ~1e-15 (leading power independently 4) and direct-phi
 *   finite-difference ~8e-7. The imp-3222 anchors stand; nothing about the
 *   onset/decay story changes.
 *
 *   HONEST CAVEAT (mandatory)
 *   -------------------------
 *   CERTIFICATION OF DEGREE-0 SCALAR DIAGNOSTICS, RH-EQUIVALENT, NOT THE OPERATOR
 *   STEP. This re-derives three scalar second-order coefficients from independent
 *   numerical routes; it neither proves nor weakens RH, adds no positivity, and
 *   touches neither imp-3066 (the off-diagonal endpoint-Hankel operator obstruction,
 *   the lone remaining gap) nor the bare pilot. Measurement/certification only, no
 *   QED. No refereed bound is changed.
 *
 *   @see imp-3222-onset-decay-second-order-coefficient.js (parent: closed-form A2, B(s))
 *   @see imp-3422-onset-coefficient-certification.js (sibling: A3, A4 certification)
 *   @see imp-3155-onset-decay-next-order-corrections.js (imp-3155: leading A1, D0)
 *
 *   Ticket: imp-3332 (accuracy, low).
 */

const PAPER_REF = 'research-inputs/twin_ladder_consolidated_v52.pdf';

const ASINH1 = Math.asinh(1);   // s0: sinh(s0) = 1, cosh(s0) = sqrt(2)
const SQRT2 = Math.SQRT2;
const S0 = ASINH1;

// imp-3064 reduced masses in s = a*U (overflow regime s > s0 = arcsinh(1)).
const F = (s) => Math.cosh(s) - SQRT2 - s + ASINH1;   // = a * D_raw
const G = (s) => SQRT2 - ASINH1 - Math.exp(-s);       // = a * E
const PHI = (s) => G(s) / F(s);                        // the imp-3064 excess fraction

const C = SQRT2 * (1 - ASINH1);                        // phi ~ C/(s-s0)^2
const G0 = 1 - ASINH1;                                 // G(s0)
const K0 = SQRT2 - ASINH1;                             // K = 2 K0
const K = 2 * K0;                                      // phi ~ K e^{-s}
const A1 = (SQRT2 - 1) / G0 - SQRT2 / 6;               // imp-3155 onset leading, ~3.25605 (>0)
const D0 = 2 * K0 - 1 / K0;                            // imp-3155 decay leading const, ~-0.81106

// imp-3222 closed forms under certification here.
const A2_CLOSED = -(2 * SQRT2 - 1) / (6 * G0) - 1 / 36;   // onset second-order, ~-2.59666
const S1_CLOSED = 8 * K0 - 2 / K0;                        // decay B(s) s^1 coefficient, ~0.50925
const S0_CLOSED = 4 * K0 * K0 - 3;                        // decay B(s) s^0 coefficient, ~-1.86433
const B_CLOSED = (s) => 4 * s * s + S1_CLOSED * s + S0_CLOSED;

// Published numeric anchors (frozen; certified by the routes below).
const A2_ANCHOR = -2.596664811178753;
const S1_ANCHOR = 0.5092476676475832;
const S0_ANCHOR = -1.864326242660904;

// Number of agreed significant digits between two values.
const agreedDigits = (x, y) => {
  let d = 0;
  while (d < 16 && Math.abs(x - y) < Math.abs(x) * Math.pow(10, -d)) d++;
  return d - 1;
};

// Forward long division of power series num/den (formal, in eps or in u).
const seriesDiv = (num, den, N) => {
  const c = new Array(N + 1).fill(0);
  for (let n = 0; n <= N; n++) {
    let acc = num[n] || 0;
    for (let k = 1; k <= n; k++) acc -= (den[k] || 0) * c[n - k];
    c[n] = acc / den[0];
  }
  return c;
};

// Neville extrapolation to eps=0 (treats the residual as a polynomial in eps).
const nevilleToZero = (xs, ys) => {
  const n = xs.length;
  const T = ys.slice();
  for (let m = 1; m < n; m++) {
    for (let i = n - 1; i >= m; i--) {
      T[i] = (T[i] * (0 - xs[i - m]) - T[i - 1] * (0 - xs[i])) / (xs[i] - xs[i - m]);
    }
  }
  return T[n - 1];
};

// -- ONSET ROUTE O1: converged Neville ladder of the DIRECT phi = G/F ----------
// r2(eps) = (S_true - 1 - A1 eps)/eps^2 -> A2 as eps -> 0+ (RAW phi, not blocks).
const S_TRUE = (eps) => PHI(S0 + eps) * eps * eps / C;
const r2 = (eps) => (S_TRUE(eps) - 1 - A1 * eps) / (eps * eps);
const ONSET_LADDER = [0.02, 0.04, 0.08, 0.16, 0.32];   // geometric, balance point ~0.02
const A2_NEVILLE = nevilleToZero(ONSET_LADDER, ONSET_LADDER.map(r2));
const A2_NEVILLE_ERR = Math.abs(A2_NEVILLE - A2_CLOSED);   // ~2.8e-9

// -- ONSET ROUTE O2: independent series division of the onset Taylor blocks ----
// F-block f_k = (sqrt2 or 1)/(k+2)!; G-block g_k = (-1)^{k+1}(sqrt2-1)/(G0 k!).
const F_BLOCK = [1, SQRT2 / 6, 1 / 12, SQRT2 / 120, 1 / 360, SQRT2 / 5040];
const G_BLOCK = [1, (SQRT2 - 1) / G0, -(SQRT2 - 1) / (2 * G0), (SQRT2 - 1) / (6 * G0),
                 -(SQRT2 - 1) / (24 * G0), (SQRT2 - 1) / (120 * G0)];
const A2_SERIES = seriesDiv(G_BLOCK, F_BLOCK, 5)[2];
const A2_SERIES_ERR = Math.abs(A2_SERIES - A2_CLOSED);     // ~1e-15

// -- DECAY ROUTE D1: series division IN u, solve the quadratic B(s) ------------
// F = (1/2) e^s [1 - a u + u^2], a = 2(s+K0); G = K0[1 - u/K0]; N/D u^2 coef = B(s).
const B_SERIES = (s) => {
  const a = 2 * (s + K0);
  return seriesDiv([1, -1 / K0], [1, -a, 1], 2)[2];
};
// Three distinct s, exact quadratic fit -> recovers (S2, S1, S0) independently.
const DECAY_S_NODES = [0.5, 1.5, 2.5];
const DECAY_B_NODES = DECAY_S_NODES.map(B_SERIES);
const [dx0, dx1, dx2] = DECAY_S_NODES;
const [dy0, dy1, dy2] = DECAY_B_NODES;
const dd01 = (dy1 - dy0) / (dx1 - dx0);
const dd12 = (dy2 - dy1) / (dx2 - dx1);
const S2_SERIES = (dd12 - dd01) / (dx2 - dx0);          // must recover 4 (leading power)
const S1_SERIES = dd01 - S2_SERIES * (dx0 + dx1);
const S0_SERIES = dy0 - S1_SERIES * dx0 - S2_SERIES * dx0 * dx0;
const S1_SERIES_ERR = Math.abs(S1_SERIES - S1_CLOSED);  // ~1.3e-15
const S0_SERIES_ERR = Math.abs(S0_SERIES - S0_CLOSED);  // ~9e-16
const S2_SERIES_ERR = Math.abs(S2_SERIES - 4);          // ~9e-16

// -- DECAY ROUTE D2: direct-phi finite-s (cancellation-limited, honest floor) --
// B_direct(s) = ((phi e^s/K - 1) - (2 s + D0) e^{-s}) e^{2s} -> B(s) as s -> inf.
const B_DIRECT = (s) => (PHI(s) * Math.exp(s) / K - 1 - (2 * s + D0) * Math.exp(-s)) * Math.exp(2 * s);
const DECAY_DIRECT_LADDER = [13, 14, 15, 15.75, 16, 17];
const DECAY_DIRECT_SCAN = DECAY_DIRECT_LADDER.map((s) => ({
  s,
  bDirect: B_DIRECT(s),
  bClosed: B_CLOSED(s),
  relErr: Math.abs(B_DIRECT(s) - B_CLOSED(s)) / Math.abs(B_CLOSED(s)),
}));
const DECAY_DIRECT_BEST = DECAY_DIRECT_SCAN.reduce((a, b) => (b.relErr < a.relErr ? b : a));
const DECAY_DIRECT_MIN_RELERR = DECAY_DIRECT_BEST.relErr;   // ~8e-7

// Max relative error of the ticket-requested FINITE-DIFFERENCE-of-phi certification
// (worst of onset Route O1 and decay Route D2; the decay floor dominates).
const FINITE_DIFF_MAX_RELERR =
  Math.max(A2_NEVILLE_ERR / Math.abs(A2_CLOSED), DECAY_DIRECT_MIN_RELERR);

export const IMP3332_ONSET_DECAY_SECOND_ORDER_CERTIFICATION = Object.freeze({
  id: 'imp-3332-onset-decay-second-order-certification',
  ticket: 'imp-3332',
  paperSourcePath: PAPER_REF,
  paperSections: ['§25', '§26', '§27'],
  parent: 'imp-3222-onset-decay-second-order-coefficient.js',

  summary:
    'Independently CERTIFIES the three load-bearing imp-3222 second-order anchors ' +
    'A2 (onset) ~ -2.596664811178753, S1 (decay B(s) s^1) ~ +0.5092476676475832 and ' +
    'S0 (decay B(s) s^0) ~ -1.864326242660904 via an independent evaluation of the raw ' +
    'phi = G/F, since imp-3222 backed them only with a self-check (onset ~1e-2, decay ~1%). ' +
    'Onset A2: a converged Neville ladder of the DIRECT phi=G/F residual pins A2 to ~2.8e-9 ' +
    '(finite-difference of phi, the ticket request), and an independent series division of the ' +
    'onset blocks to ~1e-15. Decay: series-division-in-u of the factored F=(1/2)e^s[1-a u+u^2], ' +
    'G=K0[1-u/K0] solved as a quadratic recovers S2=4 (leading power confirmed, ~9e-16), S1 ' +
    '(~1.3e-15) and S0 (~9e-16); a direct-phi finite-s scan confirms B(s) to ~8e-7 (~6 digits). ' +
    'HONEST SUB-GAP: the LITERAL finite-difference of phi certifies the decay pair to only ~6 ' +
    'sig figs (the O(e^{-2s}) u^2 term is cancellation-limited); the full 16-digit certification ' +
    'rests on the independent series-division-in-u route. All three anchors reproduce their ' +
    'closed forms to a zero double-precision difference. RH-EQUIVALENT; degree-0 scalar ' +
    'certification only; NOT the operator step.',

  onsetA2: Object.freeze({
    law: 'phi(s0+eps) = (C/eps^2) [1 + A1 eps + A2 eps^2 + O(eps^3)]',
    symbol: 'A2',
    closedForm: '-(2 sqrt2 - 1)/(6*(1-arcsinh1)) - 1/36',
    closedValue: A2_CLOSED,
    anchor: A2_ANCHOR,
    anchorVsClosed: Math.abs(A2_CLOSED - A2_ANCHOR),        // 0 (exact double)
    routeO1DirectPhiNeville: Object.freeze({
      note: 'Ticket-requested finite-difference of phi: Neville ladder to eps=0 of the RAW ' +
            'phi=G/F residual (S_true - 1 - A1 eps)/eps^2; NOT the imp-3222 telescope.',
      ladder: ONSET_LADDER,
      value: A2_NEVILLE,
      err: A2_NEVILLE_ERR,                                 // ~2.8e-9
      agreedDigits: agreedDigits(A2_CLOSED, A2_NEVILLE),
    }),
    routeO2SeriesDivision: Object.freeze({
      note: 'Independent forward long division of the onset G-block by the F-block; ' +
            'reproduces A2 = S[2] to the double-precision floor.',
      value: A2_SERIES,
      err: A2_SERIES_ERR,                                  // ~1e-15
    }),
  }),

  decayB: Object.freeze({
    law: 'phi(s) = K e^{-s} [1 + (2 s + D0) e^{-s} + B(s) e^{-2s} + O(s^3 e^{-3s})]',
    symbol: 'B(s) = 4 s^2 + S1 s + S0',
    S1ClosedForm: '8 K0 - 2/K0, K0 = sqrt2 - arcsinh1',
    S0ClosedForm: '4 K0^2 - 3',
    S1ClosedValue: S1_CLOSED,
    S0ClosedValue: S0_CLOSED,
    S1Anchor: S1_ANCHOR,
    S0Anchor: S0_ANCHOR,
    S1AnchorVsClosed: Math.abs(S1_CLOSED - S1_ANCHOR),     // 0 (exact double)
    S0AnchorVsClosed: Math.abs(S0_CLOSED - S0_ANCHOR),     // 0 (exact double)
    routeD1SeriesInU: Object.freeze({
      note: 'Independent series-division-in-u of the factored F=(1/2)e^s[1-a u+u^2], G=K0[1-u/K0]; ' +
            'the u^2 coefficient B(s) at three distinct s is fit as a quadratic, recovering all ' +
            'three coefficients (including the leading power) to the double-precision floor.',
      sNodes: DECAY_S_NODES,
      S2Recovered: S2_SERIES,
      S2Err: S2_SERIES_ERR,                                // ~9e-16 (leading power = 4 confirmed)
      S1Recovered: S1_SERIES,
      S1Err: S1_SERIES_ERR,                                // ~1.3e-15
      S0Recovered: S0_SERIES,
      S0Err: S0_SERIES_ERR,                                // ~9e-16
    }),
    routeD2DirectPhiFiniteS: Object.freeze({
      note: 'Ticket-requested finite-difference of phi: direct-phi residual B_direct(s) from the ' +
            'RAW phi=G/F over a moderate-s ladder; cancellation-limited (O(e^{-2s}) u^2 term).',
      ladder: DECAY_DIRECT_LADDER,
      scan: DECAY_DIRECT_SCAN.map((r) => Object.freeze(r)),
      bestS: DECAY_DIRECT_BEST.s,
      minRelErr: DECAY_DIRECT_MIN_RELERR,                  // ~8e-7
      agreedDigitsAtBest: agreedDigits(DECAY_DIRECT_BEST.bClosed, DECAY_DIRECT_BEST.bDirect),
    }),
  }),

  maxRelativeError: Object.freeze({
    note: 'Max relative error of the ticket-requested finite-difference of phi certification; ' +
          'the decay direct-phi cancellation floor dominates (onset finite difference ~3e-9).',
    finiteDifferenceOfPhi: FINITE_DIFF_MAX_RELERR,         // ~8e-7 (decay-limited)
    onsetFiniteDifference: A2_NEVILLE_ERR / Math.abs(A2_CLOSED),
    decayFiniteDifference: DECAY_DIRECT_MIN_RELERR,
    independentSeriesRoutes: Math.max(
      A2_SERIES_ERR / Math.abs(A2_CLOSED),
      S1_SERIES_ERR / Math.abs(S1_CLOSED),
      S0_SERIES_ERR / Math.abs(S0_CLOSED)),                // ~1e-15
  }),

  subGap: Object.freeze({
    name: 'decay-finite-difference-precision-floor',
    statement:
      'The LITERAL finite-difference of phi (Route D2) certifies the decay coefficients S1, S0 ' +
      'to only ~6 significant figures (~8e-7): the O(e^{-2s}) u^2 decay term sits on the ' +
      'double-precision cancellation floor. Full 16-digit certification of S1 and S0 rests on ' +
      'the independent series-division-in-u route (Route D1, ~1e-15), not the direct finite ' +
      'difference. The onset finite difference (Route O1) has no such floor and reaches ~3e-9.',
  }),

  verdict: Object.freeze({
    A2Certified: true,
    S1Certified: true,
    S0Certified: true,
    statement:
      'A2 ~ -2.59666481, S1 ~ +0.50924767, S0 ~ -1.86432624 CONFIRMED: onset finite-difference ' +
      'of phi ~2.8e-9 and series division ~1e-15; decay series-division-in-u ~1e-15 (leading ' +
      'power independently recovered as 4) and direct-phi finite-difference ~8e-7. All three ' +
      'anchors reproduce their closed forms exactly in double precision. The imp-3222 anchors ' +
      'stand; the onset/decay story is unchanged.',
  }),

  honestCaveat: Object.freeze({
    isProof: false,
    isReductionBelowRH: false,
    rhEquivalent: true,
    isCertificationOnly: true,
    operatorStepUntouched:
      'Re-derives three scalar second-order coefficients from independent numerical routes; adds ' +
      'no positivity and touches neither imp-3066 (the off-diagonal endpoint-Hankel operator ' +
      'obstruction, the lone remaining gap) nor the bare pilot.',
    sota: 'No refereed bound is changed',
    didNotRerunBarePilot: true,
  }),
});

// -- Tripwire assertions ------------------------------------------------------
export const IMP3332_ONSET_DECAY_SECOND_ORDER_CERTIFICATION_ASSERTIONS = [
  {
    id: 'imp3332-closed-forms-match-published-anchors',
    why: 'The imp-3222 closed forms must still evaluate to the published anchors A2 ~ -2.596665, ' +
         'S1 ~ 0.509248, S0 ~ -1.864326 to the double-precision floor; a drift would mean a ' +
         'constant was silently mis-edited.',
    holds: () =>
      Math.abs(A2_CLOSED - A2_ANCHOR) < 1e-15 &&
      Math.abs(S1_CLOSED - S1_ANCHOR) < 1e-15 &&
      Math.abs(S0_CLOSED - S0_ANCHOR) < 1e-15,
  },
  {
    id: 'imp3332-onset-direct-phi-neville-certifies-A2',
    why: 'A CONVERGED Neville ladder of the RAW phi=G/F residual (the ticket-requested finite ' +
         'difference of phi) must approach A2 far more tightly than the imp-3222 self-check ~1e-2: ' +
         'here to ~1e-8, confirming A2 from an independent direct evaluation of the fraction.',
    holds: () => A2_NEVILLE_ERR < 1e-8 && agreedDigits(A2_CLOSED, A2_NEVILLE) >= 8,
  },
  {
    id: 'imp3332-onset-series-division-certifies-A2',
    why: 'An independent forward long division of the onset G-block by the F-block must reproduce ' +
         'A2 = S[2] to the double-precision floor ~1e-13, certifying the closed form independent ' +
         'of the imp-3222 g2 - f1 g1 + f1^2 - f2 telescope.',
    holds: () => A2_SERIES_ERR < 1e-13,
  },
  {
    id: 'imp3332-decay-series-in-u-recovers-leading-power-and-coefs',
    why: 'The independent series-division-in-u quadratic fit must recover the LEADING power S2 = 4 ' +
         '(so the quadratic-in-s prefactor is confirmed, not assumed) and both S1, S0 to the ' +
         'double-precision floor ~1e-13, independent of the imp-3222 hand N/D expansion.',
    holds: () =>
      S2_SERIES_ERR < 1e-13 && S1_SERIES_ERR < 1e-13 && S0_SERIES_ERR < 1e-13,
  },
  {
    id: 'imp3332-decay-direct-phi-confirms-B-to-sub-gap-floor',
    why: 'The direct-phi finite-s residual (the ticket-requested finite difference of phi) must ' +
         'confirm B(s) far tighter than the imp-3222 self-check ~1% -- here to ~1e-5 at its best ' +
         's -- while remaining ABOVE ~1e-9 (the honest cancellation floor of the O(e^{-2s}) term).',
    holds: () =>
      DECAY_DIRECT_MIN_RELERR < 1e-5 && DECAY_DIRECT_MIN_RELERR > 1e-9,
  },
  {
    id: 'imp3332-signs-preserved-onset-negative-decay-quadratic-positive',
    why: 'The certified coefficients must keep their imp-3222 signs: A2 < 0 (opposite A1 > 0) and ' +
         'the decay leading S2 = 4 > 0 with B(10) > 0; a sign flip would flag a transcription error.',
    holds: () =>
      A2_CLOSED < 0 && A1 > 0 && Math.abs(S2_SERIES - 4) < 1e-12 && B_CLOSED(10) > 0,
  },
  {
    id: 'imp3332-honest-rh-equivalent-certification-only',
    why: 'Mandatory honesty: this is a coefficient CERTIFICATION, RH-EQUIVALENT, not a proof, not a ' +
         'reduction below RH, leaves the imp-3066 operator step untouched, does not rerun the bare ' +
         'pilot, and no refereed bound is changed. If any of these flip the module over-claims.',
    holds: () => {
      const c = IMP3332_ONSET_DECAY_SECOND_ORDER_CERTIFICATION.honestCaveat;
      return (
        c.isProof === false &&
        c.isReductionBelowRH === false &&
        c.rhEquivalent === true &&
        c.isCertificationOnly === true &&
        c.didNotRerunBarePilot === true &&
        /Platt-Trudgian|refereed bound is changed/.test(c.sota)
      );
    },
  },
];

for (const a of IMP3332_ONSET_DECAY_SECOND_ORDER_CERTIFICATION_ASSERTIONS) {
  if (!a.holds()) throw new Error(`imp-3332-onset-decay-second-order-certification assertion failed: ${a.id}`);
}

export default IMP3332_ONSET_DECAY_SECOND_ORDER_CERTIFICATION;
