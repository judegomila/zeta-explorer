/**
 * @module imp-3422-onset-coefficient-certification
 * @fileoverview imp-3422 -- Independently CERTIFY the two now-load-bearing imp-3383
 *   closed-form onset-signature coefficients
 *       A3 = (2 sqrt2 + 1)/(36 G0) + 11 sqrt2/1080        ~ +0.91087552,
 *       A4 = (sqrt2-1)/G0 * (-1/36 - 19 sqrt2/1080) - 7/6480 ~ -0.18494684,
 *   (G0 = 1 - arcsinh1) from TWO independent numerical routes, because imp-3383
 *   backed them with only a SINGLE eps=0.02 Richardson step (A3 err ~1.4e-5).
 *
 *   WHY re-certify. A3 and A4 are the order-3 and order-4 data of the onset
 *   signature S(eps) = phi(s0+eps) eps^2 / C = 1 + A1 eps + A2 eps^2 + A3 eps^3 +
 *   A4 eps^4 + ..., and they now feed the imp-3383 [2/1], [1/2] and [2/2] Pade
 *   approximants (A4 is what makes the [2/2] genuine). A silent transcription
 *   slip in either constant would corrupt every downstream Pade radius and pole
 *   location, so both deserve a cross-check that does not reuse the imp-3383
 *   telescope algebra.
 *
 *   ROUTE 1 -- TWO independent high-order series divisions (algebraic).
 *   The onset blocks are, to order 6,
 *       F(s0+eps) = (sqrt2/2) eps^2 [1 + f1 eps + ... ],  fk = (sqrt2 or 1)/(k+2)!,
 *       G(s0+eps) = G0 [1 + g1 eps + ... ],               gk = (-1)^{k+1}(sqrt2-1)/(G0 k!).
 *   S(eps) = (G-block)/(F-block) is computed two ALGORITHMICALLY DISTINCT ways:
 *     (1a) forward long division (recurrence c_n = (num_n - sum_k den_k c_{n-k})/den_0), and
 *     (1b) reciprocal power series of the F-block followed by a Cauchy product with the
 *          G-block (compute 1/F as a series, then multiply).
 *   Both routes agree with each other AND with the imp-3383 closed forms for A3 and
 *   A4 to ~1e-16 (double-precision floor), certifying the closed-form algebra
 *   independently of the imp-3383 hand telescope.
 *
 *   ROUTE 2 -- a CONVERGED Richardson/Neville ladder of a DIRECT phi=G/F evaluation.
 *   The imp-3383 cross-check took ONE Richardson step at eps=0.02 (2 r(eps)-r(2 eps),
 *   giving A3 to ~1.4e-5). Here the residuals
 *       r3(eps) = (S_true - 1 - A1 eps - A2 eps^2)/eps^3            ~ A3 + A4 eps + ...,
 *       r4(eps) = (S_true - 1 - A1 eps - A2 eps^2 - A3 eps^3)/eps^4 ~ A4 + A5 eps + ...,
 *   (S_true from the RAW phi = G/F, not the Taylor blocks) are evaluated on
 *   geometric eps ladders and Neville-extrapolated to eps=0, eliminating successive
 *   powers of eps. The ladder bases (0.03 for A3, 0.05 for A4) sit at the
 *   truncation-vs-cancellation balance point of the double-zero denominator. RESULT:
 *       A3 (Neville) = 0.9108755239   vs closed 0.9108755230   -> ~9 agreed digits (err ~9e-10),
 *       A4 (Neville) = -0.1849468359  vs closed -0.1849468402  -> ~7 agreed digits (err ~4e-9),
 *   both from phi itself and BOTH ~4-5 orders tighter than the imp-3383 single-step
 *   ~1.4e-5. So A3 and A4 are certified from an independent direct evaluation of the
 *   fraction, not only from the coefficient algebra.
 *
 *   VERDICT. A3 ~ +0.91087552 and A4 ~ -0.18494684 are CONFIRMED: series-division
 *   route agreement ~1e-16, direct-phi Neville-ladder agreement ~1e-9 (A3) and
 *   ~4e-9 (A4). The imp-3383 constants stand; nothing about the onset story changes.
 *
 *   HONEST CAVEAT (mandatory)
 *   -------------------------
 *   CERTIFICATION OF A DEGREE-0 SCALAR DIAGNOSTIC, RH-EQUIVALENT, NOT THE OPERATOR
 *   STEP. This re-derives two scalar onset coefficients from independent numerical
 *   routes; it neither proves nor weakens RH, adds no positivity, and touches
 *   neither imp-3066 (the off-diagonal endpoint-Hankel operator obstruction, the
 *   lone remaining gap) nor the bare pilot. Measurement/certification only, no QED.
 *   No refereed bound is changed.
 *
 *   @see imp-3383-onset-third-order-higher-pade.js (parent: closed-form A3, A4 + higher Pade)
 *   @see imp-3222-onset-decay-second-order-coefficient.js (imp-3222: A2 ~ -2.59666)
 *   @see imp-3155-onset-decay-next-order-corrections.js (imp-3155: leading A1 ~ 3.25605)
 *
 *   Ticket: imp-3422 (accuracy, medium).
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
const A1 = (SQRT2 - 1) / G0 - SQRT2 / 6;               // imp-3155 leading, ~3.25605 (>0)
const A2 = -(2 * SQRT2 - 1) / (6 * G0) - 1 / 36;       // imp-3222 second-order, ~-2.59666 (<0)

// imp-3383 closed forms under certification here.
const A3_CLOSED = (2 * SQRT2 + 1) / (36 * G0) + 11 * SQRT2 / 1080;
const A4_CLOSED = (SQRT2 - 1) / G0 * (-1 / 36 - 19 * SQRT2 / 1080) - 7 / 6480;

// -- ROUTE 1: two independent series divisions ---------------------------------
// F-block f0..f6 (leading (sqrt2/2) eps^2 factored out): f_k = (sqrt2 or 1)/(k+2)!.
const F_BLOCK = [1, SQRT2 / 6, 1 / 12, SQRT2 / 120, 1 / 360, SQRT2 / 5040, 1 / 40320];
// G-block g0..g6: g_k = (-1)^{k+1} (sqrt2-1)/(G0 * k!) for k>=1, g0=1.
const G_BLOCK = [1, (SQRT2 - 1) / G0, -(SQRT2 - 1) / (2 * G0), (SQRT2 - 1) / (6 * G0),
                 -(SQRT2 - 1) / (24 * G0), (SQRT2 - 1) / (120 * G0), -(SQRT2 - 1) / (720 * G0)];

// (1a) forward long division.
const seriesDiv = (num, den, N) => {
  const c = new Array(N + 1).fill(0);
  for (let n = 0; n <= N; n++) {
    let acc = num[n] || 0;
    for (let k = 1; k <= n; k++) acc -= (den[k] || 0) * c[n - k];
    c[n] = acc / den[0];
  }
  return c;
};
// (1b) reciprocal power series of the denominator, then Cauchy product.
const seriesReciprocal = (den, N) => {
  const r = new Array(N + 1).fill(0);
  r[0] = 1 / den[0];
  for (let n = 1; n <= N; n++) {
    let acc = 0;
    for (let k = 1; k <= n; k++) acc += (den[k] || 0) * r[n - k];
    r[n] = -acc / den[0];
  }
  return r;
};
const seriesMul = (a, b, N) => {
  const c = new Array(N + 1).fill(0);
  for (let i = 0; i <= N; i++) for (let j = 0; j <= N - i; j++) c[i + j] += (a[i] || 0) * (b[j] || 0);
  return c;
};

const S_DIV = seriesDiv(G_BLOCK, F_BLOCK, 6);                       // long division
const S_REC = seriesMul(G_BLOCK, seriesReciprocal(F_BLOCK, 6), 6);  // reciprocal * G

const A3_DIV = S_DIV[3], A4_DIV = S_DIV[4];
const A3_REC = S_REC[3], A4_REC = S_REC[4];

// -- ROUTE 2: converged Neville ladder of the DIRECT phi = G/F -----------------
const S_TRUE = (eps) => PHI(S0 + eps) * eps * eps / C;             // uses RAW phi, not blocks
const r3 = (eps) => (S_TRUE(eps) - 1 - A1 * eps - A2 * eps * eps) / (eps * eps * eps);
const r4 = (eps) =>
  (S_TRUE(eps) - 1 - A1 * eps - A2 * eps * eps - A3_CLOSED * eps * eps * eps) / (eps * eps * eps * eps);

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

// Geometric eps ladders at the truncation-vs-cancellation balance points.
const LADDER_A3 = [0.03, 0.06, 0.12, 0.24, 0.48];
const LADDER_A4 = [0.05, 0.10, 0.20, 0.40, 0.80];
const A3_NEVILLE = nevilleToZero(LADDER_A3, LADDER_A3.map(r3));
const A4_NEVILLE = nevilleToZero(LADDER_A4, LADDER_A4.map(r4));

// Number of agreed significant digits between two values.
const agreedDigits = (x, y) => {
  let d = 0;
  while (d < 16 && Math.abs(x - y) < Math.abs(x) * Math.pow(10, -d)) d++;
  return d - 1;
};

// Published numeric anchors (frozen; certified by the routes above).
const A3_ANCHOR = 0.9108755230234316;
const A4_ANCHOR = -0.18494684022590724;

export const IMP3422_ONSET_COEFFICIENT_CERTIFICATION = Object.freeze({
  id: 'imp-3422-onset-coefficient-certification',
  ticket: 'imp-3422',
  paperSourcePath: PAPER_REF,
  paperSections: ['§25', '§26', '§27'],
  parent: 'imp-3383-onset-third-order-higher-pade.js',

  summary:
    'Independently CERTIFIES the two load-bearing imp-3383 onset-signature coefficients ' +
    'A3 = (2 sqrt2+1)/(36 G0)+11 sqrt2/1080 ~ +0.91087552 and A4 = (sqrt2-1)/G0*(-1/36-19 sqrt2/1080)-7/6480 ' +
    '~ -0.18494684 (G0=1-arcsinh1) from TWO routes independent of the imp-3383 telescope: (1) two ' +
    'algorithmically distinct high-order series divisions of the G-block by the F-block (forward long ' +
    'division vs reciprocal-series-times-G) agree with each other and the closed forms to ~1e-16; ' +
    '(2) a CONVERGED Neville ladder of a DIRECT phi=G/F evaluation pins A3 to ~9 agreed digits (err ' +
    '~9e-10) and A4 to ~7 agreed digits (err ~4e-9) -- both ~4-5 orders tighter than the imp-3383 ' +
    'single eps=0.02 Richardson (~1.4e-5). Verdict: A3 and A4 stand. RH-EQUIVALENT; degree-0 scalar ' +
    'certification only; NOT the operator step.',

  route1SeriesDivision: Object.freeze({
    note: 'Two algorithmically distinct power-series divisions of the onset Taylor blocks; ' +
          'independent of the imp-3383 hand telescope for A3, A4.',
    longDivision: Object.freeze({ A3: A3_DIV, A4: A4_DIV }),
    reciprocalTimesG: Object.freeze({ A3: A3_REC, A4: A4_REC }),
    A3ClosedForm: A3_CLOSED,
    A4ClosedForm: A4_CLOSED,
    A3RouteSpread: Math.abs(A3_DIV - A3_REC),      // ~1e-16
    A4RouteSpread: Math.abs(A4_DIV - A4_REC),      // ~1e-16
    A3DivVsClosed: Math.abs(A3_DIV - A3_CLOSED),
    A4DivVsClosed: Math.abs(A4_DIV - A4_CLOSED),
  }),

  route2DirectPhiNeville: Object.freeze({
    note: 'Neville extrapolation to eps=0 of the residuals r3, r4 built from the RAW phi=G/F ' +
          '(not the Taylor blocks); a converged multi-point ladder, not the imp-3383 single step.',
    ladderA3: LADDER_A3,
    ladderA4: LADDER_A4,
    A3Neville: A3_NEVILLE,
    A4Neville: A4_NEVILLE,
    A3NevilleErr: Math.abs(A3_NEVILLE - A3_CLOSED),   // ~9e-10
    A4NevilleErr: Math.abs(A4_NEVILLE - A4_CLOSED),   // ~4e-9
    A3AgreedDigits: agreedDigits(A3_CLOSED, A3_NEVILLE),
    A4AgreedDigits: agreedDigits(A4_CLOSED, A4_NEVILLE),
    imp3383SingleStepErrA3: 1.4e-5,
    tighterThanParentByOrders: 4,
  }),

  anchors: Object.freeze({ A3: A3_ANCHOR, A4: A4_ANCHOR }),

  verdict: Object.freeze({
    A3Certified: true,
    A4Certified: true,
    statement:
      'A3 ~ +0.91087552 and A4 ~ -0.18494684 CONFIRMED by two independent routes: ' +
      'series-division agreement ~1e-16 and a converged direct-phi Neville ladder agreeing to ~9 ' +
      'digits (A3) and ~7 digits (A4), 4-5 orders tighter than the imp-3383 single-step check. ' +
      'The imp-3383 closed forms stand; the onset story is unchanged.',
  }),

  honestCaveat: Object.freeze({
    isProof: false,
    isReductionBelowRH: false,
    rhEquivalent: true,
    isCertificationOnly: true,
    operatorStepUntouched:
      'Re-derives two scalar onset coefficients from independent numerical routes; adds no ' +
      'positivity and touches neither imp-3066 (the off-diagonal endpoint-Hankel operator ' +
      'obstruction, the lone remaining gap) nor the bare pilot.',
    sota: 'No refereed bound is changed',
    didNotRerunBarePilot: true,
  }),
});

// -- Tripwire assertions ------------------------------------------------------
export const IMP3422_ONSET_COEFFICIENT_CERTIFICATION_ASSERTIONS = [
  {
    id: 'imp3422-two-series-routes-agree-with-closed-forms',
    why: 'The two algorithmically distinct series divisions (long division vs reciprocal-times-G) ' +
         'must agree with each other AND with the imp-3383 closed forms for A3 and A4 to the ' +
         'double-precision floor ~1e-13, certifying the closed-form algebra independently.',
    holds: () =>
      Math.abs(A3_DIV - A3_REC) < 1e-13 && Math.abs(A4_DIV - A4_REC) < 1e-13 &&
      Math.abs(A3_DIV - A3_CLOSED) < 1e-13 && Math.abs(A4_DIV - A4_CLOSED) < 1e-13 &&
      Math.abs(A3_REC - A3_CLOSED) < 1e-13 && Math.abs(A4_REC - A4_CLOSED) < 1e-13,
  },
  {
    id: 'imp3422-closed-forms-match-published-anchors',
    why: 'The imp-3383 closed forms must still evaluate to the published anchors A3 ~ 0.91087552 ' +
         'and A4 ~ -0.18494684 to ~1e-10; a drift would mean a constant was silently mis-edited.',
    holds: () =>
      Math.abs(A3_CLOSED - A3_ANCHOR) < 1e-10 && Math.abs(A4_CLOSED - A4_ANCHOR) < 1e-10,
  },
  {
    id: 'imp3422-direct-phi-neville-certifies-A3',
    why: 'A CONVERGED Neville ladder of the RAW phi=G/F (not the Taylor blocks) must approach A3 far ' +
         'more tightly than the imp-3383 single eps=0.02 Richardson step (~1.4e-5): here to ~1e-8, ' +
         'confirming A3 from an independent direct evaluation of the fraction.',
    holds: () => Math.abs(A3_NEVILLE - A3_CLOSED) < 1e-8,
  },
  {
    id: 'imp3422-direct-phi-neville-certifies-A4',
    why: 'The same converged Neville ladder applied to the order-4 residual must approach A4 to ~1e-7, ' +
         'well beyond a single Richardson step, certifying the bonus coefficient that makes the ' +
         'imp-3383 [2/2] Pade genuine.',
    holds: () => Math.abs(A4_NEVILLE - A4_CLOSED) < 1e-7,
  },
  {
    id: 'imp3422-neville-beats-parent-single-step',
    why: 'The whole point of re-certification: the multi-point Neville ladder must pin A3 at least ' +
         'two orders of magnitude tighter than the imp-3383 single-step ~1.4e-5, and agree to at ' +
         'least 8 significant digits.',
    holds: () =>
      Math.abs(A3_NEVILLE - A3_CLOSED) < 1.4e-5 / 100 &&
      agreedDigits(A3_CLOSED, A3_NEVILLE) >= 8,
  },
  {
    id: 'imp3422-onset-series-still-alternates',
    why: 'The certified onset series must retain the alternating sign pattern A1>0, A2<0, A3>0, A4<0; ' +
         'a broken sign would flag a transcription error in a coefficient.',
    holds: () => A1 > 0 && A2 < 0 && A3_CLOSED > 0 && A4_CLOSED < 0,
  },
  {
    id: 'imp3422-honest-rh-equivalent-certification-only',
    why: 'Mandatory honesty: this is a coefficient CERTIFICATION, RH-EQUIVALENT, not a proof, not a ' +
         'reduction below RH, leaves the imp-3066 operator step untouched, does not rerun the bare ' +
         'pilot, and no refereed bound is changed. If any of these flip the module over-claims.',
    holds: () => {
      const c = IMP3422_ONSET_COEFFICIENT_CERTIFICATION.honestCaveat;
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

for (const a of IMP3422_ONSET_COEFFICIENT_CERTIFICATION_ASSERTIONS) {
  if (!a.holds()) throw new Error(`imp-3422-onset-coefficient-certification assertion failed: ${a.id}`);
}

export default IMP3422_ONSET_COEFFICIENT_CERTIFICATION;
