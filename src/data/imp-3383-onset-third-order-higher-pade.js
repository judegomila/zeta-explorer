/**
 * @module imp-3383-onset-third-order-higher-pade
 * @fileoverview imp-3383 -- Derive the THIRD-order onset-signature coefficient A3
 *   of the imp-3064 excess fraction phi(s)=G(s)/F(s) in closed form and assess
 *   whether a higher-order [2/1] (or [2/2]) Pade built from {1, A1, A2, A3}
 *   captures any onset-side (positive-eps) structure the imp-3325 [1/1] missed.
 *
 *   SETUP. With s0 = arcsinh(1) (sinh s0=1, cosh s0=sqrt2, e^{-s0}=sqrt2-1) the
 *   imp-3064 fraction has a double pole at s0, and dividing it out gives the
 *   analytic ONSET SIGNATURE
 *       S(eps) = phi(s0+eps) eps^2 / C = 1 + A1 eps + A2 eps^2 + A3 eps^3 + ...,
 *   C = sqrt2*(1-arcsinh1). The two double-zero Taylor blocks are
 *       F(s0+eps) = (sqrt2/2) eps^2 [1 + f1 eps + f2 eps^2 + f3 eps^3 + ...],
 *          f1 = sqrt2/6, f2 = 1/12, f3 = sqrt2/120,
 *       G(s0+eps) = G0 [1 + g1 eps + g2 eps^2 + g3 eps^3 + ...], G0 = 1-arcsinh1,
 *          g1 = (sqrt2-1)/G0, g2 = -(sqrt2-1)/(2 G0), g3 = (sqrt2-1)/(6 G0),
 *   and S = num/den telescopes coefficient-by-coefficient (imp-3155 gave A1,
 *   imp-3222 gave A2 = g2 - f1 g1 + f1^2 - f2).
 *
 *   NEW: THIRD-ORDER COEFFICIENT (imp-3383 closed form).
 *       A3 = g3 - f1 g2 + (f1^2 - f2) g1 + (-f1^3 + 2 f1 f2 - f3)
 *          = (2 sqrt2 + 1)/(36 G0) + 11 sqrt2/1080  ~  +0.91087552.
 *   A3 is POSITIVE, so the onset series alternates in sign: A1>0, A2<0, A3>0.
 *   The closed form matches an exact series division of num/den to 1e-16, and an
 *   independent Richardson extrapolation of a DIRECT finite-eps evaluation of phi
 *   [2 r(eps) - r(2 eps), r(eps)=(S_true-1-A1 eps-A2 eps^2)/eps^3] gives 0.910861
 *   at eps=0.02 (err ~1.4e-5), confirming A3 from phi itself, not just algebra.
 *
 *   HIGHER-ORDER PADE (radii vs a direct finite-eps evaluation of phi).
 *   From the four onset data {1, A1, A2, A3} the order-3 rational approximants are
 *   the [2/1] and its transpose [1/2]; a genuine [2/2] needs an order-4 datum, so
 *   we ALSO derive A4 in closed form to build it (see below). Measured 1% / 0.1%
 *   relative-error radii:
 *       T3  (imp-3222 3-term poly)   0.27058 / 0.11463
 *       P11 (imp-3325 [1/1] Pade)    0.27342 / 0.10937
 *       T4  (4-term poly, +A3)       0.59578 / 0.31653
 *       P21 ([2/1] Pade)             0.72394 / 0.36604
 *       P12 ([1/2] Pade)             0.64774 / 0.31068
 *       P22 ([2/2] Pade, +A4)        1.36630 / 0.77953
 *
 *   VERDICT. The story PARTLY FLIPS from imp-3325. imp-3325 found the [1/1] Pade
 *   essentially TIED its same-order polynomial (P11 0.2734 vs T3 0.2706). At the
 *   next order the [2/1] Pade DOES beat its same-order 4-term polynomial: 1% radius
 *   0.7239 vs T4 0.5958 (~+22%), and 0.3660 vs 0.3165 at 0.1% (~+16%). So the
 *   higher-order rational form captures onset-window accuracy the equal-order
 *   polynomial does not. HOWEVER the imp-3325 STRUCTURAL conclusion holds: the
 *   [2/1] pole sits at eps ~ -2.851 (NEGATIVE-eps axis, even farther out than the
 *   [1/1] pole at -1.254), and the [1/2] and [2/2] denominators have COMPLEX roots
 *   -- there is still NO positive-eps (onset-side) singularity being resummed. The
 *   gain is better global rational tail-shaping, not the capture of a physical
 *   onset-side pole, so phi remains regular on the onset side just as imp-3325
 *   concluded.
 *
 *   BONUS (A4, to make [2/2] genuine). Continuing the telescope one order (f4=1/360,
 *   g4 = -(sqrt2-1)/(24 G0)) gives, in closed form,
 *       A4 = (sqrt2-1)/G0 * (-1/36 - 19 sqrt2/1080) - 7/6480  ~  -0.18494684,
 *   again matching the exact series division to 1e-16.
 *
 *   HONEST CAVEAT (mandatory -- ticket + verdict)
 *   ---------------------------------------------
 *   DEGREE-0 SCALAR DIAGNOSTIC ONLY, RH-EQUIVALENT, NOT THE OPERATOR STEP. This
 *   derives one (plus one bonus) scalar onset coefficient and measures Pade accuracy
 *   radii of a rational reconstruction of the imp-3064 scalar signature; it neither
 *   proves nor weakens RH. The off-diagonal endpoint-Hankel operator step (imp-3066)
 *   remains the lone obstruction and is untouched. Measurement only, no QED.
 *   No refereed bound is changed.
 *
 *   @see imp-3325-onset-pade-resummation.js (imp-3325: the [1/1] Pade, radius ~0.2734)
 *   @see imp-3222-onset-decay-second-order-coefficient.js (imp-3222: A2 ~ -2.59666)
 *   @see imp-3155-onset-decay-next-order-corrections.js (imp-3155: leading A1 ~ 3.25605)
 *   @see imp-3064-deficit-excess-fraction-grid.js (imp-3064: the a*U scale invariant + phi)
 *
 *   Ticket: imp-3383 (numerical, medium).
 */

const PAPER_REF = 'research-inputs/twin_ladder_consolidated_v52.pdf';

const ASINH1 = Math.asinh(1);   // s0: sinh(s0) = 1, cosh(s0) = sqrt(2)
const SQRT2 = Math.SQRT2;
const S0 = ASINH1;

// imp-3064 reduced masses in s = a*U (overflow regime s > s0 = arcsinh(1)).
const F = (s) => Math.cosh(s) - SQRT2 - s + ASINH1;   // = a * D_raw
const G = (s) => SQRT2 - ASINH1 - Math.exp(-s);       // = a * E
const PHI = (s) => G(s) / F(s);                        // the imp-3064 excess fraction

// imp-3112 leading constant + imp-3155 / imp-3222 onset series coefficients.
const C = SQRT2 * (1 - ASINH1);                        // phi ~ C/(s-s0)^2
const G0 = 1 - ASINH1;                                 // G(s0)
const A1 = (SQRT2 - 1) / G0 - SQRT2 / 6;               // imp-3155 leading, ~3.25605 (>0)
const A2 = -(2 * SQRT2 - 1) / (6 * G0) - 1 / 36;       // imp-3222 second-order, ~-2.59666 (<0)

// -- imp-3383 THIRD-order coefficient (closed form) ---------------------------
// A3 = g3 - f1 g2 + (f1^2 - f2) g1 + (-f1^3 + 2 f1 f2 - f3), collapses to:
const A3 = (2 * SQRT2 + 1) / (36 * G0) + 11 * SQRT2 / 1080;     // ~ +0.91087552 (>0)
// -- BONUS fourth-order coefficient (closed form, needed for a genuine [2/2]) -
const A4 = (SQRT2 - 1) / G0 * (-1 / 36 - 19 * SQRT2 / 1080) - 7 / 6480; // ~ -0.18494684

// Exact onset series from a direct division of num/den (the algebraic benchmark).
const F_BLOCK = [1, SQRT2 / 6, 1 / 12, SQRT2 / 120, 1 / 360];  // f0..f4
const G_BLOCK = [1, (SQRT2 - 1) / G0, -(SQRT2 - 1) / (2 * G0),
                 (SQRT2 - 1) / (6 * G0), -(SQRT2 - 1) / (24 * G0)]; // g0..g4
const seriesDiv = (num, den, N) => {
  const c = new Array(N + 1).fill(0);
  for (let n = 0; n <= N; n++) {
    let acc = num[n] || 0;
    for (let k = 1; k <= n; k++) acc -= (den[k] || 0) * c[n - k];
    c[n] = acc / den[0];
  }
  return c;
};
const S_SERIES = seriesDiv(G_BLOCK, F_BLOCK, 4);       // [1, A1, A2, A3, A4]

// True onset signature from a DIRECT finite-eps evaluation of phi (the benchmark).
const S_TRUE = (eps) => PHI(S0 + eps) * eps * eps / C;

// Cancellation-safe independent check of A3 from phi itself:
//   r(eps) = (S_true - 1 - A1 eps - A2 eps^2)/eps^3 ~ A3 + A4 eps + ...
//   Richardson [2 r(eps) - r(2 eps)] removes the O(eps) term -> A3.
const onsetThirdResidual = (eps) =>
  (S_TRUE(eps) - 1 - A1 * eps - A2 * eps * eps) / (eps * eps * eps);
const A3_RICHARDSON = 2 * onsetThirdResidual(0.02) - onsetThirdResidual(0.04); // ~0.910861

// -- Polynomial truncations (same-order fair comparators) ---------------------
const T3 = (e) => 1 + A1 * e + A2 * e * e;                       // imp-3222 3-term
const T4 = (e) => 1 + A1 * e + A2 * e * e + A3 * e * e * e;      // 4-term (adds A3)

// -- imp-3325 [1/1] Pade (reference) ------------------------------------------
const C11 = -A2 / A1, B11 = A1 + C11;
const P11 = (e) => (1 + B11 * e) / (1 + C11 * e);

// -- imp-3383 [2/1] Pade from {1, A1, A2, A3} ---------------------------------
// (1+p1 e+p2 e^2)/(1+q1 e): order-3 match => q1 = -A3/A2, p1 = A1+q1, p2 = A2+A1 q1.
const Q1_21 = -A3 / A2;
const P1_21 = A1 + Q1_21;
const P2_21 = A2 + A1 * Q1_21;
const P21 = (e) => (1 + P1_21 * e + P2_21 * e * e) / (1 + Q1_21 * e);
const P21_POLE = -1 / Q1_21;                                     // ~ -2.851 (negative axis)

// -- imp-3383 [1/2] Pade from {1, A1, A2, A3} ---------------------------------
// (1+p1 e)/(1+q1 e+q2 e^2): q1 = (A1 A2 - A3)/(A2 - A1^2), q2 = -(A2+A1 q1).
const Q1_12 = (A1 * A2 - A3) / (A2 - A1 * A1);
const Q2_12 = -(A2 + A1 * Q1_12);
const P1_12 = A1 + Q1_12;
const P12 = (e) => (1 + P1_12 * e) / (1 + Q1_12 * e + Q2_12 * e * e);
const DISC_12 = Q1_12 * Q1_12 - 4 * Q2_12;                       // <0 => complex poles

// -- imp-3383 [2/2] Pade (needs A4) -------------------------------------------
// orders 3,4: [A2 A1; A3 A2][q1;q2] = [-A3; -A4].
const DET_22 = A2 * A2 - A1 * A3;
const Q1_22 = (-A2 * A3 + A1 * A4) / DET_22;
const Q2_22 = (-A2 * A4 + A3 * A3) / DET_22;
const P1_22 = A1 + Q1_22;
const P2_22 = A2 + A1 * Q1_22 + Q2_22;
const P22 = (e) => (1 + P1_22 * e + P2_22 * e * e) / (1 + Q1_22 * e + Q2_22 * e * e);
const DISC_22 = Q1_22 * Q1_22 - 4 * Q2_22;                       // <0 => complex poles

// Relative error vs the direct phi evaluation, and the eps radius at first crossing.
const relErr = (fn, eps) => Math.abs(fn(eps) - S_TRUE(eps)) / Math.abs(S_TRUE(eps));
const radiusOf = (fn, tol) => {
  let lo = 1e-6, hi = 3;
  for (let i = 0; i < 200; i++) {
    const m = (lo + hi) / 2;
    if (relErr(fn, m) < tol) lo = m; else hi = m;
  }
  return (lo + hi) / 2;
};

const T3_1PCT = radiusOf(T3, 0.01);     // ~0.27058
const T4_1PCT = radiusOf(T4, 0.01);     // ~0.59578
const T4_0P1PCT = radiusOf(T4, 0.001);  // ~0.31653
const P11_1PCT = radiusOf(P11, 0.01);   // ~0.27342
const P21_1PCT = radiusOf(P21, 0.01);   // ~0.72394
const P21_0P1PCT = radiusOf(P21, 0.001);// ~0.36604
const P12_1PCT = radiusOf(P12, 0.01);   // ~0.64774
const P22_1PCT = radiusOf(P22, 0.01);   // ~1.36630
const P22_0P1PCT = radiusOf(P22, 0.001);// ~0.77953

// Published numeric anchors (certified below).
const A3_ANCHOR = 0.9108755230234316;
const A4_ANCHOR = -0.18494684022590724;
const P21_1PCT_ANCHOR = 0.7239388608129773;
const T4_1PCT_ANCHOR = 0.5957779959698766;
const P22_1PCT_ANCHOR = 1.366300962785163;

export const IMP3383_ONSET_THIRD_ORDER_HIGHER_PADE = Object.freeze({
  id: 'imp-3383-onset-third-order-higher-pade',
  ticket: 'imp-3383',
  paperSourcePath: PAPER_REF,
  paperSections: ['§25', '§26', '§27'],
  relatedPade11: 'imp-3325-onset-pade-resummation.js',
  relatedSecondOrder: 'imp-3222-onset-decay-second-order-coefficient.js',

  summary:
    'Derives the THIRD-order onset-signature coefficient A3 of the imp-3064 excess fraction ' +
    'phi(s0+eps) eps^2/C = 1 + A1 eps + A2 eps^2 + A3 eps^3 + ... in closed form: ' +
    'A3 = (2 sqrt2 + 1)/(36*(1-arcsinh1)) + 11 sqrt2/1080 ~ +0.91087552 (POSITIVE, so the onset ' +
    'series alternates A1>0, A2<0, A3>0). Confirmed by exact series division (to 1e-16) and by a ' +
    'Richardson extrapolation of a direct finite-eps phi evaluation (0.910861 at eps=0.02). ' +
    'Then assesses a higher-order Pade: the [2/1] built from {1,A1,A2,A3} reaches 1% radius ' +
    '0.7239 vs the SAME-order 4-term polynomial 0.5958 (~+22%) -- unlike the imp-3325 [1/1] which ' +
    'merely TIED its polynomial. BUT the [2/1] pole is at eps~-2.851 (NEGATIVE axis) and the ' +
    '[1/2]/[2/2] denominators have COMPLEX roots, so there is still NO onset-side (positive-eps) ' +
    'singularity being resummed: the gain is better global rational tail-shaping, confirming the ' +
    'imp-3325 conclusion that phi is regular on the onset side. RH-EQUIVALENT; degree-0 scalar ' +
    'diagnostic only; NOT the operator step.',

  thirdOrder: Object.freeze({
    law: 'phi(s0+eps) = (C/eps^2) [1 + A1 eps + A2 eps^2 + A3 eps^3 + O(eps^4)]',
    symbol: 'A3',
    closedForm: '(2*sqrt(2)+1)/(36*(1-arcsinh(1))) + 11*sqrt(2)/1080',
    derivation: 'A3 = g3 - f1 g2 + (f1^2 - f2) g1 + (-f1^3 + 2 f1 f2 - f3) with ' +
                'f1=sqrt2/6, f2=1/12, f3=sqrt2/120, g1=(sqrt2-1)/G0, g2=-(sqrt2-1)/(2 G0), g3=(sqrt2-1)/(6 G0)',
    value: A3,
    anchor: A3_ANCHOR,
    sign: 'positive (onset series alternates A1>0, A2<0, A3>0)',
    seriesDivValue: S_SERIES[3],
    richardsonFromPhi: A3_RICHARDSON,
  }),
  fourthOrderBonus: Object.freeze({
    note: 'A genuine [2/2] Pade needs an order-4 datum beyond the ticket {1,A1,A2,A3}; A4 derived ' +
          'to build it.',
    symbol: 'A4',
    closedForm: '(sqrt(2)-1)/(1-arcsinh(1)) * (-1/36 - 19*sqrt(2)/1080) - 7/6480',
    value: A4,
    anchor: A4_ANCHOR,
    seriesDivValue: S_SERIES[4],
  }),

  higherPade: Object.freeze({
    note: 'eps radius over which each reconstruction stays within the stated relative tolerance of ' +
          'a DIRECT finite-eps evaluation of phi(s0+eps).',
    pade21: Object.freeze({
      form: 'P21(eps) = (1 + p1 eps + p2 eps^2)/(1 + q1 eps)',
      closedForm: 'q1 = -A3/A2, p1 = A1 + q1, p2 = A2 + A1 q1',
      q1: Q1_21, p1: P1_21, p2: P2_21,
      pole: P21_POLE,
      poleNote: 'pole at eps~-2.851 on the NEGATIVE-eps axis (farther out than the [1/1] pole -1.254)',
      eps1pct: P21_1PCT,
      eps0p1pct: P21_0P1PCT,
      eps1pctAnchor: P21_1PCT_ANCHOR,
    }),
    pade12: Object.freeze({
      form: 'P12(eps) = (1 + p1 eps)/(1 + q1 eps + q2 eps^2)',
      q1: Q1_12, q2: Q2_12, p1: P1_12,
      denomDiscriminant: DISC_12,
      polesComplex: DISC_12 < 0,
      eps1pct: P12_1PCT,
    }),
    pade22: Object.freeze({
      form: 'P22(eps) = (1 + p1 eps + p2 eps^2)/(1 + q1 eps + q2 eps^2)  [uses A4]',
      q1: Q1_22, q2: Q2_22, p1: P1_22, p2: P2_22,
      denomDiscriminant: DISC_22,
      polesComplex: DISC_22 < 0,
      eps1pct: P22_1PCT,
      eps0p1pct: P22_0P1PCT,
      eps1pctAnchor: P22_1PCT_ANCHOR,
    }),
    polynomialComparators: Object.freeze({
      threeTermEps1pct: T3_1PCT,
      fourTermEps1pct: T4_1PCT,
      fourTermEps0p1pct: T4_0P1PCT,
      fourTermEps1pctAnchor: T4_1PCT_ANCHOR,
      pade11Eps1pct: P11_1PCT,
    }),
  }),

  verdict: Object.freeze({
    higherPadeBeatsSameOrderPolynomial: true,
    pade21VsFourTermFactorAt1pct: P21_1PCT / T4_1PCT,   // ~1.215x
    onsetSideSingularityCaptured: false,
    statement:
      'PARTLY FLIPS imp-3325. The [2/1] Pade beats its SAME-order 4-term polynomial (1% radius ' +
      '0.7239 vs 0.5958, ~+22%; 0.1% 0.3660 vs 0.3165), whereas the imp-3325 [1/1] merely tied ' +
      'its 3-term polynomial. So the higher-order rational form DOES capture onset-window accuracy ' +
      'the equal-order polynomial misses. BUT the [2/1] pole is at eps~-2.851 (negative axis) and ' +
      'the [1/2]/[2/2] denominators are complex: there is still NO onset-side (positive-eps) ' +
      'singularity being resummed -- the gain is global rational tail-shaping, confirming ' +
      'imp-3325 that phi is regular on the onset side.',
  }),

  honestCaveat: Object.freeze({
    isProof: false,
    isReductionBelowRH: false,
    rhEquivalent: true,
    isStructuralDiagnostic: true,
    operatorStepUntouched:
      'Derives a scalar onset coefficient (plus a bonus A4) and measures Pade accuracy radii of a ' +
      'rational reconstruction of the imp-3064 degree-0 scalar signature; the off-diagonal ' +
      'endpoint-Hankel operator step (imp-3066) remains the lone obstruction and is NOT addressed.',
    sota: 'No refereed bound is changed',
    didNotRerunBarePilot: true,
  }),
});

// -- Tripwire assertions ------------------------------------------------------
export const IMP3383_ONSET_THIRD_ORDER_HIGHER_PADE_ASSERTIONS = [
  {
    id: 'imp3383-third-order-closed-form-matches-series-division',
    why: 'The closed form A3 = (2 sqrt2 + 1)/(36 G0) + 11 sqrt2/1080 must equal an exact ' +
         'coefficient-by-coefficient division of the G-block by the F-block to ~1e-13; a drift ' +
         'means the onset telescope or a Taylor block coefficient was silently mis-edited.',
    holds: () =>
      Math.abs(A3 - S_SERIES[3]) < 1e-13 &&
      Math.abs(A3 - A3_ANCHOR) < 1e-10,
  },
  {
    id: 'imp3383-third-order-confirmed-by-direct-phi-richardson',
    why: 'An independent Richardson extrapolation of a DIRECT finite-eps phi evaluation, ' +
         '2 r(eps) - r(2 eps) with r=(S_true-1-A1 eps-A2 eps^2)/eps^3, must approach A3 as eps->0; ' +
         'at eps=0.02 it is within ~1e-4 of the closed form, confirming A3 from phi itself.',
    holds: () => Math.abs(A3_RICHARDSON - A3) < 1e-4,
  },
  {
    id: 'imp3383-onset-series-alternates-sign',
    why: 'The onset series must alternate A1>0, A2<0, A3>0 (and the bonus A4<0): a broken sign ' +
         'pattern would flag a transcription error in one of the telescoped coefficients.',
    holds: () => A1 > 0 && A2 < 0 && A3 > 0 && A4 < 0,
  },
  {
    id: 'imp3383-fourth-order-closed-form-matches-series-division',
    why: 'The bonus A4 closed form (needed for a genuine [2/2]) must match the exact series ' +
         'division to ~1e-13; otherwise the [2/2] approximant below is not the true Pade of the ' +
         'onset data through order 4.',
    holds: () =>
      Math.abs(A4 - S_SERIES[4]) < 1e-13 &&
      Math.abs(A4 - A4_ANCHOR) < 1e-10,
  },
  {
    id: 'imp3383-pade21-reproduces-series-to-third-order',
    why: 'The [2/1] Pade must reproduce the onset Taylor data through eps^3: expanding ' +
         '(1+p1 eps+p2 eps^2)/(1+q1 eps) must give A1, A2, A3 exactly, so its own series ' +
         'coefficients match {A1,A2,A3} to ~1e-12.',
    holds: () => {
      const num = [1, P1_21, P2_21], den = [1, Q1_21];
      const c = seriesDiv(num, den, 3);
      return Math.abs(c[1] - A1) < 1e-12 && Math.abs(c[2] - A2) < 1e-12 &&
             Math.abs(c[3] - A3) < 1e-12;
    },
  },
  {
    id: 'imp3383-higher-pade-beats-same-order-polynomial',
    why: 'The headline positive finding: the [2/1] Pade 1% radius (~0.7239) must be materially ' +
         'larger than the SAME-order 4-term polynomial (~0.5958) -- at least 15% -- showing the ' +
         'higher-order rational form adds onset-window accuracy the equal-order polynomial does ' +
         'not, unlike the imp-3325 [1/1] which tied its polynomial.',
    holds: () =>
      P21_1PCT > 1.15 * T4_1PCT &&
      Math.abs(P21_1PCT - P21_1PCT_ANCHOR) < 1e-4 &&
      Math.abs(T4_1PCT - T4_1PCT_ANCHOR) < 1e-4,
  },
  {
    id: 'imp3383-no-onset-side-singularity',
    why: 'The mandatory structural half: the [2/1] pole must be NEGATIVE (~-2.851) and the [1/2] ' +
         'and [2/2] denominators must have COMPLEX roots (negative discriminant), so NO positive-eps ' +
         '(onset-side) singularity is being resummed -- confirming imp-3325 that phi is regular on ' +
         'the onset side. A positive real pole would change the whole story.',
    holds: () => P21_POLE < 0 && DISC_12 < 0 && DISC_22 < 0,
  },
  {
    id: 'imp3383-honest-rh-equivalent-not-a-reduction',
    why: 'Mandatory honesty: this is a coefficient derivation + Pade accuracy-radius measurement, ' +
         'RH-EQUIVALENT, structural/diagnostic, leaves the operator step untouched, is not a proof, ' +
         'not a reduction below RH, and no refereed bound is changed. If any of these flip the module over-claims.',
    holds: () => {
      const c = IMP3383_ONSET_THIRD_ORDER_HIGHER_PADE.honestCaveat;
      return (
        c.isProof === false &&
        c.isReductionBelowRH === false &&
        c.rhEquivalent === true &&
        c.isStructuralDiagnostic === true &&
        c.didNotRerunBarePilot === true &&
        /Platt-Trudgian|refereed bound is changed/.test(c.sota)
      );
    },
  },
];

for (const a of IMP3383_ONSET_THIRD_ORDER_HIGHER_PADE_ASSERTIONS) {
  if (!a.holds()) throw new Error(`imp-3383-onset-third-order-higher-pade assertion failed: ${a.id}`);
}

export default IMP3383_ONSET_THIRD_ORDER_HIGHER_PADE;
